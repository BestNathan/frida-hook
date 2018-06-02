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
    var normalized = byteArraytoHexString(input);
  } else if (input.array) {
    var normalized = byteArraytoHexString(input.array());
  } else {
    var normalized = input.toString();
  }
  return normalized;
}

Java.perform(function() {
  var MessageDigest = Java.use('java.security.MessageDigest')
  var byteBuffer = Java.use('java.nio.ByteBuffer')

  var b = JSON.stringify(byteBuffer)
  console.log(b)

  if (MessageDigest.digest) {
    MessageDigest.digest.overload().implementation = function() {
      var digest = this.digest.overloads[0].apply(this, arguments)
      var algorithm = this.getAlgorithm().toString()
      console.log('[hash][' + algorithm + '][digest]', byteArraytoHexString(digest))
      return digest
    }
  }

  if (MessageDigest.update) {
    MessageDigest.update.implementation = function () {}
    MessageDigest.update.overloads[0].implementation = function(input) {
      var algorithm = this.getAlgorithm().toString()
      var hex = byteArraytoHexString(input)
      console.log('[' + algorithm + '][update0][   hex   ]', hex)
      console.log('[' + algorithm + '][update0][utf8/ansi]', hexToUtf8(hex))
      return this.update.overloads[0].apply(this, arguments)
    }

    MessageDigest.update.overloads[1].implementation = function(input, offset, len) {
      var algorithm = this.getAlgorithm().toString()
      var hex = byteArraytoHexString(input)
      console.log('[' + algorithm + '][update1][   hex   ]', hex)
      console.log('[' + algorithm + '][update1][utf8/ansi]', hexToUtf8(hex))
      return this.update.overloads[1].apply(this, arguments)
    }

    MessageDigest.update.overloads[2].implementation = function(input) {
      var algorithm = this.getAlgorithm().toString()
      var hex = byteArraytoHexString(input)
      console.log('[' + algorithm + '][update2][   hex   ]', hex)
      console.log('[' + algorithm + '][update2][utf8/ansi]', hexToUtf8(hex))
      return this.update.overloads[2].apply(this, arguments)
    }

    MessageDigest.update.overloads[3].implementation = function(input) {
      var algorithm = this.getAlgorithm().toString()
      var hex = byteArraytoHexString(input)
      console.log('[' + algorithm + '][update3][   hex   ]', hex)
      console.log('[' + algorithm + '][update3][utf8/ansi]', hexToUtf8(hex))
      return this.update.overloads[3].apply(this, arguments)
    }
  }
})
