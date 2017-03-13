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

import * as Colors from './colors';
import * as SharedMaterials from './sharedmaterials';

export default function createTextLabel( textCreator, str, width = 0.4, depth = 0.029, fgColor = 0xffffff, bgColor = Colors.DEFAULT_BACK, scale = 1.0 ){

  const group = new THREE.Group();
  const internalPositioning = new THREE.Group();
  group.add( internalPositioning );

  const text = textCreator.create( str, { color: fgColor, scale } );
  internalPositioning.add( text );


  group.setString = function( str ){
    text.updateLabel( str.toString() );
  };

  group.setNumber = function( str ){
    text.updateLabel( str.toFixed(2) );
  };

  text.position.z = depth;

  const backBounds = 0.01;
  const margin = 0.01;
  const totalWidth = width;
  const totalHeight = 0.04 + margin * 2;
  const labelBackGeometry = new THREE.BoxGeometry( totalWidth, totalHeight, depth, 1, 1, 1 );
  labelBackGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( totalWidth * 0.5 - margin, 0, 0 ) );

  const labelBackMesh = new THREE.Mesh( labelBackGeometry, SharedMaterials.PANEL );
  Colors.colorizeGeometry( labelBackMesh.geometry, bgColor );

  labelBackMesh.position.y = 0.03;
  internalPositioning.add( labelBackMesh );
  internalPositioning.position.y = -totalHeight * 0.5;

  group.back = labelBackMesh;

  return group;
}