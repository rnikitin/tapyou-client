/// <reference path="../../../../Scripts/typings/knockout.mapping/knockout.mapping.d.ts" />
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

import app = module('durandal/app');
import E = module('tasks/models/events');
import signalR = module('tasks/backend/signalR');

class ctor {

    private $view: JQuery;
    private $container: JQuery;
    private settings: IPersonDetailsWidgetOptions = {};
    public tasks: KnockoutObservableArray = ko.observableArray([]);
    public person: KnockoutObservableAny = ko.observable();

    constructor(element, options) {
        this.$container = $(element);
        $.extend(this.settings, options);

        // add person to observable
        this.person(this.settings.person);

        app.trigger(E.person.widgets.detailsOpen, this);

        this.load();
    }

    public viewAttached(view) {
        this.$view = $(view);

        // hide view
        this.$view.slideDown();
        this.$view.closest('li.item').addClass('on');
    }

    public hide() {
        this.$view.closest('li.item.on').removeClass('on');

        this.$view.slideUp(function () {
            $(this).remove();
        });

        app.trigger(E.map.deselect, this.settings.person.Id);
    }

    public sendTasksToPerson() {
        var me = this;

        // update person observable
        // todo: replace this code with not harcoded one
        this.person().AssignedCount = 0;
        this.person.valueHasMutated();

        app.trigger(E.page.loading);
        signalR.personsHub.server.sendTasksToPerson(this.settings.person.Id).done((result: bool) =>
        {
            app.trigger(E.page.loaded);

            if (result) {
                // reload tasks
                me.load();
                // todo: maybe notify person to reload
            }
            else {
                app.trigger(E.app.error, "Невозможно достучаться до курьеров. Попробуйте позже!");
            }
        });
    }

    private load() {
        var me = this;

        // load tasks
        app.trigger(E.page.loading);
        signalR.tasksHub.server.listTasksByPerson(this.settings.person.Id, this.settings.date.toDate())
        .done((result) =>
        {
            ko.mapping.fromJS(result, {}, me.tasks);
            me.notifyMap();
            app.trigger(E.page.loaded);
        });
    }

    private notifyMap() {
        var unwrapTasks = ko.toJS(this.tasks);
        app.trigger(E.map.tasksShowed, unwrapTasks, true, this.settings.person.Id);
        app.trigger(E.map.personSelected, this.settings.person.Id);
    }
}

// hack TypeScript
declare var exports;
exports.model = ctor;