/**
 * Copyright (c) 2016 Nishant Das Patnaik.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

'use strict'

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

var updateInput = function(input) {
  if (input.length && input.length > 0) {
    var normalized = byteArraytoHexString(input)
  } else if (input.array) {
    var normalized = byteArraytoHexString(input.array())
  } else {
    var normalized = input.toString()
  }
  return normalized
}

Java.perform(function() {
  var MessageDigest = Java.use('java.security.MessageDigest')

  if (MessageDigest.digest) {
    MessageDigest.digest.overload().implementation = function() {
      var digest = MessageDigest.digest.overload().apply(this, arguments)
      var algorithm = this.getAlgorithm().toString()
      console.log('[hash][' + algorithm + '][digest][output]', byteArraytoHexString(digest))
      return digest
    }
  }

  if (MessageDigest.update) {
    //MessageDigest.update.implementation = function () {}
    var genUpdateFn = function(overload) {
      return function(input) {
        var retVal = overload.apply(this, arguments)
        var algorithm = this.getAlgorithm().toString()
        var hex = updateInput(input)
        console.log('[hash][' + algorithm + '][update][input/hex ]', hex)
        console.log('[hash][' + algorithm + '][update][input/utf8]', hexToUtf8(hex))
        return retVal
      }
    }
    
    var messageDigestUpdateOverloads = MessageDigest.update.overloads
    for (var i = 0; i < messageDigestUpdateOverloads.length; i++) {
      ;(function(index) {
        var overload = messageDigestUpdateOverloads[index]
        overload.implementation = genUpdateFn(overload)
      })(i)
    }
  }
})
