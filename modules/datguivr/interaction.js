import Emitter from 'events';

export default function createInteraction( hitVolume ){
  const events = new Emitter();

  const states = new WeakMap();

  let anyHover = false;
  let anyPressing = false;

  // const state = {
  //   hover: false,
  //   pressed: false,
  //   gripped: false,
  // };

  function isMainInteraction( guiState ){
    return ( guiState.currentInteraction === interaction );
  }

  function hasMainInteraction( guiState ){
    return ( guiState.currentInteraction !== undefined );
  }

  function setMainInteraction( guiState ){
    guiState.currentInteraction = interaction;
  }

  function clearMainInteraction( guiState ){
    guiState.currentInteraction = undefined;
  }

  const tVector = new THREE.Vector3();

  function update( inputObjects ){

    anyHover = false;
    anyPressing = false;

    inputObjects.forEach( function( input ){

      let state = states.get( input );
      if( state === undefined ){
        states.set( input, {
          hover: false,
          pressed: false,
          gripped: false,
        });
        state = states.get( input );
      }

      state.lastHover = state.hover;
      state.hover = false;

      let hitPoint;
      let hitObject;

      if( input.intersections.length <= 0 ){
        state.hover = false;
        hitPoint = tVector.setFromMatrixPosition( input.cursor.matrixWorld ).clone();
        hitObject = input.cursor;
      }
      else{
        hitPoint = input.intersections[ 0 ].point;
        hitObject = input.intersections[ 0 ].object;
      }

      if( hasMainInteraction( input.state ) === false && hitVolume === hitObject ){
        state.hover = true;
        anyHover = true;
      }

      let used = performStateEvents( input, state, hitObject, hitPoint, 'pressed', 'onPressed', 'pressing', 'onReleased' );
      used = used || performStateEvents( input, state, hitObject, hitPoint, 'gripped', 'onGripped', 'gripping', 'onReleaseGrip' );

      if( used === false && isMainInteraction(  input.state  ) ){
        clearMainInteraction( input.state );
      }

    });

  }

  function performStateEvents( input, state, hitObject, hitPoint, stateToCheck, clickName, holdName, releaseName ){
    if( input[ stateToCheck ] && state.hover && hasMainInteraction( input.state ) === false ){
      if( state[ stateToCheck ] === false ){
        state[ stateToCheck ] = true;
        setMainInteraction( input.state );

        events.emit( clickName, {
          hitObject,
          inputObject: input.object,
          point: hitPoint,
        });

      }
    }

    if( input[ stateToCheck ] === false && isMainInteraction( input.state ) ){
      state[ stateToCheck ] = false;
      events.emit( releaseName, {
        hitObject,
        inputObject: input.object,
        point: hitPoint,
      });
    }

    if( state[ stateToCheck ] ){
      events.emit( holdName, {
        hitObject,
        inputObject: input.object,
        point: hitPoint,
      });

      anyPressing = true;

      input.state.events.emit( 'onControllerHeld', input );
    }

    return state[ stateToCheck ];

  }

  const interaction = {
    hovering: ()=>anyHover,
    pressing: ()=>anyPressing,
    update,
    events
  };

  return interaction;
}