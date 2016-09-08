import SDFShader from 'three-bmfont-text/shaders/sdf';
import createGeometry from 'three-bmfont-text';

export function createMaterial( color ){

  const loader = new THREE.TextureLoader();
  loader.load( 'fonts/lucidasansunicode.png', function( texture ){
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    material.uniforms.map.value = texture;

    //  TODO
    //  add aniso

  } );

  const material = new THREE.RawShaderMaterial(SDFShader({
    side: THREE.DoubleSide,
    transparent: true,
    color: color
  }));

  return material;

}

export function creator( material, events ){

  let font;

  events.on( 'fontLoaded', function( font ){
    font = font;
  });

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
    let lateText = str;

    let mesh;

    if( font ){
      mesh = createText( lateText, font, color );
      group.add( mesh );
      group.layout = mesh.geometry.layout;
    }
    else{
      function fontLoadedCB( font ){
        mesh = createText( lateText, font, color );
        group.add( mesh );
        group.layout = mesh.geometry.layout;
        events.removeListener( 'fontLoaded', fontLoadedCB );
      };
      events.on( 'fontLoaded', fontLoadedCB );
    }

    group.update = function( str ){
      if( mesh ){
        mesh.geometry.update( str );
      }
      else{
        lateText = str;
      }
    };

    return group;
  }

  return {
    create,
    getMaterial: ()=> material
  }

}