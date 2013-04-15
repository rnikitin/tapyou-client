/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />
/// <reference path="../../typings/socket.io/socket.io.d.ts" />

define(['jquery', 'durandal/app'], function ($: JQueryStatic, app) {

    // initialize socket connection
    return new sockets($, app);
});

class sockets {
    private $: JQueryStatic;
    private app;
    private socket: Socket;
    public username;
    public channel;
    
    constructor($: JQueryStatic, app) {
        this.$ = $;
        this.app = app;
    }

    public init(room: string, name: string): JQueryPromise {
        var me = this;
        this.username = name;
        this.channel = room;
        var p = this.$.Deferred();
        this.app.trigger('socket:init');
        // todo: hide IO from global scope

        // connect
        //var socket = io.connect("http://tapyou-server.azurewebsites.net");

        var socket = io.connect("http://localhost:31337");
        me.socket = socket;

        // handle server-side events
        socket.on('connected', () =>
        {
            console.log('connected');
            // send name and join the room
            socket.emit("join", { name: me.username, room: me.channel });
            me.events();
            // resolve promise
            p.resolve();
        });

        return p.promise();
    }

    public sendMessage(message: ISocketMessage) {
        this.socket.emit('message:sent', message);
    }

    public getUsersInRoom(callback) {
        this.socket.emit('get:users', this.channel, callback);
    }

    ////////////////////////////// private
    private events() {
        var me = this;
        var socket = this.socket;

        
        socket.on('message:new', (message: ISocketMessage) =>
        {
            me.app.trigger('message:new', message);
        });

        socket.on('user:connected', (name: string) =>
        {
            me.app.trigger('user:connected', name);
        });

        socket.on('user:disconnected', (name: string) =>
        {
            me.app.trigger('user:disconnected', name);
        });
    }
}