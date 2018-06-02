'use strict';

Java.perform(function () {
    // Java.enumerateLoadedClasses({
    //     onMatch: function (loadedClass){
    //         console.log('[loaded]',loadedClass)
    //     }
    // })
    // Java.choose('com.ss.android.common.applog.UserInfo', {
    //     onMatch: function (instance){
    //         console.log('get it')
    //     },
    //     onComplete: function () {
    //         console.log('complete')
    //     }
    // })

    var userinfo = Java.use('com.ss.android.common.applog.UserInfo')
    var Cipher = Java.use("javax.crypto.Cipher");

    Cipher.getInstance.implementation = function () {
        
    }
    Cipher.init.implementation = function () {
        
    }
    Cipher.dofinal.implementation = function () {
        
    }

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

    // var test = Module.findExportByName(null, 'info')
    // console.log(test)
})