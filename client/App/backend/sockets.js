define([
    'jquery'
], function ($) {
    var _this = this;
    var sockets = function () {
    };
    sockets.prototype.init = function () {
        var me = _this;
        $.getScript('http://localhost:31337/socket.io/socket.io.js', function () {
            var socket = io.connect("http://localhost:31337");
        });
    };
    return new sockets();
});
