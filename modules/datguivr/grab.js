import createInteraction from './interaction';

export function create( { group, panel } = {} ){

  const interaction = createInteraction( panel );

  interaction.events.on( 'onPressed', handleOnPress );
  interaction.events.on( 'onReleased', handleOnRelease );

  const tempMatrix = new THREE.Matrix4();

  let oldParent;

  function handleOnPress( {inputObject}={} ){

    const folder = group.folder;
    if( folder === undefined ){
      return;
    }

    tempMatrix.getInverse( inputObject.matrixWorld );

    folder.matrix.premultiply( tempMatrix );
    folder.matrix.decompose( folder.position, folder.quaternion, folder.scale );

    oldParent = folder.parent;
    inputObject.add( folder );

  }

  function handleOnRelease( {inputObject}={} ){
    const folder = group.folder;
    if( folder === undefined ){
      return;
    }
    if( oldParent === undefined ){
      return;
    }
    folder.matrix.premultiply( inputObject.matrixWorld );
    folder.matrix.decompose( folder.position, folder.quaternion, folder.scale );
    oldParent.add( folder );
    oldParent = undefined;
  }

  return interaction;
}