/*
  Based off of @thespite's curl noise
  https://raw.githubusercontent.com/spite/polygon-shredder/master/js/Simulation.js
*/

function createNoiseSim( renderer, size, params ) {

  const width = size;
  const height = size;
  const area = width * height;

  let targetPos = 0;

  const data = new Float32Array( width * height * 4 );

  let r = 1;
  for( let i = 0, l = area; i < l; i ++ ) {

    let phi = Math.random() * 2 * Math.PI;
    let costheta = Math.random() * 2 -1;
    let theta = Math.acos( costheta );
    r = .45 + .1 * Math.random();

    data[ i * 4 ] = r * Math.sin( theta) * Math.cos( phi );
    data[ i * 4 + 1 ] = r * Math.sin( theta) * Math.sin( phi ) + 5.0;
    data[ i * 4 + 2 ] = r * Math.cos( theta );
    data[ i * 4 + 3 ] = Math.random() * 100;

  }

  const floatType = THREE.FloatType;

  const texture = new THREE.DataTexture( data, width, height, THREE.RGBAFormat, THREE.FloatType );
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.needsUpdate = true;

  const rtTexturePos = new THREE.WebGLRenderTarget( width, height, {
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: floatType,
    stencilBuffer: false,
    depthBuffer: false,
    generateMipmaps: false
  });

  const targets = [ rtTexturePos, rtTexturePos.clone() ];

  const simulationShader = new THREE.ShaderMaterial({

    uniforms: {
      active: { type: 'f', value: 1 },
      width: { type: "f", value: width },
      height: { type: "f", value: height },
      oPositions: { type: "t", value: texture },
      tPositions: { type: "t", value: null },
      timer: { type: "f", value: 0 },
      delta: { type: "f", value: 0 },
      speed: { type: "f", value: .5 },
      reset: { type: 'f', value: 0 },
      offset: { type: 'v3', value: new THREE.Vector3( 0, 0, 0 ) },
      genScale: { type: 'f', value: 1 },
      factor: { type: 'f', value: params.factor },
      evolution: { type: 'f', value: params.evolution },
      inverseModelViewMatrix: { type: 'm4', value: new THREE.Matrix4() },
      radius: { type: 'f', value: params.radius }
    },

    vertexShader: document.getElementById('texture_vertex_simulation_shader').textContent,
    fragmentShader: document.getElementById('texture_fragment_simulation_shader').textContent,
    side: THREE.DoubleSide

  });

  simulationShader.uniforms.tPositions.value = texture;

  const rtScene = new THREE.Scene();
  const rtCamera = new THREE.OrthographicCamera( -width / 2, width / 2, -height / 2, height / 2, -500, 1000 );
  const rtQuad = new THREE.Mesh(
    new THREE.PlaneBufferGeometry( width, height ),
    simulationShader
  );

  rtScene.add( rtQuad );

  renderer.render( rtScene, rtCamera, rtTexturePos );

  // const plane = new THREE.Mesh( new THREE.PlaneGeometry( 64, 64 ), new THREE.MeshBasicMaterial( { map: rtTexturePos, side: THREE.DoubleSide } ) );
  // scene.add( this.plane );

  function render( time, delta ){
    simulationShader.uniforms.timer.value = time;
    simulationShader.uniforms.delta.value = delta;

    simulationShader.uniforms.tPositions.value = targets[ targetPos ];
    targetPos = 1 - targetPos;
    renderer.render( rtScene, rtCamera, targets[ targetPos ] );
  }

  return {
    render,
    width,
    height,
    rtTexturePos,
    simulationShader,
    targetPos,
    targets
  }
}