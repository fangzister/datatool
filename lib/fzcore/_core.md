# version 1.9.0
## date 2021/06/28 09:54:56
### 新增方法
* fzDOM.getCheckedRadioValue
### 修改方法
* fzDOM.createRadioList 增加divClassName参数，增加listTitle参数

# version 1.8.9
## date 2021/05/01 13:34:17
### 新增方法
* fzString.captialize
* fzString.captializeWord

# version 1.8.8
## date 2021/03/22 12:59:53
### 新增方法
* fzDOM.createRadioList 创建包含单选按钮列表的div

# version 1.8.7
## date:2021/02/26 09:03:30
### 新增方法
* fzDate.getWeekday 获取日期的星期几
* fzNumber.toCNNumber 将整数转换为汉字表示

# version 1.8.6
## date 2021/2/2 15:00:00
### 新增方法
* fzNumber.toFileSize 字节数转自动显示的文件大小
### 删除方法
* fzString.markdown2html (改为Markdown.Converter.js)

# version 1.8.5
## date 2021/1/15 12:33:21
### 新增方法
* fzAjax.test 测试接口
* fzArray.filterAs 按指定规则过滤数组，返回按指定规则得到的值组成的新数组
* fzArray.filterToObject 按指定规则过滤数组，将按照指定规则生成的键值对添加到源对象中，若键存在则更新值
* fzArray.filterAsObject 按指定规则过滤数组，返回按指定规则生成的键值对组成的对象
* fzArray.filterToObjectBy 按指定规则过滤数组，将过滤结果添加到源对象中
* fzArray.filterAsObjectBy 按指定规则过滤数组，返回由过滤规则和生成键值对规则得到的对象
* fzDOM.setPosition 设置DOM位置和大小
* fzDOM.createCheckLabel 创建一个包含checkbox的label

# version 1.8.4
## date 2020/12/25 17:28:28
### 新增方法
* fzArray.groupBy 返回一个由指定条件分组后得到的数组组成的新数组
* fzArray.groupAsObject 返回一个对象，其值由指定的条件对源对象进行分组后得到，对应的键由* 指定条件得到
* fzSet.from 将可迭代对象的值转换成集合
* fzSet.contains 判断集合1是否包含集合2
* fzSet.equals 判断两个集合是否互相包含，即相等（不管顺序），参数只要有非true值，则返回* false
* fzSet.equalsAll 判断数组中的集合是否均相等
* fzObject.fromArray 将数组转换为Object，数组的元素值为Object的key，元素值由initval决* 定
* fzObject.walk 遍历对象
* fzObject.getUniqueChildPropertyValue 返回一个对象的所有属性值中指定属性值的集合
* fzDOM.addCSSFile 添加样式表文件
* fzAjax.ajaxUpload 基于jQuery实现的ajax上传文件

# version 1.8.3
## date 2020/12/17 23:03:00
### 修改方法
* fzArray.concat 修正参数中的数组中的空元素也被追加的bug
* fzArray.intersect 如果两个数组有一个为空，则返回空数组
* fzDOM.createButton 增加参数[attributes] 支持设置button的属性
### 新增方法
* fzArray.filter 数组过滤
* fzArray.combine2 两两组合数组中的元素，生成新数组
* fzArray.combineAll 全组合数组中的元素，生成新数组
* fzNumber.isEven
* fzNumber.isOdd

# version 1.8.2
## date 2020/10/04 20:59:09
### 增加方法
* fzArray.walkWhile

# version 1.8.1
## date 2020/09/29 21:47:26
### 增加方法
* fzString.statistics
* fzArray.toSortedArray

# version 1.8.0
## date 2020/09/16 15:17:35
### 增加方法
* fzString.markdown2html

## date 2020/09/14 14:14:18
### 增加方法
* fzValidator.isBankcard

# version 1.7.8
## date 2020/09/02 16:00:25
### 增加方法
* fzNumber.toCNPrice 数字金额转中文大写

# version 1.7.7
## date 2020/07/10 20:41:39
### 修改方法
* fzValidator.isPhoneNumber 支持145 146号段

# version 1.7.6
## date 2020/05/31 10:55:19
### 增加方法
* fzRandom.ip

# version 1.7.5
## date 2020/05/14 11:07:59
### 增加方法
* fzDate.getDate today yesterday tomorrow lastWeek nextWeek
### 修改方法
* fzDOM.createInput createLabelInput 增加defaultValue参数
### bug fixed
* 修正fzDate.diff的一个不返回值的bug

# version 1.7.4
## date 2020/02/25 23:49:55
### 增加方法
* fzString.rightOf
* 将addScripts移入fzDOM
* 删除addScript方法

# version 1.7.3
## date 2020/02/15 17:22:42
### 增加方法
* fzDOM.createLabelInputDiv
### 修改方法
* fzDOM.createLabelInput 如果inputtype为checkbox或radio，则返回的对象inpu在前，label在后

# version 1.7.2
## date 2020/02/13 14:36:22
### 增加方法
* fzDOM.isHide isShow switchVisible addEvent
### 修改方法
* fzDOM.createLinkbutton 增加href参数，支持自定义或者默认或者不要href属性
* exportExcelOnNewFrame,exportExcel 增加callback

# version 1.7.1
## date 2020/02/13 11:16:15
### 增加方法
* fzArray.walkreverse

# version 1.7
## date 2020/02/12 22:02:09
### 增加方法
* fzArray.range,ranges,generate,each,walk
* fzString.zeroize
* fzDOM.createLabelInput
* fzDOM.alterVisible
* fzDOM.getTextWidth
* fzValidator.isCarNumber 
### 修改方法
* fzArray.travelList fnc传入index参数
* fzDOM.css 支持设置ID，避免重复添加
* fzDOM.getLong 支持input.value
* fzDOM.removeAllClassOf 如果要删除的类名参数设为空，则直接清空class属性
* fzDOM.show,hide 支持保存原有display状态[暂时不全]
### 增加类 fzRandom
* int()
* bool()
* select2()
* choice()
* sample()
* shuffle()
* string()
* password()
* color()
* md5()
* mac()
* age()
* date()
* time()
* datetime()
* birthday()
* phone()
* idcard()
* realIdcard()
* carNumber()
* name()
* nameWithGender()
* mark()

# version 1.6
## date 2020/02/11 10:52:24
### 新增方法
* 增加fzDate.diff from 
* 增加fzDOM.addAttr 
* 增加fzDOM.setTextareaTabbable
### bug fixed
* 修正fzDate.format里日期的bug
* 修正fzDOM.createInput属性bug
* fzDOM.createLinkbutton 取消href属性
* 修正addScripts方法判断字符串的bug