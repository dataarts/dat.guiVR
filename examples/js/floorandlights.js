/**
* dat-guiVR Javascript Controller Library for VR
* https://github.com/dataarts/dat.guiVR
*
* Copyright 2016 Data Arts Team, Google Inc.
* 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* 
*     http://www.apache.org/licenses/LICENSE-2.0
* 
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

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