import VRViewer from './vrviewer';
import * as VRPad from './vrpad';
import VRDATGUI from './vrdatgui';

const createApp = VRViewer( THREE );

const { scene, camera, events, toggleVR, controllerModels } = createApp({
  autoEnter: true,
  emptyRoom: true
});


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





const boxes = [];
for( let i=0; i<32; i++ ){
  const box = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ), new THREE.MeshStandardMaterial() );
  box.position.y = 2.0;
  box.position.z = -1.2;
  scene.add( box );
  boxes.push( box );
}

const state = {
  rotationSpeed: 0.02,
  offset: 0.01,
  scale: 1.0
};

events.on( 'tick', (dt)=>{
  boxes.forEach( function( box, index ){
    box.rotation.x += dt * ( state.rotationSpeed + index * state.offset );
    box.rotation.y -= dt * ( state.rotationSpeed * 1.2 + index * state.offset );
    box.rotation.z += dt * ( state.rotationSpeed * 0.4 + index * state.offset );
  });
});


const gui = VRDATGUI(THREE);
gui.addInputObject( pointer );



const guiGroup = new THREE.Group();
guiGroup.position.z = -0.1;
guiGroup.rotation.x = -Math.PI * 0.5;
guiGroup.scale.multiplyScalar( 0.25 );
controllerModels[1].add( guiGroup );



const controller = gui.add( state, 'rotationSpeed', -0.8, 0.8 );
guiGroup.add( controller );

const controller2 = gui.add( state, 'scale', 0.2, 3.0 ).onChanged( function( width ){
  boxes.forEach( function( box, index ){
    box.scale.x = width * index * 0.01;
    if( box.scale.x < 0.1 ){
      box.scale.x = 0.1;
    }
    box.scale.y = 1/width * index * 0.05;
    if( box.scale.y < 0.1 ){
      box.scale.y = 0.1;
    }
  });
});
controller2.position.y = 0.15;
guiGroup.add( controller2 );

const controller3 = gui.add( state, 'offset', 0.001, 0.1 );
controller3.position.y = 0.3;
guiGroup.add( controller3 );



