import createTextLabel from './textlabel';
import createInteraction from './interaction';
import * as Colors from './colors';
import * as Layout from './layout';
import * as SharedMaterials from './sharedmaterials';
import * as Grab from './grab';

export default function createFolder({
  textCreator,
  name
} = {} ){

  const width = Layout.PANEL_WIDTH;

  const spacingPerController = Layout.PANEL_HEIGHT + Layout.PANEL_SPACING;

  const state = {
    collapsed: false,
    previousParent: undefined
  };

  const group = new THREE.Group();
  const collapseGroup = new THREE.Group();
  group.add( collapseGroup );

  //  Yeah. Gross.
  const addOriginal = THREE.Group.prototype.add;
  addOriginal.call( group, collapseGroup );

  const descriptorLabel = createTextLabel( textCreator, '- ' + name, 0.6 );
  descriptorLabel.position.y = Layout.PANEL_HEIGHT * 0.5;

  addOriginal.call( group, descriptorLabel );

  const panel = new THREE.Mesh( new THREE.BoxGeometry( width, 1, Layout.PANEL_DEPTH ), SharedMaterials.FOLDER );
  panel.geometry.translate( width * 0.5, 0, -Layout.PANEL_DEPTH );
  addOriginal.call( group, panel );

  // const interactionVolume = new THREE.Mesh( new THREE.BoxGeometry( width, 1, Layout.PANEL_DEPTH ), new THREE.MeshBasicMaterial({color:0x000000}) );
  // interactionVolume.geometry.translate( width * 0.5 - Layout.PANEL_MARGIN, 0, -Layout.PANEL_DEPTH );
  // addOriginal.call( group, interactionVolume );
  // interactionVolume.visible = false;

  const interaction = createInteraction( panel );
  // interaction.events.on( 'onPressed', handlePress );

  function handlePress(){
    state.collapsed = !state.collapsed;
    performLayout();
  }

  group.add = function( ...args ){
    args.forEach( function( obj ){
      const container = new THREE.Group();
      container.add( obj );
      collapseGroup.add( container );
      obj.folder = group;
    });

    performLayout();
  };

  function performLayout(){
    collapseGroup.children.forEach( function( child, index ){
      child.position.y = -(index+1) * spacingPerController + Layout.PANEL_HEIGHT * 0.5;
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

    const totalHeight = collapseGroup.children.length * spacingPerController;
    panel.geometry = new THREE.BoxGeometry( width, totalHeight, Layout.PANEL_DEPTH );
    panel.geometry.translate( width * 0.5, -totalHeight * 0.5, -Layout.PANEL_DEPTH );
    panel.geometry.computeBoundingBox();
  }

  function updateLabel(){
    // if( interaction.hovering() ){
    //   descriptorLabel.back.material.color.setHex( Colors.HIGHLIGHT_BACK );
    // }
    // else{
      // descriptorLabel.back.material.color.setHex( Colors.DEFAULT_BACK );
    // }
  }

  group.folder = group;
  const grabInteraction = Grab.create( { group, panel: descriptorLabel.back } );

  group.update = function( inputObjects ){
    interaction.update( inputObjects );
    grabInteraction.update( inputObjects );
    updateLabel();
  };

  group.pinTo = function( newParent ){
    const oldParent = group.parent;

    if( group.parent ){
      group.parent.remove( group );
    }
    newParent.add( group );

    return oldParent;
  };

  group.hitscan = [ panel, descriptorLabel.back ];

  return group;
}