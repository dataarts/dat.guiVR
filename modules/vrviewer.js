import * as VRControls from './vrcontrols';
import * as VREffects from './vreffects';
import * as ViveController from './vivecontroller';
import * as WEBVR from './webvr';
import * as ObjLoader from './objloader';

if ( WEBVR.isLatestAvailable() === false ) {

  document.body.appendChild( WEBVR.getMessage() );

}

var container;
var camera, renderer;
var effect, controls;
var controller1, controller2;
var scene;

function init() {

  const container = document.createElement( 'div' );
  document.body.appendChild( container );

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 10 );
  scene.add( camera );

  const room = new THREE.Mesh(
    new THREE.BoxGeometry( 6, 6, 6, 8, 8, 8 ),
    new THREE.MeshBasicMaterial( { color: 0x404040, wireframe: true } )
  );
  room.position.y = 3;
  scene.add( room );

  scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

  var light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 1, 1, 1 ).normalize();
  scene.add( light );

  renderer = new THREE.WebGLRenderer( { antialias: false } );
  renderer.setClearColor( 0x505050 );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.sortObjects = false;
  container.appendChild( renderer.domElement );

  controls = new THREE.VRControls( camera );
  controls.standing = true;

  // controllers

  controller1 = new THREE.ViveController( 0 );
  controller1.standingMatrix = controls.getStandingMatrix();
  scene.add( controller1 );

  controller2 = new THREE.ViveController( 1 );
  controller2.standingMatrix = controls.getStandingMatrix();
  scene.add( controller2 );

  var loader = new THREE.OBJLoader();
  loader.setPath( 'models/obj/vive-controller/' );
  loader.load( 'vr_controller_vive_1_5.obj', function ( object ) {

    var loader = new THREE.TextureLoader();
    loader.setPath( 'models/obj/vive-controller/' );

    var controller = object.children[ 0 ];
    controller.material.map = loader.load( 'onepointfive_texture.png' );
    controller.material.specularMap = loader.load( 'onepointfive_spec.png' );

    controller1.add( object.clone() );
    controller2.add( object.clone() );

  } );

  effect = new THREE.VREffect( renderer );

  if ( WEBVR.isAvailable() === true ) {
    document.body.appendChild( WEBVR.getButton( effect ) );
    setTimeout( ()=>effect.requestPresent(), 1000 );
  }

  window.addEventListener( 'resize', function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    effect.setSize( window.innerWidth, window.innerHeight );
  }, false );

}

function animate() {

  effect.requestAnimationFrame( animate );
  render();

}

function render() {
  controls.update();
  effect.render( scene, camera );
}

export default {
  start: function(){
    init();
    animate();

    return {
      scene, camera, controller1, controller2, renderer
    }
  }
};