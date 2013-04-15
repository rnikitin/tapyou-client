define([
    "require", 
    'durandal/app', 
    'jquery', 
    'ko', 
    'backend/sockets'
], function (require, app, $, ko, sockets) {
    var $view;
    $.extend(ko.bindingHandlers, {
        returnKey: {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                ko.utils.registerEventHandler(element, 'keydown', function (evt) {
                    if(evt.keyCode === 13) {
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
var panel = (function () {
    function panel(app, sockets, ko, $) {
        var _this = this;
        this.users = ko.observableArray([]);
        this.messages = ko.observableArray([]);
        this.newMessage = ko.observable('');
        var me = this;
        this.app = app;
        this.sockets = sockets;
        this.$ = $;
        this.ko = ko;
        this.users = ko.observableArray([]);
        this.messages = ko.observableArray([]);
        this.newMessage = ko.observable('');
        app.on('user:connected', function (name) {
            _this.users.push(name);
        }, this);
        app.on('user:disconnected', function (name) {
            _this.users.remove(name);
        }, this);
        app.on('message:new', function (message) {
            _this.messages.push(message);
        }, this);
        var room = window.location.href.hashCode();
        var name = createRandomWord(6);
        this.sockets.init(room, name).done(function () {
            me.sockets.getUsersInRoom(function (users) {
                console.log('callback', users);
                me.users(users);
            });
        });
    }
    panel.prototype.viewAttached = function (view) {
        var me = this;
        this.$view = this.$(view);
    };
    panel.prototype.expanderClicked = function () {
        if(this.$view.hasClass('on')) {
            this.hidePanel();
        } else {
            this.showPanel();
        }
    };
    panel.prototype.messagesListRendered = function () {
    };
    panel.prototype.sendMessage = function () {
        var username = this.sockets.username;
        this.sockets.sendMessage({
            from: username,
            text: this.newMessage(),
            when: new Date()
        });
        this.newMessage('');
    };
    panel.prototype.hidePanel = function () {
        var _this = this;
        this.$view.animate({
            right: -this.$view.width()
        }, function () {
            _this.$view.removeClass('on').css('right', '');
            _this.app.trigger("panel:closed");
        });
    };
    panel.prototype.showPanel = function () {
        var me = this;
        this.$view.animate({
            right: 0
        }, function () {
            me.$view.addClass('on').css('right', '');
            me.app.trigger("panel:opened");
        });
    };
    return panel;
})();
String.prototype.hashCode = function () {
    for(var ret = 0, i = 0, len = this.length; i < len; i++) {
        ret = (31 * ret + this.charCodeAt(i)) << 0;
    }
    return ret;
};
function random(max) {
    return Math.floor((Math.random() * max) + 1);
}
function createRandomWord(length) {
    var i, word = '', length = parseInt(length, 10), consonants = 'bcdfghjklmnpqrstvwxyz'.split(''), vowels = 'aeiou'.split('');
    for(i = 0; i < length / 2; i++) {
        var randConsonant = consonants[random(consonants.length - 1)], randVowel = vowels[random(vowels.length - 1)];
        word += (i === 0) ? randConsonant.toUpperCase() : randConsonant;
        word += i * 2 < length - 1 ? randVowel : '';
    }
    return word;
}
