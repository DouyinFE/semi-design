import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { Icon, Button, Form, Popover, Tag } from '../../index';
import TreeSelect from '../index';
import { flattenDeep } from 'lodash';
import CustomTrigger from './CustomTrigger';
import { IconCreditCard } from '@douyinfe/semi-icons';
const TreeNode = TreeSelect.TreeNode;

const stories = storiesOf('TreeSelect', module);

const treeData1 = [
    {
        label: 'Node1',
        value: '0-0',
        key: '0-0',
        children: [
            {
                label: 'Child Node1',
                value: '0-0-1',
                key: '0-0-1',
            },
            {
                label: 'Child Node2',
                value: '0-0-2',
                key: '0-0-2',
            },
        ],
    },
    {
        label: 'Node2',
        value: '0-1',
        key: '0-1',
    },
];

const treeData2 = [
    {
        label: '亚洲',
        value: 'yazhou',
        key: 'yazhou',
        children: [
            {
                label: '中国',
                value: 'zhongguo',
                key: 'zhongguo',
                children: [
                    {
                        label: '北京',
                        value: 'beijing',
                        key: 'beijing',
                    },
                    {
                        label: '上海',
                        value: 'shanghai',
                        key: 'shanghai',
                    },
                ],
            },
            // {
            //     label: '日本',
            //     value: 'riben',
            //     key: 'riben',
            //     children: [
            //         {
            //             label: '东京',
            //             value: 'dongjing',
            //             key: 'dongjing'
            //         },
            //         {
            //             label: '大阪',
            //             value: 'daban',
            //             key: 'daban'
            //         }
            //     ]
            // },
        ],
    },
    {
        label: '北美洲',
        value: 'beimeizhou',
        key: 'beimeizhou',
        children: [
            {
                label: '美国',
                value: 'meiguo',
                key: 'meiguo',
            },
            {
                label: '加拿大',
                value: 'jianada',
                key: 'jianada',
            },
        ],
    },
];

const treeDataWithoutValue = [
    {
        label: '亚洲',
        key: 'yazhou',
        children: [
            {
                label: '中国',
                key: 'zhongguo',
                disabled: true,
                children: [{
                    label: '北京',
                    key: 'beijing',
                },
                {
                    label: '上海',
                    key: 'shanghai',
                }]
            },
            {
                label: '日本',
                key: 'riben',
                children: [
                    {
                        label: '东京',
                        key: 'dongjing',
                    },
                    {
                        label: '大阪',
                        key: 'daban',
                    },
                ],
            },
        ],
    },
    {
        label: '北美洲',
        key: 'beimeizhou',
        children: [
            {
                label: '美国',
                key: 'meiguo',
            },
            {
                label: '加拿大',
                key: 'jianada',
            },
        ],
    },
];

// stories.addDecorator(withKnobs);;

class SimpleTree extends React.Component {
    render() {
        return (
            <div>
                <TreeSelect
                    style={{ width: 300 }}
                    // value={this.state.value}
                    dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                    treeData={treeData1}
                    placeholder="Please select"
                    onExpand={(e, { expanded, node }) => console.log('expand', e, expanded, node)}
                    onSelect={(e, bool) => console.log('select', e, bool)}
                    onChange={(e, node) => console.log('change', e, node)}
                />
                <br />
                <br />
                <TreeSelect
                    style={{ width: 300 }}
                    // value={this.state.value}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={treeData2}
                    placeholder="Please select"
                />
            </div>
        );
    }
}

// stories.add('tree select', () => <SimpleTree />);
stories.add('tree select', () => {
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
        },
    ];
    return (
        <TreeSelect
            style={{ width: 300 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            placeholder="请选择"
        />
    );
});

// stories.add('large tree', () => (
//     <div>
//         <TreeSelect
//             dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
//             treeData={treeData}
//             multiple
//             // motion={false}
//             treeNodeFilterProp='value'
//             placeholder="Please select"
//         />
//     </div>
// ));

stories.add('searchable', () => (
    <div>
        <TreeSelect
            style={{ width: 300 }}
            // value={this.state.value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            filterTreeNode
            treeNodeFilterProp="value"
            placeholder="Please select"
        />
        <br />
        <br />
        <TreeSelect
            style={{ width: 300 }}
            // value={this.state.value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            filterTreeNode
            placeholder="Please select"
        />
        <br />
        <br />
        <TreeSelect
            style={{ width: 300 }}
            // value={this.state.value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            filterTreeNode
            searchAutoFocus
            placeholder="searchAutoFocus"
        />
    </div>
));


stories.add('searchPosition', () => (
    <>
        <TreeSelect
            searchPosition="trigger"
            style={{ width: 300 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            filterTreeNode
            placeholder="单选"
        />
        <br />
        <br />
        <TreeSelect
            searchPosition="trigger"
            style={{ width: 300 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            multiple
            filterTreeNode
            maxTagCount={2}
            placeholder="多选"
        />
        <br />
        <br />
        <TreeSelect
            searchPosition="trigger"
            style={{ width: 300 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            multiple
            filterTreeNode
            maxTagCount={2}
            placeholder="searchAutoFocus"
            searchAutoFocus
        />
    </>
));

stories.add('prefix suffix insetLabel', () => (
    <div>
        <TreeSelect
            style={{ width: 300 }}
            // value={this.state.value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            filterTreeNode
            prefix={<IconCreditCard />}
            treeNodeFilterProp="value"
            placeholder="Please select"
        />
        <br />
        <br />
        <TreeSelect
            style={{ width: 300 }}
            // value={this.state.value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            filterTreeNode
            prefix={<span>1234</span>}
            treeNodeFilterProp="value"
            placeholder="Please select"
        />
        <br />
        <br />
        <TreeSelect
            style={{ width: 300 }}
            suffix="RMB"
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            placeholder="Please select"
        />
        <br />
        <br />
        <TreeSelect
            style={{ width: 300 }}
            insetLabel="blablabla"
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            placeholder="Please select"
        />
        <br />
        <br />
        <TreeSelect
            style={{ width: 300 }}
            insetLabel={<span>1234</span>}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            placeholder="Please select"
        />
    </div>
));

stories.add('validate status', () => (
    <div>
        <TreeSelect
            style={{ width: 300 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            multiple
            validateStatus="warning"
            placeholder="Please select"
            onExpand={(e, { expanded, node }) => console.log('expand', e, expanded, node)}
            onSelect={(e, bool) => console.log('select', e, bool)}
            onChange={e => console.log('change', e)}
        />
        <br />
        <br />
        <TreeSelect
            style={{ width: 300 }}
            validateStatus="error"
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            // multiple
            placeholder="Please select"
        />
    </div>
));

stories.add('multiple', () => (
    <div>
        <TreeSelect
            style={{ width: 300 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            multiple
            placeholder="Please select"
            onExpand={(e, { expanded, node }) => console.log('expand', e, expanded, node)}
            onSelect={(e, bool) => console.log('select', e, bool)}
            onChange={e => console.log('change', e)}
        />
        <br />
        <br />
        <TreeSelect
            style={{ width: 300 }}
            // value={this.state.value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            multiple
            placeholder="Please select"
        />
    </div>
));

stories.add('maxTagCount', () => (
    <div>
        <TreeSelect
            style={{ width: 300 }}
            // value={this.state.value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            multiple
            maxTagCount={2}
            placeholder="Please select"
        />
        {/* <br />
        <br />
        <TreeSelect
            style={{ width: 300 }}
            // value={this.state.value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            multiple
            placeholder="Please select"
        /> */}
    </div>
));

stories.add('multiple searchable', () => (
    <div>
        <TreeSelect
            style={{ width: 300 }}
            // value={this.state.value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            multiple
            filterTreeNode
            treeNodeFilterProp="value"
            placeholder="Please select"
        />
    </div>
));

stories.add('default values', () => (
    <div>
        <TreeSelect
            style={{ width: 300 }}
            defaultValue={'shanghai'}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            // multiple
            filterTreeNode
            treeNodeFilterProp="value"
        />
        <br />
        <br />
        <TreeSelect
            style={{ width: 300 }}
            defaultValue={'shanghai'}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            filterTreeNode
            multiple
            treeNodeFilterProp="value"
        />
        <br />
        <br />
        <TreeSelect
            style={{ width: 300 }}
            defaultValue={['shanghai', 'daban', 'dongjing']}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            filterTreeNode
            multiple
            treeNodeFilterProp="value"
        />
        <br />
        <br />
        <TreeSelect
            style={{ width: 300 }}
            defaultValue={['meiguo', 'dongjing']}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            filterTreeNode
            multiple
            treeNodeFilterProp="value"
        />
    </div>
));

stories.add('disabled', () => (
    <div>
        <TreeSelect
            style={{ width: 300 }}
            defaultValue={'shanghai'}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            multiple
            filterTreeNode
            disabled
            treeNodeFilterProp="value"
            placeholder="Please select"
        />
        <br />
        <br />
        <TreeSelect
            style={{ width: 300 }}
            defaultValue={'shanghai'}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            filterTreeNode
            disabled
            treeNodeFilterProp="value"
            placeholder="Please select"
        />
        <br />
        <br />
        <TreeSelect
            style={{ width: 300 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            multiple
            filterTreeNode
            disabled
            treeNodeFilterProp="value"
            placeholder="Please select"
        />
    </div>
));

stories.add('optionLabelProp', () => (
    <>
        <TreeSelect
            style={{ width: 300 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            multiple
            filterTreeNode
            treeNodeFilterProp="value"
            treeNodeLabelProp="value"
            placeholder="Please select"
        />
    </>
));

stories.add('valueInArray', () => (
    <>
        <TreeSelect
            style={{ width: 300 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            multiple
            filterTreeNode
            valueInArray
            onChange={(...args) => console.log(args)}
            treeNodeFilterProp="value"
            treeNodeLabelProp="value"
            placeholder="Please select"
        />
    </>
));

stories.add('onBlur/onFocus', () => (
    <>
        <div>single</div>
        <TreeSelect
            style={{ width: 300 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            onBlur={(...args) => console.log('blur', args)}
            onFocus={(...args) => console.log('focus', args)}
            placeholder="Please select"
        />
        <div>multiple</div>
        <TreeSelect
            style={{ width: 300 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            multiple
            onBlur={(...args) => console.log('blur', args)}
            onFocus={(...args) => console.log('focus', args)}
            placeholder="Please select"
        />
    </>
));

stories.add('leafOnly', () => (
    <div>
        <TreeSelect
            style={{ width: 300 }}
            // value={this.state.value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData2}
            multiple
            leafOnly
            placeholder="Please select"
            onExpand={(e, { expanded, node }) => console.log('expand', e, expanded, node)}
            onSelect={(e, bool) => console.log('select', e, bool)}
            onChange={e => console.log('change', e)}
        />
    </div>
));

class Demo extends React.Component {
    constructor() {
        super();
        this.state = {
            value: 'shanghai',
        };
    }
    onChange(value) {
        this.setState({ value });
    }
    render() {
        return (
            <TreeSelect
                style={{ width: 300 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData2}
                value={this.state.value}
                placeholder="Please select"
                onChange={e => this.onChange(e)}
            />
        );
    }
}

stories.add('controlled Component single', () => <Demo />);

class Demo2 extends React.Component {
    constructor() {
        super();
        this.state = {
            value: ['Shanghai'],
        };
    }
    onChange(value) {
        this.setState({ value });
    }
    render() {
        console.log(this.state.value);
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
            },
        ];
        return (
            <TreeSelect
                style={{ width: 300 }}
                multiple
                dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                treeData={treeData}
                value={this.state.value}
                placeholder="Please select"
                onChange={e => this.onChange(e)}
            />
        );
    }
}

stories.add('controlled Component multiple', () => <Demo2 />);

class Demo3 extends React.Component {
    constructor() {
        super();
        this.state = {
            value: ['Shanghai'],
        };
    }
    // 获取最底层值
    getDeepChildrensByNode = node => {
        return flattenDeep(
            node.map(item => {
                if (item.children) {
                    return this.getDeepChildrensByNode(item.children);
                }
                return item.value;
            })
        );
    };

    onChange(value, node) {
        console.log('onchange', value);
        value = this.getDeepChildrensByNode(node);
        console.log('modifiled', value);
        this.setState({ value });
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
            },
        ];
        return (
            <TreeSelect
                style={{ width: 300 }}
                multiple
                dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                treeData={treeData}
                value={this.state.value}
                placeholder="Please select"
                onChange={(e, node) => this.onChange(e, node)}
            />
        );
    }
}

stories.add('controlled Component multiple value modified', () => <Demo3 />);

class ConvertDemo extends React.Component {
    constructor(props) {
        super(props);
        this.formApi = null;
    }
    handleChange = val => {
        let finalVal = val;
        let firstClassOption = ['Asia', 'North America'];
        // 在这里去做你的value替换逻辑
        console.log('originVal:' + val);
        if (val.length === 1) {
            // do nothing
        } else {
            if (val.every(item => firstClassOption.includes(item))) {
                finalVal = val[val.length - 1];
            }
        }
        console.log('finalVal:' + finalVal);
        return finalVal;
    };
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
            },
        ];
        return (
            <Form getFormApi={this.getFormApi}>
                <Form.TreeSelect
                    field="tree"
                    label="节点（TreeSelect）"
                    placeholder="请选择服务节点"
                    treeData={treeData}
                    convert={this.handleChange}
                    filterTreeNode
                    multiple
                ></Form.TreeSelect>
            </Form>
        );
    }
}

stories.add('convert demo', () => <ConvertDemo />);

stories.add('treeselect defaultOpen in popover', () => (
    <Popover
        content={
            <TreeSelect
                style={{ width: 200 }}
                dropdownStyle={{ width: 200 }}
                treeData={treeData1}
                defaultOpen
            // value={this.state.value}
            // placeholder="Please select"
            // onChange={(e, node) => this.onChange(e, node)}
            />
        }
    >
        <Button style={{ marginLeft: 150 }}>悬停此处</Button>
    </Popover>
));

stories.add(`custom trigger`, () => <CustomTrigger />);


const AutoParentDemo = () => {
    const [expandedKeys, setExpandedKeys] = useState(['beimeizhou']);
    const [selectedKeys, setSelectedKeys] = useState(['beimeizhou']);
    const [autoExpandParent, setAutoExpandParent] = useState(true);

    const onExpand = expandedKeys => {
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        setExpandedKeys(expandedKeys);
        setAutoExpandParent(false);
    };

    const onSelect = (selectedKeys, info) => {
        console.log('onSelect:', info);
        setSelectedKeys(selectedKeys);
    };

    return (
        <div>
            <Button onClick={() => {
                setSelectedKeys(['beijing']);
                setExpandedKeys(['beijing']);
                setAutoExpandParent(true);
            }}>Update</Button>
            <TreeSelect
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onChange={onSelect}
                value={selectedKeys}
                treeData={treeData2}
            // multiple
            />
        </div>
    );
};

stories.add('autoExpandParent', () => (
    <>
        <AutoParentDemo />
    </>
));

stories.add('tree without value props', () => (
    <TreeSelect
        treeData={treeDataWithoutValue}
        value="beijing"
        defaultExpandAll
        onChange={(...args) => console.log(args)}
    />
));

stories.add('treeSelect renderSelectedItem', () => {
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
    ];

    return (
        <>
            <h4>单选</h4>
            <TreeSelect
                style={{ width: 300 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                placeholder="请选择"
                renderSelectedItem={item => `${item.value}-${item.label}`}
            />
            <h4>多选</h4>
            <TreeSelect
                style={{ width: 300 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                multiple
                placeholder="请选择"
                renderSelectedItem={(item, { index, onClose }) => ({ content: `${item.value}-${item.label}`, isRenderInTag: true })}
            />
            <h4>多选 + isRenderInTag=false</h4>
            <TreeSelect
                style={{ width: 300 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                multiple
                maxTagCount={2}
                placeholder="请选择"
                renderSelectedItem={(item, { index, onClose }) => ({ content: <Tag key={index} color="white">{item.value}</Tag>, isRenderInTag: false })}
            />
        </>
    )
}
);

const DisableStrictlyDemo = () => {
    const [value, setValue] = useState(['Shanghai'])
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
    ]
    return (
        <div>
            <TreeSelect
                style={{ width: 300 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                disableStrictly
                multiple
                searchPosition="trigger"
                filterTreeNode
                value={value}
                onChange={value=>setValue(value)}
            />
        </div>
    )
}

stories.add('disabledStrictly', () => (
    <>
        <DisableStrictlyDemo />
    </>
));