# DAT.GUI for WebVR

![Preview](https://github.com/dataarts/dat.guiVR/raw/master/preview.gif)

A [dat-gui](https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage) implementation built in 3D for use in WebVR.

Built on top of [THREE.js](http://threejs.org/)

# Wiki
[Check out the Wiki for more information.](https://github.com/dataarts/dat.guiVR/wiki)

# Examples

## Creating a gui    

     const gui = dat.GUIVR.create( 'settings' );
     scene.add( gui );

## Creating a slider     

      gui.add( state, 'radius', 1, 20 );

## Creating a dropdown     

      gui.add( state, 'shading', { 'THREE.SmoothShading': THREE.SmoothShading, 'THREE.FlatShading': THREE.FlatShading } );

## Reacting to Changes     

      gui.add( state, 'radius', 1, 20 ).onChange( updateMesh );

## Listen for Changes     

      gui.add( state, 'radius', 1, 20 ).listen();

The slider will now update itself if the property itself changes.   

## Adding Inputs (Vive controllers, cardboard, etc) 

      const guiInput = dat.GUIVR.addInputObject( controllers[ 0 ] );
      scene.add( guiInput );
      
`addInputObject` returns a live-updating laser pointer which you can add to the scene.
    


# Build and Run 
If you are using npm modules and want to use this library, contribute, or test:

    npm install
    npm run dev

Wait for the build to complete and a test server will start.

## Examples
Then navigate to **localhost:8000** on VR enabled Chromium build.



## Notes 
* This module assumes the existence of THREE.js in global scope somewhere.
* Can be used as a drop in script include (like the examples) or as an  ES6 module / node build.




