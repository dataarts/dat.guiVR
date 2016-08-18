import loadFont from 'load-bmfont';
import Emitter from 'events';

import TextureText from '../textureText';
import createSlider from './slider';
import * as SDFText from './sdftext';

export default function VRDATGUI( THREE ){

  const textMaterial = SDFText.createMaterial();

  const inputObjects = [];
  const controllers = [];

  const events = new Emitter();

  const DEFAULT_FNT = 'fonts/lucidasansunicode.fnt';

  loadFont( DEFAULT_FNT, function( err, font ){
    if( err ){
      console.warn( err );
    }
    events.emit( 'fontLoaded', font );
  });

  const textCreator = SDFText.creator( textMaterial, events );

  function addInputObject( object ){
    inputObjects.push( {
      box: new THREE.Box3(),
      object
    });
  }

  function add( object, propertyName, min = 0.0, max = 100.0 ){

    const slider = createSlider( {
      textCreator, propertyName, object, min, max,
      initialValue: object[ propertyName ]
    });

    controllers.push( slider );

    return slider;
  }


  function update() {
    requestAnimationFrame( update );

    inputObjects.forEach( function( set ){
      set.box.setFromObject( set.object );
    });

    controllers.forEach( function( controller ){
      controller.update( inputObjects );
    });
  }

  update();

  return {
    addInputObject,
    add
  };

}

