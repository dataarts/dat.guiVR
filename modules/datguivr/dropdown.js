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

export default function createCheckbox( {
  textCreator,
  object,
  propertyName = 'undefined',
  initialValue = false,
  options = [],
  width = Layout.PANEL_WIDTH,
  height = Layout.PANEL_HEIGHT,
  depth = Layout.PANEL_DEPTH
} = {} ){


  const state = {
    open: false,
    listen: false
  };

  const DROPDOWN_WIDTH = width * 0.5 - Layout.PANEL_MARGIN;
  const DROPDOWN_HEIGHT = height - Layout.PANEL_MARGIN;
  const DROPDOWN_DEPTH = depth;
  const DROPDOWN_OPTION_HEIGHT = height - Layout.PANEL_MARGIN * 1.2;
  const DROPDOWN_MARGIN = Layout.PANEL_MARGIN * -0.4;

  const group = new THREE.Group();

  const panel = Layout.createPanel( width, height, depth );
  group.add( panel );

  group.hitscan = [ panel ];

  const labelInteractions = [];
  const optionLabels = [];

  //  find actually which label is selected
  const initialLabel = findLabelFromProp();



  function findLabelFromProp(){
    if( Array.isArray( options ) ){
      return options.find( function( optionName ){
        return optionName === object[ propertyName ]
      });
    }
    else{
      return Object.keys(options).find( function( optionName ){
        return object[propertyName] === options[ optionName ];
      });
    }
  }

  function createOption( labelText, isOption ){
    const label = createTextLabel(
      textCreator, labelText,
      DROPDOWN_WIDTH, depth,
      Colors.DROPDOWN_FG_COLOR, Colors.DROPDOWN_BG_COLOR,
      0.866
    );

    group.hitscan.push( label.back );
    const labelInteraction = createInteraction( label.back );
    labelInteractions.push( labelInteraction );
    optionLabels.push( label );


    if( isOption ){
      labelInteraction.events.on( 'onPressed', function( p ){
        selectedLabel.setString( labelText );

        let propertyChanged = false;

        if( Array.isArray( options ) ){
          propertyChanged = object[ propertyName ] !== labelText;
          if( propertyChanged ){
            object[ propertyName ] = labelText;
          }
        }
        else{
          propertyChanged = object[ propertyName ] !== options[ labelText ];
          if( propertyChanged ){
            object[ propertyName ] = options[ labelText ];
          }
        }


        collapseOptions();
        state.open = false;

        if( onChangedCB && propertyChanged ){
          onChangedCB( object[ propertyName ] );
        }

        p.locked = true;

      });
    }
    else{
      labelInteraction.events.on( 'onPressed', function( p ){
        if( state.open === false ){
          openOptions();
          state.open = true;
        }
        else{
          collapseOptions();
          state.open = false;
        }

        p.locked = true;
      });
    }
    label.isOption = isOption;
    return label;
  }

  function collapseOptions(){
    optionLabels.forEach( function( label ){
      if( label.isOption ){
        label.visible = false;
        label.back.visible = false;
      }
    });
  }

  function openOptions(){
    optionLabels.forEach( function( label ){
      if( label.isOption ){
        label.visible = true;
        label.back.visible = true;
      }
    });
  }

  //  base option
  const selectedLabel = createOption( initialLabel, false );
  selectedLabel.position.x = Layout.PANEL_MARGIN * 0.5 + width * 0.5;
  selectedLabel.position.z = depth;

  const downArrow = Graphic.downArrow();
  // Colors.colorizeGeometry( downArrow.geometry, Colors.DROPDOWN_FG_COLOR );
  downArrow.position.set( DROPDOWN_WIDTH - 0.04, 0, depth * 1.01 );
  selectedLabel.add( downArrow );


  function configureLabelPosition( label, index ){
    label.position.y = -DROPDOWN_MARGIN - (index+1) * ( DROPDOWN_OPTION_HEIGHT );
    label.position.z = depth;
  }

  function optionToLabel( optionName, index ){
    const optionLabel = createOption( optionName, true );
    configureLabelPosition( optionLabel, index );
    return optionLabel;
  }

  if( Array.isArray( options ) ){
    selectedLabel.add( ...options.map( optionToLabel ) );
  }
  else{
    selectedLabel.add( ...Object.keys(options).map( optionToLabel ) );
  }


  collapseOptions();

  const descriptorLabel = textCreator.create( propertyName );
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  const controllerID = Layout.createControllerIDBox( height, Colors.CONTROLLER_ID_DROPDOWN );
  controllerID.position.z = depth;


  const borderBox = Layout.createPanel( DROPDOWN_WIDTH + Layout.BORDER_THICKNESS, DROPDOWN_HEIGHT + Layout.BORDER_THICKNESS * 0.5, DROPDOWN_DEPTH, true );
  borderBox.material.color.setHex( 0x1f7ae7 );
  borderBox.position.x = -Layout.BORDER_THICKNESS * 0.5 + width * 0.5;
  borderBox.position.z = depth * 0.5;

  panel.add( descriptorLabel, controllerID, selectedLabel, borderBox );


  updateView();

  function updateView(){

    labelInteractions.forEach( function( interaction, index ){
      const label = optionLabels[ index ];
      if( label.isOption ){
        if( interaction.hovering() ){
          Colors.colorizeGeometry( label.back.geometry, Colors.HIGHLIGHT_COLOR );
        }
        else{
          Colors.colorizeGeometry( label.back.geometry, Colors.DROPDOWN_BG_COLOR );
        }
      }
    });

    if( labelInteractions[0].hovering() || state.open ){
      borderBox.visible = true;
    }
    else{
      borderBox.visible = false;
    }
  }

  let onChangedCB;
  let onFinishChangeCB;

  group.onChange = function( callback ){
    onChangedCB = callback;
    return group;
  };

  const grabInteraction = Grab.create( { group, panel } );

  group.listen = function(){
    state.listen = true;
    return group;
  };

  group.updateControl = function( inputObjects ){
    if( state.listen ){
      selectedLabel.setString( findLabelFromProp() );
    }
    labelInteractions.forEach( function( labelInteraction ){
      labelInteraction.update( inputObjects );
    });
    grabInteraction.update( inputObjects );
    updateView();
  };

  group.name = function( str ){
    descriptorLabel.update( str );
    return group;
  };


  return group;
}