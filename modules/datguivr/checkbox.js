import createTextLabel from './textlabel';
import createInteraction from './interaction';
import * as Colors from './colors';


export default function createCheckbox( {
  guiState,
  textCreator,
  object,
  propertyName = 'undefined',
  initialValue = false
} = {} ){

  const INACTIVE_SCALE = 0.25;
  const ACTIVE_SCALE = 0.9;

  const state = {
    value: initialValue
  };

  const group = new THREE.Group();

  //  filled volume
  const rect = new THREE.BoxGeometry( 0.1, 0.1, 0.1, 1, 1, 1 );

  const material = new THREE.MeshPhongMaterial({ color: Colors.DEFAULT_COLOR, emissive: Colors.EMISSIVE_COLOR });
  const filledVolume = new THREE.Mesh( rect, material );
  filledVolume.scale.set( ACTIVE_SCALE, ACTIVE_SCALE,ACTIVE_SCALE );
  filledVolume.position.x = -0.05;

  //  outline volume
  const hitscanVolume = new THREE.Mesh( rect );
  hitscanVolume.visible = false;
  hitscanVolume.position.x = -0.05;

  const outline = new THREE.BoxHelper( hitscanVolume );
  outline.material.color.setHex( Colors.OUTLINE_COLOR );

  const descriptorLabel = createTextLabel( textCreator, propertyName );
  descriptorLabel.position.x = 0.03;
  descriptorLabel.position.z = 0.05 - 0.015;

  group.add( filledVolume, outline, hitscanVolume, descriptorLabel );

  const interaction = createInteraction( guiState, hitscanVolume );
  interaction.events.on( 'onPressed', handleOnPress );

  updateView();

  group.update = function( inputObjects ){
    interaction.update( inputObjects );
    updateView();
  };

  function handleOnPress( interactionObject, other, intersectionPoint ){
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

  return group;
}