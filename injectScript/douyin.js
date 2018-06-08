'use strict';

Java.perform(function () {

    var userinfo = Java.use('com.ss.android.common.applog.UserInfo')

    userinfo.getUserInfo.overload('int', 'java.lang.String', '[Ljava.lang.String;').implementation = function (arg0, arg1, arg2) {
        
        console.log('-------------------------------------')
        console.log("userinfo.getUserInfo.overload('int', 'java.lang.String', '[Ljava.lang.String;').implementation")
        console.log('[arg0]',arg0)
        console.log('[arg1]',arg1)
        console.log('[arg2]',arg2)
        var res = this.getUserInfo(arg0,arg1,arg2)
        console.log(res)
        return res
    }
    userinfo.getUserInfo.overload('int', 'java.lang.String', '[Ljava.lang.String;', 'java.lang.String').implementation = function (arg0, arg1, arg2, arg3) {
        console.log('-------------------------------------')
        console.log("userinfo.getUserInfo.overload('int', 'java.lang.String', '[Ljava.lang.String;', 'java.lang.String').implementation")
        console.log('[arg0]',arg0)
        console.log('[arg1]',arg1)
        console.log('[arg2]',arg2)
        console.log('[arg3]',arg3)
        throw Exception.$new('test')
        var res = this.getUserInfo(arg0,arg1,arg2,arg3 )
        console.log(res)
        throw Exception.$new('test')
        
        return res
    }

})