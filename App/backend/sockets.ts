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
        this.username = name;
        this.channel = room;

        var p = this.$.Deferred();

        this.app.trigger('socket:init');

        var me = this;

        // todo: hide IO from global scope

        // connect
        var socket = io.connect("http://tapyou-server.azurewebsites.net");
        me.socket = socket;

        // send name and join the room
        socket.emit("join", { name: name, room: room });

        // resolve promise
        p.resolve();

        me.events();

        return p.promise();
    }

    public sendMessage(message: ISocketMessage) {
        this.socket.emit('message:sent', message);
    }

    public getUsersInRoom() {
        this.socket.emit('get:users', this.channel);
    }


    ////////////////////////////// private
    private events() {
        var me = this;
        var socket = this.socket;

        // handle server-side events
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

        socket.on('result:users', (users: string[]) =>
        {
            me.app.trigger('result:users', users);
        });
    }
}