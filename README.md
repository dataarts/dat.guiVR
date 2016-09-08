## DAT.GUI for WebVR

![Preview Image](http://i.imgur.com/BJ5u8Lz.png?2)

A [dat-gui](https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage) implementation built in 3D for use in WebVR.

Built on top of [THREE.js](http://threejs.org/)

## How to use: ##
    const state = {
      radius: 10,
      tube: 3,
      tubularSegments: 64,
      radialSegments: 8,
      p: 2,
      q: 3
    };


    const gui = DATGUIVR();

    //  given any input control object (vive controller, cardboard headset, etc)...
    //  addInputObject returns a live-updating laser pointer
      const guiInput = gui.addInputObject( controllers[ 0 ] );
      scene.add( guiInput );


    // folders are just THREE.js Objects that you can attach controllers to
    const folder = gui.addFolder( 'folder settings' );
    scene.add( folder );

    const state = {
      radius: 5,
      radialSegments: 4,
      shading: THREE.SmoothShading,
      spinning: false,
      reset: function(){ ... }
    };


    folder.add(
      //  sliders for numeric values
      gui.add( state, 'radius', 1, 20 ).onChange( updateMesh ),
      gui.add( state, 'radialSegments', 3, 20 ).onChange( updateMesh ),

      //  dropdowns for arrays or object maps
      gui.add( state, 'shading', { 'THREE.SmoothShading': THREE.SmoothShading, 'THREE.FlatShading': THREE.FlatShading } ).onChange( updateMaterial ),
      
      //  checkboxes for booleans
      gui.add( state, 'spinning' )
      
      //  buttons for functions to execute
      gui.add( state, 'reset' )
    );



## Build and Run

    npm install
    npm run dev

Wait for the build to complete and a test server will start.

## Examples ##
Then navigate to **localhost:8000** on VR enabled Chromium build.
* Index.html - Example to use DATGUIVR to create sliders and update things in real time.



## Notes ##
* This module assumes the existence of THREE.js in global scope somewhere.
* Can be used as a drop in script include (like the examples) or as an  ES6 module / node build.




