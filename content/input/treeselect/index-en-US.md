---
localeCode: en-US
order: 31
category: Input
title:  TreeSelect
subTitle: TreeSelect
icon: doc-treeselect
brief: A tree view component for selection.
---


## When to Use

When the options to select is in tree structure, you could use TreeSelect, e.g. department hierarchy, subject system, category directory and etc.

## Demos

### How to import

```jsx import
import { TreeSelect } from '@douyinfe/semi-ui';
```

### Basic Usage

By default, TreeSelect is in single select mode and each item is selectable.

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
        ],
    },
    {
        label: 'North America',
        value: 'North America',
        key: '1',
    }
  ]
  return (
    <TreeSelect
      style={{ width: 300 }}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      treeData={treeData}
      placeholder="Please select"
    />
  )
}
```

### Multi-choice

You could use `multiple` to set mode to multi-choice. When all child items are selected, the parent item will be selected. Use `maxTagCount` to set the cap number of tags displayed. Use `leafOnly` (>= v0.32.0) if you prefer to render leaf nodes only and the corresponding params for onChange will also be leaf nodes values.

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
        placeholder="Please select"
      />
      <br/>
      <br/>
      <TreeSelect
        style={{ width: 300 }}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={treeData}
        multiple
        maxTagCount={2}
        placeholder="Display at most two tags"
      />
      <br/>
      <br/>
      <TreeSelect
        style={{ width: 300 }}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={treeData}
        multiple
        leafOnly
        placeholder="Display leaf nodes only"
      />
    </div>
  )
}
```

### Searchable

Use `filterTreeNode` to support search input. By default it searches the `label` property of the data. You can use `treeNodeFilterProp` to set another property to search or pass in a function to `filterTreeNode` to customize search behavior.

You could also use `showFilteredOnly` if you prefer to display filtered results only.

```jsx live=true
import React from 'react';
import { TreeSelect, Switch } from '@douyinfe/semi-ui';

class Demo extends React.Component {
    constructor() {
        super()
        this.state = {
            showFilteredOnly: false,
        }
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
            placeholder="Single Searchable TreeSelect"
            searchPlaceholder="Start searching"
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
            placeholder="Multiple Searchable TreeSelect"
            searchPlaceholder="Start searching"
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
            placeholder="search input autofocus"
            searchPlaceholder="autofocus"
            searchAutoFocus
        />
        </>
    )
    }
}
```


### Search Box Position

You can use `searchPosition` to set the position of the search box, optional: `dropdown` (default), `trigger`.

When the input box is at trigger:
1. The placeholder of the search box is controlled by `placeholder`;
2. When `showClear=true`, click the clear button of the input box, the inputValue and value will be cleared at the same time.

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
                placeholder="Single selection"
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
                placeholder="Multiple selection"
            />
        </>
    );
}
```

### Size

You can set the size by `size`, one of: 'small'、'default'、'large'

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
  )
}
```

### Disabled

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
        ],
    },
    {
        label: 'North America',
        value: 'North America',
        key: '1',
    }
  ]
  return (
    <div>
        <TreeSelect
            style={{ width: 300 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData}
            disabled
            placeholder="Disabled TreeSelect"
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
  )
}
```


### Disable Strictly

version: >= 1.30.0

You can use `disableStrictly` to enable strict disabling. After enabling strict disabling, when the node is disabled, the selected state cannot be changed through the relationship between the child or the parent.

Take the following demo as an example, the node "China" is strictly disabled. Therefore, when we change the selected state of its parent node "Asia", it will not affect the selected state of the node "China".

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
                disable: true,
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
            },
        ],
    },
    {
        label: 'North America',
        value: 'North America',
        key: '1',
    }
  ]
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
  )
}
```

### Default Expand All

Both `defaultExpandAll` and `expandAll` can set the default expanded/collapsed state of `TreeSelect`. The difference between the two is that `defaultExpandAll` only takes effect during initialization, while `expandAll` will take effect not only during initialization, but also when the data (`treeData`) is dynamically updated.

Among them, `expandAll` is supported starting from 1.30.0.

In the demo below, after `TreeData` is updated, `defaultExpandAll` becomes invalid, and `expandAll` still takes effect.

```jsx live=true
import React, { useState, useEffect } from 'react';
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
            ],
        },
        {
            label: 'North America',
            value: 'North America',
            key: '1',
        }
    ];

    const [data, setData] = useState([]);

    useEffect(() => {
        setTimeout(() => setData(treeData), 500)
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
    )
}
```

### Controlled Component

You can use `value` along with `onChange` property if you want to use TreeSelect as a controlled component.

```jsx live=true
import React from 'react';
import { TreeSelect } from '@douyinfe/semi-ui';

class Demo extends React.Component {
    constructor() {
        super()
        this.state = {
            value: 'Shanghai'
        };
    }
    onChange(value) {
        this.setState({value})
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
                ],
            },
            {
                label: 'North America',
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
                placeholder="Please select"
                onChange={e => this.onChange(e)}
            />
        )
    }
}
```

### Virtualized TreeSelect
If you need to render large sets of tree structured data, you could use virtualized tree. In virtualized mode, animation / motion is disabled for better performance. 

The property `virtualize` is an object consisting of the following values: 
- height: Height of the dropDown, If passed in as a string, computed height should not be zero for render purpose, in other words, parent node should have offsetHeight. Pass in a number recommended.
- width: Width of the dropDown.
- itemSize: Height for each line of treeNode, required

If tree is searchable, you could also set `showFilteredOnly={true}` to reduce time of rendering for results.

```jsx live=true
import React from 'react';
import { TreeSelect, Button } from '@douyinfe/semi-ui';

class Demo extends React.Component {
    constructor() {
        super();
        this.state = {
            gData: [],
            total: 0,
        }
        this.onGen = this.onGen.bind(this);
    }

    generateData(x = 5, y = 4, z = 3, gData = []) {
        // x：number of nodes
        // y：number of nodes with children in each level
        // z：number of level
        function _loop(_level, _preKey, _tns) {
            const preKey = _preKey || '0';
            const tns = _tns || gData;

            const children = [];
            for (let i = 0; i < x; i++) {
                const key = `${preKey}-${i}`;
                tns.push({ label: `${key}-label`, key: `${key}-key`, value: `${key}-value` });
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
      return (
        <div style={{ padding: '0 20px' }}>
          <Button onClick={this.onGen}>Generate Data: </Button>
          <span>In total: {this.state.total}</span>
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
                      overflow: 'hidden'
                    }}
                  virtualize={{
                    itemSize: 28,
                    // dropDown height 300 minus search box height minus padding 8 * 2
                    // or if you set dropDown height, it will automatically fill rest space
                    height: 236                
                  }}
            />
          ) : null}
        </div>
      );
    }
}
```

### Dynamic Update of Data

```jsx live=true
import React from 'react';
import { TreeSelect, Button } from '@douyinfe/semi-ui';

class Demo extends React.Component {
    constructor() {
        super()
        this.state = {
            treeData: [],
        }
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
                }
                return child;
            });
            let item = {
                key: `${i}`,
                label: `Item-${i}`,
                value: `${i}`,
                children
            };
            return item;
        })
        this.setState({ treeData });
    }
    render() {
        return (
            <>
                <TreeSelect
                    style={{ width: 300 }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={this.state.treeData}
                    placeholder="Please select"
                />
                <br/>
                <br/>
                <Button onClick={this.add}>
                    Update Data
                </Button>
            </>
        )
    }
}
```

### Load Data Asynchronously
You could use `loadData` to load treeData asynchronously on node expansion. Notice `isLeaf` is required to mark node as leaf in treeData.

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
            placeholder="Please select"
        />
    );
};
```

### Custom Trigger

If the default trigger style cannot meet your needs, you can use `triggerRender` to customize the display of the select box.

The triggerRender input is as follows:

```typescript
interface triggerRenderProps {
    componentProps: TreeSelectProps;// TreeSelect props
    disabled: boolean;              // disabled status
    value: TreeNode[];              // data of the selected node
    inputValue: string;             // value of the input box
    onClear: e => void;             // onClear function
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
                ],
            },
            {
                label: 'North America',
                value: 'North America',
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
                    {value && value.length ? value.join(', ') : placeholder}
                </Button>
            )}
        />
    );
}
```

### Custom Rendering Selected Item

You can use renderSelectedItem to customize the rendering structure of the selected item in the selection box.

- In not multiple mode: `renderSelectedItem(treeNode:TreeNode) => content:ReactNode`
- In multiple mode: `renderSelectedItem(treeNode:TreeNode, { index:number, onClose:function }) => { isRenderInTag:bool, content:ReactNode }`
    - When isRenderInTag is true, content wraps are automatically rendered in the Tag (with background color and close button)
    - When isRenderInTag is false, the returned content will be rendered directly

```jsx live=true
import React, { useState, useCallback, useMemo } from 'react';
import { TreeSelect, Tag } from '@douyinfe/semi-ui';

function Demo() {
    const [value, setValue] = useState([]);
    const treeData = useMemo(() => [
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
          ],
      },
      {
        label: 'North America',
        value: 'North America',
        key: '1',
      },
      {
        label: 'South America',
        value: 'South America',
        key: '2',
      },
      {
        label: 'Antarctica',
        value: 'Antarctica',
        key: '3',
      },
    ], []);
    
    return (
        <>
            <h4>Single TreeSelect</h4>
            <TreeSelect
                style={{ width: 300 }}
                treeData={treeData}
                renderSelectedItem={item => item.label}
            />
            <h4>Multiple + isRenderInTag=true</h4>
            <TreeSelect
                style={{ width: 300 }}
                treeData={treeData}
                multiple
                renderSelectedItem={(item, { index, onClose }) => ({ content: item.label, isRenderInTag: true })}
            />
            <h4>Multiple + isRenderInTag=false</h4>
            <TreeSelect
                style={{ width: 300 }}
                treeData={treeData}
                multiple
                maxTagCount={2}
                renderSelectedItem={(item, { index, onClose }) => ({ content: <Tag key={index} color="white">{item.value}</Tag>, isRenderInTag: false })}
            />
        </>
    );
}
```

## API Reference

### TreeSelect

| Properties               | Instructions                                                                        | type                                                              | Default     | Version |
| ------------------------ | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ----------- | ------- |
| arrowIcon|Customize the right drop-down arrow Icon, when the showClear switch is turned on and there is currently a selected value, hover will give priority to the clear icon| ReactNode | | 1.15.0|
|autoAdjustOverflow|Whether the pop-up layer automatically adjusts the direction when it is obscured (only vertical direction is supported for the time being, and the inserted parent is body)|boolean | true| 0.34.0|
| autoExpandParent | Toggle whether to expand parent nodes automatically | boolean | false | 0.34.0 |
| className                | Class name                                                                          | string                                                            | -           | -       |
| clickToHide  | Whether to close the drop-down layer automatically when selecting, only works in single-selection mode  | boolean    | true | 1.5.0      |
| defaultExpandAll    | Set whether to expand all nodes during initialization. And if the data (`treeData`) changes, this api cannot affect the expansion of the node. If you need this, you can use `expandAll`    | boolean                     | false   | 0.32.0 |
| defaultExpandedKeys | Keys of default expanded nodes. Direct child nodes will be displayed. | string\[] | - | 0.32.0 |
| defaultOpen | Toggle whether to open dropdown menu by default | boolean | false | 0.32.0 |
| defaultValue             | Default value                                                                       | string \| number \| TreeNode \| (string \| number \| TreeNode)[]                                                  | -           | -       |
| disabled                 | Disabled                                                                            | boolean                                                           | false       | -       |
| disableStrictly | Disable Strictly | boolean | false | 1.30.0 |
| dropdownClassName        | `className` property for dropDown                                                   | string                                                            | -           | -       |
| dropdownMatchSelectWidth | Toggle if min-width of dropDown menu should be same as width of select box          | boolean                                                           | true        | -       |
| dropdownStyle            | Style for dropDown                                                                  | CSSProperties                                                            | -           | -       |
| emptyContent             | Empty content when no data                                                          | ReactNode                                                         | `no result` | -       |
| expandAction             | Expand logic, one of false, 'click', 'doubleClick'. Default is set to false, which means item will not be expanded on clicking except on expand icon    | boolean \| string   | false | 1.4.0        |
| expandAll | Set whether to expand all nodes by default. If the data (`treeData`) changes, the default expansion will still be affected by this api | boolean | false | 1.30.0 |
| expandedKeys        | （Controlled）Keys of expanded nodes. Direct child nodes will be displayed.  | string[]                    | -       | 0.32.0 |
| filterTreeNode           | Toggle whether searchable or pass in a function to customize search behavior.       | boolean\|(inputValue: string, treeNodeString: TreeNodeString) => boolean | false       | -       |
| getPopupContainer        | Container to render pop-up level, you need to set 'position: relative`                                                    | function():HTMLElement                                            | -           | -       |
| insetLabel               | Prefix alias，used mainly in Form                                                   | ReactNode                                                         | -           | 0.28.0  |
| labelEllipsis | Toggle whether to ellipsis label when overflow | boolean | false\|true(virtualized) | 1.8.0 |  
| leafOnly | Toggle whether to display tags for leaf nodes only and for onChange callback params in multiple mode | boolean | false |0.32.0 |
| loadData | Load data asynchronously and the return value should be a promise | (treeNode: TreeNode) => Promise |-| 1.32.0|
| loadedKeys | （Controlled）Mark node as loaded, working with `loadData` | Set< string > | - | 1.32.0|
| maxTagCount              | Maximum number of tags displayed                                                    | number                                                            | -           | -       |
| motionExpand             | Toggle whether to turn on animation for expansion                                   | boolean                                                           | true        | -       |
| multiple                 | Toggle whether in multi-choice mode                                                 | boolean                                                           | false       | -       |
| optionListStyle | Style for optionList  ｜ CSSProperties | - | 1.8.0 |
| outerBottomSlot          | Rendered at the bottom of the pop-up layer, custom slot level with optionList    | ReactNode  |  - | 1.1.0|
| outerTopSlot| Rendered at the top of the pop-up layer, custom slot level with optionList. If turn on filterTreeNode, it will replace search box as well. You could use static search method to customize instead. |  ReactNode  |  - | 1.9.0|
| placeholder              | Placeholder for input box                                                           | string                                                            | -           | -       |
| prefix                   | Prefix                                                                              | ReactNode                                                         | -           | 0.28.0  |
| renderFullLabel | Custom option render function, [Detailed Params and Usage](/en-US/navigation/tree#Advanced%20FullRender) | (obj) => ReactNode | 1.7.0 |
| renderLabel | Custom label render function | (label:ReactNode, data:TreeNode) => ReactNode | 1.6.0 | 
| renderSelectedItem | render selected item | Function | - | 1.26.0 | 
| searchAutoFocus        | Whether autofocus for search box           | boolean      | false           | 1.27.0       |
| searchPlaceholder        | Placeholder for search box                                                          | string                                                            | -           | -       |
| searchPosition | Set the position of the search box, one of: `dropdown`、`trigger` | string | `dropdown` | 1.29.0 |
| showClear | When the value is not empty, whether the trigger displays the clear button | boolean | false |  |
| showFilteredOnly | Toggle whether to displayed filtered result only in search mode | boolean | false | 0.32.0 |
| showSearchClear | Toggle whether to support clear search box | boolean | true | 0.35.0 |
| size                     | Size for input box，one of `large`，`small`，`default`                              | string                                                            | `default`   | -       |
| style                    | Inline style                                                                        | CSSProperties                                                            | -           | -       |
| suffix                   | Suffix                                                                              | ReactNode                                                         | -           | 0.28.0  |
| treeData                 | Data for treeNodes                                                                  | TreeNode[]                                                  | \[]         | -       |
| treeNodeFilterProp       | Property in a `treeNode` used to search                                             | string                                                            | `label`     | -       |
| treeNodeLabelProp        | Property in a `treeNode` used to display                                            | string                                                            | `label`     | -       |
| triggerRender | Method to create a custom trigger  | ({ placeholder: string }) => ReactNode | - | 0.34.0 |
| validateStatus | Validate status，one of `warning`、`error`、 `default`, only affects the background color of the component | string | - | 0.32.0 |
| value                    | Value data of current item, used when TreeSelect is a controlled component                       | string \| number \| TreeNode \| (string \| number \| TreeNode)[]                                                  | -           | -       |
| virtualize | Efficiently rendering large lists, refer to Tree - VirtualizeObj. Motion is disabled when tree is rendered as virtualized list. | object | - | 0.32.0 |
| zIndex | zIndex for treeSelect dropDown menu | number | 1030 | 0.30.0 |
| onBlur                 | Callback function when treeSelect blur | function(event)                            | -           | -       |
| onFocus                 | Callback function when treeSelect focus  | function(event)                            | -           | -       |
| onChange                 | Callback function when the tree node is selected, return the value property of data | Function                           | -           | -       |
| onChangeWithObject        | Toggle whether to return all properties in an option as a return value. When set to true, onChange turn to Function(node, e)   | boolean                     | false   | 1.0.0 |
| onExpand                 | Callback function when expand or collapse a node                                    | function(expandedKeys:array, {expanded: bool, node})              | -           | -       |
| onLoad | Callback function when a node is loaded | (loadedKeys: Set< string >, treeNode: TreeNode) => void | - | 1.32.0|
| onSearch                 | Callback function when search value changes                                         | function(sugInput: string)                                        | -           | -       |
| onSelect                 | Callback function when selected, return the key property of data                    | function(selectedKey:string, selected: bool, selectedNode: TreeNode)                      | -           | -       |
| onVisibleChange     | A callback triggered when the pop-up layer is displayed/hidden   | function(isVisible:boolean) |     |   1.4.0  |

### TreeNode

> **Key for `TreeNode` is required and must be unique**, `label` can be duplicated. Before **v>=1.7.0** value is also required and must be unique.
> After **v>=1.7.0**, value is not required. In this case, the value property in `onChange`, `value`, `defaultValue` and `onChangeWithObject` will point to key property.
> To ensure everything behave as expected, keep a consistency of whether to have value or not to have value.

| Properties | Instructions| type              | Default |
| ---------- | ------------------------------------------- | ----------------- | ------- |
| value      | Value| string\|number           | -       |
| label      | Displayed label    | string\|ReactNode | -       |
| icon       | Icon | ReactNode         | -       |
| disabled   | Disabled, supported in multiple select mode | boolean           | false   |
| key        | Required and must be unique                 | string            | -       |
| isLeaf     | Whether it is a leaf node | boolean |-|

### Method
- search(sugInput: string)
For custom rendering of input box.

## Design Tokens
<DesignToken/>