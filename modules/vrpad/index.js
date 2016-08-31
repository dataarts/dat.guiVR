import Emitter from 'events';

export function create(){

  const pads = [];

  const events = new Emitter();

  function update(){
    const gamePads = navigator.getGamepads();
    for( let i=0; i<gamePads.length; i++ ){
      const gamePad = gamePads[ i ];
      if( gamePad ){
        if( pads[ i ] === undefined ){
          pads[ i ] = createPadHandler( gamePad );
          events.emit( 'connected', pads[ i ] );
          events.emit( 'connected'+i, pads[ i ] );
        }

        pads[ i ].update();
      }
    }
  }

  return {
    update,
    pads,
    events
  };
}

if( window ){
  window.VRPad = create;
}


function createPadHandler( gamePad ){
  const events = new Emitter();

  let lastButtons = cloneButtons( gamePad.buttons );

  function update(){

    const buttons = gamePad.buttons;

    //  compare
    buttons.forEach( ( button, index )=>{

      const lastButton = lastButtons[ index ];
      // console.log( button.pressed, lastButton.pressed );
      if( button.pressed !== lastButton.pressed ){
        if( button.pressed ){
          events.emit( 'buttonPressed', index, button.value );
          events.emit( 'button'+index+'Pressed', button.value );
        }
        else{
          events.emit( 'buttonReleased', index, button.value );
          events.emit( 'button'+index+'Released', button.value );
        }
      }

    });

    lastButtons = cloneButtons( gamePad.buttons );

  }

  gamePad.update = update;
  gamePad.on = function( eventName, callback ){
    return events.on( eventName, callback );
  };

  return gamePad;
}

function cloneButtons( buttons ){
  const cloned = [];

  buttons.forEach( function( button ){
    cloned.push({
      pressed: button.pressed,
      touched: button.touched,
      value: button.value
    });
  });
  return cloned;
}