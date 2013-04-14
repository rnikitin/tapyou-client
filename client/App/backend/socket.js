define([
    'jquery'
], function ($) {
    var io;
    var old_io = window['io'];
    function io() {
    }
    io.prototype.init = function () {
        $.getScript('http://localhost:31337/socket.io/socket.io.js', function () {
            io = window['io'];
            window['io'] = old_io;
            var socket = io.connect("http://localhost:31337");
        });
    };
    return io;
});
