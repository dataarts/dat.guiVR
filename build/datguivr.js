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
  var selectedLabel = createOption(initialLabel || ' ', false);
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

  var MAX_FOLDER_ITEMS_IN_COLUMN = 25;

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

      collapseGroup.children.forEach(function (child, index) {
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
        if (index < MAX_FOLDER_ITEMS_IN_COLUMN) totalSpacing += h;
        child.position.x = 0.026;

        if ((index + 1) % MAX_FOLDER_ITEMS_IN_COLUMN === 0) y = 0;

        // child.position.y -= (index%MAX_FOLDER_ITEMS_IN_COLUMN+1) * ( DROPDOWN_OPTION_HEIGHT );
        child.position.x += width * Math.floor(index / MAX_FOLDER_ITEMS_IN_COLUMN);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzL2RhdGd1aXZyL2J1dHRvbi5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvY2hlY2tib3guanMiLCJtb2R1bGVzL2RhdGd1aXZyL2NvbG9ycy5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvZHJvcGRvd24uanMiLCJtb2R1bGVzL2RhdGd1aXZyL2ZvbGRlci5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvZm9udC5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvZ3JhYi5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvZ3JhcGhpYy5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvaW5kZXguanMiLCJtb2R1bGVzL2RhdGd1aXZyL2ludGVyYWN0aW9uLmpzIiwibW9kdWxlcy9kYXRndWl2ci9sYXlvdXQuanMiLCJtb2R1bGVzL2RhdGd1aXZyL3BhbGV0dGUuanMiLCJtb2R1bGVzL2RhdGd1aXZyL3NkZnRleHQuanMiLCJtb2R1bGVzL2RhdGd1aXZyL3NoYXJlZG1hdGVyaWFscy5qcyIsIm1vZHVsZXMvZGF0Z3VpdnIvc2xpZGVyLmpzIiwibW9kdWxlcy9kYXRndWl2ci90ZXh0bGFiZWwuanMiLCJtb2R1bGVzL3RoaXJkcGFydHkvU3ViZGl2aXNpb25Nb2RpZmllci5qcyIsIm5vZGVfbW9kdWxlcy9hbi1hcnJheS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hcy1udW1iZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZHR5cGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9mbGF0dGVuLXZlcnRleC1kYXRhL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvaXMtYnVmZmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xheW91dC1ibWZvbnQtdGV4dC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3BhcnNlLWJtZm9udC1hc2NpaS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9xdWFkLWluZGljZXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvbGliL3V0aWxzLmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L2xpYi92ZXJ0aWNlcy5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1ibWZvbnQtdGV4dC9zaGFkZXJzL3NkZi5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1idWZmZXItdmVydGV4LWRhdGEvaW5kZXguanMiLCJub2RlX21vZHVsZXMvd29yZC13cmFwcGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3h0ZW5kL2ltbXV0YWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O2tCQzRCd0IsWTs7QUFUeEI7O0lBQVksbUI7O0FBRVo7Ozs7QUFDQTs7OztBQUNBOztJQUFZLE07O0FBQ1o7O0lBQVksTTs7QUFDWjs7SUFBWSxlOztBQUNaOztJQUFZLEk7Ozs7OztBQUVHLFNBQVMsWUFBVCxHQU9QO0FBQUEsaUZBQUosRUFBSTtBQUFBLE1BTk4sV0FNTSxRQU5OLFdBTU07QUFBQSxNQUxOLE1BS00sUUFMTixNQUtNO0FBQUEsK0JBSk4sWUFJTTtBQUFBLE1BSk4sWUFJTSxxQ0FKUyxXQUlUO0FBQUEsd0JBSE4sS0FHTTtBQUFBLE1BSE4sS0FHTSw4QkFIRSxPQUFPLFdBR1Q7QUFBQSx5QkFGTixNQUVNO0FBQUEsTUFGTixNQUVNLCtCQUZHLE9BQU8sWUFFVjtBQUFBLHdCQUROLEtBQ007QUFBQSxNQUROLEtBQ00sOEJBREUsT0FBTyxXQUNUOztBQUVOLE1BQU0sZUFBZSxRQUFRLEdBQVIsR0FBYyxPQUFPLFlBQTFDO0FBQ0EsTUFBTSxnQkFBZ0IsU0FBUyxPQUFPLFlBQXRDO0FBQ0EsTUFBTSxl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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxuKlxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cbipcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbipcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuKlxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG5pbXBvcnQgKiBhcyBTdWJkaXZpc2lvbk1vZGlmaWVyIGZyb20gJy4uL3RoaXJkcGFydHkvU3ViZGl2aXNpb25Nb2RpZmllcic7XG5cbmltcG9ydCBjcmVhdGVUZXh0TGFiZWwgZnJvbSAnLi90ZXh0bGFiZWwnO1xuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcbmltcG9ydCAqIGFzIExheW91dCBmcm9tICcuL2xheW91dCc7XG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xuaW1wb3J0ICogYXMgR3JhYiBmcm9tICcuL2dyYWInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVCdXR0b24oIHtcbiAgdGV4dENyZWF0b3IsXG4gIG9iamVjdCxcbiAgcHJvcGVydHlOYW1lID0gJ3VuZGVmaW5lZCcsXG4gIHdpZHRoID0gTGF5b3V0LlBBTkVMX1dJRFRILFxuICBoZWlnaHQgPSBMYXlvdXQuUEFORUxfSEVJR0hULFxuICBkZXB0aCA9IExheW91dC5QQU5FTF9ERVBUSFxufSA9IHt9ICl7XG5cbiAgY29uc3QgQlVUVE9OX1dJRFRIID0gd2lkdGggKiAwLjUgLSBMYXlvdXQuUEFORUxfTUFSR0lOO1xuICBjb25zdCBCVVRUT05fSEVJR0hUID0gaGVpZ2h0IC0gTGF5b3V0LlBBTkVMX01BUkdJTjtcbiAgY29uc3QgQlVUVE9OX0RFUFRIID0gTGF5b3V0LkJVVFRPTl9ERVBUSDtcblxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuXG4gIGNvbnN0IHBhbmVsID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApO1xuICBncm91cC5hZGQoIHBhbmVsICk7XG5cbiAgLy8gIGJhc2UgY2hlY2tib3hcbiAgY29uc3QgZGl2aXNpb25zID0gNDtcbiAgY29uc3QgYXNwZWN0UmF0aW8gPSBCVVRUT05fV0lEVEggLyBCVVRUT05fSEVJR0hUO1xuICBjb25zdCByZWN0ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KCBCVVRUT05fV0lEVEgsIEJVVFRPTl9IRUlHSFQsIEJVVFRPTl9ERVBUSCwgTWF0aC5mbG9vciggZGl2aXNpb25zICogYXNwZWN0UmF0aW8gKSwgZGl2aXNpb25zLCBkaXZpc2lvbnMgKTtcbiAgY29uc3QgbW9kaWZpZXIgPSBuZXcgVEhSRUUuU3ViZGl2aXNpb25Nb2RpZmllciggMSApO1xuICBtb2RpZmllci5tb2RpZnkoIHJlY3QgKTtcbiAgcmVjdC50cmFuc2xhdGUoIEJVVFRPTl9XSURUSCAqIDAuNSwgMCwgMCApO1xuXG4gIC8vICBoaXRzY2FuIHZvbHVtZVxuICBjb25zdCBoaXRzY2FuTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoKTtcbiAgaGl0c2Nhbk1hdGVyaWFsLnZpc2libGUgPSBmYWxzZTtcblxuICBjb25zdCBoaXRzY2FuVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgaGl0c2Nhbk1hdGVyaWFsICk7XG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueiA9IEJVVFRPTl9ERVBUSCAqIDAuNTtcbiAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi54ID0gd2lkdGggKiAwLjU7XG5cbiAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogQ29sb3JzLkJVVFRPTl9DT0xPUiB9KTtcbiAgY29uc3QgZmlsbGVkVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgbWF0ZXJpYWwgKTtcbiAgaGl0c2NhblZvbHVtZS5hZGQoIGZpbGxlZFZvbHVtZSApO1xuXG5cbiAgY29uc3QgYnV0dG9uTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHByb3BlcnR5TmFtZSwgeyBzY2FsZTogMC44NjYgfSApO1xuXG4gIC8vICBUaGlzIGlzIGEgcmVhbCBoYWNrIHNpbmNlIHdlIG5lZWQgdG8gZml0IHRoZSB0ZXh0IHBvc2l0aW9uIHRvIHRoZSBmb250IHNjYWxpbmdcbiAgLy8gIFBsZWFzZSBmaXggbWUuXG4gIGJ1dHRvbkxhYmVsLnBvc2l0aW9uLnggPSBCVVRUT05fV0lEVEggKiAwLjUgLSBidXR0b25MYWJlbC5sYXlvdXQud2lkdGggKiAwLjAwMDAxMSAqIDAuNTtcbiAgYnV0dG9uTGFiZWwucG9zaXRpb24ueiA9IEJVVFRPTl9ERVBUSCAqIDEuMjtcbiAgYnV0dG9uTGFiZWwucG9zaXRpb24ueSA9IC0wLjAyNTtcbiAgZmlsbGVkVm9sdW1lLmFkZCggYnV0dG9uTGFiZWwgKTtcblxuXG4gIGNvbnN0IGRlc2NyaXB0b3JMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggcHJvcGVydHlOYW1lICk7XG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX0xBQkVMX1RFWFRfTUFSR0lOO1xuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoO1xuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzO1xuXG4gIGNvbnN0IGNvbnRyb2xsZXJJRCA9IExheW91dC5jcmVhdGVDb250cm9sbGVySURCb3goIGhlaWdodCwgQ29sb3JzLkNPTlRST0xMRVJfSURfQlVUVE9OICk7XG4gIGNvbnRyb2xsZXJJRC5wb3NpdGlvbi56ID0gZGVwdGg7XG5cbiAgcGFuZWwuYWRkKCBkZXNjcmlwdG9yTGFiZWwsIGhpdHNjYW5Wb2x1bWUsIGNvbnRyb2xsZXJJRCApO1xuXG4gIGNvbnN0IGludGVyYWN0aW9uID0gY3JlYXRlSW50ZXJhY3Rpb24oIGhpdHNjYW5Wb2x1bWUgKTtcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgaGFuZGxlT25QcmVzcyApO1xuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblJlbGVhc2VkJywgaGFuZGxlT25SZWxlYXNlICk7XG5cbiAgdXBkYXRlVmlldygpO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZU9uUHJlc3MoIHAgKXtcbiAgICBpZiggZ3JvdXAudmlzaWJsZSA9PT0gZmFsc2UgKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBvYmplY3RbIHByb3BlcnR5TmFtZSBdKCk7XG5cbiAgICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnogPSBCVVRUT05fREVQVEggKiAwLjE7XG5cbiAgICBwLmxvY2tlZCA9IHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVPblJlbGVhc2UoKXtcbiAgICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnogPSBCVVRUT05fREVQVEggKiAwLjU7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XG5cbiAgICBpZiggaW50ZXJhY3Rpb24uaG92ZXJpbmcoKSApe1xuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuQlVUVE9OX0hJR0hMSUdIVF9DT0xPUiApO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuQlVUVE9OX0NPTE9SICk7XG4gICAgfVxuXG4gIH1cblxuICBncm91cC5pbnRlcmFjdGlvbiA9IGludGVyYWN0aW9uO1xuICBncm91cC5oaXRzY2FuID0gWyBoaXRzY2FuVm9sdW1lLCBwYW5lbCBdO1xuXG4gIGNvbnN0IGdyYWJJbnRlcmFjdGlvbiA9IEdyYWIuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XG5cbiAgZ3JvdXAudXBkYXRlQ29udHJvbCA9IGZ1bmN0aW9uKCBpbnB1dE9iamVjdHMgKXtcbiAgICBpbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xuICAgIGdyYWJJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xuICAgIHVwZGF0ZVZpZXcoKTtcbiAgfTtcblxuICBncm91cC5uYW1lID0gZnVuY3Rpb24oIHN0ciApe1xuICAgIGRlc2NyaXB0b3JMYWJlbC51cGRhdGVMYWJlbCggc3RyICk7XG4gICAgcmV0dXJuIGdyb3VwO1xuICB9O1xuXG5cbiAgcmV0dXJuIGdyb3VwO1xufSIsIi8qKlxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcbipcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXG4qXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbipcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cblxuaW1wb3J0IGNyZWF0ZVRleHRMYWJlbCBmcm9tICcuL3RleHRsYWJlbCc7XG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xuaW1wb3J0ICogYXMgTGF5b3V0IGZyb20gJy4vbGF5b3V0JztcbmltcG9ydCAqIGFzIEdyYXBoaWMgZnJvbSAnLi9ncmFwaGljJztcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XG5pbXBvcnQgKiBhcyBHcmFiIGZyb20gJy4vZ3JhYic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUNoZWNrYm94KCB7XG4gIHRleHRDcmVhdG9yLFxuICBvYmplY3QsXG4gIHByb3BlcnR5TmFtZSA9ICd1bmRlZmluZWQnLFxuICBpbml0aWFsVmFsdWUgPSBmYWxzZSxcbiAgd2lkdGggPSBMYXlvdXQuUEFORUxfV0lEVEgsXG4gIGhlaWdodCA9IExheW91dC5QQU5FTF9IRUlHSFQsXG4gIGRlcHRoID0gTGF5b3V0LlBBTkVMX0RFUFRIXG59ID0ge30gKXtcblxuICBjb25zdCBDSEVDS0JPWF9XSURUSCA9IExheW91dC5DSEVDS0JPWF9TSVpFO1xuICBjb25zdCBDSEVDS0JPWF9IRUlHSFQgPSBDSEVDS0JPWF9XSURUSDtcbiAgY29uc3QgQ0hFQ0tCT1hfREVQVEggPSBkZXB0aDtcblxuICBjb25zdCBJTkFDVElWRV9TQ0FMRSA9IDAuMDAxO1xuICBjb25zdCBBQ1RJVkVfU0NBTEUgPSAwLjk7XG5cbiAgY29uc3Qgc3RhdGUgPSB7XG4gICAgdmFsdWU6IGluaXRpYWxWYWx1ZSxcbiAgICBsaXN0ZW46IGZhbHNlXG4gIH07XG5cbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcblxuICBjb25zdCBwYW5lbCA9IExheW91dC5jcmVhdGVQYW5lbCggd2lkdGgsIGhlaWdodCwgZGVwdGggKTtcbiAgZ3JvdXAuYWRkKCBwYW5lbCApO1xuXG4gIC8vICBiYXNlIGNoZWNrYm94XG4gIGNvbnN0IHJlY3QgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIENIRUNLQk9YX1dJRFRILCBDSEVDS0JPWF9IRUlHSFQsIENIRUNLQk9YX0RFUFRIICk7XG4gIHJlY3QudHJhbnNsYXRlKCBDSEVDS0JPWF9XSURUSCAqIDAuNSwgMCwgMCApO1xuXG5cbiAgLy8gIGhpdHNjYW4gdm9sdW1lXG4gIGNvbnN0IGhpdHNjYW5NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xuICBoaXRzY2FuTWF0ZXJpYWwudmlzaWJsZSA9IGZhbHNlO1xuXG4gIGNvbnN0IGhpdHNjYW5Wb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBoaXRzY2FuTWF0ZXJpYWwgKTtcbiAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi56ID0gZGVwdGg7XG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueCA9IHdpZHRoICogMC41O1xuXG4gIC8vICBvdXRsaW5lIHZvbHVtZVxuICAvLyBjb25zdCBvdXRsaW5lID0gbmV3IFRIUkVFLkJveEhlbHBlciggaGl0c2NhblZvbHVtZSApO1xuICAvLyBvdXRsaW5lLm1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLk9VVExJTkVfQ09MT1IgKTtcblxuICAvLyAgY2hlY2tib3ggdm9sdW1lXG4gIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6IENvbG9ycy5DSEVDS0JPWF9CR19DT0xPUiB9KTtcbiAgY29uc3QgZmlsbGVkVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgbWF0ZXJpYWwgKTtcbiAgLy8gZmlsbGVkVm9sdW1lLnNjYWxlLnNldCggQUNUSVZFX1NDQUxFLCBBQ1RJVkVfU0NBTEUsQUNUSVZFX1NDQUxFICk7XG4gIGhpdHNjYW5Wb2x1bWUuYWRkKCBmaWxsZWRWb2x1bWUgKTtcblxuXG4gIGNvbnN0IGRlc2NyaXB0b3JMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggcHJvcGVydHlOYW1lICk7XG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX0xBQkVMX1RFWFRfTUFSR0lOO1xuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoO1xuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzO1xuXG4gIGNvbnN0IGNvbnRyb2xsZXJJRCA9IExheW91dC5jcmVhdGVDb250cm9sbGVySURCb3goIGhlaWdodCwgQ29sb3JzLkNPTlRST0xMRVJfSURfQ0hFQ0tCT1ggKTtcbiAgY29udHJvbGxlcklELnBvc2l0aW9uLnogPSBkZXB0aDtcblxuICBjb25zdCBib3JkZXJCb3ggPSBMYXlvdXQuY3JlYXRlUGFuZWwoIENIRUNLQk9YX1dJRFRIICsgTGF5b3V0LkJPUkRFUl9USElDS05FU1MsIENIRUNLQk9YX0hFSUdIVCArIExheW91dC5CT1JERVJfVEhJQ0tORVNTLCBDSEVDS0JPWF9ERVBUSCwgdHJ1ZSApO1xuICBib3JkZXJCb3gubWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCAweDFmN2FlNyApO1xuICBib3JkZXJCb3gucG9zaXRpb24ueCA9IC1MYXlvdXQuQk9SREVSX1RISUNLTkVTUyAqIDAuNSArIHdpZHRoICogMC41O1xuICBib3JkZXJCb3gucG9zaXRpb24ueiA9IGRlcHRoICogMC41O1xuXG4gIGNvbnN0IGNoZWNrbWFyayA9IEdyYXBoaWMuY2hlY2ttYXJrKCk7XG4gIGNoZWNrbWFyay5wb3NpdGlvbi56ID0gZGVwdGggKiAwLjUxO1xuICBoaXRzY2FuVm9sdW1lLmFkZCggY2hlY2ttYXJrICk7XG5cbiAgcGFuZWwuYWRkKCBkZXNjcmlwdG9yTGFiZWwsIGhpdHNjYW5Wb2x1bWUsIGNvbnRyb2xsZXJJRCwgYm9yZGVyQm94ICk7XG5cbiAgLy8gZ3JvdXAuYWRkKCBmaWxsZWRWb2x1bWUsIG91dGxpbmUsIGhpdHNjYW5Wb2x1bWUsIGRlc2NyaXB0b3JMYWJlbCApO1xuXG4gIGNvbnN0IGludGVyYWN0aW9uID0gY3JlYXRlSW50ZXJhY3Rpb24oIGhpdHNjYW5Wb2x1bWUgKTtcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgaGFuZGxlT25QcmVzcyApO1xuXG4gIHVwZGF0ZVZpZXcoKTtcblxuICBmdW5jdGlvbiBoYW5kbGVPblByZXNzKCBwICl7XG4gICAgaWYoIGdyb3VwLnZpc2libGUgPT09IGZhbHNlICl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc3RhdGUudmFsdWUgPSAhc3RhdGUudmFsdWU7XG5cbiAgICBvYmplY3RbIHByb3BlcnR5TmFtZSBdID0gc3RhdGUudmFsdWU7XG5cbiAgICBpZiggb25DaGFuZ2VkQ0IgKXtcbiAgICAgIG9uQ2hhbmdlZENCKCBzdGF0ZS52YWx1ZSApO1xuICAgIH1cblxuICAgIHAubG9ja2VkID0gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZVZpZXcoKXtcblxuICAgIGlmKCBzdGF0ZS52YWx1ZSApe1xuICAgICAgY2hlY2ttYXJrLnZpc2libGUgPSB0cnVlO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgY2hlY2ttYXJrLnZpc2libGUgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYoIGludGVyYWN0aW9uLmhvdmVyaW5nKCkgKXtcbiAgICAgIGJvcmRlckJveC52aXNpYmxlID0gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIGJvcmRlckJveC52aXNpYmxlID0gZmFsc2U7XG4gICAgfVxuXG4gIH1cblxuICBsZXQgb25DaGFuZ2VkQ0I7XG4gIGxldCBvbkZpbmlzaENoYW5nZUNCO1xuXG4gIGdyb3VwLm9uQ2hhbmdlID0gZnVuY3Rpb24oIGNhbGxiYWNrICl7XG4gICAgb25DaGFuZ2VkQ0IgPSBjYWxsYmFjaztcbiAgICByZXR1cm4gZ3JvdXA7XG4gIH07XG5cbiAgZ3JvdXAuaW50ZXJhY3Rpb24gPSBpbnRlcmFjdGlvbjtcbiAgZ3JvdXAuaGl0c2NhbiA9IFsgaGl0c2NhblZvbHVtZSwgcGFuZWwgXTtcblxuICBjb25zdCBncmFiSW50ZXJhY3Rpb24gPSBHcmFiLmNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSApO1xuXG4gIGdyb3VwLmxpc3RlbiA9IGZ1bmN0aW9uKCl7XG4gICAgc3RhdGUubGlzdGVuID0gdHJ1ZTtcbiAgICByZXR1cm4gZ3JvdXA7XG4gIH07XG5cbiAgZ3JvdXAubmFtZSA9IGZ1bmN0aW9uKCBzdHIgKXtcbiAgICBkZXNjcmlwdG9yTGFiZWwudXBkYXRlTGFiZWwoIHN0ciApO1xuICAgIHJldHVybiBncm91cDtcbiAgfTtcblxuICBncm91cC51cGRhdGVDb250cm9sID0gZnVuY3Rpb24oIGlucHV0T2JqZWN0cyApe1xuICAgIGlmKCBzdGF0ZS5saXN0ZW4gKXtcbiAgICAgIHN0YXRlLnZhbHVlID0gb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXTtcbiAgICB9XG4gICAgaW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcbiAgICBncmFiSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcbiAgICB1cGRhdGVWaWV3KCk7XG4gIH07XG5cblxuICByZXR1cm4gZ3JvdXA7XG59IiwiLyoqXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxuKlxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cbipcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbipcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuKlxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9DT0xPUiA9IDB4MkZBMUQ2O1xuZXhwb3J0IGNvbnN0IEhJR0hMSUdIVF9DT0xPUiA9IDB4NDNiNWVhO1xuZXhwb3J0IGNvbnN0IElOVEVSQUNUSU9OX0NPTE9SID0gMHgwN0FCRjc7XG5leHBvcnQgY29uc3QgRU1JU1NJVkVfQ09MT1IgPSAweDIyMjIyMjtcbmV4cG9ydCBjb25zdCBISUdITElHSFRfRU1JU1NJVkVfQ09MT1IgPSAweDk5OTk5OTtcbmV4cG9ydCBjb25zdCBPVVRMSU5FX0NPTE9SID0gMHg5OTk5OTk7XG5leHBvcnQgY29uc3QgREVGQVVMVF9CQUNLID0gMHgxYTFhMWE7XG5leHBvcnQgY29uc3QgREVGQVVMVF9GT0xERVJfQkFDSyA9IDB4MTAxMDEwO1xuZXhwb3J0IGNvbnN0IEhJR0hMSUdIVF9CQUNLID0gMHgzMTMxMzE7XG5leHBvcnQgY29uc3QgSU5BQ1RJVkVfQ09MT1IgPSAweDE2MTgyOTtcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX1NMSURFUiA9IDB4MmZhMWQ2O1xuZXhwb3J0IGNvbnN0IENPTlRST0xMRVJfSURfQ0hFQ0tCT1ggPSAweDgwNjc4NztcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX0JVVFRPTiA9IDB4ZTYxZDVmO1xuZXhwb3J0IGNvbnN0IENPTlRST0xMRVJfSURfVEVYVCA9IDB4MWVkMzZmO1xuZXhwb3J0IGNvbnN0IENPTlRST0xMRVJfSURfRFJPUERPV04gPSAweGZmZjAwMDtcbmV4cG9ydCBjb25zdCBEUk9QRE9XTl9CR19DT0xPUiA9IDB4ZmZmZmZmO1xuZXhwb3J0IGNvbnN0IERST1BET1dOX0ZHX0NPTE9SID0gMHgwMDAwMDA7XG5leHBvcnQgY29uc3QgQ0hFQ0tCT1hfQkdfQ09MT1IgPSAweGZmZmZmZjtcbmV4cG9ydCBjb25zdCBCVVRUT05fQ09MT1IgPSAweGU2MWQ1ZjtcbmV4cG9ydCBjb25zdCBCVVRUT05fSElHSExJR0hUX0NPTE9SID0gMHhmYTMxNzM7XG5leHBvcnQgY29uc3QgU0xJREVSX0JHID0gMHg0NDQ0NDQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb2xvcml6ZUdlb21ldHJ5KCBnZW9tZXRyeSwgY29sb3IgKXtcbiAgZ2VvbWV0cnkuZmFjZXMuZm9yRWFjaCggZnVuY3Rpb24oZmFjZSl7XG4gICAgZmFjZS5jb2xvci5zZXRIZXgoY29sb3IpO1xuICB9KTtcbiAgZ2VvbWV0cnkuY29sb3JzTmVlZFVwZGF0ZSA9IHRydWU7XG4gIHJldHVybiBnZW9tZXRyeTtcbn0iLCIvKipcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXG4qXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxuKlxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuKlxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4qXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbmltcG9ydCBjcmVhdGVUZXh0TGFiZWwgZnJvbSAnLi90ZXh0bGFiZWwnO1xuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcbmltcG9ydCAqIGFzIExheW91dCBmcm9tICcuL2xheW91dCc7XG5pbXBvcnQgKiBhcyBHcmFwaGljIGZyb20gJy4vZ3JhcGhpYyc7XG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xuaW1wb3J0ICogYXMgR3JhYiBmcm9tICcuL2dyYWInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVDaGVja2JveCgge1xuICB0ZXh0Q3JlYXRvcixcbiAgb2JqZWN0LFxuICBwcm9wZXJ0eU5hbWUgPSAndW5kZWZpbmVkJyxcbiAgaW5pdGlhbFZhbHVlID0gZmFsc2UsXG4gIG9wdGlvbnMgPSBbXSxcbiAgd2lkdGggPSBMYXlvdXQuUEFORUxfV0lEVEgsXG4gIGhlaWdodCA9IExheW91dC5QQU5FTF9IRUlHSFQsXG4gIGRlcHRoID0gTGF5b3V0LlBBTkVMX0RFUFRIXG59ID0ge30gKXtcblxuXG4gIGNvbnN0IHN0YXRlID0ge1xuICAgIG9wZW46IGZhbHNlLFxuICAgIGxpc3RlbjogZmFsc2VcbiAgfTtcblxuICBjb25zdCBEUk9QRE9XTl9XSURUSCA9IHdpZHRoICogMC41IC0gTGF5b3V0LlBBTkVMX01BUkdJTjtcbiAgY29uc3QgRFJPUERPV05fSEVJR0hUID0gaGVpZ2h0IC0gTGF5b3V0LlBBTkVMX01BUkdJTjtcbiAgY29uc3QgRFJPUERPV05fREVQVEggPSBkZXB0aDtcbiAgY29uc3QgRFJPUERPV05fT1BUSU9OX0hFSUdIVCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU4gKiAxLjI7XG4gIGNvbnN0IERST1BET1dOX01BUkdJTiA9IExheW91dC5QQU5FTF9NQVJHSU4gKiAtMC40O1xuICBjb25zdCBNQVhfRFJPUERPV05fTEFCRUxTX0lOX0NPTFVNTiA9IDI1O1xuXG4gIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG5cbiAgY29uc3QgcGFuZWwgPSBMYXlvdXQuY3JlYXRlUGFuZWwoIHdpZHRoLCBoZWlnaHQsIGRlcHRoICk7XG4gIGdyb3VwLmFkZCggcGFuZWwgKTtcblxuICBncm91cC5oaXRzY2FuID0gWyBwYW5lbCBdO1xuXG4gIGNvbnN0IGxhYmVsSW50ZXJhY3Rpb25zID0gW107XG4gIGNvbnN0IG9wdGlvbkxhYmVscyA9IFtdO1xuXG4gIC8vICBmaW5kIGFjdHVhbGx5IHdoaWNoIGxhYmVsIGlzIHNlbGVjdGVkXG4gIGNvbnN0IGluaXRpYWxMYWJlbCA9IGZpbmRMYWJlbEZyb21Qcm9wKCk7XG5cblxuXG4gIGZ1bmN0aW9uIGZpbmRMYWJlbEZyb21Qcm9wKCl7XG4gICAgaWYoIEFycmF5LmlzQXJyYXkoIG9wdGlvbnMgKSApe1xuICAgICAgcmV0dXJuIG9wdGlvbnMuZmluZCggZnVuY3Rpb24oIG9wdGlvbk5hbWUgKXtcbiAgICAgICAgcmV0dXJuIG9wdGlvbk5hbWUgPT09IG9iamVjdFsgcHJvcGVydHlOYW1lIF1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG9wdGlvbnMpLmZpbmQoIGZ1bmN0aW9uKCBvcHRpb25OYW1lICl7XG4gICAgICAgIHJldHVybiBvYmplY3RbcHJvcGVydHlOYW1lXSA9PT0gb3B0aW9uc1sgb3B0aW9uTmFtZSBdO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlT3B0aW9uKCBsYWJlbFRleHQsIGlzT3B0aW9uICl7XG4gICAgY29uc3QgbGFiZWwgPSBjcmVhdGVUZXh0TGFiZWwoXG4gICAgICB0ZXh0Q3JlYXRvciwgbGFiZWxUZXh0LFxuICAgICAgRFJPUERPV05fV0lEVEgsIGRlcHRoLFxuICAgICAgQ29sb3JzLkRST1BET1dOX0ZHX0NPTE9SLCBDb2xvcnMuRFJPUERPV05fQkdfQ09MT1IsXG4gICAgICAwLjg2NlxuICAgICk7XG5cbiAgICBncm91cC5oaXRzY2FuLnB1c2goIGxhYmVsLmJhY2sgKTtcbiAgICBjb25zdCBsYWJlbEludGVyYWN0aW9uID0gY3JlYXRlSW50ZXJhY3Rpb24oIGxhYmVsLmJhY2sgKTtcbiAgICBsYWJlbEludGVyYWN0aW9ucy5wdXNoKCBsYWJlbEludGVyYWN0aW9uICk7XG4gICAgb3B0aW9uTGFiZWxzLnB1c2goIGxhYmVsICk7XG5cblxuICAgIGlmKCBpc09wdGlvbiApe1xuICAgICAgbGFiZWxJbnRlcmFjdGlvbi5ldmVudHMub24oICdvblByZXNzZWQnLCBmdW5jdGlvbiggcCApe1xuICAgICAgICBzZWxlY3RlZExhYmVsLnNldFN0cmluZyggbGFiZWxUZXh0ICk7XG5cbiAgICAgICAgbGV0IHByb3BlcnR5Q2hhbmdlZCA9IGZhbHNlO1xuXG4gICAgICAgIGlmKCBBcnJheS5pc0FycmF5KCBvcHRpb25zICkgKXtcbiAgICAgICAgICBwcm9wZXJ0eUNoYW5nZWQgPSBvYmplY3RbIHByb3BlcnR5TmFtZSBdICE9PSBsYWJlbFRleHQ7XG4gICAgICAgICAgaWYoIHByb3BlcnR5Q2hhbmdlZCApe1xuICAgICAgICAgICAgb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSA9IGxhYmVsVGV4dDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICBwcm9wZXJ0eUNoYW5nZWQgPSBvYmplY3RbIHByb3BlcnR5TmFtZSBdICE9PSBvcHRpb25zWyBsYWJlbFRleHQgXTtcbiAgICAgICAgICBpZiggcHJvcGVydHlDaGFuZ2VkICl7XG4gICAgICAgICAgICBvYmplY3RbIHByb3BlcnR5TmFtZSBdID0gb3B0aW9uc1sgbGFiZWxUZXh0IF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICBjb2xsYXBzZU9wdGlvbnMoKTtcbiAgICAgICAgc3RhdGUub3BlbiA9IGZhbHNlO1xuXG4gICAgICAgIGlmKCBvbkNoYW5nZWRDQiAmJiBwcm9wZXJ0eUNoYW5nZWQgKXtcbiAgICAgICAgICBvbkNoYW5nZWRDQiggb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSApO1xuICAgICAgICB9XG5cbiAgICAgICAgcC5sb2NrZWQgPSB0cnVlO1xuXG4gICAgICB9KTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIGxhYmVsSW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgZnVuY3Rpb24oIHAgKXtcbiAgICAgICAgaWYoIHN0YXRlLm9wZW4gPT09IGZhbHNlICl7XG4gICAgICAgICAgb3Blbk9wdGlvbnMoKTtcbiAgICAgICAgICBzdGF0ZS5vcGVuID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgIGNvbGxhcHNlT3B0aW9ucygpO1xuICAgICAgICAgIHN0YXRlLm9wZW4gPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHAubG9ja2VkID0gdHJ1ZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBsYWJlbC5pc09wdGlvbiA9IGlzT3B0aW9uO1xuICAgIHJldHVybiBsYWJlbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbGxhcHNlT3B0aW9ucygpe1xuICAgIG9wdGlvbkxhYmVscy5mb3JFYWNoKCBmdW5jdGlvbiggbGFiZWwgKXtcbiAgICAgIGlmKCBsYWJlbC5pc09wdGlvbiApe1xuICAgICAgICBsYWJlbC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIGxhYmVsLmJhY2sudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gb3Blbk9wdGlvbnMoKXtcbiAgICBvcHRpb25MYWJlbHMuZm9yRWFjaCggZnVuY3Rpb24oIGxhYmVsICl7XG4gICAgICBpZiggbGFiZWwuaXNPcHRpb24gKXtcbiAgICAgICAgbGFiZWwudmlzaWJsZSA9IHRydWU7XG4gICAgICAgIGxhYmVsLmJhY2sudmlzaWJsZSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyAgYmFzZSBvcHRpb25cbiAgY29uc3Qgc2VsZWN0ZWRMYWJlbCA9IGNyZWF0ZU9wdGlvbiggaW5pdGlhbExhYmVsIHx8ICcgJywgZmFsc2UgKTtcbiAgc2VsZWN0ZWRMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX01BUkdJTiAqIDAuNSArIHdpZHRoICogMC41O1xuICBzZWxlY3RlZExhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcblxuICBjb25zdCBkb3duQXJyb3cgPSBHcmFwaGljLmRvd25BcnJvdygpO1xuICAvLyBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggZG93bkFycm93Lmdlb21ldHJ5LCBDb2xvcnMuRFJPUERPV05fRkdfQ09MT1IgKTtcbiAgZG93bkFycm93LnBvc2l0aW9uLnNldCggRFJPUERPV05fV0lEVEggLSAwLjA0LCAwLCBkZXB0aCAqIDEuMDEgKTtcbiAgc2VsZWN0ZWRMYWJlbC5hZGQoIGRvd25BcnJvdyApO1xuXG5cbiAgZnVuY3Rpb24gY29uZmlndXJlTGFiZWxQb3NpdGlvbiggbGFiZWwsIGluZGV4ICl7XG4gICAgbGFiZWwucG9zaXRpb24ueSA9IC1EUk9QRE9XTl9NQVJHSU4gLSAoaW5kZXglTUFYX0RST1BET1dOX0xBQkVMU19JTl9DT0xVTU4rMSkgKiAoIERST1BET1dOX09QVElPTl9IRUlHSFQgKTtcbiAgICBsYWJlbC5wb3NpdGlvbi56ID0gZGVwdGg7XG4gICAgbGFiZWwucG9zaXRpb24ueCArPSBEUk9QRE9XTl9XSURUSCAqIE1hdGguZmxvb3IoaW5kZXggLyBNQVhfRFJPUERPV05fTEFCRUxTX0lOX0NPTFVNTik7XG4gIH1cblxuICBmdW5jdGlvbiBvcHRpb25Ub0xhYmVsKCBvcHRpb25OYW1lLCBpbmRleCApe1xuICAgIGNvbnN0IG9wdGlvbkxhYmVsID0gY3JlYXRlT3B0aW9uKCBvcHRpb25OYW1lLCB0cnVlICk7XG4gICAgY29uZmlndXJlTGFiZWxQb3NpdGlvbiggb3B0aW9uTGFiZWwsIGluZGV4ICk7XG4gICAgcmV0dXJuIG9wdGlvbkxhYmVsO1xuICB9XG5cbiAgaWYoIEFycmF5LmlzQXJyYXkoIG9wdGlvbnMgKSApe1xuICAgIHNlbGVjdGVkTGFiZWwuYWRkKCAuLi5vcHRpb25zLm1hcCggb3B0aW9uVG9MYWJlbCApICk7XG4gIH1cbiAgZWxzZXtcbiAgICBzZWxlY3RlZExhYmVsLmFkZCggLi4uT2JqZWN0LmtleXMob3B0aW9ucykubWFwKCBvcHRpb25Ub0xhYmVsICkgKTtcbiAgfVxuXG5cbiAgY29sbGFwc2VPcHRpb25zKCk7XG5cbiAgY29uc3QgZGVzY3JpcHRvckxhYmVsID0gdGV4dENyZWF0b3IuY3JlYXRlKCBwcm9wZXJ0eU5hbWUgKTtcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfTEFCRUxfVEVYVF9NQVJHSU47XG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGg7XG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi55ID0gLTAuMDM7XG5cbiAgY29uc3QgY29udHJvbGxlcklEID0gTGF5b3V0LmNyZWF0ZUNvbnRyb2xsZXJJREJveCggaGVpZ2h0LCBDb2xvcnMuQ09OVFJPTExFUl9JRF9EUk9QRE9XTiApO1xuICBjb250cm9sbGVySUQucG9zaXRpb24ueiA9IGRlcHRoO1xuXG5cbiAgY29uc3QgYm9yZGVyQm94ID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCBEUk9QRE9XTl9XSURUSCArIExheW91dC5CT1JERVJfVEhJQ0tORVNTLCBEUk9QRE9XTl9IRUlHSFQgKyBMYXlvdXQuQk9SREVSX1RISUNLTkVTUyAqIDAuNSwgRFJPUERPV05fREVQVEgsIHRydWUgKTtcbiAgYm9yZGVyQm94Lm1hdGVyaWFsLmNvbG9yLnNldEhleCggMHgxZjdhZTcgKTtcbiAgYm9yZGVyQm94LnBvc2l0aW9uLnggPSAtTGF5b3V0LkJPUkRFUl9USElDS05FU1MgKiAwLjUgKyB3aWR0aCAqIDAuNTtcbiAgYm9yZGVyQm94LnBvc2l0aW9uLnogPSBkZXB0aCAqIDAuNTtcblxuICBwYW5lbC5hZGQoIGRlc2NyaXB0b3JMYWJlbCwgY29udHJvbGxlcklELCBzZWxlY3RlZExhYmVsLCBib3JkZXJCb3ggKTtcblxuXG4gIHVwZGF0ZVZpZXcoKTtcblxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XG5cbiAgICBsYWJlbEludGVyYWN0aW9ucy5mb3JFYWNoKCBmdW5jdGlvbiggaW50ZXJhY3Rpb24sIGluZGV4ICl7XG4gICAgICBjb25zdCBsYWJlbCA9IG9wdGlvbkxhYmVsc1sgaW5kZXggXTtcbiAgICAgIGlmKCBsYWJlbC5pc09wdGlvbiApe1xuICAgICAgICBpZiggaW50ZXJhY3Rpb24uaG92ZXJpbmcoKSApe1xuICAgICAgICAgIENvbG9ycy5jb2xvcml6ZUdlb21ldHJ5KCBsYWJlbC5iYWNrLmdlb21ldHJ5LCBDb2xvcnMuSElHSExJR0hUX0NPTE9SICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggbGFiZWwuYmFjay5nZW9tZXRyeSwgQ29sb3JzLkRST1BET1dOX0JHX0NPTE9SICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmKCBsYWJlbEludGVyYWN0aW9uc1swXS5ob3ZlcmluZygpIHx8IHN0YXRlLm9wZW4gKXtcbiAgICAgIGJvcmRlckJveC52aXNpYmxlID0gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIGJvcmRlckJveC52aXNpYmxlID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgbGV0IG9uQ2hhbmdlZENCO1xuICBsZXQgb25GaW5pc2hDaGFuZ2VDQjtcblxuICBncm91cC5vbkNoYW5nZSA9IGZ1bmN0aW9uKCBjYWxsYmFjayApe1xuICAgIG9uQ2hhbmdlZENCID0gY2FsbGJhY2s7XG4gICAgcmV0dXJuIGdyb3VwO1xuICB9O1xuXG4gIGNvbnN0IGdyYWJJbnRlcmFjdGlvbiA9IEdyYWIuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XG5cbiAgZ3JvdXAubGlzdGVuID0gZnVuY3Rpb24oKXtcbiAgICBzdGF0ZS5saXN0ZW4gPSB0cnVlO1xuICAgIHJldHVybiBncm91cDtcbiAgfTtcblxuICBncm91cC51cGRhdGVDb250cm9sID0gZnVuY3Rpb24oIGlucHV0T2JqZWN0cyApe1xuICAgIGlmKCBzdGF0ZS5saXN0ZW4gKXtcbiAgICAgIHNlbGVjdGVkTGFiZWwuc2V0U3RyaW5nKCBmaW5kTGFiZWxGcm9tUHJvcCgpICk7XG4gICAgfVxuICAgIGxhYmVsSW50ZXJhY3Rpb25zLmZvckVhY2goIGZ1bmN0aW9uKCBsYWJlbEludGVyYWN0aW9uICl7XG4gICAgICBsYWJlbEludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XG4gICAgfSk7XG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XG4gICAgdXBkYXRlVmlldygpO1xuICB9O1xuXG4gIGdyb3VwLm5hbWUgPSBmdW5jdGlvbiggc3RyICl7XG4gICAgZGVzY3JpcHRvckxhYmVsLnVwZGF0ZSggc3RyICk7XG4gICAgcmV0dXJuIGdyb3VwO1xuICB9O1xuXG5cbiAgcmV0dXJuIGdyb3VwO1xufSIsIi8qKlxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcbipcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXG4qXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbipcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cblxuaW1wb3J0IGNyZWF0ZVRleHRMYWJlbCBmcm9tICcuL3RleHRsYWJlbCc7XG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xuaW1wb3J0ICogYXMgTGF5b3V0IGZyb20gJy4vbGF5b3V0JztcbmltcG9ydCAqIGFzIEdyYXBoaWMgZnJvbSAnLi9ncmFwaGljJztcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XG5pbXBvcnQgKiBhcyBHcmFiIGZyb20gJy4vZ3JhYic7XG5pbXBvcnQgKiBhcyBQYWxldHRlIGZyb20gJy4vcGFsZXR0ZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUZvbGRlcih7XG4gIHRleHRDcmVhdG9yLFxuICBuYW1lLFxuICBndWlBZGQsXG4gIGFkZFNsaWRlcixcbiAgYWRkRHJvcGRvd24sXG4gIGFkZENoZWNrYm94LFxuICBhZGRCdXR0b25cbn0gPSB7fSApe1xuXG4gIGNvbnN0IE1BWF9GT0xERVJfSVRFTVNfSU5fQ09MVU1OID0gMjU7XG5cbiAgY29uc3Qgd2lkdGggPSBMYXlvdXQuRk9MREVSX1dJRFRIO1xuICBjb25zdCBkZXB0aCA9IExheW91dC5QQU5FTF9ERVBUSDtcblxuICBjb25zdCBzdGF0ZSA9IHtcbiAgICBjb2xsYXBzZWQ6IGZhbHNlLFxuICAgIHByZXZpb3VzUGFyZW50OiB1bmRlZmluZWRcbiAgfTtcblxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuICBjb25zdCBjb2xsYXBzZUdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG4gIGdyb3VwLmFkZCggY29sbGFwc2VHcm91cCApO1xuXG4gIC8vZXhwb3NlIGFzIHB1YmxpYyBpbnRlcmZhY2Ugc28gdGhhdCBjaGlsZHJlbiBjYW4gY2FsbCBpdCB3aGVuIHRoZWlyIHNwYWNpbmcgY2hhbmdlc1xuICBncm91cC5wZXJmb3JtTGF5b3V0ID0gcGVyZm9ybUxheW91dDtcbiAgZ3JvdXAuaXNDb2xsYXBzZWQgPSAoKSA9PiB7IHJldHVybiBzdGF0ZS5jb2xsYXBzZWQgfVxuXG4gIC8vICBZZWFoLiBHcm9zcy5cbiAgY29uc3QgYWRkT3JpZ2luYWwgPSBUSFJFRS5Hcm91cC5wcm90b3R5cGUuYWRkO1xuXG4gIGZ1bmN0aW9uIGFkZEltcGwoIG8gKXtcbiAgICBhZGRPcmlnaW5hbC5jYWxsKCBncm91cCwgbyApO1xuICB9XG5cbiAgYWRkSW1wbCggY29sbGFwc2VHcm91cCApO1xuXG4gIGNvbnN0IHBhbmVsID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgTGF5b3V0LkZPTERFUl9IRUlHSFQsIGRlcHRoLCB0cnVlICk7XG4gIGFkZEltcGwoIHBhbmVsICk7XG5cbiAgY29uc3QgZGVzY3JpcHRvckxhYmVsID0gdGV4dENyZWF0b3IuY3JlYXRlKCBuYW1lICk7XG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX0xBQkVMX1RFWFRfTUFSR0lOICogMS41O1xuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzO1xuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoO1xuICBwYW5lbC5hZGQoIGRlc2NyaXB0b3JMYWJlbCApO1xuXG4gIGNvbnN0IGRvd25BcnJvdyA9IExheW91dC5jcmVhdGVEb3duQXJyb3coKTtcbiAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIGRvd25BcnJvdy5nZW9tZXRyeSwgMHhmZmZmZmYgKTtcbiAgZG93bkFycm93LnBvc2l0aW9uLnNldCggMC4wNSwgMCwgZGVwdGggICogMS4wMSApO1xuICBwYW5lbC5hZGQoIGRvd25BcnJvdyApO1xuXG4gIGNvbnN0IGdyYWJiZXIgPSBMYXlvdXQuY3JlYXRlUGFuZWwoIHdpZHRoLCBMYXlvdXQuRk9MREVSX0dSQUJfSEVJR0hULCBkZXB0aCwgdHJ1ZSApO1xuICBncmFiYmVyLnBvc2l0aW9uLnkgPSBMYXlvdXQuRk9MREVSX0hFSUdIVCAqIDAuODY7XG4gIGdyYWJiZXIubmFtZSA9ICdncmFiYmVyJztcbiAgYWRkSW1wbCggZ3JhYmJlciApO1xuXG4gIGNvbnN0IGdyYWJCYXIgPSBHcmFwaGljLmdyYWJCYXIoKTtcbiAgZ3JhYkJhci5wb3NpdGlvbi5zZXQoIHdpZHRoICogMC41LCAwLCBkZXB0aCAqIDEuMDAxICk7XG4gIGdyYWJiZXIuYWRkKCBncmFiQmFyICk7XG4gIGdyb3VwLmlzRm9sZGVyID0gdHJ1ZTtcbiAgZ3JvdXAuaGlkZUdyYWJiZXIgPSBmdW5jdGlvbigpIHsgZ3JhYmJlci52aXNpYmxlID0gZmFsc2UgfTtcblxuICBncm91cC5hZGQgPSBmdW5jdGlvbiggLi4uYXJncyApe1xuICAgIGNvbnN0IG5ld0NvbnRyb2xsZXIgPSBndWlBZGQoIC4uLmFyZ3MgKTtcblxuICAgIGlmKCBuZXdDb250cm9sbGVyICl7XG4gICAgICBncm91cC5hZGRDb250cm9sbGVyKCBuZXdDb250cm9sbGVyICk7XG4gICAgICByZXR1cm4gbmV3Q29udHJvbGxlcjtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgICB9XG4gIH07XG5cbiAgZ3JvdXAuYWRkQ29udHJvbGxlciA9IGZ1bmN0aW9uKCAuLi5hcmdzICl7XG4gICAgYXJncy5mb3JFYWNoKCBmdW5jdGlvbiggb2JqICl7XG4gICAgICBjb2xsYXBzZUdyb3VwLmFkZCggb2JqICk7XG4gICAgICBvYmouZm9sZGVyID0gZ3JvdXA7XG4gICAgICBpZiAob2JqLmlzRm9sZGVyKSB7XG4gICAgICAgIG9iai5oaWRlR3JhYmJlcigpO1xuICAgICAgICBvYmouY2xvc2UoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHBlcmZvcm1MYXlvdXQoKTtcbiAgfTtcblxuICBncm91cC5hZGRGb2xkZXIgPSBmdW5jdGlvbiggLi4uYXJncyApe1xuICAgIGFyZ3MuZm9yRWFjaCggZnVuY3Rpb24gKG9iaikge1xuICAgICAgY29sbGFwc2VHcm91cC5hZGQoIG9iaiApO1xuICAgICAgb2JqLmZvbGRlciA9IGdyb3VwO1xuICAgICAgb2JqLmhpZGVHcmFiYmVyKCk7XG4gICAgICBvYmouY2xvc2UoKTtcbiAgICB9KTtcblxuICAgIHBlcmZvcm1MYXlvdXQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBlcmZvcm1MYXlvdXQoKXtcbiAgICBjb25zdCBzcGFjaW5nUGVyQ29udHJvbGxlciA9IExheW91dC5QQU5FTF9IRUlHSFQgKyBMYXlvdXQuUEFORUxfU1BBQ0lORztcbiAgICBjb25zdCBlbXB0eUZvbGRlclNwYWNlID0gTGF5b3V0LkZPTERFUl9IRUlHSFQgKyBMYXlvdXQuUEFORUxfU1BBQ0lORztcbiAgICB2YXIgdG90YWxTcGFjaW5nID0gZW1wdHlGb2xkZXJTcGFjZTtcblxuICAgIGNvbGxhcHNlR3JvdXAuY2hpbGRyZW4uZm9yRWFjaCggKGMpID0+IHsgYy52aXNpYmxlID0gIXN0YXRlLmNvbGxhcHNlZCB9ICk7XG5cbiAgICBpZiAoIHN0YXRlLmNvbGxhcHNlZCApIHtcbiAgICAgIGRvd25BcnJvdy5yb3RhdGlvbi56ID0gTWF0aC5QSSAqIDAuNTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG93bkFycm93LnJvdGF0aW9uLnogPSAwO1xuXG4gICAgICB2YXIgeSA9IDAsIGxhc3RIZWlnaHQgPSBlbXB0eUZvbGRlclNwYWNlO1xuXG4gICAgICBjb2xsYXBzZUdyb3VwLmNoaWxkcmVuLmZvckVhY2goIGZ1bmN0aW9uKCBjaGlsZCwgaW5kZXggKXtcbiAgICAgICAgdmFyIGggPSBjaGlsZC5zcGFjaW5nID8gY2hpbGQuc3BhY2luZyA6IHNwYWNpbmdQZXJDb250cm9sbGVyO1xuICAgICAgICAvLyBob3cgZmFyIHRvIGdldCBmcm9tIHRoZSBtaWRkbGUgb2YgcHJldmlvdXMgdG8gbWlkZGxlIG9mIHRoaXMgY2hpbGQ/XG4gICAgICAgIC8vIGhhbGYgb2YgdGhlIGhlaWdodCBvZiBwcmV2aW91cyBwbHVzIGhhbGYgaGVpZ2h0IG9mIHRoaXMuXG4gICAgICAgIHZhciBzcGFjaW5nID0gMC41ICogKGxhc3RIZWlnaHQgKyBoKTtcblxuICAgICAgICBpZiAoY2hpbGQuaXNGb2xkZXIpIHtcbiAgICAgICAgICAvLyBGb3IgZm9sZGVycywgdGhlIG9yaWdpbiBpc24ndCBpbiB0aGUgbWlkZGxlIG9mIHRoZSBlbnRpcmUgaGVpZ2h0IG9mIHRoZSBmb2xkZXIsXG4gICAgICAgICAgLy8gYnV0IGp1c3QgdGhlIG1pZGRsZSBvZiB0aGUgdG9wIHBhbmVsLlxuICAgICAgICAgIHZhciBvZmZzZXQgPSAwLjUgKiAobGFzdEhlaWdodCArIGVtcHR5Rm9sZGVyU3BhY2UpO1xuICAgICAgICAgIGNoaWxkLnBvc2l0aW9uLnkgPSB5IC0gb2Zmc2V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNoaWxkLnBvc2l0aW9uLnkgPSB5IC0gc3BhY2luZztcbiAgICAgICAgfVxuICAgICAgICAvLyBpbiBhbnkgY2FzZSwgZm9yIHVzZSBieSB0aGUgbmV4dCBvYmplY3QgYWxvbmcgd2UgcmVtZW1iZXIgJ3knIGFzIHRoZSBtaWRkbGUgb2YgdGhlIHdob2xlIHBhbmVsXG4gICAgICAgIHkgLT0gc3BhY2luZztcbiAgICAgICAgbGFzdEhlaWdodCA9IGg7XG4gICAgICAgIGlmIChpbmRleCA8IE1BWF9GT0xERVJfSVRFTVNfSU5fQ09MVU1OKVxuICAgICAgICAgIHRvdGFsU3BhY2luZyArPSBoO1xuICAgICAgICBjaGlsZC5wb3NpdGlvbi54ID0gMC4wMjY7XG5cbiAgICAgICAgaWYgKChpbmRleCsxKSAlIE1BWF9GT0xERVJfSVRFTVNfSU5fQ09MVU1OID09PSAwKSB5ID0gMDtcblxuICAgICAgICAvLyBjaGlsZC5wb3NpdGlvbi55IC09IChpbmRleCVNQVhfRk9MREVSX0lURU1TX0lOX0NPTFVNTisxKSAqICggRFJPUERPV05fT1BUSU9OX0hFSUdIVCApO1xuICAgICAgICBjaGlsZC5wb3NpdGlvbi54ICs9IHdpZHRoICogTWF0aC5mbG9vcihpbmRleCAvIE1BWF9GT0xERVJfSVRFTVNfSU5fQ09MVU1OKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGdyb3VwLnNwYWNpbmcgPSB0b3RhbFNwYWNpbmc7XG5cbiAgICAvL21ha2Ugc3VyZSBwYXJlbnQgZm9sZGVyIGFsc28gcGVyZm9ybXMgbGF5b3V0LlxuICAgIGlmIChncm91cC5mb2xkZXIgIT09IGdyb3VwKSBncm91cC5mb2xkZXIucGVyZm9ybUxheW91dCgpO1xuXG4gICAgLy8gaWYgd2UncmUgYSBzdWJmb2xkZXIsIHVzZSBhIHNtYWxsZXIgcGFuZWxcbiAgICBsZXQgcGFuZWxXaWR0aCA9IExheW91dC5GT0xERVJfV0lEVEg7XG4gICAgaWYgKGdyb3VwLmZvbGRlciAhPT0gZ3JvdXApIHtcbiAgICAgIHBhbmVsV2lkdGggPSBMYXlvdXQuU1VCRk9MREVSX1dJRFRIO1xuICAgIH1cblxuICAgIExheW91dC5yZXNpemVQYW5lbChwYW5lbCwgcGFuZWxXaWR0aCwgTGF5b3V0LkZPTERFUl9IRUlHSFQsIGRlcHRoKVxuXG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XG4gICAgaWYoIGludGVyYWN0aW9uLmhvdmVyaW5nKCkgKXtcbiAgICAgIHBhbmVsLm1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkhJR0hMSUdIVF9CQUNLICk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICBwYW5lbC5tYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ERUZBVUxUX0ZPTERFUl9CQUNLICk7XG4gICAgfVxuXG4gICAgaWYoIGdyYWJJbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XG4gICAgICBncmFiYmVyLm1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkhJR0hMSUdIVF9CQUNLICk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICBncmFiYmVyLm1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkRFRkFVTFRfRk9MREVSX0JBQ0sgKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBwYW5lbCApO1xuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblByZXNzZWQnLCBmdW5jdGlvbiggcCApe1xuICAgIHN0YXRlLmNvbGxhcHNlZCA9ICFzdGF0ZS5jb2xsYXBzZWQ7XG4gICAgcGVyZm9ybUxheW91dCgpO1xuICAgIHAubG9ja2VkID0gdHJ1ZTtcbiAgfSk7XG5cbiAgZ3JvdXAub3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgIC8vc2hvdWxkIHdlIGNvbnNpZGVyIGNoZWNraW5nIGlmIHBhcmVudHMgYXJlIG9wZW4gYW5kIGF1dG9tYXRpY2FsbHkgb3BlbiB0aGVtIGlmIG5vdD9cbiAgICBpZiAoIXN0YXRlLmNvbGxhcHNlZCkgcmV0dXJuO1xuICAgIHN0YXRlLmNvbGxhcHNlZCA9IGZhbHNlO1xuICAgIHBlcmZvcm1MYXlvdXQoKTtcbiAgfVxuXG4gIGdyb3VwLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHN0YXRlLmNvbGxhcHNlZCkgcmV0dXJuO1xuICAgIHN0YXRlLmNvbGxhcHNlZCA9IHRydWU7XG4gICAgcGVyZm9ybUxheW91dCgpO1xuICB9XG5cbiAgZ3JvdXAuZm9sZGVyID0gZ3JvdXA7XG5cbiAgY29uc3QgZ3JhYkludGVyYWN0aW9uID0gR3JhYi5jcmVhdGUoIHsgZ3JvdXAsIHBhbmVsOiBncmFiYmVyIH0gKTtcbiAgY29uc3QgcGFsZXR0ZUludGVyYWN0aW9uID0gUGFsZXR0ZS5jcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gKTtcblxuICBncm91cC51cGRhdGVDb250cm9sID0gZnVuY3Rpb24oIGlucHV0T2JqZWN0cyApe1xuICAgIGludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XG4gICAgcGFsZXR0ZUludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XG5cbiAgICB1cGRhdGVWaWV3KCk7XG4gIH07XG5cbiAgZ3JvdXAubmFtZSA9IGZ1bmN0aW9uKCBzdHIgKXtcbiAgICBkZXNjcmlwdG9yTGFiZWwudXBkYXRlTGFiZWwoIHN0ciApO1xuICAgIHJldHVybiBncm91cDtcbiAgfTtcblxuICBncm91cC5oaXRzY2FuID0gWyBwYW5lbCwgZ3JhYmJlciBdO1xuXG4gIGdyb3VwLmJlaW5nTW92ZWQgPSBmYWxzZTtcblxuICBncm91cC5hZGRTbGlkZXIgPSAoLi4uYXJncyk9PntcbiAgICBjb25zdCBjb250cm9sbGVyID0gYWRkU2xpZGVyKC4uLmFyZ3MpO1xuICAgIGlmKCBjb250cm9sbGVyICl7XG4gICAgICBncm91cC5hZGRDb250cm9sbGVyKCBjb250cm9sbGVyICk7XG4gICAgICByZXR1cm4gY29udHJvbGxlcjtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgICB9XG4gIH07XG4gIGdyb3VwLmFkZERyb3Bkb3duID0gKC4uLmFyZ3MpPT57XG4gICAgY29uc3QgY29udHJvbGxlciA9IGFkZERyb3Bkb3duKC4uLmFyZ3MpO1xuICAgIGlmKCBjb250cm9sbGVyICl7XG4gICAgICBncm91cC5hZGRDb250cm9sbGVyKCBjb250cm9sbGVyICk7XG4gICAgICByZXR1cm4gY29udHJvbGxlcjtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgICB9XG4gIH07XG4gIGdyb3VwLmFkZENoZWNrYm94ID0gKC4uLmFyZ3MpPT57XG4gICAgY29uc3QgY29udHJvbGxlciA9IGFkZENoZWNrYm94KC4uLmFyZ3MpO1xuICAgIGlmKCBjb250cm9sbGVyICl7XG4gICAgICBncm91cC5hZGRDb250cm9sbGVyKCBjb250cm9sbGVyICk7XG4gICAgICByZXR1cm4gY29udHJvbGxlcjtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgICB9XG4gIH07XG4gIGdyb3VwLmFkZEJ1dHRvbiA9ICguLi5hcmdzKT0+e1xuICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBhZGRCdXR0b24oLi4uYXJncyk7XG4gICAgaWYoIGNvbnRyb2xsZXIgKXtcbiAgICAgIGdyb3VwLmFkZENvbnRyb2xsZXIoIGNvbnRyb2xsZXIgKTtcbiAgICAgIHJldHVybiBjb250cm9sbGVyO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5Hcm91cCgpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gZ3JvdXA7XG59IiwiLyoqXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxuKlxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cbipcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbipcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuKlxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG5leHBvcnQgZnVuY3Rpb24gaW1hZ2UoKXtcbiAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgaW1hZ2Uuc3JjID0gYGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBZ0FBQUFFQUNBTUFBQUR5VGo1VkFBQUFqVkJNVkVWSGNFei8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyt1bUFjN0FBQUFMM1JTVGxNQVduSmZibnFEV0dSNGEyWmNZbkJSYWxSTGdINkVUblI4VUdoMlJvWkRYbGFIU1lvOFFIVTJMeVljRkF3Rm1tVVIxT0lBQUpGaFNVUkJWSGhldEwySldtdTdqalVLSVFra1FMcVp2Z01DWk8yelQvMzMvUi92U2tORGtqMlRyT2FyVmQ1VjZ4RFAzcEpsV2RLUTdxYVBiNit2cnc4dmorUFovdnZyeHovLy9QajYzcy9HNy9jUDJuMC9YWjZPcDZYOGZKSGZhRy8zajlxNVgvTEt0L3Qzdi9RZnVmUWsvWG91Ym9sei9EcTVMSDd5MW5MVmw5eGVINGIyOGppZG5jWnkvWk0wUCtXZmYvN3puLy84Kys5Ly9zRzVVenRhdjNIMWluSklYa2xlOFF2bjMrT1JPUDJvajVPUG16N2V2K201UERERnlYYW4vVXdld0JkODEyNFpEbjJvM2VUQkJtQ0tBelpRZmpZNzVXWC8vWSsvS2o2TG43Ny8vdUYzcjI0dkh5ZlA1YWU5Y1JSc2FINUkvNDh2ZVFxUDVLaDlYOXo4Nnd2bit3amhaZm1ZalR6bXlCZmxTT0J6NVYxbFhPOGVINTRtdzhueks4ZFRIc25QZXBidXB3ZnQxVnUrUHNsdmFaUHRzNzNGYVd4WGJwL2lVangvSTlTVWMzSExxWjJEaG50VlAwRVJmTjc5cTkxOCsvVDJ1RmxPOGV3OEJXK3F3NFJ6NVJaYk9UcDVmc0pqK2RUcUZaL2xsVEFxdUxjK0VtOGpBLzRkQS9TODljOTVraEVoOFpUWW04ZTNwKzBRVjl4UDVmNWZRalU4Vkx1ZUozaXRlOUNUOUxlem41SUQrS3A4dEIzRW1PZmRlZnNsNTgwUFkxV01Ea2FCTkZYcUg1VmplU1NHNUhqUmRUenErZUFNalArRUw4dkh5Q1N6RnpXNkxFOTZQcmp2N3VWcE11cDB1bHVNcDdJcHVXWGI3WFE2d3ljWnR0a1ViOTN0b0kyNjlySExLYThjYnAwVW5NMnZUeE05dC92ODhJaHplTjNrNlNWLzR0Ynlac2U5ZmQ0UWZkMkp2TzdtOGVHNVc1N3lEUmJBck1LNXVEdmVHQ1Q5UWI3SVYremFHTTcyeHhQdVBjTHBTczhqNTluenBCdWZNM3gyNG5IYXZ0b0RobklQNlNYVjhONjRhRFFrUFRsUnRuYjJzOTlFMzlSZmRSaWZycndrbmJ3N2JvL0poWGxMd2VsUG1jaVR4N1BUL2x2N1Q3UFo1aEhqbGtQeXRaZlJqNXVEUnJPVG5BOW12WDk0eGtCMGgzeXZ4ODFKQndJdnF2MTRVem4vK0swdmV5ZWpmZTROVnVDQURjWG1PejVyMTl0MTlmS3h2cG44SFBTMDdWWWorOWpITjdsU2ZuZmkwaCtjemNQT2VkQWJkSVNhNzI5UGNnN2F1ZnYwbGovdDFzdjlhYlpVM3B6SXc2U3Q5UHZHTWthZFFad2lBM0hrUFBuZTQ5eVJuanRZa2FSQ052QlF2dUpneHpFOFljQng3NEVOSGNZWnA2NzRPWU56aHh3ZDR1RnB1TktuajdZUGtBekhrNzRSSHJyUzk5cDFKdlpnT1FENnI3UVRCTVc4eFNKNlBQRlY0OU9YeGdDOHUxeWdoSk5SczFWd3RqSDY3M0Q2UktmVWNyYlgvdkYwS2greDdlNktVWk83Nnl5eG0yTWNwbE9jYjh3NnhFQ2NPenQ3V1E2RWRPc25EOERaT0IveTUwNUh1NWx6UEYxc3Zzb2NITXo3SU9JWVhIc2V6SnYrWXRIdk43MGRiaUVUZFR2YU5mMjhWSG5IMkg3WGEvcWc1cnN3eVc2K2tEYVhkMy9MbjQxOXluSThmWC9Yenp2MytvdW1ZQUQ1aVZQd3BpZVRsRElYeC9odU9kaHZRRkliMXBOTmtYTnYzdGRYbEsrUk1RUzlPZUQ5eFp4RFIvb0x6WnErZmM1NmNGYU9CdkgySmg2R3EvV2lQeGh0alM5T1N3d2VicktUSjloYnpuQTJKc3FnV2ZUWHUxR3NXSmpRR0VSOFZ2K1NBZVFDRWc3ZkJyNjdGL3B6R0RBYjc0VUYwQzlOUG5xbGQxcmpLOUNQZ1ZqM0Z4aUhCejFKK3ZmSG1USHJXaitzMTVPWEJRVlBlekpBbzRSUW1mSHk4bWlhR3hpZzF4emtQcmozN09oRUhNemxMZVhtOTNpV3Z2U0hqTmZpOElHUGxYZFhCdEE3TnNJQnloQ25ieFZBZVA2OGYraXZrd0hrc28rQ0FUNE8vYjVSVitmYjJ4dWUxbnpvbU9oOXlRQWZPT1ZOVlU1NVV4V3R5bCtRRHNLRTh5RHB0OHBEOEpDLzRvZU9JYjdtdE1TQXJ3OGZmTjVzekhuV2dQaU44clJ6TkliSmhKMWNJY3pmblVEU2dXZUVBUmFmL1lHODVnRWZSckg2Z0lteWFHU2tNYTd2MUEwd29mMnpkdlVTQURKL2NNQ25tNW56SFE0MGkvbEJCeFNhVlNqTklJY01xYnhvOUd1blRxYTV5aEpwVUtDVjQ4R3NCM0MzUEdVRUNlQ3lxaWZ2bzJPRDg0MWQ3eDR3L1E1enpxZ1RscGVKM3J0djBzNEd2VGtjbEtkazVIRUwrU0x3eFdDOU9BaFBnYzJPOGlVcTVGZjZmWHF0TU0rTC9oUldyQmhnQWNrbG42OUQrL1Q4aktmWlFJbE9XektBTktqcHk3MUpTaDZiNzRRSm5BRk03T0hqRm8zY2VkMHNEZzFGUHNlajZhL3hQQ291T3gyZ2VXOGdUYzkyamw3aVJoQVB3Z0R5aXJaT1kzbFJXc3Bqeit1K3lpblRySEJ6MEwrSDE1Y25ZQnBBTnhCTlRHZEN5Z2Fzcm5nQ1hzQUk5M0N2ZWdEMWFmMEVvVU1ERG9BYUU1cWVUSGFRZWppcyttM2N6dDFRb0lQakcva3c1ZTJ6dlJRVmEyYzlQWjhxMUE5VkFuSDdOV1RTZUFhK2hpeGE3NkR2UUhqZ3dsVkhsczY1VXB3SzNyWnJQSTdSbm1FRmVsQVNINVJIVks1UzU3bGdBQ3BHR0c5cGNvSU9sUHlsc3lnWlFKcnE5RkRvdnIrU0FZVE8vWkFBTHZibWg4TWNyeWl2dEZDQ3YrbU1oMndZREhiR0VQNXRNa0E3MWVsR25iTktPZ29NbjUrTlNKSERvbGxqblo1Q3FLMVdLMkdYaml5dWcvT3FneWY3WURjeXpMdDVJNU50YTJxZGI2TDRXUjBaYTJnVHdxcFVWanNxbzllckxqZGZNeXJIdTBidUlselF6SGRVaUYzNTB6dHBaNmZWcit1MFBEajZaL1pPdmZYNkRCM25QREpOSXhUclhkeElxQTJ1dkZNaUtCa2JJeU1tQ1RxNHVreU5BU0RFaDVNdVNBTUZDVi9aUGE4UEN3aEZiRGJHV0JmNklpekIzbE9WdU52SkpRUFlvSUJ3NTkxdXArTzZXOGtmcTY3Y09CZ0FQYTRVcTQ0SlhWWlhtTDVPUkZ0WnY2a1JVNnhpSWkzOEZYWHBnMFpwUXN2TzVCd2JkWVNxbmE3T0lya1FJdUNka3VUUTE1V2tUekhGSVJXZUdzckY4Z2RJdmVIU3NLUG1PZEFKQkxYdXRERWwra3l0V2I4QU9nWTFrRkJXengyN1pCbktzWTdBZVJjS2NmVHJBQTA2cTh0K1pjdGQ5RSs1eEsxMnZmVjhQb2NRZzdTaVlyM3VzYTE3U20yb3NuY1E1YWtuYmNBc1p4TUpXQU9UQVdUS1RHVFpkMllmbThLOE9EZ0R4QXpsa2p0ZFludCtsUUdFcUdRdGVkUGRTTnBBL29ETzR2Y1k2Q0ZSOTZuUXdmeGhPcTZRZ3dvRFZsQzc3ZUdnUXV4SkNkNC9VSCtkVVh6MTdmR21RNjR4NVhHWHRaQkhENE0vOVBBV041S242bHBuZkVFOThxQy9aS0FnQUpVQnFFNjQ1cmtlZEV5dG8wb2lyR0phODF6WE51Z1lwMXVYdUhMYzB4SHVka1VIdFVsVjlNc0FEVy8wajloUERsY1pOaGYrcFJCVFFUeDJ4VHBiTW9DK3JzOTQxOEZHL0duTHFGMzgyVjhQZEQ3cWpMV1ZoYU9iRExCdk1ZQnEwT3k1WkFCakxUMkdOVVRKUkozRjc5SDBEL29STHArUHRzdWxDSkJlREdxc083NFU2ZDVFS0ZzeGdPdWdKZzhhV2R5NktvVVhoNFZzWWtRRWNGSER1NXI4R2hWcm0vYnlsN0xIWW0yeVIvdWhUaHhNODV4VGp3N2RrRnJ6d2RYQTVjMUxpbkY1ZnRKTnlNSEd0SlNZMisydis2ZGM0aHA1YU5QZ0NUdW9kbU9uWWJSa2dOTTQxbTNjZy9MVXgrUjBzbm1CenhHaG9qelF0VGxaTVFDc2FadHB4UUNRQ2JjWllPWXpUb1VOcDdCZTVpKzcwSS80Q0lWdS81WFMvaFBUOERVWVlLc3NhM3NlRlJFcmFYcW5OZ05BeEtzQTZJeDBBalh6UnYrVysxRmJ6cmVYYVJTanl2SFJSeG9qUUwwZFUzTEtJRVB6MU9NMlpUQUlPbUNoTlpPSGIxNVNqc3ZMMDFWQ1B6Mzh1cC9FVXgwSUt1NWFuclNHdUlvdjYzbVRDVUlHMkZOdmNOMU9CZ2tyUUkvVGVrYTJiVDVVcUtqeWZPYVd0MkNBTHRUM3BWcUIvNEFCc1BaeHhSN2xqQ01EeUVmSVdnbUZqdm8xYUkzMTZlT1Q1OWFLaHkwZ3owTnF1Y21qZkx5UlVuOWd6UnZzZW1RQTQ1MWtnQkVrVXAram1pcUdYTVlWQU5ZUkcydVpFNTJ6YnJENG9rNW1VUTZoTmNkYWN2T1NXd3p3cC8xVERvL3U2VVlqbFRVNXB2eXlEaHVsbFREQWNSWkg4V1VjSkpjUk1MN2hlL3FReWJyVjRxNHBHQURxb2NvQUhmenU3elBBckpDdUhQaVNEUG9SNTE1dVpvL0h1S0JaSkZza0EwQTFVU2JVUnYyNlpnQ3NiaUxEUlFDb1pJSEJweVBYdXNXRHI2T0ttK2xkYnBraWY2cTRvdmFKWVVuTk0xNzBQazgvUTJ2R245QXhibDd5dHhnZ3gxTzA2UzEyUnJZZmVpOWtHeHRjQW52WkJuSUE1VExNb01mOGdWRzNTWWM3eVh3VW1mbUIyN3NPUUZLZFlRMTgxNm15MnExcDkvc2xBOFRxSXlSeHRiT3lBMno1T1RTK2dobUhtSVVZT3V1dEpjQWpuRVg0d1BzTENVQlZDT3ltVDRQQlIyWkt3emZDNjZqTVhnOEdLNTFEWGJuTHVGQ0xPVEQwV1BEVjVTU29GcHcwMUR0TmlYcDlsb2U0Y0wxMXlkOWpBUG5oMjdSWFhSdGlMdWFZSnYwaEFJUUJVb21pRGk2amlmSGQ2Z1FyMlVNTjZMSnkrWlFNN1VCTVJQZ08wN0dWT0pUUHYyQUFyajQ0R2twY1pRbk0wNFBVcHE3by8vTVp5UUI0ZjJ5UjNRdlNZZ0Q5QVhsdmlvRGVTcTBOemdCY1FxbnVETVRwQVI5aXNjMU0zUWdQZFkzZ2haUU5LZ1RSTVVWOE5HOWU4dGNZZ0kvR1RIS05Gbyt1bG9CMEVxa3BXRFFyNDB3eVFLM0dWUXdnRmltc1hHNWhsalVjQXlhNlJqS0FNa2lQUnFYanp4bmdXS3dCenJlUDQ1c01RQnRsaXhLbjFpNEFhckI3UWE0eHdNSkVlWCtnREtCUEdRMkNBZWdFVVVOUU9EMldabjNBQUswWGxPYkwzREhvU3pzVnpPUDFuQnFrWEpucXljMUwvaElEc0o5Y1Zhbkd0UktZVGlKaGdDL3NvMjh4d0I3RGk2ZXRkUU13ekJQSFZNblVydG9rQStqbWQwNGQ4MWNNY0VycEdpdkE4aVlEcUIwMVpERzNyZUNMVXJRK2dLTmNxN3ZOQUI4bSsvV0FFSVdhdld6VG4rRUdsUzI4T1QzQXgycDlzTTE1UG5WY0tVNHYrWlNhbWhCWlRvVmJsL3hsQm1CL0xkZnJiYUJUOFBoTENiQlA4NzVLeGQwcUYrVXhCZ0cvMVFOTFhVWldDU01GUENPL1lJQTA0czNubEl6VE5nT2tQa3FUYjYyTm1VbVdtNG1CU0xhdFd4UitMZ0gwREprZ0trZmtmSkFWMFF1d3JIVE9NQVQ1S3BQS1RzcWQydUxCcDF4K1pFMkYrcEsvendDL2V2VG5ncTNOQU8xVEIyN3UzY0NSaUcxdFg2V2k4TUM2SGwwajdnaGVBMWpBdXVqNXJWMkFxUFdoTXVPTWJXdG9KOE9TMzVhRmpvTmJjb0xHUXFLR2Q3SHdjczkrVFFjQUhXTUpPR01oR1lVaENBSkdiYXZpSkZnTmFKY1FoVDkxandXTkpjdWFBVzVQNTVzTThIOHZBZUN1djdVRURBb0dPRzM4VlBUR2tvOEYrVlM0K0xFeXduKzZxa1lYNHdUTFAzd2d2NzhOUE9iR1hob05iTHlDenFmZFdpYzJYcVhjTTNUSUdDU0czYVFQN1YzbWJqOE90UmtBekMzWHF6eWZpNUVCNmlkWVFvZnYzWll3SFlkSk4xOTZHVnZoejFnQjhKYXAzaFY2MzF0N0lVNzk5Tm9sZjVzQmJxc2ZWQUpYK0svVERTV1FOQXJGditKWmVKZ1JzUWNIUTlPSENXWUhNL3lsSlZDOW9LOS94QUJwMmpQL1VURzBuK0t4TTJNV1hibUZ4cWh0bmFhQWNHQi9MTXdDcXE5STRWQXhBRmZrK1E3bUdGa0t4Unc4bi9lNTJFOExaWEl5TEJqZ0ZPWnkwSXVibzNKOE9mQzNWWEh3OE0xTC9oWUQzTjZBSkYyR2FHNEdrRzBnM2RvaHQ1MkJmWmRsL2hlMHMvSkFMSTJ6dGk5QWxvdHhXNFA0K1RZUUVWcXZXKzFMcFQ3czFvYytEZWFtRzFBWkNVM21FTk54cGlKQWhKUkdBbnhBZjJkMHhtbFRNd0JtQ0hhQTZ2UFY4K0JZWEZQZFQ1dXZPazduUGoyWGNoZnUybkx2bVZzUCtmaUhWNWUyUDkyTTM3Z2tDYW9IWHArNkpPaWY5OTgyUVJSMGVVSmpBSWt3d01sMVhHcHVibXZoOU9JQ2dTQTVjNS83MW1XNXNVKzk3UTBjejRRQ054bmdYUTlyTExjOW5kdXJ3cUUwZDI4TjdvVTVCL29zMkRDU3VDWWlFZGV5bksvWFlheUdiYnBnZ1BSemlCOFYvdGdkL29jaG5VNDY5WG5JUWhMbVpzVFpob2NNKzF2Yk9wMFpEdk84eFlyQm96Zk5jVGN2TWZNN05KY0pydml3QmVSUCs2ZVhSa2lPYXlFQjJMYU00cnBEek1Rb2xlMTBEcHJCbDJhV2hRcXVMWnp0SEUwaEhtaFhNY0JqcmlacWFzTFlYV2NBT01MbFlVL1BwbDl4TmhkTVJIOHRYYVlrVHlveThtRFhHOFVpWVZib0hjSmczQUhQMVNzWWdQNWU1ZlZkSjZKOE95UEdmdEhySWF2T0FRS216MUNuTWVKc2xWNng2TVRhUmJ1eE9BOVQ4elJCNGdiNWN4cmtiMTZTbjNhVzk1SXJQa21NUCsySE1wUnVpTFc3SWE3NUFoamFlamQrdEx1NWY4M2Yzd1FWZm0vSlZTUFJqcytodUdCMHNWb3dHS0YyekNIbXlNYnVDZ04waDBwVklRaUhObGFBa2dIZzFSdHAwSVJKSXM0ZmZnUjFLN0FlMFFoZDRSbmVTcDJUWEwzYzBhVUdmSnI2MUVtdk45OE5OSzZBY2VFZVVhdXF6dWNpVmdZVmRJajdLRmFBTDFvbDVYMWM4OFJZNDJqTEphZnVMQnZhbTVkRVNKTXd0NFJ0NktVd2l2MXh2enk2ZEVUMlBhZ2x2WUZyL2dlYWdRRTBXcEFFaDJCZnBwd2NJVHlaQXk4WER5UVVBTzQ1eGdTcTFBMHhCZ1pZdWxJL3Q0bkxzYnRnQUFrQzBvZjUwSkxkYURtb3hkVWszRHJwbHRmV0RkRXEzQ0VjQU80WGlqWk83Rk9zWG02WW1DN0RWUzhzc0pZMmIvRHloZ3hoVEQyTUFCL3pYQm5zcmVjaVhIempxWmdBTUZOcW5vZEQyRC9IOTllZDhzdWJsMWhRNHdCQnJkUjd3SHQvMnIrOEZZcmdldFVpbWt2dHJ6dWhQd09DUnRTbzdza1IrblpRQ3NEUUloS2IrWndPK2dsZFo3dDBhWTVQaU0vbHlYMExNdVhZelZzTUlEMGgrbFk2NFlSb1pLS0tBUkM5Q3VoWkZmZUZLRmdxVjR4SDNWUDR6QnR3Y3VVa1dCem9uRURJSElOMUZ0QWxZTVBVT3dqOWlhb1JxU1kwUXZ5VE9aVElBT29INVRDZk5ENnhyWG5PWmJoTTgyeUY1ZlE5TEdkMjh4S0xJUkxUZ3hMdFlLRkNlUFlmOXMrdUJpTmxSRkRSa2dHTVpRNE5lVXZYMHd5Y2crU3k4Tis1K29MeDJ0Sk5xY0tRZU1yaGI0NEtlTFB5Y2tnckdVQmFVekRBQVVQTHhiV2xTTDY4M0NOMDJzMlZIcW5tRDI5WkZIWU5KSGZ0SnV6M2JhWmxlRFFtdWN4K2pUaVRJNHpaSlp6dlNaL1R6Slg5QUt3akF6VE4yaEFRMEowckRJenc4MW9QTW5oeFprZ2FCdVpKSEJVRDgwNDNMd0d3QVRibzNscWFCd3N1LzdpL0hZNjRBdjFWOG1HMmxxM2pTNENPNUR5QkNzQVdLQkVCRmpDMWtBOVRnZG5NaVNLYTBpd3o3NUcvaWZQRHlTdFJ4NHY5VFNNTkRKQS9Dd2FRd1ZnbnVNUVpJSVRFZUtQZ0NUS0F2em0xSFdscFVXQ1hqQWF4VytRSjZQbmNGakpnZDZqSUlEUnhiM2c0dndNMGJWbUMxSDQwcXJIbkRBeVVRVHFKZ294YmlUSUdZZ2E4UkVaaDFHRlVxOUFmRU0yYmx4QmpLQWRVN2NFVldQZit0UDhZQWNralUvUzZERWplUVBSVURXdVBNMERpR2lURUtrUll3L21GaCtrVzBJYU1PRUlmbDA0WEt5VWo5KzNOOUF2UHFwWDQySEZBaTU4cjVRZUx1UFo3QXNacTRRa3lmYWdtQ0ZjTEtvU0xTNzQ1QTZNanVoa25vTXQxK2oyQlpGM2lHY0dqSHJLdk1mTGRpRG9IOTBxVE5leGtRbFFhZ1R0SG14QjZ1cUlJRFUyQnRnOGNMRzhFbks0TW9FTlYvUUFsaVNBWWJsNWloSHN5d0NxdUFKMy91RCsvVDQ0QXVJc0hFSDlidFdkQ0srOHdqM3VKYklLQ2F6QWxxcGIyc0dMSVFpdmI2bThpcUk0VnNMamJCWGZqbkJIK3c0QzJmaHFrVDFwZ2ZhbGRvUk1iQlFBQ0FoWWFpSWI2MTRtcmo0d0k0TDVHT2V2Q2R6OWJYTGIwQ1dnSDZPQ25aN1FuNGs3MmNteXZEY0JJSElSTVJRL1dCV21CZy83bXVid1Zid1RZUEc4aVpCRHNqaDNSSndqOXIxOEMraE9RcndlMDRaMFVNQ0x0V3YvUHp2ZnZRM3NBbEoraUIzM1pIb2pvdmNPa1hISG5yS1A5SFFncHpNSEhKVjdpTFljTWNCYU9sUDQyU1VsNE1qZ0FlQi9ja0tQSkFhMS9JbjBBQm9NY3JHVDR4aElhSk1EQUhiOUtRRHlvb0ZJMmYrblQ5K3d5aXM0QWx5VlVubjBuYTdPbDVnZDRlWHVRWnNpenBmUXRaL0tQdEJrK1ZnNUI5MFFITElIYTgyS1pFTDZQZnVxU3Q1Sm11Z3I2bC9ydlJnL2d5TDFjaGU2TlB1VFV1bVFEOUt0TzNlWDBYUTVvd3p2Sm1adk5XSTdYL1dPOTRNcjVlRTg1dXBuaENYTGtYdHI3Vkg3TFVBamphVi9aeUVvLzdyQW9rZjZuSTRqSVJXem9jeEJjbFVObWdMWWpSd29vUm1uNldyaVkrUmN3NWt1T3BnOW8rVk1KdCtSZzNJczBzTEVUd0xoMzZoWG9Td0RsaS93SEtoQTJpVi95MmVEeXBYMmpxZzFqZzh0cTJnanRzaEZheXBrOEpQKzhXNXR1OU1CVU85RWw1MjJtUElJZTlMTUJVWXV4eHhIOWQ4cGJRVmZCMEQveTN2NFEvZmZSbjdhY3lkVit3UHFJNnowYVoyckRBTS80WXpyV2ZtdnY2QUJhbHVmN0FYMS9IQVdqQ3l0TWRYd2UzMjBzeHRiSHdaQ1JseGJvWUN4S1hJd3dCYjhpMzBMT1Fkd3loOHlnNnh3cFBjQnZNdzdRY1NoSElLNmIrU1h4NVNjT2hwTEVQMDZlSGtQSEMzWFlnNWlRYWc2Y0xubzRndmo5NkwyZ09xWU4yQ01QWVVadWxtUVNuVWRrT3BIV004eFd1VUI3ck4rNFhESDFrTDdXcC8rcWVEZHhjRHBSVXJ6b1ZORUQyby9GUUg2aTAwUUlNUEh5VU8zQmllOGc2UkhMTjlxOXJidjRHeEp1TnJNYm9VTmYwZFloN1IrSEhIamhQSk9qdUJwTEFPY0UreWcwd1NWNzVnZllUUFU3TUNReGtabHg1WTFpY0VPNWhnYVJSVXBMSHk3bmRNWCtDQytHazBQVVBVNTVIUzdod05vemVTcjY5T05BU25iQ1VVRFJzVTl4YnJ5cXR4cEhEK0Q5dWRJOUlJbU1LZGdpODdtVVlvSElXK3l0Z2RkZjlYd3NhQS8zNWNxdlBWaU80RHF4MllHQlJCOHY0RHAxV21JdThRcHFIWEV5OUFGR1lwb21nTXRUUjdBMTlYa3JEZk5PbEduOE1DUXliNFFPWm4zNWFtc0NPUDhKcXF2Y1NwVWZoZGErTVU5TTVnalpFbEhERENFMlg2Y2J6azBpMWlubTFNVTd6UW04TnhuQmREUnlWaXBJZUduVEJFMUg0bExPb2REMUhWdHQ0T000R2xDLy9WeDBjU0hTVG15WmN0Uk9Cak9VdHJYN0FZSm5LcDdDRUtXSHVxNm5jdGxTOFQ5S3cvNGZsejhqb1FzUGZadSt3M0daUU5FM215YXNncWJMNmdxSlFjT29NOWtLK3Z3QzZFN21OeDlxRjNZUmVBWk90cDhUVTJ2VGNMMTFyZHBJQ2pmb2MzZUVXR1RxeS9yMzFtMGF1SkgweEJPL25iMjRGNWpZVVhtc0dmTjBHNGloTUlOVzVBZ2hwdTZMT1lKTW81bHh1cjNvcStEbTFqMXp3Zk5HQlVpb3o0d3RwaXpFRm9rbUV1a0ZUUzFwQTc1d1FyOFRHR01XbXI5dndPMDcwSmVxaU00bmpxY0JLRE81Q29GMkRzR3pwQzF2OENQNmJuZllqZHdwK2x5bWNyQlVNVHhFcUJFUjRicWRIaWxPdFVPRE5QMElaOTM4WTY5TElLTFpLYmJXSnp2WXM0ZlhCbTVSRHVnbTltelB3TW40aWJ2RGd1YWZadnZxYzRkTVJMUTUwUWdJYzVPL2FkV2tmVVd3Q21GMjRiZzloelZnSkVlSmN2VmJxWWxnMUxFcklrZklxa3R6cHRMLzN6dVFwWmh1NUFDYnhwZzV6NjBaL285eURsUDI4S045MDU2c1krU0J3Y09zdFhzdURjaWNjaVlTR0FLUnRvTXpUaVVIV0lZTmppZGV5bE1OQUphaXdUNjBlMnVQM29uWWVNdUxzaHFnOTlWaCtYYnVEbVlpT1dRUkp0aE9FeEd1YmtjMVNUR1NESEVLQ2pLY2kxMVJVS3NZTk13QUdpU2tiN0E2OStRdy9jTkhqeDF1NW5wRjA0T1hBaWZiei9PNllheXNmUm90YTNONWNPR05YcTM3VldvTjkydHMzQnlydHcvZksrMkJBN2hOQnl1R05nVm9BYkh0OGh5N2dzRUM3dEN3ZEViLy92ZE9SVGt0VkpSb1JtallPdElzNGhsa3NHNlEvcDRIWnk3TjBmcWh3aGxBU283d25XWlVEcEU1eGZyQkdMcG5OdXRoWTRFY1dPSk50SFIwUEFkbVNUVm5lcjlQV01wVUZ3REVLdmJuaERBcy9aVDF1YlFTNjJlUURtb1VIcXdYSHE3Q0xTdlNuNmlEc0dFb2pibXhYd2xjWlZRRlZxSTZFQ0N4SURPVFdIa0ZETmxDMWN4UUF0KzhJempoZEJSWGdUVFkwbUc3bkY0SituRUdvT0c5UDI4OFFHcXZYNVVlQVhFdnlWZlFnYzJ6RVJzamgrMEtEMjVQbCtZUExBRkdTSjl1R093dzYrQnJNWTBwdldRSzRDb2s3UU43QkF6T29FRGZ1WW16dkNZTHVIbGVkUERLaERCTU5PTUljdEQvc0VDMDJaTXVRNURtU0lBQlh4ck14alpxN3JXd3RERDR6WVFONGJYUkJDS2ZDWUNXZC9KNDhqNjhaK1JXTEZNZWppRE91UVh5V2tBRk16dFR4UUEwT1hrUWZac0JvQUhBaFlJcjlCa1R2clg5eEJFTWZmaHM2VjNyMHhOMm13RVlmVmVuUmptRjMrV2piL2tNM0Z1MU1RWll5NzNsR1F2UHBXRjVWQXBRSFVUQUhSUDFjYnBSSENIYjFZOElHRzcwd01SemdURVZJak5TUlhvZmswdXArMDBpcndrVk9XcC9LaktzSDRoUzZIOWRPSi9jQTJtRHdUd2F4Z0h1ZnRaTHdUcUlva0Yyby9Bak1EeGNCTWxLQkVNNHFiL2lNeFp6OWREcEVlSmVxV25CRk40elA1S3BZTFE3RjB2QWlrYm5HMHNBdmNQU3RSYjh4RTRkUGFzMGZ1T25Ic0hKSHJXaGVQdWRSajFTcVAwT0F3eDZ3UUNleVlOUkFYTkVUOXBRNkNQZ0VXb1duekk1cWRtNFF6MUdoZ3h3UExXbUcyR2pLUUdVZWYzZWV6SUFNdllvMkRMUysyQnZrWWJjTGhHNEhWdEFpb1F3Wjh1UVF6VVE1NCtRYVFmL3dMZndHTkpjSmFVbHgvSkZnUXNkbDdtbTV4bnVUSlVjblFkc09xallIam9EYUZhSnlEQUhvcm1tQmJWQlZDaGM2OUhjT0pWS1lPRjJnb2JOdmtFb2dmNklzcDBKU0ZhK2tKL0NSQkQxVlJBNzhoU1FKRDlqQUxqemRIeWFQdkV6aVpSRytMUkd1cHVybklsaXRvamtsc0M1QlVOZVoxVWVBT2pmMkFiNkNnbEM2bURIQ21GQ25zbWxsRElVSEV6Ym1YNDc1a0Z5ckRaMVArZ0dndzUwWFhDNEo0UkIvODdWUUh3R2h0T1NyVkFUWnhLVUhZNkFBWmg0emJIdGo0a0JneCtCTzY2VnpBV045NlNYRW9HUFBqMGxHbHduYzZkYlMzTmt6Um5xSG9vcUdCa0FlZ1MyZ1NwM25BRzREUnlaeTl1M2dTNWtEdGtZaDVweFV4M0xKMG84SktnbDhqQUQzRzh6QU5Ra0tJRk5zL1lQTG1NUGtYbXNiNkU2eGkrbVVCNGFDQmdMWTFpMlVqOUFtb01CeXVuV0p4aUNpVDh4cTVoR3pPRmtzUWN3WGhaeWVwYXRZekFGQmhxcXcxa0czZFEwSm9USjFrc2NRdEh3L1hUdDZZR0JKOGprR0JQWFZQMVFEMmtFU2Vqb1U3ZXkzVHNYNktHRzRTTHl6ZlU1anZJblpIQ2sycWp4SEUrdmJUQ0xCOUY5QXBwaVNyTXpnRHpYVzBaTzVnMllZRE9pbVI0d2lSMkJjcE1CcU82ZkI1QTZaT0NNa0JrQlFMTVFyU0x3TUZpY2V6b05vSzNBcVpjb0hNWlo3NU1CY3JwbFhzc2ZxZ1JFWXIzMU9zRWsvMEFGQ0xCMjZwWGZzU3pJQkVEV0x3dU9XNWRncUdqOVpJQis5akxFRkZxWUhGQ0VDZzAzTllJcGYzQXpRWVhrY05Cb3I2WVBOWk83ZHhqcGlEL0lsMDBHc05pOFl2akxtN2ZSVEFGUU9lU0hsL0NxQVJ1MzhKdFdYaHlleUd0QlJDZmNUUVlnYjh0WHFXempFbGFBQUxBUU53RUNHSHR1MTU2MmlHNmVWZW1mekRZREJwaVYweTB6MjFvT1c0L0ZheXJWUVE0bFdQdHpFVExGRmNOZTMyYVZMMUtRNm1TQUpsb3lnSncrOTJZTW9LNjlTUHRnNmFsL3lnQWUzTHpRREhDck0zVXJHaWNzTmdTU1BKWGdnZ0Urc1gvNlBRYllaNWFLakJJK2x2aTZFWm9iOFpZdE1NU21obXdSdmZGekJnaDFmNkZyT3BYWUFvSFVoUWtnTUNkdTNKZ2pGVlZHUkpiWU9qME50S1FTK0lRRVdHQkxURGZMZTgyOFhIR0lxZ01ZSU1IYS9RVHFhaThKZ1RVREFvRERsQmdOTm9zWmlld08wVXRyU1J4ZzB0NzlUeGtnUDA3SUR0MHFvOFlyb2pIZXZWd0NGbVRYMzJJQUg1RUtLMXd4d0dUTEJ0MjB6UURqcTJpeFpJREY0cElCTWxYbjJrS0E2N3d5dWltUnpod041blk5SURTMDd3SW1NWTRwdVlRQlZKYkQ3S1Z6bWZxQkhlSTBydzhsYXlSWU95S0tUOTl1UTJWT1Vnb0FMRG5KQUJZVFFpTngwcm5MTmlRT0pBNlFpajlsQUJ5TVhIR2llWE9NUWJTQU9CL214ZGNuQXpCQSsvY1lnQ1BDTEJXRXM1UXZsOGdMTlp6OElRUDBwRjB5QUhoYmQ3eXJjd2o2dksrT3NvalRCUFFGd3lBWGxVZGd3aC9FWVVoYTNtRXVPeVRHOUFOM0ZkdzhCQlV3d2RyOXpObkZURzVPZUdxcGVGcUowbUlUV1ZOT2RPK0Z3Rzh6d1BmUEdTQWtLOGhMdlF0RFdhY1dLYjYrb0EzMGxOSHZNTUMra0tPWk1hb1NUMngwSDF4ZEFnWTNBTU0wcTE5bEFOMVlkbXhFV3d6UTZjRSttQXdBVGlLOE5qbEcxc25hRkdEUXNLOENvcXYvbDY2Q0g3Y1BRV3pFcHFKSmJZamVzaUVwYjRLWURvcGtnQ0VhZGxEalNnS2s3K2hQR1lDWUpLNkNMd1RNdVNzbE5XWitmWXMyUGRNWWZvTUJUblhHb0lDbTVNdlZ5SXRMQnZBVDhkdmZLNWVBcHJsY0FxQURybGFtMU5VTW9DKzhtNnU5SmNWS3NjK1lETXN4akpkUGtmMGxPa0JpTGhKMGo3VG5OdzlSQlNTSzlKeEFYUWJuaFlXQ0EvdFVwK3hiV1RQcmNxVURoTy9vanhuZ0VxNmRlS0NTYUdWbWlhUU5sTWRCNTljTVVBRlV5Zy8zbHp1MGtSZHRCdUJheFQwN1lKbDgwZHZid1BjM0F2U1I2NU5Ea3JzQVMzV2FYMTl1WXFzeExHZHQ1QXIyN1J4NncxV0FPT25iaHlEcFhacnd5VzU0eFZNNFJyWUpuZFFKdTlaczlsYnRYUURINlk4WjRIYjZqYVd0VnBHT3p2ZkZCUU53cy9vYkRGQ01DSWJjVmNvTE84Qk5Cb0Q1a1JEUkovalNmSzBpQTF5VkFJWlp4TjA1SkNuVjRBUUsxR2JGQUlScXVoNVZBVUVKRERtV3FVS1RwZUZHdlhVSWd2NHQ5SW55aGhRQjlCR3BVS0k1eGhuZzg4RFdyeGpnZzIzeGY4QUFtWWltU2tpNUxHaGpFTTdmWUlBVWZDcVQ4MTc1Y3Q0NjE1Y0E1SnZ4ZmZJUU96aXFWN2NaSUZETDVSSVFsc0E1Tm9hZHpHTDdub3NNTGd3bDBEZDFwY2krMit2aVREN2h2NXpMWHpjUGNYZmdpZUZkMm5vcEhVK1dhZ1pSb21sQ0F2UzkxUktnWWZ0Zk1VQ2RmaU1NcVpucVVGcCtmVUVieXlzeitDVUQrSWg4TWt0RmZIaStYSVc4dUdRQUtxUTBXTWk2M3VoNy9kd1paRExERW96dXlBQUoydXdyYmxjVHdic3ZJSFFBMGJib3VhYXZGbFNvUFVMSUR4Q3BCRWhSaHVyY1BsU3FWVEttWkE1b3lSUWNtVkpsYUlDVFhBSUdiTHRhQjJDamUrMXZLb0hUbUN0b3dja0ZiYnJZdUs1L3pRQWNFWWRaZnNTOThwSUNlYkU1dFJtQWZrUGJwY21NbnN2L2NwQnU2Z0NaczZQYnpWM0EySEdZQWdXR056QlFtdE93ME82WTFpOUJ6UmNlSWM4UGdOT1VhR2srT2Q0K1ZJQzFyWDNrSG9FaUFJc2I1aG9tUWpBQTVEQWFZcllLT3NNNllPbW1OcWUvdUExMHkwMHNNNS84K3BJMnlESFVYRExBc1BZRmNFUnlxZjl3bGJMVXZOZ1FZTnBtQUlmZUtZVDNzRkNVNkJ3WXdaOUxBRTdEbFNLcEMzdmZGalFnUmpoUW1oeDk3YUhoS0VITkZ4Nmh1Mkl1YXl2NFpYL3pVS3FBMmVJcHJJeVNYNDNJdkpJQnVsdHIrdEVsbmJVOUkwVHlKeExnencxQkVRclRzSVhjTG1oalM5YmNHU0ExZFFGWkZXbGcyMWtxVXFVc2VNYWJBWGJiREtCR1M1cjJ5VUp6WWhkL3BRTXMxTW14V0hDejV3NmZoVWNFQlVyVHpQSGtNTG1xQWpWSEZoR0s3THVZeXh5ZHpNNTl1bjBvV2NOYnZVZTQrR284K1JlR0lLVytSVFlMeTl4a2dEODNCU2Nicy9VOUkxWHhscWExSHVpTGdxWk9WN3N2cjNoTzdpYzdhRGtyTWdHUU4rUDlpNkdJV0Q2cjZxSnBzQnB6ZVA5cUYzRDRBQmlja2cwamgzSW5qaEZXK3JjcVZ2U0pIWStJWFNkcUtGdDNGM001ZGphejI0ZEt0UXF0TWdYOGtnSFlXcVpnYTEwNlVmNlFBYkRWdStvTUNqYm1neU9wNkZ1VnBoMjVZejQveVFCVWxSWUl0c2xVWldXV2lvbTA4T3ZtM21zZERVUzlaSURFVDQ1R3FPS2pkUVB3a2IreUE4d2JqWE5ZdTc4TUE2U0JKbzRSOXZLbHAyVUJFay9zK0RkRFBNTGdDRkxlZVE3ek9WdXhzN2w5aUFNRTVZQlZuMUt2L0NVRG9Mbk5wMUFDZC9LZk5IdkVIekxBYVhQTEhaeEVRM0FhTjZoWXNNcTN0QkJHWjRDc3ZHSExLOFBTTUNKMHA2R2NHejg4MytmajRLMjV3UUJmQWVGVm5NSndKSTloeW9XYlVjRUlocElnZE9qSVovckw4STVLK201Z2hJblNQUWFIc1RTcWw0aWpkNGVSL0taczNYblZqbDdNNVVpSWZmc1FkNU1IcnVmUWl6TFM2QmNNRUEwSHEyMWdaaEw0VXdiWUwyOEZoS1JsZkRUUmlzcEZERTZaRXM5TUY1NXZqUWg1THE5ZWU0ZUNqMUV6ekZKUmhxZzEvV3cxQXhSRldsaFg4QVgxcTFHbWJvQVlqOXU0QU11MUJWakl5R2dIWlorMU1haDBFZ0ZyY0pma01FQ0p2QzYwMmZDSkFMQWF5SGVNYnVrUEx1Ynk5UFlocWxYUWdCOGVVc1JpRGZnRkEzampRUWFFWktzWjRPT0NBUllsQTJUVzIrc2hZYkhYYXhxWDFQeVZtVFhYU0hadjY2dzBNRUNFVk9UeXlyMGVnOUlvSmpKRXpmUE1aclBZdlFnOERBRkovS1JoRlI4MDlZSWx3dm9KTWdnMTBBa1ZDOXB0RkJZRURGeUJLZGEyZHhBOGtkSEFMU1BOQXFLOGlBRWl2OXdWMUpOR3V0S2dkUE1RckM0ZUpHSVJVbEZNckdDQXBybGdnQ3I0S3hoZ1hqWm1aK1FCai9vdmtvU2t5QzJ5M21adUNxd2prYmdpMXp3UXJmNzE0Z1dHdGxsc0NPdEdKdm5nOGdxOEJKTlFlTUVWaUFuK2lrelQyVmhaaWFRa2FvdGVOa1hWTGNjS2lRVWVFRUw2SjloQUJhb1FWeDF3eTVuaU4wbDViVURBYmd3SnUwOE9VNzdBNFNYd1BzUTJvMGtYTW9TTUJwVGZiK21iUUxqbXp3NXRSMUUrREVzRmY0RlVsNXJHa2U1amRHVnpRcTdxWHVnQUd6K3dxbFB6NVlEekJ3K25ib1hSanNRVlJvQ1FtNW51Z3lLZE5kaGZIdk52S3pwYnB1QWdCcFJKS0x6Z2lvaUovS1UvUUxGc1Zpc3VTZmw2ejBBTDRpZFBRTVhjT3g3NE5qb1lVTmtwNGQ4RW8wK3piWURpMDV2WkthQXNPT3lkZ0doSENIOTlFZHRNSUxReUFHTTRMV01sZExzSTRyeDl5Q084d2VRWkNaN0pvbkxVbjBBZTIzODhTZXh0L21jSEFYcUxSdEtvZHlVT2JPMnVtU1NFQXg0L2NOaDFLMHBLRnQrbFNrejhLZ1RDZmY3QzJpb05BSVg0R3dFeFRQSlJwT0RZS0wyWWhFSTZ5Q1FQL2dzLzZ2WVMrWDg4UXdKeEZXQUJURWFkbko0UkFISWJUZWRyNWdjQWthWEhFa0FzMGFiRWhDTVhCcktQSElGenp1Y2U0L1c0RWtTYUlnNEhTNlpMN2VDY1orTnExajNlUGpSOUpDWVlVUzlnL3ZqbEVOcFMwOURtUU9Kc1cwOHhYbmN6YmFNZmdIZ014SFlNZi9WRHg1VzZsYTF2VEZ3aC9VeGs0Y0JYcm9EOHBRTkpLVm9PcWd6enljaVJLVGc0L0NsWGdYVjdqMStRdVhXYmNpYnlBT0xhQ0syemVFdTlIRTJ1UndvaFpCYnhIc3NRa20vRkJkNlIxOEdzS3RtWnR3N01iN0JvQXJkVlBobGlHdkxIZE9WaHpyTWphZ2Y3UEt0bjNmdnRRODVzV0l6QWVtLzhaU3ROanJxdFZtaVhjNFFweGltUzJDaWI5bkZBS09sSkNxWXhZTEtBZW82UXFTSFdNamNGWnhIR0gyeVJ1VGlVYXY0TGRTM3RoME1YcFRudHBBTVRsTXVyejhlbFo1dzRGY3VzWlFmQ0N2enU5SHJIV3F4VFRqNDdTQWdCWUJMQWxxeVNoNW5od0h1UTE4QkpqVmtCZERZQ05ZVTB1VnlwZHVlNWxkekV2aVJ3VzlmSVlSWUpJcVEyVjlyOVhTYmtzWVVuZjQxdkh5SlhrOG5qbDZmektFZGRwbzRuVWJtWUk5Qk1aampPbHRySk53NlFPcG1rZ0FxTmovdzd0UnRFc0RFM1JUbHB3QUZCQTBEY0FWN21vcG01S3BDNUkxbjB4VHBPTXl5dlBFQXBqb3dUSm1JOWJSR1R2U0ZGQ1AwQUwyQk1ScVFIQ1UvMnBrVGtJbU5Ecm1LR2llWjh4UnNVcEhaZjY1Y2oxRU5oUmVJS1Q1VG9UcllOODk0T2tCSTdpZ1FSVXB1Njl2Nk9XRTRtUWFsbVhYRm9WazNJSW1HSTdpNmdjUEJrYmptL2M1ekhkYUtRSFBRcDhoM2xtWFdlRUI2NFRGSWdMWlppTG5lR1dhWnVkVEZwa2dZWVZhUXY0S0taMlMzZzRrcEY3Z2tkMzBjN2VlWUhuZ3c5Znp4K015blZNOU94UGJnU3Azb2p1MEJDWWxKSVFrOTZKamQyZzIzcXNhQS9NeHl3RUhXUzJ2MHo4bXpmVVBtVzFWTFgwSFllYm5abXZvWXRPQ3BqNHBubTkvTE1BM2VSa0lkWmVueldiZXgzSk9rcFo2b21INHA4SVpGV3luT3BqUEdWSE9hVUhFYVBtU2NJOFFraFovcXAwenBQaUIrWVZVa0s1RUFxNDh4MllndXJhZGNYaythWU5OaDZGV3B0ZTh2Y1d1aVp5OWpLNmZqejdVeTU1SUZBejMvaGF1NENtWEJDMVN1NVgrUnVCQW1KU2dNSkxiSEZrZE9EK1ExeUo3dDNUTHoyZEFFNUlxa2RhTWhNTzYxS0hWemFTc3RaK29RWGlnMkFGY3d6Z2NQekRVaWx4UU5rbHA2d0RrU0NIOCtOUmtrNlk5b2U1dml5RlVrSG5RQWlEaVU1UUllWjVwbmNoVEVqUitvZ09oKzA4UjUxbmhCdDVTMFlXNUxiY1RrVmhLSnFyV2t0TGlaTlFRTkdBMy9USUFJRHhqbDNtb1lpTjFBUHA2dXYxVTliSEFqMFBQbHNwSmtvbUhDQ00zclhxN0xjSjJpVWlTMkVWc3loUUpUNFlrNEdpRlRDaHFuRms1elVFTml1eUZRTTRDUnFNd0RMeDRqdm9Ja3FQMHdaT3o4UXpxMWk1MDZrRVZYMFRPaHo0b1JtZGtSU3c2Uld5c3laNVF2SktiSUMzcE15NEllMGJ6ZlFCdDdEZkRibjBFR1ljZWlIMzZQTUV3SkNFYnlPVy9nMVlaRERaeFdiYTZnQXJVbWozMElhWUtDWkFJV3ZKdjFwYTFxNnBaYzRlNllYMmRERTJQUVRQYy9vZDFSU1lzSUp6bWhZajdQT3hUSks2eGtOb1BmWTlHSitBNTRwaWc1WUFsSTdVTnBWeFpOSXJWVXdRSkxvZ2dHZWtQbEVIR05nVVppM0hMbUpQQXlBTFh4cGhwRFNRekF4SEdrbU1ScHVTWTN5TE9KcjZWL3dLZEtiRzI2TmVRVHNDQkpDQk9LTDcrNDZ5TWFTQURvTUZVQms1QW5oMnhXM1NDL0IvaHFoc1A2ZlZPRjhyQ2JORWttcEFOeEZlQUJGT0JlQUxnTm5LQUYwMEpEVmd0UFZrejh4Z1VXQm5qOXQzTWw4Y0t0LzVuMkFrNS9SOE5DNlJwSFl3a1FzMVd2bU4raDBzUi9HQ3RJRkhIN2RaMTZOOTVJQk1yVldNb0NUU0RyYlN3QUUxR3BYZVFRTnVVa3p0VkgxVG1hT3c3d2NyVFZHTW9aUng0QmFrTWhtekF2N25wSTUwa2pJd0pGMndJUHhFS2k2TE9VY2dpUXJsbGFWUTBVaTVtUGtDYUY4aXVnaWpHRGVZdWxCVmRyRnl2eklRQVl0WHBlb0tpSjBpcVdhc0JsYnhKY25wVDl2Y3Vpdm1TYzVTYzNwYW1sNXlSWkNLcURuVFpBNTZQZHcwRUJOeUJvUDBZTUhtUVdqQVE5L2dseEhZZ3ZicE1jR0cza3NWbHdlc1VGWG9MUVdNb01SWFFheUhLNU1yWlVNY0FhSjBObVdBSkNuZzNrVkUyQVN3RmtXYStmZGZ3cVlWOU1RVzBiL3M5cnJlejdHU2d0Q0Y0eVpIeE1pd0hGckdxVlNJQVJPU0pLbEF0QzYyNlU4WVk2eFBSK3pJRm1lRUsrandDektsS0hrTFUvSEFwbzRvYUF5eXF4a1J0dUNBUXpkTFBFQjZxcnZNUVdPcGR2R3dnQ3ZJVmtjVmpMalpOYVJRSUxDU0VXeGMxK3Q1WGx5UXptVndQQTZud0hIWVlnMlpXYkhIQ01Vc1pGRFFlZWl1M2ZCWjJZTDUvOG9BK1Z3RmFtMWdnRjZTZ3p4VldGZ2FnYXdaQW9BbEI0aUtxaU9uVFpzWUFuellrbklhVVNnZkh4Z1BvWTZ6VXdTRUZCY0JHRDM5UUlESURYekNKZ3QwbzlRQnBVTVVCbHNHZVRNUENIdVE2Sm1rTlVMOUprcWNqaFYrNnJkNGhaTTFNaWMxc2tBdGh2cWVZa0cxZ2ZEYlpXQ3VoWjFxTnVmNkhVZDBkOG5pazdFUldtWDdxY1o3VzNwMXhtRTJtSFZ6RVRlVGpwOHRZUjdRYnk2aU9WS2pPaEkvU1BEME14SlBzU0x0UUxjUjd0SXJSVU0wS2h6RmNNbHZGSXhRTlN0VVVBcFZpVFlESzR5QUtkMkZrWGlMN2w0M2hEYldTRGpJVFl4UnpuellxL1NXNVY1QkN6anNFSnVvUnBnbmFzWUFCNnlyV1hNSndOZ21BZVJqNFU3UU54Y0l5ZE5mcnRhUGxvaFFValhVWmpZN1kyZ0xXWnBLeTcwVnFRbDRpTXpLRXZhaXJvOWQyR20ySWNhbjBVZXNKaGFyMm5Ud041N21ycHBnVVlDdzZBNzRWNlErRTNUTGlJTVFyWWprWVdRbHdpSGM4K0RYRUlDOUJlTkJqblRRMWN4UUZhdUVqMGdjamhjWTRBQzVyWGdXUjd2TlIrZ0VMQ2ozRUtuSDdDV1JKVGFRZTlxQnpQVWlsc29idXM0eWp0ZGZoOHFoS0IxbXpaNkltOTFMRXVNWldSU0lGNFYyMFJDWmIyTTlScU1BV0dFdFlJTDE3eFhGUXRGQVNkNVdvNkRsN1VvazhtTWFUdURZdDhQTmQ3M1p1aEZaRWlLVWhTWGd1V2xqdW1WUmNmelYyYnY5ZnJNdjgwQVowV3c4dkdPc1VHYXFaN0h3dGNNNEFzU0NuNUh0TVkxQmtpWUZ6bXBLSTNmWFZWbEFaRk9jaUtkaUtIZzl1REVaZFlETWM1TUdMV2tHcEtqL0ZUdWEzcHpkRE85bUZjYTBYdGs0ZlpXZENOdlVWYk1FWnA0clJOcTRYMlQ5YzRBbVpBSGdhTE1sUkFaRnlSMktOSzBSZFc0QlFzeG9UZVVlL1JTaEpBQkZzQUhYREtBMlozQXJuK05BWlQrdmcxTjYwQ255MWo0TmdQa2dyUU5kTkQyS2dNVU1DOENQOEFBaGlpckdNRFR5V0ZyTVJqNDltREpaZGFHYzRGZFhCUTJPck5iZGUwNlMwQWYzUTIxdUhHUkJDTUt0MDk5eVdFdkNSWDZJc3I3SGJnQ01tRFhGaTdOd2RncTVBdHAyelN0akF2ejlUeWlSeVBqelJxeHVpdytwV01ENVI2OW40VW9IY1FTRUF4Z2haUTF2dERCcjMrTEFRcjZsM2FBTHU1Nmd3RW9CbDhuN0w3QkFBbnpZcnhYTUlBczA1bE9ZbWFZUDZKVXJTSVZqRW1iV0dhYk5TckxzcmIwZTZnaEhPVXlUOGduNnJZMWg4Z2U0V2daNmMzaXo0U1lMWkFhUTNzUnk0dGVWRjFVUUl6SHFJUVdEckhZa0FFd3FvUXVic01BRmV2MVlLY0k5cXBvTHFwS2lyQUk2NXV2am1mRGoyWFFhQ2lCS1phSm9aYlJKUGoxcnpHQURnME5rWlVsOERjWWdOMDNHYUN0QW00S0JxRDBMSE1ob3BEOHdtclNRZllTZXFzcXcvazhFSUl3ZHB3UU9Pa1c5WGZ0NExGWXZub3k5c3dmaytGbjBGbHl4WW9nWEhpMEdNdkx1WVlianJqT09iUlNQaGxpOFJ5V2hoeFZYYnhZcXdibklyeTYwOG54OEZ4WlBaMiswa3NHOE5BejlMbzhuSXB1NmhQTGZPMUYxcmJSU0M3WHFPQy95QUFLcVdQVzVOTWZNb0E4N0djTWtFa2dQT1k3R1lEQnZzU0plT0ZWUmFtdTV3dEt6Z0ttN05DMWxKS1FrZHE5aTFSRjhXWkNDeDltaXpHelM2VU4zSG1ST0RidHpiVXU4Ym1ycUhPZHdoNmplcDBCdEpsNVpRSW5BRlI3SHc5NkdCZ0lHZ3lBMExNVmU1MEIxSXhRNXJCNlgvb29vdWg1cjJGUnk3L0VBSjhmQjVrcUZMbS95UUNPbFozOFFnZUlKQkFCN2tvR3NGc3dNV0ZVR2RmSnV4cEUvam5IdStzSE0rc2RLUDJTRzM1ZElpaFNTOWE4d3BrOXRFeWdRclpBNDJxa0h4b1FqS1JKS2V3TEJuaTd1Z1RFaHNIQy9tbk1EOTFTeXpHNkVoRVp0N1NUeUtFTDJNTFV3Vkk2TEZZVmxIYkx2OFFBaDhZVzBlM3ZMZ0VaME5udHdvN0swYjlrZ0VnQ0VmRE9OZ05FbmJqTWJERHNodXh0b3l0NkYva3VSQ202RHQwdjA2V1J0OWpZNjBLRXJRb2tqendESHhmalZ6QUFWVGhrUzZtVlFHS3RGdEpTQWlEaG9pRS8vUVpRa0FFUlFlOTFCaGpET0pFRk5zTVo5SmNZUUtoZ1NaZk0rZlViREJEeVNOVWNHY1BiZG9BRUROUGdjNnFYZ01XY0hBQVo1NWpiQkZTODFBeVFRMTl1aTY0elFJSHNjTlhRV3psUTJWc3hRRC9henhnZzFxZVY2bkRjQnJvV1lRV0VpL0wreE8yTEVBOGRnT2lZd3h5OU54bkF2UmtxVnc0b0FvQ1lncHNNd0hWTzdDUzlTeEVtZkhneFhOQjZhZEQ5TlFPUW03blJTUXZZRlFZZ3pDdnh3cWRLQ2RScm1ZKzdXaytKdi85Zk1jQTJHY0I3ZTk0RzVVeUozbUFBd0Z1amRXNHVBZTlaWnh2VnRKdGFYOUIwUllOa0FMNlFBa0tUQVp4WTZMM05BTzdQbEVsakNjbUYvZzVNdFh6em81cFU5aVFSR1RtT2hCcnFKdVJpdUxDaG90L3FOeGhnWEpnNjBnWitsUUdZOGlBU1FaWU1NQUowVVQ2K25YcW1oREZDeXByU1kyTEhGUHZTTkRyTUJEYVhPZ0N0NDF4dlZ2d1BUK1FXbHIwc0ZCcWtYbzJrZFhZclFHbEtZVi80QXR5VkJ6c09sOUg4RXFpdHlRQWNRR3dqbkFGaXlFYXdKTjFrQU9JU3RGeTVlSE54RmpOalVRSkJFanVwMHBNNFh4Q1A2TnNZc3VwVlV6RFZnSjh4Z0tmZWNReDZCWlBLc3J6SkFFeDVrTmpPWkFCNG9BQmV4YkViRXFEWUJRd2RTaytBTGJ2Qi9KZTdnQ0Z4bGdsQ3dRY3FUV2dLREppK2JobFErNFRiTlc0Wk8wci9lUThnMDRTSG03QW4vZEpxK0NuYUdTdmt2dk8rY2tQVlpyRzlMUEM5dXpRazVKc2htVG5zN2xlaGk4UWxzSVM5czhscEhLWm9VSlVNNE52Ymd5b1ZvVmZnVkxMcTRsSmdqblpRQTlKSGlMV1B1TU5nQUxjL2JHcDNCMHROMVdWNWpRRTRjSW51cmhoQW9Zc2thYkg5Z3ZTbTFFOC9xQXJVekg3dkNUVmw5YW5jRVdrSGdQakRjOE1PSU9SREZneVlBbzNVV0t1SitKNUhYbjBPcWxES2ZZZEs2UlQyWVFuY3ZOTnZnRHpPVmsxN2JPb3NNMmdzRHBSQ0NLTFNYcGdTb1JxbVYwWDBCZTA5ZUVMdVN3YjQraTVMMklPa2tWWFFUQ2NMbjZ1MG5acDd3UWdaOXVrNU90ZnVzeWVwNWFsVzh5Wk4ranVzZllZN2hJdElydzhMNUxMR1NURVNwbDJXVjNNRjEzNmc1YjVrQUkwcGgzakhFT2N1UUNWbnlEUERTREtKVlpyODFMVkNIY0lja211TXAwdUFoUm9UNEdzTXlGNWl1eEhwNGRZOUczMVFpcXpsRDF6NGhpc1RabkFHeWRSS2tDblMrMVBpSy8wTjNVNEw4MEpPSllQWHpnUU40a3Ayays5aWI4TUpsZ0kzR1lDZEpta3d3dlJRMEpuaDNrRHpudERCR0hoZ0U5bzdkSHJVVHBCYWpiNmRBWHNSWlVBWUtYR0hzRVVXUG9nbEN5STlFNVhHZ3BKMVdWNGtpNmJnaWN5QkpRT29ZMjZWSUY4TUc2YTZDSlo1WnVEd29DY1lDS3RNTldKRHMyNGk3Rk4va2N0bGtoMDgycURVV1JDL2dMTEY2TFhSMTE3VFJRRDREaDkvUnQrRnNPZTBJZ05nSmlTUUdDV3BlRitRWmQ0TERHdnBUb3dZd3JFRm4xaHZTdGhOSVhCWmdNZEQ4K0c0WktrQ21zL3B6c3lRcXlLaW1JU2tqOW9Mdnp1NE5FaTlCYW5acTdHWmhKRTZHT2grQ3JRd285ODNBSlVnekY2YllTUVFNWmxsZVdkV0w4RG1hZVlPTFJsZzNzd2hUdnVEY3FwelBrS2o5a3JlR0RpNkNLUTM0bjlIN0k0RU5vNFJYblAwR1crMHJCeTBhd2IvUktBdEhJM3ErZDFTQWJNSk5KLzdob3Y1TEhJR1pjazkwQ0NCeEZaTlBiM011MVZnV011QWdvd2lObzgwZTBQQ0xtdUJlMkplVFM5aHoxcVdyS3pvcVJveTZGSTV3REFGRXhJU3JPcDQxTW16ZzB0QmF2d0FkSmk5RzYvQmZPKzRRN1VQRVMyTUtDdXJPejBtb2hUMWZrOE9kSXBLdjJDQTlBUFpxbEF3Z0JZZW8zTXU0TkFvM0VXMzM1bmc5VWhnMGV1WnZwRUlnRWszWFB3bW1RSWp6TkZuMmZwVHJiTTRNR0xqb3cvaFI0dlV5ZVA4QUZWY2pXekRkWm9WTTZqSTEzOXNvWXFCa0xRNEU1emJUUXdydmQxb2lTUGdXaHFkakI1cENWekd3TllsN0szbWRhUnFRUE93NjZ6eHJpMndONnlKSHNpNUlQVUxvTVBzMWV2UnBvN0pBanFjRkI0VEpqejFJNGk5aFVDUTluaGY0ZFR1b0dSa3lZZGdnS1pwc0hSeDlzWlV6L2w0dGtpTUNLVXlxTHhucW1HUjJPMFEzYTZHRUNNc2paT0NFZUF0YkRlaFVhM2U0Zk1UQVZPY1FDQ0szQmk5KzNJR1piNytZd3RWSExWSzlRNUtsZ0lxdThreStaU2xEdmp4M3BTd0lYQXpDTHBWd2g2STFXTkI2NlNmOUFhME1lcUZINGxIMVJiSXVaclU3QlZzR292RjR6WUpZTFZ5cjRIeGlETDRlekM5d2RaUWFoZ2xPRXdIWUQxUlZ3RjlKVU1BNGpsbkx6My9pQmJtZlBUUWNuRDVtMG9xaktlVmNqNTZEWElPODdQaGt3czQxb1JuVzdYZ1dtZGhWaFB0ZlEvRTl6UFJWZzdpSStEbzFhdmFYcGxCWTRpME5wQVlPN2FBZHI4RldSaFdqTjh1U3hXWnRybm9WY2hnQ2x5RFFRQTZreVhzdmZZaWtaTVZWUTFOdDNINC9xTmZFSGhVbnErQzJrbTlTZHlwUW1xUlhZRGpRQWc3SUtxQjhjQXc2ajhRcFpDREpySzhlakpMd09rU2tJbE5kWENJa0VMajdPWHBKK0lGWWo0cThhSzIveHZIODU0NEV1a0cxTERzZHRTNnRMSjdoaFk2QzNvM0tKcHVlR24ydmlob0Y1MDZUZzQ1MURzWXVQcDBNWVBRRDdJVVFHTGdrSUlzTE8ydmdoTlY5b25YejlWU0Q0ekxYdnpHSWY3RVBWblFIdzhtV290aW9VUVJnOUE0UFNURDI1dUxERlRYUFdWeUYwTGNsZFFGN2pRNDNwY1hUMkxCdVVURW04cFJ6ekdEdUMwcUxicURBMnFLUllQdWlGQWwwa05iNHYyRmpYejJZcG9TTVJUek1VbXRZR0RuMnJIS3FLT05zblpyUHpsZm1ZV2poRzRRbW9qZlFtZUpZY2VCNkdVZnp3NU00NFpJVXVrSllwcDhQQ245ODlYa2VnRHNqMG91b0xtMThTaVBCNloxNHh5R2Z2WWE4K2tSSExMSnFKK1ZxSVRrMVNVSFlaUHJQYWJwNW1SNEV3SWNuNTRVdzA4a2pGWnhwczZBNnUva2k4U2RnbFNFRGxQQkxMTEU2ZG5NenFJYlJ2MFgyNmx3VnVyV1J2RkMyS1pheFJESHFBT1FqcFo0LzNwUysxUi9xYjhSMk1BbGhwR05wOGVTaGlOZ1ptTUEvaGJTampHY2VaRm13UWdvOTN2a2E1QmVFTFJPMlJBbzc3MnVJSUZtZklCUXNINWZGeDc0R2VPbHlOSVpwaUJtbTRzdU5KZWhpbnJOaGQ4Wm5ZaGllWDFWRkZyTEQraWNpWnh5ZG53N1JTZEt2RndKdndtUzFOQlJyZTlOSkF5ck9HUFhJSjBXTTYya0xuR25Jd1Nzby82SGJURVpIT3V4bUxROU5UM2RRQ01jM0ZQam42c2l0cGF4Nmc1THkvMjlma2prUHVBa2ZlZk1JYWxFZm1PMmNnSlR5akhWQllieDZiV0F5K2VTYkFOY0pDNkprOEJzWExZaFpVb285OHRyWnR6bGdsY25iWUUrY0tSWWdmN21jTVkzUjdSU002UjI4cElLbDY0RG9ieTBpUFB0aWZZTUxPZEwzYmZTR2E5ZndPYUloQVRsWW5uTTliR2dLRmRUNG9zdFpTdUErNkpXT3hKbW4wSG9ETHNFVGRGTDNHbnVleG5Gdkc3VTFFTGpVOWFsVXk5NUdPdWlOb0phTWdmMHE1TUJOcTV4S0dFejM0bTBXTG15bDdQVnAyWTV5QnhHYllUTG94ZWliT3MxbEl6Z1dIUUlBYWFHN21wSkNlWEdhY3k0ZStRTXk3Uk4wQWhEMlVpeWtDNDJBZDFGMThYZ3l6TDNac2hteTV1YjI1ZHlvd0xvYjI3K0lWdUpQeVNFV1F5TFBEUWFZbVBLNHVGUWtGTkRSbkI4VWxSYllCQk9NN3FrWllvQ2RkUXgwM0VHb1V1Yk82WVRXNmNMM0drWnhkeG5MS2JhR01LMkd4Q25US1dMd3NwV3lQNlZETUNjSkRKcDdqUC9FUlZpVHVvSDl1WnNMUk1URWhzNjVEQVNMdStHR1poRnVsRkRpV0FCbklRNUVraHZNeCtWVUc0YVdyQURwU1NkWk9LMklSZEltNVlreXhrV0J0RGxnUUltckVPQ3FsS21Jbk9vZGhBR2pCWnhpSFRvd05KRTRBR2V4RXFxZ0NUUUNFV1lMT2pzVzJTZ3RmQjltMWtKS3lnVE9pK0x3dkw5VHk4d1E4c3gweng3elBRbVRPSUxKcGZPUUZwRU1TTTRsaEdUSEVMVVF3YWVpY0RYZ0drRG9XUXNCQ1ZRQlpTMnA0Y3lBOW9wODE5azl2dllUelAvZ2cweXNhRWRtdUQ4bWY1RUhWbUY4Smhkemt2Ujlod0NISkdZUkdnbWxGc0JWcEZ4RjVLVXhHTHFSa2NFZlNPemhKT2xhWXd1SVdEb1lWR2toMFlMcWxwc0V6cWpuT1ZvRW9mVnBERGpFRElFS21DMFBPampqTGtvaDNCUFNDaWFTSEFGZytOdDhoSk54MmthRnZIbGRRbXdMUHdxNmZ4Z3VXSFVHMWZjS1Ixb0dkV1F3YkZwUGdWYkEzbUR4N2xKbW95TDZXWktvUFliaktYTWdiakVtTHBaamR0RW42MjEycW5Bd2l0dUxES2lEQzdnZnZUTkVVZmVCQVRZR0tCdkVFU2Ftd25sVm05eVpOemxETXZrclppWW1kbkZLMldDbG9GTzhRSVo0Z2syZkhaSG1kOXJQWVpsODVERWdjck1pR2JwYW9pTmUwMXNIQVBFR2tETkRLRCtYcVRvYjliQ2hSRXg2NkdpVnU0bGZXTGpVZ2NZOU9SOW9RT01HUnhydmxKUHYxdVVBRkhjcVlld1pmWGs0YVFzYVVDMkx1dk1JcFVmQkJFWUYvNGFHakR2VkxnWXVHR2JlVStaS3RWZ2NxZ29YSlgwaHQ1SktVZVJ3MWc2K1QrK1hoUnIxYjRGbzc4RFdoWVFZRHAyNUNvTVpSbDFVc2F1ZUlYN1B2QUVJbWQ1ZldSMlFXcG5qTEx3d1FFVGtMbk5MTnBsaDZCSFdUTG5sRVg3VTBCSmNOazhFWlN6akdnR05zNkJFVlhKL2dGaWYrbEVRL0prenRHekdLNmpXRllFaXl1aEVkck9JUGJVRFVyVVd4RkVNWXh5WXVXZ0RJc2lVRVg5OUpJQm5LMnRXQUNIbFJIZGZXWHAwQmNRRVhKbklEZmVXL21KZDNuRm1OcDhxakpZTC9yS1I0ZUFBSTNEWTc0dVExbm9VWkJPVUMyV0xVSUw1MWpnRUhObnZrU08vZzBHQUpQaDJRT01jSzhKMFR6emFhbnhBV2c5YUVCRlNRZ2RSL3k3Nm1WNWRFaG5lamVET1BqTUFzQllSb0h0cTVMOW91dWZQZGd5a3lldk5VVnRIUndmRkowTWl3cGhsNUJEZWxzaXJEWS8vd1lEaEVEV3d2ZTVCQlJzTGNnYmhtN2pQYmlJV0FnTW5aaXlCR3c5NlgwVUk4L3FzeWhVZG1nV1ZmU2Z6blBwTlRaeVNBNm1TeG5NNXY3U2dRbVlUa0VQVlVYaGE4RGxYRDNKZW0wR3lJaHRnUGxEK2d6bVhrVFpwK1ZpcnZlRUt6Y1A4cFhCQUJaWk9lZFYzQzlqbGhseE1obDZ3UUJ5QWttR1BFd1piRDE1WmxFY0hQUktZQXJlZWNieXdRTlp5MG9PNE5zekhUbDFBNjQrcnRldEdIY1dwSzR4UytjbzkwTFBFekorQ1BzdldnZ3BWUUtURVNPd1JEQ1NWUnlMdVlQQkVsSEpQdS9DOEpyUGlnRk03U1NzaXpBYkJua05rMlkwUFY2cGViL3pCZ2tBVmJ4cjhTMDNKUUFWWHFVL2RyMk4vdUZCVENSa014ajBMY0pqbmdkREFvenc3eHArN3pMMmxYVUVrUG8vcW0rbkpKYWxsSkFtTVN6TTJHODlXaGRMN3BjUnNBN0VlUzFLQUplem85dk5OTldjcHdsRXhPdFdDTk4yaUc4cWdjUndRaytuQU84ZlhMM01XTXlPY011NlpFVGdzYlhKTFpJQnNweENVVkl2MFZmdHVGWEtPYW9va2RuZVdLZU0vNzlhOHg2ZFhTWUJwNWw2R1prUmJqT0FuVUlyMW55dVNxTE1CR05BVGt2cEdmUVh2WjdKZno5WTZ3RENGNFNkTGs5WmFBNG5NaUxZOVNpR2w4MmROcmJublpibC9yblo2bm1jT2NjQVZ0eHVGQS9POVhFZ2RnT21TNnZuYVZHUzVqb0RVQUQyK2lxUHN4SUdyTlg0QnV3N0NCMlBHZ2hvZ2RKQVlNbEtON2FOdEpJQm92akwyZUhFV0FHeSt1elZBUENKaTR1bnQ3THFRazJ6eTVyM1NDRWNaUUNZZERScGZwc0JTT05WVDJrSllzcTlLK21HMG9ieUVpdjh5NFAzMVM2QUt3UDhsVXpCRjA5NGE5Y1pRenE5eFFJUlRwNlJjRnJXSTRSeGpuU0duZFdHYVRLcUNnZHlMMlF4Y0Qya1NWQjFyeGFiOGVRYkRPREJUb2Evbmp0Q0NDWWNiSllCcUxYUS82cUNhZUpiRXJXaXJWd0NPTm5sUEMrRkd6WFFHR1IvalFFcThBMTdhd2E0V3ZOK285N2QvREw0ZkgvRkFMd1phQ3lNSml3NmtzMlB2bTRWZnk2ZnI2VGZXVnJNM1p3ald0b0JMUEJwaUVUeXBhWUhHSGNaNTh3OXA2REJENDBTemFkejBBY2lXSTNGWkEyT2dWN2VQVmVsUThmM2pENWJ3RzdndGdaeURDS2xJYVA0TGRjWjRKM2hqb3RHU2UzMklVc3JDdy9CZVJmbEFiT0dNVnNOaU84M0ltc3JDVkFJb3hEcVRoT0FoWklCMnFUbTJCRVgwRnRWREhDMTV2MjRYUXRxdHY4dEJ1QWszNWsraDV5TkN0WE45VmVaUVJsQXhCdFNyRWtIYWVsR0ttZ05LRnpOR09tU0FYTGt5VFVPZy83UTNlYk9CZjIwUGlzejBoWU1FSFZqN0NTSXZDNHNNSDJOZ2FTZy9oV2FwbVlBb3BPQXZ4YTJKUDRhcmdCdHdnU2o4MFhKdzJqa0xJSU9MblNBMksrdmZRVmdka09lZG9zQjZxcm5MQ1ZSOUY2dGVULytnMnB3d3dzNDBkd1lnSDd1VG9zQlZpTXFnVXF6WUlEMEJleWdKL2JXYmdlckdhQ1NBQm1NakIzZndGVTlwdy9rWkptUmxoT2FEQUM4WWR3S0hncFk1dGFScGVpUEdJRFN0TVpmRXlGRkUwNkJ5WFNqVVphdmc0bVZFZ2RnbXBvQnNySXlORWI2RTVJbXYxNEM3Z3Q0K0Nwb1Z0VzgvMk1HQUVEcS9BY1NRQWZXbGNCbW9PVGo3cDJPcWk1TUFCcEp2R0Nta1NzNndNRXVpclFFUFZoMEVpZFk2UUJWUmxvU1RsOE9YeHhEeHR4dnFHVllvRFJMeGFrc2RWK2tHUUhORTlUTmwrQmxpWkZjcUppZVlCVWg3akdEOTVId2JHVktDaTdrc0dMNEp5d2ZuN1hWNTBid1ZNeHRoM1NWQWJiRWdIRjVJWXBVRVRVSDE5dnFtdmQveUFBeStOangvRVFIMk0yNWJyb1NPRElsMEhRQTF4Qm5jRlVEQmlDa2JFUWx3UzRoQ2g4eEZVRUFYeE5tQ0NaRTBwSmVHakxCK0VhV2x6SWo3WXNmR0VFcWM4aXEzRy9iQ2RNa1VOdkxzbXZkR2pkRlVzY2ZKYXEvdFBuNXVFRkxBVnRVSlE5aGs0VDdyOEtkaVF4c0hLRUVCZ2p6MWdLUEExV1dSRjh4QzlFRkE0Z25wbE5acWpGaGtMUHM0QXhRMTd6L1l3YjQ2Qk1nNWZramJ1d0NLTEJ4RUF6UTZlbS9zVWVjN1NORmVyK252SEdXb1dxQnZuUkZ3S2hkTEVNd2hpMGlUVTZZaUxHWE1LbGY2RmlZM3FqaVJ3WklYb0xsU04rQy9UL0xxb0hSd2JpVDhmTHVxMkwvemEzSElyMkJnOG9TYUJxakU0bEtvQTFyUEc0bURCQVpZajdWcW1XUXNUSVhoQTczUjhVQW1KMzVSQXhMNUpWc25HWlZ6ZnMvMXdFYXhaak0zYk5FSHIxdUJ3Z2pRVElBZm1aaUUvTlZySGU5aFV4M0lVN2NsQzRXTmV0bFBjblM4Z3JYbkp1OHZKSWlQRHBEcXluTWFSZHdUNWlDcTUxejRoaEhuVFFkT21vWnRkU1piSVBmWXQwWTl5cHZINU9QdUo4aGtoTkhQTUQ1TW5qLzBLZkIzbmREV0FMbmtmRjBMd3d3OCtMS3JLaExtNmQ4YWVEa2FnWlFaMXlUVDl3VW1XWG42MWhVcTVyM2Y4NEE4UHJDdC94TFM2QWRiTVRVMGpRd1p3bnI5K3M2MTFaalY0UjBzMHNHQ0M1WGlRWnJPbmZCU1UzVEhUL2xERmd5TndsV3RFTmh3TW42emdNRVU3dnRyTUF4RG16V3VQTUFkMElLTFdUalpBMXkzZ2Zkb1RHTzBjdjVLNS9Qa3gzZlJQK29ZMnpDeVUxY3NBVW1NQzdDUW9vaURId0dIZUE5NjRBU0hNQVUrNEdUYXkwQnVxRkJhVTVIOVdqRk5lYVdEZ2FvYTk3L09RT3NwRVYweVU5OUFXTVg4V3Rrbmp6dmtOTjNaM0hPSnMwTSs2UUxpT3FIWklCdzRkSzFCL2Q3Umxxa2wxQmtIcjJxa0tUdStLcEs5dU1GalhMMEIxTTA2THVGLzFndk5QZGhKdEdUbGlBYjNnZmRoNzdYL1haREVFak5RS0hFVFJVeGdSZkIreDRaRWFnWkJCV09pakR3TzFRdWdqOWdRUk16QVUySms3dlFBWHJyTXFvZ29zV2xwVnA5dGViOUgyMERoOE9JTDB0djRQelNHN2lNUFBzeXpURFBsUDZzVzM4a0F6VHc3UFVWcHQzblJNOHE2eUFPOGlDUW1xNi9tTk5MaEM1aDJWeE9LSFlQV2JJZjVTTmt2QWh1VEY4cHdHSUlWY0JjQ3BETnhpb3NEQkRDd3VBR2xDeXc4OUhkMjdIdWQ0YmNZQUxMeVFoYllJbVNPanlqSGJ6UDJDZ0wwR05Zc1VmNExIVWJhSldMWkNaazRBTkNWaUhWZDJoVU1KTUJySUJ4bHhpd1k5YVhxSzBEN1pyM2YxZ1UvT2twZ2tkblA0c0h5UHlGUXBWR3R4M2hYcDFad1Jpcnp6dEVNbjQ5VE5IQnBPTkdISVQzRUdYSXIvY3dybDdqc0d5L0JGNWNBaUVoTkMwa2FIUjIzNGRGU3hqcVZRbk5HRExwdGdzWUd4ZVlRNEpzb2hETkdkMWU5M3RHaUxOUjJtS2FtRW41RWhkQWNyVEtKOHJKRVZMcmtYK0FoOTZwaktxY2pCWkthWHBkYjNmbTVyVk9CK1dWSkJ3RHhKanNNdi9JMVpyM2YxWVYvaVZMc3Ywc0lzamxGVWRmam1VcC9lK012KzV1S2RMV25PZ00vYXdEL0N6ZStqRmlCUUdRemtyQVdaZ2Rod0lJaVhjQTVVenlja0xhK21peVZ4ZklxUEhPNkZoaURqUHkyUEYwN0dabEZnKzdIYUpOUEtwUnVpK1FRZElxaEFLd0pTZ3VPWXRxYWxuNVVPc0ZJTlc3aGc1a2hvQmplTXI2dHBXZ3E3bXdBMVMxWkw0SWlxbXFFVHhlclhtLzlEaVJDd1pnbW92S05UaVdCcFRKOFdjeGdjZFRqSDdVeDVpQUxsYmR5VVo2OHV6UVgxeEswUUVabWloVFlnOXh2d3psVGxoMnBGM284SkFESWZrT2NqUEdoV2ZFSkFPV0NXUjhMaTRBV08vWnNRYzFuZzVOaUJxb3QvY01pYmU0NXFPQmp0NnI0cFlBeENpY0xJUDN2Yndzd0dpRTFXZ2pQQmdNSU90L3hrUEpqYkVMaVBTLzRXb3VMWUZ2VVUzcUIyRnhyWG9rMTJ2ZXoxclY3Y0FBTE5XRXZVMmF6c0FmMGdEanVJd0tua1JVOEZlTy9vZ1Y4ekhNamxyQlNLdk0wK3VsNmVHY1dBRGN0SVA4Z1NaOGRyeEF3cktKR0tIWVZhZ0J5UmtFOVpPZHBBYUVTU1JKb0V6MGdFL1VETEVuOHVUbGpkMUtPSlo4RGxBTWtRMWFmZXg0cmJnbFNtTE9yTkpzQUJnSktRNnNEV0F6UUFjelZJVHVaTmI1WFRLRlJaVmlhRnlWQkhmNG05eUU1YnFnT0RDendhMmE5NmVxdmlVVlR1L1I1NGZ4SElkUm9RK0lqTnU0QURuTTBTZWlxa0t0ZlJHZHFUS1AwTjhFbVFvNUFibXJZRDdhQ0VLeDlrWmhTckhyU0svRVRMRXRDVzVNa3Fic2ZTU1dMQkZOSjNsS1lBNkJHR1RaU3dXNEVlTm0zVVFZZ3RUdkRocVdHK3NodlliRkxiTkdNWGdTNE5HRU1BdjM2dXFTV0J1aHM5SmZHTUNpUWdjUkV5MnpodGorVmtXRmRrbncwK21vTC9lUE5KVUN0Z3ptWkxsYTgzN2ZxbkI3L001eWpWRTZLWW9qelRBbnRBbkc2aW95NkNpSHk5RTNaREFuRkZDZ09rQUUyR0xDT2NpVXVETEkwRVNac2tUdGlZQk9ZS2JLU3NDQjlaUWpMNFMzVGNlR25ESjBZcFIvRHRuTE9RcUtCcDRmTDIvM2NxSWVJYVB4TnNwc2ltSkRYVTZ0Tis4WVk2K3JPZFlwRDFUaXQ1VjlPMmFWY2h0b09VRE55Y3VqQndhSFdCdlEvOTg3cXcvVkFkS0N0VTBOdXBvckdpRXpyWkxnK25SdHhnRVV4Rzg1V2E3VnZEL1ZOYTR4UWRoRDFoV0NFSk5KdUN3cHBjSzBYYzc1aENFa1VINVdvTEFwbkRodnhzVHc2dlZURy94RWx1STYvOXNoY1RpYlFGVFhtRFlPaEFPeTI1OVY0eUZMSWN1L2dMZ0tLUXpVWlJaZVBGV0RnYXVCZXNka2NiN0lMQVBLL1RhOThGWXMxSXpHNG1ZZ1Z3cnlTR01DS3dic0hxdkUyaWdEL1B1dnhnTUFFSUlTK2FCcXBqV0lyUVFPdFV1Q28rRjhvYi9EYzNPeUhFK3RtdmZzalNyM25DQ2NiZXpKeVlLemVRd1pUVndNSnNBUGgvT1JMT3lzT0crODE3RUVyUkpyajFiUCtobDVyRjBzRTZXYnN6NDhkQ2FSZFZIanVXNXZWUG05cWpmL2t2NmlSSDNncnFIZVUzWHhFYVhJbkF5eFhJSXpvdnl4VFVoZEhMSEE0cTI4SEwwMkZEZGp4ckJVNVNLUlVVVDFyMkJnWlpKQVpZRC8zc20zUkZLTERWY1c1QzlvcHhnNjFTWEJUekUxQWJVbFFEd3lKc1RtTUp0dlNLbVk0RmpXM1piSEplWVFOelp0ekFhQ2lIaGNISGt2S2lFREpkaEVzWkhmSWFOR0tWd0I3UXR3N2N0MW56cEdGc3NrNXVtNXRKcW9zR1BOU2ZSbnc0cFdBaDNqcjVlVXdqRGZSdzFVV20xRHBrSnBVcnNPRkdhbE56ZmFXQ2FwQWU5VXhRWm1DMklaRWh0TEJQMFVmWWEyY3dmc2VXNUJjLzlSTThBcGsxcU1JU294czdoamlMbUtBMlZKY0lMeE1haEZpb2dzMGZ4dE9nRWJwNFh2dlRKVkNiYS9KR3dMYy9qOW5WUEU4ckJnb1RNeGlBNHE2OXFnOThtSFVHcFMvVS9RS3E1d3VPNkY1cTlmVEhRdnU0bDVxdE5ubU1Mcm1MSnNickVPSVN1VGtIL0psUTUyWk1BZWJEeVo3b3dsNHVDemY0SUZ0NGN0czlBN2NrMFJTM3dHOWszSWg2ZVB1SlNEQWRLbGwrWWNsd285dXUwWXVoN2IvUzlqQUptNzR4ckd6K1ViVGJpQ2Y5YWwxOHNhNEtkajRxeXpSTFBocU5EQkJzdVlJUW1oeDArOGIwYXVvSUlmZTdpOUllQ1oxOUNMMW13ejcwVnVORlNEZ1dDTTdEeUVEQkswU3F3OUVNNzMxZDdmQ2xManpxMWltVk56aXBhZUV5eDJYZzZ6RjYzMFdVSElpazNkL3RJckRleFlwRG1XTmhpbDUxWisrc0V1RENjd3ZNdmZhcytDZDlZZEdnMVQyK1BwdTF6S3Y3TG93NmU3OU9TQU9jTEMyV3dlSDBkK3pJNWtBTnZaWWhWekdQK3NUS3JqaUdEYXBORGFOY0FMbkhXVWFDWlBycklGN0dwclNVcEc2SU53cGF2Q2pkcTA0aEdrU1RDclpXWWloZ0FkTmhGaGFrQTVOeFhMejJXaFcwSkd0UVZLRWp4VldQL0FTblhOc1RXaGhZd0NUdCtwTXNBM2hoVXU5NklwV2RxbDR4am13YkJrMkZLWmY0MXUzbmVHNGxScDhBOEw1aFlYZWx2bHVjM0pTM1k2OEE2K3I1VGtFRW9lMWhOaFhWdzVua1BzdjlLVkRWNUZlcGovS0FPWWJRdXJtTVA0TjJWYUxmN0pIRExmYU8wYTRJbXp6cnFCTlBDc28zRVUzNW1xWktkRUlGSnlPUzNyd0owZHVzbzF6T0hzU0NhSGNrRjlkR0M4NVNMTFdTWVhDUVZaeVVyRnh6SktQUURmeHZLYXRQT3Z3LzV2MWcvalZnWTFoQ2VuRGdKbExqaDhQSHk4bjVuSW5nd1EwWEdDdE5RekdOb1RjVWUwZzd1Y3B0VCtMQmhBMkE4U0FFVytXZFU2R0dEZGE3eklnRHZEbGRlTHlvK0hlWVQyejQ3c0Rpakw4TW9LOEYveEJsN0MrTXZFZWc1QVl5SlJHNE5XRGZERVdTUFRQeG1BUUY4Mkg4V0lRZFc2T2p3NVFOekFITHFiT2ZPV2UwWVRQRGVUMURMMlJWTXV3M011cjZBK0dNQzRLQlJaNmtHeDlnTk11ckY3K3JLU0pONkE5MElBUklBbkx4a0FZMDAzOHFKTVpHOExid1laVFREYWtNZnBhbmNHWU9qRkM2ZG5HZUtsbFFvc3VqeFFUTExmTVV5U2hBU0RBZkIwZXJRMktONmFSUjk2ODlLbUQ4SGd3VnNPaENNbGpRSCs1NDYrWmpnOUhNOVVwdFlrSXBna1lGSHd1Z1k0MTBUaXJNa0FtTDRJUUdWam1IYVp3SVFPb013VVhJYTJiQnk5bFNsdHNzQnNWRXJVSDZ3bU0xRmhZVUhRVUVFQ21ZQ1FKSkNnUmxrTnNneGNrUVlYMk40R2ZISEpBTlFBTFh3STZaU1p5ZDZvRWZtMFFVRXJmREZrajU1QWhtWkZvUWNHZnJJUWh0bElPOFlBSFVjeG1iR1Ird1ZqQUNFSW1BTytBaXBMSkhRejZDMDhHSW9sbVpQdWlOeU1sTEJDZnpBQUl2b0dEWnpwREtVbGtXd3lFNWVZRFBBUEdTRERnaTFjZ3pocjdFT3J1aE5sV1ljcG9md3ExVFVUcmNXcmVPQlU0OEZ0dkFYTDlxNE56K1gxUlNQdlJjUkY3OWJLQUJiNDZ3d3dTK20zWWlCc3A4RHdBQ1c1bXpQRXUwVFVsU0Y2YlFZSURSQjV6dUhUVEEyM3Fxb0RZdlhoWWgxRmRaMWdBSUp3U1J1T3JtVy9OQWJ3T2U2WkZHMDdSQVpRNWdDa2FHS1ZzTTEwejdwTThyQk0rMXF0QWZ4Zkh1TUs4UC91NFBhUlNRWkp5akNXMGllYkRxQzJCTWlpREVVMXFRNHRVWW05UTRsa3o0aU10WU1iSWRPNEswejRxaWdPUmoxeW9xcGhwUVFpNTNJNEhEdGEvdzNnOGhGV3pZNHRBZmJwSkliS1pZcW1LdDQ1UHlIQ3RDa3BvYjFkTWtDaEFYNDBkR3FqVlpXUiswWWwrWFNsMXloVmdKZ1RyR3hpNjBWa1k5ZGRLeG5BUXBqTTRZamRpMXFDeUFCa0RtMDYxSlIyV3hZa3dUckEyRTZvZ1R3aWZlZFlpbklGK0g5MzlPRnFnSk5IekY5bmdOc1NJSmIxWFNjVHVqTExBdWFBdEtGbFJDN1dqaTFLOXhXVkNPWktQVkRIVnhIVEl6M05jeUo2R3gxUFlxTkFJWUJCWXRXa1R6K3BGNGtVWGg4TGQ3UFArV1NBeTRwRE5RTndhOEd5R0Jib2hrYi9GNVZVUUtvMHhHcU5wY2t4R3cvSkFPd2hIb01NZ09BMk1vRE9jYVpwNWEyWHdRQmdqak8rcU5RUnlXZHkxTk80STkxVnh2c1Y0Rit6QWhrRDRIc1N4ai9VcWZhSEVpRFdIMjBlVnBHMXpiaTFCaWVYRnc1WC91bnBBNTVrSVRGWVNuTXRTZ1lndERRa2dDd1JqWEFBVjAwbU9kckFCa0RxRGVIdHdMY1Y3bVlBZ0NuemdnRVM5Wlk0aldDQTFBQjFRSGVzVzVUaElpYWhpcG1JT0R0aUFPVU9HUTFqc0RzVE9zRUFzMkFBb0ppUTVHWE9XTitDQVFhVzZxSmgwV0l1bGF5WE02ckkvRVgxRWM4c1Y0QmpyQUIzOU9Fai9NVURsdjZVQWJnRFdUZGxWaHB1aWhlOUl1cHRlcDBCMGdlcytvM3JBSkI2dzNKTnFDSUtVd2RZbmZVeExoZ3poMXEzWTJnZEVIOHl3WXFaanhMVk4wY2t5MDZpNGxDLy9MSmtnTkFBb1R3V0dGd3Z3clFFcUFpVXNCbWhzekZoNS9uNmM0VDhHOTdyZ2dINmEvdC8xWjhqanpzWm9Ha1FHNnZhYlVSVkZmWWVDekxQdlg3dUR4WTljRWdhQWJnQ01FWE12T2NGdW4raEE4RDlYak1Bc1ZrTG9wY2p0Skx5MDdmVzZMM0JBUFF5SVU0MlRCWE12TFgyaENhWERJQWZHbkd0WTRKVmMrQkpqb3o5ZW9yajRpN3RGUzZ0Y0RjL1U5bkwwSExhVER1cTRWMW5BR3FBcUpPTG1ub2ZCMnRrZ0FSVXpIZVF4SWkwSEFSTDUrc2JtMXZtem9JQkhwbXhTWlVaa1NENllYNE1tUjdWZk5sVFFTZmNudFZLV1BreEt1bFJqYVlwZ0FjVkYvVlJHd0YwRDBBR2tHTGVyQXlBOGZnSkE5QVFlQW1zUk9TUUN1TkRQYWtNV3ZEQjJqQTNHQUErWU9RYWF5SU5ubFZmMkdYUjZQSHlrZ0VzRFZWZnczWWJnRWNqeVJHNTh1TXo3VFFhQ0RQRG8rUlpDTzZWUzdLOENlUDNzUkdwR01DelJKbkxsVW1DT2xDdDFteGtBTk44UVhITTA3Tng1bVdob1FHV0NaQ2tHTjJOK1JpZ3pLaWlvc3Q5TUFDZWpaMUxNemlyaUFBRDBLZUVvWTVXTFBYSEZBK3NiUDFhcVlCa0FDM20zVXV3ejIwR09DM1JLZ1lJU3ZkMnhLbXo3am9NM1FZdUN0REZkUVpRdDIzVUQ2ZWQxOEw5ZTU0UkE0NkptZ0dZelE5THBRdzR4dVZ6VVRJQVFyZERSR3Q4aFhxSWFRMUd0RGV0amtVZEl1eUhEaFVEOENWVEExeXNJV3NKWDBnWGU2RUVJTW9hMWJpNHA2aHF6Wm1xQnBJVW93dUhCRTBBcXFqSXg2VU5CQlpiTXdFZ0l4WVlBQ3QyTFBQa3hsVDJTMU9BSU55aU9Dek53TWtBS09hZHFMUGJET0FKdWRzTTRCbXk5RW1seWVXOEU3c0F5dkJSanQ5Z0FCODVnS2hTaDBDV0RxeExUNGl5cXhtQUdYUlJxQVFtQUJrWHA1YjdjV3dKb0NhMW5Ga01lOUlmZVI1Vng4NDZSQnE4N3lTckdTQTB3TSt5bGkyYTV4aGRSdmxDOEJCS01tT3l0MEtpYmF1QWZXZkpBSGdMbWdCa3RtTTVwK1h1WkVac0NEcnBudytVQWJ4YzFyTmpNTkRLN1g1aER1NWJ2b2ZLQ0pCTHdJNFdxNTh6Z1BpTkdLNzQ2eFFoOFBxcHEyNFNGU0lucnpjWllQeVk4TXF0K25vamI0RytXdFQ3cUlQS0hSalJNY081Z24vN0JQalNrd3ZFTHIyMUZnbTluRksxUUlsQmZSYjhoNHpyTjl3UjdFcXhZSGxOcWJRQkh0aUk3MDhuOW42V05ubmxJVmhuYVptcFVURmdFaENxdFFSNEJTZEFnYkF4aDR6Q0NHMk5PWVRZRkZTNHp0alN6TDNTU0VmT2RUVUg4L2pucFJFZ0dZQUUrUlVEaUJSaUFNdmxFckNnYWFOQTlIb09uU0x1L3lZREpBUWFKWUFNc1VpWmxCVi9hZ2J3d2k5bUF0REJ3Wm9KQ2FLeEhHNlVVVStYeC9YSWZLRnFBV2lKeHluUW53bC9aQmpUb3NBUmZxUUd1R2JENjArc1dTQmtLQUZtbkZiRnNoOHFRTWtBZURObzVUbTZicm1IZ3dJSmxpeUZZVkdERWlhQTFacnlod3hRT255a3FVa3dWM3Q0N3N4VHpGaVJNQUw4T1FORVVPQ2tuZGJDNjhlWHlCRDYwaTNaeGU4eFFOT1FTV3VPeUpwZk5RTXdxSmVycGc2T01vQ2xueU1ETE1BQW1lK1l0Y3hZaHJXSVU0QkhFcVdNVE94a1FmbmR6anpaaFFhNFFrUEdqUTRhK0J4TG1mczZzT1JoVjgvMTVMM1NZUUVOMWpHNVpJQzUxMkE5Tk9sbm9wRkpIRzdJTFN0TnhSUkVlaXlleUYybXhzU3FJZ0RXQUxET3BSSGdUeGtBT3hFcmZuZXRRcmN1STZ2TWFoRGxxQ2JoRVBWZVMvVFNXZ0tLK3Y3VXAzbVpXdE1YMXdva2F6aGhZSC9scTRHL2JESkRTWWVwTXRnOE1wSmxlSGNacHhEaWQ2Y0JPYTF5bHZQR1RLdnZvUUdDYzh6SzFHUHpCTFJMT2hzKzVTeVd4M2FIMDZ4a0FCZ1QxRHhYTWdEREhWUXlJWk40ZXBwaFpBTDhTUlV0NXFEb203cnMrYlh0S2ZHTERNQm9NV0F4YWlQQTcwZ0E1RUhJVjNSYkJPMm96Z0JsenJ0QkpMdEFMd1J0cHhNTW1sV2lMZFZCTUFBOXdnUGlZZDBWM0lCUXUrQ2ZGZ1BRSW1HYU1WS1J5S2dsTnRHeUtucEwvNDUydCtJVVppejdPZ2RLbEFVY3VMaVJvOGxxTG1wQm9yNDMra1ZENVRLcVUvUU9MZzJaSERHb0NhVVNpTENrRVJMek5OYklBREJDQWtxR09qNklOeHFNRk12b0dmYVppckg2aFlqU3dHSjBKMjRHL3AwbEFMa01SSHJTRmxmMmE3SzFicnJTdUlVQ1p0b0hLRklrc25DN3A3Zmt5cTRvWFZHNVAvM1RmYmVLWkhmMCswU2ViYURUOUZHM0dFRG90bVBrajZZSnl0UlZmWGxDMEdoZFpPTDdQRVNyTVd1SUV1bXhJcDZyOUJHK29WeEdmd05tUURabkFJcHh5bHZQejVxK3JDMnpaT3BpUXVlSC9DNjNlaytxVDF3bVZDVTJDb0N4VjBZY2h0RXp3MDVoRkpqRUx4VEdTQ3dHOUJRZ2dzd085UDl1TUFDOW1peWFuNGtzSTk4RmNyK0JnOXQ1Ync5ZURiWk1rV2k0K0ZGWmZkU3NON0VFdUdrcFNNdXBaTWtSby9Mc3RQUUZNRlc4WWVRN3BpaENDVXhQN3FKc0JRUDBpMVl4Z0pVYldORUZGNFdXc00wSHplbFVldUV1TXh2ZDBCQmxJVy9kenM1alhHWkFVNUhtL0YvM2lRSjRaakhhYjZqN3hmOXNWOHh3NWplRkZOeXJ3aHFiejZ5eVkyN0Q4dGMrd1hHQnhUZ3B2b0dMd0EwR2lFUkRUVStUQ3NYOG0wYitpblZwODNPYkxYT0xlNllLZ3EvUkc4Z3pNSXVmS29Tb0dVQ2gyeVlCYUhidlZPaTB4L1FHRWxyS0dGTVpKZ1NrZG5vMm16dzhyMjZac3FOcXRrQ25wOW54MThzb3RaYmFBNTJ3dnNkWjVYK01SS3JsTGJGeXVKd3VhdE9pdDBEZHhQOFM4TzhRUUNFeDdkV0pJZGdibEF5d2xUSHdCMW5ETXFFbmpLLzNYNFlyU3l6R1ZCckJKbHdFYmpBQUJnUFJWR1dkaTZubnJJVjZrc1djcTl6M25ENEp2a1p2QUxiQkxIN3F3REpFVXdta1o0ZUtDcXR6MU9pMG9GSTRPd2ljRmwrek5LanNaMWZaSnpXRnFLZ3JXNDY4Wlp6Q0thc2xFbi9OR3NPUXA5dy9HRUFiVGlYd1hka1lpMWpMMjhES0thR0VnbmhabytsRDliOVdZQWhFUm9XMGQ4SzdIVVcwTE5vTUNDU0hZS0E1REsxQzJHd0FaU0lEOElLeWF1elBHSUFsR0FLTXovbEg4N3owVjlVb3JHSVNwa2RXZzAzd05ab0R0aTErbEtkcU04d280YWhRMWRQMW5tVmpXVzBycVVSMTVqdWdJbUlxeGpIT0pwS3Jha29TWk5YWVZzMEN3N05hSXZIWEpOaERRQjI4M0JrQ3NmVGw2Z2FaSWEyVXQ0bVZBd2xSaHBiQXQwZitMeUZLTEpxSHMzQ1Q5MXROWnpBb1dqZWhkNG14QStyT1FTUEVSeWM4STAwQllBQUc5MldBeHBRUjFRSEdKenJVOGxkWW1laGVlUDVSN2M0eDAxa05OaEpZVk1IK3hIb1VCWDZ4d0xHT29wNklXN0lZR2JTZVJLZVZWQ0oybFBBdlNEZmt4ZUJzU25KbDAzbU5tN1lhWnhpUlVNQ0xiWlpvbURrT2R2S0NoM3A0UEFhOGpQODVVQlJ0RS9KMm5NQTFiNEtXYTVFMlFZbzBzd04wRDNnMy9nTmVyV3d2eEJoZWZrU0pzb1g0Si8wNTVMV29Dbi93ZzlXU2dobjM3T3FJbGVHcXdQaXMvUHNZZGRheW1ITmRIZFBMVEg0RGZNMWVBamFrdFF0bks4S04zVzhGREErazNkVEZaTXVhbGdiekFUaDBDU0F0c1gwK1FrdVE2NlZGbzdHQmhMUFY1SEZvNkRpcE5DVzBGSVdNbzVhcGx5SmxxNUNpd0tpUkVTcGtIQm5KUDZIQWtSUGRYZUR1Q0lxV0lTUlhzNUcvU2VxV0dLUDJFZkRRSDhTeDBNalpLYzBldVFhOFJJQi9xWTRFcWtxYkEwY3pHeEJzbjU1UTRRZzZCSUxJeTB6cWVJM3IzaW4rUTJjQ3I2Y2JJanJaT3gyajVxdGRubVZqN2FRb3o1dWkwTWdFNFJLRWUzVHlzUlgwMFZyNjlzVHhKWUhBT3pIcEV0RVBKRHlxRTBzakI1TlhaN05BaXBLcENTME5ERncyREZnQ1JNdmtJTGJnRmVvQUVpTlFwY3hHQW1FbHZGQmt5a3dibk9TRStwdUdWcG85OXNFQUlUZnZDM1ZFQ2RvQzQyOU9Qbjk5VmhPeUNRQytZZkJqTHFDK0J1ak1pUUtpWjB1bWtJdmlpcnhBbUkyWFU3TG1TUXJpZkNsRklmOW04ZTJpZERwSXNVRUJ5NUpBb0hKa1Q2Z2JaR2MxNlpoN0J5RHRyKzhvclZ3azJxcVJvcHdYZERCZWFDSGNOSGR6anpjMExCUGQvYUhDQU9DTVV2NlEwTjRnb3BQVTJUSlRmRC9Ud0pvQXlKUlhoZGtqR1NCcUpITXNYUUsxd2ZnekZ2Q2RlVDFvNjhYY3A1U2tHS2ZBajNGWGxZUS8ybW9URC9BSy9vbmx2a0ptbHljRlhsU0pWZnlONkFld08zcndEeFFYVStXalNTY0FqVVFEMW0xQ0EwWk91c2krQllVYWtHTWNUOGpvcGthS1JtWTI3aUdyRmxsUG5aeVpUYW93czc5RytYRWF4T2RGSzB5eS9XeGxwdmlLQVk2elNIcjNxZTJTQWRweU02dGV1ektqS3BIU2xySVlZamdCbzlYZnFzaTVhOHloMVVDNGtnaVhpR29jNEJWK0FlaFdJclB4TjAvU0NneVJjdVl4L3M0Z1dHNEZvaHVFU1BvWTVGWm43aFVDMGRpVWsyNjF5a1JRUUdGNjZtRTNMV2NjRjV2blpoeWJTWEJkdGdMT3dqYVBHcU9GbWYwMVNuT0hSeVJhWmF2L09IaTd5UUFaRHZENS8wbTd3Z0M1YlVtZEJHWFgwZThLNXVhZEd4cWZ6cjZrVlg5SElUTWtNYUE3V0ZXU2R4TGhFbEd0QitoTTh3dXc1YXlRMmZFMzBUb3dubWtzbHp5dlNFQjFQRm1BdlBZZ0gxZ0IrZ242REZndlloblpFN0taWmJ1Y2RPdmVnS25naU1LTTFNTmhRaVNOdkRXb1dpbGN5LzVEdHRLZlJYb21EckdnWHBZZlQ1ZFl0SFV3UU9uUXVNVUFNaVVZTHdiNlgyTUFGNXFwazJBSnBrRWpGRXpOSTZJdHBqT1h0TWY4Vzg2Qy9ZaldITEdqWTl3Um81NUVxQkhWUEFCbkdpQnFIcjlmSWJPelBoT3pWU3BwMUY4RHV5NVQwRUUwWlFqSElBcTBvU3ZwNHhsT2FmeFAra1RtNzV4MENBL2krWkNMSGpya2xkU1NBUWdVUFVUZVYvWm4rK3hYSG0wd0dKQndMVERPU0pxckJ1a1VqOVpPcUp1Ni9TVURSSmFRNXVNbUExQm9VaVhwdXNaUC9UTVVURVgvYXZQcW51RmZ6YjhkZFdHT2tDZjR6alJhTDczQVZhUFhOdjBsaU5OMXIzV0Z6T2Jmb0UrbUxGZTZsTUFOYkxzSW94NllWeUFaWUVFQ2ZSd2MvVUlHeVBZWkRKQ1RqbDZNTkR0Tjcrbk1hRE1BZ2FKYUhJaVZnSmsxancyZThjcWZwZFFjUk1hT29KN2hETGlPSkFNRWlaUWJrOVNsSWZJcUEvQXpRZityREVCSGZPb2tRK3o1R2RuZ0NpWXMrTDdEd09MbUU1MlRrL0RHOUpnL2UvejhLdWhNRXBBVXlRRDBLNXZyaC9ibENwVmxmMWNCYUVvdDRiS1NBVXlyaDd4cmRuSlR5ellha2VnTjZXT3Z4RlUzQ2NRUXNhTFdvOUlIZmt6SFpod0xZRkJ6dUdBQXhCMElIaUJJQ2s4QTI4NVJ1Ky9wMEl6Y3lqcEZxbXBmTEQvKzhsZ3dRTXJvYXIwbzBxLzhsQUZ1U2dCN1JLR1RkSEtKQktRT2VHSURUL2NiM05zOHQ0eXBSaGJ2UmVNUlExNWFGVVZPd2Q0ak9GS2NUeXhNRTYzRkFJalRaSnpXeS9TWERNQWM3Z1VEVUt0WFNEcHFpbW0xem0xR29vTkFxNmliU20yZjlMRzZ2NVpDb0p4MGtSTCt5YjA1RmhUUUwrUk9ucTlQWDBYc0FyTG1XVk1weDZFbzQxb1JRRVVIYUtYWFFUVm92VXl4azF3bXFhLzNwZzdBSEFzL1dRSXFQZk9RZVpZeFFhSTZiczVzdkN0bnQvN1V2K3pBcTQycG40Z0RYcnM0bldlZ2RnZXR4Z21BL2w1VWZQd3JCdmd3TGlzWndMWDZRZDlpYlRWSU5ubk14ckNiMlFYR29lUnNoK1RWVG52U3lSSFA4MkhPZm43NllYNlZBWjZmSElZRkRuTlB3S3VEMERBVWxRUllwUVJJdlE3cDVpa3Y0dWF4azZ5Z1c5ZDd5UUNXem9BUmdiOWdBQ29sVFZhNGowclo0RndQaG1OMTBveU53UWdkNW5ZQWUxOG52RE1DNUVrNHowaHRYN2FTQVFnQjJiRWtlY2tBRHcrWERMQ3dGNXRVREVDdHZ0K0h0OXIzWFh3RUNMUXRzSWUremRHUHNZL0RNSllFVmF4S2xCYlVaWkhnaFg0dkdhQ1cwaVVEbUpNQzErQTRhMjJuRG9BYVN3Uk1sRFRkRFM0aXFLcWRaSkQ2ZWk4WlFHMkoyQVo2UHBPZk1RQmZhT0FWN2lOdEIwVUFidUhWRVJJZklTUkFXbzFJM2UrbFVDQ0VBYnl3ekR6dVBJc0ZIOHRXV2J4djV4QVFHc2FTQWJiU0xobkF3enFUQVVLck56bXFLbnl2WmdEUUowY0lobzU3c216ZmRQZWFvSjcvM0FuS3VoVXlSRmNaUUZvQmdkZ2c4U3VFbjh3VzF6ekc5UzVBaXdHMjRIZ3VwNEFvSjNWeUoxbVMraU42cnpHQXREMmg0L0R0d3hMMGNZTUJLSkk2UmFHYWtwZ2pGd0JRaDZFS3U0cUhlVzdNamJpMUI4OFZRSXpRTXc3TTREOHA0U1NXNmpJWlFCY1NCc0hUamtyYWp0QXVHY0JlcU0wQWpUUW84Sm9DcG1reGdIeGdBVDdWL0lUT3k3NEFpUFpiTVVBQU9mU0NRcjVsVWFCQ1lxQWx1RkZUYWRxSEpDNDMwVUVmYUo5Ui82T2dYaW1ubkRwc05ha1hWM3Y1eSt5MlNIWUkzejRRVkIrWEVzQ1NFakRYZ1JIY1pCSUhCMlNHUEkvQzIvZ3FYd1E4aHZhTlFXK2krWFpSaVIyeGRQRDNjNnhidFRxUmZUVzZlbzNSMzZJRzlza0FBN1lMQnFBRVNnYWdqUlU2b014UVJhdkRyaG9NQUxVK3dhZW5vMzhJZVlrQWpKb0JraGJVY0xDYSsxTmZDNTBCVTdycE14MlJCelVrY3RzR0x5UUF0NWtPbXkybzkyeUpJd2JKQUlUZWg2TW5UbTczSmdORTRuQ1dwa0JrenZxS0wwQVhaekxBVUN0aHBRU0R4Q01XSGlUMWVZN1BjclV3ZG5vS25uUWtoYjYvdm9sYjR6UVQ0NmtGS2RYZ3RPd1NlU2F5a0Fpcll6SkFQMXFiQVNpQmtnSG9xUllkY0cwNklEMHJ6Z0JvS21lY1B2S1Vpd1ZnMzJhQUhGSXZQMWV3SGQ2WGsvVEQycUZQd0JuVGRGRXRKbE9VMkFDMEszak1rRk1zR2txU3NHR3E1Y25YZW1GTnpzVGh5OGlYdUxyR0FGQ2R3UUN3aFhkUzR0R1BaS0hWRE92MUZKVFRRRzVpR21KbGlDQnRTR0JabnhwcDhid0xVUGx5WDNUcENzVWJzUWdJTmY4Qzh0cGlBTnMxcGpEbXJrNkd5K0R6bWl5aEtCSHJCT283K0hSMm5BVWY4OUhLbERlWGdIdU9oajdUMkk1aHViVzFkdDRUK2pPblhnb0FHb0ZxaEx1MHpFY1UxS3ZsVkw1TW1ZdW1JUFd0M3V6MkdoU1Q0VlVHTUk4Rm9hWG5icG1oSTlEUWgva2M4dHpteUxlN3hEcHFZdVlDb0dRTGVtcjdNRmhENWxlNlpJRHMraFM1cWZNWjV0MzNhZ21JZG1nekFDbm5IK1YySGJFQXdlN1dvMlRrSTB4RVl5M1doeER0ejVXTUN3QjhtbTBsTUhmcXBoSlI5Y2FyMVpQVTJzcFRwSGl1d2lCeXByNkw5RUw0bE1xUTczS0tJdU9YaHFEWFRMU2V2Wlc0T0ttMkN3VFZMUWJRS005UDJzSXJOWkpaSGFWSHFRTTZJejkxWVJLMWVmdEtMSG9hZkp4MkxCVjAvQVVESEV5WkNLV3hVQUxaTGhrQWo4OE5XVmgyc1d3QVBrbkpuVG9BWUN1czBBYnEwTlNCNXpKa3AySUFLbjNGanV5VFFnbU9ncG9Cd29FY2xVYzJZVGZ3NUkyL1lnQnRLRFRQTkJ1dG02Y1hOQW5saS8yeXBSbGtaQWd3OFM4L1k0QytJWjViREtBeWt1Z01LeHZFL0dKbHJxUVBWd0hHbnRQWUN0YUYvdGI1RFFhQUtGZFZQRlN4Y2h1SWRvVUJodEJQbXBvQkVLN01mOW9NUUx1TGNmS3l2UUNndmJhc3J6UUVwWmV3N3czcVNZc0JJb1FFOUs4RXdHcG9ZTjFmTGdIemVWSEJhdHAyQnRIeldURUExZjM5c3IwM0NEcXFiLzhtQThCajBhTlNzbUpTTzE2WU9neUVwQzFzOUluUkZrU3FJZTdaNmVrRHBPM1hTd0M3V0thWDFyanFmYVZkWlFDalhza0FPK0NOMUpZR1FOS2d4UUN4cS9VRUJKTklFMUdZVk10SlIxTnc3ZHhKQm5mSmtEckRBMHBkZ1A2V1VkZU5mWVRydDVUQUswazVkbVVGcTl4aWVMdmkrTVdHUDZwdkhhS2xTVkI1OFRMdmNXUUpvOTBCMGRlSjVKY0xLUUpZTWg5cGdXMEJLSXhFTUFOUWd5NFo0T1BqRHhtQXdwaHF3RzFUY0RJQUFXbmMyMXJPTU5NQnNSVWtvcnhnZ0dlM0JOTW15eHYwVnRFcWd0SXk1dmF2MHJsREV3VTB4NUlCRUt5SW1FYjdZS29OTkFKSnF1V0xiYUQ3bXBLbVpSNzdpNENRTXZRaktTd21QMmVBS2dBbEdJQjVNd3VSSEF3Z2xwdTBBekJ6RnBOVUl5cWtsaHpBbXFWSlZJWjV2VWhENEN5REx3STUrK3NsZ0YyWWphRUcvQTREMkFUMk1DZG1EWVFYRU80QTVwUW9HUUJHZWU1bkl5MVFlOFNLU2RjVXFKaGw0ZHlKQklTNlhsVU1nTGgrRk9TcTAzVGFCanE5Y3gvaGZOSDRoem94VjFTeVNOUjh0bVNBa3NLbzJVU1VhRFlqaTlFTVFLM0V3U1FEWUJ5Y0Fjb2xiNGxWN0dMcGlLZ29tRTk2aFJ2bG5WaXFMS0FmZ1hPL1pnQzZnMjFCK1ExMzhDSmRWTTRBNzZxWHdndG9ZbUJvV1dYNENGL1RYZWRMcGE0dE0yOTR4MlpSRWduNjlJSzZteS9URHVOR1BLOFFCQlRCdS9aZGhKeXlqTXVjTFpPamx3VVR2WmJOUGxIejJSeW4yQ2twL0lNQzUva3lDSFdKR0hzQXRSamZZeXM1OGFHbEtYZ1UzazhTK3lvRGNBR2dFekRkZ21VQXBsK1MxVlorZ3dHZVN6WGd0eGlBdGdpY0ZLbWE1VFFoRCsxbzAwaFlDUUtaV1g1UjJsaXFsZ3dRdTNyNng3RnRaSXk2d3c3VEY4RFFKNlp2UnlrMVNnQkEzZ2VSbnZQYkFhSnNXVXUweUdESi9XZ1I0emdxL3NQMEFLbVR3bWhXOUNSYkZtOUJ2TFFqWXFDaUpqNjBZQUJwZGZ6RFZRYlFsNEptU0NjZzYyOHpiTXJpZDNPR1pJM2FvSFpDcVZ0ZFJzNEY4ejBUM1pzTXdPdks0b1dteFlXMWlaTm92ZEtaeEVvRXREODZnZnpQMk5jUHZPVytxWnAwaVlvNUhzMjV3eHlVa1JSazQxSXZwbzE4TENCNVJTRXZIOUF2QWtTak9XWnFWaGRNUk9Fak9ic1ZzT2VoemlRMUtYeEMyeDhkSlpvTnk4Z3hJcmNmMFdwOGFESkFJODBMWXBOZnJ6R0F1NWQ4N2ZlTmxJRThFU1JjemhDcXhNa0FnNFJTdDd1QU8vVEQ1VTN3ZHg3STRvVTY5QzRXWXhLZE85clhzV2NRUU80RXlqL2ZHTEZUTi9abmpGeWlZcXdJb1RUQ0RvazF4STZvS0g4anlJRnZLR1hmWlNrL002RnJJMENVTFdxSm5sb0ZFNC9BUnJHd1hEYUNIVWhxUW8wSVJKcnRzNGhha0J2M1RzWm80ME9UQWJqaVJRd2s5UDFyREJEMjNqNmN0MHhkeDhoR0ZLaXRaNGpYcVAwcVNFRW9kYnRMNTJjY0xtK0N2L05BRmkvMHZ6SERZaElOOFk5WkxSeEFUZ0s5RkFCZktuVnNhVHV0SjEwV2UyVVYwejFoaDhRYW5oSkJDcnNyRzNnbGkza0MyQ2hOb1NzQWlIcnpJbWwxd2NRWm9IVW5oeWRtbzgwSHBDYUI4NDlsV2JteGVQSW1sNFpMZk9qZCtHWVVORXFJWmgya0lZbVdxcjRzQURsdDNlbXpiOCtRL2RGMG9pQkZRcWxiWGJvaGljUGxUZkMzSHlpTEYrSnZGNHN4aVo2SXZGYTVqZndZZ2VxdEFMNGNMYmIwbnNTa2kxMTl3TEt0amk5aGg0bzEzSXlKV3dxa2svVW80WWlDNHp3MEtUejJ5b2gxZTVUL3hzdnNWZ1Z3bjJoUmxCY0ZadEU1SURHdUwvbkh0S3pkK3BheUo1WERLL2pRdS9GdEhNUVAzOHFXbUVJNk9EeHhHOUxybGRwK2U0WlliY3R2S0NJa1JVS3A5MVdYdkg0ZUxtOHlMYStMNG9YbDMwQ1l6amlKckU0dmNHdGZlT3k3RTJpWmZ3cWxLQy9yNldVdGZsZGxSakV6QVpBa05Dci95SXZZZ3djQmlhaGNFZStRUlVTWElRc0M3Ym9zeXlRV2FGRjA1djh5NWJIWHRJNC93bFNoUkN5MGoycDcyTWFIM2kwdmtWRDNSZUhsc2hZaVlkdUp0WkpaQnVScEF1V3djaVdPZXF5Q1JMb2k4MEdTWW9sMWE3a3N1eEpKcWlmblRRcGd0Z0ZHMFloVDQ1UmhjZVVDY2IyMFF1Q2JBUDF1ZUJLeGlvNXZ5eGExMkRGbFM0UTRjYUpZQ3hJQWQzLy9GbndaMEJsRGlNcVB4RThXck05eW9tQllhZ01KK2kzTEpJNEx0Q2c2OGI4dTduSlhyMkc1L0NPTmxSYVU3ZmszS2dOUkd4OTZON3VCaFdUWjVxSWFhaFJyRDZDZmJiTTVHbzRVUjdIbUJGVmpEbUljYzdJWWhoNC9PTzBlSFZadGg0dVRIV2lNS2VhektxZVgzRHFyUUhQcXMvUW9iZUFzMFU2d0ZWNFA2MjBVbWtiNVdzb1BycFVzS09wS21JMFA2WllBT05FUG5oTGo1dEFaUFNTYmJaNWlqcUZjNlNpQ2RWOFIrNEZBWldlWlJCaXdBaTNxdU8zRXdZVmRUOE55TzFHeGdEdGJEWG5TU0paK21mbjNJaTBXR1dCL0RRMk5yU016Vm1ROTVLWFZPQTlzSURUOGxJZW9oNTIwdHpLMG1JTTYzY2cwYjFCeHZLUy8wMFovZ0lQUXlHSFdoWnZzQVV2MldmWG0xSHZqbkdRQ0pabGVxVmViR3FYemt1d2RGZjMzOUk5N3FYbWo5V3ljZ0hnM3hOcHNsek5aWmpUb05tRUJDdFRkRG96YkVETVJQVjBtVWVqU3BCKzZyb3BpZ3RQQ0loQnBvcW95aVFWYWROTEovNVdqUmE0cmh1VXlFeGwyc0F3c25JUUpzb2FTQ2tLbVpnQXZ6NHhtY2hLSkYwQm02SlpSUkJZMHp1TFBLc0x4eS9IZysrOWErZ05USHpXWldad1FKbU1pckorZE5rb056QldoejlIWEdIU1oxQUVsNVE1RW5wSjZrWXpFNjhFT1kyZWQzVnFRbERzRlpIN2FlMFZSVW9yUFBYbENHMkJFcmFEb3hzT3Bzc3lvRUFubUJwYWdzUnltRWJrQjZRdjFlR1ZwVkFZRGMrcWxMVUwxNlNyamxSci9hTmE0anpLSjZmSERFZkhHNVArQ2ZGREVhZFkrdzhXSmJTK1l4dUxQK0w5Z2l3U1RJOXk0Y2dmY3lhNE5lb2ZRaURNcXFLOWRTQ3lHOVkwMnBDcmwyRDUwTmZ4cTYzL0k4eEp6c091VFJiakVFTlpEcDQxT0Q4YUNmQmRhcHFjOGQwcktZcWU5WGJrTWh3R2ZzdENPb2g1c3A5VTlXcFZGYTJaUlVSU1VPak04QkNtcG1CUW5DNHBDUVZMRUlsMjBtTGtGREY4STJNSzRyZGVvdk5GaklpVzY5ZDNldGRhc1M0dFd6cnVtOGNxQnpLMXBVNVE1K1poejJxQVd4QmM1Q01MaWJnZE5ZRnJrT1I3R3JPVU1lRzZrazZqQzMwOWtBR1lmZkFLUk1LTllDRHdUN2l3SkRjVmNDVGdGNWpKM2F5ek0yOW9CTWsrUXo4SE9nSlBGRnIrekpoWWxiVVlyblNzNnVycFQ5bjBtSmdKa1BQT1FyVmhIYWNRYzhacWJ6YVBSb3g2c0VMWGRuVVZyUUdvajZ0eHJwSFFUUk03YWxRZ2IweS93a0dxV0dVV3F1eklhd3dpWURDRFR5NktoK3NnUnZJZ0FVUjV0RmlxRTIxa3ZGK0ozU2dab1dNY284bzZqQXRtblBpWmpSY2NackRYUWZ4alNyRUtGWEpKUWhNZ2RSTituOFFxcmgvOTdwMk1Fd2VtYXlOajBwaWVoSkhzd2pzSkNrR1lCcU5JblJySUVNMkF1Sy9NTjdWdFJrM2szNTByRnRMRE5YTEYzbHBweDBFQXc0UjZzUmtBTkJqcUpseVp0TUtzNHZUSWxvUnoyZXJEd3I5WGRjeTlhUTFRREs0b2laaVJDUkNNdHBkdzNDNHA2ellJc003cDkvUmtES01VQlNwRWF2dmdEdEJiWjdBRFZCbmtYR1poT0JwQlhvQTRRWlJJN2hiZXlzUXBrSHlRcVFTb2I1dUU4OUN0Y0JzdUZ5MVB0WDNpaEliVEIzd3poUi9TR1d3SXhzcUpaSUNzMjZNWTBRTEpHbmkxZkJYU1QzY0NrbVlmZU9TbVJMQUZjaFIxQlljQ054Q2MrQjBGU1E4Nno4RTVqdE9uUDlRZnVhQm55c2s2RGJaQzU1UFdGdkF0MTJqVUgrNE0wTmIrN1VvOGU5dXp1b0J1WUowNUdSenlCVko0RHM2eGRPVWhzaFBZaWVYaFJadlQrcHd6UURNNG9VOGxzcWtRVjVkR3lNbUpVMXV5VXFYODZ5RlBCMm0yWXpTZ1RvN0hPcTNWa0hpOEttQjdLZ0l5czRKWTFaRStNOEVlQXQ4ZGNxUUFBQTJDTUdwRWhRaVFENERPOGVpVVMxWkFWSmxjTTlNMjNaalFVM2RXT0RZVWlocmVrcTl4bTdvQno4RURVbWVqRTVzblhOTEtXbnZuZ1ZKdGFqa3huQUNhRUEyTUx0VmpZaG45a3JJNGVCdGt5MEZySngrNm1GOUdBU1dwUWFOZldsRkd0TVdFL1dRV3VxL3ozU3daQXp2eGhseVZhcGFOOVZLWVliNGhueHZXWi9HdHJOcGVpN05wYW8rWG1RRHNvVVFsVVRaODhpSXBKWGRZUWhyQmdzUkVWRnlYK2pUdDlMQUhLQUJpNnpJcjlZcWtBVldFcFg1U0puZm1qWkFBL0JEdFVGU3dUYzVBMW1ZMVZ3UmJXTFZNTEFMblBQdVcySjMweEJ2Q1VrSkc5R29WdEVFRXUxSnRUeUFGeDdVVnJWQ3hTN2hyamdyVzZpZkJDcjhGY2hvSGF2Zy9WSG9XNUZpVUQ2UDBHOGp5TE1mc3BBK0E2dmVUWFIyc0dNRUVIbGRxOUNwak5Yb0VNUmFFSE9yVlpDS0tJeWtvQjRBRThSYVdpTjZheEtoUUF1ejlEQXNnQWN2TU1Ya2U1YU0xZG9XUXBpalQzcnpKQWxuTy9oeUNPY0RsdVFHSU9yaGNoV1QxVUNoUVRsakhGSjdJUjc3U2hGS0FuaGFXalZ3U05nY1NzUUdBclhsZDdXUTB3Z1pWUnZMakUyamo0UVFXRVo5Wlh0a2N1dGJrMFp3RHB4ZjFFVFZQZXNIM0ovd2tEbUpVS3htRjY2NWptMzJvTE5RaDA3L1VkdFhYeXFDeVVuY2l3M0Z3RGxHRk1XSUJWUWdFSXE2NXZBOVYwQUwwanNtSmozZFBrS0xGV1FXZURGNzFkc2tFUFVUMGdIYXFBMlVlSFZwMlJDdDdWa3JLaXNRQTJBeVQ5aWlQTWxMOVk0SDl3SDQrVzhJQmpaaGk0ckVMeERPclczUTFib3UyY2Rlam1jQ0MrRElRcEpSRmtwTDFRTGhHcDNjdGR3TjluQUZRME04Y2l6UnRMTGxhaThxQW90S0x0ZkZtUEZVRDNIY1VhRUZuMis0MVhDQ0k4MFZTWmpyWFNFUFNtQW4rbEk4dXMySXk0V1BkQ1dZa2FCSmNaKzNYM0RPOURodE5lQzVrZmFBVzllWVFiWW1KQlJna1I0RStNUjRFQmpBakE4dGg5V09OZWdQTUdFZ3VyRmgrVFlVWGwyem5vaE8yU0FjTE44Ukt5Q3BqU3hpV0FiWEpVR2NKVHJZcjUveEVEN0dGalY3T2o1Wm1iR2VGVW5GdkNnME16WjM1Mm1OSUMxRFl2dE1DTVExeXdRTVBTZzBVdFI4cTZ0ODdZSlRBQW5EMU0wd1A3RitwQXFvVWtxQUpPOUJERWk3Sk5NQkZFUVAzQVFUUDExRlFCMEl2THlsTE5sdlNRZGJySUFITnB5ckRhWEFLZ2lCS0IzeDhMYno5bkFIWkhhek1BN2JOUmloNkZMQUF1U3NDeG1XT1pMQWJ6Ny8rS0FSZ3NCSE1aekNoakYrY0xGS09PV1oyWkNrRDdYckVQekJwaFVUbU9ES0NhRTF0VE1ZQ3EwRGw4UWtidTVRdUlDQmVGYTFWN1lPaURIOTF0S1NWc0xpa2pBZ0JGZEdzR0dEQWZXS3RTd2JuVUFWenNXRzNLT1ZGWjBYYVhTMEI3WldpSzJodGJzNWU3RGpBTWUxUG9DNkpsWkxYWSswaWwzZEVwYUwwSlQ0VnUrZGNZNExUSnRSYkJ2cjRSQkcwNkF6VXRjVmJQTWl4M0VMczdUUGVvRVJZcmdETkFQMXJOQUswcW9PT3cwN2NaNE9NYUE1aU53WnhxekkxYUFHZnoxb09HTmt0Y1Z0MFFTbWN3d09VdWdJc0x5MXM2U0t6RGhsVTU5YnJoSkZONlJEZnVJK3FwNWUrTHJkMUtPbU52bDR1VmdrR2NBYkpYQzdvR0F6eHhIeWxzT2ovOFBRWmc4WGxmNkdlK0VmeWtPZGlVY3E4dzZhaG1xbmNVRGI0R3FMZ2pCdHFkRjluT0pRTmN4T3JTVS9kN0RKQVp5bjA5R0JiUStRVFpxQURJcWZsT21sdjFIWm1SdkR2anRHbzdRSVhXR21HYkNacnFqbk9IRERTUTFOeFV3TTdDaWNJSnBEditqcG9SYmUwTDY4QmdWOWdCN2xtbGNHMEp3NWd4VHYzckF5NE1QUWR4WmQwVXpmRHhGeG1BbnhudU9xcjB0dlNBc2IyS05nUE9wWW13RU9KeXFhUXBvQ3ljTVNPOGExU242S1FTZUpVQnpNSDM4SHNNTUswTXc2Z1RWQ2JQZUhSb25BcUFjOC9sVXBxNWxjVHl1cDYyZzB5VURHQ1JYMWxDN254V3E0RlFSS20zNjFVV0gxU3RLc0JXVTlhenN3cFZjK2MrRzFWRmhLRWFWVkV2Kzd5bUxiSHZNc1N4bllmS1FHekpkMmxnN2g5K253RVdQRnJhVjBJaUV3UmdGcmNzTTZjS09Vc1FOZzAzZ1p6bTlBMVBFTVBzbFZhWUVTVEwwQndad0pDTlB0bmpEUWFBVC8veE54a2dNcFRqOGUwUTBpei9LbU9IRmNDbVptQW1ZUWVnN1libVd3WkptQy9BNHozTnp3MUR1NmJWVVR2dVhQMXV0UGpZSG03TjBzK0hoaXFSTFpSS3Y0VjFuOE1UNGRXb0RoNEV6YTFTSDE0ZlVidVRXZVFPVGUwaWd0WkU4N1lxdlVsaVFQY0M0R0hPM25ZVlRVamp0RDU2TElmT3ZNZXd1WnV4cHdBTHlEUXBxaXJPaW96SnIwWnVWbG9Cdll2Q0dlS1RqeENtYlBDTG80TDBGUVpBVU5mdk1nRDFDLzZxR2VBeEMwQ3JhVklOK0hPYm1rR0MvaHB5V01zeHIrM2pBamFoSTBNd0xNc2o2OVEvb0VyOW9BSDFsRlN3QkpJa0lGUlVmVlBBUEN2Y0FDd2UzZHhUMXRXbzNOMjBodDlYVFlKa2NITUhyMHNuc2J4a09wbTlkTGp5SU5NV0R3bndrS2Q0ZkhyVzBhVTBWcTVvbGZQYno5THJodmc2ZExESUZNbU1kNDI2SzU3bS82a3NMYld2QzJld3lrT2RyTDhNQzc5a2dLL3ZQMldBajJzTThQb1dKZUNCRk0wcVU3b3lnUDdhTlllUEhKdnNNRFBNczRWQkJrc2RhYWJVZ3krM3h5bFIxa1RJc2xWUjRhWW5MYnF4aGZKcVZEc1BnamJYOFFpMTNGSzdaSVVVaStQcGRCa21ndEZuS0VPVURnZXIxSlUzR1BERlNzWjBrK3VWUkMyMnl2a0pvZEx2RG14QUFSWjRlZk40UUV4enI1cVFhZjZ6dEpRSFI1YWxOTEwyQWd0dkdQMnZNOENQUDJLQTdYVUdJTUtGbVNQN05nY2gyN2lrdzVQSm1keTNEQ1JwWjJxQllhT0dFZEE3blJHcEo3WUtUb21xS29wWGZkdnZnMzdhdXQ0OUs2dFIwZkZ5UXNoSnhCUTVkR0FHNmNseU83cDBJbEJNSGhlQlppd3o4WTVIVlpVM0JPRkg0c0ZSSDRFeUdVSlp4OVl3N2lVaWJ4UlpVT3l5aGN3ZS91d0JXNnd3eEQrTTVJK0loa1hoakFqeHdmdnlvY1FSN1ZrODh2Y1k0UEVtQXdqQncvUmE2UUJuMjNON2dna3ozYkxLMU1adDArdWR5K0VCYW45R0p0MG1HN1VKaitLU0p2UUI5ZkFuNnlPVmRaR2k2dHUzVjdqWmVqV3JsNnFhbFUwK0JrRXpmTkJvR05BQkMwWDBnbHN5L0ZNbFRCbHF5bkRKVFZtOEpBcUQyUitJOFViQU1TWWhoVEVtWTVTWFlwa2NoeDlPbzBJSHFVdE1BTURuUkFCRnBMcmgvcFRhQ092eXdrVE9oZ3cybnBqWUFmOThLMzZSNVdOL2l3SHlSODBBMUpJOTltd0pHQW0ySzJ1enVubWh4eDVGcUNYUE1ZdlhTdVp5VkFYc0RKZ2lySzZuRVZuR0dNZkpPbU5PdldmU05LTjN0YkhxbXpTakZCVWdHS3U4bWxVVWJucmhlc2dBWXFPaFV4VU5FYkRXSTlOTjdnbktSTEM1TmlkUlhhOUl6K0hmWHV3SUhFQ0VTQzdMR1ZOck96QStLODZIWUM4ay9TeC9RSFJBcENVaWhuRmJ1UldRSHhhOXlod3ZpbDUxK3Y4dkdTQ0RWc3FOcXloclpmSksxRytBVUdXc3JiNndSck5MSjJleWlHbEdYTEtpVHY0SEdVOC9tWVBqb3BhWTFXY1NnWWRJOUt4d3N3R05ObHFNYXhNanJUVGFNRm84UVhTc2tJTHFpazVMTkJDVUxhZmJIdkZ5SUQzb0lqOFQwVlVVQkFPaExMb2xYTDBwaG1jVXltenNaa1UxU2h0SUhoN1lVK2tqZVhWNngveWVHYndLMUo1QTUzQi82NWtoUGhaTzArdGhFMk1HSUpBZkJjVC9BZ1BNR1dhR2VFc1luZWFlVnh4MkFtcEVUMTVsU21lZ29TYWZZazdyRDQyNWhoM3lFZ3lMdldtaVd3UFNNN1dwNWMzK0VzcnpPRWpHRXppZmdCZGhiRHNtRzRHU1dDN2NGVHZUQnJIYUJtVmFNUzMrcERvUXNqWUxncEZRaUc1aFRJdHZ4cTNVSG9SeTJaNHRNaFVuVWQ4b0lxTm5tTVMrMnd1RmsxcnQrTjVOUDZNcXByelhNQUUrQzJsN1lXNkFBcEVjUU9qLyt3eHdLT01CNk8xanZYc20yVHZ0R1hDNVk1TE9ISktuQjR5K0lVWEJBWmdhTG9meFErbVBPWEE1N2tJdzFuZ0w2WXpVU0lsOHpiVjR4Z1U2aVhUS0FvYnN3aUtnWGREZ0dFb0JCQ1YvRzRqM2toTlpUcy9kWDdQY2tPc0l2SWY0c29yUFRqVWFHcUl5S2tLY0lKU2ptZUVDZ3J2REhjZnpNQTVzb0V5SHZRZlRHeitRbjQzeGpHTG5PUGNZVzBuNjBhQnBtbG1VM0lZQjRMLy9CZjJEQWViekZnT0VPU09oUmNrQTd1MkxldmRFUm1NQ200WUc3Z3locUFBLzNYMncvdDRzd0FoRTVEbWtlVXcwYkEyRzlXVU9qVm8zSWJoRXZtYS9selpNSXJuU1Z5QjEwQ01uUVRPeU92UXN1ODdmOUxlM0V6T0FvYmY0UHBXMFZIdTU3YWM1c2FqNXptTnBhbFFRTFZrRGtJSm9BNW83MUt6bjBBRVYyenpBR0dDMytEckZHRVJqTTF3TnhZT21URHJIclJXaDlnMDIyaVlCV0R4ZTZYOEhDL1FvclV4Z2dEcGZSU1lrb1RlODQ3WHJNYkpibUJhdHBBclZibW5vbXdGMlFtRnN1WE4wL3B0MnBOVG1XbDNXSVZ1aWhVWm02bEVVNGN1cTZZWTZJdkkxKzcyNEtRdnZFSmpGSXNiY3lpOEIzRWZnNHlvQ0xQQ1IrUnRDOUVJYlRRbG5oTVJwT1ZPbzhxNGJNKzh5dW9WcEpyRWZYZytLcUlwc2RJVWlPcWRSYXhhaTIzcCtJRkVBOUhKbGVqUGQya1lDaloxNmttQ0dMd3ZmbXhWRk45QjZ4SnhBc3Y0TCtjRUFtOEtFY2MrMEFIVytDZ3l5UjA3d0IwZWIwTUEzMXFXM2xaUnluU0FUdDA0ay9jZHBxZkpxbElrMlJFMi9ZcWR0ZSs4b3dtYzBRbXBpeXUxbjBDMHNjbTc4Z2NVQUpqVTV5Y3VZTzkzUUE1Z0I4eUY1VHRlMXAvUGhJdGplajRhT3c0U3pteXMya2tWdmZTZ1lvSXFOMGZRMHhabHNqS2wwTDVQNUhRWXJjYUhSL2NlMHJDeGY5TzR4bFlqeGRpVlBxQzBCazR3cDV3ZXVBTFl3c2V5SlNvb0VZV2hDN0RSaENFV1F6S1BPVnhFSlNmUUg2MjJ5ZGoyc2pOemJqRlZXaDVac0dFTkFUS21IalFFdE5LUnNQZzlrZkl4NjB0THB0alp5SUlTMkI1djBoRWF3M3I5QnRqUHlYL3ZjSmorTkF1Zk5uRm1iRWRadVFKQTU1b3dGdlNnb2dZV29jdi9pWVJSa2dMWkZ5Z3RHaUVhRkU4ZFhHS0IvbFFHc3V1QzZuNXBVTEFGekFvTWlvbmVnZFNTYUFrREFpajFySnUvQUpHVGU4aTRqYVVGdDBCeGtwdW5SQk42VVBsdW44RDhsQTN5ZllsZUp5WWU4QU5DNWNuZmppcGIrd0JIOGVNZEdLeXNFUTg3SFBua0RhTEJoZzNFSnl0RXhhZWsyN05wTGt0SHdKRmF5Q3BhTHNNdEM3NFgxbU1HUnVwWlphdjhOalAyWUtOcWRheTF3T1o3Q2t0N2loWkFOMlhBaklFSE9jTlYzYVpIbFZsRUt5b3RSSTFzWkN0RDBLSndqdTF1YkFlWUZBMWdZbk9WUmQ2RnVTUTFYK005VFhuRUYwZUpHWjZ3RGtZRFAzd1YrQzBEUk1jRUhycmpKVDh5ZjdkWk5tQ2h2eisxa3d2bUsxRERKQUxZQmZtY2I0d1REZEVhbkpqbVlvbTFtdEZYUmxBSFRDT2FyN1ZqZndRSjdGcXRBVmdqbG5udThqTXh0WXgvNGUrQTJnVTV1T1pzQnFuVFhETVlIbmhtdW1SNEN0NWl6K01iVytJU0pwZGFEaHZDb2REU3VxUU81OUZWekpDT0RQZTV4M25jR2dJdFhLZUZaZlYwTHFsSzA4am94ZE9vL3VkWmlwZ0l6bEF5UTJuYzZoTlZiUlJFRGtxRjFhd1lBVVJXNUJvaWhpWGkrQ3dZbkFGZm1hZ0lYdWlZTWk2WEpVSituMEtCY0V5TjVRd0NnaWNESHFweEYyWFVSVUZHOXJBekswa1NOOHl3MDk2ci9rYWRzQmdPVXF6S0NkWSsvdjRMOHFoWlNhZGhBL09NN2tRU1dWaXNBOE5SZlFDcTZ4LzF3OEt6Wm9EWG11c25wWVRoMmxmWUQ1WXJNQzZvc0FmZHprOVlLVkExZDAwQ0ZnQnI1N1F3UThaY0pwMEZQMmJvUkhhbHBhSnRGTDdUdGdPR1NBZVF4YTRqbUN3YkFzcVMvc3VJNGM1NXhDU0JSWFdWWldRVWwxOGk4bkFKTmFhbTRiY3lHb1JaTFN0ckU2Wi8yUm9pTldjRytRZ0FrQStTZUYwc3J5aVRyN0MwTXluQk9IT21HaEx1S3Bwd0hPbjFOZk1NTWE4b0FuanAyOG5jN3BxTFpwd3hIcU9yQWVxTUdhVVdtZElkME1HQ2trVm5NbnFKZUUrUUFkU091aE91RkI4WWFBeWc3WUdsT2E0VTVFTWtBakhzTUJraEFUWiswdEo3ZU92NHJBWnNhWGxBb2MzTW9CSEkwR0lBWmNtMFhnRWQ0VWpxNmxERXh0SlU1ejNKdGZMSk55NGc0WjlmSU1MbGh0MjRwVWlkU08ybitmVlFmUVdqZVIwaGxwR3NTK3BzQVlJdk1uMjZ4c0ZTSGtSNkczWnJwMnJYdTdrZyt3b3k1ZUVFYksvam0xRkJ2TEVEeVB5ZzJlS1RpUEVKc09yc1ZjcmwyT3RoWStxVHQ5M1FiVzhoTzZUbDdUeFlrUTJMNWZnMmdYdmM5S25KempRRVlBclJJQnJDNHgxRXdBTlJzUEF0MjdhemhzNGlHSnpMRVJEMVltZUZYVkc4aXJybTdsOG1ic1dNdXBnR2JpcTJwazZ6S2VaWkU5ZndWaEd0RG5vZVc5c1d0VkhUQlBRaHFrK1plNjE3bkxQSlc2azlwNlFNcUdFQ3VqVDB2YSttb3RVYTdkVmhnVUFiVHlvMGRwYXViS1hQbmdBTzRZMXJEVXp1eHhHb2I3dTBBTWxXbFBEQThNbU5VK0M0MFdRS29Gam5tcFRjWFR4WGF1MVhQZTZ5NkMzNWp6aWNENk9MZVJOa0tSK0pYREVEeDNvc2xZS3p2dGswR2VHZGRqeDcrZ1JyWURxWGxOdERWRllMTkxaQjd4V2xOKzU3RUZhTWo3TGRiQmpzV3hpa2xtYlJsbWZOc0dVVDFERFpFOFlWR2hza3RCS1V4SmJ0SWJmeHIwMXhPUXBNL3BTa1AvTURmYmZvalF3Z3BhQ3VtWmVWQnR3NXdyMkY4cVhUVDdyWFdUYkRTbjBwSzVLbWZLM2FmNVllNXR3UElWQ090WW1PRUpEWVNCQ0s5Rk8rV1hXWFhxSXBrejJLNWNHREdyQ2RydGxvVjNwRURWcUFVZWxlVWl0YVEzWjRoNlRJZ1R4R2laQUFaNjVJQndKZmdJblFSL2xHSDB1STFJQlFwbldIaFovRnNYUk0zYnVHbnlWK1psbnRwd041TEh3SVNTVXFqdzU4S2VoS1ZlVmU0bDZaR2hyeEhjT1FyQjFSZHBIYlFIRVJIQThuLzh3OWIrb0NpWVF0WHhQWEFHamM3YmJMYjVpQ3l2dmljVXc3SVZBYXNHUTJzcjB3Tjd1V1lYR1VBOHN1UjNCaUpKSlltLzdEVEpzcE82SStDUzlpbksrOW9IVjZpY2N5VWJzUnVIT05NN0hHRFZjR3hFUTQ3Yk9aNk1jTHRtRGFqMzNoQlRoRm5OUU5Fa0dybTRHaUYwbkpPazYxRE9pTmZYNlJzVlNLbmR5KzlnUmhSdXZveHYwZ3ltOGk1LzBxaU1oaGdFelArdU5kMmhCQVhjc3JWeDZLTDFQNG5TSzVOenNOZlFuTDdpYjlKLzJ6bWZ3d0d3TWVZN1ljcXFxbTQ2Rll5TUtQelFMVXZDRjdzam9tZlFybjF3VG1ENUFZOTYxd1BNc3MxMGtJY1BxVnpiZkdRQklNZ2JOQllncVh1bE1OMmx0ckZ0NEZyZVNGaW5MRU41T1p3ME1TbW55QWlCQTh5RTd2dEtSYlNzVERsUFJpZ0h3eEFtR2dua21MV29iU2MwMXpZUWpydnFZQXJpYXZnTzI2L3B0eEd5MEVRZGJQeFdTdzBLeWV5ZGlkUnFiUlJiUk82NXV3Mm1yYTdTRzM4QzFjZmlCNGsxNS9TOGE4MCtvQ3lNZEV0R1dBWW1qbTdWekFvZTlZWHN5cURBMWpqaDhCSzFmT0YyaEFEemJyYytFSXNXUENXKzhjNlNqT1pzbWZMTEVJNG1Obys1MXdwdURFOEtLcllrbFN3WUxWQnBjK1cxNGNSME9qcU5jUkc2TXN3cTAvYnFpQmY0am0rWnhzcWJDd1lIakRSYmlSU2pGRGFuTk94cFhZS003Umd5bW1OakdqVzBKR1NHejdRME1RUmp1Y1RlVyt0RnVSY0liNXJlWTYvYlVhemgxMVYreGRTL2w5di8wWDdGLytaQzVEMFovT3NuMkFBbDNXUEdETnJVWHhnUXJtT0tNOEZLMzNESlBmK3dxMmVpb0ZGSzJYR1duSFZvUmpjdjNJcGJ5eDYyMzBabWpGY2JKOVpNWmNid3lqL3liMDhNUHlzTGtmblkyZkhmbHpLa0Uvc3AwZWxYVkUvSkhOOFUySGp6OHlHbVVreGw5ZGlkblJxcG5UbUJrdjlISmpXWHo1eFp5UTBKYmVhUkZNUjV5eU9pWnpkU1ZRbzdoNjVrMnM0L2ZpVTZWVlgyWlRPUm5lUy9ILys1My9ROHo5Qi9td2NXS3YwcXZ2ZHRGVnpCNHpHbVdNZVN3WFVmSkQraklNQS9ia01GQXdndnlnQU1LcUFpbkFwNzN1UWVDQTFGTGZZZ3c1QTJ4MGFyYXhrVktWWkpEa3hQOFl3KzVtQzdOVXkreUVoSXowTHBHemtyNHFRRElUa1JqYk10MHlLcVNic3FtR1NmNVhTK2Y4bjcyeGI0Z2lDSUJ3U0FTRVNDTDdsSUJ3WUR3SW45Ly8vWHFiN3FicWEyZnNVUkJDdGpYdHVhUUNzN2RsK205NFNxQjN3UFdaTjhMWHZyeUpLUk5SRjA4VVRQeTZHREkyaytTYnJ1U0dUaGdrVlJIUGhOQ1EvRGZSM3lMOGdmMnJ0SGsxV0VucUpnOGxCMXZQL21UZTkxbCs0YTZSNUF0eE5nL01HMVM1QWhRZTEybnVtVEwrTFZBNFpDYjNhKzMzckYrbGk3d0szU2F1S2hEVHk5cXFLdHVGVDYvZG96OVFXQlNiWXpaMnlES250K2dZZkttUU9TODRSeFEvTDZ1eDFlNDYyRGdpOXFMdTE0Z0tHSEQ2cXlvZEQzNnpuZW9hM2VTL1VDblErYlFYUDl4YzNRT1A1dnM1TDMwK1FpUW5lMC9Ia080QndzWTMvQ1hjdm96UDdGaUE4Y0lLdG50QjMvZHBIN1lKbFJCOTdndkg0ZHRqN0kwYzZEd1k4OXB1YUJhbkpvc0xUN2VOS0ZoVklCQzZGYnpUQk9BNGI1UXdYTy9wTThNVnoySEFyclZablZHMzkrSllMZkxzNkRVVGNhRm9ma1RHR0RHMFVMN2N0Ni9sUnhvMDVYMURCbC85QzJXa2VBUmljKzM0Q3VjYVUzL0gvZkFjNEVYUmZyODFWUHBDYXBaT0FkL1V6N1lEVHlJWEhVZThZcDFiYlF6b0x1SnA2QndOZ0UwVmFSbTZ5c1lVN1lQQTM0ZTJYTVU2NnJnODRaMGpyQ2Nad3JPeE1SdTNXVWo1SXBzbWNjMWh4Wk1hVUhXNGwydEtCZ2h0MWl4dVFaaVdpK2FhQlBwczVUczl3WU9OZXFWZWdGTjA0Z1U3WlBpNUk2cVgxMS92ZTA0Q1dKTUMxeG1lN0RGRHQvNTVLSUgvaGFnenowYUJQdDJ5UkVLUFBHOEtnWXpZRDkxdlh0c1pvQzQvaFR2RjB1MTg0WjYyc0poaUxLOWhiMi9OS0NENFRxT1hJS28zQzhjZldhTXVIRUhIcjU4aHJHYkZqcytpcGMyR2NvM2doVWkvVTYxRHgzb0RDUVBlaHV1K0hqT3hYWEdQWDBYc1NYM21DeTF0UGt3YWsxMTQ5K2RkRWlMOTBBNmpCLy92SU1YZ3c2ZFNuMzdzb3ZJb0hQNU03NWZTYm9oWmgxSWJITDNOb2haRE9qRGNnNGV5dEpRQkxNczFLK3hSM0cvUEdaR0ZpdnNLZ1dibFJ0M1ZGVWpTMWlCWWRxU2UwMmFQdjIwSVpIeWVDY0l2Yzk5TnlWejVOcmpHdndicXRtVzRkQzFDQ1lZdHdDZ0c4V1dIdlZvQXViWTJ0UXZSZTZkVW9ZOVMrUnhNZldMU2RFRXQwYlRqZERSRHQvQURXazlwOC9MSUlXVXdvWWl0eGY3ZUowem5jMXVHVFpjYldiYk9yNS8waWxmczYyaUp1SFBHZ1dMNmdBNjdmSHJWeFlrNEZFL0RTVHpDbmd0czFWcGFsOU84Mk5BYjhha2hBU29HZCtFZ3pVTmNFcmp6R2lNS0cya0x4NVZpMGs5cUdPRVArOTRXQk9vemE4bXZlcEJDQjY0RDBvOXlYalNXNEJpODVvU3FXYlp2RmhqRnJybXk3SWxBM3FyNDNERHZkYlBMZVBhaWZRSzFvMmwxUWFqbkxVa1hBYnFMdEVkOGFFekkxQXhBRXV3R2NuWGdhQjYvMEdIcXpTVkc1N3F6YVRVendTdTVEQ25VWU5kUHdjOTRrVVRUYTFrZTRYRjdtMG80MlpaL3F3SUlsc1ZXOXRHcSszajFTRG5ibFM2K003V2F1ZW9hVHVhL1pPcFNEMVlsQ0pQNk5nV2JaNVpwMklFeVJrRm0zUUMvNFhRWkRiQVNYczdVa3hFeHNEVDZIZEhVK0pMeTBoUVg4R2t3NFFtdWt0dnNXeE5xeFpaMFdRLzQ0T0J3eVJPWkhkY3crdVA2ay9VamE0N0VieHF0T0ZQeUJ1UXJtL2tDdDFwZ29NcW96cUYvYWt6SVlLYkxMTmR2L2RiWDNaRWxpb1lta1F5ZFBadGlBUTlRL2NiQmNya0I5MnpLbmp3cVVwdkpWaHMzdTBYS3R0Q1BSZXp3d1dweUQ4Z2RjQlNNeFRzY1pYdmk4RXJPOC84bUNYMXhBYldQSmh5VzZYZzBiOGViSE1XRlVhUFBiSkFseEZUQUpWelNXdmdMNVB3ZTZkMHlWTC9iS2x4SGpoTTN0eE9PYUJ6ZlZMNHdlWVAxWis5SEx1czdWYk1wZ1FYNDFjRHdkQXZVRmJGb0tsWEJiUG43WlM1S2lpN1JOSnREaUVqaC8rb213dnBCTFFkYzVERXNUdzI0T3kzUnJCTFFUVy82c3hMb0ZzdUJqM29HVVRjb2tCSVp0YnJWU2FZU09LMjhXL0d2dkRGWWJpR0VnYWdodG9hZWtsM2FocDF3S1lmdi92MWRrV1g2YVFDK0Z3SnJxT1JmN2FsdnhXcU54QzZKdkRlaitXMHg4cEZ4Q0VJU2pFSmZwSTFYaUIzL0FkMnpNcVlmWUNBTVM4QU5pTmpjbWtkalFmK1c1bCtPWFlmUXZVMW5Zb1U3YUtRUkIzdmNVaTFtUDVaZG4vZE1memxRZDNzaFlzQVJTd0dleXAwQ0JDekh1VElUSFJlWENhOGhnM2dTZjgwT3pwb1o5WllDWHlCeXRPNDVJekJJSVNGMHl0YjljaUxIWkh6cjNoZXR2MWFvQVFaQVJNdDJjRlZMUnREZ1AzUGE5QlNOdktRR2Z5KzRqYk95aUsvQS9hS1BnaGVKVjVEMHBMNnhsRTNmV0UzdURiMUpleHVFK3I0cXUzQU1wZERmRUNkZGdBVHhOTUoveENBQjhneUZJT3hxMUFKNGhMNEJPRnZnWmxMMGgyWGwzVzAyc0o0Qi9lS01kanNJZjZRUXJVM3pCd2taZnhqV2k1cDVUWWRocWZtSTlzUVlGc25Bd2tWYzJzVUxnTitpdUcwanhzTlhFZTJRRkNncERCTnZNMk5qSjYvaU9sYnE1am5ZMnl3UDYvSysyQUFxdmROTE52RzNaeURJRWZxZkE4cnJJTEpOb2h5UEFDaFFVaDRKdlpuR1lENEhmNUxLNVJBODhEN2hXQUNoUUJBbGQwNUZIWGVEM0ZpT2JGMFhkaWVheG50amJTaFMybGFWZGg3blhOZnBENEdjaldoU1YrVXJXRXd0Ui9BQnR3elltK0l4U2x3QUFBQUJKUlU1RXJrSmdnZz09YDtcbiAgcmV0dXJuIGltYWdlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm50KCl7XG4gIHJldHVybiBgaW5mbyBmYWNlPVwiUm9ib3RvXCIgc2l6ZT0xOTIgYm9sZD0wIGl0YWxpYz0wIGNoYXJzZXQ9XCJcIiB1bmljb2RlPTEgc3RyZXRjaEg9MTAwIHNtb290aD0xIGFhPTEgcGFkZGluZz0yNCwyNCwyNCwyNCBzcGFjaW5nPTEyLDEyIG91dGxpbmU9MFxuY29tbW9uIGxpbmVIZWlnaHQ9MTkyIGJhc2U9MTUyIHNjYWxlVz0zMDcyIHNjYWxlSD0xNTM2IHBhZ2VzPTEgcGFja2VkPTAgYWxwaGFDaG5sPTAgcmVkQ2hubD00IGdyZWVuQ2hubD00IGJsdWVDaG5sPTRcbnBhZ2UgaWQ9MCBmaWxlPVwicm9ib3RvXzAucG5nXCJcbmNoYXJzIGNvdW50PTE5NFxuY2hhciBpZD0wICAgIHg9NjM2ICAgeT0xNDM4ICB3aWR0aD00OCAgICBoZWlnaHQ9NDkgICAgeG9mZnNldD0tMjQgICB5b2Zmc2V0PTE2NyAgIHhhZHZhbmNlPTAgICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yICAgIHg9NTc2ICAgeT0xNDM4ICB3aWR0aD00OCAgICBoZWlnaHQ9NDkgICAgeG9mZnNldD0tMjQgICB5b2Zmc2V0PTE2NyAgIHhhZHZhbmNlPTAgICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMyAgIHg9NDUwICAgeT0xNDM5ICB3aWR0aD01MSAgICBoZWlnaHQ9NDkgICAgeG9mZnNldD0tMjUgICB5b2Zmc2V0PTE2NyAgIHhhZHZhbmNlPTQwICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0zMiAgIHg9Mjk4NyAgeT0xMjQyICB3aWR0aD01MSAgICBoZWlnaHQ9NDkgICAgeG9mZnNldD0tMjUgICB5b2Zmc2V0PTE2NyAgIHhhZHZhbmNlPTQwICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0zMyAgIHg9MTcxNCAgeT03NjkgICB3aWR0aD02NiAgICBoZWlnaHQ9MTYzICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTQxICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0zNCAgIHg9MTk5OSAgeT0xMjYzICB3aWR0aD04MSAgICBoZWlnaHQ9ODcgICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTUxICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0zNSAgIHg9MTIxNCAgeT05NTEgICB3aWR0aD0xMzYgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTUgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTk5ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0zNiAgIHg9MTYxMCAgeT0wICAgICB3aWR0aD0xMjIgICBoZWlnaHQ9MTk2ICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PS00ICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0zNyAgIHg9MTM0MSAgeT01OTUgICB3aWR0aD0xNTIgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTExNyAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0zOCAgIHg9MTY1OCAgeT01OTIgICB3aWR0aD0xNDEgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTk5ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0zOSAgIHg9MjA5MiAgeT0xMjYzICB3aWR0aD02MiAgICBoZWlnaHQ9ODUgICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTI4ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD00MCAgIHg9MTAzICAgeT0wICAgICB3aWR0aD05MCAgICBoZWlnaHQ9MjEzICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTAgICAgIHhhZHZhbmNlPTU1ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD00MSAgIHg9MCAgICAgeT0wICAgICB3aWR0aD05MSAgICBoZWlnaHQ9MjEzICAgeG9mZnNldD0tMjIgICB5b2Zmc2V0PTAgICAgIHhhZHZhbmNlPTU2ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD00MiAgIHg9NjY0ICAgeT0xMjk0ICB3aWR0aD0xMTQgICBoZWlnaHQ9MTE0ICAgeG9mZnNldD0tMjMgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTY5ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD00MyAgIHg9MCAgICAgeT0xMzE3ICB3aWR0aD0xMjggICBoZWlnaHQ9MTI5ICAgeG9mZnNldD0tMTkgICB5b2Zmc2V0PTM0ICAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD00NCAgIHg9MTkxNiAgeT0xMjY0ICB3aWR0aD03MSAgICBoZWlnaHQ9ODggICAgeG9mZnNldD0tMjIgICB5b2Zmc2V0PTExMSAgIHhhZHZhbmNlPTMxICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD00NSAgIHg9MjMzICAgeT0xNDU3ICB3aWR0aD04OCAgICBoZWlnaHQ9NjAgICAgeG9mZnNldD0tMjIgICB5b2Zmc2V0PTc0ICAgIHhhZHZhbmNlPTQ0ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD00NiAgIHg9MjgyOCAgeT0xMjQ1ICB3aWR0aD02OCAgICBoZWlnaHQ9NjUgICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTExMiAgIHhhZHZhbmNlPTQyICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD00NyAgIHg9MCAgICAgeT00MjkgICB3aWR0aD0xMDkgICBoZWlnaHQ9MTcyICAgeG9mZnNldD0tMjMgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTY2ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD00OCAgIHg9MjM5MiAgeT01ODMgICB3aWR0aD0xMjIgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD00OSAgIHg9MTEyICAgeT0xMTQzICB3aWR0aD05MyAgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTEgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD01MCAgIHg9MTQ0MyAgeT03NzIgICB3aWR0aD0xMjYgICBoZWlnaHQ9MTYzICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD01MSAgIHg9MjY2MCAgeT01NzUgICB3aWR0aD0xMjEgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD01MiAgIHg9MTc5NCAgeT05NDMgICB3aWR0aD0xMzIgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMjEgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD01MyAgIHg9NTM5ICAgeT03NzkgICB3aWR0aD0xMjEgICBoZWlnaHQ9MTY0ICAgeG9mZnNldD0tMTMgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD01NCAgIHg9NDA2ICAgeT03NzkgICB3aWR0aD0xMjEgICBoZWlnaHQ9MTY0ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD01NSAgIHg9MjA4MiAgeT05NDEgICB3aWR0aD0xMjcgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTkgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD01NiAgIHg9MjUyNiAgeT01ODEgICB3aWR0aD0xMjIgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD01NyAgIHg9MTU4MSAgeT03NzEgICB3aWR0aD0xMjEgICBoZWlnaHQ9MTYzICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD01OCAgIHg9MjM4MyAgeT0xMTEzICB3aWR0aD02NyAgICBoZWlnaHQ9MTM0ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTQzICAgIHhhZHZhbmNlPTM5ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD01OSAgIHg9MzcyICAgeT0xMTQwICB3aWR0aD03MyAgICBoZWlnaHQ9MTU2ICAgeG9mZnNldD0tMjIgICB5b2Zmc2V0PTQzICAgIHhhZHZhbmNlPTM0ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD02MCAgIHg9NTM5ICAgeT0xMzA3ICB3aWR0aD0xMTMgICBoZWlnaHQ9MTE5ICAgeG9mZnNldD0tMTkgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTgxICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD02MSAgIHg9MTY4OCAgeT0xMjY5ICB3aWR0aD0xMTUgICBoZWlnaHQ9OTMgICAgeG9mZnNldD0tMTMgICB5b2Zmc2V0PTUxICAgIHhhZHZhbmNlPTg4ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD02MiAgIHg9NDExICAgeT0xMzA4ICB3aWR0aD0xMTYgICBoZWlnaHQ9MTE5ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTg0ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD02MyAgIHg9ODAwICAgeT03NzkgICB3aWR0aD0xMTMgICBoZWlnaHQ9MTY0ICAgeG9mZnNldD0tMTkgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTc2ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD02NCAgIHg9MTQyMSAgeT0wICAgICB3aWR0aD0xNzcgICBoZWlnaHQ9MTk2ICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTE2ICAgIHhhZHZhbmNlPTE0NCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD02NSAgIHg9MjcwOCAgeT03NTIgICB3aWR0aD0xNTAgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMjMgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD02NiAgIHg9MjIyMSAgeT05MzkgICB3aWR0aD0xMjcgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTEwMCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD02NyAgIHg9MTgxMSAgeT01OTIgICB3aWR0aD0xMzcgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTUgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD02OCAgIHg9MTY1MCAgeT05NDYgICB3aWR0aD0xMzIgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTEwNSAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD02OSAgIHg9MjQ5NiAgeT05MzQgICB3aWR0aD0xMjIgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD03MCAgIHg9MjYzMCAgeT05MzIgICB3aWR0aD0xMjAgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTg4ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD03MSAgIHg9MTk2MCAgeT01OTAgICB3aWR0aD0xMzcgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTUgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTEwOSAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD03MiAgIHg9OTE2ICAgeT05NTUgICB3aWR0aD0xMzcgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTExNCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD03MyAgIHg9Mjk2ICAgeT0xMTQyICB3aWR0aD02NCAgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTAgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTQ0ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD03NCAgIHg9MjcyICAgeT03OTAgICB3aWR0aD0xMjIgICBoZWlnaHQ9MTY0ICAgeG9mZnNldD0tMjEgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTg4ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD03NSAgIHg9NzY3ICAgeT05NTUgICB3aWR0aD0xMzcgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTEwMCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD03NiAgIHg9Mjc2MiAgeT05MjYgICB3aWR0aD0xMTkgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTg2ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD03NyAgIHg9MjE5NyAgeT03NjUgICB3aWR0aD0xNjMgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTE0MCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD03OCAgIHg9MTA2NSAgeT05NTIgICB3aWR0aD0xMzcgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTExNCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD03OSAgIHg9MTUwNSAgeT01OTQgICB3aWR0aD0xNDEgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTExMCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD04MCAgIHg9MTkzOCAgeT05NDMgICB3aWR0aD0xMzIgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTEwMSAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD04MSAgIHg9MjIyMiAgeT0yMDcgICB3aWR0aD0xNDEgICBoZWlnaHQ9MTgzICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTExMCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD04MiAgIHg9MTM2MiAgeT05NDkgICB3aWR0aD0xMzIgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTEgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTk5ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD04MyAgIHg9MjEwOSAgeT01ODggICB3aWR0aD0xMzIgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTk1ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD04NCAgIHg9NjE3ICAgeT05NTUgICB3aWR0aD0xMzggICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMjEgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTk1ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD04NSAgIHg9MTI4ICAgeT03OTIgICB3aWR0aD0xMzIgICBoZWlnaHQ9MTY0ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD04NiAgIHg9Mjg3MCAgeT03NDkgICB3aWR0aD0xNDcgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMjIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTEwMiAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD04NyAgIHg9MjAwMiAgeT03NjcgICB3aWR0aD0xODMgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMjAgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTE0MiAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD04OCAgIHg9MzEyICAgeT05NjYgICB3aWR0aD0xNDEgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMjAgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTEwMCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD04OSAgIHg9MTU3ICAgeT05NjggICB3aWR0aD0xNDMgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMjQgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTk2ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD05MCAgIHg9MTUwNiAgeT05NDcgICB3aWR0aD0xMzIgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTk2ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD05MSAgIHg9NjU4ICAgeT0wICAgICB3aWR0aD03OSAgICBoZWlnaHQ9MjAyICAgeG9mZnNldD0tMTMgICB5b2Zmc2V0PS0yICAgIHhhZHZhbmNlPTQyICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD05MiAgIHg9Mjk0NSAgeT0yMDQgICB3aWR0aD0xMTEgICBoZWlnaHQ9MTcyICAgeG9mZnNldD0tMjIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTY2ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD05MyAgIHg9NTY3ICAgeT0wICAgICB3aWR0aD03OSAgICBoZWlnaHQ9MjAyICAgeG9mZnNldD0tMjQgICB5b2Zmc2V0PS0yICAgIHhhZHZhbmNlPTQyICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD05NCAgIHg9MTU3MCAgeT0xMjcxICB3aWR0aD0xMDYgICBoZWlnaHQ9MTA1ICAgeG9mZnNldD0tMjAgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTY3ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD05NSAgIHg9MCAgICAgeT0xNDU4ICB3aWR0aD0xMjEgICBoZWlnaHQ9NjAgICAgeG9mZnNldD0tMjQgICB5b2Zmc2V0PTEyOCAgIHhhZHZhbmNlPTcyICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD05NiAgIHg9MjYyMiAgeT0xMjU4ICB3aWR0aD04MiAgICBoZWlnaHQ9NzEgICAgeG9mZnNldD0tMjAgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTQ5ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD05NyAgIHg9MTU4NSAgeT0xMTIxICB3aWR0aD0xMTkgICBoZWlnaHQ9MTM2ICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTg3ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD05OCAgIHg9Njc3ICAgeT00MTggICB3aWR0aD0xMjEgICBoZWlnaHQ9MTcwICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD05OSAgIHg9MTQ1MyAgeT0xMTIzICB3aWR0aD0xMjAgICBoZWlnaHQ9MTM2ICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTg0ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMDAgIHg9MTIwOSAgeT00MTMgICB3aWR0aD0xMjAgICBoZWlnaHQ9MTcwICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMDEgIHg9MTMyMCAgeT0xMTI1ICB3aWR0aD0xMjEgICBoZWlnaHQ9MTM2ICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTg1ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMDIgIHg9MTg2NiAgeT00MDggICB3aWR0aD0xMDEgICBoZWlnaHQ9MTcwICAgeG9mZnNldD0tMjAgICB5b2Zmc2V0PTYgICAgIHhhZHZhbmNlPTU2ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMDMgIHg9MTM0ICAgeT02MTIgICB3aWR0aD0xMjEgICBoZWlnaHQ9MTY3ICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMDQgIHg9MjYyNyAgeT0zOTUgICB3aWR0aD0xMTYgICBoZWlnaHQ9MTY4ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTg4ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMDUgIHg9MTA1MCAgeT03NzYgICB3aWR0aD02NyAgICBoZWlnaHQ9MTY0ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTEyICAgIHhhZHZhbmNlPTM5ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMDYgIHg9MTMyNyAgeT0wICAgICB3aWR0aD04MiAgICBoZWlnaHQ9MTk4ICAgeG9mZnNldD0tMzAgICB5b2Zmc2V0PTEyICAgIHhhZHZhbmNlPTM4ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMDcgIHg9MjQ5NSAgeT00MDEgICB3aWR0aD0xMjAgICBoZWlnaHQ9MTY4ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTgxICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMDggIHg9Mjc1NSAgeT0zOTIgICB3aWR0aD02NCAgICBoZWlnaHQ9MTY4ICAgeG9mZnNldD0tMTMgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTM5ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMDkgIHg9MTk3MyAgeT0xMTE3ICB3aWR0aD0xNjggICBoZWlnaHQ9MTM0ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTE0MCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMTAgIHg9MjE1MyAgeT0xMTE1ICB3aWR0aD0xMTYgICBoZWlnaHQ9MTM0ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTg4ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMTEgIHg9MTE4MSAgeT0xMTI2ICB3aWR0aD0xMjcgICBoZWlnaHQ9MTM2ICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMTIgIHg9MjY3ICAgeT02MTEgICB3aWR0aD0xMjEgICBoZWlnaHQ9MTY3ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMTMgIHg9NDAwICAgeT02MDAgICB3aWR0aD0xMjAgICBoZWlnaHQ9MTY3ICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMTQgIHg9MjI4MSAgeT0xMTEzICB3aWR0aD05MCAgICBoZWlnaHQ9MTM0ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTU0ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMTUgIHg9MTcxNiAgeT0xMTIwICB3aWR0aD0xMTcgICBoZWlnaHQ9MTM2ICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTgzICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMTYgIHg9NDU3ICAgeT0xMTQwICB3aWR0aD05NSAgICBoZWlnaHQ9MTU1ICAgeG9mZnNldD0tMjQgICB5b2Zmc2V0PTIzICAgIHhhZHZhbmNlPTUyICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMTcgIHg9MTg0NSAgeT0xMTE3ICB3aWR0aD0xMTYgICBoZWlnaHQ9MTM1ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTQzICAgIHhhZHZhbmNlPTg4ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMTggIHg9Mjc3MiAgeT0xMTAwICB3aWR0aD0xMjIgICBoZWlnaHQ9MTMzICAgeG9mZnNldD0tMjIgICB5b2Zmc2V0PTQzICAgIHhhZHZhbmNlPTc4ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMTkgIHg9MjQ2MiAgeT0xMTEzICB3aWR0aD0xNjMgICBoZWlnaHQ9MTMzICAgeG9mZnNldD0tMjIgICB5b2Zmc2V0PTQzICAgIHhhZHZhbmNlPTEyMCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMjAgIHg9MjYzNyAgeT0xMTA2ICB3aWR0aD0xMjMgICBoZWlnaHQ9MTMzICAgeG9mZnNldD0tMjIgICB5b2Zmc2V0PTQzICAgIHhhZHZhbmNlPTc5ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMjEgIHg9MCAgICAgeT02MTMgICB3aWR0aD0xMjIgICBoZWlnaHQ9MTY3ICAgeG9mZnNldD0tMjMgICB5b2Zmc2V0PTQzICAgIHhhZHZhbmNlPTc2ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMjIgIHg9MjkwNiAgeT0xMDk3ICB3aWR0aD0xMTcgICBoZWlnaHQ9MTMzICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTQzICAgIHhhZHZhbmNlPTc5ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMjMgIHg9NDU4ICAgeT0wICAgICB3aWR0aD05NyAgICBoZWlnaHQ9MjAyICAgeG9mZnNldD0tMjAgICB5b2Zmc2V0PTMgICAgIHhhZHZhbmNlPTU0ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMjQgIHg9MjQ1MSAgeT0yMDYgICB3aWR0aD02MSAgICBoZWlnaHQ9MTgzICAgeG9mZnNldD0tMTEgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTM5ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMjUgIHg9MzQ5ICAgeT0wICAgICB3aWR0aD05NyAgICBoZWlnaHQ9MjAyICAgeG9mZnNldD0tMjMgICB5b2Zmc2V0PTMgICAgIHhhZHZhbmNlPTU0ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xMjYgIHg9MjM3OCAgeT0xMjU5ICB3aWR0aD0xMzggICBoZWlnaHQ9NzkgICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTY1ICAgIHhhZHZhbmNlPTEwOSAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xNjAgIHg9NTEzICAgeT0xNDM5ICB3aWR0aD01MSAgICBoZWlnaHQ9NDkgICAgeG9mZnNldD0tMjUgICB5b2Zmc2V0PTE2NyAgIHhhZHZhbmNlPTQwICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xNjEgIHg9MjE3ICAgeT0xMTQyICB3aWR0aD02NyAgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTM5ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xNjIgIHg9MTM0MSAgeT00MTMgICB3aWR0aD0xMjAgICBoZWlnaHQ9MTcwICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTI1ICAgIHhhZHZhbmNlPTg4ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xNjMgIHg9MTMwMCAgeT03NzQgICB3aWR0aD0xMzEgICBoZWlnaHQ9MTYzICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTkzICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xNjQgIHg9NzAyICAgeT0xMTI5ICB3aWR0aD0xNDkgICBoZWlnaHQ9MTQ5ICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTMwICAgIHhhZHZhbmNlPTExNCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xNjUgIHg9NDY1ICAgeT05NTUgICB3aWR0aD0xNDAgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMjIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTk3ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xNjYgIHg9MjM3NSAgeT0yMDYgICB3aWR0aD02NCAgICBoZWlnaHQ9MTgzICAgeG9mZnNldD0tMTMgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTM4ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xNjcgIHg9MjA1ICAgeT0wICAgICB3aWR0aD0xMzIgICBoZWlnaHQ9MjAyICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTk4ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xNjggIHg9MjcxNiAgeT0xMjUxICB3aWR0aD0xMDAgICBoZWlnaHQ9NjUgICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTEyICAgIHhhZHZhbmNlPTY3ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xNjkgIHg9OTk1ICAgeT01OTkgICB3aWR0aD0xNjEgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTEyNiAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xNzAgIHg9MTM2OCAgeT0xMjczICB3aWR0aD05OSAgICBoZWlnaHQ9MTA5ICAgeG9mZnNldD0tMTMgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTcxICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xNzEgIHg9MTEzMSAgeT0xMjc3ICB3aWR0aD0xMTAgICBoZWlnaHQ9MTEwICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTU0ICAgIHhhZHZhbmNlPTc1ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xNzIgIHg9MjI1MSAgeT0xMjYxICB3aWR0aD0xMTUgICBoZWlnaHQ9ODEgICAgeG9mZnNldD0tMTUgICB5b2Zmc2V0PTY1ICAgIHhhZHZhbmNlPTg5ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xNzMgIHg9MTMzICAgeT0xNDU4ICB3aWR0aD04OCAgICBoZWlnaHQ9NjAgICAgeG9mZnNldD0tMjIgICB5b2Zmc2V0PTc0ICAgIHhhZHZhbmNlPTQ0ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xNzQgIHg9MTE2OCAgeT01OTcgICB3aWR0aD0xNjEgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTEyNiAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xNzUgIHg9MzMzICAgeT0xNDQ4ICB3aWR0aD0xMDUgICBoZWlnaHQ9NTkgICAgeG9mZnNldD0tMTUgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTczICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xNzYgIHg9MTgxNSAgeT0xMjY4ICB3aWR0aD04OSAgICBoZWlnaHQ9ODggICAgeG9mZnNldD0tMTUgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTYwICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xNzcgIHg9ODYzICAgeT0xMTI5ICB3aWR0aD0xMjEgICBoZWlnaHQ9MTQ3ICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTI5ICAgIHhhZHZhbmNlPTg1ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xNzggIHg9ODk5ICAgeT0xMjg4ICB3aWR0aD05NyAgICBoZWlnaHQ9MTExICAgeG9mZnNldD0tMTkgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTU5ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xNzkgIHg9NzkwICAgeT0xMjkwICB3aWR0aD05NyAgICBoZWlnaHQ9MTEyICAgeG9mZnNldD0tMjAgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTU5ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xODAgIHg9MjUyOCAgeT0xMjU4ICB3aWR0aD04MiAgICBoZWlnaHQ9NzEgICAgeG9mZnNldD0tMTUgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTUwICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xODEgIHg9ODY2ICAgeT01OTkgICB3aWR0aD0xMTcgICBoZWlnaHQ9MTY2ICAgeG9mZnNldD0tMTMgICB5b2Zmc2V0PTQzICAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xODIgIHg9Mjg5MyAgeT05MjMgICB3aWR0aD0xMTAgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMjAgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTc4ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xODMgIHg9MjkwOCAgeT0xMjQyICB3aWR0aD02NyAgICBoZWlnaHQ9NjUgICAgeG9mZnNldD0tMTMgICB5b2Zmc2V0PTYyICAgIHhhZHZhbmNlPTQyICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xODQgIHg9MjE2NiAgeT0xMjYxICB3aWR0aD03MyAgICBoZWlnaHQ9ODIgICAgeG9mZnNldD0tMTUgICB5b2Zmc2V0PTEyOCAgIHhhZHZhbmNlPTQwICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xODUgIHg9MTQ3OSAgeT0xMjcxICB3aWR0aD03OSAgICBoZWlnaHQ9MTA5ICAgeG9mZnNldD0tMTUgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTU5ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xODYgIHg9MTI1MyAgeT0xMjc0ICB3aWR0aD0xMDMgICBoZWlnaHQ9MTA5ICAgeG9mZnNldD0tMTUgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTczICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xODcgIHg9MTAwOCAgeT0xMjc3ICB3aWR0aD0xMTEgICBoZWlnaHQ9MTEwICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTU0ICAgIHhhZHZhbmNlPTc1ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xODggIHg9MjU0MiAgeT03NTggICB3aWR0aD0xNTQgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTExNyAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xODkgIHg9MjM3MiAgeT03NjAgICB3aWR0aD0xNTggICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTEyNCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xOTAgIHg9MTEyOSAgeT03NzYgICB3aWR0aD0xNTkgICBoZWlnaHQ9MTYzICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTEyNCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xOTEgIHg9OTI1ICAgeT03NzcgICB3aWR0aD0xMTMgICBoZWlnaHQ9MTY0ICAgeG9mZnNldD0tMTkgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTc2ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xOTIgIHg9MTYyICAgeT0yMjUgICB3aWR0aD0xNTAgICBoZWlnaHQ9MTkyICAgeG9mZnNldD0tMjMgICB5b2Zmc2V0PS0xNiAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xOTMgIHg9MzI0ICAgeT0yMTQgICB3aWR0aD0xNTAgICBoZWlnaHQ9MTkyICAgeG9mZnNldD0tMjMgICB5b2Zmc2V0PS0xNiAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xOTQgIHg9MCAgICAgeT0yMjUgICB3aWR0aD0xNTAgICBoZWlnaHQ9MTkyICAgeG9mZnNldD0tMjMgICB5b2Zmc2V0PS0xNiAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xOTUgIHg9MTM1OSAgeT0yMTAgICB3aWR0aD0xNTAgICBoZWlnaHQ9MTkwICAgeG9mZnNldD0tMjMgICB5b2Zmc2V0PS0xNCAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xOTYgIHg9MTgxNCAgeT0yMDggICB3aWR0aD0xNTAgICBoZWlnaHQ9MTg4ICAgeG9mZnNldD0tMjMgICB5b2Zmc2V0PS0xMiAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xOTcgIHg9MTAxNiAgeT0wICAgICB3aWR0aD0xNTAgICBoZWlnaHQ9MTk5ICAgeG9mZnNldD0tMjMgICB5b2Zmc2V0PS0yMyAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xOTggIHg9MTc5MiAgeT03NjkgICB3aWR0aD0xOTggICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMjYgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTE1MCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0xOTkgIHg9MTE3OCAgeT0wICAgICB3aWR0aD0xMzcgICBoZWlnaHQ9MTk4ICAgeG9mZnNldD0tMTUgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMDAgIHg9MjkyMiAgeT0wICAgICB3aWR0aD0xMjIgICBoZWlnaHQ9MTkyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PS0xNiAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMDEgIHg9NjQxICAgeT0yMTQgICB3aWR0aD0xMjIgICBoZWlnaHQ9MTkyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PS0xNiAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMDIgIHg9Nzc1ICAgeT0yMTMgICB3aWR0aD0xMjIgICBoZWlnaHQ9MTkyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PS0xNiAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMDMgIHg9MTk3NiAgeT0yMDcgICB3aWR0aD0xMjIgICBoZWlnaHQ9MTg4ICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PS0xMiAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMDQgIHg9MTAxOCAgeT0yMTEgICB3aWR0aD04MiAgICBoZWlnaHQ9MTkyICAgeG9mZnNldD0tMjcgICB5b2Zmc2V0PS0xNiAgIHhhZHZhbmNlPTQ0ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMDUgIHg9MTExMiAgeT0yMTEgICB3aWR0aD04MiAgICBoZWlnaHQ9MTkyICAgeG9mZnNldD0tMTEgICB5b2Zmc2V0PS0xNiAgIHhhZHZhbmNlPTQ0ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMDYgIHg9OTA5ICAgeT0yMTMgICB3aWR0aD05NyAgICBoZWlnaHQ9MTkyICAgeG9mZnNldD0tMjcgICB5b2Zmc2V0PS0xNiAgIHhhZHZhbmNlPTQ0ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMDcgIHg9MjExMCAgeT0yMDcgICB3aWR0aD0xMDAgICBoZWlnaHQ9MTg4ICAgeG9mZnNldD0tMjggICB5b2Zmc2V0PS0xMiAgIHhhZHZhbmNlPTQ0ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMDggIHg9MCAgICAgeT05NjkgICB3aWR0aD0xNDUgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMjIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTEwNyAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMDkgIHg9MTUyMSAgeT0yMDggICB3aWR0aD0xMzcgICBoZWlnaHQ9MTkwICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PS0xNCAgIHhhZHZhbmNlPTExNCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMTAgIHg9MjE4NCAgeT0wICAgICB3aWR0aD0xNDEgICBoZWlnaHQ9MTk1ICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PS0xNyAgIHhhZHZhbmNlPTExMCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMTEgIHg9MjAzMSAgeT0wICAgICB3aWR0aD0xNDEgICBoZWlnaHQ9MTk1ICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PS0xNyAgIHhhZHZhbmNlPTExMCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMTIgIHg9MTg3OCAgeT0wICAgICB3aWR0aD0xNDEgICBoZWlnaHQ9MTk1ICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PS0xNyAgIHhhZHZhbmNlPTExMCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMTMgIHg9Mjc2OSAgeT0wICAgICB3aWR0aD0xNDEgICBoZWlnaHQ9MTkzICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PS0xNSAgIHhhZHZhbmNlPTExMCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMTQgIHg9MTIwNiAgeT0yMTAgICB3aWR0aD0xNDEgICBoZWlnaHQ9MTkxICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PS0xMyAgIHhhZHZhbmNlPTExMCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMTUgIHg9Mjc5ICAgeT0xMzE2ICB3aWR0aD0xMjAgICBoZWlnaHQ9MTIwICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTQwICAgIHhhZHZhbmNlPTg1ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMTYgIHg9MjY1NSAgeT0yMDYgICB3aWR0aD0xNDMgICBoZWlnaHQ9MTc0ICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTEwICAgIHhhZHZhbmNlPTExMCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMTcgIHg9MjYyNSAgeT0wICAgICB3aWR0aD0xMzIgICBoZWlnaHQ9MTk0ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PS0xNiAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMTggIHg9MjQ4MSAgeT0wICAgICB3aWR0aD0xMzIgICBoZWlnaHQ9MTk0ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PS0xNiAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMTkgIHg9MjMzNyAgeT0wICAgICB3aWR0aD0xMzIgICBoZWlnaHQ9MTk0ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PS0xNiAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMjAgIHg9MTY3MCAgeT0yMDggICB3aWR0aD0xMzIgICBoZWlnaHQ9MTkwICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PS0xMiAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMjEgIHg9NDg2ICAgeT0yMTQgICB3aWR0aD0xNDMgICBoZWlnaHQ9MTkyICAgeG9mZnNldD0tMjQgICB5b2Zmc2V0PS0xNiAgIHhhZHZhbmNlPTk2ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMjIgIHg9MjM2MCAgeT05MzkgICB3aWR0aD0xMjQgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTk1ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMjMgIHg9MTIxICAgeT00MjkgICB3aWR0aD0xMjcgICBoZWlnaHQ9MTcxICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTcgICAgIHhhZHZhbmNlPTk1ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMjQgIHg9MTYwNCAgeT00MTAgICB3aWR0aD0xMTkgICBoZWlnaHQ9MTcwICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTg3ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMjUgIHg9MTQ3MyAgeT00MTIgICB3aWR0aD0xMTkgICBoZWlnaHQ9MTcwICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTg3ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMjYgIHg9MTczNSAgeT00MTAgICB3aWR0aD0xMTkgICBoZWlnaHQ9MTcwICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTg3ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMjcgIHg9NTMyICAgeT02MDAgICB3aWR0aD0xMTkgICBoZWlnaHQ9MTY3ICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTExICAgIHhhZHZhbmNlPTg3ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMjggIHg9MjkyNiAgeT01NjkgICB3aWR0aD0xMTkgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTg3ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMjkgIHg9MjUyNCAgeT0yMDYgICB3aWR0aD0xMTkgICBoZWlnaHQ9MTc3ICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTEgICAgIHhhZHZhbmNlPTg3ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMzAgIHg9OTk2ICAgeT0xMTI5ICB3aWR0aD0xNzMgICBoZWlnaHQ9MTM2ICAgeG9mZnNldD0tMTkgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTEzNSAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMzEgIHg9MTk3OSAgeT00MDcgICB3aWR0aD0xMjAgICBoZWlnaHQ9MTY5ICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTg0ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMzIgIHg9MTA3NiAgeT00MTUgICB3aWR0aD0xMjEgICBoZWlnaHQ9MTcwICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTg1ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMzMgIHg9OTQzICAgeT00MTcgICB3aWR0aD0xMjEgICBoZWlnaHQ9MTcwICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTg1ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMzQgIHg9ODEwICAgeT00MTcgICB3aWR0aD0xMjEgICBoZWlnaHQ9MTcwICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTg1ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMzUgIHg9Mjc5MyAgeT01NzIgICB3aWR0aD0xMjEgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTg1ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMzYgIHg9NzcyICAgeT02MDAgICB3aWR0aD04MiAgICBoZWlnaHQ9MTY3ICAgeG9mZnNldD0tMjkgICB5b2Zmc2V0PTkgICAgIHhhZHZhbmNlPTQwICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMzcgIHg9Mjk3MCAgeT0zODggICB3aWR0aD04MiAgICBoZWlnaHQ9MTY3ICAgeG9mZnNldD0tMTMgICB5b2Zmc2V0PTkgICAgIHhhZHZhbmNlPTQwICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMzggIHg9NjYzICAgeT02MDAgICB3aWR0aD05NyAgICBoZWlnaHQ9MTY3ICAgeG9mZnNldD0tMjkgICB5b2Zmc2V0PTkgICAgIHhhZHZhbmNlPTQwICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yMzkgIHg9MCAgICAgeT0xMTQzICB3aWR0aD0xMDAgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMzAgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTQwICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yNDAgIHg9MjgxMCAgeT0yMDUgICB3aWR0aD0xMjMgICBoZWlnaHQ9MTczICAgeG9mZnNldD0tMTUgICB5b2Zmc2V0PTUgICAgIHhhZHZhbmNlPTk0ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yNDEgIHg9MCAgICAgeT03OTIgICB3aWR0aD0xMTYgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTExICAgIHhhZHZhbmNlPTg4ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yNDIgIHg9MjYwICAgeT00MjkgICB3aWR0aD0xMjcgICBoZWlnaHQ9MTcwICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yNDMgIHg9NTM4ICAgeT00MTggICB3aWR0aD0xMjcgICBoZWlnaHQ9MTcwICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yNDQgIHg9Mzk5ICAgeT00MTggICB3aWR0aD0xMjcgICBoZWlnaHQ9MTcwICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yNDUgIHg9MjgzMSAgeT0zOTAgICB3aWR0aD0xMjcgICBoZWlnaHQ9MTY3ICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTExICAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yNDYgIHg9MjI1MyAgeT01ODMgICB3aWR0aD0xMjcgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yNDcgIHg9MTQwICAgeT0xMzE3ICB3aWR0aD0xMjcgICBoZWlnaHQ9MTI4ICAgeG9mZnNldD0tMTkgICB5b2Zmc2V0PTM0ICAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yNDggIHg9NTY0ICAgeT0xMTI5ICB3aWR0aD0xMjYgICBoZWlnaHQ9MTUzICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTM0ICAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yNDkgIHg9MjExMSAgeT00MDcgICB3aWR0aD0xMTYgICBoZWlnaHQ9MTY5ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTkgICAgIHhhZHZhbmNlPTg4ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yNTAgIHg9MjIzOSAgeT00MDIgICB3aWR0aD0xMTYgICBoZWlnaHQ9MTY5ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTkgICAgIHhhZHZhbmNlPTg4ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yNTEgIHg9MjM2NyAgeT00MDIgICB3aWR0aD0xMTYgICBoZWlnaHQ9MTY5ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTkgICAgIHhhZHZhbmNlPTg4ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yNTIgIHg9NjcyICAgeT03NzkgICB3aWR0aD0xMTYgICBoZWlnaHQ9MTY0ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTg4ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yNTMgIHg9NzQ5ICAgeT0wICAgICB3aWR0aD0xMjIgICBoZWlnaHQ9MjAxICAgeG9mZnNldD0tMjMgICB5b2Zmc2V0PTkgICAgIHhhZHZhbmNlPTc2ICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yNTQgIHg9ODgzICAgeT0wICAgICB3aWR0aD0xMjEgICBoZWlnaHQ9MjAxICAgeG9mZnNldD0tMTMgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTkyICAgIHBhZ2U9MCAgY2hubD0xNVxuY2hhciBpZD0yNTUgIHg9MTc0NCAgeT0wICAgICB3aWR0aD0xMjIgICBoZWlnaHQ9MTk2ICAgeG9mZnNldD0tMjMgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTc2ICAgIHBhZ2U9MCAgY2hubD0xNVxua2VybmluZ3MgY291bnQ9MTY4Nlxua2VybmluZyBmaXJzdD0zMiAgc2Vjb25kPTg0ICBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9NDAgIHNlY29uZD04NiAgYW1vdW50PTJcbmtlcm5pbmcgZmlyc3Q9NDAgIHNlY29uZD04NyAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9NDAgIHNlY29uZD04OSAgYW1vdW50PTJcbmtlcm5pbmcgZmlyc3Q9NDAgIHNlY29uZD0yMjEgYW1vdW50PTJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD00NCAgYW1vdW50PS0xOFxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTQ2ICBhbW91bnQ9LTE4XG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9NjUgIGFtb3VudD0tMTNcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD03NCAgYW1vdW50PS0yMVxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTg0ICBhbW91bnQ9Mlxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTk3ICBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD05OSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTAwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTEwMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xMDMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTExIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTExMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xMTcgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTE4IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTEyMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xOTIgYW1vdW50PS0xM1xua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTE5MyBhbW91bnQ9LTEzXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTk0IGFtb3VudD0tMTNcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xOTUgYW1vdW50PS0xM1xua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTE5NiBhbW91bnQ9LTEzXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTk3IGFtb3VudD0tMTNcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yMjQgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjI1IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTIyNiBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yMjcgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjI4IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTIyOSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yMzEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjMyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTIzMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yMzQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjM1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTI0MiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yNDMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjQ0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTI0NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yNDYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjQ5IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTI1MCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yNTEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjUyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTI1MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yNTUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTgxICBzZWNvbmQ9ODQgIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04MSAgc2Vjb25kPTg2ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODEgIHNlY29uZD04NyAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTgxICBzZWNvbmQ9ODkgIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04MSAgc2Vjb25kPTIyMSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODIgIHNlY29uZD04NCAgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTgyICBzZWNvbmQ9ODYgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04MiAgc2Vjb25kPTg5ICBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9ODIgIHNlY29uZD0yMjEgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTkxICBzZWNvbmQ9NzQgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD05MSAgc2Vjb25kPTg1ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9OTEgIHNlY29uZD0yMTcgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTkxICBzZWNvbmQ9MjE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD05MSAgc2Vjb25kPTIxOSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9OTEgIHNlY29uZD0yMjAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9MzQgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9MzkgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9OTkgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTEwMCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD0xMDEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9MTAzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTExMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD0yMzEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9MjMyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTIzMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD0yMzQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9MjM1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMDcgc2Vjb25kPTk5ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTA3IHNlY29uZD0xMDAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9MTAxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMDcgc2Vjb25kPTEwMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTA3IHNlY29uZD0xMTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9MjMxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMDcgc2Vjb25kPTIzMiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTA3IHNlY29uZD0yMzMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9MjM0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMDcgc2Vjb25kPTIzNSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTE2IHNlY29uZD0xMTEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTExNiBzZWNvbmQ9MjQyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMTYgc2Vjb25kPTI0MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTE2IHNlY29uZD0yNDQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTExNiBzZWNvbmQ9MjQ1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMTYgc2Vjb25kPTI0NiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTE5IHNlY29uZD00NCAgYW1vdW50PS0xMFxua2VybmluZyBmaXJzdD0xMTkgc2Vjb25kPTQ2ICBhbW91bnQ9LTEwXG5rZXJuaW5nIGZpcnN0PTEyMyBzZWNvbmQ9NzQgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMjMgc2Vjb25kPTg1ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTIzIHNlY29uZD0yMTcgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEyMyBzZWNvbmQ9MjE4IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMjMgc2Vjb25kPTIxOSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTIzIHNlY29uZD0yMjAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MzQgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTM5ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xMTEgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjQyIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTI0MyBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yNDQgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjQ1IGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTI0NiBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD02NSAgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTkyIGFtb3VudD0tOVxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTE5MyBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xOTQgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTk1IGFtb3VudD0tOVxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTE5NiBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xOTcgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9OTkgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTEwMCBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xMDEgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTAzIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTExMyBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yMzEgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjMyIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTIzMyBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yMzQgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjM1IGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTEwOSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xMTAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTEyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTI0MSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD05NyAgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjI0IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTIyNSBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yMjYgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjI3IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0zNCAgc2Vjb25kPTIyOCBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yMjkgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTE1IGFtb3VudD0tNlxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTM0ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0zOSAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTExIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTI0MiBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yNDMgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjQ0IGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTI0NSBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yNDYgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9NjUgIGFtb3VudD0tOVxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTE5MiBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xOTMgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTk0IGFtb3VudD0tOVxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTE5NSBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xOTYgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTk3IGFtb3VudD0tOVxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTk5ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xMDAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTAxIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTEwMyBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xMTMgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjMxIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTIzMiBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yMzMgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjM0IGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTIzNSBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xMDkgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTEwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTExMiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yNDEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9OTcgIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTIyNCBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yMjUgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjI2IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTIyNyBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yMjggYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjI5IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0zOSAgc2Vjb25kPTExNSBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9NDQgIHNlY29uZD0zNCAgYW1vdW50PS0xM1xua2VybmluZyBmaXJzdD00NCAgc2Vjb25kPTM5ICBhbW91bnQ9LTEzXG5rZXJuaW5nIGZpcnN0PTQ2ICBzZWNvbmQ9MzQgIGFtb3VudD0tMTNcbmtlcm5pbmcgZmlyc3Q9NDYgIHNlY29uZD0zOSAgYW1vdW50PS0xM1xua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTExOCBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0xMjEgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjUzIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTI1NSBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD02NyAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9NzEgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTc5ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD04MSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjE2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTE5OSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yMTAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjExIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTIxMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yMTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjE0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTg1ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yMTcgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTIxOSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yMjAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MzQgIGFtb3VudD0tOVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTM5ICBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0xMTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjQyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTI0MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yNDQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTI0NiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD04NyAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9ODQgIGFtb3VudD0tMTBcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0xMTcgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTI1MCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yNTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjUyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTEyMiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTg2ICBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD04OSAgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjIxIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD02NiAgc2Vjb25kPTg0ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NjYgIHNlY29uZD04NiAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTY2ICBzZWNvbmQ9ODkgIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD02NiAgc2Vjb25kPTIyMSBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9NjcgIHNlY29uZD04NCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9ODQgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTg2ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD04OSAgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9MjIxIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTY1ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD0xOTIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9MTkzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTE5NCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD0xOTUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9MTk2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTE5NyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD04OCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9NDQgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTQ2ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9NjggIHNlY29uZD05MCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MTE4IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTEyMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yNTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjU1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTExMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yNDIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjQzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTI0NCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yNDUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTg0ICBhbW91bnQ9Mlxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTExNyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yNDkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjUwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTI1MSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yNTIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9OTkgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTEwMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0xMDEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MTAzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTExMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yMzEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjMyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTIzMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yMzQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjM1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD03MiAgc2Vjb25kPTg0ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzIgIHNlY29uZD04OSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTcyICBzZWNvbmQ9MjIxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MiAgc2Vjb25kPTY1ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03MiAgc2Vjb25kPTE5MiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03MiAgc2Vjb25kPTE5MyBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03MiAgc2Vjb25kPTE5NCBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03MiAgc2Vjb25kPTE5NSBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03MiAgc2Vjb25kPTE5NiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03MiAgc2Vjb25kPTE5NyBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03MiAgc2Vjb25kPTg4ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03MyAgc2Vjb25kPTg0ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzMgIHNlY29uZD04OSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTczICBzZWNvbmQ9MjIxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03MyAgc2Vjb25kPTY1ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03MyAgc2Vjb25kPTE5MiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03MyAgc2Vjb25kPTE5MyBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03MyAgc2Vjb25kPTE5NCBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03MyAgc2Vjb25kPTE5NSBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03MyAgc2Vjb25kPTE5NiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03MyAgc2Vjb25kPTE5NyBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03MyAgc2Vjb25kPTg4ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD03NCAgc2Vjb25kPTY1ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzQgIHNlY29uZD0xOTIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc0ICBzZWNvbmQ9MTkzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NCAgc2Vjb25kPTE5NCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzQgIHNlY29uZD0xOTUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc0ICBzZWNvbmQ9MTk2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NCAgc2Vjb25kPTE5NyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0xMTggYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MTIxIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTI1MyBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yNTUgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9NjcgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTcxICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD03OSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9ODEgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTIxNiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0xOTkgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjEwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTIxMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yMTIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjEzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTIxNCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0xMTEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjQyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTI0MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yNDQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjQ1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTI0NiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0xMTcgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjQ5IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTI1MCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yNTEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjUyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTk5ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0xMDAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MTAxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTEwMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0xMTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjMxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTIzMiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yMzMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MjM0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTIzNSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD00NSAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MTczIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTEwOSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0xMTAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc1ICBzZWNvbmQ9MTEyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTI0MSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0xMTggYW1vdW50PS0xMFxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTEyMSBhbW91bnQ9LTEwXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjUzIGFtb3VudD0tMTBcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yNTUgYW1vdW50PS0xMFxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTY3ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD03MSAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9NzkgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTgxICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yMTYgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MTk5IGFtb3VudD0tNVxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTIxMCBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yMTEgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjEyIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTIxMyBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yMTQgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9ODUgIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTIxNyBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yMTggYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjE5IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTIyMCBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0zNCAgYW1vdW50PS0yNlxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTM5ICBhbW91bnQ9LTI2XG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9ODcgIGFtb3VudD0tMTFcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD04NCAgYW1vdW50PS0yMVxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTExNyBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yNDkgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjUwIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTI1MSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yNTIgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9ODYgIGFtb3VudD0tMTRcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD04OSAgYW1vdW50PS0xOVxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTIyMSBhbW91bnQ9LTE5XG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9NjUgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MTkyIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MTkzIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MTk0IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MTk1IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MTk2IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MTk3IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTc3ICBzZWNvbmQ9ODQgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03NyAgc2Vjb25kPTg5ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzcgIHNlY29uZD0yMjEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc3ICBzZWNvbmQ9NjUgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTc3ICBzZWNvbmQ9MTkyIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTc3ICBzZWNvbmQ9MTkzIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTc3ICBzZWNvbmQ9MTk0IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTc3ICBzZWNvbmQ9MTk1IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTc3ICBzZWNvbmQ9MTk2IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTc3ICBzZWNvbmQ9MTk3IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTc3ICBzZWNvbmQ9ODggIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTc4ICBzZWNvbmQ9ODQgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03OCAgc2Vjb25kPTg5ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzggIHNlY29uZD0yMjEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc4ICBzZWNvbmQ9NjUgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTc4ICBzZWNvbmQ9MTkyIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTc4ICBzZWNvbmQ9MTkzIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTc4ICBzZWNvbmQ9MTk0IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTc4ICBzZWNvbmQ9MTk1IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTc4ICBzZWNvbmQ9MTk2IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTc4ICBzZWNvbmQ9MTk3IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTc4ICBzZWNvbmQ9ODggIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9ODQgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTg2ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD04OSAgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9MjIxIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTY1ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD0xOTIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9MTkzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTE5NCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD0xOTUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9MTk2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTE5NyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD04OCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTc5ICBzZWNvbmQ9NDQgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTQ2ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD05MCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MTE4IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MTIxIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjUzIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjU1IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MTExIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTI0MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yNDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTI0NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yNDYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9NjUgIGFtb3VudD0tMTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0xOTIgYW1vdW50PS0xMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTE5MyBhbW91bnQ9LTExXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MTk0IGFtb3VudD0tMTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0xOTUgYW1vdW50PS0xMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTE5NiBhbW91bnQ9LTExXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MTk3IGFtb3VudD0tMTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD04OCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9NDQgIGFtb3VudD0tMjVcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD00NiAgYW1vdW50PS0yNVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTkwICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD05OSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MTAwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTEwMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0xMDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MTEzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTIzMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yMzIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjMzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTIzNCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yMzUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9OTcgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTIyNCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yMjUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjI2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTIyNyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yMjggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjI5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTc0ICBhbW91bnQ9LTE2XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTE4IGFtb3VudD0tNlxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTEyMSBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yNTMgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjU1IGFtb3VudD0tNlxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTY3ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD03MSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9NzkgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTgxICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMTYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTk5IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIxMCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMTEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjEyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIxMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMTQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTExIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTI0MiBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yNDMgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjQ0IGFtb3VudD0tOFxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTI0NSBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yNDYgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9ODcgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9ODQgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTE3IGFtb3VudD0tN1xua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTI0OSBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yNTAgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjUxIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTI1MiBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMjIgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9ODYgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9ODkgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjIxIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9NjUgIGFtb3VudD0tNlxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTE5MiBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xOTMgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTk0IGFtb3VudD0tNlxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTE5NSBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xOTYgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTk3IGFtb3VudD0tNlxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTQ0ICBhbW91bnQ9LTE3XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9NDYgIGFtb3VudD0tMTdcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD05OSAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTAwIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTEwMSBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMDMgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTEzIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIzMSBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMzIgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjMzIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIzNCBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMzUgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTIwIGFtb3VudD0tNlxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTQ1ICBhbW91bnQ9LTE4XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTczIGFtb3VudD0tMThcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMDkgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTEwIGFtb3VudD0tOVxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTExMiBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yNDEgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9ODMgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTk3ICBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMjQgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjI1IGFtb3VudD0tOVxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIyNiBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMjcgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjI4IGFtb3VudD0tOVxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIyOSBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMTUgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9NzQgIGFtb3VudD0tMTlcbmtlcm5pbmcgZmlyc3Q9ODUgIHNlY29uZD02NSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg1ICBzZWNvbmQ9MTkyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NSAgc2Vjb25kPTE5MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODUgIHNlY29uZD0xOTQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg1ICBzZWNvbmQ9MTk1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NSAgc2Vjb25kPTE5NiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODUgIHNlY29uZD0xOTcgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTEyMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yNTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjU1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTY3ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD03MSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9NzkgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTgxICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMTYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTk5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIxMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjEyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIxMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMTQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTExIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTI0MiBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yNDMgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjQ0IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTI0NSBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yNDYgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTE3IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTI0OSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yNTAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjUxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTI1MiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD02NSAgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTkyIGFtb3VudD0tNlxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTE5MyBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xOTQgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTk1IGFtb3VudD0tNlxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTE5NiBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xOTcgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9NDQgIGFtb3VudD0tMThcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD00NiAgYW1vdW50PS0xOFxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTk5ICBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xMDAgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTAxIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTEwMyBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xMTMgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjMxIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIzMiBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMzMgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjM0IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIzNSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD00NSAgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTczIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTk3ICBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMjQgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjI1IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIyNiBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMjcgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjI4IGFtb3VudD0tNFxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIyOSBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0xMTEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjQyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTI0MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yNDQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjQ1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTI0NiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD04NCAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0xMTcgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTI1MCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yNTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjUyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTY1ICBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0xOTIgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MTkzIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTE5NCBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0xOTUgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MTk2IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTE5NyBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD00NCAgYW1vdW50PS0xMFxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTQ2ICBhbW91bnQ9LTEwXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9OTkgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTEwMCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0xMDEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MTAzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTExMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yMzEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjMyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTIzMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yMzQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjM1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTQ1ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0xNzMgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9OTcgIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTIyNCBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yMjUgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjI2IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTIyNyBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yMjggYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjI5IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTExOCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0xMjEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjUzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTI1NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD02NyAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9NzEgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTc5ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD04MSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjE2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTE5OSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yMTAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjExIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTIxMiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yMTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjE0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTExMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yNDIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjQzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTI0NCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yNDUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjQ2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTExNyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yNDkgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjUwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTI1MSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yNTIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9ODYgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9OTkgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTEwMCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0xMDEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MTAzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTExMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yMzEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjMyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTIzMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yMzQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjM1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTQ1ICBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0xNzMgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTE4IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTEyMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yNTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjU1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTY3ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD03MSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9NzkgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTgxICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMTYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTk5IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIxMCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMTEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjEyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIxMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMTQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9ODUgIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIxNyBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMTggYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjE5IGFtb3VudD0tN1xua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIyMCBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMTEgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjQyIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTI0MyBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yNDQgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjQ1IGFtb3VudD0tNVxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTI0NiBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD04NyAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD04NCAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMTcgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjQ5IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTI1MCBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yNTEgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjUyIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTEyMiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD04NiAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD04OSAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMjEgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD02NSAgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTkyIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTE5MyBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xOTQgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTk1IGFtb3VudD0tN1xua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTE5NiBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xOTcgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9ODggIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9NDQgIGFtb3VudD0tMTZcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD00NiAgYW1vdW50PS0xNlxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTk5ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMDAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTAxIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTEwMyBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMTMgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjMxIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIzMiBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMzMgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjM0IGFtb3VudD0tNVxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIzNSBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMjAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9NDUgIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTE3MyBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMDkgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTEwIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTExMiBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yNDEgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9ODMgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTk3ICBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMjQgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjI1IGFtb3VudD0tNlxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIyNiBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMjcgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjI4IGFtb3VudD0tNlxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIyOSBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMTUgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9NzQgIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTExOCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xMjEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjUzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTI1NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD02NyAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9NzEgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTc5ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD04MSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjE2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTE5OSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yMTAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjExIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTIxMiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yMTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjE0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTExMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yNDIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjQzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTI0NCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yNDUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjQ2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTExNyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yNDkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjUwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTI1MSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yNTIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9NjUgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTkyIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTkzIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTk0IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTk1IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTk2IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTk3IGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9OTkgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTEwMCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xMDEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTAzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTExMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yMzEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjMyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTIzMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yMzQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjM1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05NyAgc2Vjb25kPTExOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9OTcgIHNlY29uZD0xMjEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTk3ICBzZWNvbmQ9MjUzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD05NyAgc2Vjb25kPTI1NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9OTcgIHNlY29uZD0zNCAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTk3ICBzZWNvbmQ9MzkgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD05OCAgc2Vjb25kPTExOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9OTggIHNlY29uZD0xMjEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTk4ICBzZWNvbmQ9MjUzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD05OCAgc2Vjb25kPTI1NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9OTggIHNlY29uZD0zNCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTk4ICBzZWNvbmQ9MzkgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD05OCAgc2Vjb25kPTEyMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9OTggIHNlY29uZD0xMjAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTk5ICBzZWNvbmQ9MzQgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD05OSAgc2Vjb25kPTM5ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTAxIHNlY29uZD0xMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEwMSBzZWNvbmQ9MTIxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMDEgc2Vjb25kPTI1MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTAxIHNlY29uZD0yNTUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEwMSBzZWNvbmQ9MzQgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMDEgc2Vjb25kPTM5ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTA0IHNlY29uZD0zNCAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTEwNCBzZWNvbmQ9MzkgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0xMDkgc2Vjb25kPTM0ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MTA5IHNlY29uZD0zOSAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTExMCBzZWNvbmQ9MzQgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0xMTAgc2Vjb25kPTM5ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD0xMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExMSBzZWNvbmQ9MTIxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTI1MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD0yNTUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExMSBzZWNvbmQ9MzQgIGFtb3VudD0tMTFcbmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD0zOSAgYW1vdW50PS0xMVxua2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTEyMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD0xMjAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTExMiBzZWNvbmQ9MTE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTEyMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTEyIHNlY29uZD0yNTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExMiBzZWNvbmQ9MjU1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTM0ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTEyIHNlY29uZD0zOSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTExMiBzZWNvbmQ9MTIyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTEyMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0xMTggYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0xMjEgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yNTMgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yNTUgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0zNCAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0zOSAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0xMTEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjQyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTI0MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yNDQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjQ1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTI0NiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD00NCAgYW1vdW50PS0xMFxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTQ2ICBhbW91bnQ9LTEwXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9OTkgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTEwMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0xMDEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MTAzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTExMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMzEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjMyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIzMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMzQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjM1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTk3ICBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMjQgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjI1IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIyNiBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMjcgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjI4IGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIyOSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0zNCAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0zOSAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0xMTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjQyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTI0MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yNDQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTI0NiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD00NCAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9NDYgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTk5ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0xMDAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MTAxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTEwMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0xMTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjMxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTIzMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yMzMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjM0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTIzNSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD05NyAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjI0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTIyNSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yMjYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjI3IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTIyOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yMjkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MTExIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTI0MiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0yNDMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MjQ0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTI0NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0yNDYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9OTkgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTEwMCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0xMDEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MTAzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTExMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0yMzEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MjMyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTIzMyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0yMzQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MjM1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTM0ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTM5ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTExMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yNDIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjQzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTI0NCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yNDUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTQ0ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD00NiAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9OTkgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTEwMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0xMDEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MTAzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTExMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yMzEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjMyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTIzMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yMzQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjM1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTk3ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yMjQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjI1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTIyNiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yMjcgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MjI4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTIyOSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0xMTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MjQyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTI0MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0yNDQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTI0NiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD05OSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MTAwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTEwMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0xMDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MTEzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTIzMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0yMzIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MjMzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTIzNCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0yMzUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NCBzZWNvbmQ9MTE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTQgc2Vjb25kPTEyMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU0IHNlY29uZD0yNTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NCBzZWNvbmQ9MjU1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTQgc2Vjb25kPTM0ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjU0IHNlY29uZD0zOSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTI1NCBzZWNvbmQ9MTIyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTQgc2Vjb25kPTEyMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD04NCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9ODYgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTg5ICBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD0yMjEgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9NjUgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTE5MiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD0xOTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9MTk0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTE5NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD0xOTYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9MTk3IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTg4ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD00NCAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTIwOCBzZWNvbmQ9NDYgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTkwICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0xMTggYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MTIxIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTI1MyBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yNTUgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9NjcgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTcxICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD03OSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9ODEgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTIxNiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0xOTkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjEwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTIxMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yMTIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjEzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTIxNCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD04NSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjE3IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTIxOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yMTkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjIwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTM0ICBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0zOSAgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MTExIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTI0MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yNDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTI0NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yNDYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9ODcgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTg0ICBhbW91bnQ9LTEwXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MTE3IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTI0OSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yNTAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjUxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTI1MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0xMjIgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD04NiAgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9ODkgIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTIyMSBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0xMTggYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MTIxIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTI1MyBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yNTUgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9NjcgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTcxICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD03OSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9ODEgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTIxNiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0xOTkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjEwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTIxMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yMTIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjEzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTIxNCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD04NSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjE3IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTIxOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yMTkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjIwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTM0ICBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0zOSAgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MTExIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTI0MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yNDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTI0NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yNDYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9ODcgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTg0ICBhbW91bnQ9LTEwXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MTE3IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTI0OSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yNTAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjUxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTI1MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0xMjIgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD04NiAgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9ODkgIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTIyMSBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0xMTggYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MTIxIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTI1MyBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yNTUgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9NjcgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTcxICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD03OSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9ODEgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTIxNiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0xOTkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjEwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTIxMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yMTIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjEzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTIxNCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD04NSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjE3IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTIxOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yMTkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjIwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTM0ICBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0zOSAgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MTExIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTI0MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yNDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTI0NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yNDYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9ODcgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTg0ICBhbW91bnQ9LTEwXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MTE3IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTI0OSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yNTAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjUxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTI1MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0xMjIgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD04NiAgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9ODkgIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTIyMSBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0xMTggYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MTIxIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTI1MyBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yNTUgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9NjcgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTcxICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD03OSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9ODEgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTIxNiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0xOTkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjEwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTIxMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yMTIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjEzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTIxNCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD04NSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjE3IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTIxOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yMTkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjIwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTM0ICBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0zOSAgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MTExIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTI0MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yNDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTI0NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yNDYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9ODcgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTg0ICBhbW91bnQ9LTEwXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MTE3IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTI0OSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yNTAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjUxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTI1MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0xMjIgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD04NiAgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9ODkgIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTIyMSBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0xMTggYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MTIxIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTI1MyBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yNTUgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9NjcgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTcxICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD03OSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9ODEgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTIxNiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0xOTkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjEwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTIxMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yMTIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjEzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTIxNCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD04NSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjE3IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTIxOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yMTkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjIwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTM0ICBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0zOSAgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MTExIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTI0MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yNDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTI0NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yNDYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9ODcgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTg0ICBhbW91bnQ9LTEwXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MTE3IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTI0OSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yNTAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjUxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTI1MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0xMjIgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD04NiAgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9ODkgIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTIyMSBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0xMTggYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MTIxIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTI1MyBhbW91bnQ9LTRcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yNTUgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9NjcgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTcxICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD03OSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9ODEgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTIxNiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0xOTkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjEwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTIxMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yMTIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjEzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTIxNCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD04NSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjE3IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTIxOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yMTkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjIwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTM0ICBhbW91bnQ9LTlcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0zOSAgYW1vdW50PS05XG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MTExIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTI0MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yNDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTI0NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yNDYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9ODcgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTg0ICBhbW91bnQ9LTEwXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MTE3IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTI0OSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yNTAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjUxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTI1MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0xMjIgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD04NiAgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9ODkgIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTIyMSBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MTk5IHNlY29uZD04NCAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MTE4IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTEyMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yNTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjU1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTExMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yNDIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjQzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTI0NCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yNDUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTg0ICBhbW91bnQ9Mlxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTExNyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yNDkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjUwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTI1MSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yNTIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9OTkgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTEwMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0xMDEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MTAzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTExMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yMzEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjMyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTIzMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yMzQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjM1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTExOCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0xMjEgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjUzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTI1NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0xMTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjQyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTI0MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yNDQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTI0NiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD04NCAgYW1vdW50PTJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0xMTcgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTI1MCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yNTEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjUyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTk5ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0xMDAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MTAxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTEwMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0xMTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjMxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTIzMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yMzMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjM0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTIzNSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0xMTggYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MTIxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTI1MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yNTUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MTExIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTI0MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yNDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTI0NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yNDYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9ODQgIGFtb3VudD0yXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MTE3IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTI0OSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yNTAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjUxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTI1MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD05OSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MTAwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTEwMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0xMDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MTEzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTIzMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yMzIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjMzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTIzNCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yMzUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MTE4IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTEyMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yNTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjU1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTExMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yNDIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjQzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTI0NCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yNDUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTg0ICBhbW91bnQ9Mlxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTExNyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yNDkgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjUwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTI1MSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yNTIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9OTkgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTEwMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0xMDEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MTAzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTExMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yMzEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjMyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTIzMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yMzQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjM1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMDQgc2Vjb25kPTg0ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjA0IHNlY29uZD04OSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwNCBzZWNvbmQ9MjIxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDQgc2Vjb25kPTY1ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDQgc2Vjb25kPTE5MiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDQgc2Vjb25kPTE5MyBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDQgc2Vjb25kPTE5NCBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDQgc2Vjb25kPTE5NSBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDQgc2Vjb25kPTE5NiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDQgc2Vjb25kPTE5NyBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDQgc2Vjb25kPTg4ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDUgc2Vjb25kPTg0ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjA1IHNlY29uZD04OSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwNSBzZWNvbmQ9MjIxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDUgc2Vjb25kPTY1ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDUgc2Vjb25kPTE5MiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDUgc2Vjb25kPTE5MyBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDUgc2Vjb25kPTE5NCBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDUgc2Vjb25kPTE5NSBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDUgc2Vjb25kPTE5NiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDUgc2Vjb25kPTE5NyBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDUgc2Vjb25kPTg4ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDYgc2Vjb25kPTg0ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjA2IHNlY29uZD04OSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwNiBzZWNvbmQ9MjIxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDYgc2Vjb25kPTY1ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDYgc2Vjb25kPTE5MiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDYgc2Vjb25kPTE5MyBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDYgc2Vjb25kPTE5NCBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDYgc2Vjb25kPTE5NSBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDYgc2Vjb25kPTE5NiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDYgc2Vjb25kPTE5NyBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDYgc2Vjb25kPTg4ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDcgc2Vjb25kPTg0ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjA3IHNlY29uZD04OSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwNyBzZWNvbmQ9MjIxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDcgc2Vjb25kPTY1ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDcgc2Vjb25kPTE5MiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDcgc2Vjb25kPTE5MyBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDcgc2Vjb25kPTE5NCBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDcgc2Vjb25kPTE5NSBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDcgc2Vjb25kPTE5NiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDcgc2Vjb25kPTE5NyBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDcgc2Vjb25kPTg4ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDkgc2Vjb25kPTg0ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjA5IHNlY29uZD04OSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIwOSBzZWNvbmQ9MjIxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMDkgc2Vjb25kPTY1ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDkgc2Vjb25kPTE5MiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDkgc2Vjb25kPTE5MyBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDkgc2Vjb25kPTE5NCBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDkgc2Vjb25kPTE5NSBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDkgc2Vjb25kPTE5NiBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDkgc2Vjb25kPTE5NyBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMDkgc2Vjb25kPTg4ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTg0ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD04NiAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9ODkgIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTIyMSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD02NSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9MTkyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTE5MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD0xOTQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9MTk1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTE5NiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD0xOTcgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9ODggIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTQ0ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD00NiAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9OTAgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTg0ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD04NiAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9ODkgIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTIyMSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD02NSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9MTkyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTE5MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD0xOTQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9MTk1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTE5NiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD0xOTcgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9ODggIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTQ0ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD00NiAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9OTAgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTg0ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD04NiAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9ODkgIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTIyMSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD02NSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9MTkyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTE5MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD0xOTQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9MTk1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTE5NiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD0xOTcgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9ODggIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTQ0ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD00NiAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9OTAgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTg0ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD04NiAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9ODkgIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTIyMSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD02NSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9MTkyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTE5MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD0xOTQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9MTk1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTE5NiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD0xOTcgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9ODggIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTMgc2Vjb25kPTQ0ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD00NiAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9OTAgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTg0ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD04NiAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9ODkgIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTIyMSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD02NSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9MTkyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTE5MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD0xOTQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9MTk1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTE5NiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD0xOTcgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9ODggIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTQ0ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD00NiAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9OTAgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTcgc2Vjb25kPTY1ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE3IHNlY29uZD0xOTIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxNyBzZWNvbmQ9MTkzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTcgc2Vjb25kPTE5NCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE3IHNlY29uZD0xOTUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxNyBzZWNvbmQ9MTk2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTcgc2Vjb25kPTE5NyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE4IHNlY29uZD02NSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxOCBzZWNvbmQ9MTkyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTggc2Vjb25kPTE5MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE4IHNlY29uZD0xOTQgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxOCBzZWNvbmQ9MTk1IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTggc2Vjb25kPTE5NiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE4IHNlY29uZD0xOTcgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxOSBzZWNvbmQ9NjUgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTkgc2Vjb25kPTE5MiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE5IHNlY29uZD0xOTMgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxOSBzZWNvbmQ9MTk0IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMTkgc2Vjb25kPTE5NSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjE5IHNlY29uZD0xOTYgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIxOSBzZWNvbmQ9MTk3IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMjAgc2Vjb25kPTY1ICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjIwIHNlY29uZD0xOTIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIyMCBzZWNvbmQ9MTkzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMjAgc2Vjb25kPTE5NCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjIwIHNlY29uZD0xOTUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIyMCBzZWNvbmQ9MTk2IGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMjAgc2Vjb25kPTE5NyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMTggYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTIxIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI1MyBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNTUgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9NjcgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTcxICBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD03OSAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9ODEgIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIxNiBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xOTkgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjEwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIxMSBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMTIgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjEzIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIxNCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD04NSAgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjE3IGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIxOCBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMTkgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjIwIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTExMSBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNDIgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjQzIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI0NCBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNDUgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjQ2IGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTg3ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTg0ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTExNyBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNDkgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjUwIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI1MSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNTIgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTIyIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTg2ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTg5ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIyMSBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTY1ICBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xOTIgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTkzIGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTE5NCBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xOTUgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTk2IGFtb3VudD0tN1xua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTE5NyBhbW91bnQ9LTdcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD04OCAgYW1vdW50PTFcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD00NCAgYW1vdW50PS0xNlxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTQ2ICBhbW91bnQ9LTE2XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9OTkgIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTEwMCBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMDEgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTAzIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTExMyBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMzEgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjMyIGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIzMyBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMzQgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjM1IGFtb3VudD0tNVxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTEyMCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD00NSAgYW1vdW50PS00XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTczIGFtb3VudD0tNFxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTEwOSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMTAgYW1vdW50PS0zXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTEyIGFtb3VudD0tM1xua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI0MSBhbW91bnQ9LTNcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD04MyAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9OTcgIGFtb3VudD0tNlxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIyNCBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMjUgYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjI2IGFtb3VudD0tNlxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIyNyBhbW91bnQ9LTZcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMjggYW1vdW50PS02XG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjI5IGFtb3VudD0tNlxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTExNSBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD03NCAgYW1vdW50PS03XG5rZXJuaW5nIGZpcnN0PTIyNCBzZWNvbmQ9MTE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMjQgc2Vjb25kPTEyMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjI0IHNlY29uZD0yNTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIyNCBzZWNvbmQ9MjU1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMjQgc2Vjb25kPTM0ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjI0IHNlY29uZD0zOSAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyNSBzZWNvbmQ9MTE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMjUgc2Vjb25kPTEyMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjI1IHNlY29uZD0yNTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIyNSBzZWNvbmQ9MjU1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMjUgc2Vjb25kPTM0ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjI1IHNlY29uZD0zOSAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyNiBzZWNvbmQ9MTE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMjYgc2Vjb25kPTEyMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjI2IHNlY29uZD0yNTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIyNiBzZWNvbmQ9MjU1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMjYgc2Vjb25kPTM0ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjI2IHNlY29uZD0zOSAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyNyBzZWNvbmQ9MTE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMjcgc2Vjb25kPTEyMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjI3IHNlY29uZD0yNTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIyNyBzZWNvbmQ9MjU1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMjcgc2Vjb25kPTM0ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjI3IHNlY29uZD0zOSAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyOCBzZWNvbmQ9MTE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMjggc2Vjb25kPTEyMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjI4IHNlY29uZD0yNTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIyOCBzZWNvbmQ9MjU1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMjggc2Vjb25kPTM0ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjI4IHNlY29uZD0zOSAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIyOSBzZWNvbmQ9MTE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMjkgc2Vjb25kPTEyMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjI5IHNlY29uZD0yNTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIyOSBzZWNvbmQ9MjU1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMjkgc2Vjb25kPTM0ICBhbW91bnQ9LTVcbmtlcm5pbmcgZmlyc3Q9MjI5IHNlY29uZD0zOSAgYW1vdW50PS01XG5rZXJuaW5nIGZpcnN0PTIzMSBzZWNvbmQ9MzQgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMzEgc2Vjb25kPTM5ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjMyIHNlY29uZD0xMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIzMiBzZWNvbmQ9MTIxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMzIgc2Vjb25kPTI1MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjMyIHNlY29uZD0yNTUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIzMiBzZWNvbmQ9MzQgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMzIgc2Vjb25kPTM5ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjMzIHNlY29uZD0xMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIzMyBzZWNvbmQ9MTIxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMzMgc2Vjb25kPTI1MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjMzIHNlY29uZD0yNTUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIzMyBzZWNvbmQ9MzQgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMzMgc2Vjb25kPTM5ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjM0IHNlY29uZD0xMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIzNCBzZWNvbmQ9MTIxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMzQgc2Vjb25kPTI1MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjM0IHNlY29uZD0yNTUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIzNCBzZWNvbmQ9MzQgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMzQgc2Vjb25kPTM5ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjM1IHNlY29uZD0xMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIzNSBzZWNvbmQ9MTIxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMzUgc2Vjb25kPTI1MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjM1IHNlY29uZD0yNTUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTIzNSBzZWNvbmQ9MzQgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yMzUgc2Vjb25kPTM5ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjQxIHNlY29uZD0zNCAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTI0MSBzZWNvbmQ9MzkgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0yNDIgc2Vjb25kPTExOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjQyIHNlY29uZD0xMjEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI0MiBzZWNvbmQ9MjUzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNDIgc2Vjb25kPTI1NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjQyIHNlY29uZD0zNCAgYW1vdW50PS0xMVxua2VybmluZyBmaXJzdD0yNDIgc2Vjb25kPTM5ICBhbW91bnQ9LTExXG5rZXJuaW5nIGZpcnN0PTI0MiBzZWNvbmQ9MTIyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNDIgc2Vjb25kPTEyMCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjQzIHNlY29uZD0xMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI0MyBzZWNvbmQ9MTIxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNDMgc2Vjb25kPTI1MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjQzIHNlY29uZD0yNTUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI0MyBzZWNvbmQ9MzQgIGFtb3VudD0tMTFcbmtlcm5pbmcgZmlyc3Q9MjQzIHNlY29uZD0zOSAgYW1vdW50PS0xMVxua2VybmluZyBmaXJzdD0yNDMgc2Vjb25kPTEyMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjQzIHNlY29uZD0xMjAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTI0NCBzZWNvbmQ9MTE4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNDQgc2Vjb25kPTEyMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjQ0IHNlY29uZD0yNTMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI0NCBzZWNvbmQ9MjU1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNDQgc2Vjb25kPTM0ICBhbW91bnQ9LTExXG5rZXJuaW5nIGZpcnN0PTI0NCBzZWNvbmQ9MzkgIGFtb3VudD0tMTFcbmtlcm5pbmcgZmlyc3Q9MjQ0IHNlY29uZD0xMjIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI0NCBzZWNvbmQ9MTIwIGFtb3VudD0tMlxua2VybmluZyBmaXJzdD0yNDUgc2Vjb25kPTExOCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjQ1IHNlY29uZD0xMjEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI0NSBzZWNvbmQ9MjUzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNDUgc2Vjb25kPTI1NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjQ1IHNlY29uZD0zNCAgYW1vdW50PS0xMVxua2VybmluZyBmaXJzdD0yNDUgc2Vjb25kPTM5ICBhbW91bnQ9LTExXG5rZXJuaW5nIGZpcnN0PTI0NSBzZWNvbmQ9MTIyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNDUgc2Vjb25kPTEyMCBhbW91bnQ9LTJcbmtlcm5pbmcgZmlyc3Q9MjQ2IHNlY29uZD0xMTggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI0NiBzZWNvbmQ9MTIxIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNDYgc2Vjb25kPTI1MyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjQ2IHNlY29uZD0yNTUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI0NiBzZWNvbmQ9MzQgIGFtb3VudD0tMTFcbmtlcm5pbmcgZmlyc3Q9MjQ2IHNlY29uZD0zOSAgYW1vdW50PS0xMVxua2VybmluZyBmaXJzdD0yNDYgc2Vjb25kPTEyMiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjQ2IHNlY29uZD0xMjAgYW1vdW50PS0yXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MzQgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MzkgIGFtb3VudD0xXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MTExIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTI0MiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yNDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTI0NSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yNDYgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9NDQgIGFtb3VudD0tOFxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTQ2ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD05OSAgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MTAwIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTEwMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0xMDMgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MTEzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTIzMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yMzIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjMzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTIzNCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yMzUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9OTcgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTIyNCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yMjUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjI2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTIyNyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0yMjggYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjI5IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTM0ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTM5ICBhbW91bnQ9MVxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTExMSBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yNDIgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjQzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTI0NCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yNDUgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTQ0ICBhbW91bnQ9LThcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD00NiAgYW1vdW50PS04XG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9OTkgIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTEwMCBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0xMDEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MTAzIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTExMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yMzEgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjMyIGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTIzMyBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yMzQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjM1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTk3ICBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yMjQgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjI1IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTIyNiBhbW91bnQ9LTFcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yMjcgYW1vdW50PS0xXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MjI4IGFtb3VudD0tMVxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTIyOSBhbW91bnQ9LTFcbmA7XG59IiwiLyoqXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxuKlxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cbipcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbipcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuKlxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gPSB7fSApe1xuXG4gIGNvbnN0IGludGVyYWN0aW9uID0gY3JlYXRlSW50ZXJhY3Rpb24oIHBhbmVsICk7XG5cbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgaGFuZGxlT25QcmVzcyApO1xuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICd0aWNrJywgaGFuZGxlVGljayApO1xuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblJlbGVhc2VkJywgaGFuZGxlT25SZWxlYXNlICk7XG5cbiAgY29uc3QgdGVtcE1hdHJpeCA9IG5ldyBUSFJFRS5NYXRyaXg0KCk7XG4gIGNvbnN0IHRQb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cbiAgbGV0IG9sZFBhcmVudDtcbiAgXG4gIGZ1bmN0aW9uIGdldFRvcExldmVsRm9sZGVyKGdyb3VwKSB7XG4gICAgdmFyIGZvbGRlciA9IGdyb3VwLmZvbGRlcjtcbiAgICB3aGlsZSAoZm9sZGVyLmZvbGRlciAhPT0gZm9sZGVyKSBmb2xkZXIgPSBmb2xkZXIuZm9sZGVyO1xuICAgIHJldHVybiBmb2xkZXI7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVUaWNrKCB7IGlucHV0IH0gPSB7fSApe1xuICAgIGNvbnN0IGZvbGRlciA9IGdldFRvcExldmVsRm9sZGVyKGdyb3VwKTtcbiAgICBpZiggZm9sZGVyID09PSB1bmRlZmluZWQgKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiggaW5wdXQubW91c2UgKXtcbiAgICAgIGlmKCBpbnB1dC5wcmVzc2VkICYmIGlucHV0LnNlbGVjdGVkICYmIGlucHV0LnJheWNhc3QucmF5LmludGVyc2VjdFBsYW5lKCBpbnB1dC5tb3VzZVBsYW5lLCBpbnB1dC5tb3VzZUludGVyc2VjdGlvbiApICl7XG4gICAgICAgIGlmKCBpbnB1dC5pbnRlcmFjdGlvbi5wcmVzcyA9PT0gaW50ZXJhY3Rpb24gKXtcbiAgICAgICAgICBpbnB1dC5tb3VzZUludGVyc2VjdGlvbi5zdWIoIGlucHV0Lm1vdXNlT2Zmc2V0ICk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgIGlucHV0LnNlbGVjdGVkLnBhcmVudC51cGRhdGVNYXRyaXhXb3JsZCgpOyAgICAgICAgICBcbiAgICAgICAgICBpbnB1dC5zZWxlY3RlZC5wYXJlbnQud29ybGRUb0xvY2FsKGlucHV0Lm1vdXNlSW50ZXJzZWN0aW9uKTtcblxuICAgICAgICAgIGZvbGRlci5wb3NpdGlvbi5jb3B5KGlucHV0Lm1vdXNlSW50ZXJzZWN0aW9uKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSBpZiggaW5wdXQuaW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwICl7XG4gICAgICAgIGNvbnN0IGhpdE9iamVjdCA9IGlucHV0LmludGVyc2VjdGlvbnNbIDAgXS5vYmplY3Q7XG4gICAgICAgIGlmKCBoaXRPYmplY3QgPT09IHBhbmVsICl7XG4gICAgICAgICAgaGl0T2JqZWN0LnVwZGF0ZU1hdHJpeFdvcmxkKCk7XG4gICAgICAgICAgdFBvc2l0aW9uLnNldEZyb21NYXRyaXhQb3NpdGlvbiggaGl0T2JqZWN0Lm1hdHJpeFdvcmxkICk7XG5cbiAgICAgICAgICBpbnB1dC5tb3VzZVBsYW5lLnNldEZyb21Ob3JtYWxBbmRDb3BsYW5hclBvaW50KCBpbnB1dC5tb3VzZUNhbWVyYS5nZXRXb3JsZERpcmVjdGlvbiggaW5wdXQubW91c2VQbGFuZS5ub3JtYWwgKSwgdFBvc2l0aW9uICk7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coIGlucHV0Lm1vdXNlUGxhbmUgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuXG5cbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZU9uUHJlc3MoIHAgKXtcblxuICAgIGxldCB7IGlucHV0T2JqZWN0LCBpbnB1dCB9ID0gcDtcblxuICAgIGNvbnN0IGZvbGRlciA9IGdldFRvcExldmVsRm9sZGVyKGdyb3VwKTtcbiAgICBpZiggZm9sZGVyID09PSB1bmRlZmluZWQgKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiggZm9sZGVyLmJlaW5nTW92ZWQgPT09IHRydWUgKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiggaW5wdXQubW91c2UgKXtcbiAgICAgIGlmKCBpbnB1dC5pbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDAgKXtcbiAgICAgICAgaWYoIGlucHV0LnJheWNhc3QucmF5LmludGVyc2VjdFBsYW5lKCBpbnB1dC5tb3VzZVBsYW5lLCBpbnB1dC5tb3VzZUludGVyc2VjdGlvbiApICl7XG4gICAgICAgICAgY29uc3QgaGl0T2JqZWN0ID0gaW5wdXQuaW50ZXJzZWN0aW9uc1sgMCBdLm9iamVjdDtcbiAgICAgICAgICBpZiggaGl0T2JqZWN0ICE9PSBwYW5lbCApe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlucHV0LnNlbGVjdGVkID0gZm9sZGVyO1xuXG4gICAgICAgICAgaW5wdXQuc2VsZWN0ZWQudXBkYXRlTWF0cml4V29ybGQoKTtcbiAgICAgICAgICB0UG9zaXRpb24uc2V0RnJvbU1hdHJpeFBvc2l0aW9uKCBpbnB1dC5zZWxlY3RlZC5tYXRyaXhXb3JsZCApO1xuXG4gICAgICAgICAgaW5wdXQubW91c2VPZmZzZXQuY29weSggaW5wdXQubW91c2VJbnRlcnNlY3Rpb24gKS5zdWIoIHRQb3NpdGlvbiApO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCBpbnB1dC5tb3VzZU9mZnNldCApO1xuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbHNle1xuICAgICAgdGVtcE1hdHJpeC5nZXRJbnZlcnNlKCBpbnB1dE9iamVjdC5tYXRyaXhXb3JsZCApO1xuXG4gICAgICBmb2xkZXIubWF0cml4LnByZW11bHRpcGx5KCB0ZW1wTWF0cml4ICk7XG4gICAgICBmb2xkZXIubWF0cml4LmRlY29tcG9zZSggZm9sZGVyLnBvc2l0aW9uLCBmb2xkZXIucXVhdGVybmlvbiwgZm9sZGVyLnNjYWxlICk7XG5cbiAgICAgIG9sZFBhcmVudCA9IGZvbGRlci5wYXJlbnQ7XG4gICAgICBpbnB1dE9iamVjdC5hZGQoIGZvbGRlciApO1xuICAgIH1cblxuICAgIHAubG9ja2VkID0gdHJ1ZTtcblxuICAgIGZvbGRlci5iZWluZ01vdmVkID0gdHJ1ZTtcblxuICAgIGlucHV0LmV2ZW50cy5lbWl0KCAnZ3JhYmJlZCcsIGlucHV0ICk7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVPblJlbGVhc2UoIHAgKXtcblxuICAgIGxldCB7IGlucHV0T2JqZWN0LCBpbnB1dCB9ID0gcDtcblxuICAgIGNvbnN0IGZvbGRlciA9IGdldFRvcExldmVsRm9sZGVyKGdyb3VwKTtcbiAgICBpZiggZm9sZGVyID09PSB1bmRlZmluZWQgKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiggZm9sZGVyLmJlaW5nTW92ZWQgPT09IGZhbHNlICl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYoIGlucHV0Lm1vdXNlICl7XG4gICAgICBpbnB1dC5zZWxlY3RlZCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgZWxzZXtcblxuICAgICAgaWYoIG9sZFBhcmVudCA9PT0gdW5kZWZpbmVkICl7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZm9sZGVyLm1hdHJpeC5wcmVtdWx0aXBseSggaW5wdXRPYmplY3QubWF0cml4V29ybGQgKTtcbiAgICAgIGZvbGRlci5tYXRyaXguZGVjb21wb3NlKCBmb2xkZXIucG9zaXRpb24sIGZvbGRlci5xdWF0ZXJuaW9uLCBmb2xkZXIuc2NhbGUgKTtcbiAgICAgIG9sZFBhcmVudC5hZGQoIGZvbGRlciApO1xuICAgICAgb2xkUGFyZW50ID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGZvbGRlci5iZWluZ01vdmVkID0gZmFsc2U7XG5cbiAgICBpbnB1dC5ldmVudHMuZW1pdCggJ2dyYWJSZWxlYXNlZCcsIGlucHV0ICk7XG4gIH1cblxuICByZXR1cm4gaW50ZXJhY3Rpb247XG59IiwiZXhwb3J0IGNvbnN0IGdyYWJCYXIgPSAoZnVuY3Rpb24oKXtcbiAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgaW1hZ2Uuc3JjID0gYGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRUFBQUFBZ0NBWUFBQUNpblg2RUFBQUFDWEJJV1hNQUFDNGpBQUF1SXdGNHBUOTJBQUFLVDJsRFExQlFhRzkwYjNOb2IzQWdTVU5ESUhCeWIyWnBiR1VBQUhqYW5WTm5WRlBwRmozMzN2UkNTNGlBbEV0dlVoVUlJRkpDaTRBVWtTWXFJUWtRU29naG9ka1ZVY0VSUlVVRUc4aWdpQU9Pam9DTUZWRXNESW9LMkFma0lhS09nNk9JaXNyNzRYdWphOWE4OStiTi9yWFhQdWVzODUyenp3ZkFDQXlXU0ROUk5ZQU1xVUllRWVDRHg4VEc0ZVF1UUlFS0pIQUFFQWl6WkNGei9TTUJBUGgrUER3cklzQUh2Z0FCZU5NTENBREFUWnZBTUJ5SC93L3FRcGxjQVlDRUFjQjBrVGhMQ0lBVUFFQjZqa0ttQUVCR0FZQ2RtQ1pUQUtBRUFHRExZMkxqQUZBdEFHQW5mK2JUQUlDZCtKbDdBUUJibENFVkFhQ1JBQ0FUWlloRUFHZzdBS3pQVm9wRkFGZ3dBQlJtUzhRNUFOZ3RBREJKVjJaSUFMQzNBTURPRUF1eUFBZ01BREJSaUlVcEFBUjdBR0RJSXlONEFJU1pBQlJHOGxjODhTdXVFT2NxQUFCNG1iSTh1U1E1UllGYkNDMXhCMWRYTGg0b3pra1hLeFEyWVFKaG1rQXV3bm1aR1RLQk5BL2c4OHdBQUtDUkZSSGdnL1A5ZU00T3JzN09ObzYyRGw4dDZyOEcveUppWXVQKzVjK3JjRUFBQU9GMGZ0SCtMQyt6R29BN0JvQnQvcUlsN2dSb1hndWdkZmVMWnJJUFFMVUFvT25hVi9OdytINDhQRVdoa0xuWjJlWGs1TmhLeEVKYlljcFhmZjVud2wvQVYvMXMrWDQ4L1BmMTRMN2lKSUV5WFlGSEJQamd3c3owVEtVY3o1SUpoR0xjNW85SC9MY0wvL3dkMHlMRVNXSzVXQ29VNDFFU2NZNUVtb3p6TXFVaWlVS1NLY1VsMHY5azR0OHMrd00rM3pVQXNHbytBWHVSTGFoZFl3UDJTeWNRV0hUQTR2Y0FBUEs3YjhIVUtBZ0RnR2lENGM5My8rOC8vVWVnSlFDQVprbVNjUUFBWGtRa0xsVEtzei9IQ0FBQVJLQ0JLckJCRy9UQkdDekFCaHpCQmR6QkMveGdOb1JDSk1UQ1FoQkNDbVNBSEhKZ0theUNRaWlHemJBZEttQXYxRUFkTk1CUmFJYVRjQTR1d2xXNERqMXdEL3BoQ0o3QktMeUJDUVJCeUFnVFlTSGFpQUZpaWxnampnZ1htWVg0SWNGSUJCS0xKQ0RKaUJSUklrdVJOVWd4VW9wVUlGVklIZkk5Y2dJNWgxeEd1cEU3eUFBeWd2eUd2RWN4bElHeVVUM1VETFZEdWFnM0dvUkdvZ3ZRWkhReG1vOFdvSnZRY3JRYVBZdzJvZWZRcTJnUDJvOCtROGN3d09nWUJ6UEViREF1eHNOQ3NUZ3NDWk5qeTdFaXJBeXJ4aHF3VnF3RHU0bjFZOCt4ZHdRU2dVWEFDVFlFZDBJZ1lSNUJTRmhNV0U3WVNLZ2dIQ1EwRWRvSk53a0RoRkhDSnlLVHFFdTBKcm9SK2NRWVlqSXhoMWhJTENQV0VvOFRMeEI3aUVQRU55UVNpVU15SjdtUUFrbXhwRlRTRXRKRzBtNVNJK2tzcVpzMFNCb2prOG5hWkd1eUJ6bVVMQ0FyeUlYa25lVEQ1RFBrRytRaDhsc0tuV0pBY2FUNFUrSW9Vc3BxU2hubEVPVTA1UVpsbURKQlZhT2FVdDJvb1ZRUk5ZOWFRcTJodGxLdlVZZW9FelIxbWpuTmd4WkpTNld0b3BYVEdtZ1hhUGRwcitoMHVoSGRsUjVPbDlCWDBzdnBSK2lYNkFQMGR3d05oaFdEeDRobktCbWJHQWNZWnhsM0dLK1lUS1laMDRzWngxUXdOekhybU9lWkQ1bHZWVmdxdGlwOEZaSEtDcFZLbFNhVkd5b3ZWS21xcHFyZXFndFY4MVhMVkkrcFhsTjlya1pWTTFQanFRblVscXRWcXAxUTYxTWJVMmVwTzZpSHFtZW9iMVEvcEg1Wi9Za0dXY05NdzA5RHBGR2dzVi9qdk1ZZ0MyTVpzM2dzSVdzTnE0WjFnVFhFSnJITjJYeDJLcnVZL1IyN2l6MnFxYUU1UXpOS00xZXpVdk9VWmo4SDQ1aHgrSngwVGdubktLZVg4MzZLM2hUdktlSXBHNlkwVExreFpWeHJxcGFYbGxpclNLdFJxMGZydlRhdTdhZWRwcjFGdTFuN2dRNUJ4MG9uWENkSFo0L09CWjNuVTlsVDNhY0tweFpOUFRyMXJpNnFhNlVib2J0RWQ3OXVwKzZZbnI1ZWdKNU1iNmZlZWIzbitoeDlMLzFVL1czNnAvVkhERmdHc3d3a0J0c016aGc4eFRWeGJ6d2RMOGZiOFZGRFhjTkFRNlZobFdHWDRZU1J1ZEU4bzlWR2pVWVBqR25HWE9NazQyM0diY2FqSmdZbUlTWkxUZXBON3BwU1RibW1LYVk3VER0TXg4M016YUxOMXBrMW16MHgxekxubStlYjE1dmZ0MkJhZUZvc3RxaTJ1R1ZKc3VSYXBsbnV0cnh1aFZvNVdhVllWVnBkczBhdG5hMGwxcnV0dTZjUnA3bE9rMDZybnRabnc3RHh0c20ycWJjWnNPWFlCdHV1dG0yMmZXRm5ZaGRudDhXdXcrNlR2Wk45dW4yTi9UMEhEWWZaRHFzZFdoMStjN1J5RkRwV090NmF6cHp1UDMzRjlKYnBMMmRZenhEUDJEUGp0aFBMS2NScG5WT2IwMGRuRjJlNWM0UHppSXVKUzRMTExwYytMcHNieHQzSXZlUktkUFZ4WGVGNjB2V2RtN09id3UybzI2L3VOdTVwN29mY244dzBueW1lV1ROejBNUElRK0JSNWRFL0M1K1ZNR3Zmckg1UFEwK0JaN1huSXk5akw1RlhyZGV3dDZWM3F2ZGg3eGMrOWo1eW4rTSs0enczM2pMZVdWL01OOEMzeUxmTFQ4TnZubCtGMzBOL0kvOWsvM3IvMFFDbmdDVUJad09KZ1VHQld3TDcrSHA4SWIrT1B6cmJaZmF5MmUxQmpLQzVRUlZCajRLdGd1WEJyU0ZveU95UXJTSDM1NWpPa2M1cERvVlFmdWpXMEFkaDVtR0x3MzRNSjRXSGhWZUdQNDV3aUZnYTBUR1hOWGZSM0VOejMwVDZSSlpFM3B0bk1VODVyeTFLTlNvK3FpNXFQTm8zdWpTNlA4WXVabG5NMVZpZFdFbHNTeHc1TGlxdU5tNXN2dC84N2ZPSDRwM2lDK043RjVndnlGMXdlYUhPd3ZTRnB4YXBMaElzT3BaQVRJaE9PSlR3UVJBcXFCYU1KZklUZHlXT0NubkNIY0puSWkvUk50R0kyRU5jS2g1TzhrZ3FUWHFTN0pHOE5Ya2t4VE9sTE9XNWhDZXBrTHhNRFV6ZG16cWVGcHAySUcweVBUcTlNWU9Ta1pCeFFxb2hUWk8yWitwbjVtWjJ5NnhsaGJMK3hXNkx0eThlbFFmSmE3T1FyQVZaTFFxMlFxYm9WRm9vMXlvSHNtZGxWMmEvelluS09aYXJuaXZON2N5enl0dVFONXp2bi8vdEVzSVM0WksycFlaTFZ5MGRXT2E5ckdvNXNqeHhlZHNLNHhVRks0WldCcXc4dUlxMkttM1ZUNnZ0VjVldWZyMG1lazFyZ1Y3QnlvTEJ0UUZyNnd0VkN1V0ZmZXZjMSsxZFQxZ3ZXZCsxWWZxR25ScytGWW1LcmhUYkY1Y1ZmOWdvM0hqbEc0ZHZ5citaM0pTMHFhdkV1V1RQWnRKbTZlYmVMWjViRHBhcWwrYVhEbTROMmRxMERkOVd0TzMxOWtYYkw1Zk5LTnU3ZzdaRHVhTy9QTGk4WmFmSnpzMDdQMVNrVlBSVStsUTI3dExkdFdIWCtHN1I3aHQ3dlBZMDdOWGJXN3ozL1Q3SnZ0dFZBVlZOMVdiVlpmdEorN1AzUDY2SnF1bjRsdnR0WGExT2JYSHR4d1BTQS8wSEl3NjIxN25VMVIzU1BWUlNqOVlyNjBjT3h4KysvcDN2ZHkwTk5nMVZqWnpHNGlOd1JIbms2ZmNKMy9jZURUcmFkb3g3ck9FSDB4OTJIV2NkTDJwQ212S2FScHRUbXZ0YllsdTZUOHcrMGRicTNucjhSOXNmRDV3MFBGbDVTdk5VeVduYTZZTFRrMmZ5ejR5ZGxaMTlmaTc1M0dEYm9yWjc1MlBPMzJvUGIrKzZFSFRoMGtYL2krYzd2RHZPWFBLNGRQS3kyK1VUVjdoWG1xODZYMjNxZE9vOC9wUFRUOGU3bkx1YXJybGNhN251ZXIyMWUyYjM2UnVlTjg3ZDlMMTU4UmIvMXRXZU9UM2R2Zk42Yi9mRjkvWGZGdDErY2lmOXpzdTcyWGNuN3EyOFQ3eGY5RUR0UWRsRDNZZlZQMXYrM05qdjNIOXF3SGVnODlIY1IvY0doWVBQL3BIMWp3OURCWStaajh1R0RZYnJuamcrT1RuaVAzTDk2ZnluUTg5a3p5YWVGLzZpL3N1dUZ4WXZmdmpWNjlmTzBaalJvWmZ5bDVPL2JYeWwvZXJBNnhtdjI4YkN4aDYreVhnek1WNzBWdnZ0d1hmY2R4M3ZvOThQVCtSOElIOG8vMmo1c2ZWVDBLZjdreG1Uay84RUE1anovR016TGRzQUFEc2thVlJZZEZoTlREcGpiMjB1WVdSdlltVXVlRzF3QUFBQUFBQThQM2h3WVdOclpYUWdZbVZuYVc0OUl1Kzd2eUlnYVdROUlsYzFUVEJOY0VObGFHbEllbkpsVTNwT1ZHTjZhMk01WkNJL1BnbzhlRHA0YlhCdFpYUmhJSGh0Ykc1ek9uZzlJbUZrYjJKbE9tNXpPbTFsZEdFdklpQjRPbmh0Y0hSclBTSkJaRzlpWlNCWVRWQWdRMjl5WlNBMUxqWXRZekV6TWlBM09TNHhOVGt5T0RRc0lESXdNVFl2TURRdk1Ua3RNVE02TVRNNk5EQWdJQ0FnSUNBZ0lDSStDaUFnSUR4eVpHWTZVa1JHSUhodGJHNXpPbkprWmowaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1UazVPUzh3TWk4eU1pMXlaR1l0YzNsdWRHRjRMVzV6SXlJK0NpQWdJQ0FnSUR4eVpHWTZSR1Z6WTNKcGNIUnBiMjRnY21SbU9tRmliM1YwUFNJaUNpQWdJQ0FnSUNBZ0lDQWdJSGh0Ykc1ek9uaHRjRDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3THlJS0lDQWdJQ0FnSUNBZ0lDQWdlRzFzYm5NNlpHTTlJbWgwZEhBNkx5OXdkWEpzTG05eVp5OWtZeTlsYkdWdFpXNTBjeTh4TGpFdklnb2dJQ0FnSUNBZ0lDQWdJQ0I0Yld4dWN6cHdhRzkwYjNOb2IzQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2Y0dodmRHOXphRzl3THpFdU1DOGlDaUFnSUNBZ0lDQWdJQ0FnSUhodGJHNXpPbmh0Y0UxTlBTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM2hoY0M4eExqQXZiVzB2SWdvZ0lDQWdJQ0FnSUNBZ0lDQjRiV3h1Y3pwemRFVjJkRDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDNOVWVYQmxMMUpsYzI5MWNtTmxSWFpsYm5Raklnb2dJQ0FnSUNBZ0lDQWdJQ0I0Yld4dWN6cDBhV1ptUFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzUnBabVl2TVM0d0x5SUtJQ0FnSUNBZ0lDQWdJQ0FnZUcxc2JuTTZaWGhwWmowaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOWxlR2xtTHpFdU1DOGlQZ29nSUNBZ0lDQWdJQ0E4ZUcxd09rTnlaV0YwYjNKVWIyOXNQa0ZrYjJKbElGQm9iM1J2YzJodmNDQkRReUF5TURFMUxqVWdLRmRwYm1SdmQzTXBQQzk0YlhBNlEzSmxZWFJ2Y2xSdmIydytDaUFnSUNBZ0lDQWdJRHg0YlhBNlEzSmxZWFJsUkdGMFpUNHlNREUyTFRBNUxUSTRWREUyT2pJMU9qTXlMVEEzT2pBd1BDOTRiWEE2UTNKbFlYUmxSR0YwWlQ0S0lDQWdJQ0FnSUNBZ1BIaHRjRHBOYjJScFpubEVZWFJsUGpJd01UWXRNRGt0TWpoVU1UWTZNemM2TWpNdE1EYzZNREE4TDNodGNEcE5iMlJwWm5sRVlYUmxQZ29nSUNBZ0lDQWdJQ0E4ZUcxd09rMWxkR0ZrWVhSaFJHRjBaVDR5TURFMkxUQTVMVEk0VkRFMk9qTTNPakl6TFRBM09qQXdQQzk0YlhBNlRXVjBZV1JoZEdGRVlYUmxQZ29nSUNBZ0lDQWdJQ0E4WkdNNlptOXliV0YwUG1sdFlXZGxMM0J1Wnp3dlpHTTZabTl5YldGMFBnb2dJQ0FnSUNBZ0lDQThjR2h2ZEc5emFHOXdPa052Ykc5eVRXOWtaVDR6UEM5d2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBnb2dJQ0FnSUNBZ0lDQThjR2h2ZEc5emFHOXdPa2xEUTFCeWIyWnBiR1UrYzFKSFFpQkpSVU0yTVRrMk5pMHlMakU4TDNCb2IzUnZjMmh2Y0RwSlEwTlFjbTltYVd4bFBnb2dJQ0FnSUNBZ0lDQThlRzF3VFUwNlNXNXpkR0Z1WTJWSlJENTRiWEF1YVdsa09tRmhZVEZqTVRRekxUVXdabVV0T1RRME15MWhOVGhtTFdFeU0yVmtOVE0zTURkbU1Ed3ZlRzF3VFUwNlNXNXpkR0Z1WTJWSlJENEtJQ0FnSUNBZ0lDQWdQSGh0Y0UxTk9rUnZZM1Z0Wlc1MFNVUStZV1J2WW1VNlpHOWphV1E2Y0dodmRHOXphRzl3T2pkbE56ZG1ZbVpqTFRnMVpEUXRNVEZsTmkxaFl6aG1MV0ZqTnpVMFpXUTFPRE0zWmp3dmVHMXdUVTA2Ukc5amRXMWxiblJKUkQ0S0lDQWdJQ0FnSUNBZ1BIaHRjRTFOT2s5eWFXZHBibUZzUkc5amRXMWxiblJKUkQ1NGJYQXVaR2xrT21NMVptTTBaR1l5TFRreFkyTXRaVEkwTVMwNFkyVmpMVE16T0RJeVkyUTFaV0ZsT1R3dmVHMXdUVTA2VDNKcFoybHVZV3hFYjJOMWJXVnVkRWxFUGdvZ0lDQWdJQ0FnSUNBOGVHMXdUVTA2U0dsemRHOXllVDRLSUNBZ0lDQWdJQ0FnSUNBZ1BISmtaanBUWlhFK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4eVpHWTZiR2tnY21SbU9uQmhjbk5sVkhsd1pUMGlVbVZ6YjNWeVkyVWlQZ29nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YzNSRmRuUTZZV04wYVc5dVBtTnlaV0YwWldROEwzTjBSWFowT21GamRHbHZiajRLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOMFJYWjBPbWx1YzNSaGJtTmxTVVErZUcxd0xtbHBaRHBqTldaak5HUm1NaTA1TVdOakxXVXlOREV0T0dObFl5MHpNemd5TW1Oa05XVmhaVGs4TDNOMFJYWjBPbWx1YzNSaGJtTmxTVVErQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emRFVjJkRHAzYUdWdVBqSXdNVFl0TURrdE1qaFVNVFk2TWpVNk16SXRNRGM2TURBOEwzTjBSWFowT25kb1pXNCtDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUGtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBeU1ERTFMalVnS0ZkcGJtUnZkM01wUEM5emRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBnb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwzSmtaanBzYVQ0S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhKa1pqcHNhU0J5WkdZNmNHRnljMlZVZVhCbFBTSlNaWE52ZFhKalpTSStDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6ZEVWMmREcGhZM1JwYjI0K1kyOXVkbVZ5ZEdWa1BDOXpkRVYyZERwaFkzUnBiMjQrQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emRFVjJkRHB3WVhKaGJXVjBaWEp6UG1aeWIyMGdZWEJ3YkdsallYUnBiMjR2ZG01a0xtRmtiMkpsTG5Cb2IzUnZjMmh2Y0NCMGJ5QnBiV0ZuWlM5d2JtYzhMM04wUlhaME9uQmhjbUZ0WlhSbGNuTStDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZjbVJtT214cFBnb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGNtUm1PbXhwSUhKa1pqcHdZWEp6WlZSNWNHVTlJbEpsYzI5MWNtTmxJajRLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOMFJYWjBPbUZqZEdsdmJqNXpZWFpsWkR3dmMzUkZkblE2WVdOMGFXOXVQZ29nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDU0YlhBdWFXbGtPbUZoWVRGak1UUXpMVFV3Wm1VdE9UUTBNeTFoTlRobUxXRXlNMlZrTlRNM01EZG1NRHd2YzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDRLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOMFJYWjBPbmRvWlc0K01qQXhOaTB3T1MweU9GUXhOam96TnpveU15MHdOem93TUR3dmMzUkZkblE2ZDJobGJqNEtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblErUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESURJd01UVXVOU0FvVjJsdVpHOTNjeWs4TDNOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5RK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpkRVYyZERwamFHRnVaMlZrUGk4OEwzTjBSWFowT21Ob1lXNW5aV1ErQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2Y21SbU9teHBQZ29nSUNBZ0lDQWdJQ0FnSUNBOEwzSmtaanBUWlhFK0NpQWdJQ0FnSUNBZ0lEd3ZlRzF3VFUwNlNHbHpkRzl5ZVQ0S0lDQWdJQ0FnSUNBZ1BIUnBabVk2VDNKcFpXNTBZWFJwYjI0K01Ud3ZkR2xtWmpwUGNtbGxiblJoZEdsdmJqNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNldGSmxjMjlzZFhScGIyNCtNekF3TURBd01DOHhNREF3TUR3dmRHbG1aanBZVW1WemIyeDFkR2x2Ymo0S0lDQWdJQ0FnSUNBZ1BIUnBabVk2V1ZKbGMyOXNkWFJwYjI0K016QXdNREF3TUM4eE1EQXdNRHd2ZEdsbVpqcFpVbVZ6YjJ4MWRHbHZiajRLSUNBZ0lDQWdJQ0FnUEhScFptWTZVbVZ6YjJ4MWRHbHZibFZ1YVhRK01qd3ZkR2xtWmpwU1pYTnZiSFYwYVc5dVZXNXBkRDRLSUNBZ0lDQWdJQ0FnUEdWNGFXWTZRMjlzYjNKVGNHRmpaVDR4UEM5bGVHbG1Pa052Ykc5eVUzQmhZMlUrQ2lBZ0lDQWdJQ0FnSUR4bGVHbG1PbEJwZUdWc1dFUnBiV1Z1YzJsdmJqNDJORHd2WlhocFpqcFFhWGhsYkZoRWFXMWxibk5wYjI0K0NpQWdJQ0FnSUNBZ0lEeGxlR2xtT2xCcGVHVnNXVVJwYldWdWMybHZiajR6TWp3dlpYaHBaanBRYVhobGJGbEVhVzFsYm5OcGIyNCtDaUFnSUNBZ0lEd3ZjbVJtT2tSbGMyTnlhWEIwYVc5dVBnb2dJQ0E4TDNKa1pqcFNSRVkrQ2p3dmVEcDRiWEJ0WlhSaFBnb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvOFAzaHdZV05yWlhRZ1pXNWtQU0ozSWo4K09oRjdSd0FBQUNCalNGSk5BQUI2SlFBQWdJTUFBUG4vQUFDQTZRQUFkVEFBQU9wZ0FBQTZtQUFBRjIrU1g4VkdBQUFBbEVsRVFWUjQydXpac1EzQUlBeEVVVHVUWkpSc2t0NUxSRm1DZFRMYXBVS0NCaWpvL0YwaG4yU2tKeElLWEpKbHJzT1NGd0FBQUFCQTZ2S0k2TzdCVW9yWGRadTEvVkVXRVplWmZiTjVtL1phbWpmSytBUUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFDQmZ1YVNuYTdpL2RkMW1iWCtVU1RyTjdKN04yN1RYMHJ4UnhnbmdaWWlmSUFBQUFKQzRmZ0FBQVAvL0F3QXVNVlB3MjBoeEN3QUFBQUJKUlU1RXJrSmdnZz09YDtcblxuICBjb25zdCB0ZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUoKTtcbiAgdGV4dHVyZS5pbWFnZSA9IGltYWdlO1xuICB0ZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgLy8gdGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5MaW5lYXJNaXBNYXBMaW5lYXJGaWx0ZXI7XG4gIC8vIHRleHR1cmUubWFnRmlsdGVyID0gVEhSRUUuTGluZWFyRmlsdGVyO1xuICAvLyB0ZXh0dXJlLmdlbmVyYXRlTWlwbWFwcyA9IGZhbHNlO1xuXG4gIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbiAgICAvLyBjb2xvcjogMHhmZjAwMDAsXG4gICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZSxcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICBtYXA6IHRleHR1cmVcbiAgfSk7XG4gIG1hdGVyaWFsLmFscGhhVGVzdCA9IDAuNTtcblxuICByZXR1cm4gZnVuY3Rpb24oKXtcbiAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KCBpbWFnZS53aWR0aCAvIDEwMDAsIGltYWdlLmhlaWdodCAvIDEwMDAsIDEsIDEgKTtcblxuICAgIGNvbnN0IG1lc2ggPSBuZXcgVEhSRUUuTWVzaCggZ2VvbWV0cnksIG1hdGVyaWFsICk7XG4gICAgcmV0dXJuIG1lc2g7XG4gIH1cblxufSgpKTtcblxuZXhwb3J0IGNvbnN0IGRvd25BcnJvdyA9IChmdW5jdGlvbigpe1xuICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuICBpbWFnZS5zcmMgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFJQUFBQUJBQ0FZQUFBRFMxbjkvQUFBQUNYQklXWE1BQUN4TEFBQXNTd0dsUFphcEFBQTRLMmxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NEtQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TXpJZ056a3VNVFU1TWpnMExDQXlNREUyTHpBMEx6RTVMVEV6T2pFek9qUXdJQ0FnSUNBZ0lDQWlQZ29nSUNBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBnb2dJQ0FnSUNBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlnb2dJQ0FnSUNBZ0lDQWdJQ0I0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUNpQWdJQ0FnSUNBZ0lDQWdJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SUtJQ0FnSUNBZ0lDQWdJQ0FnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJZ29nSUNBZ0lDQWdJQ0FnSUNCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJS0lDQWdJQ0FnSUNBZ0lDQWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SUtJQ0FnSUNBZ0lDQWdJQ0FnZUcxc2JuTTZkR2xtWmowaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTBhV1ptTHpFdU1DOGlDaUFnSUNBZ0lDQWdJQ0FnSUhodGJHNXpPbVY0YVdZOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZaWGhwWmk4eExqQXZJajRLSUNBZ0lDQWdJQ0FnUEhodGNEcERjbVZoZEc5eVZHOXZiRDVCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nTWpBeE5TNDFJQ2hYYVc1a2IzZHpLVHd2ZUcxd09rTnlaV0YwYjNKVWIyOXNQZ29nSUNBZ0lDQWdJQ0E4ZUcxd09rTnlaV0YwWlVSaGRHVStNakF4TmkweE1DMHhPRlF4Tnpvek16b3dOaTB3Tnpvd01Ed3ZlRzF3T2tOeVpXRjBaVVJoZEdVK0NpQWdJQ0FnSUNBZ0lEeDRiWEE2VFc5a2FXWjVSR0YwWlQ0eU1ERTJMVEV3TFRJd1ZESXhPakU0T2pJMUxUQTNPakF3UEM5NGJYQTZUVzlrYVdaNVJHRjBaVDRLSUNBZ0lDQWdJQ0FnUEhodGNEcE5aWFJoWkdGMFlVUmhkR1UrTWpBeE5pMHhNQzB5TUZReU1Ub3hPRG95TlMwd056b3dNRHd2ZUcxd09rMWxkR0ZrWVhSaFJHRjBaVDRLSUNBZ0lDQWdJQ0FnUEdSak9tWnZjbTFoZEQ1cGJXRm5aUzl3Ym1jOEwyUmpPbVp2Y20xaGRENEtJQ0FnSUNBZ0lDQWdQSEJvYjNSdmMyaHZjRHBEYjJ4dmNrMXZaR1UrTXp3dmNHaHZkRzl6YUc5d09rTnZiRzl5VFc5a1pUNEtJQ0FnSUNBZ0lDQWdQSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUStlRzF3TG1scFpEb3pNRFF5WWpJMFpTMWlNemMyTFdJME5HSXRPR0k0WXkxbFpURmpZMkl6WVdVMU1EVThMM2h0Y0UxTk9rbHVjM1JoYm1ObFNVUStDaUFnSUNBZ0lDQWdJRHg0YlhCTlRUcEViMk4xYldWdWRFbEVQbmh0Y0M1a2FXUTZNekEwTW1JeU5HVXRZak0zTmkxaU5EUmlMVGhpT0dNdFpXVXhZMk5pTTJGbE5UQTFQQzk0YlhCTlRUcEViMk4xYldWdWRFbEVQZ29nSUNBZ0lDQWdJQ0E4ZUcxd1RVMDZUM0pwWjJsdVlXeEViMk4xYldWdWRFbEVQbmh0Y0M1a2FXUTZNekEwTW1JeU5HVXRZak0zTmkxaU5EUmlMVGhpT0dNdFpXVXhZMk5pTTJGbE5UQTFQQzk0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUStDaUFnSUNBZ0lDQWdJRHg0YlhCTlRUcElhWE4wYjNKNVBnb2dJQ0FnSUNBZ0lDQWdJQ0E4Y21SbU9sTmxjVDRLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSEprWmpwc2FTQnlaR1k2Y0dGeWMyVlVlWEJsUFNKU1pYTnZkWEpqWlNJK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpkRVYyZERwaFkzUnBiMjQrWTNKbFlYUmxaRHd2YzNSRmRuUTZZV04wYVc5dVBnb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjM1JGZG5RNmFXNXpkR0Z1WTJWSlJENTRiWEF1YVdsa09qTXdOREppTWpSbExXSXpOell0WWpRMFlpMDRZamhqTFdWbE1XTmpZak5oWlRVd05Ud3ZjM1JGZG5RNmFXNXpkR0Z1WTJWSlJENEtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE4wUlhaME9uZG9aVzQrTWpBeE5pMHhNQzB4T0ZReE56b3pNem93Tmkwd056b3dNRHd2YzNSRmRuUTZkMmhsYmo0S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUStRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJREl3TVRVdU5TQW9WMmx1Wkc5M2N5azhMM04wUlhaME9uTnZablIzWVhKbFFXZGxiblErQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2Y21SbU9teHBQZ29nSUNBZ0lDQWdJQ0FnSUNBOEwzSmtaanBUWlhFK0NpQWdJQ0FnSUNBZ0lEd3ZlRzF3VFUwNlNHbHpkRzl5ZVQ0S0lDQWdJQ0FnSUNBZ1BIUnBabVk2VDNKcFpXNTBZWFJwYjI0K01Ud3ZkR2xtWmpwUGNtbGxiblJoZEdsdmJqNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNldGSmxjMjlzZFhScGIyNCtNamc0TURBd01DOHhNREF3TUR3dmRHbG1aanBZVW1WemIyeDFkR2x2Ymo0S0lDQWdJQ0FnSUNBZ1BIUnBabVk2V1ZKbGMyOXNkWFJwYjI0K01qZzRNREF3TUM4eE1EQXdNRHd2ZEdsbVpqcFpVbVZ6YjJ4MWRHbHZiajRLSUNBZ0lDQWdJQ0FnUEhScFptWTZVbVZ6YjJ4MWRHbHZibFZ1YVhRK01qd3ZkR2xtWmpwU1pYTnZiSFYwYVc5dVZXNXBkRDRLSUNBZ0lDQWdJQ0FnUEdWNGFXWTZRMjlzYjNKVGNHRmpaVDQyTlRVek5Ud3ZaWGhwWmpwRGIyeHZjbE53WVdObFBnb2dJQ0FnSUNBZ0lDQThaWGhwWmpwUWFYaGxiRmhFYVcxbGJuTnBiMjQrTVRJNFBDOWxlR2xtT2xCcGVHVnNXRVJwYldWdWMybHZiajRLSUNBZ0lDQWdJQ0FnUEdWNGFXWTZVR2w0Wld4WlJHbHRaVzV6YVc5dVBqWTBQQzlsZUdsbU9sQnBlR1ZzV1VScGJXVnVjMmx2Ymo0S0lDQWdJQ0FnUEM5eVpHWTZSR1Z6WTNKcGNIUnBiMjQrQ2lBZ0lEd3ZjbVJtT2xKRVJqNEtQQzk0T25odGNHMWxkR0UrQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDancvZUhCaFkydGxkQ0JsYm1ROUluY2lQejVVaWx6MEFBQUFJR05JVWswQUFIb2xBQUNBZ3dBQStmOEFBSURwQUFCMU1BQUE2bUFBQURxWUFBQVhiNUpmeFVZQUFBSmRTVVJCVkhqYTdOM0xjY0pBRUlUaFJ1VzduY1VlVFFoa1FBaUlETWdJaFVJSWNGUVdKZ0o4OEZLbG92d0FyTjJkNlo0NWNaR0EvVDl2aVlmdHhlVnlRWXp1ZExFRUFTQW1BTVFFZ0JqSmVXbDF4eW1sTndBSEFNZHhISHZGeFU4cERRQ1dBRmJqT0g3STdBQ1QrTzhBTm5raEZPTnY4aG9jOHByd0E3aUpmeDBwQkpQNDEybUdvRE1RWHdyQk4vR2JJdWlNeEpkQThFdjhaZ2c2US9HcEVkd1J2d21DemxoOFNnUVB4SytPb01ZT01Ed1lud3JCRS9HbkNBYlhBUEtUWC8vakZKdVVVdTg0ZnY5ay9PdXNTLzhRZEFibDM4N2VJNEw4bVBjem5Lcm9UbGh5QjFqT2VDNVhDR2FNWDJJdHF3RllBVGlwSVNnUS81VFgwaGVBL042MkZJSlM4VXQrVGxEMElsQUpnY2Y0VlY0R0tpRHdHci9XK3dEVUNEekhyd2FBRllIMytGVUJzQ0ZnaUY4ZEFBc0NsdmhOQUhoSHdCUy9HUUN2Q05qaU53WGdEUUZqL09ZQXZDQmdqVzhDZ0hVRXpQSE5BTENLZ0QyK0tRRFdFQ2pFTndmQUNnS1YrQ1lCVEJEMEFNNjFFUlNJZndiUVc0eHZGa0JHY013N1FUVUVoZUt2OG5OQkFEQ01RREcrZVFDMUVLakdCNENGbDc4UmxGSmE0dXNYVEY3bmpKUnZ6MzVlRC9GZEFTaUlBS3J4M1FFb2hBQ3E4VjFjQTFTNkpwQ003eEtBUVFSdTQ3c0ZZQWlCNi9pdUFSaEE0RDYrZXdBTkVWREVwd0RRQUFGTmZCb0FGUkZReGFjQ1VBRUJYWHc2QUFVUlVNYW5CRkFBQVcxOFdnQXpJcUNPVHcxZ0JnVDA4ZWtCVEJEc25qaDB4eDVmQWtCR01BRFlQbkRJTmgrREFLQ0hRQ2ErRklBN0VVakZsd1B3QndLNStKSUFma0FnR1I5dytKV3dPZWY2eldEVitQSUFZdUxmeGdXQVdJSUFFQk1BWWdKQWpPUjhEZ0QrNk96Z3Y0dXk5Z0FBQUFCSlJVNUVya0pnZ2c9PSc7XG5cbiAgY29uc3QgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKCk7XG4gIHRleHR1cmUuaW1hZ2UgPSBpbWFnZTtcbiAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG4gIHRleHR1cmUubWluRmlsdGVyID0gVEhSRUUuTGluZWFyTWlwTWFwTGluZWFyRmlsdGVyO1xuICB0ZXh0dXJlLm1hZ0ZpbHRlciA9IFRIUkVFLkxpbmVhckZpbHRlcjtcbiAgLy8gdGV4dHVyZS5hbmlzb3Ryb3BpY1xuICAvLyB0ZXh0dXJlLmdlbmVyYXRlTWlwbWFwcyA9IGZhbHNlO1xuXG4gIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbiAgICAvLyBjb2xvcjogMHhmZjAwMDAsXG4gICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZSxcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICBtYXA6IHRleHR1cmVcbiAgfSk7XG4gIG1hdGVyaWFsLmFscGhhVGVzdCA9IDAuMjtcblxuICByZXR1cm4gZnVuY3Rpb24oKXtcbiAgICBjb25zdCBoID0gMC4zO1xuICAgIGNvbnN0IGdlbyA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KCBpbWFnZS53aWR0aCAvIDEwMDAgKiBoLCBpbWFnZS5oZWlnaHQgLyAxMDAwICogaCwgMSwgMSApO1xuICAgIGdlby50cmFuc2xhdGUoIC0wLjAwNSwgLTAuMDA0LCAwICk7XG4gICAgcmV0dXJuIG5ldyBUSFJFRS5NZXNoKCBnZW8sIG1hdGVyaWFsICk7XG4gIH1cbn0oKSk7XG5cblxuZXhwb3J0IGNvbnN0IGNoZWNrbWFyayA9IChmdW5jdGlvbigpe1xuICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuICBpbWFnZS5zcmMgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFJQUFBQUJBQ0FZQUFBRFMxbjkvQUFBQUNYQklXWE1BQUN4TEFBQXNTd0dsUFphcEFBQTRLMmxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NEtQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TXpJZ056a3VNVFU1TWpnMExDQXlNREUyTHpBMEx6RTVMVEV6T2pFek9qUXdJQ0FnSUNBZ0lDQWlQZ29nSUNBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBnb2dJQ0FnSUNBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlnb2dJQ0FnSUNBZ0lDQWdJQ0I0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUNpQWdJQ0FnSUNBZ0lDQWdJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SUtJQ0FnSUNBZ0lDQWdJQ0FnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJZ29nSUNBZ0lDQWdJQ0FnSUNCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJS0lDQWdJQ0FnSUNBZ0lDQWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SUtJQ0FnSUNBZ0lDQWdJQ0FnZUcxc2JuTTZkR2xtWmowaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTBhV1ptTHpFdU1DOGlDaUFnSUNBZ0lDQWdJQ0FnSUhodGJHNXpPbVY0YVdZOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZaWGhwWmk4eExqQXZJajRLSUNBZ0lDQWdJQ0FnUEhodGNEcERjbVZoZEc5eVZHOXZiRDVCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nTWpBeE5TNDFJQ2hYYVc1a2IzZHpLVHd2ZUcxd09rTnlaV0YwYjNKVWIyOXNQZ29nSUNBZ0lDQWdJQ0E4ZUcxd09rTnlaV0YwWlVSaGRHVStNakF4TmkweE1DMHhPRlF4Tnpvek16b3dOaTB3Tnpvd01Ed3ZlRzF3T2tOeVpXRjBaVVJoZEdVK0NpQWdJQ0FnSUNBZ0lEeDRiWEE2VFc5a2FXWjVSR0YwWlQ0eU1ERTJMVEV3TFRJd1ZESXhPak16T2pVekxUQTNPakF3UEM5NGJYQTZUVzlrYVdaNVJHRjBaVDRLSUNBZ0lDQWdJQ0FnUEhodGNEcE5aWFJoWkdGMFlVUmhkR1UrTWpBeE5pMHhNQzB5TUZReU1Ub3pNem8xTXkwd056b3dNRHd2ZUcxd09rMWxkR0ZrWVhSaFJHRjBaVDRLSUNBZ0lDQWdJQ0FnUEdSak9tWnZjbTFoZEQ1cGJXRm5aUzl3Ym1jOEwyUmpPbVp2Y20xaGRENEtJQ0FnSUNBZ0lDQWdQSEJvYjNSdmMyaHZjRHBEYjJ4dmNrMXZaR1UrTXp3dmNHaHZkRzl6YUc5d09rTnZiRzl5VFc5a1pUNEtJQ0FnSUNBZ0lDQWdQSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUStlRzF3TG1scFpEbzJPRGN4WVRrNVl5MHpOakU1TFRsa05HRXRPRGRrTmkwd1lXRTVZVFJpTldVNE1qYzhMM2h0Y0UxTk9rbHVjM1JoYm1ObFNVUStDaUFnSUNBZ0lDQWdJRHg0YlhCTlRUcEViMk4xYldWdWRFbEVQbmh0Y0M1a2FXUTZOamczTVdFNU9XTXRNell4T1MwNVpEUmhMVGczWkRZdE1HRmhPV0UwWWpWbE9ESTNQQzk0YlhCTlRUcEViMk4xYldWdWRFbEVQZ29nSUNBZ0lDQWdJQ0E4ZUcxd1RVMDZUM0pwWjJsdVlXeEViMk4xYldWdWRFbEVQbmh0Y0M1a2FXUTZOamczTVdFNU9XTXRNell4T1MwNVpEUmhMVGczWkRZdE1HRmhPV0UwWWpWbE9ESTNQQzk0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUStDaUFnSUNBZ0lDQWdJRHg0YlhCTlRUcElhWE4wYjNKNVBnb2dJQ0FnSUNBZ0lDQWdJQ0E4Y21SbU9sTmxjVDRLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSEprWmpwc2FTQnlaR1k2Y0dGeWMyVlVlWEJsUFNKU1pYTnZkWEpqWlNJK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpkRVYyZERwaFkzUnBiMjQrWTNKbFlYUmxaRHd2YzNSRmRuUTZZV04wYVc5dVBnb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjM1JGZG5RNmFXNXpkR0Z1WTJWSlJENTRiWEF1YVdsa09qWTROekZoT1RsakxUTTJNVGt0T1dRMFlTMDROMlEyTFRCaFlUbGhOR0kxWlRneU56d3ZjM1JGZG5RNmFXNXpkR0Z1WTJWSlJENEtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE4wUlhaME9uZG9aVzQrTWpBeE5pMHhNQzB4T0ZReE56b3pNem93Tmkwd056b3dNRHd2YzNSRmRuUTZkMmhsYmo0S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUStRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJREl3TVRVdU5TQW9WMmx1Wkc5M2N5azhMM04wUlhaME9uTnZablIzWVhKbFFXZGxiblErQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2Y21SbU9teHBQZ29nSUNBZ0lDQWdJQ0FnSUNBOEwzSmtaanBUWlhFK0NpQWdJQ0FnSUNBZ0lEd3ZlRzF3VFUwNlNHbHpkRzl5ZVQ0S0lDQWdJQ0FnSUNBZ1BIUnBabVk2VDNKcFpXNTBZWFJwYjI0K01Ud3ZkR2xtWmpwUGNtbGxiblJoZEdsdmJqNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNldGSmxjMjlzZFhScGIyNCtNamc0TURBd01DOHhNREF3TUR3dmRHbG1aanBZVW1WemIyeDFkR2x2Ymo0S0lDQWdJQ0FnSUNBZ1BIUnBabVk2V1ZKbGMyOXNkWFJwYjI0K01qZzRNREF3TUM4eE1EQXdNRHd2ZEdsbVpqcFpVbVZ6YjJ4MWRHbHZiajRLSUNBZ0lDQWdJQ0FnUEhScFptWTZVbVZ6YjJ4MWRHbHZibFZ1YVhRK01qd3ZkR2xtWmpwU1pYTnZiSFYwYVc5dVZXNXBkRDRLSUNBZ0lDQWdJQ0FnUEdWNGFXWTZRMjlzYjNKVGNHRmpaVDQyTlRVek5Ud3ZaWGhwWmpwRGIyeHZjbE53WVdObFBnb2dJQ0FnSUNBZ0lDQThaWGhwWmpwUWFYaGxiRmhFYVcxbGJuTnBiMjQrTVRJNFBDOWxlR2xtT2xCcGVHVnNXRVJwYldWdWMybHZiajRLSUNBZ0lDQWdJQ0FnUEdWNGFXWTZVR2w0Wld4WlJHbHRaVzV6YVc5dVBqWTBQQzlsZUdsbU9sQnBlR1ZzV1VScGJXVnVjMmx2Ymo0S0lDQWdJQ0FnUEM5eVpHWTZSR1Z6WTNKcGNIUnBiMjQrQ2lBZ0lEd3ZjbVJtT2xKRVJqNEtQQzk0T25odGNHMWxkR0UrQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDancvZUhCaFkydGxkQ0JsYm1ROUluY2lQejV6OVJUM0FBQUFJR05JVWswQUFIb2xBQUNBZ3dBQStmOEFBSURwQUFCMU1BQUE2bUFBQURxWUFBQVhiNUpmeFVZQUFBVHRTVVJCVkhqYTdKemJiNVJGR01aLzJ4YkN2VmhBU0V4VWlJMTQ0dzBoUXRIRUdySGdJU3FnTjZLZ3ROWVdBYjB3MFdvMVhxcmJQYlNsb2tZU3hmTWhlbVgvQWE3d0dBVnE4WFRwMzBEWGk1bUptMGEydTl2My9iNloyWGx1ZHJPSGR3L1BNelBQKzc0elg2RldxeUdGZ1lFQkVscEdEL0FlY0N0d0IvRGJjbStZbTVzVCsvQ3U5UC9uaW02Z0NEd0NYQXQ4RFZ5WDVSZElBc2dQQmFBRWpOUTlkaVB3RmJBNUNTQitUQUZQL2Mvalc0SFBnTDRrZ0hneEN3dzFlUDVtNEdON213UVFFYm9zK1U4MDhkcXR3RWYyTmdrZ0VyYy8weVQ1RG4xMk9kaVNCQkErK2FVV3lYZllBbndEWEo4RUVHNnFOd2tNcnlER1pwc2kzcEFFRUI2cVYzRDdyYUlQK05LbWlra0FnZUF0NEloZ3ZKdnNUSkFFNERrS3dDbmdzRUxzczBrQS9xLzVzOEFoaGRqVHdFRnBkNW9nUzM1VmFlVFBBazhEaTBrQS9wSmZFbDd6SFU3U3VIS1lsZ0FQMXZ5eWtOdGZpaGt0OHBNQVpFa2FWb2hiVllxYkJDQ0lVOENUQ25GTHdKajJsMDhDV05tYS83YVMyNjhDeDZRTlh4S0FySG1lQmg1WFdrN0dzaUEvVHdHTVlmYS9oVXArbWZZYU84MjQvZUdzeU05TEFDOWdtaVB2QXpzREk3L0xyczFEU2lOL0tJOGZsQ1hHZ1ZmdC9WN2dETEFySUFGTWgrcjJmUkRBUzhERWtzYzJBaDhDL1IzczlzdkFhSjVUV2xia3YzeUY1OVpqZHIxczkzamExM0w3RmV2MmF6RUxZTHdCK1E1ck1iM3ViUjRhdnBOS2JuOGFlQWE0bkxlNnRRM2ZSSk92N1FXKzhHZ202TEVqVktPeE00TTVEM0E1N3grcEtZQVg2d3hmczlnQWZBTHM4SUI4cmNhT0t4dlhmRkM1bGdER2dWZmFmSzh6aHJ0eS9FKzBYSGtsTDdlZnBRQW1XcGoybHhQQmJUbjhKN1BvMWZaSDhRelNBbmpOam40SnJNZWNqc21xV0ZRQTNsVnkreVhyOW9sZEFIY0t4N3NhK0R3RFk5aGo4L3lEaXFuZVlpY0k0RkhnUitHWWE1V3pBODNHemhSdzFGZnlOUVR3QzNDUHZaWEVPdUJUekVVVUpMRXFnMVRQVy9LMVRPQ2Z3Q0J3VVRqdU5jaVdqYnN4WlZpTlZDKzMycjR2YWVBZndGM0FnbkRjVFZZRXR3dU5VQTN5eTVqZHUzU3lBQUIrQjNZckxBY2JCT29FN3loTis1TjJ6U2NKd0dBZWVBRDRUamh1TDZhQjFLb242TGJrUDZZMDhvL2pTWVhQRndFQW5BY2VWaERCVlMxbUI2NnhvMEgrRktheHMwaGd5S29kZkFGNEVQaEpxVTZ3M0V5d3locXpRMHJrajRSSWZwWUNBTGdFN0xFemdpUmN4YkMvd2Npdm9GUGVkZVFIaTZ5M2hQMWxqZUc4VW9xNE5Ec29ZSW84V2p0NWdpWS9Ed0hVcDRpL0ttUUhaK3BFVU1EczVORncrMFV5T0xRUnF3RGNjbkF2OEwxdzNIWEFhWnNpdnE1aytJckFDU0pCbnFlRDU0RUR3QWZBTFlKeE53SGZLcG15c2lWL01SWUI1SDB5NkFLd0gvaEJPTzVxWUkyQzRUc2FFL2srQ0FETTFiSDNJbDh4bEVUVkdyNGFrY0dYczRGL0EzZmJHY0UzVkFpb3RoK3FBTUIwRVhkN0pvSkpQTnpHRmFzQXdEU1FCcEhmVk5LdTJ6OUc1UER4ZVBnQzhCQndMdWVSZnlMR05UOEVBWURaVEhJQStRWlNzMnYrOGRqY2ZtZ0NjSFdDKzVGdklDM245a2M3aFh6ZkJlQ000UjdreThZZDUvWkRGUUQ4MTBDNnFQZ1owYnY5a0FWUW55SnFGSXZleEd6bUlBbkFiMXdDN2hNMmhrWGdXVG9Zb1YwbHpEV1FKRkxFNkJvN25TQUFseUx1WTJVTnBBb1pYb290Q1VBZUM1Z0cwczl0a2o5S1F0QUNBTk5BR3FTMVBZYWxSSDQ4QW5BcFlyUGJ5NG9FZG1nakNhRDVGSEV2amJlWHZZRXA3eVpFS0FEbkNmWmJFZndEUEk4NUwrRElmNDRPYU95MGczOEhBTS9lN2d1SVJ4OTRBQUFBQUVsRlRrU3VRbUNDJztcblxuICBjb25zdCB0ZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUoKTtcbiAgdGV4dHVyZS5pbWFnZSA9IGltYWdlO1xuICB0ZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgdGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5MaW5lYXJNaXBNYXBMaW5lYXJGaWx0ZXI7XG4gIHRleHR1cmUubWFnRmlsdGVyID0gVEhSRUUuTGluZWFyRmlsdGVyO1xuICAvLyB0ZXh0dXJlLmFuaXNvdHJvcGljXG4gIC8vIHRleHR1cmUuZ2VuZXJhdGVNaXBtYXBzID0gZmFsc2U7XG5cbiAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe1xuICAgIC8vIGNvbG9yOiAweGZmMDAwMCxcbiAgICBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLFxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxuICAgIG1hcDogdGV4dHVyZVxuICB9KTtcbiAgbWF0ZXJpYWwuYWxwaGFUZXN0ID0gMC4yO1xuXG4gIHJldHVybiBmdW5jdGlvbigpe1xuICAgIGNvbnN0IGggPSAwLjQ7XG4gICAgY29uc3QgZ2VvID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoIGltYWdlLndpZHRoIC8gMTAwMCAqIGgsIGltYWdlLmhlaWdodCAvIDEwMDAgKiBoLCAxLCAxICk7XG4gICAgZ2VvLnRyYW5zbGF0ZSggMC4wMjUsIDAsIDAgKTtcbiAgICByZXR1cm4gbmV3IFRIUkVFLk1lc2goIGdlbywgbWF0ZXJpYWwgKTtcbiAgfVxufSgpKTsiLCIvKipcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXG4qXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxuKlxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuKlxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4qXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbmltcG9ydCBFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgY3JlYXRlU2xpZGVyIGZyb20gJy4vc2xpZGVyJztcbmltcG9ydCBjcmVhdGVDaGVja2JveCBmcm9tICcuL2NoZWNrYm94JztcbmltcG9ydCBjcmVhdGVCdXR0b24gZnJvbSAnLi9idXR0b24nO1xuaW1wb3J0IGNyZWF0ZUZvbGRlciBmcm9tICcuL2ZvbGRlcic7XG5pbXBvcnQgY3JlYXRlRHJvcGRvd24gZnJvbSAnLi9kcm9wZG93bic7XG5pbXBvcnQgKiBhcyBTREZUZXh0IGZyb20gJy4vc2RmdGV4dCc7XG5cbmNvbnN0IEdVSVZSID0gKGZ1bmN0aW9uIERBVEdVSVZSKCl7XG5cbiAgLypcbiAgICBTREYgZm9udFxuICAqL1xuICBjb25zdCB0ZXh0Q3JlYXRvciA9IFNERlRleHQuY3JlYXRvcigpO1xuXG5cbiAgLypcbiAgICBMaXN0cy5cbiAgICBJbnB1dE9iamVjdHMgYXJlIHRoaW5ncyBsaWtlIFZJVkUgY29udHJvbGxlcnMsIGNhcmRib2FyZCBoZWFkc2V0cywgZXRjLlxuICAgIENvbnRyb2xsZXJzIGFyZSB0aGUgREFUIEdVSSBzbGlkZXJzLCBjaGVja2JveGVzLCBldGMuXG4gICAgSGl0c2Nhbk9iamVjdHMgYXJlIGFueXRoaW5nIHJheWNhc3RzIHdpbGwgaGl0LXRlc3QgYWdhaW5zdC5cbiAgKi9cbiAgY29uc3QgaW5wdXRPYmplY3RzID0gW107XG4gIGNvbnN0IGNvbnRyb2xsZXJzID0gW107XG4gIGNvbnN0IGhpdHNjYW5PYmplY3RzID0gW107IC8vWFhYOiB0aGlzIGlzIGN1cnJlbnRseSBub3QgdXNlZC5cblxuICAvKlxuICAgIEZ1bmN0aW9ucyBmb3IgZGV0ZXJtaW5pbmcgd2hldGhlciBhIGdpdmVuIGNvbnRyb2xsZXIgaXMgdmlzaWJsZSAoYnkgd2hpY2ggd2VcbiAgICBtZWFuIG5vdCBoaWRkZW4sIG5vdCAndmlzaWJsZScgaW4gdGVybXMgb2YgdGhlIGNhbWVyYSBvcmllbnRhdGlvbiBldGMpLCBhbmRcbiAgICBmb3IgcmV0cmlldmluZyB0aGUgbGlzdCBvZiB2aXNpYmxlIGhpdHNjYW5PYmplY3RzIGR5bmFtaWNhbGx5LlxuICAgIFRoaXMgbWlnaHQgYmVuZWZpdCBmcm9tIHNvbWUgY2FjaGluZyBlc3BlY2lhbGx5IGluIGNhc2VzIHdpdGggbGFyZ2UgY29tcGxleCBHVUlzLlxuICAgIEkgaGF2ZW4ndCBtZWFzdXJlZCB0aGUgaW1wYWN0IG9mIGdhcmJhZ2UgY29sbGVjdGlvbiBldGMuXG4gICovXG4gIGZ1bmN0aW9uIGlzQ29udHJvbGxlclZpc2libGUoY29udHJvbCkge1xuICAgIGlmICghY29udHJvbC52aXNpYmxlKSByZXR1cm4gZmFsc2U7XG4gICAgdmFyIGZvbGRlciA9IGNvbnRyb2wuZm9sZGVyO1xuICAgIHdoaWxlIChmb2xkZXIuZm9sZGVyICE9PSBmb2xkZXIpe1xuICAgICAgZm9sZGVyID0gZm9sZGVyLmZvbGRlcjtcbiAgICAgIGlmIChmb2xkZXIuaXNDb2xsYXBzZWQoKSB8fCAhZm9sZGVyLnZpc2libGUpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0VmlzaWJsZUNvbnRyb2xsZXJzKCkge1xuICAgIC8vIG5vdCB0ZXJyaWJseSBlZmZpY2llbnRcbiAgICByZXR1cm4gY29udHJvbGxlcnMuZmlsdGVyKCBpc0NvbnRyb2xsZXJWaXNpYmxlICk7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0VmlzaWJsZUhpdHNjYW5PYmplY3RzKCkge1xuICAgIGNvbnN0IHRtcCA9IGdldFZpc2libGVDb250cm9sbGVycygpLm1hcCggbyA9PiB7IHJldHVybiBvLmhpdHNjYW47IH0gKVxuICAgIHJldHVybiB0bXAucmVkdWNlKChhLCBiKSA9PiB7IHJldHVybiBhLmNvbmNhdChiKX0sIFtdKTtcbiAgfVxuXG4gIGxldCBtb3VzZUVuYWJsZWQgPSBmYWxzZTtcbiAgbGV0IG1vdXNlUmVuZGVyZXIgPSB1bmRlZmluZWQ7XG5cbiAgZnVuY3Rpb24gZW5hYmxlTW91c2UoIGNhbWVyYSwgcmVuZGVyZXIgKXtcbiAgICBtb3VzZUVuYWJsZWQgPSB0cnVlO1xuICAgIG1vdXNlUmVuZGVyZXIgPSByZW5kZXJlcjtcbiAgICBtb3VzZUlucHV0Lm1vdXNlQ2FtZXJhID0gY2FtZXJhO1xuICAgIHJldHVybiBtb3VzZUlucHV0Lmxhc2VyO1xuICB9XG5cbiAgZnVuY3Rpb24gZGlzYWJsZU1vdXNlKCl7XG4gICAgbW91c2VFbmFibGVkID0gZmFsc2U7XG4gIH1cblxuXG4gIC8qXG4gICAgVGhlIGRlZmF1bHQgbGFzZXIgcG9pbnRlciBjb21pbmcgb3V0IG9mIGVhY2ggSW5wdXRPYmplY3QuXG4gICovXG4gIGNvbnN0IGxhc2VyTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoe2NvbG9yOjB4NTVhYWZmLCB0cmFuc3BhcmVudDogdHJ1ZSwgYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcgfSk7XG4gIGZ1bmN0aW9uIGNyZWF0ZUxhc2VyKCl7XG4gICAgY29uc3QgZyA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xuICAgIGcudmVydGljZXMucHVzaCggbmV3IFRIUkVFLlZlY3RvcjMoKSApO1xuICAgIGcudmVydGljZXMucHVzaCggbmV3IFRIUkVFLlZlY3RvcjMoMCwwLDApICk7XG4gICAgcmV0dXJuIG5ldyBUSFJFRS5MaW5lKCBnLCBsYXNlck1hdGVyaWFsICk7XG4gIH1cblxuXG5cblxuXG4gIC8qXG4gICAgQSBcImN1cnNvclwiLCBlZyB0aGUgYmFsbCB0aGF0IGFwcGVhcnMgYXQgdGhlIGVuZCBvZiB5b3VyIGxhc2VyLlxuICAqL1xuICBjb25zdCBjdXJzb3JNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7Y29sb3I6MHg0NDQ0NDQsIHRyYW5zcGFyZW50OiB0cnVlLCBibGVuZGluZzogVEhSRUUuQWRkaXRpdmVCbGVuZGluZyB9ICk7XG4gIGZ1bmN0aW9uIGNyZWF0ZUN1cnNvcigpe1xuICAgIHJldHVybiBuZXcgVEhSRUUuTWVzaCggbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KDAuMDA2LCA0LCA0ICksIGN1cnNvck1hdGVyaWFsICk7XG4gIH1cblxuXG5cblxuICAvKlxuICAgIENyZWF0ZXMgYSBnZW5lcmljIElucHV0IHR5cGUuXG4gICAgVGFrZXMgYW55IFRIUkVFLk9iamVjdDNEIHR5cGUgb2JqZWN0IGFuZCB1c2VzIGl0cyBwb3NpdGlvblxuICAgIGFuZCBvcmllbnRhdGlvbiBhcyBhbiBpbnB1dCBkZXZpY2UuXG5cbiAgICBBIGxhc2VyIHBvaW50ZXIgaXMgaW5jbHVkZWQgYW5kIHdpbGwgYmUgdXBkYXRlZC5cbiAgICBDb250YWlucyBzdGF0ZSBhYm91dCB3aGljaCBJbnRlcmFjdGlvbiBpcyBjdXJyZW50bHkgYmVpbmcgdXNlZCBvciBob3Zlci5cbiAgKi9cbiAgZnVuY3Rpb24gY3JlYXRlSW5wdXQoIGlucHV0T2JqZWN0ID0gbmV3IFRIUkVFLkdyb3VwKCkgKXtcbiAgICBjb25zdCBpbnB1dCA9IHtcbiAgICAgIHJheWNhc3Q6IG5ldyBUSFJFRS5SYXljYXN0ZXIoIG5ldyBUSFJFRS5WZWN0b3IzKCksIG5ldyBUSFJFRS5WZWN0b3IzKCkgKSxcbiAgICAgIGxhc2VyOiBjcmVhdGVMYXNlcigpLFxuICAgICAgY3Vyc29yOiBjcmVhdGVDdXJzb3IoKSxcbiAgICAgIG9iamVjdDogaW5wdXRPYmplY3QsXG4gICAgICBwcmVzc2VkOiBmYWxzZSxcbiAgICAgIGdyaXBwZWQ6IGZhbHNlLFxuICAgICAgZXZlbnRzOiBuZXcgRW1pdHRlcigpLFxuICAgICAgaW50ZXJhY3Rpb246IHtcbiAgICAgICAgZ3JpcDogdW5kZWZpbmVkLFxuICAgICAgICBwcmVzczogdW5kZWZpbmVkLFxuICAgICAgICBob3ZlcjogdW5kZWZpbmVkXG4gICAgICB9XG4gICAgfTtcblxuICAgIGlucHV0Lmxhc2VyLmFkZCggaW5wdXQuY3Vyc29yICk7XG5cbiAgICByZXR1cm4gaW5wdXQ7XG4gIH1cblxuXG5cblxuXG4gIC8qXG4gICAgTW91c2VJbnB1dC5cbiAgICBBbGxvd3MgeW91IHRvIGNsaWNrIG9uIHRoZSBzY3JlZW4gd2hlbiBub3QgaW4gVlIgZm9yIGRlYnVnZ2luZy5cbiAgKi9cbiAgY29uc3QgbW91c2VJbnB1dCA9IGNyZWF0ZU1vdXNlSW5wdXQoKTtcblxuICBmdW5jdGlvbiBjcmVhdGVNb3VzZUlucHV0KCl7XG4gICAgY29uc3QgbW91c2UgPSBuZXcgVEhSRUUuVmVjdG9yMigtMSwtMSk7XG5cbiAgICBjb25zdCBpbnB1dCA9IGNyZWF0ZUlucHV0KCk7XG4gICAgaW5wdXQubW91c2UgPSBtb3VzZTtcbiAgICBpbnB1dC5tb3VzZUludGVyc2VjdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gICAgaW5wdXQubW91c2VPZmZzZXQgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICAgIGlucHV0Lm1vdXNlUGxhbmUgPSBuZXcgVEhSRUUuUGxhbmUoKTtcbiAgICBpbnB1dC5pbnRlcnNlY3Rpb25zID0gW107XG5cbiAgICAvLyAgc2V0IG15IGVuYWJsZU1vdXNlXG4gICAgaW5wdXQubW91c2VDYW1lcmEgPSB1bmRlZmluZWQ7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlbW92ZScsIGZ1bmN0aW9uKCBldmVudCApe1xuICAgICAgLy8gaWYgYSBzcGVjaWZpYyByZW5kZXJlciBoYXMgYmVlbiBkZWZpbmVkXG4gICAgICBpZiAobW91c2VSZW5kZXJlcikge1xuICAgICAgICBjb25zdCBjbGllbnRSZWN0ID0gbW91c2VSZW5kZXJlci5kb21FbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBtb3VzZS54ID0gKCAoZXZlbnQuY2xpZW50WCAtIGNsaWVudFJlY3QubGVmdCkgLyBjbGllbnRSZWN0LndpZHRoKSAqIDIgLSAxO1xuICAgICAgICBtb3VzZS55ID0gLSAoIChldmVudC5jbGllbnRZIC0gY2xpZW50UmVjdC50b3ApIC8gY2xpZW50UmVjdC5oZWlnaHQpICogMiArIDE7XG4gICAgICB9XG4gICAgICAvLyBkZWZhdWx0IHRvIGZ1bGxzY3JlZW5cbiAgICAgIGVsc2Uge1xuICAgICAgICBtb3VzZS54ID0gKCBldmVudC5jbGllbnRYIC8gd2luZG93LmlubmVyV2lkdGggKSAqIDIgLSAxO1xuICAgICAgICBtb3VzZS55ID0gLSAoIGV2ZW50LmNsaWVudFkgLyB3aW5kb3cuaW5uZXJIZWlnaHQgKSAqIDIgKyAxO1xuICAgICAgfVxuXG4gICAgfSwgZmFsc2UgKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vkb3duJywgZnVuY3Rpb24oIGV2ZW50ICl7XG4gICAgICBpZiAoaW5wdXQuaW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIHByZXZlbnQgbW91c2UgZG93biBmcm9tIHRyaWdnZXJpbmcgb3RoZXIgbGlzdGVuZXJzIChwb2x5ZmlsbCwgZXRjKVxuICAgICAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgaW5wdXQucHJlc3NlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSwgdHJ1ZSApO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZXVwJywgZnVuY3Rpb24oIGV2ZW50ICl7XG4gICAgICBpbnB1dC5wcmVzc2VkID0gZmFsc2U7XG4gICAgfSwgZmFsc2UgKTtcblxuXG4gICAgcmV0dXJuIGlucHV0O1xuICB9XG5cblxuXG5cblxuICAvKlxuICAgIFB1YmxpYyBmdW5jdGlvbiB1c2VycyBydW4gdG8gZ2l2ZSBEQVQgR1VJIGFuIGlucHV0IGRldmljZS5cbiAgICBBdXRvbWF0aWNhbGx5IGRldGVjdHMgZm9yIFZpdmVDb250cm9sbGVyIGFuZCBiaW5kcyBidXR0b25zICsgaGFwdGljIGZlZWRiYWNrLlxuXG4gICAgUmV0dXJucyBhIGxhc2VyIHBvaW50ZXIgc28gaXQgY2FuIGJlIGRpcmVjdGx5IGFkZGVkIHRvIHNjZW5lLlxuXG4gICAgVGhlIGxhc2VyIHdpbGwgdGhlbiBoYXZlIHR3byBtZXRob2RzOlxuICAgIGxhc2VyLnByZXNzZWQoKSwgbGFzZXIuZ3JpcHBlZCgpXG5cbiAgICBUaGVzZSBjYW4gdGhlbiBiZSBib3VuZCB0byBhbnkgYnV0dG9uIHRoZSB1c2VyIHdhbnRzLiBVc2VmdWwgZm9yIGJpbmRpbmcgdG9cbiAgICBjYXJkYm9hcmQgb3IgYWx0ZXJuYXRlIGlucHV0IGRldmljZXMuXG5cbiAgICBGb3IgZXhhbXBsZS4uLlxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlZG93bicsIGZ1bmN0aW9uKCl7IGxhc2VyLnByZXNzZWQoIHRydWUgKTsgfSApO1xuICAqL1xuICBmdW5jdGlvbiBhZGRJbnB1dE9iamVjdCggb2JqZWN0ICl7XG4gICAgY29uc3QgaW5wdXQgPSBjcmVhdGVJbnB1dCggb2JqZWN0ICk7XG5cbiAgICBpbnB1dC5sYXNlci5wcmVzc2VkID0gZnVuY3Rpb24oIGZsYWcgKXtcbiAgICAgIC8vIG9ubHkgcGF5IGF0dGVudGlvbiB0byBwcmVzc2VzIG92ZXIgdGhlIEdVSVxuICAgICAgaWYgKGZsYWcgJiYgKGlucHV0LmludGVyc2VjdGlvbnMubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgaW5wdXQucHJlc3NlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnB1dC5wcmVzc2VkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlucHV0Lmxhc2VyLmdyaXBwZWQgPSBmdW5jdGlvbiggZmxhZyApe1xuICAgICAgaW5wdXQuZ3JpcHBlZCA9IGZsYWc7XG4gICAgfTtcblxuICAgIGlucHV0Lmxhc2VyLmN1cnNvciA9IGlucHV0LmN1cnNvcjtcblxuICAgIGlmKCBUSFJFRS5WaXZlQ29udHJvbGxlciAmJiBvYmplY3QgaW5zdGFuY2VvZiBUSFJFRS5WaXZlQ29udHJvbGxlciApe1xuICAgICAgYmluZFZpdmVDb250cm9sbGVyKCBpbnB1dCwgb2JqZWN0LCBpbnB1dC5sYXNlci5wcmVzc2VkLCBpbnB1dC5sYXNlci5ncmlwcGVkICk7XG4gICAgfVxuXG4gICAgaW5wdXRPYmplY3RzLnB1c2goIGlucHV0ICk7XG5cbiAgICByZXR1cm4gaW5wdXQubGFzZXI7XG4gIH1cblxuXG5cblxuICAvKlxuICAgIEhlcmUgYXJlIHRoZSBtYWluIGRhdCBndWkgY29udHJvbGxlciB0eXBlcy5cbiAgKi9cblxuICBmdW5jdGlvbiBhZGRTbGlkZXIoIG9iamVjdCwgcHJvcGVydHlOYW1lLCBtaW4gPSAwLjAsIG1heCA9IDEwMC4wICl7XG4gICAgY29uc3Qgc2xpZGVyID0gY3JlYXRlU2xpZGVyKCB7XG4gICAgICB0ZXh0Q3JlYXRvciwgcHJvcGVydHlOYW1lLCBvYmplY3QsIG1pbiwgbWF4LFxuICAgICAgaW5pdGlhbFZhbHVlOiBvYmplY3RbIHByb3BlcnR5TmFtZSBdXG4gICAgfSk7XG5cbiAgICBjb250cm9sbGVycy5wdXNoKCBzbGlkZXIgKTtcbiAgICBoaXRzY2FuT2JqZWN0cy5wdXNoKCAuLi5zbGlkZXIuaGl0c2NhbiApXG5cbiAgICByZXR1cm4gc2xpZGVyO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkQ2hlY2tib3goIG9iamVjdCwgcHJvcGVydHlOYW1lICl7XG4gICAgY29uc3QgY2hlY2tib3ggPSBjcmVhdGVDaGVja2JveCh7XG4gICAgICB0ZXh0Q3JlYXRvciwgcHJvcGVydHlOYW1lLCBvYmplY3QsXG4gICAgICBpbml0aWFsVmFsdWU6IG9iamVjdFsgcHJvcGVydHlOYW1lIF1cbiAgICB9KTtcblxuICAgIGNvbnRyb2xsZXJzLnB1c2goIGNoZWNrYm94ICk7XG4gICAgaGl0c2Nhbk9iamVjdHMucHVzaCggLi4uY2hlY2tib3guaGl0c2NhbiApXG5cbiAgICByZXR1cm4gY2hlY2tib3g7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRCdXR0b24oIG9iamVjdCwgcHJvcGVydHlOYW1lICl7XG4gICAgY29uc3QgYnV0dG9uID0gY3JlYXRlQnV0dG9uKHtcbiAgICAgIHRleHRDcmVhdG9yLCBwcm9wZXJ0eU5hbWUsIG9iamVjdFxuICAgIH0pO1xuXG4gICAgY29udHJvbGxlcnMucHVzaCggYnV0dG9uICk7XG4gICAgaGl0c2Nhbk9iamVjdHMucHVzaCggLi4uYnV0dG9uLmhpdHNjYW4gKTtcbiAgICByZXR1cm4gYnV0dG9uO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkRHJvcGRvd24oIG9iamVjdCwgcHJvcGVydHlOYW1lLCBvcHRpb25zICl7XG4gICAgY29uc3QgZHJvcGRvd24gPSBjcmVhdGVEcm9wZG93bih7XG4gICAgICB0ZXh0Q3JlYXRvciwgcHJvcGVydHlOYW1lLCBvYmplY3QsIG9wdGlvbnNcbiAgICB9KTtcblxuICAgIGNvbnRyb2xsZXJzLnB1c2goIGRyb3Bkb3duICk7XG4gICAgaGl0c2Nhbk9iamVjdHMucHVzaCggLi4uZHJvcGRvd24uaGl0c2NhbiApO1xuICAgIHJldHVybiBkcm9wZG93bjtcbiAgfVxuXG5cblxuXG5cbiAgLypcbiAgICBBbiBpbXBsaWNpdCBBZGQgZnVuY3Rpb24gd2hpY2ggZGV0ZWN0cyBmb3IgcHJvcGVydHkgdHlwZVxuICAgIGFuZCBnaXZlcyB5b3UgdGhlIGNvcnJlY3QgY29udHJvbGxlci5cblxuICAgIERyb3Bkb3duOlxuICAgICAgYWRkKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgb2JqZWN0VHlwZSApXG5cbiAgICBTbGlkZXI6XG4gICAgICBhZGQoIG9iamVjdCwgcHJvcGVydHlPZk51bWJlclR5cGUsIG1pbiwgbWF4IClcblxuICAgIENoZWNrYm94OlxuICAgICAgYWRkKCBvYmplY3QsIHByb3BlcnR5T2ZCb29sZWFuVHlwZSApXG5cbiAgICBCdXR0b246XG4gICAgICBhZGQoIG9iamVjdCwgcHJvcGVydHlPZkZ1bmN0aW9uVHlwZSApXG5cbiAgICBOb3QgdXNlZCBkaXJlY3RseS4gVXNlZCBieSBmb2xkZXJzLlxuICAqL1xuXG4gIGZ1bmN0aW9uIGFkZCggb2JqZWN0LCBwcm9wZXJ0eU5hbWUsIGFyZzMsIGFyZzQgKXtcblxuICAgIGlmKCBvYmplY3QgPT09IHVuZGVmaW5lZCApe1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgZWxzZVxuXG4gICAgaWYoIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gPT09IHVuZGVmaW5lZCApe1xuICAgICAgY29uc29sZS53YXJuKCAnbm8gcHJvcGVydHkgbmFtZWQnLCBwcm9wZXJ0eU5hbWUsICdvbiBvYmplY3QnLCBvYmplY3QgKTtcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgICB9XG5cbiAgICBpZiggaXNPYmplY3QoIGFyZzMgKSB8fCBpc0FycmF5KCBhcmczICkgKXtcbiAgICAgIHJldHVybiBhZGREcm9wZG93biggb2JqZWN0LCBwcm9wZXJ0eU5hbWUsIGFyZzMgKTtcbiAgICB9XG5cbiAgICBpZiggaXNOdW1iZXIoIG9iamVjdFsgcHJvcGVydHlOYW1lXSApICl7XG4gICAgICByZXR1cm4gYWRkU2xpZGVyKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgYXJnMywgYXJnNCApO1xuICAgIH1cblxuICAgIGlmKCBpc0Jvb2xlYW4oIG9iamVjdFsgcHJvcGVydHlOYW1lXSApICl7XG4gICAgICByZXR1cm4gYWRkQ2hlY2tib3goIG9iamVjdCwgcHJvcGVydHlOYW1lICk7XG4gICAgfVxuXG4gICAgaWYoIGlzRnVuY3Rpb24oIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gKSApe1xuICAgICAgcmV0dXJuIGFkZEJ1dHRvbiggb2JqZWN0LCBwcm9wZXJ0eU5hbWUgKTtcbiAgICB9XG5cbiAgICAvLyAgYWRkIGNvdWxkbid0IGZpZ3VyZSBpdCBvdXQsIHBhc3MgaXQgYmFjayB0byBmb2xkZXJcbiAgICByZXR1cm4gdW5kZWZpbmVkXG4gIH1cblxuXG4gIGZ1bmN0aW9uIGFkZFNpbXBsZVNsaWRlciggbWluID0gMCwgbWF4ID0gMSApe1xuICAgIGNvbnN0IHByb3h5ID0ge1xuICAgICAgbnVtYmVyOiBtaW5cbiAgICB9O1xuXG4gICAgcmV0dXJuIGFkZFNsaWRlciggcHJveHksICdudW1iZXInLCBtaW4sIG1heCApO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkU2ltcGxlRHJvcGRvd24oIG9wdGlvbnMgPSBbXSApe1xuICAgIGNvbnN0IHByb3h5ID0ge1xuICAgICAgb3B0aW9uOiAnJ1xuICAgIH07XG5cbiAgICBpZiggb3B0aW9ucyAhPT0gdW5kZWZpbmVkICl7XG4gICAgICBwcm94eS5vcHRpb24gPSBpc0FycmF5KCBvcHRpb25zICkgPyBvcHRpb25zWyAwIF0gOiBvcHRpb25zWyBPYmplY3Qua2V5cyhvcHRpb25zKVswXSBdO1xuICAgIH1cblxuICAgIHJldHVybiBhZGREcm9wZG93biggcHJveHksICdvcHRpb24nLCBvcHRpb25zICk7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRTaW1wbGVDaGVja2JveCggZGVmYXVsdE9wdGlvbiA9IGZhbHNlICl7XG4gICAgY29uc3QgcHJveHkgPSB7XG4gICAgICBjaGVja2VkOiBkZWZhdWx0T3B0aW9uXG4gICAgfTtcblxuICAgIHJldHVybiBhZGRDaGVja2JveCggcHJveHksICdjaGVja2VkJyApO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkU2ltcGxlQnV0dG9uKCBmbiApe1xuICAgIGNvbnN0IHByb3h5ID0ge1xuICAgICAgYnV0dG9uOiAoZm4hPT11bmRlZmluZWQpID8gZm4gOiBmdW5jdGlvbigpe31cbiAgICB9O1xuXG4gICAgcmV0dXJuIGFkZEJ1dHRvbiggcHJveHksICdidXR0b24nICk7XG4gIH1cblxuXG4gIC8qXG4gICAgQ3JlYXRlcyBhIGZvbGRlciB3aXRoIHRoZSBuYW1lLlxuXG4gICAgRm9sZGVycyBhcmUgVEhSRUUuR3JvdXAgdHlwZSBvYmplY3RzIGFuZCBjYW4gZG8gZ3JvdXAuYWRkKCkgZm9yIHNpYmxpbmdzLlxuICAgIEZvbGRlcnMgd2lsbCBhdXRvbWF0aWNhbGx5IGF0dGVtcHQgdG8gbGF5IGl0cyBjaGlsZHJlbiBvdXQgaW4gc2VxdWVuY2UuXG5cbiAgICBGb2xkZXJzIGFyZSBnaXZlbiB0aGUgYWRkKCkgZnVuY3Rpb25hbGl0eSBzbyB0aGF0IHRoZXkgY2FuIGRvXG4gICAgZm9sZGVyLmFkZCggLi4uICkgdG8gY3JlYXRlIGNvbnRyb2xsZXJzLlxuICAqL1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZSggbmFtZSApe1xuICAgIGNvbnN0IGZvbGRlciA9IGNyZWF0ZUZvbGRlcih7XG4gICAgICB0ZXh0Q3JlYXRvcixcbiAgICAgIG5hbWUsXG4gICAgICBndWlBZGQ6IGFkZCxcbiAgICAgIGFkZFNsaWRlcjogYWRkU2ltcGxlU2xpZGVyLFxuICAgICAgYWRkRHJvcGRvd246IGFkZFNpbXBsZURyb3Bkb3duLFxuICAgICAgYWRkQ2hlY2tib3g6IGFkZFNpbXBsZUNoZWNrYm94LFxuICAgICAgYWRkQnV0dG9uOiBhZGRTaW1wbGVCdXR0b25cbiAgICB9KTtcblxuICAgIGNvbnRyb2xsZXJzLnB1c2goIGZvbGRlciApO1xuICAgIGlmKCBmb2xkZXIuaGl0c2NhbiApe1xuICAgICAgaGl0c2Nhbk9iamVjdHMucHVzaCggLi4uZm9sZGVyLmhpdHNjYW4gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZm9sZGVyO1xuICB9XG5cblxuXG5cblxuICAvKlxuICAgIFBlcmZvcm0gdGhlIG5lY2Vzc2FyeSB1cGRhdGVzLCByYXljYXN0cyBvbiBpdHMgb3duIFJBRi5cbiAgKi9cblxuICBjb25zdCB0UG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICBjb25zdCB0RGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoIDAsIDAsIC0xICk7XG4gIGNvbnN0IHRNYXRyaXggPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHVwZGF0ZSApO1xuXG4gICAgdmFyIGhpdHNjYW5PYmplY3RzID0gZ2V0VmlzaWJsZUhpdHNjYW5PYmplY3RzKCk7XG5cbiAgICBpZiggbW91c2VFbmFibGVkICl7XG4gICAgICBtb3VzZUlucHV0LmludGVyc2VjdGlvbnMgPSBwZXJmb3JtTW91c2VJbnB1dCggaGl0c2Nhbk9iamVjdHMsIG1vdXNlSW5wdXQgKTtcbiAgICB9XG5cbiAgICBpbnB1dE9iamVjdHMuZm9yRWFjaCggZnVuY3Rpb24oIHtib3gsb2JqZWN0LHJheWNhc3QsbGFzZXIsY3Vyc29yfSA9IHt9LCBpbmRleCApe1xuICAgICAgb2JqZWN0LnVwZGF0ZU1hdHJpeFdvcmxkKCk7XG5cbiAgICAgIHRQb3NpdGlvbi5zZXQoMCwwLDApLnNldEZyb21NYXRyaXhQb3NpdGlvbiggb2JqZWN0Lm1hdHJpeFdvcmxkICk7XG4gICAgICB0TWF0cml4LmlkZW50aXR5KCkuZXh0cmFjdFJvdGF0aW9uKCBvYmplY3QubWF0cml4V29ybGQgKTtcbiAgICAgIHREaXJlY3Rpb24uc2V0KDAsMCwtMSkuYXBwbHlNYXRyaXg0KCB0TWF0cml4ICkubm9ybWFsaXplKCk7XG5cbiAgICAgIHJheWNhc3Quc2V0KCB0UG9zaXRpb24sIHREaXJlY3Rpb24gKTtcblxuICAgICAgbGFzZXIuZ2VvbWV0cnkudmVydGljZXNbIDAgXS5jb3B5KCB0UG9zaXRpb24gKTtcblxuICAgICAgLy8gIGRlYnVnLi4uXG4gICAgICAvLyBsYXNlci5nZW9tZXRyeS52ZXJ0aWNlc1sgMSBdLmNvcHkoIHRQb3NpdGlvbiApLmFkZCggdERpcmVjdGlvbi5tdWx0aXBseVNjYWxhciggMSApICk7XG5cbiAgICAgIGNvbnN0IGludGVyc2VjdGlvbnMgPSByYXljYXN0LmludGVyc2VjdE9iamVjdHMoIGhpdHNjYW5PYmplY3RzLCBmYWxzZSApO1xuICAgICAgcGFyc2VJbnRlcnNlY3Rpb25zKCBpbnRlcnNlY3Rpb25zLCBsYXNlciwgY3Vyc29yICk7XG5cbiAgICAgIGlucHV0T2JqZWN0c1sgaW5kZXggXS5pbnRlcnNlY3Rpb25zID0gaW50ZXJzZWN0aW9ucztcbiAgICB9KTtcblxuICAgIGNvbnN0IGlucHV0cyA9IGlucHV0T2JqZWN0cy5zbGljZSgpO1xuXG4gICAgaWYoIG1vdXNlRW5hYmxlZCApe1xuICAgICAgaW5wdXRzLnB1c2goIG1vdXNlSW5wdXQgKTtcbiAgICB9XG5cbiAgICBjb250cm9sbGVycy5mb3JFYWNoKCBmdW5jdGlvbiggY29udHJvbGxlciApe1xuICAgICAgLy9uYiwgd2UgY291bGQgZG8gYSBtb3JlIHRob3JvdWdoIGNoZWNrIGZvciB2aXNpYmlsdHksIG5vdCBzdXJlIGhvdyBpbXBvcnRhbnRcbiAgICAgIC8vdGhpcyBiaXQgaXMgYXQgdGhpcyBzdGFnZS4uLlxuICAgICAgaWYgKGNvbnRyb2xsZXIudmlzaWJsZSkgY29udHJvbGxlci51cGRhdGVDb250cm9sKCBpbnB1dHMgKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZUxhc2VyKCBsYXNlciwgcG9pbnQgKXtcbiAgICBsYXNlci5nZW9tZXRyeS52ZXJ0aWNlc1sgMSBdLmNvcHkoIHBvaW50ICk7XG4gICAgbGFzZXIudmlzaWJsZSA9IHRydWU7XG4gICAgbGFzZXIuZ2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nU3BoZXJlKCk7XG4gICAgbGFzZXIuZ2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nQm94KCk7XG4gICAgbGFzZXIuZ2VvbWV0cnkudmVydGljZXNOZWVkVXBkYXRlID0gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlSW50ZXJzZWN0aW9ucyggaW50ZXJzZWN0aW9ucywgbGFzZXIsIGN1cnNvciApe1xuICAgIGlmKCBpbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDAgKXtcbiAgICAgIGNvbnN0IGZpcnN0SGl0ID0gaW50ZXJzZWN0aW9uc1sgMCBdO1xuICAgICAgdXBkYXRlTGFzZXIoIGxhc2VyLCBmaXJzdEhpdC5wb2ludCApO1xuICAgICAgY3Vyc29yLnBvc2l0aW9uLmNvcHkoIGZpcnN0SGl0LnBvaW50ICk7XG4gICAgICBjdXJzb3IudmlzaWJsZSA9IHRydWU7XG4gICAgICBjdXJzb3IudXBkYXRlTWF0cml4V29ybGQoKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIGxhc2VyLnZpc2libGUgPSBmYWxzZTtcbiAgICAgIGN1cnNvci52aXNpYmxlID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VNb3VzZUludGVyc2VjdGlvbiggaW50ZXJzZWN0aW9uLCBsYXNlciwgY3Vyc29yICl7XG4gICAgY3Vyc29yLnBvc2l0aW9uLmNvcHkoIGludGVyc2VjdGlvbiApO1xuICAgIHVwZGF0ZUxhc2VyKCBsYXNlciwgY3Vyc29yLnBvc2l0aW9uICk7XG4gIH1cblxuICBmdW5jdGlvbiBwZXJmb3JtTW91c2VJbnRlcnNlY3Rpb24oIHJheWNhc3QsIG1vdXNlLCBjYW1lcmEgKXtcbiAgICByYXljYXN0LnNldEZyb21DYW1lcmEoIG1vdXNlLCBjYW1lcmEgKTtcbiAgICBjb25zdCBoaXRzY2FuT2JqZWN0cyA9IGdldFZpc2libGVIaXRzY2FuT2JqZWN0cygpO1xuICAgIHJldHVybiByYXljYXN0LmludGVyc2VjdE9iamVjdHMoIGhpdHNjYW5PYmplY3RzLCBmYWxzZSApO1xuICB9XG5cbiAgZnVuY3Rpb24gbW91c2VJbnRlcnNlY3RzUGxhbmUoIHJheWNhc3QsIHYsIHBsYW5lICl7XG4gICAgcmV0dXJuIHJheWNhc3QucmF5LmludGVyc2VjdFBsYW5lKCBwbGFuZSwgdiApO1xuICB9XG5cbiAgZnVuY3Rpb24gcGVyZm9ybU1vdXNlSW5wdXQoIGhpdHNjYW5PYmplY3RzLCB7Ym94LG9iamVjdCxyYXljYXN0LGxhc2VyLGN1cnNvcixtb3VzZSxtb3VzZUNhbWVyYX0gPSB7fSApe1xuICAgIGxldCBpbnRlcnNlY3Rpb25zID0gW107XG5cbiAgICBpZiAobW91c2VDYW1lcmEpIHtcbiAgICAgIGludGVyc2VjdGlvbnMgPSBwZXJmb3JtTW91c2VJbnRlcnNlY3Rpb24oIHJheWNhc3QsIG1vdXNlLCBtb3VzZUNhbWVyYSApO1xuICAgICAgcGFyc2VJbnRlcnNlY3Rpb25zKCBpbnRlcnNlY3Rpb25zLCBsYXNlciwgY3Vyc29yICk7XG4gICAgICBjdXJzb3IudmlzaWJsZSA9IHRydWU7XG4gICAgICBsYXNlci52aXNpYmxlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW50ZXJzZWN0aW9ucztcbiAgfVxuXG4gIHVwZGF0ZSgpO1xuXG5cblxuXG5cbiAgLypcbiAgICBQdWJsaWMgbWV0aG9kcy5cbiAgKi9cblxuICByZXR1cm4ge1xuICAgIGNyZWF0ZSxcbiAgICBhZGRJbnB1dE9iamVjdCxcbiAgICBlbmFibGVNb3VzZSxcbiAgICBkaXNhYmxlTW91c2VcbiAgfTtcblxufSgpKTtcblxuaWYoIHdpbmRvdyApe1xuICBpZiggd2luZG93LmRhdCA9PT0gdW5kZWZpbmVkICl7XG4gICAgd2luZG93LmRhdCA9IHt9O1xuICB9XG5cbiAgd2luZG93LmRhdC5HVUlWUiA9IEdVSVZSO1xufVxuXG5pZiggbW9kdWxlICl7XG4gIG1vZHVsZS5leHBvcnRzID0ge1xuICAgIGRhdDogR1VJVlJcbiAgfTtcbn1cblxuaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gIGRlZmluZShbXSwgR1VJVlIpO1xufVxuXG4vKlxuICBCdW5jaCBvZiBzdGF0ZS1sZXNzIHV0aWxpdHkgZnVuY3Rpb25zLlxuKi9cblxuZnVuY3Rpb24gaXNOdW1iZXIobikge1xuICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQobikpICYmIGlzRmluaXRlKG4pO1xufVxuXG5mdW5jdGlvbiBpc0Jvb2xlYW4obil7XG4gIHJldHVybiB0eXBlb2YgbiA9PT0gJ2Jvb2xlYW4nO1xufVxuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGZ1bmN0aW9uVG9DaGVjaykge1xuICBjb25zdCBnZXRUeXBlID0ge307XG4gIHJldHVybiBmdW5jdGlvblRvQ2hlY2sgJiYgZ2V0VHlwZS50b1N0cmluZy5jYWxsKGZ1bmN0aW9uVG9DaGVjaykgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbi8vICBvbmx5IHt9IG9iamVjdHMgbm90IGFycmF5c1xuLy8gICAgICAgICAgICAgICAgICAgIHdoaWNoIGFyZSB0ZWNobmljYWxseSBvYmplY3RzIGJ1dCB5b3UncmUganVzdCBiZWluZyBwZWRhbnRpY1xuZnVuY3Rpb24gaXNPYmplY3QgKGl0ZW0pIHtcbiAgcmV0dXJuICh0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkoaXRlbSkgJiYgaXRlbSAhPT0gbnVsbCk7XG59XG5cbmZ1bmN0aW9uIGlzQXJyYXkoIG8gKXtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoIG8gKTtcbn1cblxuXG5cblxuXG5cblxuLypcbiAgQ29udHJvbGxlci1zcGVjaWZpYyBzdXBwb3J0LlxuKi9cblxuZnVuY3Rpb24gYmluZFZpdmVDb250cm9sbGVyKCBpbnB1dCwgY29udHJvbGxlciwgcHJlc3NlZCwgZ3JpcHBlZCApe1xuICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoICd0cmlnZ2VyZG93bicsICgpPT5wcmVzc2VkKCB0cnVlICkgKTtcbiAgY29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKCAndHJpZ2dlcnVwJywgKCk9PnByZXNzZWQoIGZhbHNlICkgKTtcbiAgY29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKCAnZ3JpcHNkb3duJywgKCk9PmdyaXBwZWQoIHRydWUgKSApO1xuICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoICdncmlwc3VwJywgKCk9PmdyaXBwZWQoIGZhbHNlICkgKTtcblxuICBjb25zdCBnYW1lcGFkID0gY29udHJvbGxlci5nZXRHYW1lcGFkKCk7XG4gIGZ1bmN0aW9uIHZpYnJhdGUoIHQsIGEgKXtcbiAgICBpZiggZ2FtZXBhZCAmJiBnYW1lcGFkLmhhcHRpY0FjdHVhdG9ycy5sZW5ndGggPiAwICl7XG4gICAgICBnYW1lcGFkLmhhcHRpY0FjdHVhdG9yc1sgMCBdLnB1bHNlKCB0LCBhICk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGFwdGljc1RhcCgpe1xuICAgIHNldEludGVydmFsVGltZXMoICh4LHQsYSk9PnZpYnJhdGUoMS1hLCAwLjUpLCAxMCwgMjAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhcHRpY3NFY2hvKCl7XG4gICAgc2V0SW50ZXJ2YWxUaW1lcyggKHgsdCxhKT0+dmlicmF0ZSg0LCAxLjAgKiAoMS1hKSksIDEwMCwgNCApO1xuICB9XG5cbiAgaW5wdXQuZXZlbnRzLm9uKCAnb25Db250cm9sbGVySGVsZCcsIGZ1bmN0aW9uKCBpbnB1dCApe1xuICAgIHZpYnJhdGUoIDAuMywgMC4zICk7XG4gIH0pO1xuXG4gIGlucHV0LmV2ZW50cy5vbiggJ2dyYWJiZWQnLCBmdW5jdGlvbigpe1xuICAgIGhhcHRpY3NUYXAoKTtcbiAgfSk7XG5cbiAgaW5wdXQuZXZlbnRzLm9uKCAnZ3JhYlJlbGVhc2VkJywgZnVuY3Rpb24oKXtcbiAgICBoYXB0aWNzRWNobygpO1xuICB9KTtcblxuICBpbnB1dC5ldmVudHMub24oICdwaW5uZWQnLCBmdW5jdGlvbigpe1xuICAgIGhhcHRpY3NUYXAoKTtcbiAgfSk7XG5cbiAgaW5wdXQuZXZlbnRzLm9uKCAncGluUmVsZWFzZWQnLCBmdW5jdGlvbigpe1xuICAgIGhhcHRpY3NFY2hvKCk7XG4gIH0pO1xuXG5cblxufVxuXG5mdW5jdGlvbiBzZXRJbnRlcnZhbFRpbWVzKCBjYiwgZGVsYXksIHRpbWVzICl7XG4gIGxldCB4ID0gMDtcbiAgbGV0IGlkID0gc2V0SW50ZXJ2YWwoIGZ1bmN0aW9uKCl7XG4gICAgY2IoIHgsIHRpbWVzLCB4L3RpbWVzICk7XG4gICAgeCsrO1xuICAgIGlmKCB4Pj10aW1lcyApe1xuICAgICAgY2xlYXJJbnRlcnZhbCggaWQgKTtcbiAgICB9XG4gIH0sIGRlbGF5ICk7XG4gIHJldHVybiBpZDtcbn0iLCIvKipcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXG4qXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxuKlxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuKlxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4qXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5pbXBvcnQgRW1pdHRlciBmcm9tICdldmVudHMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVJbnRlcmFjdGlvbiggaGl0Vm9sdW1lICl7XG4gIGNvbnN0IGV2ZW50cyA9IG5ldyBFbWl0dGVyKCk7XG5cbiAgbGV0IGFueUhvdmVyID0gZmFsc2U7XG4gIGxldCBhbnlQcmVzc2luZyA9IGZhbHNlO1xuICBsZXQgYW55QWN0aXZlID0gZmFsc2U7XG5cbiAgY29uc3QgdFZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gIGNvbnN0IGF2YWlsYWJsZUlucHV0cyA9IFtdO1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZSggaW5wdXRPYmplY3RzICl7XG5cbiAgICBhbnlIb3ZlciA9IGZhbHNlO1xuICAgIGFueVByZXNzaW5nID0gZmFsc2U7XG4gICAgYW55QWN0aXZlID0gZmFsc2U7XG5cbiAgICBpbnB1dE9iamVjdHMuZm9yRWFjaCggZnVuY3Rpb24oIGlucHV0ICl7XG5cbiAgICAgIGlmKCBhdmFpbGFibGVJbnB1dHMuaW5kZXhPZiggaW5wdXQgKSA8IDAgKXtcbiAgICAgICAgYXZhaWxhYmxlSW5wdXRzLnB1c2goIGlucHV0ICk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHsgaGl0T2JqZWN0LCBoaXRQb2ludCB9ID0gZXh0cmFjdEhpdCggaW5wdXQgKTtcblxuICAgICAgdmFyIGhvdmVyID0gaGl0Vm9sdW1lID09PSBoaXRPYmplY3Q7XG4gICAgICBhbnlIb3ZlciA9IGFueUhvdmVyIHx8IGhvdmVyO1xuXG4gICAgICBwZXJmb3JtU3RhdGVFdmVudHMoe1xuICAgICAgICBpbnB1dCxcbiAgICAgICAgaG92ZXIsXG4gICAgICAgIGhpdE9iamVjdCwgaGl0UG9pbnQsXG4gICAgICAgIGJ1dHRvbk5hbWU6ICdwcmVzc2VkJyxcbiAgICAgICAgaW50ZXJhY3Rpb25OYW1lOiAncHJlc3MnLFxuICAgICAgICBkb3duTmFtZTogJ29uUHJlc3NlZCcsXG4gICAgICAgIGhvbGROYW1lOiAncHJlc3NpbmcnLFxuICAgICAgICB1cE5hbWU6ICdvblJlbGVhc2VkJ1xuICAgICAgfSk7XG5cbiAgICAgIHBlcmZvcm1TdGF0ZUV2ZW50cyh7XG4gICAgICAgIGlucHV0LFxuICAgICAgICBob3ZlcixcbiAgICAgICAgaGl0T2JqZWN0LCBoaXRQb2ludCxcbiAgICAgICAgYnV0dG9uTmFtZTogJ2dyaXBwZWQnLFxuICAgICAgICBpbnRlcmFjdGlvbk5hbWU6ICdncmlwJyxcbiAgICAgICAgZG93bk5hbWU6ICdvbkdyaXBwZWQnLFxuICAgICAgICBob2xkTmFtZTogJ2dyaXBwaW5nJyxcbiAgICAgICAgdXBOYW1lOiAnb25SZWxlYXNlR3JpcCdcbiAgICAgIH0pO1xuXG4gICAgICBldmVudHMuZW1pdCggJ3RpY2snLCB7XG4gICAgICAgIGlucHV0LFxuICAgICAgICBoaXRPYmplY3QsXG4gICAgICAgIGlucHV0T2JqZWN0OiBpbnB1dC5vYmplY3RcbiAgICAgIH0gKTtcblxuICAgIH0pO1xuXG4gIH1cblxuICBmdW5jdGlvbiBleHRyYWN0SGl0KCBpbnB1dCApe1xuICAgIGlmKCBpbnB1dC5pbnRlcnNlY3Rpb25zLmxlbmd0aCA8PSAwICl7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBoaXRQb2ludDogdFZlY3Rvci5zZXRGcm9tTWF0cml4UG9zaXRpb24oIGlucHV0LmN1cnNvci5tYXRyaXhXb3JsZCApLmNsb25lKCksXG4gICAgICAgIGhpdE9iamVjdDogdW5kZWZpbmVkLFxuICAgICAgfTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhpdFBvaW50OiBpbnB1dC5pbnRlcnNlY3Rpb25zWyAwIF0ucG9pbnQsXG4gICAgICAgIGhpdE9iamVjdDogaW5wdXQuaW50ZXJzZWN0aW9uc1sgMCBdLm9iamVjdFxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwZXJmb3JtU3RhdGVFdmVudHMoe1xuICAgIGlucHV0LCBob3ZlcixcbiAgICBoaXRPYmplY3QsIGhpdFBvaW50LFxuICAgIGJ1dHRvbk5hbWUsIGludGVyYWN0aW9uTmFtZSwgZG93bk5hbWUsIGhvbGROYW1lLCB1cE5hbWVcbiAgfSA9IHt9ICl7XG5cbiAgICBpZiggaW5wdXRbIGJ1dHRvbk5hbWUgXSA9PT0gdHJ1ZSAmJiBoaXRPYmplY3QgPT09IHVuZGVmaW5lZCApe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vICBob3ZlcmluZyBhbmQgYnV0dG9uIGRvd24gYnV0IG5vIGludGVyYWN0aW9ucyBhY3RpdmUgeWV0XG4gICAgaWYoIGhvdmVyICYmIGlucHV0WyBidXR0b25OYW1lIF0gPT09IHRydWUgJiYgaW5wdXQuaW50ZXJhY3Rpb25bIGludGVyYWN0aW9uTmFtZSBdID09PSB1bmRlZmluZWQgKXtcblxuICAgICAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICAgICAgaW5wdXQsXG4gICAgICAgIGhpdE9iamVjdCxcbiAgICAgICAgcG9pbnQ6IGhpdFBvaW50LFxuICAgICAgICBpbnB1dE9iamVjdDogaW5wdXQub2JqZWN0LFxuICAgICAgICBsb2NrZWQ6IGZhbHNlXG4gICAgICB9O1xuICAgICAgZXZlbnRzLmVtaXQoIGRvd25OYW1lLCBwYXlsb2FkICk7XG5cbiAgICAgIGlmKCBwYXlsb2FkLmxvY2tlZCApe1xuICAgICAgICBpbnB1dC5pbnRlcmFjdGlvblsgaW50ZXJhY3Rpb25OYW1lIF0gPSBpbnRlcmFjdGlvbjtcbiAgICAgICAgaW5wdXQuaW50ZXJhY3Rpb24uaG92ZXIgPSBpbnRlcmFjdGlvbjtcbiAgICAgIH1cblxuICAgICAgYW55UHJlc3NpbmcgPSB0cnVlO1xuICAgICAgYW55QWN0aXZlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyAgYnV0dG9uIHN0aWxsIGRvd24gYW5kIHRoaXMgaXMgdGhlIGFjdGl2ZSBpbnRlcmFjdGlvblxuICAgIGlmKCBpbnB1dFsgYnV0dG9uTmFtZSBdICYmIGlucHV0LmludGVyYWN0aW9uWyBpbnRlcmFjdGlvbk5hbWUgXSA9PT0gaW50ZXJhY3Rpb24gKXtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgIGlucHV0LFxuICAgICAgICBoaXRPYmplY3QsXG4gICAgICAgIHBvaW50OiBoaXRQb2ludCxcbiAgICAgICAgaW5wdXRPYmplY3Q6IGlucHV0Lm9iamVjdCxcbiAgICAgICAgbG9ja2VkOiBmYWxzZVxuICAgICAgfTtcblxuICAgICAgZXZlbnRzLmVtaXQoIGhvbGROYW1lLCBwYXlsb2FkICk7XG5cbiAgICAgIGFueVByZXNzaW5nID0gdHJ1ZTtcblxuICAgICAgaW5wdXQuZXZlbnRzLmVtaXQoICdvbkNvbnRyb2xsZXJIZWxkJyApO1xuICAgIH1cblxuICAgIC8vICBidXR0b24gbm90IGRvd24gYW5kIHRoaXMgaXMgdGhlIGFjdGl2ZSBpbnRlcmFjdGlvblxuICAgIGlmKCBpbnB1dFsgYnV0dG9uTmFtZSBdID09PSBmYWxzZSAmJiBpbnB1dC5pbnRlcmFjdGlvblsgaW50ZXJhY3Rpb25OYW1lIF0gPT09IGludGVyYWN0aW9uICl7XG4gICAgICBpbnB1dC5pbnRlcmFjdGlvblsgaW50ZXJhY3Rpb25OYW1lIF0gPSB1bmRlZmluZWQ7XG4gICAgICBpbnB1dC5pbnRlcmFjdGlvbi5ob3ZlciA9IHVuZGVmaW5lZDtcbiAgICAgIGV2ZW50cy5lbWl0KCB1cE5hbWUsIHtcbiAgICAgICAgaW5wdXQsXG4gICAgICAgIGhpdE9iamVjdCxcbiAgICAgICAgcG9pbnQ6IGhpdFBvaW50LFxuICAgICAgICBpbnB1dE9iamVjdDogaW5wdXQub2JqZWN0XG4gICAgICB9KTtcbiAgICB9XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzTWFpbkhvdmVyKCl7XG5cbiAgICBsZXQgbm9NYWluSG92ZXIgPSB0cnVlO1xuICAgIGZvciggbGV0IGk9MDsgaTxhdmFpbGFibGVJbnB1dHMubGVuZ3RoOyBpKysgKXtcbiAgICAgIGlmKCBhdmFpbGFibGVJbnB1dHNbIGkgXS5pbnRlcmFjdGlvbi5ob3ZlciAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgIG5vTWFpbkhvdmVyID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmKCBub01haW5Ib3ZlciApe1xuICAgICAgcmV0dXJuIGFueUhvdmVyO1xuICAgIH1cblxuICAgIGlmKCBhdmFpbGFibGVJbnB1dHMuZmlsdGVyKCBmdW5jdGlvbiggaW5wdXQgKXtcbiAgICAgIHJldHVybiBpbnB1dC5pbnRlcmFjdGlvbi5ob3ZlciA9PT0gaW50ZXJhY3Rpb247XG4gICAgfSkubGVuZ3RoID4gMCApe1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cblxuICBjb25zdCBpbnRlcmFjdGlvbiA9IHtcbiAgICBob3ZlcmluZzogaXNNYWluSG92ZXIsXG4gICAgcHJlc3Npbmc6ICgpPT5hbnlQcmVzc2luZyxcbiAgICB1cGRhdGUsXG4gICAgZXZlbnRzXG4gIH07XG5cbiAgcmV0dXJuIGludGVyYWN0aW9uO1xufSIsIi8qKlxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcbipcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXG4qXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbipcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cblxuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhbGlnbkxlZnQoIG9iaiApe1xuICBpZiggb2JqIGluc3RhbmNlb2YgVEhSRUUuTWVzaCApe1xuICAgIG9iai5nZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcbiAgICBjb25zdCB3aWR0aCA9IG9iai5nZW9tZXRyeS5ib3VuZGluZ0JveC5tYXgueCAtIG9iai5nZW9tZXRyeS5ib3VuZGluZ0JveC5tYXgueTtcbiAgICBvYmouZ2VvbWV0cnkudHJhbnNsYXRlKCB3aWR0aCwgMCwgMCApO1xuICAgIHJldHVybiBvYmo7XG4gIH1cbiAgZWxzZSBpZiggb2JqIGluc3RhbmNlb2YgVEhSRUUuR2VvbWV0cnkgKXtcbiAgICBvYmouY29tcHV0ZUJvdW5kaW5nQm94KCk7XG4gICAgY29uc3Qgd2lkdGggPSBvYmouYm91bmRpbmdCb3gubWF4LnggLSBvYmouYm91bmRpbmdCb3gubWF4Lnk7XG4gICAgb2JqLnRyYW5zbGF0ZSggd2lkdGgsIDAsIDAgKTtcbiAgICByZXR1cm4gb2JqO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQYW5lbCggd2lkdGgsIGhlaWdodCwgZGVwdGgsIHVuaXF1ZU1hdGVyaWFsICl7XG4gIGNvbnN0IG1hdGVyaWFsID0gdW5pcXVlTWF0ZXJpYWwgPyBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe2NvbG9yOjB4ZmZmZmZmfSkgOiBTaGFyZWRNYXRlcmlhbHMuUEFORUw7XG4gIGNvbnN0IHBhbmVsID0gbmV3IFRIUkVFLk1lc2goIG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggd2lkdGgsIGhlaWdodCwgZGVwdGggKSwgbWF0ZXJpYWwgKTtcbiAgcGFuZWwuZ2VvbWV0cnkudHJhbnNsYXRlKCB3aWR0aCAqIDAuNSwgMCwgMCApO1xuXG4gIGlmKCB1bmlxdWVNYXRlcmlhbCApe1xuICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkRFRkFVTFRfQkFDSyApO1xuICB9XG4gIGVsc2V7XG4gICAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIHBhbmVsLmdlb21ldHJ5LCBDb2xvcnMuREVGQVVMVF9CQUNLICk7XG4gIH1cblxuICBwYW5lbC51c2VyRGF0YS5jdXJyZW50V2lkdGggPSB3aWR0aDtcbiAgcGFuZWwudXNlckRhdGEuY3VycmVudEhlaWdodCA9IGhlaWdodDtcbiAgcGFuZWwudXNlckRhdGEuY3VycmVudERlcHRoID0gZGVwdGg7XG5cbiAgcmV0dXJuIHBhbmVsO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHJlc2l6ZVBhbmVsKHBhbmVsLCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCkge1xuICBwYW5lbC5nZW9tZXRyeS5zY2FsZSh3aWR0aC9wYW5lbC51c2VyRGF0YS5jdXJyZW50V2lkdGgsIGhlaWdodC9wYW5lbC51c2VyRGF0YS5jdXJyZW50SGVpZ2h0LCBkZXB0aC9wYW5lbC51c2VyRGF0YS5jdXJyZW50RGVwdGgpO1xuICBwYW5lbC51c2VyRGF0YS5jdXJyZW50V2lkdGggPSB3aWR0aDtcbiAgcGFuZWwudXNlckRhdGEuY3VycmVudEhlaWdodCA9IGhlaWdodDtcbiAgcGFuZWwudXNlckRhdGEuY3VycmVudERlcHRoID0gZGVwdGg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDb250cm9sbGVySURCb3goIGhlaWdodCwgY29sb3IgKXtcbiAgY29uc3QgcGFuZWwgPSBuZXcgVEhSRUUuTWVzaCggbmV3IFRIUkVFLkJveEdlb21ldHJ5KCBDT05UUk9MTEVSX0lEX1dJRFRILCBoZWlnaHQsIENPTlRST0xMRVJfSURfREVQVEggKSwgU2hhcmVkTWF0ZXJpYWxzLlBBTkVMICk7XG4gIHBhbmVsLmdlb21ldHJ5LnRyYW5zbGF0ZSggQ09OVFJPTExFUl9JRF9XSURUSCAqIDAuNSwgMCwgMCApO1xuICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggcGFuZWwuZ2VvbWV0cnksIGNvbG9yICk7XG4gIHJldHVybiBwYW5lbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURvd25BcnJvdygpe1xuICBjb25zdCB3ID0gMC4wMDk2O1xuICBjb25zdCBoID0gMC4wMTY7XG4gIGNvbnN0IHNoID0gbmV3IFRIUkVFLlNoYXBlKCk7XG4gIHNoLm1vdmVUbygwLDApO1xuICBzaC5saW5lVG8oLXcsaCk7XG4gIHNoLmxpbmVUbyh3LGgpO1xuICBzaC5saW5lVG8oMCwwKTtcblxuICBjb25zdCBnZW8gPSBuZXcgVEhSRUUuU2hhcGVHZW9tZXRyeSggc2ggKTtcbiAgZ2VvLnRyYW5zbGF0ZSggMCwgLWggKiAwLjUsIDAgKTtcblxuICByZXR1cm4gbmV3IFRIUkVFLk1lc2goIGdlbywgU2hhcmVkTWF0ZXJpYWxzLlBBTkVMICk7XG59XG5cbmV4cG9ydCBjb25zdCBQQU5FTF9XSURUSCA9IDEuMDtcbmV4cG9ydCBjb25zdCBQQU5FTF9IRUlHSFQgPSAwLjA4O1xuZXhwb3J0IGNvbnN0IFBBTkVMX0RFUFRIID0gMC4wMTtcbmV4cG9ydCBjb25zdCBQQU5FTF9TUEFDSU5HID0gMC4wMDE7XG5leHBvcnQgY29uc3QgUEFORUxfTUFSR0lOID0gMC4wMTU7XG5leHBvcnQgY29uc3QgUEFORUxfTEFCRUxfVEVYVF9NQVJHSU4gPSAwLjA2O1xuZXhwb3J0IGNvbnN0IFBBTkVMX1ZBTFVFX1RFWFRfTUFSR0lOID0gMC4wMjtcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX1dJRFRIID0gMC4wMjtcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX0RFUFRIID0gMC4wMDE7XG5leHBvcnQgY29uc3QgQlVUVE9OX0RFUFRIID0gMC4wMTtcbmV4cG9ydCBjb25zdCBGT0xERVJfV0lEVEggPSAxLjAyNjtcbmV4cG9ydCBjb25zdCBTVUJGT0xERVJfV0lEVEggPSAxLjA7XG5leHBvcnQgY29uc3QgRk9MREVSX0hFSUdIVCA9IDAuMDk7XG5leHBvcnQgY29uc3QgRk9MREVSX0dSQUJfSEVJR0hUID0gMC4wNTEyO1xuZXhwb3J0IGNvbnN0IEJPUkRFUl9USElDS05FU1MgPSAwLjAxO1xuZXhwb3J0IGNvbnN0IENIRUNLQk9YX1NJWkUgPSAwLjA1OyIsIi8qKlxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcbipcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXG4qXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbipcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cblxuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ID0ge30gKXtcblxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBwYW5lbCApO1xuXG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uR3JpcHBlZCcsIGhhbmRsZU9uR3JpcCApO1xuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblJlbGVhc2VHcmlwJywgaGFuZGxlT25HcmlwUmVsZWFzZSApO1xuXG4gIGxldCBvbGRQYXJlbnQ7XG4gIGxldCBvbGRQb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gIGxldCBvbGRSb3RhdGlvbiA9IG5ldyBUSFJFRS5FdWxlcigpO1xuXG4gIGNvbnN0IHJvdGF0aW9uR3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgcm90YXRpb25Hcm91cC5zY2FsZS5zZXQoIDAuMywgMC4zLCAwLjMgKTtcbiAgcm90YXRpb25Hcm91cC5wb3NpdGlvbi5zZXQoIC0wLjAxNSwgMC4wMTUsIDAuMCApO1xuXG5cbiAgZnVuY3Rpb24gaGFuZGxlT25HcmlwKCBwICl7XG5cbiAgICBjb25zdCB7IGlucHV0T2JqZWN0LCBpbnB1dCB9ID0gcDtcblxuICAgIGNvbnN0IGZvbGRlciA9IGdyb3VwLmZvbGRlcjtcbiAgICBpZiggZm9sZGVyID09PSB1bmRlZmluZWQgKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiggZm9sZGVyLmJlaW5nTW92ZWQgPT09IHRydWUgKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBvbGRQb3NpdGlvbi5jb3B5KCBmb2xkZXIucG9zaXRpb24gKTtcbiAgICBvbGRSb3RhdGlvbi5jb3B5KCBmb2xkZXIucm90YXRpb24gKTtcblxuICAgIGZvbGRlci5wb3NpdGlvbi5zZXQoIDAsMCwwICk7XG4gICAgZm9sZGVyLnJvdGF0aW9uLnNldCggMCwwLDAgKTtcbiAgICBmb2xkZXIucm90YXRpb24ueCA9IC1NYXRoLlBJICogMC41O1xuXG4gICAgb2xkUGFyZW50ID0gZm9sZGVyLnBhcmVudDtcblxuICAgIHJvdGF0aW9uR3JvdXAuYWRkKCBmb2xkZXIgKTtcblxuICAgIGlucHV0T2JqZWN0LmFkZCggcm90YXRpb25Hcm91cCApO1xuXG4gICAgcC5sb2NrZWQgPSB0cnVlO1xuXG4gICAgZm9sZGVyLmJlaW5nTW92ZWQgPSB0cnVlO1xuXG4gICAgaW5wdXQuZXZlbnRzLmVtaXQoICdwaW5uZWQnLCBpbnB1dCApO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlT25HcmlwUmVsZWFzZSggeyBpbnB1dE9iamVjdCwgaW5wdXQgfT17fSApe1xuXG4gICAgY29uc3QgZm9sZGVyID0gZ3JvdXAuZm9sZGVyO1xuICAgIGlmKCBmb2xkZXIgPT09IHVuZGVmaW5lZCApe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmKCBvbGRQYXJlbnQgPT09IHVuZGVmaW5lZCApe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmKCBmb2xkZXIuYmVpbmdNb3ZlZCA9PT0gZmFsc2UgKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBvbGRQYXJlbnQuYWRkKCBmb2xkZXIgKTtcbiAgICBvbGRQYXJlbnQgPSB1bmRlZmluZWQ7XG5cbiAgICBmb2xkZXIucG9zaXRpb24uY29weSggb2xkUG9zaXRpb24gKTtcbiAgICBmb2xkZXIucm90YXRpb24uY29weSggb2xkUm90YXRpb24gKTtcblxuICAgIGZvbGRlci5iZWluZ01vdmVkID0gZmFsc2U7XG5cbiAgICBpbnB1dC5ldmVudHMuZW1pdCggJ3BpblJlbGVhc2VkJywgaW5wdXQgKTtcbiAgfVxuXG4gIHJldHVybiBpbnRlcmFjdGlvbjtcbn0iLCIvKipcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXG4qXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxuKlxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuKlxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4qXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbmltcG9ydCBTREZTaGFkZXIgZnJvbSAndGhyZWUtYm1mb250LXRleHQvc2hhZGVycy9zZGYnO1xuaW1wb3J0IGNyZWF0ZUdlb21ldHJ5IGZyb20gJ3RocmVlLWJtZm9udC10ZXh0JztcbmltcG9ydCBwYXJzZUFTQ0lJIGZyb20gJ3BhcnNlLWJtZm9udC1hc2NpaSc7XG5cbmltcG9ydCAqIGFzIEZvbnQgZnJvbSAnLi9mb250JztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1hdGVyaWFsKCBjb2xvciApe1xuXG4gIGNvbnN0IHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZSgpO1xuICBjb25zdCBpbWFnZSA9IEZvbnQuaW1hZ2UoKTtcbiAgdGV4dHVyZS5pbWFnZSA9IGltYWdlO1xuICB0ZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgdGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5MaW5lYXJGaWx0ZXI7XG4gIHRleHR1cmUubWFnRmlsdGVyID0gVEhSRUUuTGluZWFyRmlsdGVyO1xuICB0ZXh0dXJlLmdlbmVyYXRlTWlwbWFwcyA9IGZhbHNlO1xuXG4gIHJldHVybiBuZXcgVEhSRUUuUmF3U2hhZGVyTWF0ZXJpYWwoU0RGU2hhZGVyKHtcbiAgICBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLFxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxuICAgIGNvbG9yOiBjb2xvcixcbiAgICBtYXA6IHRleHR1cmVcbiAgfSkpO1xufVxuXG5jb25zdCB0ZXh0U2NhbGUgPSAwLjAwMDI0O1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRvcigpe1xuXG4gIGNvbnN0IGZvbnQgPSBwYXJzZUFTQ0lJKCBGb250LmZudCgpICk7XG5cbiAgY29uc3QgY29sb3JNYXRlcmlhbHMgPSB7fTtcblxuICBmdW5jdGlvbiBjcmVhdGVUZXh0KCBzdHIsIGZvbnQsIGNvbG9yID0gMHhmZmZmZmYsIHNjYWxlID0gMS4wICl7XG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IGNyZWF0ZUdlb21ldHJ5KHtcbiAgICAgIHRleHQ6IHN0cixcbiAgICAgIGFsaWduOiAnbGVmdCcsXG4gICAgICB3aWR0aDogMTAwMDAsXG4gICAgICBmbGlwWTogdHJ1ZSxcbiAgICAgIGZvbnRcbiAgICB9KTtcblxuXG4gICAgY29uc3QgbGF5b3V0ID0gZ2VvbWV0cnkubGF5b3V0O1xuXG4gICAgbGV0IG1hdGVyaWFsID0gY29sb3JNYXRlcmlhbHNbIGNvbG9yIF07XG4gICAgaWYoIG1hdGVyaWFsID09PSB1bmRlZmluZWQgKXtcbiAgICAgIG1hdGVyaWFsID0gY29sb3JNYXRlcmlhbHNbIGNvbG9yIF0gPSBjcmVhdGVNYXRlcmlhbCggY29sb3IgKTtcbiAgICB9XG4gICAgY29uc3QgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKCBnZW9tZXRyeSwgbWF0ZXJpYWwgKTtcbiAgICBtZXNoLnNjYWxlLm11bHRpcGx5KCBuZXcgVEhSRUUuVmVjdG9yMygxLC0xLDEpICk7XG5cbiAgICBjb25zdCBmaW5hbFNjYWxlID0gc2NhbGUgKiB0ZXh0U2NhbGU7XG5cbiAgICBtZXNoLnNjYWxlLm11bHRpcGx5U2NhbGFyKCBmaW5hbFNjYWxlICk7XG5cbiAgICBtZXNoLnBvc2l0aW9uLnkgPSBsYXlvdXQuaGVpZ2h0ICogMC41ICogZmluYWxTY2FsZTtcblxuICAgIHJldHVybiBtZXNoO1xuICB9XG5cblxuICBmdW5jdGlvbiBjcmVhdGUoIHN0ciwgeyBjb2xvcj0weGZmZmZmZiwgc2NhbGU9MS4wIH0gPSB7fSApe1xuICAgIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG5cbiAgICBsZXQgbWVzaCA9IGNyZWF0ZVRleHQoIHN0ciwgZm9udCwgY29sb3IsIHNjYWxlICk7XG4gICAgZ3JvdXAuYWRkKCBtZXNoICk7XG4gICAgZ3JvdXAubGF5b3V0ID0gbWVzaC5nZW9tZXRyeS5sYXlvdXQ7XG5cbiAgICBncm91cC51cGRhdGVMYWJlbCA9IGZ1bmN0aW9uKCBzdHIgKXtcbiAgICAgIG1lc2guZ2VvbWV0cnkudXBkYXRlKCBzdHIgKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGdyb3VwO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBjcmVhdGUsXG4gICAgZ2V0TWF0ZXJpYWw6ICgpPT4gbWF0ZXJpYWxcbiAgfVxuXG59IiwiLyoqXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxuKlxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cbipcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbipcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuKlxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xuXG5leHBvcnQgY29uc3QgUEFORUwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoIHsgY29sb3I6IDB4ZmZmZmZmLCB2ZXJ0ZXhDb2xvcnM6IFRIUkVFLlZlcnRleENvbG9ycyB9ICk7XG5leHBvcnQgY29uc3QgTE9DQVRPUiA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xuZXhwb3J0IGNvbnN0IEZPTERFUiA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCggeyBjb2xvcjogMHgwMDAwMDAgfSApOyIsIi8qKlxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcbipcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXG4qXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbipcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cblxuaW1wb3J0IGNyZWF0ZVRleHRMYWJlbCBmcm9tICcuL3RleHRsYWJlbCc7XG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xuaW1wb3J0ICogYXMgTGF5b3V0IGZyb20gJy4vbGF5b3V0JztcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XG5pbXBvcnQgKiBhcyBHcmFiIGZyb20gJy4vZ3JhYic7XG5pbXBvcnQgKiBhcyBQYWxldHRlIGZyb20gJy4vcGFsZXR0ZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZVNsaWRlcigge1xuICB0ZXh0Q3JlYXRvcixcbiAgb2JqZWN0LFxuICBwcm9wZXJ0eU5hbWUgPSAndW5kZWZpbmVkJyxcbiAgaW5pdGlhbFZhbHVlID0gMC4wLFxuICBtaW4gPSAwLjAsIG1heCA9IDEuMCxcbiAgc3RlcCA9IDAuMSxcbiAgd2lkdGggPSBMYXlvdXQuUEFORUxfV0lEVEgsXG4gIGhlaWdodCA9IExheW91dC5QQU5FTF9IRUlHSFQsXG4gIGRlcHRoID0gTGF5b3V0LlBBTkVMX0RFUFRIXG59ID0ge30gKXtcblxuXG4gIGNvbnN0IFNMSURFUl9XSURUSCA9IHdpZHRoICogMC41IC0gTGF5b3V0LlBBTkVMX01BUkdJTjtcbiAgY29uc3QgU0xJREVSX0hFSUdIVCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU47XG4gIGNvbnN0IFNMSURFUl9ERVBUSCA9IGRlcHRoO1xuXG4gIGNvbnN0IHN0YXRlID0ge1xuICAgIGFscGhhOiAxLjAsXG4gICAgdmFsdWU6IGluaXRpYWxWYWx1ZSxcbiAgICBzdGVwOiBzdGVwLFxuICAgIHVzZVN0ZXA6IHRydWUsXG4gICAgcHJlY2lzaW9uOiAxLFxuICAgIGxpc3RlbjogZmFsc2UsXG4gICAgbWluOiBtaW4sXG4gICAgbWF4OiBtYXgsXG4gICAgb25DaGFuZ2VkQ0I6IHVuZGVmaW5lZCxcbiAgICBvbkZpbmlzaGVkQ2hhbmdlOiB1bmRlZmluZWQsXG4gICAgcHJlc3Npbmc6IGZhbHNlXG4gIH07XG5cbiAgc3RhdGUuc3RlcCA9IGdldEltcGxpZWRTdGVwKCBzdGF0ZS52YWx1ZSApO1xuICBzdGF0ZS5wcmVjaXNpb24gPSBudW1EZWNpbWFscyggc3RhdGUuc3RlcCApO1xuICBzdGF0ZS5hbHBoYSA9IGdldEFscGhhRnJvbVZhbHVlKCBzdGF0ZS52YWx1ZSwgc3RhdGUubWluLCBzdGF0ZS5tYXggKTtcblxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuXG4gIC8vICBmaWxsZWQgdm9sdW1lXG4gIGNvbnN0IHJlY3QgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIFNMSURFUl9XSURUSCwgU0xJREVSX0hFSUdIVCwgU0xJREVSX0RFUFRIICk7XG4gIHJlY3QudHJhbnNsYXRlKFNMSURFUl9XSURUSCowLjUsMCwwKTtcbiAgLy8gTGF5b3V0LmFsaWduTGVmdCggcmVjdCApO1xuXG4gIGNvbnN0IGhpdHNjYW5NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xuICBoaXRzY2FuTWF0ZXJpYWwudmlzaWJsZSA9IGZhbHNlO1xuXG4gIGNvbnN0IGhpdHNjYW5Wb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBoaXRzY2FuTWF0ZXJpYWwgKTtcbiAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi56ID0gZGVwdGg7XG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueCA9IHdpZHRoICogMC41O1xuICBoaXRzY2FuVm9sdW1lLm5hbWUgPSAnaGl0c2NhblZvbHVtZSc7XG5cbiAgLy8gIHNsaWRlckJHIHZvbHVtZVxuICBjb25zdCBzbGlkZXJCRyA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIFNoYXJlZE1hdGVyaWFscy5QQU5FTCApO1xuICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggc2xpZGVyQkcuZ2VvbWV0cnksIENvbG9ycy5TTElERVJfQkcgKTtcbiAgc2xpZGVyQkcucG9zaXRpb24ueiA9IGRlcHRoICogMC41O1xuICBzbGlkZXJCRy5wb3NpdGlvbi54ID0gU0xJREVSX1dJRFRIICsgTGF5b3V0LlBBTkVMX01BUkdJTjtcblxuICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiBDb2xvcnMuREVGQVVMVF9DT0xPUiB9KTtcbiAgY29uc3QgZmlsbGVkVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgbWF0ZXJpYWwgKTtcbiAgZmlsbGVkVm9sdW1lLnBvc2l0aW9uLnogPSBkZXB0aCAqIDAuNTtcbiAgaGl0c2NhblZvbHVtZS5hZGQoIGZpbGxlZFZvbHVtZSApO1xuXG4gIGNvbnN0IGVuZExvY2F0b3IgPSBuZXcgVEhSRUUuTWVzaCggbmV3IFRIUkVFLkJveEdlb21ldHJ5KCAwLjA1LCAwLjA1LCAwLjA1LCAxLCAxLCAxICksIFNoYXJlZE1hdGVyaWFscy5MT0NBVE9SICk7XG4gIGVuZExvY2F0b3IucG9zaXRpb24ueCA9IFNMSURFUl9XSURUSDtcbiAgaGl0c2NhblZvbHVtZS5hZGQoIGVuZExvY2F0b3IgKTtcbiAgZW5kTG9jYXRvci52aXNpYmxlID0gZmFsc2U7XG5cbiAgY29uc3QgdmFsdWVMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggc3RhdGUudmFsdWUudG9TdHJpbmcoKSApO1xuICB2YWx1ZUxhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfVkFMVUVfVEVYVF9NQVJHSU4gKyB3aWR0aCAqIDAuNTtcbiAgdmFsdWVMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGgqMi41O1xuICB2YWx1ZUxhYmVsLnBvc2l0aW9uLnkgPSAtMC4wMzI1O1xuXG4gIGNvbnN0IGRlc2NyaXB0b3JMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggcHJvcGVydHlOYW1lICk7XG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX0xBQkVMX1RFWFRfTUFSR0lOO1xuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoO1xuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzO1xuXG4gIGNvbnN0IGNvbnRyb2xsZXJJRCA9IExheW91dC5jcmVhdGVDb250cm9sbGVySURCb3goIGhlaWdodCwgQ29sb3JzLkNPTlRST0xMRVJfSURfU0xJREVSICk7XG4gIGNvbnRyb2xsZXJJRC5wb3NpdGlvbi56ID0gZGVwdGg7XG5cbiAgY29uc3QgcGFuZWwgPSBMYXlvdXQuY3JlYXRlUGFuZWwoIHdpZHRoLCBoZWlnaHQsIGRlcHRoICk7XG4gIHBhbmVsLm5hbWUgPSAncGFuZWwnO1xuICBwYW5lbC5hZGQoIGRlc2NyaXB0b3JMYWJlbCwgaGl0c2NhblZvbHVtZSwgc2xpZGVyQkcsIHZhbHVlTGFiZWwsIGNvbnRyb2xsZXJJRCApO1xuXG4gIGdyb3VwLmFkZCggcGFuZWwgKVxuXG4gIHVwZGF0ZVZhbHVlTGFiZWwoIHN0YXRlLnZhbHVlICk7XG4gIHVwZGF0ZVNsaWRlcigpO1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZVZhbHVlTGFiZWwoIHZhbHVlICl7XG4gICAgaWYoIHN0YXRlLnVzZVN0ZXAgKXtcbiAgICAgIHZhbHVlTGFiZWwudXBkYXRlTGFiZWwoIHJvdW5kVG9EZWNpbWFsKCBzdGF0ZS52YWx1ZSwgc3RhdGUucHJlY2lzaW9uICkudG9TdHJpbmcoKSApO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgdmFsdWVMYWJlbC51cGRhdGVMYWJlbCggc3RhdGUudmFsdWUudG9TdHJpbmcoKSApO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZVZpZXcoKXtcbiAgICBpZiggc3RhdGUucHJlc3NpbmcgKXtcbiAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLklOVEVSQUNUSU9OX0NPTE9SICk7XG4gICAgfVxuICAgIGVsc2VcbiAgICBpZiggaW50ZXJhY3Rpb24uaG92ZXJpbmcoKSApe1xuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuSElHSExJR0hUX0NPTE9SICk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ERUZBVUxUX0NPTE9SICk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlU2xpZGVyKCl7XG4gICAgZmlsbGVkVm9sdW1lLnNjYWxlLnggPVxuICAgICAgTWF0aC5taW4oXG4gICAgICAgIE1hdGgubWF4KCBnZXRBbHBoYUZyb21WYWx1ZSggc3RhdGUudmFsdWUsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICkgKiB3aWR0aCwgMC4wMDAwMDEgKSxcbiAgICAgICAgd2lkdGhcbiAgICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVPYmplY3QoIHZhbHVlICl7XG4gICAgb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSA9IHZhbHVlO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlU3RhdGVGcm9tQWxwaGEoIGFscGhhICl7XG4gICAgc3RhdGUuYWxwaGEgPSBnZXRDbGFtcGVkQWxwaGEoIGFscGhhICk7XG4gICAgc3RhdGUudmFsdWUgPSBnZXRWYWx1ZUZyb21BbHBoYSggc3RhdGUuYWxwaGEsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICk7XG4gICAgaWYoIHN0YXRlLnVzZVN0ZXAgKXtcbiAgICAgIHN0YXRlLnZhbHVlID0gZ2V0U3RlcHBlZFZhbHVlKCBzdGF0ZS52YWx1ZSwgc3RhdGUuc3RlcCApO1xuICAgIH1cbiAgICBzdGF0ZS52YWx1ZSA9IGdldENsYW1wZWRWYWx1ZSggc3RhdGUudmFsdWUsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICk7XG4gIH1cblxuICBmdW5jdGlvbiBsaXN0ZW5VcGRhdGUoKXtcbiAgICBzdGF0ZS52YWx1ZSA9IGdldFZhbHVlRnJvbU9iamVjdCgpO1xuICAgIHN0YXRlLmFscGhhID0gZ2V0QWxwaGFGcm9tVmFsdWUoIHN0YXRlLnZhbHVlLCBzdGF0ZS5taW4sIHN0YXRlLm1heCApO1xuICAgIHN0YXRlLmFscGhhID0gZ2V0Q2xhbXBlZEFscGhhKCBzdGF0ZS5hbHBoYSApO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VmFsdWVGcm9tT2JqZWN0KCl7XG4gICAgcmV0dXJuIHBhcnNlRmxvYXQoIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gKTtcbiAgfVxuXG4gIGdyb3VwLm9uQ2hhbmdlID0gZnVuY3Rpb24oIGNhbGxiYWNrICl7XG4gICAgc3RhdGUub25DaGFuZ2VkQ0IgPSBjYWxsYmFjaztcbiAgICByZXR1cm4gZ3JvdXA7XG4gIH07XG5cbiAgZ3JvdXAuc3RlcCA9IGZ1bmN0aW9uKCBzdGVwICl7XG4gICAgc3RhdGUuc3RlcCA9IHN0ZXA7XG4gICAgc3RhdGUucHJlY2lzaW9uID0gbnVtRGVjaW1hbHMoIHN0YXRlLnN0ZXAgKVxuICAgIHN0YXRlLnVzZVN0ZXAgPSB0cnVlO1xuXG4gICAgc3RhdGUuYWxwaGEgPSBnZXRBbHBoYUZyb21WYWx1ZSggc3RhdGUudmFsdWUsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICk7XG5cbiAgICB1cGRhdGVTdGF0ZUZyb21BbHBoYSggc3RhdGUuYWxwaGEgKTtcbiAgICB1cGRhdGVWYWx1ZUxhYmVsKCBzdGF0ZS52YWx1ZSApO1xuICAgIHVwZGF0ZVNsaWRlciggKTtcbiAgICByZXR1cm4gZ3JvdXA7XG4gIH07XG5cbiAgZ3JvdXAubGlzdGVuID0gZnVuY3Rpb24oKXtcbiAgICBzdGF0ZS5saXN0ZW4gPSB0cnVlO1xuICAgIHJldHVybiBncm91cDtcbiAgfTtcblxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBoaXRzY2FuVm9sdW1lICk7XG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGhhbmRsZVByZXNzICk7XG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ3ByZXNzaW5nJywgaGFuZGxlSG9sZCApO1xuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblJlbGVhc2VkJywgaGFuZGxlUmVsZWFzZSApO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZVByZXNzKCBwICl7XG4gICAgaWYoIGdyb3VwLnZpc2libGUgPT09IGZhbHNlICl7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHN0YXRlLnByZXNzaW5nID0gdHJ1ZTtcbiAgICBwLmxvY2tlZCA9IHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVIb2xkKCB7IHBvaW50IH0gPSB7fSApe1xuICAgIGlmKCBncm91cC52aXNpYmxlID09PSBmYWxzZSApe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHN0YXRlLnByZXNzaW5nID0gdHJ1ZTtcblxuICAgIGZpbGxlZFZvbHVtZS51cGRhdGVNYXRyaXhXb3JsZCgpO1xuICAgIGVuZExvY2F0b3IudXBkYXRlTWF0cml4V29ybGQoKTtcblxuICAgIGNvbnN0IGEgPSBuZXcgVEhSRUUuVmVjdG9yMygpLnNldEZyb21NYXRyaXhQb3NpdGlvbiggZmlsbGVkVm9sdW1lLm1hdHJpeFdvcmxkICk7XG4gICAgY29uc3QgYiA9IG5ldyBUSFJFRS5WZWN0b3IzKCkuc2V0RnJvbU1hdHJpeFBvc2l0aW9uKCBlbmRMb2NhdG9yLm1hdHJpeFdvcmxkICk7XG5cbiAgICBjb25zdCBwcmV2aW91c1ZhbHVlID0gc3RhdGUudmFsdWU7XG5cbiAgICB1cGRhdGVTdGF0ZUZyb21BbHBoYSggZ2V0UG9pbnRBbHBoYSggcG9pbnQsIHthLGJ9ICkgKTtcbiAgICB1cGRhdGVWYWx1ZUxhYmVsKCBzdGF0ZS52YWx1ZSApO1xuICAgIHVwZGF0ZVNsaWRlciggKTtcbiAgICB1cGRhdGVPYmplY3QoIHN0YXRlLnZhbHVlICk7XG5cbiAgICBpZiggcHJldmlvdXNWYWx1ZSAhPT0gc3RhdGUudmFsdWUgJiYgc3RhdGUub25DaGFuZ2VkQ0IgKXtcbiAgICAgIHN0YXRlLm9uQ2hhbmdlZENCKCBzdGF0ZS52YWx1ZSApO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVJlbGVhc2UoKXtcbiAgICBzdGF0ZS5wcmVzc2luZyA9IGZhbHNlO1xuICB9XG5cbiAgZ3JvdXAuaW50ZXJhY3Rpb24gPSBpbnRlcmFjdGlvbjtcbiAgZ3JvdXAuaGl0c2NhbiA9IFsgaGl0c2NhblZvbHVtZSwgcGFuZWwgXTtcblxuICBjb25zdCBncmFiSW50ZXJhY3Rpb24gPSBHcmFiLmNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSApO1xuICBjb25zdCBwYWxldHRlSW50ZXJhY3Rpb24gPSBQYWxldHRlLmNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSApO1xuXG4gIGdyb3VwLnVwZGF0ZUNvbnRyb2wgPSBmdW5jdGlvbiggaW5wdXRPYmplY3RzICl7XG4gICAgaW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcbiAgICBncmFiSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcbiAgICBwYWxldHRlSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcblxuICAgIGlmKCBzdGF0ZS5saXN0ZW4gKXtcbiAgICAgIGxpc3RlblVwZGF0ZSgpO1xuICAgICAgdXBkYXRlVmFsdWVMYWJlbCggc3RhdGUudmFsdWUgKTtcbiAgICAgIHVwZGF0ZVNsaWRlcigpO1xuICAgIH1cbiAgICB1cGRhdGVWaWV3KCk7XG4gIH07XG5cbiAgZ3JvdXAubmFtZSA9IGZ1bmN0aW9uKCBzdHIgKXtcbiAgICBkZXNjcmlwdG9yTGFiZWwudXBkYXRlTGFiZWwoIHN0ciApO1xuICAgIHJldHVybiBncm91cDtcbiAgfTtcblxuICBncm91cC5taW4gPSBmdW5jdGlvbiggbSApe1xuICAgIHN0YXRlLm1pbiA9IG07XG4gICAgc3RhdGUuYWxwaGEgPSBnZXRBbHBoYUZyb21WYWx1ZSggc3RhdGUudmFsdWUsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICk7XG4gICAgdXBkYXRlU3RhdGVGcm9tQWxwaGEoIHN0YXRlLmFscGhhICk7XG4gICAgdXBkYXRlVmFsdWVMYWJlbCggc3RhdGUudmFsdWUgKTtcbiAgICB1cGRhdGVTbGlkZXIoICk7XG4gICAgcmV0dXJuIGdyb3VwO1xuICB9O1xuXG4gIGdyb3VwLm1heCA9IGZ1bmN0aW9uKCBtICl7XG4gICAgc3RhdGUubWF4ID0gbTtcbiAgICBzdGF0ZS5hbHBoYSA9IGdldEFscGhhRnJvbVZhbHVlKCBzdGF0ZS52YWx1ZSwgc3RhdGUubWluLCBzdGF0ZS5tYXggKTtcbiAgICB1cGRhdGVTdGF0ZUZyb21BbHBoYSggc3RhdGUuYWxwaGEgKTtcbiAgICB1cGRhdGVWYWx1ZUxhYmVsKCBzdGF0ZS52YWx1ZSApO1xuICAgIHVwZGF0ZVNsaWRlciggKTtcbiAgICByZXR1cm4gZ3JvdXA7XG4gIH07XG5cbiAgcmV0dXJuIGdyb3VwO1xufVxuXG5jb25zdCB0YSA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5jb25zdCB0YiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5jb25zdCB0VG9BID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbmNvbnN0IGFUb0IgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuXG5mdW5jdGlvbiBnZXRQb2ludEFscGhhKCBwb2ludCwgc2VnbWVudCApe1xuICB0YS5jb3B5KCBzZWdtZW50LmIgKS5zdWIoIHNlZ21lbnQuYSApO1xuICB0Yi5jb3B5KCBwb2ludCApLnN1Yiggc2VnbWVudC5hICk7XG5cbiAgY29uc3QgcHJvamVjdGVkID0gdGIucHJvamVjdE9uVmVjdG9yKCB0YSApO1xuXG4gIHRUb0EuY29weSggcG9pbnQgKS5zdWIoIHNlZ21lbnQuYSApO1xuXG4gIGFUb0IuY29weSggc2VnbWVudC5iICkuc3ViKCBzZWdtZW50LmEgKS5ub3JtYWxpemUoKTtcblxuICBjb25zdCBzaWRlID0gdFRvQS5ub3JtYWxpemUoKS5kb3QoIGFUb0IgKSA+PSAwID8gMSA6IC0xO1xuXG4gIGNvbnN0IGxlbmd0aCA9IHNlZ21lbnQuYS5kaXN0YW5jZVRvKCBzZWdtZW50LmIgKSAqIHNpZGU7XG5cbiAgbGV0IGFscGhhID0gcHJvamVjdGVkLmxlbmd0aCgpIC8gbGVuZ3RoO1xuICBpZiggYWxwaGEgPiAxLjAgKXtcbiAgICBhbHBoYSA9IDEuMDtcbiAgfVxuICBpZiggYWxwaGEgPCAwLjAgKXtcbiAgICBhbHBoYSA9IDAuMDtcbiAgfVxuICByZXR1cm4gYWxwaGE7XG59XG5cbmZ1bmN0aW9uIGxlcnAobWluLCBtYXgsIHZhbHVlKSB7XG4gIHJldHVybiAoMS12YWx1ZSkqbWluICsgdmFsdWUqbWF4O1xufVxuXG5mdW5jdGlvbiBtYXBfcmFuZ2UodmFsdWUsIGxvdzEsIGhpZ2gxLCBsb3cyLCBoaWdoMikge1xuICAgIHJldHVybiBsb3cyICsgKGhpZ2gyIC0gbG93MikgKiAodmFsdWUgLSBsb3cxKSAvIChoaWdoMSAtIGxvdzEpO1xufVxuXG5mdW5jdGlvbiBnZXRDbGFtcGVkQWxwaGEoIGFscGhhICl7XG4gIGlmKCBhbHBoYSA+IDEgKXtcbiAgICByZXR1cm4gMVxuICB9XG4gIGlmKCBhbHBoYSA8IDAgKXtcbiAgICByZXR1cm4gMDtcbiAgfVxuICByZXR1cm4gYWxwaGE7XG59XG5cbmZ1bmN0aW9uIGdldENsYW1wZWRWYWx1ZSggdmFsdWUsIG1pbiwgbWF4ICl7XG4gIGlmKCB2YWx1ZSA8IG1pbiApe1xuICAgIHJldHVybiBtaW47XG4gIH1cbiAgaWYoIHZhbHVlID4gbWF4ICl7XG4gICAgcmV0dXJuIG1heDtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGdldEltcGxpZWRTdGVwKCB2YWx1ZSApe1xuICBpZiggdmFsdWUgPT09IDAgKXtcbiAgICByZXR1cm4gMTsgLy8gV2hhdCBhcmUgd2UsIHBzeWNoaWNzP1xuICB9IGVsc2Uge1xuICAgIC8vIEhleSBEb3VnLCBjaGVjayB0aGlzIG91dC5cbiAgICByZXR1cm4gTWF0aC5wb3coMTAsIE1hdGguZmxvb3IoTWF0aC5sb2coTWF0aC5hYnModmFsdWUpKS9NYXRoLkxOMTApKS8xMDtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRWYWx1ZUZyb21BbHBoYSggYWxwaGEsIG1pbiwgbWF4ICl7XG4gIHJldHVybiBtYXBfcmFuZ2UoIGFscGhhLCAwLjAsIDEuMCwgbWluLCBtYXggKVxufVxuXG5mdW5jdGlvbiBnZXRBbHBoYUZyb21WYWx1ZSggdmFsdWUsIG1pbiwgbWF4ICl7XG4gIHJldHVybiBtYXBfcmFuZ2UoIHZhbHVlLCBtaW4sIG1heCwgMC4wLCAxLjAgKTtcbn1cblxuZnVuY3Rpb24gZ2V0U3RlcHBlZFZhbHVlKCB2YWx1ZSwgc3RlcCApe1xuICBpZiggdmFsdWUgJSBzdGVwICE9IDApIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZCggdmFsdWUgLyBzdGVwICkgKiBzdGVwO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gbnVtRGVjaW1hbHMoeCkge1xuICB4ID0geC50b1N0cmluZygpO1xuICBpZiAoeC5pbmRleE9mKCcuJykgPiAtMSkge1xuICAgIHJldHVybiB4Lmxlbmd0aCAtIHguaW5kZXhPZignLicpIC0gMTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gMDtcbiAgfVxufVxuXG5mdW5jdGlvbiByb3VuZFRvRGVjaW1hbCh2YWx1ZSwgZGVjaW1hbHMpIHtcbiAgY29uc3QgdGVuVG8gPSBNYXRoLnBvdygxMCwgZGVjaW1hbHMpO1xuICByZXR1cm4gTWF0aC5yb3VuZCh2YWx1ZSAqIHRlblRvKSAvIHRlblRvO1xufSIsIi8qKlxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcbipcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXG4qXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4qXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbipcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cblxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZVRleHRMYWJlbCggdGV4dENyZWF0b3IsIHN0ciwgd2lkdGggPSAwLjQsIGRlcHRoID0gMC4wMjksIGZnQ29sb3IgPSAweGZmZmZmZiwgYmdDb2xvciA9IENvbG9ycy5ERUZBVUxUX0JBQ0ssIHNjYWxlID0gMS4wICl7XG5cbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgY29uc3QgaW50ZXJuYWxQb3NpdGlvbmluZyA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuICBncm91cC5hZGQoIGludGVybmFsUG9zaXRpb25pbmcgKTtcblxuICBjb25zdCB0ZXh0ID0gdGV4dENyZWF0b3IuY3JlYXRlKCBzdHIsIHsgY29sb3I6IGZnQ29sb3IsIHNjYWxlIH0gKTtcbiAgaW50ZXJuYWxQb3NpdGlvbmluZy5hZGQoIHRleHQgKTtcblxuXG4gIGdyb3VwLnNldFN0cmluZyA9IGZ1bmN0aW9uKCBzdHIgKXtcbiAgICB0ZXh0LnVwZGF0ZUxhYmVsKCBzdHIudG9TdHJpbmcoKSApO1xuICB9O1xuXG4gIGdyb3VwLnNldE51bWJlciA9IGZ1bmN0aW9uKCBzdHIgKXtcbiAgICB0ZXh0LnVwZGF0ZUxhYmVsKCBzdHIudG9GaXhlZCgyKSApO1xuICB9O1xuXG4gIHRleHQucG9zaXRpb24ueiA9IGRlcHRoO1xuXG4gIGNvbnN0IGJhY2tCb3VuZHMgPSAwLjAxO1xuICBjb25zdCBtYXJnaW4gPSAwLjAxO1xuICBjb25zdCB0b3RhbFdpZHRoID0gd2lkdGg7XG4gIGNvbnN0IHRvdGFsSGVpZ2h0ID0gMC4wNCArIG1hcmdpbiAqIDI7XG4gIGNvbnN0IGxhYmVsQmFja0dlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KCB0b3RhbFdpZHRoLCB0b3RhbEhlaWdodCwgZGVwdGgsIDEsIDEsIDEgKTtcbiAgbGFiZWxCYWNrR2VvbWV0cnkuYXBwbHlNYXRyaXgoIG5ldyBUSFJFRS5NYXRyaXg0KCkubWFrZVRyYW5zbGF0aW9uKCB0b3RhbFdpZHRoICogMC41IC0gbWFyZ2luLCAwLCAwICkgKTtcblxuICBjb25zdCBsYWJlbEJhY2tNZXNoID0gbmV3IFRIUkVFLk1lc2goIGxhYmVsQmFja0dlb21ldHJ5LCBTaGFyZWRNYXRlcmlhbHMuUEFORUwgKTtcbiAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIGxhYmVsQmFja01lc2guZ2VvbWV0cnksIGJnQ29sb3IgKTtcblxuICBsYWJlbEJhY2tNZXNoLnBvc2l0aW9uLnkgPSAwLjAzO1xuICBpbnRlcm5hbFBvc2l0aW9uaW5nLmFkZCggbGFiZWxCYWNrTWVzaCApO1xuICBpbnRlcm5hbFBvc2l0aW9uaW5nLnBvc2l0aW9uLnkgPSAtdG90YWxIZWlnaHQgKiAwLjU7XG5cbiAgZ3JvdXAuYmFjayA9IGxhYmVsQmFja01lc2g7XG5cbiAgcmV0dXJuIGdyb3VwO1xufSIsIi8qXG4gKlx0QGF1dGhvciB6ejg1IC8gaHR0cDovL3R3aXR0ZXIuY29tL2JsdXJzcGxpbmUgLyBodHRwOi8vd3d3LmxhYjRnYW1lcy5uZXQveno4NS9ibG9nXG4gKlx0QGF1dGhvciBjZW50ZXJpb253YXJlIC8gaHR0cDovL3d3dy5jZW50ZXJpb253YXJlLmNvbVxuICpcbiAqXHRTdWJkaXZpc2lvbiBHZW9tZXRyeSBNb2RpZmllclxuICpcdFx0dXNpbmcgTG9vcCBTdWJkaXZpc2lvbiBTY2hlbWVcbiAqXG4gKlx0UmVmZXJlbmNlczpcbiAqXHRcdGh0dHA6Ly9ncmFwaGljcy5zdGFuZm9yZC5lZHUvfm1kZmlzaGVyL3N1YmRpdmlzaW9uLmh0bWxcbiAqXHRcdGh0dHA6Ly93d3cuaG9sbWVzM2QubmV0L2dyYXBoaWNzL3N1YmRpdmlzaW9uL1xuICpcdFx0aHR0cDovL3d3dy5jcy5ydXRnZXJzLmVkdS9+ZGVjYXJsby9yZWFkaW5ncy9zdWJkaXYtc2cwMGMucGRmXG4gKlxuICpcdEtub3duIElzc3VlczpcbiAqXHRcdC0gY3VycmVudGx5IGRvZXNuJ3QgaGFuZGxlIFwiU2hhcnAgRWRnZXNcIlxuICovXG5cblRIUkVFLlN1YmRpdmlzaW9uTW9kaWZpZXIgPSBmdW5jdGlvbiAoIHN1YmRpdmlzaW9ucyApIHtcblxuXHR0aGlzLnN1YmRpdmlzaW9ucyA9ICggc3ViZGl2aXNpb25zID09PSB1bmRlZmluZWQgKSA/IDEgOiBzdWJkaXZpc2lvbnM7XG5cbn07XG5cbi8vIEFwcGxpZXMgdGhlIFwibW9kaWZ5XCIgcGF0dGVyblxuVEhSRUUuU3ViZGl2aXNpb25Nb2RpZmllci5wcm90b3R5cGUubW9kaWZ5ID0gZnVuY3Rpb24gKCBnZW9tZXRyeSApIHtcblxuXHR2YXIgcmVwZWF0cyA9IHRoaXMuc3ViZGl2aXNpb25zO1xuXG5cdHdoaWxlICggcmVwZWF0cyAtLSA+IDAgKSB7XG5cblx0XHR0aGlzLnNtb290aCggZ2VvbWV0cnkgKTtcblxuXHR9XG5cblx0Z2VvbWV0cnkuY29tcHV0ZUZhY2VOb3JtYWxzKCk7XG5cdGdlb21ldHJ5LmNvbXB1dGVWZXJ0ZXhOb3JtYWxzKCk7XG5cbn07XG5cbiggZnVuY3Rpb24oKSB7XG5cblx0Ly8gU29tZSBjb25zdGFudHNcblx0dmFyIFdBUk5JTkdTID0gISB0cnVlOyAvLyBTZXQgdG8gdHJ1ZSBmb3IgZGV2ZWxvcG1lbnRcblx0dmFyIEFCQyA9IFsgJ2EnLCAnYicsICdjJyBdO1xuXG5cblx0ZnVuY3Rpb24gZ2V0RWRnZSggYSwgYiwgbWFwICkge1xuXG5cdFx0dmFyIHZlcnRleEluZGV4QSA9IE1hdGgubWluKCBhLCBiICk7XG5cdFx0dmFyIHZlcnRleEluZGV4QiA9IE1hdGgubWF4KCBhLCBiICk7XG5cblx0XHR2YXIga2V5ID0gdmVydGV4SW5kZXhBICsgXCJfXCIgKyB2ZXJ0ZXhJbmRleEI7XG5cblx0XHRyZXR1cm4gbWFwWyBrZXkgXTtcblxuXHR9XG5cblxuXHRmdW5jdGlvbiBwcm9jZXNzRWRnZSggYSwgYiwgdmVydGljZXMsIG1hcCwgZmFjZSwgbWV0YVZlcnRpY2VzICkge1xuXG5cdFx0dmFyIHZlcnRleEluZGV4QSA9IE1hdGgubWluKCBhLCBiICk7XG5cdFx0dmFyIHZlcnRleEluZGV4QiA9IE1hdGgubWF4KCBhLCBiICk7XG5cblx0XHR2YXIga2V5ID0gdmVydGV4SW5kZXhBICsgXCJfXCIgKyB2ZXJ0ZXhJbmRleEI7XG5cblx0XHR2YXIgZWRnZTtcblxuXHRcdGlmICgga2V5IGluIG1hcCApIHtcblxuXHRcdFx0ZWRnZSA9IG1hcFsga2V5IF07XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHR2YXIgdmVydGV4QSA9IHZlcnRpY2VzWyB2ZXJ0ZXhJbmRleEEgXTtcblx0XHRcdHZhciB2ZXJ0ZXhCID0gdmVydGljZXNbIHZlcnRleEluZGV4QiBdO1xuXG5cdFx0XHRlZGdlID0ge1xuXG5cdFx0XHRcdGE6IHZlcnRleEEsIC8vIHBvaW50ZXIgcmVmZXJlbmNlXG5cdFx0XHRcdGI6IHZlcnRleEIsXG5cdFx0XHRcdG5ld0VkZ2U6IG51bGwsXG5cdFx0XHRcdC8vIGFJbmRleDogYSwgLy8gbnVtYmVyZWQgcmVmZXJlbmNlXG5cdFx0XHRcdC8vIGJJbmRleDogYixcblx0XHRcdFx0ZmFjZXM6IFtdIC8vIHBvaW50ZXJzIHRvIGZhY2VcblxuXHRcdFx0fTtcblxuXHRcdFx0bWFwWyBrZXkgXSA9IGVkZ2U7XG5cblx0XHR9XG5cblx0XHRlZGdlLmZhY2VzLnB1c2goIGZhY2UgKTtcblxuXHRcdG1ldGFWZXJ0aWNlc1sgYSBdLmVkZ2VzLnB1c2goIGVkZ2UgKTtcblx0XHRtZXRhVmVydGljZXNbIGIgXS5lZGdlcy5wdXNoKCBlZGdlICk7XG5cblxuXHR9XG5cblx0ZnVuY3Rpb24gZ2VuZXJhdGVMb29rdXBzKCB2ZXJ0aWNlcywgZmFjZXMsIG1ldGFWZXJ0aWNlcywgZWRnZXMgKSB7XG5cblx0XHR2YXIgaSwgaWwsIGZhY2UsIGVkZ2U7XG5cblx0XHRmb3IgKCBpID0gMCwgaWwgPSB2ZXJ0aWNlcy5sZW5ndGg7IGkgPCBpbDsgaSArKyApIHtcblxuXHRcdFx0bWV0YVZlcnRpY2VzWyBpIF0gPSB7IGVkZ2VzOiBbXSB9O1xuXG5cdFx0fVxuXG5cdFx0Zm9yICggaSA9IDAsIGlsID0gZmFjZXMubGVuZ3RoOyBpIDwgaWw7IGkgKysgKSB7XG5cblx0XHRcdGZhY2UgPSBmYWNlc1sgaSBdO1xuXG5cdFx0XHRwcm9jZXNzRWRnZSggZmFjZS5hLCBmYWNlLmIsIHZlcnRpY2VzLCBlZGdlcywgZmFjZSwgbWV0YVZlcnRpY2VzICk7XG5cdFx0XHRwcm9jZXNzRWRnZSggZmFjZS5iLCBmYWNlLmMsIHZlcnRpY2VzLCBlZGdlcywgZmFjZSwgbWV0YVZlcnRpY2VzICk7XG5cdFx0XHRwcm9jZXNzRWRnZSggZmFjZS5jLCBmYWNlLmEsIHZlcnRpY2VzLCBlZGdlcywgZmFjZSwgbWV0YVZlcnRpY2VzICk7XG5cblx0XHR9XG5cblx0fVxuXG5cdGZ1bmN0aW9uIG5ld0ZhY2UoIG5ld0ZhY2VzLCBhLCBiLCBjICkge1xuXG5cdFx0bmV3RmFjZXMucHVzaCggbmV3IFRIUkVFLkZhY2UzKCBhLCBiLCBjICkgKTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gbWlkcG9pbnQoIGEsIGIgKSB7XG5cblx0XHRyZXR1cm4gKCBNYXRoLmFicyggYiAtIGEgKSAvIDIgKSArIE1hdGgubWluKCBhLCBiICk7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIG5ld1V2KCBuZXdVdnMsIGEsIGIsIGMgKSB7XG5cblx0XHRuZXdVdnMucHVzaCggWyBhLmNsb25lKCksIGIuY2xvbmUoKSwgYy5jbG9uZSgpIF0gKTtcblxuXHR9XG5cblx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXHQvLyBQZXJmb3JtcyBvbmUgaXRlcmF0aW9uIG9mIFN1YmRpdmlzaW9uXG5cdFRIUkVFLlN1YmRpdmlzaW9uTW9kaWZpZXIucHJvdG90eXBlLnNtb290aCA9IGZ1bmN0aW9uICggZ2VvbWV0cnkgKSB7XG5cblx0XHR2YXIgdG1wID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcblxuXHRcdHZhciBvbGRWZXJ0aWNlcywgb2xkRmFjZXMsIG9sZFV2cztcblx0XHR2YXIgbmV3VmVydGljZXMsIG5ld0ZhY2VzLCBuZXdVVnMgPSBbXTtcblxuXHRcdHZhciBuLCBsLCBpLCBpbCwgaiwgaztcblx0XHR2YXIgbWV0YVZlcnRpY2VzLCBzb3VyY2VFZGdlcztcblxuXHRcdC8vIG5ldyBzdHVmZi5cblx0XHR2YXIgc291cmNlRWRnZXMsIG5ld0VkZ2VWZXJ0aWNlcywgbmV3U291cmNlVmVydGljZXM7XG5cblx0XHRvbGRWZXJ0aWNlcyA9IGdlb21ldHJ5LnZlcnRpY2VzOyAvLyB7IHgsIHksIHp9XG5cdFx0b2xkRmFjZXMgPSBnZW9tZXRyeS5mYWNlczsgLy8geyBhOiBvbGRWZXJ0ZXgxLCBiOiBvbGRWZXJ0ZXgyLCBjOiBvbGRWZXJ0ZXgzIH1cblx0XHRvbGRVdnMgPSBnZW9tZXRyeS5mYWNlVmVydGV4VXZzWyAwIF07XG5cblx0XHR2YXIgaGFzVXZzID0gb2xkVXZzICE9PSB1bmRlZmluZWQgJiYgb2xkVXZzLmxlbmd0aCA+IDA7XG5cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdFx0ICpcblx0XHQgKiBTdGVwIDA6IFByZXByb2Nlc3MgR2VvbWV0cnkgdG8gR2VuZXJhdGUgZWRnZXMgTG9va3VwXG5cdFx0ICpcblx0XHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHRcdG1ldGFWZXJ0aWNlcyA9IG5ldyBBcnJheSggb2xkVmVydGljZXMubGVuZ3RoICk7XG5cdFx0c291cmNlRWRnZXMgPSB7fTsgLy8gRWRnZSA9PiB7IG9sZFZlcnRleDEsIG9sZFZlcnRleDIsIGZhY2VzW10gIH1cblxuXHRcdGdlbmVyYXRlTG9va3Vwcyggb2xkVmVydGljZXMsIG9sZEZhY2VzLCBtZXRhVmVydGljZXMsIHNvdXJjZUVkZ2VzICk7XG5cblxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0XHQgKlxuXHRcdCAqXHRTdGVwIDEuXG5cdFx0ICpcdEZvciBlYWNoIGVkZ2UsIGNyZWF0ZSBhIG5ldyBFZGdlIFZlcnRleCxcblx0XHQgKlx0dGhlbiBwb3NpdGlvbiBpdC5cblx0XHQgKlxuXHRcdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cdFx0bmV3RWRnZVZlcnRpY2VzID0gW107XG5cdFx0dmFyIG90aGVyLCBjdXJyZW50RWRnZSwgbmV3RWRnZSwgZmFjZTtcblx0XHR2YXIgZWRnZVZlcnRleFdlaWdodCwgYWRqYWNlbnRWZXJ0ZXhXZWlnaHQsIGNvbm5lY3RlZEZhY2VzO1xuXG5cdFx0Zm9yICggaSBpbiBzb3VyY2VFZGdlcyApIHtcblxuXHRcdFx0Y3VycmVudEVkZ2UgPSBzb3VyY2VFZGdlc1sgaSBdO1xuXHRcdFx0bmV3RWRnZSA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cblx0XHRcdGVkZ2VWZXJ0ZXhXZWlnaHQgPSAzIC8gODtcblx0XHRcdGFkamFjZW50VmVydGV4V2VpZ2h0ID0gMSAvIDg7XG5cblx0XHRcdGNvbm5lY3RlZEZhY2VzID0gY3VycmVudEVkZ2UuZmFjZXMubGVuZ3RoO1xuXG5cdFx0XHQvLyBjaGVjayBob3cgbWFueSBsaW5rZWQgZmFjZXMuIDIgc2hvdWxkIGJlIGNvcnJlY3QuXG5cdFx0XHRpZiAoIGNvbm5lY3RlZEZhY2VzICE9IDIgKSB7XG5cblx0XHRcdFx0Ly8gaWYgbGVuZ3RoIGlzIG5vdCAyLCBoYW5kbGUgY29uZGl0aW9uXG5cdFx0XHRcdGVkZ2VWZXJ0ZXhXZWlnaHQgPSAwLjU7XG5cdFx0XHRcdGFkamFjZW50VmVydGV4V2VpZ2h0ID0gMDtcblxuXHRcdFx0XHRpZiAoIGNvbm5lY3RlZEZhY2VzICE9IDEgKSB7XG5cblx0XHRcdFx0XHRpZiAoIFdBUk5JTkdTICkgY29uc29sZS53YXJuKCAnU3ViZGl2aXNpb24gTW9kaWZpZXI6IE51bWJlciBvZiBjb25uZWN0ZWQgZmFjZXMgIT0gMiwgaXM6ICcsIGNvbm5lY3RlZEZhY2VzLCBjdXJyZW50RWRnZSApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0XHRuZXdFZGdlLmFkZFZlY3RvcnMoIGN1cnJlbnRFZGdlLmEsIGN1cnJlbnRFZGdlLmIgKS5tdWx0aXBseVNjYWxhciggZWRnZVZlcnRleFdlaWdodCApO1xuXG5cdFx0XHR0bXAuc2V0KCAwLCAwLCAwICk7XG5cblx0XHRcdGZvciAoIGogPSAwOyBqIDwgY29ubmVjdGVkRmFjZXM7IGogKysgKSB7XG5cblx0XHRcdFx0ZmFjZSA9IGN1cnJlbnRFZGdlLmZhY2VzWyBqIF07XG5cblx0XHRcdFx0Zm9yICggayA9IDA7IGsgPCAzOyBrICsrICkge1xuXG5cdFx0XHRcdFx0b3RoZXIgPSBvbGRWZXJ0aWNlc1sgZmFjZVsgQUJDWyBrIF0gXSBdO1xuXHRcdFx0XHRcdGlmICggb3RoZXIgIT09IGN1cnJlbnRFZGdlLmEgJiYgb3RoZXIgIT09IGN1cnJlbnRFZGdlLmIgKSBicmVhaztcblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0dG1wLmFkZCggb3RoZXIgKTtcblxuXHRcdFx0fVxuXG5cdFx0XHR0bXAubXVsdGlwbHlTY2FsYXIoIGFkamFjZW50VmVydGV4V2VpZ2h0ICk7XG5cdFx0XHRuZXdFZGdlLmFkZCggdG1wICk7XG5cblx0XHRcdGN1cnJlbnRFZGdlLm5ld0VkZ2UgPSBuZXdFZGdlVmVydGljZXMubGVuZ3RoO1xuXHRcdFx0bmV3RWRnZVZlcnRpY2VzLnB1c2goIG5ld0VkZ2UgKTtcblxuXHRcdFx0Ly8gY29uc29sZS5sb2coY3VycmVudEVkZ2UsIG5ld0VkZ2UpO1xuXG5cdFx0fVxuXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHRcdCAqXG5cdFx0ICpcdFN0ZXAgMi5cblx0XHQgKlx0UmVwb3NpdGlvbiBlYWNoIHNvdXJjZSB2ZXJ0aWNlcy5cblx0XHQgKlxuXHRcdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cdFx0dmFyIGJldGEsIHNvdXJjZVZlcnRleFdlaWdodCwgY29ubmVjdGluZ1ZlcnRleFdlaWdodDtcblx0XHR2YXIgY29ubmVjdGluZ0VkZ2UsIGNvbm5lY3RpbmdFZGdlcywgb2xkVmVydGV4LCBuZXdTb3VyY2VWZXJ0ZXg7XG5cdFx0bmV3U291cmNlVmVydGljZXMgPSBbXTtcblxuXHRcdGZvciAoIGkgPSAwLCBpbCA9IG9sZFZlcnRpY2VzLmxlbmd0aDsgaSA8IGlsOyBpICsrICkge1xuXG5cdFx0XHRvbGRWZXJ0ZXggPSBvbGRWZXJ0aWNlc1sgaSBdO1xuXG5cdFx0XHQvLyBmaW5kIGFsbCBjb25uZWN0aW5nIGVkZ2VzICh1c2luZyBsb29rdXBUYWJsZSlcblx0XHRcdGNvbm5lY3RpbmdFZGdlcyA9IG1ldGFWZXJ0aWNlc1sgaSBdLmVkZ2VzO1xuXHRcdFx0biA9IGNvbm5lY3RpbmdFZGdlcy5sZW5ndGg7XG5cblx0XHRcdGlmICggbiA9PSAzICkge1xuXG5cdFx0XHRcdGJldGEgPSAzIC8gMTY7XG5cblx0XHRcdH0gZWxzZSBpZiAoIG4gPiAzICkge1xuXG5cdFx0XHRcdGJldGEgPSAzIC8gKCA4ICogbiApOyAvLyBXYXJyZW4ncyBtb2RpZmllZCBmb3JtdWxhXG5cblx0XHRcdH1cblxuXHRcdFx0Ly8gTG9vcCdzIG9yaWdpbmFsIGJldGEgZm9ybXVsYVxuXHRcdFx0Ly8gYmV0YSA9IDEgLyBuICogKCA1LzggLSBNYXRoLnBvdyggMy84ICsgMS80ICogTWF0aC5jb3MoIDIgKiBNYXRoLiBQSSAvIG4gKSwgMikgKTtcblxuXHRcdFx0c291cmNlVmVydGV4V2VpZ2h0ID0gMSAtIG4gKiBiZXRhO1xuXHRcdFx0Y29ubmVjdGluZ1ZlcnRleFdlaWdodCA9IGJldGE7XG5cblx0XHRcdGlmICggbiA8PSAyICkge1xuXG5cdFx0XHRcdC8vIGNyZWFzZSBhbmQgYm91bmRhcnkgcnVsZXNcblx0XHRcdFx0Ly8gY29uc29sZS53YXJuKCdjcmVhc2UgYW5kIGJvdW5kYXJ5IHJ1bGVzJyk7XG5cblx0XHRcdFx0aWYgKCBuID09IDIgKSB7XG5cblx0XHRcdFx0XHRpZiAoIFdBUk5JTkdTICkgY29uc29sZS53YXJuKCAnMiBjb25uZWN0aW5nIGVkZ2VzJywgY29ubmVjdGluZ0VkZ2VzICk7XG5cdFx0XHRcdFx0c291cmNlVmVydGV4V2VpZ2h0ID0gMyAvIDQ7XG5cdFx0XHRcdFx0Y29ubmVjdGluZ1ZlcnRleFdlaWdodCA9IDEgLyA4O1xuXG5cdFx0XHRcdFx0Ly8gc291cmNlVmVydGV4V2VpZ2h0ID0gMTtcblx0XHRcdFx0XHQvLyBjb25uZWN0aW5nVmVydGV4V2VpZ2h0ID0gMDtcblxuXHRcdFx0XHR9IGVsc2UgaWYgKCBuID09IDEgKSB7XG5cblx0XHRcdFx0XHRpZiAoIFdBUk5JTkdTICkgY29uc29sZS53YXJuKCAnb25seSAxIGNvbm5lY3RpbmcgZWRnZScgKTtcblxuXHRcdFx0XHR9IGVsc2UgaWYgKCBuID09IDAgKSB7XG5cblx0XHRcdFx0XHRpZiAoIFdBUk5JTkdTICkgY29uc29sZS53YXJuKCAnMCBjb25uZWN0aW5nIGVkZ2VzJyApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0XHRuZXdTb3VyY2VWZXJ0ZXggPSBvbGRWZXJ0ZXguY2xvbmUoKS5tdWx0aXBseVNjYWxhciggc291cmNlVmVydGV4V2VpZ2h0ICk7XG5cblx0XHRcdHRtcC5zZXQoIDAsIDAsIDAgKTtcblxuXHRcdFx0Zm9yICggaiA9IDA7IGogPCBuOyBqICsrICkge1xuXG5cdFx0XHRcdGNvbm5lY3RpbmdFZGdlID0gY29ubmVjdGluZ0VkZ2VzWyBqIF07XG5cdFx0XHRcdG90aGVyID0gY29ubmVjdGluZ0VkZ2UuYSAhPT0gb2xkVmVydGV4ID8gY29ubmVjdGluZ0VkZ2UuYSA6IGNvbm5lY3RpbmdFZGdlLmI7XG5cdFx0XHRcdHRtcC5hZGQoIG90aGVyICk7XG5cblx0XHRcdH1cblxuXHRcdFx0dG1wLm11bHRpcGx5U2NhbGFyKCBjb25uZWN0aW5nVmVydGV4V2VpZ2h0ICk7XG5cdFx0XHRuZXdTb3VyY2VWZXJ0ZXguYWRkKCB0bXAgKTtcblxuXHRcdFx0bmV3U291cmNlVmVydGljZXMucHVzaCggbmV3U291cmNlVmVydGV4ICk7XG5cblx0XHR9XG5cblxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0XHQgKlxuXHRcdCAqXHRTdGVwIDMuXG5cdFx0ICpcdEdlbmVyYXRlIEZhY2VzIGJldHdlZW4gc291cmNlIHZlcnRpY2VzXG5cdFx0ICpcdGFuZCBlZGdlIHZlcnRpY2VzLlxuXHRcdCAqXG5cdFx0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblx0XHRuZXdWZXJ0aWNlcyA9IG5ld1NvdXJjZVZlcnRpY2VzLmNvbmNhdCggbmV3RWRnZVZlcnRpY2VzICk7XG5cdFx0dmFyIHNsID0gbmV3U291cmNlVmVydGljZXMubGVuZ3RoLCBlZGdlMSwgZWRnZTIsIGVkZ2UzO1xuXHRcdG5ld0ZhY2VzID0gW107XG5cblx0XHR2YXIgdXYsIHgwLCB4MSwgeDI7XG5cdFx0dmFyIHgzID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcblx0XHR2YXIgeDQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuXHRcdHZhciB4NSA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG5cblx0XHRmb3IgKCBpID0gMCwgaWwgPSBvbGRGYWNlcy5sZW5ndGg7IGkgPCBpbDsgaSArKyApIHtcblxuXHRcdFx0ZmFjZSA9IG9sZEZhY2VzWyBpIF07XG5cblx0XHRcdC8vIGZpbmQgdGhlIDMgbmV3IGVkZ2VzIHZlcnRleCBvZiBlYWNoIG9sZCBmYWNlXG5cblx0XHRcdGVkZ2UxID0gZ2V0RWRnZSggZmFjZS5hLCBmYWNlLmIsIHNvdXJjZUVkZ2VzICkubmV3RWRnZSArIHNsO1xuXHRcdFx0ZWRnZTIgPSBnZXRFZGdlKCBmYWNlLmIsIGZhY2UuYywgc291cmNlRWRnZXMgKS5uZXdFZGdlICsgc2w7XG5cdFx0XHRlZGdlMyA9IGdldEVkZ2UoIGZhY2UuYywgZmFjZS5hLCBzb3VyY2VFZGdlcyApLm5ld0VkZ2UgKyBzbDtcblxuXHRcdFx0Ly8gY3JlYXRlIDQgZmFjZXMuXG5cblx0XHRcdG5ld0ZhY2UoIG5ld0ZhY2VzLCBlZGdlMSwgZWRnZTIsIGVkZ2UzICk7XG5cdFx0XHRuZXdGYWNlKCBuZXdGYWNlcywgZmFjZS5hLCBlZGdlMSwgZWRnZTMgKTtcblx0XHRcdG5ld0ZhY2UoIG5ld0ZhY2VzLCBmYWNlLmIsIGVkZ2UyLCBlZGdlMSApO1xuXHRcdFx0bmV3RmFjZSggbmV3RmFjZXMsIGZhY2UuYywgZWRnZTMsIGVkZ2UyICk7XG5cblx0XHRcdC8vIGNyZWF0ZSA0IG5ldyB1didzXG5cblx0XHRcdGlmICggaGFzVXZzICkge1xuXG5cdFx0XHRcdHV2ID0gb2xkVXZzWyBpIF07XG5cblx0XHRcdFx0eDAgPSB1dlsgMCBdO1xuXHRcdFx0XHR4MSA9IHV2WyAxIF07XG5cdFx0XHRcdHgyID0gdXZbIDIgXTtcblxuXHRcdFx0XHR4My5zZXQoIG1pZHBvaW50KCB4MC54LCB4MS54ICksIG1pZHBvaW50KCB4MC55LCB4MS55ICkgKTtcblx0XHRcdFx0eDQuc2V0KCBtaWRwb2ludCggeDEueCwgeDIueCApLCBtaWRwb2ludCggeDEueSwgeDIueSApICk7XG5cdFx0XHRcdHg1LnNldCggbWlkcG9pbnQoIHgwLngsIHgyLnggKSwgbWlkcG9pbnQoIHgwLnksIHgyLnkgKSApO1xuXG5cdFx0XHRcdG5ld1V2KCBuZXdVVnMsIHgzLCB4NCwgeDUgKTtcblx0XHRcdFx0bmV3VXYoIG5ld1VWcywgeDAsIHgzLCB4NSApO1xuXG5cdFx0XHRcdG5ld1V2KCBuZXdVVnMsIHgxLCB4NCwgeDMgKTtcblx0XHRcdFx0bmV3VXYoIG5ld1VWcywgeDIsIHg1LCB4NCApO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHQvLyBPdmVyd3JpdGUgb2xkIGFycmF5c1xuXHRcdGdlb21ldHJ5LnZlcnRpY2VzID0gbmV3VmVydGljZXM7XG5cdFx0Z2VvbWV0cnkuZmFjZXMgPSBuZXdGYWNlcztcblx0XHRpZiAoIGhhc1V2cyApIGdlb21ldHJ5LmZhY2VWZXJ0ZXhVdnNbIDAgXSA9IG5ld1VWcztcblxuXHRcdC8vIGNvbnNvbGUubG9nKCdkb25lJyk7XG5cblx0fTtcblxufSApKCk7XG4iLCJ2YXIgc3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFuQXJyYXlcblxuZnVuY3Rpb24gYW5BcnJheShhcnIpIHtcbiAgcmV0dXJuIChcbiAgICAgICBhcnIuQllURVNfUEVSX0VMRU1FTlRcbiAgICAmJiBzdHIuY2FsbChhcnIuYnVmZmVyKSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJ1xuICAgIHx8IEFycmF5LmlzQXJyYXkoYXJyKVxuICApXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG51bXR5cGUobnVtLCBkZWYpIHtcblx0cmV0dXJuIHR5cGVvZiBudW0gPT09ICdudW1iZXInXG5cdFx0PyBudW0gXG5cdFx0OiAodHlwZW9mIGRlZiA9PT0gJ251bWJlcicgPyBkZWYgOiAwKVxufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZHR5cGUpIHtcbiAgc3dpdGNoIChkdHlwZSkge1xuICAgIGNhc2UgJ2ludDgnOlxuICAgICAgcmV0dXJuIEludDhBcnJheVxuICAgIGNhc2UgJ2ludDE2JzpcbiAgICAgIHJldHVybiBJbnQxNkFycmF5XG4gICAgY2FzZSAnaW50MzInOlxuICAgICAgcmV0dXJuIEludDMyQXJyYXlcbiAgICBjYXNlICd1aW50OCc6XG4gICAgICByZXR1cm4gVWludDhBcnJheVxuICAgIGNhc2UgJ3VpbnQxNic6XG4gICAgICByZXR1cm4gVWludDE2QXJyYXlcbiAgICBjYXNlICd1aW50MzInOlxuICAgICAgcmV0dXJuIFVpbnQzMkFycmF5XG4gICAgY2FzZSAnZmxvYXQzMic6XG4gICAgICByZXR1cm4gRmxvYXQzMkFycmF5XG4gICAgY2FzZSAnZmxvYXQ2NCc6XG4gICAgICByZXR1cm4gRmxvYXQ2NEFycmF5XG4gICAgY2FzZSAnYXJyYXknOlxuICAgICAgcmV0dXJuIEFycmF5XG4gICAgY2FzZSAndWludDhfY2xhbXBlZCc6XG4gICAgICByZXR1cm4gVWludDhDbGFtcGVkQXJyYXlcbiAgfVxufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEF0IGxlYXN0IGdpdmUgc29tZSBraW5kIG9mIGNvbnRleHQgdG8gdGhlIHVzZXJcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4gKCcgKyBlciArICcpJyk7XG4gICAgICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICh0aGlzLl9ldmVudHMpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV2bGlzdGVuZXIpKVxuICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZSBpZiAoZXZsaXN0ZW5lcilcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiLyplc2xpbnQgbmV3LWNhcDowKi9cbnZhciBkdHlwZSA9IHJlcXVpcmUoJ2R0eXBlJylcbm1vZHVsZS5leHBvcnRzID0gZmxhdHRlblZlcnRleERhdGFcbmZ1bmN0aW9uIGZsYXR0ZW5WZXJ0ZXhEYXRhIChkYXRhLCBvdXRwdXQsIG9mZnNldCkge1xuICBpZiAoIWRhdGEpIHRocm93IG5ldyBUeXBlRXJyb3IoJ211c3Qgc3BlY2lmeSBkYXRhIGFzIGZpcnN0IHBhcmFtZXRlcicpXG4gIG9mZnNldCA9ICsob2Zmc2V0IHx8IDApIHwgMFxuXG4gIGlmIChBcnJheS5pc0FycmF5KGRhdGEpICYmIEFycmF5LmlzQXJyYXkoZGF0YVswXSkpIHtcbiAgICB2YXIgZGltID0gZGF0YVswXS5sZW5ndGhcbiAgICB2YXIgbGVuZ3RoID0gZGF0YS5sZW5ndGggKiBkaW1cblxuICAgIC8vIG5vIG91dHB1dCBzcGVjaWZpZWQsIGNyZWF0ZSBhIG5ldyB0eXBlZCBhcnJheVxuICAgIGlmICghb3V0cHV0IHx8IHR5cGVvZiBvdXRwdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBvdXRwdXQgPSBuZXcgKGR0eXBlKG91dHB1dCB8fCAnZmxvYXQzMicpKShsZW5ndGggKyBvZmZzZXQpXG4gICAgfVxuXG4gICAgdmFyIGRzdExlbmd0aCA9IG91dHB1dC5sZW5ndGggLSBvZmZzZXRcbiAgICBpZiAobGVuZ3RoICE9PSBkc3RMZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignc291cmNlIGxlbmd0aCAnICsgbGVuZ3RoICsgJyAoJyArIGRpbSArICd4JyArIGRhdGEubGVuZ3RoICsgJyknICtcbiAgICAgICAgJyBkb2VzIG5vdCBtYXRjaCBkZXN0aW5hdGlvbiBsZW5ndGggJyArIGRzdExlbmd0aClcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMCwgayA9IG9mZnNldDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZGltOyBqKyspIHtcbiAgICAgICAgb3V0cHV0W2srK10gPSBkYXRhW2ldW2pdXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmICghb3V0cHV0IHx8IHR5cGVvZiBvdXRwdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyBubyBvdXRwdXQsIGNyZWF0ZSBhIG5ldyBvbmVcbiAgICAgIHZhciBDdG9yID0gZHR5cGUob3V0cHV0IHx8ICdmbG9hdDMyJylcbiAgICAgIGlmIChvZmZzZXQgPT09IDApIHtcbiAgICAgICAgb3V0cHV0ID0gbmV3IEN0b3IoZGF0YSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHB1dCA9IG5ldyBDdG9yKGRhdGEubGVuZ3RoICsgb2Zmc2V0KVxuICAgICAgICBvdXRwdXQuc2V0KGRhdGEsIG9mZnNldClcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc3RvcmUgb3V0cHV0IGluIGV4aXN0aW5nIGFycmF5XG4gICAgICBvdXRwdXQuc2V0KGRhdGEsIG9mZnNldClcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb3V0cHV0XG59XG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsIi8qIVxuICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBhIEJ1ZmZlclxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxuLy8gVGhlIF9pc0J1ZmZlciBjaGVjayBpcyBmb3IgU2FmYXJpIDUtNyBzdXBwb3J0LCBiZWNhdXNlIGl0J3MgbWlzc2luZ1xuLy8gT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogIT0gbnVsbCAmJiAoaXNCdWZmZXIob2JqKSB8fCBpc1Nsb3dCdWZmZXIob2JqKSB8fCAhIW9iai5faXNCdWZmZXIpXG59XG5cbmZ1bmN0aW9uIGlzQnVmZmVyIChvYmopIHtcbiAgcmV0dXJuICEhb2JqLmNvbnN0cnVjdG9yICYmIHR5cGVvZiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyKG9iailcbn1cblxuLy8gRm9yIE5vZGUgdjAuMTAgc3VwcG9ydC4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseS5cbmZ1bmN0aW9uIGlzU2xvd0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqLnJlYWRGbG9hdExFID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmouc2xpY2UgPT09ICdmdW5jdGlvbicgJiYgaXNCdWZmZXIob2JqLnNsaWNlKDAsIDApKVxufVxuIiwidmFyIHdvcmRXcmFwID0gcmVxdWlyZSgnd29yZC13cmFwcGVyJylcbnZhciB4dGVuZCA9IHJlcXVpcmUoJ3h0ZW5kJylcbnZhciBudW1iZXIgPSByZXF1aXJlKCdhcy1udW1iZXInKVxuXG52YXIgWF9IRUlHSFRTID0gWyd4JywgJ2UnLCAnYScsICdvJywgJ24nLCAncycsICdyJywgJ2MnLCAndScsICdtJywgJ3YnLCAndycsICd6J11cbnZhciBNX1dJRFRIUyA9IFsnbScsICd3J11cbnZhciBDQVBfSEVJR0hUUyA9IFsnSCcsICdJJywgJ04nLCAnRScsICdGJywgJ0snLCAnTCcsICdUJywgJ1UnLCAnVicsICdXJywgJ1gnLCAnWScsICdaJ11cblxuXG52YXIgVEFCX0lEID0gJ1xcdCcuY2hhckNvZGVBdCgwKVxudmFyIFNQQUNFX0lEID0gJyAnLmNoYXJDb2RlQXQoMClcbnZhciBBTElHTl9MRUZUID0gMCwgXG4gICAgQUxJR05fQ0VOVEVSID0gMSwgXG4gICAgQUxJR05fUklHSFQgPSAyXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlTGF5b3V0KG9wdCkge1xuICByZXR1cm4gbmV3IFRleHRMYXlvdXQob3B0KVxufVxuXG5mdW5jdGlvbiBUZXh0TGF5b3V0KG9wdCkge1xuICB0aGlzLmdseXBocyA9IFtdXG4gIHRoaXMuX21lYXN1cmUgPSB0aGlzLmNvbXB1dGVNZXRyaWNzLmJpbmQodGhpcylcbiAgdGhpcy51cGRhdGUob3B0KVxufVxuXG5UZXh0TGF5b3V0LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihvcHQpIHtcbiAgb3B0ID0geHRlbmQoe1xuICAgIG1lYXN1cmU6IHRoaXMuX21lYXN1cmVcbiAgfSwgb3B0KVxuICB0aGlzLl9vcHQgPSBvcHRcbiAgdGhpcy5fb3B0LnRhYlNpemUgPSBudW1iZXIodGhpcy5fb3B0LnRhYlNpemUsIDQpXG5cbiAgaWYgKCFvcHQuZm9udClcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ211c3QgcHJvdmlkZSBhIHZhbGlkIGJpdG1hcCBmb250JylcblxuICB2YXIgZ2x5cGhzID0gdGhpcy5nbHlwaHNcbiAgdmFyIHRleHQgPSBvcHQudGV4dHx8JycgXG4gIHZhciBmb250ID0gb3B0LmZvbnRcbiAgdGhpcy5fc2V0dXBTcGFjZUdseXBocyhmb250KVxuICBcbiAgdmFyIGxpbmVzID0gd29yZFdyYXAubGluZXModGV4dCwgb3B0KVxuICB2YXIgbWluV2lkdGggPSBvcHQud2lkdGggfHwgMFxuXG4gIC8vY2xlYXIgZ2x5cGhzXG4gIGdseXBocy5sZW5ndGggPSAwXG5cbiAgLy9nZXQgbWF4IGxpbmUgd2lkdGhcbiAgdmFyIG1heExpbmVXaWR0aCA9IGxpbmVzLnJlZHVjZShmdW5jdGlvbihwcmV2LCBsaW5lKSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KHByZXYsIGxpbmUud2lkdGgsIG1pbldpZHRoKVxuICB9LCAwKVxuXG4gIC8vdGhlIHBlbiBwb3NpdGlvblxuICB2YXIgeCA9IDBcbiAgdmFyIHkgPSAwXG4gIHZhciBsaW5lSGVpZ2h0ID0gbnVtYmVyKG9wdC5saW5lSGVpZ2h0LCBmb250LmNvbW1vbi5saW5lSGVpZ2h0KVxuICB2YXIgYmFzZWxpbmUgPSBmb250LmNvbW1vbi5iYXNlXG4gIHZhciBkZXNjZW5kZXIgPSBsaW5lSGVpZ2h0LWJhc2VsaW5lXG4gIHZhciBsZXR0ZXJTcGFjaW5nID0gb3B0LmxldHRlclNwYWNpbmcgfHwgMFxuICB2YXIgaGVpZ2h0ID0gbGluZUhlaWdodCAqIGxpbmVzLmxlbmd0aCAtIGRlc2NlbmRlclxuICB2YXIgYWxpZ24gPSBnZXRBbGlnblR5cGUodGhpcy5fb3B0LmFsaWduKVxuXG4gIC8vZHJhdyB0ZXh0IGFsb25nIGJhc2VsaW5lXG4gIHkgLT0gaGVpZ2h0XG4gIFxuICAvL3RoZSBtZXRyaWNzIGZvciB0aGlzIHRleHQgbGF5b3V0XG4gIHRoaXMuX3dpZHRoID0gbWF4TGluZVdpZHRoXG4gIHRoaXMuX2hlaWdodCA9IGhlaWdodFxuICB0aGlzLl9kZXNjZW5kZXIgPSBsaW5lSGVpZ2h0IC0gYmFzZWxpbmVcbiAgdGhpcy5fYmFzZWxpbmUgPSBiYXNlbGluZVxuICB0aGlzLl94SGVpZ2h0ID0gZ2V0WEhlaWdodChmb250KVxuICB0aGlzLl9jYXBIZWlnaHQgPSBnZXRDYXBIZWlnaHQoZm9udClcbiAgdGhpcy5fbGluZUhlaWdodCA9IGxpbmVIZWlnaHRcbiAgdGhpcy5fYXNjZW5kZXIgPSBsaW5lSGVpZ2h0IC0gZGVzY2VuZGVyIC0gdGhpcy5feEhlaWdodFxuICAgIFxuICAvL2xheW91dCBlYWNoIGdseXBoXG4gIHZhciBzZWxmID0gdGhpc1xuICBsaW5lcy5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUsIGxpbmVJbmRleCkge1xuICAgIHZhciBzdGFydCA9IGxpbmUuc3RhcnRcbiAgICB2YXIgZW5kID0gbGluZS5lbmRcbiAgICB2YXIgbGluZVdpZHRoID0gbGluZS53aWR0aFxuICAgIHZhciBsYXN0R2x5cGhcbiAgICBcbiAgICAvL2ZvciBlYWNoIGdseXBoIGluIHRoYXQgbGluZS4uLlxuICAgIGZvciAodmFyIGk9c3RhcnQ7IGk8ZW5kOyBpKyspIHtcbiAgICAgIHZhciBpZCA9IHRleHQuY2hhckNvZGVBdChpKVxuICAgICAgdmFyIGdseXBoID0gc2VsZi5nZXRHbHlwaChmb250LCBpZClcbiAgICAgIGlmIChnbHlwaCkge1xuICAgICAgICBpZiAobGFzdEdseXBoKSBcbiAgICAgICAgICB4ICs9IGdldEtlcm5pbmcoZm9udCwgbGFzdEdseXBoLmlkLCBnbHlwaC5pZClcblxuICAgICAgICB2YXIgdHggPSB4XG4gICAgICAgIGlmIChhbGlnbiA9PT0gQUxJR05fQ0VOVEVSKSBcbiAgICAgICAgICB0eCArPSAobWF4TGluZVdpZHRoLWxpbmVXaWR0aCkvMlxuICAgICAgICBlbHNlIGlmIChhbGlnbiA9PT0gQUxJR05fUklHSFQpXG4gICAgICAgICAgdHggKz0gKG1heExpbmVXaWR0aC1saW5lV2lkdGgpXG5cbiAgICAgICAgZ2x5cGhzLnB1c2goe1xuICAgICAgICAgIHBvc2l0aW9uOiBbdHgsIHldLFxuICAgICAgICAgIGRhdGE6IGdseXBoLFxuICAgICAgICAgIGluZGV4OiBpLFxuICAgICAgICAgIGxpbmU6IGxpbmVJbmRleFxuICAgICAgICB9KSAgXG5cbiAgICAgICAgLy9tb3ZlIHBlbiBmb3J3YXJkXG4gICAgICAgIHggKz0gZ2x5cGgueGFkdmFuY2UgKyBsZXR0ZXJTcGFjaW5nXG4gICAgICAgIGxhc3RHbHlwaCA9IGdseXBoXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9uZXh0IGxpbmUgZG93blxuICAgIHkgKz0gbGluZUhlaWdodFxuICAgIHggPSAwXG4gIH0pXG4gIHRoaXMuX2xpbmVzVG90YWwgPSBsaW5lcy5sZW5ndGg7XG59XG5cblRleHRMYXlvdXQucHJvdG90eXBlLl9zZXR1cFNwYWNlR2x5cGhzID0gZnVuY3Rpb24oZm9udCkge1xuICAvL1RoZXNlIGFyZSBmYWxsYmFja3MsIHdoZW4gdGhlIGZvbnQgZG9lc24ndCBpbmNsdWRlXG4gIC8vJyAnIG9yICdcXHQnIGdseXBoc1xuICB0aGlzLl9mYWxsYmFja1NwYWNlR2x5cGggPSBudWxsXG4gIHRoaXMuX2ZhbGxiYWNrVGFiR2x5cGggPSBudWxsXG5cbiAgaWYgKCFmb250LmNoYXJzIHx8IGZvbnQuY2hhcnMubGVuZ3RoID09PSAwKVxuICAgIHJldHVyblxuXG4gIC8vdHJ5IHRvIGdldCBzcGFjZSBnbHlwaFxuICAvL3RoZW4gZmFsbCBiYWNrIHRvIHRoZSAnbScgb3IgJ3cnIGdseXBoc1xuICAvL3RoZW4gZmFsbCBiYWNrIHRvIHRoZSBmaXJzdCBnbHlwaCBhdmFpbGFibGVcbiAgdmFyIHNwYWNlID0gZ2V0R2x5cGhCeUlkKGZvbnQsIFNQQUNFX0lEKSBcbiAgICAgICAgICB8fCBnZXRNR2x5cGgoZm9udCkgXG4gICAgICAgICAgfHwgZm9udC5jaGFyc1swXVxuXG4gIC8vYW5kIGNyZWF0ZSBhIGZhbGxiYWNrIGZvciB0YWJcbiAgdmFyIHRhYldpZHRoID0gdGhpcy5fb3B0LnRhYlNpemUgKiBzcGFjZS54YWR2YW5jZVxuICB0aGlzLl9mYWxsYmFja1NwYWNlR2x5cGggPSBzcGFjZVxuICB0aGlzLl9mYWxsYmFja1RhYkdseXBoID0geHRlbmQoc3BhY2UsIHtcbiAgICB4OiAwLCB5OiAwLCB4YWR2YW5jZTogdGFiV2lkdGgsIGlkOiBUQUJfSUQsIFxuICAgIHhvZmZzZXQ6IDAsIHlvZmZzZXQ6IDAsIHdpZHRoOiAwLCBoZWlnaHQ6IDBcbiAgfSlcbn1cblxuVGV4dExheW91dC5wcm90b3R5cGUuZ2V0R2x5cGggPSBmdW5jdGlvbihmb250LCBpZCkge1xuICB2YXIgZ2x5cGggPSBnZXRHbHlwaEJ5SWQoZm9udCwgaWQpXG4gIGlmIChnbHlwaClcbiAgICByZXR1cm4gZ2x5cGhcbiAgZWxzZSBpZiAoaWQgPT09IFRBQl9JRCkgXG4gICAgcmV0dXJuIHRoaXMuX2ZhbGxiYWNrVGFiR2x5cGhcbiAgZWxzZSBpZiAoaWQgPT09IFNQQUNFX0lEKSBcbiAgICByZXR1cm4gdGhpcy5fZmFsbGJhY2tTcGFjZUdseXBoXG4gIHJldHVybiBudWxsXG59XG5cblRleHRMYXlvdXQucHJvdG90eXBlLmNvbXB1dGVNZXRyaWNzID0gZnVuY3Rpb24odGV4dCwgc3RhcnQsIGVuZCwgd2lkdGgpIHtcbiAgdmFyIGxldHRlclNwYWNpbmcgPSB0aGlzLl9vcHQubGV0dGVyU3BhY2luZyB8fCAwXG4gIHZhciBmb250ID0gdGhpcy5fb3B0LmZvbnRcbiAgdmFyIGN1clBlbiA9IDBcbiAgdmFyIGN1cldpZHRoID0gMFxuICB2YXIgY291bnQgPSAwXG4gIHZhciBnbHlwaFxuICB2YXIgbGFzdEdseXBoXG5cbiAgaWYgKCFmb250LmNoYXJzIHx8IGZvbnQuY2hhcnMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAgIGVuZDogc3RhcnQsXG4gICAgICB3aWR0aDogMFxuICAgIH1cbiAgfVxuXG4gIGVuZCA9IE1hdGgubWluKHRleHQubGVuZ3RoLCBlbmQpXG4gIGZvciAodmFyIGk9c3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHZhciBpZCA9IHRleHQuY2hhckNvZGVBdChpKVxuICAgIHZhciBnbHlwaCA9IHRoaXMuZ2V0R2x5cGgoZm9udCwgaWQpXG5cbiAgICBpZiAoZ2x5cGgpIHtcbiAgICAgIC8vbW92ZSBwZW4gZm9yd2FyZFxuICAgICAgdmFyIHhvZmYgPSBnbHlwaC54b2Zmc2V0XG4gICAgICB2YXIga2VybiA9IGxhc3RHbHlwaCA/IGdldEtlcm5pbmcoZm9udCwgbGFzdEdseXBoLmlkLCBnbHlwaC5pZCkgOiAwXG4gICAgICBjdXJQZW4gKz0ga2VyblxuXG4gICAgICB2YXIgbmV4dFBlbiA9IGN1clBlbiArIGdseXBoLnhhZHZhbmNlICsgbGV0dGVyU3BhY2luZ1xuICAgICAgdmFyIG5leHRXaWR0aCA9IGN1clBlbiArIGdseXBoLndpZHRoXG5cbiAgICAgIC8vd2UndmUgaGl0IG91ciBsaW1pdDsgd2UgY2FuJ3QgbW92ZSBvbnRvIHRoZSBuZXh0IGdseXBoXG4gICAgICBpZiAobmV4dFdpZHRoID49IHdpZHRoIHx8IG5leHRQZW4gPj0gd2lkdGgpXG4gICAgICAgIGJyZWFrXG5cbiAgICAgIC8vb3RoZXJ3aXNlIGNvbnRpbnVlIGFsb25nIG91ciBsaW5lXG4gICAgICBjdXJQZW4gPSBuZXh0UGVuXG4gICAgICBjdXJXaWR0aCA9IG5leHRXaWR0aFxuICAgICAgbGFzdEdseXBoID0gZ2x5cGhcbiAgICB9XG4gICAgY291bnQrK1xuICB9XG4gIFxuICAvL21ha2Ugc3VyZSByaWdodG1vc3QgZWRnZSBsaW5lcyB1cCB3aXRoIHJlbmRlcmVkIGdseXBoc1xuICBpZiAobGFzdEdseXBoKVxuICAgIGN1cldpZHRoICs9IGxhc3RHbHlwaC54b2Zmc2V0XG5cbiAgcmV0dXJuIHtcbiAgICBzdGFydDogc3RhcnQsXG4gICAgZW5kOiBzdGFydCArIGNvdW50LFxuICAgIHdpZHRoOiBjdXJXaWR0aFxuICB9XG59XG5cbi8vZ2V0dGVycyBmb3IgdGhlIHByaXZhdGUgdmFyc1xuO1snd2lkdGgnLCAnaGVpZ2h0JywgXG4gICdkZXNjZW5kZXInLCAnYXNjZW5kZXInLFxuICAneEhlaWdodCcsICdiYXNlbGluZScsXG4gICdjYXBIZWlnaHQnLFxuICAnbGluZUhlaWdodCcgXS5mb3JFYWNoKGFkZEdldHRlcilcblxuZnVuY3Rpb24gYWRkR2V0dGVyKG5hbWUpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRleHRMYXlvdXQucHJvdG90eXBlLCBuYW1lLCB7XG4gICAgZ2V0OiB3cmFwcGVyKG5hbWUpLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KVxufVxuXG4vL2NyZWF0ZSBsb29rdXBzIGZvciBwcml2YXRlIHZhcnNcbmZ1bmN0aW9uIHdyYXBwZXIobmFtZSkge1xuICByZXR1cm4gKG5ldyBGdW5jdGlvbihbXG4gICAgJ3JldHVybiBmdW5jdGlvbiAnK25hbWUrJygpIHsnLFxuICAgICcgIHJldHVybiB0aGlzLl8nK25hbWUsXG4gICAgJ30nXG4gIF0uam9pbignXFxuJykpKSgpXG59XG5cbmZ1bmN0aW9uIGdldEdseXBoQnlJZChmb250LCBpZCkge1xuICBpZiAoIWZvbnQuY2hhcnMgfHwgZm9udC5jaGFycy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIG51bGxcblxuICB2YXIgZ2x5cGhJZHggPSBmaW5kQ2hhcihmb250LmNoYXJzLCBpZClcbiAgaWYgKGdseXBoSWR4ID49IDApXG4gICAgcmV0dXJuIGZvbnQuY2hhcnNbZ2x5cGhJZHhdXG4gIHJldHVybiBudWxsXG59XG5cbmZ1bmN0aW9uIGdldFhIZWlnaHQoZm9udCkge1xuICBmb3IgKHZhciBpPTA7IGk8WF9IRUlHSFRTLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGlkID0gWF9IRUlHSFRTW2ldLmNoYXJDb2RlQXQoMClcbiAgICB2YXIgaWR4ID0gZmluZENoYXIoZm9udC5jaGFycywgaWQpXG4gICAgaWYgKGlkeCA+PSAwKSBcbiAgICAgIHJldHVybiBmb250LmNoYXJzW2lkeF0uaGVpZ2h0XG4gIH1cbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gZ2V0TUdseXBoKGZvbnQpIHtcbiAgZm9yICh2YXIgaT0wOyBpPE1fV0lEVEhTLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGlkID0gTV9XSURUSFNbaV0uY2hhckNvZGVBdCgwKVxuICAgIHZhciBpZHggPSBmaW5kQ2hhcihmb250LmNoYXJzLCBpZClcbiAgICBpZiAoaWR4ID49IDApIFxuICAgICAgcmV0dXJuIGZvbnQuY2hhcnNbaWR4XVxuICB9XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGdldENhcEhlaWdodChmb250KSB7XG4gIGZvciAodmFyIGk9MDsgaTxDQVBfSEVJR0hUUy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpZCA9IENBUF9IRUlHSFRTW2ldLmNoYXJDb2RlQXQoMClcbiAgICB2YXIgaWR4ID0gZmluZENoYXIoZm9udC5jaGFycywgaWQpXG4gICAgaWYgKGlkeCA+PSAwKSBcbiAgICAgIHJldHVybiBmb250LmNoYXJzW2lkeF0uaGVpZ2h0XG4gIH1cbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gZ2V0S2VybmluZyhmb250LCBsZWZ0LCByaWdodCkge1xuICBpZiAoIWZvbnQua2VybmluZ3MgfHwgZm9udC5rZXJuaW5ncy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIDBcblxuICB2YXIgdGFibGUgPSBmb250Lmtlcm5pbmdzXG4gIGZvciAodmFyIGk9MDsgaTx0YWJsZS5sZW5ndGg7IGkrKykge1xuICAgIHZhciBrZXJuID0gdGFibGVbaV1cbiAgICBpZiAoa2Vybi5maXJzdCA9PT0gbGVmdCAmJiBrZXJuLnNlY29uZCA9PT0gcmlnaHQpXG4gICAgICByZXR1cm4ga2Vybi5hbW91bnRcbiAgfVxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBnZXRBbGlnblR5cGUoYWxpZ24pIHtcbiAgaWYgKGFsaWduID09PSAnY2VudGVyJylcbiAgICByZXR1cm4gQUxJR05fQ0VOVEVSXG4gIGVsc2UgaWYgKGFsaWduID09PSAncmlnaHQnKVxuICAgIHJldHVybiBBTElHTl9SSUdIVFxuICByZXR1cm4gQUxJR05fTEVGVFxufVxuXG5mdW5jdGlvbiBmaW5kQ2hhciAoYXJyYXksIHZhbHVlLCBzdGFydCkge1xuICBzdGFydCA9IHN0YXJ0IHx8IDBcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoYXJyYXlbaV0uaWQgPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gaVxuICAgIH1cbiAgfVxuICByZXR1cm4gLTFcbn0iLCIvKlxub2JqZWN0LWFzc2lnblxuKGMpIFNpbmRyZSBTb3JodXNcbkBsaWNlbnNlIE1JVFxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctd3JhcHBlcnNcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZUJNRm9udEFzY2lpKGRhdGEpIHtcbiAgaWYgKCFkYXRhKVxuICAgIHRocm93IG5ldyBFcnJvcignbm8gZGF0YSBwcm92aWRlZCcpXG4gIGRhdGEgPSBkYXRhLnRvU3RyaW5nKCkudHJpbSgpXG5cbiAgdmFyIG91dHB1dCA9IHtcbiAgICBwYWdlczogW10sXG4gICAgY2hhcnM6IFtdLFxuICAgIGtlcm5pbmdzOiBbXVxuICB9XG5cbiAgdmFyIGxpbmVzID0gZGF0YS5zcGxpdCgvXFxyXFxuP3xcXG4vZylcblxuICBpZiAobGluZXMubGVuZ3RoID09PSAwKVxuICAgIHRocm93IG5ldyBFcnJvcignbm8gZGF0YSBpbiBCTUZvbnQgZmlsZScpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBsaW5lRGF0YSA9IHNwbGl0TGluZShsaW5lc1tpXSwgaSlcbiAgICBpZiAoIWxpbmVEYXRhKSAvL3NraXAgZW1wdHkgbGluZXNcbiAgICAgIGNvbnRpbnVlXG5cbiAgICBpZiAobGluZURhdGEua2V5ID09PSAncGFnZScpIHtcbiAgICAgIGlmICh0eXBlb2YgbGluZURhdGEuZGF0YS5pZCAhPT0gJ251bWJlcicpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbWFsZm9ybWVkIGZpbGUgYXQgbGluZSAnICsgaSArICcgLS0gbmVlZHMgcGFnZSBpZD1OJylcbiAgICAgIGlmICh0eXBlb2YgbGluZURhdGEuZGF0YS5maWxlICE9PSAnc3RyaW5nJylcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYWxmb3JtZWQgZmlsZSBhdCBsaW5lICcgKyBpICsgJyAtLSBuZWVkcyBwYWdlIGZpbGU9XCJwYXRoXCInKVxuICAgICAgb3V0cHV0LnBhZ2VzW2xpbmVEYXRhLmRhdGEuaWRdID0gbGluZURhdGEuZGF0YS5maWxlXG4gICAgfSBlbHNlIGlmIChsaW5lRGF0YS5rZXkgPT09ICdjaGFycycgfHwgbGluZURhdGEua2V5ID09PSAna2VybmluZ3MnKSB7XG4gICAgICAvLy4uLiBkbyBub3RoaW5nIGZvciB0aGVzZSB0d28gLi4uXG4gICAgfSBlbHNlIGlmIChsaW5lRGF0YS5rZXkgPT09ICdjaGFyJykge1xuICAgICAgb3V0cHV0LmNoYXJzLnB1c2gobGluZURhdGEuZGF0YSlcbiAgICB9IGVsc2UgaWYgKGxpbmVEYXRhLmtleSA9PT0gJ2tlcm5pbmcnKSB7XG4gICAgICBvdXRwdXQua2VybmluZ3MucHVzaChsaW5lRGF0YS5kYXRhKVxuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXRbbGluZURhdGEua2V5XSA9IGxpbmVEYXRhLmRhdGFcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb3V0cHV0XG59XG5cbmZ1bmN0aW9uIHNwbGl0TGluZShsaW5lLCBpZHgpIHtcbiAgbGluZSA9IGxpbmUucmVwbGFjZSgvXFx0Ky9nLCAnICcpLnRyaW0oKVxuICBpZiAoIWxpbmUpXG4gICAgcmV0dXJuIG51bGxcblxuICB2YXIgc3BhY2UgPSBsaW5lLmluZGV4T2YoJyAnKVxuICBpZiAoc3BhY2UgPT09IC0xKSBcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJubyBuYW1lZCByb3cgYXQgbGluZSBcIiArIGlkeClcblxuICB2YXIga2V5ID0gbGluZS5zdWJzdHJpbmcoMCwgc3BhY2UpXG5cbiAgbGluZSA9IGxpbmUuc3Vic3RyaW5nKHNwYWNlICsgMSlcbiAgLy9jbGVhciBcImxldHRlclwiIGZpZWxkIGFzIGl0IGlzIG5vbi1zdGFuZGFyZCBhbmRcbiAgLy9yZXF1aXJlcyBhZGRpdGlvbmFsIGNvbXBsZXhpdHkgdG8gcGFyc2UgXCIgLyA9IHN5bWJvbHNcbiAgbGluZSA9IGxpbmUucmVwbGFjZSgvbGV0dGVyPVtcXCdcXFwiXVxcUytbXFwnXFxcIl0vZ2ksICcnKSAgXG4gIGxpbmUgPSBsaW5lLnNwbGl0KFwiPVwiKVxuICBsaW5lID0gbGluZS5tYXAoZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIHN0ci50cmltKCkubWF0Y2goKC8oXCIuKj9cInxbXlwiXFxzXSspKyg/PVxccyp8XFxzKiQpL2cpKVxuICB9KVxuXG4gIHZhciBkYXRhID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5lLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGR0ID0gbGluZVtpXVxuICAgIGlmIChpID09PSAwKSB7XG4gICAgICBkYXRhLnB1c2goe1xuICAgICAgICBrZXk6IGR0WzBdLFxuICAgICAgICBkYXRhOiBcIlwiXG4gICAgICB9KVxuICAgIH0gZWxzZSBpZiAoaSA9PT0gbGluZS5sZW5ndGggLSAxKSB7XG4gICAgICBkYXRhW2RhdGEubGVuZ3RoIC0gMV0uZGF0YSA9IHBhcnNlRGF0YShkdFswXSlcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YVtkYXRhLmxlbmd0aCAtIDFdLmRhdGEgPSBwYXJzZURhdGEoZHRbMF0pXG4gICAgICBkYXRhLnB1c2goe1xuICAgICAgICBrZXk6IGR0WzFdLFxuICAgICAgICBkYXRhOiBcIlwiXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHZhciBvdXQgPSB7XG4gICAga2V5OiBrZXksXG4gICAgZGF0YToge31cbiAgfVxuXG4gIGRhdGEuZm9yRWFjaChmdW5jdGlvbih2KSB7XG4gICAgb3V0LmRhdGFbdi5rZXldID0gdi5kYXRhO1xuICB9KVxuXG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gcGFyc2VEYXRhKGRhdGEpIHtcbiAgaWYgKCFkYXRhIHx8IGRhdGEubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiBcIlwiXG5cbiAgaWYgKGRhdGEuaW5kZXhPZignXCInKSA9PT0gMCB8fCBkYXRhLmluZGV4T2YoXCInXCIpID09PSAwKVxuICAgIHJldHVybiBkYXRhLnN1YnN0cmluZygxLCBkYXRhLmxlbmd0aCAtIDEpXG4gIGlmIChkYXRhLmluZGV4T2YoJywnKSAhPT0gLTEpXG4gICAgcmV0dXJuIHBhcnNlSW50TGlzdChkYXRhKVxuICByZXR1cm4gcGFyc2VJbnQoZGF0YSwgMTApXG59XG5cbmZ1bmN0aW9uIHBhcnNlSW50TGlzdChkYXRhKSB7XG4gIHJldHVybiBkYXRhLnNwbGl0KCcsJykubWFwKGZ1bmN0aW9uKHZhbCkge1xuICAgIHJldHVybiBwYXJzZUludCh2YWwsIDEwKVxuICB9KVxufSIsInZhciBkdHlwZSA9IHJlcXVpcmUoJ2R0eXBlJylcbnZhciBhbkFycmF5ID0gcmVxdWlyZSgnYW4tYXJyYXknKVxudmFyIGlzQnVmZmVyID0gcmVxdWlyZSgnaXMtYnVmZmVyJylcblxudmFyIENXID0gWzAsIDIsIDNdXG52YXIgQ0NXID0gWzIsIDEsIDNdXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlUXVhZEVsZW1lbnRzKGFycmF5LCBvcHQpIHtcbiAgICAvL2lmIHVzZXIgZGlkbid0IHNwZWNpZnkgYW4gb3V0cHV0IGFycmF5XG4gICAgaWYgKCFhcnJheSB8fCAhKGFuQXJyYXkoYXJyYXkpIHx8IGlzQnVmZmVyKGFycmF5KSkpIHtcbiAgICAgICAgb3B0ID0gYXJyYXkgfHwge31cbiAgICAgICAgYXJyYXkgPSBudWxsXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvcHQgPT09ICdudW1iZXInKSAvL2JhY2t3YXJkcy1jb21wYXRpYmxlXG4gICAgICAgIG9wdCA9IHsgY291bnQ6IG9wdCB9XG4gICAgZWxzZVxuICAgICAgICBvcHQgPSBvcHQgfHwge31cblxuICAgIHZhciB0eXBlID0gdHlwZW9mIG9wdC50eXBlID09PSAnc3RyaW5nJyA/IG9wdC50eXBlIDogJ3VpbnQxNidcbiAgICB2YXIgY291bnQgPSB0eXBlb2Ygb3B0LmNvdW50ID09PSAnbnVtYmVyJyA/IG9wdC5jb3VudCA6IDFcbiAgICB2YXIgc3RhcnQgPSAob3B0LnN0YXJ0IHx8IDApIFxuXG4gICAgdmFyIGRpciA9IG9wdC5jbG9ja3dpc2UgIT09IGZhbHNlID8gQ1cgOiBDQ1csXG4gICAgICAgIGEgPSBkaXJbMF0sIFxuICAgICAgICBiID0gZGlyWzFdLFxuICAgICAgICBjID0gZGlyWzJdXG5cbiAgICB2YXIgbnVtSW5kaWNlcyA9IGNvdW50ICogNlxuXG4gICAgdmFyIGluZGljZXMgPSBhcnJheSB8fCBuZXcgKGR0eXBlKHR5cGUpKShudW1JbmRpY2VzKVxuICAgIGZvciAodmFyIGkgPSAwLCBqID0gMDsgaSA8IG51bUluZGljZXM7IGkgKz0gNiwgaiArPSA0KSB7XG4gICAgICAgIHZhciB4ID0gaSArIHN0YXJ0XG4gICAgICAgIGluZGljZXNbeCArIDBdID0gaiArIDBcbiAgICAgICAgaW5kaWNlc1t4ICsgMV0gPSBqICsgMVxuICAgICAgICBpbmRpY2VzW3ggKyAyXSA9IGogKyAyXG4gICAgICAgIGluZGljZXNbeCArIDNdID0gaiArIGFcbiAgICAgICAgaW5kaWNlc1t4ICsgNF0gPSBqICsgYlxuICAgICAgICBpbmRpY2VzW3ggKyA1XSA9IGogKyBjXG4gICAgfVxuICAgIHJldHVybiBpbmRpY2VzXG59IiwidmFyIGNyZWF0ZUxheW91dCA9IHJlcXVpcmUoJ2xheW91dC1ibWZvbnQtdGV4dCcpXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpXG52YXIgY3JlYXRlSW5kaWNlcyA9IHJlcXVpcmUoJ3F1YWQtaW5kaWNlcycpXG52YXIgYnVmZmVyID0gcmVxdWlyZSgndGhyZWUtYnVmZmVyLXZlcnRleC1kYXRhJylcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJylcblxudmFyIHZlcnRpY2VzID0gcmVxdWlyZSgnLi9saWIvdmVydGljZXMnKVxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi9saWIvdXRpbHMnKVxuXG52YXIgQmFzZSA9IFRIUkVFLkJ1ZmZlckdlb21ldHJ5XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlVGV4dEdlb21ldHJ5IChvcHQpIHtcbiAgcmV0dXJuIG5ldyBUZXh0R2VvbWV0cnkob3B0KVxufVxuXG5mdW5jdGlvbiBUZXh0R2VvbWV0cnkgKG9wdCkge1xuICBCYXNlLmNhbGwodGhpcylcblxuICBpZiAodHlwZW9mIG9wdCA9PT0gJ3N0cmluZycpIHtcbiAgICBvcHQgPSB7IHRleHQ6IG9wdCB9XG4gIH1cblxuICAvLyB1c2UgdGhlc2UgYXMgZGVmYXVsdCB2YWx1ZXMgZm9yIGFueSBzdWJzZXF1ZW50XG4gIC8vIGNhbGxzIHRvIHVwZGF0ZSgpXG4gIHRoaXMuX29wdCA9IGFzc2lnbih7fSwgb3B0KVxuXG4gIC8vIGFsc28gZG8gYW4gaW5pdGlhbCBzZXR1cC4uLlxuICBpZiAob3B0KSB0aGlzLnVwZGF0ZShvcHQpXG59XG5cbmluaGVyaXRzKFRleHRHZW9tZXRyeSwgQmFzZSlcblxuVGV4dEdlb21ldHJ5LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAob3B0KSB7XG4gIGlmICh0eXBlb2Ygb3B0ID09PSAnc3RyaW5nJykge1xuICAgIG9wdCA9IHsgdGV4dDogb3B0IH1cbiAgfVxuXG4gIC8vIHVzZSBjb25zdHJ1Y3RvciBkZWZhdWx0c1xuICBvcHQgPSBhc3NpZ24oe30sIHRoaXMuX29wdCwgb3B0KVxuXG4gIGlmICghb3B0LmZvbnQpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdtdXN0IHNwZWNpZnkgYSB7IGZvbnQgfSBpbiBvcHRpb25zJylcbiAgfVxuXG4gIHRoaXMubGF5b3V0ID0gY3JlYXRlTGF5b3V0KG9wdClcblxuICAvLyBnZXQgdmVjMiB0ZXhjb29yZHNcbiAgdmFyIGZsaXBZID0gb3B0LmZsaXBZICE9PSBmYWxzZVxuXG4gIC8vIHRoZSBkZXNpcmVkIEJNRm9udCBkYXRhXG4gIHZhciBmb250ID0gb3B0LmZvbnRcblxuICAvLyBkZXRlcm1pbmUgdGV4dHVyZSBzaXplIGZyb20gZm9udCBmaWxlXG4gIHZhciB0ZXhXaWR0aCA9IGZvbnQuY29tbW9uLnNjYWxlV1xuICB2YXIgdGV4SGVpZ2h0ID0gZm9udC5jb21tb24uc2NhbGVIXG5cbiAgLy8gZ2V0IHZpc2libGUgZ2x5cGhzXG4gIHZhciBnbHlwaHMgPSB0aGlzLmxheW91dC5nbHlwaHMuZmlsdGVyKGZ1bmN0aW9uIChnbHlwaCkge1xuICAgIHZhciBiaXRtYXAgPSBnbHlwaC5kYXRhXG4gICAgcmV0dXJuIGJpdG1hcC53aWR0aCAqIGJpdG1hcC5oZWlnaHQgPiAwXG4gIH0pXG5cbiAgLy8gcHJvdmlkZSB2aXNpYmxlIGdseXBocyBmb3IgY29udmVuaWVuY2VcbiAgdGhpcy52aXNpYmxlR2x5cGhzID0gZ2x5cGhzXG5cbiAgLy8gZ2V0IGNvbW1vbiB2ZXJ0ZXggZGF0YVxuICB2YXIgcG9zaXRpb25zID0gdmVydGljZXMucG9zaXRpb25zKGdseXBocylcbiAgdmFyIHV2cyA9IHZlcnRpY2VzLnV2cyhnbHlwaHMsIHRleFdpZHRoLCB0ZXhIZWlnaHQsIGZsaXBZKVxuICB2YXIgaW5kaWNlcyA9IGNyZWF0ZUluZGljZXMoe1xuICAgIGNsb2Nrd2lzZTogdHJ1ZSxcbiAgICB0eXBlOiAndWludDE2JyxcbiAgICBjb3VudDogZ2x5cGhzLmxlbmd0aFxuICB9KVxuXG4gIC8vIHVwZGF0ZSB2ZXJ0ZXggZGF0YVxuICBidWZmZXIuaW5kZXgodGhpcywgaW5kaWNlcywgMSwgJ3VpbnQxNicpXG4gIGJ1ZmZlci5hdHRyKHRoaXMsICdwb3NpdGlvbicsIHBvc2l0aW9ucywgMilcbiAgYnVmZmVyLmF0dHIodGhpcywgJ3V2JywgdXZzLCAyKVxuXG4gIC8vIHVwZGF0ZSBtdWx0aXBhZ2UgZGF0YVxuICBpZiAoIW9wdC5tdWx0aXBhZ2UgJiYgJ3BhZ2UnIGluIHRoaXMuYXR0cmlidXRlcykge1xuICAgIC8vIGRpc2FibGUgbXVsdGlwYWdlIHJlbmRlcmluZ1xuICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdwYWdlJylcbiAgfSBlbHNlIGlmIChvcHQubXVsdGlwYWdlKSB7XG4gICAgdmFyIHBhZ2VzID0gdmVydGljZXMucGFnZXMoZ2x5cGhzKVxuICAgIC8vIGVuYWJsZSBtdWx0aXBhZ2UgcmVuZGVyaW5nXG4gICAgYnVmZmVyLmF0dHIodGhpcywgJ3BhZ2UnLCBwYWdlcywgMSlcbiAgfVxufVxuXG5UZXh0R2VvbWV0cnkucHJvdG90eXBlLmNvbXB1dGVCb3VuZGluZ1NwaGVyZSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuYm91bmRpbmdTcGhlcmUgPT09IG51bGwpIHtcbiAgICB0aGlzLmJvdW5kaW5nU3BoZXJlID0gbmV3IFRIUkVFLlNwaGVyZSgpXG4gIH1cblxuICB2YXIgcG9zaXRpb25zID0gdGhpcy5hdHRyaWJ1dGVzLnBvc2l0aW9uLmFycmF5XG4gIHZhciBpdGVtU2l6ZSA9IHRoaXMuYXR0cmlidXRlcy5wb3NpdGlvbi5pdGVtU2l6ZVxuICBpZiAoIXBvc2l0aW9ucyB8fCAhaXRlbVNpemUgfHwgcG9zaXRpb25zLmxlbmd0aCA8IDIpIHtcbiAgICB0aGlzLmJvdW5kaW5nU3BoZXJlLnJhZGl1cyA9IDBcbiAgICB0aGlzLmJvdW5kaW5nU3BoZXJlLmNlbnRlci5zZXQoMCwgMCwgMClcbiAgICByZXR1cm5cbiAgfVxuICB1dGlscy5jb21wdXRlU3BoZXJlKHBvc2l0aW9ucywgdGhpcy5ib3VuZGluZ1NwaGVyZSlcbiAgaWYgKGlzTmFOKHRoaXMuYm91bmRpbmdTcGhlcmUucmFkaXVzKSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1RIUkVFLkJ1ZmZlckdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ1NwaGVyZSgpOiAnICtcbiAgICAgICdDb21wdXRlZCByYWRpdXMgaXMgTmFOLiBUaGUgJyArXG4gICAgICAnXCJwb3NpdGlvblwiIGF0dHJpYnV0ZSBpcyBsaWtlbHkgdG8gaGF2ZSBOYU4gdmFsdWVzLicpXG4gIH1cbn1cblxuVGV4dEdlb21ldHJ5LnByb3RvdHlwZS5jb21wdXRlQm91bmRpbmdCb3ggPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmJvdW5kaW5nQm94ID09PSBudWxsKSB7XG4gICAgdGhpcy5ib3VuZGluZ0JveCA9IG5ldyBUSFJFRS5Cb3gzKClcbiAgfVxuXG4gIHZhciBiYm94ID0gdGhpcy5ib3VuZGluZ0JveFxuICB2YXIgcG9zaXRpb25zID0gdGhpcy5hdHRyaWJ1dGVzLnBvc2l0aW9uLmFycmF5XG4gIHZhciBpdGVtU2l6ZSA9IHRoaXMuYXR0cmlidXRlcy5wb3NpdGlvbi5pdGVtU2l6ZVxuICBpZiAoIXBvc2l0aW9ucyB8fCAhaXRlbVNpemUgfHwgcG9zaXRpb25zLmxlbmd0aCA8IDIpIHtcbiAgICBiYm94Lm1ha2VFbXB0eSgpXG4gICAgcmV0dXJuXG4gIH1cbiAgdXRpbHMuY29tcHV0ZUJveChwb3NpdGlvbnMsIGJib3gpXG59XG4iLCJ2YXIgaXRlbVNpemUgPSAyXG52YXIgYm94ID0geyBtaW46IFswLCAwXSwgbWF4OiBbMCwgMF0gfVxuXG5mdW5jdGlvbiBib3VuZHMgKHBvc2l0aW9ucykge1xuICB2YXIgY291bnQgPSBwb3NpdGlvbnMubGVuZ3RoIC8gaXRlbVNpemVcbiAgYm94Lm1pblswXSA9IHBvc2l0aW9uc1swXVxuICBib3gubWluWzFdID0gcG9zaXRpb25zWzFdXG4gIGJveC5tYXhbMF0gPSBwb3NpdGlvbnNbMF1cbiAgYm94Lm1heFsxXSA9IHBvc2l0aW9uc1sxXVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgIHZhciB4ID0gcG9zaXRpb25zW2kgKiBpdGVtU2l6ZSArIDBdXG4gICAgdmFyIHkgPSBwb3NpdGlvbnNbaSAqIGl0ZW1TaXplICsgMV1cbiAgICBib3gubWluWzBdID0gTWF0aC5taW4oeCwgYm94Lm1pblswXSlcbiAgICBib3gubWluWzFdID0gTWF0aC5taW4oeSwgYm94Lm1pblsxXSlcbiAgICBib3gubWF4WzBdID0gTWF0aC5tYXgoeCwgYm94Lm1heFswXSlcbiAgICBib3gubWF4WzFdID0gTWF0aC5tYXgoeSwgYm94Lm1heFsxXSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cy5jb21wdXRlQm94ID0gZnVuY3Rpb24gKHBvc2l0aW9ucywgb3V0cHV0KSB7XG4gIGJvdW5kcyhwb3NpdGlvbnMpXG4gIG91dHB1dC5taW4uc2V0KGJveC5taW5bMF0sIGJveC5taW5bMV0sIDApXG4gIG91dHB1dC5tYXguc2V0KGJveC5tYXhbMF0sIGJveC5tYXhbMV0sIDApXG59XG5cbm1vZHVsZS5leHBvcnRzLmNvbXB1dGVTcGhlcmUgPSBmdW5jdGlvbiAocG9zaXRpb25zLCBvdXRwdXQpIHtcbiAgYm91bmRzKHBvc2l0aW9ucylcbiAgdmFyIG1pblggPSBib3gubWluWzBdXG4gIHZhciBtaW5ZID0gYm94Lm1pblsxXVxuICB2YXIgbWF4WCA9IGJveC5tYXhbMF1cbiAgdmFyIG1heFkgPSBib3gubWF4WzFdXG4gIHZhciB3aWR0aCA9IG1heFggLSBtaW5YXG4gIHZhciBoZWlnaHQgPSBtYXhZIC0gbWluWVxuICB2YXIgbGVuZ3RoID0gTWF0aC5zcXJ0KHdpZHRoICogd2lkdGggKyBoZWlnaHQgKiBoZWlnaHQpXG4gIG91dHB1dC5jZW50ZXIuc2V0KG1pblggKyB3aWR0aCAvIDIsIG1pblkgKyBoZWlnaHQgLyAyLCAwKVxuICBvdXRwdXQucmFkaXVzID0gbGVuZ3RoIC8gMlxufVxuIiwibW9kdWxlLmV4cG9ydHMucGFnZXMgPSBmdW5jdGlvbiBwYWdlcyAoZ2x5cGhzKSB7XG4gIHZhciBwYWdlcyA9IG5ldyBGbG9hdDMyQXJyYXkoZ2x5cGhzLmxlbmd0aCAqIDQgKiAxKVxuICB2YXIgaSA9IDBcbiAgZ2x5cGhzLmZvckVhY2goZnVuY3Rpb24gKGdseXBoKSB7XG4gICAgdmFyIGlkID0gZ2x5cGguZGF0YS5wYWdlIHx8IDBcbiAgICBwYWdlc1tpKytdID0gaWRcbiAgICBwYWdlc1tpKytdID0gaWRcbiAgICBwYWdlc1tpKytdID0gaWRcbiAgICBwYWdlc1tpKytdID0gaWRcbiAgfSlcbiAgcmV0dXJuIHBhZ2VzXG59XG5cbm1vZHVsZS5leHBvcnRzLnV2cyA9IGZ1bmN0aW9uIHV2cyAoZ2x5cGhzLCB0ZXhXaWR0aCwgdGV4SGVpZ2h0LCBmbGlwWSkge1xuICB2YXIgdXZzID0gbmV3IEZsb2F0MzJBcnJheShnbHlwaHMubGVuZ3RoICogNCAqIDIpXG4gIHZhciBpID0gMFxuICBnbHlwaHMuZm9yRWFjaChmdW5jdGlvbiAoZ2x5cGgpIHtcbiAgICB2YXIgYml0bWFwID0gZ2x5cGguZGF0YVxuICAgIHZhciBidyA9IChiaXRtYXAueCArIGJpdG1hcC53aWR0aClcbiAgICB2YXIgYmggPSAoYml0bWFwLnkgKyBiaXRtYXAuaGVpZ2h0KVxuXG4gICAgLy8gdG9wIGxlZnQgcG9zaXRpb25cbiAgICB2YXIgdTAgPSBiaXRtYXAueCAvIHRleFdpZHRoXG4gICAgdmFyIHYxID0gYml0bWFwLnkgLyB0ZXhIZWlnaHRcbiAgICB2YXIgdTEgPSBidyAvIHRleFdpZHRoXG4gICAgdmFyIHYwID0gYmggLyB0ZXhIZWlnaHRcblxuICAgIGlmIChmbGlwWSkge1xuICAgICAgdjEgPSAodGV4SGVpZ2h0IC0gYml0bWFwLnkpIC8gdGV4SGVpZ2h0XG4gICAgICB2MCA9ICh0ZXhIZWlnaHQgLSBiaCkgLyB0ZXhIZWlnaHRcbiAgICB9XG5cbiAgICAvLyBCTFxuICAgIHV2c1tpKytdID0gdTBcbiAgICB1dnNbaSsrXSA9IHYxXG4gICAgLy8gVExcbiAgICB1dnNbaSsrXSA9IHUwXG4gICAgdXZzW2krK10gPSB2MFxuICAgIC8vIFRSXG4gICAgdXZzW2krK10gPSB1MVxuICAgIHV2c1tpKytdID0gdjBcbiAgICAvLyBCUlxuICAgIHV2c1tpKytdID0gdTFcbiAgICB1dnNbaSsrXSA9IHYxXG4gIH0pXG4gIHJldHVybiB1dnNcbn1cblxubW9kdWxlLmV4cG9ydHMucG9zaXRpb25zID0gZnVuY3Rpb24gcG9zaXRpb25zIChnbHlwaHMpIHtcbiAgdmFyIHBvc2l0aW9ucyA9IG5ldyBGbG9hdDMyQXJyYXkoZ2x5cGhzLmxlbmd0aCAqIDQgKiAyKVxuICB2YXIgaSA9IDBcbiAgZ2x5cGhzLmZvckVhY2goZnVuY3Rpb24gKGdseXBoKSB7XG4gICAgdmFyIGJpdG1hcCA9IGdseXBoLmRhdGFcblxuICAgIC8vIGJvdHRvbSBsZWZ0IHBvc2l0aW9uXG4gICAgdmFyIHggPSBnbHlwaC5wb3NpdGlvblswXSArIGJpdG1hcC54b2Zmc2V0XG4gICAgdmFyIHkgPSBnbHlwaC5wb3NpdGlvblsxXSArIGJpdG1hcC55b2Zmc2V0XG5cbiAgICAvLyBxdWFkIHNpemVcbiAgICB2YXIgdyA9IGJpdG1hcC53aWR0aFxuICAgIHZhciBoID0gYml0bWFwLmhlaWdodFxuXG4gICAgLy8gQkxcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHhcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHlcbiAgICAvLyBUTFxuICAgIHBvc2l0aW9uc1tpKytdID0geFxuICAgIHBvc2l0aW9uc1tpKytdID0geSArIGhcbiAgICAvLyBUUlxuICAgIHBvc2l0aW9uc1tpKytdID0geCArIHdcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHkgKyBoXG4gICAgLy8gQlJcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHggKyB3XG4gICAgcG9zaXRpb25zW2krK10gPSB5XG4gIH0pXG4gIHJldHVybiBwb3NpdGlvbnNcbn1cbiIsInZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJylcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVTREZTaGFkZXIgKG9wdCkge1xuICBvcHQgPSBvcHQgfHwge31cbiAgdmFyIG9wYWNpdHkgPSB0eXBlb2Ygb3B0Lm9wYWNpdHkgPT09ICdudW1iZXInID8gb3B0Lm9wYWNpdHkgOiAxXG4gIHZhciBhbHBoYVRlc3QgPSB0eXBlb2Ygb3B0LmFscGhhVGVzdCA9PT0gJ251bWJlcicgPyBvcHQuYWxwaGFUZXN0IDogMC4wMDAxXG4gIHZhciBwcmVjaXNpb24gPSBvcHQucHJlY2lzaW9uIHx8ICdoaWdocCdcbiAgdmFyIGNvbG9yID0gb3B0LmNvbG9yXG4gIHZhciBtYXAgPSBvcHQubWFwXG5cbiAgLy8gcmVtb3ZlIHRvIHNhdGlzZnkgcjczXG4gIGRlbGV0ZSBvcHQubWFwXG4gIGRlbGV0ZSBvcHQuY29sb3JcbiAgZGVsZXRlIG9wdC5wcmVjaXNpb25cbiAgZGVsZXRlIG9wdC5vcGFjaXR5XG5cbiAgcmV0dXJuIGFzc2lnbih7XG4gICAgdW5pZm9ybXM6IHtcbiAgICAgIG9wYWNpdHk6IHsgdHlwZTogJ2YnLCB2YWx1ZTogb3BhY2l0eSB9LFxuICAgICAgbWFwOiB7IHR5cGU6ICd0JywgdmFsdWU6IG1hcCB8fCBuZXcgVEhSRUUuVGV4dHVyZSgpIH0sXG4gICAgICBjb2xvcjogeyB0eXBlOiAnYycsIHZhbHVlOiBuZXcgVEhSRUUuQ29sb3IoY29sb3IpIH1cbiAgICB9LFxuICAgIHZlcnRleFNoYWRlcjogW1xuICAgICAgJ2F0dHJpYnV0ZSB2ZWMyIHV2OycsXG4gICAgICAnYXR0cmlidXRlIHZlYzQgcG9zaXRpb247JyxcbiAgICAgICd1bmlmb3JtIG1hdDQgcHJvamVjdGlvbk1hdHJpeDsnLFxuICAgICAgJ3VuaWZvcm0gbWF0NCBtb2RlbFZpZXdNYXRyaXg7JyxcbiAgICAgICd2YXJ5aW5nIHZlYzIgdlV2OycsXG4gICAgICAndm9pZCBtYWluKCkgeycsXG4gICAgICAndlV2ID0gdXY7JyxcbiAgICAgICdnbF9Qb3NpdGlvbiA9IHByb2plY3Rpb25NYXRyaXggKiBtb2RlbFZpZXdNYXRyaXggKiBwb3NpdGlvbjsnLFxuICAgICAgJ30nXG4gICAgXS5qb2luKCdcXG4nKSxcbiAgICBmcmFnbWVudFNoYWRlcjogW1xuICAgICAgJyNpZmRlZiBHTF9PRVNfc3RhbmRhcmRfZGVyaXZhdGl2ZXMnLFxuICAgICAgJyNleHRlbnNpb24gR0xfT0VTX3N0YW5kYXJkX2Rlcml2YXRpdmVzIDogZW5hYmxlJyxcbiAgICAgICcjZW5kaWYnLFxuICAgICAgJ3ByZWNpc2lvbiAnICsgcHJlY2lzaW9uICsgJyBmbG9hdDsnLFxuICAgICAgJ3VuaWZvcm0gZmxvYXQgb3BhY2l0eTsnLFxuICAgICAgJ3VuaWZvcm0gdmVjMyBjb2xvcjsnLFxuICAgICAgJ3VuaWZvcm0gc2FtcGxlcjJEIG1hcDsnLFxuICAgICAgJ3ZhcnlpbmcgdmVjMiB2VXY7JyxcblxuICAgICAgJ2Zsb2F0IGFhc3RlcChmbG9hdCB2YWx1ZSkgeycsXG4gICAgICAnICAjaWZkZWYgR0xfT0VTX3N0YW5kYXJkX2Rlcml2YXRpdmVzJyxcbiAgICAgICcgICAgZmxvYXQgYWZ3aWR0aCA9IGxlbmd0aCh2ZWMyKGRGZHgodmFsdWUpLCBkRmR5KHZhbHVlKSkpICogMC43MDcxMDY3ODExODY1NDc1NzsnLFxuICAgICAgJyAgI2Vsc2UnLFxuICAgICAgJyAgICBmbG9hdCBhZndpZHRoID0gKDEuMCAvIDMyLjApICogKDEuNDE0MjEzNTYyMzczMDk1MSAvICgyLjAgKiBnbF9GcmFnQ29vcmQudykpOycsXG4gICAgICAnICAjZW5kaWYnLFxuICAgICAgJyAgcmV0dXJuIHNtb290aHN0ZXAoMC41IC0gYWZ3aWR0aCwgMC41ICsgYWZ3aWR0aCwgdmFsdWUpOycsXG4gICAgICAnfScsXG5cbiAgICAgICd2b2lkIG1haW4oKSB7JyxcbiAgICAgICcgIHZlYzQgdGV4Q29sb3IgPSB0ZXh0dXJlMkQobWFwLCB2VXYpOycsXG4gICAgICAnICBmbG9hdCBhbHBoYSA9IGFhc3RlcCh0ZXhDb2xvci5hKTsnLFxuICAgICAgJyAgZ2xfRnJhZ0NvbG9yID0gdmVjNChjb2xvciwgb3BhY2l0eSAqIGFscGhhKTsnLFxuICAgICAgYWxwaGFUZXN0ID09PSAwXG4gICAgICAgID8gJydcbiAgICAgICAgOiAnICBpZiAoZ2xfRnJhZ0NvbG9yLmEgPCAnICsgYWxwaGFUZXN0ICsgJykgZGlzY2FyZDsnLFxuICAgICAgJ30nXG4gICAgXS5qb2luKCdcXG4nKVxuICB9LCBvcHQpXG59XG4iLCJ2YXIgZmxhdHRlbiA9IHJlcXVpcmUoJ2ZsYXR0ZW4tdmVydGV4LWRhdGEnKVxudmFyIHdhcm5lZCA9IGZhbHNlO1xuXG5tb2R1bGUuZXhwb3J0cy5hdHRyID0gc2V0QXR0cmlidXRlXG5tb2R1bGUuZXhwb3J0cy5pbmRleCA9IHNldEluZGV4XG5cbmZ1bmN0aW9uIHNldEluZGV4IChnZW9tZXRyeSwgZGF0YSwgaXRlbVNpemUsIGR0eXBlKSB7XG4gIGlmICh0eXBlb2YgaXRlbVNpemUgIT09ICdudW1iZXInKSBpdGVtU2l6ZSA9IDFcbiAgaWYgKHR5cGVvZiBkdHlwZSAhPT0gJ3N0cmluZycpIGR0eXBlID0gJ3VpbnQxNidcblxuICB2YXIgaXNSNjkgPSAhZ2VvbWV0cnkuaW5kZXggJiYgdHlwZW9mIGdlb21ldHJ5LnNldEluZGV4ICE9PSAnZnVuY3Rpb24nXG4gIHZhciBhdHRyaWIgPSBpc1I2OSA/IGdlb21ldHJ5LmdldEF0dHJpYnV0ZSgnaW5kZXgnKSA6IGdlb21ldHJ5LmluZGV4XG4gIHZhciBuZXdBdHRyaWIgPSB1cGRhdGVBdHRyaWJ1dGUoYXR0cmliLCBkYXRhLCBpdGVtU2l6ZSwgZHR5cGUpXG4gIGlmIChuZXdBdHRyaWIpIHtcbiAgICBpZiAoaXNSNjkpIGdlb21ldHJ5LmFkZEF0dHJpYnV0ZSgnaW5kZXgnLCBuZXdBdHRyaWIpXG4gICAgZWxzZSBnZW9tZXRyeS5pbmRleCA9IG5ld0F0dHJpYlxuICB9XG59XG5cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZSAoZ2VvbWV0cnksIGtleSwgZGF0YSwgaXRlbVNpemUsIGR0eXBlKSB7XG4gIGlmICh0eXBlb2YgaXRlbVNpemUgIT09ICdudW1iZXInKSBpdGVtU2l6ZSA9IDNcbiAgaWYgKHR5cGVvZiBkdHlwZSAhPT0gJ3N0cmluZycpIGR0eXBlID0gJ2Zsb2F0MzInXG4gIGlmIChBcnJheS5pc0FycmF5KGRhdGEpICYmXG4gICAgQXJyYXkuaXNBcnJheShkYXRhWzBdKSAmJlxuICAgIGRhdGFbMF0ubGVuZ3RoICE9PSBpdGVtU2l6ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignTmVzdGVkIHZlcnRleCBhcnJheSBoYXMgdW5leHBlY3RlZCBzaXplOyBleHBlY3RlZCAnICtcbiAgICAgIGl0ZW1TaXplICsgJyBidXQgZm91bmQgJyArIGRhdGFbMF0ubGVuZ3RoKVxuICB9XG5cbiAgdmFyIGF0dHJpYiA9IGdlb21ldHJ5LmdldEF0dHJpYnV0ZShrZXkpXG4gIHZhciBuZXdBdHRyaWIgPSB1cGRhdGVBdHRyaWJ1dGUoYXR0cmliLCBkYXRhLCBpdGVtU2l6ZSwgZHR5cGUpXG4gIGlmIChuZXdBdHRyaWIpIHtcbiAgICBnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoa2V5LCBuZXdBdHRyaWIpXG4gIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlQXR0cmlidXRlIChhdHRyaWIsIGRhdGEsIGl0ZW1TaXplLCBkdHlwZSkge1xuICBkYXRhID0gZGF0YSB8fCBbXVxuICBpZiAoIWF0dHJpYiB8fCByZWJ1aWxkQXR0cmlidXRlKGF0dHJpYiwgZGF0YSwgaXRlbVNpemUpKSB7XG4gICAgLy8gY3JlYXRlIGEgbmV3IGFycmF5IHdpdGggZGVzaXJlZCB0eXBlXG4gICAgZGF0YSA9IGZsYXR0ZW4oZGF0YSwgZHR5cGUpXG5cbiAgICB2YXIgbmVlZHNOZXdCdWZmZXIgPSBhdHRyaWIgJiYgdHlwZW9mIGF0dHJpYi5zZXRBcnJheSAhPT0gJ2Z1bmN0aW9uJ1xuICAgIGlmICghYXR0cmliIHx8IG5lZWRzTmV3QnVmZmVyKSB7XG4gICAgICAvLyBXZSBhcmUgb24gYW4gb2xkIHZlcnNpb24gb2YgVGhyZWVKUyB3aGljaCBjYW4ndFxuICAgICAgLy8gc3VwcG9ydCBncm93aW5nIC8gc2hyaW5raW5nIGJ1ZmZlcnMsIHNvIHdlIG5lZWRcbiAgICAgIC8vIHRvIGJ1aWxkIGEgbmV3IGJ1ZmZlclxuICAgICAgaWYgKG5lZWRzTmV3QnVmZmVyICYmICF3YXJuZWQpIHtcbiAgICAgICAgd2FybmVkID0gdHJ1ZVxuICAgICAgICBjb25zb2xlLndhcm4oW1xuICAgICAgICAgICdBIFdlYkdMIGJ1ZmZlciBpcyBiZWluZyB1cGRhdGVkIHdpdGggYSBuZXcgc2l6ZSBvciBpdGVtU2l6ZSwgJyxcbiAgICAgICAgICAnaG93ZXZlciB0aGlzIHZlcnNpb24gb2YgVGhyZWVKUyBvbmx5IHN1cHBvcnRzIGZpeGVkLXNpemUgYnVmZmVycy4nLFxuICAgICAgICAgICdcXG5UaGUgb2xkIGJ1ZmZlciBtYXkgc3RpbGwgYmUga2VwdCBpbiBtZW1vcnkuXFxuJyxcbiAgICAgICAgICAnVG8gYXZvaWQgbWVtb3J5IGxlYWtzLCBpdCBpcyByZWNvbW1lbmRlZCB0aGF0IHlvdSBkaXNwb3NlICcsXG4gICAgICAgICAgJ3lvdXIgZ2VvbWV0cmllcyBhbmQgY3JlYXRlIG5ldyBvbmVzLCBvciB1cGRhdGUgdG8gVGhyZWVKUyByODIgb3IgbmV3ZXIuXFxuJyxcbiAgICAgICAgICAnU2VlIGhlcmUgZm9yIGRpc2N1c3Npb246XFxuJyxcbiAgICAgICAgICAnaHR0cHM6Ly9naXRodWIuY29tL21yZG9vYi90aHJlZS5qcy9wdWxsLzk2MzEnXG4gICAgICAgIF0uam9pbignJykpXG4gICAgICB9XG5cbiAgICAgIC8vIEJ1aWxkIGEgbmV3IGF0dHJpYnV0ZVxuICAgICAgYXR0cmliID0gbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZShkYXRhLCBpdGVtU2l6ZSk7XG4gICAgfVxuXG4gICAgYXR0cmliLml0ZW1TaXplID0gaXRlbVNpemVcbiAgICBhdHRyaWIubmVlZHNVcGRhdGUgPSB0cnVlXG5cbiAgICAvLyBOZXcgdmVyc2lvbnMgb2YgVGhyZWVKUyBzdWdnZXN0IHVzaW5nIHNldEFycmF5XG4gICAgLy8gdG8gY2hhbmdlIHRoZSBkYXRhLiBJdCB3aWxsIHVzZSBidWZmZXJEYXRhIGludGVybmFsbHksXG4gICAgLy8gc28geW91IGNhbiBjaGFuZ2UgdGhlIGFycmF5IHNpemUgd2l0aG91dCBhbnkgaXNzdWVzXG4gICAgaWYgKHR5cGVvZiBhdHRyaWIuc2V0QXJyYXkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGF0dHJpYi5zZXRBcnJheShkYXRhKVxuICAgIH1cblxuICAgIHJldHVybiBhdHRyaWJcbiAgfSBlbHNlIHtcbiAgICAvLyBjb3B5IGRhdGEgaW50byB0aGUgZXhpc3RpbmcgYXJyYXlcbiAgICBmbGF0dGVuKGRhdGEsIGF0dHJpYi5hcnJheSlcbiAgICBhdHRyaWIubmVlZHNVcGRhdGUgPSB0cnVlXG4gICAgcmV0dXJuIG51bGxcbiAgfVxufVxuXG4vLyBUZXN0IHdoZXRoZXIgdGhlIGF0dHJpYnV0ZSBuZWVkcyB0byBiZSByZS1jcmVhdGVkLFxuLy8gcmV0dXJucyBmYWxzZSBpZiB3ZSBjYW4gcmUtdXNlIGl0IGFzLWlzLlxuZnVuY3Rpb24gcmVidWlsZEF0dHJpYnV0ZSAoYXR0cmliLCBkYXRhLCBpdGVtU2l6ZSkge1xuICBpZiAoYXR0cmliLml0ZW1TaXplICE9PSBpdGVtU2l6ZSkgcmV0dXJuIHRydWVcbiAgaWYgKCFhdHRyaWIuYXJyYXkpIHJldHVybiB0cnVlXG4gIHZhciBhdHRyaWJMZW5ndGggPSBhdHRyaWIuYXJyYXkubGVuZ3RoXG4gIGlmIChBcnJheS5pc0FycmF5KGRhdGEpICYmIEFycmF5LmlzQXJyYXkoZGF0YVswXSkpIHtcbiAgICAvLyBbIFsgeCwgeSwgeiBdIF1cbiAgICByZXR1cm4gYXR0cmliTGVuZ3RoICE9PSBkYXRhLmxlbmd0aCAqIGl0ZW1TaXplXG4gIH0gZWxzZSB7XG4gICAgLy8gWyB4LCB5LCB6IF1cbiAgICByZXR1cm4gYXR0cmliTGVuZ3RoICE9PSBkYXRhLmxlbmd0aFxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuIiwidmFyIG5ld2xpbmUgPSAvXFxuL1xudmFyIG5ld2xpbmVDaGFyID0gJ1xcbidcbnZhciB3aGl0ZXNwYWNlID0gL1xccy9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0ZXh0LCBvcHQpIHtcbiAgICB2YXIgbGluZXMgPSBtb2R1bGUuZXhwb3J0cy5saW5lcyh0ZXh0LCBvcHQpXG4gICAgcmV0dXJuIGxpbmVzLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgIHJldHVybiB0ZXh0LnN1YnN0cmluZyhsaW5lLnN0YXJ0LCBsaW5lLmVuZClcbiAgICB9KS5qb2luKCdcXG4nKVxufVxuXG5tb2R1bGUuZXhwb3J0cy5saW5lcyA9IGZ1bmN0aW9uIHdvcmR3cmFwKHRleHQsIG9wdCkge1xuICAgIG9wdCA9IG9wdHx8e31cblxuICAgIC8vemVybyB3aWR0aCByZXN1bHRzIGluIG5vdGhpbmcgdmlzaWJsZVxuICAgIGlmIChvcHQud2lkdGggPT09IDAgJiYgb3B0Lm1vZGUgIT09ICdub3dyYXAnKSBcbiAgICAgICAgcmV0dXJuIFtdXG5cbiAgICB0ZXh0ID0gdGV4dHx8JydcbiAgICB2YXIgd2lkdGggPSB0eXBlb2Ygb3B0LndpZHRoID09PSAnbnVtYmVyJyA/IG9wdC53aWR0aCA6IE51bWJlci5NQVhfVkFMVUVcbiAgICB2YXIgc3RhcnQgPSBNYXRoLm1heCgwLCBvcHQuc3RhcnR8fDApXG4gICAgdmFyIGVuZCA9IHR5cGVvZiBvcHQuZW5kID09PSAnbnVtYmVyJyA/IG9wdC5lbmQgOiB0ZXh0Lmxlbmd0aFxuICAgIHZhciBtb2RlID0gb3B0Lm1vZGVcblxuICAgIHZhciBtZWFzdXJlID0gb3B0Lm1lYXN1cmUgfHwgbW9ub3NwYWNlXG4gICAgaWYgKG1vZGUgPT09ICdwcmUnKVxuICAgICAgICByZXR1cm4gcHJlKG1lYXN1cmUsIHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoKVxuICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIGdyZWVkeShtZWFzdXJlLCB0ZXh0LCBzdGFydCwgZW5kLCB3aWR0aCwgbW9kZSlcbn1cblxuZnVuY3Rpb24gaWR4T2YodGV4dCwgY2hyLCBzdGFydCwgZW5kKSB7XG4gICAgdmFyIGlkeCA9IHRleHQuaW5kZXhPZihjaHIsIHN0YXJ0KVxuICAgIGlmIChpZHggPT09IC0xIHx8IGlkeCA+IGVuZClcbiAgICAgICAgcmV0dXJuIGVuZFxuICAgIHJldHVybiBpZHhcbn1cblxuZnVuY3Rpb24gaXNXaGl0ZXNwYWNlKGNocikge1xuICAgIHJldHVybiB3aGl0ZXNwYWNlLnRlc3QoY2hyKVxufVxuXG5mdW5jdGlvbiBwcmUobWVhc3VyZSwgdGV4dCwgc3RhcnQsIGVuZCwgd2lkdGgpIHtcbiAgICB2YXIgbGluZXMgPSBbXVxuICAgIHZhciBsaW5lU3RhcnQgPSBzdGFydFxuICAgIGZvciAodmFyIGk9c3RhcnQ7IGk8ZW5kICYmIGk8dGV4dC5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2hyID0gdGV4dC5jaGFyQXQoaSlcbiAgICAgICAgdmFyIGlzTmV3bGluZSA9IG5ld2xpbmUudGVzdChjaHIpXG5cbiAgICAgICAgLy9JZiB3ZSd2ZSByZWFjaGVkIGEgbmV3bGluZSwgdGhlbiBzdGVwIGRvd24gYSBsaW5lXG4gICAgICAgIC8vT3IgaWYgd2UndmUgcmVhY2hlZCB0aGUgRU9GXG4gICAgICAgIGlmIChpc05ld2xpbmUgfHwgaT09PWVuZC0xKSB7XG4gICAgICAgICAgICB2YXIgbGluZUVuZCA9IGlzTmV3bGluZSA/IGkgOiBpKzFcbiAgICAgICAgICAgIHZhciBtZWFzdXJlZCA9IG1lYXN1cmUodGV4dCwgbGluZVN0YXJ0LCBsaW5lRW5kLCB3aWR0aClcbiAgICAgICAgICAgIGxpbmVzLnB1c2gobWVhc3VyZWQpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGxpbmVTdGFydCA9IGkrMVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBsaW5lc1xufVxuXG5mdW5jdGlvbiBncmVlZHkobWVhc3VyZSwgdGV4dCwgc3RhcnQsIGVuZCwgd2lkdGgsIG1vZGUpIHtcbiAgICAvL0EgZ3JlZWR5IHdvcmQgd3JhcHBlciBiYXNlZCBvbiBMaWJHRFggYWxnb3JpdGhtXG4gICAgLy9odHRwczovL2dpdGh1Yi5jb20vbGliZ2R4L2xpYmdkeC9ibG9iL21hc3Rlci9nZHgvc3JjL2NvbS9iYWRsb2dpYy9nZHgvZ3JhcGhpY3MvZzJkL0JpdG1hcEZvbnRDYWNoZS5qYXZhXG4gICAgdmFyIGxpbmVzID0gW11cblxuICAgIHZhciB0ZXN0V2lkdGggPSB3aWR0aFxuICAgIC8vaWYgJ25vd3JhcCcgaXMgc3BlY2lmaWVkLCB3ZSBvbmx5IHdyYXAgb24gbmV3bGluZSBjaGFyc1xuICAgIGlmIChtb2RlID09PSAnbm93cmFwJylcbiAgICAgICAgdGVzdFdpZHRoID0gTnVtYmVyLk1BWF9WQUxVRVxuXG4gICAgd2hpbGUgKHN0YXJ0IDwgZW5kICYmIHN0YXJ0IDwgdGV4dC5sZW5ndGgpIHtcbiAgICAgICAgLy9nZXQgbmV4dCBuZXdsaW5lIHBvc2l0aW9uXG4gICAgICAgIHZhciBuZXdMaW5lID0gaWR4T2YodGV4dCwgbmV3bGluZUNoYXIsIHN0YXJ0LCBlbmQpXG5cbiAgICAgICAgLy9lYXQgd2hpdGVzcGFjZSBhdCBzdGFydCBvZiBsaW5lXG4gICAgICAgIHdoaWxlIChzdGFydCA8IG5ld0xpbmUpIHtcbiAgICAgICAgICAgIGlmICghaXNXaGl0ZXNwYWNlKCB0ZXh0LmNoYXJBdChzdGFydCkgKSlcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgc3RhcnQrK1xuICAgICAgICB9XG5cbiAgICAgICAgLy9kZXRlcm1pbmUgdmlzaWJsZSAjIG9mIGdseXBocyBmb3IgdGhlIGF2YWlsYWJsZSB3aWR0aFxuICAgICAgICB2YXIgbWVhc3VyZWQgPSBtZWFzdXJlKHRleHQsIHN0YXJ0LCBuZXdMaW5lLCB0ZXN0V2lkdGgpXG5cbiAgICAgICAgdmFyIGxpbmVFbmQgPSBzdGFydCArIChtZWFzdXJlZC5lbmQtbWVhc3VyZWQuc3RhcnQpXG4gICAgICAgIHZhciBuZXh0U3RhcnQgPSBsaW5lRW5kICsgbmV3bGluZUNoYXIubGVuZ3RoXG5cbiAgICAgICAgLy9pZiB3ZSBoYWQgdG8gY3V0IHRoZSBsaW5lIGJlZm9yZSB0aGUgbmV4dCBuZXdsaW5lLi4uXG4gICAgICAgIGlmIChsaW5lRW5kIDwgbmV3TGluZSkge1xuICAgICAgICAgICAgLy9maW5kIGNoYXIgdG8gYnJlYWsgb25cbiAgICAgICAgICAgIHdoaWxlIChsaW5lRW5kID4gc3RhcnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNXaGl0ZXNwYWNlKHRleHQuY2hhckF0KGxpbmVFbmQpKSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBsaW5lRW5kLS1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsaW5lRW5kID09PSBzdGFydCkge1xuICAgICAgICAgICAgICAgIGlmIChuZXh0U3RhcnQgPiBzdGFydCArIG5ld2xpbmVDaGFyLmxlbmd0aCkgbmV4dFN0YXJ0LS1cbiAgICAgICAgICAgICAgICBsaW5lRW5kID0gbmV4dFN0YXJ0IC8vIElmIG5vIGNoYXJhY3RlcnMgdG8gYnJlYWssIHNob3cgYWxsLlxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXh0U3RhcnQgPSBsaW5lRW5kXG4gICAgICAgICAgICAgICAgLy9lYXQgd2hpdGVzcGFjZSBhdCBlbmQgb2YgbGluZVxuICAgICAgICAgICAgICAgIHdoaWxlIChsaW5lRW5kID4gc3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1doaXRlc3BhY2UodGV4dC5jaGFyQXQobGluZUVuZCAtIG5ld2xpbmVDaGFyLmxlbmd0aCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgbGluZUVuZC0tXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChsaW5lRW5kID49IHN0YXJ0KSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbWVhc3VyZSh0ZXh0LCBzdGFydCwgbGluZUVuZCwgdGVzdFdpZHRoKVxuICAgICAgICAgICAgbGluZXMucHVzaChyZXN1bHQpXG4gICAgICAgIH1cbiAgICAgICAgc3RhcnQgPSBuZXh0U3RhcnRcbiAgICB9XG4gICAgcmV0dXJuIGxpbmVzXG59XG5cbi8vZGV0ZXJtaW5lcyB0aGUgdmlzaWJsZSBudW1iZXIgb2YgZ2x5cGhzIHdpdGhpbiBhIGdpdmVuIHdpZHRoXG5mdW5jdGlvbiBtb25vc3BhY2UodGV4dCwgc3RhcnQsIGVuZCwgd2lkdGgpIHtcbiAgICB2YXIgZ2x5cGhzID0gTWF0aC5taW4od2lkdGgsIGVuZC1zdGFydClcbiAgICByZXR1cm4ge1xuICAgICAgICBzdGFydDogc3RhcnQsXG4gICAgICAgIGVuZDogc3RhcnQrZ2x5cGhzXG4gICAgfVxufSIsIm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kXG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbmZ1bmN0aW9uIGV4dGVuZCgpIHtcbiAgICB2YXIgdGFyZ2V0ID0ge31cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV1cblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0XG59XG4iXX0=
