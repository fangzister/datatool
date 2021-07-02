/**
 * 主菜单
 */
var mainMenu = {
    items: [],
    subItems: []
};

var datatoolFunctions = {

};

/**
 * 主菜单定义
 */
var menus = [{
    name: '数组集合',
    items: [{
        name: '交集',
        icon: 'fa fa-delicious',
        action: intersect
    }, {
        name: '合并后去重',
        icon: 'myicon myicon-合并去重',
        action: union
    }, {
        name: '差集',
        icon: 'glyphicon glyphicon-remove',
        action: uncross
    }, {
        name: '数据1不在数据2中',
        icon: 'myicon myicon-3',
        action: difference0
    }, {
        name: '数据2不在数据1中',
        icon: 'myicon myicon-3',
        action: difference1
    }, {
        name: '统计数据1在数据2中出现次数',
        icon: 'glyphicon glyphicon-equalizer',
        action: countIf0
    }, {
        name: '统计数据2在数据1中出现次数',
        icon: 'glyphicon glyphicon-equalizer',
        action: countIf1
    }, {
        name: 'JSON转excel表格',
        icon: 'myicon myicon-json',
        action: json2excel
    }, {
        name: 'JSON转html表格',
        icon: 'myicon myicon-json',
        action: json2table
    }, {
        name: '数组分列',
        icon: 'fa fa-th',
        subMenu: [{
            title: '指定列数平均分配(&A)',
            action: arraySplitAverage
        }, {
            title: '指定每列数量分配(&D)',
            action: arraySplitByLength
        }]
    }, {
        name: '数组组合',
        tooltip: '列出一组数可能的组合情况',
        icon: 'fa fa-cubes',
        subMenu: [{
            title: '两两组合',
            action: arrayCombine
        }, {
            title: '穷举所有可能',
            action: arrayCombineAll
        }]
    }, {
        name: '生成树形层级图',
        icon: 'fa fa-sitemap',
        action: arrayToTree
    }]
}, {
    name: '字符串处理',
    items: [{
        name: '字符串翻转',
        icon: 'fa fa-exchange',
        action: reverseString
    }, {
        name: '字符串转数组',
        icon: 'fa fa-th',
        subMenu: [{
            title: '固定宽度(&W)...',
            action: splitString_width
        }, {
            title: '指定分隔符(&C)...',
            action: splitString_separator
        }, {
            title: '按数字非数字分隔(&N)',
            action: splitString_Number
        }, {
            title: '自动分列（按常见符号分隔，不拆分数字和汉字）(&A)',
            action: splitString_Auto
        }, {
            title: '自动深度分列（按所有符号分隔，拆分数字和汉字）(&D)',
            action: splitString_AutoDeep
        }]
    }, {
        name: '文本比较',
        title: '比较两段文本间的差异',
        tooltip: '推荐使用桌面软件BeyondCompare',
        icon: 'fa fa-columns',
        action: compareString
    }, {
        name: '截取字符串',
        tooltip: '以指定方式截取字符串',
        icon: 'fa fa-cut',
        subMenu: [{
            title: '开头的N个字符(&F)',
            action: cutStringFirst
        }, {
            title: '末尾的N个字符(&L)',
            action: cutStringLast
        }, {
            title: '中间固定长度个字符(&M)',
            action: cutStringMid
        }, {
            title: '开始位置至倒数位置中间的字符(&C)',
            action: cutStringCenter
        }, {
            //V1.5.1
            //删除特定字符左边和右边，统一到特定字符之间
            title: '特定字符之间(&B)',
            action: cutStringBetween
        }]
    }, {
        name: '提取特定信息',
        icon: 'glyphicon glyphicon-screenshot',
        subMenu: [{
            title: '提取IP(&I)',
            action: fetchIP
        }, {
            title: '提取URL(&U)',
            action: fetchURL
        }, {
            title: '提取域名(&D)',
            action: fetchDomain
        }, {
            title: '提取手机号(&P)',
            action: fetchPhoneNumber
        }, {
            title: '提取身份证号(&C)',
            action: fetchIdcard
        }, {
            title: '提取银行卡号（仅卡号）(&Y)',
            action: fetchBankCard
        }, {
            title: '提取银行卡号（含卡号的整行内容）(&R)',
            action: fetchBankCardAsRow
        }, {
            title: '提取IMEI号(&M)',
            action: fetchIMEI
        }, {
            title: '提取微信群ID(&G)',
            action: fetchWechatGroupID
        }, {
            title: '提取要素(&F)',
            tooltip: '支持提取：姓名，身份证号、手机号、QQ号、微信ID、微信号、护照号',
            action: fetchFactor
        }, {
            title: '提取要素（保留原文）',
            action: fetchFactorSource
        }]
    }, {
        name: '编码转换',
        icon: 'fa fa-retweet',
        subMenu: [{
            title: 'base64编码(&E)',
            action: base64Encoding
        }, {
            title: 'base64解码(&B)',
            action: base64Decoding
        }, {
            title: 'base64解码(逐行)',
            action: base64DecodingRow
        }, '|', {
            title: 'URL编码',
            action: urlEncoding
        }, {
            title: 'URL解码(&U)',
            action: urlDecoding
        }, {
            title: 'URLComponent编码',
            action: uriComponentEncoding
        }, {
            title: 'URLComponent解码',
            action: uriComponentDecoding
        }, {
            //1.5.4
            title: 'URL参数转JSON',
            action: urlParams2JSON
        }, '|', {
            title: 'HTML转HTML字符实体',
            action: htmlEntityTo
        }, {
            title: '翻译HTML字符实体',
            action: htmlEntityFrom
        }, '|', {
            title: '编码为Unicode',
            action: unicodeEncoding
        }, {
            title: '从Unicode解码',
            action: unicodeDecoding
        }, "|", {
            title: '16进制AscII编码(&X)',
            action: asciiHexEncoding
        }, {
            title: '10进制AscII编码(&A)',
            action: asciiDecEncoding
        }, {
            title: '16进制转字符串',
            icon: 'fa fa-header',
            action: hex2str
        }, "|", {
            title: 'QuotedPrintable编码',
            action: quotedPrintableEncode
        }, {
            title: 'QuotedPrintable解码',
            action: quotedPrintableDecode
        }, "|", {
            title: 'MD5(&M)',
            action: md5Encrypt
        }]
    }, {
        name: '生成序列',
        icon: 'fa fa-list-ol',
        subMenu: [{
            title: '日期(&D)',
            action: generateDateSerial
        }, {
            title: '数字(&N)',
            action: generateNumberSerial
        }, {
            // 1.5.1
            // 2021/02/07/ 09:22:44
            title: '城市名称(&C)',
            action: generateCitySerial
        }]
    }, {
        name: '生成随机值',
        icon: 'fa fa-random',
        tooltip: '生成各种类型的随机数据',
        subMenu: [{
            title: 'MD5值(&5)',
            icon: 'fa fa-hashtag',
            action: randMD5
        }, {
            title: 'MAC地址(&A)',
            icon: 'fa fa-microchip',
            action: randMac
        }, {
            //1.5.4
            title: '真实MAC地址(&T)',
            icon: 'fa fa-microchip',
            action: randRealMac
        }, {
            title: 'IP地址(&I)',
            icon: 'fa fa-map-marker',
            action: randIP
        }, {
            title: '密码(&P)',
            icon: 'fa fa-ellipsis-h',
            action: randPassword
        }, {
            title: '姓名(&N)',
            icon: 'oasicon oasicon-user',
            action: randName
        }, {
            title: '手机号(&M)',
            icon: 'fa fa-id-badge',
            action: randPhone
        }, {
            title: '身份证号(&C)',
            icon: 'fa fa-vcard-o',
            action: randIdcard
        }, {
            title: '用户名/密码/手机号',
            icon: 'fa fa-user-o',
            action: randUser
        }, {
            //1.5.4
            //2021/05/01 13:19:52
            title: '英文姓名/密码/性别',
            icon: 'fa fa-user',
            action: randEnUserPassGender
        }, {
            title: '头像',
            icon: 'fa fa-user-circle-o',
            tooltip: '从1000多个头像中随机展示一张',
            action: randHeadImg
        }, {
            //1.5.2
            title: '人脸照片',
            icon: 'fa fa-user-circle-o',
            tooltip: '从上万个不存在的人像中随机展示一张',
            action: randPersonPhoto
        }, {
            title: '车牌号',
            icon: 'fa fa-car',
            action: randCarNumber
        }, {
            title: '日期时间(&D)',
            icon: 'fa fa-calendar',
            action: randDate
        }, {
            title: '考试成绩',
            icon: 'fa fa-star',
            action: randMark
        }]
    }, {
        name: '获取拼音',
        icon: 'glyphicon glyphicon-font',
        subMenu: [{
            title: '拼音首字母',
            action: pinyinFirstLetter
        }, {
            title: '全拼（不含声调）',
            action: pinyinWithoutTone
        }, {
            title: '全拼（带声调）',
            action: pinyinWithTone
        }, {
            title: '全拼（不含声调，多音字）',
            action: pinyinWithoutTonePoly
        }]
    }, {
        name: '统计每行单词数量',
        icon: 'fa fa-pencil-square',
        action: spellingCheck
    }, {
        name: '清除HTML标记',
        icon: 'fa fa-code',
        action: cleanHTMLMark
    }]
}, {
    name: '各类号码处理',
    items: [{
        name: '手机号归属地查询（从数据1）',
        icon: 'glyphicon glyphicon-phone',
        action: mobileLocation
    }, {
        name: '手机号归属地查询（从文件）',
        icon: 'glyphicon glyphicon-phone',
        action: mobileLocationFromFile
    }, {
        //1.5.2
        //2021/03/22 10:30:25
        name: '国际手机号归属地查询',
        icon: 'fa fa-phone',
        action: mobileInternationalCode
    }, {
        name: '手机号生成VCard文件',
        title: '基于数据1中的手机号和姓名生成VCard文件',
        icon: 'fa fa-address-book-o',
        action: makeVCard
    }, {
        name: 'IP归属地查询（从数据1）',
        icon: 'fa fa-map-marker',
        action: ipLocation
    }, {
        name: 'IP归属地查询（从文件）',
        icon: 'fa fa-map-marker',
        action: ipLocationFromFile
    }, {
        name: '车牌号归属地查询',
        icon: 'myicon myicon-车牌号',
        action: getCarLocation
    }, {
        name: '银行卡查询（从数据1）',
        title: '银行卡号开户银行、卡种及归属地查询',
        tooltip: '目前开户行支持查询4000余个银行\n归属地支持查询中行、工行、建行、交行、农行、招商、邮储',
        icon: ' fa fa-bank',
        action: getBankLocation
    }, {
        name: '银行卡查询（从文件）',
        icon: ' fa fa-bank',
        action: getBankLocationFromFile
    }, {
        name: '短信服务商查询',
        icon: 'fa fa-commenting-o',
        tooltip: '通过短信号码批量所属服务商',
        action: getSMSProvider
    }, {
        name: '身份证号相关',
        icon: 'fa fa-address-card-o',
        subMenu: [{
            title: '检查身份证号合法性',
            icon: '',
            action: checkInvalidIdCard
        }, {
            title: '筛选非法身份证号',
            icon: '',
            action: filterInvalidIdCard
        }, {
            title: '身份证号15位升18位',
            icon: 'oasicon oasicon-id-card',
            action: idcard15to18
        }, {
            title: '身份证归属地查询',
            icon: '',
            action: idcardLocation
        }, {
            title: '身份证号->性别年龄归属地',
            icon: 'oasicon oasicon-users',
            action: idcardGenderAgeLocation
        }]
    }, {
        //1.5.4
        name: 'MAC地址查厂商',
        icon: 'fa fa-microchip',
        action: getMACInfo
    }, {
        //1.5.4
        name: 'HTTP状态码查询',
        icon: 'fa fa-question-circle-o',
        action: httpCodeMap
    }]
}, {
    name: '其他工具',
    items: [{
        name: '生成二维码',
        tooltip: '最多支持2953个字节（约1000个汉字）<br><p style="text-align:center;font-weight:bold;">【推荐使用支付宝APP扫码】</strong><b class="hidden">Generate QRCode</b>',
        icon: 'glyphicon glyphicon-qrcode',
        action: makeQRcode
    }, {
        name: '解析二维码',
        tooltip: '上传图片解析二维码内容<b class="hidden">Decode QRCode</b>',
        icon: 'glyphicon glyphicon-qrcode',
        action: decodeQRcode
    }, {
        name: '摄像头扫描二维码(https下使用)',
        tooltip: '调用本地摄像头扫码<b class="hidden">local webcam scan qrcode</b>',
        icon: 'glyphicon glyphicon-qrcode',
        action: scanQRcode,
        https: true
    }, {
        name: 'Base64转图片',
        icon: 'myicon myicon-base64toimg',
        action: base64ToImage
    }, {
        name: '图片转Base64',
        icon: 'myicon myicon-imgtobase64',
        action: imageToBase64
    }, {
        //V1.5.4
        name: 'Base64转二进制文件',
        icon: 'fa fa-file-zip-o',
        action: base64ToFile
    }, {
        name: 'CSS压缩',
        icon: 'fa fa-css3',
        action: cssZip
    }, {
        name: 'markdown转html',
        icon: 'fa fa-bookmark',
        action: markdown2HTML
    }, {
        name: 'JSON格式化',
        icon: 'fa fa-indent',
        action: formatJSON
    }, {
        //V1.5.4
        //2021/06/28 16:07:06^
        name: 'JSON文件合并',
        icon: 'fa fa-files-o',
        action: mergeJSONFiles
    }, {
        //V1.5.4
        //2021/07/02 09:58:20
        name: 'JSON按Key排序',
        icon: 'fa fa-sort-alpha-asc',
        action: sortJSONKeys
    }, {
        //V1.5.2
        //2021/03/22 16:27:04
        name: '下载所有链接',
        icon: 'fa fa-cloud-download',
        action: downloadUrls
    }]
}, {
    name: '日期时间',
    items: [{
        name: '时间戳转日期',
        icon: 'fa fa-clock-o',
        action: timestampToDatetime
    }, {
        name: '日期转时间戳',
        icon: 'fa fa-calendar',
        action: datetimeToTimestamp
    }, {
        name: 'CST时间转换',
        icon: 'fa fa-calendar-o',
        action: formatCSTDatetime
    }, {
        name: 'Tue Jun 15 12:13:14格式转换',
        icon: 'fa fa-calendar-o',
        action: formatWeekMonthDayTime
    }, {
        name: 'Jun 15 12:13:14格式转换',
        icon: 'fa fa-calendar-o',
        action: formatMonthDayTime
    }, {
        name: '日期格式转换...',
        icon: 'glyphicon glyphicon-retweet',
        subMenu: [{
            title: 'yyyy-MM-dd HH:mm:ss',
            action: formatdateAs,
        }, {
            title: 'yyyy-MM-dd',
            action: formatdateAs
        }, {
            title: 'yyyy/MM/dd',
            action: formatdateAs
        }, {
            title: 'yyyyMMddHHmmss',
            action: formatdateAs
        }, {
            title: 'yyyyMMdd_HHmmss',
            action: formatdateAs
        }, {
            title: 'yyyy年M月d日HH:mm:ss',
            action: formatdateAs
        }, {
            title: 'yyyy年M月d日H时m分s秒',
            action: formatdateAs
        }, {
            title: 'yyyy年M月d日H时m分',
            action: formatdateAs
        }, {
            title: 'yyyy年M月d日',
            action: formatdateAs
        }, "|", {
            title: '自定义格式(&C)',
            action: formatdate
        }]
    }, {
        name: '日期转时间量',
        icon: 'fa fa-calendar',
        subMenu: [{
            title: 'HH:mm:ss => 秒数',
            action: formatTimeToSeconds
        }, {
            title: '日期转中文星期',
            action: formatDateToWeekday
        }, {
            title: '日期转英文星期',
            action: formatDateToWeekdayEN
        }, {
            title: '日期转英文星期简写',
            action: formatDateToWeekdayENShort
        }]
    }, {
        name: '增减时间量',
        icon: 'fa fa-calendar-plus-o',
        action: plusdate
    }]
}, {
    name: '数据转换与运算',
    items: [{
        name: 'IP与数字格式互换',
        icon: 'myicon myicon-ip',
        action: convIP
    }, {
        name: '进制转换...',
        icon: 'myicon myicon-radix',
        action: convRadix
    }, {
        name: '逻辑运算',
        icon: 'fa fa-toggle-on',
        tooltip: '提供逻辑运算方法',
        subMenu: [{
            title: '二进制按位与...',
            icon: '',
            action: calcBitAnd
        }, {
            title: '二进制按位或...',
            icon: '',
            action: calcBitOr
        }, {
            title: '二进制按位非',
            icon: '',
            action: calcBitNot
        }, {
            title: '二进制按位异或...',
            icon: '',
            action: calcBitXor
        }]
    }, {
        name: '数学运算',
        icon: 'fa fa-calculator',
        tooltip: '提供几种常用的数学运算方法',
        subMenu: [{
            title: '加(&1)...',
            icon: '',
            action: calcPlus
        }, {
            title: '乘(&2)...',
            icon: '',
            action: calcMultiple
        }, {
            title: '除(&3)...',
            icon: '',
            action: calcDivide
        }, "|", {
            title: '求和(&S)',
            icon: 'myicon myicon-sum',
            action: calcSum
        }, {
            title: '求平均值(&A)',
            icon: 'myicon myicon-avg',
            action: calcAvg
        }, {
            title: '最小公倍数(&L)...',
            icon: 'myicon myicon-lcm',
            action: calcLCM
        }, {
            title: '最大公约数(&G)...',
            icon: 'myicon myicon-gcd',
            action: calcGCD
        }, {
            title: '阶乘(&F)',
            icon: 'myicon myicon-fac',
            action: calcFactorial
        }, {
            title: '排列(&P)...',
            icon: 'myicon myicon-arrange',
            action: calcArrange
        }, {
            title: '组合(&C)...',
            icon: 'myicon myicon-combine',
            action: calcCombine
        }, "|", {
            title: '分解质因数',
            icon: '',
            action: factorizationBatch
        }]
    }, {
        //1.5.3
        //2021/03/26 14:05:41
        name: '按行计算表达式',
        icon: 'fa fa-calculator',
        action: calcByRow
    }, {
        //1.5.4
        //2021/07/01 09:44:55
        name: '逐行求差值',
        icon: 'fa fa-minus-square-o',
        action: listMinus
    }, {
        name: '整数转中文',
        icon: 'fa fa-level-up',
        action: convCNNumber
    }, {
        name: '数字金额转中文大写',
        icon: ' fa fa-rmb',
        action: convCNPrice
    }, {
        name: '作为JS脚本执行',
        icon: 'fa fa-gear',
        action: jsEval
    }]
}, {
    name: 'CTF工具',
    items: [{
        name: '传统密码工具',
        icon: 'fa fa-key',
        subMenu: [{
            title: '栅栏密码(&F)',
            tooltip: 'fence decode',
            action: fence_decode
        }, {
            title: '凯撒密码(&C)',
            tooltip: 'caesar decode',
            action: caesar_decode
        }, {
            title: '摩斯密码(&M)',
            tooltip: 'morse decode',
            action: morse_decode
        }, {
            title: '培根密码(&B)',
            tooltip: 'bacon decode',
            action: bacon_decode
        }, {
            title: '幂数加密(&P)',
            action: power_decode
        }, {
            title: '转轮密码(&T)...',
            action: thomasjefferson_decode
        }]
    }, {
        name: '现代密码工具',
        icon: 'fa fa-key',
        subMenu: [{
            title: 'AES解密(&A)...',
            action: aes_decrypt
        }, {
            //V1.5.4
            title: 'TripleDES解密(&T)...',
            action: tripleDes_decrypt
        }, "|", {
            title: 'bcrypt加密(&B)...',
            action: bcryptEncrypt
        }, {
            title: 'bcrypt密文校验(&E)...',
            action: bcryptCheckEncryptedToPlaintext
        }, {
            title: 'bcrypt爆破(&P)...',
            action: bcryptCheckPlaintextToEncrypted
        }, "|", {
            title: '异或解密十六进制串(&X)...',
            action: xor_decryptHexString
        }, {
            title: '异或解密本地文件(&F)...',
            action: xor_decryptLocalFile
        }]
    }, {
        name: '编码转换',
        icon: 'fa fa-code',
        subMenu: [{
            title: '十六进制转字符串(&H)',
            icon: 'fa fa-header',
            action: hex2str
        }, {
            title: 'ASCII转字符串(&A)',
            icon: 'fa fa-font',
            tooltip: '对源字符串中的每个字符的ascii加减后返回',
            action: ascii_decode
        }, {
            title: 'ASCII值增减常量(&I)',
            icon: '',
            action: ascii_increase
        }, {
            title: 'ASCII值逐位递增',
            icon: '',
            action: ascii_increase2
        }, {
            title: '01二进制串转字符串(&0)',
            icon: '',
            action: binstr_decode
        }, {
            title: 'base系列解码(&B)',
            action: baseSerialDecoding
        }, "|", {
            title: 'XXEncode(&X)',
            icon: '',
            action: xxencode_decoding
        }, {
            title: 'UUEncode(&U)',
            icon: '',
            action: uuencode_decoding
        }, "|", {
            title: '字符串异或(&R)...',
            icon: '',
            action: xor_decoding
        }]
    }, {
        name: 'GoogleHacking...',
        icon: 'fa fa-google',
        action: showGoogleHackingDialog
    }, {
        name: 'OSINT Framework',
        icon: 'fa fa-info-circle',
        action: showOSINTFramework
    }]
}];

/**
 * 文本框的上下文菜单
 */
var menuText = new XMenu({
    for: ['txtArray1', 'txtArray2', 'txtResult'],
    items: [{
        title: '转换为表格(&T)',
        hotKey: 'ALT+T',
        icon: 'fa fa-table',
        action: function(menuItem, target, currentTarget) {
            tableView(currentTarget)
        },
        fnDisable: function(menuItem, target, currentTarget) {
            return currentTarget.value.length == 0;
        }
    }, '|', {
        title: '生成二维码(&Q)',
        icon: 'fa fa-qrcode',
        action: makeQRcode,
        fnDisable: emptyDisable,
        hotKey: 'CTRL+Q'
    }, '|', {
        title: '去重(&U)',
        action: uniqueByMenu,
        fnDisable: emptyDisable
    }, {
        title: '去重并统计(&S)',
        hotKey: 'CTRL+S',
        action: uniqueStatisticsByMenu,
        fnDisable: emptyDisable
    }, {
        title: '统计每行字符数(&N)',
        action: charCountStatisticsByMenu,
        fnDisable: emptyDisable
    }, {
        title: '统计各字符出现次数',
        action: letterCountStatisticsByMenu,
        fnDisable: emptyDisable
    }, '|', {
        title: '删除空行(&B)',
        action: trimBlank,
        fnDisable: emptyDisable
    }, '|', {
        title: '查找替换(&H)',
        hotKey: 'CTRL+H',
        action: findReplace,
        fnDisable: emptyDisable
    }, '|', {
        title: '剪切并覆盖',
        subAction: cutTo,
        fnDisable: textareaContextMenuDisableCondition,
        subItem: [{
            title: '数据&1',
            index: '1',
            hotKey: 'CTRL+1'
        }, {
            title: '数据&2',
            index: '2',
            hotKey: 'CTRL+2'
        }, {
            title: '结果(&R)',
            index: 'result',
            hotKey: 'CTRL+3'
        }]
    }, {
        title: '复制为新列',
        subAction: appendTo,
        fnDisable: textareaContextMenuDisableCondition,
        subItem: [{
            title: '数据&1',
            index: 1,
            hotKey: 'CTRL+SHIFT+1'
        }, {
            title: '数据&2',
            index: 2,
            hotKey: 'CTRL+SHIFT+2'
        }, {
            title: '结果(&R)',
            index: 'result',
            hotKey: 'CTRL+SHIFT+3'
        }]
    }, {
        title: '两边数据交换',
        subAction: exchangeWith,
        icon: 'fa fa-exchange',
        fnDisable: textareaContextMenuDisableCondition,
        subItem: [{
            title: '数据&1',
            index: 1,
            hotKey: 'CTRL+ALT+1'
        }, {
            title: '数据&2',
            index: 2,
            hotKey: 'CTRL+ALT+2'
        }, {
            title: '结果(&R)',
            index: 'result',
            hotKey: 'CTRL+ALT+3'
        }]
    }, '|', {
        title: '大小写转换(&P)',
        icon: 'glyphicon glyphicon-text-size',
        subAction: caseConvert,
        fnDisable: textareaContextMenuDisableCondition,
        subItem: [{
            title: '转换为大写(&U)',
            hotKey: 'CTRL+U',
            data: 'upper'
        }, {
            title: '转换为小写(&L)',
            hotKey: 'CTRL+SHIFT+U',
            data: 'lower'
        }, {
            title: '每行首字母大写(&C)',
            data: 'caption'
        }, {
            title: '单词首字母大写(&T)',
            data: 'letter',
            fnDisable: function() {
                return true
            }
        }]
    }, {
        title: '编码(&E)',
        icon: 'fa fa-retweet',
        fnDisable: textareaContextMenuDisableCondition,
        subItem: [{
            title: 'base64编码(&E)',
            action: base64Encoding
        }, {
            title: 'base64解码(&B)',
            action: base64Decoding
        }, {
            title: 'base64解码(逐行)',
            action: base64DecodingRow
        }, '|', {
            title: 'URL编码',
            action: urlEncoding
        }, {
            title: 'URL解码(&U)',
            action: urlDecoding
        }, {
            title: 'URLComponent编码',
            action: uriComponentEncoding
        }, {
            title: 'URLComponent解码',
            action: uriComponentDecoding
        }, {
            title: 'URL参数转JSON',
            action: urlParams2JSON
        }, '|', {
            title: 'HTML转HTML字符实体',
            action: htmlEntityTo
        }, {
            title: '翻译HTML字符实体',
            action: htmlEntityFrom
        }, '|', {
            title: '编码为Unicode',
            action: unicodeEncoding
        }, {
            title: '从Unicode解码',
            action: unicodeDecoding
        }, '|', {
            title: '16进制AscII编码(&X)',
            action: asciiHexEncoding
        }, {
            title: '10进制AscII编码(&A)',
            action: asciiDecEncoding
        }, {
            title: '16进制转字符串',
            icon: 'fa fa-header',
            action: hex2str
        }, "|", {
            title: 'MD5(&M)',
            action: md5Encrypt
        }]
    }, {
        title: '提取特定信息(&F)',
        icon: 'fa fa-crosshairs',
        subItem: [{
            title: '提取IP(&I)',
            hotKey: 'CTRL+I',
            action: fetchIP
        }, {
            title: '提取URL(&U)',
            action: fetchURL
        }, {
            title: '提取域名(&D)',
            action: fetchDomain
        }, {
            title: '提取手机号(&P)',
            action: fetchPhoneNumber
        }, {
            //1.5.2
            title: '提取身份证号(&C)',
            action: fetchIdcard
        }, {
            title: '提取银行卡号（仅卡号）(&Y)',
            action: fetchBankCard
        }, {
            title: '提取银行卡号（含卡号的整行内容）(&R)',
            action: fetchBankCardAsRow
        }, {
            title: '提取IMEI号(&M)',
            action: fetchIMEI
        }, {
            title: '提取微信群ID(&G)',
            action: fetchWechatGroupID
        }, {
            title: '提取要素(&F)',
            hotKey: 'CTRL+SHIFT+F',
            action: fetchFactor
        }]
    }, '|', {
        title: '作为脚本执行(&J)',
        action: jsEval,
        hotKey: 'CTRL+Enter',
        fnDisable: emptyDisable
    }]
}).render();

/**
 * 表格的上下文菜单
 */
var menuTable = new XMenu({
    for: ['tblArray1', 'tblArray2', 'tblResult'],
    lastAction: repeatLastAction,
    items: [{
        title: '转换为文本(&T)',
        icon: 'fa fa-font',
        hotKey: 'ALT+T',
        action: function(menuItem, target, currentTarget) {
            textView(currentTarget);
        }
    }, {
        title: '全选(&A)',
        action: selectTable,
        fnDisable: function(menuItem, target, currentTarget) {
            return currentTarget.rows.length == 0;
        }
    }, '|', {
        title: '排序(&S)',
        subAction: sortTableByMenu,
        subItem: [{
            title: '字符升序(&A)',
            icon: 'fa fa-sort-alpha-asc',
            data: 'letter-asc',
        }, {
            title: '字符降序(&D)',
            icon: 'fa fa-sort-alpha-desc',
            data: 'letter-des',
        }, {
            title: '数值升序(&1)',
            icon: 'fa fa-sort-numeric-asc',
            data: 'number-asc',
        }, {
            title: '数值降序(&2)',
            icon: 'fa fa-sort-numeric-desc',
            data: 'number-des',
        }, {
            title: '文件名升序(&F)',
            data: 'filename-asc',
        }, {
            title: '文件名降序(&G)',
            data: 'filename-des',
        }, {
            title: '文件扩展名升序(&Q)',
            data: 'fileext-asc',
        }, {
            title: '文件扩展名降序(&W)',
            data: 'fileext-des',
        }, {
            title: '文件大小升序(&Z)',
            icon: 'fa fa-sort-amount-asc',
            data: 'filesize-asc',
        }, {
            title: '文件大小降序(&X)',
            icon: 'fa fa-sort-amount-desc',
            data: 'filesize-des',
        }, "|", {
            title: '随机(&R)',
            data: 'random',
        }, {
            title: '反序(&V)',
            data: 'reverse',
        }],
        fnDisable: function(menuItem, target, currentTarget) {
            return currentTarget.rows.length == 0;
        },
        fnHide: function(menuItem, target, currentTarget) {
            if (target.tagName == 'TH') {
                return false;
            }
            if (target.parentNode.tagName == 'TH') {
                return false;
            }
            if (currentTarget.rows.length == 0 || currentTarget.rows[0].cells.length > 1) {
                return true;
            }
        }
    }, '|', {
        title: '编辑列标题(&E)',
        action: editTableHeader,
        fnHide: tableColumnMenuHideCondition
    }, {
        title: '删除整列(&D)',
        action: deleteColumn,
        fnHide: tableColumnMenuHideCondition
    }, {
        //V1.5.2
        //2021/03/22 16:20:21
        title: '转换为链接(&U)',
        action: convertTableColumnAsLink,
        data: 'link',
        fnDisable: tableColumnMenuNoDataHideCondition
    }]
}).render();

createMenu();

function textareaContextMenuDisableCondition(menuItem, source) {
    return fzDOM.getAttr(source, 'index') == menuItem.index || source.value.trim().length == 0;
}

function emptyDisable(menuItem, target, currentTarget) {
    if (currentTarget.tagName == 'TEXTAREA') {
        return currentTarget.value.trim().length == 0;
    }
    if (currentTarget.tagName == 'TABLE') {
        return currentTarget.rows.length == 0;
    }
}

function tableColumnMenuHideCondition(menuItem, target, currentTarget) {
    return (target.parentNode.tagName == 'TH') ? false : target.tagName != 'TH';
}

function tableColumnMenuNoDataHideCondition(menuItem, target, currentTarget) {
    //TODO 无数据时禁用
    return (target.parentNode.tagName == 'TH') ? false : target.tagName != 'TH';
}

function appendWechatNameHideCondition(menuItem, target, currentTarget) {
    var a = (target.parentNode.tagName == 'TH') ? false : target.tagName != 'TH';
    if (a) {
        return a;
    }
    var b = target.getAttribute('data-type') == 'wxaccount';
    return !b;
}

/**
 * 禁用表格列标题右键菜单项的条件，同时设置菜单项中带{0}的文本
 * tbody无数据时禁用，否则启用
 * @param {*} menuItem 
 * @param {*} target 
 * @param {*} currentTarget 
 */
function tableColumnMenuDisableCondition(menuItem, target, currentTarget) {
    console.log(target, currentTarget);
    return true;
}

function createMenu() {
    var tools = fzDOM.get('.tools');
    var activeMenuGroups = localStorage['activeMenuGroup'];
    if (activeMenuGroups) {
        activeMenuGroups = activeMenuGroups.split('|');
    }
    var df = document.createDocumentFragment();

    for (var i = 0, l = menus.length; i < l; i++) {
        var menu = menus[i];
        //当前网络模式要包含或等于菜单的网络
        if (menu.webmode) {
            if ((menu.webmode & WEB_MODE) == menu.webmode) {
                // console.log('当前网络模式特有功能', menu.name);
            } else {
                // console.log('当前网络模式不支持', menu.name);
                continue;
            }
        }

        createMenuGroup(menu);
    }
    tools.appendChild(df);

    loadHistory();

    //加载鹰眼库
    if (WEB_MODE == WEB_MODE_TYPE.WA) {
        loadEagleLib();
    }

    //加载操作历史记录
    function loadHistory() {
        var hisHeader = fzDOM.get('.history h3');
        hisHeader.onclick = toggleHistoryCollapse;
        var hisClear = hisHeader.querySelector('a');
        hisClear.onclick = function(e) {
            e.stopPropagation();
            clearHistoryList();
        };

        xtooltip.add(hisClear);

        var hist = localStorage["action_history"];
        if (!hist) {
            return;
        }

        var hisList = hist.split('|');
        var ul = fzDOM.get('historyList');
        var sg = document.createDocumentFragment();
        var mainItems = fzArray.filterAsObjectBy(
            mainMenu.items,
            function(item) {
                var actionName = item.dom.getAttribute('action-name');
                return actionName;
            },
            function(item, index, actionName) {
                return hisList.indexOf(actionName) > -1;
            },
            function(item, index, actionName) {
                return actionName;
            },
            function(item, index, actionName) {
                var a = item.dom;
                var n = a.cloneNode(true);
                n.onclick = window[actionName];
                return n;
            }
        );

        //如果过滤得到的对象的键数量小于保存的历史记录条数，说明还有子菜单中的功能也被保存了
        if (Object.keys(mainItems).length < hisList.length) {
            //继续过滤子菜单功能
            fzArray.filterToObjectBy(
                mainMenu.subItems,
                function(item) {
                    //1.5.4 增加无名称判断
                    var actionName = item.action ? item.action.name : '';
                    return actionName;
                },
                function(item, index, actionName) {
                    return hisList.indexOf(actionName) > -1;
                },
                function(item, index, actionName) {
                    return actionName;
                },
                function(menuItem, index, actionName) {
                    var icon = menuItem.icon;
                    var domFor = menuItem.parentConfig.for;
                    if (!icon) {
                        icon = domFor.querySelector('span').className;
                    }
                    //创建A
                    var a = fzDOM.createLinkbutton(null, null, null, window[actionName], {
                        "action-name": actionName
                    });
                    var spn = fzDOM.dom(icon, 'span');
                    a.appendChild(spn);
                    a.appendChild(fzDOM.createText(menuItem.title.replace(/\(&[A-Za-z0-9]\)/, ''))); //去掉括号中的字符串

                    // var bLock = fzDOM.createDom('b', null, null, 'fa fa-lock');
                    // a.appendChild(bLock);
                    return a;
                },
                mainItems
            );
        }

        fzArray.walk(hisList, function(actionName) {
            var a = mainItems[actionName];
            if (a) {
                var bLock = fzDOM.createDom('b', null, null, 'fa fa-lock');
                a.appendChild(bLock);
                bLock.onclick = pinHistoryItem;
                sg.appendChild(a);
            }
        });

        ul.appendChild(sg);

        function pinHistoryItem(e) {
            var b = e.target;
            var a = b.parentNode;
            console.log('pinHistoryItem', a);
            e.stopPropagation();
        }
    }

    function addPinyin(pinyins, text) {
        if (!text) {
            return;
        }
        pinyins.push(pinyinUtil.getPinyin(text, '', false, true).join(',').toLowerCase().replace(/[^a-z,]/g, ''));
        pinyins.push(pinyinUtil.getFirstLetter(text, true).join(',').toLowerCase().replace(/[^a-z,]/g, ''));
        pinyins.push(text);
    }

    function createMenuGroup(menu) {
        var clsName = 'item';
        if (activeMenuGroups) {
            clsName = fzArray.inArray(menu.name, activeMenuGroups) ? 'item expand' : 'item';
        }
        var wrap = fzDOM.createDom('div', null, null, clsName),
            h2 = fzDOM.createDom('h2', menu.name),
            div = fzDOM.createDom();

        h2.onclick = switchItem;
        if (menu.tooltip) {
            xtooltip.add(h2, menu.tooltip);
        }

        for (var i = 0, l = menu.items.length; i < l; i++) {
            var item = menu.items[i];
            //1.5.4增加disabled属性
            //2021/07/02 14:28:40
            if (item.disabled) {
                continue;
            }
            if (item.webmode) {
                if ((item.webmode & WEB_MODE) == item.webmode) {
                    // console.log('当前网络模式特有功能', item.name);
                } else {
                    // console.warn('当前网络模式下不支持', item.name);
                    continue;
                }
            }

            var a = fzDOM.createDom('a');
            item.icon = item.icon || '';
            a.href = 'javascript:;';

            var pinyins = [];

            if (item.subMenu) {
                var subMenu = new XMenu({
                    for: a,
                    largeStyle: true,
                    items: item.subMenu,
                    mode: 'mouseover',
                    fnNext: saveMenuItemClick
                }).render();

                fzArray.walk(item.subMenu, function(subItem) {
                    if (subItem == "|") {
                        return;
                    }
                    mainMenu.subItems.push(subItem);
                    addPinyin(pinyins, subItem.title);
                });

                a.className = 'item-submenu';
            } else {
                a.addEventListener('click', item.action);
                a.addEventListener('click', saveClick);
                a.setAttribute('action-name', item.action.name);
            }

            addPinyin(pinyins, item.name);
            addPinyin(pinyins, item.title);
            addPinyin(pinyins, item.tooltip);

            mainMenu.items.push({
                dom: a,
                text: item.name,
                tip: item.tooltip,
                query: pinyins.join(',')
            });

            a.innerHTML = '<span class="' + item.icon + '"></span>' + item.name;

            if (item.tooltip) {
                xtooltip.add(a, item.tooltip, item.title);
            }
            div.appendChild(a);
        }
        fzDOM.addUI(wrap, h2, div);
        df.appendChild(wrap);
    }

    function saveClick(e) {
        var a = e.target;
        var actionName = a.getAttribute('action-name');
        var ul = fzDOM.get('historyList');
        var na = ul.querySelector('a[action-name="' + actionName + '"]');
        if (!na) {
            na = a.cloneNode(true);

            var txt = na.lastChild;
            txt.textContent = txt.textContent.replace(/\(&[A-Za-z0-9]\)/, ''); //去掉括号中的字符串

            var bLock = fzDOM.createDom('b', null, null, 'fa fa-lock');
            na.appendChild(bLock);
            na.onclick = window[actionName];
        }
        console.log('保存操作历史', actionName);
        var as = ul.childNodes.length;
        if (as == 0) {
            ul.appendChild(na);
        } else {
            if (as >= 10) {
                ul.removeChild(ul.lastChild);
            }
            ul.insertBefore(na, ul.firstChild);
        }
        saveHistory(ul);
    }

    function saveMenuItemClick(menuItem) {
        var actionName = menuItem.action.name;
        var ul = fzDOM.get('historyList');
        var na = ul.querySelector('a[action-name="' + actionName + '"]');
        if (!na) {
            var icon = menuItem.icon;
            var domFor = menuItem.parentConfig.for;
            if (!icon) {
                icon = domFor.querySelector('span').className;
            }
            //创建A
            var div = menuItem.dom;
            console.log(div.innerText);

            na = fzDOM.createLinkbutton(null, null, null, window[actionName], {
                "action-name": actionName
            });
            var spn = fzDOM.dom(icon, 'span');
            na.appendChild(spn);
            var txt = menuItem.title.replace(/\(&[A-Za-z0-9]\)/, ''); //去掉括号中的字符串

            na.appendChild(fzDOM.createText(txt));
        }

        console.log('保存子菜单的操作历史', actionName, menuItem);
        var as = ul.childNodes.length;
        if (as == 0) {
            ul.appendChild(na);
        } else {
            if (as >= 10) {
                ul.removeChild(ul.lastChild);
            }
            ul.insertBefore(na, ul.firstChild);
        }
        saveHistory(ul);
    }

    function saveHistory(ul) {
        var as = ul.querySelectorAll('a');
        if (!as.length) {
            return;
        }
        var names = fzArray.each(as, function(a) {
            return a.getAttribute('action-name');
        });
        localStorage['action_history'] = names.join('|');
    }

    function switchItem(e) {
        var t = e.target;
        var item = t.parentNode;

        fzDOM.toggleClass(item, 'expand');
        var sActiveMenuGroup = localStorage['activeMenuGroup'];
        if (!sActiveMenuGroup) {
            arrExpand = [t.innerText];
        } else {
            arrExpand = sActiveMenuGroup.split('|');
            if (fzDOM.hasClass(item, 'expand')) {
                arrExpand.push(t.innerText);
            } else {
                fzArray.removeFirstFound(arrExpand, t.innerText);
            }
        }
        localStorage['activeMenuGroup'] = arrExpand.join('|');
    }
}

function clearHistoryList() {
    localStorage['action_history'] = '';
    fzDOM.clear('historyList');
}

function initSearchFn() {
    var divlogo = fzDOM.get('.logo-div');
    var ipt = fzDOM.get('.txt-search-fn');
    var bDel = fzDOM.get('.div-search-fn b');
    var menuGroupHeaders = fzDOM.queryAll('.tools .item h2');
    var menus = fzDOM.queryAll('.tools .item a');
    var tools = fzDOM.get('.tools');

    bDel.onclick = function() {
        ipt.value = '';
        var evt = new Event('input');
        ipt.dispatchEvent(evt);
        hideSearch();
    };

    divlogo.onclick = searchFn;

    ipt.oninput = function() {
        var v = this.value;
        if (!v) {
            return showAllMenus();
        }
        var matchedItems = [];
        for (var i = 0, l = mainMenu.items.length; i < l; i++) {
            var q = mainMenu.items[i].query;
            if (q.indexOf(v) > -1) {
                console.log(q);
                matchedItems.push(mainMenu.items[i].dom);
            }
        }
        if (matchedItems.length > 0) {
            showMatchedMenus(matchedItems);
        } else {
            hideAllMenus();
        }
    };

    ipt.onkeydown = function(e) {
        if (e.keyCode == 27) { //esc退出
            hideSearch();
        }
    }

    function showAllMenus() {
        fzArray.walk(menuGroupHeaders, function(x) {
            fzDOM.show(x);
        });
        fzArray.walk(menus, function(x) {
            fzDOM.show(x);
        });
    }

    function hideAllMenus() {
        fzArray.walk(menuGroupHeaders, function(x) {
            fzDOM.hide(x);
        });
        fzArray.walk(menus, function(x) {
            fzDOM.hide(x);
        });
    }

    function showMatchedMenus(matchedItems) {
        fzArray.walk(menuGroupHeaders, function(x) {
            fzDOM.hide(x);
        });
        fzArray.walk(menus, function(x) {
            fzDOM.hide(x)
        });
        fzArray.walk(matchedItems, function(x) {
            fzDOM.show(x);
            var div = x.parentNode.parentNode;
            if (!fzDOM.hasClass(div, 'expand')) {
                fzDOM.appendClass(x.parentNode.parentNode, 'expand pre-expand');
            }
        });
    }

    function searchFn() {
        if (fzDOM.hasClass(tools, 'searching')) {
            hideSearch();
        } else {
            showSearch();
        }
    }

    function showSearch() {
        fzDOM.show('.div-search-fn');
        fzDOM.setFocus('.txt-search-fn');
        fzDOM.appendClass(tools, 'searching');
    }

    function hideSearch() {
        fzDOM.hide('.div-search-fn');
        fzDOM.removeClass(tools, 'searching');
        var menuGroups = fzDOM.queryAll('.tools .item.pre-expand.expand');
        fzArray.walk(menuGroups, function(g) {
            fzDOM.removeClass(g, 'expand');
            fzDOM.removeClass(g, 'pre-expand');
        });
    }
}

initSearchFn();

function sortTableByMenu(menuItem, target, currentTarget) {
    console.log('menuItem', menuItem);
    console.log('target', target);
    console.log('currentTarget', currentTarget);

    var colIndex = 0;
    if (target.tagName == 'TH') {
        colIndex = fzDOM.getAttrLong(target, 'colindex');
    } else if (target.parentNode.tagName == 'TH') {
        colIndex = fzDOM.getAttrLong(target.parentNode, 'colindex');
    }
    var sortMethod = menuItem.data;


    doMultiSort(colIndex, sortMethod);

    function doMultiSort(colIndex, sortMethod) {
        var tBody = currentTarget.querySelector('tbody');
        var trs = tBody.querySelectorAll('tr:not([class="thead"])');
        var a = fzArray.each(trs, function(tr) {
            return fzArray.each(tr.querySelectorAll('td'), function(x) {
                return x.innerText;
            });
        });

        var sortMethods = {
            'letter-asc': sortLetterAsc,
            'letter-des': sortLetterDesc,
            'number-asc': sortNumberAsc,
            'number-des': sortNumberDesc,
            'filename-asc': sortFilenameAsc,
            'filename-des': sortFilenameDesc,
            'fileext-asc': sortFileExtAsc,
            'fileext-des': sortFileExtDesc,
            'filesize-asc': sortFileSizeAsc,
            'filesize-des': sortFileSizeDesc,
            'random': sortRandom,
            'reverse': sortReverse
        }

        a.sort(sortMethods[sortMethod]);

        fzArray.walk(a, function(text, index) {
            trs[index].innerHTML = fzString.concat('<td>', text.join('</td><td>'), '</td>');
        });

        function sortLetterAsc(x, y) {
            return x[colIndex] > y[colIndex] ? 1 : x[colIndex] < y[colIndex] ? -1 : 0;
        }

        function sortLetterDesc(x, y) {
            return x[colIndex] < y[colIndex] ? 1 : x[colIndex] > y[colIndex] ? -1 : 0;
        }

        function sortNumberAsc(x, y) {
            x = Number(x[colIndex]);
            y = Number(y[colIndex]);
            return x > y ? 1 : x < y ? -1 : 0;
        }

        function sortNumberDesc(x, y) {
            x = Number(x[colIndex]);
            y = Number(y[colIndex]);
            return x < y ? 1 : x > y ? -1 : 0;
        }

        function sortFilenameAsc(x, y) {
            var a = x[colIndex];
            var b = y[colIndex];
            var reg = /[0-9]+/g;
            var lista = a.match(reg);
            var listb = b.match(reg);
            if (!lista || !listb) {
                return a.localeCompare(b);
            }
            for (var i = 0, minLen = Math.min(lista.length, listb.length); i < minLen; i++) {
                //数字所在位置序号
                var indexa = a.indexOf(lista[i]);
                var indexb = b.indexOf(listb[i]);
                //数字前面的前缀
                var prefixa = a.substring(0, indexa);
                var prefixb = a.substring(0, indexb);
                //数字的string
                var stra = lista[i];
                var strb = listb[i];
                //数字的值
                var numa = parseInt(stra);
                var numb = parseInt(strb);
                //如果数字的序号不等或前缀不等，属于前缀不同的情况，直接比较
                if (indexa != indexb || prefixa != prefixb) {
                    return a.localeCompare(b);
                } else {
                    //数字的string全等
                    if (stra === strb) {
                        //如果是最后一个数字，比较数字的后缀
                        if (i == minLen - 1) {
                            return a.substring(indexa).localeCompare(b.substring(indexb));
                        } //如果不是最后一个数字，则循环跳转到下一个数字，并去掉前面相同的部分
                        else {
                            a = a.substring(indexa + stra.length);
                            b = b.substring(indexa + stra.length);
                        }
                    } //如果数字的string不全等，但值相等
                    else if (numa == numb) {
                        //直接比较数字前缀0的个数，多的更小
                        return strb.lastIndexOf(numb + '') - stra.lastIndexOf(numa + '');
                    } else {
                        //如果数字不等，直接比较数字大小
                        return numa - numb;
                    }
                }
            }
        }

        function sortFilenameDesc(x, y) {
            return sortFilenameAsc(y, x);
        }

        function sortFileExtAsc(x, y) {
            x = fzString.rightOf(x[colIndex], '.');
            y = fzString.rightOf(y[colIndex], '.');
            return x > y ? 1 : x < y ? -1 : 0;
        }

        function sortFileExtDesc(x, y) {
            return sortFileExtAsc(y, x);
        }

        function sortFileSizeAsc(x, y) {
            var re = /[\s,]/g;
            x = x[colIndex].replace(re, '').toUpperCase();
            y = y[colIndex].replace(re, '').toUpperCase();
            var a = getFileBytes(x);
            var b = getFileBytes(y);
            if (a == 0 || b == 0) {
                return x > y ? 1 : x < y ? -1 : 0;
            }
            var r = a > b ? 1 : a < b ? -1 : 0;
            return r;
        }

        function sortFileSizeDesc(x, y) {
            return sortFileSizeAsc(y, x);
        }

        function getFileBytes(x) {
            var a = parseInt(x);
            if (isNaN(a)) {
                return 0;
            }
            if (x.endsWith('KB') || x.endsWith('K')) {
                a = a * 1024;
            } else if (x.endsWith('MB') || x.endsWith('M')) {
                a = a * 1048576;
            } else if (x.endsWith('GB') || x.endsWith('G')) {
                a = a * 1073741824;
            } else if (x.endsWith('TB') || x.endsWith('T')) {
                a = a * 1099511627776;
            }
            return a;
        }

        function sortRandom() {
            return Math.random() > 0.5 ? 1 : -1;
        }

        function sortReverse() {
            return -1;
        }
    }
}

function caseConvert(menuItem, target, currentTarget) {
    var data = menuItem.data;
    var s = currentTarget.value;
    var actions = {
        'upper': toUpper,
        'lower': toLower,
        'caption': caption,
        'letter': letter
    }
    console.log('data', data);
    console.log('text', s);
    actions[data]();

    function toUpper() {
        currentTarget.value = s.toUpperCase();
    }

    function toLower() {
        currentTarget.value = s.toLowerCase();
    }

    function caption() {
        var arr = s.split('\n');
        arr = fzArray.each(arr, function(x) {
            return x.substr(0, 1).toUpperCase() + x.substr(1);
        });
        currentTarget.value = arr.join('\n');
    }

    function letter() {
        var t = s.toLowerCase().replace(/\b([\w|']+)\b/g, function(word) {
            return word.replace(word.charAt(0), word.charAt(0).toUpperCase());
        });
        currentTarget.value = t;
    }
}