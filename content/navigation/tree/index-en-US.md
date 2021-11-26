---
localeCode: en-US
order: 40
category: Navigation
title:  Tree
subTitle: Tree
icon: doc-tree
brief: A tree view component presents a hierarchical list.
---


## Demos


### How to import

```jsx
import { Tree } from '@douyinfe/semi-ui';
```
### Basic Usage

By default, tree is in single select mode and each item is selectable.

```jsx live=true
import React from 'react';
import { Tree } from '@douyinfe/semi-ui';

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
    const style = {
        width: 260,
        height: 420,
        border: '1px solid var(--semi-color-border)'
    };
    return (
        <Tree treeData={treeData} defaultExpandAll style={style} />
    );
};
```

### Multi-choice

You could use `multiple` to set mode to multi-choice. When all child items are selected, the parent item will be selected.

```jsx live=true
import React from 'react';
import { Tree } from '@douyinfe/semi-ui';

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
    const style = {
        width: 260,
        height: 420,
        border: '1px solid var(--semi-color-border)'
    };
    return (
        <Tree treeData={treeData} multiple defaultExpandAll style={style} />
    );
};
```

### Searchable

Use `filterTreeNode` to support search input. By default it searches the `label` property of the data. You can use `treeNodeFilterProp` to set another property to search or pass in a function to `filterTreeNode` to customize search behavior.

You could also use `showFilteredOnly` if you prefer to display filtered results only.

```jsx live=true
import React from 'react';
import { Tree, Switch } from '@douyinfe/semi-ui';

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
        const style = {
            width: 260,
            height: 420,
            border: '1px solid var(--semi-color-border)'
        };
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
                <Tree
                    treeData={treeData}
                    multiple
                    filterTreeNode
                    showFilteredOnly={showFilteredOnly}
                    style={style}
                />
            </>
        );
    }
}
```

### JSON TreeData

You could use `treeDataSimpleJson` to pass in `treeNodes` data in JSON format. In this case, key will be used as `key` and `label`, and value will be used as `value` correspondingly. Return value includes JSON data in selected nodes.

```jsx live=true
import React from 'react';
import { Tree } from '@douyinfe/semi-ui';

() => {
    const json = {
        "Node1": {
            "Child Node1": '0-0-1',
            "Child Node2": '0-0-2',
        },
        "Node2": "0-1"
    };
    const style = {
        width: 260,
        height: 420,
        border: '1px solid var(--semi-color-border)'
    };
    return (
        <Tree
            treeDataSimpleJson={json}
            multiple
            onChange={e => console.log('All selected values: ',e)}
            onSelect={e => console.log('Current item: ',e)}
            style={style}
        />

    );
};
```

### BlockNode

You could use `blockNode` to set node to display as a row. In this case, styles for hovering and selected state take effects on the entire row. By default, it is set to `true`. When it is set to `false`, only label will be highlighted.

```jsx live=true
import React from 'react';
import { Tree } from '@douyinfe/semi-ui';

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
            <Tree
                treeData={treeData}
                defaultValue='Shanghai'
                blockNode={false}
            />
            <br/>
            <Tree
                treeData={treeData}
                defaultValue='Shanghai'
                multiple
                blockNode={false}
            />
        </div>
    );
};
```

### Custom TreeNode Label

You could pass in ReactNode for `label` in `treeNode` to customize label. Pay attention that by default `filterTreeNode` searches data by label. When label is a ReactNode, it is advised to pass in customized search function for a searchable tree.

```jsx live=true
import React from 'react';
import { Tree, ButtonGroup, Button } from '@douyinfe/semi-ui';

() => {
    let opts = {
        content: 'Hi, Bytedance dance dance',
        duration: 3,
    };

    const button = (
        <ButtonGroup
            size="small"
            theme="borderless"
        >
            <Button
                onClick={e => {
                    Toast.info(opts);
                    e.stopPropagation();
                }}
            >Alert</Button>
            <Button>Click</Button>
        </ButtonGroup>
    );

    const style = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const treeDataWithNode = [
        {
            label: (
                <div style={style}>
                    <span>Asia</span>
                    {button}
                </div>
            ),
            value: 'Asia',
            key: 'Asia',
            children: [
                {
                    label: (
                        <div style={style}>
                            <span>China</span>
                            {button}
                        </div>
                    ),
                    value: 'China',
                    key: 'China'
                },
                {
                    label: (
                        <div style={style}>
                            <span>Japan</span>
                            {button}
                        </div>
                    ),
                    value: 'Japan',
                    key: 'Japan',
                },
            ],
        }
    ];
    const treeStyle = {
        width: 260,
        height: 420,
        border: '1px solid var(--semi-color-border)'
    };
    return (
        <Tree
            treeData={treeDataWithNode}
            style={treeStyle}
        />
    );
};
```

### Custom Icon

You could use `icon` to add customized icon.

```jsx live=true
import React from 'react';
import { Tree } from '@douyinfe/semi-ui';
import { IconMapPin } from '@douyinfe/semi-icons';

() => {
    const treeData = [
        {
            label: 'Asia',
            value: 'Asia',
            key: '0',
            icon: (<IconMapPin style={{color: 'var(--semi-color-text-2)'}}/>),
            children: [
                {
                    label: 'China',
                    value: 'China',
                    key: '0-0',
                    icon: (<IconMapPin style={{color: 'var(--semi-color-text-2)'}}/>)
                },
                {
                    label: 'Japan',
                    value: 'Japan',
                    key: '0-1',
                    icon: (<IconMapPin style={{color: 'var(--semi-color-text-2)'}}/>)
                },
            ],
        }
    ];
    const style = {
        width: 260,
        height: 420,
        border: '1px solid var(--semi-color-border)'
    };
    return (
        <Tree
            treeData={treeData}
            style={style}
        />
    );
};
```

### Directory

You could use `directory` to display tree as a directory with default icons. Also, the icon could be overwritten by custom Icon.

```jsx live=true
import React from 'react';
import { Tree } from '@douyinfe/semi-ui';

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
    const style = {
        width: 260,
        height: 420,
        border: '1px solid var(--semi-color-border)'
    };
    return (
        <Tree
            treeData={treeData}
            directory
            style={style}
        />
    );
};
```

### Disabled

You can use `disableStrictly` to set whether to enable strict disabling. After enabling strict disabling, when the node is disabled, the selected state cannot be changed through the relationship between the child or the parent.

```jsx live=true
import React from 'react';
import { Tree } from '@douyinfe/semi-ui';

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
                            disabled: true,
                        },
                        {
                            label: 'Shanghai',
                            value: 'Shanghai',
                            key: '0-0-1',
                            disabled: true,
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
    const style = {
        width: 260,
        height: 420,
        border: '1px solid var(--semi-color-border)'
    };
    return (
        <Tree
            treeData={treeData}
            defaultValue='Shanghai'
            multiple
            style={style}
            disableStrictly
        />
    );
};
```

### Default Expand All

Both `defaultExpandAll` and `expandAll` can set the default expanded/collapsed state of `Tree`. The difference between the two is that `defaultExpandAll` only takes effect at initialization, while `expandAll` will not only take effect at initialization, but also when the data (`treeData`/`treeDataSimpleJson`) is dynamically updated, `expandAll` will still take effect.

Among them, `expandAll` is supported starting from 1.30.0.

In the demo below, after clicking the button to update `TreeData`, `defaultExpandAll` becomes invalid, and `expandAll` still takes effect.

```jsx live=true dir="column"
import React, { useState } from 'react';
import { Tree, Button } from '@douyinfe/semi-ui';
() => {
    const json = {
        "Node1": { 
            "Child Node1": '0-0-1',
            "Child Node2": '0-0-2',
        },
        "Node2": "0-1"
    };
    const json2 = {
        "Node3": {
            "Child Node1": '0-0-1',
            "Child Node2": '0-0-2',
            "Child Node3": '0-0-3',
            "Child Node4": '0-0-4',
        },
        "Node2": "0-1",
    };
    const style = {
        marginRight: 20,
        width: 260,
        height: 420,
        border: '1px solid var(--semi-color-border)',
    };
    const [tree, setTree] = useState(json);
    const handleClick = () => {
        setTree(json2);
    };
    return (
        <>
            <Button onClick={handleClick} style={{ marginBottom: 10 }}>
                Click to update TreeData
            </Button>
            <div style={{ display: 'flex' }}>
                <div>
                    <span>defaultExpandAll</span>
                    <Tree
                        defaultExpandAll
                        treeDataSimpleJson={tree}
                        style={style}
                    />
                </div>
                <div>
                    <span>expandAll</span>
                    <Tree
                        expandAll
                        treeDataSimpleJson={tree}
                        style={style}
                    />
                </div>
            </div>
        </>
    );
};

```

### Controlled Component

You can use `value` along with `onChange` property if you want to use Tree as a controlled component.

```jsx live=true
import React from 'react';
import { Tree } from '@douyinfe/semi-ui';

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
        const style = {
            width: 260,
            height: 420,
            border: '1px solid var(--semi-color-border)'
        };
        return (
            <Tree
                treeData={treeData}
                value={this.state.value}
                onChange={value => this.onChange(value)}
                style={style}
            />
        );
    }
}
```


### Auto Expand Parent

In the case of controlled expansion, when `autoExpandParent` is turned on, if you want to collapse the parent element, you need to collapse all its child elements. By default, `autoExpandParent` is false, that is, the collapse of the parent element is not affected by the child element.

```jsx live=true
import React from 'react';
import { Tree } from '@douyinfe/semi-ui';

class Demo extends React.Component {
    constructor() {
        super();
        this.state = {
            expandedKeys: ['0','0-0']
        };
    }
    onExpand(value) {
        this.setState({expandedKeys: value});
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
        const style = {
            width: 260,
            height: 420,
            border: '1px solid var(--semi-color-border)'
        };
        return (
            <Tree
                autoExpandParent
                treeData={treeData}
                onExpand={v=>this.onExpand(v)}
                expandedKeys={this.state.expandedKeys}
                style={style}
            />
        );
    }
}
```

### Virtualized Tree
If you need to render large sets of tree structured data, you could use virtualized tree. In virtualized mode, animation / motion is disabled for better performance. 

The property `virtualize` is an object consisting of the following values: 
- height: Height of the tree, If passed in as a string, computed height should not be zero for render purpose, in other words, parent node should have offsetHeight
- width: Width of the tree.
- itemSize: Height for each line of treeNode, required

If tree is searchable, you could also set `showFilteredOnly={true}` to reduce time of rendering for results.

```jsx live=true
import React from 'react';
import { Tree, Button } from '@douyinfe/semi-ui';

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
        const style = {
            width: 260,
            // height: 360,
            border: '1px solid var(--semi-color-border)'
        };
        return (
            <div style={{ padding: '0 20px' }}>
                <Button onClick={this.onGen}>Generate Data: </Button>
                <span>In total: {this.state.total}</span>
                <br/>
                <br/>
                {this.state.gData.length ? (
                    <Tree
                        treeData={this.state.gData}
                        filterTreeNode
                        style={style}
                        showFilteredOnly
                        virtualize={{
                            // if set height for tree, it will fill 100%
                            height: 300,
                            itemSize: 28,                    
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
import { Tree, Button } from '@douyinfe/semi-ui';

class Demo extends React.Component {
    constructor() {
        super();
        this.state = {
            treeData: [{
                key: '0',
                label: 'item-0',
                value: '0'
            }],
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
        const { treeData } = this.state;
        const style = {
            width: 260,
            height: 420,
            border: '1px solid var(--semi-color-border)'
        };
        return (
            <div style={style}>
                <Tree
                    treeData={this.state.treeData}
                />
                <br/>
                <Button onClick={this.add} style={{margin: 20}}>
                    Update Data
                </Button>
            </div>
        );
    }
}
```

### Load Data Asynchronously
You could use `loadData` to load treeData asynchronously on node expansion. Notice `isLeaf` is required to mark node as leaf in treeData.
```jsx live=true
import React, { useState } from 'react';
import { Tree } from '@douyinfe/semi-ui';

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

    return <Tree loadData={onLoadData} treeData={[...treeData]} />;
};
```

### Draggable Tree
You could use `draggable` along with `onDrop` to achieve a draggable Tree.
**Virtualized not supported at this moment**
**v>=1.8.0**
```jsx live=true
import React, { useState } from 'react';
import { Tree } from '@douyinfe/semi-ui';

() => {

    const initialData = [
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
        },
        {
            label: 'Europe',
            value: 'Europe',
            key: '2',
        }
    ];

    const [treeData, setTreeData] = useState(initialData);

    function onDrop(info) {
        const { dropToGap, node, dragNode } = info;
        const dropKey = node.key;
        const dragKey = dragNode.key;
        const dropPos = node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
        
        const data = [...treeData];
        const loop = (data, key, callback) => {
            data.forEach((item, ind, arr) => {
                if (item.key === key) return callback(item, ind, arr);
                if (item.children) return loop(item.children, key, callback);
            });
        };

        let dragObj;
        loop(data, dragKey, (item, ind, arr) => {
            arr.splice(ind, 1);
            dragObj = item;
        });

        if (!dropToGap) {
            // inset into the dropPosition
            loop(data, dropKey, (item, ind, arr) => {
                item.children = item.children || [];
                item.children.push(dragObj);
            });
        } else if (dropPosition === 1 && node.children && node.expanded) {
            // has children && expanded and drop into the node bottom gap
            // could insert anywhere. Here we insert to the top.
            loop(data, dropKey, item => {
                item.children = item.children || [];
                item.children.unshift(dragObj);
            });
        } else {
            let dropNodeInd;
            let dropNodePosArr;
            loop(data, dropKey, (item, ind, arr) => {
                dropNodePosArr = arr;
                dropNodeInd = ind;
            });
            if (dropPosition === -1) {
                // insert to top
                dropNodePosArr.splice(dropNodeInd, 0, dragObj);
            } else {
                // insert to bottom
                dropNodePosArr.splice(dropNodeInd + 1, 0, dragObj);
            }
        }
        setTreeData(data);
    }

    return <Tree
        treeData={treeData}
        draggable
        onDrop={onDrop}
    />;
};
```

### Advanced FullRender
**v>=1.7.0**

You could use `renderFullLabel` for advanced rendering to render the entire option on you own.

<Notice type="primary" title="Important">
<div>If virtualized is set to true, be sure to apply `style` to targeted ReactNode to correctly render virtualized list.</div>
</Notice>

Here are some demos.

First is to render Parent node as separator and only allow leaf nodes to be selected.
⚠️：renderFullLabel only takes care of the UI rendering and won't affect inside data logic. But you could choose info to your needs and use it with controlled mode for advanced usage.
```jsx live=true
import React from 'react';
import { Tree, Checkbox } from '@douyinfe/semi-ui';

() => {
    const renderLabel = ({
        onClick,
        onContextMenu,
        onDoubleClick,
        className,
        onExpand,
        data,
        onCheck,
        checkStatus,
        expandIcon,
    }) => {
        const { label } = data;
        const isLeaf = !(data.children && data.children.length);
        return (
            <li
                className={className}
                role="treenode"
                onClick={isLeaf ? onCheck : onExpand}
                onContextMenu={onContextMenu}
                onDoubleClick={onDoubleClick}
            >
                {isLeaf ? null : expandIcon}
                {isLeaf ? <div onClick={onCheck}>
                    <Checkbox
                        indeterminate={checkStatus.halfChecked}
                        checked={checkStatus.checked}
                        style={{marginRight: 8}}
                    />
                </div> : null}
                <span>{label}</span>
            </li>
        );
    };
    
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

    const treeStyle = {
        width: 260,
        height: 420,
        border: '1px solid var(--semi-color-border)'
    };
    return ( 
        <Tree
            treeData={treeData}
            renderFullLabel={renderLabel}
            multiple
            leafOnly
            style={treeStyle}
        />
    );
};
```

The second is for the scenario of "I hope that only leaf nodes can be single-selected, and the parent node only plays a role in grouping".
- You only need to click on the parent node without triggering the selection, click on the leaf node to trigger.

```jsx live=true
import React from 'react';
import { Tree } from '@douyinfe/semi-ui';

() => {
    const renderLabel = ({
        className,
        onExpand,
        onClick,
        data,
        expandIcon,
    }) => {
        const { label } = data;
        const isLeaf = !(data.children && data.children.length);
        return (
            <li
                className={className}
                role="treenode"
                onClick={isLeaf ? onClick : onExpand}
            >
                {isLeaf ? null : expandIcon}
                <span>{label}</span>
            </li>
        );
    };

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

    const treeStyle = {
        width: 260,
        height: 420,
        border: '1px solid var(--semi-color-border)'
    };
    return (
        <Tree
            treeData={treeData}
            renderFullLabel={renderLabel}
            style={treeStyle}
            onChange={(...args) => console.log('change', ...args)}
        />
    );
};
```

Third is for the scenario when selecting Parent node also highlighting child node.

```jsx live=true
import React, { useState } from 'react';
import { Tree } from '@douyinfe/semi-ui';
import { IconFixedStroked, IconSectionStroked, IconAbsoluteStroked, IconInnerSectionStroked, IconComponentStroked } from '@douyinfe/semi-icons';

() => {
    const [selected, setSelected] = useState(new Set());
    const [selectedThroughParent, setSelectedThroughParent] = useState(new Set());
    const treeData = [
        {
            label: 'Fixed Black Button',
            icon: <IconFixedStroked style={{ marginRight: 8, color: 'var(--semi-color-text-2)' }} />,
            key: 'fix-btn-0'
        },
        {
            label: 'Module',
            key: 'module-0',
            icon: <IconSectionStroked style={{ marginRight: 8, color: 'var(--semi-color-text-2)' }} />,
            children: [
                {
                    label: 'Free Components',
                    icon: <IconAbsoluteStroked style={{ marginRight: 8, color: 'var(--semi-color-text-2)' }} />,
                    key: 'free-compo-0',
                },
                {
                    label: 'Split Container',
                    icon: <IconInnerSectionStroked style={{ marginRight: 8, color: 'var(--semi-color-text-2)' }} />,
                    key: 'split-col-0',
                    children: [
                        {
                            label: 'Button',
                            icon: <IconComponentStroked style={{ marginRight: 8, color: 'var(--semi-color-text-2)' }} />,
                            key: 'btn-0'
                        },
                        {
                            label: 'Button',
                            icon: <IconComponentStroked style={{ marginRight: 8, color: 'var(--semi-color-text-2)' }} />,
                            key: 'btn-1'
                        }
                    ]
                },
            ],
        },
        {
            label: 'Module',
            icon: <IconSectionStroked style={{ marginRight: 8, color: 'var(--semi-color-text-2)' }} />,
            key: 'module-1',
            children: [
                {
                    label: 'Custom Component',
                    icon: <IconComponentStroked style={{ marginRight: 8, color: 'var(--semi-color-text-2)' }} />,
                    key: 'cus-0'
                }
            ]
        }
    ];

    const findDescendantKeys = (node) => {
        let res = [node.key];
        const findChild = item => {
            if (!item) return;
            const { children } = item;
    
            if (children && children.length) {
                children.forEach(child => {
                    res.push(child.key);
                    findChild(child);
                });
            }
        };
        findChild(node);
        return res;
    };  
    
    const handleSelect = (key, bool, node) => {
        setSelected(new Set([key]));
        const descendantKeys = findDescendantKeys(node);
        setSelectedThroughParent(new Set(descendantKeys));
    };

    const renderLabel = ({
        className,
        data,
        onClick,
        expandIcon
    }) => {
        const { label, icon, key } = data;
        const isLeaf = !(data.children && data.children.length);
        const style = {
            backgroundColor: selected.has(key) 
                ? 'rgba(var(--semi-blue-0), 1)' 
                : selectedThroughParent.has(key) 
                    ? 'rgba(var(--semi-blue-0), .5)' : 'transparent'
        };
        return (
            <li
                className={className}
                role="treenode"
                onClick={onClick}
                style={style}
            >
                {isLeaf ? <span style={{width: 24}}></span> : expandIcon}
                {icon}
                <span>{label}</span>
            </li>
        );
    };

    const treeStyle = {
        width: 260,
        height: 420,
        border: '1px solid var(--semi-color-border)'
    };
  
    return ( 
        <Tree
            treeData={treeData}
            renderFullLabel={renderLabel}
            onSelect={handleSelect}
            style={treeStyle}
            defaultExpandAll
        />
    );
};
```


### Advanced FullRender with Draggable

Starting from version 1.27.0, we support the simultaneous use of draggable (`draggable`) and advanced customization (`renderFullLabel`). Before this version, the simultaneous use of both was not supported.

```jsx live=true
import React, { useState } from 'react';
import { Tree } from '@douyinfe/semi-ui';
import { IconFixedStroked, IconSectionStroked, IconAbsoluteStroked, IconInnerSectionStroked, IconComponentStroked } from '@douyinfe/semi-icons';

() => {
    const [selected, setSelected] = useState(new Set());
    const [selectedThroughParent, setSelectedThroughParent] = useState(new Set());
    const defaultTreeData = [
        {
            label: 'Fixed Black Button',
            icon: <IconFixedStroked style={{ marginRight: 8, color: 'var(--semi-color-text-2)' }} />,
            key: 'fix-btn-0'
        },
        {
            label: 'Module',
            key: 'module-0',
            icon: <IconSectionStroked style={{ marginRight: 8, color: 'var(--semi-color-text-2)' }} />,
            children: [
                {
                    label: 'Free Components',
                    icon: <IconAbsoluteStroked style={{ marginRight: 8, color: 'var(--semi-color-text-2)' }} />,
                    key: 'free-compo-0',
                },
                {
                    label: 'Split Container',
                    icon: <IconSectionStroked style={{ marginRight: 8, color: 'var(--semi-color-text-2)' }} />,
                    key: 'split-col-0',
                    children: [
                        {
                            label: 'Button',
                            icon: <IconComponentStroked style={{ marginRight: 8, color: 'var(--semi-color-text-2)' }} />,
                            key: 'btn-0'
                        },
                        {
                            label: 'Button',
                            icon: <IconComponentStroked style={{ marginRight: 8, color: 'var(--semi-color-text-2)' }} />,
                            key: 'btn-1'
                        }
                    ]
                },
            ],
        },
        {
            label: 'Module',
            icon: <IconSectionStroked style={{ marginRight: 8, color: 'var(--semi-color-text-2)' }} />,
            key: 'module-1',
            children: [
                {
                    label: 'Custom Component',
                    icon: <IconComponentStroked style={{ marginRight: 8, color: 'var(--semi-color-text-2)' }} />,
                    key: 'cus-0'
                }
            ]
        }
    ];
    const [treeData, setTreeData] = useState(defaultTreeData);

    const onDrop = (info) => {
        const { dropToGap, node, dragNode } = info;
        const dropKey = node.key;
        const dragKey = dragNode.key;
        const dropPos = node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

        const data = [...treeData];
        const loop = (data, key, callback) => {
            data.forEach((item, ind, arr) => {
                if (item.key === key) return callback(item, ind, arr);
                if (item.children) return loop(item.children, key, callback);
            });
        };

        let dragObj;
        loop(data, dragKey, (item, ind, arr) => {
            arr.splice(ind, 1);
            dragObj = item;
        });

        if (!dropToGap) {
            loop(data, dropKey, (item, ind, arr) => {
                item.children = item.children || [];
                item.children.push(dragObj);
            });
        } else if (dropPosition === 1 && node.children && node.expanded) {
            loop(data, dropKey, item => {
                item.children = item.children || [];
                item.children.unshift(dragObj);
            });
        } else {
            let dropNodeInd;
            let dropNodePosArr;
            loop(data, dropKey, (item, ind, arr) => {
                dropNodePosArr = arr;
                dropNodeInd = ind;
            });
            if (dropPosition === -1) {
                dropNodePosArr.splice(dropNodeInd, 0, dragObj);
            } else {
                dropNodePosArr.splice(dropNodeInd + 1, 0, dragObj);
            }
        }
        setTreeData(data);
    };

    const findDescendantKeys = (node) => {
        let res = [node.key];
        const findChild = item => {
            if (!item) return;
            const { children } = item;

            if (children && children.length) {
                children.forEach(child => {
                    res.push(child.key);
                    findChild(child);
                });
            }
        };
        findChild(node);
        return res;
    };

    const handleSelect = (key, bool, node) => {
        setSelected(new Set([key]));
        const descendantKeys = findDescendantKeys(node);
        setSelectedThroughParent(new Set(descendantKeys));
    };

    const renderLabel = ({
        className,
        data,
        onClick,
        expandIcon
    }) => {
        const { label, icon, key } = data;
        const isLeaf = !(data.children && data.children.length);
        const style = {
            backgroundColor: selected.has(key)
                ? 'rgba(var(--semi-blue-0), 1)'
                : selectedThroughParent.has(key)
                    ? 'rgba(var(--semi-blue-0), .5)' : 'transparent'
        };
        return (
            <li
                className={className}
                role="treenode"
                onClick={onClick}
                style={style}
            >
                {isLeaf ? <span style={{ width: 24 }}></span> : expandIcon}
                {icon}
                <span>{label}</span>
            </li>
        );
    };

    const treeStyle = {
        width: 260,
        height: 420,
        border: '1px solid var(--semi-color-border)'
    };


    return <Tree
        treeData={treeData}
        draggable
        onDrop={onDrop}
        renderFullLabel={renderLabel}
        onSelect={handleSelect}
        style={treeStyle}
        defaultExpandAll
    />;
};
```


## API Reference

### Tree

| Properties          | Instructions                       | Type                        | Default |Version |
| ------------------- | --------------------- | ------------------------------------------------- | ------- | ------ |
| autoExpandParent | Toggle whether to expand parent node automatically | boolean | false | 0.34.0 |
| autoExpandWhenDragEnter | Toggle whether allow autoExpand when drag enter node | boolean | true | 1.8.0 | 
| blockNode           | Toggle whether to display node as row     | boolean                     | true    | - |
| className           | Class name| string                      | -       | - |
| defaultExpandAll    | Set whether to expand all nodes during initialization. And if the subsequent data (`treeData`/`treeDataSimpleJson`) changes, this api cannot affect the default expansion of the node. If you need this, you can use `expandAll`    | boolean                     | false   | - |
| defaultExpandedKeys | Keys of default expanded nodes. Direct child nodes will be displayed.     | string\[]                   | -       | - |
| defaultValue        | Default value                      | string \| number \| TreeNode \| (string \| number \| TreeNode)[]            | -       | - |
| directory           | Toggle whether to display tree in directory mode | boolean                     | false   | - |
| disableStrictly | When a node is disabled, its status could not be changed by its parent or child nodes | boolean | false | 1.4.0 | 
| disabled | Toggle whether to disable the entire tree to be unselectable | boolean | false | 0.32.0 |
| draggable | Toggle whether allow draggable | boolean | false | 1.8.0 | 
| emptyContent             | Empty content when no data                                                          | ReactNode                                                         | `no result` | 0.32.0       |
| expandAction             | Expand logic, one of false, 'click', 'doubleClick'. Default is set to false, which means item will not be expanded on clicking except on expand icon    | boolean \| string   | false | 0.35.0       |
| expandAll | Set whether to expand all nodes by default. If the subsequent data (`treeData`/`treeDataSimpleJson`) changes, the default expansion will also be affected by this api | boolean | false | 1.30.0 |
| expandedKeys        | （Controlled）Keys of expanded nodes. Direct child nodes will be displayed.  | string[]                    | -       | - |
| filterTreeNode      | Toggle whether searchable or pass in a function to customize search behavior.| boolean \| ((inputValue: string, treeNodeString: string) => boolean)  | false   | - |
| hideDraggingNode | Toggle whether to hide dragImg of dragging node | boolean | false | 1.8.0 | 
| icon       | Icon | ReactNode         | -       | - |
| labelEllipsis | Toggle whether to ellipsis label when overflow. Set to false iff there are other requirements | boolean | false\|true(virtualized) | 1.8.0 | 
| leafOnly | Toggle whether to display tags for leaf nodes only and for onChange callback params in multiple mode | boolean | false | 1.18.0 |
| loadData | Load data asynchronously and the return value should be a promise | (treeNode?: TreeNode) => Promise< void > |-| 1.0.0|
| loadedKeys | （Controlled）Mark node as loaded, working with `loadData` | string[] | - | 1.0.0|
| motion              | Toggle whether to turn on animation| boolean                     | true    | - |
| multiple            | Toggle whether in multi-choice mode| boolean                     | false   | - |
| renderDraggingNode | Custom render function to render html element of dragImg for dragging node | (nodeInstance: HTMLElement, node: TreeNode) => HTMLElement | - | 1.8.0 | 
| renderFullLabel | Custom option render function | (data: object) => ReactNode | - | 1.7.0 | 
| renderLabel | Custom label render function | (label: ReactNode, data: TreeNode) => ReactNode | - | 1.6.0 | 
| searchClassName     | Classname property for search box  | string                      | -       | - |
| searchPlaceholder   | Placeholder for search box         | string                      | -       | - |
| searchRender | Custom method to render search input; hide search box if set to false(**V>=1.0.0**) | ((searchRenderProps: object) => ReactNode) \| false | - | 0.35.0 |
| searchStyle         | Style for for search box           | CSSProperties                      | -       | - |
| showClear   | Toggle whether to support clear input box | boolean                     | true   | 0.35.0|
| showFilteredOnly | Toggle whether to displayed filtered result only in search mode | boolean | false | 0.32.0 |
| style               | Inline style                       | CSSProperties                      | -       | - |
| treeData            | Data for treeNodes                 | TreeNode[]            | \[]     | - |
| treeDataSimpleJson  | Data for treeNodes in JSON format, return value in JSON format as well    | TreeDataSimpleJson                      | \{}     | - |
| treeNodeFilterProp  | Property in a `treeNode` used to search   | string                      | `label` | - |
| value               | Current value, used when tree is a controlled component                   | string \| number \| TreeNode \| (string \| number \| TreeNode)[]           | -       | - |
| virtualize | Efficiently rendering large lists, refer to VirtualizeObj. Motion is disabled when tree is rendered as virtualized list. | VirtualizeObj | - | 0.32.0 |
| onChange            | Callback function when the tree node is selected, return the value property of data                   | (string \| number \| TreeNode \| (string \| number \| TreeNode)[]) => void   | -       | - |
| onChangeWithObject        | Toggle whether to return all properties in an option as a return value. When set to true, return value looks like: { value, label, ...rest }. For controlled mode, you need to pass an object with { value: value } to value correspondingly. DefaultValue similarly.  | boolean                     | false   | - |
| onDoubleClick | (e: MouseEvent, node: TreeNode) => void | - | 0.35.0 |
| onDragEnd | Callback function for onDragEnd  | (dragProps: object) => void | - | 1.8.0 | 
| onDragEnter | Callback function for onDragEnter  | (dragEnterProps: object) => void | - | 1.8.0 | 
| onDragLeave | Callback function for onDragLeave  | (dragProps: object) => void | - | 1.8.0 | 
| onDragOver | Callback function for onDragOver  | (dragProps: object) => void | - | 1.8.0 | 
| onDragStart | Callback function for onDragStart  | (dragProps: object) => void | - | 1.8.0 | 
| onDrop | Callback function for onDrop  | (onDragProps: object) => void | - | 1.8.0 | 
| onExpand            | Callback function when expand or collapse a node | (expandedKeys: string[], {expanded: boolean, node: TreeNode}) => void               | -       | - |
| onLoad | Callback function when a node is loaded | (loadedKeys: Set< string >, treeNode: TreeNode) => void | - | 1.0.0|
| onContextMenu | Callback function when right click on an item | (e: MouseEvent, node: TreeNode) => void | - | 0.35.0 |
| onSearch            | Callback function when the values for search input changes                | (sunInput: string) => void  | -       | - |
| onSelect            | Callback function when selected, return the key property of data          | (selectedKey:string, selected: bool, selectedNode: TreeNode) => void | -       | - |

### TreeNode

> **Key for `TreeNode` is required and must be unique**, `label` can be duplicated. Before **v>=1.7.0** value is also required and must be unique.
> After **v>=1.7.0**, value is not required. In this case, the value property in `onChange`, `value`, `defaultValue` and `onChangeWithObject` will point to key property.
> To ensure everything behave as expected, keep a consistency of whether to have value or not to have value.

| Properties | Instructions| Type              | Default |
| ---------- | ------------------------------------------- | ----------------- | ------- |
| value      | Value| string\|number            | -       |
| label      | Displayed label    | string\|ReactNode | -       |
| icon       | Icon | ReactNode         | -       |
| disabled   | Disabled | boolean           | false   |
| key        | Required and must be unique                 | string            | -       |
| isLeaf | Toggle whether node is leaf node, only takes effect in async load data with `loadData` **v>=1.0.0**| boolean | - |

### Virtualize Object

> `itemSize` is required to render virtualized tree。  

| Properties | Instructions | Type              | Default |
| ---------- | ------------------------------------------- | ----------------- | ------- |
| height | Height. If passed as a string, computed height should not be 0 for render purpose, in other words, parent node should have offsetHeight | number\|string | '100%' |
| itemSize | Height for each line of treeNode, required | number | - |
| width | Width | number\|string | '100%' |

### Ref Method
- search(sugInput) => void

## Design Tokens
<DesignToken/>