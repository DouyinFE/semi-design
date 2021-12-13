import React, { useState } from 'react';
import CustomTrigger from './CustomTrigger';
import { Button, Typography, Toast, Cascader } from '../../index';

const { Text } = Typography;

export default {
  title: 'Cascader',
  parameters: {
    chromatic: { disableSnapshot: true },
  },
}

export {
  CustomTrigger
};

const treeData1 = [
    {
        label: 'Node1',
        value: '0-0',
        children: [
            {
                label: 'Child Node1',
                value: '0-0-1',
                disabled: true,
            },
            {
                label: 'Child Node2',
                value: '0-0-2',
            },
        ],
    },
    {
        label: 'Node2',
        value: '0-1',
    },
];

const treeData2 = [
    {
        label: '亚洲',
        value: 'yazhou',
        children: [
            {
                label: '中国',
                value: 'zhongguo',
                children: [
                    {
                        label: '北京',
                        value: 'beijing',
                    },
                    {
                        label: '上海',
                        value: 'shanghai',
                    },
                ],
            },
            {
                label: '日本',
                value: 'riben',
                disabled: true,
                children: [
                    {
                        label: '大阪',
                        value: 'daban',
                    },
                ],
            },
        ],
    },
    {
        label: '北美洲',
        value: 'beimeizhou',
        children: [
            {
                label: '美国',
                value: 'meiguo',
            },
            {
                label: '加拿大',
                value: 'jianada',
            },
        ],
    },
];

const treeData3 = [
    {
        label: '亚洲',
        value: 'yazhou',
        children: [
            {
                label: '中国',
                value: 'zhongguo',
                children: [
                    {
                        label: '北京',
                        value: 'beijing',
                    },
                    {
                        label: '上海',
                        value: 'shanghai',
                    },
                ],
            },
            {
                label: '日本',
                value: 'riben',
                children: [
                    {
                        label: '大阪',
                        value: 'daban',
                    },
                ],
            },
        ],
    },
];

const treeData4 = [
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
                    },
                ],
            },
        ],
    },
];

const treeOrder = [
    {
        label: '-1',
        value: '0-0',
        key: '-1',
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
        label: '1',
        value: '0-1',
        key: '1',
    },
];

const longTreeData = [
    {
        label: 'udghajsasndanm,',
        value: 'A',
        children: [
            {
                label: 'Bsasfads',
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

const treedataWithNodeLabel = [
    {
        label: '浙江省',
        value: 'zhejiang',
        children: [
            {
                label: '杭州市',
                value: 'hangzhou',
                children: [
                    {
                        label: '西湖市区',
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
                label: <strong>宁波市</strong>,
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

export const _Cascader = () => {
  return (
    <div>
      <Cascader
        style={{ width: 300 }}
        treeData={treeData1}
        placeholder="Please select"
        motion={false}
      />
      <br />
      <br />
      <Cascader
        style={{ width: 300 }}
        treeData={treeData1}
        placeholder="Multiple select"
        multiple
        motion={false}
      />
      <br />
      <br />
      <Cascader
        style={{ width: 300 }}
        treeData={treeData1}
        placeholder="Multiple select enableLeafClick"
        multiple
        enableLeafClick
        motion={false}
      />
      <br />
      <br />
      <Cascader
        style={{ width: 300 }}
        treeData={[]}
        motion={false}
        placeholder="Please select"
        // defaultOpen={true}
      />
    </div>
  );
};

export const ChangeOnSelect = () => {
  return (
    <div>
      <Cascader
        style={{ width: 300 }}
        treeData={treeData2}
        placeholder="Please select"
        changeOnSelect={true}
      />
    </div>
  );
};

export const Searchable = () => {
  return (
    <div>
      <Cascader
        style={{ width: 300 }}
        treeData={treeData2}
        placeholder="Please select"
        filterTreeNode
        motion={false}
      />
      <br />
      <br />
      <Cascader
        style={{ width: 300 }}
        treeData={treeData2}
        placeholder="Please select"
        filterTreeNode
        changeOnSelect
        allowHalfPath
      />
      <br />
      <br />
      <Cascader
        style={{ width: 300 }}
        treeData={treeData2}
        placeholder="Please select"
        filterTreeNode
        filterLeafOnly={false}
        onChange={e => console.log(e)}
      />
      <div>
        <br />
        <br />
        <div>fix-1449,当 label 为 ReactNode 时，搜索显示结果[object object]</div>
        <Cascader
          style={{ width: 300 }}
          treeData={treedataWithNodeLabel}
          placeholder="宁波为 ReactNode"
          filterTreeNode
        />
        <div>
          filterTreeNode=false，且 label 为 ReactNode
          时，配合displayRender使用，使得回显到input的内容符合预期
        </div>
        <Cascader
          style={{ width: 300 }}
          treeData={treedataWithNodeLabel}
          placeholder="自定义回填时显示数据的格式"
          displayRender={list =>
            list.map((v, i) => {
              return list.length - 1 === i ? (
                <React.Fragment key={i}>{v}</React.Fragment>
              ) : (
                <React.Fragment key={i}>{v} / </React.Fragment>
              );
            })
          }
          defaultValue={['zhejiang', 'ningbo', 'jiangbei']}
        />
      </div>
    </div>
  );
};
Searchable.parameters = {
  chromatic: { disableSnapshot: false },
}

export const Disabled = () => {
  return (
    <div>
      <Cascader
        style={{ width: 300 }}
        treeData={treeData2}
        placeholder="Please select"
        filterTreeNode
        disabled
      />
      <br /><br />
      <Cascader
        defaultValue={['yazhou', 'zhongguo']}
        style={{ width: 300 }}
        treeData={treeData2}
        multiple
        filterTreeNode
        disabled
      />
      <br /><br />
      <Cascader
        defaultValue={['yazhou', 'zhongguo']}
        style={{ width: 300 }}
        treeData={treeData2}
        multiple
        disabled
      />
    </div>
  );
};
Disabled.parameters = {
  chromatic: { disableSnapshot: false },
}

export const DisabledOption = () => {
  return (
    <div>
      <div>common disabled option</div>
      <Cascader style={{ width: 300 }} treeData={treeData2} placeholder="Japan node is disabled" />
      <br />
      <br />
      <div>single selection + defaultValue is disabled option + changeOnSelect</div>
      <Cascader
        style={{ width: 300 }}
        treeData={treeData2}
        changeOnSelect
        defaultValue={['yazhou', 'riben']}
        placeholder="Japan node is disabled"
      />
      <br />
      <br />
      <div>
        single selection + defaultValue is disabled option + changeOnSelect + filterTreeNode
      </div>
      <Cascader
        style={{ width: 300 }}
        treeData={treeData2}
        changeOnSelect
        filterTreeNode
        defaultValue={['yazhou', 'riben']}
        placeholder="Japan node is disabled"
      />
      <br />
      <br />
      <div>multiple selection + defaultValue is disabled option</div>
      <Cascader
        multiple
        filterTreeNode
        style={{ width: 300 }}
        treeData={treeData2}
        defaultValue={['yazhou', 'riben']}
        placeholder="Japan node is disabled"
      />
      <br />
      <br />
      <div>multiple selection + filterTreeNode + defaultValue is disabled option</div>
      <Cascader
          filterTreeNode
          multiple
          style={{ width: 300 }}
          treeData={treeData2}
          defaultValue={[
              ['yazhou', 'riben'],
              ['beimeizhou', 'jianada']
          ]}
          placeholder="Japan node is disabled"
      />
    </div>
  );
};

export const CustomSearch = () => {
  return (
    <div>
      <Cascader
        style={{ width: 300 }}
        treeData={treeData2}
        placeholder="Please select"
        filterTreeNode
        treeNodeFilterProp="value"
      />
    </div>
  );
};

export const CustomDisplayProp = () => {
  return (
    <div>
      <Cascader
        style={{ width: 300 }}
        treeData={treeData2}
        placeholder="Please select"
        changeOnSelect={true}
        displayProp="value"
        filterTreeNode
      />
    </div>
  );
};

export const DefaultValue = () => {
  return (
    <div>
      <Cascader
        style={{ width: 300 }}
        treeData={treeData3}
        placeholder="Please select"
        defaultValue={['yazhou', 'zhongguo', 'shanghai']}
      />
      <br />
      <br />
      <Cascader
        style={{ width: 300 }}
        treeData={treeData3}
        placeholder="Please select"
        changeOnSelect
        defaultValue={['yazhou']}
      />
      <br />
      <br />
      <Cascader
        style={{ width: 300 }}
        treeData={treeData3}
        placeholder="Please select"
        changeOnSelect
        defaultValue={['yazhou', 'zhongguo']}
        filterTreeNode
      />
      <br />
      <br />
      <Cascader
        style={{ width: 300 }}
        treeData={treeData3}
        placeholder="Please select"
        changeOnSelect
        defaultValue={'yazhou'}
        filterTreeNode
      />
      <br />
      <br />
      <Cascader
        style={{ width: 300 }}
        treeData={treeData3}
        placeholder="Please select"
        defaultValue={['yazhou', 'zhongguo']}
        filterTreeNode
      />
    </div>
  );
};

export const DefaultValueNotExist = () => {
  return (
    <>
      <Cascader
        style={{ width: 300 }}
        treeData={treeData3}
        placeholder="Please select"
        changeOnSelect
        defaultValue={'yazhou not exist'}
        filterTreeNode
      />
      <br />
      <br />
      <Cascader
        style={{ width: 300 }}
        treeData={treeData3}
        placeholder="Please select"
        defaultValue={'tokyo not exist'}
      />
    </>
  );
};

class ControlledDemo extends React.Component {
  constructor() {
    super();
    this.state = {
      value: [],
    };
  }
  onChange(value) {
    this.setState({ value });
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
              },
            ],
          },
        ],
      },
    ];
    return (
      <Cascader
        multiple
        style={{ width: 300 }}
        treeData={treeData}
        placeholder="请选择所在地区"
        value={this.state.value}
        changeOnSelect
        filterTreeNode
        onChangeWithObject
        onChange={e => this.onChange(e)}
      />
    );
  }
}

export const ControlledComponent = () => <ControlledDemo />;

export const CascaderOrderTest = () => {
  return (
    <div>
      <Cascader style={{ width: 300 }} treeData={treeOrder} placeholder="Please select" />
    </div>
  );
};


export const OnFocusAndOnBlur = () => {
  return (
    <div>
      <Cascader
        style={{ width: 300 }}
        treeData={treeData1}
        placeholder="Please select"
        onFocus={(val, e) => console.log('focus', e, val)}
        onBlur={(val, e) => console.log('blur', e, val)}
      />
    </div>
  );
};

export const ShowClear = () => {
  return (
    <div>
      <Cascader
        style={{ marginLeft: 700, width: 300 }}
        treeData={treeData1}
        placeholder="Please select"
        showClear
        filterTreeNode
      />
      <br />
      <br />
      <Cascader
        style={{ marginLeft: 700, width: 300 }}
        treeData={treeData1}
        placeholder="Please select"
        showClear
      />
      <br />
      <br />
      <div style={{ marginLeft: 700 }}>
        <p>有用户反馈，超长列表点击 showClear 后，dropdown错位。1.30.0-beta.1 fixed</p>
        <Cascader
          style={{ width: 300 }}
          treeData={longTreeData}
          placeholder="Please select"
          showClear
        />
      </div>
    </div>
  );
};

const LoadDataDemo = () => {
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
      isLeaf: true,
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
              isLeaf: selectedOpt.length > 1,
            },
            {
              label: `${label} - 2`,
              value: `${label}-2`,
              isLeaf: selectedOpt.length > 1,
            },
          ])
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
      onChangeWithSelect
      placeholder="Please select"
    />
  );
};

const LoadDataWithReset = () => {
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
      isLeaf: true,
    },
  ];
  const [data, setData] = useState(initialData);
  const [value, setValue] = useState([]);

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
              isLeaf: selectedOpt.length > 1,
            },
            {
              label: `${label} - 2`,
              value: `${label}-2`,
              isLeaf: selectedOpt.length > 1,
            },
          ])
        );
        resolve();
      }, 1000);
    });
  };

  return (
    <>
      <Cascader
        style={{ width: 300 }}
        treeData={data}
        loadData={onLoadData}
        value={value}
        onChangeWithObject
        changeOnSelect
        onChange={setValue}
        placeholder="Please select"
      />
      <Button onClick={() => setValue([])}>重置</Button>
    </>
  );
};

export const LoadData = () => (
  <>
    <LoadDataDemo />
    <br />
    <br />
    <div>fix:1448，重置失效</div>
    <LoadDataWithReset />
  </>
);
export const DynamicPlaceholder = () => {
  const [isSelect, setSelect] = useState(false);
  return (
    <>
      <Button onClick={() => setSelect(!isSelect)}>Toggle</Button>
      <Cascader
        style={{ width: 300 }}
        treeData={treeData2}
        placeholder="Please select"
        searchPlaceholder="Search something"
        filterTreeNode={isSelect}
        showClear
      />
    </>
  );
};


export const FixDedupOnSelect = () => {
  return (
    <div>
      <Cascader
        style={{ width: 300 }}
        treeData={treeData2}
        placeholder="Please select"
        onSelect={v => console.log(v)}
      />
      <Cascader
        style={{ width: 300 }}
        treeData={treeData2}
        placeholder="Please select"
        onSelect={v => console.log(v)}
        dedupOnSelect={false}
      />
    </div>
  );
};


const slotStyle = {
    height: '36px',
    display: 'flex',
    padding: '0 32px',
    alignItems: 'center',
    cursor: 'pointer',
    borderRadius: '0 0 6px 6px',
};

export const CascaderWithSlot = () => {
  return (
    <div>
      <Cascader
        style={{ width: 300 }}
        treeData={treeData2}
        placeholder="请选择所在地区"
        topSlot={<Text style={slotStyle}>选择地区</Text>}
        bottomSlot={
          <div style={slotStyle}>
            <Text>找不大相关选项？</Text>
            <Text link>去新建</Text>
          </div>
        }
      />
    </div>
  );
};

export const CascaderWithMaxTagCountShowRestTagsPopoverRestTagsPopoverProps = () => {
  return (
    <div>
      <Cascader
        style={{ width: 300 }}
        treeData={treeData4}
        placeholder="请选择所在地区"
        multiple
        maxTagCount={1}
        showRestTagsPopover
        restTagsPopoverProps={{ position: 'bottom' }}
        defaultValue={[
          ['zhejiang', 'ningbo', 'haishu'],
          ['zhejiang', 'hangzhou', 'xihu'],
        ]}
      />
    </div>
  );
};

CascaderWithMaxTagCountShowRestTagsPopoverRestTagsPopoverProps.story = {
  name: 'Cascader with maxTagCount/showRestTagsPopover/restTagsPopoverProps',
};
CascaderWithMaxTagCountShowRestTagsPopoverRestTagsPopoverProps.parameters = {
  chromatic: { disableSnapshot: false },
}

export const CascaderWithShowNext = () => {
  return (
    <div>
      <Cascader
        style={{ width: 300 }}
        treeData={treeData4}
        placeholder="请选择所在地区"
        showNext="hover"
      />
    </div>
  );
};

export const CascaderWithMaxOnExceed = () => {
  return (
    <div>
      <div>普通情况</div>
      <Cascader
        style={{ width: 300 }}
        treeData={treeData4}
        placeholder="请选择所在地区"
        multiple
        max={1}
        onExceed={v => {
          Toast.warning('exceed max');
          console.log(v);
        }}
        defaultValue={['zhejiang', 'ningbo', 'haishu']}
      />
      <br />
      <br />
      <div>defaultValue的数量超过max，则只允许减少到合法，不允许再增加</div>
      <Cascader
        style={{ width: 300 }}
        treeData={treeData4}
        placeholder="请选择所在地区"
        multiple
        max={1}
        onExceed={v => {
          Toast.warning('exceed max');
          console.log(v);
        }}
        defaultValue={[
          ['zhejiang', 'ningbo', 'haishu'],
          ['zhejiang', 'hangzhou', 'xihu'],
        ]}
      />

      <br />
      <br />
      <div>autoMergeValue=false时的情况</div>
      <Cascader
        style={{ width: 300 }}
        treeData={treeData4}
        placeholder="请选择所在地区"
        multiple
        max={2}
        autoMergeValue={false}
        onExceed={v => {
          Toast.warning('exceed max');
          console.log(v);
        }}
        defaultValue={[
          ['zhejiang', 'ningbo', 'haishu'],
          ['zhejiang', 'hangzhou', 'xihu'],
        ]}
      />
    </div>
  );
};

CascaderWithMaxOnExceed.story = {
  name: 'Cascader with max/onExceed',
};
CascaderWithMaxOnExceed.parameters = {
  chromatic: { disableSnapshot: false },
}

const ControlledLoadDataWithDefaultValue = () => {
  const [v, setV] = useState('受控 Value');
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
      isLeaf: true,
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
              isLeaf: selectedOpt.length > 1,
            },
            {
              label: `${label} - 2`,
              value: `${label}-2`,
              isLeaf: selectedOpt.length > 1,
            },
          ])
        );
        resolve();
      }, 1000);
    });
  };

  return (
    <Cascader
      defaultValue="123"
      value={v}
      onChange={v => setV(v)}
      style={{ width: 300 }}
      treeData={data}
      loadData={onLoadData}
      placeholder="Please select"
    />
  );
};

const LoadDataWithDefaultValue = () => {
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
      isLeaf: true,
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
              isLeaf: selectedOpt.length > 1,
            },
            {
              label: `${label} - 2`,
              value: `${label}-2`,
              isLeaf: selectedOpt.length > 1,
            },
          ])
        );
        resolve();
      }, 1000);
    });
  };

  return (
    <Cascader
      defaultValue="defaultValue"
      style={{ width: 300 }}
      treeData={data}
      loadData={onLoadData}
      showClear
      placeholder="Please select"
    />
  );
};

export const LoadDataWithDefaultValueDemo = () => {
  return (
    <div>
      <div>fix-1429,检查defaultValue在异步时是否有异常</div>
      <ControlledLoadDataWithDefaultValue />
      <br />
      <br />
      <LoadDataWithDefaultValue />
    </div>
  );
};
LoadDataWithDefaultValueDemo.parameters = {
  chromatic: { disableSnapshot: false },
}

export const OnChangeWithObject = () => (
  <>
    <div>单选 + onChangeWithObject + defaultValue 为 string []</div>
    <Cascader
      onChangeWithObject
      style={{ width: 300 }}
      treeData={treeData4}
      placeholder="请选择所在地区"
      defaultValue={['zhejiang', 'hangzhou', 'xihu']}
    />
    <br />
    <br />
    <div>多选 + onChangeWithObject + defaultValue 为 string []</div>
    <Cascader
      multiple
      changeOnSelect
      onChangeWithObject
      style={{ width: 300 }}
      treeData={treeData4}
      placeholder="请选择所在地区"
      defaultValue={'zhejiang'}
    />
    <br />
    <br />
    <div>单选 + onChangeWithObject + defaultValue 为 object []</div>
    <Cascader
      onChangeWithObject
      changeOnSelect
      style={{ width: 300 }}
      treeData={treeData2}
      placeholder="请选择所在地区"
      defaultValue={{
        label: '北美洲',
        value: 'beimeizhou',
        children: [
          {
            label: '美国',
            value: 'meiguo',
          },
          {
            label: '加拿大',
            value: 'jianada',
          },
        ],
      }}
    />
    <br />
    <br />
    <div>多选 + onChangeWithObject + defaultValue 为 object []</div>
    <Cascader
      multiple
      onChangeWithObject
      style={{ width: 300 }}
      treeData={treeData2}
      placeholder="请选择所在地区"
      defaultValue={{
        label: '北美洲',
        value: 'beimeizhou',
        children: [
          {
            label: '美国',
            value: 'meiguo',
          },
          {
            label: '加拿大',
            value: 'jianada',
          },
        ],
      }}
    />
  </>
);
