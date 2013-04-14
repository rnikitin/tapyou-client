define([
    "require", 
    'durandal/app', 
    'jquery'
], function (require, app, $) {
    var $view;
    function panel() {
    }
    panel.prototype.viewAttached = function (view) {
        $view = $(view);
    };
    panel.prototype.expanderClicked = function () {
        if($view.hasClass('on')) {
            hidePanel();
        } else {
            showPanel();
        }
    };
    function hidePanel() {
        $view.animate({
            right: -$view.width()
        }, function () {
            $view.removeClass('on').css('right', '');
            app.trigger("panel:closed");
        });
    }
    function showPanel() {
        $view.animate({
            right: 0
        }, function () {
            $view.addClass('on').css('right', '');
            app.trigger("panel:opened");
        });
    }
    return panel;
});
