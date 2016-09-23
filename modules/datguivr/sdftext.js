import SDFShader from 'three-bmfont-text/shaders/sdf';
import createGeometry from 'three-bmfont-text';
import parseASCII from 'parse-bmfont-ascii';

import * as Font from './font';

export function createMaterial( color ){

  const texture = new THREE.Texture();
  const image = Font.image();
  texture.image = image;
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearMipMapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;

  //  and what about anisotropic filtering?

  return new THREE.RawShaderMaterial(SDFShader({
    side: THREE.DoubleSide,
    transparent: true,
    color: color,
    map: texture
  }));
}

export function creator(){

  const font = parseASCII( Font.fnt() );

  const colorMaterials = {};

  function createText( str, font, color = 0xffffff ){

    const geometry = createGeometry({
      text: str,
      align: 'left',
      width: 1000,
      flipY: true,
      font
    });


    const layout = geometry.layout;

    let material = colorMaterials[ color ];
    if( material === undefined ){
      material = colorMaterials[ color ] = createMaterial( color );
    }
    const mesh = new THREE.Mesh( geometry, material );
    mesh.scale.multiply( new THREE.Vector3(1,-1,1) );
    mesh.scale.multiplyScalar( 0.001 );

    mesh.position.y = layout.height * 0.5 * 0.001;

    return mesh;
  }


  function create( str, { color=0xffffff } = {} ){
    const group = new THREE.Group();

    let mesh = createText( str, font, color );
    group.add( mesh );
    group.layout = mesh.geometry.layout;

    group.update = function( str ){
      mesh.geometry.update( str );
    };

    return group;
  }

  return {
    create,
    getMaterial: ()=> material
  }

}