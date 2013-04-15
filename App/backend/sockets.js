define([
    'jquery', 
    'durandal/app'
], function ($, app) {
    return new sockets($, app);
});
var sockets = (function () {
    function sockets($, app) {
        this.$ = $;
        this.app = app;
    }
    sockets.prototype.init = function (room, name) {
        var me = this;
        this.username = name;
        this.channel = room;
        var p = this.$.Deferred();
        this.app.trigger('socket:init');
        var socket = io.connect("http://localhost:31337");
        me.socket = socket;
        socket.on('connected', function () {
            console.log('connected');
            socket.emit("join", {
                name: me.username,
                room: me.channel
            });
            me.events();
            p.resolve();
        });
        return p.promise();
    };
    sockets.prototype.sendMessage = function (message) {
        this.socket.emit('message:sent', message);
    };
    sockets.prototype.getUsersInRoom = function (callback) {
        this.socket.emit('get:users', this.channel, callback);
    };
    sockets.prototype.events = function () {
        var me = this;
        var socket = this.socket;
        socket.on('message:new', function (message) {
            me.app.trigger('message:new', message);
        });
        socket.on('user:connected', function (name) {
            me.app.trigger('user:connected', name);
        });
        socket.on('user:disconnected', function (name) {
            me.app.trigger('user:disconnected', name);
        });
    };
    return sockets;
})();
