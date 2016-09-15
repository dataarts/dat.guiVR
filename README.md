# DAT.GUI for WebVR

![Preview Image](http://i.imgur.com/BJ5u8Lz.png?2)

A [dat-gui](https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage) implementation built in 3D for use in WebVR.

Built on top of [THREE.js](http://threejs.org/)

# Examples

## Initializing ##

    const gui = DATGUIVR();

## Adding Inputs (Vive controllers, cardboard, etc) ##

      const guiInput = gui.addInputObject( controllers[ 0 ] );
      scene.add( guiInput );
      
`addInputObject` returns a live-updating laser pointer which you can add to the scene.
    
## Creating a slider ##    

      gui.add( state, 'radius', 1, 20 );

## Creating a dropdown ##    

      gui.add( state, 'shading', { 'THREE.SmoothShading': THREE.SmoothShading, 'THREE.FlatShading': THREE.FlatShading } );

## Reacting to Changes ##    

      gui.add( state, 'radius', 1, 20 ).onChange( updateMesh );

## Listen for Changes ##    

      gui.add( state, 'radius', 1, 20 ).listen();

The slider will now update itself if the property itself changes.

## Creating Folders ##

    const folder = gui.addFolder( 'folder settings' );
    folder.add( sliderController );
    scene.add( folder );
    
Folders are just THREE.js Objects that you can attach sliders, etc to.


# Build and Run 

    npm install
    npm run dev

Wait for the build to complete and a test server will start.

## Examples ##
Then navigate to **localhost:8000** on VR enabled Chromium build.
* index.html - Example to use DATGUIVR to create sliders and update things in real time.
* listen.html - Example of DATGUIVR listening to changes in the object.



## Notes ##
* This module assumes the existence of THREE.js in global scope somewhere.
* Can be used as a drop in script include (like the examples) or as an  ES6 module / node build.




