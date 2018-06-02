'use strict';

Java.perform(function () {
    var daa = Java.use('com.xunlei.common.device.a.a')
    var dac = Java.use('com.xunlei.common.device.a.c')
    var aa = Java.use('com.xunlei.common.stat.base.a$a')
    var log = Java.use('com.xunlei.common.base.XLLog')

    log.v.implementation = function (x, y) {
        //console.log(x,y)
    }

    aa.a.overload('java.lang.String').implementation = function (param) {
        console.log('[aa.a]arg: ',param)
        var res = this.a(param)
        console.log('[aa.a]res: ',res)
        return res
    }

    daa.a.overload('java.lang.String').implementation = function (param) {
        console.log('[daa.a]arg: ',param)
        var res = this.a(param)
        console.log('[daa.a]res: ',res)
        return res
    }

    dac.c.overload('java.lang.String').implementation = function (param) {
        console.log('[this.f]', dac.f)
        console.log('[this.c]',this.c())
        console.log('[this.d]',this.d())
        console.log('[dac.c]arg: ',param)
        var res = this.c(param)
        console.log('[dac.c]res: ',res)
        return res
    }
})