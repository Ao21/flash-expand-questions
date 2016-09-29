/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function () {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );


  var PanRecognizer = (function () {
    function Main(container, pullElement, handler) {
      console.log('starter')
      var self = this;
      this.toggleDelta = 80;
      this.container = container;
      this.pullElement = pullElement;
      this.handler = handler;

      this._slidedown_height = 0;
      this._anim = null;
      this._dragged_down = false;

      this.hammer = new Hammer(container);
      this.hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
      this.hammer.on("pandown panend panstart", function (ev) {
        self.handleHammer(ev);
      })
    }

    Main.prototype.handleHammer = function (ev) {
      var self = this;

      switch (ev.type) {
        case "panstart":
          break;
        case "panend":
          if (!this._dragged_down) {
            return;
          }

          cancelAnimationFrame(this._anim);
          if (ev.deltaY >= this.toggleDelta) {
            this.handler.call(this);

          }

          this.hide();

          break;
        case "pandown":
          this._dragged_down = true;

          if (!this._anim) {
            this.updateHeight();
          }
          ev.preventDefault();
          this._slidedown_height = ev.deltaY * 0.4;

          break;
      }
    }

    /**
     * hide the pullrefresh message and reset the vars
     */
    Main.prototype.hide = function () {
      this._slidedown_height = 0;
      this.setHeight(0);
      cancelAnimationFrame(this._anim);
      this._anim = null;
      this._dragged_down = false;
    };


    Main.prototype.slideUp = function () {
      var self = this;
      cancelAnimationFrame(this._anim);

      pullrefresh_el.className = 'slideup';
      container_el.className = 'pullrefresh-slideup';

      this.setHeight(0);

      setTimeout(function () {
        self.hide();
      }, 500);
    };


    Main.prototype.setHeight = function (height) {
      if (Modernizr.csstransforms3d) {
        this.container.style.transform = 'translate3d(0,' + height + 'px,0) ';
        this.container.style.oTransform = 'translate3d(0,' + height + 'px,0)';
        this.container.style.msTransform = 'translate3d(0,' + height + 'px,0)';
        this.container.style.mozTransform = 'translate3d(0,' + height + 'px,0)';
        this.container.style.webkitTransform = 'translate3d(0,' + height + 'px,0) scale3d(1,1,1)';
      }
      else if (Modernizr.csstransforms) {
        this.container.style.transform = 'translate(0,' + height + 'px) ';
        this.container.style.oTransform = 'translate(0,' + height + 'px)';
        this.container.style.msTransform = 'translate(0,' + height + 'px)';
        this.container.style.mozTransform = 'translate(0,' + height + 'px)';
        this.container.style.webkitTransform = 'translate(0,' + height + 'px)';
      }
      else {
        this.container.style.top = height + "px";
      }
    };

    Main.prototype.updateHeight = function () {
      var self = this;

      this.setHeight(this._slidedown_height);

      this._anim = requestAnimationFrame(function () {
        self.updateHeight();
      });
    };

    return Main;
  } ());


  let pan = new PanRecognizer(document.getElementById('question'), document.getElementById('questionToggle'));

  pan.handler = function (ev) {
    anime({
      targets: '.help-text',
      marginTop: {
        value: 5,
        duration: 300,
        easing: 'easeInOutExpo'
      },
      marginBottom: {
        value: 0,
        duration: 300,
        easing: 'easeInOutExpo'
      },
      maxHeight: {
        value: '100%',
        duration: 300
      },
      opacity: {
        value: [0, 1],
        delay: 50,
        duration: 350,
        easing: 'easeInOutExpo'
      },
    })
  }



  // Your custom JavaScript goes here
})();
