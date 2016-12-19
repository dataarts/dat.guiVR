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

const GUIVR = (function DATGUIVR(){

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
  let mouseRenderer = undefined;

  function enableMouse( camera, renderer ){
    mouseEnabled = true;
    mouseRenderer = renderer;
    mouseInput.mouseCamera = camera;
    return mouseInput.laser;
  }

  function disableMouse(){
    mouseEnabled = false;
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
    const input = {
      raycast: new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3() ),
      laser: createLaser(),
      cursor: createCursor(),
      object: inputObject,
      pressed: false,
      gripped: false,
      events: new Emitter(),
      interaction: {
        grip: undefined,
        press: undefined,
        hover: undefined
      }
    };

    input.laser.add( input.cursor );

    return input;
  }





  /*
    MouseInput.
    Allows you to click on the screen when not in VR for debugging.
  */
  const mouseInput = createMouseInput();

  function createMouseInput(){
    const mouse = new THREE.Vector2(-1,-1);

    const input = createInput();
    input.mouse = mouse;
    input.mouseIntersection = new THREE.Vector3();
    input.mouseOffset = new THREE.Vector3();
    input.mousePlane = new THREE.Plane();
    input.intersections = [];

    //  set my enableMouse
    input.mouseCamera = undefined;

    window.addEventListener( 'mousemove', function( event ){
      // if a specific renderer has been defined
      if (mouseRenderer) {
        const clientRect = mouseRenderer.domElement.getBoundingClientRect();
        mouse.x = ( (event.clientX - clientRect.left) / clientRect.width) * 2 - 1;
        mouse.y = - ( (event.clientY - clientRect.top) / clientRect.height) * 2 + 1;
      }
      // default to fullscreen
      else {
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      }

    }, false );

    window.addEventListener( 'mousedown', function( event ){
      if (input.intersections.length > 0) {
        // prevent mouse down from triggering other listeners (polyfill, etc)
        event.stopImmediatePropagation();
        input.pressed = true;
      }
    }, false );

    window.addEventListener( 'mouseup', function( event ){
      input.pressed = false;
    }, false );


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

    input.laser.pressed = function( flag ){
      // only pay attention to presses over the GUI
      if (flag && (input.intersections.length > 0)) {
        input.pressed = true;
      } else {
        input.pressed = false;
      }
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

    Not used directly. Used by folders.
  */

  function add( object, propertyName, arg3, arg4 ){

    if( object === undefined ){
      return undefined;
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

    //  add couldn't figure it out, pass it back to folder
    return undefined
  }


  function addSimpleSlider( min = 0, max = 1 ){
    const proxy = {
      number: min
    };

    return addSlider( proxy, 'number', min, max );
  }

  function addSimpleDropdown( options = [] ){
    const proxy = {
      option: ''
    };

    if( options !== undefined ){
      proxy.option = isArray( options ) ? options[ 0 ] : options[ Object.keys(options)[0] ];
    }

    return addDropdown( proxy, 'option', options );
  }

  function addSimpleCheckbox( defaultOption = false ){
    const proxy = {
      checked: defaultOption
    };

    return addCheckbox( proxy, 'checked' );
  }

  function addSimpleButton( fn ){
    const proxy = {
      button: (fn!==undefined) ? fn : function(){}
    };

    return addButton( proxy, 'button' );
  }


  /*
    Creates a folder with the name.

    Folders are THREE.Group type objects and can do group.add() for siblings.
    Folders will automatically attempt to lay its children out in sequence.

    Folders are given the add() functionality so that they can do
    folder.add( ... ) to create controllers.
  */

  function create( name ){
    const folder = createFolder({
      textCreator,
      name,
      guiAdd: add,
      addSlider: addSimpleSlider,
      addDropdown: addSimpleDropdown,
      addCheckbox: addSimpleCheckbox,
      addButton: addSimpleButton
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

  function updateLaser( laser, point ){
    laser.geometry.vertices[ 1 ].copy( point );
    laser.visible = true;
    laser.geometry.computeBoundingSphere();
    laser.geometry.computeBoundingBox();
    laser.geometry.verticesNeedUpdate = true;
  }

  function parseIntersections( intersections, laser, cursor ){
    if( intersections.length > 0 ){
      const firstHit = intersections[ 0 ];
      updateLaser( laser, firstHit.point );
      cursor.position.copy( firstHit.point );
      cursor.visible = true;
      cursor.updateMatrixWorld();
    }
    else{
      laser.visible = false;
      cursor.visible = false;
    }
  }

  function parseMouseIntersection( intersection, laser, cursor ){
    cursor.position.copy( intersection );
    updateLaser( laser, cursor.position );
  }

  function performMouseIntersection( raycast, mouse, camera ){
    raycast.setFromCamera( mouse, camera );
    return raycast.intersectObjects( hitscanObjects, false );
  }

  function mouseIntersectsPlane( raycast, v, plane ){
    return raycast.ray.intersectPlane( plane, v );
  }

  function performMouseInput( hitscanObjects, {box,object,raycast,laser,cursor,mouse,mouseCamera} = {} ){
    let intersections = [];

    if (mouseCamera) {
      intersections = performMouseIntersection( raycast, mouse, mouseCamera );
      parseIntersections( intersections, laser, cursor );
      cursor.visible = true;
      laser.visible = true;
    }

    return intersections;
  }

  update();





  /*
    Public methods.
  */

  return {
    create,
    addInputObject,
    enableMouse,
    disableMouse
  };

}());

if( window ){
  if( window.dat === undefined ){
    window.dat = {};
  }

  window.dat.GUIVR = GUIVR;
}

if( module ){
  module.exports = {
    dat: GUIVR
  };
}

if(typeof define === 'function' && define.amd) {
  define([], GUIVR);
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
    if( gamepad && gamepad.hapticActuators.length > 0 ){
      gamepad.hapticActuators[ 0 ].pulse( t, a );
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