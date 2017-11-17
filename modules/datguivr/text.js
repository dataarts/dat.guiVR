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

import createTextLabel from './textlabel';
import createInteraction from './interaction';
import * as Colors from './colors';
import * as Layout from './layout';
import * as Graphic from './graphic';
import * as SharedMaterials from './sharedmaterials';
import * as Grab from './grab';

export default function createText( {
  textCreator,
  object,
  propertyName = 'undefined',
  initialValue = false,
  width = Layout.PANEL_WIDTH,
  height = Layout.PANEL_HEIGHT,
  depth = Layout.PANEL_DEPTH
} = {} ){
  const state = {
    value: initialValue,
    listen: false
  };

  const group = new THREE.Group();

  const panel = Layout.createPanel( width, height, depth );
  group.add( panel );

  const descriptorLabel = textCreator.create( propertyName );
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  const controllerID = Layout.createControllerIDBox( height, Colors.CONTROLLER_ID_TEXT );
  controllerID.position.z = depth;

  const valueLabel = textCreator.create( object[propertyName] );
  valueLabel.position.x = width * 0.5;
  valueLabel.position.z = depth;
  valueLabel.position.y = -0.03;

  let lastValue = object[propertyName];


  panel.add( descriptorLabel, controllerID, valueLabel );

  group.hitscan = [];

  group.listen = function(){
    state.listen = true;
    return group;
  };

  group.name = function( str ){
    descriptorLabel.updateLabel( str );
    return group;
  };

  function updateView() {
      if (lastValue != state.value) {
        valueLabel.updateLabel(state.value);
        lastValue = state.value;
      }
  }

  group.updateControl = function( inputObjects ){
    if( state.listen ){
      state.value = object[ propertyName ];
    }
    updateView();
  };

  return group;
}