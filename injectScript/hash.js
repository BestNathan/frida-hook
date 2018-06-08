'use strict';

var byteArraytoHexString = function byteArraytoHexString(byteArray) {
  try {
    return Array.prototype.map.call(new Uint8Array(byteArray), function (x) {
      return ('00' + x.toString(16)).slice(-2);
    }).join('');
  } catch (error) {
    return '';
  }
};

var hexToAscii = function hexToAscii(input) {
  var hex = input.toString();
  var str = '';
  for (var i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }return str;
};

var hexToUtf8 = function hexToUtf8(input) {
  var ansi = hexToAscii(input);
  try {
    return decodeURIComponent(escape(ansi));
  } catch (error) {
    return ansi;
  }
};

var updateInput = function updateInput(input) {
  if (input.length && input.length > 0) {
    var normalized = byteArraytoHexString(input);
  } else if (input.array) {
    var normalized = byteArraytoHexString(input.array());
  } else {
    var normalized = input.toString();
  }
  return normalized;
};

Java.perform(function () {
  console.log('[hash][script]', 'begin');
  var MessageDigest = Java.use('java.security.MessageDigest');

  if (MessageDigest.digest) {
    MessageDigest.digest.overload().implementation = function () {
      var digest = MessageDigest.digest.overload().apply(this, arguments);
      var algorithm = this.getAlgorithm().toString();
      console.log('[hash][' + algorithm + '][digest][output]', byteArraytoHexString(digest));
      return digest;
    };
  }

  if (MessageDigest.update) {
    //MessageDigest.update.implementation = function () {}
    var genUpdateFn = function genUpdateFn(overload) {
      return function (input) {
        var retVal = overload.apply(this, arguments);
        var algorithm = this.getAlgorithm().toString();
        var hex = updateInput(input);
        console.log('[hash][' + algorithm + '][update][input/hex ]', hex);
        console.log('[hash][' + algorithm + '][update][input/utf8]', hexToUtf8(hex));
        return retVal;
      };
    };

    var messageDigestUpdateOverloads = MessageDigest.update.overloads;
    for (var i = 0; i < messageDigestUpdateOverloads.length; i++) {
      ;(function (index) {
        var overload = messageDigestUpdateOverloads[index];
        overload.implementation = genUpdateFn(overload);
      })(i);
    }
  }
});