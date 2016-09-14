import createInteraction from './interaction';

export function create( { group, panel } = {} ){

  const interaction = createInteraction( panel );

  interaction.events.on( 'onPressed', handleOnGrip );
  interaction.events.on( 'onReleased', handleReleaseGrip );

  const tempMatrix = new THREE.Matrix4();

  let oldParent;

  function handleOnGrip( {inputObject}={} ){

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

  function handleReleaseGrip( {inputObject}={} ){
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