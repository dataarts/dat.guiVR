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
import * as SharedMaterials from './sharedmaterials';
import * as Grab from './grab';

export default function createCheckbox( {
  textCreator,
  object,
  propertyName = 'undefined',
  initialValue = false,
  width = Layout.PANEL_WIDTH,
  height = Layout.PANEL_HEIGHT,
  depth = Layout.PANEL_DEPTH
} = {} ){

  const CHECKBOX_WIDTH = height - Layout.PANEL_MARGIN;
  const CHECKBOX_HEIGHT = CHECKBOX_WIDTH;
  const CHECKBOX_DEPTH = depth;

  const INACTIVE_SCALE = 0.001;
  const ACTIVE_SCALE = 0.9;

  const state = {
    value: initialValue,
    listen: false
  };

  const group = new THREE.Group();

  const panel = Layout.createPanel( width, height, depth );
  group.add( panel );

  //  base checkbox
  const rect = new THREE.BoxGeometry( CHECKBOX_WIDTH, CHECKBOX_HEIGHT, CHECKBOX_DEPTH );
  rect.translate( CHECKBOX_WIDTH * 0.5, 0, 0 );


  //  hitscan volume
  const hitscanMaterial = new THREE.MeshBasicMaterial();
  hitscanMaterial.visible = false;

  const hitscanVolume = new THREE.Mesh( rect.clone(), hitscanMaterial );
  hitscanVolume.position.z = depth;
  hitscanVolume.position.x = width * 0.5;

  //  outline volume
  const outline = new THREE.BoxHelper( hitscanVolume );
  outline.material.color.setHex( Colors.OUTLINE_COLOR );

  //  checkbox volume
  const material = new THREE.MeshPhongMaterial({ color: Colors.DEFAULT_COLOR, emissive: Colors.EMISSIVE_COLOR });
  const filledVolume = new THREE.Mesh( rect.clone(), material );
  filledVolume.scale.set( ACTIVE_SCALE, ACTIVE_SCALE,ACTIVE_SCALE );
  hitscanVolume.add( filledVolume );


  const descriptorLabel = textCreator.create( propertyName );
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  const controllerID = Layout.createControllerIDBox( height, Colors.CONTROLLER_ID_CHECKBOX );
  controllerID.position.z = depth;

  panel.add( descriptorLabel, hitscanVolume, outline, controllerID );

  // group.add( filledVolume, outline, hitscanVolume, descriptorLabel );

  const interaction = createInteraction( hitscanVolume );
  interaction.events.on( 'onPressed', handleOnPress );

  updateView();

  function handleOnPress(){
    if( group.visible === false ){
      return;
    }

    state.value = !state.value;

    object[ propertyName ] = state.value;

    if( onChangedCB ){
      onChangedCB( state.value );
    }
  }

  function updateView(){

    if( interaction.hovering() ){
      material.color.setHex( Colors.HIGHLIGHT_COLOR );
      material.emissive.setHex( Colors.HIGHLIGHT_EMISSIVE_COLOR );
    }
    else{
      material.emissive.setHex( Colors.EMISSIVE_COLOR );

      if( state.value ){
        material.color.setHex( Colors.DEFAULT_COLOR );
      }
      else{
        material.color.setHex( Colors.INACTIVE_COLOR );
      }
    }

    if( state.value ){
      filledVolume.scale.set( ACTIVE_SCALE, ACTIVE_SCALE, ACTIVE_SCALE );
    }
    else{
      filledVolume.scale.set( INACTIVE_SCALE, INACTIVE_SCALE, INACTIVE_SCALE );
    }

  }

  let onChangedCB;
  let onFinishChangeCB;

  group.onChange = function( callback ){
    onChangedCB = callback;
    return group;
  };

  group.interaction = interaction;
  group.hitscan = [ hitscanVolume, panel ];

  const grabInteraction = Grab.create( { group, panel } );

  group.listen = function(){
    state.listen = true;
    return group;
  };

  group.update = function( inputObjects ){
    if( state.listen ){
      state.value = object[ propertyName ];
    }
    interaction.update( inputObjects );
    grabInteraction.update( inputObjects );
    updateView();
  };


  return group;
}