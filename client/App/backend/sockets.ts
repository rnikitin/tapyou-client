/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />
/// <reference path="../../typings/socket.io/socket.io.d.ts" />

define(['jquery'], function ($: JQueryStatic) {

    // initialize socket connection

    var sockets = () => {
    };

    sockets.prototype.init = () =>
    {
        var me = this;
        $.getScript('http://localhost:31337/socket.io/socket.io.js', () =>
        {
            // todo: hide IO from global scope

            // connect
            var socket = io.connect("http://localhost:31337");
        });
    }

    return new sockets();
});