// find the test files to run
var TEST_FILE_REGEX = /^\/base\/test\/js\/spec\//;

var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
   // console.info(file);
    if (TEST_FILE_REGEX.test(file)) {
     //   console.info("   " + file);
      tests.push(file);
    }
  }
}


require.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: '/base',
    
    // example of using shim, to load non AMD libraries (such as underscore and jquery)
    paths: {
        jquery: 'main/js/lib/jquery-1.11.1.min',
        'handlebars.runtime': 'main/js/lib/handlebars-v1.3.0',
        underscore: 'main/js/lib/underscore-min',
        al: 'main/js/al',
        altest: 'main/js/altest'
    },
    
    shim: {
        'handlebars.runtime': {
            exports: 'Handlebars'
        },
        underscore: {
            exports: '_'
        }
    },
    
    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start

});
