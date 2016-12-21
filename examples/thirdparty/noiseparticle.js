// <!--
//   Polygon Shredder by @thespite
//   https://github.com/spite/polygon-shredder/
// -->

const colors = [
  0xed6a5a,
  0xf4f1bb,
  0x9bc1bc,
  0x5ca4a9,
  0xe6ebe0,
  0xf0b67f,
  0xfe5f55,
  0xd6d1b1,
  0xc7efcf,
  0xeef5db,
  0x50514f,
  0xf25f5c,
  0xffe066,
  0x247ba0,
  0x70c1b3
];

function createGeometry( size ){
  const geometry = new THREE.BufferGeometry();
  const positionsLength = size * size * 3 * 18;
  const positions = new Float32Array( positionsLength );
  let p = 0;
  for( let j = 0; j < positionsLength; j += 3 ) {
    positions[ j ] = p
    positions[ j + 1 ] = Math.floor( p / 18 )
    positions[ j + 2 ] = p % 18
    p++;
  }

  geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  return geometry;
}

function createMaterial( size, shadowSize, rtTexturePos, shadowBuffer ){
  const area = size * size;
  const diffuseData = new Uint8Array( area * 4 );
  for( let j = 0; j < area * 4; j += 4 ) {
    let c = new THREE.Color( colors[ ~~( Math.random() * colors.length ) ] );
    diffuseData[ j + 0 ] = c.r * 255;
    diffuseData[ j + 1 ] = c.g * 255;
    diffuseData[ j + 2 ] = c.b * 255;
  }

  const diffuseTexture = new THREE.DataTexture( diffuseData, size, size, THREE.RGBAFormat );
  diffuseTexture.minFilter = THREE.NearestFilter;
  diffuseTexture.magFilter = THREE.NearestFilter;
  diffuseTexture.needsUpdate = true;

  const texLoader = new THREE.TextureLoader();
  texLoader.load( 'textures/spotlight.jpg', function( res ) {
    material.uniforms.projector.value = res;
  } );

  const material = new THREE.RawShaderMaterial( {

    uniforms: {

      map: { type: 't', value: rtTexturePos },
      prevMap: { type: 't', value: rtTexturePos },
      diffuse: { type: 't', value: diffuseTexture },
      width: { type: 'f', value: size },
      height: { type: 'f', value: size },
      dimensions: { type: 'v2', value: new THREE.Vector2( shadowSize, shadowSize ) },

      timer: { type: 'f', value: 0 },
      spread: { type: 'f', value: 4 },
      boxScale: { type: 'v3', value: new THREE.Vector3() },
      meshScale: { type: 'f', value: 1 },

      depthTexture: { type: 't', value: shadowBuffer },
      shadowV: { type: 'm4', value: new THREE.Matrix4() },
      shadowP: { type: 'm4', value: new THREE.Matrix4() },
      resolution: { type: 'v2', value: new THREE.Vector2( shadowSize, shadowSize ) },
      lightPosition: { type: 'v3', value: new THREE.Vector3() },
      projector: { type: 't', value: null },

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
        0, 1, 0

      ] },

    },
    vertexShader: document.getElementById( 'vs-particles' ).textContent,
    fragmentShader: document.getElementById( 'fs-particles' ).textContent,
    side: THREE.DoubleSide,
    shading: THREE.FlatShading
  } );

  return material;
}