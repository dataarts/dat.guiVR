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
import Emitter from 'events';

export default function createInteraction( hitVolume ){
  const events = new Emitter();  

  let anyHover = false;
  let anyPressing = false;

  let hover = false;
  let anyActive = false;

  const tVector = new THREE.Vector3();  

  function update( inputObjects ){

    hover = false;    
    anyPressing = false;
    anyActive = false;    

    inputObjects.forEach( function( input ){

      const { hitObject, hitPoint } = extractHit( input );

      hover = hover || hitVolume === hitObject;
      
      performStateEvents({
        input,
        hover,
        hitObject, hitPoint,
        buttonName: 'pressed',
        interactionName: 'press',
        downName: 'onPressed',
        holdName: 'pressing',
        upName: 'onReleased'
      });

      performStateEvents({
        input,
        hover,
        hitObject, hitPoint,
        buttonName: 'gripped',
        interactionName: 'grip',
        downName: 'onGripped',
        holdName: 'gripping',
        upName: 'onReleaseGrip'
      });      

    });

  }

  function extractHit( input ){
    if( input.intersections.length <= 0 ){      
      return {
        hitPoint: tVector.setFromMatrixPosition( input.cursor.matrixWorld ).clone(),
        hitObject: input.cursor,
      };      
    }
    else{
      return {
        hitPoint: input.intersections[ 0 ].point,
        hitObject: input.intersections[ 0 ].object
      };
    }        
  }

  function performStateEvents({
    input, hover, 
    hitObject, hitPoint, 
    buttonName, interactionName, downName, holdName, upName
  } = {} ){
    
    // if( hover && input[ 'gripped' ] && interactionName === 'grip' ){
    //   debugger;
    // }

    //  hovering and button down but no interactions active yet
    if( hover && input[ buttonName ] === true && input.interaction[ interactionName ] === undefined ){      
      // if( events.listenerCount( downName ) > 0 ){        
        input.interaction[ interactionName ] = interaction;
        events.emit( downName, {
          hitObject,
          point: hitPoint,
          inputObject: input.object
        });
        anyPressing = true;
        anyActive = true;
      // }
    }    

    //  button still down and this is the active interaction
    if( input[ buttonName ] && input.interaction[ interactionName ] === interaction ){
      // if( events.listenerCount( holdName ) > 0 ){        
        events.emit( holdName, {
          hitObject,
          point: hitPoint,
          inputObjet: input.object
        });
        anyPressing = true;
      // }
      // input.events.emit( 'onControllerHeld', input );
    }

    //  button not down and this is the active interaction
    if( input[ buttonName ] === false && input.interaction[ interactionName ] === interaction ){
      // if( events.listenerCount( upName ) > 0 ){
        input.interaction[ interactionName ] = undefined;      
        events.emit( upName, {
          hitObject,
          point: hitPoint,
          inputObject: input.object
        });
      // }
    }

  }


  const interaction = {
    hovering: ()=>hover,
    pressing: ()=>anyPressing,
    update,
    events
  };

  return interaction;
}