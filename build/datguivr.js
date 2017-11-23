(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createButton;

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

function createButton() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      textCreator = _ref.textCreator,
      object = _ref.object,
      _ref$propertyName = _ref.propertyName,
      propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? Layout.PANEL_HEIGHT : _ref$height,
      _ref$depth = _ref.depth,
      depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth;

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

  //  This is a real hack since we need to fit the text position to the font scaling
  //  Please fix me.
  buttonLabel.position.x = BUTTON_WIDTH * 0.5 - buttonLabel.layout.width * 0.000011 * 0.5;
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
      material.color.setHex(Colors.BUTTON_HIGHLIGHT_COLOR);
    } else {
      material.color.setHex(Colors.BUTTON_COLOR);
    }
  }

  group.interaction = interaction;
  group.hitscan = [hitscanVolume, panel];

  var grabInteraction = Grab.create({ group: group, panel: panel });

  group.updateControl = function (inputObjects) {
    interaction.update(inputObjects);
    grabInteraction.update(inputObjects);
    updateView();
  };

  group.name = function (str) {
    descriptorLabel.updateLabel(str);
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

var _graphic = require('./graphic');

var Graphic = _interopRequireWildcard(_graphic);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createCheckbox() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      textCreator = _ref.textCreator,
      object = _ref.object,
      _ref$propertyName = _ref.propertyName,
      propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName,
      _ref$initialValue = _ref.initialValue,
      initialValue = _ref$initialValue === undefined ? false : _ref$initialValue,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? Layout.PANEL_HEIGHT : _ref$height,
      _ref$depth = _ref.depth,
      depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth;

  var CHECKBOX_WIDTH = Layout.CHECKBOX_SIZE;
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
  // const outline = new THREE.BoxHelper( hitscanVolume );
  // outline.material.color.setHex( Colors.OUTLINE_COLOR );

  //  checkbox volume
  var material = new THREE.MeshBasicMaterial({ color: Colors.CHECKBOX_BG_COLOR });
  var filledVolume = new THREE.Mesh(rect.clone(), material);
  // filledVolume.scale.set( ACTIVE_SCALE, ACTIVE_SCALE,ACTIVE_SCALE );
  hitscanVolume.add(filledVolume);

  var descriptorLabel = textCreator.create(propertyName);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  var controllerID = Layout.createControllerIDBox(height, Colors.CONTROLLER_ID_CHECKBOX);
  controllerID.position.z = depth;

  var borderBox = Layout.createPanel(CHECKBOX_WIDTH + Layout.BORDER_THICKNESS, CHECKBOX_HEIGHT + Layout.BORDER_THICKNESS, CHECKBOX_DEPTH, true);
  borderBox.material.color.setHex(0x1f7ae7);
  borderBox.position.x = -Layout.BORDER_THICKNESS * 0.5 + width * 0.5;
  borderBox.position.z = depth * 0.5;

  var checkmark = Graphic.checkmark();
  checkmark.position.z = depth * 0.51;
  hitscanVolume.add(checkmark);

  panel.add(descriptorLabel, hitscanVolume, controllerID, borderBox);

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

    if (state.value) {
      checkmark.visible = true;
    } else {
      checkmark.visible = false;
    }
    if (interaction.hovering()) {
      borderBox.visible = true;
    } else {
      borderBox.visible = false;
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
    descriptorLabel.updateLabel(str);
    return group;
  };

  group.updateControl = function (inputObjects) {
    if (state.listen) {
      state.value = object[propertyName];
    }
    interaction.update(inputObjects);
    grabInteraction.update(inputObjects);
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

},{"./colors":3,"./grab":7,"./graphic":8,"./interaction":10,"./layout":11,"./sharedmaterials":14,"./textlabel":16}],3:[function(require,module,exports){
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
var HIGHLIGHT_COLOR = exports.HIGHLIGHT_COLOR = 0x43b5ea;
var INTERACTION_COLOR = exports.INTERACTION_COLOR = 0x07ABF7;
var EMISSIVE_COLOR = exports.EMISSIVE_COLOR = 0x222222;
var HIGHLIGHT_EMISSIVE_COLOR = exports.HIGHLIGHT_EMISSIVE_COLOR = 0x999999;
var OUTLINE_COLOR = exports.OUTLINE_COLOR = 0x999999;
var DEFAULT_BACK = exports.DEFAULT_BACK = 0x1a1a1a;
var DEFAULT_FOLDER_BACK = exports.DEFAULT_FOLDER_BACK = 0x101010;
var HIGHLIGHT_BACK = exports.HIGHLIGHT_BACK = 0x313131;
var INACTIVE_COLOR = exports.INACTIVE_COLOR = 0x161829;
var CONTROLLER_ID_SLIDER = exports.CONTROLLER_ID_SLIDER = 0x2fa1d6;
var CONTROLLER_ID_CHECKBOX = exports.CONTROLLER_ID_CHECKBOX = 0x806787;
var CONTROLLER_ID_BUTTON = exports.CONTROLLER_ID_BUTTON = 0xe61d5f;
var CONTROLLER_ID_TEXT = exports.CONTROLLER_ID_TEXT = 0x1ed36f;
var CONTROLLER_ID_DROPDOWN = exports.CONTROLLER_ID_DROPDOWN = 0xfff000;
var DROPDOWN_BG_COLOR = exports.DROPDOWN_BG_COLOR = 0xffffff;
var DROPDOWN_FG_COLOR = exports.DROPDOWN_FG_COLOR = 0x000000;
var CHECKBOX_BG_COLOR = exports.CHECKBOX_BG_COLOR = 0xffffff;
var BUTTON_COLOR = exports.BUTTON_COLOR = 0xe61d5f;
var BUTTON_HIGHLIGHT_COLOR = exports.BUTTON_HIGHLIGHT_COLOR = 0xfa3173;
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

var _graphic = require('./graphic');

var Graphic = _interopRequireWildcard(_graphic);

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
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      textCreator = _ref.textCreator,
      object = _ref.object,
      _ref$propertyName = _ref.propertyName,
      propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName,
      _ref$initialValue = _ref.initialValue,
      initialValue = _ref$initialValue === undefined ? false : _ref$initialValue,
      _ref$options = _ref.options,
      options = _ref$options === undefined ? [] : _ref$options,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? Layout.PANEL_HEIGHT : _ref$height,
      _ref$depth = _ref.depth,
      depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth;

  var state = {
    open: false,
    listen: false
  };

  var DROPDOWN_WIDTH = width * 0.5 - Layout.PANEL_MARGIN;
  var DROPDOWN_HEIGHT = height - Layout.PANEL_MARGIN;
  var DROPDOWN_DEPTH = depth;
  var DROPDOWN_OPTION_HEIGHT = height - Layout.PANEL_MARGIN * 1.2;
  var DROPDOWN_MARGIN = Layout.PANEL_MARGIN * -0.4;
  var MAX_DROPDOWN_LABELS_IN_COLUMN = 25;

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

  var downArrow = Graphic.downArrow();
  // Colors.colorizeGeometry( downArrow.geometry, Colors.DROPDOWN_FG_COLOR );
  downArrow.position.set(DROPDOWN_WIDTH - 0.04, 0, depth * 1.01);
  selectedLabel.add(downArrow);

  function configureLabelPosition(label, index) {
    label.position.y = -DROPDOWN_MARGIN - (index % MAX_DROPDOWN_LABELS_IN_COLUMN + 1) * DROPDOWN_OPTION_HEIGHT;
    label.position.z = depth;
    label.position.x += DROPDOWN_WIDTH * Math.floor(index / MAX_DROPDOWN_LABELS_IN_COLUMN);
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

  var borderBox = Layout.createPanel(DROPDOWN_WIDTH + Layout.BORDER_THICKNESS, DROPDOWN_HEIGHT + Layout.BORDER_THICKNESS * 0.5, DROPDOWN_DEPTH, true);
  borderBox.material.color.setHex(0x1f7ae7);
  borderBox.position.x = -Layout.BORDER_THICKNESS * 0.5 + width * 0.5;
  borderBox.position.z = depth * 0.5;

  panel.add(descriptorLabel, controllerID, selectedLabel, borderBox);

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

    if (labelInteractions[0].hovering() || state.open) {
      borderBox.visible = true;
    } else {
      borderBox.visible = false;
    }
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

  group.updateControl = function (inputObjects) {
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

},{"./colors":3,"./grab":7,"./graphic":8,"./interaction":10,"./layout":11,"./sharedmaterials":14,"./textlabel":16}],5:[function(require,module,exports){
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
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      textCreator = _ref.textCreator,
      name = _ref.name,
      guiAdd = _ref.guiAdd,
      addSlider = _ref.addSlider,
      addDropdown = _ref.addDropdown,
      addCheckbox = _ref.addCheckbox,
      addButton = _ref.addButton;

  var width = Layout.FOLDER_WIDTH;
  var depth = Layout.PANEL_DEPTH;

  var state = {
    collapsed: false,
    previousParent: undefined
  };

  var group = new THREE.Group();
  var collapseGroup = new THREE.Group();
  group.add(collapseGroup);

  //expose as public interface so that children can call it when their spacing changes
  group.performLayout = performLayout;
  group.isCollapsed = function () {
    return state.collapsed;
  };

  //  Yeah. Gross.
  var addOriginal = THREE.Group.prototype.add;

  function addImpl(o) {
    addOriginal.call(group, o);
  }

  addImpl(collapseGroup);

  var panel = Layout.createPanel(width, Layout.FOLDER_HEIGHT, depth, true);
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

  var grabber = Layout.createPanel(width, Layout.FOLDER_GRAB_HEIGHT, depth, true);
  grabber.position.y = Layout.FOLDER_HEIGHT * 0.86;
  grabber.name = 'grabber';
  addImpl(grabber);

  var grabBar = Graphic.grabBar();
  grabBar.position.set(width * 0.5, 0, depth * 1.001);
  grabber.add(grabBar);
  group.isFolder = true;
  group.hideGrabber = function () {
    grabber.visible = false;
  };

  group.add = function () {
    var newController = guiAdd.apply(undefined, arguments);

    if (newController) {
      group.addController(newController);
      return newController;
    } else {
      return new THREE.Group();
    }
  };

  group.addController = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    args.forEach(function (obj) {
      collapseGroup.add(obj);
      obj.folder = group;
      if (obj.isFolder) {
        obj.hideGrabber();
        obj.close();
      }
    });

    performLayout();
  };

  group.addFolder = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    args.forEach(function (obj) {
      collapseGroup.add(obj);
      obj.folder = group;
      obj.hideGrabber();
      obj.close();
    });

    performLayout();
  };

  function performLayout() {
    var spacingPerController = Layout.PANEL_HEIGHT + Layout.PANEL_SPACING;
    var emptyFolderSpace = Layout.FOLDER_HEIGHT + Layout.PANEL_SPACING;
    var totalSpacing = emptyFolderSpace;

    collapseGroup.children.forEach(function (c) {
      c.visible = !state.collapsed;
    });

    if (state.collapsed) {
      downArrow.rotation.z = Math.PI * 0.5;
    } else {
      downArrow.rotation.z = 0;

      var y = 0,
          lastHeight = emptyFolderSpace;

      collapseGroup.children.forEach(function (child) {
        var h = child.spacing ? child.spacing : spacingPerController;
        // how far to get from the middle of previous to middle of this child?
        // half of the height of previous plus half height of this.
        var spacing = 0.5 * (lastHeight + h);

        if (child.isFolder) {
          // For folders, the origin isn't in the middle of the entire height of the folder,
          // but just the middle of the top panel.
          var offset = 0.5 * (lastHeight + emptyFolderSpace);
          child.position.y = y - offset;
        } else {
          child.position.y = y - spacing;
        }
        // in any case, for use by the next object along we remember 'y' as the middle of the whole panel
        y -= spacing;
        lastHeight = h;
        totalSpacing += h;
        child.position.x = 0.026;
      });
    }

    group.spacing = totalSpacing;

    //make sure parent folder also performs layout.
    if (group.folder !== group) group.folder.performLayout();

    // if we're a subfolder, use a smaller panel
    var panelWidth = Layout.FOLDER_WIDTH;
    if (group.folder !== group) {
      panelWidth = Layout.SUBFOLDER_WIDTH;
    }

    Layout.resizePanel(panel, panelWidth, Layout.FOLDER_HEIGHT, depth);
  }

  function updateView() {
    if (interaction.hovering()) {
      panel.material.color.setHex(Colors.HIGHLIGHT_BACK);
    } else {
      panel.material.color.setHex(Colors.DEFAULT_FOLDER_BACK);
    }

    if (grabInteraction.hovering()) {
      grabber.material.color.setHex(Colors.HIGHLIGHT_BACK);
    } else {
      grabber.material.color.setHex(Colors.DEFAULT_FOLDER_BACK);
    }
  }

  var interaction = (0, _interaction2.default)(panel);
  interaction.events.on('onPressed', function (p) {
    state.collapsed = !state.collapsed;
    performLayout();
    p.locked = true;
  });

  group.open = function () {
    //should we consider checking if parents are open and automatically open them if not?
    if (!state.collapsed) return;
    state.collapsed = false;
    performLayout();
  };

  group.close = function () {
    if (state.collapsed) return;
    state.collapsed = true;
    performLayout();
  };

  group.folder = group;

  var grabInteraction = Grab.create({ group: group, panel: grabber });
  var paletteInteraction = Palette.create({ group: group, panel: panel });

  group.updateControl = function (inputObjects) {
    interaction.update(inputObjects);
    grabInteraction.update(inputObjects);
    paletteInteraction.update(inputObjects);

    updateView();
  };

  group.name = function (str) {
    descriptorLabel.updateLabel(str);
    return group;
  };

  group.hitscan = [panel, grabber];

  group.beingMoved = false;

  group.addSlider = function () {
    var controller = addSlider.apply(undefined, arguments);
    if (controller) {
      group.addController(controller);
      return controller;
    } else {
      return new THREE.Group();
    }
  };
  group.addDropdown = function () {
    var controller = addDropdown.apply(undefined, arguments);
    if (controller) {
      group.addController(controller);
      return controller;
    } else {
      return new THREE.Group();
    }
  };
  group.addCheckbox = function () {
    var controller = addCheckbox.apply(undefined, arguments);
    if (controller) {
      group.addController(controller);
      return controller;
    } else {
      return new THREE.Group();
    }
  };
  group.addButton = function () {
    var controller = addButton.apply(undefined, arguments);
    if (controller) {
      group.addController(controller);
      return controller;
    } else {
      return new THREE.Group();
    }
  };

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
  image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAEACAMAAADyTj5VAAAAjVBMVEVHcEz///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+umAc7AAAAL3RSTlMAWnJfbnqDWGR4a2ZcYnBRalRLgH6ETnR8UGh2RoZDXlaHSYo8QHU2LyYcFAwFmmUR1OIAAJFhSURBVHhetL2JWmu7jjUKIQkkQLqZvgMCZO2zT/33/R/vSkNDkj2TrOarVd5V6xDP3pJlWdKQ7qaPb6+vrw8vj+PZ/vvrxz///Pj63s/G7/cP2n0/XZ6Op6X8fJHfaG/3j9q5X/LKt/t3v/QfufQk/Xoubolz/Dq5LH7y1nLVl9xeH4b28jidncZy/ZM0P+Wff/7zn//8++9//sG5Uztav3H1inJIXkle8Qvn3+OROP2oj5OPmz7ev+m5PDDFyXan/UwewBd8124ZDn2o3eTBBmCKAzZQfjY75WX//Y+/Kj6Ln77//uF3r24vHyfP5ae9cRRsaH5I/48veQqP5Kh9X9z86wvn+wjhZfmYjTzmyBflSOBz5V1lXO8eH54mw8nzK8dTHsnPepbupwft1Vu+PslvaZPts73FaWxXbp/iUjx/I9SUc3HLqZ2DhntVP0ERfN79q918+/T2uFlO8ew8BW+qw4Rz5RZbOTp5fsJj+dTqFZ/llTAquLc+Em8jA/4dA/S89c95khEh8ZTYm8e3p+0QV9xP5f5fQjU8VLueJ3ite9CT9Lezn5ID+Kp8tB3EmOfdefsl580PY1WMDkaBNFXqH5VjeSSG5HjRdTzq+eAMjP+EL8vHyCSzFzW6LE96Prjv7uVpMup0uluMp7IpuWXb7XQ6wycZttkUb93toI269rHLKa8cbp0UnM2vTxM9t/v88IhzeN3k6SV/4tbyZse9fd4Qfd2JvO7m8eG5W57yDRbArMK5uDveGCT9Qb7IV+zaGM72xxPuPcLpSs8j59nzpBufM3x24nHavtoDhnIP6SXV8N64aDQkPTlRtnb2s99E39RfdRifrrwknbw7bo/JhXlLwelPmciT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";
  return image;
}

function fnt() {
  return "info face=\"Roboto\" size=192 bold=0 italic=0 charset=\"\" unicode=1 stretchH=100 smooth=1 aa=1 padding=24,24,24,24 spacing=12,12 outline=0\ncommon lineHeight=192 base=152 scaleW=3072 scaleH=1536 pages=1 packed=0 alphaChnl=0 redChnl=4 greenChnl=4 blueChnl=4\npage id=0 file=\"roboto_0.png\"\nchars count=194\nchar id=0    x=636   y=1438  width=48    height=49    xoffset=-24   yoffset=167   xadvance=0     page=0  chnl=15\nchar id=2    x=576   y=1438  width=48    height=49    xoffset=-24   yoffset=167   xadvance=0     page=0  chnl=15\nchar id=13   x=450   y=1439  width=51    height=49    xoffset=-25   yoffset=167   xadvance=40    page=0  chnl=15\nchar id=32   x=2987  y=1242  width=51    height=49    xoffset=-25   yoffset=167   xadvance=40    page=0  chnl=15\nchar id=33   x=1714  y=769   width=66    height=163   xoffset=-12   yoffset=14    xadvance=41    page=0  chnl=15\nchar id=34   x=1999  y=1263  width=81    height=87    xoffset=-14   yoffset=8     xadvance=51    page=0  chnl=15\nchar id=35   x=1214  y=951   width=136   height=162   xoffset=-15   yoffset=14    xadvance=99    page=0  chnl=15\nchar id=36   x=1610  y=0     width=122   height=196   xoffset=-16   yoffset=-4    xadvance=90    page=0  chnl=15\nchar id=37   x=1341  y=595   width=152   height=165   xoffset=-17   yoffset=13    xadvance=117   page=0  chnl=15\nchar id=38   x=1658  y=592   width=141   height=165   xoffset=-17   yoffset=13    xadvance=99    page=0  chnl=15\nchar id=39   x=2092  y=1263  width=62    height=85    xoffset=-17   yoffset=8     xadvance=28    page=0  chnl=15\nchar id=40   x=103   y=0     width=90    height=213   xoffset=-14   yoffset=0     xadvance=55    page=0  chnl=15\nchar id=41   x=0     y=0     width=91    height=213   xoffset=-22   yoffset=0     xadvance=56    page=0  chnl=15\nchar id=42   x=664   y=1294  width=114   height=114   xoffset=-23   yoffset=14    xadvance=69    page=0  chnl=15\nchar id=43   x=0     y=1317  width=128   height=129   xoffset=-19   yoffset=34    xadvance=91    page=0  chnl=15\nchar id=44   x=1916  y=1264  width=71    height=88    xoffset=-22   yoffset=111   xadvance=31    page=0  chnl=15\nchar id=45   x=233   y=1457  width=88    height=60    xoffset=-22   yoffset=74    xadvance=44    page=0  chnl=15\nchar id=46   x=2828  y=1245  width=68    height=65    xoffset=-14   yoffset=112   xadvance=42    page=0  chnl=15\nchar id=47   x=0     y=429   width=109   height=172   xoffset=-23   yoffset=14    xadvance=66    page=0  chnl=15\nchar id=48   x=2392  y=583   width=122   height=165   xoffset=-16   yoffset=13    xadvance=90    page=0  chnl=15\nchar id=49   x=112   y=1143  width=93    height=162   xoffset=-11   yoffset=14    xadvance=90    page=0  chnl=15\nchar id=50   x=1443  y=772   width=126   height=163   xoffset=-17   yoffset=13    xadvance=90    page=0  chnl=15\nchar id=51   x=2660  y=575   width=121   height=165   xoffset=-17   yoffset=13    xadvance=90    page=0  chnl=15\nchar id=52   x=1794  y=943   width=132   height=162   xoffset=-21   yoffset=14    xadvance=90    page=0  chnl=15\nchar id=53   x=539   y=779   width=121   height=164   xoffset=-13   yoffset=14    xadvance=90    page=0  chnl=15\nchar id=54   x=406   y=779   width=121   height=164   xoffset=-14   yoffset=14    xadvance=90    page=0  chnl=15\nchar id=55   x=2082  y=941   width=127   height=162   xoffset=-19   yoffset=14    xadvance=90    page=0  chnl=15\nchar id=56   x=2526  y=581   width=122   height=165   xoffset=-16   yoffset=13    xadvance=90    page=0  chnl=15\nchar id=57   x=1581  y=771   width=121   height=163   xoffset=-17   yoffset=13    xadvance=90    page=0  chnl=15\nchar id=58   x=2383  y=1113  width=67    height=134   xoffset=-14   yoffset=43    xadvance=39    page=0  chnl=15\nchar id=59   x=372   y=1140  width=73    height=156   xoffset=-22   yoffset=43    xadvance=34    page=0  chnl=15\nchar id=60   x=539   y=1307  width=113   height=119   xoffset=-19   yoffset=42    xadvance=81    page=0  chnl=15\nchar id=61   x=1688  y=1269  width=115   height=93    xoffset=-13   yoffset=51    xadvance=88    page=0  chnl=15\nchar id=62   x=411   y=1308  width=116   height=119   xoffset=-14   yoffset=42    xadvance=84    page=0  chnl=15\nchar id=63   x=800   y=779   width=113   height=164   xoffset=-19   yoffset=13    xadvance=76    page=0  chnl=15\nchar id=64   x=1421  y=0     width=177   height=196   xoffset=-16   yoffset=16    xadvance=144   page=0  chnl=15\nchar id=65   x=2708  y=752   width=150   height=162   xoffset=-23   yoffset=14    xadvance=104   page=0  chnl=15\nchar id=66   x=2221  y=939   width=127   height=162   xoffset=-12   yoffset=14    xadvance=100   page=0  chnl=15\nchar id=67   x=1811  y=592   width=137   height=165   xoffset=-15   yoffset=13    xadvance=104   page=0  chnl=15\nchar id=68   x=1650  y=946   width=132   height=162   xoffset=-12   yoffset=14    xadvance=105   page=0  chnl=15\nchar id=69   x=2496  y=934   width=122   height=162   xoffset=-12   yoffset=14    xadvance=91    page=0  chnl=15\nchar id=70   x=2630  y=932   width=120   height=162   xoffset=-12   yoffset=14    xadvance=88    page=0  chnl=15\nchar id=71   x=1960  y=590   width=137   height=165   xoffset=-15   yoffset=13    xadvance=109   page=0  chnl=15\nchar id=72   x=916   y=955   width=137   height=162   xoffset=-12   yoffset=14    xadvance=114   page=0  chnl=15\nchar id=73   x=296   y=1142  width=64    height=162   xoffset=-10   yoffset=14    xadvance=44    page=0  chnl=15\nchar id=74   x=272   y=790   width=122   height=164   xoffset=-21   yoffset=14    xadvance=88    page=0  chnl=15\nchar id=75   x=767   y=955   width=137   height=162   xoffset=-12   yoffset=14    xadvance=100   page=0  chnl=15\nchar id=76   x=2762  y=926   width=119   height=162   xoffset=-12   yoffset=14    xadvance=86    page=0  chnl=15\nchar id=77   x=2197  y=765   width=163   height=162   xoffset=-12   yoffset=14    xadvance=140   page=0  chnl=15\nchar id=78   x=1065  y=952   width=137   height=162   xoffset=-12   yoffset=14    xadvance=114   page=0  chnl=15\nchar id=79   x=1505  y=594   width=141   height=165   xoffset=-16   yoffset=13    xadvance=110   page=0  chnl=15\nchar id=80   x=1938  y=943   width=132   height=162   xoffset=-12   yoffset=14    xadvance=101   page=0  chnl=15\nchar id=81   x=2222  y=207   width=141   height=183   xoffset=-16   yoffset=13    xadvance=110   page=0  chnl=15\nchar id=82   x=1362  y=949   width=132   height=162   xoffset=-11   yoffset=14    xadvance=99    page=0  chnl=15\nchar id=83   x=2109  y=588   width=132   height=165   xoffset=-18   yoffset=13    xadvance=95    page=0  chnl=15\nchar id=84   x=617   y=955   width=138   height=162   xoffset=-21   yoffset=14    xadvance=95    page=0  chnl=15\nchar id=85   x=128   y=792   width=132   height=164   xoffset=-14   yoffset=14    xadvance=104   page=0  chnl=15\nchar id=86   x=2870  y=749   width=147   height=162   xoffset=-22   yoffset=14    xadvance=102   page=0  chnl=15\nchar id=87   x=2002  y=767   width=183   height=162   xoffset=-20   yoffset=14    xadvance=142   page=0  chnl=15\nchar id=88   x=312   y=966   width=141   height=162   xoffset=-20   yoffset=14    xadvance=100   page=0  chnl=15\nchar id=89   x=157   y=968   width=143   height=162   xoffset=-24   yoffset=14    xadvance=96    page=0  chnl=15\nchar id=90   x=1506  y=947   width=132   height=162   xoffset=-18   yoffset=14    xadvance=96    page=0  chnl=15\nchar id=91   x=658   y=0     width=79    height=202   xoffset=-13   yoffset=-2    xadvance=42    page=0  chnl=15\nchar id=92   x=2945  y=204   width=111   height=172   xoffset=-22   yoffset=14    xadvance=66    page=0  chnl=15\nchar id=93   x=567   y=0     width=79    height=202   xoffset=-24   yoffset=-2    xadvance=42    page=0  chnl=15\nchar id=94   x=1570  y=1271  width=106   height=105   xoffset=-20   yoffset=14    xadvance=67    page=0  chnl=15\nchar id=95   x=0     y=1458  width=121   height=60    xoffset=-24   yoffset=128   xadvance=72    page=0  chnl=15\nchar id=96   x=2622  y=1258  width=82    height=71    xoffset=-20   yoffset=8     xadvance=49    page=0  chnl=15\nchar id=97   x=1585  y=1121  width=119   height=136   xoffset=-16   yoffset=42    xadvance=87    page=0  chnl=15\nchar id=98   x=677   y=418   width=121   height=170   xoffset=-14   yoffset=8     xadvance=90    page=0  chnl=15\nchar id=99   x=1453  y=1123  width=120   height=136   xoffset=-17   yoffset=42    xadvance=84    page=0  chnl=15\nchar id=100  x=1209  y=413   width=120   height=170   xoffset=-17   yoffset=8     xadvance=90    page=0  chnl=15\nchar id=101  x=1320  y=1125  width=121   height=136   xoffset=-17   yoffset=42    xadvance=85    page=0  chnl=15\nchar id=102  x=1866  y=408   width=101   height=170   xoffset=-20   yoffset=6     xadvance=56    page=0  chnl=15\nchar id=103  x=134   y=612   width=121   height=167   xoffset=-17   yoffset=42    xadvance=90    page=0  chnl=15\nchar id=104  x=2627  y=395   width=116   height=168   xoffset=-14   yoffset=8     xadvance=88    page=0  chnl=15\nchar id=105  x=1050  y=776   width=67    height=164   xoffset=-14   yoffset=12    xadvance=39    page=0  chnl=15\nchar id=106  x=1327  y=0     width=82    height=198   xoffset=-30   yoffset=12    xadvance=38    page=0  chnl=15\nchar id=107  x=2495  y=401   width=120   height=168   xoffset=-14   yoffset=8     xadvance=81    page=0  chnl=15\nchar id=108  x=2755  y=392   width=64    height=168   xoffset=-13   yoffset=8     xadvance=39    page=0  chnl=15\nchar id=109  x=1973  y=1117  width=168   height=134   xoffset=-14   yoffset=42    xadvance=140   page=0  chnl=15\nchar id=110  x=2153  y=1115  width=116   height=134   xoffset=-14   yoffset=42    xadvance=88    page=0  chnl=15\nchar id=111  x=1181  y=1126  width=127   height=136   xoffset=-18   yoffset=42    xadvance=91    page=0  chnl=15\nchar id=112  x=267   y=611   width=121   height=167   xoffset=-14   yoffset=42    xadvance=90    page=0  chnl=15\nchar id=113  x=400   y=600   width=120   height=167   xoffset=-17   yoffset=42    xadvance=91    page=0  chnl=15\nchar id=114  x=2281  y=1113  width=90    height=134   xoffset=-14   yoffset=42    xadvance=54    page=0  chnl=15\nchar id=115  x=1716  y=1120  width=117   height=136   xoffset=-17   yoffset=42    xadvance=83    page=0  chnl=15\nchar id=116  x=457   y=1140  width=95    height=155   xoffset=-24   yoffset=23    xadvance=52    page=0  chnl=15\nchar id=117  x=1845  y=1117  width=116   height=135   xoffset=-14   yoffset=43    xadvance=88    page=0  chnl=15\nchar id=118  x=2772  y=1100  width=122   height=133   xoffset=-22   yoffset=43    xadvance=78    page=0  chnl=15\nchar id=119  x=2462  y=1113  width=163   height=133   xoffset=-22   yoffset=43    xadvance=120   page=0  chnl=15\nchar id=120  x=2637  y=1106  width=123   height=133   xoffset=-22   yoffset=43    xadvance=79    page=0  chnl=15\nchar id=121  x=0     y=613   width=122   height=167   xoffset=-23   yoffset=43    xadvance=76    page=0  chnl=15\nchar id=122  x=2906  y=1097  width=117   height=133   xoffset=-18   yoffset=43    xadvance=79    page=0  chnl=15\nchar id=123  x=458   y=0     width=97    height=202   xoffset=-20   yoffset=3     xadvance=54    page=0  chnl=15\nchar id=124  x=2451  y=206   width=61    height=183   xoffset=-11   yoffset=14    xadvance=39    page=0  chnl=15\nchar id=125  x=349   y=0     width=97    height=202   xoffset=-23   yoffset=3     xadvance=54    page=0  chnl=15\nchar id=126  x=2378  y=1259  width=138   height=79    xoffset=-14   yoffset=65    xadvance=109   page=0  chnl=15\nchar id=160  x=513   y=1439  width=51    height=49    xoffset=-25   yoffset=167   xadvance=40    page=0  chnl=15\nchar id=161  x=217   y=1142  width=67    height=162   xoffset=-14   yoffset=42    xadvance=39    page=0  chnl=15\nchar id=162  x=1341  y=413   width=120   height=170   xoffset=-16   yoffset=25    xadvance=88    page=0  chnl=15\nchar id=163  x=1300  y=774   width=131   height=163   xoffset=-18   yoffset=13    xadvance=93    page=0  chnl=15\nchar id=164  x=702   y=1129  width=149   height=149   xoffset=-17   yoffset=30    xadvance=114   page=0  chnl=15\nchar id=165  x=465   y=955   width=140   height=162   xoffset=-22   yoffset=14    xadvance=97    page=0  chnl=15\nchar id=166  x=2375  y=206   width=64    height=183   xoffset=-13   yoffset=14    xadvance=38    page=0  chnl=15\nchar id=167  x=205   y=0     width=132   height=202   xoffset=-18   yoffset=13    xadvance=98    page=0  chnl=15\nchar id=168  x=2716  y=1251  width=100   height=65    xoffset=-17   yoffset=12    xadvance=67    page=0  chnl=15\nchar id=169  x=995   y=599   width=161   height=165   xoffset=-18   yoffset=13    xadvance=126   page=0  chnl=15\nchar id=170  x=1368  y=1273  width=99    height=109   xoffset=-13   yoffset=13    xadvance=71    page=0  chnl=15\nchar id=171  x=1131  y=1277  width=110   height=110   xoffset=-17   yoffset=54    xadvance=75    page=0  chnl=15\nchar id=172  x=2251  y=1261  width=115   height=81    xoffset=-15   yoffset=65    xadvance=89    page=0  chnl=15\nchar id=173  x=133   y=1458  width=88    height=60    xoffset=-22   yoffset=74    xadvance=44    page=0  chnl=15\nchar id=174  x=1168  y=597   width=161   height=165   xoffset=-18   yoffset=13    xadvance=126   page=0  chnl=15\nchar id=175  x=333   y=1448  width=105   height=59    xoffset=-15   yoffset=14    xadvance=73    page=0  chnl=15\nchar id=176  x=1815  y=1268  width=89    height=88    xoffset=-15   yoffset=13    xadvance=60    page=0  chnl=15\nchar id=177  x=863   y=1129  width=121   height=147   xoffset=-17   yoffset=29    xadvance=85    page=0  chnl=15\nchar id=178  x=899   y=1288  width=97    height=111   xoffset=-19   yoffset=13    xadvance=59    page=0  chnl=15\nchar id=179  x=790   y=1290  width=97    height=112   xoffset=-20   yoffset=13    xadvance=59    page=0  chnl=15\nchar id=180  x=2528  y=1258  width=82    height=71    xoffset=-15   yoffset=8     xadvance=50    page=0  chnl=15\nchar id=181  x=866   y=599   width=117   height=166   xoffset=-13   yoffset=43    xadvance=91    page=0  chnl=15\nchar id=182  x=2893  y=923   width=110   height=162   xoffset=-20   yoffset=14    xadvance=78    page=0  chnl=15\nchar id=183  x=2908  y=1242  width=67    height=65    xoffset=-13   yoffset=62    xadvance=42    page=0  chnl=15\nchar id=184  x=2166  y=1261  width=73    height=82    xoffset=-15   yoffset=128   xadvance=40    page=0  chnl=15\nchar id=185  x=1479  y=1271  width=79    height=109   xoffset=-15   yoffset=14    xadvance=59    page=0  chnl=15\nchar id=186  x=1253  y=1274  width=103   height=109   xoffset=-15   yoffset=13    xadvance=73    page=0  chnl=15\nchar id=187  x=1008  y=1277  width=111   height=110   xoffset=-17   yoffset=54    xadvance=75    page=0  chnl=15\nchar id=188  x=2542  y=758   width=154   height=162   xoffset=-18   yoffset=14    xadvance=117   page=0  chnl=15\nchar id=189  x=2372  y=760   width=158   height=162   xoffset=-18   yoffset=14    xadvance=124   page=0  chnl=15\nchar id=190  x=1129  y=776   width=159   height=163   xoffset=-16   yoffset=13    xadvance=124   page=0  chnl=15\nchar id=191  x=925   y=777   width=113   height=164   xoffset=-19   yoffset=42    xadvance=76    page=0  chnl=15\nchar id=192  x=162   y=225   width=150   height=192   xoffset=-23   yoffset=-16   xadvance=104   page=0  chnl=15\nchar id=193  x=324   y=214   width=150   height=192   xoffset=-23   yoffset=-16   xadvance=104   page=0  chnl=15\nchar id=194  x=0     y=225   width=150   height=192   xoffset=-23   yoffset=-16   xadvance=104   page=0  chnl=15\nchar id=195  x=1359  y=210   width=150   height=190   xoffset=-23   yoffset=-14   xadvance=104   page=0  chnl=15\nchar id=196  x=1814  y=208   width=150   height=188   xoffset=-23   yoffset=-12   xadvance=104   page=0  chnl=15\nchar id=197  x=1016  y=0     width=150   height=199   xoffset=-23   yoffset=-23   xadvance=104   page=0  chnl=15\nchar id=198  x=1792  y=769   width=198   height=162   xoffset=-26   yoffset=14    xadvance=150   page=0  chnl=15\nchar id=199  x=1178  y=0     width=137   height=198   xoffset=-15   yoffset=13    xadvance=104   page=0  chnl=15\nchar id=200  x=2922  y=0     width=122   height=192   xoffset=-12   yoffset=-16   xadvance=91    page=0  chnl=15\nchar id=201  x=641   y=214   width=122   height=192   xoffset=-12   yoffset=-16   xadvance=91    page=0  chnl=15\nchar id=202  x=775   y=213   width=122   height=192   xoffset=-12   yoffset=-16   xadvance=91    page=0  chnl=15\nchar id=203  x=1976  y=207   width=122   height=188   xoffset=-12   yoffset=-12   xadvance=91    page=0  chnl=15\nchar id=204  x=1018  y=211   width=82    height=192   xoffset=-27   yoffset=-16   xadvance=44    page=0  chnl=15\nchar id=205  x=1112  y=211   width=82    height=192   xoffset=-11   yoffset=-16   xadvance=44    page=0  chnl=15\nchar id=206  x=909   y=213   width=97    height=192   xoffset=-27   yoffset=-16   xadvance=44    page=0  chnl=15\nchar id=207  x=2110  y=207   width=100   height=188   xoffset=-28   yoffset=-12   xadvance=44    page=0  chnl=15\nchar id=208  x=0     y=969   width=145   height=162   xoffset=-22   yoffset=14    xadvance=107   page=0  chnl=15\nchar id=209  x=1521  y=208   width=137   height=190   xoffset=-12   yoffset=-14   xadvance=114   page=0  chnl=15\nchar id=210  x=2184  y=0     width=141   height=195   xoffset=-16   yoffset=-17   xadvance=110   page=0  chnl=15\nchar id=211  x=2031  y=0     width=141   height=195   xoffset=-16   yoffset=-17   xadvance=110   page=0  chnl=15\nchar id=212  x=1878  y=0     width=141   height=195   xoffset=-16   yoffset=-17   xadvance=110   page=0  chnl=15\nchar id=213  x=2769  y=0     width=141   height=193   xoffset=-16   yoffset=-15   xadvance=110   page=0  chnl=15\nchar id=214  x=1206  y=210   width=141   height=191   xoffset=-16   yoffset=-13   xadvance=110   page=0  chnl=15\nchar id=215  x=279   y=1316  width=120   height=120   xoffset=-18   yoffset=40    xadvance=85    page=0  chnl=15\nchar id=216  x=2655  y=206   width=143   height=174   xoffset=-16   yoffset=10    xadvance=110   page=0  chnl=15\nchar id=217  x=2625  y=0     width=132   height=194   xoffset=-14   yoffset=-16   xadvance=104   page=0  chnl=15\nchar id=218  x=2481  y=0     width=132   height=194   xoffset=-14   yoffset=-16   xadvance=104   page=0  chnl=15\nchar id=219  x=2337  y=0     width=132   height=194   xoffset=-14   yoffset=-16   xadvance=104   page=0  chnl=15\nchar id=220  x=1670  y=208   width=132   height=190   xoffset=-14   yoffset=-12   xadvance=104   page=0  chnl=15\nchar id=221  x=486   y=214   width=143   height=192   xoffset=-24   yoffset=-16   xadvance=96    page=0  chnl=15\nchar id=222  x=2360  y=939   width=124   height=162   xoffset=-12   yoffset=14    xadvance=95    page=0  chnl=15\nchar id=223  x=121   y=429   width=127   height=171   xoffset=-14   yoffset=7     xadvance=95    page=0  chnl=15\nchar id=224  x=1604  y=410   width=119   height=170   xoffset=-16   yoffset=8     xadvance=87    page=0  chnl=15\nchar id=225  x=1473  y=412   width=119   height=170   xoffset=-16   yoffset=8     xadvance=87    page=0  chnl=15\nchar id=226  x=1735  y=410   width=119   height=170   xoffset=-16   yoffset=8     xadvance=87    page=0  chnl=15\nchar id=227  x=532   y=600   width=119   height=167   xoffset=-16   yoffset=11    xadvance=87    page=0  chnl=15\nchar id=228  x=2926  y=569   width=119   height=165   xoffset=-16   yoffset=13    xadvance=87    page=0  chnl=15\nchar id=229  x=2524  y=206   width=119   height=177   xoffset=-16   yoffset=1     xadvance=87    page=0  chnl=15\nchar id=230  x=996   y=1129  width=173   height=136   xoffset=-19   yoffset=42    xadvance=135   page=0  chnl=15\nchar id=231  x=1979  y=407   width=120   height=169   xoffset=-17   yoffset=42    xadvance=84    page=0  chnl=15\nchar id=232  x=1076  y=415   width=121   height=170   xoffset=-17   yoffset=8     xadvance=85    page=0  chnl=15\nchar id=233  x=943   y=417   width=121   height=170   xoffset=-17   yoffset=8     xadvance=85    page=0  chnl=15\nchar id=234  x=810   y=417   width=121   height=170   xoffset=-17   yoffset=8     xadvance=85    page=0  chnl=15\nchar id=235  x=2793  y=572   width=121   height=165   xoffset=-17   yoffset=13    xadvance=85    page=0  chnl=15\nchar id=236  x=772   y=600   width=82    height=167   xoffset=-29   yoffset=9     xadvance=40    page=0  chnl=15\nchar id=237  x=2970  y=388   width=82    height=167   xoffset=-13   yoffset=9     xadvance=40    page=0  chnl=15\nchar id=238  x=663   y=600   width=97    height=167   xoffset=-29   yoffset=9     xadvance=40    page=0  chnl=15\nchar id=239  x=0     y=1143  width=100   height=162   xoffset=-30   yoffset=14    xadvance=40    page=0  chnl=15\nchar id=240  x=2810  y=205   width=123   height=173   xoffset=-15   yoffset=5     xadvance=94    page=0  chnl=15\nchar id=241  x=0     y=792   width=116   height=165   xoffset=-14   yoffset=11    xadvance=88    page=0  chnl=15\nchar id=242  x=260   y=429   width=127   height=170   xoffset=-18   yoffset=8     xadvance=91    page=0  chnl=15\nchar id=243  x=538   y=418   width=127   height=170   xoffset=-18   yoffset=8     xadvance=91    page=0  chnl=15\nchar id=244  x=399   y=418   width=127   height=170   xoffset=-18   yoffset=8     xadvance=91    page=0  chnl=15\nchar id=245  x=2831  y=390   width=127   height=167   xoffset=-18   yoffset=11    xadvance=91    page=0  chnl=15\nchar id=246  x=2253  y=583   width=127   height=165   xoffset=-18   yoffset=13    xadvance=91    page=0  chnl=15\nchar id=247  x=140   y=1317  width=127   height=128   xoffset=-19   yoffset=34    xadvance=91    page=0  chnl=15\nchar id=248  x=564   y=1129  width=126   height=153   xoffset=-17   yoffset=34    xadvance=91    page=0  chnl=15\nchar id=249  x=2111  y=407   width=116   height=169   xoffset=-14   yoffset=9     xadvance=88    page=0  chnl=15\nchar id=250  x=2239  y=402   width=116   height=169   xoffset=-14   yoffset=9     xadvance=88    page=0  chnl=15\nchar id=251  x=2367  y=402   width=116   height=169   xoffset=-14   yoffset=9     xadvance=88    page=0  chnl=15\nchar id=252  x=672   y=779   width=116   height=164   xoffset=-14   yoffset=14    xadvance=88    page=0  chnl=15\nchar id=253  x=749   y=0     width=122   height=201   xoffset=-23   yoffset=9     xadvance=76    page=0  chnl=15\nchar id=254  x=883   y=0     width=121   height=201   xoffset=-13   yoffset=8     xadvance=92    page=0  chnl=15\nchar id=255  x=1744  y=0     width=122   height=196   xoffset=-23   yoffset=14    xadvance=76    page=0  chnl=15\nkernings count=1686\nkerning first=32  second=84  amount=-3\nkerning first=40  second=86  amount=2\nkerning first=40  second=87  amount=1\nkerning first=40  second=89  amount=2\nkerning first=40  second=221 amount=2\nkerning first=70  second=44  amount=-18\nkerning first=70  second=46  amount=-18\nkerning first=70  second=65  amount=-13\nkerning first=70  second=74  amount=-21\nkerning first=70  second=84  amount=2\nkerning first=70  second=97  amount=-3\nkerning first=70  second=99  amount=-2\nkerning first=70  second=100 amount=-2\nkerning first=70  second=101 amount=-2\nkerning first=70  second=103 amount=-2\nkerning first=70  second=111 amount=-2\nkerning first=70  second=113 amount=-2\nkerning first=70  second=117 amount=-2\nkerning first=70  second=118 amount=-2\nkerning first=70  second=121 amount=-2\nkerning first=70  second=192 amount=-13\nkerning first=70  second=193 amount=-13\nkerning first=70  second=194 amount=-13\nkerning first=70  second=195 amount=-13\nkerning first=70  second=196 amount=-13\nkerning first=70  second=197 amount=-13\nkerning first=70  second=224 amount=-3\nkerning first=70  second=225 amount=-3\nkerning first=70  second=226 amount=-3\nkerning first=70  second=227 amount=-3\nkerning first=70  second=228 amount=-3\nkerning first=70  second=229 amount=-3\nkerning first=70  second=231 amount=-2\nkerning first=70  second=232 amount=-2\nkerning first=70  second=233 amount=-2\nkerning first=70  second=234 amount=-2\nkerning first=70  second=235 amount=-2\nkerning first=70  second=242 amount=-2\nkerning first=70  second=243 amount=-2\nkerning first=70  second=244 amount=-2\nkerning first=70  second=245 amount=-2\nkerning first=70  second=246 amount=-2\nkerning first=70  second=249 amount=-2\nkerning first=70  second=250 amount=-2\nkerning first=70  second=251 amount=-2\nkerning first=70  second=252 amount=-2\nkerning first=70  second=253 amount=-2\nkerning first=70  second=255 amount=-2\nkerning first=81  second=84  amount=-3\nkerning first=81  second=86  amount=-2\nkerning first=81  second=87  amount=-2\nkerning first=81  second=89  amount=-3\nkerning first=81  second=221 amount=-3\nkerning first=82  second=84  amount=-6\nkerning first=82  second=86  amount=-1\nkerning first=82  second=89  amount=-4\nkerning first=82  second=221 amount=-4\nkerning first=91  second=74  amount=-1\nkerning first=91  second=85  amount=-1\nkerning first=91  second=217 amount=-1\nkerning first=91  second=218 amount=-1\nkerning first=91  second=219 amount=-1\nkerning first=91  second=220 amount=-1\nkerning first=102 second=34  amount=1\nkerning first=102 second=39  amount=1\nkerning first=102 second=99  amount=-2\nkerning first=102 second=100 amount=-2\nkerning first=102 second=101 amount=-2\nkerning first=102 second=103 amount=-2\nkerning first=102 second=113 amount=-2\nkerning first=102 second=231 amount=-2\nkerning first=102 second=232 amount=-2\nkerning first=102 second=233 amount=-2\nkerning first=102 second=234 amount=-2\nkerning first=102 second=235 amount=-2\nkerning first=107 second=99  amount=-2\nkerning first=107 second=100 amount=-2\nkerning first=107 second=101 amount=-2\nkerning first=107 second=103 amount=-2\nkerning first=107 second=113 amount=-2\nkerning first=107 second=231 amount=-2\nkerning first=107 second=232 amount=-2\nkerning first=107 second=233 amount=-2\nkerning first=107 second=234 amount=-2\nkerning first=107 second=235 amount=-2\nkerning first=116 second=111 amount=-2\nkerning first=116 second=242 amount=-2\nkerning first=116 second=243 amount=-2\nkerning first=116 second=244 amount=-2\nkerning first=116 second=245 amount=-2\nkerning first=116 second=246 amount=-2\nkerning first=119 second=44  amount=-10\nkerning first=119 second=46  amount=-10\nkerning first=123 second=74  amount=-2\nkerning first=123 second=85  amount=-2\nkerning first=123 second=217 amount=-2\nkerning first=123 second=218 amount=-2\nkerning first=123 second=219 amount=-2\nkerning first=123 second=220 amount=-2\nkerning first=34  second=34  amount=-8\nkerning first=34  second=39  amount=-8\nkerning first=34  second=111 amount=-5\nkerning first=34  second=242 amount=-5\nkerning first=34  second=243 amount=-5\nkerning first=34  second=244 amount=-5\nkerning first=34  second=245 amount=-5\nkerning first=34  second=246 amount=-5\nkerning first=34  second=65  amount=-9\nkerning first=34  second=192 amount=-9\nkerning first=34  second=193 amount=-9\nkerning first=34  second=194 amount=-9\nkerning first=34  second=195 amount=-9\nkerning first=34  second=196 amount=-9\nkerning first=34  second=197 amount=-9\nkerning first=34  second=99  amount=-5\nkerning first=34  second=100 amount=-5\nkerning first=34  second=101 amount=-5\nkerning first=34  second=103 amount=-5\nkerning first=34  second=113 amount=-5\nkerning first=34  second=231 amount=-5\nkerning first=34  second=232 amount=-5\nkerning first=34  second=233 amount=-5\nkerning first=34  second=234 amount=-5\nkerning first=34  second=235 amount=-5\nkerning first=34  second=109 amount=-2\nkerning first=34  second=110 amount=-2\nkerning first=34  second=112 amount=-2\nkerning first=34  second=241 amount=-2\nkerning first=34  second=97  amount=-4\nkerning first=34  second=224 amount=-4\nkerning first=34  second=225 amount=-4\nkerning first=34  second=226 amount=-4\nkerning first=34  second=227 amount=-4\nkerning first=34  second=228 amount=-4\nkerning first=34  second=229 amount=-4\nkerning first=34  second=115 amount=-6\nkerning first=39  second=34  amount=-8\nkerning first=39  second=39  amount=-8\nkerning first=39  second=111 amount=-5\nkerning first=39  second=242 amount=-5\nkerning first=39  second=243 amount=-5\nkerning first=39  second=244 amount=-5\nkerning first=39  second=245 amount=-5\nkerning first=39  second=246 amount=-5\nkerning first=39  second=65  amount=-9\nkerning first=39  second=192 amount=-9\nkerning first=39  second=193 amount=-9\nkerning first=39  second=194 amount=-9\nkerning first=39  second=195 amount=-9\nkerning first=39  second=196 amount=-9\nkerning first=39  second=197 amount=-9\nkerning first=39  second=99  amount=-5\nkerning first=39  second=100 amount=-5\nkerning first=39  second=101 amount=-5\nkerning first=39  second=103 amount=-5\nkerning first=39  second=113 amount=-5\nkerning first=39  second=231 amount=-5\nkerning first=39  second=232 amount=-5\nkerning first=39  second=233 amount=-5\nkerning first=39  second=234 amount=-5\nkerning first=39  second=235 amount=-5\nkerning first=39  second=109 amount=-2\nkerning first=39  second=110 amount=-2\nkerning first=39  second=112 amount=-2\nkerning first=39  second=241 amount=-2\nkerning first=39  second=97  amount=-4\nkerning first=39  second=224 amount=-4\nkerning first=39  second=225 amount=-4\nkerning first=39  second=226 amount=-4\nkerning first=39  second=227 amount=-4\nkerning first=39  second=228 amount=-4\nkerning first=39  second=229 amount=-4\nkerning first=39  second=115 amount=-6\nkerning first=44  second=34  amount=-13\nkerning first=44  second=39  amount=-13\nkerning first=46  second=34  amount=-13\nkerning first=46  second=39  amount=-13\nkerning first=65  second=118 amount=-4\nkerning first=65  second=121 amount=-4\nkerning first=65  second=253 amount=-4\nkerning first=65  second=255 amount=-4\nkerning first=65  second=67  amount=-1\nkerning first=65  second=71  amount=-1\nkerning first=65  second=79  amount=-1\nkerning first=65  second=81  amount=-1\nkerning first=65  second=216 amount=-1\nkerning first=65  second=199 amount=-1\nkerning first=65  second=210 amount=-1\nkerning first=65  second=211 amount=-1\nkerning first=65  second=212 amount=-1\nkerning first=65  second=213 amount=-1\nkerning first=65  second=214 amount=-1\nkerning first=65  second=85  amount=-1\nkerning first=65  second=217 amount=-1\nkerning first=65  second=218 amount=-1\nkerning first=65  second=219 amount=-1\nkerning first=65  second=220 amount=-1\nkerning first=65  second=34  amount=-9\nkerning first=65  second=39  amount=-9\nkerning first=65  second=111 amount=-1\nkerning first=65  second=242 amount=-1\nkerning first=65  second=243 amount=-1\nkerning first=65  second=244 amount=-1\nkerning first=65  second=245 amount=-1\nkerning first=65  second=246 amount=-1\nkerning first=65  second=87  amount=-5\nkerning first=65  second=84  amount=-10\nkerning first=65  second=117 amount=-1\nkerning first=65  second=249 amount=-1\nkerning first=65  second=250 amount=-1\nkerning first=65  second=251 amount=-1\nkerning first=65  second=252 amount=-1\nkerning first=65  second=122 amount=1\nkerning first=65  second=86  amount=-7\nkerning first=65  second=89  amount=-7\nkerning first=65  second=221 amount=-7\nkerning first=66  second=84  amount=-2\nkerning first=66  second=86  amount=-2\nkerning first=66  second=89  amount=-4\nkerning first=66  second=221 amount=-4\nkerning first=67  second=84  amount=-2\nkerning first=68  second=84  amount=-2\nkerning first=68  second=86  amount=-2\nkerning first=68  second=89  amount=-3\nkerning first=68  second=221 amount=-3\nkerning first=68  second=65  amount=-2\nkerning first=68  second=192 amount=-2\nkerning first=68  second=193 amount=-2\nkerning first=68  second=194 amount=-2\nkerning first=68  second=195 amount=-2\nkerning first=68  second=196 amount=-2\nkerning first=68  second=197 amount=-2\nkerning first=68  second=88  amount=-2\nkerning first=68  second=44  amount=-8\nkerning first=68  second=46  amount=-8\nkerning first=68  second=90  amount=-2\nkerning first=69  second=118 amount=-2\nkerning first=69  second=121 amount=-2\nkerning first=69  second=253 amount=-2\nkerning first=69  second=255 amount=-2\nkerning first=69  second=111 amount=-1\nkerning first=69  second=242 amount=-1\nkerning first=69  second=243 amount=-1\nkerning first=69  second=244 amount=-1\nkerning first=69  second=245 amount=-1\nkerning first=69  second=246 amount=-1\nkerning first=69  second=84  amount=2\nkerning first=69  second=117 amount=-1\nkerning first=69  second=249 amount=-1\nkerning first=69  second=250 amount=-1\nkerning first=69  second=251 amount=-1\nkerning first=69  second=252 amount=-1\nkerning first=69  second=99  amount=-1\nkerning first=69  second=100 amount=-1\nkerning first=69  second=101 amount=-1\nkerning first=69  second=103 amount=-1\nkerning first=69  second=113 amount=-1\nkerning first=69  second=231 amount=-1\nkerning first=69  second=232 amount=-1\nkerning first=69  second=233 amount=-1\nkerning first=69  second=234 amount=-1\nkerning first=69  second=235 amount=-1\nkerning first=72  second=84  amount=-2\nkerning first=72  second=89  amount=-2\nkerning first=72  second=221 amount=-2\nkerning first=72  second=65  amount=1\nkerning first=72  second=192 amount=1\nkerning first=72  second=193 amount=1\nkerning first=72  second=194 amount=1\nkerning first=72  second=195 amount=1\nkerning first=72  second=196 amount=1\nkerning first=72  second=197 amount=1\nkerning first=72  second=88  amount=1\nkerning first=73  second=84  amount=-2\nkerning first=73  second=89  amount=-2\nkerning first=73  second=221 amount=-2\nkerning first=73  second=65  amount=1\nkerning first=73  second=192 amount=1\nkerning first=73  second=193 amount=1\nkerning first=73  second=194 amount=1\nkerning first=73  second=195 amount=1\nkerning first=73  second=196 amount=1\nkerning first=73  second=197 amount=1\nkerning first=73  second=88  amount=1\nkerning first=74  second=65  amount=-2\nkerning first=74  second=192 amount=-2\nkerning first=74  second=193 amount=-2\nkerning first=74  second=194 amount=-2\nkerning first=74  second=195 amount=-2\nkerning first=74  second=196 amount=-2\nkerning first=74  second=197 amount=-2\nkerning first=75  second=118 amount=-3\nkerning first=75  second=121 amount=-3\nkerning first=75  second=253 amount=-3\nkerning first=75  second=255 amount=-3\nkerning first=75  second=67  amount=-2\nkerning first=75  second=71  amount=-2\nkerning first=75  second=79  amount=-2\nkerning first=75  second=81  amount=-2\nkerning first=75  second=216 amount=-2\nkerning first=75  second=199 amount=-2\nkerning first=75  second=210 amount=-2\nkerning first=75  second=211 amount=-2\nkerning first=75  second=212 amount=-2\nkerning first=75  second=213 amount=-2\nkerning first=75  second=214 amount=-2\nkerning first=75  second=111 amount=-2\nkerning first=75  second=242 amount=-2\nkerning first=75  second=243 amount=-2\nkerning first=75  second=244 amount=-2\nkerning first=75  second=245 amount=-2\nkerning first=75  second=246 amount=-2\nkerning first=75  second=117 amount=-2\nkerning first=75  second=249 amount=-2\nkerning first=75  second=250 amount=-2\nkerning first=75  second=251 amount=-2\nkerning first=75  second=252 amount=-2\nkerning first=75  second=99  amount=-2\nkerning first=75  second=100 amount=-2\nkerning first=75  second=101 amount=-2\nkerning first=75  second=103 amount=-2\nkerning first=75  second=113 amount=-2\nkerning first=75  second=231 amount=-2\nkerning first=75  second=232 amount=-2\nkerning first=75  second=233 amount=-2\nkerning first=75  second=234 amount=-2\nkerning first=75  second=235 amount=-2\nkerning first=75  second=45  amount=-5\nkerning first=75  second=173 amount=-5\nkerning first=75  second=109 amount=-2\nkerning first=75  second=110 amount=-2\nkerning first=75  second=112 amount=-2\nkerning first=75  second=241 amount=-2\nkerning first=76  second=118 amount=-10\nkerning first=76  second=121 amount=-10\nkerning first=76  second=253 amount=-10\nkerning first=76  second=255 amount=-10\nkerning first=76  second=67  amount=-5\nkerning first=76  second=71  amount=-5\nkerning first=76  second=79  amount=-5\nkerning first=76  second=81  amount=-5\nkerning first=76  second=216 amount=-5\nkerning first=76  second=199 amount=-5\nkerning first=76  second=210 amount=-5\nkerning first=76  second=211 amount=-5\nkerning first=76  second=212 amount=-5\nkerning first=76  second=213 amount=-5\nkerning first=76  second=214 amount=-5\nkerning first=76  second=85  amount=-4\nkerning first=76  second=217 amount=-4\nkerning first=76  second=218 amount=-4\nkerning first=76  second=219 amount=-4\nkerning first=76  second=220 amount=-4\nkerning first=76  second=34  amount=-26\nkerning first=76  second=39  amount=-26\nkerning first=76  second=87  amount=-11\nkerning first=76  second=84  amount=-21\nkerning first=76  second=117 amount=-3\nkerning first=76  second=249 amount=-3\nkerning first=76  second=250 amount=-3\nkerning first=76  second=251 amount=-3\nkerning first=76  second=252 amount=-3\nkerning first=76  second=86  amount=-14\nkerning first=76  second=89  amount=-19\nkerning first=76  second=221 amount=-19\nkerning first=76  second=65  amount=1\nkerning first=76  second=192 amount=1\nkerning first=76  second=193 amount=1\nkerning first=76  second=194 amount=1\nkerning first=76  second=195 amount=1\nkerning first=76  second=196 amount=1\nkerning first=76  second=197 amount=1\nkerning first=77  second=84  amount=-2\nkerning first=77  second=89  amount=-2\nkerning first=77  second=221 amount=-2\nkerning first=77  second=65  amount=1\nkerning first=77  second=192 amount=1\nkerning first=77  second=193 amount=1\nkerning first=77  second=194 amount=1\nkerning first=77  second=195 amount=1\nkerning first=77  second=196 amount=1\nkerning first=77  second=197 amount=1\nkerning first=77  second=88  amount=1\nkerning first=78  second=84  amount=-2\nkerning first=78  second=89  amount=-2\nkerning first=78  second=221 amount=-2\nkerning first=78  second=65  amount=1\nkerning first=78  second=192 amount=1\nkerning first=78  second=193 amount=1\nkerning first=78  second=194 amount=1\nkerning first=78  second=195 amount=1\nkerning first=78  second=196 amount=1\nkerning first=78  second=197 amount=1\nkerning first=78  second=88  amount=1\nkerning first=79  second=84  amount=-2\nkerning first=79  second=86  amount=-2\nkerning first=79  second=89  amount=-3\nkerning first=79  second=221 amount=-3\nkerning first=79  second=65  amount=-2\nkerning first=79  second=192 amount=-2\nkerning first=79  second=193 amount=-2\nkerning first=79  second=194 amount=-2\nkerning first=79  second=195 amount=-2\nkerning first=79  second=196 amount=-2\nkerning first=79  second=197 amount=-2\nkerning first=79  second=88  amount=-2\nkerning first=79  second=44  amount=-8\nkerning first=79  second=46  amount=-8\nkerning first=79  second=90  amount=-2\nkerning first=80  second=118 amount=1\nkerning first=80  second=121 amount=1\nkerning first=80  second=253 amount=1\nkerning first=80  second=255 amount=1\nkerning first=80  second=111 amount=-1\nkerning first=80  second=242 amount=-1\nkerning first=80  second=243 amount=-1\nkerning first=80  second=244 amount=-1\nkerning first=80  second=245 amount=-1\nkerning first=80  second=246 amount=-1\nkerning first=80  second=65  amount=-11\nkerning first=80  second=192 amount=-11\nkerning first=80  second=193 amount=-11\nkerning first=80  second=194 amount=-11\nkerning first=80  second=195 amount=-11\nkerning first=80  second=196 amount=-11\nkerning first=80  second=197 amount=-11\nkerning first=80  second=88  amount=-2\nkerning first=80  second=44  amount=-25\nkerning first=80  second=46  amount=-25\nkerning first=80  second=90  amount=-2\nkerning first=80  second=99  amount=-1\nkerning first=80  second=100 amount=-1\nkerning first=80  second=101 amount=-1\nkerning first=80  second=103 amount=-1\nkerning first=80  second=113 amount=-1\nkerning first=80  second=231 amount=-1\nkerning first=80  second=232 amount=-1\nkerning first=80  second=233 amount=-1\nkerning first=80  second=234 amount=-1\nkerning first=80  second=235 amount=-1\nkerning first=80  second=97  amount=-1\nkerning first=80  second=224 amount=-1\nkerning first=80  second=225 amount=-1\nkerning first=80  second=226 amount=-1\nkerning first=80  second=227 amount=-1\nkerning first=80  second=228 amount=-1\nkerning first=80  second=229 amount=-1\nkerning first=80  second=74  amount=-16\nkerning first=84  second=118 amount=-6\nkerning first=84  second=121 amount=-6\nkerning first=84  second=253 amount=-6\nkerning first=84  second=255 amount=-6\nkerning first=84  second=67  amount=-2\nkerning first=84  second=71  amount=-2\nkerning first=84  second=79  amount=-2\nkerning first=84  second=81  amount=-2\nkerning first=84  second=216 amount=-2\nkerning first=84  second=199 amount=-2\nkerning first=84  second=210 amount=-2\nkerning first=84  second=211 amount=-2\nkerning first=84  second=212 amount=-2\nkerning first=84  second=213 amount=-2\nkerning first=84  second=214 amount=-2\nkerning first=84  second=111 amount=-8\nkerning first=84  second=242 amount=-8\nkerning first=84  second=243 amount=-8\nkerning first=84  second=244 amount=-8\nkerning first=84  second=245 amount=-8\nkerning first=84  second=246 amount=-8\nkerning first=84  second=87  amount=1\nkerning first=84  second=84  amount=1\nkerning first=84  second=117 amount=-7\nkerning first=84  second=249 amount=-7\nkerning first=84  second=250 amount=-7\nkerning first=84  second=251 amount=-7\nkerning first=84  second=252 amount=-7\nkerning first=84  second=122 amount=-5\nkerning first=84  second=86  amount=1\nkerning first=84  second=89  amount=1\nkerning first=84  second=221 amount=1\nkerning first=84  second=65  amount=-6\nkerning first=84  second=192 amount=-6\nkerning first=84  second=193 amount=-6\nkerning first=84  second=194 amount=-6\nkerning first=84  second=195 amount=-6\nkerning first=84  second=196 amount=-6\nkerning first=84  second=197 amount=-6\nkerning first=84  second=44  amount=-17\nkerning first=84  second=46  amount=-17\nkerning first=84  second=99  amount=-8\nkerning first=84  second=100 amount=-8\nkerning first=84  second=101 amount=-8\nkerning first=84  second=103 amount=-8\nkerning first=84  second=113 amount=-8\nkerning first=84  second=231 amount=-8\nkerning first=84  second=232 amount=-8\nkerning first=84  second=233 amount=-8\nkerning first=84  second=234 amount=-8\nkerning first=84  second=235 amount=-8\nkerning first=84  second=120 amount=-6\nkerning first=84  second=45  amount=-18\nkerning first=84  second=173 amount=-18\nkerning first=84  second=109 amount=-9\nkerning first=84  second=110 amount=-9\nkerning first=84  second=112 amount=-9\nkerning first=84  second=241 amount=-9\nkerning first=84  second=83  amount=-1\nkerning first=84  second=97  amount=-9\nkerning first=84  second=224 amount=-9\nkerning first=84  second=225 amount=-9\nkerning first=84  second=226 amount=-9\nkerning first=84  second=227 amount=-9\nkerning first=84  second=228 amount=-9\nkerning first=84  second=229 amount=-9\nkerning first=84  second=115 amount=-9\nkerning first=84  second=74  amount=-19\nkerning first=85  second=65  amount=-2\nkerning first=85  second=192 amount=-2\nkerning first=85  second=193 amount=-2\nkerning first=85  second=194 amount=-2\nkerning first=85  second=195 amount=-2\nkerning first=85  second=196 amount=-2\nkerning first=85  second=197 amount=-2\nkerning first=86  second=118 amount=-1\nkerning first=86  second=121 amount=-1\nkerning first=86  second=253 amount=-1\nkerning first=86  second=255 amount=-1\nkerning first=86  second=67  amount=-1\nkerning first=86  second=71  amount=-1\nkerning first=86  second=79  amount=-1\nkerning first=86  second=81  amount=-1\nkerning first=86  second=216 amount=-1\nkerning first=86  second=199 amount=-1\nkerning first=86  second=210 amount=-1\nkerning first=86  second=211 amount=-1\nkerning first=86  second=212 amount=-1\nkerning first=86  second=213 amount=-1\nkerning first=86  second=214 amount=-1\nkerning first=86  second=111 amount=-4\nkerning first=86  second=242 amount=-4\nkerning first=86  second=243 amount=-4\nkerning first=86  second=244 amount=-4\nkerning first=86  second=245 amount=-4\nkerning first=86  second=246 amount=-4\nkerning first=86  second=117 amount=-2\nkerning first=86  second=249 amount=-2\nkerning first=86  second=250 amount=-2\nkerning first=86  second=251 amount=-2\nkerning first=86  second=252 amount=-2\nkerning first=86  second=65  amount=-6\nkerning first=86  second=192 amount=-6\nkerning first=86  second=193 amount=-6\nkerning first=86  second=194 amount=-6\nkerning first=86  second=195 amount=-6\nkerning first=86  second=196 amount=-6\nkerning first=86  second=197 amount=-6\nkerning first=86  second=44  amount=-18\nkerning first=86  second=46  amount=-18\nkerning first=86  second=99  amount=-3\nkerning first=86  second=100 amount=-3\nkerning first=86  second=101 amount=-3\nkerning first=86  second=103 amount=-3\nkerning first=86  second=113 amount=-3\nkerning first=86  second=231 amount=-3\nkerning first=86  second=232 amount=-3\nkerning first=86  second=233 amount=-3\nkerning first=86  second=234 amount=-3\nkerning first=86  second=235 amount=-3\nkerning first=86  second=45  amount=-3\nkerning first=86  second=173 amount=-3\nkerning first=86  second=97  amount=-4\nkerning first=86  second=224 amount=-4\nkerning first=86  second=225 amount=-4\nkerning first=86  second=226 amount=-4\nkerning first=86  second=227 amount=-4\nkerning first=86  second=228 amount=-4\nkerning first=86  second=229 amount=-4\nkerning first=87  second=111 amount=-2\nkerning first=87  second=242 amount=-2\nkerning first=87  second=243 amount=-2\nkerning first=87  second=244 amount=-2\nkerning first=87  second=245 amount=-2\nkerning first=87  second=246 amount=-2\nkerning first=87  second=84  amount=1\nkerning first=87  second=117 amount=-1\nkerning first=87  second=249 amount=-1\nkerning first=87  second=250 amount=-1\nkerning first=87  second=251 amount=-1\nkerning first=87  second=252 amount=-1\nkerning first=87  second=65  amount=-3\nkerning first=87  second=192 amount=-3\nkerning first=87  second=193 amount=-3\nkerning first=87  second=194 amount=-3\nkerning first=87  second=195 amount=-3\nkerning first=87  second=196 amount=-3\nkerning first=87  second=197 amount=-3\nkerning first=87  second=44  amount=-10\nkerning first=87  second=46  amount=-10\nkerning first=87  second=99  amount=-2\nkerning first=87  second=100 amount=-2\nkerning first=87  second=101 amount=-2\nkerning first=87  second=103 amount=-2\nkerning first=87  second=113 amount=-2\nkerning first=87  second=231 amount=-2\nkerning first=87  second=232 amount=-2\nkerning first=87  second=233 amount=-2\nkerning first=87  second=234 amount=-2\nkerning first=87  second=235 amount=-2\nkerning first=87  second=45  amount=-5\nkerning first=87  second=173 amount=-5\nkerning first=87  second=97  amount=-3\nkerning first=87  second=224 amount=-3\nkerning first=87  second=225 amount=-3\nkerning first=87  second=226 amount=-3\nkerning first=87  second=227 amount=-3\nkerning first=87  second=228 amount=-3\nkerning first=87  second=229 amount=-3\nkerning first=88  second=118 amount=-2\nkerning first=88  second=121 amount=-2\nkerning first=88  second=253 amount=-2\nkerning first=88  second=255 amount=-2\nkerning first=88  second=67  amount=-2\nkerning first=88  second=71  amount=-2\nkerning first=88  second=79  amount=-2\nkerning first=88  second=81  amount=-2\nkerning first=88  second=216 amount=-2\nkerning first=88  second=199 amount=-2\nkerning first=88  second=210 amount=-2\nkerning first=88  second=211 amount=-2\nkerning first=88  second=212 amount=-2\nkerning first=88  second=213 amount=-2\nkerning first=88  second=214 amount=-2\nkerning first=88  second=111 amount=-2\nkerning first=88  second=242 amount=-2\nkerning first=88  second=243 amount=-2\nkerning first=88  second=244 amount=-2\nkerning first=88  second=245 amount=-2\nkerning first=88  second=246 amount=-2\nkerning first=88  second=117 amount=-2\nkerning first=88  second=249 amount=-2\nkerning first=88  second=250 amount=-2\nkerning first=88  second=251 amount=-2\nkerning first=88  second=252 amount=-2\nkerning first=88  second=86  amount=1\nkerning first=88  second=99  amount=-2\nkerning first=88  second=100 amount=-2\nkerning first=88  second=101 amount=-2\nkerning first=88  second=103 amount=-2\nkerning first=88  second=113 amount=-2\nkerning first=88  second=231 amount=-2\nkerning first=88  second=232 amount=-2\nkerning first=88  second=233 amount=-2\nkerning first=88  second=234 amount=-2\nkerning first=88  second=235 amount=-2\nkerning first=88  second=45  amount=-4\nkerning first=88  second=173 amount=-4\nkerning first=89  second=118 amount=-2\nkerning first=89  second=121 amount=-2\nkerning first=89  second=253 amount=-2\nkerning first=89  second=255 amount=-2\nkerning first=89  second=67  amount=-2\nkerning first=89  second=71  amount=-2\nkerning first=89  second=79  amount=-2\nkerning first=89  second=81  amount=-2\nkerning first=89  second=216 amount=-2\nkerning first=89  second=199 amount=-2\nkerning first=89  second=210 amount=-2\nkerning first=89  second=211 amount=-2\nkerning first=89  second=212 amount=-2\nkerning first=89  second=213 amount=-2\nkerning first=89  second=214 amount=-2\nkerning first=89  second=85  amount=-7\nkerning first=89  second=217 amount=-7\nkerning first=89  second=218 amount=-7\nkerning first=89  second=219 amount=-7\nkerning first=89  second=220 amount=-7\nkerning first=89  second=111 amount=-5\nkerning first=89  second=242 amount=-5\nkerning first=89  second=243 amount=-5\nkerning first=89  second=244 amount=-5\nkerning first=89  second=245 amount=-5\nkerning first=89  second=246 amount=-5\nkerning first=89  second=87  amount=1\nkerning first=89  second=84  amount=1\nkerning first=89  second=117 amount=-3\nkerning first=89  second=249 amount=-3\nkerning first=89  second=250 amount=-3\nkerning first=89  second=251 amount=-3\nkerning first=89  second=252 amount=-3\nkerning first=89  second=122 amount=-2\nkerning first=89  second=86  amount=1\nkerning first=89  second=89  amount=1\nkerning first=89  second=221 amount=1\nkerning first=89  second=65  amount=-7\nkerning first=89  second=192 amount=-7\nkerning first=89  second=193 amount=-7\nkerning first=89  second=194 amount=-7\nkerning first=89  second=195 amount=-7\nkerning first=89  second=196 amount=-7\nkerning first=89  second=197 amount=-7\nkerning first=89  second=88  amount=1\nkerning first=89  second=44  amount=-16\nkerning first=89  second=46  amount=-16\nkerning first=89  second=99  amount=-5\nkerning first=89  second=100 amount=-5\nkerning first=89  second=101 amount=-5\nkerning first=89  second=103 amount=-5\nkerning first=89  second=113 amount=-5\nkerning first=89  second=231 amount=-5\nkerning first=89  second=232 amount=-5\nkerning first=89  second=233 amount=-5\nkerning first=89  second=234 amount=-5\nkerning first=89  second=235 amount=-5\nkerning first=89  second=120 amount=-2\nkerning first=89  second=45  amount=-4\nkerning first=89  second=173 amount=-4\nkerning first=89  second=109 amount=-3\nkerning first=89  second=110 amount=-3\nkerning first=89  second=112 amount=-3\nkerning first=89  second=241 amount=-3\nkerning first=89  second=83  amount=-1\nkerning first=89  second=97  amount=-6\nkerning first=89  second=224 amount=-6\nkerning first=89  second=225 amount=-6\nkerning first=89  second=226 amount=-6\nkerning first=89  second=227 amount=-6\nkerning first=89  second=228 amount=-6\nkerning first=89  second=229 amount=-6\nkerning first=89  second=115 amount=-5\nkerning first=89  second=74  amount=-7\nkerning first=90  second=118 amount=-2\nkerning first=90  second=121 amount=-2\nkerning first=90  second=253 amount=-2\nkerning first=90  second=255 amount=-2\nkerning first=90  second=67  amount=-2\nkerning first=90  second=71  amount=-2\nkerning first=90  second=79  amount=-2\nkerning first=90  second=81  amount=-2\nkerning first=90  second=216 amount=-2\nkerning first=90  second=199 amount=-2\nkerning first=90  second=210 amount=-2\nkerning first=90  second=211 amount=-2\nkerning first=90  second=212 amount=-2\nkerning first=90  second=213 amount=-2\nkerning first=90  second=214 amount=-2\nkerning first=90  second=111 amount=-2\nkerning first=90  second=242 amount=-2\nkerning first=90  second=243 amount=-2\nkerning first=90  second=244 amount=-2\nkerning first=90  second=245 amount=-2\nkerning first=90  second=246 amount=-2\nkerning first=90  second=117 amount=-1\nkerning first=90  second=249 amount=-1\nkerning first=90  second=250 amount=-1\nkerning first=90  second=251 amount=-1\nkerning first=90  second=252 amount=-1\nkerning first=90  second=65  amount=1\nkerning first=90  second=192 amount=1\nkerning first=90  second=193 amount=1\nkerning first=90  second=194 amount=1\nkerning first=90  second=195 amount=1\nkerning first=90  second=196 amount=1\nkerning first=90  second=197 amount=1\nkerning first=90  second=99  amount=-2\nkerning first=90  second=100 amount=-2\nkerning first=90  second=101 amount=-2\nkerning first=90  second=103 amount=-2\nkerning first=90  second=113 amount=-2\nkerning first=90  second=231 amount=-2\nkerning first=90  second=232 amount=-2\nkerning first=90  second=233 amount=-2\nkerning first=90  second=234 amount=-2\nkerning first=90  second=235 amount=-2\nkerning first=97  second=118 amount=-1\nkerning first=97  second=121 amount=-1\nkerning first=97  second=253 amount=-1\nkerning first=97  second=255 amount=-1\nkerning first=97  second=34  amount=-5\nkerning first=97  second=39  amount=-5\nkerning first=98  second=118 amount=-1\nkerning first=98  second=121 amount=-1\nkerning first=98  second=253 amount=-1\nkerning first=98  second=255 amount=-1\nkerning first=98  second=34  amount=-2\nkerning first=98  second=39  amount=-2\nkerning first=98  second=122 amount=-1\nkerning first=98  second=120 amount=-1\nkerning first=99  second=34  amount=-1\nkerning first=99  second=39  amount=-1\nkerning first=101 second=118 amount=-1\nkerning first=101 second=121 amount=-1\nkerning first=101 second=253 amount=-1\nkerning first=101 second=255 amount=-1\nkerning first=101 second=34  amount=-1\nkerning first=101 second=39  amount=-1\nkerning first=104 second=34  amount=-8\nkerning first=104 second=39  amount=-8\nkerning first=109 second=34  amount=-8\nkerning first=109 second=39  amount=-8\nkerning first=110 second=34  amount=-8\nkerning first=110 second=39  amount=-8\nkerning first=111 second=118 amount=-1\nkerning first=111 second=121 amount=-1\nkerning first=111 second=253 amount=-1\nkerning first=111 second=255 amount=-1\nkerning first=111 second=34  amount=-11\nkerning first=111 second=39  amount=-11\nkerning first=111 second=122 amount=-1\nkerning first=111 second=120 amount=-2\nkerning first=112 second=118 amount=-1\nkerning first=112 second=121 amount=-1\nkerning first=112 second=253 amount=-1\nkerning first=112 second=255 amount=-1\nkerning first=112 second=34  amount=-2\nkerning first=112 second=39  amount=-2\nkerning first=112 second=122 amount=-1\nkerning first=112 second=120 amount=-1\nkerning first=114 second=118 amount=1\nkerning first=114 second=121 amount=1\nkerning first=114 second=253 amount=1\nkerning first=114 second=255 amount=1\nkerning first=114 second=34  amount=1\nkerning first=114 second=39  amount=1\nkerning first=114 second=111 amount=-2\nkerning first=114 second=242 amount=-2\nkerning first=114 second=243 amount=-2\nkerning first=114 second=244 amount=-2\nkerning first=114 second=245 amount=-2\nkerning first=114 second=246 amount=-2\nkerning first=114 second=44  amount=-10\nkerning first=114 second=46  amount=-10\nkerning first=114 second=99  amount=-1\nkerning first=114 second=100 amount=-1\nkerning first=114 second=101 amount=-1\nkerning first=114 second=103 amount=-1\nkerning first=114 second=113 amount=-1\nkerning first=114 second=231 amount=-1\nkerning first=114 second=232 amount=-1\nkerning first=114 second=233 amount=-1\nkerning first=114 second=234 amount=-1\nkerning first=114 second=235 amount=-1\nkerning first=114 second=97  amount=-3\nkerning first=114 second=224 amount=-3\nkerning first=114 second=225 amount=-3\nkerning first=114 second=226 amount=-3\nkerning first=114 second=227 amount=-3\nkerning first=114 second=228 amount=-3\nkerning first=114 second=229 amount=-3\nkerning first=118 second=34  amount=1\nkerning first=118 second=39  amount=1\nkerning first=118 second=111 amount=-1\nkerning first=118 second=242 amount=-1\nkerning first=118 second=243 amount=-1\nkerning first=118 second=244 amount=-1\nkerning first=118 second=245 amount=-1\nkerning first=118 second=246 amount=-1\nkerning first=118 second=44  amount=-8\nkerning first=118 second=46  amount=-8\nkerning first=118 second=99  amount=-1\nkerning first=118 second=100 amount=-1\nkerning first=118 second=101 amount=-1\nkerning first=118 second=103 amount=-1\nkerning first=118 second=113 amount=-1\nkerning first=118 second=231 amount=-1\nkerning first=118 second=232 amount=-1\nkerning first=118 second=233 amount=-1\nkerning first=118 second=234 amount=-1\nkerning first=118 second=235 amount=-1\nkerning first=118 second=97  amount=-1\nkerning first=118 second=224 amount=-1\nkerning first=118 second=225 amount=-1\nkerning first=118 second=226 amount=-1\nkerning first=118 second=227 amount=-1\nkerning first=118 second=228 amount=-1\nkerning first=118 second=229 amount=-1\nkerning first=120 second=111 amount=-2\nkerning first=120 second=242 amount=-2\nkerning first=120 second=243 amount=-2\nkerning first=120 second=244 amount=-2\nkerning first=120 second=245 amount=-2\nkerning first=120 second=246 amount=-2\nkerning first=120 second=99  amount=-2\nkerning first=120 second=100 amount=-2\nkerning first=120 second=101 amount=-2\nkerning first=120 second=103 amount=-2\nkerning first=120 second=113 amount=-2\nkerning first=120 second=231 amount=-2\nkerning first=120 second=232 amount=-2\nkerning first=120 second=233 amount=-2\nkerning first=120 second=234 amount=-2\nkerning first=120 second=235 amount=-2\nkerning first=121 second=34  amount=1\nkerning first=121 second=39  amount=1\nkerning first=121 second=111 amount=-1\nkerning first=121 second=242 amount=-1\nkerning first=121 second=243 amount=-1\nkerning first=121 second=244 amount=-1\nkerning first=121 second=245 amount=-1\nkerning first=121 second=246 amount=-1\nkerning first=121 second=44  amount=-8\nkerning first=121 second=46  amount=-8\nkerning first=121 second=99  amount=-1\nkerning first=121 second=100 amount=-1\nkerning first=121 second=101 amount=-1\nkerning first=121 second=103 amount=-1\nkerning first=121 second=113 amount=-1\nkerning first=121 second=231 amount=-1\nkerning first=121 second=232 amount=-1\nkerning first=121 second=233 amount=-1\nkerning first=121 second=234 amount=-1\nkerning first=121 second=235 amount=-1\nkerning first=121 second=97  amount=-1\nkerning first=121 second=224 amount=-1\nkerning first=121 second=225 amount=-1\nkerning first=121 second=226 amount=-1\nkerning first=121 second=227 amount=-1\nkerning first=121 second=228 amount=-1\nkerning first=121 second=229 amount=-1\nkerning first=122 second=111 amount=-1\nkerning first=122 second=242 amount=-1\nkerning first=122 second=243 amount=-1\nkerning first=122 second=244 amount=-1\nkerning first=122 second=245 amount=-1\nkerning first=122 second=246 amount=-1\nkerning first=122 second=99  amount=-1\nkerning first=122 second=100 amount=-1\nkerning first=122 second=101 amount=-1\nkerning first=122 second=103 amount=-1\nkerning first=122 second=113 amount=-1\nkerning first=122 second=231 amount=-1\nkerning first=122 second=232 amount=-1\nkerning first=122 second=233 amount=-1\nkerning first=122 second=234 amount=-1\nkerning first=122 second=235 amount=-1\nkerning first=254 second=118 amount=-1\nkerning first=254 second=121 amount=-1\nkerning first=254 second=253 amount=-1\nkerning first=254 second=255 amount=-1\nkerning first=254 second=34  amount=-2\nkerning first=254 second=39  amount=-2\nkerning first=254 second=122 amount=-1\nkerning first=254 second=120 amount=-1\nkerning first=208 second=84  amount=-2\nkerning first=208 second=86  amount=-2\nkerning first=208 second=89  amount=-3\nkerning first=208 second=221 amount=-3\nkerning first=208 second=65  amount=-2\nkerning first=208 second=192 amount=-2\nkerning first=208 second=193 amount=-2\nkerning first=208 second=194 amount=-2\nkerning first=208 second=195 amount=-2\nkerning first=208 second=196 amount=-2\nkerning first=208 second=197 amount=-2\nkerning first=208 second=88  amount=-2\nkerning first=208 second=44  amount=-8\nkerning first=208 second=46  amount=-8\nkerning first=208 second=90  amount=-2\nkerning first=192 second=118 amount=-4\nkerning first=192 second=121 amount=-4\nkerning first=192 second=253 amount=-4\nkerning first=192 second=255 amount=-4\nkerning first=192 second=67  amount=-1\nkerning first=192 second=71  amount=-1\nkerning first=192 second=79  amount=-1\nkerning first=192 second=81  amount=-1\nkerning first=192 second=216 amount=-1\nkerning first=192 second=199 amount=-1\nkerning first=192 second=210 amount=-1\nkerning first=192 second=211 amount=-1\nkerning first=192 second=212 amount=-1\nkerning first=192 second=213 amount=-1\nkerning first=192 second=214 amount=-1\nkerning first=192 second=85  amount=-1\nkerning first=192 second=217 amount=-1\nkerning first=192 second=218 amount=-1\nkerning first=192 second=219 amount=-1\nkerning first=192 second=220 amount=-1\nkerning first=192 second=34  amount=-9\nkerning first=192 second=39  amount=-9\nkerning first=192 second=111 amount=-1\nkerning first=192 second=242 amount=-1\nkerning first=192 second=243 amount=-1\nkerning first=192 second=244 amount=-1\nkerning first=192 second=245 amount=-1\nkerning first=192 second=246 amount=-1\nkerning first=192 second=87  amount=-5\nkerning first=192 second=84  amount=-10\nkerning first=192 second=117 amount=-1\nkerning first=192 second=249 amount=-1\nkerning first=192 second=250 amount=-1\nkerning first=192 second=251 amount=-1\nkerning first=192 second=252 amount=-1\nkerning first=192 second=122 amount=1\nkerning first=192 second=86  amount=-7\nkerning first=192 second=89  amount=-7\nkerning first=192 second=221 amount=-7\nkerning first=193 second=118 amount=-4\nkerning first=193 second=121 amount=-4\nkerning first=193 second=253 amount=-4\nkerning first=193 second=255 amount=-4\nkerning first=193 second=67  amount=-1\nkerning first=193 second=71  amount=-1\nkerning first=193 second=79  amount=-1\nkerning first=193 second=81  amount=-1\nkerning first=193 second=216 amount=-1\nkerning first=193 second=199 amount=-1\nkerning first=193 second=210 amount=-1\nkerning first=193 second=211 amount=-1\nkerning first=193 second=212 amount=-1\nkerning first=193 second=213 amount=-1\nkerning first=193 second=214 amount=-1\nkerning first=193 second=85  amount=-1\nkerning first=193 second=217 amount=-1\nkerning first=193 second=218 amount=-1\nkerning first=193 second=219 amount=-1\nkerning first=193 second=220 amount=-1\nkerning first=193 second=34  amount=-9\nkerning first=193 second=39  amount=-9\nkerning first=193 second=111 amount=-1\nkerning first=193 second=242 amount=-1\nkerning first=193 second=243 amount=-1\nkerning first=193 second=244 amount=-1\nkerning first=193 second=245 amount=-1\nkerning first=193 second=246 amount=-1\nkerning first=193 second=87  amount=-5\nkerning first=193 second=84  amount=-10\nkerning first=193 second=117 amount=-1\nkerning first=193 second=249 amount=-1\nkerning first=193 second=250 amount=-1\nkerning first=193 second=251 amount=-1\nkerning first=193 second=252 amount=-1\nkerning first=193 second=122 amount=1\nkerning first=193 second=86  amount=-7\nkerning first=193 second=89  amount=-7\nkerning first=193 second=221 amount=-7\nkerning first=194 second=118 amount=-4\nkerning first=194 second=121 amount=-4\nkerning first=194 second=253 amount=-4\nkerning first=194 second=255 amount=-4\nkerning first=194 second=67  amount=-1\nkerning first=194 second=71  amount=-1\nkerning first=194 second=79  amount=-1\nkerning first=194 second=81  amount=-1\nkerning first=194 second=216 amount=-1\nkerning first=194 second=199 amount=-1\nkerning first=194 second=210 amount=-1\nkerning first=194 second=211 amount=-1\nkerning first=194 second=212 amount=-1\nkerning first=194 second=213 amount=-1\nkerning first=194 second=214 amount=-1\nkerning first=194 second=85  amount=-1\nkerning first=194 second=217 amount=-1\nkerning first=194 second=218 amount=-1\nkerning first=194 second=219 amount=-1\nkerning first=194 second=220 amount=-1\nkerning first=194 second=34  amount=-9\nkerning first=194 second=39  amount=-9\nkerning first=194 second=111 amount=-1\nkerning first=194 second=242 amount=-1\nkerning first=194 second=243 amount=-1\nkerning first=194 second=244 amount=-1\nkerning first=194 second=245 amount=-1\nkerning first=194 second=246 amount=-1\nkerning first=194 second=87  amount=-5\nkerning first=194 second=84  amount=-10\nkerning first=194 second=117 amount=-1\nkerning first=194 second=249 amount=-1\nkerning first=194 second=250 amount=-1\nkerning first=194 second=251 amount=-1\nkerning first=194 second=252 amount=-1\nkerning first=194 second=122 amount=1\nkerning first=194 second=86  amount=-7\nkerning first=194 second=89  amount=-7\nkerning first=194 second=221 amount=-7\nkerning first=195 second=118 amount=-4\nkerning first=195 second=121 amount=-4\nkerning first=195 second=253 amount=-4\nkerning first=195 second=255 amount=-4\nkerning first=195 second=67  amount=-1\nkerning first=195 second=71  amount=-1\nkerning first=195 second=79  amount=-1\nkerning first=195 second=81  amount=-1\nkerning first=195 second=216 amount=-1\nkerning first=195 second=199 amount=-1\nkerning first=195 second=210 amount=-1\nkerning first=195 second=211 amount=-1\nkerning first=195 second=212 amount=-1\nkerning first=195 second=213 amount=-1\nkerning first=195 second=214 amount=-1\nkerning first=195 second=85  amount=-1\nkerning first=195 second=217 amount=-1\nkerning first=195 second=218 amount=-1\nkerning first=195 second=219 amount=-1\nkerning first=195 second=220 amount=-1\nkerning first=195 second=34  amount=-9\nkerning first=195 second=39  amount=-9\nkerning first=195 second=111 amount=-1\nkerning first=195 second=242 amount=-1\nkerning first=195 second=243 amount=-1\nkerning first=195 second=244 amount=-1\nkerning first=195 second=245 amount=-1\nkerning first=195 second=246 amount=-1\nkerning first=195 second=87  amount=-5\nkerning first=195 second=84  amount=-10\nkerning first=195 second=117 amount=-1\nkerning first=195 second=249 amount=-1\nkerning first=195 second=250 amount=-1\nkerning first=195 second=251 amount=-1\nkerning first=195 second=252 amount=-1\nkerning first=195 second=122 amount=1\nkerning first=195 second=86  amount=-7\nkerning first=195 second=89  amount=-7\nkerning first=195 second=221 amount=-7\nkerning first=196 second=118 amount=-4\nkerning first=196 second=121 amount=-4\nkerning first=196 second=253 amount=-4\nkerning first=196 second=255 amount=-4\nkerning first=196 second=67  amount=-1\nkerning first=196 second=71  amount=-1\nkerning first=196 second=79  amount=-1\nkerning first=196 second=81  amount=-1\nkerning first=196 second=216 amount=-1\nkerning first=196 second=199 amount=-1\nkerning first=196 second=210 amount=-1\nkerning first=196 second=211 amount=-1\nkerning first=196 second=212 amount=-1\nkerning first=196 second=213 amount=-1\nkerning first=196 second=214 amount=-1\nkerning first=196 second=85  amount=-1\nkerning first=196 second=217 amount=-1\nkerning first=196 second=218 amount=-1\nkerning first=196 second=219 amount=-1\nkerning first=196 second=220 amount=-1\nkerning first=196 second=34  amount=-9\nkerning first=196 second=39  amount=-9\nkerning first=196 second=111 amount=-1\nkerning first=196 second=242 amount=-1\nkerning first=196 second=243 amount=-1\nkerning first=196 second=244 amount=-1\nkerning first=196 second=245 amount=-1\nkerning first=196 second=246 amount=-1\nkerning first=196 second=87  amount=-5\nkerning first=196 second=84  amount=-10\nkerning first=196 second=117 amount=-1\nkerning first=196 second=249 amount=-1\nkerning first=196 second=250 amount=-1\nkerning first=196 second=251 amount=-1\nkerning first=196 second=252 amount=-1\nkerning first=196 second=122 amount=1\nkerning first=196 second=86  amount=-7\nkerning first=196 second=89  amount=-7\nkerning first=196 second=221 amount=-7\nkerning first=197 second=118 amount=-4\nkerning first=197 second=121 amount=-4\nkerning first=197 second=253 amount=-4\nkerning first=197 second=255 amount=-4\nkerning first=197 second=67  amount=-1\nkerning first=197 second=71  amount=-1\nkerning first=197 second=79  amount=-1\nkerning first=197 second=81  amount=-1\nkerning first=197 second=216 amount=-1\nkerning first=197 second=199 amount=-1\nkerning first=197 second=210 amount=-1\nkerning first=197 second=211 amount=-1\nkerning first=197 second=212 amount=-1\nkerning first=197 second=213 amount=-1\nkerning first=197 second=214 amount=-1\nkerning first=197 second=85  amount=-1\nkerning first=197 second=217 amount=-1\nkerning first=197 second=218 amount=-1\nkerning first=197 second=219 amount=-1\nkerning first=197 second=220 amount=-1\nkerning first=197 second=34  amount=-9\nkerning first=197 second=39  amount=-9\nkerning first=197 second=111 amount=-1\nkerning first=197 second=242 amount=-1\nkerning first=197 second=243 amount=-1\nkerning first=197 second=244 amount=-1\nkerning first=197 second=245 amount=-1\nkerning first=197 second=246 amount=-1\nkerning first=197 second=87  amount=-5\nkerning first=197 second=84  amount=-10\nkerning first=197 second=117 amount=-1\nkerning first=197 second=249 amount=-1\nkerning first=197 second=250 amount=-1\nkerning first=197 second=251 amount=-1\nkerning first=197 second=252 amount=-1\nkerning first=197 second=122 amount=1\nkerning first=197 second=86  amount=-7\nkerning first=197 second=89  amount=-7\nkerning first=197 second=221 amount=-7\nkerning first=199 second=84  amount=-2\nkerning first=200 second=118 amount=-2\nkerning first=200 second=121 amount=-2\nkerning first=200 second=253 amount=-2\nkerning first=200 second=255 amount=-2\nkerning first=200 second=111 amount=-1\nkerning first=200 second=242 amount=-1\nkerning first=200 second=243 amount=-1\nkerning first=200 second=244 amount=-1\nkerning first=200 second=245 amount=-1\nkerning first=200 second=246 amount=-1\nkerning first=200 second=84  amount=2\nkerning first=200 second=117 amount=-1\nkerning first=200 second=249 amount=-1\nkerning first=200 second=250 amount=-1\nkerning first=200 second=251 amount=-1\nkerning first=200 second=252 amount=-1\nkerning first=200 second=99  amount=-1\nkerning first=200 second=100 amount=-1\nkerning first=200 second=101 amount=-1\nkerning first=200 second=103 amount=-1\nkerning first=200 second=113 amount=-1\nkerning first=200 second=231 amount=-1\nkerning first=200 second=232 amount=-1\nkerning first=200 second=233 amount=-1\nkerning first=200 second=234 amount=-1\nkerning first=200 second=235 amount=-1\nkerning first=201 second=118 amount=-2\nkerning first=201 second=121 amount=-2\nkerning first=201 second=253 amount=-2\nkerning first=201 second=255 amount=-2\nkerning first=201 second=111 amount=-1\nkerning first=201 second=242 amount=-1\nkerning first=201 second=243 amount=-1\nkerning first=201 second=244 amount=-1\nkerning first=201 second=245 amount=-1\nkerning first=201 second=246 amount=-1\nkerning first=201 second=84  amount=2\nkerning first=201 second=117 amount=-1\nkerning first=201 second=249 amount=-1\nkerning first=201 second=250 amount=-1\nkerning first=201 second=251 amount=-1\nkerning first=201 second=252 amount=-1\nkerning first=201 second=99  amount=-1\nkerning first=201 second=100 amount=-1\nkerning first=201 second=101 amount=-1\nkerning first=201 second=103 amount=-1\nkerning first=201 second=113 amount=-1\nkerning first=201 second=231 amount=-1\nkerning first=201 second=232 amount=-1\nkerning first=201 second=233 amount=-1\nkerning first=201 second=234 amount=-1\nkerning first=201 second=235 amount=-1\nkerning first=202 second=118 amount=-2\nkerning first=202 second=121 amount=-2\nkerning first=202 second=253 amount=-2\nkerning first=202 second=255 amount=-2\nkerning first=202 second=111 amount=-1\nkerning first=202 second=242 amount=-1\nkerning first=202 second=243 amount=-1\nkerning first=202 second=244 amount=-1\nkerning first=202 second=245 amount=-1\nkerning first=202 second=246 amount=-1\nkerning first=202 second=84  amount=2\nkerning first=202 second=117 amount=-1\nkerning first=202 second=249 amount=-1\nkerning first=202 second=250 amount=-1\nkerning first=202 second=251 amount=-1\nkerning first=202 second=252 amount=-1\nkerning first=202 second=99  amount=-1\nkerning first=202 second=100 amount=-1\nkerning first=202 second=101 amount=-1\nkerning first=202 second=103 amount=-1\nkerning first=202 second=113 amount=-1\nkerning first=202 second=231 amount=-1\nkerning first=202 second=232 amount=-1\nkerning first=202 second=233 amount=-1\nkerning first=202 second=234 amount=-1\nkerning first=202 second=235 amount=-1\nkerning first=203 second=118 amount=-2\nkerning first=203 second=121 amount=-2\nkerning first=203 second=253 amount=-2\nkerning first=203 second=255 amount=-2\nkerning first=203 second=111 amount=-1\nkerning first=203 second=242 amount=-1\nkerning first=203 second=243 amount=-1\nkerning first=203 second=244 amount=-1\nkerning first=203 second=245 amount=-1\nkerning first=203 second=246 amount=-1\nkerning first=203 second=84  amount=2\nkerning first=203 second=117 amount=-1\nkerning first=203 second=249 amount=-1\nkerning first=203 second=250 amount=-1\nkerning first=203 second=251 amount=-1\nkerning first=203 second=252 amount=-1\nkerning first=203 second=99  amount=-1\nkerning first=203 second=100 amount=-1\nkerning first=203 second=101 amount=-1\nkerning first=203 second=103 amount=-1\nkerning first=203 second=113 amount=-1\nkerning first=203 second=231 amount=-1\nkerning first=203 second=232 amount=-1\nkerning first=203 second=233 amount=-1\nkerning first=203 second=234 amount=-1\nkerning first=203 second=235 amount=-1\nkerning first=204 second=84  amount=-2\nkerning first=204 second=89  amount=-2\nkerning first=204 second=221 amount=-2\nkerning first=204 second=65  amount=1\nkerning first=204 second=192 amount=1\nkerning first=204 second=193 amount=1\nkerning first=204 second=194 amount=1\nkerning first=204 second=195 amount=1\nkerning first=204 second=196 amount=1\nkerning first=204 second=197 amount=1\nkerning first=204 second=88  amount=1\nkerning first=205 second=84  amount=-2\nkerning first=205 second=89  amount=-2\nkerning first=205 second=221 amount=-2\nkerning first=205 second=65  amount=1\nkerning first=205 second=192 amount=1\nkerning first=205 second=193 amount=1\nkerning first=205 second=194 amount=1\nkerning first=205 second=195 amount=1\nkerning first=205 second=196 amount=1\nkerning first=205 second=197 amount=1\nkerning first=205 second=88  amount=1\nkerning first=206 second=84  amount=-2\nkerning first=206 second=89  amount=-2\nkerning first=206 second=221 amount=-2\nkerning first=206 second=65  amount=1\nkerning first=206 second=192 amount=1\nkerning first=206 second=193 amount=1\nkerning first=206 second=194 amount=1\nkerning first=206 second=195 amount=1\nkerning first=206 second=196 amount=1\nkerning first=206 second=197 amount=1\nkerning first=206 second=88  amount=1\nkerning first=207 second=84  amount=-2\nkerning first=207 second=89  amount=-2\nkerning first=207 second=221 amount=-2\nkerning first=207 second=65  amount=1\nkerning first=207 second=192 amount=1\nkerning first=207 second=193 amount=1\nkerning first=207 second=194 amount=1\nkerning first=207 second=195 amount=1\nkerning first=207 second=196 amount=1\nkerning first=207 second=197 amount=1\nkerning first=207 second=88  amount=1\nkerning first=209 second=84  amount=-2\nkerning first=209 second=89  amount=-2\nkerning first=209 second=221 amount=-2\nkerning first=209 second=65  amount=1\nkerning first=209 second=192 amount=1\nkerning first=209 second=193 amount=1\nkerning first=209 second=194 amount=1\nkerning first=209 second=195 amount=1\nkerning first=209 second=196 amount=1\nkerning first=209 second=197 amount=1\nkerning first=209 second=88  amount=1\nkerning first=210 second=84  amount=-2\nkerning first=210 second=86  amount=-2\nkerning first=210 second=89  amount=-3\nkerning first=210 second=221 amount=-3\nkerning first=210 second=65  amount=-2\nkerning first=210 second=192 amount=-2\nkerning first=210 second=193 amount=-2\nkerning first=210 second=194 amount=-2\nkerning first=210 second=195 amount=-2\nkerning first=210 second=196 amount=-2\nkerning first=210 second=197 amount=-2\nkerning first=210 second=88  amount=-2\nkerning first=210 second=44  amount=-8\nkerning first=210 second=46  amount=-8\nkerning first=210 second=90  amount=-2\nkerning first=211 second=84  amount=-2\nkerning first=211 second=86  amount=-2\nkerning first=211 second=89  amount=-3\nkerning first=211 second=221 amount=-3\nkerning first=211 second=65  amount=-2\nkerning first=211 second=192 amount=-2\nkerning first=211 second=193 amount=-2\nkerning first=211 second=194 amount=-2\nkerning first=211 second=195 amount=-2\nkerning first=211 second=196 amount=-2\nkerning first=211 second=197 amount=-2\nkerning first=211 second=88  amount=-2\nkerning first=211 second=44  amount=-8\nkerning first=211 second=46  amount=-8\nkerning first=211 second=90  amount=-2\nkerning first=212 second=84  amount=-2\nkerning first=212 second=86  amount=-2\nkerning first=212 second=89  amount=-3\nkerning first=212 second=221 amount=-3\nkerning first=212 second=65  amount=-2\nkerning first=212 second=192 amount=-2\nkerning first=212 second=193 amount=-2\nkerning first=212 second=194 amount=-2\nkerning first=212 second=195 amount=-2\nkerning first=212 second=196 amount=-2\nkerning first=212 second=197 amount=-2\nkerning first=212 second=88  amount=-2\nkerning first=212 second=44  amount=-8\nkerning first=212 second=46  amount=-8\nkerning first=212 second=90  amount=-2\nkerning first=213 second=84  amount=-2\nkerning first=213 second=86  amount=-2\nkerning first=213 second=89  amount=-3\nkerning first=213 second=221 amount=-3\nkerning first=213 second=65  amount=-2\nkerning first=213 second=192 amount=-2\nkerning first=213 second=193 amount=-2\nkerning first=213 second=194 amount=-2\nkerning first=213 second=195 amount=-2\nkerning first=213 second=196 amount=-2\nkerning first=213 second=197 amount=-2\nkerning first=213 second=88  amount=-2\nkerning first=213 second=44  amount=-8\nkerning first=213 second=46  amount=-8\nkerning first=213 second=90  amount=-2\nkerning first=214 second=84  amount=-2\nkerning first=214 second=86  amount=-2\nkerning first=214 second=89  amount=-3\nkerning first=214 second=221 amount=-3\nkerning first=214 second=65  amount=-2\nkerning first=214 second=192 amount=-2\nkerning first=214 second=193 amount=-2\nkerning first=214 second=194 amount=-2\nkerning first=214 second=195 amount=-2\nkerning first=214 second=196 amount=-2\nkerning first=214 second=197 amount=-2\nkerning first=214 second=88  amount=-2\nkerning first=214 second=44  amount=-8\nkerning first=214 second=46  amount=-8\nkerning first=214 second=90  amount=-2\nkerning first=217 second=65  amount=-2\nkerning first=217 second=192 amount=-2\nkerning first=217 second=193 amount=-2\nkerning first=217 second=194 amount=-2\nkerning first=217 second=195 amount=-2\nkerning first=217 second=196 amount=-2\nkerning first=217 second=197 amount=-2\nkerning first=218 second=65  amount=-2\nkerning first=218 second=192 amount=-2\nkerning first=218 second=193 amount=-2\nkerning first=218 second=194 amount=-2\nkerning first=218 second=195 amount=-2\nkerning first=218 second=196 amount=-2\nkerning first=218 second=197 amount=-2\nkerning first=219 second=65  amount=-2\nkerning first=219 second=192 amount=-2\nkerning first=219 second=193 amount=-2\nkerning first=219 second=194 amount=-2\nkerning first=219 second=195 amount=-2\nkerning first=219 second=196 amount=-2\nkerning first=219 second=197 amount=-2\nkerning first=220 second=65  amount=-2\nkerning first=220 second=192 amount=-2\nkerning first=220 second=193 amount=-2\nkerning first=220 second=194 amount=-2\nkerning first=220 second=195 amount=-2\nkerning first=220 second=196 amount=-2\nkerning first=220 second=197 amount=-2\nkerning first=221 second=118 amount=-2\nkerning first=221 second=121 amount=-2\nkerning first=221 second=253 amount=-2\nkerning first=221 second=255 amount=-2\nkerning first=221 second=67  amount=-2\nkerning first=221 second=71  amount=-2\nkerning first=221 second=79  amount=-2\nkerning first=221 second=81  amount=-2\nkerning first=221 second=216 amount=-2\nkerning first=221 second=199 amount=-2\nkerning first=221 second=210 amount=-2\nkerning first=221 second=211 amount=-2\nkerning first=221 second=212 amount=-2\nkerning first=221 second=213 amount=-2\nkerning first=221 second=214 amount=-2\nkerning first=221 second=85  amount=-7\nkerning first=221 second=217 amount=-7\nkerning first=221 second=218 amount=-7\nkerning first=221 second=219 amount=-7\nkerning first=221 second=220 amount=-7\nkerning first=221 second=111 amount=-5\nkerning first=221 second=242 amount=-5\nkerning first=221 second=243 amount=-5\nkerning first=221 second=244 amount=-5\nkerning first=221 second=245 amount=-5\nkerning first=221 second=246 amount=-5\nkerning first=221 second=87  amount=1\nkerning first=221 second=84  amount=1\nkerning first=221 second=117 amount=-3\nkerning first=221 second=249 amount=-3\nkerning first=221 second=250 amount=-3\nkerning first=221 second=251 amount=-3\nkerning first=221 second=252 amount=-3\nkerning first=221 second=122 amount=-2\nkerning first=221 second=86  amount=1\nkerning first=221 second=89  amount=1\nkerning first=221 second=221 amount=1\nkerning first=221 second=65  amount=-7\nkerning first=221 second=192 amount=-7\nkerning first=221 second=193 amount=-7\nkerning first=221 second=194 amount=-7\nkerning first=221 second=195 amount=-7\nkerning first=221 second=196 amount=-7\nkerning first=221 second=197 amount=-7\nkerning first=221 second=88  amount=1\nkerning first=221 second=44  amount=-16\nkerning first=221 second=46  amount=-16\nkerning first=221 second=99  amount=-5\nkerning first=221 second=100 amount=-5\nkerning first=221 second=101 amount=-5\nkerning first=221 second=103 amount=-5\nkerning first=221 second=113 amount=-5\nkerning first=221 second=231 amount=-5\nkerning first=221 second=232 amount=-5\nkerning first=221 second=233 amount=-5\nkerning first=221 second=234 amount=-5\nkerning first=221 second=235 amount=-5\nkerning first=221 second=120 amount=-2\nkerning first=221 second=45  amount=-4\nkerning first=221 second=173 amount=-4\nkerning first=221 second=109 amount=-3\nkerning first=221 second=110 amount=-3\nkerning first=221 second=112 amount=-3\nkerning first=221 second=241 amount=-3\nkerning first=221 second=83  amount=-1\nkerning first=221 second=97  amount=-6\nkerning first=221 second=224 amount=-6\nkerning first=221 second=225 amount=-6\nkerning first=221 second=226 amount=-6\nkerning first=221 second=227 amount=-6\nkerning first=221 second=228 amount=-6\nkerning first=221 second=229 amount=-6\nkerning first=221 second=115 amount=-5\nkerning first=221 second=74  amount=-7\nkerning first=224 second=118 amount=-1\nkerning first=224 second=121 amount=-1\nkerning first=224 second=253 amount=-1\nkerning first=224 second=255 amount=-1\nkerning first=224 second=34  amount=-5\nkerning first=224 second=39  amount=-5\nkerning first=225 second=118 amount=-1\nkerning first=225 second=121 amount=-1\nkerning first=225 second=253 amount=-1\nkerning first=225 second=255 amount=-1\nkerning first=225 second=34  amount=-5\nkerning first=225 second=39  amount=-5\nkerning first=226 second=118 amount=-1\nkerning first=226 second=121 amount=-1\nkerning first=226 second=253 amount=-1\nkerning first=226 second=255 amount=-1\nkerning first=226 second=34  amount=-5\nkerning first=226 second=39  amount=-5\nkerning first=227 second=118 amount=-1\nkerning first=227 second=121 amount=-1\nkerning first=227 second=253 amount=-1\nkerning first=227 second=255 amount=-1\nkerning first=227 second=34  amount=-5\nkerning first=227 second=39  amount=-5\nkerning first=228 second=118 amount=-1\nkerning first=228 second=121 amount=-1\nkerning first=228 second=253 amount=-1\nkerning first=228 second=255 amount=-1\nkerning first=228 second=34  amount=-5\nkerning first=228 second=39  amount=-5\nkerning first=229 second=118 amount=-1\nkerning first=229 second=121 amount=-1\nkerning first=229 second=253 amount=-1\nkerning first=229 second=255 amount=-1\nkerning first=229 second=34  amount=-5\nkerning first=229 second=39  amount=-5\nkerning first=231 second=34  amount=-1\nkerning first=231 second=39  amount=-1\nkerning first=232 second=118 amount=-1\nkerning first=232 second=121 amount=-1\nkerning first=232 second=253 amount=-1\nkerning first=232 second=255 amount=-1\nkerning first=232 second=34  amount=-1\nkerning first=232 second=39  amount=-1\nkerning first=233 second=118 amount=-1\nkerning first=233 second=121 amount=-1\nkerning first=233 second=253 amount=-1\nkerning first=233 second=255 amount=-1\nkerning first=233 second=34  amount=-1\nkerning first=233 second=39  amount=-1\nkerning first=234 second=118 amount=-1\nkerning first=234 second=121 amount=-1\nkerning first=234 second=253 amount=-1\nkerning first=234 second=255 amount=-1\nkerning first=234 second=34  amount=-1\nkerning first=234 second=39  amount=-1\nkerning first=235 second=118 amount=-1\nkerning first=235 second=121 amount=-1\nkerning first=235 second=253 amount=-1\nkerning first=235 second=255 amount=-1\nkerning first=235 second=34  amount=-1\nkerning first=235 second=39  amount=-1\nkerning first=241 second=34  amount=-8\nkerning first=241 second=39  amount=-8\nkerning first=242 second=118 amount=-1\nkerning first=242 second=121 amount=-1\nkerning first=242 second=253 amount=-1\nkerning first=242 second=255 amount=-1\nkerning first=242 second=34  amount=-11\nkerning first=242 second=39  amount=-11\nkerning first=242 second=122 amount=-1\nkerning first=242 second=120 amount=-2\nkerning first=243 second=118 amount=-1\nkerning first=243 second=121 amount=-1\nkerning first=243 second=253 amount=-1\nkerning first=243 second=255 amount=-1\nkerning first=243 second=34  amount=-11\nkerning first=243 second=39  amount=-11\nkerning first=243 second=122 amount=-1\nkerning first=243 second=120 amount=-2\nkerning first=244 second=118 amount=-1\nkerning first=244 second=121 amount=-1\nkerning first=244 second=253 amount=-1\nkerning first=244 second=255 amount=-1\nkerning first=244 second=34  amount=-11\nkerning first=244 second=39  amount=-11\nkerning first=244 second=122 amount=-1\nkerning first=244 second=120 amount=-2\nkerning first=245 second=118 amount=-1\nkerning first=245 second=121 amount=-1\nkerning first=245 second=253 amount=-1\nkerning first=245 second=255 amount=-1\nkerning first=245 second=34  amount=-11\nkerning first=245 second=39  amount=-11\nkerning first=245 second=122 amount=-1\nkerning first=245 second=120 amount=-2\nkerning first=246 second=118 amount=-1\nkerning first=246 second=121 amount=-1\nkerning first=246 second=253 amount=-1\nkerning first=246 second=255 amount=-1\nkerning first=246 second=34  amount=-11\nkerning first=246 second=39  amount=-11\nkerning first=246 second=122 amount=-1\nkerning first=246 second=120 amount=-2\nkerning first=253 second=34  amount=1\nkerning first=253 second=39  amount=1\nkerning first=253 second=111 amount=-1\nkerning first=253 second=242 amount=-1\nkerning first=253 second=243 amount=-1\nkerning first=253 second=244 amount=-1\nkerning first=253 second=245 amount=-1\nkerning first=253 second=246 amount=-1\nkerning first=253 second=44  amount=-8\nkerning first=253 second=46  amount=-8\nkerning first=253 second=99  amount=-1\nkerning first=253 second=100 amount=-1\nkerning first=253 second=101 amount=-1\nkerning first=253 second=103 amount=-1\nkerning first=253 second=113 amount=-1\nkerning first=253 second=231 amount=-1\nkerning first=253 second=232 amount=-1\nkerning first=253 second=233 amount=-1\nkerning first=253 second=234 amount=-1\nkerning first=253 second=235 amount=-1\nkerning first=253 second=97  amount=-1\nkerning first=253 second=224 amount=-1\nkerning first=253 second=225 amount=-1\nkerning first=253 second=226 amount=-1\nkerning first=253 second=227 amount=-1\nkerning first=253 second=228 amount=-1\nkerning first=253 second=229 amount=-1\nkerning first=255 second=34  amount=1\nkerning first=255 second=39  amount=1\nkerning first=255 second=111 amount=-1\nkerning first=255 second=242 amount=-1\nkerning first=255 second=243 amount=-1\nkerning first=255 second=244 amount=-1\nkerning first=255 second=245 amount=-1\nkerning first=255 second=246 amount=-1\nkerning first=255 second=44  amount=-8\nkerning first=255 second=46  amount=-8\nkerning first=255 second=99  amount=-1\nkerning first=255 second=100 amount=-1\nkerning first=255 second=101 amount=-1\nkerning first=255 second=103 amount=-1\nkerning first=255 second=113 amount=-1\nkerning first=255 second=231 amount=-1\nkerning first=255 second=232 amount=-1\nkerning first=255 second=233 amount=-1\nkerning first=255 second=234 amount=-1\nkerning first=255 second=235 amount=-1\nkerning first=255 second=97  amount=-1\nkerning first=255 second=224 amount=-1\nkerning first=255 second=225 amount=-1\nkerning first=255 second=226 amount=-1\nkerning first=255 second=227 amount=-1\nkerning first=255 second=228 amount=-1\nkerning first=255 second=229 amount=-1\n";
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
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      group = _ref.group,
      panel = _ref.panel;

  var interaction = (0, _interaction2.default)(panel);

  interaction.events.on('onPressed', handleOnPress);
  interaction.events.on('tick', handleTick);
  interaction.events.on('onReleased', handleOnRelease);

  var tempMatrix = new THREE.Matrix4();
  var tPosition = new THREE.Vector3();

  var oldParent = void 0;

  function getTopLevelFolder(group) {
    var folder = group.folder;
    while (folder.folder !== folder) {
      folder = folder.folder;
    }return folder;
  }

  function handleTick() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        input = _ref2.input;

    var folder = getTopLevelFolder(group);
    if (folder === undefined) {
      return;
    }

    if (input.mouse) {
      if (input.pressed && input.selected && input.raycast.ray.intersectPlane(input.mousePlane, input.mouseIntersection)) {
        if (input.interaction.press === interaction) {
          input.mouseIntersection.sub(input.mouseOffset);

          input.selected.parent.updateMatrixWorld();
          input.selected.parent.worldToLocal(input.mouseIntersection);

          folder.position.copy(input.mouseIntersection);

          return;
        }
      } else if (input.intersections.length > 0) {
        var hitObject = input.intersections[0].object;
        if (hitObject === panel) {
          hitObject.updateMatrixWorld();
          tPosition.setFromMatrixPosition(hitObject.matrixWorld);

          input.mousePlane.setFromNormalAndCoplanarPoint(input.mouseCamera.getWorldDirection(input.mousePlane.normal), tPosition);
          // console.log( input.mousePlane );
        }
      }
    }
  }

  function handleOnPress(p) {
    var inputObject = p.inputObject,
        input = p.input;


    var folder = getTopLevelFolder(group);
    if (folder === undefined) {
      return;
    }

    if (folder.beingMoved === true) {
      return;
    }

    if (input.mouse) {
      if (input.intersections.length > 0) {
        if (input.raycast.ray.intersectPlane(input.mousePlane, input.mouseIntersection)) {
          var hitObject = input.intersections[0].object;
          if (hitObject !== panel) {
            return;
          }

          input.selected = folder;

          input.selected.updateMatrixWorld();
          tPosition.setFromMatrixPosition(input.selected.matrixWorld);

          input.mouseOffset.copy(input.mouseIntersection).sub(tPosition);
          // console.log( input.mouseOffset );
        }
      }
    } else {
      tempMatrix.getInverse(inputObject.matrixWorld);

      folder.matrix.premultiply(tempMatrix);
      folder.matrix.decompose(folder.position, folder.quaternion, folder.scale);

      oldParent = folder.parent;
      inputObject.add(folder);
    }

    p.locked = true;

    folder.beingMoved = true;

    input.events.emit('grabbed', input);
  }

  function handleOnRelease(p) {
    var inputObject = p.inputObject,
        input = p.input;


    var folder = getTopLevelFolder(group);
    if (folder === undefined) {
      return;
    }

    if (folder.beingMoved === false) {
      return;
    }

    if (input.mouse) {
      input.selected = undefined;
    } else {

      if (oldParent === undefined) {
        return;
      }

      folder.matrix.premultiply(inputObject.matrixWorld);
      folder.matrix.decompose(folder.position, folder.quaternion, folder.scale);
      oldParent.add(folder);
      oldParent = undefined;
    }

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
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var grabBar = exports.grabBar = function () {
  var image = new Image();
  image.src = 'data:image/png;base64,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/GMzLdsAADskaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzMiA3OS4xNTkyODQsIDIwMTYvMDQvMTktMTM6MTM6NDAgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgICAgICAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1LjUgKFdpbmRvd3MpPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx4bXA6Q3JlYXRlRGF0ZT4yMDE2LTA5LTI4VDE2OjI1OjMyLTA3OjAwPC94bXA6Q3JlYXRlRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMTYtMDktMjhUMTY6Mzc6MjMtMDc6MDA8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDE2LTA5LTI4VDE2OjM3OjIzLTA3OjAwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8cGhvdG9zaG9wOklDQ1Byb2ZpbGU+c1JHQiBJRUM2MTk2Ni0yLjE8L3Bob3Rvc2hvcDpJQ0NQcm9maWxlPgogICAgICAgICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOmFhYTFjMTQzLTUwZmUtOTQ0My1hNThmLWEyM2VkNTM3MDdmMDwveG1wTU06SW5zdGFuY2VJRD4KICAgICAgICAgPHhtcE1NOkRvY3VtZW50SUQ+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjdlNzdmYmZjLTg1ZDQtMTFlNi1hYzhmLWFjNzU0ZWQ1ODM3ZjwveG1wTU06RG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD54bXAuZGlkOmM1ZmM0ZGYyLTkxY2MtZTI0MS04Y2VjLTMzODIyY2Q1ZWFlOTwveG1wTU06T3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06SGlzdG9yeT4KICAgICAgICAgICAgPHJkZjpTZXE+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPmNyZWF0ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDpjNWZjNGRmMi05MWNjLWUyNDEtOGNlYy0zMzgyMmNkNWVhZTk8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTYtMDktMjhUMTY6MjU6MzItMDc6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1LjUgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y29udmVydGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpwYXJhbWV0ZXJzPmZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmc8L3N0RXZ0OnBhcmFtZXRlcnM+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOmFhYTFjMTQzLTUwZmUtOTQ0My1hNThmLWEyM2VkNTM3MDdmMDwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNi0wOS0yOFQxNjozNzoyMy0wNzowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+MzAwMDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+MzAwMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj42NDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4zMjwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+OhF7RwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAAlElEQVR42uzZsQ3AIAxEUTuTZJRskt5LRFmCdTLapUKCBijo/F0hn2SkJxIKXJJlrsOSFwAAAABA6vKI6O7BUorXdZu1/VEWEZeZfbN5m/ZamjfK+AQAAAAAAAAAAAAAAAAAAAAAACBfuaSna7i/dd1mbX+USTrN7J7N27TX0rxRxgngZYifIAAAAJC4fgAAAP//AwAuMVPw20hxCwAAAABJRU5ErkJggg==';

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
  material.alphaTest = 0.5;

  return function () {
    var geometry = new THREE.PlaneGeometry(image.width / 1000, image.height / 1000, 1, 1);

    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
  };
}();

var downArrow = exports.downArrow = function () {
  var image = new Image();
  image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABACAYAAADS1n9/AAAACXBIWXMAACxLAAAsSwGlPZapAAA4K2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzIgNzkuMTU5Mjg0LCAyMDE2LzA0LzE5LTEzOjEzOjQwICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNS41IChXaW5kb3dzKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAxNi0xMC0xOFQxNzozMzowNi0wNzowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE2LTEwLTIwVDIxOjE4OjI1LTA3OjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAxNi0xMC0yMFQyMToxODoyNS0wNzowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgICAgPHBob3Rvc2hvcDpDb2xvck1vZGU+MzwvcGhvdG9zaG9wOkNvbG9yTW9kZT4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDozMDQyYjI0ZS1iMzc2LWI0NGItOGI4Yy1lZTFjY2IzYWU1MDU8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPnhtcC5kaWQ6MzA0MmIyNGUtYjM3Ni1iNDRiLThiOGMtZWUxY2NiM2FlNTA1PC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6MzA0MmIyNGUtYjM3Ni1iNDRiLThiOGMtZWUxY2NiM2FlNTA1PC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjMwNDJiMjRlLWIzNzYtYjQ0Yi04YjhjLWVlMWNjYjNhZTUwNTwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNi0xMC0xOFQxNzozMzowNi0wNzowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+Mjg4MDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+Mjg4MDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT42NTUzNTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MTI4PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjY0PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz5Uilz0AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAJdSURBVHja7N3LccJAEIThRuW7ncUeTQhkQAiIDMgIhUIIcFQWJgJ88FKlovwArN2d6Z45cZGA/T9viYftxeVyQYzudLEEASAmAMQEgBjJeWl1xymlNwAHAMdxHHvFxU8pDQCWAFbjOH7I7ACT+O8ANnkhFONv8hoc8prwA7iJfx0pBJP412mGoDMQXwrBN/GbIuiMxJdA8Ev8Zgg6Q/GpEdwRvwmCzlh8SgQPxK+OoMYOMDwYnwrBE/GnCAbXAPKTX//jFJuUUu84fv9k/OusS/8QdAbl387eI4L8mPcznKroTlhyB1jOeC5XCGaMX2ItqwFYATipISgQ/5TX0heA/N62FIJS8Ut+TlD0IlAJgcf4VV4GKiDwGr/W+wDUCDzHrwaAFYH3+FUBsCFgiF8dAAsClvhNAHhHwBS/GQCvCNjiNwXgDQFj/OYAvCBgjW8CgHUEzPHNALCKgD2+KQDWECjENwfACgKV+CYBTBD0AM61ERSIfwbQW4xvFkBGcMw7QTUEheKv8nNBADCMQDG+eQC1EKjGB4CFl78RlFJa4usXTF7njJRvz35eD/FdASiIAKrx3QEohACq8V1cA1S6JpCM7xKAQQRu47sFYAiB6/iuARhA4D6+ewANEVDEpwDQAAFNfBoAFRFQxacCUAEBXXw6AAURUManBFAAAW18WgAzIqCOTw1gBgT08ekBTBDsnjh0xx5fAkBGMADYPnDINh+DAKCHQCa+FIA7EUjFlwPwBwK5+JIAfkAgGR9w+JWwOef6zWDV+PIAYuLfxgWAWIIAEBMAYgJAjOR8DgD+6Ozgv4uy9gAAAABJRU5ErkJggg==';

  var texture = new THREE.Texture();
  texture.image = image;
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearMipMapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  // texture.anisotropic
  // texture.generateMipmaps = false;

  var material = new THREE.MeshBasicMaterial({
    // color: 0xff0000,
    side: THREE.DoubleSide,
    transparent: true,
    map: texture
  });
  material.alphaTest = 0.2;

  return function () {
    var h = 0.3;
    var geo = new THREE.PlaneGeometry(image.width / 1000 * h, image.height / 1000 * h, 1, 1);
    geo.translate(-0.005, -0.004, 0);
    return new THREE.Mesh(geo, material);
  };
}();

var checkmark = exports.checkmark = function () {
  var image = new Image();
  image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABACAYAAADS1n9/AAAACXBIWXMAACxLAAAsSwGlPZapAAA4K2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzIgNzkuMTU5Mjg0LCAyMDE2LzA0LzE5LTEzOjEzOjQwICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNS41IChXaW5kb3dzKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAxNi0xMC0xOFQxNzozMzowNi0wNzowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE2LTEwLTIwVDIxOjMzOjUzLTA3OjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAxNi0xMC0yMFQyMTozMzo1My0wNzowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgICAgPHBob3Rvc2hvcDpDb2xvck1vZGU+MzwvcGhvdG9zaG9wOkNvbG9yTW9kZT4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDo2ODcxYTk5Yy0zNjE5LTlkNGEtODdkNi0wYWE5YTRiNWU4Mjc8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPnhtcC5kaWQ6Njg3MWE5OWMtMzYxOS05ZDRhLTg3ZDYtMGFhOWE0YjVlODI3PC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6Njg3MWE5OWMtMzYxOS05ZDRhLTg3ZDYtMGFhOWE0YjVlODI3PC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjY4NzFhOTljLTM2MTktOWQ0YS04N2Q2LTBhYTlhNGI1ZTgyNzwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNi0xMC0xOFQxNzozMzowNi0wNzowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+Mjg4MDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+Mjg4MDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT42NTUzNTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MTI4PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjY0PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz5z9RT3AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAATtSURBVHja7Jzbb5RFGMZ/2xbCvVhASExUiI144w0hQtHEGrHgISqgN6KgtNYWAb0w0Wo1XqrbPbSlokYSxfMhemX/Aa7wGAVq8XTp30DXi5mJm0a2u9v3/b6Z2XludrOHdw/PMzPP+74zX6FWqyGFgYEBElpGD/AecCtwB/Dbcm+Ym5sT+/Cu9P/nim6gCDwCXAt8DVyX5RdIAsgPBaAEjNQ9diPwFbA5CSB+TAFP/c/jW4HPgL4kgHgxCww1eP5m4GN7mwQQEbos+U808dqtwEf2NgkgErc/0yT5Dn12OdiSBBA++aUWyXfYAnwDXJ8EEG6qNwkMryDGZpsi3pAEEB6qV3D7raIP+NKmikkAgeAt4IhgvJvsTJAE4DkKwCngsELss0kA/q/5s8AhhdjTwEFpd5ogS35VaeTPAk8Di0kA/pJfEl7zHU7SuHKYlgAP1vyykNtfihkt8pMAZEkaVohbVYqbBCCIU8CTCnFLwJj2l08CWNma/7aS268Cx6QNXxKArHmeBh5XWk7GsiA/TwGMYfa/hUp+mfYaO824/eGsyM9LAC9gmiPvAzsDI7/Lrs1DSiN/KI8flCXGgVft/V7gDLArIAFMh+r2fRDAS8DEksc2Ah8C/R3s9svAaJ5TWlbkv3yF59Zjdr1s93ja13L7Fev2azELYLwB+Q5rMb3ubR4avpNKbn8aeAa4nLe6tQ3fRJOv7QW+8Ggm6LEjVKOxM4M5D3A57x+pKYAX6wxfs9gAfALs8IB8rcaOKxvXfFC5lgDGgVfafK8zhrty/E+0XHklL7efpQAmWpj2lxPBbTn8J7Po1fZH8QzSAnjNjn4JrMecjsmqWFQA3lVy+yXr9oldAHcKx7sa+DwDY9hj8/yDiqneYicI4FHgR+GYa5WzA83GzhRw1FfyNQTwC3CPvZXEOuBTzEUUJLEqg1TPW/K1TOCfwCBwUTjuNciWjbsxZViNVC+32r4vaeAfwF3AgnDcTVYEtwuNUA3yy5jdu3SyAAB+B3YrLAcbBOoE7yhN+5N2zScJwGAeeAD4TjhuL6aB1Kon6LbkP6Y08o/jSYXPFwEAnAceVhDBVS1mB66xo0H+FKaxs0hgyKodfAF4EPhJqU6w3EywyhqzQ0rkj4RIfpYCALgE7LEzgiRcxbC/wcivoFPedeQHi6y3hP1ljeG8Uoq4NDsoYIo8Wjt5giY/DwHUp4i/KmQHZ+pEUMDs5NFw+0UyOLQRqwDccnAv8L1w3HXAaZsivq5k+IrACSJBnqeD54EDwAfALYJxNwHfKpmysiV/MRYB5H0y6AKwH/hBOO5qYI2C4TsaE/k+CADM1bH3Il8xlETVGr4akcGXs4F/A3fbGcE3VAioth+qAMB0EXd7JoJJPNzGFasAwDSQBpHfVNKu2z9G5PDxePgC8BBwLueRfyLGNT8EAYDZTHIA+QZSs2v+8djcfmgCcHWC+5FvIC3n9kc7hXzfBeCM4R7ky8Yd5/ZDFQD810C6qPgZ0bv9kAVQnyJqFIvexGzmIAnAb1wC7hM2hkXgWToYoV0lzDWQJFLE6Bo7nSAAlyLuY2UNpAoZXootCUAeC5gG0s9tkj9KQtACANNAGqS1PYalRH48AnApYrPby4oEdmgjCaD5FHEvjbeXvYEp7yZEKADnCfZbEfwDPI85L+DIf44OaOy0g38HAM/e7guIRx94AAAAAElFTkSuQmCC';

  var texture = new THREE.Texture();
  texture.image = image;
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearMipMapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  // texture.anisotropic
  // texture.generateMipmaps = false;

  var material = new THREE.MeshBasicMaterial({
    // color: 0xff0000,
    side: THREE.DoubleSide,
    transparent: true,
    map: texture
  });
  material.alphaTest = 0.2;

  return function () {
    var h = 0.4;
    var geo = new THREE.PlaneGeometry(image.width / 1000 * h, image.height / 1000 * h, 1, 1);
    geo.translate(0.025, 0, 0);
    return new THREE.Mesh(geo, material);
  };
}();

},{}],9:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

var GUIVR = function DATGUIVR() {

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
  var hitscanObjects = []; //XXX: this is currently not used.

  /*
    Functions for determining whether a given controller is visible (by which we
    mean not hidden, not 'visible' in terms of the camera orientation etc), and
    for retrieving the list of visible hitscanObjects dynamically.
    This might benefit from some caching especially in cases with large complex GUIs.
    I haven't measured the impact of garbage collection etc.
  */
  function isControllerVisible(control) {
    if (!control.visible) return false;
    var folder = control.folder;
    while (folder.folder !== folder) {
      folder = folder.folder;
      if (folder.isCollapsed() || !folder.visible) return false;
    }
    return true;
  }
  function getVisibleControllers() {
    // not terribly efficient
    return controllers.filter(isControllerVisible);
  }
  function getVisibleHitscanObjects() {
    var tmp = getVisibleControllers().map(function (o) {
      return o.hitscan;
    });
    return tmp.reduce(function (a, b) {
      return a.concat(b);
    }, []);
  }

  var mouseEnabled = false;
  var mouseRenderer = undefined;

  function enableMouse(camera, renderer) {
    mouseEnabled = true;
    mouseRenderer = renderer;
    mouseInput.mouseCamera = camera;
    return mouseInput.laser;
  }

  function disableMouse() {
    mouseEnabled = false;
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
    var inputObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new THREE.Group();

    var input = {
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

    input.laser.add(input.cursor);

    return input;
  }

  /*
    MouseInput.
    Allows you to click on the screen when not in VR for debugging.
  */
  var mouseInput = createMouseInput();

  function createMouseInput() {
    var mouse = new THREE.Vector2(-1, -1);

    var input = createInput();
    input.mouse = mouse;
    input.mouseIntersection = new THREE.Vector3();
    input.mouseOffset = new THREE.Vector3();
    input.mousePlane = new THREE.Plane();
    input.intersections = [];

    //  set my enableMouse
    input.mouseCamera = undefined;

    window.addEventListener('mousemove', function (event) {
      // if a specific renderer has been defined
      if (mouseRenderer) {
        var clientRect = mouseRenderer.domElement.getBoundingClientRect();
        mouse.x = (event.clientX - clientRect.left) / clientRect.width * 2 - 1;
        mouse.y = -((event.clientY - clientRect.top) / clientRect.height) * 2 + 1;
      }
      // default to fullscreen
      else {
          mouse.x = event.clientX / window.innerWidth * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }
    }, false);

    window.addEventListener('mousedown', function (event) {
      if (input.intersections.length > 0) {
        // prevent mouse down from triggering other listeners (polyfill, etc)
        event.stopImmediatePropagation();
        input.pressed = true;
      }
    }, true);

    window.addEventListener('mouseup', function (event) {
      input.pressed = false;
    }, false);

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

    input.laser.pressed = function (flag) {
      // only pay attention to presses over the GUI
      if (flag && input.intersections.length > 0) {
        input.pressed = true;
      } else {
        input.pressed = false;
      }
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
    var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.0;
    var max = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100.0;

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
     Not used directly. Used by folders.
  */

  function add(object, propertyName, arg3, arg4) {

    if (object === undefined) {
      return undefined;
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

    //  add couldn't figure it out, pass it back to folder
    return undefined;
  }

  function addSimpleSlider() {
    var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    var proxy = {
      number: min
    };

    return addSlider(proxy, 'number', min, max);
  }

  function addSimpleDropdown() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var proxy = {
      option: ''
    };

    if (options !== undefined) {
      proxy.option = isArray(options) ? options[0] : options[Object.keys(options)[0]];
    }

    return addDropdown(proxy, 'option', options);
  }

  function addSimpleCheckbox() {
    var defaultOption = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    var proxy = {
      checked: defaultOption
    };

    return addCheckbox(proxy, 'checked');
  }

  function addSimpleButton(fn) {
    var proxy = {
      button: fn !== undefined ? fn : function () {}
    };

    return addButton(proxy, 'button');
  }

  /*
    Creates a folder with the name.
     Folders are THREE.Group type objects and can do group.add() for siblings.
    Folders will automatically attempt to lay its children out in sequence.
     Folders are given the add() functionality so that they can do
    folder.add( ... ) to create controllers.
  */

  function create(name) {
    var folder = (0, _folder2.default)({
      textCreator: textCreator,
      name: name,
      guiAdd: add,
      addSlider: addSimpleSlider,
      addDropdown: addSimpleDropdown,
      addCheckbox: addSimpleCheckbox,
      addButton: addSimpleButton
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

    var hitscanObjects = getVisibleHitscanObjects();

    if (mouseEnabled) {
      mouseInput.intersections = performMouseInput(hitscanObjects, mouseInput);
    }

    inputObjects.forEach(function () {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          box = _ref.box,
          object = _ref.object,
          raycast = _ref.raycast,
          laser = _ref.laser,
          cursor = _ref.cursor;

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
      //nb, we could do a more thorough check for visibilty, not sure how important
      //this bit is at this stage...
      if (controller.visible) controller.updateControl(inputs);
    });
  }

  function updateLaser(laser, point) {
    laser.geometry.vertices[1].copy(point);
    laser.visible = true;
    laser.geometry.computeBoundingSphere();
    laser.geometry.computeBoundingBox();
    laser.geometry.verticesNeedUpdate = true;
  }

  function parseIntersections(intersections, laser, cursor) {
    if (intersections.length > 0) {
      var firstHit = intersections[0];
      updateLaser(laser, firstHit.point);
      cursor.position.copy(firstHit.point);
      cursor.visible = true;
      cursor.updateMatrixWorld();
    } else {
      laser.visible = false;
      cursor.visible = false;
    }
  }

  function parseMouseIntersection(intersection, laser, cursor) {
    cursor.position.copy(intersection);
    updateLaser(laser, cursor.position);
  }

  function performMouseIntersection(raycast, mouse, camera) {
    raycast.setFromCamera(mouse, camera);
    var hitscanObjects = getVisibleHitscanObjects();
    return raycast.intersectObjects(hitscanObjects, false);
  }

  function mouseIntersectsPlane(raycast, v, plane) {
    return raycast.ray.intersectPlane(plane, v);
  }

  function performMouseInput(hitscanObjects) {
    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        box = _ref2.box,
        object = _ref2.object,
        raycast = _ref2.raycast,
        laser = _ref2.laser,
        cursor = _ref2.cursor,
        mouse = _ref2.mouse,
        mouseCamera = _ref2.mouseCamera;

    var intersections = [];

    if (mouseCamera) {
      intersections = performMouseIntersection(raycast, mouse, mouseCamera);
      parseIntersections(intersections, laser, cursor);
      cursor.visible = true;
      laser.visible = true;
    }

    return intersections;
  }

  update();

  /*
    Public methods.
  */

  return {
    create: create,
    addInputObject: addInputObject,
    enableMouse: enableMouse,
    disableMouse: disableMouse
  };
}();

if (window) {
  if (window.dat === undefined) {
    window.dat = {};
  }

  window.dat.GUIVR = GUIVR;
}

if (module) {
  module.exports = {
    dat: GUIVR
  };
}

if (typeof define === 'function' && define.amd) {
  define([], GUIVR);
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
    if (gamepad && gamepad.hapticActuators.length > 0) {
      gamepad.hapticActuators[0].pulse(t, a);
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

},{"./button":1,"./checkbox":2,"./dropdown":4,"./folder":5,"./sdftext":13,"./slider":15,"events":21}],10:[function(require,module,exports){
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
  var anyActive = false;

  var tVector = new THREE.Vector3();
  var availableInputs = [];

  function update(inputObjects) {

    anyHover = false;
    anyPressing = false;
    anyActive = false;

    inputObjects.forEach(function (input) {

      if (availableInputs.indexOf(input) < 0) {
        availableInputs.push(input);
      }

      var _extractHit = extractHit(input),
          hitObject = _extractHit.hitObject,
          hitPoint = _extractHit.hitPoint;

      var hover = hitVolume === hitObject;
      anyHover = anyHover || hover;

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

      events.emit('tick', {
        input: input,
        hitObject: hitObject,
        inputObject: input.object
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
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        input = _ref.input,
        hover = _ref.hover,
        hitObject = _ref.hitObject,
        hitPoint = _ref.hitPoint,
        buttonName = _ref.buttonName,
        interactionName = _ref.interactionName,
        downName = _ref.downName,
        holdName = _ref.holdName,
        upName = _ref.upName;

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
      return anyHover;
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

},{"events":21}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CHECKBOX_SIZE = exports.BORDER_THICKNESS = exports.FOLDER_GRAB_HEIGHT = exports.FOLDER_HEIGHT = exports.SUBFOLDER_WIDTH = exports.FOLDER_WIDTH = exports.BUTTON_DEPTH = exports.CONTROLLER_ID_DEPTH = exports.CONTROLLER_ID_WIDTH = exports.PANEL_VALUE_TEXT_MARGIN = exports.PANEL_LABEL_TEXT_MARGIN = exports.PANEL_MARGIN = exports.PANEL_SPACING = exports.PANEL_DEPTH = exports.PANEL_HEIGHT = exports.PANEL_WIDTH = undefined;
exports.alignLeft = alignLeft;
exports.createPanel = createPanel;
exports.resizePanel = resizePanel;
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

function createPanel(width, height, depth, uniqueMaterial) {
  var material = uniqueMaterial ? new THREE.MeshBasicMaterial({ color: 0xffffff }) : SharedMaterials.PANEL;
  var panel = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  panel.geometry.translate(width * 0.5, 0, 0);

  if (uniqueMaterial) {
    material.color.setHex(Colors.DEFAULT_BACK);
  } else {
    Colors.colorizeGeometry(panel.geometry, Colors.DEFAULT_BACK);
  }

  panel.userData.currentWidth = width;
  panel.userData.currentHeight = height;
  panel.userData.currentDepth = depth;

  return panel;
}
function resizePanel(panel, width, height, depth) {
  panel.geometry.scale(width / panel.userData.currentWidth, height / panel.userData.currentHeight, depth / panel.userData.currentDepth);
  panel.userData.currentWidth = width;
  panel.userData.currentHeight = height;
  panel.userData.currentDepth = depth;
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
var PANEL_DEPTH = exports.PANEL_DEPTH = 0.01;
var PANEL_SPACING = exports.PANEL_SPACING = 0.001;
var PANEL_MARGIN = exports.PANEL_MARGIN = 0.015;
var PANEL_LABEL_TEXT_MARGIN = exports.PANEL_LABEL_TEXT_MARGIN = 0.06;
var PANEL_VALUE_TEXT_MARGIN = exports.PANEL_VALUE_TEXT_MARGIN = 0.02;
var CONTROLLER_ID_WIDTH = exports.CONTROLLER_ID_WIDTH = 0.02;
var CONTROLLER_ID_DEPTH = exports.CONTROLLER_ID_DEPTH = 0.001;
var BUTTON_DEPTH = exports.BUTTON_DEPTH = 0.01;
var FOLDER_WIDTH = exports.FOLDER_WIDTH = 1.026;
var SUBFOLDER_WIDTH = exports.SUBFOLDER_WIDTH = 1.0;
var FOLDER_HEIGHT = exports.FOLDER_HEIGHT = 0.09;
var FOLDER_GRAB_HEIGHT = exports.FOLDER_GRAB_HEIGHT = 0.0512;
var BORDER_THICKNESS = exports.BORDER_THICKNESS = 0.01;
var CHECKBOX_SIZE = exports.CHECKBOX_SIZE = 0.05;

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
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      group = _ref.group,
      panel = _ref.panel;

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
    var inputObject = p.inputObject,
        input = p.input;


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
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        inputObject = _ref2.inputObject,
        input = _ref2.input;

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

var textScale = 0.00024;

function creator() {

  var font = (0, _parseBmfontAscii2.default)(Font.fnt());

  var colorMaterials = {};

  function createText(str, font) {
    var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0xffffff;
    var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;


    var geometry = (0, _threeBmfontText2.default)({
      text: str,
      align: 'left',
      width: 10000,
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
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$color = _ref.color,
        color = _ref$color === undefined ? 0xffffff : _ref$color,
        _ref$scale = _ref.scale,
        scale = _ref$scale === undefined ? 1.0 : _ref$scale;

    var group = new THREE.Group();

    var mesh = createText(str, font, color, scale);
    group.add(mesh);
    group.layout = mesh.geometry.layout;

    group.updateLabel = function (str) {
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

},{"./font":6,"parse-bmfont-ascii":27,"three-bmfont-text":29,"three-bmfont-text/shaders/sdf":32}],14:[function(require,module,exports){
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
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      textCreator = _ref.textCreator,
      object = _ref.object,
      _ref$propertyName = _ref.propertyName,
      propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName,
      _ref$initialValue = _ref.initialValue,
      initialValue = _ref$initialValue === undefined ? 0.0 : _ref$initialValue,
      _ref$min = _ref.min,
      min = _ref$min === undefined ? 0.0 : _ref$min,
      _ref$max = _ref.max,
      max = _ref$max === undefined ? 1.0 : _ref$max,
      _ref$step = _ref.step,
      step = _ref$step === undefined ? 0.1 : _ref$step,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? Layout.PANEL_HEIGHT : _ref$height,
      _ref$depth = _ref.depth,
      depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth;

  var SLIDER_WIDTH = width * 0.5 - Layout.PANEL_MARGIN;
  var SLIDER_HEIGHT = height - Layout.PANEL_MARGIN;
  var SLIDER_DEPTH = depth;

  var state = {
    alpha: 1.0,
    value: initialValue,
    step: step,
    useStep: true,
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
  filledVolume.position.z = depth * 0.5;
  hitscanVolume.add(filledVolume);

  var endLocator = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05, 1, 1, 1), SharedMaterials.LOCATOR);
  endLocator.position.x = SLIDER_WIDTH;
  hitscanVolume.add(endLocator);
  endLocator.visible = false;

  var valueLabel = textCreator.create(state.value.toString());
  valueLabel.position.x = Layout.PANEL_VALUE_TEXT_MARGIN + width * 0.5;
  valueLabel.position.z = depth * 2.5;
  valueLabel.position.y = -0.0325;

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
  updateSlider();

  function updateValueLabel(value) {
    if (state.useStep) {
      valueLabel.updateLabel(roundToDecimal(state.value, state.precision).toString());
    } else {
      valueLabel.updateLabel(state.value.toString());
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

  function updateSlider() {
    filledVolume.scale.x = Math.min(Math.max(getAlphaFromValue(state.value, state.min, state.max) * width, 0.000001), width);
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
    updateSlider();
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
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        point = _ref2.point;

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
    updateSlider();
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

  group.updateControl = function (inputObjects) {
    interaction.update(inputObjects);
    grabInteraction.update(inputObjects);
    paletteInteraction.update(inputObjects);

    if (state.listen) {
      listenUpdate();
      updateValueLabel(state.value);
      updateSlider();
    }
    updateView();
  };

  group.name = function (str) {
    descriptorLabel.updateLabel(str);
    return group;
  };

  group.min = function (m) {
    state.min = m;
    state.alpha = getAlphaFromValue(state.value, state.min, state.max);
    updateStateFromAlpha(state.alpha);
    updateValueLabel(state.value);
    updateSlider();
    return group;
  };

  group.max = function (m) {
    state.max = m;
    state.alpha = getAlphaFromValue(state.value, state.min, state.max);
    updateStateFromAlpha(state.alpha);
    updateValueLabel(state.value);
    updateSlider();
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
  var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.4;
  var depth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.029;
  var fgColor = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0xffffff;
  var bgColor = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : Colors.DEFAULT_BACK;
  var scale = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 1.0;


  var group = new THREE.Group();
  var internalPositioning = new THREE.Group();
  group.add(internalPositioning);

  var text = textCreator.create(str, { color: fgColor, scale: scale });
  internalPositioning.add(text);

  group.setString = function (str) {
    text.updateLabel(str.toString());
  };

  group.setNumber = function (str) {
    text.updateLabel(str.toFixed(2));
  };

  text.position.z = depth;

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

},{"dtype":20}],23:[function(require,module,exports){
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
 * @author   Feross Aboukhadijeh <https://feross.org>
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

function findChar (array, value, start) {
  start = start || 0
  for (var i = start; i < array.length; i++) {
    if (array[i].id === value) {
      return i
    }
  }
  return -1
}
},{"as-number":19,"word-wrapper":34,"xtend":35}],26:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
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
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
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
	} catch (err) {
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

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
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
},{"an-array":18,"dtype":20,"is-buffer":24}],29:[function(require,module,exports){
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

    var needsNewBuffer = attrib && typeof attrib.setArray !== 'function'
    if (!attrib || needsNewBuffer) {
      // We are on an old version of ThreeJS which can't
      // support growing / shrinking buffers, so we need
      // to build a new buffer
      if (needsNewBuffer && !warned) {
        warned = true
        console.warn([
          'A WebGL buffer is being updated with a new size or itemSize, ',
          'however this version of ThreeJS only supports fixed-size buffers.',
          '\nThe old buffer may still be kept in memory.\n',
          'To avoid memory leaks, it is recommended that you dispose ',
          'your geometries and create new ones, or update to ThreeJS r82 or newer.\n',
          'See here for discussion:\n',
          'https://github.com/mrdoob/three.js/pull/9631'
        ].join(''))
      }

      // Build a new attribute
      attrib = new THREE.BufferAttribute(data, itemSize);
    }

    attrib.itemSize = itemSize
    attrib.needsUpdate = true

    // New versions of ThreeJS suggest using setArray
    // to change the data. It will use bufferData internally,
    // so you can change the array size without any issues
    if (typeof attrib.setArray === 'function') {
      attrib.setArray(data)
    }

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

},{"flatten-vertex-data":22}],34:[function(require,module,exports){
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

},{}]},{},[9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzL2RhdGd1aXZyL2J1dHRvbi5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvY2hlY2tib3guanMiLCJtb2R1bGVzL2RhdGd1aXZyL2NvbG9ycy5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvZHJvcGRvd24uanMiLCJtb2R1bGVzL2RhdGd1aXZyL2ZvbGRlci5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvZm9udC5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvZ3JhYi5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvZ3JhcGhpYy5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvaW5kZXguanMiLCJtb2R1bGVzL2RhdGd1aXZyL2ludGVyYWN0aW9uLmpzIiwibW9kdWxlcy9kYXRndWl2ci9sYXlvdXQuanMiLCJtb2R1bGVzL2RhdGd1aXZyL3BhbGV0dGUuanMiLCJtb2R1bGVzL2RhdGd1aXZyL3NkZnRleHQuanMiLCJtb2R1bGVzL2RhdGd1aXZyL3NoYXJlZG1hdGVyaWFscy5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvc2xpZGVyLmpzIiwibW9kdWxlcy9kYXRndWl2ci90ZXh0bGFiZWwuanMiLCJtb2R1bGVzL3RoaXJkcGFydHkvU3ViZGl2aXNpb25Nb2RpZmllci5qcyIsIm5vZGVfbW9kdWxlcy9hbi1hcnJheS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hcy1udW1iZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZHR5cGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9mbGF0dGVuLXZlcnRleC1kYXRhL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvaXMtYnVmZmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xheW91dC1ibWZvbnQtdGV4dC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3BhcnNlLWJtZm9udC1hc2NpaS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9xdWFkLWluZGljZXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvbGliL3V0aWxzLmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L2xpYi92ZXJ0aWNlcy5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1ibWZvbnQtdGV4dC9zaGFkZXJzL3NkZi5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1idWZmZXItdmVydGV4LWRhdGEvaW5kZXguanMiLCJub2RlX21vZHVsZXMvd29yZC13cmFwcGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3h0ZW5kL2ltbXV0YWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O2tCQzRCd0IsWTs7QUFUeEI7O0lBQVksbUI7O0FBRVo7Ozs7QUFDQTs7OztBQUNBOztJQUFZLE07O0FBQ1o7O0lBQVksTTs7QUFDWjs7SUFBWSxlOztBQUNaOztJQUFZLEk7Ozs7OztBQUVHLFNBQVMsWUFBVCxHQU9QO0FBQUEsaUZBQUosRUFBSTtBQUFBLE1BTk4sV0FNTSxRQU5OLFdBTU07QUFBQSxNQUxOLE1BS00sUUFMTixNQUtNO0FBQUEsK0JBSk4sWUFJTTtBQUFBLE1BSk4sWUFJTSxxQ0FKUyxXQUlUO0FBQUEsd0JBSE4sS0FHTTtBQUFBLE1BSE4sS0FHTSw4QkFIRSxPQUFPLFdBR1Q7QUFBQSx5QkFGTixNQUVNO0FBQUEsTUFGTixNQUVNLCtCQUZHLE9BQU8sWUFFVjtBQUFBLHdCQUROLEtBQ007QUFBQSxNQUROLEtBQ00sOEJBREUsT0FBTyxXQUNUOztBQUVOLE1BQU0sZUFBZSxRQUFRLEdBQVIsR0FBYyxPQUFPLFlBQTFDO0FBQ0EsTUFBTSxnQkFBZ0IsU0FBUyxPQUFPLFlBQXRDO0FBQ0EsTUFBTSxl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Qjs7QUFFZDtBQUVBLEVBblBEO0FBcVBBLENBNVZEOzs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcbipcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXG4qXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbipcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cblxuaW1wb3J0ICogYXMgU3ViZGl2aXNpb25Nb2RpZmllciBmcm9tICcuLi90aGlyZHBhcnR5L1N1YmRpdmlzaW9uTW9kaWZpZXInO1xuXG5pbXBvcnQgY3JlYXRlVGV4dExhYmVsIGZyb20gJy4vdGV4dGxhYmVsJztcbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XG5pbXBvcnQgKiBhcyBMYXlvdXQgZnJvbSAnLi9sYXlvdXQnO1xuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcbmltcG9ydCAqIGFzIEdyYWIgZnJvbSAnLi9ncmFiJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlQnV0dG9uKCB7XG4gIHRleHRDcmVhdG9yLFxuICBvYmplY3QsXG4gIHByb3BlcnR5TmFtZSA9ICd1bmRlZmluZWQnLFxuICB3aWR0aCA9IExheW91dC5QQU5FTF9XSURUSCxcbiAgaGVpZ2h0ID0gTGF5b3V0LlBBTkVMX0hFSUdIVCxcbiAgZGVwdGggPSBMYXlvdXQuUEFORUxfREVQVEhcbn0gPSB7fSApe1xuXG4gIGNvbnN0IEJVVFRPTl9XSURUSCA9IHdpZHRoICogMC41IC0gTGF5b3V0LlBBTkVMX01BUkdJTjtcbiAgY29uc3QgQlVUVE9OX0hFSUdIVCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU47XG4gIGNvbnN0IEJVVFRPTl9ERVBUSCA9IExheW91dC5CVVRUT05fREVQVEg7XG5cbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcblxuICBjb25zdCBwYW5lbCA9IExheW91dC5jcmVhdGVQYW5lbCggd2lkdGgsIGhlaWdodCwgZGVwdGggKTtcbiAgZ3JvdXAuYWRkKCBwYW5lbCApO1xuXG4gIC8vICBiYXNlIGNoZWNrYm94XG4gIGNvbnN0IGRpdmlzaW9ucyA9IDQ7XG4gIGNvbnN0IGFzcGVjdFJhdGlvID0gQlVUVE9OX1dJRFRIIC8gQlVUVE9OX0hFSUdIVDtcbiAgY29uc3QgcmVjdCA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggQlVUVE9OX1dJRFRILCBCVVRUT05fSEVJR0hULCBCVVRUT05fREVQVEgsIE1hdGguZmxvb3IoIGRpdmlzaW9ucyAqIGFzcGVjdFJhdGlvICksIGRpdmlzaW9ucywgZGl2aXNpb25zICk7XG4gIGNvbnN0IG1vZGlmaWVyID0gbmV3IFRIUkVFLlN1YmRpdmlzaW9uTW9kaWZpZXIoIDEgKTtcbiAgbW9kaWZpZXIubW9kaWZ5KCByZWN0ICk7XG4gIHJlY3QudHJhbnNsYXRlKCBCVVRUT05fV0lEVEggKiAwLjUsIDAsIDAgKTtcblxuICAvLyAgaGl0c2NhbiB2b2x1bWVcbiAgY29uc3QgaGl0c2Nhbk1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCk7XG4gIGhpdHNjYW5NYXRlcmlhbC52aXNpYmxlID0gZmFsc2U7XG5cbiAgY29uc3QgaGl0c2NhblZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIGhpdHNjYW5NYXRlcmlhbCApO1xuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnogPSBCVVRUT05fREVQVEggKiAwLjU7XG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueCA9IHdpZHRoICogMC41O1xuXG4gIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6IENvbG9ycy5CVVRUT05fQ09MT1IgfSk7XG4gIGNvbnN0IGZpbGxlZFZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIG1hdGVyaWFsICk7XG4gIGhpdHNjYW5Wb2x1bWUuYWRkKCBmaWxsZWRWb2x1bWUgKTtcblxuXG4gIGNvbnN0IGJ1dHRvbkxhYmVsID0gdGV4dENyZWF0b3IuY3JlYXRlKCBwcm9wZXJ0eU5hbWUsIHsgc2NhbGU6IDAuODY2IH0gKTtcblxuICAvLyAgVGhpcyBpcyBhIHJlYWwgaGFjayBzaW5jZSB3ZSBuZWVkIHRvIGZpdCB0aGUgdGV4dCBwb3NpdGlvbiB0byB0aGUgZm9udCBzY2FsaW5nXG4gIC8vICBQbGVhc2UgZml4IG1lLlxuICBidXR0b25MYWJlbC5wb3NpdGlvbi54ID0gQlVUVE9OX1dJRFRIICogMC41IC0gYnV0dG9uTGFiZWwubGF5b3V0LndpZHRoICogMC4wMDAwMTEgKiAwLjU7XG4gIGJ1dHRvbkxhYmVsLnBvc2l0aW9uLnogPSBCVVRUT05fREVQVEggKiAxLjI7XG4gIGJ1dHRvbkxhYmVsLnBvc2l0aW9uLnkgPSAtMC4wMjU7XG4gIGZpbGxlZFZvbHVtZS5hZGQoIGJ1dHRvbkxhYmVsICk7XG5cblxuICBjb25zdCBkZXNjcmlwdG9yTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHByb3BlcnR5TmFtZSApO1xuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9MQUJFTF9URVhUX01BUkdJTjtcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnkgPSAtMC4wMztcblxuICBjb25zdCBjb250cm9sbGVySUQgPSBMYXlvdXQuY3JlYXRlQ29udHJvbGxlcklEQm94KCBoZWlnaHQsIENvbG9ycy5DT05UUk9MTEVSX0lEX0JVVFRPTiApO1xuICBjb250cm9sbGVySUQucG9zaXRpb24ueiA9IGRlcHRoO1xuXG4gIHBhbmVsLmFkZCggZGVzY3JpcHRvckxhYmVsLCBoaXRzY2FuVm9sdW1lLCBjb250cm9sbGVySUQgKTtcblxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBoaXRzY2FuVm9sdW1lICk7XG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGhhbmRsZU9uUHJlc3MgKTtcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25SZWxlYXNlZCcsIGhhbmRsZU9uUmVsZWFzZSApO1xuXG4gIHVwZGF0ZVZpZXcoKTtcblxuICBmdW5jdGlvbiBoYW5kbGVPblByZXNzKCBwICl7XG4gICAgaWYoIGdyb3VwLnZpc2libGUgPT09IGZhbHNlICl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSgpO1xuXG4gICAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi56ID0gQlVUVE9OX0RFUFRIICogMC4xO1xuXG4gICAgcC5sb2NrZWQgPSB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlT25SZWxlYXNlKCl7XG4gICAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi56ID0gQlVUVE9OX0RFUFRIICogMC41O1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlVmlldygpe1xuXG4gICAgaWYoIGludGVyYWN0aW9uLmhvdmVyaW5nKCkgKXtcbiAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkJVVFRPTl9ISUdITElHSFRfQ09MT1IgKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkJVVFRPTl9DT0xPUiApO1xuICAgIH1cblxuICB9XG5cbiAgZ3JvdXAuaW50ZXJhY3Rpb24gPSBpbnRlcmFjdGlvbjtcbiAgZ3JvdXAuaGl0c2NhbiA9IFsgaGl0c2NhblZvbHVtZSwgcGFuZWwgXTtcblxuICBjb25zdCBncmFiSW50ZXJhY3Rpb24gPSBHcmFiLmNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSApO1xuXG4gIGdyb3VwLnVwZGF0ZUNvbnRyb2wgPSBmdW5jdGlvbiggaW5wdXRPYmplY3RzICl7XG4gICAgaW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcbiAgICBncmFiSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcbiAgICB1cGRhdGVWaWV3KCk7XG4gIH07XG5cbiAgZ3JvdXAubmFtZSA9IGZ1bmN0aW9uKCBzdHIgKXtcbiAgICBkZXNjcmlwdG9yTGFiZWwudXBkYXRlTGFiZWwoIHN0ciApO1xuICAgIHJldHVybiBncm91cDtcbiAgfTtcblxuXG4gIHJldHVybiBncm91cDtcbn0iLCIvKipcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXG4qXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxuKlxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuKlxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4qXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbmltcG9ydCBjcmVhdGVUZXh0TGFiZWwgZnJvbSAnLi90ZXh0bGFiZWwnO1xuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcbmltcG9ydCAqIGFzIExheW91dCBmcm9tICcuL2xheW91dCc7XG5pbXBvcnQgKiBhcyBHcmFwaGljIGZyb20gJy4vZ3JhcGhpYyc7XG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xuaW1wb3J0ICogYXMgR3JhYiBmcm9tICcuL2dyYWInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVDaGVja2JveCgge1xuICB0ZXh0Q3JlYXRvcixcbiAgb2JqZWN0LFxuICBwcm9wZXJ0eU5hbWUgPSAndW5kZWZpbmVkJyxcbiAgaW5pdGlhbFZhbHVlID0gZmFsc2UsXG4gIHdpZHRoID0gTGF5b3V0LlBBTkVMX1dJRFRILFxuICBoZWlnaHQgPSBMYXlvdXQuUEFORUxfSEVJR0hULFxuICBkZXB0aCA9IExheW91dC5QQU5FTF9ERVBUSFxufSA9IHt9ICl7XG5cbiAgY29uc3QgQ0hFQ0tCT1hfV0lEVEggPSBMYXlvdXQuQ0hFQ0tCT1hfU0laRTtcbiAgY29uc3QgQ0hFQ0tCT1hfSEVJR0hUID0gQ0hFQ0tCT1hfV0lEVEg7XG4gIGNvbnN0IENIRUNLQk9YX0RFUFRIID0gZGVwdGg7XG5cbiAgY29uc3QgSU5BQ1RJVkVfU0NBTEUgPSAwLjAwMTtcbiAgY29uc3QgQUNUSVZFX1NDQUxFID0gMC45O1xuXG4gIGNvbnN0IHN0YXRlID0ge1xuICAgIHZhbHVlOiBpbml0aWFsVmFsdWUsXG4gICAgbGlzdGVuOiBmYWxzZVxuICB9O1xuXG4gIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG5cbiAgY29uc3QgcGFuZWwgPSBMYXlvdXQuY3JlYXRlUGFuZWwoIHdpZHRoLCBoZWlnaHQsIGRlcHRoICk7XG4gIGdyb3VwLmFkZCggcGFuZWwgKTtcblxuICAvLyAgYmFzZSBjaGVja2JveFxuICBjb25zdCByZWN0ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KCBDSEVDS0JPWF9XSURUSCwgQ0hFQ0tCT1hfSEVJR0hULCBDSEVDS0JPWF9ERVBUSCApO1xuICByZWN0LnRyYW5zbGF0ZSggQ0hFQ0tCT1hfV0lEVEggKiAwLjUsIDAsIDAgKTtcblxuXG4gIC8vICBoaXRzY2FuIHZvbHVtZVxuICBjb25zdCBoaXRzY2FuTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoKTtcbiAgaGl0c2Nhbk1hdGVyaWFsLnZpc2libGUgPSBmYWxzZTtcblxuICBjb25zdCBoaXRzY2FuVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgaGl0c2Nhbk1hdGVyaWFsICk7XG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueiA9IGRlcHRoO1xuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnggPSB3aWR0aCAqIDAuNTtcblxuICAvLyAgb3V0bGluZSB2b2x1bWVcbiAgLy8gY29uc3Qgb3V0bGluZSA9IG5ldyBUSFJFRS5Cb3hIZWxwZXIoIGhpdHNjYW5Wb2x1bWUgKTtcbiAgLy8gb3V0bGluZS5tYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5PVVRMSU5FX0NPTE9SICk7XG5cbiAgLy8gIGNoZWNrYm94IHZvbHVtZVxuICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiBDb2xvcnMuQ0hFQ0tCT1hfQkdfQ09MT1IgfSk7XG4gIGNvbnN0IGZpbGxlZFZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIG1hdGVyaWFsICk7XG4gIC8vIGZpbGxlZFZvbHVtZS5zY2FsZS5zZXQoIEFDVElWRV9TQ0FMRSwgQUNUSVZFX1NDQUxFLEFDVElWRV9TQ0FMRSApO1xuICBoaXRzY2FuVm9sdW1lLmFkZCggZmlsbGVkVm9sdW1lICk7XG5cblxuICBjb25zdCBkZXNjcmlwdG9yTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHByb3BlcnR5TmFtZSApO1xuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9MQUJFTF9URVhUX01BUkdJTjtcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnkgPSAtMC4wMztcblxuICBjb25zdCBjb250cm9sbGVySUQgPSBMYXlvdXQuY3JlYXRlQ29udHJvbGxlcklEQm94KCBoZWlnaHQsIENvbG9ycy5DT05UUk9MTEVSX0lEX0NIRUNLQk9YICk7XG4gIGNvbnRyb2xsZXJJRC5wb3NpdGlvbi56ID0gZGVwdGg7XG5cbiAgY29uc3QgYm9yZGVyQm94ID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCBDSEVDS0JPWF9XSURUSCArIExheW91dC5CT1JERVJfVEhJQ0tORVNTLCBDSEVDS0JPWF9IRUlHSFQgKyBMYXlvdXQuQk9SREVSX1RISUNLTkVTUywgQ0hFQ0tCT1hfREVQVEgsIHRydWUgKTtcbiAgYm9yZGVyQm94Lm1hdGVyaWFsLmNvbG9yLnNldEhleCggMHgxZjdhZTcgKTtcbiAgYm9yZGVyQm94LnBvc2l0aW9uLnggPSAtTGF5b3V0LkJPUkRFUl9USElDS05FU1MgKiAwLjUgKyB3aWR0aCAqIDAuNTtcbiAgYm9yZGVyQm94LnBvc2l0aW9uLnogPSBkZXB0aCAqIDAuNTtcblxuICBjb25zdCBjaGVja21hcmsgPSBHcmFwaGljLmNoZWNrbWFyaygpO1xuICBjaGVja21hcmsucG9zaXRpb24ueiA9IGRlcHRoICogMC41MTtcbiAgaGl0c2NhblZvbHVtZS5hZGQoIGNoZWNrbWFyayApO1xuXG4gIHBhbmVsLmFkZCggZGVzY3JpcHRvckxhYmVsLCBoaXRzY2FuVm9sdW1lLCBjb250cm9sbGVySUQsIGJvcmRlckJveCApO1xuXG4gIC8vIGdyb3VwLmFkZCggZmlsbGVkVm9sdW1lLCBvdXRsaW5lLCBoaXRzY2FuVm9sdW1lLCBkZXNjcmlwdG9yTGFiZWwgKTtcblxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBoaXRzY2FuVm9sdW1lICk7XG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGhhbmRsZU9uUHJlc3MgKTtcblxuICB1cGRhdGVWaWV3KCk7XG5cbiAgZnVuY3Rpb24gaGFuZGxlT25QcmVzcyggcCApe1xuICAgIGlmKCBncm91cC52aXNpYmxlID09PSBmYWxzZSApe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHN0YXRlLnZhbHVlID0gIXN0YXRlLnZhbHVlO1xuXG4gICAgb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSA9IHN0YXRlLnZhbHVlO1xuXG4gICAgaWYoIG9uQ2hhbmdlZENCICl7XG4gICAgICBvbkNoYW5nZWRDQiggc3RhdGUudmFsdWUgKTtcbiAgICB9XG5cbiAgICBwLmxvY2tlZCA9IHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XG5cbiAgICBpZiggc3RhdGUudmFsdWUgKXtcbiAgICAgIGNoZWNrbWFyay52aXNpYmxlID0gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIGNoZWNrbWFyay52aXNpYmxlID0gZmFsc2U7XG4gICAgfVxuICAgIGlmKCBpbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XG4gICAgICBib3JkZXJCb3gudmlzaWJsZSA9IHRydWU7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICBib3JkZXJCb3gudmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cblxuICB9XG5cbiAgbGV0IG9uQ2hhbmdlZENCO1xuICBsZXQgb25GaW5pc2hDaGFuZ2VDQjtcblxuICBncm91cC5vbkNoYW5nZSA9IGZ1bmN0aW9uKCBjYWxsYmFjayApe1xuICAgIG9uQ2hhbmdlZENCID0gY2FsbGJhY2s7XG4gICAgcmV0dXJuIGdyb3VwO1xuICB9O1xuXG4gIGdyb3VwLmludGVyYWN0aW9uID0gaW50ZXJhY3Rpb247XG4gIGdyb3VwLmhpdHNjYW4gPSBbIGhpdHNjYW5Wb2x1bWUsIHBhbmVsIF07XG5cbiAgY29uc3QgZ3JhYkludGVyYWN0aW9uID0gR3JhYi5jcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gKTtcblxuICBncm91cC5saXN0ZW4gPSBmdW5jdGlvbigpe1xuICAgIHN0YXRlLmxpc3RlbiA9IHRydWU7XG4gICAgcmV0dXJuIGdyb3VwO1xuICB9O1xuXG4gIGdyb3VwLm5hbWUgPSBmdW5jdGlvbiggc3RyICl7XG4gICAgZGVzY3JpcHRvckxhYmVsLnVwZGF0ZUxhYmVsKCBzdHIgKTtcbiAgICByZXR1cm4gZ3JvdXA7XG4gIH07XG5cbiAgZ3JvdXAudXBkYXRlQ29udHJvbCA9IGZ1bmN0aW9uKCBpbnB1dE9iamVjdHMgKXtcbiAgICBpZiggc3RhdGUubGlzdGVuICl7XG4gICAgICBzdGF0ZS52YWx1ZSA9IG9iamVjdFsgcHJvcGVydHlOYW1lIF07XG4gICAgfVxuICAgIGludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XG4gICAgdXBkYXRlVmlldygpO1xuICB9O1xuXG5cbiAgcmV0dXJuIGdyb3VwO1xufSIsIi8qKlxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcbipcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXG4qXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbipcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfQ09MT1IgPSAweDJGQTFENjtcbmV4cG9ydCBjb25zdCBISUdITElHSFRfQ09MT1IgPSAweDQzYjVlYTtcbmV4cG9ydCBjb25zdCBJTlRFUkFDVElPTl9DT0xPUiA9IDB4MDdBQkY3O1xuZXhwb3J0IGNvbnN0IEVNSVNTSVZFX0NPTE9SID0gMHgyMjIyMjI7XG5leHBvcnQgY29uc3QgSElHSExJR0hUX0VNSVNTSVZFX0NPTE9SID0gMHg5OTk5OTk7XG5leHBvcnQgY29uc3QgT1VUTElORV9DT0xPUiA9IDB4OTk5OTk5O1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfQkFDSyA9IDB4MWExYTFhO1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfRk9MREVSX0JBQ0sgPSAweDEwMTAxMDtcbmV4cG9ydCBjb25zdCBISUdITElHSFRfQkFDSyA9IDB4MzEzMTMxO1xuZXhwb3J0IGNvbnN0IElOQUNUSVZFX0NPTE9SID0gMHgxNjE4Mjk7XG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9TTElERVIgPSAweDJmYTFkNjtcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX0NIRUNLQk9YID0gMHg4MDY3ODc7XG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9CVVRUT04gPSAweGU2MWQ1ZjtcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX1RFWFQgPSAweDFlZDM2ZjtcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX0RST1BET1dOID0gMHhmZmYwMDA7XG5leHBvcnQgY29uc3QgRFJPUERPV05fQkdfQ09MT1IgPSAweGZmZmZmZjtcbmV4cG9ydCBjb25zdCBEUk9QRE9XTl9GR19DT0xPUiA9IDB4MDAwMDAwO1xuZXhwb3J0IGNvbnN0IENIRUNLQk9YX0JHX0NPTE9SID0gMHhmZmZmZmY7XG5leHBvcnQgY29uc3QgQlVUVE9OX0NPTE9SID0gMHhlNjFkNWY7XG5leHBvcnQgY29uc3QgQlVUVE9OX0hJR0hMSUdIVF9DT0xPUiA9IDB4ZmEzMTczO1xuZXhwb3J0IGNvbnN0IFNMSURFUl9CRyA9IDB4NDQ0NDQ0O1xuXG5leHBvcnQgZnVuY3Rpb24gY29sb3JpemVHZW9tZXRyeSggZ2VvbWV0cnksIGNvbG9yICl7XG4gIGdlb21ldHJ5LmZhY2VzLmZvckVhY2goIGZ1bmN0aW9uKGZhY2Upe1xuICAgIGZhY2UuY29sb3Iuc2V0SGV4KGNvbG9yKTtcbiAgfSk7XG4gIGdlb21ldHJ5LmNvbG9yc05lZWRVcGRhdGUgPSB0cnVlO1xuICByZXR1cm4gZ2VvbWV0cnk7XG59IiwiLyoqXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxuKlxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cbipcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbipcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuKlxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG5pbXBvcnQgY3JlYXRlVGV4dExhYmVsIGZyb20gJy4vdGV4dGxhYmVsJztcbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XG5pbXBvcnQgKiBhcyBMYXlvdXQgZnJvbSAnLi9sYXlvdXQnO1xuaW1wb3J0ICogYXMgR3JhcGhpYyBmcm9tICcuL2dyYXBoaWMnO1xuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcbmltcG9ydCAqIGFzIEdyYWIgZnJvbSAnLi9ncmFiJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlQ2hlY2tib3goIHtcbiAgdGV4dENyZWF0b3IsXG4gIG9iamVjdCxcbiAgcHJvcGVydHlOYW1lID0gJ3VuZGVmaW5lZCcsXG4gIGluaXRpYWxWYWx1ZSA9IGZhbHNlLFxuICBvcHRpb25zID0gW10sXG4gIHdpZHRoID0gTGF5b3V0LlBBTkVMX1dJRFRILFxuICBoZWlnaHQgPSBMYXlvdXQuUEFORUxfSEVJR0hULFxuICBkZXB0aCA9IExheW91dC5QQU5FTF9ERVBUSFxufSA9IHt9ICl7XG5cblxuICBjb25zdCBzdGF0ZSA9IHtcbiAgICBvcGVuOiBmYWxzZSxcbiAgICBsaXN0ZW46IGZhbHNlXG4gIH07XG5cbiAgY29uc3QgRFJPUERPV05fV0lEVEggPSB3aWR0aCAqIDAuNSAtIExheW91dC5QQU5FTF9NQVJHSU47XG4gIGNvbnN0IERST1BET1dOX0hFSUdIVCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU47XG4gIGNvbnN0IERST1BET1dOX0RFUFRIID0gZGVwdGg7XG4gIGNvbnN0IERST1BET1dOX09QVElPTl9IRUlHSFQgPSBoZWlnaHQgLSBMYXlvdXQuUEFORUxfTUFSR0lOICogMS4yO1xuICBjb25zdCBEUk9QRE9XTl9NQVJHSU4gPSBMYXlvdXQuUEFORUxfTUFSR0lOICogLTAuNDtcbiAgY29uc3QgTUFYX0RST1BET1dOX0xBQkVMU19JTl9DT0xVTU4gPSAyNTtcblxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuXG4gIGNvbnN0IHBhbmVsID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApO1xuICBncm91cC5hZGQoIHBhbmVsICk7XG5cbiAgZ3JvdXAuaGl0c2NhbiA9IFsgcGFuZWwgXTtcblxuICBjb25zdCBsYWJlbEludGVyYWN0aW9ucyA9IFtdO1xuICBjb25zdCBvcHRpb25MYWJlbHMgPSBbXTtcblxuICAvLyAgZmluZCBhY3R1YWxseSB3aGljaCBsYWJlbCBpcyBzZWxlY3RlZFxuICBjb25zdCBpbml0aWFsTGFiZWwgPSBmaW5kTGFiZWxGcm9tUHJvcCgpO1xuXG5cblxuICBmdW5jdGlvbiBmaW5kTGFiZWxGcm9tUHJvcCgpe1xuICAgIGlmKCBBcnJheS5pc0FycmF5KCBvcHRpb25zICkgKXtcbiAgICAgIHJldHVybiBvcHRpb25zLmZpbmQoIGZ1bmN0aW9uKCBvcHRpb25OYW1lICl7XG4gICAgICAgIHJldHVybiBvcHRpb25OYW1lID09PSBvYmplY3RbIHByb3BlcnR5TmFtZSBdXG4gICAgICB9KTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvcHRpb25zKS5maW5kKCBmdW5jdGlvbiggb3B0aW9uTmFtZSApe1xuICAgICAgICByZXR1cm4gb2JqZWN0W3Byb3BlcnR5TmFtZV0gPT09IG9wdGlvbnNbIG9wdGlvbk5hbWUgXTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZU9wdGlvbiggbGFiZWxUZXh0LCBpc09wdGlvbiApe1xuICAgIGNvbnN0IGxhYmVsID0gY3JlYXRlVGV4dExhYmVsKFxuICAgICAgdGV4dENyZWF0b3IsIGxhYmVsVGV4dCxcbiAgICAgIERST1BET1dOX1dJRFRILCBkZXB0aCxcbiAgICAgIENvbG9ycy5EUk9QRE9XTl9GR19DT0xPUiwgQ29sb3JzLkRST1BET1dOX0JHX0NPTE9SLFxuICAgICAgMC44NjZcbiAgICApO1xuXG4gICAgZ3JvdXAuaGl0c2Nhbi5wdXNoKCBsYWJlbC5iYWNrICk7XG4gICAgY29uc3QgbGFiZWxJbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBsYWJlbC5iYWNrICk7XG4gICAgbGFiZWxJbnRlcmFjdGlvbnMucHVzaCggbGFiZWxJbnRlcmFjdGlvbiApO1xuICAgIG9wdGlvbkxhYmVscy5wdXNoKCBsYWJlbCApO1xuXG5cbiAgICBpZiggaXNPcHRpb24gKXtcbiAgICAgIGxhYmVsSW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgZnVuY3Rpb24oIHAgKXtcbiAgICAgICAgc2VsZWN0ZWRMYWJlbC5zZXRTdHJpbmcoIGxhYmVsVGV4dCApO1xuXG4gICAgICAgIGxldCBwcm9wZXJ0eUNoYW5nZWQgPSBmYWxzZTtcblxuICAgICAgICBpZiggQXJyYXkuaXNBcnJheSggb3B0aW9ucyApICl7XG4gICAgICAgICAgcHJvcGVydHlDaGFuZ2VkID0gb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSAhPT0gbGFiZWxUZXh0O1xuICAgICAgICAgIGlmKCBwcm9wZXJ0eUNoYW5nZWQgKXtcbiAgICAgICAgICAgIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gPSBsYWJlbFRleHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgcHJvcGVydHlDaGFuZ2VkID0gb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSAhPT0gb3B0aW9uc1sgbGFiZWxUZXh0IF07XG4gICAgICAgICAgaWYoIHByb3BlcnR5Q2hhbmdlZCApe1xuICAgICAgICAgICAgb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSA9IG9wdGlvbnNbIGxhYmVsVGV4dCBdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICAgICAgY29sbGFwc2VPcHRpb25zKCk7XG4gICAgICAgIHN0YXRlLm9wZW4gPSBmYWxzZTtcblxuICAgICAgICBpZiggb25DaGFuZ2VkQ0IgJiYgcHJvcGVydHlDaGFuZ2VkICl7XG4gICAgICAgICAgb25DaGFuZ2VkQ0IoIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHAubG9ja2VkID0gdHJ1ZTtcblxuICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICBsYWJlbEludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGZ1bmN0aW9uKCBwICl7XG4gICAgICAgIGlmKCBzdGF0ZS5vcGVuID09PSBmYWxzZSApe1xuICAgICAgICAgIG9wZW5PcHRpb25zKCk7XG4gICAgICAgICAgc3RhdGUub3BlbiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICBjb2xsYXBzZU9wdGlvbnMoKTtcbiAgICAgICAgICBzdGF0ZS5vcGVuID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBwLmxvY2tlZCA9IHRydWU7XG4gICAgICB9KTtcbiAgICB9XG4gICAgbGFiZWwuaXNPcHRpb24gPSBpc09wdGlvbjtcbiAgICByZXR1cm4gbGFiZWw7XG4gIH1cblxuICBmdW5jdGlvbiBjb2xsYXBzZU9wdGlvbnMoKXtcbiAgICBvcHRpb25MYWJlbHMuZm9yRWFjaCggZnVuY3Rpb24oIGxhYmVsICl7XG4gICAgICBpZiggbGFiZWwuaXNPcHRpb24gKXtcbiAgICAgICAgbGFiZWwudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICBsYWJlbC5iYWNrLnZpc2libGUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9wZW5PcHRpb25zKCl7XG4gICAgb3B0aW9uTGFiZWxzLmZvckVhY2goIGZ1bmN0aW9uKCBsYWJlbCApe1xuICAgICAgaWYoIGxhYmVsLmlzT3B0aW9uICl7XG4gICAgICAgIGxhYmVsLnZpc2libGUgPSB0cnVlO1xuICAgICAgICBsYWJlbC5iYWNrLnZpc2libGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gIGJhc2Ugb3B0aW9uXG4gIGNvbnN0IHNlbGVjdGVkTGFiZWwgPSBjcmVhdGVPcHRpb24oIGluaXRpYWxMYWJlbCwgZmFsc2UgKTtcbiAgc2VsZWN0ZWRMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX01BUkdJTiAqIDAuNSArIHdpZHRoICogMC41O1xuICBzZWxlY3RlZExhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcblxuICBjb25zdCBkb3duQXJyb3cgPSBHcmFwaGljLmRvd25BcnJvdygpO1xuICAvLyBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggZG93bkFycm93Lmdlb21ldHJ5LCBDb2xvcnMuRFJPUERPV05fRkdfQ09MT1IgKTtcbiAgZG93bkFycm93LnBvc2l0aW9uLnNldCggRFJPUERPV05fV0lEVEggLSAwLjA0LCAwLCBkZXB0aCAqIDEuMDEgKTtcbiAgc2VsZWN0ZWRMYWJlbC5hZGQoIGRvd25BcnJvdyApO1xuXG5cbiAgZnVuY3Rpb24gY29uZmlndXJlTGFiZWxQb3NpdGlvbiggbGFiZWwsIGluZGV4ICl7XG4gICAgbGFiZWwucG9zaXRpb24ueSA9IC1EUk9QRE9XTl9NQVJHSU4gLSAoaW5kZXglTUFYX0RST1BET1dOX0xBQkVMU19JTl9DT0xVTU4rMSkgKiAoIERST1BET1dOX09QVElPTl9IRUlHSFQgKTtcbiAgICBsYWJlbC5wb3NpdGlvbi56ID0gZGVwdGg7XG4gICAgbGFiZWwucG9zaXRpb24ueCArPSBEUk9QRE9XTl9XSURUSCAqIE1hdGguZmxvb3IoaW5kZXggLyBNQVhfRFJPUERPV05fTEFCRUxTX0lOX0NPTFVNTik7XG4gIH1cblxuICBmdW5jdGlvbiBvcHRpb25Ub0xhYmVsKCBvcHRpb25OYW1lLCBpbmRleCApe1xuICAgIGNvbnN0IG9wdGlvbkxhYmVsID0gY3JlYXRlT3B0aW9uKCBvcHRpb25OYW1lLCB0cnVlICk7XG4gICAgY29uZmlndXJlTGFiZWxQb3NpdGlvbiggb3B0aW9uTGFiZWwsIGluZGV4ICk7XG4gICAgcmV0dXJuIG9wdGlvbkxhYmVsO1xuICB9XG5cbiAgaWYoIEFycmF5LmlzQXJyYXkoIG9wdGlvbnMgKSApe1xuICAgIHNlbGVjdGVkTGFiZWwuYWRkKCAuLi5vcHRpb25zLm1hcCggb3B0aW9uVG9MYWJlbCApICk7XG4gIH1cbiAgZWxzZXtcbiAgICBzZWxlY3RlZExhYmVsLmFkZCggLi4uT2JqZWN0LmtleXMob3B0aW9ucykubWFwKCBvcHRpb25Ub0xhYmVsICkgKTtcbiAgfVxuXG5cbiAgY29sbGFwc2VPcHRpb25zKCk7XG5cbiAgY29uc3QgZGVzY3JpcHRvckxhYmVsID0gdGV4dENyZWF0b3IuY3JlYXRlKCBwcm9wZXJ0eU5hbWUgKTtcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfTEFCRUxfVEVYVF9NQVJHSU47XG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGg7XG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi55ID0gLTAuMDM7XG5cbiAgY29uc3QgY29udHJvbGxlcklEID0gTGF5b3V0LmNyZWF0ZUNvbnRyb2xsZXJJREJveCggaGVpZ2h0LCBDb2xvcnMuQ09OVFJPTExFUl9JRF9EUk9QRE9XTiApO1xuICBjb250cm9sbGVySUQucG9zaXRpb24ueiA9IGRlcHRoO1xuXG5cbiAgY29uc3QgYm9yZGVyQm94ID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCBEUk9QRE9XTl9XSURUSCArIExheW91dC5CT1JERVJfVEhJQ0tORVNTLCBEUk9QRE9XTl9IRUlHSFQgKyBMYXlvdXQuQk9SREVSX1RISUNLTkVTUyAqIDAuNSwgRFJPUERPV05fREVQVEgsIHRydWUgKTtcbiAgYm9yZGVyQm94Lm1hdGVyaWFsLmNvbG9yLnNldEhleCggMHgxZjdhZTcgKTtcbiAgYm9yZGVyQm94LnBvc2l0aW9uLnggPSAtTGF5b3V0LkJPUkRFUl9USElDS05FU1MgKiAwLjUgKyB3aWR0aCAqIDAuNTtcbiAgYm9yZGVyQm94LnBvc2l0aW9uLnogPSBkZXB0aCAqIDAuNTtcblxuICBwYW5lbC5hZGQoIGRlc2NyaXB0b3JMYWJlbCwgY29udHJvbGxlcklELCBzZWxlY3RlZExhYmVsLCBib3JkZXJCb3ggKTtcblxuXG4gIHVwZGF0ZVZpZXcoKTtcblxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XG5cbiAgICBsYWJlbEludGVyYWN0aW9ucy5mb3JFYWNoKCBmdW5jdGlvbiggaW50ZXJhY3Rpb24sIGluZGV4ICl7XG4gICAgICBjb25zdCBsYWJlbCA9IG9wdGlvbkxhYmVsc1sgaW5kZXggXTtcbiAgICAgIGlmKCBsYWJlbC5pc09wdGlvbiApe1xuICAgICAgICBpZiggaW50ZXJhY3Rpb24uaG92ZXJpbmcoKSApe1xuICAgICAgICAgIENvbG9ycy5jb2xvcml6ZUdlb21ldHJ5KCBsYWJlbC5iYWNrLmdlb21ldHJ5LCBDb2xvcnMuSElHSExJR0hUX0NPTE9SICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggbGFiZWwuYmFjay5nZW9tZXRyeSwgQ29sb3JzLkRST1BET1dOX0JHX0NPTE9SICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmKCBsYWJlbEludGVyYWN0aW9uc1swXS5ob3ZlcmluZygpIHx8IHN0YXRlLm9wZW4gKXtcbiAgICAgIGJvcmRlckJveC52aXNpYmxlID0gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIGJvcmRlckJveC52aXNpYmxlID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgbGV0IG9uQ2hhbmdlZENCO1xuICBsZXQgb25GaW5pc2hDaGFuZ2VDQjtcblxuICBncm91cC5vbkNoYW5nZSA9IGZ1bmN0aW9uKCBjYWxsYmFjayApe1xuICAgIG9uQ2hhbmdlZENCID0gY2FsbGJhY2s7XG4gICAgcmV0dXJuIGdyb3VwO1xuICB9O1xuXG4gIGNvbnN0IGdyYWJJbnRlcmFjdGlvbiA9IEdyYWIuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XG5cbiAgZ3JvdXAubGlzdGVuID0gZnVuY3Rpb24oKXtcbiAgICBzdGF0ZS5saXN0ZW4gPSB0cnVlO1xuICAgIHJldHVybiBncm91cDtcbiAgfTtcblxuICBncm91cC51cGRhdGVDb250cm9sID0gZnVuY3Rpb24oIGlucHV0T2JqZWN0cyApe1xuICAgIGlmKCBzdGF0ZS5saXN0ZW4gKXtcbiAgICAgIHNlbGVjdGVkTGFiZWwuc2V0U3RyaW5nKCBmaW5kTGFiZWxGcm9tUHJvcCgpICk7XG4gICAgfVxuICAgIGxhYmVsSW50ZXJhY3Rpb25zLmZvckVhY2goIGZ1bmN0aW9uKCBsYWJlbEludGVyYWN0aW9uICl7XG4gICAgICBsYWJlbEludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XG4gICAgfSk7XG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XG4gICAgdXBkYXRlVmlldygpO1xuICB9O1xuXG4gIGdyb3VwLm5hbWUgPSBmdW5jdGlvbiggc3RyICl7XG4gICAgZGVzY3JpcHRvckxhYmVsLnVwZGF0ZSggc3RyICk7XG4gICAgcmV0dXJuIGdyb3VwO1xuICB9O1xuXG5cbiAgcmV0dXJuIGdyb3VwO1xufSIsIi8qKlxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcbipcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXG4qXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbipcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cblxuaW1wb3J0IGNyZWF0ZVRleHRMYWJlbCBmcm9tICcuL3RleHRsYWJlbCc7XG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xuaW1wb3J0ICogYXMgTGF5b3V0IGZyb20gJy4vbGF5b3V0JztcbmltcG9ydCAqIGFzIEdyYXBoaWMgZnJvbSAnLi9ncmFwaGljJztcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XG5pbXBvcnQgKiBhcyBHcmFiIGZyb20gJy4vZ3JhYic7XG5pbXBvcnQgKiBhcyBQYWxldHRlIGZyb20gJy4vcGFsZXR0ZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUZvbGRlcih7XG4gIHRleHRDcmVhdG9yLFxuICBuYW1lLFxuICBndWlBZGQsXG4gIGFkZFNsaWRlcixcbiAgYWRkRHJvcGRvd24sXG4gIGFkZENoZWNrYm94LFxuICBhZGRCdXR0b25cbn0gPSB7fSApe1xuXG4gIGNvbnN0IHdpZHRoID0gTGF5b3V0LkZPTERFUl9XSURUSDtcbiAgY29uc3QgZGVwdGggPSBMYXlvdXQuUEFORUxfREVQVEg7XG5cbiAgY29uc3Qgc3RhdGUgPSB7XG4gICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICBwcmV2aW91c1BhcmVudDogdW5kZWZpbmVkXG4gIH07XG5cbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgY29uc3QgY29sbGFwc2VHcm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuICBncm91cC5hZGQoIGNvbGxhcHNlR3JvdXAgKTtcblxuICAvL2V4cG9zZSBhcyBwdWJsaWMgaW50ZXJmYWNlIHNvIHRoYXQgY2hpbGRyZW4gY2FuIGNhbGwgaXQgd2hlbiB0aGVpciBzcGFjaW5nIGNoYW5nZXNcbiAgZ3JvdXAucGVyZm9ybUxheW91dCA9IHBlcmZvcm1MYXlvdXQ7XG4gIGdyb3VwLmlzQ29sbGFwc2VkID0gKCkgPT4geyByZXR1cm4gc3RhdGUuY29sbGFwc2VkIH1cblxuICAvLyAgWWVhaC4gR3Jvc3MuXG4gIGNvbnN0IGFkZE9yaWdpbmFsID0gVEhSRUUuR3JvdXAucHJvdG90eXBlLmFkZDtcblxuICBmdW5jdGlvbiBhZGRJbXBsKCBvICl7XG4gICAgYWRkT3JpZ2luYWwuY2FsbCggZ3JvdXAsIG8gKTtcbiAgfVxuXG4gIGFkZEltcGwoIGNvbGxhcHNlR3JvdXAgKTtcblxuICBjb25zdCBwYW5lbCA9IExheW91dC5jcmVhdGVQYW5lbCggd2lkdGgsIExheW91dC5GT0xERVJfSEVJR0hULCBkZXB0aCwgdHJ1ZSApO1xuICBhZGRJbXBsKCBwYW5lbCApO1xuXG4gIGNvbnN0IGRlc2NyaXB0b3JMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggbmFtZSApO1xuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9MQUJFTF9URVhUX01BUkdJTiAqIDEuNTtcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnkgPSAtMC4wMztcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcbiAgcGFuZWwuYWRkKCBkZXNjcmlwdG9yTGFiZWwgKTtcblxuICBjb25zdCBkb3duQXJyb3cgPSBMYXlvdXQuY3JlYXRlRG93bkFycm93KCk7XG4gIENvbG9ycy5jb2xvcml6ZUdlb21ldHJ5KCBkb3duQXJyb3cuZ2VvbWV0cnksIDB4ZmZmZmZmICk7XG4gIGRvd25BcnJvdy5wb3NpdGlvbi5zZXQoIDAuMDUsIDAsIGRlcHRoICAqIDEuMDEgKTtcbiAgcGFuZWwuYWRkKCBkb3duQXJyb3cgKTtcblxuICBjb25zdCBncmFiYmVyID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgTGF5b3V0LkZPTERFUl9HUkFCX0hFSUdIVCwgZGVwdGgsIHRydWUgKTtcbiAgZ3JhYmJlci5wb3NpdGlvbi55ID0gTGF5b3V0LkZPTERFUl9IRUlHSFQgKiAwLjg2O1xuICBncmFiYmVyLm5hbWUgPSAnZ3JhYmJlcic7XG4gIGFkZEltcGwoIGdyYWJiZXIgKTtcblxuICBjb25zdCBncmFiQmFyID0gR3JhcGhpYy5ncmFiQmFyKCk7XG4gIGdyYWJCYXIucG9zaXRpb24uc2V0KCB3aWR0aCAqIDAuNSwgMCwgZGVwdGggKiAxLjAwMSApO1xuICBncmFiYmVyLmFkZCggZ3JhYkJhciApO1xuICBncm91cC5pc0ZvbGRlciA9IHRydWU7XG4gIGdyb3VwLmhpZGVHcmFiYmVyID0gZnVuY3Rpb24oKSB7IGdyYWJiZXIudmlzaWJsZSA9IGZhbHNlIH07XG5cbiAgZ3JvdXAuYWRkID0gZnVuY3Rpb24oIC4uLmFyZ3MgKXtcbiAgICBjb25zdCBuZXdDb250cm9sbGVyID0gZ3VpQWRkKCAuLi5hcmdzICk7XG5cbiAgICBpZiggbmV3Q29udHJvbGxlciApe1xuICAgICAgZ3JvdXAuYWRkQ29udHJvbGxlciggbmV3Q29udHJvbGxlciApO1xuICAgICAgcmV0dXJuIG5ld0NvbnRyb2xsZXI7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICByZXR1cm4gbmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgfVxuICB9O1xuXG4gIGdyb3VwLmFkZENvbnRyb2xsZXIgPSBmdW5jdGlvbiggLi4uYXJncyApe1xuICAgIGFyZ3MuZm9yRWFjaCggZnVuY3Rpb24oIG9iaiApe1xuICAgICAgY29sbGFwc2VHcm91cC5hZGQoIG9iaiApO1xuICAgICAgb2JqLmZvbGRlciA9IGdyb3VwO1xuICAgICAgaWYgKG9iai5pc0ZvbGRlcikge1xuICAgICAgICBvYmouaGlkZUdyYWJiZXIoKTtcbiAgICAgICAgb2JqLmNsb3NlKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBwZXJmb3JtTGF5b3V0KCk7XG4gIH07XG5cbiAgZ3JvdXAuYWRkRm9sZGVyID0gZnVuY3Rpb24oIC4uLmFyZ3MgKXtcbiAgICBhcmdzLmZvckVhY2goIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIGNvbGxhcHNlR3JvdXAuYWRkKCBvYmogKTtcbiAgICAgIG9iai5mb2xkZXIgPSBncm91cDtcbiAgICAgIG9iai5oaWRlR3JhYmJlcigpO1xuICAgICAgb2JqLmNsb3NlKCk7XG4gICAgfSk7XG5cbiAgICBwZXJmb3JtTGF5b3V0KCk7XG4gIH1cblxuICBmdW5jdGlvbiBwZXJmb3JtTGF5b3V0KCl7XG4gICAgY29uc3Qgc3BhY2luZ1BlckNvbnRyb2xsZXIgPSBMYXlvdXQuUEFORUxfSEVJR0hUICsgTGF5b3V0LlBBTkVMX1NQQUNJTkc7XG4gICAgY29uc3QgZW1wdHlGb2xkZXJTcGFjZSA9IExheW91dC5GT0xERVJfSEVJR0hUICsgTGF5b3V0LlBBTkVMX1NQQUNJTkc7XG4gICAgdmFyIHRvdGFsU3BhY2luZyA9IGVtcHR5Rm9sZGVyU3BhY2U7XG5cbiAgICBjb2xsYXBzZUdyb3VwLmNoaWxkcmVuLmZvckVhY2goIChjKSA9PiB7IGMudmlzaWJsZSA9ICFzdGF0ZS5jb2xsYXBzZWQgfSApO1xuXG4gICAgaWYgKCBzdGF0ZS5jb2xsYXBzZWQgKSB7XG4gICAgICBkb3duQXJyb3cucm90YXRpb24ueiA9IE1hdGguUEkgKiAwLjU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvd25BcnJvdy5yb3RhdGlvbi56ID0gMDtcblxuICAgICAgdmFyIHkgPSAwLCBsYXN0SGVpZ2h0ID0gZW1wdHlGb2xkZXJTcGFjZTtcblxuICAgICAgY29sbGFwc2VHcm91cC5jaGlsZHJlbi5mb3JFYWNoKCBmdW5jdGlvbiggY2hpbGQgKXtcbiAgICAgICAgdmFyIGggPSBjaGlsZC5zcGFjaW5nID8gY2hpbGQuc3BhY2luZyA6IHNwYWNpbmdQZXJDb250cm9sbGVyO1xuICAgICAgICAvLyBob3cgZmFyIHRvIGdldCBmcm9tIHRoZSBtaWRkbGUgb2YgcHJldmlvdXMgdG8gbWlkZGxlIG9mIHRoaXMgY2hpbGQ/XG4gICAgICAgIC8vIGhhbGYgb2YgdGhlIGhlaWdodCBvZiBwcmV2aW91cyBwbHVzIGhhbGYgaGVpZ2h0IG9mIHRoaXMuXG4gICAgICAgIHZhciBzcGFjaW5nID0gMC41ICogKGxhc3RIZWlnaHQgKyBoKTtcblxuICAgICAgICBpZiAoY2hpbGQuaXNGb2xkZXIpIHtcbiAgICAgICAgICAvLyBGb3IgZm9sZGVycywgdGhlIG9yaWdpbiBpc24ndCBpbiB0aGUgbWlkZGxlIG9mIHRoZSBlbnRpcmUgaGVpZ2h0IG9mIHRoZSBmb2xkZXIsXG4gICAgICAgICAgLy8gYnV0IGp1c3QgdGhlIG1pZGRsZSBvZiB0aGUgdG9wIHBhbmVsLlxuICAgICAgICAgIHZhciBvZmZzZXQgPSAwLjUgKiAobGFzdEhlaWdodCArIGVtcHR5Rm9sZGVyU3BhY2UpO1xuICAgICAgICAgIGNoaWxkLnBvc2l0aW9uLnkgPSB5IC0gb2Zmc2V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNoaWxkLnBvc2l0aW9uLnkgPSB5IC0gc3BhY2luZztcbiAgICAgICAgfVxuICAgICAgICAvLyBpbiBhbnkgY2FzZSwgZm9yIHVzZSBieSB0aGUgbmV4dCBvYmplY3QgYWxvbmcgd2UgcmVtZW1iZXIgJ3knIGFzIHRoZSBtaWRkbGUgb2YgdGhlIHdob2xlIHBhbmVsXG4gICAgICAgIHkgLT0gc3BhY2luZztcbiAgICAgICAgbGFzdEhlaWdodCA9IGg7XG4gICAgICAgIHRvdGFsU3BhY2luZyArPSBoO1xuICAgICAgICBjaGlsZC5wb3NpdGlvbi54ID0gMC4wMjY7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBncm91cC5zcGFjaW5nID0gdG90YWxTcGFjaW5nO1xuXG4gICAgLy9tYWtlIHN1cmUgcGFyZW50IGZvbGRlciBhbHNvIHBlcmZvcm1zIGxheW91dC5cbiAgICBpZiAoZ3JvdXAuZm9sZGVyICE9PSBncm91cCkgZ3JvdXAuZm9sZGVyLnBlcmZvcm1MYXlvdXQoKTtcblxuICAgIC8vIGlmIHdlJ3JlIGEgc3ViZm9sZGVyLCB1c2UgYSBzbWFsbGVyIHBhbmVsXG4gICAgbGV0IHBhbmVsV2lkdGggPSBMYXlvdXQuRk9MREVSX1dJRFRIO1xuICAgIGlmIChncm91cC5mb2xkZXIgIT09IGdyb3VwKSB7XG4gICAgICBwYW5lbFdpZHRoID0gTGF5b3V0LlNVQkZPTERFUl9XSURUSDtcbiAgICB9XG5cbiAgICBMYXlvdXQucmVzaXplUGFuZWwocGFuZWwsIHBhbmVsV2lkdGgsIExheW91dC5GT0xERVJfSEVJR0hULCBkZXB0aClcblxuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlVmlldygpe1xuICAgIGlmKCBpbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XG4gICAgICBwYW5lbC5tYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ISUdITElHSFRfQkFDSyApO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgcGFuZWwubWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuREVGQVVMVF9GT0xERVJfQkFDSyApO1xuICAgIH1cblxuICAgIGlmKCBncmFiSW50ZXJhY3Rpb24uaG92ZXJpbmcoKSApe1xuICAgICAgZ3JhYmJlci5tYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ISUdITElHSFRfQkFDSyApO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgZ3JhYmJlci5tYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ERUZBVUxUX0ZPTERFUl9CQUNLICk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgaW50ZXJhY3Rpb24gPSBjcmVhdGVJbnRlcmFjdGlvbiggcGFuZWwgKTtcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgZnVuY3Rpb24oIHAgKXtcbiAgICBzdGF0ZS5jb2xsYXBzZWQgPSAhc3RhdGUuY29sbGFwc2VkO1xuICAgIHBlcmZvcm1MYXlvdXQoKTtcbiAgICBwLmxvY2tlZCA9IHRydWU7XG4gIH0pO1xuXG4gIGdyb3VwLm9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICAvL3Nob3VsZCB3ZSBjb25zaWRlciBjaGVja2luZyBpZiBwYXJlbnRzIGFyZSBvcGVuIGFuZCBhdXRvbWF0aWNhbGx5IG9wZW4gdGhlbSBpZiBub3Q/XG4gICAgaWYgKCFzdGF0ZS5jb2xsYXBzZWQpIHJldHVybjtcbiAgICBzdGF0ZS5jb2xsYXBzZWQgPSBmYWxzZTtcbiAgICBwZXJmb3JtTGF5b3V0KCk7XG4gIH1cblxuICBncm91cC5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChzdGF0ZS5jb2xsYXBzZWQpIHJldHVybjtcbiAgICBzdGF0ZS5jb2xsYXBzZWQgPSB0cnVlO1xuICAgIHBlcmZvcm1MYXlvdXQoKTtcbiAgfVxuXG4gIGdyb3VwLmZvbGRlciA9IGdyb3VwO1xuXG4gIGNvbnN0IGdyYWJJbnRlcmFjdGlvbiA9IEdyYWIuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbDogZ3JhYmJlciB9ICk7XG4gIGNvbnN0IHBhbGV0dGVJbnRlcmFjdGlvbiA9IFBhbGV0dGUuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XG5cbiAgZ3JvdXAudXBkYXRlQ29udHJvbCA9IGZ1bmN0aW9uKCBpbnB1dE9iamVjdHMgKXtcbiAgICBpbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xuICAgIGdyYWJJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xuICAgIHBhbGV0dGVJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xuXG4gICAgdXBkYXRlVmlldygpO1xuICB9O1xuXG4gIGdyb3VwLm5hbWUgPSBmdW5jdGlvbiggc3RyICl7XG4gICAgZGVzY3JpcHRvckxhYmVsLnVwZGF0ZUxhYmVsKCBzdHIgKTtcbiAgICByZXR1cm4gZ3JvdXA7XG4gIH07XG5cbiAgZ3JvdXAuaGl0c2NhbiA9IFsgcGFuZWwsIGdyYWJiZXIgXTtcblxuICBncm91cC5iZWluZ01vdmVkID0gZmFsc2U7XG5cbiAgZ3JvdXAuYWRkU2xpZGVyID0gKC4uLmFyZ3MpPT57XG4gICAgY29uc3QgY29udHJvbGxlciA9IGFkZFNsaWRlciguLi5hcmdzKTtcbiAgICBpZiggY29udHJvbGxlciApe1xuICAgICAgZ3JvdXAuYWRkQ29udHJvbGxlciggY29udHJvbGxlciApO1xuICAgICAgcmV0dXJuIGNvbnRyb2xsZXI7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICByZXR1cm4gbmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgfVxuICB9O1xuICBncm91cC5hZGREcm9wZG93biA9ICguLi5hcmdzKT0+e1xuICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBhZGREcm9wZG93biguLi5hcmdzKTtcbiAgICBpZiggY29udHJvbGxlciApe1xuICAgICAgZ3JvdXAuYWRkQ29udHJvbGxlciggY29udHJvbGxlciApO1xuICAgICAgcmV0dXJuIGNvbnRyb2xsZXI7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICByZXR1cm4gbmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgfVxuICB9O1xuICBncm91cC5hZGRDaGVja2JveCA9ICguLi5hcmdzKT0+e1xuICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBhZGRDaGVja2JveCguLi5hcmdzKTtcbiAgICBpZiggY29udHJvbGxlciApe1xuICAgICAgZ3JvdXAuYWRkQ29udHJvbGxlciggY29udHJvbGxlciApO1xuICAgICAgcmV0dXJuIGNvbnRyb2xsZXI7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICByZXR1cm4gbmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgfVxuICB9O1xuICBncm91cC5hZGRCdXR0b24gPSAoLi4uYXJncyk9PntcbiAgICBjb25zdCBjb250cm9sbGVyID0gYWRkQnV0dG9uKC4uLmFyZ3MpO1xuICAgIGlmKCBjb250cm9sbGVyICl7XG4gICAgICBncm91cC5hZGRDb250cm9sbGVyKCBjb250cm9sbGVyICk7XG4gICAgICByZXR1cm4gY29udHJvbGxlcjtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGdyb3VwO1xufSIsIi8qKlxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcbipcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXG4qXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbipcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGltYWdlKCl7XG4gIGNvbnN0IGltYWdlID0gbmV3IEltYWdlKCk7XG4gIGltYWdlLnNyYyA9IGBkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQWdBQUFBRUFDQU1BQUFEeVRqNVZBQUFBalZCTVZFVkhjRXovLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8rdW1BYzdBQUFBTDNSU1RsTUFXbkpmYm5xRFdHUjRhMlpjWW5CUmFsUkxnSDZFVG5SOFVHaDJSb1pEWGxhSFNZbzhRSFUyTHlZY0ZBd0ZtbVVSMU9JQUFKRmhTVVJCVkhoZXRMMkpXbXU3ampVS0lRa2tRTHFadmdNQ1pPMnpULzMzL1IvdlNrTkRrajJUck9hclZkNVY2eERQM3BKbFdkS1E3cWFQYjYrdnJ3OHZqK1BaL3Z2cnh6Ly8vUGo2M3MvRzcvY1AybjAvWFo2T3A2WDhmSkhmYUcvM2o5cTVYL0xLdC90M3YvUWZ1ZlFrL1hvdWJvbHovRHE1TEg3eTFuTFZsOXhlSDRiMjhqaWRuY1p5L1pNMFArV2ZmLzd6bi8vOCsrOS8vc0c1VXp0YXYzSDFpbkpJWGtsZThRdm4zK09ST1Ayb2o1T1BtejdldittNVBEREZ5WGFuL1V3ZXdCZDgxMjRaRG4ybzNlVEJCbUNLQXpaUWZqWTc1V1gvL1krL0tqNkxuNzcvL3VGM3IyNHZIeWZQNWFlOWNSUnNhSDVJLzQ4dmVRcVA1S2g5WDl6ODZ3dm4rd2poWmZtWWpUem15QmZsU09CejVWMWxYTzhlSDU0bXc4bnpLOGRUSHNuUGVwYnVwd2Z0MVZ1K1BzbHZhWlB0czczRmFXeFhicC9pVWp4L0k5U1VjM0hMcVoyRGhudFZQMEVSZk43OXE5MTgrL1QydUZsTzhldzhCVytxdzRSejVSWmJPVHA1ZnNKaitkVHFGWi9sbFRBcXVMYytFbThqQS80ZEEvUzg5Yzk1a2hFaDhaVFltOGUzcCswUVY5eFA1ZjVmUWpVOFZMdWVKM2l0ZTlDVDlMZXpuNUlEK0twOHRCM0VtT2ZkZWZzbDU4MFBZMVdNRGthQk5GWHFINVZqZVNTRzVIalJkVHpxK2VBTWpQK0VMOHZIeUNTekZ6VzZMRTk2UHJqdjd1VnBNdXAwdWx1TXA3SXB1V1hiN1hRNnd5Y1p0dGtVYjkzdG9JMjY5ckhMS2E4Y2JwMFVuTTJ2VHhNOXQvdjg4SWh6ZU4zazZTVi80dGJ5WnNlOWZkNFFmZDJKdk83bThlRzVXNTd5RFJiQXJNSzV1RHZlR0NUOVFiN0lWK3phR003Mnh4UHVQY0xwU3M4ajU5bnpwQnVmTTN4MjRuSGF2dG9EaG5JUDZTWFY4TjY0YURRa1BUbFJ0bmIyczk5RTM5UmZkUmlmcnJ3a25idzdiby9KaFhsTHdlbFBtY2lUeDdQVC9sdjdUN1BaNWhIamxrUHl0WmZSajV1RFJyT1RuQTltdlg5NHhrQjBoM3l2eDgxSkJ3SXZxdjE0VXpuLytLMHZleWVqZmU0TlZ1Q0FEY1htT3o1cjE5dDE5Zkt4dnBuOEhQUzA3VllqKzlqSE43bFNmbmZpMGgrY3pjUE9lZEFiZElTYTcyOVBjZzdhdWZ2MGxqL3Qxc3Y5YWJaVTNwekl3NlN0OVB2R01rYWRRWndpQTNIa1BQbmU0OXlSbmp0WWthUkNOdkJRdnVKZ3h6RThZY0J4NzRFTkhjWVpwNjc0T1lOemh4d2Q0dUZwdU5Lbmo3WVBrQXpIazc0UkhyclM5OXAxSnZaZ09RRDZyN1FUQk1XOHhTSjZQUEZWNDlPWHhnQzh1MXlnaEpOUnMxVnd0akg2NzNENlJLZlVjcmJYL3ZGMEtoK3g3ZTZLVVpPNzZ5eXhtMk1jcGxPY2I4dzZ4RUNjT3p0N1dRNkVkT3NuRDhEWk9CL3k1MDVIdTVselBGMXN2c29jSE16N0lPSVlYSHNlekp2K1l0SHZONzBkYmlFVGRUdmFOZjI4VkhuSDJIN1hhL3FnNXJzd3lXNitrRGFYZDMvTG40MTl5bkk4ZlgvWHp6djMrb3VtWUFENWlWUHdwaWVUbERJWHgvaHVPZGh2UUZJYjFwTk5rWE52M3RkWGxLK1JNUVM5T2VEOXhaeERSL29MelpxK2ZjNTZjRmFPQnZIMkpoNkdxL1dpUHhodGpTOU9Td3dlYnJLVEo5aGJ6bkEySnNxZ1dmVFh1MUdzV0pqUUdFUjhWditTQWVRQ0VnN2ZCcjY3Ri9wekdEQWI3NFVGMEM5TlBucWxkMXJqSzlDUGdWajNGeGlIQnoxSit2ZkhtVEhyV2orczE1T1hCUVZQZXpKQW80UlFtZkh5OG1pYUd4aWcxeHprUHJqMzdPaEVITXpsTGVYbTkzaVd2dlNIak5maThJR1BsWGRYQnRBN05zSUJ5aENuYnhWQWVQNjhmK2l2a3dIa3NvK0NBVDRPL2I1UlYrZmIyeHVlMW56b21PaDl5UUFmT09WTlZVNTVVeFd0eWwrUURzS0U4eURwdDhwRDhKQy80b2VPSWI3bXRNU0FydzhmZk41c3pIbldnUGlOOHJSek5JYkpoSjFjSWN6Zm5VRFNnV2VFQVJhZi9ZRzg1Z0VmUnJINmdJbXlhR1NrTWE3djFBMHdvZjJ6ZHZVU0FESi9jTUNubTVuekhRNDBpL2xCQnhTYVZTak5JSWNNcWJ4bzlHdW5UcWE1eWhKcFVLQ1Y0OEdzQjNDM1BHVUVDZUN5cWlmdm8yT0Q4NDFkN3g0dy9RNXp6cWdUbHBlSjNydHYwczRHdlRrY2xLZGs1SEVMK1NMd3hXQzlPQWhQZ2MyTzhpVXE1RmY2ZlhxdE1NK0wvaFJXckJoZ0Fja2xuNjlEKy9UOGpLZlpRSWxPV3pLQU5LanB5NzFKU2g2Yjc0UUpuQUZNN09IakZvM2NlZDBzRGcxRlBzZWo2YS94UENvdU94MmdlVzhnVGM5MmpsN2lSaEFQd2dEeWlyWk9ZM2xSV3NwanordSt5aW5UckhCejBMK0gxNWNuWUJwQU54Qk5UR2RDeWdhc3JuZ0NYc0FJOTNDdmVnRDFhZjBFb1VNRERvQWFFNXFlVEhhUWVqaXMrbTNjenQxUW9JUGpHL2t3NWUyenZSUVZhMmM5UFo4cTFBOVZBbkg3TldUU2VBYStoaXhhNzZEdlFIamd3bFZIbHM2NVVwd0szclpyUEk3Um5tRUZlbEFTSDVSSFZLNVM1N2xnQUNwR0dHOXBjb0lPbFB5bHN5Z1pRSnJxOUZEb3ZyK1NBWVRPL1pBQUx2Ym1oOE1jcnlpdnRGQ0N2K21NaDJ3WURIYkdFUDV0TWtBNzFlbEduYk5LT2dvTW41K05TSkhEb2xsam5aNUNxSzFXSzJHWGppeXVnL09xZ3lmN1lEY3l6THQ1STVOdGEycWRiNkw0V1IwWmEyZ1R3cXBVVmpzcW85ZXJMamRmTXlySHUwYnVJbHpRekhkVWlGMzUwenRwWjZmVnIrdTBQRGo2Wi9aT3ZmWDZEQjNuUERKTkl4VHJYZHhJcUEydXZGTWlLQmtiSXlNbUNUcTR1a3lOQVNERWg1TXVTQU1GQ1YvWlBhOFBDd2hGYkRiR1dCZjZJaXpCM2xPVnVOdkpKUVBZb0lCdzU5MXVwK082VzhrZnE2N2NPQmdBUGE0VXE0NEpYVlpYbUw1T1JGdFp2NmtSVTZ4aUlpMzhGWFhwZzBacFFzdk81QndiZFlTcW5hN09JcmtRSXVDZGt1VFExNVdrVHpIRklSV2VHc3JGOGdkSXZlSFNzS1BtT2RBSkJMWHV0REVsK2t5dFdiOEFPZ1kxa0ZCV3p4MjdaQm5Lc1k3QWVSY0tjZlRyQUEwNnE4dCtaY3RkOUUrNXhLMTJ2ZlY4UG9jUWc3U2lZcjN1c2ExN1NtMm9zbmNRNWFrbmJjQXNaeE1KV0FPVEFXVEtUR1RaZDJZZm04SzhPRGdEeEF6bGtqdGRZbnQrbFFHRXFHUXRlZFBkU05wQS9vRE80dmNZNkNGUjk2blF3ZnhoT3E2UWd3b0RWbEM3N2VHZ1F1eEpDZDQvVUgrZFVYejE3ZkdtUTY0eDVYR1h0WkJIRDRNLzlQQVdONUtuNmxwbmZFRTk4cUMvWktBZ0FKVUJxRTY0NXJrZWRFeXRvMG9pckdKYTgxelhOdWdZcDF1WHVITGMweEh1ZGtVSHRVbFY5TXNBRFcvMGo5aFBEbGNaTmhmK3BSQlRRVHgyeFRwYk1vQytyczk0MThGRy9HbkxxRjM4MlY4UGREN3FqTFdWaGFPYkRMQnZNWUJxME95NVpBQmpMVDJHTlVUSlJKM0Y3OUgwRC9vUkxwK1B0c3VsQ0pCZURHcXNPNzRVNmQ1RUtGc3hnT3VnSmc4YVdkeTZLb1VYaDRWc1lrUUVjRkhEdTVyOEdoVnJtL2J5bDdMSFltMnlSL3VoVGh4TTg1eFRqdzdka0ZyendkWEE1YzFMaW5GNWZ0Sk55TUhHdEpTWTIrMnYrNmRjNGhwNWFOUGdDVHVvZG1PblliUmtnTk00MW0zY2cvTFV4K1Iwc25tQnp4R2hvanpRdFRsWk1RQ3NhWnRweFFDUUNiY1pZT1l6VG9VTnA3QmU1aSs3MEkvNENJVnUvNVhTL2hQVDhEVVlZS3NzYTNzZUZSRXJhWHFuTmdOQXhLc0E2SXgwQWpYelJ2K1crMUZienJlWGFSU2p5dkhSUnhvalFMMGRVM0xLSUVQejFPTTJaVEFJT21DaE5aT0hiMTVTanN2TDAxVkNQejM4dXAvRVV4MElLdTVhbnJTR3VJb3Y2M21UQ1VJRzJGTnZjTjFPQmdrclFJL1Rla2EyYlQ1VXFLanlmT2FXdDJDQUx0VDNwVnFCLzRBQnNQWnh4UjdsakNNRHlFZklXZ21GanZvMWFJMzE2ZU9UNTlhS2h5MGd6ME5xdWNtamZMeVJVbjlnelJ2c2VtUUE0NTFrZ0JFa1VwK2ptaXFHWE1ZVkFOWVJHMnVaRTUyemJyRDRvazVtVVE2aE5jZGFjdk9TV3d6d3AvMVREby91NlVZamxUVTVwdnl5RGh1bGxUREFjUlpIOFdVY0pKY1JNTDdoZS9xUXliclY0cTRwR0FEcW9jb0FIZnp1N3pQQXJKQ3VIUGlTRFBvUjUxNXVaby9IdUtCWkpGc2tBMEExVVNiVVJ2MjZaZ0NzYmlMRFJRQ29aSUhCcHlQWHVzV0RyNk9LbStsZGJwa2lmNnE0b3ZhSllVbk5NMTcwUGs4L1EydkduOUF4Ymw3eXR4Z2d4MU8wNlMxMlJyWWZlaTlrR3h0Y0FudlpCbklBNVRMTW9NZjhnVkczU1ljN3lYd1VtZm1CMjdzT1FGS2RZUTE4MTZteTJxMXA5L3NsQThUcUl5Unh0Yk95QTJ6NU9UUytnaG1IbUlVWU91dXRKY0FqbkVYNHdQc0xDVUJWQ095bVQ0UEJSMlpLd3pmQzY2ak1YZzhHSzUxRFhibkx1RkNMT1REMFdQRFY1U1NvRnB3MDFEdE5pWHA5bG9lNGNMMTF5ZDlqQVBuaDI3UlhYUnRpTHVhWUp2MGhBSVFCVW9taURpNmppZkhkNmdRcjJVTU42TEp5K1pRTTdVQk1SUGdPMDdHVk9KVFB2MkFBcmo0NEdrcGNaUW5NMDRQVXBxN28vL01aeVFCNGYyeVIzUXZTWWdEOUFYbHZpb0RlU3EwTnpnQmNRcW51RE1UcEFSOWlzYzFNM1FnUGRZM2doWlFOS2dUUk1VVjhORzllOHRjWWdJL0dUSEtORm8rdWxvQjBFcWtwV0RRcjQwd3lRSzNHVlF3Z0ZpbXNYRzVobGpVY0F5YTZSaktBTWtpUFJxWGp6eG5nV0t3QnpyZVA0NXNNUUJ0bGl4S24xaTRBYXJCN1FhNHh3TUpFZVgrZ0RLQlBHUTJDQWVnRVVVTlFPRDJXWm4zQUFLMFhsT2JMM0RIb1N6c1Z6T1AxbkJxa1hKbnF5YzFML2hJRHNKOWNWYW5HdFJLWVRpSmhnQy9zbzI4eHdCN0RpNmV0ZFFNd3pCUEhWTW5VcnRva0Eram1kMDRkODFjTWNFcnBHaXZBOGlZRHFCMDFaREczcmVDTFVyUStnS05jcTd2TkFCOG0rL1dBRUlXYXZXelRuK0VHbFMyOE9UM0F4MnA5c00xNVBuVmNLVTR2K1pTYW1oQlpUb1ZibC94bEJtQi9MZGZyYmFCVDhQaExDYkJQODc1S3hkMHFGK1V4QmdHLzFRTkxYVVpXQ1NNRlBDTy9ZSUEwNHMzbmxJelROZ09rUGtxVGI2Mk5tVW1XbTRtQlNMYXRXeFIrTGdIMERKa2dLa2ZrZkpBVjBRdXdySFRPTUFUNUtwUEtUc3FkMnVMQnAxeCtaRTJGK3BLL3p3Qy9ldlRuZ3EzTkFPMVRCMjd1M2NDUmlHMXRYNldpOE1DNkhsMGo3Z2hlQTFqQXV1ajVyVjJBcVBXaE11T01iV3RvSjhPUzM1YUZqb05iY29MR1FxS0dkN0h3Y3M5K1RRY0FIV01KT0dNaEdZVWhDQUpHYmF2aUpGZ05hSmNRaFQ5MWp3V05KY3VhQVc1UDU1c004SDh2QWVDdXY3VUVEQW9HT0czOFZQVEdrbzhGK1ZTNCtMRXl3bis2cWtZWDR3VExQM3dndjc4TlBPYkdYaG9OYkx5Q3pxZmRXaWMyWHFYY00zVElHQ1NHM2FRUDdWM21iajhPdFJrQXpDM1hxenlmaTVFQjZpZFlRb2Z2M1pZd0hZZEpOMTk2R1Z2aHoxZ0I4SmFwM2hWNjMxdDdJVTc5OU5vbGY1c0JicXNmVkFKWCtLL1REU1dRTkFyRnYrSlplSmdSc1FjSFE5T0hDV1lITS95bEpWQzlvSzkveEFCcDJqUC9VVEcwbitLeE0yTVdYYm1GeHFodG5hYUFjR0IvTE13Q3FxOUk0VkF4QUZmaytRN21HRmtLeFJ3OG4vZTUyRThMWlhJeUxCamdGT1p5MEl1Ym8zSjhPZkMzVlhIdzhNMUwvaFlEM042QUpGMkdhRzRHa0cwZzNkb2h0NTJCZlpkbC9oZTBzL0pBTEkyenRpOUFsb3R4VzRQNCtUWVFFVnF2VysxTHBUN3Mxb2MrRGVhbUcxQVpDVTNtRU5OeHBpSkFoSlJHQW54QWYyZDB4bWxUTXdCbUNIYUE2dlBWOCtCWVhGUGRUNXV2T2s3blBqMlhjaGZ1Mm5Mdm1Wc1ArZmlIVjVlMlA5Mk0zN2drQ2FvSFhwKzZKT2lmOTk4MlFSUjBlVUpqQUlrd3dNbDFYR3B1Ym12aDlPSUNnU0E1YzUvNzFtVzVzVSs5N1EwY3o0UUNOeG5nWFE5ckxMYzluZHVyd3FFMGQyOE43b1U1Qi9vczJEQ1N1Q1lpRWRleW5LL1hZYXlHYmJwZ2dQUnppQjhWL3RnZC9vY2huVTQ2OVhuSVFoTG1ac1RaaG9jTSsxdmJPcDBaRHZPOHhZckJvemZOY1Rjdk1mTTdOSmNKcnZpd0JlUlArNmVYUmtpT2F5RUIyTGFNNHJwRHpNUW9sZTEwRHByQmwyYVdoUXF1TFp6dEhFMGhIbWhYTWNCanJpWnFhc0xZWFdjQU9NTGxZVS9QcGw5eE5oZE1SSDh0WGFZa1R5b3k4bURYRzhVaVlWYm9IY0pnM0FIUDFTc1lnUDVlNWZWZEo2SjhPeVBHZnRIcklhdk9BUUttejFDbk1lSnNsVjZ4Nk1UYVJidXhPQTlUOHpSQjRnYjVjeHJrYjE2U24zYVc5NUlyUGttTVArMkhNcFJ1aUxXN0lhNzVBaGphZWpkK3RMdTVmODNmM3dRVmZtL0pWU1BSanMraHVHQjBzVm93R0tGMnpDSG15TWJ1Q2dOMGgwcFZJUWlITmxhQWtnSGcxUnRwMElSSklzNGZmZ1IxSzdBZTBRaGQ0Um5lU3AyVFhMM2MwYVVHZkpyNjFFbXZOOThOTks2QWNlRWVVYXVxenVjaVZnWVZkSWo3S0ZhQUwxb2w1WDFjODhSWTQyakxKYWZ1TEJ2YW01ZEVTSk13dDRSdDZLVXdpdjF4dnp5NmRFVDJQYWdsdllGci9nZWFnUUUwV3BBRWgyQmZwcHdjSVR5WkF5OFhEeVFVQU80NXhnU3ExQTB4QmdaWXVsSS90NG5Mc2J0Z0FBa0Mwb2Y1MEpMZGFEbW94ZFVrM0RycGx0ZldEZEVxM0NFY0FPNFhpalpPN0ZPc1htNlltQzdEVlM4c3NKWTJiL0R5aGd4aFREMk1BQi96WEJuc3JlY2lYSHpqcVpnQU1GTnFub2REMkQvSDk5ZWQ4c3VibDFoUTR3QkJyZFI3d0h0LzJyKzhGWXJnZXRVaW1rdnRyenVoUHdPQ1J0U283c2tSK25aUUNzRFFJaEtiK1p3TytnbGRaN3QwYVk1UGlNL2x5WDBMTXVYWXpWc01JRDBoK2xZNjRZUm9aS0tLQVJDOUN1aFpGZmVGS0ZncVY0eEgzVlA0ekJ0d2N1VWtXQnpvbkVESUhJTjFGdEFsWU1QVU93ajlpYW9ScVNZMFF2eVRPWlRJQU9vSDVUQ2ZORDZ4clhuT1piaE04MnlGNWZROUxHZDI4eEtMSVJMVGd4THRZS0ZDZVBZZjlzK3VCaU5sUkZEUmtnR01aUTROZVV2WDB3eWNnK1N5OE4rNStvTHgydEpOcWNLUWVNcmhiNDRLZUxQeWNrZ3JHVUJhVXpEQUFVUEx4YldsU0w2ODNDTjAyczJWSHFubUQyOVpGSFlOSkhmdEp1ejNiYVpsZURRbXVjeCtqVGlUSTR6WkpaenZTWi9UekpYOUFLd2pBelROMmhBUTBKMHJESXp3ODFvUE1uaHhaa2dhQnVaSkhCVUQ4MDQzTHdHd0FUYm8zbHFhQndzdS83aS9IWTY0QXYxVjhtRzJscTNqUzRDTzVEeUJDc0FXS0JFQkZqQzFrQTlUZ2RuTWlTS2EwaXd6NzVHL2lmUER5U3RSeDR2OVRTTU5ESkEvQ3dhUXdWZ251TVFaSUlURWVLUGdDVEtBdnptMUhXbHBVV0NYakFheFcrUUo2UG5jRmpKZ2Q2aklJRFJ4YjNnNHZ3TTBiVm1DMUg0MHFySG5EQXlVUVRxSmdveGJpVElHWWdhOFJFWmgxR0ZVcTlBZkVNMmJseEJqS0FkVTdjRVZXUGYrdFA4WUFja2pVL1M2REVqZVFQUlVEV3VQTTBEaUdpVEVLa1JZdy9tRmgra1cwSWFNT0VJZmwwNFhLeVVqOSszTjlBdlBxcFg0MkhGQWk1OHI1UWVMdVBaN0FzWnE0UWt5ZmFnbUNGY0xLb1NMUzc0NUE2TWp1aGtub010MStqMkJaRjNpR2NHakhyS3ZNZkxkaURvSDkwcVROZXhrUWxRYWdUdEhteEI2dXFJSURVMkJ0ZzhjTEc4RW5LNE1vRU5WL1FBbGlTQVlibDVpaEhzeXdDcXVBSjMvdUQrL1Q0NEF1SXNIRUg5YnRXZENLKzh3ajN1SmJJS0NhekFscXBiMnNHTElRaXZiNm04aXFJNFZzTGpiQlhmam5CSCt3NEMyZmhxa1QxcGdmYWxkb1JNYkJRQUNBaFlhaUliNjE0bXJqNHdJNEw1R09ldkNkejliWExiMENXZ0g2T0NuWjdRbjRrNzJjbXl2RGNCSUhJUk1SUS9XQldtQmcvN211YndWYndUWVBHOGlaQkRzamgzUkp3ajlyMThDK2hPUXJ3ZTA0WjBVTUNMdFd2L1B6dmZ2UTNzQWxKK2lCMzNaSG9qb3ZjT2tYSEhucktQOUhRZ3B6TUhISlY3aUxZY01jQmFPbFA0MlNVbDRNamdBZUIvY2tLUEpBYTEvSW4wQUJvTWNyR1Q0eGhJYUpNREFIYjlLUUR5b29GSTJmK25UOSt3eWlzNEFseVZVbm4wbmE3T2w1Z2Q0ZVh1UVpzaXpwZlF0Wi9LUHRCaytWZzVCOTBRSExJSGE4MktaRUw2UGZ1cVN0NUptdWdyNmwvcnZSZy9neUwxY2hlNk5QdVRVdW1RRDlLdE8zZVgwWFE1b3d6dkptWnZOV0k3WC9XTzk0TXI1ZUU4NXVwbmhDWExrWHRyN1ZIN0xVQWpqYVYvWnlFby83ckFva2Y2bkk0aklSV3pvY3hCY2xVTm1nTFlqUndvb1JtbjZXcmlZK1JjdzVrdU9wZzlvK1ZNSnQrUmczSXMwc0xFVHdMaDM2aFhvU3dEbGkvd0hLaEEyaVYveTJlRHlwWDJqcWcxamc4dHEyZ2p0c2hGYXlwazhKUCs4VzV0dTlNQlVPOUVsNTIybVBJSWU5TE1CVVl1eHh4SDlkOHBiUVZmQjBEL3kzdjRRL2ZmUm43YWN5ZFYrd1BxSTZ6MGFaMnJEQU0vNFl6cldmbXZ2NkFCYWx1ZjdBWDEvSEFXakN5dE1kWHdlMzIwc3h0Ykh3WkNSbHhib1lDeEtYSXd3QmI4aTMwTE9RZHd5aDh5ZzZ4d3BQY0J2TXc3UWNTaEhJSzZiK1NYeDVTY09ocExFUDA2ZUhrUEhDM1hZZzVpUWFnNmNMbm80Z3ZqOTZMMmdPcVlOMkNNUFlVWnVsbVFTblVka09wSFdNOHhXdVVCN3JOKzRYREgxa0w3V3AvK3FlRGR4Y0RwUlVyem9WTkVEMm8vRlFINmkwMFFJTVBIeVVPM0JpZThnNlJITE45cTlyYnY0R3hKdU5yTWJvVU5mMGRZaDdSK0hISGpoUEpPanVCcExBT2NFK3lnMHdTVjc1Z2ZZVFBVN01DUXhrWmx4NVkxaWNFTzVoZ2FSUlVwTEh5N25kTVgrQ0MrR2swUFVQVTU1SFM3aHdOb3plU3I2OU9OQVNuYkNVVURSc1U5eGJyeXF0eHBIRCtEOXVkSTlJSW1NS2RnaTg3bVVZb0hJVyt5dGdkZGY5WHdzYUEvMzVjcXZQVmlPNERxeDJZR0JSQjh2NERwMVdtSXU4UXBxSFhFeTlBRkdZcG9tZ010VFI3QTE5WGtyRGZOT2xHbjhNQ1F5YjRRT1puMzVhbXNDT1A4SnFxdmNTcFVmaGRhK01VOU01Z2paRWxIRERDRTJYNmNiemswaTFpbm0xTVU3elFtOE54bkJkRFJ5VmlwSWVHblRCRTFINGxMT29kRDFIVnR0NE9NNEdsQy8vVngwY1NIU1RteVpjdFJPQmpPVXRyWDdBWUpuS3A3Q0VLV0h1cTZuY3RsUzhUOUt3LzRmbHo4am9Rc1BmWnUrdzNHWlFORTNteWFzZ3FiTDZncUpRY09vTTlrSyt2d0M2RTdtTng5cUYzWVJlQVpPdHA4VFUydlRjTDExcmRwSUNqZm9jM2VFV0dUcXkvcjMxbTBhdUpIMHhCTy9uYjI0RjVqWVVYbXNHZk4wRzRpaE1JTlc1QWdocHU2TE9ZSk1vNWx4dXIzb3ErRG0xajF6d2ZOR0JVaW96NHd0cGl6RUZva21FdWtGVFMxcEE3NXdRcjhUR0dNV21yOXZ3TzA3MEplcWlNNG5qcWNCS0RPNUNvRjJEc0d6cEMxdjhDUDZibmZZamR3cCtseW1jckJVTVR4RXFCRVI0YnFkSGlsT3RVT0ROUDBJWjkzOFk2OUxJS0xaS2JiV0p6dllzNGZYQm01UkR1Z205bXpQd01uNGlidkRndWFmWnZ2cWM0ZE1STFE1MFFnSWM1Ty9hZFdrZlVXd0NtRjI0Ymc5aHpWZ0pFZUpjdlZicVlsZzFMRXJJa2ZJcWt0enB0TC8zenVRcFpodTVBQ2J4cGc1ejYwWi9vOXlEbFAyOEtOOTA1NnNZK1NCd2NPc3RYc3VEY2ljY2lZU0dBS1J0b016VGlVSFdJWU5qaWRleWxNTkFKYWl3VDYwZTJ1UDNvblllTXVMc2hxZzk5VmgrWGJ1RG1ZaU9XUVJKdGhPRXhHdWJrYzFTVEdTREhFS0NqS2NpMTFSVUtzWU5Nd0FHaVNrYjdBNjkrUXcvY05IangxdTVucEYwNE9YQWlmYnovTzZZYXlzZlJvdGEzTjVjT0dOWHEzN1ZXb045MnRzM0J5cnR3L2ZLKzJCQTdoTkJ5dUdOZ1ZvQWJIdDhoeTdnc0VDN3RDd2RFYi8vdmRPUlRrdFZKUm9SbWpZT3RJczRobGtzRzZRL3A0SFp5N04wZnFod2hsQVNvN3duV1pVRHBFNXhmckJHTHBuTnV0aFk0RWNXT0pOdEhSMFBBZG1TVFZuZXI5UFdNcFVGd0RFS3ZibmhEQXMvWlQxdWJRUzYyZVFEbW9VSHF3WEhxN0NMU3ZTbjZpRHNHRW9qYm14WHdsY1pWUUZWcUk2RUNDeElET1RXSGtGRE5sQzFjeFFBdCs4SXpqaGRCUlhnVFRZMG1HN25GNEorbkVHb09HOVAyODhRR3F2WDVVZUFYRXZ5VmZRZ2MyekVSc2poKzBLRDI1UGwrWVBMQUZHU0o5dUdPd3c2K0JyTVkwcHZXUUs0Q29rN1FON0JBek9vRURmdVltenZDWUx1SGxlZFBES2hEQk1OT01JY3REL3NFQzAyWk11UTVEbVNJQUJYeHJNeGpacTdyV3d0REQ0ellRTjRiWFJCQ0tmQ1lDV2QvSjQ4ajY4WitSV0xGTWVqaURPdVFYeVdrQUZNenRUeFFBME9Ya1FmWnNCb0FIQWhZSXI5QmtUdnJYOXhCRU1mZmhzNlYzcjB4TjJtd0VZZlZlblJqbUYzK1dqYi9rTTNGdTFNUVpZeTczbEdRdlBwV0Y1VkFwUUhVVEFIUlAxY2JwUkhDSGIxWThJR0c3MHdNUnpnVEVWSWpOU1JYb2ZrMHVwKzAwaXJ3a1ZPV3AvS2pLc0g0aFM2SDlkT0ovY0EybUR3VHdheGdIdWZ0Wkx3VHFJb2tGMm8vQWpNRHhjQk1sS0JFTTRxYi9pTXhaejlkRHBFZUplcVduQkZONHpQNUtwWUxRN0YwdkFpa2JuRzBzQXZjUFN0UmI4eEU0ZFBhczBmdU9uSHNISkhyV2hlUHVkUmoxU3FQME9Bd3g2d1FDZXlZTlJBWE5FVDlwUTZDUGdFV29XbnpJNXFkbTRRejFHaGd4d1BMV21HMkdqS1FHVWVmM2VleklBTXZZbzJETFMrMkJ2a1liY0xoRzRIVnRBaW9Rd1o4dVFRelVRNTQrUWFRZi93TGZ3R05KY0phVWx4L0pGZ1FzZGw3bW01eG51VEpVY25RZHNPcWpZSGpvRGFGYUp5REFIb3JtbUJiVkJWQ2hjNjlIY09KVktZT0YyZ29iTnZrRW9nZjZJc3AwSlNGYStrSi9DUkJEMVZSQTc4aFNRSkQ5akFManpkSHlhUHZFemlaUkcrTFJHdXB1cm5JbGl0b2prbHNDNUJVTmVaMVVlQU9qZjJBYjZDZ2xDNm1ESENtRkNuc21sbERJVUhFemJtWDQ3NWtGeXJEWjFQK2dHZ3c1MFhYQzRKNFJCLzg3VlFId0dodE9TclZBVFp4S1VIWTZBQVpoNHpiSHRqNGtCZ3grQk82NlZ6QVdOOTZTWEVvR1BQajBsR2x3bmM2ZGJTM05relJucUhvb3FHQmtBZWdTMmdTcDNuQUc0RFJ5Wnk5dTNnUzVrRHRrWWg1cHhVeDNMSjBvOEpLZ2w4akFEM0c4ekFOUWtLSUZOcy9ZUExtTVBrWG1zYjZFNnhpK21VQjRhQ0JnTFkxaTJVajlBbW9NQnl1bldKeGlDaVQ4eHE1aEd6T0Zrc1Fjd1hoWnllcGF0WXpBRkJocXF3MWtHM2RRMEpvVEoxa3NjUXRIdy9YVHQ2WUdCSjhqa0dCUFhWUDFRRDJrRVNlam9VN2V5M1RzWDZLR0c0U0x5emZVNWp2SW5aSENrMnFqeEhFK3ZiVENMQjlGOUFwcGlTck16Z0R6WFcwWk81ZzJZWURPaW1SNHdpUjJCY3BNQnFPNmZCNUE2Wk9DTWtCa0JRTE1RclNMd01GaWNlem9Ob0szQXFaY29ITVpaNzVNQmNycGxYc3NmcWdSRVlyMzFPc0VrLzBBRkNMQjI2cFhmc1N6SUJFRFdMd3VPVzVkZ3FHajlaSUIrOWpMRUZGcVlIRkNFQ2cwM05ZSXBmM0F6UVlYa2NOQm9yNllQTlpPN2R4anBpRC9JbDAwR3NOaThZdmpMbTdmUlRBRlFPZVNIbC9DcUFSdTM4SnRXWGh5ZXlHdEJSQ2ZjVFFZZ2I4dFhxV3pqRWxhQUFMQVFOd0VDR0h0dTE1NjJpRzZlVmVtZnpEWURCcGlWMHkwejIxb09XNC9GYXlyVlFRNGxXUHR6RVRMRkZjTmUzMmFWTDFLUTZtU0FKbG95Z0p3KzkyWU1vSzY5U1B0ZzZhbC95Z0FlM0x6UURIQ3JNM1VyR2ljc05nU1NQSlhnZ2dFK3NYLzZQUWJZWjVhS2pCSStsdmk2RVpvYjhaWXRNTVNtaG13UnZmRnpCZ2gxZjZGck9wWFlBb0hVaFFrZ01DZHUzSmdqRlZWR1JKYllPajBOdEtRUytJUUVXR0JMVERmTGU4MjhYSEdJcWdNWUlNSGEvUVRxYWk4SmdUVURBb0REbEJnTk5vc1ppZXdPMFV0clNSeGcwdDc5VHhrZ1AwN0lEdDBxbzhZcm9qSGV2VndDRm1UWDMySUFINUVLSzF3eHdHVExCdDIwelFEanEyaXhaSURGNHBJQk1sWG4ya0tBNjd3eXVpbVJ6aHdONW5ZOUlEUzA3d0ltTVk0cHVZUUJWSmJEN0tWem1mcUJIZUkwcnc4bGF5UllPeUtLVDk5dVEyVk9VZ29BTERuSkFCWVRRaU54MHJuTE5pUU9KQTZRaWo5bEFCeU1YSEdpZVhPTVFiU0FPQi9teGRjbkF6QkErL2NZZ0NQQ0xCV0VzNVF2bDhnTE5aejhJUVAwcEYweUFIaGJkN3lyY3dqNnZLK09zb2pUQlBRRnd5QVhsVWRnd2gvRVlVaGEzbUV1T3lURzlBTjNGZHc4QkJVd3dkcjl6Tm5GVEc1T2VHcXBlRnFKMG1JVFdWTk9kTytGd0c4endQZlBHU0FrSzhoTHZRdERXYWNXS2I2K29BMzBsTkh2TU1DK2tLT1pNYW9TVDJ4MEgxeGRBZ1kzQU1NMHExOWxBTjFZZG14RVd3elE2Y0UrbUF3QVRpSzhOamxHMXNuYUZHRFFzSzhDb3F2L2w2NkNIN2NQUVd6RXBxSkpiWWplc2lFcGI0S1lEb3BrZ0NFYWRsRGpTZ0trNytoUEdZQ1lKSzZDTHdUTXVTc2xOV1orZllzMlBkTVlmb01CVG5YR29JQ201TXZWeUl0TEJ2QVQ4ZHZmSzVlQXBybGNBcUFEcmxhbTFOVU1vQys4bTZ1OUpjVktzYytZRE1zeGpKZFBrZjBsT2tCaUxoSjBqN1RuTnc5UkJTU0s5SnhBWFFibmhZV0NBL3RVcCt4YldUUHJjcVVEaE8vb2p4bmdFcTZkZUtDU2FHVm1pYVFObE1kQjU5Y01VQUZVeWcvM2x6dTBrUmR0QnVCYXhUMDdZSmw4MGR2YndQYzNBdlNSNjVORGtyc0FTM1dhWDE5dVlxc3hMR2R0NUFyMjdSeDZ3MVdBT09uYmh5RHBYWnJ3eVc1NHhWTTRScllKbmRRSnU5WnM5bGJ0WFFESDZZOFo0SGI2amFXdFZwR096dmZGQlFOd3Mvb2JERkNNQ0liY1Zjb0xPOEJOQm9ENWtSRFJKL2pTZkswaUExeVZBSVpaeE4wNUpDblY0QVFLMUdiRkFJUnF1aDVWQVVFSkREbVdxVUtUcGVGR3ZYVUlndjR0OUlueWhoUUI5QkdwVUtJNXhobmc4OERXcnhqZ2cyM3hmOEFBbVlpbVNraTVMR2hqRU03ZllJQVVmQ3FUODE3NWN0NDYxNWNBNUp2eGZmSVFPemlxVjdjWklGREw1UklRbHNBNU5vYWR6R0w3bm9zTUxnd2wwRGQxcGNpKzIrdmlURDdodjV6TFh6Y1BjWGZnaWVGZDJub3BIVStXYWdaUm9tbENBdlM5MVJLZ1lmdGZNVUNkZmlNTXFabnFVRnArZlVFYnl5c3orQ1VEK0loOE1rdEZmSGkrWElXOHVHUUFLcVEwV01pNjN1aDcvZHdaWkRMREVvenV5QUFKMnV3cmJsY1R3YnN2SUhRQTBiYm91YWF2RmxTb1BVTElEeENwQkVoUmh1cmNQbFNxVlRLbVpBNW95UlFjbVZKbGFJQ1RYQUlHYkx0YUIyQ2plKzF2S29IVG1DdG93Y2tGYmJyWXVLNS96UUFjRVlkWmZzUzk4cElDZWJFNXRSbUFma1BicGNtTW5zdi9jcEJ1NmdDWnM2UGJ6VjNBMkhHWUFnV0dOekJRbXRPdzBPNlkxaTlCelJjZUljOFBnTk9VYUdrK09kNCtWSUMxclgza0hvRWlBSXNiNWhvbVFqQUE1REFhWXJZS09zTTZZT21tTnFlL3VBMTB5MDBzTTUvOCtwSTJ5REhVWERMQXNQWUZjRVJ5cWY5d2xiTFV2TmdRWU5wbUFJZmVLWVQzc0ZDVTZCd1l3WjlMQUU3RGxTS3BDM3ZmRmpRZ1JqaFFtaHg5N2FIaEtFSE5GeDZodTJJdWF5djRaWC96VUtxQTJlSXBySXlTWDQzSXZKSUJ1bHRyK3RFbG5iVTlJMFR5SnhMZ3p3MUJFUXJUc0lYY0xtaGpTOWJjR1NBMWRRRlpGV2xnMjFrcVVxVXNlTWFiQVhiYkRLQkdTNXIyeVVKelloZC9wUU1zMU1teFdIQ3o1dzZmaFVjRUJVclR6UEhrTUxtcUFqVkhGaEdLN0x1WXl4eWR6TTU5dW4wb1djTmJ2VWU0K0dvOCtSZUdJS1crUlRZTHk5eGtnRDgzQlNjYnMvVTlJMVh4bHFhMUh1aUxncVpPVjdzdnIzaE83aWM3YURrck1nR1FOK1A5aTZHSVdENnI2cUpwc0JwemVQOXFGM0Q0QUJpY2tnMGpoM0luamhGVytyY3FWdlNKSFkrSVhTZHFLRnQzRjNNNWRqYXoyNGRLdFFxdE1nWDhrZ0hZV3FaZ2ExMDZVZjZRQWJEVnUrb01DamJtZ3lPcDZGdVZwaDI1WXo0L3lRQlVsUllJdHNsVVpXV1dpb20wOE92bTNtc2REVVM5WklERVQ0NUdxT0tqZFFQd2tiK3lBOHdialhOWXU3OE1BNlNCSm80Ujl2S2xwMlVCRWsvcytEZERQTUxnQ0ZMZWVRN3pPVnV4czdsOWlBTUU1WUJWbjFLdi9DVURvTG5OcDFBQ2QvS2ZOSHZFSHpMQWFYUExIWnhFUTNBYU42aFlzTXEzdEJCR1o0Q3N2R0hMSzhQU01DSjBwNkdjR3o4ODMrZmo0SzI1d1FCZkFlRlZuTUp3Skk5aHlvV2JVY0VJaHBJZ2RPaklaL3JMOEk1SyttNWdoSW5TUFFhSHNUU3FsNGlqZDRlUi9LWnMzWG5Wamw3TTVVaUlmZnNRZDVNSHJ1ZlFpekxTNkJjTUVBMEhxMjFnWmhMNFV3YllMMjhGaEtSbGZEVFJpc3BGREU2WkVzOU1GNTV2alFoNUxxOWVlNGVDajFFenpGSlJocWcxL1d3MUF4UkZXbGhYOEFYMXExR21ib0FZajl1NEFNdTFCVmpJeUdnSFpaKzFNYWgwRWdGcmNKZmtNRUNKdkM2MDJmQ0pBTEFheUhlTWJ1a1BMdWJ5OVBZaHFsWFFnQjhlVXNSaURmZ0ZBM2pqUVFhRVpLc1o0T09DQVJZbEEyVFcyK3NoWWJIWGF4cVgxUHlWbVRYWFNIWnY2NncwTUVDRVZPVHl5cjBlZzlJb0pqSkV6ZlBNWnJQWXZRZzhEQUZKL0tSaEZSODA5WUlsd3ZvSk1nZzEwQWtWQzlwdEZCWUVERnlCS2RhMmR4QThrZEhBTFNQTkFxSzhpQUVpdjl3VjFKTkd1dEtnZFBNUXJDNGVKR0lSVWxGTXJHQ0FwcmxnZ0NyNEt4aGdYalptWitRQmovb3Zrb1NreUMyeTNtWnVDcXdqa2JnaTF6d1FyZjcxNGdXR3RsbHNDT3RHSnZuZzhncThCSk5RZU1FVmlBbitpa3pUMlZoWmlhUWthb3RlTmtYVkxjY0tpUVVlRUVMNko5aEFCYW9RVngxd3k1bmlOMGw1YlVEQWJnd0p1MDhPVTc3QTRTWHdQc1EybzBrWE1vU01CcFRmYittYlFMam16dzV0UjFFK0RFc0ZmNEZVbDVyR2tlNWpkR1Z6UXE3cVh1Z0FHeit3cWxQejVZRHpCdytuYm9YUmpzUVZSb0NRbTVudWd5S2ROZGhmSHZOdkt6cGJwdUFnQnBSSktMemdpb2lKL0tVL1FMRnNWaXN1U2ZsNnowQUw0aWRQUU1YY094NzROam9ZVU5rcDRkOEVvMCt6YllEaTA1dlpLYUFzT095ZGdHaEhDSDk5RWR0TUlMUXlBR000TFdNbGRMc0k0cng5eUNPOHdlUVpDWjdKb25MVW4wQWUyMzg4U2V4dC9tY0hBWHFMUnRLb2R5VU9iTzJ1bVNTRUF4NC9jTmgxSzBwS0Z0K2xTa3o4S2dUQ2ZmN0MyaW9OQUlYNEd3RXhUUEpScE9EWUtMMlloRUk2eUNRUC9ncy82dllTK1g4OFF3SnhGV0FCVEVhZG5KNFJBSEliVGVkcjVnY0FrYVhIRWtBczBhYkVoQ01YQnJLUEhJRnp6dWNlNC9XNEVrU2FJZzRIUzZaTDdlQ2NaK05xMWozZVBqUjlKQ1lZVVM5Zy92amxFTnBTMDlEbVFPSnNXMDh4WG5jemJhTWZnSGdNeEhZTWYvVkR4NVc2bGExdlRGd2gvVXhrNGNCWHJvRDhwUU5KS1ZvT3Fnenp5Y2lSS1RnNC9DbFhnWFY3ajErUXVYV2JjaWJ5QU9MYUNLMnplRXU5SEUydVJ3b2haQmJ4SHNzUWttL0ZCZDZSMThHc0t0bVp0dzdNYjdCb0FyZFZQaGxpR3ZMSGRPVmh6ck1qYWdmN1BLdG4zZnZ0UTg1c1dJekFlbS84WlN0TmpycXRWbWlYYzRRcHhpbVMyQ2liOW5GQUtPbEpDcVl4WUxLQWVvNlFxU0hXTWpjRlp4SEdIMnlSdVRpVWF2NExkUzN0aDBNWHBUbnRwQU1UbE11cno4ZWxaNXc0RmN1c1pRZkNDdnp1OUhySFdxeFRUajQ3U0FnQllCTEFscXlTaDVuaHdIdVExOEJKalZrQmREWUNOWVUwdVZ5cGR1ZTVsZHpFdmlSd1c5ZklZUllKSXFRMlY5cjlYU2Jrc1lVbmY0MXZIeUpYazhuamw2ZnpLRWRkcG80blVibVlJOUJNWmpqT2x0ckpOdzZRT3Bta2dBcU5qL3c3dFJ0RXNERTNSVGxwd0FGQkEwRGNBVjdtb3BtNUtwQzVJMW4weFRwT015eXZQRUFwam93VEptSTliUkdUdlNGRkNQMEFMMkJNUnFRSENVLzJwa1RrSW1ORHJtS0dpZVo4eFJzVXBIWmY2NWNqMUVOaFJlSUtUNVRvVHJZTjg5NE9rQkk3aWdRUlVwdTY5djZPV0U0bVFhbG1YWEZvVmszSUltR0k3aTZnY1BCa2JqbS9jNXpIZGFLUUhQUXA4aDNsbVhXZUVCNjRURklnTFpaaUxuZUdXYVp1ZFRGcGtnWVlWYVF2NEtLWjJTM2c0a3BGN2drZDMwYzdlZVlIbmd3OWZ6eCtNeW5WTTlPeFBiZ1NwM29qdTBCQ1lsSklRazk2SmpkMmcyM3FzYUEvTXh5d0VIV1MydjB6OG16ZlVQbVcxVkxYMEhZZWJuWm12b1l0T0NwajRwbm05L0xNQTNlUmtJZFplbnpXYmV4M0pPa3BaNm9tSDRwOElaRld5bk9walBHVkhPYVVIRWFQbVNjSThRa2haL3FwMHpwUGlCK1lWVWtLNUVBcTQ4eDJZZ3VyYWRjWGsrYVlOTmg2RldwdGU4dmNXdWlaeTlqSzZmano3VXk1NUlGQXozL2hhdTRDbVhCQzFTdTVYK1J1QkFtSlNnTUpMYkhGa2RPRCtRMXlKN3QzVEx6MmRBRTVJcWtkYU1oTU82MUtIVnphU3N0WitvUVhpZzJBRmN3emdjUHpEVWlseFFOa2xwNndEa1NDSDgrTlJrazZZOW9lNXZpeUZVa0huUUFpRGlVNVFJZVo1cG5jaFRFalIrb2dPaCswOFI1MW5oQnQ1UzBZVzVMYmNUa1ZoS0pxcldrdExpWk5RUU5HQTMvVElBSUR4amwzbW9ZaU4xQVBwNnV2MVU5YkhBajBQUGxzcEprb21IQ0NNM3JYcTdMY0oyaVVpUzJFVnN5aFFKVDRZazRHaUZUQ2hxbkZrNXpVRU5pdXlGUU00Q1JxTXdETHg0anZvSWtxUDB3Wk96OFF6cTFpNTA2a0VWWDBUT2h6NG9SbWRrUlN3NlJXeXN5WjVRdkpLYklDM3BNeTRJZTBiemZRQnQ3RGZEYm4wRUdZY2VpSDM2UE1Fd0pDRWJ5T1cvZzFZWkREWnhXYmE2Z0FyVW1qMzBJYVlLQ1pBSVd2SnYxcGExcTZwWmM0ZTZZWDJkREUyUFFUUGMvb2QxUlNZc0lKem1oWWo3UE94VEpLNnhrTm9QZlk5R0orQTU0cGlnNVlBbEk3VU5wVnhaTklyVlV3UUpMb2dnR2VrUGxFSEdOZ1VaaTNITG1KUEF5QUxYeHBocERTUXpBeEhHa21NUnB1U1kzeUxPSnI2Vi93S2RLYkcyNk5lUVRzQ0JKQ0JPS0w3KzQ2eU1hU0FEb01GVUJrNUFuaDJ4VzNTQy9CL2hxaHNQNmZWT0Y4ckNiTkVrbXBBTnhGZUFCRk9CZUFMZ05uS0FGMDBKRFZndFBWa3o4eGdVV0Juajl0M01sOGNLdC81bjJBazUvUjhOQzZScEhZd2tRczFXdm1OK2gwc1IvR0N0SUZISDdkWjE2Tjk1SUJNclZXTW9DVFNEcmJTd0FFMUdwWGVRUU51VWt6dFZIMVRtYU93N3djclRWR01vWlJ4NEJha01obXpBdjducEk1MGtqSXdKRjJ3SVB4RUtpNkxPVWNnaVFybGxhVlEwVWk1bVBrQ2FGOGl1Z2lqR0RlWXVsQlZkckZ5dnpJUUFZdFhwZW9LaUowaXFXYXNCbGJ4SmNucFQ5dmN1aXZtU2M1U2MzcGFtbDV5UlpDS3FEblRaQTU2UGR3MEVCTnlCb1AwWU1IbVFXakFROS9nbHhIWWd2YnBNY0dHM2tzVmx3ZXNVRlhvTFFXTW9NUlhRYXlISzVNclpVTWNBYUowTm1XQUpDbmcza1ZFMkFTd0ZrV2ErZmRmd3FZVjlNUVcwYi9zOXJyZXo3R1NndENGNHlaSHhNaXdIRnJHcVZTSUFST1NKS2xBdEM2MjZVOFlZNnhQUit6SUZtZUVLK2p3Q3pLbEtIa0xVL0hBcG80b2FBeXlxeGtSdHVDQVF6ZExQRUI2cXJ2TVFXT3Bkdkd3Z0N2SVZrY1ZqTGpaTmFSUUlMQ1NFV3hjMSt0NVhseVF6bVZ3UEE2bndISFlZZzJaV2JISENNVXNaRkRRZWVpdTNmQloyWUw1LzhvQStWd0ZhbTFnZ0Y2U2d6eFZXRmdhZ2F3WkFvQWxCNGlLcWlPblRac1lBbnpZa25JYVVTZ2ZIeGdQb1k2elV3U0VGQmNCR0QzOVFJRElEWHpDSmd0MG85UUJwVU1VQmxzR2VUTVBDSHVRNkpta05VTDlKa3FjamhWKzZyZDRoWk0xTWljMXNrQXRodnFlWWtHMWdmRGJaV0N1aFoxcU51ZjZIVWQwZDhuaWs3RVJXbVg3cWNaN1czcDF4bUUybUhWekVUZVRqcDh0WVI3UWJ5NmlPVktqT2hJL1NQRDBNeEpQc1NMdFFMY1I3dElyUlVNMEtoekZjTWx2Rkl4UU5TdFVVQXBWaVRZREs0eUFLZDJGa1hpTDdsNDNoRGJXU0RqSVRZeFJ6bnpZcS9TVzVWNUJDempzRUp1b1JwZ25hc1lBQjZ5cldYTUp3TmdtQWVSajRVN1FOeGNJeWROZnJ0YVBsb2hRVWpYVVpqWTdZMmdMV1pwS3k3MFZxUWw0aU16S0V2YWlybzlkMkdtMkljYW4wVWVzSmhhcjJuVHdONTdtcnBwZ1VZQ3c2QTc0VjZRK0UzVExpSU1Rcllqa1lXUWx3aUhjOCtEWEVJQzlCZU5Cam5UUTFjeFFGYXVFajBnY2poY1k0QUM1clhnV1I3dk5SK2dFTENqM0VLbkg3Q1dSSlRhUWU5cUJ6UFVpbHNvYnVzNHlqdGRmaDhxaEtCMW16WjZJbTkxTEV1TVpXUlNJRjRWMjBSQ1piMk05UnFNQVdHRXRZSUwxN3hYRlF0RkFTZDVXbzZEbDdVb2s4bU1hVHVEWXQ4UE5kNzNadWhGWkVpS1VoU1hndVdsanVtVlJjZnpWMmJ2OWZyTXY4MEFaMFd3OHZHT3NVR2FxWjdId3RjTTRBc1NDbjVIdE1ZMUJraVlGem1wS0kzZlhWVmxBWkZPY2lLZGlLSGc5dURFWmRZRE1jNU1HTFdrR3BLai9GVHVhM3B6ZERPOW1GY2EwWHRrNGZaV2RDTnZVVmJNRVpwNHJSTnE0WDJUOWM0QW1aQUhnYUxNbFJBWkZ5UjJLTkswUmRXNEJRc3hvVGVVZS9SU2hKQUJGc0FIWERLQTJaM0FybitOQVpUK3ZnMU42MENueTFqNE5nUGtnclFOZE5EMktnTVVNQzhDUDhBQWhpaXJHTURUeVdGck1SajQ5bURKWmRhR2M0RmRYQlEyT3JOYmRlMDZTMEFmM1EyMXVIR1JCQ01LdDA5OXlXRXZDUlg2SXNyN0hiZ0NNbURYRmk3TndkZ3E1QXRwMnpTdGpBdno5VHlpUnlQanpScXh1aXcrcFdNRDVSNjluNFVvSGNRU0VBeGdoWlExdnREQnIzK0xBUXI2bDNhQUx1NTZnd0VvQmw4bjdMN0JBQW56WXJ4WE1JQXMwNWxPWW1hWVA2SlVyU0lWakVtYldHYWJOU3JMc3JiMGU2Z2hIT1V5VDhnbjZyWTFoOGdlNFdnWjZjM2l6NFNZTFpBYVEzc1J5NHRlVkYxVVFJekhxSVFXRHJIWWtBRXdxb1F1YnNNQUZldjFZS2NJOXFwb0xxcEtpckFJNjV1dmptZkRqMlhRYUNpQktaYUpvWmJSSlBqMXJ6R0FEZzBOa1pVbDhEY1lnTjAzR2FDdEFtNEtCcUQwTEhNaG9wRDh3bXJTUWZZU2Vxc3F3L2s4RUlJd2Rwd1FPT2tXOVhmdDRMRll2bm95OXN3ZmsrRm4wRmx5eFlvZ1hIaTBHTXZMdVlZYmpyak9PYlJTUGhsaThSeVdoaHhWWGJ4WXF3Ym5Jcnk2MDhueDhGeFpQWjIrMGtzRzhOQXo5TG84bklwdTZoUExmTzFGMXJiUlNDN1hxT0MveUFBS3FXUFc1Tk1mTW9BODdHY01rRWtnUE9ZN0dZREJ2c1NKZU9GVlJhbXU1d3RLemdLbTdOQzFsSktRa2RxOWkxUkY4V1pDQ3g5bWl6R3pTNlVOM0htUk9EYnR6YlV1OGJtcnFIT2R3aDZqZXAwQnRKbDVaUUluQUZSN0h3OTZHQmdJR2d5QTBMTVZlNTBCMUl4UTVyQjZYL29vb3VoNXIyRlJ5Ny9FQUo4ZkI1a3FGTG0veVFDT2xaMzhRZ2VJSkJBQjdrb0dzRnN3TVdGVUdkZkp1eHBFL2puSHUrc0hNK3NkS1AyU0czNWRJaWhTUzlhOHdwazl0RXlnUXJaQTQycWtIeG9RaktSSktld0xCbmk3dWdURWhzSEMvbW5NRDkxU3l6RzZFaEVadDdTVHlLRUwyTUxVd1ZJNkxGWVZsSGJMdjhRQWg4WVcwZTN2TGdFWjBObnR3bzdLMGI5a2dFZ0NFZkRPTmdORW5iak1iRERzaHV4dG95dDZGL2t1UkNtNkR0MHYwNldSdDlqWTYwS0VyUW9ranp3REh4ZmpWekFBVlRoa1M2bVZRR0t0RnRKU0FpRGhvaUUvL1FaUWtBRVJRZTkxQmhqRE9KRUZOc01aOUpjWVFLaGdTWmZNK2ZVYkRCRHlTTlVjR2NQYmRvQUVETlBnYzZxWGdNV2NIQUFaNTVqYkJGUzgxQXlRUTE5dWk2NHpRSUhzY05YUVd6bFEyVnN4UUQvYXp4Z2cxcWVWNm5EY0Jyb1dZUVdFaS9MK3hPMkxFQThkZ09pWXd4eTlOeG5BdlJrcVZ3NG9Bb0NZZ3BzTXdIVk83Q1M5U3hFbWZIZ3hYTkI2YWREOU5RT1FtN25SU1F2WUZRWWd6Q3Z4d3FkS0NkUnJtWSs3V2srSnYvOWZNY0EyR2NCN2U5NEc1VXlKM21BQXdGdWpkVzR1QWU5Wlp4dlZ0SnRhWDlCMFJZTmtBTDZRQWtLVEFaeFk2TDNOQU83UGxFbGpDY21GL2c1TXRYenpvNXBVOWlRUkdUbU9oQnJxSnVSaXVMQ2hvdC9xTnhoZ1hKZzYwZ1orbFFHWThpQVNRWllNTUFKMFVUNituWHFtaERGQ3lwclNZMkxIRlB2U05Eck1CRGFYT2dDdDQxeHZWdndQVCtRV2xyMHNGQnFrWG8ya2RYWXJRR2xLWVYvNEF0eVZCenNPbDlIOEVxaXR5UUFjUUd3am5BRml5RWF3Sk4xa0FPSVN0Rnk1ZUhOeEZqTmpVUUpCRWp1cDBwTTRYeENQNk5zWXN1cFZVekRWZ0o4eGdLZmVjUXg2QlpQS3NyekpBRXg1a05qT1pBQjRvQUJleGJFYkVxRFlCUXdkU2srQUxidkIvSmU3Z0NGeGxnbEN3UWNxVFdnS0RKaStiaGxRKzRUYk5XNFpPMHIvZVE4ZzA0U0htN0FuL2RKcStDbmFHU3ZrdnZPK2NrUFZackc5TFBDOXV6UWs1SnNobVRuczdsZWhpOFFsc0lTOXM4bHBIS1pvVUpVTTROdmJneW9Wb1ZmZ1ZMTHE0bEpnam5aUUE5SkhpTFdQdU1OZ0FMYy9iR3AzQjB0TjFXVjVqUUU0Y0ludXJoaEFvWXNrYWJIOWd2U20xRTgvcUFyVXpIN3ZDVFZsOWFuY0VXa0hnUGpEYzhNT0lPUkRGZ3lZQW8zVVdLdUorSjVIWG4wT3FsREtmWWRLNlJUMllRbmN2Tk52Z0R6T1ZrMTdiT29zTTJnc0RwUkNDS0xTWHBnU29ScW1WMFgwQmUwOWVFTHVTd2I0K2k1TDJJT2trVlhRVENjTG42dTBuWnA3d1FnWjl1azVPdGZ1c3llcDVhbFc4eVpOK2p1c2ZZWTdoSXRJcnc4TDVMTEdTVEVTcGwyV1YzTUYxMzZnNWI1a0FJMHBoM2pIRU9jdVFDVm55RFBEU0RLSlZacjgxTFZDSGNJY2ttdU1wMHVBaFJvVDRHc015RjVpdXhIcDRkWTlHMzFRaXF6bEQxejRoaXNUWm5BR3lkUktrQ25TKzFQaUsvME4zVTRMODBKT0pZUFh6Z1FONGtwMmsrOWliOE1KbGdJM0dZQ2RKbWt3d3ZSUTBKbmgza0R6bnREQkdIaGdFOW83ZEhyVVRwQmFqYjZkQVhzUlpVQVlLWEdIc0VVV1BvZ2xDeUk5RTVYR2dwSjFXVjRraTZiZ2ljeUJKUU9vWTI2VklGOE1HNmE2Q0paNVp1RHdvQ2NZQ0t0TU5XSkRzMjRpN0ZOL2tjdGxraDA4MnFEVVdSQy9nTExGNkxYUjExN1RSUUQ0RGg5L1J0K0ZzT2UwSWdOZ0ppU1FHQ1dwZUYrUVpkNExER3ZwVG93WXdyRUZuMWh2U3RoTklYQlpnTWREOCtHNFpLa0Ntcy9wenN5UXF5S2ltSVNrajlvTHZ6dTRORWk5QmFuWnE3R1poSkU2R09oK0NyUXdvOTgzQUpVZ3pGNmJZU1FRTVpsbGVXZFdMOERtYWVZT0xSbGczc3doVHZ1RGNxcHpQa0tqOWtyZUdEaTZDS1EzNG45SDdJNEVObzRSWG5QMEdXKzByQnkwYXdiL1JLQXRISTNxK2QxU0FiTUpOSi83aG92NUxISUdaY2s5MENDQnhGWk5QYjNNdTFWZ1dNdUFnb3dpTm84MGUwUENMbXVCZTJKZVRTOWh6MXFXckt6b3FSb3k2Rkk1d0RBRkV4SVNyT3A0MU1temcwdEJhdndBZEppOUc2L0JmTys0UTdVUEVTMk1LQ3VyT3owbW9oVDFmazhPZElwS3YyQ0E5QVBacWxBd2dCWWVvM011NE5BbzNFVzMzNW5nOVVoZzBldVp2cEVJZ0VrM1hQd21tUUlqek5GbjJmcFRyYk00TUdMam93L2hSNHZVeWVQOEFGVmNqV3pEZFpvVk02akkxMzlzb1lxQmtMUTRFNXpiVFF3cnZkMW9pU1BnV2hxZGpCNXBDVnpHd05ZbDdLM21kYVJxUVBPdzY2enhyaTJ3TjZ5SkhzaTVJUFVMb01QczFldlJwbzdKQWpxY0ZCNFRKanoxSTRpOWhVQ1E5bmhmNGRUdW9HUmt5WWRnZ0tacHNIUng5c1pVei9sNHRraU1DS1V5cUx4bnFtR1IyTzBRM2E2R0VDTXNqWk9DRWVBdGJEZWhVYTNlNGZNVEFWT2NRQ0NLM0JpOSszSUdaYjcrWXd0VkhMVks5UTVLbGdJcXU4a3krWlNsRHZqeDNwU3dJWEF6Q0xwVndoNkkxV05CNjZTZjlBYTBNZXFGSDRsSDFSYkl1WnJVN0JWc0dvdkY0ellKWUxWeXI0SHhpREw0ZXpDOXdkWlFhaGdsT0V3SFlEMVJWd0Y5SlVNQTRqbG5MejMvaUJibWZQVFFjbkQ1bTBvcWpLZVZjajU2RFhJTzg3UGhrd3M0MW9Sblc3WGdXbWRoVmhQdGZRL0U5elBSVmc3aUkrRG8xYXZhWHBsQlk0aTBOcEFZTzdhQWRyOEZXUmhXak44dVN4V1p0cm5vVmNoZ0NseURRUUE2a3lYc3ZmWWlrWk1WVlExTnQzSDQvcU5mRUhoVW5xK0Mya205U2R5cFFtcVJYWURqUUFnN0lLcUI4Y0F3Nmo4UXBaQ0RKcks4ZWpKTHdPa1NrSWxOZFhDSWtFTGo3T1hwSitJRllqNHE4YUsyL3h2SDg1NDRFdWtHMUxEc2R0UzZ0TEo3aGhZNkMzbzNLSnB1ZUduMnZpaG9GNTA2VGc0NTFEc1l1UHAwTVlQUUQ3SVVRR0xna0lJc0xPMnZnaE5WOW9uWHo5VlNENHpMWHZ6R0lmN0VQVm5RSHc4bVdvdGlvVVFSZzlBNFBTVEQyNXVMREZUWFBXVnlGMExjbGRRRjdqUTQzcGNYVDJMQnVVVEVtOHBSenpHRHVDMHFMYnFEQTJxS1JZUHVpRkFsMGtOYjR2MkZqWHoyWXBvU01SVHpNVW10WUdEbjJySEtxS09Oc25aclB6bGZtWVdqaEc0UW1vamZRbWVKWWNlQjZHVWZ6dzVNNDRaSVV1a0pZcHA4UENuOTg5WGtlZ0RzajBvdW9MbTE4U2lQQjZaMTR4eUdmdllhOCtrUkhMTEpxSitWcUlUazFTVUhZWlByUGFicDVtUjRFd0ljbjU0VXcwOGtqRlp4cHM2QTZ1L2tpOFNkZ2xTRURsUEJMTExFNmRuTXpxSWJSdjBYMjZsd1Z1cldSdkZDMktaYXhSREhxQU9RanBaNC8zcFMrMVIvcWI4UjJNQWxocEdOcDhlU2hpTmdabU1BL2hiU2pqR2NlWkZtd1FnbzkzdmthNUJlRUxSTzJSQW83NzJ1SUlGbWZJQlFzSDVmRng3NEdlT2x5TklacGlCbW00c3VOSmVoaW5yTmhkOFpuWWhpZVgxVkZGckxEK2ljaVp4eWRudzdSU2RLdkZ3SnZ3bVMxTkJScmU5TkpBeXJPR1BYSUowV002MmtMbkduSXdTc28vNkhiVEVaSE91eG1MUTlOVDNkUUNNYzNGUGpuNnNpdHBheDZnNUx5LzI5Zmtqa1B1QWtmZWZNSWFsRWZtTzJjZ0pUeWpIVkJZYng2YldBeStlU2JBTmNKQzZKazhCc1hMWWhaVW9vOTh0clp0emxnbGNuYllFK2NLUllnZjdtY01ZM1I3UlNNNlIyOHBJS2w2NERvYnkwaVBQdGlmWU1MT2RMM2JmU0dhOWZ3T2FJaEFUbFlubk05YkdnS0ZkVDRvc3RaU3VBKzZKV094Sm1uMEhvRExzRVRkRkwzR251ZXhuRnZHN1UxRUxqVTlhbFV5OTVHT3VpTm9KYU1nZjBxNU1CTnE1eEtHRXozNG0wV0xteWw3UFZwMlk1eUJ4R2JZVExveGVpYk9zMWxJemdXSFFJQWFhRzdtcEpDZVhHYWN5NGUrUU15N1JOMEFoRDJVaXlrQzQyQWQxRjE4WGd5ekwzWnNobXk1dWIyNWR5b3dMb2IyNytJVnVKUHlTRVdReUxQRFFhWW1QSzR1RlFrRk5EUm5COFVsUmJZQkJPTTdxa1pZb0NkZFF4MDNFR29VdWJPNllUVzZjTDNHa1p4ZHhuTEtiYUdNSzJHeENuVEtXTHdzcFd5UDZWRE1DY0pESnA3alAvRVJWaVR1b0g5dVpzTFJNVEVoczY1REFTTHUrR0daaEZ1bEZEaVdBQm5JUTVFa2h2TXgrVlVHNGFXckFEcFNTZFpPSzJJUmRJbTVZa3l4a1dCdERsZ1FJbXJFT0NxbEttSW5Pb2RoQUdqQlp4aUhUb3dOSkU0QUdleEVxcWdDVFFDRVdZTE9qc1cyU2d0ZkI5bTFrSkt5Z1RPaStMd3ZMOVR5OHdROHN4MHp4N3pQUW1UT0lMSnBmT1FGcEVNU000bGhHVEhFTFVRd2FlaWNEWGdHa0RvV1FzQkNWUUJaUzJwNGN5QTlvcDgxOWs5dnZZVHpQL2dnMHlzYUVkbXVEOG1mNUVIVm1GOEpoZHprdlI5aHdDSEpHWVJHZ21sRnNCVnBGeEY1S1V4R0xxUmtjRWZTT3poSk9sYVl3dUlXRG9ZVkdraDBZTHFscHNFenFqbk9Wb0VvZlZwRERqRURJRUttQzBQT2pqakxrb2gzQlBTQ2lhU0hBRmcrTnQ4aEpOeDJrYUZ2SGxkUW13TFB3cTZmeGd1V0hVRzFmY0tSMW9HZFdRd2JGcFBnVmJBM21EeDdsSm1veUw2V1pLb1BZYmpLWE1nYmpFbUxwWmpkdEVuNjIxMnFuQXdpdHVMREtpREM3Z2Z2VE5FVWZlQkFUWUdLQnZFRVNhbXdubFZtOXlaTnpsRE12a3JaaVltZG5GSzJXQ2xvRk84UUlaNGdrMmZIWkhtZDlyUFlabDg1REVnY3JNaUdicGFvaU5lMDFzSEFQRUdrRE5ES0QrWHFUb2I5YkNoUkV4NjZHaVZ1NGxmV0xqVWdjWTlPUjlvUU9NR1J4cnZsSlB2MXVVQUZIY3FZZXdaZlhrNGFRc2FVQzJMdXZNSXBVZkJCRVlGLzRhR2pEdlZMZ1l1R0diZVUrWkt0VmdjcWdvWEpYMGh0NUpLVWVSdzFnNitUKytYaFJyMWI0Rm83OERXaFlRWURwMjVDb01aUmwxVXNhdWVJWDdQdkFFSW1kNWZXUjJRV3BuakxMd3dRRVRrTG5OTE5wbGg2QkhXVExubEVYN1UwQkpjTms4RVpTempHZ0dOczZCRVZYSi9nRmlmK2xFUS9Ka3p0R3pHSzZqV0ZZRWl5dWhFZHJPSVBiVURVclVXeEZFTVl4eVl1V2dESXNpVUVYOTlKSUJuSzJ0V0FDSGxSSGRmV1hwMEJjUUVYSm5JRGZlVy9tSmQzbkZtTnA4cWpKWUwvcktSNGVBQUkzRFk3NHVRMW5vVVpCT1VDMldMVUlMNTFqZ0VITm52a1NPL2cwR0FKUGgyUU9NY0s4SjBUenphYW54QVdnOWFFQkZTUWdkUi95NzZtVjVkRWhuZWplRE9Qak1Bc0JZUm9IdHE1TDlvdXVmUGRneWt5ZXZOVVZ0SFJ3ZkZKME1pd3BobDVCRGVsc2lyRFkvL3dZRGhFRFd3dmU1QkJSc0xjZ2JobTdqUGJpSVdBZ01uWml5Qkd3OTZYMFVJOC9xc3loVWRtZ1dWZlNmem5QcE5UWnlTQTZtU3huTTV2N1NnUW1ZVGtFUFZVWGhhOERsWEQzSmVtMEd5SWh0Z1BsRCtnem1Ya1RacCtWaXJ2ZUVLemNQOHBYQkFCWlpPZWRWM0M5amxobHhNaGw2d1FCeUFrbUdQRXdaYkQxNVpsRWNIUFJLWUFyZWVjYnl3UU5aeTBvTzROc3pIVGwxQTY0K3J0ZXRHSGNXcEs0eFMrY285MExQRXpKK0NQc3ZXZ2dwVlFLVEVTT3dSRENTVlJ5THVZUEJFbEhKUHUvQzhKclBpZ0ZNN1NTc2l6QWJCbmtOazJZMFBWNnBlYi96QmdrQVZieHI4UzAzSlFBVlhxVS9kcjJOL3VGQlRDUmtNeGowTGNKam5nZERBb3p3N3hwKzd6TDJsWFVFa1BvL3FtK25KSmFsbEpBbU1Tek0yRzg5V2hkTDdwY1JzQTdFZVMxS0FKZXpvOXZOTk5XY3B3bEV4T3RXQ05OMmlHOHFnY1J3UWsrbkFPOGZYTDNNV015T2NNdTZaRVRnc2JYSkxaSUJzcHhDVVZJdjBWZnR1RlhLT2Fvb2tkbmVXS2VNLzc5YTh4NmRYU1lCcDVsNkdaa1Jiak9BblVJcjFueXVTcUxNQkdOQVRrdnBHZlFYdlo3SmZ6OVk2d0RDRjRTZExrOVphQTRuTWlMWTlTaUdsODJkTnJibm5aYmwvcm5aNm5tY09jY0FWdHh1RkEvTzlYRWdkZ09tUzZ2bmFWR1M1am9EVUFEMitpcVBzeElHck5YNEJ1dzdDQjJQR2dob2dkSkFZTWxLTjdhTnRKSUJvdmpMMmVIRVdBR3krdXpWQVBDSmk0dW50N0xxUWsyenk1cjNTQ0VjWlFDWWREUnBmcHNCU09OVlQya0pZc3E5SyttRzBvYnlFaXY4eTRQMzFTNkFLd1A4bFV6QkYwOTRhOWNaUXpxOXhRSVJUcDZSY0ZyV0k0UnhqblNHbmRXR2FUS3FDZ2R5TDJReGNEMmtTVkIxcnhhYjhlUWJET0RCVG9hL25qdENDQ1ljYkpZQnFMWFEvNnFDYWVKYkVyV2lyVndDT05ubFBDK0ZHelhRR0dSL2pRRXE4QTE3YXdhNFd2TitvOTdkL0RMNGZIL0ZBTHdaYUN5TUppdzZrczJQdm00VmZ5NmZyNlRmV1ZyTTNad2pXdG9CTFBCcGlFVHlwYVlIR0hjWjU4dzlwNkRCRDQwU3phZHowQWNpV0kzRlpBMk9nVjdlUFZlbFE4ZjNqRDVid0c3Z3RnWnlEQ0tsSWFQNExkY1o0SjNoam90R1NlMzJJVXNyQ3cvQmVSZmxBYk9HTVZzTmlPODNJbXNyQ1ZBSW94RHFUaE9BaFpJQjJxVG0yQkVYMEZ0VkRIQzE1djI0WFF0cXR2OHRCdUFrMzVrK2g1eU5DdFhOOVZlWlFSbEF4QnRTckVrSGFlbEdLbWdOS0Z6TkdPbVNBWExreVRVT2cvN1EzZWJPQmYyMFBpc3owaFlNRUhWajdDU0l2QzRzTUgyTmdhU2cvaFdhcG1ZQW9wT0F2eGEySlA0YXJnQnR3Z1NqODBYSncyamtMSUlPTG5TQTJLK3ZmUVZnZGtPZWRvc0I2cXJuTENWUjlGNnRlVC8rZzJwd3d3czQwZHdZZ0g3dVRvc0JWaU1xZ1VxellJRDBCZXlnSi9iV2JnZXJHYUNTQUJtTWpCM2Z3RlU5cHcva1pKbVJsaE9hREFDOFlkd0tIZ3BZNXRhUnBlaVBHSURTdE1aZkV5RkZFMDZCeVhTalVaYXZnNG1WRWdkZ21wb0Jzckl5TkViNkU1SW12MTRDN2d0NCtDcG9WdFc4LzJNR0FFRHEvQWNTUUFmV2xjQm1vT1RqN3AyT3FpNU1BQnBKdkdDbWtTczZ3TUV1aXJRRVBWaDBFaWRZNlFCVlJsb1NUbDhPWHh4RHh0eHZxR1ZZb0RSTHhha3NkVitrR1FITkU5VE5sK0JsaVpGY3FKaWVZQlVoN2pHRDk1SHdiR1ZLQ2k3a3NHTDRKeXdmbjdYVjUwYndWTXh0aDNTVkFiYkVnSEY1SVlwVUVUVUgxOXZxbXZkL3lBQXkrTmp4L0VRSDJNMjVicm9TT0RJbDBIUUExeEJuY0ZVREJpQ2tiRVFsd1M0aENoOHhGVUVBWHhObUNDWkUwcEplR2pMQitFYVdseklqN1lzZkdFRXFjOGlxM0cvYkNkTWtVTnZMc212ZEdqZEZVc2NmSmFxL3RQbjV1RUZMQVZ0VUpROWhrNFQ3cjhLZGlReHNIS0VFQmdqejFnS1BBMVdXUkY4eEM5RUZBNGducGxOWnFqRmhrTFBzNEF4UTE3ei9Zd2I0NkJNZzVma2pidXdDS0xCeEVBelE2ZW0vc1VlYzdTTkZlcitudkhHV29XcUJ2blJGd0toZExFTXdoaTBpVFU2WWlMR1hNS2xmNkZpWTNxamlSd1pJWG9MbFNOK0MvVC9McW9IUndiaVQ4Zkx1cTJML3phM0hJcjJCZzhvU2FCcWpFNGxLb0ExclBHNG1EQkFaWWo3VnFtV1FzVElYaEE3M1I4VUFtSjM1UkF4TDVKVnNuR1pWemZzLzF3RWF4WmpNM2JORUhyMXVCd2dqUVRJQWZtWmlFL05WckhlOWhVeDNJVTdjbEM0V05ldGxQY25TOGdyWG5KdTh2SklpUERwRHF5bk1hUmR3VDVpQ3E1MXo0aGhIblRRZE9tb1p0ZFNaYklQZll0MFk5eXB2SDVPUHVKOGhraE5IUE1ENU1uai8wS2ZCM25kRFdBTG5rZkYwTHd3dzgrTEtyS2hMbTZkOGFlRGthZ1pRWjF5VFQ5d1VtV1huNjFoVXE1cjNmODRBOFByQ3QveExTNkFkYk1UVTBqUXdad25yOStzNjExWmpWNFIwczBzR0NDNVhpUVpyT25mQlNVM1RIVC9sREZneU53bFd0RU5od01uNnpnTUVVN3Z0ck1BeERteld1UE1BZDBJS0xXVGpaQTF5M2dmZG9UR08wY3Y1SzUvUGt4M2ZSUCtvWTJ6Q3lVMWNzQVVtTUM3Q1Fvb2lESHdHSGVBOTY0QVNITUFVKzRHVGF5MEJ1cUZCYVU1SDlXakZOZWFXRGdhb2E5Ny9PUU9zcEVWMHlVOTlBV01YOFd0a25qenZrTk4zWjNIT0pzME0rNlFMaU9xSFpJQnc0ZEsxQi9kN1JscWtsMUJrSHIycWtLVHUrS3BLOXVNRmpYTDBCMU0wNkx1Ri8xZ3ZOUGRoSnRHVGxpQWIzZ2ZkaDc3WC9YWkRFRWpOUUtIRVRSVXhnUmZCK3g0WkVhZ1pCQldPaWpEd08xUXVnajlnUVJNekFVMkprN3ZRQVhyck1xb2dvc1dscFZwOXRlYjlIMjBEaDhPSUwwdHY0UHpTRzdpTVBQc3l6VERQbFA2c1czOGtBelR3N1BVVnB0M25STThxNnlBTzhpQ1FtcTYvbU5OTGhDNWgyVnhPS0hZUFdiSWY1U05rdkFodVRGOHB3R0lJVmNCY0NwRE54aW9zREJEQ3d1QUdsQ3l3ODlIZDI3SHVkNGJjWUFMTHlRaGJZSW1TT2p5akhielAyQ2dMMEdOWXNVZjRMSFViYUpXTFpDWms0QU5DVmlIVmQyaFVNSk1CcklCeGx4aXdZOWFYcUswRDdacjNmMWdVL09rcGdrZG5QNHNIeVB5RlFwVkd0eDNoWHAxWndSaXJ6enRFTW40OVROSEJwT05HSElUM0VHWElyL2N3cmw3anNHeS9CRjVjQWlFaE5DMGthSFIyMzRkRlN4anFWUW5OR0RMcHRnc1lHeGVZUTRKc29oRE5HZDFlOTN0R2lMTlIybUthbUVuNUVoZEFjclRLSjhySkVWTHJrWCtBaDk2cGpLcWNqQlpLYVhwZGIzZm01clZPQitXVkpCd0R4SmpzTXYvSTFacjNmMVlWL2lWTHN2MHNJc2psRlVkZmptVXAvZStNdis1dUtkTFduT2dNL2F3RC9DemUrakZpQlFHUXprckFXWmdkaHdJSWlYY0E1VXp5Y2tMYSttaXlWeGZJcVBITzZGaGlEalB5MlBGMDdHWmxGZys3SGFKTlBLcFJ1aStRUWRJcWhBS3dKU2d1T1l0cWFsbjVVT3NGSU5XN2hnNWtob0JqZU1yNnRwV2dxN213QTFTMVpMNElpcW1xRVR4ZXJYbS85RGlSQ3daZ21vdktOVGlXQnBUSjhXY3hnY2RUakg3VXg1aUFMbGJkeVVaNjh1elFYMXhLMFFFWm1paFRZZzl4dnd6bFRsaDJwRjNvOEpBRElma09jalBHaFdmRUpBT1dDV1I4TGk0QVdPL1pzUWMxbmc1TmlCcW90L2NNaWJlNDVxT0JqdDZyNHBZQXhDaWNMSVAzdmJ3c3dHaUUxV2dqUEJnTUlPdC94a1BKamJFTGlQUy80V291TFlGdlVVM3FCMkZ4clhvazEydmV6MXJWN2NBQUxOV0V2VTJhenNBZjBnRGp1SXdLbmtSVThGZU8vb2dWOHpITWpsckJTS3ZNMCt1bDZlR2NXQURjdElQOGdTWjhkcnhBd3JLSkdLSFlWYWdCeVJrRTlaT2RwQWFFU1NSSm9FejBnRS9VRExFbjh1VGxqZDFLT0paOERsQU1rUTFhZmV4NHJiZ2xTbUxPck5Kc0FCZ0pLUTZzRFdBelFBY3pWSVR1Wk5iNVhUS0ZSWlZpYUZ5VkJIZjRtOXlFNWJxZ09EQ3p3YTJhOTZlcXZpVVZUdS9SNTRmeEhJZFJvUStJak51NEFEbk0wU2VpcWtLdGZSR2RxVEtQME44RW1RbzVBYm1yWUQ3YUNFS3g5a1poU3JIclNLL0VUTEV0Q1c1TWtxYnNmU1NXTEJGTkozbEtZQTZCR0dUWlN3VzRFZU5tM1VRWWd0VHZEaHFXRytzaHZZYkZMYk5HTVhnUzROR0VNQXYzNnVxU1dCdWhzOUpmR01DaVFnY1JFeTJ6aHRqK1ZrV0Zka253MCttb0wvZVBOSlVDdGd6bVpMbGE4MzdmcW5CNy9NNXlqVkU2S1lvanpUQW50QW5HNmlveTZDaUh5OUUzWkRBbkZGQ2dPa0FFMkdMQ09jaVV1RExJMEVTWnNrVHRpWUJPWUtiS1NzQ0I5WlFqTDRTM1RjZUduREowWXBSL0R0bkxPUXFLQnA0ZkwyLzNjcUllSWFQeE5zcHNpbUpEWFU2dE4rOFlZNityT2RZcEQxVGl0NVY5TzJhVmNodG9PVUROeWN1akJ3YUhXQnZRLzk4N3F3L1ZBZEtDdFUwTnVwb3JHaUV6clpMZytuUnR4Z0VVeEc4NVdhN1Z2RC9WTmE0eFFkaEQxaFdDRUpOSnVDd3BwY0swWGM3NWhDRWtVSDVXb0xBcG5EaHZ4c1R3NnZWVEcveEVsdUk2LzlzaGNUaWJRRlRYbURZT2hBT3kyNTlWNHlGTEljdS9nTGdLS1F6VVpSWmVQRldEZ2F1QmVzZGtjYjdJTEFQSy9UYTk4RllzMUl6RzRtWWdWd3J5U0dNQ0t3YnNIcXZFMmlnRC9QdXZ4Z01BRUlJUythQnFwaldJclFRT3RVdUNvK0Y4b2IvRGMzT3lIRSt0bXZmc2pTcjNuQ0NjYmV6SnlZS3plUXdaVFZ3TUpzQVBoL09STE95c09HKzgxN0VFclJKcmoxYlAraGw1ckYwc0U2V2JzejQ4ZENhUmRWSGp1VzV2VlBtOXFqZi9rdjZpUkgzZ3JxSGVVM1h4RWFYSW5BeXhYSUl6b3Z5eFRVaGRITEhBNHEyOEhMMDJGRGRqeHJCVTVTS1JVVVQxcjJCZ1paSkFaWUQvM3NtM1JGS0xEVmNXNUM5b3B4ZzYxU1hCVHpFMUFiVWxRRHd5SnNUbU1KdHZTS21ZNEZqVzNaYkhKZVlRTnpadHpBYUNpSGhjSEhrdktpRURKZGhFc1pIZklhTkdLVndCN1F0dzdjdDFuenBHRnNzazV1bTV0SnFvc0dQTlNmUm53NHBXQWgzanI1ZVV3akRmUncxVVdtMURwa0pwVXJzT0ZHYWxOemZhV0NhcEFlOVV4UVptQzJJWkVodExCUDBVZllhMmN3ZnNlVzVCYy85Uk04QXBrMXFNSVNveHM3aGppTG1LQTJWSmNJTHhNYWhGaW9nczBmeHRPZ0VicDRYdnZUSlZDYmEvSkd3TGMvajluVlBFOHJCZ29UTXhpQTRxNjlxZzk4bUhVR3BTL1UvUUtxNXd1TzZGNXE5ZlRIUXZ1NGw1cXRObm1NTHJtTEpzYnJFT0lTdVRrSC9KbFE1MlpNQWViRHlaN293bDR1Q3pmNElGdDRjdHM5QTdjazBSUzN3RzlrM0loNmVQdUpTREFkS2xsK1ljbHdvOXV1MFl1aDdiL1M5akFKbTc0eHJHeitVYlRiaUNmOWFsMThzYTRLZGo0cXl6UkxQaHFOREJCc3VZSVFtaHgwKzhiMGF1b0lJZmU3aTlJZUNaMTlDTDFtd3o3MFZ1TkZTRGdXQ003RHlFREJLMFNxdzlFTTczMWQ3ZkNsTGp6cTFpbVZOemlwYWVFeXgyWGc2ekY2MzBXVUhJaWszZC90SXJEZXhZcERtV05oaWw1MVorK3NFdURDY3d2TXZmYXMrQ2Q5WWRHZzFUMitQcHUxekt2N0xvdzZlNzlPU0FPY0xDMld3ZUgwZCt6STVrQU52WlloVnpHUCtzVEtyamlHRGFwTkRhTmNBTG5IV1VhQ1pQcnJJRjdHcHJTVXBHNklOd3BhdkNqZHEwNGhHa1NUQ3JaV1lpaGdBZE5oRmhha0E1TnhYTHoyV2hXMEpHdFFWS0VqeFZXUC9BU25YTnNUV2hoWXdDVHQrcE1zQTNoaFV1OTZJcFdkcWw0eGptd2JCazJGS1pmNDF1M25lRzRsUnA4QThMNWhZWGVsdmx1YzNKUzNZNjhBNityNVRrRUVvZTFoTmhYVnc1bmtQc3Y5S1ZEVjVGZXBqL0tBT1liUXVybU1QNE4yVmFMZjdKSERMZmFPMGE0SW16enJxQk5QQ3NvM0VVMzVtcVpLZEVJRkp5T1MzcndKMGR1c28xek9Ic1NDYUhja0Y5ZEdDODVTTExXU1lYQ1FWWnlVckZ4ekpLUFFEZnh2S2F0UE92dy81djFnL2pWZ1kxaENlbkRnSmxMamg4UEh5OG41bkluZ3dRMFhHQ3ROUXpHTm9UY1VlMGc3dWNwdFQrTEJoQTJBOFNBRVcrV2RVNkdHRGRhN3pJZ0R2RGxkZUx5bytIZVlUMno0N3NEaWpMOE1vSzhGL3hCbDdDK012RWVnNUFZeUpSRzROV0RmREVXU1BUUHhtQVFGODJIOFdJUWRXNk9qdzVRTnpBSExxYk9mT1dlMFlUUERlVDFETDJSVk11dzNNdXI2QStHTUM0S0JSWjZrR3g5Z05NdXJGNytyS1NKTjZBOTBJQVJJQW5MeGtBWTAwMzhxSk1aRzhMYndZWlRURGFrTWZwYW5jR1lPakZDNmRuR2VLbGxRb3N1anhRVExMZk1VeVNoQVNEQWZCMGVyUTJLTjZhUlI5Njg5S21EOEhnd1ZzT2hDTWxqUUgrNTQ2K1pqZzlITTlVcHRZa0lwZ2tZRkh3dWdZNDEwVGlyTWtBbUw0SVFHVmptSGFad0lRT29Nd1VYSWEyYkJ5OWxTbHRzc0JzVkVyVUg2d21NMUZoWVVIUVVFRUNtWUNRSkpDZ1Jsa05zZ3hja1FZWDJONEdmSEhKQU5RQUxYd0k2WlNaeWQ2b0VmbTBRVUVyZkRGa2o1NUFobVpGb1FjR2ZySVFodGxJTzhZQUhVY3htYkdSK3dWakFDRUltQU8rQWlwTEpIUXo2QzA4R0lvbG1aUHVpTnlNbExCQ2Z6QUFJdm9HRFp6cERLVWxrV3d5RTVlWURQQVBHU0REZ2kxY2d6aHI3RU9ydWhObFdZY3BvZndxMVRVVHJjV3JlT0JVNDhGdHZBWEw5cTROeitYMVJTUHZSY1JGNzliS0FCYjQ2d3d3UyttM1lpQnNwOER3QUNXNW16UEV1MFRVbFNGNmJRWUlEUkI1enVIVFRBMjNxcW9EWXZYaFloMUZkWjFnQUlKd1NSdU9ybVcvTkFid09lNlpGRzA3UkFaUTVnQ2thR0tWc00xMHo3cE04ckJNKzFxdEFmeGZIdU1LOFAvdTRQYVJTUVpKeWpDVzBpZWJEcUMyQk1paURFVTFxUTR0VVltOVE0bGt6NGlNdFlNYklkTzRLMHo0cWlnT1JqMXlvcXBocFFRaTUzSTRIRHRhL3czZzhoRld6WTR0QWZicEpJYktaWXFtS3Q0NVB5SEN0Q2twb2IxZE1rQ2hBWDQwZEdxalZaV1IrMFlsK1hTbDF5aFZnSmdUckd4aTYwVmtZOWRkS3huQVFwak00WWpkaTFxQ3lBQmtEbTA2MUpSMld4WWt3VHJBMkU2b2dUd2lmZWRZaW5JRitIOTM5T0ZxZ0pOSHpGOW5nTnNTSUpiMVhTY1R1akxMQXVhQXRLRmxSQzdXamkxSzl4V1ZDT1pLUFZESFZ4SFRJejNOY3lKNkd4MVBZcU5BSVlCQll0V2tUeitwRjRrVVhoOExkN1BQK1dTQXk0cEROUU53YThHeUdCYm9oa2IvRjVWVVFLbzB4R3FOcGNreEd3L0pBT3doSG9NTWdPQTJNb0RPY2FacDVhMlh3UUJnampPK3FOUVJ5V2R5MU5PNEk5MVZ4dnNWNEYrekFoa0Q0SHNTeGovVXFmYUhFaURXSDIwZVZwRzF6YmkxQmllWEZ3NVgvdW5wQTU1a0lURllTbk10U2dZZ3REUWtnQ3dSalhBQVYwMG1PZHJBQmtEcURlSHR3TGNWN21ZQWdDbnpnZ0VTOVpZNGpXQ0ExQUIxUUhlc1c1VGhJaWFoaXBtSU9EdGlBT1VPR1ExanNEc1RPc0VBczJBQW9KaVE1R1hPV04rQ0FRYVc2cUpoMFdJdWxheVhNNnJJL0VYMUVjOHNWNEJqckFCMzlPRWovTVVEbHY2VUFiZ0RXVGRsVmhwdWloZTlJdXB0ZXAwQjBnZXMrbzNyQUpCNnczSk5xQ0lLVXdkWW5mVXhMaGd6aDFxM1kyZ2RFSDh5d1lxWmp4TFZOMGNreTA2aTRsQy8vTEprZ05BQW9Ud1dHRnd2d3JRRXFBaVVzQm1oc3pGaDUvbjZjNFQ4Rzk3cmdnSDZhL3QvMVo4amp6c1pvR2tRRzZ2YWJVUlZGZlllQ3pMUHZYN3VEeFk5Y0VnYUFiZ0NNRVhNdk9jRnVuK2hBOEQ5WGpNQXNWa0xvcGNqdEpMeTA3Zlc2TDNCQVBReUlVNDJUQlhNdkxYMmhDYVhESUFmR25HdFk0SlZjK0JKam96OWVvcmo0aTd0RlM2dGNEYy9VOW5MMEhMYVREdXE0VjFuQUdxQXFKT0xtbm9mQjJ0a2dBUlV6SGVReElpMEhBUkw1K3NibTF2bXpvSUJIcG14U1pVWmtTRDZZWDRNbVI3VmZObFRRU2ZjbnRWS1dQa3hLdWxSamFZcGdBY1ZGL1ZSR3dGMEQwQUdrR0xlckF5QThmZ0pBOUFRZUFtc1JPU1FDdU5EUGFrTVd2REIyakEzR0FBK1lPUWFheUlObmxWZjJHWFI2UEh5a2dFc0RWVmZ3M1liZ0VjanlSRzU4dU16N1RRYUNEUERvK1JaQ082VlM3SzhDZVAzc1JHcEdNQ3pSSm5MbFVtQ09sQ3QxbXhrQU5OOFFYSE0wN054NW1XaG9RR1dDWkNrR04yTitSaWd6S2lpb3N0OU1BQ2VqWjFMTXppcmlBQUQwS2VFb1k1V0xQWEhGQStzYlAxYXFZQmtBQzNtM1V1d3oyMEdPQzNSS2dZSVN2ZDJ4S216N2pvTTNRWXVDdERGZFFaUXQyM1VENmVkMThMOWU1NFJBNDZKbWdHWXpROUxwUXc0eHVWelVUSUFRcmREUkd0OGhYcUlhUTFHdERldGprVWRJdXlIRGhVRDhDVlRBMXlzSVdzSlgwZ1hlNkVFSU1vYTFiaTRwNmhxelptcUJwSVVvd3VIQkUwQXFxakl4NlVOQkJaYk13RWdJeFlZQUN0MkxQUGt4bFQyUzFPQUlOeWlPQ3pOd01rQUtPYWRxTFBiRE9BSnVkc000Qm15OUVtbHllVzhFN3NBeXZCUmp0OWdBQjg1Z0toU2gwQ1dEcXhMVDRpeXF4bUFHWFJScUFRbUFCa1hwNWI3Y1d3Sm9DYTFuRmtNZTlJZmVSNVZ4ODQ2UkJxODd5U3JHU0Ewd00reWxpMmE1eGhkUnZsQzhCQktNbU95dDBLaWJhdUFmV2ZKQUhnTG1nQmt0bU01cCtYdVpFWnNDRHJwbncrVUFieGMxck5qTU5ESzdYNWhEdTVidm9mS0NKQkx3STRXcTU4emdQaU5HSzc0NnhRaDhQcXBxMjRTRlNJbnJ6Y1pZUHlZOE1xdCtub2piNEcrV3RUN3FJUEtIUmpSTWNPNWduLzdCUGpTa3d2RUxyMjFGZ205bkZLMVFJbEJmUmI4aDR6ck45d1I3RXF4WUhsTnFiUUJIdGlJNzA4bjluNldObm5sSVZobmFabXBVVEZnRWhDcXRRUjRCU2RBZ2JBeGg0ekNDRzJOT1lUWUZGUzR6dGpTekwzU1NFZk9kVFVIOC9qbnBSRWdHWUFFK1JVRGlCUmlBTXZsRXJDZ2FhTkE5SG9PblNMdS95WURKQVFhSllBTXNVaVpsQlYvYWdid3dpOW1BdERCd1pvSkNhS3hIRzZVVVUrWHgvWElmS0ZxQVdpSnh5blFud2wvWkJqVG9zQVJmcVFHdUdiRDYwK3NXU0JrS0FGbW5GYkZzaDhxUU1rQWVETm81VG02YnJtSGd3SUpsaXlGWVZHREVpYUExWnJ5aHd4UU9ueWtxVWt3VjN0NDdzeFR6RmlSTUFMOE9RTkVVT0NrbmRiQzY4ZVh5QkQ2MGkzWnhlOHhRTk9RU1d1T3lKcGZOUU13cUplcnBnNk9Nb0NsbnlNRExNQUFtZStZdGN4WWhyV0lVNEJIRXFXTVRPeGtRZm5kemp6WmhRYTRRa1BHalE0YStCeExtZnM2c09SaFY4LzE1TDNTWVFFTjFqRzVaSUM1MTJBOU5PbG5vcEZKSEc3SUxTdE54UlJFZWl5ZXlGMm14c1NxSWdEV0FMRE9wUkhnVHhrQU94RXJmbmV0UXJjdUk2dk1haERscUNiaEVQVmVTL1RTV2dLSyt2N1VwM21aV3RNWDF3b2themhoWUgvbHE0Ry9iREpEU1llcE10ZzhNcEpsZUhjWnB4RGlkNmNCT2ExeWx2UEdUS3Z2b1FHQ2M4eksxR1B6QkxSTE9ocys1U3lXeDNhSDA2eGtBQmdUMUR4WE1nRERIVlF5SVpONGVwcGhaQUw4U1JVdDVxRG9tN3JzK2JYdEtmR0xETUJvTVdBeGFpUEE3MGdBNUVISVYzUmJCTzJvemdCbHpydEJKTHRBTHdSdHB4TU1tbFdpTGRWQk1BQTl3Z1BpWWQwVjNJQlF1K0NmRmdQUUltR2FNVktSeUtnbE50R3lLbnBMLzQ1MnQrSVVaaXo3T2dkS2xBVWN1TGlSbzhscUxtcEJvcjQzK2tWRDVUS3FVL1FPTGcyWkhER29DYVVTaUxDa0VSTHpOTmJJQURCQ0FrcUdPajZJTnhxTUZNdm9HZmFaaXJINmhZalN3R0owSjI0Ry9wMGxBTGtNUkhyU0ZsZjJhN0sxYnJyU3VJVUNadG9IS0ZJa3NuQzdwN2ZreXE0b1hWRzVQLzNUZmJlS1pIZjArMFNlYmFEVDlGRzNHRURvdG1Qa2o2WUp5dFJWZlhsQzBHaGRaT0w3UEVTck1XdUlFdW14SXA2cjlCRytvVnhHZndObVFEWm5BSXB4eWx2UHo1cStyQzJ6Wk9waVF1ZUgvQzYzZWsrcVQxd21WQ1UyQ29DeFYwWWNodEV6dzA1aEZKakVMeFRHU0N3RzlCUWdnc3dPOVA5dU1BQzltaXlhbjRrc0k5OEZjcitCZzl0NWJ3OWVEYlpNa1dpNCtGRlpmZFNzTjdFRXVHa3BTTXVwWk1rUm8vTHN0UFFGTUZXOFllUTdwaWhDQ1V4UDdxSnNCUVAwaTFZeGdKVWJXTkVGRjRXV3NNMEh6ZWxVZXVFdU14dmQwQkJsSVcvZHpzNWpYR1pBVTVIbS9GLzNpUUo0WmpIYWI2ajd4ZjlzVjh4dzVqZUZGTnlyd2hxYno2eXlZMjdEOHRjK3dYR0J4VGdwdm9HTHdBMEdpRVJEVFUrVENzWDhtMGIraW5WcDgzT2JMWE9MZTZZS2dxL1JHOGd6TUl1ZktvU29HVUNoMnlZQmFIYnZWT2kweC9RR0VscktHRk1aSmdTa2RubzJtenc4cjI2WnNxTnF0a0NucDlueDE4c290WmJhQTUyd3ZzZFo1WCtNUktybExiRnl1Snd1YXRPaXQwRGR4UDhTOE84UVFDRXg3ZFdKSWRnYmxBeXdsVEh3QjFuRE1xRW5qSy8zWDRZclN5ekdWQnJCSmx3RWJqQUFCZ1BSVkdXZGk2bm5ySVY2a3NXY3E5ejNuRDRKdmtadkFMYkJMSDdxd0RKRVV3bWtaNGVLQ3F0ejFPaTBvRkk0T3dpY0ZsK3pOS2pzWjFmWkp6V0ZxS2dyVzQ2OFpaekNLYXNsRW4vTkdzT1FwOXcvR0VBYlRpWHdYZGtZaTFqTDI4REtLYUdFZ25oWm8rbEQ5YjlXWUFoRVJvVzBkOEs3SFVXMExOb01DQ1NIWUtBNURLMUMyR3dBWlNJRDhJS3lhdXpQR0lBbEdBS016L2xIODd6MFY5VW9yR0lTcGtkV2cwM3dOWm9EdGkxK2xLZHFNOHdvNGFoUTFkUDFubVZqV1cwcnFVUjE1anVnSW1JcXhqSE9KcEtyYWtvU1pOWFlWczBDdzdOYUl2SFhKTmhEUUIyODNCa0NzZlRsNmdhWklhMlV0NG1WQXdsUmhwYkF0MGYrTHlGS0xKcUhzM0NUOTF0Tlp6QW9XamVoZDRteEErck9RU1BFUnljOEkwMEJZQUFHOTJXQXhwUVIxUUhHSnpyVThsZFltZWhlZVA1UjdjNHgwMWtOTmhKWVZNSCt4SG9VQlg2eHdMR09vcDZJVzdJWUdiU2VSS2VWVkNKMmxQQXZTRGZreGVCc1NuSmwwM21ObTdZYVp4aVJVTUNMYlpab21Ea09kdktDaDNwNFBBYThqUDg1VUJSdEUvSjJuTUExYjRLV2E1RTJRWW8wc3dOMEQzZzMvZ05lcld3dnhCaGVma1NKc29YNEovMDU1TFdvQ24vd2c5V1NnaG4zN09xSWxlR3F3UGlzL1BzWWRkYXltSE5kSGRQTFRINERmTTFlQWpha3RRdG5LOEtOM1c4RkRBK2szZFRGWk11YWxnYnpBVGgwQ1NBdHNYMCtRa3VRNjZWRm83R0JoTFBWNUhGbzZEaXBOQ1cwRklXTW81YXBseUpscTVDaXdLaVJFU3BrSEJuSlA2SEFrUlBkWGVEdUNJcVdJU1JYczVHL1NlcVdHS1AyRWZEUUg4U3gwTWpaS2MwZXVRYThSSUIvcVk0RXFrcWJBMGN6R3hCc241NVE0UWc2QklMSXkwenFlSTNyM2luK1EyY0NyNmNiSWpyWk94Mmo1cXRkbm1WajdhUW96NXVpME1nRTRSS0VlM1R5c1JYMDBWcjY5c1R4SllIQU96SHBFdEVQSkR5cUUwc2pCNU5YWjdOQWlwS3BDUzBOREZ3MkRGZ0NSTXZrSUxiZ0Zlb0FFaU5RcGN4R0FtRWx2RkJreWt3Ym5PU0UrcHVHVnBvOTlzRUFJVGZ2QzNWRUNkb0M0MjlPUG45OVZoT3lDUUMrWWZCakxxQytCdWpNaVFLaVowdW1rSXZpaXJ4QW1JMlhVN0xtU1FyaWZDbEZJZjltOGUyaWREcElzVUVCeTVKQW9ISmtUNmdiWkdjMTZaaDdCeUR0cis4b3JWd2sycXFSb3B3WGREQmVhQ0hjTkhkemp6YzBMQlBkL2FIQ0FPQ01VdjZRME40Z29wUFUyVEpUZkQvVHdKb0F5SlJYaGRrakdTQnFKSE1zWFFLMXdmZ3pGdkNkZVQxbzY4WGNwNVNrR0tmQWozRlhsWVEvMm1vVEQvQUsvb25sdmtKbWx5Y0ZYbFNKVmZ5TjZBZXdPM3J3RHhRWFUrV2pTU2NBalVRRDFtMUNBMFpPdXNpK0JZVWFrR01jVDhqb3BrYUtSbVkyN2lHckZsbFBuWnlaVGFvd3M3OUcrWEVheE9kRksweXkvV3hscHZpS0FZNnpTSHIzcWUyU0FkcHlNNnRldXpLaktwSFNscklZWWpnQm85WGZxc2k1YTh5aDFVQzRrZ2lYaUdvYzRCVitBZWhXSXJQeE4wL1NDZ3lSY3VZeC9zNGdXRzRGb2h1RVNQb1k1RlpuN2hVQzBkaVVrMjYxeWtSUVFHRjY2bUUzTFdjY0Y1dm5aaHliU1hCZHRnTE93amFQR3FPRm1mMDFTbk9IUnlSYVphdi9PSGk3eVFBWkR2RDUvMG03d2dDNWJVbWRCR1hYMGU4SzV1YWRHeHFmenI2a1ZYOUhJVE1rTWFBN1dGV1NkeExoRWxHdEIraE04d3V3NWF5UTJmRTMwVG93bm1rc2x6eXZTRUIxUEZtQXZQWWdIMWdCK2duNkRGZ3ZZaG5aRTdLWlpidWNkT3ZlZ0tuZ2lNS00xTU5oUWlTTnZEV29XaWxjeS81RHR0S2ZSWG9tRHJHZ1hwWWZUNWRZdEhVd1FPblF1TVVBTWlVWUx3YjZYMk1BRjVxcGsyQUpwa0VqRkV6Tkk2SXRwak9YdE1mOFc4NkMvWWpXSExHalk5d1JvNTVFcUJIVlBBQm5HaUJxSHI5ZkliT3pQaE96VlNwcDFGOER1eTVUMEVFMFpRakhJQXEwb1N2cDR4bE9hZnhQK2tUbTc1eDBDQS9pK1pDTEhqcmtsZFNTQVFnVVBVVGVWL1puKyt4WEhtMHdHSkJ3TFRET1NKcXJCdWtVajlaT3FKdTYvU1VEUkphUTV1TW1BMUJvVWlYcHVzWlAvVE1VVEVYL2F2UHFudUZmemI4ZGRXR09rQ2Y0empSYUw3M0FWYVBYTnYwbGlOTjFyM1dGek9iZm9FK21MRmU2bE1BTmJMc0lveDZZVnlBWllFRUNmUndjL1VJR3lQWVpESkNUamw2TU5EdE43K25NYURNQWdhSmFISWlWZ0prMWp3MmU4Y3FmcGRRY1JNYU9vSjdoRExpT0pBTUVpWlFiazlTbElmSXFBL0F6UWYrckRFQkhmT29rUSt6NUdkbmdDaVlzK0w3RHdPTG1FNTJUay9ERzlKZy9lL3o4S3VoTUVwQVV5UUQwSzV2cmgvYmxDcFZsZjFjQmFFb3Q0YktTQVV5cmg3eHJkbkpUeXpZYWtlZ042V092eEZVM0NjUVFzYUxXbzlJSGZrekhaaHdMWUZCenVHQUF4QjBJSGlCSUNrOEEyODVSdSsvcDBJemN5anBGcW1wZkxELys4bGd3UU1yb2FyMG8wcS84bEFGdVNnQjdSS0dUZEhLSkJLUU9lR0lEVC9jYjNOczh0NHlwUmhidlJlTVJRMTVhRlVWT3dkNGpPRktjVHl4TUU2M0ZBSWpUWkp6V3kvU1hETUFjN2dVRFVLdFhTRHBxaW1tMXptMUdvb05BcTZpYlNtMmY5TEc2djVaQ29KeDBrUkwreWIwNUZoVFFMK1JPbnE5UFgwWHNBckxtV1ZNcHg2RW80MW9SUUVVSGFLWFhRVFZvdlV5eGsxd21xYS8zcGc3QUhBcy9XUUlxUGZPUWVaWXhRYUk2YnM1c3ZDdG50LzdVdit6QXE0MnBuNGdEWHJzNG5XZWdkZ2V0eGdtQS9sNVVmUHdyQnZnd0xpc1p3TFg2UWQ5aWJUVklObm5NeHJDYjJRWEdvZVJzaCtUVlRudlN5UkhQODJIT2ZuNzZZWDZWQVo2ZkhJWUZEbk5Qd0t1RDBEQVVsUVJZcFFSSXZRN3A1aWt2NHVheGs2eWdXOWQ3eVFDV3pvQVJnYjlnQUNvbFRWYTRqMHJaNEZ3UGhtTjEwb3lOd1FnZDVuWUFlMThudkRNQzVFazR6MGh0WDdhU0FRZ0IyYkVrZWNrQUR3K1hETEN3RjV0VURFQ3R2dCtIdDlyM1hYd0VDTFF0c0llK3pkR1BzWS9ETUpZRVZheEtsQmJVWlpIZ2hYNHZHYUNXMGlVRG1KTUMxK0E0YTIybkRvQWFTd1JNbERUZERTNGlxS3FkWkpENmVpOFpRRzJKMkFaNlBwT2ZNUUJmYU9BVjdpTnRCMFVBYnVIVkVSSWZJU1JBV28xSTNlK2xVQ0NFQWJ5d3pEenVQSXNGSDh0V1dieHY1eEFRR3NhU0FiYlNMaG5Bd3pxVEFVS3JOem1xS255dlpnRFFKMGNJaG81N3NtemZkUGVhb0o3LzNBbkt1aFV5UkZjWlFGb0JnZGdnOFN1RW44d1cxenpHOVM1QWl3RzI0SGd1cDRBb0ozVnlKMW1TK2lONnJ6R0F0RDJoNC9EdHd4TDBjWU1CS0pJNlJhR2FrcGdqRndCUWg2RUt1NHFIZVc3TWpiaTFCODhWUUl6UU13N000RDhwNFNTVzZqSVpRQmNTQnNIVGprcmFqdEF1R2NCZXFNMEFqVFFvOEpvQ3Bta3hnSHhnQVQ3Vi9JVE95NzRBaVBaYk1VQUFPZlNDUXI1bFVhQkNZcUFsdUZGVGFkcUhKQzQzMFVFZmFKOVIvNk9nWGltbm5EcHNOYWtYVjN2NXkreTJTSFlJM3o0UVZCK1hFc0NTRWpEWGdSSGNaQklIQjJTR1BJL0MyL2dxWHdROGh2YU5RVytpK1haUmlSMnhkUEQzYzZ4YnRUcVJmVFc2ZW8zUjM2SUc5c2tBQTdZTEJxQUVTZ2FnalJVNm9NeFFSYXZEcmhvTUFMVSt3YWVubzM4SWVZa0FqSm9Ca2hiVWNMQ2ErMU5mQzUwQlU3cnBNeDJSQnpVa2N0c0dMeVFBdDVrT215Mm85MnlKSXdiSkFJVGVoNk1uVG03M0pnTkU0bkNXcGtCa3p2cUtMMEFYWnpMQVVDdGhwUVNEeENNV0hpVDFlWTdQY3JVd2Rub0tublFraGI2L3ZvbGI0elFUNDZrRktkWGd0T3dTZVNheWtBaXJZekpBUDFxYkFTaUJrZ0hvcVJZZGNHMDZJRDByemdCb0ttZWNQdktVaXdWZzMyYUFIRkl2UDFld0hkNlhrL1REMnFGUHdCblRkRkV0SmxPVTJBQzBLM2pNa0ZNc0drcVNzR0dxNWNuWGVtRk56c1RoeThpWHVMckdBRkNkd1FDd2hYZFM0dEdQWktIVkRPdjFGSlRUUUc1aUdtSmxpQ0J0U0dCWm54cHA4YndMVVBseVgzVHBDc1Vic1FnSU5mOEM4dHBpQU5zMXBqRG1yazZHeStEem1peWhLQkhyQk9vNytIUjJuQVVmODlIS2xEZVhnSHVPaGo3VDJJNWh1YlcxZHQ0VCtqT25YZ29BR29GcWhMdTB6RWNVMUt2bFZMNU1tWXVtSVBXdDN1ejJHaFNUNFZVR01JOEZvYVhuYnBtaEk5RFFoL2tjOHR6bXlMZTd4RHBxWXVZQ29HUUxlbXI3TUZoRDVsZTZaSURzK2hTNXFmTVo1dDMzYWdtSWRtZ3pBQ25uSCtWMkhiRUF3ZTdXbzJUa0kweEVZeTNXaHhEdHo1V01Dd0I4bW0wbE1IZnFwaEpSOWNhcjFaUFUyc3BUcEhpdXdpQnlwcjZMOUVMNGxNcVE3M0tLSXVPWGhxRFhUTFNldlpXNE9LbTJDd1RWTFFiUUtNOVAyc0lyTlpKWkhhVkhxUU02SXo5MVlSSzFlZnRLTEhvYWZKeDJMQlYwL0FVREhFeVpDS1d4VUFMWkxoa0FqODhOV1ZoMnNXd0FQa25KblRvQVlDdXMwQWJxME5TQjV6SmtwMklBS24zRmp1eVRRZ21PZ3BvQndvRWNsVWMyWVRmdzVJMi9ZZ0J0S0RUUE5CdXRtNmNYTkFubGkvMnlwUmxrWkFndzhTOC9ZNEMrSVo1YkRLQXlrdWdNS3h2RS9HSmxycVFQVndIR250UFlDdGFGL3RiNURRYUFLRmRWUEZTeGNodUlkb1VCaHRCUG1wb0JFSzdNZjlvTVFMdUxjZkt5dlFDZ3ZiYXNyelFFcFpldzd3M3FTWXNCSW9RRTlLOEV3R3BvWU4xZkxnSHplVkhCYXRwMkJ0SHpXVEVBMWYzOXNyMDNDRHFxYi84bUE4QmowYU5Tc21KU08xNllPZ3lFcEMxczlJblJGa1NxSWU3WjZla0RwTzNYU3dDN1dLYVgxcmpxZmFWZFpRQ2pYc2tBTytDTjFKWUdRTktneFFDeHEvVUVCSk5JRTFHWVZNdEpSMU53N2R4SkJuZkprRHJEQTBwZGdQNldVZGVOZllUcnQ1VEFLMGs1ZG1VRnE5eGllTHZpK01XR1A2cHZIYUtsU1ZCNThUTHZjV1FKbzkwQjBkZUo1SmNMS1FKWU1oOXBnVzBCS0l4RU1BTlFneTRaNE9QakR4bUF3cGhxd0cxVGNESUFBV25jMjFyT01OTUJzUlVrb3J4Z2dHZTNCTk1teXh2MFZ0RXFndEl5NXZhdjBybERFd1UweDVJQkVLeUltRWI3WUtvTk5BSkpxdVdMYmFEN21wS21aUjc3aTRDUU12UWpLU3dtUDJlQUtnQWxHSUI1TXd1UkhBd2dscHUwQXpCekZwTlVJeXFrbGh6QW1xVkpWSVo1dlVoRDRDeURMd0k1KytzbGdGMllqYUVHL0E0RDJBVDJNQ2RtRFlRWEVPNEE1cFFvR1FCR2VlNW5JeTFRZThTS1NkY1VxSmhsNGR5SkJJUzZYbFVNZ0xoK0ZPU3EwM1RhQmpxOWN4L2hmTkg0aHpveFYxU3lTTlI4dG1TQWtzS28yVVNVYURZamk5RU1RSzNFd1NRRFlCeWNBY29sYjRsVjdHTHBpS2dvbUU5NmhSdmxuVmlxTEtBZmdYTy9aZ0M2ZzIxQitRMTM4Q0pkVk00QTc2cVh3Z3RvWW1Cb1dXWDRDRi9UWGVkTHBhNHRNMjk0eDJaUkVnbjY5SUs2bXkvVER1TkdQSzhRQkJUQnUvWmRoSnl5ak11Y0xaT2psd1VUdlpiTlBsSHoyUnluMkNrcC9JTUM1L2t5Q0hXSkdIc0F0UmpmWXlzNThhR2xLWGdVM2s4Uyt5b0RjQUdnRXpEZGdtVUFwbCtTMVZaK2d3R2VTelhndHhpQXRnaWNGS21hNVRRaEQrMW8wMGhZQ1FLWldYNVIybGlxbGd3UXUzcjZ4N0Z0Wkl5Nnd3N1RGOERRSjZadlJ5azFTZ0JBM2dlUm52UGJBYUpzV1V1MHlHREovV2dSNHpncS9zUDBBS21Ud21oVzlDUmJGbTlCdkxRallxQ2lKajYwWUFCcGRmekRWUWJRbDRKbVNDY2c2Mjh6Yk1yaWQzT0daSTNhb0haQ3FWdGRSczRGOHowVDNac013T3ZLNG9XbXhZVzFpWk5vdmRLWnhFb0V0RDg2Z2Z6UDJOY1B2T1crcVpwMGlZbzVIczI1d3h5VWtSUms0MUl2cG8xOExDQjVSU0V2SDlBdkFrU2pPV1pxVmhkTVJPRWpPYnNWc09laHppUTFLWHhDMng4ZEpab055OGd4SXJjZjBXcDhhREpBSTgwTFlwTmZyekdBdTVkODdmZU5sSUU4RVNSY3poQ3F4TWtBZzRSU3Q3dUFPL1RENVUzd2R4N0k0b1U2OUM0V1l4S2RPOXJYc1djUVFPNEV5ai9mR0xGVE4vWm5qRnlpWXF3SW9UVENEb2sxeEk2b0tIOGp5SUZ2S0dYZlpTay9NNkZySTBDVUxXcUpubG9GRTQvQVJyR3dYRGFDSFVocVFvMElSSnJ0czRoYWtCdjNUc1pvNDBPVEFiamlSUXdrOVAxckRCRDIzajZjdDB4ZHg4aEdGS2l0WjRqWHFQMHFTRUVvZGJ0TDUyY2NMbStDdi9OQUZpLzB2ekhEWWhJTjhZOVpMUnhBVGdLOUZBQmZLblZzYVR1dEoxMFdlMlVWMHoxaGg4UWFuaEpCQ3JzckczZ2xpM2tDMkNoTm9Tc0FpSHJ6SW1sMXdjUVpvSFVuaHlkbW84MEhwQ2FCODQ5bFdibXhlUEltbDRaTGZPamQrR1lVTkVxSVpoMmtJWW1XcXI0c0FEbHQzZW16YjgrUS9kRjBvaUJGUXFsYlhib2hpY1BsVGZDM0h5aUxGK0p2RjRzeGlaNkl2RmE1amZ3WWdlcXRBTDRjTGJiMG5zU2tpMTE5d0xLdGppOWhoNG8xM0l5Sld3cWtrL1VvNFlpQzR6dzBLVHoyeW9oMWU1VC94c3ZzVmdWd24yaFJsQmNGWnRFNUlER3VML25IdEt6ZCtwYXlKNVhESy9qUXUvRnRITVFQMzhxV21FSTZPRHh4RzlMcmxkcCtlNFpZYmN0dktDSWtSVUtwOTFXWHZINGVMbTh5TGErTDRvWGwzMENZemppSnJFNHZjR3RmZU95N0UyaVpmd3FsS0MvcjZXVXRmbGRsUmpFekFaQWtOQ3IveUl2WWd3Y0JpYWhjRWUrUVJVU1hJUXNDN2Jvc3l5UVdhRkYwNXY4eTViSFh0STQvd2xTaFJDeTBqMnA3Mk1hSDNpMHZrVkQzUmVIbHNoWWlZZHVKdFpKWkJ1UnBBdVd3Y2lXT2VxeUNSTG9pODBHU1lvbDFhN2tzdXhKSnFpZm5UUXBndGdGRzBZaFQ0NVJoY2VVQ2NiMjBRdUNiQVAxdWVCS3hpbzV2eXhhMTJERmxTNFE0Y2FKWUN4SUFkMy8vRm53WjBCbERpTXFQeEU4V3JNOXlvbUJZYWdNSitpM0xKSTRMdENnNjhiOHU3bkpYcjJHNS9DT05sUmFVN2ZrM0tnTlJHeDk2Tjd1QmhXVFo1cUlhYWhSckQ2Q2ZiYk01R280VVI3SG1CRlZqRG1JY2M3SVloaDQvT08wZUhWWnRoNHVUSFdpTUtlYXpLcWVYM0RxclFIUHFzL1FvYmVBczBVNndGVjRQNjIwVW1rYjVXc29QcnBVc0tPcEttSTBQNlpZQU9ORVBuaExqNXRBWlBTU2JiWjVpanFGYzZTaUNkVjhSKzRGQVpXZVpSQml3QWkzcXVPM0V3WVZkVDhOeU8xR3hnRHRiRFhuU1NKWittZm4zSWkwV0dXQi9EUTJOclNNelZtUTk1S1hWT0E5c0lEVDhsSWVvaDUyMHR6SzBtSU02M2NnMGIxQnh2S1MvMDBaL2dJUFF5R0hXaFp2c0FVdjJXZlhtMUh2am5HUUNKWmxlcVZlYkdxWHprdXdkRmYzMzlJOTdxWG1qOVd5Y2dIZzN4TnBzbHpOWlpqVG9ObUVCQ3RUZERvemJFRE1SUFYwbVVlalNwQis2cm9waWd0UENJaEJwb3FveWlRVmFkTkxKLzVXalJhNHJodVV5RXhsMnNBd3NuSVFKc29hU0NrS21aZ0F2ejR4bWNoS0pGMEJtNkpaUlJCWTB6dUxQS3NMeHkvSGcrKzlhK2dOVEh6V1pXWndRSm1NaXJKK2ROa29OekJXaHo5SFhHSFNaMUFFbDVRNUVucEo2a1l6RTY4RU9ZMmVkM1ZxUWxEc0ZaSDdhZTBWUlVvclBQWGxDRzJCRXJhRG94c09wc3N5b0VBbm1CcGFnc1J5bUVia0I2UXYxZUdWcFZBWURjK3FsTFVMMTZTcmpsUnIvYU5hNGp6S0o2ZkhERWZIRzVQK0NmRkRFYWRZK3c4V0piUytZeHVMUCtMOWdpd1NUSTl5NGNnZmN5YTROZW9mUWlETXFxSzlkU0N5RzlZMDJwQ3JsMkQ1ME5meHE2My9JOHhKenNPdVRSYmpFRU5aRHA0MU9EOGFDZkJkYXBxYzhkMHJLWXFlOVhia01od0dmc3RDT29oNXNwOVU5V3BWRmEyWlJVUlNVT2pNOEJDbXBtQlFuQzRwQ1FWTEVJbDIwbUxrRkRGOEkyTUs0cmRlb3ZORmpJaVc2OWQzZXRkYXNTNHRXenJ1bThjcUJ6SzFwVTVRNStaaHoycUFXeEJjNUNNTGliZ2ROWUZya09SN0dyT1VNZUc2a2s2akMzMDlrQUdZZmZBS1JNS05ZQ0R3VDdpd0pEY1ZjQ1RnRjVqSjNheXpNMjlvQk1rK1F6OEhPZ0pQRkZyK3pKaFlsYlVZcm5TczZ1cnBUOW4wbUpnSmtQUE9RclZoSGFjUWM4WnFiemFQUm94NnNFTFhkblVWclFHb2o2dHhycEhRVFJNN2FsUWdiMHkvd2tHcVdHVVdxdXpJYXd3aVlEQ0RUeTZLaCtzZ1J2SWdBVVI1dEZpcUUyMWt2RitKM1NnWm9XTWNvOG82akF0bW5QaVpqUmNjWnJEWFFmeGpTckVLRlhKSlFoTWdkUk4rbjhRcXJoLzk3cDJNRXdlbWF5TmowcGllaEpIc3dqc0pDa0dZQnFOSW5ScklFTTJBdUsvTU43VnRSazNrMzUwckZ0TEROWExGM2xwcHgwRUF3NFI2c1JrQU5CanFKbHladE1LczR2VElsb1J6MmVyRHdyOVhkY3k5YVExUURLNG9pWmlSQ1JDTXRwZHczQzRwNnpZSXNNN3A5L1JrREtNVUJTcEVhdnZnRHRCYlo3QURWQm5rWEdaaE9CcEJYb0E0UVpSSTdoYmV5c1Fwa0h5UXFRU29iNXVFODlDdGNCc3VGeTFQdFgzaWhJYlRCM3d6aFIvU0dXd0l4c3FKWklDczI2TVkwUUxKR25pMWZCWFNUM2NDa21ZZmVPU21STEFGY2hSMUJZY0NOeENjK0IwRlNRODZ6OEU1anRPblA5UWZ1YUJueXNrNkRiWkM1NVBXRnZBdDEyalVIKzRNME5iKzdVbzhlOXV6dW9CdVlKMDVHUnp5QlZKNERzNnhkT1Voc2hQWWllWGhSWnZUK3B3elFETTRvVThsc3FrUVY1ZEd5TW1KVTF1eVVxWDg2eUZQQjJtMll6U2dUbzdIT3EzVmtIaThLbUI3S2dJeXM0SlkxWkUrTThFZUF0OGRjcVFBQUEyQ01HcEVoUWlRRDRETzhlaVVTMVpBVkpsY005TTIzWmpRVTNkV09EWVVpaHJla3E5eG03b0J6OEVEVW1lakU1c25YTkxLV252bmdWSnRhamt4bkFDYUVBMk1MdFZqWWhuOWtySTRlQnRreTBGckp4KzZtRjlHQVNXcFFhTmZXbEZHdE1XRS9XUVd1cS96M1N3WkF6dnhobHlWYXBhTjlWS1lZYjRobnh2V1ovR3RyTnBlaTdOcGFvK1htUURzb1VRbFVUWjg4aUlwSlhkWVFockJnc1JFVkZ5WCtqVHQ5TEFIS0FCaTZ6SXI5WXFrQVZXRXBYNVNKbmZtalpBQS9CRHRVRlN3VGM1QTFtWTFWd1JiV0xWTUxBTG5QUHVXMkozMHhCdkNVa0pHOUdvVnRFRUV1MUp0VHlBRng3VVZyVkN4Uzdocmpnclc2aWZCQ3I4RmNob0hhdmcvVkhvVzVGaVVENlAwRzhqeUxNZnNwQStBNnZlVFhSMnNHTUVFSGxkcTlDcGpOWG9FTVJhRUhPclZaQ0tLSXlrb0I0QUU4UmFXaU42YXhLaFFBdXo5REFzZ0Fjdk1NWGtlNWFNMWRvV1FwaWpUM3J6SkFsbk8vaHlDT2NEbHVRR0lPcmhjaFdUMVVDaFFUbGpIRko3SVI3N1NoRktBbmhhV2pWd1NOZ2NTc1FHQXJYbGQ3V1Ewd2daVlJ2TGpFMmpqNFFRV0VaOVpYdGtjdXRiazBad0RweGYxRVRWUGVzSDNKL3drRG1KVUt4bUY2NjVqbTMyb0xOUWgwNy9VZHRYWHlxQ3lVbmNpdzNGd0RsR0ZNV0lCVlFnRUlxNjV2QTlWMEFMMGpzbUpqM2RQa0tMRldRV2VERjcxZHNrRVBVVDBnSGFxQTJVZUhWcDJSQ3Q3VmtyS2lzUUEyQXlUOWlpUE1sTDlZNEg5d0g0K1c4SUJqWmhpNHJFTHhET3JXM1ExYm91MmNkZWptY0NDK0RJUXBKUkZrcEwxUUxoR3AzY3Rkd045bkFGUTBNOGNpelJ0TExsYWk4cUFvdEtMdGZGbVBGVUQzSGNVYUVGbjIrNDFYQ0NJODBWU1pqclhTRVBTbUFuK2xJOHVzMkl5NFdQZENXWWthQkpjWiszWDNETzlEaHROZUM1a2ZhQVc5ZVlRYlltSkJSZ2tSNEUrTVI0RUJqQWpBOHRoOVdPTmVnUE1HRWd1ckZoK1RZVVhsMnpub2hPMlNBY0xOOFJLeUNwalN4aVdBYlhKVUdjSlRyWXI1L3hFRDdHRmpWN09qNVptYkdlRlVuRnZDZzBNelozNTJtTklDMURZdnRNQ01RMXl3UU1QU2cwVXRSOHE2dDg3WUpUQUFuRDFNMHdQN0YrcEFxb1VrcUFKTzlCREVpN0pOTUJGRVFQM0FRVFAxMUZRQjBJdkx5bExObHZTUWRicklBSE5weXJEYVhBS2dpQktCM3g4TGJ6OW5BSFpIYXpNQTdiTlJpaDZGTEFBdVNzQ3htV09aTEFiejcvK0tBUmdzQkhNWnpDaGpGK2NMRktPT1daMlpDa0Q3WHJFUHpCcGhVVG1PREtDYUUxdFRNWUNxMERsOFFrYnU1UXVJQ0JlRmExVjdZT2lESDkxdEtTVnNMaWtqQWdCRmRHc0dHREFmV0t0U3diblVBVnpzV0czS09WRlowWGFYUzBCN1pXaUsyaHRiczVlN0RqQU1lMVBvQzZKbFpMWFkrMGlsM2RFcGFMMEpUNFZ1K2RjWTRMVEp0UmJCdnI0UkJHMDZBelV0Y1ZiUE1peDNFTHM3VFBlb0VSWXJnRE5BUDFyTkFLMHFvT093MDdjWjRPTWFBNWlOd1p4cXpJMWFBR2Z6MW9PR05rdGNWdDBRU21jd3dPVXVnSXNMeTFzNlNLekRobFU1OWJyaEpGTjZSRGZ1SStxcDVlK0xyZDFLT21Odmw0dVZna0djQWJKWEM3b0dBenh4SHlsc09qLzhQUVpnOFhsZjZHZStFZnlrT2RpVWNxOHc2YWhtcW5jVURiNEdxTGdqQnRxZEY5bk9KUU5jeE9yU1UvZDdESkFaeW4wOUdCYlErUVRacUFESXFmbE9tbHYxSFptUnZEdmp0R283UUlYV0dtR2JDWnJxam5PSEREU1ExTnhVd003Q2ljSUpwRHYranBvUmJlMEw2OEJnVjlnQjdsbWxjRzBKdzVneFR2M3JBeTRNUFFkeFpkMFV6ZkR4RnhtQW54bnVPcXIwdHZTQXNiMktOZ1BPcFltd0VPSnlxYVFwb0N5Y01TTzhhMVNuNktRU2VKVUJ6TUgzOEhzTU1LME13NmdUVkNiUGVIUm9uQXFBYzgvbFVwcTVsY1R5dXA2MmcweVVER0NSWDFsQzdueFdxNEZRUkttMzYxVVdIMVN0S3NCV1U5YXpzd3BWYytjK0cxVkZoS0VhVlZFdis3eW1MYkh2TXNTeG5ZZktRR3pKZDJsZzdoOStud0VXUEZyYVYwSWlFd1JnRnJjc002Y0tPVXNRTmcwM2daem05QTFQRU1Qc2xWYVlFU1RMMEJ3WndKQ05QdG5qRFFhQVQvL3hOeGtnTXBUajhlMFEwaXovS21PSEZjQ21abUFtWVFlZzdZYm1Xd1pKbUMvQTR6M056dzFEdTZiVlVUdnVYUDF1dFBqWUhtN04wcytIaGlxUkxaUkt2NFYxbjhNVDRkV29EaDRFemExU0gxNGZVYnVUV2VRT1RlMGlndFpFODdZcXZVbGlRUGNDNEdITzNuWVZUVWpqdEQ1NkxJZk92TWV3dVp1eHB3QUx5RFFwcWlyT2lvekpyMFp1VmxvQnZZdkNHZUtUanhDbWJQQ0xvNEwwRlFaQVVOZnZNZ0QxQy82cUdlQXhDMENyYVZJTitIT2Jta0dDL2hweVdNc3hyKzNqQWphaEkwTXdMTXNqNjlRL29FcjlvQUgxbEZTd0JKSWtJRlJVZlZQQVBDdmNBQ3dlM2R4VDF0V28zTjIwaHQ5WFRZSmtjSE1IcjBzbnNieGtPcG05ZExqeUlOTVdEd253a0tkNGZIclcwYVUwVnE1b2xmUGJ6OUxyaHZnNmRMRElGTW1NZDQyNks1N20vNmtzTGJXdkMyZXd5a09kckw4TUM3OWtnSy92UDJXQWoyc004UG9XSmVDQkZNMHFVN295Z1A3YU5ZZVBISnZzTURQTXM0VkJCa3NkYWFiVWd5KzN4eWxSMWtUSXNsVlI0YVluTGJxeGhmSnFWRHNQZ2piWDhRaTEzRks3WklVVWkrUHBkQmttZ3RGbktFT1VEZ2VyMUpVM0dQREZTc1owayt1VlJDMjJ5dmtKb2RMdkRteEFBUlo0ZWZONFFFeHpyNXFRYWY2enRKUUhSNWFsTkxMMkFndHZHUDJ2TThDUFAyS0E3WFVHSU1LRm1TUDdOZ2NoMjdpa3c1UEptZHkzRENScFoycUJZYU9HRWRBN25SR3BKN1lLVG9tcUtvcFhmZHZ2ZzM3YXV0NDlLNnRSMGZGeVFzaEp4QlE1ZEdBRzZjbHlPN3AwSWxCTUhoZUJaaXd6OFk1SFZaVTNCT0ZINHNGUkg0RXlHVUpaeDlZdzdpVWlieFJaVU95eWhjd2UvdXdCVzZ3d3hEK001SStJaGtYaGpBanh3ZnZ5b2NRUjdWazg4dmNZNFBFbUF3akJ3L1JhNlFCbjIzTjdnZ2t6M2JMSzFNWnQwK3VkeStFQmFuOUdKdDBtRzdVSmorS1NKdlFCOWZBbjZ5T1ZkWkdpNnR1M1Y3alplaldybDZxYWxVMCtCa0V6Zk5Cb0dOQUJDMFgwZ2xzeS9GTWxUQmxxeW5ESlRWbThKQXFEMlIrSThVYkFNU1loaFRFbVk1U1hZcGtjaHg5T28wSUhxVXRNQU1EblJBQkZwTHJoL3BUYUNPdnl3a1RPaGd3Mm5wallBZjk4SzM2UjVXTi9pd0h5UjgwQTFKSTk5bXdKR0FtMksydXp1bm1oeHg1RnFDWFBNWXZYU3VaeVZBWHNESmdpcks2bkVWbkdHTWZKT21OT3ZXZlNOS04zdGJIcW16U2pGQlVnR0t1OG1sVVVibnJoZXNnQVlxT2hVeFVORWJEV0k5Tk43Z25LUkxDNU5pZFJYYTlJeitIZlh1d0lIRUNFU0M3TEdWTnJPekErSzg2SFlDOGsvU3gvUUhSQXBDVWlobkZidVJXUUh4YTl5aHd2aWw1MSt2OHZHU0NEVnNxTnF5aHJaZkpLMUcrQVVHV3NyYjZ3UnJOTEoyZXlpR2xHWExLaVR2NEhHVTgvbVlQam9wYVkxV2NTZ1lkSTlLeHdzd0dOTmxxTWF4TWpyVFRhTUZvOFFYU3NrSUxxaWs1TE5CQ1VMYWZiSHZGeUlEM29JajhUMFZVVUJBT2hMTG9sWEwwcGhtY1V5bXpzWmtVMVNodElIaDdZVStramVYVjZ4L3llR2J3SzFKNUE1M0IvNjVraFBoWk8wK3RoRTJNR0lKQWZCY1QvQWdQTUdXYUdlRXNZbmVhZVZ4eDJBbXBFVDE1bFNtZWdvU2FmWWs3ckQ0MjVoaDN5RWd5THZXbWlXd1BTTTdXcDVjMytFc3J6T0VqR0V6aWZnQmRoYkRzbUc0R1NXQzdjRlR2VEJySGFCbVZhTVMzK3BEb1FzallMZ3BGUWlHNWhUSXR2eHEzVUhvUnkyWjR0TWhVblVkOG9JcU5ubU1TKzJ3dUZrMXJ0K041TlA2TXFwcnpYTUFFK0MybDdZVzZBQXBFY1FPai8rd3h3S09NQjZPMWp2WHNtMlR2dEdYQzVZNUxPSEpLbkI0eStJVVhCQVpnYUxvZnhRK21QT1hBNTdrSXcxbmdMNll6VVNJbDh6YlY0eGdVNmlYVEtBb2Jzd2lLZ1hkRGdHRW9CQkNWL0c0ajNraE5aVHMvZFg3UGNrT3NJdklmNHNvclBUalVhR3FJeUtrS2NJSlNqbWVFQ2dydkRIY2Z6TUE1c29FeUh2UWZUR3orUW40M3hqR0xuT1BjWVcwbjYwYUJwbWxtVTNJWUI0TC8vQmYyREFlYnpGZ09FT1NPaFJja0E3dTJMZXZkRVJtTUNtNFlHN2d5aHFBQS8zWDJ3L3Q0c3dBaEU1RG1rZVV3MGJBMkc5V1VPalZvM0liaEV2bWEvbHpaTUlyblNWeUIxMENNblFUT3lPdlFzdTg3ZjlMZTNFek9Bb2JmNFBwVzBWSHU1N2FjNXNhajV6bU5wYWxRUUxWa0RrSUpvQTVvNzFLem4wQUVWMnp6QUdHQzMrRHJGR0VSak0xd054WU9tVERySHJSV2g5ZzAyMmlZQldEeGU2WDhIQy9Rb3JVeGdnRHBmUlNZa29UZTg0N1hyTWJKYm1CYXRwQXJWYm1ub213RjJRbUZzdVhOMC9wdDJwTlRtV2wzV0lWdWloVVptNmxFVTRjdXE2WVk2SXZJMSs3MjRLUXZ2RUpqRklzYmN5aThCM0VmZzR5b0NMUENSK1J0QzlFSWJUUWxuaE1ScE9WT284cTRiTSs4eXVvVnBKckVmWGcrS3FJcHNkSVVpT3FkUmF4YWkyM3ArSUZFQTlISmxlalBkMmtZQ2paMTZrbUNHTHd2Zm14VkZOOUI2eEp4QXN2NEwrY0VBbThLRWNjKzBBSFcrQ2d5eVIwN3dCMGViME1BMzFxVzNsWlJ5blNBVHQwNGsvY2RwcWZKcWxJazJSRTIvWXFkdGUrOG93bWMwUW1waXl1MW4wQzBzY203OGdjVUFKalU1eWN1WU85M1FBNWdCOHlGNVR0ZTFwL1BoSXRqZWo0YU93NFN6bXlzMmtrVnZmU2dZb0lxTjBmUTB4WmxzaktsMEw1UDVIUVlyY2FIUi9jZTByQ3hmOU80eGxZanhkaVZQcUMwQms0d3A1d2V1QUxZd3NleUpTb29FWVdoQzdEUmhDRVdRektQT1Z4RUpTZlFINjIyeWRqMnNqTnpiakZWV2g1WnNHRU5BVEttSGpRRXROS1JzUGc5a2ZJeDYwdExwdGpaeUlJUzJCNXYwaEVhdzNyOUJ0alB5WC92Y0pqK05BdWZObkZtYkVkWnVRSkE1NW93RnZTZ29nWVdvY3YvaVlSUmtnTFpGeWd0R2lFYUZFOGRYR0tCL2xRR3N1dUM2bjVwVUxBRnpBb01pb25lZ2RTU2FBa0RBaWoxckp1L0FKR1RlOGk0amFVRnQwQnhrcHVuUkJONlVQbHVuOEQ4bEEzeWZZbGVKeVllOEFOQzVjbmZqaXBiK3dCSDhlTWRHS3lzRVE4N0hQbmtEYUxCaGczRUp5dEV4YWVrMjdOcExrdEh3SkZheUNwYUxzTXRDNzRYMW1NR1J1cFpaYXY4TmpQMllLTnFkYXkxd09aN0NrdDdpaFpBTjJYQWpJRUhPY05WM2FaSGxWbEVLeW90Ukkxc1pDdEQwS0p3anUxdWJBZVlGQTFnWW5PVlJkNkZ1U1ExWCtNOVRYbkVGMGVKR1o2d0RrWURQM3dWK0MwRFJNY0VIcnJqSlQ4eWY3ZFpObUNodnorMWt3dm1LMURESkFMWUJmbWNiNHdURGRFYW5Kam1Zb20xbXRGWFJsQUhUQ09hcjdWamZ3UUo3RnF0QVZnamxubnU4ak14dFl4LzRlK0EyZ1U1dU9ac0JxblRYRE1ZSG5obXVtUjRDdDVpeitNYlcrSVNKcGRhRGh2Q29kRFN1cVFPNTlGVnpKQ09EUGU1eDNuY0dnSXRYS2VGWmZWMExxbEswOGpveGRPby91ZFppcGdJemxBeVEybmM2aE5WYlJSRURrcUYxYXdZQVVSVzVCb2loaVhpK0N3WW5BRmZtYWdJWHVpWU1pNlhKVUorbjBLQmNFeU41UXdDZ2ljREhxcHhGMlhVUlVGRzlyQXpLMGtTTjh5dzA5NnIva2Fkc0JnT1VxektDZFkrL3Y0TDhxaFpTYWRoQS9PTTdrUVNXVmlzQThOUmZRQ3E2eC8xdzhLelpvRFhtdXNucFlUaDJsZllENVlyTUM2b3NBZmR6azlZS1ZBMWQwMENGZ0JyNTdRd1E4WmNKcDBGUDJib1JIYWxwYUp0Rkw3VHRnT0dTQWVReGE0am1Dd2JBc3FTL3N1STRjNTV4Q1NCUlhXVlpXUVVsMThpOG5BSk5hYW00YmN5R29SWkxTdHJFNlovMlJvaU5XY0crUWdBa0ErU2VGMHNyeWlUcjdDME15bkJPSE9tR2hMdUtwcHdIT24xTmZNTU1hOG9BbmpwMjhuYzdwcUxacHd4SHFPckFlcU1HYVVXbWRJZDBNR0Nra1ZuTW5xSmVFK1FBZFNPdWhPdUZCOFlhQXlnN1lHbE9hNFU1RU1rQWpIc01Ca2hBVForMHRKN2VPdjRyQVpzYVhsQW9jM01vQkhJMEdJQVpjbTBYZ0VkNFVqcTZsREV4dEpVNXozSnRmTEpOeTRnNFo5ZklNTGxodDI0cFVpZFNPMm4rZlZRZlFXamVSMGhscEdzUytwc0FZSXZNbjI2eHNGU0hrUjZHM1pycDJyWHU3a2crd295NWVFRWJLL2ptMUZCdkxFRHlQeWcyZUtUaVBFSnNPcnNWY3JsMk90aFkrcVR0OTNRYlc4aE82VGw3VHhZa1EyTDVmZzJnWHZjOUtuSnpqUUVZQXJSSUJyQzR4MUV3QU5Sc1BBdDI3YXpoczRpR0p6TEVSRDFZbWVGWFZHOGlycm03bDhtYnNXTXVwZ0diaXEycGs2ektlWlpFOWZ3VmhHdERub2VXOXNXdFZIVEJQUWhxaytaZTYxN25MUEpXNms5cDZRTXFHRUN1alQwdmErbW90VWE3ZFZoZ1VBYlR5bzBkcGF1YktYUG5nQU80WTFyRFV6dXh4R29iN3UwQU1sV2xQREE4TW1OVStDNDBXUUtvRmpubXBUY1hUeFhhdTFYUGU2eTZDMzVqemljRDZPTGVSTmtLUitKWERFRHgzb3NsWUt6dnRrMEdlR2Rkang3K2dScllEcVhsTnREVkZZTE5MWkI3eFdsTis1N0VGYU1qN0xkYkJqc1d4aWtsbWJSbG1mTnNHVVQxRERaRThZVkdoc2t0QktVeEpidEliZnhyMDF4T1FwTS9wU2tQL01EZmJmb2pRd2dwYUN1bVplVkJ0dzV3cjJGOHFYVFQ3clhXVGJEU24wcEs1S21mSzNhZjVZZTV0d1BJVkNPdFltT0VKRFlTQkNLOUZPK1dYV1hYcUlwa3oySzVjR0RHckNkcnRsb1YzcEVEVnFBVWVsZVVpdGFRM1o0aDZUSWdUeEdpWkFBWjY1SUJ3SmZnSW5RUi9sR0gwdUkxSUJRcG5XSGhaL0ZzWFJNM2J1R255VitabG50cHdONUxId0lTU1Vxanc1OEtlaEtWZVZlNGw2WkdocnhIY09RckIxUmRwSGJRSEVSSEE4bi84dzliK29DaVlRdFh4UFhBR2pjN2JiTGI1aUN5dnZpY1V3N0lWQWFzR1Eyc3Iwd043dVdZWEdVQThzdVIzQmlKSkpZbS83RFRKc3BPNkkrQ1M5aW5LKzlvSFY2aWNjeVVic1J1SE9OTTdIR0RWY0d4RVE0N2JPWjZNY0x0bURhajMzaEJUaEZuTlFORWtHcm00R2lGMG5KT2s2MURPaU5mWDZSc1ZTS25keSs5Z1JoUnV2b3h2MGd5bThpNS8wcWlNaGhnRXpQK3VOZDJoQkFYY3NyVng2S0wxUDRuU0s1TnpzTmZRbkw3aWI5Si8yem1md3dHd01lWTdZY3FxcW00NkZZeU1LUHpRTFV2Q0Y3c2pvbWZRcm4xd1RtRDVBWTk2MXdQTXNzMTBrSWNQcVZ6YmZHUUJJTWdiTkJZZ3FYdWxNTjJsdHJGdDRGcmVTRmluTEVONU9adzBNU21ueUFpQkE4eUU3dnRLUmJTc1REbFBSaWdId3hBbUdnbmttTFdvYlNjMDF6WVFqcnZxWUFyaWF2Z08yNi9wdHhHeTBFUWRiUHhXU3cwS3lleWRpZFJxYlJSYlJPNjV1dzJtcmE3U0czOEMxY2ZpQjRrMTUvUzhhODArb0N5TWRFdEdXQVltam03VnpBb2U5WVhzeXFEQTFqamg4QksxZk9GMmhBRHpicmMrRUlzV1BDVys4YzZTak9ac21mTExFSTRtTm8rNTF3cHVERThLS3JZa2xTd1lMVkJwYytXMTRjUjBPanFOY1JHNk1zd3EwL2JxaUJmNGptK1p4c3FiQ3dZSGpEUmJpUlNqRkRhbk5PeHBYWUtNN1JneW1tTmpHalcwSkdTR3o3UTBNUVJqdWNUZVcrdEZ1UmNJYjVyZVk2L2JVYXpoMTFWK3hkUy9sOXYvMFg3Ri8rWkM1RDBaL09zbjJBQWwzV1BHRE5yVVh4Z1FybU9LTThGSzMzREpQZit3cTJlaW9GRksyWEdXbkhWb1JqY3YzSXBieXg2MjMwWm1qRmNiSjlaTVpjYnd5ai95YjA4TVB5c0xrZm5ZMmZIZmx6S2tFL3NwMGVsWFZFL0pITjhVMkhqejh5R21Va3hsOWRpZG5ScXBuVG1Ca3Y5SEpqV1h6NXhaeVEwSmJlYVJGTVI1eXlPaVp6ZFNWUW83aDY1azJzNC9maVU2VlZYMlpUT1JuZVMvSC8rNTMvUTh6OUIvbXdjV0t2MHF2dmR0RlZ6QjR6R21XTWVTd1hVZkpEK2pJTUEvYmtNRkF3Z3Z5Z0FNS3FBaW5BcDczdVFlQ0ExRkxmWWd3NUEyeDBhcmF4a1ZLVlpKRGt4UDhZdys1bUM3TlV5K3lFaEl6MExwR3prcjRxUURJVGtSamJNdDB5S3FTYnNxbUdTZjVYUytmOG43MnhiNGdpQ0lCd1NBU0VTQ0w3bElCd1lEd0luOS8vL1hxYjdxYnFhMmZzVVJCQ3RqWHR1YVFDczdkbCttOTRTcUIzd1BXWk44TFh2cnlKS1JOUkYwOFVUUHk2R0RJMmsrU2JydVNHVGhna1ZSSFBoTkNRL0RmUjN5TDhnZjJydEhrMVdFbnFKZzhsQjF2UC9tVGU5MWwrNGE2UjVBdHhOZy9NRzFTNUFoUWUxMm51bVRMK0xWQTRaQ2IzYSszM3JGK2xpN3dLM1NhdUtoRFR5OXFxS3R1RlQ2L2RvejlRV0JTYll6WjJ5REtudCtnWWZLbVFPUzg0UnhRL0w2dXgxZTQ2MkRnaTlxTHUxNGdLR0hENnF5b2REMzZ6bmVvYTNlUy9VQ25RK2JRWFA5eGMzUU9QNXZzNUwzMCtRaVFuZTAvSGtPNEJ3c1kzL0NYY3ZvelA3RmlBOGNJS3RudEIzL2RwSDdZSmxSQjk3Z3ZINGR0ajdJMGM2RHdZODlwdWFCYW5Kb3NMVDdlTktGaFZJQkM2RmJ6VEJPQTRiNVF3WE8vcE04TVZ6MkhBcnJWWm5WRzM5K0pZTGZMczZEVVRjYUZvZmtUR0dERzBVTDdjdDYvbFJ4bzA1WDFEQmwvOUMyV2tlQVJpYyszNEN1Y2FVMy9IL2ZBYzRFWFJmcjgxVlBwQ2FwWk9BZC9VejdZRFR5SVhIVWU4WXAxYmJRem9MdUpwNkJ3TmdFMFZhUm02eXNZVTdZUEEzNGUyWE1VNjZyZzg0WjBqckNjWndyT3hNUnUzV1VqNUlwc21jYzFoeFpNYVVIVzRsMnRLQmdodDFpeHVRWmlXaSthYUJQcHM1VHM5d1lPTmVxVmVnRk4wNGdVN1pQaTVJNnFYMTEvdmUwNENXSk1DMXhtZTdERkR0LzU1S0lIL2hhZ3p6MGFCUHQyeVJFS1BQRzhLZ1l6WUQ5MXZYdHNab0M0L2hUdkYwdTE4NFo2MnNKaGlMSzloYjIvTktDRDRUcU9YSUtvM0M4Y2ZXYU11SEVISHI1OGhyR2JGanMraXBjMkdjbzNnaFVpL1U2MUR4M29EQ1FQZWh1dStIak94WFhHUFgwWHNTWDNtQ3kxdFBrd2FrMTE0OStkZEVpTDkwQTZqQi8vdklNWGd3NmRTbjM3c292SW9IUDVNNzVmU2JvaFpoMUliSEwzTm9oWkRPakRjZzRleXRKUUJMTXMxSyt4UjNHL1BHWkdGaXZzS2dXYmxSdDNWRlVqUzFpQllkcVNlMDJhUHYyMElaSHllQ2NJdmM5OU55Vno1TnJqR3Z3YnF0bVc0ZEMxQ0NZWXR3Q2dHOFdXSHZWb0F1YlkydFF2UmU2ZFVvWTlTK1J4TWZXTFNkRUV0MGJUamREUkR0L0FEV2s5cDgvTElJV1V3b1lpdHhmN2VKMHpuYzF1R1RaY2JXYmJPcjUvMGlsZnM2MmlKdUhQR2dXTDZnQTY3ZkhyVnhZazRGRS9EU1R6Q25ndHMxVnBhbDlPODJOQWI4YWtoQVNvR2QrRWd6VU5jRXJqekdpTUtHMmtMeDVWaTBrOXFHT0VQKzk0V0JPb3phOG12ZXBCQ0I2NEQwbzl5WGpTVzRCaTg1b1NxV2JadkZoakZycm15N0lsQTNxcjQzRER2ZGJQTGVQYWlmUUsxbzJsMVFham5MVWtYQWJxTHRFZDhhRXpJMUF4QUV1d0djblhnYUI2LzBHSHF6U1ZHNTdxemFUVXp3U3U1RENuVVlOZFB3Yzk0a1VUVGExa2U0WEY3bTBvNDJaWi9xd0lJbHNWVzl0R3ErM2oxU0RuYmxTNitNN1dhdWVvYVR1YS9aT3BTRDFZbENKUDZOZ1diWjVacDJJRXlSa0ZtM1FDLzRYUVpEYkFTWHM3VWt4RXhzRFQ2SGRIVStKTHkwaFFYOEdrdzRRbXVrdHZzV3hOcXhaWjBXUS80NE9Cd3lST1pIZGN3K3VQNmsvVWphNDdFYnhxdE9GUHlCdVFybS9rQ3QxcGdvTXFvenFGL2FreklZS2JMTE5kdi9kYlgzWkVsaW9ZbWtReWRQWnRpQVE5US9jYkJjcmtCOTJ6S25qd3FVcHZKVmhzM3UwWEt0dENQUmV6d3dXcHlEOGdkY0JTTXhUc2NaWHZpOEVyTzgvOG1DWDF4QWJXUEpoeVc2WGcwYjhlYkhNV0ZVYVBQYkpBbHhGVEFKVnpTV3ZnTDVQd2U2ZDB5VkwvYktseEhqaE0zdHhPT2FCemZWTDR3ZVlQMVorOUhMdXM3VmJNcGdRWDQxY0R3ZEF2VUZiRm9LbFhCYlBuN1pTNUtpaTdSTkp0RGlFamgvK29td3ZwQkxRZGM1REVzVHcyNE95M1JyQkxRVFcvNnN4TG9Gc3VCajNvR1VUY29rQkladGJyVlNhWVNPSzI4Vy9HdnZERlliaUdFZ2FnaHRvYWVrbDNhaHAxd0tZZnYvdjFka1dYNmFRQytGd0pycU9SZjdhbHZ4V3FOeEM2SnZEZWorVzB4OHBGeENFSVNqRUpmcEkxWGlCMy9BZDJ6TXFZZllDQU1TOEFOaU5qY21rZGpRZitXNWwrT1hZZlF2VTFuWW9VN2FLUVJCM3ZjVWkxbVA1WmRuL2RNZnpsUWQzc2hZc0FSU3dHZXlwMENCQ3pIdVRJVEhSZVhDYThoZzNnU2Y4ME96cG9aOVpZQ1h5Qnl0TzQ1SXpCSUlTRjB5dGI5Y2lMSFpIenIzaGV0djFhb0FRWkFSTXQyY0ZWTFJ0RGdQM1BhOUJTTnZLUUdmeSs0amJPeWlLL0EvYUtQZ2hlSlY1RDBwTDZ4bEUzZldFM3VEYjFKZXh1RStyNHF1M0FNcGREZkVDZGRnQVR4Tk1KL3hDQUI4Z3lGSU94cTFBSjRoTDRCT0Z2Z1psTDBoMlhsM1cwMnNKNEIvZUtNZGpzSWY2UVFyVTN6QndrWmZ4aldpNXA1VFlkaHFmbUk5c1FZRnNuQXdrVmMyc1VMZ04raXVHMGp4c05YRWUyUUZDZ3BEQk52TTJOako2L2lPbGJxNWpuWTJ5d1A2L0srMkFBcXZkTkxOdkczWnlESUVmcWZBOHJySUxKTm9oeVBBQ2hRVWg0SnZabkdZRDRIZjVMSzVSQTg4RDdoV0FDaFFCQWxkMDVGSFhlRDNGaU9iRjBYZGllYXhudGpiU2hTMmxhVmRoN25YTmZwRDRHY2pXaFNWK1VyV0V3dFIvQUJ0d3pZbStJeFNsd0FBQUFCSlJVNUVya0pnZ2c9PWA7XG4gIHJldHVybiBpbWFnZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZudCgpe1xuICByZXR1cm4gYGluZm8gZmFjZT1cIlJvYm90b1wiIHNpemU9MTkyIGJvbGQ9MCBpdGFsaWM9MCBjaGFyc2V0PVwiXCIgdW5pY29kZT0xIHN0cmV0Y2hIPTEwMCBzbW9vdGg9MSBhYT0xIHBhZGRpbmc9MjQsMjQsMjQsMjQgc3BhY2luZz0xMiwxMiBvdXRsaW5lPTBcbmNvbW1vbiBsaW5lSGVpZ2h0PTE5MiBiYXNlPTE1MiBzY2FsZVc9MzA3MiBzY2FsZUg9MTUzNiBwYWdlcz0xIHBhY2tlZD0wIGFscGhhQ2hubD0wIHJlZENobmw9NCBncmVlbkNobmw9NCBibHVlQ2hubD00XG5wYWdlIGlkPTAgZmlsZT1cInJvYm90b18wLnBuZ1wiXG5jaGFycyBjb3VudD0xOTRcbmNoYXIgaWQ9MCAgICB4PTYzNiAgIHk9MTQzOCAgd2lkdGg9NDggICAgaGVpZ2h0PTQ5ICAgIHhvZmZzZXQ9LTI0ICAgeW9mZnNldD0xNjcgICB4YWR2YW5jZT0wICAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MiAgICB4PTU3NiAgIHk9MTQzOCAgd2lkdGg9NDggICAgaGVpZ2h0PTQ5ICAgIHhvZmZzZXQ9LTI0ICAgeW9mZnNldD0xNjcgICB4YWR2YW5jZT0wICAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTMgICB4PTQ1MCAgIHk9MTQzOSAgd2lkdGg9NTEgICAgaGVpZ2h0PTQ5ICAgIHhvZmZzZXQ9LTI1ICAgeW9mZnNldD0xNjcgICB4YWR2YW5jZT00MCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MzIgICB4PTI5ODcgIHk9MTI0MiAgd2lkdGg9NTEgICAgaGVpZ2h0PTQ5ICAgIHhvZmZzZXQ9LTI1ICAgeW9mZnNldD0xNjcgICB4YWR2YW5jZT00MCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MzMgICB4PTE3MTQgIHk9NzY5ICAgd2lkdGg9NjYgICAgaGVpZ2h0PTE2MyAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT00MSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MzQgICB4PTE5OTkgIHk9MTI2MyAgd2lkdGg9ODEgICAgaGVpZ2h0PTg3ICAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT01MSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MzUgICB4PTEyMTQgIHk9OTUxICAgd2lkdGg9MTM2ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTE1ICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT05OSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MzYgICB4PTE2MTAgIHk9MCAgICAgd2lkdGg9MTIyICAgaGVpZ2h0PTE5NiAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0tNCAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MzcgICB4PTEzNDEgIHk9NTk1ICAgd2lkdGg9MTUyICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT0xMTcgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MzggICB4PTE2NTggIHk9NTkyICAgd2lkdGg9MTQxICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT05OSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MzkgICB4PTIwOTIgIHk9MTI2MyAgd2lkdGg9NjIgICAgaGVpZ2h0PTg1ICAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT0yOCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NDAgICB4PTEwMyAgIHk9MCAgICAgd2lkdGg9OTAgICAgaGVpZ2h0PTIxMyAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD0wICAgICB4YWR2YW5jZT01NSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NDEgICB4PTAgICAgIHk9MCAgICAgd2lkdGg9OTEgICAgaGVpZ2h0PTIxMyAgIHhvZmZzZXQ9LTIyICAgeW9mZnNldD0wICAgICB4YWR2YW5jZT01NiAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NDIgICB4PTY2NCAgIHk9MTI5NCAgd2lkdGg9MTE0ICAgaGVpZ2h0PTExNCAgIHhvZmZzZXQ9LTIzICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT02OSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NDMgICB4PTAgICAgIHk9MTMxNyAgd2lkdGg9MTI4ICAgaGVpZ2h0PTEyOSAgIHhvZmZzZXQ9LTE5ICAgeW9mZnNldD0zNCAgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NDQgICB4PTE5MTYgIHk9MTI2NCAgd2lkdGg9NzEgICAgaGVpZ2h0PTg4ICAgIHhvZmZzZXQ9LTIyICAgeW9mZnNldD0xMTEgICB4YWR2YW5jZT0zMSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NDUgICB4PTIzMyAgIHk9MTQ1NyAgd2lkdGg9ODggICAgaGVpZ2h0PTYwICAgIHhvZmZzZXQ9LTIyICAgeW9mZnNldD03NCAgICB4YWR2YW5jZT00NCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NDYgICB4PTI4MjggIHk9MTI0NSAgd2lkdGg9NjggICAgaGVpZ2h0PTY1ICAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD0xMTIgICB4YWR2YW5jZT00MiAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NDcgICB4PTAgICAgIHk9NDI5ICAgd2lkdGg9MTA5ICAgaGVpZ2h0PTE3MiAgIHhvZmZzZXQ9LTIzICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT02NiAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NDggICB4PTIzOTIgIHk9NTgzICAgd2lkdGg9MTIyICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NDkgICB4PTExMiAgIHk9MTE0MyAgd2lkdGg9OTMgICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTExICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NTAgICB4PTE0NDMgIHk9NzcyICAgd2lkdGg9MTI2ICAgaGVpZ2h0PTE2MyAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NTEgICB4PTI2NjAgIHk9NTc1ICAgd2lkdGg9MTIxICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NTIgICB4PTE3OTQgIHk9OTQzICAgd2lkdGg9MTMyICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTIxICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NTMgICB4PTUzOSAgIHk9Nzc5ICAgd2lkdGg9MTIxICAgaGVpZ2h0PTE2NCAgIHhvZmZzZXQ9LTEzICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NTQgICB4PTQwNiAgIHk9Nzc5ICAgd2lkdGg9MTIxICAgaGVpZ2h0PTE2NCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NTUgICB4PTIwODIgIHk9OTQxICAgd2lkdGg9MTI3ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTE5ICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NTYgICB4PTI1MjYgIHk9NTgxICAgd2lkdGg9MTIyICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NTcgICB4PTE1ODEgIHk9NzcxICAgd2lkdGg9MTIxICAgaGVpZ2h0PTE2MyAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NTggICB4PTIzODMgIHk9MTExMyAgd2lkdGg9NjcgICAgaGVpZ2h0PTEzNCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD00MyAgICB4YWR2YW5jZT0zOSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NTkgICB4PTM3MiAgIHk9MTE0MCAgd2lkdGg9NzMgICAgaGVpZ2h0PTE1NiAgIHhvZmZzZXQ9LTIyICAgeW9mZnNldD00MyAgICB4YWR2YW5jZT0zNCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NjAgICB4PTUzOSAgIHk9MTMwNyAgd2lkdGg9MTEzICAgaGVpZ2h0PTExOSAgIHhvZmZzZXQ9LTE5ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT04MSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NjEgICB4PTE2ODggIHk9MTI2OSAgd2lkdGg9MTE1ICAgaGVpZ2h0PTkzICAgIHhvZmZzZXQ9LTEzICAgeW9mZnNldD01MSAgICB4YWR2YW5jZT04OCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NjIgICB4PTQxMSAgIHk9MTMwOCAgd2lkdGg9MTE2ICAgaGVpZ2h0PTExOSAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT04NCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NjMgICB4PTgwMCAgIHk9Nzc5ICAgd2lkdGg9MTEzICAgaGVpZ2h0PTE2NCAgIHhvZmZzZXQ9LTE5ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT03NiAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NjQgICB4PTE0MjEgIHk9MCAgICAgd2lkdGg9MTc3ICAgaGVpZ2h0PTE5NiAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0xNiAgICB4YWR2YW5jZT0xNDQgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NjUgICB4PTI3MDggIHk9NzUyICAgd2lkdGg9MTUwICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTIzICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NjYgICB4PTIyMjEgIHk9OTM5ICAgd2lkdGg9MTI3ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xMDAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NjcgICB4PTE4MTEgIHk9NTkyICAgd2lkdGg9MTM3ICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE1ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NjggICB4PTE2NTAgIHk9OTQ2ICAgd2lkdGg9MTMyICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xMDUgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NjkgICB4PTI0OTYgIHk9OTM0ICAgd2lkdGg9MTIyICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NzAgICB4PTI2MzAgIHk9OTMyICAgd2lkdGg9MTIwICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT04OCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NzEgICB4PTE5NjAgIHk9NTkwICAgd2lkdGg9MTM3ICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE1ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT0xMDkgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NzIgICB4PTkxNiAgIHk9OTU1ICAgd2lkdGg9MTM3ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xMTQgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NzMgICB4PTI5NiAgIHk9MTE0MiAgd2lkdGg9NjQgICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTEwICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT00NCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NzQgICB4PTI3MiAgIHk9NzkwICAgd2lkdGg9MTIyICAgaGVpZ2h0PTE2NCAgIHhvZmZzZXQ9LTIxICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT04OCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NzUgICB4PTc2NyAgIHk9OTU1ICAgd2lkdGg9MTM3ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xMDAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NzYgICB4PTI3NjIgIHk9OTI2ICAgd2lkdGg9MTE5ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT04NiAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NzcgICB4PTIxOTcgIHk9NzY1ICAgd2lkdGg9MTYzICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xNDAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NzggICB4PTEwNjUgIHk9OTUyICAgd2lkdGg9MTM3ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xMTQgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9NzkgICB4PTE1MDUgIHk9NTk0ICAgd2lkdGg9MTQxICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT0xMTAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9ODAgICB4PTE5MzggIHk9OTQzICAgd2lkdGg9MTMyICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xMDEgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9ODEgICB4PTIyMjIgIHk9MjA3ICAgd2lkdGg9MTQxICAgaGVpZ2h0PTE4MyAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT0xMTAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9ODIgICB4PTEzNjIgIHk9OTQ5ICAgd2lkdGg9MTMyICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTExICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT05OSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9ODMgICB4PTIxMDkgIHk9NTg4ICAgd2lkdGg9MTMyICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT05NSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9ODQgICB4PTYxNyAgIHk9OTU1ICAgd2lkdGg9MTM4ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTIxICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT05NSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9ODUgICB4PTEyOCAgIHk9NzkyICAgd2lkdGg9MTMyICAgaGVpZ2h0PTE2NCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9ODYgICB4PTI4NzAgIHk9NzQ5ICAgd2lkdGg9MTQ3ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTIyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xMDIgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9ODcgICB4PTIwMDIgIHk9NzY3ICAgd2lkdGg9MTgzICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTIwICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xNDIgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9ODggICB4PTMxMiAgIHk9OTY2ICAgd2lkdGg9MTQxICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTIwICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xMDAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9ODkgICB4PTE1NyAgIHk9OTY4ICAgd2lkdGg9MTQzICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTI0ICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT05NiAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9OTAgICB4PTE1MDYgIHk9OTQ3ICAgd2lkdGg9MTMyICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT05NiAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9OTEgICB4PTY1OCAgIHk9MCAgICAgd2lkdGg9NzkgICAgaGVpZ2h0PTIwMiAgIHhvZmZzZXQ9LTEzICAgeW9mZnNldD0tMiAgICB4YWR2YW5jZT00MiAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9OTIgICB4PTI5NDUgIHk9MjA0ICAgd2lkdGg9MTExICAgaGVpZ2h0PTE3MiAgIHhvZmZzZXQ9LTIyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT02NiAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9OTMgICB4PTU2NyAgIHk9MCAgICAgd2lkdGg9NzkgICAgaGVpZ2h0PTIwMiAgIHhvZmZzZXQ9LTI0ICAgeW9mZnNldD0tMiAgICB4YWR2YW5jZT00MiAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9OTQgICB4PTE1NzAgIHk9MTI3MSAgd2lkdGg9MTA2ICAgaGVpZ2h0PTEwNSAgIHhvZmZzZXQ9LTIwICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT02NyAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9OTUgICB4PTAgICAgIHk9MTQ1OCAgd2lkdGg9MTIxICAgaGVpZ2h0PTYwICAgIHhvZmZzZXQ9LTI0ICAgeW9mZnNldD0xMjggICB4YWR2YW5jZT03MiAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9OTYgICB4PTI2MjIgIHk9MTI1OCAgd2lkdGg9ODIgICAgaGVpZ2h0PTcxICAgIHhvZmZzZXQ9LTIwICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT00OSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9OTcgICB4PTE1ODUgIHk9MTEyMSAgd2lkdGg9MTE5ICAgaGVpZ2h0PTEzNiAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT04NyAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9OTggICB4PTY3NyAgIHk9NDE4ICAgd2lkdGg9MTIxICAgaGVpZ2h0PTE3MCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9OTkgICB4PTE0NTMgIHk9MTEyMyAgd2lkdGg9MTIwICAgaGVpZ2h0PTEzNiAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT04NCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTAwICB4PTEyMDkgIHk9NDEzICAgd2lkdGg9MTIwICAgaGVpZ2h0PTE3MCAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTAxICB4PTEzMjAgIHk9MTEyNSAgd2lkdGg9MTIxICAgaGVpZ2h0PTEzNiAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT04NSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTAyICB4PTE4NjYgIHk9NDA4ICAgd2lkdGg9MTAxICAgaGVpZ2h0PTE3MCAgIHhvZmZzZXQ9LTIwICAgeW9mZnNldD02ICAgICB4YWR2YW5jZT01NiAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTAzICB4PTEzNCAgIHk9NjEyICAgd2lkdGg9MTIxICAgaGVpZ2h0PTE2NyAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTA0ICB4PTI2MjcgIHk9Mzk1ICAgd2lkdGg9MTE2ICAgaGVpZ2h0PTE2OCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT04OCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTA1ICB4PTEwNTAgIHk9Nzc2ICAgd2lkdGg9NjcgICAgaGVpZ2h0PTE2NCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD0xMiAgICB4YWR2YW5jZT0zOSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTA2ICB4PTEzMjcgIHk9MCAgICAgd2lkdGg9ODIgICAgaGVpZ2h0PTE5OCAgIHhvZmZzZXQ9LTMwICAgeW9mZnNldD0xMiAgICB4YWR2YW5jZT0zOCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTA3ICB4PTI0OTUgIHk9NDAxICAgd2lkdGg9MTIwICAgaGVpZ2h0PTE2OCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT04MSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTA4ICB4PTI3NTUgIHk9MzkyICAgd2lkdGg9NjQgICAgaGVpZ2h0PTE2OCAgIHhvZmZzZXQ9LTEzICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT0zOSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTA5ICB4PTE5NzMgIHk9MTExNyAgd2lkdGg9MTY4ICAgaGVpZ2h0PTEzNCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT0xNDAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTEwICB4PTIxNTMgIHk9MTExNSAgd2lkdGg9MTE2ICAgaGVpZ2h0PTEzNCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT04OCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTExICB4PTExODEgIHk9MTEyNiAgd2lkdGg9MTI3ICAgaGVpZ2h0PTEzNiAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTEyICB4PTI2NyAgIHk9NjExICAgd2lkdGg9MTIxICAgaGVpZ2h0PTE2NyAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTEzICB4PTQwMCAgIHk9NjAwICAgd2lkdGg9MTIwICAgaGVpZ2h0PTE2NyAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTE0ICB4PTIyODEgIHk9MTExMyAgd2lkdGg9OTAgICAgaGVpZ2h0PTEzNCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT01NCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTE1ICB4PTE3MTYgIHk9MTEyMCAgd2lkdGg9MTE3ICAgaGVpZ2h0PTEzNiAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT04MyAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTE2ICB4PTQ1NyAgIHk9MTE0MCAgd2lkdGg9OTUgICAgaGVpZ2h0PTE1NSAgIHhvZmZzZXQ9LTI0ICAgeW9mZnNldD0yMyAgICB4YWR2YW5jZT01MiAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTE3ICB4PTE4NDUgIHk9MTExNyAgd2lkdGg9MTE2ICAgaGVpZ2h0PTEzNSAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD00MyAgICB4YWR2YW5jZT04OCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTE4ICB4PTI3NzIgIHk9MTEwMCAgd2lkdGg9MTIyICAgaGVpZ2h0PTEzMyAgIHhvZmZzZXQ9LTIyICAgeW9mZnNldD00MyAgICB4YWR2YW5jZT03OCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTE5ICB4PTI0NjIgIHk9MTExMyAgd2lkdGg9MTYzICAgaGVpZ2h0PTEzMyAgIHhvZmZzZXQ9LTIyICAgeW9mZnNldD00MyAgICB4YWR2YW5jZT0xMjAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTIwICB4PTI2MzcgIHk9MTEwNiAgd2lkdGg9MTIzICAgaGVpZ2h0PTEzMyAgIHhvZmZzZXQ9LTIyICAgeW9mZnNldD00MyAgICB4YWR2YW5jZT03OSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTIxICB4PTAgICAgIHk9NjEzICAgd2lkdGg9MTIyICAgaGVpZ2h0PTE2NyAgIHhvZmZzZXQ9LTIzICAgeW9mZnNldD00MyAgICB4YWR2YW5jZT03NiAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTIyICB4PTI5MDYgIHk9MTA5NyAgd2lkdGg9MTE3ICAgaGVpZ2h0PTEzMyAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD00MyAgICB4YWR2YW5jZT03OSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTIzICB4PTQ1OCAgIHk9MCAgICAgd2lkdGg9OTcgICAgaGVpZ2h0PTIwMiAgIHhvZmZzZXQ9LTIwICAgeW9mZnNldD0zICAgICB4YWR2YW5jZT01NCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTI0ICB4PTI0NTEgIHk9MjA2ICAgd2lkdGg9NjEgICAgaGVpZ2h0PTE4MyAgIHhvZmZzZXQ9LTExICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0zOSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTI1ICB4PTM0OSAgIHk9MCAgICAgd2lkdGg9OTcgICAgaGVpZ2h0PTIwMiAgIHhvZmZzZXQ9LTIzICAgeW9mZnNldD0zICAgICB4YWR2YW5jZT01NCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTI2ICB4PTIzNzggIHk9MTI1OSAgd2lkdGg9MTM4ICAgaGVpZ2h0PTc5ICAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD02NSAgICB4YWR2YW5jZT0xMDkgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTYwICB4PTUxMyAgIHk9MTQzOSAgd2lkdGg9NTEgICAgaGVpZ2h0PTQ5ICAgIHhvZmZzZXQ9LTI1ICAgeW9mZnNldD0xNjcgICB4YWR2YW5jZT00MCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTYxICB4PTIxNyAgIHk9MTE0MiAgd2lkdGg9NjcgICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT0zOSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTYyICB4PTEzNDEgIHk9NDEzICAgd2lkdGg9MTIwICAgaGVpZ2h0PTE3MCAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0yNSAgICB4YWR2YW5jZT04OCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTYzICB4PTEzMDAgIHk9Nzc0ICAgd2lkdGg9MTMxICAgaGVpZ2h0PTE2MyAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT05MyAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTY0ICB4PTcwMiAgIHk9MTEyOSAgd2lkdGg9MTQ5ICAgaGVpZ2h0PTE0OSAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD0zMCAgICB4YWR2YW5jZT0xMTQgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTY1ICB4PTQ2NSAgIHk9OTU1ICAgd2lkdGg9MTQwICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTIyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT05NyAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTY2ICB4PTIzNzUgIHk9MjA2ICAgd2lkdGg9NjQgICAgaGVpZ2h0PTE4MyAgIHhvZmZzZXQ9LTEzICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0zOCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTY3ICB4PTIwNSAgIHk9MCAgICAgd2lkdGg9MTMyICAgaGVpZ2h0PTIwMiAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT05OCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTY4ICB4PTI3MTYgIHk9MTI1MSAgd2lkdGg9MTAwICAgaGVpZ2h0PTY1ICAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD0xMiAgICB4YWR2YW5jZT02NyAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTY5ICB4PTk5NSAgIHk9NTk5ICAgd2lkdGg9MTYxICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT0xMjYgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTcwICB4PTEzNjggIHk9MTI3MyAgd2lkdGg9OTkgICAgaGVpZ2h0PTEwOSAgIHhvZmZzZXQ9LTEzICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT03MSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTcxICB4PTExMzEgIHk9MTI3NyAgd2lkdGg9MTEwICAgaGVpZ2h0PTExMCAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD01NCAgICB4YWR2YW5jZT03NSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTcyICB4PTIyNTEgIHk9MTI2MSAgd2lkdGg9MTE1ICAgaGVpZ2h0PTgxICAgIHhvZmZzZXQ9LTE1ICAgeW9mZnNldD02NSAgICB4YWR2YW5jZT04OSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTczICB4PTEzMyAgIHk9MTQ1OCAgd2lkdGg9ODggICAgaGVpZ2h0PTYwICAgIHhvZmZzZXQ9LTIyICAgeW9mZnNldD03NCAgICB4YWR2YW5jZT00NCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTc0ICB4PTExNjggIHk9NTk3ICAgd2lkdGg9MTYxICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT0xMjYgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTc1ICB4PTMzMyAgIHk9MTQ0OCAgd2lkdGg9MTA1ICAgaGVpZ2h0PTU5ICAgIHhvZmZzZXQ9LTE1ICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT03MyAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTc2ICB4PTE4MTUgIHk9MTI2OCAgd2lkdGg9ODkgICAgaGVpZ2h0PTg4ICAgIHhvZmZzZXQ9LTE1ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT02MCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTc3ICB4PTg2MyAgIHk9MTEyOSAgd2lkdGg9MTIxICAgaGVpZ2h0PTE0NyAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD0yOSAgICB4YWR2YW5jZT04NSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTc4ICB4PTg5OSAgIHk9MTI4OCAgd2lkdGg9OTcgICAgaGVpZ2h0PTExMSAgIHhvZmZzZXQ9LTE5ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT01OSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTc5ICB4PTc5MCAgIHk9MTI5MCAgd2lkdGg9OTcgICAgaGVpZ2h0PTExMiAgIHhvZmZzZXQ9LTIwICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT01OSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTgwICB4PTI1MjggIHk9MTI1OCAgd2lkdGg9ODIgICAgaGVpZ2h0PTcxICAgIHhvZmZzZXQ9LTE1ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT01MCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTgxICB4PTg2NiAgIHk9NTk5ICAgd2lkdGg9MTE3ICAgaGVpZ2h0PTE2NiAgIHhvZmZzZXQ9LTEzICAgeW9mZnNldD00MyAgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTgyICB4PTI4OTMgIHk9OTIzICAgd2lkdGg9MTEwICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTIwICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT03OCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTgzICB4PTI5MDggIHk9MTI0MiAgd2lkdGg9NjcgICAgaGVpZ2h0PTY1ICAgIHhvZmZzZXQ9LTEzICAgeW9mZnNldD02MiAgICB4YWR2YW5jZT00MiAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTg0ICB4PTIxNjYgIHk9MTI2MSAgd2lkdGg9NzMgICAgaGVpZ2h0PTgyICAgIHhvZmZzZXQ9LTE1ICAgeW9mZnNldD0xMjggICB4YWR2YW5jZT00MCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTg1ICB4PTE0NzkgIHk9MTI3MSAgd2lkdGg9NzkgICAgaGVpZ2h0PTEwOSAgIHhvZmZzZXQ9LTE1ICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT01OSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTg2ICB4PTEyNTMgIHk9MTI3NCAgd2lkdGg9MTAzICAgaGVpZ2h0PTEwOSAgIHhvZmZzZXQ9LTE1ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT03MyAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTg3ICB4PTEwMDggIHk9MTI3NyAgd2lkdGg9MTExICAgaGVpZ2h0PTExMCAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD01NCAgICB4YWR2YW5jZT03NSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTg4ICB4PTI1NDIgIHk9NzU4ICAgd2lkdGg9MTU0ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xMTcgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTg5ICB4PTIzNzIgIHk9NzYwICAgd2lkdGg9MTU4ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xMjQgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTkwICB4PTExMjkgIHk9Nzc2ICAgd2lkdGg9MTU5ICAgaGVpZ2h0PTE2MyAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT0xMjQgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTkxICB4PTkyNSAgIHk9Nzc3ICAgd2lkdGg9MTEzICAgaGVpZ2h0PTE2NCAgIHhvZmZzZXQ9LTE5ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT03NiAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTkyICB4PTE2MiAgIHk9MjI1ICAgd2lkdGg9MTUwICAgaGVpZ2h0PTE5MiAgIHhvZmZzZXQ9LTIzICAgeW9mZnNldD0tMTYgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTkzICB4PTMyNCAgIHk9MjE0ICAgd2lkdGg9MTUwICAgaGVpZ2h0PTE5MiAgIHhvZmZzZXQ9LTIzICAgeW9mZnNldD0tMTYgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTk0ICB4PTAgICAgIHk9MjI1ICAgd2lkdGg9MTUwICAgaGVpZ2h0PTE5MiAgIHhvZmZzZXQ9LTIzICAgeW9mZnNldD0tMTYgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTk1ICB4PTEzNTkgIHk9MjEwICAgd2lkdGg9MTUwICAgaGVpZ2h0PTE5MCAgIHhvZmZzZXQ9LTIzICAgeW9mZnNldD0tMTQgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTk2ICB4PTE4MTQgIHk9MjA4ICAgd2lkdGg9MTUwICAgaGVpZ2h0PTE4OCAgIHhvZmZzZXQ9LTIzICAgeW9mZnNldD0tMTIgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTk3ICB4PTEwMTYgIHk9MCAgICAgd2lkdGg9MTUwICAgaGVpZ2h0PTE5OSAgIHhvZmZzZXQ9LTIzICAgeW9mZnNldD0tMjMgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTk4ICB4PTE3OTIgIHk9NzY5ICAgd2lkdGg9MTk4ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTI2ICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xNTAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MTk5ICB4PTExNzggIHk9MCAgICAgd2lkdGg9MTM3ICAgaGVpZ2h0PTE5OCAgIHhvZmZzZXQ9LTE1ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjAwICB4PTI5MjIgIHk9MCAgICAgd2lkdGg9MTIyICAgaGVpZ2h0PTE5MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0tMTYgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjAxICB4PTY0MSAgIHk9MjE0ICAgd2lkdGg9MTIyICAgaGVpZ2h0PTE5MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0tMTYgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjAyICB4PTc3NSAgIHk9MjEzICAgd2lkdGg9MTIyICAgaGVpZ2h0PTE5MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0tMTYgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjAzICB4PTE5NzYgIHk9MjA3ICAgd2lkdGg9MTIyICAgaGVpZ2h0PTE4OCAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0tMTIgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjA0ICB4PTEwMTggIHk9MjExICAgd2lkdGg9ODIgICAgaGVpZ2h0PTE5MiAgIHhvZmZzZXQ9LTI3ICAgeW9mZnNldD0tMTYgICB4YWR2YW5jZT00NCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjA1ICB4PTExMTIgIHk9MjExICAgd2lkdGg9ODIgICAgaGVpZ2h0PTE5MiAgIHhvZmZzZXQ9LTExICAgeW9mZnNldD0tMTYgICB4YWR2YW5jZT00NCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjA2ICB4PTkwOSAgIHk9MjEzICAgd2lkdGg9OTcgICAgaGVpZ2h0PTE5MiAgIHhvZmZzZXQ9LTI3ICAgeW9mZnNldD0tMTYgICB4YWR2YW5jZT00NCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjA3ICB4PTIxMTAgIHk9MjA3ICAgd2lkdGg9MTAwICAgaGVpZ2h0PTE4OCAgIHhvZmZzZXQ9LTI4ICAgeW9mZnNldD0tMTIgICB4YWR2YW5jZT00NCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjA4ICB4PTAgICAgIHk9OTY5ICAgd2lkdGg9MTQ1ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTIyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xMDcgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjA5ICB4PTE1MjEgIHk9MjA4ICAgd2lkdGg9MTM3ICAgaGVpZ2h0PTE5MCAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0tMTQgICB4YWR2YW5jZT0xMTQgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjEwICB4PTIxODQgIHk9MCAgICAgd2lkdGg9MTQxICAgaGVpZ2h0PTE5NSAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0tMTcgICB4YWR2YW5jZT0xMTAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjExICB4PTIwMzEgIHk9MCAgICAgd2lkdGg9MTQxICAgaGVpZ2h0PTE5NSAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0tMTcgICB4YWR2YW5jZT0xMTAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjEyICB4PTE4NzggIHk9MCAgICAgd2lkdGg9MTQxICAgaGVpZ2h0PTE5NSAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0tMTcgICB4YWR2YW5jZT0xMTAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjEzICB4PTI3NjkgIHk9MCAgICAgd2lkdGg9MTQxICAgaGVpZ2h0PTE5MyAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0tMTUgICB4YWR2YW5jZT0xMTAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjE0ICB4PTEyMDYgIHk9MjEwICAgd2lkdGg9MTQxICAgaGVpZ2h0PTE5MSAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0tMTMgICB4YWR2YW5jZT0xMTAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjE1ICB4PTI3OSAgIHk9MTMxNiAgd2lkdGg9MTIwICAgaGVpZ2h0PTEyMCAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD00MCAgICB4YWR2YW5jZT04NSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjE2ICB4PTI2NTUgIHk9MjA2ICAgd2lkdGg9MTQzICAgaGVpZ2h0PTE3NCAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0xMCAgICB4YWR2YW5jZT0xMTAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjE3ICB4PTI2MjUgIHk9MCAgICAgd2lkdGg9MTMyICAgaGVpZ2h0PTE5NCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD0tMTYgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjE4ICB4PTI0ODEgIHk9MCAgICAgd2lkdGg9MTMyICAgaGVpZ2h0PTE5NCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD0tMTYgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjE5ICB4PTIzMzcgIHk9MCAgICAgd2lkdGg9MTMyICAgaGVpZ2h0PTE5NCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD0tMTYgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjIwICB4PTE2NzAgIHk9MjA4ICAgd2lkdGg9MTMyICAgaGVpZ2h0PTE5MCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD0tMTIgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjIxICB4PTQ4NiAgIHk9MjE0ICAgd2lkdGg9MTQzICAgaGVpZ2h0PTE5MiAgIHhvZmZzZXQ9LTI0ICAgeW9mZnNldD0tMTYgICB4YWR2YW5jZT05NiAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjIyICB4PTIzNjAgIHk9OTM5ICAgd2lkdGg9MTI0ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT05NSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjIzICB4PTEyMSAgIHk9NDI5ICAgd2lkdGg9MTI3ICAgaGVpZ2h0PTE3MSAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD03ICAgICB4YWR2YW5jZT05NSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjI0ICB4PTE2MDQgIHk9NDEwICAgd2lkdGg9MTE5ICAgaGVpZ2h0PTE3MCAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT04NyAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjI1ICB4PTE0NzMgIHk9NDEyICAgd2lkdGg9MTE5ICAgaGVpZ2h0PTE3MCAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT04NyAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjI2ICB4PTE3MzUgIHk9NDEwICAgd2lkdGg9MTE5ICAgaGVpZ2h0PTE3MCAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT04NyAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjI3ICB4PTUzMiAgIHk9NjAwICAgd2lkdGg9MTE5ICAgaGVpZ2h0PTE2NyAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0xMSAgICB4YWR2YW5jZT04NyAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjI4ICB4PTI5MjYgIHk9NTY5ICAgd2lkdGg9MTE5ICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT04NyAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjI5ICB4PTI1MjQgIHk9MjA2ICAgd2lkdGg9MTE5ICAgaGVpZ2h0PTE3NyAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0xICAgICB4YWR2YW5jZT04NyAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjMwICB4PTk5NiAgIHk9MTEyOSAgd2lkdGg9MTczICAgaGVpZ2h0PTEzNiAgIHhvZmZzZXQ9LTE5ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT0xMzUgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjMxICB4PTE5NzkgIHk9NDA3ICAgd2lkdGg9MTIwICAgaGVpZ2h0PTE2OSAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT04NCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjMyICB4PTEwNzYgIHk9NDE1ICAgd2lkdGg9MTIxICAgaGVpZ2h0PTE3MCAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT04NSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjMzICB4PTk0MyAgIHk9NDE3ICAgd2lkdGg9MTIxICAgaGVpZ2h0PTE3MCAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT04NSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjM0ICB4PTgxMCAgIHk9NDE3ICAgd2lkdGg9MTIxICAgaGVpZ2h0PTE3MCAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT04NSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjM1ICB4PTI3OTMgIHk9NTcyICAgd2lkdGg9MTIxICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT04NSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjM2ICB4PTc3MiAgIHk9NjAwICAgd2lkdGg9ODIgICAgaGVpZ2h0PTE2NyAgIHhvZmZzZXQ9LTI5ICAgeW9mZnNldD05ICAgICB4YWR2YW5jZT00MCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjM3ICB4PTI5NzAgIHk9Mzg4ICAgd2lkdGg9ODIgICAgaGVpZ2h0PTE2NyAgIHhvZmZzZXQ9LTEzICAgeW9mZnNldD05ICAgICB4YWR2YW5jZT00MCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjM4ICB4PTY2MyAgIHk9NjAwICAgd2lkdGg9OTcgICAgaGVpZ2h0PTE2NyAgIHhvZmZzZXQ9LTI5ICAgeW9mZnNldD05ICAgICB4YWR2YW5jZT00MCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjM5ICB4PTAgICAgIHk9MTE0MyAgd2lkdGg9MTAwICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTMwICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT00MCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjQwICB4PTI4MTAgIHk9MjA1ICAgd2lkdGg9MTIzICAgaGVpZ2h0PTE3MyAgIHhvZmZzZXQ9LTE1ICAgeW9mZnNldD01ICAgICB4YWR2YW5jZT05NCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjQxICB4PTAgICAgIHk9NzkyICAgd2lkdGg9MTE2ICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD0xMSAgICB4YWR2YW5jZT04OCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjQyICB4PTI2MCAgIHk9NDI5ICAgd2lkdGg9MTI3ICAgaGVpZ2h0PTE3MCAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjQzICB4PTUzOCAgIHk9NDE4ICAgd2lkdGg9MTI3ICAgaGVpZ2h0PTE3MCAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjQ0ICB4PTM5OSAgIHk9NDE4ICAgd2lkdGg9MTI3ICAgaGVpZ2h0PTE3MCAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjQ1ICB4PTI4MzEgIHk9MzkwICAgd2lkdGg9MTI3ICAgaGVpZ2h0PTE2NyAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD0xMSAgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjQ2ICB4PTIyNTMgIHk9NTgzICAgd2lkdGg9MTI3ICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjQ3ICB4PTE0MCAgIHk9MTMxNyAgd2lkdGg9MTI3ICAgaGVpZ2h0PTEyOCAgIHhvZmZzZXQ9LTE5ICAgeW9mZnNldD0zNCAgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjQ4ICB4PTU2NCAgIHk9MTEyOSAgd2lkdGg9MTI2ICAgaGVpZ2h0PTE1MyAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD0zNCAgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjQ5ICB4PTIxMTEgIHk9NDA3ICAgd2lkdGg9MTE2ICAgaGVpZ2h0PTE2OSAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD05ICAgICB4YWR2YW5jZT04OCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjUwICB4PTIyMzkgIHk9NDAyICAgd2lkdGg9MTE2ICAgaGVpZ2h0PTE2OSAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD05ICAgICB4YWR2YW5jZT04OCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjUxICB4PTIzNjcgIHk9NDAyICAgd2lkdGg9MTE2ICAgaGVpZ2h0PTE2OSAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD05ICAgICB4YWR2YW5jZT04OCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjUyICB4PTY3MiAgIHk9Nzc5ICAgd2lkdGg9MTE2ICAgaGVpZ2h0PTE2NCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT04OCAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjUzICB4PTc0OSAgIHk9MCAgICAgd2lkdGg9MTIyICAgaGVpZ2h0PTIwMSAgIHhvZmZzZXQ9LTIzICAgeW9mZnNldD05ICAgICB4YWR2YW5jZT03NiAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjU0ICB4PTg4MyAgIHk9MCAgICAgd2lkdGg9MTIxICAgaGVpZ2h0PTIwMSAgIHhvZmZzZXQ9LTEzICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT05MiAgICBwYWdlPTAgIGNobmw9MTVcbmNoYXIgaWQ9MjU1ICB4PTE3NDQgIHk9MCAgICAgd2lkdGg9MTIyICAgaGVpZ2h0PTE5NiAgIHhvZmZzZXQ9LTIzICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT03NiAgICBwYWdlPTAgIGNobmw9MTVcbmtlcm5pbmdzIGNvdW50PTE2ODZcbmtlcm5pbmcgZmlyc3Q9MzIgIHNlY29uZD04NCAgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTQwICBzZWNvbmQ9ODYgIGFtb3VudD0yXG5rZXJuaW5nIGZpcnN0PTQwICBzZWNvbmQ9ODcgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTQwICBzZWNvbmQ9ODkgIGFtb3VudD0yXG5rZXJuaW5nIGZpcnN0PTQwICBzZWNvbmQ9MjIxIGFtb3VudD0yXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9NDQgIGFtb3VudD0tMThcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD00NiAgYW1vdW50PS0xOFxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTY1ICBhbW91bnQ9LTEzXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9NzQgIGFtb3VudD0tMjFcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD04NCAgYW1vdW50PTJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD05NyAgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9OTkgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTEwMCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xMDEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTAzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTExMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xMTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTE3IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTExOCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xMjEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTkyIGFtb3VudD0tMTNcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xOTMgYW1vdW50PS0xM1xua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTE5NCBhbW91bnQ9LTEzXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTk1IGFtb3VudD0tMTNcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xOTYgYW1vdW50PS0xM1xua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTE5NyBhbW91bnQ9LTEzXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjI0IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTIyNSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yMjYgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjI3IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTIyOCBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yMjkgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjMxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTIzMiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yMzMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjM0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTIzNSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yNDIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjQzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTI0NCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yNDUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjQ2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTI0OSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yNTAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjUxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTI1MiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yNTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjU1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04MSAgc2Vjb25kPTg0ICBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODEgIHNlY29uZD04NiAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTgxICBzZWNvbmQ9ODcgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04MSAgc2Vjb25kPTg5ICBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODEgIHNlY29uZD0yMjEgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTgyICBzZWNvbmQ9ODQgIGFtb3VudD0tNlxua2VybmluZyBmaXJzdD04MiAgc2Vjb25kPTg2ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODIgIHNlY29uZD04OSAgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTgyICBzZWNvbmQ9MjIxIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD05MSAgc2Vjb25kPTc0ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9OTEgIHNlY29uZD04NSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTkxICBzZWNvbmQ9MjE3IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD05MSAgc2Vjb25kPTIxOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9OTEgIHNlY29uZD0yMTkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTkxICBzZWNvbmQ9MjIwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTM0ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTM5ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTk5ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD0xMDAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9MTAxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTEwMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD0xMTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9MjMxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTIzMiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD0yMzMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9MjM0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTIzNSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTA3IHNlY29uZD05OSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9MTAwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMDcgc2Vjb25kPTEwMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTA3IHNlY29uZD0xMDMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9MTEzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMDcgc2Vjb25kPTIzMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTA3IHNlY29uZD0yMzIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9MjMzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMDcgc2Vjb25kPTIzNCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTA3IHNlY29uZD0yMzUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTExNiBzZWNvbmQ9MTExIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMTYgc2Vjb25kPTI0MiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTE2IHNlY29uZD0yNDMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTExNiBzZWNvbmQ9MjQ0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMTYgc2Vjb25kPTI0NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTE2IHNlY29uZD0yNDYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTExOSBzZWNvbmQ9NDQgIGFtb3VudD0tMTBcbmtlcm5pbmcgZmlyc3Q9MTE5IHNlY29uZD00NiAgYW1vdW50PS0xMFxua2VybmluZyBmaXJzdD0xMjMgc2Vjb25kPTc0ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTIzIHNlY29uZD04NSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEyMyBzZWNvbmQ9MjE3IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMjMgc2Vjb25kPTIxOCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTIzIHNlY29uZD0yMTkgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEyMyBzZWNvbmQ9MjIwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTM0ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0zOSAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTExIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTI0MiBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yNDMgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjQ0IGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTI0NSBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yNDYgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9NjUgIGFtb3VudD0tOVxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTE5MiBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xOTMgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTk0IGFtb3VudD0tOVxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTE5NSBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xOTYgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTk3IGFtb3VudD0tOVxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTk5ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xMDAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTAxIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTEwMyBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xMTMgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjMxIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTIzMiBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yMzMgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjM0IGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTIzNSBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xMDkgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTEwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTExMiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yNDEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9OTcgIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTIyNCBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yMjUgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjI2IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTIyNyBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yMjggYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjI5IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTExNSBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0zNCAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MzkgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTExMSBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yNDIgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjQzIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTI0NCBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yNDUgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjQ2IGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTY1ICBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xOTIgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTkzIGFtb3VudD0tOVxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTE5NCBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xOTUgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTk2IGFtb3VudD0tOVxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTE5NyBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD05OSAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTAwIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTEwMSBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xMDMgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTEzIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTIzMSBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yMzIgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjMzIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTIzNCBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yMzUgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTA5IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTExMCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xMTIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjQxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTk3ICBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yMjQgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjI1IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTIyNiBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yMjcgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjI4IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTIyOSBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xMTUgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTQ0ICBzZWNvbmQ9MzQgIGFtb3VudD0tMTNcbmtlcm5pbmcgZmlyc3Q9NDQgIHNlY29uZD0zOSAgYW1vdW50PS0xM1xua2VybmluZyBmaXJzdD00NiAgc2Vjb25kPTM0ICBhbW91bnQ9LTEzXG5rZXJuaW5nIGZpcnN0PTQ2ICBzZWNvbmQ9MzkgIGFtb3VudD0tMTNcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0xMTggYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MTIxIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTI1MyBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yNTUgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9NjcgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTcxICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD03OSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9ODEgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTIxNiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0xOTkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjEwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTIxMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yMTIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjEzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTIxNCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD04NSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjE3IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTIxOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yMTkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjIwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTM0ICBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0zOSAgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MTExIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTI0MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yNDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTI0NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yNDYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9ODcgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTg0ICBhbW91bnQ9LTEwXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MTE3IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTI0OSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yNTAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjUxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTI1MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0xMjIgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD04NiAgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9ODkgIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTIyMSBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9NjYgIHNlY29uZD04NCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTY2ICBzZWNvbmQ9ODYgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD02NiAgc2Vjb25kPTg5ICBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9NjYgIHNlY29uZD0yMjEgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTY3ICBzZWNvbmQ9ODQgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTg0ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD04NiAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9ODkgIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTIyMSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD02NSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9MTkyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTE5MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD0xOTQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9MTk1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTE5NiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD0xOTcgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9ODggIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTQ0ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD00NiAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9OTAgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTExOCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0xMjEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjUzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTI1NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0xMTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjQyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTI0MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yNDQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTI0NiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD04NCAgYW1vdW50PTJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0xMTcgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTI1MCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yNTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjUyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTk5ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0xMDAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MTAxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTEwMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0xMTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjMxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTIzMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yMzMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjM0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTIzNSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NzIgIHNlY29uZD04NCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTcyICBzZWNvbmQ9ODkgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MiAgc2Vjb25kPTIyMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzIgIHNlY29uZD02NSAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzIgIHNlY29uZD0xOTIgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzIgIHNlY29uZD0xOTMgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzIgIHNlY29uZD0xOTQgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzIgIHNlY29uZD0xOTUgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzIgIHNlY29uZD0xOTYgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzIgIHNlY29uZD0xOTcgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzIgIHNlY29uZD04OCAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzMgIHNlY29uZD04NCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTczICBzZWNvbmQ9ODkgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MyAgc2Vjb25kPTIyMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzMgIHNlY29uZD02NSAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzMgIHNlY29uZD0xOTIgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzMgIHNlY29uZD0xOTMgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzMgIHNlY29uZD0xOTQgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzMgIHNlY29uZD0xOTUgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzMgIHNlY29uZD0xOTYgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzMgIHNlY29uZD0xOTcgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzMgIHNlY29uZD04OCAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NzQgIHNlY29uZD02NSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc0ICBzZWNvbmQ9MTkyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NCAgc2Vjb25kPTE5MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzQgIHNlY29uZD0xOTQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc0ICBzZWNvbmQ9MTk1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NCAgc2Vjb25kPTE5NiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzQgIHNlY29uZD0xOTcgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MTE4IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTEyMSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yNTMgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjU1IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTY3ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD03MSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9NzkgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTgxICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yMTYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MTk5IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTIxMCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yMTEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjEyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTIxMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yMTQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MTExIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTI0MiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yNDMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjQ0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTI0NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yNDYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MTE3IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTI0OSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yNTAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjUxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTI1MiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD05OSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MTAwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTEwMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0xMDMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MTEzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTIzMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yMzIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjMzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTIzNCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yMzUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9NDUgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTE3MyBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0xMDkgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MTEwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTExMiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yNDEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MTE4IGFtb3VudD0tMTBcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0xMjEgYW1vdW50PS0xMFxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTI1MyBhbW91bnQ9LTEwXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjU1IGFtb3VudD0tMTBcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD02NyAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9NzEgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTc5ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD04MSAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjE2IGFtb3VudD0tNVxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTE5OSBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yMTAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjExIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTIxMiBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yMTMgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjE0IGFtb3VudD0tNVxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTg1ICBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yMTcgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjE4IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTIxOSBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yMjAgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MzQgIGFtb3VudD0tMjZcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0zOSAgYW1vdW50PS0yNlxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTg3ICBhbW91bnQ9LTExXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9ODQgIGFtb3VudD0tMjFcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0xMTcgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjQ5IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTI1MCBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yNTEgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjUyIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTg2ICBhbW91bnQ9LTE0XG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9ODkgIGFtb3VudD0tMTlcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yMjEgYW1vdW50PS0xOVxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTY1ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTE5MiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTE5MyBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTE5NCBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTE5NSBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTE5NiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTE5NyBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03NyAgc2Vjb25kPTg0ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzcgIHNlY29uZD04OSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc3ICBzZWNvbmQ9MjIxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NyAgc2Vjb25kPTY1ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03NyAgc2Vjb25kPTE5MiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03NyAgc2Vjb25kPTE5MyBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03NyAgc2Vjb25kPTE5NCBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03NyAgc2Vjb25kPTE5NSBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03NyAgc2Vjb25kPTE5NiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03NyAgc2Vjb25kPTE5NyBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03NyAgc2Vjb25kPTg4ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03OCAgc2Vjb25kPTg0ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzggIHNlY29uZD04OSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc4ICBzZWNvbmQ9MjIxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03OCAgc2Vjb25kPTY1ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03OCAgc2Vjb25kPTE5MiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03OCAgc2Vjb25kPTE5MyBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03OCAgc2Vjb25kPTE5NCBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03OCAgc2Vjb25kPTE5NSBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03OCAgc2Vjb25kPTE5NiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03OCAgc2Vjb25kPTE5NyBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03OCAgc2Vjb25kPTg4ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTg0ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD04NiAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9ODkgIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTIyMSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD02NSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9MTkyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTE5MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD0xOTQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9MTk1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTE5NiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD0xOTcgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9ODggIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTQ0ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD00NiAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9OTAgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTExOCBhbW91bnQ9MVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTEyMSBhbW91bnQ9MVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTI1MyBhbW91bnQ9MVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTI1NSBhbW91bnQ9MVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTExMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yNDIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjQzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTI0NCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yNDUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTY1ICBhbW91bnQ9LTExXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MTkyIGFtb3VudD0tMTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0xOTMgYW1vdW50PS0xMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTE5NCBhbW91bnQ9LTExXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MTk1IGFtb3VudD0tMTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0xOTYgYW1vdW50PS0xMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTE5NyBhbW91bnQ9LTExXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9ODggIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTQ0ICBhbW91bnQ9LTI1XG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9NDYgIGFtb3VudD0tMjVcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD05MCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9OTkgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTEwMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0xMDEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MTAzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTExMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yMzEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjMyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTIzMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yMzQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjM1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTk3ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yMjQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjI1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTIyNiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yMjcgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjI4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTIyOSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD03NCAgYW1vdW50PS0xNlxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTExOCBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMjEgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjUzIGFtb3VudD0tNlxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTI1NSBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD02NyAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9NzEgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTc5ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD04MSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjE2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTE5OSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMTAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjExIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIxMiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjE0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTExMSBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yNDIgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjQzIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTI0NCBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yNDUgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjQ2IGFtb3VudD0tOFxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTg3ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTg0ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTExNyBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yNDkgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjUwIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTI1MSBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yNTIgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTIyIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTg2ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTg5ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIyMSBhbW91bnQ9MVxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTY1ICBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xOTIgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTkzIGFtb3VudD0tNlxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTE5NCBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xOTUgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTk2IGFtb3VudD0tNlxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTE5NyBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD00NCAgYW1vdW50PS0xN1xua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTQ2ICBhbW91bnQ9LTE3XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9OTkgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTEwMCBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMDEgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTAzIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTExMyBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMzEgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjMyIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIzMyBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMzQgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjM1IGFtb3VudD0tOFxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTEyMCBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD00NSAgYW1vdW50PS0xOFxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTE3MyBhbW91bnQ9LTE4XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTA5IGFtb3VudD0tOVxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTExMCBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMTIgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjQxIGFtb3VudD0tOVxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTgzICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD05NyAgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjI0IGFtb3VudD0tOVxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIyNSBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMjYgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjI3IGFtb3VudD0tOVxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIyOCBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMjkgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTE1IGFtb3VudD0tOVxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTc0ICBhbW91bnQ9LTE5XG5rZXJuaW5nIGZpcnN0PTg1ICBzZWNvbmQ9NjUgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NSAgc2Vjb25kPTE5MiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODUgIHNlY29uZD0xOTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg1ICBzZWNvbmQ9MTk0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NSAgc2Vjb25kPTE5NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODUgIHNlY29uZD0xOTYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg1ICBzZWNvbmQ9MTk3IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTExOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xMjEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjUzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTI1NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD02NyAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9NzEgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTc5ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD04MSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjE2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTE5OSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMTAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjExIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIxMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjE0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTExMSBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yNDIgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjQzIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTI0NCBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yNDUgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjQ2IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTExNyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yNDkgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjUwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTI1MSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yNTIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9NjUgIGFtb3VudD0tNlxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTE5MiBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xOTMgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTk0IGFtb3VudD0tNlxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTE5NSBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xOTYgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTk3IGFtb3VudD0tNlxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTQ0ICBhbW91bnQ9LTE4XG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9NDYgIGFtb3VudD0tMThcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD05OSAgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTAwIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTEwMSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xMDMgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTEzIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIzMSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMzIgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjMzIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIzNCBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMzUgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9NDUgIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTE3MyBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD05NyAgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjI0IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIyNSBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMjYgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjI3IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIyOCBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMjkgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MTExIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTI0MiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yNDMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjQ0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTI0NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yNDYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9ODQgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MTE3IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTI0OSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yNTAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjUxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTI1MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD02NSAgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MTkyIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTE5MyBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0xOTQgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MTk1IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTE5NiBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0xOTcgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9NDQgIGFtb3VudD0tMTBcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD00NiAgYW1vdW50PS0xMFxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTk5ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0xMDAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MTAxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTEwMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0xMTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjMxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTIzMiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yMzMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjM0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTIzNSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD00NSAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MTczIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTk3ICBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yMjQgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjI1IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTIyNiBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yMjcgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjI4IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTIyOSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0xMTggYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MTIxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTI1MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yNTUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9NjcgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTcxICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD03OSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9ODEgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTIxNiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0xOTkgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjEwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTIxMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yMTIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjEzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTIxNCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0xMTEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjQyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTI0MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yNDQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjQ1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTI0NiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0xMTcgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjQ5IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTI1MCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yNTEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjUyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTg2ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTk5ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0xMDAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MTAxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTEwMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0xMTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjMxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTIzMiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yMzMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjM0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTIzNSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD00NSAgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MTczIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTExOCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMjEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjUzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTI1NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD02NyAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9NzEgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTc5ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD04MSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjE2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTE5OSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMTAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjExIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIxMiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjE0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTg1ICBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMTcgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjE4IGFtb3VudD0tN1xua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIxOSBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMjAgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTExIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTI0MiBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yNDMgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjQ0IGFtb3VudD0tNVxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTI0NSBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yNDYgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9ODcgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9ODQgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTE3IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTI0OSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yNTAgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjUxIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTI1MiBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMjIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9ODYgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9ODkgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjIxIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9NjUgIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTE5MiBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xOTMgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTk0IGFtb3VudD0tN1xua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTE5NSBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xOTYgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTk3IGFtb3VudD0tN1xua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTg4ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTQ0ICBhbW91bnQ9LTE2XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9NDYgIGFtb3VudD0tMTZcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD05OSAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTAwIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTEwMSBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMDMgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTEzIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIzMSBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMzIgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjMzIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIzNCBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMzUgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTIwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTQ1ICBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xNzMgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTA5IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTExMCBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMTIgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjQxIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTgzICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD05NyAgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjI0IGFtb3VudD0tNlxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIyNSBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMjYgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjI3IGFtb3VudD0tNlxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIyOCBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMjkgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTE1IGFtb3VudD0tNVxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTc0ICBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xMTggYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTIxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTI1MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yNTUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9NjcgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTcxICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD03OSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9ODEgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTIxNiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xOTkgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjEwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTIxMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yMTIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjEzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTIxNCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xMTEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjQyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTI0MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yNDQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjQ1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTI0NiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xMTcgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTI1MCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yNTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjUyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTY1ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTE5MiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTE5MyBhbW91bnQ9MVxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTE5NCBhbW91bnQ9MVxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTE5NSBhbW91bnQ9MVxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTE5NiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTE5NyBhbW91bnQ9MVxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTk5ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xMDAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTAxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTEwMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xMTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjMxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTIzMiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yMzMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjM0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTIzNSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTcgIHNlY29uZD0xMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTk3ICBzZWNvbmQ9MTIxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD05NyAgc2Vjb25kPTI1MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9OTcgIHNlY29uZD0yNTUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTk3ICBzZWNvbmQ9MzQgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD05NyAgc2Vjb25kPTM5ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9OTggIHNlY29uZD0xMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTk4ICBzZWNvbmQ9MTIxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD05OCAgc2Vjb25kPTI1MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9OTggIHNlY29uZD0yNTUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTk4ICBzZWNvbmQ9MzQgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05OCAgc2Vjb25kPTM5ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTggIHNlY29uZD0xMjIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTk4ICBzZWNvbmQ9MTIwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD05OSAgc2Vjb25kPTM0ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9OTkgIHNlY29uZD0zOSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEwMSBzZWNvbmQ9MTE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMDEgc2Vjb25kPTEyMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTAxIHNlY29uZD0yNTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEwMSBzZWNvbmQ9MjU1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMDEgc2Vjb25kPTM0ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTAxIHNlY29uZD0zOSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEwNCBzZWNvbmQ9MzQgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0xMDQgc2Vjb25kPTM5ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MTA5IHNlY29uZD0zNCAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTEwOSBzZWNvbmQ9MzkgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0xMTAgc2Vjb25kPTM0ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MTEwIHNlY29uZD0zOSAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTExMSBzZWNvbmQ9MTE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTEyMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD0yNTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExMSBzZWNvbmQ9MjU1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTM0ICBhbW91bnQ9LTExXG5rZXJuaW5nIGZpcnN0PTExMSBzZWNvbmQ9MzkgIGFtb3VudD0tMTFcbmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD0xMjIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExMSBzZWNvbmQ9MTIwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTExOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTEyIHNlY29uZD0xMjEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExMiBzZWNvbmQ9MjUzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTI1NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTEyIHNlY29uZD0zNCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTExMiBzZWNvbmQ9MzkgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTEyMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTEyIHNlY29uZD0xMjAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MTE4IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MTIxIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjUzIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjU1IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MzQgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MzkgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MTExIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTI0MiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yNDMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjQ0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTI0NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yNDYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9NDQgIGFtb3VudD0tMTBcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD00NiAgYW1vdW50PS0xMFxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTk5ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0xMDAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MTAxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTEwMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0xMTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjMxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIzMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMzMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjM0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIzNSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD05NyAgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjI0IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIyNSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMjYgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjI3IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIyOCBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMjkgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MzQgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MzkgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MTExIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTI0MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yNDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTI0NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yNDYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9NDQgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTQ2ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD05OSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MTAwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTEwMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0xMDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MTEzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTIzMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yMzIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjMzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTIzNCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yMzUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9OTcgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTIyNCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yMjUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjI2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTIyNyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yMjggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjI5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTExMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0yNDIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MjQzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTI0NCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0yNDUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MjQ2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTk5ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0xMDAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MTAxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTEwMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0xMTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MjMxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTIzMiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0yMzMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MjM0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTIzNSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0zNCAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0zOSAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0xMTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjQyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTI0MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yNDQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTI0NiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD00NCAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9NDYgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTk5ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0xMDAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MTAxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTEwMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0xMTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjMxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTIzMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yMzMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjM0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTIzNSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD05NyAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjI0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTIyNSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yMjYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjI3IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTIyOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yMjkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MTExIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTI0MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0yNDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTI0NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0yNDYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9OTkgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTEwMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0xMDEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MTAzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTExMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0yMzEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MjMyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTIzMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0yMzQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MjM1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTQgc2Vjb25kPTExOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU0IHNlY29uZD0xMjEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NCBzZWNvbmQ9MjUzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTQgc2Vjb25kPTI1NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU0IHNlY29uZD0zNCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTI1NCBzZWNvbmQ9MzkgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yNTQgc2Vjb25kPTEyMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU0IHNlY29uZD0xMjAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9ODQgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTg2ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD04OSAgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9MjIxIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTY1ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD0xOTIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9MTkzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTE5NCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD0xOTUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9MTk2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTE5NyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD04OCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9NDQgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTQ2ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD05MCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MTE4IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTEyMSBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yNTMgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjU1IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTY3ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD03MSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9NzkgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTgxICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yMTYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MTk5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTIxMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yMTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjEyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTIxMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yMTQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9ODUgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTIxNyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjE5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTIyMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0zNCAgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MzkgIGFtb3VudD0tOVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTExMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yNDIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjQzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTI0NCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yNDUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTg3ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD04NCAgYW1vdW50PS0xMFxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTExNyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yNDkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjUwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTI1MSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yNTIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MTIyIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9ODYgIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTg5ICBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yMjEgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MTE4IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTEyMSBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yNTMgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjU1IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTY3ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD03MSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9NzkgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTgxICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yMTYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MTk5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTIxMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yMTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjEyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTIxMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yMTQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9ODUgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTIxNyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjE5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTIyMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0zNCAgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MzkgIGFtb3VudD0tOVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTExMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yNDIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjQzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTI0NCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yNDUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTg3ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD04NCAgYW1vdW50PS0xMFxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTExNyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yNDkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjUwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTI1MSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yNTIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MTIyIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9ODYgIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTg5ICBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yMjEgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MTE4IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTEyMSBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yNTMgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjU1IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTY3ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD03MSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9NzkgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTgxICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yMTYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MTk5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTIxMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yMTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjEyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTIxMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yMTQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9ODUgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTIxNyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjE5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTIyMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0zNCAgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MzkgIGFtb3VudD0tOVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTExMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yNDIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjQzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTI0NCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yNDUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTg3ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD04NCAgYW1vdW50PS0xMFxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTExNyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yNDkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjUwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTI1MSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yNTIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MTIyIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9ODYgIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTg5ICBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yMjEgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MTE4IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTEyMSBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yNTMgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjU1IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTY3ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD03MSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9NzkgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTgxICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yMTYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MTk5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTIxMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yMTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjEyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTIxMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yMTQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9ODUgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTIxNyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjE5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTIyMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0zNCAgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MzkgIGFtb3VudD0tOVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTExMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yNDIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjQzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTI0NCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yNDUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTg3ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD04NCAgYW1vdW50PS0xMFxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTExNyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yNDkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjUwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTI1MSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yNTIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MTIyIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9ODYgIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTg5ICBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yMjEgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MTE4IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTEyMSBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yNTMgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjU1IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTY3ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD03MSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9NzkgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTgxICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yMTYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MTk5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTIxMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yMTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjEyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTIxMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yMTQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9ODUgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTIxNyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjE5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTIyMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0zNCAgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MzkgIGFtb3VudD0tOVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTExMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yNDIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjQzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTI0NCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yNDUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTg3ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD04NCAgYW1vdW50PS0xMFxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTExNyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yNDkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjUwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTI1MSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yNTIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MTIyIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9ODYgIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTg5ICBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yMjEgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MTE4IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTEyMSBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yNTMgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjU1IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTY3ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD03MSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9NzkgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTgxICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yMTYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MTk5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTIxMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yMTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjEyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTIxMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yMTQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9ODUgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTIxNyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjE5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTIyMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0zNCAgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MzkgIGFtb3VudD0tOVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTExMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yNDIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjQzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTI0NCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yNDUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTg3ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD04NCAgYW1vdW50PS0xMFxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTExNyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yNDkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjUwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTI1MSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yNTIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MTIyIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9ODYgIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTg5ICBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yMjEgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTE5OSBzZWNvbmQ9ODQgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTExOCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0xMjEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjUzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTI1NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0xMTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjQyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTI0MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yNDQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTI0NiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD04NCAgYW1vdW50PTJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0xMTcgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTI1MCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yNTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjUyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTk5ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0xMDAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MTAxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTEwMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0xMTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjMxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTIzMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yMzMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjM0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTIzNSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0xMTggYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MTIxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTI1MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yNTUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MTExIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTI0MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yNDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTI0NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yNDYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9ODQgIGFtb3VudD0yXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MTE3IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTI0OSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yNTAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjUxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTI1MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD05OSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MTAwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTEwMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0xMDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MTEzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTIzMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yMzIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjMzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTIzNCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yMzUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MTE4IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTEyMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yNTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjU1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTExMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yNDIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjQzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTI0NCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yNDUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTg0ICBhbW91bnQ9Mlxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTExNyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yNDkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjUwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTI1MSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yNTIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9OTkgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTEwMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0xMDEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MTAzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTExMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yMzEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjMyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTIzMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yMzQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjM1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTExOCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0xMjEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjUzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTI1NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0xMTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjQyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTI0MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yNDQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTI0NiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD04NCAgYW1vdW50PTJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0xMTcgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTI1MCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yNTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjUyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTk5ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0xMDAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MTAxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTEwMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0xMTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjMxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTIzMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yMzMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjM0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTIzNSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjA0IHNlY29uZD04NCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwNCBzZWNvbmQ9ODkgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDQgc2Vjb25kPTIyMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjA0IHNlY29uZD02NSAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA0IHNlY29uZD0xOTIgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA0IHNlY29uZD0xOTMgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA0IHNlY29uZD0xOTQgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA0IHNlY29uZD0xOTUgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA0IHNlY29uZD0xOTYgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA0IHNlY29uZD0xOTcgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA0IHNlY29uZD04OCAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA1IHNlY29uZD04NCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwNSBzZWNvbmQ9ODkgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDUgc2Vjb25kPTIyMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjA1IHNlY29uZD02NSAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA1IHNlY29uZD0xOTIgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA1IHNlY29uZD0xOTMgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA1IHNlY29uZD0xOTQgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA1IHNlY29uZD0xOTUgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA1IHNlY29uZD0xOTYgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA1IHNlY29uZD0xOTcgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA1IHNlY29uZD04OCAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA2IHNlY29uZD04NCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwNiBzZWNvbmQ9ODkgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDYgc2Vjb25kPTIyMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjA2IHNlY29uZD02NSAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA2IHNlY29uZD0xOTIgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA2IHNlY29uZD0xOTMgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA2IHNlY29uZD0xOTQgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA2IHNlY29uZD0xOTUgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA2IHNlY29uZD0xOTYgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA2IHNlY29uZD0xOTcgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA2IHNlY29uZD04OCAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA3IHNlY29uZD04NCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwNyBzZWNvbmQ9ODkgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDcgc2Vjb25kPTIyMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjA3IHNlY29uZD02NSAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA3IHNlY29uZD0xOTIgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA3IHNlY29uZD0xOTMgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA3IHNlY29uZD0xOTQgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA3IHNlY29uZD0xOTUgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA3IHNlY29uZD0xOTYgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA3IHNlY29uZD0xOTcgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA3IHNlY29uZD04OCAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA5IHNlY29uZD04NCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwOSBzZWNvbmQ9ODkgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDkgc2Vjb25kPTIyMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjA5IHNlY29uZD02NSAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA5IHNlY29uZD0xOTIgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA5IHNlY29uZD0xOTMgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA5IHNlY29uZD0xOTQgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA5IHNlY29uZD0xOTUgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA5IHNlY29uZD0xOTYgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA5IHNlY29uZD0xOTcgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjA5IHNlY29uZD04OCAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD04NCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9ODYgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTg5ICBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD0yMjEgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9NjUgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTE5MiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD0xOTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9MTk0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTE5NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD0xOTYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9MTk3IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTg4ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD00NCAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9NDYgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTkwICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD04NCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9ODYgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTg5ICBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD0yMjEgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9NjUgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTE5MiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD0xOTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9MTk0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTE5NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD0xOTYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9MTk3IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTg4ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD00NCAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9NDYgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTkwICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD04NCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9ODYgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTg5ICBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD0yMjEgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9NjUgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTE5MiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD0xOTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9MTk0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTE5NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD0xOTYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9MTk3IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTg4ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD00NCAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9NDYgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTkwICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD04NCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9ODYgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTg5ICBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD0yMjEgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9NjUgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTE5MiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD0xOTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9MTk0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTE5NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD0xOTYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9MTk3IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTg4ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD00NCAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9NDYgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTkwICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD04NCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9ODYgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTg5ICBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD0yMjEgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9NjUgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTE5MiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD0xOTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9MTk0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTE5NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD0xOTYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9MTk3IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTg4ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD00NCAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9NDYgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTkwICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE3IHNlY29uZD02NSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxNyBzZWNvbmQ9MTkyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTcgc2Vjb25kPTE5MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE3IHNlY29uZD0xOTQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxNyBzZWNvbmQ9MTk1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTcgc2Vjb25kPTE5NiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE3IHNlY29uZD0xOTcgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxOCBzZWNvbmQ9NjUgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTggc2Vjb25kPTE5MiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE4IHNlY29uZD0xOTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxOCBzZWNvbmQ9MTk0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTggc2Vjb25kPTE5NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE4IHNlY29uZD0xOTYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxOCBzZWNvbmQ9MTk3IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTkgc2Vjb25kPTY1ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE5IHNlY29uZD0xOTIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxOSBzZWNvbmQ9MTkzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTkgc2Vjb25kPTE5NCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE5IHNlY29uZD0xOTUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxOSBzZWNvbmQ9MTk2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTkgc2Vjb25kPTE5NyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjIwIHNlY29uZD02NSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIyMCBzZWNvbmQ9MTkyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMjAgc2Vjb25kPTE5MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjIwIHNlY29uZD0xOTQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIyMCBzZWNvbmQ9MTk1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMjAgc2Vjb25kPTE5NiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjIwIHNlY29uZD0xOTcgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTE4IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTEyMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjU1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTY3ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD03MSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9NzkgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTgxICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMTYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTk5IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIxMCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMTEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjEyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIxMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMTQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9ODUgIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIxNyBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMTggYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjE5IGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIyMCBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMTEgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjQyIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI0MyBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNDQgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjQ1IGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI0NiBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD04NyAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD04NCAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMTcgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjQ5IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI1MCBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNTEgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjUyIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTEyMiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD04NiAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD04OSAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMjEgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD02NSAgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTkyIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTE5MyBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xOTQgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTk1IGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTE5NiBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xOTcgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9ODggIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9NDQgIGFtb3VudD0tMTZcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD00NiAgYW1vdW50PS0xNlxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTk5ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMDAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTAxIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTEwMyBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMTMgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjMxIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIzMiBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMzMgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjM0IGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIzNSBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMjAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9NDUgIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTE3MyBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMDkgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTEwIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTExMiBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNDEgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9ODMgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTk3ICBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMjQgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjI1IGFtb3VudD0tNlxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIyNiBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMjcgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjI4IGFtb3VudD0tNlxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIyOSBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMTUgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9NzQgIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0yMjQgc2Vjb25kPTExOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjI0IHNlY29uZD0xMjEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIyNCBzZWNvbmQ9MjUzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMjQgc2Vjb25kPTI1NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjI0IHNlY29uZD0zNCAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyNCBzZWNvbmQ9MzkgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjUgc2Vjb25kPTExOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjI1IHNlY29uZD0xMjEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIyNSBzZWNvbmQ9MjUzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMjUgc2Vjb25kPTI1NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjI1IHNlY29uZD0zNCAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyNSBzZWNvbmQ9MzkgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjYgc2Vjb25kPTExOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjI2IHNlY29uZD0xMjEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIyNiBzZWNvbmQ9MjUzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMjYgc2Vjb25kPTI1NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjI2IHNlY29uZD0zNCAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyNiBzZWNvbmQ9MzkgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjcgc2Vjb25kPTExOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjI3IHNlY29uZD0xMjEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIyNyBzZWNvbmQ9MjUzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMjcgc2Vjb25kPTI1NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjI3IHNlY29uZD0zNCAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyNyBzZWNvbmQ9MzkgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjggc2Vjb25kPTExOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjI4IHNlY29uZD0xMjEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIyOCBzZWNvbmQ9MjUzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMjggc2Vjb25kPTI1NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjI4IHNlY29uZD0zNCAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyOCBzZWNvbmQ9MzkgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjkgc2Vjb25kPTExOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjI5IHNlY29uZD0xMjEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIyOSBzZWNvbmQ9MjUzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMjkgc2Vjb25kPTI1NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjI5IHNlY29uZD0zNCAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyOSBzZWNvbmQ9MzkgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMzEgc2Vjb25kPTM0ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjMxIHNlY29uZD0zOSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIzMiBzZWNvbmQ9MTE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMzIgc2Vjb25kPTEyMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjMyIHNlY29uZD0yNTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIzMiBzZWNvbmQ9MjU1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMzIgc2Vjb25kPTM0ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjMyIHNlY29uZD0zOSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIzMyBzZWNvbmQ9MTE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMzMgc2Vjb25kPTEyMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjMzIHNlY29uZD0yNTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIzMyBzZWNvbmQ9MjU1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMzMgc2Vjb25kPTM0ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjMzIHNlY29uZD0zOSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIzNCBzZWNvbmQ9MTE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMzQgc2Vjb25kPTEyMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjM0IHNlY29uZD0yNTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIzNCBzZWNvbmQ9MjU1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMzQgc2Vjb25kPTM0ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjM0IHNlY29uZD0zOSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIzNSBzZWNvbmQ9MTE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMzUgc2Vjb25kPTEyMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjM1IHNlY29uZD0yNTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIzNSBzZWNvbmQ9MjU1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMzUgc2Vjb25kPTM0ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjM1IHNlY29uZD0zOSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI0MSBzZWNvbmQ9MzQgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0yNDEgc2Vjb25kPTM5ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MjQyIHNlY29uZD0xMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI0MiBzZWNvbmQ9MTIxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNDIgc2Vjb25kPTI1MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjQyIHNlY29uZD0yNTUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI0MiBzZWNvbmQ9MzQgIGFtb3VudD0tMTFcbmtlcm5pbmcgZmlyc3Q9MjQyIHNlY29uZD0zOSAgYW1vdW50PS0xMVxua2VybmluZyBmaXJzdD0yNDIgc2Vjb25kPTEyMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjQyIHNlY29uZD0xMjAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTI0MyBzZWNvbmQ9MTE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNDMgc2Vjb25kPTEyMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjQzIHNlY29uZD0yNTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI0MyBzZWNvbmQ9MjU1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNDMgc2Vjb25kPTM0ICBhbW91bnQ9LTExXG5rZXJuaW5nIGZpcnN0PTI0MyBzZWNvbmQ9MzkgIGFtb3VudD0tMTFcbmtlcm5pbmcgZmlyc3Q9MjQzIHNlY29uZD0xMjIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI0MyBzZWNvbmQ9MTIwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yNDQgc2Vjb25kPTExOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjQ0IHNlY29uZD0xMjEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI0NCBzZWNvbmQ9MjUzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNDQgc2Vjb25kPTI1NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjQ0IHNlY29uZD0zNCAgYW1vdW50PS0xMVxua2VybmluZyBmaXJzdD0yNDQgc2Vjb25kPTM5ICBhbW91bnQ9LTExXG5rZXJuaW5nIGZpcnN0PTI0NCBzZWNvbmQ9MTIyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNDQgc2Vjb25kPTEyMCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjQ1IHNlY29uZD0xMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI0NSBzZWNvbmQ9MTIxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNDUgc2Vjb25kPTI1MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjQ1IHNlY29uZD0yNTUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI0NSBzZWNvbmQ9MzQgIGFtb3VudD0tMTFcbmtlcm5pbmcgZmlyc3Q9MjQ1IHNlY29uZD0zOSAgYW1vdW50PS0xMVxua2VybmluZyBmaXJzdD0yNDUgc2Vjb25kPTEyMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjQ1IHNlY29uZD0xMjAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTI0NiBzZWNvbmQ9MTE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNDYgc2Vjb25kPTEyMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjQ2IHNlY29uZD0yNTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI0NiBzZWNvbmQ9MjU1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNDYgc2Vjb25kPTM0ICBhbW91bnQ9LTExXG5rZXJuaW5nIGZpcnN0PTI0NiBzZWNvbmQ9MzkgIGFtb3VudD0tMTFcbmtlcm5pbmcgZmlyc3Q9MjQ2IHNlY29uZD0xMjIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI0NiBzZWNvbmQ9MTIwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTM0ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTM5ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTExMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yNDIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjQzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTI0NCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yNDUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTQ0ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD00NiAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9OTkgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTEwMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0xMDEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MTAzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTExMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yMzEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjMyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTIzMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yMzQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjM1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTk3ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yMjQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjI1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTIyNiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yMjcgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjI4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTIyOSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0zNCAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0zOSAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0xMTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjQyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTI0MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yNDQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTI0NiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD00NCAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9NDYgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTk5ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0xMDAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MTAxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTEwMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0xMTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjMxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTIzMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yMzMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjM0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTIzNSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD05NyAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjI0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTIyNSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yMjYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjI3IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTIyOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yMjkgYW1vdW50PS0xXG5gO1xufSIsIi8qKlxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcbipcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXG4qXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbipcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cblxuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ID0ge30gKXtcblxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBwYW5lbCApO1xuXG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGhhbmRsZU9uUHJlc3MgKTtcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAndGljaycsIGhhbmRsZVRpY2sgKTtcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25SZWxlYXNlZCcsIGhhbmRsZU9uUmVsZWFzZSApO1xuXG4gIGNvbnN0IHRlbXBNYXRyaXggPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xuICBjb25zdCB0UG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuXG4gIGxldCBvbGRQYXJlbnQ7XG4gIFxuICBmdW5jdGlvbiBnZXRUb3BMZXZlbEZvbGRlcihncm91cCkge1xuICAgIHZhciBmb2xkZXIgPSBncm91cC5mb2xkZXI7XG4gICAgd2hpbGUgKGZvbGRlci5mb2xkZXIgIT09IGZvbGRlcikgZm9sZGVyID0gZm9sZGVyLmZvbGRlcjtcbiAgICByZXR1cm4gZm9sZGVyO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlVGljayggeyBpbnB1dCB9ID0ge30gKXtcbiAgICBjb25zdCBmb2xkZXIgPSBnZXRUb3BMZXZlbEZvbGRlcihncm91cCk7XG4gICAgaWYoIGZvbGRlciA9PT0gdW5kZWZpbmVkICl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYoIGlucHV0Lm1vdXNlICl7XG4gICAgICBpZiggaW5wdXQucHJlc3NlZCAmJiBpbnB1dC5zZWxlY3RlZCAmJiBpbnB1dC5yYXljYXN0LnJheS5pbnRlcnNlY3RQbGFuZSggaW5wdXQubW91c2VQbGFuZSwgaW5wdXQubW91c2VJbnRlcnNlY3Rpb24gKSApe1xuICAgICAgICBpZiggaW5wdXQuaW50ZXJhY3Rpb24ucHJlc3MgPT09IGludGVyYWN0aW9uICl7XG4gICAgICAgICAgaW5wdXQubW91c2VJbnRlcnNlY3Rpb24uc3ViKCBpbnB1dC5tb3VzZU9mZnNldCApO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICBpbnB1dC5zZWxlY3RlZC5wYXJlbnQudXBkYXRlTWF0cml4V29ybGQoKTsgICAgICAgICAgXG4gICAgICAgICAgaW5wdXQuc2VsZWN0ZWQucGFyZW50LndvcmxkVG9Mb2NhbChpbnB1dC5tb3VzZUludGVyc2VjdGlvbik7XG5cbiAgICAgICAgICBmb2xkZXIucG9zaXRpb24uY29weShpbnB1dC5tb3VzZUludGVyc2VjdGlvbik7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYoIGlucHV0LmludGVyc2VjdGlvbnMubGVuZ3RoID4gMCApe1xuICAgICAgICBjb25zdCBoaXRPYmplY3QgPSBpbnB1dC5pbnRlcnNlY3Rpb25zWyAwIF0ub2JqZWN0O1xuICAgICAgICBpZiggaGl0T2JqZWN0ID09PSBwYW5lbCApe1xuICAgICAgICAgIGhpdE9iamVjdC51cGRhdGVNYXRyaXhXb3JsZCgpO1xuICAgICAgICAgIHRQb3NpdGlvbi5zZXRGcm9tTWF0cml4UG9zaXRpb24oIGhpdE9iamVjdC5tYXRyaXhXb3JsZCApO1xuXG4gICAgICAgICAgaW5wdXQubW91c2VQbGFuZS5zZXRGcm9tTm9ybWFsQW5kQ29wbGFuYXJQb2ludCggaW5wdXQubW91c2VDYW1lcmEuZ2V0V29ybGREaXJlY3Rpb24oIGlucHV0Lm1vdXNlUGxhbmUubm9ybWFsICksIHRQb3NpdGlvbiApO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCBpbnB1dC5tb3VzZVBsYW5lICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cblxuXG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVPblByZXNzKCBwICl7XG5cbiAgICBsZXQgeyBpbnB1dE9iamVjdCwgaW5wdXQgfSA9IHA7XG5cbiAgICBjb25zdCBmb2xkZXIgPSBnZXRUb3BMZXZlbEZvbGRlcihncm91cCk7XG4gICAgaWYoIGZvbGRlciA9PT0gdW5kZWZpbmVkICl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYoIGZvbGRlci5iZWluZ01vdmVkID09PSB0cnVlICl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYoIGlucHV0Lm1vdXNlICl7XG4gICAgICBpZiggaW5wdXQuaW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwICl7XG4gICAgICAgIGlmKCBpbnB1dC5yYXljYXN0LnJheS5pbnRlcnNlY3RQbGFuZSggaW5wdXQubW91c2VQbGFuZSwgaW5wdXQubW91c2VJbnRlcnNlY3Rpb24gKSApe1xuICAgICAgICAgIGNvbnN0IGhpdE9iamVjdCA9IGlucHV0LmludGVyc2VjdGlvbnNbIDAgXS5vYmplY3Q7XG4gICAgICAgICAgaWYoIGhpdE9iamVjdCAhPT0gcGFuZWwgKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpbnB1dC5zZWxlY3RlZCA9IGZvbGRlcjtcblxuICAgICAgICAgIGlucHV0LnNlbGVjdGVkLnVwZGF0ZU1hdHJpeFdvcmxkKCk7XG4gICAgICAgICAgdFBvc2l0aW9uLnNldEZyb21NYXRyaXhQb3NpdGlvbiggaW5wdXQuc2VsZWN0ZWQubWF0cml4V29ybGQgKTtcblxuICAgICAgICAgIGlucHV0Lm1vdXNlT2Zmc2V0LmNvcHkoIGlucHV0Lm1vdXNlSW50ZXJzZWN0aW9uICkuc3ViKCB0UG9zaXRpb24gKTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyggaW5wdXQubW91c2VPZmZzZXQgKTtcblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZWxzZXtcbiAgICAgIHRlbXBNYXRyaXguZ2V0SW52ZXJzZSggaW5wdXRPYmplY3QubWF0cml4V29ybGQgKTtcblxuICAgICAgZm9sZGVyLm1hdHJpeC5wcmVtdWx0aXBseSggdGVtcE1hdHJpeCApO1xuICAgICAgZm9sZGVyLm1hdHJpeC5kZWNvbXBvc2UoIGZvbGRlci5wb3NpdGlvbiwgZm9sZGVyLnF1YXRlcm5pb24sIGZvbGRlci5zY2FsZSApO1xuXG4gICAgICBvbGRQYXJlbnQgPSBmb2xkZXIucGFyZW50O1xuICAgICAgaW5wdXRPYmplY3QuYWRkKCBmb2xkZXIgKTtcbiAgICB9XG5cbiAgICBwLmxvY2tlZCA9IHRydWU7XG5cbiAgICBmb2xkZXIuYmVpbmdNb3ZlZCA9IHRydWU7XG5cbiAgICBpbnB1dC5ldmVudHMuZW1pdCggJ2dyYWJiZWQnLCBpbnB1dCApO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlT25SZWxlYXNlKCBwICl7XG5cbiAgICBsZXQgeyBpbnB1dE9iamVjdCwgaW5wdXQgfSA9IHA7XG5cbiAgICBjb25zdCBmb2xkZXIgPSBnZXRUb3BMZXZlbEZvbGRlcihncm91cCk7XG4gICAgaWYoIGZvbGRlciA9PT0gdW5kZWZpbmVkICl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYoIGZvbGRlci5iZWluZ01vdmVkID09PSBmYWxzZSApe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmKCBpbnB1dC5tb3VzZSApe1xuICAgICAgaW5wdXQuc2VsZWN0ZWQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGVsc2V7XG5cbiAgICAgIGlmKCBvbGRQYXJlbnQgPT09IHVuZGVmaW5lZCApe1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGZvbGRlci5tYXRyaXgucHJlbXVsdGlwbHkoIGlucHV0T2JqZWN0Lm1hdHJpeFdvcmxkICk7XG4gICAgICBmb2xkZXIubWF0cml4LmRlY29tcG9zZSggZm9sZGVyLnBvc2l0aW9uLCBmb2xkZXIucXVhdGVybmlvbiwgZm9sZGVyLnNjYWxlICk7XG4gICAgICBvbGRQYXJlbnQuYWRkKCBmb2xkZXIgKTtcbiAgICAgIG9sZFBhcmVudCA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBmb2xkZXIuYmVpbmdNb3ZlZCA9IGZhbHNlO1xuXG4gICAgaW5wdXQuZXZlbnRzLmVtaXQoICdncmFiUmVsZWFzZWQnLCBpbnB1dCApO1xuICB9XG5cbiAgcmV0dXJuIGludGVyYWN0aW9uO1xufSIsImV4cG9ydCBjb25zdCBncmFiQmFyID0gKGZ1bmN0aW9uKCl7XG4gIGNvbnN0IGltYWdlID0gbmV3IEltYWdlKCk7XG4gIGltYWdlLnNyYyA9IGBkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVBQUFBQWdDQVlBQUFDaW5YNkVBQUFBQ1hCSVdYTUFBQzRqQUFBdUl3RjRwVDkyQUFBS1QybERRMUJRYUc5MGIzTm9iM0FnU1VORElIQnliMlpwYkdVQUFIamFuVk5uVkZQcEZqMzMzdlJDUzRpQWxFdHZVaFVJSUZKQ2k0QVVrU1lxSVFrUVNvZ2hvZGtWVWNFUlJVVUVHOGlnaUFPT2pvQ01GVkVzRElvSzJBZmtJYUtPZzZPSWlzcjc0WHVqYTlhODkrYk4vclhYUHVlczg1Mnp6d2ZBQ0F5V1NETlJOWUFNcVVJZUVlQ0R4OFRHNGVRdVFJRUtKSEFBRUFpelpDRnovU01CQVBoK1BEd3JJc0FIdmdBQmVOTUxDQURBVFp2QU1CeUgvdy9xUXBsY0FZQ0VBY0Iwa1RoTENJQVVBRUI2amtLbUFFQkdBWUNkbUNaVEFLQUVBR0RMWTJMakFGQXRBR0FuZitiVEFJQ2QrSmw3QVFCYmxDRVZBYUNSQUNBVFpZaEVBR2c3QUt6UFZvcEZBRmd3QUJSbVM4UTVBTmd0QURCSlYyWklBTEMzQU1ET0VBdXlBQWdNQURCUmlJVXBBQVI3QUdESUl5TjRBSVNaQUJSRzhsYzg4U3V1RU9jcUFBQjRtYkk4dVNRNVJZRmJDQzF4QjFkWExoNG96a2tYS3hRMllRSmhta0F1d25tWkdUS0JOQS9nODh3QUFLQ1JGUkhnZy9QOWVNNE9yczdPTm82MkRsOHQ2cjhHL3lKaVl1UCs1YytyY0VBQUFPRjBmdEgrTEMrekdvQTdCb0J0L3FJbDdnUm9YZ3VnZGZlTFpySVBRTFVBb09uYVYvTncrSDQ4UEVXaGtMbloyZVhrNU5oS3hFSmJZY3BYZmY1bndsL0FWLzFzK1g0OC9QZjE0TDdpSklFeVhZRkhCUGpnd3N6MFRLVWN6NUlKaEdMYzVvOUgvTGNMLy93ZDB5TEVTV0s1V0NvVTQxRVNjWTVFbW96ek1xVWlpVUtTS2NVbDB2OWs0dDhzK3dNKzN6VUFzR28rQVh1UkxhaGRZd1AyU3ljUVdIVEE0dmNBQVBLN2I4SFVLQWdEZ0dpRDRjOTMvKzgvL1VlZ0pRQ0Faa21TY1FBQVhrUWtMbFRLc3ovSENBQUFSS0NCS3JCQkcvVEJHQ3pBQmh6QkJkekJDL3hnTm9SQ0pNVENRaEJDQ21TQUhISmdLYXlDUWlpR3piQWRLbUF2MUVBZE5NQlJhSWFUY0E0dXdsVzREajF3RC9waENKN0JLTHlCQ1FSQnlBZ1RZU0hhaUFGaWlsZ2pqZ2dYbVlYNEljRklCQktMSkNESmlCUlJJa3VSTlVneFVvcFVJRlZJSGZJOWNnSTVoMXhHdXBFN3lBQXlndnlHdkVjeGxJR3lVVDNVRExWRHVhZzNHb1JHb2d2UVpIUXhtbzhXb0p2UWNyUWFQWXcyb2VmUXEyZ1AybzgrUThjd3dPZ1lCelBFYkRBdXhzTkNzVGdzQ1pOank3RWlyQXlyeGhxd1Zxd0R1NG4xWTgreGR3UVNnVVhBQ1RZRWQwSWdZUjVCU0ZoTVdFN1lTS2dnSENRMEVkb0pOd2tEaEZIQ0p5S1RxRXUwSnJvUitjUVlZakl4aDFoSUxDUFdFbzhUTHhCN2lFUEVOeVFTaVVNeUo3bVFBa214cEZUU0V0SkcwbTVTSStrc3FaczBTQm9qazhuYVpHdXlCem1VTENBcnlJWGtuZVRENURQa0crUWg4bHNLbldKQWNhVDRVK0lvVXNwcVNobmxFT1UwNVFabG1ESkJWYU9hVXQyb29WUVJOWTlhUXEyaHRsS3ZVWWVvRXpSMW1qbk5neFpKUzZXdG9wWFRHbWdYYVBkcHIraDB1aEhkbFI1T2w5Qlgwc3ZwUitpWDZBUDBkd3dOaGhXRHg0aG5LQm1iR0FjWVp4bDNHSytZVEtZWjA0c1p4MVF3TnpIcm1PZVpENWx2VlZncXRpcDhGWkhLQ3BWS2xTYVZHeW92VkttcXBxcmVxZ3RWODFYTFZJK3BYbE45cmtaVk0xUGpxUW5VbHF0VnFwMVE2MU1iVTJlcE82aUhxbWVvYjFRL3BINVovWWtHV2NOTXcwOURwRkdnc1YvanZNWWdDMk1aczNnc0lXc05xNFoxZ1RYRUpySE4yWHgyS3J1WS9SMjdpejJxcWFFNVF6TktNMWV6VXZPVVpqOEg0NWh4K0p4MFRnbm5LS2VYODM2SzNoVHZLZUlwRzZZMFRMa3haVnhycXBhWGxsaXJTS3RScTBmcnZUYXU3YWVkcHIxRnUxbjdnUTVCeDBvblhDZEhaNC9PQlozblU5bFQzYWNLcHhaTlBUcjFyaTZxYTZVYm9idEVkNzl1cCs2WW5yNWVnSjVNYjZmZWViM24raHg5TC8xVS9XMzZwL1ZIREZnR3N3d2tCdHNNemhnOHhUVnhiendkTDhmYjhWRkRYY05BUTZWaGxXR1g0WVNSdWRFOG85VkdqVVlQakduR1hPTWs0MjNHYmNhakpnWW1JU1pMVGVwTjdwcFNUYm1tS2FZN1REdE14ODNNemFMTjFwazFtejB4MXpMbm0rZWIxNXZmdDJCYWVGb3N0cWkydUdWSnN1UmFwbG51dHJ4dWhWbzVXYVZZVlZwZHMwYXRuYTBsMXJ1dHU2Y1JwN2xPazA2cm50Wm53N0R4dHNtMnFiY1pzT1hZQnR1dXRtMjJmV0ZuWWhkbnQ4V3V3KzZUdlpOOXVuMk4vVDBIRFlmWkRxc2RXaDErYzdSeUZEcFdPdDZhenB6dVAzM0Y5SmJwTDJkWXp4RFAyRFBqdGhQTEtjUnBuVk9iMDBkbkYyZTVjNFB6aUl1SlM0TExMcGMrTHBzYnh0M0l2ZVJLZFBWeFhlRjYwdldkbTdPYnd1Mm8yNi91TnU1cDdvZmNuOHcwbnltZVdUTnowTVBJUStCUjVkRS9DNStWTUd2ZnJINVBRMCtCWjdYbkl5OWpMNUZYcmRld3Q2VjNxdmRoN3hjKzlqNXluK00rNHp3MzNqTGVXVi9NTjhDM3lMZkxUOE52bmwrRjMwTi9JLzlrLzNyLzBRQ25nQ1VCWndPSmdVR0JXd0w3K0hwOEliK09QenJiWmZheTJlMUJqS0M1UVJWQmo0S3RndVhCclNGb3lPeVFyU0gzNTVqT2tjNXBEb1ZRZnVqVzBBZGg1bUdMdzM0TUo0V0hoVmVHUDQ1d2lGZ2EwVEdYTlhmUjNFTnozMFQ2UkpaRTNwdG5NVTg1cnkxS05TbytxaTVxUE5vM3VqUzZQOFl1WmxuTTFWaWRXRWxzU3h3NUxpcXVObTVzdnQvODdmT0g0cDNpQytON0Y1Z3Z5RjF3ZWFIT3d2U0ZweGFwTGhJc09wWkFUSWhPT0pUd1FSQXFxQmFNSmZJVGR5V09Dbm5DSGNKbklpL1JOdEdJMkVOY0toNU84a2dxVFhxUzdKRzhOWGtreFRPbExPVzVoQ2Vwa0x4TURVemRtenFlRnBwMklHMHlQVHE5TVlPU2taQnhRcW9oVFpPMlorcG41bVoyeTZ4bGhiTCt4VzZMdHk4ZWxRZkphN09RckFWWkxRcTJRcWJvVkZvbzF5b0hzbWRsVjJhL3pZbktPWmFybml2TjdjeXp5dHVRTjV6dm4vL3RFc0lTNFpLMnBZWkxWeTBkV09hOXJHbzVzanh4ZWRzSzR4VUZLNFpXQnF3OHVJcTJLbTNWVDZ2dFY1ZXVmcjBtZWsxcmdWN0J5b0xCdFFGcjZ3dFZDdVdGZmV2YzErMWRUMWd2V2QrMVlmcUduUnMrRlltS3JoVGJGNWNWZjlnbzNIamxHNGR2eXIrWjNKUzBxYXZFdVdUUFp0Sm02ZWJlTFo1YkRwYXFsK2FYRG00TjJkcTBEZDlXdE8zMTlrWGJMNWZOS051N2c3WkR1YU8vUExpOFphZkp6czA3UDFTa1ZQUlUrbFEyN3RMZHRXSFgrRzdSN2h0N3ZQWTA3TlhiVzd6My9UN0p2dHRWQVZWTjFXYlZaZnRKKzdQM1A2NkpxdW40bHZ0dFhhMU9iWEh0eHdQU0EvMEhJdzYyMTduVTFSM1NQVlJTajlZcjYwY094eCsrL3AzdmR5ME5OZzFWalp6RzRpTndSSG5rNmZjSjMvY2VEVHJhZG94N3JPRUgweDkySFdjZEwycENtdkthUnB0VG12dGJZbHU2VDh3KzBkYnEzbnI4UjlzZkQ1dzBQRmw1U3ZOVXlXbmE2WUxUazJmeXo0eWRsWjE5Zmk3NTNHRGJvclo3NTJQTzMyb1BiKys2RUhUaDBrWC9pK2M3dkR2T1hQSzRkUEt5MitVVFY3aFhtcTg2WDIzcWRPbzgvcFBUVDhlN25MdWFycmxjYTdudWVyMjFlMmIzNlJ1ZU44N2Q5TDE1OFJiLzF0V2VPVDNkdmZONmIvZkY5L1hmRnQxK2NpZjl6c3U3MlhjbjdxMjhUN3hmOUVEdFFkbEQzWWZWUDF2KzNOanYzSDlxd0hlZzg5SGNSL2NHaFlQUC9wSDFqdzlEQlkrWmo4dUdEWWJybmpnK09UbmlQM0w5NmZ5blE4OWt6eWFlRi82aS9zdXVGeFl2ZnZqVjY5Zk8wWmpSb1pmeWw1Ty9iWHlsL2VyQTZ4bXYyOGJDeGg2K3lYZ3pNVjcwVnZ2dHdYZmNkeDN2bzk4UFQrUjhJSDhvLzJqNXNmVlQwS2Y3a3htVGsvOEVBNWp6L0dNekxkc0FBRHNrYVZSWWRGaE5URHBqYjIwdVlXUnZZbVV1ZUcxd0FBQUFBQUE4UDNod1lXTnJaWFFnWW1WbmFXNDlJdSs3dnlJZ2FXUTlJbGMxVFRCTmNFTmxhR2xJZW5KbFUzcE9WR042YTJNNVpDSS9QZ284ZURwNGJYQnRaWFJoSUhodGJHNXpPbmc5SW1Ga2IySmxPbTV6T20xbGRHRXZJaUI0T25odGNIUnJQU0pCWkc5aVpTQllUVkFnUTI5eVpTQTFMall0WXpFek1pQTNPUzR4TlRreU9EUXNJREl3TVRZdk1EUXZNVGt0TVRNNk1UTTZOREFnSUNBZ0lDQWdJQ0krQ2lBZ0lEeHlaR1k2VWtSR0lIaHRiRzV6T25Ka1pqMGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNVGs1T1M4d01pOHlNaTF5WkdZdGMzbHVkR0Y0TFc1ekl5SStDaUFnSUNBZ0lEeHlaR1k2UkdWelkzSnBjSFJwYjI0Z2NtUm1PbUZpYjNWMFBTSWlDaUFnSUNBZ0lDQWdJQ0FnSUhodGJHNXpPbmh0Y0QwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0x5SUtJQ0FnSUNBZ0lDQWdJQ0FnZUcxc2JuTTZaR005SW1oMGRIQTZMeTl3ZFhKc0xtOXlaeTlrWXk5bGJHVnRaVzUwY3k4eExqRXZJZ29nSUNBZ0lDQWdJQ0FnSUNCNGJXeHVjenB3YUc5MGIzTm9iM0E5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmNHaHZkRzl6YUc5d0x6RXVNQzhpQ2lBZ0lDQWdJQ0FnSUNBZ0lIaHRiRzV6T25odGNFMU5QU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNoaGNDOHhMakF2Ylcwdklnb2dJQ0FnSUNBZ0lDQWdJQ0I0Yld4dWN6cHpkRVYyZEQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wzTlVlWEJsTDFKbGMyOTFjbU5sUlhabGJuUWpJZ29nSUNBZ0lDQWdJQ0FnSUNCNGJXeHVjenAwYVdabVBTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM1JwWm1Zdk1TNHdMeUlLSUNBZ0lDQWdJQ0FnSUNBZ2VHMXNibk02WlhocFpqMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzlsZUdsbUx6RXVNQzhpUGdvZ0lDQWdJQ0FnSUNBOGVHMXdPa055WldGMGIzSlViMjlzUGtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBeU1ERTFMalVnS0ZkcGJtUnZkM01wUEM5NGJYQTZRM0psWVhSdmNsUnZiMncrQ2lBZ0lDQWdJQ0FnSUR4NGJYQTZRM0psWVhSbFJHRjBaVDR5TURFMkxUQTVMVEk0VkRFMk9qSTFPak15TFRBM09qQXdQQzk0YlhBNlEzSmxZWFJsUkdGMFpUNEtJQ0FnSUNBZ0lDQWdQSGh0Y0RwTmIyUnBabmxFWVhSbFBqSXdNVFl0TURrdE1qaFVNVFk2TXpjNk1qTXRNRGM2TURBOEwzaHRjRHBOYjJScFpubEVZWFJsUGdvZ0lDQWdJQ0FnSUNBOGVHMXdPazFsZEdGa1lYUmhSR0YwWlQ0eU1ERTJMVEE1TFRJNFZERTJPak0zT2pJekxUQTNPakF3UEM5NGJYQTZUV1YwWVdSaGRHRkVZWFJsUGdvZ0lDQWdJQ0FnSUNBOFpHTTZabTl5YldGMFBtbHRZV2RsTDNCdVp6d3ZaR002Wm05eWJXRjBQZ29nSUNBZ0lDQWdJQ0E4Y0dodmRHOXphRzl3T2tOdmJHOXlUVzlrWlQ0elBDOXdhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQZ29nSUNBZ0lDQWdJQ0E4Y0dodmRHOXphRzl3T2tsRFExQnliMlpwYkdVK2MxSkhRaUJKUlVNMk1UazJOaTB5TGpFOEwzQm9iM1J2YzJodmNEcEpRME5RY205bWFXeGxQZ29nSUNBZ0lDQWdJQ0E4ZUcxd1RVMDZTVzV6ZEdGdVkyVkpSRDU0YlhBdWFXbGtPbUZoWVRGak1UUXpMVFV3Wm1VdE9UUTBNeTFoTlRobUxXRXlNMlZrTlRNM01EZG1NRHd2ZUcxd1RVMDZTVzV6ZEdGdVkyVkpSRDRLSUNBZ0lDQWdJQ0FnUEhodGNFMU5Pa1J2WTNWdFpXNTBTVVErWVdSdlltVTZaRzlqYVdRNmNHaHZkRzl6YUc5d09qZGxOemRtWW1aakxUZzFaRFF0TVRGbE5pMWhZemhtTFdGak56VTBaV1ExT0RNM1pqd3ZlRzF3VFUwNlJHOWpkVzFsYm5SSlJENEtJQ0FnSUNBZ0lDQWdQSGh0Y0UxTk9rOXlhV2RwYm1Gc1JHOWpkVzFsYm5SSlJENTRiWEF1Wkdsa09tTTFabU0wWkdZeUxUa3hZMk10WlRJME1TMDRZMlZqTFRNek9ESXlZMlExWldGbE9Ud3ZlRzF3VFUwNlQzSnBaMmx1WVd4RWIyTjFiV1Z1ZEVsRVBnb2dJQ0FnSUNBZ0lDQThlRzF3VFUwNlNHbHpkRzl5ZVQ0S0lDQWdJQ0FnSUNBZ0lDQWdQSEprWmpwVFpYRStDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHlaR1k2YkdrZ2NtUm1PbkJoY25ObFZIbHdaVDBpVW1WemIzVnlZMlVpUGdvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGMzUkZkblE2WVdOMGFXOXVQbU55WldGMFpXUThMM04wUlhaME9tRmpkR2x2Ymo0S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITjBSWFowT21sdWMzUmhibU5sU1VRK2VHMXdMbWxwWkRwak5XWmpOR1JtTWkwNU1XTmpMV1V5TkRFdE9HTmxZeTB6TXpneU1tTmtOV1ZoWlRrOEwzTjBSWFowT21sdWMzUmhibU5sU1VRK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpkRVYyZERwM2FHVnVQakl3TVRZdE1Ea3RNamhVTVRZNk1qVTZNekl0TURjNk1EQThMM04wUlhaME9uZG9aVzQrQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QXlNREUxTGpVZ0tGZHBibVJ2ZDNNcFBDOXpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQZ29nSUNBZ0lDQWdJQ0FnSUNBZ0lDQThMM0prWmpwc2FUNEtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BISmtaanBzYVNCeVpHWTZjR0Z5YzJWVWVYQmxQU0pTWlhOdmRYSmpaU0krQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emRFVjJkRHBoWTNScGIyNCtZMjl1ZG1WeWRHVmtQQzl6ZEVWMmREcGhZM1JwYjI0K0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpkRVYyZERwd1lYSmhiV1YwWlhKelBtWnliMjBnWVhCd2JHbGpZWFJwYjI0dmRtNWtMbUZrYjJKbExuQm9iM1J2YzJodmNDQjBieUJwYldGblpTOXdibWM4TDNOMFJYWjBPbkJoY21GdFpYUmxjbk0rQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2Y21SbU9teHBQZ29nSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjbVJtT214cElISmtaanB3WVhKelpWUjVjR1U5SWxKbGMyOTFjbU5sSWo0S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITjBSWFowT21GamRHbHZiajV6WVhabFpEd3ZjM1JGZG5RNllXTjBhVzl1UGdvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGMzUkZkblE2YVc1emRHRnVZMlZKUkQ1NGJYQXVhV2xrT21GaFlURmpNVFF6TFRVd1ptVXRPVFEwTXkxaE5UaG1MV0V5TTJWa05UTTNNRGRtTUR3dmMzUkZkblE2YVc1emRHRnVZMlZKUkQ0S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITjBSWFowT25kb1pXNCtNakF4Tmkwd09TMHlPRlF4Tmpvek56b3lNeTB3Tnpvd01Ed3ZjM1JGZG5RNmQyaGxiajRLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5RK1FXUnZZbVVnVUdodmRHOXphRzl3SUVORElESXdNVFV1TlNBb1YybHVaRzkzY3lrOEwzTjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUStDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6ZEVWMmREcGphR0Z1WjJWa1BpODhMM04wUlhaME9tTm9ZVzVuWldRK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dmNtUm1PbXhwUGdvZ0lDQWdJQ0FnSUNBZ0lDQThMM0prWmpwVFpYRStDaUFnSUNBZ0lDQWdJRHd2ZUcxd1RVMDZTR2x6ZEc5eWVUNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNlQzSnBaVzUwWVhScGIyNCtNVHd2ZEdsbVpqcFBjbWxsYm5SaGRHbHZiajRLSUNBZ0lDQWdJQ0FnUEhScFptWTZXRkpsYzI5c2RYUnBiMjQrTXpBd01EQXdNQzh4TURBd01Ed3ZkR2xtWmpwWVVtVnpiMngxZEdsdmJqNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNldWSmxjMjlzZFhScGIyNCtNekF3TURBd01DOHhNREF3TUR3dmRHbG1aanBaVW1WemIyeDFkR2x2Ymo0S0lDQWdJQ0FnSUNBZ1BIUnBabVk2VW1WemIyeDFkR2x2YmxWdWFYUStNand2ZEdsbVpqcFNaWE52YkhWMGFXOXVWVzVwZEQ0S0lDQWdJQ0FnSUNBZ1BHVjRhV1k2UTI5c2IzSlRjR0ZqWlQ0eFBDOWxlR2xtT2tOdmJHOXlVM0JoWTJVK0NpQWdJQ0FnSUNBZ0lEeGxlR2xtT2xCcGVHVnNXRVJwYldWdWMybHZiajQyTkR3dlpYaHBaanBRYVhobGJGaEVhVzFsYm5OcGIyNCtDaUFnSUNBZ0lDQWdJRHhsZUdsbU9sQnBlR1ZzV1VScGJXVnVjMmx2Ymo0ek1qd3ZaWGhwWmpwUWFYaGxiRmxFYVcxbGJuTnBiMjQrQ2lBZ0lDQWdJRHd2Y21SbU9rUmxjMk55YVhCMGFXOXVQZ29nSUNBOEwzSmtaanBTUkVZK0Nqd3ZlRHA0YlhCdFpYUmhQZ29nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBbzhQM2h3WVdOclpYUWdaVzVrUFNKM0lqOCtPaEY3UndBQUFDQmpTRkpOQUFCNkpRQUFnSU1BQVBuL0FBQ0E2UUFBZFRBQUFPcGdBQUE2bUFBQUYyK1NYOFZHQUFBQWxFbEVRVlI0MnV6WnNRM0FJQXhFVVR1VFpKUnNrdDVMUkZtQ2RUTGFwVUtDQmlqby9GMGhuMlNrSnhJS1hKSmxyc09TRndBQUFBQkE2dktJNk83QlVvclhkWnUxL1ZFV0VaZVpmYk41bS9aYW1qZksrQVFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQ0JmdWFTbmE3aS9kZDFtYlgrVVNUck43SjdOMjdUWDByeFJ4Z25nWllpZklBQUFBSkM0ZmdBQUFQLy9Bd0F1TVZQdzIwaHhDd0FBQUFCSlJVNUVya0pnZ2c9PWA7XG5cbiAgY29uc3QgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKCk7XG4gIHRleHR1cmUuaW1hZ2UgPSBpbWFnZTtcbiAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG4gIC8vIHRleHR1cmUubWluRmlsdGVyID0gVEhSRUUuTGluZWFyTWlwTWFwTGluZWFyRmlsdGVyO1xuICAvLyB0ZXh0dXJlLm1hZ0ZpbHRlciA9IFRIUkVFLkxpbmVhckZpbHRlcjtcbiAgLy8gdGV4dHVyZS5nZW5lcmF0ZU1pcG1hcHMgPSBmYWxzZTtcblxuICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgLy8gY29sb3I6IDB4ZmYwMDAwLFxuICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgbWFwOiB0ZXh0dXJlXG4gIH0pO1xuICBtYXRlcmlhbC5hbHBoYVRlc3QgPSAwLjU7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKCl7XG4gICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSggaW1hZ2Uud2lkdGggLyAxMDAwLCBpbWFnZS5oZWlnaHQgLyAxMDAwLCAxLCAxICk7XG5cbiAgICBjb25zdCBtZXNoID0gbmV3IFRIUkVFLk1lc2goIGdlb21ldHJ5LCBtYXRlcmlhbCApO1xuICAgIHJldHVybiBtZXNoO1xuICB9XG5cbn0oKSk7XG5cbmV4cG9ydCBjb25zdCBkb3duQXJyb3cgPSAoZnVuY3Rpb24oKXtcbiAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgaW1hZ2Uuc3JjID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBSUFBQUFCQUNBWUFBQURTMW45L0FBQUFDWEJJV1hNQUFDeExBQUFzU3dHbFBaYXBBQUE0SzJsVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRLUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE16SWdOemt1TVRVNU1qZzBMQ0F5TURFMkx6QTBMekU1TFRFek9qRXpPalF3SUNBZ0lDQWdJQ0FpUGdvZ0lDQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQZ29nSUNBZ0lDQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJZ29nSUNBZ0lDQWdJQ0FnSUNCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlDaUFnSUNBZ0lDQWdJQ0FnSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlLSUNBZ0lDQWdJQ0FnSUNBZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWdvZ0lDQWdJQ0FnSUNBZ0lDQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SUtJQ0FnSUNBZ0lDQWdJQ0FnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlLSUNBZ0lDQWdJQ0FnSUNBZ2VHMXNibk02ZEdsbVpqMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzkwYVdabUx6RXVNQzhpQ2lBZ0lDQWdJQ0FnSUNBZ0lIaHRiRzV6T21WNGFXWTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2WlhocFppOHhMakF2SWo0S0lDQWdJQ0FnSUNBZ1BIaHRjRHBEY21WaGRHOXlWRzl2YkQ1QlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ01qQXhOUzQxSUNoWGFXNWtiM2R6S1R3dmVHMXdPa055WldGMGIzSlViMjlzUGdvZ0lDQWdJQ0FnSUNBOGVHMXdPa055WldGMFpVUmhkR1UrTWpBeE5pMHhNQzB4T0ZReE56b3pNem93Tmkwd056b3dNRHd2ZUcxd09rTnlaV0YwWlVSaGRHVStDaUFnSUNBZ0lDQWdJRHg0YlhBNlRXOWthV1o1UkdGMFpUNHlNREUyTFRFd0xUSXdWREl4T2pFNE9qSTFMVEEzT2pBd1BDOTRiWEE2VFc5a2FXWjVSR0YwWlQ0S0lDQWdJQ0FnSUNBZ1BIaHRjRHBOWlhSaFpHRjBZVVJoZEdVK01qQXhOaTB4TUMweU1GUXlNVG94T0RveU5TMHdOem93TUR3dmVHMXdPazFsZEdGa1lYUmhSR0YwWlQ0S0lDQWdJQ0FnSUNBZ1BHUmpPbVp2Y20xaGRENXBiV0ZuWlM5d2JtYzhMMlJqT21admNtMWhkRDRLSUNBZ0lDQWdJQ0FnUEhCb2IzUnZjMmh2Y0RwRGIyeHZjazF2WkdVK016d3ZjR2h2ZEc5emFHOXdPa052Ykc5eVRXOWtaVDRLSUNBZ0lDQWdJQ0FnUEhodGNFMU5Pa2x1YzNSaGJtTmxTVVErZUcxd0xtbHBaRG96TURReVlqSTBaUzFpTXpjMkxXSTBOR0l0T0dJNFl5MWxaVEZqWTJJellXVTFNRFU4TDNodGNFMU5Pa2x1YzNSaGJtTmxTVVErQ2lBZ0lDQWdJQ0FnSUR4NGJYQk5UVHBFYjJOMWJXVnVkRWxFUG5odGNDNWthV1E2TXpBME1tSXlOR1V0WWpNM05pMWlORFJpTFRoaU9HTXRaV1V4WTJOaU0yRmxOVEExUEM5NGJYQk5UVHBFYjJOMWJXVnVkRWxFUGdvZ0lDQWdJQ0FnSUNBOGVHMXdUVTA2VDNKcFoybHVZV3hFYjJOMWJXVnVkRWxFUG5odGNDNWthV1E2TXpBME1tSXlOR1V0WWpNM05pMWlORFJpTFRoaU9HTXRaV1V4WTJOaU0yRmxOVEExUEM5NGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVErQ2lBZ0lDQWdJQ0FnSUR4NGJYQk5UVHBJYVhOMGIzSjVQZ29nSUNBZ0lDQWdJQ0FnSUNBOGNtUm1PbE5sY1Q0S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhKa1pqcHNhU0J5WkdZNmNHRnljMlZVZVhCbFBTSlNaWE52ZFhKalpTSStDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6ZEVWMmREcGhZM1JwYjI0K1kzSmxZWFJsWkR3dmMzUkZkblE2WVdOMGFXOXVQZ29nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDU0YlhBdWFXbGtPak13TkRKaU1qUmxMV0l6TnpZdFlqUTBZaTA0WWpoakxXVmxNV05qWWpOaFpUVXdOVHd2YzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDRLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOMFJYWjBPbmRvWlc0K01qQXhOaTB4TUMweE9GUXhOem96TXpvd05pMHdOem93TUR3dmMzUkZkblE2ZDJobGJqNEtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblErUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESURJd01UVXVOU0FvVjJsdVpHOTNjeWs4TDNOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5RK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dmNtUm1PbXhwUGdvZ0lDQWdJQ0FnSUNBZ0lDQThMM0prWmpwVFpYRStDaUFnSUNBZ0lDQWdJRHd2ZUcxd1RVMDZTR2x6ZEc5eWVUNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNlQzSnBaVzUwWVhScGIyNCtNVHd2ZEdsbVpqcFBjbWxsYm5SaGRHbHZiajRLSUNBZ0lDQWdJQ0FnUEhScFptWTZXRkpsYzI5c2RYUnBiMjQrTWpnNE1EQXdNQzh4TURBd01Ed3ZkR2xtWmpwWVVtVnpiMngxZEdsdmJqNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNldWSmxjMjlzZFhScGIyNCtNamc0TURBd01DOHhNREF3TUR3dmRHbG1aanBaVW1WemIyeDFkR2x2Ymo0S0lDQWdJQ0FnSUNBZ1BIUnBabVk2VW1WemIyeDFkR2x2YmxWdWFYUStNand2ZEdsbVpqcFNaWE52YkhWMGFXOXVWVzVwZEQ0S0lDQWdJQ0FnSUNBZ1BHVjRhV1k2UTI5c2IzSlRjR0ZqWlQ0Mk5UVXpOVHd2WlhocFpqcERiMnh2Y2xOd1lXTmxQZ29nSUNBZ0lDQWdJQ0E4WlhocFpqcFFhWGhsYkZoRWFXMWxibk5wYjI0K01USTRQQzlsZUdsbU9sQnBlR1ZzV0VScGJXVnVjMmx2Ymo0S0lDQWdJQ0FnSUNBZ1BHVjRhV1k2VUdsNFpXeFpSR2x0Wlc1emFXOXVQalkwUEM5bGVHbG1PbEJwZUdWc1dVUnBiV1Z1YzJsdmJqNEtJQ0FnSUNBZ1BDOXlaR1k2UkdWelkzSnBjSFJwYjI0K0NpQWdJRHd2Y21SbU9sSkVSajRLUEM5NE9uaHRjRzFsZEdFK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2p3L2VIQmhZMnRsZENCbGJtUTlJbmNpUHo1VWlsejBBQUFBSUdOSVVrMEFBSG9sQUFDQWd3QUErZjhBQUlEcEFBQjFNQUFBNm1BQUFEcVlBQUFYYjVKZnhVWUFBQUpkU1VSQlZIamE3TjNMY2NKQUVJVGhSdVc3bmNVZVRRaGtRQWlJRE1nSWhVSUljRlFXSmdKODhGS2xvdndBck4yZDZaNDVjWkdBL1Q5dmlZZnR4ZVZ5UVl6dWRMRUVBU0FtQU1RRWdCakplV2wxeHltbE53QUhBTWR4SEh2RnhVOHBEUUNXQUZiak9IN0k3QUNUK084QU5ua2hGT052OGhvYzhwcndBN2lKZngwcEJKUDQxMm1Hb0RNUVh3ckJOL0diSXVpTXhKZEE4RXY4WmdnNlEvR3BFZHdSdndtQ3psaDhTZ1FQeEsrT29NWU9NRHdZbndyQkUvR25DQWJYQVBLVFgvL2pGSnVVVXU4NGZ2OWsvT3VzUy84UWRBYmwzODdlSTRMOG1QY3puS3JvVGxoeUIxak9lQzVYQ0dhTVgySXRxd0ZZQVRpcElTZ1EvNVRYMGhlQS9ONjJGSUpTOFV0K1RsRDBJbEFKZ2NmNFZWNEdLaUR3R3IvVyt3RFVDRHpIcndhQUZZSDMrRlVCc0NGZ2lGOGRBQXNDbHZoTkFIaEh3QlMvR1FDdkNOamlOd1hnRFFGai9PWUF2Q0Jnalc4Q2dIVUV6UEhOQUxDS2dEMitLUURXRUNqRU53ZkFDZ0tWK0NZQlRCRDBBTTYxRVJTSWZ3YlFXNHh2RmtCR2NNdzdRVFVFaGVLdjhuTkJBRENNUURHK2VRQzFFS2pHQjRDRmw3OFJsRkphNHVzWFRGN25qSlJ2ejM1ZUQvRmRBU2lJQUtyeDNRRW9oQUNxOFYxY0ExUzZKcENNN3hLQVFRUnU0N3NGWUFpQjYvaXVBUmhBNEQ2K2V3QU5FVkRFcHdEUUFBRk5mQm9BRlJGUXhhY0NVQUVCWFh3NkFBVVJVTWFuQkZBQUFXMThXZ0F6SXFDT1R3MWdCZ1QwOGVrQlRCRHNuamgweHg1ZkFrQkdNQURZUG5ESU5oK0RBS0NIUUNhK0ZJQTdFVWpGbHdQd0J3SzUrSklBZmtBZ0dSOXcrSld3T2VmNnpXRFYrUElBWXVMZnhnV0FXSUlBRUJNQVlnSkFqT1I4RGdEKzZPemd2NHV5OWdBQUFBQkpSVTVFcmtKZ2dnPT0nO1xuXG4gIGNvbnN0IHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZSgpO1xuICB0ZXh0dXJlLmltYWdlID0gaW1hZ2U7XG4gIHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlO1xuICB0ZXh0dXJlLm1pbkZpbHRlciA9IFRIUkVFLkxpbmVhck1pcE1hcExpbmVhckZpbHRlcjtcbiAgdGV4dHVyZS5tYWdGaWx0ZXIgPSBUSFJFRS5MaW5lYXJGaWx0ZXI7XG4gIC8vIHRleHR1cmUuYW5pc290cm9waWNcbiAgLy8gdGV4dHVyZS5nZW5lcmF0ZU1pcG1hcHMgPSBmYWxzZTtcblxuICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgLy8gY29sb3I6IDB4ZmYwMDAwLFxuICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgbWFwOiB0ZXh0dXJlXG4gIH0pO1xuICBtYXRlcmlhbC5hbHBoYVRlc3QgPSAwLjI7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKCl7XG4gICAgY29uc3QgaCA9IDAuMztcbiAgICBjb25zdCBnZW8gPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSggaW1hZ2Uud2lkdGggLyAxMDAwICogaCwgaW1hZ2UuaGVpZ2h0IC8gMTAwMCAqIGgsIDEsIDEgKTtcbiAgICBnZW8udHJhbnNsYXRlKCAtMC4wMDUsIC0wLjAwNCwgMCApO1xuICAgIHJldHVybiBuZXcgVEhSRUUuTWVzaCggZ2VvLCBtYXRlcmlhbCApO1xuICB9XG59KCkpO1xuXG5cbmV4cG9ydCBjb25zdCBjaGVja21hcmsgPSAoZnVuY3Rpb24oKXtcbiAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgaW1hZ2Uuc3JjID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBSUFBQUFCQUNBWUFBQURTMW45L0FBQUFDWEJJV1hNQUFDeExBQUFzU3dHbFBaYXBBQUE0SzJsVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRLUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE16SWdOemt1TVRVNU1qZzBMQ0F5TURFMkx6QTBMekU1TFRFek9qRXpPalF3SUNBZ0lDQWdJQ0FpUGdvZ0lDQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQZ29nSUNBZ0lDQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJZ29nSUNBZ0lDQWdJQ0FnSUNCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlDaUFnSUNBZ0lDQWdJQ0FnSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlLSUNBZ0lDQWdJQ0FnSUNBZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWdvZ0lDQWdJQ0FnSUNBZ0lDQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SUtJQ0FnSUNBZ0lDQWdJQ0FnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlLSUNBZ0lDQWdJQ0FnSUNBZ2VHMXNibk02ZEdsbVpqMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzkwYVdabUx6RXVNQzhpQ2lBZ0lDQWdJQ0FnSUNBZ0lIaHRiRzV6T21WNGFXWTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2WlhocFppOHhMakF2SWo0S0lDQWdJQ0FnSUNBZ1BIaHRjRHBEY21WaGRHOXlWRzl2YkQ1QlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ01qQXhOUzQxSUNoWGFXNWtiM2R6S1R3dmVHMXdPa055WldGMGIzSlViMjlzUGdvZ0lDQWdJQ0FnSUNBOGVHMXdPa055WldGMFpVUmhkR1UrTWpBeE5pMHhNQzB4T0ZReE56b3pNem93Tmkwd056b3dNRHd2ZUcxd09rTnlaV0YwWlVSaGRHVStDaUFnSUNBZ0lDQWdJRHg0YlhBNlRXOWthV1o1UkdGMFpUNHlNREUyTFRFd0xUSXdWREl4T2pNek9qVXpMVEEzT2pBd1BDOTRiWEE2VFc5a2FXWjVSR0YwWlQ0S0lDQWdJQ0FnSUNBZ1BIaHRjRHBOWlhSaFpHRjBZVVJoZEdVK01qQXhOaTB4TUMweU1GUXlNVG96TXpvMU15MHdOem93TUR3dmVHMXdPazFsZEdGa1lYUmhSR0YwWlQ0S0lDQWdJQ0FnSUNBZ1BHUmpPbVp2Y20xaGRENXBiV0ZuWlM5d2JtYzhMMlJqT21admNtMWhkRDRLSUNBZ0lDQWdJQ0FnUEhCb2IzUnZjMmh2Y0RwRGIyeHZjazF2WkdVK016d3ZjR2h2ZEc5emFHOXdPa052Ykc5eVRXOWtaVDRLSUNBZ0lDQWdJQ0FnUEhodGNFMU5Pa2x1YzNSaGJtTmxTVVErZUcxd0xtbHBaRG8yT0RjeFlUazVZeTB6TmpFNUxUbGtOR0V0T0Rka05pMHdZV0U1WVRSaU5XVTRNamM4TDNodGNFMU5Pa2x1YzNSaGJtTmxTVVErQ2lBZ0lDQWdJQ0FnSUR4NGJYQk5UVHBFYjJOMWJXVnVkRWxFUG5odGNDNWthV1E2TmpnM01XRTVPV010TXpZeE9TMDVaRFJoTFRnM1pEWXRNR0ZoT1dFMFlqVmxPREkzUEM5NGJYQk5UVHBFYjJOMWJXVnVkRWxFUGdvZ0lDQWdJQ0FnSUNBOGVHMXdUVTA2VDNKcFoybHVZV3hFYjJOMWJXVnVkRWxFUG5odGNDNWthV1E2TmpnM01XRTVPV010TXpZeE9TMDVaRFJoTFRnM1pEWXRNR0ZoT1dFMFlqVmxPREkzUEM5NGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVErQ2lBZ0lDQWdJQ0FnSUR4NGJYQk5UVHBJYVhOMGIzSjVQZ29nSUNBZ0lDQWdJQ0FnSUNBOGNtUm1PbE5sY1Q0S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhKa1pqcHNhU0J5WkdZNmNHRnljMlZVZVhCbFBTSlNaWE52ZFhKalpTSStDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6ZEVWMmREcGhZM1JwYjI0K1kzSmxZWFJsWkR3dmMzUkZkblE2WVdOMGFXOXVQZ29nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDU0YlhBdWFXbGtPalk0TnpGaE9UbGpMVE0yTVRrdE9XUTBZUzA0TjJRMkxUQmhZVGxoTkdJMVpUZ3lOend2YzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDRLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOMFJYWjBPbmRvWlc0K01qQXhOaTB4TUMweE9GUXhOem96TXpvd05pMHdOem93TUR3dmMzUkZkblE2ZDJobGJqNEtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblErUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESURJd01UVXVOU0FvVjJsdVpHOTNjeWs4TDNOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5RK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dmNtUm1PbXhwUGdvZ0lDQWdJQ0FnSUNBZ0lDQThMM0prWmpwVFpYRStDaUFnSUNBZ0lDQWdJRHd2ZUcxd1RVMDZTR2x6ZEc5eWVUNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNlQzSnBaVzUwWVhScGIyNCtNVHd2ZEdsbVpqcFBjbWxsYm5SaGRHbHZiajRLSUNBZ0lDQWdJQ0FnUEhScFptWTZXRkpsYzI5c2RYUnBiMjQrTWpnNE1EQXdNQzh4TURBd01Ed3ZkR2xtWmpwWVVtVnpiMngxZEdsdmJqNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNldWSmxjMjlzZFhScGIyNCtNamc0TURBd01DOHhNREF3TUR3dmRHbG1aanBaVW1WemIyeDFkR2x2Ymo0S0lDQWdJQ0FnSUNBZ1BIUnBabVk2VW1WemIyeDFkR2x2YmxWdWFYUStNand2ZEdsbVpqcFNaWE52YkhWMGFXOXVWVzVwZEQ0S0lDQWdJQ0FnSUNBZ1BHVjRhV1k2UTI5c2IzSlRjR0ZqWlQ0Mk5UVXpOVHd2WlhocFpqcERiMnh2Y2xOd1lXTmxQZ29nSUNBZ0lDQWdJQ0E4WlhocFpqcFFhWGhsYkZoRWFXMWxibk5wYjI0K01USTRQQzlsZUdsbU9sQnBlR1ZzV0VScGJXVnVjMmx2Ymo0S0lDQWdJQ0FnSUNBZ1BHVjRhV1k2VUdsNFpXeFpSR2x0Wlc1emFXOXVQalkwUEM5bGVHbG1PbEJwZUdWc1dVUnBiV1Z1YzJsdmJqNEtJQ0FnSUNBZ1BDOXlaR1k2UkdWelkzSnBjSFJwYjI0K0NpQWdJRHd2Y21SbU9sSkVSajRLUEM5NE9uaHRjRzFsZEdFK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2p3L2VIQmhZMnRsZENCbGJtUTlJbmNpUHo1ejlSVDNBQUFBSUdOSVVrMEFBSG9sQUFDQWd3QUErZjhBQUlEcEFBQjFNQUFBNm1BQUFEcVlBQUFYYjVKZnhVWUFBQVR0U1VSQlZIamE3SnpiYjVSRkdNWi8yeGJDdlZoQVNFeFVpSTE0NHcwaFF0SEVHckhnSVNxZ042S2d0TllXQWIwdzBXbzFYcXJiUGJTbG9rWVN4Zk1oZW1YL0FhN3dHQVZxOFhUcDMwRFhpNW1KbTBhMnU5djMvYjZaMlhsdWRyT0hkdy9QTXpQUCs3NHpYNkZXcXlHRmdZRUJFbHBHRC9BZWNDdHdCL0RiY20rWW01c1QrL0N1OVAvbmltNmdDRHdDWEF0OERWeVg1UmRJQXNnUEJhQUVqTlE5ZGlQd0ZiQTVDU0IrVEFGUC9jL2pXNEhQZ0w0a2dIZ3hDd3cxZVA1bTRHTjdtd1FRRWJvcytVODA4ZHF0d0VmMk5na2dFcmMvMHlUNURuMTJPZGlTQkJBKythVVd5WGZZQW53RFhKOEVFRzZxTndrTXJ5REdacHNpM3BBRUVCNnFWM0Q3cmFJUCtOS21pa2tBZ2VBdDRJaGd2SnZzVEpBRTREa0t3Q25nc0VMc3Mwa0EvcS81czhBaGhkalR3RUZwZDVvZ1MzNVZhZVRQQWs4RGkwa0EvcEpmRWw3ekhVN1N1SEtZbGdBUDF2eXlrTnRmaWhrdDhwTUFaRWthVm9oYlZZcWJCQ0NJVThDVENuRkx3SmoybDA4Q1dObWEvN2FTMjY4Q3g2UU5YeEtBckhtZUJoNVhXazdHc2lBL1R3R01ZZmEvaFVwK21mWWFPODI0L2VHc3lNOUxBQzlnbWlQdkF6c0RJNy9McnMxRFNpTi9LSThmbENYR2dWZnQvVjdnRExBcklBRk1oK3IyZlJEQVM4REVrc2MyQWg4Qy9SM3M5c3ZBYUo1VFdsYmt2M3lGNTlaamRyMXM5M2phMTNMN0ZldjJhekVMWUx3QitRNXJNYjN1YlI0YXZwTktibjhhZUFhNG5MZTZ0UTNmUkpPdjdRVys4R2dtNkxFalZLT3hNNE01RDNBNTd4K3BLWUFYNnd4ZnM5Z0FmQUxzOElCOHJjYU9LeHZYZkZDNWxnREdnVmZhZks4emhydHkvRSswWEhrbEw3ZWZwUUFtV3BqMmx4UEJiVG44SjdQbzFmWkg4UXpTQW5qTmpuNEpyTWVjanNtcVdGUUEzbFZ5K3lYcjlvbGRBSGNLeDdzYStEd0RZOWhqOC95RGlxbmVZaWNJNEZIZ1IrR1lhNVd6QTgzR3poUncxRmZ5TlFUd0MzQ1B2WlhFT3VCVHpFVVVKTEVxZzFUUFcvSzFUT0Nmd0NCd1VUanVOY2lXamJzeFpWaU5WQyszMnI0dmFlQWZ3RjNBZ25EY1RWWUV0d3VOVUEzeXk1amR1M1N5QUFCK0IzWXJMQWNiQk9vRTd5aE4rNU4yelNjSndHQWVlQUQ0VGpodUw2YUIxS29uNkxia1A2WTA4by9qU1lYUEZ3RUFuQWNlVmhEQlZTMW1CNjZ4bzBIK0ZLYXhzMGhneUtvZGZBRjRFUGhKcVU2dzNFeXd5aHF6UTBya2o0UklmcFlDQUxnRTdMRXpnaVJjeGJDL3djaXZvRlBlZGVRSGk2eTNoUDFsamVHOFVvcTRORHNvWUlvOFdqdDVnaVkvRHdIVXA0aS9LbVFIWitwRVVNRHM1TkZ3KzBVeU9MUVJxd0RjY25BdjhMMXczSFhBYVpzaXZxNWsrSXJBQ1NKQm5xZUQ1NEVEd0FmQUxZSnhOd0hmS3BteXNpVi9NUllCNUgweTZBS3dIL2hCT081cVlJMkM0VHNhRS9rK0NBRE0xYkgzSWw4eGxFVFZHcjRha2NHWHM0Ri9BM2ZiR2NFM1ZBaW90aCtxQU1CMEVYZDdKb0pKUE56R0Zhc0F3RFNRQnBIZlZOS3UyejlHNVBEeGVQZ0M4QkJ3THVlUmZ5TEdOVDhFQVlEWlRISUErUVpTczJ2KzhkamNmbWdDY0hXQys1RnZJQzNuOWtjN2hYemZCZUNNNFI3a3k4WWQ1L1pERlFEODEwQzZxUGdaMGJ2OWtBVlFueUpxRkl2ZXhHem1JQW5BYjF3QzdoTTJoa1hnV1RvWW9WMGx6RFdRSkZMRTZCbzduU0FBbHlMdVkyVU5wQW9aWG9vdENVQWVDNWdHMHM5dGtqOUtRdEFDQU5OQUdxUzFQWWFsUkg0OEFuQXBZclBieTRvRWRtZ2pDYUQ1RkhFdmpiZVh2WUVwN3laRUtBRG5DZlpiRWZ3RFBJODVMK0RJZjQ0T2FPeTBnMzhIQU0vZTdndUlSeDk0QUFBQUFFbEZUa1N1UW1DQyc7XG5cbiAgY29uc3QgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKCk7XG4gIHRleHR1cmUuaW1hZ2UgPSBpbWFnZTtcbiAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG4gIHRleHR1cmUubWluRmlsdGVyID0gVEhSRUUuTGluZWFyTWlwTWFwTGluZWFyRmlsdGVyO1xuICB0ZXh0dXJlLm1hZ0ZpbHRlciA9IFRIUkVFLkxpbmVhckZpbHRlcjtcbiAgLy8gdGV4dHVyZS5hbmlzb3Ryb3BpY1xuICAvLyB0ZXh0dXJlLmdlbmVyYXRlTWlwbWFwcyA9IGZhbHNlO1xuXG4gIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbiAgICAvLyBjb2xvcjogMHhmZjAwMDAsXG4gICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZSxcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICBtYXA6IHRleHR1cmVcbiAgfSk7XG4gIG1hdGVyaWFsLmFscGhhVGVzdCA9IDAuMjtcblxuICByZXR1cm4gZnVuY3Rpb24oKXtcbiAgICBjb25zdCBoID0gMC40O1xuICAgIGNvbnN0IGdlbyA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KCBpbWFnZS53aWR0aCAvIDEwMDAgKiBoLCBpbWFnZS5oZWlnaHQgLyAxMDAwICogaCwgMSwgMSApO1xuICAgIGdlby50cmFuc2xhdGUoIDAuMDI1LCAwLCAwICk7XG4gICAgcmV0dXJuIG5ldyBUSFJFRS5NZXNoKCBnZW8sIG1hdGVyaWFsICk7XG4gIH1cbn0oKSk7IiwiLyoqXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxuKlxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cbipcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbipcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuKlxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG5pbXBvcnQgRW1pdHRlciBmcm9tICdldmVudHMnO1xuaW1wb3J0IGNyZWF0ZVNsaWRlciBmcm9tICcuL3NsaWRlcic7XG5pbXBvcnQgY3JlYXRlQ2hlY2tib3ggZnJvbSAnLi9jaGVja2JveCc7XG5pbXBvcnQgY3JlYXRlQnV0dG9uIGZyb20gJy4vYnV0dG9uJztcbmltcG9ydCBjcmVhdGVGb2xkZXIgZnJvbSAnLi9mb2xkZXInO1xuaW1wb3J0IGNyZWF0ZURyb3Bkb3duIGZyb20gJy4vZHJvcGRvd24nO1xuaW1wb3J0ICogYXMgU0RGVGV4dCBmcm9tICcuL3NkZnRleHQnO1xuXG5jb25zdCBHVUlWUiA9IChmdW5jdGlvbiBEQVRHVUlWUigpe1xuXG4gIC8qXG4gICAgU0RGIGZvbnRcbiAgKi9cbiAgY29uc3QgdGV4dENyZWF0b3IgPSBTREZUZXh0LmNyZWF0b3IoKTtcblxuXG4gIC8qXG4gICAgTGlzdHMuXG4gICAgSW5wdXRPYmplY3RzIGFyZSB0aGluZ3MgbGlrZSBWSVZFIGNvbnRyb2xsZXJzLCBjYXJkYm9hcmQgaGVhZHNldHMsIGV0Yy5cbiAgICBDb250cm9sbGVycyBhcmUgdGhlIERBVCBHVUkgc2xpZGVycywgY2hlY2tib3hlcywgZXRjLlxuICAgIEhpdHNjYW5PYmplY3RzIGFyZSBhbnl0aGluZyByYXljYXN0cyB3aWxsIGhpdC10ZXN0IGFnYWluc3QuXG4gICovXG4gIGNvbnN0IGlucHV0T2JqZWN0cyA9IFtdO1xuICBjb25zdCBjb250cm9sbGVycyA9IFtdO1xuICBjb25zdCBoaXRzY2FuT2JqZWN0cyA9IFtdOyAvL1hYWDogdGhpcyBpcyBjdXJyZW50bHkgbm90IHVzZWQuXG5cbiAgLypcbiAgICBGdW5jdGlvbnMgZm9yIGRldGVybWluaW5nIHdoZXRoZXIgYSBnaXZlbiBjb250cm9sbGVyIGlzIHZpc2libGUgKGJ5IHdoaWNoIHdlXG4gICAgbWVhbiBub3QgaGlkZGVuLCBub3QgJ3Zpc2libGUnIGluIHRlcm1zIG9mIHRoZSBjYW1lcmEgb3JpZW50YXRpb24gZXRjKSwgYW5kXG4gICAgZm9yIHJldHJpZXZpbmcgdGhlIGxpc3Qgb2YgdmlzaWJsZSBoaXRzY2FuT2JqZWN0cyBkeW5hbWljYWxseS5cbiAgICBUaGlzIG1pZ2h0IGJlbmVmaXQgZnJvbSBzb21lIGNhY2hpbmcgZXNwZWNpYWxseSBpbiBjYXNlcyB3aXRoIGxhcmdlIGNvbXBsZXggR1VJcy5cbiAgICBJIGhhdmVuJ3QgbWVhc3VyZWQgdGhlIGltcGFjdCBvZiBnYXJiYWdlIGNvbGxlY3Rpb24gZXRjLlxuICAqL1xuICBmdW5jdGlvbiBpc0NvbnRyb2xsZXJWaXNpYmxlKGNvbnRyb2wpIHtcbiAgICBpZiAoIWNvbnRyb2wudmlzaWJsZSkgcmV0dXJuIGZhbHNlO1xuICAgIHZhciBmb2xkZXIgPSBjb250cm9sLmZvbGRlcjtcbiAgICB3aGlsZSAoZm9sZGVyLmZvbGRlciAhPT0gZm9sZGVyKXtcbiAgICAgIGZvbGRlciA9IGZvbGRlci5mb2xkZXI7XG4gICAgICBpZiAoZm9sZGVyLmlzQ29sbGFwc2VkKCkgfHwgIWZvbGRlci52aXNpYmxlKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGZ1bmN0aW9uIGdldFZpc2libGVDb250cm9sbGVycygpIHtcbiAgICAvLyBub3QgdGVycmlibHkgZWZmaWNpZW50XG4gICAgcmV0dXJuIGNvbnRyb2xsZXJzLmZpbHRlciggaXNDb250cm9sbGVyVmlzaWJsZSApO1xuICB9XG4gIGZ1bmN0aW9uIGdldFZpc2libGVIaXRzY2FuT2JqZWN0cygpIHtcbiAgICBjb25zdCB0bXAgPSBnZXRWaXNpYmxlQ29udHJvbGxlcnMoKS5tYXAoIG8gPT4geyByZXR1cm4gby5oaXRzY2FuOyB9IClcbiAgICByZXR1cm4gdG1wLnJlZHVjZSgoYSwgYikgPT4geyByZXR1cm4gYS5jb25jYXQoYil9LCBbXSk7XG4gIH1cblxuICBsZXQgbW91c2VFbmFibGVkID0gZmFsc2U7XG4gIGxldCBtb3VzZVJlbmRlcmVyID0gdW5kZWZpbmVkO1xuXG4gIGZ1bmN0aW9uIGVuYWJsZU1vdXNlKCBjYW1lcmEsIHJlbmRlcmVyICl7XG4gICAgbW91c2VFbmFibGVkID0gdHJ1ZTtcbiAgICBtb3VzZVJlbmRlcmVyID0gcmVuZGVyZXI7XG4gICAgbW91c2VJbnB1dC5tb3VzZUNhbWVyYSA9IGNhbWVyYTtcbiAgICByZXR1cm4gbW91c2VJbnB1dC5sYXNlcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRpc2FibGVNb3VzZSgpe1xuICAgIG1vdXNlRW5hYmxlZCA9IGZhbHNlO1xuICB9XG5cblxuICAvKlxuICAgIFRoZSBkZWZhdWx0IGxhc2VyIHBvaW50ZXIgY29taW5nIG91dCBvZiBlYWNoIElucHV0T2JqZWN0LlxuICAqL1xuICBjb25zdCBsYXNlck1hdGVyaWFsID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKHtjb2xvcjoweDU1YWFmZiwgdHJhbnNwYXJlbnQ6IHRydWUsIGJsZW5kaW5nOiBUSFJFRS5BZGRpdGl2ZUJsZW5kaW5nIH0pO1xuICBmdW5jdGlvbiBjcmVhdGVMYXNlcigpe1xuICAgIGNvbnN0IGcgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcbiAgICBnLnZlcnRpY2VzLnB1c2goIG5ldyBUSFJFRS5WZWN0b3IzKCkgKTtcbiAgICBnLnZlcnRpY2VzLnB1c2goIG5ldyBUSFJFRS5WZWN0b3IzKDAsMCwwKSApO1xuICAgIHJldHVybiBuZXcgVEhSRUUuTGluZSggZywgbGFzZXJNYXRlcmlhbCApO1xuICB9XG5cblxuXG5cblxuICAvKlxuICAgIEEgXCJjdXJzb3JcIiwgZWcgdGhlIGJhbGwgdGhhdCBhcHBlYXJzIGF0IHRoZSBlbmQgb2YgeW91ciBsYXNlci5cbiAgKi9cbiAgY29uc3QgY3Vyc29yTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe2NvbG9yOjB4NDQ0NDQ0LCB0cmFuc3BhcmVudDogdHJ1ZSwgYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcgfSApO1xuICBmdW5jdGlvbiBjcmVhdGVDdXJzb3IoKXtcbiAgICByZXR1cm4gbmV3IFRIUkVFLk1lc2goIG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgwLjAwNiwgNCwgNCApLCBjdXJzb3JNYXRlcmlhbCApO1xuICB9XG5cblxuXG5cbiAgLypcbiAgICBDcmVhdGVzIGEgZ2VuZXJpYyBJbnB1dCB0eXBlLlxuICAgIFRha2VzIGFueSBUSFJFRS5PYmplY3QzRCB0eXBlIG9iamVjdCBhbmQgdXNlcyBpdHMgcG9zaXRpb25cbiAgICBhbmQgb3JpZW50YXRpb24gYXMgYW4gaW5wdXQgZGV2aWNlLlxuXG4gICAgQSBsYXNlciBwb2ludGVyIGlzIGluY2x1ZGVkIGFuZCB3aWxsIGJlIHVwZGF0ZWQuXG4gICAgQ29udGFpbnMgc3RhdGUgYWJvdXQgd2hpY2ggSW50ZXJhY3Rpb24gaXMgY3VycmVudGx5IGJlaW5nIHVzZWQgb3IgaG92ZXIuXG4gICovXG4gIGZ1bmN0aW9uIGNyZWF0ZUlucHV0KCBpbnB1dE9iamVjdCA9IG5ldyBUSFJFRS5Hcm91cCgpICl7XG4gICAgY29uc3QgaW5wdXQgPSB7XG4gICAgICByYXljYXN0OiBuZXcgVEhSRUUuUmF5Y2FzdGVyKCBuZXcgVEhSRUUuVmVjdG9yMygpLCBuZXcgVEhSRUUuVmVjdG9yMygpICksXG4gICAgICBsYXNlcjogY3JlYXRlTGFzZXIoKSxcbiAgICAgIGN1cnNvcjogY3JlYXRlQ3Vyc29yKCksXG4gICAgICBvYmplY3Q6IGlucHV0T2JqZWN0LFxuICAgICAgcHJlc3NlZDogZmFsc2UsXG4gICAgICBncmlwcGVkOiBmYWxzZSxcbiAgICAgIGV2ZW50czogbmV3IEVtaXR0ZXIoKSxcbiAgICAgIGludGVyYWN0aW9uOiB7XG4gICAgICAgIGdyaXA6IHVuZGVmaW5lZCxcbiAgICAgICAgcHJlc3M6IHVuZGVmaW5lZCxcbiAgICAgICAgaG92ZXI6IHVuZGVmaW5lZFxuICAgICAgfVxuICAgIH07XG5cbiAgICBpbnB1dC5sYXNlci5hZGQoIGlucHV0LmN1cnNvciApO1xuXG4gICAgcmV0dXJuIGlucHV0O1xuICB9XG5cblxuXG5cblxuICAvKlxuICAgIE1vdXNlSW5wdXQuXG4gICAgQWxsb3dzIHlvdSB0byBjbGljayBvbiB0aGUgc2NyZWVuIHdoZW4gbm90IGluIFZSIGZvciBkZWJ1Z2dpbmcuXG4gICovXG4gIGNvbnN0IG1vdXNlSW5wdXQgPSBjcmVhdGVNb3VzZUlucHV0KCk7XG5cbiAgZnVuY3Rpb24gY3JlYXRlTW91c2VJbnB1dCgpe1xuICAgIGNvbnN0IG1vdXNlID0gbmV3IFRIUkVFLlZlY3RvcjIoLTEsLTEpO1xuXG4gICAgY29uc3QgaW5wdXQgPSBjcmVhdGVJbnB1dCgpO1xuICAgIGlucHV0Lm1vdXNlID0gbW91c2U7XG4gICAgaW5wdXQubW91c2VJbnRlcnNlY3Rpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICAgIGlucHV0Lm1vdXNlT2Zmc2V0ID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgICBpbnB1dC5tb3VzZVBsYW5lID0gbmV3IFRIUkVFLlBsYW5lKCk7XG4gICAgaW5wdXQuaW50ZXJzZWN0aW9ucyA9IFtdO1xuXG4gICAgLy8gIHNldCBteSBlbmFibGVNb3VzZVxuICAgIGlucHV0Lm1vdXNlQ2FtZXJhID0gdW5kZWZpbmVkO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCBmdW5jdGlvbiggZXZlbnQgKXtcbiAgICAgIC8vIGlmIGEgc3BlY2lmaWMgcmVuZGVyZXIgaGFzIGJlZW4gZGVmaW5lZFxuICAgICAgaWYgKG1vdXNlUmVuZGVyZXIpIHtcbiAgICAgICAgY29uc3QgY2xpZW50UmVjdCA9IG1vdXNlUmVuZGVyZXIuZG9tRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgbW91c2UueCA9ICggKGV2ZW50LmNsaWVudFggLSBjbGllbnRSZWN0LmxlZnQpIC8gY2xpZW50UmVjdC53aWR0aCkgKiAyIC0gMTtcbiAgICAgICAgbW91c2UueSA9IC0gKCAoZXZlbnQuY2xpZW50WSAtIGNsaWVudFJlY3QudG9wKSAvIGNsaWVudFJlY3QuaGVpZ2h0KSAqIDIgKyAxO1xuICAgICAgfVxuICAgICAgLy8gZGVmYXVsdCB0byBmdWxsc2NyZWVuXG4gICAgICBlbHNlIHtcbiAgICAgICAgbW91c2UueCA9ICggZXZlbnQuY2xpZW50WCAvIHdpbmRvdy5pbm5lcldpZHRoICkgKiAyIC0gMTtcbiAgICAgICAgbW91c2UueSA9IC0gKCBldmVudC5jbGllbnRZIC8gd2luZG93LmlubmVySGVpZ2h0ICkgKiAyICsgMTtcbiAgICAgIH1cblxuICAgIH0sIGZhbHNlICk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlZG93bicsIGZ1bmN0aW9uKCBldmVudCApe1xuICAgICAgaWYgKGlucHV0LmludGVyc2VjdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyBwcmV2ZW50IG1vdXNlIGRvd24gZnJvbSB0cmlnZ2VyaW5nIG90aGVyIGxpc3RlbmVycyAocG9seWZpbGwsIGV0YylcbiAgICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGlucHV0LnByZXNzZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0sIHRydWUgKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnbW91c2V1cCcsIGZ1bmN0aW9uKCBldmVudCApe1xuICAgICAgaW5wdXQucHJlc3NlZCA9IGZhbHNlO1xuICAgIH0sIGZhbHNlICk7XG5cblxuICAgIHJldHVybiBpbnB1dDtcbiAgfVxuXG5cblxuXG5cbiAgLypcbiAgICBQdWJsaWMgZnVuY3Rpb24gdXNlcnMgcnVuIHRvIGdpdmUgREFUIEdVSSBhbiBpbnB1dCBkZXZpY2UuXG4gICAgQXV0b21hdGljYWxseSBkZXRlY3RzIGZvciBWaXZlQ29udHJvbGxlciBhbmQgYmluZHMgYnV0dG9ucyArIGhhcHRpYyBmZWVkYmFjay5cblxuICAgIFJldHVybnMgYSBsYXNlciBwb2ludGVyIHNvIGl0IGNhbiBiZSBkaXJlY3RseSBhZGRlZCB0byBzY2VuZS5cblxuICAgIFRoZSBsYXNlciB3aWxsIHRoZW4gaGF2ZSB0d28gbWV0aG9kczpcbiAgICBsYXNlci5wcmVzc2VkKCksIGxhc2VyLmdyaXBwZWQoKVxuXG4gICAgVGhlc2UgY2FuIHRoZW4gYmUgYm91bmQgdG8gYW55IGJ1dHRvbiB0aGUgdXNlciB3YW50cy4gVXNlZnVsIGZvciBiaW5kaW5nIHRvXG4gICAgY2FyZGJvYXJkIG9yIGFsdGVybmF0ZSBpbnB1dCBkZXZpY2VzLlxuXG4gICAgRm9yIGV4YW1wbGUuLi5cbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZWRvd24nLCBmdW5jdGlvbigpeyBsYXNlci5wcmVzc2VkKCB0cnVlICk7IH0gKTtcbiAgKi9cbiAgZnVuY3Rpb24gYWRkSW5wdXRPYmplY3QoIG9iamVjdCApe1xuICAgIGNvbnN0IGlucHV0ID0gY3JlYXRlSW5wdXQoIG9iamVjdCApO1xuXG4gICAgaW5wdXQubGFzZXIucHJlc3NlZCA9IGZ1bmN0aW9uKCBmbGFnICl7XG4gICAgICAvLyBvbmx5IHBheSBhdHRlbnRpb24gdG8gcHJlc3NlcyBvdmVyIHRoZSBHVUlcbiAgICAgIGlmIChmbGFnICYmIChpbnB1dC5pbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApKSB7XG4gICAgICAgIGlucHV0LnByZXNzZWQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXQucHJlc3NlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpbnB1dC5sYXNlci5ncmlwcGVkID0gZnVuY3Rpb24oIGZsYWcgKXtcbiAgICAgIGlucHV0LmdyaXBwZWQgPSBmbGFnO1xuICAgIH07XG5cbiAgICBpbnB1dC5sYXNlci5jdXJzb3IgPSBpbnB1dC5jdXJzb3I7XG5cbiAgICBpZiggVEhSRUUuVml2ZUNvbnRyb2xsZXIgJiYgb2JqZWN0IGluc3RhbmNlb2YgVEhSRUUuVml2ZUNvbnRyb2xsZXIgKXtcbiAgICAgIGJpbmRWaXZlQ29udHJvbGxlciggaW5wdXQsIG9iamVjdCwgaW5wdXQubGFzZXIucHJlc3NlZCwgaW5wdXQubGFzZXIuZ3JpcHBlZCApO1xuICAgIH1cblxuICAgIGlucHV0T2JqZWN0cy5wdXNoKCBpbnB1dCApO1xuXG4gICAgcmV0dXJuIGlucHV0Lmxhc2VyO1xuICB9XG5cblxuXG5cbiAgLypcbiAgICBIZXJlIGFyZSB0aGUgbWFpbiBkYXQgZ3VpIGNvbnRyb2xsZXIgdHlwZXMuXG4gICovXG5cbiAgZnVuY3Rpb24gYWRkU2xpZGVyKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgbWluID0gMC4wLCBtYXggPSAxMDAuMCApe1xuICAgIGNvbnN0IHNsaWRlciA9IGNyZWF0ZVNsaWRlcigge1xuICAgICAgdGV4dENyZWF0b3IsIHByb3BlcnR5TmFtZSwgb2JqZWN0LCBtaW4sIG1heCxcbiAgICAgIGluaXRpYWxWYWx1ZTogb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXVxuICAgIH0pO1xuXG4gICAgY29udHJvbGxlcnMucHVzaCggc2xpZGVyICk7XG4gICAgaGl0c2Nhbk9iamVjdHMucHVzaCggLi4uc2xpZGVyLmhpdHNjYW4gKVxuXG4gICAgcmV0dXJuIHNsaWRlcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZENoZWNrYm94KCBvYmplY3QsIHByb3BlcnR5TmFtZSApe1xuICAgIGNvbnN0IGNoZWNrYm94ID0gY3JlYXRlQ2hlY2tib3goe1xuICAgICAgdGV4dENyZWF0b3IsIHByb3BlcnR5TmFtZSwgb2JqZWN0LFxuICAgICAgaW5pdGlhbFZhbHVlOiBvYmplY3RbIHByb3BlcnR5TmFtZSBdXG4gICAgfSk7XG5cbiAgICBjb250cm9sbGVycy5wdXNoKCBjaGVja2JveCApO1xuICAgIGhpdHNjYW5PYmplY3RzLnB1c2goIC4uLmNoZWNrYm94LmhpdHNjYW4gKVxuXG4gICAgcmV0dXJuIGNoZWNrYm94O1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkQnV0dG9uKCBvYmplY3QsIHByb3BlcnR5TmFtZSApe1xuICAgIGNvbnN0IGJ1dHRvbiA9IGNyZWF0ZUJ1dHRvbih7XG4gICAgICB0ZXh0Q3JlYXRvciwgcHJvcGVydHlOYW1lLCBvYmplY3RcbiAgICB9KTtcblxuICAgIGNvbnRyb2xsZXJzLnB1c2goIGJ1dHRvbiApO1xuICAgIGhpdHNjYW5PYmplY3RzLnB1c2goIC4uLmJ1dHRvbi5oaXRzY2FuICk7XG4gICAgcmV0dXJuIGJ1dHRvbjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZERyb3Bkb3duKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgb3B0aW9ucyApe1xuICAgIGNvbnN0IGRyb3Bkb3duID0gY3JlYXRlRHJvcGRvd24oe1xuICAgICAgdGV4dENyZWF0b3IsIHByb3BlcnR5TmFtZSwgb2JqZWN0LCBvcHRpb25zXG4gICAgfSk7XG5cbiAgICBjb250cm9sbGVycy5wdXNoKCBkcm9wZG93biApO1xuICAgIGhpdHNjYW5PYmplY3RzLnB1c2goIC4uLmRyb3Bkb3duLmhpdHNjYW4gKTtcbiAgICByZXR1cm4gZHJvcGRvd247XG4gIH1cblxuXG5cblxuXG4gIC8qXG4gICAgQW4gaW1wbGljaXQgQWRkIGZ1bmN0aW9uIHdoaWNoIGRldGVjdHMgZm9yIHByb3BlcnR5IHR5cGVcbiAgICBhbmQgZ2l2ZXMgeW91IHRoZSBjb3JyZWN0IGNvbnRyb2xsZXIuXG5cbiAgICBEcm9wZG93bjpcbiAgICAgIGFkZCggb2JqZWN0LCBwcm9wZXJ0eU5hbWUsIG9iamVjdFR5cGUgKVxuXG4gICAgU2xpZGVyOlxuICAgICAgYWRkKCBvYmplY3QsIHByb3BlcnR5T2ZOdW1iZXJUeXBlLCBtaW4sIG1heCApXG5cbiAgICBDaGVja2JveDpcbiAgICAgIGFkZCggb2JqZWN0LCBwcm9wZXJ0eU9mQm9vbGVhblR5cGUgKVxuXG4gICAgQnV0dG9uOlxuICAgICAgYWRkKCBvYmplY3QsIHByb3BlcnR5T2ZGdW5jdGlvblR5cGUgKVxuXG4gICAgTm90IHVzZWQgZGlyZWN0bHkuIFVzZWQgYnkgZm9sZGVycy5cbiAgKi9cblxuICBmdW5jdGlvbiBhZGQoIG9iamVjdCwgcHJvcGVydHlOYW1lLCBhcmczLCBhcmc0ICl7XG5cbiAgICBpZiggb2JqZWN0ID09PSB1bmRlZmluZWQgKXtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGVsc2VcblxuICAgIGlmKCBvYmplY3RbIHByb3BlcnR5TmFtZSBdID09PSB1bmRlZmluZWQgKXtcbiAgICAgIGNvbnNvbGUud2FybiggJ25vIHByb3BlcnR5IG5hbWVkJywgcHJvcGVydHlOYW1lLCAnb24gb2JqZWN0Jywgb2JqZWN0ICk7XG4gICAgICByZXR1cm4gbmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgfVxuXG4gICAgaWYoIGlzT2JqZWN0KCBhcmczICkgfHwgaXNBcnJheSggYXJnMyApICl7XG4gICAgICByZXR1cm4gYWRkRHJvcGRvd24oIG9iamVjdCwgcHJvcGVydHlOYW1lLCBhcmczICk7XG4gICAgfVxuXG4gICAgaWYoIGlzTnVtYmVyKCBvYmplY3RbIHByb3BlcnR5TmFtZV0gKSApe1xuICAgICAgcmV0dXJuIGFkZFNsaWRlciggb2JqZWN0LCBwcm9wZXJ0eU5hbWUsIGFyZzMsIGFyZzQgKTtcbiAgICB9XG5cbiAgICBpZiggaXNCb29sZWFuKCBvYmplY3RbIHByb3BlcnR5TmFtZV0gKSApe1xuICAgICAgcmV0dXJuIGFkZENoZWNrYm94KCBvYmplY3QsIHByb3BlcnR5TmFtZSApO1xuICAgIH1cblxuICAgIGlmKCBpc0Z1bmN0aW9uKCBvYmplY3RbIHByb3BlcnR5TmFtZSBdICkgKXtcbiAgICAgIHJldHVybiBhZGRCdXR0b24oIG9iamVjdCwgcHJvcGVydHlOYW1lICk7XG4gICAgfVxuXG4gICAgLy8gIGFkZCBjb3VsZG4ndCBmaWd1cmUgaXQgb3V0LCBwYXNzIGl0IGJhY2sgdG8gZm9sZGVyXG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG5cblxuICBmdW5jdGlvbiBhZGRTaW1wbGVTbGlkZXIoIG1pbiA9IDAsIG1heCA9IDEgKXtcbiAgICBjb25zdCBwcm94eSA9IHtcbiAgICAgIG51bWJlcjogbWluXG4gICAgfTtcblxuICAgIHJldHVybiBhZGRTbGlkZXIoIHByb3h5LCAnbnVtYmVyJywgbWluLCBtYXggKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFNpbXBsZURyb3Bkb3duKCBvcHRpb25zID0gW10gKXtcbiAgICBjb25zdCBwcm94eSA9IHtcbiAgICAgIG9wdGlvbjogJydcbiAgICB9O1xuXG4gICAgaWYoIG9wdGlvbnMgIT09IHVuZGVmaW5lZCApe1xuICAgICAgcHJveHkub3B0aW9uID0gaXNBcnJheSggb3B0aW9ucyApID8gb3B0aW9uc1sgMCBdIDogb3B0aW9uc1sgT2JqZWN0LmtleXMob3B0aW9ucylbMF0gXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWRkRHJvcGRvd24oIHByb3h5LCAnb3B0aW9uJywgb3B0aW9ucyApO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkU2ltcGxlQ2hlY2tib3goIGRlZmF1bHRPcHRpb24gPSBmYWxzZSApe1xuICAgIGNvbnN0IHByb3h5ID0ge1xuICAgICAgY2hlY2tlZDogZGVmYXVsdE9wdGlvblxuICAgIH07XG5cbiAgICByZXR1cm4gYWRkQ2hlY2tib3goIHByb3h5LCAnY2hlY2tlZCcgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFNpbXBsZUJ1dHRvbiggZm4gKXtcbiAgICBjb25zdCBwcm94eSA9IHtcbiAgICAgIGJ1dHRvbjogKGZuIT09dW5kZWZpbmVkKSA/IGZuIDogZnVuY3Rpb24oKXt9XG4gICAgfTtcblxuICAgIHJldHVybiBhZGRCdXR0b24oIHByb3h5LCAnYnV0dG9uJyApO1xuICB9XG5cblxuICAvKlxuICAgIENyZWF0ZXMgYSBmb2xkZXIgd2l0aCB0aGUgbmFtZS5cblxuICAgIEZvbGRlcnMgYXJlIFRIUkVFLkdyb3VwIHR5cGUgb2JqZWN0cyBhbmQgY2FuIGRvIGdyb3VwLmFkZCgpIGZvciBzaWJsaW5ncy5cbiAgICBGb2xkZXJzIHdpbGwgYXV0b21hdGljYWxseSBhdHRlbXB0IHRvIGxheSBpdHMgY2hpbGRyZW4gb3V0IGluIHNlcXVlbmNlLlxuXG4gICAgRm9sZGVycyBhcmUgZ2l2ZW4gdGhlIGFkZCgpIGZ1bmN0aW9uYWxpdHkgc28gdGhhdCB0aGV5IGNhbiBkb1xuICAgIGZvbGRlci5hZGQoIC4uLiApIHRvIGNyZWF0ZSBjb250cm9sbGVycy5cbiAgKi9cblxuICBmdW5jdGlvbiBjcmVhdGUoIG5hbWUgKXtcbiAgICBjb25zdCBmb2xkZXIgPSBjcmVhdGVGb2xkZXIoe1xuICAgICAgdGV4dENyZWF0b3IsXG4gICAgICBuYW1lLFxuICAgICAgZ3VpQWRkOiBhZGQsXG4gICAgICBhZGRTbGlkZXI6IGFkZFNpbXBsZVNsaWRlcixcbiAgICAgIGFkZERyb3Bkb3duOiBhZGRTaW1wbGVEcm9wZG93bixcbiAgICAgIGFkZENoZWNrYm94OiBhZGRTaW1wbGVDaGVja2JveCxcbiAgICAgIGFkZEJ1dHRvbjogYWRkU2ltcGxlQnV0dG9uXG4gICAgfSk7XG5cbiAgICBjb250cm9sbGVycy5wdXNoKCBmb2xkZXIgKTtcbiAgICBpZiggZm9sZGVyLmhpdHNjYW4gKXtcbiAgICAgIGhpdHNjYW5PYmplY3RzLnB1c2goIC4uLmZvbGRlci5oaXRzY2FuICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZvbGRlcjtcbiAgfVxuXG5cblxuXG5cbiAgLypcbiAgICBQZXJmb3JtIHRoZSBuZWNlc3NhcnkgdXBkYXRlcywgcmF5Y2FzdHMgb24gaXRzIG93biBSQUYuXG4gICovXG5cbiAgY29uc3QgdFBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgY29uc3QgdERpcmVjdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCAwLCAwLCAtMSApO1xuICBjb25zdCB0TWF0cml4ID0gbmV3IFRIUkVFLk1hdHJpeDQoKTtcblxuICBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCB1cGRhdGUgKTtcblxuICAgIHZhciBoaXRzY2FuT2JqZWN0cyA9IGdldFZpc2libGVIaXRzY2FuT2JqZWN0cygpO1xuXG4gICAgaWYoIG1vdXNlRW5hYmxlZCApe1xuICAgICAgbW91c2VJbnB1dC5pbnRlcnNlY3Rpb25zID0gcGVyZm9ybU1vdXNlSW5wdXQoIGhpdHNjYW5PYmplY3RzLCBtb3VzZUlucHV0ICk7XG4gICAgfVxuXG4gICAgaW5wdXRPYmplY3RzLmZvckVhY2goIGZ1bmN0aW9uKCB7Ym94LG9iamVjdCxyYXljYXN0LGxhc2VyLGN1cnNvcn0gPSB7fSwgaW5kZXggKXtcbiAgICAgIG9iamVjdC51cGRhdGVNYXRyaXhXb3JsZCgpO1xuXG4gICAgICB0UG9zaXRpb24uc2V0KDAsMCwwKS5zZXRGcm9tTWF0cml4UG9zaXRpb24oIG9iamVjdC5tYXRyaXhXb3JsZCApO1xuICAgICAgdE1hdHJpeC5pZGVudGl0eSgpLmV4dHJhY3RSb3RhdGlvbiggb2JqZWN0Lm1hdHJpeFdvcmxkICk7XG4gICAgICB0RGlyZWN0aW9uLnNldCgwLDAsLTEpLmFwcGx5TWF0cml4NCggdE1hdHJpeCApLm5vcm1hbGl6ZSgpO1xuXG4gICAgICByYXljYXN0LnNldCggdFBvc2l0aW9uLCB0RGlyZWN0aW9uICk7XG5cbiAgICAgIGxhc2VyLmdlb21ldHJ5LnZlcnRpY2VzWyAwIF0uY29weSggdFBvc2l0aW9uICk7XG5cbiAgICAgIC8vICBkZWJ1Zy4uLlxuICAgICAgLy8gbGFzZXIuZ2VvbWV0cnkudmVydGljZXNbIDEgXS5jb3B5KCB0UG9zaXRpb24gKS5hZGQoIHREaXJlY3Rpb24ubXVsdGlwbHlTY2FsYXIoIDEgKSApO1xuXG4gICAgICBjb25zdCBpbnRlcnNlY3Rpb25zID0gcmF5Y2FzdC5pbnRlcnNlY3RPYmplY3RzKCBoaXRzY2FuT2JqZWN0cywgZmFsc2UgKTtcbiAgICAgIHBhcnNlSW50ZXJzZWN0aW9ucyggaW50ZXJzZWN0aW9ucywgbGFzZXIsIGN1cnNvciApO1xuXG4gICAgICBpbnB1dE9iamVjdHNbIGluZGV4IF0uaW50ZXJzZWN0aW9ucyA9IGludGVyc2VjdGlvbnM7XG4gICAgfSk7XG5cbiAgICBjb25zdCBpbnB1dHMgPSBpbnB1dE9iamVjdHMuc2xpY2UoKTtcblxuICAgIGlmKCBtb3VzZUVuYWJsZWQgKXtcbiAgICAgIGlucHV0cy5wdXNoKCBtb3VzZUlucHV0ICk7XG4gICAgfVxuXG4gICAgY29udHJvbGxlcnMuZm9yRWFjaCggZnVuY3Rpb24oIGNvbnRyb2xsZXIgKXtcbiAgICAgIC8vbmIsIHdlIGNvdWxkIGRvIGEgbW9yZSB0aG9yb3VnaCBjaGVjayBmb3IgdmlzaWJpbHR5LCBub3Qgc3VyZSBob3cgaW1wb3J0YW50XG4gICAgICAvL3RoaXMgYml0IGlzIGF0IHRoaXMgc3RhZ2UuLi5cbiAgICAgIGlmIChjb250cm9sbGVyLnZpc2libGUpIGNvbnRyb2xsZXIudXBkYXRlQ29udHJvbCggaW5wdXRzICk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVMYXNlciggbGFzZXIsIHBvaW50ICl7XG4gICAgbGFzZXIuZ2VvbWV0cnkudmVydGljZXNbIDEgXS5jb3B5KCBwb2ludCApO1xuICAgIGxhc2VyLnZpc2libGUgPSB0cnVlO1xuICAgIGxhc2VyLmdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ1NwaGVyZSgpO1xuICAgIGxhc2VyLmdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ0JveCgpO1xuICAgIGxhc2VyLmdlb21ldHJ5LnZlcnRpY2VzTmVlZFVwZGF0ZSA9IHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUludGVyc2VjdGlvbnMoIGludGVyc2VjdGlvbnMsIGxhc2VyLCBjdXJzb3IgKXtcbiAgICBpZiggaW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwICl7XG4gICAgICBjb25zdCBmaXJzdEhpdCA9IGludGVyc2VjdGlvbnNbIDAgXTtcbiAgICAgIHVwZGF0ZUxhc2VyKCBsYXNlciwgZmlyc3RIaXQucG9pbnQgKTtcbiAgICAgIGN1cnNvci5wb3NpdGlvbi5jb3B5KCBmaXJzdEhpdC5wb2ludCApO1xuICAgICAgY3Vyc29yLnZpc2libGUgPSB0cnVlO1xuICAgICAgY3Vyc29yLnVwZGF0ZU1hdHJpeFdvcmxkKCk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICBsYXNlci52aXNpYmxlID0gZmFsc2U7XG4gICAgICBjdXJzb3IudmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlTW91c2VJbnRlcnNlY3Rpb24oIGludGVyc2VjdGlvbiwgbGFzZXIsIGN1cnNvciApe1xuICAgIGN1cnNvci5wb3NpdGlvbi5jb3B5KCBpbnRlcnNlY3Rpb24gKTtcbiAgICB1cGRhdGVMYXNlciggbGFzZXIsIGN1cnNvci5wb3NpdGlvbiApO1xuICB9XG5cbiAgZnVuY3Rpb24gcGVyZm9ybU1vdXNlSW50ZXJzZWN0aW9uKCByYXljYXN0LCBtb3VzZSwgY2FtZXJhICl7XG4gICAgcmF5Y2FzdC5zZXRGcm9tQ2FtZXJhKCBtb3VzZSwgY2FtZXJhICk7XG4gICAgY29uc3QgaGl0c2Nhbk9iamVjdHMgPSBnZXRWaXNpYmxlSGl0c2Nhbk9iamVjdHMoKTtcbiAgICByZXR1cm4gcmF5Y2FzdC5pbnRlcnNlY3RPYmplY3RzKCBoaXRzY2FuT2JqZWN0cywgZmFsc2UgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1vdXNlSW50ZXJzZWN0c1BsYW5lKCByYXljYXN0LCB2LCBwbGFuZSApe1xuICAgIHJldHVybiByYXljYXN0LnJheS5pbnRlcnNlY3RQbGFuZSggcGxhbmUsIHYgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBlcmZvcm1Nb3VzZUlucHV0KCBoaXRzY2FuT2JqZWN0cywge2JveCxvYmplY3QscmF5Y2FzdCxsYXNlcixjdXJzb3IsbW91c2UsbW91c2VDYW1lcmF9ID0ge30gKXtcbiAgICBsZXQgaW50ZXJzZWN0aW9ucyA9IFtdO1xuXG4gICAgaWYgKG1vdXNlQ2FtZXJhKSB7XG4gICAgICBpbnRlcnNlY3Rpb25zID0gcGVyZm9ybU1vdXNlSW50ZXJzZWN0aW9uKCByYXljYXN0LCBtb3VzZSwgbW91c2VDYW1lcmEgKTtcbiAgICAgIHBhcnNlSW50ZXJzZWN0aW9ucyggaW50ZXJzZWN0aW9ucywgbGFzZXIsIGN1cnNvciApO1xuICAgICAgY3Vyc29yLnZpc2libGUgPSB0cnVlO1xuICAgICAgbGFzZXIudmlzaWJsZSA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGludGVyc2VjdGlvbnM7XG4gIH1cblxuICB1cGRhdGUoKTtcblxuXG5cblxuXG4gIC8qXG4gICAgUHVibGljIG1ldGhvZHMuXG4gICovXG5cbiAgcmV0dXJuIHtcbiAgICBjcmVhdGUsXG4gICAgYWRkSW5wdXRPYmplY3QsXG4gICAgZW5hYmxlTW91c2UsXG4gICAgZGlzYWJsZU1vdXNlXG4gIH07XG5cbn0oKSk7XG5cbmlmKCB3aW5kb3cgKXtcbiAgaWYoIHdpbmRvdy5kYXQgPT09IHVuZGVmaW5lZCApe1xuICAgIHdpbmRvdy5kYXQgPSB7fTtcbiAgfVxuXG4gIHdpbmRvdy5kYXQuR1VJVlIgPSBHVUlWUjtcbn1cblxuaWYoIG1vZHVsZSApe1xuICBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBkYXQ6IEdVSVZSXG4gIH07XG59XG5cbmlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICBkZWZpbmUoW10sIEdVSVZSKTtcbn1cblxuLypcbiAgQnVuY2ggb2Ygc3RhdGUtbGVzcyB1dGlsaXR5IGZ1bmN0aW9ucy5cbiovXG5cbmZ1bmN0aW9uIGlzTnVtYmVyKG4pIHtcbiAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKTtcbn1cblxuZnVuY3Rpb24gaXNCb29sZWFuKG4pe1xuICByZXR1cm4gdHlwZW9mIG4gPT09ICdib29sZWFuJztcbn1cblxuZnVuY3Rpb24gaXNGdW5jdGlvbihmdW5jdGlvblRvQ2hlY2spIHtcbiAgY29uc3QgZ2V0VHlwZSA9IHt9O1xuICByZXR1cm4gZnVuY3Rpb25Ub0NoZWNrICYmIGdldFR5cGUudG9TdHJpbmcuY2FsbChmdW5jdGlvblRvQ2hlY2spID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuXG4vLyAgb25seSB7fSBvYmplY3RzIG5vdCBhcnJheXNcbi8vICAgICAgICAgICAgICAgICAgICB3aGljaCBhcmUgdGVjaG5pY2FsbHkgb2JqZWN0cyBidXQgeW91J3JlIGp1c3QgYmVpbmcgcGVkYW50aWNcbmZ1bmN0aW9uIGlzT2JqZWN0IChpdGVtKSB7XG4gIHJldHVybiAodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KGl0ZW0pICYmIGl0ZW0gIT09IG51bGwpO1xufVxuXG5mdW5jdGlvbiBpc0FycmF5KCBvICl7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KCBvICk7XG59XG5cblxuXG5cblxuXG5cbi8qXG4gIENvbnRyb2xsZXItc3BlY2lmaWMgc3VwcG9ydC5cbiovXG5cbmZ1bmN0aW9uIGJpbmRWaXZlQ29udHJvbGxlciggaW5wdXQsIGNvbnRyb2xsZXIsIHByZXNzZWQsIGdyaXBwZWQgKXtcbiAgY29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKCAndHJpZ2dlcmRvd24nLCAoKT0+cHJlc3NlZCggdHJ1ZSApICk7XG4gIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lciggJ3RyaWdnZXJ1cCcsICgpPT5wcmVzc2VkKCBmYWxzZSApICk7XG4gIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lciggJ2dyaXBzZG93bicsICgpPT5ncmlwcGVkKCB0cnVlICkgKTtcbiAgY29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKCAnZ3JpcHN1cCcsICgpPT5ncmlwcGVkKCBmYWxzZSApICk7XG5cbiAgY29uc3QgZ2FtZXBhZCA9IGNvbnRyb2xsZXIuZ2V0R2FtZXBhZCgpO1xuICBmdW5jdGlvbiB2aWJyYXRlKCB0LCBhICl7XG4gICAgaWYoIGdhbWVwYWQgJiYgZ2FtZXBhZC5oYXB0aWNBY3R1YXRvcnMubGVuZ3RoID4gMCApe1xuICAgICAgZ2FtZXBhZC5oYXB0aWNBY3R1YXRvcnNbIDAgXS5wdWxzZSggdCwgYSApO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhhcHRpY3NUYXAoKXtcbiAgICBzZXRJbnRlcnZhbFRpbWVzKCAoeCx0LGEpPT52aWJyYXRlKDEtYSwgMC41KSwgMTAsIDIwICk7XG4gIH1cblxuICBmdW5jdGlvbiBoYXB0aWNzRWNobygpe1xuICAgIHNldEludGVydmFsVGltZXMoICh4LHQsYSk9PnZpYnJhdGUoNCwgMS4wICogKDEtYSkpLCAxMDAsIDQgKTtcbiAgfVxuXG4gIGlucHV0LmV2ZW50cy5vbiggJ29uQ29udHJvbGxlckhlbGQnLCBmdW5jdGlvbiggaW5wdXQgKXtcbiAgICB2aWJyYXRlKCAwLjMsIDAuMyApO1xuICB9KTtcblxuICBpbnB1dC5ldmVudHMub24oICdncmFiYmVkJywgZnVuY3Rpb24oKXtcbiAgICBoYXB0aWNzVGFwKCk7XG4gIH0pO1xuXG4gIGlucHV0LmV2ZW50cy5vbiggJ2dyYWJSZWxlYXNlZCcsIGZ1bmN0aW9uKCl7XG4gICAgaGFwdGljc0VjaG8oKTtcbiAgfSk7XG5cbiAgaW5wdXQuZXZlbnRzLm9uKCAncGlubmVkJywgZnVuY3Rpb24oKXtcbiAgICBoYXB0aWNzVGFwKCk7XG4gIH0pO1xuXG4gIGlucHV0LmV2ZW50cy5vbiggJ3BpblJlbGVhc2VkJywgZnVuY3Rpb24oKXtcbiAgICBoYXB0aWNzRWNobygpO1xuICB9KTtcblxuXG5cbn1cblxuZnVuY3Rpb24gc2V0SW50ZXJ2YWxUaW1lcyggY2IsIGRlbGF5LCB0aW1lcyApe1xuICBsZXQgeCA9IDA7XG4gIGxldCBpZCA9IHNldEludGVydmFsKCBmdW5jdGlvbigpe1xuICAgIGNiKCB4LCB0aW1lcywgeC90aW1lcyApO1xuICAgIHgrKztcbiAgICBpZiggeD49dGltZXMgKXtcbiAgICAgIGNsZWFySW50ZXJ2YWwoIGlkICk7XG4gICAgfVxuICB9LCBkZWxheSApO1xuICByZXR1cm4gaWQ7XG59IiwiLyoqXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxuKlxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cbipcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbipcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuKlxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuaW1wb3J0IEVtaXR0ZXIgZnJvbSAnZXZlbnRzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlSW50ZXJhY3Rpb24oIGhpdFZvbHVtZSApe1xuICBjb25zdCBldmVudHMgPSBuZXcgRW1pdHRlcigpO1xuXG4gIGxldCBhbnlIb3ZlciA9IGZhbHNlO1xuICBsZXQgYW55UHJlc3NpbmcgPSBmYWxzZTtcbiAgbGV0IGFueUFjdGl2ZSA9IGZhbHNlO1xuXG4gIGNvbnN0IHRWZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICBjb25zdCBhdmFpbGFibGVJbnB1dHMgPSBbXTtcblxuICBmdW5jdGlvbiB1cGRhdGUoIGlucHV0T2JqZWN0cyApe1xuXG4gICAgYW55SG92ZXIgPSBmYWxzZTtcbiAgICBhbnlQcmVzc2luZyA9IGZhbHNlO1xuICAgIGFueUFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgaW5wdXRPYmplY3RzLmZvckVhY2goIGZ1bmN0aW9uKCBpbnB1dCApe1xuXG4gICAgICBpZiggYXZhaWxhYmxlSW5wdXRzLmluZGV4T2YoIGlucHV0ICkgPCAwICl7XG4gICAgICAgIGF2YWlsYWJsZUlucHV0cy5wdXNoKCBpbnB1dCApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7IGhpdE9iamVjdCwgaGl0UG9pbnQgfSA9IGV4dHJhY3RIaXQoIGlucHV0ICk7XG5cbiAgICAgIHZhciBob3ZlciA9IGhpdFZvbHVtZSA9PT0gaGl0T2JqZWN0O1xuICAgICAgYW55SG92ZXIgPSBhbnlIb3ZlciB8fCBob3ZlcjtcblxuICAgICAgcGVyZm9ybVN0YXRlRXZlbnRzKHtcbiAgICAgICAgaW5wdXQsXG4gICAgICAgIGhvdmVyLFxuICAgICAgICBoaXRPYmplY3QsIGhpdFBvaW50LFxuICAgICAgICBidXR0b25OYW1lOiAncHJlc3NlZCcsXG4gICAgICAgIGludGVyYWN0aW9uTmFtZTogJ3ByZXNzJyxcbiAgICAgICAgZG93bk5hbWU6ICdvblByZXNzZWQnLFxuICAgICAgICBob2xkTmFtZTogJ3ByZXNzaW5nJyxcbiAgICAgICAgdXBOYW1lOiAnb25SZWxlYXNlZCdcbiAgICAgIH0pO1xuXG4gICAgICBwZXJmb3JtU3RhdGVFdmVudHMoe1xuICAgICAgICBpbnB1dCxcbiAgICAgICAgaG92ZXIsXG4gICAgICAgIGhpdE9iamVjdCwgaGl0UG9pbnQsXG4gICAgICAgIGJ1dHRvbk5hbWU6ICdncmlwcGVkJyxcbiAgICAgICAgaW50ZXJhY3Rpb25OYW1lOiAnZ3JpcCcsXG4gICAgICAgIGRvd25OYW1lOiAnb25HcmlwcGVkJyxcbiAgICAgICAgaG9sZE5hbWU6ICdncmlwcGluZycsXG4gICAgICAgIHVwTmFtZTogJ29uUmVsZWFzZUdyaXAnXG4gICAgICB9KTtcblxuICAgICAgZXZlbnRzLmVtaXQoICd0aWNrJywge1xuICAgICAgICBpbnB1dCxcbiAgICAgICAgaGl0T2JqZWN0LFxuICAgICAgICBpbnB1dE9iamVjdDogaW5wdXQub2JqZWN0XG4gICAgICB9ICk7XG5cbiAgICB9KTtcblxuICB9XG5cbiAgZnVuY3Rpb24gZXh0cmFjdEhpdCggaW5wdXQgKXtcbiAgICBpZiggaW5wdXQuaW50ZXJzZWN0aW9ucy5sZW5ndGggPD0gMCApe1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaGl0UG9pbnQ6IHRWZWN0b3Iuc2V0RnJvbU1hdHJpeFBvc2l0aW9uKCBpbnB1dC5jdXJzb3IubWF0cml4V29ybGQgKS5jbG9uZSgpLFxuICAgICAgICBoaXRPYmplY3Q6IHVuZGVmaW5lZCxcbiAgICAgIH07XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBoaXRQb2ludDogaW5wdXQuaW50ZXJzZWN0aW9uc1sgMCBdLnBvaW50LFxuICAgICAgICBoaXRPYmplY3Q6IGlucHV0LmludGVyc2VjdGlvbnNbIDAgXS5vYmplY3RcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGVyZm9ybVN0YXRlRXZlbnRzKHtcbiAgICBpbnB1dCwgaG92ZXIsXG4gICAgaGl0T2JqZWN0LCBoaXRQb2ludCxcbiAgICBidXR0b25OYW1lLCBpbnRlcmFjdGlvbk5hbWUsIGRvd25OYW1lLCBob2xkTmFtZSwgdXBOYW1lXG4gIH0gPSB7fSApe1xuXG4gICAgaWYoIGlucHV0WyBidXR0b25OYW1lIF0gPT09IHRydWUgJiYgaGl0T2JqZWN0ID09PSB1bmRlZmluZWQgKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyAgaG92ZXJpbmcgYW5kIGJ1dHRvbiBkb3duIGJ1dCBubyBpbnRlcmFjdGlvbnMgYWN0aXZlIHlldFxuICAgIGlmKCBob3ZlciAmJiBpbnB1dFsgYnV0dG9uTmFtZSBdID09PSB0cnVlICYmIGlucHV0LmludGVyYWN0aW9uWyBpbnRlcmFjdGlvbk5hbWUgXSA9PT0gdW5kZWZpbmVkICl7XG5cbiAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgIGlucHV0LFxuICAgICAgICBoaXRPYmplY3QsXG4gICAgICAgIHBvaW50OiBoaXRQb2ludCxcbiAgICAgICAgaW5wdXRPYmplY3Q6IGlucHV0Lm9iamVjdCxcbiAgICAgICAgbG9ja2VkOiBmYWxzZVxuICAgICAgfTtcbiAgICAgIGV2ZW50cy5lbWl0KCBkb3duTmFtZSwgcGF5bG9hZCApO1xuXG4gICAgICBpZiggcGF5bG9hZC5sb2NrZWQgKXtcbiAgICAgICAgaW5wdXQuaW50ZXJhY3Rpb25bIGludGVyYWN0aW9uTmFtZSBdID0gaW50ZXJhY3Rpb247XG4gICAgICAgIGlucHV0LmludGVyYWN0aW9uLmhvdmVyID0gaW50ZXJhY3Rpb247XG4gICAgICB9XG5cbiAgICAgIGFueVByZXNzaW5nID0gdHJ1ZTtcbiAgICAgIGFueUFjdGl2ZSA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gIGJ1dHRvbiBzdGlsbCBkb3duIGFuZCB0aGlzIGlzIHRoZSBhY3RpdmUgaW50ZXJhY3Rpb25cbiAgICBpZiggaW5wdXRbIGJ1dHRvbk5hbWUgXSAmJiBpbnB1dC5pbnRlcmFjdGlvblsgaW50ZXJhY3Rpb25OYW1lIF0gPT09IGludGVyYWN0aW9uICl7XG4gICAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgICBpbnB1dCxcbiAgICAgICAgaGl0T2JqZWN0LFxuICAgICAgICBwb2ludDogaGl0UG9pbnQsXG4gICAgICAgIGlucHV0T2JqZWN0OiBpbnB1dC5vYmplY3QsXG4gICAgICAgIGxvY2tlZDogZmFsc2VcbiAgICAgIH07XG5cbiAgICAgIGV2ZW50cy5lbWl0KCBob2xkTmFtZSwgcGF5bG9hZCApO1xuXG4gICAgICBhbnlQcmVzc2luZyA9IHRydWU7XG5cbiAgICAgIGlucHV0LmV2ZW50cy5lbWl0KCAnb25Db250cm9sbGVySGVsZCcgKTtcbiAgICB9XG5cbiAgICAvLyAgYnV0dG9uIG5vdCBkb3duIGFuZCB0aGlzIGlzIHRoZSBhY3RpdmUgaW50ZXJhY3Rpb25cbiAgICBpZiggaW5wdXRbIGJ1dHRvbk5hbWUgXSA9PT0gZmFsc2UgJiYgaW5wdXQuaW50ZXJhY3Rpb25bIGludGVyYWN0aW9uTmFtZSBdID09PSBpbnRlcmFjdGlvbiApe1xuICAgICAgaW5wdXQuaW50ZXJhY3Rpb25bIGludGVyYWN0aW9uTmFtZSBdID0gdW5kZWZpbmVkO1xuICAgICAgaW5wdXQuaW50ZXJhY3Rpb24uaG92ZXIgPSB1bmRlZmluZWQ7XG4gICAgICBldmVudHMuZW1pdCggdXBOYW1lLCB7XG4gICAgICAgIGlucHV0LFxuICAgICAgICBoaXRPYmplY3QsXG4gICAgICAgIHBvaW50OiBoaXRQb2ludCxcbiAgICAgICAgaW5wdXRPYmplY3Q6IGlucHV0Lm9iamVjdFxuICAgICAgfSk7XG4gICAgfVxuXG4gIH1cblxuICBmdW5jdGlvbiBpc01haW5Ib3Zlcigpe1xuXG4gICAgbGV0IG5vTWFpbkhvdmVyID0gdHJ1ZTtcbiAgICBmb3IoIGxldCBpPTA7IGk8YXZhaWxhYmxlSW5wdXRzLmxlbmd0aDsgaSsrICl7XG4gICAgICBpZiggYXZhaWxhYmxlSW5wdXRzWyBpIF0uaW50ZXJhY3Rpb24uaG92ZXIgIT09IHVuZGVmaW5lZCApe1xuICAgICAgICBub01haW5Ib3ZlciA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiggbm9NYWluSG92ZXIgKXtcbiAgICAgIHJldHVybiBhbnlIb3ZlcjtcbiAgICB9XG5cbiAgICBpZiggYXZhaWxhYmxlSW5wdXRzLmZpbHRlciggZnVuY3Rpb24oIGlucHV0ICl7XG4gICAgICByZXR1cm4gaW5wdXQuaW50ZXJhY3Rpb24uaG92ZXIgPT09IGludGVyYWN0aW9uO1xuICAgIH0pLmxlbmd0aCA+IDAgKXtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG5cbiAgY29uc3QgaW50ZXJhY3Rpb24gPSB7XG4gICAgaG92ZXJpbmc6IGlzTWFpbkhvdmVyLFxuICAgIHByZXNzaW5nOiAoKT0+YW55UHJlc3NpbmcsXG4gICAgdXBkYXRlLFxuICAgIGV2ZW50c1xuICB9O1xuXG4gIHJldHVybiBpbnRlcmFjdGlvbjtcbn0iLCIvKipcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXG4qXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxuKlxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuKlxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4qXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gYWxpZ25MZWZ0KCBvYmogKXtcbiAgaWYoIG9iaiBpbnN0YW5jZW9mIFRIUkVFLk1lc2ggKXtcbiAgICBvYmouZ2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nQm94KCk7XG4gICAgY29uc3Qgd2lkdGggPSBvYmouZ2VvbWV0cnkuYm91bmRpbmdCb3gubWF4LnggLSBvYmouZ2VvbWV0cnkuYm91bmRpbmdCb3gubWF4Lnk7XG4gICAgb2JqLmdlb21ldHJ5LnRyYW5zbGF0ZSggd2lkdGgsIDAsIDAgKTtcbiAgICByZXR1cm4gb2JqO1xuICB9XG4gIGVsc2UgaWYoIG9iaiBpbnN0YW5jZW9mIFRIUkVFLkdlb21ldHJ5ICl7XG4gICAgb2JqLmNvbXB1dGVCb3VuZGluZ0JveCgpO1xuICAgIGNvbnN0IHdpZHRoID0gb2JqLmJvdW5kaW5nQm94Lm1heC54IC0gb2JqLmJvdW5kaW5nQm94Lm1heC55O1xuICAgIG9iai50cmFuc2xhdGUoIHdpZHRoLCAwLCAwICk7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUGFuZWwoIHdpZHRoLCBoZWlnaHQsIGRlcHRoLCB1bmlxdWVNYXRlcmlhbCApe1xuICBjb25zdCBtYXRlcmlhbCA9IHVuaXF1ZU1hdGVyaWFsID8gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtjb2xvcjoweGZmZmZmZn0pIDogU2hhcmVkTWF0ZXJpYWxzLlBBTkVMO1xuICBjb25zdCBwYW5lbCA9IG5ldyBUSFJFRS5NZXNoKCBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIHdpZHRoLCBoZWlnaHQsIGRlcHRoICksIG1hdGVyaWFsICk7XG4gIHBhbmVsLmdlb21ldHJ5LnRyYW5zbGF0ZSggd2lkdGggKiAwLjUsIDAsIDAgKTtcblxuICBpZiggdW5pcXVlTWF0ZXJpYWwgKXtcbiAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ERUZBVUxUX0JBQ0sgKTtcbiAgfVxuICBlbHNle1xuICAgIENvbG9ycy5jb2xvcml6ZUdlb21ldHJ5KCBwYW5lbC5nZW9tZXRyeSwgQ29sb3JzLkRFRkFVTFRfQkFDSyApO1xuICB9XG5cbiAgcGFuZWwudXNlckRhdGEuY3VycmVudFdpZHRoID0gd2lkdGg7XG4gIHBhbmVsLnVzZXJEYXRhLmN1cnJlbnRIZWlnaHQgPSBoZWlnaHQ7XG4gIHBhbmVsLnVzZXJEYXRhLmN1cnJlbnREZXB0aCA9IGRlcHRoO1xuXG4gIHJldHVybiBwYW5lbDtcbn1cbmV4cG9ydCBmdW5jdGlvbiByZXNpemVQYW5lbChwYW5lbCwgd2lkdGgsIGhlaWdodCwgZGVwdGgpIHtcbiAgcGFuZWwuZ2VvbWV0cnkuc2NhbGUod2lkdGgvcGFuZWwudXNlckRhdGEuY3VycmVudFdpZHRoLCBoZWlnaHQvcGFuZWwudXNlckRhdGEuY3VycmVudEhlaWdodCwgZGVwdGgvcGFuZWwudXNlckRhdGEuY3VycmVudERlcHRoKTtcbiAgcGFuZWwudXNlckRhdGEuY3VycmVudFdpZHRoID0gd2lkdGg7XG4gIHBhbmVsLnVzZXJEYXRhLmN1cnJlbnRIZWlnaHQgPSBoZWlnaHQ7XG4gIHBhbmVsLnVzZXJEYXRhLmN1cnJlbnREZXB0aCA9IGRlcHRoO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29udHJvbGxlcklEQm94KCBoZWlnaHQsIGNvbG9yICl7XG4gIGNvbnN0IHBhbmVsID0gbmV3IFRIUkVFLk1lc2goIG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggQ09OVFJPTExFUl9JRF9XSURUSCwgaGVpZ2h0LCBDT05UUk9MTEVSX0lEX0RFUFRIICksIFNoYXJlZE1hdGVyaWFscy5QQU5FTCApO1xuICBwYW5lbC5nZW9tZXRyeS50cmFuc2xhdGUoIENPTlRST0xMRVJfSURfV0lEVEggKiAwLjUsIDAsIDAgKTtcbiAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIHBhbmVsLmdlb21ldHJ5LCBjb2xvciApO1xuICByZXR1cm4gcGFuZWw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVEb3duQXJyb3coKXtcbiAgY29uc3QgdyA9IDAuMDA5NjtcbiAgY29uc3QgaCA9IDAuMDE2O1xuICBjb25zdCBzaCA9IG5ldyBUSFJFRS5TaGFwZSgpO1xuICBzaC5tb3ZlVG8oMCwwKTtcbiAgc2gubGluZVRvKC13LGgpO1xuICBzaC5saW5lVG8odyxoKTtcbiAgc2gubGluZVRvKDAsMCk7XG5cbiAgY29uc3QgZ2VvID0gbmV3IFRIUkVFLlNoYXBlR2VvbWV0cnkoIHNoICk7XG4gIGdlby50cmFuc2xhdGUoIDAsIC1oICogMC41LCAwICk7XG5cbiAgcmV0dXJuIG5ldyBUSFJFRS5NZXNoKCBnZW8sIFNoYXJlZE1hdGVyaWFscy5QQU5FTCApO1xufVxuXG5leHBvcnQgY29uc3QgUEFORUxfV0lEVEggPSAxLjA7XG5leHBvcnQgY29uc3QgUEFORUxfSEVJR0hUID0gMC4wODtcbmV4cG9ydCBjb25zdCBQQU5FTF9ERVBUSCA9IDAuMDE7XG5leHBvcnQgY29uc3QgUEFORUxfU1BBQ0lORyA9IDAuMDAxO1xuZXhwb3J0IGNvbnN0IFBBTkVMX01BUkdJTiA9IDAuMDE1O1xuZXhwb3J0IGNvbnN0IFBBTkVMX0xBQkVMX1RFWFRfTUFSR0lOID0gMC4wNjtcbmV4cG9ydCBjb25zdCBQQU5FTF9WQUxVRV9URVhUX01BUkdJTiA9IDAuMDI7XG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9XSURUSCA9IDAuMDI7XG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9ERVBUSCA9IDAuMDAxO1xuZXhwb3J0IGNvbnN0IEJVVFRPTl9ERVBUSCA9IDAuMDE7XG5leHBvcnQgY29uc3QgRk9MREVSX1dJRFRIID0gMS4wMjY7XG5leHBvcnQgY29uc3QgU1VCRk9MREVSX1dJRFRIID0gMS4wO1xuZXhwb3J0IGNvbnN0IEZPTERFUl9IRUlHSFQgPSAwLjA5O1xuZXhwb3J0IGNvbnN0IEZPTERFUl9HUkFCX0hFSUdIVCA9IDAuMDUxMjtcbmV4cG9ydCBjb25zdCBCT1JERVJfVEhJQ0tORVNTID0gMC4wMTtcbmV4cG9ydCBjb25zdCBDSEVDS0JPWF9TSVpFID0gMC4wNTsiLCIvKipcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXG4qXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxuKlxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuKlxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4qXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSA9IHt9ICl7XG5cbiAgY29uc3QgaW50ZXJhY3Rpb24gPSBjcmVhdGVJbnRlcmFjdGlvbiggcGFuZWwgKTtcblxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvbkdyaXBwZWQnLCBoYW5kbGVPbkdyaXAgKTtcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25SZWxlYXNlR3JpcCcsIGhhbmRsZU9uR3JpcFJlbGVhc2UgKTtcblxuICBsZXQgb2xkUGFyZW50O1xuICBsZXQgb2xkUG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICBsZXQgb2xkUm90YXRpb24gPSBuZXcgVEhSRUUuRXVsZXIoKTtcblxuICBjb25zdCByb3RhdGlvbkdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG4gIHJvdGF0aW9uR3JvdXAuc2NhbGUuc2V0KCAwLjMsIDAuMywgMC4zICk7XG4gIHJvdGF0aW9uR3JvdXAucG9zaXRpb24uc2V0KCAtMC4wMTUsIDAuMDE1LCAwLjAgKTtcblxuXG4gIGZ1bmN0aW9uIGhhbmRsZU9uR3JpcCggcCApe1xuXG4gICAgY29uc3QgeyBpbnB1dE9iamVjdCwgaW5wdXQgfSA9IHA7XG5cbiAgICBjb25zdCBmb2xkZXIgPSBncm91cC5mb2xkZXI7XG4gICAgaWYoIGZvbGRlciA9PT0gdW5kZWZpbmVkICl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYoIGZvbGRlci5iZWluZ01vdmVkID09PSB0cnVlICl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgb2xkUG9zaXRpb24uY29weSggZm9sZGVyLnBvc2l0aW9uICk7XG4gICAgb2xkUm90YXRpb24uY29weSggZm9sZGVyLnJvdGF0aW9uICk7XG5cbiAgICBmb2xkZXIucG9zaXRpb24uc2V0KCAwLDAsMCApO1xuICAgIGZvbGRlci5yb3RhdGlvbi5zZXQoIDAsMCwwICk7XG4gICAgZm9sZGVyLnJvdGF0aW9uLnggPSAtTWF0aC5QSSAqIDAuNTtcblxuICAgIG9sZFBhcmVudCA9IGZvbGRlci5wYXJlbnQ7XG5cbiAgICByb3RhdGlvbkdyb3VwLmFkZCggZm9sZGVyICk7XG5cbiAgICBpbnB1dE9iamVjdC5hZGQoIHJvdGF0aW9uR3JvdXAgKTtcblxuICAgIHAubG9ja2VkID0gdHJ1ZTtcblxuICAgIGZvbGRlci5iZWluZ01vdmVkID0gdHJ1ZTtcblxuICAgIGlucHV0LmV2ZW50cy5lbWl0KCAncGlubmVkJywgaW5wdXQgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZU9uR3JpcFJlbGVhc2UoIHsgaW5wdXRPYmplY3QsIGlucHV0IH09e30gKXtcblxuICAgIGNvbnN0IGZvbGRlciA9IGdyb3VwLmZvbGRlcjtcbiAgICBpZiggZm9sZGVyID09PSB1bmRlZmluZWQgKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiggb2xkUGFyZW50ID09PSB1bmRlZmluZWQgKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiggZm9sZGVyLmJlaW5nTW92ZWQgPT09IGZhbHNlICl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgb2xkUGFyZW50LmFkZCggZm9sZGVyICk7XG4gICAgb2xkUGFyZW50ID0gdW5kZWZpbmVkO1xuXG4gICAgZm9sZGVyLnBvc2l0aW9uLmNvcHkoIG9sZFBvc2l0aW9uICk7XG4gICAgZm9sZGVyLnJvdGF0aW9uLmNvcHkoIG9sZFJvdGF0aW9uICk7XG5cbiAgICBmb2xkZXIuYmVpbmdNb3ZlZCA9IGZhbHNlO1xuXG4gICAgaW5wdXQuZXZlbnRzLmVtaXQoICdwaW5SZWxlYXNlZCcsIGlucHV0ICk7XG4gIH1cblxuICByZXR1cm4gaW50ZXJhY3Rpb247XG59IiwiLyoqXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxuKlxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cbipcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbipcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuKlxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG5pbXBvcnQgU0RGU2hhZGVyIGZyb20gJ3RocmVlLWJtZm9udC10ZXh0L3NoYWRlcnMvc2RmJztcbmltcG9ydCBjcmVhdGVHZW9tZXRyeSBmcm9tICd0aHJlZS1ibWZvbnQtdGV4dCc7XG5pbXBvcnQgcGFyc2VBU0NJSSBmcm9tICdwYXJzZS1ibWZvbnQtYXNjaWknO1xuXG5pbXBvcnQgKiBhcyBGb250IGZyb20gJy4vZm9udCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNYXRlcmlhbCggY29sb3IgKXtcblxuICBjb25zdCB0ZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUoKTtcbiAgY29uc3QgaW1hZ2UgPSBGb250LmltYWdlKCk7XG4gIHRleHR1cmUuaW1hZ2UgPSBpbWFnZTtcbiAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG4gIHRleHR1cmUubWluRmlsdGVyID0gVEhSRUUuTGluZWFyRmlsdGVyO1xuICB0ZXh0dXJlLm1hZ0ZpbHRlciA9IFRIUkVFLkxpbmVhckZpbHRlcjtcbiAgdGV4dHVyZS5nZW5lcmF0ZU1pcG1hcHMgPSBmYWxzZTtcblxuICByZXR1cm4gbmV3IFRIUkVFLlJhd1NoYWRlck1hdGVyaWFsKFNERlNoYWRlcih7XG4gICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZSxcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICBjb2xvcjogY29sb3IsXG4gICAgbWFwOiB0ZXh0dXJlXG4gIH0pKTtcbn1cblxuY29uc3QgdGV4dFNjYWxlID0gMC4wMDAyNDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0b3IoKXtcblxuICBjb25zdCBmb250ID0gcGFyc2VBU0NJSSggRm9udC5mbnQoKSApO1xuXG4gIGNvbnN0IGNvbG9yTWF0ZXJpYWxzID0ge307XG5cbiAgZnVuY3Rpb24gY3JlYXRlVGV4dCggc3RyLCBmb250LCBjb2xvciA9IDB4ZmZmZmZmLCBzY2FsZSA9IDEuMCApe1xuXG4gICAgY29uc3QgZ2VvbWV0cnkgPSBjcmVhdGVHZW9tZXRyeSh7XG4gICAgICB0ZXh0OiBzdHIsXG4gICAgICBhbGlnbjogJ2xlZnQnLFxuICAgICAgd2lkdGg6IDEwMDAwLFxuICAgICAgZmxpcFk6IHRydWUsXG4gICAgICBmb250XG4gICAgfSk7XG5cblxuICAgIGNvbnN0IGxheW91dCA9IGdlb21ldHJ5LmxheW91dDtcblxuICAgIGxldCBtYXRlcmlhbCA9IGNvbG9yTWF0ZXJpYWxzWyBjb2xvciBdO1xuICAgIGlmKCBtYXRlcmlhbCA9PT0gdW5kZWZpbmVkICl7XG4gICAgICBtYXRlcmlhbCA9IGNvbG9yTWF0ZXJpYWxzWyBjb2xvciBdID0gY3JlYXRlTWF0ZXJpYWwoIGNvbG9yICk7XG4gICAgfVxuICAgIGNvbnN0IG1lc2ggPSBuZXcgVEhSRUUuTWVzaCggZ2VvbWV0cnksIG1hdGVyaWFsICk7XG4gICAgbWVzaC5zY2FsZS5tdWx0aXBseSggbmV3IFRIUkVFLlZlY3RvcjMoMSwtMSwxKSApO1xuXG4gICAgY29uc3QgZmluYWxTY2FsZSA9IHNjYWxlICogdGV4dFNjYWxlO1xuXG4gICAgbWVzaC5zY2FsZS5tdWx0aXBseVNjYWxhciggZmluYWxTY2FsZSApO1xuXG4gICAgbWVzaC5wb3NpdGlvbi55ID0gbGF5b3V0LmhlaWdodCAqIDAuNSAqIGZpbmFsU2NhbGU7XG5cbiAgICByZXR1cm4gbWVzaDtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gY3JlYXRlKCBzdHIsIHsgY29sb3I9MHhmZmZmZmYsIHNjYWxlPTEuMCB9ID0ge30gKXtcbiAgICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuXG4gICAgbGV0IG1lc2ggPSBjcmVhdGVUZXh0KCBzdHIsIGZvbnQsIGNvbG9yLCBzY2FsZSApO1xuICAgIGdyb3VwLmFkZCggbWVzaCApO1xuICAgIGdyb3VwLmxheW91dCA9IG1lc2guZ2VvbWV0cnkubGF5b3V0O1xuXG4gICAgZ3JvdXAudXBkYXRlTGFiZWwgPSBmdW5jdGlvbiggc3RyICl7XG4gICAgICBtZXNoLmdlb21ldHJ5LnVwZGF0ZSggc3RyICk7XG4gICAgfTtcblxuICAgIHJldHVybiBncm91cDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY3JlYXRlLFxuICAgIGdldE1hdGVyaWFsOiAoKT0+IG1hdGVyaWFsXG4gIH1cblxufSIsIi8qKlxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcbipcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXG4qXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbipcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cblxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcblxuZXhwb3J0IGNvbnN0IFBBTkVMID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCB7IGNvbG9yOiAweGZmZmZmZiwgdmVydGV4Q29sb3JzOiBUSFJFRS5WZXJ0ZXhDb2xvcnMgfSApO1xuZXhwb3J0IGNvbnN0IExPQ0FUT1IgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoKTtcbmV4cG9ydCBjb25zdCBGT0xERVIgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoIHsgY29sb3I6IDB4MDAwMDAwIH0gKTsiLCIvKipcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXG4qXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxuKlxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuKlxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4qXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbmltcG9ydCBjcmVhdGVUZXh0TGFiZWwgZnJvbSAnLi90ZXh0bGFiZWwnO1xuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcbmltcG9ydCAqIGFzIExheW91dCBmcm9tICcuL2xheW91dCc7XG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xuaW1wb3J0ICogYXMgR3JhYiBmcm9tICcuL2dyYWInO1xuaW1wb3J0ICogYXMgUGFsZXR0ZSBmcm9tICcuL3BhbGV0dGUnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVTbGlkZXIoIHtcbiAgdGV4dENyZWF0b3IsXG4gIG9iamVjdCxcbiAgcHJvcGVydHlOYW1lID0gJ3VuZGVmaW5lZCcsXG4gIGluaXRpYWxWYWx1ZSA9IDAuMCxcbiAgbWluID0gMC4wLCBtYXggPSAxLjAsXG4gIHN0ZXAgPSAwLjEsXG4gIHdpZHRoID0gTGF5b3V0LlBBTkVMX1dJRFRILFxuICBoZWlnaHQgPSBMYXlvdXQuUEFORUxfSEVJR0hULFxuICBkZXB0aCA9IExheW91dC5QQU5FTF9ERVBUSFxufSA9IHt9ICl7XG5cblxuICBjb25zdCBTTElERVJfV0lEVEggPSB3aWR0aCAqIDAuNSAtIExheW91dC5QQU5FTF9NQVJHSU47XG4gIGNvbnN0IFNMSURFUl9IRUlHSFQgPSBoZWlnaHQgLSBMYXlvdXQuUEFORUxfTUFSR0lOO1xuICBjb25zdCBTTElERVJfREVQVEggPSBkZXB0aDtcblxuICBjb25zdCBzdGF0ZSA9IHtcbiAgICBhbHBoYTogMS4wLFxuICAgIHZhbHVlOiBpbml0aWFsVmFsdWUsXG4gICAgc3RlcDogc3RlcCxcbiAgICB1c2VTdGVwOiB0cnVlLFxuICAgIHByZWNpc2lvbjogMSxcbiAgICBsaXN0ZW46IGZhbHNlLFxuICAgIG1pbjogbWluLFxuICAgIG1heDogbWF4LFxuICAgIG9uQ2hhbmdlZENCOiB1bmRlZmluZWQsXG4gICAgb25GaW5pc2hlZENoYW5nZTogdW5kZWZpbmVkLFxuICAgIHByZXNzaW5nOiBmYWxzZVxuICB9O1xuXG4gIHN0YXRlLnN0ZXAgPSBnZXRJbXBsaWVkU3RlcCggc3RhdGUudmFsdWUgKTtcbiAgc3RhdGUucHJlY2lzaW9uID0gbnVtRGVjaW1hbHMoIHN0YXRlLnN0ZXAgKTtcbiAgc3RhdGUuYWxwaGEgPSBnZXRBbHBoYUZyb21WYWx1ZSggc3RhdGUudmFsdWUsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICk7XG5cbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcblxuICAvLyAgZmlsbGVkIHZvbHVtZVxuICBjb25zdCByZWN0ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KCBTTElERVJfV0lEVEgsIFNMSURFUl9IRUlHSFQsIFNMSURFUl9ERVBUSCApO1xuICByZWN0LnRyYW5zbGF0ZShTTElERVJfV0lEVEgqMC41LDAsMCk7XG4gIC8vIExheW91dC5hbGlnbkxlZnQoIHJlY3QgKTtcblxuICBjb25zdCBoaXRzY2FuTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoKTtcbiAgaGl0c2Nhbk1hdGVyaWFsLnZpc2libGUgPSBmYWxzZTtcblxuICBjb25zdCBoaXRzY2FuVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgaGl0c2Nhbk1hdGVyaWFsICk7XG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueiA9IGRlcHRoO1xuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnggPSB3aWR0aCAqIDAuNTtcbiAgaGl0c2NhblZvbHVtZS5uYW1lID0gJ2hpdHNjYW5Wb2x1bWUnO1xuXG4gIC8vICBzbGlkZXJCRyB2b2x1bWVcbiAgY29uc3Qgc2xpZGVyQkcgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBTaGFyZWRNYXRlcmlhbHMuUEFORUwgKTtcbiAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIHNsaWRlckJHLmdlb21ldHJ5LCBDb2xvcnMuU0xJREVSX0JHICk7XG4gIHNsaWRlckJHLnBvc2l0aW9uLnogPSBkZXB0aCAqIDAuNTtcbiAgc2xpZGVyQkcucG9zaXRpb24ueCA9IFNMSURFUl9XSURUSCArIExheW91dC5QQU5FTF9NQVJHSU47XG5cbiAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogQ29sb3JzLkRFRkFVTFRfQ09MT1IgfSk7XG4gIGNvbnN0IGZpbGxlZFZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIG1hdGVyaWFsICk7XG4gIGZpbGxlZFZvbHVtZS5wb3NpdGlvbi56ID0gZGVwdGggKiAwLjU7XG4gIGhpdHNjYW5Wb2x1bWUuYWRkKCBmaWxsZWRWb2x1bWUgKTtcblxuICBjb25zdCBlbmRMb2NhdG9yID0gbmV3IFRIUkVFLk1lc2goIG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggMC4wNSwgMC4wNSwgMC4wNSwgMSwgMSwgMSApLCBTaGFyZWRNYXRlcmlhbHMuTE9DQVRPUiApO1xuICBlbmRMb2NhdG9yLnBvc2l0aW9uLnggPSBTTElERVJfV0lEVEg7XG4gIGhpdHNjYW5Wb2x1bWUuYWRkKCBlbmRMb2NhdG9yICk7XG4gIGVuZExvY2F0b3IudmlzaWJsZSA9IGZhbHNlO1xuXG4gIGNvbnN0IHZhbHVlTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHN0YXRlLnZhbHVlLnRvU3RyaW5nKCkgKTtcbiAgdmFsdWVMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX1ZBTFVFX1RFWFRfTUFSR0lOICsgd2lkdGggKiAwLjU7XG4gIHZhbHVlTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoKjIuNTtcbiAgdmFsdWVMYWJlbC5wb3NpdGlvbi55ID0gLTAuMDMyNTtcblxuICBjb25zdCBkZXNjcmlwdG9yTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHByb3BlcnR5TmFtZSApO1xuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9MQUJFTF9URVhUX01BUkdJTjtcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnkgPSAtMC4wMztcblxuICBjb25zdCBjb250cm9sbGVySUQgPSBMYXlvdXQuY3JlYXRlQ29udHJvbGxlcklEQm94KCBoZWlnaHQsIENvbG9ycy5DT05UUk9MTEVSX0lEX1NMSURFUiApO1xuICBjb250cm9sbGVySUQucG9zaXRpb24ueiA9IGRlcHRoO1xuXG4gIGNvbnN0IHBhbmVsID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApO1xuICBwYW5lbC5uYW1lID0gJ3BhbmVsJztcbiAgcGFuZWwuYWRkKCBkZXNjcmlwdG9yTGFiZWwsIGhpdHNjYW5Wb2x1bWUsIHNsaWRlckJHLCB2YWx1ZUxhYmVsLCBjb250cm9sbGVySUQgKTtcblxuICBncm91cC5hZGQoIHBhbmVsIClcblxuICB1cGRhdGVWYWx1ZUxhYmVsKCBzdGF0ZS52YWx1ZSApO1xuICB1cGRhdGVTbGlkZXIoKTtcblxuICBmdW5jdGlvbiB1cGRhdGVWYWx1ZUxhYmVsKCB2YWx1ZSApe1xuICAgIGlmKCBzdGF0ZS51c2VTdGVwICl7XG4gICAgICB2YWx1ZUxhYmVsLnVwZGF0ZUxhYmVsKCByb3VuZFRvRGVjaW1hbCggc3RhdGUudmFsdWUsIHN0YXRlLnByZWNpc2lvbiApLnRvU3RyaW5nKCkgKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIHZhbHVlTGFiZWwudXBkYXRlTGFiZWwoIHN0YXRlLnZhbHVlLnRvU3RyaW5nKCkgKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XG4gICAgaWYoIHN0YXRlLnByZXNzaW5nICl7XG4gICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5JTlRFUkFDVElPTl9DT0xPUiApO1xuICAgIH1cbiAgICBlbHNlXG4gICAgaWYoIGludGVyYWN0aW9uLmhvdmVyaW5nKCkgKXtcbiAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkhJR0hMSUdIVF9DT0xPUiApO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuREVGQVVMVF9DT0xPUiApO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZVNsaWRlcigpe1xuICAgIGZpbGxlZFZvbHVtZS5zY2FsZS54ID1cbiAgICAgIE1hdGgubWluKFxuICAgICAgICBNYXRoLm1heCggZ2V0QWxwaGFGcm9tVmFsdWUoIHN0YXRlLnZhbHVlLCBzdGF0ZS5taW4sIHN0YXRlLm1heCApICogd2lkdGgsIDAuMDAwMDAxICksXG4gICAgICAgIHdpZHRoXG4gICAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlT2JqZWN0KCB2YWx1ZSApe1xuICAgIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gPSB2YWx1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZVN0YXRlRnJvbUFscGhhKCBhbHBoYSApe1xuICAgIHN0YXRlLmFscGhhID0gZ2V0Q2xhbXBlZEFscGhhKCBhbHBoYSApO1xuICAgIHN0YXRlLnZhbHVlID0gZ2V0VmFsdWVGcm9tQWxwaGEoIHN0YXRlLmFscGhhLCBzdGF0ZS5taW4sIHN0YXRlLm1heCApO1xuICAgIGlmKCBzdGF0ZS51c2VTdGVwICl7XG4gICAgICBzdGF0ZS52YWx1ZSA9IGdldFN0ZXBwZWRWYWx1ZSggc3RhdGUudmFsdWUsIHN0YXRlLnN0ZXAgKTtcbiAgICB9XG4gICAgc3RhdGUudmFsdWUgPSBnZXRDbGFtcGVkVmFsdWUoIHN0YXRlLnZhbHVlLCBzdGF0ZS5taW4sIHN0YXRlLm1heCApO1xuICB9XG5cbiAgZnVuY3Rpb24gbGlzdGVuVXBkYXRlKCl7XG4gICAgc3RhdGUudmFsdWUgPSBnZXRWYWx1ZUZyb21PYmplY3QoKTtcbiAgICBzdGF0ZS5hbHBoYSA9IGdldEFscGhhRnJvbVZhbHVlKCBzdGF0ZS52YWx1ZSwgc3RhdGUubWluLCBzdGF0ZS5tYXggKTtcbiAgICBzdGF0ZS5hbHBoYSA9IGdldENsYW1wZWRBbHBoYSggc3RhdGUuYWxwaGEgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFZhbHVlRnJvbU9iamVjdCgpe1xuICAgIHJldHVybiBwYXJzZUZsb2F0KCBvYmplY3RbIHByb3BlcnR5TmFtZSBdICk7XG4gIH1cblxuICBncm91cC5vbkNoYW5nZSA9IGZ1bmN0aW9uKCBjYWxsYmFjayApe1xuICAgIHN0YXRlLm9uQ2hhbmdlZENCID0gY2FsbGJhY2s7XG4gICAgcmV0dXJuIGdyb3VwO1xuICB9O1xuXG4gIGdyb3VwLnN0ZXAgPSBmdW5jdGlvbiggc3RlcCApe1xuICAgIHN0YXRlLnN0ZXAgPSBzdGVwO1xuICAgIHN0YXRlLnByZWNpc2lvbiA9IG51bURlY2ltYWxzKCBzdGF0ZS5zdGVwIClcbiAgICBzdGF0ZS51c2VTdGVwID0gdHJ1ZTtcblxuICAgIHN0YXRlLmFscGhhID0gZ2V0QWxwaGFGcm9tVmFsdWUoIHN0YXRlLnZhbHVlLCBzdGF0ZS5taW4sIHN0YXRlLm1heCApO1xuXG4gICAgdXBkYXRlU3RhdGVGcm9tQWxwaGEoIHN0YXRlLmFscGhhICk7XG4gICAgdXBkYXRlVmFsdWVMYWJlbCggc3RhdGUudmFsdWUgKTtcbiAgICB1cGRhdGVTbGlkZXIoICk7XG4gICAgcmV0dXJuIGdyb3VwO1xuICB9O1xuXG4gIGdyb3VwLmxpc3RlbiA9IGZ1bmN0aW9uKCl7XG4gICAgc3RhdGUubGlzdGVuID0gdHJ1ZTtcbiAgICByZXR1cm4gZ3JvdXA7XG4gIH07XG5cbiAgY29uc3QgaW50ZXJhY3Rpb24gPSBjcmVhdGVJbnRlcmFjdGlvbiggaGl0c2NhblZvbHVtZSApO1xuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblByZXNzZWQnLCBoYW5kbGVQcmVzcyApO1xuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdwcmVzc2luZycsIGhhbmRsZUhvbGQgKTtcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25SZWxlYXNlZCcsIGhhbmRsZVJlbGVhc2UgKTtcblxuICBmdW5jdGlvbiBoYW5kbGVQcmVzcyggcCApe1xuICAgIGlmKCBncm91cC52aXNpYmxlID09PSBmYWxzZSApe1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzdGF0ZS5wcmVzc2luZyA9IHRydWU7XG4gICAgcC5sb2NrZWQgPSB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlSG9sZCggeyBwb2ludCB9ID0ge30gKXtcbiAgICBpZiggZ3JvdXAudmlzaWJsZSA9PT0gZmFsc2UgKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzdGF0ZS5wcmVzc2luZyA9IHRydWU7XG5cbiAgICBmaWxsZWRWb2x1bWUudXBkYXRlTWF0cml4V29ybGQoKTtcbiAgICBlbmRMb2NhdG9yLnVwZGF0ZU1hdHJpeFdvcmxkKCk7XG5cbiAgICBjb25zdCBhID0gbmV3IFRIUkVFLlZlY3RvcjMoKS5zZXRGcm9tTWF0cml4UG9zaXRpb24oIGZpbGxlZFZvbHVtZS5tYXRyaXhXb3JsZCApO1xuICAgIGNvbnN0IGIgPSBuZXcgVEhSRUUuVmVjdG9yMygpLnNldEZyb21NYXRyaXhQb3NpdGlvbiggZW5kTG9jYXRvci5tYXRyaXhXb3JsZCApO1xuXG4gICAgY29uc3QgcHJldmlvdXNWYWx1ZSA9IHN0YXRlLnZhbHVlO1xuXG4gICAgdXBkYXRlU3RhdGVGcm9tQWxwaGEoIGdldFBvaW50QWxwaGEoIHBvaW50LCB7YSxifSApICk7XG4gICAgdXBkYXRlVmFsdWVMYWJlbCggc3RhdGUudmFsdWUgKTtcbiAgICB1cGRhdGVTbGlkZXIoICk7XG4gICAgdXBkYXRlT2JqZWN0KCBzdGF0ZS52YWx1ZSApO1xuXG4gICAgaWYoIHByZXZpb3VzVmFsdWUgIT09IHN0YXRlLnZhbHVlICYmIHN0YXRlLm9uQ2hhbmdlZENCICl7XG4gICAgICBzdGF0ZS5vbkNoYW5nZWRDQiggc3RhdGUudmFsdWUgKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVSZWxlYXNlKCl7XG4gICAgc3RhdGUucHJlc3NpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIGdyb3VwLmludGVyYWN0aW9uID0gaW50ZXJhY3Rpb247XG4gIGdyb3VwLmhpdHNjYW4gPSBbIGhpdHNjYW5Wb2x1bWUsIHBhbmVsIF07XG5cbiAgY29uc3QgZ3JhYkludGVyYWN0aW9uID0gR3JhYi5jcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gKTtcbiAgY29uc3QgcGFsZXR0ZUludGVyYWN0aW9uID0gUGFsZXR0ZS5jcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gKTtcblxuICBncm91cC51cGRhdGVDb250cm9sID0gZnVuY3Rpb24oIGlucHV0T2JqZWN0cyApe1xuICAgIGludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XG4gICAgcGFsZXR0ZUludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XG5cbiAgICBpZiggc3RhdGUubGlzdGVuICl7XG4gICAgICBsaXN0ZW5VcGRhdGUoKTtcbiAgICAgIHVwZGF0ZVZhbHVlTGFiZWwoIHN0YXRlLnZhbHVlICk7XG4gICAgICB1cGRhdGVTbGlkZXIoKTtcbiAgICB9XG4gICAgdXBkYXRlVmlldygpO1xuICB9O1xuXG4gIGdyb3VwLm5hbWUgPSBmdW5jdGlvbiggc3RyICl7XG4gICAgZGVzY3JpcHRvckxhYmVsLnVwZGF0ZUxhYmVsKCBzdHIgKTtcbiAgICByZXR1cm4gZ3JvdXA7XG4gIH07XG5cbiAgZ3JvdXAubWluID0gZnVuY3Rpb24oIG0gKXtcbiAgICBzdGF0ZS5taW4gPSBtO1xuICAgIHN0YXRlLmFscGhhID0gZ2V0QWxwaGFGcm9tVmFsdWUoIHN0YXRlLnZhbHVlLCBzdGF0ZS5taW4sIHN0YXRlLm1heCApO1xuICAgIHVwZGF0ZVN0YXRlRnJvbUFscGhhKCBzdGF0ZS5hbHBoYSApO1xuICAgIHVwZGF0ZVZhbHVlTGFiZWwoIHN0YXRlLnZhbHVlICk7XG4gICAgdXBkYXRlU2xpZGVyKCApO1xuICAgIHJldHVybiBncm91cDtcbiAgfTtcblxuICBncm91cC5tYXggPSBmdW5jdGlvbiggbSApe1xuICAgIHN0YXRlLm1heCA9IG07XG4gICAgc3RhdGUuYWxwaGEgPSBnZXRBbHBoYUZyb21WYWx1ZSggc3RhdGUudmFsdWUsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICk7XG4gICAgdXBkYXRlU3RhdGVGcm9tQWxwaGEoIHN0YXRlLmFscGhhICk7XG4gICAgdXBkYXRlVmFsdWVMYWJlbCggc3RhdGUudmFsdWUgKTtcbiAgICB1cGRhdGVTbGlkZXIoICk7XG4gICAgcmV0dXJuIGdyb3VwO1xuICB9O1xuXG4gIHJldHVybiBncm91cDtcbn1cblxuY29uc3QgdGEgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuY29uc3QgdGIgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuY29uc3QgdFRvQSA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5jb25zdCBhVG9CID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcblxuZnVuY3Rpb24gZ2V0UG9pbnRBbHBoYSggcG9pbnQsIHNlZ21lbnQgKXtcbiAgdGEuY29weSggc2VnbWVudC5iICkuc3ViKCBzZWdtZW50LmEgKTtcbiAgdGIuY29weSggcG9pbnQgKS5zdWIoIHNlZ21lbnQuYSApO1xuXG4gIGNvbnN0IHByb2plY3RlZCA9IHRiLnByb2plY3RPblZlY3RvciggdGEgKTtcblxuICB0VG9BLmNvcHkoIHBvaW50ICkuc3ViKCBzZWdtZW50LmEgKTtcblxuICBhVG9CLmNvcHkoIHNlZ21lbnQuYiApLnN1Yiggc2VnbWVudC5hICkubm9ybWFsaXplKCk7XG5cbiAgY29uc3Qgc2lkZSA9IHRUb0Eubm9ybWFsaXplKCkuZG90KCBhVG9CICkgPj0gMCA/IDEgOiAtMTtcblxuICBjb25zdCBsZW5ndGggPSBzZWdtZW50LmEuZGlzdGFuY2VUbyggc2VnbWVudC5iICkgKiBzaWRlO1xuXG4gIGxldCBhbHBoYSA9IHByb2plY3RlZC5sZW5ndGgoKSAvIGxlbmd0aDtcbiAgaWYoIGFscGhhID4gMS4wICl7XG4gICAgYWxwaGEgPSAxLjA7XG4gIH1cbiAgaWYoIGFscGhhIDwgMC4wICl7XG4gICAgYWxwaGEgPSAwLjA7XG4gIH1cbiAgcmV0dXJuIGFscGhhO1xufVxuXG5mdW5jdGlvbiBsZXJwKG1pbiwgbWF4LCB2YWx1ZSkge1xuICByZXR1cm4gKDEtdmFsdWUpKm1pbiArIHZhbHVlKm1heDtcbn1cblxuZnVuY3Rpb24gbWFwX3JhbmdlKHZhbHVlLCBsb3cxLCBoaWdoMSwgbG93MiwgaGlnaDIpIHtcbiAgICByZXR1cm4gbG93MiArIChoaWdoMiAtIGxvdzIpICogKHZhbHVlIC0gbG93MSkgLyAoaGlnaDEgLSBsb3cxKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q2xhbXBlZEFscGhhKCBhbHBoYSApe1xuICBpZiggYWxwaGEgPiAxICl7XG4gICAgcmV0dXJuIDFcbiAgfVxuICBpZiggYWxwaGEgPCAwICl7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgcmV0dXJuIGFscGhhO1xufVxuXG5mdW5jdGlvbiBnZXRDbGFtcGVkVmFsdWUoIHZhbHVlLCBtaW4sIG1heCApe1xuICBpZiggdmFsdWUgPCBtaW4gKXtcbiAgICByZXR1cm4gbWluO1xuICB9XG4gIGlmKCB2YWx1ZSA+IG1heCApe1xuICAgIHJldHVybiBtYXg7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBnZXRJbXBsaWVkU3RlcCggdmFsdWUgKXtcbiAgaWYoIHZhbHVlID09PSAwICl7XG4gICAgcmV0dXJuIDE7IC8vIFdoYXQgYXJlIHdlLCBwc3ljaGljcz9cbiAgfSBlbHNlIHtcbiAgICAvLyBIZXkgRG91ZywgY2hlY2sgdGhpcyBvdXQuXG4gICAgcmV0dXJuIE1hdGgucG93KDEwLCBNYXRoLmZsb29yKE1hdGgubG9nKE1hdGguYWJzKHZhbHVlKSkvTWF0aC5MTjEwKSkvMTA7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0VmFsdWVGcm9tQWxwaGEoIGFscGhhLCBtaW4sIG1heCApe1xuICByZXR1cm4gbWFwX3JhbmdlKCBhbHBoYSwgMC4wLCAxLjAsIG1pbiwgbWF4IClcbn1cblxuZnVuY3Rpb24gZ2V0QWxwaGFGcm9tVmFsdWUoIHZhbHVlLCBtaW4sIG1heCApe1xuICByZXR1cm4gbWFwX3JhbmdlKCB2YWx1ZSwgbWluLCBtYXgsIDAuMCwgMS4wICk7XG59XG5cbmZ1bmN0aW9uIGdldFN0ZXBwZWRWYWx1ZSggdmFsdWUsIHN0ZXAgKXtcbiAgaWYoIHZhbHVlICUgc3RlcCAhPSAwKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQoIHZhbHVlIC8gc3RlcCApICogc3RlcDtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIG51bURlY2ltYWxzKHgpIHtcbiAgeCA9IHgudG9TdHJpbmcoKTtcbiAgaWYgKHguaW5kZXhPZignLicpID4gLTEpIHtcbiAgICByZXR1cm4geC5sZW5ndGggLSB4LmluZGV4T2YoJy4nKSAtIDE7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbn1cblxuZnVuY3Rpb24gcm91bmRUb0RlY2ltYWwodmFsdWUsIGRlY2ltYWxzKSB7XG4gIGNvbnN0IHRlblRvID0gTWF0aC5wb3coMTAsIGRlY2ltYWxzKTtcbiAgcmV0dXJuIE1hdGgucm91bmQodmFsdWUgKiB0ZW5UbykgLyB0ZW5Ubztcbn0iLCIvKipcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXG4qXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxuKlxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuKlxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4qXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVUZXh0TGFiZWwoIHRleHRDcmVhdG9yLCBzdHIsIHdpZHRoID0gMC40LCBkZXB0aCA9IDAuMDI5LCBmZ0NvbG9yID0gMHhmZmZmZmYsIGJnQ29sb3IgPSBDb2xvcnMuREVGQVVMVF9CQUNLLCBzY2FsZSA9IDEuMCApe1xuXG4gIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG4gIGNvbnN0IGludGVybmFsUG9zaXRpb25pbmcgPSBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgZ3JvdXAuYWRkKCBpbnRlcm5hbFBvc2l0aW9uaW5nICk7XG5cbiAgY29uc3QgdGV4dCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggc3RyLCB7IGNvbG9yOiBmZ0NvbG9yLCBzY2FsZSB9ICk7XG4gIGludGVybmFsUG9zaXRpb25pbmcuYWRkKCB0ZXh0ICk7XG5cblxuICBncm91cC5zZXRTdHJpbmcgPSBmdW5jdGlvbiggc3RyICl7XG4gICAgdGV4dC51cGRhdGVMYWJlbCggc3RyLnRvU3RyaW5nKCkgKTtcbiAgfTtcblxuICBncm91cC5zZXROdW1iZXIgPSBmdW5jdGlvbiggc3RyICl7XG4gICAgdGV4dC51cGRhdGVMYWJlbCggc3RyLnRvRml4ZWQoMikgKTtcbiAgfTtcblxuICB0ZXh0LnBvc2l0aW9uLnogPSBkZXB0aDtcblxuICBjb25zdCBiYWNrQm91bmRzID0gMC4wMTtcbiAgY29uc3QgbWFyZ2luID0gMC4wMTtcbiAgY29uc3QgdG90YWxXaWR0aCA9IHdpZHRoO1xuICBjb25zdCB0b3RhbEhlaWdodCA9IDAuMDQgKyBtYXJnaW4gKiAyO1xuICBjb25zdCBsYWJlbEJhY2tHZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggdG90YWxXaWR0aCwgdG90YWxIZWlnaHQsIGRlcHRoLCAxLCAxLCAxICk7XG4gIGxhYmVsQmFja0dlb21ldHJ5LmFwcGx5TWF0cml4KCBuZXcgVEhSRUUuTWF0cml4NCgpLm1ha2VUcmFuc2xhdGlvbiggdG90YWxXaWR0aCAqIDAuNSAtIG1hcmdpbiwgMCwgMCApICk7XG5cbiAgY29uc3QgbGFiZWxCYWNrTWVzaCA9IG5ldyBUSFJFRS5NZXNoKCBsYWJlbEJhY2tHZW9tZXRyeSwgU2hhcmVkTWF0ZXJpYWxzLlBBTkVMICk7XG4gIENvbG9ycy5jb2xvcml6ZUdlb21ldHJ5KCBsYWJlbEJhY2tNZXNoLmdlb21ldHJ5LCBiZ0NvbG9yICk7XG5cbiAgbGFiZWxCYWNrTWVzaC5wb3NpdGlvbi55ID0gMC4wMztcbiAgaW50ZXJuYWxQb3NpdGlvbmluZy5hZGQoIGxhYmVsQmFja01lc2ggKTtcbiAgaW50ZXJuYWxQb3NpdGlvbmluZy5wb3NpdGlvbi55ID0gLXRvdGFsSGVpZ2h0ICogMC41O1xuXG4gIGdyb3VwLmJhY2sgPSBsYWJlbEJhY2tNZXNoO1xuXG4gIHJldHVybiBncm91cDtcbn0iLCIvKlxuICpcdEBhdXRob3Igeno4NSAvIGh0dHA6Ly90d2l0dGVyLmNvbS9ibHVyc3BsaW5lIC8gaHR0cDovL3d3dy5sYWI0Z2FtZXMubmV0L3p6ODUvYmxvZ1xuICpcdEBhdXRob3IgY2VudGVyaW9ud2FyZSAvIGh0dHA6Ly93d3cuY2VudGVyaW9ud2FyZS5jb21cbiAqXG4gKlx0U3ViZGl2aXNpb24gR2VvbWV0cnkgTW9kaWZpZXJcbiAqXHRcdHVzaW5nIExvb3AgU3ViZGl2aXNpb24gU2NoZW1lXG4gKlxuICpcdFJlZmVyZW5jZXM6XG4gKlx0XHRodHRwOi8vZ3JhcGhpY3Muc3RhbmZvcmQuZWR1L35tZGZpc2hlci9zdWJkaXZpc2lvbi5odG1sXG4gKlx0XHRodHRwOi8vd3d3LmhvbG1lczNkLm5ldC9ncmFwaGljcy9zdWJkaXZpc2lvbi9cbiAqXHRcdGh0dHA6Ly93d3cuY3MucnV0Z2Vycy5lZHUvfmRlY2FybG8vcmVhZGluZ3Mvc3ViZGl2LXNnMDBjLnBkZlxuICpcbiAqXHRLbm93biBJc3N1ZXM6XG4gKlx0XHQtIGN1cnJlbnRseSBkb2Vzbid0IGhhbmRsZSBcIlNoYXJwIEVkZ2VzXCJcbiAqL1xuXG5USFJFRS5TdWJkaXZpc2lvbk1vZGlmaWVyID0gZnVuY3Rpb24gKCBzdWJkaXZpc2lvbnMgKSB7XG5cblx0dGhpcy5zdWJkaXZpc2lvbnMgPSAoIHN1YmRpdmlzaW9ucyA9PT0gdW5kZWZpbmVkICkgPyAxIDogc3ViZGl2aXNpb25zO1xuXG59O1xuXG4vLyBBcHBsaWVzIHRoZSBcIm1vZGlmeVwiIHBhdHRlcm5cblRIUkVFLlN1YmRpdmlzaW9uTW9kaWZpZXIucHJvdG90eXBlLm1vZGlmeSA9IGZ1bmN0aW9uICggZ2VvbWV0cnkgKSB7XG5cblx0dmFyIHJlcGVhdHMgPSB0aGlzLnN1YmRpdmlzaW9ucztcblxuXHR3aGlsZSAoIHJlcGVhdHMgLS0gPiAwICkge1xuXG5cdFx0dGhpcy5zbW9vdGgoIGdlb21ldHJ5ICk7XG5cblx0fVxuXG5cdGdlb21ldHJ5LmNvbXB1dGVGYWNlTm9ybWFscygpO1xuXHRnZW9tZXRyeS5jb21wdXRlVmVydGV4Tm9ybWFscygpO1xuXG59O1xuXG4oIGZ1bmN0aW9uKCkge1xuXG5cdC8vIFNvbWUgY29uc3RhbnRzXG5cdHZhciBXQVJOSU5HUyA9ICEgdHJ1ZTsgLy8gU2V0IHRvIHRydWUgZm9yIGRldmVsb3BtZW50XG5cdHZhciBBQkMgPSBbICdhJywgJ2InLCAnYycgXTtcblxuXG5cdGZ1bmN0aW9uIGdldEVkZ2UoIGEsIGIsIG1hcCApIHtcblxuXHRcdHZhciB2ZXJ0ZXhJbmRleEEgPSBNYXRoLm1pbiggYSwgYiApO1xuXHRcdHZhciB2ZXJ0ZXhJbmRleEIgPSBNYXRoLm1heCggYSwgYiApO1xuXG5cdFx0dmFyIGtleSA9IHZlcnRleEluZGV4QSArIFwiX1wiICsgdmVydGV4SW5kZXhCO1xuXG5cdFx0cmV0dXJuIG1hcFsga2V5IF07XG5cblx0fVxuXG5cblx0ZnVuY3Rpb24gcHJvY2Vzc0VkZ2UoIGEsIGIsIHZlcnRpY2VzLCBtYXAsIGZhY2UsIG1ldGFWZXJ0aWNlcyApIHtcblxuXHRcdHZhciB2ZXJ0ZXhJbmRleEEgPSBNYXRoLm1pbiggYSwgYiApO1xuXHRcdHZhciB2ZXJ0ZXhJbmRleEIgPSBNYXRoLm1heCggYSwgYiApO1xuXG5cdFx0dmFyIGtleSA9IHZlcnRleEluZGV4QSArIFwiX1wiICsgdmVydGV4SW5kZXhCO1xuXG5cdFx0dmFyIGVkZ2U7XG5cblx0XHRpZiAoIGtleSBpbiBtYXAgKSB7XG5cblx0XHRcdGVkZ2UgPSBtYXBbIGtleSBdO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0dmFyIHZlcnRleEEgPSB2ZXJ0aWNlc1sgdmVydGV4SW5kZXhBIF07XG5cdFx0XHR2YXIgdmVydGV4QiA9IHZlcnRpY2VzWyB2ZXJ0ZXhJbmRleEIgXTtcblxuXHRcdFx0ZWRnZSA9IHtcblxuXHRcdFx0XHRhOiB2ZXJ0ZXhBLCAvLyBwb2ludGVyIHJlZmVyZW5jZVxuXHRcdFx0XHRiOiB2ZXJ0ZXhCLFxuXHRcdFx0XHRuZXdFZGdlOiBudWxsLFxuXHRcdFx0XHQvLyBhSW5kZXg6IGEsIC8vIG51bWJlcmVkIHJlZmVyZW5jZVxuXHRcdFx0XHQvLyBiSW5kZXg6IGIsXG5cdFx0XHRcdGZhY2VzOiBbXSAvLyBwb2ludGVycyB0byBmYWNlXG5cblx0XHRcdH07XG5cblx0XHRcdG1hcFsga2V5IF0gPSBlZGdlO1xuXG5cdFx0fVxuXG5cdFx0ZWRnZS5mYWNlcy5wdXNoKCBmYWNlICk7XG5cblx0XHRtZXRhVmVydGljZXNbIGEgXS5lZGdlcy5wdXNoKCBlZGdlICk7XG5cdFx0bWV0YVZlcnRpY2VzWyBiIF0uZWRnZXMucHVzaCggZWRnZSApO1xuXG5cblx0fVxuXG5cdGZ1bmN0aW9uIGdlbmVyYXRlTG9va3VwcyggdmVydGljZXMsIGZhY2VzLCBtZXRhVmVydGljZXMsIGVkZ2VzICkge1xuXG5cdFx0dmFyIGksIGlsLCBmYWNlLCBlZGdlO1xuXG5cdFx0Zm9yICggaSA9IDAsIGlsID0gdmVydGljZXMubGVuZ3RoOyBpIDwgaWw7IGkgKysgKSB7XG5cblx0XHRcdG1ldGFWZXJ0aWNlc1sgaSBdID0geyBlZGdlczogW10gfTtcblxuXHRcdH1cblxuXHRcdGZvciAoIGkgPSAwLCBpbCA9IGZhY2VzLmxlbmd0aDsgaSA8IGlsOyBpICsrICkge1xuXG5cdFx0XHRmYWNlID0gZmFjZXNbIGkgXTtcblxuXHRcdFx0cHJvY2Vzc0VkZ2UoIGZhY2UuYSwgZmFjZS5iLCB2ZXJ0aWNlcywgZWRnZXMsIGZhY2UsIG1ldGFWZXJ0aWNlcyApO1xuXHRcdFx0cHJvY2Vzc0VkZ2UoIGZhY2UuYiwgZmFjZS5jLCB2ZXJ0aWNlcywgZWRnZXMsIGZhY2UsIG1ldGFWZXJ0aWNlcyApO1xuXHRcdFx0cHJvY2Vzc0VkZ2UoIGZhY2UuYywgZmFjZS5hLCB2ZXJ0aWNlcywgZWRnZXMsIGZhY2UsIG1ldGFWZXJ0aWNlcyApO1xuXG5cdFx0fVxuXG5cdH1cblxuXHRmdW5jdGlvbiBuZXdGYWNlKCBuZXdGYWNlcywgYSwgYiwgYyApIHtcblxuXHRcdG5ld0ZhY2VzLnB1c2goIG5ldyBUSFJFRS5GYWNlMyggYSwgYiwgYyApICk7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIG1pZHBvaW50KCBhLCBiICkge1xuXG5cdFx0cmV0dXJuICggTWF0aC5hYnMoIGIgLSBhICkgLyAyICkgKyBNYXRoLm1pbiggYSwgYiApO1xuXG5cdH1cblxuXHRmdW5jdGlvbiBuZXdVdiggbmV3VXZzLCBhLCBiLCBjICkge1xuXG5cdFx0bmV3VXZzLnB1c2goIFsgYS5jbG9uZSgpLCBiLmNsb25lKCksIGMuY2xvbmUoKSBdICk7XG5cblx0fVxuXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblx0Ly8gUGVyZm9ybXMgb25lIGl0ZXJhdGlvbiBvZiBTdWJkaXZpc2lvblxuXHRUSFJFRS5TdWJkaXZpc2lvbk1vZGlmaWVyLnByb3RvdHlwZS5zbW9vdGggPSBmdW5jdGlvbiAoIGdlb21ldHJ5ICkge1xuXG5cdFx0dmFyIHRtcCA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cblx0XHR2YXIgb2xkVmVydGljZXMsIG9sZEZhY2VzLCBvbGRVdnM7XG5cdFx0dmFyIG5ld1ZlcnRpY2VzLCBuZXdGYWNlcywgbmV3VVZzID0gW107XG5cblx0XHR2YXIgbiwgbCwgaSwgaWwsIGosIGs7XG5cdFx0dmFyIG1ldGFWZXJ0aWNlcywgc291cmNlRWRnZXM7XG5cblx0XHQvLyBuZXcgc3R1ZmYuXG5cdFx0dmFyIHNvdXJjZUVkZ2VzLCBuZXdFZGdlVmVydGljZXMsIG5ld1NvdXJjZVZlcnRpY2VzO1xuXG5cdFx0b2xkVmVydGljZXMgPSBnZW9tZXRyeS52ZXJ0aWNlczsgLy8geyB4LCB5LCB6fVxuXHRcdG9sZEZhY2VzID0gZ2VvbWV0cnkuZmFjZXM7IC8vIHsgYTogb2xkVmVydGV4MSwgYjogb2xkVmVydGV4MiwgYzogb2xkVmVydGV4MyB9XG5cdFx0b2xkVXZzID0gZ2VvbWV0cnkuZmFjZVZlcnRleFV2c1sgMCBdO1xuXG5cdFx0dmFyIGhhc1V2cyA9IG9sZFV2cyAhPT0gdW5kZWZpbmVkICYmIG9sZFV2cy5sZW5ndGggPiAwO1xuXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHRcdCAqXG5cdFx0ICogU3RlcCAwOiBQcmVwcm9jZXNzIEdlb21ldHJ5IHRvIEdlbmVyYXRlIGVkZ2VzIExvb2t1cFxuXHRcdCAqXG5cdFx0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblx0XHRtZXRhVmVydGljZXMgPSBuZXcgQXJyYXkoIG9sZFZlcnRpY2VzLmxlbmd0aCApO1xuXHRcdHNvdXJjZUVkZ2VzID0ge307IC8vIEVkZ2UgPT4geyBvbGRWZXJ0ZXgxLCBvbGRWZXJ0ZXgyLCBmYWNlc1tdICB9XG5cblx0XHRnZW5lcmF0ZUxvb2t1cHMoIG9sZFZlcnRpY2VzLCBvbGRGYWNlcywgbWV0YVZlcnRpY2VzLCBzb3VyY2VFZGdlcyApO1xuXG5cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdFx0ICpcblx0XHQgKlx0U3RlcCAxLlxuXHRcdCAqXHRGb3IgZWFjaCBlZGdlLCBjcmVhdGUgYSBuZXcgRWRnZSBWZXJ0ZXgsXG5cdFx0ICpcdHRoZW4gcG9zaXRpb24gaXQuXG5cdFx0ICpcblx0XHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHRcdG5ld0VkZ2VWZXJ0aWNlcyA9IFtdO1xuXHRcdHZhciBvdGhlciwgY3VycmVudEVkZ2UsIG5ld0VkZ2UsIGZhY2U7XG5cdFx0dmFyIGVkZ2VWZXJ0ZXhXZWlnaHQsIGFkamFjZW50VmVydGV4V2VpZ2h0LCBjb25uZWN0ZWRGYWNlcztcblxuXHRcdGZvciAoIGkgaW4gc291cmNlRWRnZXMgKSB7XG5cblx0XHRcdGN1cnJlbnRFZGdlID0gc291cmNlRWRnZXNbIGkgXTtcblx0XHRcdG5ld0VkZ2UgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuXG5cdFx0XHRlZGdlVmVydGV4V2VpZ2h0ID0gMyAvIDg7XG5cdFx0XHRhZGphY2VudFZlcnRleFdlaWdodCA9IDEgLyA4O1xuXG5cdFx0XHRjb25uZWN0ZWRGYWNlcyA9IGN1cnJlbnRFZGdlLmZhY2VzLmxlbmd0aDtcblxuXHRcdFx0Ly8gY2hlY2sgaG93IG1hbnkgbGlua2VkIGZhY2VzLiAyIHNob3VsZCBiZSBjb3JyZWN0LlxuXHRcdFx0aWYgKCBjb25uZWN0ZWRGYWNlcyAhPSAyICkge1xuXG5cdFx0XHRcdC8vIGlmIGxlbmd0aCBpcyBub3QgMiwgaGFuZGxlIGNvbmRpdGlvblxuXHRcdFx0XHRlZGdlVmVydGV4V2VpZ2h0ID0gMC41O1xuXHRcdFx0XHRhZGphY2VudFZlcnRleFdlaWdodCA9IDA7XG5cblx0XHRcdFx0aWYgKCBjb25uZWN0ZWRGYWNlcyAhPSAxICkge1xuXG5cdFx0XHRcdFx0aWYgKCBXQVJOSU5HUyApIGNvbnNvbGUud2FybiggJ1N1YmRpdmlzaW9uIE1vZGlmaWVyOiBOdW1iZXIgb2YgY29ubmVjdGVkIGZhY2VzICE9IDIsIGlzOiAnLCBjb25uZWN0ZWRGYWNlcywgY3VycmVudEVkZ2UgKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdFx0bmV3RWRnZS5hZGRWZWN0b3JzKCBjdXJyZW50RWRnZS5hLCBjdXJyZW50RWRnZS5iICkubXVsdGlwbHlTY2FsYXIoIGVkZ2VWZXJ0ZXhXZWlnaHQgKTtcblxuXHRcdFx0dG1wLnNldCggMCwgMCwgMCApO1xuXG5cdFx0XHRmb3IgKCBqID0gMDsgaiA8IGNvbm5lY3RlZEZhY2VzOyBqICsrICkge1xuXG5cdFx0XHRcdGZhY2UgPSBjdXJyZW50RWRnZS5mYWNlc1sgaiBdO1xuXG5cdFx0XHRcdGZvciAoIGsgPSAwOyBrIDwgMzsgayArKyApIHtcblxuXHRcdFx0XHRcdG90aGVyID0gb2xkVmVydGljZXNbIGZhY2VbIEFCQ1sgayBdIF0gXTtcblx0XHRcdFx0XHRpZiAoIG90aGVyICE9PSBjdXJyZW50RWRnZS5hICYmIG90aGVyICE9PSBjdXJyZW50RWRnZS5iICkgYnJlYWs7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRtcC5hZGQoIG90aGVyICk7XG5cblx0XHRcdH1cblxuXHRcdFx0dG1wLm11bHRpcGx5U2NhbGFyKCBhZGphY2VudFZlcnRleFdlaWdodCApO1xuXHRcdFx0bmV3RWRnZS5hZGQoIHRtcCApO1xuXG5cdFx0XHRjdXJyZW50RWRnZS5uZXdFZGdlID0gbmV3RWRnZVZlcnRpY2VzLmxlbmd0aDtcblx0XHRcdG5ld0VkZ2VWZXJ0aWNlcy5wdXNoKCBuZXdFZGdlICk7XG5cblx0XHRcdC8vIGNvbnNvbGUubG9nKGN1cnJlbnRFZGdlLCBuZXdFZGdlKTtcblxuXHRcdH1cblxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0XHQgKlxuXHRcdCAqXHRTdGVwIDIuXG5cdFx0ICpcdFJlcG9zaXRpb24gZWFjaCBzb3VyY2UgdmVydGljZXMuXG5cdFx0ICpcblx0XHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHRcdHZhciBiZXRhLCBzb3VyY2VWZXJ0ZXhXZWlnaHQsIGNvbm5lY3RpbmdWZXJ0ZXhXZWlnaHQ7XG5cdFx0dmFyIGNvbm5lY3RpbmdFZGdlLCBjb25uZWN0aW5nRWRnZXMsIG9sZFZlcnRleCwgbmV3U291cmNlVmVydGV4O1xuXHRcdG5ld1NvdXJjZVZlcnRpY2VzID0gW107XG5cblx0XHRmb3IgKCBpID0gMCwgaWwgPSBvbGRWZXJ0aWNlcy5sZW5ndGg7IGkgPCBpbDsgaSArKyApIHtcblxuXHRcdFx0b2xkVmVydGV4ID0gb2xkVmVydGljZXNbIGkgXTtcblxuXHRcdFx0Ly8gZmluZCBhbGwgY29ubmVjdGluZyBlZGdlcyAodXNpbmcgbG9va3VwVGFibGUpXG5cdFx0XHRjb25uZWN0aW5nRWRnZXMgPSBtZXRhVmVydGljZXNbIGkgXS5lZGdlcztcblx0XHRcdG4gPSBjb25uZWN0aW5nRWRnZXMubGVuZ3RoO1xuXG5cdFx0XHRpZiAoIG4gPT0gMyApIHtcblxuXHRcdFx0XHRiZXRhID0gMyAvIDE2O1xuXG5cdFx0XHR9IGVsc2UgaWYgKCBuID4gMyApIHtcblxuXHRcdFx0XHRiZXRhID0gMyAvICggOCAqIG4gKTsgLy8gV2FycmVuJ3MgbW9kaWZpZWQgZm9ybXVsYVxuXG5cdFx0XHR9XG5cblx0XHRcdC8vIExvb3AncyBvcmlnaW5hbCBiZXRhIGZvcm11bGFcblx0XHRcdC8vIGJldGEgPSAxIC8gbiAqICggNS84IC0gTWF0aC5wb3coIDMvOCArIDEvNCAqIE1hdGguY29zKCAyICogTWF0aC4gUEkgLyBuICksIDIpICk7XG5cblx0XHRcdHNvdXJjZVZlcnRleFdlaWdodCA9IDEgLSBuICogYmV0YTtcblx0XHRcdGNvbm5lY3RpbmdWZXJ0ZXhXZWlnaHQgPSBiZXRhO1xuXG5cdFx0XHRpZiAoIG4gPD0gMiApIHtcblxuXHRcdFx0XHQvLyBjcmVhc2UgYW5kIGJvdW5kYXJ5IHJ1bGVzXG5cdFx0XHRcdC8vIGNvbnNvbGUud2FybignY3JlYXNlIGFuZCBib3VuZGFyeSBydWxlcycpO1xuXG5cdFx0XHRcdGlmICggbiA9PSAyICkge1xuXG5cdFx0XHRcdFx0aWYgKCBXQVJOSU5HUyApIGNvbnNvbGUud2FybiggJzIgY29ubmVjdGluZyBlZGdlcycsIGNvbm5lY3RpbmdFZGdlcyApO1xuXHRcdFx0XHRcdHNvdXJjZVZlcnRleFdlaWdodCA9IDMgLyA0O1xuXHRcdFx0XHRcdGNvbm5lY3RpbmdWZXJ0ZXhXZWlnaHQgPSAxIC8gODtcblxuXHRcdFx0XHRcdC8vIHNvdXJjZVZlcnRleFdlaWdodCA9IDE7XG5cdFx0XHRcdFx0Ly8gY29ubmVjdGluZ1ZlcnRleFdlaWdodCA9IDA7XG5cblx0XHRcdFx0fSBlbHNlIGlmICggbiA9PSAxICkge1xuXG5cdFx0XHRcdFx0aWYgKCBXQVJOSU5HUyApIGNvbnNvbGUud2FybiggJ29ubHkgMSBjb25uZWN0aW5nIGVkZ2UnICk7XG5cblx0XHRcdFx0fSBlbHNlIGlmICggbiA9PSAwICkge1xuXG5cdFx0XHRcdFx0aWYgKCBXQVJOSU5HUyApIGNvbnNvbGUud2FybiggJzAgY29ubmVjdGluZyBlZGdlcycgKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdFx0bmV3U291cmNlVmVydGV4ID0gb2xkVmVydGV4LmNsb25lKCkubXVsdGlwbHlTY2FsYXIoIHNvdXJjZVZlcnRleFdlaWdodCApO1xuXG5cdFx0XHR0bXAuc2V0KCAwLCAwLCAwICk7XG5cblx0XHRcdGZvciAoIGogPSAwOyBqIDwgbjsgaiArKyApIHtcblxuXHRcdFx0XHRjb25uZWN0aW5nRWRnZSA9IGNvbm5lY3RpbmdFZGdlc1sgaiBdO1xuXHRcdFx0XHRvdGhlciA9IGNvbm5lY3RpbmdFZGdlLmEgIT09IG9sZFZlcnRleCA/IGNvbm5lY3RpbmdFZGdlLmEgOiBjb25uZWN0aW5nRWRnZS5iO1xuXHRcdFx0XHR0bXAuYWRkKCBvdGhlciApO1xuXG5cdFx0XHR9XG5cblx0XHRcdHRtcC5tdWx0aXBseVNjYWxhciggY29ubmVjdGluZ1ZlcnRleFdlaWdodCApO1xuXHRcdFx0bmV3U291cmNlVmVydGV4LmFkZCggdG1wICk7XG5cblx0XHRcdG5ld1NvdXJjZVZlcnRpY2VzLnB1c2goIG5ld1NvdXJjZVZlcnRleCApO1xuXG5cdFx0fVxuXG5cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdFx0ICpcblx0XHQgKlx0U3RlcCAzLlxuXHRcdCAqXHRHZW5lcmF0ZSBGYWNlcyBiZXR3ZWVuIHNvdXJjZSB2ZXJ0aWNlc1xuXHRcdCAqXHRhbmQgZWRnZSB2ZXJ0aWNlcy5cblx0XHQgKlxuXHRcdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cdFx0bmV3VmVydGljZXMgPSBuZXdTb3VyY2VWZXJ0aWNlcy5jb25jYXQoIG5ld0VkZ2VWZXJ0aWNlcyApO1xuXHRcdHZhciBzbCA9IG5ld1NvdXJjZVZlcnRpY2VzLmxlbmd0aCwgZWRnZTEsIGVkZ2UyLCBlZGdlMztcblx0XHRuZXdGYWNlcyA9IFtdO1xuXG5cdFx0dmFyIHV2LCB4MCwgeDEsIHgyO1xuXHRcdHZhciB4MyA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG5cdFx0dmFyIHg0ID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcblx0XHR2YXIgeDUgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuXG5cdFx0Zm9yICggaSA9IDAsIGlsID0gb2xkRmFjZXMubGVuZ3RoOyBpIDwgaWw7IGkgKysgKSB7XG5cblx0XHRcdGZhY2UgPSBvbGRGYWNlc1sgaSBdO1xuXG5cdFx0XHQvLyBmaW5kIHRoZSAzIG5ldyBlZGdlcyB2ZXJ0ZXggb2YgZWFjaCBvbGQgZmFjZVxuXG5cdFx0XHRlZGdlMSA9IGdldEVkZ2UoIGZhY2UuYSwgZmFjZS5iLCBzb3VyY2VFZGdlcyApLm5ld0VkZ2UgKyBzbDtcblx0XHRcdGVkZ2UyID0gZ2V0RWRnZSggZmFjZS5iLCBmYWNlLmMsIHNvdXJjZUVkZ2VzICkubmV3RWRnZSArIHNsO1xuXHRcdFx0ZWRnZTMgPSBnZXRFZGdlKCBmYWNlLmMsIGZhY2UuYSwgc291cmNlRWRnZXMgKS5uZXdFZGdlICsgc2w7XG5cblx0XHRcdC8vIGNyZWF0ZSA0IGZhY2VzLlxuXG5cdFx0XHRuZXdGYWNlKCBuZXdGYWNlcywgZWRnZTEsIGVkZ2UyLCBlZGdlMyApO1xuXHRcdFx0bmV3RmFjZSggbmV3RmFjZXMsIGZhY2UuYSwgZWRnZTEsIGVkZ2UzICk7XG5cdFx0XHRuZXdGYWNlKCBuZXdGYWNlcywgZmFjZS5iLCBlZGdlMiwgZWRnZTEgKTtcblx0XHRcdG5ld0ZhY2UoIG5ld0ZhY2VzLCBmYWNlLmMsIGVkZ2UzLCBlZGdlMiApO1xuXG5cdFx0XHQvLyBjcmVhdGUgNCBuZXcgdXYnc1xuXG5cdFx0XHRpZiAoIGhhc1V2cyApIHtcblxuXHRcdFx0XHR1diA9IG9sZFV2c1sgaSBdO1xuXG5cdFx0XHRcdHgwID0gdXZbIDAgXTtcblx0XHRcdFx0eDEgPSB1dlsgMSBdO1xuXHRcdFx0XHR4MiA9IHV2WyAyIF07XG5cblx0XHRcdFx0eDMuc2V0KCBtaWRwb2ludCggeDAueCwgeDEueCApLCBtaWRwb2ludCggeDAueSwgeDEueSApICk7XG5cdFx0XHRcdHg0LnNldCggbWlkcG9pbnQoIHgxLngsIHgyLnggKSwgbWlkcG9pbnQoIHgxLnksIHgyLnkgKSApO1xuXHRcdFx0XHR4NS5zZXQoIG1pZHBvaW50KCB4MC54LCB4Mi54ICksIG1pZHBvaW50KCB4MC55LCB4Mi55ICkgKTtcblxuXHRcdFx0XHRuZXdVdiggbmV3VVZzLCB4MywgeDQsIHg1ICk7XG5cdFx0XHRcdG5ld1V2KCBuZXdVVnMsIHgwLCB4MywgeDUgKTtcblxuXHRcdFx0XHRuZXdVdiggbmV3VVZzLCB4MSwgeDQsIHgzICk7XG5cdFx0XHRcdG5ld1V2KCBuZXdVVnMsIHgyLCB4NSwgeDQgKTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0Ly8gT3ZlcndyaXRlIG9sZCBhcnJheXNcblx0XHRnZW9tZXRyeS52ZXJ0aWNlcyA9IG5ld1ZlcnRpY2VzO1xuXHRcdGdlb21ldHJ5LmZhY2VzID0gbmV3RmFjZXM7XG5cdFx0aWYgKCBoYXNVdnMgKSBnZW9tZXRyeS5mYWNlVmVydGV4VXZzWyAwIF0gPSBuZXdVVnM7XG5cblx0XHQvLyBjb25zb2xlLmxvZygnZG9uZScpO1xuXG5cdH07XG5cbn0gKSgpO1xuIiwidmFyIHN0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcblxubW9kdWxlLmV4cG9ydHMgPSBhbkFycmF5XG5cbmZ1bmN0aW9uIGFuQXJyYXkoYXJyKSB7XG4gIHJldHVybiAoXG4gICAgICAgYXJyLkJZVEVTX1BFUl9FTEVNRU5UXG4gICAgJiYgc3RyLmNhbGwoYXJyLmJ1ZmZlcikgPT09ICdbb2JqZWN0IEFycmF5QnVmZmVyXSdcbiAgICB8fCBBcnJheS5pc0FycmF5KGFycilcbiAgKVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBudW10eXBlKG51bSwgZGVmKSB7XG5cdHJldHVybiB0eXBlb2YgbnVtID09PSAnbnVtYmVyJ1xuXHRcdD8gbnVtIFxuXHRcdDogKHR5cGVvZiBkZWYgPT09ICdudW1iZXInID8gZGVmIDogMClcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGR0eXBlKSB7XG4gIHN3aXRjaCAoZHR5cGUpIHtcbiAgICBjYXNlICdpbnQ4JzpcbiAgICAgIHJldHVybiBJbnQ4QXJyYXlcbiAgICBjYXNlICdpbnQxNic6XG4gICAgICByZXR1cm4gSW50MTZBcnJheVxuICAgIGNhc2UgJ2ludDMyJzpcbiAgICAgIHJldHVybiBJbnQzMkFycmF5XG4gICAgY2FzZSAndWludDgnOlxuICAgICAgcmV0dXJuIFVpbnQ4QXJyYXlcbiAgICBjYXNlICd1aW50MTYnOlxuICAgICAgcmV0dXJuIFVpbnQxNkFycmF5XG4gICAgY2FzZSAndWludDMyJzpcbiAgICAgIHJldHVybiBVaW50MzJBcnJheVxuICAgIGNhc2UgJ2Zsb2F0MzInOlxuICAgICAgcmV0dXJuIEZsb2F0MzJBcnJheVxuICAgIGNhc2UgJ2Zsb2F0NjQnOlxuICAgICAgcmV0dXJuIEZsb2F0NjRBcnJheVxuICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgIHJldHVybiBBcnJheVxuICAgIGNhc2UgJ3VpbnQ4X2NsYW1wZWQnOlxuICAgICAgcmV0dXJuIFVpbnQ4Q2xhbXBlZEFycmF5XG4gIH1cbn1cbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBBdCBsZWFzdCBnaXZlIHNvbWUga2luZCBvZiBjb250ZXh0IHRvIHRoZSB1c2VyXG4gICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuICgnICsgZXIgKyAnKScpO1xuICAgICAgICBlcnIuY29udGV4dCA9IGVyO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSBpZiAobGlzdGVuZXJzKSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAodGhpcy5fZXZlbnRzKSB7XG4gICAgdmFyIGV2bGlzdGVuZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgICBpZiAoaXNGdW5jdGlvbihldmxpc3RlbmVyKSlcbiAgICAgIHJldHVybiAxO1xuICAgIGVsc2UgaWYgKGV2bGlzdGVuZXIpXG4gICAgICByZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuIDA7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKTtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsIi8qZXNsaW50IG5ldy1jYXA6MCovXG52YXIgZHR5cGUgPSByZXF1aXJlKCdkdHlwZScpXG5tb2R1bGUuZXhwb3J0cyA9IGZsYXR0ZW5WZXJ0ZXhEYXRhXG5mdW5jdGlvbiBmbGF0dGVuVmVydGV4RGF0YSAoZGF0YSwgb3V0cHV0LCBvZmZzZXQpIHtcbiAgaWYgKCFkYXRhKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdtdXN0IHNwZWNpZnkgZGF0YSBhcyBmaXJzdCBwYXJhbWV0ZXInKVxuICBvZmZzZXQgPSArKG9mZnNldCB8fCAwKSB8IDBcblxuICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSAmJiBBcnJheS5pc0FycmF5KGRhdGFbMF0pKSB7XG4gICAgdmFyIGRpbSA9IGRhdGFbMF0ubGVuZ3RoXG4gICAgdmFyIGxlbmd0aCA9IGRhdGEubGVuZ3RoICogZGltXG5cbiAgICAvLyBubyBvdXRwdXQgc3BlY2lmaWVkLCBjcmVhdGUgYSBuZXcgdHlwZWQgYXJyYXlcbiAgICBpZiAoIW91dHB1dCB8fCB0eXBlb2Ygb3V0cHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgb3V0cHV0ID0gbmV3IChkdHlwZShvdXRwdXQgfHwgJ2Zsb2F0MzInKSkobGVuZ3RoICsgb2Zmc2V0KVxuICAgIH1cblxuICAgIHZhciBkc3RMZW5ndGggPSBvdXRwdXQubGVuZ3RoIC0gb2Zmc2V0XG4gICAgaWYgKGxlbmd0aCAhPT0gZHN0TGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NvdXJjZSBsZW5ndGggJyArIGxlbmd0aCArICcgKCcgKyBkaW0gKyAneCcgKyBkYXRhLmxlbmd0aCArICcpJyArXG4gICAgICAgICcgZG9lcyBub3QgbWF0Y2ggZGVzdGluYXRpb24gbGVuZ3RoICcgKyBkc3RMZW5ndGgpXG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDAsIGsgPSBvZmZzZXQ7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGRpbTsgaisrKSB7XG4gICAgICAgIG91dHB1dFtrKytdID0gZGF0YVtpXVtqXVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoIW91dHB1dCB8fCB0eXBlb2Ygb3V0cHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgLy8gbm8gb3V0cHV0LCBjcmVhdGUgYSBuZXcgb25lXG4gICAgICB2YXIgQ3RvciA9IGR0eXBlKG91dHB1dCB8fCAnZmxvYXQzMicpXG4gICAgICBpZiAob2Zmc2V0ID09PSAwKSB7XG4gICAgICAgIG91dHB1dCA9IG5ldyBDdG9yKGRhdGEpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRwdXQgPSBuZXcgQ3RvcihkYXRhLmxlbmd0aCArIG9mZnNldClcbiAgICAgICAgb3V0cHV0LnNldChkYXRhLCBvZmZzZXQpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHN0b3JlIG91dHB1dCBpbiBleGlzdGluZyBhcnJheVxuICAgICAgb3V0cHV0LnNldChkYXRhLCBvZmZzZXQpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG91dHB1dFxufVxuIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCIvKiFcbiAqIERldGVybWluZSBpZiBhbiBvYmplY3QgaXMgYSBCdWZmZXJcbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8aHR0cHM6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5cbi8vIFRoZSBfaXNCdWZmZXIgY2hlY2sgaXMgZm9yIFNhZmFyaSA1LTcgc3VwcG9ydCwgYmVjYXVzZSBpdCdzIG1pc3Npbmdcbi8vIE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHlcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICE9IG51bGwgJiYgKGlzQnVmZmVyKG9iaikgfHwgaXNTbG93QnVmZmVyKG9iaikgfHwgISFvYmouX2lzQnVmZmVyKVxufVxuXG5mdW5jdGlvbiBpc0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiAhIW9iai5jb25zdHJ1Y3RvciAmJiB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopXG59XG5cbi8vIEZvciBOb2RlIHYwLjEwIHN1cHBvcnQuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHkuXG5mdW5jdGlvbiBpc1Nsb3dCdWZmZXIgKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iai5yZWFkRmxvYXRMRSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLnNsaWNlID09PSAnZnVuY3Rpb24nICYmIGlzQnVmZmVyKG9iai5zbGljZSgwLCAwKSlcbn1cbiIsInZhciB3b3JkV3JhcCA9IHJlcXVpcmUoJ3dvcmQtd3JhcHBlcicpXG52YXIgeHRlbmQgPSByZXF1aXJlKCd4dGVuZCcpXG52YXIgbnVtYmVyID0gcmVxdWlyZSgnYXMtbnVtYmVyJylcblxudmFyIFhfSEVJR0hUUyA9IFsneCcsICdlJywgJ2EnLCAnbycsICduJywgJ3MnLCAncicsICdjJywgJ3UnLCAnbScsICd2JywgJ3cnLCAneiddXG52YXIgTV9XSURUSFMgPSBbJ20nLCAndyddXG52YXIgQ0FQX0hFSUdIVFMgPSBbJ0gnLCAnSScsICdOJywgJ0UnLCAnRicsICdLJywgJ0wnLCAnVCcsICdVJywgJ1YnLCAnVycsICdYJywgJ1knLCAnWiddXG5cblxudmFyIFRBQl9JRCA9ICdcXHQnLmNoYXJDb2RlQXQoMClcbnZhciBTUEFDRV9JRCA9ICcgJy5jaGFyQ29kZUF0KDApXG52YXIgQUxJR05fTEVGVCA9IDAsIFxuICAgIEFMSUdOX0NFTlRFUiA9IDEsIFxuICAgIEFMSUdOX1JJR0hUID0gMlxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUxheW91dChvcHQpIHtcbiAgcmV0dXJuIG5ldyBUZXh0TGF5b3V0KG9wdClcbn1cblxuZnVuY3Rpb24gVGV4dExheW91dChvcHQpIHtcbiAgdGhpcy5nbHlwaHMgPSBbXVxuICB0aGlzLl9tZWFzdXJlID0gdGhpcy5jb21wdXRlTWV0cmljcy5iaW5kKHRoaXMpXG4gIHRoaXMudXBkYXRlKG9wdClcbn1cblxuVGV4dExheW91dC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24ob3B0KSB7XG4gIG9wdCA9IHh0ZW5kKHtcbiAgICBtZWFzdXJlOiB0aGlzLl9tZWFzdXJlXG4gIH0sIG9wdClcbiAgdGhpcy5fb3B0ID0gb3B0XG4gIHRoaXMuX29wdC50YWJTaXplID0gbnVtYmVyKHRoaXMuX29wdC50YWJTaXplLCA0KVxuXG4gIGlmICghb3B0LmZvbnQpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdtdXN0IHByb3ZpZGUgYSB2YWxpZCBiaXRtYXAgZm9udCcpXG5cbiAgdmFyIGdseXBocyA9IHRoaXMuZ2x5cGhzXG4gIHZhciB0ZXh0ID0gb3B0LnRleHR8fCcnIFxuICB2YXIgZm9udCA9IG9wdC5mb250XG4gIHRoaXMuX3NldHVwU3BhY2VHbHlwaHMoZm9udClcbiAgXG4gIHZhciBsaW5lcyA9IHdvcmRXcmFwLmxpbmVzKHRleHQsIG9wdClcbiAgdmFyIG1pbldpZHRoID0gb3B0LndpZHRoIHx8IDBcblxuICAvL2NsZWFyIGdseXBoc1xuICBnbHlwaHMubGVuZ3RoID0gMFxuXG4gIC8vZ2V0IG1heCBsaW5lIHdpZHRoXG4gIHZhciBtYXhMaW5lV2lkdGggPSBsaW5lcy5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgbGluZSkge1xuICAgIHJldHVybiBNYXRoLm1heChwcmV2LCBsaW5lLndpZHRoLCBtaW5XaWR0aClcbiAgfSwgMClcblxuICAvL3RoZSBwZW4gcG9zaXRpb25cbiAgdmFyIHggPSAwXG4gIHZhciB5ID0gMFxuICB2YXIgbGluZUhlaWdodCA9IG51bWJlcihvcHQubGluZUhlaWdodCwgZm9udC5jb21tb24ubGluZUhlaWdodClcbiAgdmFyIGJhc2VsaW5lID0gZm9udC5jb21tb24uYmFzZVxuICB2YXIgZGVzY2VuZGVyID0gbGluZUhlaWdodC1iYXNlbGluZVxuICB2YXIgbGV0dGVyU3BhY2luZyA9IG9wdC5sZXR0ZXJTcGFjaW5nIHx8IDBcbiAgdmFyIGhlaWdodCA9IGxpbmVIZWlnaHQgKiBsaW5lcy5sZW5ndGggLSBkZXNjZW5kZXJcbiAgdmFyIGFsaWduID0gZ2V0QWxpZ25UeXBlKHRoaXMuX29wdC5hbGlnbilcblxuICAvL2RyYXcgdGV4dCBhbG9uZyBiYXNlbGluZVxuICB5IC09IGhlaWdodFxuICBcbiAgLy90aGUgbWV0cmljcyBmb3IgdGhpcyB0ZXh0IGxheW91dFxuICB0aGlzLl93aWR0aCA9IG1heExpbmVXaWR0aFxuICB0aGlzLl9oZWlnaHQgPSBoZWlnaHRcbiAgdGhpcy5fZGVzY2VuZGVyID0gbGluZUhlaWdodCAtIGJhc2VsaW5lXG4gIHRoaXMuX2Jhc2VsaW5lID0gYmFzZWxpbmVcbiAgdGhpcy5feEhlaWdodCA9IGdldFhIZWlnaHQoZm9udClcbiAgdGhpcy5fY2FwSGVpZ2h0ID0gZ2V0Q2FwSGVpZ2h0KGZvbnQpXG4gIHRoaXMuX2xpbmVIZWlnaHQgPSBsaW5lSGVpZ2h0XG4gIHRoaXMuX2FzY2VuZGVyID0gbGluZUhlaWdodCAtIGRlc2NlbmRlciAtIHRoaXMuX3hIZWlnaHRcbiAgICBcbiAgLy9sYXlvdXQgZWFjaCBnbHlwaFxuICB2YXIgc2VsZiA9IHRoaXNcbiAgbGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lLCBsaW5lSW5kZXgpIHtcbiAgICB2YXIgc3RhcnQgPSBsaW5lLnN0YXJ0XG4gICAgdmFyIGVuZCA9IGxpbmUuZW5kXG4gICAgdmFyIGxpbmVXaWR0aCA9IGxpbmUud2lkdGhcbiAgICB2YXIgbGFzdEdseXBoXG4gICAgXG4gICAgLy9mb3IgZWFjaCBnbHlwaCBpbiB0aGF0IGxpbmUuLi5cbiAgICBmb3IgKHZhciBpPXN0YXJ0OyBpPGVuZDsgaSsrKSB7XG4gICAgICB2YXIgaWQgPSB0ZXh0LmNoYXJDb2RlQXQoaSlcbiAgICAgIHZhciBnbHlwaCA9IHNlbGYuZ2V0R2x5cGgoZm9udCwgaWQpXG4gICAgICBpZiAoZ2x5cGgpIHtcbiAgICAgICAgaWYgKGxhc3RHbHlwaCkgXG4gICAgICAgICAgeCArPSBnZXRLZXJuaW5nKGZvbnQsIGxhc3RHbHlwaC5pZCwgZ2x5cGguaWQpXG5cbiAgICAgICAgdmFyIHR4ID0geFxuICAgICAgICBpZiAoYWxpZ24gPT09IEFMSUdOX0NFTlRFUikgXG4gICAgICAgICAgdHggKz0gKG1heExpbmVXaWR0aC1saW5lV2lkdGgpLzJcbiAgICAgICAgZWxzZSBpZiAoYWxpZ24gPT09IEFMSUdOX1JJR0hUKVxuICAgICAgICAgIHR4ICs9IChtYXhMaW5lV2lkdGgtbGluZVdpZHRoKVxuXG4gICAgICAgIGdseXBocy5wdXNoKHtcbiAgICAgICAgICBwb3NpdGlvbjogW3R4LCB5XSxcbiAgICAgICAgICBkYXRhOiBnbHlwaCxcbiAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICBsaW5lOiBsaW5lSW5kZXhcbiAgICAgICAgfSkgIFxuXG4gICAgICAgIC8vbW92ZSBwZW4gZm9yd2FyZFxuICAgICAgICB4ICs9IGdseXBoLnhhZHZhbmNlICsgbGV0dGVyU3BhY2luZ1xuICAgICAgICBsYXN0R2x5cGggPSBnbHlwaFxuICAgICAgfVxuICAgIH1cblxuICAgIC8vbmV4dCBsaW5lIGRvd25cbiAgICB5ICs9IGxpbmVIZWlnaHRcbiAgICB4ID0gMFxuICB9KVxuICB0aGlzLl9saW5lc1RvdGFsID0gbGluZXMubGVuZ3RoO1xufVxuXG5UZXh0TGF5b3V0LnByb3RvdHlwZS5fc2V0dXBTcGFjZUdseXBocyA9IGZ1bmN0aW9uKGZvbnQpIHtcbiAgLy9UaGVzZSBhcmUgZmFsbGJhY2tzLCB3aGVuIHRoZSBmb250IGRvZXNuJ3QgaW5jbHVkZVxuICAvLycgJyBvciAnXFx0JyBnbHlwaHNcbiAgdGhpcy5fZmFsbGJhY2tTcGFjZUdseXBoID0gbnVsbFxuICB0aGlzLl9mYWxsYmFja1RhYkdseXBoID0gbnVsbFxuXG4gIGlmICghZm9udC5jaGFycyB8fCBmb250LmNoYXJzLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm5cblxuICAvL3RyeSB0byBnZXQgc3BhY2UgZ2x5cGhcbiAgLy90aGVuIGZhbGwgYmFjayB0byB0aGUgJ20nIG9yICd3JyBnbHlwaHNcbiAgLy90aGVuIGZhbGwgYmFjayB0byB0aGUgZmlyc3QgZ2x5cGggYXZhaWxhYmxlXG4gIHZhciBzcGFjZSA9IGdldEdseXBoQnlJZChmb250LCBTUEFDRV9JRCkgXG4gICAgICAgICAgfHwgZ2V0TUdseXBoKGZvbnQpIFxuICAgICAgICAgIHx8IGZvbnQuY2hhcnNbMF1cblxuICAvL2FuZCBjcmVhdGUgYSBmYWxsYmFjayBmb3IgdGFiXG4gIHZhciB0YWJXaWR0aCA9IHRoaXMuX29wdC50YWJTaXplICogc3BhY2UueGFkdmFuY2VcbiAgdGhpcy5fZmFsbGJhY2tTcGFjZUdseXBoID0gc3BhY2VcbiAgdGhpcy5fZmFsbGJhY2tUYWJHbHlwaCA9IHh0ZW5kKHNwYWNlLCB7XG4gICAgeDogMCwgeTogMCwgeGFkdmFuY2U6IHRhYldpZHRoLCBpZDogVEFCX0lELCBcbiAgICB4b2Zmc2V0OiAwLCB5b2Zmc2V0OiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAwXG4gIH0pXG59XG5cblRleHRMYXlvdXQucHJvdG90eXBlLmdldEdseXBoID0gZnVuY3Rpb24oZm9udCwgaWQpIHtcbiAgdmFyIGdseXBoID0gZ2V0R2x5cGhCeUlkKGZvbnQsIGlkKVxuICBpZiAoZ2x5cGgpXG4gICAgcmV0dXJuIGdseXBoXG4gIGVsc2UgaWYgKGlkID09PSBUQUJfSUQpIFxuICAgIHJldHVybiB0aGlzLl9mYWxsYmFja1RhYkdseXBoXG4gIGVsc2UgaWYgKGlkID09PSBTUEFDRV9JRCkgXG4gICAgcmV0dXJuIHRoaXMuX2ZhbGxiYWNrU3BhY2VHbHlwaFxuICByZXR1cm4gbnVsbFxufVxuXG5UZXh0TGF5b3V0LnByb3RvdHlwZS5jb21wdXRlTWV0cmljcyA9IGZ1bmN0aW9uKHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoKSB7XG4gIHZhciBsZXR0ZXJTcGFjaW5nID0gdGhpcy5fb3B0LmxldHRlclNwYWNpbmcgfHwgMFxuICB2YXIgZm9udCA9IHRoaXMuX29wdC5mb250XG4gIHZhciBjdXJQZW4gPSAwXG4gIHZhciBjdXJXaWR0aCA9IDBcbiAgdmFyIGNvdW50ID0gMFxuICB2YXIgZ2x5cGhcbiAgdmFyIGxhc3RHbHlwaFxuXG4gIGlmICghZm9udC5jaGFycyB8fCBmb250LmNoYXJzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB7XG4gICAgICBzdGFydDogc3RhcnQsXG4gICAgICBlbmQ6IHN0YXJ0LFxuICAgICAgd2lkdGg6IDBcbiAgICB9XG4gIH1cblxuICBlbmQgPSBNYXRoLm1pbih0ZXh0Lmxlbmd0aCwgZW5kKVxuICBmb3IgKHZhciBpPXN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICB2YXIgaWQgPSB0ZXh0LmNoYXJDb2RlQXQoaSlcbiAgICB2YXIgZ2x5cGggPSB0aGlzLmdldEdseXBoKGZvbnQsIGlkKVxuXG4gICAgaWYgKGdseXBoKSB7XG4gICAgICAvL21vdmUgcGVuIGZvcndhcmRcbiAgICAgIHZhciB4b2ZmID0gZ2x5cGgueG9mZnNldFxuICAgICAgdmFyIGtlcm4gPSBsYXN0R2x5cGggPyBnZXRLZXJuaW5nKGZvbnQsIGxhc3RHbHlwaC5pZCwgZ2x5cGguaWQpIDogMFxuICAgICAgY3VyUGVuICs9IGtlcm5cblxuICAgICAgdmFyIG5leHRQZW4gPSBjdXJQZW4gKyBnbHlwaC54YWR2YW5jZSArIGxldHRlclNwYWNpbmdcbiAgICAgIHZhciBuZXh0V2lkdGggPSBjdXJQZW4gKyBnbHlwaC53aWR0aFxuXG4gICAgICAvL3dlJ3ZlIGhpdCBvdXIgbGltaXQ7IHdlIGNhbid0IG1vdmUgb250byB0aGUgbmV4dCBnbHlwaFxuICAgICAgaWYgKG5leHRXaWR0aCA+PSB3aWR0aCB8fCBuZXh0UGVuID49IHdpZHRoKVxuICAgICAgICBicmVha1xuXG4gICAgICAvL290aGVyd2lzZSBjb250aW51ZSBhbG9uZyBvdXIgbGluZVxuICAgICAgY3VyUGVuID0gbmV4dFBlblxuICAgICAgY3VyV2lkdGggPSBuZXh0V2lkdGhcbiAgICAgIGxhc3RHbHlwaCA9IGdseXBoXG4gICAgfVxuICAgIGNvdW50KytcbiAgfVxuICBcbiAgLy9tYWtlIHN1cmUgcmlnaHRtb3N0IGVkZ2UgbGluZXMgdXAgd2l0aCByZW5kZXJlZCBnbHlwaHNcbiAgaWYgKGxhc3RHbHlwaClcbiAgICBjdXJXaWR0aCArPSBsYXN0R2x5cGgueG9mZnNldFxuXG4gIHJldHVybiB7XG4gICAgc3RhcnQ6IHN0YXJ0LFxuICAgIGVuZDogc3RhcnQgKyBjb3VudCxcbiAgICB3aWR0aDogY3VyV2lkdGhcbiAgfVxufVxuXG4vL2dldHRlcnMgZm9yIHRoZSBwcml2YXRlIHZhcnNcbjtbJ3dpZHRoJywgJ2hlaWdodCcsIFxuICAnZGVzY2VuZGVyJywgJ2FzY2VuZGVyJyxcbiAgJ3hIZWlnaHQnLCAnYmFzZWxpbmUnLFxuICAnY2FwSGVpZ2h0JyxcbiAgJ2xpbmVIZWlnaHQnIF0uZm9yRWFjaChhZGRHZXR0ZXIpXG5cbmZ1bmN0aW9uIGFkZEdldHRlcihuYW1lKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUZXh0TGF5b3V0LnByb3RvdHlwZSwgbmFtZSwge1xuICAgIGdldDogd3JhcHBlcihuYW1lKSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSlcbn1cblxuLy9jcmVhdGUgbG9va3VwcyBmb3IgcHJpdmF0ZSB2YXJzXG5mdW5jdGlvbiB3cmFwcGVyKG5hbWUpIHtcbiAgcmV0dXJuIChuZXcgRnVuY3Rpb24oW1xuICAgICdyZXR1cm4gZnVuY3Rpb24gJytuYW1lKycoKSB7JyxcbiAgICAnICByZXR1cm4gdGhpcy5fJytuYW1lLFxuICAgICd9J1xuICBdLmpvaW4oJ1xcbicpKSkoKVxufVxuXG5mdW5jdGlvbiBnZXRHbHlwaEJ5SWQoZm9udCwgaWQpIHtcbiAgaWYgKCFmb250LmNoYXJzIHx8IGZvbnQuY2hhcnMubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiBudWxsXG5cbiAgdmFyIGdseXBoSWR4ID0gZmluZENoYXIoZm9udC5jaGFycywgaWQpXG4gIGlmIChnbHlwaElkeCA+PSAwKVxuICAgIHJldHVybiBmb250LmNoYXJzW2dseXBoSWR4XVxuICByZXR1cm4gbnVsbFxufVxuXG5mdW5jdGlvbiBnZXRYSGVpZ2h0KGZvbnQpIHtcbiAgZm9yICh2YXIgaT0wOyBpPFhfSEVJR0hUUy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpZCA9IFhfSEVJR0hUU1tpXS5jaGFyQ29kZUF0KDApXG4gICAgdmFyIGlkeCA9IGZpbmRDaGFyKGZvbnQuY2hhcnMsIGlkKVxuICAgIGlmIChpZHggPj0gMCkgXG4gICAgICByZXR1cm4gZm9udC5jaGFyc1tpZHhdLmhlaWdodFxuICB9XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGdldE1HbHlwaChmb250KSB7XG4gIGZvciAodmFyIGk9MDsgaTxNX1dJRFRIUy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpZCA9IE1fV0lEVEhTW2ldLmNoYXJDb2RlQXQoMClcbiAgICB2YXIgaWR4ID0gZmluZENoYXIoZm9udC5jaGFycywgaWQpXG4gICAgaWYgKGlkeCA+PSAwKSBcbiAgICAgIHJldHVybiBmb250LmNoYXJzW2lkeF1cbiAgfVxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBnZXRDYXBIZWlnaHQoZm9udCkge1xuICBmb3IgKHZhciBpPTA7IGk8Q0FQX0hFSUdIVFMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaWQgPSBDQVBfSEVJR0hUU1tpXS5jaGFyQ29kZUF0KDApXG4gICAgdmFyIGlkeCA9IGZpbmRDaGFyKGZvbnQuY2hhcnMsIGlkKVxuICAgIGlmIChpZHggPj0gMCkgXG4gICAgICByZXR1cm4gZm9udC5jaGFyc1tpZHhdLmhlaWdodFxuICB9XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGdldEtlcm5pbmcoZm9udCwgbGVmdCwgcmlnaHQpIHtcbiAgaWYgKCFmb250Lmtlcm5pbmdzIHx8IGZvbnQua2VybmluZ3MubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiAwXG5cbiAgdmFyIHRhYmxlID0gZm9udC5rZXJuaW5nc1xuICBmb3IgKHZhciBpPTA7IGk8dGFibGUubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIga2VybiA9IHRhYmxlW2ldXG4gICAgaWYgKGtlcm4uZmlyc3QgPT09IGxlZnQgJiYga2Vybi5zZWNvbmQgPT09IHJpZ2h0KVxuICAgICAgcmV0dXJuIGtlcm4uYW1vdW50XG4gIH1cbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gZ2V0QWxpZ25UeXBlKGFsaWduKSB7XG4gIGlmIChhbGlnbiA9PT0gJ2NlbnRlcicpXG4gICAgcmV0dXJuIEFMSUdOX0NFTlRFUlxuICBlbHNlIGlmIChhbGlnbiA9PT0gJ3JpZ2h0JylcbiAgICByZXR1cm4gQUxJR05fUklHSFRcbiAgcmV0dXJuIEFMSUdOX0xFRlRcbn1cblxuZnVuY3Rpb24gZmluZENoYXIgKGFycmF5LCB2YWx1ZSwgc3RhcnQpIHtcbiAgc3RhcnQgPSBzdGFydCB8fCAwXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGFycmF5W2ldLmlkID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xXG59IiwiLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG5cbid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VCTUZvbnRBc2NpaShkYXRhKSB7XG4gIGlmICghZGF0YSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGRhdGEgcHJvdmlkZWQnKVxuICBkYXRhID0gZGF0YS50b1N0cmluZygpLnRyaW0oKVxuXG4gIHZhciBvdXRwdXQgPSB7XG4gICAgcGFnZXM6IFtdLFxuICAgIGNoYXJzOiBbXSxcbiAgICBrZXJuaW5nczogW11cbiAgfVxuXG4gIHZhciBsaW5lcyA9IGRhdGEuc3BsaXQoL1xcclxcbj98XFxuL2cpXG5cbiAgaWYgKGxpbmVzLmxlbmd0aCA9PT0gMClcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGRhdGEgaW4gQk1Gb250IGZpbGUnKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbGluZURhdGEgPSBzcGxpdExpbmUobGluZXNbaV0sIGkpXG4gICAgaWYgKCFsaW5lRGF0YSkgLy9za2lwIGVtcHR5IGxpbmVzXG4gICAgICBjb250aW51ZVxuXG4gICAgaWYgKGxpbmVEYXRhLmtleSA9PT0gJ3BhZ2UnKSB7XG4gICAgICBpZiAodHlwZW9mIGxpbmVEYXRhLmRhdGEuaWQgIT09ICdudW1iZXInKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hbGZvcm1lZCBmaWxlIGF0IGxpbmUgJyArIGkgKyAnIC0tIG5lZWRzIHBhZ2UgaWQ9TicpXG4gICAgICBpZiAodHlwZW9mIGxpbmVEYXRhLmRhdGEuZmlsZSAhPT0gJ3N0cmluZycpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbWFsZm9ybWVkIGZpbGUgYXQgbGluZSAnICsgaSArICcgLS0gbmVlZHMgcGFnZSBmaWxlPVwicGF0aFwiJylcbiAgICAgIG91dHB1dC5wYWdlc1tsaW5lRGF0YS5kYXRhLmlkXSA9IGxpbmVEYXRhLmRhdGEuZmlsZVxuICAgIH0gZWxzZSBpZiAobGluZURhdGEua2V5ID09PSAnY2hhcnMnIHx8IGxpbmVEYXRhLmtleSA9PT0gJ2tlcm5pbmdzJykge1xuICAgICAgLy8uLi4gZG8gbm90aGluZyBmb3IgdGhlc2UgdHdvIC4uLlxuICAgIH0gZWxzZSBpZiAobGluZURhdGEua2V5ID09PSAnY2hhcicpIHtcbiAgICAgIG91dHB1dC5jaGFycy5wdXNoKGxpbmVEYXRhLmRhdGEpXG4gICAgfSBlbHNlIGlmIChsaW5lRGF0YS5rZXkgPT09ICdrZXJuaW5nJykge1xuICAgICAgb3V0cHV0Lmtlcm5pbmdzLnB1c2gobGluZURhdGEuZGF0YSlcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0W2xpbmVEYXRhLmtleV0gPSBsaW5lRGF0YS5kYXRhXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG91dHB1dFxufVxuXG5mdW5jdGlvbiBzcGxpdExpbmUobGluZSwgaWR4KSB7XG4gIGxpbmUgPSBsaW5lLnJlcGxhY2UoL1xcdCsvZywgJyAnKS50cmltKClcbiAgaWYgKCFsaW5lKVxuICAgIHJldHVybiBudWxsXG5cbiAgdmFyIHNwYWNlID0gbGluZS5pbmRleE9mKCcgJylcbiAgaWYgKHNwYWNlID09PSAtMSkgXG4gICAgdGhyb3cgbmV3IEVycm9yKFwibm8gbmFtZWQgcm93IGF0IGxpbmUgXCIgKyBpZHgpXG5cbiAgdmFyIGtleSA9IGxpbmUuc3Vic3RyaW5nKDAsIHNwYWNlKVxuXG4gIGxpbmUgPSBsaW5lLnN1YnN0cmluZyhzcGFjZSArIDEpXG4gIC8vY2xlYXIgXCJsZXR0ZXJcIiBmaWVsZCBhcyBpdCBpcyBub24tc3RhbmRhcmQgYW5kXG4gIC8vcmVxdWlyZXMgYWRkaXRpb25hbCBjb21wbGV4aXR5IHRvIHBhcnNlIFwiIC8gPSBzeW1ib2xzXG4gIGxpbmUgPSBsaW5lLnJlcGxhY2UoL2xldHRlcj1bXFwnXFxcIl1cXFMrW1xcJ1xcXCJdL2dpLCAnJykgIFxuICBsaW5lID0gbGluZS5zcGxpdChcIj1cIilcbiAgbGluZSA9IGxpbmUubWFwKGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBzdHIudHJpbSgpLm1hdGNoKCgvKFwiLio/XCJ8W15cIlxcc10rKSsoPz1cXHMqfFxccyokKS9nKSlcbiAgfSlcblxuICB2YXIgZGF0YSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZS5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkdCA9IGxpbmVbaV1cbiAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAga2V5OiBkdFswXSxcbiAgICAgICAgZGF0YTogXCJcIlxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYgKGkgPT09IGxpbmUubGVuZ3RoIC0gMSkge1xuICAgICAgZGF0YVtkYXRhLmxlbmd0aCAtIDFdLmRhdGEgPSBwYXJzZURhdGEoZHRbMF0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGFbZGF0YS5sZW5ndGggLSAxXS5kYXRhID0gcGFyc2VEYXRhKGR0WzBdKVxuICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAga2V5OiBkdFsxXSxcbiAgICAgICAgZGF0YTogXCJcIlxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICB2YXIgb3V0ID0ge1xuICAgIGtleToga2V5LFxuICAgIGRhdGE6IHt9XG4gIH1cblxuICBkYXRhLmZvckVhY2goZnVuY3Rpb24odikge1xuICAgIG91dC5kYXRhW3Yua2V5XSA9IHYuZGF0YTtcbiAgfSlcblxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIHBhcnNlRGF0YShkYXRhKSB7XG4gIGlmICghZGF0YSB8fCBkYXRhLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gXCJcIlxuXG4gIGlmIChkYXRhLmluZGV4T2YoJ1wiJykgPT09IDAgfHwgZGF0YS5pbmRleE9mKFwiJ1wiKSA9PT0gMClcbiAgICByZXR1cm4gZGF0YS5zdWJzdHJpbmcoMSwgZGF0YS5sZW5ndGggLSAxKVxuICBpZiAoZGF0YS5pbmRleE9mKCcsJykgIT09IC0xKVxuICAgIHJldHVybiBwYXJzZUludExpc3QoZGF0YSlcbiAgcmV0dXJuIHBhcnNlSW50KGRhdGEsIDEwKVxufVxuXG5mdW5jdGlvbiBwYXJzZUludExpc3QoZGF0YSkge1xuICByZXR1cm4gZGF0YS5zcGxpdCgnLCcpLm1hcChmdW5jdGlvbih2YWwpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQodmFsLCAxMClcbiAgfSlcbn0iLCJ2YXIgZHR5cGUgPSByZXF1aXJlKCdkdHlwZScpXG52YXIgYW5BcnJheSA9IHJlcXVpcmUoJ2FuLWFycmF5JylcbnZhciBpc0J1ZmZlciA9IHJlcXVpcmUoJ2lzLWJ1ZmZlcicpXG5cbnZhciBDVyA9IFswLCAyLCAzXVxudmFyIENDVyA9IFsyLCAxLCAzXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVF1YWRFbGVtZW50cyhhcnJheSwgb3B0KSB7XG4gICAgLy9pZiB1c2VyIGRpZG4ndCBzcGVjaWZ5IGFuIG91dHB1dCBhcnJheVxuICAgIGlmICghYXJyYXkgfHwgIShhbkFycmF5KGFycmF5KSB8fCBpc0J1ZmZlcihhcnJheSkpKSB7XG4gICAgICAgIG9wdCA9IGFycmF5IHx8IHt9XG4gICAgICAgIGFycmF5ID0gbnVsbFxuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0ID09PSAnbnVtYmVyJykgLy9iYWNrd2FyZHMtY29tcGF0aWJsZVxuICAgICAgICBvcHQgPSB7IGNvdW50OiBvcHQgfVxuICAgIGVsc2VcbiAgICAgICAgb3B0ID0gb3B0IHx8IHt9XG5cbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBvcHQudHlwZSA9PT0gJ3N0cmluZycgPyBvcHQudHlwZSA6ICd1aW50MTYnXG4gICAgdmFyIGNvdW50ID0gdHlwZW9mIG9wdC5jb3VudCA9PT0gJ251bWJlcicgPyBvcHQuY291bnQgOiAxXG4gICAgdmFyIHN0YXJ0ID0gKG9wdC5zdGFydCB8fCAwKSBcblxuICAgIHZhciBkaXIgPSBvcHQuY2xvY2t3aXNlICE9PSBmYWxzZSA/IENXIDogQ0NXLFxuICAgICAgICBhID0gZGlyWzBdLCBcbiAgICAgICAgYiA9IGRpclsxXSxcbiAgICAgICAgYyA9IGRpclsyXVxuXG4gICAgdmFyIG51bUluZGljZXMgPSBjb3VudCAqIDZcblxuICAgIHZhciBpbmRpY2VzID0gYXJyYXkgfHwgbmV3IChkdHlwZSh0eXBlKSkobnVtSW5kaWNlcylcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9IDA7IGkgPCBudW1JbmRpY2VzOyBpICs9IDYsIGogKz0gNCkge1xuICAgICAgICB2YXIgeCA9IGkgKyBzdGFydFxuICAgICAgICBpbmRpY2VzW3ggKyAwXSA9IGogKyAwXG4gICAgICAgIGluZGljZXNbeCArIDFdID0gaiArIDFcbiAgICAgICAgaW5kaWNlc1t4ICsgMl0gPSBqICsgMlxuICAgICAgICBpbmRpY2VzW3ggKyAzXSA9IGogKyBhXG4gICAgICAgIGluZGljZXNbeCArIDRdID0gaiArIGJcbiAgICAgICAgaW5kaWNlc1t4ICsgNV0gPSBqICsgY1xuICAgIH1cbiAgICByZXR1cm4gaW5kaWNlc1xufSIsInZhciBjcmVhdGVMYXlvdXQgPSByZXF1aXJlKCdsYXlvdXQtYm1mb250LXRleHQnKVxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKVxudmFyIGNyZWF0ZUluZGljZXMgPSByZXF1aXJlKCdxdWFkLWluZGljZXMnKVxudmFyIGJ1ZmZlciA9IHJlcXVpcmUoJ3RocmVlLWJ1ZmZlci12ZXJ0ZXgtZGF0YScpXG52YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpXG5cbnZhciB2ZXJ0aWNlcyA9IHJlcXVpcmUoJy4vbGliL3ZlcnRpY2VzJylcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vbGliL3V0aWxzJylcblxudmFyIEJhc2UgPSBUSFJFRS5CdWZmZXJHZW9tZXRyeVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVRleHRHZW9tZXRyeSAob3B0KSB7XG4gIHJldHVybiBuZXcgVGV4dEdlb21ldHJ5KG9wdClcbn1cblxuZnVuY3Rpb24gVGV4dEdlb21ldHJ5IChvcHQpIHtcbiAgQmFzZS5jYWxsKHRoaXMpXG5cbiAgaWYgKHR5cGVvZiBvcHQgPT09ICdzdHJpbmcnKSB7XG4gICAgb3B0ID0geyB0ZXh0OiBvcHQgfVxuICB9XG5cbiAgLy8gdXNlIHRoZXNlIGFzIGRlZmF1bHQgdmFsdWVzIGZvciBhbnkgc3Vic2VxdWVudFxuICAvLyBjYWxscyB0byB1cGRhdGUoKVxuICB0aGlzLl9vcHQgPSBhc3NpZ24oe30sIG9wdClcblxuICAvLyBhbHNvIGRvIGFuIGluaXRpYWwgc2V0dXAuLi5cbiAgaWYgKG9wdCkgdGhpcy51cGRhdGUob3B0KVxufVxuXG5pbmhlcml0cyhUZXh0R2VvbWV0cnksIEJhc2UpXG5cblRleHRHZW9tZXRyeS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKG9wdCkge1xuICBpZiAodHlwZW9mIG9wdCA9PT0gJ3N0cmluZycpIHtcbiAgICBvcHQgPSB7IHRleHQ6IG9wdCB9XG4gIH1cblxuICAvLyB1c2UgY29uc3RydWN0b3IgZGVmYXVsdHNcbiAgb3B0ID0gYXNzaWduKHt9LCB0aGlzLl9vcHQsIG9wdClcblxuICBpZiAoIW9wdC5mb250KSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbXVzdCBzcGVjaWZ5IGEgeyBmb250IH0gaW4gb3B0aW9ucycpXG4gIH1cblxuICB0aGlzLmxheW91dCA9IGNyZWF0ZUxheW91dChvcHQpXG5cbiAgLy8gZ2V0IHZlYzIgdGV4Y29vcmRzXG4gIHZhciBmbGlwWSA9IG9wdC5mbGlwWSAhPT0gZmFsc2VcblxuICAvLyB0aGUgZGVzaXJlZCBCTUZvbnQgZGF0YVxuICB2YXIgZm9udCA9IG9wdC5mb250XG5cbiAgLy8gZGV0ZXJtaW5lIHRleHR1cmUgc2l6ZSBmcm9tIGZvbnQgZmlsZVxuICB2YXIgdGV4V2lkdGggPSBmb250LmNvbW1vbi5zY2FsZVdcbiAgdmFyIHRleEhlaWdodCA9IGZvbnQuY29tbW9uLnNjYWxlSFxuXG4gIC8vIGdldCB2aXNpYmxlIGdseXBoc1xuICB2YXIgZ2x5cGhzID0gdGhpcy5sYXlvdXQuZ2x5cGhzLmZpbHRlcihmdW5jdGlvbiAoZ2x5cGgpIHtcbiAgICB2YXIgYml0bWFwID0gZ2x5cGguZGF0YVxuICAgIHJldHVybiBiaXRtYXAud2lkdGggKiBiaXRtYXAuaGVpZ2h0ID4gMFxuICB9KVxuXG4gIC8vIHByb3ZpZGUgdmlzaWJsZSBnbHlwaHMgZm9yIGNvbnZlbmllbmNlXG4gIHRoaXMudmlzaWJsZUdseXBocyA9IGdseXBoc1xuXG4gIC8vIGdldCBjb21tb24gdmVydGV4IGRhdGFcbiAgdmFyIHBvc2l0aW9ucyA9IHZlcnRpY2VzLnBvc2l0aW9ucyhnbHlwaHMpXG4gIHZhciB1dnMgPSB2ZXJ0aWNlcy51dnMoZ2x5cGhzLCB0ZXhXaWR0aCwgdGV4SGVpZ2h0LCBmbGlwWSlcbiAgdmFyIGluZGljZXMgPSBjcmVhdGVJbmRpY2VzKHtcbiAgICBjbG9ja3dpc2U6IHRydWUsXG4gICAgdHlwZTogJ3VpbnQxNicsXG4gICAgY291bnQ6IGdseXBocy5sZW5ndGhcbiAgfSlcblxuICAvLyB1cGRhdGUgdmVydGV4IGRhdGFcbiAgYnVmZmVyLmluZGV4KHRoaXMsIGluZGljZXMsIDEsICd1aW50MTYnKVxuICBidWZmZXIuYXR0cih0aGlzLCAncG9zaXRpb24nLCBwb3NpdGlvbnMsIDIpXG4gIGJ1ZmZlci5hdHRyKHRoaXMsICd1dicsIHV2cywgMilcblxuICAvLyB1cGRhdGUgbXVsdGlwYWdlIGRhdGFcbiAgaWYgKCFvcHQubXVsdGlwYWdlICYmICdwYWdlJyBpbiB0aGlzLmF0dHJpYnV0ZXMpIHtcbiAgICAvLyBkaXNhYmxlIG11bHRpcGFnZSByZW5kZXJpbmdcbiAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgncGFnZScpXG4gIH0gZWxzZSBpZiAob3B0Lm11bHRpcGFnZSkge1xuICAgIHZhciBwYWdlcyA9IHZlcnRpY2VzLnBhZ2VzKGdseXBocylcbiAgICAvLyBlbmFibGUgbXVsdGlwYWdlIHJlbmRlcmluZ1xuICAgIGJ1ZmZlci5hdHRyKHRoaXMsICdwYWdlJywgcGFnZXMsIDEpXG4gIH1cbn1cblxuVGV4dEdlb21ldHJ5LnByb3RvdHlwZS5jb21wdXRlQm91bmRpbmdTcGhlcmUgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmJvdW5kaW5nU3BoZXJlID09PSBudWxsKSB7XG4gICAgdGhpcy5ib3VuZGluZ1NwaGVyZSA9IG5ldyBUSFJFRS5TcGhlcmUoKVxuICB9XG5cbiAgdmFyIHBvc2l0aW9ucyA9IHRoaXMuYXR0cmlidXRlcy5wb3NpdGlvbi5hcnJheVxuICB2YXIgaXRlbVNpemUgPSB0aGlzLmF0dHJpYnV0ZXMucG9zaXRpb24uaXRlbVNpemVcbiAgaWYgKCFwb3NpdGlvbnMgfHwgIWl0ZW1TaXplIHx8IHBvc2l0aW9ucy5sZW5ndGggPCAyKSB7XG4gICAgdGhpcy5ib3VuZGluZ1NwaGVyZS5yYWRpdXMgPSAwXG4gICAgdGhpcy5ib3VuZGluZ1NwaGVyZS5jZW50ZXIuc2V0KDAsIDAsIDApXG4gICAgcmV0dXJuXG4gIH1cbiAgdXRpbHMuY29tcHV0ZVNwaGVyZShwb3NpdGlvbnMsIHRoaXMuYm91bmRpbmdTcGhlcmUpXG4gIGlmIChpc05hTih0aGlzLmJvdW5kaW5nU3BoZXJlLnJhZGl1cykpIHtcbiAgICBjb25zb2xlLmVycm9yKCdUSFJFRS5CdWZmZXJHZW9tZXRyeS5jb21wdXRlQm91bmRpbmdTcGhlcmUoKTogJyArXG4gICAgICAnQ29tcHV0ZWQgcmFkaXVzIGlzIE5hTi4gVGhlICcgK1xuICAgICAgJ1wicG9zaXRpb25cIiBhdHRyaWJ1dGUgaXMgbGlrZWx5IHRvIGhhdmUgTmFOIHZhbHVlcy4nKVxuICB9XG59XG5cblRleHRHZW9tZXRyeS5wcm90b3R5cGUuY29tcHV0ZUJvdW5kaW5nQm94ID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5ib3VuZGluZ0JveCA9PT0gbnVsbCkge1xuICAgIHRoaXMuYm91bmRpbmdCb3ggPSBuZXcgVEhSRUUuQm94MygpXG4gIH1cblxuICB2YXIgYmJveCA9IHRoaXMuYm91bmRpbmdCb3hcbiAgdmFyIHBvc2l0aW9ucyA9IHRoaXMuYXR0cmlidXRlcy5wb3NpdGlvbi5hcnJheVxuICB2YXIgaXRlbVNpemUgPSB0aGlzLmF0dHJpYnV0ZXMucG9zaXRpb24uaXRlbVNpemVcbiAgaWYgKCFwb3NpdGlvbnMgfHwgIWl0ZW1TaXplIHx8IHBvc2l0aW9ucy5sZW5ndGggPCAyKSB7XG4gICAgYmJveC5tYWtlRW1wdHkoKVxuICAgIHJldHVyblxuICB9XG4gIHV0aWxzLmNvbXB1dGVCb3gocG9zaXRpb25zLCBiYm94KVxufVxuIiwidmFyIGl0ZW1TaXplID0gMlxudmFyIGJveCA9IHsgbWluOiBbMCwgMF0sIG1heDogWzAsIDBdIH1cblxuZnVuY3Rpb24gYm91bmRzIChwb3NpdGlvbnMpIHtcbiAgdmFyIGNvdW50ID0gcG9zaXRpb25zLmxlbmd0aCAvIGl0ZW1TaXplXG4gIGJveC5taW5bMF0gPSBwb3NpdGlvbnNbMF1cbiAgYm94Lm1pblsxXSA9IHBvc2l0aW9uc1sxXVxuICBib3gubWF4WzBdID0gcG9zaXRpb25zWzBdXG4gIGJveC5tYXhbMV0gPSBwb3NpdGlvbnNbMV1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICB2YXIgeCA9IHBvc2l0aW9uc1tpICogaXRlbVNpemUgKyAwXVxuICAgIHZhciB5ID0gcG9zaXRpb25zW2kgKiBpdGVtU2l6ZSArIDFdXG4gICAgYm94Lm1pblswXSA9IE1hdGgubWluKHgsIGJveC5taW5bMF0pXG4gICAgYm94Lm1pblsxXSA9IE1hdGgubWluKHksIGJveC5taW5bMV0pXG4gICAgYm94Lm1heFswXSA9IE1hdGgubWF4KHgsIGJveC5tYXhbMF0pXG4gICAgYm94Lm1heFsxXSA9IE1hdGgubWF4KHksIGJveC5tYXhbMV0pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMuY29tcHV0ZUJveCA9IGZ1bmN0aW9uIChwb3NpdGlvbnMsIG91dHB1dCkge1xuICBib3VuZHMocG9zaXRpb25zKVxuICBvdXRwdXQubWluLnNldChib3gubWluWzBdLCBib3gubWluWzFdLCAwKVxuICBvdXRwdXQubWF4LnNldChib3gubWF4WzBdLCBib3gubWF4WzFdLCAwKVxufVxuXG5tb2R1bGUuZXhwb3J0cy5jb21wdXRlU3BoZXJlID0gZnVuY3Rpb24gKHBvc2l0aW9ucywgb3V0cHV0KSB7XG4gIGJvdW5kcyhwb3NpdGlvbnMpXG4gIHZhciBtaW5YID0gYm94Lm1pblswXVxuICB2YXIgbWluWSA9IGJveC5taW5bMV1cbiAgdmFyIG1heFggPSBib3gubWF4WzBdXG4gIHZhciBtYXhZID0gYm94Lm1heFsxXVxuICB2YXIgd2lkdGggPSBtYXhYIC0gbWluWFxuICB2YXIgaGVpZ2h0ID0gbWF4WSAtIG1pbllcbiAgdmFyIGxlbmd0aCA9IE1hdGguc3FydCh3aWR0aCAqIHdpZHRoICsgaGVpZ2h0ICogaGVpZ2h0KVxuICBvdXRwdXQuY2VudGVyLnNldChtaW5YICsgd2lkdGggLyAyLCBtaW5ZICsgaGVpZ2h0IC8gMiwgMClcbiAgb3V0cHV0LnJhZGl1cyA9IGxlbmd0aCAvIDJcbn1cbiIsIm1vZHVsZS5leHBvcnRzLnBhZ2VzID0gZnVuY3Rpb24gcGFnZXMgKGdseXBocykge1xuICB2YXIgcGFnZXMgPSBuZXcgRmxvYXQzMkFycmF5KGdseXBocy5sZW5ndGggKiA0ICogMSlcbiAgdmFyIGkgPSAwXG4gIGdseXBocy5mb3JFYWNoKGZ1bmN0aW9uIChnbHlwaCkge1xuICAgIHZhciBpZCA9IGdseXBoLmRhdGEucGFnZSB8fCAwXG4gICAgcGFnZXNbaSsrXSA9IGlkXG4gICAgcGFnZXNbaSsrXSA9IGlkXG4gICAgcGFnZXNbaSsrXSA9IGlkXG4gICAgcGFnZXNbaSsrXSA9IGlkXG4gIH0pXG4gIHJldHVybiBwYWdlc1xufVxuXG5tb2R1bGUuZXhwb3J0cy51dnMgPSBmdW5jdGlvbiB1dnMgKGdseXBocywgdGV4V2lkdGgsIHRleEhlaWdodCwgZmxpcFkpIHtcbiAgdmFyIHV2cyA9IG5ldyBGbG9hdDMyQXJyYXkoZ2x5cGhzLmxlbmd0aCAqIDQgKiAyKVxuICB2YXIgaSA9IDBcbiAgZ2x5cGhzLmZvckVhY2goZnVuY3Rpb24gKGdseXBoKSB7XG4gICAgdmFyIGJpdG1hcCA9IGdseXBoLmRhdGFcbiAgICB2YXIgYncgPSAoYml0bWFwLnggKyBiaXRtYXAud2lkdGgpXG4gICAgdmFyIGJoID0gKGJpdG1hcC55ICsgYml0bWFwLmhlaWdodClcblxuICAgIC8vIHRvcCBsZWZ0IHBvc2l0aW9uXG4gICAgdmFyIHUwID0gYml0bWFwLnggLyB0ZXhXaWR0aFxuICAgIHZhciB2MSA9IGJpdG1hcC55IC8gdGV4SGVpZ2h0XG4gICAgdmFyIHUxID0gYncgLyB0ZXhXaWR0aFxuICAgIHZhciB2MCA9IGJoIC8gdGV4SGVpZ2h0XG5cbiAgICBpZiAoZmxpcFkpIHtcbiAgICAgIHYxID0gKHRleEhlaWdodCAtIGJpdG1hcC55KSAvIHRleEhlaWdodFxuICAgICAgdjAgPSAodGV4SGVpZ2h0IC0gYmgpIC8gdGV4SGVpZ2h0XG4gICAgfVxuXG4gICAgLy8gQkxcbiAgICB1dnNbaSsrXSA9IHUwXG4gICAgdXZzW2krK10gPSB2MVxuICAgIC8vIFRMXG4gICAgdXZzW2krK10gPSB1MFxuICAgIHV2c1tpKytdID0gdjBcbiAgICAvLyBUUlxuICAgIHV2c1tpKytdID0gdTFcbiAgICB1dnNbaSsrXSA9IHYwXG4gICAgLy8gQlJcbiAgICB1dnNbaSsrXSA9IHUxXG4gICAgdXZzW2krK10gPSB2MVxuICB9KVxuICByZXR1cm4gdXZzXG59XG5cbm1vZHVsZS5leHBvcnRzLnBvc2l0aW9ucyA9IGZ1bmN0aW9uIHBvc2l0aW9ucyAoZ2x5cGhzKSB7XG4gIHZhciBwb3NpdGlvbnMgPSBuZXcgRmxvYXQzMkFycmF5KGdseXBocy5sZW5ndGggKiA0ICogMilcbiAgdmFyIGkgPSAwXG4gIGdseXBocy5mb3JFYWNoKGZ1bmN0aW9uIChnbHlwaCkge1xuICAgIHZhciBiaXRtYXAgPSBnbHlwaC5kYXRhXG5cbiAgICAvLyBib3R0b20gbGVmdCBwb3NpdGlvblxuICAgIHZhciB4ID0gZ2x5cGgucG9zaXRpb25bMF0gKyBiaXRtYXAueG9mZnNldFxuICAgIHZhciB5ID0gZ2x5cGgucG9zaXRpb25bMV0gKyBiaXRtYXAueW9mZnNldFxuXG4gICAgLy8gcXVhZCBzaXplXG4gICAgdmFyIHcgPSBiaXRtYXAud2lkdGhcbiAgICB2YXIgaCA9IGJpdG1hcC5oZWlnaHRcblxuICAgIC8vIEJMXG4gICAgcG9zaXRpb25zW2krK10gPSB4XG4gICAgcG9zaXRpb25zW2krK10gPSB5XG4gICAgLy8gVExcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHhcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHkgKyBoXG4gICAgLy8gVFJcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHggKyB3XG4gICAgcG9zaXRpb25zW2krK10gPSB5ICsgaFxuICAgIC8vIEJSXG4gICAgcG9zaXRpb25zW2krK10gPSB4ICsgd1xuICAgIHBvc2l0aW9uc1tpKytdID0geVxuICB9KVxuICByZXR1cm4gcG9zaXRpb25zXG59XG4iLCJ2YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlU0RGU2hhZGVyIChvcHQpIHtcbiAgb3B0ID0gb3B0IHx8IHt9XG4gIHZhciBvcGFjaXR5ID0gdHlwZW9mIG9wdC5vcGFjaXR5ID09PSAnbnVtYmVyJyA/IG9wdC5vcGFjaXR5IDogMVxuICB2YXIgYWxwaGFUZXN0ID0gdHlwZW9mIG9wdC5hbHBoYVRlc3QgPT09ICdudW1iZXInID8gb3B0LmFscGhhVGVzdCA6IDAuMDAwMVxuICB2YXIgcHJlY2lzaW9uID0gb3B0LnByZWNpc2lvbiB8fCAnaGlnaHAnXG4gIHZhciBjb2xvciA9IG9wdC5jb2xvclxuICB2YXIgbWFwID0gb3B0Lm1hcFxuXG4gIC8vIHJlbW92ZSB0byBzYXRpc2Z5IHI3M1xuICBkZWxldGUgb3B0Lm1hcFxuICBkZWxldGUgb3B0LmNvbG9yXG4gIGRlbGV0ZSBvcHQucHJlY2lzaW9uXG4gIGRlbGV0ZSBvcHQub3BhY2l0eVxuXG4gIHJldHVybiBhc3NpZ24oe1xuICAgIHVuaWZvcm1zOiB7XG4gICAgICBvcGFjaXR5OiB7IHR5cGU6ICdmJywgdmFsdWU6IG9wYWNpdHkgfSxcbiAgICAgIG1hcDogeyB0eXBlOiAndCcsIHZhbHVlOiBtYXAgfHwgbmV3IFRIUkVFLlRleHR1cmUoKSB9LFxuICAgICAgY29sb3I6IHsgdHlwZTogJ2MnLCB2YWx1ZTogbmV3IFRIUkVFLkNvbG9yKGNvbG9yKSB9XG4gICAgfSxcbiAgICB2ZXJ0ZXhTaGFkZXI6IFtcbiAgICAgICdhdHRyaWJ1dGUgdmVjMiB1djsnLFxuICAgICAgJ2F0dHJpYnV0ZSB2ZWM0IHBvc2l0aW9uOycsXG4gICAgICAndW5pZm9ybSBtYXQ0IHByb2plY3Rpb25NYXRyaXg7JyxcbiAgICAgICd1bmlmb3JtIG1hdDQgbW9kZWxWaWV3TWF0cml4OycsXG4gICAgICAndmFyeWluZyB2ZWMyIHZVdjsnLFxuICAgICAgJ3ZvaWQgbWFpbigpIHsnLFxuICAgICAgJ3ZVdiA9IHV2OycsXG4gICAgICAnZ2xfUG9zaXRpb24gPSBwcm9qZWN0aW9uTWF0cml4ICogbW9kZWxWaWV3TWF0cml4ICogcG9zaXRpb247JyxcbiAgICAgICd9J1xuICAgIF0uam9pbignXFxuJyksXG4gICAgZnJhZ21lbnRTaGFkZXI6IFtcbiAgICAgICcjaWZkZWYgR0xfT0VTX3N0YW5kYXJkX2Rlcml2YXRpdmVzJyxcbiAgICAgICcjZXh0ZW5zaW9uIEdMX09FU19zdGFuZGFyZF9kZXJpdmF0aXZlcyA6IGVuYWJsZScsXG4gICAgICAnI2VuZGlmJyxcbiAgICAgICdwcmVjaXNpb24gJyArIHByZWNpc2lvbiArICcgZmxvYXQ7JyxcbiAgICAgICd1bmlmb3JtIGZsb2F0IG9wYWNpdHk7JyxcbiAgICAgICd1bmlmb3JtIHZlYzMgY29sb3I7JyxcbiAgICAgICd1bmlmb3JtIHNhbXBsZXIyRCBtYXA7JyxcbiAgICAgICd2YXJ5aW5nIHZlYzIgdlV2OycsXG5cbiAgICAgICdmbG9hdCBhYXN0ZXAoZmxvYXQgdmFsdWUpIHsnLFxuICAgICAgJyAgI2lmZGVmIEdMX09FU19zdGFuZGFyZF9kZXJpdmF0aXZlcycsXG4gICAgICAnICAgIGZsb2F0IGFmd2lkdGggPSBsZW5ndGgodmVjMihkRmR4KHZhbHVlKSwgZEZkeSh2YWx1ZSkpKSAqIDAuNzA3MTA2NzgxMTg2NTQ3NTc7JyxcbiAgICAgICcgICNlbHNlJyxcbiAgICAgICcgICAgZmxvYXQgYWZ3aWR0aCA9ICgxLjAgLyAzMi4wKSAqICgxLjQxNDIxMzU2MjM3MzA5NTEgLyAoMi4wICogZ2xfRnJhZ0Nvb3JkLncpKTsnLFxuICAgICAgJyAgI2VuZGlmJyxcbiAgICAgICcgIHJldHVybiBzbW9vdGhzdGVwKDAuNSAtIGFmd2lkdGgsIDAuNSArIGFmd2lkdGgsIHZhbHVlKTsnLFxuICAgICAgJ30nLFxuXG4gICAgICAndm9pZCBtYWluKCkgeycsXG4gICAgICAnICB2ZWM0IHRleENvbG9yID0gdGV4dHVyZTJEKG1hcCwgdlV2KTsnLFxuICAgICAgJyAgZmxvYXQgYWxwaGEgPSBhYXN0ZXAodGV4Q29sb3IuYSk7JyxcbiAgICAgICcgIGdsX0ZyYWdDb2xvciA9IHZlYzQoY29sb3IsIG9wYWNpdHkgKiBhbHBoYSk7JyxcbiAgICAgIGFscGhhVGVzdCA9PT0gMFxuICAgICAgICA/ICcnXG4gICAgICAgIDogJyAgaWYgKGdsX0ZyYWdDb2xvci5hIDwgJyArIGFscGhhVGVzdCArICcpIGRpc2NhcmQ7JyxcbiAgICAgICd9J1xuICAgIF0uam9pbignXFxuJylcbiAgfSwgb3B0KVxufVxuIiwidmFyIGZsYXR0ZW4gPSByZXF1aXJlKCdmbGF0dGVuLXZlcnRleC1kYXRhJylcbnZhciB3YXJuZWQgPSBmYWxzZTtcblxubW9kdWxlLmV4cG9ydHMuYXR0ciA9IHNldEF0dHJpYnV0ZVxubW9kdWxlLmV4cG9ydHMuaW5kZXggPSBzZXRJbmRleFxuXG5mdW5jdGlvbiBzZXRJbmRleCAoZ2VvbWV0cnksIGRhdGEsIGl0ZW1TaXplLCBkdHlwZSkge1xuICBpZiAodHlwZW9mIGl0ZW1TaXplICE9PSAnbnVtYmVyJykgaXRlbVNpemUgPSAxXG4gIGlmICh0eXBlb2YgZHR5cGUgIT09ICdzdHJpbmcnKSBkdHlwZSA9ICd1aW50MTYnXG5cbiAgdmFyIGlzUjY5ID0gIWdlb21ldHJ5LmluZGV4ICYmIHR5cGVvZiBnZW9tZXRyeS5zZXRJbmRleCAhPT0gJ2Z1bmN0aW9uJ1xuICB2YXIgYXR0cmliID0gaXNSNjkgPyBnZW9tZXRyeS5nZXRBdHRyaWJ1dGUoJ2luZGV4JykgOiBnZW9tZXRyeS5pbmRleFxuICB2YXIgbmV3QXR0cmliID0gdXBkYXRlQXR0cmlidXRlKGF0dHJpYiwgZGF0YSwgaXRlbVNpemUsIGR0eXBlKVxuICBpZiAobmV3QXR0cmliKSB7XG4gICAgaWYgKGlzUjY5KSBnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoJ2luZGV4JywgbmV3QXR0cmliKVxuICAgIGVsc2UgZ2VvbWV0cnkuaW5kZXggPSBuZXdBdHRyaWJcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGUgKGdlb21ldHJ5LCBrZXksIGRhdGEsIGl0ZW1TaXplLCBkdHlwZSkge1xuICBpZiAodHlwZW9mIGl0ZW1TaXplICE9PSAnbnVtYmVyJykgaXRlbVNpemUgPSAzXG4gIGlmICh0eXBlb2YgZHR5cGUgIT09ICdzdHJpbmcnKSBkdHlwZSA9ICdmbG9hdDMyJ1xuICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSAmJlxuICAgIEFycmF5LmlzQXJyYXkoZGF0YVswXSkgJiZcbiAgICBkYXRhWzBdLmxlbmd0aCAhPT0gaXRlbVNpemUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05lc3RlZCB2ZXJ0ZXggYXJyYXkgaGFzIHVuZXhwZWN0ZWQgc2l6ZTsgZXhwZWN0ZWQgJyArXG4gICAgICBpdGVtU2l6ZSArICcgYnV0IGZvdW5kICcgKyBkYXRhWzBdLmxlbmd0aClcbiAgfVxuXG4gIHZhciBhdHRyaWIgPSBnZW9tZXRyeS5nZXRBdHRyaWJ1dGUoa2V5KVxuICB2YXIgbmV3QXR0cmliID0gdXBkYXRlQXR0cmlidXRlKGF0dHJpYiwgZGF0YSwgaXRlbVNpemUsIGR0eXBlKVxuICBpZiAobmV3QXR0cmliKSB7XG4gICAgZ2VvbWV0cnkuYWRkQXR0cmlidXRlKGtleSwgbmV3QXR0cmliKVxuICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUF0dHJpYnV0ZSAoYXR0cmliLCBkYXRhLCBpdGVtU2l6ZSwgZHR5cGUpIHtcbiAgZGF0YSA9IGRhdGEgfHwgW11cbiAgaWYgKCFhdHRyaWIgfHwgcmVidWlsZEF0dHJpYnV0ZShhdHRyaWIsIGRhdGEsIGl0ZW1TaXplKSkge1xuICAgIC8vIGNyZWF0ZSBhIG5ldyBhcnJheSB3aXRoIGRlc2lyZWQgdHlwZVxuICAgIGRhdGEgPSBmbGF0dGVuKGRhdGEsIGR0eXBlKVxuXG4gICAgdmFyIG5lZWRzTmV3QnVmZmVyID0gYXR0cmliICYmIHR5cGVvZiBhdHRyaWIuc2V0QXJyYXkgIT09ICdmdW5jdGlvbidcbiAgICBpZiAoIWF0dHJpYiB8fCBuZWVkc05ld0J1ZmZlcikge1xuICAgICAgLy8gV2UgYXJlIG9uIGFuIG9sZCB2ZXJzaW9uIG9mIFRocmVlSlMgd2hpY2ggY2FuJ3RcbiAgICAgIC8vIHN1cHBvcnQgZ3Jvd2luZyAvIHNocmlua2luZyBidWZmZXJzLCBzbyB3ZSBuZWVkXG4gICAgICAvLyB0byBidWlsZCBhIG5ldyBidWZmZXJcbiAgICAgIGlmIChuZWVkc05ld0J1ZmZlciAmJiAhd2FybmVkKSB7XG4gICAgICAgIHdhcm5lZCA9IHRydWVcbiAgICAgICAgY29uc29sZS53YXJuKFtcbiAgICAgICAgICAnQSBXZWJHTCBidWZmZXIgaXMgYmVpbmcgdXBkYXRlZCB3aXRoIGEgbmV3IHNpemUgb3IgaXRlbVNpemUsICcsXG4gICAgICAgICAgJ2hvd2V2ZXIgdGhpcyB2ZXJzaW9uIG9mIFRocmVlSlMgb25seSBzdXBwb3J0cyBmaXhlZC1zaXplIGJ1ZmZlcnMuJyxcbiAgICAgICAgICAnXFxuVGhlIG9sZCBidWZmZXIgbWF5IHN0aWxsIGJlIGtlcHQgaW4gbWVtb3J5LlxcbicsXG4gICAgICAgICAgJ1RvIGF2b2lkIG1lbW9yeSBsZWFrcywgaXQgaXMgcmVjb21tZW5kZWQgdGhhdCB5b3UgZGlzcG9zZSAnLFxuICAgICAgICAgICd5b3VyIGdlb21ldHJpZXMgYW5kIGNyZWF0ZSBuZXcgb25lcywgb3IgdXBkYXRlIHRvIFRocmVlSlMgcjgyIG9yIG5ld2VyLlxcbicsXG4gICAgICAgICAgJ1NlZSBoZXJlIGZvciBkaXNjdXNzaW9uOlxcbicsXG4gICAgICAgICAgJ2h0dHBzOi8vZ2l0aHViLmNvbS9tcmRvb2IvdGhyZWUuanMvcHVsbC85NjMxJ1xuICAgICAgICBdLmpvaW4oJycpKVxuICAgICAgfVxuXG4gICAgICAvLyBCdWlsZCBhIG5ldyBhdHRyaWJ1dGVcbiAgICAgIGF0dHJpYiA9IG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUoZGF0YSwgaXRlbVNpemUpO1xuICAgIH1cblxuICAgIGF0dHJpYi5pdGVtU2l6ZSA9IGl0ZW1TaXplXG4gICAgYXR0cmliLm5lZWRzVXBkYXRlID0gdHJ1ZVxuXG4gICAgLy8gTmV3IHZlcnNpb25zIG9mIFRocmVlSlMgc3VnZ2VzdCB1c2luZyBzZXRBcnJheVxuICAgIC8vIHRvIGNoYW5nZSB0aGUgZGF0YS4gSXQgd2lsbCB1c2UgYnVmZmVyRGF0YSBpbnRlcm5hbGx5LFxuICAgIC8vIHNvIHlvdSBjYW4gY2hhbmdlIHRoZSBhcnJheSBzaXplIHdpdGhvdXQgYW55IGlzc3Vlc1xuICAgIGlmICh0eXBlb2YgYXR0cmliLnNldEFycmF5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhdHRyaWIuc2V0QXJyYXkoZGF0YSlcbiAgICB9XG5cbiAgICByZXR1cm4gYXR0cmliXG4gIH0gZWxzZSB7XG4gICAgLy8gY29weSBkYXRhIGludG8gdGhlIGV4aXN0aW5nIGFycmF5XG4gICAgZmxhdHRlbihkYXRhLCBhdHRyaWIuYXJyYXkpXG4gICAgYXR0cmliLm5lZWRzVXBkYXRlID0gdHJ1ZVxuICAgIHJldHVybiBudWxsXG4gIH1cbn1cblxuLy8gVGVzdCB3aGV0aGVyIHRoZSBhdHRyaWJ1dGUgbmVlZHMgdG8gYmUgcmUtY3JlYXRlZCxcbi8vIHJldHVybnMgZmFsc2UgaWYgd2UgY2FuIHJlLXVzZSBpdCBhcy1pcy5cbmZ1bmN0aW9uIHJlYnVpbGRBdHRyaWJ1dGUgKGF0dHJpYiwgZGF0YSwgaXRlbVNpemUpIHtcbiAgaWYgKGF0dHJpYi5pdGVtU2l6ZSAhPT0gaXRlbVNpemUpIHJldHVybiB0cnVlXG4gIGlmICghYXR0cmliLmFycmF5KSByZXR1cm4gdHJ1ZVxuICB2YXIgYXR0cmliTGVuZ3RoID0gYXR0cmliLmFycmF5Lmxlbmd0aFxuICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSAmJiBBcnJheS5pc0FycmF5KGRhdGFbMF0pKSB7XG4gICAgLy8gWyBbIHgsIHksIHogXSBdXG4gICAgcmV0dXJuIGF0dHJpYkxlbmd0aCAhPT0gZGF0YS5sZW5ndGggKiBpdGVtU2l6ZVxuICB9IGVsc2Uge1xuICAgIC8vIFsgeCwgeSwgeiBdXG4gICAgcmV0dXJuIGF0dHJpYkxlbmd0aCAhPT0gZGF0YS5sZW5ndGhcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cbiIsInZhciBuZXdsaW5lID0gL1xcbi9cbnZhciBuZXdsaW5lQ2hhciA9ICdcXG4nXG52YXIgd2hpdGVzcGFjZSA9IC9cXHMvXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGV4dCwgb3B0KSB7XG4gICAgdmFyIGxpbmVzID0gbW9kdWxlLmV4cG9ydHMubGluZXModGV4dCwgb3B0KVxuICAgIHJldHVybiBsaW5lcy5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICByZXR1cm4gdGV4dC5zdWJzdHJpbmcobGluZS5zdGFydCwgbGluZS5lbmQpXG4gICAgfSkuam9pbignXFxuJylcbn1cblxubW9kdWxlLmV4cG9ydHMubGluZXMgPSBmdW5jdGlvbiB3b3Jkd3JhcCh0ZXh0LCBvcHQpIHtcbiAgICBvcHQgPSBvcHR8fHt9XG5cbiAgICAvL3plcm8gd2lkdGggcmVzdWx0cyBpbiBub3RoaW5nIHZpc2libGVcbiAgICBpZiAob3B0LndpZHRoID09PSAwICYmIG9wdC5tb2RlICE9PSAnbm93cmFwJykgXG4gICAgICAgIHJldHVybiBbXVxuXG4gICAgdGV4dCA9IHRleHR8fCcnXG4gICAgdmFyIHdpZHRoID0gdHlwZW9mIG9wdC53aWR0aCA9PT0gJ251bWJlcicgPyBvcHQud2lkdGggOiBOdW1iZXIuTUFYX1ZBTFVFXG4gICAgdmFyIHN0YXJ0ID0gTWF0aC5tYXgoMCwgb3B0LnN0YXJ0fHwwKVxuICAgIHZhciBlbmQgPSB0eXBlb2Ygb3B0LmVuZCA9PT0gJ251bWJlcicgPyBvcHQuZW5kIDogdGV4dC5sZW5ndGhcbiAgICB2YXIgbW9kZSA9IG9wdC5tb2RlXG5cbiAgICB2YXIgbWVhc3VyZSA9IG9wdC5tZWFzdXJlIHx8IG1vbm9zcGFjZVxuICAgIGlmIChtb2RlID09PSAncHJlJylcbiAgICAgICAgcmV0dXJuIHByZShtZWFzdXJlLCB0ZXh0LCBzdGFydCwgZW5kLCB3aWR0aClcbiAgICBlbHNlXG4gICAgICAgIHJldHVybiBncmVlZHkobWVhc3VyZSwgdGV4dCwgc3RhcnQsIGVuZCwgd2lkdGgsIG1vZGUpXG59XG5cbmZ1bmN0aW9uIGlkeE9mKHRleHQsIGNociwgc3RhcnQsIGVuZCkge1xuICAgIHZhciBpZHggPSB0ZXh0LmluZGV4T2YoY2hyLCBzdGFydClcbiAgICBpZiAoaWR4ID09PSAtMSB8fCBpZHggPiBlbmQpXG4gICAgICAgIHJldHVybiBlbmRcbiAgICByZXR1cm4gaWR4XG59XG5cbmZ1bmN0aW9uIGlzV2hpdGVzcGFjZShjaHIpIHtcbiAgICByZXR1cm4gd2hpdGVzcGFjZS50ZXN0KGNocilcbn1cblxuZnVuY3Rpb24gcHJlKG1lYXN1cmUsIHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoKSB7XG4gICAgdmFyIGxpbmVzID0gW11cbiAgICB2YXIgbGluZVN0YXJ0ID0gc3RhcnRcbiAgICBmb3IgKHZhciBpPXN0YXJ0OyBpPGVuZCAmJiBpPHRleHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNociA9IHRleHQuY2hhckF0KGkpXG4gICAgICAgIHZhciBpc05ld2xpbmUgPSBuZXdsaW5lLnRlc3QoY2hyKVxuXG4gICAgICAgIC8vSWYgd2UndmUgcmVhY2hlZCBhIG5ld2xpbmUsIHRoZW4gc3RlcCBkb3duIGEgbGluZVxuICAgICAgICAvL09yIGlmIHdlJ3ZlIHJlYWNoZWQgdGhlIEVPRlxuICAgICAgICBpZiAoaXNOZXdsaW5lIHx8IGk9PT1lbmQtMSkge1xuICAgICAgICAgICAgdmFyIGxpbmVFbmQgPSBpc05ld2xpbmUgPyBpIDogaSsxXG4gICAgICAgICAgICB2YXIgbWVhc3VyZWQgPSBtZWFzdXJlKHRleHQsIGxpbmVTdGFydCwgbGluZUVuZCwgd2lkdGgpXG4gICAgICAgICAgICBsaW5lcy5wdXNoKG1lYXN1cmVkKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBsaW5lU3RhcnQgPSBpKzFcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbGluZXNcbn1cblxuZnVuY3Rpb24gZ3JlZWR5KG1lYXN1cmUsIHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoLCBtb2RlKSB7XG4gICAgLy9BIGdyZWVkeSB3b3JkIHdyYXBwZXIgYmFzZWQgb24gTGliR0RYIGFsZ29yaXRobVxuICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL2xpYmdkeC9saWJnZHgvYmxvYi9tYXN0ZXIvZ2R4L3NyYy9jb20vYmFkbG9naWMvZ2R4L2dyYXBoaWNzL2cyZC9CaXRtYXBGb250Q2FjaGUuamF2YVxuICAgIHZhciBsaW5lcyA9IFtdXG5cbiAgICB2YXIgdGVzdFdpZHRoID0gd2lkdGhcbiAgICAvL2lmICdub3dyYXAnIGlzIHNwZWNpZmllZCwgd2Ugb25seSB3cmFwIG9uIG5ld2xpbmUgY2hhcnNcbiAgICBpZiAobW9kZSA9PT0gJ25vd3JhcCcpXG4gICAgICAgIHRlc3RXaWR0aCA9IE51bWJlci5NQVhfVkFMVUVcblxuICAgIHdoaWxlIChzdGFydCA8IGVuZCAmJiBzdGFydCA8IHRleHQubGVuZ3RoKSB7XG4gICAgICAgIC8vZ2V0IG5leHQgbmV3bGluZSBwb3NpdGlvblxuICAgICAgICB2YXIgbmV3TGluZSA9IGlkeE9mKHRleHQsIG5ld2xpbmVDaGFyLCBzdGFydCwgZW5kKVxuXG4gICAgICAgIC8vZWF0IHdoaXRlc3BhY2UgYXQgc3RhcnQgb2YgbGluZVxuICAgICAgICB3aGlsZSAoc3RhcnQgPCBuZXdMaW5lKSB7XG4gICAgICAgICAgICBpZiAoIWlzV2hpdGVzcGFjZSggdGV4dC5jaGFyQXQoc3RhcnQpICkpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIHN0YXJ0KytcbiAgICAgICAgfVxuXG4gICAgICAgIC8vZGV0ZXJtaW5lIHZpc2libGUgIyBvZiBnbHlwaHMgZm9yIHRoZSBhdmFpbGFibGUgd2lkdGhcbiAgICAgICAgdmFyIG1lYXN1cmVkID0gbWVhc3VyZSh0ZXh0LCBzdGFydCwgbmV3TGluZSwgdGVzdFdpZHRoKVxuXG4gICAgICAgIHZhciBsaW5lRW5kID0gc3RhcnQgKyAobWVhc3VyZWQuZW5kLW1lYXN1cmVkLnN0YXJ0KVxuICAgICAgICB2YXIgbmV4dFN0YXJ0ID0gbGluZUVuZCArIG5ld2xpbmVDaGFyLmxlbmd0aFxuXG4gICAgICAgIC8vaWYgd2UgaGFkIHRvIGN1dCB0aGUgbGluZSBiZWZvcmUgdGhlIG5leHQgbmV3bGluZS4uLlxuICAgICAgICBpZiAobGluZUVuZCA8IG5ld0xpbmUpIHtcbiAgICAgICAgICAgIC8vZmluZCBjaGFyIHRvIGJyZWFrIG9uXG4gICAgICAgICAgICB3aGlsZSAobGluZUVuZCA+IHN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzV2hpdGVzcGFjZSh0ZXh0LmNoYXJBdChsaW5lRW5kKSkpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgbGluZUVuZC0tXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGluZUVuZCA9PT0gc3RhcnQpIHtcbiAgICAgICAgICAgICAgICBpZiAobmV4dFN0YXJ0ID4gc3RhcnQgKyBuZXdsaW5lQ2hhci5sZW5ndGgpIG5leHRTdGFydC0tXG4gICAgICAgICAgICAgICAgbGluZUVuZCA9IG5leHRTdGFydCAvLyBJZiBubyBjaGFyYWN0ZXJzIHRvIGJyZWFrLCBzaG93IGFsbC5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV4dFN0YXJ0ID0gbGluZUVuZFxuICAgICAgICAgICAgICAgIC8vZWF0IHdoaXRlc3BhY2UgYXQgZW5kIG9mIGxpbmVcbiAgICAgICAgICAgICAgICB3aGlsZSAobGluZUVuZCA+IHN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNXaGl0ZXNwYWNlKHRleHQuY2hhckF0KGxpbmVFbmQgLSBuZXdsaW5lQ2hhci5sZW5ndGgpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGxpbmVFbmQtLVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobGluZUVuZCA+PSBzdGFydCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG1lYXN1cmUodGV4dCwgc3RhcnQsIGxpbmVFbmQsIHRlc3RXaWR0aClcbiAgICAgICAgICAgIGxpbmVzLnB1c2gocmVzdWx0KVxuICAgICAgICB9XG4gICAgICAgIHN0YXJ0ID0gbmV4dFN0YXJ0XG4gICAgfVxuICAgIHJldHVybiBsaW5lc1xufVxuXG4vL2RldGVybWluZXMgdGhlIHZpc2libGUgbnVtYmVyIG9mIGdseXBocyB3aXRoaW4gYSBnaXZlbiB3aWR0aFxuZnVuY3Rpb24gbW9ub3NwYWNlKHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoKSB7XG4gICAgdmFyIGdseXBocyA9IE1hdGgubWluKHdpZHRoLCBlbmQtc3RhcnQpXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgICBlbmQ6IHN0YXJ0K2dseXBoc1xuICAgIH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGV4dGVuZFxuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5mdW5jdGlvbiBleHRlbmQoKSB7XG4gICAgdmFyIHRhcmdldCA9IHt9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldXG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldFxufVxuIl19
