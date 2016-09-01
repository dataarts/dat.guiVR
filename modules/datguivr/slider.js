import createTextLabel from './textlabel';
import createInteraction from './interaction';
import * as Colors from './colors';
import * as Layout from './layout';
import * as SharedMaterials from './sharedmaterials';

export default function createSlider( {
  guiState,
  textCreator,
  object,
  propertyName = 'undefined',
  initialValue = 0.0,
  min, max,
  width = Layout.PANEL_WIDTH,
  height = Layout.PANEL_HEIGHT,
  depth = Layout.PANEL_DEPTH
} = {} ){


  const SLIDER_WIDTH = width * 0.5 - Layout.PANEL_MARGIN;
  const SLIDER_HEIGHT = height - Layout.PANEL_MARGIN;
  const SLIDER_DEPTH = depth;

  const state = {
    alpha: 1.0,
    value: initialValue,
    step: 3
  };

  state.value = state.value.toFixed( state.step-1 );
  state.alpha = map_range( initialValue, min, max, 0.0, 1.0 );


  const group = new THREE.Group();

  //  filled volume
  const rect = new THREE.BoxGeometry( SLIDER_WIDTH, SLIDER_HEIGHT, SLIDER_DEPTH );
  rect.translate(SLIDER_WIDTH*0.5,0,0);
  // Layout.alignLeft( rect );


  const hitscanMaterial = new THREE.MeshBasicMaterial();
  hitscanMaterial.visible = false;

  //  outline volume
  const hitscanVolume = new THREE.Mesh( rect.clone(), hitscanMaterial );
  hitscanVolume.position.z = depth;
  hitscanVolume.position.x = width * 0.5;

  const outline = new THREE.BoxHelper( hitscanVolume );
  outline.material.color.setHex( Colors.OUTLINE_COLOR );

  const material = new THREE.MeshPhongMaterial({ color: Colors.DEFAULT_COLOR, emissive: Colors.EMISSIVE_COLOR });
  const filledVolume = new THREE.Mesh( rect.clone(), material );
  hitscanVolume.add( filledVolume );

  const endLocator = new THREE.Mesh( new THREE.BoxGeometry( 0.05, 0.05, 0.05, 1, 1, 1 ), SharedMaterials.LOCATOR );
  endLocator.position.x = SLIDER_WIDTH;
  hitscanVolume.add( endLocator );
  endLocator.visible = false;

  const valueLabel = textCreator.create( state.value.toString() );
  valueLabel.position.x = Layout.PANEL_VALUE_TEXT_MARGIN + width * 0.5;
  valueLabel.position.z = depth*2;
  valueLabel.position.y = -0.03;
  updateValueLabel( state.value );



  const descriptorLabel = textCreator.create( propertyName );
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  const controllerID = Layout.createControllerIDBox( height, Colors.CONTROLLER_ID_SLIDER );
  controllerID.position.z = depth;

  const panel = Layout.createPanel( width, height, depth );
  panel.add( descriptorLabel, hitscanVolume, outline, valueLabel, controllerID );

  group.add( panel )


  filledVolume.scale.x = 0.5;//state.alpha * width;

  const interaction = createInteraction( guiState, hitscanVolume );
  interaction.events.on( 'pressing', handlePress );

  group.update = function( inputObjects ){
    interaction.update( inputObjects );
    updateView();
  };

  function handlePress( { point } = {} ){
    if( group.visible === false ){
      return;
    }

    filledVolume.updateMatrixWorld();
    endLocator.updateMatrixWorld();

    const a = new THREE.Vector3().setFromMatrixPosition( filledVolume.matrixWorld );
    const b = new THREE.Vector3().setFromMatrixPosition( endLocator.matrixWorld );

    const pointAlpha = getPointAlpha( point, {a,b} );
    state.alpha = pointAlpha;

    filledVolume.scale.x = Math.max( state.alpha * width, 0.000001 );

    state.value = map_range( state.alpha, 0.0, 1.0, min, max );
    if( state.value < min ){
      state.value = min;
    }
    if( state.value > max ){
      state.value = max;
    }

    state.value = parseFloat( state.value.toFixed( state.step-1 ) );

    object[ propertyName ] = state.value;

    updateValueLabel( state.value );

    if( onChangedCB ){
      onChangedCB( state.value );
    }
  }

  function updateValueLabel( value ){
    valueLabel.update( parseFloat( value ).toString() );
  }

  function updateView(){
    if( interaction.pressing() ){
      material.color.setHex( Colors.INTERACTION_COLOR );
    }
    else
    if( interaction.hovering() ){
      material.color.setHex( Colors.HIGHLIGHT_COLOR );
      material.emissive.setHex( Colors.HIGHLIGHT_EMISSIVE_COLOR );
    }
    else{
      material.color.setHex( Colors.DEFAULT_COLOR );
      material.emissive.setHex( Colors.EMISSIVE_COLOR );
    }
  }

  let onChangedCB;
  let onFinishChangeCB;

  group.onChange = function( callback ){
    onChangedCB = callback;
    return group;
  };

  group.step = function( stepCount ){
    state.step = stepCount;
    return group;
  };

  group.interaction = interaction;
  group.hitscan = [ hitscanVolume, panel ];

  return group;
}

function getPointAlpha( point, segment ){
  const a = new THREE.Vector3().copy( segment.b ).sub( segment.a );
  const b = new THREE.Vector3().copy( point ).sub( segment.a );
  const projected = b.projectOnVector( a );

  const length = segment.a.distanceTo( segment.b );

  let alpha = projected.length() / length;
  if( alpha > 1.0 ){
    alpha = 1.0;
  }
  if( alpha < 0.0 ){
    alpha = 0.0;
  }
  return alpha;
}

function lerp(min, max, value) {
  return (1-value)*min + value*max;
}

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}