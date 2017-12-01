# 平时常用的技巧

1. canvas转成图片，注意：pc端可下载，移动端不可下载，只可利用canvas转图片后进行长按保存
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

2. 

