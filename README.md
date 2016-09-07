## DAT.GUI for WebVR

![Preview Image](http://i.imgur.com/CKGG7P5.png)

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
    const laserPointer = gui.addInputObject( controllerModel[ 0 ] );
    scene.add( laserPointer );


    const folder = gui.addFolder( 'folder settings' );
    folder.position.y = 1.5;
    scene.add( folder );


    folder.add(
      //  sliders for numeric values
      gui.add( state, 'radius', 1, 20 ).onChange( updateMesh ),
      gui.add( state, 'tube', 0.1, 10 ).onChange( updateMesh ),
      gui.add( state, 'tubularSegments', 3, 300 ).onChange( updateMesh ),
      gui.add( state, 'radialSegments', 3, 20 ).onChange( updateMesh ),
      gui.add( state, 'radialSegments', 3, 20 ).onChange( updateMesh ),
      gui.add( state, 'p', 1, 20 ).onChange( updateMesh ).step( 1 ),
      gui.add( state, 'q', 1, 20 ).onChange( updateMesh ).step( 1 ),

      //  booleans also work
      gui.add( state, 'spinning' )
    );

    function updateMesh(){
      mesh.geometry = new THREE.TorusKnotGeometry(
        state.radius, state.tube,
        state.tubularSegments,
        state.radialSegments,
        state.p, state.q );
    }


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




