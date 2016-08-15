import VRViewer from './vrviewer';

const { scene, camera, controller1, controller2 } = VRViewer.start();

scene.add( new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ), new THREE.MeshStandardMaterial() ) );