//版本信息
var FZCORE_VERSION = '1.9.0';

//网络模式常数
//采用二进制与或确定当前网络模式下哪些菜单不加载
var WEB_MODE_TYPE = {
    WWW: 1, //互联网
    WA: 2, //专网
    GA: 4, //公安网
    INTRA: 8, //局域网（非互联网、非公安网、非专网）
    KMZD: 16, //支队网络,
    KMZD_WWW: 17,
    KMZD_WA: 18,
    KMZD_GA: 20
};

//配置当前网络模式
var WEB_MODE = WEB_MODE_TYPE.INTRA;

//是否开发者模式
var DEVELOP_MODE = (location.hostname == 'localhost' || location.hostname == '');

var IS_FILE_PROTOCAL = (location.protocol == 'file:');

//地址列表
var URL_LOCAL_HTTPS = 'https://localhost/';
var URL_LOCAL_HTTP = 'http://localhost/';
var URL_REMOTE_HTTPS = 'https://127.0.0.1/';
var URL_REMOTE_HTTP = 'http://127.0.0.1/';
var URL_INTERNET_API = 'http://localhost:8088/';

var JS_URL = DEVELOP_MODE ? URL_LOCAL_HTTP : URL_REMOTE_HTTP;
var JS_URL_HTTPS = (DEVELOP_MODE ? URL_LOCAL_HTTPS : URL_REMOTE_HTTPS);
var CSS_IMG_URL = (DEVELOP_MODE ? URL_LOCAL_HTTP : URL_REMOTE_HTTP) + 'images/';

//----------------公用方法----------------
/**
 * 测试指定参数是否非空数组
 * 从parentWindow传入的数组，不能用instanceof Array来判断，要用Array.isArray()
 * @param {any} a 
 * @return {Boolean} a instanceof Array && a.length > 0
 */
function isArray(a) {
    return (a instanceof Array || Array.isArray(a)) && a.length > 0;
}

/**
 * 测试参数是否object。数组返回false
 * @param {*} obj 要测试的参数
 * @return obj !== null && typeof obj === 'object' && (obj instanceof Array === false);
 */
function isObject(obj) {
    return obj !== null && typeof obj === 'object' && (obj instanceof Array === false);
}

/**
 * 如果是参数值是null、undefined、空数组则返回空字符串，否则返回其本身
 * @param {*} s 
 * @returns {boolean} (s == null || s == undefined || s.length == 0) ? '' : s
 */
function isNull(s) {
    return (s == null || s == undefined || s.length == 0) ? '' : s;
}

/**
 * 测试参数是否undefined或null
 * @param {*} v 待测试参数
 */
function isUndef(v) {
    return v === undefined || v === null
}

/**
 * 测试值是否有效
 * @param {*} s 要测试的值
 * @returns {boolean} (s == null || s == undefined || s.length == 0)
 */
function isNone(s) {
    return (s == null || s == undefined || s.length == 0);
}

/**
 * 测试参数是否空值。空数组 | 空字符串 | 空对象 | null | undefined | 对象的所有属性都是空值
 * @param {*} v 待测试参数
 */
function isEmpty(v) {
    if (isUndef(v)) {
        return true;
    }
    if (v instanceof Array || typeof v === 'string') {
        return v.length == 0;
    }
    if (v instanceof Object) {
        return fzObject.empty(v) || fzObject.emptyProperties(v);
    }
    return false;
}

var fzArray = {
    /**
     * 测试array中是否包含value
     * @param {any} value 数组元素
     * @param {Array} array 源数组
     * @returns {Boolean} 包含返回true，不包含返回false
     */
    inArray: function(value, arr) {
        var idx = arr.indexOf(value);
        return idx !== -1;
    },

    /**
     * 测试两个数组是否相等
     * @param {array} arr1 数组1
     * @param {array} arr2 数组2
     */
    equals: function(arr1, arr2) {
        if (!arr1 || !arr2) {
            return false;
        }
        if (arr1.length !== arr2.length) {
            return false;
        }
        for (var i = 0, l = arr1.length; i < l; i++) {
            if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
                if (!this.equals(arr1[i], arr2[i])) {
                    return false;
                }
            } else if (arr1[i] instanceof Object && arr2[i] instanceof Object) {
                if (!fzObject.equals(arr1[i], arr2[i])) {
                    return false;
                }
            } else if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    },

    /**
     * 将可迭代对象转换成数组
     * @param {list} list 可迭代的对象
     * @param {start} [start] 开始位置
     */
    from: function(list, start) {
        start = start || 0;
        var i = list.length - start;
        var ret = new Array(i);
        while (i--) {
            ret[i] = list[i + start];
        }
        return ret;
    },

    /**
     * 将arguments中的非空值追加到源数组。如果argument是数组，则将它拆分后追加到源数组，但只会拆分一层
     * @param {array} arr 源数组
     * @returns arr 返回新数组，源数组不被修改。
     */
    append: function(arr) {
        var ret = arr.concat();
        for (var i = 1, l = arguments.length; i < l; i++) {
            if (isArray(arguments[i])) {
                for (var j = 0, k = arguments[i].length; j < k; j++) {
                    if (!isEmpty(arguments[i][j])) {
                        ret.push(arguments[i][j]);
                    }
                }
            } else {
                ret.push(arguments[i]);
            }
        }
        return ret;
    },

    /**
     * 将arguments中的非空值推入一个新数组中，返回这个数组。
     */
    push: function() {
        var ret = [];
        for (var i = 0, l = arguments.length; i < l; i++) {
            if (!isEmpty(arguments[i])) {
                ret.push(arguments[i]);
            }
        }
        return ret;
    },

    /**
     * 从arr中删除第一个指定的元素，修改源数组。存在该元素则返回true，否则返回false
     * @param {array} arr 源数组
     * @param {*} item 要删除的首次出现的元素
     */
    removeFirstFound: function(arr, item) {
        var index = arr.indexOf(item);
        if (index > -1) {
            arr.splice(index, 1);
            return true;
        }
        return false;
    },

    /**
     * 从arr中删除所有全等于item的元素，返回新数组，源数组不变。
     * @param {array} arr 源数组
     * @param {*} item 要删除的元素
     */
    removeFound: function(arr, item) {
        var ret = [];
        for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i] !== item) {
                ret.push(arr[i]);
            }
        }
        return ret;
    },

    /**
     * 将arguments中的对象推入objArray中，返回新的对象数组
     * @param {array} objArray 对象数组
     */
    pushObject: function(objArray) {
        var ret = objArray.concat();
        for (var i = 1, l = arguments.length; i < l; i++) {
            if (!fzObject.empty(arguments[i])) {
                ret.push(arguments[i]);
            }
        }
        return ret;
    },

    /**
     * //V1.8.3 修正参数中的数组中的空元素也被追加的bug
     * 将arguments中的非空值追加到源数组，源数组将被修改。如果argument是数组，则将它拆分后追加到源数组，但只会拆分一层
     * @param {array} arr 源数组
     */
    concat: function(arr) {
        for (var i = 1, l = arguments.length; i < l; i++) {
            if (isEmpty(arguments[i])) {
                continue;
            }
            if (isArray(arguments[i])) {
                for (var j = 0, k = arguments[i].length; j < k; j++) {
                    if (!isEmpty(arguments[i][j])) {
                        arr.push(arguments[i][j]);
                    }
                }
            } else {
                arr.push(arguments[i]);
            }
        }
    },

    /**
     * 删除对象数组中所有对象的指定属性（修改源数组）
     * @param {array} objArray 对象数组
     * @param {string} property 属性名
     */
    deleteObjectProperty: function(objArray, property) {
        for (var i = 0, l = objArray.length; i < l; i++) {
            fzObject.deleteProperty(objArray[i], property);
        }
    },

    /**
     * 测试对象数组的指定属性中是否包含指定的值
     * @param {*} value 值
     * @param {array} objArray 对象数组
     * @param {string} key 属性名
     */
    inObjectValue: function(value, objArray, key) {
        for (var i = 0, l = objArray.length; i < l; i++) {
            var obj = objArray[i];
            if (obj.hasOwnProperty(key)) {
                if (obj[key] === value) {
                    return true;
                }
            }
        }
        return false;
    },

    /**
     * 查找数组中目标元素的上一个元素
     * @param {array} arr 源数组
     * @param {*} refItem 目标元素
     * @param {number} formIndex 从第几个元素开始查找
     */
    previous: function(arr, refItem, formIndex) {
        var index = arr.indexOf(refItem, formIndex);
        if (index === -1) {
            return null;
        }
        if (index === 0) {
            return null;
        }
        return arr[index - 1];
    },

    /**
     * 返回数组中目标元素的下一个元素
     * @param {array} arr 源数组
     * @param {*} refItem 目标元素
     * @param {number} [formIndex] 开始检索的索引，可以为空
     * @returns 返回找到的元素
     */
    next: function(arr, refItem, formIndex) {
        var index = arr.indexOf(refItem, formIndex);
        if (index === -1) {
            return null;
        }
        if (index + 1 >= arr.length) {
            return null;
        }
        return arr[index + 1];
    },

    /**
     * 数组排重
     * @param {array} a 要排重的数组
     * @returns {array} 排重后的数组
     */
    unique: function(a) {
        var ret = a.filter(function(item, index, array) {
            return array.indexOf(item) === index;
        });
        return ret;
    },

    /**
     * 将arguments转为数组
     * @param {array} args arguments
     */
    argsToArray: function(args) {
        var ret = [];
        for (var i = 0, l = args.length; i < l; i++) {
            ret.push(args[i]);
        }
        return ret;
    },

    /**
     * 数组合并后排重
     * @returns {Array} 排重后的数组
     */
    merge: function() {
        if (!arguments.length) {
            return null;
        }
        var ret = [];
        for (var i = 0, l = arguments.length; i < l; i++) {
            if (isArray(arguments[i])) {
                ret = ret.concat(arguments[i]);
            }
        }
        return this.unique(ret);
    },

    /**
     * 将对象数组中各对象的属性值合并去重后，返回单一对象。返回的对象中不包含none值
     * @param {array} objArray 由对象组成的数组，不是对象的数组元素将被忽略
     * @returns {object} 如果参数不是数组，返回undefined
     */
    mergeObjectArray: function(objArray) {
        if (!isArray(objArray)) {
            return;
        }
        if (objArray.length == 1) {
            if (isObject(objArray[0])) {
                return objArray[0];
            } else {
                return;
            }
        }

        var ret = {};
        for (var i = 0, l = objArray.length; i < l; i++) {
            var obj = objArray[i];
            if (!isObject(obj)) {
                continue;
            }
            for (var key in obj) {
                var val = obj[key];
                if (isNone(val)) {
                    continue;
                }
                if (!ret[key]) {
                    ret[key] = [val];
                } else {
                    if (ret[key].indexOf(val) === -1) {
                        if (isArray(val)) {
                            ret[key].concat(val);
                        } else {
                            ret[key].push(val);
                        }
                    }
                }
            }
        }

        for (var k in ret) {
            if (ret[k].length == 1) {
                ret[k] = ret[k][0];
            }
        }
        return ret;
    },

    /**
     * 求两个数组的交集
     * V1.8.3
     * 如果两个数组有一个为空，则返回空数组
     * @param {Array} arr1 数组1
     * @param {Array} arr2 数组2
     */
    intersect: function(arr1, arr2) {
        if (isEmpty(arr1) || isEmpty(arr2)) {
            return [];
        }
        return arr1.filter(function(v) {
            return arr2.indexOf(v) > -1;
        });
    },

    /**
     * 求arguments中的多个数组的交集
     */
    intersectAll: function() {
        var _self = this;
        var arr = Array.prototype.slice.apply(arguments);
        return arr.reduce(function(prev, cur, index, arr) {
            return _self.intersect(prev, cur);
        });
    },

    /**
     * 求数组中的数组的交集
     * @param {Array} arrArray 包含多个数组的数组
     */
    intersectArray: function(arrArray) {
        var _self = this;
        var arr = Array.prototype.slice.apply(arrArray);
        if (arr.length == 0) {
            return null;
        }
        return arr.reduce(function(prev, cur, index, arr) {
            return _self.intersect(prev, cur);
        });
    },

    /**
     * 求对象数组的指定键的交集
     * @param {array} objArray 由对象组成的数组
     * @param {string} key 指定将要返回的数组来自对象的哪个键
     */
    intersectObjectArray: function(objArray, key) {
        var arr = [];
        for (var i = 0, l = objArray.length; i < l; i++) {
            arr.push(objArray[i][key]);
        }
        return this.intersectArray(arr);
    },

    /**
     * 求两个数组的并集
     * @param {Array} arr1 数组1
     * @param {Array} arr2 数组2
     */
    union: function(arr1, arr2) {
        return arr1.concat(arr2.filter(function(v) {
            return arr1.indexOf(v) === -1;
        }))
    },

    /**
     * 求arguments中的多个数组的并集
     */
    unionAll: function() {
        var _self = this;
        var arr = Array.prototype.slice.apply(arguments);
        return arr.reduce(function(prev, cur, index, arr) {
            return _self.union(prev, cur);
        });
    },

    /**
     * 求数组中的数组的并集
     * @param {Array} arrArray 包含多个数组的数组
     */
    unionArray: function(arrArray) {
        var _self = this;
        var arr = Array.prototype.slice.apply(arrArray);
        return arr.reduce(function(prev, cur, index, arr) {
            return _self.union(prev, cur);
        });
    },

    /**
     * 求对象数组的指定键对应数组的并集
     * @param {array} objArray 由对象组成的数组
     * @param {string} keyOfArray 指定将要返回的数组来自对象的哪个键，该键的值为数组
     */
    unionObjectArray: function(objArray, keyOfArray) {
        var arr = [];
        for (var i = 0, l = objArray.length; i < l; i++) {
            arr.push(objArray[i][keyOfArray]);
        }
        return this.unionArray(arr);
    },

    /**
     * 求对象数组的指定属性值的并集
     * @param {array} objArray 由对象组成的数组
     * @param {string} key 指定将要返回的数组来自对象的哪个键
     */
    unionObjectProperty: function(objArray, key) {
        var arr = [];
        for (var i = 0, l = objArray.length; i < l; i++) {
            arr.push(objArray[i][key]);
        }
        return this.unique(arr);
    },

    /**
     * 求对象数组的指定属性值的并集
     * @param {array} objArray 由对象组成的数组
     * @param {string} keyOfArray 对象中的包含对象数组的属性名
     * @param {string} keyofProperty 返回值的属性名
     */
    unionObjectArrayProperty: function(objArray, keyOfArray, keyOfProperty) {
        var ret = [];
        for (var i = 0, l = objArray.length; i < l; i++) {
            var obj = objArray[i];
            var arr = obj[keyOfArray];
            for (var j = 0, k = arr.length; j < k; j++) {
                ret.push(arr[j][keyOfProperty]);
            }
        }
        return this.unique(ret);
    },

    /**
     * 求两个数组的差集
     * @param {Array} arr1 数组1
     * @param {Array} arr2 数组2
     */
    difference: function(arr1, arr2) {
        return arr1.filter(function(v) {
            return arr2.indexOf(v) === -1;
        });
    },

    /**
     * 测试一个小集合中的所有元素是否都在大集合内，仅限由基本数据类型组成的数组
     * @param {array} arrSource 大的集合
     * @param {array} arrSub 小集合
     */
    includes: function(arrSource, arrSub) {
        if (arrSource.length < arrSub) {
            return false;
        }
        for (var i = 0, l = arrSub.length; i < l; i++) {
            if (!this.inArray(arrSub[i], arrSource)) {
                return false;
            }
        }
        return true;
    },

    /**
     * 测试一个对象数组中是否包含指定的键值
     * @param {array} objArray 对象数组
     * @param {string} key 键
     * @param {*} value 值
     */
    containsKeyValue: function(objArray, key, value) {
        if (!objArray) {
            return false;
        }
        if (!objArray.length) {
            return false;
        }

        for (var i = 0, l = objArray.length; i < l; i++) {
            if (objArray[i].hasOwnProperty(key) && objArray[i][key] === value) {
                return true;
            }
        }
        return false;
    },

    /**
     * 获得对象数组中指定key的值的集合
     * @param {array} arr 由对象组成的数组
     * @param {string} key 要返回值的键
     * @returns {array} 包含不重复的值的数组
     */
    getObjectUniqueValue: function(objArray, key) {
        if (!objArray) {
            return null;
        }
        if (!objArray.length) {
            return null;
        }

        var ret = [];
        for (var i = 0, l = objArray.length; i < l; i++) {
            if (!isNone(objArray[i][key])) {
                ret = ret.concat(objArray[i][key]);
            }
        }
        return this.unique(ret);
    },

    /**
     * 当对象数组的元素的某个键的值为指定值时，返回该对象
     * @param {array} objArray 对象数组
     * @param {string} itemKey 对象的键
     * @param {*} itemValue 对象的键值
     * @return {string} 返回符合条件的第一个对象。无结果返回null
     */
    getObjectByKeyValue: function(objArray, itemKey, itemValue) {
        if (!objArray || !itemKey || itemValue == undefined) {
            return console.error('getObjectByKeyValue:' + objArray + itemKey + itemValue);
        }
        for (var i = 0, l = objArray.length; i < l; i++) {
            var obj = objArray[i];
            if (obj[itemKey] == itemValue) {
                return obj;
            }
        }
        return null;
    },

    /**
     * 当对象数组的元素的某个键的值符合指定正则表达式时，返回该对象
     * @param {array} objArray 对象数组
     * @param {string} itemKey 对象的键
     * @param {RegExp} itemValueRegexp 对象的键值正则表达式
     * @return {string} 返回符合条件的第一个对象。无结果返回null
     */
    getObjectByKeyValueRegexp: function(objArray, itemKey, itemValueRegexp) {
        if (!objArray || !itemKey || !(itemValueRegexp instanceof RegExp)) {
            return console.error('getObjectByKeyValueRegexp:' + objArray + itemKey + itemValueRegexp);
        }
        for (var i = 0, l = objArray.length; i < l; i++) {
            var obj = objArray[i];
            if (obj[itemKey].match(itemValueRegexp)) {
                return obj;
            }
        }
        return null;
    },

    /**
     * 当对象数组中的元素的某个键的值为指定值时，返回所有满足条件的对象数组
     * @param {array} objArray 对象数组
     * @param {string} itemKey 对象的键
     * @param {*} itemValue 对象的键值
     * @return {array} 返回符合条件的对象数组。无结果返回null
     */
    getObjectArrayByKeyValue: function(objArray, itemKey, itemValue) {
        if (!objArray || !itemKey) {
            return console.error('getObjectArrayByKeyValue:' + objArray + itemKey + itemValue);
        }
        var ret = [];
        for (var i = 0, l = objArray.length; i < l; i++) {
            var obj = objArray[i];
            //V1.8.6
            //改为全等
            if (obj[itemKey] === itemValue) {
                ret.push(obj);
            }
        }
        if (ret.length) {
            return ret;
        } else {
            return null;
        }
    },

    /**
     * 返回一个对象数组中包含指定键的第一个对象
     * @param {array} objArray 对象数组
     * @param {string} itemKey 对象的键
     */
    getObjectByValidKey: function(objArray, itemKey) {
        if (!objArray || !itemKey) {
            return console.error('getObjectByValidKey', objArray + itemKey);
        }

        for (var i = 0, l = objArray.length; i < l; i++) {
            var obj = objArray[i];
            if (obj.hasOwnProperty(itemKey) && isNone(obj[itemKey]) == false) {
                return obj;
            }
        }
        return null;
    },

    /**
     * 返回一个对象数组中包含arguments中的所有键，且值不为none的第一个对象
     * @param {array} objArray 对象数组
     */
    getObjectByValidKeys: function(objArray) {
        for (var i = 0, l = objArray.length; i < l; i++) {
            var obj = objArray[i];
            for (var j = 1, k = arguments.length; j < k; j++) {
                if (obj.hasOwnProperty(arguments[j]) && isNone(obj[arguments[j]]) == false) {
                    return obj;
                }
            }
        }
        return null;
    },

    /**
     * 返回对象数组中包含特定属性值的元素的子数组
     * @param {array} objArray 对象数组
     * @param {string} itemKey 包含给定值的键
     * @param {*} itemValue 指定值
     */
    getSubArrayByValue: function(objArray, itemKey, itemValue) {
        if (!objArray || !itemKey || isUndef(itemValue)) {
            return console.error('getSubArrayByValue', objArray + itemKey + itemValue);
        }
        var ret = [];
        for (var i = 0, l = objArray.length; i < l; i++) {
            var obj = objArray[i];
            if (obj.hasOwnProperty(itemKey) && obj[itemKey] === itemValue) {
                ret.push(obj);
            }
        }
        return ret;
    },

    /**
     * 返回由对象数组中每个对象的指定属性值组成的数组
     * @param {array} objArray 对象数组
     * @param {string} itemKey 返回值的属性名
     */
    getSubArrayByKey: function(objArray, itemKey) {
        if (!objArray || !itemKey) {
            return console.error('getSubArrayByKey', objArray + itemKey);
        }
        var ret = [];
        for (var i = 0, l = objArray.length; i < l; i++) {
            ret.push(objArray[i][itemKey]);
        }
        return ret;
    },

    /**
     * 返回由对象数组中第一个属性值组成的数组
     * @param {array} objArray 对象数组
     */
    getValueArray: function(objArray) {
        if (!objArray) {
            return console.error('getValueArray', objArray);
        }
        var ret = [];
        for (var i = 0, l = objArray.length; i < l; i++) {
            ret.push(Object.values(objArray[i]));
        }
        return ret;
    },

    /**
     * 返回由对象数组中每个对象的指定属性值组成的对象数组
     * @param {array} objArray 对象数组     
     */
    getSubArrayByKeys: function(objArray) {
        if (!objArray) {
            return console.error('getSubArrayByKeys', objArray);
        }
        if (arguments.length < 2) {
            return console.error('getSubArrayByKeys:未指定key');
        }
        var ret = [];
        for (var i = 0, l = objArray.length; i < l; i++) {
            var obj = {};
            for (var j = 1, k = arguments.length; j < k; j++) {
                obj[arguments[j]] = objArray[i][arguments[j]];
            }
            ret.push(obj);
        }
        return ret;
    },

    /**
     * 返回由对象数组中每个对象作为参数执行过滤方法后剩余的对象数组
     * @param {array} objArray 对象数组
     * @param {function} fncFilter 过滤方法，传入对象数组中的对象元素，方法返回false则过滤该对象
     */
    getSubArrayByFilter: function(objArray, fncFilter) {
        if (!objArray || !fncFilter) {
            return objArray;
        }
        var ret = [];
        for (var i = 0, l = objArray.length; i < l; i++) {
            var obj = objArray[i];
            if (fncFilter(obj)) {
                ret.push(obj);
            }
        }
        return ret;
    },

    /**
     * 将json数组转换成table的html
     * @param {array} objArray 对象数组
     */
    json2HTMLTable: function(objArray) {
        if (isEmpty(objArray)) {
            return null;
        }
        var data = this.json2Matrix(objArray);
        var rows = [];
        for (var i = 1, l = data.length; i < l; i++) {
            var row = data[i];
            var s = row.join('</td><td>');
            rows.push(s);
        }

        var tbody = rows.join('</td></tr><tr><td>');

        return fzString.concat(
            '<table><thead><tr><th>',
            data[0].join('</th><th>'),
            '</th></tr></thead><tbody><tr><td>',
            tbody,
            '</td></tr></tbody></table>'
        )
    },

    /**
     * 将json数组转换成二维数组
     * @param {array} objArray 对象数组
     * @param {array} [ignoreProperties] 忽略的属性
     */
    json2Matrix: function(objArray, ignoreProperties) {
        if (isEmpty(objArray)) {
            return null;
        }
        var i = 1;
        var l = objArray.length;
        var data = [];
        var cols = Object.keys(objArray[0]);
        var k, obj;
        if (isArray(ignoreProperties)) {
            cols = this.difference(cols, ignoreProperties);
            for (; i < l; i++) {
                obj = objArray[i];
                for (k in obj) {
                    if (!this.inArray(k, cols) && !this.inArray(k, ignoreProperties)) {
                        cols.push(k);
                    }
                }
            }
        } else {
            for (; i < l; i++) {
                obj = objArray[i];
                for (k in obj) {
                    if (!this.inArray(k, cols)) {
                        cols.push(k);
                    }
                }
            }
        }
        data.push(cols);
        getData();
        return data;

        function getData() {
            for (var i = 0, l = objArray.length; i < l; i++) {
                var obj = objArray[i];
                getRow(obj);
            }

            function getRow(obj) {
                var row = [];
                for (var i = 0, l = cols.length; i < l; i++) {
                    var cell = obj[cols[i]] || "";
                    if (isObject(cell)) {
                        cell = JSON.stringify(cell);
                    }
                    row.push(cell);
                }
                data.push(row);
            }
        }
    },

    /**
     * 将json数组转换成二维数组
     * @param {array} objArray 对象数组
     * @param {array} arrProperty 要取的属性
     * @param {array} [arrPropertyName] 显示在表头的属性名
     */
    json2ArrayArray: function(objArray, arrProperty, arrPropertyName) {
        if (isEmpty(objArray)) {
            return null;
        }
        if (isEmpty(arrProperty)) {
            throw new Error('json2ArrayArray:未指定属性');
        }
        var data = [];
        if (isEmpty(arrPropertyName)) {
            data.push(arrProperty);
        } else {
            if (arrPropertyName.length !== arrProperty.length) {
                throw new Error('json2ArrayArray:属性与别名数量不一致');
            }
            data.push(arrPropertyName);
        }

        for (var i = 0, l = objArray.length; i < l; i++) {
            var obj = objArray[i];
            var row = [];
            for (var k = 0, m = arrProperty.length; k < m; k++) {
                row.push(obj[arrProperty[k]]);
            }
            data.push(row);
        }
        return data;
    },

    /**
     * 按指定键对对象数组进行排序。该操作会修改传入的数组，同时返回一个新的数组
     * @param {array} objArray 待排序的对象数组
     * @param {string} sortKey 要排序的键
     * @param {boolean} [reverse] 设为true时按降序排序
     */
    sortObjectArray: function(objArray, sortKey, reverse) {
        function sortAsc(key) {
            return function(a, b) {
                if (a[key] == b[key]) {
                    return 0;
                } else if (a[key] < b[key]) {
                    return -1;
                } else {
                    return 1;
                }
            }
        }

        function sortDesc(key) {
            return function(a, b) {
                if (a[key] == b[key]) {
                    return 0;
                } else if (a[key] < b[key]) {
                    return 1;
                } else {
                    return -1;
                }
            }
        }
        if (reverse) {
            return objArray.sort(sortDesc(sortKey));
        } else {
            return objArray.sort(sortAsc(sortKey));
        }
    },

    /**
     * 验证对象数组中每个对象的指定键是否有效，如果无效则丢弃该对象，返回新的数组
     * @param {array} objArray 待处理的对象数组
     * @param {string} checkKey 要验证有效性的键
     * @param {function} fncValid 验证有效性的方法，返回false则丢弃该对象
     */
    removeInvalidProperty: function(objArray, checkKey, fncValid) {
        var ret = [];
        for (var i = 0, l = objArray.length; i < l; i++) {
            var obj = objArray[i];
            if (fncValid(obj[checkKey])) {
                ret.push(obj);
            }
        }
        return ret;
    },

    /**
     * 返回范围内的整数数组
     * @param {number} start 开始
     * @param {number} end 结束
     */
    range: function(start, end) {
        var a = [];
        for (var i = start; i <= end; i++) {
            a.push(i);
        }
        return a;
    },

    /**
     * 返回expression表示的范围中的整数数组
     * @param {string} expression 
     */
    ranges: function(expression) {
        var a = expression.split(',');
        var ret = [];

        for (var i = 0, l = a.length; i < l; i++) {
            var s = a[i];
            if (s.indexOf('-') === -1) {
                ret.push(parseInt(s));
            } else {
                var aa = s.split('-');
                var j = parseInt(aa[0]),
                    k = parseInt(aa[1]);
                for (; j <= k; j++) {
                    ret.push(j);
                }
            }
        }
        return ret;
    },

    /**
     * 基于指定方法生成指定元素数量的数组
     * @param {number} count 生成数量
     * @param {function} fn 将该方法的返回值推入返回数组
     */
    generate: function(count, fn, arg1, arg2, arg3, arg4, arg5, arg6) {
        var ret = [];
        for (var i = 0; i < count; i++) {
            ret.push(fn.call(this, arg1, arg2, arg3, arg4, arg5, arg6));
        }
        return ret;
    },

    /**
     * 遍历可迭代对象，返回由fn的返回值构成的数组。该方法不对参数做任何判断，性能较高。
     * @param {*} arrayLike Iterable
     * @param {function} fn 传入item,index
     */
    each: function(arrayLike, fn) {
        var ret = [];
        for (var i = 0, l = arrayLike.length; i < l; i++) {
            ret.push(fn(arrayLike[i], i));
        }
        return ret;
    },

    /**
     * 遍历可迭代对象，不做任何判断，不返回任何值。
     * @param {*} arrayLike Iterable
     * @param {function} fn 传入item,index
     */
    walk: function(arrayLike, fn) {
        for (var i = 0, l = arrayLike.length; i < l; i++) {
            fn(arrayLike[i], i);
        }
    },

    /**
     * 遍历可迭代对象，满足条件时退出
     * 1.8.2增加
     * @param {*} arrayLike Iterable
     * @param {function} fn 传入item,index
     * @param {*} breakCondition 当fn执行返回结果==breakCondition时中止遍历
     */
    walkWhile: function(arrayLike, fn, breakCondition) {
        for (var i = 0, l = arrayLike.length; i < l; i++) {
            if (fn(arrayLike[i], i) == breakCondition) {
                break;
            }
        }
    },

    /**
     * 反向遍历可迭代对象，不做任何判断，不返回任何值。
     * @param {*} arrayLike Iterable
     * @param {function} fn 传入item,index
     */
    walkreverse: function(arrayLike, fn) {
        for (var i = arrayLike.length - 1; i > -1; i--) {
            fn(arrayLike[i], i);
        }
    },

    /**
     * 查找值在数组中出现的次数
     * @param {*} arrayLike Iterable 源数组
     * @param {*} valueFind 要查找的值
     */
    countIf: function(arrayLike, valueFind) {
        var cnt = 0;
        for (var i = 0, l = arrayLike.length; i < l; i++) {
            const a = arrayLike[i];
            if (a == valueFind) {
                cnt++;
            }
        }
        return cnt;
    },

    /**
     * V1.8.3
     * 数组过滤
     * @param {*} arrayLike Iterable 源数组
     * @param {function} fnFilter 过滤函数，传入val和index，当函数返回值为真时保留当前参数值
     */
    filter: function(arrayLike, fnFilter) {
        var ret = [];
        for (var i = 0, l = arrayLike.length; i < l; i++) {
            if (fnFilter(arrayLike[i], i)) {
                ret.push(arrayLike[i]);
            }
        }
        return ret;
    },

    /**
     * V1.8.5
     * 按指定规则过滤数组，返回按指定规则得到的值组成的新数组
     * @param {*} arrayLike Iterable 源数组
     * @param {function} fnFilter 过滤函数
     * @param {function} fnReturn 处理过滤结果的函数，传入item和index，函数返回值作为filterAs方法的返回数组元素值
     */
    filterAs: function(arrayLike, fnFilter, fnReturn) {
        var ret = [];
        for (var i = 0, l = arrayLike.length; i < l; i++) {
            if (fnFilter(arrayLike[i], i)) {
                ret.push(fnReturn(arrayLike[i], i));
            }
        }
        return ret;
    },

    /**
     * V1.8.5
     * 按指定规则过滤数组，将按照指定规则生成的键值对添加到源对象中，若键存在则更新值
     * @param {*} arrayLike Iterable 源数组
     * @param {function} fnFilter 过滤函数
     * @param {function} fnKey 通过该函数返回key
     * @param {function} fnVal 通过该函数返回值
     * @param {object} objSource 源对象
     */
    filterToObject: function(arrayLike, fnFilter, fnKey, fnVal, objSource) {
        for (var i = 0, l = arrayLike.length; i < l; i++) {
            var item = arrayLike[i];
            if (fnFilter(item, i)) {
                var key = fnKey(item, i);
                var val = fnVal(item, i);
                objSource[key] = val;
            }
        }
    },

    /**
     * V1.8.5
     * 按指定规则过滤数组，返回按指定规则生成的键值对组成的对象
     * @param {*} arrayLike Iterable 源数组
     * @param {function} fnFilter 过滤函数
     * @param {function} fnKey 通过该函数返回key
     * @param {function} fnVal 通过该函数返回值
     */
    filterAsObject: function(arrayLike, fnFilter, fnKey, fnVal) {
        var ret = {};
        this.filterToObject(arrayLike, fnFilter, fnKey, fnVal, ret);
        return ret;
    },

    /**
     * V1.8.5
     * 按指定规则过滤数组，将过滤结果添加到源对象中
     * @param {*} arrayLike Iterable 源数组
     * @param {function} fnGetValue(item,index) 获取过滤值的方法
     * @param {function} fnFilter(item,index,filtedValue) 确定是否过滤成功的方法
     * @param {function} fnKey(item,index,filtedValue) 获取结果key的方法
     * @param {function} fnVal(item,index,filtedValue) 获取结果值的方法
     * @param {object} objSource 源对象
     */
    filterToObjectBy: function(arrayLike, fnGetValue, fnFilter, fnKey, fnVal, objSource) {
        for (var i = 0, l = arrayLike.length; i < l; i++) {
            var item = arrayLike[i];
            var filtedValue = fnGetValue(item, i);
            if (fnFilter(item, i, filtedValue)) {
                var key = fnKey(item, i, filtedValue);
                var val = fnVal(item, i, filtedValue);
                objSource[key] = val;
            }
        }
    },

    /**
     * V1.8.5
     * 按指定规则过滤数组，返回由过滤规则和生成键值对规则得到的对象
     * @param {*} arrayLike Iterable 源数组
     * @param {function} fnGetValue(item,index) 获取过滤值的方法
     * @param {function} fnFilter(item,index,filtedValue) 确定是否过滤成功的方法
     * @param {function} fnKey(item,index,filtedValue) 获取结果key的方法
     * @param {function} fnVal(item,index,filtedValue) 获取结果值的方法
     */
    filterAsObjectBy: function(arrayLike, fnGetValue, fnFilter, fnKey, fnVal) {
        var ret = {};
        this.filterToObjectBy(arrayLike, fnGetValue, fnFilter, fnKey, fnVal, ret);
        return ret;
    },

    /**
     * V1.8.3
     * 两两组合数组中的元素，生成新数组
     * @param {array} arrayLike Iterable 源数组
     */
    combine2: function(arrayLike) {
        var ret = [];
        var count = arrayLike.length;
        this.walk(arrayLike, function(val, index) {
            for (var i = index + 1; i < count; i++) {
                var item = arrayLike[i];
                ret.push([val, item]);
            }
        });
        return ret;
    },

    /**
     * V1.8.3
     * 全组合数组中的元素，生成新数组
     * @param {array} arrayLike Iterable 源数组
     */
    combineAll: function(arrayLike) {
        if (arrayLike.length < 3) {
            return [arrayLike];
        }

        var every = combine(arrayLike);
        var ret = [];
        for (var i = 1, l = every.length; i < l; i++) {
            var arr = every[i];
            for (var j = 0, k = arr.length; j < k; j++) {
                ret.push(arr[j]);
            }
        }
        return ret;

        //很神奇的网上抄的算法
        function combine(arrayLike) {
            for (var a2 = []; a2.push([]) < arrayLike.length;);
            var l = Math.pow(2, arrayLike.length) - 1;
            for (var i = 1; i <= l; i++) {
                var t = [];
                for (var s = i, k = 0; s > 0; s >>= 1, k++) {
                    if (s & 1 == 1) {
                        t.push(arrayLike[k]);
                    }
                }
                a2[t.length - 1].push(t);
            }
            return a2;
        }
    },

    /**
     * V1.8.4
     * 返回一个由指定条件分组后得到的数组组成的新数组
     * @param {array} arrayLike Iterable 源数组
     * @param {function} fnGroup(valueA,valueB,indexA,indexB) 决定如何分组的方法，返回true时将a和b放在一组
     */
    groupBy: function(arrayLike, fnGroup) {
        var ret = [];
        var remain = this.from(arrayLike);
        var groupIndex = 0;
        var indexA = -1,
            indexB = -1;

        for (; remain.length > 0; groupIndex++) {
            var a = remain[0];
            // var current = this.from(remain);
            ret[groupIndex] = remain.splice(0, 1);
            indexA++;

            for (var j = 0; j < remain.length;) {
                var b = remain[j];
                indexB++;

                if (fnGroup(a, b, indexA, indexB)) {
                    ret[groupIndex][ret[groupIndex].length] = remain.splice(j, 1)[0];
                } else {
                    j++;
                }
            }
        }
        return ret;
    },

    /**
     * V1.8.4
     * 返回一个对象，其值由指定的条件对源对象进行分组后得到，对应的键由指定条件得到
     * @param {array} arrayLike Iterable 源数组
     * @param {function} fnGroup(valueA,valueB,indexA,indexB) 决定如何分组的方法，返回true时将a和b放在一组
     * @param {function} fnKey(valueA,valueB,indexA,indexB) 决定如何得到object的key值
     */
    groupAsObject: function(arrayLike, fnGroup, fnKey) {
        var ret = {};
        var remain = this.from(arrayLike);
        var groupIndex = 0;
        var indexA = -1;

        for (; remain.length > 0; groupIndex++) {
            var a = remain[0];
            var currentGroup = remain.splice(0, 1);
            indexA++;
            var indexB = 0;

            for (var j = 0; j < remain.length;) {
                var b = remain[j];
                indexB++;

                if (fnGroup(a, b, indexA, indexB)) {
                    var key = fnKey(a, b, indexA, indexB);
                    if (ret[key]) {
                        ret[key][ret[key].length] = remain.splice(j, 1)[0];
                    } else {
                        ret[key] = currentGroup;
                    }
                    // ret[groupIndex][ret[groupIndex].length] = remain.splice(j, 1)[0];
                } else {
                    j++;
                }
            }
        }
        return ret;
    },

    /**
     * V1.8.6
     * 2021/02/07/ 14:13:12
     * 遍历数组，满足查找条件时返回查找到的元素
     * @param {array} arrayLike Iterable 源数组
     * @param {function} fnCondition 传入item和index，返回true值时得到查找结果
     */
    find: function(arrayLike, fnCondition) {
        for (var i = 0, l = arrayLike.length; i < l; i++) {
            var item = arrayLike[i];
            if (fnCondition(item, i)) {
                return item;
            }
        }
    },

    /**
     * V1.8.6
     * 2021/02/07/ 14:13:18
     * 对数组中的每个元素调用fn，间隔inv后调用下一个
     * @param {array} arrayLike 
     * @param {function} fn 对每个元素执行的方法，传入item和index
     * @param {number} inv 间隔毫秒数
     * @param {function} [fnFinish] 遍历结束后执行的方法
     */
    execInterval: function(arrayLike, fn, inv, fnFinish) {
        var index = 0;
        var len = arrayLike.length;

        go();

        function go() {
            var item = arrayLike[index];
            fn(item, index);
            index++;
            if (index <= len) {
                setTimeout(go, inv);
            } else {
                fnFinish && fnFinish();
            }
        }
    }
};

var fzSet = {
    /**
     * V1.8.4
     * 将可迭代对象的值转换成集合
     * @param {*} arrayLike 可迭代对象
     */
    from: function(arrayLike) {
        return Array.from(new Set(arrayLike));
    },

    /**
     * V1.8.4
     * 判断集合1是否包含集合2
     * @param {*} set1 集合1
     * @param {*} set2 集合2
     */
    contains: function(set1, set2) {
        //集合1长度小于集合2则不包含
        if (set1.length < set2.length) {
            return false;
        }

        return !set2.some(function(item) {
            return (set1.indexOf(item) === -1);
        });
    },

    /**
     * V1.8.4
     * 判断两个集合是否互相包含，即相等（不管顺序），参数只要有非true值，则返回false
     * @param {*} set1 集合1
     * @param {*} set2 集合2
     */
    equals: function(set1, set2) {
        if (!set1 || !set2) {
            return false;
        }
        if (set1.length !== set2.length) {
            return false;
        }
        return this.contains(set1, set2);
    },

    /**
     * V1.8.4
     * 判断数组中的集合是否均相等
     * @param {array} setArray 由集合组成的数组
     */
    equalsAll: function(setArray) {
        var me = this;
        return setArray.every(fn);

        function fn(value, index) {
            if (index == 0) {
                return true;
            }
            return me.equals(setArray[index - 1], value);
        }
    },

    /**
     * 去重
     * @param {array} arr 
     */
    unique: function(arr) {
        return Array.from(new Set(arr));
    },

    /**
     * 交集
     * @param {array} arr1
     * @param {array} arr2 
     */
    intersect: function(arr1, arr2) {
        var s = new Set(arr2);
        var t = new Set(arr1.filter(function(x) {
            return s.has(x);
        }));
        return Array.from(t);
    },

    /**
     * 并集
     * @param {array} arr1 
     * @param {array} arr2 
     */
    union: function(arr1, arr2) {
        var s1 = new Set(arr1),
            s2 = new Set(arr2);
        return Array.from(new Set([...s1, ...s2]));
    },

    /**
     * 差集
     * @param {array} arr1 
     * @param {array} arr2 
     */
    difference: function(arr1, arr2) {
        var s = new Set(arr2);
        var t = new Set(arr1.filter(function(x) {
            return !s.has(x);
        }));
        return Array.from(t);
    }
};

var fzObject = {
    /**
     * 判断对象是否为空
     * @param {object} o 待测试对象 
     */
    empty: function(o) {
        var t;
        for (t in o) {
            return false;
        }
        return true;
    },

    /**
     * 当对象的所有属性均为空时，返回true
     * @param {object} o 待测试对象
     */
    emptyProperties: function(o) {
        var t;
        for (t in o) {
            if (!isEmpty(o[t])) {
                return false;
            }
        }
        return true;
    },

    /**
     * 测试两个对象是否相等
     * @param {object} obj1 object1
     * @param {object} obj2 object2
     */
    equals: function(obj1, obj2) {
        var key;
        for (key in obj1) {
            if (obj1.hasOwnProperty(key) != obj2.hasOwnProperty(key)) {
                return false;
            } else if (typeof obj1[key] !== typeof obj2[key]) {
                return false;
            }
        }
        for (key in obj2) {
            if (obj1.hasOwnProperty(key) != obj2.hasOwnProperty(key)) {
                return false;
            } else if (typeof obj1[key] != typeof obj2[key]) {
                return false;
            }
            if (!obj1.hasOwnProperty(key)) {
                continue;
            }

            if (obj1[key] instanceof Array && obj2[key] instanceof Array) {
                if (!fzArray.equals(obj1[key], obj2[key])) {
                    return false;
                }
            } else if (obj1[key] instanceof Object && obj2[key] instanceof Object) {
                if (!this.equals(obj1[key], obj2[key])) {
                    return false;
                }
            } else if (obj1[key] != obj2[key]) {
                return false;
            }
        }
        return true;
    },

    /**
     * 返回克隆后的新对象（深拷贝）
     * @param {*} o 源
     */
    clone: function(o) {
        if (o === undefined) {
            return undefined
        }
        if (o === null) {
            return null
        }
        var newObj;
        if (o instanceof Array) {
            newObj = [];
            for (var i = 0, l = o.length; i < l; i++) {
                if (typeof o[i] === 'object' && o[i] !== null) {
                    newObj[i] = this.clone(o[i]);
                } else {
                    newObj[i] = o[i];
                }
            }
        } else if (typeof o === 'object') {
            newObj = {};
            for (var key in o) {
                if (typeof o[key] === 'object' && o[key] !== null) {
                    newObj[key] = this.clone(o[key]);
                } else {
                    newObj[key] = o[key];
                }
            }
        }

        return newObj;
    },

    /**
     * 将对象的空属性替换为指定值后，返回新的对象
     * @param {object} o 源对象
     * @param {*} resetAs 替换empty的值
     */
    resetEmpty: function(o, resetAs) {
        var ret = this.clone(o);
        for (var key in ret) {
            if (isEmpty(ret[key])) {
                ret[key] = resetAs;
            }
        }
        return ret;
    },

    /**
     * 获取对象属性，如果obj不是对象或key不存在则返回默认值
     * @param {object} obj 
     * @param {string} key 键
     * @param {*} defaultValue 对象为空或者对象不含key时返回的默认值
     */
    property: function(obj, key, defaultValue) {
        if (isObject(obj)) {
            if (obj.hasOwnProperty(key)) {
                return obj[key];
            }
        }
        return defaultValue;
    },

    /**
     * 删除对象属性
     * @param {object} obj 源对象
     * @param {string} property 属性名
     */
    deleteProperty: function(obj, property) {
        delete obj[property];
    },

    /**
     * 当对象的子对象的某个键的值为指定值时，返回该子对象的键
     * @param {object} parentObj 父对象
     * @param {string} childKey 子对象中的键
     * @param {*} childValue 子对象的键值
     * @return {string} 返回符合条件的第一个子对象的键。无结果返回null
     */
    getObjectChildKeyByValue: function(parentObj, childKey, childValue) {
        if (!parentObj || !childKey || childValue == undefined) {
            console.error('getObjectChildKeyByValue', parentObj, childKey, childValue);
            return;
        }
        for (var key in parentObj) {
            var childObj = parentObj[key];
            if (childObj[childKey] == childValue) {
                return key;
            }
        }
        return null;
    },

    toArray: function(obj) {
        var ret = [];
        for (var key in obj) {
            ret.push(obj[key]);
        }
        return ret;
    },

    /**
     * 返回按指定排序规则排序后的数组
     * @param {object} obj 源对象
     * @param {function} fnsort 排序方法
     */
    toSortedArray: function(obj, fnsort) {
        var ret = [];
        for (var key in obj) {
            ret.push([key, obj[key]]);
        }
        ret.sort(fnsort);
        return ret;
    },

    /**
     * V1.8.4
     * 将数组转换为Object，数组的元素值为Object的key，元素值由initval决定
     * @param {*} arrayLike Iterable
     * @param {*} initval 对象中元素的初始值 [常亮 | function(key,index)的返回值]
     * @param {function} [fnKey(item,index)] 生成key的function，忽略则使用arrayLike的值作为key
     */
    fromArray: function(arrayLike, initval, fnKey) {
        if (typeof fnKey == 'function') {
            if (typeof initval == 'function') {
                return byfnKey();
            } else {
                return byvalKey();
            }
        } else {
            if (typeof initval == 'function') {
                return byfn();
            } else {
                return byval();
            }
        }

        function byval() {
            var ret = {};
            for (var i = 0, l = arrayLike.length; i < l; i++) {
                var key = arrayLike[i];
                ret[key] = initval;
            }
            return ret;
        }

        function byfn() {
            var ret = {};
            for (var i = 0, l = arrayLike.length; i < l; i++) {
                var key = arrayLike[i];
                ret[key] = initval(key, i);
            }
            return ret;
        }

        function byvalKey() {
            var ret = {};
            for (var i = 0, l = arrayLike.length; i < l; i++) {
                var key = fnKey(arrayLike[i], i);
                ret[key] = initval;
            }
            return ret;
        }

        function byfnKey() {
            var ret = {};
            for (var i = 0, l = arrayLike.length; i < l; i++) {
                var key = fnKey(arrayLike[i], i);
                ret[key] = initval(arrayLike[i], i);
            }
            return ret;
        }
    },

    /**
     * V1.8.4
     * 遍历对象
     * @param {object} obj 源对象
     * @param {function} fn [key,item,index]
     */
    walk: function(obj, fn) {
        var index = -1;
        for (var key in obj) {
            index++;
            fn(key, obj[key], index);
        }
    },

    /**
     * V1.8.4
     * 返回一个对象的所有属性值中指定属性值的集合
     * @param {object} obj 源对象，对象的属性值也是对象
     * @param {string} childKey 从对象的属性值对象中取值的key
     */
    getUniqueChildPropertyValue: function(obj, childKey) {
        var arr = [];
        fzObject.walk(obj, function(key, item) {
            arr.push(item[childKey]);
        });
        return fzArray.unique(arr);
    }
};

var fzString = {
    /**
     * source为空时返回otherwise
     * @param {string} source 源字符串
     * @param {string} otherwise 源字符串为空时的返回值
     */
    or: function(source, otherwise) {
        return source ? source : otherwise;
    },

    /**
     * 返回字符串左起count个字符
     * @param {string} str 
     * @param {number} count 
     */
    Left: function(str, count) {
        if (isNaN(count) || count == null) {
            count = str.length;
        } else {
            if (parseInt(count) < 0 || parseInt(count) > str.length) {
                count = str.length;
            }
        }
        return str.substr(0, count);
    },

    /**
     * 返回字符串右边count个字符
     * @param {string} str 
     * @param {number} count 
     */
    Right: function(str, count) {
        if (isNaN(count) || count == null) {
            count = str.length;
        } else {
            if (parseInt(count) < 0 || parseInt(count) > str.length) {
                count = str.length;
            }
        }
        return str.substring(str.length - count, str.length);
    },

    /**
     * 返回字符串从nStart开始的nLen个字符
     * @param {string} str 
     * @param {number} nStart 开始位置索引（第一个字符为0）
     * @param {number} nLen 长度
     */
    Mid: function(str, nStart, nLen) {
        return str.substr(nStart, nLen);
    },

    /**
     * 查找strSub在str中首次出现的位置
     * @param {string} str 
     * @param {string} strSub 
     */
    InStr: function(str, strSub) {
        if (strSub == null) {
            return -1;
        }
        return str.indexOf(strSub);
    },

    /**
     * 查找strSub在str中末次出现的位置
     * @param {*} str 
     * @param {string} strSub 
     */
    InStrRev: function(str, strSub) {
        if (strSub == null) {
            return -1;
        }
        return str.lastIndexOf(strSub);
    },

    /**
     * 按照arguments中的值格式化字符串。格式化字符串中的参数为{0} {1} ...
     * @param {string} source 格式化字符串
     */
    format: function(source) {
        var s = source;
        for (var i = 1, l = arguments.length; i < l; i++) {
            var reg = new RegExp('\\{' + (i - 1) + '\\}', 'gi');
            s = s.replace(reg, arguments[i]);
        }
        return s;
    },

    /**
     * 按照指定的格式将对象转换为字符串。格式化字符串中以{xx}表示对象的属性名
     * @param {string} source 格式化字符串
     * @param {*} formatObj 对象
     */
    formatBy: function(source, formatObj) {
        var ret = source;
        for (var key in formatObj) {
            var val = formatObj[key];
            ret = ret.replace(new RegExp('\\{' + key + '\\}', 'gi'), val)
        }
        return ret;
    },

    /**
     * 按照指定的格式将对象数组转换为字符串。格式化字符串中以{xx}表示对象的属性名
     * @param {array} objArray 对象数组
     * @param {string} format 格式化字符串
     * @param {string} [separator] 分隔符，默认<br />
     */
    formatObjectArray: function(objArray, format, separator) {
        if (isUndef(separator)) {
            separator = '<br />';
        }
        var ret = [];
        for (var i = 0, l = objArray.length; i < l; i++) {
            var obj = objArray[i];
            var row = this.formatBy(format, obj);
            ret.push(row);
        }
        return ret.join(separator);
    },

    /**
     * 取字符串两个标记中的子串
     * @param {string} source 源字符串
     * @param {string} prefix 前缀，可以空
     * @param {string} suffix 后缀，可以空
     * @returns {string} 截取后的子串，不含前后缀。源字符串不含前后缀时返回本身
     */
    inString: function(source, prefix, suffix) {
        if (prefix && suffix) {
            var np = source.indexOf(prefix);
            if (np == -1) {
                return source;
            }
            var tmp = source.substring(source.indexOf(prefix) + prefix.length);
            var ns = tmp.indexOf(suffix);
            if (ns == -1) {
                return source;
            }
            return tmp.substring(0, tmp.indexOf(suffix));
        }
        if (prefix) {
            if (source.indexOf(prefix) > -1) {
                return source.substring(source.indexOf(prefix) + prefix.length);
            }
        }
        if (suffix) {
            if (source.indexOf(suffix) > -1) {
                return source.substring(0, source.indexOf(suffix));
            }
        }
        return source;
    },

    /**
     * 取字符串两个标记中的子串，suffix是出现在prefix之后的
     * @param {string} source 源字符串
     * @param {string} prefix 前缀，非空
     * @param {string} suffix 后缀，非空
     * @returns {string} 截取后的子串，不含前后缀。源字符串不含前后缀时返回空字符串
     */
    between: function(source, prefix, suffix) {
        if (prefix && suffix) {
            var np = source.indexOf(prefix);
            if (np == -1) {
                return '';
            }
            var tmp = source.substring(source.indexOf(prefix) + prefix.length);
            var ns = tmp.indexOf(suffix);
            if (ns == -1) {
                return '';
            }
            return tmp.substring(0, tmp.indexOf(suffix));
        }
        if (prefix) {
            if (source.indexOf(prefix) > -1) {
                return source.substring(source.indexOf(prefix) + prefix.length);
            }
        }
        if (suffix) {
            if (source.indexOf(suffix) > -1) {
                return source.substring(0, source.indexOf(suffix));
            }
        }
        return '';
    },

    /**
     * 取字符串中圆括号内的子串
     * @param {string} source 源字符串
     * @return 直接调用inString(source,'(',')')
     */
    inRoundBrackets: function(source) {
        return this.inString(source, '(', ')');
    },

    /**
     * 取字符串右边最先出现的字符之后的子串。没找到右边的字符返回source本身
     * @param {string} source 源字符串
     * @param {string} rightStr 从右开始最先出现的符号
     */
    rightOf: function(source, rightStr) {
        return source.substr(source.lastIndexOf(rightStr) + rightStr.length);
    },

    /**
     * 字符串转换为json对象 
     * @param {string} str 源json格式字符串
     */
    toJSON: function(str) {
        if (typeof str == 'string') {
            try {
                var obj = eval('(' + str + ')');
                if (typeof obj == 'object') {
                    return obj;
                } else {
                    return null;
                }
            } catch (e) {
                return null;
            }
        } else {
            return null;
        }
    },

    /**
     * 删除字符串中的ascii控制符，如果str为None则返回空字符串
     * @param {string} str 源字符串
     */
    removeAsciiControl: function(str) {
        return isNone(str) ? '' : typeof(str) == 'string' ? str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') : str;
    },

    /**
     * 返回参数列表中的字符串连接，忽略一切非字符串参数
     */
    concat: function() {
        var a = [];
        for (var i = 0, l = arguments.length; i < l; i++) {
            if (typeof arguments[i] == 'string') {
                a.push(arguments[i]);
            }
        }
        return a.join('');
    },

    /**
     * 测试源字符串中是否以参数列表中的任一字符串开头
     * @param {string} source 源字符串
     */
    prefixWith: function(source) {
        for (var i = 1, l = arguments.length; i < l; i++) {
            if (source.startsWith(arguments[i])) {
                return true;
            }
        }
        return false;
    },

    /**
     * 测试源字符串中是否以参数列表中的任一字符串结尾
     * @param {string} source 源字符串
     */
    suffixWith: function(source) {
        for (var i = 1, l = arguments.length; i < l; i++) {
            if (source.endsWith(arguments[i])) {
                return true;
            }
        }
        return false;
    },

    /**
     * 测试源字符串是否包含arguments里的所有子串
     * @param {string} source 源字符串     
     */
    contains: function(source) {
        for (var i = 0, l = arguments.length; i < l; i++) {
            if (source.indexOf(arguments[i]) === -1) {
                return false;
            }
        }
        return true;
    },

    /**
     * 测试源字符串是否包含arguments里的任一一个子串
     * @param {string} source 源字符串
     */
    containOne: function(source) {
        for (var i = 0, l = arguments.length; i < l; i++) {
            if (arguments[i] && source.indexOf(arguments[i]) !== -1) {
                return true;
            }
        }
        return false;
    },

    /**
     * 测试源字符串是否包含arrSub里的任一一个子串
     * @param {string} source 源字符串
     * @param {array} arrSub 包含的子串数组
     */
    containOneOf: function(source, arrSub) {
        for (var i = 0, l = arrSub.length; i < l; i++) {
            if (arrSub[i] && source.indexOf(arrSub[i]) !== -1) {
                return true;
            }
        }
        return false;
    },

    /**
     * 测试字符串中是否包含空格
     * @param {string} source 源字符串
     */
    containBlank: function(source) {
        return this.contains(source, ' ');
    },

    /**
     * 获取URL中的param值
     * @param {string} name 参数名
     */
    getURLParam: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        //2021/2/24 更新，加入.href
        var h = document.location.search;
        var r;
        if (h) {
            h = h.substr(1);
        } else {
            var p = document.location.href.split('?');
            //2021/04/08 09:57:06 p.length > 0
            if (p.length > 1) {
                h = p[1];
            } else {
                return '';
            }
        }
        r = h.match(reg);
        if (r) {
            return unescape(r[2]);
        }
    },

    /**
     * 根据给定的参数对象生成一个完整的URL
     * @param {string} baseURL URL本身
     * @param {object} objParams 参数对象
     */
    makeURL: function(baseURL, objParams) {
        var p = [];
        for (var key in objParams) {
            p.push(key + '=' + objParams[key]);
        }
        return baseURL + '?' + p.join('&');
    },

    /**
     * 获取Cookie值
     * @param {string} sCookieName Cookie名称
     */
    getCookie: function(sCookieName) {
        if (document.cookie.length > 0) {
            var s = document.cookie.indexOf(sCookieName + "=");
            if (s != -1) {
                s = s + sCookieName.length + 1;
                var c = document.cookie.indexOf(";", s);
                if (c == -1) {
                    c = document.cookie.length;
                }
                return unescape(document.cookie.substring(s, c));
            }
        }
        return '';
    },

    /**
     * 如果参数为字符串，则转换为大写。否则返回参数
     * @param {*} source 源字符串
     */
    upper: function(source) {
        if (typeof source === 'string') {
            return source.toUpperCase();
        }
        return source;
    },

    /**
     * 如果参数为字符串，则转换为小写。否则返回参数
     * @param {*} source 源字符串
     */
    lower: function(source) {
        if (typeof source === 'string') {
            return source.toLowerCase();
        }
        return source;
    },

    /**
     * 2021/05/01 13:33:48
     * V1.8.9
     * 字符串首字母大写
     * @param {string} source 源字符串
     */
    capitalize: function(source) {
        var p = source.split('');
        p[0] = p[0].toUpperCase();
        return p.join('');
    },

    /**
     * 2021/05/01 13:33:48
     * V1.8.9
     * 单词首字母大写
     * @param {string} source 源字符串
     */
    capitalizeWords: function(source) {
        return source.toLowerCase().replace(/\b([\w|',.:;"]+)\b/g, function(word) {
            return word.replace(word.charAt(0), word.charAt(0).toUpperCase());
        });
    },

    /**
     * 将15位身份证号码升为18位。如果15位号码非法则返回空字符串
     * @param {string} sIdcard15 15位身份证号
     */
    idCard15To18: function(sIdcard15) {
        var v = [2, 4, 8, 5, 10, 9, 7, 3, 6, 1, 2, 4, 8, 5, 10, 9, 7];
        var vs = "10X98765432";

        if (sIdcard15.length != 15) {
            return '';
        }

        //将15位的号码转换位17位
        var sIdcard17 = sIdcard15.substring(0, 6) + "19" + sIdcard15.substring(6);
        var n = 0;
        var r = -1;
        var t = '0'; //储存最后一个数字
        var j = 0;
        var sIdcard18 = "";
        //计数出第18位数字
        for (var i = 16; i >= 0; i--) {
            n += parseInt(sIdcard17.substring(i, i + 1)) * v[j];
            j++;
        }
        r = n % 11;
        t = vs.charAt(r);
        sIdcard18 = sIdcard17 + t;

        if (fzValidator.isIdCard(sIdcard18)) {
            return sIdcard18;
        }
        return '';
    },

    /**
     * 通过身份证号获取性别
     * @param {string} sIdcard 身份证号
     */
    getGenderByIdcard: function(sIdcard) {
        return (sIdcard.substr(16, 1) % 2 == 1) ? '男' : '女';
    },

    /**
     * 通过身份证号获取年龄
     * @param {string} sIdcard 身份证号
     */
    getAgeByIdcard: function(sIdcard) {
        var y = parseInt(sIdcard.substr(6, 4)),
            m = parseInt(sIdcard.substr(10, 2)),
            d = parseInt(sIdcard.substr(12, 2)),
            t = new Date(),
            ty = t.getFullYear(),
            tm = t.getMonth() + 1,
            td = t.getDate(),
            age = ty - y;
        if (m == tm) { //本月
            if (d < td) { //出生日小于今日，过了生日
                age++;
            }
        } else if (m < tm) { //出生月小于本月，过了生日
            age++;
        }
        return age;
    },

    /**
     * 获取字符串的字节数
     * @param {string} str 源字符串
     */
    getByteLength: function(str) {
        return str.replace(/[^\u0000-\u00ff]/g, "aaa").length;
    },

    /**
     * utf16转utf8
     * @param {string} str 源UTF16字符串
     */
    utf16to8: function(str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    },

    /**
     * 清除字符串中的HTML标记
     * @param {string} str 
     */
    cleanHTML: function(str) {
        return str.replace(/<[^>]+>/g, '');
    },

    zeroize: function(number, length) {
        return (Array(length).join('0') + number).slice(-length);
    },

    appendParam: function(sourceURL, sParamName, sValue) {
        if (!sParamName) {
            return sourceURL;
        }
        if (sValue == null) {
            return sourceURL;
        }
        var a = encodeURIComponent(sValue);
        return [sourceURL, (sourceURL.indexOf('=') > -1 ? '&' : '?'), sParamName, '=', a].join('');
    },

    /**
     * 正则查找所有匹配，返回数组
     * @param {string} source 源字符串
     * @param {RegExp} re 要查找的正则
     */
    findAllByReg: function(source, re) {
        // todo
    },

    findAll: function(source, findPrefix, findSuffix) {
        var pl = findPrefix.length;
        var sl = findSuffix.length;

        var ps = 0;
        var ss = 0;
        var found = '';
        var pos = 0;
        var ret = [];

        while (true) {
            ps = source.indexOf(findPrefix, pos);
            if (ps == -1) {
                return ret;
            }
            ss = source.indexOf(findSuffix, ps + pl);
            if (ss == -1) {
                return ret;
            }

            found = source.substring(ps + pl, ss);
            ret.push(found);
            pos = ss + sl;
        }
    },

    /**
     * 将markdown文本转换为html
     */
    markdown2html: function(source) {
        var a;
        if (window.Markdown && Markdown.Converter) {
            var c = new Markdown.Converter();
            a = c.makeHtml(source);
        } else {
            a = source.replace(/^\-{3,}$/gm, '<hr/>')
                .replace(/^(.+)$/gm, '<p>$1</p>')
                .replace(/^<p># (.+)<\/p>$/gm, '<h1>$1</h1>')
                .replace(/^<p>#{6} (.+)<\/p>$/gm, '<h6>$1</h6>')
                .replace(/^<p>#{5} (.+)<\/p>$/gm, '<h5>$1</h5>')
                .replace(/^<p>#{4} (.+)<\/p>$/gm, '<h4>$1</h4>')
                .replace(/^<p>#{3} (.+)<\/p>$/gm, '<h3>$1</h3>')
                .replace(/^<p>#{2} (.+)<\/p>$/gm, '<h2>$1</h2>');
        }

        return a;
    },

    /**
     * 统计字符串中给定规则字串的数量、不重复的数量以及次数
     * v1.4.1新增
     */
    statistics: function(source, reg) {
        reg = reg || '';
        var arr = source.split(reg);
        count = arr.length;
        var list = {};

        fzArray.walk(arr, function(x) {
            if (isUndef(list[x])) {
                list[x] = 1;
            } else {
                list[x]++;
            }
        });

        return {
            count: count,
            list: list
        };
    }
};

var fzDate = {
    /**
     * 输出格式化日期值
     * @param {date} dateObj 要格式化的日期
     * @param {string} [formatStr] 格式 [yyyy-MM-dd HH:mm:ss]
     * @returns {string} 格式化后的日期值
     */
    format: function(dateObj, formatStr) {
        if (!formatStr) {
            formatStr = 'yyyy-MM-dd HH:mm:ss';
        }
        if (typeof dateObj == 'string') {
            dateObj = this.fromString(dateObj);
        }
        if (!dateObj instanceof Date) {
            throw new Error('fzDate.foramt: ' + dateObj + ' is not Date');
        }

        var str = formatStr,
            w = ['日', '一', '二', '三', '四', '五', '六'];
        str = str.replace(/yyyy/, dateObj.getFullYear());
        str = str.replace(/MM/, dateObj.getMonth() + 1 > 9 ? dateObj.getMonth() + 1 : '0' + (dateObj.getMonth() + 1));
        str = str.replace(/M/g, dateObj.getMonth() + 1);
        str = str.replace(/w|W/g, w[dateObj.getDay()]);
        str = str.replace(/dd/, dateObj.getDate() > 9 ? dateObj.getDate().toString() : '0' + dateObj.getDate());
        str = str.replace(/d/g, dateObj.getDate());
        str = str.replace(/HH/, dateObj.getHours() > 9 ? dateObj.getHours().toString() : '0' + dateObj.getHours());
        str = str.replace(/H/g, dateObj.getHours());
        str = str.replace(/mm/, dateObj.getMinutes() > 9 ? dateObj.getMinutes().toString() : '0' + dateObj.getMinutes());
        str = str.replace(/m/g, dateObj.getMinutes());
        str = str.replace(/ss/, dateObj.getSeconds() > 9 ? dateObj.getSeconds().toString() : '0' + dateObj.getSeconds());
        str = str.replace(/s/g, dateObj.getSeconds());
        return str;
    },

    /**
     * 增加一个时间，返回新的日期
     * @param {string} interval 要增加的时间类型[s:秒,n:分,h:时,d:天,w:周,q:季,m:月,y:年]
     * @param {*} dateObj dateObj 源日期对象 [date | string | timestamp]
     * @param {number} count 要添加的数量
     */
    add: function(interval, dateObj, count) {
        dateObj = this.from(dateObj);
        if (!dateObj) {
            return;
        }
        switch (interval) {
            case 's':
                return new Date(Date.parse(dateObj) + (1000 * count));
            case 'n':
                return new Date(Date.parse(dateObj) + (60000 * count));
            case 'h':
                return new Date(Date.parse(dateObj) + (3600000 * count));
            case 'd':
                return new Date(Date.parse(dateObj) + (86400000 * count));
            case 'w':
                return new Date(Date.parse(dateObj) + ((86400000 * 7) * count));
            case 'q':
                return new Date(dateObj.getFullYear(), (dateObj.getMonth()) + count * 3, dateObj.getDate(), dateObj.getHours(), dateObj.getMinutes(), dateObj.getSeconds());
            case 'm':
                return new Date(dateObj.getFullYear(), (dateObj.getMonth()) + count, dateObj.getDate(), dateObj.getHours(), dateObj.getMinutes(), dateObj.getSeconds());
            case 'y':
                return new Date((dateObj.getFullYear() + count), dateObj.getMonth(), dateObj.getDate(), dateObj.getHours(), dateObj.getMinutes(), dateObj.getSeconds());
        }
    },

    /**
     * 计算两个日期之间的时间量差值
     * @param {string} interval 时间类型[s:秒,n:分,h:时,d:天,w:周,m月,y年]
     * @param {*} startDate 起始时间 [date | string | timestamp]
     * @param {*} endDate 结束时间 [date | string | timestamp]
     */
    diff: function(interval, startDate, endDate) {
        var t = this.from(startDate);
        var n = this.from(endDate);
        if (!t) {
            return console.error('fzDate.diff 参数startDate错误:[', typeof startDate, ']', startDate);
        }
        if (!n) {
            return console.error('fzDate.diff 参数endDate错误:[', typeof endDate, ']', endDate);
        }

        switch (interval) {
            case 's':
                return parseInt((n - t) / 1000);
            case 'n':
                return parseInt((n - t) / 60000);
            case 'h':
                return parseInt((n - t) / 3600000);
            case 'd':
                var d = parseInt((n - t) / 86400000);
                if (d == 0) {
                    if (n.getDate() == t.getDate()) {
                        return 0;
                    } else {
                        return n > t ? 1 : -1;
                    }
                }
                return d;
            case 'w':
                return parseInt((n - t) / (86400000 * 7));
            case 'm':
                return (n.getMonth() + 1) + ((n.getFullYear() - t.getFullYear()) * 12) - (t.getMonth() + 1);
            case 'y':
                return n.getFullYear() - t.getFullYear();
            default:
                console.error('fzDate.diff:参数interval错误[ymdhnsw]', interval);
        }
    },

    /**
     * 返回当前时间的x天之前0点的日期（x为负数表示x天之后）
     * @param {number} x 间隔的天数
     */
    daysBefore: function(x) {
        var today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate() - x + 1);
    },

    /**
     * 返回一个日期对象的日期
     * @param {*} objDate 日期对象或字符串格式日期值
     * @param {string} [strFormat] 日期格式 默认yyyy-MM-dd
     */
    getDate: function(objDate, strFormat) {
        strFormat = strFormat || 'yyyy-MM-dd';
        return this.format(objDate, strFormat);
    },

    /**
     * 返回今天的日期
     * @param {string} [strFormat] 日期格式 默认yyyy-MM-dd
     */
    today: function(strFormat) {
        return this.getDate(new Date(), strFormat);
    },

    /**
     * 返回昨天的日期
     * @param {string} [strFormat] 日期格式 默认yyyy-MM-dd
     */
    yesterday: function(strFormat) {
        return this.getDate(this.add('d', new Date(), -1), strFormat);
    },

    /**
     * 返回明天的日期
     * @param {string} [strFormat] 日期格式 默认yyyy-MM-dd
     */
    tomorrow: function(strFormat) {
        return this.getDate(this.add('d', new Date(), 1), strFormat);
    },

    /**
     * 返回上周的日期
     * @param {string} [strFormat] 日期格式 默认yyyy-MM-dd
     */
    lastWeek: function(strFormat) {
        return this.getDate(this.add('w', new Date(), -1), strFormat);
    },

    /**
     * 返回下周的日期
     * @param {string} [strFormat] 日期格式 默认yyyy-MM-dd
     */
    nextWeek: function(strFormat) {
        return this.getDate(this.add('w', new Date(), 1), strFormat);
    },

    /**
     * 返回今天的结束时间
     */
    todayEnd: function() {
        var today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    },

    /**
     * 返回当前时间戳
     * @param {boolean} withoutMS 设为true时，返回结果不含毫秒
     */
    timestamp: function(withoutMS) {
        if (withoutMS === true) {
            return new Date().getTime().toString().substr(0, 10);
        } else {
            return new Date().getTime();
        }
    },

    /**
     * 将时间戳转换为日期
     * @param {*} timestampValue TimeStamp值 [String | Number]
     * @param {string} [formatStr] 日期格式，默认yyyy-MM-dd HH:mm:ss
     * @throws 当timestampValue非法时抛出异常
     */
    fromTimeStamp: function(timestampValue, formatStr) {
        var ts, n, s, d;
        if (typeof timestampValue == 'number') {
            s = timestampValue.toString();
        } else if (typeof timestampValue == 'string') {
            s = timestampValue;
            timestampValue = parseInt(timestampValue);
        } else {
            return console.error('fzDate.fromTimeStamp:' + timestampValue + '必须是数字或字符串');
        }
        n = s.length;
        if (n == 13) {
            ts = timestampValue;
        } else if (n == 10) {
            ts = timestampValue * 1000
        } else {
            return console.error('fzDate.fromTimeStamp:' + timestampValue + '不是有效的时间戳');
        }
        d = new Date(ts);
        if (d.toString() == 'Invalid Date') {
            return console.error('fzDate.fromTimeStamp:' + timestampValue + '不是有效的时间戳');
        }
        return this.format(d, formatStr);
    },

    /**
     * 字符串日期转日期对象
     * @param {string} strDate 字符串形式的日期
     */
    fromString: function(strDate) {
        try {
            if (this.isTinyDate(strDate)) {
                return new Date(strDate.substr(0, 4), strDate.substr(4, 2) - 1, strDate.substr(6, 2));
            } else if (this.isGeneralDate(strDate)) {
                strDate = strDate.replace(/\\./g, '-');
            } else if (this.isCNDate(strDate)) {
                strDate = strDate.replace('年', '-').replace('月', '-').replace('日', '').replace('时', ':').replace('分', ':').replace('秒', '');
                if (fzString.Right(strDate, 1) == ':') {
                    strDate = strDate + '00';
                }
            }
            return new Date(strDate.replace(/-/g, "\/"));
        } catch (e) {
            return null;
        }
    },

    /**
     * 确保返回一个日期对象，如果参数无法转换为日期则返回undefined
     * @param {*} dateValue [Date | timestamp | string]
     */
    from: function(dateValue) {
        if (!dateValue) {
            return;
        }
        if (dateValue instanceof Date) {
            return dateValue;
        }
        if (dateValue instanceof Number) {
            var n = dateValue.toString().length;
            if (n == 11 || n == 13) {
                return new Date(dateValue);
            }
        }
        if (typeof(dateValue) === 'string') {
            return this.fromString(dateValue);
        }
    },

    /**
     * 是否长日期
     * @param {string} strDate 
     */
    isLongDate: function(strDate) {
        if (!strDate) {
            return false;
        }
        var r = strDate.replace(/(^\s*)|(\s*$)/g, '').match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/);
        if (r == null) {
            return false;
        }
        var d = new Date(r[1], r[3] - 1, r[4], r[5], r[6], r[7]);
        return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4] && d.getHours() == r[5] && d.getMinutes() == r[6] && d.getSeconds() == r[7]);
    },

    /**
     * 是否短日期
     * @param {string} strDate 
     */
    isShortDate: function(strDate) {
        if (!strDate) {
            return false;
        }
        var r = strDate.replace(/(^\s*)|(\s*$)/g, '').match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
        if (r == null) {
            return false;
        }
        var d = new Date(r[1], r[3] - 1, r[4]);
        return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]);
    },

    /**
     * 是否无连接符的短日期
     * @param {string} strDate 
     */
    isTinyDate: function(strDate) {
        if (!strDate) {
            return false;
        }
        if (strDate.length != 8) {
            return false;
        }
        if (isNaN(strDate)) {
            return false;
        }
        var y = strDate.substr(0, 4),
            m = strDate.substr(4, 2),
            d = strDate.substr(6, 2),
            r = new Date(y, m - 1, d);
        return (r.getFullYear() == y && (r.getMonth() + 1) == m && r.getDate() == d);
    },

    /**
     * 是否通用格式的日期
     * @param {string} strDate 
     */
    isGeneralDate: function(strDate) {
        if (!strDate) {
            return false;
        }
        var n = strDate.replace(/\\./g, '-');
        return this.isLongDate(n) || this.isShortDate(n);
    },

    /**
     * 是否中文日期
     * @param {string} strDate 
     */
    isCNDate: function(strDate) {
        if (!strDate) {
            return false;
        }
        var n = strDate.replace('年', '-').replace('月', '-').replace('日', '').replace('时', ':').replace('分', ':').replace('秒', '');
        if (fzString.Right(n, 1) == ':') {
            n = n + '00';
        }
        return this.isShortDate(n) || this.isLongDate(n);
    },

    /**
     * 测试参数是否有效的日期格式
     * @param {string} strDate 
     */
    isDate: function(strDate) {
        return this.isLongDate(strDate) || this.isShortDate(strDate) || this.isTinyDate(strDate) || this.isGeneralDate(strDate) || this.isCNDate(strDate);
    },

    /**
     * 测试参数是否有效的日期时间
     * @param {string} strDate 
     */
    isDateTime: function(strDate) {
        if (!strDate) {
            return false;
        }
        var s = strDate.trim(),
            d = '',
            t = '',
            dateOk = false,
            timeOk = false,
            hourOk = false,
            minOk = false,
            secOk = false;
        if (s.indexOf(' ') > 0) {
            var a = s.split(' ');
            d = a[0];
            t = a[1];
            if (t.indexOf(':') > 0) {
                var tp = t.split(':');
                hourOk = (fzNumber.isPostiveInt(tp[0]) && parseInt(tp[0]) < 24);
                minOk = (fzNumber.isPostiveInt(tp[1]) && parseInt(tp[1]) < 60);
                if (tp.length > 2) {
                    secOk = (fzNumber.isPostiveInt(tp[2]) && parseInt(tp[2]) < 60);
                } else {
                    secOk = true;
                }
                timeOk = hourOk && minOk && secOk;
            } else {
                return false;
            }
        } else {
            d = s;
            timeOk = true;
        }
        dateOk = this.isDate(d);
        return dateOk && timeOk;
    },

    /**
     * V1.8.6
     * 2021/02/07/ 15:03:12
     * 返回现在的日期和时间
     * @param {string} [strFormat="yyyy-MM-dd HH:mm:ss"] 返回格式
     */
    now: function(strFormat) {
        strFormat = strFormat || 'yyyy-MM-dd HH:mm:ss';
        return this.format(new Date(), strFormat);
    },

    /**
     * V1.8.7
     * 2021/02/18 10:19:55
     * 获取指定日期是星期几
     * @param {*} dateValue 日期格式
     */
    getWeekday: function(dateValue) {
        var weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        return weekdays[new Date(dateValue).getDay()];
    },

    /**
     * V1.8.7
     * 2021/02/18 10:19:55
     * 获取指定日期是星期几，输出英文
     * @param {*} dateValue 日期
     */
    getENWeekday: function(dateValue) {
        var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return weekdays[new Date(dateValue).getDay()];
    },

    /**
     * V1.8.7
     * 2021/02/18 10:19:55
     * 获取指定日期是星期几，输出英文缩写
     * @param {*} dateValue 日期
     */
    getENWeekdayShort: function(dateValue) {
        var weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return weekdays[new Date(dateValue).getDay()];
    }
};

var fzDOM = {
    /********************************************************
     * 查询元素
     ********************************************************/
    isIFrame: function() {
        return (window.frameElement || self != top) ? true : false;
    },

    /**
     * 测试输入参数是否DOM
     * @param {*} o
     * @returns {Boolean} (typeof o == 'object') && o.tagName;
     */
    isDOM: function(o) {
        if (!o) {
            return false;
        }
        return (typeof o == 'object') && o.tagName;
    },

    /**
     * 获得一个DOM元素
     * @param {*} o [HTMLElement | Id | Selector]
     */
    get: function(o) {
        if (this.isDOM(o)) {
            return o;
        };
        return document.getElementById(o) || this.query(o);
    },

    /**
     * 封装document.querySelector
     * @param {string} selector 选择器
     */
    query: function(selector) {
        return document.querySelector(selector);
    },

    /**
     * 调用document.querySelectorAll，将结果转为数组
     * @param {string} selector 选择器
     * @param {HTMLElement} oParent 父元素 忽略则为document
     */
    queryAll: function(selector, oParent) {
        oParent = this.get(oParent) || document;
        return Array.from(oParent.querySelectorAll(selector));
    },

    /********************************************************
     * 创建元素
     ********************************************************/

    /**
     * 返回一个DOM，如果ID已存在则直接返回，否则创建一个新的DOM。如果idOrClassSelector是类选择器，新DOM的className将采用该类名；否则使用Id，类名将由className参数指定
     * @param {string} idOrClassSelector DOM的id或类选择器(不支持级联)。如果该参数是类选择器，则将其设置为新创建的DOM类名
     * @param {string} [tagName] 如果给定ID的DOM不存在，创建的DOM的tagName。[div]
     * @param {string} [className] 指定该参数后，创建的DOM使用该className作为类名
     * @param {string} [innerHTML] 设置DOM的innerHTML
     */
    use: function(idOrClassSelector, tagName, className, innerHTML) {
        var o = this.get(idOrClassSelector);
        if (o) {
            return o;
        }

        if (idOrClassSelector.startsWith('.')) {
            o = this.createDom(tagName, innerHTML, null, className ? className : idOrClassSelector.substr(1));
        } else {
            o = this.createDom(tagName, innerHTML, idOrClassSelector, className);
        }

        return o;
    },

    /**
     * 返回或创建父元素的子元素
     * @param {HTMLElement} elParent 父元素
     * @param {string} className 类选择器
     */
    child: function(elParent, className, tagName) {
        if (!className) {
            return elParent.firstChild || this.createDom(tagName);
        }
        var o = elParent.querySelector('.' + className);
        if (o) {
            return o;
        }
        return this.createDom(tagName, null, null, className);
    },

    /********************************************************
     * form元素的值相关
     ********************************************************/

    /**
     * 返回DOM的value。如果DOM不存在则返回空字符串
     * @param {*} o [HTMLElement | Id | Selector]
     * @param {boolean} trim 是否去空格、tab、\n
     */
    val: function(o, trim) {
        o = this.get(o);
        if (!o) {
            console.error('fzDOM.val:', o, '不存在');
            return '';
        }
        if (trim === true) {
            return o.value.trim().replace(/\s/g, '');
        } else {
            return o.value;
        }
    },

    /**
     * 设置DOM的value，如果value为null或undefined则设为空字符串
     * @param {*} o [HTMLElement | Id | Selector]
     * @param {string} value 值
     * @param {boolean} [dispatchEvent] 是否触发event，默认否
     */
    setValue: function(o, value, dispatchEvent) {
        o = this.get(o);
        if (!o) {
            return console.error('未找到' + o + '代表的HTMLElement');
        }
        o.value = isNull(value);
        if (dispatchEvent) {
            var evt = new Event('input');
            o.dispatchEvent(evt);
        }
    },

    /**
     * 向DOM追加值，不会追加空值
     * @param {*} o [HTMLElement | Id | Selector]
     * @param {string} sValue 要追加的值
     * @param {string} [sSeparator] 分隔符 [","]
     * @param {boolean} [bNoDup] 是否允许重复值 [true]
     * @returns 返回追加后dom的value
     */
    appendValue: function(o, sValue, sSeparator, bNoDup) {
        o = this.get(o);
        if (!o) {
            return console.error('未找到' + o + '代表的HTMLElement');
        }
        if (isEmpty(sValue)) {
            return;
        }
        sSeparator = sSeparator || ',';
        bNoDup = undefined || true;
        var v = o.value;
        if (v.length == 0) {
            o.value = sValue;
            return sValue;
        }
        var pOld = v.split(sSeparator);
        var pNew = sValue.split(sSeparator);
        var pRet;
        if (bNoDup) {
            pRet = fzArray.union(pOld, pNew);
        } else {
            pRet = pOld.concat(pNew);
        }
        var sRet = pRet.join(sSeparator);
        o.value = sRet;
        return sRet;
    },

    /********************************************************
     * 元素属性相关
     ********************************************************/

    /**
     * 返回DOM的属性值，如果DOM不存在则返回空字符串
     * @param {*} o [HTMLElement | Id | Selector]
     * @param {string} attr 属性名
     */
    getAttr: function(o, attr) {
        o = this.get(o);
        if (o) {
            return o.getAttribute(attr);
        }
        return '';
    },

    /**
     * 返回DOM的属性值整数，如果DOM不存在则返回0
     * @param {*} o [HTMLElement | Id | Selector]
     * @param {string} attr 属性名
     */
    getAttrLong: function(o, attr) {
        var s = this.getAttr(o, attr);
        if (s === '') {
            return 0;
        }
        return parseInt(s, 10);
    },

    /**
     * 返回 nodeListOrSelector 代表的DOM数组的指定属性的值的数组
     * @param {*} nodeListOrSelector DOM数组或选择器
     * @param {string} attr 属性名
     */
    getAttrList: function(nodeListOrSelector, attr) {
        var domList, ret;
        if (typeof nodeListOrSelector === 'string') {
            domList = document.querySelectorAll(nodeListOrSelector);
        } else if (isArray(nodeListOrSelector)) {
            domList = nodeListOrSelector;
        } else {
            return;
        }
        ret = [];
        for (var i = 0, l = domList.length; i < l; i++) {
            ret.push(domList[i].getAttribute(attr));
        }
        return ret;
    },

    /**
     * 返回 nodeListOrSelector 代表的DOM数组的多个属性的值的对象数组
     * @param {*} nodeListOrSelector DOM数组或选择器
     */
    getAttrListObject: function(nodeListOrSelector) {
        var domList, ret, i, l, j, k;
        if (typeof nodeListOrSelector === 'string') {
            domList = document.querySelectorAll(nodeListOrSelector);
        } else if (isArray(nodeListOrSelector)) {
            domList = nodeListOrSelector;
        } else {
            return;
        }
        ret = [];
        k = arguments.length;
        for (i = 0, l = domList.length; i < l; i++) {
            var obj = {};
            for (j = 1; j < k; j++) {
                obj[arguments[j]] = domList[i].getAttribute(arguments[j]);
            }
            ret.push(obj);
        }
        return ret;
    },

    /**
     * 删除DOM的属性
     * @param {*} o [HTMLElement | Id | Selector]
     * @param {string} attr 属性名
     */
    delAttr: function(o, attr) {
        o = this.get(o);
        if (o) {
            o.removeAttribute(attr);
        }
    },

    /**
     * 为DOM添加属性，忽略属性值时，值等于属性名
     * @param {*} o [HTMLElement | Id | Selector]
     * @param {string} name 属性名
     * @param {string} [value] 属性值
     */
    addAttr: function(o, name, value) {
        o = fzDOM.get(o);
        if (o) {
            o.setAttribute(name, isUndef(value) ? name : value);
        }
        return o;
    },

    /**
     * 为DOM设置属性
     * @param {*} o [HTMLElement | Id | Selector]
     * @param {string} name 属性名
     * @param {string} [value] 属性值，忽略则不设置
     */
    setAttr: function(o, name, value) {
        if (isUndef(value)) {
            return o;
        }
        o = fzDOM.get(o);
        if (o && !isUndef(value)) {
            o.setAttribute(name, value);
        }
        return o;
    },

    /**
     * 删除DOM的属性
     * @param {*} o [HTMLElement | Id | Selector]
     * @param {string} attr 属性名
     */
    delAttr: function(o, attr) {
        o = fzDOM.get(o);
        if (o) {
            o.removeAttribute(attr);
        }
        return o;
    },

    /**
     * 启用DOM，删除disabled属性
     * @param {*} o [HTMLElement | Id | Selector]
     */
    enable: function(o) {
        return this.delAttr(o, 'disabled');
    },

    /**
     * 禁用DOM，添加disabled=disabled属性
     * @param {*} o [HTMLElement | Id | Selector]
     */
    disable: function(o) {
        return this.addAttr(o, 'disabled');
    },

    /********************************************************
     * 外观位置相关
     ********************************************************/

    /**
     * 显示DOM 默认将display设为block，如果
     * @param {*} o [HTMLElement | Id | Selector]
     */
    show: function(o) {
        var domStyles = {
            'table': ['table'],
            'inline': ['span', 'a', 'b', 'i', 'u', 'em'],
            'inline-block': ['img'],
            'list-item': ['li'],
            'table-cell': ['td', 'th'],
            'table-row': ['tr']
        };
        o = this.get(o);
        var displaystyle = this.getAttr(o, 'displaystyle');
        if (!displaystyle) { //如果没有这个属性，说明是第一次对o进行hide或者show操作
            displaystyle = this.getStyle(o, 'display');
            if (displaystyle === 'none') { //如果是none，那么没办法，不能保存原始显示状态，默认用block
                var tn = o.tagName.toLowerCase();
                displaystyle = 'block';
                for (var key in domStyles) {
                    if (fzArray.inArray(tn, domStyles[key])) {
                        displaystyle = key;
                        break;
                    }
                }
            }
        }
        this.setAttr(o, 'displaystyle', displaystyle); //不是none，就可以保存原始状态了
        o.style.display = displaystyle;
        return o;
    },

    /**
     * 隐藏DOM 设置display为none
     * @param {*} o [HTMLElement | Id | Selector]
     */
    hide: function(o) {
        o = this.get(o);
        var displaystyle = this.getAttr(o, 'displaystyle');
        if (!displaystyle) {
            displaystyle = this.getStyle(o, 'display');
            if (displaystyle !== 'none') { //如果是none，那么没办法，不能保存原始显示状态，默认用block
                this.setAttr(o, 'displaystyle', displaystyle); //不是none，就可以保存原始状态了
            }
        }
        o.style.display = 'none';
        return o;
    },

    /**
     * 切换DOM的显示状态，显示返回true，隐藏返回false
     * @param {*} o [HTMLElement | Id | Selector]
     */
    toggleVisible: function(o) {
        o = this.get(o);
        if (o.style.display == 'none') {
            this.show(o);
            return true;
        } else {
            this.hide(o);
            return false;
        }
    },

    /**
     * 交换两个DOM的显示状态，返回显示的那个dom
     * @param {*} dom1 [HTMLElement | Id | Selector] 初始状态为隐藏的dom
     * @param {*} dom2 [HTMLElement | Id | Selector] 
     */
    alterVisible: function(dom1, dom2) {
        dom1 = this.get(dom1);
        dom2 = this.get(dom2);
        if (this.getStyle(dom1, 'display') == 'none') { //1隐藏
            this.hide(dom2);
            return this.show(dom1);
        } else {
            this.hide(dom1);
            return this.show(dom2);
        }
    },

    /**
     * 两个DOM一个显示一个隐藏
     * @param {*} domShow [HTMLElement | Id | Selector] 要显示的dom
     * @param {*} domHide [HTMLElement | Id | Selector] 要隐藏的dom
     */
    switchVisible: function(domShow, domHide) {
        this.hide(domHide);
        this.show(domShow);
    },

    /**
     * 是否隐藏
     * @param {*} o [HTMLElement | Id | Selector]
     */
    isHidden: function(o) {
        return (this.getStyle(o, 'display') === 'none');
    },

    /**
     * 是否显示
     * @param {*} o [HTMLElement | Id | Selector]
     */
    isShow: function(o) {
        return !this.isHide(o);
    },

    /**
     * 聚焦DOM
     * @param {*} o [HTMLElement | Id | Selector]
     * @param {boolean} [bSelect] 是否选中
     */
    setFocus: function(o, bSelect) {
        o = this.get(o);
        if (!o) {
            return;
        }

        try {
            o.focus();
            if (bSelect) {
                o.select();
            }
        } catch (e) {}
        return o;
    },

    /**
     * 设置DOM位置和大小
     * V1.8.5 属性值除px外还支持其他单位
     * @param {*} o [HTMLElement | Id | Selector]
     * @param {*} [left] 
     * @param {*} [top] 
     * @param {*} [width] 
     * @param {*} [height] 
     */
    setPosition: function(o, left, top, width, height) {
        o = this.get(o);
        if (!isNone(left)) {
            if (fzNumber.isNumeric(left)) {
                o.style.left = left + 'px';
            } else {
                o.style.left = left;
            }
        }
        if (!isNone(top)) {
            if (fzNumber.isNumeric(top)) {
                o.style.top = top + 'px';
            } else {
                o.style.top = top;
            }
        }
        if (!isNone(width)) {
            if (fzNumber.isNumeric(width)) {
                o.style.width = width + 'px';
            } else {
                o.style.width = width;
            }
        }
        if (!isNone(height)) {
            if (fzNumber.isNumeric(height)) {
                o.style.height = height + 'px';
            } else {
                o.style.height = height;
            }
        }
    },

    /**
     * 获取DOM的位置和大小 
     * @param {*} o [HTMLElement | Id | Selector]
     */
    getPosition: function(o) {
        o = this.get(o);
        var nLeft = o.offsetLeft,
            nTop = o.offsetTop,
            nWidth = o.offsetWidth,
            nHeight = o.offsetHeight;

        return {
            left: nLeft,
            top: nTop,
            width: nWidth,
            height: nHeight
        };
    },

    /**
     * 获得元素的页面坐标位置，含滚动位置
     * @param {*} o [HTMLElement | Id | Selector]
     */
    getElementPos: function(o) {
        o = this.get(o);
        if (o.parentNode === null || o.style.display == 'none') {
            return false;
        }
        var w = o.getBoundingClientRect(),
            t = Math.max(document.documentElement.scrollTop, document.body.scrollTop),
            l = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);

        w.x = w.left + l;
        w.y = w.top + t;
        return w;
    },

    /**
     * 计算DOM在当前样式下设置指定文本所需占据的宽度
     * @param {*} o [HTMLElement | Id | Selector]
     * @param {string} text 要计算宽度的文本
     */
    getTextWidth: function(o, text) {
        var s = this.dom(null, 'span', text);
        s.style.fontSize = this.getStyle(o, 'fontSize');
        s.style.fontWeight = this.getStyle(o, 'fontWeight');
        s.style.fontFamily = this.getStyle(o, 'fontFamily');
        s.style.paddingLeft = this.getStyle(o, 'paddingLeft');
        s.style.paddingRight = this.getStyle(o, 'paddingRight');
        s.style.visibility = 'hidden';
        document.body.appendChild(s);
        var w = s.offsetWidth;
        s.remove();
        return w;
    },

    /**
     * 设置元素的宽高
     * @param {*} o [HTMLElement | Id | Selector]
     * @param {*} width 
     * @param {*} height 
     */
    setSize: function(o, width, height) {
        this.css(o, 'width', width);
        this.css(o, 'height', height);
    },

    /**
     * 设置元素宽度
     * @param {*} o [HTMLElement | Id | Selector]
     * @param {*} width 
     */
    setWidth: function(o, width) {
        this.css(o, 'width', width);
    },

    /**
     * 设置元素高度
     * @param {*} o [HTMLElement | Id | Selector]
     * @param {*} height 
     */
    setHeight: function(o, height) {
        this.css(o, 'height', height);
    },

    /**
     * 获得页面根document对象引用
     */
    getRootDocument: function() {
        var p = parent;
        while (p.document == null) {
            p = p.parent;
        }
        return p.document;
    },

    /**
     * 获得页面中的所有document
     * @param {*} [o] 可选从某个iframe开始查找 [HTMLElement | Id | Selector]
     */
    getAllDocuments: function(o) {
        var r = [];
        if (!o) {
            o = this.getRootDocument();
            r.push(o);
            o = o.body;
        }
        getIframes(o);
        return r;

        function getIframes(d) {
            try {
                var fs = d.getElementsByTagName('iframe');
                if (fs.length > 0) {
                    for (var i = 0, l = fs.length; i < l; i++) {
                        r.push(fs[i].contentDocument);
                        getIframes(r[r.length - 1]);
                    }
                }
            } catch (e) {}
        }
    },

    /**
     * 获取浏览器视窗宽度
     */
    windowWidth: function() {
        return this.getRootDocument().documentElement.clientWidth;
    },

    /**
     * 获取浏览器视窗高度
     */
    windowHeight: function() {
        return this.getRootDocument().documentElement.clientHeight;
    },

    /**
     * 获取浏览器视窗大小
     */
    windowSize: function() {
        var de = this.getRootDocument().documentElement;
        return {
            width: de.clientWidth,
            height: de.clientHeight
        };
    },

    /**
     * 设置DOM的css属性值
     * @param {*} o [HTMLElement | Id | Selector]
     * @param {*} propertyName 属性名
     * @param {*} propertyValue 属性值 像素不需要加px
     */
    css: function(o, propertyName, propertyValue) {
        if (propertyValue == null) {
            return;
        }
        if (o == null) {
            return;
        }
        if (typeof(o) === 'string') {
            o = this.get(o);
        } else if (o.ui) {
            o = o.ui;
        }
        if (!o.style) {
            return;
        }
        if (typeof(propertyName) !== 'string') {
            return;
        }

        parseValue();
        switch (propertyName) {
            case 'float':
                o.style.cssFloat = propertyValue;
                break;
            default:
                o.style[propertyName] = propertyValue;
        }

        //TODO 还是不能避免无效属性值
        function parseValue() {
            var p = propertyName.toLowerCase();
            if (propertyName === 'padding' || propertyName === 'margin') {
                if (isArray(propertyValue)) {
                    propertyValue = propertyValue.join('px ') + 'px';
                } else if (typeof(propertyValue) === 'string' && propertyValue.indexOf('px') == -1) {
                    var a = propertyValue.split(' ');
                    propertyValue = a.join('px ') + 'px';
                } else if (typeof propertyValue === 'number') {
                    propertyValue = propertyValue + 'px';
                }
            } else if (p.endsWith('width') || p.endsWith('height')) {
                if (!isNaN(propertyValue)) {
                    if (propertyValue < 0) {
                        return;
                    }
                    propertyValue = propertyValue + 'px';
                }
            } else if (p.toLowerCase() == 'fontsize' ||
                p.startsWith('padding') ||
                p.startsWith('margin') ||
                p === 'top' ||
                p === 'right' ||
                p == 'left' ||
                propertyName == 'bottom'
            ) {
                if (propertyValue != 0) {
                    propertyValue = propertyValue + 'px';
                }
            }
        }
    },

    /**
     * 
     * @param {*} o [HTMLElement | Id | Selector]
     * @param {*} propertyName 
     */
    getStyle: function(o, propertyName) {
        o = this.get(o);
        return window.getComputedStyle(o, null)[propertyName];
    },

    /**
     * 
     * @param {*} o [HTMLElement | Id | Selector]
     * @param {*} propertyName 
     */
    getStyleLong: function(o, propertyName) {
        return parseInt(this.getStyle(o, propertyName));
    },

    /********************************************************
     * 内部文本相关
     ********************************************************/

    /**
     * 将DOM的innerHTML置空
     * @param {*} o [HTMLElement | Id | Selector]
     */
    clear: function(o) {
        return this.html(o, '');
    },

    /**
     * 设置Dom的innerHTML
     * @param {*} o [HTMLElement | Id | Selector]
     * @param {*} htmlText innerHTML值
     */
    html: function(o, htmlText) {
        o = this.get(o);
        if (!o) {
            return console.error('fzDOM.html:无法找到' + o + '表示的HTMLElement');
        }
        o.innerHTML = htmlText;
        return o;
    },

    /**
     * 返回DOM的innerHTML。如果DOM不存在则返回空字符串
     * @param {*} o [HTMLElement | Id | Selector]
     */
    getHTML: function(o) {
        o = this.get(o);
        if (!o) {
            return '';
        }
        return o.innerHTML;
    },

    /**
     * 设置DOM的innerText
     * @param {*} o HTMLElement | Id | Selecto
     * @param {string} text innerText值
     */
    text: function(o, text) {
        o = this.get(o);
        if (!o) {
            return console.error('fzDOM.html:无法找到' + o + '表示的HTMLElement');
        }
        o.innerText = text;
        return o;
    },

    /**
     * 返回DOM的innerText。如果DOM不存在则返回空字符串
     * @param {*} o [HTMLElement | Id | Selector]
     */
    getText: function(o) {
        o = this.get(o);
        if (!o) {
            return ''
        }
        return o.innerText;
    },

    /**
     * 返回DOM的innerText或value的整数。如果DOM不存在或innerText不是数字则返回0
     * @param {*} o [HTMLElement | Id | Selector]
     */
    getLong: function(o) {
        o = this.get(o);
        if (!o) {
            return 0;
        }
        return parseInt(o.tagName === 'INPUT' ? o.value : o.innerText) || 0;
    },

    /**
     * 向o表示的HTMLElement追加一个DOM或一段HTML
     * @param {*} o [HTMLElement | Id | Selector]
     * @param {*} htmlOrDom 
     */
    append: function(o, htmlOrDom) {
        o = this.get(o);
        if (!o) {
            return console.error('fzDOM.append:无法找到', o, '表示的HTMLElement');
        }
        if (typeof htmlOrDom == 'string') {
            o.innerHTML = o.innerHTML + htmlOrDom;
        } else if (this.isDOM(htmlOrDom)) {
            o.appendChild(htmlOrDom);
        } else {
            return console.error('fzDOM.append:' + htmlOrDom + '不是字符串或HTMLElement');
        }
        return o;
    },

    /********************************************************
     * class相关
     ********************************************************/

    /**
     * 添加css
     * @param {array} cssCode 要添加的CSS代码字符串数组
     * @param {HTMLElement} [beforeNode] 要插入到哪个DOM之前，忽略则添加到Head中，或插入到afterNode之后，指定该参数则忽略afterNode
     * @param {HTMLElement} [afterNode] 要插入到哪个DOM之后，忽略则添加到Head中，或插入到beforeNode之前
     */
    addCSS: function(cssCode, beforeNode, afterNode, id) {
        var st = document.createElement('style');
        st.type = 'text/css';
        st.rel = 'stylesheet';
        if (id) {
            if (fzDOM.get(id)) {
                return;
            }
            fzDOM.setAttr(st, 'id', id);
        }
        st.setAttribute('from', 'fzcore');
        st.innerHTML = cssCode.join('\n');
        if (this.isDOM(beforeNode)) {
            this.insertBefore(st, beforeNode);
            return;
        } else {
            if (this.isDOM(afterNode)) {
                this.insertAfter(st, afterNode);
                return;
            }
        }

        document.head.appendChild(st);
    },

    /**
     * 测试DOM是否包含指定的类名
     * @param {*} o [HTMLElement | Id | Selector]
     * @param {string} className
     * @returns {boolean} 仅当o包含className且className非空时返回true
     * @throws o不是DOM
     */
    hasClass: function(o, className) {
        o = this.get(o);
        if (!o) {
            return console.error('hasClass Error:' + o + '不是DOM');
        }
        if (!className || o.className == '') {
            return false;
        }
        var s = o.className;
        var p = s.split(' ');
        return fzArray.inArray(className, p);
    },

    /**
     * 设置DOM的类名
     * @param {*} o [HTMLElement | Id | Selector]
     * @param {string} className 要设置的类名
     */
    setClass: function(o, className) {
        o = this.get(o);
        if (o) {
            o.className = className;
        }
    },

    /**
     * 向DOM追加类名
     * @param {*} o [HTMLElement | Id | Selector]
     * @param {string} className 要追加的类名，不能为空
     * @returns o
     * @throws o不是DOM
     */
    appendClass: function(o, className) {
        o = this.get(o);
        if (!o) {
            return console.error('appendClass Error:' + o + '不是DOM');
        }

        if (!className) {
            return o;
        }
        if (!o.className) {
            o.className = className;
            return o;
        }
        if (this.hasClass(o, className)) {
            return o;
        }
        var s = o.className + ' ' + className;
        o.className = s;
        return o;
    },

    /**
     * 删除DOM的一个类名
     * @param {*} o [HTMLElement | Id | Selector]
     * @param {string} className 要删除的类名，不能为空
     * @returns o
     * @throws o不是DOM
     */
    removeClass: function(o, className) {
        o = this.get(o);
        if (!o) {
            return console.error('removeClass Error:' + o + '不是DOM');
        }
        if (!className) {
            return o;
        }
        if (!o.className) {
            return o;
        }
        var arrClass = o.className.split(' ');
        var arrClassReplaced = fzArray.removeFound(arrClass, className);
        if (arrClass.length > arrClassReplaced.length) {
            o.className = arrClassReplaced.join(' ');
        }
        return o;
    },

    /**
     * 删除o的子节点的指定类名
     * @param {*} o [HTMLElement | Id | Selector]
     * @param {string} sSelector 选择器
     * @param {string} sClass 类名 如果设为空字符串则清除class属性
     */
    removeAllClassOf: function(o, sSelector, sClass) {
        var es = this.queryAll(sSelector, o);
        var i = 0,
            l = es.length;
        if (sClass === '') {
            for (; i < l; i++) {
                es[i].className = '';
            }
        } else {
            for (; i < l; i++) {
                this.removeClass(es[i], sClass);
            }
        }
    },

    /**
     * 切换DOM的单个类名
     * @param {*} o [HTMLElement | Id | Selector]
     * @param {string} className 要切换的类名
     */
    toggleClass: function(o, className) {
        o = this.get(o);
        if (!o) {
            return console.error('toggleClass Error:' + o + '不是DOM');
        }
        if (!this.hasClass(o, className)) {
            return this.appendClass(o, className);
        } else {
            var p = o.className.split(' ');
            var c = p.indexOf(className);
            p[c] = '';
            o.className = p.join(' ').trim();
            return o;
        }
    },

    /**
     * 替换DOM的单个类名 当要替换的类名不存在时，追加
     * @param {*} o [HTMLElement | Id | Selector]
     * @param {string} classNameFind 要替换的类名
     * @param {string} replaceAs 替换为
     * @param {boolean} [appendIfNotFound] 设为true时 如果要替换的类名不存在 则追加replaceAs； 否则什么都不做
     */
    replaceClass: function(o, classNameFind, replaceAs, appendIfNotFound) {
        o = this.get(o);
        if (!o) {
            return console.error('replaceClass Error:' + o + '不是DOM');
        }
        if (this.hasClass(o, classNameFind)) {
            var arrClass = o.className.split(' ');
            for (var i = 0, l = arrClass.length; i < l; i++) {
                var sClass = arrClass[i];
                if (sClass === classNameFind) {
                    arrClass[i] = replaceAs;
                }
            }
            o.className = arrClass.join(' ');
        } else {
            if (appendIfNotFound) {
                this.appendClass(o, replaceAs);
            }
        }
        return o;
    },

    /********************************************************
     * 元素相关
     ********************************************************/

    /**
     * 将arguments中的每个DOM追加到o
     * @param {HTMLElement} o 源DOM
     * @args 不支持textNode
     * @returns {HTMLElement} o
     * @throws o不是DOM
     */
    addUI: function(o) {
        o = this.get(o);
        if (!this.isDOM(o)) {
            return console.error('addUI Error:' + o + '不是DOM');
        }
        var l = arguments.length;
        if (l < 2) {
            return;
        }
        for (var i = 1; i < l; i++) {
            if (this.isDOM(arguments[i])) {
                o.appendChild(arguments[i]);
            }
        }
        return o;
    },

    /**
     * 将oChild表示的DOM添加到oParent表示的DOM
     * @param {*} oParent [HTMLElement | Id | Selector]
     * @param {*} oChild [HTMLElement | Id | Selector | HTMLElementArray]
     * @returns domParent
     */
    addTo: function(oParent, oChild) {
        oParent = this.get(oParent);
        if (!oParent) {
            return console.error('addTo Error:' + oParent + '不是DOM');
        }

        if (isArray(oChild)) {
            for (var i = 0, l = oChild.length; i < l; i++) {
                oParent.appendChild(oChild[i]);
            }
        } else {
            var domChild = this.get(oChild);
            if (!domChild) {
                return console.error('addTo Error:' + oChild + '不是DOM');
            }
            oParent.appendChild(domChild);
        }
        return oParent;
    },

    /**
     * 清空o的innerHTML，将arguments中的每个DOM追加到o，忽略参数中不是DOM的元素
     * @param {HTMLElement} o 源DOM [HTMLElement | Id | Selector]
     * @throws o不是DOM
     * @returns o
     */
    resetChild: function(o) {
        o = this.get(o);
        if (!this.isDOM(o)) {
            return console.error('resetChild:无法找到' + o + '代表的DOM');
        }
        var l = arguments.length;
        o.innerHTML = '';
        if (l < 2) {
            return;
        }
        for (var i = 1; i < l; i++) {
            if (fzDOM.isDOM(arguments[i]) || (arguments[i] instanceof Text)) {
                o.appendChild(arguments[i]);
            }
        }
        return o;
    },

    /**
     * 将newDom插入到refDom之前，返回父节点
     * @param {HTMLElement} newDom 要插入的节点
     * @param {*} oRef 新节点插入到该节点前面 [HTMLElement | Id | Selector]
     */
    insertBefore: function(newDom, oRef) {
        var refDom = this.get(oRef);
        if (!newDom) {
            return console.error('insertBefore Error:要插入的元素【' + newDom + '】不是HTMLElement');
        }
        if (!refDom) {
            return console.error('insertBefore Error:引用的元素【' + oRef + '】不是HTMLElement');
        }
        var p = refDom.parentNode;
        p.insertBefore(newDom, refDom);

        return p;
    },

    /**
     * 将newDom插入到refDom之后，返回父节点
     * @param {HTMLElement} newDom 要插入的节点
     * @param {*} oRef 新节点插入到该节点后面
     * @returns {HTMLElement} 父节点
     * @throws newDom或oRef不是HTMLElement
     */
    insertAfter: function(newDom, oRef) {
        var refDom = this.get(oRef);
        if (!newDom || !refDom) {
            return console.error('insertAfter Error:' + newDom + '或' + oRef + '不是HTMLElement');
        }
        var p = refDom.parentNode;
        var n = refDom.nextSibling;
        if (n) {
            p.insertBefore(newDom, n);
        } else {
            p.appendChild(newDom);
        }

        return p;
    },

    /**
     * 将节点插入为父节点的第一个子节点
     * @param {*} parent 父节点 [HTMLElement | Id | Selector]
     * @param {*} child  要插入的节点 [HTMLElement | Id | Selector]
     */
    addFirstChild: function(parent, newChild) {
        var parentDom = this.get(parent);
        if (!parentDom) {
            return console.error('fzDOM.insertFirstChild:无法找到' + parent + '表示的HTMLElement');
        }
        var childDom = this.get(newChild);
        if (!childDom) {
            return console.error('fzDOM.insertFirstChild:无法找到' + newChild + '表示的HTMLElement');
        }
        var relDom = parentDom.firstChild;
        if (!relDom) {
            parentDom.appendChild(newChild);
        } else {
            parentDom.insertBefore(newChild, relDom);
        }
    },

    /**
     * 创建一个DOM
     * @param {string} [tagName="div"] 默认div
     * @param {string} [innerHTML]
     * @param {string} [id]
     * @param {string} [className=]
     * @param {*} [attributes] 属性，支持 {key:value,key2:value2} 和 "key=value;key2=value2" 两种形式
     * @returns HTMLElement
     */
    createDom: function(tagName, innerHTML, id, className, attributes) {
        var o = document.createElement(tagName ? tagName : 'div');
        if (innerHTML || innerHTML == 0) {
            o.innerHTML = innerHTML;
        }
        if (id) {
            o.id = id;
        }
        if (className) {
            o.className = className;
        }
        if (typeof attributes == 'string') {
            var p = attributes.split(';');
            for (var i = 0, l = p.length; i < l; i++) {
                var kv = p[i].split('=');
                if (kv.length == 2) {
                    o.setAttribute(kv[0], kv[1]);
                }
            }
        } else if (isObject(attributes)) {
            for (var k in attributes) {
                o.setAttribute(k, attributes[k]);
            }
        }
        return o;
    },

    /**
     * 简单创建一个指定内容的标记
     * @param {string} tagName 节点标记名
     * @param {string} innerHTML 内容
     */
    make: function(tagName, innerHTML) {
        return this.createDom(tagName, innerHTML);
    },

    /**
     * 创建dom
     * @param {string} [className] 类名
     * @param {string} [tagName] 标记名
     * @param {string} [innerHTML] 内联html
     * @param {string} [id] Id
     * @param {*} [attributes] {attr:value} | "attr=value"
     */
    dom: function(className, tagName, innerHTML, id, attributes) {
        return this.createDom(tagName, innerHTML, id, className, attributes);
    },

    /**
     * 封装document.createTextNode
     * @param {string} text
     * @returns {Text} Text对象
     */
    createText: function(text) {
        return document.createTextNode(text);
    },

    /**
     * 删除一个DOM
     * @param {*} o [HTMLElement | Id | Selector]
     */
    remove: function(o) {
        o = this.get(o);
        if (o && o.parentNode) {
            o.parentNode.removeChild(o);
        }
    },

    /**
     * 用arguments里的DOM替换from
     * @param {*} from 要替换掉的DOM [HTMLElement | Id | Selector]
     */
    replace: function(from) {
        from = this.get(from);

        var parent = from.parentNode;
        var next = from.nextSibling;
        var i, l;
        parent.removeChild(from);
        if (next) {
            for (i = 1, l = arguments.length; i < l; i++) {
                parent.appendChild(arguments[i]);
            }
        } else {
            for (i = 1, l = arguments.length; i < l; i++) {
                parent.insertBefore(arguments[i], next);
            }
        }
    },

    /**
     * 创建option
     * @param {string} text
     * @param {string} value 
     * @param {boolean} selected 
     */
    createOption: function(text, value, selected) {
        var o = document.createElement('option');
        o.innerText = text;
        if (value) {
            o.value = value;
        } else {
            o.value = '';
        }
        if (selected) {
            o.setAttribute('selected', 'selected');
        }
        return o;
    },

    /**
     * 创建一个由<a>模拟的按钮
     * @param {string} [text] 文本内容
     * @param {string} [id]
     * @param {string} [className]
     * @param {function} [clickAction] click事件调用的方法
     * @param {*} [attributes] 属性，支持 {key:value,key2:value2} 和 "key=value;key2=value2" 两种形式
     * @param {*} [href] 设为字符串则使用该值，设为null则不加href属性，忽略则为javascript:;
     * @returns HTMLElement
     */
    createLinkbutton: function(text, id, className, clickAction, attributes, href) {
        var o = this.createDom('a', text, id, className, attributes);
        if (typeof clickAction == 'function') {
            o.onclick = clickAction;
        }
        if (typeof href === 'undefined') {
            o.href = 'javascript:;';
        } else if (typeof href === 'string') {
            o.href = href;
        }
        return o;
    },

    /**
     * 创建一个button
     * @param {string} [sClass] 类名
     * @param {string} [sTitle] title属性值
     * @param {function} [fnc] 点击事件
     * @param {string} [sText] 文本
     * V1.8.3增加
     * @param {*} [attributes] 属性
     */
    createButton: function(sClass, sTitle, fnc, sText, attributes) {
        var o = document.createElement('button');
        if (sTitle != null) {
            o.title = sTitle;
        }
        if (fnc) {
            o.onclick = fnc;
        }
        if (sClass) {
            o.className = sClass;
        }
        if (sText) {
            o.innerHTML = sText;
        }
        if (typeof attributes == 'string') {
            var p = attributes.split(';');
            for (var i = 0, l = p.length; i < l; i++) {
                var kv = p[i].split('=');
                if (kv.length == 2) {
                    o.setAttribute(kv[0], kv[1]);
                }
            }
        } else if (isObject(attributes)) {
            for (var k in attributes) {
                o.setAttribute(k, attributes[k]);
            }
        }
        return o;
    },
    createToggleButton: function(_config) {

    },

    /**
     * 创建一个input元素
     * @param {string} type 类型 [text | password | button | checkbox | radio | email | range | url | number | date | month | week | time | datetime-local | search | color]
     * @param {string} [id] 
     * @param {string} [className] 
     * @param {*} [attributes] [string attr1=value1;attr2=value2 | object{attr1:value1,attr2:value2}]
     * @param {string} [defaultValue] 默认值
     */
    createInput: function(type, id, className, attributes, inputWidth, defaultValue) {
        if (!attributes) {
            attributes = {}
        };
        if (typeof attributes === 'string') {
            attributes += ';type=' + type;
        } else if (isObject(attributes)) {
            attributes.type = type || 'text';
        }
        var o = this.createDom('input', null, id, className, attributes);
        if (inputWidth) {
            fzDOM.setWidth(o, inputWidth);
        }
        defaultValue && fzDOM.setValue(o, defaultValue);
        return o;
    },

    /**
     * 创建一个input[hidden]元素
     * V1.8.6
     * @param {string} name
     * @param {string} value
     */
    createHiddenInput: function(name, value) {
        var o = this.createDom('input', null, null, null, {
            type: 'hidden',
            name: name,
            value: value
        });
        return o;
    },

    /**
     * 创建带label的input，返回一个对象{input:domInput,label:domLabel}
     * @param {string} inputType input类型
     * @param {string} labelText label文本
     * @param {string} inputId 
     * @param {string} [inputClassName]
     * @param {string} [inputAttributes] 
     * @param {string} [defaultValue]
     */
    createLabelInput: function(inputType, labelText, inputId, inputClassName, inputAttributes, inputWidth, defaultValue) {
        var label = this.dom(null, 'label', labelText, null, 'for=' + inputId),
            input = this.createInput(inputType, inputId, inputClassName, inputAttributes, inputWidth, defaultValue);

        if (fzArray.inArray(inputType, ['checkbox', 'radio'])) {
            return {
                input: input,
                label: label
            }
        } else {
            return {
                label: label,
                input: input
            }
        }
    },

    /**
     * 创建一个包含了label和input的div
     * @param {string} inputType input类型
     * @param {string} labelText label文本
     * @param {string} inputId 
     * @param {string} [divClassName]
     * @param {string} [inputAttributes] 
     */
    createLabelInputDiv: function(inputType, labelText, inputId, divClassName, inputAttributes, inputWidth) {
        var label = this.dom(null, 'label', labelText, null, 'for=' + inputId),
            input = this.createInput(inputType, inputId, null, inputAttributes, inputWidth),
            div = this.dom(divClassName);

        if (fzArray.inArray(inputType, ['checkbox', 'radio'])) {
            return this.addUI(div, input, label);
        } else {
            return this.addUI(div, label, input);
        }
    },

    /**
     * V1.8.5
     * 创建一个包含checkbox的label
     * @param {string} labelText 标签文本
     * @param {string} checkboxId checkbox的ID
     * @param {string} checkboxName checkbox的name
     * @param {string} labelClassName label的className
     * @param {boolean} checked 是否勾选
     * @param {function} fnClick checkbox的点击事件
     */
    createCheckLabel: function(labelText, checkboxId, checkboxName, labelClassName, checked, fnClick) {
        var label = this.dom(labelClassName, 'label'),
            input = this.createInput('checkbox', checkboxId);
        if (checked) {
            this.addAttr(input, 'checked');
        }
        if (checkboxName) {
            this.setAttr(input, 'name', checkboxName);
        }
        if (fnClick) {
            input.onclick = fnClick;
        }
        label.appendChild(input);
        label.appendChild(this.createText(labelText));
        return label;
    },

    /**
     * V1.8.8
     * 2021/03/22 12:53:00
     * 创建单选按钮列表
     * V1.9.0
     * 增加divClassName参数
     * @param {array} options 选项  [string | object{text,value,cls,icon,selected} | stringValueText 'value:text']
     * @param {string} name radio的name属性值
     * @param {number} [defaultIndex] 默认勾选的项目索引 [0]
     * @param {string} [divClassName] 外层div的class
     * @param {string} [listTitle] 列表的标题文本
     */
    createRadioList: function(options, name, defaultIndex, divClassName, listTitle) {
        defaultIndex = defaultIndex || 0;
        var wrap = this.createDom('div', null, null, divClassName);

        if (listTitle) {
            wrap.appendChild(this.createDom('label', listTitle));
        }

        for (var i = 0, l = options.length; i < l; i++) {
            var item = options[i];
            var lbl = document.createElement('label');
            var rad = document.createElement('input');
            rad.type = 'radio';
            rad.name = name;
            if (i == defaultIndex) {
                rad.setAttribute('checked', 'checked');
            }

            if (typeof item == 'string') {
                var a = item.split(':');
                if (a.length == 2) {
                    item = {
                        text: a[1],
                        value: a[0]
                    }
                } else {
                    item = {
                        text: item,
                        value: item
                    }
                };
            }
            var txt = document.createTextNode(item.text);
            rad.value = item.value;
            lbl.appendChild(rad);
            lbl.appendChild(txt);
            wrap.appendChild(lbl);
        }
        return wrap;
    },

    /**
     * 2019/5/21 22:04
     * 将对象数组填充为select的option
     * @param {HTMLSelectElement} domSelect 要填充的select标签
     * @param {array|object} objectArray 包含options所需value和text的对象数组
     * @param {string} textKey option的文本的键
     * @param {string} valueKey option的value的键
     * @param {boolean} clearItems 是否清空select中原有的options
     * @param {object} selectBy 默认选中的option的条件(按优先级index,value,text任选一个,index必须是数字，value和text必须是字符串)
     */
    addOptionsByObjectArray: function(domSelect, objectArray, textKey, valueKey, clearItems, selectBy) {
        if (domSelect instanceof HTMLSelectElement == false) {
            return console.error('addOptionsByObjectArray:' + domSelect + '不是select标签')
        }
        if (objectArray instanceof Array == false) {
            return console.error('addOptionsByObjectArray' + objectArray + '不是有效的对象数组')
        }
        if (clearItems === true) {
            domSelect.innerHTML = '';
        }

        var l = objectArray.length;
        var i = 0;
        var self = this;

        function createOptions() {
            for (; i < l; i++) {
                domSelect.appendChild(self.createOption(objectArray[i][textKey], objectArray[i][valueKey]));
            }
        }

        if (l) {
            if (selectBy) {
                if (typeof selectBy.index == 'number') {
                    createOptions();
                    domSelect.selectedIndex = selectBy.index;
                } else if (typeof selectBy.value == 'string') {
                    for (; i < l; i++) {
                        domSelect.appendChild(this.createOption(objectArray[i][textKey], objectArray[i][valueKey], (objectArray[i][valueKey] === selectBy.value)));
                    }
                } else if (typeof selectBy.text == 'string') {
                    for (; i < l; i++) {
                        domSelect.appendChild(this.createOption(objectArray[i][textKey], objectArray[i][valueKey], (objectArray[i][textKey] === selectBy.text)));
                    }
                } else {
                    createOptions();
                }
            } else {
                createOptions();
            }
        }
    },

    /**
     * 返回Select当前选项中的文本
     * @param {*} oSelect [HTMLSelect | Id | Selector]
     */
    getSelectedOptionText: function(oSelect) {
        oSelect = this.get(oSelect);
        if (!oSelect) {
            return null;
        }
        if (oSelect.selectedOptions && oSelect.selectedOptions.length) {
            return oSelect.selectedOptions[0].innerText;
        }
        return null;
    },

    /**
     * 让textarea支持输入tab键
     * //TODO
     * //但是不支持列模式，无使用价值
     * //仅允许输入tab即可，如果有选择文本，按下tab键替换选择文本
     * @param {*} oTextarea [Textarea | Id | Selector]
     */
    setTextareaTabbable: function(oTextarea) {
        oTextarea.onkeydown = function(e) {
            if (e.keyCode == 9) {
                e.preventDefault();
                var indent = '\t';
                var start = this.selectionStart;
                var end = this.selectionEnd;
                var selected = window.getSelection().toString();
                selected = indent + selected.replace(/\n/g, '\n\t');
                this.value = this.value.substring(0, start) + selected + this.value.substring(end);
                this.setSelectionRange(start + 1, start + selected.length);
            }
        };
    },

    /**
     * 为一些dom添加一些事件监听
     * @param {*} nodes 节点的选择器或者nodelist或者dom数组
     * @param {object} events 事件描述 { eventType: function(e){} }
     */
    addEvent: function(nodes, events) {
        if (typeof nodes == 'string') {
            walkadd(this.queryAll(nodes))
        } else if (isArray(nodes) && this.isDOM(nodes[0])) {
            walkadd(nodes);
        } else if (nodes instanceof NodeList) {
            walkadd(nodes);
        } else if (this.isDOM(nodes)) {
            for (var action in events) {
                nodes.addEventListener(action, events[action]);
            }
        } else {
            console.error('fzDOM.addEvent:参数错误,nodes必须是[选择器|dom|dom数组]', nodes);
        }

        function walkadd(nodeList) {
            for (var action in events) {
                fzArray.walk(nodeList, function(x) {
                    x.addEventListener(action, events[action]);
                });
            }
        }
    },

    /**
     * V1.8.4
     * 添加样式表文件
     * @param {string} cssNames 样式表文件名（含路径，不含.css）
     * @param {*} allowCache 是否允许缓存
     */
    addCSSFile: function(cssfilename, allowCache) {
        var me = this;
        add(cssfilename);

        function getScriptSrc(cssName) {
            if (cssName.match(/http|https:\/\//)) {
                return cssName;
            }
            var url;
            if (me.isIFrame()) {
                url = (window.parent.document.location.protocol == 'https:') ? JS_URL_HTTPS : JS_URL;
            } else {
                url = (document.location.protocol == 'https:') ? JS_URL_HTTPS : JS_URL;
            }
            if (!cssName.startsWith('/')) {
                url = url + '/';
            }
            url = url + cssName;
            if (!cssName.endsWith('.css')) {
                url = url + '.css';
            }
            if (!allowCache) {
                url = url + '?_=' + Date.now();
            }
            return url;
        }

        function add(cssfilename) {
            var style = document.createElement('link');
            style.type = 'text/css';
            style.rel = 'stylesheet';
            var u = getScriptSrc(cssfilename);
            style.href = u;
            try {
                document.head.appendChild(style);
                console.log('style loaded', u);
            } catch (e) {
                console.log(e);
            }
        }
    },

    /**
     * 顺序添加脚本
     * @param {array} scriptNames 脚本名称，包含目录，不含扩展名
     * @param {function} callback 全部加载完成后的回调
     * @param {boolean} allowCache 是否允许缓存
     */
    addScripts: function(scriptNames, callback, allowCache) {
        var me = this;
        var len,
            i = 0;
        if (typeof(scriptNames) === 'string') {
            len = 1;
            add(scriptNames);
        } else {
            len = scriptNames.length;
            add(scriptNames[i]);
        }

        function getScriptSrc(scriptName) {
            if (scriptName.match(/http|https:\/\//)) {
                return scriptName;
            }
            var url;
            if (me.isIFrame()) {
                url = (window.parent.document.location.protocol == 'https:') ? JS_URL_HTTPS : JS_URL;
            } else {
                url = (document.location.protocol == 'https:') ? JS_URL_HTTPS : JS_URL;
            }
            if (!scriptName.startsWith('/')) {
                url = url + '/';
            }
            url = url + scriptName;
            if (!scriptName.endsWith('.js')) {
                url = url + '.js';
            }
            if (!allowCache) {
                url = url + '?_=' + Date.now();
            }
            return url;
        }

        function add(scriptName) {
            var script = document.createElement('script');
            script.charset = 'utf-8';
            var u = getScriptSrc(scriptName);
            script.onload = function() {
                console.log('script loaded', u);
                i++;
                if (i < len) {
                    add(scriptNames[i]);
                } else {
                    fzFnc.call(callback);
                }
            };
            script.src = u;
            try {
                document.body.appendChild(script);
            } catch (e) {
                console.log(e);
            }
        }
    },

    /**
     * V1.9.0
     * 2021/06/28 10:06:59
     * 获取一组radio中被选定的那个的值
     * @param {string} name radio的name
     * @param {*} parentDom 所有radio的父元素
     */
    getCheckedRadioValue: function(name, parentDom) {
        var oParent = fzDOM.get(parentDom) || document;
        var rad = oParent.querySelector('[name=' + name + ']:checked');
        return rad.value;
    }
};

var fzFnc = {
    /**
     * 判断一个对象不是Function
     * @param {*} fnc 待判定的对象
     */
    not: function(fnc) {
        return typeof fnc != 'function';
    },

    /**
     * 判断一个对象是Function
     * @param {*} fnc 待判定对象
     */
    isFunction: function(fnc) {
        return typeof fnc == 'function';
    },

    /**
     * 当参数为Function时，调用它，只支持传一个参数。将arguments的元素逐个作为fnc的参数传递，只有一个参数时也是数组
     * @param {*} fnc 目标Function或其他
     */
    call: function(fnc, args1, args2, args3, args4, args5, args6) {
        this.isFunction(fnc) && fnc.call(this, args1, args2, args3, args4, args5, args6);
    },

    /**
     * 在jQuery绑定的Click事件之前调用自定义的方法，将原来绑定的方法作为fnc的回调执行
     * @param {string|HTMLElement} o 要hook的DOM [Selector | HTMLElement]
     * @param {number} clickEventIndex 要hook的jQuery绑定click事件序号，默认第0个
     * @param {function} fnc(oldEvent) click事件之前调用的方法，参数oldEvent为jQuery绑定的click事件方法
     */
    hookJQueryClick: function(o, selector, fnc) {
        console.log('hookJQueryClick', o, selector, fnc);

        if (!window.jQuery || !window.$) {
            return console.error('fzFnc.hookJQueryClick:jQuery not exists');
        }
        if (this.not(fnc)) {
            return console.error('fzFnc.hookJQueryClick:必须指定fnc参数');
        }

        o = $(o);
        console.log(o, o.get(0));
        var clicks = $._data(o.get(0), 'events')['click'];
        console.log('clicks', clicks);

        o.off('click', selector);
        o.on('click', selector, fnc);
    },

    /**
     * 遍历list，执行函数后返回一个数组
     * @param {Iterable} list 要遍历的数组
     * @param {function} fnc 传入参数(item,index|key)
     * @param {*} [skipNullValue] 是否跳过空值，默认true
     */
    travelToArray: function(list, fnc, skipNullValue) {
        var ret = [];
        skipNullValue = skipNullValue === false ? false : true;

        if (isArray(list) || list instanceof NodeList) {
            var i = 0,
                l = list.length;
            if (skipNullValue) {
                for (; i < l; i++) {
                    var r = fnc(list[i]);
                    if (!isNone(r)) {
                        ret.push(r);
                    }
                }
            } else {
                for (; i < l; i++) {
                    ret.push(fnc(list[i]));
                }
            }
        } else if (isObject(list)) {
            var key;
            if (skipNullValue) {
                for (key in list) {
                    var x = fnc(list[key], key);
                    if (!isNone(x)) {
                        ret.push(x);
                    }
                }
            } else {
                for (key in list) {
                    ret.push(fnc(list[key], key));
                }
            }
        }
        return ret;
    },

    /**
     * 遍历list
     * @param {Iterable} list 
     * @param {function} fnc (item,index|key)
     */
    travelList: function(list, fnc) {
        if (isArray(list) || list instanceof NodeList) {
            for (var i = 0, l = list.length; i < l; i++) {
                fnc(list[i], i);
            }
        } else if (isObject(list)) {
            for (var key in list) {
                fnc(list[key], key);
            }
        }
    }
};

var fzValidator = {
    /**
     * 是否包含全角字符
     * @param {string} str
     */
    notDBC: function(str) {
        for (var i = 0; i < str.length; i++) {
            var code = str.charCodeAt(i);
            if (code >= 65281 && code <= 65373) {
                return false;
            } else if (code == 12288) {
                return false;
            }
        }
        return true;
    },

    /**
     * 是否为空
     * @param {string} str
     */
    notEmpty: function(str) {
        var value = str.trim();
        if (value == '' || value == 'undefind') {
            return false;
        }
        return true;
    },

    /**
     * 是否包含空格
     * @param {string} str
     */
    notSpace: function(str) {
        var accept = /\s/;
        return accept.test(str);
    },

    /**
     * 是否包含特殊字符 [' " ? & $ ~ ^ %]
     * @param {string} str
     */
    specialChar: function(str) {
        var accept = /[`~\^\'\"\%\<\>\?\$]+/g;
        return accept.test(str);
    },

    /**
     * 是否由字母、数字、下划线组成
     * @param {string} str
     */
    letterNumberUnderline: function(str) {
        var accept = /^[\w]+$/;
        return accept.test(str);
    },

    /**
     * 只能包含数字
     * @param {string} str
     */
    numberOnly: function(str) {
        var accept = /^\d+$/;
        return accept.test(str);
    },

    /**
     * 
     * @param {string} str
     */
    isCarNumber: function(str) {
        var accept = /^[京津冀晋蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新][A-HJ-Z]-*?([0-9A-HJ-NP-Z]{5})$/i;
        return accept.test(str);
    },

    /**
     * IP地址
     * @param {string} str
     */
    isIP: function(str) {
        //var accept = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
        //return accept.test(str);

        //2021-05-12更新
        //return /^((0|2[0-4]\d?|25[0-5]?|1\d{0,2}|[3-9]\d?)\.){3}(0|2[0-4]\d?|25[0-5]?|1\d{0,2}|[3-9]\d?)$/.test(str);
        //return /^(([02]|2[0-4]\d?|25[0-5]?|1\d{0,2}|[3-9]\d?)\.){3}([02]|2[0-4]\d?|25[0-5]?|1\d{0,2}|[3-9]\d?)$/.test(str);
        return /^((0|2[0-4]\d?|25[0-5]?|2\d?|1\d{0,2}|[3-9]\d?)\.){3}(0|2[0-4]\d?|25[0-5]?|2\d?|1\d{0,2}|[3-9]\d?)$/.test(str);
    },

    /**
     * MAC地址
     * @param {string} str
     */
    isMAC: function(str) {
        var accept = /^([0-9a-fA-F]){2}(([\s-\s:][0-9a-fA-F]{2}){5})$/;
        return accept.test(str);
    },

    /**
     * IMSI
     * @param {string} str
     */
    isIMSI: function(str) {
        var accept = /^4600[0,1,2,3,5,6,7]\d{10}$/g;
        return accept.test(str);
    },

    /**
     * IMEI
     * @param {string} str
     */
    isIMEI: function(str) {
        var accept = /^(\d{15}|\d{17})$/;
        return accept.test(str);
    },

    /**
     * 身份证
     * @param {string} str
     */
    isIdCard: function(str) {
        return this.checkIDCard(str);
    },

    /**
     * 手机号码
     * @param {string} str
     */
    isPhoneNumber: function(str) {
        var accept = /^(13[0-9]|15[0-9]|18[0-9]|14[567]|17[0-9]|16[0-9]|19[0-9])\d{8}$/;
        return accept.test(str);
    },

    /**
     * email
     * @param {string} str
     */
    isEmail: function(str) {
        var accept = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        return accept.test(str);
    },

    /**
     * QQ号
     * @param {string} str
     */
    isQQ: function(str) {
        var accept = /^[1-9]\d{4,11}$/;
        return accept.test(str);
    },

    /**
     * 微信账号
     * @param {string} str
     */
    isWXAccountname: function(str) {
        var accept = /^[a-zA-Z]([-_a-zA-Z0-9]{5,})+$/; // 微信账号格式，5个及以上字母、数字、下划线和减号
        return accept.test(str);
    },

    /**
     * 数字 [正负、浮点数]
     * @param {string} str 
     */
    isNumber: function(str) {
        var accept = /^([+-]?)\d*\.?\d+$/;
        return accept.test(str);
    },

    /**
     * 身份证号
     * @param {string} idcard 
     */
    checkIDCard: function(idcard) {
        idcard = idcard.toUpperCase();
        var areas = {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外"
        };

        // 检测出生日期合法性的方法
        var isValidDate = function(_date) {
            var dateReg = /^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/;
            if (dateReg.test(_date)) {
                return true;
            } else {
                return false;
            }
        };

        if (!(/(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/).test(idcard)) {
            return false;
        }

        // 地区检验
        if (areas[idcard.substr(0, 2)] == null || areas[idcard.substring(0, 2)] == "") {
            return false;
        }

        if (idcard.length == 18) {
            if (!isValidDate(idcard.substr(6, 4) + "-" + idcard.substr(10, 2) + "-" + idcard.substr(12, 2))) {
                return false;
            }
            // 检验校验码合法性
            var arr = idcard.split("");
            var S = (parseInt(arr[0]) + parseInt(arr[10])) * 7 +
                (parseInt(arr[1]) + parseInt(arr[11])) * 9 + (parseInt(arr[2]) + parseInt(arr[12])) * 10 +
                (parseInt(arr[3]) + parseInt(arr[13])) * 5 + (parseInt(arr[4]) + parseInt(arr[14])) * 8 +
                (parseInt(arr[5]) + parseInt(arr[15])) * 4 + (parseInt(arr[6]) + parseInt(arr[16])) * 2 +
                parseInt(arr[7]) + parseInt(arr[8]) * 6 + parseInt(arr[9]) * 3;

            var Y = S % 11;
            // 校验码
            var JYM = "10X98765432";
            // 计算出的校验位
            if (JYM.substr(Y, 1) != arr[17]) {
                return false;
            }
            return true;
        } else if (idcard.length == 15) {
            if (!isValidDate(parseInt(idcard.substr(6, 2)) + 1900 + "-" + idcard.substr(8, 2) + "-" + idcard.substr(10, 2))) {
                return false;
            } else {
                return true;
            }
        }

        return false;
    },
    /**
     * 银行卡号
     * @param {string} str 待验证的银行卡号
     */
    isBankcard: function(str) {
        var accept = /^([1-9][0-9]{13,18}|0[0-9]{15,17})$/;
        return accept.test(str);
    }
};

var fzNumber = {
    /**
     * 向上取倍数
     * @param {number} n 目标值
     * @param {number} base 最接近的倍数
     */
    upperTo: function(number, base) {
        if (number <= 0) {
            return 0;
        }
        if (number <= base) {
            return base;
        }
        return Math.ceil(number / base) * base;
    },

    /**
     * 获取页数
     * @param {number} nRowCount 行数
     * @param {number} nPageSize 页容量
     */
    getPageCount: function(nRowCount, nPageSize) {
        if (nRowCount <= 0) {
            return 0;
        }
        return Math.ceil(nRowCount / nPageSize);
    },

    /**
     * 测试字符串是否为指定类型的数值
     * @param {string} strNumber 要验证的字符串
     * @param {string} numberFormat [+:正数 | -:负数 | i:整数 | +i:正整数 | -i:负整数 | f:浮点数 | +f:正浮点数 | -f:负浮点数]
     */
    isNumeric: function(strNumber, numberFormat) {
        if (isNaN(strNumber)) {
            return false;
        }
        switch (numberFormat) {
            case "+":
                return /(^\+?|^\d?)\d*\.?\d+$/.test(strNumber);
            case "-":
                return /^-\d*\.?\d+$/.test(strNumber);
            case "i":
                return /(^-?|^\+?|\d)\d+$/.test(strNumber);
            case "+i":
                return /(^\d+$)|(^\+?\d+$)/.test(strNumber);
            case "-i":
                return /^[-]\d+$/.test(strNumber);
            case "f":
                return /(^-?|^\+?|^\d?)\d*\.\d+$/.test(strNumber);
            case "+f":
                return /(^\+?|^\d?)\d*\.\d+$/.test(strNumber);
            case "-f":
                return /^[-]\d*\.\d$/.test(strNumber);
            default:
                return true;
        }
    },

    /**
     * 是否正整数
     * @param {string} strNumber 
     */
    isPostiveInt: function(strNumber) {
        return this.isNumeric(strNumber, '+i');
    },

    /**
     * 数字金额转中文大写
     * @param {number} price 数字金额
     */
    toCNPrice: function(price) {
        const fraction = ['角', '分'];
        const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
        const unit = [
            ['元', '万', '亿'],
            ['', '拾', '佰', '仟'],
        ];
        let num = Math.abs(price);
        let s = '';
        fraction.forEach((item, index) => {
            s += (digit[Math.floor(num * 10 * (10 ** index)) % 10] + item).replace(/零./, '');
        });
        s = s || '整';
        num = Math.floor(num);
        for (let i = 0; i < unit[0].length && num > 0; i += 1) {
            let p = '';
            for (let j = 0; j < unit[1].length && num > 0; j += 1) {
                p = digit[num % 10] + unit[1][j] + p;
                num = Math.floor(num / 10);
            }
            s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
        }

        return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
    },

    /**
     * V1.8.3
     * 是否偶数
     * @param {*} num 可以转换成数值的量
     */
    isEven: function(num) {
        return (parseInt(num) % 2 == 0);
    },
    /**
     * V1.8.3
     * 是否奇数
     * @param {*} num 可以转换成数值的量
     */
    isOdd: function(num) {
        return (parseInt(num) % 2 !== 0);
    },

    /**
     * 1.8.6
     * 将字节数转换为文件大小
     * @param {number} sizeNum
     */
    toFileSize: function(sizeNum) {
        if (sizeNum < 1024) {
            return sizeNum + " bytes";
        } else if (sizeNum < 1048576) {
            return (Math.round(((sizeNum * 100) / 1024)) / 100) + " KB";
        } else if (sizeNum < 1073741824) {
            return (Math.round(((sizeNum * 100) / 1048576)) / 100) + " MB";
        } else {
            return (Math.round(((sizeNum * 100) / 1073741824)) / 100) + " GB";
        }
    },

    /**
     * 1.8.7
     * 2021/02/18 14:13:11
     * 将整数转换为汉字表示
     * @param {number} num 要转换的数值
     */
    toCNNumber: function(num) {
        var arr1 = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九');
        var arr2 = new Array('', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '万', '十', '百', '千', '亿'); //可继续追加更高位转换值
        if (!num || isNaN(num)) {
            return "零";
        }
        var english = num.toString().split("")
        var result = "";
        for (var i = 0; i < english.length; i++) {
            var des_i = english.length - 1 - i; //倒序排列设值
            result = arr2[i] + result;
            var arr1_index = english[des_i];
            result = arr1[arr1_index] + result;
        }
        //将【零千、零百】换成【零】 【十零】换成【十】
        result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十');
        //合并中间多个零为一个零
        result = result.replace(/零+/g, '零');
        //将【零亿】换成【亿】【零万】换成【万】
        result = result.replace(/零亿/g, '亿').replace(/零万/g, '万');
        //将【亿万】换成【亿】
        result = result.replace(/亿万/g, '亿');
        //移除末尾的零
        result = result.replace(/零+$/, '')
        //将【零一十】换成【零十】
        //result = result.replace(/零一十/g, '零十');//貌似正规读法是零一十
        //将【一十】换成【十】
        result = result.replace(/^一十/g, '十');
        return result;
    }
};

/**
 * @module 随机类
 * @version 1.0
 * @date 2020/02/10 20:34:37
 */
var fzRandom = {
    /**
     * 随机整数
     * @param {number} upper 最大值
     * @param {number} lower 最小值
     */
    int: function(upper, lower) {
        return parseInt((upper - lower + 1) * Math.random() + lower);
    },

    /**
     * 随机boolean
     * @param {number} trueRate 结果为真的概率 [0.5]
     */
    bool: function(trueRate) {
        if (trueRate === 0) {
            return false;
        }
        if (trueRate === 1) {
            return true;
        }
        trueRate = trueRate || 0.5;
        return Math.random() <= trueRate;
    },

    /**
     * 从两个值中按给定概率返回其中一个
     * @param {*} value1 值1
     * @param {*} value2 值2
     * @param {*} value1Rate 返回值1的概率
     */
    select2: function(value1, value2, value1Rate) {
        value1Rate = value1Rate || 0.5;
        if (Math.random() < value1Rate) {
            return value1;
        }
        return value2;
    },

    /**
     * 从可迭代对象中随机挑选1个值
     */
    choice: function(arrayLike) {
        return arrayLike[this.int(arrayLike.length - 1, 0)];
    },

    /**
     * 从可迭代对象中随机挑选count个值，返回新的数组
     */
    sample: function(arrayLike, count) {
        var ret = [];
        var isString = (typeof arrayLike === 'string');
        if (isString) {
            arrayLike = arrayLike.split('');
        }
        for (var i = 0; i < count; i++) {
            ret.push(this.choice(arrayLike));
        }
        if (isString) {
            ret = ret.join('');
        }
        return ret;
    },

    /**
     * 打乱数组排序
     */
    shuffle: function(arrayLike) {
        var isString = (typeof arrayLike === 'string');
        var a;
        if (isString) {
            a = arrayLike.split('');
        } else {
            a = Array.from(arrayLike);
        }
        a.sort(randomSort);
        if (isString) {
            return a.join('');
        }
        return a;

        function randomSort() {
            return Math.random() > .5 ? -1 : 1;
        }
    },

    /**
     * 随机字符串
     */
    string: function(length) {
        if (length < 0) {
            return '';
        }
        return this.sample('abcdefghikjlmnopqrstuvwxyzABCDEFGHIKJLMNOPQRSTUVWXYZ0123456789', length);
    },

    /**
     * 随机密码
     * @param {number} minLength 最小长度
     * @param {number} [maxLength] 最大长度 不选则为固定长度minLength
     */
    password: function(minLength, maxLength) {
        var a = [];
        var length = maxLength ? this.int(maxLength, minLength) : minLength;
        var type, char, asc;
        var nums = fzArray.range(48, 57),
            lower = fzArray.range(65, 90),
            upper = fzArray.range(97, 122),
            spec = [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 58, 59, 60, 61, 62, 63, 64, 91, 92, 93, 94, 95, 96, 123, 124, 125, 126];

        for (var i = 0; i < length; i++) {
            type = Math.random();
            if (type < 0.5) { //50%为小写
                asc = this.choice(lower);
            } else if (type < 0.7) { //%20为大写
                asc = this.choice(upper);
            } else if (type < 0.9) { //%20为数字
                asc = this.choice(nums);
            } else { //10%为符号
                asc = this.choice(spec);
            }
            char = String.fromCharCode(asc);
            a.push(char);
        }
        return a.join('');
    },

    /**
     * 随机颜色
     * @param {boolean} [alpha] 是否加上alpha
     * @param {boolean} [upperCase] 是否大写
     */
    color: function(alpha, upperCase) {
        return '#' + this.sample(upperCase ? 'ABCDEF1234567890' : 'abcdef1234567890', alpha ? 8 : 6);
    },

    /**
     * 随机MD5值
     * @param {boolean} [upperCase] 是否大写
     */
    md5: function(upperCase) {
        return this.sample(upperCase ? 'ABCDEF1234567890' : 'abcdef1234567890', 32);
    },

    /**
     * 随机MAC地址
     * @param {boolean} [upperCase] 是否大写
     */
    mac: function(upperCase) {
        var s = upperCase ? 'ABCDEF1234567890' : 'abcdef1234567890';
        var a = [];
        for (var i = 0; i < 6; i++) {
            a.push(this.sample(s, 2));
        }
        return a.join('-');
    },

    /**
     * 随机IP地址
     */
    ip: function() {
        return [this.int(223, 1), this.int(254, 0), this.int(254, 0), this.int(254, 0)].join('.');
    },

    /**
     * 随机年龄
     */
    age: function() {
        return this.int(100, 1);
    },

    /**
     * 随机日期
     * @param {*} upper 最大值
     * @param {*} lower 最小值
     */
    date: function(upper, lower) {
        lower = lower || '1900/1/1';
        var df = fzDate.diff('d', lower, upper);
        var nd = this.int(df, 0);
        return fzDate.add('d', lower, nd);
    },

    /**
     * 随机时间
     */
    time: function() {
        var h = fzString.zeroize(this.int(23, 0), 2),
            m = fzString.zeroize(this.int(59, 0), 2),
            s = fzString.zeroize(this.int(59, 0), 2);
        return fzString.concat(h, ':', m, ':', s);
    },

    /**
     * 随机日期时间
     * @param {*} upper 最大日期
     * @param {*} lower 最小日期
     */
    datetime: function(formatStr, upper, lower) {
        lower = lower || '1900/1/1';
        var df = fzDate.diff('d', lower, upper),
            nd = this.int(df, 0),
            d = fzDate.add('d', lower, nd),
            h = this.int(23, 0),
            m = this.int(59, 0),
            s = this.int(59, 0);
        d.setHours(h);
        d.setMinutes(m);
        d.setSeconds(s);
        return fzDate.format(d, formatStr);
    },

    /**
     * 随机生日
     * @param {string} [format] 日期格式 [yyyy-MM-dd]
     */
    birthday: function(format, maxAge, minAge) {
        format = format || 'yyyy-MM-dd';
        maxAge = maxAge || 100;
        minAge = minAge || 0;
        var n = new Date();
        if (minAge > 0) {
            n = fzDate.add('y', n, -minAge);
        }
        var b = this.date(n, fzDate.add('y', n, -maxAge));
        return fzDate.format(b, format);
    },

    /**
     * 随机手机号 支持设置运营商比例
     * @param {number} [mobileRate] 移动概率 [0.6]
     * @param {number} [telecomRate] 电信概率 [0.2]
     * @param {number} [unicomRate] 联通概率 [0.2]
     */
    phone: function(mobileRate, telecomRate, unicomRate) {
        mobileRate = mobileRate === 0 ? 0 : 0.6;
        telecomRate = telecomRate === 0 ? 0 : 0.2;
        unicomRate = unicomRate === 0 ? 0 : 0.2;
        var n = Math.random(),
            hd;
        if (n <= mobileRate) {
            hd = this.choice(getHeader('mob'));
        } else if (n <= 1 - unicomRate) {
            hd = this.choice(getHeader('uni'));
        } else {
            hd = this.choice(getHeader('tel'));
        }
        return hd + this.sample('1234567890', 11 - hd.length);

        function getHeader(type) {
            return {
                'mob': ['1340', '1341', '1342', '1343', '1344', '1345', '1346', '1347', '1348', '135', '136', '137', '138', '139', '147', '150', '151', '152', '157', '158', '159', '172', '178', '182', '183', '184', '187', '188', '198', '147', '1703', '1705', '1706'],
                'tel': ['133', '149', '153', '173', '177', '180', '181', '189', '199', '1700', '1701', '1702'],
                'uni': ['130', '131', '132', '145', '155', '156', '166', '171', '175', '176', '185', '186', '166', '145', '1704', '1707', '1708', '1709', '171']
            } [type];
        }
    },

    /**
     * 随机身份证号，可能有真实的
     */
    idcard: function(gender, maxAge, minAge) {
        var provinceCode = '11-15,21-23,31-37,41-46,50-54,61-65',
            cityCode = '0-43,51-53,90',
            townCode = '0-43,81-88',
            arrProv = fzArray.ranges(provinceCode),
            arrCity = fzArray.ranges(cityCode),
            arrTown = fzArray.ranges(townCode),
            prov = this.choice(arrProv),
            city = this.choice(arrCity),
            town = this.choice(arrTown),
            p = fzString.zeroize(prov, 2),
            c = fzString.zeroize(city, 2),
            t = fzString.zeroize(town, 2);

        if (isNone(gender)) {
            gender = this.select2(1, 2);
        }

        var b = this.birthday('yyyyMMdd', maxAge, minAge);
        var s = fzString.zeroize(this.int(99, 0), 2);
        var g = String(gender == 2 ? this.choice([0, 2, 4, 6, 8]) : this.choice([1, 3, 5, 7, 9]));
        var s17 = fzString.concat(p, c, t, b, s, g);
        var arr = s17.split('');

        var vk = (parseInt(arr[0]) + parseInt(arr[10])) * 7 +
            (parseInt(arr[1]) + parseInt(arr[11])) * 9 + (parseInt(arr[2]) + parseInt(arr[12])) * 10 +
            (parseInt(arr[3]) + parseInt(arr[13])) * 5 + (parseInt(arr[4]) + parseInt(arr[14])) * 8 +
            (parseInt(arr[5]) + parseInt(arr[15])) * 4 + (parseInt(arr[6]) + parseInt(arr[16])) * 2 +
            parseInt(arr[7]) + parseInt(arr[8]) * 6 + parseInt(arr[9]) * 3;

        var y = vk % 11;
        // 校验码
        var jym = "10X98765432";
        // 计算出的校验位
        var v = jym.substr(y, 1);
        return s17 + v;
    },

    /**
     * 几乎真实存在的身份证号
     */
    realIdcard: function() {
        //ajax加载身份证号前6位,随机生成生日,随机生成顺序号,计算校验码
    },

    /**
     * 车牌号
     */
    carNumber: function(hasSeparator) {
        var data = {
            "京": "ABCEFG",
            "津": "ABCE",
            "冀": "ABCDEFGHJRT",
            "晋": "ABCDEFHJKLM",
            "蒙": "ABCDEFGHJKLM",
            "辽": "ABCDEFGHJKLMNPV",
            "吉": "ABCDEFGHJ",
            "黑": "ABCDEFGHJKLMNPR",
            "沪": "ABCDR",
            "苏": "ABCDEFGHJKLMN",
            "浙": "ABCDEFGHJKL",
            "皖": "ABCDEFGHJKLMNPQRS",
            "闽": "ABCDEFGHJK",
            "赣": "ABCDEFGHJKLM",
            "鲁": "ABCDEFGHJKLMNPQRSUV",
            "豫": "ABCDEFGHJKLMNPQRSU",
            "鄂": "ABCDEFGHJKLMNPQRS",
            "湘": "ABCDEFGHJKLMNU",
            "粤": "ABCDEFGHJKLMNPQRSTUVWXYZ",
            "桂": "ABCDEFGHJKLMNPR",
            "琼": "ABCDE",
            "渝": "ABCFGH",
            "川": "ABCDEFHJKLMQRSTUVWXYZ",
            "贵": "ABCDEFGHJ",
            "云": "ACDEFGHJKLMNPQRS",
            "藏": "ABCDEFGHJ",
            "陕": "ABCDEFGHJKUV",
            "甘": "ABCDEFGHJKLMNP",
            "青": "ABCDEFGH",
            "宁": "ABCD",
            "新": "ABCDEFGHJKLMNPQR"
        };
        var keys = Object.keys(data);
        var p = this.choice(keys);
        var c = this.choice(data[p]);
        var n = '';
        //1个字母概率：30%
        //2个字母概率：50%
        //0个字母概率：15%
        //3个字母概率：5%
        var r = Math.random();
        if (r < 0.3) {
            n = this.sample('0123456789ABCDEFGHJKLMNPQRSTUVWXYZ', 5);
            return fzString.concat(p, c, hasSeparator ? '-' : '', n);
        } else if (r < 0.8) {
            n = this.sample('0123456789', 3);
            n = n + this.sample('ABCDEFGHJKLMNPQRSTUVWXYZ', 2);
        } else if (r < 0.95) {
            n = this.sample('0123456789', 5);
            return fzString.concat(p, c, hasSeparator ? '-' : '', n);
        } else {
            n = this.sample('0123456789', 2);
            n = n + this.sample('ABCDEFGHJKLMNPQRSTUVWXYZ', 3);
        }
        return fzString.concat(p, c, hasSeparator ? '-' : '', this.shuffle(n));
    },

    /**
     * 返回随机中文姓名
     * @param {*} letterCount 字数
     * @param {*} [femaleRate] 女性占比 [0.5]
     */
    name: function(letterCount, femaleRate) {
        return this.nameWithGender(letterCount, femaleRate).name;
    },

    /**
     * 返回姓名和性别 {name:'张三',gender:'女|男'}
     * @param {number} letterCount 字数
     * @param {number} [femaleRate] 女性占比 [0.5]
     */
    nameWithGender: function(letterCount, femaleRate) {
        femaleRate = isNone(femaleRate) ? 0.5 : femaleRate;
        var name_common1 = '波红英涛俊群颖青阳宁贤泉顺源亚月晶洋惠欣容卿虹川琦乐瑞桂凡晖华晓雨文云金清敏淼晔晨黎维';
        var name_common_not_2 = '爱君喜宝南雪佳然友和来'; //不能作为两个字的名字最后一个字的字
        var name_common_only_mid = '小子'; //只能作为中间名的字
        var name_male = '杰伟勇军海斌强明磊平林鹏富健辉轩超刚峰亮飞浩凯宇毅兵翔彬锋旭剑建宏威博力龙荣江炜成庆东雷锐进巍迪玮杨松立瑜聪帅骏昊勤新岩星忠志坤康航利坚雄智哲洪捷恒扬昕武诚锦胜科越义良鸣方铭光震冬政虎彪钢凌奇卫彦烨祥国德世正学家振兴天长继嘉思少福一泽大伯传启安广昌元万宗兆克绍远朝培士向连耀仁孝汉水益开景运贵双书生跃银佩保仲鸿加定炳锡柏发道怀其全吉茂润承治增善希根应宜会育湘本敬延才山权达章豪旺森年栋丰奎堂洲高鑫春韬';
        var name_male_2 = '守祖树中民田三有自风先'; //只能作为男性中间名的字
        var name_female = '静丽芳萍玲丹莉娟蕊婷琳艳慧霞莹娜琴琼璐蕾蓉倩薇琪帆楠媛瑛瑶梅婧兰茜雯怡萌珊靖玉凤珍妍洁鑫欢冰爽畅岚璇菲芸莎可蓓悦秀美淑秋碧焕菊彩梦翠雅素诗巧如永贞妮娣娇妹芝芹珠娥花莲芬香燕菁睿瑾露彤曦';
        var name_female_2 = '竹梓'; //只能作为女性中间名的字
        var firstName, lastName;

        var firstNameRate = Math.random();
        if (firstNameRate < 0.000642857) { //欧阳占比
            firstName = '欧阳';
        } else if (firstNameRate < 0.32) { //top 5 32%
            firstName = this.choice("李王张刘陈");
        } else if (firstNameRate < 0.44) { // 6-10 12%
            firstName = this.choice("杨赵黄周吴");
        } else if (firstNameRate < 0.78) { // 11-100 34%
            firstName = this.choice("徐孙胡朱高林何郭马罗梁宋郑谢韩唐冯于董萧程曹袁邓许傅沈曾彭吕苏卢蒋蔡贾丁魏薛叶阎余潘杜戴夏钟汪田任姜范方石姚谭廖邹熊金陆郝孔白崔康毛邱秦江史顾侯邵孟龙万段漕钱汤尹黎易常武乔贺赖龚文");
        } else if (firstNameRate < 0.97) { // 101-200 19%
            firstName = this.choice("庞樊兰殷施陶洪翟安颜倪严牛温芦季俞章鲁葛伍韦申尤毕聂丛焦向柳邢路岳齐沿梅莫庄辛管祝左涂谷祁时舒耿牟卜路詹关苗凌费纪靳盛童欧甄项曲成游阳裴席卫查屈鲍位覃霍翁隋植甘景薄单包司柏宁柯阮桂闵解强柴华车冉房边");
        } else { //201-300 3%
            firstName = this.choice("辜吉饶刁瞿戚丘古米池滕晋苑邬臧畅宫来嵺苟全褚廉简娄盖符奚木穆党燕郎邸冀谈姬屠连郜晏栾郁商蒙计喻揭窦迟宇敖糜鄢冷卓花仇艾蓝都巩稽井练仲乐虞卞封竺冼原官衣楚佟栗匡宗应台巫鞠僧桑荆谌银扬明沙薄伏岑习胥保和蔺");
        }

        letterCount = letterCount || this.select2(2, 3, 0.4);
        var gender = this.bool(femaleRate);
        var name;

        var name_gender = gender ? name_female : name_male;
        if (letterCount == 2) {
            lastName = this.choice(name_gender + name_common1);
            name = firstName + lastName;
        } else {
            var name_common = name_common1 + name_common_not_2,
                name_mid_gender = gender ? name_female_2 : name_male_2,
                name_common_gender = name_common + name_common_only_mid + name_gender + name_mid_gender,
                midName = this.choice(name_common_gender); //中间名从通用名和性别名中选一个
            if (name_common_gender.indexOf(midName) > -1) { //如果中间名是通用名则末尾名从性别名中选
                lastName = this.choice(name_gender);
            } else { //否则末尾名从通用名和性别名中选一个
                lastName = this.choice(name_common + name_gender);
            }
            name = firstName + midName + lastName;
        }
        return {
            name: name,
            gender: gender ? '女' : '男'
        };
    },

    /**
     * 随机考试成绩
     * @param {number} [fullMark] 满分 [100]
     * @param {number} [pointRate] 得分有小数点的概率 [0]
     * @param {number} [passMark] 及格分数 [60]
     * @param {number} [passRate] 及格率 [0.9]
     * @param {number} [lowMark] 低分 [20]
     * @param {number} [lowRate] 低分概率 [0.05]
     */
    mark: function(fullMark, pointRate, passMark, passRate, lowMark, lowRate) {
        fullMark = fullMark || 100;
        pointRate = pointRate || 0;
        passMark = passMark || 60;
        passRate = passRate === 0 ? 0 : 0.9;
        lowMark = lowMark || 20;
        lowRate = lowRate === 0 ? 0 : 0.05;
        var mark;
        if (this.bool(passRate)) {
            mark = this.int(fullMark, passMark);
        } else {
            if (Math.random() <= lowRate) {
                mark = this.int(lowMark - 1, 0);
            } else {
                mark = this.int(passMark - 1, 0);
            }
        }
        if ((mark < fullMark) && this.bool(pointRate)) {
            mark = mark + 0.5;
        }
        return mark;
    }
};

var fzAjax = {
    ajax: function(url, type, data, fncOK, fncError) {
        $.ajax({
            url: url,
            data: data ? JSON.stringify(data) : '',
            type: type,
            contentType: 'application/json',
            dataType: 'json',
            success: function(e) {
                fzFnc.call(fncOK, e);
            },
            error: function(e) {
                console.error(e);
                fzFnc.call(fncError, e);
            }
        });
    },
    get: function(url, fncOK, fncError) {
        this.ajax(url, 'get', null, fncOK, fncError);
    },
    post: function(url, data, fncOK, fncError) {
        this.ajax(url, 'post', data, fncOK, fncError);
    },
    //Ajax
    getXmlHttpObject: function(url, okAction, waitingAction, failAction, originalURL) {
        var xml = new XMLHttpRequest(),
            onprocess = false,
            u = url;
        if (u == undefined) {
            return xml;
        }
        if (okAction == undefined) {
            return xml;
        }
        if (originalURL) {
            u = url;
        } else {
            u = (url.indexOf('?') == -1) ? u + '?sid=' + Math.random() : u + '&sid=' + Math.random();
        }
        try {
            xml.open('GET', u, true);
        } catch (e) {
            return false;
        }

        xml.onreadystatechange = function() {
            if (xml.readyState === 4) {
                if (xml.status === 200 || xml.statusText === 'OK') {
                    okAction();
                } else {
                    if (failAction) {
                        failAction(xml.status, xml.responseText);
                    }
                }
            } else {
                if (onprocess == false) {
                    if (waitingAction) {
                        waitingAction();
                    }
                }
            }
        };
        xml.send(null);
        return xml;
    },
    getXmlHttpRequester: function(url, okAction) {
        var xml = new XMLHttpRequest();
        xml.open('GET', url, true);
        xml.onreadystatechange = function() {
            if (xml.readyState == 4) {
                okAction();
            }
        }, xml.send(null);
        return xml;
    },
    getXmlHttpPoster: function(formId, postUrl, completeEvent, processingEvent, failedEvent, bUseCheckValue, bAllowCache) {
        var xml = new XMLHttpRequest(),
            onprocess = false,
            u = postUrl,
            postedData = '',
            oForm = fzDOM.get(formId);

        if (!bAllowCache) {
            u = (u.indexOf('?') == -1) ? u + '?sid=' + Math.random() : u + '&sid=' + Math.random();
        }

        if (oForm) {
            postedData = fzAjax.getRequestBody(fzDOM.get(formId), bUseCheckValue);
        } else {
            return console.error('getXmlHttpPoster', formId + ' is not form');
        }

        xml.open("POST", u, true);
        // chrome refused
        // xml.setRequestHeader("content-length", postedData.length);
        var contentType = oForm.enctype === 'multipart/form-data' ? 'multipart/form-data' : "application/x-www-form-urlencoded";
        xml.setRequestHeader("Content-Type", contentType);
        xml.onreadystatechange = function() {
            if (xml.readyState == 4) {
                if (xml.status == 200) {
                    completeEvent();
                } else {
                    if (failedEvent) {
                        failedEvent(xml.status, xml.responseText);
                    }
                }
            } else {
                if (onprocess == false) {
                    if (processingEvent) {
                        onprocess = true;
                        processingEvent();
                    }
                }
            }
        };
        xml.send(postedData);
        return xml;
    },
    getRequestBody: function(oForm, bUseCheckValue) {
        var aParams = [],
            m;
        for (var i = 0, l = oForm.elements.length; i < l; i++) {
            m = oForm.elements[i];
            if (m.id || m.name) {
                switch (m.tagName) {
                    case 'INPUT':
                        switch (m.getAttribute('type')) {
                            case 'text':
                                addParam(m, m.value);
                                break;
                            case 'hidden':
                                addParam(m, m.value);
                                break;
                            case 'password':
                                addParam(m, m.value);
                                break;
                            case 'checkbox':
                                if (bUseCheckValue) {
                                    if (m.checked) {
                                        addParam(m, m.value);
                                    }
                                } else {
                                    addParam(m, m.checked);
                                }
                                break;
                            case 'radio':
                                if (m.checked == true) {
                                    addParam(m, m.value);
                                }
                                break;
                        }
                        break;
                    case 'TEXTAREA':
                        if (m.innerHTML) {
                            addParam(m, m.innerHTML);
                        } else {
                            addParam(m, m.value);
                        }
                        break;
                    case 'SELECT':
                        addParam(m, m.value);
                        break;
                }
            }
        }

        function addParam(o, v) {
            var sParam = encodeURIComponent(o.name ? o.name : o.id);
            sParam += '=';
            sParam += encodeURIComponent(v);
            aParams.push(sParam);
        }
        return aParams.join("&");
    },
    /**
     * V1.8.4
     * 基于jQuery实现的ajax上传文件
     * @param {string} url 上传接口地址
     * @param {HTMLInputElement} oFile input file
     * @param {function} fnOK 成功回调，传入接口返回的值
     */
    ajaxUpload: function(url, oFile, fnOK) {
        var fd = new FormData();
        var sName = oFile.name || oFile.id;
        if (!sName) {
            console.error('未指定file.name或file.id');
            return false;
        }
        if (oFile.getAttribute('type') != 'file') {
            console.error(oFile + '.type不是file');
            return false;
        }
        fd.append(sName, oFile.files[0]);
        $.ajax({
            url: url,
            type: 'post',
            data: fd,
            contentType: false,
            processData: false,
            success: function(e) {
                fzFnc.call(fnOK, e);
            }
        });
    },

    /**
     * V1.8.5
     * 测试ajax接口
     * @param {string} url 要测试的api地址
     */
    test: function(url) {
        $.get(url, function(s) {
            console.log(s)
        });
    },

    ajaxPost: function(vForm, vFormAction, fncOK, fncProcessing, bUseCheckValue) {
        var u, f;
        f = fzDOM.get(vForm);
        u = vFormAction ? vFormAction : f.action;
        var x = fzAjax.getXmlHttpPoster(f, u, function() {
            if (fncOK) {
                fncOK(x.responseText);
            }
        }, function(s) {
            if (fncProcessing) {
                fncProcessing(s);
            }
        }, function() {
            console.error(x.status, x.statusText);
        }, bUseCheckValue, true);
    },

    //V1.8.6
    //2021/02/07/ 17:54:01
    //提交虚拟表单
    postForm: function(url, data, fnSuccess, fnFailed) {
        var xml = new XMLHttpRequest();
        var aParams = [];

        for (var key in data) {
            var sParam = encodeURIComponent(key);
            sParam += '=';
            sParam += encodeURIComponent(data[key]);
            aParams.push(sParam);
        }

        var sData = aParams.join('&');

        xml.open("POST", url, true);
        // chrome refused
        // xml.setRequestHeader("content-length", postedData.length);
        var contentType = "application/x-www-form-urlencoded";
        xml.setRequestHeader("Content-Type", contentType);
        xml.onreadystatechange = function() {
            if (xml.readyState == 4) {
                if (xml.status == 200) {
                    var s = xml.responseText;
                    if (isObject(s)) {
                        return fnSuccess(s);
                    } else {
                        var obj = JSON.parse(s);
                        if (obj) {
                            return fnSuccess(obj);
                        }
                    }
                } else {
                    if (fnFailed) {
                        fnFailed(xml.status, xml.responseText);
                    }
                }
            }
        };
        xml.send(sData);
    },
    postJSON: function(url, data, fnOK, fnProcessing, fnError) {
        var u = fzString.appendParam(url, '_', Math.random());
        var onprocess = false;
        var arr = fzFnc.travelToArray(data, function(value, key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(value);
        });

        var xml = new XMLHttpRequest();
        var postData = arr.join('&');
        xml.open("POST", u, true);
        // chrome refused
        // xml.setRequestHeader("content-length", postData.length);
        xml.setRequestHeader("content-type", "application/x-www-form-urlencoded");

        xml.onreadystatechange = function() {
            if (xml.readyState == 4) {
                if (xml.status == 200) {
                    fzFnc.call(fnOK, xml.responseText);
                } else {
                    console.error(xml.status, xml.responseText);
                    fzFnc.call(fnError, xml.status, xml.statusText);
                }
            } else {
                if (onprocess == false) {
                    onprocess = true;
                    fzFnc.call(fnProcessing);
                }
            }
        };
        xml.send(postData);
    },
    ajaxGet: function(sUrl, fncOK, fncProcessing) {
        var x = new XMLHttpRequest(),
            onprocess = false,
            u = sUrl;
        if (u == undefined) {
            return;
        }
        if (fncOK == undefined) {
            return;
        }
        u = fzString.appendParam(u, 'sid', Math.random());
        try {
            x.open('GET', u, true);
        } catch (e) {
            return false;
        }

        x.onreadystatechange = function() {
            if (x.readyState === 4) {
                if (x.status === 200 || x.statusText === 'OK') {
                    if (fncOK) {
                        fncOK(x.responseText);
                    }
                } else {
                    console.error(x.status, x.statusText);
                }
            } else {
                if (onprocess == false) {
                    if (fncProcessing) {
                        fncProcessing(this.responseText);
                    }
                    onprocess = true;
                }
            }
        };
        try {
            x.send(null);
        } catch (e) {
            throw new Error(u);
        }
    },
    ajaxJSON: function(sUrl, fncOK, fncProcessing, fncError) {
        var x = new XMLHttpRequest(),
            onprocess = false,
            u = sUrl;
        if (u == undefined || fncOK == undefined) {
            return;
        }
        u = u.appendParam('sid', Math.random());
        try {
            x.open('GET', u, true);
        } catch (e) {
            return false;
        }
        x.onreadystatechange = function() {
            if (x.readyState === 4) {
                if (x.status === 200 || x.statusText === 'OK') {
                    var s = x.responseText;
                    fncOK(JSON.parse(s));
                } else {
                    console.error(x.status, x.statusText);
                }
            } else {
                if (onprocess == false) {
                    if (fncProcessing) {
                        fncProcessing();
                    }
                }
            }
        };
        x.send(null);
    }
};

var AjaxHook = {
    //Save original XMLHttpRequest as RealXMLHttpRequest
    realXhr: "RealXMLHttpRequest",

    //Call this function will override the `XMLHttpRequest` object
    hookAjax: function(proxy) {
        var self = this;
        // Avoid double hook
        window[this.realXhr] = window[this.realXhr] || XMLHttpRequest;

        XMLHttpRequest = function() {
            var xhr = new window[self.realXhr];
            // We shouldn't hook XMLHttpRequest.prototype because we can't
            // guarantee that all attributes are on the prototype。
            // Instead, hooking XMLHttpRequest instance can avoid this problem.
            for (var attr in xhr) {
                var type = "";
                try {
                    type = typeof xhr[attr] // May cause exception on some browser
                } catch (e) {}
                if (type === "function") {
                    // hook methods of xhr, such as `open`、`send` ...
                    this[attr] = hookFunction(attr);
                } else {
                    Object.defineProperty(this, attr, {
                        get: getterFactory(attr),
                        set: setterFactory(attr),
                        enumerable: true
                    });
                }
            }
            this.xhr = xhr;
        };

        // Generate getter for attributes of xhr
        function getterFactory(attr) {
            return function() {
                var v = this.hasOwnProperty(attr + "_") ? this[attr + "_"] : this.xhr[attr];
                var attrGetterHook = (proxy[attr] || {})["getter"];
                return attrGetterHook && attrGetterHook(v, this) || v;
            }
        }

        // Generate setter for attributes of xhr; by this we have an opportunity
        // to hook event callbacks （eg: `onload`） of xhr;
        function setterFactory(attr) {
            return function(v) {
                var xhr = this.xhr;
                var that = this;
                var hook = proxy[attr];
                if (typeof hook === "function") {
                    // hook  event callbacks such as `onload`、`onreadystatechange`...
                    xhr[attr] = function() {
                        proxy[attr](that) || v.apply(xhr, arguments);
                    }
                } else {
                    //If the attribute isn't writable, generate proxy attribute
                    var attrSetterHook = (hook || {})["setter"];
                    v = attrSetterHook && attrSetterHook(v, that) || v;
                    try {
                        xhr[attr] = v;
                    } catch (e) {
                        this[attr + "_"] = v;
                    }
                }
            }
        }

        // Hook methods of xhr.
        function hookFunction(fun) {
            return function() {
                var args = [].slice.call(arguments);
                if (proxy[fun] && proxy[fun].call(this, args, this.xhr)) {
                    return;
                }
                return this.xhr[fun].apply(this.xhr, args);
            }
        }

        // Return the real XMLHttpRequest
        return window[this.realXhr];
    },

    // Cancel hook
    unHookAjax: function() {
        if (window[this.realXhr]) XMLHttpRequest = window[this.realXhr];
        window[this.realXhr] = undefined;
    }
};

/**
 * 创建一个隐藏iframe，在其中执行导出excel功能
 * @param {function} callback 创建iframe并加载js成功后的回调
 */
function createExcelExportFrame(callback) {
    var frm = document.getElementById('fzFrmHiddenExcelExport');
    if (frm) {
        fzFnc.call(callback);
        return frm;
    }
    frm = document.createElement('iframe');
    frm.id = 'fzFrmHiddenExcelExport';
    frm.style.display = 'none';
    document.body.appendChild(frm);
    var d = frm.contentDocument;
    var sc = d.createElement('script');
    var wnd = frm.contentWindow;
    var scripts = [
        'lib/better-xlsx-master/jszip/dist/jszip.min',
        'lib/better-xlsx-master/jszip/vendor/FileSaver',
        'lib/better-xlsx-master/xlsx.min'
    ];
    sc.onload = function() {
        wnd.fzDOM.addScripts(scripts, callback, true);
    };
    sc.src = JS_URL + 'lib/fzcore/_core.js';
    d.body.appendChild(sc);
}

function exportExcelOnNewFrame(arrData, filename, sheetname, colWidth, fontSize, callback) {
    var frm = document.getElementById('fzFrmHiddenExcelExport');
    if (frm) {
        frm.contentWindow.exportExcel(arrData, filename, sheetname, colWidth, fontSize);
        return;
    }

    frm = document.createElement('iframe');
    frm.id = 'fzFrmHiddenExcelExport';
    frm.style.display = 'none';
    document.body.appendChild(frm);
    var d = frm.contentDocument;
    var sc = d.createElement('script');
    var wnd = frm.contentWindow;
    var scripts = [
        'lib/better-xlsx-master/jszip/dist/jszip.min',
        'lib/better-xlsx-master/jszip/vendor/FileSaver',
        'lib/better-xlsx-master/xlsx.min'
    ];
    sc.onload = function() {
        wnd.fzDOM.addScripts(scripts, function() {
            wnd.exportExcel(arrData, filename, sheetname, colWidth, fontSize, callback);
        }, true);
    };
    if (document.location.protocol == 'https:') {
        sc.src = JS_URL_HTTPS + 'lib/fzcore/_core.js';
    } else {
        sc.src = JS_URL + 'lib/fzcore/_core.js';
    }
    d.body.appendChild(sc);
}

/**
 * V1.8.7
 * 2021/02/24 17:41:37
 * 导出含有多个工作表的excel文件
 * @param {object} sheetConfig 工作表配置 {name:{data:[][],colWidth:[],fontSize:[]}}
 * @param {*} filename 
 * @param {*} callback 
 */
function exportExcelSheets(sheetConfig, filename, callback) {
    var file = new xlsx.File();
    for (var sheetname in sheetConfig) {
        var item = sheetConfig[sheetname];
        makeExcelSheet(item.data, file, sheetname, item.colWidth, item.fontSize);
    }

    file.saveAs('blob').then(function(content) {
        saveAs(content, filename + ".xlsx");
        fzFnc.call(callback);
    });
}

/**
 * 将二维数组导出Excel 
 * @param {array} arrData 数据，由行数据数组组成的数组，表头为第一个元素
 * @param {string} filename 输出文件名，不含扩展名
 * @param {string} [sheetname] 工作表名称 默认Sheet1
 * @param {array} [colWidth] 列宽数组
 * @param {number} [fontSize] 字号
 * @param {fuction} [callback] 完成后的回调
 */
function exportExcel(arrData, filename, sheetname, colWidth, fontSize, callback) {
    var file = new xlsx.File();
    if (isEmpty(sheetname)) {
        sheetname = 'Sheet1';
    }

    makeExcelSheet(arrData, file, sheetname, colWidth, fontSize);

    file.saveAs('blob').then(function(content) {
        saveAs(content, filename + ".xlsx");
        fzFnc.call(callback);
    });

}


/**
 * V1.8.7
 * 2021/02/24 17:37:10
 * 创建excel工作表 
 * @param {array} arrData 数据，由行数据数组组成的数组，表头为第一个元素
 * @param {object} file 已经创建的excel file对象
 * @param {string} [sheetname] 工作表名称 默认Sheet1
 * @param {array} [colWidth] 列宽数组
 * @param {number} [fontSize] 字号
 */
function makeExcelSheet(arrData, file, sheetname, colWidth, fontSize) {
    var headers = arrData[0];
    var sheet = file.addSheet(sheetname);
    var header = sheet.addRow();
    var i = 0,
        j = 0,
        l = arrData.length,
        c = headers.length;

    fontSize = fontSize || 11;

    for (; i < c; i++) {
        var hc = header.addCell();
        hc.style.font.bold = true;
        fill(hc, headers[i]);
    }

    for (i = 1; i < l; i++) {
        var line = arrData[i];
        var row = sheet.addRow();

        for (j = 0; j < c; j++) {
            var cell1 = row.addCell();
            fill(cell1, line[j]);
        }
    }

    if (isArray(colWidth)) {
        for (i = 0; i < c; i++) {
            sheet.col(i).width = colWidth[i];
        }
    }

    function fill(cell, value) {
        cell.style.border.top = 'thin';
        cell.style.border.left = 'thin';
        cell.style.border.bottom = 'thin';
        cell.style.border.right = 'thin';
        cell.style.border.topColor = 'ffd4d4d4';
        cell.style.border.leftColor = 'ffd4d4d4';
        cell.style.border.bottomColor = 'ffd4d4d4';
        cell.style.border.rightColor = 'ffd4d4d4';

        cell.style.fill.patternType = 'solid';
        cell.style.font.size = fontSize;
        cell.style.font.name = '微软雅黑';
        cell.style.align.v = 'center';
        cell.style.align.h = 'left';
        cell.value = fzString.removeAsciiControl(value);
    }
}

function postCrossData(api, category, name, data) {
    var w = window.open('/cross.html');
    window.addEventListener('message', function(e) {
        console.log(e);
        if (e.data == 'ready') {
            w.postMessage({
                api: api,
                category: category,
                name: name,
                data: data
            });
        }
    });
}

function saveCrossDataToMySQL(category, name, data) {
    postCrossData('mysql/savejson', category, name, data);
}