﻿define([
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
        sockets.getUsersInRoom();
        setTimeout(function () {
            sockets.getUsersInRoom();
        }, 3000);
        app.on('result:users', function (users) {
            _this.users(users);
        }, this);
        app.on('user:connected', function (name) {
            _this.users.push(name);
        }, this);
        app.on('user:disconnected', function (name) {
            _this.users.remove(name);
        }, this);
        app.on('message:new', function (message) {
            _this.messages.push(message);
        }, this);
    }
    panel.prototype.viewAttached = function (view) {
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
