import VRViewer from './vrviewer';
import * as VRPad from './vrpad';
import VRDATGUI from './vrdatgui';

const createApp = VRViewer( THREE );

const { scene, camera, events, toggleVR, controllerModels, renderer } = createApp({
  autoEnter: true,
  emptyRoom: true
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// renderer.gammaInput = true;
// renderer.gammaOutput = true;
// renderer.toneMapping = THREE.ReinhardToneMapping;
// renderer.toneMappingExposure = 3;



const vrpad = VRPad.create();

events.on( 'tick', (dt)=>{
  vrpad.update();
});






//  right hand
vrpad.events.on( 'connected0', ( pad ) => {

  pad.on('button1Pressed', ()=>pointer.pressed = true );
  pad.on('button1Released', ()=>pointer.pressed = false );

  pad.on('button2Pressed', ()=>pointer.gripped = true  );
  pad.on('button2Released', ()=>pointer.gripped = false  );

  //  option button
  pad.on('button3Pressed', function( index, value ){
    toggleVR();
  });
});


//  left hand
vrpad.events.on( 'connected1', ( pad ) => {

  //  option button
  pad.on('button3Pressed', function( index, value ){
  });

  pad.on('button2Pressed', pinGUI  );
});





const state = {
  radius: 10,
  tube: 3,
  tubularSegments: 64,
  radialSegments: 8,
  p: 2,
  q: 3
};


const textureCube = new THREE.CubeTextureLoader()
  .setPath( 'textures/cube/pisa/' )
  .load( [ 'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png' ] );

const material = new THREE.MeshStandardMaterial();
material.roughness = 0.3;
material.metalness = 1;
material.envMap = textureCube;

const mesh = new THREE.Mesh( new THREE.TorusKnotGeometry( state.radius, state.tube, state.tubularSegments, state.radialSegments, state.p, state.q ), material );
mesh.position.z = -1.5;
mesh.position.y = 1.5;
mesh.scale.multiplyScalar( 0.04 );
mesh.castShadow = true;
scene.add( mesh );

const floor = new THREE.Mesh( new THREE.PlaneGeometry( 8,8, 1, 1), new THREE.MeshStandardMaterial({side: THREE.DoubleSide}) );
floor.rotation.x = -Math.PI * 0.5;
floor.receiveShadow = true;
scene.add( floor );

events.on( 'tick', (dt)=>{
  mesh.rotation.y += 0.4 * dt;
});

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
scene.add( light, light.target );

// var spotLightHelper = new THREE.SpotLightHelper( light );
// scene.add( spotLightHelper );

function updateMesh(){
  mesh.geometry = new THREE.TorusKnotGeometry( state.radius, state.tube, state.tubularSegments, state.radialSegments, state.p, state.q );
}



//  create a pointer
const pointer = new THREE.Mesh( new THREE.SphereGeometry(0.002, 12, 7 ), new THREE.MeshBasicMaterial({color:0xff0000, wireframe: true}) )
pointer.position.z = -0.12;
pointer.position.y = -0.12;
controllerModels[0].add( pointer );

const gui = VRDATGUI(THREE);
gui.addInputObject( pointer );



const folder = gui.addFolder( 'folder settings' );
folder.position.y = 1.5;
scene.add( folder );

folder.add(
  gui.add( state, 'radius', 1, 20 ).onChange( updateMesh ),
  gui.add( state, 'tube', 0.1, 10 ).onChange( updateMesh ),
  gui.add( state, 'tubularSegments', 3, 300 ).onChange( updateMesh ),
  gui.add( state, 'radialSegments', 3, 20 ).onChange( updateMesh ),
  gui.add( state, 'radialSegments', 3, 20 ).onChange( updateMesh ),
  gui.add( state, 'p', 1, 20 ).onChange( updateMesh ).step( 1 ),
  gui.add( state, 'q', 1, 20 ).onChange( updateMesh ).step( 1 )
);

let pinned = false;
function pinGUI(){
  if( pinned === false ){
    folder.position.y = 0;
    folder.position.z = -0.1;
    folder.position.x = 0;
    folder.rotation.x = -Math.PI * 0.5;
    folder.scale.multiplyScalar( 0.25 );
    folder.pinTo( controllerModels[ 1 ] );
  }
  else{
    folder.position.y = 1.5;
    folder.position.z = 0;
    folder.position.x = 0;
    folder.rotation.x = 0;
    folder.scale.set( 1, 1, 1 );
    folder.pinTo( scene );
  }

  pinned = !pinned;
}

