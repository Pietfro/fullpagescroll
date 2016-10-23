/*
 * fullpagescroll.js v1.0.0
 * Athuor : Pietfro
 * Concept based on https://github.com/mystika/onepagescroll
 */

var fullpagescroll = function(selector, options) {
    this.pages = [];
    this.currentPage = 1;
    this.isPageChanging = false;
    this.keyUp = {
        38: 1,
        33: 1
    };
    this.keyDown = {
        40: 1,
        34: 1
    };

    this.def = {
        pageContainer: 'section',
        animationType: 'ease-in-out',
        animationTime: 500,
        infinite: false,
        pagination: true,
        keyboard: true,
        direction: 'vertical',
    };

    this.setting = this.extend({}, this.def, options);
    this.selector = selector;

}

/* initialization */
fullpagescroll.prototype.init = function() {
    var me = this;
    this.selector.addEventListener('wheel', this.onScrollEventHandler.bind(this));

    this.css(this.selector, {
        transition: 'transform ' + this.setting.animationTime + 'ms ' + this.setting.animationType
    });

    //allow keyboard input
    if (this.setting.keyboard) {
        this.selector.addEventListener('keydown', function(e) {
            if (keyUp[e.keyCode]) {
                this.changePage(1, this.pages.length, -1);
            } else if (keyDown[e.keyCode]) {
                this.changePage(this.pages.length, 1, 1);
            }
        });
    }

    this.selector.classList.add('ops-container');

    this.detectTransitionEnd() && this.selector.addEventListener(this.detectTransitionEnd(), function() {
        me.isPageChanging = false;
    });

    var bullet_list_container = null;
    /* create navigation bullets */
    if (this.setting.pagination) {
        bullet_list_container = document.createElement("ul");
        bullet_list_container.classList.add('ops-navigation');
    }

    var index = 1;
    [].forEach.call(this.selector.querySelectorAll(this.setting.pageContainer), function(obj) {
        if (me.setting.pagination) {
            var bullet_list = document.createElement('li');
            var bullet = document.createElement('a');
            bullet.setAttribute('data-targetindex', index);
            bullet.href = '#';
            bullet_list.appendChild(bullet);
            bullet_list_container.appendChild(bullet_list);
        }

        obj.classList.add('ops-page');

        if (me.setting.direction == 'horizontal') {
            me.css(obj, {
                left: (index - 1) * 100 + '%',
                position: 'absolute'
            });
        }

        me.pages.push(obj);
        obj.setAttribute('data-pageindex', index++);
    });

    if (this.setting.pagination) {
        this.selector.parentNode.appendChild(bullet_list_container);
        this.selector.parentNode.querySelector('a[data-targetindex="' + this.currentPage + '"]').classList.add('active');
    }


    /* swipe */
    var fpos = 0;
    var lpos = 0;
    var _n = 90;

    //bind touch
    this.selector.addEventListener('touchstart', function(e) {
        if (!this.detectIfElementIsScrolled(e)) {
            return;
        }

        if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
            var touch = e.touches[0] || e.changedTouches[0];
            if (this.setting.direction == 'vertical')
                fpos = touch.pageY;
            else if (this.setting.direction == 'horizontal')
                fpos = touch.pageX;
        }
    }.bind(this));

    this.selector.addEventListener('touchend', function(e) {
        if (!this.detectIfElementIsScrolled(e)) {
            return;
        }

        if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
            var touch = e.touches[0] || e.changedTouches[0];
            if (this.setting.direction == 'vertical')
                lpos = touch.pageY;
            else if (this.setting.direction == 'horizontal')
                lpos = touch.pageX;
        }
        if (fpos + _n < lpos)
            this.changePage(1, this.pages.length, -1);
        else if (fpos > lpos + _n)
            this.changePage(this.pages.length, 1, 1);
    }.bind(this));

}

/* wheel event handler */
fullpagescroll.prototype.onScrollEventHandler = function(e) {

    if (!this.detectIfElementIsScrolled(e)) {
        return;
    }

    this.debounce(function() {
        if (e.wheelDelta > 0) {
            this.changePage(1, this.pages.length, -1);
        } else {
            this.changePage(this.pages.length, 1, 1);
        }
    }.bind(this), 50)();
}

/* dected transitions completion for block duplicated scrolling */
fullpagescroll.prototype.detectTransitionEnd = function() {
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
        'transition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'MozTransition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd'
    }

    for (t in transitions)
        if (el.style[t] !== undefined)
            return transitions[t];
    return true;
}

fullpagescroll.prototype.detectIfElementIsScrolled = function(e) {
    var container = e.target.closest('section > div');
    var scrollTop = Math.ceil(container.parentNode.scrollTop);

    /* scroll down */
    if (e.wheelDelta < 0) {
      if (container.offsetHeight - scrollTop !== container.parentNode.offsetHeight) {
        return false;
      }
    } else /* scroll top */ {
      if (scrollTop) {
        return false;
      }
    }

    return true;
}

/* css setter */
fullpagescroll.prototype.css = function(obj, styles) {
    for (var _style in styles)
        if (obj.style[_style] !== undefined)
            obj.style[_style] = styles[_style];

}

/* debounce */
fullpagescroll.prototype.debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

/* extend function for user customization */
fullpagescroll.prototype.extend = function() {
    for (var i = 1; i < arguments.length; i++)
        for (var key in arguments[i])
            if (arguments[i].hasOwnProperty(key))
                arguments[0][key] = arguments[i][key];
    return arguments[0];
}

//function for page transition
fullpagescroll.prototype.changePage = function(compare, edge, increase) {
    if (this.isPageChanging) return;

    if (this.currentPage == compare) {
        if (this.setting.infinite)
            this.currentPage = edge;
        else
            return;
    } else {
        this.currentPage += increase;
    }

    if (this.setting.animationTime) this.isPageChanging = true;

    if (this.setting.pagination) {
        this.selector.parentNode.querySelector('a.active[data-targetindex]').classList.remove('active');
        this.selector.parentNode.querySelector('a[data-targetindex="' + this.currentPage + '"]').classList.add('active');
    }
    if (this.setting.direction == 'vertical') {
        this.css(this.selector, {
            transform: 'translate3d(0,' + -(this.currentPage - 1) * 100 + '%,0)'
        });
    } else if (this.setting.direction == 'horizontal') {
        css(this.selector, {
            transform: 'translate3d(' + -(this.currentPage - 1) * 100 + '%,0,0)'
        });
    }
}
