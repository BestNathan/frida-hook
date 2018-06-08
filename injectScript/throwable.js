'use strict'

Java.perform(function() {
  var Throwable = Java.use('java.lang.Throwable')

  var stack = Throwable.$new()
    .getStackTrace()
    .join('\r\n')
  console.log('[stack]', stack)
})
