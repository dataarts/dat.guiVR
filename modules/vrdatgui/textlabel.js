
export default function createTextLabel( textCreator, str ){

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
  const labelBackGeometry = new THREE.BoxGeometry( 0.4, 0.04, 0.029, 1, 1, 1 );

  const labelBackMesh = new THREE.Mesh( labelBackGeometry, new THREE.MeshBasicMaterial({color:0x131313}));
  labelBackMesh.position.y = 0.03;
  labelBackMesh.position.x = 0.18;
  group.add( labelBackMesh );

  // labelGroup.position.x = labelBounds.width * 0.5;
  // labelGroup.position.y = labelBounds.height * 0.5;


  return group;
}