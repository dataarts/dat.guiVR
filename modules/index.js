import VRViewer from './vrviewer';
import * as VRPad from './vrpad';

const createApp = VRViewer( THREE );

const { scene, camera, events, toggleVR } = createApp({
  autoEnter: false,
  emptyRoom: true
});

scene.add( new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ), new THREE.MeshStandardMaterial() ) );


const vrpad = VRPad.create();

events.on( 'tick', (dt)=>{
  vrpad.update();
});

vrpad.events.on( 'connected0', ( pad ) => {
  pad.on('button3Pressed', function( index, value ){
    toggleVR();
  });
});


vrpad.events.on( 'connected1', ( pad ) => {
  pad.on('button3Pressed', function( index, value ){
    location.reload();
  });
});
