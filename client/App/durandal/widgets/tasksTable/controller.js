define(["require", "exports", 'durandal/widget'], function(require, exports, __widget__) {
    
    var widget = __widget__;

    var ctor = (function () {
        function ctor(element, settings) {
            this.settings = {
                animate: false
            };
            this.$container = element;
            $.extend(this.settings, settings);
        }
        ctor.prototype.viewAttached = function (view) {
            var me = this;
            this.$view = $(view);
            if(this.settings.animate) {
                this.$view.hide().slideDown();
            }
        };
        ctor.prototype.selectTask = function (data, event) {
            var $target = $(event.currentTarget);
            var v = $('<div class="sub" />').insertBefore($target);
            widget.create(v[0], {
                kind: 'taskDetails',
                target: $target,
                id: data.Id()
            });
        };
        return ctor;
    })();    
    exports.model = ctor;
})
