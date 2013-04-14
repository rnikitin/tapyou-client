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
        this.username = name;
        this.channel = room;
        var p = this.$.Deferred();
        this.app.trigger('socket:init');
        var me = this;
        var socket = io.connect("http://tapyou-server.azurewebsites.net");
        me.socket = socket;
        socket.emit("join", {
            name: name,
            room: room
        });
        p.resolve();
        me.events();
        return p.promise();
    };
    sockets.prototype.sendMessage = function (message) {
        this.socket.emit('message:sent', message);
    };
    sockets.prototype.getUsersInRoom = function () {
        this.socket.emit('get:users', this.channel);
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
        socket.on('result:users', function (users) {
            me.app.trigger('result:users', users);
        });
    };
    return sockets;
})();
