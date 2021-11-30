---
localeCode: zh-CN
order: 31
category: 输入类
title: TreeSelect 树选择器
icon: doc-treeselect
brief: 树型选择组件。
---

## 何时使用

类似 Select 的选择控件，可选择的数据结构是一个树形结构时，可以使用 TreeSelect，例如公司层级、学科系统、分类目录等等。


## 代码演示

### 如何引入

```jsx import
import { TreeSelect } from '@douyinfe/semi-ui';
```
### 基本用法

最简单的用法，默认为单选模式，每一级菜单项均可选择。

```jsx live=true
import React from 'react';
import { TreeSelect } from '@douyinfe/semi-ui';
() => {
    const treeData = [
        {
            label: '亚洲',
            value: 'Asia',
            key: '0',
            children: [
                {
                    label: '中国',
                    value: 'China',
                    key: '0-0',
                    children: [
                        {
                            label: '北京',
                            value: 'Beijing',
                            key: '0-0-0',
                        },
                        {
                            label: '上海',
                            value: 'Shanghai',
                            key: '0-0-1',
                        },
                    ],
                },
            ],
        },
        {
            label: '北美洲',
            value: 'North America',
            key: '1',
        }
    ];
    return ( 
        <TreeSelect
            style={{ width: 300 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData}
            placeholder="请选择"
        />
    );
};
```

### 多选

设置 `multiple`，可以进行多选。多选情况下所有子项都被选择时，自动勾选显示其父项。通过设置 `maxTagCount` 属性，可以设置显示的标签数量上限。通过设置 `leafOnly` (>= v0.32.0) 属性，可以设置只展示叶子节点，同时 onChange 的回调入参也会只有叶子节点的值。

```jsx live=true
import React from 'react';
import { TreeSelect } from '@douyinfe/semi-ui';
() => {
    const treeData = [
        {
            label: 'Asia',
            value: 'Asia',
            key: '0',
            children: [
                {
                    label: 'China',
                    value: 'China',
                    key: '0-0',
                    children: [
                        {
                            label: 'Beijing',
                            value: 'Beijing',
                            key: '0-0-0',
                        },
                        {
                            label: 'Shanghai',
                            value: 'Shanghai',
                            key: '0-0-1',
                        },
                        {
                            label: 'Chengdu',
                            value: 'Chengdu',
                            key: '0-0-2',
                        },
                    ],
                },
                {
                    label: 'Japan',
                    value: 'Japan',
                    key: '0-1',
                    children: [
                        {
                            label: 'Osaka',
                            value: 'Osaka',
                            key: '0-1-0'
                        }
                    ]
                },
            ],
        },
        {
            label: 'North America',
            value: 'North America',
            key: '1',
            children: [
                {
                    label: 'United States',
                    value: 'United States',
                    key: '1-0'
                },
                {
                    label: 'Canada',
                    value: 'Canada',
                    key: '1-1'
                }
            ]
        }
    ];
    return ( 
        <div>
            <TreeSelect
                style={{ width: 300 }}
                multiple
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                placeholder="请选择"
            />
            <br/>
            <br/>
            <TreeSelect
                style={{ width: 300 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                multiple
                maxTagCount={2}
                placeholder="当选中标签超过两个将折叠"
            />
            <br/>
            <br/>
            <TreeSelect
                style={{ width: 300 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                multiple
                leafOnly
                placeholder="只渲染叶子节点"
            />
        </div>
    );
};
```

### 可搜索的

通过设置 `filterTreeNode` 属性可支持搜索功能。默认对 `label` 值进行搜索，可通过 `treeNodeFilterProp` 更改。

如果只希望展示过滤后的结果，可以设置 `showFilteredOnly` 。
```jsx live=true
import React from 'react';
import { TreeSelect, Switch } from '@douyinfe/semi-ui';
class Demo extends React.Component {
    constructor() {
        super();
        this.state = {
            showFilteredOnly: false,
        };
        this.onChange = this.onChange.bind(this);
    }
    onChange(showFilteredOnly) {
        this.setState({ showFilteredOnly });
    }
    render() {
        const treeData = [
            {
                label: 'Asia',
                value: 'Asia',
                key: '0',
                children: [
                    {
                        label: 'China',
                        value: 'China',
                        key: '0-0',
                        children: [
                            {
                                label: 'Beijing',
                                value: 'Beijing',
                                key: '0-0-0',
                            },
                            {
                                label: 'Shanghai',
                                value: 'Shanghai',
                                key: '0-0-1',
                            },
                        ],
                    },
                    {
                        label: 'Japan',
                        value: 'Japan',
                        key: '0-1',
                        children: [
                            {
                                label: 'Osaka',
                                value: 'Osaka',
                                key: '0-1-0'
                            }
                        ]
                    },
                ],
            },
            {
                label: 'North America',
                value: 'North America',
                key: '1',
                children: [
                    {
                        label: 'United States',
                        value: 'United States',
                        key: '1-0'
                    },
                    {
                        label: 'Canada',
                        value: 'Canada',
                        key: '1-1'
                    }
                ]
            }
        ];
        const { showFilteredOnly } = this.state;
        return (
            <>
                <span>showFilteredOnly</span>
                <Switch
                    checked={showFilteredOnly}
                    onChange={this.onChange}
                    size="small"
                />
                <br/>
                <br/>
                <TreeSelect
                    style={{ width: 300 }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={treeData}
                    filterTreeNode
                    showFilteredOnly={showFilteredOnly}
                    placeholder="单选可搜索的"
                />
                <br/>
                <br/>
                <TreeSelect
                    style={{ width: 300 }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={treeData}
                    multiple
                    filterTreeNode
                    maxTagCount={2}
                    showFilteredOnly={showFilteredOnly}
                    placeholder="多选可搜索的"
                    searchPlaceholder="请输入关键字开始搜索"
                />
                <br/>
                <br/>
                <TreeSelect
                    style={{ width: 300 }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={treeData}
                    multiple
                    filterTreeNode
                    maxTagCount={2}
                    showFilteredOnly={showFilteredOnly}
                    placeholder="搜索框autofocus"
                    searchPlaceholder="autofocus"
                    searchAutoFocus
                />
            </>
        );
    }
}
```

### 搜索框位置

可以使用 `searchPosition` 来设置搜索框的位置，可选: `dropdown`(默认)、`trigger`。

当输入框位于 trigger 时: 
1. 搜索框占位符由 `placeholder` 控制；
2. `showClear=true` 时，点击输入框的清空按钮，将同时清空 inputValue 和 value。

```jsx live=true
import React from 'react';
import { TreeSelect } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: 'Asia',
            value: 'Asia',
            key: '0',
            children: [
                {
                    label: 'China',
                    value: 'China',
                    key: '0-0',
                    children: [
                        {
                            label: 'Beijing',
                            value: 'Beijing',
                            key: '0-0-0',
                        },
                        {
                            label: 'Shanghai',
                            value: 'Shanghai',
                            key: '0-0-1',
                        },
                    ],
                },
                {
                    label: 'Japan',
                    value: 'Japan',
                    key: '0-1',
                    children: [
                        {
                            label: 'Osaka',
                            value: 'Osaka',
                            key: '0-1-0'
                        }
                    ]
                },
            ],
        },
        {
            label: 'North America',
            value: 'North America',
            key: '1',
            children: [
                {
                    label: 'United States',
                    value: 'United States',
                    key: '1-0'
                },
                {
                    label: 'Canada',
                    value: 'Canada',
                    key: '1-1'
                }
            ]
        }
    ];
    return (
        <>
            <TreeSelect
                searchPosition="trigger"
                style={{ width: 300 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                filterTreeNode
                placeholder="单选"
            />
            <br />
            <br />
            <TreeSelect
                searchPosition="trigger"
                style={{ width: 300 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                multiple
                filterTreeNode
                maxTagCount={2}
                placeholder="多选"
            />
        </>
    );
};
```

### 尺寸大小

可以通过 `size` 设置尺寸大小，可选: 'small'、'default'、'large'

```jsx live=true
import React from 'react';
import { TreeSelect } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: '亚洲',
            value: 'Asia',
            key: '0',
            children: [
                {
                    label: '中国',
                    value: 'China',
                    key: '0-0',
                    children: [
                        {
                            label: '北京',
                            value: 'Beijing',
                            key: '0-0-0',
                        },
                        {
                            label: '上海',
                            value: 'Shanghai',
                            key: '0-0-1',
                        },
                    ],
                },
            ],
        },
        {
            label: '北美洲',
            value: 'North America',
            key: '1',
        }
    ];
    return ( 
        <div>
            <TreeSelect
                style={{ width: 300 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                multiple
                size="small"
                placeholder="small"
            />
            <br />
            <br />
            <TreeSelect
                style={{ width: 300 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                multiple
                size="default"
                placeholder="default"
            />
            <br />
            <br />
            <TreeSelect
                style={{ width: 300 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                multiple
                size="large"
                placeholder="large"
            />
        </div>
    );
};
```

### 默认展开

`defaultExpandAll` 和 `expandAll` 均可以设置 `TreeSelect` 的默认展开/收起状态。二者的区别是，`defaultExpandAll` 只在初始化时生效，而 `expandAll` 不仅会在初始化时生效，当数据(`treeData`)发生动态更新时，`expandAll` 也仍然生效。

其中，`expandAll` 是从 1.30.0 开始支持的。

在下面的 demo 中，`TreeData` 更新后，`defaultExpandAll` 失效，`expandAll` 仍然生效。

```jsx live=true
import React, { useEffect, useState } from 'react';
import { TreeSelect } from '@douyinfe/semi-ui';
() => {
    const treeData = [
        {
            label: '亚洲',
            value: 'Asia',
            key: '0',
            children: [
                {
                    label: '中国',
                    value: 'China',
                    key: '0-0',
                    children: [
                        {
                            label: '北京',
                            value: 'Beijing',
                            key: '0-0-0',
                        },
                        {
                            label: '上海',
                            value: 'Shanghai',
                            key: '0-0-1',
                        },
                    ],
                },
            ],
        },
        {
            label: '北美洲',
            value: 'North America',
            key: '1',
        }
    ];

    const [data, setData] = useState([]);

    useEffect(() => {
        setTimeout(() => setData(treeData), 500);
    }, []);

    return (
        <>
            <TreeSelect
                style={{ width: 300, marginBottom: 20 }}
                expandAll
                treeData={data}
                placeholder="expandAll"
            />
            <TreeSelect
                style={{ width: 300 }}
                defaultExpandAll
                treeData={data}
                placeholder="defaultExpandAll"
            />
        </>
    );
};

```

### 禁用

```jsx live=true
import React from 'react';
import { TreeSelect } from '@douyinfe/semi-ui';
() => {
    const treeData = [
        {
            label: '亚洲',
            value: 'Asia',
            key: '0',
            children: [
                {
                    label: '中国',
                    value: 'China',
                    key: '0-0',
                    children: [
                        {
                            label: '北京',
                            value: 'Beijing',
                            key: '0-0-0',
                        },
                        {
                            label: '上海',
                            value: 'Shanghai',
                            key: '0-0-1',
                        },
                    ],
                },
            ],
        },
        {
            label: '北美洲',
            value: 'North America',
            key: '1',
        }
    ];
    return ( 
        <div>
            <TreeSelect
                style={{ width: 300 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                disabled
                placeholder="禁用下拉菜单"
            />
            <br />
            <br />
            <TreeSelect
                style={{ width: 300 }}
                defaultValue={'Shanghai'}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                disabled
            />
            <br />
            <br />
            <TreeSelect
                style={{ width: 300 }}
                defaultValue={['Shanghai', 'North America']}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                multiple
                disabled
            />
        </div>
    );
};
```

### 严格禁用

version: >= 1.30.0

可以使用 `disableStrictly` 来开启严格禁用。开启严格禁用后，当节点是 disabled 的时候，则不能通过子级或者父级的关系改变选中状态。

以下面的 demo 为例，节点"中国"开启了严格禁用，因此，当我们改变其父节点"亚洲"的选中状态时，也不会影响到节点"中国"的选中状态。

```jsx live=true
import React from 'react';
import { TreeSelect } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: '亚洲',
            value: 'Asia',
            key: '0',
            children: [
                {
                    label: '中国',
                    value: 'China',
                    key: '0-0',
                    disabled: true,
                    children: [
                        {
                            label: '北京',
                            value: 'Beijing',
                            key: '0-0-0',
                        },
                        {
                            label: '上海',
                            value: 'Shanghai',
                            key: '0-0-1',
                        },
                    ],
                },
                {
                    label: '日本',
                    value: 'Japan',
                    key: '0-1',
                },
            ],
        },
        {
            label: '北美洲',
            value: 'North America',
            key: '1',
        }
    ];
    return ( 
        <div>
            <TreeSelect
                style={{ width: 300 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                disableStrictly
                multiple
                defaultValue={['Shanghai']}
            />
        </div>
    );
};

```

### 受控
传入 `value` 时即为受控组件，可以配合 `onChange` 使用。
```jsx live=true hideInDSM
import React from 'react';
import { TreeSelect } from '@douyinfe/semi-ui';
class Demo extends React.Component {
    constructor() {
        super();
        this.state = {
            value: 'Shanghai'
        };
    }
    onChange(value) {
        this.setState({value});
    }
    render() {
        const treeData = [
            {
                label: '亚洲',
                value: 'Asia',
                key: '0',
                children: [
                    {
                        label: '中国',
                        value: 'China',
                        key: '0-0',
                        children: [
                            {
                                label: '北京',
                                value: 'Beijing',
                                key: '0-0-0',
                            },
                            {
                                label: '上海',
                                value: 'Shanghai',
                                key: '0-0-1',
                            },
                        ],
                    },
                ],
            },
            {
                label: '北美洲',
                value: 'North America',
                key: '1',
            }
        ];
        return (
            <TreeSelect
                style={{ width: 300 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                value={this.state.value}
                placeholder="请选择"
                onChange={e => this.onChange(e)}
            />
        );
    }
}
```

### 虚拟化
列表虚拟化，用于大量树节点的情况。开启后，动画效果将被关闭。

`virtualize` 是一个包含下列值的对象： 
- height: 高度值，如果为 string 必须有计算高度才能被渲染出来，即其父节点有 offsetHeight。建议传入数组。
- width: 宽度值，默认 100%
- itemSize: 每行的treeNode的高度，必传

如果带搜索框，建议开启 `showFilteredOnly` 减少多余节点的渲染。

```jsx live=true hideInDSM
import React from 'react';
import { TreeSelect, Button } from '@douyinfe/semi-ui';
class Demo extends React.Component {
    constructor() {
        super();
        this.state = {
            gData: [],
            total: 0,
        };
        this.onGen = this.onGen.bind(this);
    }

    generateData(x = 5, y = 4, z = 3, gData = []) {
        // x：每一级下的节点总数。y：每级节点里有y个节点、存在子节点。z：树的level层级数（0表示一级）
        function _loop(_level, _preKey, _tns) {
            const preKey = _preKey || '0';
            const tns = _tns || gData;

            const children = [];
            for (let i = 0; i < x; i++) {
                const key = `${preKey}-${i}`;
                tns.push({ label: `${key}-标签`, key: `${key}-key`, value: `${key}-value` });
                if (i < y) {
                    children.push(key);
                }
            }
            if (_level < 0) {
                return tns;
            }
            const __level = _level - 1;
            children.forEach((key, index) => {
                tns[index].children = [];
                return _loop(__level, key, tns[index].children);
            });

            return null;
        }
        _loop(z);
        
        function calcTotal(x, y, z) {
            const rec = n => (n >= 0 ? x * y ** n-- + rec(n) : 0);
            return rec(z + 1);
        }
        return {gData, total: calcTotal(x, y, z)};
    }

      
    onGen() {
        const { gData, total } = this.generateData();
        this.setState({
            gData,
            total
        });
    };
  
    render() {
        const style = {
            width: 260,
            height: 360,
            border: '1px solid var(--semi-color-border)'
        };
        return (
            <div style={{ padding: '0 20px' }}>
                <Button onClick={this.onGen}>生成数据: </Button>
                <span>共 {this.state.total} 个节点</span>
                <br/>
                <br/>
                {this.state.gData.length ? (
                    <TreeSelect
                        style={{ width: 300 }}
                        treeData={this.state.gData}
                        filterTreeNode
                        showFilteredOnly
                        placeholder="Please select"
                        dropdownStyle={{ 
                            // height: 300,
                            overflow: 'hidden'
                        }}
                        virtualize={{
                            itemSize: 28,
                            // dropDown height 300 minus search box height minus padding 8 * 2
                            // or if you set dropdown height, it will fill 100% of rest space
                            height: 236                
                        }}
                    />
                ) : null}
            </div>
        );
    }
}
```

### 动态更新数据
```jsx live=true hideInDSM
import React from 'react';
import { TreeSelect, Button } from '@douyinfe/semi-ui';
class Demo extends React.Component {
    constructor() {
        super();
        this.state = {
            treeData: [],
        };
        this.add = this.add.bind(this);
    }
    add() {
        let itemLength = Math.floor(Math.random() * 5) + 1;
        let treeData = new Array(itemLength).fill(0).map((v, i) => {
            let length = Math.floor(Math.random() * 3);
            let children = new Array(length).fill(0).map((cv, ci) => {
                let child = {
                    key: `${i}-${ci}`,
                    label: `Leaf-${i}-${ci}`,
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
                <TreeSelect
                    style={{ width: 300 }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
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
通过设置 `loadData` 可以动态加载数据，此时需要在数据中传入 `isLeaf` 标明叶子节点。

```jsx live=true hideInDSM
import React, { useState } from 'react';
import { TreeSelect } from '@douyinfe/semi-ui';

() => {
    const initialData = [
        {
            label: 'Expand to load',
            value: '0',
            key: '0',
        },
        {
            label: 'Expand to load',
            value: '1',
            key: '1',
        },
        {
            label: 'Leaf Node',
            value: '2',
            key: '2',
            isLeaf: true,
        },
    ];
    const [treeData, setTreeData] = useState(initialData);

    function updateTreeData(list, key, children) {
        return list.map(node => {
            if (node.key === key) {
                return { ...node, children };
            }
            if (node.children) {
                return { ...node, children: updateTreeData(node.children, key, children) };
            }
            return node;
        });
    }

    function onLoadData({ key, children }) {
        return new Promise(resolve => {
            if (children) {
                resolve();
                return;
            }
            setTimeout(() => {
                setTreeData(origin =>
                    updateTreeData(origin, key, [
                        {
                            label: 'Child Node',
                            key: `${key}-0`,
                        },
                        {
                            label: 'Child Node',
                            key: `${key}-1`,
                        },
                    ]),
                );
                resolve();
            }, 1000);
        });
    }
    return (
        <TreeSelect
            loadData={onLoadData}
            treeData={treeData}
            style={{ width: 300 }}
            placeholder="请选择"
        />
    );
};
```

### 自定义 Trigger

如果默认的触发器样式满足不了你的需求，可以用 `triggerRender` 自定义选择框的展示。

triggerRender 入参如下:

```typescript
interface triggerRenderProps {
    componentProps: TreeSelectProps;// 所有用户传给 TreeSelect 的 props
    disabled: boolean;              // 是否禁用 TreeSelect
    value: TreeNode[];              // 已选中的 node 的数据
    inputValue: string;             // 当前 input 框的输入值
    onClear: e => void;             // 用于清空值的函数
    placeholder: string;            // placeholder
}
```


```jsx live=true
import React, { useState, useCallback, useMemo } from 'react';
import { TreeSelect, Button } from '@douyinfe/semi-ui';
import { IconClose, IconChevronDown } from '@douyinfe/semi-icons';

function Demo() {
    const [value, setValue] = useState([]);
    const treeData = useMemo(() => [
        {
            label: '亚洲',
            value: '亚洲',
            key: '0',
            children: [
                {
                    label: '中国',
                    value: '中国',
                    key: '0-0',
                    children: [
                        {
                            label: '北京',
                            value: '北京',
                            key: '0-0-0',
                        },
                        {
                            label: '上海',
                            value: '上海',
                            key: '0-0-1',
                        },
                    ],
                },
            ],
        },
        {
            label: '北美洲',
            value: '北美洲',
            key: '1',
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

    return (
        <TreeSelect
            onChange={onChange}
            style={{ width: 300 }}
            value={value}
            multiple
            treeData={treeData}
            placeholder='Custom Trigger'
            triggerRender={({ placeholder }) => (
                <Button theme={'light'} icon={closeIcon} iconPosition={'right'}>
                    {value && value.length ? value.join('，') : placeholder}
                </Button>
            )}
        />
    );
}
```

### 自定义渲染已选项

你可以通过 renderSelectedItem 自定义选择框中已选项标签的渲染结构。

- 单选时 `renderSelectedItem(treeNode: TreeNode) => content:ReactNode`
- 多选时 `renderSelectedItem(treeNode: TreeNode, { index:number, onClose:function }) => { isRenderInTag:bool, content:ReactNode }`
    - isRenderInTag 为 true 时，会自动将 content 包裹在 Tag 中渲染（带有背景色以及关闭按钮）
    - isRenderInTag 为 false 时，将直接渲染返回的 content

```jsx live=true
import React, { useState, useCallback, useMemo } from 'react';
import { TreeSelect, Tag } from '@douyinfe/semi-ui';

function Demo() {
    const [value, setValue] = useState([]);
    const treeData = useMemo(() => [
        {
            label: '亚洲',
            value: 'Asia',
            key: '0',
            children: [
                {
                    label: '中国',
                    value: 'China',
                    key: '0-0',
                    children: [
                        {
                            label: '北京',
                            value: 'Beijing',
                            key: '0-0-0',
                        },
                        {
                            label: '上海',
                            value: 'Shanghai',
                            key: '0-0-1',
                        },
                    ],
                },
            ],
        },
        {
            label: '北美洲',
            value: 'North America',
            key: '1',
        },
        {
            label: '南美洲',
            value: 'South America',
            key: '2',
        },
        {
            label: '南极洲',
            value: 'Antarctica',
            key: '3',
        },
    ], []);
    
    return (
        <>
            <h4>单选</h4>
            <TreeSelect
                style={{ width: 300 }}
                treeData={treeData}
                renderSelectedItem={item => item.label}
            />
            <h4>多选+ isRenderInTag=true</h4>
            <TreeSelect
                style={{ width: 300 }}
                treeData={treeData}
                multiple
                renderSelectedItem={(item, { index, onClose }) => ({ content: item.label, isRenderInTag: true })}
            />
            <h4>多选 + isRenderInTag=false</h4>
            <TreeSelect
                style={{ width: 300 }}
                treeData={treeData}
                multiple
                maxTagCount={2}
                renderSelectedItem={(item, { index, onClose }) => {
                    return  ({ 
                        content: (
                            <Tag 
                                key={index} 
                                color="white" 
                                closable 
                                onClose={onClose}
                            >
                                {item.value}
                            </Tag>
                        ), 
                        isRenderInTag: false
                    });
                }}
            />
        </>
    );
}
```

## API参考

### TreeSelect

| 属性            | 说明         | 类型           | 默认值          |  版本  |
|-------------   | ----------- | -------------- | -------------- |-------- |
| arrowIcon|自定义右侧下拉箭头Icon，当showClear开关打开且当前有选中值时，hover会优先显示clear icon| ReactNode | | 1.15.0|
| autoAdjustOverflow|浮层被遮挡时是否自动调整方向（暂时仅支持竖直方向，且插入的父级为 body）|boolean | true| 0.34.0|
| autoExpandParent | 是否自动展开父节点 | boolean | false | 0.34.0 |
| className | 选择框的 `className` 属性 | string | - | - |
| clickToHide  | 选择后是否自动关闭下拉弹层，仅单选模式有效  | boolean    | true | 1.5.0      |
| defaultExpandAll | 设置在初始化时是否展开所有节点。而如果后续数据(`treeData`)发生改变，这个 api 是无法影响节点的展开情况的，如果有这个需要可以使用 `expandAll` | boolean | false | 0.32.0 |
| defaultExpandedKeys | 默认展开的节点，显示其直接子级 | string\[] | - | 0.32.0 |
| defaultOpen | 默认展开下拉菜单 | boolean | false | 0.32.0 |
| defaultValue | 指定默认选中的条目 | string \| number \| TreeNode \| (string \| number \| TreeNode)[] | - | - |
| disabled | 是否禁用 | boolean | false | - |
| disableStrictly | 是否严格禁用 | boolean | false | 1.30.0 |
| dropdownClassName | 下拉菜单的 `className` 属性 | string | - | - |
| dropdownMatchSelectWidth | 下拉菜单最小宽度是否等于Select |    boolean        | true | - |
| dropdownStyle | 下拉菜单的样式 | CSSProperties | - | - |
| emptyContent | 当搜索无结果时展示的内容 | ReactNode | `暂无数据` | - |
| expandAction             | 展开逻辑，可选 false, 'click', 'doubleClick'。默认值为 false，即仅当点击展开按钮时才会展开  | boolean \| string   | false | 1.4.0      |
| expandAll | 设置是否默认展开所有节点，若后续数据(`treeData`)发生改变，默认的展开情况也是会受到这个 api 影响的 | boolean | false | 1.30.0 |
| expandedKeys | （受控）展开的节点，默认展开节点显示其直接子级 | string[] | - | 0.32.0 |
| filterTreeNode | 是否根据输入项进行筛选，默认用 `treeNodeFilterProp` 的值作为要筛选的 `TreeNode` 的属性值 | boolean\|(inputValue: string, treeNodeString: string) => boolean | false | - |
| getPopupContainer  | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义需要设置 `position: relative`     | function():HTMLElement | - | - |
| insetLabel | 前缀标签别名，主要用于 Form | ReactNode | - |0.28.0 |
| labelEllipsis | 是否开启label的超出省略，默认虚拟化状态下开启 | boolean | false\|true(virtualized) | 1.8.0 | 
| leafOnly | 多选模式下是否开启 onChange 回调入参及展示标签只有叶子节点 | boolean | false |0.32.0 |
| loadData | 异步加载数据，需要返回一个Promise | (treeNode: TreeNode) => Promise |- |  1.32.0|
| loadedKeys | （受控）已经加载的节点，配合 loadData 使用 | Set< string > | - | 1.32.0|
| maxTagCount | 最多显示多少个 tag | number | - | - |
| motionExpand | 是否开启选项树节点动画 | boolean | true | - |
| multiple | 是否支持多选 | boolean | false | - |
| optionListStyle | optionList的样式 | CSSProperties | - | 1.8.0 |
| outerBottomSlot          | 渲染在弹出层底部，与 optionList 平级的自定义 slot   | ReactNode  |  - | 1.1.0|
| outerTopSlot| 渲染在弹出层顶部，与 optionList 平级的自定义 slot，注意如果开启了 filterTreeNode 会取代搜索框，可以通过 search 方法来自行处理 |  ReactNode  |  - | 1.9.0|
| placeholder | 选择框默认文字 | string | - | - |
| prefix | 前缀标签 | ReactNode | - |0.28.0 |
| renderFullLabel | 完全自定义label的渲染函数，[入参及用法详见](/zh-CN/navigation/tree#高级定制) | (obj) => ReactNode | - | 1.7.0 | 
| renderLabel | 自定义label的渲染函数，[入参及用法详见](/zh-CN/navigation/tree#自定义节点内容)  | (label:ReactNode, data:TreeNode) => ReactNode | - | 1.6.0 | 
| renderSelectedItem | 自定义渲染已选项 | Function | - | 1.26.0 | 
| searchAutoFocus | 搜索框自动聚焦 | boolean | false | 1.27.0 |
| searchPlaceholder | 搜索框默认文字 | string | - | - |
| searchPosition | 设置搜索框的位置，可选: `dropdown`、`trigger` | string | `dropdown` | 1.29.0 |
| showClear | 当值不为空时，trigger 是否展示清除按钮  | boolean | false |  |
| showFilteredOnly | 搜索状态下是否只展示过滤后的结果 | boolean | false | 0.32.0 |
| showSearchClear | 是否显示搜索框的清除按钮 | boolean | true | 0.35.0 |
| size | 选择框大小，可选 `large`，`small`，`default` | string | `default` | - |
| style | 选择框的样式  | CSSProperties | - | - |
| suffix | 后缀标签 | ReactNode | - |0.28.0|
| treeData | `treeNodes` 数据，如果设置则不需要手动构造 `TreeNode` 节点（`key` 值在整个树范围内唯一） | TreeNode[] | \[] | - |
| treeNodeFilterProp | 搜索时输入项过滤对应的 `treeNode` 属性 | string | `label` | - |
| treeNodeLabelProp | 作为显示的 `prop` 设置 | string | `label` | - |
| triggerRender | 自定义触发器渲染方法  | ({ placeholder: string }) => ReactNode | - | 0.34.0 |
| validateStatus | 校验结果，可选 `warning`、`error`、 `default`（只影响样式背景色） | string | - | 0.32.0 |
| value | 当前选中的节点的value值，传入该值时将作为受控组件 | string \| number \| TreeNode \| (string \| number \| TreeNode)[] | - | - |
| virtualize | 列表虚拟化，用于大量树节点的情况，由 height, width, itemSize 组成，参考 Tree - Virtualize Object。开启后将关闭动画效果。 | object | - | 0.32.0 |
| zIndex | treeSelect下拉菜单的zIndex | number | 1030 | 0.30.0 |
| onBlur | 失去焦点时的回调 | function(event) | - | - |
| onChange | 选中树节点时调用此函数，默认返回值为当前所有选中项的value值及节点属性；如果是通过tag关闭，event参数为null | Function | - | - |
| onChangeWithObject | 是否将选中项 option 的其他属性作为回调。设为 true 时，onChange 的入参类型Function(node\|node[], e) 此时如果是受控，也需要把 value 设置成 object，且必须含有 value 的键值；defaultValue同理。 | boolean | false | 1.0.0 |
| onExpand | 展示节点时调用 | function(expandedKeys:array, {expanded: bool, node}) | - | - |
| onFocus | 聚焦时的回调 | function(event) | - | - |
| onLoad | 节点加载完毕时触发的回调 | (loadedKeys: Set< string >, treeNode: TreeNode) => void |- |  1.32.0|
| onSearch | 文本框值变化时回调 | function(sugInput: string) | - | - |
| onSelect | 被选中时调用，返回值为当前事件选项的key值 | function(selectedKey:string, selected: bool, selectedNode: TreeNode) | - | - |
| onVisibleChange     | 弹出层展示/隐藏时触发的回调   | function(isVisible:boolean) |     |   1.4.0  |

### TreeNode

> __不同 `TreeNode` 的 key 值要求必填且唯一。__`label` 允许重复。**v>=1.7.0** 之前 value 值要求必须必填且唯一。
> **v>=1.7.0** 之后 value 值非必填。此时 onChange, value, defaultValue 及 onChangeWithObject 中所取的 value 属性值将改为 key 值。
> 为了保证行为的符合预期，treeData 中的 value 值或者全部不填写，或者全部填写且唯一，不建议混写。

| 属性            | 说明         | 类型           | 默认值          |
|-------------   | ----------- | -------------- | -------------- |
| value | 属性值 | string\|number | - |
| label | 展示的文本 | string\|ReactNode | - |
| icon | 自定义图标 | ReactNode | - |
| disabled | 是否禁用，多选状态下支持 | boolean | false |
| key | required且要求唯一 | string | - |
| isLeaf| 是否为叶子节点 | boolean |-|

## 设计变量
<DesignToken/>

### Method
- search(sugInput: string)
如果需要自定义搜索框可以使用该方法。