define([
    'jquery'
], function ($) {
    return new htmlHelpers($);
});
var htmlHelpers = (function () {
    function htmlHelpers($) {
        this.$ = $;
    }
    htmlHelpers.prototype.loadCss = function (href) {
        this.$('<link rel="stylesheet" type="text/css" href="' + href + '" >').appendTo("head");
    };
    return htmlHelpers;
})();
