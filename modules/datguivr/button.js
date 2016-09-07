import createTextLabel from './textlabel';
import createInteraction from './interaction';
import * as Colors from './colors';
import * as Layout from './layout';
import * as SharedMaterials from './sharedmaterials';
import * as Grab from './grab';

export default function createCheckbox( {
  guiState,
  textCreator,
  object,
  propertyName = 'undefined',
  width = Layout.PANEL_WIDTH,
  height = Layout.PANEL_HEIGHT,
  depth = Layout.PANEL_DEPTH
} = {} ){

  const BUTTON_WIDTH = width * 0.5 - Layout.PANEL_MARGIN;
  const BUTTON_HEIGHT = height - Layout.PANEL_MARGIN;
  const BUTTON_DEPTH = depth;

  const group = new THREE.Group();

  const panel = Layout.createPanel( width, height, depth );
  group.add( panel );

  //  base checkbox
  const rect = new THREE.BoxGeometry( BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_DEPTH );
  rect.translate( BUTTON_WIDTH * 0.5, 0, 0 );

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
  hitscanVolume.add( filledVolume );


  const descriptorLabel = textCreator.create( propertyName );
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  const controllerID = Layout.createControllerIDBox( height, Colors.CONTROLLER_ID_BUTTON );
  controllerID.position.z = depth;

  panel.add( descriptorLabel, hitscanVolume, outline, controllerID );

  const interaction = createInteraction( guiState, hitscanVolume );
  interaction.events.on( 'onPressed', handleOnPress );

  updateView();

  function handleOnPress(){
    if( group.visible === false ){
      return;
    }

    object[ propertyName ]();
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

  }

  group.interaction = interaction;
  group.hitscan = [ hitscanVolume, panel ];

  const grabInteraction = Grab.create( { group, panel, guiState } );

  group.update = function( inputObjects ){
    interaction.update( inputObjects );
    grabInteraction.update( inputObjects );
    updateView();
  };


  return group;
}