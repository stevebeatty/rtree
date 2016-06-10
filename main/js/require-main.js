require.config({
    baseUrl: '/RTree/js',
    
    // example of using shim, to load non AMD libraries (such as underscore and jquery)
    paths: {
        jquery: 'lib/jquery-1.11.1.min',
        underscore: 'lib/underscore-min',
        'handlebars.runtime': 'lib/handlebars-v1.3.0',
        'chartjs': 'lib/Chart',
        'highcharts': 'lib/highcharts'
    },
    
    shim: {
        'handlebars.runtime': {
            'exports': 'Handlebars'
        },
        underscore: {
            exports: '_'
        },
        chartjs: {
            exports: 'Chart'
        },
        
        highcharts: {
            exports: 'Highcharts',
            deps: ['jquery']
        }
    }

});
