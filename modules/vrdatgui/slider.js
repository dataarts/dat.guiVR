import createTextLabel from './textlabel';

const DEFAULT_COLOR = 0x2FA1D6;
const HIGHLIGHT_COLOR = 0x40BDF7;
const INTERACTION_COLOR = 0xBDE8FC;
const EMISSIVE_COLOR = 0x222222;

export default function createSlider( {
  textCreator,
  object,
  propertyName = 'undefined',
  initialValue = 0.0,
  min, max,
  width = 4
} = {} ){


  const group = new THREE.Group();

  //  filled volume
  const rect = new THREE.BoxGeometry( 0.1, 0.1, 0.03, 1, 1, 1 );
  rect.applyMatrix( new THREE.Matrix4().makeTranslation( -0.05, 0, 0 ) );

  const material = new THREE.MeshPhongMaterial({ color: DEFAULT_COLOR, emissive: EMISSIVE_COLOR });
  const filledVolume = new THREE.Mesh( rect, material );
  filledVolume.scale.x = width;


  //  outline volume
  const outlineMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const outlineMesh = new THREE.Mesh( rect, outlineMaterial );
  outlineMesh.scale.x = width;
  outlineMesh.visible = false;

  const outline = new THREE.BoxHelper( outlineMesh );
  outline.material.color.setHex( 0x999999 );

  const endLocator = new THREE.Mesh( new THREE.BoxGeometry( 0.05, 0.05, 0.1, 1, 1, 1 ), new THREE.MeshBasicMaterial( {color: 0xffffff} ) );
  endLocator.position.x = -0.1 * width;
  endLocator.visible = false;


  const descriptorLabel = createTextLabel( textCreator, propertyName );
  descriptorLabel.position.x = 0.03;

  const valueLabel = createTextLabel( textCreator, initialValue.toFixed(2) );
  valueLabel.position.x = 0.03;
  valueLabel.position.y = -0.05;

  group.add( filledVolume, outline, outlineMesh, endLocator, descriptorLabel, valueLabel );



  const boundingBox = new THREE.Box3();

  const state = {
    alpha: 1.0,
    value: initialValue,
    hover: false,
    press: false
  };

  state.alpha = map_range( initialValue, min, max, 0.0, 1.0 );
  filledVolume.scale.x = state.alpha * width;

  group.update = function( inputObjects ){
    boundingBox.setFromObject( outlineMesh );
    inputObjects.forEach( function( set ){
      if( boundingBox.intersectsBox( set.box ) ){
        state.hover = true;
      }
      else {
        state.hover = false
      }

      if( state.hover && set.object.pressed ){
        state.press = true;
      }
      else{
        state.press = false
      }

      update( set.box );
    });


    updateView();

  };


  function update( box ){
    if( state.press && state.hover ){

      filledVolume.updateMatrixWorld();
      endLocator.updateMatrixWorld();

      const a = new THREE.Vector3().setFromMatrixPosition( filledVolume.matrixWorld );
      const b = new THREE.Vector3().setFromMatrixPosition( endLocator.matrixWorld );

      const intersectionPoint = boundingBox.intersect( box ).center();
      const pointAlpha = getPointAlpha( intersectionPoint, {a,b} );
      state.alpha = pointAlpha;

      filledVolume.scale.x = state.alpha * width;

      state.value = map_range( state.alpha, 0.0, 1.0, min, max );
      if( state.value < min ){
        state.value = min;
      }
      if( state.value > max ){
        state.value = max;
      }

      object[ propertyName ] = state.value;

      valueLabel.setNumber( state.value );

      if( onChangedCB ){
        onChangedCB( state.value );
      }
    }
  }

  function updateView(){
    if( state.press ){
      material.color.setHex( INTERACTION_COLOR );
    }
    else
    if( state.hover ){
      material.color.setHex( HIGHLIGHT_COLOR );
    }
    else{
      material.color.setHex( DEFAULT_COLOR );
    }
  }

  let onChangedCB;
  let onFinishChangeCB;

  group.onChanged = function( callback ){
    onChangedCB = callback;
    return group;
  };


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