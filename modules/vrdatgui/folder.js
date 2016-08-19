import createTextLabel from './textlabel';
import createInteraction from './interaction';
import * as Colors from './colors';


export default function createFolder({
  guiState,
  textCreator,
  name
} = {} ){
  const group = new THREE.Group();
  const collapseGroup = new THREE.Group();
  group.add( collapseGroup );

  //  Yeah. Gross.
  const addOriginal = THREE.Group.prototype.add;
  addOriginal.call( group, collapseGroup );

  const descriptorLabel = createTextLabel( textCreator, '- ' + name, 0.6 );
  descriptorLabel.position.x = -0.4;
  descriptorLabel.position.y = -0.1;

  group.add( descriptorLabel );

  const interactionVolume = new THREE.BoxHelper( descriptorLabel );
  addOriginal.call( group, interactionVolume );
  interactionVolume.visible = false;

  const interaction = createInteraction( guiState, interactionVolume );
  interaction.events.on( 'onPressed', handlePress );

  interaction.events.on( 'gripped', handleGrip );

  const state = {
    collapsed: false
  };

  function handlePress(){
    state.collapsed = !state.collapsed;
    performLayout();
  }

  group.update = function( inputObjects ){
    interaction.update( inputObjects );
    updateLabel();
  };

  group.add = function( obj ){
    const container = new THREE.Group();
    container.add( obj );
    collapseGroup.add( container );

    performLayout();
  };

  function performLayout(){
    collapseGroup.children.forEach( function( child, index ){
      child.position.y = -(index+1) * 0.15;
      if( state.collapsed ){
        child.children[0].visible = false;
      }
      else{
        child.children[0].visible = true;
      }
    });

    if( state.collapsed ){
      descriptorLabel.setString( '+ ' + name );
    }
    else{
      descriptorLabel.setString( '- ' + name );
    }

  }

  function updateLabel(){
    if( interaction.hovering() ){
      descriptorLabel.back.material.color.setHex( Colors.HIGHLIGHT_BACK );
    }
    else{
      descriptorLabel.back.material.color.setHex( Colors.DEFAULT_BACK );
    }
  }

  const up = new THREE.Vector3( 0, 0, 1 );
  function handleGrip( object, box, intersectionPoint, otherObject ){
    // group.matrix.lookAt( group.position, otherObject.position, up );

    group.position.copy( intersectionPoint );

    // group.rotation.copy( otherObject.parent.rotation );
    // group.quaternion.copy( otherObject.parent.quaternion );
    // group.matrix.compose( group.position, group.quaternion, group.scale );
    // group.matrixNeedsUpdate = true;
    group.matrixWorldNeedsUpdate = true;
    // group.quaternion.copy( otherObject )
  }

  group.pinTo = function( newParent ){
    group.parent.remove( group );
    newParent.add( group );
  };

  return group;
}