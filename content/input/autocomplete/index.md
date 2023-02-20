---
localeCode: zh-CN
order: 19
category: 输入类
title: AutoComplete 自动完成
icon: doc-autocomplete
brief: 输入框自动填充。
---

## 使用场景

用于对输入框提供输入建议，进行自动补全的操作


与可搜索的 Select 组件的区别：
- AutoComplete 本质上是一个增强型的提供了输入建议的 Input 组件，而 Select 是一个选择器
- 点击展开时，Select 会将输入框的值全部清空，而 AutoComplete 会保留上次选中的值
- Select 的已选项渲染（renderSelectedItem）可定制化程度更高，可以为任意类型的 ReactNode，而 AutoComplete 只允许为字符串

## 代码演示

### 如何引入

```jsx import
import { AutoComplete } from '@douyinfe/semi-ui';
```

### 基本用法

通过 onSearch 监听用户输入，将输入建议通过 data 传入，通过 onChange 保持受控，当输入框变化/选中输入项时会触发 onChange

```jsx live=true
import React from 'react';
import { AutoComplete } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';

() => {
    const [stringData, setStringData] = useState([]);
    const [value, setValue] = useState('');
    const handleStringSearch = (value) => {
        let result;
        if (value) {
            result = ['gmail.com', '163.com', 'qq.com'].map(domain => `${value}@${domain}`);
        } else {
            result = [];
        }
        setStringData(result);
    };

    const handleChange = (value) => {
        console.log('onChange', value);
        setValue(value);
    };
    return (
        <AutoComplete
            data={stringData}
            value={value}
            showClear
            prefix={<IconSearch />}
            placeholder="搜索... "
            onSearch={handleStringSearch}
            onChange={handleChange}
            style={{ width: 200 }}
        />
    );
};
```

### 自定义候选项渲染

需要自定义候选项渲染时，data 可以传入一个对象数组（每个 Object 必须含有 label、value 两个 key，value 为候选项选中的值，label 为候选项展示的内容）  
通过 renderItem 可以自定义候选项的渲染

```jsx live=true
import React from 'react';
import { AutoComplete, Avatar } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';

class CustomOptionDemo extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            color: ['amber', 'indigo', 'cyan'],
            list: [
                { name: '夏可漫', email: 'xiakeman@example.com', abbr: 'XK', color: 'amber' },
                { name: '申悦', email: 'shenyue@example.com', abbr: 'SY', color: 'indigo' },
                { name: '曲晨一', email: 'quchenyi@example.com', abbr: 'CY', color: 'blue' },
                { name: '文嘉茂', email: 'wenjiamao@example.com', abbr: 'JM', color: 'cyan' },
            ],
        };
    }

    search(value) {
        let result;
        if (value) {
            result = this.state.list.map(item => {
                return { ...item, value: item.name, label: item.email };
            });
        } else {
            result = [];
        }
        this.setState({ data: result });
    }

    renderOption(item) {
        let optionStyle = {
            display: 'flex',
        };
        return (
            <>
                <Avatar color={item.color} size="small">
                    {item.abbr}
                </Avatar>
                <div style={{ marginLeft: 4 }}>
                    <div style={{ fontSize: 14, marginLeft: 4 }}>{item.name}</div>
                    <div style={{ marginLeft: 4 }}>{item.email}</div>
                </div>
            </>
        );
    }

    render() {
        return (
            <AutoComplete
                data={this.state.data}
                prefix={<IconSearch />}
                style={{ width: '250px' }}
                renderSelectedItem={option => option.email}
                renderItem={this.renderOption}
                onSearch={this.search.bind(this)}
                onSelect={v => console.log(v)}
            ></AutoComplete>
        );
    }
}
```

### 远程搜索

从 onSearch 中获取用户输入值，动态更新 data 值，更新 loading

```jsx live=true
import React from 'react';
import { AutoComplete } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';

class ObjectDemo extends React.Component {
    constructor() {
        super();
        this.state = {
            list: [
                { value: 'abc', label: 'douyin', email: '1@gmail.com', type: 2 },
                { value: 'hotsoon', label: 'huoshan', email: '2@gmail.com', type: 3 },
                { value: 'pipixia', label: 'pip', email: '3@gmail.com' },
            ],
            loading: false,
        };
        this.onSearch = this.onSearch.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderSelectedItem = this.renderSelectedItem.bind(this);
        this.search = debounce(this.search.bind(this), 200);
    }

    onSearch(inputValue) {
        this.setState({ loading: true });
        this.search(inputValue);
    }

    search(inputValue) {
        let { list } = this.state;
        const newList = list.map(item => {
            let num = Math.random()
                .toString()
                .slice(2, 5);
            let option = inputValue + '-' + num;
            return { ...item, label: '名称:' + option, value: option };
        });
        this.setState({ list: newList, loading: false });
    }

    handleSelect(value) {
        console.log(value);
    }

    renderItem(item) {
        return (
            <div>
                <div>{item.label}</div>
                <div>email: {item.email}</div>
                <div style={{ color: 'pink' }}>value: {item.value}</div>
            </div>
        );
    }

    renderSelectedItem(item) {
        // 注意：与Select不同，此处只能返回String类型的值，不能返回ReactNode
        return item.value;
    }

    render() {
        const { loading } = this.state;
        return (
            <div>
                <AutoComplete
                    data={this.state.list}
                    style={{ width: 250 }}
                    prefix={<IconSearch />}
                    onSearch={this.onSearch}
                    loading={loading}
                    onChangeWithObject
                    renderItem={this.renderItem}
                    renderSelectedItem={this.renderSelectedItem}
                    onSelect={this.handleSelect}
                ></AutoComplete>
            </div>
        );
    }
}
```

### 尺寸

通过设置 size 可设置输入框尺寸，可选`small`，`default`(默认)，`large`

```jsx live=true
import React from 'react';
import { AutoComplete } from '@douyinfe/semi-ui';

() => (
    <div>
        <AutoComplete
            data={[1, 2, 3, 4]}
            size="small"
            placeholder={'small'}
            style={{ width: 200 }}
        ></AutoComplete>
        <br />
        <br />
        <AutoComplete
            data={[1, 2, 3, 4]}
            size="default"
            placeholder={'default'}
            style={{ width: 200 }}
        ></AutoComplete>
        <br />
        <br />
        <AutoComplete
            data={[1, 2, 3, 4]}
            size="large"
            placeholder={'large'}
            style={{ width: 200 }}
        ></AutoComplete>
    </div>
);
```

### 下拉菜单的位置

通过设置 position 可设置下拉菜单位置，可选值参考 Tooltip position

```jsx live=true
import React from 'react';
import { AutoComplete } from '@douyinfe/semi-ui';

() => {
    const [data, setData] = useState([]);

    const change = (input) => {
        let newData = ['gmail.com', '163.com', 'qq.com'].map(domain => `${input}@${domain}`);
        if (!input) {
            newData = [];
        }
        setData(newData);
    };
    return (
        <div>
            <AutoComplete
                data={data}
                position="top"
                onSearch={change}
                placeholder="选项菜单在上方显示"
                style={{ width: 200, margin: 10 }}
            ></AutoComplete>
            <AutoComplete
                data={data}
                position="rightTop"
                onSearch={change}
                placeholder="选项菜单在右侧显示"
                style={{ width: 200, margin: 10 }}
            ></AutoComplete>
        </div>
    );
};

```

### 禁用

```jsx live=true
import React from 'react';
import { AutoComplete } from '@douyinfe/semi-ui';

() => (
    <AutoComplete data={[1, 2, 3, 4]} placeholder={'禁用下拉菜单'} disabled style={{ width: 200 }}></AutoComplete>
);
```

### 校验状态

可设置不同校验状态，展示不同样式

```jsx live=true
import React from 'react';
import { AutoComplete } from '@douyinfe/semi-ui';

() => (
    <>
        <AutoComplete defaultValue="ies" validateStatus="warning"></AutoComplete>
        <br />
        <br />
        <AutoComplete defaultValue="ies" validateStatus="error"></AutoComplete>
        <br />
        <br />
        <AutoComplete defaultValue="ies"></AutoComplete>
    </>
);
```

### 自定义空内容

可设置自定义展示空内容

```jsx live=true
import React from 'react';
import { AutoComplete, Empty } from '@douyinfe/semi-ui';
import { IllustrationNoContent } from '@douyinfe/semi-illustrations';

() => {
    let [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = v => {
        setLoading(true);
        setTimeout(() => {
            if (!v) {
                setData([]);
                setLoading(false);
                return;
            }
            setData(() => {
                const res = Array.from(Array(5)).map(c => Math.random());
                return res;
            });
            setLoading(false);
        }, 1000);
    };

    return (
        <AutoComplete
            loading={loading}
            data={data}
            emptyContent={<Empty style={{ padding: 12, width: 300 }} image={<IllustrationNoContent style={{ width: 150, height: 150 }}/>} description={'暂无内容'} />}
            onSearch={fetchData}
        />
    );
};
```

## API 参考

| 属性 | 说明 | 类型 | 默认值 | 版本|
| --- | --- | --- | --- |--- |
| autoFocus | 是否自动聚焦 | bool | false | 1.16.0|
| autoAdjustOverflow | 浮层被遮挡时是否自动调整方向 | bool | true | 0.27.0|
| className | 样式类名 | string | |
| clearIcon | 可用于自定义清除按钮, showClear为true时有效 | ReactNode | 2.25.0  |
| data | 候选项的数据源，可以为字符串数组或对象数组 | array | [] |
| defaultActiveFirstOption | 是否默认高亮第一个选项（按回车可直接选中） | bool | false |
| defaultOpen | 是否默认展开下拉菜单 | boolean | false |
| defaultValue | 默认值 | string | |
| disabled | 是否禁用 | boolean | false |
| dropdownClassName | 下拉列表的 CSS 类名 | string |  |
| dropdownStyle | 下拉列表的内联样式 | object |  |
| emptyContent | data 为空时自定义下拉内容  | ReactNode | null | 1.16.0 |
| getPopupContainer | 指定父级 DOM，下拉列表浮层将会渲染至该 DOM 中，自定义需要设置 `position: relative` | () => HTMLElement | () => document.body |
| loading | 下拉列表是否展示加载动画 | boolean | false |
| maxHeight | 下拉列表的最大高度 | number\|string | 300 |
| motion | 下拉列表出现/隐藏时，是否有动画 | boolean | true |
| onSelectWithObject | 点击候选项时，是否将选中项 option 的其他属性也作为回调入参。设为 true 时，onSelect 的入参类型会从 `string` 变为 object: { value, label, ...rest }| boolean | false |1.23.0 |
| placeholder | 输入框提示 | string | |
| position | 下拉菜单的显示位置，可选值同 tooltip 组件 | string | 'bottomLeft' |
| prefix | 选择框的前缀标签 | ReactNode |  | 0.23.0|
| renderItem | 控制下拉列表候选项的渲染 | (option: string\|Item)=> React.Node |  |
| renderSelectedItem | 通过 renderSelectedItem 自定义下拉列表候选项被点击选中后，在选择框中的渲染内容<br/>**仅支持 String 类型的返回值**<br/> | (option: string\|Item) => string |  |0.23.0 |
| showClear | 是否展示清除按钮 | boolean | false |
| size | 尺寸，可选`small`, `default`, `large`  | string | `default` |
| style | 样式 | object |  |
| suffix | 选择框的前缀标签 | ReactNode |  |0.23.0 |
| validateStatus | 校验状态，可选值`default`、`error`、`warning`，默认 default。仅影响展示样式 | string | 'default' | 1.14.0|
| value | 当前值 | string\|number | 无 |
| zIndex | 下拉菜单的 zIndex | number |  |
| onBlur | 失去焦点时的回调 | Function(event) | |
| onChange | 输入框变化/候选项选中时变化 | Function(value:string\|number) | |1.23.0 |
| onFocus | 获得焦点时的回调 | Function(event) | |
| onKeyDown | keydown 回调 | (e: React.KeyboardEvent) => void | | 2.21.0 |
| onSearch | 输入变化时的回调 | Function(value: string) | |
| onSelect | 下拉菜单候选项被选中时的回调 | Function(item: string\|number\|Item) | |

## Accessibility
### 键盘和焦点

- AutoComplete 的 input 框可被聚焦，聚焦后，键盘用户可以通过 `上箭头` 或 `下箭头` 打开选项面板（如有）
- AutoComplete 也支持通过 `Enter` 键打开和收起面板
- 若用户将 defaultActiveFirstOption 属性设置为 true 时，选项面板打开后默认高亮第一个选项
- 若下拉菜单打开时：
  - 使用 `Esc` 可以关闭菜单
  - 使用 `上箭头` 或 `下箭头` 可以切换选项
  - 被聚焦的选项可以通过 `Enter` 键选中，并收起面板

## 文案规范
- 需要清晰地展示内容，让用户显而易见地感知到可用的各个选项
- 限制一次性展示的选项数量

## 设计变量
<DesignToken/>