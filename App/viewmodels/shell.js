define([
    "require", 
    'helpers/html'
], function (require, html) {
    function shell() {
        html.loadCss('/Content/app.css');
    }
    shell.prototype.viewAttached = function (view) {
    };
    return shell;
});
