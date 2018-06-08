'use strict'

var base64 = (function() {
  var ex = {}
  ;('use strict')

  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  // Use a lookup table to find the index.
  var lookup = new Uint8Array(256)
  for (var i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i
  }

  ex.encode = function(arraybuffer) {
    var bytes = new Uint8Array(arraybuffer),
      i,
      len = bytes.length,
      base64 = ''

    for (i = 0; i < len; i += 3) {
      base64 += chars[bytes[i] >> 2]
      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)]
      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)]
      base64 += chars[bytes[i + 2] & 63]
    }

    if (len % 3 === 2) {
      base64 = base64.substring(0, base64.length - 1) + '='
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + '=='
    }

    return base64
  }

  ex.decode = function(base64) {
    var bufferLength = base64.length * 0.75,
      len = base64.length,
      i,
      p = 0,
      encoded1,
      encoded2,
      encoded3,
      encoded4

    if (base64[base64.length - 1] === '=') {
      bufferLength--
      if (base64[base64.length - 2] === '=') {
        bufferLength--
      }
    }

    var arraybuffer = new ArrayBuffer(bufferLength),
      bytes = new Uint8Array(arraybuffer)

    for (i = 0; i < len; i += 4) {
      encoded1 = lookup[base64.charCodeAt(i)]
      encoded2 = lookup[base64.charCodeAt(i + 1)]
      encoded3 = lookup[base64.charCodeAt(i + 2)]
      encoded4 = lookup[base64.charCodeAt(i + 3)]

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4)
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2)
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63)
    }

    return arraybuffer
  }
  return ex
})()

var byteArraytoHexString = function(byteArray) {
  try {
    return Array.prototype.map
      .call(new Uint8Array(byteArray), function(x) {
        return ('00' + x.toString(16)).slice(-2)
      })
      .join('')
  } catch (error) {
    return ''
  }
}

var byteArraySlice = function(input, offset, len) {
  return new Uint8Array(input).buffer.slice(offset, offset + len)
}

var hexToAscii = function(input) {
  var hex = input.toString()
  var str = ''
  for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
  return str
}

var hexToUtf8 = function(input) {
  var ansi = hexToAscii(input)
  try {
    return decodeURIComponent(escape(ansi))
  } catch (error) {
    return ansi
  }
}

var getRandomValue = function(arg) {
  if (!arg) {
    return 'null'
  }
  var type = arg
    .toString()
    .split('@')[0]
    .split('.')
  type = type[type.length - 1]
  if (type === 'SecureRandom') {
    if (arg.getSeed) {
      return byteArraytoHexString(arg.getSeed(10))
    }
  }
}

var argIsSecureRandom = function(obj) {
  try {
    return obj.toString().split('@')[0] == 'java.security.SecureRandom'
  } catch (error) {
    return false
  }
}

Java.perform(function() {
  var Cipher = Java.use('javax.crypto.Cipher')
  var SecureRandom = Java.use('java.security.SecureRandom')

  if (Cipher.getInstance) {
    var genGetInstanceFn = function(overload) {
      return function(transformation) {
        console.log('[cipher][getInstance][Algorithm]', transformation)
        return overload.apply(this, arguments)
      }
    }

    var cipherGetInstanceOverloads = Cipher.getInstance.overloads
    for (var i = 0; i < cipherGetInstanceOverloads.length; i++) {
      ;(function(index) {
        var overload = cipherGetInstanceOverloads[index]
        overload.implementation = genGetInstanceFn(overload)
      })(i)
    }
  }

  if (Cipher.init) {
    //Cipher.init.implementation = function() {}
    var genInitFn = function(overload) {
      return function(opmode, cert_or_key, params_or_random) {
        var retVal = overload.apply(this, arguments)
        // var args = arguments
        // for (var i = 0; i < args.length; i++) {
        //   console.log('args', i, args[i], typeof args[i])
        // }

        var Algorithm = this.getAlgorithm()
        console.log('[cipher][init][Algorithm]', Algorithm)

        var key = cert_or_key.getEncoded()
        if (~Algorithm.indexOf('RSA')) {
          console.log('[cipher][init][key]', base64.encode(key))
        } else {
          console.log('[cipher][init][key]', byteArraytoHexString(key))
        }

        if (!argIsSecureRandom(params_or_random)) {
          var IV = this.getIV()
          console.log('[cipher][init][IV]', byteArraytoHexString(IV))
        }

        return retVal
      }
    }

    var cipherInitOverload0 = Cipher.init.overload(
      'int',
      'java.security.cert.Certificate',
      'java.security.SecureRandom'
    )
    var cipherInitOverload1 = Cipher.init.overload('int', 'java.security.Key', 'java.security.SecureRandom')
    var cipherInitOverload2 = Cipher.init.overload(
      'int',
      'java.security.Key',
      'java.security.spec.AlgorithmParameterSpec',
      'java.security.SecureRandom'
    )
    var cipherInitOverload3 = Cipher.init.overload(
      'int',
      'java.security.Key',
      'java.security.AlgorithmParameters',
      'java.security.SecureRandom'
    )

    cipherInitOverload0.implementation = genInitFn(cipherInitOverload0)
    cipherInitOverload1.implementation = genInitFn(cipherInitOverload1)
    cipherInitOverload2.implementation = genInitFn(cipherInitOverload2)
    cipherInitOverload3.implementation = genInitFn(cipherInitOverload3)
  }

  if (Cipher.update) {
    var genUpdateFn = function(overload) {
      return function() {
        var input, output, inputOffset, inputLen
        var retVal = overload.apply(this, arguments)
        var argLen = arguments.length
        switch (argLen) {
          case 1:
            input = arguments[0]
            output = retVal
            break
          case 2:
            console.warn('!![cipher][update][warn] have two args')
            break
          case 3:
            input = arguments[0]
            inputOffset = arguments[1]
            inputLen = arguments[2]
            input = byteArraySlice(input, inputOffset, inputLen)
            output = retVal
            break
          case 4:
          case 5:
            input = arguments[0]
            inputOffset = arguments[1]
            inputLen = arguments[2]
            output = arguments[3]
            input = byteArraySlice(input, inputOffset, inputLen)
            break
          default:
            break
        }
        var Algorithm = this.getAlgorithm()
        console.log('[cipher][update][Algorithm]', Algorithm)

        if (input) {
          var inputhex = byteArraytoHexString(input)
          console.log('[cipher][update][input][   hex   ]', inputhex)
          console.log('[cipher][update][input][utf8/ansi]', hexToUtf8(inputhex))
        }

        if (output) {
          console.log('[cipher][update][output][base64]', base64.encode(output))
          console.log('[cipher][update][output][ hex  ]', byteArraytoHexString(output))
        }

        return retVal
      }
    }

    var cipherUpdateOverloads = Cipher.update.overloads
    for (var i = 0; i < cipherUpdateOverloads.length; i++) {
      ;(function(index) {
        var overload = cipherUpdateOverloads[index]
        overload.implementation = genUpdateFn(overload)
      })(i)
    }
  }

  if (Cipher.doFinal) {
    //Cipher.doFinal.implementation = function () {}
    var genDofinalFn = function(overload) {
      return function() {
        var input, output, inputOffset, inputLen
        var retVal = overload.apply(this, arguments)
        // var args = arguments
        // for (var i = 0; i < args.length; i++) {
        //   console.log('args', i, args[i], typeof args[i])
        // }
        var argLen = arguments.length
        switch (argLen) {
          case 0:
            output = retVal
            break
          case 1:
            input = arguments[0]
            output = retVal
            break
          case 2:
            console.warn('!![cipher][dofinal][warn] have two args')
            break
          case 3:
            input = arguments[0]
            inputOffset = arguments[1]
            inputLen = arguments[2]
            input = byteArraySlice(input, inputOffset, inputLen)
            output = retVal
            break
          case 4:
          case 5:
            input = arguments[0]
            inputOffset = arguments[1]
            inputLen = arguments[2]
            input = byteArraySlice(input, inputOffset, inputLen)
            output = arguments[3]
            break
          default:
            break
        }
        var Algorithm = this.getAlgorithm()
        console.log('[cipher][dofinal][Algorithm]', Algorithm)

        if (input) {
          var inputhex = byteArraytoHexString(input)
          console.log('[cipher][dofinal][input][   hex   ]', inputhex)
          console.log('[cipher][dofinal][input][utf8/ansi]', hexToUtf8(inputhex))
        }

        if (output) {
          console.log('[cipher][dofinal][output][base64]', base64.encode(output))
          console.log('[cipher][dofinal][output][ hex  ]', byteArraytoHexString(output))
        }

        return retVal
      }
    }

    var cipherDoFinalOverloads = Cipher.doFinal.overloads
    for (var i = 0; i < cipherDoFinalOverloads.length; i++) {
      ;(function(index) {
        var overload = cipherDoFinalOverloads[index]
        overload.implementation = genDofinalFn(overload)
      })(i)
    }
  }

  if (SecureRandom.setSeed) {
    var genSetSeedFn = function(overload) {
      return function(seed) {
        console.log('[SecureRandom][setSeed][seed]', seed)
        return overload.apply(this, arguments)
      }
    }

    var SecureRandomSetSeedOverloads = SecureRandom.setSeed.overloads
    for (var i = 0; i < SecureRandomSetSeedOverloads.length; i++) {
      ;(function(index) {
        var overload = SecureRandomSetSeedOverloads[index]
        overload.implementation = genSetSeedFn(overload)
      })(i)
    }
  }
})
