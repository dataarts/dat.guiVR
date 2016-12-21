// <!--
//   Polygon Shredder by @thespite
//   https://github.com/spite/polygon-shredder/
// -->

function createShadow( scene, renderer, shadowSize ){
  const s = 2;
  const shadowCamera = new THREE.OrthographicCamera( -s, s, s, -s, .001, 3 );
  shadowCamera.position.set( 1, 0.4, 1 );
  shadowCamera.lookAt( scene.position );
  const shadowBufferSize = Math.min( 1024, renderer.context.getParameter(renderer.context.MAX_TEXTURE_SIZE) );
  const shadowBuffer = new THREE.WebGLRenderTarget( shadowSize, shadowSize, {
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat
  } );

  return {
    shadowCamera, shadowBuffer
  };
}

function createShadowMaterial( rtTexturePos, shadowSize ){
  return new THREE.RawShaderMaterial( {

    uniforms: {

      map: { type: "t", value: rtTexturePos },
      prevMap: { type: "t", value: rtTexturePos },
      width: { type: "f", value: sim.width },
      height: { type: "f", value: sim.height },

      timer: { type: 'f', value: 0 },
      boxScale: { type: 'v3', value: new THREE.Vector3() },
      meshScale: { type: 'f', value: 1 },

      shadowV: { type: 'm4', value: new THREE.Matrix4() },
      shadowP: { type: 'm4', value: new THREE.Matrix4() },
      resolution: { type: 'v2', value: new THREE.Vector2( shadowSize, shadowSize ) },
      lightPosition: { type: 'v3', value: new THREE.Vector3() },

      boxVertices: { type: '3fv', value: [

        -1,-1,-1,
        -1,-1, 1,
        -1, 1, 1,

        -1,-1,-1,
        -1, 1, 1,
        -1, 1,-1,

        1, 1,-1,
        1,-1,-1,
        -1,-1,-1,

        1, 1,-1,
        -1,-1,-1,
        -1, 1,-1,

        1,-1, 1,
        -1,-1, 1,
        -1,-1,-1,

        1,-1, 1,
        -1,-1,-1,
        1,-1,-1,

        1, 1, 1,
        1,-1, 1,
        1,-1,-1,

        1, 1,-1,
        1, 1, 1,
        1,-1,-1,

        -1,-1, 1,
        1,-1, 1,
        1, 1, 1,

        -1, 1, 1,
        -1,-1, 1,
        1, 1, 1,

        -1, 1,-1,
        -1, 1, 1,
        1, 1, 1,

        1, 1,-1,
        -1, 1,-1,
        1, 1, 1

      ] },
      boxNormals: { type: '3fv', value: [

        1, 0, 0,
        0, 0, 1,
        0, 1, 0,

        -1, 0, 0,
        0, 0, -1,
        0, -1, 0

      ] },

    },
    vertexShader: document.getElementById( 'vs-particles' ).textContent,
    fragmentShader: document.getElementById( 'fs-particles-shadow' ).textContent,
    side: THREE.DoubleSide
  } );
}