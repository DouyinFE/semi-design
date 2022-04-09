---
localeCode: zh-CN
order: 26
category: 输入类
title:  Select 选择器
icon: doc-select
width: 60%
brief: 用户可以通过 Select 选择器从一个选项集合中去选中一个或多个选项，并呈现最终选择结果
---


## 代码演示

### 如何引入

```jsx import
import { Select } from '@douyinfe/semi-ui';
const Option = Select.Option;
```

<Notice title='注意'>
Select的直接子元素必须为 Option 或者 OptGroup，不允许为其他Element
</Notice>

### 基本使用

每个 Option 标签都必须声明 value 属性，Option 的 children 或 label 将会被渲染至下拉列表中  

```jsx live=true
import React from 'react';
import { Select } from '@douyinfe/semi-ui';

() => (
    <>
        <Select defaultValue='abc' style={{ width: 120 }}>
            <Select.Option value='abc'>抖音</Select.Option>
            <Select.Option value='hotsoon'>火山</Select.Option>
            <Select.Option value='jianying' disabled>剪映</Select.Option>
            <Select.Option value='xigua'>西瓜视频</Select.Option>
        </Select>
        <br/><br/>
        <Select defaultValue='abc' disabled style={{ width: 120 }}>
            <Select.Option value='abc'>抖音</Select.Option>
            <Select.Option value='hotsoon'>火山</Select.Option>
        </Select>
        <br/><br/>
        <Select placeholder='请选择业务线' style={{ width: 120 }}>
            <Select.Option value='abc'>抖音</Select.Option>
            <Select.Option value='hotsoon'>火山</Select.Option>
            <Select.Option value='jianying' disabled>剪映</Select.Option>
            <Select.Option value='xigua'>西瓜视频</Select.Option>
        </Select>
    </>
);
```

### 以数组形式传入 Option

可以直接通过`optionList`传入一个对象数组，每个对象必须包含 value/label 属性（当然其他属性也可以通过此方式传入）

```jsx live=true
import React from 'react';
import { Select } from '@douyinfe/semi-ui';

() => {
    const list = [
        { value: 'abc', label: '抖音', otherKey:0 },
        { value: 'hotsoon', label: '火山小视频', disabled: true, otherKey: 1 },
        { value: 'jianying', label: '剪映', otherKey: 2 },
        { value: 'toutiao', label: '今日头条', otherKey: 3 },
    ];
    return (
        <Select placeholder='请选择业务线' style={{ width: 180 }} optionList={list}>
        </Select>
    );
};
```

### 多选

配置`multiple`属性，可以支持多选

配置 `maxTagCount` 可以限制已选项展示的数量，超出部分将以+N 的方式展示

配置 `max` 属性可限制最大可选的数量，超出最大限制数量后无法选中，同时会触发`onExceed`回调

```jsx live=true
import React from 'react';
import { Select } from '@douyinfe/semi-ui';

() => (
    <>
        <Select multiple style={{ width: '320px' }} defaultValue={['abc','hotsoon']}>
            <Select.Option value='abc'>抖音</Select.Option>
            <Select.Option value='hotsoon'>火山</Select.Option>
            <Select.Option value='jianying'>剪映</Select.Option>
            <Select.Option value='xigua'>西瓜视频</Select.Option>
        </Select>
        <br/><br/>
        <Select multiple style={{ width: '320px' }} defaultValue={['abc','hotsoon', 'jianying']} maxTagCount={2}>
            <Select.Option value='abc'>抖音</Select.Option>
            <Select.Option value='hotsoon'>火山</Select.Option>
            <Select.Option value='jianying'>剪映</Select.Option>
            <Select.Option value='xigua'>西瓜视频</Select.Option>
        </Select>

        <br/><br/>
        <Select multiple style={{ width: '320px' }} defaultValue={['abc']} max={2} onExceed={()=>Toast.warning('最多只允许选择两项')}>
            <Select.Option value='abc'>抖音</Select.Option>
            <Select.Option value='hotsoon'>火山</Select.Option>
            <Select.Option value='jianying'>剪映</Select.Option>
            <Select.Option value='xigua'>西瓜视频</Select.Option>
        </Select>
    </>
);
```

### 分组

分组功能 v0.31.0 后提供  
用 OptGroup 进行分组（分组功能仅支持通过jsx方式声明children使用，不支持optionList方式传入）  

<Notice title='注意'>
  1. OptGroup必须为Select的直接子元素，不允许有Fragment或DIV等其他元素阻隔 <br/>
  2. 若Select的children需要动态更新，OptGroup上的key也需要进行更新，否则Select无法识别  
</Notice>


```jsx live=true
import React from 'react';
import { Select } from '@douyinfe/semi-ui';

() => (
    <Select placeholder="" style={{ width: 180 }} filter>
        <Select.OptGroup label="Asia">
            <Select.Option value="a-1">China</Select.Option>
            <Select.Option value="a-2">Koera</Select.Option>
        </Select.OptGroup>
        <Select.OptGroup label="Europe">
            <Select.Option value="b-1">Germany</Select.Option>
            <Select.Option value="b-2">France</Select.Option>
        </Select.OptGroup>
        <Select.OptGroup label="South America">
            <Select.Option value="c-1">Peru</Select.Option>
        </Select.OptGroup>
    </Select>
);
```

```jsx live=true
import React from 'react';
import { Select } from '@douyinfe/semi-ui';

() => {
    const data = [
        {
            label: 'Asia',
            children: [
                { value: 'a-1', label: 'China' },
                { value: 'a-2', label: 'Koera' },
            ]
        },
        {
            label: 'Europe',
            children: [
                { value: 'b-1', label: 'Germany' },
                { value: 'b-2', label: 'France' },
            ]
        },
        {
            label: 'South America',
            children: [
                { value: 'c-1', label: 'Peru' },
            ]
        }
    ];
    return (
        <Select placeholder="" style={{ width: 180 }} filter>
            {
                data.map((group, index) => (
                    <Select.OptGroup label={group.label} key={`${index}-${group.label}`}>
                        {
                            group.children.map((option, index2) => (
                                <Select.Option value={option.value} key={`${index2}-${group.label}`}>
                                    {option.label}
                                </Select.Option>
                            ))
                        }
                    </Select.OptGroup>
                ))
            }
        </Select>
    );
};

```

### 不同尺寸

通过Size控制选择器的大小尺寸: `small` / `default` / `large`

```jsx live=true
import React from 'react';
import { Select } from '@douyinfe/semi-ui';

() => (
    <>
        <Select placeholder='请选择业务线' style={{ width: '180px' }} size='small'>
            <Select.Option value='hotsoon'>火山</Select.Option>
        </Select>
        <br/><br/>
        <Select placeholder='请选择业务线' style={{ width: '180px' }}>
            <Select.Option value='hotsoon'>火山</Select.Option>
        </Select>
        <br/><br/>
        <Select placeholder='请选择业务线' style={{ width: '180px' }} size='large'>
            <Select.Option value='hotsoon'>火山</Select.Option>
        </Select>
    </>
);
```

### 不同校验状态样式

validateStatus: default / warning / error  
仅影响背景颜色等样式表现

```jsx live=true
import React from 'react';
import { Select } from '@douyinfe/semi-ui';

() => (
    <>
        <Select style={{ width: '180px' }}>
            <Select.Option value='hotsoon'>火山</Select.Option>
        </Select>
        <br/><br/>
        <Select style={{ width: '180px' }} validateStatus='warning'>
            <Select.Option value='hotsoon'>火山</Select.Option>
        </Select>
        <br/><br/>
        <Select style={{ width: '180px' }} validateStatus='error'>
            <Select.Option value='hotsoon'>火山</Select.Option>
        </Select>
    </>
);
```

### 配置前缀、后缀、清除按钮

-   可以通过`prefix`传入选择框前缀，通过`suffix`传入选择框后缀，可以为文本或者 ReactNode  
    当 prefix、suffix 传入的内容为文本或者 Icon 时，会自动带上左右间隔，若为自定义 ReactNode，则左右间隔为 0
-   通过`showClear`控制清除按钮是否展示
-   通过`showArrow`控制右侧下拉箭头是否展示

```jsx live=true
import React from 'react';
import { Select } from '@douyinfe/semi-ui';
import { IconVigoLogo, IconGift } from '@douyinfe/semi-icons';

() => (
    <>
        <Select
            style={{ width: '320px' }}
            defaultValue={'hotsoon'}
            prefix={<IconVigoLogo />}
            showClear={true}
        >
            <Select.Option value='abc'>抖音</Select.Option>
            <Select.Option value='hotsoon'>火山</Select.Option>
            <Select.Option value='jianying'>剪映</Select.Option>
            <Select.Option value='xigua'>西瓜视频</Select.Option>
        </Select>
        <br/><br/>
        <Select
            style={{ width: '320px' }}
            defaultValue={'hotsoon'}
            prefix={<IconVigoLogo />}
            suffix={<IconGift />}
            showArrow={false}
        >
            <Select.Option value='abc'>抖音</Select.Option>
            <Select.Option value='hotsoon'>火山</Select.Option>
            <Select.Option value='jianying'>剪映</Select.Option>
            <Select.Option value='xigua'>西瓜视频</Select.Option>
        </Select>
    </>
);
```

### 内嵌标签

通过设置`insetLabel`，你可以给 Select 设置 label，可以传入 string 或者 ReactNode  
当传入类型为 ReactNode 时，注意要自行处理 label 与文本之间的间隔

```jsx live=true
import React from 'react';
import { Select } from '@douyinfe/semi-ui';

() => {
    const list = [
        { value: 'abc', label: '抖音' },
        { value: 'hotsoon', label: '火山小视频' },
        { value: 'jianying', label: '剪映' },
        { value: 'toutiao', label: '今日头条' },
    ];
    return (
        <>
            <Select style={{ width: 300 }} optionList={list} insetLabel='业务线' defaultValue='abc'>
            </Select>
            <br/><br/>
            <Select
                style={{ width: 300 }}
                optionList={list} placeholder='请选择业务线'
                insetLabel={<span style={{marginRight: 0, marginLeft: 10, color: "var(--semi-color-text-2)"}}>业务线</span>}>
            </Select>
        </>
    );
};
```

### 在顶部/底部渲染附加项

我们在弹出层顶部、底部分别预留了插槽，当你需要在弹出层中添加自定义 node 时  
可以通过`innerBottomSlot`或者`outerBottomSlot`传入，自定义 node 将会被渲染在弹出层底部；可以通过`innerTopSlot`或者`outerTopSlot`传入，自定义 node 将会被渲染在弹出层顶部。

-   `innerTopSlot` 和 `innerBottomSlot`将会被渲染在 optionList 内部，当滚动到 optionList 顶部/底部时展现
-   `outerTopSlot` 和 `outerBottomSlot`将会被渲染为与 optionList 平级，无论 optionList 是否滚动，都会始终展现

```jsx live=true
import React from 'react';
import { Select } from '@douyinfe/semi-ui';

() => {
    let innerSlotStyle = {
        backgroundColor: 'var(--color-white)',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        paddingLeft: 32,
        borderTop: '1px solid var(--semi-color-border)',
        borderRadius: '0 0 6px 6px',
        color: 'var(--semi-color-link)',
    };
    let innerSlotNode = (<div style={innerSlotStyle}>
        点击加载更多
    </div>);
    let outSlotStyle = {
        backgroundColor: 'var(--semi-color-fill-0)',
        height: '36px',
        display: 'flex',
        paddingLeft: 32,
        color: 'var(--semi-color-link)',
        alignItems: 'center',
        cursor: 'pointer',
        borderTop: '1px solid var(--semi-color-border)',
        borderRadius: '0 0 6px 6px',
    };
    let outSlotNode = (<div style={outSlotStyle}>
        <span style={{color: 'var(--semi-color-link)'}}>未找到应用?</span>
    </div>);

    return (
        <div>
            <p>outerBottomSlot:</p>
            <Select
                style={{ width: 300 }}
                dropdownStyle={{ width: 180 }}
                maxHeight={150}
                outerBottomSlot={outSlotNode}
                placeholder='自定义外侧底部slot，始终显示'
                defaultOpen
                autoAdjustOverflow={false}
                position='bottom'
            >
                <Select.Option value='abc'>抖音</Select.Option>
                <Select.Option value='hotsoon'>火山</Select.Option>
                <Select.Option value='jianying'>剪映</Select.Option>
                <Select.Option value='duoshan'>多闪</Select.Option>
                <Select.Option value='xigua'>西瓜视频</Select.Option>
            </Select>
            <p style={{ marginTop: 200 }}>innerBottomSlot:</p>
            <Select
                style={{ width: 300 }}
                dropdownStyle={{ width: 180 }}
                maxHeight={150}
                innerBottomSlot={innerSlotNode}
                placeholder='自定义内侧底部slot，滚动至底部显示'
            >
                <Select.Option value='abc'>抖音</Select.Option>
                <Select.Option value='hotsoon'>火山</Select.Option>
                <Select.Option value='jianying'>剪映</Select.Option>
                <Select.Option value='duoshan'>多闪</Select.Option>
                <Select.Option value='xigua'>西瓜视频</Select.Option>
            </Select>
        </div>
    );
};

```

通过 outerTopSlot 将内容插入顶部插槽
```jsx live=true
import React from 'react';
import { Select } from '@douyinfe/semi-ui';

class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 'component',
        };
        this.list = {
            component: [
                { value: 'select', label: '选择器' },
                { value: 'tabs', label: '标签' },
                { value: 'avatar', label: '头像' },
                { value: 'button', label: '按钮' },
            ],
            design: [
                { value: 'color', label: '颜色' },
                { value: 'dark', label: '暗色模式' },
                { value: 'icon', label: '图标' },
                { value: 'font', label: '字体' },
            ],
            feedback: [
                { value: 'faq', label: '常见问题' },
                { value: 'join', label: '加入用户群' },
                { value: 'hornbill', label: '犀鸟反馈问题' },
            ],
        };
        this.handleTabClick = this.handleTabClick.bind(this);
    };

    handleTabClick(itemKey) {
        this.setState({key: itemKey});
    };

    render() {
        const { key } = this.state;
        const tabStyle = {
            cursor: 'pointer',
            marginRight: 12,
            paddingBottom: 4,
        };
        const tabActiveStyle = {
            ...tabStyle,
            borderBottom: '1px solid var(--semi-color-primary)',
            fontWeight: 700,
        };
        const tabWrapper = {
            display: 'flex',
            paddingTop: 8,
            paddingLeft: 32,
            borderBottom: '0.5px solid var(--semi-color-border)'
        };
        const tabOptions = [
            {itemKey: 'component', label: '组件'},
            {itemKey: 'design', label: '设计'},
            {itemKey: 'feedback', label: '反馈'},
        ];
        const outerTopSlotNode = (
            <div style={tabWrapper}>
                {
                    tabOptions.map((item, index) => {
                        style = item.itemKey === key ? tabActiveStyle : tabStyle;
                        return (
                            <div style={style} key={item.itemKey} onClick={() => this.handleTabClick(item.itemKey)}>{item.label}</div>
                        );
                    })
                }
            </div>
        );

        return (
            <div>
                <Select
                    defaultOpen
                    autoAdjustOverflow={false}
                    position='bottom'
                    style={{width: 200}}
                    outerTopSlot={outerTopSlotNode}
                    optionList={this.list[key]}
                />
            </div>
        );
    };
}
```

### 受控组件

传入 value 时 Select 为受控组件，所选中的值完全由 value 决定。

```jsx live=true hideInDSM
import React, { useState } from 'react';
import { Select } from '@douyinfe/semi-ui';

() => {
    let [value, setValue] = useState('xigua');
    return (
        <>
            <Select value={value} style={{ width: '300px' }} onChange={setValue} placeholder='受控的Select'>
                <Select.Option value='abc'>抖音</Select.Option>
                <Select.Option value='hotsoon'>火山</Select.Option>
                <Select.Option value='jianying'>剪映</Select.Option>
                <Select.Option value='xigua'>西瓜视频</Select.Option>
            </Select>
        </>
    );
};
```

### 动态修改 Options

如果需要动态更新 Options，应该使用受控的 value

```jsx live=true hideInDSM
import React, { useState } from 'react';
import { Select, Button } from '@douyinfe/semi-ui';

() => {
    let [options, setOptions] = useState([1, 2, 3, 4]);
    function add() {
        let length = Math.ceil(Math.random() * 10);
        let newOptions = Array.from({length}, (v,i) => i+1);
        setOptions(newOptions);
    }
    return (
        <>
            <Select style={{ width: '180px' }} placeholder='请选择' value={4}>
                {options.map(option => (
                    <Select.Option
                        value={option}
                        key={option}>
                        {option}
                    </Select.Option>
                ))}
            </Select>
            <br/><br/>
            <Button onClick={add}>
                changeOptions Dynamic
            </Button>
        </>
    );
};
```

### 联动

使用受控value，实现不同Select之间的联动。如果是带有层级关系的复杂联动建议直接使用`Cascader`组件

```jsx live=true hideInDSM
import React from 'react';
import { Select } from '@douyinfe/semi-ui';

class Link extends React.Component {
    get provinces() {
        return ['四川', '广东'];
    }
    get maps() {
        return {
            '四川': ['成都', '都江堰'],
            '广东': ['广州', '深圳', '东莞'],
        };
    }
    constructor() {
        super();
        this.state = {
            provinces: this.provinces,
            maps: this.maps,
            citys: this.maps[this.provinces[0]],
            city: this.maps[this.provinces[0]][0]
        };
        this.provinceChange = this.provinceChange.bind(this);
        this.cityChange = this.cityChange.bind(this);
    }

    provinceChange(newProvince) {
        const { maps } = this.state;
        this.setState({ citys: maps[newProvince], city: maps[newProvince][0] });
    }
    cityChange(city) {
        this.setState({ city });
    }
    render() {
        const { provinces, citys, city } = this.state;
        return (
            <React.Fragment>
                <Select
                    style={{ width: '150px', margin: '10px' }}
                    onChange={this.provinceChange}
                    defaultValue={provinces[0]}
                >
                    {provinces.map(pro => (
                        <Select.Option value={pro} key={pro}>{pro}</Select.Option>
                    ))}
                </Select>
                <Select
                    style={{ width: '150px', margin: '10px'  }}
                    value={city} onChange={this.cityChange}>
                    {citys.map(c => (
                        <Select.Option value={c} key={c}>{c}</Select.Option>
                    ))}
                </Select>
            </React.Fragment>
        );
    }
}
```

### 开启搜索

将 `filter` 置为 true，开启搜索能力。默认搜索策略将为 input 输入值与 option 的 label 值进行 include 对比  
默认情况下，多选选中后会自动清空搜索关键字。若你希望保留，可以通过 autoClearSearchValue 设为 false 关闭默认行为（v2.3后提供）

```jsx live=true hideInDSM
import React from 'react';
import { Select } from '@douyinfe/semi-ui';

() => (
    <>
        <Select filter style={{ width: 180 }} placeholder='带搜索功能的单选'>
            <Select.Option value='abc'>抖音</Select.Option>
            <Select.Option value='hotsoon'>火山</Select.Option>
            <Select.Option value='jianying'>剪映</Select.Option>
            <Select.Option value='xigua'>西瓜视频</Select.Option>
        </Select>
        <br/><br/>
        <Select filter multiple style={{ width: 300 }} placeholder='带搜索功能的多选' autoClearSearchValue={false}>
            <Select.Option value='semi-0'>Semi-0</Select.Option>
            <Select.Option value='semi-1'>Semi-1</Select.Option>
            <Select.Option value='semi-2'>Semi-2</Select.Option>
            <Select.Option value='semi-3'>Semi-3</Select.Option>
            <Select.Option value='semi-4'>Semi-4</Select.Option>
        </Select>
    </>
);
```

### 远程搜索

带有远程搜索，防抖请求，加载状态的多选示例  
通过`filter`开启搜索能力  
将`remote`设置为 true 关闭对当前数据的筛选过滤(在 v0.24.0 后提供)  
通过动态更新`optionList`更新下拉菜单中的备选项  
使用受控的 value 属性

```jsx live=true hideInDSM
import React from 'react';
import { debounce } from 'lodash-es';
import { Select } from '@douyinfe/semi-ui';

class SearchDemo extends React.Component {
    constructor(){
        super();
        this.state = {
            loading: false,
            optionList: [
                { value: 'abc', label: '抖音', type: 1 },
                { value: 'hotsoon', label: '火山小视频', type: 2 },
                { value: 'jianying', label: '剪映', type: 3 },
                { value: 'toutiao', label: '今日头条', type: 4 },
            ],
            value: '',
            multipleValue: [],
        };
        this.handleSearch = debounce(this.handleSearch, 800).bind(this);
        this.onChange = this.onChange.bind(this);
        this.onMultipleChange = this.onMultipleChange.bind(this);
    }

    handleSearch(inputValue) {
        this.setState({ loading: true });
        let length = Math.ceil(Math.random()*100);
        let result = Array.from({ length }, (v, i) => {
            return { value: inputValue + i, label: inputValue + '-新业务线-' + i, type: i + 1 };
        });
        setTimeout(() => {
            this.setState({ optionList: result, loading: false });
        }, 2000);
    }

    onChange(value) {
        this.setState({ value });
    }

    onMultipleChange(multipleValue) {
        this.setState({ multipleValue });
    }

    render() {
        const { loading, optionList, value, multipleValue } = this.state;
        return (
            <div>
                <Select
                    style={{ width: 300 }}
                    filter
                    remote
                    onChangeWithObject
                    onSearch={this.handleSearch}
                    optionList={optionList}
                    loading={loading}
                    onChange={this.onChange}
                    value={value}
                    placeholder='请选择'
                    emptyContent={null}
                >
                </Select>
                <br/><br/>
                <Select
                    style={{ width: 300 }}
                    filter
                    remote
                    onChangeWithObject
                    multiple
                    value={multipleValue}
                    onSearch={this.handleSearch}
                    optionList={optionList}
                    loading={loading}
                    onChange={this.onMultipleChange}
                    placeholder='请选择'
                    emptyContent={null}
                >
                </Select>
            </div>
        );
    }

}
```

### 自定义搜索逻辑

可以将 `filter` 置为自定义函数，定制你想要的搜索策略  
如下例子，选项 label 值都是大写，默认的检索策略是字符串 include 对比，会区分大小写。  
通过传入自定义 `filter` 函数，检索时输入小写字母也能搜到相应内容。

```jsx live=true hideInDSM
import React from 'react';
import { Select } from '@douyinfe/semi-ui';

() => {
    function searchLabel(sugInput, option) {
        let label = option.label.toUpperCase();
        let sug = sugInput.toUpperCase();
        return label.includes(sug);
    }
    return (
        <Select filter={searchLabel} style={{ width: '180px' }} placeholder='try abc'>
            <Select.Option value='abc'>ABC</Select.Option>
            <Select.Option value='hotsoon'>HOTSOON</Select.Option>
            <Select.Option value='jianying'>PIPIXIA</Select.Option>
            <Select.Option value='xigua'>XIGUA</Select.Option>
        </Select>
    );
};
```

### 自定义已选项标签渲染

默认情况下，选中选项后会将 option.label 或 option.children 的内容回填到选择框中  
但你可以通过 `renderSelectedItem` 自定义选择框中已选项标签的渲染结构

-   单选时 `renderSelectedItem(optionNode:object) => content:ReactNode`
-   多选时 `renderSelectedItem(optionNode:object, { index:number, onClose:function }) => { isRenderInTag:bool, content:ReactNode }`
    -   isRenderInTag 为 true 时，会自动将 content 包裹在 Tag 中渲染（带有背景色以及关闭按钮）
    -   isRenderInTag 为 false 时，将直接渲染返回的 content

```jsx live=true
import React from 'react';
import { Select, Avatar, Tag } from '@douyinfe/semi-ui';

() => {
    const list = [
        { "name": "夏可漫", "email": "xiakeman@example.com", "avatar": "https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/avatarDemo.jpeg" },
        { "name": "申悦", "email": "shenyue@example.com", "avatar": "https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/bf8647bffab13c38772c9ff94bf91a9d.jpg" },
        { "name": "曲晨一", "email": "quchenyi@example.com", "avatar": "https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/8bd8224511db085ed74fea37205aede5.jpg" },
        { "name": "文嘉茂", "email": "wenjiamao@example.com", "avatar": "https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/6fbafc2d-e3e6-4cff-a1e2-17709c680624.png" },
    ];

    const renderSelectedItem = optionNode => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={optionNode.avatar} size="small">{optionNode.abbr}</Avatar>
            <span style={{ marginLeft: 8 }}>{optionNode.email}</span>
        </div>
    );

    // avatarSrc & avatarShape are supported after 1.6.0-beta
    const renderMultipleWithCustomTag = (optionNode, { onClose }) => {
        const content = (
            <Tag
                avatarSrc={optionNode.avatar}
                avatarShape='circle'
                closable={true}
                onClose={onClose}
                size='large'
            >
                {optionNode.name}
            </Tag>
        );
        return {
            isRenderInTag: false,
            content
        };
    };

    const renderMultipleWithCustomTag2 = (optionNode, { onClose }) => {
        const content = (
            <Tag
                avatarSrc={optionNode.avatar}
                avatarShape='square'
                closable={true}
                onClose={onClose}
                size='large'
            >
                {optionNode.name}
            </Tag>
        );
        return {
            isRenderInTag: false,
            content
        };
    };

    const renderCustomOption = (item, index) => {
        const optionStyle = {
            display: 'flex',
            paddingLeft: 24,
            paddingTop: 10,
            paddingBottom: 10
        };
        return (
            <Select.Option value={item.name} style={optionStyle} showTick={true}  {...item} key={item.email}>
                <Avatar size="small" src={item.avatar} />
                <div style={{ marginLeft: 8 }}>
                    <div style={{ fontSize: 14 }}>{item.name}</div>
                    <div style={{ color: 'var(--color-text-2)', fontSize: 12, lineHeight: '16px', fontWeight: 'normal' }}>{item.email}</div>
                </div>
            </Select.Option>
        );
    };

    return (
        <>
            <Select
                placeholder='请选择'
                style={{ width: 280, height: 40 }}
                onChange={v => console.log(v)}
                defaultValue={'夏可漫'}
                renderSelectedItem={renderSelectedItem}
            >
                {list.map((item, index) => renderCustomOption(item, index))}
            </Select>
            <Select
                placeholder='请选择'
                maxTagCount={2}
                style={{ width: 280, marginTop: 20 }}
                onChange={v => console.log(v)}
                defaultValue={['夏可漫', '申悦']}
                multiple
                renderSelectedItem={renderMultipleWithCustomTag}
            >
                {list.map((item, index) => renderCustomOption(item, index))}
            </Select>
            <Select
                placeholder='请选择'
                maxTagCount={2}
                style={{ width: 280, marginTop: 20 }}
                onChange={v => console.log(v)}
                defaultValue={['夏可漫', '申悦']}
                multiple
                renderSelectedItem={renderMultipleWithCustomTag2}
            >
                {list.map((item, index) => renderCustomOption(item, index))}
            </Select>
        </>
    );
};
```

### 自定义弹出层样式

你可以通过 dropdownClassName、dropdownStyle 控制弹出层的样式  
例如当自定义弹出层的宽度时，可以通过 dropdownStyle 传入 width

```jsx live=true hideInDSM
import React from 'react';
import { Select } from '@douyinfe/semi-ui';

() => (
    <Select placeholder='自定义弹出层样式的' style={{ width: 180 }} dropdownStyle={{ width: 250 }} dropdownClassName='test'>
        <Select.Option value='abc'>抖音</Select.Option>
        <Select.Option value='hotsoon'>火山</Select.Option>
        <Select.Option value='jianying'>剪映</Select.Option>
        <Select.Option value='xigua'>西瓜视频</Select.Option>
    </Select>
);
```

### 获取选项的其他属性

默认情况下`onChange`只能拿到 value，如果需要拿选中节点的其他属性，可以使用`onChangeWithObject`属性  
此时`onChange`函数的入参将会是 object，包含 option 的各种属性，例如 `onChange({ value, label, ...rest })`  

<Notice title='注意'>
  当 onChangeWithObject 置为 true 时，`defaultValue`/`Value`也应为 object，且须带有`value`、`label` key
</Notice>

```jsx live=true hideInDSM
import React from 'react';
import { Select, TextArea } from '@douyinfe/semi-ui';

() => {
    const list = [
        { value: 'abc', label: '抖音', type: 1 },
        { value: 'hotsoon', label: '火山', type: 2 },
        { value: 'jianying', label: '剪映', type: 3 },
        { value: 'toutiao', label: '今日头条', type: 4 },
    ];
    const [cbValue, setCbValue] = useState();
    const [multipleCbValue, setMultipleCbValue] = useState();

    const onChange = (value) => {
        setCbValue(value);
        console.log(value);
    };

    const onMultipleChange = (value) => {
        setMultipleCbValue(value);
        console.log(value);
    };

    return (
        <div>
            <div>
                <Select
                    style={{ width: 150 }}
                    onChangeWithObject
                    optionList={list}
                    placeholder='单选'
                    defaultValue={list[0]}
                    onChange={onChange}
                >
                </Select>
                <h4>onChange回调:</h4>
                <TextArea style={{ width: 320, marginBottom: 48 }} autosize value={JSON.stringify(cbValue)} rows={2}/>
            </div>
            <div>
                <Select
                    style={{ width: 320 }}
                    onChangeWithObject
                    multiple
                    optionList={list}
                    onChange={onMultipleChange}
                    placeholder='多选'
                >
                </Select>
                <h4>onChange回调:</h4>
                <TextArea style={{ width: 320 }} autosize value={JSON.stringify(multipleCbValue)} />
            </div>

        </div>
    );
};
```

### 创建条目

设置`allowCreate`，可以创建并选中选项中不存在的条目  
允许通过 `renderCreateItem` 自定义创建标签时的内容显示（通过返回 ReactNode，注意你需要自定义样式），该函数默认值为 (input) => '创建' + input  
可以配合`defaultActiveFirstOption`属性使用，自动选中第一项，当输入完内容直接回车时，可立即创建  

<Notice title='注意'>
  当开启allowCreate后，不会再响应对Children或者optionList的更新
</Notice>

```jsx live=true
import React from 'react';
import { Select } from '@douyinfe/semi-ui';

() => {
    const optionList = [
        { value: 'abc', label: '抖音' },
        { value: 'hotsoon', label: '火山小视频' },
        { value: 'jianying', label: '剪映' },
        { value: 'toutiao', label: '今日头条' },
    ];
    return (
        <>
            <Select
                style={{ width: 400 }}
                optionList={optionList}
                allowCreate={true}
                multiple={true}
                filter={true}
                onChange={v => console.log(v)}
                defaultActiveFirstOption
            >
            </Select>
            <br/><br/>
            <Select
                style={{ width: 400 }}
                optionList={optionList}
                allowCreate={true}
                multiple={true}
                filter={true}
                placeholder='With renderCreateItem'
                renderCreateItem={input => <div style={{padding:10}}>Create Item：{input}</div>}
                onChange={v => console.log(v)}
                defaultActiveFirstOption
            >
            </Select>
        </>
    );
};
```

### 虚拟化

传入`virtualize`时开启列表虚拟化，用于大量 Option 节点的情况优化性能  
virtualize 是一个包含下列值的对象：

-   height: Option 列表高度值，默认 300
-   width: Option 列表宽度值，默认 100%
-   itemSize: 每行 Option 的高度，必传
 
```jsx live=true hideInDSM
import React from 'react';
import { Select } from '@douyinfe/semi-ui';

class VirtualizeDemo extends React.Component {
    constructor(props) {
        super(props);
        let newOptions = Array.from({ length: 3000 }, (v, i) => ({ label: `option-${i}`, value: i }));
        this.state = {
            optionList: newOptions,
        };
    }

    render() {
        let { groups, optionList } = this.state;
        let virtualize = {
            height: 300,
            width: '100%',
            itemSize: 36, // px
        };
        return (
            <>
                <Select
                    placeholder="拥有3k个Option的Select"
                    style={{ width: 260 }}
                    filter
                    onSearch={this.handleSearch}
                    virtualize={virtualize}
                    optionList={optionList}
                ></Select>
            </>
        );
    }
}
```

### 自定义触发器

如果 Select 默认的触发器样式满足不了你的需求，可以用`triggerRender`自定义选择框的展示

triggerRender 入参如下

```typescript
interface triggerRenderProps {
  value: array<object> // 当前所有已选中的options
  inputValue: string; // 当前input框的输入值
  onChange: (inputValue: string) => void; // 用于更新 input框值的函数，当你在triggerRender自定义的Input组件值更新时你应该调用该函数，用于向Select内部同步状态
  onClear: () => void; // 用于清空值的函数
  disabled: boolean; // 是否禁用Select
  placeholder: string; // Select的placeholder
  componentProps: // 所有用户传给Select的props
}
```

```jsx live=true
import React, { useState } from 'react';
import { Select } from '@douyinfe/semi-ui';
import { IconAppCenter, IconChevronDown } from '@douyinfe/semi-icons';

() => {
    const [valList, setValList] = useState(['abc', 'hotsoon']);
    const [val, setVal] = useState('abc');
    const list = [
        { value: 'abc', label: '抖音' },
        { value: 'hotsoon', label: '火山小视频' },
        { value: 'jianying', label: '剪映' },
        { value: 'toutiao', label: '今日头条' },
    ];
    const triggerRender = ({ value, }) => {
        return (
            <div style={{
                minWidth: '112',
                backgroundColor: 'var(--semi-color-primary-light-default)',
                height: 32,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 12,
                borderRadius: 3,
                color: 'var(--semi-color-primary)'
            }}
            >
                <div style={{
                    fontWeight: 600,
                    flexShrink: 0,
                    fontSize: 14,
                }}>
                    业务线
                </div>
                <div style={{ margin: 4, whiteSpace: 'nowrap', textOverflow: 'ellipsis', flexGrow: 1, overflow: 'hidden' }}>
                    {value.map(item => item.label).join(' , ')}
                </div>
                <IconAppCenter style={{ marginRight: 8, flexShrink: 0 }} />
            </div>
        );
    };

    const triggerRender2 = ({ value, ...rest }) => {
        return (
            <div style={{
                minWidth: '112',
                height: 32,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 8,
                borderRadius: 3,
            }}
            >
                <div style={{ margin: 4, whiteSpace: 'nowrap', textOverflow: 'ellipsis', flexGrow: 1, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                    {value.map(item => item.label).join(' , ')}
                    <IconChevronDown style={{ margin: '0 8px', flexShrink: 0 }} />
                </div>
            </div>
        );
    };

    return (
        <div>
            <h4>不同背景色的触发器</h4>
            <Select
                value={valList}
                triggerRender={triggerRender}
                optionList={list}
                onChange={(value) => setValList(value)}
                multiple
                style={{width: 240}}
            >
            </Select>
            <br/><br/>
            <h4>无边框无背景色的触发器</h4>
            <Select
                value={val}
                onChange={(value) => setVal(value)}
                triggerRender={triggerRender2}
                optionList={list}
                style={{width: 240, marginTop: 20, outline: 0}}
            >
            </Select>
        </div>
    );
};
```

### 自定义候选项渲染

- 简单的自定义：通过Option的label属性或者children传入ReactNode，你可以控制候选项的渲染，此时内容会自动带上内边距、背景色等样式
- 完全自定义：通过传入`renderOptionItem`，你可以完全接管列表中候选项的渲染，并且从回调入参中，获取到相关的状态值。实现更高自由度的结构渲染  
  注意事项：
  1. props传入的style需在wrapper dom上进行消费，否则在虚拟化场景下会无法正常使用
  2. 选中(selected)、聚焦(focused)、禁用(disabled)等状态的样式需自行加上，你可以从props中获取到相对的boolean值
  3. onMouseEnter需在wrapper dom上绑定，否则上下键盘操作时显示会有问题
  4. 如果你的自定义 item 为 Select.Option，需要将 renderProps.onClick 透传给 Option 的 onSelect prop

```jsx live=true
import React from 'react';
import { Select, Checkbox } from '@douyinfe/semi-ui';

() => {
    const renderOptionItem = renderProps => {
        const {
            disabled,
            selected,
            label,
            value,
            focused,
            className,
            style,
            onMouseEnter,
            onClick,
            empty,
            emptyContent,
            ...rest
        } = renderProps;
        const optionCls = classNames({
            ['custom-option-render']: true,
            ['custom-option-render-focused']: focused,
            ['custom-option-render-disabled']: disabled,
            ['custom-option-render-selected']: selected,
        });
        // Notice：
        // 1.props传入的style需在wrapper dom上进行消费，否则在虚拟化场景下会无法正常使用
        // 2.选中(selected)、聚焦(focused)、禁用(disabled)等状态的样式需自行加上，你可以从props中获取到相对的boolean值
        // 3.onMouseEnter需在wrapper dom上绑定，否则上下键盘操作时显示会有问题

        return <div style={style} className={optionCls} onClick={() => onClick()} onMouseEnter={(e) => onMouseEnter()}>
            <Checkbox checked={selected} />
            <div className='option-right'>
                {label}
            </div>
        </div>;
    };

    const optionList = [
        { value: 'abc', label: '抖音', otherKey:0 },
        { value: 'hotsoon', label: '火山小视频', disabled: true, otherKey: 1 },
        { value: 'jianying', label: '剪映', otherKey: 2 },
        { value: 'toutiao', label: '今日头条', otherKey: 3 },
    ];

    return <>
        <Select
            filter
            placeholder='单选'
            dropdownClassName='components-select-demo-renderOptionItem'
            optionList={optionList}
            style={{ width: 180 }}
            renderOptionItem={renderOptionItem}
        />
        <br/>
        <br/>
        <Select
            filter
            placeholder='多选'
            multiple
            dropdownClassName='components-select-demo-renderOptionItem'
            optionList={optionList}
            style={{ width: 320 }}
            renderOptionItem={renderOptionItem}
        />
    </>;
};
```

```scss
.components-select-demo-renderOptionItem {
    .custom-option-render {
        display: flex;
        font-size: 14px;
        line-height: 20px;
        word-break: break-all;
        padding-left: 12px;
        padding-right: 12px;
        padding-top: 8px;
        padding-bottom: 8px;
        color: var(--semi-color-text-0);
        position: relative;
        display: flex;
        align-items: center;
        cursor: pointer;
        box-sizing: border-box;
        .option-right {
            margin-left: 8px;
            display: inline-flex;
            align-items: center;
        }
        &:active {
            background-color: var(--semi-color-fill-1);
        }
        &-focused {
            background-color: var(--semi-color-fill-0);
        }
        &-selected {
            //font-weight: 700;
        }
        &-disabled {
            color: var(--semi-color-disabled-text);
            cursor: not-allowed;
        }
        &:first-of-type {
            margin-top: 4px;
        }
        &:last-of-type {
            margin-bottom: 4px;
        }
    }
}
```

## API 参考

### Select Props

| 属性                     | 说明                                                                                                                                                                                                      | 类型                                  | 默认值                            |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | --------------------------------- |
| allowCreate              | 是否允许用户创建新条目，需配合 filter 使用                                                                                                                                                                | boolean                               | false                             |
| arrowIcon            | 自定义右侧下拉箭头Icon，当showClear开关打开且当前有选中值时，hover会优先显示clear icon <br/>**v1.15.0 后提供**                                                                                                                                                                 | ReactNode     |                             |
| autoAdjustOverflow       | 浮层被遮挡时是否自动调整方向（暂时仅支持竖直方向，且插入的父级为 body）                                                                                                            | boolean                               | true                              |
| autoClearSearchValue     | 选中选项后，是否自动清空搜索关键字，当mutilple、filter都开启时生效<br/>**v2.3.0 后提供**                                                                                          | boolean                               | true                              |
| autoFocus                | 初始渲染时是否自动 focus                                                                                                                                                                                  | boolean                               | false                             |
| className                | 类名                                                                                                                                                                                                      | string                                |                                   |
| clickToHide              | 已展开时，点击选择框是否自动收起下拉列表                                                                                                                                          | boolean                               | false                             |
| defaultValue             | 初始选中的值                                                                                                                                                                                              | string\|number\|array                 |                                   |
| defaultOpen              | 是否默认展开下拉列表                                                                                                                                                                                      | boolean                               | false                             |
| disabled                 | 是否禁用                                                                                                                                                                                                  | boolean                               | false                             |
| defaultActiveFirstOption | 是否默认高亮第一个选项（按回车可直接选中）                                                                                                                                                                | boolean                               | false                             |
| dropdownClassName        | 弹出层的 className                                                                                                                                                                                        | string                                |                                   |
| dropdownMatchSelectWidth | 下拉菜单最小宽度是否等于 Select                                                                                                                                                                           | boolean                               | true                              |
| dropdownStyle            | 弹出层的样式                                                                                                                                                                                              | object                                |                                   |
| emptyContent             | 无结果时展示的内容。设为 null 时，下拉列表将不展示                                                                                                                                                        | string\|ReactNode                     |                                   |
| filter                   | 是否可搜索，默认为 false。传入 true 时，代表开启搜索并采用默认过滤策略（label 是否与 sugInput 匹配），传入值为函数时，会接收 sugInput, option 两个参数，当 option 符合筛选条件应返回 true，否则返回 false | boolean \|function(sugInput, option)                    | false                             |
| getPopupContainer        | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义需要设置 `position: relative`。在做滚动、[拖拽](https://codesandbox.io/s/select-and-drag-pnpdcd?file=/src/App.tsx)时如果遇到弹层位置问题，修改渲染的 DOM 位置可能会解决问题。可参阅[Tooltip相关文档](https://semi.design/zh-CN/show/tooltip#%E6%B8%B2%E6%9F%93%E8%87%B3%E6%8C%87%E5%AE%9A%20DOM)                                                                                                                                                                     | function():HTMLElement                | () => document.body               |
| inputProps               | filter为true时, input输入框的额外配置参数，具体可配置属性请参考Input组件（注意：请不要传入value、ref、onChange、onFocus，否则会覆盖Select相关回调，影响组件行为） <br/>**v2.2.0 后提供**   | object   |               |
| innerTopSlot             | 渲染在弹出层顶部，在 optionList 内部的自定义 slot                                                                                                                     | ReactNode                             |                                   |
| innerBottomSlot          | 渲染在弹出层底部，在 optionList 内部的自定义 slot                                                                                                                                                         | ReactNode                             |                                   |
| insetLabel               | 同上，与 prefix 区别是 fontWeight 更大                                                                                                                                             | ReactNode                             |                                   |
| loading                  | 下拉列表是否展示加载动画                                                                                                                                                                                  | boolean                               | false                             |
| maxTagCount              | 多选模式下，已选项超出 maxTagCount 时，后续选项会被渲染成+N 的形式                                                                                                                                        | number                                |                                   |
| max                      | 最多可选几项，仅在多选模式下生效                                                                                                                                                                          | number                                |                                   |
| maxHeight                | 下拉菜单中 `optionList` 的最大高度                                                                                                                                                                        | string\|number                        | 300                               |
| multiple                 | 是否多选                                                                                                                                                                                                  | boolean                               | false                             |
| outerTopSlot             | 渲染在弹出层顶部，与 optionList 平级的自定义 slot                                                                                                                          | ReactNode                             |                                   |
| outerBottomSlot          | 渲染在弹出层底部，与 optionList 平级的自定义 slot                                                                                                                                                         | ReactNode                             |                                   |
| onBlur                   | 失去焦点时的回调                                                                                                                                                                 | function(event)                       |                                   |
| onChange                 | 变化时回调函数                                                                                                                                                                                            | function(value:string\|number\|array) |                                   |
| onCreate                 | allowCreate 为 true，创建备选项时的回调                                                                                                                                          | function(option)                              |                                   |
| onClear                  | 清除按钮的回调                                                                                                                                                                  | function                              |                                   |
| onChangeWithObject       | 是否将选中项 option 的其他属性作为回调。设为 true 时，onChange 的入参类型会从 string 变为 object: { value, label, ...rest }                                                                               | boolean                               | false                             |
| onDropdownVisibleChange  | 下拉菜单展开/收起时的回调                                                                                                                                                                                 | function(visible:boolean)             |                                   |
| onListScroll             | 候选项列表滚动时的回调                                                                                                                                                                                 | function(e)             |                                   |
| onSearch                 | input 输入框内容发生改变时回调函数                                                                                                                                                                        | function(sugInput:string)             |                                   |
| onSelect                 | 被选中时的回调                                                                                                                                                                     | function(value, option)               |                                   |
| onDeselect               | 取消选中时的回调，仅在多选时有效                                                                                                                                              | function(value, option)               |                                   |
| onExceed                 | 当试图选择数超出 max 限制时的回调，仅在多选时生效 <br/> 入参在v1.16.0后提供                                                                                                                                   | function(option)                              |                                   |
| onFocus                  | 获得焦点时的回调                                                                                                                                                                 | function(event)                       |                                   |
| optionList               | 可以通过该属性传入 Option,请确保数组内每个元素都具备 label、value 属性                                                                                                                                    | array(\[{value, label}\])             |                                   |
| placeholder              | 选择框默认文字                                                                                                                                                                                            | ReactNode                                |                                   |
| position                 | 菜单展开的位置，可选项同Tooltip position                                                                                                                  | string                                | 'bottomLeft'                      |
| prefix                   | 选择框的前缀标签                                                                                                                                                                | ReactNode                             |                                   |
| renderCreateItem         | allowCreate 为 true 时，可自定义创建标签的渲染                                                                                                                                 | function(inputValue:string)           | inputValue => '创建' + inputValue |
| renderSelectedItem       | 通过 renderSelectedItem 自定义选择框中已选项标签的渲染                                                                                                                          | function(option)                      |                                   |
| renderOptionItem         | 通过 renderOptionItem 完全自定义下拉列表中候选项的渲染                                                                                                                          | function(props) 入参详见Demo                      |                                   |
| remote                   | 是否开启远程搜索，当 remote 为 true 时，input 内容改变后不会进行本地筛选匹配                                                                                                     | boolean                               | false                             |
| size                     | 大小，可选值 `default`/`small`/`large`                                                                                                                                                                    | string                                | 'default'       |
| style                    | 样式                                                                                                                                                                                                      | object                                |                 |
| suffix                   | 选择框的后缀标签                                                                                                                                                                  | ReactNode                             |                                   |
| showClear                | 是否展示清除按钮                                                                                                                                                                 | boolean                               | false                             |
| showArrow                | 是否展示下拉箭头                                                                                                                                                                | boolean                               | true                              |
| spacing                  | 浮层与选择器的距离                                                                                                                                                             | number                                | 4                                 |
| triggerRender            | 自定义触发器渲染                                                                                                                                                          | function                              |                                   |
| value                    | 当前选中的的值,传入该值时将作为受控组件，配合 `onChange` 使用                                                                                                                                             | string\|number\|array                 |                                   |
| validateStatus           | 校验结果，可选`warning`、`error`、 `default`（只影响样式背景色）                                                                                                                                          | string                                | 'default'                         |
| virtualize               | 列表虚拟化，用于大量节点的情况优化性能表现，由 height, width, itemSize 组成                                                                                                   | object                                |                                   |
| zIndex                   | 弹层的 zIndex                                                                                                                                                                                             | number                                | 1030                              |


### Option Props

---

> **不同 Option 的 label 必须唯一，不允许重复**

| 属性      | 说明                                                               | 类型           | 默认值 |
| --------- | ------------------------------------------------------------------ | -------------- | ------ |
| className | 样式类名                                                           | string         |        |
| disabled  | 是否禁用                                                           | boolean        | false  |
| label     | 展示的文本。渲染时优先取 label，若无则取 children、value，依次降级 | string\|ReactNode        |        |
| showTick  | 被选中时，展示 √ 的 Icon                                           | boolean        | true   |
| style     | 样式                                                               | object         |        |
| value     | 属性值                                                             | string\|number |        |

### OptGroup Props

---

| 属性      | 说明       | 类型      | 版本 |
| --------- | ---------- | --------- | ------ |
| className | 样式类名   | string    |v0.31.0        |
| label     | 展示的文本 | ReactNode |v0.31.0        |
| style     | 样式       | object    | v0.31.0       |

### Method()

绑定在ref上的方法，可以通过ref调用实现某些特殊交互

| 方法  | 说明                       | 版本 |
| ----- | -------------------------- | ---- |
| close | 调用时可以手动关闭下拉列表 |v0.34.0 |
| open  | 调用时可以手动展开下拉列表 |v0.34.0|
| focus | 调用时可以手动聚焦 | v1.11.0 |
| clearInput | 调用时可以手动清空input搜索框的值 | v1.18.0 |
| deselectAll | 调用时可以手动清空所有已选项 | v1.18.0 |
| selectAll | 调用时可以选中所有Option | v1.18.0 |

## Accessibility

### ARIA

- Select trigger 的 role 为 combobox，弹出层的 role 为 listbox，可选项的 role 为 option
- Select trigger 具有 aria-haspopup、aria-expanded、aria-controls 属性，表示 trigger 与弹出层的关系
- 多选时，listbox aria-multiselectable 为 true，表示当前可以多选
- Option 选中时，aria-selected 为 true；当 Option 禁用时，aria-disabled 为 true


## 设计变量
<DesignToken/>

## FAQ

-   **可搜索的 Select，使用远程数据动态更新`optionList`，为什么在异步请求完成之前有时候会出现暂无数据？**  
     请检查是否设置了`remote={true}`，不设置 remote 的情况下，默认会将 input 框输入值与当前的 optionList 进行一次对比筛选，如果无匹配时，就会显示暂无数据。  
     可以通过设置 remote 为 true 关闭对本地当前数据的匹配筛选。

-   **使用jsx方式声明Option，label为i18n后的内容，切换locale后未能重新渲染**
    -   children jsx方式声明Options时，由于是ReactNode，不可能用deepEqual来做对比判断内容是否有更新（性能消耗过大），所以会收集children ReactNode的key，当key不变时，就认为Options都没有发生变化，不会走重新收集数据的流程。你可以将locale也作为Option key的一部分。
    -   使用optionList方式传入，也可以解决问题。因为对于object形式传入，key相对有限，Select内部会使用isEqual来判断是否发生变化

-   **使用jsx方式声明Option，动态切换disabled属性后未能重新渲染**
    -   原因同上，你可以重新给Option设定不同的key值，或者使用optionList方式声明候选项

-   **Select会自动限制下拉菜单的宽度吗？**
    - 会给minWidth，但不会写死width。如果有需要的话，可以自己通过dropdownStyle来添加。      

-   **设置allowCreate后，动态更新optionList或者children不生效**
    - allowCreate主要用于本地创建的场景，开启该项后，相当于强接管了optionList / children，不会再响应外部对这两类值的更新。

-   **为什么Semi的Select要求label必须唯一，而不是value必须唯一?**
    - 首先，我们一定需要一个唯一标识符用来做选中的判断。几乎所有UI库，对Select.Option使用时，最低要求都只会要求传入label、value两个值，而不会再单独要求传入一个key（过于繁琐）。Semi延续了这个设定
    - 那么为什么在semi的select中是label而不是value呢？
      - option的label是用户感知的内容。从交互的角度而言，如果出现两个展示上一模一样的选项，对用户感知而言，他们看上去是一样的，无法进行区分，但选中的作用又不一样（例如一个value为0，另一个为1），是不合理的。(用户第一反应往往是重复了，可能出bug了)
      - label唯一、value重复，在日常使用中会更为常见。例如，一个根据app名称选择公司id的选择器，value是app对应的公司id，label是app的名称。
        ```
          <Select placeholder='choose company by app'>
            <Option label='vigo' value='bytedance' />
            <Option label='abc' value='bytedance' />
          </Select>
        ```

<!-- ## 相关物料

```material
3,4,44,54,58,62,72
``` -->
