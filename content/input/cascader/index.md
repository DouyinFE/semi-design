---
localeCode: zh-CN
order: 17
category: 输入类
title:  Cascader 级联选择
icon: doc-cascader
brief: 用于选择多级分类下的某个选项。
---

## 代码演示


### 如何引入

```jsx import
import { Cascader } from '@douyinfe/semi-ui';
```

### 基本用法

最简单的用法，默认只可以选叶子节点。

```jsx live=true
import React from 'react';
import { Cascader } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: '浙江省',
            value: 'zhejiang',
            children: [
                {
                    label: '杭州市',
                    value: 'hangzhou',
                    children: [
                        {
                            label: '西湖区',
                            value: 'xihu',
                        },
                        {
                            label: '萧山区',
                            value: 'xiaoshan',
                        },
                        {
                            label: '临安区',
                            value: 'linan',
                        },
                    ],
                },
                {
                    label: '宁波市',
                    value: 'ningbo',
                    children: [
                        {
                            label: '海曙区',
                            value: 'haishu',
                        },
                        {
                            label: '江北区',
                            value: 'jiangbei',
                        }
                    ]
                },
            ],
        }
    ];
    return (
        <Cascader
            style={{ width: 300 }}
            treeData={treeData}
            placeholder="请选择所在地区"
        />
    );
};
```

### 多选

version: >= 1.28.0

设置 `multiple`，可以进行多选。

```jsx live=true
import React from 'react';
import { Cascader } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: '浙江省',
            value: 'zhejiang',
            children: [
                {
                    label: '杭州市',
                    value: 'hangzhou',
                    children: [
                        {
                            label: '西湖区',
                            value: 'xihu',
                        },
                        {
                            label: '萧山区',
                            value: 'xiaoshan',
                        },
                        {
                            label: '临安区',
                            value: 'linan',
                        },
                    ],
                },
                {
                    label: '宁波市',
                    value: 'ningbo',
                    children: [
                        {
                            label: '海曙区',
                            value: 'haishu',
                        },
                        {
                            label: '江北区',
                            value: 'jiangbei',
                        }
                    ]
                },
            ],
        }
    ];
    return (
        <Cascader
            defaultValue={['zhejiang', 'ningbo', 'jiangbei']}
            style={{ width: 300 }}
            treeData={treeData}
            placeholder="请选择所在地区"
            multiple
        />
    );
};
```

### 可搜索的

通过设置 `filterTreeNode` 属性可支持搜索功能。默认对 `label` 值进行搜索，可通过 `treeNodeFilterProp` 更改。   
默认搜索结果只会展示叶子结点的路径，想要显示更多的结果，可以设置 `filterLeafOnly` 为 `false`。

```jsx live=true
import React, { useState } from 'react';
import { Cascader, Typography } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: '浙江省',
            value: 'zhejiang',
            children: [
                {
                    label: '杭州市',
                    value: 'hangzhou',
                    children: [
                        {
                            label: '西湖区',
                            value: 'xihu',
                        },
                        {
                            label: '萧山区',
                            value: 'xiaoshan',
                        },
                        {
                            label: '临安区',
                            value: 'linan',
                        },
                    ],
                },
                {
                    label: '宁波市',
                    value: 'ningbo',
                    children: [
                        {
                            label: '海曙区',
                            value: 'haishu',
                        },
                        {
                            label: '江北区',
                            value: 'jiangbei',
                        }
                    ]
                },
            ],
        }
    ];
    return (
        <div>
            <Cascader
                style={{ width: 300 }}
                treeData={treeData}
                placeholder="默认对label值进行搜索"
                filterTreeNode
            />
            <br/>
            <br/>
            <Cascader
                style={{ width: 300 }}
                treeData={treeData}
                placeholder="对value值进行搜索"
                filterTreeNode
                treeNodeFilterProp='value'
            />
            <br/>
            <br/>
            <Typography.Title heading={6}>filterLeafOnly=false:</Typography.Title>
            <Cascader
                style={{ width: 300 }}
                treeData={treeData}
                placeholder="默认对label值进行搜索"
                filterTreeNode
                filterLeafOnly={false}
            />
        </div>
    );
};
```

### 可搜索的多选

version: >= 1.28.0

支持多选和搜索同时使用时，在这种场景下，可以通过按下 BackSpace 键来删除对应的已选项目。

```jsx live=true
import React from 'react';
import { Cascader } from '@douyinfe/semi-ui';

() => {
    const [value, setValue] = useState(['zhejiang','ningbo','haishu']);
    const onChange = (val) => { setValue(val); };
    const treeData = [
        {
            label: '浙江省',
            value: 'zhejiang',
            children: [
                {
                    label: '杭州市',
                    value: 'hangzhou',
                    children: [
                        {
                            label: '西湖区',
                            value: 'xihu',
                        },
                        {
                            label: '萧山区',
                            value: 'xiaoshan',
                        },
                        {
                            label: '临安区',
                            value: 'linan',
                        },
                    ],
                },
                {
                    label: '宁波市',
                    value: 'ningbo',
                    children: [
                        {
                            label: '海曙区',
                            value: 'haishu',
                        },
                        {
                            label: '江北区',
                            value: 'jiangbei',
                        }
                    ]
                },
            ],
        }
    ];
    return (
        <Cascader
            style={{ width: 300 }}
            treeData={treeData}
            placeholder="请选择所在地区"
            value={value}
            multiple
            filterTreeNode
            onChange={e => onChange(e)}
        />
    );
};
```

### 限制标签展示数量

version: >= 1.28.0

在多选的场景中，利用 maxTagCount 可以限制展示的标签数量，超出部分将以 +N 的方式展示。

使用 showRestTagsPopover 可以设置在超出 maxTagCount 后，hover +N 是否显示 Popover，默认为 false。并且，还可以在 restTagsPopoverProps 属性中配置 Popover。

```jsx live=true
import React from 'react';
import { Cascader } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: '浙江省',
            value: 'zhejiang',
            children: [
                {
                    label: '杭州市',
                    value: 'hangzhou',
                    children: [
                        {
                            label: '西湖区',
                            value: 'xihu',
                        },
                        {
                            label: '萧山区',
                            value: 'xiaoshan',
                        },
                        {
                            label: '临安区',
                            value: 'linan',
                        },
                    ],
                },
                {
                    label: '宁波市',
                    value: 'ningbo',
                    children: [
                        {
                            label: '海曙区',
                            value: 'haishu',
                        },
                        {
                            label: '江北区',
                            value: 'jiangbei',
                        }
                    ]
                },
            ],
        }
    ];
    return (
        <Cascader
            style={{ width: 300 }}
            treeData={treeData}
            placeholder="请选择所在地区"
            multiple
            showRestTagsPopover={true}
            restTagsPopoverProps={{ position: 'top' }}
            maxTagCount={1}
            defaultValue={[
                ['zhejiang', 'ningbo', 'haishu'],
                ['zhejiang', 'hangzhou', 'xihu']
            ]}
        />
    );
};
```

### 限制选中数量

version: >= 1.28.0

在多选的场景中，利用 max 可以限制多选选中的数量。超出 max 后将触发 onExceed 回调。

```jsx live=true
import React from 'react';
import { Cascader, Toast } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: '浙江省',
            value: 'zhejiang',
            children: [
                {
                    label: '杭州市',
                    value: 'hangzhou',
                    children: [
                        {
                            label: '西湖区',
                            value: 'xihu',
                        },
                        {
                            label: '萧山区',
                            value: 'xiaoshan',
                        },
                        {
                            label: '临安区',
                            value: 'linan',
                        },
                    ],
                },
                {
                    label: '宁波市',
                    value: 'ningbo',
                    children: [
                        {
                            label: '海曙区',
                            value: 'haishu',
                        },
                        {
                            label: '江北区',
                            value: 'jiangbei',
                        }
                    ]
                },
            ],
        }
    ];
    return (
        <Cascader
            style={{ width: 300 }}
            treeData={treeData}
            placeholder="请选择所在地区"
            multiple
            max={1}
            onExceed={v=>{
                Toast.warning('exceed max');
                console.log(v);
            }}
            defaultValue={['zhejiang', 'ningbo', 'haishu']}
        />
    );
};
```

### 选择即改变

在单选的情况下，还可以通过设置 `changeOnSelect`，允许选中父级选项。

```jsx live=true
import React from 'react';
import { Cascader } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: '浙江省',
            value: 'zhejiang',
            children: [
                {
                    label: '杭州市',
                    value: 'hangzhou',
                    children: [
                        {
                            label: '西湖区',
                            value: 'xihu',
                        },
                        {
                            label: '萧山区',
                            value: 'xiaoshan',
                        },
                        {
                            label: '临安区',
                            value: 'linan',
                        },
                    ],
                },
                {
                    label: '宁波市',
                    value: 'ningbo',
                    children: [
                        {
                            label: '海曙区',
                            value: 'haishu',
                        },
                        {
                            label: '江北区',
                            value: 'jiangbei',
                        }
                    ]
                },
            ],
        }
    ];
    return (
        <div>
            <Cascader
                style={{ width: 300 }}
                treeData={treeData}
                changeOnSelect
                placeholder="选择即改变"
            />
            <br/>
            <br/>
            <Cascader
                style={{ width: 300 }}
                treeData={treeData}
                changeOnSelect
                placeholder="可搜索的选择即改变"
                filterTreeNode
            />
        </div>
    );
};
```

### 自定义显示

可以通过 `displayProp` 设置回填选项显示的属性值，默认为 `label`。

```jsx live=true
import React from 'react';
import { Cascader, Typography } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: '浙江省',
            value: 'zhejiang',
            children: [
                {
                    label: '杭州市',
                    value: 'hangzhou',
                    children: [
                        {
                            label: '西湖区',
                            value: 'xihu',
                        },
                        {
                            label: '萧山区',
                            value: 'xiaoshan',
                        },
                        {
                            label: '临安区',
                            value: 'linan',
                        },
                    ],
                },
                {
                    label: '宁波市',
                    value: 'ningbo',
                    children: [
                        {
                            label: '海曙区',
                            value: 'haishu',
                        },
                        {
                            label: '江北区',
                            value: 'jiangbei',
                        }
                    ]
                },
            ],
        }
    ];
    return (
        <>
            <Typography.Title heading={6}>单选</Typography.Title>
            <Cascader
                style={{ width: 300 }}
                treeData={treeData}
                placeholder="回填时显示数据的value值"
                displayProp='value'
                defaultValue={['zhejiang', 'ningbo', 'jiangbei']}
            />
            <br />
            <br />
            <Typography.Title heading={6}>多选</Typography.Title>
            <Cascader
                multiple
                style={{ width: 300 }}
                treeData={treeData}
                defaultValue={['zhejiang', 'ningbo', 'jiangbei']}
                placeholder="回填时显示数据的value值"
                displayProp='value'
            />
        </>
    );
};
```

可以通过设置 `displayRender` 可以设定返回格式。

单选 (`multiple=false`) 时, `displayRender((labelPath: string[]) => ReactNode)`, 其中 labelPath 是由 label 构成的 path 数组。

多选 (`multiple=true`) 时, `displayRender((item: Entity, index: number) => ReactNode)`, 其中 item 为节点的相关数据。

```typescript
interface Entity {
    children?: Entity[];         // children list
    data: treeNode;              // treedata
    ind: number;                 // index
    key: string;                 // key
    level: number;               // node level
    parent?: Entity;             // parent data
    parentKey?: string;          // parent key
    path: string[];              // key path
    valuePath: string[];         // value path
}
```

```jsx live=true
import React from 'react';
import { Cascader, Tag, Typography } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: '浙江省',
            value: 'zhejiang',
            children: [
                {
                    label: '杭州市',
                    value: 'hangzhou',
                    children: [
                        {
                            label: '西湖区',
                            value: 'xihu',
                        },
                        {
                            label: '萧山区',
                            value: 'xiaoshan',
                        },
                        {
                            label: '临安区',
                            value: 'linan',
                        },
                    ],
                },
                {
                    label: '宁波市',
                    value: 'ningbo',
                    children: [
                        {
                            label: '海曙区',
                            value: 'haishu',
                        },
                        {
                            label: '江北区',
                            value: 'jiangbei',
                        }
                    ]
                },
            ],
        }
    ];
    return (
        <>
            <Typography.Title heading={6}>单选</Typography.Title>
            <Cascader
                style={{ width: 300 }}
                treeData={treeData}
                placeholder="自定义回填时显示数据的格式"
                displayRender={list => '已选择：' + list.join(' -> ')}
                defaultValue={['zhejiang', 'ningbo', 'jiangbei']}
            />
            <br />
            <br />
            <Typography.Title heading={6}>多选</Typography.Title>
            <Cascader
                multiple
                style={{ width: 300 }}
                treeData={treeData}
                defaultValue={['zhejiang', 'ningbo', 'jiangbei']}
                placeholder="自定义回填时显示数据的格式"
                displayRender={(item, idx) => (
                    <Tag
                        style={{marginRight: 4}}
                        color='white'
                        key={`${idx}-${item.data.label}`}
                    >
                        {item.data.label}
                    </Tag>
                )}
            />
        </>
    );
};
```

### 禁用

```jsx live=true
import React from 'react';
import { Cascader } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: '浙江省',
            value: 'zhejiang',
            children: [
                {
                    label: '杭州市',
                    value: 'hangzhou',
                    children: [
                        {
                            label: '西湖区',
                            value: 'xihu',
                        },
                        {
                            label: '萧山区',
                            value: 'xiaoshan',
                        },
                        {
                            label: '临安区',
                            value: 'linan',
                        },
                    ],
                }
            ],
        }
    ];
    return (
        <div>
            <Cascader
                style={{ width: 300 }}
                treeData={treeData}
                placeholder="请选择所在地区"
                disabled
            />
            <br />
            <br />
            <Cascader
                style={{ width: 300 }}
                treeData={treeData}
                placeholder="请选择所在地区"
                defaultValue={['zhejiang', 'hangzhou', 'xihu']}
                filterTreeNode
                disabled
            />
        </div>
    );
};
```

### 严格禁用

version: >= 1.32.0

可以使用 disableStrictly 来开启严格禁用。开启严格禁用后，当节点是 disabled 的时候，则不能通过子级或者父级的关系改变选中状态。

以下面的 demo 为例，节点"宁波"开启了严格禁用，因此，当我们改变其父节点"浙江省"的选中状态时，也不会影响到节点"宁波"的选中状态。

```jsx live=true
import React from 'react';
import { Cascader } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: '浙江省',
            value: 'zhejiang',
            children: [
                {
                    label: '杭州市',
                    value: 'hangzhou',
                    children: [
                        {
                            label: '西湖区',
                            value: 'xihu',
                        },
                        {
                            label: '萧山区',
                            value: 'xiaoshan',
                        },
                        {
                            label: '临安区',
                            value: 'linan',
                        },
                    ],
                },
                {
                    label: '宁波市',
                    value: 'ningbo',
                    disabled: true,
                    children: [
                        {
                            label: '海曙区',
                            value: 'haishu',
                        },
                        {
                            label: '江北区',
                            value: 'jiangbei',
                        }
                    ]
                },
            ],
        }
    ];
    return (
        <Cascader
            style={{ width: 300 }}
            treeData={treeData}
            multiple
            placeholder="请选择所在地区"
            disableStrictly
        />
    );
};
```

### 展示子菜单的时机

version: >= 1.29.0

可以使用 `showNext` 设置展开 Dropdown 子菜单的触发时机，可选: `click`（默认）、`hover`。

```jsx live=true
import React from 'react';
import { Cascader } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: '浙江省',
            value: 'zhejiang',
            children: [
                {
                    label: '杭州市',
                    value: 'hangzhou',
                    children: [
                        {
                            label: '西湖区',
                            value: 'xihu',
                        },
                        {
                            label: '萧山区',
                            value: 'xiaoshan',
                        },
                        {
                            label: '临安区',
                            value: 'linan',
                        },
                    ],
                }
            ],
        }
    ];
    return (
        <Cascader
            style={{ width: 300 }}
            treeData={treeData}
            placeholder="请选择所在地区"
            showNext="hover"
        />
    );
};
```

### 在顶部/底部渲染附加项

我们在级联选择器的顶部、底部分别预留了插槽，你可以通过 `topSlot` 或 `bottomSlot` 来设置。

```jsx live=true
import React from 'react';
import { Cascader, Typography } from '@douyinfe/semi-ui';

() => {
    const { Text } = Typography;
    const slotStyle = {
        height: '36px',
        display: 'flex',
        padding: '0 32px',
        alignItems: 'center',
        cursor: 'pointer',
        borderTop: '1px solid var(--semi-color-border)'
    };
    const treeData = [
        {
            label: '浙江省',
            value: 'zhejiang',
            children: [
                {
                    label: '杭州市',
                    value: 'hangzhou',
                    children: [
                        {
                            label: '西湖区',
                            value: 'xihu',
                        },
                        {
                            label: '萧山区',
                            value: 'xiaoshan',
                        },
                        {
                            label: '临安区',
                            value: 'linan',
                        },
                    ],
                },
                {
                    label: '宁波市',
                    value: 'ningbo',
                    children: [
                        {
                            label: '海曙区',
                            value: 'haishu',
                        },
                        {
                            label: '江北区',
                            value: 'jiangbei',
                        }
                    ]
                },
            ],
        }
    ];
    return (
        <Cascader
            style={{ width: 300 }}
            treeData={treeData}
            placeholder="请选择所在地区"
            bottomSlot={
                <div style={slotStyle}>
                    <Text>找不大相关选项？</Text>
                    <Text link>去新建</Text>
                </div>
            }
        />
    );
};
```

### 受控

传入 `value` 时即为受控组件，可以配合 `onChange` 使用。

```jsx live=true hideInDSM
import React from 'react';
import { Cascader } from '@douyinfe/semi-ui';

class Demo extends React.Component {
    constructor() {
        super();
        this.state = {
            value: []
        };
    }
    onChange(value) {
        this.setState({value});
    }
    render() {
        const treeData = [
            {
                label: '浙江省',
                value: 'zhejiang',
                children: [
                    {
                        label: '杭州市',
                        value: 'hangzhou',
                        children: [
                            {
                                label: '西湖区',
                                value: 'xihu',
                            },
                            {
                                label: '萧山区',
                                value: 'xiaoshan',
                            },
                            {
                                label: '临安区',
                                value: 'linan',
                            },
                        ],
                    },
                    {
                        label: '宁波市',
                        value: 'ningbo',
                        children: [
                            {
                                label: '海曙区',
                                value: 'haishu',
                            },
                            {
                                label: '江北区',
                                value: 'jiangbei',
                            }
                        ]
                    },
                ],
            }
        ];
        return (
            <Cascader
                style={{ width: 300 }}
                treeData={treeData}
                placeholder="请选择所在地区"
                value={this.state.value}
                onChange={e => this.onChange(e)}
            />
        );
    }
}
```

### 自动合并 value
版本: >=1.28.0

在多选（multiple=true）场景中，当我们选中祖先节点时，如果希望 value 不包含它对应的子孙节点，则可以通过 `autoMergeValue` 来设置，默认为 true。

```jsx live=true
import React from 'react';
import { Cascader } from '@douyinfe/semi-ui';

class Demo extends React.Component {
    constructor() {
        super();
        this.state = {
            value: ['zhejiang','ningbo']
        };
    }
    onChange(value) {
        console.log(value);
        this.setState({value});
    }
    render() {
        const treeData = [
            {
                label: '浙江省',
                value: 'zhejiang',
                children: [
                    {
                        label: '杭州市',
                        value: 'hangzhou',
                        children: [
                            {
                                label: '西湖区',
                                value: 'xihu',
                            },
                            {
                                label: '萧山区',
                                value: 'xiaoshan',
                            },
                            {
                                label: '临安区',
                                value: 'linan',
                            },
                        ],
                    },
                    {
                        label: '宁波市',
                        value: 'ningbo',
                        children: [
                            {
                                label: '海曙区',
                                value: 'haishu',
                            },
                            {
                                label: '江北区',
                                value: 'jiangbei',
                            }
                        ]
                    },
                ],
            }
        ];
        return (
            <Cascader
                style={{ width: 300 }}
                treeData={treeData}
                placeholder="请选择所在地区"
                value={this.state.value}
                multiple
                autoMergeValue={false}
                onChange={e => this.onChange(e)}
            />
        );
    }
}
```

### 动态更新数据

```jsx live=true hideInDSM
import React from 'react';
import { Cascader, Button } from '@douyinfe/semi-ui';

class Demo extends React.Component {
    constructor() {
        super();
        this.state = {
            treeData: [],
        };
        this.add = this.add.bind(this);
    }
    add() {
        let itemLength = Math.floor(Math.random() * 3) + 1;
        let treeData = new Array(itemLength).fill(0).map((v, i) => {
            let length = Math.floor(Math.random() * 3);
            let children = new Array(length).fill(0).map((cv, ci) => {
                let child = {
                    key: `${i}-${ci}`,
                    label: `Item-${i}-${ci}`,
                    value: `${i}-${ci}`
                };
                return child;
            });
            let item = {
                key: `${i}`,
                label: `Item-${i}`,
                value: `${i}`,
                children
            };
            return item;
        });
        this.setState({ treeData });
    }
    render() {
        return (
            <>
                <Cascader
                    style={{ width: 300 }}
                    treeData={this.state.treeData}
                    placeholder="请选择"
                />
                <br/>
                <br/>
                <Button onClick={this.add}>
                    动态改变数据
                </Button>
            </>
        );
    }
}
```

### 异步加载数据
可以使用 loadData 实现异步加载数据
**v>=1.8.0**  
**不能与搜索同时使用**

```jsx live=true hideInDSM
import React from 'react';
import { Cascader } from '@douyinfe/semi-ui';

() => {
    const initialData = [
        {
            label: 'Node1',
            value: '0-0',
        },
        {
            label: 'Node2',
            value: '0-1',
        },
        {
            label: 'Node3',
            value: '0-2',
            isLeaf: true
        },
    ];
    const [data, setData] = useState(initialData);
    
    const updateTreeData = (list, value, children) => {
        return list.map(node => {
            if (node.value === value) {
                return { ...node, children };
            }
            if (node.children) {
                return { ...node, children: updateTreeData(node.children, value, children) };
            }
            return node;
        });
    };

    const onLoadData = selectedOpt => {
        const targetOpt = selectedOpt[selectedOpt.length - 1];
        const { label, value } = targetOpt;
        return new Promise(resolve => {
            if (targetOpt.children) {
                resolve();
                return;
            }

            setTimeout(() => {
                setData(origin =>
                    updateTreeData(origin, value, [
                        {
                            label: `${label} - 1`,
                            value: `${label}-1`,
                            isLeaf: selectedOpt.length > 1
                        },
                        {
                            label: `${label} - 2`,
                            value: `${label}-2`,
                            isLeaf: selectedOpt.length > 1
                        },
                    ]),
                );
                resolve();
            }, 1000);
        });
    };

    return (
        <Cascader
            style={{ width: 300 }}
            treeData={data}
            loadData={onLoadData}
            placeholder="Please select"
        />
    );
};
```


### 超长列表

当你的数据结构层级特别深时，Cascader下拉菜单可能会超出屏幕，此时我们建议为下拉菜单设置 overflow-x: auto 以及一个合适的 width 宽度（ 建议以N+0.5列的宽度为准，最右侧显示半列，以给用户一种右侧尚有待展开项，可以水平方向滚动的视觉暗示）

```jsx live=true
import React from 'react';
import { Cascader } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: 'A',
            value: 'A',
            children: [
                {
                    label: 'B',
                    value: 'B',
                    children: [
                        {
                            label: 'C',
                            value: 'C',
                            children: [
                                {
                                    label: 'D',
                                    value: 'D',
                                    children: [
                                        {
                                            label: 'E',
                                            value: 'E',
                                            children: [
                                                {
                                                    label: 'F',
                                                    value: 'F',
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                }
            ]
        }
    ];
    return (
        <Cascader
            dropdownClassName='components-cascader-demo'
            style={{ width: 300 }}
            treeData={treeData}
            placeholder="请选择所在地区"
        />
    );
};
```

```css
.components-cascader-demo {
    .semi-cascader-option-lists {
        max-width: 510px;
        overflow-x: auto;
    }
}
```

### 自定义 Trigger

如果默认的触发器样式满足不了你的需求，可以用`triggerRender`自定义选择框的展示

triggerRender 入参如下

```typescript
interface TriggerRenderProps {
    /* Cascader 的 props */
    componentProps: CascaderProps;
    /* 是否禁用 Cascader */
    disabled: boolean;
    /**
     * 单选时，已选中的 node 在 treeData 中的层级位置，如下例子，
     * 当选中 浙江省-杭州市-萧山区时，此处 value 为 '0-0-0'
     */
    value?: string;
    /* 当前 Input 框的输入值 */
    inputValue: string;
    /**
     * 用于更新 input 框值的函数，当你在 triggerRender 自定义的
     * Input 组件值更新时，你应该调用该函数，用于向 Cascader 内部
     * 同步状态
     */
    onChange: (inputValue: string) => void;
    /* 用于清空值的函数 */
    onClear: () => void;
    /* Placeholder */
    placeholder?: string;
}
```

```jsx live=true
import React, { useState, useCallback, useMemo } from 'react';
import { Cascader, Button } from '@douyinfe/semi-ui';
import { IconClose, IconChevronDown } from '@douyinfe/semi-icons';

function Demo() {
    const [value, setValue] = useState([]);
    const treeData = useMemo(() => [
        {
            label: '浙江省',
            value: 'zhejiang',
            children: [
                {
                    label: '杭州市',
                    value: 'hangzhou',
                    children: [
                        {
                            label: '西湖区',
                            value: 'xihu',
                        },
                        {
                            label: '萧山区',
                            value: 'xiaoshan',
                        },
                        {
                            label: '临安区',
                            value: 'linan',
                        },
                    ],
                },
                {
                    label: '宁波市',
                    value: 'ningbo',
                    children: [
                        {
                            label: '海曙区',
                            value: 'haishu',
                        },
                        {
                            label: '江北区',
                            value: 'jiangbei',
                        }
                    ]
                },
            ],
        }
    ], []);
    const onChange = useCallback((val) => {
        setValue(val);
    }, []);
    const onClear = useCallback(e => {
        e && e.stopPropagation();
        setValue([]);
    }, []);

    const closeIcon = useMemo(() => {
        return value && value.length ? <IconClose onClick={onClear} /> : <IconChevronDown />;
    }, [value]);

    const triggerRender = ({ value: innerStateValue, placeholder, ...rest }) => {
        console.log(value);
        console.log(rest);
        return (
            <Button theme={'light'} icon={closeIcon} iconPosition={'right'}>
                {value && value.length ? value.join('/') : placeholder}
            </Button>
        );
    };

    return (
        <Cascader
            onChange={onChange}
            value={value}
            treeData={treeData}
            placeholder='Custom Trigger'
            triggerRender={triggerRender}
        />
    );
}
```

## API 参考

### Cascader

| 属性               | 说明                                                                                 | 类型                                                                             | 默认值                           | 版本   |
| ------------------ | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- | -------------------------------- | ------ |
| arrowIcon     |   自定义右侧下拉箭头 Icon，当 showClear 开关打开且当前有选中值时，hover 会优先显示 clear icon                                                              | ReactNode                                                                          |                             | 1.15.0      |
| autoAdjustOverflow | 是否自动调整下拉框展开方向，用于边缘遮挡时自动调整展开方向 | boolean | true | - |
| autoMergeValue | 设置自动合并 value。具体而言是，开启后，当某个父节点被选中时，value 将不包括该节点的子孙节点 | boolean | true |  1.28.0 |
| bottomSlot | 底部插槽 | ReactNode | - |  1.27.0 |
| changeOnSelect     | 是否允许选择非叶子节点                                                                   | boolean                                                                          | false                            | -      |
| className          | 选择框的 className 属性                                                              | string                                                                           | -                                | -      |
| defaultOpen       | 设置是否默认打开下拉菜单              | boolean   | false                                | -      |
| defaultValue       | 指定默认选中的条目                                                                   | string\|number\|TreeNode\|(string\|number\|TreeNode)[]                                                                           | -                                | -      |
| disabled           | 是否禁用                                                                             | boolean                                                                          | false                            | -      |
| displayProp        | 设置回填选项显示的属性值                                                                 | string                                                                           | `label`                          | -      |
| displayRender      | 设置回填格式                                                                 | (selected: string[] \| Entity, idx?: number) => ReactNode                                                        | selected => selected.join(' / ') | -      |
| dropdownClassName  | 下拉菜单的 className 属性                                                            | string                                                                           | -                                | -      |
| dropdownStyle      | 下拉菜单的样式                                                                       | object                                                                           | -                                | -      |
| emptyContent       | 当搜索无结果时展示的内容                                                             | ReactNode                                                                        | `暂无数据`                       | -      |
| filterLeafOnly       |  搜索结果是否只展示叶子结点路径   | boolean    | true    | 1.26.0    |
| filterTreeNode     | 设置筛选，默认用 treeNodeFilterProp 的值作为要筛选的 TreeNode 的属性值 | ((inputValue: string, treeNodeString: string) => boolean) \| boolean | false                            | -      |
| getPopupContainer | 指定父级 DOM，下拉框将会渲染至该 DOM 中，自定义需要设置 position: relative |() => HTMLElement|() => document.body|-|
| insetLabel         | 前缀标签别名，主要用于 Form                                                          | ReactNode                                                                        | -                                | 0.28.0 |
| loadData | 异步加载数据，需要返回一个Promise | (selectOptions: TreeNode[]) => Promise< void > |- |  1.8.0|
| max| 多选时，限制多选选中的数量，超出 max 后将触发 onExceed 回调 | number |-|1.28.0|
| maxTagCount| 多选时，标签的最大展示数量，超出后将以 +N 形式展示| number |-|1.28.0|
| motion | 设置下拉框弹出的动画 |boolean\|object|true|-|
| mouseEnterDelay | 鼠标移入后，延迟显示下拉框的时间，单位毫秒 | number | 50 | - |
| mouseLeaveDelay | 鼠标移出后，延迟消失下拉框的时间，单位毫秒 | number | 50 | - |
| multiple | 设置多选 | boolean | false |  1.28.0 |
| placeholder        | 选择框默认文字                                                                       | string                                                                           | -                                | -      |
| prefix             | 前缀标签                                                                             | ReactNode                                                                        | -                                | 0.28.0 |
|restTagsPopoverProps |Popover 的配置属性，可以控制 position、zIndex、trigger 等，具体参考[Popover](/zh-CN/show/popover#API%20%E5%8F%82%E8%80%83)           |PopoverProps     | {}        |1.28.0|
| searchPlaceholder  | 搜索框默认文字                                                                       | string                                                                           | -                                | -      |
| showClear       |  是否展示清除按钮   | boolean    | false    | 0.35.0    |
| showNext| 设置展开 Dropdown 子菜单的方式，可选: `click`、`hover` | string |`click`|1.29.0|
| showRestTagsPopover| 当超过 maxTagCount，hover 到 +N 时，是否通过 Popover 显示剩余内容| boolean |false|1.28.0|
| size               | 选择框大小，可选 `large`，`small`，`default`                                         | string                                                                           | `default`                        | -      |
| stopPropagation | 是否阻止下拉框上的点击事件冒泡 | boolean | true | - |
| disableStrictly | 设置是否开启严格禁用。开启后，当节点是 disabled 的时候，则不能通过子级或者父级的关系改变选中状态 | boolean | false | 1.32.0|
| style              | 选择框的样式                                                                         | CSSProperties                                                                           | -                                | -      |
| suffix             | 后缀标签                                                                             | ReactNode                                                                        | -                                | 0.28.0 |
| topSlot | 顶部插槽 | ReactNode | - |  1.27.0 |
| treeData           | 展示数据，具体属性参考 [TreeNode](#TreeNode)              | TreeNode[]                                                                  | \[]                              | -      |
| treeNodeFilterProp | 搜索时输入项过滤对应的 treeNode 属性                                                 | string                                                                           | `label`                          | -      |
| triggerRender | 自定义触发器渲染方法  | (triggerRenderData: object) => ReactNode | - | 0.34.0 |
| validateStatus | trigger 的校验状态，仅影响展示样式。可选: default、error、warning | string | `default` | - |
| value       | （受控）选中的条目                                                                   | string\|number\|TreeNode\|(string\|number\|TreeNode)[]                                                                           | -                                | -      |
| zIndex | 下拉菜单的 zIndex | number | 1030 | - |
| onBlur | 失焦 Cascader 的回调 | (e: MouseEvent) => void | - | - |
| onChange           | 选中树节点时调用此函数，默认返回选中项 path 的 value 数组                            | (value: string\|number\|TreeNode\|(string\|number\|TreeNode)[]) => void                                                                         | -                                | -      |
| onChangeWithObject | 是否将选中项 option 的其他属性作为回调。设为 true 时，onChange 的入参类型会从 string/number 变为 TreeNode。此时如果是受控，也需要把 value 设置成 TreeNode 类型，且必须含有 value 的键值，defaultValue 同理 | boolean | false | 1.16.0 |
| onClear| showClear 为 true 时，点击清空按钮触发的回调 | () => void |-|1.29.0|
| onDropdownVisibleChange       | 下拉框切换时的回调   | (visible: boolean) => void        | -                                | 0.35.0    |
| onExceed| 多选时，超出 max 后触发的回调 | (checkedItem: Entity[]) => void |-|1.28.0|
| onFocus| 聚焦 Cascader 的回调 | (e: MouseEvent) => void | - | - |
| onListScroll | 下拉面板滚动的回调 | (e: React.Event, panel: { panelIndex: number; activeNode: TreeNode; } ) => void | - | 1.15.0 |
| onLoad | 节点加载完毕时触发的回调 | (newLoadedKeys: Set< string >, data: TreeNode) => void |- |  1.8.0|
| onSearch           | 文本框值变化时回调                                                                   | (value: string) => void                                                                         | -                                | -      |
| onSelect           | 被选中时调用，返回选中项的 value                                                     | (value: string \| number \| (string \| number)[]) => void                                                                         | -                                | -      |

### TreeNode

| 属性      | 说明                  | 类型            | 默认值 |
| -------- | --------------------- | -------------- | ----- |
| children | 子节点                 | TreeNode[]     | -     |
| disabled | 不可选状态 **>=0.35.0** | boolean        | -     |
| isLeaf   | 叶子节点                | boolean        | -     |
| label    | 展示的文本（必填）       | ReactNode       | -     |
| loading  | 正在加载                | boolean        | -     |
| value    | 属性值（必填）           | string\|number | -     |

## 设计变量
<DesignToken/>