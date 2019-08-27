React 拥抱渲染逻辑与其他 UI 逻辑固有耦合：事件如何处理，状态如何随时间变化以及数据如何准备显示。

通过将标签和逻辑放在单独的文件中，而不是人为分离技术，伴有松散耦合单元的 React 关注点分离成为 组件 (component)。不强制使用 JSX，但它是 JavaScript 代码中使用 UI 时很有帮助的视觉辅助工具。

JSX 是表达式。

本质上，JSX 只是为 React.createElement(component, props, ...children) 函数提供的语法糖。例如：
```
<MyButton color="blue" shadowSize={2}>
  Click Me
</MyButton>
```
编译为：
```
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Click Me'
)
```

如果不存在子节点，可以使用自闭合（self-closing）格式标签，例如：
```
<div className="sidebar" />
```
编译为：
```
React.createElement(
  'div',
  {className: 'sidebar'},
  null
)
```

## 实用和注意

### 指定 React 元素类型
一个 JSX 标签的开始部分决定了 React 元素的类型：首字母大写的标签指示 JSX 标签是一个 React 组件。例如：<Foo /> 表达式，那么 Foo 必须在作用域中。

#### React 必须在作用域中
因为 JSX 被编译为 React.createElement 的调用，所以 React 库必须被引入在你 JSX 代码的作用域中：
```
import React from 'react';
import CustomButton from './CustomButton';

function WarningButton() {
  // return React.createElement(CustomButton, {color: 'red'}, null);
  return <CustomButton color="red" />;
}
```
如果使用 <script> 标签加载 React，它已经作为一个全局 React 存在。

#### 对 JSX 类型使用点语法
导出多个 React 组件时，更方便些：
```
import React from 'react';

const MyComponents = {
  DatePicker: function DatePicker(props) {
    return <div>Imagine a {props.color} datepicker here.</div>;
  }
}

function BlueDatePicker() {
  return <MyComponents.DatePicker color="blue" />;
}
```

#### 用户自定义组件必须以大写字母开头
目的是指定 React 元素类型：

以小写字母开头，它表示引用一个类似于 <div> 或者 <span> 的内置组件，会给 React.createElement 方法传递 ‘div’ 或 ‘span’ 字符串；

以大写字母开头的类型，类似于 <Foo />，会被编译成 React.createElement(Foo) ，对应于自定义组件 或者在 JavaScript 文件中导入的组件；

如果把两者类型弄混，代码无法按照预期运行。

#### 在运行时选择类型
如果想使用普通表达式表示元素类型，首先需要将其赋值给大写的变量：
```
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // 错误！JSX 类型不能是表达式
  return <components[props.storyType] story = {props.story} />;

  // 正确！JSX 类型可以是一个以大写字母开头的变量.
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

### JSX 中的 props(属性)

#### JavaScript 表达式作为 props(属性)
可以传递任何一个用 {} 包裹的 JavaScript 表达式作为 props(属性)。例如：
```
<MyComponent foo={1 + 2 + 3 + 4} />
```

#### 字符串字面量
例如：
```
<MyComponent message="hello world" />
// 等价于
<MyComponent message={'hello world'} />
```
```
<MyComponent message="&lt;3" />
// 等价于
<MyComponent message={'<3'} />
```

#### props(属性) 默认为"true"
如果没给 props(属性) 传值，默认为 true：
```
<MyTextBox autocomplete />
// 等价于
<MyTextBox autocomplete={true} />
```

#### 属性展开
例如：
```
function App2() {
  const props = {firstName: 'Ben', lastName: 'Hector'};
  return <Greeting {...props} />;
}
```

### JSX 中的 Children
可传递方式：

#### 字符串字面量
```
<MyComponent>Hello world!</MyComponent>

<div>This is valid HTML &amp; JSX at the same time.</div>
```
注意：JSX 会删除每行开头和结尾的空格，并且会删除空行，邻街标签的空行也会被移除，字符串之间的空格会被压缩成一个空格，下例效果相同：
```
<div>Hello World</div>

<div>
  Hello World
</div>

<div>
  Hello
  World
</div>

<div>

  Hello World
</div>
```

#### JSX Children
可嵌套；可混用；可元素数组···
```
render() {
  return [
    // Don't forget the keys :)
    <li key="A">First item</li>,
    <li key="B">Second item</li>,
    <li key="C">Third item</li>,
  ];
}
```

#### JavaScript 表达式作为 Children(子元素)
字符串模板，列表：
```
function Item(props) {
  return <li>{props.message}</li>;
}

function TodoList() {
  const todos = ['finish doc', 'submit pr', 'nag dan to review'];
  return (
    <ul>
      {todos.map((message) => <Item key={message} message={message} />)}
    </ul>
  );
}
```

#### Functions(函数) 作为 Children(子元素)
props.children 类似于其他的 props(属性) ，可以被传入任何数据，而不是仅仅只是 React 可以渲染的数据。详细在 props render 里讲解，这里简单举例：
```
function Repeat(props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }
  return <div>{items}</div>;
}

function ListOfTenThings() {
  return (
    <Repeat numTimes={10}>
      {(index) => <div key={index}>This is item {index} in the list</div>}
    </Repeat>
  );
}
```

#### Booleans, Null, 和 Undefined 被忽略
false，null，undefined，和 true 都是有效的的 children(子元素) 。但是并不会被渲染:
```
<div />

<div></div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>

<div>{true}</div>
```
条件渲染：
```
<div>
  {showHeader && <Header />}
  <Content />
</div>
```
注意：数值为 0，会被 React 渲染：
```
<div>
  {props.messages.length &&
    <MessageList messages={props.messages} />
  }
</div>
// 这段代码不会按照预期发生，正确的写法应该保持表达式总是布尔值
<div>
  {props.messages.length > 0 &&
    <MessageList messages={props.messages} />
  }
</div>
```











