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

        // connect to socket
        var room = window.location.href.hashCode();
        var name = createRandomWord(6);

        this.sockets.init(room, name).done(() =>
        {
            // ask for users
            me.sockets.getUsersInRoom((users: string[]) =>
            {
                console.log('callback', users);
                me.users(users);
            });
        });

    }

    public viewAttached(view) {
        var me = this;
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