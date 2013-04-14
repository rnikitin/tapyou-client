/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />

define(['jquery'], function ($: JQueryStatic) {

    var htmlHelpers = () => {
    };

    htmlHelpers.prototype.loadCss = (href: string) => {
        $('<link rel="stylesheet" type="text/css" href="' + href + '" >')
            .appendTo("head");
    }

    return new htmlHelpers();
});
