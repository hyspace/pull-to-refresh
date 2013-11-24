(function($) {
    function addListener(el, type, listener, useCapture) {
        el.addEventListener(type, listener, useCapture);
        return { 
            destroy: function() { el.removeEventListener(type, listener, useCapture); } 
        };   
    }
    $.ScrollView = function(selector) {
        // verify os and version.
        // if ($.os.android && $.os.version.substring(0, 1) < 4) {
        //     console.log('error: do not support Android 3-');
        //     return;
        // } else if ($.os.ios && $.os.version.substring(0, 1) < 5) {
        //     console.log('error: do not support iOS 4-');
        //     return;
        // } else if (!$.os.ios && !$.os.android){
        //     console.log('error: only support iOS 5+ and Android 4+');
        //     return;
        // }
        //elements
        this.el = {};
        this.el.top = document.querySelector(selector);
        this.el.root = this.el.top.querySelector('.zui-scroll-view-main');
        this.el.topLoading = this.el.top.querySelector('.zui-scroll-view-top-loading');
        this.el.warper = this.el.top.querySelector('.zui-scroll-view-warper');
        this.el.scroller = this.el.top.querySelector('.zui-scroll-view-scroller');
        if (!this.el.top || !this.el.root || !this.el.topLoading || !this.el.warper || !this.el.scroller) {
            console.log('error: element[s] not found.');
            return;
        }

        this.activeHeight = 0;
        this.barHeight = this.el.topLoading.getBoundingClientRect().height;
        this.activeHeight = this.el.top.getBoundingClientRect().height;

        //stat parms
        this.topActivated = false;
        this.readyToActivate = false;

        //add listeners
        this.el.root.addEventListener('touchstart', this, false);
        this.el.scroller.addEventListener('touchmove', this, false);
        this.el.root.addEventListener('touchend', this, false);
        this.el.root.addEventListener('touchcancel', this, false);
        this.el.root.addEventListener('webkitTransitionEnd', this, false);


        this.draging = {};
        //stat parms only for android
        this.draging.pre = 0;
        this.listeners = [];
    };
    $.ScrollView.prototype = $.extend({
        constructor: $.ScrollView,
        finishLoading: function(argument) {
            this.topActivated = false;
            $(this.el.top).removeClass('top-activated top-animating');
            this.el.root.style.webkitTransform = 'translate3d(0,0,0)';
            $(this.el.root).height(this.activeHeight);
            var evt = document.createEvent('Events')
            evt.initEvent('scrollview.finish',false,false);
            evt.targetScrollView = this;
            this.el.top.dispatchEvent(evt);
        },
        startLoading:function(){
            this.topActivated = true;
            $(this.el.top).addClass('top-activated');
            this.el.root.style.webkitTransform = 'translate3d(0,' + this.barHeight + 'px,0)';
            var evt = document.createEvent('Events')
            evt.initEvent('scrollview.pull',false,false);
            evt.targetScrollView = this;
            this.el.top.dispatchEvent(evt);
        },
        isLoading:function(){
            return this.topActivated;
        },
        on:function (_eventName,fun) {
            eventName = _eventName.toLowerCase();
            if(typeof fun !== 'function')return;
            switch(eventName){
                case 'scrollview.pull':
                case 'scrollview.finish':
                    this.listeners.push(addListener(this.el.top,eventName,fun,false));
                break;
            }
        },
        destoryListeners:function () {
            for(var i=0;i<this.listeners.length;i++){
                this.listeners[i].destroy();
            }
        }
    }, 
    
    // Touch Handling for Android Devices
    (navigator.userAgent.search('Android')!=-1) ? {
        handleEvent: function(e) {
            switch (e.type) {
            case 'webkitTransitionEnd':
                if (this.topActivated) {
                    if (e.target == this.el.root) {
                        $(this.el.root).height(this.activeHeight - this.barHeight);
                    }
                } else {
                    $(this.el.top).removeClass('top-animating');
                }
                break;
            case 'touchstart':
                if(!this.topActivated && e.touches.length==1){
                    this.activeHeight = this.el.top.getBoundingClientRect().height;
                }
                break;
            case 'touchmove':
                e.preventDefault();
                
                if (!this.topActivated) {
                    if (!this.draging.isDraging && this.el.warper.scrollTop <= 0) {
                        this.draging.pre++;
                        if (this.draging.pre > 2) {
                            this.draging.isDraging = true;
                            this.draging.start = e.touches[0].screenY;
                            this.draging.pre = 0;
                            break;
                        }
                    }
                    if (this.draging.isDraging) {
                        
                        this.draging.offset = e.touches[0].screenY - this.draging.start;
                        var rubberOffset = this.draging.offset * 0.33;
                        if (this.draging.offset <= 0) {
                            this.draging.isDraging = false;
                            this.el.scroller.style.webkitTransform = 'translate3d(0,0,0)';
                            break;
                        }
                        if (rubberOffset > this.barHeight) {
                            this.readyToActivate = true;
                            $(this.el.top).addClass('top-activating');
                        } else {
                            this.readyToActivate = false;
                            $(this.el.top).removeClass('top-activating');
                        }
                        this.el.scroller.style.webkitTransform = 'translate3d(0,' + rubberOffset + 'px,0)';
                    }
                }
                break;
            case 'touchcancel':
            case 'touchend':
                $(this.el.top).removeClass('top-activating');
                if (this.draging.isDraging) {
                    if (this.readyToActivate) {
                        this.startLoading();
                    }
                    this.draging.isDraging = false;
                    $(this.el.top).addClass('top-animating');
                    this.el.scroller.style.webkitTransform = 'translate3d(0,0,0)';
                }
                this.draging.pre = 0;
                this.readyToActivate = false;
                break;
            }
        }
    } : 
    
    // Touch Handling for iOS Devices
    {
        handleEvent: function(e) {
            switch (e.type) {
            case 'webkitTransitionEnd':
                e.stopPropagation();
                if (this.topActivated && e.target == this.el.root) {
                    $(this.el.root).height(this.activeHeight - this.barHeight);
                }
                break;
            case 'touchstart':
                if(!this.topActivated && e.touches.length==1){
                    this.activeHeight = this.el.top.getBoundingClientRect().height;
                }
                break;
            case 'touchmove':
                e.stopPropagation();
                if (!this.topActivated && !!this.el.warper.scrollTop) {
                    if (-this.el.warper.scrollTop > this.barHeight) {
                        this.readyToActivate = true;
                        $(this.el.top).addClass('top-activating');
                    } else {
                        this.readyToActivate = false;
                        $(this.el.top).removeClass('top-activating');
                    }
                }
                break;
            case 'touchend':
                $(this.el.top).removeClass('top-activating');
                if (this.readyToActivate) {
                    this.startLoading();
                }
                this.readyToActivate = false;
                break;
            }
        }
    });
})($);
