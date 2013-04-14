/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />
/// <reference path="../../typings/durandal/durandal.d.ts" />

define(["require", 'helpers/html'], function (require, html: HtmlHelper) {

    // viewModel
    function shell() {

        html.loadCss('/client/Content/app.css');
    }

    shell.prototype.viewAttached = function (view) {
    };

    return shell;
});

