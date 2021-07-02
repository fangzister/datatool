//TODO
/**
 * 1.固定操作历史
 * 2.自动重复上一次操作
 * 3.撤销、重做的bug
 * 4.缓存数据
 * 5.读取缓存数据
 * 6.统计次数功能自动排序 √
 * 7.去重统计按最后一列排序 √
 * 8.表格的keydown事件，使其支持热键
 * 9.数组分列后变成表格 √
 * 10.数组分列，指定列数平均分配模式，对话框出现后默认选中数值，增加列数大于行数时的错误提示 √
 * 11.更新日志模块
 *   手动录入
 *   手动更改状态
 *   输出json格式
 *   根据json格式显示为版本时间线视图
 * 12.提取要素功能增强
 *   获取json格式数据
 *   按照json格式数据生成表格
 * 13.按模板转换表格
 * 14.随机生成器
 *   随机城市 支持省级、地市级、区县级
 *   随机UserAgent
 * 15.生成序列
 *   生成某个省份的所有城市 按级别生成
 * 16.随机头像增加功能
 *   下一张、上一张
 *   按头像类型分组
 * 17.常用查询
 *   国家查国旗 *  
 */

APP_VERSION = '1.5.4';
APP_TITLE = '数据处理工具';

initLayout();

if (DEVELOP_MODE) {
    document.title = document.title + ' V' + APP_VERSION + '-dev';
} else {
    document.title = document.title + ' V' + APP_VERSION;
}
fzDOM.text('logo', APP_TITLE + ' - V' + APP_VERSION);

if (!isEmpty(localStorage['txtArray1'])) {
    fzDOM.setValue('txtArray1', localStorage['txtArray1']);
}
if (!isEmpty(localStorage['txtArray2'])) {
    fzDOM.setValue('txtArray2', localStorage['txtArray2']);
}

var clipboard = new ClipboardJS('#btnClipboard', {
    text: function(e) {
        return copyData(e);
    }
});

var xtooltip = new XTooltip({
    orientation: 'top'
});


window.onload = function() {
    clipboard.on('success', function(e) {});

    clipboard.on('error', function(e) {
        console.error(e);
    });

    xtooltip.render(['.col header a']);

    restoreLastView();

    setTableEvent();

    var currentVersion = localStorage["currentVersion"];
    if (currentVersion !== APP_VERSION) {
        localStorage["currentVersion"] = APP_VERSION;
        showReleaseHistory();
    }
}

window.onunload = function() {
    var tools = fzDOM.get('.tools');
    localStorage["menuScrollTop"] = tools.scrollTop;
}

//V1.4.7
function loadEagleLib(callback) {
    if (!window.EAGLE_PLATFORM_HOST) {
        fzDOM.addScripts('lib/fzcore/_eagle', callback);
    } else {
        if (callback) {
            fzFnc.call(callback);
        }
    }
}

function copyData(btn) {
    var destSelector = btn.getAttribute('dest-selector');
    var tds = fzDOM.queryAll(destSelector);
    var a = fzFnc.travelToArray(tds, function(x) {
        return x.innerText;
    });
    return a.join('\n');
}

/***************************************
 * 表格操作
 **************************************/

function selectTable(menuItem, target, table) {
    var tds = fzDOM.queryAll('tr:not(.thead) td', table);
    fzArray.walk(tds, function(td) {
        fzDOM.appendClass(td, 'selected')
    });
}

function editTableHeader(menuItem, target, currentTarget) {
    var aTitle = target.tagName == 'TH' ? target.firstElementChild : target.parentNode.firstElementChild;
    XInputbox('编辑表头', '输入表头的标题', aTitle.innerText, function(x) {
        if (!x) {
            return false;
        }
        aTitle.innerText = x;
    }, 140, null, null, {
        maxLength: 20,
        msgMaxLength: '标题太长',
        msgDefault: '最多20个字符',
        msgRequired: '标题不能为空'
    });
}


function copyToDataColumn() {

}

function cutToDataColumn() {

}

function deleteColumn(menuItem, target, currentTarget) {
    console.log('delete column')
    var txtId = currentTarget.id.replace('tbl', 'txt');
    var colIndex;
    if (target.tagName == 'TH') {
        colIndex = fzDOM.getAttrLong(target, 'colindex');
    } else {
        colIndex = fzDOM.getAttrLong(target.parentNode, 'colindex');
    }

    var trs = currentTarget.querySelectorAll('tr');
    var data = [];
    var isDataRow = false;
    fzArray.walk(trs, function(tr) {
        if (isDataRow) {
            var a = tr.innerText.split('\t');
            a.splice(colIndex, 1);
            data.push(a.join('\t'));
        } else {
            isDataRow = true;
        }
        try {
            tr.deleteCell(colIndex);
        } catch (e) {

        }
    });

    var ths = currentTarget.querySelectorAll('tr.thead th');
    var startIndex = colIndex;
    fzArray.walk(ths, function(th, index) {
        if (index >= colIndex) {
            th.setAttribute('colindex', startIndex);
            startIndex++;
        }
    });

    fzDOM.setValue(txtId, data.join('\n'));
}

//还原上次的视图
function restoreLastView() {
    var v1 = localStorage["tableview_1"],
        v2 = localStorage["tableview_2"],
        vr = localStorage["tableview_result"],
        s1 = (v1 == 'true') ? 'table' : 'text',
        s2 = (v2 == 'true') ? 'table' : 'text',
        sr = (vr == 'true') ? 'table' : 'text';

    fzDOM.get('.col-tool a[index="1"][viewmode="' + s1 + '"]').click();
    fzDOM.get('.col-tool a[index="2"][viewmode="' + s2 + '"]').click();
    fzDOM.get('.col-tool a[index="result"][viewmode="' + sr + '"]').click();

    var tools = fzDOM.get('.tools');
    sct = localStorage["menuScrollTop"];
    if (sct) {
        tools.scrollTo({
            top: sct
        });
    }
}

function editTitle(e) {
    var a = e.target;

    var strong = a.parentNode.parentNode.firstElementChild.firstElementChild;
    var defaultText = strong.innerText;
    XInputbox('编辑标题', '输入新的标题', defaultText, function(x) {
        if (!x) {
            return false;
        }
        strong.innerText = x;
    }, 240, null, null, {
        msgRequired: '必须指定一个标题'
    });
}

function resetTitle(index, title) {
    var a = fzDOM.get('.col-title a[index="' + index + '"]');
    a.innerText = title;
}

function unselectAll(e) {
    var table = e.currentTarget;
    fzDOM.removeAllClassOf(table, 'tr:not(.thead) td', 'selected');
}

function setTableEvent() {
    fzDOM.addEvent('.datatable', {
        click: unselectAll
    });

    fzDOM.addEvent('.col-title a', {
        click: editTitle
    });
}

function toggleWrap(source) {
    var index;

    if (typeof source === 'string') {
        index = source;
    } else {
        index = fzDOM.getAttr(source, 'index');
    }
    var textarea = fzDOM.get('textarea[index="' + index + '"]'),
        aNowrap = fzDOM.get('a[index="' + index + '"][nowrap]');

    if (fzDOM.getAttr(textarea, 'nowrap')) {
        fzDOM.setAttr(textarea, 'nowrap', '');
        textarea.style.whiteSpace = '';
        fzDOM.removeClass(aNowrap, 'active');
        localStorage['nowrap_' + index] = false;
    } else {
        fzDOM.setAttr(textarea, 'nowrap', 'nowrap');
        textarea.style.whiteSpace = 'nowrap';
        fzDOM.appendClass(aNowrap, 'active');
        localStorage['nowrap_' + index] = true;
    }
}

//V1.4.6
//切换自动执行上次命令
function toggleRepeatOnBlur(aButton) {
    var index = fzDOM.getAttr(aButton, 'index');

    var textarea = fzDOM.get('textarea[index="' + index + '"]')

    if (fzDOM.getAttr(aButton, 'autorepeat')) {
        fzDOM.setAttr(textarea, 'autorepeat', '');
        fzDOM.removeClass(aButton, 'active');
        textarea.onblur = null;
        localStorage['autorepeat_' + index] = false;
    } else {
        fzDOM.setAttr(textarea, 'autorepeat', 'autorepeat');
        fzDOM.appendClass(aButton, 'active');
        textarea.onchange = repeatLastAction;
        localStorage['autorepeat_' + index] = true;
    }
}

function textView(source) {
    var index;

    if (typeof source === 'string') {
        index = source;
    } else {
        index = fzDOM.getAttr(source, 'index');
    }
    var table = fzDOM.get('.datatable[index="' + index + '"]'),
        textarea = fzDOM.get('textarea[index="' + index + '"]'),
        btnText = fzDOM.get('a[index="' + index + '"][viewmode="text"]'),
        btnTable = fzDOM.get('a[index="' + index + '"][viewmode="table"]');

    fzDOM.removeClass(btnTable, 'active');
    fzDOM.appendClass(btnText, 'active');

    fzDOM.switchVisible(textarea, table);

    fzDOM.disable('btnExcel' + index);

    setSourceCount(textarea, true);
    localStorage['tableview_' + index] = false;
}

/**
 * 转换为表格视图
 * @param {*} source [string index | dom]
 * @param {array} [tableHeader] 表头字符串数组
 * @param {string} [tableTitle] 表格标题
 * @param {function} [fnDataRows] 针对表格数据行的回调
 */
function tableView(source, tableHeader, tableTitle, fnDataRows) {
    var index;
    if (typeof source === 'string') {
        index = source;
    } else {
        index = fzDOM.getAttr(source, 'index');
    }
    var table = fzDOM.get('.datatable[index="' + index + '"]'),
        textarea = fzDOM.get('textarea[index="' + index + '"]'),
        tBody = table.querySelector('tbody'),
        btnText = fzDOM.get('a[index="' + index + '"][viewmode="text"]'),
        btnTable = fzDOM.get('a[index="' + index + '"][viewmode="table"]');

    createTable();

    fzDOM.appendClass(btnTable, 'active');
    fzDOM.removeClass(btnText, 'active');

    fzDOM.switchVisible(table, textarea);

    fzDOM.enable('btnExcel' + index);

    if (tableTitle) {
        resetTitle(index, tableTitle);
    }

    localStorage["tableview_" + table.getAttribute('index')] = true;

    // 1.5.4
    // 2021/06/24 16:20:43
    if (fnDataRows) {
        var rows = tBody.querySelectorAll('tr.table-row');
        fnDataRows(rows);
    }

    // 1.5.1
    // 2021/02/02 17:15:46
    // 返回table
    return table;

    function createTable() {
        var arr = getArray(textarea);
        if (arr.length == 0) {
            table.innerHTML = '<tbody></tbody>';
            return;
        }
        var trs = [''],
            hd = [],
            cols = tableHeader ? tableHeader.length : 0,
            i = 0;

        fzArray.walk(arr, function(x) {
            var row = x.split('\t');
            if (row.length > cols) {
                cols = row.length;
            }
            trs.push(row.join('</td><td>'));
        });

        if (tableHeader) {
            for (i = 0; i < cols; i++) {
                hd.push('<a>' + tableHeader[i] + '</a><b></b>');
            }
        } else {
            for (i = 0; i < cols; i++) {
                hd.push('<a>' + String.fromCharCode(65 + i) + '</a><b></b>');
            }
        }

        trs[0] = hd.join('</th><th>');
        tBody.innerHTML = '<tr class="thead"><th>' + trs.join('</th></tr><tr class="table-row"><td>') + '</td></tr>';
        setTableDesc(table);

        regEvents();
    }

    function regEvents() {
        var thead = table.querySelector('.thead'),
            ths = thead.querySelectorAll('th'),
            sortTriggers = thead.querySelectorAll('b');

        fzDOM.addEvent(ths, {
            'click': function(e) { //点击表头选中列
                var th = e.currentTarget,
                    colIndex = fzDOM.getAttrLong(th, 'colindex'),
                    tBody = th.parentNode.parentNode.parentNode;

                e.stopPropagation();

                fzDOM.removeAllClassOf(tBody, '.selected', '');
                var tds = fzDOM.queryAll('tr:not(.thead) td:nth-child(' + (colIndex + 1) + ')', tBody);

                fzArray.walk(tds, function(td) {
                    fzDOM.appendClass(td, 'selected')
                });
            },
            'copy': function(e) { //复制列                
                var destSelector = '#' + table.id + ' td.selected';
                var btn = fzDOM.get('btnClipboard');
                fzDOM.setAttr(btn, 'dest-selector', destSelector);
                btn.click();
            }
        });

        fzArray.walk(sortTriggers, function(b, index) {
            var th = b.parentNode;
            th.setAttribute('colindex', index);
        });

        fzDOM.addEvent(sortTriggers, {
            //排序
            //TODO 还原默认排序
            'click': function(e) {
                var trigger = e.target,
                    colIndex = getColIndexByTrigger(trigger),
                    currentSort = trigger.getAttribute('sort');

                fzDOM.addAttr(trigger, 'disabled');
                e.stopPropagation();

                if (!currentSort) {
                    setDefaultIndex(colIndex);
                    currentSort = 'default';
                }
                return prepareSort(colIndex, currentSort, trigger);
            }
        });

        function prepareSort(colIndex, currentOrder, trigger) {
            var sortSeq = {
                'default': 'asc',
                'asc': 'desc',
                'desc': 'asc'
            };
            var colCount = thead.querySelectorAll('th').length;
            var nextOrder = sortSeq[currentOrder];
            if (colCount > 1) {
                // showSortDialog(function() {
                doMultiSort(colIndex, nextOrder);
                fzDOM.setAttr(trigger, 'sort', nextOrder);
                fzDOM.delAttr(trigger, 'disabled');
                // });
            } else {
                doDefaultSort(colIndex, nextOrder);
                fzDOM.setAttr(trigger, 'sort', nextOrder);
                fzDOM.delAttr(trigger, 'disabled');
            }
        }

        function showSortDialog(fn) {
            var options = ['char:字符', 'number:数值'];
            var options = ['col:仅当前列', 'all:按照当前列扩展全表'];

            new XDialog({
                title: '排序',
                prompt: '设置排序规则',
                content: null,
                fnOK: function() {
                    fn()
                }
            }).show();
        }

        function doMultiSort(colIndex, order) {
            var trs = tBody.querySelectorAll('tr[index]');
            var a = fzArray.each(trs, function(tr) {
                return fzArray.each(tr.querySelectorAll('td'), function(x) {
                    return x.innerText;
                });
            });
            switch (order) {
                // case 'default':
                // a.sort(sortDefault);
                // break;
                case 'asc':
                    a.sort(sortAsc);
                    break;
                case 'desc':
                    a.sort(sortDesc);
                    break;
            }

            fzArray.walk(a, function(text, index) {
                trs[index].innerHTML = fzString.concat('<td>', text.join('</td><td>'), '</td>');
            });

            function sortAsc(x, y) {
                return x[colIndex] > y[colIndex] ? 1 : x[colIndex] < y[colIndex] ? -1 : 0;
            }

            function sortDesc(x, y) {
                return x[colIndex] < y[colIndex] ? 1 : x[colIndex] > y[colIndex] ? -1 : 0;
            }

        }

        function doDefaultSort(colIndex, order) {
            var selector = colIndex == 0 ? ':first-child' : ':nth-child(' + (colIndex + 1) + ')';
            var tds = tBody.querySelectorAll('tr[index] td' + selector);
            var a = fzArray.each(tds, function(item) {
                return item.innerText;
            });
            switch (order) {
                // case 'default':
                // a.sort(sortDefault);
                // break;
                case 'asc':
                    a.sort(sortAsc);
                    break;
                case 'desc':
                    a.sort(sortDesc);
                    break;
            }

            fzArray.walk(a, function(text, index) {
                tds[index].innerText = text;
            });

            function sortDefault() {

            }

            function sortAsc(x, y) {
                return (x > y) ? 1 : (x < y) ? -1 : 0;
            }

            function sortDesc(x, y) {
                return (x > y) ? -1 : (x < y) ? 1 : 0;
            }
        }

        function setDefaultIndex(colIndex) {
            var trs = thead.parentNode.querySelectorAll('tr');
            fzFnc.travelList(trs, function(item, index) {
                if (index == 0) {
                    return;
                }
                item.setAttribute('index', index);
                item.cells[colIndex].setAttribute('index', index);
            });
        }

        function getColIndexByTrigger(t) {
            var tagName = t.tagName.toLowerCase();
            var tagList = thead.querySelectorAll(tagName);
            var arrTags = Array.from(tagList);
            var colIndex = arrTags.indexOf(t);
            return colIndex;
        }
    }
}

function setResultCount(cnt) {
    fzDOM.html('emResult', '(' + cnt + '行)');
    return true;
}

function getArray(id) {
    var s = fzDOM.val(id);
    var r = s.split('\n');
    return r.filter(function(x) {
        return !isEmpty(x)
    });
}

function getArray1() {
    return getArray('txtArray1');
}

function getArray2() {
    return getArray('txtArray2');
}

function getArrayResult() {
    return getArray('txtResult');
}

function getArrayWithEmpty(id) {
    var s = fzDOM.val(id);
    var r = s.split('\n');
    return r;
}

function getText(id) {
    var s = fzDOM.val(id);
    s = s.replace(/[\r\n]/g, '');
    return s;
}

function getText1() {
    return getText('txtArray1');
}

function getText2() {
    return getText('txtArray2');
}

function setSourceString(value, textarea) {
    textarea = fzDOM.get(textarea);
    fzDOM.setValue(textarea, value);
    setSourceCount(textarea);
    if (fzDOM.isHidden(textarea)) {
        textView(textarea);
    }
}

function setSourceCount(t, noSaveLocalStorage) {
    var arr = getArray(t);
    var em = fzDOM.get(t.id.replace('txt', 'em'));
    var n1 = t.value.length;
    var n2 = fzString.getByteLength(t.value);
    em.innerText = fzString.format('({0}行,{1}字符,{2}字节)', arr.length, n1, n2);

    if (t.value.length < 50000 && !noSaveLocalStorage) {
        localStorage[t.id] = t.value;
    }
    //判断数据1的第一个数据是什么东西，以便后台加载所需的数据
    if (t.id == 'txtArray1') {
        if (!t.value.length) {
            return;
        }
        if (!arr[0]) {
            return;
        }
        var data1 = arr[0].trim();
        if (fzValidator.isIP(data1)) {
            if (!window.ipData) {
                $.ajax({
                    url: IP_DATA,
                    cache: true,
                    type: 'GET',
                    success: function(e) {
                        window.ipData = e;
                    }
                })
            }
            return;
        }
        if (fzValidator.isPhoneNumber(data1)) {
            if (!window.mobileData) {
                $.ajax({
                    url: MOBILE_DATA,
                    cache: true,
                    type: 'GET',
                    success: function(e) {
                        window.mobileData = e;
                    }
                });
            }
            return;
        }
        if (fzValidator.isIdCard(data1)) {
            if (!window.idcardData) {
                $.ajax({
                    url: IDCARD_DATA,
                    cache: true,
                    type: 'GET',
                    success: function(e) {
                        window.idcardData = e;
                    }
                });
            }
            return;
        }
        if (fzValidator.isCarNumber(data1)) {
            if (!window.carData) {
                $.ajax({
                    url: CARNUMBER_DATA,
                    cache: true,
                    type: 'GET',
                    success: function(e) {
                        window.carData = e;
                    }
                });
            }
            return;
        }
        if (fzValidator.isBankcard(data1)) {
            if (!window.bankData) {
                $.ajax({
                    url: BANK_DATA,
                    cache: true,
                    type: 'GET',
                    success: function(e) {
                        window.bankData = e;
                    }
                });
            }
            return;
        }
    }
}

function setTableDesc(table) {
    table = fzDOM.get(table);
    var rows = table.rows.length - 1,
        cols = table.rows[0].cells.length,
        em = table.parentNode.querySelector('.statusbar'),
        s = fzString.format('{0}行，{1}列', rows, cols);
    em.innerText = s;
}

function setResult(arr) {
    var o = fzDOM.get('txtResult');
    fzDOM.setValue(o, arr.join('\n'));
    setResultCount(arr.length);
    if (fzDOM.isHidden(o)) {
        textView(o);
    }
}

function setSource(arr, textarea) {
    return setSourceString(arr.join('\n'), textarea);
}

function setResultString(s) {
    var o = fzDOM.get('txtResult');
    fzDOM.setValue(o, s);
    setResultCount(1);
    if (fzDOM.isHidden(o)) {
        textView(o);
    }
}

function appendResultString(s) {
    var o = fzDOM.get('txtResult');
    fzDOM.setValue(o, o.value + '\n' + s);
    setResultCount(1);
    if (fzDOM.isHidden(o)) {
        textView(o);
    }
}

function cutTo(menuItem, source) {
    var index = menuItem.index;
    if (index == 'result') {
        setResultString(source.value);
    } else {
        setSourceString(source.value, 'txtArray' + index);
    }
    source.value = '';
}

function appendTo(menuItem, source) {
    var index = menuItem.index,
        dest;
    if (index == 'result') {
        dest = fzDOM.get('txtResult');
    } else {
        dest = fzDOM.get('txtArray' + index);
    }

    var arrSource = source.value.split('\n');
    var arrDest = dest.value.split('\n');

    var nLen = Math.max(arrSource.length, arrDest.length);
    for (var i = 0; i < nLen; i++) {
        arrDest[i] = fzString.concat(arrDest[i], '\t', arrSource[i]);
    }

    if (index == 'result') {
        setResult(arrDest);
    } else {
        fzDOM.setValue(dest, arrDest.join('\n'));
        setSourceCount(dest, false);
    }
}

//V1.4.7
//交换数据
function exchangeWith(menuItem, source) {
    var destIndex = menuItem.index,
        sourceIndex = source.getAttribute('index'),
        dest = destIndex == 'result' ? fzDOM.get('txtResult') : fzDOM.get('txtArray' + destIndex),
        sourceValue = source.value; //被交换的文本框值

    if (destIndex == 'result') { //数据12和结果换
        setSourceString(dest.value, source);
        setResultString(sourceValue);
    } else {
        //结果和数据12换
        if (sourceIndex == 'result') {
            setResultString(dest.value)
            setSourceString(sourceValue, dest);
        } else { //数据12互换
            setSourceString(dest.value, source)
            setSourceString(sourceValue, dest);
        }
    }
}

function exportTable(index) {
    var table = fzDOM.get('.datatable[index="' + index + '"]');
    if (!table.querySelector('tbody').innerText) {
        return
    };
    var ldr = new XLoader().loading(document.body);
    var aTitle = table.parentNode.querySelector('header a');
    var sTitle = aTitle.innerText;
    var trs = fzDOM.queryAll('tr', table);
    var data = fzArray.each(trs, function(tr) {
        return fzArray.each(tr.cells, function(td) {
            return td.innerText
        });
    });

    var ths = trs[0].cells;
    var colWidths = fzArray.each(ths, function(th) {
        return th.offsetWidth / 9.2;
    });

    exportExcelOnNewFrame(data, sTitle, 'Sheet1', colWidths, 12, function() {
        ldr.loaded();
    });
}

function exportText(index) {
    var txt;
    if (index == 'result') {
        txt = fzDOM.get('#txtResult');
    } else {
        txt = fzDOM.get('#txtArray' + index);
    }
    var s = txt.value;
    if (!s.length) {
        return;
    }

    var aTitle = fzDOM.get('.col-title a[index="' + index + '"]');
    var sTitle = aTitle.innerText;
    saveShareContent(s, sTitle + '.txt');
}

function saveShareContent(content, fileName) {
    var downLink = document.createElement('a');
    downLink.style.display = 'none';
    downLink.download = fileName;
    //字符内容转换为blod地址
    var blob = new Blob([content]);
    downLink.href = URL.createObjectURL(blob);
    // 链接插入到页面
    document.body.appendChild(downLink);
    downLink.click();
    // 移除下载链接
    document.body.removeChild(downLink);
}

function initLayout() {
    var as = fzDOM.queryAll('.layout-list a');
    fzDOM.addEvent(as, {
        click: changeLayout
    });

    window.addEventListener('resize', function() {
        var layout = document.body.getAttribute('layout') || 'default';
        setLayout(layout);
    });

    var layout = localStorage["layout"] || 'default';
    setLayout(layout);

    function changeLayout(e) {
        var a = e.currentTarget;
        if (a.getAttribute('layout') == document.body.getAttribute('layout')) {
            return;
        }
        // var activeA = fzDOM.get('.layout-list a[active="active"]');
        // activeA.removeAttribute('active');
        // fzDOM.addAttr(a, 'active');
        var layout = a.getAttribute('layout');
        setLayout(layout);
    }
}

function setLayout(layout) {
    var config = {
        "default": setDefaultLayout,
        "vertical2": setVerticalLayout,
        "horizontal2": setHorizontalLayout,
        "left2right1": setLeft2Right1Layout
    };

    var col1 = fzDOM.get('.col1'),
        col2 = fzDOM.get('.col2'),
        col3 = fzDOM.get('.col3'),
        bar1 = fzDOM.get('.bar1'),
        bar2 = fzDOM.get('.bar2'),
        splitShadow = fzDOM.get('.split-shadow'),
        splitCover = fzDOM.get('.split-cover');

    fzDOM.setAttr(document.body, 'layout', layout);

    config[layout]();
    localStorage["layout"] = layout;

    function resetLayout() {
        col1.style.width = '';
        col1.style.height = '';
        col2.style.width = '';
        col2.style.height = '';
        col3.style.width = '';
        col3.style.height = '';
        bar1.style.width = '';
        bar1.style.height = '';
        bar1.style.left = '';
        bar1.style.top = '';
        bar2.style.width = '';
        bar2.style.height = '';
        bar2.style.left = '';
        bar2.style.top = '';
        splitShadow.style.width = '';
        splitShadow.style.height = '';
        splitShadow.style.top = '';
        splitShadow.style.left = '';
    }

    function setDefaultLayout() {
        resetLayout();
        var splitShadow = fzDOM.get('.split-shadow');
        var splitCover = fzDOM.get('.split-cover');
        var currentBar = null; //当前拖拽的bar
        var currentCol = null; //即将改变大小的col
        var colNoResize = null; //不改变大小的col
        var colResize = null; //被影响的col

        var _minWidth = 220; //col的最小宽度
        var barSize = 6;
        var _initX = 0; //bar的初始x坐标
        var _clickX = 0; //鼠标点击在bar上的x坐标
        var _colLeft = 0; //col的x坐标
        var _minX = 0; //bar能够移动的最小x坐标
        var _maxX = 0;
        var _wrapWidth = fzDOM.getPosition('.wrap').width;

        initBar1();
        initBar2();

        function initBar1() {
            var bar1 = fzDOM.get('.bar1');
            bar1.onmousedown = function(e) {
                colNoResize = fzDOM.get('.col3');
                colResize = fzDOM.get('.col2');
                dragStart(e);
            };
        }

        function initBar2() {
            var bar2 = fzDOM.get('.bar2');
            bar2.onmousedown = function(e) {
                colNoResize = fzDOM.get('.col1');
                colResize = fzDOM.get('.col3');
                dragStart(e);
            };
        }

        function dragStart(e) {
            splitCover.style.cursor = '';
            splitShadow.style.cursor = '';

            currentBar = e.currentTarget;
            var currentColClass = fzDOM.getAttr(currentBar, 'for');
            currentCol = fzDOM.get('.' + currentColClass);

            var barPos = fzDOM.getElementPos(currentBar);
            _initX = barPos.x;
            _clickX = e.clientX - _initX;

            var colPos = fzDOM.getElementPos(currentCol);
            _colLeft = colPos.x;
            _minX = _colLeft + _minWidth;
            // _colWidth = fzDOM.getPosition(currentCol).width;
            // _maxWidth = _minWidth * 2 + 24; //另外两个col加上两个bar最少需要的宽度
            _maxX = fzDOM.getElementPos(colResize).x + fzDOM.getPosition(colResize).width - _minWidth;

            console.log('maxX', _maxX);
            console.log('initX ', _initX);
            console.log('clickX ', _clickX);
            fzDOM.setPosition(splitShadow, _initX);
            fzDOM.show(splitShadow);
            // return;

            splitCover.addEventListener('mousemove', dragging);
            splitCover.addEventListener('mouseup', dragEnd);

            fzDOM.show(splitCover);
            return;
        }

        function dragEnd() {
            splitCover.removeEventListener('mousemove', dragging);
            splitCover.removeEventListener('mouseup', dragEnd);

            var left = fzDOM.getPosition(splitShadow).left;
            var colWidth = left - fzDOM.getElementPos(currentCol).x;
            var widthNoResize = fzDOM.getPosition(colNoResize).width;

            //计算剩下的空间
            var otherWidth = _wrapWidth - widthNoResize - colWidth - barSize - barSize; //等于外层宽度-当前col宽度-两个bar的宽度

            fzDOM.setWidth(currentCol, colWidth);
            fzDOM.setWidth(colResize, otherWidth);

            fzDOM.hide(splitShadow);
            fzDOM.hide(splitCover);
        }

        function dragging(e) {
            var x = e.clientX - _clickX;
            var isAllow = true;
            if (x < _minX) {
                x = _minX;
                isAllow = false;
            } else if (x > _maxX) {
                x = _maxX;
                isAllow = false;
            }

            if (isAllow) {
                splitCover.style.cursor = '';
                splitShadow.style.cursor = '';
            } else {
                splitCover.style.cursor = 'no-drop';
                splitShadow.style.cursor = 'no-drop';
            }
            fzDOM.setPosition(splitShadow, x);
        }
    }

    function setVerticalLayout() {
        resetLayout();

        var _minHeight = 220; //col的最小高度
        var barSize = 6;
        var _clickY = 0; //鼠标点击在bar上的x坐标
        var _colTop = 0; //col的x坐标
        var _minY = 0; //bar能够移动的最小x坐标
        var _maxY = 0;
        var _wrapPos;
        var _wrapWidth = 0;
        var _wrapHeight = 0;
        var _wrapLeft = 0;
        var _initY = 0; //bar的初始x坐标

        fzDOM.setPosition(splitShadow, _wrapLeft, _initY, _wrapWidth, 6);

        bar1.onmousedown = function(e) {
            dragStart(e);
        };

        function dragStart(e) {
            splitCover.style.cursor = '';
            splitShadow.style.cursor = '';

            var barPos = fzDOM.getElementPos(bar1);
            _initY = barPos.y;
            _clickY = e.clientY - _initY;
            _wrapPos = fzDOM.getPosition('.wrap');
            _wrapWidth = _wrapPos.width;
            _wrapHeight = _wrapPos.height;
            _wrapLeft = _wrapPos.left;

            fzDOM.setPosition(splitShadow, _wrapLeft, _initY, _wrapWidth, 6);

            var colPos = fzDOM.getElementPos(col1);
            _colTop = colPos.y;
            _minY = _colTop + _minHeight;
            _maxY = fzDOM.getElementPos(col3).y + fzDOM.getPosition(col3).height - _minHeight;
            fzDOM.show(splitShadow);

            splitCover.addEventListener('mousemove', dragging);
            splitCover.addEventListener('mouseup', dragEnd);

            fzDOM.show(splitCover);
            return;
        }

        function dragEnd() {
            splitCover.removeEventListener('mousemove', dragging);
            splitCover.removeEventListener('mouseup', dragEnd);

            var top = fzDOM.getPosition(splitShadow).top;
            var colHeight = top - fzDOM.getElementPos(col1).y;

            //计算剩下的空间
            var otherHeight = _wrapHeight - colHeight - barSize; //等于外层宽度-当前col宽度-两个bar的宽度

            fzDOM.setHeight(col1, colHeight);
            fzDOM.setHeight(col3, otherHeight);

            fzDOM.hide(splitShadow);
            fzDOM.hide(splitCover);
        }

        function dragging(e) {
            var y = e.clientY - _clickY;
            var isAllow = true;
            if (y < _minY) {
                y = _minY;
                isAllow = false;
            } else if (y > _maxY) {
                y = _maxY;
                isAllow = false;
            }

            if (isAllow) {
                splitCover.style.cursor = '';
                splitShadow.style.cursor = '';
            } else {
                splitCover.style.cursor = 'no-drop';
                splitShadow.style.cursor = 'no-drop';
            }
            splitShadow.style.top = y + 'px';
            // fzDOM.setPosition(splitShadow, y);
        }
    }

    function setHorizontalLayout() {
        resetLayout();

        var _minWidth = 220; //col的最小宽度
        var barSize = 6;
        var _initX = 0; //bar的初始x坐标
        var _clickX = 0; //鼠标点击在bar上的x坐标
        var _colLeft = 0; //col的x坐标
        var _minX = 0; //bar能够移动的最小x坐标
        var _maxX = 0;
        var _wrapWidth = fzDOM.getPosition('.wrap').width;

        fzDOM.setPosition(splitShadow, 0, 0, 6);

        bar1.onmousedown = function(e) {
            dragStart(e);
        };

        function dragStart(e) {
            splitCover.style.cursor = '';
            splitShadow.style.cursor = '';

            var barPos = fzDOM.getElementPos(bar1);
            _initX = barPos.x;
            _clickX = e.clientX - _initX;

            var colPos = fzDOM.getElementPos(col1);
            _colLeft = colPos.x;
            _minX = _colLeft + _minWidth;
            // _colWidth = fzDOM.getPosition(currentCol).width;
            // _maxWidth = _minWidth * 2 + 24; //另外两个col加上两个bar最少需要的宽度
            _maxX = fzDOM.getElementPos(col3).x + fzDOM.getPosition(col3).width - _minWidth;

            fzDOM.setPosition(splitShadow, _initX);
            fzDOM.show(splitShadow);
            // return;

            splitCover.addEventListener('mousemove', dragging);
            splitCover.addEventListener('mouseup', dragEnd);

            fzDOM.show(splitCover);
            return;
        }

        function dragEnd() {
            splitCover.removeEventListener('mousemove', dragging);
            splitCover.removeEventListener('mouseup', dragEnd);

            var left = fzDOM.getPosition(splitShadow).left;
            var colWidth = left - fzDOM.getElementPos(col1).x;

            //计算剩下的空间
            var otherWidth = _wrapWidth - colWidth - barSize; //等于外层宽度-当前col宽度-两个bar的宽度

            fzDOM.setWidth(col1, colWidth);
            fzDOM.setWidth(col3, otherWidth);

            fzDOM.hide(splitShadow);
            fzDOM.hide(splitCover);
        }

        function dragging(e) {
            var x = e.clientX - _clickX;
            var isAllow = true;
            if (x < _minX) {
                x = _minX;
                isAllow = false;
            } else if (x > _maxX) {
                x = _maxX;
                isAllow = false;
            }

            if (isAllow) {
                splitCover.style.cursor = '';
                splitShadow.style.cursor = '';
            } else {
                splitCover.style.cursor = 'no-drop';
                splitShadow.style.cursor = 'no-drop';
            }
            fzDOM.setPosition(splitShadow, x);
        }
    }

    function setLeft2Right1Layout() {
        resetLayout();
        var splitShadow = fzDOM.get('.split-shadow');
        var splitCover = fzDOM.get('.split-cover');

        var _minWidth = 220; //col的最小宽度
        var _minHeight = 220;
        var barSize = 6;
        var _initX = 0; //bar的初始x坐标
        var _initY = 0;
        var _clickX = 0; //鼠标点击在bar上的x坐标
        var _clickY = 0;
        var _colLeft = 0; //col的x坐标
        var _colTop = 0;
        var _minX = 0; //bar能够移动的最小x坐标
        var _maxX = 0;
        var _minY = 0;
        var _maxY = 0;
        var _wrapPos = fzDOM.getPosition('.wrap');
        var _wrapWidth = _wrapPos.width;
        var _wrapHeight = _wrapPos.height;

        initBar1();
        initBar2();

        function initBar1() {
            var bar1 = fzDOM.get('.bar1');
            bar1.onmousedown = function(e) {
                dragStartV(e);
            };
        }

        function initBar2() {
            var bar2 = fzDOM.get('.bar2');
            bar2.onmousedown = function(e) {
                dragStartH(e);
            };
        }

        function dragStartV(e) {
            splitCover.style.cursor = 'ns-resize';
            splitShadow.style.cursor = 'ns-resize';

            var barPos = fzDOM.getElementPos(bar1);
            _initY = barPos.y;
            _clickY = e.clientY - _initY;
            _wrapPos = fzDOM.getPosition('.wrap');
            _wrapWidth = _wrapPos.width;
            _wrapHeight = _wrapPos.height;
            _wrapLeft = _wrapPos.left;

            var colPos = fzDOM.getElementPos(col1);
            _colTop = colPos.y;
            _minY = _colTop + _minHeight;
            _maxY = fzDOM.getElementPos(col3).y + fzDOM.getPosition(col3).height - _minHeight;

            fzDOM.setPosition(splitShadow, _wrapLeft, _initY, colPos.width, 6);
            fzDOM.show(splitShadow);

            splitCover.addEventListener('mousemove', draggingV);
            splitCover.addEventListener('mouseup', dragEndV);

            fzDOM.show(splitCover);
            return;
        }

        function dragEndV() {
            splitCover.removeEventListener('mousemove', draggingV);
            splitCover.removeEventListener('mouseup', dragEndV);

            var top = fzDOM.getPosition(splitShadow).top;
            var colHeight = top - fzDOM.getElementPos(col1).y;

            //计算剩下的空间
            var otherHeight = _wrapHeight - colHeight - barSize; //等于外层宽度-当前col宽度-两个bar的宽度

            fzDOM.setHeight(col1, colHeight);
            fzDOM.setHeight(col2, otherHeight);

            bar1.style.top = colHeight + 'px';

            fzDOM.hide(splitShadow);
            fzDOM.hide(splitCover);
        }

        function draggingV(e) {
            var y = e.clientY - _clickY;
            var isAllow = true;
            if (y < _minY) {
                y = _minY;
                isAllow = false;
            } else if (y > _maxY) {
                y = _maxY;
                isAllow = false;
            }

            if (isAllow) {
                splitCover.style.cursor = 'ns-resize';
                splitShadow.style.cursor = 'ns-resize';
            } else {
                splitCover.style.cursor = 'no-drop';
                splitShadow.style.cursor = 'no-drop';
            }
            splitShadow.style.top = y + 'px';
        }


        function dragStartH(e) {
            splitCover.style.cursor = 'ew-resize';
            splitShadow.style.cursor = 'ew-resize';

            var barPos = fzDOM.getElementPos(bar2);
            _initX = barPos.x;
            _clickX = e.clientX - _initX;

            var colPos = fzDOM.getElementPos(col1);
            _colLeft = colPos.x;
            _minX = _colLeft + _minWidth;
            _maxX = fzDOM.getElementPos(col3).x + fzDOM.getPosition(col3).width - _minWidth;

            fzDOM.setPosition(splitShadow, _initX, 0, barSize, _wrapHeight);
            fzDOM.show(splitShadow);

            splitCover.addEventListener('mousemove', draggingH);
            splitCover.addEventListener('mouseup', dragEndH);

            fzDOM.show(splitCover);
            return;
        }

        function dragEndH() {
            splitCover.removeEventListener('mousemove', draggingH);
            splitCover.removeEventListener('mouseup', dragEndH);

            var left = fzDOM.getPosition(splitShadow).left;
            var colPos = fzDOM.getElementPos(col1);
            var colWidth = left - colPos.x;
            //计算剩下的空间
            var otherWidth = _wrapWidth - colWidth - barSize; //等于外层宽度-当前col宽度-两个bar的宽度

            fzDOM.setWidth(col1, colWidth);
            fzDOM.setWidth(col2, colWidth);
            fzDOM.setWidth(col3, otherWidth);
            fzDOM.setPosition(bar2, colWidth);
            fzDOM.setWidth(bar1, colWidth);

            fzDOM.hide(splitShadow);
            fzDOM.hide(splitCover);
        }

        function draggingH(e) {
            var x = e.clientX - _clickX;
            var isAllow = true;
            if (x < _minX) {
                x = _minX;
                isAllow = false;
            } else if (x > _maxX) {
                x = _maxX;
                isAllow = false;
            }

            if (isAllow) {
                splitCover.style.cursor = 'ew-resize';
                splitShadow.style.cursor = 'ew-resize';
            } else {
                splitCover.style.cursor = 'no-drop';
                splitShadow.style.cursor = 'no-drop';
            }
            fzDOM.setPosition(splitShadow, x);
        }
    }
}

function toggleHistoryCollapse() {
    var tool = fzDOM.get('.tool');
    fzDOM.toggleClass(tool, 'history-collapsed');
}

function popupImage(imgSrc, dialogTitle, imgName, fnShow) {
    var img = document.createElement('img');
    var winSize = fzDOM.windowSize();
    var imgWrap = fzDOM.get('dlgImageWrap');
    imgName = imgName || dialogTitle;

    img.onload = function() {
        this.style.cssText = 'margin:0 auto;display:block;';
        if (this.naturalWidth > winSize.width) {
            fzDOM.css(this, 'max-width', winSize.width);
        }
        if (this.naturalHeight > winSize.height - 100) {
            fzDOM.css(this, 'max-height', winSize.height - 100);
        }

        if (imgWrap) {
            fzDOM.resetChild(imgWrap, this);
        } else {
            imgWrap = fzDOM.dom(null, null, null, 'dlgImageWrap');
            imgWrap.appendChild(this);

            new XDialog({
                id: 'dlgImage',
                title: dialogTitle,
                icon: false,
                content: imgWrap,
                modal: false,
                fnOK: downloadImg,
                labelOK: '下载图片',
                labelCancel: '关闭',
                movable: false
            }).show(fnShow);
        }
    };

    img.onerror = function() {
        XAlert(e);
    };

    img.src = imgSrc;

    function downloadImg() {
        // 2021/02/02/ 15:32:47
        // 修正多次生成头像，只会下载到第一张的bug
        var img = fzDOM.get('#dlgImageWrap img');
        var a = document.createElement('a');
        a.setAttribute('download', imgName);
        a.href = img.src;
        fzDOM.addTo(document.body, a);
        a.click();
        a.remove();
    }
}

function showImage(imgSrc, base64, imgFormat) {
    var mask = fzDOM.dom('popupImg');
    var x = fzDOM.createLinkbutton('<i class="oasicon oasicon-delete"></i>', null, null, closeImg);
    var p = fzDOM.dom(null, 'p');
    var img = document.createElement('img');

    mask.onmousewheel = function(e) {
        var h = img.offsetHeight;

        if (e.deltaY < 0) { //放大
            h = h * 1.1;
            if (h > this.offsetHeight) {
                h = this.offsetHeight;
            } else {
                h = Math.round(h);
            }
        } else { //缩小
            h = h * 0.9;
            if (h < 1) {
                h = 1;
            } else {
                h = Math.round(h);
            }
        }
        fzDOM.setHeight(img, h);
    };

    document.addEventListener('keyup', escClose);

    mask.appendChild(x);
    mask.appendChild(p);
    mask.appendChild(img);

    img.onload = function(e) {
        if (base64) {
            var size = getImageBytes(base64);
            p.innerHTML = fzString.format('原始尺寸：{0}x{1}<br/>图片大小：{2}KB<br/>文件类型：{3}',
                this.naturalWidth, this.naturalHeight, size, imgFormat
            );
        } else {
            p.innerHTML = fzString.format('原始尺寸：{0}x{1}', this.naturalWidth, this.naturalHeight);
        }
        document.body.appendChild(mask);
    };
    img.src = imgSrc;

    function getImageBytes(str) {
        //获取base64图片大小，返回MB数字        
        var equalIndex = str.indexOf('=');
        if (str.indexOf('=') > 0) {
            str = str.substring(0, equalIndex);
        }
        var strLength = str.length;
        var fileLength = parseInt(strLength - (strLength / 8) * 2);
        // 由字节转换为MB
        var size = "";
        size = (fileLength / 1024).toFixed(2);
        var sizeStr = size + ""; //转成字符串
        var index = sizeStr.indexOf("."); //获取小数点处的索引
        var dot = sizeStr.substr(index + 1, 2) //获取小数点后两位的值
        if (dot == "00") { //判断后两位是否为00，如果是则删除00                
            return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
        }
        return parseInt(size);
    }

    function closeImg() {
        mask.remove();
        document.removeEventListener('keyup', escClose);
    }

    function escClose(e) {
        if (e.keyCode == 27) {
            closeImg();
        }
    }
}

function showMyIcon() {
    popupImage('images/myicon.png', 'myicon', 'myicon-default', function() {
        var img = fzDOM.get('#dlgImage img');
        img.onclick = function(e) {
            var x = e.offsetX,
                y = e.offsetY,
                row = parseInt(y / 22),
                col = parseInt(x / 22),
                n = row * 10 + col + 1;

            appendResultString(fzString.format('.myicon-{0}', n));
        };
    });

}

function setFooter() {
    if (WEB_MODE == WEB_MODE_TYPE.WA) {
        fzDOM.addUI('.footer-links',
            fzDOM.createDom('a', '常用系统导航', null, null, 'href=../nav/;target=_blank')
        );
    } else if (WEB_MODE & WEB_MODE_TYPE.WWW == WEB_MODE_TYPE.WWW) {
        fzDOM.addUI('.footer-links',
            fzDOM.createDom('a', '开源情报工具导航', null, null, 'href=plugin/osint/index.html;target=_blank')
        );
    }

    fzDOM.addUI('.footer-links',
        fzDOM.createLinkbutton('更新日志', null, null, showReleaseHistory)
    );

    if (DEVELOP_MODE) { //开发模式显示常用链接
        fzDOM.addUI('.footer-links',
            fzDOM.createLinkbutton('myicon', null, null, showMyIcon),
            fzDOM.createDom('a', 'glyphicon', null, null, 'href=../lib/icons.html;target=_blank'),
            fzDOM.createDom('a', 'awesome', null, null, 'href=../lib/FontAwesome/FontAwesome.html;target=_blank'),
            fzDOM.createDom('a', '生产环境', null, null, 'href=' + URL_REMOTE_HTTP + 'datatool.html'),
        );
    } else { //非开发模式显示微信二维码
        var i = fzDOM.get('.footer-copyright');
        var wechatTip = new XTooltip({
            orientation: 't'
        });
        wechatTip.add(i, fzDOM.get("imgMyQR"));
        wechatTip.render();
    }
}

function showReleaseHistory() {
    $.get('./release_history.md', function(s) {
        var releaseContent = s;
        var releaseHTML = fzString.markdown2html(releaseContent);
        var divContent = fzDOM.createDom('div', releaseHTML, null, 'release-content-wrap');
        var windowHeight = fzDOM.windowHeight() * 0.75;
        var maxHeight = windowHeight - 24 - 24 - 35 - 44;
        divContent.style.maxHeight = maxHeight + 'px';

        new XDialog({
            title: 'DataTool 更新日志',
            logo: 'images/logo.png',
            prompt: false,
            content: divContent,
            modal: true,
            labelCancel: '关闭',
            labelOK: false,
            icon: false
        }).show();
    });
}

function repeatOnBlur() {

}

setFooter();