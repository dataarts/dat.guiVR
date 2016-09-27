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

import Emitter from 'events';
import createSlider from './slider';
import createCheckbox from './checkbox';
import createButton from './button';
import createFolder from './folder';
import createDropdown from './dropdown';
import * as SDFText from './sdftext';
import * as Font from './font';

export default function DATGUIVR(){

  /*
    SDF font
  */
  const textCreator = SDFText.creator();


  /*
    Lists.
    InputObjects are things like VIVE controllers, cardboard headsets, etc.
    Controllers are the DAT GUI sliders, checkboxes, etc.
    HitscanObjects are anything raycasts will hit-test against.
  */
  const inputObjects = [];
  const controllers = [];
  const hitscanObjects = [];

  let mouseEnabled = false;

  function setMouseEnabled( flag ){
    mouseEnabled = flag;
  }




  /*
    The default laser pointer coming out of each InputObject.
  */
  const laserMaterial = new THREE.LineBasicMaterial({color:0x55aaff, transparent: true, blending: THREE.AdditiveBlending });
  function createLaser(){
    const g = new THREE.Geometry();
    g.vertices.push( new THREE.Vector3() );
    g.vertices.push( new THREE.Vector3(0,0,0) );
    return new THREE.Line( g, laserMaterial );
  }





  /*
    A "cursor", eg the ball that appears at the end of your laser.
  */
  const cursorMaterial = new THREE.MeshBasicMaterial({color:0x444444, transparent: true, blending: THREE.AdditiveBlending } );
  function createCursor(){
    return new THREE.Mesh( new THREE.SphereGeometry(0.006, 4, 4 ), cursorMaterial );
  }




  /*
    Creates a generic Input type.
    Takes any THREE.Object3D type object and uses its position
    and orientation as an input device.

    A laser pointer is included and will be updated.
    Contains state about which Interaction is currently being used or hover.
  */
  function createInput( inputObject = new THREE.Group() ){
    return {
      raycast: new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3() ),
      laser: createLaser(),
      cursor: createCursor(),
      object: inputObject,
      pressed: false,
      gripped: false,
      events: new Emitter(),
      interaction: {
        grip: undefined,
        press: undefined
      }
    };
  }





  /*
    MouseInput is a special input type that is on by default.
    Allows you to click on the screen when not in VR for debugging.
  */
  const mouseInput = createMouseInput();

  function createMouseInput(){
    const mouse = new THREE.Vector2(-1,-1);

    window.addEventListener( 'mousemove', function( event ){
      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }, false );

    window.addEventListener( 'mousedown', function( event ){
      input.pressed = true;
    }, false );

    window.addEventListener( 'mouseup', function( event ){
      input.pressed = false;
    }, false );

    const input = createInput();
    input.mouse = mouse;
    return input;
  }





  /*
    Public function users run to give DAT GUI an input device.
    Automatically detects for ViveController and binds buttons + haptic feedback.

    Returns a laser pointer so it can be directly added to scene.

    The laser will then have two methods:
    laser.pressed(), laser.gripped()

    These can then be bound to any button the user wants. Useful for binding to
    cardboard or alternate input devices.

    For example...
      document.addEventListener( 'mousedown', function(){ laser.pressed( true ); } );
  */
  function addInputObject( object ){
    const input = createInput( object );

    input.laser.add( input.cursor );

    input.laser.pressed = function( flag ){
      input.pressed = flag;
    };

    input.laser.gripped = function( flag ){
      input.gripped = flag;
    };

    input.laser.cursor = input.cursor;

    if( THREE.ViveController && object instanceof THREE.ViveController ){
      bindViveController( input, object, input.laser.pressed, input.laser.gripped );
    }

    inputObjects.push( input );

    return input.laser;
  }




  /*
    Here are the main dat gui controller types.
  */

  function addSlider( object, propertyName, min = 0.0, max = 100.0 ){
    const slider = createSlider( {
      textCreator, propertyName, object, min, max,
      initialValue: object[ propertyName ]
    });

    controllers.push( slider );
    hitscanObjects.push( ...slider.hitscan )

    return slider;
  }

  function addCheckbox( object, propertyName ){
    const checkbox = createCheckbox({
      textCreator, propertyName, object,
      initialValue: object[ propertyName ]
    });

    controllers.push( checkbox );
    hitscanObjects.push( ...checkbox.hitscan )

    return checkbox;
  }

  function addButton( object, propertyName ){
    const button = createButton({
      textCreator, propertyName, object
    });

    controllers.push( button );
    hitscanObjects.push( ...button.hitscan );
    return button;
  }

  function addDropdown( object, propertyName, options ){
    const dropdown = createDropdown({
      textCreator, propertyName, object, options
    });

    controllers.push( dropdown );
    hitscanObjects.push( ...dropdown.hitscan );
    return dropdown;
  }





  /*
    An implicit Add function which detects for property type
    and gives you the correct controller.

    Dropdown:
      add( object, propertyName, objectType )

    Slider:
      add( object, propertyOfNumberType, min, max )

    Checkbox:
      add( object, propertyOfBooleanType )

    Button:
      add( object, propertyOfFunctionType )
  */

  function add( object, propertyName, arg3, arg4 ){

    if( object === undefined ){
      console.warn( 'object is undefined' );
      return new THREE.Group();
    }
    else
    if( object[ propertyName ] === undefined ){
      console.warn( 'no property named', propertyName, 'on object', object );
      return new THREE.Group();
    }

    if( isObject( arg3 ) || isArray( arg3 ) ){
      return addDropdown( object, propertyName, arg3 );
    }

    if( isNumber( object[ propertyName] ) ){
      return addSlider( object, propertyName, arg3, arg4 );
    }

    if( isBoolean( object[ propertyName] ) ){
      return addCheckbox( object, propertyName );
    }

    if( isFunction( object[ propertyName ] ) ){
      return addButton( object, propertyName );
    }

    //  add couldn't figure it out, so at least add something THREE understands
    return new THREE.Group();
  }




  /*
    Creates a folder with the name.

    Folders are THREE.Group type objects and can do group.add() for siblings.
    Folders will automatically attempt to lay its children out in sequence.
  */

  function addFolder( name ){
    const folder = createFolder({
      textCreator,
      name
    });

    controllers.push( folder );
    if( folder.hitscan ){
      hitscanObjects.push( ...folder.hitscan );
    }

    return folder;
  }





  /*
    Perform the necessary updates, raycasts on its own RAF.
  */

  const tPosition = new THREE.Vector3();
  const tDirection = new THREE.Vector3( 0, 0, -1 );
  const tMatrix = new THREE.Matrix4();

  function update() {
    requestAnimationFrame( update );

    if( mouseEnabled ){
      mouseInput.intersections = performMouseInput( hitscanObjects, mouseInput );
    }

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
      parseIntersections( intersections, laser, cursor );

      inputObjects[ index ].intersections = intersections;
    });

    const inputs = inputObjects.slice();

    if( mouseEnabled ){
      inputs.push( mouseInput );
    }

    controllers.forEach( function( controller ){
      controller.update( inputs );
    });
  }

  function parseIntersections( intersections, laser, cursor ){
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
  }

  function performMouseInput( hitscanObjects, {box,object,raycast,laser,cursor,mouse} = {} ){
    raycast.setFromCamera( mouse, camera );
    const intersections = raycast.intersectObjects( hitscanObjects, false );
    parseIntersections( intersections, laser, cursor );
    return intersections;
  }

  update();





  /*
    Public methods.
  */

  return {
    addInputObject,
    add,
    addFolder,
    setMouseEnabled
  };

}



/*
  Set to global scope if exporting as a standalone.
*/

if( window ){
  window.DATGUIVR = DATGUIVR;
}




/*
  Bunch of state-less utility functions.
*/

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

//  only {} objects not arrays
//                    which are technically objects but you're just being pedantic
function isObject (item) {
  return (typeof item === 'object' && !Array.isArray(item) && item !== null);
}

function isArray( o ){
  return Array.isArray( o );
}







/*
  Controller-specific support.
*/

function bindViveController( input, controller, pressed, gripped ){
  controller.addEventListener( 'triggerdown', ()=>pressed( true ) );
  controller.addEventListener( 'triggerup', ()=>pressed( false ) );
  controller.addEventListener( 'gripsdown', ()=>gripped( true ) );
  controller.addEventListener( 'gripsup', ()=>gripped( false ) );

  const gamepad = controller.getGamepad();
  function vibrate( t, a ){
    if( gamepad && gamepad.haptics.length > 0 ){
      gamepad.haptics[ 0 ].vibrate( t, a );
    }
  }

  function hapticsTap(){
    setIntervalTimes( (x,t,a)=>vibrate(1-a, 0.5), 10, 20 );
  }

  function hapticsEcho(){
    setIntervalTimes( (x,t,a)=>vibrate(4, 1.0 * (1-a)), 100, 4 );
  }

  input.events.on( 'onControllerHeld', function( input ){
    vibrate( 0.3, 0.3 );
  });

  input.events.on( 'grabbed', function(){
    hapticsTap();
  });

  input.events.on( 'grabReleased', function(){
    hapticsEcho();
  });

  input.events.on( 'pinned', function(){
    hapticsTap();
  });

  input.events.on( 'pinReleased', function(){
    hapticsEcho();
  });



}

function setIntervalTimes( cb, delay, times ){
  let x = 0;
  let id = setInterval( function(){
    cb( x, times, x/times );
    x++;
    if( x>=times ){
      clearInterval( id );
    }
  }, delay );
  return id;
}