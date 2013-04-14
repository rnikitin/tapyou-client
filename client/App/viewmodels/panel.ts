/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />
/// <reference path="../../typings/durandal/durandal.d.ts" />

define(["require", 'durandal/app', 'jquery'], function (require, app: IDurandalApp, $) {

    var $view: JQuery;

    // viewModel
    function panel() {

    }

    panel.prototype.viewAttached = (view) => {
        $view = $(view);
    };

    panel.prototype.expanderClicked = () => {
        if ($view.hasClass('on')) {
            hidePanel();
        }
        else {
            showPanel();
        }
    }

    function hidePanel() {
        $view.animate({ right: -$view.width() }, () => {
            $view.removeClass('on').css('right', '');
            app.trigger("panel:closed");
        });
    }

    function showPanel() {
        $view.animate({ right: 0 }, () => {
            $view.addClass('on').css('right', '')
            app.trigger("panel:opened");
        });
    }

    return panel;
});

