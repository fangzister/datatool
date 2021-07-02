/**
 * 
 * Base64 encode / decode http://www.webtoolkit.info/
 * 
 */
var Base64 = {
    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output + this._keyStr.charAt(enc1) +
                this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) +
                this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode: function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode: function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode: function(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) |
                    ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    },

    //fangzi add at 2021/06/30 20:09:24
    toBlob: function(base64text, type) {
        // 将base64转为Unicode规则编码
        bstr = atob(base64text, type),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n) // 转换编码后才可以使用charCodeAt 找到Unicode编码
        }
        return new Blob([u8arr], {
            type,
        });
    }
};

var Base58 = {
    ALPHABET: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
    ALPHABET_MAP: {
        "1": 0,
        "2": 1,
        "3": 2,
        "4": 3,
        "5": 4,
        "6": 5,
        "7": 6,
        "8": 7,
        "9": 8,
        "A": 9,
        "B": 10,
        "C": 11,
        "D": 12,
        "E": 13,
        "F": 14,
        "G": 15,
        "H": 16,
        "J": 17,
        "K": 18,
        "L": 19,
        "M": 20,
        "N": 21,
        "P": 22,
        "Q": 23,
        "R": 24,
        "S": 25,
        "T": 26,
        "U": 27,
        "V": 28,
        "W": 29,
        "X": 30,
        "Y": 31,
        "Z": 32,
        "a": 33,
        "b": 34,
        "c": 35,
        "d": 36,
        "e": 37,
        "f": 38,
        "g": 39,
        "h": 40,
        "i": 41,
        "j": 42,
        "k": 43,
        "m": 44,
        "n": 45,
        "o": 46,
        "p": 47,
        "q": 48,
        "r": 49,
        "s": 50,
        "t": 51,
        "u": 52,
        "v": 53,
        "w": 54,
        "x": 55,
        "y": 56,
        "z": 57
    },
    encode: function(buffer) {
        var carry, digits, j;
        if (buffer.length === 0) {
            return "";
        }
        i = void 0;
        j = void 0;
        digits = [0];
        i = 0;
        while (i < buffer.length) {
            j = 0;
            while (j < digits.length) {
                digits[j] <<= 8;
                j++;
            }
            digits[0] += buffer[i];
            carry = 0;
            j = 0;
            while (j < digits.length) {
                digits[j] += carry;
                carry = (digits[j] / 58) | 0;
                digits[j] %= 58;
                ++j;
            }
            while (carry) {
                digits.push(carry % 58);
                carry = (carry / 58) | 0;
            }
            i++;
        }
        i = 0;
        while (buffer[i] === 0 && i < buffer.length - 1) {
            digits.push(0);
            i++;
        }
        return digits.reverse().map(function(digit) {
            return this.ALPHABET[digit];
        }).join("");
    },

    decode: function(string) {
        if (!/^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]$/g.test(string)) {
            return false;
        }
        var bytes = [0],
            c, carry, j = 0,
            i = 0;
        while (i < string.length) {
            c = string[i];
            if (!(c in this.ALPHABET_MAP)) {
                console.log("Base58.decode received unacceptable input. Character '" + c + "' is not in the Base58 alphabet.");
                return false;
            }
            j = 0;
            while (j < bytes.length) {
                bytes[j] *= 58;
                j++;
            }
            bytes[0] += this.ALPHABET_MAP[c];
            carry = 0;
            j = 0;
            while (j < bytes.length) {
                bytes[j] += carry;
                carry = bytes[j] >> 8;
                bytes[j] &= 0xff;
                ++j;
            }
            while (carry) {
                bytes.push(carry & 0xff);
                carry >>= 8;
            }
            i++;
        }
        i = 0;
        while (string[i] === "1" && i < string.length - 1) {
            bytes.push(0);
            i++;
        }

        var retBytes = new(typeof Uint8Array !== "undefined" && Uint8Array !== null ? Uint8Array : Buffer)(bytes.reverse());
        var result = [];
        for (var i = 0; i < retBytes.length; i++) {
            result.push(String.fromCharCode(bytes[i]));
        }
        return result.join('');
    }
};

var Base32 = {
    keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
    decode: function(input) {
        if (!/^[A-Z2-7=]+$/.test(input)) {
            return false;
        }
        var buffer = 0;
        var bitsLeft = 0;
        var output = new Array();
        var i = 0;
        var count = 0;

        while (i < input.length) {
            var val = this.keyStr.indexOf(input.charAt(i++));
            if (val >= 0 && val < 32) {
                buffer <<= 5;
                buffer |= val;
                bitsLeft += 5;
                if (bitsLeft >= 8) {
                    output[count++] = (buffer >> (bitsLeft - 8)) & 0xFF;
                    bitsLeft -= 8;
                }
            }
        }
        for (i = 0; i < output.length; i++) {
            output[i] = String.fromCharCode(output[i]);
        }
        return output.join('');
    }
};