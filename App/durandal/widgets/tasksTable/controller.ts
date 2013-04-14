/// <reference path="../../../../Scripts/typings/app/app.d.ts" />
/// <reference path="../../../../Scripts/typings/knockout/knockout.d.ts" />
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
import widget = module('durandal/widget');


class ctor {

    private $container: JQuery;
    private $view: JQuery;
    private settings: ITaskTableWidgetOptions = { animate: false };
    //public sortedTasks: KnockoutComputed = ko.computed(() =>
    //{
    //    return this.tasks.sort((left, right) => { return left.Number() == right.Number() ? 0 : (left.Number() < right.Number() ? -1 : 1) });
    //});

    constructor(element, settings) {
        this.$container = element;

        $.extend(this.settings, settings);

    }

    public viewAttached(view) {
        var me = this;
        this.$view = $(view);

        if (this.settings.animate) {
            this.$view.hide().slideDown();
        }
    }

    public selectTask(data, event) {
        var $target = $(event.currentTarget);
        // create container
        var v = $('<div class="sub" />').insertBefore($target);
        // create task details widget
        widget.create(v[0], { kind: 'taskDetails', target: $target, id: data.Id() });
    }
}

declare var exports;
exports.model = ctor;