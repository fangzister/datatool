/**
 * @module fangzi的UI核心模块
 * 
 * @version 1.1.3
 * @date 2021/06/24 17:24:53
 * 修正XMenu标题后的...丢失的bug
 * 
 * @version 1.1.2
 * @date 2021/05/02 09:42:27
 * XDialog增加logo属性
 * 
 * @version 1.1.1
 * @date 2021/03/22 12:48:29
 * 增加XChooseBox
 * 
 * @version 1.1.0
 * @date 2020/12/24 10:55:19
 */

var FZUI_VERSION = '1.1.2';
var _xmsgbox = null;
var _xform_popuped_dropdown_id = null;
var _showingMenu = null;
var _xmenu_count = 0;
var _xloader_Count = 0;
var _xform_popuped_color = null;
var _globalXDropdownListCount = 0;

/**
 * 
 * @param       {object} _config 配置
 * @orientation {string} 箭头方向 ['top', 'left', 'right', 'bottom', 'l', 't', 'r', 'b'] 默认 b
 * @text        {string} 标题 默认使用绑定对象的title属性 可以是innerHTML 
 */
function XTooltip(_config) {
    const orientationEnum = ['top', 'left', 'right', 'bottom', 'l', 't', 'r', 'b'];
    var me = this;

    if (_config && _config.orientation && fzArray.inArray(_config.orientation, orientationEnum)) {
        this.orientation = _config.orientation.substring(0, 1);
    }
    this.orientation = this.orientation || 'b';

    this.id = null;
    this.ui = null;
    this.oText = null;
    this.oTitle = null;
    this.anchor = null;

    this.add = function(vObj, sTooltipText, sTooltipTitle) {
        if (!sTooltipText) {
            if (vObj.ui) {
                vObj = vObj.ui;
            }
            sTooltipText = fzDOM.getAttr(vObj, 'title');
            fzDOM.delAttr(vObj, 'title');
        }
        vObj.addEventListener('mouseover', function(e) {
            e.stopPropagation();
            var s = this.title ? this.title : sTooltipText;
            me.show(e.clientX, e.clientY, s, sTooltipTitle, this);
        });
        vObj.addEventListener('mouseout', function(e) {
            e.stopPropagation();
            me.hide();
        });
    };

    this.render = function(bindDoms) {
        createUI();
        fzDOM.addUI(document.body, this.ui);

        if (bindDoms) {
            var doms;
            if (isArray(bindDoms)) {
                doms = bindDoms;
                doms = [];
                fzArray.walk(bindDoms, function(x) {
                    fzArray.walk(fzDOM.queryAll(x), function(s) {
                        doms.push(s);
                    });
                });
            } else if (typeof bindDoms === 'string') {
                doms = fzDOM.queryAll(bindDoms);
            } else {
                return;
            }
            fzArray.walk(doms, function(x) {
                me.add(x);
            });
        }

        return this;
    };

    this.show = function(x, y, text, title, domFor) {
        fzDOM.css(me.ui, 'opacity', 0);
        me.oTitle.innerHTML = title || '';
        if (fzDOM.isDOM(text)) {
            fzDOM.resetChild(me.oText, text);
            fzDOM.show(text);
        } else {
            me.oText.innerHTML = text || '';
        }

        fzDOM.show(me.ui);
        var ANCHOR_WIDTH = 16,
            ANCHOR_HEIGHT = 16;

        var oDoc = document.documentElement,
            nDocHeight = oDoc.clientHeight,
            nDocWidth = oDoc.clientWidth,
            nLeft, nTop, nUIWidth = me.ui.offsetWidth,
            nUIHeight = me.ui.offsetHeight + ANCHOR_HEIGHT,
            nUILeft = me.ui.offsetLeft,
            oDomPos = fzDOM.getElementPos(domFor),
            nDomWidth = domFor.offsetWidth,
            nDomHeight = domFor.offsetHeight,
            nAnchorLeft;
        switch (me.orientation) {
            case 't':
                //出现在上面
                // dom的y坐标 - tooltip的高度 - 页面滚动的y < 0  则从下方出现
                var bShowOnBottom = (oDomPos.y - nUIHeight - oDoc.scrollTop) < 0;
                nLeft = oDomPos.x + Math.floor((nDomWidth - nUIWidth) * 0.5);
                if (nLeft < 0) {
                    nLeft = 0;
                    nAnchorLeft = Math.floor((nUIWidth - ANCHOR_WIDTH) * 0.5);
                    if (nAnchorLeft > nDomWidth) {
                        nAnchorLeft = Math.floor((nDomWidth - ANCHOR_WIDTH) * 0.5) + oDomPos.x;
                    }
                } else if (nLeft + nUIWidth > nDocWidth - 4) {
                    nLeft = nDocWidth - 4 - nUIWidth;
                    nAnchorLeft = oDomPos.x - nUILeft + Math.floor((nDomWidth - ANCHOR_WIDTH) * 0.5);
                } else {
                    nAnchorLeft = Math.floor((nUIWidth - ANCHOR_WIDTH) * 0.5);
                }
                if (bShowOnBottom) {
                    //ui在下方，anchor向上
                    me.anchor.className = 'xtooltip-anchor-t';
                    nTop = oDomPos.y + nDomHeight + ANCHOR_HEIGHT;
                } else {
                    //ui在上方，anchor向下
                    this.anchor.className = 'xtooltip-anchor-b';
                    nTop = oDomPos.y - nUIHeight;
                }
                break;
            case 'b':
                //出现在下面
                var ot = oDomPos.y + nUIHeight + ANCHOR_HEIGHT - oDoc.scrollTop;
                nLeft = oDomPos.x + Math.floor((nDomWidth - nUIWidth) * 0.5);
                if (nLeft < 0) {
                    nLeft = 0;
                    nAnchorLeft = Math.floor((nUIWidth - ANCHOR_WIDTH) * 0.5);
                    if (nAnchorLeft > nDomWidth) {
                        nAnchorLeft = Math.floor((nDomWidth - ANCHOR_WIDTH) * 0.5) + oDomPos.x;
                    }
                } else if (nLeft + nUIWidth > nDocWidth - 4) {
                    nLeft = nDocWidth - 4 - nUIWidth;
                    nAnchorLeft = oDomPos.x - nUILeft + Math.floor((nDomWidth - ANCHOR_WIDTH) * 0.5);
                } else {
                    nAnchorLeft = Math.floor((nUIWidth - 16) * 0.5);
                }
                if (ot < nDocHeight) {
                    //向下
                    fzDOM.replaceClass(this.anchor, 'xtooltip-anchor-b', 'xtooltip-anchor-t');
                    nTop = nUIHeight + oDomPos.y - ANCHOR_HEIGHT;
                } else {
                    //向上				
                    fzDOM.replaceClass(this.anchor, 'xtooltip-anchor-t', 'xtooltip-anchor-b');
                    nTop = oDomPos.y - nUIHeight - ANCHOR_HEIGHT;
                }
                break;
            case 'l':
                //箭头向左，box在右边
                //TODO
                // var ot = opos.y + uh + 8 - b.scrollTop;
                // l = opos.x + (ow - uw) * 0.5;
                // if (l < 0) {
                //     l = 0;
                //     al = (uw - 9) * 0.5;
                //     if (al > ow) {
                //         al = (ow - 9) * 0.5 + opos.x;
                //     }
                // } else if (l + uw > bw - 4) {
                //     l = bw - 4 - uw;
                //     al = opos.x - ul + (ow - 9) * 0.5;
                // } else {
                //     al = (uw - 9) * 0.5;
                // }
                // if (ot < bh) { //向下
                //     fzDOM.replaceClass(this.anchor, 'xtooltip-anchor-l', 'xtooltip-anchor-r');
                //     title = opos.y - uh - 8;
                // } else { //向上				
                //     fzDOM.replaceClass(this.anchor, 'xtooltip-anchor-r', 'xtooltip-anchor-l');
                //     title = opos.y + oh + 8;
                // }
                break;
            case 'r':
                //TODO
                // var ot = opos.y + uh + 8 - b.scrollTop;
                // l = opos.x + (ow - uw) * 0.5;
                // if (l < 0) {
                //     l = 0;
                //     al = (uw - 9) * 0.5;
                //     if (al > ow) {
                //         al = (ow - 9) * 0.5 + opos.x;
                //     }
                // } else if (l + uw > bw - 4) {
                //     l = bw - 4 - uw;
                //     al = opos.x - ul + (ow - 9) * 0.5;
                // } else {
                //     al = (uw - 9) * 0.5;
                // }
                // if (ot < bh) { //向下
                //     fzDOM.replaceClass(this.anchor, 'xtooltip-anchor-l', 'xtooltip-anchor-r');
                //     title = opos.y - uh - 8;
                // } else { //向上				
                //     fzDOM.replaceClass(this.anchor, 'xtooltip-anchor-r', 'xtooltip-anchor-l');
                //     title = opos.y + oh + 8;
                // }
                break;
            default:
                //无anchor
                if (y + this.ui.offsetHeight > nDocHeight) {
                    title = y - 18 + oDoc.scrollTop - this.ui.offsetHeight;
                } else {
                    title = y + 18 + oDoc.scrollTop;
                }
                if (x + this.ui.offsetWidth > nDocWidth) {
                    nLeft = x - 18 + oDoc.scrollLeft - this.ui.offsetWidth;
                } else {
                    nLeft = x + 15 + oDoc.scrollLeft;
                }
        }
        fzDOM.setPosition(this.anchor, nAnchorLeft);
        fzDOM.setPosition(this.ui, nLeft, nTop);

        fzDOM.css(me.ui, 'opacity', 1);
    };
    this.hide = function() {
        fzDOM.hide(me.ui);
    };

    function createUI() {
        me.ui = fzDOM.dom('xtooltip');
        me.oText = fzDOM.dom('xtooltip-text', 'p');
        me.oTitle = fzDOM.dom('xtooltip-title', 'strong');

        fzDOM.addUI(me.ui, me.oTitle, me.oText);
        me.anchor = fzDOM.dom('xtooltip-anchor-' + me.orientation);
        fzDOM.addUI(me.ui, me.anchor);

        me.anchor.onmouseover = function(e) {
            e.stopPropagation();
        };
        me.ui.onmouseover = function(e) {
            e.stopPropagation();
        }
    }

    // function documentMouseover() {
    //     me.hide();
    // }
}

/**
 * 消息框组件
 * @param {string} [title] 标题["提示"]
 * @param {*} [prompt] 提示文本 [字符串 | 字符串数组]
 * @param {*} [content] 内容DOM [HTMLElement]
 * @param {*} [icon] 图标样式[info|ok|alert|error|ask] 禁用图标将其设为false
 * @param {*} [labelOK] 确定按钮的文本 禁用确定按钮则将其设为false
 * @param {function} fnOK 点击确定按钮后的回调
 * @param {function} fnClose 关闭对话框后的回调
 */
function XMsgbox(title, prompt, content, icon, labelOK, fnOK, fnClose) {
    return new XDialog({
        title: title,
        prompt: prompt,
        content: content,
        icon: icon,
        labelOK: labelOK,
        fnOK: fnOK,
        labelCancel: false,
        defaultBtn: 'ok',
        fnClose: fnClose
    }).show();
}

function XConfirm(title, prompt, fnOK, fnClose, labelOK, labelCancel) {
    new XDialog({
        title: title,
        prompt: prompt,
        labelOK: labelOK || '确定',
        fnOK: function() {
            fzFnc.call(fnOK);
            return true;
        },
        labelCancel: labelCancel || '取消',
        defaultBtn: 'ok',
        fnClose: fnClose
    }).show();
}

/**
 * 简单提示框
 * @param {string} prompt 提示文本
 * @param {*} [title] 标题 ['提示']
 * @param {*} [icon] 图标 [info|ok|alert|error|ask] 默认:info
 * @param {*} [fnClose] 关闭后回调
 */
function XAlert(prompt, title, icon, fnClose) {
    new XDialog({
        title: title || '提示',
        prompt: prompt || '提示',
        icon: icon || 'info',
        labelCancel: false,
        fnOK: function() {
            fnClose && fnClose();
            return true;
        },
        fnClose: fnClose,
        defaultBtn: 'ok',
        outerClickClose: true
    }).show();
}

/**
 * 对话框组件
 * @param           {object}         _config 选项配置
 * @title           {string}         对话框标题 
 * @prompt          {string | false} 提示文本 设为false不提示
 * @icon            {string | false} 图标的className 设为false不显示 ['info', 'ok', 'alert', 'error', 'ask']
 * @content         {HTMLElement}    内容
 * @modal           {boolean}        是否显示为模态对话框 默认true
 * @labelOK         {string | false} 确定按钮的文本 设为false不显示
 * @labelCancel     {string | false} 取消按钮的文本 设为false不显示 当OK和Cancel都不显示时，不显示foot
 * @fnOK            {function}       点击确定的回调
 * @fnClose         {function}       关闭回调 点击X或取消按钮时触发
 * @defaultBtn      {string}         默认按钮 ['cancel'] | 'ok' 对话框显示后默认聚焦的按钮
 * @outerClickClose {boolean}        若设为true，则点击对话框之外关闭对话框
 * @movable         {boolean}        是否允许拖动位置 默认true
 * @onShow          {function}       对话框显示之前调用的方法
 */
function XDialog(_config) {
    var me = this;
    var icons = ['info', 'ok', 'alert', 'error', 'ask'];
    _config = _config || {};

    var config = {
        id: _config.id || 'xdialog',
        title: _config.title || '对话框',
        logo: _config.logo,
        prompt: _config.prompt || '',
        content: _config.content,
        modal: _config.modal === false ? false : true,
        labelOK: _config.labelOK === false ? false : _config.labelOK || '确定',
        labelCancel: _config.labelCancel === false ? false : _config.labelCancel || '取消',
        fnOK: _config.fnOK,
        fnClose: _config.fnClose,
        defaultBtn: _config.defaultBtn || 'cancel',
        outerClickClose: _config.outerClickClose,
        movable: _config.movable === false ? false : true,
        onShow: _config.onShow
    };

    if (_config.icon === false) {
        config.icon = false;
    } else {
        if (!_config.icon) {
            config.icon = 'xdialog-icon-info';
        } else {
            if (fzArray.inArray(_config.icon, icons)) {
                config.icon = 'xdialog-icon-' + _config.icon;
            }
        }
    }

    this.id = config.id;

    this.close = function() {
        document.removeEventListener('keyup', hotkey);
        if (config.outerClickClose) {
            document.removeEventListener('click', me.close);
        }
        fzDOM.remove(me.ui);
        if (config.modal) {
            fzDOM.remove(me.oCover);
        }
        fzFnc.call(config.fnClose);
    }

    if (!config.fnOK && !config.fnClose) {
        config.fnOK = this.close;
    }

    /**
     * @param {*} fnShow 对话框显示出来后执行的方法或者聚焦的DOM
     */
    this.show = function(fnShow) {
        var cw = document.body.offsetWidth,
            ch = fzDOM.windowHeight();

        fzDOM.css(me.ui, 'opacity', 0);
        fzDOM.addUI(document.body, me.ui);

        if (config.onShow) {
            config.onShow();
        }

        var l = (cw - me.ui.offsetWidth) * 0.5,
            t = (ch - me.ui.offsetHeight) * 0.33;

        fzDOM.setPosition(me.ui, l, t);
        fzDOM.css(me.ui, 'opacity', 1);

        if (fzFnc.isFunction(fnShow)) {
            fnShow();
        } else {
            if (fnShow) {
                fzDOM.setFocus(fnShow, true);
            } else {
                // debugger
                fzDOM.setFocus('.xdialog-' + config.defaultBtn);
            }
        }
        return me;
    }

    createUI();

    function createUI() {
        me.ui = fzDOM.dom('xdialog', null, null, me.id);

        fzDOM.addUI(me.ui, makeHead(), makeBody(), makeFoot());

        document.addEventListener('keyup', hotkey);

        me.ui.onclick = function(e) {
            e.stopPropagation();
        };

        if (config.modal) {
            me.oCover = fzDOM.dom('xdialog-cover');
            document.body.appendChild(me.oCover);
        }

        if (config.outerClickClose) {
            if (config.modal) {
                me.oCover.onclick = function() {
                    me.close();
                };
            } else {
                document.addEventListener('cilck', me.close);
            }
        } else {
            if (config.modal) {
                me.oCover.onclick = function() {
                    var i = 0,
                        j = 0;
                    var inv = setInterval(function() {
                        i++;
                        if (i >= 4) {
                            clearInterval(inv);
                            inv = null;
                        }
                        if (j == 0) {
                            fzDOM.appendClass(me.ui, 'xdialog-blink');
                            j = 1;
                        } else {
                            fzDOM.removeClass(me.ui, 'xdialog-blink');
                            j = 0;
                        }
                    }, 50);
                };
            }
        }

        function makeHead() {
            var btnX = fzDOM.createLinkbutton(null, null, 'xdialog-btnx', me.close, null, null);
            btnX.onmousedown = function(e) {
                e.stopPropagation();
            };

            //
            var oLogo;
            if (config.logo) {
                oLogo = fzDOM.dom('xdialog-logo', 'b');
                oLogo.style.backgroundImage = 'url(' + config.logo + ')';
            }

            var oHead = fzDOM.addUI(
                fzDOM.dom('xdialog-head'),
                oLogo,
                fzDOM.dom('xdialog-title', 'strong', config.title),
                btnX
            );

            var moveStart = false;

            if (config.movable) {
                oHead.onmousedown = function(e) {
                    var dragcover = fzDOM.dom('.xdialog-dragcover');
                    me.ui.appendChild(dragcover);
                    document.body.style.cursor = 'move';
                    var cx = e.clientX,
                        cy = e.clientY,
                        sl = parseFloat(me.ui.style.left),
                        st = parseFloat(me.ui.style.top),
                        ww = fzDOM.windowWidth(),
                        wh = fzDOM.windowHeight(),
                        meWidth = me.ui.offsetWidth,
                        meHeight = me.ui.offsetHeight;

                    window.onmousemove = function(e) {
                        if (!moveStart) {
                            moveStart = true;
                        }
                        if (moveStart) {
                            var x = e.clientX,
                                y = e.clientY,
                                offX = x - cx,
                                offY = y - cy,
                                l = sl + offX,
                                t = st + offY;

                            if (l < 0) {
                                l = 0;
                            } else if (l + meWidth > ww) {
                                l = ww - meWidth;
                            }

                            if (t < 0) {
                                t = 0;
                            } else if (t + meHeight > wh) {
                                t = wh - meHeight;
                            }

                            me.left = l;
                            me.top = t;

                            fzDOM.setPosition(me.ui, me.left, me.top);
                        }
                    }
                    window.onmouseup = function() {
                        this.onmousemove = null;
                        this.onmouseup = null;
                        dragcover.remove();
                        document.body.style.cursor = '';
                        moveStart = false;
                    };
                };
            } else {
                fzDOM.appendClass(oHead, 'xdialog-head-nomove');
            }
            return oHead;
        }

        function makeBody() {
            if (config.icon !== false) {
                var oIcon = fzDOM.dom('xdialog-icon ' + config.icon, 'b');
            }
            if (config.prompt) {
                var oPrompt = fzDOM.dom('xdialog-prompt', null, config.prompt);
            }
            if (oIcon || oPrompt) {
                var oDesc = fzDOM.addUI(fzDOM.dom('xdialog-desc'), oIcon, oPrompt);
            } else {
                fzDOM.appendClass(me.ui, 'xdialog-nopadding');
            }
            if (config.content) {
                var oFrame = fzDOM.dom('xdialog-frame');
                if (typeof config.content == 'string') {
                    oFrame.innerHTML = config.content;
                } else {
                    fzDOM.addTo(oFrame, config.content);
                }
                var oMask = fzDOM.dom('xdialog-mask');
            }
            return fzDOM.addUI(fzDOM.dom('xdialog-body'), oDesc, oFrame, oMask);
        }

        function makeFoot() {
            if (config.labelOK) {
                var btnOK = fzDOM.createButton('xdialog-button xdialog-ok', null, function() {
                    if (config.fnOK()) {
                        me.close();
                    }
                }, config.labelOK);
            }
            if (config.labelCancel) {
                var btnCancel = fzDOM.createButton('xdialog-button xdialog-cancel', null, me.close, config.labelCancel);
            }
            if (btnOK || btnCancel) {
                return fzDOM.addUI(fzDOM.dom('xdialog-foot'), btnCancel, btnOK);
            }
        }
    }

    function hotkey(e) {
        switch (e.keyCode) {
            case 13:
                //回车
                if (config.fnOK) {
                    if (config.fnOK()) {
                        me.close();
                    }
                    return;
                }
                break;
            case 27:
                //ESC
                return me.close()
        }
    }
}

/**
 * 输入对话框
 * @param {string} title 标题
 * @param {*} prompt 提示文本 [string | array]
 * @param {string} [defaultValue] 默认值
 * @param {function} fnOK 点击确定按钮并且验证成功后的回调，传参数为控件的value
 * @param {number} inputWidth 输入控件的宽度
 * @param {function} fnClose 关闭后的回调
 * @param {object} attributes 输入控件的额外属性
 * @param {object} validator 验证规则
 * @param {string} [type] 输入控件类型
 * @validator 说明
 * @msgOK           {string}      成功提示
 * @msgDefault      {string}      默认提示
 * @msgFocus        {string}      聚焦提示
 * @msgRequired     {string}      必须输入提示
 * @regexp          {regexp}      正则验证表达式
 * @msgRegexp       {string}      正则失败提示
 * @strlenType      {string}      验证长度按字符还是字节 [Char|Byte]
 * @minLength       {number}      最小长度
 * @msgMinLength    {string}      小于最小长度提示
 * @maxLength       {number}      最大长度
 * @msgMaxLength    {string}      大于最大长度提示
 * @compareField    {HTMLElement} 与之对比的DOM
 * @compareOperator {string}      比较运算符
 * @msgCompare      {string}      比较失败的提示
 * @fnCustom        {function}    自定义验证方法
 * @msgCustom       {string}      自定义验证方法失败的提示
 * @ajaxURL         {string}      ajax验证的URL
 * @msgAjax         {string}      ajax验证失败的提示
 * @ajaxCallback    {function}    ajax回调
 * @ajaxOKCallback  {function}    ajax成功回调
 * @callback        {function}    验证成功的回调
 * @disableOKIcon   {boolean}     是否禁用图标 [false]
 */
function XInputbox(title, prompt, defaultValue, fnOK, inputWidth, fnClose, attributes, validator, type) {
    //TODO
    //设置了验证规则时，如果默认值无效，则确定按钮禁用

    if (!fnOK) {
        return console.error('XInputbox缺少必要参数：fnOK');
    }
    inputWidth = inputWidth || 120;
    defaultValue = defaultValue || '';

    var txt = fzDOM.createInput(type, 'xinput-text', null, attributes);
    var tip = fzDOM.dom('xinput-tip', 'p', null, 'xinputTip');

    txt.value = defaultValue;
    fzDOM.setWidth(txt, inputWidth);
    var vld;

    var dlg = new XDialog({
        title: title,
        prompt: prompt,
        fnOK: function() {
            if (vld && vld.invalid) {
                return false;
            }
            var v = txt.value;
            if (fnOK(v) !== false) {
                dlg.close();
            };
        },
        fnClose: fnClose,
        content: [txt, tip]
    });
    dlg.show();

    if (validator) {
        vld = new XValidator(txt, false, null, validator);
        vld.render();
    }
    fzDOM.setFocus(txt, true);

    return dlg;
}

function XNumberBox(title, prompt, defaultValue, fnOK, fnClose, maxValue, minValue, compareField, compareOperator, msgCompare) {
    var vld = compareField && {
        compareField: compareField,
        compareOperator: compareOperator,
        msgCompare: msgCompare
    };
    XInputbox(title, prompt, defaultValue, fnOK, null, fnClose, {
        max: maxValue,
        min: minValue
    }, vld, 'number');
}

/**
 * 弹出带下拉列表的对话框
 * @param {string} title 对话框标题
 * @param {string} prompt 提示文本
 * @param {array} options 列表项 [string | object{text,value,cls,icon,selected} | stringValueText 'value:text']
 * @param {string} fnOK 确定回调
 * @param {string} [fnChange] 选项变更回调[未实现]
 * @param {string} [editable] 支持编辑[未实现]
 * @param {string} [dropdownWidth] 下拉列表宽度
 * @param {string} [visibleCount] 最多可见列表项数量 [10]
 * @param {string} [fnClose] 关闭对话框回调
 * @param {number} [defaultIndex] 默认选中的索引
 */
function XDropdownBox(title, prompt, options, fnOK, fnChange, editable, dropdownWidth, visibleCount, fnClose, defaultIndex) {
    if (!fnOK && !fnChange) {
        return console.error('XInputbox缺少必要参数：fnOK || fnChange');
    }
    var oDropdownList = new XDropdownList('XDropdownBox_DropdownList', {
        options: options,
        width: dropdownWidth,
        visibleCount: visibleCount,
        editable: editable,
        onchange: fnChange,
        defaultIndex: defaultIndex
    });

    var dlg = new XDialog({
        title: title,
        prompt: prompt,
        fnOK: function() {
            if (fnOK(oDropdownList.value) !== false) {
                dlg.close();
            };
        },
        fnClose: fnClose,
        content: oDropdownList.createUI()
    }).show();

    return this;
}

/**
 * 
 * @param {string} title 对话框标题
 * @param {string} prompt 提示文本
 * @param {array} options 列表项 [string | object{text,value,cls,icon,selected} | stringValueText 'value:text']
 * @param {string} fnOK 确定回调
 * @param {string} [fnChange] 选项变更回调[未实现]
 * @param {string} [fnClose] 关闭对话框回调
 * @param {number} [defaultIndex] 默认选中的索引
 */
function XChooseBox(title, prompt, options, fnOK, fnChange, fnClose, defaultIndex) {
    if (!fnOK && !fnChange) {
        return console.error('XInputbox缺少必要参数：fnOK || fnChange');
    }

    var radioList = fzDOM.createRadioList(options, 'xchoosebox', defaultIndex);

    var dlg = new XDialog({
        title: title,
        prompt: prompt,
        fnOK: function() {
            var rad = radioList.querySelector('input[type=radio][checked=checked]');
            if (fnOK(rad.value) !== false) {
                dlg.close();
            };
        },
        fnClose: fnClose,
        content: radioList
    }).show();

    return this;
}

/**
 * 下拉列表
 * @param {string} id DropdownList中的input hidden 的Id
 * @param {object} config 配置选项
 * @options {array} 列表项 [string | object{text,value,cls,icon,selected} | stringValueText 'value:text']
 * @name {string} hidden input的name属性 ['']
 * @width {number} 宽度 //140
 * @visibleCount {number} 最大可见列表项数量 //10
 * @value {*} 默认值 //''
 * @defaultIndex {number} 默认选中的列表项索引 //0
 * @editable {boolean} 是否支持编辑 //false
 * @onchange {function} 列表项改变事件
 */
function XDropdownList(id, _config) {
    var me = this;
    this.id = id || 'XDropdownList-' + _globalXDropdownListCount;
    _globalXDropdownListCount++;

    _config = _config || {};
    var config = {
        id: _config.id || 'XDropdownList',
        options: _config.options,
        name: _config.name || '',
        defaultIndex: 0,
        value: _config.value || '',
        width: _config.width || 140,
        extendFont: _config.extendFont || false,
        visibleCount: _config.visibleCount || 10,
        onchange: _config.onchange || null,
        editable: _config.editable || false,
        fontSize: _config.fontSize
    };
    if (typeof _config.defaultIndex == 'number' && _config.defaultIndex > -2) {
        config.defaultIndex = _config.defaultIndex;
    }
    me.selectedIndex = config.defaultIndex;
    me.editable = config.editable;
    //runtime properties	
    me.selectedItem = null;
    me.selectedIndex = -1;

    //DOM
    this.ui = null;
    this.oListWrapper = null;
    this.oList = null;
    this.oValue = null;
    this.oTextWrapper = null;
    this.oText = null;
    this.oTrigger = null;

    //vars
    this.isShow = false;

    //events
    this.onItemClicked = function(oLi) {};
    this.onchange = config.onchange || function(newValue, oldValue) {};
    //functions
    this.reset = function() {
        this.selectByIndex(this.defaultIndex, false);
    };
    this.getValue = function() {
        return this.oValue.value;
    };

    this.getLongValue = function() {
        var v = this.getValue();
        if (isNaN(v)) {
            return 0;
        }
        return parseInt(v);
    };
    this.setValue = function(v) {
        this.oValue.value = v;
        this.value = v;
    };
    this.getText = function() {
        return this.oText.innerHTML;
    };
    this.getItemById = function(nID) {
        return fzDOM.get(this.id + '-item-' + nID);
    };
    this.getItem = function(vItem) {
        return fzDOM.get(vItem) || this.getItemById(vItem);
    };
    this.getItems = function() {
        return fzDOM.queryAll(':scope>li', this.oList);
    };
    this.getItemCount = function() {
        return this.getItems.length;
    };
    //添加列表项	
    this.addItem = function(jsonItem, nIndex, bSelect, bCauseClick, sClassName) {
        var li;
        if (nIndex == null) {
            li = this.createListItem(jsonItem.text, jsonItem.value, sClassName, this.getItemCount());
            this.oList.appendChild(li);
        } else {
            li = this.createListItem(jsonItem.text, jsonItem.value, sClassName, nIndex);
            var n = this.oList.firstElementChild;
            if (n) {
                fzDOM.insertBefore(li, n);
                var lis = this.oList.getElementsByTagName('li');
                for (var i = nIndex + 1, l = lis.length; i < l; i++) {
                    fzDOM.setAttr(lis[i], 'index', i);
                }
            } else {
                fzDOM.addTo(this.oList, li);
            }
        }
        if (bSelect) {
            this.selectByIndex(nIndex, bCauseClick);
        }
    };
    //设置列表项
    this.setItems = function(jsonArray, nSelectedIndex, bCauseClick) {
        if (nSelectedIndex == null) {
            nSelectedIndex = -1;
        }
        me.oList.innerHTML = '';
        me.oText.innerHTML = '';
        me.selectedIndex = -1;
        me.defaultIndex = -1;
        me.selectedItem = null;
        me.createListItems(jsonArray);
        if (nSelectedIndex > -1 && nSelectedIndex < jsonArray.length) {
            me.selectedIndex = nSelectedIndex;
            me.selectByIndex(me.selectedIndex, bCauseClick);
        } else {
            if (me.defaultIndex > -1) {
                me.selectedIndex = me.defaultIndex;
                me.selectByIndex(me.selectedIndex, bCauseClick);
            }
        }
    };

    //{text:'',value:var,cls:'',selected:boolean,icon:'' }
    this.queryItem = function(sURL, nSelectedIndex, bCauseClick, callback) {
        console.warn('未实现');
        // fzCore.ajaxJSON(sURL, function(o) {
        //     if (o) {
        //         me.setItems(o, nSelectedIndex, bCauseClick);
        //         if (callback) {
        //             callback();
        //         }
        //     } else {
        //         me.clearList();
        //     }
        //     if (typeof callback == 'function') {
        //         callback();
        //     }
        // });
    };
    //删除列表项
    this.removeItem = function(vItem) {
        var oItem = this.getItem(vItem),
            nIndex = fzDOM.getAttrLong(oItem, 'index');
        if (nIndex == this.selectedIndex) {
            this.selectedIndex = -1;
        }
        this.oList.removeChild(oItem);
    };
    //清空列表
    this.clearList = function(defaultValue) {
        this.setValue(isNull(defaultValue));
        this.oText.innerHTML = '';
        this.oList.innerHTML = '';
        this.selectedIndex = -1;
        this.selectedItem = null;
    };
    this.clear = function() {
        this.clearList();
    };
    this.selectByItem = function(objLi, bCauseClick) {
        if (this.selectedItem != null) {
            fzDOM.removeClass(this.selectedItem, 'xdropdownlist-item-selected');
        }
        var oldValue = this.getValue();
        if (objLi == null) {
            this.oText.value = '';
            this.selectedItem = null;
            this.selectedIndex = -1;
            this.setValue('');
            if (bCauseClick === true) {
                this.onchange('', oldValue);
            }
            return;
        } else {
            fzDOM.appendClass(objLi, 'xdropdownlist-item-selected');
            this.oText.innerHTML = objLi.innerHTML;
            this.setValue(objLi.getAttribute('value'));
            if (this.extendFont) {
                var ff = fzDOM.getStyle(objLi, 'fontFamily');
                if (ff) {
                    this.oText.style.fontFamily = ff;
                }
                var fs = fzDOM.getStyle(objLi, 'fontSize');
                if (fs) {
                    this.oText.style.fontSize = fs;
                }
                var fw = fzDOM.getStyle(objLi, 'fontWeight');
                if (fw) {
                    this.oText.style.fontWeight = fw;
                }
            }
            if (bCauseClick === true) {
                this.onItemClicked(objLi);
            }
        }
        if (this.oListWrapper.style.display == 'block') {
            this.hideList();
        }
        if (this.selectedItem != objLi) {
            if (bCauseClick) {
                this.onchange(this.getValue(), oldValue);
            };
        }
        this.selectedItem = objLi;
    };
    this.selectByIndex = function(nIndex, bCauseClick) {
        if (nIndex < 0 || nIndex >= this.oList.childNodes.length) {
            this.selectByItem(null, bCauseClick);
        } else {
            this.selectByItem(this.oList.childNodes[nIndex], bCauseClick);
        }
    };
    this.selectByText = function(sText, bCauseClick) {
        var ms = this.oList.childNodes,
            k = this.selectedIndex == -1 ? 0 : this.selectedIndex;
        for (var i = k, l = ms.length; i < l; i++) {
            if (ms[i].innerHTML == sText) {
                this.selectByItem(ms[i], bCauseClick);
                return true;
            }
        }
        return false;
    };
    this.selectByValue = function(sValue, bCauseClick) {
        var ms = this.oList.childNodes;
        for (var i = 0, l = ms.length; i < l; i++) {
            if (fzDOM.getAttr(ms[i], 'value') == sValue) {
                this.selectByItem(ms[i], bCauseClick);
                return true;
            }
        }
        return false;
    };
    this.selectItem = function(vItemDesc, bCauseClick) {
        switch (typeof vItemDesc) {
            case 'number':
                return this.selectByIndex(vItemDesc, bCauseClick);
            case 'string':
                return this.selectByText(vItemDesc, bCauseClick);
            case 'object':
                return this.selectByItem(vItemDesc, bCauseClick);
            default:
                return console.error(vItemDesc, '参数类型错误');
        }
    };

    this.showList = function() {
        if (parent._xform_popuped_dropdown_id) {
            if (parent._xform_popuped_dropdown_id.isShow) {
                parent._xform_popuped_dropdown_id.hideList();
            }
        }
        if (_xform_popuped_dropdown_id && _xform_popuped_dropdown_id != me) {
            if (_xform_popuped_dropdown_id.isShow) {
                _xform_popuped_dropdown_id.hideList();
            }
        }
        if (_xform_popuped_color) {
            _xform_popuped_color.hide();
        }

        _xform_popuped_dropdown_id = me;

        if (!me.oListWrapper.parentNode) {
            fzDOM.insertAfter(me.oListWrapper, me.ui);
        }

        var items = me.oList.children,
            ch = document.documentElement.clientHeight,
            sh = document.documentElement.scrollTop,
            up = fzDOM.getElementPos(me.ui),
            ut = up.y - sh,
            ub = ut + me.ui.offsetHeight,
            ul = up.x,
            uw = me.ui.offsetWidth,
            lh = Math.min(config.visibleCount, items.length == 0 ? 1 : items.length) * 22;

        if (ub + lh > ch) {
            fzDOM.setPosition(me.oListWrapper, ul, ut - lh - 2 + sh, uw - 2, lh);
        } else {
            fzDOM.setPosition(me.oListWrapper, ul, ub + sh, uw - 2, lh);
        }
        fzDOM.toggleVisible(me.oListWrapper);
        me.isShow = true;
        //		fzCore.replaceClass(me.oTrigger, 'xdropdownlist-trigger-over', 'xdropdownlist-trigger-push');
        pushTragger();

        var docs = fzDOM.getAllDocuments();
        for (var i = 0, l = docs.length; i < l; i++) {
            docs[i].addEventListener('mousedown', me.hideList);
            docs[i].addEventListener('keydown', me.hideList);
        }
    };

    this.hideList = function() {
        if (_xform_popuped_dropdown_id == this) {
            _xform_popuped_dropdown_id = null;
        }
        fzDOM.toggleVisible(me.oListWrapper);

        var docs = fzDOM.getAllDocuments();
        for (var i = 0, l = docs.length; i < l; i++) {
            docs[i].removeEventListener('mousedown', me.hideList);
            docs[i].removeEventListener('keydown', me.hideList);
        }
        fzDOM.removeClass(me.oTrigger, 'xdropdownlist-trigger-push');
        fzDOM.removeAllClassOf(me.oList, 'li', 'xdropdownlist-item-over');
        me.isShow = false;
    };

    /**
     * 渲染到某个DOM上
     * @param {*} o [Id | Selector | HTMLElement]
     */
    this.render = function(o) {
        this.createUI();
        fzDOM.addTo(o, this.ui);
        return this.ui;
    };

    this.attach = function(o) {
        attachUI(fzDOM.get(o));
    };

    function pushTragger() {
        fzDOM.replaceClass(me.oTrigger, 'xdropdownlist-trigger-over', 'xdropdownlist-trigger-push');
    }

    function init() {
        me.ui = fzDOM.dom('xdropdownlist', null, null, me.id + '-wrap');
        me.oListWrapper = fzDOM.dom('xdropdownlist-listwrapper', null, null, me.id + '-listwrap');
        me.oList = fzDOM.dom('xdropdownlist-list', 'ul', null, me.id + '-list');
        me.oTextWrapper = fzDOM.dom('xdropdownlist-textwrapper', null, null, me.id + '-textwrapper');
        me.oValue = fzDOM.createInput('hidden', me.id);

        //TODO
        // if (me.editable) {
        //     me.oText = fzDOM.dom('xdropdownlist-text', 'input');
        // } else {
        //     me.oText = fzDOM.dom('xdropdownlist-text', 'span');
        // }

        me.oText = fzDOM.dom('xdropdownlist-text', 'span');
        if (config.fontSize) {
            me.oText.style.fontSize = config.fontSize + 'px';
        }

        me.oTrigger = fzDOM.dom('xdropdownlist-trigger', null, null, me.id + '-trigger');

        fzDOM.setAttr(me.oValue, 'name', me.name);
        fzDOM.addUI(me.oTextWrapper, me.oText, me.oTrigger);
        me.oListWrapper.appendChild(me.oList);
        fzDOM.addUI(me.ui, me.oTextWrapper, me.oValue);
        // document.body.appendChild(me.oListWrapper);
        me.ui.style.width = config.width + 'px';
        me.oText.style.width = config.width - 25 + 'px';
        me.oListWrapper.style.display = 'none';

        //		me.oText.onmouseup = function(e) { if (me.isShow) { me.hideList(); e.stopPropagation(); } else { me.showList(); } };
        me.oText.onmousedown = function(e) {
            if (me.isShow) {
                me.hideList();
                e.stopPropagation();
            } else {
                me.showList();
                pushTragger();
            }
        };
        me.oTrigger.onmousedown = function(e) {
            if (me.isShow) {
                me.hideList();
                e.stopPropagation();
            } else {
                me.showList();
                pushTragger();
            }
        };
        //		me.oTrigger.onmouseup = function(e) { if (me.isShow) { me.hideList(); } else { me.showList(); } };

        me.ui.onmousedown = function(e) {
            /*document.onmouseup = function() { fzDOM.removeClass(me.oTrigger, 'xdropdownlist-trigger-push'); }; */
            if (me.isShow) {
                e.stopPropagation();
            }
        };
        me.ui.onmouseover = function() {
            fzDOM.appendClass(me.oTrigger, 'xdropdownlist-trigger-over');
        };
        me.ui.onmouseout = function() {
            fzDOM.removeClass(me.oTrigger, 'xdropdownlist-trigger-over');
        };

        me.oListWrapper.onmousedown = function(e) {
            if (me.getItemCount == 0) {
                me.hideList();
            }
            e.stopPropagation();
        };
    }

    function attachUI(m) {
        if (!me.id) {
            if (!m.id || me.id) {
                return console.error('<p>dropdownlist.attach id must be defined</p>', '创建XSet对象错误:XDropdownList');
            }
            me.id = m.id;
        }
        if (m.name) {
            me.name = m.name;
        } else {
            me.name = m.id;
        }
        var mc = fzDOM.getAttrLong(m, 'maxitemcount');
        if (mc) {
            me.visibleCount = mc;
        }
        if (!me.width) {
            me.width = m.offsetWidth;
        }
        me.init();
        attachListItems(m);
        if (me.selectedIndex == -1) {
            me.selectedIndex = me.defaultIndex;
        }

        m.parentNode.insertBefore(me.ui, m);
        m.remove();

        if (me.selectedIndex > -1) {
            me.selectByIndex(me.selectedIndex);
        }
        if (m.onchange) {
            me.onchange = m.onchange;
        }
    };
    this.createUI = function() {
        init();
        if (isArray(config.options)) {
            createListItems(config.options);
            if (config.value) {
                me.selectByValue(config.value);
            } else {
                me.selectedIndex = config.defaultIndex;
                if (me.selectedIndex > -1) {
                    me.selectByIndex(me.selectedIndex);
                }
            }
        }
        return me.ui;
    };

    function attachListItems(m) {
        var opts = m.children;
        for (var i = 0, l = opts.length; i < l; i++) {
            if (opts[i].selected || fzDOM.getAttr(opts[i], 'selected') == 'selected') {
                me.selectedIndex = i;
            }
            var icon = fzDOM.getAttr(opts[i], 'icon');
            var li = createListItem(opts[i].innerHTML, opts[i].value, opts[i].className, i, false, icon);
            me.oList.appendChild(li);
        }
    }

    function createListItem(sText, vValue, sClass, nIndex, bSelect, sIcon) {
        if (sIcon) {
            sText = '<b class="' + sIcon + '"></b><em>' + sText + '</em>';
        }
        var li = fzDOM.dom('xdropdownlist-item', 'li', sText);
        if (isEmpty(vValue)) {
            vValue = sText;
        }
        if (sClass) {
            fzDOM.appendClass(li, sClass);
        }
        li.id = me.id + '-item-' + vValue;
        fzDOM.setAttr(li, 'value', vValue);
        fzDOM.setAttr(li, 'title', fzString.cleanHTML(sText));
        li.onmouseover = function() {
            fzDOM.appendClass(this, 'xdropdownlist-item-over');
        };
        li.onmouseout = function() {
            if (me.oListWrapper.style.display == 'block') {
                fzDOM.removeClass(this, 'xdropdownlist-item-over');
            }
        };
        li.onclick = function() {
            me.selectByItem(this, true);
        };
        li.onmousedown = function(e) {
            e.stopPropagation();
        };
        fzDOM.setAttr(li, 'index', nIndex);
        if (bSelect) {
            me.defaultIndex = nIndex;
        }
        return li;
    }

    function createListItems(arrItems) {
        for (var i = 0, l = arrItems.length; i < l; i++) {
            var item = arrItems[i];
            if (item && typeof item == 'string') {
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
            var li = createListItem(item.text, item.value, item.cls, i, item.selected, item.icon);
            me.oList.appendChild(li);
        }
    }
}

//输入验证对象
//vInput：要验证的控件，可以是Id或对象。
//vMsg：绑定的消息控件，可以是Id或对象。
//      如果省略该参数，将采用input的下一个元素。
//      如果FormValidator中定义了globalMsg，则只改变vMsg的class，消息文本控件将继承于FormValidator的globalMsg对象
//vIcon:绑定的图标显示控件。如果忽略，则采用msg；如果设为false，则忽略Icon
//vForm：绑定的表单，可以是Id或对象。如果省略该参数，将继承于FormValidator的form对象
/**
 * 
 * @param {*} vInput 绑定的input [Id | Selector | HTMLElement]
 * @param {*} vIcon 设为false则不使用图标
 * @param {*} vMsg 
 * @param {*} config 
 * @msgOK           {string}      成功提示
 * @msgDefault      {string}      默认提示
 * @msgFocus        {string}      聚焦提示
 * @msgRequired     {string}      必须输入提示
 * @regexp          {regexp}      正则验证表达式
 * @msgRegexp       {string}      正则失败提示
 * @strlenType      {string}      验证长度按字符还是字节 [Char|Byte]
 * @minLength       {number}      最小长度
 * @msgMinLength    {string}      小于最小长度提示
 * @maxLength       {number}      最大长度
 * @msgMaxLength    {string}      大于最大长度提示
 * @compareField    {HTMLElement} 与之对比的DOM
 * @compareOperator {string}      比较运算符
 * @msgCompare      {string}      比较失败的提示
 * @fnCustom        {function}    自定义验证方法
 * @msgCustom       {string}      自定义验证方法失败的提示
 * @ajaxURL         {string}      ajax验证的URL
 * @msgAjax         {string}      ajax验证失败的提示
 * @ajaxCallback    {function}    ajax回调
 * @ajaxOKCallback  {function}    ajax成功回调
 * @callback        {function}    验证成功的回调
 * @disableOKIcon   {boolean}     是否禁用图标 [false]
 */
function XValidator(vInput, vIcon, vMsg, _config) {
    var me = this;
    me.ui = fzDOM.get(vInput);
    if (!me.ui) {
        return console.error('验证控件不存在:' + vInput);
    }
    me.defaultIcon = 'xvalidator-def';
    me.msgIcon = 'xvalidator-msg';
    me.errorIcon = 'xvalidator-err';
    me.okIcon = 'xvalidator-ok';
    me.ajaxIcon = 'xvalidator-load';
    me.emptyIcon = 'xvalidator-none';
    if (vIcon !== false) {
        me.msg = fzDOM.get(vMsg);
    }
    if (!me.msg) {
        me.msg = me.ui.nextElementSibling;
    }
    me.icon = fzDOM.get(vIcon);
    if (!vIcon) {
        me.icon = me.msg;
    }
    fzDOM.appendClass(me.msg, 'xvalidator');
    fzDOM.appendClass(me.icon, 'xvalidator');

    var initClass = '';
    if (me.icon) {
        initClass = me.icon.className;
    }

    this.invalid = true;

    var config = _config || {};
    me.msgOK = config.msgOK || '';
    me.msgDefault = config.msgDefault || '';
    me.msgFocus = config.msgFocus || '';
    me.msgRequired = config.msgRequired || '';
    me.regexp = config.regexp || null;
    me.msgRegexp = config.msgRegexp || '';
    me.strlenType = config.strlenType || 'Char';
    me.minLength = config.minLength || 0;
    me.msgMinLength = config.msgMinLength || '';
    me.maxLength = config.maxLength || 0;
    me.msgMaxLength = config.msgMaxLength || '';
    me.compareField = config.compareField || null;
    me.compareOperator = config.compareOperator || '';
    me.msgCompare = config.msgCompare || '';
    me.fnCustom = config.fnCustom || null;
    me.msgCustom = config.msgCustom || '';
    me.ajaxURL = config.ajaxURL || '';
    me.msgAjax = config.msgAjax || '';
    me.lastAjaxErrorValue = config.lastAjaxErrorValue || null;
    me.ajaxCallback = config.ajaxCallback || null;
    me.ajaxOKCallback = config.ajaxOKCallback || null;
    me.callback = config.callback || null;
    me.disableOKIcon = config.okIcon || true;

    if (config.disableOKIcon) {
        me.okIcon = 'xvalidator-none';
    }

    this.render = function() {
        me.ui.addEventListener('focus', function() {
            showMsg(me.msgFocus);
        });
        me.ui.addEventListener('blur', function() {
            me.validate();
        });
        //ajax的情况下 输入时不验证
        if (!me.ajaxURL) {
            me.ui.addEventListener('input', function() {
                me.validate();
            });
        }
        showDef(me.msgDefault);
        return this;
    };

    function setClass(c) {
        if (me.icon) {
            me.icon.className = initClass + ' ' + c;
        }
    }

    function setText(s, clear) {
        if (!s) {
            if (!clear) {
                return;
            } else {
                s = '';
            }
        }
        if (me.globalMsg) {
            me.globalMsg.innerHTML = s;
        } else {
            if (me.msg) {
                me.msg.innerHTML = s;
            }
        }
    }

    function showMsg(s) {
        if (s) {
            setClass(me.msgIcon);
        }
        setText(s);
        me.value = false;
        return false;
    }

    function showErr(s) {
        fzDOM.appendClass(me.ui, 'xform-invalid');
        setClass(me.errorIcon);
        setText(s);
        me.value = false;
        return false;
    }

    function showDef(s) {
        if (!s) {
            setClass(me.emptyIcon);
        } else {
            setClass(me.defaultIcon);
        }
        setText(s);
        me.value = false;
        return false;
    }

    function showSuc(s) {
        setClass(me.okIcon);
        fzDOM.removeClass(me.ui, 'xform-invalid');
        setText(s, true);
        me.value = true;
        return true;
    }

    function showAjax(s) {
        setClass(me.ajaxIcon);
        setText(s);
    }

    this.validate = function(callback) {
        var n = me.ui.value,
            l = n.length;
        //非空
        if (l == 0) {
            if (me.msgRequired) {
                if (callback) {
                    callback(false);
                }
                return showErr(me.msgRequired);
            }
        }

        //长度
        bc = (me.strlenType == 'Byte') ? n.byteCount() : l;
        if (me.minLength) {
            if (bc < me.minLength) {
                if (callback) {
                    callback(false);
                }
                return showErr(me.msgMinLength);
            }
        }
        if (me.maxLength) {
            if (bc > me.maxLength) {
                if (callback) {
                    callback(false);
                }
                return showErr(me.msgMaxLength);
            }
        }

        //正则
        if (me.regexp) {
            var re = new RegExp(me.regexp);
            if (!re.test(n)) {
                if (callback) {
                    callback(false);
                }
                return showErr(me.msgRegexp);
            }
        }

        //compare
        if (me.compareField) {
            var c = fzDOM.get(me.compareField);
            var cv = c.value || 0;
            var res = eval('n' + me.compareOperator + cv);
            if (!res) {
                if (callback) {
                    callback(false);
                }
                return showErr(me.msgCompare);
            }
        }

        //custom
        if (me.fnCustom) {
            if (isArray(me.msgCustom)) {
                var customErrIndex = me.fnCustom(me.ui.value);
                if (customErrIndex !== true) {
                    return showErr(me.msgCustom[customErrIndex]);
                }
            } else {
                if (fzFnc.isFunction(me.fnCustom)) {
                    if (me.fnCustom(me.ui.value) == false) {
                        return showErr(me.msgCustom);
                    }
                }
            }
        }
        //ajax
        // if (me.ajaxURL) {
        //     if (n === me.lastAjaxErrorValue) {
        //         return;
        //     }
        //     fzAjax.post( me.ajaxURL,me.form, function(s) {
        //         if (s !== 'OK') {
        //             me.lastAjaxErrorValue = n;
        //             if (me.ajaxCallback) {
        //                 me.ajaxCallback(s);
        //             }
        //             if (callback) {
        //                 callback(false);
        //             }
        //             return showErr(me.msgAjax);
        //         } else {
        //             if (me.ajaxOKCallback) {
        //                 me.ajaxOKCallback(s);
        //             }
        //             showSuc(me.msgOK);
        //             me.value = true;
        //             if (callback) {
        //                 callback(true);
        //             }
        //         }
        //     }, function() {
        //         me.lastAjaxErrorValue = null;
        //         showAjax(me.msgLoading);
        //     });
        //     return;
        // }
        showSuc(me.msgOK);
        me.value = true;
        me.invalid = false;
        if (callback) {
            callback(true);
        }
        if (me.callback) {
            me.callback(me.ui.value);
        }

        return me.value;
    };
}

/**
 * 上下文菜单
 * @param            {object}   _config 
 * @for              {*}        [DOM|DOMArray|DomId|Selector|SelectorArray] 触发该菜单的DOM
 * @mode             {string}   触发菜单的模式 ['contextmenu' | 'click' | 'mouseenter' | 'mouseover' | 'mouseup']
 * @isSubMenu        {boolean}  是否子菜单 子菜单显示时不会关闭父菜单
 * @largeStyle       {boolean}  是否显示为大型样式
 * @items            {array}    菜单项 {title,action,icon}
 * @items_title      {string}   菜单项标题 如果是分隔符则设为'|' 访问键在标题内设为&x 标题中需要显示&则用\\转义
 * @items_action     {function} (menuItem,target,currentTarget) 菜单项点击事件 menuItem:当前菜单,target:触发菜单的dom,currentTarget:当前菜单绑定的dom
 * @items_icon       {string}   菜单项图标的className
 * @items_hotKey     {string}   热键
 * @items_fnDisable  {function} (menuItem,target,currentTarget) 决定菜单显示时是否禁用当前菜单项的方法，返回true则禁用
 * @items_fnHide     {function} (menuItem,target,currentTarget) 决定菜单显示时是否隐藏当前菜单项的方法，返回true则隐藏
 * @items_fnNext     {function} 执行完当前action后的下一个操作
 * @items_subItem    {array}    子菜单
 * @items_subaction  {function} 子菜单项共同调用同一个方法时可以使用
 */
function XMenu(_config) {
    var me = this;
    if (!_config) {
        return console.error('缺少构造参数', 'fzDOM.XMenu初始化错误');
    }
    if (!_config.for) {
        return console.error('未指定菜单绑定', 'fzDOM.XMenu初始化错误');
    }
    if (!_config.items) {
        return console.error('未指定菜单项目', 'fzDOM.XMenu初始化错误');
    }
    _config.mode = _config.mode || 'contextmenu';

    this.isSubMenu = _config.isSubMenu || false;
    this.id = 'XMenu_' + _xmenu_count;
    this.hotKeys = {};

    if (isArray(_config.for)) {
        this.domFor = fzArray.each(_config.for, function(x) {
            return fzDOM.get(x);
        });
    } else {
        if (fzDOM.isDOM(_config.for)) {
            this.domFor = _config.for;
        } else {
            this.domFor = fzDOM.queryAll(_config.for);
            //绑定当前菜单的dom
        }
    }

    this.currentTarget = null; //菜单当前绑定的dom
    this.target = null; //触发菜单的dom
    this.menuItems = []; //菜单项 不包含分隔符
    this.actionSource = null;
    this.isShow = false; //是否显示

    this.showingSubMenu = null; //当前菜单正在显示的子菜单

    this.showBy = null; //由哪个dom显示 用于决定菜单出现的位置

    this.parentMenu = _config.parentMenu; //如果当前是子菜单，这个就是它的父菜单
    this.parentItem = _config.parentItem; //触发子菜单的菜单项
    this.subMenu = {};

    this.accessableItems = null;

    this.ui = null;
    this.oList = null;

    this.onshow = function() {};

    _xmenu_count++;

    this.show = function(x, y) {
        if (me.isShow) { //如果当前菜单已经显示
            showAt(x, y); //换个地方显示
            return;
        }

        if (!me.isSubMenu && _showingMenu) {
            hideOtherMenus();
        }

        var hiddenItems = [];
        me.accessableItems = {};

        fzArray.walk(me.menuItems, function(menuItem, index) {
            //可见性
            if (menuItem.fnHide && menuItem.fnHide(menuItem, me.target, me.currentTarget)) {
                //如果是要隐藏的项目
                hiddenItems.push(menuItem);
                fzDOM.hide(menuItem.dom);
                //隐藏
            } else {
                fzDOM.show(menuItem.dom);
                //显示该项
            }

            //是否禁止
            if (menuItem.fnDisable && menuItem.fnDisable(menuItem, me.target, me.currentTarget)) {
                fzDOM.disable(menuItem.dom);
            } else {
                fzDOM.enable(menuItem.dom);

                if (menuItem.accessKey) {
                    //注册热键
                    //TODO 热键冲突的问题
                    me.accessableItems[menuItem.accessKey] = menuItem;
                }
            }
        });

        //设置分隔符可见性
        var lis = fzDOM.queryAll('.xmenu-list>div', me.ui);
        var lastSep = null;
        fzArray.walk(lis, function(li) {
            if (li.className == 'xmenu-separator') {
                lastSep = li;
                fzDOM.hide(li);
            } else if (li.className == 'xmenu-item') {
                if (lastSep) {
                    if (fzDOM.getStyle(li, 'display') != 'none') {
                        fzDOM.show(lastSep);
                        lastSep = null;
                    }
                }
            }
        });

        me.ui.style.opacity = 0;
        fzDOM.show(me.ui);

        showAt(x, y);
        if (me.isSubMenu) {
            me.parentMenu.showingSubMenu = me;
        } else {
            _showingMenu = me;
        }

        document.addEventListener('mouseup', me.hide);
        document.addEventListener('contextmenu', me.hide);
        document.addEventListener('keypress', fnAccessKey);

        function showAt(x, y) {
            //确定位置
            var docSize = fzDOM.windowSize(),
                docWidth = docSize.width,
                docHeight = docSize.height,
                menuPos = fzDOM.getElementPos(me.ui),
                menuWidth = menuPos.width,
                menuHeight = menuPos.height;

            if (_config.mode != 'contextmenu') {
                //不是通过右键触发
                var targetPos;
                if (me.isSubMenu) {
                    //如果是子菜单                
                    targetPos = fzDOM.getElementPos(me.parentItem);
                } else {
                    targetPos = fzDOM.getElementPos(me.currentTarget);
                }
                x = targetPos.right;
                y = targetPos.top;
                if (y + menuHeight > docHeight) {
                    y = y - menuHeight + targetPos.height;
                    y = Math.min(y, docHeight - menuPos.height);
                }
            } else {
                if (y + menuHeight > docHeight) {
                    y = y - menuHeight;
                }
            }

            if (x + menuWidth > docWidth) {
                x = docWidth - menuWidth;
            }

            fzDOM.setPosition(me.ui, x, y);
            me.ui.style.opacity = '';

            me.isShow = true;

            me.onshow(x, y);
            me.ui.focus();
        }
    };

    function fnAccessKey(e) {
        var key = String.fromCharCode(e.keyCode);
        var menuItem = me.accessableItems[key];
        if (menuItem) {
            e.stopPropagation();
            e.preventDefault();
            if (menuItem.subItem) {
                menuItem.subMenu.target = me.target;
                menuItem.subMenu.currentTarget = me.currentTarget;
                showSubMenu(menuItem.subMenu);
            } else {
                execAction(menuItem);
            }
        }
    };

    function unregAccessKey() {
        document.removeEventListener('keypress', fnAccessKey);
        me.accessableItems = null;
    }

    function hideMeByBodyMouseover() {
        event.stopPropagation();
        me.hide();
    }

    this.hide = function() {
        fzDOM.hide(me.ui);
        if (me.isSubMenu) {

        } else {
            _showingMenu = null;
        }

        if (me.showingSubMenu && me.showingSubMenu.isShow) {
            me.showingSubMenu.hide();
        }
        me.showingSubMenu = null;
        document.removeEventListener('mouseup', me.hide);
        document.removeEventListener('contextmenu', me.hide);
        document.body.removeEventListener('mouseover', hideMeByBodyMouseover);

        unregAccessKey();
        me.isShow = false;
    };

    this.render = function() {
        createUI();
        if (isArray(me.domFor)) {
            fzArray.walk(me.domFor, regEvent);
        } else {
            regEvent(me.domFor);
        }

        function regEvent(dom) {
            setContextmenuEvent(dom);
            setMouseoverEvent(dom);
            setHotKey(dom);
        }

        function setContextmenuEvent(x) {
            if (me.isSubMenu) { //子菜单的contextmenu是触发在他的父菜单项上，所以contextmenu无效
                x.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
            } else {
                x.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    // if (me.isShow && !me.isSubMenu) {
                    //     hideMenu();
                    // }
                    if (me.isSubMenu) {
                        me.showBy = me.parentItem;
                        //如果当前是子菜单，则用父菜单的target
                        me.currentTarget = me.parentMenu.currentTarget;
                        me.target = me.parentMenu.target;
                    } else {
                        me.showBy = e.target;
                        me.currentTarget = e.currentTarget;
                        me.target = e.target;
                    }
                    me.show(e.clientX, e.clientY);
                    e.target.blur();
                });
            }
        }

        function setMouseoverEvent(x) {
            //只有当前菜单是子菜单或者手动指定菜单显示模式是mouseover时才添加事件监听            
            if (me.isSubMenu) {
                // x.addEventListener('mouseover', function(e) {
                //     e.stopPropagation();
                //     me.showBy = me.parentItem;
                //     me.target = me.parentMenu.target;
                //     me.currentTarget = me.parentMenu.currentTarget;
                //     me.show(e.clientX, e.clientY);
                // });
            } else if (_config.mode == 'mouseover') {
                x.addEventListener('mouseover', function(e) {
                    e.stopPropagation();

                    //隐藏已显示的菜单及其子菜单
                    if (_showingMenu) {
                        _showingMenu.hide();
                    }

                    document.body.addEventListener('mouseover', hideMeByBodyMouseover);

                    me.showBy = e.currentTarget;
                    me.target = e.target;
                    me.currentTarget = e.currentTarget;
                    me.show(e.clientX, e.clientY);
                });

                me.ui.addEventListener('mouseover', function(e) {
                    e.stopImmediatePropagation();
                });
            }
        }

        function setHotKey(x) {
            fzDOM.addEvent(x, {
                keydown: function(e) {
                    var sHotKey = '';
                    var k = e.keyCode;
                    if (e.ctrlKey) {
                        sHotKey = sHotKey + 'Ctrl+';
                    }
                    if (e.shiftKey) {
                        sHotKey = sHotKey + 'Shift+';
                    }
                    if (e.altKey) {
                        sHotKey = sHotKey + 'Alt+';
                    }
                    if (e.code == 'Enter' || e.code == 'NumpadEnter') {
                        sHotKey = sHotKey + 'Enter';
                    } else {
                        sHotKey = sHotKey + String.fromCharCode(k).toUpperCase();
                    }

                    var objHotKey = me.hotKeys[sHotKey];
                    if (objHotKey) {
                        e.stopPropagation();
                        e.preventDefault();

                        if (objHotKey.menuItem.fnDisable && objHotKey.menuItem.fnDisable(objHotKey.menuItem, e.target, e.currentTarget)) {
                            return;
                        }

                        me.currentTarget = e.currentTarget;
                        me.target = e.target;
                        execAction(objHotKey.menuItem);
                    }
                }
            });
        }

        return this;
    };

    return this;

    function execAction(menuItem) {
        me.hide();
        _showingMenu && _showingMenu.hide();
        menuItem.action(menuItem, me.target, me.currentTarget);
        if (_config.fnNext) {
            _config.fnNext(menuItem);
        }
    }

    function showSubMenu(subMenu) {
        if (subMenu == me.showingSubMenu) {
            return;
        }
        me.showingSubMenu && me.showingSubMenu.hide();
        unregAccessKey();
        subMenu.show();
        me.showingSubMenu = subMenu;
    }

    function createMenuItem(menuItem, menuItemId) {
        var itemTitle = menuItem.title;
        var sDisplayTitle;
        var accessKeyIndex = itemTitle.indexOf('&');
        var accessKey;

        //处理访问键
        if (accessKeyIndex > -1 && itemTitle.substr(accessKeyIndex - 1, 1) !== '\\') {
            accessKey = itemTitle.substr(accessKeyIndex + 1, 1);
            menuItem.accessKey = accessKey.toLowerCase();
            //1.1.3 修正丢失...的bug
            sDisplayTitle = itemTitle.substr(0, accessKeyIndex) + '<u>' + accessKey + '</u>' + itemTitle.substr(accessKeyIndex + 2);
        } else {
            sDisplayTitle = itemTitle;
        }

        //处理热键
        if (menuItem.hotKey) {
            var objHotKey = getHotKey(menuItem);
            if (objHotKey) {
                sDisplayTitle = sDisplayTitle + '<em>' + objHotKey.text + '</em>';
                objHotKey.action = menuItem.action;
                objHotKey.menuItem = menuItem;
                me.hotKeys[objHotKey.text] = objHotKey;
            }
        }

        //创建dom
        var li = fzDOM.dom('xmenu-item'),
            div = fzDOM.dom('xmenu-item-inner'),
            span = fzDOM.dom(null, 'span', sDisplayTitle),
            b = fzDOM.dom('xmenu-icon', 'b');

        if (menuItem.icon) {
            fzDOM.appendClass(b, menuItem.icon);
        }

        fzDOM.setAttr(li, 'index', menuItemId);
        fzDOM.addTo(me.oList, fzDOM.addTo(li, fzDOM.addUI(div, b, span)));

        //当前菜单项有子菜单
        if (menuItem.subItem) {
            var iSubMenuIcon = fzDOM.dom('xmenu-submenu glyphicon glyphicon-menu-right', 'i');
            div.appendChild(iSubMenuIcon);

            if (menuItem.subAction) {
                fzArray.walk(menuItem.subItem, function(x) {
                    x.action = menuItem.subAction;
                    x.fnDisable = menuItem.fnDisable;
                });
            }

            var subMenu = new XMenu({
                for: li,
                isSubMenu: true,
                mode: 'mouseover',
                items: menuItem.subItem,
                parentMenu: me,
                parentItem: li,
                fnNext: _config.fnNext
            }).render();

            menuItem.subMenu = subMenu;
            me.subMenu[menuItemId] = subMenu;

            //处理热键
            setSubMenuItemHotKeys(menuItem.subItem);

            //有子菜单，则点击无效
            li.addEventListener('mouseup', function(e) {
                e.stopImmediatePropagation();
                return false;
            });

            //有子菜单，则鼠标移入后显示子菜单
            li.addEventListener('mouseover', function(e) {
                e.stopPropagation();
                if (fzDOM.getAttr(this, 'disabled')) {
                    return;
                }
                var index = fzDOM.getAttrLong(this, 'index');
                var subMenu = me.subMenu[index];
                me.showBy = this;
                subMenu.target = me.target;
                subMenu.currentTarget = me.currentTarget;
                showSubMenu(subMenu);
            });
        } else { //没有子菜单            
            //注册点击事件        
            li.addEventListener('mouseup', function(e) {
                e.stopPropagation();
                if (this.getAttribute('disabled')) {
                    return;
                }
                var nIndex = fzDOM.getAttr(this, 'index');
                var item = me.menuItems[nIndex];
                if (item.action) {
                    item.target = me.domFor;
                    execAction(item);
                }
            });

            //没有子菜单，则鼠标移入后关闭当前已显示的子菜单
            li.addEventListener('mouseover', function(e) {
                e.stopPropagation();
                me.showingSubMenu && me.showingSubMenu.hide();
                me.showingSubMenu = null;
            });
        }

        menuItem.dom = li;
        menuItem.parentConfig = _config;
        return menuItem;
    }

    function setSubMenuItemHotKeys(subItems) {
        for (var i = 0, l = subItems.length; i < l; i++) {
            var menuItem = subItems[i];
            if (menuItem.hotKey) {
                var objHotKey = getHotKey(menuItem);
                if (objHotKey) {
                    objHotKey.action = menuItem.action;
                    objHotKey.menuItem = menuItem;
                    me.hotKeys[objHotKey.text] = objHotKey;
                }
            }
        }
    }

    function createUI() {
        var menuCls = _config.largeStyle ? 'xmenu xmenu-large' : 'xmenu';
        me.ui = fzDOM.dom(menuCls, null, null, me.id);

        var oBG = fzDOM.dom('xmenu-bg')

        me.oList = fzDOM.dom('xmenu-list');

        fzDOM.addTo(document.body, fzDOM.addUI(me.ui, oBG, me.oList));
        var menuItemId = 0;
        for (var i = 0, l = _config.items.length; i < l; i++) {
            if (_config.items[i] == '|') {
                fzDOM.addTo(me.oList, fzDOM.addTo(fzDOM.dom('xmenu-separator'), fzDOM.dom('xmenu-separator-bg')));
            } else {
                if (_config.items[i].webmode) {
                    if ((_config.items[i].webmode & WEB_MODE) == _config.items[i].webmode) {
                    } else {
                        continue;
                    }
                }

                var menuItem = createMenuItem(_config.items[i], menuItemId);
                me.menuItems.push(menuItem);
                menuItemId++;
            }
        }
    }

    function getHotKey(item) {
        var obj = {
            text: '',
            code: '',
            ctrl: false,
            alt: false,
            shift: false
        };
        var sep = item.hotKey.toLowerCase().split('+');

        if (sep.length == 1) {
            if (sep[0].substr(0, 1) == 'f') {
                var n = sep[0].substr(1);
                var fnNumber = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
                if (fzArray.inArray(n, fnNumber)) {
                    obj.text = 'F' + n;
                    obj.code = obj.text;
                    return obj;
                }
            }
            console.error('无效热键:' + item.hotKey);
            return;
        }

        for (var i = 0, l = sep.length - 1; i < l; i++) {
            switch (sep[i]) {
                case 'ctrl':
                    obj.ctrl = true;
                    obj.text = obj.text + 'Ctrl+';
                    continue;
                case 'shift':
                    obj.shift = true;
                    obj.text = obj.text + 'Shift+';
                    continue;
                case 'alt':
                    obj.alt = true;
                    obj.text = obj.text + 'Alt+';
                    continue;
                default:
                    console.error('无效热键:' + item.hotKey);
                    return;
            }
        }
        var fnDigital = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        var key = sep[sep.length - 1].toUpperCase();
        if (fzArray.inArray(key, fnDigital)) {
            obj.code = 'Digit' + key;
        } else {
            if (key == 'ENTER') {
                key = 'Enter';
                obj.code = key;
            } else {
                obj.code = 'Key' + key;
            }
        }
        obj.text = obj.text + key;
        return obj;
    }
}

/**
 * 模态加载框
 * @param {*} _config 配置选项
 * @param [id] auto
 * @param [text] '正在加载，请稍候...'
 * @param [icon] auto
 * @param opacity
 * @param bgColor
 * @param textWidth
 */
function XLoader(_config) {
    var me = this;
    _config = _config || {};
    me.id = _config.id || 'xloader-' + _xloader_Count;
    me.text = _config.text || '正在加载，请稍候...';
    me.icon = _config.icon;
    me.opacity = _config.opacity || 0.5;
    me.bgColor = _config.bgColor;
    me.textWidth = _config.textWidth;

    me.ui = null;
    me.box = null;
    me.isLoading = false;

    _xloader_Count++;

    this.loading = function(target) {
        if (me.isLoading) {
            return this;
        }
        me.target = target;
        me.isLoading = true;
        me.ui = fzDOM.dom('xloader-c');
        me.box = fzDOM.dom('xloader-b');
        var p = fzDOM.dom('xloader-p'),
            m = fzDOM.dom('xloader-i', 'b'),
            s = fzDOM.dom('xloader-t', 'span', me.text);
        if (me.textWidth) {
            fzDOM.setWidth(p, me.textWidth);
        }
        fzDOM.css(me.ui, 'opacity', me.opacity);
        if (me.bgColor) {
            fzDOM.css(me.ui, 'backgroundColor', me.bgColor);
        }
        fzDOM.addUI(p, m, s);
        fzDOM.addTo(me.box, p);
        fzDOM.addTo(target, me.box);
        fzDOM.addTo(target, me.ui);

        var uw = target.offsetWidth,
            uh = target.offsetHeight,
            l = (uw - me.box.offsetWidth) * 0.5,
            t = (uh - me.box.offsetHeight) * 0.5;

        fzDOM.setPosition(me.box, l, t);
        return me;
    };

    this.loaded = function() {
        me.isLoading = false;
        try {
            me.ui.remove();
            me.box.remove();
        } catch (e) {}
        return me;
    }
}