## About

A series of WebVR experiments for DAT.

## Build and run examples

    npm install
    grunt

Then navigate to localhost:8000/torus.html on VR enabled Chromium build.

Examples:

* vrviewer.html - Simple one-liner to create a WebVR demo.
* vrpad.html - Example to interface with VRPad module which makes handling controllers easier.
* torus.html - Example to use DATGUIVR to create sliders and update things in real time.

Individual modules/js includes in this package:

* datguivr.js, the thing you're here for, a dat-gui for VR.
* vrviewer.js, a simple webvr boilerplate similar to [THREE-Orbit-Viewer](https://www.npmjs.com/package/three-orbit-viewer)
* vrpad.js, a wrapper for gamepad API to handle events such as press and release
