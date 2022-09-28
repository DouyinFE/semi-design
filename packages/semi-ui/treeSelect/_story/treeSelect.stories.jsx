import React, { useState } from 'react';
import { Icon, Button, Form, Popover, Tag, Typography, CheckboxGroup } from '../../index';
import TreeSelect from '../index';
import { flattenDeep } from 'lodash';
import CustomTrigger from './CustomTrigger';
import { IconCreditCard } from '@douyinfe/semi-icons';
const TreeNode = TreeSelect.TreeNode;
const { Title } = Typography;

export default {
  title: 'TreeSelect',
  parameters: {
    chromatic: { disableSnapshot: true },
  },
}

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
        children: [
          {
            label: '北京',
            key: 'beijing',
          },
          {
            label: '上海',
            key: 'shanghai',
          },
        ],
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

export const TreeSelectWrapper = () => (
  <div>
    <div>github issue 750 修改测试用例</div>
    <CheckboxGroup>
      <TreeSelect
        showClear={true}
        expandAll
        style={{width: 400}}
        treeData={[
            {
                key: '1',
                label: '所有节点',
                value: '1',
                children: [
                    { key: '20006251', label: 'Semi', value: 'semi@bytedance.com' },
                    { key: '20006248', label: 'Design', value: 'design@bytedance.com' },
                    {
                        key: '20006205',
                        label: 'React',
                        value: 'react@bytedance.com',
                    },
                ],
            },
            ]}
        multiple
        filterTreeNode
        showFilteredOnly={true}
        leafOnly
      />
  </CheckboxGroup>
  </div>
);

TreeSelectWrapper.story = {
  name: 'treeSelect wrapper',
};

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

export const _TreeSelect = () => {
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
};

_TreeSelect.story = {
  name: 'tree select',
};

export const Searchable = () => (
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
);

Searchable.story = {
  name: 'searchable',
};

export const SearchPosition = () => (
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
    <br />
    <br />
    <TreeSelect
      searchPosition="trigger"
      style={{ width: 300 }}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      treeData={treeData2}
      multiple
      filterTreeNode
      maxTagCount={1}
      placeholder="maxTagCount=1"
    />
  </>
);

SearchPosition.story = {
  name: 'searchPosition',
};

export const PrefixSuffixInsetLabel = () => (
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
);

PrefixSuffixInsetLabel.story = {
  name: 'prefix suffix insetLabel',
};
PrefixSuffixInsetLabel.parameters = {
  chromatic: { disableSnapshot: false },
}

export const ValidateStatus = () => (
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
);

ValidateStatus.story = {
  name: 'validate status',
};
ValidateStatus.parameters = {
  chromatic: { disableSnapshot: false },
}

export const Multiple = () => (
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
      defaultOpen
      defaultExpandAll
      motion={false}
      multiple
      placeholder="Please select"
    />
  </div>
);

Multiple.story = {
  name: 'multiple',
};

export const MaxTagCount = () => (
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
);

MaxTagCount.story = {
  name: 'maxTagCount',
};

export const MultipleSearchable = () => (
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
);

MultipleSearchable.story = {
  name: 'multiple searchable',
};

export const DefaultValues = () => (
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
);

DefaultValues.story = {
  name: 'default values',
};

export const Disabled = () => (
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
);

Disabled.story = {
  name: 'disabled',
};
Disabled.parameters = {
  chromatic: { disableSnapshot: false },
}

export const OptionLabelProp = () => (
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
);

OptionLabelProp.story = {
  name: 'optionLabelProp',
};

export const ValueInArray = () => (
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
);

ValueInArray.story = {
  name: 'valueInArray',
};

export const OnBlurOnFocus = () => (
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
);

OnBlurOnFocus.story = {
  name: 'onBlur/onFocus',
};

export const LeafOnly = () => (
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
);

LeafOnly.story = {
  name: 'leafOnly',
};

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

export const ControlledComponentSingle = () => <Demo />;

ControlledComponentSingle.story = {
  name: 'controlled Component single',
};

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

export const ControlledComponentMultiple = () => <Demo2 />;

ControlledComponentMultiple.story = {
  name: 'controlled Component multiple',
};

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

export const ControlledComponentMultipleValueModified = () => <Demo3 />;

ControlledComponentMultipleValueModified.story = {
  name: 'controlled Component multiple value modified',
};

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

export const _ConvertDemo = () => <ConvertDemo />;

_ConvertDemo.story = {
  name: 'convert demo',
};

export const TreeselectDefaultOpenInPopover = () => (
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
);

TreeselectDefaultOpenInPopover.story = {
  name: 'treeselect defaultOpen in popover',
};

export const CustomTriggerDemo = () => <CustomTrigger />;
CustomTriggerDemo.story = { name: 'custom trigger' };

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
      <Button
        onClick={() => {
          setSelectedKeys(['beijing']);
          setExpandedKeys(['beijing']);
          setAutoExpandParent(true);
        }}
      >
        Update
      </Button>
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

export const AutoExpandParent = () => (
  <>
    <AutoParentDemo />
  </>
);

AutoExpandParent.story = {
  name: 'autoExpandParent',
};

export const TreeWithoutValueProps = () => (
  <TreeSelect
    treeData={treeDataWithoutValue}
    value="beijing"
    defaultExpandAll
    onChange={(...args) => console.log(args)}
  />
);

TreeWithoutValueProps.story = {
  name: 'tree without value props',
};

export const TreeSelectRenderSelectedItem = () => {
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
        renderSelectedItem={(item, { index, onClose }) => ({
          content: `${item.value}-${item.label}`,
          isRenderInTag: true,
        })}
      />
      <h4>多选 + isRenderInTag=false</h4>
      <TreeSelect
        style={{ width: 300 }}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={treeData}
        multiple
        maxTagCount={2}
        placeholder="请选择"
        renderSelectedItem={(item, { index, onClose }) => ({
          content: (
            <Tag key={index} color="white">
              {item.value}
            </Tag>
          ),
          isRenderInTag: false,
        })}
      />
    </>
  );
};

TreeSelectRenderSelectedItem.story = {
  name: 'treeSelect renderSelectedItem',
};

const DisableStrictlyDemo = () => {
  const [value, setValue] = useState(['Shanghai']);
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
    },
  ];
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
        onChange={value => setValue(value)}
      />
    </div>
  );
};

export const DisabledStrictly = () => (
  <>
    <DisableStrictlyDemo />
  </>
);

DisabledStrictly.story = {
  name: 'disabledStrictly',
};


export const CheckRelationDemo = () => {
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
  const [value, setValue] = useState('China');
  const [value2, setValue2] = useState();
  const [value3, setValue3] = useState();
  const style = {
    width: 300,
  };
  const dropdownStyle = {
    maxHeight: 400,
    overflow: 'auto'
  };
  const handleChange = value => {
    console.log(value);
    setValue(value);
  };
  const handleChange2 = value => {
    console.log(value);
    setValue2(value);
  };
  const handleChange3 = value => {
    console.log(value);
    setValue3(value);
  };
  return (
    <>
      <div>checkRelation='unRelated'</div>
      <TreeSelect
        dropdownStyle={dropdownStyle}
        treeData={treeData}
        multiple
        checkRelation='unRelated'
        defaultExpandAll
        style={style}
      />
      <br /><br />
      <div>checkRelation='unRelated' + maxTagCount=2</div>
      <TreeSelect
        dropdownStyle={dropdownStyle}
        treeData={treeData}
        multiple
        maxTagCount={2}
        checkRelation='unRelated'
        defaultExpandAll
        style={style}
      />
      <br /><br />
      <div>checkRelation='unRelated' + maxTagCount=2 + 开启搜索</div>
      <TreeSelect
        dropdownStyle={dropdownStyle}
        treeData={treeData}
        multiple
        maxTagCount={2}
        filterTreeNode
        checkRelation='unRelated'
        defaultExpandAll
        style={style}
      />
      <br /><br />
      <div>checkRelation='unRelated' + maxTagCount=2 + 开启搜索 + searchBox in trigger</div>
      <TreeSelect
        dropdownStyle={dropdownStyle}
        treeData={treeData}
        multiple
        maxTagCount={2}
        filterTreeNode
        checkRelation='unRelated'
        searchPosition='trigger'
        defaultExpandAll
        style={style}
      />
      <br /><br />
      <div>checkRelation='unRelated' + 中国节点为 disabled</div>
      <TreeSelect
        dropdownStyle={dropdownStyle}
        treeData={treeDataWithoutValue}
        multiple
        checkRelation='unRelated'
        defaultExpandAll
        style={style}
      />
      <br /><br />
      <div>checkRelation='unRelated' + 中国节点为 disabled + 严格禁用</div>
      <TreeSelect
        dropdownStyle={dropdownStyle}
        treeData={treeDataWithoutValue}
        multiple
        checkRelation='unRelated'
        defaultExpandAll
        disableStrictly
        style={style}
      />
      <br /><br />
      <div>checkRelation='unRelated' + defaultValue 为 China</div>
      <TreeSelect
        dropdownStyle={dropdownStyle}
        treeData={treeData}
        multiple
        checkRelation='unRelated'
        defaultExpandAll
        style={style}
        defaultValue='China'
      />
      <br /><br />
      <div>checkRelation='unRelated' + defaultValue 为 China + 开启搜索</div>
      <TreeSelect
        dropdownStyle={dropdownStyle}
        treeData={treeData}
        multiple
        filterTreeNode
        checkRelation='unRelated'
        defaultExpandAll
        style={style}
        defaultValue='China'
      />
      <br /><br />
      <div>多选 + checkRelation='unRelated' + defaultValue 为 China + 开启搜索 + searchBox in trigger + showClear</div>
      <TreeSelect
        dropdownStyle={dropdownStyle}
        treeData={treeData}
        multiple
        filterTreeNode
        showClear
        checkRelation='unRelated'
        defaultExpandAll
        style={style}
        searchPosition='trigger'
        defaultValue={['China', 'Japan']}
      />
      <br /><br />
      <div>单选 + checkRelation='unRelated' + defaultValue 为 China + 开启搜索 + searchBox in trigger + showClear</div>
      <TreeSelect
        dropdownStyle={dropdownStyle}
        treeData={treeData}
        filterTreeNode
        showClear
        checkRelation='unRelated'
        defaultExpandAll
        style={style}
        searchPosition='trigger'
        defaultValue='China'
      />
      <br /><br />
      <div>checkRelation='unRelated' + 受控 + value 初始为 China</div>
      <TreeSelect
        dropdownStyle={dropdownStyle}
        treeData={treeData}
        multiple
        checkRelation='unRelated'
        defaultExpandAll
        style={style}
        value={value}
        onChange={handleChange}
      />
      <br /><br />
      <div>checkRelation='unRelated' + 受控 + onChangeWithObject</div>
      <TreeSelect
        dropdownStyle={dropdownStyle}
        treeData={treeData}
        multiple
        checkRelation='unRelated'
        defaultExpandAll
        style={style}
        value={value2}
        onChangeWithObject
        onChange={handleChange2}
      />
      <br /><br />
      <div>checkRelation='unRelated' + 受控 + leafOnly，此时 leafOnly 失效</div>
      <TreeSelect
        dropdownStyle={dropdownStyle}
        leafOnly
        treeData={treeData}
        multiple
        checkRelation='unRelated'
        defaultExpandAll
        style={style}
        value={value3}
        onChange={handleChange3}
      />
      <br /><br />
      <div>checkRelation='unRelated' + onSelect </div>
      <TreeSelect
        dropdownStyle={dropdownStyle}
        treeData={treeData}
        multiple
        checkRelation='unRelated'
        defaultExpandAll
        style={style}
        onSelect={(value,status,node)=>console.log('select', value, status, node)}
      />
    </>
  );
};

export const SearchableAndExpandedKeys = () => {
  const [expandedKeys1, setExpandedKeys1] = useState([]);
  const [expandedKeys2, setExpandedKeys2] = useState([]);
  const [expandedKeys3, setExpandedKeys3] = useState([]);
  return (
      <>
          <Title heading={6}>expandedKeys 受控</Title>
          <TreeSelect
              style={{ width: 300, marginBottom: 30 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={treeData2}
              expandedKeys={expandedKeys1}
              defaultValue='beijing'
              onExpand={v => {
                  console.log('onExpand value: ', v);
                  setExpandedKeys1(v);
              }}
          />
          <Title heading={6}>expandedKeys 受控 + 开启搜索</Title>
          <TreeSelect
              style={{ width: 300, marginBottom: 30 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={treeData2}
              filterTreeNode
              defaultValue='beijing'
              expandedKeys={expandedKeys2}
              onExpand={v => {
                  console.log('onExpand value: ', v);
                  setExpandedKeys2(v);
              }}
          />
          <Title heading={6}>expandedKeys 受控 + 开启搜索 + 搜索时更新 expandedKeys</Title>
          <TreeSelect
              style={{ width: 300, marginBottom: 30 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={treeData2}
              filterTreeNode
              expandedKeys={expandedKeys3}
              defaultValue='beijing'
              onExpand={v => {
                  console.log('onExpand value: ', v);
                  setExpandedKeys3(v)
              }}
              onSearch={(input, filterExpandedKeys) => {
                  console.log('onExpand filterExpandedKeys: ', filterExpandedKeys);
                  setExpandedKeys3(filterExpandedKeys);
              }}
          />
      </>
  )
}

export const loadData = () => {
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
    const [loadedKeys, setLoadedKeys] = useState(['2']);

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
            filterTreeNode
            treeData={treeData}
            style={{ width: 300 }}
            placeholder="请选择"
        />
    );
}


export const loadDataAndLoadedkeys = () => {
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
    const [loadedKeys, setLoadedKeys] = useState(['2']);

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

    function updateLoadedKeys(key) {
        if(!loadedKeys.includes(key)){
          setLoadedKeys([...loadedKeys, key]);
          console.log('[...loadedKeys, key]', [...loadedKeys, key]);
        }
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
                // updateLoadedKeys(key);
                resolve();
            }, 1000);
        });
    }
    return (
        <TreeSelect
            loadData={onLoadData}
            filterTreeNode
            // loadedKeys={loadedKeys}
            treeData={treeData}
            style={{ width: 300 }}
            placeholder="请选择"
        />
    );
}
