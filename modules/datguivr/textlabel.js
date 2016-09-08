import * as Colors from './colors';
import * as SharedMaterials from './sharedmaterials';

export default function createTextLabel( textCreator, str, width = 0.4, depth = 0.029, fgColor = 0xffffff, bgColor = Colors.DEFAULT_BACK ){

  const group = new THREE.Group();
  const internalPositioning = new THREE.Group();
  group.add( internalPositioning );

  const text = textCreator.create( str, { color: fgColor } );
  internalPositioning.add( text );

  group.setString = function( str ){
    text.update( str.toString() );
  };

  group.setNumber = function( str ){
    text.update( str.toFixed(2) );
  };

  text.position.z = 0.015

  const backBounds = 0.01;
  const margin = 0.01;
  const totalWidth = width;
  const totalHeight = 0.04 + margin * 2;
  const labelBackGeometry = new THREE.BoxGeometry( totalWidth, totalHeight, depth, 1, 1, 1 );
  labelBackGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( totalWidth * 0.5 - margin, 0, 0 ) );

  const labelBackMesh = new THREE.Mesh( labelBackGeometry, SharedMaterials.PANEL );
  Colors.colorizeGeometry( labelBackMesh.geometry, bgColor );

  labelBackMesh.position.y = 0.03;
  // labelBackMesh.position.x = width * 0.5;
  internalPositioning.add( labelBackMesh );
  internalPositioning.position.y = -totalHeight * 0.5;

  // labelGroup.position.x = labelBounds.width * 0.5;
  // labelGroup.position.y = labelBounds.height * 0.5;

  group.back = labelBackMesh;

  return group;
}