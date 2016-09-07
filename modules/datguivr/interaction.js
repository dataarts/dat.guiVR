import Emitter from 'events';

export default function createInteraction( guiState, hitVolume ){
  const events = new Emitter();

  const state = {
    hover: false,
    pressed: false,
    gripped: false,
  };

  function isMainInteraction(){
    return ( guiState.currentInteraction === interaction );
  }

  function hasMainInteraction(){
    return ( guiState.currentInteraction !== undefined );
  }

  function setMainInteraction(){
    guiState.currentInteraction = interaction;
  }

  function clearMainInteraction(){
    guiState.currentInteraction = undefined;
  }

  const tVector = new THREE.Vector3();

  function update( inputObjects ){

    state.hover = false;

    inputObjects.forEach( function( input ){
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

      if( hasMainInteraction() === false && hitVolume === hitObject ){
        state.hover = true;
      }

      let used = performStateEvents( input, hitObject, hitPoint, 'pressed', 'onPressed', 'pressing', 'onReleased' );
      used = used || performStateEvents( input, hitObject, hitPoint, 'gripped', 'onGripped', 'gripping', 'onReleaseGrip' );

      if( used === false && isMainInteraction() ){
        clearMainInteraction();
      }

    });

  }

  function performStateEvents( input, hitObject, hitPoint, stateToCheck, clickName, holdName, releaseName ){
    if( input[ stateToCheck ] && state.hover && hasMainInteraction() === false ){
      if( state[ stateToCheck ] === false ){
        state[ stateToCheck ] = true;
        setMainInteraction();

        events.emit( clickName, {
          hitObject,
          inputObject: input.object,
          point: hitPoint,
        });
      }
    }

    if( input[ stateToCheck ] === false && isMainInteraction() ){
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
    }

    return state[ stateToCheck ];

  }

  const interaction = {
    hovering: ()=>state.hover,
    pressing: ()=>state.pressed,
    update,
    events
  };

  return interaction;
}