requirejs.config({
    paths: {
        "text": "durandal/amd/text",
        'jquery': 'libs/jquery-1.9.1',
        'ko': 'libs/knockout-2.2.1',
        'bootstrap': 'libs/bootstrap'
    },
    shim: {
        'ko': {
            exports: 'ko'
        },
        'jquery': {
            exports: '$'
        },
        'bootstrap': {
            deps: ['jquery']
        }
    }
});

define(['durandal/app', 'durandal/viewLocator', 'durandal/system', 'jquery', 'bootstrap'], function (app, viewLocator, system, $) {

    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.start().then(function () {
        viewLocator.useConvention();
        app.adaptToDevice();

        

        app.on('all', function () {
            system.log(arguments);
        });

        
        
        // create DOM host for widget
        var appRoot = $("<div class='_tapyou-wrapper'></div>").appendTo('body');

        app.setRoot('viewmodels/shell', null, appRoot[0]);
    });
});


