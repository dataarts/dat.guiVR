// from https://davidwalsh.name/javascript-loader
var load = (function() {
  // Function which returns a function: https://davidwalsh.name/javascript-functions
  function _load(tag) {
    return function(url) {
      // This promise will be used by Promise.all to determine success or failure
      return new Promise(function(resolve, reject) {
        var element = document.createElement(tag);
        var parent = 'body';
        var attr = 'src';

        // Important success and error for the promise
        element.onload = function() {
          resolve(url);
        };
        element.onerror = function() {
          reject(url);
        };

        // Need to set different attributes depending on tag type
        switch(tag) {
          case 'script':
            element.async = true;
            break;
          case 'link':
            element.type = 'text/css';
            element.rel = 'stylesheet';
            attr = 'href';
            parent = 'head';
        }

        // Inject into document to kick off loading
        element[attr] = url;
        document[parent].appendChild(element);
      });
    };
  }
  
  return {
    css: _load('link'),
    js: _load('script'),
    img: _load('img')
  }
})();

// from http://youmightnotneedjquery.com/
function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function loadThreeAndDependents(threeURL, dependents ) {
  console.log("loadThreeAndDependents", threeURL, dependents)

  return new Promise(function(resolve, reject) {
    Promise.all([load.js(threeJSPath + 'build/three.js')]).then(function() {
      // THREE JS has loaded, now load depenents
      var loadPromises = [];
      for (var i = dependents.length - 1; i >= 0; i--) {
        loadPromises.push(load.js(dependents[i]));
      }

      Promise.all(loadPromises).then(function() {
        resolve();
      }).catch(function(e) {
        reject('Error: Could not load depenent files');
      });

    }).catch(function() {
      reject('Error: Could not load three.js');
    });


  })


}