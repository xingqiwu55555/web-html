## 平时比较常用的css样式和技巧

1. 商品价格文本中的一条线，例：
```
div {
  text-decoration: line-through;
}
```

2. 文本超出溢出显示省略号，例：

* 单行本文
```
div {
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
```
* 不定行文本 --- 注意兼容性
```
div {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
```

3. div元素在块级元素中垂直居中,个人比较长用的是5/6，以后要改过来才行，例：

* 固宽1：利用定位top/bottom,left/right都为0来设置
```
<div style="width:200px;height:200px;border:solid blue;position:relative;">
  <div style="width:100px;height:100px;margin: auto;  position: absolute;  top: 0; left: 0; bottom: 0; right: 0; background: red;"></div>
</div>
```

* 固宽2：利用表格中元素垂直居中
```
<div style="width:200px;height:200px;border:2px solid #000;display:table-cell;vertical-align:middle;text-align: center;">
  <div style="width:100px;height:100px;display:inline-block;background-color: red;"></div>
</div>
```

* 固宽3：利用flex布局 --- 注意兼容性
```
<div style="width:200px;height:200px; border:2px solid #000;display:flex;justify-content:center;align-items:center;">
  <div style="width:100px;height:100px;background-color: red;"></div>
</div>
```

* 固宽4：利用box布局 --- 注意兼容性
```
<div style="width:200px;height:200px; border:2px solid #000;display: -webkit-box;-webkit-box-orient: horizontal;-webkit-box-pack: center;-webkit-box-align: center;">
  <div style="width:100px;height:100px;background-color: red;"></div>
</div>
```

* 固宽5：利用定位top:50%,margin-top: -width/2设置
```
<div style="width:200px;height:200px; border:2px solid #000;position:relative;">
  <div style="width:100px;height:100px;margin:auto;position:absolute;left:50%;top:50%;margin-left: -50px;margin-top:-50px;background-color: red;"></div>
</div>
```

* 不固宽6：利用transform --- 注意兼容性
```
<div style="width:200px;height:200px; border:2px solid #000;position: relative;top:50%;left:50%;transform:translateY(-50%);transform:translateX(-50%); ">
  <div style="background-color: red;">sdfsdfsdf</div>
</div>
```

4. input placeholder样式修改：
```
input::-webkit-input-placeholder {
  -webkit-text-fill-color: #999;
  color: #999;
}

input:-moz-placeholder {
  -webkit-text-fill-color: #999;
  color: #999;
}

input:-ms-input-placeholder {
  -webkit-text-fill-color: #999;
  color: #999;
}

input:disabled {
  -webkit-text-fill-color: rgba(0, 0, 0, 1);
  -webkit-opacity: 1;
  color: inherit;
  opacity: inherit;
}
```

5. box布局:
- 父元素设置： display: box;
  - box-orient: horizontal/vertical
      - 子代按水平排列或竖直排列，注：所有主流浏览器不支持该属性，必须加上前缀；
      - horizontal：水平排列，子代总width = 父级width，若父级固定宽度，则子代设置的width无效，子代会撑满父级宽度；
      - vertical：垂直排列，子代总height = 父级height，若父级固定高度，则子代设置的height无效，子代会撑满父级宽度；

  - box-direction: normal/reverse
      - 确认子代的排列顺序；
      - normal 默认值，子代按html顺序排列；
      - reverse 反序；

  - box-align: start/end/center/stretch
      - 子代的垂直对齐方式；
      - start 垂直顶部对齐；
      - end 垂直底部对齐；
      - center 垂直居中对齐；
      - stretch 拉伸子代的高度，与父级设置的高度一致。子代height无效；

  - box-pack: start/end/center
      - 子代的水平对齐方式；
      - start 水平左对齐；
      - end 水平右对齐；
      - center 水平居中对齐；

- 子元素设置：
  - box-flex: number;
      - 占父级元素宽度的number份；
      - 若子元素设置固定宽度，则该子元素应用固定宽度，其他未设置固定宽度的字元素将余下的父级宽度（父级-已设置固定宽度的子代元素的总宽度按 number占份数）；
      - 若子元素有margin值，则按余下（父级宽度-子代固定总宽度-总margin值）宽度占number份；

6. 







