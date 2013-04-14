/// <reference path="../../typings/knockout/knockout.d.ts" />
/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />
/// <reference path="../../typings/durandal/durandal.d.ts" />

define(["require", 'durandal/app', 'jquery', 'ko', 'backend/sockets'], function (require, app: IDurandalApp, $: JQueryStatic, ko: KnockoutStatic, sockets: ISocketClient) {

    var $view: JQuery;

    /// knockout extension
    $.extend(ko.bindingHandlers,
        {
            returnKey: {
                init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                    ko.utils.registerEventHandler(element, 'keydown', function (evt) {
                        if (evt.keyCode === 13) {
                            evt.preventDefault();
                            evt.target.blur();
                            valueAccessor().call(viewModel);
                        }
                    });
                }
            }
        });

    return new panel(app, sockets, ko, $);
});

class panel {
    public users = ko.observableArray([]);
    public messages = ko.observableArray([]);
    public newMessage = ko.observable('');

    private $view: JQuery;
    private app: IDurandalApp;
    private sockets: ISocketClient;
    private $: JQueryStatic;
    private ko: KnockoutStatic;

    constructor(app: IDurandalApp, sockets: ISocketClient, ko: KnockoutStatic, $: JQueryStatic) {
        var me = this;

        // save private
        this.app = app;
        this.sockets = sockets;
        this.$ = $;
        this.ko = ko;

        // init public
        this.users = ko.observableArray([]);
        this.messages = ko.observableArray([]);
        this.newMessage = ko.observable('');

        // request users in room
        sockets.getUsersInRoom();

        // returned from server list of users in current room
        app.on('result:users', (users: string[]) =>
        {
            this.users(users);
        }, this);

        // new user connected to room
        app.on('user:connected', (name: string) =>
        {
            this.users.push(name);
        }, this);

        app.on('user:disconnected', (name: string) =>
        {
            this.users.remove(name);
        }, this);

        app.on('message:new', (message: ISocketMessage) =>
        {
            this.messages.push(message);
        }, this);
    }

    public viewAttached(view) {
        this.$view = this.$(view);
    };

    public expanderClicked() {
        if (this.$view.hasClass('on')) {
            this.hidePanel();
        }
        else {
            this.showPanel();
        }
    };

    public messagesListRendered() {
        
    }

    public sendMessage() {
        var username = this.sockets.username;
        this.sockets.sendMessage({
            from: username, text: this.newMessage(), when: new Date()
        });
        this.newMessage('');
    }

    ////////// private
    private hidePanel() {
        this.$view.animate({ right: -this.$view.width() }, () => {
            this.$view.removeClass('on').css('right', '');
            this.app.trigger("panel:closed");
        });
    }

    private showPanel() {
        var me = this;
        this.$view.animate({ right: 0 }, () => {
            me.$view.addClass('on').css('right', '')
            me.app.trigger("panel:opened");
        });
    }
}