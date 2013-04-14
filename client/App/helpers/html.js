define([
    'jquery'
], function ($) {
    var htmlHelpers = function () {
    };
    htmlHelpers.prototype.loadCss = function (href) {
        $('<link rel="stylesheet" type="text/css" href="' + href + '" >').appendTo("head");
    };
    return new htmlHelpers();
});
