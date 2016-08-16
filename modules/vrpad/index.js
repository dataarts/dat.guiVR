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


function createPadHandler( pad ){
  const events = new Emitter();

  let lastButtons = cloneButtons( pad.buttons );

  console.log( lastButtons );
  function update(){

    const buttons = pad.buttons;

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

    lastButtons = cloneButtons( pad.buttons );

  }

  events.update = update;

  return events;
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