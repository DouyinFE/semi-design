---
localeCode: en-US
order: 20
category: Input
title:  Cascader
subTitle: Cascade
icon: doc-cascader
brief: Used to select an option under a multi-level classification.
---


## Demos

### How to import

```jsx import 
import { Cascader } from '@douyinfe/semi-ui';
```

### Basic Usage

Basic usage, only leaf nodes can be selected by default.

```jsx live=true
import React from 'react';
import { Cascader } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: 'Impressionism',
            value: 'impressionism',
            children: [
                {
                    label: 'Visual Arts',
                    value: 'visualArts',
                    children: [
                        {
                            label: 'Claude Monet',
                            value: 'Monet',
                        },
                        {
                            label: 'Pierre-Auguste Renoir',
                            value: 'Renoir',
                        },
                        {
                            label: 'Édouard Manet',
                            value: 'Manet',
                        },
                    ],
                },
                {
                    label: 'Music',
                    value: 'music',
                    children: [
                        {
                            label: 'Claude Debussy',
                            value: 'Debussy',
                        },
                        {
                            label: 'Maurice Ravel',
                            value: 'Ravel',
                        }
                    ]
                }
            ],
        }];
    return (
        <Cascader
            style={{ width: 400 }}
            treeData={treeData}
            placeholder="Please select"
        />
    );
};
```

### Multiple
version: >= 1.28.0

Set `multiple` to make multiple selections.

```jsx live=true
import React from 'react';
import { Cascader } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: 'Impressionism',
            value: 'impressionism',
            children: [
                {
                    label: 'Visual Arts',
                    value: 'visualArts',
                    children: [
                        {
                            label: 'Claude Monet',
                            value: 'Monet',
                        },
                        {
                            label: 'Pierre-Auguste Renoir',
                            value: 'Renoir',
                        },
                        {
                            label: 'Édouard Manet',
                            value: 'Manet',
                        },
                    ],
                },
                {
                    label: 'Music',
                    value: 'music',
                    children: [
                        {
                            label: 'Claude Debussy',
                            value: 'Debussy',
                        },
                        {
                            label: 'Maurice Ravel',
                            value: 'Ravel',
                        }
                    ]
                }
            ],
        }];
    return (
        <Cascader
            defaultValue= {['impressionism', 'visualArts', 'Monet']}
            style={{ width: 400 }}
            treeData={treeData}
            placeholder="Please select"
            multiple
        />
    );
};
```

### Searchable

Use `filterTreeNode` to support search input. By default it searches the `value` property of the data. You can use `treeNodeFilterProp` to set another property to search or pass in a function to `filterTreeNode` to customize search behavior.

```jsx live=true
import React from 'react';
import { Cascader } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: 'Impressionism',
            value: 'impressionism',
            children: [
                {
                    label: 'Visual Arts',
                    value: 'visualArts',
                    children: [
                        {
                            label: 'Claude Monet',
                            value: 'Monet',
                        },
                        {
                            label: 'Pierre-Auguste Renoir',
                            value: 'Renoir',
                        },
                        {
                            label: 'Édouard Manet',
                            value: 'Manet',
                        },
                    ],
                },
                {
                    label: 'Music',
                    value: 'music',
                    children: [
                        {
                            label: 'Claude Debussy',
                            value: 'Debussy',
                        },
                        {
                            label: 'Maurice Ravel',
                            value: 'Ravel',
                        }
                    ]
                }
            ],
        }];
    return (
        <div>
            <Cascader
                style={{ width: 400 }}
                treeData={treeData}
                placeholder="Search in label by default"
                filterTreeNode
            />
            <br/>
            <br/>
            <Cascader
                style={{ width: 400 }}
                treeData={treeData}
                placeholder="Search in value"
                filterTreeNode
                treeNodeFilterProp='value'
            />
        </div>
    );
};
```


### Searchable Multiple Selection 

version: >= 1.28.0

When multiple selection and search are supported at the same time, in this scenario, you can delete the corresponding selected item by pressing the BackSpace key.

```jsx live=true
import React from 'react';
import { Cascader } from '@douyinfe/semi-ui';

class Demo extends React.Component {
    constructor() {
        super();
        this.state = {
            value: ['impressionism', 'visualArts', 'Monet']
        };
    }
    onChange(value) {
        this.setState({ value });
    }
    render() {
        const treeData = [
            {
                label: 'Impressionism',
                value: 'impressionism',
                children: [
                    {
                        label: 'Visual Arts',
                        value: 'visualArts',
                        children: [
                            {
                                label: 'Claude Monet',
                                value: 'Monet',
                            },
                            {
                                label: 'Pierre-Auguste Renoir',
                                value: 'Renoir',
                            },
                            {
                                label: 'Édouard Manet',
                                value: 'Manet',
                            },
                        ],
                    },
                    {
                        label: 'Music',
                        value: 'music',
                        children: [
                            {
                                label: 'Claude Debussy',
                                value: 'Debussy',
                            },
                            {
                                label: 'Maurice Ravel',
                                value: 'Ravel',
                            }
                        ]
                    }
                ],
            }];
        return (
            <Cascader
                style={{ width: 300 }}
                treeData={treeData}
                placeholder="Please select"
                value={this.state.value}
                multiple
                filterTreeNode
                onChange={e => this.onChange(e)}
            />
        );
    }
}
```

Filtered data can be sorted using `filterSorter`

```jsx live=true
import React, { useState } from 'react';
import { Cascader } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: 'Product',
            value: 'Product',
            children: [
                {
                    label: 'Semi-Material',
                    value: 'Semi-Material',
                    
                },
                {
                    label: 'Semi-DSM',
                    value: 'Semi-DSM',
                    
                },
                {
                    label: 'Semi',
                    value: 'Semi',
                    
                },
                {
                    label: 'Semi-C2D',
                    value: 'Semi-C2D',
                },
                {
                    label: 'Semi-D2C',
                    value: 'Semi-D2C',
                },
            ],
        }
    ];
    return (
        <div>
            <Cascader
                style={{ width: 300 }}
                treeData={treeData}
                placeholder="Enter s to view the sorting effect"
                filterTreeNode
                filterSorter={(first, second, inputValue) => {
                    const firstData = first[first.length - 1];
                    const lastData = second[second.length - 1];
                    if (firstData.label === inputValue) {
                        return -1;
                    } else if (lastData.label === inputValue) {
                        return 1;
                    } else {
                        return firstData.label < lastData.label ? -1 : 1;
                    }
                }}
            />
        </div>
    );
};
```

If you want to customize the rendering options after the search, you can use `filterRender` to achieve custom rendering of the entire line. The `filterRender` function parameters are as follows:

``` tsx
interface filterRenderProps {
    className: string;
    inputValue: string;     // Search bar search content
    disabled: boolean;      // Whether to disable
    data: CascaderData[];   // Search result data
    selected: boolean;      // Selected state when single selection
    checkStatus:  {         // Checked state when multiple selection
        checked: boolean;
        halfChecked: boolean;
    };
    onClick: (e: React.MouseEvent) => void;      // Callback when clicked option in single selection 
    onCheck: (e: React.MouseEvent) => void;      // Callback when clicked option in multiple selection
 }
```

The example is as follows

```jsx live=true
import React, { useState } from 'react';
import { Cascader, Typography, Checkbox } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: 'Semi',
            value: 'Semi',
            children: [
                {
                    label: 'Semi-Material Semi-Material Semi-Material Semi-Material',
                    value: 'Semi-Material',
                    
                },
                {
                    label: 'Semi-DSM Semi-DSM Semi-DSM Semi-DSM',
                    value: 'Semi-DSM',
                    
                },
                {
                    label: 'Semi Design Semi Design Semi Design Semi Design',
                    value: 'Semi Design',
                    
                },
                {
                    label: 'Semi-C2D Semi-C2D Semi-C2D Semi-C2D Semi-C2D',
                    value: 'Semi-C2D',
                },
                {
                    label: 'Semi-D2C Semi-D2C Semi-D2C Semi-D2C Semi-D2C ',
                    value: 'Semi-D2C',
                },
            ],
        }
    ];
    const { Text } = Typography;

    const renderSearchOptionSingle = (props) => {
        const { className, data, onClick, onKeyPress, selected } = props;

        return (
            <li
                className={className}
                style={{ justifyContent: 'flex-start' }}
                role="treeitem"
                onClick={onClick}
                onKeyPress={onKeyPress}
            > 
                <Text 
                    ellipsis={{ showTooltip: { opts: { style: { wordBreak: 'break-all' } } } }} 
                    style={{ width: 270, color: selected ? 'var(--semi-color-primary)': undefined }}
                >
                    {data.map(item => item.label ).join(' / ')}
                </Text>
            </li>
        );
    };

    const renderSearchOptionMultiple = (props) => {
        const { className, data, checkStatus, onClick, onKeyPress } = props;

        return (
            <li
                className={className}
                style={{ justifyContent: 'flex-start' }}
                role="treeitem"
                onClick={onClick}
                onKeyPress={onKeyPress}
            > 
                <Checkbox
                    onClick={onClick}
                    indeterminate={checkStatus.halfChecked}
                    checked={checkStatus.checked}
                    style={{ marginRight: 8 }}
                />
                <Text 
                    ellipsis={{ showTooltip: { opts: { style: { wordBreak: 'break-all' } } } }} 
                    style={{ width: 250 }}
                >
                    {data.map(item => item.label).join(' / ')}
                </Text>
            </li>
        );
    };
    
    return (
        <div>
            <p>Mouse over the option to view the complete content of the omitted text</p>
            <br />
            <Cascader
                style={{ width: 300 }}
                treeData={treeData}
                placeholder="Single selection, enter s"
                filterTreeNode
                filterRender={renderSearchOptionSingle}
            />
            <br />
            <Cascader
                multiple
                style={{ width: 300, marginTop: 20 }}
                treeData={treeData}
                placeholder="Multiple selection, enter s"
                filterTreeNode
                filterRender={renderSearchOptionMultiple}
            />
        </div>
    );
};

```

### Limit Tags Displayed

version: >= 1.28.0

When multiple selections, you can use `maxTagCount` to limit the number of tags displayed, and the excess will be displayed as +N. 

You can use `showRestTagsPopover` to set whether hover +N displays Popover after maxTagCount is exceeded, the default is false. And, you can also configure Popover in the `restTagsPopoverProps` property.

```jsx live=true
import React from 'react';
import { Cascader } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: 'Impressionism',
            value: 'impressionism',
            children: [
                {
                    label: 'Visual Arts',
                    value: 'visualArts',
                    children: [
                        {
                            label: 'Claude Monet',
                            value: 'Monet',
                        },
                        {
                            label: 'Pierre-Auguste Renoir',
                            value: 'Renoir',
                        },
                        {
                            label: 'Édouard Manet',
                            value: 'Manet',
                        },
                    ],
                },
                {
                    label: 'Music',
                    value: 'music',
                    children: [
                        {
                            label: 'Claude Debussy',
                            value: 'Debussy',
                        },
                        {
                            label: 'Maurice Ravel',
                            value: 'Ravel',
                        }
                    ]
                }
            ],
        }];
    return (
        <Cascader
            style={{ width: 300 }}
            treeData={treeData}
            placeholder="Please selection"
            multiple
            maxTagCount={1}
            showRestTagsPopover={true}
            restTagsPopoverProps={{ position: 'top' }}
            defaultValue={[
                ['impressionism', 'visualArts', 'Monet'],
                ['impressionism', 'visualArts', 'Renoir']
            ]}
        />
    );
};
```


### Limit Tags Number

version: >= 1.28.0

In a multi-selection scene, use max to limit the number of multi-selection selections. After max is exceeded, the onExceed callback will be triggered.

```jsx live=true
import React from 'react';
import { Cascader, Toast } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: 'Impressionism',
            value: 'impressionism',
            children: [
                {
                    label: 'Visual Arts',
                    value: 'visualArts',
                    children: [
                        {
                            label: 'Claude Monet',
                            value: 'Monet',
                        },
                        {
                            label: 'Pierre-Auguste Renoir',
                            value: 'Renoir',
                        },
                        {
                            label: 'Édouard Manet',
                            value: 'Manet',
                        },
                    ],
                },
                {
                    label: 'Music',
                    value: 'music',
                    children: [
                        {
                            label: 'Claude Debussy',
                            value: 'Debussy',
                        },
                        {
                            label: 'Maurice Ravel',
                            value: 'Ravel',
                        }
                    ]
                }
            ],
        }];
    return (
        <Cascader
            style={{ width: 300 }}
            treeData={treeData}
            placeholder="Please selection"
            multiple
            max={1}
            onExceed={v=>{
                Toast.warning('exceed max');
                console.log(v);
            }}
            defaultValue={[
                ['impressionism', 'visualArts', 'Monet']
            ]}
        />
    );
};
```

### Change on Select

In the case of single selection, you can also set `changeOnSelect` to allow the parent option to be selected.

```jsx live=true
import React from 'react';
import { Cascader } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: 'Impressionism',
            value: 'impressionism',
            children: [
                {
                    label: 'Visual Arts',
                    value: 'visualArts',
                    children: [
                        {
                            label: 'Claude Monet',
                            value: 'Monet',
                        },
                        {
                            label: 'Pierre-Auguste Renoir',
                            value: 'Renoir',
                        },
                        {
                            label: 'Édouard Manet',
                            value: 'Manet',
                        },
                    ],
                },
                {
                    label: 'Music',
                    value: 'music',
                    children: [
                        {
                            label: 'Claude Debussy',
                            value: 'Debussy',
                        },
                        {
                            label: 'Maurice Ravel',
                            value: 'Ravel',
                        }
                    ]
                }
            ],
        }];
    return (
        <div>
            <Cascader
                style={{ width: 400 }}
                treeData={treeData}
                changeOnSelect
                placeholder="Change on select"
            />
            <br/>
            <br/>
            <Cascader
                style={{ width: 400 }}
                treeData={treeData}
                changeOnSelect
                placeholder="Searchable change on select"
                filterTreeNode
            />
        </div>
    );
};
```

### Custom Display Property

Set `displayProp` to select which property in the data you would like to display. By default, `label` is displayed.

```jsx live=true
import React from 'react';
import { Cascader, Typography } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: 'Impressionism',
            value: 'impressionism',
            children: [
                {
                    label: 'Visual Arts',
                    value: 'visualArts',
                    children: [
                        {
                            label: 'Claude Monet',
                            value: 'Monet',
                        },
                        {
                            label: 'Pierre-Auguste Renoir',
                            value: 'Renoir',
                        },
                        {
                            label: 'Édouard Manet',
                            value: 'Manet',
                        },
                    ],
                },
                {
                    label: 'Music',
                    value: 'music',
                    children: [
                        {
                            label: 'Claude Debussy',
                            value: 'Debussy',
                        },
                        {
                            label: 'Maurice Ravel',
                            value: 'Ravel',
                        }
                    ]
                }
            ],
        }
    ];
    return (
        <>
            <Typography.Title heading={6}>single selection</Typography.Title>
            <Cascader
                style={{ width: 300 }}
                treeData={treeData}
                placeholder="Please Select"
                displayProp='value'
                defaultValue={['impressionism', 'visualArts', 'Monet']}
            />
            <br />
            <br />
            <Typography.Title heading={6}>multiple selection</Typography.Title>
            <Cascader
                multiple
                style={{ width: 300 }}
                treeData={treeData}                
                defaultValue={['impressionism', 'visualArts', 'Monet']}
                placeholder="Please Select"
                displayProp='value'
            />
        </>
    );
};
```

The return format can be set by setting `displayRender`.

When single selection (`multiple=false`), `displayRender((labelPath: string[]) => ReactNode)`, where labelPath is a path array composed of labels.

When multiple selection (`multiple=true`), `displayRender((item: Entity, index: number) => ReactNode)`, where item is the relevant data of the node.

```typescript
interface Entity {
    children?: Entity[];         // children list
    data: CascaderData;              // treedata
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
            label: 'Impressionism',
            value: 'impressionism',
            children: [
                {
                    label: 'Visual Arts',
                    value: 'visualArts',
                    children: [
                        {
                            label: 'Claude Monet',
                            value: 'Monet',
                        },
                        {
                            label: 'Pierre-Auguste Renoir',
                            value: 'Renoir',
                        },
                        {
                            label: 'Édouard Manet',
                            value: 'Manet',
                        },
                    ],
                },
                {
                    label: 'Music',
                    value: 'music',
                    children: [
                        {
                            label: 'Claude Debussy',
                            value: 'Debussy',
                        },
                        {
                            label: 'Maurice Ravel',
                            value: 'Ravel',
                        }
                    ]
                }
            ],
        }
    ];
    return (
        <>
            <Typography.Title heading={6}>single selection</Typography.Title>
            <Cascader
                style={{ width: 300 }}
                treeData={treeData}
                placeholder="Please select"
                displayRender={list => 'Selected：' + list.join(' -> ')}
                defaultValue={['impressionism', 'visualArts', 'Monet']}
            />
            <br />
            <br />
            <Typography.Title heading={6}>multiple selection</Typography.Title>
            <Cascader
                multiple
                style={{ width: 300 }}
                treeData={treeData}
                defaultValue={['impressionism', 'visualArts', 'Monet']}
                placeholder="Please select"
                displayRender={(item, idx) => (
                    <Tag
                        style={{ marginRight: 4 }}
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

### Custom Separator
Version: >=2.2.0

You can use `separator` to set the separator, including: the separator of the content displayed in the dropdown during search and displayed in the Trigger during single selection.

```jsx live=true
import React from 'react';
import { Cascader } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: 'Impressionism',
            value: 'impressionism',
            children: [
                {
                    label: 'Visual Arts',
                    value: 'visualArts',
                    children: [
                        {
                            label: 'Claude Monet',
                            value: 'Monet',
                        },
                        {
                            label: 'Pierre-Auguste Renoir',
                            value: 'Renoir',
                        },
                        {
                            label: 'Édouard Manet',
                            value: 'Manet',
                        },
                    ],
                },
                {
                    label: 'Music',
                    value: 'music',
                    children: [
                        {
                            label: 'Claude Debussy',
                            value: 'Debussy',
                        },
                        {
                            label: 'Maurice Ravel',
                            value: 'Ravel',
                        }
                    ]
                }
            ],
        }
    ];
    return (
        <Cascader
            style={{ width: 400 }}
            treeData={treeData}
            defaultValue={['impressionism', 'visualArts', 'Monet']}
            filterTreeNode
            separator=' > '
        />
    );
};
```

### Disabled

```jsx live=true
import React from 'react';
import { Cascader } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: 'Impressionism',
            value: 'impressionism',
            children: [
                {
                    label: 'Visual Arts',
                    value: 'visualArts',
                    children: [
                        {
                            label: 'Claude Monet',
                            value: 'Monet',
                        },
                        {
                            label: 'Pierre-Auguste Renoir',
                            value: 'Renoir',
                        },
                        {
                            label: 'Édouard Manet',
                            value: 'Manet',
                        },
                    ],
                },
                {
                    label: 'Music',
                    value: 'music',
                    children: [
                        {
                            label: 'Claude Debussy',
                            value: 'Debussy',
                        },
                        {
                            label: 'Maurice Ravel',
                            value: 'Ravel',
                        }
                    ]
                }
            ],
        }];
    return (
        <div>
            <Cascader
                style={{ width: 400 }}
                treeData={treeData}
                placeholder="Please select"
                disabled
            />
            <br />
            <br />
            <Cascader
                style={{ width: 400 }}
                treeData={treeData}
                placeholder="Please select"
                defaultValue={['impressionism', 'music', 'Debussy']}
                filterTreeNode
                disabled
            />
        </div>
    );
};
```

### Disable Strictly

version: >= 1.32.0

You can use disableStrictly to enable strict disabling. After enabling strict disabling, when the node is disabled, the selected state cannot be changed through the relationship between the child or the parent.

Take the following demo as an example, the node "Music" is strictly disabled. Therefore, when we change the selected state of its parent node "Impressionism", it will not affect the selected state of the node "Music".

```jsx live=true
import React from 'react';
import { Cascader } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: 'Impressionism',
            value: 'impressionism',
            children: [
                {
                    label: 'Visual Arts',
                    value: 'visualArts',
                    children: [
                        {
                            label: 'Claude Monet',
                            value: 'Monet',
                        },
                        {
                            label: 'Pierre-Auguste Renoir',
                            value: 'Renoir',
                        },
                        {
                            label: 'Édouard Manet',
                            value: 'Manet',
                        },
                    ],
                },
                {
                    label: 'Music',
                    value: 'music',
                    disabled: true,
                    children: [
                        {
                            label: 'Claude Debussy',
                            value: 'Debussy',
                        },
                        {
                            label: 'Maurice Ravel',
                            value: 'Ravel',
                        }
                    ]
                }
            ],
        }];
    return (
        <Cascader
            style={{ width: 300 }}
            treeData={treeData}
            multiple
            placeholder="Please select..."
            disableStrictly
        />
    );
};
```

### the Way of Expand Menu

version: >= 1.29.0

You can use `showNext` to set the time to expand the Dropdown submenu, optional: `click` (default), `hover`.

```jsx live=true
import React from 'react';
import { Cascader } from '@douyinfe/semi-ui';

() => {
    const treeData = [
        {
            label: 'Impressionism',
            value: 'impressionism',
            children: [
                {
                    label: 'Visual Arts',
                    value: 'visualArts',
                    children: [
                        {
                            label: 'Claude Monet',
                            value: 'Monet',
                        },
                        {
                            label: 'Pierre-Auguste Renoir',
                            value: 'Renoir',
                        },
                        {
                            label: 'Édouard Manet',
                            value: 'Manet',
                        },
                    ],
                },
                {
                    label: 'Music',
                    value: 'music',
                    children: [
                        {
                            label: 'Claude Debussy',
                            value: 'Debussy',
                        },
                        {
                            label: 'Maurice Ravel',
                            value: 'Ravel',
                        }
                    ]
                }
            ],
        }];
    return (
        <Cascader
            style={{ width: 400 }}
            treeData={treeData}
            placeholder="Please select"
            showNext="hover"
        />
    );
};
```

### Additional items

We have reserved slots at the top and bottom of the cascade selector. You can set them through bottomSlot or topSlot.

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
            label: 'Impressionism',
            value: 'impressionism',
            children: [
                {
                    label: 'Visual Arts',
                    value: 'visualArts',
                    children: [
                        {
                            label: 'Claude Monet',
                            value: 'Monet',
                        },
                        {
                            label: 'Pierre-Auguste Renoir',
                            value: 'Renoir',
                        },
                        {
                            label: 'Édouard Manet',
                            value: 'Manet',
                        },
                    ],
                },
                {
                    label: 'Music',
                    value: 'music',
                    children: [
                        {
                            label: 'Claude Debussy',
                            value: 'Debussy',
                        },
                        {
                            label: 'Maurice Ravel',
                            value: 'Ravel',
                        }
                    ]
                }
            ],
        }];
    return (
        <Cascader
            style={{ width: 300 }}
            treeData={treeData}
            placeholder="Please select"
            bottomSlot={
                <div style={slotStyle}>
                    <Text>{`Can't find a relevant option?`}</Text>
                    <Text link>Go to create</Text>
                </div>
            }
        />
    );
};

```

### Controlled Component

You can use `value` along with `onChange` property if you want to use Cascader as a controlled component.

```jsx live=true
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
        this.setState({ value });
    }
    render() {
        const treeData = [
            {
                label: 'Impressionism',
                value: 'impressionism',
                children: [
                    {
                        label: 'Visual Arts',
                        value: 'visualArts',
                        children: [
                            {
                                label: 'Claude Monet',
                                value: 'Monet',
                            },
                            {
                                label: 'Pierre-Auguste Renoir',
                                value: 'Renoir',
                            },
                            {
                                label: 'Édouard Manet',
                                value: 'Manet',
                            },
                        ],
                    },
                    {
                        label: 'Music',
                        value: 'music',
                        children: [
                            {
                                label: 'Claude Debussy',
                                value: 'Debussy',
                            },
                            {
                                label: 'Maurice Ravel',
                                value: 'Ravel',
                            }
                        ]
                    }
                ],
            }];
        return (
            <Cascader
                style={{ width: 400 }}
                treeData={treeData}
                placeholder="Please select"
                value={this.state.value}
                onChange={e => this.onChange(e)}
            />
        );
    }
}
```


### Auto Merge Value

In the multi-selection (multiple=true) scenario, when we select the ancestor node, if we want the value not to include its corresponding descendant nodes, we can set it by `autoMergeValue`, and the default is true. When `autoMergeValue` and `leafOnly` are turned on at the same time, the latter has a higher priority.

```jsx live=true
import React, { useState } from 'react';
import { Cascader } from '@douyinfe/semi-ui';

() => {
    const [value, setValue] = useState(['impressionism', 'visualArts']);
    const onChange = value => {
        setValue(value);
    };
    const treeData = [
        {
            label: 'Impressionism',
            value: 'impressionism',
            children: [
                {
                    label: 'Visual Arts',
                    value: 'visualArts',
                    children: [
                        {
                            label: 'Claude Monet',
                            value: 'Monet',
                        },
                        {
                            label: 'Pierre-Auguste Renoir',
                            value: 'Renoir',
                        },
                        {
                            label: 'Édouard Manet',
                            value: 'Manet',
                        },
                    ],
                },
                {
                    label: 'Music',
                    value: 'music',
                    children: [
                        {
                            label: 'Claude Debussy',
                            value: 'Debussy',
                        },
                        {
                            label: 'Maurice Ravel',
                            value: 'Ravel',
                        }
                    ]
                }
            ],
        }
    ];
    return (
        <Cascader
            style={{ width: 300 }}
            treeData={treeData}
            placeholder="Please select"
            value={value}
            multiple
            autoMergeValue={false}
            onChange={e => onChange(e)}
        />
    );
};
```

### Leaf Only
version: >=2.2.0

In multiple selection, you can set the value to include only leaf nodes by turning on leafOnly, that is, the displayed Tag and onChange parameter values only include value. 

```jsx live=true
import React, { useState } from 'react';
import { Cascader } from '@douyinfe/semi-ui';

() => {
    const [value, setValue] = useState(['impressionism', 'visualArts']);
    const onChange = value => {
        setValue(value);
    };
    const treeData = [
        {
            label: 'Impressionism',
            value: 'impressionism',
            children: [
                {
                    label: 'Visual Arts',
                    value: 'visualArts',
                    children: [
                        {
                            label: 'Claude Monet',
                            value: 'Monet',
                        },
                        {
                            label: 'Pierre-Auguste Renoir',
                            value: 'Renoir',
                        },
                        {
                            label: 'Édouard Manet',
                            value: 'Manet',
                        },
                    ],
                },
                {
                    label: 'Music',
                    value: 'music',
                    children: [
                        {
                            label: 'Claude Debussy',
                            value: 'Debussy',
                        },
                        {
                            label: 'Maurice Ravel',
                            value: 'Ravel',
                        }
                    ]
                }
            ],
        }
    ];
    return (
        <Cascader
            style={{ width: 300 }}
            treeData={treeData}
            placeholder="Please select"
            value={value}
            multiple
            leafOnly
            onChange={e => onChange(e)}
        />
    );
};
```

### Dynamic Update of Data

```jsx live=true
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
                    style={{ width: 400 }}
                    treeData={this.state.treeData}
                    placeholder="Please select"
                />
                <br/>
                <br/>
                <Button onClick={this.add}>
                    Update Data
                </Button>
            </>
        );
    }
}
```

### Deep & long list

When your data structure level is particularly deep, the Cascader drop-down menu may be at the top of the screen. At this time, we recommend setting overflow -x: auto and a suitable width for the drop-down menu (it is recommended to use a width of N+0.5 columns, the most Expand to display half a column to give users a visual cue that they can scroll in the horizontal direction)

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

### Load Async Data
You could use `loadData` to load data asynchronously.
**v>=1.8.0**  
**Could not be used together with searching**

```jsx live=true
import React, { useState } from 'react';
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


### Custom Trigger

If the default trigger style cannot meet your needs, you can use `triggerRender` to customize the display of the select box

The parameters of triggerRender are as follows


```typescript
interface TriggerRenderProps {
    /* All props passed to Cascader by users */
    componentProps: CascaderProps;
    /* Whether to disable Cascader */
    disabled: boolean;
    /**
     * The hierarchical position of the selected node in treeData,
     *  as in the following example, when "Asia-China-Beijing" is 
     *  selected, the value here is 0-0-1
     */
    value?: string | Set<string>;
    /* The input value of the current Input box */
    inputValue: string;
    /**
     * The function used to update the value of the input box. You
     *  should call this function when the value of the Input component
     *  customized by triggerRender is updated to synchronize the
     *  state with Cascader
     */
    onChange: (inputValue: string) => void;
    /* Function to clear the value */
    onClear: () => void;
    /* Placeholder of Cascader */
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
            label: 'Asia',
            value: 'asia',
            children: [
                {
                    label: 'China',
                    value: 'china',
                    children: [
                        {
                            label: 'Guangdong',
                            value: 'guangdong',
                        },
                        {
                            label: 'Beijing',
                            value: 'beijing',
                        },
                        {
                            label: 'Shanghai',
                            value: 'shanghai',
                        },
                    ],
                },
                {
                    label: 'Koera',
                    value: 'koera',
                    children: [
                        {
                            label: 'Seoul',
                            value: 'seoul',
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


## API reference

### Cascader

| Properties | Instructions | type | Default | version |
| ---------- | ------------ | ---- | ------- | ------- |
| arrowIcon | Customize the right drop-down arrow Icon, when the showClear switch is turned on and there is currently a selected value, hover will give priority to the clear icon  | ReactNode | - | 1.15.0 |
| autoAdjustOverflow | Whether to automatically adjust the expansion direction of the dropdown for automatic adjustment of the expansion direction during edge occlusion | boolean | true | - |
| autoMergeValue | Auto merge value. Specifically, after opening, when a parent node is selected, the value will not include the descendants of the node. Does not support dynamic switching | boolean | true |  1.28.0 |
| bottomSlot | bottom slot | ReactNode | - |  1.27.0 |
| changeOnSelect | Toggle whether non-leaf nodes are selectable | boolean | false | - |
| className | ClassName | string | - | - |
| clearIcon | Can be used to customize the clear button, valid when showClear is true | ReactNode | - | 2.25.0 |
| defaultOpen | Set whether to open the dropDown by default | boolean | false | - |
| defaultValue | Default selected value | string\|number\|CascaderData\|(string\|number\|CascaderData)[] | - | -  |
| disabled | Makes the element disabled | boolean | false | - |
| displayProp | Set the attribute value displayed by the backfill option displayed | string | `label` | - |
| displayRender | Set the backfill format value | (selected: string[] \| Entity, idx?: number) => ReactNode | selected => selected.join ('/') | -  |
| dropdownClassName  | ClassName property for the drop-down menu  | string | - | - |
| dropdownMargin | Popup layer calculates the size of the safe area when the current direction overflows, used in scenes covered by fixed elements, more detail refer to [issue#549](https://github.com/DouyinFE/semi-design/issues/549), same as Tooltip margin | object\|number | - | 2.25.0 |
| dropdownStyle | Inline style of drop-down menu  | object  | - | -  |
| emptyContent | Content displayed when the search has no result | ReactNode | `No result`  | - |
| filterLeafOnly |  Whether the search results only show the path of leaf nodes   | boolean  | true | 1.26.0  |
| filterTreeNode | Set filter, the value of treeNodeFilterProp is used for searching | ((inputValue: string, treeNodeString: string, data?: CascaderData) => boolean) \| boolean | false | - |
| filterRender | Used to render filtered options | (props: FilterRenderProps) => ReactNode; | - | 2.28.0 |
| filterSorter | Sort the filtered options | (first: CascaderData, second: CascaderData, inputValue: string) => number | - | 2.28.0 |
| getPopupContainer | Specify the parent DOM, the drop-down box will be rendered into the DOM, the customization needs to set position: relative |() => HTMLElement|() => document.body|-|
| insetLabel | Prefix alias, used mainly in Form | ReactNode | - | 0.28.0 |
| leafOnly | When multiple selections, the set value only includes leaf nodes, that is, the displayed Tag and onChange value parameters only include leaf nodes. Does not support dynamic switching | boolean | false | 2.2.0  |
| loadData | Load data asynchronously and the return value should be a promise | (selectOptions: CascaderData[]) => Promise< void > |-| 1.8.0|
| max| In the case of multiple selections, the number of multiple selections is limited, and the onExceed callback will be triggered when max is exceeded | number |-|1.28.0|
| maxTagCount| When multiple selections, the maximum number of labels to be displayed will be displayed in the form of +N after exceeding| number |-|1.28.0|
| motion | Set the pop-up animation of the dropdown box |boolean|true|-|
| mouseEnterDelay | After the mouse is moved in, the time to delay the display of the dropdown box, in milliseconds | number | 50 | - |
| mouseLeaveDelay | After the mouse is moved out, the time to hide the display of the dropdown box, in milliseconds | number | 50 | - |
| multiple | Set multiple | boolean | false |  1.28.0 |
| placeholder | Placeholder | string | - | - |
| prefix | Prefix label | ReactNode | - | 0.28.0  |
| preventScroll | Indicates whether the browser should scroll the document to display the newly focused element, acting on the focus method inside the component, excluding the component passed in by the user | boolean | - | 2.15.0 |
|restTagsPopoverProps |The configuration properties of the [Popover](/en-US/show/popover#API%20Reference) |PopoverProps   | {}  |1.28.0|
| searchPlaceholder  | Placeholder for search input | string | - | -  |
| separator  | Custom separator, including: the separator of the content displayed in the dropdown during search and displayed in the Trigger during single selection | string| ` / ` | 2.2.0 |
| showClear |  Toggle whether to show clear button   | boolean  | false | 0.35.0 |
| showNext| Set the way to expand the Dropdown submenu, one of: `click`、`hover` | string |`click`|1.29.0|
| showRestTagsPopover| When the number of tags exceeds maxTagCount and hover reaches +N, whether to display the remaining content through Popover| boolean |false|1.28.0|
| size | Selectbox size, one of `large`, `small`, `default`  | string | `default`  | - |
| stopPropagation | Whether to prevent the click event on the dropdown box from bubbling | boolean | true | - |
| disableStrictly | Set whether to enable strict prohibition. After opening, when the node is disabled, the selected state cannot be changed through the relationship between the child or the parent | boolean | false | 1.32.0|
| style | Inline style | CSSProperties | - | - |
| suffix | Suffix label | ReactNode | -  | 0.28.0  |
| topSlot | top slot | ReactNode | - |  1.27.0 |
| treeData | Render data. Refer to [CascaderData](#CascaderData)  for detailed formatting. | CascaderData[] |  []  | - |
| treeNodeFilterProp | When searching, the input item filters the corresponding CascaderData property. | string | `label`   | - |
| triggerRender | Method to create a custom trigger  | (triggerRenderData: object) => ReactNode | - | 0.34.0 |
| value | Selected value (controlled mode) | string\|number\|CascaderData\|(string\|number\|CascaderData)[][]  | - | -  |
| validateStatus |The validation status of the trigger only affects the display style. Optional: default、error、warning | string | `default` | - |
| zIndex | zIndex for dropdown menu | number | 1030 | - |
| enableLeafClick | Multiple mode, click the leaf option enable trigger check | boolean | false | 2.2.0 |
| onBlur | Out of focus Cascader's callback | (e: MouseEvent) => void | - | - |
| onChange | Callback function when the tree node is selected | (value: string\|number\|CascaderData\|(string\|number\|CascaderData)[]) => void | - | - |
| onClear| When showClear is true, click the clear button to trigger the callback | () => void |-|1.29.0|
| onChangeWithObject | Toggle whether to return all properties in an option as a return value. When set to true, return value looks like CascaderData. For controlled mode, you need to pass CascaderData to value correspondingly. DefaultValue similarly. | boolean | false | 1.16.0 |
| onDropdownVisibleChange | Callback function when dropdown menu visibility changes   | (visible: boolean) => void | - | 0.35.0 |
| onExceed| When multiple selections are made, the callback triggered after max is exceeded | (checkedItem: Entity[]) => void |-|1.28.0|
| onFocus| Focus on Cascader's callback | (e: MouseEvent) => void | - | - |
| onListScroll | Callback function when panel list scroll | (e: React.Event, panel: { panelIndex: number; activeNode: CascaderData; } ) => void | - | 1.15.0 |
| onLoad | Callback function when a node is loaded | (newLoadedKeys: Set< string >, data: CascaderData) => void | - | 1.8.0|
| onSearch | Callback function when the values for search input changes | (value: string) => void | - | - |
| onSelect | Callback function when selected | (value: string \| number \| (string \| number)[]) => void | - | - |

### CascaderData

| Properties | Instructions                   | type           | Default |
| ---------- | -------------------------------| -------------- | ------- |
| children   | children node                  | CascaderData[]     | -       |
| disabled   | Disabled status **>=0.35.0**   | boolean        | -       |
| isLeaf     | leaf node                      | boolean        | -       |
| label      | Text to be displayed (required)| ReactNode      | -       |
| loading    | loading                        | boolean        | -       |
| value      | Value property (required)      | string\|number | -       |

## Accessibility

### ARIA

- Cascader supports importing `aria-label`, `aria-describedby`, `aria-errormessage`, `aria-invalid`, `aria-labelledby`, `aria-required` to indicate the relevant information of the Cascader;
- Cascader supports selecting options, clearing options, and expanding drop-down box by pressing the Enter key

## Design Tokens
<DesignToken/>
