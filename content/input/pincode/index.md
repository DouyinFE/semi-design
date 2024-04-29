---
localeCode: zh-CN
order: 0
category: 输入类
title:  PinCode 验证码输入
icon: doc-input
width: 60%
brief: 用于便捷直观地输入验证码
---



## 代码演示

### 如何引入

```jsx
import { PinCode } from '@douyinfe/semi-ui';
```


### 基本使用

```jsx live=true
import { PinCode } from '@douyinfe/semi-ui';

function Demo(){
    return   <>
        <PinCode size={'small'} defaultValue={"123456"} onComplete={value=>console.log("pincode: ",value)} onChange={value=>{
            console.log(value)
        }}/>
        <br/>
        <PinCode size={'default'} defaultValue={"123456"} onComplete={value=>console.log("pincode: ",value)} onChange={value=>{
            console.log(value)
        }}/>
        <br/>
        <PinCode size={'large'} defaultValue={"123456"} onComplete={value=>console.log("pincode: ",value)} onChange={value=>{
            console.log(value)
        }}/>
    </>
}

```

### 受控

使用 value 传入验证码字符串，配合 onChange 受控使用

```jsx live=true
import { PinCode, Button } from '@douyinfe/semi-ui';

function Demo(){
    const [value,setValue] = useState("69af41");
    return <>
        <Button onClick={()=>setValue(String(parseInt((Math.random()*100000000))).slice(0,6))}>Set Random Value</Button>
        <br/>
        <br/>
        <PinCode format={"mixed"}
                 onComplete={value=>console.log("pincode: ",value)}  
                 value={value} 
                 onChange={v=>{
                    console.log(v)
                    setValue(v)
                 }
        }/>
    </>
}

```

### 限制验证码格式

#### 设置位数

通过 count 设置位数，默认 6 位，下方 Demo 设置为 4 位


```jsx live=true
import { PinCode } from '@douyinfe/semi-ui';

function Demo(){
    return   <>
        <PinCode size={'large'} defaultValue={"6688"} count={4} onComplete={value=>console.log("pincode: ",value)} onChange={value=>{
            console.log(value)
        }}/>
    </>
}

```

#### 设置字符范围

使用 format 控制可输入的字符范围

- 传入 "number" 只允许设置数字
- 传入 “mixed” 允许数字和字母
- 传入正则表达式，只允许输入可通过正则判定的字符
- 传入函数，当函数返回 true 时，允许该字符被输入进 PinCode

```jsx live=true
import { PinCode, Button, Typography } from '@douyinfe/semi-ui';

function Demo() {
    return <>
        <Typography.Text>纯数字</Typography.Text>
        <PinCode format={"number"}
                 onComplete={value => console.log("pincode: ", value)}
                 />
        <br/>
        <Typography.Text>字母和数字</Typography.Text>
        <PinCode format={"mixed"} 
                 onComplete={value => console.log("pincode: ", value)}
        />
        <br/>
        <Typography.Text>只大写字母</Typography.Text>
        <PinCode format={/[A-Z]/} 
             onComplete={value => console.log("pincode: ", value)}
             />
        <br/>
        <Typography.Text>只小写字母(函数判断)</Typography.Text>
        <PinCode format={(char)=>{
            return /[a-z]/.test(char)
        }} 
             onComplete={value => console.log("pincode: ", value)}
              />
        </>
    
        }

```

### 手动聚焦失焦

使用 Ref 上方法 focus 与 blur，入参为对应 Input 的序号

```jsx live=true
import { PinCode, Button } from '@douyinfe/semi-ui';

function Demo(){
    const [value,setValue] = useState("69af41");
    const ref = useRef();
    return <>
        <Button onClick={()=>ref.current.focus(2)}>Focus Third Input</Button>
        <br/>
        <br/>
        <PinCode format={"mixed"}  ref={ref} 
                 onComplete={value=>console.log("pincode: ",value)}  
                 value={value} 
                 onChange={v=>{
                    console.log(v)
                    setValue(v)
                 }
        }/>
        
    </>
}

```


## API 参考

| 属性           | 说明                                                                              | 类型                    | 默认值       |  版本|
|--------------| --------------------------------------------------------------------------------- |-----------------------|-----------|------------- |
| onChange     | 输入回调 | (value:string)=>void | |
| onComplete | 输入完毕完整码回调 |  (value: string) => void | |
| autoFocus | 是否自动聚焦到第一个元素 | boolean | true |
| className    | 类名                                                                              | string                |           |
| count        | 验证码位数 | number | 6         |
| defaultValue | 输入框内容默认值                                       | ReactText                      |           |
| format       | 验证码单个字符格式限制 | 'number'\| 'mixed‘ \| RegExp \| (char:string)=>boolean | 'number'  |
| size         | 输入框大小，large、default、small                      | string                | 'default' |
| style        | 样式                                                                              | object                |           |
| value        | 输入框内容                                          | string                |           |



