import loadFont from 'load-bmfont';
import Emitter from 'events';

import createSlider from './slider';
import createCheckbox from './checkbox';
import createButton from './button';
import createFolder from './folder';
import * as SDFText from './sdftext';

export default function DATGUIVR(){

  const textMaterial = SDFText.createMaterial();

  const inputObjects = [];
  const controllers = [];
  const hitscanObjects = [];

  const events = new Emitter();
  events.setMaxListeners( 100 );

  const DEFAULT_FNT = 'fonts/lucidasansunicode.fnt';

  const guiState = {
    currentHover: undefined,
    currentInteraction: undefined,
    events: new Emitter()
  };

  loadFont( DEFAULT_FNT, function( err, font ){
    if( err ){
      console.warn( err );
    }
    events.emit( 'fontLoaded', font );
  });

  const textCreator = SDFText.creator( textMaterial, events );

  const cursorMaterial = new THREE.MeshBasicMaterial({color:0x444444, transparent: true, blending: THREE.AdditiveBlending } );

  function createCursor(){
    return new THREE.Mesh( new THREE.SphereGeometry(0.006, 4, 4 ), cursorMaterial );
  }

  const laserMaterial = new THREE.LineBasicMaterial({color:0x55aaff, transparent: true, blending: THREE.AdditiveBlending });
  function createLaser(){
    const g = new THREE.Geometry();
    g.vertices.push( new THREE.Vector3() );
    g.vertices.push( new THREE.Vector3(0,0,0) );

    return new THREE.Line( g, laserMaterial );
  }

  function addInputObject( object ){
    const input = {
      raycast: new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3() ),
      laser: createLaser(),
      cursor: createCursor(),
      object,
      pressed: false,
      gripped: false
    };

    input.laser.add( input.cursor );

    input.laser.pressed = function( flag ){
      input.pressed = flag;
    };

    input.laser.gripped = function( flag ){
      input.gripped = flag;
    };

    if( THREE.ViveController && object instanceof THREE.ViveController ){
      bindViveController( guiState, object, input.laser.pressed, input.laser.gripped );
    }

    inputObjects.push( input );

    return input.laser;
  }

  function addSlider( object, propertyName, min = 0.0, max = 100.0 ){
    const slider = createSlider( {
      guiState, textCreator, propertyName, object, min, max,
      initialValue: object[ propertyName ]
    });

    controllers.push( slider );
    hitscanObjects.push( ...slider.hitscan )

    return slider;
  }

  function addCheckbox( object, propertyName ){
    const checkbox = createCheckbox({
      guiState, textCreator, propertyName, object,
      initialValue: object[ propertyName ]
    });

    controllers.push( checkbox );
    hitscanObjects.push( ...checkbox.hitscan )

    return checkbox;
  }

  function addButton( object, propertyName ){
    const button = createButton({
      guiState, textCreator, propertyName, object
    });

    controllers.push( button );
    hitscanObjects.push( ...button.hitscan );
    return button;
  }

  function add( object, propertyName, min, max ){

    if( object === undefined ){
      console.warn( 'object is undefined' );
      return new THREE.Group();
    }
    else
    if( object[ propertyName ] === undefined ){
      console.warn( 'no property named', propertyName, 'on object', object );
      return new THREE.Group();
    }


    if( isNumber( object[ propertyName] ) ){
      return addSlider( object, propertyName, min, max );
    }

    if( isBoolean( object[ propertyName] ) ){
      return addCheckbox( object, propertyName );
    }

    if( isFunction( object[ propertyName ] ) ){
      return addButton( object, propertyName );
    }
  }

  function addFolder( name ){
    const folder = createFolder({
      guiState, textCreator,
      name
    });

    controllers.push( folder );
    if( folder.hitscan ){
      hitscanObjects.push( ...folder.hitscan );
    }

    return folder;
  }

  const tPosition = new THREE.Vector3();
  const tDirection = new THREE.Vector3( 0, 0, -1 );
  const tMatrix = new THREE.Matrix4();

  function update() {
    requestAnimationFrame( update );

    inputObjects.forEach( function( {box,object,raycast,laser,cursor} = {}, index ){
      object.updateMatrixWorld();

      tPosition.set(0,0,0).setFromMatrixPosition( object.matrixWorld );
      tMatrix.identity().extractRotation( object.matrixWorld );
      tDirection.set(0,0,-1).applyMatrix4( tMatrix ).normalize();

      raycast.set( tPosition, tDirection );

      laser.geometry.vertices[ 0 ].copy( tPosition );

      //  debug...
      // laser.geometry.vertices[ 1 ].copy( tPosition ).add( tDirection.multiplyScalar( 1 ) );

      const intersections = raycast.intersectObjects( hitscanObjects, false );
      if( intersections.length > 0 ){
        const firstHit = intersections[ 0 ];
        laser.geometry.vertices[ 1 ].copy( firstHit.point );
        laser.visible = true;
        laser.geometry.computeBoundingSphere();
        laser.geometry.computeBoundingBox();
        laser.geometry.verticesNeedUpdate = true;
        cursor.position.copy( firstHit.point );
        cursor.visible = true;
      }
      else{
        laser.visible = false;
        cursor.visible = false;
      }

      inputObjects[ index ].intersections = intersections;
    });

    controllers.forEach( function( controller ){
      controller.update( inputObjects );
    });
  }

  update();

  return {
    addInputObject,
    add,
    addFolder
  };

}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isBoolean(n){
  return typeof n === 'boolean';
}

function isFunction(functionToCheck) {
  const getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function bindViveController( guiState, controller, pressed, gripped ){
  controller.addEventListener( 'triggerdown', ()=>pressed( true ) );
  controller.addEventListener( 'triggerup', ()=>pressed( false ) );
  controller.addEventListener( 'gripsdown', ()=>gripped( true ) );
  controller.addEventListener( 'gripsup', ()=>gripped( false ) );

  const gamepad = controller.getGamepad();
  if( gamepad.haptics.length > 0 ){
    guiState.events.on( 'onControllerHeld', function( input ){
      if( input.object === controller ){
        gamepad.haptics[ 0 ].vibrate( 0.3, 0.3 );
      }
    });
  }
}

if( window ){
  window.DATGUIVR = DATGUIVR;
}