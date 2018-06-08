Java.perform(function() {
  send('Running Script')
  var securityCheck = undefined
  exports = Module.enumerateExportsSync('libdvm.so')
  exports.forEach(function(ex) {
    if (~ex.name.indexOf('dvmDexFileOpenPartial')) {
      securityCheck = ex.address
      console.log('[nativeHook][found]', 'dvmDexFileOpenPartial is at ' + ex.address)
    }
  })

  if (!securityCheck) {
    send('not found')
    return
  }

  Interceptor.attach(securityCheck, {
    onEnter: function() {
      var args = arguments
      args.forEach(function(arg){
        console.log('arg', arg)
      })
    }
  })
})
