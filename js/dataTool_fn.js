var SORT_METHODS = ['number', 'string'];
var MOBILE_DATA = 'data/mobile.json?version=20210209'; //V1.5.1
var IDCARD_DATA = 'data/idcard.json?version=20200911';
var CARNUMBER_DATA = 'data/carnumber.json?version=20200211';
var BANK_DATA = 'data/bank.json?version=20200915_1';
var IP_DATA = 'data/ipregion.json?version=20210621';
var SMSPROVIDER_DATA = 'data/smsprovider.json?version=20201021';
var EN_US_DICT = 'data/en_us.txt?version=20201004';
var INTERNATIONAL_CODE_DATA = 'data/international_code.json?version=20210322';
var NAME_DATA = 'data/name/{0}.txt?version=20210501';
var PERSON_PHOTO_DATA = 'data/person_photo.txt??version=20210501';
var MAC_OUI_DATA = 'data/mac_oui.json?version=20210701'; //http://standards-oui.ieee.org/oui/oui.csv
var HTTP_CODE_DATA = 'data/http_code.json?version=20210702';

function convertTableColumnAsLink(menuItem, target, currentTarget) {
    var colIndex = fzDOM.getAttrLong(target, 'colindex') + 1;
    var tds = fzDOM.queryAll('tbody tr td:nth-child(' + colIndex + ')', currentTarget);
    fzArray.walk(tds, function(td) {
        var h = td.innerHTML;
        td.innerHTML = '<a href="' + h + '" target="_blank">' + h + '</a>';
    });
    // target.firstChild.innerText = title;
    // target.setAttribute('data-type', data);
}

var 数组集合;

function intersect() {
    console.time('intersect');
    var arr1 = getArray('txtArray1'),
        arr2 = getArray('txtArray2'),
        ret = fzSet.intersect(arr1, arr2);
    setResult(ret);
    console.timeEnd('intersect');
}

function unique0() {
    console.time('unique0');
    _unique(0);
    console.timeEnd('unique0');
}

function unique1() {
    console.time('unique1');
    _unique(1);
    console.timeEnd('unique1');
}

function _unique(id) {
    var arr = getArray('txtArray' + (id + 1)),
        ret = fzSet.unique(arr);
    setResult(ret);
}

function uniqueByMenu(menuItem, target, currentTarget) {
    var arr = getArray(currentTarget),
        ret = fzSet.unique(arr);
    setSource(ret, currentTarget);
}

function uniqueStatisticsByMenu(menuItem, target, currentTarget) {
    var arr = getArray(currentTarget),
        uni = fzSet.unique(arr),
        ret = [];

    fzFnc.travelList(uni, function(x) {
        var n = 0;
        fzFnc.travelList(arr, function(y) {
            if (x == y) {
                n++;
            }
        });
        ret.push(x + '\t' + n);
    });

    // version 1.5.1
    // 2021/02/02/ 16:46:18
    // 以最后一列排序，而不是第二列，避免一行中包含\t时出问题
    ret.sort(function(a, b) {
        var m = a.split('\t'),
            n = b.split('\t'),
            x = parseInt(m[m.length - 1]),
            y = parseInt(n[n.length - 1]);
        return x < y ? 1 : x > y ? -1 : 0;
    });

    // ret.sort(function(a, b) {
    //     var x = parseInt(a.split('\t')[1]),
    //         y = parseInt(b.split('\t')[1]);
    //     return x < y ? 1 : x > y ? -1 : 0;
    // });

    var index = currentTarget.getAttribute('index');
    if (index == 'result') {
        setResult(ret);
    } else {
        setSource(ret, currentTarget);
    }

    // version 1.5.1
    // 2021/02/02/ 17:18:24
    // 第一列为值，最后一列为次数
    var table = tableView(index);
    var cells = table.rows[0].cells;
    cells[0].innerText = '值';

    for (var i = 1, l = cells.length - 1; i < l; i++) {
        cells[i].innerText = String.fromCharCode(65 + i);
    }
    cells[cells.length - 1].innerText = '次数';
}

//统计字符串长度
function charCountStatisticsByMenu(menuItem, target, currentTarget) {
    var arr = getArray(currentTarget),
        ret = fzArray.each(arr, function(x) {
            return x + '\t' + x.length;
        });

    setSource(ret, currentTarget);
    tableView(currentTarget, ['源字符串', '长度']);
}

//统计各字符出现次数
function letterCountStatisticsByMenu(menuItem, target, currentTarget) {
    var s = getText(currentTarget);
    var objstat = fzString.statistics(s);
    var ret = fzObject.toSortedArray(objstat.list, function(x, y) {
        if (x[1] < y[1]) {
            return 1;
        }
        if (x[1] > y[1]) {
            return -1;
        }
        if (x[0] > y[0]) {
            return 1;
        }
        if (x[0] < y[0]) {
            return -1;
        }
        return 0;
    });
    ret = fzArray.each(ret, function(x) {
        return x.join('\t');
    });

    var index = currentTarget.getAttribute('index');
    if (index == 'result') {
        setResult(ret);
    } else {
        setSource(ret, currentTarget);
    }
    tableView(index, ['字符', '次数']);
}

function union() {
    var arr1 = getArray('txtArray1'),
        arr2 = getArray('txtArray2'),
        ret = fzSet.union(arr1, arr2);
    setResult(ret);
}

function difference0() {
    _difference(0);
}

function difference1() {
    _difference(1);
}

function _difference(id) {
    var names = ['txtArray1', 'txtArray2'],
        arr1 = getArray(names[id]),
        arr2 = getArray(names[1 - id]),
        ret = fzSet.difference(arr1, arr2);
    setResult(ret);
}

function uncross() {
    var arr1 = getArray('txtArray1'),
        arr2 = getArray('txtArray2'),
        diff1 = fzSet.difference(arr1, arr2),
        diff2 = fzSet.difference(arr2, arr1),
        ret = fzSet.union(diff1, diff2);
    setResult(ret);
}

function countIf0() {
    _countIf(0);
}

function countIf1() {
    _countIf(1);
}

function _countIf(id) {
    var names = ['txtArray1', 'txtArray2'],
        a = getArray(names[id]),
        b = getArray(names[1 - id]),
        ret = [];

    fzFnc.travelList(a, function(x) {
        var n = 0;
        fzFnc.travelList(b, function(y) {
            if (x == y) {
                n++;
            }
        });
        ret.push(x + '\t' + n);
    });

    // version 1.5.1
    // 2021/02/02/ 18:26:39
    // 按最后一列排序
    ret.sort(function(a, b) {
        var m = a.split('\t'),
            n = b.split('\t'),
            x = parseInt(m[m.length - 1]),
            y = parseInt(n[n.length - 1]);
        return x < y ? 1 : x > y ? -1 : 0;
    });

    setResult(ret);
    var table = tableView('result');
    var cells = table.rows[0].cells;
    cells[0].innerText = '值';

    for (var i = 1, l = cells.length - 1; i < l; i++) {
        cells[i].innerText = String.fromCharCode(65 + i);
    }
    cells[cells.length - 1].innerText = '次数';

}

function _json2excel(s) {
    try {
        var j = JSON.parse(s);
    } catch (e) {
        return XMsgbox('解析错误', '无法将数据1解析为json对象<br>' + e.message, null, 'error', null, function() {
            return fzDOM.setFocus('txtArray1', true);
        });
    }

    if (isArray(j)) {
        return doExport(j);
    }

    if (isObject(j)) {
        var arrs = [];
        for (var k in j) {
            if (isArray(j[k]) || isObject(j[k])) {
                arrs.push(k);
            }
        }
        if (arrs.length == 0) {
            return doExportObject(j);
        }
        if (arrs.length == 1) {
            var obj = j[arrs[0]];
            return doExport([obj]);
        }
        var opts = fzArray.each(arrs, function(x) {
            return {
                text: x + '(' + j[x].length + '个元素)',
                value: x
            };
        });
        XDropdownBox('JSON转Excel表格', '要处理的JSON对象中包含多个数组，请选择要转换哪个', opts, function(x) {
            doExport(j[x]);
        });
    }

    function doExportObject(obj) {
        var arr = [Object.keys(obj), fzObject.toArray(obj)];
        exportExcelOnNewFrame(arr, 'json数据导出');
    }

    function doExport(data) {
        var arr = fzArray.json2Matrix(data);
        exportExcelOnNewFrame(arr, 'json数据导出');
    }


    //TODO
    function getLastArray(rootObj) {
        if (isArray(rootObj)) {
            return rootObj;
        }

        if (!isObject(rootObj)) {
            return null;
        }

        var kc = Object.keys(rootObj); //获取obj有几个键
        if (kc == 1) { //只有一个键则递归判断
            return getLastArray(rootObj[0]);
        }

        for (var i = 0, l = kc.length; i < l; i++) {
            var key = kc[i];
            return getLastArray(rootObj[key]);
        }
    }
}

function json2excel() {
    var s = fzDOM.val('txtArray1');
    _json2excel(s);
}

function json2table() {
    var s = fzDOM.val('txtArray1');
    try {
        var j = JSON.parse(s);
    } catch (e) {
        return XMsgbox('解析错误', '无法将数据1解析为json对象', null, 'error', null, function() {
            return fzDOM.setFocus('txtArray1', true);
        });
    }
    if (isArray(j)) {
        doExport(j);
    } else if (isObject(j)) {
        doExport([j]);
    }

    function doExport(data) {
        var s = fzArray.json2HTMLTable(data);
        console.log(s);
        setResultString(s);
    }
}

//V1.4.7
//TODO
//将字符串按特定符号拆分为数组
function arraySplitByChar() {

}

//V1.4.7
//将一列数组按指定的数量拆分为多列
function arraySplitByLength() {
    var arr = getArray1();
    var arrLen = arr.length;
    if (!arrLen) {
        return;
    }

    XNumberBox('数组拆分', '输入每列的数量', '', function(rowCount) {
        doSplit(rowCount);
    }, null, arrLen - 1, 1);

    function doSplit(rowCount) {
        var data = [];
        var row = 0;
        var colCount = fzNumber.getPageCount(arr.length, rowCount);
        var dataCount = rowCount * colCount;

        for (var r = 0; r < rowCount; r++) {
            data[r] = [];
        }

        for (var i = 0, l = dataCount; i < l; i++) {
            if (row >= arrLen) {
                data[row].push('');
            } else {
                data[row].push(arr[i]);
            }
            row++;
            if (row >= rowCount) {
                row = 0;
            }
        }
        // debugger;
        var ret = fzArray.each(data, function(rowData) {
            return rowData.join('\t');
        });
        setResult(ret);

        //1.5.1
        //2021/02/02/ 18:22:21
        //结果变表格
        tableView('result');
    }
}

//按列数平均拆分数组
function arraySplitAverage() {
    var arr = getArray1();
    var arrLen = arr.length;
    if (!arrLen) {
        return;
    }

    fzDOM.addCSS([
        '.frmArraySplit {min-width:300px; overflow:hidden;}',
        '.frmArraySplit-item { overflow:hidden; margin-bottom:10px; height:24px; }',
        '.frmArraySplit-item input[type=text] { float:left; font-size:14px; }',
        '.frmArraySplit-item input[type=radio]{ float:left; height:16px; width:16px; margin:4px 2px;}',
        '.frmArraySplit-item input.radio-last{ margin-left:18px;}',
        '.frmArraySplit-item label, .frmArraySplit-item span { float:left; font-size:14px; margin-right:6px; line-height:24px; }'
    ], null, null, 'cssArraySplit');

    var frmArraySplit = fzDOM.dom('frmArraySplit');

    var domColCount = fzDOM.createLabelInput('number', '输出列数:', 'txtColCount', null, null, 48, Math.floor(Math.sqrt(arrLen)));
    var lblWalkType = fzDOM.dom(null, 'span', '输出顺序:');
    //2020-11-19 20:06
    //修改顺序，默认先列后行
    var domColRow = fzDOM.createLabelInput('radio', '先列后行', 'radColRow', null, 'name=walktype;checked=checked');
    var domRowCol = fzDOM.createLabelInput('radio', '先行后列', 'radRowCol', 'radio-last', 'name=walktype');

    fzDOM.addUI(frmArraySplit,
        fzDOM.addUI(fzDOM.dom('frmArraySplit-item'),
            domColCount.label, domColCount.input
        ),
        fzDOM.addUI(fzDOM.dom('frmArraySplit-item'),
            lblWalkType, domColRow.input, domColRow.label, domRowCol.input, domRowCol.label
        ),
        fzDOM.createDom('p', null, 'xinputTip')
    );

    initDialog();

    function initDialog() {
        var arrLen = arr.length;
        var vld1 = null;

        new XDialog({
            title: '数组拆分',
            prompt: '设置如何拆分数据1中的' + arrLen + '个数值',
            content: frmArraySplit,
            fnOK: go
        }).show(function() {
            vld1 = new XValidator('txtColCount', null, 'xinputTip', {
                msgRequired: '列数必须是大于1，小于' + arrLen + '的正整数',
                fnCustom: function(v) {
                    var n = Number(v);
                    return n > 1 && n < arrLen;
                },
                msgRequired: '列数必须是大于1，小于' + arrLen + '的正整数',
                msgOK: '设置正确，点击确定执行拆分',
                msgCustom: '列数不能大于行数'
            }).render();
            fzDOM.setFocus('txtColCount', true);
        });

        function go() {
            if (!vld1.value) {
                return false;
            }

            var c = fzDOM.getLong('txtColCount');

            if (fzDOM.get('radRowCol').checked) {
                splitRowCol(c);
            } else {
                splitColRow(c);
            }

            //1.5.1
            //2021/02/02/ 18:22:21
            //结果变表格
            tableView('result');
            return true;

            function splitRowCol(colCount) {
                var data = [];
                var j = 0;
                for (var i = 0, l = arr.length; i < l; i++) {
                    if (j == 0) {
                        row = [];
                    }
                    j++;
                    row.push(arr[i]);
                    if (j == colCount) {
                        j = 0;
                        data.push(row.join('\t'))
                    }
                }
                if (j > 0) {
                    data.push(row.join('\t'));
                }
                setResult(data);
            }

            function splitColRow(colCount) {
                var data = [];
                var row = 0;
                var rowCount = fzNumber.getPageCount(arr.length, colCount);

                for (var r = 0; r < rowCount; r++) {
                    data[r] = [];
                }

                // debugger;
                for (var i = 0, l = arr.length; i < l; i++) {
                    data[row].push(arr[i]);
                    row++;
                    if (row == rowCount) {
                        row = 0;
                    }
                }
                // debugger;
                var ret = fzArray.each(data, function(rowData) {
                    return rowData.join('\t');
                });
                setResult(ret);
            }
        }
    }
}

//V1.4.7
//两两组合
function arrayCombine() {
    var arr = getArray1();
    var res = fzArray.combine2(arr);
    var ret = fzArray.each(res, function(x) {
        return x.join('\t');
    });
    setResult(ret);
}
//V1.4.7
//全组合
function arrayCombineAll() {
    var arr = getArray1();
    var res = fzArray.combineAll(arr);
    console.log(res);
    var ret = fzArray.each(res, function(x) {
        return x.join('\t');
    });
    setResult(ret);
}

//V1.5.2
//生成树
function arrayToTree() {
    var arr = getArray1();
    var all = {};
    var data = arr.splice(1);
    var arrObj = [];
    var mt = fzArray.each(data, function(d) {
        return d.split('\t')
    });

    fzArray.walk(mt, function(m) {
        var id = m[0];
        var obj = {
            id: id,
            name: m[1],
            pid: m[2]
        };
        all[id] = obj;
        arrObj.push(obj);
    });

    var result = makeTree(arrObj);
    window.addEventListener('message', function(e) {
        if (e.data == 'ready') {
            w.postMessage(result, '*');
        }
    })

    var w = window.open('plugin/orgChart/index.html');

    return;

    function makeTree(data) {
        var parents = data.filter(function(value) {
            return value.pid == 'undefined' || value.pid == null || value.pid == 0
        });
        var childrens = data.filter(function(value) {
            return value.pid !== 'undefined' && value.pid != null && value.pid != 0
        });

        function translator(parents, childrens) {
            parents.forEach(function(parent) {
                childrens.forEach(function(current, index) {
                    if (current.pid === parent.id) {
                        var temp = JSON.parse(JSON.stringify(childrens));
                        temp.splice(index, 1);
                        translator([current], temp);
                        typeof parent.childrens !== 'undefined' ? parent.childrens.push(current) : parent.childrens = [current];
                    }
                });
            });
        }

        translator(parents, childrens);

        return parents;
    }

    function translateDataToTree(data) {
        let parents = data.filter(value => value.pid == 'undefined' || value.pid == null || value.pid == 0);
        let items = data.filter(value => value.pid !== 'undefined' && value.pid != null && value.pid != 0);
        let translator = (parents, childrens) => {
            parents.forEach((parent) => {
                childrens.forEach((current, index) => {
                    if (current.pid === parent.id) {
                        let temp = JSON.parse(JSON.stringify(childrens));
                        temp.splice(index, 1);
                        translator([current], temp);
                        typeof parent.childrens !== 'undefined' ? parent.childrens.push(current) : parent.childrens = [current];
                    }
                });
            });
        }

        translator(parents, items);

        return parents;
    }
}

var 字符串处理;

function reverseString() {
    var arr = getArrayWithEmpty('txtArray1');
    var ret = fzArray.each(arr, function(x) {
        var s = x.split('').reverse().join('');
        return s;
    }, false);
    setResult(ret);
}

//拆分字符串
function splitString_width() {
    var src = getText1();
    XNumberBox('拆分字符串', '每行字符数', '1', function(v) {
        ret = splitByWidth(src, v);
        setResult(ret);
        return true;
    });

    function splitByWidth(str, width) {
        width = parseInt(width);
        var ret = [];
        for (var i = 0, l = str.length; i < l; i += width) {
            ret.push(str.substr(i, width));
        }
        return ret;
    }

}

function splitString_separator() {
    var src = getText1();
    XInputbox('拆分字符串', '分隔字符', '', function(t) {
        var ret = src.split(t);
        setResult(ret);
        return true;
    });
}

//V1.4.7
//字符串按数字和非数字分列
function splitString_Number() {
    var reNumber = /([^\d]*)(\d+)([^\d]*)/gi;
    var arr = getArray1();
    var ret = fzArray.each(arr, function(x) {
        x = x.trim();
        if (x.length > 0) {
            return x.replace(reNumber, '$1\t$2\t$3');
        } else {
            return x;
        }
    });
    setResult(ret);
    tableView('result');
}

//V1.4.7
//字符串自动分列
function splitString_Auto() {
    var re = /[；：，。、‘’“”（）【】;:'"_\|\s\\]/g;
    var arr = getArray1();
    var ret = fzArray.each(arr, function(x) {
        x = x.trim();
        x = x.replace(re, '\t').trim();
        var a = x.split('\t');
        var s = a.filter(function(c) {
            return c.length > 0;
        });
        return s.join('\t');
    });
    setResult(ret);
    tableView('result');
}

//V1.4.7
//字符串深度自动分列，区分数字和
function splitString_AutoDeep() {
    var re = /[；：，。、‘’“”（）【】\x00-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/g;
    var reNumber = /([^\w]*)(\d+)([^\w]*)/gi;
    var arr = getArray1();
    var ret = fzArray.each(arr, function(x) {
        x = x.trim();
        x = x.replace(re, '\t').trim();
        var a = x.split('\t');
        var s = [];
        fzArray.walk(a, function(c) {
            if (c.length > 0) {
                c = c.replace(reNumber, '$1\t$2\t$3');
                s.push(c);
            };
        });
        return s.join('\t');
    });
    setResult(ret);
    tableView('result');
}

function compareString() {
    if (!window.difflib) {
        fzDOM.addCSSFile('/lib/diffview/diffview.css', true);
        fzDOM.addScripts(['/lib/diffview/difflib.js', '/lib/diffview/diffview.js'], function() {
            return go();
        }, true);
    } else {
        go();
    }

    function go() {
        var text1 = fzDOM.val('txtArray1');
        var text2 = fzDOM.val('txtArray2');
        "use strict";
        var divWrap = fzDOM.get('.comparestring-wrap')
        var divDiff = fzDOM.get('compareStringView');
        if (!divWrap) {
            var divWrap = fzDOM.dom('comparestring-wrap');
            var divDiff = fzDOM.dom(null, null, null, 'compareStringView');
            var btnReturn = fzDOM.createLinkbutton('<i class="fa fa-arrow-circle-o-left"></i>返回');
            var divFoot = fzDOM.dom('comparestring-foot');
            divFoot.appendChild(btnReturn);
            fzDOM.addUI(divWrap, divDiff, divFoot);
            fzDOM.addTo(document.body, divWrap);

            btnReturn.onclick = function() {
                fzDOM.hide('.comparestring-wrap');
                fzDOM.clear('compareStringView');
            };
        }

        var base = difflib.stringAsLines(text1),
            newtxt = difflib.stringAsLines(text2),
            sm = new difflib.SequenceMatcher(base, newtxt),
            opcodes = sm.get_opcodes(),
            contextSize = '';

        divDiff.innerHTML = "";
        contextSize = contextSize || null;

        divDiff.appendChild(diffview.buildView({
            baseTextLines: base,
            newTextLines: newtxt,
            opcodes: opcodes,
            baseTextName: fzDOM.getText('.col-title a[index="1"]'),
            newTextName: fzDOM.getText('.col-title a[index="2"]'),
            contextSize: contextSize,
            viewType: 1
        }));
        fzDOM.show(divWrap);

        var thFirstMatch = fzDOM.get('table.diff td.replace');
        var nTop = 0
        if (thFirstMatch) {
            var pos = fzDOM.getPosition(thFirstMatch);
            nTop = pos.top;
        }
        if (nTop < 1000) {
            divWrap.scrollTo({
                top: nTop,
                behavior: 'smooth'
            });
        } else {
            divWrap.scrollTo({
                top: nTop
            });
        }
    }
}

//删除空行
function trimBlank(menuItem, source) {
    var ret = fzArray.each(getArray(source), function(x) {
        return x;
    }, true);
    if (menuItem.index == 3) {
        setResult(ret);
    } else {
        setSource(ret, source);
    }
}

//查找替换
function findReplace(menuItem, textarea) {
    var selStart = textarea.selectionStart,
        selEnd = textarea.selectionEnd;

    fzDOM.addCSS([
        '.dlgFindReplace-input{padding:10px 20px 0;}',
        '.dlgFindReplace-item{ margin-bottom:10px; overflow:hidden;}',
        '.dlgFindReplace-check { padding-bottom:10px; overflow:hidden; }',
        '.dlgFindReplace-check div{float: left; margin-right: 10px;}',
        '.dlgFindReplace-check input{ margin: 6px 2px 0 0; float: left;}',
        '.dlgFindReplace-check label{float: none; line-height: 22px; font-size: 12px;}',
        '.dlgFindReplace-item label{ display:block; float:none; margin-bottom:3px; }',
        '.dlgFindReplace-item input[type="text"]{width:460px;}',
        '.dlgFindReplace-item input[type="checkbox"]{margin:4px 3px 0 0; float:none}',
        '.dlgFindReplace-buttons { padding:0 20px 20px;} ',
        '.dlgFindReplace-buttons button{padding: 3px 6px; margin-right: 6px; font-size: 12px;}'
    ], null, null, 'dlgFindReplace');
    var index = fzDOM.getAttr(textarea, 'index');
    var sTitle = fzDOM.getText('.col-title a[index="' + index + '"]');
    var prevText = '';

    var dlg = new XDialog({
        title: '对' + sTitle + '进行查找替换',
        icon: false,
        content: [
            fzDOM.addUI(
                fzDOM.dom('dlgFindReplace-input'),
                fzDOM.createLabelInputDiv('text', '查找:', 'txtFind', 'dlgFindReplace-item'),
                fzDOM.createLabelInputDiv('text', '替换为:', 'txtReplace', 'dlgFindReplace-item'),
                fzDOM.addUI(
                    fzDOM.dom('dlgFindReplace-check'),
                    fzDOM.createLabelInputDiv('checkbox', '区分大小写', 'chkCaseSensitive'),
                    fzDOM.createLabelInputDiv('checkbox', '使用正则表达式', 'chkUseRegexp'),
                    fzDOM.createLabelInputDiv('checkbox', '仅在选取内查找', 'chkFindSelection')
                )
            ),
            fzDOM.addUI(
                fzDOM.dom('dlgFindReplace-buttons'),
                fzDOM.createButton(null, null, doReplaceAll, '替换全部(<u>A</u>)', 'accesskey=a'),
                fzDOM.createButton(null, null, undo, '撤销')
            )
        ],
        modal: false,

    }).show(function() {
        textarea.setSelectionRange(selStart, selEnd);
        fzDOM.setFocus('txtFind');
    });

    function doReplaceAll() {
        var t = textarea.value;
        prevText = t;
        var reg = new RegExp(fzDOM.val('txtFind'), 'gm');
        var replacement = fzDOM.val('txtReplace');
        replacement = replacement.replace(/\\n/g, '\n');
        replacement = replacement.replace(/\\t/g, '\t');
        replacement = replacement.replace(/\\s/g, ' ');
        t = t.replace(reg, replacement);
        setSourceString(t, textarea);
    }

    function undo() {
        var s = textarea.value;
        textarea.value = prevText;
        prevText = s;
    }
}

/***********************************
 * 提取特定信息
 **********************************/

function fetchIP(menuItem, target, currentTarget) {
    // var re = /^[^\d]*?(((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?))[^\d]*?$/gm;
    var re = /[^\d]*?(((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?))[^\d]*?/gm;
    _fetchData(currentTarget, re, 'IP地址');
}

function fetchURL(menuItem, target, currentTarget) {
    var re = /(https?:\/\/[-A-Za-z0-9+&@#\/%?=~_\|!:\.,;]+[-A-Za-z0-9+&@#\/%=~_\|]+)/gm;
    _fetchData(currentTarget, re, 'URL');
}

function fetchDomain(menuItem, target, currentTarget) {
    var re = /https?:\/\/(.+?)\//gm;
    _fetchData(currentTarget, re, '域名');
}

function fetchPhoneNumber(menuItem, target, currentTarget) {
    //var re = /^[^\d]*?((13[0-9]|15[0-9]|18[0-9]|147|17[0-9]|16[0-9]|19[0-9])\d{8})[^\d]*?$/gm;

    //_fetchData(target, re, '手机号');

    // var re = /[^\d]*?((13[0-9]|15[0-9]|18[0-9]|147|17[0-9]|16[0-9]|19[0-9])\d{8})[^\d]*?/;
    var re = /[^\d]*?((13[0-9]|15[0-9]|18[0-9]|147|17[0-9]|16[0-9]|19[0-9])\d{8})[^\d]*?/;
    _fetchDataByRow(currentTarget, re, '手机号');
}

//1.5.2
//身份证号
function fetchIdcard(menuItem, target, currentTarget) {
    var re = /[^\d]*?(\d{17}[\dXx])/gm;
    _fetchData(currentTarget, re, '身份证号', true);
}

function fetchBankCard(menuItem, target, currentTarget) {
    var re = /(^|[^\d])([1-9](\d{18}|\d{14}))([^\d]|$)/;
    _fetchDataByRow(currentTarget, re, '银行卡号', true, 2);
}

function fetchBankCardAsRow(menuItem, target, currentTarget) {
    var re = /(^|[^\d])([1-9](\d{18}|\d{14}))([^\d]|$)/;
    _fetchDataByRow(currentTarget, re, '银行卡号', true, -1);
}

function fetchIMEI(menuItem, target, currentTarget) {
    var re = /^[^\d]*?(\d{15})[^\d]*?$/gm;
    _fetchData(currentTarget, re, 'IMEI号', true);
}

function fetchWechatGroupID(menuItem, target, currentTarget) {
    var re = /(^|[^\d])(\d{8,11})([^\d]|$)/;
    _fetchDataByRow(currentTarget, re, '微信群ID', true, 2);
}

//提取特定信息的通用实现
function _fetchDataByRow(target, re, dataType, removeSpace, matchIndex) {
    if (!target.tagName || target.tagName != 'TEXTAREA') {
        target = fzDOM.get('txtArray1');
    }
    if (isUndef(matchIndex)) {
        matchIndex = 1;
    }

    var s = target.value;
    var ret = [];
    var p = s.split('\n');
    if (removeSpace) {
        if (matchIndex == -1) {
            fzArray.walk(p, function(x) {
                var r = x.replace(/\s/g, '');
                var m = r.match(re);
                if (m) {
                    ret.push(x);
                }
            });
        } else {
            fzArray.walk(p, function(x) {
                var r = x.replace(/\s/g, '');
                var m = r.match(re);
                if (m) {
                    ret.push(m[matchIndex]);
                }
            });
        }
    } else {
        if (matchIndex == -1) {
            fzArray.walk(p, function(x) {
                var m = x.match(re);
                if (m) {
                    ret.push(x);
                }
            });
        } else {
            fzArray.walk(p, function(x) {
                var m = x.match(re);
                if (m) {
                    ret.push(m[matchIndex]);
                }
            });
        }
    }

    if (ret.length > 0) {
        setResult(ret);
    } else {
        var index = fzDOM.getAttr(target, 'index');
        var title = fzDOM.getText('.col-title a[index="' + index + '"]');
        var info = '没有在' + title + '中匹配到' + dataType;
        XAlert(info);
    }
}

function _fetchData(target, re, dataType, removeSpace) {
    if (!target.tagName || target.tagName != 'TEXTAREA') {
        target = fzDOM.get('txtArray1');
    }

    var s = target.value;
    if (removeSpace) {
        s = s.replace(/ /g, '');
    }
    var m = s.matchAll(re);
    var a = m.next();
    var ret = [];
    while (!a.done) {
        ret.push(a.value[1]);
        a = m.next();
    }
    if (ret.length > 0) {
        setResult(ret);
    } else {
        var index = fzDOM.getAttr(target, 'index');
        var title = fzDOM.getText('.col-title a[index="' + index + '"]');
        var info = '没有在' + title + '中匹配到' + dataType;
        XAlert(info);
    }
}

//提取要素
function fetchFactor(menuItem, target, currentTarget) {
    var oTarget;
    if (!currentTarget.tagName || currentTarget.tagName != 'TEXTAREA') {
        oTarget = fzDOM.get('txtArray1');
    } else {
        oTarget = currentTarget;
    }

    var s = oTarget.value;
    var ret = [];

    var src = s.replace('\r', '').split('\n');

    fzArray.walk(src, function(row) {
        if (!row.length) {
            return;
        }
        var person = {};
        //姓名
        var name = getDataByRow(row, /姓名.*?(.+?)[\s,:，：]/g, '姓名');
        if (!name) {
            name = getDataByRow(row, /.+[.,:、，：）\)](.+?)[\s,:，：][男女]/g, '姓名');
        }
        if (!name) {
            name = getDataByRow(row, /^(.+?)[\s,:、，：）\)][男女]/g, '姓名');
        }
        if (!name) {
            name = getDataByRow(row, /身份为(.+?)[\s,:，：]/, '姓名');
        }
        if (!name) {
            name = getDataByRow(row, /人为(.+?)[\s,:，：]/, '姓名');
        }
        if (!name) {
            name = getDataByRow(row, /真实身份(.+?)[\s,:，：]/, '姓名');
        }
        if (!name) {
            name = getDataByRow(row, /[.,:，：）\)](.+?)[\s,:，：（\(][男女]/, '姓名');
        }
        if (!name) {
            name = getDataByRow(row, /[.,:，：）\)、](.+?)[\s,:，：（\(][男女]/, '姓名');
        }
        if (!name) {
            name = getDataByRow(row, /[.,:，：）\)](.+?)[\s,:，：（\(][身份]/, '姓名');
        }
        if (!name) {
            name = getDataByRow(row, /[.,:，：、）\)](.+?)[\s,:，：（\(][身份]/, '姓名');
        }
        if (!name) {
            name = getDataByRow(row, /[.,:，：）\)](.+?)[\s,:，：][身份]/g, '姓名');
        }
        if (!name) {
            name = getDataByRow(row, /^(.+?)[\s,:，：）\)][身份]/g, '姓名');
        }
        if (name) {
            name = name.replace(/[:：\s]/g, '');
            row = removeFactor(row, name);
        }
        //身份证号
        var idcard = getDataByRow(row, /(\d{17}[\dxX])/g, '身份证号');
        row = removeFactor(row, idcard);

        //手机号
        var phone = getDataByRow(row, /[手机|电话].*?((13[0-9]|15[0-9]|18[0-9]|147|17[0-9]|16[0-9]|19[0-9])\d{8})[^\d]/g, '手机号码');
        row = removeFactor(row, phone);
        console.log(row);

        //微信ID
        var wxid = getDataByRow(row, /微信ID.*?(\d{5,10})[^\d]/gi, '微信ID');
        if (!wxid) {
            wxid = getDataByRow(row, /微信用户ID.*?(\d{5,10})[^\d]/gi, '微信ID');
        }
        row = removeFactor(row, wxid);

        //微信号
        // var wxaccount = getDataByRow(row, /微信.*?([a-zA-Z][-_a-zA-Z0-9]{5,})[^a-zA-Z0-9]/g, '微信号');
        // row = removeFactor(row, wxaccount);

        //QQ
        var qq = getDataByRow(row, /qq.*?[^\d](\d{5,10})[^\d]/gi, 'QQ号');
        row = removeFactor(row, qq);

        //护照
        // var huzhao = getDataByRow(row, /护照.*?([a-z0-9]+?)[^\a-z0-9]/gi, '护照号');

        // if (name || idcard || phone || wxid || wxaccount || qq || huzhao) {
        if (name || idcard || phone || wxid || qq) {
            person['name'] = name;
            person['idcard'] = idcard;
            person['phone'] = phone;
            person['wxid'] = wxid;
            // person['wxaccount'] = wxaccount;
            person['qq'] = qq;
            // person['huzhao'] = huzhao;
            ret.push(person);
        }
    });

    if (ret.length > 0) {
        var data = fzArray.json2Matrix(ret);
        data.splice(0, 1);
        var retStr = fzArray.each(data, function(x) {
            return x.join('\t');
        });
        setResult(retStr);
        // tableView('result', ['姓名', '身份证号', '手机号', '微信ID', '微信号', 'QQ', '护照号']);
        tableView('result', ['姓名', '身份证号', '手机号', '微信ID', 'QQ']);
    } else {
        var index = fzDOM.getAttr(oTarget, 'index');
        var title = fzDOM.getText('.col-title a[index="' + index + '"]');
        var info = '没有在' + title + '中匹配到要素';
        XAlert(info);
    }

    function removeFactor(row, f) {
        if (!f) {
            return row;
        }
        var a = f.split(',');
        var sRow = row;
        fzArray.walk(a, function(x) {
            sRow = sRow.replace(x, '');
        });
        return sRow;
    }

    function getDataByRow(row, re, dataType) {
        var ret = [];
        var m = row.matchAll(re);
        var a = m.next();
        while (!a.done) {
            ret.push(a.value[1]);
            a = m.next();
        }
        if (ret.length) {
            ret = fzArray.unique(ret);
            return ret.join(',');
        }
    }
}

function fetchFactorSource(menuItem, target, currentTarget) {
    var oTarget;
    if (!currentTarget.tagName || currentTarget.tagName != 'TEXTAREA') {
        oTarget = fzDOM.get('txtArray1');
    } else {
        oTarget = currentTarget;
    }

    var s = oTarget.value;
    var src = s.replace('\r', '').split('\n');

    var ret = [];

    fzArray.walk(src, function(row) {
        if (!row.length) {
            ret.push('');
            return;
        }
        var person = {};
        //姓名
        var name = getDataByRow(row, /姓名.*?(.+?)[\s,:，：]/g, '姓名');
        if (!name) {
            name = getDataByRow(row, /.+[.,:、，：）\)](.+?)[\s,:，：][男女]/g, '姓名');
        }
        if (!name) {
            name = getDataByRow(row, /^(.+?)[\s,:、，：）\)][男女]/g, '姓名');
        }
        if (!name) {
            name = getDataByRow(row, /身份为(.+?)[\s,:，：]/, '姓名');
        }
        if (!name) {
            name = getDataByRow(row, /人为(.+?)[\s,:，：]/, '姓名');
        }
        if (!name) {
            name = getDataByRow(row, /真实身份(.+?)[\s,:，：]/, '姓名');
        }
        if (!name) {
            name = getDataByRow(row, /[.,:，：）\)](.+?)[\s,:，：][身份]/g, '姓名');
        }
        if (!name) {
            name = getDataByRow(row, /^(.+?)[\s,:，：）\)][身份]/g, '姓名');
        }
        if (name) {
            name = name.replace(/[:：\s]/g, '');
            row = removeFactor(row, name);
        }
        //身份证号
        var idcard = getDataByRow(row, /(\d{17}[\dxX])/g, '身份证号');
        row = removeFactor(row, idcard);

        //手机号
        var phone = getDataByRow(row, /[手机|电话].*?((13[0-9]|15[0-9]|18[0-9]|147|17[0-9]|16[0-9]|19[0-9])\d{8})[^\d]/g, '手机号码');
        row = removeFactor(row, phone);

        //微信ID
        var wxid = getDataByRow(row, /微信ID.*?(\d{5,10})[^\d]/gi, '微信ID');
        if (!wxid) {
            wxid = getDataByRow(row, /微信用户ID.*?(\d{5,10})[^\d]/gi, '微信ID');
        }
        row = removeFactor(row, wxid);

        //微信号
        // var wxaccount = getDataByRow(row, /微信.*?([a-zA-Z][-_a-zA-Z0-9]{5,})[^a-zA-Z0-9]/g, '微信号');
        // row = removeFactor(row, wxaccount);

        //QQ
        var qq = getDataByRow(row, /qq.*?[^\d](\d{5,10})[^\d]/gi, 'QQ号');
        row = removeFactor(row, qq);

        //护照
        // var huzhao = getDataByRow(row, /护照.*?([a-z0-9]+?)[^\a-z0-9]/gi, '护照号');

        // if (name || idcard || phone || wxid || wxaccount || qq || huzhao) {
        if (name || idcard || phone || wxid || qq) {
            person['name'] = name;
            person['idcard'] = idcard;
            person['phone'] = phone;
            person['wxid'] = wxid;
            // person['wxaccount'] = wxaccount;
            person['qq'] = qq;
            // person['huzhao'] = huzhao;
            ret.push(person);
        } else {
            ret.push('');
        }
    });

    if (ret.length > 0) {
        var data = fzArray.json2Matrix(ret);
        data.splice(0, 1);
        var retStr = fzArray.each(data, function(x) {
            return x.join('\t');
        });
        setResult(retStr);
        // tableView('result', ['姓名', '身份证号', '手机号', '微信ID', '微信号', 'QQ', '护照号']);
        tableView('result', ['姓名', '身份证号', '手机号', '微信ID', 'QQ']);
    } else {
        var index = fzDOM.getAttr(oTarget, 'index');
        var title = fzDOM.getText('.col-title a[index="' + index + '"]');
        var info = '没有在' + title + '中匹配到要素';
        XAlert(info);
    }

    function removeFactor(row, f) {
        if (!f) {
            return row;
        }
        var a = f.split(',');
        var sRow = row;
        fzArray.walk(a, function(x) {
            sRow = sRow.replace(x, '');
        });
        return sRow;
    }

    function getDataByRow(row, re, dataType) {
        var ret = [];
        var m = row.matchAll(re);
        var a = m.next();
        while (!a.done) {
            ret.push(a.value[1]);
            a = m.next();
        }
        if (ret.length) {
            ret = fzArray.unique(ret);
            return ret.join(',');
        }
    }
}

var 生成序列;

function generateDateSerial() {
    fzDOM.addCSS([
        '.frmGenerateDate-item { overflow:hidden; margin-bottom:10px; height:24px; }',
        '.frmGenerateDate-item input, .frmGenerateDate-item label{float:left; font-size:12px;}',
        '.frmGenerateDate-item input{margin-right:6px;}',
        '.frmGenerateDate-item label { line-height:24px; }'
    ], null, null, 'cssGenerateDate');

    var frmGenerateDate = fzDOM.dom('frmGenerateDate');

    var domStart = fzDOM.createLabelInput('date', '开始日期:', 'txtDateStart', null, null, 140, fzDate.today());
    var domEnd = fzDOM.createLabelInput('date', '结束日期:', 'txtDateEnd', null, null, 140);
    var domCount = fzDOM.createLabelInput('number', '间隔:', 'iptCount', null, null, 56);
    var ddlInterval = new XDropdownList('ddlInterval', {
        options: ['s:秒', 'n:分', 'h:时', 'd:天', 'w:周', 'q:季', 'm:月', 'y:年'],
        defaultIndex: 3,
        width: 56
    });
    var domStep = fzDOM.createLabelInput('number', '输出步长:', 'iptStep', null, null, 56, 1);
    var ddlStep = new XDropdownList('ddlIntervalStep', {
        options: ['s:秒', 'n:分', 'h:时', 'd:天', 'w:周', 'q:季', 'm:月', 'y:年'],
        defaultIndex: 3,
        width: 56
    });
    var ddlFormat = new XDropdownList('ddlFormat', {
        options: DATE_FORMATS,
        defaultIndex: 2,
        width: 200
    });

    domCount.input.oninput = function() {
        var v = parseInt(this.value);
        var inv = ddlInterval.value;
        var d = fzDate.add(inv, domStart.input.value, v);
        var s = fzDate.getDate(d);
        domEnd.input.value = s;
    };

    fzDOM.addUI(frmGenerateDate,
        fzDOM.addUI(fzDOM.dom('frmGenerateDate-item'),
            domStart.label, domStart.input
        ),
        fzDOM.addUI(fzDOM.dom('frmGenerateDate-item'),
            domEnd.label, domEnd.input, domCount.label, domCount.input,
            ddlInterval.createUI()
        ),
        fzDOM.addUI(fzDOM.dom('frmGenerateDate-item'),
            domStep.label, domStep.input,
            ddlStep.createUI()
        ),
        fzDOM.addUI(fzDOM.dom('frmGenerateDate-item'),
            fzDOM.dom(null, 'label', '输出格式:'),
            ddlFormat.createUI()
        )
    );

    new XDialog({
        title: '生成时间序列',
        prompt: '设置参数',
        content: frmGenerateDate,
        fnOK: go
    }).show(function() {
        fzDOM.setFocus('iptCount');
    });

    function go() {
        var sStart = fzDOM.val('txtDateStart'),
            sEnd = fzDOM.val('txtDateEnd'),
            sInterval = ddlStep.value,
            nStep = fzDOM.getLong('iptStep'),
            nCount = fzDate.diff(sInterval, sStart, sEnd) + 1,
            sFormat = ddlFormat.value,
            dt = new Date(sStart),
            ret = [];

        for (var i = 0; i < nCount; i += nStep) {
            var d = fzDate.add(sInterval, dt, i);
            ret.push(fzDate.format(d, sFormat))
        }
        setSource(ret, 'txtArray1');
        return true;
    }
}

function generateNumberSerial() {
    fzDOM.addCSS([
        '.frmGenerateNumber-item { overflow:hidden; margin-bottom:10px; height:24px; }',
        '.frmGenerateNumber-item input, .frmGenerateDate-item label{float:left; font-size:12px;}',
        '.frmGenerateNumber-item input { margin-right:6px;}',
        '.frmGenerateNumber-item input[type="checkbox"] { margin:6px 6px 0 66px;}',
        '.frmGenerateNumber-item label { line-height:24px; }'
    ], null, null, 'cssGenerateNumber');

    var frmGenerateNumber = fzDOM.dom('frmGenerateNumber');

    var domStart = fzDOM.createLabelInput('number', '开始数值:', 'txtNumStart', null, null, 72);
    var domEnd = fzDOM.createLabelInput('number', '结束数值:', 'txtNumEnd', null, null, 72);
    var domStep = fzDOM.createLabelInput('number', '输出步长:', 'iptStep', null, null, 72, 1);
    var domZero = fzDOM.createLabelInput('checkbox', '首位补零:', 'chkZero', null, null);

    fzDOM.addUI(frmGenerateNumber,
        fzDOM.addUI(fzDOM.dom('frmGenerateNumber-item'),
            domStart.label, domStart.input
        ),
        fzDOM.addUI(fzDOM.dom('frmGenerateNumber-item'),
            domEnd.label, domEnd.input
        ),
        fzDOM.addUI(fzDOM.dom('frmGenerateNumber-item'),
            domStep.label, domStep.input
        ),
        fzDOM.addUI(fzDOM.dom('frmGenerateNumber-item'),
            domZero.input, domZero.label
        )
    );
    new XDialog({
        title: '生成数字序列',
        prompt: '设置参数',
        content: frmGenerateNumber,
        fnOK: go
    }).show(function() {
        fzDOM.setFocus('txtNumStart');
    });

    function go() {
        var nStart = fzDOM.getLong('txtNumStart'),
            nEnd = fzDOM.getLong('txtNumEnd'),
            nStep = fzDOM.getLong('iptStep'),
            bZero = fzDOM.get('chkZero').checked,
            ret = [];

        for (var i = nStart; i <= nEnd; i += nStep) {
            ret.push(i);
        }
        if (bZero) {
            var nLen = String(ret.length).length;
            ret = fzArray.each(ret, function(x) {
                return fzString.zeroize(x, nLen);
            });
        }
        setSource(ret, 'txtArray1');
        return true;
    }
}

//1.5.1
//2021/02/07/ 12:32:04
function generateCitySerial() {
    var cities = {
        "云南": ["昆明", "曲靖", "玉溪", "保山", "昭通", "丽江", "普洱", "临沧", "楚雄", "红河", "文山", "版纳", "大理", "德宏", "怒江", "迪庆"]
    };
    var arr = cities["云南"];
    setResult(arr);
}

var 字符串截取;

function cutStringFirst() {
    XNumberBox('截取字符串开头的字符', '截取长度', '', function(v) {
        var arr = getArray1();
        var ret = fzArray.each(arr, function(x) {
            if (x.length <= v) {
                return x;
            }
            return x.substr(0, v);
        });
        setResult(ret);
    }, 84, null, 1);
}

function cutStringLast() {
    XNumberBox('截取字符串末尾的字符', '截取长度', '', function(v) {
        var arr = getArray1();
        var ret = fzArray.each(arr, function(x) {
            if (x.length <= v) {
                return x;
            }
            return x.substr(x.length - v);
        });
        setResult(ret);
    }, 84, null, 1);
}

function cutStringMid(menuItem, target, currentTarget) {
    fzDOM.addCSS(['.frmCutStringMid-item { overflow:hidden; margin-bottom:10px; height:24px; }', '.frmCutStringMid-item input, .frmCutStringMid-item label, .frmCutStringMid-item span { float:left; font-size:12px;}', '.frmCutStringMid-item input { margin-right:6px;}', '.frmCutStringMid-item input[type="checkbox"] { margin:6px 6px 0 66px;}', '.frmCutStringMid-item label, .frmCutStringMid-item span { line-height:24px; }', ], null, null, 'cssCutStringMid');

    var frmParams = fzDOM.dom('frmCutStringMid');

    var domStart = fzDOM.createLabelInput('number', '开始位置:', 'txtStart', null, null, 72);
    var domLen = fzDOM.createLabelInput('number', '截取长度:', 'txtLen', null, null, 72);
    var domTip = fzDOM.dom('xinput-tip red', 'p', null, 'xinputTip');

    domStart.input.setAttribute('min', '1');
    domLen.input.setAttribute('min', '1');

    fzDOM.addUI(frmParams, fzDOM.addUI(fzDOM.dom('frmCutStringMid-item'), domStart.label, domStart.input, fzDOM.createDom('span', '从1开始计算')), fzDOM.addUI(fzDOM.dom('frmCutStringMid-item'), domLen.label, domLen.input), domTip);

    new XDialog({
        title: '截取字符串中间的字符',
        prompt: '设置参数',
        content: frmParams,
        fnOK: go
    }).show(function() {
        fzDOM.setFocus('txtStart');
    });

    function go() {
        var arr = getArray1(),
            nStart = fzDOM.getLong('txtStart'),
            nLen = fzDOM.getLong('txtLen');

        if (nStart < 1) {
            domTip.innerText = '开始位置必须大于0';
            return false;
        }

        if (nLen < 1) {
            domTip.innerText = '截取长度必须大于0';
            return false;
        }

        domTip.innerText = '';

        var ret = fzArray.each(arr, function(x) {
            return x.substr(nStart - 1, nLen);
        });

        setResult(ret);
        return true;
    }
}

function cutStringCenter(menuItem, target, currentTarget) {
    fzDOM.addCSS([
        '.frmCutStringCenter-item { overflow:hidden; margin-bottom:10px; height:24px; }',
        '.frmCutStringCenter-item input, .frmCutStringCenter-item label, .frmCutStringCenter-item span { float:left; font-size:12px;}',
        '.frmCutStringCenter-item input { margin-right:6px;}',
        '.frmCutStringCenter-item input[type="checkbox"] { margin:6px 6px 0 66px;}',
        '.frmCutStringCenter-item label, .frmCutStringCenter-item span { line-height:24px; }'
    ], null, null, 'cssCutStringCenter');

    var frmParams = fzDOM.dom('frmCutStringCenter');

    var domStart = fzDOM.createLabelInput('number', '开始位置:', 'txtStart', null, null, 72);
    var domEnd = fzDOM.createLabelInput('number', '结束位置:', 'txtEnd', null, null, 72);
    var domTip = fzDOM.dom('xinput-tip red', 'p', null, 'xinputTip');

    domStart.input.setAttribute('min', '1');
    domEnd.input.setAttribute('min', '0');

    fzDOM.addUI(frmParams,
        fzDOM.addUI(fzDOM.dom('frmCutStringCenter-item'),
            domStart.label,
            domStart.input,
            fzDOM.createDom('span', '从1开始计算')
        ),
        fzDOM.addUI(fzDOM.dom('frmCutStringCenter-item'),
            domEnd.label,
            domEnd.input,
            fzDOM.createDom('span', '从倒数第1个位置开始计算，设为0截取开始位置后的全部字符')
        ), domTip);

    new XDialog({
        title: '截取字符串起始位置之间的字符',
        prompt: '设置参数',
        content: frmParams,
        fnOK: go
    }).show(function() {
        fzDOM.setFocus('txtStart');
    });

    function go() {
        var arr = getArray1(),
            nStart = fzDOM.getLong('txtStart'),
            nEnd = fzDOM.getLong('txtEnd');

        if (nStart < 1) {
            domTip.innerText = '开始位置必须大于0';
            return false;
        }

        if (nEnd < 0) {
            domTip.innerText = '末尾位置必须大于等于0';
            return false;
        }

        domTip.innerText = '';

        var ret = fzArray.each(arr, function(x) {
            return x.substr(nStart - 1, x.length - nStart - nEnd + 1);
        });

        setResult(ret);
        return true;
    }
}

//截取特定字符中间的字符
//V1.5.1
//2021/02/07/ 12:36:30
function cutStringBetween() {
    fzDOM.addCSS([
        '.frmCutStringBetween-item { overflow:hidden; margin-bottom:10px; height:24px; }',
        '.frmCutStringBetween-item input, .frmCutStringBetween-item label, .frmCutStringBetween-item span { float:left; font-size:12px;}',
        '.frmCutStringBetween-item input { margin-right:6px;}',
        '.frmCutStringBetween-item input[type="checkbox"] { margin:6px 6px 0 66px;}',
        '.frmCutStringBetween-item label, .frmCutStringBetween-item span { line-height:24px; }'
    ], null, null, 'frmCutStringBetween');

    var frmParams = fzDOM.dom('frmCutStringBetween');

    var domPrefix = fzDOM.createLabelInput('text', '开始字符:', 'txtPrefix', null, null, 72);
    var domSuffix = fzDOM.createLabelInput('text', '结束字符:', 'txtSuffix', null, null, 72);
    var domTip = fzDOM.dom('xinput-tip red', 'p', null, 'xinputTip');

    domPrefix.input.setAttribute('min', '1');
    domSuffix.input.setAttribute('min', '0');

    fzDOM.addUI(frmParams,
        fzDOM.addUI(fzDOM.dom('frmCutStringBetween-item'),
            domPrefix.label,
            domPrefix.input,
            fzDOM.createDom('span', '留空则从起始位置开始')
        ),
        fzDOM.addUI(fzDOM.dom('frmCutStringBetween-item'),
            domSuffix.label,
            domSuffix.input,
            fzDOM.createDom('span', '留空则截取到末尾')
        ), domTip);

    new XDialog({
        title: '截取字符串中两个指定字符之间的字符',
        prompt: '设置参数',
        content: frmParams,
        fnOK: go
    }).show(function() {
        fzDOM.setFocus('txtPrefix');
    });

    function go() {
        var arr = getArray1(),
            sPrefix = fzDOM.val('txtPrefix'),
            sSuffix = fzDOM.val('txtSuffix');

        domTip.innerText = '';

        var ret = fzArray.each(arr, function(x) {
            return fzString.between(x, sPrefix, sSuffix);
        });

        setResult(ret);
        return true;
    }
}

var 编码转换;

function base64Encoding(menuItem, target, currentTarget) {
    var oTarget;
    if (!currentTarget.tagName || currentTarget.tagName != 'TEXTAREA') {
        oTarget = fzDOM.get('txtArray1');
    } else {
        oTarget = currentTarget;
    }
    var ret = Base64.encode(oTarget.value);
    setResultString(ret);
}

function base64Decoding(menuItem, target, currentTarget) {
    var oTarget;
    //1.5.1 修正从历史记录执行时的bug
    if (!currentTarget || !currentTarget.tagName || currentTarget.tagName != 'TEXTAREA') {
        oTarget = fzDOM.get('txtArray1');
    } else {
        oTarget = currentTarget;
    }
    var ret = Base64.decode(oTarget.value);
    setResultString(ret);
}

function base64DecodingRow(menuItem, target, currentTarget) {
    var oTarget;
    if (!currentTarget.tagName || currentTarget.tagName != 'TEXTAREA') {
        oTarget = fzDOM.get('txtArray1');
    } else {
        oTarget = currentTarget;
    }
    var s = oTarget.value;
    var p = s.split('\n');
    var ret = fzArray.each(p, function(x) {
        return Base64.decode(x);
    });
    setResult(ret);
}

function urlEncoding(menuItem, target, currentTarget) {
    var oTarget;
    if (!currentTarget.tagName || currentTarget.tagName != 'TEXTAREA') {
        oTarget = fzDOM.get('txtArray1');
    } else {
        oTarget = currentTarget;
    }
    var ret = encodeURI(oTarget.value);
    setResultString(ret);
}

function urlDecoding(menuItem, target, currentTarget) {
    var oTarget;
    if (!currentTarget.tagName || currentTarget.tagName != 'TEXTAREA') {
        oTarget = fzDOM.get('txtArray1');
    } else {
        oTarget = currentTarget;
    }
    var ret = decodeURI(oTarget.value);
    setResultString(ret);
}

function uriComponentEncoding(menuItem, target, currentTarget) {
    var oTarget;
    if (!currentTarget.tagName || currentTarget.tagName != 'TEXTAREA') {
        oTarget = fzDOM.get('txtArray1');
    } else {
        oTarget = currentTarget;
    }
    var ret = encodeURIComponent(oTarget.value);
    setResultString(ret);
}

function uriComponentDecoding(menuItem, target, currentTarget) {
    var oTarget;
    if (!currentTarget.tagName || currentTarget.tagName != 'TEXTAREA') {
        oTarget = fzDOM.get('txtArray1');
    } else {
        oTarget = currentTarget;
    }
    var ret = decodeURIComponent(oTarget.value);
    setResultString(ret);
}

function htmlEntityTo(menuItem, target, currentTarget) {
    XAlert('未实现');
}

function htmlEntityFrom(menuItem, target, currentTarget) {
    var oTarget;
    if (!currentTarget.tagName || currentTarget.tagName != 'TEXTAREA') {
        oTarget = fzDOM.get('txtArray1');
    } else {
        oTarget = currentTarget;
    }
    var s = oTarget.value;
    var d = fzDOM.dom('', '', s);
    var ret = d.innerText;
    d = null;
    setResultString(ret);
}

function unicodeEncoding(menuItem, target, currentTarget) {
    var oTarget;
    if (!currentTarget.tagName || currentTarget.tagName != 'TEXTAREA') {
        oTarget = fzDOM.get('txtArray1');
    } else {
        oTarget = currentTarget;
    }
    var ret = unicodeEncode(oTarget.value);
    setResultString(ret);

    function unicodeEncode(s) {
        var ret = [];
        for (var i = 0, l = s.length; i < l; i++) {
            ret[i] = ('00' + s.charCodeAt(i).toString(16)).slice(-4);
        }
        return '\\u' + ret.join('\\u');
    }
}

function unicodeDecoding(menuItem, target, currentTarget) {
    var oTarget;
    if (!currentTarget.tagName || currentTarget.tagName != 'TEXTAREA') {
        oTarget = fzDOM.get('txtArray1');
    } else {
        oTarget = currentTarget;
    }
    var ret = unicodeDecode(oTarget.value);
    setResultString(ret);

    function unicodeDecode(s) {
        if (s.indexOf('\\u') > -1) {
            s = s.replace(/\\u/g, '%u');
        } else {
            if (s.indexOf('\\') > -1) {
                s = s.replace(/\\/g, '%');
            }
            if (s.indexOf('u') > -1) {
                s = s.replace(/u/g, '%u');
            }
        }
        //V1.5.2
        //2021/3/10
        //转义回车换行
        var t = unescape(s);
        t = t.replace(/%u00a/g, '\n');
        return t;;
    }
}

//V1.5.4
//URL参数转JSON
function urlParams2JSON() {
    var arr = getArray1();
    var ret = fzArray.each(arr, function(url) {
        return conv(url);
    });
    setResultString(ret.join(','));

    // function convert() {
    //     var c = {},
    //         l = [],
    //         a = [];
    //     if ((e = (e = m.is(":checked") ? decodeURIComponent(f.val().trim()) : f.val().trim()).replace(/\+/g, " ")).indexOf("?") < 0) {
    //         if (e.indexOf("&") < 0) {
    //             if (e.indexOf("=") < 0){
    //                 return '';
    //             }
    //             (l = e.split("="))[1] = v(l[1]),
    //                 c[l[0]] = l[1]
    //         } else
    //             for (var a = e.split("&"), s = 0; s < a.length; s++)
    //                 (l = a[s].split("="))[1] = v(l[1]),
    //                 c[l[0]] = l[1];
    //     } else if (e.indexOf("?") < e.indexOf("&") && e.indexOf("?") < e.indexOf("=")) {
    //         a = e.substr(e.indexOf("?") + 1).split("&");
    //         for (var u = 0; u < a.length; u++)
    //             (l = [a[u].substr(0, a[u].indexOf("=")), a[u].substr(a[u].indexOf("=") + 1)])[1] = v(l[1]),
    //             c[l[0]] = l[1]
    //     } else if (2 === e.split("?").length && 2 === e.split("=").length)
    //         (a = e.substr(e.indexOf("?") + 1).split("="))[1] = v(a[1]),
    //         c[a[0]] = a[1];
    //     else {
    //         a = e.split("&");
    //         for (var d = 0; d < a.length; d++)
    //             l[0] = a[d].substring(0, a[d].indexOf("=")),
    //             l[1] = a[d].substring(a[d].indexOf("=") + 1),
    //             l[1] = v(l[1]),
    //             c[l[0]] = l[1]
    //     }
    //     return JSON.stringify(c, null, 4);
    // }

    function conv(url) {
        var t = url.split('?');
        if (t.length == 1) {
            return '';
        }
        var params = t[1].split('&');
        var ret = {};
        fzArray.walk(params, function(s) {
            var eIndex = s.indexOf('=');
            if (eIndex > 0) {
                var k = s.substr(0, eIndex);
                var v = s.substr(eIndex + 1);
                ret[k] = jsonv(v);
            }
        });
        return JSON.stringify(ret, null, 4);
    }

    function jsonv(e) {
        return e = function(e) {
            if ("string" == typeof e)
                try {
                    var t = JSON.parse(e);
                    return "object" == typeof t && t;
                } catch (e) {
                    return;
                }
        }(e = "null" === (e = e === parseFloat(e) + "" ? parseFloat(e) : e) || "true" === e || "false" === e ? JSON.parse(e) : e) ? JSON.parse(e) : e;
    }
}

function asciiHexEncoding(menuItem, target, currentTarget) {
    var oTarget;
    if (!currentTarget.tagName || currentTarget.tagName != 'TEXTAREA') {
        oTarget = fzDOM.get('txtArray1');
    } else {
        oTarget = currentTarget;
    }
    var s = oTarget.value;
    var r = fzArray.each(s, function(x) {
        return x.charCodeAt(0).toString(16);
    });
    setResultString(r.join(' '));
}

function asciiDecEncoding(menuItem, target, currentTarget) {
    var oTarget;
    if (!currentTarget.tagName || currentTarget.tagName != 'TEXTAREA') {
        oTarget = fzDOM.get('txtArray1');
    } else {
        oTarget = currentTarget;
    }
    var s = oTarget.value;
    var r = fzArray.each(s, function(x) {
        return x.charCodeAt(0);
    });
    setResultString(r.join(' '));
}

function quotedPrintableEncode() {
    if (!window.quotedPrintable) {
        fzDOM.addScripts([
            '/lib/quoted-printable/quoted-printable.js',
            '/lib/quoted-printable/utf8.js',
            '/lib/quoted-printable/gbk.js'
        ], go);
    } else {
        go();
    }

    function go() {
        var map = {
            'utf8': encodeUTF8,
            'gbk': encodeGBK
        };
        XDropdownBox('QuotedPrintable编码', '字符编码', ['utf8', 'gbk'], function(charset) {
            var s = fzDOM.val('txtArray1');
            map[charset](s);
        });
    }

    function encodeUTF8(s) {
        try {
            var r = utf8.encode(s);
            var q = quotedPrintable.encode(r);
            setResultString(q);
        } catch (e) {
            XAlert(e, '编码失败', 'alert');
        }
    }

    function encodeGBK(s) {
        XAlert('暂未实现');
        // // try {
        //     var r = GBK.encode(s);
        //     var q = quotedPrintable.encode(r);
        //     // r = GBK.decode(q);
        //     setResultString(q);
        // // } catch (e) {
        // //     XAlert(e, '编码码失败', 'alert');
        // // }
    }
}

function quotedPrintableDecode() {
    if (!window.quotedPrintable) {
        fzDOM.addScripts([
            '/lib/quoted-printable/quoted-printable.js',
            '/lib/quoted-printable/utf8.js',
            '/lib/quoted-printable/gbk.js'
        ], go);
    } else {
        go();
    }

    function go() {
        var map = {
            'utf8': decodeUTF8,
            'gbk': decodeGBK
        };
        XDropdownBox('QuotedPrintable解码', '字符编码', ['utf8', 'gbk'], function(charset) {
            var s = fzDOM.val('txtArray1');
            map[charset](s);
        });
    }

    function decodeUTF8(s) {
        try {
            var q = quotedPrintable.decode(s);
            r = utf8.decode(q);
            setResultString(r);
        } catch (e) {
            XAlert(e, '解码失败', 'alert');
        }
    }

    function decodeGBK(s) {
        try {
            var q = quotedPrintable.decodeAsBytes(s);
            r = GBK.decode(q);
            setResultString(r);
        } catch (e) {
            XAlert(e, '解码失败', 'alert');
        }
    }
}

function md5Encrypt(menuItem, target, currentTarget) {
    var oTarget;
    if (!currentTarget.tagName || currentTarget.tagName != 'TEXTAREA') {
        oTarget = fzDOM.get('txtArray1');
    } else {
        oTarget = currentTarget;
    }
    if (window.CryptoJS) {
        go();
    } else {
        fzDOM.addScripts('/lib/crypto-js/CryptoJs.js', function() {
            go();
        });
    }

    function go() {
        var arr = getArray(oTarget);
        var ret = fzArray.each(arr, function(x) {
            var s = CryptoJS.MD5(x).toString();
            return x + '\t' + s;
        });
        setResult(ret);
        tableView('result', ['原值', 'MD5']);
    }
}

var 拼音;

//拼音首字母
function pinyinFirstLetter() {
    var arr = getArray1();
    var ret = fzArray.each(arr, function(x) {
        return x + '\t' + pinyinUtil.getFirstLetter(x);
    });
    setResult(ret);
    tableView('result', ['汉字', '拼音首字母']);
}
//pinyinUtil.getPinyin(chinese,splitter,withtone,polyphone)
//全拼（不含声调）
function pinyinWithoutTone() {
    var arr = getArray1();
    var ret = fzArray.each(arr, function(x) {
        return x + '\t' + pinyinUtil.getPinyin(x, '', false, false);
    });
    setResult(ret);
    tableView('result', ['汉字', '全拼']);
}

//全拼（带声调）
function pinyinWithTone() {
    var arr = getArray1();
    var ret = fzArray.each(arr, function(x) {
        return x + '\t' + pinyinUtil.getPinyin(x, ' ', true, false);
    });
    setResult(ret);
    tableView('result', ['汉字', '全拼']);
}

//全拼（不含声调，多音字）
function pinyinWithoutTonePoly() {
    var arr = getArray1();
    var ret = fzArray.each(arr, function(x) {
        return x + '\t' + pinyinUtil.getPinyin(x, '', false, true);
    });
    setResult(ret);
    tableView('result', ['汉字', '全拼']);
}

function spellingCheck() {
    if (!window.enDict) {
        $.get(EN_US_DICT, function(e) {
            var p = e.split('\n');
            window.enDict = {};
            fzArray.walk(p, function(s) {
                window.enDict[s.trim()] = '1';
            });
            checkSpelling();
        });
    } else {
        checkSpelling();
    }

    function checkSpelling() {
        var arr = getArray1();

        var ret = fzArray.each(arr, function(a) {
            var s = a.toLowerCase().split(' ');
            var n = 0;
            fzArray.walk(s, function(x) {
                if (window.enDict[x]) {
                    n++;
                }
            });
            return [a, n].join('\t');
        });

        ret.sort(function(a, b) {
            var x = parseInt(a.split('\t')[1]),
                y = parseInt(b.split('\t')[1]);
            return x < y ? 1 : x > y ? -1 : 0;
        });

        setResult(ret);
        tableView('result', ['句子', '单词数量']);
    }
}

function cleanHTMLMark() {
    var arr = getArray1();
    var ret = fzArray.each(arr, function(x) {
        return fzString.cleanHTML(x);
    });
    setResult(ret);
}

var 号码处理;

function mobileLocation() {
    var arr = getArrayWithEmpty('txtArray1');
    _mobileLocation(arr);
}

function mobileLocationFromFile() {
    openLocalFile(function(f) {
        var reader = new FileReader();
        reader.onload = function() {
            var s = this.result;
            var arr = s.split('\n');
            _mobileLocation(arr);
        };
        reader.readAsText(f);
    });
}

function _mobileLocation(sourceArray) {
    if (!window.mobileData) {
        $.get(MOBILE_DATA, function(e) {
            window.mobileData = IS_FILE_PROTOCAL ? JSON.parse(e) : e;
            query(sourceArray, window.mobileData);
        });
    } else {
        query(sourceArray, window.mobileData);
    }

    function query(arr, mobileData) {
        if (arr.length < 1000) {
            var ret = fzArray.each(arr, function(x) {
                if (isEmpty(x)) {
                    return x;
                }
                if (fzValidator.isPhoneNumber(x)) {
                    return x + '\t' + mobileData[x.substr(0, 7)];
                }
                return x + '\t【无效号码】';
            });
            setResult(ret);
            tableView('result', ['手机号', '归属地'], '手机号归属地查询结果');
        } else if (arr.length < 10000) {
            var ldr = new XLoader({
                text: '正在导出结果...'
            }).loading(document.body);
            var data = [
                ['手机号', '归属地']
            ];
            fzArray.walk(arr, function(x) {
                if (isEmpty(x)) {
                    data.push([x, '']);
                }
                if (fzValidator.isPhoneNumber(x)) {
                    data.push([x, mobileData[x.substr(0, 7)]]);
                    return;
                }
                data.push([x, '【无效号码】']);
            });

            exportExcelOnNewFrame(data, '手机号归属地查询结果', 'Sheet1', [15, 35], 12, function() {
                ldr.loaded();
            });
        } else {
            var data = [
                ['手机号,归属地']
            ];
            fzArray.walk(arr, function(x) {
                if (isEmpty(x)) {
                    return;
                }
                x = x.trim();

                if (fzValidator.isPhoneNumber(x)) {
                    data.push([x, mobileData[x.substr(0, 7)]].join(','));
                    return;
                }
                data.push([x, '【无效号码】'].join(','));
            });
            var content = data.join('\n');
            saveShareContent(content, '手机号归属地查询结果.txt');
        }
    }
}

//1.5.2
//手机号国际区号查询
function mobileInternationalCode() {
    var arr = getArrayWithEmpty('txtArray1');
    if (!window.internationalCodeData) {
        $.get(INTERNATIONAL_CODE_DATA, function(e) {
            window.internationalCodeData = IS_FILE_PROTOCAL ? JSON.parse(e) : e;
            query(window.internationalCodeData, arr);
        });
    } else {
        query(window.internationalCodeData, arr);
    }

    function query(data, arr) {
        var ret = fzArray.each(arr, function(p) {
            if (isEmpty(p)) {
                return p;
            }
            var x = p.trim();
            var pn = getPhoneNumber(x);
            var c1 = pn.substr(0, 1);
            var obj1 = data[c1];
            var codelen = obj1.codelen || 2;
            var code = pn.substr(0, codelen);
            var obj = obj1[code];
            var pnData;

            if (isNone(obj)) {
                obj = obj1["default"];
            }

            if (isArray(obj)) {
                pnData = getReturnString(x, obj);
            } else if (isObject(obj)) {
                codelen++;
                code = pn.substr(0, codelen);
                obj = obj[code];
                if (isNone(obj)) {
                    obj = obj["default"];
                } else {
                    if (isArray(obj)) {
                        pnData = getReturnString(x, obj);
                    } else if (isObject(obj)) {
                        codelen++;
                        code = pn.substr(0, codelen);
                        obj = obj[code];
                        if (isNone(obj)) {
                            obj = obj["default"];
                        }
                        if (isArray(obj)) {
                            pnData = getReturnString(x, obj);
                        }
                    }
                }
            }
            if (!pnData) {
                return [x, '【无数据】', '', ''];
            }
            return pnData;
        });
        setResult(ret);
        tableView('result', ['手机号', '所属国家', '所属地区', 'Country'], '国际区号查询结果');
    }

    function getReturnString(x, obj) {
        if (obj.length == 2) {
            return [x, obj[0], '【未知地区】', obj[1]].join('\t');
        } else if (obj.length == 3) {
            return [x, obj[0], obj[1], obj[2]].join('\t');
        }
    }

    function getPhoneNumber(p) {
        var s = p.replace(/[\s\+\(\)\-]/g, '');
        if (s.substr(0, 2) == '00') {
            return s.substr(2);
        }
        return s;
    }
}

function ipLocationFromFile() {
    openLocalFile(function(f) {
        var reader = new FileReader();
        reader.onload = function() {
            var s = this.result;
            var arr = s.split('\n');
            _ipLocation(arr);
        };
        reader.readAsText(f);
    });
}

function ipLocation() {
    var arr = getArray1();
    _ipLocation(arr);
}

function _ipLocation(sourceArray) {
    if (!window.ipData) {
        $.ajax({
            url: IP_DATA,
            cache: true,
            type: 'GET',
            success: function(e) {
                window.ipData = IS_FILE_PROTOCAL ? JSON.parse(e) : e;
                query(sourceArray, window.ipData);
            }
        });
    } else {
        query(sourceArray, window.ipData);
    }

    function query(arr, ipData) {
        if (arr.length < 1000) {
            var ret = fzArray.each(arr, function(ip) {
                ip = ip.trim();
                if (ip.length == 0) {
                    return;
                }
                if (fzValidator.isIP(ip)) {
                    var ipaddr = getIPAddr(ip);
                    return [ip, ipaddr[0] || '未知', ipaddr[1] || '未知', ipaddr[2] == 1 ? '是' : '否'].join('\t');
                }
                return ip + '\t【无效IP地址】\t\t';
            });

            setResult(ret);
            tableView('result', ['IP地址', '归属地', '运营商', '境外'], 'IP归属地查询结果');
        } else if (arr.length < 10000) {
            var ldr = new XLoader({
                text: '正在导出结果...'
            }).loading(document.body);
            var data = [
                ['IP地址', '归属地', '运营商', '境外']
            ];
            fzArray.walk(arr, function(ip) {
                ip = ip.trim();
                if (ip.length == 0) {
                    return;
                }
                if (fzValidator.isIP(ip)) {
                    var ipaddr = getIPAddr(ip);
                    data.push([ip, ipaddr[0] || '未知', ipaddr[1] || '未知', ipaddr[2] == 1 ? '是' : '否']);
                    return;
                }
                data.push([ip, '【无效IP地址】', '', '']);
            });

            exportExcelOnNewFrame(data, 'IP归属地查询结果', 'Sheet1', [15, 35, 20, 5], 12, function() {
                ldr.loaded();
            });
        } else {
            var data = [
                ['IP地址,归属地,运营商,境外']
            ];
            fzArray.walk(arr, function(ip) {
                ip = ip.trim();
                if (ip.length == 0) {
                    return;
                }
                if (fzValidator.isIP(ip)) {
                    var ipaddr = getIPAddr(ip);
                    data.push([ip, ipaddr[0] || '未知', ipaddr[1] || '未知', ipaddr[2] == 1 ? '是' : '否'].join('\t'));
                    return;
                }
                data.push([ip, '【无效IP地址】', '', ''].join(','));
            });
            var content = data.join('\n');
            saveShareContent(content, 'IP归属地查询结果.txt');
        }

        function getIPAddr(ip) {
            var parts = ip.split('.');
            var bpart = parts[0] + '.' + parts[1];
            var dpart = parts[2] + '.' + parts[3];
            var objCPart;
            var nip = ip2int(ip);
            var ipgroup = ipData[bpart];
            var cpart;
            // var cnt = 0;
            //命中b段
            if (ipgroup) {
                objCPart = ipgroup[dpart];
                //命中c段
                if (objCPart) {
                    // console.log('命中c段');
                    return [objCPart[1], objCPart[2], objCPart[3]];
                }
                // objCPart = getCPart(ipgroup, nip);
                //命中b段，没有命中c段，遍历当前b段的所有c段
                for (cpart in ipgroup) {
                    objCPart = ipgroup[cpart];
                    // cnt++;
                    //如果当前c段的最后一个ip大于等于当前ip
                    if (objCPart[0] >= nip) {
                        // console.log('命中b段，遍历' + cnt + '次得到结果');
                        return [objCPart[1], objCPart[2], objCPart[3]];
                    }
                }
            }

            //没有命中b段，看是否命中a段
            var apart = parts[0] + '.0';
            ipgroup = ipData[apart];
            //"1.0.32.175":[16793599,"广东省广州市电信"],
            if (ipgroup) {
                objCPart = ipgroup[dpart];
                //命中当前a段的其中一个c段
                if (objCPart) {
                    // console.log('命中当前a段的其中一个c段');
                    return [objCPart[1], objCPart[2], objCPart[3]];
                }
                for (cpart in ipgroup) {
                    objCPart = ipgroup[cpart];
                    // cnt++;
                    //如果当前c段的最后一个ip大于等于当前ip
                    if (objCPart[0] >= nip) {
                        // console.log('没有命中b段，也没有命中当前a段的c段，遍历' + cnt + '次得到结果');
                        return [objCPart[1], objCPart[2], objCPart[3]];
                    }
                }
            }

            //没有命中a段，在字段中当前a段的所有b段中查找以下条件
            //仅次于当前ip的b值的段
            //从当前ip的b值往前找到第一个在字典中的b段
            var bValue = parseInt(parts[1]);
            for (var i = bValue; i > 0; i--) {
                ipgroup = ipData[parts[0] + '.' + i];
                //如果字典中有这个b段
                if (ipgroup) {
                    for (cpart in ipgroup) {
                        objCPart = ipgroup[cpart];
                        // cnt++;

                        //如果当前c段的最后一个ip大于等于当前ip
                        if (objCPart[0] >= nip) {
                            // console.log('没有命中a段，IP:' + ip + '遍历' + cnt + '次得到结果');
                            return [objCPart[1], objCPart[2], objCPart[3]];
                        }
                    }
                }
            }

            //看是否为保留地址
            var aValue = parseInt(parts[0]);
            if (aValue > 224) {
                return ['【保留地址】', '', '否'];
            }

            //如果不是保留地址，说明是在一个大的a段里
            //
            for (i = aValue - 1; i > 0; i--) {
                ipgroup = ipData[i + '.0'];
                if (ipgroup) {
                    for (cpart in ipgroup) {
                        objCPart = ipgroup[cpart];
                        if (objCPart[0] > nip) {
                            return [objCPart[1], objCPart[2], objCPart[3]];
                        }
                    }
                }
            }

            return ['【无结果】', '', ''];
        }
    }
}

function makeVCard() {
    var a = getArray1();
    var s = a[0];
    var startsWithPhone = false;
    var hasEmptyName = false;
    var emptyNameFill = 0;
    if (s.match(/^[\+\d]/)) {
        startsWithPhone = true;
    }
    var index_name, index_phone;
    if (startsWithPhone) {
        index_name = 1;
        index_phone = 0;
    } else {
        index_name = 0;
        index_phone = 1;
    }

    fzArray.walkWhile(a, function(x) {
        var t = x.split('\t');
        if (t.length == 1 || t[index_name].length == 0) {
            hasEmptyName = true;
            XChooseBox('生成VCard文件', '选择如何处理无姓名的号码', ['1:随机生成', '2:使用手机号'], function(v) {
                emptyNameFill = v;
                go(emptyNameFill);
            });
            return true;
        }
    }, true);

    if (!hasEmptyName) {
        go();
    }

    function go(fillType) {
        var sTemplate = 'BEGIN:VCARD{2}VERSION:3.0{2}N:;{1}{0};;;{2}FN: {1}{0}{2}TEL;CELL:{1}{2}END:VCARD';
        var ret = fzArray.each(a, function(x) {
            var t = x.split('\t');
            var name, phone;
            if (t.length == 2) {
                name = t[index_name];
                phone = t[index_phone];
            }
            if (t.length == 1) {
                phone = t[0];
                if (fillType == 1) {
                    name = fzRandom.name();
                } else {
                    name = phone;
                }
            }
            return fzString.format(sTemplate, name, phone, String.fromCharCode(10));
        });
        console.log(ret);
        var content = ret.join('\n');
        saveShareContent(content, 'contact.vcf');
    }
}

function getCarLocation() {
    if (!window.carData) {
        $.get(CARNUMBER_DATA, function(e) {
            window.carData = IS_FILE_PROTOCAL ? JSON.parse(e) : e;
            query(window.carData);
        });
    } else {
        query(window.carData);
    }

    function query(carData) {
        var arr = getArrayWithEmpty('txtArray1');
        var ret = fzArray.each(arr, function(x) {
            if (isEmpty(x)) {
                return x;
            }
            var s = x.replace('-', '').toUpperCase();
            if (s.length !== 7) {
                return x + '\t【无效车牌号】';
            }

            var p = x.substr(0, 1);
            var n = x.substr(1, 1);
            var m = fzString.Right(x, 5);
            var carRegExp = /^[0-9A-HJ-NP-Z]{5}$/;
            if (!carRegExp.test(m)) {
                return x + '\t【无效车牌号】';
            }
            var obj = carData[p];
            if (!obj) {
                return x + '\t【无效车牌号】';
            }
            if (n == 'O') {
                return x + '\t民用号牌警用专段';
            }
            var city = obj.d[n];
            if (city === undefined) {
                return x + '\t【无效车牌号】';
            }
            var prov = obj.n;

            return x + '\t' + prov + city;
        });
        setResult(ret);
        tableView('result', ['车牌号', '归属地'], '车牌号归属地查询结果');
    }
}

function getBankLocationFromFile() {
    openLocalFile(function(f) {
        var reader = new FileReader();
        reader.onload = function() {
            var s = this.result;
            var arr = s.split('\n');
            _getBankLocation(arr);
        };
        reader.readAsText(f);
    });
}

function getBankLocation() {
    var arr = getArrayWithEmpty('txtArray1');
    _getBankLocation(arr);
}

//v.1.4.0
//获取银行卡归属地
function _getBankLocation(sourceArray) {
    if (!window.bankData) {
        $.get(BANK_DATA, function(e) {
            window.bankData = IS_FILE_PROTOCAL ? JSON.parse(e) : e;
            query(window.bankData, sourceArray);
        });
    } else {
        query(window.bankData, sourceArray);
    }

    function queryItem(account, items, codelen, regionData) {
        var result = [
            account, //0 银行卡号
            '', //1 开户行
            '', //2 银行卡名称
            '', //3 卡种
            '', //4 属地
            '否' //5 不支持ATM
        ];

        //获取银行代码对应的银行卡基本信息
        var bankCode = account.substr(0, codelen);
        var objCard = items[bankCode];
        if (isEmpty(objCard)) {
            return;
        }

        result[1] = objCard[0];
        result[2] = objCard[1];
        result[3] = objCard[2];

        if (objCard.length == 4) {
            result[5] = '是';
        }

        //获取属地信息
        var objBankRegion = regionData[result[1]];
        if (isEmpty(objBankRegion)) {
            result[4] = '【无当前银行属地数据】';
            return result;
        }

        var subcode;
        var subcodelen = objBankRegion.code;
        if (subcodelen == 34) {
            subcode = account.substr(6, 3) || account.substr(6, 4);
        } else {
            subcode = account.substr(6, subcodelen);
        }
        result[4] = objBankRegion[subcode] || '【无属地数据】';
        return result;
    }

    function queryBankcard(bankcard, regionData) {
        var accountLen = bankcard.length;
        var objLenGroup = bankData.bank[accountLen];
        var items;
        var result;

        if (isArray(objLenGroup.codelen)) {
            for (var i = 0, l = objLenGroup.codelen.length; i < l; i++) {
                var nLen = objLenGroup.codelen[i];
                items = objLenGroup.items[nLen];
                result = queryItem(bankcard, items, nLen, regionData);
                if (result) {
                    break;
                }
            }
        } else {
            items = objLenGroup.items;
            result = queryItem(bankcard, items, objLenGroup.codelen, regionData);
        }
        if (!result) {
            return [bankcard, '【无银行BIN数据】', '', '', '', ''];
        }
        return result;
    }

    function query(bankData, arr) {
        var regionData = bankData.region;

        if (arr.length < 1000) {
            var ret = fzArray.each(arr, function(x) {
                if (isEmpty(x)) {
                    return x;
                }
                var bankcard = x.replace(/\s/g, '');
                if (!fzValidator.isBankcard(bankcard)) {
                    return [bankcard, '【无效银行卡号】', '', '', '', ''].join('\t');
                }

                var result = queryBankcard(bankcard, regionData);
                return result.join('\t');
            });
            setResult(ret);
            tableView('result', ['银行卡号', '开户行', '银行卡名称', '卡种', '属地', '不支持ATM'], '银行卡号查询结果');
        } else if (arr.length < 10000) {
            var ldr = new XLoader({
                text: '正在导出结果...'
            }).loading(document.body);

            var data = [
                ['银行卡号', '开户行', '银行卡名称', '卡种', '属地', '不支持ATM']
            ];
            fzArray.walk(arr, function(s) {
                var bankcard = s.replace(/\s/g, '');
                if (fzValidator.isBankcard(bankcard)) {
                    data.push(queryBankcard(bankcard, regionData));
                } else {
                    data.push([bankcard, '【无效银行卡号】', '', '', '', '']);
                }
            });
            exportExcelOnNewFrame(data, '银行卡号查询结果', 'Sheet1', [20, 20, 20, 8, 25, 8], 10, function() {
                ldr.loaded();
            });
        } else {
            var data = [
                ['银行卡号,开户行,银行卡名称,卡种,属地,不支持ATM']
            ];
            fzArray.walk(arr, function(s) {
                var bankcard = s.replace(/\s/g, '');
                if (fzValidator.isBankcard(bankcard)) {
                    data.push(queryBankcard(bankcard, regionData).join(','));
                } else {
                    data.push([bankcard, '【无效银行卡号】', '', '', '', ''].join(','));
                }
            });

            var content = data.join('\n');
            saveShareContent(content, '银行卡号查询结果.txt');
        }
    }
}


function getSMSProvider() {
    if (!window.smsProviderData) {
        $.get(SMSPROVIDER_DATA, function(e) {
            window.smsProviderData = IS_FILE_PROTOCAL ? JSON.parse(e) : e;
            query(window.smsProviderData);
        });
    } else {
        query(window.smsProviderData);
    }

    function query(smsProviderData) {
        var lens = Object.keys(smsProviderData);
        lens = lens.reverse();

        var arr = getArrayWithEmpty('txtArray1');
        var ret = fzArray.each(arr, function(x) {
            if (isEmpty(x)) {
                return x;
            }

            return x + '\t' + queryOne(x, lens, smsProviderData);
        });
        setResult(ret);
    }

    function queryOne(sms, keyLen, data) {
        var n = sms.length;
        var s = '';
        var p = '【无效号码或无数据】';

        for (var i = 0, l = keyLen.length; i < l; i++) {
            var kn = keyLen[i];
            if (n >= kn) {
                s = sms.substr(0, kn);
                p = data[kn][s];
                if (p) {
                    break;
                }
            }
        }
        return p;
    }
}

function checkInvalidIdCard() {
    var arr = getArray('txtArray1'),
        ret = fzArray.each(arr, function(x) {
            return (fzValidator.isIdCard(x) ? '√\t' : '×\t') + x;
        });
    setResult(ret);
}

function filterInvalidIdCard() {
    var arr = getArray('txtArray1'),
        ret = arr.filter(function(x) {
            return !fzValidator.isIdCard(x);
        });

    setResult(ret);
}

function idcard15to18() {
    var arr = getArray('txtArray1'),
        ret = fzArray.each(arr, function(x) {
            if (fzValidator.isIdCard(x)) {
                if (x.length == 15) {
                    return fzString.idCard15To18(x);
                }
                return x;
            }

            return x + ' 无效身份证号';
        });

    setResult(ret);
}

function idcardLocation() {
    console.time('idcardLocation');
    if (!window.idcardData) {
        $.get(IDCARD_DATA, function(e) {
            window.idcardData = IS_FILE_PROTOCAL ? JSON.parse(e) : e;
            query(window.idcardData);
        });
    } else {
        query(window.idcardData);
    }

    function query(idcardData) {
        var arr = getArrayWithEmpty('txtArray1');
        var ret = fzArray.each(arr, function(x) {
            if (isEmpty(x)) {
                return x;
            }
            if (fzValidator.isIdCard(x)) {
                return x + '\t' + idcardData[x.substr(0, 6)];
            }
            return x + '\t【无效身份证号】';
        });
        setResult(ret);
        console.timeEnd('idcardLocation');
    }
}

function idcardGenderAgeLocation() {
    if (!window.idcardData) {
        $.get(IDCARD_DATA, function(e) {
            window.idcardData = IS_FILE_PROTOCAL ? JSON.parse(e) : e;
            query(window.idcardData);
        });
    } else {
        query(window.idcardData);
    }

    function query(idcardData) {
        var arr = getArrayWithEmpty('txtArray1');
        var arr1 = [],
            arr2 = [],
            x, sIdcard, sGender, sAge, sLocation;
        for (var i = 0, l = arr.length; i < l; i++) {
            x = arr[i];
            if (isEmpty(x)) {
                arr1.push(x);
                arr2.push(x);
                continue;
            }
            if (!fzValidator.isIdCard(x)) {
                x = x + '\t【无效身份证号】';
                arr1.push(x);
                arr2.push(x);
                continue;
            }
            if (x.length == 15) {
                sIdcard = fzString.idCard15To18(x);
            } else {
                sIdcard = x;
            }

            sGender = fzString.getGenderByIdcard(sIdcard);
            sAge = fzString.getAgeByIdcard(sIdcard);
            sLocation = idcardData[x.substr(0, 6)];

            arr1.push(x + '\t' + sGender + '\t' + sAge + '\t' + sLocation);
            arr2.push(sGender + '，' + sAge + '岁，身份证号：' + x + '，户籍地：' + sLocation);
        }

        fzDOM.setValue('txtArray2', arr1.join('\n'), true);
        tableView('2', ['身份证号', '性别', '年龄', '属地']);
        setResult(arr2);
    }
}

//V1.5.4
//获取mac地址对应厂商信息
function getMACInfo() {
    if (!window.macOUIData) {
        $.get(MAC_OUI_DATA, function(e) {
            window.macOUIData = IS_FILE_PROTOCAL ? JSON.parse(e) : e;
            query(window.macOUIData);
        });
    } else {
        query(window.macOUIData);
    }

    function query(data) {
        var arr = getArray1();
        var ret = fzArray.each(arr, function(x) {
            if (isEmpty(x)) {
                return x + '\t\t';
            }
            var id = x.replace(/[:-]/g, '').substr(0, 6).toUpperCase();
            var item = data[id];
            if (item) {
                return x + '\t' + item[0] + '\t' + item[1];
            }
            return x + '\t无记录\t';
        });
        setResult(ret);
        tableView('result', ['MAC地址', '厂商', '厂商地址'], 'MAC地址查询结果');
    }
}

//V1.5.4
//查询http状态码
function httpCodeMap() {
    if (!window.httpcodeData) {
        $.get(HTTP_CODE_DATA, function(e) {
            window.httpcodeData = IS_FILE_PROTOCAL ? JSON.parse(e) : e;
            query(window.httpcodeData);
        });
    } else {
        query(window.httpcodeData);
    }

    function query(data) {
        var arr = getArray1();
        var ret;
        if (arr.length) {
            ret = fzArray.each(arr, function(x) {
                return x + '\t' + data[x];
            });
        } else {
            ret = [];
            fzObject.walk(data, function(code, item) {
                ret.push(code + '\t' + item);
            });
        }
        setResult(ret);
        tableView('result', ['状态码', '含义'], 'HTTP状态码');
    }
}

//V1.5.4
//将json按key排序
function sortJSONKeys() {
    var s = getText1();
    try {
        var j = JSON.parse(s);
        var keys = Object.keys(j);
        keys.sort();
        var r = {};
        fzArray.walk(keys, function(k) {
            r[k] = j[k];
        });
        setResultString(JSON.stringify(r, null, 4));
    } catch (e) {
        XAlert(e);
    }
}

var 其他工具;

function makeQRcode(menuItem, target, currentTarget) {
    var oTxt = currentTarget || fzDOM.get("txtArray1");
    var txt = oTxt.value;
    var n = fzString.getByteLength(txt);

    if (n > 2953) {
        return alert('最多支持2953个字节，现有' + n + '个字节');
    }

    var img = fzDOM.get('#divQRcode img');
    if (img) {
        img.remove();
    }

    var windowHeight = window.innerHeight;
    var size = Math.min(windowHeight - 60, 800);

    // try {
    $('#divQRcode').qrcode({
        render: 'image',
        ecLevel: 'L',
        minVersion: 1,
        maxVersion: 40,
        text: txt,
        size: size,
        radius: 0,
        quiet: 3
    });
    var img = fzDOM.get('#divQRcode img');
    img.onload = function() {
        new XMsgbox(
            '推荐支付宝扫描<em class="hint" title="帮助" onclick="showHint(this)"></em>', false,
            fzDOM.get('divQRcode'), false, false, null,
            function() {
                fzDOM.addUI('page', fzDOM.dom(null, null, null, 'divQRcode'));
            }
        );
    };
}

function decodeQRcode() {
    if (!window.qrcode) {
        fzDOM.addScripts([
            "/lib/jsqrcode-master/src/grid",
            "/lib/jsqrcode-master/src/version",
            "/lib/jsqrcode-master/src/detector",
            "/lib/jsqrcode-master/src/formatinf",
            "/lib/jsqrcode-master/src/errorlevel",
            "/lib/jsqrcode-master/src/bitmat",
            "/lib/jsqrcode-master/src/datablock",
            "/lib/jsqrcode-master/src/bmparser",
            "/lib/jsqrcode-master/src/datamask",
            "/lib/jsqrcode-master/src/rsdecoder",
            "/lib/jsqrcode-master/src/gf256poly",
            "/lib/jsqrcode-master/src/gf256",
            "/lib/jsqrcode-master/src/decoder",
            "/lib/jsqrcode-master/src/qrcode",
            "/lib/jsqrcode-master/src/findpat",
            "/lib/jsqrcode-master/src/alignpat",
            "/lib/jsqrcode-master/src/databr"
        ], go);
    } else {
        go();
    }

    function go() {
        openLocalImage(function(f) {
            decodeQRcode(f);
        });
    }

    function decodeQRcode(img) {
        var reader = new FileReader();
        qrcode.callback = function(a) {
            setResultString(a);
        };
        reader.onload = (function(theFile) {
            return function(e) {
                qrcode.decode(e.target.result);
            };
        })(img);
        reader.readAsDataURL(img);
    }
}

function scanQRcode() {
    //1.5.1 localhost不分http和https
    if (document.location.protocol == 'http:' && document.location.hostname != 'localhost') {
        return XAlert('请在https下使用本功能', '提示', 'alert');
    }
    var frm = document.createElement('iframe');
    frm.style.border = 'none';
    frm.style.width = '630px';
    frm.style.height = '630px';
    frm.style.overflow = 'hidden';
    // frm.onload = function() {

    // };
    frm.src = '../lib/jsqrcode-master/qr.html';

    var msgbox = new XMsgbox(
        '请将摄像头对准二维码', false,
        frm, false, false, null,
        function() {
            fzDOM.remove(frm);
        }
    );

    window.scanQRCodeOver = function(data) {
        appendResultString(data);
        msgbox.close();
        window.scanQRCodeOver = null;
    }
}

function base64ToImage() {
    var b = fzDOM.val('txtArray1');
    if (!b) {
        return XAlert('输入base64编码');
    }
    var imgFormat = {
        '/9j/': 'jpg',
        'R0lG': 'gif',
        'iVBO': 'png'
    };
    var imgHeader = b.substr(0, 4);
    var format = imgFormat[imgHeader];
    if (!format) {
        return XAlert('当前数据不是有效的图片base64编码');
    }

    var imgSrc = 'data:image/' + format + ';base64,' + b;
    showImage(imgSrc, b, format);
}

function imageToBase64() {
    openLocalImage(function(f) {
        getBase64(f);
    });

    function getBase64(img) {
        var imgFile = new FileReader();
        imgFile.readAsDataURL(img);

        imgFile.onload = function() {
            var imgData = this.result;
            //base64数据
            var b64Text = fzString.inString(imgData, ',');
            setResultString(b64Text);
        }
    }
}

//V1.5.4
function base64ToFile() {
    var content = getText1();
    var downLink = document.createElement('a');
    downLink.style.display = 'none';
    downLink.download = 'download';
    var blob = Base64.toBlob(content, 'application/octet-stream');
    downLink.href = URL.createObjectURL(blob);
    document.body.appendChild(downLink);
    downLink.click();
    document.body.removeChild(downLink);
}

function openLocalImage(fnCallback) {
    var ipt = fzDOM.get('iptImg');
    if (!ipt) {
        ipt = fzDOM.createInput('file', 'iptImg', null, 'accept=image/png,image/jpeg,image/gif,image/webp,image/bmp');
        ipt.style.display = 'none';
        document.body.appendChild(ipt);
    }
    ipt.onchange = function() {
        fnCallback(this.files[0]);
    };
    ipt.click();
}

function openLocalFile(fnCallback, attrs) {
    attrs = attrs || 'accept=*';
    var ipt = fzDOM.get('iptLocalFile');
    if (!ipt) {
        ipt = fzDOM.createInput('file', 'iptLocalFile', null, attrs);
        ipt.style.display = 'none';
        document.body.appendChild(ipt);
    }
    ipt.onchange = function() {
        fnCallback && fnCallback(this.files[0]);
        document.body.removeChild(this);
    };
    ipt.click();
}

function openLocalFiles(fnCallback, attrs) {
    attrs = attrs || 'accept=*';
    var ipt = fzDOM.get('iptLocalFiles');
    if (!ipt) {
        ipt = fzDOM.createInput('file', 'iptLocalFiles', null, attrs);
        fzDOM.addAttr(ipt, 'multiple');
        ipt.style.display = 'none';
        document.body.appendChild(ipt);
    }
    ipt.onchange = function() {
        fnCallback && fnCallback(this.files);
        document.body.removeChild(this);
    };
    ipt.click();
}

//1.5.1
//读取本地文件
function readLocalFile(fnCallback) {
    openLocalFile(function(f) {
        var reader = new FileReader();
        reader.onload = function() {
            var s = this.result;
            fnCallback(s);
        };
        reader.readAsText(f);
    });
}

//1.5.2
//显示加载的本地文件到文本框中
function showUploadedFile(e) {
    console.log(e);
    var reader = new FileReader();
    reader.onload = function() {
        window.TEXT1 = this.result;
    };
    reader.readAsText(e);
}


function apiCall() {
    var url = fzDOM.val('txtArray1');
    $.get(url, function(e) {
        fzDOM.setValue('txtResult', e);
    });
}

function cssZip() {
    var s = fzDOM.val('txtArray1');
    var n = s.replace(/ {4}/gm, '');
    n = n.replace(/\n\n/gm, '\n');
    n = n.replace(/\{\s/gm, '{');
    n = n.replace(/;\n/gm, ';');
    n = n.replace(/;/gm, '; ');
    n = n.replace(/\{/gm, '{ ');
    n = n.replace(/  /gm, ' ');
    setResultString(n);
}

/**
 * 1.5.1
 * markdown转html
 */
function markdown2HTML() {
    var s = fzDOM.val('txtArray1');
    var c = new Markdown.Converter();
    var n = c.makeHtml(s);
    n = n.replace(/\n\n/gm, '\n');
    setResultString(n);
}

//V1.5.2
//JSON格式化
function formatJSON() {
    var s = fzDOM.val('txtArray1');
    var obj = JSON.parse(s);
    var r = JSON.stringify(obj, null, '  ');
    setResultString(r);
}


//V1.5.4
//合并json文件
function mergeJSONFiles() {
    openLocalFiles(function(fs) {
        var jsons = {};
        fzArray.walk(fs, function(f, index) {
            var reader = new FileReader();
            reader.onload = function() {
                jsons[index] = this.result;
                //全部读取完成
                if (Object.keys(jsons).length == fs.length) {
                    console.log(jsons);
                    merge(jsons);
                }
            };
            reader.readAsText(f);
        });
    }, 'accept=text/plain,application/json');

    function merge(jsons) {
        var ret = {};
        fzObject.walk(jsons, function(key, obj) {
            Object.assign(ret, JSON.parse(obj));
        });
        saveShareContent(JSON.stringify(ret, null, '  '), 'merge.json');
    }
}


//v1.5.2
//下载链接
//TODO
function downloadUrls() {
    var arr = getArray1();
    var res = fzArray.each(arr, function(a) {
        var p = a.split('\t');
        var url = p[0];
        var fn;
        if (p.length == 2) {
            fn = p[1];
        } else {
            var pp = url.split('/')
            fn = pp[pp.length - 1];
        }
        return [fn, '等待下载', '<a download="download" href="' + url + '" target="_blank">' + url + '</a>'].join('\t');
    });
    setResult(res);
    tableView('result', ['文件名', '状态', 'URL']);
    return;
    var tds = fzDOM.queryAll('a', 'tblResult');
    fzArray.each(tds, function(t) {
        t.click();
    });
}

var 日期时间;
const DATE_FORMATS = ['yyyy-MM-dd HH:mm:ss', 'yyyy/MM/dd HH:mm:ss', 'yyyy-MM-dd', 'yyyy/MM/dd', 'yyyyMMddHHmmss', 'yyyyMMdd_HHmmss', 'yyyy年M月d日HH:mm:ss', 'yyyy年M月d日H时m分s秒', 'yyyy年M月d日H时m分', 'yyyy年M月d日'];

function timestampToDatetime() {
    var arr1 = getArray('txtArray1');
    if (!isArray(arr1)) {
        return;
    }
    var sFmt = 'yyyy-MM-dd HH:mm:ss';
    var arr2 = fzArray.each(arr1, function(x) {
        return fzDate.fromTimeStamp(x, sFmt);
    });
    setResult(arr2);
}

function datetimeToTimestamp() {
    XDropdownBox('日期转时间戳', '设置毫秒', ['none:不显示毫秒', 'random:随机生成', '0:用000填充'], go);

    function go(msType) {
        console.log(msType);

        var arr1 = getArray('txtArray1');
        var arr2 = [];
        var i = 0,
            l = arr1.length,
            s, d;

        switch (msType) {
            case 'none':
                for (; i < l; i++) {
                    s = arr1[i];
                    d = fzDate.fromString(s);
                    arr2.push(d.getTime() / 1000);
                }
                break;
            case 'random':
                for (; i < l; i++) {
                    s = arr1[i];
                    d = fzDate.fromString(s);
                    arr2.push((d.getTime() / 1000) + fzString.zeroize(fzRandom.int(999, 0), 3));
                }
                break;
            case '0':
                for (; i < l; i++) {
                    s = arr1[i];
                    d = fzDate.fromString(s);
                    arr2.push(d.getTime());
                }
        }
        setResult(arr2);
    }
}

function formatWeekMonthDayTime() {
    var arr1 = getArray1();
    if (!isArray(arr1)) {
        return;
    }
    var y = new Date().getFullYear();
    var tm = new Date().getMonth();
    var mons = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var ret = fzArray.each(arr1, function(row) {
        var p = row.replace('  ', ' ').replace(',', '').split(' ');
        var m = mons.indexOf(p[1]);
        var sy;
        if (p.length == 5) {
            sy = p[4];
        } else {
            if (m > tm) {
                sy--;
            } else {
                sy = y;
            }
        }

        var sm = fzString.zeroize(m + 1, 2);
        var d = fzString.zeroize(p[2], 2);
        var hm = p[3];
        return sy + '-' + sm + '-' + d + ' ' + hm;
    });
    setResult(ret);
}

function formatMonthDayTime() {
    var arr1 = getArray1();
    if (!isArray(arr1)) {
        return;
    }
    var y = new Date().getFullYear();
    var tm = new Date().getMonth();
    var mons = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var ret = fzArray.each(arr1, function(row) {
        var p = row.replace('  ', ' ').split(' ');
        var m = mons.indexOf(p[0]);
        var sy = y;
        if (p.length == 4) {
            sy = p[3];
        } else {
            if (m > tm) {
                sy--;
            } else {
                sy = y;
            }
        }

        var sm = fzString.zeroize(m + 1, 2);
        var d = fzString.zeroize(p[1], 2);
        var hm = p[2];
        return sy + '-' + sm + '-' + d + ' ' + hm;
    });
    setResult(ret);
}

function formatCSTDatetime() {
    var arr1 = getArray1();
    if (!isArray(arr1)) {
        return;
    }
    var ret = fzArray.each(arr1, function(row) {
        return fzDate.format(new Date(row));
    });
    setResult(ret);
}

//V1.5.2修改
//重新启用该方法
//下拉框改为文本框
function formatdate() {
    var arr1 = getArray1();
    if (!isArray(arr1)) {
        return;
    }

    // TODO 待XDropdownBox的editable实现后改回来
    // new XDropdownBox('时间戳转日期', '输入日期格式', DATE_FORMATS, go, function(v) {
    //     console.log('changed ', v);
    // }, true, 200, 10);

    new XInputbox('时间戳转日期', '输入日期格式', '', go, 140);

    function go(v) {
        var arr2 = fzArray.each(arr1, function(x) {
            return fzDate.format(x, v);
        });
        setResult(arr2);
    }
}

function formatdateAs(target) {
    var arr1 = getArray1();
    if (!isArray(arr1)) {
        return;
    }
    var sFmt = target.title;
    var arr2 = fzArray.each(arr1, function(x) {
        if (fzDate.isDate(x)) {
            return fzDate.format(x, sFmt);
        } else {
            // 1.5.2 支持其他日期格式
            var d = new Date(x);
            return fzDate.format(d, sFmt);
        }
    });
    setResult(arr2);
}


//V1.4.7
function formatTimeToSeconds() {
    var arr = getArray1();
    if (!isArray(arr)) {
        return;
    }

    var ret = fzArray.each(arr, function(x) {
        var p = x.split(':');
        if (p.length == 3) {
            var h = parseInt(p[0]),
                m = parseInt(p[1]),
                s = parseInt(p[2]);
            return h * 3600 + m * 60 + s;
        } else {
            return x;
        }
    });
    setResult(ret);
}

//V1.5.2
//日期 => 星期几
function _formatDateToWeekday(returnType) {
    var fn = {
        'cn': fzDate.getWeekday,
        'en': fzDate.getENWeekday,
        'ens': fzDate.getENWeekdayShort
    } [returnType];

    var arr = getArray1();
    if (!isArray(arr)) {
        return;
    }

    var ret = fzArray.each(arr, function(x) {
        return [x, fn(x)].join('\t');
    });
    setResult(ret);
    tableView('result', ['日期', '星期']);
}

function formatDateToWeekday() {
    _formatDateToWeekday('cn');
}

function formatDateToWeekdayEN() {
    _formatDateToWeekday('en');
}

function formatDateToWeekdayENShort() {
    _formatDateToWeekday('ens');
}

function plusdate() {
    var arr1 = getArray('txtArray1');
    if (!isArray(arr1)) {
        return;
    }
    fzDOM.addCSS([
        '.frmPlusdate-item { overflow:hidden; margin-bottom:10px;}'
    ], null, null, 'cssPlusdate');

    var ddlInterval = new XDropdownList('ddlInterval', {
        options: ['s:秒', 'n:分', 'h:时', 'd:天', 'w:周', 'q:季', 'm:月', 'y:年'],
        width: 84
    });

    var frmPlusdate = fzDOM.dom('frmPlusdate');
    var domCount = fzDOM.createLabelInput('number', '增减数值:', 'iptCount', null, null, 84);
    var ddlFormat = new XDropdownList('ddlFormat', {
        options: DATE_FORMATS,
        width: 200
    });

    fzDOM.addUI(frmPlusdate,
        fzDOM.addUI(fzDOM.dom('frmPlusdate-item'),
            domCount.label, domCount.input,
            fzDOM.dom(null, 'label', '时间单位:', null, 'style=margin-left:12px'),
            ddlInterval.createUI()
        ),
        fzDOM.addUI(fzDOM.dom('frmPlusdate-item'),
            fzDOM.dom(null, 'label', '输出格式:'),
            ddlFormat.createUI()
        )
    );

    new XDialog({
        title: '增减时间量',
        prompt: '设置参数（正数增加,负数减少）',
        content: frmPlusdate,
        fnOK: go
    }).show(function() {
        fzDOM.setFocus('iptCount');
    });

    function go() {
        var nCount = fzDOM.getLong('iptCount'),
            sInterval = ddlInterval.value,
            sFormat = ddlFormat.value;

        var arr2 = fzArray.each(arr1, function(x) {
            return fzDate.format(fzDate.add(sInterval, x, nCount), sFormat);
        });
        return setResult(arr2);
    }
}

var 随机生成器;

function randName() {
    fzDOM.addCSS([
        '.frmRandName div{overflow:hidden; height:32px;}',
        '.frmRandName #iptCount{padding: 0; width: 140px; height: 21px; line-height: 21px;}',
        '.frmRandName #iptGender{width:140px}',
        '.frmRandName span[for="iptGender"]{float:left; font-size:14px; margin-left:6px; width:120px;}'
    ], null, null, 'frmRandName');
    var iptCount = fzDOM.createInput('number', 'iptCount', null, 'max=200000;min=1;value=100'),
        iptGender = fzDOM.createInput('range', 'iptGender', null, 'max=100;min=0;step=5;value=50'),
        spnGender = fzDOM.dom(null, 'span', '%50男，%50女', null, 'for=iptGender');

    iptGender.oninput = function() {
        if (this.value == 0) {
            spnGender.innerText = '仅男性';
        } else if (this.value == 100) {
            spnGender.innerText = '仅女性';
        } else {
            spnGender.innerText = 100 - this.value + '%男，' + this.value + '%女';
        }
    }

    var form = fzDOM.addUI(fzDOM.dom('frmRandName'),
        fzDOM.addUI(fzDOM.dom(), fzDOM.createDom('label', '生成数量:', null, null, 'for=iptCount'), iptCount),
        fzDOM.addUI(fzDOM.dom(), fzDOM.createDom('label', '性别比例:', null, null, 'for=iptGender'), iptGender, spnGender)
    );

    new XDialog({
        title: '生成随机姓名',
        prompt: '配置选项',
        content: form,
        fnOK: function() {
            console.time('randName');

            var count = fzDOM.getLong('iptCount'),
                gender = fzDOM.getLong('iptGender'),
                femaleRate = gender / 100;
            if (fzNumber.isPostiveInt(count)) {
                if (count > 200000) {
                    return XMsgbox('错误', '最多生成200000个', null, 'error', '知道了', function() {
                        return fzDOM.setFocus('iptCount', true);
                    });
                }
                var a = fzArray.generate(count, gen, femaleRate);
                console.timeEnd('randName');
                setResult(a);
            } else {
                return XMsgbox('错误', '数量必须是正整数', null, 'error', '知道了', function() {
                    return fzDOM.setFocus('iptCount', true);
                });
            }
            // dlg.close();
            return true;
        }
    }).show('iptCount');

    function gen(femaleRate) {
        return fzRandom.name(null, femaleRate);
    }
}

function randMD5() {
    simpleRandom('生成随机MD5值', function() {
        return fzRandom.md5(true);
    });
}

function randMac() {
    simpleRandom('生成随机MAC地址', function() {
        return fzRandom.mac(true);
    });
}

//V1.5.4
//真实Mac地址
function randRealMac() {
    if (!window.macOUIData) {
        $.get(MAC_OUI_DATA, function(e) {
            window.macOUIData = IS_FILE_PROTOCAL ? JSON.parse(e) : e;
            go(window.macOUIData);
        });
    } else {
        go(window.macOUIData);
    }

    function go(data) {
        var s6 = Object.keys(data);
        simpleRandom('随机生成真实MAC地址', function() {
            var h = fzRandom.choice(s6);
            var s = 'ABCDEF1234567890';
            var a = [];
            for (var i = 0; i < 6; i += 2) {
                a.push(h.substr(i, 2));
            }
            for (var j = 0; j < 3; j++) {
                a.push(fzRandom.sample(s, 2));
            }
            return a.join('-');
        });
    }
}

function randIP() {
    simpleRandom('生成随机IP地址', function() {
        return fzRandom.ip();
    });
}

function randPassword() {
    simpleRandom('生成随机密码', function() {
        return fzRandom.password(8, 16);
    })
}

function randPhone() {
    simpleRandom('生成随机手机号', function() {
        return fzRandom.phone();
    });
}

function randIdcard() {
    simpleRandom('生成随机身份证号', function() {
        return fzRandom.idcard();
    });
}

function randCarNumber() {
    simpleRandom('生成随机车牌号', function() {
        return fzRandom.carNumber(true);
    });
}

function randDate() {
    simpleRandom('生成随机日期', function() {
        return fzDate.format(fzRandom.datetime(null, new Date(), '1970/1/1'));
    });
}

function randMark() {
    simpleRandom('生成随机分数', function() {
        return fzRandom.mark();
    });
}

function randHeadImg() {
    //1.5.1 修正每次都会请求headimg.txt的bug
    if (window.headImgData) {
        showRandImg(window.headImgData);
    } else {
        $.get('data/headimg.txt', function(str) {
            var data = str.split('\n');
            window.headImgData = data;
            showRandImg(data);
        });
    }

    function showRandImg(data) {
        var filename = fzRandom.choice(data);
        var url = 'data/headimg/' + filename;
        popupImage(url, '随机头像', '随机头像');
    }
}

//1.5.2增加
//随机人像
//2021/03/04 11:25:13
function randPersonPhoto() {
    if (window.personPhotoData) {
        showRandImg(window.personPhotoData);
    } else {
        $.get(PERSON_PHOTO_DATA, function(str) {
            var data = str.split('\n');
            window.personPhotoData = data;
            showRandImg(data);
        });
    }

    function showRandImg(data) {
        var filename = fzRandom.choice(data);
        var url = 'data/person_photo/' + filename;
        popupImage(url, '随机人像', '随机人像');
    }
}

function randUser() {
    simpleRandom('生成随机用户名密码手机号', function() {
        var username = fzRandom.string(fzRandom.int(12, 6)),
            password = fzRandom.password(8, 16),
            phone = fzRandom.phone();
        return [username, password, phone].join('\t');
    }, function() {
        tableView('result', ['用户名', '密码', '手机号']);
    });
}

//随机人名
//1.5.4
//2021/05/01 13:20:04
function randEnUserPassGender() {
    if (!window.ennameData) {
        window.ennameData = {};
        $.get(fzString.format(NAME_DATA, 'surnames'), function(s) {
            window.ennameData["surnames"] = s.split('\n');

            $.get(fzString.format(NAME_DATA, 'male_names'), function(s) {
                window.ennameData["male_names"] = s.split('\n');

                $.get(fzString.format(NAME_DATA, 'female_names'), function(s) {
                    window.ennameData["female_names"] = s.split('\n');
                    go(window.ennameData["surnames"], window.ennameData["male_names"], window.ennameData["female_names"])
                });
            });
        });
    } else {
        go(window.ennameData["surnames"], window.ennameData["male_names"], window.ennameData["female_names"]);
    }

    function go(surnames, male_names, female_names) {
        if (window.personPhotoData) {
            go(window.personPhotoData);
        } else {
            $.get(PERSON_PHOTO_DATA, function(str) {
                var data = str.split('\n');
                window.personPhotoData = data;
                go(data);
            });
        }

        function go(photoList) {
            simpleRandom('生成随机英文用户名密码手机号', function() {
                var surname = fzString.capitalize(fzRandom.choice(surnames)),
                    gender = fzRandom.select2('男', '女'),
                    firstname = fzString.capitalize(fzRandom.choice(gender == '男' ? male_names : female_names)),
                    fullname = fzString.capitalizeWords(firstname + ' ' + surname),
                    username = fzString.capitalize(firstname + surname),
                    password = fzRandom.password(8, 16),
                    photoUrl = 'data/person_photo/' + fzRandom.choice(photoList);
                return [fullname, gender, username, password, photoUrl].join('\t');
            }, function() {
                tableView('result', ['姓名', '性别', '用户名', '密码', '头像']);
                var tdurls = document.querySelectorAll('#tblResult td:last-child');
                fzArray.walk(tdurls, function(td) {
                    td.innerHTML = '<a href="javascript:;" onclick="popupImage(\'' + td.innerText + '\')">点击查看</a>'
                });
            });
        }
    }
}

function simpleRandom(title, fnGenerator, fnSuccess) {
    XNumberBox(title, '输入生成数量', 100, function(x) {
        if (fzNumber.isPostiveInt(x)) {
            if (x > 200000) {
                XMsgbox('错误', '最多生成200000个', null, 'error', '知道了', function() {
                    return fzDOM.setFocus('xinput-text', true);
                });
                return false;
            }
            var a = fzArray.generate(x, fnGenerator);
            setResult(a);
            fzFnc.call(fnSuccess);
            return true;
        } else {
            XMsgbox('错误', '数量必须是正整数', null, 'error', '知道了', function() {
                return fzDOM.setFocus('xinput-text', true);
            });
            return false;
        }
    }, null, 200000);
}

var 数学运算;

function calcPlus() {
    var arr = getArray('txtArray1');

    XNumberBox('批量加', '输入加数，可以为负', '1', function(v) {
        go(v);
        return true;
    });

    function go(v) {
        var vv = Number(v);
        var ret = fzArray.each(arr, function(x) {
            return Number(x) + vv;
        });
        setResult(ret);
    }

}

function calcMultiple() {
    var arr = getArray('txtArray1');

    XNumberBox('批量乘', '输入乘数，可以为负', '1', function(v) {
        go(v);
        return true;
    });

    function go(v) {
        var ret = fzArray.each(arr, function(x) {
            return Number(x) * v;
        });
        setResult(ret);
    }
}

function calcDivide() {
    var arr = getArray('txtArray1');

    XNumberBox('批量除', '输入除数', '1', function(v) {
        if (v == 0) {
            return false;
        }
        go(v);
        return true;
    });

    function go(v) {
        var ret = fzArray.each(arr, function(x) {
            return Number(x) / v;
        });
        setResult(ret);
    }
}

function calcBitAnd() {
    var arr = getArray('txtArray1');

    XInputbox('二进制批量按位与', '输入二进制值', '', function(v) {
        if (v.length == 0) {
            return false;
        }
        go(v);
        return true;
    });

    function go(v) {
        var ret = fzArray.each(arr, function(x) {
            var p = [];
            for (var i = 0, l = x.length; i < l; i++) {
                p.push(x.substr(i, 1) & v.substr(i, 1));
            }
            return p.join('');
        });
        setResult(ret);
    }
}

function calcBitOr() {
    var arr = getArray('txtArray1');

    XInputbox('二进制批量按位或', '输入二进制值', '', function(v) {
        if (v.length == 0) {
            return false;
        }
        go(v);
        return true;
    });

    function go(v) {
        var ret = fzArray.each(arr, function(x) {
            var p = [];
            for (var i = 0, l = x.length; i < l; i++) {
                p.push(x.substr(i, 1) | v.substr(i, 1));
            }
            return p.join('');
        });
        setResult(ret);
    }
}

function calcBitNot() {
    var arr = getArray('txtArray1');

    var ret = fzArray.each(arr, function(x) {
        var p = [];
        for (var i = 0, l = x.length; i < l; i++) {
            p.push(!parseInt(x.substr(i, 1)) ? '1' : '0');
        }
        return p.join('');
    });
    setResult(ret);
}

function calcBitXor() {
    var arr = getArray('txtArray1');

    XInputbox('二进制批量按位异或', '输入二进制值', '', function(v) {
        if (v.length == 0) {
            return false;
        }
        go(v);
        return true;
    });

    function go(v) {
        var ret = fzArray.each(arr, function(x) {
            var p = [];
            for (var i = 0, l = x.length; i < l; i++) {
                p.push(x.substr(i, 1) ^ v.substr(i, 1));
            }
            return p.join('');
        });
        setResult(ret);
    }
}

function calcSum() {
    var arr = getArray('txtArray1');
    var ret = 0;
    fzArray.walk(arr, function(s) {
        fzArray.walk(s.replace(/\s/g, ',').split(','), function(x) {
            if (!isNaN(x)) {
                ret += Number(x);
            }
        });
    });
    setResultString(ret);
}

function calcAvg() {
    var arr = getArray('txtArray1');
    var ret = 0;
    var n = 0;
    fzArray.walk(arr, function(s) {
        fzArray.walk(s.replace(/\s/g, ',').split(','), function(x) {
            if (!isNaN(x)) {
                n++;
                ret += Number(x);
            }
        });
    });
    var avg = ret / n;
    setResultString(avg.toFixed(2));
}

function calcLCM() {
    var s = fzDOM.val('txtArray1');
    var p = s.replace(/\s/g, ',').split(',');
    var nums = fzArray.each(p, function(x) {
        return Number(x);
    });
    var c = nums[0];
    var a, b;

    for (var i = 1, l = nums.length; i < l; i++) {
        a = c;
        b = nums[i];
        if (a == 0 || b == 0) {
            break;
        }
        c = lcm(a, b);

        console.log(a, b, c);
    }
    setResultString(c);

    function lcm(a, b) {
        var m = Math.max(a, b);
        var n = Math.min(a, b);
        var mn = n * m;
        var r = m % n;
        while (r !== 0) {
            m = n;
            n = r;
            r = m % n;
        }
        return mn / n;
    }
}

function calcGCD() {
    var s = fzDOM.val('txtArray1');
    var p = s.replace(/\s/g, ',').split(',');
    var nums = fzArray.each(p, function(x) {
        return Number(x);
    });
    var c = nums[0];
    var a, b;
    for (var i = 1, l = nums.length; i < l; i++) {
        a = c;
        b = nums[i];
        if (a == 0 || b == 0) {
            break;
        }
        c = lcm(a, b);
    }
    setResultString(c);

    function lcm(a, b) {
        var m = Math.max(a, b);
        var n = Math.min(a, b);
        var r = m % n;
        while (r !== 0) {
            m = n;
            n = r;
            r = m % n;
        }
        return n;
    }
}

function calcArrange() {
    _calcArrangeOrCombine('计算排列', function(n, m) {
        var ret = _factorial(n) / _factorial(n - m);
        var s = fzString.format('A({0},{1})={2}', n, m, ret);
        setResultString(s);
    });
}

function calcCombine() {
    _calcArrangeOrCombine('计算组合', function(n, m) {
        var ret = _factorial(n) / (_factorial(m) * _factorial(n - m));
        var s = fzString.format('C({0},{1})={2}', n, m, ret);
        setResultString(s);
    });
}

function _calcArrangeOrCombine(title, callback) {
    fzDOM.addCSS([
        '#xdialogCalc .dlg-item{margin-bottom:10px; overflow:hidden}',
        '#xdialogCalc .dlg-item input{width:80px}'
    ]);
    var div = fzDOM.addUI(
        fzDOM.dom(),
        fzDOM.createLabelInputDiv('number', '共有多少', 'txtTotal', 'dlg-item'),
        fzDOM.createLabelInputDiv('number', '选取多少', 'txtChoose', 'dlg-item'),
        fzDOM.createDom('p', null, 'xinputTip')
    );
    var vld1 = null;
    var vld2 = null;
    var validator1 = {
        msgDefault: '大于1的正整数',
        msgRequired: '大于1的正整数',
        fnCustom: function(v) {
            return Number(v) > 1;
        },
        msgCustom: '总数必须是大于1的正整数'
    };
    var validator2 = {
        msgDefault: '大于1且小于总数的正整数',
        msgRequired: '大于1且小于总数的正整数',
        msgCompare: '选取数不能大于总数',
        compareField: 'txtTotal',
        compareOperator: '<='
    };
    var dlg = new XDialog({
        id: 'xdialogCalc',
        title: title,
        prompt: '输入计算参数',
        content: div,
        fnOK: function() {
            if (vld1.value && vld2.value) {
                var n = parseInt(fzDOM.val('txtTotal')),
                    m = parseInt(fzDOM.val('txtChoose'));
                callback(n, m);
                return true;
            }
        }
    }).show(function() {
        vld1 = new XValidator('txtTotal', null, 'xinputTip', validator1).render();
        vld2 = new XValidator('txtChoose', null, 'xinputTip', validator2).render();
        fzDOM.setFocus('txtTotal');
    });
}

function calcFactorial() {
    var s = fzDOM.val('txtArray1');
    var p = s.replace(/\s/g, ',').split(',');
    var nums = fzArray.each(p, function(x) {
        return Number(x);
    });
    var ret = [];

    for (var i = 0, l = nums.length; i < l; i++) {
        var a = nums[i];
        ret.push(a + '\t' + _factorial(a));
    }
    setResult(ret);
}

function _factorial(n) {
    if (n == 0) {
        return 1;
    }
    var k = 1;
    for (var i = 2; i <= n; i++) {
        k = i * k;
    }
    return k;
}

function factorizationBatch() {
    var s = fzDOM.val('txtArray1');
    var p = s.replace(/\s/g, ',').split(',');
    var nums = fzArray.each(p, function(x) {
        return Number(x);
    });
    var ret = [];

    for (var i = 0, l = nums.length; i < l; i++) {
        var a = nums[i];
        ret.push(a + '\t' + factorization(a));
    }
    setResult(ret);
    tableView('result', ['原数', '分解质因数']);

    function factorization(num) {
        var regex = new RegExp(/^[0-9]*[1-9][0-9]*$/);
        if (num == 1) return "1";
        if (num == 2) return "2";
        if (num == 3) return "3";
        if (num == 4) return "2 * 2";
        var i = 2;
        var handle = num;
        var arr = [],
            res = [];
        while (i < handle) {
            var result = handle / i;
            if (regex.test(result)) {
                arr.push(i);
                i = 2;
                handle = result;
            } else {
                i++;
            }
            if (i === handle - 1) {
                arr.push(handle);
                break;
            }
        }
        for (i = 0; i < arr.length; i++) {
            res.push(arr[i]);
            if (i !== arr.length - 1) {
                res.push(' * ');
            }
        }
        return res.join('');
    }
}

var 数据转换;

//1.5.3
//2021/03/26 14:05:27
//按行计算表达式
function calcByRow() {
    var arr = getArray1();
    var ret = fzArray.each(arr, function(x) {
        var r = eval(x);
        return x + '\t' + r;
    });

    setResult(ret);
    tableView('result', ['表达式', '结果']);
}

//1.5.4
//2021/07/01 09:45:07
//逐行求差值
function listMinus() {
    var arr = getArray1();
    var ret = fzArray.each(arr, function(x, i) {
        return x - arr[i - 1];
    });
    ret[0] = 0;
    setResult(ret);
}

//1.5.2
//整数转中文
function convCNNumber() {
    var s = fzDOM.val('txtArray1');
    var p = s.replace(/\s/g, ',').split(',');
    var ret = fzArray.each(p, function(x) {
        return x + '\t' + fzNumber.toCNNumber(Number(x));
    });

    setResult(ret);
}

function convCNPrice() {
    var s = fzDOM.val('txtArray1');
    var p = s.replace(/\s/g, ',').split(',');
    var nums = fzArray.each(p, function(x) {
        return Number(x);
    });
    var ret = [];

    for (var i = 0, l = nums.length; i < l; i++) {
        var a = nums[i];
        ret.push(a + '\t' + fzNumber.toCNPrice(a));
    }
    setResult(ret);
}

//把一个ip地址转换成数字，
//格式如下： www.xxx.yyy.zzz ''
function ip2int(ip) {
    var num = 0;
    ip = ip.split(".");
    num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3]);
    num = num >>> 0;
    return num;
}

function int2ip(num) {
    var tt = new Array();
    tt[0] = (num >>> 24) >>> 0;
    tt[1] = ((num << 8) >>> 24) >>> 0;
    tt[2] = (num << 16) >>> 24;
    tt[3] = (num << 24) >>> 24;
    str = String(tt[0]) + "." + String(tt[1]) + "." + String(tt[2]) + "." + String(tt[3]);
    return str;
}

function convIP() {
    var arr = getArray('txtArray1');
    var ret = null;
    if (fzValidator.isIP(arr[0])) {
        ret = fzArray.each(arr, ip2int);
    } else if (fzNumber.isPostiveInt(arr[0])) {
        ret = fzArray.each(arr, int2ip);
    }
    setResult(ret);
}

function convRadix() {

    var arr = getArray('txtArray1');
    var selectedIndex = 0;
    var s0;
    var is2 = true;
    var nTestCount = Math.min(arr.length, 10); //测试前10个数据的进制

    //是否十六进制
    for (var i = 0; i < nTestCount; i++) {
        s0 = arr[i].toLowerCase();
        fzArray.walkWhile(s0, function(x) {
            if ('abcdef'.indexOf(x) > -1) {
                selectedIndex = 2;
                return true;
            }
        }, true);
    }

    if (selectedIndex == 0) {
        //是否二进制
        for (i = 0; i < nTestCount; i++) {
            s0 = arr[i];
            fzArray.walk(s0, function(x) {
                if ('23456789'.indexOf(x) > -1) {
                    is2 = false;
                    return true;
                }
            });
        }
        //十进制
        if (is2) {
            selectedIndex = 1;
        }
    }

    var header = ['二进制', '十进制', '十六进制', '八进制', 'ASCII'];
    new XDropdownBox('进制转换', '选择源数值进制', ['10:十进制', '2:二进制', '16:十六进制', '8:八进制', '0:根据标识符识别'], conv, null, null, null, null, null, selectedIndex);

    function conv(base) {
        if (base == 0) {
            convAuto();
        } else {
            convBase(base);
        }
    }

    function convBase(base) {
        var ret = [];
        fzArray.walk(arr, function(x) {
            if (x.startsWith('0x')) {
                x = x.substr(2);
            } else if (x.startsWith('x') || x.startsWith('o') || x.startsWith('d') || x.startsWith('b')) {
                x = x.substr(1);
            }
            var num = bases.fromBase(x, base);
            var x16 = bases.toBase(num, 16).toUpperCase();
            if (x16.length == 1) {
                x16 = '0' + x16;
            }
            var row = [bases.toBase(num, 2), bases.toBase(num, 10), x16, bases.toBase(num, 8), String.fromCharCode(num)].join('\t');
            ret.push(row);
        });
        setResult(ret);
        tableView('result', header);
    }

    function convAuto() {
        var types = {
            "d": 10,
            "x": 16,
            "0x": 16,
            "\\x": 16,
            "o": 8,
            "b": 2
        };
        var ret = fzArray.each(arr, function(x) {
            var t = x.substr(0, 1);
            var v;
            var b = types[t];
            if (!b) {
                t = x.substr(0, 2);
                b = types[t];
                if (b) {
                    v = x.substr(2);
                }
            } else {
                v = x.substr(1);
            }
            var num = parseInt(v, b);
            var row = [bases.toBase(num, 2), bases.toBase(num, 10), bases.toBase(num, 16).toUpperCase(), bases.toBase(num, 8), String.fromCharCode(num)].join('\t');
            return row;
        });

        setResult(ret);
        tableView('result', header);
    }
}

function jsEval(menuItem, target, currentTarget) {
    var s = fzDOM.val(currentTarget || 'txtArray1');
    try {
        var r = eval(s);
        setResultString(r);
    } catch (e) {
        return XMsgbox('执行JS错误', e.message, null, 'error', null, function() {
            return fzDOM.setFocus('txtArray1', true);
        });
    }
}

//v1.5.1
//2021/02/10/ 13:50:10
//已实现自动执行
function repeatLastAction(target) {
    var lastA = fzDOM.get('#historyList a');
    if (lastA) {
        var fn = lastA.getAttribute('action-name');
        var fnc = window[fn];
        fnc(null, null, target);
    }
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
    var dataUrl = canvas.toDataURL("images/" + ext);
    var c = dataUrl.indexOf(',') + 1;
    return dataUrl.substr(c);
}

function saveRemoteImage(url, filename, folder, subfolder, callback) {
    var img = new Image();
    img.onload = function() {
        var b = getBase64Image(this);
        document.body.removeChild(this);
        if (filename) {
            save(b, filename, folder, subfolder, callback);
        } else {
            var p = this.src.split('/');
            var name = p[p.length - 1];
            var pp = name.split('.');
            name = pp[0];
            save(b, name, folder, subfolder, callback);
        }
    };
    img.setAttribute("crossOrigin", 'anonymous');
    img.src = url;
    img.style.display = 'none';
    document.body.appendChild(img);

    function save(imgdata, name, callback) {
        $.post('/asp/savebase64image.asp', {
            data: imgdata,
            name: name,
            folder: folder || '',
            subfolder: subfolder || ''
        }, function(s) {
            console.log(s);
            fzFnc.call(callback, s);
        });
    }
}

function saveTextfile(text, filename, folder, subfolder, callback) {
    $.post('./asp/savepage.asp', {
        data: text,
        name: filename,
        folder: folder || '',
        subfolder: subfolder || ''
    }, function(s) {
        console.log(s);
        fzFnc.call(callback, s);
    });
}

function appendTextfile(text, filename, folder, subfolder, callback) {
    $.post('./asp/savepage.asp?append=1', {
        data: text,
        name: filename,
        folder: folder || '',
        subfolder: subfolder || ''
    }, function(s) {
        console.log(s);
        fzFnc.call(callback, s);
    });
}

var CTF加密;

function fence_decode() {
    var s = fzDOM.val('txtArray1');
    s = s.replace(/\n/g, '');
    var n = s.length;
    // var max_group = Math.ceil(n / 3);
    var max_group = n + 15;
    var ret = [];
    // #fg2ivyo}
    // #l{2s3_o@
    // #aw__rcl

    // #flag{w22_is_v3ry_cool}@@

    // #fg2ivyo}l{2s3_o@aw__rcl@
    for (var i = 2; i < max_group; i++) {
        if (i > n / 2) {
            break;
        }
        ret.push(i + '\t传统型\t' + decode(s, i));
    }

    for (var i = 2; i < max_group; i++) {
        if (i > n / 2) {
            break;
        }
        ret.push(i + '\tW型\t' + decode_w(s, i));
    }

    setResult(ret);
    tableView('result', ['每组字数', '类型', '解密结果']);

    function decode(source, count) {
        var group_len = Math.ceil(source.length / count);
        var group_str = [];
        var j = 0;

        for (var i = 0; i < count; i++) {
            group_str.push(source.substr(j, group_len));
            j += group_len;
        }

        var result = [];
        var g = '';
        j = 0;
        //遍历每组的每个字符
        for (j = 0; j < group_len; j++) {
            //遍历组
            for (i = 0; i < count; i++) {
                g = group_str[i];
                result.push(g.substr(j, 1));
            }
        }
        return result.join('');
    }

    function decode_w(string, numberRails) {
        if (!string || !numberRails) {
            console.log('invalid input');
            return;
        }
        var div = 2 * (numberRails - 2) + 2,
            stringArr = string.split(""),
            len = parseInt(stringArr.length / div),
            remainder = stringArr.length % div,
            splitArr = [],
            tempArr = [],
            result = [];
        for (var i = 0; i < numberRails; i++) {
            splitArr.push(i == 0 || i == numberRails - 1 ? len : 2 * len);
        }
        if (remainder > numberRails) {
            splitArr = splitArr.map(function(num) {
                return num + 1;
            });
            remainder = remainder - numberRails;
            for (var j = numberRails - 2; j >= numberRails - remainder - 1; j--) {
                splitArr[j]++;
            }
        } else {
            for (var j = 0; j < remainder; j++) {
                splitArr[j]++;
            }
        }

        tempArr = splitArr.map(function(len) {
            var ans = stringArr.splice(0, len);
            return ans;
        });
        var float = 0,
            k = 0;

        function lineUp(isAdd) {
            if (k == string.length) {
                return;
            }
            result.push(tempArr[float].shift());
            k++;
            isAdd ? float++ : float--;
            if (float == numberRails) {
                float = float - 2;
                isAdd = false;
            }
            if (float == 0) {
                isAdd = true;
            }
            lineUp(isAdd);
        }

        lineUp(true);
        return result.join("");
    }
}

function morse_decode() {
    var s = fzDOM.val('txtArray1');
    s = s.replace(/\n/g, '');
    var k = {};
    for (var i = 0, l = s.length; i < l; i++) {
        var c = s.substr(i, 1);
        k[c] = k[c] ? k[c]++ : 1;
    }
    var keys = Object.keys(k);
    var keycount = keys.length;
    if (keycount > 4) {
        setResultString('源数据不是摩斯密码');
        return false;
    }
    var ret = [];

    ret.push(['算法1', keys[0], keys[1], keys[2], decode(s, keys[0], keys[1], keys[2])].join('\t'));
    ret.push(['算法1', keys[0], keys[2], keys[1], decode(s, keys[0], keys[2], keys[1])].join('\t'));
    ret.push(['算法1', keys[1], keys[0], keys[2], decode(s, keys[1], keys[0], keys[2])].join('\t'));
    ret.push(['算法1', keys[1], keys[2], keys[0], decode(s, keys[1], keys[2], keys[0])].join('\t'));
    ret.push(['算法1', keys[2], keys[0], keys[1], decode(s, keys[2], keys[0], keys[1])].join('\t'));
    ret.push(['算法1', keys[2], keys[1], keys[0], decode(s, keys[2], keys[1], keys[0])].join('\t'));

    ret.push(['算法2', keys[0], keys[1], keys[2], deMorse(s, keys[0], keys[1], keys[2])].join('\t'));
    ret.push(['算法2', keys[0], keys[2], keys[1], deMorse(s, keys[0], keys[2], keys[1])].join('\t'));
    ret.push(['算法2', keys[1], keys[0], keys[2], deMorse(s, keys[1], keys[0], keys[2])].join('\t'));
    ret.push(['算法2', keys[1], keys[2], keys[0], deMorse(s, keys[1], keys[2], keys[0])].join('\t'));
    ret.push(['算法2', keys[2], keys[0], keys[1], deMorse(s, keys[2], keys[0], keys[1])].join('\t'));
    ret.push(['算法2', keys[2], keys[1], keys[0], deMorse(s, keys[2], keys[1], keys[0])].join('\t'));

    setResult(ret);
    tableView('result', ['算法', '点', '长', '划', '结果']);

    function deMorse(src, dot, dash, div) {
        var space = space || ' ';
        var alpha = "abcdefghijklmnopqrstuvwxyz1234567890.,:'?-()@—。，：|？_（）·\r\n";
        var codeStr = "abxbaaaxbabaxbaaxaxaabaxbbaxaaaaxaaxabbbxbabxabaaxbbxbaxbbbxabbaxbbabxabaxaaaxbxaabxaaabxabbxbaabxbabbxbbaaxabbbbxaabbbxaaabbxaaaabxaaaaaxbaaaaxbbaaaxbbbaaxbbbbaxbbbbbxabababxbbaabbxbbbaaaxabbbbaxaabbaaxbaaaabxbabbabxbabbabxabbabaxbaaabxabababxbbaabbxbbbaaaxabbbbaxaabbaaxbaaaabxbabbabxbabbabxabbabaxaaababxbabab";
        codeStr = codeStr.replace(/x/g, div).replace(/a/g, dot).replace(/b/g, dash);
        var code = codeStr.split(div);

        var rgExp = new RegExp(space, "g");
        var aStrIn = src.replace(rgExp, div).split(div);
        var strOut = "";
        for (var i = 0; i < aStrIn.length; i++) {
            for (var j = 0; j < code.length; j++) {
                if (aStrIn[i] == code[j]) {
                    strOut += alpha.charAt(j);
                    break;
                }
            }
            if (j == code.length && i < aStrIn.length - 1)
                strOut += " ";
        }
        return strOut;
    }

    function decode(source, long, short, space) {
        var p = {
            "0": "e",
            "1": "t",
            "10": "n",
            "11": "m",
            "100": "d",
            "101": "k",
            "110": "g",
            "111": "o",
            "1000": "b",
            "1001": "x",
            "1010": "c",
            "1011": "y",
            "1100": "z",
            "1101": "q",
            "10000": "6",
            "10001": "=",
            "10010": "/",
            "10110": "(",
            "11000": "7",
            "11100": "8",
            "11110": "9",
            "11111": "0",
            "100001": "-",
            "101010": ";",
            "101011": "!",
            "101101": ")",
            "110011": ",",
            "111000": ":",
            "01111": "1",
            "00111": "2",
            "00011": "3",
            "00001": "4",
            "00000": "5",
            "01": "a",
            "0010": "f",
            "0000": "h",
            "00": "i",
            "0111": "j",
            "0100": "l",
            "0110": "p",
            "010": "r",
            "000": "s",
            "001": "u",
            "0001": "v",
            "011": "w",
            "010101": ".",
            "001100": "?",
            "011110": "'",
            "01000": "&",
            "01010": "+",
            "001101": "_",
            "010010": "\"",
            "0001001": "$",
            "011010": "@"
        };

        var t = space || '/',
            o = short || '.',
            a = long || '-';
        return source.split(t).map(function(e) {
            var r, n = e.replace(/\s+/g, "").replace(new RegExp("\\" + o, "g"), "0").replace(new RegExp("\\" + a, "g"), "1"),
                t = p[n];
            return t || (r = n,
                    r = parseInt(r, 2),
                    t = isNaN(r) ? "" : unescape("%u" + r.toString(16))),
                t
        }).join("");
    }
}

function bacon_decode() {
    var s = fzDOM.val('txtArray1');
    s = s.replace(/\n/g, '');
    var k = {};
    for (var i = 0, l = s.length; i < l; i++) {
        var c = s.substr(i, 1);
        k[c] = k[c] ? k[c]++ : 1;
    }
    var keys = Object.keys(k);
    var keycount = keys.length;
    if (keycount > 3) {
        setResultString('源数据不是培根密码');
        return false;
    }

    var ret = [];

    ret.push(['算法1', keys[0], keys[1], decode(s, keys[0], keys[1], 0)].join('\t'));
    ret.push(['算法1', keys[1], keys[0], decode(s, keys[1], keys[0], 0)].join('\t'));
    ret.push(['算法2', keys[0], keys[1], decode(s, keys[0], keys[1], 1)].join('\t'));
    ret.push(['算法2', keys[1], keys[0], decode(s, keys[1], keys[0], 1)].join('\t'));

    setResult(ret);
    tableView('result', ['算法', 'a', 'b', '结果']);

    function decode(str, a, b, style) {
        var dics = [{
            "aaaaa": "A",
            "aaaab": "B",
            "aaaba": "C",
            "aaabb": "D",
            "aabaa": "E",
            "aabab": "F",
            "aabba": "G",
            "aabbb": "H",
            "abaaa": "I",
            "abaab": "J",
            "ababa": "K",
            "ababb": "L",
            "abbaa": "M",
            "abbab": "N",
            "abbba": "O",
            "abbbb": "P",
            "baaaa": "Q",
            "baaab": "R",
            "baaba": "S",
            "baabb": "T",
            "babaa": "U",
            "babab": "V",
            "babba": "W",
            "babbb": "X",
            "bbaaa": "Y",
            "bbaab": "Z"
        }, {
            'aaaaa': 'a',
            'aabba': 'g',
            'abbaa': 'n',
            'baaba': 't',
            'aaaab': 'b',
            'aabbb': 'h',
            'abbab': 'o',
            'baabb': 'u/v',
            'aaaba': 'c',
            'abaaa': 'i/j',
            'abbba': 'p',
            'babaa': 'w',
            'aaabb': 'd',
            'abaab': 'k',
            'abbbb': 'q',
            'babab': 'x',
            'aabaa': 'e',
            'ababa': 'l',
            'baaaa': 'r',
            'babba': 'y',
            'aabab': 'f',
            'ababb': 'm',
            'baaab': 's',
            'babbb': 'z'
        }];
        str = str.replace(new RegExp(a, 'g'), 'a').replace(new RegExp(b, 'g'), 'b');
        var ans = new String;
        var dic = dics[style];
        for (var i = 0, l = str.length; i < l; i += 5) {
            ans += dic[str.slice(i, i + 5)]
        }
        return ans.toLocaleLowerCase();
    }
}

function hex2str() {
    var arr = getArray1();

    var ret = fzArray.each(arr, function(x) {
        return _b16_str(x);
    });

    setResult(ret);
}

function _b16_str(s) {
    var a = [];
    s = s.replace(/\s/g, '');
    for (var i = 0, l = s.length; i < l; i += 2) {
        var t = s.substr(i, 2);
        var n = parseInt(t, 16);
        var c = String.fromCharCode(n);
        a.push(c);
    }
    return a.join('');
}

function binstr_decode() {
    var s = getText1();
    var hexString = bin_to_hex(s);
    var text = _b16_str(hexString);
    setResultString(text);

    function bin_to_hex(str) {
        var hex_array = [{
            key: 0,
            val: "0000"
        }, {
            key: 1,
            val: "0001"
        }, {
            key: 2,
            val: "0010"
        }, {
            key: 3,
            val: "0011"
        }, {
            key: 4,
            val: "0100"
        }, {
            key: 5,
            val: "0101"
        }, {
            key: 6,
            val: "0110"
        }, {
            key: 7,
            val: "0111"
        }, {
            key: 8,
            val: "1000"
        }, {
            key: 9,
            val: "1001"
        }, {
            key: 'a',
            val: "1010"
        }, {
            key: 'b',
            val: "1011"
        }, {
            key: 'c',
            val: "1100"
        }, {
            key: 'd',
            val: "1101"
        }, {
            key: 'e',
            val: "1110"
        }, {
            key: 'f',
            val: "1111"
        }]
        var value = '';
        var list = [];
        if (str.length % 4 !== 0) {
            var a = "0000";
            var b = a.substring(0, 4 - str.length % 4);
            str = b.concat(str);
        }
        while (str.length > 4) {
            list.push(str.substring(0, 4));
            str = str.substring(4);
        }
        list.push(str);
        for (var i = 0, l = list.length; i < l; i++) {
            for (var j = 0, k = hex_array.length; j < k; j++) {
                if (list[i] == hex_array[j].val) {
                    value = value.concat(hex_array[j].key);
                    break;
                }
            }
        }
        return value;
    }
}

function ascii_decode() {
    var s = fzDOM.val('txtArray1');
    s = s.replace(/\n/g, ' ');
    s = s.replace(/,\s/g, ',');
    var sep = s.match(/[^a-fA-F0-9]+/g);
    sep = fzArray.unique(sep);
    if (sep.length > 1) {
        setResultString('源数据中有多种分隔符');
        return;
    }
    sep = sep[0];
    var reg;
    if (sep == '\\') {
        reg = new RegExp('\\\\', 'g');
    } else {
        reg = new RegExp(sep, 'g');
    }

    var u = s.replace(reg, '');
    var style = [];
    if (u.match(/[a-f]/)) {
        style.push(['十六进制', 16]);
    } else {
        style.push(['十进制', 10]);
    }
    if (!u.match(/[89]/)) {
        style.push(['八进制', 8]);
    }
    if (!u.match(/[2-9]/)) {
        style.push(['二进制', 2]);
    }

    var ret = [];

    fzArray.walk(style, function(x) {
        ret.push([x[0], decode(s, sep, x[1])].join('\t'));
    });

    setResult(ret);
    tableView('result', ['进制', '结果']);

    function decode(str, sep, radix) {
        var p = str.split(sep);
        var ret = [];
        fzArray.walk(p, function(x) {
            var i = parseInt(x, radix);
            ret.push(String.fromCharCode(i));
        });

        return ret.join('');
    }
}

function ascii_increase() {
    var p = getText1().split('');
    var ret = [];
    for (var i = -25; i < 26; i++) {
        var r = fzArray.each(p, function(x) {
            return String.fromCharCode(x.charCodeAt(0) + i);
        });
        var s = r.join('');
        ret.push(i + '\t' + s);
    }
    setResult(ret);
    tableView('result', ['增量', '结果']);
}

function ascii_increase2() {
    var p = getText1().split('');
    var ret = [];
    var r = fzArray.each(p, function(x, j) {
        return String.fromCharCode(x.charCodeAt(0) + j + 1);
    });
    var s = r.join('');
    ret.push('+1\t' + s);

    var r = fzArray.each(p, function(x, j) {
        return String.fromCharCode(x.charCodeAt(0) - (j + 1));
    });
    var s = r.join('');
    ret.push('-1\t' + s);

    setResult(ret);
    tableView('result', ['增量', '结果']);
}

function baseSerialDecoding() {
    var s = getText1();
    var ret = [];
    var b32 = Base32.decode(s),
        b58 = Base58.decode(s),
        b64 = Base64.decode(s);
    // ret.push('Base16\t' + Base16.decode(s).replace('\r', ' ').replace('\n', ' '));
    if (b32) {
        ret.push('Base32\t' + b32.replace('\r', ' ').replace('\n', ' '));
    } else {
        ret.push('Base32\t【非Base32编码】');
    }
    // ret.push('Base36\t' + Base36.decode(s).replace('\r', ' ').replace('\n', ' '));
    if (b58) {
        ret.push('Base58\t' + b58.replace('\r', ' ').replace('\n', ' '));
    } else {
        ret.push('Base58\t【非Base58编码】');
    }
    if (b64) {
        ret.push('Base64\t' + b64.replace('\r', ' ').replace('\n', ' '));
    }
    // ret.push('Base62\t' + Base62.decode(s).replace('\r', ' ').replace('\n', ' '));
    // ret.push('Base91\t' + Base91.decode(s).replace('\r', ' ').replace('\n', ' '));
    // ret.push('Base92\t' + Base92.decode(s).replace('\r', ' ').replace('\n', ' '));

    setResult(ret);
    tableView('result', ['编码方式', '解码文本']);
}

function xxencode_decoding() {
    if (!window.XXEncode) {
        fzDOM.addScripts('/lib/ctfencode/xxencode.js', function() {
            go();
        })
    } else {
        go();
    }

    function go() {
        var s = getText1();
        setResultString(XXEncode.decode(s));
    }
}

function uuencode_decoding() {
    if (!window.UUEncode) {
        fzDOM.addScripts('/lib/ctfencode/uuencode.js', function() {
            go();
        })
    } else {
        go();
    }

    function go() {
        var s = getText1();
        setResultString(UUEncode.decode(s));
    }
}

function xor_decoding() {
    var arr = getArray1();
    XNumberBox('异或编码', '输入异或值', '', function(num) {
        var ret = fzArray.each(arr, function(s) {
            return s + '\t' + xorDecode(s, num);
        });
        setResult(ret);
        tableView('result', ['原字符串', '结果']);
    });

    function xorDecode(s, x) {
        var a = fzArray.each(s, function(c) {
            return String.fromCharCode(c.charCodeAt(0) ^ x);
        });
        return a.join('');
    }
}

function power_decode() {
    var s = fzDOM.val('txtArray1');
    s = s.replace(/\n/g, '');
    if (s.match(/[^01248]+/g)) {
        setResultString('源数据可能不是幂数加密');
        return;
    }

    var ret = decode(s, '0');

    setResult([ret, ret.toLowerCase()]);

    function decode(str, sep) {
        var p = str.split(sep);
        var ret = fzArray.each(p, function(x) {
            var sum = 64;
            fzArray.walk(x.split(''), function(n) {
                sum += parseInt(n);
            });
            return String.fromCharCode(sum);
        });

        return ret.join('');
    }
}

function thomasjefferson_decode() {
    var arr = getArray1();
    var src = fzArray.each(arr, function(x) {
        return x.replace('：', ':').split(':')[1].replace(/[<>\s]/g, '');
    });

    var form = fzDOM.addUI(fzDOM.use('fzTJFForm'), fzDOM.createLabelInputDiv('text', '密钥', 'tjf_key', 'xform-item'), fzDOM.createLabelInputDiv('text', '密码', 'tjf_pwd', 'xform-item'), fzDOM.dom('xform-tip red', 'p'));

    fzDOM.addCSS(['#fzTJFForm .xform-item input{width:240px;}'], null, null, 'tjfForm');

    new XDialog({
        title: '转轮密码',
        prompt: '输入转轮密码和密钥，密钥以逗号分隔',
        content: form,
        modal: false,
        fnOK: function() {
            return go();
        }
    }).show(function() {
        fzDOM.setFocus('tjf_key');
    });

    return;

    function go() {
        var keystr = fzDOM.val('tjf_key'),
            pwdstr = fzDOM.val('tjf_pwd');
        console.log(keystr, pwdstr);

        var keyarr = keystr.replace(/\s/g, '').split(',');
        if (keyarr.length !== src.length) {
            fzDOM.html('#fzTJFForm .xform-tip', '密钥长度与源数据长度不一致<br/>源数据[' + src.length + ']，密钥[' + keyarr.length + ']');
            return false;
        }

        var ret = decode(src, keyarr, pwdstr);
        setResult(ret);
        return true;
    }
    // 1:  < ZWAXJGDLUBVIQHKYPNTCRMOSFE <
    // 2:  < KPBELNACZDTRXMJQOYHGVSFUWI <
    // 3:  < BDMAIZVRNSJUWFHTEQGYXPLOCK <
    // 4:  < RPLNDVHGFCUKTEBSXQYIZMJWAO <
    // 5:  < IHFRLABEUOTSGJVDKCPMNZQWXY <
    // 6:  < AMKGHIWPNYCJBFZDRUSLOQXVET <
    // 7:  < GWTHSPYBXIZULVKMRAFDCEONJQ <
    // 8:  < NOZUTWDCVRJLXKISEFAPMYGHBQ <
    // 9:  < XPLTDSRFHENYVUBMCQWAOIKZGJ <
    // 10: < UDNAJFBOWTGVRSCZQKELMXYIHP <
    // 11： < MNBVCXZQWERTPOIUYALSKDJFHG <
    // 12： < LVNCMXZPQOWEIURYTASBKJDFHG <
    // 13： < JZQAWSXCDERFVBGTYHNUMKILOP <

    function decode(srcarr, keyarr, pwd) {
        //按密钥排序
        var mtx = fzArray.each(keyarr, function(key) {
            return srcarr[parseInt(key) - 1];
        });
        //按密码转行
        var i = 0;
        var ret = fzArray.each(mtx, function(row) {
            var p = pwd.substr(i, 1);
            var index = row.indexOf(p);
            var lft = row.substr(0, index);
            var rgt = row.substr(index);
            i++;
            return rgt + lft;
        });
        //输出N种结果
        var len = ret[0].length;
        var result = [];
        for (var i = 0; i < len; i++) {
            result.push(fzArray.each(ret, function(row) {
                return row.substr(i, 1);
            }).join(''));
        }

        return result;
    }
}

function caesar_decode() {
    var s = getText1();
    var ret = enumCaesar(s);
    var result = fzArray.each(ret, function(x, i) {
        return (i + 1) + '\t' + x;
    });

    setResult(result);
    tableView('result', ['位移量', '算法1', '奇增偶减', '偶增奇减']);
    var tbs = fzDOM.queryAll('#tblResult tbody td');
    fzArray.walk(tbs, function(td) {
        var s = td.innerText.toLowerCase();
        if (s.indexOf('flag') > -1 || s.indexOf('ctf') > -1) {
            var tr = td.parentNode;
            tr.style.backgroundColor = '#FFEB3B';
            td.style.color = '#f00';
        }
    });
    // ----------------------------------------------------------
    // 凯撒密码 - 列出所有组合(只限1行明文)
    function enumCaesar(src) {
        var ret = [];
        for (var i = 1; i < 26; i++) {
            ret.push(
                Caesar(src, i) + '\t' + CaesarEven(src, i) + '\t' + CaesarEven(src, -i)
            );
        }
        return ret;
    }

    // 凯撒密码
    function Caesar(strIn, offset) {
        var strOut = "";
        for (var i = 0; i < strIn.length; i++) {
            var c = strIn.charCodeAt(i);
            strOut += charOffset(c, offset);
        }
        return strOut;
    }

    // 凯撒密码 奇偶不同版
    function CaesarEven(strIn, offset) {
        var strOut = "";
        for (var i = 0; i < strIn.length; i++) {
            var c = strIn.charCodeAt(i);
            if (c % 2 == 0) {
                strOut += charOffset(c, offset);
            } else {
                strOut += charOffset(c, -offset);
            }
        }
        return strOut;
    }

    function charOffset(c, offset) {
        if (offset < 0)
            offset += 26;
        if (c > 64 && c < 91)
            // 大写字母
            return String.fromCharCode((c - 65 + offset) % 26 + 65);
        else if (c > 96 && c < 123)
            // 小写字母
            return String.fromCharCode((c - 97 + offset) % 26 + 97);
        else
            return String.fromCharCode(c);
    }

    // ----------------------------------------------------------
    // 凯撒移位(中文版)
    function enCaesarUni() {
        var offset = clamp(oCaesarUniOffset.value, -1000, 1000);
        var strIn = oInput.value;
        var strOut = "",
            nCode;
        for (var i = 0; i < strIn.length; i++) {
            nCode = strIn.charCodeAt(i);
            if (nCode == 13)
                // \r
                strOut += "\r";
            // do nothing
            else if (nCode == 10)
                // \n
                strOut += "\n"
            else if (nCode == 32)
                // space
                strOut += " ";
            else
                strOut += String.fromCharCode(strIn.charCodeAt(i) + offset);
        }
        oInput.value = strOut;
    }

    function deCaesarUni() {
        var offset = -parseInt(oCaesarUniOffset.value);
        oCaesarUniOffset.value = offset;
        enCaesarUni();
        oCaesarUniOffset.value = -offset;
    }

    // 凯撒移位 - 列出所有组合(只限1行明文)
    function Caesar2(strIn, offset) {
        var strOut = "";
        for (var i = 0; i < strIn.length; i++) {
            var c = strIn.charCodeAt(i);
            var k = c + offset;
            if ((k < 32) || (k > 126)) {
                // strOut = '';
                continue;
            }
            strOut += String.fromCharCode(k);
        }
        return strOut;
    }

    function enumCaesarUni(strIn) {
        var min = 127;
        for (var i = 0; i < strIn.length; i++) {
            var c = strIn.charCodeAt(i);
            if (c < min) {
                min = c;
            }
        }
        var strOut = strIn + "\r\n";
        for (var i = 32; i < 127; i++) {
            var k = -min + i;
            var str = Caesar2(strIn, k);
            if ((str != '') && (str != strIn))
                strOut += str + "\r\n";
        }
        oInput.value = strOut;
    }
}


function aes_decrypt() {
    if (window.CryptoJS) {
        go();
    } else {
        fzDOM.addScripts('/lib/crypto-js/CryptoJS.js', go);
    }

    function go() {
        var s = getText1();
        XInputbox('AES解密', '输入密码', '', function(v) {
            decrypt(s, v);
        })
    }

    function decrypt(relcode, pwdkey) {
        var scode = CryptoJS.AES.decrypt(relcode, pwdkey);
        var result = scode.toString(CryptoJS.enc.Utf8);
        setResultString(result);
    }
}

//1.5.4新增
function tripleDes_decrypt() {
    if (window.CryptoJS.TripleDES) {
        go();
    } else {
        fzDOM.addScripts([
            '/lib/crypto-js/components/mode-ecb-min.js',
            '/lib/crypto-js/components/mode-ctr-min.js',
            '/lib/crypto-js/components/mode-ofb-min.js',
            '/lib/crypto-js/components/mode-cfb-min.js',
            '/lib/crypto-js/components/pad-ansix923-min.js',
            '/lib/crypto-js/components/pad-iso10126-min.js',
            '/lib/crypto-js/components/pad-iso97971-min.js',
            '/lib/crypto-js/components/pad-nopadding-min.js',
            '/lib/crypto-js/components/pad-zeropadding-min.js',
            '/lib/crypto-js/tripledes.js'
        ], go);
    }

    function go() {
        fzDOM.addCSS([
            '.frmTripleDes-item { overflow:hidden; margin-bottom:10px; height:26px; }',
            '.frmTripleDes-item input, .frmTripleDes-item label{float:left; font-size:14px;}',
            '.frmTripleDes-item input{margin-right:6px;}',
            '.frmTripleDes-item label { line-height:24px; width:112px;}',
            '.frmTripleDes-item label.lblTripleDesSaveSettings {margin-left:120px;}',
            '#chkTripleDesSaveSettings{margin-top:5px}'
        ], null, null, 'cssTripleDes');

        //TODO：支持其他加密模式
        var modeEnum = {
            'cbc': CryptoJS.mode.CBC,
            'ecb': CryptoJS.mode.ECB,
            'ctr': CryptoJS.mode.CTR,
            'ofb': CryptoJS.mode.OFB,
            'cfb': CryptoJS.mode.CFB
        };
        //TODO：支持其他padding模式
        var paddingEnum = {
            'pkcs5padding': CryptoJS.pad.Pkcs7,
            'pkcs7padding': CryptoJS.pad.Pkcs7,
            'zeropadding': CryptoJS.pad.ZeroPadding,
            'iso10126': CryptoJS.pad.Iso10126,
            'iso97971': CryptoJS.pad.Iso97971,
            'ansix923': CryptoJS.pad.AnsiX923,
            'no-padding': CryptoJS.pad.NoPadding
        };
        //TODO：解决encoding可选问题
        var encodingEnum = {
            'base64': CryptoJS.enc.Utf8,
            'hex': CryptoJS.enc.Utf8
        };
        //TODO：解决charset可选问题
        var charsetEnum = {
            'utf-8': CryptoJS.enc.Utf8,
            'gb2312': CryptoJS.enc.Utf8,
            'gbk': CryptoJS.enc.Utf8,
            'gb18030': CryptoJS.enc.Utf8,
            'iso-8859-1': CryptoJS.enc.Utf8
        };

        var defaultsString = localStorage["TripleDes_Settings"];
        var defaults = defaultsString ? JSON.parse(defaultsString) : null;
        console.log(defaults.mode);
        var ddlTripleDesMode = new XDropdownList('ddlTripleDesMode', {
            options: Object.keys(modeEnum),
            fontSize: 14,
            value: defaults && defaults.mode,
            onchange: function(v) {
                if (v == 'ecb') {
                    fzDOM.disable('iptTripleDesIV');
                } else {
                    fzDOM.enable('iptTripleDesIV');
                }
            }
        });
        var ddlTripleDesPadding = new XDropdownList('ddlTripleDesPadding', {
            options: Object.keys(paddingEnum),
            fontSize: 14,
            value: defaults && defaults.padding
        });
        var iptTripleDesSecret = fzDOM.createInput('text', 'iptTripleDesSecret', null, null, 280, defaults && defaults.secret);
        var ivDisable = (defaults && defaults.mode == 'ecb') ? 'disabled=disabled' : null;
        var iptTripleDesIV = fzDOM.createInput('text', 'iptTripleDesIV', null, ivDisable, 80, defaults && defaults.iv);
        var ddlTripleDesEncoding = new XDropdownList('ddlTripleDesEncoding', {
            options: Object.keys(encodingEnum),
            fontSize: 14,
            value: defaults && defaults.encoding
        });
        var ddlTripleDesCharset = new XDropdownList('ddlTripleDesCharset', {
            options: Object.keys(charsetEnum),
            fontSize: 14,
            width: 180,
            value: defaults && defaults.charset
        });

        var form = fzDOM.addUI(fzDOM.dom('frmTripleDes'),
            fzDOM.addUI(fzDOM.dom('frmTripleDes-item'), fzDOM.createDom('label', '加密模式(Mode):', null, null, 'for=ddlTripleDesMode'), ddlTripleDesMode.createUI()),
            fzDOM.addUI(fzDOM.dom('frmTripleDes-item'), fzDOM.createDom('label', '填充(Padding):', null, null, 'for=ddlTripleDesPadding'), ddlTripleDesPadding.createUI()),
            fzDOM.addUI(fzDOM.dom('frmTripleDes-item'), fzDOM.createDom('label', '密码(Secret):', null, null, 'for=iptTripleDesSecret'), iptTripleDesSecret),
            fzDOM.addUI(fzDOM.dom('frmTripleDes-item'), fzDOM.createDom('label', '偏移量(iv):', null, null, 'for=iptTripleDesIV'), iptTripleDesIV),
            fzDOM.addUI(fzDOM.dom('frmTripleDes-item'), fzDOM.createDom('label', '编码(encoding):', null, null, 'for=ddlTripleDesEncoding'), ddlTripleDesEncoding.createUI()),
            fzDOM.addUI(fzDOM.dom('frmTripleDes-item'), fzDOM.createDom('label', '字符集(charset):', null, null, 'for=ddlTripleDesCharset'), ddlTripleDesCharset.createUI()),
            fzDOM.addUI(fzDOM.dom('frmTripleDes-item'), fzDOM.createCheckLabel('保存当前设置', 'chkTripleDesSaveSettings', null, 'lblTripleDesSaveSettings', defaults))
        );

        var d = new XDialog({
            title: 'TripleDES解密',
            prompt: '填写配置信息',
            content: form,
            defaultBtn: 'ok',
            fnOK: function() {
                var modeValue = ddlTripleDesMode.value;
                var paddingValue = ddlTripleDesPadding.value;
                var encodingValue = ddlTripleDesEncoding.value;
                var charsetValue = ddlTripleDesCharset.value;

                var mode = modeEnum[modeValue];
                var padding = paddingEnum[paddingValue];
                var secret = iptTripleDesSecret.value;
                var iv = iptTripleDesIV.value;
                var encoding = encodingEnum[encodingValue];
                var charset = charsetEnum[charsetValue];

                decrypt(mode, padding, secret, iv, encoding, charset);

                //保存设置
                if (chkTripleDesSaveSettings.checked) {
                    var settings = {
                        mode: modeValue,
                        padding: paddingValue,
                        secret: secret,
                        iv: iv,
                        encoding: encodingValue,
                        charset: charsetValue
                    };
                    localStorage["TripleDes_Settings"] = JSON.stringify(settings);
                } else {
                    localStorage["TripleDes_Settings"] = '';
                }
                return true;
            }
        });
        d.show('iptTripleDesSecret');
    }

    function decrypt(mode, padding, secret, iv, encoding, charset) {
        var arr = getArray1();
        var ret = fzArray.each(arr, function(password) {
            return password + '\t' + decryptOne(password, mode, padding, secret, iv, encoding, charset);
        });
        setResult(ret);
        tableView('result', ['密码', '明文'], 'TripleDES解密');
    }

    function decryptOne(password, mode, padding, secret, iv, encoding, charset) {
        var ckey = encoding.parse(secret);
        var civ = encoding.parse(iv);

        try {
            return CryptoJS.TripleDES.decrypt(password, ckey, {
                iv: civ,
                mode: mode, //可省略
                padding: padding //可省略,
            }).toString(charset);
        } catch (err) {
            return err;
        }
    }
}

//1.5.4新增
function bcryptEncrypt() {
    if (!window.BCrypt) {
        fzDOM.addScripts('/lib/bcrypt/bcrypt.js', go);
    } else {
        go();
    }

    function go() {
        var arr = getArray1();

        var ret = fzArray.each(arr, function(a) {
            return a + '\t' + '计算中...';
        });
        setResult(ret);
        tableView('result', ['明文', '密文'], 'BCrypt加密结果', function(trs) {
            console.log(trs);
            fzArray.walk(trs, function(tr) {
                var td1 = tr.cells[0];
                var password = td1.innerText;
                var td2 = tr.cells[1];
                var bc = new BCrypt;
                bc.encrypt(password, 10, function(hash) {
                    console.log(password, hash);
                    td2.innerText = hash;
                });
            });
        });
    }
}

//给定多组bCrypt密文，校验一个密码
function bcryptCheckEncryptedToPlaintext() {
    if (!window.BCrypt) {
        fzDOM.addScripts('/lib/bcrypt/bcrypt.js', go);
    } else {
        go();
    }

    function go() {
        XInputbox('bcrypt校验', '在下方输入明文，校验是否与数据1中的bcrypt密文相匹配', null, function(pwd) {
            docheck(pwd);
        }, 340);

        function docheck(pwd) {
            var arr = getArray1();
            var ret = fzArray.each(arr, function(a) {
                return '校验中...\t' + pwd + '\t' + a;
            });
            setResult(ret);
            tableView('result', ['校验结果', '明文', '密文'], 'BCrypt密码校验结果', function(rows) {
                fzArray.walk(rows, function(tr) {
                    var td1 = tr.cells[0],
                        hash = tr.cells[2].innerText;

                    var bc = new BCrypt;
                    bc.checkpw(pwd, hash, function(result) {
                        td1.innerText = result ? '√' : '×';
                    });
                });
            });
        }
    }
}

function bcryptCheckPlaintextToEncrypted() {
    if (!window.BCrypt) {
        fzDOM.addScripts('/lib/bcrypt/bcrypt.js', go);
    } else {
        go();
    }

    function go() {
        XInputbox('bcrypt校验', '以数据1作为字典，爆破下方输入的bcrypt密文', null, function(hashed) {
            docheck(hashed);
        }, 540);

        function docheck(hashed) {
            var arr = getArray1();
            var ret = fzArray.each(arr, function(a) {
                return '校验中...\t' + a + '\t' + hashed;
            });
            setResult(ret);
            tableView('result', ['校验结果', '明文', '密文'], 'BCrypt爆破结果', function(rows) {
                fzArray.walk(rows, function(tr) {
                    var td1 = tr.cells[0],
                        text = tr.cells[1].innerText;

                    var bc = new BCrypt;
                    bc.checkpw(text, hashed, function(result) {
                        td1.innerText = result ? '√' : '×';
                    });
                });
            });
        }
    }
}

//V1.5.4
//异或解密
function xor_decryptHexString() {
    XInputbox('异或解密', '对于数据1中的十六进制数值进行异或解密（自动忽略多余的空格）<br/>输入异或密钥:', '', function(xorBy) {
        var s = getText1();
        s = s.replace(/\s{2,}/g, ' ');
        var hexes = s.split(' ');
        var xorLen = xorBy.length;
        var ret = [];
        var arrXor = [];
        for (var u = 0; u < xorBy.length; u++) {
            arrXor.push(xorBy.charCodeAt(u));
        }
        console.log(arrXor);

        for (var i = 0, l = hexes.length; i < l; i += xorLen) {
            for (var k = 0; k < xorLen; k++) {
                var c = hexes[i + k];
                var h = parseInt(c, 16);
                var r = h ^ arrXor[k];
                var x16 = bases.toBase(r, 16).toUpperCase();
                if (x16.length == 1) {
                    x16 = '0' + x16;
                }
                ret.push(x16);
            }
        }

        setResultString(ret.join(' '));
    });
}

//V1.5.4
function xor_decryptLocalFile() {
    fzDOM.addCSS([
        '.xor_decryptLocalFile_form .xform-item{margin-bottom:12px;}'
    ], null, null, 'xor_decryptLocalFile_form');

    var form = fzDOM.addUI(
        fzDOM.createDom('div', null, null, 'xor_decryptLocalFile_form'),
        fzDOM.createRadioList(['str:字符串', 'dec:十进制数（多个数值空格隔开）'], 'xor_decryptLocalFile_xortype', 0, 'xform-item', '密钥类型:'),
        fzDOM.createLabelInputDiv('text', '异或密钥:', 'xor_decryptLocalFile_key', 'xform-item', null, 268),
        fzDOM.createLabelInputDiv('file', '选择文件:', 'xor_decryptLocalFile_file', 'xform-item')
    );

    var d = new XDialog({
        title: '异或解密本地文件',
        prompt: '使用指定的密钥对选定的本地文件进行异或解密',
        content: form,
        fnOK: go
    });
    d.show(function() {
        fzDOM.setFocus('xor_decryptLocalFile_key');
    });

    function go() {
        var key = fzDOM.val('xor_decryptLocalFile_key');
        var file = fzDOM.get('xor_decryptLocalFile_file').files[0];
        var xortype = fzDOM.getCheckedRadioValue('xor_decryptLocalFile_xortype');

        var reader = new FileReader();
        reader.onload = function() {
            var bytes = new Uint8Array(this.result);
            decrypt(xortype, key, bytes, file.name);
        };
        reader.readAsArrayBuffer(file);
        return true;
    }

    function decrypt(xortype, key, bytes, filename) {
        var keyLen;
        var arrXor = [];
        switch (xortype) {
            case 'str':
                keyLen = key.length;
                for (var u = 0; u < keyLen; u++) {
                    arrXor.push(key.charCodeAt(u));
                }
                break;
            case 'dec':
                fzArray.walk(key.split(' '), function(x) {
                    if (!isNaN(x)) {
                        arrXor.push(parseInt(x));
                    }
                });
                keyLen = arrXor.length;
                break;
        }

        for (var i = 0, l = bytes.length; i < l; i += keyLen) {
            for (var k = 0; k < keyLen; k++) {
                var c = bytes[i + k];
                bytes[i + k] = c ^ arrXor[k];
            }
        }

        var fn = filename.split('.');
        fn[0] = fn[0] + '_xor_decrypt';
        var newname = fn.join('.');
        saveShareContent(bytes, newname);
        return true;
    }

    // XInputbox('异或解密本地文件', '对于数据1中的十六进制数值进行异或解密（自动忽略多余的空格）<br/>输入异或密钥:', '', function(xorBy) {
    //     var s = getText1();
    //     s = s.replace(/\s{2,}/g, ' ');
    //     var hexes = s.split(' ');
    //     var xorLen = xorBy.length;
    //     var ret = [];
    //     var arrXor = [];
    //     for (var u = 0; u < xorBy.length; u++) {
    //         arrXor.push(xorBy.charCodeAt(u));
    //     }
    //     console.log(arrXor);

    //     for (var i = 0, l = hexes.length; i < l; i += xorLen) {
    //         for (var k = 0; k < xorLen; k++) {
    //             var c = hexes[i + k];
    //             var h = parseInt(c, 16);
    //             var r = h ^ arrXor[k];
    //             var x16 = bases.toBase(r, 16).toUpperCase();
    //             if (x16.length == 1) {
    //                 x16 = '0' + x16;
    //             }
    //             ret.push(x16);
    //         }
    //     }

    //     setResultString(ret.join(' '));
    // });
}

//异或加密
function xor_encrypt() {

}

function showGoogleHackingDialog() {
    var options = [{
        text: '目录遍历漏洞',
        value: 1
    }, {
        text: '配置文件泄露',
        value: 2
    }, {
        text: '数据库文件泄露',
        value: 3
    }, {
        text: '日志文件泄露',
        value: 4
    }, {
        text: '备份和历史文件',
        value: 5
    }, {
        text: '登录页面',
        value: 6
    }, {
        text: 'SQL错误',
        value: 7
    }, {
        text: '公开文件信息',
        value: 8
    }, {
        text: 'phpinfo()',
        value: 9
    }, {
        text: '搜索Pastebin.com和其他粘贴站点',
        value: 10
    }, {
        text: '搜索Github.com和Gitlab.com',
        value: 11
    }];
    var div = fzDOM.createRadioList(options, 'searchType');
    div.className = 'xform-radios xform-radios-vertical';
    var divInner = fzDOM.addUI(
        fzDOM.make('div'),
        fzDOM.createLabelInputDiv('text', '目标网站域名', 'txtSite', 'xform-item', 'placeholder:baidu.com', 240),
        div
    );
    var d = new XDialog({
        title: 'googleHacking',
        prompt: '在Google中搜索目标网站的特定信息',
        content: divInner,
        defaultBtn: 'ok',
        fnOK: function() {
            var chk = document.querySelector('[name=searchType]:checked');
            var type = chk.value;
            var site = fzDOM.val('txtSite');
            googleHacking(site, type);
            return false;
        }
    });
    d.show('txtSite');


    function googleHacking(site, type) {
        var url;
        var url1 = 'https://www.google.com/search?q=';
        var url2 = url1 + 'site:' + site;
        nType = parseInt(type);
        switch (nType) {
            case 1:
                url = url2 + '+intitle:index.of';
                break;
            case 2:
                url = url2 + '+ext:xml+|+ext:conf+|+ext:cnf+|+ext:reg+|+ext:inf+|+ext:rdp+|+ext:cfg+|+ext:txt+|+ext:ora+|+ext:ini';
                break;
            case 3:
                url = url2 + '+ext:sql+|+ext:dbf+|+ext:mdb';
                break;
            case 4:
                url = url2 + '+ext:log';
                break;
            case 5:
                url = url2 + '+ext:bkf+|+ext:bkp+|+ext:bak+|+ext:old+|+ext:backup';
                break;
            case 6:
                url = url2 + '+inurl:login';
                break;
            case 7:
                url = url2 + '+intext:"sql+syntax+near"+|+intext:"syntax+error+has+occurred"+|+intext:"incorrect+syntax+near"+|+intext:"unexpected+end+of+SQL+command"+|+intext:"Warning:+mysql_connect()"+|+intext:"Warning:+mysql_query()"+|+intext:"Warning:+pg_connect()"';
                break;
            case 8:
                url = url2 + '+ext:doc+|+ext:docx+|+ext:odt+|+ext:pdf+|+ext:rtf+|+ext:sxw+|+ext:psw+|+ext:ppt+|+ext:pptx+|+ext:pps+|+ext:csv';
                break;
            case 9:
                url = url2 + '+ext:php+intitle:phpinfo+"published+by+the+PHP+Group"';
                break;
            case 10:
                url = url1 + 'site:pastebin.com+|+site:paste2.org+|+site:pastehtml.com+|+site:slexy.org+|+site:snipplr.com+|+site:snipt.net+|+site:textsnip.com+|+site:bitpaste.app+|+site:justpaste.it+|+site:heypasteit.com+|+site:hastebin.com+|+site:dpaste.org+|+site:dpaste.com+|+site:codepad.org+|+site:jsitor.com+|+site:codepen.io+|+site:jsfiddle.net+|+site:dotnetfiddle.net+|+site:phpfiddle.org+|+site:ide.geeksforgeeks.org+|+site:repl.it+|+site:ideone.com+|+site:paste.debian.net+|+site:paste.org+|+site:paste.org.ru+|+site:codebeautify.org+|+site:codeshare.io+|+site:trello.com' + '+"' + site +
                    '"';
                break;
            case 11:
                url = url1 + 'site:github.com+|+site:gitlab.com' + '+"' + site + '"';
                break;
        }
        window.open(url, 'about:blank');
    }
}

function showOSINTFramework() {
    window.open('plugin/osint/OSINT-Framework-master/public/index.html');
}