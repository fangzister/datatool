var XXEncode = {
    base: '+-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    /**
     * 
     * @param {String} The value to encoded. 
     * @param {String} encoding
     */
    encode: function(inString, encoding) {
        encoding = encoding || 'utf8'

        var inBytes = Array.from(inString, encoding); //Buffer.from(inString, encoding);
        var buffLen = inBytes.length;
        var outBytes = []; //Buffer.alloc(buffLen + buffLen / 3 + 4);
        var outLen = 0;
        for (var i = 0; i < buffLen; i += 3) {
            outLen = i / 3 * 4;
            this.encodeBytes(inBytes, i, outBytes, outLen);
        }
        var raw_result = '';
        for (var j = 0; j < outLen + 4; j++) {
            raw_result += this.base[outBytes[j]];
        }
        var result_array = [];
        var lnum = Math.floor(buffLen / 45);
        for (var k = 0; k < lnum; k++) {
            result_array.push(this.base[45] + raw_result.substr(k * 60, 60) + "\r\n");
        }
        var left = buffLen % 45;
        if (left != 0) {
            result_array.push(this.base[left] + raw_result.substr(lnum * 60) + "\r\n");
        }
        var final_result = result_array.join('');
        return final_result.substring(0, final_result.length - 2);
    },

    /**
     * 
     * @param {String} The value to decoded 
     * @param {String} encoding 
     */
    decode: function(inString, encoding) {
        encoding = encoding || 'utf8'

        var in_array = [];
        if (inString.indexOf("\r\n") != -1) {
            in_array = inString.split("\r\n");
        } else {
            in_array = inString.split("\n");
        }
        var raw_string = '';
        var total_len = 0;
        for (let str of in_array) {
            let first = str.substr(0, 1);

            let line_ascii_num = this.base.indexOf(first);

            total_len += line_ascii_num;

            let content = str.substr(1);
            raw_string += content;
        }
        var buffLen = raw_string.length;
        var inBytes = []; //Buffer.alloc(buffLen);
        for (let cn = 0; cn < buffLen; cn++) {
            inBytes[cn] = this.base.indexOf(raw_string[cn]);
        }
        var outBytes = []; //Buffer.alloc(buffLen);
        var outLen = 0;
        for (let i = 0; i < buffLen; i++) {
            outLen = i / 4 * 3;
            this.decodeChars(inBytes, i, outBytes, outLen);
        }
        var ret = outBytes.slice(0, total_len).toString(encoding).split(',');
        for (let i = 0, l = ret.length; i < l; i++) {
            ret[i] = String.fromCharCode(ret[i]);
        }
        return ret.join('');
    },

    // private helper functions
    encodeBytes: function(inBytes, inIndex, outBytes, outIndex) {
        var c1 = inBytes[inIndex] >>> 2;
        var c2 = inBytes[inIndex] << 4 & 0x30 | inBytes[inIndex + 1] >>> 4 & 0xF;
        var c3 = inBytes[inIndex + 1] << 2 & 0x3C | inBytes[inIndex + 2] >>> 6 & 0x3;
        var c4 = inBytes[inIndex + 2] & 0x3F;

        outBytes[outIndex] = (c1 & 0x3F);
        outBytes[outIndex + 1] = (c2 & 0x3F);
        outBytes[outIndex + 2] = (c3 & 0x3F);
        outBytes[outIndex + 3] = (c4 & 0x3F);
    },

    decodeChars: function(inBytes, inIndex, outBytes, outIndex) {
        var c1 = inBytes[inIndex];
        var c2 = inBytes[inIndex + 1];
        var c3 = inBytes[inIndex + 2];
        var c4 = inBytes[inIndex + 3];

        var b1 = (c1 & 0x3F) << 2 | (c2 & 0x3F) >> 4;
        var b2 = (c2 & 0x3F) << 4 | (c3 & 0x3F) >> 2;
        var b3 = (c3 & 0x3F) << 6 | c4 & 0x3F;

        outBytes[outIndex] = b1 & 0xFF;
        outBytes[outIndex + 1] = b2 & 0xFF;
        outBytes[outIndex + 2] = b3 & 0xFF;
    }
}