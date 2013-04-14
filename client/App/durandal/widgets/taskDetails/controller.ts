/// <reference path="../../../../Scripts/typings/knockout/knockout.d.ts" />
/// <reference path="../../../../Scripts/typings/app/app.d.ts" />
/// <reference path="../../../../Scripts/typings/requirejs/require.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore-typed.d.ts" />
/// <reference path="../../../../Scripts/typings/bootstrap/bootstrap.d.ts" />
/// <reference path="../../../../Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../../../Scripts/typings/durandal/durandal.d.ts" />

/*
// --------------------------------------------------------------------------------------------------------------------
// <copyright file="tasksTable.ts" company="ePythia Labs">
//   Created: 3/4/2013 2:56 - by Roman
//   Project: CompasPlus.Web.Site
//   Copyright (c) 2013 ePythia Labs & ePythia Corporation
// </copyright>
// <summary>
//   
// </summary>
// --------------------------------------------------------------------------------------------------------------------
*/

import E = module('tasks/models/events');
import app = module('durandal/app');
import signalR = module('tasks/backend/signalR');
import dal = module('tasks/backend/dal');

class ctor {

    private $view: JQuery;
    private $container: JQuery;
    private settings: ITaskDetailsWidgetOptions = {};

    public model = ko.observable({
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

    public persons = ko.observableArray();

    public validate;

    constructor(element, options: ITaskDetailsWidgetOptions) {
        var me = this;

        this.$container = $(element);
        $.extend(this.settings, options);

        if (!this.settings.id) {
            throw new Error("id must be specified to load task details.");
        }

        // create bindex handler
        this.validate = _.bind(this.validatedText, this);

        // load data
        this.load();

        this.events();

        // notify map
        app.trigger(E.map.taskSelected, this.settings.id);
    }

    public load() {
        var me = this;

        app.trigger(E.page.loading);

        // loading task
        signalR.tasksHub.server.getTask(this.settings.id)
        .done((result) =>
        {
            me.model(result);
        })
        .always(() =>
        {
            app.trigger(E.page.loaded);
        });

        // load persons
        dal.getPersons().done((result) =>
        {
            me.persons(result);
        });
    }

    private events() {
        // if task was modified outside, we will try to reload it
        app.on(E.tasks.changed, (taskId: string) =>
        {
            if (this.model() && this.model().Id == taskId) {
                this.load();
            }
        }, this);
    }

    public viewAttached(view) {
        this.$view = $(view);
        // hide target
        this.$view.slideDown();
        this.settings.target.slideUp();

        app.trigger(E.tasks.widgets.detailsActivated, this);
    }


    ///////////////////////// click handlers

    public editTask(data) {
        app.trigger(E.tasks.startEdit, data.Id);
    }

    public deleteTask(data) {
        // notify server
        signalR.tasksHub.server.deleteTask(data.Id);

        // notify app
        app.trigger(E.tasks.deleted, data.Id);

        // hide dialog
        this.hide();
    }

    public attachPerson(data) {
        // notify server
        app.trigger(E.page.loading);
        signalR.tasksHub.server.attachPerson(this.model().Id, data.Id)
        .always(() =>
        {
            app.trigger(E.page.loaded);
        });
    }

    ///////////////////////// public members
    public hide() {
        var me = this;
        this.settings.target.slideDown();
        this.$container.slideUp(function () {
            me.$container.remove();
        });

        // notify map to clear selection
        app.trigger(E.map.deselect, this.settings.id);
    }

    ///////////////////////// extensions

    private validatedText(value, name: string) {
        var isValid = true;
        if (!value) {
            value = "неизвестно";
            isValid = false;
        }

        if (_.contains(this.model().Errors, name)) {
            isValid = false;
        }

        return { text: value, isValid: isValid };
    }

    public DateString() {
        if (!this.model() || !this.model().From) {
            return "неизвестно";
        }

        return moment(this.model().From).local().format('L');
    }

    public totalPrice() {
        var totalPrice = 0;

        if (this.model()) {
            // calculate all products
            _.each(this.model().Products, (item) =>
            {
                totalPrice += item.Price * item.Quantity;
            });

            // calculate delivery
            totalPrice += this.model().DeliveryPrice;
        }

        return totalPrice;
    }
}

// knockout binder
$.extend(ko.bindingHandlers,
    {
        validatedText: {
            init: function (element, valueAccessor) {
                var value = ko.utils.unwrapObservable(valueAccessor()); // Get the current value of the current property we're bound to

                if (!value.isValid) {
                    $(element).addClass('invalid');
                }

                $(element).text(value.text);
            },
            update: function (element, valueAccessor, allBindingsAccessor) {
                // Leave as before
            }
        }
    });

// hack TypeScript
declare var exports;
exports.model = ctor;