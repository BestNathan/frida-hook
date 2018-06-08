

'use strict';

Java.perform(function () {
    console.log('[ximalaya] start')
    var request = Java.use('com.ximalaya.ting.android.host.manager.request.CommonRequestM')
    var url = Java.use('com.ximalaya.ting.android.host.util.constant.UrlConstants')

    request.trackCount.implementation = function () {
        arguments.forEach(function(arg, index){
            console.log('arg', index, arg)
        })
        md5.trackCount.apply(this, arguments)
    }

    url.getTrackCountUrl.implementation = function () {
        var res = url.getTrackCountUrl.apply(this, arguments)
        console.log('url', url)
        return res
    }

})