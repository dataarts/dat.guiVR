import VRViewer from './vrviewer';
const createApp = VRViewer( THREE );

const { scene, camera, controller1, controller2, events } = createApp({
  autoEnter: false,
  emptyRoom: true
});

scene.add( new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ), new THREE.MeshStandardMaterial() ) );

events.on( 'tick', (dt)=>{
});