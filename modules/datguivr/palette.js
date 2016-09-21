import createInteraction from './interaction';

export function create( { group, panel } = {} ){

  const interaction = createInteraction( panel );

  interaction.events.on( 'onGripped', handleOnGrip );
  interaction.events.on( 'onReleaseGrip', handleOnGripRelease );

  let oldParent;
  let oldPosition = new THREE.Vector3();

  function handleOnGrip( {inputObject}={} ){

    console.log('gripping');
    const folder = group.folder;
    if( folder === undefined ){
      return;
    }

    oldPosition.copy( folder.position );
    folder.position.set( 0,0,0 );

    oldParent = folder.parent;
    inputObject.add( folder );

  }

  function handleOnGripRelease( {inputObject}={} ){

    console.log('releasing grip');
    const folder = group.folder;
    if( folder === undefined ){
      return;
    }
    if( oldParent === undefined ){
      return;
    }

    oldParent.add( folder );
    oldParent = undefined;
  }

  return interaction;
}