// jQuery Cutline Plugin
// Copyright (C) 2010 Michael De Soto.
// Copyright (C) 2009 Caius Durling.
// Copyright (C) 2008 Brian Reavis.
//
// http://github.com/quarghost/jQuery-Cutline
// $Date$

jQuery.fn.extend({
    cutline: function(oo) {
        var o = $.extend({
            speedOver: 'fast',      // Mouseover effect speed.
            speedOut: 'normal',     // Mouseout effect speed.
            hideDelay: 2500,        // Delay in ms before hiding cutline.
            animation: 'slide',     // Choose 'fade' or 'slide'.
            prefix: '',             // Prepend text/html to cutline.
            className: 'cutline'    // CSS class applied to cutline.
        }, oo);

        $(this).each(function(){
            var img = this;
            $(this).load(function(){
                $this = img;
                if (this.hasInit){
                    return false;
                }
                this.hasInit = true;
                var cutlineHover = false;
                var imgHover = false;

                // Use cutline in alternative element specified in rel when it
                // exists. Otherwise use copy specified in title attribute. We
                // fallback on alt attribute when title attribute is empty.
                var cutlineRel = $('#' + $(this).attr('rel'));
                var cutlineTitle = !cutlineRel.length ? $(this).attr('title') : cutlineRel.html();
                var cutlineAlt = !cutlineTitle.length ? $(this).attr('alt') : cutlineTitle;
                cutlineRel.remove();

                var toWrap = this.parent && this.parent.tagName == 'a' ? this.parent : $(this);
                var wrapper = toWrap.wrap('<div></div>').parent();
                wrapper.css({
                    overflow: 'hidden',
                    padding: 0,
                    fontSize: 0.1
                });
                wrapper.addClass('cutline-wrapper');
                wrapper.width($(this).width());
                wrapper.height($(this).height());

                // Use border properties from img on wrapper.
                $.map(['top', 'right', 'bottom', 'left'], function(i){
                    $.map(['style', 'width', 'color'], function(j){
                        var key = 'border-' + i + '-' + j;
                        wrapper.css(key, $(img).css(key));
                    });
                });

                $(img).css({border: '0 none'});

                // Transfer margin properties from img to wrapper
                $.map(['top', 'right', 'bottom', 'left'], function(t){
                    var key = 'margin-' + t;
                    wrapper.css(key, $(img).css(key));
                });

                // In order to keep the cutline copy readable when using a 
                // translucent background, we keep the two separated.
                var cutline = $('div:last', wrapper.append('<div></div>')).addClass(o.className);
                var cutlineCopy = $('div:last', wrapper.append('<div></div>')).addClass(o.className).append(o.prefix).append(cutlineAlt);

                // Reset inherited margins and show cutline.
                $('*', wrapper).css({margin: 0}).show();

                // Be sure background div is on bottom of stack.
                var cutlinePosition = jQuery.browser.msie ? 'static' : 'relative';
                cutline.css({
                    zIndex: 1,
                    position: cutlinePosition
                });

                // Clear background and border properties from cutline copy.
                // Here we also make sure copy is fully opaque.
                cutlineCopy.css({
                    position: cutlinePosition,
                    zIndex: 2,
                    background: 'none',
                    border: '0 none',
                    opacity: 1.0
                });
                cutline.width(cutlineCopy.outerWidth());
                cutline.height(cutlineCopy.outerHeight());

                // Make sure copy sits on top of background.
                cutlineCopy.css({ 'marginTop': -cutline.outerHeight() });

                // Function pushing cutline from view.
                var cutlineHide = function(){
                    if (!cutlineHover && !imageHover)
                        cutline.animate({ marginTop: 0 }, o.speedOut); 
                };
                
                $(this).hover(

                    // Mouseover event.
                    function(){ 
                        imageHover = true;
                        if (!cutlineHover) {
                            cutline.animate({
                                marginTop: -cutline.height()
                            }, o.speedOver);
                        }
                    },

                    // Mouseout event.
                    function(){ 
                        imageHover = false;
                        window.setTimeout(cutlineHide, o.hideDelay);
                    }
                );

                // When mouse over cutline, cutline is sibling of image.
                $('div', wrapper).hover(
                    function(){ cutlineHover = true; },
                    function(){ cutlineHover = false; window.setTimeout(cutlineHide, o.hideDelay); }
                );
            });

            // If image already loaded, force invocation of load function.
            if (this.complete || this.naturalWidth > 0){
                $(img).trigger('load');
            }
        });
    }
});