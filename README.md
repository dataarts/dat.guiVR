## DAT.GUI for WebVR

![Preview Image](http://i.imgur.com/CKGG7P5.png)

A [dat-gui](https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage) implementation built in 3D for use in WebVR.

Built on top of [THREE.js](http://threejs.org/)


## Build and Run

    npm install
    grunt


## Examples ##
Then navigate to **localhost:8000/torus.html** on VR enabled Chromium build.
* vrviewer.html - Simple one-liner to create a WebVR demo.
* vrpad.html - Example to interface with VRPad module which makes handling controllers easier.
* torus.html - Example to use DATGUIVR to create sliders and update things in real time.



## Individual Modules ##
This repo contains a few different modules to help with WebVR, in addition to DATGUIVR:
* datguivr.js, the thing you're here for, a dat-gui for VR.
* vrviewer.js, a simple webvr boilerplate similar to [THREE-Orbit-Viewer](https://www.npmjs.com/package/three-orbit-viewer)
* vrpad.js, a wrapper for gamepad API to handle events such as press and release


## Notes ##
* This module assumes the existence of THREE.js in global scope somewhere.
* Can be used as a drop in script include (like the examples) or as an  ES6 module / node build.