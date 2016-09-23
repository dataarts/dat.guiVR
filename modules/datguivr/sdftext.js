/**
* dat-guiVR Javascript Controller Library for VR
* https://github.com/dataarts/dat.guiVR
*
* Copyright 2016 Data Arts Team, Google Inc.
* 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* 
*     http://www.apache.org/licenses/LICENSE-2.0
* 
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

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