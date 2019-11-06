## 什么是 XSS？
XSS：跨站脚本攻击(Cross Site Scripting)；

XSS 就是攻击者在 web 页面插入恶意的 Script 代码，当用户浏览该页之时，嵌入其中 web 里面的 Script 代码会被执行，从而达到恶意攻击用户的特殊目的。

## XSS 分类
可以按照是否把攻击者的数据存储在服务器端分为：
1. 非持久型攻击
2. 持久型攻击

也可以分为：
1. 反射型：经过后端，不经过数据库；
2. 存储型：经过后端，经过数据库；
3. DOM：不经过后端,DOM—based XSS 漏洞是基于文档对象模型 Document Object Model,DOM) 的一种漏洞,dom - xss 是通过 url 传入参数去控制触发的

## XSS 防御
通过 输入过滤 来防御，资料二中有详尽介绍。

## 资料
1. [xss漏洞攻击与防御](https://www.jianshu.com/p/790fb57f3acb)
2. [前端安全系列（一）：如何防止XSS攻击？](https://tech.meituan.com/2018/09/27/fe-security.html)

