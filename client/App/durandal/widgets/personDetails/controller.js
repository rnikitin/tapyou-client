define(["require", "exports", 'durandal/app', 'tasks/models/events', 'tasks/backend/signalR'], function(require, exports, __app__, __E__, __signalR__) {
    var app = __app__;

    var E = __E__;

    var signalR = __signalR__;

    var ctor = (function () {
        function ctor(element, options) {
            this.settings = {
            };
            this.tasks = ko.observableArray([]);
            this.person = ko.observable();
            this.$container = $(element);
            $.extend(this.settings, options);
            this.person(this.settings.person);
            app.trigger(E.person.widgets.detailsOpen, this);
            this.load();
        }
        ctor.prototype.viewAttached = function (view) {
            this.$view = $(view);
            this.$view.slideDown();
            this.$view.closest('li.item').addClass('on');
        };
        ctor.prototype.hide = function () {
            this.$view.closest('li.item.on').removeClass('on');
            this.$view.slideUp(function () {
                $(this).remove();
            });
            app.trigger(E.map.deselect, this.settings.person.Id);
        };
        ctor.prototype.sendTasksToPerson = function () {
            var me = this;
            this.person().AssignedCount = 0;
            this.person.valueHasMutated();
            app.trigger(E.page.loading);
            signalR.personsHub.server.sendTasksToPerson(this.settings.person.Id).done(function (result) {
                app.trigger(E.page.loaded);
                if(result) {
                    me.load();
                } else {
                    app.trigger(E.app.error, "Невозможно достучаться до курьеров. Попробуйте позже!");
                }
            });
        };
        ctor.prototype.load = function () {
            var me = this;
            app.trigger(E.page.loading);
            signalR.tasksHub.server.listTasksByPerson(this.settings.person.Id, this.settings.date.toDate()).done(function (result) {
                ko.mapping.fromJS(result, {
                }, me.tasks);
                me.notifyMap();
                app.trigger(E.page.loaded);
            });
        };
        ctor.prototype.notifyMap = function () {
            var unwrapTasks = ko.toJS(this.tasks);
            app.trigger(E.map.tasksShowed, unwrapTasks, true, this.settings.person.Id);
            app.trigger(E.map.personSelected, this.settings.person.Id);
        };
        return ctor;
    })();    
    exports.model = ctor;
})
