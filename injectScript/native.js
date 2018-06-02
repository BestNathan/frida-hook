Java.perform(function() {
  send('Running Script')
  var securityCheck = undefined
  exports = Module.enumerateExportsSync('libdvm.so')
  for (i = 0; i < exports.length; i++) {
    if (exports[i].name == 'Java_com_yaotong_crackme_MainActivity_securityCheck') {
      securityCheck = exports[i].address
      send('securityCheck is at ' + securityCheck)
      break
    }
  }
  Interceptor.attach(securityCheck, {
    onEnter: function(args) {
      send('key is: ' + Memory.readUtf8String(Memory.readPointer(securityCheck.sub(0x11a8).add(0x628c))))
    }
  })
})
