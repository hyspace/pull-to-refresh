### pull-to-refresh

## quick view

todo..

## require

zepto(0.8+) recommand

or

jQuery(1.8+) not tested yet

## feature

used css `-webkit-overflow-scrolling: touch;` so it's scrolls smoother than any lib using `-webkit-transform: translate3d`

support Android 4+

## broswer support

- iOS 5+
- Android 4+ (default browser)

warn: exclude Chrome ver 18 or less on Android.

tested in iOS6 and Android 4.1.2

## usage

### include `zepto.ScrollView.js` and `zepto.ScrollView.css`

### include dom structure in html
    
    <!-- top structure of ScrollView -->
    <div id='scroll-object' class="zui-scroll-view">
        <div class="zui-scroll-view-top-loading">
            <!-- show while loading -->
            loading…
            <!-- end -->
        </div>
          <div class="zui-scroll-view-main">
            <div class='zui-scroll-view-warper'>
              <div class='zui-scroll-view-scroller'>
                <div class="zui-scroll-view-pull">
                  <!-- show when pull -->
                  pull to refresh
                  <!-- end -->
                </div>
                <div class="zui-scroll-view-container">
                  <!-- your content html here -->

                  <!-- end of your content html -->
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    <!-- end of ScrollView structure -->

### add scrollview Object in script

    scrollView = new $.ScrollView('#scroll-object');

### add pull and finish listener
    
    scrollView.on('scrollview.pull',function (e) {
        // do sth when pull

        // hide the loading mark when task done.
        scrollView.finishLoading();
    })

or listen to dom event of scrollObject.

    $('#scroll-object').on('scrollview.pull',function (e) {
        // do sth when pull

        // hide the loading mark when task done.
        scrollView.finishLoading();
    })

### manually control

    // manually hide the loading mark (will fire the 'scrollview.finish' event.)
    scrollView.finishLoading();

    // manually start the loading progress (will fire the 'scrollview.pull' event.)
    scrollView.startLoading();

    // listen to finish event:
    scrollView.on('scrollview.finish',function (e) {
        // do sth when finish
    })

    // listen to finish event:
    $('#scroll-object').on('scrollview.finish',function (e) {
        // do sth when finish
    })

## further

see demo

## Lisence

this project is licensed under the terms of the MIT License.
