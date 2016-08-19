import Emitter from 'events';

export default function createInteraction( guiState, object ){
  const interactionBounds = new THREE.Box3();
  interactionBounds.setFromObject( object );

  const events = new Emitter();

  let hover = false;
  let press = false;

  function update( inputObjects ){
    interactionBounds.setFromObject( object );
    inputObjects.forEach( function( set ){
      if( interactionBounds.intersectsBox( set.box ) && guiState.currentInteraction === undefined ){
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
      updateAgainst( set.box );

      if( !press && guiState.currentInteraction === interaction ){
        guiState.currentInteraction = undefined;
      }
    });
  }

  function updateAgainst( box ){
    if( press ){
      let intersectionPoint = interactionBounds.intersect( box ).center();
      if( isNaN( intersectionPoint.x ) ){
        intersectionPoint = box.center();
      }

      events.emit( 'pressed', object, box, intersectionPoint );
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