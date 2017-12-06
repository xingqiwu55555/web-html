# 平时常用的技巧

1. canvas转成图片，注意：pc端可下载，移动端不可下载，只可利用canvas转图片后进行长按保存
  - 注意错误提示：Uncaught DOMException: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported，解决 —— img.setAttribute("crossOrigin",'Anonymous');
  
```
var can = document.getElementById('canvas');

// 这里把canvas转成base64的格式的地址
var _img = can.toDataURL("image/png");

// pc端下载图片
pcDown(_img);

function pcDown (url) {
  var url = 'data:image/octet-stream;base64,' + url.split('data:image/png;base64,')[1];
  var saveFile = function (data, filename) {
      var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
      save_link.href = data;
      save_link.download = filename;
      var event = document.createEvent('MouseEvents');
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      save_link.dispatchEvent(event);
  };
  saveFile(url, '下载收款码.png')
} 
```

2. 身份证验证
```
//身份证验证规则
function IdentityCodeValid (code) {
    var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
    var tip = "";
    var pass= true;
    //身份证规则错误
    if(!code || !/^\d{6}(19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
        pass = false;
    }
    //地区配置错误
    else if(!city[code.substr(0,2)]){
        pass = false;
    }
    //校验位错误
    else{
        //18位身份证需要验证最后一位校验位
        if(code.length == 18){
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
            //校验位
            var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++)
            {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if(parity[sum % 11] != code[17]){
                tip = "身份证号格式错误";
                pass =false;
            }
        }
    }
    return pass;
}
```

3. js正则表达式验证数字
```
/*
验证数字：^[0-9]*$ 
验证n位的数字：^\d{n}$ 
验证至少n位数字：^\d{n,}$ 
验证m-n位的数字：^\d{m,n}$ 
验证零和非零开头的数字：^(0|[1-9][0-9]*)$ 
验证有两位小数的正实数：^[0-9]+(.[0-9]{2})?$ 
验证有1-3位小数的正实数：^[0-9]+(.[0-9]{1,3})?$ 
验证非零的正整数：^\+?[1-9][0-9]*$ 
验证非零的负整数：^\-[1-9][0-9]*$ 
验证非负整数（正整数 + 0） ^\d+$ 
验证非正整数（负整数 + 0） ^((-\d+)|(0+))$ 
验证长度为3的字符：^.{3}$ 
验证由26个英文字母组成的字符串：^[A-Za-z]+$ 
验证由26个大写英文字母组成的字符串：^[A-Z]+$ 
验证由26个小写英文字母组成的字符串：^[a-z]+$ 
验证由数字和26个英文字母组成的字符串：^[A-Za-z0-9]+$ 
验证由数字、26个英文字母或者下划线组成的字符串：^\w+$ 
验证用户密码:^[a-zA-Z]\w{5,17}$ 正确格式为：以字母开头，长度在6-18之间，只能包含字符、数字和下划线。 
验证是否含有 ^%&',;=?$\" 等字符：[^%&',;=?$\x22]+ 
验证汉字：^[\u4e00-\u9fa5],{0,}$ 
验证Email地址：^\w+[-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$ 
验证InternetURL：^http://([\w-]+\.)+[\w-]+(/[\w-./?%&=]*)?$ ；^[a-zA-z]+://(w+(-w+)*)(.(w+(-w+)*))*(?S*)?$ 
验证电话号码：^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$：--正确格式为：XXXX-XXXXXXX，XXXX-XXXXXXXX，XXX-XXXXXXX，XXX-XXXXXXXX，XXXXXXX，XXXXXXXX。 
验证身份证号（15位或18位数字）：^\d{15}|\d{}18$ 
验证一年的12个月：^(0?[1-9]|1[0-2])$ 正确格式为：“01”-“09”和“1”“12” 
验证一个月的31天：^((0?[1-9])|((1|2)[0-9])|30|31)$ 正确格式为：01、09和1、31。 
整数：^-?\d+$ 
非负浮点数（正浮点数 + 0）：^\d+(\.\d+)?$ 
正浮点数 ^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$ 
非正浮点数（负浮点数 + 0） ^((-\d+(\.\d+)?)|(0+(\.0+)?))$ 
负浮点数 ^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$ 
浮点数 ^(-?\d+)(\.\d+)?$
*/
```

4. ES5代码规范：
- 拷贝数组： var newArr = oldArr.slice()
- 将类数组对象转换成数组：var args = Array.prototype.slice.call(arguments);
- if强制转换为布尔值：
    - 对象：true
    - undefined：false
    - null：false
    - 布尔值：布尔的值
    - +0：true
    - -0 || NaN：false
    - 字符串''：false
- 立即执行函数的写法：
    - (function(){ /* code */ }()); // 推荐
    - (function(){ /* code */ })();

    - var i = function(){ return 10; }();
    - true && function(){ /* code */ }();
    - 0, function(){ /* code */ }();

    - !function(){ /* code */ }();
    - ~function(){ /* code */ }();
    - -function(){ /* code */ }();
    - +function(){ /* code */ }();

    - new function(){ /* code */ }
    - new function(){ /* code */ }() // 带参数
- [更多](http://fe-style-guide.dev-ag.56qq.com/)

5. ES6代码规范：
- 将类数组对象转换成数组：var args = Array.from(oldArr);
- 数组使用includes 替代 indexOf判断是否包含某一项元素：arr.includes(1)
- 链式调用；
- 使用**操作符来计算乘方：2 ** 10
- 字符串类型转换：String(9)；
- 数字类型转换：const inputValue = '4'
    - Number(inputValue)
    - parseInt(inputValue)
    - inputValue >> 0     // 移位符
- 布尔类型转换：Boolean(1);
