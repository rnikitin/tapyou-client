requirejs.config({
    //urlArgs: "bust=" + (new Date()).getTime(),

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

define(['require',
        'durandal/app',
        'durandal/viewLocator',
        'durandal/system',
        'backend/sockets',
        'jquery',
        'ko',
        'bootstrap',
        'require',
        'text'],
    function (r, app, viewLocator, system, sockets, $) {

        //>>excludeStart("build", true);
        system.debug(true);
        //>>excludeEnd("build");

        // to avoid conflicts remove $ alias from window
        window.__tap$ = $.noConflict();

        app.start().then(function () {
            viewLocator.useConvention();
            app.adaptToDevice();

            //>>excludeStart("build", true);
            // display all events in app
            app.on('all', function () {
                system.log(arguments);
            });
            //>>excludeEnd("build");

            // create DOM host for widget
            var appRoot = $("<div class='tapyou-wrapper'></div>").appendTo('body');
            app.setRoot('viewmodels/shell', null, appRoot[0]);
        });
    });

