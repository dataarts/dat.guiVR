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

import * as SharedMaterials from './sharedmaterials';
import * as Colors from './colors';

export function alignLeft( obj ){
  if( obj instanceof THREE.Mesh ){
    obj.geometry.computeBoundingBox();
    const width = obj.geometry.boundingBox.max.x - obj.geometry.boundingBox.max.y;
    obj.geometry.translate( width, 0, 0 );
    return obj;
  }
  else if( obj instanceof THREE.Geometry ){
    obj.computeBoundingBox();
    const width = obj.boundingBox.max.x - obj.boundingBox.max.y;
    obj.translate( width, 0, 0 );
    return obj;
  }
}

export function createPanel( width, height, depth ){
  const panel = new THREE.Mesh( new THREE.BoxGeometry( width, height, depth ), SharedMaterials.PANEL );
  panel.geometry.translate( width * 0.5, 0, 0 );
  Colors.colorizeGeometry( panel.geometry, Colors.DEFAULT_BACK );
  return panel;
}

export function createControllerIDBox( height, color ){
  const panel = new THREE.Mesh( new THREE.BoxGeometry( CONTROLLER_ID_WIDTH, height, CONTROLLER_ID_DEPTH ), SharedMaterials.PANEL );
  panel.geometry.translate( CONTROLLER_ID_WIDTH * 0.5, 0, 0 );
  Colors.colorizeGeometry( panel.geometry, color );
  return panel;
}

export const PANEL_WIDTH = 1.0;
export const PANEL_HEIGHT = 0.08;
export const PANEL_DEPTH = 0.001;
export const PANEL_SPACING = 0.002;
export const PANEL_MARGIN = 0.015;
export const PANEL_LABEL_TEXT_MARGIN = 0.06;
export const PANEL_VALUE_TEXT_MARGIN = 0.02;
export const CONTROLLER_ID_WIDTH = 0.02;
export const CONTROLLER_ID_DEPTH = 0.001;
export const BUTTON_DEPTH = 0.01;