define(["require", "exports", 'tasks/models/events', 'durandal/app', 'tasks/backend/signalR', 'tasks/backend/dal'], function(require, exports, __E__, __app__, __signalR__, __dal__) {
    var E = __E__;

    var app = __app__;

    var signalR = __signalR__;

    var dal = __dal__;

    var ctor = (function () {
        function ctor(element, options) {
            this.settings = {
            };
            this.model = ko.observable({
                Number: "",
                StateCode: 0,
                persons: [],
                Address: "",
                TimePeriod: '',
                Station: null,
                Contact: "",
                Phones: [],
                Email: "",
                Note: '',
                Products: [],
                DeliveryPrice: 0
            });
            this.persons = ko.observableArray();
            var me = this;
            this.$container = $(element);
            $.extend(this.settings, options);
            if(!this.settings.id) {
                throw new Error("id must be specified to load task details.");
            }
            this.validate = _.bind(this.validatedText, this);
            this.load();
            this.events();
            app.trigger(E.map.taskSelected, this.settings.id);
        }
        ctor.prototype.load = function () {
            var me = this;
            app.trigger(E.page.loading);
            signalR.tasksHub.server.getTask(this.settings.id).done(function (result) {
                me.model(result);
            }).always(function () {
                app.trigger(E.page.loaded);
            });
            dal.getPersons().done(function (result) {
                me.persons(result);
            });
        };
        ctor.prototype.events = function () {
            var _this = this;
            app.on(E.tasks.changed, function (taskId) {
                if(_this.model() && _this.model().Id == taskId) {
                    _this.load();
                }
            }, this);
        };
        ctor.prototype.viewAttached = function (view) {
            this.$view = $(view);
            this.$view.slideDown();
            this.settings.target.slideUp();
            app.trigger(E.tasks.widgets.detailsActivated, this);
        };
        ctor.prototype.editTask = function (data) {
            app.trigger(E.tasks.startEdit, data.Id);
        };
        ctor.prototype.deleteTask = function (data) {
            signalR.tasksHub.server.deleteTask(data.Id);
            app.trigger(E.tasks.deleted, data.Id);
            this.hide();
        };
        ctor.prototype.attachPerson = function (data) {
            app.trigger(E.page.loading);
            signalR.tasksHub.server.attachPerson(this.model().Id, data.Id).always(function () {
                app.trigger(E.page.loaded);
            });
        };
        ctor.prototype.hide = function () {
            var me = this;
            this.settings.target.slideDown();
            this.$container.slideUp(function () {
                me.$container.remove();
            });
            app.trigger(E.map.deselect, this.settings.id);
        };
        ctor.prototype.validatedText = function (value, name) {
            var isValid = true;
            if(!value) {
                value = "неизвестно";
                isValid = false;
            }
            if(_.contains(this.model().Errors, name)) {
                isValid = false;
            }
            return {
                text: value,
                isValid: isValid
            };
        };
        ctor.prototype.DateString = function () {
            if(!this.model() || !this.model().From) {
                return "неизвестно";
            }
            return moment(this.model().From).local().format('L');
        };
        ctor.prototype.totalPrice = function () {
            var totalPrice = 0;
            if(this.model()) {
                _.each(this.model().Products, function (item) {
                    totalPrice += item.Price * item.Quantity;
                });
                totalPrice += this.model().DeliveryPrice;
            }
            return totalPrice;
        };
        return ctor;
    })();    
    $.extend(ko.bindingHandlers, {
        validatedText: {
            init: function (element, valueAccessor) {
                var value = ko.utils.unwrapObservable(valueAccessor());
                if(!value.isValid) {
                    $(element).addClass('invalid');
                }
                $(element).text(value.text);
            },
            update: function (element, valueAccessor, allBindingsAccessor) {
            }
        }
    });
    exports.model = ctor;
})
