/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />

define(['jquery'], function ($: JQueryStatic) {

    return new htmlHelpers($);
});

class htmlHelpers
{
    private $: JQueryStatic;
    constructor($: JQueryStatic)
    {
        this.$ = $;
    }

    public loadCss(href: string){
        this.$('<link rel="stylesheet" type="text/css" href="' + href + '" >')
            .appendTo("head");
    }
}