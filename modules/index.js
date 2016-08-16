import VRViewer from './vrviewer';
import * as VRPad from './vrpad';
import VRDATGUI from './vrdatgui';

const createApp = VRViewer( THREE );

const { scene, camera, events, toggleVR, controllerModels } = createApp({
  autoEnter: true,
  emptyRoom: true
});

const box = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ), new THREE.MeshStandardMaterial() );
scene.add( box );


const vrpad = VRPad.create();

events.on( 'tick', (dt)=>{
  vrpad.update();
});




//  create a pointer
const pointer = new THREE.Mesh( new THREE.SphereGeometry(0.01, 12, 7 ), new THREE.MeshBasicMaterial({color:0xff0000, wireframe: true}) )
pointer.position.z = -0.12;
pointer.position.y = -0.12;
controllerModels[0].add( pointer );





//  right hand
vrpad.events.on( 'connected0', ( pad ) => {

  pad.on('button1Pressed', ()=>pointer.pressed = true );

  pad.on('button1Released', ()=>pointer.pressed = false );

  //  option button
  pad.on('button3Pressed', function( index, value ){
    toggleVR();
  });
});


//  left hand
vrpad.events.on( 'connected1', ( pad ) => {

  //  option button
  pad.on('button3Pressed', function( index, value ){
    window.close();
  });
});







const state = {
  x: 0
};

const gui = VRDATGUI(THREE);
gui.addInputObject( pointer );


const controller = gui.add( state, 'x' );
controller.position.x = 0.0;
controller.position.y = 1.5;
controller.updateMatrixWorld();

// scene.add( controller );

box.add( controller );

events.on('tick', function(){
  box.rotation.y += 0.001;
});

