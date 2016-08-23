import * as Colors from './colors';

export default function createTextLabel( textCreator, str, width = 0.4 ){

  const group = new THREE.Group();

  const text = textCreator.create( str );
  group.add( text );

  group.setString = function( str ){
    text.update( str.toString() );
  };

  group.setNumber = function( str ){
    text.update( str.toFixed(2) );
  };

  text.position.z = 0.015

  const backBounds = 0.01;
  const labelBackGeometry = new THREE.BoxGeometry( width, 0.04, 0.029, 1, 1, 1 );
  labelBackGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( width * 0.5, 0, 0 ) );

  const labelBackMesh = new THREE.Mesh( labelBackGeometry, new THREE.MeshBasicMaterial({color:Colors.DEFAULT_BACK}));
  labelBackMesh.position.y = 0.03;
  // labelBackMesh.position.x = width * 0.5;
  group.add( labelBackMesh );

  // labelGroup.position.x = labelBounds.width * 0.5;
  // labelGroup.position.y = labelBounds.height * 0.5;

  group.back = labelBackMesh;

  return group;
}