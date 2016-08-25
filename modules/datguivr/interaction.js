import Emitter from 'events';

/*

  This is some horrible state machine I'm sorry to have written.
  Please rewrite this.

*/

export default function createInteraction( guiState, object ){
  const interactionBounds = new THREE.Box3();
  interactionBounds.setFromObject( object );

  const events = new Emitter();

  let wasHover = false;
  let hover = false;
  let wasPressed = false;
  let press = false;
  let wasGripped = false;
  let grip = false;

  function update( inputObjects ){
    wasPressed = press;
    wasGripped = grip;

    interactionBounds.setFromObject( object );

    inputObjects.forEach( function( set ){
      if( interactionBounds.intersectsBox( set.box ) && guiState.currentInteraction === undefined && ( guiState.currentHover === undefined || guiState.currentHover === interaction ) ){
        hover = true;
        guiState.currentHover = interaction;
      }
      else {
        hover = false
        if( guiState.currentHover === interaction ){
          guiState.currentHover = undefined;
        }
      }

      if( (hover && set.object.pressed) || (guiState.currentInteraction === interaction && set.object.pressed) ){
        press = true;
        guiState.currentInteraction = interaction;
      }
      else{
        press = false
      }

      if( (hover && set.object.gripped) || (guiState.currentInteraction === interaction && set.object.gripped) ){
        grip = true;
        guiState.currentInteraction = interaction;
      }
      else{
        grip = false
      }

      updateAgainst( set );

      if( !( press || grip ) && guiState.currentInteraction === interaction ){
        guiState.currentInteraction = undefined;
        if( wasPressed ){
          events.emit( 'releasePress', object );
        }
        if( wasGripped ){
          events.emit( 'releaseGrip', object );
        }
      }
    });
  }

  function updateAgainst( set ){
    const { object:otherObject, box } = set;

    if( press ){
      let intersectionPoint = interactionBounds.intersect( box ).center();
      if( isNaN( intersectionPoint.x ) ){
        intersectionPoint = box.center();
      }

      events.emit( 'pressed', object, box, intersectionPoint, otherObject );

      if( wasPressed === false && press === true ){
        events.emit( 'onPressed', object, box, intersectionPoint, otherObject );
      }
    }

    if( grip ){
      let intersectionPoint = interactionBounds.intersect( box ).center();
      if( isNaN( intersectionPoint.x ) ){
        intersectionPoint = box.center();
      }

      events.emit( 'gripped', object, box, intersectionPoint, otherObject );

      if( wasGripped === false && grip === true ){
        events.emit( 'onGrip', object, box, intersectionPoint, otherObject );
      }
    }
  }

  const interaction = {
    hovering: ()=>hover,
    pressing: ()=>press,
    update,
    events
  };

  return interaction;
}