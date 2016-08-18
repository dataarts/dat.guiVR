export default function TextureText(){
  let cw = 1024;
  let ch = 1024;

  const canvas = document.createElement( 'canvas' );
  canvas.width = cw;
  canvas.height = ch;

  const ctx = canvas.getContext( '2d' );
  ctx.font = '32px Lucida Sans Unicode'

  //  what a hack
  const lineHeight = ctx.measureText('M').width * 1.5;

  ctx.fillStyle = 'white';

  const textList = [];
  const texture = new THREE.Texture( canvas );

  // ctx.beginPath();
  // ctx.rect( 0, 0, 100, 100 );
  // ctx.fill();

  function add( str ){
    const id = textList.length;

    textList.push( str );

    drawText( str, id );

    const textureTop = lineHeight * (id);
    const width = ctx.measureText( str ).width;
    return {
      x1: 0, y1: textureTop/ch,
      x2: 0 + width/cw, y2: (textureTop + lineHeight)/ch,
      width: width/cw, height: lineHeight/ch,
      updateText: function(){

      }
    };
  }

  function drawText( str, idx ){
    const top = lineHeight *  (idx + 1);

    ctx.fillText( str, 0, top );
    texture.needsUpdate = true;
  }

  function appendCanvas(){
    document.body.appendChild( canvas );
  }

  function getTexture(){
    return texture;
  }

  return {
    add,
    getTexture,
    appendCanvas
  };
}