### pull-to-refresh

## quick view

todo..

## require

zepto(0.8+) 

or

jQuery(1.8+) not tested yet

## broswer support

- iOS 5+
- Android 4+ (default browser)

warn: exclude Chrome ver 18 or less on Android.

tested in iOS6 and Android 4.1.2

## usage

### add scrollview Object

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
