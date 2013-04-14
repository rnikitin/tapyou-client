requirejs.config({
    urlArgs: "bust=" + (new Date()).getTime(),

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

            // connect to socket
            var room = window.location.href.hashCode();
            var name = createRandomWord(6);
            sockets.init(room, name).done(function()
            {
                // create DOM host for widget
                var appRoot = $("<div class='tapyou-wrapper'></div>").appendTo('body');

                app.setRoot('viewmodels/shell', null, appRoot[0]);
            });
        });
    });

String.prototype.hashCode = function () {
    for (var ret = 0, i = 0, len = this.length; i < len; i++) {
        ret = (31 * ret + this.charCodeAt(i)) << 0;
    }
    return ret;
}

function random(max) {
    return Math.floor((Math.random() * max) + 1);
}

function createRandomWord(length) {
    var i, word = '', length = parseInt(length, 10),
        consonants = 'bcdfghjklmnpqrstvwxyz'.split(''),
        vowels = 'aeiou'.split('');
    for (i = 0; i < length / 2; i++) {
        var randConsonant = consonants[random(consonants.length - 1)],
            randVowel = vowels[random(vowels.length - 1)];
        word += (i === 0) ? randConsonant.toUpperCase() : randConsonant;
        word += i * 2 < length - 1 ? randVowel : '';
    }
    return word;
}