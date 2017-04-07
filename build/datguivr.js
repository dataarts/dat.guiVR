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
    label.position.y = -DROPDOWN_MARGIN - (index + 1) * DROPDOWN_OPTION_HEIGHT;
    label.position.z = depth;
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

function createFolder() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      textCreator = _ref.textCreator,
      name = _ref.name,
      guiAdd = _ref.guiAdd,
      guiRemove = _ref.guiRemove,
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

  //useful to have access to this as well. Using in remove implementation
  Object.defineProperty(group, 'guiChildren', {
    get: function get() {
      return collapseGroup.children;
    }
  });
  // returns true if all of the supplied args are members of this folder
  group.hasChild = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return !args.includes(function (obj) {
      return group.guiChildren.indexOf(obj) === -1;
    });
  };

  //  Yeah. Gross.
  var addOriginal = THREE.Group.prototype.add;
  //as long as no-one expects this to behave like a regular THREE.Group, the changed definition of remove shouldn't hurt
  //const removeOriginal = THREE.Group.prototype.remove; 

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

  /* 
  Removes the given controllers from the GUI.
    If the arguments are invalid, it will attempt to detect this before making any changes, 
  aborting the process and returning false from this method.
    Note: as with add, this overwrites an existing property of THREE.Group.
  As long as no-one expects folders to behave like regular THREE.Groups, that shouldn't matter.
  */
  group.remove = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var ok = guiRemove.apply(undefined, args); // any invalid arguments should cause this to return false
    if (!ok) return false;
    args.forEach(function (obj) {
      console.assert(group.hasChild(obj), "internal problem with housekeeping logic of dat.GUIVR folder not caught by sanity check");
      if (obj.isFolder) {
        obj.remove.apply(obj, _toConsumableArray(obj.guiChildren));
      }
      collapseGroup.remove(obj);
    });
    //TODO: defer actual layout performance; set a flag and make sure it gets done before any rendering or hit-testing happens.
    performLayout();
    return true;
  };

  group.addController = function () {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
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
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
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
          folder.position.copy(input.mouseIntersection.sub(input.mouseOffset));
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
  */
  var inputObjects = [];
  var controllers = [];

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

    return slider;
  }

  function addCheckbox(object, propertyName) {
    var checkbox = (0, _checkbox2.default)({
      textCreator: textCreator, propertyName: propertyName, object: object,
      initialValue: object[propertyName]
    });

    controllers.push(checkbox);

    return checkbox;
  }

  function addButton(object, propertyName) {
    var button = (0, _button2.default)({
      textCreator: textCreator, propertyName: propertyName, object: object
    });

    controllers.push(button);
    return button;
  }

  function addDropdown(object, propertyName, options) {
    var dropdown = (0, _dropdown2.default)({
      textCreator: textCreator, propertyName: propertyName, object: object, options: options
    });

    controllers.push(dropdown);
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
  Not used directly; used by folders.
  Remove controllers from the global list of all controllers known to dat.GUIVR.
  Calls removeTest first to check input arguments.  returns false if this test fails.
  returns true if successful.
    Note that this function does not recursively remove elements from folders; that is dealt with in the folder code which calls this.
  
   */
  function remove() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var argSet = [].concat(_toConsumableArray(new Set(args))); //just in case there were repeated elements in args, turn into Set then back to array.
    if (!removeTest.apply(undefined, _toConsumableArray(argSet))) return false;
    argSet.forEach(function (obj) {
      var i = controllers.indexOf(obj);
      if (i > -1) controllers.splice(i, 1);else {
        // I can't see how this'd happen now we guard against repeated elements.
        console.log("Internal error in remove, not anticipated by removeTest. Internal dat.GUIVR state may be inconsistent.");
        return false;
      }
    });
    return true;
  }

  /*
  Verify that all of the items in provided arguments are existing controllers that should be ok to remove.
    Returns false if there are any mismatches, true if believed ok to continue with actual remove()
    If any of the provided args are folders (have isFolder property) this is called recursively.
  This will result in redundant work as each folder will also call it again as it's removed, but this is cheap
  and it means that any error should be caught as early as possible and the whole process aborted.
  */
  function removeTest() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    for (var i = 0; i < args.length; i++) {
      var obj = args[i];
      if (controllers.indexOf(obj) === -1 || !obj.folder.hasChild(obj)) {
        //TODO: toString implementations for controllers
        console.log("Can't remove controller " + obj); //not sure the preferred way of reporting problem to user.
        return false;
      }
      if (obj.isFolder) {
        if (!removeTest.apply(undefined, _toConsumableArray(obj.guiChildren))) return false;
      }
    }
    return true;
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
      guiRemove: remove,
      addSlider: addSimpleSlider,
      addDropdown: addSimpleDropdown,
      addCheckbox: addSimpleCheckbox,
      addButton: addSimpleButton
    });

    controllers.push(folder);

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

      var _extractHit = extractHit(input),
          hitObject = _extractHit.hitObject,
          hitPoint = _extractHit.hitPoint;

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

},{"flatten-vertex-data":22}],35:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcYnV0dG9uLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGNoZWNrYm94LmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGNvbG9ycy5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxkcm9wZG93bi5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxmb2xkZXIuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcZm9udC5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxncmFiLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGdyYXBoaWMuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcaW5kZXguanMiLCJtb2R1bGVzXFxkYXRndWl2clxcaW50ZXJhY3Rpb24uanMiLCJtb2R1bGVzXFxkYXRndWl2clxcbGF5b3V0LmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXHBhbGV0dGUuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcc2RmdGV4dC5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxzaGFyZWRtYXRlcmlhbHMuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcc2xpZGVyLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXHRleHRsYWJlbC5qcyIsIm1vZHVsZXNcXHRoaXJkcGFydHlcXFN1YmRpdmlzaW9uTW9kaWZpZXIuanMiLCJub2RlX21vZHVsZXMvYW4tYXJyYXkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYXMtbnVtYmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2R0eXBlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvZmxhdHRlbi12ZXJ0ZXgtZGF0YS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pbmRleG9mLXByb3BlcnR5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvaXMtYnVmZmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xheW91dC1ibWZvbnQtdGV4dC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3BhcnNlLWJtZm9udC1hc2NpaS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9xdWFkLWluZGljZXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvbGliL3V0aWxzLmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L2xpYi92ZXJ0aWNlcy5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1ibWZvbnQtdGV4dC9zaGFkZXJzL3NkZi5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1idWZmZXItdmVydGV4LWRhdGEvaW5kZXguanMiLCJub2RlX21vZHVsZXMvd29yZC13cmFwcGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3h0ZW5kL2ltbXV0YWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O2tCQzRCd0IsWTs7QUFUeEI7O0lBQVksbUI7O0FBRVo7Ozs7QUFDQTs7OztBQUNBOztJQUFZLE07O0FBQ1o7O0lBQVksTTs7QUFDWjs7SUFBWSxlOztBQUNaOztJQUFZLEk7Ozs7OztBQUVHLFNBQVMsWUFBVCxHQU9QO0FBQUEsaUZBQUosRUFBSTtBQUFBLE1BTk4sV0FNTSxRQU5OLFdBTU07QUFBQSxNQUxOLE1BS00sUUFMTixNQUtNO0FBQUEsK0JBSk4sWUFJTTtBQUFBLE1BSk4sWUFJTSxxQ0FKUyxXQUlUO0FBQUEsd0JBSE4sS0FHTTtBQUFBLE1BSE4sS0FHTSw4QkFIRSxPQUFPLFdBR1Q7QUFBQSx5QkFGTixNQUVNO0FBQUEsTUFGTixNQUVNLCtCQUZHLE9BQU8sWUFFVjtBQUFBLHdCQUROLEtBQ007QUFBQSxNQUROLEtBQ00sOEJBREUsT0FBTyxXQUNUOztBQUVOLE1BQU0s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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCAqIGFzIFN1YmRpdmlzaW9uTW9kaWZpZXIgZnJvbSAnLi4vdGhpcmRwYXJ0eS9TdWJkaXZpc2lvbk1vZGlmaWVyJztcclxuXHJcbmltcG9ydCBjcmVhdGVUZXh0TGFiZWwgZnJvbSAnLi90ZXh0bGFiZWwnO1xyXG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XHJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XHJcbmltcG9ydCAqIGFzIExheW91dCBmcm9tICcuL2xheW91dCc7XHJcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XHJcbmltcG9ydCAqIGFzIEdyYWIgZnJvbSAnLi9ncmFiJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUJ1dHRvbigge1xyXG4gIHRleHRDcmVhdG9yLFxyXG4gIG9iamVjdCxcclxuICBwcm9wZXJ0eU5hbWUgPSAndW5kZWZpbmVkJyxcclxuICB3aWR0aCA9IExheW91dC5QQU5FTF9XSURUSCxcclxuICBoZWlnaHQgPSBMYXlvdXQuUEFORUxfSEVJR0hULFxyXG4gIGRlcHRoID0gTGF5b3V0LlBBTkVMX0RFUFRIXHJcbn0gPSB7fSApe1xyXG5cclxuICBjb25zdCBCVVRUT05fV0lEVEggPSB3aWR0aCAqIDAuNSAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgQlVUVE9OX0hFSUdIVCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgQlVUVE9OX0RFUFRIID0gTGF5b3V0LkJVVFRPTl9ERVBUSDtcclxuXHJcbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcbiAgY29uc3QgcGFuZWwgPSBMYXlvdXQuY3JlYXRlUGFuZWwoIHdpZHRoLCBoZWlnaHQsIGRlcHRoICk7XHJcbiAgZ3JvdXAuYWRkKCBwYW5lbCApO1xyXG5cclxuICAvLyAgYmFzZSBjaGVja2JveFxyXG4gIGNvbnN0IGRpdmlzaW9ucyA9IDQ7XHJcbiAgY29uc3QgYXNwZWN0UmF0aW8gPSBCVVRUT05fV0lEVEggLyBCVVRUT05fSEVJR0hUO1xyXG4gIGNvbnN0IHJlY3QgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIEJVVFRPTl9XSURUSCwgQlVUVE9OX0hFSUdIVCwgQlVUVE9OX0RFUFRILCBNYXRoLmZsb29yKCBkaXZpc2lvbnMgKiBhc3BlY3RSYXRpbyApLCBkaXZpc2lvbnMsIGRpdmlzaW9ucyApO1xyXG4gIGNvbnN0IG1vZGlmaWVyID0gbmV3IFRIUkVFLlN1YmRpdmlzaW9uTW9kaWZpZXIoIDEgKTtcclxuICBtb2RpZmllci5tb2RpZnkoIHJlY3QgKTtcclxuICByZWN0LnRyYW5zbGF0ZSggQlVUVE9OX1dJRFRIICogMC41LCAwLCAwICk7XHJcblxyXG4gIC8vICBoaXRzY2FuIHZvbHVtZVxyXG4gIGNvbnN0IGhpdHNjYW5NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xyXG4gIGhpdHNjYW5NYXRlcmlhbC52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0IGhpdHNjYW5Wb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBoaXRzY2FuTWF0ZXJpYWwgKTtcclxuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnogPSBCVVRUT05fREVQVEggKiAwLjU7XHJcbiAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi54ID0gd2lkdGggKiAwLjU7XHJcblxyXG4gIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6IENvbG9ycy5CVVRUT05fQ09MT1IgfSk7XHJcbiAgY29uc3QgZmlsbGVkVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgbWF0ZXJpYWwgKTtcclxuICBoaXRzY2FuVm9sdW1lLmFkZCggZmlsbGVkVm9sdW1lICk7XHJcblxyXG5cclxuICBjb25zdCBidXR0b25MYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggcHJvcGVydHlOYW1lLCB7IHNjYWxlOiAwLjg2NiB9ICk7XHJcblxyXG4gIC8vICBUaGlzIGlzIGEgcmVhbCBoYWNrIHNpbmNlIHdlIG5lZWQgdG8gZml0IHRoZSB0ZXh0IHBvc2l0aW9uIHRvIHRoZSBmb250IHNjYWxpbmdcclxuICAvLyAgUGxlYXNlIGZpeCBtZS5cclxuICBidXR0b25MYWJlbC5wb3NpdGlvbi54ID0gQlVUVE9OX1dJRFRIICogMC41IC0gYnV0dG9uTGFiZWwubGF5b3V0LndpZHRoICogMC4wMDAwMTEgKiAwLjU7XHJcbiAgYnV0dG9uTGFiZWwucG9zaXRpb24ueiA9IEJVVFRPTl9ERVBUSCAqIDEuMjtcclxuICBidXR0b25MYWJlbC5wb3NpdGlvbi55ID0gLTAuMDI1O1xyXG4gIGZpbGxlZFZvbHVtZS5hZGQoIGJ1dHRvbkxhYmVsICk7XHJcblxyXG5cclxuICBjb25zdCBkZXNjcmlwdG9yTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHByb3BlcnR5TmFtZSApO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX0xBQkVMX1RFWFRfTUFSR0lOO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnkgPSAtMC4wMztcclxuXHJcbiAgY29uc3QgY29udHJvbGxlcklEID0gTGF5b3V0LmNyZWF0ZUNvbnRyb2xsZXJJREJveCggaGVpZ2h0LCBDb2xvcnMuQ09OVFJPTExFUl9JRF9CVVRUT04gKTtcclxuICBjb250cm9sbGVySUQucG9zaXRpb24ueiA9IGRlcHRoO1xyXG5cclxuICBwYW5lbC5hZGQoIGRlc2NyaXB0b3JMYWJlbCwgaGl0c2NhblZvbHVtZSwgY29udHJvbGxlcklEICk7XHJcblxyXG4gIGNvbnN0IGludGVyYWN0aW9uID0gY3JlYXRlSW50ZXJhY3Rpb24oIGhpdHNjYW5Wb2x1bWUgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblByZXNzZWQnLCBoYW5kbGVPblByZXNzICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25SZWxlYXNlZCcsIGhhbmRsZU9uUmVsZWFzZSApO1xyXG5cclxuICB1cGRhdGVWaWV3KCk7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZU9uUHJlc3MoIHAgKXtcclxuICAgIGlmKCBncm91cC52aXNpYmxlID09PSBmYWxzZSApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSgpO1xyXG5cclxuICAgIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueiA9IEJVVFRPTl9ERVBUSCAqIDAuMTtcclxuXHJcbiAgICBwLmxvY2tlZCA9IHRydWU7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVPblJlbGVhc2UoKXtcclxuICAgIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueiA9IEJVVFRPTl9ERVBUSCAqIDAuNTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZVZpZXcoKXtcclxuXHJcbiAgICBpZiggaW50ZXJhY3Rpb24uaG92ZXJpbmcoKSApe1xyXG4gICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5CVVRUT05fSElHSExJR0hUX0NPTE9SICk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5CVVRUT05fQ09MT1IgKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBncm91cC5pbnRlcmFjdGlvbiA9IGludGVyYWN0aW9uO1xyXG4gIGdyb3VwLmhpdHNjYW4gPSBbIGhpdHNjYW5Wb2x1bWUsIHBhbmVsIF07XHJcblxyXG4gIGNvbnN0IGdyYWJJbnRlcmFjdGlvbiA9IEdyYWIuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XHJcblxyXG4gIGdyb3VwLnVwZGF0ZUNvbnRyb2wgPSBmdW5jdGlvbiggaW5wdXRPYmplY3RzICl7XHJcbiAgICBpbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICB1cGRhdGVWaWV3KCk7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAubmFtZSA9IGZ1bmN0aW9uKCBzdHIgKXtcclxuICAgIGRlc2NyaXB0b3JMYWJlbC51cGRhdGVMYWJlbCggc3RyICk7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcblxyXG4gIHJldHVybiBncm91cDtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgY3JlYXRlVGV4dExhYmVsIGZyb20gJy4vdGV4dGxhYmVsJztcclxuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5pbXBvcnQgKiBhcyBMYXlvdXQgZnJvbSAnLi9sYXlvdXQnO1xyXG5pbXBvcnQgKiBhcyBHcmFwaGljIGZyb20gJy4vZ3JhcGhpYyc7XHJcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XHJcbmltcG9ydCAqIGFzIEdyYWIgZnJvbSAnLi9ncmFiJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUNoZWNrYm94KCB7XHJcbiAgdGV4dENyZWF0b3IsXHJcbiAgb2JqZWN0LFxyXG4gIHByb3BlcnR5TmFtZSA9ICd1bmRlZmluZWQnLFxyXG4gIGluaXRpYWxWYWx1ZSA9IGZhbHNlLFxyXG4gIHdpZHRoID0gTGF5b3V0LlBBTkVMX1dJRFRILFxyXG4gIGhlaWdodCA9IExheW91dC5QQU5FTF9IRUlHSFQsXHJcbiAgZGVwdGggPSBMYXlvdXQuUEFORUxfREVQVEhcclxufSA9IHt9ICl7XHJcblxyXG4gIGNvbnN0IENIRUNLQk9YX1dJRFRIID0gTGF5b3V0LkNIRUNLQk9YX1NJWkU7XHJcbiAgY29uc3QgQ0hFQ0tCT1hfSEVJR0hUID0gQ0hFQ0tCT1hfV0lEVEg7XHJcbiAgY29uc3QgQ0hFQ0tCT1hfREVQVEggPSBkZXB0aDtcclxuXHJcbiAgY29uc3QgSU5BQ1RJVkVfU0NBTEUgPSAwLjAwMTtcclxuICBjb25zdCBBQ1RJVkVfU0NBTEUgPSAwLjk7XHJcblxyXG4gIGNvbnN0IHN0YXRlID0ge1xyXG4gICAgdmFsdWU6IGluaXRpYWxWYWx1ZSxcclxuICAgIGxpc3RlbjogZmFsc2VcclxuICB9O1xyXG5cclxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cclxuICBjb25zdCBwYW5lbCA9IExheW91dC5jcmVhdGVQYW5lbCggd2lkdGgsIGhlaWdodCwgZGVwdGggKTtcclxuICBncm91cC5hZGQoIHBhbmVsICk7XHJcblxyXG4gIC8vICBiYXNlIGNoZWNrYm94XHJcbiAgY29uc3QgcmVjdCA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggQ0hFQ0tCT1hfV0lEVEgsIENIRUNLQk9YX0hFSUdIVCwgQ0hFQ0tCT1hfREVQVEggKTtcclxuICByZWN0LnRyYW5zbGF0ZSggQ0hFQ0tCT1hfV0lEVEggKiAwLjUsIDAsIDAgKTtcclxuXHJcblxyXG4gIC8vICBoaXRzY2FuIHZvbHVtZVxyXG4gIGNvbnN0IGhpdHNjYW5NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xyXG4gIGhpdHNjYW5NYXRlcmlhbC52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0IGhpdHNjYW5Wb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBoaXRzY2FuTWF0ZXJpYWwgKTtcclxuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnggPSB3aWR0aCAqIDAuNTtcclxuXHJcbiAgLy8gIG91dGxpbmUgdm9sdW1lXHJcbiAgLy8gY29uc3Qgb3V0bGluZSA9IG5ldyBUSFJFRS5Cb3hIZWxwZXIoIGhpdHNjYW5Wb2x1bWUgKTtcclxuICAvLyBvdXRsaW5lLm1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLk9VVExJTkVfQ09MT1IgKTtcclxuXHJcbiAgLy8gIGNoZWNrYm94IHZvbHVtZVxyXG4gIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6IENvbG9ycy5DSEVDS0JPWF9CR19DT0xPUiB9KTtcclxuICBjb25zdCBmaWxsZWRWb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBtYXRlcmlhbCApO1xyXG4gIC8vIGZpbGxlZFZvbHVtZS5zY2FsZS5zZXQoIEFDVElWRV9TQ0FMRSwgQUNUSVZFX1NDQUxFLEFDVElWRV9TQ0FMRSApO1xyXG4gIGhpdHNjYW5Wb2x1bWUuYWRkKCBmaWxsZWRWb2x1bWUgKTtcclxuXHJcblxyXG4gIGNvbnN0IGRlc2NyaXB0b3JMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggcHJvcGVydHlOYW1lICk7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfTEFCRUxfVEVYVF9NQVJHSU47XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzO1xyXG5cclxuICBjb25zdCBjb250cm9sbGVySUQgPSBMYXlvdXQuY3JlYXRlQ29udHJvbGxlcklEQm94KCBoZWlnaHQsIENvbG9ycy5DT05UUk9MTEVSX0lEX0NIRUNLQk9YICk7XHJcbiAgY29udHJvbGxlcklELnBvc2l0aW9uLnogPSBkZXB0aDtcclxuXHJcbiAgY29uc3QgYm9yZGVyQm94ID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCBDSEVDS0JPWF9XSURUSCArIExheW91dC5CT1JERVJfVEhJQ0tORVNTLCBDSEVDS0JPWF9IRUlHSFQgKyBMYXlvdXQuQk9SREVSX1RISUNLTkVTUywgQ0hFQ0tCT1hfREVQVEgsIHRydWUgKTtcclxuICBib3JkZXJCb3gubWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCAweDFmN2FlNyApO1xyXG4gIGJvcmRlckJveC5wb3NpdGlvbi54ID0gLUxheW91dC5CT1JERVJfVEhJQ0tORVNTICogMC41ICsgd2lkdGggKiAwLjU7XHJcbiAgYm9yZGVyQm94LnBvc2l0aW9uLnogPSBkZXB0aCAqIDAuNTtcclxuXHJcbiAgY29uc3QgY2hlY2ttYXJrID0gR3JhcGhpYy5jaGVja21hcmsoKTtcclxuICBjaGVja21hcmsucG9zaXRpb24ueiA9IGRlcHRoICogMC41MTtcclxuICBoaXRzY2FuVm9sdW1lLmFkZCggY2hlY2ttYXJrICk7XHJcblxyXG4gIHBhbmVsLmFkZCggZGVzY3JpcHRvckxhYmVsLCBoaXRzY2FuVm9sdW1lLCBjb250cm9sbGVySUQsIGJvcmRlckJveCApO1xyXG5cclxuICAvLyBncm91cC5hZGQoIGZpbGxlZFZvbHVtZSwgb3V0bGluZSwgaGl0c2NhblZvbHVtZSwgZGVzY3JpcHRvckxhYmVsICk7XHJcblxyXG4gIGNvbnN0IGludGVyYWN0aW9uID0gY3JlYXRlSW50ZXJhY3Rpb24oIGhpdHNjYW5Wb2x1bWUgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblByZXNzZWQnLCBoYW5kbGVPblByZXNzICk7XHJcblxyXG4gIHVwZGF0ZVZpZXcoKTtcclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlT25QcmVzcyggcCApe1xyXG4gICAgaWYoIGdyb3VwLnZpc2libGUgPT09IGZhbHNlICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0ZS52YWx1ZSA9ICFzdGF0ZS52YWx1ZTtcclxuXHJcbiAgICBvYmplY3RbIHByb3BlcnR5TmFtZSBdID0gc3RhdGUudmFsdWU7XHJcblxyXG4gICAgaWYoIG9uQ2hhbmdlZENCICl7XHJcbiAgICAgIG9uQ2hhbmdlZENCKCBzdGF0ZS52YWx1ZSApO1xyXG4gICAgfVxyXG5cclxuICAgIHAubG9ja2VkID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZVZpZXcoKXtcclxuXHJcbiAgICBpZiggc3RhdGUudmFsdWUgKXtcclxuICAgICAgY2hlY2ttYXJrLnZpc2libGUgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgY2hlY2ttYXJrLnZpc2libGUgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmKCBpbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XHJcbiAgICAgIGJvcmRlckJveC52aXNpYmxlID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIGJvcmRlckJveC52aXNpYmxlID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgbGV0IG9uQ2hhbmdlZENCO1xyXG4gIGxldCBvbkZpbmlzaENoYW5nZUNCO1xyXG5cclxuICBncm91cC5vbkNoYW5nZSA9IGZ1bmN0aW9uKCBjYWxsYmFjayApe1xyXG4gICAgb25DaGFuZ2VkQ0IgPSBjYWxsYmFjaztcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBncm91cC5pbnRlcmFjdGlvbiA9IGludGVyYWN0aW9uO1xyXG4gIGdyb3VwLmhpdHNjYW4gPSBbIGhpdHNjYW5Wb2x1bWUsIHBhbmVsIF07XHJcblxyXG4gIGNvbnN0IGdyYWJJbnRlcmFjdGlvbiA9IEdyYWIuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XHJcblxyXG4gIGdyb3VwLmxpc3RlbiA9IGZ1bmN0aW9uKCl7XHJcbiAgICBzdGF0ZS5saXN0ZW4gPSB0cnVlO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLm5hbWUgPSBmdW5jdGlvbiggc3RyICl7XHJcbiAgICBkZXNjcmlwdG9yTGFiZWwudXBkYXRlTGFiZWwoIHN0ciApO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLnVwZGF0ZUNvbnRyb2wgPSBmdW5jdGlvbiggaW5wdXRPYmplY3RzICl7XHJcbiAgICBpZiggc3RhdGUubGlzdGVuICl7XHJcbiAgICAgIHN0YXRlLnZhbHVlID0gb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXTtcclxuICAgIH1cclxuICAgIGludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICBncmFiSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIHVwZGF0ZVZpZXcoKTtcclxuICB9O1xyXG5cclxuXHJcbiAgcmV0dXJuIGdyb3VwO1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmV4cG9ydCBjb25zdCBERUZBVUxUX0NPTE9SID0gMHgyRkExRDY7XHJcbmV4cG9ydCBjb25zdCBISUdITElHSFRfQ09MT1IgPSAweDQzYjVlYTtcclxuZXhwb3J0IGNvbnN0IElOVEVSQUNUSU9OX0NPTE9SID0gMHgwN0FCRjc7XHJcbmV4cG9ydCBjb25zdCBFTUlTU0lWRV9DT0xPUiA9IDB4MjIyMjIyO1xyXG5leHBvcnQgY29uc3QgSElHSExJR0hUX0VNSVNTSVZFX0NPTE9SID0gMHg5OTk5OTk7XHJcbmV4cG9ydCBjb25zdCBPVVRMSU5FX0NPTE9SID0gMHg5OTk5OTk7XHJcbmV4cG9ydCBjb25zdCBERUZBVUxUX0JBQ0sgPSAweDFhMWExYTtcclxuZXhwb3J0IGNvbnN0IERFRkFVTFRfRk9MREVSX0JBQ0sgPSAweDEwMTAxMDtcclxuZXhwb3J0IGNvbnN0IEhJR0hMSUdIVF9CQUNLID0gMHgzMTMxMzE7XHJcbmV4cG9ydCBjb25zdCBJTkFDVElWRV9DT0xPUiA9IDB4MTYxODI5O1xyXG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9TTElERVIgPSAweDJmYTFkNjtcclxuZXhwb3J0IGNvbnN0IENPTlRST0xMRVJfSURfQ0hFQ0tCT1ggPSAweDgwNjc4NztcclxuZXhwb3J0IGNvbnN0IENPTlRST0xMRVJfSURfQlVUVE9OID0gMHhlNjFkNWY7XHJcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX1RFWFQgPSAweDFlZDM2ZjtcclxuZXhwb3J0IGNvbnN0IENPTlRST0xMRVJfSURfRFJPUERPV04gPSAweGZmZjAwMDtcclxuZXhwb3J0IGNvbnN0IERST1BET1dOX0JHX0NPTE9SID0gMHhmZmZmZmY7XHJcbmV4cG9ydCBjb25zdCBEUk9QRE9XTl9GR19DT0xPUiA9IDB4MDAwMDAwO1xyXG5leHBvcnQgY29uc3QgQ0hFQ0tCT1hfQkdfQ09MT1IgPSAweGZmZmZmZjtcclxuZXhwb3J0IGNvbnN0IEJVVFRPTl9DT0xPUiA9IDB4ZTYxZDVmO1xyXG5leHBvcnQgY29uc3QgQlVUVE9OX0hJR0hMSUdIVF9DT0xPUiA9IDB4ZmEzMTczO1xyXG5leHBvcnQgY29uc3QgU0xJREVSX0JHID0gMHg0NDQ0NDQ7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY29sb3JpemVHZW9tZXRyeSggZ2VvbWV0cnksIGNvbG9yICl7XHJcbiAgZ2VvbWV0cnkuZmFjZXMuZm9yRWFjaCggZnVuY3Rpb24oZmFjZSl7XHJcbiAgICBmYWNlLmNvbG9yLnNldEhleChjb2xvcik7XHJcbiAgfSk7XHJcbiAgZ2VvbWV0cnkuY29sb3JzTmVlZFVwZGF0ZSA9IHRydWU7XHJcbiAgcmV0dXJuIGdlb21ldHJ5O1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCBjcmVhdGVUZXh0TGFiZWwgZnJvbSAnLi90ZXh0bGFiZWwnO1xyXG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XHJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XHJcbmltcG9ydCAqIGFzIExheW91dCBmcm9tICcuL2xheW91dCc7XHJcbmltcG9ydCAqIGFzIEdyYXBoaWMgZnJvbSAnLi9ncmFwaGljJztcclxuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcclxuaW1wb3J0ICogYXMgR3JhYiBmcm9tICcuL2dyYWInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlQ2hlY2tib3goIHtcclxuICB0ZXh0Q3JlYXRvcixcclxuICBvYmplY3QsXHJcbiAgcHJvcGVydHlOYW1lID0gJ3VuZGVmaW5lZCcsXHJcbiAgaW5pdGlhbFZhbHVlID0gZmFsc2UsXHJcbiAgb3B0aW9ucyA9IFtdLFxyXG4gIHdpZHRoID0gTGF5b3V0LlBBTkVMX1dJRFRILFxyXG4gIGhlaWdodCA9IExheW91dC5QQU5FTF9IRUlHSFQsXHJcbiAgZGVwdGggPSBMYXlvdXQuUEFORUxfREVQVEhcclxufSA9IHt9ICl7XHJcblxyXG5cclxuICBjb25zdCBzdGF0ZSA9IHtcclxuICAgIG9wZW46IGZhbHNlLFxyXG4gICAgbGlzdGVuOiBmYWxzZVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IERST1BET1dOX1dJRFRIID0gd2lkdGggKiAwLjUgLSBMYXlvdXQuUEFORUxfTUFSR0lOO1xyXG4gIGNvbnN0IERST1BET1dOX0hFSUdIVCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgRFJPUERPV05fREVQVEggPSBkZXB0aDtcclxuICBjb25zdCBEUk9QRE9XTl9PUFRJT05fSEVJR0hUID0gaGVpZ2h0IC0gTGF5b3V0LlBBTkVMX01BUkdJTiAqIDEuMjtcclxuICBjb25zdCBEUk9QRE9XTl9NQVJHSU4gPSBMYXlvdXQuUEFORUxfTUFSR0lOICogLTAuNDtcclxuXHJcbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcbiAgY29uc3QgcGFuZWwgPSBMYXlvdXQuY3JlYXRlUGFuZWwoIHdpZHRoLCBoZWlnaHQsIGRlcHRoICk7XHJcbiAgZ3JvdXAuYWRkKCBwYW5lbCApO1xyXG5cclxuICBncm91cC5oaXRzY2FuID0gWyBwYW5lbCBdO1xyXG5cclxuICBjb25zdCBsYWJlbEludGVyYWN0aW9ucyA9IFtdO1xyXG4gIGNvbnN0IG9wdGlvbkxhYmVscyA9IFtdO1xyXG5cclxuICAvLyAgZmluZCBhY3R1YWxseSB3aGljaCBsYWJlbCBpcyBzZWxlY3RlZFxyXG4gIGNvbnN0IGluaXRpYWxMYWJlbCA9IGZpbmRMYWJlbEZyb21Qcm9wKCk7XHJcblxyXG5cclxuXHJcbiAgZnVuY3Rpb24gZmluZExhYmVsRnJvbVByb3AoKXtcclxuICAgIGlmKCBBcnJheS5pc0FycmF5KCBvcHRpb25zICkgKXtcclxuICAgICAgcmV0dXJuIG9wdGlvbnMuZmluZCggZnVuY3Rpb24oIG9wdGlvbk5hbWUgKXtcclxuICAgICAgICByZXR1cm4gb3B0aW9uTmFtZSA9PT0gb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvcHRpb25zKS5maW5kKCBmdW5jdGlvbiggb3B0aW9uTmFtZSApe1xyXG4gICAgICAgIHJldHVybiBvYmplY3RbcHJvcGVydHlOYW1lXSA9PT0gb3B0aW9uc1sgb3B0aW9uTmFtZSBdO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZU9wdGlvbiggbGFiZWxUZXh0LCBpc09wdGlvbiApe1xyXG4gICAgY29uc3QgbGFiZWwgPSBjcmVhdGVUZXh0TGFiZWwoXHJcbiAgICAgIHRleHRDcmVhdG9yLCBsYWJlbFRleHQsXHJcbiAgICAgIERST1BET1dOX1dJRFRILCBkZXB0aCxcclxuICAgICAgQ29sb3JzLkRST1BET1dOX0ZHX0NPTE9SLCBDb2xvcnMuRFJPUERPV05fQkdfQ09MT1IsXHJcbiAgICAgIDAuODY2XHJcbiAgICApO1xyXG5cclxuICAgIGdyb3VwLmhpdHNjYW4ucHVzaCggbGFiZWwuYmFjayApO1xyXG4gICAgY29uc3QgbGFiZWxJbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBsYWJlbC5iYWNrICk7XHJcbiAgICBsYWJlbEludGVyYWN0aW9ucy5wdXNoKCBsYWJlbEludGVyYWN0aW9uICk7XHJcbiAgICBvcHRpb25MYWJlbHMucHVzaCggbGFiZWwgKTtcclxuXHJcblxyXG4gICAgaWYoIGlzT3B0aW9uICl7XHJcbiAgICAgIGxhYmVsSW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgZnVuY3Rpb24oIHAgKXtcclxuICAgICAgICBzZWxlY3RlZExhYmVsLnNldFN0cmluZyggbGFiZWxUZXh0ICk7XHJcblxyXG4gICAgICAgIGxldCBwcm9wZXJ0eUNoYW5nZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYoIEFycmF5LmlzQXJyYXkoIG9wdGlvbnMgKSApe1xyXG4gICAgICAgICAgcHJvcGVydHlDaGFuZ2VkID0gb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSAhPT0gbGFiZWxUZXh0O1xyXG4gICAgICAgICAgaWYoIHByb3BlcnR5Q2hhbmdlZCApe1xyXG4gICAgICAgICAgICBvYmplY3RbIHByb3BlcnR5TmFtZSBdID0gbGFiZWxUZXh0O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgcHJvcGVydHlDaGFuZ2VkID0gb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSAhPT0gb3B0aW9uc1sgbGFiZWxUZXh0IF07XHJcbiAgICAgICAgICBpZiggcHJvcGVydHlDaGFuZ2VkICl7XHJcbiAgICAgICAgICAgIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gPSBvcHRpb25zWyBsYWJlbFRleHQgXTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBjb2xsYXBzZU9wdGlvbnMoKTtcclxuICAgICAgICBzdGF0ZS5vcGVuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmKCBvbkNoYW5nZWRDQiAmJiBwcm9wZXJ0eUNoYW5nZWQgKXtcclxuICAgICAgICAgIG9uQ2hhbmdlZENCKCBvYmplY3RbIHByb3BlcnR5TmFtZSBdICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwLmxvY2tlZCA9IHRydWU7XHJcblxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIGxhYmVsSW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgZnVuY3Rpb24oIHAgKXtcclxuICAgICAgICBpZiggc3RhdGUub3BlbiA9PT0gZmFsc2UgKXtcclxuICAgICAgICAgIG9wZW5PcHRpb25zKCk7XHJcbiAgICAgICAgICBzdGF0ZS5vcGVuID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgIGNvbGxhcHNlT3B0aW9ucygpO1xyXG4gICAgICAgICAgc3RhdGUub3BlbiA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcC5sb2NrZWQgPSB0cnVlO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGxhYmVsLmlzT3B0aW9uID0gaXNPcHRpb247XHJcbiAgICByZXR1cm4gbGFiZWw7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjb2xsYXBzZU9wdGlvbnMoKXtcclxuICAgIG9wdGlvbkxhYmVscy5mb3JFYWNoKCBmdW5jdGlvbiggbGFiZWwgKXtcclxuICAgICAgaWYoIGxhYmVsLmlzT3B0aW9uICl7XHJcbiAgICAgICAgbGFiZWwudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIGxhYmVsLmJhY2sudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9wZW5PcHRpb25zKCl7XHJcbiAgICBvcHRpb25MYWJlbHMuZm9yRWFjaCggZnVuY3Rpb24oIGxhYmVsICl7XHJcbiAgICAgIGlmKCBsYWJlbC5pc09wdGlvbiApe1xyXG4gICAgICAgIGxhYmVsLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIGxhYmVsLmJhY2sudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gIGJhc2Ugb3B0aW9uXHJcbiAgY29uc3Qgc2VsZWN0ZWRMYWJlbCA9IGNyZWF0ZU9wdGlvbiggaW5pdGlhbExhYmVsLCBmYWxzZSApO1xyXG4gIHNlbGVjdGVkTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9NQVJHSU4gKiAwLjUgKyB3aWR0aCAqIDAuNTtcclxuICBzZWxlY3RlZExhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuXHJcbiAgY29uc3QgZG93bkFycm93ID0gR3JhcGhpYy5kb3duQXJyb3coKTtcclxuICAvLyBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggZG93bkFycm93Lmdlb21ldHJ5LCBDb2xvcnMuRFJPUERPV05fRkdfQ09MT1IgKTtcclxuICBkb3duQXJyb3cucG9zaXRpb24uc2V0KCBEUk9QRE9XTl9XSURUSCAtIDAuMDQsIDAsIGRlcHRoICogMS4wMSApO1xyXG4gIHNlbGVjdGVkTGFiZWwuYWRkKCBkb3duQXJyb3cgKTtcclxuXHJcblxyXG4gIGZ1bmN0aW9uIGNvbmZpZ3VyZUxhYmVsUG9zaXRpb24oIGxhYmVsLCBpbmRleCApe1xyXG4gICAgbGFiZWwucG9zaXRpb24ueSA9IC1EUk9QRE9XTl9NQVJHSU4gLSAoaW5kZXgrMSkgKiAoIERST1BET1dOX09QVElPTl9IRUlHSFQgKTtcclxuICAgIGxhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9wdGlvblRvTGFiZWwoIG9wdGlvbk5hbWUsIGluZGV4ICl7XHJcbiAgICBjb25zdCBvcHRpb25MYWJlbCA9IGNyZWF0ZU9wdGlvbiggb3B0aW9uTmFtZSwgdHJ1ZSApO1xyXG4gICAgY29uZmlndXJlTGFiZWxQb3NpdGlvbiggb3B0aW9uTGFiZWwsIGluZGV4ICk7XHJcbiAgICByZXR1cm4gb3B0aW9uTGFiZWw7XHJcbiAgfVxyXG5cclxuICBpZiggQXJyYXkuaXNBcnJheSggb3B0aW9ucyApICl7XHJcbiAgICBzZWxlY3RlZExhYmVsLmFkZCggLi4ub3B0aW9ucy5tYXAoIG9wdGlvblRvTGFiZWwgKSApO1xyXG4gIH1cclxuICBlbHNle1xyXG4gICAgc2VsZWN0ZWRMYWJlbC5hZGQoIC4uLk9iamVjdC5rZXlzKG9wdGlvbnMpLm1hcCggb3B0aW9uVG9MYWJlbCApICk7XHJcbiAgfVxyXG5cclxuXHJcbiAgY29sbGFwc2VPcHRpb25zKCk7XHJcblxyXG4gIGNvbnN0IGRlc2NyaXB0b3JMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggcHJvcGVydHlOYW1lICk7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfTEFCRUxfVEVYVF9NQVJHSU47XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzO1xyXG5cclxuICBjb25zdCBjb250cm9sbGVySUQgPSBMYXlvdXQuY3JlYXRlQ29udHJvbGxlcklEQm94KCBoZWlnaHQsIENvbG9ycy5DT05UUk9MTEVSX0lEX0RST1BET1dOICk7XHJcbiAgY29udHJvbGxlcklELnBvc2l0aW9uLnogPSBkZXB0aDtcclxuXHJcblxyXG4gIGNvbnN0IGJvcmRlckJveCA9IExheW91dC5jcmVhdGVQYW5lbCggRFJPUERPV05fV0lEVEggKyBMYXlvdXQuQk9SREVSX1RISUNLTkVTUywgRFJPUERPV05fSEVJR0hUICsgTGF5b3V0LkJPUkRFUl9USElDS05FU1MgKiAwLjUsIERST1BET1dOX0RFUFRILCB0cnVlICk7XHJcbiAgYm9yZGVyQm94Lm1hdGVyaWFsLmNvbG9yLnNldEhleCggMHgxZjdhZTcgKTtcclxuICBib3JkZXJCb3gucG9zaXRpb24ueCA9IC1MYXlvdXQuQk9SREVSX1RISUNLTkVTUyAqIDAuNSArIHdpZHRoICogMC41O1xyXG4gIGJvcmRlckJveC5wb3NpdGlvbi56ID0gZGVwdGggKiAwLjU7XHJcblxyXG4gIHBhbmVsLmFkZCggZGVzY3JpcHRvckxhYmVsLCBjb250cm9sbGVySUQsIHNlbGVjdGVkTGFiZWwsIGJvcmRlckJveCApO1xyXG5cclxuXHJcbiAgdXBkYXRlVmlldygpO1xyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XHJcblxyXG4gICAgbGFiZWxJbnRlcmFjdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24oIGludGVyYWN0aW9uLCBpbmRleCApe1xyXG4gICAgICBjb25zdCBsYWJlbCA9IG9wdGlvbkxhYmVsc1sgaW5kZXggXTtcclxuICAgICAgaWYoIGxhYmVsLmlzT3B0aW9uICl7XHJcbiAgICAgICAgaWYoIGludGVyYWN0aW9uLmhvdmVyaW5nKCkgKXtcclxuICAgICAgICAgIENvbG9ycy5jb2xvcml6ZUdlb21ldHJ5KCBsYWJlbC5iYWNrLmdlb21ldHJ5LCBDb2xvcnMuSElHSExJR0hUX0NPTE9SICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggbGFiZWwuYmFjay5nZW9tZXRyeSwgQ29sb3JzLkRST1BET1dOX0JHX0NPTE9SICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiggbGFiZWxJbnRlcmFjdGlvbnNbMF0uaG92ZXJpbmcoKSB8fCBzdGF0ZS5vcGVuICl7XHJcbiAgICAgIGJvcmRlckJveC52aXNpYmxlID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIGJvcmRlckJveC52aXNpYmxlID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBsZXQgb25DaGFuZ2VkQ0I7XHJcbiAgbGV0IG9uRmluaXNoQ2hhbmdlQ0I7XHJcblxyXG4gIGdyb3VwLm9uQ2hhbmdlID0gZnVuY3Rpb24oIGNhbGxiYWNrICl7XHJcbiAgICBvbkNoYW5nZWRDQiA9IGNhbGxiYWNrO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGdyYWJJbnRlcmFjdGlvbiA9IEdyYWIuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XHJcblxyXG4gIGdyb3VwLmxpc3RlbiA9IGZ1bmN0aW9uKCl7XHJcbiAgICBzdGF0ZS5saXN0ZW4gPSB0cnVlO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLnVwZGF0ZUNvbnRyb2wgPSBmdW5jdGlvbiggaW5wdXRPYmplY3RzICl7XHJcbiAgICBpZiggc3RhdGUubGlzdGVuICl7XHJcbiAgICAgIHNlbGVjdGVkTGFiZWwuc2V0U3RyaW5nKCBmaW5kTGFiZWxGcm9tUHJvcCgpICk7XHJcbiAgICB9XHJcbiAgICBsYWJlbEludGVyYWN0aW9ucy5mb3JFYWNoKCBmdW5jdGlvbiggbGFiZWxJbnRlcmFjdGlvbiApe1xyXG4gICAgICBsYWJlbEludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICB9KTtcclxuICAgIGdyYWJJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG4gICAgdXBkYXRlVmlldygpO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLm5hbWUgPSBmdW5jdGlvbiggc3RyICl7XHJcbiAgICBkZXNjcmlwdG9yTGFiZWwudXBkYXRlKCBzdHIgKTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuXHJcbiAgcmV0dXJuIGdyb3VwO1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCBjcmVhdGVUZXh0TGFiZWwgZnJvbSAnLi90ZXh0bGFiZWwnO1xyXG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XHJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XHJcbmltcG9ydCAqIGFzIExheW91dCBmcm9tICcuL2xheW91dCc7XHJcbmltcG9ydCAqIGFzIEdyYXBoaWMgZnJvbSAnLi9ncmFwaGljJztcclxuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcclxuaW1wb3J0ICogYXMgR3JhYiBmcm9tICcuL2dyYWInO1xyXG5pbXBvcnQgKiBhcyBQYWxldHRlIGZyb20gJy4vcGFsZXR0ZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVGb2xkZXIoe1xyXG4gIHRleHRDcmVhdG9yLFxyXG4gIG5hbWUsXHJcbiAgZ3VpQWRkLFxyXG4gIGd1aVJlbW92ZSxcclxuICBhZGRTbGlkZXIsXHJcbiAgYWRkRHJvcGRvd24sXHJcbiAgYWRkQ2hlY2tib3gsXHJcbiAgYWRkQnV0dG9uXHJcbn0gPSB7fSApe1xyXG5cclxuICBjb25zdCB3aWR0aCA9IExheW91dC5GT0xERVJfV0lEVEg7XHJcbiAgY29uc3QgZGVwdGggPSBMYXlvdXQuUEFORUxfREVQVEg7XHJcblxyXG4gIGNvbnN0IHN0YXRlID0ge1xyXG4gICAgY29sbGFwc2VkOiBmYWxzZSxcclxuICAgIHByZXZpb3VzUGFyZW50OiB1bmRlZmluZWRcclxuICB9O1xyXG5cclxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gIGNvbnN0IGNvbGxhcHNlR3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICBncm91cC5hZGQoIGNvbGxhcHNlR3JvdXAgKTtcclxuXHJcbiAgLy9leHBvc2UgYXMgcHVibGljIGludGVyZmFjZSBzbyB0aGF0IGNoaWxkcmVuIGNhbiBjYWxsIGl0IHdoZW4gdGhlaXIgc3BhY2luZyBjaGFuZ2VzXHJcbiAgZ3JvdXAucGVyZm9ybUxheW91dCA9IHBlcmZvcm1MYXlvdXQ7XHJcbiAgZ3JvdXAuaXNDb2xsYXBzZWQgPSAoKSA9PiB7IHJldHVybiBzdGF0ZS5jb2xsYXBzZWQgfVxyXG4gIFxyXG4gIC8vdXNlZnVsIHRvIGhhdmUgYWNjZXNzIHRvIHRoaXMgYXMgd2VsbC4gVXNpbmcgaW4gcmVtb3ZlIGltcGxlbWVudGF0aW9uXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGdyb3VwLCAnZ3VpQ2hpbGRyZW4nLCB7XHJcbiAgICBnZXQ6ICgpID0+IHsgcmV0dXJuIGNvbGxhcHNlR3JvdXAuY2hpbGRyZW4gfVxyXG4gIH0pO1xyXG4gIC8vIHJldHVybnMgdHJ1ZSBpZiBhbGwgb2YgdGhlIHN1cHBsaWVkIGFyZ3MgYXJlIG1lbWJlcnMgb2YgdGhpcyBmb2xkZXJcclxuICBncm91cC5oYXNDaGlsZCA9IGZ1bmN0aW9uICggLi4uYXJncyApe1xyXG4gICAgcmV0dXJuICFhcmdzLmluY2x1ZGVzKChvYmopID0+IHsgcmV0dXJuIGdyb3VwLmd1aUNoaWxkcmVuLmluZGV4T2Yob2JqKSA9PT0gLTF9KTtcclxuICB9XHJcblxyXG4gIC8vICBZZWFoLiBHcm9zcy5cclxuICBjb25zdCBhZGRPcmlnaW5hbCA9IFRIUkVFLkdyb3VwLnByb3RvdHlwZS5hZGQ7XHJcbiAgLy9hcyBsb25nIGFzIG5vLW9uZSBleHBlY3RzIHRoaXMgdG8gYmVoYXZlIGxpa2UgYSByZWd1bGFyIFRIUkVFLkdyb3VwLCB0aGUgY2hhbmdlZCBkZWZpbml0aW9uIG9mIHJlbW92ZSBzaG91bGRuJ3QgaHVydFxyXG4gIC8vY29uc3QgcmVtb3ZlT3JpZ2luYWwgPSBUSFJFRS5Hcm91cC5wcm90b3R5cGUucmVtb3ZlOyBcclxuXHJcbiAgZnVuY3Rpb24gYWRkSW1wbCggbyApe1xyXG4gICAgYWRkT3JpZ2luYWwuY2FsbCggZ3JvdXAsIG8gKTtcclxuICB9XHJcblxyXG4gIGFkZEltcGwoIGNvbGxhcHNlR3JvdXAgKTtcclxuXHJcbiAgY29uc3QgcGFuZWwgPSBMYXlvdXQuY3JlYXRlUGFuZWwoIHdpZHRoLCBMYXlvdXQuRk9MREVSX0hFSUdIVCwgZGVwdGgsIHRydWUgKTtcclxuICBhZGRJbXBsKCBwYW5lbCApO1xyXG5cclxuICBjb25zdCBkZXNjcmlwdG9yTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIG5hbWUgKTtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9MQUJFTF9URVhUX01BUkdJTiAqIDEuNTtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcbiAgcGFuZWwuYWRkKCBkZXNjcmlwdG9yTGFiZWwgKTtcclxuXHJcbiAgY29uc3QgZG93bkFycm93ID0gTGF5b3V0LmNyZWF0ZURvd25BcnJvdygpO1xyXG4gIENvbG9ycy5jb2xvcml6ZUdlb21ldHJ5KCBkb3duQXJyb3cuZ2VvbWV0cnksIDB4ZmZmZmZmICk7XHJcbiAgZG93bkFycm93LnBvc2l0aW9uLnNldCggMC4wNSwgMCwgZGVwdGggICogMS4wMSApO1xyXG4gIHBhbmVsLmFkZCggZG93bkFycm93ICk7XHJcblxyXG4gIGNvbnN0IGdyYWJiZXIgPSBMYXlvdXQuY3JlYXRlUGFuZWwoIHdpZHRoLCBMYXlvdXQuRk9MREVSX0dSQUJfSEVJR0hULCBkZXB0aCwgdHJ1ZSApO1xyXG4gIGdyYWJiZXIucG9zaXRpb24ueSA9IExheW91dC5GT0xERVJfSEVJR0hUICogMC44NjtcclxuICBncmFiYmVyLm5hbWUgPSAnZ3JhYmJlcic7XHJcbiAgYWRkSW1wbCggZ3JhYmJlciApO1xyXG5cclxuICBjb25zdCBncmFiQmFyID0gR3JhcGhpYy5ncmFiQmFyKCk7XHJcbiAgZ3JhYkJhci5wb3NpdGlvbi5zZXQoIHdpZHRoICogMC41LCAwLCBkZXB0aCAqIDEuMDAxICk7XHJcbiAgZ3JhYmJlci5hZGQoIGdyYWJCYXIgKTtcclxuICBncm91cC5pc0ZvbGRlciA9IHRydWU7XHJcbiAgZ3JvdXAuaGlkZUdyYWJiZXIgPSBmdW5jdGlvbigpIHsgZ3JhYmJlci52aXNpYmxlID0gZmFsc2UgfTtcclxuXHJcbiAgZ3JvdXAuYWRkID0gZnVuY3Rpb24oIC4uLmFyZ3MgKXtcclxuICAgIGNvbnN0IG5ld0NvbnRyb2xsZXIgPSBndWlBZGQoIC4uLmFyZ3MgKTtcclxuXHJcbiAgICBpZiggbmV3Q29udHJvbGxlciApe1xyXG4gICAgICBncm91cC5hZGRDb250cm9sbGVyKCBuZXdDb250cm9sbGVyICk7XHJcbiAgICAgIHJldHVybiBuZXdDb250cm9sbGVyO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8qIFxyXG4gIFJlbW92ZXMgdGhlIGdpdmVuIGNvbnRyb2xsZXJzIGZyb20gdGhlIEdVSS5cclxuXHJcbiAgSWYgdGhlIGFyZ3VtZW50cyBhcmUgaW52YWxpZCwgaXQgd2lsbCBhdHRlbXB0IHRvIGRldGVjdCB0aGlzIGJlZm9yZSBtYWtpbmcgYW55IGNoYW5nZXMsIFxyXG4gIGFib3J0aW5nIHRoZSBwcm9jZXNzIGFuZCByZXR1cm5pbmcgZmFsc2UgZnJvbSB0aGlzIG1ldGhvZC5cclxuXHJcbiAgTm90ZTogYXMgd2l0aCBhZGQsIHRoaXMgb3ZlcndyaXRlcyBhbiBleGlzdGluZyBwcm9wZXJ0eSBvZiBUSFJFRS5Hcm91cC5cclxuICBBcyBsb25nIGFzIG5vLW9uZSBleHBlY3RzIGZvbGRlcnMgdG8gYmVoYXZlIGxpa2UgcmVndWxhciBUSFJFRS5Hcm91cHMsIHRoYXQgc2hvdWxkbid0IG1hdHRlci5cclxuICAqL1xyXG4gIGdyb3VwLnJlbW92ZSA9IGZ1bmN0aW9uKCAuLi5hcmdzICl7XHJcbiAgICBjb25zdCBvayA9IGd1aVJlbW92ZSggLi4uYXJncyApOyAvLyBhbnkgaW52YWxpZCBhcmd1bWVudHMgc2hvdWxkIGNhdXNlIHRoaXMgdG8gcmV0dXJuIGZhbHNlXHJcbiAgICBpZiAoIW9rKSByZXR1cm4gZmFsc2U7XHJcbiAgICBhcmdzLmZvckVhY2goIGZ1bmN0aW9uKCBvYmogKXtcclxuICAgICAgY29uc29sZS5hc3NlcnQoZ3JvdXAuaGFzQ2hpbGQob2JqKSwgXCJpbnRlcm5hbCBwcm9ibGVtIHdpdGggaG91c2VrZWVwaW5nIGxvZ2ljIG9mIGRhdC5HVUlWUiBmb2xkZXIgbm90IGNhdWdodCBieSBzYW5pdHkgY2hlY2tcIik7XHJcbiAgICAgIGlmIChvYmouaXNGb2xkZXIpIHtcclxuICAgICAgICBvYmoucmVtb3ZlKCAuLi5vYmouZ3VpQ2hpbGRyZW4gKTtcclxuICAgICAgfVxyXG4gICAgICBjb2xsYXBzZUdyb3VwLnJlbW92ZShvYmopO1xyXG4gICAgfSk7XHJcbiAgICAvL1RPRE86IGRlZmVyIGFjdHVhbCBsYXlvdXQgcGVyZm9ybWFuY2U7IHNldCBhIGZsYWcgYW5kIG1ha2Ugc3VyZSBpdCBnZXRzIGRvbmUgYmVmb3JlIGFueSByZW5kZXJpbmcgb3IgaGl0LXRlc3RpbmcgaGFwcGVucy5cclxuICAgIHBlcmZvcm1MYXlvdXQoKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgZ3JvdXAuYWRkQ29udHJvbGxlciA9IGZ1bmN0aW9uKCAuLi5hcmdzICl7XHJcbiAgICBhcmdzLmZvckVhY2goIGZ1bmN0aW9uKCBvYmogKXtcclxuICAgICAgY29sbGFwc2VHcm91cC5hZGQoIG9iaiApO1xyXG4gICAgICBvYmouZm9sZGVyID0gZ3JvdXA7XHJcbiAgICAgIGlmIChvYmouaXNGb2xkZXIpIHtcclxuICAgICAgICBvYmouaGlkZUdyYWJiZXIoKTtcclxuICAgICAgICBvYmouY2xvc2UoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcGVyZm9ybUxheW91dCgpO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLmFkZEZvbGRlciA9IGZ1bmN0aW9uKCAuLi5hcmdzICl7XHJcbiAgICBhcmdzLmZvckVhY2goIGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgY29sbGFwc2VHcm91cC5hZGQoIG9iaiApO1xyXG4gICAgICBvYmouZm9sZGVyID0gZ3JvdXA7XHJcbiAgICAgIG9iai5oaWRlR3JhYmJlcigpO1xyXG4gICAgICBvYmouY2xvc2UoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHBlcmZvcm1MYXlvdXQoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHBlcmZvcm1MYXlvdXQoKXtcclxuICAgIGNvbnN0IHNwYWNpbmdQZXJDb250cm9sbGVyID0gTGF5b3V0LlBBTkVMX0hFSUdIVCArIExheW91dC5QQU5FTF9TUEFDSU5HO1xyXG4gICAgY29uc3QgZW1wdHlGb2xkZXJTcGFjZSA9IExheW91dC5GT0xERVJfSEVJR0hUICsgTGF5b3V0LlBBTkVMX1NQQUNJTkc7XHJcbiAgICB2YXIgdG90YWxTcGFjaW5nID0gZW1wdHlGb2xkZXJTcGFjZTtcclxuXHJcbiAgICBjb2xsYXBzZUdyb3VwLmNoaWxkcmVuLmZvckVhY2goIChjKSA9PiB7IGMudmlzaWJsZSA9ICFzdGF0ZS5jb2xsYXBzZWQgfSApO1xyXG5cclxuICAgIGlmICggc3RhdGUuY29sbGFwc2VkICkge1xyXG4gICAgICBkb3duQXJyb3cucm90YXRpb24ueiA9IE1hdGguUEkgKiAwLjU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkb3duQXJyb3cucm90YXRpb24ueiA9IDA7XHJcblxyXG4gICAgICB2YXIgeSA9IDAsIGxhc3RIZWlnaHQgPSBlbXB0eUZvbGRlclNwYWNlO1xyXG5cclxuICAgICAgY29sbGFwc2VHcm91cC5jaGlsZHJlbi5mb3JFYWNoKCBmdW5jdGlvbiggY2hpbGQgKXtcclxuICAgICAgICB2YXIgaCA9IGNoaWxkLnNwYWNpbmcgPyBjaGlsZC5zcGFjaW5nIDogc3BhY2luZ1BlckNvbnRyb2xsZXI7XHJcbiAgICAgICAgLy8gaG93IGZhciB0byBnZXQgZnJvbSB0aGUgbWlkZGxlIG9mIHByZXZpb3VzIHRvIG1pZGRsZSBvZiB0aGlzIGNoaWxkP1xyXG4gICAgICAgIC8vIGhhbGYgb2YgdGhlIGhlaWdodCBvZiBwcmV2aW91cyBwbHVzIGhhbGYgaGVpZ2h0IG9mIHRoaXMuXHJcbiAgICAgICAgdmFyIHNwYWNpbmcgPSAwLjUgKiAobGFzdEhlaWdodCArIGgpO1xyXG5cclxuICAgICAgICBpZiAoY2hpbGQuaXNGb2xkZXIpIHtcclxuICAgICAgICAgIC8vIEZvciBmb2xkZXJzLCB0aGUgb3JpZ2luIGlzbid0IGluIHRoZSBtaWRkbGUgb2YgdGhlIGVudGlyZSBoZWlnaHQgb2YgdGhlIGZvbGRlcixcclxuICAgICAgICAgIC8vIGJ1dCBqdXN0IHRoZSBtaWRkbGUgb2YgdGhlIHRvcCBwYW5lbC5cclxuICAgICAgICAgIHZhciBvZmZzZXQgPSAwLjUgKiAobGFzdEhlaWdodCArIGVtcHR5Rm9sZGVyU3BhY2UpO1xyXG4gICAgICAgICAgY2hpbGQucG9zaXRpb24ueSA9IHkgLSBvZmZzZXQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNoaWxkLnBvc2l0aW9uLnkgPSB5IC0gc3BhY2luZztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaW4gYW55IGNhc2UsIGZvciB1c2UgYnkgdGhlIG5leHQgb2JqZWN0IGFsb25nIHdlIHJlbWVtYmVyICd5JyBhcyB0aGUgbWlkZGxlIG9mIHRoZSB3aG9sZSBwYW5lbFxyXG4gICAgICAgIHkgLT0gc3BhY2luZztcclxuICAgICAgICBsYXN0SGVpZ2h0ID0gaDtcclxuICAgICAgICB0b3RhbFNwYWNpbmcgKz0gaDtcclxuICAgICAgICBjaGlsZC5wb3NpdGlvbi54ID0gMC4wMjY7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdyb3VwLnNwYWNpbmcgPSB0b3RhbFNwYWNpbmc7XHJcblxyXG4gICAgLy9tYWtlIHN1cmUgcGFyZW50IGZvbGRlciBhbHNvIHBlcmZvcm1zIGxheW91dC5cclxuICAgIGlmIChncm91cC5mb2xkZXIgIT09IGdyb3VwKSBncm91cC5mb2xkZXIucGVyZm9ybUxheW91dCgpO1xyXG5cclxuICAgIC8vIGlmIHdlJ3JlIGEgc3ViZm9sZGVyLCB1c2UgYSBzbWFsbGVyIHBhbmVsXHJcbiAgICBsZXQgcGFuZWxXaWR0aCA9IExheW91dC5GT0xERVJfV0lEVEg7XHJcbiAgICBpZiAoZ3JvdXAuZm9sZGVyICE9PSBncm91cCkge1xyXG4gICAgICBwYW5lbFdpZHRoID0gTGF5b3V0LlNVQkZPTERFUl9XSURUSDtcclxuICAgIH1cclxuXHJcbiAgICBMYXlvdXQucmVzaXplUGFuZWwocGFuZWwsIHBhbmVsV2lkdGgsIExheW91dC5GT0xERVJfSEVJR0hULCBkZXB0aClcclxuXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XHJcbiAgICBpZiggaW50ZXJhY3Rpb24uaG92ZXJpbmcoKSApe1xyXG4gICAgICBwYW5lbC5tYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ISUdITElHSFRfQkFDSyApO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgcGFuZWwubWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuREVGQVVMVF9GT0xERVJfQkFDSyApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBncmFiSW50ZXJhY3Rpb24uaG92ZXJpbmcoKSApe1xyXG4gICAgICBncmFiYmVyLm1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkhJR0hMSUdIVF9CQUNLICk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBncmFiYmVyLm1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkRFRkFVTFRfRk9MREVSX0JBQ0sgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnN0IGludGVyYWN0aW9uID0gY3JlYXRlSW50ZXJhY3Rpb24oIHBhbmVsICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgZnVuY3Rpb24oIHAgKXtcclxuICAgIHN0YXRlLmNvbGxhcHNlZCA9ICFzdGF0ZS5jb2xsYXBzZWQ7XHJcbiAgICBwZXJmb3JtTGF5b3V0KCk7XHJcbiAgICBwLmxvY2tlZCA9IHRydWU7XHJcbiAgfSk7XHJcblxyXG4gIGdyb3VwLm9wZW4gPSBmdW5jdGlvbigpIHtcclxuICAgIC8vc2hvdWxkIHdlIGNvbnNpZGVyIGNoZWNraW5nIGlmIHBhcmVudHMgYXJlIG9wZW4gYW5kIGF1dG9tYXRpY2FsbHkgb3BlbiB0aGVtIGlmIG5vdD9cclxuICAgIGlmICghc3RhdGUuY29sbGFwc2VkKSByZXR1cm47XHJcbiAgICBzdGF0ZS5jb2xsYXBzZWQgPSBmYWxzZTtcclxuICAgIHBlcmZvcm1MYXlvdXQoKTtcclxuICB9XHJcblxyXG4gIGdyb3VwLmNsb3NlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAoc3RhdGUuY29sbGFwc2VkKSByZXR1cm47XHJcbiAgICBzdGF0ZS5jb2xsYXBzZWQgPSB0cnVlO1xyXG4gICAgcGVyZm9ybUxheW91dCgpO1xyXG4gIH1cclxuXHJcbiAgZ3JvdXAuZm9sZGVyID0gZ3JvdXA7XHJcblxyXG4gIGNvbnN0IGdyYWJJbnRlcmFjdGlvbiA9IEdyYWIuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbDogZ3JhYmJlciB9ICk7XHJcbiAgY29uc3QgcGFsZXR0ZUludGVyYWN0aW9uID0gUGFsZXR0ZS5jcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gKTtcclxuXHJcbiAgZ3JvdXAudXBkYXRlQ29udHJvbCA9IGZ1bmN0aW9uKCBpbnB1dE9iamVjdHMgKXtcclxuICAgIGludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICBncmFiSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIHBhbGV0dGVJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG5cclxuICAgIHVwZGF0ZVZpZXcoKTtcclxuICB9O1xyXG5cclxuICBncm91cC5uYW1lID0gZnVuY3Rpb24oIHN0ciApe1xyXG4gICAgZGVzY3JpcHRvckxhYmVsLnVwZGF0ZUxhYmVsKCBzdHIgKTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBncm91cC5oaXRzY2FuID0gWyBwYW5lbCwgZ3JhYmJlciBdO1xyXG5cclxuICBncm91cC5iZWluZ01vdmVkID0gZmFsc2U7XHJcblxyXG4gIGdyb3VwLmFkZFNsaWRlciA9ICguLi5hcmdzKT0+e1xyXG4gICAgY29uc3QgY29udHJvbGxlciA9IGFkZFNsaWRlciguLi5hcmdzKTtcclxuICAgIGlmKCBjb250cm9sbGVyICl7XHJcbiAgICAgIGdyb3VwLmFkZENvbnRyb2xsZXIoIGNvbnRyb2xsZXIgKTtcclxuICAgICAgcmV0dXJuIGNvbnRyb2xsZXI7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICByZXR1cm4gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuICBncm91cC5hZGREcm9wZG93biA9ICguLi5hcmdzKT0+e1xyXG4gICAgY29uc3QgY29udHJvbGxlciA9IGFkZERyb3Bkb3duKC4uLmFyZ3MpO1xyXG4gICAgaWYoIGNvbnRyb2xsZXIgKXtcclxuICAgICAgZ3JvdXAuYWRkQ29udHJvbGxlciggY29udHJvbGxlciApO1xyXG4gICAgICByZXR1cm4gY29udHJvbGxlcjtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICAgIH1cclxuICB9O1xyXG4gIGdyb3VwLmFkZENoZWNrYm94ID0gKC4uLmFyZ3MpPT57XHJcbiAgICBjb25zdCBjb250cm9sbGVyID0gYWRkQ2hlY2tib3goLi4uYXJncyk7XHJcbiAgICBpZiggY29udHJvbGxlciApe1xyXG4gICAgICBncm91cC5hZGRDb250cm9sbGVyKCBjb250cm9sbGVyICk7XHJcbiAgICAgIHJldHVybiBjb250cm9sbGVyO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgZ3JvdXAuYWRkQnV0dG9uID0gKC4uLmFyZ3MpPT57XHJcbiAgICBjb25zdCBjb250cm9sbGVyID0gYWRkQnV0dG9uKC4uLmFyZ3MpO1xyXG4gICAgaWYoIGNvbnRyb2xsZXIgKXtcclxuICAgICAgZ3JvdXAuYWRkQ29udHJvbGxlciggY29udHJvbGxlciApO1xyXG4gICAgICByZXR1cm4gY29udHJvbGxlcjtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICByZXR1cm4gZ3JvdXA7XHJcbn0iLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbipcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKlxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKlxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGltYWdlKCl7XHJcbiAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICBpbWFnZS5zcmMgPSBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFnQUFBQUVBQ0FNQUFBRHlUajVWQUFBQWpWQk1WRVZIY0V6Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vK3VtQWM3QUFBQUwzUlNUbE1BV25KZmJucURXR1I0YTJaY1luQlJhbFJMZ0g2RVRuUjhVR2gyUm9aRFhsYUhTWW84UUhVMkx5WWNGQXdGbW1VUjFPSUFBSkZoU1VSQlZIaGV0TDJKV211N2pqVUtJUWtrUUxxWnZnTUNaTzJ6VC8zMy9SL3ZTa05Ea2oyVHJPYXJWZDVWNnhEUDNwSmxXZEtRN3FhUGI2K3Zydzh2aitQWi92dnJ4ei8vL1BqNjNzL0c3L2NQMm4wL1haNk9wNlg4ZkpIZmFHLzNqOXE1WC9MS3QvdDN2L1FmdWZRay9Yb3Vib2x6L0RxNUxIN3kxbkxWbDl4ZUg0YjI4amlkbmNaeS9aTTBQK1dmZi83em4vLzgrKzkvL3NHNVV6dGF2M0gxaW5KSVhrbGU4UXZuMytPUk9QMm9qNU9QbXo3ZXYrbTVQRERGeVhhbi9Vd2V3QmQ4MTI0WkRuMm8zZVRCQm1DS0F6WlFmalk3NVdYLy9ZKy9LajZMbjc3Ly91RjNyMjR2SHlmUDVhZTljUlJzYUg1SS80OHZlUXFQNUtoOVg5ejg2d3ZuK3dqaFpmbVlqVHpteUJmbFNPQno1VjFsWE84ZUg1NG13OG56SzhkVEhzblBlcGJ1cHdmdDFWdStQc2x2YVpQdHM3M0ZhV3hYYnAvaVVqeC9JOVNVYzNITHFaMkRobnRWUDBFUmZONzlxOTE4Ky9UMnVGbE84ZXc4QlcrcXc0Uno1UlpiT1RwNWZzSmorZFRxRlovbGxUQXF1TGMrRW04akEvNGRBL1M4OWM5NWtoRWg4WlRZbThlM3ArMFFWOXhQNWY1ZlFqVThWTHVlSjNpdGU5Q1Q5TGV6bjVJRCtLcDh0QjNFbU9mZGVmc2w1ODBQWTFXTURrYUJORlhxSDVWamVTU0c1SGpSZFR6cStlQU1qUCtFTDh2SHlDU3pGelc2TEU5NlByanY3dVZwTXVwMHVsdU1wN0lwdVdYYjdYUTZ3eWNadHRrVWI5M3RvSTI2OXJITEthOGNicDBVbk0ydlR4TTl0L3Y4OEloemVOM2s2U1YvNHRieVpzZTlmZDRRZmQySnZPN204ZUc1VzU3eURSYkFyTUs1dUR2ZUdDVDlRYjdJVit6YUdNNzJ4eFB1UGNMcFNzOGo1OW56cEJ1Zk0zeDI0bkhhdnRvRGhuSVA2U1hWOE42NGFEUWtQVGxSdG5iMnM5OUUzOVJmZFJpZnJyd2tuYnc3Ym8vSmhYbEx3ZWxQbWNpVHg3UFQvbHY3VDdQWjVoSGpsa1B5dFpmUmo1dURSck9UbkE5bXZYOTR4a0IwaDN5dng4MUpCd0l2cXYxNFV6bi8rSzB2ZXllamZlNE5WdUNBRGNYbU96NXIxOXQxOWZLeHZwbjhIUFMwN1ZZais5akhON2xTZm5maTBoK2N6Y1BPZWRBYmRJU2E3MjlQY2c3YXVmdjBsai90MXN2OWFiWlUzcHpJdzZTdDlQdkdNa2FkUVp3aUEzSGtQUG5lNDl5Um5qdFlrYVJDTnZCUXZ1Smd4ekU4WWNCeDc0RU5IY1lacDY3NE9ZTnpoeHdkNHVGcHVOS25qN1lQa0F6SGs3NFJIcnJTOTlwMUp2WmdPUUQ2cjdRVEJNVzh4U0o2UFBGVjQ5T1h4Z0M4dTF5Z2hKTlJzMVZ3dGpINjczRDZSS2ZVY3JiWC92RjBLaCt4N2U2S1VaTzc2eXl4bTJNY3BsT2NiOHc2eEVDY096dDdXUTZFZE9zbkQ4RFpPQi95NTA1SHU1bHpQRjFzdnNvY0hNejdJT0lZWEhzZXpKditZdEh2TjcwZGJpRVRkVHZhTmYyOFZIbkgySDdYYS9xZzVyc3d5VzYra0RhWGQzL0xuNDE5eW5JOGZYL1h6enYzK291bVlBRDVpVlB3cGllVGxESVh4L2h1T2RodlFGSWIxcE5Oa1hOdjN0ZFhsSytSTVFTOU9lRDl4WnhEUi9vTHpacStmYzU2Y0ZhT0J2SDJKaDZHcS9XaVB4aHRqUzlPU3d3ZWJyS1RKOWhiem5BMkpzcWdXZlRYdTFHc1dKalFHRVI4VnYrU0FlUUNFZzdmQnI2N0YvcHpHREFiNzRVRjBDOU5QbnFsZDFyaks5Q1BnVmozRnhpSEJ6MUordmZIbVRIcldqK3MxNU9YQlFWUGV6SkFvNFJRbWZIeThtaWFHeGlnMXh6a1ByajM3T2hFSE16bExlWG05M2lXdnZTSGpOZmk4SUdQbFhkWEJ0QTdOc0lCeWhDbmJ4VkFlUDY4Zitpdmt3SGtzbytDQVQ0Ty9iNVJWK2ZiMnh1ZTFuem9tT2g5eVFBZk9PVk5WVTU1VXhXdHlsK1FEc0tFOHlEcHQ4cEQ4SkMvNG9lT0liN210TVNBcnc4ZmZONXN6SG5XZ1BpTjhyUnpOSWJKaEoxY0ljemZuVURTZ1dlRUFSYWYvWUc4NWdFZlJySDZnSW15YUdTa01hN3YxQTB3b2YyemR2VVNBREovY01Dbm01bnpIUTQwaS9sQkJ4U2FWU2pOSUljTXFieG85R3VuVHFhNXloSnBVS0NWNDhHc0IzQzNQR1VFQ2VDeXFpZnZvMk9EODQxZDd4NHcvUTV6enFnVGxwZUozcnR2MHM0R3ZUa2NsS2RrNUhFTCtTTHd4V0M5T0FoUGdjMk84aVVxNUZmNmZYcXRNTStML2hSV3JCaGdBY2tsbjY5RCsvVDhqS2ZaUUlsT1d6S0FOS2pweTcxSlNoNmI3NFFKbkFGTTdPSGpGbzNjZWQwc0RnMUZQc2VqNmEveFBDb3VPeDJnZVc4Z1RjOTJqbDdpUmhBUHdnRHlpclpPWTNsUldzcGp6K3UreWluVHJIQnowTCtIMTVjbllCcEFOeEJOVEdkQ3lnYXNybmdDWHNBSTkzQ3ZlZ0QxYWYwRW9VTUREb0FhRTVxZVRIYVFlamlzK20zY3p0MVFvSVBqRy9rdzVlMnp2UlFWYTJjOVBaOHExQTlWQW5IN05XVFNlQWEraGl4YTc2RHZRSGpnd2xWSGxzNjVVcHdLM3JaclBJN1JubUVGZWxBU0g1UkhWSzVTNTdsZ0FDcEdHRzlwY29JT2xQeWxzeWdaUUpycTlGRG92citTQVlUTy9aQUFMdmJtaDhNY3J5aXZ0RkNDdittTWgyd1lESGJHRVA1dE1rQTcxZWxHbmJOS09nb01uNStOU0pIRG9sbGpuWjVDcUsxV0syR1hqaXl1Zy9PcWd5ZjdZRGN5ekx0NUk1TnRhMnFkYjZMNFdSMFphMmdUd3FwVVZqc3FvOWVyTGpkZk15ckh1MGJ1SWx6UXpIZFVpRjM1MHp0cFo2ZlZyK3UwUERqNlovWk92Zlg2REIzblBESk5JeFRyWGR4SXFBMnV2Rk1pS0JrYkl5TW1DVHE0dWt5TkFTREVoNU11U0FNRkNWL1pQYThQQ3doRmJEYkdXQmY2SWl6QjNsT1Z1TnZKSlFQWW9JQnc1OTF1cCtPNlc4a2ZxNjdjT0JnQVBhNFVxNDRKWFZaWG1MNU9SRnRadjZrUlU2eGlJaTM4RlhYcGcwWnBRc3ZPNUJ3YmRZU3FuYTdPSXJrUUl1Q2RrdVRRMTVXa1R6SEZJUldlR3NyRjhnZEl2ZUhTc0tQbU9kQUpCTFh1dERFbCtreXRXYjhBT2dZMWtGQld6eDI3WkJuS3NZN0FlUmNLY2ZUckFBMDZxOHQrWmN0ZDlFKzV4SzEydmZWOFBvY1FnN1NpWXIzdXNhMTdTbTJvc25jUTVha25iY0FzWnhNSldBT1RBV1RLVEdUWmQyWWZtOEs4T0RnRHhBemxranRkWW50K2xRR0VxR1F0ZWRQZFNOcEEvb0RPNHZjWTZDRlI5Nm5Rd2Z4aE9xNlFnd29EVmxDNzdlR2dRdXhKQ2Q0L1VIK2RVWHoxN2ZHbVE2NHg1WEdYdFpCSEQ0TS85UEFXTjVLbjZscG5mRUU5OHFDL1pLQWdBSlVCcUU2NDVya2VkRXl0bzBvaXJHSmE4MXpYTnVnWXAxdVh1SExjMHhIdWRrVUh0VWxWOU1zQURXLzBqOWhQRGxjWk5oZitwUkJUUVR4MnhUcGJNb0MrcnM5NDE4RkcvR25McUYzODJWOFBkRDdxakxXVmhhT2JETEJ2TVlCcTBPeTVaQUJqTFQyR05VVEpSSjNGNzlIMEQvb1JMcCtQdHN1bENKQmVER3FzTzc0VTZkNUVLRnN4Z091Z0pnOGFXZHk2S29VWGg0VnNZa1FFY0ZIRHU1cjhHaFZybS9ieWw3TEhZbTJ5Ui91aFRoeE04NXhUanc3ZGtGcnp3ZFhBNWMxTGluRjVmdEpOeU1IR3RKU1kyKzJ2KzZkYzRocDVhTlBnQ1R1b2RtT25ZYlJrZ05NNDFtM2NnL0xVeCtSMHNubUJ6eEdob2p6UXRUbFpNUUNzYVp0cHhRQ1FDYmNaWU9ZelRvVU5wN0JlNWkrNzBJLzRDSVZ1LzVYUy9oUFQ4RFVZWUtzc2Ezc2VGUkVyYVhxbk5nTkF4S3NBNkl4MEFqWHpSditXKzFGYnpyZVhhUlNqeXZIUlJ4b2pRTDBkVTNMS0lFUHoxT00yWlRBSU9tQ2hOWk9IYjE1U2pzdkwwMVZDUHozOHVwL0VVeDBJS3U1YW5yU0d1SW92NjNtVENVSUcyRk52Y04xT0Jna3JRSS9UZWthMmJUNVVxS2p5Zk9hV3QyQ0FMdFQzcFZxQi80QUJzUFp4eFI3bGpDTUR5RWZJV2dtRmp2bzFhSTMxNmVPVDU5YUtoeTBnejBOcXVjbWpmTHlSVW45Z3pSdnNlbVFBNDUxa2dCRWtVcCtqbWlxR1hNWVZBTllSRzJ1WkU1MnpickQ0b2s1bVVRNmhOY2RhY3ZPU1d3endwLzFURG8vdTZVWWpsVFU1cHZ5eURodWxsVERBY1JaSDhXVWNKSmNSTUw3aGUvcVF5YnJWNHE0cEdBRHFvY29BSGZ6dTd6UEFySkN1SFBpU0RQb1I1MTV1Wm8vSHVLQlpKRnNrQTBBMVVTYlVSdjI2WmdDc2JpTERSUUNvWklIQnB5UFh1c1dEcjZPS20rbGRicGtpZjZxNG92YUpZVW5OTTE3MFBrOC9RMnZHbjlBeGJsN3l0eGdneDFPMDZTMTJScllmZWk5a0d4dGNBbnZaQm5JQTVUTE1vTWY4Z1ZHM1NZYzd5WHdVbWZtQjI3c09RRktkWVExODE2bXkycTFwOS9zbEE4VHFJeVJ4dGJPeUEyejVPVFMrZ2htSG1JVVlPdXV0SmNBam5FWDR3UHNMQ1VCVkNPeW1UNFBCUjJaS3d6ZkM2NmpNWGc4R0s1MURYYm5MdUZDTE9URDBXUERWNVNTb0ZwdzAxRHROaVhwOWxvZTRjTDExeWQ5akFQbmgyN1JYWFJ0aUx1YVlKdjBoQUlRQlVvbWlEaTZqaWZIZDZnUXIyVU1ONkxKeStaUU03VUJNUlBnTzA3R1ZPSlRQdjJBQXJqNDRHa3BjWlFuTTA0UFVwcTdvLy9NWnlRQjRmMnlSM1F2U1lnRDlBWGx2aW9EZVNxME56Z0JjUXFudURNVHBBUjlpc2MxTTNRZ1BkWTNnaFpRTktnVFJNVVY4Tkc5ZTh0Y1lnSS9HVEhLTkZvK3Vsb0IwRXFrcFdEUXI0MHd5UUszR1ZRd2dGaW1zWEc1aGxqVWNBeWE2UmpLQU1raVBScVhqenhuZ1dLd0J6cmVQNDVzTVFCdGxpeEtuMWk0QWFyQjdRYTR4d01KRWVYK2dES0JQR1EyQ0FlZ0VVVU5RT0QyV1puM0FBSzBYbE9iTDNESG9TenNWek9QMW5CcWtYSm5xeWMxTC9oSURzSjljVmFuR3RSS1lUaUpoZ0Mvc28yOHh3QjdEaTZldGRRTXd6QlBIVk1uVXJ0b2tBK2ptZDA0ZDgxY01jRXJwR2l2QThpWURxQjAxWkRHM3JlQ0xVclErZ0tOY3E3dk5BQjhtKy9XQUVJV2F2V3pUbitFR2xTMjhPVDNBeDJwOXNNMTVQblZjS1U0ditaU2FtaEJaVG9WYmwveGxCbUIvTGRmcmJhQlQ4UGhMQ2JCUDg3NUt4ZDBxRitVeEJnRy8xUU5MWFVaV0NTTUZQQ08vWUlBMDRzM25sSXpUTmdPa1BrcVRiNjJObVVtV200bUJTTGF0V3hSK0xnSDBESmtnS2tma2ZKQVYwUXV3ckhUT01BVDVLcFBLVHNxZDJ1TEJwMXgrWkUyRitwSy96d0MvZXZUbmdxM05BTzFUQjI3dTNjQ1JpRzF0WDZXaThNQzZIbDBqN2doZUExakF1dWo1clYyQXFQV2hNdU9NYld0b0o4T1MzNWFGam9OYmNvTEdRcUtHZDdId2NzOStUUWNBSFdNSk9HTWhHWVVoQ0FKR2JhdmlKRmdOYUpjUWhUOTFqd1dOSmN1YUFXNVA1NXNNOEg4dkFlQ3V2N1VFREFvR09HMzhWUFRHa284RitWUzQrTEV5d24rNnFrWVg0d1RMUDN3Z3Y3OE5QT2JHWGhvTmJMeUN6cWZkV2ljMlhxWGNNM1RJR0NTRzNhUVA3VjNtYmo4T3RSa0F6QzNYcXp5Zmk1RUI2aWRZUW9mdjNaWXdIWWRKTjE5NkdWdmh6MWdCOEphcDNoVjYzMXQ3SVU3OTlOb2xmNXNCYnFzZlZBSlgrSy9URFNXUU5BckZ2K0paZUpnUnNRY0hROU9IQ1dZSE0veWxKVkM5b0s5L3hBQnAyalAvVVRHMG4rS3hNMk1XWGJtRnhxaHRuYWFBY0dCL0xNd0NxcTlJNFZBeEFGZmsrUTdtR0ZrS3hSdzhuL2U1MkU4TFpYSXlMQmpnRk9aeTBJdWJvM0o4T2ZDM1ZYSHc4TTFML2hZRDNONkFKRjJHYUc0R2tHMGczZG9odDUyQmZaZGwvaGUwcy9KQUxJMnp0aTlBbG90eFc0UDQrVFlRRVZxdlcrMUxwVDdzMW9jK0RlYW1HMUFaQ1UzbUVOTnhwaUpBaEpSR0FueEFmMmQweG1sVE13Qm1DSGFBNnZQVjgrQllYRlBkVDV1dk9rN25QajJYY2hmdTJuTHZtVnNQK2ZpSFY1ZTJQOTJNMzdna0Nhb0hYcCs2Sk9pZjk5ODJRUlIwZVVKakFJa3d3TWwxWEdwdWJtdmg5T0lDZ1NBNWM1LzcxbVc1c1UrOTdRMGN6NFFDTnhuZ1hROXJMTGM5bmR1cndxRTBkMjhON29VNUIvb3MyRENTdUNZaUVkZXluSy9YWWF5R2JicGdnUFJ6aUI4Vi90Z2Qvb2NoblU0NjlYbklRaExtWnNUWmhvY00rMXZiT3AwWkR2Tzh4WXJCb3pmTmNUY3ZNZk03TkpjSnJ2aXdCZVJQKzZlWFJraU9heUVCMkxhTTRycER6TVFvbGUxMERwckJsMmFXaFFxdUxaenRIRTBoSG1oWE1jQmpyaVpxYXNMWVhXY0FPTUxsWVUvUHBsOXhOaGRNUkg4dFhhWWtUeW95OG1EWEc4VWlZVmJvSGNKZzNBSFAxU3NZZ1A1ZTVmVmRKNko4T3lQR2Z0SHJJYXZPQVFLbXoxQ25NZUpzbFY2eDZNVGFSYnV4T0E5VDh6UkI0Z2I1Y3hya2IxNlNuM2FXOTVJclBrbU1QKzJITXBSdWlMVzdJYTc1QWhqYWVqZCt0THU1ZjgzZjN3UVZmbS9KVlNQUmpzK2h1R0Iwc1Zvd0dLRjJ6Q0hteU1idUNnTjBoMHBWSVFpSE5sYUFrZ0hnMVJ0cDBJUkpJczRmZmdSMUs3QWUwUWhkNFJuZVNwMlRYTDNjMGFVR2ZKcjYxRW12Tjk4Tk5LNkFjZUVlVWF1cXp1Y2lWZ1lWZElqN0tGYUFMMW9sNVgxYzg4Ulk0MmpMSmFmdUxCdmFtNWRFU0pNd3Q0UnQ2S1V3aXYxeHZ6eTZkRVQyUGFnbHZZRnIvZ2VhZ1FFMFdwQUVoMkJmcHB3Y0lUeVpBeThYRHlRVUFPNDV4Z1NxMUEweEJnWll1bEkvdDRuTHNidGdBQWtDMG9mNTBKTGRhRG1veGRVazNEcnBsdGZXRGRFcTNDRWNBTzRYaWpaTzdGT3NYbTZZbUM3RFZTOHNzSlkyYi9EeWhneGhURDJNQUIvelhCbnNyZWNpWEh6anFaZ0FNRk5xbm9kRDJEL0g5OWVkOHN1YmwxaFE0d0JCcmRSN3dIdC8ycis4RllyZ2V0VWlta3Z0cnp1aFB3T0NSdFNvN3NrUituWlFDc0RRSWhLYitad08rZ2xkWjd0MGFZNVBpTS9seVgwTE11WFl6VnNNSUQwaCtsWTY0WVJvWktLS0FSQzlDdWhaRmZlRktGZ3FWNHhIM1ZQNHpCdHdjdVVrV0J6b25FRElISU4xRnRBbFlNUFVPd2o5aWFvUnFTWTBRdnlUT1pUSUFPb0g1VENmTkQ2eHJYbk9aYmhNODJ5RjVmUTlMR2QyOHhLTElSTFRneEx0WUtGQ2VQWWY5cyt1QmlObFJGRFJrZ0dNWlE0TmVVdlgwd3ljZytTeThOKzUrb0x4MnRKTnFjS1FlTXJoYjQ0S2VMUHlja2dyR1VCYVV6REFBVVBMeGJXbFNMNjgzQ04wMnMyVkhxbm1EMjlaRkhZTkpIZnRKdXozYmFabGVEUW11Y3gralRpVEk0elpKWnp2U1ovVHpKWDlBS3dqQXpUTjJoQVEwSjByREl6dzgxb1BNbmh4WmtnYUJ1WkpIQlVEODA0M0x3R3dBVGJvM2xxYUJ3c3UvN2kvSFk2NEF2MVY4bUcybHEzalM0Q081RHlCQ3NBV0tCRUJGakMxa0E5VGdkbk1pU0thMGl3ejc1Ry9pZlBEeVN0Ung0djlUU01OREpBL0N3YVF3VmdudU1RWklJVEVlS1BnQ1RLQXZ6bTFIV2xwVVdDWGpBYXhXK1FKNlBuY0ZqSmdkNmpJSURSeGIzZzR2d00wYlZtQzFINDBxckhuREF5VVFUcUpnb3hiaVRJR1lnYThSRVpoMUdGVXE5QWZFTTJibHhCaktBZFU3Y0VWV1BmK3RQOFlBY2tqVS9TNkRFamVRUFJVRFd1UE0wRGlHaVRFS2tSWXcvbUZoK2tXMElhTU9FSWZsMDRYS3lVajkrM045QXZQcXBYNDJIRkFpNThyNVFlTHVQWjdBc1pxNFFreWZhZ21DRmNMS29TTFM3NDVBNk1qdWhrbm9NdDErajJCWkYzaUdjR2pIckt2TWZMZGlEb0g5MHFUTmV4a1FsUWFnVHRIbXhCNnVxSUlEVTJCdGc4Y0xHOEVuSzRNb0VOVi9RQWxpU0FZYmw1aWhIc3l3Q3F1QUozL3VEKy9UNDRBdUlzSEVIOWJ0V2RDSys4d2ozdUpiSUtDYXpBbHFwYjJzR0xJUWl2YjZtOGlxSTRWc0xqYkJYZmpuQkgrdzRDMmZocWtUMXBnZmFsZG9STWJCUUFDQWhZYWlJYjYxNG1yajR3STRMNUdPZXZDZHo5YlhMYjBDV2dINk9Dblo3UW40azcyY215dkRjQklISVJNUlEvV0JXbUJnLzdtdWJ3VmJ3VFlQRzhpWkJEc2poM1JKd2o5cjE4QytoT1Fyd2UwNFowVU1DTHRXdi9QenZmdlEzc0FsSitpQjMzWkhvam92Y09rWEhIbnJLUDlIUWdwek1ISEpWN2lMWWNNY0JhT2xQNDJTVWw0TWpnQWVCL2NrS1BKQWExL0luMEFCb01jckdUNHhoSWFKTURBSGI5S1FEeW9vRkkyZituVDkrd3lpczRBbHlWVW5uMG5hN09sNWdkNGVYdVFac2l6cGZRdFovS1B0QmsrVmc1QjkwUUhMSUhhODJLWkVMNlBmdXFTdDVKbXVncjZsL3J2UmcvZ3lMMWNoZTZOUHVUVXVtUUQ5S3RPM2VYMFhRNW93enZKbVp2TldJN1gvV085NE1yNWVFODV1cG5oQ1hMa1h0cjdWSDdMVUFqamFWL1p5RW8vN3JBb2tmNm5JNGpJUld6b2N4QmNsVU5tZ0xZalJ3b29SbW42V3JpWStSY3c1a3VPcGc5bytWTUp0K1JnM0lzMHNMRVR3TGgzNmhYb1N3RGxpL3dIS2hBMmlWL3kyZUR5cFgyanFnMWpnOHRxMmdqdHNoRmF5cGs4SlArOFc1dHU5TUJVTzlFbDUyMm1QSUllOUxNQlVZdXh4eEg5ZDhwYlFWZkIwRC95M3Y0US9mZlJuN2FjeWRWK3dQcUk2ejBhWjJyREFNLzRZenJXZm12djZBQmFsdWY3QVgxL0hBV2pDeXRNZFh3ZTMyMHN4dGJId1pDUmx4Ym9ZQ3hLWEl3d0JiOGkzMExPUWR3eWg4eWc2eHdwUGNCdk13N1FjU2hISUs2YitTWHg1U2NPaHBMRVAwNmVIa1BIQzNYWWc1aVFhZzZjTG5vNGd2ajk2TDJnT3FZTjJDTVBZVVp1bG1RU25VZGtPcEhXTTh4V3VVQjdyTis0WERIMWtMN1dwLytxZURkeGNEcFJVcnpvVk5FRDJvL0ZRSDZpMDBRSU1QSHlVTzNCaWU4ZzZSSExOOXE5cmJ2NEd4SnVOck1ib1VOZjBkWWg3UitISEhqaFBKT2p1QnBMQU9jRSt5ZzB3U1Y3NWdmWVRQVTdNQ1F4a1pseDVZMWljRU81aGdhUlJVcExIeTduZE1YK0NDK0drMFBVUFU1NUhTN2h3Tm96ZVNyNjlPTkFTbmJDVVVEUnNVOXhicnlxdHhwSEQrRDl1ZEk5SUltTUtkZ2k4N21VWW9ISVcreXRnZGRmOVh3c2FBLzM1Y3F2UFZpTzREcXgyWUdCUkI4djREcDFXbUl1OFFwcUhYRXk5QUZHWXBvbWdNdFRSN0ExOVhrckRmTk9sR244TUNReWI0UU9abjM1YW1zQ09QOEpxcXZjU3BVZmhkYStNVTlNNWdqWkVsSEREQ0UyWDZjYnprMGkxaW5tMU1VN3pRbThOeG5CZERSeVZpcEllR25UQkUxSDRsTE9vZEQxSFZ0dDRPTTRHbEMvL1Z4MGNTSFNUbXlaY3RST0JqT1V0clg3QVlKbktwN0NFS1dIdXE2bmN0bFM4VDlLdy80Zmx6OGpvUXNQZlp1K3czR1pRTkUzbXlhc2dxYkw2Z3FKUWNPb005a0srdndDNkU3bU54OXFGM1lSZUFaT3RwOFRVMnZUY0wxMXJkcElDamZvYzNlRVdHVHF5L3IzMW0wYXVKSDB4Qk8vbmIyNEY1allVWG1zR2ZOMEc0aWhNSU5XNUFnaHB1NkxPWUpNbzVseHVyM29xK0RtMWoxendmTkdCVWlvejR3dHBpekVGb2ttRXVrRlRTMXBBNzV3UXI4VEdHTVdtcjl2d08wNzBKZXFpTTRuanFjQktETzVDb0YyRHNHenBDMXY4Q1A2Ym5mWWpkd3ArbHltY3JCVU1UeEVxQkVSNGJxZEhpbE90VU9ETlAwSVo5MzhZNjlMSUtMWktiYldKenZZczRmWEJtNVJEdWdtOW16UHdNbjRpYnZEZ3VhZlp2dnFjNGRNUkxRNTBRZ0ljNU8vYWRXa2ZVV3dDbUYyNGJnOWh6VmdKRWVKY3ZWYnFZbGcxTEVySWtmSXFrdHpwdEwvM3p1UXBaaHU1QUNieHBnNXo2MFovbzl5RGxQMjhLTjkwNTZzWStTQndjT3N0WHN1RGNpY2NpWVNHQUtSdG9NelRpVUhXSVlOamlkZXlsTU5BSmFpd1Q2MGUydVAzb25ZZU11THNocWc5OVZoK1hidURtWWlPV1FSSnRoT0V4R3Via2MxU1RHU0RIRUtDaktjaTExUlVLc1lOTXdBR2lTa2I3QTY5K1F3L2NOSGp4MXU1bnBGMDRPWEFpZmJ6L082WWF5c2ZSb3RhM041Y09HTlhxMzdWV29OOTJ0czNCeXJ0dy9mSysyQkE3aE5CeXVHTmdWb0FiSHQ4aHk3Z3NFQzd0Q3dkRWIvL3ZkT1JUa3RWSlJvUm1qWU90SXM0aGxrc0c2US9wNEhaeTdOMGZxaHdobEFTbzd3bldaVURwRTV4ZnJCR0xwbk51dGhZNEVjV09KTnRIUjBQQWRtU1RWbmVyOVBXTXBVRndERUt2Ym5oREFzL1pUMXViUVM2MmVRRG1vVUhxd1hIcTdDTFN2U242aURzR0VvamJteFh3bGNaVlFGVnFJNkVDQ3hJRE9UV0hrRkRObEMxY3hRQXQrOEl6amhkQlJYZ1RUWTBtRzduRjRKK25FR29PRzlQMjg4UUdxdlg1VWVBWEV2eVZmUWdjMnpFUnNqaCswS0QyNVBsK1lQTEFGR1NKOXVHT3d3NitCck1ZMHB2V1FLNENvazdRTjdCQXpPb0VEZnVZbXp2Q1lMdUhsZWRQREtoREJNTk9NSWN0RC9zRUMwMlpNdVE1RG1TSUFCWHhyTXhqWnE3cld3dERENHpZUU40YlhSQkNLZkNZQ1dkL0o0OGo2OForUldMRk1lamlET3VRWHlXa0FGTXp0VHhRQTBPWGtRZlpzQm9BSEFoWUlyOUJrVHZyWDl4QkVNZmZoczZWM3IweE4ybXdFWWZWZW5Sam1GMytXamIva00zRnUxTVFaWXk3M2xHUXZQcFdGNVZBcFFIVVRBSFJQMWNicFJIQ0hiMVk4SUdHNzB3TVJ6Z1RFVklqTlNSWG9mazB1cCswMGlyd2tWT1dwL0tqS3NINGhTNkg5ZE9KL2NBMm1Ed1R3YXhnSHVmdFpMd1RxSW9rRjJvL0FqTUR4Y0JNbEtCRU00cWIvaU14Wno5ZERwRWVKZXFXbkJGTjR6UDVLcFlMUTdGMHZBaWtibkcwc0F2Y1BTdFJiOHhFNGRQYXMwZnVPbkhzSEpIcldoZVB1ZFJqMVNxUDBPQXd4NndRQ2V5WU5SQVhORVQ5cFE2Q1BnRVdvV256STVxZG00UXoxR2hneHdQTFdtRzJHaktRR1VlZjNlZXpJQU12WW8yRExTKzJCdmtZYmNMaEc0SFZ0QWlvUXdaOHVRUXpVUTU0K1FhUWYvd0xmd0dOSmNKYVVseC9KRmdRc2RsN21tNXhudVRKVWNuUWRzT3FqWUhqb0RhRmFKeURBSG9ybW1CYlZCVkNoYzY5SGNPSlZLWU9GMmdvYk52a0VvZ2Y2SXNwMEpTRmEra0ovQ1JCRDFWUkE3OGhTUUpEOWpBTGp6ZEh5YVB2RXppWlJHK0xSR3VwdXJuSWxpdG9qa2xzQzVCVU5lWjFVZUFPamYyQWI2Q2dsQzZtREhDbUZDbnNtbGxESVVIRXpibVg0NzVrRnlyRFoxUCtnR2d3NTBYWEM0SjRSQi84N1ZRSHdHaHRPU3JWQVRaeEtVSFk2QUFaaDR6Ykh0ajRrQmd4K0JPNjZWekFXTjk2U1hFb0dQUGowbEdsd25jNmRiUzNOa3pSbnFIb29xR0JrQWVnUzJnU3AzbkFHNERSeVp5OXUzZ1M1a0R0a1loNXB4VXgzTEowbzhKS2dsOGpBRDNHOHpBTlFrS0lGTnMvWVBMbU1Qa1htc2I2RTZ4aSttVUI0YUNCZ0xZMWkyVWo5QW1vTUJ5dW5XSnhpQ2lUOHhxNWhHek9Ga3NRY3dYaFp5ZXBhdFl6QUZCaHFxdzFrRzNkUTBKb1RKMWtzY1F0SHcvWFR0NllHQko4amtHQlBYVlAxUUQya0VTZWpvVTdleTNUc1g2S0dHNFNMeXpmVTVqdkluWkhDazJxanhIRSt2YlRDTEI5RjlBcHBpU3JNemdEelhXMFpPNWcyWVlET2ltUjR3aVIyQmNwTUJxTzZmQjVBNlpPQ01rQmtCUUxNUXJTTHdNRmljZXpvTm9LM0FxWmNvSE1aWjc1TUJjcnBsWHNzZnFnUkVZcjMxT3NFay8wQUZDTEIyNnBYZnNTeklCRURXTHd1T1c1ZGdxR2o5WklCKzlqTEVGRnFZSEZDRUNnMDNOWUlwZjNBelFZWGtjTkJvcjZZUE5aTzdkeGpwaUQvSWwwMEdzTmk4WXZqTG03ZlJUQUZRT2VTSGwvQ3FBUnUzOEp0V1hoeWV5R3RCUkNmY1RRWWdiOHRYcVd6akVsYUFBTEFRTndFQ0dIdHUxNTYyaUc2ZVZlbWZ6RFlEQnBpVjB5MHoyMW9PVzQvRmF5clZRUTRsV1B0ekVUTEZGY05lMzJhVkwxS1E2bVNBSmxveWdKdys5MllNb0s2OVNQdGc2YWwveWdBZTNMelFESENyTTNVckdpY3NOZ1NTUEpYZ2dnRStzWC82UFFiWVo1YUtqQkkrbHZpNkVab2I4Wll0TU1TbWhtd1J2ZkZ6QmdoMWY2RnJPcFhZQW9IVWhRa2dNQ2R1M0pnakZWVkdSSmJZT2owTnRLUVMrSVFFV0dCTFREZkxlODI4WEhHSXFnTVlJTUhhL1FUcWFpOEpnVFVEQW9ERGxCZ05Ob3NaaWV3TzBVdHJTUnhnMHQ3OVR4a2dQMDdJRHQwcW84WXJvakhldlZ3Q0ZtVFgzMklBSDVFS0sxd3h3R1RMQnQyMHpRRGpxMml4WklERjRwSUJNbFhuMmtLQTY3d3l1aW1Semh3TjVuWTlJRFMwN3dJbU1ZNHB1WVFCVkpiRDdLVnptZnFCSGVJMHJ3OGxheVJZT3lLS1Q5OXVRMlZPVWdvQUxEbkpBQllUUWlOeDBybkxOaVFPSkE2UWlqOWxBQnlNWEhHaWVYT01RYlNBT0IvbXhkY25BekJBKy9jWWdDUENMQldFczVRdmw4Z0xOWno4SVFQMHBGMHlBSGhiZDd5cmN3ajZ2SytPc29qVEJQUUZ3eUFYbFVkZ3doL0VZVWhhM21FdU95VEc5QU4zRmR3OEJCVXd3ZHI5ek5uRlRHNU9lR3FwZUZxSjBtSVRXVk5PZE8rRndHOHp3UGZQR1NBa0s4aEx2UXREV2FjV0tiNitvQTMwbE5Idk1NQytrS09aTWFvU1QyeDBIMXhkQWdZM0FNTTBxMTlsQU4xWWRteEVXd3pRNmNFK21Bd0FUaUs4TmpsRzFzbmFGR0RRc0s4Q29xdi9sNjZDSDdjUFFXekVwcUpKYllqZXNpRXBiNEtZRG9wa2dDRWFkbERqU2dLazcraFBHWUNZSks2Q0x3VE11U3NsTldaK2ZZczJQZE1ZZm9NQlRuWEdvSUNtNU12VnlJdExCdkFUOGR2Zks1ZUFwcmxjQXFBRHJsYW0xTlVNb0MrOG02dTlKY1ZLc2MrWURNc3hqSmRQa2YwbE9rQmlMaEowajdUbk53OVJCU1NLOUp4QVhRYm5oWVdDQS90VXAreGJXVFByY3FVRGhPL29qeG5nRXE2ZGVLQ1NhR1ZtaWFRTmxNZEI1OWNNVUFGVXlnLzNsenUwa1JkdEJ1QmF4VDA3WUpsODBkdmJ3UGMzQXZTUjY1TkRrcnNBUzNXYVgxOXVZcXN4TEdkdDVBcjI3Ung2dzFXQU9PbmJoeURwWFpyd3lXNTR4Vk00UnJZSm5kUUp1OVpzOWxidFhRREg2WThaNEhiNmphV3RWcEdPenZmRkJRTndzL29iREZDTUNJYmNWY29MTzhCTkJvRDVrUkRSSi9qU2ZLMGlBMXlWQUlaWnhOMDVKQ25WNEFRSzFHYkZBSVJxdWg1VkFVRUpERG1XcVVLVHBlRkd2WFVJZ3Y0dDlJbnloaFFCOUJHcFVLSTV4aG5nODhEV3J4amdnMjN4ZjhBQW1ZaW1Ta2k1TEdoakVNN2ZZSUFVZkNxVDgxNzVjdDQ2MTVjQTVKdnhmZklRT3ppcVY3Y1pJRkRMNVJJUWxzQTVOb2FkekdMN25vc01MZ3dsMERkMXBjaSsyK3ZpVEQ3aHY1ekxYemNQY1hmZ2llRmQybm9wSFUrV2FnWlJvbWxDQXZTOTFSS2dZZnRmTVVDZGZpTU1xWm5xVUZwK2ZVRWJ5eXN6K0NVRCtJaDhNa3RGZkhpK1hJVzh1R1FBS3FRMFdNaTYzdWg3L2R3WlpETERFb3p1eUFBSjJ1d3JibGNUd2JzdklIUUEwYmJvdWFhdkZsU29QVUxJRHhDcEJFaFJodXJjUGxTcVZUS21aQTVveVJRY21WSmxhSUNUWEFJR2JMdGFCMkNqZSsxdktvSFRtQ3Rvd2NrRmJicll1SzUvelFBY0VZZFpmc1M5OHBJQ2ViRTV0Um1BZmtQYnBjbU1uc3YvY3BCdTZnQ1pzNlBielYzQTJIR1lBZ1dHTnpCUW10T3cwTzZZMWk5QnpSY2VJYzhQZ05PVWFHaytPZDQrVklDMXJYM2tIb0VpQUlzYjVob21RakFBNURBYVlyWUtPc002WU9tbU5xZS91QTEweTAwc001LzgrcEkyeURIVVhETEFzUFlGY0VSeXFmOXdsYkxVdk5nUVlOcG1BSWZlS1lUM3NGQ1U2QndZd1o5TEFFN0RsU0twQzN2ZkZqUWdSamhRbWh4OTdhSGhLRUhORng2aHUySXVheXY0WlgvelVLcUEyZUlwckl5U1g0M0l2SklCdWx0cit0RWxuYlU5STBUeUp4TGd6dzFCRVFyVHNJWGNMbWhqUzliY0dTQTFkUUZaRldsZzIxa3FVcVVzZU1hYkFYYmJES0JHUzVyMnlVSnpZaGQvcFFNczFNbXhXSEN6NXc2ZmhVY0VCVXJUelBIa01MbXFBalZIRmhHSzdMdVl5eHlkek01OXVuMG9XY05idlVlNCtHbzgrUmVHSUtXK1JUWUx5OXhrZ0Q4M0JTY2JzL1U5STFYeGxxYTFIdWlMZ3FaT1Y3c3ZyM2hPN2ljN2FEa3JNZ0dRTitQOWk2R0lXRDZyNnFKcHNCcHplUDlxRjNENEFCaWNrZzBqaDNJbmpoRlcrcmNxVnZTSkhZK0lYU2RxS0Z0M0YzTTVkamF6MjRkS3RRcXRNZ1g4a2dIWVdxWmdhMTA2VWY2UUFiRFZ1K29NQ2pibWd5T3A2RnVWcGgyNVl6NC95UUJVbFJZSXRzbFVaV1dXaW9tMDhPdm0zbXNkRFVTOVpJREVUNDVHcU9LamRRUHdrYit5QTh3YmpYTll1NzhNQTZTQkpvNFI5dktscDJVQkVrL3MrRGREUE1MZ0NGTGVlUTd6T1Z1eHM3bDlpQU1FNVlCVm4xS3YvQ1VEb0xuTnAxQUNkL0tmTkh2RUh6TEFhWFBMSFp4RVEzQWFONmhZc01xM3RCQkdaNENzdkdITEs4UFNNQ0owcDZHY0d6ODgzK2ZqNEsyNXdRQmZBZUZWbk1Kd0pJOWh5b1diVWNFSWhwSWdkT2pJWi9yTDhJNUsrbTVnaEluU1BRYUhzVFNxbDRpamQ0ZVIvS1pzM1huVmpsN001VWlJZmZzUWQ1TUhydWZRaXpMUzZCY01FQTBIcTIxZ1poTDRVd2JZTDI4RmhLUmxmRFRSaXNwRkRFNlpFczlNRjU1dmpRaDVMcTllZTRlQ2oxRXp6RkpSaHFnMS9XdzFBeFJGV2xoWDhBWDFxMUdtYm9BWWo5dTRBTXUxQlZqSXlHZ0haWisxTWFoMEVnRnJjSmZrTUVDSnZDNjAyZkNKQUxBYXlIZU1idWtQTHVieTlQWWhxbFhRZ0I4ZVVzUmlEZmdGQTNqalFRYUVaS3NaNE9PQ0FSWWxBMlRXMitzaFliSFhheHFYMVB5Vm1UWFhTSFp2NjZ3ME1FQ0VWT1R5eXIwZWc5SW9KakpFemZQTVpyUFl2UWc4REFGSi9LUmhGUjgwOVlJbHd2b0pNZ2cxMEFrVkM5cHRGQllFREZ5QktkYTJkeEE4a2RIQUxTUE5BcUs4aUFFaXY5d1YxSk5HdXRLZ2RQTVFyQzRlSkdJUlVsRk1yR0NBcHJsZ2dDcjRLeGhnWGpabVorUUJqL292a29Ta3lDMnkzbVp1Q3F3amtiZ2kxendRcmY3MTRnV0d0bGxzQ090R0p2bmc4Z3E4QkpOUWVNRVZpQW4raWt6VDJWaFppYVFrYW90ZU5rWFZMY2NLaVFVZUVFTDZKOWhBQmFvUVZ4MXd5NW5pTjBsNWJVREFiZ3dKdTA4T1U3N0E0U1h3UHNRMm8wa1hNb1NNQnBUZmIrbWJRTGptenc1dFIxRStERXNGZjRGVWw1ckdrZTVqZEdWelFxN3FYdWdBR3ord3FsUHo1WUR6QncrbmJvWFJqc1FWUm9DUW01bnVneUtkTmRoZkh2TnZLenBicHVBZ0JwUkpLTHpnaW9pSi9LVS9RTEZzVmlzdVNmbDZ6MEFMNGlkUFFNWGNPeDc0TmpvWVVOa3A0ZDhFbzAremJZRGkwNXZaS2FBc09PeWRnR2hIQ0g5OUVkdE1JTFF5QUdNNExXTWxkTHNJNHJ4OXlDTzh3ZVFaQ1o3Sm9uTFVuMEFlMjM4OFNleHQvbWNIQVhxTFJ0S29keVVPYk8ydW1TU0VBeDQvY05oMUswcEtGdCtsU2t6OEtnVENmZjdDMmlvTkFJWDRHd0V4VFBKUnBPRFlLTDJZaEVJNnlDUVAvZ3MvNnZZUytYODhRd0p4RldBQlRFYWRuSjRSQUhJYlRlZHI1Z2NBa2FYSEVrQXMwYWJFaENNWEJyS1BISUZ6enVjZTQvVzRFa1NhSWc0SFM2Wkw3ZUNjWitOcTFqM2VQalI5SkNZWVVTOWcvdmpsRU5wUzA5RG1RT0pzVzA4eFhuY3piYU1mZ0hnTXhIWU1mL1ZEeDVXNmxhMXZURndoL1V4azRjQlhyb0Q4cFFOSktWb09xZ3p6eWNpUktUZzQvQ2xYZ1hWN2oxK1F1WFdiY2lieUFPTGFDSzJ6ZUV1OUhFMnVSd29oWkJieEhzc1FrbS9GQmQ2UjE4R3NLdG1adHc3TWI3Qm9BcmRWUGhsaUd2TEhkT1ZoenJNamFnZjdQS3RuM2Z2dFE4NXNXSXpBZW0vOFpTdE5qcnF0Vm1pWGM0UXB4aW1TMkNpYjluRkFLT2xKQ3FZeFlMS0FlbzZRcVNIV01qY0ZaeEhHSDJ5UnVUaVVhdjRMZFMzdGgwTVhwVG50cEFNVGxNdXJ6OGVsWjV3NEZjdXNaUWZDQ3Z6dTlIckhXcXhUVGo0N1NBZ0JZQkxBbHF5U2g1bmh3SHVRMThCSmpWa0JkRFlDTllVMHVWeXBkdWU1bGR6RXZpUndXOWZJWVJZSklxUTJWOXI5WFNia3NZVW5mNDF2SHlKWGs4bmpsNmZ6S0VkZHBvNG5VYm1ZSTlCTVpqak9sdHJKTnc2UU9wbWtnQXFOai93N3RSdEVzREUzUlRscHdBRkJBMERjQVY3bW9wbTVLcEM1STFuMHhUcE9NeXl2UEVBcGpvd1RKbUk5YlJHVHZTRkZDUDBBTDJCTVJxUUhDVS8ycGtUa0ltTkRybUtHaWVaOHhSc1VwSFpmNjVjajFFTmhSZUlLVDVUb1RyWU44OTRPa0JJN2lnUVJVcHU2OXY2T1dFNG1RYWxtWFhGb1ZrM0lJbUdJN2k2Z2NQQmtiam0vYzV6SGRhS1FIUFFwOGgzbG1YV2VFQjY0VEZJZ0xaWmlMbmVHV2FadWRURnBrZ1lZVmFRdjRLS1oyUzNnNGtwRjdna2QzMGM3ZWVZSG5ndzlmengrTXluVk05T3hQYmdTcDNvanUwQkNZbEpJUWs5NkpqZDJnMjNxc2FBL014eXdFSFdTMnYwejhtemZVUG1XMVZMWDBIWWViblptdm9ZdE9DcGo0cG5tOS9MTUEzZVJrSWRaZW56V2JleDNKT2twWjZvbUg0cDhJWkZXeW5PcGpQR1ZIT2FVSEVhUG1TY0k4UWtoWi9xcDB6cFBpQitZVlVrSzVFQXE0OHgyWWd1cmFkY1hrK2FZTk5oNkZXcHRlOHZjV3VpWnk5aks2Zmp6N1V5NTVJRkF6My9oYXU0Q21YQkMxU3U1WCtSdUJBbUpTZ01KTGJIRmtkT0QrUTF5Sjd0M1RMejJkQUU1SXFrZGFNaE1PNjFLSFZ6YVNzdForb1FYaWcyQUZjd3pnY1B6RFVpbHhRTmtscDZ3RGtTQ0g4K05Sa2s2WTlvZTV2aXlGVWtIblFBaURpVTVRSWVaNXBuY2hURWpSK29nT2grMDhSNTFuaEJ0NVMwWVc1TGJjVGtWaEtKcXJXa3RMaVpOUVFOR0EzL1RJQUlEeGpsM21vWWlOMUFQcDZ1djFVOWJIQWowUFBsc3BKa29tSENDTTNyWHE3TGNKMmlVaVMyRVZzeWhRSlQ0WWs0R2lGVENocW5GazV6VUVOaXV5RlFNNENScU13REx4NGp2b0lrcVAwd1pPejhRenExaTUwNmtFVlgwVE9oejRvUm1ka1JTdzZSV3lzeVo1UXZKS2JJQzNwTXk0SWUwYnpmUUJ0N0RmRGJuMEVHWWNlaUgzNlBNRXdKQ0VieU9XL2cxWVpERFp4V2JhNmdBclVtajMwSWFZS0NaQUlXdkp2MXBhMXE2cFpjNGU2WVgyZERFMlBRVFBjL29kMVJTWXNJSnptaFlqN1BPeFRKSzZ4a05vUGZZOUdKK0E1NHBpZzVZQWxJN1VOcFZ4Wk5JclZVd1FKTG9nZ0dla1BsRUhHTmdVWmkzSExtSlBBeUFMWHhwaHBEU1F6QXhIR2ttTVJwdVNZM3lMT0pyNlYvd0tkS2JHMjZOZVFUc0NCSkNCT0tMNys0NnlNYVNBRG9NRlVCazVBbmgyeFczU0MvQi9ocWhzUDZmVk9GOHJDYk5Fa21wQU54RmVBQkZPQmVBTGdObktBRjAwSkRWZ3RQVmt6OHhnVVdCbmo5dDNNbDhjS3QvNW4yQWs1L1I4TkM2UnBIWXdrUXMxV3ZtTitoMHNSL0dDdElGSEg3ZFoxNk45NUlCTXJWV01vQ1RTRHJiU3dBRTFHcFhlUVFOdVVrenRWSDFUbWFPdzd3Y3JUVkdNb1pSeDRCYWtNaG16QXY3bnBJNTBrakl3SkYyd0lQeEVLaTZMT1VjZ2lRcmxsYVZRMFVpNW1Qa0NhRjhpdWdpakdEZVl1bEJWZHJGeXZ6SVFBWXRYcGVvS2lKMGlxV2FzQmxieEpjbnBUOXZjdWl2bVNjNVNjM3BhbWw1eVJaQ0txRG5UWkE1NlBkdzBFQk55Qm9QMFlNSG1RV2pBUTkvZ2x4SFlndmJwTWNHRzNrc1Zsd2VzVUZYb0xRV01vTVJYUWF5SEs1TXJaVU1jQWFKME5tV0FKQ25nM2tWRTJBU3dGa1dhK2ZkZndxWVY5TVFXMGIvczlycmV6N0dTZ3RDRjR5Wkh4TWl3SEZyR3FWU0lBUk9TSktsQXRDNjI2VThZWTZ4UFIreklGbWVFSytqd0N6S2xLSGtMVS9IQXBvNG9hQXl5cXhrUnR1Q0FRemRMUEVCNnFydk1RV09wZHZHd2dDdklWa2NWakxqWk5hUlFJTENTRVd4YzErdDVYbHlRem1Wd1BBNm53SEhZWWcyWldiSEhDTVVzWkZEUWVlaXUzZkJaMllMNS84b0ErVndGYW0xZ2dGNlNnenhWV0ZnYWdhd1pBb0FsQjRpS3FpT25UWnNZQW56WWtuSWFVU2dmSHhnUG9ZNnpVd1NFRkJjQkdEMzlRSURJRFh6Q0pndDBvOVFCcFVNVUJsc0dlVE1QQ0h1UTZKbWtOVUw5SmtxY2poVis2cmQ0aFpNMU1pYzFza0F0aHZxZVlrRzFnZkRiWldDdWhaMXFOdWY2SFVkMGQ4bmlrN0VSV21YN3FjWjdXM3AxeG1FMm1IVnpFVGVUanA4dFlSN1FieTZpT1ZLak9oSS9TUEQwTXhKUHNTTHRRTGNSN3RJclJVTTBLaHpGY01sdkZJeFFOU3RVVUFwVmlUWURLNHlBS2QyRmtYaUw3bDQzaERiV1NEaklUWXhSem56WXEvU1c1VjVCQ3pqc0VKdW9ScGduYXNZQUI2eXJXWE1Kd05nbUFlUmo0VTdRTnhjSXlkTmZydGFQbG9oUVVqWFVaalk3WTJnTFdacEt5NzBWcVFsNGlNektFdmFpcm85ZDJHbTJJY2FuMFVlc0poYXIyblR3TjU3bXJwcGdVWUN3NkE3NFY2UStFM1RMaUlNUXJZamtZV1Fsd2lIYzgrRFhFSUM5QmVOQmpuVFExY3hRRmF1RWowZ2NqaGNZNEFDNXJYZ1dSN3ZOUitnRUxDajNFS25IN0NXUkpUYVFlOXFCelBVaWxzb2J1czR5anRkZmg4cWhLQjFtelo2SW05MUxFdU1aV1JTSUY0VjIwUkNaYjJNOVJxTUFXR0V0WUlMMTd4WEZRdEZBU2Q1V282RGw3VW9rOG1NYVR1RFl0OFBOZDczWnVoRlpFaUtVaFNYZ3VXbGp1bVZSY2Z6VjJidjlmck12ODBBWjBXdzh2R09zVUdhcVo3SHd0Y000QXNTQ241SHRNWTFCa2lZRnptcEtJM2ZYVlZsQVpGT2NpS2RpS0hnOXVERVpkWURNYzVNR0xXa0dwS2ovRlR1YTNwemRETzltRmNhMFh0azRmWldkQ052VVZiTUVacDRyUk5xNFgyVDljNEFtWkFIZ2FMTWxSQVpGeVIyS05LMFJkVzRCUXN4b1RlVWUvUlNoSkFCRnNBSFhES0EyWjNBcm4rTkFaVCt2ZzFONjBDbnkxajROZ1BrZ3JRTmRORDJLZ01VTUM4Q1A4QUFoaWlyR01EVHlXRnJNUmo0OW1ESlpkYUdjNEZkWEJRMk9yTmJkZTA2UzBBZjNRMjF1SEdSQkNNS3QwOTl5V0V2Q1JYNklzcjdIYmdDTW1EWEZpN053ZGdxNUF0cDJ6U3RqQXZ6OVR5aVJ5UGp6UnF4dWl3K3BXTUQ1UjY5bjRVb0hjUVNFQXhnaFpRMXZ0REJyMytMQVFyNmwzYUFMdTU2Z3dFb0JsOG43TDdCQUFuellyeFhNSUFzMDVsT1ltYVlQNkpVclNJVmpFbWJXR2FiTlNyTHNyYjBlNmdoSE9VeVQ4Z242clkxaDhnZTRXZ1o2YzNpejRTWUxaQWFRM3NSeTR0ZVZGMVVRSXpIcUlRV0RySFlrQUV3cW9RdWJzTUFGZXYxWUtjSTlxcG9McXBLaXJBSTY1dXZqbWZEajJYUWFDaUJLWmFKb1piUkpQajFyekdBRGcwTmtaVWw4RGNZZ04wM0dhQ3RBbTRLQnFEMExITWhvcEQ4d21yU1FmWVNlcXNxdy9rOEVJSXdkcHdRT09rVzlYZnQ0TEZZdm5veTlzd2ZrK0ZuMEZseXhZb2dYSGkwR012THVZWWJqcmpPT2JSU1BobGk4UnlXaGh4VlhieFlxd2JuSXJ5NjA4bng4RnhaUFoyKzBrc0c4TkF6OUxvOG5JcHU2aFBMZk8xRjFyYlJTQzdYcU9DL3lBQUtxV1BXNU5NZk1vQTg3R2NNa0VrZ1BPWTdHWURCdnNTSmVPRlZSYW11NXd0S3pnS203TkMxbEpLUWtkcTlpMVJGOFdaQ0N4OW1pekd6UzZVTjNIbVJPRGJ0emJVdThibXJxSE9kd2g2amVwMEJ0Smw1WlFJbkFGUjdIdzk2R0JnSUdneUEwTE1WZTUwQjFJeFE1ckI2WC9vb291aDVyMkZSeTcvRUFKOGZCNWtxRkxtL3lRQ09sWjM4UWdlSUpCQUI3a29Hc0Zzd01XRlVHZGZKdXhwRS9qbkh1K3NITStzZEtQMlNHMzVkSWloU1M5YTh3cGs5dEV5Z1FyWkE0MnFrSHhvUWpLUkpLZXdMQm5pN3VnVEVoc0hDL21uTUQ5MVN5ekc2RWhFWnQ3U1R5S0VMMk1MVXdWSTZMRllWbEhiTHY4UUFoOFlXMGUzdkxnRVowTm50d283SzBiOWtnRWdDRWZET05nTkVuYmpNYkREc2h1eHRveXQ2Ri9rdVJDbTZEdDB2MDZXUnQ5alk2MEtFclFva2p6d0RIeGZqVnpBQVZUaGtTNm1WUUdLdEZ0SlNBaURob2lFLy9RWlFrQUVSUWU5MUJoakRPSkVGTnNNWjlKY1lRS2hnU1pmTStmVWJEQkR5U05VY0djUGJkb0FFRE5QZ2M2cVhnTVdjSEFBWjU1amJCRlM4MUF5UVExOXVpNjR6UUlIc2NOWFFXemxRMlZzeFFEL2F6eGdnMXFlVjZuRGNCcm9XWVFXRWkvTCt4TzJMRUE4ZGdPaVl3eHk5TnhuQXZSa3FWdzRvQW9DWWdwc013SFZPN0NTOVN4RW1mSGd4WE5CNmFkRDlOUU9RbTduUlNRdllGUVlnekN2eHdxZEtDZFJybVkrN1drK0p2LzlmTWNBMkdjQjdlOTRHNVV5SjNtQUF3RnVqZFc0dUFlOVpaeHZWdEp0YVg5QjBSWU5rQUw2UUFrS1RBWnhZNkwzTkFPN1BsRWxqQ2NtRi9nNU10WHp6bzVwVTlpUVJHVG1PaEJycUp1Uml1TENob3QvcU54aGdYSmc2MGdaK2xRR1k4aUFTUVpZTU1BSjBVVDYrblhxbWhERkN5cHJTWTJMSEZQdlNORHJNQkRhWE9nQ3Q0MXh2VnZ3UFQrUVdscjBzRkJxa1hvMmtkWFlyUUdsS1lWLzRBdHlWQnpzT2w5SDhFcWl0eVFBY1FHd2puQUZpeUVhd0pOMWtBT0lTdEZ5NWVITnhGak5qVVFKQkVqdXAwcE00WHhDUDZOc1lzdXBWVXpEVmdKOHhnS2ZlY1F4NkJaUEtzcnpKQUV4NWtOak9aQUI0b0FCZXhiRWJFcURZQlF3ZFNrK0FMYnZCL0plN2dDRnhsZ2xDd1FjcVRXZ0tESmkrYmhsUSs0VGJOVzRaTzByL2VROGcwNFNIbTdBbi9kSnErQ25hR1N2a3Z2Tytja1BWWnJHOUxQQzl1elFrNUpzaG1UbnM3bGVoaThRbHNJUzlzOGxwSEtab1VKVU00TnZiZ3lvVm9WZmdWTExxNGxKZ2puWlFBOUpIaUxXUHVNTmdBTGMvYkdwM0IwdE4xV1Y1alFFNGNJbnVyaGhBb1lza2FiSDlndlNtMUU4L3FBclV6SDd2Q1RWbDlhbmNFV2tIZ1BqRGM4TU9JT1JERmd5WUFvM1VXS3VKK0o1SFhuME9xbERLZllkSzZSVDJZUW5jdk5OdmdEek9WazE3Yk9vc00yZ3NEcFJDQ0tMU1hwZ1NvUnFtVjBYMEJlMDllRUx1U3diNCtpNUwySU9ra1ZYUVRDY0xuNnUwblpwN3dRZ1o5dWs1T3RmdXN5ZXA1YWxXOHlaTitqdXNmWVk3aEl0SXJ3OEw1TExHU1RFU3BsMldWM01GMTM2ZzViNWtBSTBwaDNqSEVPY3VRQ1ZueURQRFNES0pWWnI4MUxWQ0hjSWNrbXVNcDB1QWhSb1Q0R3NNeUY1aXV4SHA0ZFk5RzMxUWlxemxEMXo0aGlzVFpuQUd5ZFJLa0NuUysxUGlLLzBOM1U0TDgwSk9KWVBYemdRTjRrcDJrKzlpYjhNSmxnSTNHWUNkSm1rd3d2UlEwSm5oM2tEem50REJHSGhnRTlvN2RIclVUcEJhamI2ZEFYc1JaVUFZS1hHSHNFVVdQb2dsQ3lJOUU1WEdncEoxV1Y0a2k2YmdpY3lCSlFPb1kyNlZJRjhNRzZhNkNKWjVadUR3b0NjWUNLdE1OV0pEczI0aTdGTi9rY3Rsa2gwODJxRFVXUkMvZ0xMRjZMWFIxMTdUUlFENERoOS9SdCtGc09lMElnTmdKaVNRR0NXcGVGK1FaZDRMREd2cFRvd1l3ckVGbjFodlN0aE5JWEJaZ01kRDgrRzRaS2tDbXMvcHpzeVFxeUtpbUlTa2o5b0x2enU0TkVpOUJhblpxN0daaEpFNkdPaCtDclF3bzk4M0FKVWd6RjZiWVNRUU1abGxlV2RXTDhEbWFlWU9MUmxnM3N3aFR2dURjcXB6UGtLajlrcmVHRGk2Q0tRMzRuOUg3STRFTm80UlhuUDBHVyswckJ5MGF3Yi9SS0F0SEkzcStkMVNBYk1KTkovN2hvdjVMSElHWmNrOTBDQ0J4RlpOUGIzTXUxVmdXTXVBZ293aU5vODBlMFBDTG11QmUySmVUUzloejFxV3JLem9xUm95NkZJNXdEQUZFeElTck9wNDFNbXpnMHRCYXZ3QWRKaTlHNi9CZk8rNFE3VVBFUzJNS0N1ck96MG1vaFQxZms4T2RJcEt2MkNBOUFQWnFsQXdnQlllbzNNdTROQW8zRVczMzVuZzlVaGcwZXVadnBFSWdFazNYUHdtbVFJanpORm4yZnBUcmJNNE1HTGpvdy9oUjR2VXllUDhBRlZjald6RGRab1ZNNmpJMTM5c29ZcUJrTFE0RTV6YlRRd3J2ZDFvaVNQZ1docWRqQjVwQ1Z6R3dOWWw3SzNtZGFScVFQT3c2Nnp4cmkyd042eUpIc2k1SVBVTG9NUHMxZXZScG83SkFqcWNGQjRUSmp6MUk0aTloVUNROW5oZjRkVHVvR1JreVlkZ2dLWnBzSFJ4OXNaVXovbDR0a2lNQ0tVeXFMeG5xbUdSMk8wUTNhNkdFQ01zalpPQ0VlQXRiRGVoVWEzZTRmTVRBVk9jUUNDSzNCaTkrM0lHWmI3K1l3dFZITFZLOVE1S2xnSXF1OGt5K1pTbER2angzcFN3SVhBekNMcFZ3aDZJMVdOQjY2U2Y5QWEwTWVxRkg0bEgxUmJJdVpyVTdCVnNHb3ZGNHpZSllMVnlyNEh4aURMNGV6Qzl3ZFpRYWhnbE9Fd0hZRDFSVndGOUpVTUE0amxuTHozL2lCYm1mUFRRY25ENW0wb3FqS2VWY2o1NkRYSU84N1Boa3dzNDFvUm5XN1hnV21kaFZoUHRmUS9FOXpQUlZnN2lJK0RvMWF2YVhwbEJZNGkwTnBBWU83YUFkcjhGV1JoV2pOOHVTeFdadHJub1ZjaGdDbHlEUVFBNmt5WHN2Zllpa1pNVlZRMU50M0g0L3FOZkVIaFVucStDMmttOVNkeXBRbXFSWFlEalFBZzdJS3FCOGNBdzZqOFFwWkNESnJLOGVqSkx3T2tTa0lsTmRYQ0lrRUxqN09YcEorSUZZajRxOGFLMi94dkg4NTQ0RXVrRzFMRHNkdFM2dExKN2hoWTZDM28zS0pwdWVHbjJ2aWhvRjUwNlRnNDUxRHNZdVBwME1ZUFFEN0lVUUdMZ2tJSXNMTzJ2Z2hOVjlvblh6OVZTRDR6TFh2ekdJZjdFUFZuUUh3OG1Xb3Rpb1VRUmc5QTRQU1REMjV1TERGVFhQV1Z5RjBMY2xkUUY3alE0M3BjWFQyTEJ1VVRFbThwUnp6R0R1QzBxTGJxREEycUtSWVB1aUZBbDBrTmI0djJGalh6Mllwb1NNUlR6TVVtdFlHRG4yckhLcUtPTnNuWnJQemxmbVlXamhHNFFtb2pmUW1lSlljZUI2R1Vmenc1TTQ0WklVdWtKWXBwOFBDbjk4OVhrZWdEc2owb3VvTG0xOFNpUEI2WjE0eHlHZnZZYTgra1JITExKcUorVnFJVGsxU1VIWVpQclBhYnA1bVI0RXdJY241NFV3MDhrakZaeHBzNkE2dS9raThTZGdsU0VEbFBCTExMRTZkbk16cUliUnYwWDI2bHdWdXJXUnZGQzJLWmF4UkRIcUFPUWpwWjQvM3BTKzFSL3FiOFIyTUFsaHBHTnA4ZVNoaU5nWm1NQS9oYlNqakdjZVpGbXdRZ285M3ZrYTVCZUVMUk8yUkFvNzcydUlJRm1mSUJRc0g1ZkZ4NzRHZU9seU5JWnBpQm1tNHN1TkplaGluck5oZDhablloaWVYMVZGRnJMRCtpY2laeHlkbnc3UlNkS3ZGd0p2d21TMU5CUnJlOU5KQXlyT0dQWElKMFdNNjJrTG5Hbkl3U3NvLzZIYlRFWkhPdXhtTFE5TlQzZFFDTWMzRlBqbjZzaXRwYXg2ZzVMeS8yOWZramtQdUFrZmVmTUlhbEVmbU8yY2dKVHlqSFZCWWJ4NmJXQXkrZVNiQU5jSkM2Sms4QnNYTFloWlVvbzk4dHJadHpsZ2xjbmJZRStjS1JZZ2Y3bWNNWTNSN1JTTTZSMjhwSUtsNjREb2J5MGlQUHRpZllNTE9kTDNiZlNHYTlmd09hSWhBVGxZbm5NOWJHZ0tGZFQ0b3N0WlN1QSs2SldPeEptbjBIb0RMc0VUZEZMM0dudWV4bkZ2RzdVMUVMalU5YWxVeTk1R091aU5vSmFNZ2YwcTVNQk5xNXhLR0V6MzRtMFdMbXlsN1BWcDJZNXlCeEdiWVRMb3hlaWJPczFsSXpnV0hRSUFhYUc3bXBKQ2VYR2FjeTRlK1FNeTdSTjBBaEQyVWl5a0M0MkFkMUYxOFhneXpMM1pzaG15NXViMjVkeW93TG9iMjcrSVZ1SlB5U0VXUXlMUERRYVltUEs0dUZRa0ZORFJuQjhVbFJiWUJCT003cWtaWW9DZGRReDAzRUdvVXViTzZZVFc2Y0wzR2taeGR4bkxLYmFHTUsyR3hDblRLV0x3c3BXeVA2VkRNQ2NKREpwN2pQL0VSVmlUdW9IOXVac0xSTVRFaHM2NURBU0x1K0dHWmhGdWxGRGlXQUJuSVE1RWtodk14K1ZVRzRhV3JBRHBTU2RaT0sySVJkSW01WWt5eGtXQnREbGdRSW1yRU9DcWxLbUluT29kaEFHakJaeGlIVG93TkpFNEFHZXhFcXFnQ1RRQ0VXWUxPanNXMlNndGZCOW0xa0pLeWdUT2krTHd2TDlUeTh3UThzeDB6eDd6UFFtVE9JTEpwZk9RRnBFTVNNNGxoR1RIRUxVUXdhZWljRFhnR2tEb1dRc0JDVlFCWlMycDRjeUE5b3A4MTlrOXZ2WVR6UC9nZzB5c2FFZG11RDhtZjVFSFZtRjhKaGR6a3ZSOWh3Q0hKR1lSR2dtbEZzQlZwRnhGNUtVeEdMcVJrY0VmU096aEpPbGFZd3VJV0RvWVZHa2gwWUxxbHBzRXpxam5PVm9Fb2ZWcEREakVESUVLbUMwUE9qampMa29oM0JQU0NpYVNIQUZnK050OGhKTngya2FGdkhsZFFtd0xQd3E2ZnhndVdIVUcxZmNLUjFvR2RXUXdiRnBQZ1ZiQTNtRHg3bEptb3lMNldaS29QWWJqS1hNZ2JqRW1McFpqZHRFbjYyMTJxbkF3aXR1TERLaURDN2dmdlRORVVmZUJBVFlHS0J2RUVTYW13bmxWbTl5Wk56bERNdmtyWmlZbWRuRksyV0Nsb0ZPOFFJWjRnazJmSFpIbWQ5clBZWmw4NURFZ2NyTWlHYnBhb2lOZTAxc0hBUEVHa0ROREtEK1hxVG9iOWJDaFJFeDY2R2lWdTRsZldMalVnY1k5T1I5b1FPTUdSeHJ2bEpQdjF1VUFGSGNxWWV3WmZYazRhUXNhVUMyTHV2TUlwVWZCQkVZRi80YUdqRHZWTGdZdUdHYmVVK1pLdFZnY3Fnb1hKWDBodDVKS1VlUncxZzYrVCsrWGhScjFiNEZvNzhEV2hZUVlEcDI1Q29NWlJsMVVzYXVlSVg3UHZBRUltZDVmV1IyUVdwbmpMTHd3UUVUa0xuTkxOcGxoNkJIV1RMbmxFWDdVMEJKY05rOEVaU3pqR2dHTnM2QkVWWEovZ0ZpZitsRVEvSmt6dEd6R0s2aldGWUVpeXVoRWRyT0lQYlVEVXJVV3hGRU1ZeHlZdVdnRElzaVVFWDk5SklCbksydFdBQ0hsUkhkZldYcDBCY1FFWEpuSURmZVcvbUpkM25GbU5wOHFqSllML3JLUjRlQUFJM0RZNzR1UTFub1VaQk9VQzJXTFVJTDUxamdFSE5udmtTTy9nMEdBSlBoMlFPTWNLOEowVHp6YWFueEFXZzlhRUJGU1FnZFIveTc2bVY1ZEVobmVqZURPUGpNQXNCWVJvSHRxNUw5b3V1ZlBkZ3lreWV2TlVWdEhSd2ZGSjBNaXdwaGw1QkRlbHNpckRZLy93WURoRURXd3ZlNUJCUnNMY2diaG03alBiaUlXQWdNblppeUJHdzk2WDBVSTgvcXN5aFVkbWdXVmZTZnpuUHBOVFp5U0E2bVN4bk01djdTZ1FtWVRrRVBWVVhoYThEbFhEM0plbTBHeUlodGdQbEQrZ3ptWGtUWnArVmlydmVFS3pjUDhwWEJBQlpaT2VkVjNDOWpsaGx4TWhsNndRQnlBa21HUEV3WmJEMTVabEVjSFBSS1lBcmVlY2J5d1FOWnkwb080TnN6SFRsMUE2NCtydGV0R0hjV3BLNHhTK2NvOTBMUEV6SitDUHN2V2dncFZRS1RFU093UkRDU1ZSeUx1WVBCRWxISlB1L0M4SnJQaWdGTTdTU3NpekFiQm5rTmsyWTBQVjZwZWIvekJna0FWYnhyOFMwM0pRQVZYcVUvZHIyTi91RkJUQ1JrTXhqMExjSmpuZ2REQW96dzd4cCs3ekwybFhVRWtQby9xbStuSkphbGxKQW1NU3pNMkc4OVdoZEw3cGNSc0E3RWVTMUtBSmV6bzl2Tk5OV2Nwd2xFeE90V0NOTjJpRzhxZ2NSd1FrK25BTzhmWEwzTVdNeU9jTXU2WkVUZ3NiWEpMWklCc3B4Q1VWSXYwVmZ0dUZYS09hb29rZG5lV0tlTS83OWE4eDZkWFNZQnA1bDZHWmtSYmpPQW5VSXIxbnl1U3FMTUJHTkFUa3ZwR2ZRWHZaN0pmejlZNndEQ0Y0U2RMazlaYUE0bk1pTFk5U2lHbDgyZE5yYm5uWmJsL3JuWjZubWNPY2NBVnR4dUZBL085WEVnZGdPbVM2dm5hVkdTNWpvRFVBRDIraXFQc3hJR3JOWDRCdXc3Q0IyUEdnaG9nZEpBWU1sS043YU50SklCb3ZqTDJlSEVXQUd5K3V6VkFQQ0ppNHVudDdMcVFrMnp5NXIzU0NFY1pRQ1lkRFJwZnBzQlNPTlZUMmtKWXNxOUsrbUcwb2J5RWl2OHk0UDMxUzZBS3dQOGxVekJGMDk0YTljWlF6cTl4UUlSVHA2UmNGcldJNFJ4am5TR25kV0dhVEtxQ2dkeUwyUXhjRDJrU1ZCMXJ4YWI4ZVFiRE9EQlRvYS9uanRDQ0NZY2JKWUJxTFhRLzZxQ2FlSmJFcldpclZ3Q09ObmxQQytGR3pYUUdHUi9qUUVxOEExN2F3YTRXdk4rbzk3ZC9ETDRmSC9GQUx3WmFDeU1KaXc2a3MyUHZtNFZmeTZmcjZUZldWck0zWndqV3RvQkxQQnBpRVR5cGFZSEdIY1o1OHc5cDZEQkQ0MFN6YWR6MEFjaVdJM0ZaQTJPZ1Y3ZVBWZWxROGYzakQ1YndHN2d0Z1p5RENLbElhUDRMZGNaNEozaGpvdEdTZTMySVVzckN3L0JlUmZsQWJPR01Wc05pTzgzSW1zckNWQUlveERxVGhPQWhaSUIycVRtMkJFWDBGdFZESEMxNXYyNFhRdHF0djh0QnVBazM1aytoNXlOQ3RYTjlWZVpRUmxBeEJ0U3JFa0hhZWxHS21nTktGek5HT21TQVhMa3lUVU9nLzdRM2ViT0JmMjBQaXN6MGhZTUVIVmo3Q1NJdkM0c01IMk5nYVNnL2hXYXBtWUFvcE9BdnhhMkpQNGFyZ0J0d2dTajgwWEp3MmprTElJT0xuU0EySyt2ZlFWZ2RrT2Vkb3NCNnFybkxDVlI5RjZ0ZVQvK2cycHd3d3M0MGR3WWdIN3VUb3NCVmlNcWdVcXpZSUQwQmV5Z0ovYldiZ2VyR2FDU0FCbU1qQjNmd0ZVOXB3L2taSm1SbGhPYURBQzhZZHdLSGdwWTV0YVJwZWlQR0lEU3RNWmZFeUZGRTA2QnlYU2pVWmF2ZzRtVkVnZGdtcG9Cc3JJeU5FYjZFNUltdjE0QzdndDQrQ3BvVnRXOC8yTUdBRURxL0FjU1FBZldsY0Jtb09UajdwMk9xaTVNQUJwSnZHQ21rU3M2d01FdWlyUUVQVmgwRWlkWTZRQlZSbG9TVGw4T1h4eER4dHh2cUdWWW9EUkx4YWtzZFYra0dRSE5FOVRObCtCbGlaRmNxSmllWUJVaDdqR0Q5NUh3YkdWS0NpN2tzR0w0Snl3Zm43WFY1MGJ3Vk14dGgzU1ZBYmJFZ0hGNUlZcFVFVFVIMTl2cW12ZC95QUF5K05qeC9FUUgyTTI1YnJvU09ESWwwSFFBMXhCbmNGVURCaUNrYkVRbHdTNGhDaDh4RlVFQVh4Tm1DQ1pFMHBKZUdqTEIrRWFXbHpJajdZc2ZHRUVxYzhpcTNHL2JDZE1rVU52THNtdmRHamRGVXNjZkphcS90UG41dUVGTEFWdFVKUTloazRUN3I4S2RpUXhzSEtFRUJnanoxZ0tQQTFXV1JGOHhDOUVGQTRnbnBsTlpxakZoa0xQczRBeFExN3ovWXdiNDZCTWc1ZmtqYnV3Q0tMQnhFQXpRNmVtL3NVZWM3U05GZXIrbnZIR1dvV3FCdm5SRndLaGRMRU13aGkwaVRVNllpTEdYTUtsZjZGaVkzcWppUndaSVhvTGxTTitDL1QvTHFvSFJ3YmlUOGZMdXEyTC96YTNISXIyQmc4b1NhQnFqRTRsS29BMXJQRzRtREJBWllqN1ZxbVdRc1RJWGhBNzNSOFVBbUozNVJBeEw1SlZzbkdaVnpmcy8xd0VheFpqTTNiTkVIcjF1QndnalFUSUFmbVppRS9OVnJIZTloVXgzSVU3Y2xDNFdOZXRsUGNuUzhnclhuSnU4dkpJaVBEcERxeW5NYVJkd1Q1aUNxNTF6NGhoSG5UUWRPbW9adGRTWmJJUGZZdDBZOXlwdkg1T1B1Sjhoa2hOSFBNRDVNbmovMEtmQjNuZERXQUxua2ZGMEx3d3c4K0xLcktoTG02ZDhhZURrYWdaUVoxeVRUOXdVbVdYbjYxaFVxNXIzZjg0QThQckN0L3hMUzZBZGJNVFUwalF3WnducjkrczYxMVpqVjRSMHMwc0dDQzVYaVFack9uZkJTVTNUSFQvbERGZ3lOd2xXdEVOaHdNbjZ6Z01FVTd2dHJNQXhEbXpXdVBNQWQwSUtMV1RqWkExeTNnZmRvVEdPMGN2NUs1L1BreDNmUlArb1kyekN5VTFjc0FVbU1DN0NRb29pREh3R0hlQTk2NEFTSE1BVSs0R1RheTBCdXFGQmFVNUg5V2pGTmVhV0RnYW9hOTcvT1FPc3BFVjB5VTk5QVdNWDhXdGtuanp2a05OM1ozSE9KczBNKzZRTGlPcUhaSUJ3NGRLMUIvZDdSbHFrbDFCa0hyMnFrS1R1K0twSzl1TUZqWEwwQjFNMDZMdUYvMWd2TlBkaEp0R1RsaUFiM2dmZGg3N1gvWFpERUVqTlFLSEVUUlV4Z1JmQit4NFpFYWdaQkJXT2lqRHdPMVF1Z2o5Z1FSTXpBVTJKazd2UUFYcnJNcW9nb3NXbHBWcDl0ZWI5SDIwRGg4T0lMMHR2NFB6U0c3aU1QUHN5elREUGxQNnNXMzhrQXpUdzdQVVZwdDNuUk04cTZ5QU84aUNRbXE2L21OTkxoQzVoMlZ4T0tIWVBXYklmNVNOa3ZBaHVURjhwd0dJSVZjQmNDcEROeGlvc0RCREN3dUFHbEN5dzg5SGQyN0h1ZDRiY1lBTEx5UWhiWUltU09qeWpIYnpQMkNnTDBHTllzVWY0TEhVYmFKV0xaQ1prNEFOQ1ZpSFZkMmhVTUpNQnJJQnhseGl3WTlhWHFLMEQ3WnIzZjFnVS9Pa3Bna2RuUDRzSHlQeUZRcFZHdHgzaFhwMVp3Umlyenp0RU1uNDlUTkhCcE9OR0hJVDNFR1hJci9jd3JsN2pzR3kvQkY1Y0FpRWhOQzBrYUhSMjM0ZEZTeGpxVlFuTkdETHB0Z3NZR3hlWVE0SnNvaEROR2QxZTkzdEdpTE5SMm1LYW1FbjVFaGRBY3JUS0o4ckpFVkxya1grQWg5NnBqS3FjakJaS2FYcGRiM2ZtNXJWT0IrV1ZKQndEeEpqc012L0kxWnIzZjFZVi9pVkxzdjBzSXNqbEZVZGZqbVVwL2UrTXYrNXVLZExXbk9nTS9hd0QvQ3plK2pGaUJRR1F6a3JBV1pnZGh3SUlpWGNBNVV6eWNrTGErbWl5VnhmSXFQSE82RmhpRGpQeTJQRjA3R1psRmcrN0hhSk5QS3BSdWkrUVFkSXFoQUt3SlNndU9ZdHFhbG41VU9zRklOVzdoZzVraG9CamVNcjZ0cFdncTdtd0ExUzFaTDRJaXFtcUVUeGVyWG0vOURpUkN3Wmdtb3ZLTlRpV0JwVEo4V2N4Z2NkVGpIN1V4NWlBTGxiZHlVWjY4dXpRWDF4SzBRRVptaWhUWWc5eHZ3emxUbGgycEYzbzhKQURJZmtPY2pQR2hXZkVKQU9XQ1dSOExpNEFXTy9ac1FjMW5nNU5pQnFvdC9jTWliZTQ1cU9CanQ2cjRwWUF4Q2ljTElQM3Zid3N3R2lFMVdnalBCZ01JT3QveGtQSmpiRUxpUFMvNFdvdUxZRnZVVTNxQjJGeHJYb2sxMnZlejFyVjdjQUFMTldFdlUyYXpzQWYwZ0RqdUl3S25rUlU4RmVPL29nVjh6SE1qbHJCU0t2TTArdWw2ZUdjV0FEY3RJUDhnU1o4ZHJ4QXdyS0pHS0hZVmFnQnlSa0U5Wk9kcEFhRVNTUkpvRXowZ0UvVURMRW44dVRsamQxS09KWjhEbEFNa1ExYWZleDRyYmdsU21MT3JOSnNBQmdKS1E2c0RXQXpRQWN6VklUdVpOYjVYVEtGUlpWaWFGeVZCSGY0bTl5RTVicWdPREN6d2EyYTk2ZXF2aVVWVHUvUjU0ZnhISWRSb1ErSWpOdTRBRG5NMFNlaXFrS3RmUkdkcVRLUDBOOEVtUW81QWJtcllEN2FDRUt4OWtaaFNySHJTSy9FVExFdENXNU1rcWJzZlNTV0xCRk5KM2xLWUE2QkdHVFpTd1c0RWVObTNVUVlndFR2RGhxV0crc2h2WWJGTGJOR01YZ1M0TkdFTUF2MzZ1cVNXQnVoczlKZkdNQ2lRZ2NSRXkyemh0aitWa1dGZGtudzArbW9ML2VQTkpVQ3Rnem1aTGxhODM3ZnFuQjcvTTV5alZFNktZb2p6VEFudEFuRzZpb3k2Q2lIeTlFM1pEQW5GRkNnT2tBRTJHTENPY2lVdURMSTBFU1pza1R0aVlCT1lLYktTc0NCOVpRakw0UzNUY2VHbkRKMFlwUi9EdG5MT1FxS0JwNGZMMi8zY3FJZUlhUHhOc3BzaW1KRFhVNnROKzhZWTYrck9kWXBEMVRpdDVWOU8yYVZjaHRvT1VETnljdWpCd2FIV0J2US85ODdxdy9WQWRLQ3RVME51cG9yR2lFenJaTGcrblJ0eGdFVXhHODVXYTdWdkQvVk5hNHhRZGhEMWhXQ0VKTkp1Q3dwcGNLMFhjNzVoQ0VrVUg1V29MQXBuRGh2eHNUdzZ2VlRHL3hFbHVJNi85c2hjVGliUUZUWG1EWU9oQU95MjU5VjR5RkxJY3UvZ0xnS0tRelVaUlplUEZXRGdhdUJlc2RrY2I3SUxBUEsvVGE5OEZZczFJekc0bVlnVndyeVNHTUNLd2JzSHF2RTJpZ0QvUHV2eGdNQUVJSVMrYUJxcGpXSXJRUU90VXVDbytGOG9iL0RjM095SEUrdG12ZnNqU3IzbkNDY2Jlekp5WUt6ZVF3WlRWd01Kc0FQaC9PUkxPeXNPRys4MTdFRXJSSnJqMWJQK2hsNXJGMHNFNldic3o0OGRDYVJkVkhqdVc1dlZQbTlxamYva3Y2aVJIM2dycUhlVTNYeEVhWEluQXl4WElJem92eXhUVWhkSExIQTRxMjhITDAyRkRkanhyQlU1U0tSVVVUMXIyQmdaWkpBWllELzNzbTNSRktMRFZjVzVDOW9weGc2MVNYQlR6RTFBYlVsUUR3eUpzVG1NSnR2U0ttWTRGalczWmJISmVZUU56WnR6QWFDaUhoY0hIa3ZLaUVESmRoRXNaSGZJYU5HS1Z3QjdRdHc3Y3QxbnpwR0Zzc2s1dW01dEpxb3NHUE5TZlJudzRwV0FoM2pyNWVVd2pEZlJ3MVVXbTFEcGtKcFVyc09GR2FsTnpmYVdDYXBBZTlVeFFabUMySVpFaHRMQlAwVWZZYTJjd2ZzZVc1QmMvOVJNOEFwazFxTUlTb3hzN2hqaUxtS0EyVkpjSUx4TWFoRmlvZ3MwZnh0T2dFYnA0WHZ2VEpWQ2JhL0pHd0xjL2o5blZQRThyQmdvVE14aUE0cTY5cWc5OG1IVUdwUy9VL1FLcTV3dU82RjVxOWZUSFF2dTRsNXF0Tm5tTUxybUxKc2JyRU9JU3VUa0gvSmxRNTJaTUFlYkR5Wjdvd2w0dUN6ZjRJRnQ0Y3RzOUE3Y2swUlMzd0c5azNJaDZlUHVKU0RBZEtsbCtZY2x3bzl1dTBZdWg3Yi9TOWpBSm03NHhyR3orVWJUYmlDZjlhbDE4c2E0S2RqNHF5elJMUGhxTkRCQnN1WUlRbWh4MCs4YjBhdW9JSWZlN2k5SWVDWjE5Q0wxbXd6NzBWdU5GU0RnV0NNN0R5RURCSzBTcXc5RU03MzFkN2ZDbExqenExaW1WTnppcGFlRXl4MlhnNnpGNjMwV1VISWlrM2QvdElyRGV4WXBEbVdOaGlsNTFaKytzRXVEQ2N3dk12ZmFzK0NkOVlkR2cxVDIrUHB1MXpLdjdMb3c2ZTc5T1NBT2NMQzJXd2VIMGQrekk1a0FOdlpZaFZ6R1Arc1RLcmppR0RhcE5EYU5jQUxuSFdVYUNaUHJySUY3R3ByU1VwRzZJTndwYXZDamRxMDRoR2tTVENyWldZaWhnQWROaEZoYWtBNU54WEx6MldoVzBKR3RRVktFanhWV1AvQVNuWE5zVFdoaFl3Q1R0K3BNc0EzaGhVdTk2SXBXZHFsNHhqbXdiQmsyRktaZjQxdTNuZUc0bFJwOEE4TDVoWVhlbHZsdWMzSlMzWTY4QTYrcjVUa0VFb2UxaE5oWFZ3NW5rUHN2OUtWRFY1RmVwai9LQU9ZYlF1cm1NUDROMlZhTGY3SkhETGZhTzBhNEltenpycUJOUENzbzNFVTM1bXFaS2RFSUZKeU9TM3J3SjBkdXNvMXpPSHNTQ2FIY2tGOWRHQzg1U0xMV1NZWENRVlp5VXJGeHpKS1BRRGZ4dkthdFBPdncvNXYxZy9qVmdZMWhDZW5EZ0psTGpoOFBIeThuNW5Jbmd3UTBYR0N0TlF6R05vVGNVZTBnN3VjcHRUK0xCaEEyQThTQUVXK1dkVTZHR0RkYTd6SWdEdkRsZGVMeW8rSGVZVDJ6NDdzRGlqTDhNb0s4Ri94Qmw3QytNdkVlZzVBWXlKUkc0TldEZkRFV1NQVFB4bUFRRjgySDhXSVFkVzZPanc1UU56QUhMcWJPZk9XZTBZVFBEZVQxREwyUlZNdXczTXVyNkErR01DNEtCUlo2a0d4OWdOTXVyRjcrcktTSk42QTkwSUFSSUFuTHhrQVkwMDM4cUpNWkc4TGJ3WVpUVERha01mcGFuY0dZT2pGQzZkbkdlS2xsUW9zdWp4UVRMTGZNVXlTaEFTREFmQjBlclEyS042YVJSOTY4OUttRDhIZ3dWc09oQ01salFIKzU0Nitaamc5SE05VXB0WWtJcGdrWUZId3VnWTQxMFRpck1rQW1MNElRR1ZqbUhhWndJUU9vTXdVWElhMmJCeTlsU2x0c3NCc1ZFclVINndtTTFGaFlVSFFVRUVDbVlDUUpKQ2dSbGtOc2d4Y2tRWVgyTjRHZkhISkFOUUFMWHdJNlpTWnlkNm9FZm0wUVVFcmZERmtqNTVBaG1aRm9RY0dmcklRaHRsSU84WUFIVWN4bWJHUit3VmpBQ0VJbUFPK0FpcExKSFF6NkMwOEdJb2xtWlB1aU55TWxMQkNmekFBSXZvR0RaenBES1Vsa1d3eUU1ZVlEUEFQR1NERGdpMWNnemhyN0VPcnVoTmxXWWNwb2Z3cTFUVVRyY1dyZU9CVTQ4RnR2QVhMOXE0TnorWDFSU1B2UmNSRjc5YktBQmI0Nnd3d1MrbTNZaUJzcDhEd0FDVzVtelBFdTBUVWxTRjZiUVlJRFJCNXp1SFRUQTIzcXFvRFl2WGhZaDFGZFoxZ0FJSndTUnVPcm1XL05BYndPZTZaRkcwN1JBWlE1Z0NrYUdLVnNNMTB6N3BNOHJCTSsxcXRBZnhmSHVNSzhQL3U0UGFSU1FaSnlqQ1cwaWViRHFDMkJNaWlERVUxcVE0dFVZbTlRNGxrejRpTXRZTWJJZE80SzB6NHFpZ09SajF5b3FwaHBRUWk1M0k0SER0YS93M2c4aEZXelk0dEFmYnBKSWJLWllxbUt0NDVQeUhDdENrcG9iMWRNa0NoQVg0MGRHcWpWWldSKzBZbCtYU2wxeWhWZ0pnVHJHeGk2MFZrWTlkZEt4bkFRcGpNNFlqZGkxcUN5QUJrRG0wNjFKUjJXeFlrd1RyQTJFNm9nVHdpZmVkWWluSUYrSDkzOU9GcWdKTkh6RjluZ05zU0lKYjFYU2NUdWpMTEF1YUF0S0ZsUkM3V2ppMUs5eFdWQ09aS1BWREhWeEhUSXozTmN5SjZHeDFQWXFOQUlZQkJZdFdrVHorcEY0a1VYaDhMZDdQUCtXU0F5NHBETlFOd2E4R3lHQmJvaGtiL0Y1VlVRS28weEdxTnBja3hHdy9KQU93aEhvTU1nT0EyTW9ET2NhWnA1YTJYd1FCZ2pqTytxTlFSeVdkeTFOTzRJOTFWeHZzVjRGK3pBaGtENEhzU3hqL1VxZmFIRWlEV0gyMGVWcEcxemJpMUJpZVhGdzVYL3VucEE1NWtJVEZZU25NdFNnWWd0RFFrZ0N3UmpYQUFWMDBtT2RyQUJrRHFEZUh0d0xjVjdtWUFnQ256Z2dFUzlaWTRqV0NBMUFCMVFIZXNXNVRoSWlhaGlwbUlPRHRpQU9VT0dRMWpzRHNUT3NFQXMyQUFvSmlRNUdYT1dOK0NBUWFXNnFKaDBXSXVsYXlYTTZySS9FWDFFYzhzVjRCanJBQjM5T0VqL01VRGx2NlVBYmdEV1RkbFZocHVpaGU5SXVwdGVwMEIwZ2VzK28zckFKQjZ3M0pOcUNJS1V3ZFluZlV4TGhnemgxcTNZMmdkRUg4eXdZcVpqeExWTjBja3kwNmk0bEMvL0xKa2dOQUFvVHdXR0Z3dndyUUVxQWlVc0JtaHN6Rmg1L242YzRUOEc5N3JnZ0g2YS90LzFaOGpqenNab0drUUc2dmFiVVJWRmZZZUN6TFB2WDd1RHhZOWNFZ2FBYmdDTUVYTXZPY0Z1bitoQThEOVhqTUFzVmtMb3BjanRKTHkwN2ZXNkwzQkFQUXlJVTQyVEJYTXZMWDJoQ2FYRElBZkduR3RZNEpWYytCSmpvejllb3JqNGk3dEZTNnRjRGMvVTluTDBITGFURHVxNFYxbkFHcUFxSk9MbW5vZkIydGtnQVJVekhlUXhJaTBIQVJMNStzYm0xdm16b0lCSHBteFNaVVprU0Q2WVg0TW1SN1ZmTmxUUVNmY250VktXUGt4S3VsUmphWXBnQWNWRi9WUkd3RjBEMEFHa0dMZXJBeUE4ZmdKQTlBUWVBbXNST1NRQ3VORFBha01XdkRCMmpBM0dBQStZT1FhYXlJTm5sVmYyR1hSNlBIeWtnRXNEVlZmdzNZYmdFY2p5Ukc1OHVNejdUUWFDRFBEbytSWkNPNlZTN0s4Q2VQM3NSR3BHTUN6UkpuTGxVbUNPbEN0MW14a0FOTjhRWEhNMDdOeDVtV2hvUUdXQ1pDa0dOMk4rUmlnektpaW9zdDlNQUNlaloxTE16aXJpQUFEMEtlRW9ZNVdMUFhIRkErc2JQMWFxWUJrQUMzbTNVdXd6MjBHT0MzUktnWUlTdmQyeEttejdqb00zUVl1Q3RERmRRWlF0MjNVRDZlZDE4TDllNTRSQTQ2Sm1nR1l6UTlMcFF3NHh1VnpVVElBUXJkRFJHdDhoWHFJYVExR3REZXRqa1VkSXV5SERoVUQ4Q1ZUQTF5c0lXc0pYMGdYZTZFRUlNb2ExYmk0cDZocXpabXFCcElVb3d1SEJFMEFxcWpJeDZVTkJCWmJNd0VnSXhZWUFDdDJMUFBreGxUMlMxT0FJTnlpT0N6TndNa0FLT2FkcUxQYkRPQUp1ZHNNNEJteTlFbWx5ZVc4RTdzQXl2QlJqdDlnQUI4NWdLaFNoMENXRHF4TFQ0aXlxeG1BR1hSUnFBUW1BQmtYcDViN2NXd0pvQ2ExbkZrTWU5SWZlUjVWeDg0NlJCcTg3eVNyR1NBMHdNK3lsaTJhNXhoZFJ2bEM4QkJLTW1PeXQwS2liYXVBZldmSkFIZ0xtZ0JrdG1NNXArWHVaRVpzQ0RycG53K1VBYnhjMXJOak1OREs3WDVoRHU1YnZvZktDSkJMd0k0V3E1OHpnUGlOR0s3NDZ4UWg4UHFwcTI0U0ZTSW5yemNaWVB5WThNcXQrbm9qYjRHK1d0VDdxSVBLSFJqUk1jTzVnbi83QlBqU2t3dkVMcjIxRmdtOW5GSzFRSWxCZlJiOGg0enJOOXdSN0VxeFlIbE5xYlFCSHRpSTcwOG45bjZXTm5ubElWaG5hWm1wVVRGZ0VoQ3F0UVI0QlNkQWdiQXhoNHpDQ0cyTk9ZVFlGRlM0enRqU3pMM1NTRWZPZFRVSDgvam5wUkVnR1lBRStSVURpQlJpQU12bEVyQ2dhYU5BOUhvT25TTHUveVlESkFRYUpZQU1zVWlabEJWL2FnYnd3aTltQXREQndab0pDYUt4SEc2VVVVK1h4L1hJZktGcUFXaUp4eW5RbndsL1pCalRvc0FSZnFRR3VHYkQ2MCtzV1NCa0tBRm1uRmJGc2g4cVFNa0FlRE5vNVRtNmJybUhnd0lKbGl5RllWR0RFaWFBMVpyeWh3eFFPbnlrcVVrd1YzdDQ3c3hUekZpUk1BTDhPUU5FVU9Da25kYkM2OGVYeUJENjBpM1p4ZTh4UU5PUVNXdU95SnBmTlFNd3FKZXJwZzZPTW9DbG55TURMTUFBbWUrWXRjeFlocldJVTRCSEVxV01UT3hrUWZuZHpqelpoUWE0UWtQR2pRNGErQnhMbWZzNnNPUmhWOC8xNUwzU1lRRU4xakc1WklDNTEyQTlOT2xub3BGSkhHN0lMU3ROeFJSRWVpeWV5RjJteHNTcUlnRFdBTERPcFJIZ1R4a0FPeEVyZm5ldFFyY3VJNnZNYWhEbHFDYmhFUFZlUy9UU1dnS0srdjdVcDNtWld0TVgxd29rYXpoaFlIL2xxNEcvYkRKRFNZZXBNdGc4TXBKbGVIY1pweERpZDZjQk9hMXlsdlBHVEt2dm9RR0NjOHpLMUdQekJMUkxPaHMrNVN5V3gzYUgwNnhrQUJnVDFEeFhNZ0RESFZReUlaTjRlcHBoWkFMOFNSVXQ1cURvbTdycytiWHRLZkdMRE1Cb01XQXhhaVBBNzBnQTVFSElWM1JiQk8yb3pnQmx6cnRCSkx0QUx3UnRweE1NbWxXaUxkVkJNQUE5d2dQaVlkMFYzSUJRdStDZkZnUFFJbUdhTVZLUnlLZ2xOdEd5S25wTC80NTJ0K0lVWml6N09nZEtsQVVjdUxpUm84bHFMbXBCb3I0MytrVkQ1VEtxVS9RT0xnMlpIREdvQ2FVU2lMQ2tFUkx6Tk5iSUFEQkNBa3FHT2o2SU54cU1GTXZvR2ZhWmlySDZoWWpTd0dKMEoyNEcvcDBsQUxrTVJIclNGbGYyYTdLMWJyclN1SVVDWnRvSEtGSWtzbkM3cDdma3lxNG9YVkc1UC8zVGZiZUtaSGYwKzBTZWJhRFQ5RkczR0VEb3RtUGtqNllKeXRSVmZYbEMwR2hkWk9MN1BFU3JNV3VJRXVteElwNnI5Qkcrb1Z4R2Z3Tm1RRFpuQUlweHlsdlB6NXErckMyelpPcGlRdWVIL0M2M2VrK3FUMXdtVkNVMkNvQ3hWMFljaHRFencwNWhGSmpFTHhUR1NDd0c5QlFnZ3N3TzlQOXVNQUM5bWl5YW40a3NJOThGY3IrQmc5dDVidzllRGJaTWtXaTQrRkZaZmRTc043RUV1R2twU011cFpNa1JvL0xzdFBRRk1GVzhZZVE3cGloQ0NVeFA3cUpzQlFQMGkxWXhnSlViV05FRkY0V1dzTTBIemVsVWV1RXVNeHZkMEJCbElXL2R6czVqWEdaQVU1SG0vRi8zaVFKNFpqSGFiNmo3eGY5c1Y4eHc1amVGRk55cndocWJ6Nnl5WTI3RDh0Yyt3WEdCeFRncHZvR0x3QTBHaUVSRFRVK1RDc1g4bTBiK2luVnA4M09iTFhPTGU2WUtncS9SRzhnek1JdWZLb1NvR1VDaDJ5WUJhSGJ2Vk9pMHgvUUdFbHJLR0ZNWkpnU2tkbm8ybXp3OHIyNlpzcU5xdGtDbnA5bngxOHNvdFpiYUE1Mnd2c2RaNVgrTVJLcmxMYkZ5dUp3dWF0T2l0MERkeFA4UzhPOFFRQ0V4N2RXSklkZ2JsQXl3bFRId0IxbkRNcUVuaksvM1g0WXJTeXpHVkJyQkpsd0ViakFBQmdQUlZHV2RpNm5ucklWNmtzV2NxOXozbkQ0SnZrWnZBTGJCTEg3cXdESkVVd21rWjRlS0NxdHoxT2kwb0ZJNE93aWNGbCt6Tktqc1oxZlpKeldGcUtnclc0NjhaWnpDS2FzbEVuL05Hc09RcDl3L0dFQWJUaVh3WGRrWWkxakwyOERLS2FHRWduaFpvK2xEOWI5V1lBaEVSb1cwZDhLN0hVVzBMTm9NQ0NTSFlLQTVESzFDMkd3QVpTSUQ4SUt5YXV6UEdJQWxHQUtNei9sSDg3ejBWOVVvckdJU3BrZFdnMDN3TlpvRHRpMStsS2RxTTh3bzRhaFExZFAxbm1WaldXMHJxVVIxNWp1Z0ltSXF4akhPSnBLcmFrb1NaTlhZVnMwQ3c3TmFJdkhYSk5oRFFCMjgzQmtDc2ZUbDZnYVpJYTJVdDRtVkF3bFJocGJBdDBmK0x5RktMSnFIczNDVDkxdE5aekFvV2plaGQ0bXhBK3JPUVNQRVJ5YzhJMDBCWUFBRzkyV0F4cFFSMVFIR0p6clU4bGRZbWVoZWVQNVI3YzR4MDFrTk5oSllWTUgreEhvVUJYNnh3TEdPb3A2SVc3SVlHYlNlUktlVlZDSjJsUEF2U0Rma3hlQnNTbkpsMDNtTm03WWFaeGlSVU1DTGJaWm9tRGtPZHZLQ2gzcDRQQWE4alA4NVVCUnRFL0oybk1BMWI0S1dhNUUyUVlvMHN3TjBEM2czL2dOZXJXd3Z4QmhlZmtTSnNvWDRKLzA1NUxXb0NuL3dnOVdTZ2huMzdPcUlsZUdxd1Bpcy9Qc1lkZGF5bUhOZEhkUExUSDREZk0xZUFqYWt0UXRuSzhLTjNXOEZEQStrM2RURlpNdWFsZ2J6QVRoMENTQXRzWDArUWt1UTY2VkZvN0dCaExQVjVIRm82RGlwTkNXMEZJV01vNWFwbHlKbHE1Q2l3S2lSRVNwa0hCbkpQNkhBa1JQZFhlRHVDSXFXSVNSWHM1Ry9TZXFXR0tQMkVmRFFIOFN4ME1qWktjMGV1UWE4UklCL3FZNEVxa3FiQTBjekd4QnNuNTVRNFFnNkJJTEl5MHpxZUkzcjNpbitRMmNDcjZjYklqclpPeDJqNXF0ZG5tVmo3YVFvejV1aTBNZ0U0UktFZTNUeXNSWDAwVnI2OXNUeEpZSEFPekhwRXRFUEpEeXFFMHNqQjVOWFo3TkFpcEtwQ1MwTkRGdzJERmdDUk12a0lMYmdGZW9BRWlOUXBjeEdBbUVsdkZCa3lrd2JuT1NFK3B1R1Zwbzk5c0VBSVRmdkMzVkVDZG9DNDI5T1BuOTlWaE95Q1FDK1lmQmpMcUMrQnVqTWlRS2laMHVta0l2aWlyeEFtSTJYVTdMbVNRcmlmQ2xGSWY5bThlMmlkRHBJc1VFQnk1SkFvSEprVDZnYlpHYzE2Wmg3QnlEdHIrOG9yVndrMnFxUm9wd1hkREJlYUNIY05IZHpqemMwTEJQZC9hSENBT0NNVXY2UTBONGdvcFBVMlRKVGZEL1R3Sm9BeUpSWGhka2pHU0JxSkhNc1hRSzF3Zmd6RnZDZGVUMW82OFhjcDVTa0dLZkFqM0ZYbFlRLzJtb1REL0FLL29ubHZrSm1seWNGWGxTSlZmeU42QWV3TzNyd0R4UVhVK1dqU1NjQWpVUUQxbTFDQTBaT3VzaStCWVVha0dNY1Q4am9wa2FLUm1ZMjdpR3JGbGxQblp5WlRhb3dzNzlHK1hFYXhPZEZLMHl5L1d4bHB2aUtBWTZ6U0hyM3FlMlNBZHB5TTZ0ZXV6S2pLcEhTbHJJWVlqZ0JvOVhmcXNpNWE4eWgxVUM0a2dpWGlHb2M0QlYrQWVoV0lyUHhOMC9TQ2d5UmN1WXgvczRnV0c0Rm9odUVTUG9ZNUZabjdoVUMwZGlVazI2MXlrUlFRR0Y2Nm1FM0xXY2NGNXZuWmh5YlNYQmR0Z0xPd2phUEdxT0ZtZjAxU25PSFJ5UmFaYXYvT0hpN3lRQVpEdkQ1LzBtN3dnQzViVW1kQkdYWDBlOEs1dWFkR3hxZnpyNmtWWDlISVRNa01hQTdXRldTZHhMaEVsR3RCK2hNOHd1dzVheVEyZkUzMFRvd25ta3Nsenl2U0VCMVBGbUF2UFlnSDFnQitnbjZERmd2WWhuWkU3S1paYnVjZE92ZWdLbmdpTUtNMU1OaFFpU052RFdvV2lsY3kvNUR0dEtmUlhvbURyR2dYcFlmVDVkWXRIVXdRT25RdU1VQU1pVVlMd2I2WDJNQUY1cXBrMkFKcGtFakZFek5JNkl0cGpPWHRNZjhXODZDL1lqV0hMR2pZOXdSbzU1RXFCSFZQQUJuR2lCcUhyOWZJYk96UGhPelZTcHAxRjhEdXk1VDBFRTBaUWpISUFxMG9TdnA0eGxPYWZ4UCtrVG03NXgwQ0EvaStaQ0xIanJrbGRTU0FRZ1VQVVRlVi9abisreFhIbTB3R0pCd0xURE9TSnFyQnVrVWo5Wk9xSnU2L1NVRFJKYVE1dU1tQTFCb1VpWHB1c1pQL1RNVVRFWC9hdlBxbnVGZnpiOGRkV0dPa0NmNHpqUmFMNzNBVmFQWE52MGxpTk4xcjNXRnpPYmZvRSttTEZlNmxNQU5iTHNJb3g2WVZ5QVpZRUVDZlJ3Yy9VSUd5UFlaREpDVGpsNk1ORHRONytuTWFETUFnYUphSElpVmdKazFqdzJlOGNxZnBkUWNSTWFPb0o3aERMaU9KQU1FaVpRYms5U2xJZklxQS9BelFmK3JERUJIZk9va1ErejVHZG5nQ2lZcytMN0R3T0xtRTUyVGsvREc5SmcvZS96OEt1aE1FcEFVeVFEMEs1dnJoL2JsQ3BWbGYxY0JhRW90NGJLU0FVeXJoN3hyZG5KVHl6WWFrZWdONldPdnhGVTNDY1FRc2FMV285SUhma3pIWmh3TFlGQnp1R0FBeEIwSUhpQklDazhBMjg1UnUrL3AwSXpjeWpwRnFtcGZMRC8rOGxnd1FNcm9hcjBvMHEvOGxBRnVTZ0I3UktHVGRIS0pCS1FPZUdJRFQvY2IzTnM4dDR5cFJoYnZSZU1SUTE1YUZVVk93ZDRqT0ZLY1R5eE1FNjNGQUlqVFpKeld5L1NYRE1BYzdnVURVS3RYU0RwcWltbTF6bTFHb29OQXE2aWJTbTJmOUxHNnY1WkNvSngwa1JMK3liMDVGaFRRTCtST25xOVBYMFhzQXJMbVdWTXB4NkVvNDFvUlFFVUhhS1hYUVRWb3ZVeXhrMXdtcWEvM3BnN0FIQXMvV1FJcVBmT1FlWll4UWFJNmJzNXN2Q3RudC83VXYrekFxNDJwbjRnRFhyczRuV2VnZGdldHhnbUEvbDVVZlB3ckJ2Z3dMaXNad0xYNlFkOWliVFZJTm5uTXhyQ2IyUVhHb2VSc2grVFZUbnZTeVJIUDgySE9mbjc2WVg2VkFaNmZISVlGRG5OUHdLdUQwREFVbFFSWXBRUkl2UTdwNWlrdjR1YXhrNnlnVzlkN3lRQ1d6b0FSZ2I5Z0FDb2xUVmE0ajByWjRGd1BobU4xMG95TndRZ2Q1bllBZTE4bnZETUM1RWs0ejBodFg3YVNBUWdCMmJFa2Vja0FEdytYRExDd0Y1dFVERUN0dnQrSHQ5cjNYWHdFQ0xRdHNJZSt6ZEdQc1kvRE1KWUVWYXhLbEJiVVpaSGdoWDR2R2FDVzBpVURtSk1DMStBNGEyMm5Eb0FhU3dSTWxEVGREUzRpcUtxZFpKRDZlaThaUUcySjJBWjZQcE9mTVFCZmFPQVY3aU50QjBVQWJ1SFZFUklmSVNSQVdvMUkzZStsVUNDRUFieXd6RHp1UElzRkg4dFdXYnh2NXhBUUdzYVNBYmJTTGhuQXd6cVRBVUtyTnptcUtueXZaZ0RRSjBjSWhvNTdzbXpmZFBlYW9KNy8zQW5LdWhVeVJGY1pRRm9CZ2RnZzhTdUVuOHdXMXp6RzlTNUFpd0cyNEhndXA0QW9KM1Z5SjFtUytpTjZyekdBdEQyaDQvRHR3eEwwY1lNQktKSTZSYUdha3BnakZ3QlFoNkVLdTRxSGVXN01qYmkxQjg4VlFJelFNdzdNNEQ4cDRTU1c2aklaUUJjU0JzSFRqa3JhanRBdUdjQmVxTTBBalRRbzhKb0NwbWt4Z0h4Z0FUN1YvSVRPeTc0QWlQWmJNVUFBT2ZTQ1FyNWxVYUJDWXFBbHVGRlRhZHFISkM0MzBVRWZhSjlSLzZPZ1hpbW5uRHBzTmFrWFYzdjV5K3kyU0hZSTN6NFFWQitYRXNDU0VqRFhnUkhjWkJJSEIyU0dQSS9DMi9ncVh3UThodmFOUVcraStYWlJpUjJ4ZFBEM2M2eGJ0VHFSZlRXNmVvM1IzNklHOXNrQUE3WUxCcUFFU2dhZ2pSVTZvTXhRUmF2RHJob01BTFUrd2Flbm8zOEllWWtBakpvQmtoYlVjTENhKzFOZkM1MEJVN3JwTXgyUkJ6VWtjdHNHTHlRQXQ1a09teTJvOTJ5Skl3YkpBSVRlaDZNblRtNzNKZ05FNG5DV3BrQmt6dnFLTDBBWFp6TEFVQ3RocFFTRHhDTVdIaVQxZVk3UGNyVXdkbm9Lbm5Ra2hiNi92b2xiNHpRVDQ2a0ZLZFhndE93U2VTYXlrQWlyWXpKQVAxcWJBU2lCa2dIb3FSWWRjRzA2SUQwcnpnQm9LbWVjUHZLVWl3VmczMmFBSEZJdlAxZXdIZDZYay9URDJxRlB3Qm5UZEZFdEpsT1UyQUMwSzNqTWtGTXNHa3FTc0dHcTVjblhlbUZOenNUaHk4aVh1THJHQUZDZHdRQ3doWGRTNHRHUFpLSFZET3YxRkpUVFFHNWlHbUpsaUNCdFNHQlpueHBwOGJ3TFVQbHlYM1RwQ3NVYnNRZ0lOZjhDOHRwaUFOczFwakRtcms2R3krRHptaXloS0JIckJPbzcrSFIybkFVZjg5SEtsRGVYZ0h1T2hqN1QySTVodWJXMWR0NFQrak9uWGdvQUdvRnFoTHUwekVjVTFLdmxWTDVNbVl1bUlQV3QzdXoyR2hTVDRWVUdNSThGb2FYbmJwbWhJOURRaC9rYzh0em15TGU3eERwcVl1WUNvR1FMZW1yN01GaEQ1bGU2WklEcytoUzVxZk1aNXQzM2FnbUlkbWd6QUNubkgrVjJIYkVBd2U3V28yVGtJMHhFWXkzV2h4RHR6NVdNQ3dCOG1tMGxNSGZxcGhKUjljYXIxWlBVMnNwVHBIaXV3aUJ5cHI2TDlFTDRsTXFRNzNLS0l1T1hocURYVExTZXZaVzRPS20yQ3dUVkxRYlFLTTlQMnNJck5aSlpIYVZIcVFNNkl6OTFZUksxZWZ0S0xIb2FmSngyTEJWMC9BVURIRXlaQ0tXeFVBTFpMaGtBajg4TldWaDJzV3dBUGtuSm5Ub0FZQ3VzMEFicTBOU0I1ekprcDJJQUtuM0ZqdXlUUWdtT2dwb0J3b0VjbFVjMllUZnc1STIvWWdCdEtEVFBOQnV0bTZjWE5BbmxpLzJ5cFJsa1pBZ3c4UzgvWTRDK0laNWJES0F5a3VnTUt4dkUvR0pscnFRUFZ3SEdudFBZQ3RhRi90YjVEUWFBS0ZkVlBGU3hjaHVJZG9VQmh0QlBtcG9CRUs3TWY5b01RTHVMY2ZLeXZRQ2d2YmFzcnpRRXBaZXc3dzNxU1lzQklvUUU5SzhFd0dwb1lOMWZMZ0h6ZVZIQmF0cDJCdEh6V1RFQTFmMzlzcjAzQ0RxcWIvOG1BOEJqMGFOU3NtSlNPMTZZT2d5RXBDMXM5SW5SRmtTcUllN1o2ZWtEcE8zWFN3QzdXS2FYMXJqcWZhVmRaUUNqWHNrQU8rQ04xSllHUU5LZ3hRQ3hxL1VFQkpOSUUxR1lWTXRKUjFOdzdkeEpCbmZKa0RyREEwcGRnUDZXVWRlTmZZVHJ0NVRBSzBrNWRtVUZxOXhpZUx2aStNV0dQNnB2SGFLbFNWQjU4VEx2Y1dRSm85MEIwZGVKNUpjTEtRSllNaDlwZ1cwQktJeEVNQU5RZ3k0WjRPUGpEeG1Bd3BocXdHMVRjRElBQVduYzIxck9NTk1Cc1JVa29yeGdnR2UzQk5NbXl4djBWdEVxZ3RJeTV2YXYwcmxERXdVMHg1SUJFS3lJbUViN1lLb05OQUpKcXVXTGJhRDdtcEttWlI3N2k0Q1FNdlFqS1N3bVAyZUFLZ0FsR0lCNU13dVJIQXdnbHB1MEF6QnpGcE5VSXlxa2xoekFtcVZKVklaNXZVaEQ0Q3lETHdJNSsrc2xnRjJZamFFRy9BNEQyQVQyTUNkbURZUVhFTzRBNXBRb0dRQkdlZTVuSXkxUWU4U0tTZGNVcUpobDRkeUpCSVM2WGxVTWdMaCtGT1NxMDNUYUJqcTljeC9oZk5INGh6b3hWMVN5U05SOHRtU0Frc0tvMlVTVWFEWWppOUVNUUszRXdTUURZQnljQWNvbGI0bFY3R0xwaUtnb21FOTZoUnZsblZpcUxLQWZnWE8vWmdDNmcyMUIrUTEzOENKZFZNNEE3NnFYd2d0b1ltQm9XV1g0Q0YvVFhlZExwYTR0TTI5NHgyWlJFZ242OUlLNm15L1REdU5HUEs4UUJCVEJ1L1pkaEp5eWpNdWNMWk9qbHdVVHZaYk5QbEh6MlJ5bjJDa3AvSU1DNS9reUNIV0pHSHNBdFJqZll5czU4YUdsS1hnVTNrOFMreW9EY0FHZ0V6RGRnbVVBcGwrUzFWWitnd0dlU3pYZ3R4aUF0Z2ljRkttYTVUUWhEKzFvMDBoWUNRS1pXWDVSMmxpcWxnd1F1M3I2eDdGdFpJeTZ3dzdURjhEUUo2WnZSeWsxU2dCQTNnZVJudlBiQWFKc1dVdTB5R0RKL1dnUjR6Z3Evc1AwQUttVHdtaFc5Q1JiRm05QnZMUWpZcUNpSmo2MFlBQnBkZnpEVlFiUWw0Sm1TQ2NnNjI4emJNcmlkM09HWkkzYW9IWkNxVnRkUnM0Rjh6MFQzWnNNd092SzRvV214WVcxaVpOb3ZkS1p4RW9FdEQ4NmdmelAyTmNQdk9XK3FacDBpWW81SHMyNXd4eVVrUlJrNDFJdnBvMThMQ0I1UlNFdkg5QXZBa1NqT1dacVZoZE1ST0VqT2JzVnNPZWh6aVExS1h4QzJ4OGRKWm9OeThneElyY2YwV3A4YURKQUk4MExZcE5mcnpHQXU1ZDg3ZmVObElFOEVTUmN6aENxeE1rQWc0UlN0N3VBTy9URDVVM3dkeDdJNG9VNjlDNFdZeEtkTzlyWHNXY1FRTzRFeWovZkdMRlROL1puakZ5aVlxd0lvVFRDRG9rMXhJNm9LSDhqeUlGdktHWGZaU2svTTZGckkwQ1VMV3FKbmxvRkU0L0FSckd3WERhQ0hVaHFRbzBJUkpydHM0aGFrQnYzVHNabzQwT1RBYmppUlF3azlQMXJEQkQyM2o2Y3QweGR4OGhHRktpdFo0alhxUDBxU0VFb2RidEw1MmNjTG0rQ3YvTkFGaS8wdnpIRFloSU44WTlaTFJ4QVRnSzlGQUJmS25Wc2FUdXRKMTBXZTJVVjB6MWhoOFFhbmhKQkNyc3JHM2dsaTNrQzJDaE5vU3NBaUhyekltbDF3Y1Fab0hVbmh5ZG1vODBIcENhQjg0OWxXYm14ZVBJbWw0WkxmT2pkK0dZVU5FcUlaaDJrSVltV3FyNHNBRGx0M2VtemI4K1EvZEYwb2lCRlFxbGJYYm9oaWNQbFRmQzNIeWlMRitKdkY0c3hpWjZJdkZhNWpmd1lnZXF0QUw0Y0xiYjBuc1NraTExOXdMS3RqaTloaDRvMTNJeUpXd3Fray9VbzRZaUM0encwS1R6MnlvaDFlNVQveHN2c1ZnVnduMmhSbEJjRlp0RTVJREd1TC9uSHRLemQrcGF5SjVYREsvalF1L0Z0SE1RUDM4cVdtRUk2T0R4eEc5THJsZHArZTRaWWJjdHZLQ0lrUlVLcDkxV1h2SDRlTG04eUxhK0w0b1hsMzBDWXpqaUpyRTR2Y0d0ZmVPeTdFMmlaZndxbEtDL3I2V1V0ZmxkbFJqRXpBWkFrTkNyL3lJdllnd2NCaWFoY0VlK1FSVVNYSVFzQzdib3N5eVFXYUZGMDV2OHk1YkhYdEk0L3dsU2hSQ3kwajJwNzJNYUgzaTB2a1ZEM1JlSGxzaFlpWWR1SnRaSlpCdVJwQXVXd2NpV09lcXlDUkxvaTgwR1NZb2wxYTdrc3V4SkpxaWZuVFFwZ3RnRkcwWWhUNDVSaGNlVUNjYjIwUXVDYkFQMXVlQkt4aW81dnl4YTEyREZsUzRRNGNhSllDeElBZDMvL0Zud1owQmxEaU1xUHhFOFdyTTl5b21CWWFnTUoraTNMSkk0THRDZzY4Yjh1N25KWHIyRzUvQ09ObFJhVTdmazNLZ05SR3g5Nk43dUJoV1RaNXFJYWFoUnJENkNmYmJNNUdvNFVSN0htQkZWakRtSWNjN0lZaGg0L09PMGVIVlp0aDR1VEhXaU1LZWF6S3FlWDNEcXJRSFBxcy9Rb2JlQXMwVTZ3RlY0UDYyMFVta2I1V3NvUHJwVXNLT3BLbUkwUDZaWUFPTkVQbmhMajV0QVpQU1NiYlo1aWpxRmM2U2lDZFY4Uis0RkFaV2VaUkJpd0FpM3F1TzNFd1lWZFQ4TnlPMUd4Z0R0YkRYblNTSlorbWZuM0lpMFdHV0IvRFEyTnJTTXpWbVE5NUtYVk9BOXNJRFQ4bEllb2g1MjB0ekswbUlNNjNjZzBiMUJ4dktTLzAwWi9nSVBReUdIV2hadnNBVXYyV2ZYbTFIdmpuR1FDSlpsZXFWZWJHcVh6a3V3ZEZmMzM5STk3cVhtajlXeWNnSGczeE5wc2x6TlpaalRvTm1FQkN0VGREb3piRURNUlBWMG1VZWpTcEIrNnJvcGlndFBDSWhCcG9xb3lpUVZhZE5MSi81V2pSYTRyaHVVeUV4bDJzQXdzbklRSnNvYVNDa0ttWmdBdno0eG1jaEtKRjBCbTZKWlJSQlkwenVMUEtzTHh5L0hnKys5YStnTlRIeldaV1p3UUptTWlySitkTmtvTnpCV2h6OUhYR0hTWjFBRWw1UTVFbnBKNmtZekU2OEVPWTJlZDNWcVFsRHNGWkg3YWUwVlJVb3JQUFhsQ0cyQkVyYURveHNPcHNzeW9FQW5tQnBhZ3NSeW1FYmtCNlF2MWVHVnBWQVlEYytxbExVTDE2U3JqbFJyL2FOYTRqektKNmZIREVmSEc1UCtDZkZERWFkWSt3OFdKYlMrWXh1TFArTDlnaXdTVEk5eTRjZ2ZjeWE0TmVvZlFpRE1xcUs5ZFNDeUc5WTAycENybDJENTBOZnhxNjMvSTh4SnpzT3VUUmJqRUVOWkRwNDFPRDhhQ2ZCZGFwcWM4ZDByS1lxZTlYYmtNaHdHZnN0Q09vaDVzcDlVOVdwVkZhMlpSVVJTVU9qTThCQ21wbUJRbkM0cENRVkxFSWwyMG1Ma0ZERjhJMk1LNHJkZW92TkZqSWlXNjlkM2V0ZGFzUzR0V3pydW04Y3FCeksxcFU1UTUrWmh6MnFBV3hCYzVDTUxpYmdkTllGcmtPUjdHck9VTWVHNmtrNmpDMzA5a0FHWWZmQUtSTUtOWUNEd1Q3aXdKRGNWY0NUZ0Y1akozYXl6TTI5b0JNaytRejhIT2dKUEZGcit6SmhZbGJVWXJuU3M2dXJwVDluMG1KZ0prUFBPUXJWaEhhY1FjOFpxYnphUFJveDZzRUxYZG5VVnJRR29qNnR4cnBIUVRSTTdhbFFnYjB5L3drR3FXR1VXcXV6SWF3d2lZRENEVHk2S2grc2dSdklnQVVSNXRGaXFFMjFrdkYrSjNTZ1pvV01jbzhvNmpBdG1uUGlaalJjY1pyRFhRZnhqU3JFS0ZYSkpRaE1nZFJOK244UXFyaC85N3AyTUV3ZW1heU5qMHBpZWhKSHN3anNKQ2tHWUJxTkluUnJJRU0yQXVLL01ON1Z0UmszazM1MHJGdExETlhMRjNscHB4MEVBdzRSNnNSa0FOQmpxSmx5WnRNS3M0dlRJbG9SejJlckR3cjlYZGN5OWFRMVFESzRvaVppUkNSQ010cGR3M0M0cDZ6WUlzTTdwOS9Sa0RLTVVCU3BFYXZ2Z0R0QmJaN0FEVkJua1hHWmhPQnBCWG9BNFFaUkk3aGJleXNRcGtIeVFxUVNvYjV1RTg5Q3RjQnN1RnkxUHRYM2loSWJUQjN3emhSL1NHV3dJeHNxSlpJQ3MyNk1ZMFFMSkduaTFmQlhTVDNjQ2ttWWZlT1NtUkxBRmNoUjFCWWNDTnhDYytCMEZTUTg2ejhFNWp0T25QOVFmdWFCbnlzazZEYlpDNTVQV0Z2QXQxMmpVSCs0TTBOYis3VW84ZTl1enVvQnVZSjA1R1J6eUJWSjREczZ4ZE9VaHNoUFlpZVhoUlp2VCtwd3pRRE00b1U4bHNxa1FWNWRHeU1tSlUxdXlVcVg4NnlGUEIybTJZelNnVG83SE9xM1ZrSGk4S21CN0tnSXlzNEpZMVpFK004RWVBdDhkY3FRQUFBMkNNR3BFaFFpUUQ0RE84ZWlVUzFaQVZKbGNNOU0yM1pqUVUzZFdPRFlVaWhyZWtxOXhtN29CejhFRFVtZWpFNXNuWE5MS1dudm5nVkp0YWpreG5BQ2FFQTJNTHRWallobjlrckk0ZUJ0a3kwRnJKeCs2bUY5R0FTV3BRYU5mV2xGR3RNV0UvV1FXdXEvejNTd1pBenZ4aGx5VmFwYU45VktZWWI0aG54dldaL0d0ck5wZWk3TnBhbytYbVFEc29VUWxVVFo4OGlJcEpYZFlRaHJCZ3NSRVZGeVgralR0OUxBSEtBQmk2eklyOVlxa0FWV0VwWDVTSm5mbWpaQUEvQkR0VUZTd1RjNUExbVkxVndSYldMVk1MQUxuUFB1VzJKMzB4QnZDVWtKRzlHb1Z0RUVFdTFKdFR5QUZ4N1VWclZDeFM3aHJqZ3JXNmlmQkNyOEZjaG9IYXZnL1ZIb1c1RmlVRDZQMEc4anlMTWZzcEErQTZ2ZVRYUjJzR01FRUhsZHE5Q3BqTlhvRU1SYUVIT3JWWkNLS0l5a29CNEFFOFJhV2lONmF4S2hRQXV6OURBc2dBY3ZNTVhrZTVhTTFkb1dRcGlqVDNyekpBbG5PL2h5Q09jRGx1UUdJT3JoY2hXVDFVQ2hRVGxqSEZKN0lSNzdTaEZLQW5oYVdqVndTTmdjU3NRR0FyWGxkN1dRMHdnWlZSdkxqRTJqajRRUVdFWjlaWHRrY3V0YmswWndEcHhmMUVUVlBlc0gzSi93a0RtSlVLeG1GNjY1am0zMm9MTlFoMDcvVWR0WFh5cUN5VW5jaXczRndEbEdGTVdJQlZRZ0VJcTY1dkE5VjBBTDBqc21KajNkUGtLTEZXUVdlREY3MWRza0VQVVQwZ0hhcUEyVWVIVnAyUkN0N1Zrcktpc1FBMkF5VDlpaVBNbEw5WTRIOXdINCtXOElCalpoaTRyRUx4RE9yVzNRMWJvdTJjZGVqbWNDQytESVFwSlJGa3BMMVFMaEdwM2N0ZHdOOW5BRlEwTThjaXpSdExMbGFpOHFBb3RLTHRmRm1QRlVEM0hjVWFFRm4yKzQxWENDSTgwVlNaanJYU0VQU21BbitsSTh1czJJeTRXUGRDV1lrYUJKY1orM1gzRE85RGh0TmVDNWtmYUFXOWVZUWJZbUpCUmdrUjRFK01SNEVCakFqQTh0aDlXT05lZ1BNR0VndXJGaCtUWVVYbDJ6bm9oTzJTQWNMTjhSS3lDcGpTeGlXQWJYSlVHY0pUcllyNS94RUQ3R0ZqVjdPajVabWJHZUZVbkZ2Q2cwTXpaMzUybU5JQzFEWXZ0TUNNUTF5d1FNUFNnMFV0UjhxNnQ4N1lKVEFBbkQxTTB3UDdGK3BBcW9Va3FBSk85QkRFaTdKTk1CRkVRUDNBUVRQMTFGUUIwSXZMeWxMTmx2U1FkYnJJQUhOcHlyRGFYQUtnaUJLQjN4OExiejluQUhaSGF6TUE3Yk5SaWg2RkxBQXVTc0N4bVdPWkxBYno3LytLQVJnc0JITVp6Q2hqRitjTEZLT09XWjJaQ2tEN1hyRVB6QnBoVVRtT0RLQ2FFMXRUTVlDcTBEbDhRa2J1NVF1SUNCZUZhMVY3WU9pREg5MXRLU1ZzTGlrakFnQkZkR3NHR0RBZldLdFN3Ym5VQVZ6c1dHM0tPVkZaMFhhWFMwQjdaV2lLMmh0YnM1ZTdEakFNZTFQb0M2SmxaTFhZKzBpbDNkRXBhTDBKVDRWdStkY1k0TFRKdFJiQnZyNFJCRzA2QXpVdGNWYlBNaXgzRUxzN1RQZW9FUllyZ0ROQVAxck5BSzBxb09PdzA3Y1o0T01hQTVpTndaeHF6STFhQUdmejFvT0dOa3RjVnQwUVNtY3d3T1V1Z0lzTHkxczZTS3pEaGxVNTlicmhKRk42UkRmdUkrcXA1ZStMcmQxS09tTnZsNHVWZ2tHY0FiSlhDN29HQXp4eEh5bHNPai84UFFaZzhYbGY2R2UrRWZ5a09kaVVjcTh3NmFobXFuY1VEYjRHcUxnakJ0cWRGOW5PSlFOY3hPclNVL2Q3REpBWnluMDlHQmJRK1FUWnFBRElxZmxPbWx2MUhabVJ2RHZqdEdvN1FJWFdHbUdiQ1pycWpuT0hERFNRMU54VXdNN0NpY0lKcER2K2pwb1JiZTBMNjhCZ1Y5Z0I3bG1sY0cwSnc1Z3hUdjNyQXk0TVBRZHhaZDBVemZEeEZ4bUFueG51T3FyMHR2U0FzYjJLTmdQT3BZbXdFT0p5cWFRcG9DeWNNU084YTFTbjZLUVNlSlVCek1IMzhIc01NSzBNdzZnVFZDYlBlSFJvbkFxQWM4L2xVcHE1bGNUeXVwNjJnMHlVREdDUlgxbEM3bnhXcTRGUVJLbTM2MVVXSDFTdEtzQldVOWF6c3dwVmMrYytHMVZGaEtFYVZWRXYrN3ltTGJIdk1zU3huWWZLUUd6SmQybGc3aDkrbndFV1BGcmFWMElpRXdSZ0ZyY3NNNmNLT1VzUU5nMDNnWnptOUExUEVNUHNsVmFZRVNUTDBCd1p3SkNOUHRuakRRYUFULy94TnhrZ01wVGo4ZTBRMGl6L0ttT0hGY0NtWm1BbVlRZWc3WWJtV3daSm1DL0E0ejNOencxRHU2YlZVVHZ1WFAxdXRQallIbTdOMHMrSGhpcVJMWlJLdjRWMW44TVQ0ZFdvRGg0RXphMVNIMTRmVWJ1VFdlUU9UZTBpZ3RaRTg3WXF2VWxpUVBjQzRHSE8zbllWVFVqanRENTZMSWZPdk1ld3VadXhwd0FMeURRcHFpck9pb3pKcjBadVZsb0J2WXZDR2VLVGp4Q21iUENMbzRMMEZRWkFVTmZ2TWdEMUMvNnFHZUF4QzBDcmFWSU4rSE9ibWtHQy9ocHlXTXN4ciszakFqYWhJME13TE1zajY5US9vRXI5b0FIMWxGU3dCSklrSUZSVWZWUEFQQ3ZjQUN3ZTNkeFQxdFdvM04yMGh0OVhUWUprY0hNSHIwc25zYnhrT3BtOWRManlJTk1XRHdud2tLZDRmSHJXMGFVMFZxNW9sZlBiejlMcmh2ZzZkTERJRk1tTWQ0MjZLNTdtLzZrc0xiV3ZDMmV3eWtPZHJMOE1DNzlrZ0svdlAyV0FqMnNNOFBvV0plQ0JGTTBxVTdveWdQN2FOWWVQSEp2c01EUE1zNFZCQmtzZGFhYlVneSszeHlsUjFrVElzbFZSNGFZbkxicXhoZkpxVkRzUGdqYlg4UWkxM0ZLN1pJVVVpK1BwZEJrbWd0Rm5LRU9VRGdlcjFKVTNHUERGU3NaMGsrdVZSQzIyeXZrSm9kTHZEbXhBQVJaNGVmTjRRRXh6cjVxUWFmNnp0SlFIUjVhbE5MTDJBZ3R2R1Aydk04Q1BQMktBN1hVR0lNS0ZtU1A3TmdjaDI3aWt3NVBKbWR5M0RDUnBaMnFCWWFPR0VkQTduUkdwSjdZS1RvbXFLb3BYZmR2dmczN2F1dDQ5SzZ0UjBmRnlRc2hKeEJRNWRHQUc2Y2x5TzdwMElsQk1IaGVCWml3ejhZNUhWWlUzQk9GSDRzRlJINEV5R1VKWng5WXc3aVVpYnhSWlVPeXloY3dlL3V3Qlc2d3d4RCtNNUkrSWhrWGhqQWp4d2Z2eW9jUVI3Vms4OHZjWTRQRW1Bd2pCdy9SYTZRQm4yM043Z2drejNiTEsxTVp0MCt1ZHkrRUJhbjlHSnQwbUc3VUpqK0tTSnZRQjlmQW42eU9WZFpHaTZ0dTNWN2paZWpXcmw2cWFsVTArQmtFemZOQm9HTkFCQzBYMGdsc3kvRk1sVEJscXluREpUVm04SkFxRDJSK0k4VWJBTVNZaGhURW1ZNVNYWXBrY2h4OU9vMElIcVV0TUFNRG5SQUJGcExyaC9wVGFDT3Z5d2tUT2hndzJucGpZQWY5OEszNlI1V04vaXdIeVI4MEExSkk5OW13SkdBbTJLMnV6dW5taHh4NUZxQ1hQTVl2WFN1WnlWQVhzREpnaXJLNm5FVm5HR01mSk9tTk92V2ZTTktOM3RiSHFtelNqRkJVZ0dLdThtbFVVYm5yaGVzZ0FZcU9oVXhVTkViRFdJOU5ON2duS1JMQzVOaWRSWGE5SXorSGZYdXdJSEVDRVNDN0xHVk5yT3pBK0s4NkhZQzhrL1N4L1FIUkFwQ1VpaG5GYnVSV1FIeGE5eWh3dmlsNTErdjh2R1NDRFZzcU5xeWhyWmZKSzFHK0FVR1dzcmI2d1JyTkxKMmV5aUdsR1hMS2lUdjRIR1U4L21ZUGpvcGFZMVdjU2dZZEk5S3h3c3dHTk5scU1heE1qclRUYU1GbzhRWFNza0lMcWlrNUxOQkNVTGFmYkh2RnlJRDNvSWo4VDBWVVVCQU9oTExvbFhMMHBobWNVeW16c1prVTFTaHRJSGg3WVUra2plWFY2eC95ZUdid0sxSjVBNTNCLzY1a2hQaFpPMCt0aEUyTUdJSkFmQmNUL0FnUE1HV2FHZUVzWW5lYWVWeHgyQW1wRVQxNWxTbWVnb1NhZllrN3JENDI1aGgzeUVneUx2V21pV3dQU003V3A1YzMrRXNyek9FakdFemlmZ0JkaGJEc21HNEdTV0M3Y0ZUdlRCckhhQm1WYU1TMytwRG9Rc2pZTGdwRlFpRzVoVEl0dnhxM1VIb1J5Mlo0dE1oVW5VZDhvSXFObm1NUysyd3VGazFydCtONU5QNk1xcHJ6WE1BRStDMmw3WVc2QUFwRWNRT2ovK3d4d0tPTUI2TzFqdlhzbTJUdnRHWEM1WTVMT0hKS25CNHkrSVVYQkFaZ2FMb2Z4USttUE9YQTU3a0l3MW5nTDZZelVTSWw4emJWNHhnVTZpWFRLQW9ic3dpS2dYZERnR0VvQkJDVi9HNGoza2hOWlRzL2RYN1Bja09zSXZJZjRzb3JQVGpVYUdxSXlLa0tjSUpTam1lRUNncnZESGNmek1BNXNvRXlIdlFmVEd6K1FuNDN4akdMbk9QY1lXMG42MGFCcG1sbVUzSVlCNEwvL0JmMkRBZWJ6RmdPRU9TT2hSY2tBN3UyTGV2ZEVSbU1DbTRZRzdneWhxQUEvM1gydy90NHN3QWhFNURta2VVdzBiQTJHOVdVT2pWbzNJYmhFdm1hL2x6Wk1Jcm5TVnlCMTBDTW5RVE95T3ZRc3U4N2Y5TGUzRXpPQW9iZjRQcFcwVkh1NTdhYzVzYWo1em1OcGFsUVFMVmtEa0lKb0E1bzcxS3puMEFFVjJ6ekFHR0MzK0RyRkdFUmpNMXdOeFlPbVREckhyUldoOWcwMjJpWUJXRHhlNlg4SEMvUW9yVXhnZ0RwZlJTWWtvVGU4NDdYck1iSmJtQmF0cEFyVmJtbm9td0YyUW1Gc3VYTjAvcHQycE5UbVdsM1dJVnVpaFVabTZsRVU0Y3VxNllZNkl2STErNzI0S1F2dkVKakZJc2JjeWk4QjNFZmc0eW9DTFBDUitSdEM5RUliVFFsbmhNUnBPVk9vOHE0Yk0rOHl1b1ZwSnJFZlhnK0txSXBzZElVaU9xZFJheGFpMjNwK0lGRUE5SEpsZWpQZDJrWUNqWjE2a21DR0x3dmZteFZGTjlCNnhKeEFzdjRMK2NFQW04S0VjYyswQUhXK0NneXlSMDd3QjBlYjBNQTMxcVczbFpSeW5TQVR0MDRrL2NkcHFmSnFsSWsyUkUyL1lxZHRlKzhvd21jMFFtcGl5dTFuMEMwc2NtNzhnY1VBSmpVNXljdVlPOTNRQTVnQjh5RjVUdGUxcC9QaEl0amVqNGFPdzRTem15czJra1Z2ZlNnWW9JcU4wZlEweFpsc2pLbDBMNVA1SFFZcmNhSFIvY2UwckN4ZjlPNHhsWWp4ZGlWUHFDMEJrNHdwNXdldUFMWXdzZXlKU29vRVlXaEM3RFJoQ0VXUXpLUE9WeEVKU2ZRSDYyMnlkajJzak56YmpGVldoNVpzR0VOQVRLbUhqUUV0TktSc1BnOWtmSXg2MHRMcHRqWnlJSVMyQjV2MGhFYXczcjlCdGpQeVgvdmNKaitOQXVmTm5GbWJFZFp1UUpBNTVvd0Z2U2dvZ1lXb2N2L2lZUlJrZ0xaRnlndEdpRWFGRThkWEdLQi9sUUdzdXVDNm41cFVMQUZ6QW9NaW9uZWdkU1NhQWtEQWlqMXJKdS9BSkdUZThpNGphVUZ0MEJ4a3B1blJCTjZVUGx1bjhEOGxBM3lmWWxlSnlZZThBTkM1Y25mamlwYit3Qkg4ZU1kR0t5c0VRODdIUG5rRGFMQmhnM0VKeXRFeGFlazI3TnBMa3RId0pGYXlDcGFMc010Qzc0WDFtTUdSdXBaWmF2OE5qUDJZS05xZGF5MXdPWjdDa3Q3aWhaQU4yWEFqSUVIT2NOVjNhWkhsVmxFS3lvdFJJMXNaQ3REMEtKd2p1MXViQWVZRkExZ1luT1ZSZDZGdVNRMVgrTTlUWG5FRjBlSkdaNndEa1lEUDN3VitDMERSTWNFSHJyakpUOHlmN2RaTm1DaHZ6KzFrd3ZtSzFEREpBTFlCZm1jYjR3VERkRWFuSmptWW9tMW10RlhSbEFIVENPYXI3Vmpmd1FKN0ZxdEFWZ2psbm51OGpNeHRZeC80ZStBMmdVNXVPWnNCcW5UWERNWUhuaG11bVI0Q3Q1aXorTWJXK0lTSnBkYURodkNvZERTdXFRTzU5RlZ6SkNPRFBlNXgzbmNHZ0l0WEtlRlpmVjBMcWxLMDhqb3hkT28vdWRaaXBnSXpsQXlRMm5jNmhOVmJSUkVEa3FGMWF3WUFVUlc1Qm9paGlYaStDd1luQUZmbWFnSVh1aVlNaTZYSlVKK24wS0JjRXlONVF3Q2dpY0RIcXB4RjJYVVJVRkc5ckF6SzBrU044eXcwOTZyL2thZHNCZ09VcXpLQ2RZKy92NEw4cWhaU2FkaEEvT003a1FTV1Zpc0E4TlJmUUNxNngvMXc4S3pab0RYbXVzbnBZVGgybGZZRDVZck1DNm9zQWZkems5WUtWQTFkMDBDRmdCcjU3UXdROFpjSnAwRlAyYm9SSGFscGFKdEZMN1R0Z09HU0FlUXhhNGptQ3diQXNxUy9zdUk0YzU1eENTQlJYV1ZaV1FVbDE4aThuQUpOYWFtNGJjeUdvUlpMU3RyRTZaLzJSb2lOV2NHK1FnQWtBK1NlRjBzcnlpVHI3QzBNeW5CT0hPbUdoTHVLcHB3SE9uMU5mTU1NYThvQW5qcDI4bmM3cHFMWnB3eEhxT3JBZXFNR2FVV21kSWQwTUdDa2tWbk1ucUplRStRQWRTT3VoT3VGQjhZYUF5ZzdZR2xPYTRVNUVNa0FqSHNNQmtoQVRaKzB0SjdlT3Y0ckFac2FYbEFvYzNNb0JISTBHSUFaY20wWGdFZDRVanE2bERFeHRKVTV6M0p0ZkxKTnk0ZzRaOWZJTUxsaHQyNHBVaWRTTzJuK2ZWUWZRV2plUjBobHBHc1MrcHNBWUl2TW4yNnhzRlNIa1I2RzNacnAyclh1N2tnK3dveTVlRUViSy9qbTFGQnZMRUR5UHlnMmVLVGlQRUpzT3JzVmNybDJPdGhZK3FUdDkzUWJXOGhPNlRsN1R4WWtRMkw1ZmcyZ1h2YzlLbkp6alFFWUFyUklCckM0eDFFd0FOUnNQQXQyN2F6aHM0aUdKekxFUkQxWW1lRlhWRzhpcnJtN2w4bWJzV011cGdHYmlxMnBrNnpLZVpaRTlmd1ZoR3REbm9lVzlzV3RWSFRCUFFocWsrWmU2MTduTFBKVzZrOXA2UU1xR0VDdWpUMHZhK21vdFVhN2RWaGdVQWJUeW8wZHBhdWJLWFBuZ0FPNFkxckRVenV4eEdvYjd1MEFNbFdsUERBOE1tTlUrQzQwV1FLb0Zqbm1wVGNYVHhYYXUxWFBlNnk2QzM1anppY0Q2T0xlUk5rS1IrSlhERUR4M29zbFlLenZ0azBHZUdkZGp4NytnUnJZRHFYbE50RFZGWUxOTFpCN3hXbE4rNTdFRmFNajdMZGJCanNXeGlrbG1iUmxtZk5zR1VUMUREWkU4WVZHaHNrdEJLVXhKYnRJYmZ4cjAxeE9RcE0vcFNrUC9NRGZiZm9qUXdncGFDdW1aZVZCdHc1d3IyRjhxWFRUN3JYV1RiRFNuMHBLNUttZkszYWY1WWU1dHdQSVZDT3RZbU9FSkRZU0JDSzlGTytXWFdYWHFJcGt6Mks1Y0dER3JDZHJ0bG9WM3BFRFZxQVVlbGVVaXRhUTNaNGg2VElnVHhHaVpBQVo2NUlCd0pmZ0luUVIvbEdIMHVJMUlCUXBuV0hoWi9Gc1hSTTNidUdueVYrWmxudHB3TjVMSHdJU1NVcWp3NThLZWhLVmVWZTRsNlpHaHJ4SGNPUXJCMVJkcEhiUUhFUkhBOG4vOHc5YitvQ2lZUXRYeFBYQUdqYzdiYkxiNWlDeXZ2aWNVdzdJVkFhc0dRMnNyMHdON3VXWVhHVUE4c3VSM0JpSkpKWW0vN0RUSnNwTzZJK0NTOWluSys5b0hWNmljY3lVYnNSdUhPTk03SEdEVmNHeEVRNDdiT1o2TWNMdG1EYWozM2hCVGhGbk5RTkVrR3JtNEdpRjBuSk9rNjFET2lOZlg2UnNWU0tuZHkrOWdSaFJ1dm94djBneW04aTUvMHFpTWhoZ0V6UCt1TmQyaEJBWGNzclZ4NktMMVA0blNLNU56c05mUW5MN2liOUovMnptZnd3R3dNZVk3WWNxcXFtNDZGWXlNS1B6UUxVdkNGN3Nqb21mUXJuMXdUbUQ1QVk5NjF3UE1zczEwa0ljUHFWemJmR1FCSU1nYk5CWWdxWHVsTU4ybHRyRnQ0RnJlU0ZpbkxFTjVPWncwTVNtbnlBaUJBOHlFN3Z0S1JiU3NURGxQUmlnSHd4QW1HZ25rbUxXb2JTYzAxellRanJ2cVlBcmlhdmdPMjYvcHR4R3kwRVFkYlB4V1N3MEt5ZXlkaWRScWJSUmJSTzY1dXcybXJhN1NHMzhDMWNmaUI0azE1L1M4YTgwK29DeU1kRXRHV0FZbWptN1Z6QW9lOVlYc3lxREExampoOEJLMWZPRjJoQUR6YnJjK0VJc1dQQ1crOGM2U2pPWnNtZkxMRUk0bU5vKzUxd3B1REU4S0tyWWtsU3dZTFZCcGMrVzE0Y1IwT2pxTmNSRzZNc3dxMC9icWlCZjRqbStaeHNxYkN3WUhqRFJiaVJTakZEYW5OT3hwWFlLTTdSZ3ltbU5qR2pXMEpHU0d6N1EwTVFSanVjVGVXK3RGdVJjSWI1cmVZNi9iVWF6aDExVit4ZFMvbDl2LzBYN0YvK1pDNUQwWi9Pc24yQUFsM1dQR0ROclVYeGdRcm1PS004RkszM0RKUGYrd3EyZWlvRkZLMlhHV25IVm9SamN2M0lwYnl4NjIzMFptakZjYko5Wk1aY2J3eWoveWIwOE1QeXNMa2ZuWTJmSGZsektrRS9zcDBlbFhWRS9KSE44VTJIano4eUdtVWt4bDlkaWRuUnFwblRtQmt2OUhKaldYejV4WnlRMEpiZWFSRk1SNXl5T2laemRTVlFvN2g2NWsyczQvZmlVNlZWWDJaVE9SbmVTL0gvKzUzL1E4ejlCL213Y1dLdjBxdnZkdEZWekI0ekdtV01lU3dYVWZKRCtqSU1BL2JrTUZBd2d2eWdBTUtxQWluQXA3M3VRZUNBMUZMZllndzVBMngwYXJheGtWS1ZaSkRreFA4WXcrNW1DN05VeSt5RWhJejBMcEd6a3I0cVFESVRrUmpiTXQweUtxU2JzcW1HU2Y1WFMrZjhuNzJ4YjRnaUNJQndTQVNFU0NMN2xJQndZRHdJbjkvLy9YcWI3cWJxYTJmc1VSQkN0alh0dWFRQ3M3ZGwrbTk0U3FCM3dQV1pOOExYdnJ5SktSTlJGMDhVVFB5NkdESTJrK1NicnVTR1RoZ2tWUkhQaE5DUS9EZlIzeUw4Z2YycnRIazFXRW5xSmc4bEIxdlAvbVRlOTFsKzRhNlI1QXR4TmcvTUcxUzVBaFFlMTJudW1UTCtMVkE0WkNiM2ErMzNyRitsaTd3SzNTYXVLaERUeTlxcUt0dUZUNi9kb3o5UVdCU2JZeloyeURLbnQrZ1lmS21RT1M4NFJ4US9MNnV4MWU0NjJEZ2k5cUx1MTRnS0dIRDZxeW9kRDM2em5lb2EzZVMvVUNuUStiUVhQOXhjM1FPUDV2czVMMzArUWlRbmUwL0hrTzRCd3NZMy9DWGN2b3pQN0ZpQThjSUt0bnRCMy9kcEg3WUpsUkI5N2d2SDRkdGo3STBjNkR3WTg5cHVhQmFuSm9zTFQ3ZU5LRmhWSUJDNkZielRCT0E0YjVRd1hPL3BNOE1WejJIQXJyVlpuVkczOStKWUxmTHM2RFVUY2FGb2ZrVEdHREcwVUw3Y3Q2L2xSeG8wNVgxREJsLzlDMldrZUFSaWMrMzRDdWNhVTMvSC9mQWM0RVhSZnI4MVZQcENhcFpPQWQvVXo3WURUeUlYSFVlOFlwMWJiUXpvTHVKcDZCd05nRTBWYVJtNnlzWVU3WVBBMzRlMlhNVTY2cmc4NFowanJDY1p3ck94TVJ1M1dVajVJcHNtY2MxaHhaTWFVSFc0bDJ0S0JnaHQxaXh1UVppV2krYWFCUHBzNVRzOXdZT05lcVZlZ0ZOMDRnVTdaUGk1STZxWDExL3ZlMDRDV0pNQzF4bWU3REZEdC81NUtJSC9oYWd6ejBhQlB0MnlSRUtQUEc4S2dZellEOTF2WHRzWm9DNC9oVHZGMHUxODRaNjJzSmhpTEs5aGIyL05LQ0Q0VHFPWElLbzNDOGNmV2FNdUhFSEhyNThockdiRmpzK2lwYzJHY28zZ2hVaS9VNjFEeDNvRENRUGVodXUrSGpPeFhYR1BYMFhzU1gzbUN5MXRQa3dhazExNDkrZGRFaUw5MEE2akIvL3ZJTVhndzZkU24zN3NvdklvSFA1TTc1ZlNib2haaDFJYkhMM05vaFpET2pEY2c0ZXl0SlFCTE1zMUsreFIzRy9QR1pHRml2c0tnV2JsUnQzVkZValMxaUJZZHFTZTAyYVB2MjBJWkh5ZUNjSXZjOTlOeVZ6NU5yakd2d2JxdG1XNGRDMUNDWVl0d0NnRzhXV0h2Vm9BdWJZMnRRdlJlNmRVb1k5UytSeE1mV0xTZEVFdDBiVGpkRFJEdC9BRFdrOXA4L0xJSVdVd29ZaXR4ZjdlSjB6bmMxdUdUWmNiV2JiT3I1LzBpbGZzNjJpSnVIUEdnV0w2Z0E2N2ZIclZ4WWs0RkUvRFNUekNuZ3RzMVZwYWw5TzgyTkFiOGFraEFTb0dkK0VnelVOY0VyanpHaU1LRzJrTHg1VmkwazlxR09FUCs5NFdCT296YThtdmVwQkNCNjREMG85eVhqU1c0Qmk4NW9TcVdiWnZGaGpGcnJteTdJbEEzcXI0M0REdmRiUExlUGFpZlFLMW8ybDFRYWpuTFVrWEFicUx0RWQ4YUV6STFBeEFFdXdHY25YZ2FCNi8wR0hxelNWRzU3cXphVFV6d1N1NURDblVZTmRQd2M5NGtVVFRhMWtlNFhGN20wbzQyWlovcXdJSWxzVlc5dEdxKzNqMVNEbmJsUzYrTTdXYXVlb2FUdWEvWk9wU0QxWWxDSlA2TmdXYlo1WnAySUV5UmtGbTNRQy80WFFaRGJBU1hzN1VreEV4c0RUNkhkSFUrSkx5MGhRWDhHa3c0UW11a3R2c1d4TnF4WlowV1EvNDRPQnd5Uk9aSGRjdyt1UDZrL1VqYTQ3RWJ4cXRPRlB5QnVRcm0va0N0MXBnb01xb3pxRi9ha3pJWUtiTExOZHYvZGJYM1pFbGlvWW1rUXlkUFp0aUFROVEvY2JCY3JrQjkyektuandxVXB2SlZoczN1MFhLdHRDUFJlend3V3B5RDhnZGNCU014VHNjWlh2aThFck84LzhtQ1gxeEFiV1BKaHlXNlhnMGI4ZWJITVdGVWFQUGJKQWx4RlRBSlZ6U1d2Z0w1UHdlNmQweVZML2JLbHhIamhNM3R4T09hQnpmVkw0d2VZUDFaKzlITHVzN1ZiTXBnUVg0MWNEd2RBdlVGYkZvS2xYQmJQbjdaUzVLaWk3Uk5KdERpRWpoLytvbXd2cEJMUWRjNURFc1R3MjRPeTNSckJMUVRXLzZzeExvRnN1Qmozb0dVVGNva0JJWnRiclZTYVlTT0syOFcvR3Z2REZZYmlHRWdhZ2h0b2Fla2wzYWhwMXdLWWZ2L3YxZGtXWDZhUUMrRndKcnFPUmY3YWx2eFdxTnhDNkp2RGVqK1cweDhwRnhDRUlTakVKZnBJMVhpQjMvQWQyek1xWWZZQ0FNUzhBTmlOamNta2RqUWYrVzVsK09YWWZRdlUxbllvVTdhS1FSQjN2Y1VpMW1QNVpkbi9kTWZ6bFFkM3NoWXNBUlN3R2V5cDBDQkN6SHVUSVRIUmVYQ2E4aGczZ1NmODBPenBvWjlaWUNYeUJ5dE80NUl6QklJU0YweXRiOWNpTEhaSHpyM2hldHYxYW9BUVpBUk10MmNGVkxSdERnUDNQYTlCU052S1FHZnkrNGpiT3lpSy9BL2FLUGdoZUpWNUQwcEw2eGxFM2ZXRTN1RGIxSmV4dUUrcjRxdTNBTXBkRGZFQ2RkZ0FUeE5NSi94Q0FCOGd5RklPeHExQUo0aEw0Qk9GdmdabEwwaDJYbDNXMDJzSjRCL2VLTWRqc0lmNlFRclUzekJ3a1pmeGpXaTVwNVRZZGhxZm1JOXNRWUZzbkF3a1ZjMnNVTGdOK2l1RzBqeHNOWEVlMlFGQ2dwREJOdk0yTmpKNi9pT2xicTVqblkyeXdQNi9LKzJBQXF2ZE5MTnZHM1p5RElFZnFmQThycklMSk5vaHlQQUNoUVVoNEp2Wm5HWUQ0SGY1TEs1UkE4OEQ3aFdBQ2hRQkFsZDA1RkhYZUQzRmlPYkYwWGRpZWF4bnRqYlNoUzJsYVZkaDduWE5mcEQ0R2NqV2hTVitVcldFd3RSL0FCdHd6WW0rSXhTbHdBQUFBQkpSVTVFcmtKZ2dnPT1gO1xyXG4gIHJldHVybiBpbWFnZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZudCgpe1xyXG4gIHJldHVybiBgaW5mbyBmYWNlPVwiUm9ib3RvXCIgc2l6ZT0xOTIgYm9sZD0wIGl0YWxpYz0wIGNoYXJzZXQ9XCJcIiB1bmljb2RlPTEgc3RyZXRjaEg9MTAwIHNtb290aD0xIGFhPTEgcGFkZGluZz0yNCwyNCwyNCwyNCBzcGFjaW5nPTEyLDEyIG91dGxpbmU9MFxyXG5jb21tb24gbGluZUhlaWdodD0xOTIgYmFzZT0xNTIgc2NhbGVXPTMwNzIgc2NhbGVIPTE1MzYgcGFnZXM9MSBwYWNrZWQ9MCBhbHBoYUNobmw9MCByZWRDaG5sPTQgZ3JlZW5DaG5sPTQgYmx1ZUNobmw9NFxyXG5wYWdlIGlkPTAgZmlsZT1cInJvYm90b18wLnBuZ1wiXHJcbmNoYXJzIGNvdW50PTE5NFxyXG5jaGFyIGlkPTAgICAgeD02MzYgICB5PTE0MzggIHdpZHRoPTQ4ICAgIGhlaWdodD00OSAgICB4b2Zmc2V0PS0yNCAgIHlvZmZzZXQ9MTY3ICAgeGFkdmFuY2U9MCAgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MiAgICB4PTU3NiAgIHk9MTQzOCAgd2lkdGg9NDggICAgaGVpZ2h0PTQ5ICAgIHhvZmZzZXQ9LTI0ICAgeW9mZnNldD0xNjcgICB4YWR2YW5jZT0wICAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMyAgIHg9NDUwICAgeT0xNDM5ICB3aWR0aD01MSAgICBoZWlnaHQ9NDkgICAgeG9mZnNldD0tMjUgICB5b2Zmc2V0PTE2NyAgIHhhZHZhbmNlPTQwICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTMyICAgeD0yOTg3ICB5PTEyNDIgIHdpZHRoPTUxICAgIGhlaWdodD00OSAgICB4b2Zmc2V0PS0yNSAgIHlvZmZzZXQ9MTY3ICAgeGFkdmFuY2U9NDAgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MzMgICB4PTE3MTQgIHk9NzY5ICAgd2lkdGg9NjYgICAgaGVpZ2h0PTE2MyAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT00MSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0zNCAgIHg9MTk5OSAgeT0xMjYzICB3aWR0aD04MSAgICBoZWlnaHQ9ODcgICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTUxICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTM1ICAgeD0xMjE0ICB5PTk1MSAgIHdpZHRoPTEzNiAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xNSAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9OTkgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MzYgICB4PTE2MTAgIHk9MCAgICAgd2lkdGg9MTIyICAgaGVpZ2h0PTE5NiAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0tNCAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0zNyAgIHg9MTM0MSAgeT01OTUgICB3aWR0aD0xNTIgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTExNyAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTM4ICAgeD0xNjU4ICB5PTU5MiAgIHdpZHRoPTE0MSAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9OTkgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MzkgICB4PTIwOTIgIHk9MTI2MyAgd2lkdGg9NjIgICAgaGVpZ2h0PTg1ICAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT0yOCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD00MCAgIHg9MTAzICAgeT0wICAgICB3aWR0aD05MCAgICBoZWlnaHQ9MjEzICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTAgICAgIHhhZHZhbmNlPTU1ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTQxICAgeD0wICAgICB5PTAgICAgIHdpZHRoPTkxICAgIGhlaWdodD0yMTMgICB4b2Zmc2V0PS0yMiAgIHlvZmZzZXQ9MCAgICAgeGFkdmFuY2U9NTYgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NDIgICB4PTY2NCAgIHk9MTI5NCAgd2lkdGg9MTE0ICAgaGVpZ2h0PTExNCAgIHhvZmZzZXQ9LTIzICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT02OSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD00MyAgIHg9MCAgICAgeT0xMzE3ICB3aWR0aD0xMjggICBoZWlnaHQ9MTI5ICAgeG9mZnNldD0tMTkgICB5b2Zmc2V0PTM0ICAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTQ0ICAgeD0xOTE2ICB5PTEyNjQgIHdpZHRoPTcxICAgIGhlaWdodD04OCAgICB4b2Zmc2V0PS0yMiAgIHlvZmZzZXQ9MTExICAgeGFkdmFuY2U9MzEgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NDUgICB4PTIzMyAgIHk9MTQ1NyAgd2lkdGg9ODggICAgaGVpZ2h0PTYwICAgIHhvZmZzZXQ9LTIyICAgeW9mZnNldD03NCAgICB4YWR2YW5jZT00NCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD00NiAgIHg9MjgyOCAgeT0xMjQ1ICB3aWR0aD02OCAgICBoZWlnaHQ9NjUgICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTExMiAgIHhhZHZhbmNlPTQyICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTQ3ICAgeD0wICAgICB5PTQyOSAgIHdpZHRoPTEwOSAgIGhlaWdodD0xNzIgICB4b2Zmc2V0PS0yMyAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9NjYgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NDggICB4PTIzOTIgIHk9NTgzICAgd2lkdGg9MTIyICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD00OSAgIHg9MTEyICAgeT0xMTQzICB3aWR0aD05MyAgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTEgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTUwICAgeD0xNDQzICB5PTc3MiAgIHdpZHRoPTEyNiAgIGhlaWdodD0xNjMgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NTEgICB4PTI2NjAgIHk9NTc1ICAgd2lkdGg9MTIxICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD01MiAgIHg9MTc5NCAgeT05NDMgICB3aWR0aD0xMzIgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMjEgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTUzICAgeD01MzkgICB5PTc3OSAgIHdpZHRoPTEyMSAgIGhlaWdodD0xNjQgICB4b2Zmc2V0PS0xMyAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NTQgICB4PTQwNiAgIHk9Nzc5ICAgd2lkdGg9MTIxICAgaGVpZ2h0PTE2NCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD01NSAgIHg9MjA4MiAgeT05NDEgICB3aWR0aD0xMjcgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTkgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTU2ICAgeD0yNTI2ICB5PTU4MSAgIHdpZHRoPTEyMiAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NTcgICB4PTE1ODEgIHk9NzcxICAgd2lkdGg9MTIxICAgaGVpZ2h0PTE2MyAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD01OCAgIHg9MjM4MyAgeT0xMTEzICB3aWR0aD02NyAgICBoZWlnaHQ9MTM0ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTQzICAgIHhhZHZhbmNlPTM5ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTU5ICAgeD0zNzIgICB5PTExNDAgIHdpZHRoPTczICAgIGhlaWdodD0xNTYgICB4b2Zmc2V0PS0yMiAgIHlvZmZzZXQ9NDMgICAgeGFkdmFuY2U9MzQgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NjAgICB4PTUzOSAgIHk9MTMwNyAgd2lkdGg9MTEzICAgaGVpZ2h0PTExOSAgIHhvZmZzZXQ9LTE5ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT04MSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD02MSAgIHg9MTY4OCAgeT0xMjY5ICB3aWR0aD0xMTUgICBoZWlnaHQ9OTMgICAgeG9mZnNldD0tMTMgICB5b2Zmc2V0PTUxICAgIHhhZHZhbmNlPTg4ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTYyICAgeD00MTEgICB5PTEzMDggIHdpZHRoPTExNiAgIGhlaWdodD0xMTkgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9ODQgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NjMgICB4PTgwMCAgIHk9Nzc5ICAgd2lkdGg9MTEzICAgaGVpZ2h0PTE2NCAgIHhvZmZzZXQ9LTE5ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT03NiAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD02NCAgIHg9MTQyMSAgeT0wICAgICB3aWR0aD0xNzcgICBoZWlnaHQ9MTk2ICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTE2ICAgIHhhZHZhbmNlPTE0NCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTY1ICAgeD0yNzA4ICB5PTc1MiAgIHdpZHRoPTE1MCAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0yMyAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NjYgICB4PTIyMjEgIHk9OTM5ICAgd2lkdGg9MTI3ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xMDAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD02NyAgIHg9MTgxMSAgeT01OTIgICB3aWR0aD0xMzcgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTUgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTY4ICAgeD0xNjUwICB5PTk0NiAgIHdpZHRoPTEzMiAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTA1ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NjkgICB4PTI0OTYgIHk9OTM0ICAgd2lkdGg9MTIyICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD03MCAgIHg9MjYzMCAgeT05MzIgICB3aWR0aD0xMjAgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTg4ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTcxICAgeD0xOTYwICB5PTU5MCAgIHdpZHRoPTEzNyAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xNSAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9MTA5ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NzIgICB4PTkxNiAgIHk9OTU1ICAgd2lkdGg9MTM3ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xMTQgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD03MyAgIHg9Mjk2ICAgeT0xMTQyICB3aWR0aD02NCAgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTAgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTQ0ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTc0ICAgeD0yNzIgICB5PTc5MCAgIHdpZHRoPTEyMiAgIGhlaWdodD0xNjQgICB4b2Zmc2V0PS0yMSAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9ODggICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NzUgICB4PTc2NyAgIHk9OTU1ICAgd2lkdGg9MTM3ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xMDAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD03NiAgIHg9Mjc2MiAgeT05MjYgICB3aWR0aD0xMTkgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTg2ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTc3ICAgeD0yMTk3ICB5PTc2NSAgIHdpZHRoPTE2MyAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTQwICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NzggICB4PTEwNjUgIHk9OTUyICAgd2lkdGg9MTM3ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xMTQgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD03OSAgIHg9MTUwNSAgeT01OTQgICB3aWR0aD0xNDEgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTExMCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTgwICAgeD0xOTM4ICB5PTk0MyAgIHdpZHRoPTEzMiAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTAxICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9ODEgICB4PTIyMjIgIHk9MjA3ICAgd2lkdGg9MTQxICAgaGVpZ2h0PTE4MyAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT0xMTAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD04MiAgIHg9MTM2MiAgeT05NDkgICB3aWR0aD0xMzIgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTEgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTk5ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTgzICAgeD0yMTA5ICB5PTU4OCAgIHdpZHRoPTEzMiAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9OTUgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9ODQgICB4PTYxNyAgIHk9OTU1ICAgd2lkdGg9MTM4ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTIxICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT05NSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD04NSAgIHg9MTI4ICAgeT03OTIgICB3aWR0aD0xMzIgICBoZWlnaHQ9MTY0ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTg2ICAgeD0yODcwICB5PTc0OSAgIHdpZHRoPTE0NyAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0yMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTAyICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9ODcgICB4PTIwMDIgIHk9NzY3ICAgd2lkdGg9MTgzICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTIwICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xNDIgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD04OCAgIHg9MzEyICAgeT05NjYgICB3aWR0aD0xNDEgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMjAgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTEwMCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTg5ICAgeD0xNTcgICB5PTk2OCAgIHdpZHRoPTE0MyAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0yNCAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9OTYgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9OTAgICB4PTE1MDYgIHk9OTQ3ICAgd2lkdGg9MTMyICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT05NiAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD05MSAgIHg9NjU4ICAgeT0wICAgICB3aWR0aD03OSAgICBoZWlnaHQ9MjAyICAgeG9mZnNldD0tMTMgICB5b2Zmc2V0PS0yICAgIHhhZHZhbmNlPTQyICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTkyICAgeD0yOTQ1ICB5PTIwNCAgIHdpZHRoPTExMSAgIGhlaWdodD0xNzIgICB4b2Zmc2V0PS0yMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9NjYgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9OTMgICB4PTU2NyAgIHk9MCAgICAgd2lkdGg9NzkgICAgaGVpZ2h0PTIwMiAgIHhvZmZzZXQ9LTI0ICAgeW9mZnNldD0tMiAgICB4YWR2YW5jZT00MiAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD05NCAgIHg9MTU3MCAgeT0xMjcxICB3aWR0aD0xMDYgICBoZWlnaHQ9MTA1ICAgeG9mZnNldD0tMjAgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTY3ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTk1ICAgeD0wICAgICB5PTE0NTggIHdpZHRoPTEyMSAgIGhlaWdodD02MCAgICB4b2Zmc2V0PS0yNCAgIHlvZmZzZXQ9MTI4ICAgeGFkdmFuY2U9NzIgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9OTYgICB4PTI2MjIgIHk9MTI1OCAgd2lkdGg9ODIgICAgaGVpZ2h0PTcxICAgIHhvZmZzZXQ9LTIwICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT00OSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD05NyAgIHg9MTU4NSAgeT0xMTIxICB3aWR0aD0xMTkgICBoZWlnaHQ9MTM2ICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTg3ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTk4ICAgeD02NzcgICB5PTQxOCAgIHdpZHRoPTEyMSAgIGhlaWdodD0xNzAgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9OTkgICB4PTE0NTMgIHk9MTEyMyAgd2lkdGg9MTIwICAgaGVpZ2h0PTEzNiAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT04NCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMDAgIHg9MTIwOSAgeT00MTMgICB3aWR0aD0xMjAgICBoZWlnaHQ9MTcwICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTEwMSAgeD0xMzIwICB5PTExMjUgIHdpZHRoPTEyMSAgIGhlaWdodD0xMzYgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9ODUgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTAyICB4PTE4NjYgIHk9NDA4ICAgd2lkdGg9MTAxICAgaGVpZ2h0PTE3MCAgIHhvZmZzZXQ9LTIwICAgeW9mZnNldD02ICAgICB4YWR2YW5jZT01NiAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMDMgIHg9MTM0ICAgeT02MTIgICB3aWR0aD0xMjEgICBoZWlnaHQ9MTY3ICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTEwNCAgeD0yNjI3ICB5PTM5NSAgIHdpZHRoPTExNiAgIGhlaWdodD0xNjggICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9ODggICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTA1ICB4PTEwNTAgIHk9Nzc2ICAgd2lkdGg9NjcgICAgaGVpZ2h0PTE2NCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD0xMiAgICB4YWR2YW5jZT0zOSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMDYgIHg9MTMyNyAgeT0wICAgICB3aWR0aD04MiAgICBoZWlnaHQ9MTk4ICAgeG9mZnNldD0tMzAgICB5b2Zmc2V0PTEyICAgIHhhZHZhbmNlPTM4ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTEwNyAgeD0yNDk1ICB5PTQwMSAgIHdpZHRoPTEyMCAgIGhlaWdodD0xNjggICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9ODEgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTA4ICB4PTI3NTUgIHk9MzkyICAgd2lkdGg9NjQgICAgaGVpZ2h0PTE2OCAgIHhvZmZzZXQ9LTEzICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT0zOSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMDkgIHg9MTk3MyAgeT0xMTE3ICB3aWR0aD0xNjggICBoZWlnaHQ9MTM0ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTE0MCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTExMCAgeD0yMTUzICB5PTExMTUgIHdpZHRoPTExNiAgIGhlaWdodD0xMzQgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9ODggICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTExICB4PTExODEgIHk9MTEyNiAgd2lkdGg9MTI3ICAgaGVpZ2h0PTEzNiAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMTIgIHg9MjY3ICAgeT02MTEgICB3aWR0aD0xMjEgICBoZWlnaHQ9MTY3ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTExMyAgeD00MDAgICB5PTYwMCAgIHdpZHRoPTEyMCAgIGhlaWdodD0xNjcgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTE0ICB4PTIyODEgIHk9MTExMyAgd2lkdGg9OTAgICAgaGVpZ2h0PTEzNCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT01NCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMTUgIHg9MTcxNiAgeT0xMTIwICB3aWR0aD0xMTcgICBoZWlnaHQ9MTM2ICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTgzICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTExNiAgeD00NTcgICB5PTExNDAgIHdpZHRoPTk1ICAgIGhlaWdodD0xNTUgICB4b2Zmc2V0PS0yNCAgIHlvZmZzZXQ9MjMgICAgeGFkdmFuY2U9NTIgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTE3ICB4PTE4NDUgIHk9MTExNyAgd2lkdGg9MTE2ICAgaGVpZ2h0PTEzNSAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD00MyAgICB4YWR2YW5jZT04OCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMTggIHg9Mjc3MiAgeT0xMTAwICB3aWR0aD0xMjIgICBoZWlnaHQ9MTMzICAgeG9mZnNldD0tMjIgICB5b2Zmc2V0PTQzICAgIHhhZHZhbmNlPTc4ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTExOSAgeD0yNDYyICB5PTExMTMgIHdpZHRoPTE2MyAgIGhlaWdodD0xMzMgICB4b2Zmc2V0PS0yMiAgIHlvZmZzZXQ9NDMgICAgeGFkdmFuY2U9MTIwICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTIwICB4PTI2MzcgIHk9MTEwNiAgd2lkdGg9MTIzICAgaGVpZ2h0PTEzMyAgIHhvZmZzZXQ9LTIyICAgeW9mZnNldD00MyAgICB4YWR2YW5jZT03OSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMjEgIHg9MCAgICAgeT02MTMgICB3aWR0aD0xMjIgICBoZWlnaHQ9MTY3ICAgeG9mZnNldD0tMjMgICB5b2Zmc2V0PTQzICAgIHhhZHZhbmNlPTc2ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTEyMiAgeD0yOTA2ICB5PTEwOTcgIHdpZHRoPTExNyAgIGhlaWdodD0xMzMgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9NDMgICAgeGFkdmFuY2U9NzkgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTIzICB4PTQ1OCAgIHk9MCAgICAgd2lkdGg9OTcgICAgaGVpZ2h0PTIwMiAgIHhvZmZzZXQ9LTIwICAgeW9mZnNldD0zICAgICB4YWR2YW5jZT01NCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMjQgIHg9MjQ1MSAgeT0yMDYgICB3aWR0aD02MSAgICBoZWlnaHQ9MTgzICAgeG9mZnNldD0tMTEgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTM5ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTEyNSAgeD0zNDkgICB5PTAgICAgIHdpZHRoPTk3ICAgIGhlaWdodD0yMDIgICB4b2Zmc2V0PS0yMyAgIHlvZmZzZXQ9MyAgICAgeGFkdmFuY2U9NTQgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTI2ICB4PTIzNzggIHk9MTI1OSAgd2lkdGg9MTM4ICAgaGVpZ2h0PTc5ICAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD02NSAgICB4YWR2YW5jZT0xMDkgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xNjAgIHg9NTEzICAgeT0xNDM5ICB3aWR0aD01MSAgICBoZWlnaHQ9NDkgICAgeG9mZnNldD0tMjUgICB5b2Zmc2V0PTE2NyAgIHhhZHZhbmNlPTQwICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE2MSAgeD0yMTcgICB5PTExNDIgIHdpZHRoPTY3ICAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9MzkgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTYyICB4PTEzNDEgIHk9NDEzICAgd2lkdGg9MTIwICAgaGVpZ2h0PTE3MCAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0yNSAgICB4YWR2YW5jZT04OCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xNjMgIHg9MTMwMCAgeT03NzQgICB3aWR0aD0xMzEgICBoZWlnaHQ9MTYzICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTkzICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE2NCAgeD03MDIgICB5PTExMjkgIHdpZHRoPTE0OSAgIGhlaWdodD0xNDkgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9MzAgICAgeGFkdmFuY2U9MTE0ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTY1ICB4PTQ2NSAgIHk9OTU1ICAgd2lkdGg9MTQwICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTIyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT05NyAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xNjYgIHg9MjM3NSAgeT0yMDYgICB3aWR0aD02NCAgICBoZWlnaHQ9MTgzICAgeG9mZnNldD0tMTMgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTM4ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE2NyAgeD0yMDUgICB5PTAgICAgIHdpZHRoPTEzMiAgIGhlaWdodD0yMDIgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9OTggICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTY4ICB4PTI3MTYgIHk9MTI1MSAgd2lkdGg9MTAwICAgaGVpZ2h0PTY1ICAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD0xMiAgICB4YWR2YW5jZT02NyAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xNjkgIHg9OTk1ICAgeT01OTkgICB3aWR0aD0xNjEgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTEyNiAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE3MCAgeD0xMzY4ICB5PTEyNzMgIHdpZHRoPTk5ICAgIGhlaWdodD0xMDkgICB4b2Zmc2V0PS0xMyAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9NzEgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTcxICB4PTExMzEgIHk9MTI3NyAgd2lkdGg9MTEwICAgaGVpZ2h0PTExMCAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD01NCAgICB4YWR2YW5jZT03NSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xNzIgIHg9MjI1MSAgeT0xMjYxICB3aWR0aD0xMTUgICBoZWlnaHQ9ODEgICAgeG9mZnNldD0tMTUgICB5b2Zmc2V0PTY1ICAgIHhhZHZhbmNlPTg5ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE3MyAgeD0xMzMgICB5PTE0NTggIHdpZHRoPTg4ICAgIGhlaWdodD02MCAgICB4b2Zmc2V0PS0yMiAgIHlvZmZzZXQ9NzQgICAgeGFkdmFuY2U9NDQgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTc0ICB4PTExNjggIHk9NTk3ICAgd2lkdGg9MTYxICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT0xMjYgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xNzUgIHg9MzMzICAgeT0xNDQ4ICB3aWR0aD0xMDUgICBoZWlnaHQ9NTkgICAgeG9mZnNldD0tMTUgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTczICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE3NiAgeD0xODE1ICB5PTEyNjggIHdpZHRoPTg5ICAgIGhlaWdodD04OCAgICB4b2Zmc2V0PS0xNSAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9NjAgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTc3ICB4PTg2MyAgIHk9MTEyOSAgd2lkdGg9MTIxICAgaGVpZ2h0PTE0NyAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD0yOSAgICB4YWR2YW5jZT04NSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xNzggIHg9ODk5ICAgeT0xMjg4ICB3aWR0aD05NyAgICBoZWlnaHQ9MTExICAgeG9mZnNldD0tMTkgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTU5ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE3OSAgeD03OTAgICB5PTEyOTAgIHdpZHRoPTk3ICAgIGhlaWdodD0xMTIgICB4b2Zmc2V0PS0yMCAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9NTkgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTgwICB4PTI1MjggIHk9MTI1OCAgd2lkdGg9ODIgICAgaGVpZ2h0PTcxICAgIHhvZmZzZXQ9LTE1ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT01MCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xODEgIHg9ODY2ICAgeT01OTkgICB3aWR0aD0xMTcgICBoZWlnaHQ9MTY2ICAgeG9mZnNldD0tMTMgICB5b2Zmc2V0PTQzICAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE4MiAgeD0yODkzICB5PTkyMyAgIHdpZHRoPTExMCAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0yMCAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9NzggICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTgzICB4PTI5MDggIHk9MTI0MiAgd2lkdGg9NjcgICAgaGVpZ2h0PTY1ICAgIHhvZmZzZXQ9LTEzICAgeW9mZnNldD02MiAgICB4YWR2YW5jZT00MiAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xODQgIHg9MjE2NiAgeT0xMjYxICB3aWR0aD03MyAgICBoZWlnaHQ9ODIgICAgeG9mZnNldD0tMTUgICB5b2Zmc2V0PTEyOCAgIHhhZHZhbmNlPTQwICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE4NSAgeD0xNDc5ICB5PTEyNzEgIHdpZHRoPTc5ICAgIGhlaWdodD0xMDkgICB4b2Zmc2V0PS0xNSAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9NTkgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTg2ICB4PTEyNTMgIHk9MTI3NCAgd2lkdGg9MTAzICAgaGVpZ2h0PTEwOSAgIHhvZmZzZXQ9LTE1ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT03MyAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xODcgIHg9MTAwOCAgeT0xMjc3ICB3aWR0aD0xMTEgICBoZWlnaHQ9MTEwICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTU0ICAgIHhhZHZhbmNlPTc1ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE4OCAgeD0yNTQyICB5PTc1OCAgIHdpZHRoPTE1NCAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTE3ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTg5ICB4PTIzNzIgIHk9NzYwICAgd2lkdGg9MTU4ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xMjQgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xOTAgIHg9MTEyOSAgeT03NzYgICB3aWR0aD0xNTkgICBoZWlnaHQ9MTYzICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTEyNCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE5MSAgeD05MjUgICB5PTc3NyAgIHdpZHRoPTExMyAgIGhlaWdodD0xNjQgICB4b2Zmc2V0PS0xOSAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9NzYgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTkyICB4PTE2MiAgIHk9MjI1ICAgd2lkdGg9MTUwICAgaGVpZ2h0PTE5MiAgIHhvZmZzZXQ9LTIzICAgeW9mZnNldD0tMTYgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xOTMgIHg9MzI0ICAgeT0yMTQgICB3aWR0aD0xNTAgICBoZWlnaHQ9MTkyICAgeG9mZnNldD0tMjMgICB5b2Zmc2V0PS0xNiAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE5NCAgeD0wICAgICB5PTIyNSAgIHdpZHRoPTE1MCAgIGhlaWdodD0xOTIgICB4b2Zmc2V0PS0yMyAgIHlvZmZzZXQ9LTE2ICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTk1ICB4PTEzNTkgIHk9MjEwICAgd2lkdGg9MTUwICAgaGVpZ2h0PTE5MCAgIHhvZmZzZXQ9LTIzICAgeW9mZnNldD0tMTQgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xOTYgIHg9MTgxNCAgeT0yMDggICB3aWR0aD0xNTAgICBoZWlnaHQ9MTg4ICAgeG9mZnNldD0tMjMgICB5b2Zmc2V0PS0xMiAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE5NyAgeD0xMDE2ICB5PTAgICAgIHdpZHRoPTE1MCAgIGhlaWdodD0xOTkgICB4b2Zmc2V0PS0yMyAgIHlvZmZzZXQ9LTIzICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTk4ICB4PTE3OTIgIHk9NzY5ICAgd2lkdGg9MTk4ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTI2ICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xNTAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xOTkgIHg9MTE3OCAgeT0wICAgICB3aWR0aD0xMzcgICBoZWlnaHQ9MTk4ICAgeG9mZnNldD0tMTUgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIwMCAgeD0yOTIyICB5PTAgICAgIHdpZHRoPTEyMiAgIGhlaWdodD0xOTIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9LTE2ICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjAxICB4PTY0MSAgIHk9MjE0ICAgd2lkdGg9MTIyICAgaGVpZ2h0PTE5MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0tMTYgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMDIgIHg9Nzc1ICAgeT0yMTMgICB3aWR0aD0xMjIgICBoZWlnaHQ9MTkyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PS0xNiAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIwMyAgeD0xOTc2ICB5PTIwNyAgIHdpZHRoPTEyMiAgIGhlaWdodD0xODggICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9LTEyICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjA0ICB4PTEwMTggIHk9MjExICAgd2lkdGg9ODIgICAgaGVpZ2h0PTE5MiAgIHhvZmZzZXQ9LTI3ICAgeW9mZnNldD0tMTYgICB4YWR2YW5jZT00NCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMDUgIHg9MTExMiAgeT0yMTEgICB3aWR0aD04MiAgICBoZWlnaHQ9MTkyICAgeG9mZnNldD0tMTEgICB5b2Zmc2V0PS0xNiAgIHhhZHZhbmNlPTQ0ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIwNiAgeD05MDkgICB5PTIxMyAgIHdpZHRoPTk3ICAgIGhlaWdodD0xOTIgICB4b2Zmc2V0PS0yNyAgIHlvZmZzZXQ9LTE2ICAgeGFkdmFuY2U9NDQgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjA3ICB4PTIxMTAgIHk9MjA3ICAgd2lkdGg9MTAwICAgaGVpZ2h0PTE4OCAgIHhvZmZzZXQ9LTI4ICAgeW9mZnNldD0tMTIgICB4YWR2YW5jZT00NCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMDggIHg9MCAgICAgeT05NjkgICB3aWR0aD0xNDUgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMjIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTEwNyAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIwOSAgeD0xNTIxICB5PTIwOCAgIHdpZHRoPTEzNyAgIGhlaWdodD0xOTAgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9LTE0ICAgeGFkdmFuY2U9MTE0ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjEwICB4PTIxODQgIHk9MCAgICAgd2lkdGg9MTQxICAgaGVpZ2h0PTE5NSAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0tMTcgICB4YWR2YW5jZT0xMTAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMTEgIHg9MjAzMSAgeT0wICAgICB3aWR0aD0xNDEgICBoZWlnaHQ9MTk1ICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PS0xNyAgIHhhZHZhbmNlPTExMCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIxMiAgeD0xODc4ICB5PTAgICAgIHdpZHRoPTE0MSAgIGhlaWdodD0xOTUgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9LTE3ICAgeGFkdmFuY2U9MTEwICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjEzICB4PTI3NjkgIHk9MCAgICAgd2lkdGg9MTQxICAgaGVpZ2h0PTE5MyAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0tMTUgICB4YWR2YW5jZT0xMTAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMTQgIHg9MTIwNiAgeT0yMTAgICB3aWR0aD0xNDEgICBoZWlnaHQ9MTkxICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PS0xMyAgIHhhZHZhbmNlPTExMCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIxNSAgeD0yNzkgICB5PTEzMTYgIHdpZHRoPTEyMCAgIGhlaWdodD0xMjAgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9NDAgICAgeGFkdmFuY2U9ODUgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjE2ICB4PTI2NTUgIHk9MjA2ICAgd2lkdGg9MTQzICAgaGVpZ2h0PTE3NCAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0xMCAgICB4YWR2YW5jZT0xMTAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMTcgIHg9MjYyNSAgeT0wICAgICB3aWR0aD0xMzIgICBoZWlnaHQ9MTk0ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PS0xNiAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIxOCAgeD0yNDgxICB5PTAgICAgIHdpZHRoPTEzMiAgIGhlaWdodD0xOTQgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9LTE2ICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjE5ICB4PTIzMzcgIHk9MCAgICAgd2lkdGg9MTMyICAgaGVpZ2h0PTE5NCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD0tMTYgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMjAgIHg9MTY3MCAgeT0yMDggICB3aWR0aD0xMzIgICBoZWlnaHQ9MTkwICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PS0xMiAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIyMSAgeD00ODYgICB5PTIxNCAgIHdpZHRoPTE0MyAgIGhlaWdodD0xOTIgICB4b2Zmc2V0PS0yNCAgIHlvZmZzZXQ9LTE2ICAgeGFkdmFuY2U9OTYgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjIyICB4PTIzNjAgIHk9OTM5ICAgd2lkdGg9MTI0ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT05NSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMjMgIHg9MTIxICAgeT00MjkgICB3aWR0aD0xMjcgICBoZWlnaHQ9MTcxICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTcgICAgIHhhZHZhbmNlPTk1ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIyNCAgeD0xNjA0ICB5PTQxMCAgIHdpZHRoPTExOSAgIGhlaWdodD0xNzAgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9ODcgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjI1ICB4PTE0NzMgIHk9NDEyICAgd2lkdGg9MTE5ICAgaGVpZ2h0PTE3MCAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT04NyAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMjYgIHg9MTczNSAgeT00MTAgICB3aWR0aD0xMTkgICBoZWlnaHQ9MTcwICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTg3ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIyNyAgeD01MzIgICB5PTYwMCAgIHdpZHRoPTExOSAgIGhlaWdodD0xNjcgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9MTEgICAgeGFkdmFuY2U9ODcgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjI4ICB4PTI5MjYgIHk9NTY5ICAgd2lkdGg9MTE5ICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT04NyAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMjkgIHg9MjUyNCAgeT0yMDYgICB3aWR0aD0xMTkgICBoZWlnaHQ9MTc3ICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTEgICAgIHhhZHZhbmNlPTg3ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIzMCAgeD05OTYgICB5PTExMjkgIHdpZHRoPTE3MyAgIGhlaWdodD0xMzYgICB4b2Zmc2V0PS0xOSAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9MTM1ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjMxICB4PTE5NzkgIHk9NDA3ICAgd2lkdGg9MTIwICAgaGVpZ2h0PTE2OSAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT04NCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMzIgIHg9MTA3NiAgeT00MTUgICB3aWR0aD0xMjEgICBoZWlnaHQ9MTcwICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTg1ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIzMyAgeD05NDMgICB5PTQxNyAgIHdpZHRoPTEyMSAgIGhlaWdodD0xNzAgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9ODUgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjM0ICB4PTgxMCAgIHk9NDE3ICAgd2lkdGg9MTIxICAgaGVpZ2h0PTE3MCAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT04NSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMzUgIHg9Mjc5MyAgeT01NzIgICB3aWR0aD0xMjEgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTg1ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIzNiAgeD03NzIgICB5PTYwMCAgIHdpZHRoPTgyICAgIGhlaWdodD0xNjcgICB4b2Zmc2V0PS0yOSAgIHlvZmZzZXQ9OSAgICAgeGFkdmFuY2U9NDAgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjM3ICB4PTI5NzAgIHk9Mzg4ICAgd2lkdGg9ODIgICAgaGVpZ2h0PTE2NyAgIHhvZmZzZXQ9LTEzICAgeW9mZnNldD05ICAgICB4YWR2YW5jZT00MCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMzggIHg9NjYzICAgeT02MDAgICB3aWR0aD05NyAgICBoZWlnaHQ9MTY3ICAgeG9mZnNldD0tMjkgICB5b2Zmc2V0PTkgICAgIHhhZHZhbmNlPTQwICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIzOSAgeD0wICAgICB5PTExNDMgIHdpZHRoPTEwMCAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0zMCAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9NDAgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjQwICB4PTI4MTAgIHk9MjA1ICAgd2lkdGg9MTIzICAgaGVpZ2h0PTE3MyAgIHhvZmZzZXQ9LTE1ICAgeW9mZnNldD01ICAgICB4YWR2YW5jZT05NCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yNDEgIHg9MCAgICAgeT03OTIgICB3aWR0aD0xMTYgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTExICAgIHhhZHZhbmNlPTg4ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTI0MiAgeD0yNjAgICB5PTQyOSAgIHdpZHRoPTEyNyAgIGhlaWdodD0xNzAgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjQzICB4PTUzOCAgIHk9NDE4ICAgd2lkdGg9MTI3ICAgaGVpZ2h0PTE3MCAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yNDQgIHg9Mzk5ICAgeT00MTggICB3aWR0aD0xMjcgICBoZWlnaHQ9MTcwICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTI0NSAgeD0yODMxICB5PTM5MCAgIHdpZHRoPTEyNyAgIGhlaWdodD0xNjcgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9MTEgICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjQ2ICB4PTIyNTMgIHk9NTgzICAgd2lkdGg9MTI3ICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yNDcgIHg9MTQwICAgeT0xMzE3ICB3aWR0aD0xMjcgICBoZWlnaHQ9MTI4ICAgeG9mZnNldD0tMTkgICB5b2Zmc2V0PTM0ICAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTI0OCAgeD01NjQgICB5PTExMjkgIHdpZHRoPTEyNiAgIGhlaWdodD0xNTMgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9MzQgICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjQ5ICB4PTIxMTEgIHk9NDA3ICAgd2lkdGg9MTE2ICAgaGVpZ2h0PTE2OSAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD05ICAgICB4YWR2YW5jZT04OCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yNTAgIHg9MjIzOSAgeT00MDIgICB3aWR0aD0xMTYgICBoZWlnaHQ9MTY5ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTkgICAgIHhhZHZhbmNlPTg4ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTI1MSAgeD0yMzY3ICB5PTQwMiAgIHdpZHRoPTExNiAgIGhlaWdodD0xNjkgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9OSAgICAgeGFkdmFuY2U9ODggICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjUyICB4PTY3MiAgIHk9Nzc5ICAgd2lkdGg9MTE2ICAgaGVpZ2h0PTE2NCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT04OCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yNTMgIHg9NzQ5ICAgeT0wICAgICB3aWR0aD0xMjIgICBoZWlnaHQ9MjAxICAgeG9mZnNldD0tMjMgICB5b2Zmc2V0PTkgICAgIHhhZHZhbmNlPTc2ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTI1NCAgeD04ODMgICB5PTAgICAgIHdpZHRoPTEyMSAgIGhlaWdodD0yMDEgICB4b2Zmc2V0PS0xMyAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9OTIgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjU1ICB4PTE3NDQgIHk9MCAgICAgd2lkdGg9MTIyICAgaGVpZ2h0PTE5NiAgIHhvZmZzZXQ9LTIzICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT03NiAgICBwYWdlPTAgIGNobmw9MTVcclxua2VybmluZ3MgY291bnQ9MTY4NlxyXG5rZXJuaW5nIGZpcnN0PTMyICBzZWNvbmQ9ODQgIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTQwICBzZWNvbmQ9ODYgIGFtb3VudD0yXHJcbmtlcm5pbmcgZmlyc3Q9NDAgIHNlY29uZD04NyAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD00MCAgc2Vjb25kPTg5ICBhbW91bnQ9MlxyXG5rZXJuaW5nIGZpcnN0PTQwICBzZWNvbmQ9MjIxIGFtb3VudD0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD00NCAgYW1vdW50PS0xOFxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9NDYgIGFtb3VudD0tMThcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTY1ICBhbW91bnQ9LTEzXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD03NCAgYW1vdW50PS0yMVxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9ODQgIGFtb3VudD0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD05NyAgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD05OSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xMDAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xMDEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xMDMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xMTEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xMTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xMTcgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xMTggYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xMjEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xOTIgYW1vdW50PS0xM1xyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTkzIGFtb3VudD0tMTNcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTE5NCBhbW91bnQ9LTEzXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xOTUgYW1vdW50PS0xM1xyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTk2IGFtb3VudD0tMTNcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTE5NyBhbW91bnQ9LTEzXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yMjQgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yMjUgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yMjYgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yMjcgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yMjggYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yMjkgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yMzEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yMzIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yMzMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yMzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yMzUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yNDIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yNDMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yNDQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yNDUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yNDYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yNDkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yNTAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yNTEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yNTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yNTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0yNTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODEgIHNlY29uZD04NCAgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODEgIHNlY29uZD04NiAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODEgIHNlY29uZD04NyAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODEgIHNlY29uZD04OSAgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODEgIHNlY29uZD0yMjEgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODIgIHNlY29uZD04NCAgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9ODIgIHNlY29uZD04NiAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODIgIHNlY29uZD04OSAgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9ODIgIHNlY29uZD0yMjEgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9OTEgIHNlY29uZD03NCAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9OTEgIHNlY29uZD04NSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9OTEgIHNlY29uZD0yMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9OTEgIHNlY29uZD0yMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9OTEgIHNlY29uZD0yMTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9OTEgIHNlY29uZD0yMjAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD0zNCAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTM5ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9OTkgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9MTAwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9MTAxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9MTAzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9MTEzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9MjMxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9MjMyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9MjMzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9MjM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9MjM1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9OTkgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9MTAwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9MTAxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9MTAzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9MTEzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9MjMxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9MjMyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9MjMzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9MjM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9MjM1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTExNiBzZWNvbmQ9MTExIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTExNiBzZWNvbmQ9MjQyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTExNiBzZWNvbmQ9MjQzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTExNiBzZWNvbmQ9MjQ0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTExNiBzZWNvbmQ9MjQ1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTExNiBzZWNvbmQ9MjQ2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTExOSBzZWNvbmQ9NDQgIGFtb3VudD0tMTBcclxua2VybmluZyBmaXJzdD0xMTkgc2Vjb25kPTQ2ICBhbW91bnQ9LTEwXHJcbmtlcm5pbmcgZmlyc3Q9MTIzIHNlY29uZD03NCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTIzIHNlY29uZD04NSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTIzIHNlY29uZD0yMTcgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTIzIHNlY29uZD0yMTggYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTIzIHNlY29uZD0yMTkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTIzIHNlY29uZD0yMjAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0zNCAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0zOSAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xMTEgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yNDIgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yNDMgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yNDQgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yNDUgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yNDYgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD02NSAgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xOTIgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xOTMgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xOTQgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xOTUgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xOTYgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xOTcgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD05OSAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xMDAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xMDEgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xMDMgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xMTMgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yMzEgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yMzIgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yMzMgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yMzQgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yMzUgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xMDkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xMTAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xMTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yNDEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD05NyAgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yMjQgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yMjUgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yMjYgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yMjcgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yMjggYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0yMjkgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MzQgIHNlY29uZD0xMTUgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0zNCAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0zOSAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xMTEgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yNDIgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yNDMgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yNDQgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yNDUgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yNDYgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD02NSAgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xOTIgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xOTMgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xOTQgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xOTUgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xOTYgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xOTcgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD05OSAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xMDAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xMDEgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xMDMgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xMTMgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yMzEgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yMzIgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yMzMgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yMzQgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yMzUgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xMDkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xMTAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xMTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yNDEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD05NyAgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yMjQgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yMjUgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yMjYgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yMjcgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yMjggYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0yMjkgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MzkgIHNlY29uZD0xMTUgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9NDQgIHNlY29uZD0zNCAgYW1vdW50PS0xM1xyXG5rZXJuaW5nIGZpcnN0PTQ0ICBzZWNvbmQ9MzkgIGFtb3VudD0tMTNcclxua2VybmluZyBmaXJzdD00NiAgc2Vjb25kPTM0ICBhbW91bnQ9LTEzXHJcbmtlcm5pbmcgZmlyc3Q9NDYgIHNlY29uZD0zOSAgYW1vdW50PS0xM1xyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MTE4IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MTIxIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjUzIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjU1IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9NjcgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9NzEgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9NzkgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9ODEgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjE2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MTk5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjEwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjEyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjEzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjE0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9ODUgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjE5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjIwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MzQgIGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MzkgIGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MTExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjQyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjQzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9ODcgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9ODQgIGFtb3VudD0tMTBcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTExNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTI0OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTI1MCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTI1MSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTI1MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTEyMiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9ODYgIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9ODkgIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTY1ICBzZWNvbmQ9MjIxIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTY2ICBzZWNvbmQ9ODQgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTY2ICBzZWNvbmQ9ODYgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTY2ICBzZWNvbmQ9ODkgIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTY2ICBzZWNvbmQ9MjIxIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTY3ICBzZWNvbmQ9ODQgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9ODQgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9ODYgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9ODkgIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9MjIxIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9NjUgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9MTkyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9MTkzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9MTk0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9MTk1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9MTk2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9MTk3IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9ODggIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9NDQgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9NDYgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTY4ICBzZWNvbmQ9OTAgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MTE4IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MTIxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjUzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjU1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MTExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjQyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjQzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9ODQgIGFtb3VudD0yXHJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0xMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yNDkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yNTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yNTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yNTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD05OSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0xMDAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0xMDEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0xMDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0xMTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yMzEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yMzIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yMzMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yMzQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjkgIHNlY29uZD0yMzUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzIgIHNlY29uZD04NCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzIgIHNlY29uZD04OSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzIgIHNlY29uZD0yMjEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzIgIHNlY29uZD02NSAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03MiAgc2Vjb25kPTE5MiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTcyICBzZWNvbmQ9MTkzIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzIgIHNlY29uZD0xOTQgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03MiAgc2Vjb25kPTE5NSBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTcyICBzZWNvbmQ9MTk2IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzIgIHNlY29uZD0xOTcgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03MiAgc2Vjb25kPTg4ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTczICBzZWNvbmQ9ODQgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTczICBzZWNvbmQ9ODkgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTczICBzZWNvbmQ9MjIxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTczICBzZWNvbmQ9NjUgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzMgIHNlY29uZD0xOTIgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03MyAgc2Vjb25kPTE5MyBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTczICBzZWNvbmQ9MTk0IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzMgIHNlY29uZD0xOTUgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03MyAgc2Vjb25kPTE5NiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTczICBzZWNvbmQ9MTk3IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzMgIHNlY29uZD04OCAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03NCAgc2Vjb25kPTY1ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NCAgc2Vjb25kPTE5MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NCAgc2Vjb25kPTE5MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NCAgc2Vjb25kPTE5NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NCAgc2Vjb25kPTE5NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NCAgc2Vjb25kPTE5NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NCAgc2Vjb25kPTE5NyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTExOCBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTEyMSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTI1MyBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTI1NSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTY3ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTcxICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTc5ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTgxICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTIxNiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTE5OSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTIxMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTIxMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTIxMiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTIxMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTIxNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTExMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTI0MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTI0MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTI0NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTI0NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTI0NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTExNyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTI0OSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTI1MCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTI1MSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTI1MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTk5ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTEwMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTEwMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTEwMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTExMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTIzMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTIzMiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTIzMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTIzNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTIzNSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTQ1ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTE3MyBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTEwOSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTExMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTExMiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NSAgc2Vjb25kPTI0MSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTExOCBhbW91bnQ9LTEwXHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0xMjEgYW1vdW50PS0xMFxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjUzIGFtb3VudD0tMTBcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTI1NSBhbW91bnQ9LTEwXHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD02NyAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD03MSAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD03OSAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD04MSAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yMTYgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0xOTkgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yMTAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yMTEgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yMTIgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yMTMgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yMTQgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD04NSAgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yMTcgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yMTggYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yMTkgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yMjAgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0zNCAgYW1vdW50PS0yNlxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MzkgIGFtb3VudD0tMjZcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTg3ICBhbW91bnQ9LTExXHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD04NCAgYW1vdW50PS0yMVxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MTE3IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjQ5IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjUwIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjUxIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjUyIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9ODYgIGFtb3VudD0tMTRcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTg5ICBhbW91bnQ9LTE5XHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yMjEgYW1vdW50PS0xOVxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9NjUgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0xOTIgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTE5MyBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MTk0IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0xOTUgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTE5NiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MTk3IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzcgIHNlY29uZD04NCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzcgIHNlY29uZD04OSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzcgIHNlY29uZD0yMjEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzcgIHNlY29uZD02NSAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03NyAgc2Vjb25kPTE5MiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTc3ICBzZWNvbmQ9MTkzIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzcgIHNlY29uZD0xOTQgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03NyAgc2Vjb25kPTE5NSBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTc3ICBzZWNvbmQ9MTk2IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzcgIHNlY29uZD0xOTcgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03NyAgc2Vjb25kPTg4ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTc4ICBzZWNvbmQ9ODQgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc4ICBzZWNvbmQ9ODkgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc4ICBzZWNvbmQ9MjIxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc4ICBzZWNvbmQ9NjUgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzggIHNlY29uZD0xOTIgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03OCAgc2Vjb25kPTE5MyBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTc4ICBzZWNvbmQ9MTk0IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzggIHNlY29uZD0xOTUgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03OCAgc2Vjb25kPTE5NiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTc4ICBzZWNvbmQ9MTk3IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzggIHNlY29uZD04OCAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTg0ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTg2ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTg5ICBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTIyMSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTY1ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTE5MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTE5MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTE5NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTE5NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTE5NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTE5NyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTg4ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTQ0ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTQ2ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD03OSAgc2Vjb25kPTkwICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTExOCBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MTIxIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yNTMgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTI1NSBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MTExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjQyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjQzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9NjUgIGFtb3VudD0tMTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTE5MiBhbW91bnQ9LTExXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0xOTMgYW1vdW50PS0xMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MTk0IGFtb3VudD0tMTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTE5NSBhbW91bnQ9LTExXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0xOTYgYW1vdW50PS0xMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MTk3IGFtb3VudD0tMTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTg4ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTQ0ICBhbW91bnQ9LTI1XHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD00NiAgYW1vdW50PS0yNVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9OTAgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9OTkgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MTAwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MTAxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MTAzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MTEzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjMxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjMyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjMzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjM0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjM1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9OTcgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjI0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjI1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjI2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjI3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjI4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjI5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9NzQgIGFtb3VudD0tMTZcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTExOCBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTEyMSBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTI1MyBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTI1NSBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTY3ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTcxICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTc5ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTgxICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIxNiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTE5OSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIxMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIxMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIxMiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIxMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIxNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTExMSBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTI0MiBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTI0MyBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTI0NCBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTI0NSBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTI0NiBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTg3ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9ODQgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMTcgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yNDkgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yNTAgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yNTEgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yNTIgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMjIgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD04NiAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTg5ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjIxIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD02NSAgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xOTIgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xOTMgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xOTQgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xOTUgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xOTYgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xOTcgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD00NCAgYW1vdW50PS0xN1xyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9NDYgIGFtb3VudD0tMTdcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTk5ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTEwMCBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTEwMSBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTEwMyBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTExMyBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIzMSBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIzMiBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIzMyBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIzNCBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIzNSBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTEyMCBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTQ1ICBhbW91bnQ9LTE4XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xNzMgYW1vdW50PS0xOFxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTA5IGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTEwIGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTEyIGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjQxIGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9ODMgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9OTcgIGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjI0IGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjI1IGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjI2IGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjI3IGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjI4IGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjI5IGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTE1IGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9NzQgIGFtb3VudD0tMTlcclxua2VybmluZyBmaXJzdD04NSAgc2Vjb25kPTY1ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NSAgc2Vjb25kPTE5MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NSAgc2Vjb25kPTE5MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NSAgc2Vjb25kPTE5NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NSAgc2Vjb25kPTE5NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NSAgc2Vjb25kPTE5NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NSAgc2Vjb25kPTE5NyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTY3ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTcxICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTc5ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTgxICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIxNiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTE5OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIxMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIxMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIxMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIxMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIxNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTExMSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTI0MiBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTI0MyBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTI0NCBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTI0NSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTI0NiBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTExNyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTI0OSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTI1MCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTI1MSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTI1MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTY1ICBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTE5MiBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTE5MyBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTE5NCBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTE5NSBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTE5NiBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTE5NyBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTQ0ICBhbW91bnQ9LTE4XHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD00NiAgYW1vdW50PS0xOFxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9OTkgIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTAwIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTAxIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTAzIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTEzIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjMxIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjMyIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjMzIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjM0IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjM1IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9NDUgIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MTczIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9OTcgIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjI0IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjI1IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjI2IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjI3IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjI4IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9MjI5IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MTExIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjQyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjQzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjQ0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjQ1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjQ2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9ODQgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0xMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yNDkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yNTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yNTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yNTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD02NSAgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0xOTIgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0xOTMgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0xOTQgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0xOTUgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0xOTYgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0xOTcgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD00NCAgYW1vdW50PS0xMFxyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9NDYgIGFtb3VudD0tMTBcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTk5ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTEwMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTEwMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTEwMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTExMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTIzMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTIzMiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTIzMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTIzNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTIzNSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTQ1ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTE3MyBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTk3ICBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTIyNCBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTIyNSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTIyNiBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTIyNyBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTIyOCBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTIyOSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTExOCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTEyMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTI1MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTI1NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTY3ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTcxICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTc5ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTgxICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTIxNiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTE5OSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTIxMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTIxMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTIxMiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTIxMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTIxNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTExMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTI0MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTI0MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTI0NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTI0NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTI0NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTExNyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTI0OSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTI1MCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTI1MSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTI1MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTg2ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9OTkgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MTAwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MTAxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MTAzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MTEzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjMxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjMyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjMzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MjM1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9NDUgIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTg4ICBzZWNvbmQ9MTczIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTE4IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTIxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjUzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjU1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9NjcgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9NzEgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9NzkgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9ODEgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjE2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTk5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjEwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjExIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjEyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjEzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjE0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9ODUgIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjE3IGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjE4IGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjE5IGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjIwIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTExIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjQyIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjQzIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjQ0IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjQ1IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjQ2IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9ODcgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD04NCAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTExNyBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTI0OSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTI1MCBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTI1MSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTI1MiBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTEyMiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTg2ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9ODkgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMjEgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTY1ICBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTE5MiBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTE5MyBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTE5NCBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTE5NSBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTE5NiBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTE5NyBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTg4ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9NDQgIGFtb3VudD0tMTZcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTQ2ICBhbW91bnQ9LTE2XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD05OSAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMDAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMDEgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMDMgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMTMgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMzEgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMzIgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMzMgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMzQgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMzUgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMjAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD00NSAgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xNzMgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMDkgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMTAgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMTIgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yNDEgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD04MyAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD05NyAgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMjQgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMjUgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMjYgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMjcgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMjggYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yMjkgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMTUgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD03NCAgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xMTggYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xMjEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yNTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yNTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD02NyAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD03MSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD03OSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD04MSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yMTYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xOTkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yMTAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yMTEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yMTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yMTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yMTQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xMTEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yNDIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yNDMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yNDQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yNDUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yNDYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yNDkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yNTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yNTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yNTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD02NSAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTE5MiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTkzIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xOTQgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTE5NSBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTk2IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xOTcgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTk5ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTEwMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTEwMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTEwMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTExMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTIzMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTIzMiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTIzMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTIzNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTIzNSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05NyAgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD05NyAgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD05NyAgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD05NyAgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD05NyAgc2Vjb25kPTM0ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD05NyAgc2Vjb25kPTM5ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD05OCAgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD05OCAgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD05OCAgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD05OCAgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD05OCAgc2Vjb25kPTM0ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05OCAgc2Vjb25kPTM5ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD05OCAgc2Vjb25kPTEyMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD05OCAgc2Vjb25kPTEyMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD05OSAgc2Vjb25kPTM0ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD05OSAgc2Vjb25kPTM5ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMDEgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMDEgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMDEgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMDEgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMDEgc2Vjb25kPTM0ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMDEgc2Vjb25kPTM5ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMDQgc2Vjb25kPTM0ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0xMDQgc2Vjb25kPTM5ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0xMDkgc2Vjb25kPTM0ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0xMDkgc2Vjb25kPTM5ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0xMTAgc2Vjb25kPTM0ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0xMTAgc2Vjb25kPTM5ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTM0ICBhbW91bnQ9LTExXHJcbmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD0zOSAgYW1vdW50PS0xMVxyXG5rZXJuaW5nIGZpcnN0PTExMSBzZWNvbmQ9MTIyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExMSBzZWNvbmQ9MTIwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTExMiBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExMiBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExMiBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExMiBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExMiBzZWNvbmQ9MzQgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTExMiBzZWNvbmQ9MzkgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTExMiBzZWNvbmQ9MTIyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExMiBzZWNvbmQ9MTIwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MTE4IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0xMjEgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTI1MyBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjU1IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0zNCAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTM5ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MTExIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjQyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjQzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjQ0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjQ1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjQ2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9NDQgIGFtb3VudD0tMTBcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTQ2ICBhbW91bnQ9LTEwXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD05OSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0xMDAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0xMDEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0xMDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0xMTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMzEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMzIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMzMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMzQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMzUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD05NyAgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMjQgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMjUgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMjYgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMjcgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMjggYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMjkgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0zNCAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTM5ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MTExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjQyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjQzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9NDQgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9NDYgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9OTkgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MTAwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MTAxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MTAzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MTEzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjMxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjMyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjMzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjM0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjM1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9OTcgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjI0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjI1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjI2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjI3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjI4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MjI5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MTExIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MjQyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MjQzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MjQ0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MjQ1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MjQ2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9OTkgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MTAwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MTAxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MTAzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MTEzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MjMxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MjMyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MjMzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MjM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9MjM1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MzQgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0zOSAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTExMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTI0MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTI0MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTI0NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTI0NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTI0NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTQ0ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTQ2ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTk5ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTEwMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTEwMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTEwMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTExMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTIzMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTIzMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTIzMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTIzNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTIzNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTk3ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTIyNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTIyNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTIyNiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTIyNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTIyOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTIyOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTExMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTI0MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTI0MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTI0NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTI0NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTI0NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTk5ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTEwMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTEwMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTEwMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTExMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTIzMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTIzMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTIzMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTIzNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTIzNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTQgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTQgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTQgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTQgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTQgc2Vjb25kPTM0ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yNTQgc2Vjb25kPTM5ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yNTQgc2Vjb25kPTEyMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTQgc2Vjb25kPTEyMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTg0ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTg2ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTg5ICBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTIyMSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTY1ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTE5MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTE5MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTE5NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTE5NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTE5NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTE5NyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTg4ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTQ0ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTQ2ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTkwICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTExOCBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTEyMSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTI1MyBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTI1NSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTY3ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTcxICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTc5ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTgxICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTIxNiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTE5OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTIxMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTIxMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTIxMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTIxMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTIxNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTg1ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTIxNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTIxOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTIxOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTIyMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTM0ICBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTM5ICBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTExMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTI0MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTI0MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTI0NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTI0NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTI0NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTg3ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTg0ICBhbW91bnQ9LTEwXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0xMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yNDkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yNTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yNTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yNTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0xMjIgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTg2ICBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTg5ICBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTIyMSBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTExOCBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTEyMSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTI1MyBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTI1NSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTY3ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTcxICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTc5ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTgxICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTIxNiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTE5OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTIxMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTIxMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTIxMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTIxMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTIxNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTg1ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTIxNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTIxOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTIxOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTIyMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTM0ICBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTM5ICBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTExMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTI0MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTI0MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTI0NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTI0NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTI0NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTg3ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTg0ICBhbW91bnQ9LTEwXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0xMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yNDkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yNTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yNTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yNTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0xMjIgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTg2ICBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTg5ICBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTIyMSBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTExOCBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTEyMSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTI1MyBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTI1NSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTY3ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTcxICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTc5ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTgxICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTIxNiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTE5OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTIxMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTIxMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTIxMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTIxMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTIxNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTg1ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTIxNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTIxOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTIxOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTIyMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTM0ICBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTM5ICBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTExMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTI0MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTI0MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTI0NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTI0NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTI0NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTg3ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTg0ICBhbW91bnQ9LTEwXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0xMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yNDkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yNTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yNTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yNTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0xMjIgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTg2ICBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTg5ICBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTIyMSBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTExOCBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTEyMSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTI1MyBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTI1NSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTY3ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTcxICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTc5ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTgxICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTIxNiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTE5OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTIxMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTIxMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTIxMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTIxMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTIxNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTg1ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTIxNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTIxOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTIxOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTIyMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTM0ICBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTM5ICBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTExMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTI0MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTI0MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTI0NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTI0NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTI0NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTg3ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTg0ICBhbW91bnQ9LTEwXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0xMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yNDkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yNTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yNTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yNTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0xMjIgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTg2ICBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTg5ICBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTIyMSBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTExOCBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTEyMSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTI1MyBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTI1NSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTY3ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTcxICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTc5ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTgxICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTIxNiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTE5OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTIxMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTIxMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTIxMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTIxMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTIxNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTg1ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTIxNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTIxOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTIxOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTIyMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTM0ICBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTM5ICBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTExMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTI0MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTI0MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTI0NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTI0NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTI0NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTg3ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTg0ICBhbW91bnQ9LTEwXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0xMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yNDkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yNTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yNTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yNTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0xMjIgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTg2ICBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTg5ICBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTIyMSBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTExOCBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTEyMSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTI1MyBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTI1NSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTY3ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTcxICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTc5ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTgxICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTIxNiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTE5OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTIxMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTIxMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTIxMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTIxMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTIxNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTg1ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTIxNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTIxOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTIxOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTIyMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTM0ICBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTM5ICBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTExMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTI0MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTI0MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTI0NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTI0NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTI0NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTg3ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTg0ICBhbW91bnQ9LTEwXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0xMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yNDkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yNTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yNTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yNTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0xMjIgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTg2ICBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTg5ICBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTIyMSBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0xOTkgc2Vjb25kPTg0ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTExOCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTEyMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTI1MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTI1NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTExMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTI0MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTI0MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTI0NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTI0NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTI0NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTg0ICBhbW91bnQ9MlxyXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MTE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjUwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjUxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjUyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9OTkgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MTAwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MTAxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MTAzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MTEzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjMxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjMyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjMzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjM0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMCBzZWNvbmQ9MjM1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MTE4IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MTIxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjUzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjU1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MTExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjQyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjQzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9ODQgIGFtb3VudD0yXHJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0xMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yNDkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yNTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yNTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yNTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD05OSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0xMDAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0xMDEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0xMDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0xMTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yMzEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yMzIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yMzMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yMzQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAxIHNlY29uZD0yMzUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0xMTggYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0xMjEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yNTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yNTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0xMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yNDIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yNDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yNDQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yNDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yNDYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD04NCAgYW1vdW50PTJcclxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTExNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTI0OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTI1MCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTI1MSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTI1MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTk5ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTEwMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTEwMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTEwMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTExMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTIzMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTIzMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTIzMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTIzNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDIgc2Vjb25kPTIzNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTExOCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTEyMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTI1MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTI1NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTExMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTI0MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTI0MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTI0NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTI0NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTI0NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTg0ICBhbW91bnQ9MlxyXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MTE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjUwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjUxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjUyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9OTkgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MTAwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MTAxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MTAzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MTEzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjMxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjMyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjMzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjM0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMyBzZWNvbmQ9MjM1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwNCBzZWNvbmQ9ODQgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwNCBzZWNvbmQ9ODkgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwNCBzZWNvbmQ9MjIxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwNCBzZWNvbmQ9NjUgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA0IHNlY29uZD0xOTIgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDQgc2Vjb25kPTE5MyBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNCBzZWNvbmQ9MTk0IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA0IHNlY29uZD0xOTUgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDQgc2Vjb25kPTE5NiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNCBzZWNvbmQ9MTk3IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA0IHNlY29uZD04OCAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDUgc2Vjb25kPTg0ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDUgc2Vjb25kPTg5ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDUgc2Vjb25kPTIyMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDUgc2Vjb25kPTY1ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNSBzZWNvbmQ9MTkyIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA1IHNlY29uZD0xOTMgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDUgc2Vjb25kPTE5NCBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNSBzZWNvbmQ9MTk1IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA1IHNlY29uZD0xOTYgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDUgc2Vjb25kPTE5NyBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNSBzZWNvbmQ9ODggIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA2IHNlY29uZD04NCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjA2IHNlY29uZD04OSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjA2IHNlY29uZD0yMjEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjA2IHNlY29uZD02NSAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDYgc2Vjb25kPTE5MiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNiBzZWNvbmQ9MTkzIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA2IHNlY29uZD0xOTQgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDYgc2Vjb25kPTE5NSBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNiBzZWNvbmQ9MTk2IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA2IHNlY29uZD0xOTcgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDYgc2Vjb25kPTg4ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNyBzZWNvbmQ9ODQgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwNyBzZWNvbmQ9ODkgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwNyBzZWNvbmQ9MjIxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwNyBzZWNvbmQ9NjUgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA3IHNlY29uZD0xOTIgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDcgc2Vjb25kPTE5MyBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNyBzZWNvbmQ9MTk0IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA3IHNlY29uZD0xOTUgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDcgc2Vjb25kPTE5NiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNyBzZWNvbmQ9MTk3IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA3IHNlY29uZD04OCAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDkgc2Vjb25kPTg0ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDkgc2Vjb25kPTg5ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDkgc2Vjb25kPTIyMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDkgc2Vjb25kPTY1ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwOSBzZWNvbmQ9MTkyIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA5IHNlY29uZD0xOTMgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDkgc2Vjb25kPTE5NCBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwOSBzZWNvbmQ9MTk1IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA5IHNlY29uZD0xOTYgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDkgc2Vjb25kPTE5NyBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwOSBzZWNvbmQ9ODggIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD04NCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD04NiAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD04OSAgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD0yMjEgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD02NSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD0xOTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD0xOTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD0xOTQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD0xOTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD0xOTYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD0xOTcgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD04OCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD00NCAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD00NiAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD05MCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD04NCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD04NiAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD04OSAgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD0yMjEgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD02NSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD0xOTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD0xOTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD0xOTQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD0xOTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD0xOTYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD0xOTcgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD04OCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD00NCAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD00NiAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD05MCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD04NCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD04NiAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD04OSAgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD0yMjEgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD02NSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD0xOTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD0xOTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD0xOTQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD0xOTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD0xOTYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD0xOTcgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD04OCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD00NCAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD00NiAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD05MCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD04NCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD04NiAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD04OSAgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD0yMjEgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD02NSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD0xOTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD0xOTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD0xOTQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD0xOTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD0xOTYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD0xOTcgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD04OCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD00NCAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD00NiAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD05MCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD04NCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD04NiAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD04OSAgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD0yMjEgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD02NSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD0xOTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD0xOTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD0xOTQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD0xOTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD0xOTYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD0xOTcgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD04OCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD00NCAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD00NiAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD05MCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE3IHNlY29uZD02NSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE3IHNlY29uZD0xOTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE3IHNlY29uZD0xOTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE3IHNlY29uZD0xOTQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE3IHNlY29uZD0xOTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE3IHNlY29uZD0xOTYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE3IHNlY29uZD0xOTcgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE4IHNlY29uZD02NSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE4IHNlY29uZD0xOTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE4IHNlY29uZD0xOTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE4IHNlY29uZD0xOTQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE4IHNlY29uZD0xOTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE4IHNlY29uZD0xOTYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE4IHNlY29uZD0xOTcgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE5IHNlY29uZD02NSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE5IHNlY29uZD0xOTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE5IHNlY29uZD0xOTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE5IHNlY29uZD0xOTQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE5IHNlY29uZD0xOTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE5IHNlY29uZD0xOTYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjE5IHNlY29uZD0xOTcgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIwIHNlY29uZD02NSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIwIHNlY29uZD0xOTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIwIHNlY29uZD0xOTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIwIHNlY29uZD0xOTQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIwIHNlY29uZD0xOTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIwIHNlY29uZD0xOTYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIwIHNlY29uZD0xOTcgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMTggYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMjEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD02NyAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD03MSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD03OSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD04MSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMTYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xOTkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMTAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMTEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMTQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD04NSAgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMTcgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMTggYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMTkgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMjAgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMTEgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNDIgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNDMgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNDQgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNDUgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNDYgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD04NyAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTg0ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTE3IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjQ5IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjUwIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjUxIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjUyIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTIyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9ODYgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD04OSAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIyMSBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9NjUgIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTkyIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTkzIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTk0IGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTk1IGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTk2IGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTk3IGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9ODggIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD00NCAgYW1vdW50PS0xNlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9NDYgIGFtb3VudD0tMTZcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTk5ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTEwMCBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTEwMSBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTEwMyBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTExMyBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIzMSBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIzMiBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIzMyBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIzNCBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIzNSBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTEyMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTQ1ICBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTE3MyBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTEwOSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTExMCBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTExMiBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI0MSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTgzICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTk3ICBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIyNCBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIyNSBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIyNiBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIyNyBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIyOCBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIyOSBhbW91bnQ9LTZcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTExNSBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTc0ICBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0yMjQgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjQgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjQgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjQgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjQgc2Vjb25kPTM0ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjQgc2Vjb25kPTM5ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjUgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjUgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjUgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjUgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjUgc2Vjb25kPTM0ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjUgc2Vjb25kPTM5ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjYgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjYgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjYgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjYgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjYgc2Vjb25kPTM0ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjYgc2Vjb25kPTM5ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjcgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjcgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjcgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjcgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjcgc2Vjb25kPTM0ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjcgc2Vjb25kPTM5ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjggc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjggc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjggc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjggc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjggc2Vjb25kPTM0ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjggc2Vjb25kPTM5ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjkgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjkgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjkgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjkgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjkgc2Vjb25kPTM0ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMjkgc2Vjb25kPTM5ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0yMzEgc2Vjb25kPTM0ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMzEgc2Vjb25kPTM5ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMzIgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMzIgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMzIgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMzIgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMzIgc2Vjb25kPTM0ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMzIgc2Vjb25kPTM5ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMzMgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMzMgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMzMgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMzMgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMzMgc2Vjb25kPTM0ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMzMgc2Vjb25kPTM5ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMzQgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMzQgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMzQgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMzQgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMzQgc2Vjb25kPTM0ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMzQgc2Vjb25kPTM5ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMzUgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMzUgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMzUgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMzUgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMzUgc2Vjb25kPTM0ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMzUgc2Vjb25kPTM5ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDEgc2Vjb25kPTM0ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0yNDEgc2Vjb25kPTM5ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0yNDIgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDIgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDIgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDIgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDIgc2Vjb25kPTM0ICBhbW91bnQ9LTExXHJcbmtlcm5pbmcgZmlyc3Q9MjQyIHNlY29uZD0zOSAgYW1vdW50PS0xMVxyXG5rZXJuaW5nIGZpcnN0PTI0MiBzZWNvbmQ9MTIyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0MiBzZWNvbmQ9MTIwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTI0MyBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0MyBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0MyBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0MyBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0MyBzZWNvbmQ9MzQgIGFtb3VudD0tMTFcclxua2VybmluZyBmaXJzdD0yNDMgc2Vjb25kPTM5ICBhbW91bnQ9LTExXHJcbmtlcm5pbmcgZmlyc3Q9MjQzIHNlY29uZD0xMjIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQzIHNlY29uZD0xMjAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjQ0IHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQ0IHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQ0IHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQ0IHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQ0IHNlY29uZD0zNCAgYW1vdW50PS0xMVxyXG5rZXJuaW5nIGZpcnN0PTI0NCBzZWNvbmQ9MzkgIGFtb3VudD0tMTFcclxua2VybmluZyBmaXJzdD0yNDQgc2Vjb25kPTEyMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDQgc2Vjb25kPTEyMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yNDUgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDUgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDUgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDUgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDUgc2Vjb25kPTM0ICBhbW91bnQ9LTExXHJcbmtlcm5pbmcgZmlyc3Q9MjQ1IHNlY29uZD0zOSAgYW1vdW50PS0xMVxyXG5rZXJuaW5nIGZpcnN0PTI0NSBzZWNvbmQ9MTIyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0NSBzZWNvbmQ9MTIwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTI0NiBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0NiBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0NiBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0NiBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0NiBzZWNvbmQ9MzQgIGFtb3VudD0tMTFcclxua2VybmluZyBmaXJzdD0yNDYgc2Vjb25kPTM5ICBhbW91bnQ9LTExXHJcbmtlcm5pbmcgZmlyc3Q9MjQ2IHNlY29uZD0xMjIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQ2IHNlY29uZD0xMjAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0zNCAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTM5ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MTExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjQyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjQzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9NDQgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9NDYgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9OTkgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MTAwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MTAxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MTAzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MTEzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjMxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjMyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjMzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjM0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjM1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9OTcgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjI0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjI1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjI2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjI3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjI4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MjI5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MzQgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0zOSAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTExMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTI0MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTI0MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTI0NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTI0NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTI0NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTQ0ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTQ2ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTk5ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTEwMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTEwMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTEwMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTExMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTIzMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTIzMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTIzMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTIzNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTIzNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTk3ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTIyNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTIyNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTIyNiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTIyNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTIyOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTIyOSBhbW91bnQ9LTFcclxuYDtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ID0ge30gKXtcclxuXHJcbiAgY29uc3QgaW50ZXJhY3Rpb24gPSBjcmVhdGVJbnRlcmFjdGlvbiggcGFuZWwgKTtcclxuXHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgaGFuZGxlT25QcmVzcyApO1xyXG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ3RpY2snLCBoYW5kbGVUaWNrICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25SZWxlYXNlZCcsIGhhbmRsZU9uUmVsZWFzZSApO1xyXG5cclxuICBjb25zdCB0ZW1wTWF0cml4ID0gbmV3IFRIUkVFLk1hdHJpeDQoKTtcclxuICBjb25zdCB0UG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG5cclxuICBsZXQgb2xkUGFyZW50O1xyXG4gIFxyXG4gIGZ1bmN0aW9uIGdldFRvcExldmVsRm9sZGVyKGdyb3VwKSB7XHJcbiAgICB2YXIgZm9sZGVyID0gZ3JvdXAuZm9sZGVyO1xyXG4gICAgd2hpbGUgKGZvbGRlci5mb2xkZXIgIT09IGZvbGRlcikgZm9sZGVyID0gZm9sZGVyLmZvbGRlcjtcclxuICAgIHJldHVybiBmb2xkZXI7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVUaWNrKCB7IGlucHV0IH0gPSB7fSApe1xyXG4gICAgY29uc3QgZm9sZGVyID0gZ2V0VG9wTGV2ZWxGb2xkZXIoZ3JvdXApO1xyXG4gICAgaWYoIGZvbGRlciA9PT0gdW5kZWZpbmVkICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiggaW5wdXQubW91c2UgKXtcclxuICAgICAgaWYoIGlucHV0LnByZXNzZWQgJiYgaW5wdXQuc2VsZWN0ZWQgJiYgaW5wdXQucmF5Y2FzdC5yYXkuaW50ZXJzZWN0UGxhbmUoIGlucHV0Lm1vdXNlUGxhbmUsIGlucHV0Lm1vdXNlSW50ZXJzZWN0aW9uICkgKXtcclxuICAgICAgICBpZiggaW5wdXQuaW50ZXJhY3Rpb24ucHJlc3MgPT09IGludGVyYWN0aW9uICl7XHJcbiAgICAgICAgICBmb2xkZXIucG9zaXRpb24uY29weSggaW5wdXQubW91c2VJbnRlcnNlY3Rpb24uc3ViKCBpbnB1dC5tb3VzZU9mZnNldCApICk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYoIGlucHV0LmludGVyc2VjdGlvbnMubGVuZ3RoID4gMCApe1xyXG4gICAgICAgIGNvbnN0IGhpdE9iamVjdCA9IGlucHV0LmludGVyc2VjdGlvbnNbIDAgXS5vYmplY3Q7XHJcbiAgICAgICAgaWYoIGhpdE9iamVjdCA9PT0gcGFuZWwgKXtcclxuICAgICAgICAgIGhpdE9iamVjdC51cGRhdGVNYXRyaXhXb3JsZCgpO1xyXG4gICAgICAgICAgdFBvc2l0aW9uLnNldEZyb21NYXRyaXhQb3NpdGlvbiggaGl0T2JqZWN0Lm1hdHJpeFdvcmxkICk7XHJcblxyXG4gICAgICAgICAgaW5wdXQubW91c2VQbGFuZS5zZXRGcm9tTm9ybWFsQW5kQ29wbGFuYXJQb2ludCggaW5wdXQubW91c2VDYW1lcmEuZ2V0V29ybGREaXJlY3Rpb24oIGlucHV0Lm1vdXNlUGxhbmUubm9ybWFsICksIHRQb3NpdGlvbiApO1xyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coIGlucHV0Lm1vdXNlUGxhbmUgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZU9uUHJlc3MoIHAgKXtcclxuXHJcbiAgICBsZXQgeyBpbnB1dE9iamVjdCwgaW5wdXQgfSA9IHA7XHJcblxyXG4gICAgY29uc3QgZm9sZGVyID0gZ2V0VG9wTGV2ZWxGb2xkZXIoZ3JvdXApO1xyXG4gICAgaWYoIGZvbGRlciA9PT0gdW5kZWZpbmVkICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiggZm9sZGVyLmJlaW5nTW92ZWQgPT09IHRydWUgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBpbnB1dC5tb3VzZSApe1xyXG4gICAgICBpZiggaW5wdXQuaW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwICl7XHJcbiAgICAgICAgaWYoIGlucHV0LnJheWNhc3QucmF5LmludGVyc2VjdFBsYW5lKCBpbnB1dC5tb3VzZVBsYW5lLCBpbnB1dC5tb3VzZUludGVyc2VjdGlvbiApICl7XHJcbiAgICAgICAgICBjb25zdCBoaXRPYmplY3QgPSBpbnB1dC5pbnRlcnNlY3Rpb25zWyAwIF0ub2JqZWN0O1xyXG4gICAgICAgICAgaWYoIGhpdE9iamVjdCAhPT0gcGFuZWwgKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlucHV0LnNlbGVjdGVkID0gZm9sZGVyO1xyXG5cclxuICAgICAgICAgIGlucHV0LnNlbGVjdGVkLnVwZGF0ZU1hdHJpeFdvcmxkKCk7XHJcbiAgICAgICAgICB0UG9zaXRpb24uc2V0RnJvbU1hdHJpeFBvc2l0aW9uKCBpbnB1dC5zZWxlY3RlZC5tYXRyaXhXb3JsZCApO1xyXG5cclxuICAgICAgICAgIGlucHV0Lm1vdXNlT2Zmc2V0LmNvcHkoIGlucHV0Lm1vdXNlSW50ZXJzZWN0aW9uICkuc3ViKCB0UG9zaXRpb24gKTtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCBpbnB1dC5tb3VzZU9mZnNldCApO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBlbHNle1xyXG4gICAgICB0ZW1wTWF0cml4LmdldEludmVyc2UoIGlucHV0T2JqZWN0Lm1hdHJpeFdvcmxkICk7XHJcblxyXG4gICAgICBmb2xkZXIubWF0cml4LnByZW11bHRpcGx5KCB0ZW1wTWF0cml4ICk7XHJcbiAgICAgIGZvbGRlci5tYXRyaXguZGVjb21wb3NlKCBmb2xkZXIucG9zaXRpb24sIGZvbGRlci5xdWF0ZXJuaW9uLCBmb2xkZXIuc2NhbGUgKTtcclxuXHJcbiAgICAgIG9sZFBhcmVudCA9IGZvbGRlci5wYXJlbnQ7XHJcbiAgICAgIGlucHV0T2JqZWN0LmFkZCggZm9sZGVyICk7XHJcbiAgICB9XHJcblxyXG4gICAgcC5sb2NrZWQgPSB0cnVlO1xyXG5cclxuICAgIGZvbGRlci5iZWluZ01vdmVkID0gdHJ1ZTtcclxuXHJcbiAgICBpbnB1dC5ldmVudHMuZW1pdCggJ2dyYWJiZWQnLCBpbnB1dCApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlT25SZWxlYXNlKCBwICl7XHJcblxyXG4gICAgbGV0IHsgaW5wdXRPYmplY3QsIGlucHV0IH0gPSBwO1xyXG5cclxuICAgIGNvbnN0IGZvbGRlciA9IGdldFRvcExldmVsRm9sZGVyKGdyb3VwKTtcclxuICAgIGlmKCBmb2xkZXIgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGZvbGRlci5iZWluZ01vdmVkID09PSBmYWxzZSApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGlucHV0Lm1vdXNlICl7XHJcbiAgICAgIGlucHV0LnNlbGVjdGVkID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuXHJcbiAgICAgIGlmKCBvbGRQYXJlbnQgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgZm9sZGVyLm1hdHJpeC5wcmVtdWx0aXBseSggaW5wdXRPYmplY3QubWF0cml4V29ybGQgKTtcclxuICAgICAgZm9sZGVyLm1hdHJpeC5kZWNvbXBvc2UoIGZvbGRlci5wb3NpdGlvbiwgZm9sZGVyLnF1YXRlcm5pb24sIGZvbGRlci5zY2FsZSApO1xyXG4gICAgICBvbGRQYXJlbnQuYWRkKCBmb2xkZXIgKTtcclxuICAgICAgb2xkUGFyZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIGZvbGRlci5iZWluZ01vdmVkID0gZmFsc2U7XHJcblxyXG4gICAgaW5wdXQuZXZlbnRzLmVtaXQoICdncmFiUmVsZWFzZWQnLCBpbnB1dCApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGludGVyYWN0aW9uO1xyXG59IiwiZXhwb3J0IGNvbnN0IGdyYWJCYXIgPSAoZnVuY3Rpb24oKXtcclxuICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gIGltYWdlLnNyYyA9IGBkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVBQUFBQWdDQVlBQUFDaW5YNkVBQUFBQ1hCSVdYTUFBQzRqQUFBdUl3RjRwVDkyQUFBS1QybERRMUJRYUc5MGIzTm9iM0FnU1VORElIQnliMlpwYkdVQUFIamFuVk5uVkZQcEZqMzMzdlJDUzRpQWxFdHZVaFVJSUZKQ2k0QVVrU1lxSVFrUVNvZ2hvZGtWVWNFUlJVVUVHOGlnaUFPT2pvQ01GVkVzRElvSzJBZmtJYUtPZzZPSWlzcjc0WHVqYTlhODkrYk4vclhYUHVlczg1Mnp6d2ZBQ0F5V1NETlJOWUFNcVVJZUVlQ0R4OFRHNGVRdVFJRUtKSEFBRUFpelpDRnovU01CQVBoK1BEd3JJc0FIdmdBQmVOTUxDQURBVFp2QU1CeUgvdy9xUXBsY0FZQ0VBY0Iwa1RoTENJQVVBRUI2amtLbUFFQkdBWUNkbUNaVEFLQUVBR0RMWTJMakFGQXRBR0FuZitiVEFJQ2QrSmw3QVFCYmxDRVZBYUNSQUNBVFpZaEVBR2c3QUt6UFZvcEZBRmd3QUJSbVM4UTVBTmd0QURCSlYyWklBTEMzQU1ET0VBdXlBQWdNQURCUmlJVXBBQVI3QUdESUl5TjRBSVNaQUJSRzhsYzg4U3V1RU9jcUFBQjRtYkk4dVNRNVJZRmJDQzF4QjFkWExoNG96a2tYS3hRMllRSmhta0F1d25tWkdUS0JOQS9nODh3QUFLQ1JGUkhnZy9QOWVNNE9yczdPTm82MkRsOHQ2cjhHL3lKaVl1UCs1YytyY0VBQUFPRjBmdEgrTEMrekdvQTdCb0J0L3FJbDdnUm9YZ3VnZGZlTFpySVBRTFVBb09uYVYvTncrSDQ4UEVXaGtMbloyZVhrNU5oS3hFSmJZY3BYZmY1bndsL0FWLzFzK1g0OC9QZjE0TDdpSklFeVhZRkhCUGpnd3N6MFRLVWN6NUlKaEdMYzVvOUgvTGNMLy93ZDB5TEVTV0s1V0NvVTQxRVNjWTVFbW96ek1xVWlpVUtTS2NVbDB2OWs0dDhzK3dNKzN6VUFzR28rQVh1UkxhaGRZd1AyU3ljUVdIVEE0dmNBQVBLN2I4SFVLQWdEZ0dpRDRjOTMvKzgvL1VlZ0pRQ0Faa21TY1FBQVhrUWtMbFRLc3ovSENBQUFSS0NCS3JCQkcvVEJHQ3pBQmh6QkJkekJDL3hnTm9SQ0pNVENRaEJDQ21TQUhISmdLYXlDUWlpR3piQWRLbUF2MUVBZE5NQlJhSWFUY0E0dXdsVzREajF3RC9waENKN0JLTHlCQ1FSQnlBZ1RZU0hhaUFGaWlsZ2pqZ2dYbVlYNEljRklCQktMSkNESmlCUlJJa3VSTlVneFVvcFVJRlZJSGZJOWNnSTVoMXhHdXBFN3lBQXlndnlHdkVjeGxJR3lVVDNVRExWRHVhZzNHb1JHb2d2UVpIUXhtbzhXb0p2UWNyUWFQWXcyb2VmUXEyZ1AybzgrUThjd3dPZ1lCelBFYkRBdXhzTkNzVGdzQ1pOank3RWlyQXlyeGhxd1Zxd0R1NG4xWTgreGR3UVNnVVhBQ1RZRWQwSWdZUjVCU0ZoTVdFN1lTS2dnSENRMEVkb0pOd2tEaEZIQ0p5S1RxRXUwSnJvUitjUVlZakl4aDFoSUxDUFdFbzhUTHhCN2lFUEVOeVFTaVVNeUo3bVFBa214cEZUU0V0SkcwbTVTSStrc3FaczBTQm9qazhuYVpHdXlCem1VTENBcnlJWGtuZVRENURQa0crUWg4bHNLbldKQWNhVDRVK0lvVXNwcVNobmxFT1UwNVFabG1ESkJWYU9hVXQyb29WUVJOWTlhUXEyaHRsS3ZVWWVvRXpSMW1qbk5neFpKUzZXdG9wWFRHbWdYYVBkcHIraDB1aEhkbFI1T2w5Qlgwc3ZwUitpWDZBUDBkd3dOaGhXRHg0aG5LQm1iR0FjWVp4bDNHSytZVEtZWjA0c1p4MVF3TnpIcm1PZVpENWx2VlZncXRpcDhGWkhLQ3BWS2xTYVZHeW92VkttcXBxcmVxZ3RWODFYTFZJK3BYbE45cmtaVk0xUGpxUW5VbHF0VnFwMVE2MU1iVTJlcE82aUhxbWVvYjFRL3BINVovWWtHV2NOTXcwOURwRkdnc1YvanZNWWdDMk1aczNnc0lXc05xNFoxZ1RYRUpySE4yWHgyS3J1WS9SMjdpejJxcWFFNVF6TktNMWV6VXZPVVpqOEg0NWh4K0p4MFRnbm5LS2VYODM2SzNoVHZLZUlwRzZZMFRMa3haVnhycXBhWGxsaXJTS3RScTBmcnZUYXU3YWVkcHIxRnUxbjdnUTVCeDBvblhDZEhaNC9PQlozblU5bFQzYWNLcHhaTlBUcjFyaTZxYTZVYm9idEVkNzl1cCs2WW5yNWVnSjVNYjZmZWViM24raHg5TC8xVS9XMzZwL1ZIREZnR3N3d2tCdHNNemhnOHhUVnhiendkTDhmYjhWRkRYY05BUTZWaGxXR1g0WVNSdWRFOG85VkdqVVlQakduR1hPTWs0MjNHYmNhakpnWW1JU1pMVGVwTjdwcFNUYm1tS2FZN1REdE14ODNNemFMTjFwazFtejB4MXpMbm0rZWIxNXZmdDJCYWVGb3N0cWkydUdWSnN1UmFwbG51dHJ4dWhWbzVXYVZZVlZwZHMwYXRuYTBsMXJ1dHU2Y1JwN2xPazA2cm50Wm53N0R4dHNtMnFiY1pzT1hZQnR1dXRtMjJmV0ZuWWhkbnQ4V3V3KzZUdlpOOXVuMk4vVDBIRFlmWkRxc2RXaDErYzdSeUZEcFdPdDZhenB6dVAzM0Y5SmJwTDJkWXp4RFAyRFBqdGhQTEtjUnBuVk9iMDBkbkYyZTVjNFB6aUl1SlM0TExMcGMrTHBzYnh0M0l2ZVJLZFBWeFhlRjYwdldkbTdPYnd1Mm8yNi91TnU1cDdvZmNuOHcwbnltZVdUTnowTVBJUStCUjVkRS9DNStWTUd2ZnJINVBRMCtCWjdYbkl5OWpMNUZYcmRld3Q2VjNxdmRoN3hjKzlqNXluK00rNHp3MzNqTGVXVi9NTjhDM3lMZkxUOE52bmwrRjMwTi9JLzlrLzNyLzBRQ25nQ1VCWndPSmdVR0JXd0w3K0hwOEliK09QenJiWmZheTJlMUJqS0M1UVJWQmo0S3RndVhCclNGb3lPeVFyU0gzNTVqT2tjNXBEb1ZRZnVqVzBBZGg1bUdMdzM0TUo0V0hoVmVHUDQ1d2lGZ2EwVEdYTlhmUjNFTnozMFQ2UkpaRTNwdG5NVTg1cnkxS05TbytxaTVxUE5vM3VqUzZQOFl1WmxuTTFWaWRXRWxzU3h3NUxpcXVObTVzdnQvODdmT0g0cDNpQytON0Y1Z3Z5RjF3ZWFIT3d2U0ZweGFwTGhJc09wWkFUSWhPT0pUd1FSQXFxQmFNSmZJVGR5V09Dbm5DSGNKbklpL1JOdEdJMkVOY0toNU84a2dxVFhxUzdKRzhOWGtreFRPbExPVzVoQ2Vwa0x4TURVemRtenFlRnBwMklHMHlQVHE5TVlPU2taQnhRcW9oVFpPMlorcG41bVoyeTZ4bGhiTCt4VzZMdHk4ZWxRZkphN09RckFWWkxRcTJRcWJvVkZvbzF5b0hzbWRsVjJhL3pZbktPWmFybml2TjdjeXp5dHVRTjV6dm4vL3RFc0lTNFpLMnBZWkxWeTBkV09hOXJHbzVzanh4ZWRzSzR4VUZLNFpXQnF3OHVJcTJLbTNWVDZ2dFY1ZXVmcjBtZWsxcmdWN0J5b0xCdFFGcjZ3dFZDdVdGZmV2YzErMWRUMWd2V2QrMVlmcUduUnMrRlltS3JoVGJGNWNWZjlnbzNIamxHNGR2eXIrWjNKUzBxYXZFdVdUUFp0Sm02ZWJlTFo1YkRwYXFsK2FYRG00TjJkcTBEZDlXdE8zMTlrWGJMNWZOS051N2c3WkR1YU8vUExpOFphZkp6czA3UDFTa1ZQUlUrbFEyN3RMZHRXSFgrRzdSN2h0N3ZQWTA3TlhiVzd6My9UN0p2dHRWQVZWTjFXYlZaZnRKKzdQM1A2NkpxdW40bHZ0dFhhMU9iWEh0eHdQU0EvMEhJdzYyMTduVTFSM1NQVlJTajlZcjYwY094eCsrL3AzdmR5ME5OZzFWalp6RzRpTndSSG5rNmZjSjMvY2VEVHJhZG94N3JPRUgweDkySFdjZEwycENtdkthUnB0VG12dGJZbHU2VDh3KzBkYnEzbnI4UjlzZkQ1dzBQRmw1U3ZOVXlXbmE2WUxUazJmeXo0eWRsWjE5Zmk3NTNHRGJvclo3NTJQTzMyb1BiKys2RUhUaDBrWC9pK2M3dkR2T1hQSzRkUEt5MitVVFY3aFhtcTg2WDIzcWRPbzgvcFBUVDhlN25MdWFycmxjYTdudWVyMjFlMmIzNlJ1ZU44N2Q5TDE1OFJiLzF0V2VPVDNkdmZONmIvZkY5L1hmRnQxK2NpZjl6c3U3MlhjbjdxMjhUN3hmOUVEdFFkbEQzWWZWUDF2KzNOanYzSDlxd0hlZzg5SGNSL2NHaFlQUC9wSDFqdzlEQlkrWmo4dUdEWWJybmpnK09UbmlQM0w5NmZ5blE4OWt6eWFlRi82aS9zdXVGeFl2ZnZqVjY5Zk8wWmpSb1pmeWw1Ty9iWHlsL2VyQTZ4bXYyOGJDeGg2K3lYZ3pNVjcwVnZ2dHdYZmNkeDN2bzk4UFQrUjhJSDhvLzJqNXNmVlQwS2Y3a3htVGsvOEVBNWp6L0dNekxkc0FBRHNrYVZSWWRGaE5URHBqYjIwdVlXUnZZbVV1ZUcxd0FBQUFBQUE4UDNod1lXTnJaWFFnWW1WbmFXNDlJdSs3dnlJZ2FXUTlJbGMxVFRCTmNFTmxhR2xJZW5KbFUzcE9WR042YTJNNVpDSS9QZ284ZURwNGJYQnRaWFJoSUhodGJHNXpPbmc5SW1Ga2IySmxPbTV6T20xbGRHRXZJaUI0T25odGNIUnJQU0pCWkc5aVpTQllUVkFnUTI5eVpTQTFMall0WXpFek1pQTNPUzR4TlRreU9EUXNJREl3TVRZdk1EUXZNVGt0TVRNNk1UTTZOREFnSUNBZ0lDQWdJQ0krQ2lBZ0lEeHlaR1k2VWtSR0lIaHRiRzV6T25Ka1pqMGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNVGs1T1M4d01pOHlNaTF5WkdZdGMzbHVkR0Y0TFc1ekl5SStDaUFnSUNBZ0lEeHlaR1k2UkdWelkzSnBjSFJwYjI0Z2NtUm1PbUZpYjNWMFBTSWlDaUFnSUNBZ0lDQWdJQ0FnSUhodGJHNXpPbmh0Y0QwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0x5SUtJQ0FnSUNBZ0lDQWdJQ0FnZUcxc2JuTTZaR005SW1oMGRIQTZMeTl3ZFhKc0xtOXlaeTlrWXk5bGJHVnRaVzUwY3k4eExqRXZJZ29nSUNBZ0lDQWdJQ0FnSUNCNGJXeHVjenB3YUc5MGIzTm9iM0E5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmNHaHZkRzl6YUc5d0x6RXVNQzhpQ2lBZ0lDQWdJQ0FnSUNBZ0lIaHRiRzV6T25odGNFMU5QU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNoaGNDOHhMakF2Ylcwdklnb2dJQ0FnSUNBZ0lDQWdJQ0I0Yld4dWN6cHpkRVYyZEQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wzTlVlWEJsTDFKbGMyOTFjbU5sUlhabGJuUWpJZ29nSUNBZ0lDQWdJQ0FnSUNCNGJXeHVjenAwYVdabVBTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM1JwWm1Zdk1TNHdMeUlLSUNBZ0lDQWdJQ0FnSUNBZ2VHMXNibk02WlhocFpqMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzlsZUdsbUx6RXVNQzhpUGdvZ0lDQWdJQ0FnSUNBOGVHMXdPa055WldGMGIzSlViMjlzUGtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBeU1ERTFMalVnS0ZkcGJtUnZkM01wUEM5NGJYQTZRM0psWVhSdmNsUnZiMncrQ2lBZ0lDQWdJQ0FnSUR4NGJYQTZRM0psWVhSbFJHRjBaVDR5TURFMkxUQTVMVEk0VkRFMk9qSTFPak15TFRBM09qQXdQQzk0YlhBNlEzSmxZWFJsUkdGMFpUNEtJQ0FnSUNBZ0lDQWdQSGh0Y0RwTmIyUnBabmxFWVhSbFBqSXdNVFl0TURrdE1qaFVNVFk2TXpjNk1qTXRNRGM2TURBOEwzaHRjRHBOYjJScFpubEVZWFJsUGdvZ0lDQWdJQ0FnSUNBOGVHMXdPazFsZEdGa1lYUmhSR0YwWlQ0eU1ERTJMVEE1TFRJNFZERTJPak0zT2pJekxUQTNPakF3UEM5NGJYQTZUV1YwWVdSaGRHRkVZWFJsUGdvZ0lDQWdJQ0FnSUNBOFpHTTZabTl5YldGMFBtbHRZV2RsTDNCdVp6d3ZaR002Wm05eWJXRjBQZ29nSUNBZ0lDQWdJQ0E4Y0dodmRHOXphRzl3T2tOdmJHOXlUVzlrWlQ0elBDOXdhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQZ29nSUNBZ0lDQWdJQ0E4Y0dodmRHOXphRzl3T2tsRFExQnliMlpwYkdVK2MxSkhRaUJKUlVNMk1UazJOaTB5TGpFOEwzQm9iM1J2YzJodmNEcEpRME5RY205bWFXeGxQZ29nSUNBZ0lDQWdJQ0E4ZUcxd1RVMDZTVzV6ZEdGdVkyVkpSRDU0YlhBdWFXbGtPbUZoWVRGak1UUXpMVFV3Wm1VdE9UUTBNeTFoTlRobUxXRXlNMlZrTlRNM01EZG1NRHd2ZUcxd1RVMDZTVzV6ZEdGdVkyVkpSRDRLSUNBZ0lDQWdJQ0FnUEhodGNFMU5Pa1J2WTNWdFpXNTBTVVErWVdSdlltVTZaRzlqYVdRNmNHaHZkRzl6YUc5d09qZGxOemRtWW1aakxUZzFaRFF0TVRGbE5pMWhZemhtTFdGak56VTBaV1ExT0RNM1pqd3ZlRzF3VFUwNlJHOWpkVzFsYm5SSlJENEtJQ0FnSUNBZ0lDQWdQSGh0Y0UxTk9rOXlhV2RwYm1Gc1JHOWpkVzFsYm5SSlJENTRiWEF1Wkdsa09tTTFabU0wWkdZeUxUa3hZMk10WlRJME1TMDRZMlZqTFRNek9ESXlZMlExWldGbE9Ud3ZlRzF3VFUwNlQzSnBaMmx1WVd4RWIyTjFiV1Z1ZEVsRVBnb2dJQ0FnSUNBZ0lDQThlRzF3VFUwNlNHbHpkRzl5ZVQ0S0lDQWdJQ0FnSUNBZ0lDQWdQSEprWmpwVFpYRStDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHlaR1k2YkdrZ2NtUm1PbkJoY25ObFZIbHdaVDBpVW1WemIzVnlZMlVpUGdvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGMzUkZkblE2WVdOMGFXOXVQbU55WldGMFpXUThMM04wUlhaME9tRmpkR2x2Ymo0S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITjBSWFowT21sdWMzUmhibU5sU1VRK2VHMXdMbWxwWkRwak5XWmpOR1JtTWkwNU1XTmpMV1V5TkRFdE9HTmxZeTB6TXpneU1tTmtOV1ZoWlRrOEwzTjBSWFowT21sdWMzUmhibU5sU1VRK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpkRVYyZERwM2FHVnVQakl3TVRZdE1Ea3RNamhVTVRZNk1qVTZNekl0TURjNk1EQThMM04wUlhaME9uZG9aVzQrQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QXlNREUxTGpVZ0tGZHBibVJ2ZDNNcFBDOXpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQZ29nSUNBZ0lDQWdJQ0FnSUNBZ0lDQThMM0prWmpwc2FUNEtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BISmtaanBzYVNCeVpHWTZjR0Z5YzJWVWVYQmxQU0pTWlhOdmRYSmpaU0krQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emRFVjJkRHBoWTNScGIyNCtZMjl1ZG1WeWRHVmtQQzl6ZEVWMmREcGhZM1JwYjI0K0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpkRVYyZERwd1lYSmhiV1YwWlhKelBtWnliMjBnWVhCd2JHbGpZWFJwYjI0dmRtNWtMbUZrYjJKbExuQm9iM1J2YzJodmNDQjBieUJwYldGblpTOXdibWM4TDNOMFJYWjBPbkJoY21GdFpYUmxjbk0rQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2Y21SbU9teHBQZ29nSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjbVJtT214cElISmtaanB3WVhKelpWUjVjR1U5SWxKbGMyOTFjbU5sSWo0S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITjBSWFowT21GamRHbHZiajV6WVhabFpEd3ZjM1JGZG5RNllXTjBhVzl1UGdvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGMzUkZkblE2YVc1emRHRnVZMlZKUkQ1NGJYQXVhV2xrT21GaFlURmpNVFF6TFRVd1ptVXRPVFEwTXkxaE5UaG1MV0V5TTJWa05UTTNNRGRtTUR3dmMzUkZkblE2YVc1emRHRnVZMlZKUkQ0S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITjBSWFowT25kb1pXNCtNakF4Tmkwd09TMHlPRlF4Tmpvek56b3lNeTB3Tnpvd01Ed3ZjM1JGZG5RNmQyaGxiajRLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5RK1FXUnZZbVVnVUdodmRHOXphRzl3SUVORElESXdNVFV1TlNBb1YybHVaRzkzY3lrOEwzTjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUStDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6ZEVWMmREcGphR0Z1WjJWa1BpODhMM04wUlhaME9tTm9ZVzVuWldRK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dmNtUm1PbXhwUGdvZ0lDQWdJQ0FnSUNBZ0lDQThMM0prWmpwVFpYRStDaUFnSUNBZ0lDQWdJRHd2ZUcxd1RVMDZTR2x6ZEc5eWVUNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNlQzSnBaVzUwWVhScGIyNCtNVHd2ZEdsbVpqcFBjbWxsYm5SaGRHbHZiajRLSUNBZ0lDQWdJQ0FnUEhScFptWTZXRkpsYzI5c2RYUnBiMjQrTXpBd01EQXdNQzh4TURBd01Ed3ZkR2xtWmpwWVVtVnpiMngxZEdsdmJqNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNldWSmxjMjlzZFhScGIyNCtNekF3TURBd01DOHhNREF3TUR3dmRHbG1aanBaVW1WemIyeDFkR2x2Ymo0S0lDQWdJQ0FnSUNBZ1BIUnBabVk2VW1WemIyeDFkR2x2YmxWdWFYUStNand2ZEdsbVpqcFNaWE52YkhWMGFXOXVWVzVwZEQ0S0lDQWdJQ0FnSUNBZ1BHVjRhV1k2UTI5c2IzSlRjR0ZqWlQ0eFBDOWxlR2xtT2tOdmJHOXlVM0JoWTJVK0NpQWdJQ0FnSUNBZ0lEeGxlR2xtT2xCcGVHVnNXRVJwYldWdWMybHZiajQyTkR3dlpYaHBaanBRYVhobGJGaEVhVzFsYm5OcGIyNCtDaUFnSUNBZ0lDQWdJRHhsZUdsbU9sQnBlR1ZzV1VScGJXVnVjMmx2Ymo0ek1qd3ZaWGhwWmpwUWFYaGxiRmxFYVcxbGJuTnBiMjQrQ2lBZ0lDQWdJRHd2Y21SbU9rUmxjMk55YVhCMGFXOXVQZ29nSUNBOEwzSmtaanBTUkVZK0Nqd3ZlRHA0YlhCdFpYUmhQZ29nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBbzhQM2h3WVdOclpYUWdaVzVrUFNKM0lqOCtPaEY3UndBQUFDQmpTRkpOQUFCNkpRQUFnSU1BQVBuL0FBQ0E2UUFBZFRBQUFPcGdBQUE2bUFBQUYyK1NYOFZHQUFBQWxFbEVRVlI0MnV6WnNRM0FJQXhFVVR1VFpKUnNrdDVMUkZtQ2RUTGFwVUtDQmlqby9GMGhuMlNrSnhJS1hKSmxyc09TRndBQUFBQkE2dktJNk83QlVvclhkWnUxL1ZFV0VaZVpmYk41bS9aYW1qZksrQVFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQ0JmdWFTbmE3aS9kZDFtYlgrVVNUck43SjdOMjdUWDByeFJ4Z25nWllpZklBQUFBSkM0ZmdBQUFQLy9Bd0F1TVZQdzIwaHhDd0FBQUFCSlJVNUVya0pnZ2c9PWA7XHJcblxyXG4gIGNvbnN0IHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZSgpO1xyXG4gIHRleHR1cmUuaW1hZ2UgPSBpbWFnZTtcclxuICB0ZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZTtcclxuICAvLyB0ZXh0dXJlLm1pbkZpbHRlciA9IFRIUkVFLkxpbmVhck1pcE1hcExpbmVhckZpbHRlcjtcclxuICAvLyB0ZXh0dXJlLm1hZ0ZpbHRlciA9IFRIUkVFLkxpbmVhckZpbHRlcjtcclxuICAvLyB0ZXh0dXJlLmdlbmVyYXRlTWlwbWFwcyA9IGZhbHNlO1xyXG5cclxuICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XHJcbiAgICAvLyBjb2xvcjogMHhmZjAwMDAsXHJcbiAgICBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBtYXA6IHRleHR1cmVcclxuICB9KTtcclxuICBtYXRlcmlhbC5hbHBoYVRlc3QgPSAwLjU7XHJcblxyXG4gIHJldHVybiBmdW5jdGlvbigpe1xyXG4gICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSggaW1hZ2Uud2lkdGggLyAxMDAwLCBpbWFnZS5oZWlnaHQgLyAxMDAwLCAxLCAxICk7XHJcblxyXG4gICAgY29uc3QgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKCBnZW9tZXRyeSwgbWF0ZXJpYWwgKTtcclxuICAgIHJldHVybiBtZXNoO1xyXG4gIH1cclxuXHJcbn0oKSk7XHJcblxyXG5leHBvcnQgY29uc3QgZG93bkFycm93ID0gKGZ1bmN0aW9uKCl7XHJcbiAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICBpbWFnZS5zcmMgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFJQUFBQUJBQ0FZQUFBRFMxbjkvQUFBQUNYQklXWE1BQUN4TEFBQXNTd0dsUFphcEFBQTRLMmxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NEtQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TXpJZ056a3VNVFU1TWpnMExDQXlNREUyTHpBMEx6RTVMVEV6T2pFek9qUXdJQ0FnSUNBZ0lDQWlQZ29nSUNBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBnb2dJQ0FnSUNBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlnb2dJQ0FnSUNBZ0lDQWdJQ0I0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUNpQWdJQ0FnSUNBZ0lDQWdJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SUtJQ0FnSUNBZ0lDQWdJQ0FnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJZ29nSUNBZ0lDQWdJQ0FnSUNCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJS0lDQWdJQ0FnSUNBZ0lDQWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SUtJQ0FnSUNBZ0lDQWdJQ0FnZUcxc2JuTTZkR2xtWmowaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTBhV1ptTHpFdU1DOGlDaUFnSUNBZ0lDQWdJQ0FnSUhodGJHNXpPbVY0YVdZOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZaWGhwWmk4eExqQXZJajRLSUNBZ0lDQWdJQ0FnUEhodGNEcERjbVZoZEc5eVZHOXZiRDVCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nTWpBeE5TNDFJQ2hYYVc1a2IzZHpLVHd2ZUcxd09rTnlaV0YwYjNKVWIyOXNQZ29nSUNBZ0lDQWdJQ0E4ZUcxd09rTnlaV0YwWlVSaGRHVStNakF4TmkweE1DMHhPRlF4Tnpvek16b3dOaTB3Tnpvd01Ed3ZlRzF3T2tOeVpXRjBaVVJoZEdVK0NpQWdJQ0FnSUNBZ0lEeDRiWEE2VFc5a2FXWjVSR0YwWlQ0eU1ERTJMVEV3TFRJd1ZESXhPakU0T2pJMUxUQTNPakF3UEM5NGJYQTZUVzlrYVdaNVJHRjBaVDRLSUNBZ0lDQWdJQ0FnUEhodGNEcE5aWFJoWkdGMFlVUmhkR1UrTWpBeE5pMHhNQzB5TUZReU1Ub3hPRG95TlMwd056b3dNRHd2ZUcxd09rMWxkR0ZrWVhSaFJHRjBaVDRLSUNBZ0lDQWdJQ0FnUEdSak9tWnZjbTFoZEQ1cGJXRm5aUzl3Ym1jOEwyUmpPbVp2Y20xaGRENEtJQ0FnSUNBZ0lDQWdQSEJvYjNSdmMyaHZjRHBEYjJ4dmNrMXZaR1UrTXp3dmNHaHZkRzl6YUc5d09rTnZiRzl5VFc5a1pUNEtJQ0FnSUNBZ0lDQWdQSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUStlRzF3TG1scFpEb3pNRFF5WWpJMFpTMWlNemMyTFdJME5HSXRPR0k0WXkxbFpURmpZMkl6WVdVMU1EVThMM2h0Y0UxTk9rbHVjM1JoYm1ObFNVUStDaUFnSUNBZ0lDQWdJRHg0YlhCTlRUcEViMk4xYldWdWRFbEVQbmh0Y0M1a2FXUTZNekEwTW1JeU5HVXRZak0zTmkxaU5EUmlMVGhpT0dNdFpXVXhZMk5pTTJGbE5UQTFQQzk0YlhCTlRUcEViMk4xYldWdWRFbEVQZ29nSUNBZ0lDQWdJQ0E4ZUcxd1RVMDZUM0pwWjJsdVlXeEViMk4xYldWdWRFbEVQbmh0Y0M1a2FXUTZNekEwTW1JeU5HVXRZak0zTmkxaU5EUmlMVGhpT0dNdFpXVXhZMk5pTTJGbE5UQTFQQzk0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUStDaUFnSUNBZ0lDQWdJRHg0YlhCTlRUcElhWE4wYjNKNVBnb2dJQ0FnSUNBZ0lDQWdJQ0E4Y21SbU9sTmxjVDRLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSEprWmpwc2FTQnlaR1k2Y0dGeWMyVlVlWEJsUFNKU1pYTnZkWEpqWlNJK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpkRVYyZERwaFkzUnBiMjQrWTNKbFlYUmxaRHd2YzNSRmRuUTZZV04wYVc5dVBnb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjM1JGZG5RNmFXNXpkR0Z1WTJWSlJENTRiWEF1YVdsa09qTXdOREppTWpSbExXSXpOell0WWpRMFlpMDRZamhqTFdWbE1XTmpZak5oWlRVd05Ud3ZjM1JGZG5RNmFXNXpkR0Z1WTJWSlJENEtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE4wUlhaME9uZG9aVzQrTWpBeE5pMHhNQzB4T0ZReE56b3pNem93Tmkwd056b3dNRHd2YzNSRmRuUTZkMmhsYmo0S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUStRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJREl3TVRVdU5TQW9WMmx1Wkc5M2N5azhMM04wUlhaME9uTnZablIzWVhKbFFXZGxiblErQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2Y21SbU9teHBQZ29nSUNBZ0lDQWdJQ0FnSUNBOEwzSmtaanBUWlhFK0NpQWdJQ0FnSUNBZ0lEd3ZlRzF3VFUwNlNHbHpkRzl5ZVQ0S0lDQWdJQ0FnSUNBZ1BIUnBabVk2VDNKcFpXNTBZWFJwYjI0K01Ud3ZkR2xtWmpwUGNtbGxiblJoZEdsdmJqNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNldGSmxjMjlzZFhScGIyNCtNamc0TURBd01DOHhNREF3TUR3dmRHbG1aanBZVW1WemIyeDFkR2x2Ymo0S0lDQWdJQ0FnSUNBZ1BIUnBabVk2V1ZKbGMyOXNkWFJwYjI0K01qZzRNREF3TUM4eE1EQXdNRHd2ZEdsbVpqcFpVbVZ6YjJ4MWRHbHZiajRLSUNBZ0lDQWdJQ0FnUEhScFptWTZVbVZ6YjJ4MWRHbHZibFZ1YVhRK01qd3ZkR2xtWmpwU1pYTnZiSFYwYVc5dVZXNXBkRDRLSUNBZ0lDQWdJQ0FnUEdWNGFXWTZRMjlzYjNKVGNHRmpaVDQyTlRVek5Ud3ZaWGhwWmpwRGIyeHZjbE53WVdObFBnb2dJQ0FnSUNBZ0lDQThaWGhwWmpwUWFYaGxiRmhFYVcxbGJuTnBiMjQrTVRJNFBDOWxlR2xtT2xCcGVHVnNXRVJwYldWdWMybHZiajRLSUNBZ0lDQWdJQ0FnUEdWNGFXWTZVR2w0Wld4WlJHbHRaVzV6YVc5dVBqWTBQQzlsZUdsbU9sQnBlR1ZzV1VScGJXVnVjMmx2Ymo0S0lDQWdJQ0FnUEM5eVpHWTZSR1Z6WTNKcGNIUnBiMjQrQ2lBZ0lEd3ZjbVJtT2xKRVJqNEtQQzk0T25odGNHMWxkR0UrQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDancvZUhCaFkydGxkQ0JsYm1ROUluY2lQejVVaWx6MEFBQUFJR05JVWswQUFIb2xBQUNBZ3dBQStmOEFBSURwQUFCMU1BQUE2bUFBQURxWUFBQVhiNUpmeFVZQUFBSmRTVVJCVkhqYTdOM0xjY0pBRUlUaFJ1VzduY1VlVFFoa1FBaUlETWdJaFVJSWNGUVdKZ0o4OEZLbG92d0FyTjJkNlo0NWNaR0EvVDl2aVlmdHhlVnlRWXp1ZExFRUFTQW1BTVFFZ0JqSmVXbDF4eW1sTndBSEFNZHhISHZGeFU4cERRQ1dBRmJqT0g3STdBQ1QrTzhBTm5raEZPTnY4aG9jOHByd0E3aUpmeDBwQkpQNDEybUdvRE1RWHdyQk4vR2JJdWlNeEpkQThFdjhaZ2c2US9HcEVkd1J2d21DemxoOFNnUVB4SytPb01ZT01Ed1lud3JCRS9HbkNBYlhBUEtUWC8vakZKdVVVdTg0ZnY5ay9PdXNTLzhRZEFibDM4N2VJNEw4bVBjem5Lcm9UbGh5QjFqT2VDNVhDR2FNWDJJdHF3RllBVGlwSVNnUS81VFgwaGVBL042MkZJSlM4VXQrVGxEMElsQUpnY2Y0VlY0R0tpRHdHci9XK3dEVUNEekhyd2FBRllIMytGVUJzQ0ZnaUY4ZEFBc0NsdmhOQUhoSHdCUy9HUUN2Q05qaU53WGdEUUZqL09ZQXZDQmdqVzhDZ0hVRXpQSE5BTENLZ0QyK0tRRFdFQ2pFTndmQUNnS1YrQ1lCVEJEMEFNNjFFUlNJZndiUVc0eHZGa0JHY013N1FUVUVoZUt2OG5OQkFEQ01RREcrZVFDMUVLakdCNENGbDc4UmxGSmE0dXNYVEY3bmpKUnZ6MzVlRC9GZEFTaUlBS3J4M1FFb2hBQ3E4VjFjQTFTNkpwQ003eEtBUVFSdTQ3c0ZZQWlCNi9pdUFSaEE0RDYrZXdBTkVWREVwd0RRQUFGTmZCb0FGUkZReGFjQ1VBRUJYWHc2QUFVUlVNYW5CRkFBQVcxOFdnQXpJcUNPVHcxZ0JnVDA4ZWtCVEJEc25qaDB4eDVmQWtCR01BRFlQbkRJTmgrREFLQ0hRQ2ErRklBN0VVakZsd1B3QndLNStKSUFma0FnR1I5dytKV3dPZWY2eldEVitQSUFZdUxmeGdXQVdJSUFFQk1BWWdKQWpPUjhEZ0QrNk96Z3Y0dXk5Z0FBQUFCSlJVNUVya0pnZ2c9PSc7XHJcblxyXG4gIGNvbnN0IHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZSgpO1xyXG4gIHRleHR1cmUuaW1hZ2UgPSBpbWFnZTtcclxuICB0ZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZTtcclxuICB0ZXh0dXJlLm1pbkZpbHRlciA9IFRIUkVFLkxpbmVhck1pcE1hcExpbmVhckZpbHRlcjtcclxuICB0ZXh0dXJlLm1hZ0ZpbHRlciA9IFRIUkVFLkxpbmVhckZpbHRlcjtcclxuICAvLyB0ZXh0dXJlLmFuaXNvdHJvcGljXHJcbiAgLy8gdGV4dHVyZS5nZW5lcmF0ZU1pcG1hcHMgPSBmYWxzZTtcclxuXHJcbiAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe1xyXG4gICAgLy8gY29sb3I6IDB4ZmYwMDAwLFxyXG4gICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZSxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbWFwOiB0ZXh0dXJlXHJcbiAgfSk7XHJcbiAgbWF0ZXJpYWwuYWxwaGFUZXN0ID0gMC4yO1xyXG5cclxuICByZXR1cm4gZnVuY3Rpb24oKXtcclxuICAgIGNvbnN0IGggPSAwLjM7XHJcbiAgICBjb25zdCBnZW8gPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSggaW1hZ2Uud2lkdGggLyAxMDAwICogaCwgaW1hZ2UuaGVpZ2h0IC8gMTAwMCAqIGgsIDEsIDEgKTtcclxuICAgIGdlby50cmFuc2xhdGUoIC0wLjAwNSwgLTAuMDA0LCAwICk7XHJcbiAgICByZXR1cm4gbmV3IFRIUkVFLk1lc2goIGdlbywgbWF0ZXJpYWwgKTtcclxuICB9XHJcbn0oKSk7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IGNoZWNrbWFyayA9IChmdW5jdGlvbigpe1xyXG4gIGNvbnN0IGltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgaW1hZ2Uuc3JjID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBSUFBQUFCQUNBWUFBQURTMW45L0FBQUFDWEJJV1hNQUFDeExBQUFzU3dHbFBaYXBBQUE0SzJsVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRLUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE16SWdOemt1TVRVNU1qZzBMQ0F5TURFMkx6QTBMekU1TFRFek9qRXpPalF3SUNBZ0lDQWdJQ0FpUGdvZ0lDQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQZ29nSUNBZ0lDQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJZ29nSUNBZ0lDQWdJQ0FnSUNCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlDaUFnSUNBZ0lDQWdJQ0FnSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlLSUNBZ0lDQWdJQ0FnSUNBZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWdvZ0lDQWdJQ0FnSUNBZ0lDQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SUtJQ0FnSUNBZ0lDQWdJQ0FnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlLSUNBZ0lDQWdJQ0FnSUNBZ2VHMXNibk02ZEdsbVpqMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzkwYVdabUx6RXVNQzhpQ2lBZ0lDQWdJQ0FnSUNBZ0lIaHRiRzV6T21WNGFXWTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2WlhocFppOHhMakF2SWo0S0lDQWdJQ0FnSUNBZ1BIaHRjRHBEY21WaGRHOXlWRzl2YkQ1QlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ01qQXhOUzQxSUNoWGFXNWtiM2R6S1R3dmVHMXdPa055WldGMGIzSlViMjlzUGdvZ0lDQWdJQ0FnSUNBOGVHMXdPa055WldGMFpVUmhkR1UrTWpBeE5pMHhNQzB4T0ZReE56b3pNem93Tmkwd056b3dNRHd2ZUcxd09rTnlaV0YwWlVSaGRHVStDaUFnSUNBZ0lDQWdJRHg0YlhBNlRXOWthV1o1UkdGMFpUNHlNREUyTFRFd0xUSXdWREl4T2pNek9qVXpMVEEzT2pBd1BDOTRiWEE2VFc5a2FXWjVSR0YwWlQ0S0lDQWdJQ0FnSUNBZ1BIaHRjRHBOWlhSaFpHRjBZVVJoZEdVK01qQXhOaTB4TUMweU1GUXlNVG96TXpvMU15MHdOem93TUR3dmVHMXdPazFsZEdGa1lYUmhSR0YwWlQ0S0lDQWdJQ0FnSUNBZ1BHUmpPbVp2Y20xaGRENXBiV0ZuWlM5d2JtYzhMMlJqT21admNtMWhkRDRLSUNBZ0lDQWdJQ0FnUEhCb2IzUnZjMmh2Y0RwRGIyeHZjazF2WkdVK016d3ZjR2h2ZEc5emFHOXdPa052Ykc5eVRXOWtaVDRLSUNBZ0lDQWdJQ0FnUEhodGNFMU5Pa2x1YzNSaGJtTmxTVVErZUcxd0xtbHBaRG8yT0RjeFlUazVZeTB6TmpFNUxUbGtOR0V0T0Rka05pMHdZV0U1WVRSaU5XVTRNamM4TDNodGNFMU5Pa2x1YzNSaGJtTmxTVVErQ2lBZ0lDQWdJQ0FnSUR4NGJYQk5UVHBFYjJOMWJXVnVkRWxFUG5odGNDNWthV1E2TmpnM01XRTVPV010TXpZeE9TMDVaRFJoTFRnM1pEWXRNR0ZoT1dFMFlqVmxPREkzUEM5NGJYQk5UVHBFYjJOMWJXVnVkRWxFUGdvZ0lDQWdJQ0FnSUNBOGVHMXdUVTA2VDNKcFoybHVZV3hFYjJOMWJXVnVkRWxFUG5odGNDNWthV1E2TmpnM01XRTVPV010TXpZeE9TMDVaRFJoTFRnM1pEWXRNR0ZoT1dFMFlqVmxPREkzUEM5NGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVErQ2lBZ0lDQWdJQ0FnSUR4NGJYQk5UVHBJYVhOMGIzSjVQZ29nSUNBZ0lDQWdJQ0FnSUNBOGNtUm1PbE5sY1Q0S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhKa1pqcHNhU0J5WkdZNmNHRnljMlZVZVhCbFBTSlNaWE52ZFhKalpTSStDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6ZEVWMmREcGhZM1JwYjI0K1kzSmxZWFJsWkR3dmMzUkZkblE2WVdOMGFXOXVQZ29nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDU0YlhBdWFXbGtPalk0TnpGaE9UbGpMVE0yTVRrdE9XUTBZUzA0TjJRMkxUQmhZVGxoTkdJMVpUZ3lOend2YzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDRLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOMFJYWjBPbmRvWlc0K01qQXhOaTB4TUMweE9GUXhOem96TXpvd05pMHdOem93TUR3dmMzUkZkblE2ZDJobGJqNEtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblErUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESURJd01UVXVOU0FvVjJsdVpHOTNjeWs4TDNOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5RK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dmNtUm1PbXhwUGdvZ0lDQWdJQ0FnSUNBZ0lDQThMM0prWmpwVFpYRStDaUFnSUNBZ0lDQWdJRHd2ZUcxd1RVMDZTR2x6ZEc5eWVUNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNlQzSnBaVzUwWVhScGIyNCtNVHd2ZEdsbVpqcFBjbWxsYm5SaGRHbHZiajRLSUNBZ0lDQWdJQ0FnUEhScFptWTZXRkpsYzI5c2RYUnBiMjQrTWpnNE1EQXdNQzh4TURBd01Ed3ZkR2xtWmpwWVVtVnpiMngxZEdsdmJqNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNldWSmxjMjlzZFhScGIyNCtNamc0TURBd01DOHhNREF3TUR3dmRHbG1aanBaVW1WemIyeDFkR2x2Ymo0S0lDQWdJQ0FnSUNBZ1BIUnBabVk2VW1WemIyeDFkR2x2YmxWdWFYUStNand2ZEdsbVpqcFNaWE52YkhWMGFXOXVWVzVwZEQ0S0lDQWdJQ0FnSUNBZ1BHVjRhV1k2UTI5c2IzSlRjR0ZqWlQ0Mk5UVXpOVHd2WlhocFpqcERiMnh2Y2xOd1lXTmxQZ29nSUNBZ0lDQWdJQ0E4WlhocFpqcFFhWGhsYkZoRWFXMWxibk5wYjI0K01USTRQQzlsZUdsbU9sQnBlR1ZzV0VScGJXVnVjMmx2Ymo0S0lDQWdJQ0FnSUNBZ1BHVjRhV1k2VUdsNFpXeFpSR2x0Wlc1emFXOXVQalkwUEM5bGVHbG1PbEJwZUdWc1dVUnBiV1Z1YzJsdmJqNEtJQ0FnSUNBZ1BDOXlaR1k2UkdWelkzSnBjSFJwYjI0K0NpQWdJRHd2Y21SbU9sSkVSajRLUEM5NE9uaHRjRzFsZEdFK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2p3L2VIQmhZMnRsZENCbGJtUTlJbmNpUHo1ejlSVDNBQUFBSUdOSVVrMEFBSG9sQUFDQWd3QUErZjhBQUlEcEFBQjFNQUFBNm1BQUFEcVlBQUFYYjVKZnhVWUFBQVR0U1VSQlZIamE3SnpiYjVSRkdNWi8yeGJDdlZoQVNFeFVpSTE0NHcwaFF0SEVHckhnSVNxZ042S2d0TllXQWIwdzBXbzFYcXJiUGJTbG9rWVN4Zk1oZW1YL0FhN3dHQVZxOFhUcDMwRFhpNW1KbTBhMnU5djMvYjZaMlhsdWRyT0hkdy9QTXpQUCs3NHpYNkZXcXlHRmdZRUJFbHBHRC9BZWNDdHdCL0RiY20rWW01c1QrL0N1OVAvbmltNmdDRHdDWEF0OERWeVg1UmRJQXNnUEJhQUVqTlE5ZGlQd0ZiQTVDU0IrVEFGUC9jL2pXNEhQZ0w0a2dIZ3hDd3cxZVA1bTRHTjdtd1FRRWJvcytVODA4ZHF0d0VmMk5na2dFcmMvMHlUNURuMTJPZGlTQkJBKythVVd5WGZZQW53RFhKOEVFRzZxTndrTXJ5REdacHNpM3BBRUVCNnFWM0Q3cmFJUCtOS21pa2tBZ2VBdDRJaGd2SnZzVEpBRTREa0t3Q25nc0VMc3Mwa0EvcS81czhBaGhkalR3RUZwZDVvZ1MzNVZhZVRQQWs4RGkwa0EvcEpmRWw3ekhVN1N1SEtZbGdBUDF2eXlrTnRmaWhrdDhwTUFaRWthVm9oYlZZcWJCQ0NJVThDVENuRkx3SmoybDA4Q1dObWEvN2FTMjY4Q3g2UU5YeEtBckhtZUJoNVhXazdHc2lBL1R3R01ZZmEvaFVwK21mWWFPODI0L2VHc3lNOUxBQzlnbWlQdkF6c0RJNy9McnMxRFNpTi9LSThmbENYR2dWZnQvVjdnRExBcklBRk1oK3IyZlJEQVM4REVrc2MyQWg4Qy9SM3M5c3ZBYUo1VFdsYmt2M3lGNTlaamRyMXM5M2phMTNMN0ZldjJhekVMWUx3QitRNXJNYjN1YlI0YXZwTktibjhhZUFhNG5MZTZ0UTNmUkpPdjdRVys4R2dtNkxFalZLT3hNNE01RDNBNTd4K3BLWUFYNnd4ZnM5Z0FmQUxzOElCOHJjYU9LeHZYZkZDNWxnREdnVmZhZks4emhydHkvRSswWEhrbEw3ZWZwUUFtV3BqMmx4UEJiVG44SjdQbzFmWkg4UXpTQW5qTmpuNEpyTWVjanNtcVdGUUEzbFZ5K3lYcjlvbGRBSGNLeDdzYStEd0RZOWhqOC95RGlxbmVZaWNJNEZIZ1IrR1lhNVd6QTgzR3poUncxRmZ5TlFUd0MzQ1B2WlhFT3VCVHpFVVVKTEVxZzFUUFcvSzFUT0Nmd0NCd1VUanVOY2lXamJzeFpWaU5WQyszMnI0dmFlQWZ3RjNBZ25EY1RWWUV0d3VOVUEzeXk1amR1M1N5QUFCK0IzWXJMQWNiQk9vRTd5aE4rNU4yelNjSndHQWVlQUQ0VGpodUw2YUIxS29uNkxia1A2WTA4by9qU1lYUEZ3RUFuQWNlVmhEQlZTMW1CNjZ4bzBIK0ZLYXhzMGhneUtvZGZBRjRFUGhKcVU2dzNFeXd5aHF6UTBya2o0UklmcFlDQUxnRTdMRXpnaVJjeGJDL3djaXZvRlBlZGVRSGk2eTNoUDFsamVHOFVvcTRORHNvWUlvOFdqdDVnaVkvRHdIVXA0aS9LbVFIWitwRVVNRHM1TkZ3KzBVeU9MUVJxd0RjY25BdjhMMXczSFhBYVpzaXZxNWsrSXJBQ1NKQm5xZUQ1NEVEd0FmQUxZSnhOd0hmS3BteXNpVi9NUllCNUgweTZBS3dIL2hCT081cVlJMkM0VHNhRS9rK0NBRE0xYkgzSWw4eGxFVFZHcjRha2NHWHM0Ri9BM2ZiR2NFM1ZBaW90aCtxQU1CMEVYZDdKb0pKUE56R0Zhc0F3RFNRQnBIZlZOS3UyejlHNVBEeGVQZ0M4QkJ3THVlUmZ5TEdOVDhFQVlEWlRISUErUVpTczJ2KzhkamNmbWdDY0hXQys1RnZJQzNuOWtjN2hYemZCZUNNNFI3a3k4WWQ1L1pERlFEODEwQzZxUGdaMGJ2OWtBVlFueUpxRkl2ZXhHem1JQW5BYjF3QzdoTTJoa1hnV1RvWW9WMGx6RFdRSkZMRTZCbzduU0FBbHlMdVkyVU5wQW9aWG9vdENVQWVDNWdHMHM5dGtqOUtRdEFDQU5OQUdxUzFQWWFsUkg0OEFuQXBZclBieTRvRWRtZ2pDYUQ1RkhFdmpiZVh2WUVwN3laRUtBRG5DZlpiRWZ3RFBJODVMK0RJZjQ0T2FPeTBnMzhIQU0vZTdndUlSeDk0QUFBQUFFbEZUa1N1UW1DQyc7XHJcblxyXG4gIGNvbnN0IHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZSgpO1xyXG4gIHRleHR1cmUuaW1hZ2UgPSBpbWFnZTtcclxuICB0ZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZTtcclxuICB0ZXh0dXJlLm1pbkZpbHRlciA9IFRIUkVFLkxpbmVhck1pcE1hcExpbmVhckZpbHRlcjtcclxuICB0ZXh0dXJlLm1hZ0ZpbHRlciA9IFRIUkVFLkxpbmVhckZpbHRlcjtcclxuICAvLyB0ZXh0dXJlLmFuaXNvdHJvcGljXHJcbiAgLy8gdGV4dHVyZS5nZW5lcmF0ZU1pcG1hcHMgPSBmYWxzZTtcclxuXHJcbiAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe1xyXG4gICAgLy8gY29sb3I6IDB4ZmYwMDAwLFxyXG4gICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZSxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbWFwOiB0ZXh0dXJlXHJcbiAgfSk7XHJcbiAgbWF0ZXJpYWwuYWxwaGFUZXN0ID0gMC4yO1xyXG5cclxuICByZXR1cm4gZnVuY3Rpb24oKXtcclxuICAgIGNvbnN0IGggPSAwLjQ7XHJcbiAgICBjb25zdCBnZW8gPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSggaW1hZ2Uud2lkdGggLyAxMDAwICogaCwgaW1hZ2UuaGVpZ2h0IC8gMTAwMCAqIGgsIDEsIDEgKTtcclxuICAgIGdlby50cmFuc2xhdGUoIDAuMDI1LCAwLCAwICk7XHJcbiAgICByZXR1cm4gbmV3IFRIUkVFLk1lc2goIGdlbywgbWF0ZXJpYWwgKTtcclxuICB9XHJcbn0oKSk7IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCBFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XHJcbmltcG9ydCBjcmVhdGVTbGlkZXIgZnJvbSAnLi9zbGlkZXInO1xyXG5pbXBvcnQgY3JlYXRlQ2hlY2tib3ggZnJvbSAnLi9jaGVja2JveCc7XHJcbmltcG9ydCBjcmVhdGVCdXR0b24gZnJvbSAnLi9idXR0b24nO1xyXG5pbXBvcnQgY3JlYXRlRm9sZGVyIGZyb20gJy4vZm9sZGVyJztcclxuaW1wb3J0IGNyZWF0ZURyb3Bkb3duIGZyb20gJy4vZHJvcGRvd24nO1xyXG5pbXBvcnQgKiBhcyBTREZUZXh0IGZyb20gJy4vc2RmdGV4dCc7XHJcblxyXG5jb25zdCBHVUlWUiA9IChmdW5jdGlvbiBEQVRHVUlWUigpe1xyXG5cclxuICAvKlxyXG4gICAgU0RGIGZvbnRcclxuICAqL1xyXG4gIGNvbnN0IHRleHRDcmVhdG9yID0gU0RGVGV4dC5jcmVhdG9yKCk7XHJcblxyXG5cclxuICAvKlxyXG4gICAgTGlzdHMuXHJcbiAgICBJbnB1dE9iamVjdHMgYXJlIHRoaW5ncyBsaWtlIFZJVkUgY29udHJvbGxlcnMsIGNhcmRib2FyZCBoZWFkc2V0cywgZXRjLlxyXG4gICAgQ29udHJvbGxlcnMgYXJlIHRoZSBEQVQgR1VJIHNsaWRlcnMsIGNoZWNrYm94ZXMsIGV0Yy5cclxuICAqL1xyXG4gIGNvbnN0IGlucHV0T2JqZWN0cyA9IFtdO1xyXG4gIGNvbnN0IGNvbnRyb2xsZXJzID0gW107XHJcblxyXG4gIC8qXHJcbiAgICBGdW5jdGlvbnMgZm9yIGRldGVybWluaW5nIHdoZXRoZXIgYSBnaXZlbiBjb250cm9sbGVyIGlzIHZpc2libGUgKGJ5IHdoaWNoIHdlXHJcbiAgICBtZWFuIG5vdCBoaWRkZW4sIG5vdCAndmlzaWJsZScgaW4gdGVybXMgb2YgdGhlIGNhbWVyYSBvcmllbnRhdGlvbiBldGMpLCBhbmRcclxuICAgIGZvciByZXRyaWV2aW5nIHRoZSBsaXN0IG9mIHZpc2libGUgaGl0c2Nhbk9iamVjdHMgZHluYW1pY2FsbHkuXHJcbiAgICBUaGlzIG1pZ2h0IGJlbmVmaXQgZnJvbSBzb21lIGNhY2hpbmcgZXNwZWNpYWxseSBpbiBjYXNlcyB3aXRoIGxhcmdlIGNvbXBsZXggR1VJcy5cclxuICAgIEkgaGF2ZW4ndCBtZWFzdXJlZCB0aGUgaW1wYWN0IG9mIGdhcmJhZ2UgY29sbGVjdGlvbiBldGMuXHJcbiAgKi9cclxuICBmdW5jdGlvbiBpc0NvbnRyb2xsZXJWaXNpYmxlKGNvbnRyb2wpIHtcclxuICAgIGlmICghY29udHJvbC52aXNpYmxlKSByZXR1cm4gZmFsc2U7XHJcbiAgICB2YXIgZm9sZGVyID0gY29udHJvbC5mb2xkZXI7XHJcbiAgICB3aGlsZSAoZm9sZGVyLmZvbGRlciAhPT0gZm9sZGVyKXtcclxuICAgICAgZm9sZGVyID0gZm9sZGVyLmZvbGRlcjtcclxuICAgICAgaWYgKGZvbGRlci5pc0NvbGxhcHNlZCgpIHx8ICFmb2xkZXIudmlzaWJsZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGdldFZpc2libGVDb250cm9sbGVycygpIHtcclxuICAgIC8vIG5vdCB0ZXJyaWJseSBlZmZpY2llbnRcclxuICAgIHJldHVybiBjb250cm9sbGVycy5maWx0ZXIoIGlzQ29udHJvbGxlclZpc2libGUgKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gZ2V0VmlzaWJsZUhpdHNjYW5PYmplY3RzKCkge1xyXG4gICAgY29uc3QgdG1wID0gZ2V0VmlzaWJsZUNvbnRyb2xsZXJzKCkubWFwKCBvID0+IHsgcmV0dXJuIG8uaGl0c2NhbjsgfSApXHJcbiAgICByZXR1cm4gdG1wLnJlZHVjZSgoYSwgYikgPT4geyByZXR1cm4gYS5jb25jYXQoYil9LCBbXSk7XHJcbiAgfVxyXG5cclxuICBsZXQgbW91c2VFbmFibGVkID0gZmFsc2U7XHJcbiAgbGV0IG1vdXNlUmVuZGVyZXIgPSB1bmRlZmluZWQ7XHJcblxyXG4gIGZ1bmN0aW9uIGVuYWJsZU1vdXNlKCBjYW1lcmEsIHJlbmRlcmVyICl7XHJcbiAgICBtb3VzZUVuYWJsZWQgPSB0cnVlO1xyXG4gICAgbW91c2VSZW5kZXJlciA9IHJlbmRlcmVyO1xyXG4gICAgbW91c2VJbnB1dC5tb3VzZUNhbWVyYSA9IGNhbWVyYTtcclxuICAgIHJldHVybiBtb3VzZUlucHV0Lmxhc2VyO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZGlzYWJsZU1vdXNlKCl7XHJcbiAgICBtb3VzZUVuYWJsZWQgPSBmYWxzZTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAgVGhlIGRlZmF1bHQgbGFzZXIgcG9pbnRlciBjb21pbmcgb3V0IG9mIGVhY2ggSW5wdXRPYmplY3QuXHJcbiAgKi9cclxuICBjb25zdCBsYXNlck1hdGVyaWFsID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKHtjb2xvcjoweDU1YWFmZiwgdHJhbnNwYXJlbnQ6IHRydWUsIGJsZW5kaW5nOiBUSFJFRS5BZGRpdGl2ZUJsZW5kaW5nIH0pO1xyXG4gIGZ1bmN0aW9uIGNyZWF0ZUxhc2VyKCl7XHJcbiAgICBjb25zdCBnID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XHJcbiAgICBnLnZlcnRpY2VzLnB1c2goIG5ldyBUSFJFRS5WZWN0b3IzKCkgKTtcclxuICAgIGcudmVydGljZXMucHVzaCggbmV3IFRIUkVFLlZlY3RvcjMoMCwwLDApICk7XHJcbiAgICByZXR1cm4gbmV3IFRIUkVFLkxpbmUoIGcsIGxhc2VyTWF0ZXJpYWwgKTtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAvKlxyXG4gICAgQSBcImN1cnNvclwiLCBlZyB0aGUgYmFsbCB0aGF0IGFwcGVhcnMgYXQgdGhlIGVuZCBvZiB5b3VyIGxhc2VyLlxyXG4gICovXHJcbiAgY29uc3QgY3Vyc29yTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe2NvbG9yOjB4NDQ0NDQ0LCB0cmFuc3BhcmVudDogdHJ1ZSwgYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcgfSApO1xyXG4gIGZ1bmN0aW9uIGNyZWF0ZUN1cnNvcigpe1xyXG4gICAgcmV0dXJuIG5ldyBUSFJFRS5NZXNoKCBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMC4wMDYsIDQsIDQgKSwgY3Vyc29yTWF0ZXJpYWwgKTtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBDcmVhdGVzIGEgZ2VuZXJpYyBJbnB1dCB0eXBlLlxyXG4gICAgVGFrZXMgYW55IFRIUkVFLk9iamVjdDNEIHR5cGUgb2JqZWN0IGFuZCB1c2VzIGl0cyBwb3NpdGlvblxyXG4gICAgYW5kIG9yaWVudGF0aW9uIGFzIGFuIGlucHV0IGRldmljZS5cclxuXHJcbiAgICBBIGxhc2VyIHBvaW50ZXIgaXMgaW5jbHVkZWQgYW5kIHdpbGwgYmUgdXBkYXRlZC5cclxuICAgIENvbnRhaW5zIHN0YXRlIGFib3V0IHdoaWNoIEludGVyYWN0aW9uIGlzIGN1cnJlbnRseSBiZWluZyB1c2VkIG9yIGhvdmVyLlxyXG4gICovXHJcbiAgZnVuY3Rpb24gY3JlYXRlSW5wdXQoIGlucHV0T2JqZWN0ID0gbmV3IFRIUkVFLkdyb3VwKCkgKXtcclxuICAgIGNvbnN0IGlucHV0ID0ge1xyXG4gICAgICByYXljYXN0OiBuZXcgVEhSRUUuUmF5Y2FzdGVyKCBuZXcgVEhSRUUuVmVjdG9yMygpLCBuZXcgVEhSRUUuVmVjdG9yMygpICksXHJcbiAgICAgIGxhc2VyOiBjcmVhdGVMYXNlcigpLFxyXG4gICAgICBjdXJzb3I6IGNyZWF0ZUN1cnNvcigpLFxyXG4gICAgICBvYmplY3Q6IGlucHV0T2JqZWN0LFxyXG4gICAgICBwcmVzc2VkOiBmYWxzZSxcclxuICAgICAgZ3JpcHBlZDogZmFsc2UsXHJcbiAgICAgIGV2ZW50czogbmV3IEVtaXR0ZXIoKSxcclxuICAgICAgaW50ZXJhY3Rpb246IHtcclxuICAgICAgICBncmlwOiB1bmRlZmluZWQsXHJcbiAgICAgICAgcHJlc3M6IHVuZGVmaW5lZCxcclxuICAgICAgICBob3ZlcjogdW5kZWZpbmVkXHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgaW5wdXQubGFzZXIuYWRkKCBpbnB1dC5jdXJzb3IgKTtcclxuXHJcbiAgICByZXR1cm4gaW5wdXQ7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgIE1vdXNlSW5wdXQuXHJcbiAgICBBbGxvd3MgeW91IHRvIGNsaWNrIG9uIHRoZSBzY3JlZW4gd2hlbiBub3QgaW4gVlIgZm9yIGRlYnVnZ2luZy5cclxuICAqL1xyXG4gIGNvbnN0IG1vdXNlSW5wdXQgPSBjcmVhdGVNb3VzZUlucHV0KCk7XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZU1vdXNlSW5wdXQoKXtcclxuICAgIGNvbnN0IG1vdXNlID0gbmV3IFRIUkVFLlZlY3RvcjIoLTEsLTEpO1xyXG5cclxuICAgIGNvbnN0IGlucHV0ID0gY3JlYXRlSW5wdXQoKTtcclxuICAgIGlucHV0Lm1vdXNlID0gbW91c2U7XHJcbiAgICBpbnB1dC5tb3VzZUludGVyc2VjdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbiAgICBpbnB1dC5tb3VzZU9mZnNldCA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbiAgICBpbnB1dC5tb3VzZVBsYW5lID0gbmV3IFRIUkVFLlBsYW5lKCk7XHJcbiAgICBpbnB1dC5pbnRlcnNlY3Rpb25zID0gW107XHJcblxyXG4gICAgLy8gIHNldCBteSBlbmFibGVNb3VzZVxyXG4gICAgaW5wdXQubW91c2VDYW1lcmEgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCBmdW5jdGlvbiggZXZlbnQgKXtcclxuICAgICAgLy8gaWYgYSBzcGVjaWZpYyByZW5kZXJlciBoYXMgYmVlbiBkZWZpbmVkXHJcbiAgICAgIGlmIChtb3VzZVJlbmRlcmVyKSB7XHJcbiAgICAgICAgY29uc3QgY2xpZW50UmVjdCA9IG1vdXNlUmVuZGVyZXIuZG9tRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBtb3VzZS54ID0gKCAoZXZlbnQuY2xpZW50WCAtIGNsaWVudFJlY3QubGVmdCkgLyBjbGllbnRSZWN0LndpZHRoKSAqIDIgLSAxO1xyXG4gICAgICAgIG1vdXNlLnkgPSAtICggKGV2ZW50LmNsaWVudFkgLSBjbGllbnRSZWN0LnRvcCkgLyBjbGllbnRSZWN0LmhlaWdodCkgKiAyICsgMTtcclxuICAgICAgfVxyXG4gICAgICAvLyBkZWZhdWx0IHRvIGZ1bGxzY3JlZW5cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgbW91c2UueCA9ICggZXZlbnQuY2xpZW50WCAvIHdpbmRvdy5pbm5lcldpZHRoICkgKiAyIC0gMTtcclxuICAgICAgICBtb3VzZS55ID0gLSAoIGV2ZW50LmNsaWVudFkgLyB3aW5kb3cuaW5uZXJIZWlnaHQgKSAqIDIgKyAxO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSwgZmFsc2UgKTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlZG93bicsIGZ1bmN0aW9uKCBldmVudCApe1xyXG4gICAgICBpZiAoaW5wdXQuaW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgLy8gcHJldmVudCBtb3VzZSBkb3duIGZyb20gdHJpZ2dlcmluZyBvdGhlciBsaXN0ZW5lcnMgKHBvbHlmaWxsLCBldGMpXHJcbiAgICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgaW5wdXQucHJlc3NlZCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0sIHRydWUgKTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNldXAnLCBmdW5jdGlvbiggZXZlbnQgKXtcclxuICAgICAgaW5wdXQucHJlc3NlZCA9IGZhbHNlO1xyXG4gICAgfSwgZmFsc2UgKTtcclxuXHJcblxyXG4gICAgcmV0dXJuIGlucHV0O1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBQdWJsaWMgZnVuY3Rpb24gdXNlcnMgcnVuIHRvIGdpdmUgREFUIEdVSSBhbiBpbnB1dCBkZXZpY2UuXHJcbiAgICBBdXRvbWF0aWNhbGx5IGRldGVjdHMgZm9yIFZpdmVDb250cm9sbGVyIGFuZCBiaW5kcyBidXR0b25zICsgaGFwdGljIGZlZWRiYWNrLlxyXG5cclxuICAgIFJldHVybnMgYSBsYXNlciBwb2ludGVyIHNvIGl0IGNhbiBiZSBkaXJlY3RseSBhZGRlZCB0byBzY2VuZS5cclxuXHJcbiAgICBUaGUgbGFzZXIgd2lsbCB0aGVuIGhhdmUgdHdvIG1ldGhvZHM6XHJcbiAgICBsYXNlci5wcmVzc2VkKCksIGxhc2VyLmdyaXBwZWQoKVxyXG5cclxuICAgIFRoZXNlIGNhbiB0aGVuIGJlIGJvdW5kIHRvIGFueSBidXR0b24gdGhlIHVzZXIgd2FudHMuIFVzZWZ1bCBmb3IgYmluZGluZyB0b1xyXG4gICAgY2FyZGJvYXJkIG9yIGFsdGVybmF0ZSBpbnB1dCBkZXZpY2VzLlxyXG5cclxuICAgIEZvciBleGFtcGxlLi4uXHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZWRvd24nLCBmdW5jdGlvbigpeyBsYXNlci5wcmVzc2VkKCB0cnVlICk7IH0gKTtcclxuICAqL1xyXG4gIGZ1bmN0aW9uIGFkZElucHV0T2JqZWN0KCBvYmplY3QgKXtcclxuICAgIGNvbnN0IGlucHV0ID0gY3JlYXRlSW5wdXQoIG9iamVjdCApO1xyXG5cclxuICAgIGlucHV0Lmxhc2VyLnByZXNzZWQgPSBmdW5jdGlvbiggZmxhZyApe1xyXG4gICAgICAvLyBvbmx5IHBheSBhdHRlbnRpb24gdG8gcHJlc3NlcyBvdmVyIHRoZSBHVUlcclxuICAgICAgaWYgKGZsYWcgJiYgKGlucHV0LmludGVyc2VjdGlvbnMubGVuZ3RoID4gMCkpIHtcclxuICAgICAgICBpbnB1dC5wcmVzc2VkID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpbnB1dC5wcmVzc2VkID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgaW5wdXQubGFzZXIuZ3JpcHBlZCA9IGZ1bmN0aW9uKCBmbGFnICl7XHJcbiAgICAgIGlucHV0LmdyaXBwZWQgPSBmbGFnO1xyXG4gICAgfTtcclxuXHJcbiAgICBpbnB1dC5sYXNlci5jdXJzb3IgPSBpbnB1dC5jdXJzb3I7XHJcblxyXG4gICAgaWYoIFRIUkVFLlZpdmVDb250cm9sbGVyICYmIG9iamVjdCBpbnN0YW5jZW9mIFRIUkVFLlZpdmVDb250cm9sbGVyICl7XHJcbiAgICAgIGJpbmRWaXZlQ29udHJvbGxlciggaW5wdXQsIG9iamVjdCwgaW5wdXQubGFzZXIucHJlc3NlZCwgaW5wdXQubGFzZXIuZ3JpcHBlZCApO1xyXG4gICAgfVxyXG5cclxuICAgIGlucHV0T2JqZWN0cy5wdXNoKCBpbnB1dCApO1xyXG5cclxuICAgIHJldHVybiBpbnB1dC5sYXNlcjtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBIZXJlIGFyZSB0aGUgbWFpbiBkYXQgZ3VpIGNvbnRyb2xsZXIgdHlwZXMuXHJcbiAgKi9cclxuXHJcbiAgZnVuY3Rpb24gYWRkU2xpZGVyKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgbWluID0gMC4wLCBtYXggPSAxMDAuMCApe1xyXG4gICAgY29uc3Qgc2xpZGVyID0gY3JlYXRlU2xpZGVyKCB7XHJcbiAgICAgIHRleHRDcmVhdG9yLCBwcm9wZXJ0eU5hbWUsIG9iamVjdCwgbWluLCBtYXgsXHJcbiAgICAgIGluaXRpYWxWYWx1ZTogb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29udHJvbGxlcnMucHVzaCggc2xpZGVyICk7XHJcblxyXG4gICAgcmV0dXJuIHNsaWRlcjtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFkZENoZWNrYm94KCBvYmplY3QsIHByb3BlcnR5TmFtZSApe1xyXG4gICAgY29uc3QgY2hlY2tib3ggPSBjcmVhdGVDaGVja2JveCh7XHJcbiAgICAgIHRleHRDcmVhdG9yLCBwcm9wZXJ0eU5hbWUsIG9iamVjdCxcclxuICAgICAgaW5pdGlhbFZhbHVlOiBvYmplY3RbIHByb3BlcnR5TmFtZSBdXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250cm9sbGVycy5wdXNoKCBjaGVja2JveCApO1xyXG5cclxuICAgIHJldHVybiBjaGVja2JveDtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFkZEJ1dHRvbiggb2JqZWN0LCBwcm9wZXJ0eU5hbWUgKXtcclxuICAgIGNvbnN0IGJ1dHRvbiA9IGNyZWF0ZUJ1dHRvbih7XHJcbiAgICAgIHRleHRDcmVhdG9yLCBwcm9wZXJ0eU5hbWUsIG9iamVjdFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29udHJvbGxlcnMucHVzaCggYnV0dG9uICk7XHJcbiAgICByZXR1cm4gYnV0dG9uO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYWRkRHJvcGRvd24oIG9iamVjdCwgcHJvcGVydHlOYW1lLCBvcHRpb25zICl7XHJcbiAgICBjb25zdCBkcm9wZG93biA9IGNyZWF0ZURyb3Bkb3duKHtcclxuICAgICAgdGV4dENyZWF0b3IsIHByb3BlcnR5TmFtZSwgb2JqZWN0LCBvcHRpb25zXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250cm9sbGVycy5wdXNoKCBkcm9wZG93biApO1xyXG4gICAgcmV0dXJuIGRyb3Bkb3duO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBBbiBpbXBsaWNpdCBBZGQgZnVuY3Rpb24gd2hpY2ggZGV0ZWN0cyBmb3IgcHJvcGVydHkgdHlwZVxyXG4gICAgYW5kIGdpdmVzIHlvdSB0aGUgY29ycmVjdCBjb250cm9sbGVyLlxyXG5cclxuICAgIERyb3Bkb3duOlxyXG4gICAgICBhZGQoIG9iamVjdCwgcHJvcGVydHlOYW1lLCBvYmplY3RUeXBlIClcclxuXHJcbiAgICBTbGlkZXI6XHJcbiAgICAgIGFkZCggb2JqZWN0LCBwcm9wZXJ0eU9mTnVtYmVyVHlwZSwgbWluLCBtYXggKVxyXG5cclxuICAgIENoZWNrYm94OlxyXG4gICAgICBhZGQoIG9iamVjdCwgcHJvcGVydHlPZkJvb2xlYW5UeXBlIClcclxuXHJcbiAgICBCdXR0b246XHJcbiAgICAgIGFkZCggb2JqZWN0LCBwcm9wZXJ0eU9mRnVuY3Rpb25UeXBlIClcclxuXHJcbiAgICBOb3QgdXNlZCBkaXJlY3RseS4gVXNlZCBieSBmb2xkZXJzLlxyXG4gICovXHJcblxyXG4gIGZ1bmN0aW9uIGFkZCggb2JqZWN0LCBwcm9wZXJ0eU5hbWUsIGFyZzMsIGFyZzQgKXtcclxuXHJcbiAgICBpZiggb2JqZWN0ID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIGVsc2VcclxuXHJcbiAgICBpZiggb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSA9PT0gdW5kZWZpbmVkICl7XHJcbiAgICAgIGNvbnNvbGUud2FybiggJ25vIHByb3BlcnR5IG5hbWVkJywgcHJvcGVydHlOYW1lLCAnb24gb2JqZWN0Jywgb2JqZWN0ICk7XHJcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiggaXNPYmplY3QoIGFyZzMgKSB8fCBpc0FycmF5KCBhcmczICkgKXtcclxuICAgICAgcmV0dXJuIGFkZERyb3Bkb3duKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgYXJnMyApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBpc051bWJlciggb2JqZWN0WyBwcm9wZXJ0eU5hbWVdICkgKXtcclxuICAgICAgcmV0dXJuIGFkZFNsaWRlciggb2JqZWN0LCBwcm9wZXJ0eU5hbWUsIGFyZzMsIGFyZzQgKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiggaXNCb29sZWFuKCBvYmplY3RbIHByb3BlcnR5TmFtZV0gKSApe1xyXG4gICAgICByZXR1cm4gYWRkQ2hlY2tib3goIG9iamVjdCwgcHJvcGVydHlOYW1lICk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGlzRnVuY3Rpb24oIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gKSApe1xyXG4gICAgICByZXR1cm4gYWRkQnV0dG9uKCBvYmplY3QsIHByb3BlcnR5TmFtZSApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICBhZGQgY291bGRuJ3QgZmlndXJlIGl0IG91dCwgcGFzcyBpdCBiYWNrIHRvIGZvbGRlclxyXG4gICAgcmV0dXJuIHVuZGVmaW5lZFxyXG4gIH1cclxuXHJcblxyXG4gIGZ1bmN0aW9uIGFkZFNpbXBsZVNsaWRlciggbWluID0gMCwgbWF4ID0gMSApe1xyXG4gICAgY29uc3QgcHJveHkgPSB7XHJcbiAgICAgIG51bWJlcjogbWluXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBhZGRTbGlkZXIoIHByb3h5LCAnbnVtYmVyJywgbWluLCBtYXggKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFkZFNpbXBsZURyb3Bkb3duKCBvcHRpb25zID0gW10gKXtcclxuICAgIGNvbnN0IHByb3h5ID0ge1xyXG4gICAgICBvcHRpb246ICcnXHJcbiAgICB9O1xyXG5cclxuICAgIGlmKCBvcHRpb25zICE9PSB1bmRlZmluZWQgKXtcclxuICAgICAgcHJveHkub3B0aW9uID0gaXNBcnJheSggb3B0aW9ucyApID8gb3B0aW9uc1sgMCBdIDogb3B0aW9uc1sgT2JqZWN0LmtleXMob3B0aW9ucylbMF0gXTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYWRkRHJvcGRvd24oIHByb3h5LCAnb3B0aW9uJywgb3B0aW9ucyApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYWRkU2ltcGxlQ2hlY2tib3goIGRlZmF1bHRPcHRpb24gPSBmYWxzZSApe1xyXG4gICAgY29uc3QgcHJveHkgPSB7XHJcbiAgICAgIGNoZWNrZWQ6IGRlZmF1bHRPcHRpb25cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGFkZENoZWNrYm94KCBwcm94eSwgJ2NoZWNrZWQnICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhZGRTaW1wbGVCdXR0b24oIGZuICl7XHJcbiAgICBjb25zdCBwcm94eSA9IHtcclxuICAgICAgYnV0dG9uOiAoZm4hPT11bmRlZmluZWQpID8gZm4gOiBmdW5jdGlvbigpe31cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGFkZEJ1dHRvbiggcHJveHksICdidXR0b24nICk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIE5vdCB1c2VkIGRpcmVjdGx5OyB1c2VkIGJ5IGZvbGRlcnMuXHJcbiAgUmVtb3ZlIGNvbnRyb2xsZXJzIGZyb20gdGhlIGdsb2JhbCBsaXN0IG9mIGFsbCBjb250cm9sbGVycyBrbm93biB0byBkYXQuR1VJVlIuXHJcbiAgQ2FsbHMgcmVtb3ZlVGVzdCBmaXJzdCB0byBjaGVjayBpbnB1dCBhcmd1bWVudHMuICByZXR1cm5zIGZhbHNlIGlmIHRoaXMgdGVzdCBmYWlscy5cclxuICByZXR1cm5zIHRydWUgaWYgc3VjY2Vzc2Z1bC5cclxuXHJcbiAgTm90ZSB0aGF0IHRoaXMgZnVuY3Rpb24gZG9lcyBub3QgcmVjdXJzaXZlbHkgcmVtb3ZlIGVsZW1lbnRzIGZyb20gZm9sZGVyczsgdGhhdCBpcyBkZWFsdCB3aXRoIGluIHRoZSBmb2xkZXIgY29kZSB3aGljaCBjYWxscyB0aGlzLlxyXG4gIFxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHJlbW92ZSggLi4uYXJncyApe1xyXG4gICAgbGV0IGFyZ1NldCA9IFsgLi4ubmV3IFNldChhcmdzKSBdOyAvL2p1c3QgaW4gY2FzZSB0aGVyZSB3ZXJlIHJlcGVhdGVkIGVsZW1lbnRzIGluIGFyZ3MsIHR1cm4gaW50byBTZXQgdGhlbiBiYWNrIHRvIGFycmF5LlxyXG4gICAgaWYgKCAhcmVtb3ZlVGVzdCguLi5hcmdTZXQpICkgcmV0dXJuIGZhbHNlO1xyXG4gICAgYXJnU2V0LmZvckVhY2goIGZ1bmN0aW9uKCBvYmogKXtcclxuICAgICAgdmFyIGkgPSBjb250cm9sbGVycy5pbmRleE9mKCBvYmogKTtcclxuICAgICAgaWYgKCBpID4gLTEpIGNvbnRyb2xsZXJzLnNwbGljZSggaSwgMSApO1xyXG4gICAgICBlbHNlIHsgLy8gSSBjYW4ndCBzZWUgaG93IHRoaXMnZCBoYXBwZW4gbm93IHdlIGd1YXJkIGFnYWluc3QgcmVwZWF0ZWQgZWxlbWVudHMuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJJbnRlcm5hbCBlcnJvciBpbiByZW1vdmUsIG5vdCBhbnRpY2lwYXRlZCBieSByZW1vdmVUZXN0LiBJbnRlcm5hbCBkYXQuR1VJVlIgc3RhdGUgbWF5IGJlIGluY29uc2lzdGVudC5cIik7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICBWZXJpZnkgdGhhdCBhbGwgb2YgdGhlIGl0ZW1zIGluIHByb3ZpZGVkIGFyZ3VtZW50cyBhcmUgZXhpc3RpbmcgY29udHJvbGxlcnMgdGhhdCBzaG91bGQgYmUgb2sgdG8gcmVtb3ZlLlxyXG5cclxuICBSZXR1cm5zIGZhbHNlIGlmIHRoZXJlIGFyZSBhbnkgbWlzbWF0Y2hlcywgdHJ1ZSBpZiBiZWxpZXZlZCBvayB0byBjb250aW51ZSB3aXRoIGFjdHVhbCByZW1vdmUoKVxyXG5cclxuICBJZiBhbnkgb2YgdGhlIHByb3ZpZGVkIGFyZ3MgYXJlIGZvbGRlcnMgKGhhdmUgaXNGb2xkZXIgcHJvcGVydHkpIHRoaXMgaXMgY2FsbGVkIHJlY3Vyc2l2ZWx5LlxyXG4gIFRoaXMgd2lsbCByZXN1bHQgaW4gcmVkdW5kYW50IHdvcmsgYXMgZWFjaCBmb2xkZXIgd2lsbCBhbHNvIGNhbGwgaXQgYWdhaW4gYXMgaXQncyByZW1vdmVkLCBidXQgdGhpcyBpcyBjaGVhcFxyXG4gIGFuZCBpdCBtZWFucyB0aGF0IGFueSBlcnJvciBzaG91bGQgYmUgY2F1Z2h0IGFzIGVhcmx5IGFzIHBvc3NpYmxlIGFuZCB0aGUgd2hvbGUgcHJvY2VzcyBhYm9ydGVkLlxyXG4gICovXHJcbiAgZnVuY3Rpb24gcmVtb3ZlVGVzdCggLi4uYXJncyApIHtcclxuICAgIGZvciAodmFyIGk9MDsgaTxhcmdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBvYmogPSBhcmdzW2ldO1xyXG4gICAgICBpZiAoY29udHJvbGxlcnMuaW5kZXhPZihvYmopID09PSAtMSB8fCAhb2JqLmZvbGRlci5oYXNDaGlsZChvYmopKSB7XHJcbiAgICAgICAgLy9UT0RPOiB0b1N0cmluZyBpbXBsZW1lbnRhdGlvbnMgZm9yIGNvbnRyb2xsZXJzXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJDYW4ndCByZW1vdmUgY29udHJvbGxlciBcIiArIG9iaik7IC8vbm90IHN1cmUgdGhlIHByZWZlcnJlZCB3YXkgb2YgcmVwb3J0aW5nIHByb2JsZW0gdG8gdXNlci5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKG9iai5pc0ZvbGRlcikge1xyXG4gICAgICAgIGlmICghcmVtb3ZlVGVzdCggLi4ub2JqLmd1aUNoaWxkcmVuICkpIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gICAgQ3JlYXRlcyBhIGZvbGRlciB3aXRoIHRoZSBuYW1lLlxyXG5cclxuICAgIEZvbGRlcnMgYXJlIFRIUkVFLkdyb3VwIHR5cGUgb2JqZWN0cyBhbmQgY2FuIGRvIGdyb3VwLmFkZCgpIGZvciBzaWJsaW5ncy5cclxuICAgIEZvbGRlcnMgd2lsbCBhdXRvbWF0aWNhbGx5IGF0dGVtcHQgdG8gbGF5IGl0cyBjaGlsZHJlbiBvdXQgaW4gc2VxdWVuY2UuXHJcblxyXG4gICAgRm9sZGVycyBhcmUgZ2l2ZW4gdGhlIGFkZCgpIGZ1bmN0aW9uYWxpdHkgc28gdGhhdCB0aGV5IGNhbiBkb1xyXG4gICAgZm9sZGVyLmFkZCggLi4uICkgdG8gY3JlYXRlIGNvbnRyb2xsZXJzLlxyXG4gICovXHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZSggbmFtZSApe1xyXG4gICAgY29uc3QgZm9sZGVyID0gY3JlYXRlRm9sZGVyKHtcclxuICAgICAgdGV4dENyZWF0b3IsXHJcbiAgICAgIG5hbWUsXHJcbiAgICAgIGd1aUFkZDogYWRkLFxyXG4gICAgICBndWlSZW1vdmU6IHJlbW92ZSxcclxuICAgICAgYWRkU2xpZGVyOiBhZGRTaW1wbGVTbGlkZXIsXHJcbiAgICAgIGFkZERyb3Bkb3duOiBhZGRTaW1wbGVEcm9wZG93bixcclxuICAgICAgYWRkQ2hlY2tib3g6IGFkZFNpbXBsZUNoZWNrYm94LFxyXG4gICAgICBhZGRCdXR0b246IGFkZFNpbXBsZUJ1dHRvblxyXG4gICAgfSk7XHJcblxyXG4gICAgY29udHJvbGxlcnMucHVzaCggZm9sZGVyICk7XHJcblxyXG4gICAgcmV0dXJuIGZvbGRlcjtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAvKlxyXG4gICAgUGVyZm9ybSB0aGUgbmVjZXNzYXJ5IHVwZGF0ZXMsIHJheWNhc3RzIG9uIGl0cyBvd24gUkFGLlxyXG4gICovXHJcblxyXG4gIGNvbnN0IHRQb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbiAgY29uc3QgdERpcmVjdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCAwLCAwLCAtMSApO1xyXG4gIGNvbnN0IHRNYXRyaXggPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xyXG5cclxuICBmdW5jdGlvbiB1cGRhdGUoKSB7XHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHVwZGF0ZSApO1xyXG5cclxuICAgIHZhciBoaXRzY2FuT2JqZWN0cyA9IGdldFZpc2libGVIaXRzY2FuT2JqZWN0cygpO1xyXG5cclxuICAgIGlmKCBtb3VzZUVuYWJsZWQgKXtcclxuICAgICAgbW91c2VJbnB1dC5pbnRlcnNlY3Rpb25zID0gcGVyZm9ybU1vdXNlSW5wdXQoIGhpdHNjYW5PYmplY3RzLCBtb3VzZUlucHV0ICk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5wdXRPYmplY3RzLmZvckVhY2goIGZ1bmN0aW9uKCB7Ym94LG9iamVjdCxyYXljYXN0LGxhc2VyLGN1cnNvcn0gPSB7fSwgaW5kZXggKXtcclxuICAgICAgb2JqZWN0LnVwZGF0ZU1hdHJpeFdvcmxkKCk7XHJcblxyXG4gICAgICB0UG9zaXRpb24uc2V0KDAsMCwwKS5zZXRGcm9tTWF0cml4UG9zaXRpb24oIG9iamVjdC5tYXRyaXhXb3JsZCApO1xyXG4gICAgICB0TWF0cml4LmlkZW50aXR5KCkuZXh0cmFjdFJvdGF0aW9uKCBvYmplY3QubWF0cml4V29ybGQgKTtcclxuICAgICAgdERpcmVjdGlvbi5zZXQoMCwwLC0xKS5hcHBseU1hdHJpeDQoIHRNYXRyaXggKS5ub3JtYWxpemUoKTtcclxuXHJcbiAgICAgIHJheWNhc3Quc2V0KCB0UG9zaXRpb24sIHREaXJlY3Rpb24gKTtcclxuXHJcbiAgICAgIGxhc2VyLmdlb21ldHJ5LnZlcnRpY2VzWyAwIF0uY29weSggdFBvc2l0aW9uICk7XHJcblxyXG4gICAgICAvLyAgZGVidWcuLi5cclxuICAgICAgLy8gbGFzZXIuZ2VvbWV0cnkudmVydGljZXNbIDEgXS5jb3B5KCB0UG9zaXRpb24gKS5hZGQoIHREaXJlY3Rpb24ubXVsdGlwbHlTY2FsYXIoIDEgKSApO1xyXG5cclxuICAgICAgY29uc3QgaW50ZXJzZWN0aW9ucyA9IHJheWNhc3QuaW50ZXJzZWN0T2JqZWN0cyggaGl0c2Nhbk9iamVjdHMsIGZhbHNlICk7XHJcbiAgICAgIHBhcnNlSW50ZXJzZWN0aW9ucyggaW50ZXJzZWN0aW9ucywgbGFzZXIsIGN1cnNvciApO1xyXG5cclxuICAgICAgaW5wdXRPYmplY3RzWyBpbmRleCBdLmludGVyc2VjdGlvbnMgPSBpbnRlcnNlY3Rpb25zO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgaW5wdXRzID0gaW5wdXRPYmplY3RzLnNsaWNlKCk7XHJcblxyXG4gICAgaWYoIG1vdXNlRW5hYmxlZCApe1xyXG4gICAgICBpbnB1dHMucHVzaCggbW91c2VJbnB1dCApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnRyb2xsZXJzLmZvckVhY2goIGZ1bmN0aW9uKCBjb250cm9sbGVyICl7XHJcbiAgICAgIC8vbmIsIHdlIGNvdWxkIGRvIGEgbW9yZSB0aG9yb3VnaCBjaGVjayBmb3IgdmlzaWJpbHR5LCBub3Qgc3VyZSBob3cgaW1wb3J0YW50XHJcbiAgICAgIC8vdGhpcyBiaXQgaXMgYXQgdGhpcyBzdGFnZS4uLlxyXG4gICAgICBpZiAoY29udHJvbGxlci52aXNpYmxlKSBjb250cm9sbGVyLnVwZGF0ZUNvbnRyb2woIGlucHV0cyApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVMYXNlciggbGFzZXIsIHBvaW50ICl7XHJcbiAgICBsYXNlci5nZW9tZXRyeS52ZXJ0aWNlc1sgMSBdLmNvcHkoIHBvaW50ICk7XHJcbiAgICBsYXNlci52aXNpYmxlID0gdHJ1ZTtcclxuICAgIGxhc2VyLmdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ1NwaGVyZSgpO1xyXG4gICAgbGFzZXIuZ2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nQm94KCk7XHJcbiAgICBsYXNlci5nZW9tZXRyeS52ZXJ0aWNlc05lZWRVcGRhdGUgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcGFyc2VJbnRlcnNlY3Rpb25zKCBpbnRlcnNlY3Rpb25zLCBsYXNlciwgY3Vyc29yICl7XHJcbiAgICBpZiggaW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwICl7XHJcbiAgICAgIGNvbnN0IGZpcnN0SGl0ID0gaW50ZXJzZWN0aW9uc1sgMCBdO1xyXG4gICAgICB1cGRhdGVMYXNlciggbGFzZXIsIGZpcnN0SGl0LnBvaW50ICk7XHJcbiAgICAgIGN1cnNvci5wb3NpdGlvbi5jb3B5KCBmaXJzdEhpdC5wb2ludCApO1xyXG4gICAgICBjdXJzb3IudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgIGN1cnNvci51cGRhdGVNYXRyaXhXb3JsZCgpO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgbGFzZXIudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICBjdXJzb3IudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcGFyc2VNb3VzZUludGVyc2VjdGlvbiggaW50ZXJzZWN0aW9uLCBsYXNlciwgY3Vyc29yICl7XHJcbiAgICBjdXJzb3IucG9zaXRpb24uY29weSggaW50ZXJzZWN0aW9uICk7XHJcbiAgICB1cGRhdGVMYXNlciggbGFzZXIsIGN1cnNvci5wb3NpdGlvbiApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcGVyZm9ybU1vdXNlSW50ZXJzZWN0aW9uKCByYXljYXN0LCBtb3VzZSwgY2FtZXJhICl7XHJcbiAgICByYXljYXN0LnNldEZyb21DYW1lcmEoIG1vdXNlLCBjYW1lcmEgKTtcclxuICAgIGNvbnN0IGhpdHNjYW5PYmplY3RzID0gZ2V0VmlzaWJsZUhpdHNjYW5PYmplY3RzKCk7XHJcbiAgICByZXR1cm4gcmF5Y2FzdC5pbnRlcnNlY3RPYmplY3RzKCBoaXRzY2FuT2JqZWN0cywgZmFsc2UgKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG1vdXNlSW50ZXJzZWN0c1BsYW5lKCByYXljYXN0LCB2LCBwbGFuZSApe1xyXG4gICAgcmV0dXJuIHJheWNhc3QucmF5LmludGVyc2VjdFBsYW5lKCBwbGFuZSwgdiApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcGVyZm9ybU1vdXNlSW5wdXQoIGhpdHNjYW5PYmplY3RzLCB7Ym94LG9iamVjdCxyYXljYXN0LGxhc2VyLGN1cnNvcixtb3VzZSxtb3VzZUNhbWVyYX0gPSB7fSApe1xyXG4gICAgbGV0IGludGVyc2VjdGlvbnMgPSBbXTtcclxuXHJcbiAgICBpZiAobW91c2VDYW1lcmEpIHtcclxuICAgICAgaW50ZXJzZWN0aW9ucyA9IHBlcmZvcm1Nb3VzZUludGVyc2VjdGlvbiggcmF5Y2FzdCwgbW91c2UsIG1vdXNlQ2FtZXJhICk7XHJcbiAgICAgIHBhcnNlSW50ZXJzZWN0aW9ucyggaW50ZXJzZWN0aW9ucywgbGFzZXIsIGN1cnNvciApO1xyXG4gICAgICBjdXJzb3IudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgIGxhc2VyLnZpc2libGUgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBpbnRlcnNlY3Rpb25zO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKCk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAvKlxyXG4gICAgUHVibGljIG1ldGhvZHMuXHJcbiAgKi9cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGNyZWF0ZSxcclxuICAgIGFkZElucHV0T2JqZWN0LFxyXG4gICAgZW5hYmxlTW91c2UsXHJcbiAgICBkaXNhYmxlTW91c2VcclxuICB9O1xyXG5cclxufSgpKTtcclxuXHJcbmlmKCB3aW5kb3cgKXtcclxuICBpZiggd2luZG93LmRhdCA9PT0gdW5kZWZpbmVkICl7XHJcbiAgICB3aW5kb3cuZGF0ID0ge307XHJcbiAgfVxyXG5cclxuICB3aW5kb3cuZGF0LkdVSVZSID0gR1VJVlI7XHJcbn1cclxuXHJcbmlmKCBtb2R1bGUgKXtcclxuICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGRhdDogR1VJVlJcclxuICB9O1xyXG59XHJcblxyXG5pZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcclxuICBkZWZpbmUoW10sIEdVSVZSKTtcclxufVxyXG5cclxuLypcclxuICBCdW5jaCBvZiBzdGF0ZS1sZXNzIHV0aWxpdHkgZnVuY3Rpb25zLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gaXNOdW1iZXIobikge1xyXG4gIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzQm9vbGVhbihuKXtcclxuICByZXR1cm4gdHlwZW9mIG4gPT09ICdib29sZWFuJztcclxufVxyXG5cclxuZnVuY3Rpb24gaXNGdW5jdGlvbihmdW5jdGlvblRvQ2hlY2spIHtcclxuICBjb25zdCBnZXRUeXBlID0ge307XHJcbiAgcmV0dXJuIGZ1bmN0aW9uVG9DaGVjayAmJiBnZXRUeXBlLnRvU3RyaW5nLmNhbGwoZnVuY3Rpb25Ub0NoZWNrKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcclxufVxyXG5cclxuLy8gIG9ubHkge30gb2JqZWN0cyBub3QgYXJyYXlzXHJcbi8vICAgICAgICAgICAgICAgICAgICB3aGljaCBhcmUgdGVjaG5pY2FsbHkgb2JqZWN0cyBidXQgeW91J3JlIGp1c3QgYmVpbmcgcGVkYW50aWNcclxuZnVuY3Rpb24gaXNPYmplY3QgKGl0ZW0pIHtcclxuICByZXR1cm4gKHR5cGVvZiBpdGVtID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShpdGVtKSAmJiBpdGVtICE9PSBudWxsKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNBcnJheSggbyApe1xyXG4gIHJldHVybiBBcnJheS5pc0FycmF5KCBvICk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAgQ29udHJvbGxlci1zcGVjaWZpYyBzdXBwb3J0LlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gYmluZFZpdmVDb250cm9sbGVyKCBpbnB1dCwgY29udHJvbGxlciwgcHJlc3NlZCwgZ3JpcHBlZCApe1xyXG4gIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lciggJ3RyaWdnZXJkb3duJywgKCk9PnByZXNzZWQoIHRydWUgKSApO1xyXG4gIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lciggJ3RyaWdnZXJ1cCcsICgpPT5wcmVzc2VkKCBmYWxzZSApICk7XHJcbiAgY29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKCAnZ3JpcHNkb3duJywgKCk9PmdyaXBwZWQoIHRydWUgKSApO1xyXG4gIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lciggJ2dyaXBzdXAnLCAoKT0+Z3JpcHBlZCggZmFsc2UgKSApO1xyXG5cclxuICBjb25zdCBnYW1lcGFkID0gY29udHJvbGxlci5nZXRHYW1lcGFkKCk7XHJcbiAgZnVuY3Rpb24gdmlicmF0ZSggdCwgYSApe1xyXG4gICAgaWYoIGdhbWVwYWQgJiYgZ2FtZXBhZC5oYXB0aWNBY3R1YXRvcnMubGVuZ3RoID4gMCApe1xyXG4gICAgICBnYW1lcGFkLmhhcHRpY0FjdHVhdG9yc1sgMCBdLnB1bHNlKCB0LCBhICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYXB0aWNzVGFwKCl7XHJcbiAgICBzZXRJbnRlcnZhbFRpbWVzKCAoeCx0LGEpPT52aWJyYXRlKDEtYSwgMC41KSwgMTAsIDIwICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYXB0aWNzRWNobygpe1xyXG4gICAgc2V0SW50ZXJ2YWxUaW1lcyggKHgsdCxhKT0+dmlicmF0ZSg0LCAxLjAgKiAoMS1hKSksIDEwMCwgNCApO1xyXG4gIH1cclxuXHJcbiAgaW5wdXQuZXZlbnRzLm9uKCAnb25Db250cm9sbGVySGVsZCcsIGZ1bmN0aW9uKCBpbnB1dCApe1xyXG4gICAgdmlicmF0ZSggMC4zLCAwLjMgKTtcclxuICB9KTtcclxuXHJcbiAgaW5wdXQuZXZlbnRzLm9uKCAnZ3JhYmJlZCcsIGZ1bmN0aW9uKCl7XHJcbiAgICBoYXB0aWNzVGFwKCk7XHJcbiAgfSk7XHJcblxyXG4gIGlucHV0LmV2ZW50cy5vbiggJ2dyYWJSZWxlYXNlZCcsIGZ1bmN0aW9uKCl7XHJcbiAgICBoYXB0aWNzRWNobygpO1xyXG4gIH0pO1xyXG5cclxuICBpbnB1dC5ldmVudHMub24oICdwaW5uZWQnLCBmdW5jdGlvbigpe1xyXG4gICAgaGFwdGljc1RhcCgpO1xyXG4gIH0pO1xyXG5cclxuICBpbnB1dC5ldmVudHMub24oICdwaW5SZWxlYXNlZCcsIGZ1bmN0aW9uKCl7XHJcbiAgICBoYXB0aWNzRWNobygpO1xyXG4gIH0pO1xyXG5cclxuXHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBzZXRJbnRlcnZhbFRpbWVzKCBjYiwgZGVsYXksIHRpbWVzICl7XHJcbiAgbGV0IHggPSAwO1xyXG4gIGxldCBpZCA9IHNldEludGVydmFsKCBmdW5jdGlvbigpe1xyXG4gICAgY2IoIHgsIHRpbWVzLCB4L3RpbWVzICk7XHJcbiAgICB4Kys7XHJcbiAgICBpZiggeD49dGltZXMgKXtcclxuICAgICAgY2xlYXJJbnRlcnZhbCggaWQgKTtcclxuICAgIH1cclxuICB9LCBkZWxheSApO1xyXG4gIHJldHVybiBpZDtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcbmltcG9ydCBFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVJbnRlcmFjdGlvbiggaGl0Vm9sdW1lICl7XHJcbiAgY29uc3QgZXZlbnRzID0gbmV3IEVtaXR0ZXIoKTtcclxuXHJcbiAgbGV0IGFueUhvdmVyID0gZmFsc2U7XHJcbiAgbGV0IGFueVByZXNzaW5nID0gZmFsc2U7XHJcblxyXG4gIGxldCBob3ZlciA9IGZhbHNlO1xyXG4gIGxldCBhbnlBY3RpdmUgPSBmYWxzZTtcclxuXHJcbiAgY29uc3QgdFZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbiAgY29uc3QgYXZhaWxhYmxlSW5wdXRzID0gW107XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZSggaW5wdXRPYmplY3RzICl7XHJcblxyXG4gICAgaG92ZXIgPSBmYWxzZTtcclxuICAgIGFueVByZXNzaW5nID0gZmFsc2U7XHJcbiAgICBhbnlBY3RpdmUgPSBmYWxzZTtcclxuXHJcbiAgICBpbnB1dE9iamVjdHMuZm9yRWFjaCggZnVuY3Rpb24oIGlucHV0ICl7XHJcblxyXG4gICAgICBpZiggYXZhaWxhYmxlSW5wdXRzLmluZGV4T2YoIGlucHV0ICkgPCAwICl7XHJcbiAgICAgICAgYXZhaWxhYmxlSW5wdXRzLnB1c2goIGlucHV0ICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHsgaGl0T2JqZWN0LCBoaXRQb2ludCB9ID0gZXh0cmFjdEhpdCggaW5wdXQgKTtcclxuXHJcbiAgICAgIGhvdmVyID0gaG92ZXIgfHwgaGl0Vm9sdW1lID09PSBoaXRPYmplY3Q7XHJcblxyXG4gICAgICBwZXJmb3JtU3RhdGVFdmVudHMoe1xyXG4gICAgICAgIGlucHV0LFxyXG4gICAgICAgIGhvdmVyLFxyXG4gICAgICAgIGhpdE9iamVjdCwgaGl0UG9pbnQsXHJcbiAgICAgICAgYnV0dG9uTmFtZTogJ3ByZXNzZWQnLFxyXG4gICAgICAgIGludGVyYWN0aW9uTmFtZTogJ3ByZXNzJyxcclxuICAgICAgICBkb3duTmFtZTogJ29uUHJlc3NlZCcsXHJcbiAgICAgICAgaG9sZE5hbWU6ICdwcmVzc2luZycsXHJcbiAgICAgICAgdXBOYW1lOiAnb25SZWxlYXNlZCdcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBwZXJmb3JtU3RhdGVFdmVudHMoe1xyXG4gICAgICAgIGlucHV0LFxyXG4gICAgICAgIGhvdmVyLFxyXG4gICAgICAgIGhpdE9iamVjdCwgaGl0UG9pbnQsXHJcbiAgICAgICAgYnV0dG9uTmFtZTogJ2dyaXBwZWQnLFxyXG4gICAgICAgIGludGVyYWN0aW9uTmFtZTogJ2dyaXAnLFxyXG4gICAgICAgIGRvd25OYW1lOiAnb25HcmlwcGVkJyxcclxuICAgICAgICBob2xkTmFtZTogJ2dyaXBwaW5nJyxcclxuICAgICAgICB1cE5hbWU6ICdvblJlbGVhc2VHcmlwJ1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGV2ZW50cy5lbWl0KCAndGljaycsIHtcclxuICAgICAgICBpbnB1dCxcclxuICAgICAgICBoaXRPYmplY3QsXHJcbiAgICAgICAgaW5wdXRPYmplY3Q6IGlucHV0Lm9iamVjdFxyXG4gICAgICB9ICk7XHJcblxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZXh0cmFjdEhpdCggaW5wdXQgKXtcclxuICAgIGlmKCBpbnB1dC5pbnRlcnNlY3Rpb25zLmxlbmd0aCA8PSAwICl7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgaGl0UG9pbnQ6IHRWZWN0b3Iuc2V0RnJvbU1hdHJpeFBvc2l0aW9uKCBpbnB1dC5jdXJzb3IubWF0cml4V29ybGQgKS5jbG9uZSgpLFxyXG4gICAgICAgIGhpdE9iamVjdDogdW5kZWZpbmVkLFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBoaXRQb2ludDogaW5wdXQuaW50ZXJzZWN0aW9uc1sgMCBdLnBvaW50LFxyXG4gICAgICAgIGhpdE9iamVjdDogaW5wdXQuaW50ZXJzZWN0aW9uc1sgMCBdLm9iamVjdFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcGVyZm9ybVN0YXRlRXZlbnRzKHtcclxuICAgIGlucHV0LCBob3ZlcixcclxuICAgIGhpdE9iamVjdCwgaGl0UG9pbnQsXHJcbiAgICBidXR0b25OYW1lLCBpbnRlcmFjdGlvbk5hbWUsIGRvd25OYW1lLCBob2xkTmFtZSwgdXBOYW1lXHJcbiAgfSA9IHt9ICl7XHJcblxyXG4gICAgaWYoIGlucHV0WyBidXR0b25OYW1lIF0gPT09IHRydWUgJiYgaGl0T2JqZWN0ID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICBob3ZlcmluZyBhbmQgYnV0dG9uIGRvd24gYnV0IG5vIGludGVyYWN0aW9ucyBhY3RpdmUgeWV0XHJcbiAgICBpZiggaG92ZXIgJiYgaW5wdXRbIGJ1dHRvbk5hbWUgXSA9PT0gdHJ1ZSAmJiBpbnB1dC5pbnRlcmFjdGlvblsgaW50ZXJhY3Rpb25OYW1lIF0gPT09IHVuZGVmaW5lZCApe1xyXG5cclxuICAgICAgY29uc3QgcGF5bG9hZCA9IHtcclxuICAgICAgICBpbnB1dCxcclxuICAgICAgICBoaXRPYmplY3QsXHJcbiAgICAgICAgcG9pbnQ6IGhpdFBvaW50LFxyXG4gICAgICAgIGlucHV0T2JqZWN0OiBpbnB1dC5vYmplY3QsXHJcbiAgICAgICAgbG9ja2VkOiBmYWxzZVxyXG4gICAgICB9O1xyXG4gICAgICBldmVudHMuZW1pdCggZG93bk5hbWUsIHBheWxvYWQgKTtcclxuXHJcbiAgICAgIGlmKCBwYXlsb2FkLmxvY2tlZCApe1xyXG4gICAgICAgIGlucHV0LmludGVyYWN0aW9uWyBpbnRlcmFjdGlvbk5hbWUgXSA9IGludGVyYWN0aW9uO1xyXG4gICAgICAgIGlucHV0LmludGVyYWN0aW9uLmhvdmVyID0gaW50ZXJhY3Rpb247XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGFueVByZXNzaW5nID0gdHJ1ZTtcclxuICAgICAgYW55QWN0aXZlID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAgYnV0dG9uIHN0aWxsIGRvd24gYW5kIHRoaXMgaXMgdGhlIGFjdGl2ZSBpbnRlcmFjdGlvblxyXG4gICAgaWYoIGlucHV0WyBidXR0b25OYW1lIF0gJiYgaW5wdXQuaW50ZXJhY3Rpb25bIGludGVyYWN0aW9uTmFtZSBdID09PSBpbnRlcmFjdGlvbiApe1xyXG4gICAgICBjb25zdCBwYXlsb2FkID0ge1xyXG4gICAgICAgIGlucHV0LFxyXG4gICAgICAgIGhpdE9iamVjdCxcclxuICAgICAgICBwb2ludDogaGl0UG9pbnQsXHJcbiAgICAgICAgaW5wdXRPYmplY3Q6IGlucHV0Lm9iamVjdCxcclxuICAgICAgICBsb2NrZWQ6IGZhbHNlXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBldmVudHMuZW1pdCggaG9sZE5hbWUsIHBheWxvYWQgKTtcclxuXHJcbiAgICAgIGFueVByZXNzaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgIGlucHV0LmV2ZW50cy5lbWl0KCAnb25Db250cm9sbGVySGVsZCcgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAgYnV0dG9uIG5vdCBkb3duIGFuZCB0aGlzIGlzIHRoZSBhY3RpdmUgaW50ZXJhY3Rpb25cclxuICAgIGlmKCBpbnB1dFsgYnV0dG9uTmFtZSBdID09PSBmYWxzZSAmJiBpbnB1dC5pbnRlcmFjdGlvblsgaW50ZXJhY3Rpb25OYW1lIF0gPT09IGludGVyYWN0aW9uICl7XHJcbiAgICAgIGlucHV0LmludGVyYWN0aW9uWyBpbnRlcmFjdGlvbk5hbWUgXSA9IHVuZGVmaW5lZDtcclxuICAgICAgaW5wdXQuaW50ZXJhY3Rpb24uaG92ZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgIGV2ZW50cy5lbWl0KCB1cE5hbWUsIHtcclxuICAgICAgICBpbnB1dCxcclxuICAgICAgICBoaXRPYmplY3QsXHJcbiAgICAgICAgcG9pbnQ6IGhpdFBvaW50LFxyXG4gICAgICAgIGlucHV0T2JqZWN0OiBpbnB1dC5vYmplY3RcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaXNNYWluSG92ZXIoKXtcclxuXHJcbiAgICBsZXQgbm9NYWluSG92ZXIgPSB0cnVlO1xyXG4gICAgZm9yKCBsZXQgaT0wOyBpPGF2YWlsYWJsZUlucHV0cy5sZW5ndGg7IGkrKyApe1xyXG4gICAgICBpZiggYXZhaWxhYmxlSW5wdXRzWyBpIF0uaW50ZXJhY3Rpb24uaG92ZXIgIT09IHVuZGVmaW5lZCApe1xyXG4gICAgICAgIG5vTWFpbkhvdmVyID0gZmFsc2U7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiggbm9NYWluSG92ZXIgKXtcclxuICAgICAgcmV0dXJuIGhvdmVyO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBhdmFpbGFibGVJbnB1dHMuZmlsdGVyKCBmdW5jdGlvbiggaW5wdXQgKXtcclxuICAgICAgcmV0dXJuIGlucHV0LmludGVyYWN0aW9uLmhvdmVyID09PSBpbnRlcmFjdGlvbjtcclxuICAgIH0pLmxlbmd0aCA+IDAgKXtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcblxyXG4gIGNvbnN0IGludGVyYWN0aW9uID0ge1xyXG4gICAgaG92ZXJpbmc6IGlzTWFpbkhvdmVyLFxyXG4gICAgcHJlc3Npbmc6ICgpPT5hbnlQcmVzc2luZyxcclxuICAgIHVwZGF0ZSxcclxuICAgIGV2ZW50c1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBpbnRlcmFjdGlvbjtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFsaWduTGVmdCggb2JqICl7XHJcbiAgaWYoIG9iaiBpbnN0YW5jZW9mIFRIUkVFLk1lc2ggKXtcclxuICAgIG9iai5nZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuICAgIGNvbnN0IHdpZHRoID0gb2JqLmdlb21ldHJ5LmJvdW5kaW5nQm94Lm1heC54IC0gb2JqLmdlb21ldHJ5LmJvdW5kaW5nQm94Lm1heC55O1xyXG4gICAgb2JqLmdlb21ldHJ5LnRyYW5zbGF0ZSggd2lkdGgsIDAsIDAgKTtcclxuICAgIHJldHVybiBvYmo7XHJcbiAgfVxyXG4gIGVsc2UgaWYoIG9iaiBpbnN0YW5jZW9mIFRIUkVFLkdlb21ldHJ5ICl7XHJcbiAgICBvYmouY29tcHV0ZUJvdW5kaW5nQm94KCk7XHJcbiAgICBjb25zdCB3aWR0aCA9IG9iai5ib3VuZGluZ0JveC5tYXgueCAtIG9iai5ib3VuZGluZ0JveC5tYXgueTtcclxuICAgIG9iai50cmFuc2xhdGUoIHdpZHRoLCAwLCAwICk7XHJcbiAgICByZXR1cm4gb2JqO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVBhbmVsKCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCwgdW5pcXVlTWF0ZXJpYWwgKXtcclxuICBjb25zdCBtYXRlcmlhbCA9IHVuaXF1ZU1hdGVyaWFsID8gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtjb2xvcjoweGZmZmZmZn0pIDogU2hhcmVkTWF0ZXJpYWxzLlBBTkVMO1xyXG4gIGNvbnN0IHBhbmVsID0gbmV3IFRIUkVFLk1lc2goIG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggd2lkdGgsIGhlaWdodCwgZGVwdGggKSwgbWF0ZXJpYWwgKTtcclxuICBwYW5lbC5nZW9tZXRyeS50cmFuc2xhdGUoIHdpZHRoICogMC41LCAwLCAwICk7XHJcblxyXG4gIGlmKCB1bmlxdWVNYXRlcmlhbCApe1xyXG4gICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuREVGQVVMVF9CQUNLICk7XHJcbiAgfVxyXG4gIGVsc2V7XHJcbiAgICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggcGFuZWwuZ2VvbWV0cnksIENvbG9ycy5ERUZBVUxUX0JBQ0sgKTtcclxuICB9XHJcblxyXG4gIHBhbmVsLnVzZXJEYXRhLmN1cnJlbnRXaWR0aCA9IHdpZHRoO1xyXG4gIHBhbmVsLnVzZXJEYXRhLmN1cnJlbnRIZWlnaHQgPSBoZWlnaHQ7XHJcbiAgcGFuZWwudXNlckRhdGEuY3VycmVudERlcHRoID0gZGVwdGg7XHJcblxyXG4gIHJldHVybiBwYW5lbDtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gcmVzaXplUGFuZWwocGFuZWwsIHdpZHRoLCBoZWlnaHQsIGRlcHRoKSB7XHJcbiAgcGFuZWwuZ2VvbWV0cnkuc2NhbGUod2lkdGgvcGFuZWwudXNlckRhdGEuY3VycmVudFdpZHRoLCBoZWlnaHQvcGFuZWwudXNlckRhdGEuY3VycmVudEhlaWdodCwgZGVwdGgvcGFuZWwudXNlckRhdGEuY3VycmVudERlcHRoKTtcclxuICBwYW5lbC51c2VyRGF0YS5jdXJyZW50V2lkdGggPSB3aWR0aDtcclxuICBwYW5lbC51c2VyRGF0YS5jdXJyZW50SGVpZ2h0ID0gaGVpZ2h0O1xyXG4gIHBhbmVsLnVzZXJEYXRhLmN1cnJlbnREZXB0aCA9IGRlcHRoO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29udHJvbGxlcklEQm94KCBoZWlnaHQsIGNvbG9yICl7XHJcbiAgY29uc3QgcGFuZWwgPSBuZXcgVEhSRUUuTWVzaCggbmV3IFRIUkVFLkJveEdlb21ldHJ5KCBDT05UUk9MTEVSX0lEX1dJRFRILCBoZWlnaHQsIENPTlRST0xMRVJfSURfREVQVEggKSwgU2hhcmVkTWF0ZXJpYWxzLlBBTkVMICk7XHJcbiAgcGFuZWwuZ2VvbWV0cnkudHJhbnNsYXRlKCBDT05UUk9MTEVSX0lEX1dJRFRIICogMC41LCAwLCAwICk7XHJcbiAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIHBhbmVsLmdlb21ldHJ5LCBjb2xvciApO1xyXG4gIHJldHVybiBwYW5lbDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURvd25BcnJvdygpe1xyXG4gIGNvbnN0IHcgPSAwLjAwOTY7XHJcbiAgY29uc3QgaCA9IDAuMDE2O1xyXG4gIGNvbnN0IHNoID0gbmV3IFRIUkVFLlNoYXBlKCk7XHJcbiAgc2gubW92ZVRvKDAsMCk7XHJcbiAgc2gubGluZVRvKC13LGgpO1xyXG4gIHNoLmxpbmVUbyh3LGgpO1xyXG4gIHNoLmxpbmVUbygwLDApO1xyXG5cclxuICBjb25zdCBnZW8gPSBuZXcgVEhSRUUuU2hhcGVHZW9tZXRyeSggc2ggKTtcclxuICBnZW8udHJhbnNsYXRlKCAwLCAtaCAqIDAuNSwgMCApO1xyXG5cclxuICByZXR1cm4gbmV3IFRIUkVFLk1lc2goIGdlbywgU2hhcmVkTWF0ZXJpYWxzLlBBTkVMICk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBQQU5FTF9XSURUSCA9IDEuMDtcclxuZXhwb3J0IGNvbnN0IFBBTkVMX0hFSUdIVCA9IDAuMDg7XHJcbmV4cG9ydCBjb25zdCBQQU5FTF9ERVBUSCA9IDAuMDE7XHJcbmV4cG9ydCBjb25zdCBQQU5FTF9TUEFDSU5HID0gMC4wMDE7XHJcbmV4cG9ydCBjb25zdCBQQU5FTF9NQVJHSU4gPSAwLjAxNTtcclxuZXhwb3J0IGNvbnN0IFBBTkVMX0xBQkVMX1RFWFRfTUFSR0lOID0gMC4wNjtcclxuZXhwb3J0IGNvbnN0IFBBTkVMX1ZBTFVFX1RFWFRfTUFSR0lOID0gMC4wMjtcclxuZXhwb3J0IGNvbnN0IENPTlRST0xMRVJfSURfV0lEVEggPSAwLjAyO1xyXG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9ERVBUSCA9IDAuMDAxO1xyXG5leHBvcnQgY29uc3QgQlVUVE9OX0RFUFRIID0gMC4wMTtcclxuZXhwb3J0IGNvbnN0IEZPTERFUl9XSURUSCA9IDEuMDI2O1xyXG5leHBvcnQgY29uc3QgU1VCRk9MREVSX1dJRFRIID0gMS4wO1xyXG5leHBvcnQgY29uc3QgRk9MREVSX0hFSUdIVCA9IDAuMDk7XHJcbmV4cG9ydCBjb25zdCBGT0xERVJfR1JBQl9IRUlHSFQgPSAwLjA1MTI7XHJcbmV4cG9ydCBjb25zdCBCT1JERVJfVEhJQ0tORVNTID0gMC4wMTtcclxuZXhwb3J0IGNvbnN0IENIRUNLQk9YX1NJWkUgPSAwLjA1OyIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ID0ge30gKXtcclxuXHJcbiAgY29uc3QgaW50ZXJhY3Rpb24gPSBjcmVhdGVJbnRlcmFjdGlvbiggcGFuZWwgKTtcclxuXHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25HcmlwcGVkJywgaGFuZGxlT25HcmlwICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25SZWxlYXNlR3JpcCcsIGhhbmRsZU9uR3JpcFJlbGVhc2UgKTtcclxuXHJcbiAgbGV0IG9sZFBhcmVudDtcclxuICBsZXQgb2xkUG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG4gIGxldCBvbGRSb3RhdGlvbiA9IG5ldyBUSFJFRS5FdWxlcigpO1xyXG5cclxuICBjb25zdCByb3RhdGlvbkdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgcm90YXRpb25Hcm91cC5zY2FsZS5zZXQoIDAuMywgMC4zLCAwLjMgKTtcclxuICByb3RhdGlvbkdyb3VwLnBvc2l0aW9uLnNldCggLTAuMDE1LCAwLjAxNSwgMC4wICk7XHJcblxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVPbkdyaXAoIHAgKXtcclxuXHJcbiAgICBjb25zdCB7IGlucHV0T2JqZWN0LCBpbnB1dCB9ID0gcDtcclxuXHJcbiAgICBjb25zdCBmb2xkZXIgPSBncm91cC5mb2xkZXI7XHJcbiAgICBpZiggZm9sZGVyID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBmb2xkZXIuYmVpbmdNb3ZlZCA9PT0gdHJ1ZSApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgb2xkUG9zaXRpb24uY29weSggZm9sZGVyLnBvc2l0aW9uICk7XHJcbiAgICBvbGRSb3RhdGlvbi5jb3B5KCBmb2xkZXIucm90YXRpb24gKTtcclxuXHJcbiAgICBmb2xkZXIucG9zaXRpb24uc2V0KCAwLDAsMCApO1xyXG4gICAgZm9sZGVyLnJvdGF0aW9uLnNldCggMCwwLDAgKTtcclxuICAgIGZvbGRlci5yb3RhdGlvbi54ID0gLU1hdGguUEkgKiAwLjU7XHJcblxyXG4gICAgb2xkUGFyZW50ID0gZm9sZGVyLnBhcmVudDtcclxuXHJcbiAgICByb3RhdGlvbkdyb3VwLmFkZCggZm9sZGVyICk7XHJcblxyXG4gICAgaW5wdXRPYmplY3QuYWRkKCByb3RhdGlvbkdyb3VwICk7XHJcblxyXG4gICAgcC5sb2NrZWQgPSB0cnVlO1xyXG5cclxuICAgIGZvbGRlci5iZWluZ01vdmVkID0gdHJ1ZTtcclxuXHJcbiAgICBpbnB1dC5ldmVudHMuZW1pdCggJ3Bpbm5lZCcsIGlucHV0ICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVPbkdyaXBSZWxlYXNlKCB7IGlucHV0T2JqZWN0LCBpbnB1dCB9PXt9ICl7XHJcblxyXG4gICAgY29uc3QgZm9sZGVyID0gZ3JvdXAuZm9sZGVyO1xyXG4gICAgaWYoIGZvbGRlciA9PT0gdW5kZWZpbmVkICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiggb2xkUGFyZW50ID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBmb2xkZXIuYmVpbmdNb3ZlZCA9PT0gZmFsc2UgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIG9sZFBhcmVudC5hZGQoIGZvbGRlciApO1xyXG4gICAgb2xkUGFyZW50ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIGZvbGRlci5wb3NpdGlvbi5jb3B5KCBvbGRQb3NpdGlvbiApO1xyXG4gICAgZm9sZGVyLnJvdGF0aW9uLmNvcHkoIG9sZFJvdGF0aW9uICk7XHJcblxyXG4gICAgZm9sZGVyLmJlaW5nTW92ZWQgPSBmYWxzZTtcclxuXHJcbiAgICBpbnB1dC5ldmVudHMuZW1pdCggJ3BpblJlbGVhc2VkJywgaW5wdXQgKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBpbnRlcmFjdGlvbjtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgU0RGU2hhZGVyIGZyb20gJ3RocmVlLWJtZm9udC10ZXh0L3NoYWRlcnMvc2RmJztcclxuaW1wb3J0IGNyZWF0ZUdlb21ldHJ5IGZyb20gJ3RocmVlLWJtZm9udC10ZXh0JztcclxuaW1wb3J0IHBhcnNlQVNDSUkgZnJvbSAncGFyc2UtYm1mb250LWFzY2lpJztcclxuXHJcbmltcG9ydCAqIGFzIEZvbnQgZnJvbSAnLi9mb250JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNYXRlcmlhbCggY29sb3IgKXtcclxuXHJcbiAgY29uc3QgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKCk7XHJcbiAgY29uc3QgaW1hZ2UgPSBGb250LmltYWdlKCk7XHJcbiAgdGV4dHVyZS5pbWFnZSA9IGltYWdlO1xyXG4gIHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlO1xyXG4gIHRleHR1cmUubWluRmlsdGVyID0gVEhSRUUuTGluZWFyRmlsdGVyO1xyXG4gIHRleHR1cmUubWFnRmlsdGVyID0gVEhSRUUuTGluZWFyRmlsdGVyO1xyXG4gIHRleHR1cmUuZ2VuZXJhdGVNaXBtYXBzID0gZmFsc2U7XHJcblxyXG4gIHJldHVybiBuZXcgVEhSRUUuUmF3U2hhZGVyTWF0ZXJpYWwoU0RGU2hhZGVyKHtcclxuICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIGNvbG9yOiBjb2xvcixcclxuICAgIG1hcDogdGV4dHVyZVxyXG4gIH0pKTtcclxufVxyXG5cclxuY29uc3QgdGV4dFNjYWxlID0gMC4wMDAyNDtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdG9yKCl7XHJcblxyXG4gIGNvbnN0IGZvbnQgPSBwYXJzZUFTQ0lJKCBGb250LmZudCgpICk7XHJcblxyXG4gIGNvbnN0IGNvbG9yTWF0ZXJpYWxzID0ge307XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZVRleHQoIHN0ciwgZm9udCwgY29sb3IgPSAweGZmZmZmZiwgc2NhbGUgPSAxLjAgKXtcclxuXHJcbiAgICBjb25zdCBnZW9tZXRyeSA9IGNyZWF0ZUdlb21ldHJ5KHtcclxuICAgICAgdGV4dDogc3RyLFxyXG4gICAgICBhbGlnbjogJ2xlZnQnLFxyXG4gICAgICB3aWR0aDogMTAwMDAsXHJcbiAgICAgIGZsaXBZOiB0cnVlLFxyXG4gICAgICBmb250XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgY29uc3QgbGF5b3V0ID0gZ2VvbWV0cnkubGF5b3V0O1xyXG5cclxuICAgIGxldCBtYXRlcmlhbCA9IGNvbG9yTWF0ZXJpYWxzWyBjb2xvciBdO1xyXG4gICAgaWYoIG1hdGVyaWFsID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgbWF0ZXJpYWwgPSBjb2xvck1hdGVyaWFsc1sgY29sb3IgXSA9IGNyZWF0ZU1hdGVyaWFsKCBjb2xvciApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKCBnZW9tZXRyeSwgbWF0ZXJpYWwgKTtcclxuICAgIG1lc2guc2NhbGUubXVsdGlwbHkoIG5ldyBUSFJFRS5WZWN0b3IzKDEsLTEsMSkgKTtcclxuXHJcbiAgICBjb25zdCBmaW5hbFNjYWxlID0gc2NhbGUgKiB0ZXh0U2NhbGU7XHJcblxyXG4gICAgbWVzaC5zY2FsZS5tdWx0aXBseVNjYWxhciggZmluYWxTY2FsZSApO1xyXG5cclxuICAgIG1lc2gucG9zaXRpb24ueSA9IGxheW91dC5oZWlnaHQgKiAwLjUgKiBmaW5hbFNjYWxlO1xyXG5cclxuICAgIHJldHVybiBtZXNoO1xyXG4gIH1cclxuXHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZSggc3RyLCB7IGNvbG9yPTB4ZmZmZmZmLCBzY2FsZT0xLjAgfSA9IHt9ICl7XHJcbiAgICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cclxuICAgIGxldCBtZXNoID0gY3JlYXRlVGV4dCggc3RyLCBmb250LCBjb2xvciwgc2NhbGUgKTtcclxuICAgIGdyb3VwLmFkZCggbWVzaCApO1xyXG4gICAgZ3JvdXAubGF5b3V0ID0gbWVzaC5nZW9tZXRyeS5sYXlvdXQ7XHJcblxyXG4gICAgZ3JvdXAudXBkYXRlTGFiZWwgPSBmdW5jdGlvbiggc3RyICl7XHJcbiAgICAgIG1lc2guZ2VvbWV0cnkudXBkYXRlKCBzdHIgKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGNyZWF0ZSxcclxuICAgIGdldE1hdGVyaWFsOiAoKT0+IG1hdGVyaWFsXHJcbiAgfVxyXG5cclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IFBBTkVMID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCB7IGNvbG9yOiAweGZmZmZmZiwgdmVydGV4Q29sb3JzOiBUSFJFRS5WZXJ0ZXhDb2xvcnMgfSApO1xyXG5leHBvcnQgY29uc3QgTE9DQVRPUiA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xyXG5leHBvcnQgY29uc3QgRk9MREVSID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCB7IGNvbG9yOiAweDAwMDAwMCB9ICk7IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCBjcmVhdGVUZXh0TGFiZWwgZnJvbSAnLi90ZXh0bGFiZWwnO1xyXG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XHJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XHJcbmltcG9ydCAqIGFzIExheW91dCBmcm9tICcuL2xheW91dCc7XHJcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XHJcbmltcG9ydCAqIGFzIEdyYWIgZnJvbSAnLi9ncmFiJztcclxuaW1wb3J0ICogYXMgUGFsZXR0ZSBmcm9tICcuL3BhbGV0dGUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlU2xpZGVyKCB7XHJcbiAgdGV4dENyZWF0b3IsXHJcbiAgb2JqZWN0LFxyXG4gIHByb3BlcnR5TmFtZSA9ICd1bmRlZmluZWQnLFxyXG4gIGluaXRpYWxWYWx1ZSA9IDAuMCxcclxuICBtaW4gPSAwLjAsIG1heCA9IDEuMCxcclxuICBzdGVwID0gMC4xLFxyXG4gIHdpZHRoID0gTGF5b3V0LlBBTkVMX1dJRFRILFxyXG4gIGhlaWdodCA9IExheW91dC5QQU5FTF9IRUlHSFQsXHJcbiAgZGVwdGggPSBMYXlvdXQuUEFORUxfREVQVEhcclxufSA9IHt9ICl7XHJcblxyXG5cclxuICBjb25zdCBTTElERVJfV0lEVEggPSB3aWR0aCAqIDAuNSAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgU0xJREVSX0hFSUdIVCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgU0xJREVSX0RFUFRIID0gZGVwdGg7XHJcblxyXG4gIGNvbnN0IHN0YXRlID0ge1xyXG4gICAgYWxwaGE6IDEuMCxcclxuICAgIHZhbHVlOiBpbml0aWFsVmFsdWUsXHJcbiAgICBzdGVwOiBzdGVwLFxyXG4gICAgdXNlU3RlcDogdHJ1ZSxcclxuICAgIHByZWNpc2lvbjogMSxcclxuICAgIGxpc3RlbjogZmFsc2UsXHJcbiAgICBtaW46IG1pbixcclxuICAgIG1heDogbWF4LFxyXG4gICAgb25DaGFuZ2VkQ0I6IHVuZGVmaW5lZCxcclxuICAgIG9uRmluaXNoZWRDaGFuZ2U6IHVuZGVmaW5lZCxcclxuICAgIHByZXNzaW5nOiBmYWxzZVxyXG4gIH07XHJcblxyXG4gIHN0YXRlLnN0ZXAgPSBnZXRJbXBsaWVkU3RlcCggc3RhdGUudmFsdWUgKTtcclxuICBzdGF0ZS5wcmVjaXNpb24gPSBudW1EZWNpbWFscyggc3RhdGUuc3RlcCApO1xyXG4gIHN0YXRlLmFscGhhID0gZ2V0QWxwaGFGcm9tVmFsdWUoIHN0YXRlLnZhbHVlLCBzdGF0ZS5taW4sIHN0YXRlLm1heCApO1xyXG5cclxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cclxuICAvLyAgZmlsbGVkIHZvbHVtZVxyXG4gIGNvbnN0IHJlY3QgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIFNMSURFUl9XSURUSCwgU0xJREVSX0hFSUdIVCwgU0xJREVSX0RFUFRIICk7XHJcbiAgcmVjdC50cmFuc2xhdGUoU0xJREVSX1dJRFRIKjAuNSwwLDApO1xyXG4gIC8vIExheW91dC5hbGlnbkxlZnQoIHJlY3QgKTtcclxuXHJcbiAgY29uc3QgaGl0c2Nhbk1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCk7XHJcbiAgaGl0c2Nhbk1hdGVyaWFsLnZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgY29uc3QgaGl0c2NhblZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIGhpdHNjYW5NYXRlcmlhbCApO1xyXG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueiA9IGRlcHRoO1xyXG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueCA9IHdpZHRoICogMC41O1xyXG4gIGhpdHNjYW5Wb2x1bWUubmFtZSA9ICdoaXRzY2FuVm9sdW1lJztcclxuXHJcbiAgLy8gIHNsaWRlckJHIHZvbHVtZVxyXG4gIGNvbnN0IHNsaWRlckJHID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgU2hhcmVkTWF0ZXJpYWxzLlBBTkVMICk7XHJcbiAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIHNsaWRlckJHLmdlb21ldHJ5LCBDb2xvcnMuU0xJREVSX0JHICk7XHJcbiAgc2xpZGVyQkcucG9zaXRpb24ueiA9IGRlcHRoICogMC41O1xyXG4gIHNsaWRlckJHLnBvc2l0aW9uLnggPSBTTElERVJfV0lEVEggKyBMYXlvdXQuUEFORUxfTUFSR0lOO1xyXG5cclxuICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiBDb2xvcnMuREVGQVVMVF9DT0xPUiB9KTtcclxuICBjb25zdCBmaWxsZWRWb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBtYXRlcmlhbCApO1xyXG4gIGZpbGxlZFZvbHVtZS5wb3NpdGlvbi56ID0gZGVwdGggKiAwLjU7XHJcbiAgaGl0c2NhblZvbHVtZS5hZGQoIGZpbGxlZFZvbHVtZSApO1xyXG5cclxuICBjb25zdCBlbmRMb2NhdG9yID0gbmV3IFRIUkVFLk1lc2goIG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggMC4wNSwgMC4wNSwgMC4wNSwgMSwgMSwgMSApLCBTaGFyZWRNYXRlcmlhbHMuTE9DQVRPUiApO1xyXG4gIGVuZExvY2F0b3IucG9zaXRpb24ueCA9IFNMSURFUl9XSURUSDtcclxuICBoaXRzY2FuVm9sdW1lLmFkZCggZW5kTG9jYXRvciApO1xyXG4gIGVuZExvY2F0b3IudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICBjb25zdCB2YWx1ZUxhYmVsID0gdGV4dENyZWF0b3IuY3JlYXRlKCBzdGF0ZS52YWx1ZS50b1N0cmluZygpICk7XHJcbiAgdmFsdWVMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX1ZBTFVFX1RFWFRfTUFSR0lOICsgd2lkdGggKiAwLjU7XHJcbiAgdmFsdWVMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGgqMi41O1xyXG4gIHZhbHVlTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzMjU7XHJcblxyXG4gIGNvbnN0IGRlc2NyaXB0b3JMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggcHJvcGVydHlOYW1lICk7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfTEFCRUxfVEVYVF9NQVJHSU47XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzO1xyXG5cclxuICBjb25zdCBjb250cm9sbGVySUQgPSBMYXlvdXQuY3JlYXRlQ29udHJvbGxlcklEQm94KCBoZWlnaHQsIENvbG9ycy5DT05UUk9MTEVSX0lEX1NMSURFUiApO1xyXG4gIGNvbnRyb2xsZXJJRC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcblxyXG4gIGNvbnN0IHBhbmVsID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApO1xyXG4gIHBhbmVsLm5hbWUgPSAncGFuZWwnO1xyXG4gIHBhbmVsLmFkZCggZGVzY3JpcHRvckxhYmVsLCBoaXRzY2FuVm9sdW1lLCBzbGlkZXJCRywgdmFsdWVMYWJlbCwgY29udHJvbGxlcklEICk7XHJcblxyXG4gIGdyb3VwLmFkZCggcGFuZWwgKVxyXG5cclxuICB1cGRhdGVWYWx1ZUxhYmVsKCBzdGF0ZS52YWx1ZSApO1xyXG4gIHVwZGF0ZVNsaWRlcigpO1xyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVWYWx1ZUxhYmVsKCB2YWx1ZSApe1xyXG4gICAgaWYoIHN0YXRlLnVzZVN0ZXAgKXtcclxuICAgICAgdmFsdWVMYWJlbC51cGRhdGVMYWJlbCggcm91bmRUb0RlY2ltYWwoIHN0YXRlLnZhbHVlLCBzdGF0ZS5wcmVjaXNpb24gKS50b1N0cmluZygpICk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICB2YWx1ZUxhYmVsLnVwZGF0ZUxhYmVsKCBzdGF0ZS52YWx1ZS50b1N0cmluZygpICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XHJcbiAgICBpZiggc3RhdGUucHJlc3NpbmcgKXtcclxuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuSU5URVJBQ1RJT05fQ09MT1IgKTtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIGlmKCBpbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XHJcbiAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkhJR0hMSUdIVF9DT0xPUiApO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuREVGQVVMVF9DT0xPUiApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlU2xpZGVyKCl7XHJcbiAgICBmaWxsZWRWb2x1bWUuc2NhbGUueCA9XHJcbiAgICAgIE1hdGgubWluKFxyXG4gICAgICAgIE1hdGgubWF4KCBnZXRBbHBoYUZyb21WYWx1ZSggc3RhdGUudmFsdWUsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICkgKiB3aWR0aCwgMC4wMDAwMDEgKSxcclxuICAgICAgICB3aWR0aFxyXG4gICAgICApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlT2JqZWN0KCB2YWx1ZSApe1xyXG4gICAgb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlU3RhdGVGcm9tQWxwaGEoIGFscGhhICl7XHJcbiAgICBzdGF0ZS5hbHBoYSA9IGdldENsYW1wZWRBbHBoYSggYWxwaGEgKTtcclxuICAgIHN0YXRlLnZhbHVlID0gZ2V0VmFsdWVGcm9tQWxwaGEoIHN0YXRlLmFscGhhLCBzdGF0ZS5taW4sIHN0YXRlLm1heCApO1xyXG4gICAgaWYoIHN0YXRlLnVzZVN0ZXAgKXtcclxuICAgICAgc3RhdGUudmFsdWUgPSBnZXRTdGVwcGVkVmFsdWUoIHN0YXRlLnZhbHVlLCBzdGF0ZS5zdGVwICk7XHJcbiAgICB9XHJcbiAgICBzdGF0ZS52YWx1ZSA9IGdldENsYW1wZWRWYWx1ZSggc3RhdGUudmFsdWUsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBsaXN0ZW5VcGRhdGUoKXtcclxuICAgIHN0YXRlLnZhbHVlID0gZ2V0VmFsdWVGcm9tT2JqZWN0KCk7XHJcbiAgICBzdGF0ZS5hbHBoYSA9IGdldEFscGhhRnJvbVZhbHVlKCBzdGF0ZS52YWx1ZSwgc3RhdGUubWluLCBzdGF0ZS5tYXggKTtcclxuICAgIHN0YXRlLmFscGhhID0gZ2V0Q2xhbXBlZEFscGhhKCBzdGF0ZS5hbHBoYSApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2V0VmFsdWVGcm9tT2JqZWN0KCl7XHJcbiAgICByZXR1cm4gcGFyc2VGbG9hdCggb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSApO1xyXG4gIH1cclxuXHJcbiAgZ3JvdXAub25DaGFuZ2UgPSBmdW5jdGlvbiggY2FsbGJhY2sgKXtcclxuICAgIHN0YXRlLm9uQ2hhbmdlZENCID0gY2FsbGJhY2s7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAuc3RlcCA9IGZ1bmN0aW9uKCBzdGVwICl7XHJcbiAgICBzdGF0ZS5zdGVwID0gc3RlcDtcclxuICAgIHN0YXRlLnByZWNpc2lvbiA9IG51bURlY2ltYWxzKCBzdGF0ZS5zdGVwIClcclxuICAgIHN0YXRlLnVzZVN0ZXAgPSB0cnVlO1xyXG5cclxuICAgIHN0YXRlLmFscGhhID0gZ2V0QWxwaGFGcm9tVmFsdWUoIHN0YXRlLnZhbHVlLCBzdGF0ZS5taW4sIHN0YXRlLm1heCApO1xyXG5cclxuICAgIHVwZGF0ZVN0YXRlRnJvbUFscGhhKCBzdGF0ZS5hbHBoYSApO1xyXG4gICAgdXBkYXRlVmFsdWVMYWJlbCggc3RhdGUudmFsdWUgKTtcclxuICAgIHVwZGF0ZVNsaWRlciggKTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBncm91cC5saXN0ZW4gPSBmdW5jdGlvbigpe1xyXG4gICAgc3RhdGUubGlzdGVuID0gdHJ1ZTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBoaXRzY2FuVm9sdW1lICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgaGFuZGxlUHJlc3MgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdwcmVzc2luZycsIGhhbmRsZUhvbGQgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblJlbGVhc2VkJywgaGFuZGxlUmVsZWFzZSApO1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVQcmVzcyggcCApe1xyXG4gICAgaWYoIGdyb3VwLnZpc2libGUgPT09IGZhbHNlICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHN0YXRlLnByZXNzaW5nID0gdHJ1ZTtcclxuICAgIHAubG9ja2VkID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZUhvbGQoIHsgcG9pbnQgfSA9IHt9ICl7XHJcbiAgICBpZiggZ3JvdXAudmlzaWJsZSA9PT0gZmFsc2UgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRlLnByZXNzaW5nID0gdHJ1ZTtcclxuXHJcbiAgICBmaWxsZWRWb2x1bWUudXBkYXRlTWF0cml4V29ybGQoKTtcclxuICAgIGVuZExvY2F0b3IudXBkYXRlTWF0cml4V29ybGQoKTtcclxuXHJcbiAgICBjb25zdCBhID0gbmV3IFRIUkVFLlZlY3RvcjMoKS5zZXRGcm9tTWF0cml4UG9zaXRpb24oIGZpbGxlZFZvbHVtZS5tYXRyaXhXb3JsZCApO1xyXG4gICAgY29uc3QgYiA9IG5ldyBUSFJFRS5WZWN0b3IzKCkuc2V0RnJvbU1hdHJpeFBvc2l0aW9uKCBlbmRMb2NhdG9yLm1hdHJpeFdvcmxkICk7XHJcblxyXG4gICAgY29uc3QgcHJldmlvdXNWYWx1ZSA9IHN0YXRlLnZhbHVlO1xyXG5cclxuICAgIHVwZGF0ZVN0YXRlRnJvbUFscGhhKCBnZXRQb2ludEFscGhhKCBwb2ludCwge2EsYn0gKSApO1xyXG4gICAgdXBkYXRlVmFsdWVMYWJlbCggc3RhdGUudmFsdWUgKTtcclxuICAgIHVwZGF0ZVNsaWRlciggKTtcclxuICAgIHVwZGF0ZU9iamVjdCggc3RhdGUudmFsdWUgKTtcclxuXHJcbiAgICBpZiggcHJldmlvdXNWYWx1ZSAhPT0gc3RhdGUudmFsdWUgJiYgc3RhdGUub25DaGFuZ2VkQ0IgKXtcclxuICAgICAgc3RhdGUub25DaGFuZ2VkQ0IoIHN0YXRlLnZhbHVlICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVSZWxlYXNlKCl7XHJcbiAgICBzdGF0ZS5wcmVzc2luZyA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZ3JvdXAuaW50ZXJhY3Rpb24gPSBpbnRlcmFjdGlvbjtcclxuICBncm91cC5oaXRzY2FuID0gWyBoaXRzY2FuVm9sdW1lLCBwYW5lbCBdO1xyXG5cclxuICBjb25zdCBncmFiSW50ZXJhY3Rpb24gPSBHcmFiLmNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSApO1xyXG4gIGNvbnN0IHBhbGV0dGVJbnRlcmFjdGlvbiA9IFBhbGV0dGUuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XHJcblxyXG4gIGdyb3VwLnVwZGF0ZUNvbnRyb2wgPSBmdW5jdGlvbiggaW5wdXRPYmplY3RzICl7XHJcbiAgICBpbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICBwYWxldHRlSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuXHJcbiAgICBpZiggc3RhdGUubGlzdGVuICl7XHJcbiAgICAgIGxpc3RlblVwZGF0ZSgpO1xyXG4gICAgICB1cGRhdGVWYWx1ZUxhYmVsKCBzdGF0ZS52YWx1ZSApO1xyXG4gICAgICB1cGRhdGVTbGlkZXIoKTtcclxuICAgIH1cclxuICAgIHVwZGF0ZVZpZXcoKTtcclxuICB9O1xyXG5cclxuICBncm91cC5uYW1lID0gZnVuY3Rpb24oIHN0ciApe1xyXG4gICAgZGVzY3JpcHRvckxhYmVsLnVwZGF0ZUxhYmVsKCBzdHIgKTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBncm91cC5taW4gPSBmdW5jdGlvbiggbSApe1xyXG4gICAgc3RhdGUubWluID0gbTtcclxuICAgIHN0YXRlLmFscGhhID0gZ2V0QWxwaGFGcm9tVmFsdWUoIHN0YXRlLnZhbHVlLCBzdGF0ZS5taW4sIHN0YXRlLm1heCApO1xyXG4gICAgdXBkYXRlU3RhdGVGcm9tQWxwaGEoIHN0YXRlLmFscGhhICk7XHJcbiAgICB1cGRhdGVWYWx1ZUxhYmVsKCBzdGF0ZS52YWx1ZSApO1xyXG4gICAgdXBkYXRlU2xpZGVyKCApO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLm1heCA9IGZ1bmN0aW9uKCBtICl7XHJcbiAgICBzdGF0ZS5tYXggPSBtO1xyXG4gICAgc3RhdGUuYWxwaGEgPSBnZXRBbHBoYUZyb21WYWx1ZSggc3RhdGUudmFsdWUsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICk7XHJcbiAgICB1cGRhdGVTdGF0ZUZyb21BbHBoYSggc3RhdGUuYWxwaGEgKTtcclxuICAgIHVwZGF0ZVZhbHVlTGFiZWwoIHN0YXRlLnZhbHVlICk7XHJcbiAgICB1cGRhdGVTbGlkZXIoICk7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIGdyb3VwO1xyXG59XHJcblxyXG5jb25zdCB0YSA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbmNvbnN0IHRiID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuY29uc3QgdFRvQSA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbmNvbnN0IGFUb0IgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG5cclxuZnVuY3Rpb24gZ2V0UG9pbnRBbHBoYSggcG9pbnQsIHNlZ21lbnQgKXtcclxuICB0YS5jb3B5KCBzZWdtZW50LmIgKS5zdWIoIHNlZ21lbnQuYSApO1xyXG4gIHRiLmNvcHkoIHBvaW50ICkuc3ViKCBzZWdtZW50LmEgKTtcclxuXHJcbiAgY29uc3QgcHJvamVjdGVkID0gdGIucHJvamVjdE9uVmVjdG9yKCB0YSApO1xyXG5cclxuICB0VG9BLmNvcHkoIHBvaW50ICkuc3ViKCBzZWdtZW50LmEgKTtcclxuXHJcbiAgYVRvQi5jb3B5KCBzZWdtZW50LmIgKS5zdWIoIHNlZ21lbnQuYSApLm5vcm1hbGl6ZSgpO1xyXG5cclxuICBjb25zdCBzaWRlID0gdFRvQS5ub3JtYWxpemUoKS5kb3QoIGFUb0IgKSA+PSAwID8gMSA6IC0xO1xyXG5cclxuICBjb25zdCBsZW5ndGggPSBzZWdtZW50LmEuZGlzdGFuY2VUbyggc2VnbWVudC5iICkgKiBzaWRlO1xyXG5cclxuICBsZXQgYWxwaGEgPSBwcm9qZWN0ZWQubGVuZ3RoKCkgLyBsZW5ndGg7XHJcbiAgaWYoIGFscGhhID4gMS4wICl7XHJcbiAgICBhbHBoYSA9IDEuMDtcclxuICB9XHJcbiAgaWYoIGFscGhhIDwgMC4wICl7XHJcbiAgICBhbHBoYSA9IDAuMDtcclxuICB9XHJcbiAgcmV0dXJuIGFscGhhO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsZXJwKG1pbiwgbWF4LCB2YWx1ZSkge1xyXG4gIHJldHVybiAoMS12YWx1ZSkqbWluICsgdmFsdWUqbWF4O1xyXG59XHJcblxyXG5mdW5jdGlvbiBtYXBfcmFuZ2UodmFsdWUsIGxvdzEsIGhpZ2gxLCBsb3cyLCBoaWdoMikge1xyXG4gICAgcmV0dXJuIGxvdzIgKyAoaGlnaDIgLSBsb3cyKSAqICh2YWx1ZSAtIGxvdzEpIC8gKGhpZ2gxIC0gbG93MSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENsYW1wZWRBbHBoYSggYWxwaGEgKXtcclxuICBpZiggYWxwaGEgPiAxICl7XHJcbiAgICByZXR1cm4gMVxyXG4gIH1cclxuICBpZiggYWxwaGEgPCAwICl7XHJcbiAgICByZXR1cm4gMDtcclxuICB9XHJcbiAgcmV0dXJuIGFscGhhO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDbGFtcGVkVmFsdWUoIHZhbHVlLCBtaW4sIG1heCApe1xyXG4gIGlmKCB2YWx1ZSA8IG1pbiApe1xyXG4gICAgcmV0dXJuIG1pbjtcclxuICB9XHJcbiAgaWYoIHZhbHVlID4gbWF4ICl7XHJcbiAgICByZXR1cm4gbWF4O1xyXG4gIH1cclxuICByZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEltcGxpZWRTdGVwKCB2YWx1ZSApe1xyXG4gIGlmKCB2YWx1ZSA9PT0gMCApe1xyXG4gICAgcmV0dXJuIDE7IC8vIFdoYXQgYXJlIHdlLCBwc3ljaGljcz9cclxuICB9IGVsc2Uge1xyXG4gICAgLy8gSGV5IERvdWcsIGNoZWNrIHRoaXMgb3V0LlxyXG4gICAgcmV0dXJuIE1hdGgucG93KDEwLCBNYXRoLmZsb29yKE1hdGgubG9nKE1hdGguYWJzKHZhbHVlKSkvTWF0aC5MTjEwKSkvMTA7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRWYWx1ZUZyb21BbHBoYSggYWxwaGEsIG1pbiwgbWF4ICl7XHJcbiAgcmV0dXJuIG1hcF9yYW5nZSggYWxwaGEsIDAuMCwgMS4wLCBtaW4sIG1heCApXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEFscGhhRnJvbVZhbHVlKCB2YWx1ZSwgbWluLCBtYXggKXtcclxuICByZXR1cm4gbWFwX3JhbmdlKCB2YWx1ZSwgbWluLCBtYXgsIDAuMCwgMS4wICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFN0ZXBwZWRWYWx1ZSggdmFsdWUsIHN0ZXAgKXtcclxuICBpZiggdmFsdWUgJSBzdGVwICE9IDApIHtcclxuICAgIHJldHVybiBNYXRoLnJvdW5kKCB2YWx1ZSAvIHN0ZXAgKSAqIHN0ZXA7XHJcbiAgfVxyXG4gIHJldHVybiB2YWx1ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gbnVtRGVjaW1hbHMoeCkge1xyXG4gIHggPSB4LnRvU3RyaW5nKCk7XHJcbiAgaWYgKHguaW5kZXhPZignLicpID4gLTEpIHtcclxuICAgIHJldHVybiB4Lmxlbmd0aCAtIHguaW5kZXhPZignLicpIC0gMTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIDA7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByb3VuZFRvRGVjaW1hbCh2YWx1ZSwgZGVjaW1hbHMpIHtcclxuICBjb25zdCB0ZW5UbyA9IE1hdGgucG93KDEwLCBkZWNpbWFscyk7XHJcbiAgcmV0dXJuIE1hdGgucm91bmQodmFsdWUgKiB0ZW5UbykgLyB0ZW5UbztcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlVGV4dExhYmVsKCB0ZXh0Q3JlYXRvciwgc3RyLCB3aWR0aCA9IDAuNCwgZGVwdGggPSAwLjAyOSwgZmdDb2xvciA9IDB4ZmZmZmZmLCBiZ0NvbG9yID0gQ29sb3JzLkRFRkFVTFRfQkFDSywgc2NhbGUgPSAxLjAgKXtcclxuXHJcbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICBjb25zdCBpbnRlcm5hbFBvc2l0aW9uaW5nID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgZ3JvdXAuYWRkKCBpbnRlcm5hbFBvc2l0aW9uaW5nICk7XHJcblxyXG4gIGNvbnN0IHRleHQgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHN0ciwgeyBjb2xvcjogZmdDb2xvciwgc2NhbGUgfSApO1xyXG4gIGludGVybmFsUG9zaXRpb25pbmcuYWRkKCB0ZXh0ICk7XHJcblxyXG5cclxuICBncm91cC5zZXRTdHJpbmcgPSBmdW5jdGlvbiggc3RyICl7XHJcbiAgICB0ZXh0LnVwZGF0ZUxhYmVsKCBzdHIudG9TdHJpbmcoKSApO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLnNldE51bWJlciA9IGZ1bmN0aW9uKCBzdHIgKXtcclxuICAgIHRleHQudXBkYXRlTGFiZWwoIHN0ci50b0ZpeGVkKDIpICk7XHJcbiAgfTtcclxuXHJcbiAgdGV4dC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcblxyXG4gIGNvbnN0IGJhY2tCb3VuZHMgPSAwLjAxO1xyXG4gIGNvbnN0IG1hcmdpbiA9IDAuMDE7XHJcbiAgY29uc3QgdG90YWxXaWR0aCA9IHdpZHRoO1xyXG4gIGNvbnN0IHRvdGFsSGVpZ2h0ID0gMC4wNCArIG1hcmdpbiAqIDI7XHJcbiAgY29uc3QgbGFiZWxCYWNrR2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIHRvdGFsV2lkdGgsIHRvdGFsSGVpZ2h0LCBkZXB0aCwgMSwgMSwgMSApO1xyXG4gIGxhYmVsQmFja0dlb21ldHJ5LmFwcGx5TWF0cml4KCBuZXcgVEhSRUUuTWF0cml4NCgpLm1ha2VUcmFuc2xhdGlvbiggdG90YWxXaWR0aCAqIDAuNSAtIG1hcmdpbiwgMCwgMCApICk7XHJcblxyXG4gIGNvbnN0IGxhYmVsQmFja01lc2ggPSBuZXcgVEhSRUUuTWVzaCggbGFiZWxCYWNrR2VvbWV0cnksIFNoYXJlZE1hdGVyaWFscy5QQU5FTCApO1xyXG4gIENvbG9ycy5jb2xvcml6ZUdlb21ldHJ5KCBsYWJlbEJhY2tNZXNoLmdlb21ldHJ5LCBiZ0NvbG9yICk7XHJcblxyXG4gIGxhYmVsQmFja01lc2gucG9zaXRpb24ueSA9IDAuMDM7XHJcbiAgaW50ZXJuYWxQb3NpdGlvbmluZy5hZGQoIGxhYmVsQmFja01lc2ggKTtcclxuICBpbnRlcm5hbFBvc2l0aW9uaW5nLnBvc2l0aW9uLnkgPSAtdG90YWxIZWlnaHQgKiAwLjU7XHJcblxyXG4gIGdyb3VwLmJhY2sgPSBsYWJlbEJhY2tNZXNoO1xyXG5cclxuICByZXR1cm4gZ3JvdXA7XHJcbn0iLCIvKlxyXG4gKlx0QGF1dGhvciB6ejg1IC8gaHR0cDovL3R3aXR0ZXIuY29tL2JsdXJzcGxpbmUgLyBodHRwOi8vd3d3LmxhYjRnYW1lcy5uZXQveno4NS9ibG9nXHJcbiAqXHRAYXV0aG9yIGNlbnRlcmlvbndhcmUgLyBodHRwOi8vd3d3LmNlbnRlcmlvbndhcmUuY29tXHJcbiAqXHJcbiAqXHRTdWJkaXZpc2lvbiBHZW9tZXRyeSBNb2RpZmllclxyXG4gKlx0XHR1c2luZyBMb29wIFN1YmRpdmlzaW9uIFNjaGVtZVxyXG4gKlxyXG4gKlx0UmVmZXJlbmNlczpcclxuICpcdFx0aHR0cDovL2dyYXBoaWNzLnN0YW5mb3JkLmVkdS9+bWRmaXNoZXIvc3ViZGl2aXNpb24uaHRtbFxyXG4gKlx0XHRodHRwOi8vd3d3LmhvbG1lczNkLm5ldC9ncmFwaGljcy9zdWJkaXZpc2lvbi9cclxuICpcdFx0aHR0cDovL3d3dy5jcy5ydXRnZXJzLmVkdS9+ZGVjYXJsby9yZWFkaW5ncy9zdWJkaXYtc2cwMGMucGRmXHJcbiAqXHJcbiAqXHRLbm93biBJc3N1ZXM6XHJcbiAqXHRcdC0gY3VycmVudGx5IGRvZXNuJ3QgaGFuZGxlIFwiU2hhcnAgRWRnZXNcIlxyXG4gKi9cclxuXHJcblRIUkVFLlN1YmRpdmlzaW9uTW9kaWZpZXIgPSBmdW5jdGlvbiAoIHN1YmRpdmlzaW9ucyApIHtcclxuXHJcblx0dGhpcy5zdWJkaXZpc2lvbnMgPSAoIHN1YmRpdmlzaW9ucyA9PT0gdW5kZWZpbmVkICkgPyAxIDogc3ViZGl2aXNpb25zO1xyXG5cclxufTtcclxuXHJcbi8vIEFwcGxpZXMgdGhlIFwibW9kaWZ5XCIgcGF0dGVyblxyXG5USFJFRS5TdWJkaXZpc2lvbk1vZGlmaWVyLnByb3RvdHlwZS5tb2RpZnkgPSBmdW5jdGlvbiAoIGdlb21ldHJ5ICkge1xyXG5cclxuXHR2YXIgcmVwZWF0cyA9IHRoaXMuc3ViZGl2aXNpb25zO1xyXG5cclxuXHR3aGlsZSAoIHJlcGVhdHMgLS0gPiAwICkge1xyXG5cclxuXHRcdHRoaXMuc21vb3RoKCBnZW9tZXRyeSApO1xyXG5cclxuXHR9XHJcblxyXG5cdGdlb21ldHJ5LmNvbXB1dGVGYWNlTm9ybWFscygpO1xyXG5cdGdlb21ldHJ5LmNvbXB1dGVWZXJ0ZXhOb3JtYWxzKCk7XHJcblxyXG59O1xyXG5cclxuKCBmdW5jdGlvbigpIHtcclxuXHJcblx0Ly8gU29tZSBjb25zdGFudHNcclxuXHR2YXIgV0FSTklOR1MgPSAhIHRydWU7IC8vIFNldCB0byB0cnVlIGZvciBkZXZlbG9wbWVudFxyXG5cdHZhciBBQkMgPSBbICdhJywgJ2InLCAnYycgXTtcclxuXHJcblxyXG5cdGZ1bmN0aW9uIGdldEVkZ2UoIGEsIGIsIG1hcCApIHtcclxuXHJcblx0XHR2YXIgdmVydGV4SW5kZXhBID0gTWF0aC5taW4oIGEsIGIgKTtcclxuXHRcdHZhciB2ZXJ0ZXhJbmRleEIgPSBNYXRoLm1heCggYSwgYiApO1xyXG5cclxuXHRcdHZhciBrZXkgPSB2ZXJ0ZXhJbmRleEEgKyBcIl9cIiArIHZlcnRleEluZGV4QjtcclxuXHJcblx0XHRyZXR1cm4gbWFwWyBrZXkgXTtcclxuXHJcblx0fVxyXG5cclxuXHJcblx0ZnVuY3Rpb24gcHJvY2Vzc0VkZ2UoIGEsIGIsIHZlcnRpY2VzLCBtYXAsIGZhY2UsIG1ldGFWZXJ0aWNlcyApIHtcclxuXHJcblx0XHR2YXIgdmVydGV4SW5kZXhBID0gTWF0aC5taW4oIGEsIGIgKTtcclxuXHRcdHZhciB2ZXJ0ZXhJbmRleEIgPSBNYXRoLm1heCggYSwgYiApO1xyXG5cclxuXHRcdHZhciBrZXkgPSB2ZXJ0ZXhJbmRleEEgKyBcIl9cIiArIHZlcnRleEluZGV4QjtcclxuXHJcblx0XHR2YXIgZWRnZTtcclxuXHJcblx0XHRpZiAoIGtleSBpbiBtYXAgKSB7XHJcblxyXG5cdFx0XHRlZGdlID0gbWFwWyBrZXkgXTtcclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0dmFyIHZlcnRleEEgPSB2ZXJ0aWNlc1sgdmVydGV4SW5kZXhBIF07XHJcblx0XHRcdHZhciB2ZXJ0ZXhCID0gdmVydGljZXNbIHZlcnRleEluZGV4QiBdO1xyXG5cclxuXHRcdFx0ZWRnZSA9IHtcclxuXHJcblx0XHRcdFx0YTogdmVydGV4QSwgLy8gcG9pbnRlciByZWZlcmVuY2VcclxuXHRcdFx0XHRiOiB2ZXJ0ZXhCLFxyXG5cdFx0XHRcdG5ld0VkZ2U6IG51bGwsXHJcblx0XHRcdFx0Ly8gYUluZGV4OiBhLCAvLyBudW1iZXJlZCByZWZlcmVuY2VcclxuXHRcdFx0XHQvLyBiSW5kZXg6IGIsXHJcblx0XHRcdFx0ZmFjZXM6IFtdIC8vIHBvaW50ZXJzIHRvIGZhY2VcclxuXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRtYXBbIGtleSBdID0gZWRnZTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0ZWRnZS5mYWNlcy5wdXNoKCBmYWNlICk7XHJcblxyXG5cdFx0bWV0YVZlcnRpY2VzWyBhIF0uZWRnZXMucHVzaCggZWRnZSApO1xyXG5cdFx0bWV0YVZlcnRpY2VzWyBiIF0uZWRnZXMucHVzaCggZWRnZSApO1xyXG5cclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZW5lcmF0ZUxvb2t1cHMoIHZlcnRpY2VzLCBmYWNlcywgbWV0YVZlcnRpY2VzLCBlZGdlcyApIHtcclxuXHJcblx0XHR2YXIgaSwgaWwsIGZhY2UsIGVkZ2U7XHJcblxyXG5cdFx0Zm9yICggaSA9IDAsIGlsID0gdmVydGljZXMubGVuZ3RoOyBpIDwgaWw7IGkgKysgKSB7XHJcblxyXG5cdFx0XHRtZXRhVmVydGljZXNbIGkgXSA9IHsgZWRnZXM6IFtdIH07XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAoIGkgPSAwLCBpbCA9IGZhY2VzLmxlbmd0aDsgaSA8IGlsOyBpICsrICkge1xyXG5cclxuXHRcdFx0ZmFjZSA9IGZhY2VzWyBpIF07XHJcblxyXG5cdFx0XHRwcm9jZXNzRWRnZSggZmFjZS5hLCBmYWNlLmIsIHZlcnRpY2VzLCBlZGdlcywgZmFjZSwgbWV0YVZlcnRpY2VzICk7XHJcblx0XHRcdHByb2Nlc3NFZGdlKCBmYWNlLmIsIGZhY2UuYywgdmVydGljZXMsIGVkZ2VzLCBmYWNlLCBtZXRhVmVydGljZXMgKTtcclxuXHRcdFx0cHJvY2Vzc0VkZ2UoIGZhY2UuYywgZmFjZS5hLCB2ZXJ0aWNlcywgZWRnZXMsIGZhY2UsIG1ldGFWZXJ0aWNlcyApO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBuZXdGYWNlKCBuZXdGYWNlcywgYSwgYiwgYyApIHtcclxuXHJcblx0XHRuZXdGYWNlcy5wdXNoKCBuZXcgVEhSRUUuRmFjZTMoIGEsIGIsIGMgKSApO1xyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIG1pZHBvaW50KCBhLCBiICkge1xyXG5cclxuXHRcdHJldHVybiAoIE1hdGguYWJzKCBiIC0gYSApIC8gMiApICsgTWF0aC5taW4oIGEsIGIgKTtcclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBuZXdVdiggbmV3VXZzLCBhLCBiLCBjICkge1xyXG5cclxuXHRcdG5ld1V2cy5wdXNoKCBbIGEuY2xvbmUoKSwgYi5jbG9uZSgpLCBjLmNsb25lKCkgXSApO1xyXG5cclxuXHR9XHJcblxyXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cdC8vIFBlcmZvcm1zIG9uZSBpdGVyYXRpb24gb2YgU3ViZGl2aXNpb25cclxuXHRUSFJFRS5TdWJkaXZpc2lvbk1vZGlmaWVyLnByb3RvdHlwZS5zbW9vdGggPSBmdW5jdGlvbiAoIGdlb21ldHJ5ICkge1xyXG5cclxuXHRcdHZhciB0bXAgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG5cclxuXHRcdHZhciBvbGRWZXJ0aWNlcywgb2xkRmFjZXMsIG9sZFV2cztcclxuXHRcdHZhciBuZXdWZXJ0aWNlcywgbmV3RmFjZXMsIG5ld1VWcyA9IFtdO1xyXG5cclxuXHRcdHZhciBuLCBsLCBpLCBpbCwgaiwgaztcclxuXHRcdHZhciBtZXRhVmVydGljZXMsIHNvdXJjZUVkZ2VzO1xyXG5cclxuXHRcdC8vIG5ldyBzdHVmZi5cclxuXHRcdHZhciBzb3VyY2VFZGdlcywgbmV3RWRnZVZlcnRpY2VzLCBuZXdTb3VyY2VWZXJ0aWNlcztcclxuXHJcblx0XHRvbGRWZXJ0aWNlcyA9IGdlb21ldHJ5LnZlcnRpY2VzOyAvLyB7IHgsIHksIHp9XHJcblx0XHRvbGRGYWNlcyA9IGdlb21ldHJ5LmZhY2VzOyAvLyB7IGE6IG9sZFZlcnRleDEsIGI6IG9sZFZlcnRleDIsIGM6IG9sZFZlcnRleDMgfVxyXG5cdFx0b2xkVXZzID0gZ2VvbWV0cnkuZmFjZVZlcnRleFV2c1sgMCBdO1xyXG5cclxuXHRcdHZhciBoYXNVdnMgPSBvbGRVdnMgIT09IHVuZGVmaW5lZCAmJiBvbGRVdnMubGVuZ3RoID4gMDtcclxuXHJcblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblx0XHQgKlxyXG5cdFx0ICogU3RlcCAwOiBQcmVwcm9jZXNzIEdlb21ldHJ5IHRvIEdlbmVyYXRlIGVkZ2VzIExvb2t1cFxyXG5cdFx0ICpcclxuXHRcdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuXHRcdG1ldGFWZXJ0aWNlcyA9IG5ldyBBcnJheSggb2xkVmVydGljZXMubGVuZ3RoICk7XHJcblx0XHRzb3VyY2VFZGdlcyA9IHt9OyAvLyBFZGdlID0+IHsgb2xkVmVydGV4MSwgb2xkVmVydGV4MiwgZmFjZXNbXSAgfVxyXG5cclxuXHRcdGdlbmVyYXRlTG9va3Vwcyggb2xkVmVydGljZXMsIG9sZEZhY2VzLCBtZXRhVmVydGljZXMsIHNvdXJjZUVkZ2VzICk7XHJcblxyXG5cclxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHRcdCAqXHJcblx0XHQgKlx0U3RlcCAxLlxyXG5cdFx0ICpcdEZvciBlYWNoIGVkZ2UsIGNyZWF0ZSBhIG5ldyBFZGdlIFZlcnRleCxcclxuXHRcdCAqXHR0aGVuIHBvc2l0aW9uIGl0LlxyXG5cdFx0ICpcclxuXHRcdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuXHRcdG5ld0VkZ2VWZXJ0aWNlcyA9IFtdO1xyXG5cdFx0dmFyIG90aGVyLCBjdXJyZW50RWRnZSwgbmV3RWRnZSwgZmFjZTtcclxuXHRcdHZhciBlZGdlVmVydGV4V2VpZ2h0LCBhZGphY2VudFZlcnRleFdlaWdodCwgY29ubmVjdGVkRmFjZXM7XHJcblxyXG5cdFx0Zm9yICggaSBpbiBzb3VyY2VFZGdlcyApIHtcclxuXHJcblx0XHRcdGN1cnJlbnRFZGdlID0gc291cmNlRWRnZXNbIGkgXTtcclxuXHRcdFx0bmV3RWRnZSA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcblxyXG5cdFx0XHRlZGdlVmVydGV4V2VpZ2h0ID0gMyAvIDg7XHJcblx0XHRcdGFkamFjZW50VmVydGV4V2VpZ2h0ID0gMSAvIDg7XHJcblxyXG5cdFx0XHRjb25uZWN0ZWRGYWNlcyA9IGN1cnJlbnRFZGdlLmZhY2VzLmxlbmd0aDtcclxuXHJcblx0XHRcdC8vIGNoZWNrIGhvdyBtYW55IGxpbmtlZCBmYWNlcy4gMiBzaG91bGQgYmUgY29ycmVjdC5cclxuXHRcdFx0aWYgKCBjb25uZWN0ZWRGYWNlcyAhPSAyICkge1xyXG5cclxuXHRcdFx0XHQvLyBpZiBsZW5ndGggaXMgbm90IDIsIGhhbmRsZSBjb25kaXRpb25cclxuXHRcdFx0XHRlZGdlVmVydGV4V2VpZ2h0ID0gMC41O1xyXG5cdFx0XHRcdGFkamFjZW50VmVydGV4V2VpZ2h0ID0gMDtcclxuXHJcblx0XHRcdFx0aWYgKCBjb25uZWN0ZWRGYWNlcyAhPSAxICkge1xyXG5cclxuXHRcdFx0XHRcdGlmICggV0FSTklOR1MgKSBjb25zb2xlLndhcm4oICdTdWJkaXZpc2lvbiBNb2RpZmllcjogTnVtYmVyIG9mIGNvbm5lY3RlZCBmYWNlcyAhPSAyLCBpczogJywgY29ubmVjdGVkRmFjZXMsIGN1cnJlbnRFZGdlICk7XHJcblxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG5ld0VkZ2UuYWRkVmVjdG9ycyggY3VycmVudEVkZ2UuYSwgY3VycmVudEVkZ2UuYiApLm11bHRpcGx5U2NhbGFyKCBlZGdlVmVydGV4V2VpZ2h0ICk7XHJcblxyXG5cdFx0XHR0bXAuc2V0KCAwLCAwLCAwICk7XHJcblxyXG5cdFx0XHRmb3IgKCBqID0gMDsgaiA8IGNvbm5lY3RlZEZhY2VzOyBqICsrICkge1xyXG5cclxuXHRcdFx0XHRmYWNlID0gY3VycmVudEVkZ2UuZmFjZXNbIGogXTtcclxuXHJcblx0XHRcdFx0Zm9yICggayA9IDA7IGsgPCAzOyBrICsrICkge1xyXG5cclxuXHRcdFx0XHRcdG90aGVyID0gb2xkVmVydGljZXNbIGZhY2VbIEFCQ1sgayBdIF0gXTtcclxuXHRcdFx0XHRcdGlmICggb3RoZXIgIT09IGN1cnJlbnRFZGdlLmEgJiYgb3RoZXIgIT09IGN1cnJlbnRFZGdlLmIgKSBicmVhaztcclxuXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0bXAuYWRkKCBvdGhlciApO1xyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dG1wLm11bHRpcGx5U2NhbGFyKCBhZGphY2VudFZlcnRleFdlaWdodCApO1xyXG5cdFx0XHRuZXdFZGdlLmFkZCggdG1wICk7XHJcblxyXG5cdFx0XHRjdXJyZW50RWRnZS5uZXdFZGdlID0gbmV3RWRnZVZlcnRpY2VzLmxlbmd0aDtcclxuXHRcdFx0bmV3RWRnZVZlcnRpY2VzLnB1c2goIG5ld0VkZ2UgKTtcclxuXHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKGN1cnJlbnRFZGdlLCBuZXdFZGdlKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cdFx0ICpcclxuXHRcdCAqXHRTdGVwIDIuXHJcblx0XHQgKlx0UmVwb3NpdGlvbiBlYWNoIHNvdXJjZSB2ZXJ0aWNlcy5cclxuXHRcdCAqXHJcblx0XHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcblx0XHR2YXIgYmV0YSwgc291cmNlVmVydGV4V2VpZ2h0LCBjb25uZWN0aW5nVmVydGV4V2VpZ2h0O1xyXG5cdFx0dmFyIGNvbm5lY3RpbmdFZGdlLCBjb25uZWN0aW5nRWRnZXMsIG9sZFZlcnRleCwgbmV3U291cmNlVmVydGV4O1xyXG5cdFx0bmV3U291cmNlVmVydGljZXMgPSBbXTtcclxuXHJcblx0XHRmb3IgKCBpID0gMCwgaWwgPSBvbGRWZXJ0aWNlcy5sZW5ndGg7IGkgPCBpbDsgaSArKyApIHtcclxuXHJcblx0XHRcdG9sZFZlcnRleCA9IG9sZFZlcnRpY2VzWyBpIF07XHJcblxyXG5cdFx0XHQvLyBmaW5kIGFsbCBjb25uZWN0aW5nIGVkZ2VzICh1c2luZyBsb29rdXBUYWJsZSlcclxuXHRcdFx0Y29ubmVjdGluZ0VkZ2VzID0gbWV0YVZlcnRpY2VzWyBpIF0uZWRnZXM7XHJcblx0XHRcdG4gPSBjb25uZWN0aW5nRWRnZXMubGVuZ3RoO1xyXG5cclxuXHRcdFx0aWYgKCBuID09IDMgKSB7XHJcblxyXG5cdFx0XHRcdGJldGEgPSAzIC8gMTY7XHJcblxyXG5cdFx0XHR9IGVsc2UgaWYgKCBuID4gMyApIHtcclxuXHJcblx0XHRcdFx0YmV0YSA9IDMgLyAoIDggKiBuICk7IC8vIFdhcnJlbidzIG1vZGlmaWVkIGZvcm11bGFcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIExvb3AncyBvcmlnaW5hbCBiZXRhIGZvcm11bGFcclxuXHRcdFx0Ly8gYmV0YSA9IDEgLyBuICogKCA1LzggLSBNYXRoLnBvdyggMy84ICsgMS80ICogTWF0aC5jb3MoIDIgKiBNYXRoLiBQSSAvIG4gKSwgMikgKTtcclxuXHJcblx0XHRcdHNvdXJjZVZlcnRleFdlaWdodCA9IDEgLSBuICogYmV0YTtcclxuXHRcdFx0Y29ubmVjdGluZ1ZlcnRleFdlaWdodCA9IGJldGE7XHJcblxyXG5cdFx0XHRpZiAoIG4gPD0gMiApIHtcclxuXHJcblx0XHRcdFx0Ly8gY3JlYXNlIGFuZCBib3VuZGFyeSBydWxlc1xyXG5cdFx0XHRcdC8vIGNvbnNvbGUud2FybignY3JlYXNlIGFuZCBib3VuZGFyeSBydWxlcycpO1xyXG5cclxuXHRcdFx0XHRpZiAoIG4gPT0gMiApIHtcclxuXHJcblx0XHRcdFx0XHRpZiAoIFdBUk5JTkdTICkgY29uc29sZS53YXJuKCAnMiBjb25uZWN0aW5nIGVkZ2VzJywgY29ubmVjdGluZ0VkZ2VzICk7XHJcblx0XHRcdFx0XHRzb3VyY2VWZXJ0ZXhXZWlnaHQgPSAzIC8gNDtcclxuXHRcdFx0XHRcdGNvbm5lY3RpbmdWZXJ0ZXhXZWlnaHQgPSAxIC8gODtcclxuXHJcblx0XHRcdFx0XHQvLyBzb3VyY2VWZXJ0ZXhXZWlnaHQgPSAxO1xyXG5cdFx0XHRcdFx0Ly8gY29ubmVjdGluZ1ZlcnRleFdlaWdodCA9IDA7XHJcblxyXG5cdFx0XHRcdH0gZWxzZSBpZiAoIG4gPT0gMSApIHtcclxuXHJcblx0XHRcdFx0XHRpZiAoIFdBUk5JTkdTICkgY29uc29sZS53YXJuKCAnb25seSAxIGNvbm5lY3RpbmcgZWRnZScgKTtcclxuXHJcblx0XHRcdFx0fSBlbHNlIGlmICggbiA9PSAwICkge1xyXG5cclxuXHRcdFx0XHRcdGlmICggV0FSTklOR1MgKSBjb25zb2xlLndhcm4oICcwIGNvbm5lY3RpbmcgZWRnZXMnICk7XHJcblxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG5ld1NvdXJjZVZlcnRleCA9IG9sZFZlcnRleC5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKCBzb3VyY2VWZXJ0ZXhXZWlnaHQgKTtcclxuXHJcblx0XHRcdHRtcC5zZXQoIDAsIDAsIDAgKTtcclxuXHJcblx0XHRcdGZvciAoIGogPSAwOyBqIDwgbjsgaiArKyApIHtcclxuXHJcblx0XHRcdFx0Y29ubmVjdGluZ0VkZ2UgPSBjb25uZWN0aW5nRWRnZXNbIGogXTtcclxuXHRcdFx0XHRvdGhlciA9IGNvbm5lY3RpbmdFZGdlLmEgIT09IG9sZFZlcnRleCA/IGNvbm5lY3RpbmdFZGdlLmEgOiBjb25uZWN0aW5nRWRnZS5iO1xyXG5cdFx0XHRcdHRtcC5hZGQoIG90aGVyICk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0bXAubXVsdGlwbHlTY2FsYXIoIGNvbm5lY3RpbmdWZXJ0ZXhXZWlnaHQgKTtcclxuXHRcdFx0bmV3U291cmNlVmVydGV4LmFkZCggdG1wICk7XHJcblxyXG5cdFx0XHRuZXdTb3VyY2VWZXJ0aWNlcy5wdXNoKCBuZXdTb3VyY2VWZXJ0ZXggKTtcclxuXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHRcdCAqXHJcblx0XHQgKlx0U3RlcCAzLlxyXG5cdFx0ICpcdEdlbmVyYXRlIEZhY2VzIGJldHdlZW4gc291cmNlIHZlcnRpY2VzXHJcblx0XHQgKlx0YW5kIGVkZ2UgdmVydGljZXMuXHJcblx0XHQgKlxyXG5cdFx0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG5cdFx0bmV3VmVydGljZXMgPSBuZXdTb3VyY2VWZXJ0aWNlcy5jb25jYXQoIG5ld0VkZ2VWZXJ0aWNlcyApO1xyXG5cdFx0dmFyIHNsID0gbmV3U291cmNlVmVydGljZXMubGVuZ3RoLCBlZGdlMSwgZWRnZTIsIGVkZ2UzO1xyXG5cdFx0bmV3RmFjZXMgPSBbXTtcclxuXHJcblx0XHR2YXIgdXYsIHgwLCB4MSwgeDI7XHJcblx0XHR2YXIgeDMgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xyXG5cdFx0dmFyIHg0ID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcclxuXHRcdHZhciB4NSA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XHJcblxyXG5cdFx0Zm9yICggaSA9IDAsIGlsID0gb2xkRmFjZXMubGVuZ3RoOyBpIDwgaWw7IGkgKysgKSB7XHJcblxyXG5cdFx0XHRmYWNlID0gb2xkRmFjZXNbIGkgXTtcclxuXHJcblx0XHRcdC8vIGZpbmQgdGhlIDMgbmV3IGVkZ2VzIHZlcnRleCBvZiBlYWNoIG9sZCBmYWNlXHJcblxyXG5cdFx0XHRlZGdlMSA9IGdldEVkZ2UoIGZhY2UuYSwgZmFjZS5iLCBzb3VyY2VFZGdlcyApLm5ld0VkZ2UgKyBzbDtcclxuXHRcdFx0ZWRnZTIgPSBnZXRFZGdlKCBmYWNlLmIsIGZhY2UuYywgc291cmNlRWRnZXMgKS5uZXdFZGdlICsgc2w7XHJcblx0XHRcdGVkZ2UzID0gZ2V0RWRnZSggZmFjZS5jLCBmYWNlLmEsIHNvdXJjZUVkZ2VzICkubmV3RWRnZSArIHNsO1xyXG5cclxuXHRcdFx0Ly8gY3JlYXRlIDQgZmFjZXMuXHJcblxyXG5cdFx0XHRuZXdGYWNlKCBuZXdGYWNlcywgZWRnZTEsIGVkZ2UyLCBlZGdlMyApO1xyXG5cdFx0XHRuZXdGYWNlKCBuZXdGYWNlcywgZmFjZS5hLCBlZGdlMSwgZWRnZTMgKTtcclxuXHRcdFx0bmV3RmFjZSggbmV3RmFjZXMsIGZhY2UuYiwgZWRnZTIsIGVkZ2UxICk7XHJcblx0XHRcdG5ld0ZhY2UoIG5ld0ZhY2VzLCBmYWNlLmMsIGVkZ2UzLCBlZGdlMiApO1xyXG5cclxuXHRcdFx0Ly8gY3JlYXRlIDQgbmV3IHV2J3NcclxuXHJcblx0XHRcdGlmICggaGFzVXZzICkge1xyXG5cclxuXHRcdFx0XHR1diA9IG9sZFV2c1sgaSBdO1xyXG5cclxuXHRcdFx0XHR4MCA9IHV2WyAwIF07XHJcblx0XHRcdFx0eDEgPSB1dlsgMSBdO1xyXG5cdFx0XHRcdHgyID0gdXZbIDIgXTtcclxuXHJcblx0XHRcdFx0eDMuc2V0KCBtaWRwb2ludCggeDAueCwgeDEueCApLCBtaWRwb2ludCggeDAueSwgeDEueSApICk7XHJcblx0XHRcdFx0eDQuc2V0KCBtaWRwb2ludCggeDEueCwgeDIueCApLCBtaWRwb2ludCggeDEueSwgeDIueSApICk7XHJcblx0XHRcdFx0eDUuc2V0KCBtaWRwb2ludCggeDAueCwgeDIueCApLCBtaWRwb2ludCggeDAueSwgeDIueSApICk7XHJcblxyXG5cdFx0XHRcdG5ld1V2KCBuZXdVVnMsIHgzLCB4NCwgeDUgKTtcclxuXHRcdFx0XHRuZXdVdiggbmV3VVZzLCB4MCwgeDMsIHg1ICk7XHJcblxyXG5cdFx0XHRcdG5ld1V2KCBuZXdVVnMsIHgxLCB4NCwgeDMgKTtcclxuXHRcdFx0XHRuZXdVdiggbmV3VVZzLCB4MiwgeDUsIHg0ICk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIE92ZXJ3cml0ZSBvbGQgYXJyYXlzXHJcblx0XHRnZW9tZXRyeS52ZXJ0aWNlcyA9IG5ld1ZlcnRpY2VzO1xyXG5cdFx0Z2VvbWV0cnkuZmFjZXMgPSBuZXdGYWNlcztcclxuXHRcdGlmICggaGFzVXZzICkgZ2VvbWV0cnkuZmFjZVZlcnRleFV2c1sgMCBdID0gbmV3VVZzO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdkb25lJyk7XHJcblxyXG5cdH07XHJcblxyXG59ICkoKTtcclxuIiwidmFyIHN0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcblxubW9kdWxlLmV4cG9ydHMgPSBhbkFycmF5XG5cbmZ1bmN0aW9uIGFuQXJyYXkoYXJyKSB7XG4gIHJldHVybiAoXG4gICAgICAgYXJyLkJZVEVTX1BFUl9FTEVNRU5UXG4gICAgJiYgc3RyLmNhbGwoYXJyLmJ1ZmZlcikgPT09ICdbb2JqZWN0IEFycmF5QnVmZmVyXSdcbiAgICB8fCBBcnJheS5pc0FycmF5KGFycilcbiAgKVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBudW10eXBlKG51bSwgZGVmKSB7XG5cdHJldHVybiB0eXBlb2YgbnVtID09PSAnbnVtYmVyJ1xuXHRcdD8gbnVtIFxuXHRcdDogKHR5cGVvZiBkZWYgPT09ICdudW1iZXInID8gZGVmIDogMClcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGR0eXBlKSB7XG4gIHN3aXRjaCAoZHR5cGUpIHtcbiAgICBjYXNlICdpbnQ4JzpcbiAgICAgIHJldHVybiBJbnQ4QXJyYXlcbiAgICBjYXNlICdpbnQxNic6XG4gICAgICByZXR1cm4gSW50MTZBcnJheVxuICAgIGNhc2UgJ2ludDMyJzpcbiAgICAgIHJldHVybiBJbnQzMkFycmF5XG4gICAgY2FzZSAndWludDgnOlxuICAgICAgcmV0dXJuIFVpbnQ4QXJyYXlcbiAgICBjYXNlICd1aW50MTYnOlxuICAgICAgcmV0dXJuIFVpbnQxNkFycmF5XG4gICAgY2FzZSAndWludDMyJzpcbiAgICAgIHJldHVybiBVaW50MzJBcnJheVxuICAgIGNhc2UgJ2Zsb2F0MzInOlxuICAgICAgcmV0dXJuIEZsb2F0MzJBcnJheVxuICAgIGNhc2UgJ2Zsb2F0NjQnOlxuICAgICAgcmV0dXJuIEZsb2F0NjRBcnJheVxuICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgIHJldHVybiBBcnJheVxuICAgIGNhc2UgJ3VpbnQ4X2NsYW1wZWQnOlxuICAgICAgcmV0dXJuIFVpbnQ4Q2xhbXBlZEFycmF5XG4gIH1cbn1cbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBBdCBsZWFzdCBnaXZlIHNvbWUga2luZCBvZiBjb250ZXh0IHRvIHRoZSB1c2VyXG4gICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuICgnICsgZXIgKyAnKScpO1xuICAgICAgICBlcnIuY29udGV4dCA9IGVyO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSBpZiAobGlzdGVuZXJzKSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAodGhpcy5fZXZlbnRzKSB7XG4gICAgdmFyIGV2bGlzdGVuZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgICBpZiAoaXNGdW5jdGlvbihldmxpc3RlbmVyKSlcbiAgICAgIHJldHVybiAxO1xuICAgIGVsc2UgaWYgKGV2bGlzdGVuZXIpXG4gICAgICByZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuIDA7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKTtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsIi8qZXNsaW50IG5ldy1jYXA6MCovXG52YXIgZHR5cGUgPSByZXF1aXJlKCdkdHlwZScpXG5tb2R1bGUuZXhwb3J0cyA9IGZsYXR0ZW5WZXJ0ZXhEYXRhXG5mdW5jdGlvbiBmbGF0dGVuVmVydGV4RGF0YSAoZGF0YSwgb3V0cHV0LCBvZmZzZXQpIHtcbiAgaWYgKCFkYXRhKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdtdXN0IHNwZWNpZnkgZGF0YSBhcyBmaXJzdCBwYXJhbWV0ZXInKVxuICBvZmZzZXQgPSArKG9mZnNldCB8fCAwKSB8IDBcblxuICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSAmJiBBcnJheS5pc0FycmF5KGRhdGFbMF0pKSB7XG4gICAgdmFyIGRpbSA9IGRhdGFbMF0ubGVuZ3RoXG4gICAgdmFyIGxlbmd0aCA9IGRhdGEubGVuZ3RoICogZGltXG5cbiAgICAvLyBubyBvdXRwdXQgc3BlY2lmaWVkLCBjcmVhdGUgYSBuZXcgdHlwZWQgYXJyYXlcbiAgICBpZiAoIW91dHB1dCB8fCB0eXBlb2Ygb3V0cHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgb3V0cHV0ID0gbmV3IChkdHlwZShvdXRwdXQgfHwgJ2Zsb2F0MzInKSkobGVuZ3RoICsgb2Zmc2V0KVxuICAgIH1cblxuICAgIHZhciBkc3RMZW5ndGggPSBvdXRwdXQubGVuZ3RoIC0gb2Zmc2V0XG4gICAgaWYgKGxlbmd0aCAhPT0gZHN0TGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NvdXJjZSBsZW5ndGggJyArIGxlbmd0aCArICcgKCcgKyBkaW0gKyAneCcgKyBkYXRhLmxlbmd0aCArICcpJyArXG4gICAgICAgICcgZG9lcyBub3QgbWF0Y2ggZGVzdGluYXRpb24gbGVuZ3RoICcgKyBkc3RMZW5ndGgpXG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDAsIGsgPSBvZmZzZXQ7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGRpbTsgaisrKSB7XG4gICAgICAgIG91dHB1dFtrKytdID0gZGF0YVtpXVtqXVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoIW91dHB1dCB8fCB0eXBlb2Ygb3V0cHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgLy8gbm8gb3V0cHV0LCBjcmVhdGUgYSBuZXcgb25lXG4gICAgICB2YXIgQ3RvciA9IGR0eXBlKG91dHB1dCB8fCAnZmxvYXQzMicpXG4gICAgICBpZiAob2Zmc2V0ID09PSAwKSB7XG4gICAgICAgIG91dHB1dCA9IG5ldyBDdG9yKGRhdGEpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRwdXQgPSBuZXcgQ3RvcihkYXRhLmxlbmd0aCArIG9mZnNldClcbiAgICAgICAgb3V0cHV0LnNldChkYXRhLCBvZmZzZXQpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHN0b3JlIG91dHB1dCBpbiBleGlzdGluZyBhcnJheVxuICAgICAgb3V0cHV0LnNldChkYXRhLCBvZmZzZXQpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG91dHB1dFxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21waWxlKHByb3BlcnR5KSB7XG5cdGlmICghcHJvcGVydHkgfHwgdHlwZW9mIHByb3BlcnR5ICE9PSAnc3RyaW5nJylcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ211c3Qgc3BlY2lmeSBwcm9wZXJ0eSBmb3IgaW5kZXhvZiBzZWFyY2gnKVxuXG5cdHJldHVybiBuZXcgRnVuY3Rpb24oJ2FycmF5JywgJ3ZhbHVlJywgJ3N0YXJ0JywgW1xuXHRcdCdzdGFydCA9IHN0YXJ0IHx8IDAnLFxuXHRcdCdmb3IgKHZhciBpPXN0YXJ0OyBpPGFycmF5Lmxlbmd0aDsgaSsrKScsXG5cdFx0JyAgaWYgKGFycmF5W2ldW1wiJyArIHByb3BlcnR5ICsnXCJdID09PSB2YWx1ZSknLFxuXHRcdCcgICAgICByZXR1cm4gaScsXG5cdFx0J3JldHVybiAtMSdcblx0XS5qb2luKCdcXG4nKSlcbn0iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsIi8qIVxuICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBhIEJ1ZmZlclxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5cbi8vIFRoZSBfaXNCdWZmZXIgY2hlY2sgaXMgZm9yIFNhZmFyaSA1LTcgc3VwcG9ydCwgYmVjYXVzZSBpdCdzIG1pc3Npbmdcbi8vIE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHlcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICE9IG51bGwgJiYgKGlzQnVmZmVyKG9iaikgfHwgaXNTbG93QnVmZmVyKG9iaikgfHwgISFvYmouX2lzQnVmZmVyKVxufVxuXG5mdW5jdGlvbiBpc0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiAhIW9iai5jb25zdHJ1Y3RvciAmJiB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopXG59XG5cbi8vIEZvciBOb2RlIHYwLjEwIHN1cHBvcnQuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHkuXG5mdW5jdGlvbiBpc1Nsb3dCdWZmZXIgKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iai5yZWFkRmxvYXRMRSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLnNsaWNlID09PSAnZnVuY3Rpb24nICYmIGlzQnVmZmVyKG9iai5zbGljZSgwLCAwKSlcbn1cbiIsInZhciB3b3JkV3JhcCA9IHJlcXVpcmUoJ3dvcmQtd3JhcHBlcicpXG52YXIgeHRlbmQgPSByZXF1aXJlKCd4dGVuZCcpXG52YXIgZmluZENoYXIgPSByZXF1aXJlKCdpbmRleG9mLXByb3BlcnR5JykoJ2lkJylcbnZhciBudW1iZXIgPSByZXF1aXJlKCdhcy1udW1iZXInKVxuXG52YXIgWF9IRUlHSFRTID0gWyd4JywgJ2UnLCAnYScsICdvJywgJ24nLCAncycsICdyJywgJ2MnLCAndScsICdtJywgJ3YnLCAndycsICd6J11cbnZhciBNX1dJRFRIUyA9IFsnbScsICd3J11cbnZhciBDQVBfSEVJR0hUUyA9IFsnSCcsICdJJywgJ04nLCAnRScsICdGJywgJ0snLCAnTCcsICdUJywgJ1UnLCAnVicsICdXJywgJ1gnLCAnWScsICdaJ11cblxuXG52YXIgVEFCX0lEID0gJ1xcdCcuY2hhckNvZGVBdCgwKVxudmFyIFNQQUNFX0lEID0gJyAnLmNoYXJDb2RlQXQoMClcbnZhciBBTElHTl9MRUZUID0gMCwgXG4gICAgQUxJR05fQ0VOVEVSID0gMSwgXG4gICAgQUxJR05fUklHSFQgPSAyXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlTGF5b3V0KG9wdCkge1xuICByZXR1cm4gbmV3IFRleHRMYXlvdXQob3B0KVxufVxuXG5mdW5jdGlvbiBUZXh0TGF5b3V0KG9wdCkge1xuICB0aGlzLmdseXBocyA9IFtdXG4gIHRoaXMuX21lYXN1cmUgPSB0aGlzLmNvbXB1dGVNZXRyaWNzLmJpbmQodGhpcylcbiAgdGhpcy51cGRhdGUob3B0KVxufVxuXG5UZXh0TGF5b3V0LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihvcHQpIHtcbiAgb3B0ID0geHRlbmQoe1xuICAgIG1lYXN1cmU6IHRoaXMuX21lYXN1cmVcbiAgfSwgb3B0KVxuICB0aGlzLl9vcHQgPSBvcHRcbiAgdGhpcy5fb3B0LnRhYlNpemUgPSBudW1iZXIodGhpcy5fb3B0LnRhYlNpemUsIDQpXG5cbiAgaWYgKCFvcHQuZm9udClcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ211c3QgcHJvdmlkZSBhIHZhbGlkIGJpdG1hcCBmb250JylcblxuICB2YXIgZ2x5cGhzID0gdGhpcy5nbHlwaHNcbiAgdmFyIHRleHQgPSBvcHQudGV4dHx8JycgXG4gIHZhciBmb250ID0gb3B0LmZvbnRcbiAgdGhpcy5fc2V0dXBTcGFjZUdseXBocyhmb250KVxuICBcbiAgdmFyIGxpbmVzID0gd29yZFdyYXAubGluZXModGV4dCwgb3B0KVxuICB2YXIgbWluV2lkdGggPSBvcHQud2lkdGggfHwgMFxuXG4gIC8vY2xlYXIgZ2x5cGhzXG4gIGdseXBocy5sZW5ndGggPSAwXG5cbiAgLy9nZXQgbWF4IGxpbmUgd2lkdGhcbiAgdmFyIG1heExpbmVXaWR0aCA9IGxpbmVzLnJlZHVjZShmdW5jdGlvbihwcmV2LCBsaW5lKSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KHByZXYsIGxpbmUud2lkdGgsIG1pbldpZHRoKVxuICB9LCAwKVxuXG4gIC8vdGhlIHBlbiBwb3NpdGlvblxuICB2YXIgeCA9IDBcbiAgdmFyIHkgPSAwXG4gIHZhciBsaW5lSGVpZ2h0ID0gbnVtYmVyKG9wdC5saW5lSGVpZ2h0LCBmb250LmNvbW1vbi5saW5lSGVpZ2h0KVxuICB2YXIgYmFzZWxpbmUgPSBmb250LmNvbW1vbi5iYXNlXG4gIHZhciBkZXNjZW5kZXIgPSBsaW5lSGVpZ2h0LWJhc2VsaW5lXG4gIHZhciBsZXR0ZXJTcGFjaW5nID0gb3B0LmxldHRlclNwYWNpbmcgfHwgMFxuICB2YXIgaGVpZ2h0ID0gbGluZUhlaWdodCAqIGxpbmVzLmxlbmd0aCAtIGRlc2NlbmRlclxuICB2YXIgYWxpZ24gPSBnZXRBbGlnblR5cGUodGhpcy5fb3B0LmFsaWduKVxuXG4gIC8vZHJhdyB0ZXh0IGFsb25nIGJhc2VsaW5lXG4gIHkgLT0gaGVpZ2h0XG4gIFxuICAvL3RoZSBtZXRyaWNzIGZvciB0aGlzIHRleHQgbGF5b3V0XG4gIHRoaXMuX3dpZHRoID0gbWF4TGluZVdpZHRoXG4gIHRoaXMuX2hlaWdodCA9IGhlaWdodFxuICB0aGlzLl9kZXNjZW5kZXIgPSBsaW5lSGVpZ2h0IC0gYmFzZWxpbmVcbiAgdGhpcy5fYmFzZWxpbmUgPSBiYXNlbGluZVxuICB0aGlzLl94SGVpZ2h0ID0gZ2V0WEhlaWdodChmb250KVxuICB0aGlzLl9jYXBIZWlnaHQgPSBnZXRDYXBIZWlnaHQoZm9udClcbiAgdGhpcy5fbGluZUhlaWdodCA9IGxpbmVIZWlnaHRcbiAgdGhpcy5fYXNjZW5kZXIgPSBsaW5lSGVpZ2h0IC0gZGVzY2VuZGVyIC0gdGhpcy5feEhlaWdodFxuICAgIFxuICAvL2xheW91dCBlYWNoIGdseXBoXG4gIHZhciBzZWxmID0gdGhpc1xuICBsaW5lcy5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUsIGxpbmVJbmRleCkge1xuICAgIHZhciBzdGFydCA9IGxpbmUuc3RhcnRcbiAgICB2YXIgZW5kID0gbGluZS5lbmRcbiAgICB2YXIgbGluZVdpZHRoID0gbGluZS53aWR0aFxuICAgIHZhciBsYXN0R2x5cGhcbiAgICBcbiAgICAvL2ZvciBlYWNoIGdseXBoIGluIHRoYXQgbGluZS4uLlxuICAgIGZvciAodmFyIGk9c3RhcnQ7IGk8ZW5kOyBpKyspIHtcbiAgICAgIHZhciBpZCA9IHRleHQuY2hhckNvZGVBdChpKVxuICAgICAgdmFyIGdseXBoID0gc2VsZi5nZXRHbHlwaChmb250LCBpZClcbiAgICAgIGlmIChnbHlwaCkge1xuICAgICAgICBpZiAobGFzdEdseXBoKSBcbiAgICAgICAgICB4ICs9IGdldEtlcm5pbmcoZm9udCwgbGFzdEdseXBoLmlkLCBnbHlwaC5pZClcblxuICAgICAgICB2YXIgdHggPSB4XG4gICAgICAgIGlmIChhbGlnbiA9PT0gQUxJR05fQ0VOVEVSKSBcbiAgICAgICAgICB0eCArPSAobWF4TGluZVdpZHRoLWxpbmVXaWR0aCkvMlxuICAgICAgICBlbHNlIGlmIChhbGlnbiA9PT0gQUxJR05fUklHSFQpXG4gICAgICAgICAgdHggKz0gKG1heExpbmVXaWR0aC1saW5lV2lkdGgpXG5cbiAgICAgICAgZ2x5cGhzLnB1c2goe1xuICAgICAgICAgIHBvc2l0aW9uOiBbdHgsIHldLFxuICAgICAgICAgIGRhdGE6IGdseXBoLFxuICAgICAgICAgIGluZGV4OiBpLFxuICAgICAgICAgIGxpbmU6IGxpbmVJbmRleFxuICAgICAgICB9KSAgXG5cbiAgICAgICAgLy9tb3ZlIHBlbiBmb3J3YXJkXG4gICAgICAgIHggKz0gZ2x5cGgueGFkdmFuY2UgKyBsZXR0ZXJTcGFjaW5nXG4gICAgICAgIGxhc3RHbHlwaCA9IGdseXBoXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9uZXh0IGxpbmUgZG93blxuICAgIHkgKz0gbGluZUhlaWdodFxuICAgIHggPSAwXG4gIH0pXG4gIHRoaXMuX2xpbmVzVG90YWwgPSBsaW5lcy5sZW5ndGg7XG59XG5cblRleHRMYXlvdXQucHJvdG90eXBlLl9zZXR1cFNwYWNlR2x5cGhzID0gZnVuY3Rpb24oZm9udCkge1xuICAvL1RoZXNlIGFyZSBmYWxsYmFja3MsIHdoZW4gdGhlIGZvbnQgZG9lc24ndCBpbmNsdWRlXG4gIC8vJyAnIG9yICdcXHQnIGdseXBoc1xuICB0aGlzLl9mYWxsYmFja1NwYWNlR2x5cGggPSBudWxsXG4gIHRoaXMuX2ZhbGxiYWNrVGFiR2x5cGggPSBudWxsXG5cbiAgaWYgKCFmb250LmNoYXJzIHx8IGZvbnQuY2hhcnMubGVuZ3RoID09PSAwKVxuICAgIHJldHVyblxuXG4gIC8vdHJ5IHRvIGdldCBzcGFjZSBnbHlwaFxuICAvL3RoZW4gZmFsbCBiYWNrIHRvIHRoZSAnbScgb3IgJ3cnIGdseXBoc1xuICAvL3RoZW4gZmFsbCBiYWNrIHRvIHRoZSBmaXJzdCBnbHlwaCBhdmFpbGFibGVcbiAgdmFyIHNwYWNlID0gZ2V0R2x5cGhCeUlkKGZvbnQsIFNQQUNFX0lEKSBcbiAgICAgICAgICB8fCBnZXRNR2x5cGgoZm9udCkgXG4gICAgICAgICAgfHwgZm9udC5jaGFyc1swXVxuXG4gIC8vYW5kIGNyZWF0ZSBhIGZhbGxiYWNrIGZvciB0YWJcbiAgdmFyIHRhYldpZHRoID0gdGhpcy5fb3B0LnRhYlNpemUgKiBzcGFjZS54YWR2YW5jZVxuICB0aGlzLl9mYWxsYmFja1NwYWNlR2x5cGggPSBzcGFjZVxuICB0aGlzLl9mYWxsYmFja1RhYkdseXBoID0geHRlbmQoc3BhY2UsIHtcbiAgICB4OiAwLCB5OiAwLCB4YWR2YW5jZTogdGFiV2lkdGgsIGlkOiBUQUJfSUQsIFxuICAgIHhvZmZzZXQ6IDAsIHlvZmZzZXQ6IDAsIHdpZHRoOiAwLCBoZWlnaHQ6IDBcbiAgfSlcbn1cblxuVGV4dExheW91dC5wcm90b3R5cGUuZ2V0R2x5cGggPSBmdW5jdGlvbihmb250LCBpZCkge1xuICB2YXIgZ2x5cGggPSBnZXRHbHlwaEJ5SWQoZm9udCwgaWQpXG4gIGlmIChnbHlwaClcbiAgICByZXR1cm4gZ2x5cGhcbiAgZWxzZSBpZiAoaWQgPT09IFRBQl9JRCkgXG4gICAgcmV0dXJuIHRoaXMuX2ZhbGxiYWNrVGFiR2x5cGhcbiAgZWxzZSBpZiAoaWQgPT09IFNQQUNFX0lEKSBcbiAgICByZXR1cm4gdGhpcy5fZmFsbGJhY2tTcGFjZUdseXBoXG4gIHJldHVybiBudWxsXG59XG5cblRleHRMYXlvdXQucHJvdG90eXBlLmNvbXB1dGVNZXRyaWNzID0gZnVuY3Rpb24odGV4dCwgc3RhcnQsIGVuZCwgd2lkdGgpIHtcbiAgdmFyIGxldHRlclNwYWNpbmcgPSB0aGlzLl9vcHQubGV0dGVyU3BhY2luZyB8fCAwXG4gIHZhciBmb250ID0gdGhpcy5fb3B0LmZvbnRcbiAgdmFyIGN1clBlbiA9IDBcbiAgdmFyIGN1cldpZHRoID0gMFxuICB2YXIgY291bnQgPSAwXG4gIHZhciBnbHlwaFxuICB2YXIgbGFzdEdseXBoXG5cbiAgaWYgKCFmb250LmNoYXJzIHx8IGZvbnQuY2hhcnMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAgIGVuZDogc3RhcnQsXG4gICAgICB3aWR0aDogMFxuICAgIH1cbiAgfVxuXG4gIGVuZCA9IE1hdGgubWluKHRleHQubGVuZ3RoLCBlbmQpXG4gIGZvciAodmFyIGk9c3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHZhciBpZCA9IHRleHQuY2hhckNvZGVBdChpKVxuICAgIHZhciBnbHlwaCA9IHRoaXMuZ2V0R2x5cGgoZm9udCwgaWQpXG5cbiAgICBpZiAoZ2x5cGgpIHtcbiAgICAgIC8vbW92ZSBwZW4gZm9yd2FyZFxuICAgICAgdmFyIHhvZmYgPSBnbHlwaC54b2Zmc2V0XG4gICAgICB2YXIga2VybiA9IGxhc3RHbHlwaCA/IGdldEtlcm5pbmcoZm9udCwgbGFzdEdseXBoLmlkLCBnbHlwaC5pZCkgOiAwXG4gICAgICBjdXJQZW4gKz0ga2VyblxuXG4gICAgICB2YXIgbmV4dFBlbiA9IGN1clBlbiArIGdseXBoLnhhZHZhbmNlICsgbGV0dGVyU3BhY2luZ1xuICAgICAgdmFyIG5leHRXaWR0aCA9IGN1clBlbiArIGdseXBoLndpZHRoXG5cbiAgICAgIC8vd2UndmUgaGl0IG91ciBsaW1pdDsgd2UgY2FuJ3QgbW92ZSBvbnRvIHRoZSBuZXh0IGdseXBoXG4gICAgICBpZiAobmV4dFdpZHRoID49IHdpZHRoIHx8IG5leHRQZW4gPj0gd2lkdGgpXG4gICAgICAgIGJyZWFrXG5cbiAgICAgIC8vb3RoZXJ3aXNlIGNvbnRpbnVlIGFsb25nIG91ciBsaW5lXG4gICAgICBjdXJQZW4gPSBuZXh0UGVuXG4gICAgICBjdXJXaWR0aCA9IG5leHRXaWR0aFxuICAgICAgbGFzdEdseXBoID0gZ2x5cGhcbiAgICB9XG4gICAgY291bnQrK1xuICB9XG4gIFxuICAvL21ha2Ugc3VyZSByaWdodG1vc3QgZWRnZSBsaW5lcyB1cCB3aXRoIHJlbmRlcmVkIGdseXBoc1xuICBpZiAobGFzdEdseXBoKVxuICAgIGN1cldpZHRoICs9IGxhc3RHbHlwaC54b2Zmc2V0XG5cbiAgcmV0dXJuIHtcbiAgICBzdGFydDogc3RhcnQsXG4gICAgZW5kOiBzdGFydCArIGNvdW50LFxuICAgIHdpZHRoOiBjdXJXaWR0aFxuICB9XG59XG5cbi8vZ2V0dGVycyBmb3IgdGhlIHByaXZhdGUgdmFyc1xuO1snd2lkdGgnLCAnaGVpZ2h0JywgXG4gICdkZXNjZW5kZXInLCAnYXNjZW5kZXInLFxuICAneEhlaWdodCcsICdiYXNlbGluZScsXG4gICdjYXBIZWlnaHQnLFxuICAnbGluZUhlaWdodCcgXS5mb3JFYWNoKGFkZEdldHRlcilcblxuZnVuY3Rpb24gYWRkR2V0dGVyKG5hbWUpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRleHRMYXlvdXQucHJvdG90eXBlLCBuYW1lLCB7XG4gICAgZ2V0OiB3cmFwcGVyKG5hbWUpLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KVxufVxuXG4vL2NyZWF0ZSBsb29rdXBzIGZvciBwcml2YXRlIHZhcnNcbmZ1bmN0aW9uIHdyYXBwZXIobmFtZSkge1xuICByZXR1cm4gKG5ldyBGdW5jdGlvbihbXG4gICAgJ3JldHVybiBmdW5jdGlvbiAnK25hbWUrJygpIHsnLFxuICAgICcgIHJldHVybiB0aGlzLl8nK25hbWUsXG4gICAgJ30nXG4gIF0uam9pbignXFxuJykpKSgpXG59XG5cbmZ1bmN0aW9uIGdldEdseXBoQnlJZChmb250LCBpZCkge1xuICBpZiAoIWZvbnQuY2hhcnMgfHwgZm9udC5jaGFycy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIG51bGxcblxuICB2YXIgZ2x5cGhJZHggPSBmaW5kQ2hhcihmb250LmNoYXJzLCBpZClcbiAgaWYgKGdseXBoSWR4ID49IDApXG4gICAgcmV0dXJuIGZvbnQuY2hhcnNbZ2x5cGhJZHhdXG4gIHJldHVybiBudWxsXG59XG5cbmZ1bmN0aW9uIGdldFhIZWlnaHQoZm9udCkge1xuICBmb3IgKHZhciBpPTA7IGk8WF9IRUlHSFRTLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGlkID0gWF9IRUlHSFRTW2ldLmNoYXJDb2RlQXQoMClcbiAgICB2YXIgaWR4ID0gZmluZENoYXIoZm9udC5jaGFycywgaWQpXG4gICAgaWYgKGlkeCA+PSAwKSBcbiAgICAgIHJldHVybiBmb250LmNoYXJzW2lkeF0uaGVpZ2h0XG4gIH1cbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gZ2V0TUdseXBoKGZvbnQpIHtcbiAgZm9yICh2YXIgaT0wOyBpPE1fV0lEVEhTLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGlkID0gTV9XSURUSFNbaV0uY2hhckNvZGVBdCgwKVxuICAgIHZhciBpZHggPSBmaW5kQ2hhcihmb250LmNoYXJzLCBpZClcbiAgICBpZiAoaWR4ID49IDApIFxuICAgICAgcmV0dXJuIGZvbnQuY2hhcnNbaWR4XVxuICB9XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGdldENhcEhlaWdodChmb250KSB7XG4gIGZvciAodmFyIGk9MDsgaTxDQVBfSEVJR0hUUy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpZCA9IENBUF9IRUlHSFRTW2ldLmNoYXJDb2RlQXQoMClcbiAgICB2YXIgaWR4ID0gZmluZENoYXIoZm9udC5jaGFycywgaWQpXG4gICAgaWYgKGlkeCA+PSAwKSBcbiAgICAgIHJldHVybiBmb250LmNoYXJzW2lkeF0uaGVpZ2h0XG4gIH1cbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gZ2V0S2VybmluZyhmb250LCBsZWZ0LCByaWdodCkge1xuICBpZiAoIWZvbnQua2VybmluZ3MgfHwgZm9udC5rZXJuaW5ncy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIDBcblxuICB2YXIgdGFibGUgPSBmb250Lmtlcm5pbmdzXG4gIGZvciAodmFyIGk9MDsgaTx0YWJsZS5sZW5ndGg7IGkrKykge1xuICAgIHZhciBrZXJuID0gdGFibGVbaV1cbiAgICBpZiAoa2Vybi5maXJzdCA9PT0gbGVmdCAmJiBrZXJuLnNlY29uZCA9PT0gcmlnaHQpXG4gICAgICByZXR1cm4ga2Vybi5hbW91bnRcbiAgfVxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBnZXRBbGlnblR5cGUoYWxpZ24pIHtcbiAgaWYgKGFsaWduID09PSAnY2VudGVyJylcbiAgICByZXR1cm4gQUxJR05fQ0VOVEVSXG4gIGVsc2UgaWYgKGFsaWduID09PSAncmlnaHQnKVxuICAgIHJldHVybiBBTElHTl9SSUdIVFxuICByZXR1cm4gQUxJR05fTEVGVFxufSIsIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlQk1Gb250QXNjaWkoZGF0YSkge1xuICBpZiAoIWRhdGEpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdubyBkYXRhIHByb3ZpZGVkJylcbiAgZGF0YSA9IGRhdGEudG9TdHJpbmcoKS50cmltKClcblxuICB2YXIgb3V0cHV0ID0ge1xuICAgIHBhZ2VzOiBbXSxcbiAgICBjaGFyczogW10sXG4gICAga2VybmluZ3M6IFtdXG4gIH1cblxuICB2YXIgbGluZXMgPSBkYXRhLnNwbGl0KC9cXHJcXG4/fFxcbi9nKVxuXG4gIGlmIChsaW5lcy5sZW5ndGggPT09IDApXG4gICAgdGhyb3cgbmV3IEVycm9yKCdubyBkYXRhIGluIEJNRm9udCBmaWxlJylcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGxpbmVEYXRhID0gc3BsaXRMaW5lKGxpbmVzW2ldLCBpKVxuICAgIGlmICghbGluZURhdGEpIC8vc2tpcCBlbXB0eSBsaW5lc1xuICAgICAgY29udGludWVcblxuICAgIGlmIChsaW5lRGF0YS5rZXkgPT09ICdwYWdlJykge1xuICAgICAgaWYgKHR5cGVvZiBsaW5lRGF0YS5kYXRhLmlkICE9PSAnbnVtYmVyJylcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYWxmb3JtZWQgZmlsZSBhdCBsaW5lICcgKyBpICsgJyAtLSBuZWVkcyBwYWdlIGlkPU4nKVxuICAgICAgaWYgKHR5cGVvZiBsaW5lRGF0YS5kYXRhLmZpbGUgIT09ICdzdHJpbmcnKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hbGZvcm1lZCBmaWxlIGF0IGxpbmUgJyArIGkgKyAnIC0tIG5lZWRzIHBhZ2UgZmlsZT1cInBhdGhcIicpXG4gICAgICBvdXRwdXQucGFnZXNbbGluZURhdGEuZGF0YS5pZF0gPSBsaW5lRGF0YS5kYXRhLmZpbGVcbiAgICB9IGVsc2UgaWYgKGxpbmVEYXRhLmtleSA9PT0gJ2NoYXJzJyB8fCBsaW5lRGF0YS5rZXkgPT09ICdrZXJuaW5ncycpIHtcbiAgICAgIC8vLi4uIGRvIG5vdGhpbmcgZm9yIHRoZXNlIHR3byAuLi5cbiAgICB9IGVsc2UgaWYgKGxpbmVEYXRhLmtleSA9PT0gJ2NoYXInKSB7XG4gICAgICBvdXRwdXQuY2hhcnMucHVzaChsaW5lRGF0YS5kYXRhKVxuICAgIH0gZWxzZSBpZiAobGluZURhdGEua2V5ID09PSAna2VybmluZycpIHtcbiAgICAgIG91dHB1dC5rZXJuaW5ncy5wdXNoKGxpbmVEYXRhLmRhdGEpXG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dFtsaW5lRGF0YS5rZXldID0gbGluZURhdGEuZGF0YVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvdXRwdXRcbn1cblxuZnVuY3Rpb24gc3BsaXRMaW5lKGxpbmUsIGlkeCkge1xuICBsaW5lID0gbGluZS5yZXBsYWNlKC9cXHQrL2csICcgJykudHJpbSgpXG4gIGlmICghbGluZSlcbiAgICByZXR1cm4gbnVsbFxuXG4gIHZhciBzcGFjZSA9IGxpbmUuaW5kZXhPZignICcpXG4gIGlmIChzcGFjZSA9PT0gLTEpIFxuICAgIHRocm93IG5ldyBFcnJvcihcIm5vIG5hbWVkIHJvdyBhdCBsaW5lIFwiICsgaWR4KVxuXG4gIHZhciBrZXkgPSBsaW5lLnN1YnN0cmluZygwLCBzcGFjZSlcblxuICBsaW5lID0gbGluZS5zdWJzdHJpbmcoc3BhY2UgKyAxKVxuICAvL2NsZWFyIFwibGV0dGVyXCIgZmllbGQgYXMgaXQgaXMgbm9uLXN0YW5kYXJkIGFuZFxuICAvL3JlcXVpcmVzIGFkZGl0aW9uYWwgY29tcGxleGl0eSB0byBwYXJzZSBcIiAvID0gc3ltYm9sc1xuICBsaW5lID0gbGluZS5yZXBsYWNlKC9sZXR0ZXI9W1xcJ1xcXCJdXFxTK1tcXCdcXFwiXS9naSwgJycpICBcbiAgbGluZSA9IGxpbmUuc3BsaXQoXCI9XCIpXG4gIGxpbmUgPSBsaW5lLm1hcChmdW5jdGlvbihzdHIpIHtcbiAgICByZXR1cm4gc3RyLnRyaW0oKS5tYXRjaCgoLyhcIi4qP1wifFteXCJcXHNdKykrKD89XFxzKnxcXHMqJCkvZykpXG4gIH0pXG5cbiAgdmFyIGRhdGEgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmUubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZHQgPSBsaW5lW2ldXG4gICAgaWYgKGkgPT09IDApIHtcbiAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgIGtleTogZHRbMF0sXG4gICAgICAgIGRhdGE6IFwiXCJcbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmIChpID09PSBsaW5lLmxlbmd0aCAtIDEpIHtcbiAgICAgIGRhdGFbZGF0YS5sZW5ndGggLSAxXS5kYXRhID0gcGFyc2VEYXRhKGR0WzBdKVxuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhW2RhdGEubGVuZ3RoIC0gMV0uZGF0YSA9IHBhcnNlRGF0YShkdFswXSlcbiAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgIGtleTogZHRbMV0sXG4gICAgICAgIGRhdGE6IFwiXCJcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgdmFyIG91dCA9IHtcbiAgICBrZXk6IGtleSxcbiAgICBkYXRhOiB7fVxuICB9XG5cbiAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKHYpIHtcbiAgICBvdXQuZGF0YVt2LmtleV0gPSB2LmRhdGE7XG4gIH0pXG5cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiBwYXJzZURhdGEoZGF0YSkge1xuICBpZiAoIWRhdGEgfHwgZGF0YS5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIFwiXCJcblxuICBpZiAoZGF0YS5pbmRleE9mKCdcIicpID09PSAwIHx8IGRhdGEuaW5kZXhPZihcIidcIikgPT09IDApXG4gICAgcmV0dXJuIGRhdGEuc3Vic3RyaW5nKDEsIGRhdGEubGVuZ3RoIC0gMSlcbiAgaWYgKGRhdGEuaW5kZXhPZignLCcpICE9PSAtMSlcbiAgICByZXR1cm4gcGFyc2VJbnRMaXN0KGRhdGEpXG4gIHJldHVybiBwYXJzZUludChkYXRhLCAxMClcbn1cblxuZnVuY3Rpb24gcGFyc2VJbnRMaXN0KGRhdGEpIHtcbiAgcmV0dXJuIGRhdGEuc3BsaXQoJywnKS5tYXAoZnVuY3Rpb24odmFsKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KHZhbCwgMTApXG4gIH0pXG59IiwidmFyIGR0eXBlID0gcmVxdWlyZSgnZHR5cGUnKVxudmFyIGFuQXJyYXkgPSByZXF1aXJlKCdhbi1hcnJheScpXG52YXIgaXNCdWZmZXIgPSByZXF1aXJlKCdpcy1idWZmZXInKVxuXG52YXIgQ1cgPSBbMCwgMiwgM11cbnZhciBDQ1cgPSBbMiwgMSwgM11cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVRdWFkRWxlbWVudHMoYXJyYXksIG9wdCkge1xuICAgIC8vaWYgdXNlciBkaWRuJ3Qgc3BlY2lmeSBhbiBvdXRwdXQgYXJyYXlcbiAgICBpZiAoIWFycmF5IHx8ICEoYW5BcnJheShhcnJheSkgfHwgaXNCdWZmZXIoYXJyYXkpKSkge1xuICAgICAgICBvcHQgPSBhcnJheSB8fCB7fVxuICAgICAgICBhcnJheSA9IG51bGxcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdCA9PT0gJ251bWJlcicpIC8vYmFja3dhcmRzLWNvbXBhdGlibGVcbiAgICAgICAgb3B0ID0geyBjb3VudDogb3B0IH1cbiAgICBlbHNlXG4gICAgICAgIG9wdCA9IG9wdCB8fCB7fVxuXG4gICAgdmFyIHR5cGUgPSB0eXBlb2Ygb3B0LnR5cGUgPT09ICdzdHJpbmcnID8gb3B0LnR5cGUgOiAndWludDE2J1xuICAgIHZhciBjb3VudCA9IHR5cGVvZiBvcHQuY291bnQgPT09ICdudW1iZXInID8gb3B0LmNvdW50IDogMVxuICAgIHZhciBzdGFydCA9IChvcHQuc3RhcnQgfHwgMCkgXG5cbiAgICB2YXIgZGlyID0gb3B0LmNsb2Nrd2lzZSAhPT0gZmFsc2UgPyBDVyA6IENDVyxcbiAgICAgICAgYSA9IGRpclswXSwgXG4gICAgICAgIGIgPSBkaXJbMV0sXG4gICAgICAgIGMgPSBkaXJbMl1cblxuICAgIHZhciBudW1JbmRpY2VzID0gY291bnQgKiA2XG5cbiAgICB2YXIgaW5kaWNlcyA9IGFycmF5IHx8IG5ldyAoZHR5cGUodHlwZSkpKG51bUluZGljZXMpXG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSAwOyBpIDwgbnVtSW5kaWNlczsgaSArPSA2LCBqICs9IDQpIHtcbiAgICAgICAgdmFyIHggPSBpICsgc3RhcnRcbiAgICAgICAgaW5kaWNlc1t4ICsgMF0gPSBqICsgMFxuICAgICAgICBpbmRpY2VzW3ggKyAxXSA9IGogKyAxXG4gICAgICAgIGluZGljZXNbeCArIDJdID0gaiArIDJcbiAgICAgICAgaW5kaWNlc1t4ICsgM10gPSBqICsgYVxuICAgICAgICBpbmRpY2VzW3ggKyA0XSA9IGogKyBiXG4gICAgICAgIGluZGljZXNbeCArIDVdID0gaiArIGNcbiAgICB9XG4gICAgcmV0dXJuIGluZGljZXNcbn0iLCJ2YXIgY3JlYXRlTGF5b3V0ID0gcmVxdWlyZSgnbGF5b3V0LWJtZm9udC10ZXh0JylcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcbnZhciBjcmVhdGVJbmRpY2VzID0gcmVxdWlyZSgncXVhZC1pbmRpY2VzJylcbnZhciBidWZmZXIgPSByZXF1aXJlKCd0aHJlZS1idWZmZXItdmVydGV4LWRhdGEnKVxudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKVxuXG52YXIgdmVydGljZXMgPSByZXF1aXJlKCcuL2xpYi92ZXJ0aWNlcycpXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL2xpYi91dGlscycpXG5cbnZhciBCYXNlID0gVEhSRUUuQnVmZmVyR2VvbWV0cnlcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVUZXh0R2VvbWV0cnkgKG9wdCkge1xuICByZXR1cm4gbmV3IFRleHRHZW9tZXRyeShvcHQpXG59XG5cbmZ1bmN0aW9uIFRleHRHZW9tZXRyeSAob3B0KSB7XG4gIEJhc2UuY2FsbCh0aGlzKVxuXG4gIGlmICh0eXBlb2Ygb3B0ID09PSAnc3RyaW5nJykge1xuICAgIG9wdCA9IHsgdGV4dDogb3B0IH1cbiAgfVxuXG4gIC8vIHVzZSB0aGVzZSBhcyBkZWZhdWx0IHZhbHVlcyBmb3IgYW55IHN1YnNlcXVlbnRcbiAgLy8gY2FsbHMgdG8gdXBkYXRlKClcbiAgdGhpcy5fb3B0ID0gYXNzaWduKHt9LCBvcHQpXG5cbiAgLy8gYWxzbyBkbyBhbiBpbml0aWFsIHNldHVwLi4uXG4gIGlmIChvcHQpIHRoaXMudXBkYXRlKG9wdClcbn1cblxuaW5oZXJpdHMoVGV4dEdlb21ldHJ5LCBCYXNlKVxuXG5UZXh0R2VvbWV0cnkucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChvcHQpIHtcbiAgaWYgKHR5cGVvZiBvcHQgPT09ICdzdHJpbmcnKSB7XG4gICAgb3B0ID0geyB0ZXh0OiBvcHQgfVxuICB9XG5cbiAgLy8gdXNlIGNvbnN0cnVjdG9yIGRlZmF1bHRzXG4gIG9wdCA9IGFzc2lnbih7fSwgdGhpcy5fb3B0LCBvcHQpXG5cbiAgaWYgKCFvcHQuZm9udCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ211c3Qgc3BlY2lmeSBhIHsgZm9udCB9IGluIG9wdGlvbnMnKVxuICB9XG5cbiAgdGhpcy5sYXlvdXQgPSBjcmVhdGVMYXlvdXQob3B0KVxuXG4gIC8vIGdldCB2ZWMyIHRleGNvb3Jkc1xuICB2YXIgZmxpcFkgPSBvcHQuZmxpcFkgIT09IGZhbHNlXG5cbiAgLy8gdGhlIGRlc2lyZWQgQk1Gb250IGRhdGFcbiAgdmFyIGZvbnQgPSBvcHQuZm9udFxuXG4gIC8vIGRldGVybWluZSB0ZXh0dXJlIHNpemUgZnJvbSBmb250IGZpbGVcbiAgdmFyIHRleFdpZHRoID0gZm9udC5jb21tb24uc2NhbGVXXG4gIHZhciB0ZXhIZWlnaHQgPSBmb250LmNvbW1vbi5zY2FsZUhcblxuICAvLyBnZXQgdmlzaWJsZSBnbHlwaHNcbiAgdmFyIGdseXBocyA9IHRoaXMubGF5b3V0LmdseXBocy5maWx0ZXIoZnVuY3Rpb24gKGdseXBoKSB7XG4gICAgdmFyIGJpdG1hcCA9IGdseXBoLmRhdGFcbiAgICByZXR1cm4gYml0bWFwLndpZHRoICogYml0bWFwLmhlaWdodCA+IDBcbiAgfSlcblxuICAvLyBwcm92aWRlIHZpc2libGUgZ2x5cGhzIGZvciBjb252ZW5pZW5jZVxuICB0aGlzLnZpc2libGVHbHlwaHMgPSBnbHlwaHNcblxuICAvLyBnZXQgY29tbW9uIHZlcnRleCBkYXRhXG4gIHZhciBwb3NpdGlvbnMgPSB2ZXJ0aWNlcy5wb3NpdGlvbnMoZ2x5cGhzKVxuICB2YXIgdXZzID0gdmVydGljZXMudXZzKGdseXBocywgdGV4V2lkdGgsIHRleEhlaWdodCwgZmxpcFkpXG4gIHZhciBpbmRpY2VzID0gY3JlYXRlSW5kaWNlcyh7XG4gICAgY2xvY2t3aXNlOiB0cnVlLFxuICAgIHR5cGU6ICd1aW50MTYnLFxuICAgIGNvdW50OiBnbHlwaHMubGVuZ3RoXG4gIH0pXG5cbiAgLy8gdXBkYXRlIHZlcnRleCBkYXRhXG4gIGJ1ZmZlci5pbmRleCh0aGlzLCBpbmRpY2VzLCAxLCAndWludDE2JylcbiAgYnVmZmVyLmF0dHIodGhpcywgJ3Bvc2l0aW9uJywgcG9zaXRpb25zLCAyKVxuICBidWZmZXIuYXR0cih0aGlzLCAndXYnLCB1dnMsIDIpXG5cbiAgLy8gdXBkYXRlIG11bHRpcGFnZSBkYXRhXG4gIGlmICghb3B0Lm11bHRpcGFnZSAmJiAncGFnZScgaW4gdGhpcy5hdHRyaWJ1dGVzKSB7XG4gICAgLy8gZGlzYWJsZSBtdWx0aXBhZ2UgcmVuZGVyaW5nXG4gICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ3BhZ2UnKVxuICB9IGVsc2UgaWYgKG9wdC5tdWx0aXBhZ2UpIHtcbiAgICB2YXIgcGFnZXMgPSB2ZXJ0aWNlcy5wYWdlcyhnbHlwaHMpXG4gICAgLy8gZW5hYmxlIG11bHRpcGFnZSByZW5kZXJpbmdcbiAgICBidWZmZXIuYXR0cih0aGlzLCAncGFnZScsIHBhZ2VzLCAxKVxuICB9XG59XG5cblRleHRHZW9tZXRyeS5wcm90b3R5cGUuY29tcHV0ZUJvdW5kaW5nU3BoZXJlID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5ib3VuZGluZ1NwaGVyZSA9PT0gbnVsbCkge1xuICAgIHRoaXMuYm91bmRpbmdTcGhlcmUgPSBuZXcgVEhSRUUuU3BoZXJlKClcbiAgfVxuXG4gIHZhciBwb3NpdGlvbnMgPSB0aGlzLmF0dHJpYnV0ZXMucG9zaXRpb24uYXJyYXlcbiAgdmFyIGl0ZW1TaXplID0gdGhpcy5hdHRyaWJ1dGVzLnBvc2l0aW9uLml0ZW1TaXplXG4gIGlmICghcG9zaXRpb25zIHx8ICFpdGVtU2l6ZSB8fCBwb3NpdGlvbnMubGVuZ3RoIDwgMikge1xuICAgIHRoaXMuYm91bmRpbmdTcGhlcmUucmFkaXVzID0gMFxuICAgIHRoaXMuYm91bmRpbmdTcGhlcmUuY2VudGVyLnNldCgwLCAwLCAwKVxuICAgIHJldHVyblxuICB9XG4gIHV0aWxzLmNvbXB1dGVTcGhlcmUocG9zaXRpb25zLCB0aGlzLmJvdW5kaW5nU3BoZXJlKVxuICBpZiAoaXNOYU4odGhpcy5ib3VuZGluZ1NwaGVyZS5yYWRpdXMpKSB7XG4gICAgY29uc29sZS5lcnJvcignVEhSRUUuQnVmZmVyR2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nU3BoZXJlKCk6ICcgK1xuICAgICAgJ0NvbXB1dGVkIHJhZGl1cyBpcyBOYU4uIFRoZSAnICtcbiAgICAgICdcInBvc2l0aW9uXCIgYXR0cmlidXRlIGlzIGxpa2VseSB0byBoYXZlIE5hTiB2YWx1ZXMuJylcbiAgfVxufVxuXG5UZXh0R2VvbWV0cnkucHJvdG90eXBlLmNvbXB1dGVCb3VuZGluZ0JveCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuYm91bmRpbmdCb3ggPT09IG51bGwpIHtcbiAgICB0aGlzLmJvdW5kaW5nQm94ID0gbmV3IFRIUkVFLkJveDMoKVxuICB9XG5cbiAgdmFyIGJib3ggPSB0aGlzLmJvdW5kaW5nQm94XG4gIHZhciBwb3NpdGlvbnMgPSB0aGlzLmF0dHJpYnV0ZXMucG9zaXRpb24uYXJyYXlcbiAgdmFyIGl0ZW1TaXplID0gdGhpcy5hdHRyaWJ1dGVzLnBvc2l0aW9uLml0ZW1TaXplXG4gIGlmICghcG9zaXRpb25zIHx8ICFpdGVtU2l6ZSB8fCBwb3NpdGlvbnMubGVuZ3RoIDwgMikge1xuICAgIGJib3gubWFrZUVtcHR5KClcbiAgICByZXR1cm5cbiAgfVxuICB1dGlscy5jb21wdXRlQm94KHBvc2l0aW9ucywgYmJveClcbn1cbiIsInZhciBpdGVtU2l6ZSA9IDJcbnZhciBib3ggPSB7IG1pbjogWzAsIDBdLCBtYXg6IFswLCAwXSB9XG5cbmZ1bmN0aW9uIGJvdW5kcyAocG9zaXRpb25zKSB7XG4gIHZhciBjb3VudCA9IHBvc2l0aW9ucy5sZW5ndGggLyBpdGVtU2l6ZVxuICBib3gubWluWzBdID0gcG9zaXRpb25zWzBdXG4gIGJveC5taW5bMV0gPSBwb3NpdGlvbnNbMV1cbiAgYm94Lm1heFswXSA9IHBvc2l0aW9uc1swXVxuICBib3gubWF4WzFdID0gcG9zaXRpb25zWzFdXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgdmFyIHggPSBwb3NpdGlvbnNbaSAqIGl0ZW1TaXplICsgMF1cbiAgICB2YXIgeSA9IHBvc2l0aW9uc1tpICogaXRlbVNpemUgKyAxXVxuICAgIGJveC5taW5bMF0gPSBNYXRoLm1pbih4LCBib3gubWluWzBdKVxuICAgIGJveC5taW5bMV0gPSBNYXRoLm1pbih5LCBib3gubWluWzFdKVxuICAgIGJveC5tYXhbMF0gPSBNYXRoLm1heCh4LCBib3gubWF4WzBdKVxuICAgIGJveC5tYXhbMV0gPSBNYXRoLm1heCh5LCBib3gubWF4WzFdKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzLmNvbXB1dGVCb3ggPSBmdW5jdGlvbiAocG9zaXRpb25zLCBvdXRwdXQpIHtcbiAgYm91bmRzKHBvc2l0aW9ucylcbiAgb3V0cHV0Lm1pbi5zZXQoYm94Lm1pblswXSwgYm94Lm1pblsxXSwgMClcbiAgb3V0cHV0Lm1heC5zZXQoYm94Lm1heFswXSwgYm94Lm1heFsxXSwgMClcbn1cblxubW9kdWxlLmV4cG9ydHMuY29tcHV0ZVNwaGVyZSA9IGZ1bmN0aW9uIChwb3NpdGlvbnMsIG91dHB1dCkge1xuICBib3VuZHMocG9zaXRpb25zKVxuICB2YXIgbWluWCA9IGJveC5taW5bMF1cbiAgdmFyIG1pblkgPSBib3gubWluWzFdXG4gIHZhciBtYXhYID0gYm94Lm1heFswXVxuICB2YXIgbWF4WSA9IGJveC5tYXhbMV1cbiAgdmFyIHdpZHRoID0gbWF4WCAtIG1pblhcbiAgdmFyIGhlaWdodCA9IG1heFkgLSBtaW5ZXG4gIHZhciBsZW5ndGggPSBNYXRoLnNxcnQod2lkdGggKiB3aWR0aCArIGhlaWdodCAqIGhlaWdodClcbiAgb3V0cHV0LmNlbnRlci5zZXQobWluWCArIHdpZHRoIC8gMiwgbWluWSArIGhlaWdodCAvIDIsIDApXG4gIG91dHB1dC5yYWRpdXMgPSBsZW5ndGggLyAyXG59XG4iLCJtb2R1bGUuZXhwb3J0cy5wYWdlcyA9IGZ1bmN0aW9uIHBhZ2VzIChnbHlwaHMpIHtcbiAgdmFyIHBhZ2VzID0gbmV3IEZsb2F0MzJBcnJheShnbHlwaHMubGVuZ3RoICogNCAqIDEpXG4gIHZhciBpID0gMFxuICBnbHlwaHMuZm9yRWFjaChmdW5jdGlvbiAoZ2x5cGgpIHtcbiAgICB2YXIgaWQgPSBnbHlwaC5kYXRhLnBhZ2UgfHwgMFxuICAgIHBhZ2VzW2krK10gPSBpZFxuICAgIHBhZ2VzW2krK10gPSBpZFxuICAgIHBhZ2VzW2krK10gPSBpZFxuICAgIHBhZ2VzW2krK10gPSBpZFxuICB9KVxuICByZXR1cm4gcGFnZXNcbn1cblxubW9kdWxlLmV4cG9ydHMudXZzID0gZnVuY3Rpb24gdXZzIChnbHlwaHMsIHRleFdpZHRoLCB0ZXhIZWlnaHQsIGZsaXBZKSB7XG4gIHZhciB1dnMgPSBuZXcgRmxvYXQzMkFycmF5KGdseXBocy5sZW5ndGggKiA0ICogMilcbiAgdmFyIGkgPSAwXG4gIGdseXBocy5mb3JFYWNoKGZ1bmN0aW9uIChnbHlwaCkge1xuICAgIHZhciBiaXRtYXAgPSBnbHlwaC5kYXRhXG4gICAgdmFyIGJ3ID0gKGJpdG1hcC54ICsgYml0bWFwLndpZHRoKVxuICAgIHZhciBiaCA9IChiaXRtYXAueSArIGJpdG1hcC5oZWlnaHQpXG5cbiAgICAvLyB0b3AgbGVmdCBwb3NpdGlvblxuICAgIHZhciB1MCA9IGJpdG1hcC54IC8gdGV4V2lkdGhcbiAgICB2YXIgdjEgPSBiaXRtYXAueSAvIHRleEhlaWdodFxuICAgIHZhciB1MSA9IGJ3IC8gdGV4V2lkdGhcbiAgICB2YXIgdjAgPSBiaCAvIHRleEhlaWdodFxuXG4gICAgaWYgKGZsaXBZKSB7XG4gICAgICB2MSA9ICh0ZXhIZWlnaHQgLSBiaXRtYXAueSkgLyB0ZXhIZWlnaHRcbiAgICAgIHYwID0gKHRleEhlaWdodCAtIGJoKSAvIHRleEhlaWdodFxuICAgIH1cblxuICAgIC8vIEJMXG4gICAgdXZzW2krK10gPSB1MFxuICAgIHV2c1tpKytdID0gdjFcbiAgICAvLyBUTFxuICAgIHV2c1tpKytdID0gdTBcbiAgICB1dnNbaSsrXSA9IHYwXG4gICAgLy8gVFJcbiAgICB1dnNbaSsrXSA9IHUxXG4gICAgdXZzW2krK10gPSB2MFxuICAgIC8vIEJSXG4gICAgdXZzW2krK10gPSB1MVxuICAgIHV2c1tpKytdID0gdjFcbiAgfSlcbiAgcmV0dXJuIHV2c1xufVxuXG5tb2R1bGUuZXhwb3J0cy5wb3NpdGlvbnMgPSBmdW5jdGlvbiBwb3NpdGlvbnMgKGdseXBocykge1xuICB2YXIgcG9zaXRpb25zID0gbmV3IEZsb2F0MzJBcnJheShnbHlwaHMubGVuZ3RoICogNCAqIDIpXG4gIHZhciBpID0gMFxuICBnbHlwaHMuZm9yRWFjaChmdW5jdGlvbiAoZ2x5cGgpIHtcbiAgICB2YXIgYml0bWFwID0gZ2x5cGguZGF0YVxuXG4gICAgLy8gYm90dG9tIGxlZnQgcG9zaXRpb25cbiAgICB2YXIgeCA9IGdseXBoLnBvc2l0aW9uWzBdICsgYml0bWFwLnhvZmZzZXRcbiAgICB2YXIgeSA9IGdseXBoLnBvc2l0aW9uWzFdICsgYml0bWFwLnlvZmZzZXRcblxuICAgIC8vIHF1YWQgc2l6ZVxuICAgIHZhciB3ID0gYml0bWFwLndpZHRoXG4gICAgdmFyIGggPSBiaXRtYXAuaGVpZ2h0XG5cbiAgICAvLyBCTFxuICAgIHBvc2l0aW9uc1tpKytdID0geFxuICAgIHBvc2l0aW9uc1tpKytdID0geVxuICAgIC8vIFRMXG4gICAgcG9zaXRpb25zW2krK10gPSB4XG4gICAgcG9zaXRpb25zW2krK10gPSB5ICsgaFxuICAgIC8vIFRSXG4gICAgcG9zaXRpb25zW2krK10gPSB4ICsgd1xuICAgIHBvc2l0aW9uc1tpKytdID0geSArIGhcbiAgICAvLyBCUlxuICAgIHBvc2l0aW9uc1tpKytdID0geCArIHdcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHlcbiAgfSlcbiAgcmV0dXJuIHBvc2l0aW9uc1xufVxuIiwidmFyIGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVNERlNoYWRlciAob3B0KSB7XG4gIG9wdCA9IG9wdCB8fCB7fVxuICB2YXIgb3BhY2l0eSA9IHR5cGVvZiBvcHQub3BhY2l0eSA9PT0gJ251bWJlcicgPyBvcHQub3BhY2l0eSA6IDFcbiAgdmFyIGFscGhhVGVzdCA9IHR5cGVvZiBvcHQuYWxwaGFUZXN0ID09PSAnbnVtYmVyJyA/IG9wdC5hbHBoYVRlc3QgOiAwLjAwMDFcbiAgdmFyIHByZWNpc2lvbiA9IG9wdC5wcmVjaXNpb24gfHwgJ2hpZ2hwJ1xuICB2YXIgY29sb3IgPSBvcHQuY29sb3JcbiAgdmFyIG1hcCA9IG9wdC5tYXBcblxuICAvLyByZW1vdmUgdG8gc2F0aXNmeSByNzNcbiAgZGVsZXRlIG9wdC5tYXBcbiAgZGVsZXRlIG9wdC5jb2xvclxuICBkZWxldGUgb3B0LnByZWNpc2lvblxuICBkZWxldGUgb3B0Lm9wYWNpdHlcblxuICByZXR1cm4gYXNzaWduKHtcbiAgICB1bmlmb3Jtczoge1xuICAgICAgb3BhY2l0eTogeyB0eXBlOiAnZicsIHZhbHVlOiBvcGFjaXR5IH0sXG4gICAgICBtYXA6IHsgdHlwZTogJ3QnLCB2YWx1ZTogbWFwIHx8IG5ldyBUSFJFRS5UZXh0dXJlKCkgfSxcbiAgICAgIGNvbG9yOiB7IHR5cGU6ICdjJywgdmFsdWU6IG5ldyBUSFJFRS5Db2xvcihjb2xvcikgfVxuICAgIH0sXG4gICAgdmVydGV4U2hhZGVyOiBbXG4gICAgICAnYXR0cmlidXRlIHZlYzIgdXY7JyxcbiAgICAgICdhdHRyaWJ1dGUgdmVjNCBwb3NpdGlvbjsnLFxuICAgICAgJ3VuaWZvcm0gbWF0NCBwcm9qZWN0aW9uTWF0cml4OycsXG4gICAgICAndW5pZm9ybSBtYXQ0IG1vZGVsVmlld01hdHJpeDsnLFxuICAgICAgJ3ZhcnlpbmcgdmVjMiB2VXY7JyxcbiAgICAgICd2b2lkIG1haW4oKSB7JyxcbiAgICAgICd2VXYgPSB1djsnLFxuICAgICAgJ2dsX1Bvc2l0aW9uID0gcHJvamVjdGlvbk1hdHJpeCAqIG1vZGVsVmlld01hdHJpeCAqIHBvc2l0aW9uOycsXG4gICAgICAnfSdcbiAgICBdLmpvaW4oJ1xcbicpLFxuICAgIGZyYWdtZW50U2hhZGVyOiBbXG4gICAgICAnI2lmZGVmIEdMX09FU19zdGFuZGFyZF9kZXJpdmF0aXZlcycsXG4gICAgICAnI2V4dGVuc2lvbiBHTF9PRVNfc3RhbmRhcmRfZGVyaXZhdGl2ZXMgOiBlbmFibGUnLFxuICAgICAgJyNlbmRpZicsXG4gICAgICAncHJlY2lzaW9uICcgKyBwcmVjaXNpb24gKyAnIGZsb2F0OycsXG4gICAgICAndW5pZm9ybSBmbG9hdCBvcGFjaXR5OycsXG4gICAgICAndW5pZm9ybSB2ZWMzIGNvbG9yOycsXG4gICAgICAndW5pZm9ybSBzYW1wbGVyMkQgbWFwOycsXG4gICAgICAndmFyeWluZyB2ZWMyIHZVdjsnLFxuXG4gICAgICAnZmxvYXQgYWFzdGVwKGZsb2F0IHZhbHVlKSB7JyxcbiAgICAgICcgICNpZmRlZiBHTF9PRVNfc3RhbmRhcmRfZGVyaXZhdGl2ZXMnLFxuICAgICAgJyAgICBmbG9hdCBhZndpZHRoID0gbGVuZ3RoKHZlYzIoZEZkeCh2YWx1ZSksIGRGZHkodmFsdWUpKSkgKiAwLjcwNzEwNjc4MTE4NjU0NzU3OycsXG4gICAgICAnICAjZWxzZScsXG4gICAgICAnICAgIGZsb2F0IGFmd2lkdGggPSAoMS4wIC8gMzIuMCkgKiAoMS40MTQyMTM1NjIzNzMwOTUxIC8gKDIuMCAqIGdsX0ZyYWdDb29yZC53KSk7JyxcbiAgICAgICcgICNlbmRpZicsXG4gICAgICAnICByZXR1cm4gc21vb3Roc3RlcCgwLjUgLSBhZndpZHRoLCAwLjUgKyBhZndpZHRoLCB2YWx1ZSk7JyxcbiAgICAgICd9JyxcblxuICAgICAgJ3ZvaWQgbWFpbigpIHsnLFxuICAgICAgJyAgdmVjNCB0ZXhDb2xvciA9IHRleHR1cmUyRChtYXAsIHZVdik7JyxcbiAgICAgICcgIGZsb2F0IGFscGhhID0gYWFzdGVwKHRleENvbG9yLmEpOycsXG4gICAgICAnICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGNvbG9yLCBvcGFjaXR5ICogYWxwaGEpOycsXG4gICAgICBhbHBoYVRlc3QgPT09IDBcbiAgICAgICAgPyAnJ1xuICAgICAgICA6ICcgIGlmIChnbF9GcmFnQ29sb3IuYSA8ICcgKyBhbHBoYVRlc3QgKyAnKSBkaXNjYXJkOycsXG4gICAgICAnfSdcbiAgICBdLmpvaW4oJ1xcbicpXG4gIH0sIG9wdClcbn1cbiIsInZhciBmbGF0dGVuID0gcmVxdWlyZSgnZmxhdHRlbi12ZXJ0ZXgtZGF0YScpXG52YXIgd2FybmVkID0gZmFsc2U7XG5cbm1vZHVsZS5leHBvcnRzLmF0dHIgPSBzZXRBdHRyaWJ1dGVcbm1vZHVsZS5leHBvcnRzLmluZGV4ID0gc2V0SW5kZXhcblxuZnVuY3Rpb24gc2V0SW5kZXggKGdlb21ldHJ5LCBkYXRhLCBpdGVtU2l6ZSwgZHR5cGUpIHtcbiAgaWYgKHR5cGVvZiBpdGVtU2l6ZSAhPT0gJ251bWJlcicpIGl0ZW1TaXplID0gMVxuICBpZiAodHlwZW9mIGR0eXBlICE9PSAnc3RyaW5nJykgZHR5cGUgPSAndWludDE2J1xuXG4gIHZhciBpc1I2OSA9ICFnZW9tZXRyeS5pbmRleCAmJiB0eXBlb2YgZ2VvbWV0cnkuc2V0SW5kZXggIT09ICdmdW5jdGlvbidcbiAgdmFyIGF0dHJpYiA9IGlzUjY5ID8gZ2VvbWV0cnkuZ2V0QXR0cmlidXRlKCdpbmRleCcpIDogZ2VvbWV0cnkuaW5kZXhcbiAgdmFyIG5ld0F0dHJpYiA9IHVwZGF0ZUF0dHJpYnV0ZShhdHRyaWIsIGRhdGEsIGl0ZW1TaXplLCBkdHlwZSlcbiAgaWYgKG5ld0F0dHJpYikge1xuICAgIGlmIChpc1I2OSkgZ2VvbWV0cnkuYWRkQXR0cmlidXRlKCdpbmRleCcsIG5ld0F0dHJpYilcbiAgICBlbHNlIGdlb21ldHJ5LmluZGV4ID0gbmV3QXR0cmliXG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0QXR0cmlidXRlIChnZW9tZXRyeSwga2V5LCBkYXRhLCBpdGVtU2l6ZSwgZHR5cGUpIHtcbiAgaWYgKHR5cGVvZiBpdGVtU2l6ZSAhPT0gJ251bWJlcicpIGl0ZW1TaXplID0gM1xuICBpZiAodHlwZW9mIGR0eXBlICE9PSAnc3RyaW5nJykgZHR5cGUgPSAnZmxvYXQzMidcbiAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkgJiZcbiAgICBBcnJheS5pc0FycmF5KGRhdGFbMF0pICYmXG4gICAgZGF0YVswXS5sZW5ndGggIT09IGl0ZW1TaXplKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOZXN0ZWQgdmVydGV4IGFycmF5IGhhcyB1bmV4cGVjdGVkIHNpemU7IGV4cGVjdGVkICcgK1xuICAgICAgaXRlbVNpemUgKyAnIGJ1dCBmb3VuZCAnICsgZGF0YVswXS5sZW5ndGgpXG4gIH1cblxuICB2YXIgYXR0cmliID0gZ2VvbWV0cnkuZ2V0QXR0cmlidXRlKGtleSlcbiAgdmFyIG5ld0F0dHJpYiA9IHVwZGF0ZUF0dHJpYnV0ZShhdHRyaWIsIGRhdGEsIGl0ZW1TaXplLCBkdHlwZSlcbiAgaWYgKG5ld0F0dHJpYikge1xuICAgIGdlb21ldHJ5LmFkZEF0dHJpYnV0ZShrZXksIG5ld0F0dHJpYilcbiAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVBdHRyaWJ1dGUgKGF0dHJpYiwgZGF0YSwgaXRlbVNpemUsIGR0eXBlKSB7XG4gIGRhdGEgPSBkYXRhIHx8IFtdXG4gIGlmICghYXR0cmliIHx8IHJlYnVpbGRBdHRyaWJ1dGUoYXR0cmliLCBkYXRhLCBpdGVtU2l6ZSkpIHtcbiAgICAvLyBjcmVhdGUgYSBuZXcgYXJyYXkgd2l0aCBkZXNpcmVkIHR5cGVcbiAgICBkYXRhID0gZmxhdHRlbihkYXRhLCBkdHlwZSlcblxuICAgIHZhciBuZWVkc05ld0J1ZmZlciA9IGF0dHJpYiAmJiB0eXBlb2YgYXR0cmliLnNldEFycmF5ICE9PSAnZnVuY3Rpb24nXG4gICAgaWYgKCFhdHRyaWIgfHwgbmVlZHNOZXdCdWZmZXIpIHtcbiAgICAgIC8vIFdlIGFyZSBvbiBhbiBvbGQgdmVyc2lvbiBvZiBUaHJlZUpTIHdoaWNoIGNhbid0XG4gICAgICAvLyBzdXBwb3J0IGdyb3dpbmcgLyBzaHJpbmtpbmcgYnVmZmVycywgc28gd2UgbmVlZFxuICAgICAgLy8gdG8gYnVpbGQgYSBuZXcgYnVmZmVyXG4gICAgICBpZiAobmVlZHNOZXdCdWZmZXIgJiYgIXdhcm5lZCkge1xuICAgICAgICB3YXJuZWQgPSB0cnVlXG4gICAgICAgIGNvbnNvbGUud2FybihbXG4gICAgICAgICAgJ0EgV2ViR0wgYnVmZmVyIGlzIGJlaW5nIHVwZGF0ZWQgd2l0aCBhIG5ldyBzaXplIG9yIGl0ZW1TaXplLCAnLFxuICAgICAgICAgICdob3dldmVyIHRoaXMgdmVyc2lvbiBvZiBUaHJlZUpTIG9ubHkgc3VwcG9ydHMgZml4ZWQtc2l6ZSBidWZmZXJzLicsXG4gICAgICAgICAgJ1xcblRoZSBvbGQgYnVmZmVyIG1heSBzdGlsbCBiZSBrZXB0IGluIG1lbW9yeS5cXG4nLFxuICAgICAgICAgICdUbyBhdm9pZCBtZW1vcnkgbGVha3MsIGl0IGlzIHJlY29tbWVuZGVkIHRoYXQgeW91IGRpc3Bvc2UgJyxcbiAgICAgICAgICAneW91ciBnZW9tZXRyaWVzIGFuZCBjcmVhdGUgbmV3IG9uZXMsIG9yIHVwZGF0ZSB0byBUaHJlZUpTIHI4MiBvciBuZXdlci5cXG4nLFxuICAgICAgICAgICdTZWUgaGVyZSBmb3IgZGlzY3Vzc2lvbjpcXG4nLFxuICAgICAgICAgICdodHRwczovL2dpdGh1Yi5jb20vbXJkb29iL3RocmVlLmpzL3B1bGwvOTYzMSdcbiAgICAgICAgXS5qb2luKCcnKSlcbiAgICAgIH1cblxuICAgICAgLy8gQnVpbGQgYSBuZXcgYXR0cmlidXRlXG4gICAgICBhdHRyaWIgPSBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKGRhdGEsIGl0ZW1TaXplKTtcbiAgICB9XG5cbiAgICBhdHRyaWIuaXRlbVNpemUgPSBpdGVtU2l6ZVxuICAgIGF0dHJpYi5uZWVkc1VwZGF0ZSA9IHRydWVcblxuICAgIC8vIE5ldyB2ZXJzaW9ucyBvZiBUaHJlZUpTIHN1Z2dlc3QgdXNpbmcgc2V0QXJyYXlcbiAgICAvLyB0byBjaGFuZ2UgdGhlIGRhdGEuIEl0IHdpbGwgdXNlIGJ1ZmZlckRhdGEgaW50ZXJuYWxseSxcbiAgICAvLyBzbyB5b3UgY2FuIGNoYW5nZSB0aGUgYXJyYXkgc2l6ZSB3aXRob3V0IGFueSBpc3N1ZXNcbiAgICBpZiAodHlwZW9mIGF0dHJpYi5zZXRBcnJheSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYXR0cmliLnNldEFycmF5KGRhdGEpXG4gICAgfVxuXG4gICAgcmV0dXJuIGF0dHJpYlxuICB9IGVsc2Uge1xuICAgIC8vIGNvcHkgZGF0YSBpbnRvIHRoZSBleGlzdGluZyBhcnJheVxuICAgIGZsYXR0ZW4oZGF0YSwgYXR0cmliLmFycmF5KVxuICAgIGF0dHJpYi5uZWVkc1VwZGF0ZSA9IHRydWVcbiAgICByZXR1cm4gbnVsbFxuICB9XG59XG5cbi8vIFRlc3Qgd2hldGhlciB0aGUgYXR0cmlidXRlIG5lZWRzIHRvIGJlIHJlLWNyZWF0ZWQsXG4vLyByZXR1cm5zIGZhbHNlIGlmIHdlIGNhbiByZS11c2UgaXQgYXMtaXMuXG5mdW5jdGlvbiByZWJ1aWxkQXR0cmlidXRlIChhdHRyaWIsIGRhdGEsIGl0ZW1TaXplKSB7XG4gIGlmIChhdHRyaWIuaXRlbVNpemUgIT09IGl0ZW1TaXplKSByZXR1cm4gdHJ1ZVxuICBpZiAoIWF0dHJpYi5hcnJheSkgcmV0dXJuIHRydWVcbiAgdmFyIGF0dHJpYkxlbmd0aCA9IGF0dHJpYi5hcnJheS5sZW5ndGhcbiAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkgJiYgQXJyYXkuaXNBcnJheShkYXRhWzBdKSkge1xuICAgIC8vIFsgWyB4LCB5LCB6IF0gXVxuICAgIHJldHVybiBhdHRyaWJMZW5ndGggIT09IGRhdGEubGVuZ3RoICogaXRlbVNpemVcbiAgfSBlbHNlIHtcbiAgICAvLyBbIHgsIHksIHogXVxuICAgIHJldHVybiBhdHRyaWJMZW5ndGggIT09IGRhdGEubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG4iLCJ2YXIgbmV3bGluZSA9IC9cXG4vXG52YXIgbmV3bGluZUNoYXIgPSAnXFxuJ1xudmFyIHdoaXRlc3BhY2UgPSAvXFxzL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRleHQsIG9wdCkge1xuICAgIHZhciBsaW5lcyA9IG1vZHVsZS5leHBvcnRzLmxpbmVzKHRleHQsIG9wdClcbiAgICByZXR1cm4gbGluZXMubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgcmV0dXJuIHRleHQuc3Vic3RyaW5nKGxpbmUuc3RhcnQsIGxpbmUuZW5kKVxuICAgIH0pLmpvaW4oJ1xcbicpXG59XG5cbm1vZHVsZS5leHBvcnRzLmxpbmVzID0gZnVuY3Rpb24gd29yZHdyYXAodGV4dCwgb3B0KSB7XG4gICAgb3B0ID0gb3B0fHx7fVxuXG4gICAgLy96ZXJvIHdpZHRoIHJlc3VsdHMgaW4gbm90aGluZyB2aXNpYmxlXG4gICAgaWYgKG9wdC53aWR0aCA9PT0gMCAmJiBvcHQubW9kZSAhPT0gJ25vd3JhcCcpIFxuICAgICAgICByZXR1cm4gW11cblxuICAgIHRleHQgPSB0ZXh0fHwnJ1xuICAgIHZhciB3aWR0aCA9IHR5cGVvZiBvcHQud2lkdGggPT09ICdudW1iZXInID8gb3B0LndpZHRoIDogTnVtYmVyLk1BWF9WQUxVRVxuICAgIHZhciBzdGFydCA9IE1hdGgubWF4KDAsIG9wdC5zdGFydHx8MClcbiAgICB2YXIgZW5kID0gdHlwZW9mIG9wdC5lbmQgPT09ICdudW1iZXInID8gb3B0LmVuZCA6IHRleHQubGVuZ3RoXG4gICAgdmFyIG1vZGUgPSBvcHQubW9kZVxuXG4gICAgdmFyIG1lYXN1cmUgPSBvcHQubWVhc3VyZSB8fCBtb25vc3BhY2VcbiAgICBpZiAobW9kZSA9PT0gJ3ByZScpXG4gICAgICAgIHJldHVybiBwcmUobWVhc3VyZSwgdGV4dCwgc3RhcnQsIGVuZCwgd2lkdGgpXG4gICAgZWxzZVxuICAgICAgICByZXR1cm4gZ3JlZWR5KG1lYXN1cmUsIHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoLCBtb2RlKVxufVxuXG5mdW5jdGlvbiBpZHhPZih0ZXh0LCBjaHIsIHN0YXJ0LCBlbmQpIHtcbiAgICB2YXIgaWR4ID0gdGV4dC5pbmRleE9mKGNociwgc3RhcnQpXG4gICAgaWYgKGlkeCA9PT0gLTEgfHwgaWR4ID4gZW5kKVxuICAgICAgICByZXR1cm4gZW5kXG4gICAgcmV0dXJuIGlkeFxufVxuXG5mdW5jdGlvbiBpc1doaXRlc3BhY2UoY2hyKSB7XG4gICAgcmV0dXJuIHdoaXRlc3BhY2UudGVzdChjaHIpXG59XG5cbmZ1bmN0aW9uIHByZShtZWFzdXJlLCB0ZXh0LCBzdGFydCwgZW5kLCB3aWR0aCkge1xuICAgIHZhciBsaW5lcyA9IFtdXG4gICAgdmFyIGxpbmVTdGFydCA9IHN0YXJ0XG4gICAgZm9yICh2YXIgaT1zdGFydDsgaTxlbmQgJiYgaTx0ZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaHIgPSB0ZXh0LmNoYXJBdChpKVxuICAgICAgICB2YXIgaXNOZXdsaW5lID0gbmV3bGluZS50ZXN0KGNocilcblxuICAgICAgICAvL0lmIHdlJ3ZlIHJlYWNoZWQgYSBuZXdsaW5lLCB0aGVuIHN0ZXAgZG93biBhIGxpbmVcbiAgICAgICAgLy9PciBpZiB3ZSd2ZSByZWFjaGVkIHRoZSBFT0ZcbiAgICAgICAgaWYgKGlzTmV3bGluZSB8fCBpPT09ZW5kLTEpIHtcbiAgICAgICAgICAgIHZhciBsaW5lRW5kID0gaXNOZXdsaW5lID8gaSA6IGkrMVxuICAgICAgICAgICAgdmFyIG1lYXN1cmVkID0gbWVhc3VyZSh0ZXh0LCBsaW5lU3RhcnQsIGxpbmVFbmQsIHdpZHRoKVxuICAgICAgICAgICAgbGluZXMucHVzaChtZWFzdXJlZClcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGluZVN0YXJ0ID0gaSsxXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGxpbmVzXG59XG5cbmZ1bmN0aW9uIGdyZWVkeShtZWFzdXJlLCB0ZXh0LCBzdGFydCwgZW5kLCB3aWR0aCwgbW9kZSkge1xuICAgIC8vQSBncmVlZHkgd29yZCB3cmFwcGVyIGJhc2VkIG9uIExpYkdEWCBhbGdvcml0aG1cbiAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS9saWJnZHgvbGliZ2R4L2Jsb2IvbWFzdGVyL2dkeC9zcmMvY29tL2JhZGxvZ2ljL2dkeC9ncmFwaGljcy9nMmQvQml0bWFwRm9udENhY2hlLmphdmFcbiAgICB2YXIgbGluZXMgPSBbXVxuXG4gICAgdmFyIHRlc3RXaWR0aCA9IHdpZHRoXG4gICAgLy9pZiAnbm93cmFwJyBpcyBzcGVjaWZpZWQsIHdlIG9ubHkgd3JhcCBvbiBuZXdsaW5lIGNoYXJzXG4gICAgaWYgKG1vZGUgPT09ICdub3dyYXAnKVxuICAgICAgICB0ZXN0V2lkdGggPSBOdW1iZXIuTUFYX1ZBTFVFXG5cbiAgICB3aGlsZSAoc3RhcnQgPCBlbmQgJiYgc3RhcnQgPCB0ZXh0Lmxlbmd0aCkge1xuICAgICAgICAvL2dldCBuZXh0IG5ld2xpbmUgcG9zaXRpb25cbiAgICAgICAgdmFyIG5ld0xpbmUgPSBpZHhPZih0ZXh0LCBuZXdsaW5lQ2hhciwgc3RhcnQsIGVuZClcblxuICAgICAgICAvL2VhdCB3aGl0ZXNwYWNlIGF0IHN0YXJ0IG9mIGxpbmVcbiAgICAgICAgd2hpbGUgKHN0YXJ0IDwgbmV3TGluZSkge1xuICAgICAgICAgICAgaWYgKCFpc1doaXRlc3BhY2UoIHRleHQuY2hhckF0KHN0YXJ0KSApKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBzdGFydCsrXG4gICAgICAgIH1cblxuICAgICAgICAvL2RldGVybWluZSB2aXNpYmxlICMgb2YgZ2x5cGhzIGZvciB0aGUgYXZhaWxhYmxlIHdpZHRoXG4gICAgICAgIHZhciBtZWFzdXJlZCA9IG1lYXN1cmUodGV4dCwgc3RhcnQsIG5ld0xpbmUsIHRlc3RXaWR0aClcblxuICAgICAgICB2YXIgbGluZUVuZCA9IHN0YXJ0ICsgKG1lYXN1cmVkLmVuZC1tZWFzdXJlZC5zdGFydClcbiAgICAgICAgdmFyIG5leHRTdGFydCA9IGxpbmVFbmQgKyBuZXdsaW5lQ2hhci5sZW5ndGhcblxuICAgICAgICAvL2lmIHdlIGhhZCB0byBjdXQgdGhlIGxpbmUgYmVmb3JlIHRoZSBuZXh0IG5ld2xpbmUuLi5cbiAgICAgICAgaWYgKGxpbmVFbmQgPCBuZXdMaW5lKSB7XG4gICAgICAgICAgICAvL2ZpbmQgY2hhciB0byBicmVhayBvblxuICAgICAgICAgICAgd2hpbGUgKGxpbmVFbmQgPiBzdGFydCkge1xuICAgICAgICAgICAgICAgIGlmIChpc1doaXRlc3BhY2UodGV4dC5jaGFyQXQobGluZUVuZCkpKVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIGxpbmVFbmQtLVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxpbmVFbmQgPT09IHN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKG5leHRTdGFydCA+IHN0YXJ0ICsgbmV3bGluZUNoYXIubGVuZ3RoKSBuZXh0U3RhcnQtLVxuICAgICAgICAgICAgICAgIGxpbmVFbmQgPSBuZXh0U3RhcnQgLy8gSWYgbm8gY2hhcmFjdGVycyB0byBicmVhaywgc2hvdyBhbGwuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5leHRTdGFydCA9IGxpbmVFbmRcbiAgICAgICAgICAgICAgICAvL2VhdCB3aGl0ZXNwYWNlIGF0IGVuZCBvZiBsaW5lXG4gICAgICAgICAgICAgICAgd2hpbGUgKGxpbmVFbmQgPiBzdGFydCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzV2hpdGVzcGFjZSh0ZXh0LmNoYXJBdChsaW5lRW5kIC0gbmV3bGluZUNoYXIubGVuZ3RoKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBsaW5lRW5kLS1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpbmVFbmQgPj0gc3RhcnQpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBtZWFzdXJlKHRleHQsIHN0YXJ0LCBsaW5lRW5kLCB0ZXN0V2lkdGgpXG4gICAgICAgICAgICBsaW5lcy5wdXNoKHJlc3VsdClcbiAgICAgICAgfVxuICAgICAgICBzdGFydCA9IG5leHRTdGFydFxuICAgIH1cbiAgICByZXR1cm4gbGluZXNcbn1cblxuLy9kZXRlcm1pbmVzIHRoZSB2aXNpYmxlIG51bWJlciBvZiBnbHlwaHMgd2l0aGluIGEgZ2l2ZW4gd2lkdGhcbmZ1bmN0aW9uIG1vbm9zcGFjZSh0ZXh0LCBzdGFydCwgZW5kLCB3aWR0aCkge1xuICAgIHZhciBnbHlwaHMgPSBNYXRoLm1pbih3aWR0aCwgZW5kLXN0YXJ0KVxuICAgIHJldHVybiB7XG4gICAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAgICAgZW5kOiBzdGFydCtnbHlwaHNcbiAgICB9XG59IiwibW9kdWxlLmV4cG9ydHMgPSBleHRlbmRcblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuZnVuY3Rpb24gZXh0ZW5kKCkge1xuICAgIHZhciB0YXJnZXQgPSB7fVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXVxuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXRcbn1cbiJdfQ==
