
function createFloorAndLights(){
  const group = new THREE.Group();

  const floor = new THREE.Mesh( new THREE.PlaneGeometry( 8,8, 1, 1), new THREE.MeshStandardMaterial({side: THREE.DoubleSide}) );
  floor.rotation.x = -Math.PI * 0.5;
  floor.receiveShadow = true;
  group.add( floor );

  const light = new THREE.SpotLight( 0xffffff );
  light.intensity = 2.0;
  light.distance = 7;
  light.position.set( 0, 6, -1 );
  light.penumbra = 0.248;
  light.angle = 24;
  light.castShadow = true;
  light.shadow.mapSize.set(2048,2048)
  light.shadow.radius = 0.5;
  light.target.position.set( 0, 0, -1.5 );
  light.target.updateMatrixWorld();
  group.add( light, light.target );

  group.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

  let directionalLight = new THREE.DirectionalLight( 0xffffff );
  directionalLight.position.set( 1, 1, 1 ).normalize();
  group.add( directionalLight );

  return group;
}