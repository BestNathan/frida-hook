

'use strict';

Java.perform(function () {
    var md5 = Java.use('com.xiachufang.utils.Md5Util')
    var processor = Java.use('com.xiachufang.utils.api.http.RequestParamsProcessor')
    var map = Java.use('java.util.Map')

    md5.md5.implementation = function (param) {
        console.log('[md5]arg: ',param)
        var res = this.md5(param)
        console.log('[md5]res: ',res)
        return res
    }

    processor.sign.implementation = function (param) {
        console.log('[sign]arg: ',param)
        var res = this.sign(param)
        console.log('[sign]res: ',res)
        console.log('[sign]argr: ', param)
        return res
    }
})