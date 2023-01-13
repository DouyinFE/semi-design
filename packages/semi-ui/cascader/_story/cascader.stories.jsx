import React, { useState, useCallback, useEffect } from 'react';
import CustomTrigger from './CustomTrigger';
import { Button, Typography, Toast, Cascader, Checkbox } from '../../index';

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

const treeData5 = [
  {
    label: 'Node1',
    value: '0-0',
    children: [
      {
        label: 'Child Node1',
        value: '0-0-1',
      },
      {
        label: 'Child Node2',
        value: '0-0-2',
        key: '0-0-2',
      },
      {
        label: 'Child Node3',
        value: '0-0-3',
      },
      {
        label: 'Child Node4',
        value: '0-0-4',
      },
      {
        label: 'Child Node5',
        value: '0-0-5',
      },
      {
        label: 'Child Node6',
        value: '0-0-6',
      },
      {
        label: 'Child Node7',
        value: '0-0-7',
      },
      {
        label: 'Child Node8',
        value: '0-0-8',
      },
      {
        label: 'Child Node9',
        value: '0-0-9',
      },
      {
        label: 'Child Node10',
        value: '0-0-10',
      },
    ],
  },
  {
    label: 'Node2',
    value: '0-1',
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

export const issue703 = () => {
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
                            label: `${label}-1`,
                            value: `${label}-1`,
                            isLeaf: selectedOpt.length > 1
                        },
                        {
                            label: `${label}-2`,
                            value: `${label}-2`,
                            isLeaf: selectedOpt.length > 1
                        },
                    ]),
                );
                resolve();
            }, 1000);
        });
    };

    const [v,setV]=useState([['0-0'], ['0-1', 'Node2-2']]);
    useEffect(()=>{
      console.log('data change');
        setTimeout(()=>setV([['0-0'], ['0-1', 'Node2-2', 'Node2-2-2']]),0);
    },[data]) 

    return (
      <>
        <div>treeData和value动态更新，value中的值在treeData中存在则能够正确显示</div>
        <Cascader
            multiple
            onChange={(a)=>console.log(a)}
            value={v}
            style={{ width: 300 }}
            treeData={data}
            loadData={onLoadData} 
            placeholder="Please select"
        />
        <div>非受控，动态更新treeData</div>
        <Cascader
            multiple
            onChange={(a)=>console.log(a)}
            style={{ width: 300 }}
            treeData={data}
            loadData={onLoadData} 
            placeholder="Please select"
        />
      </>
    );
};

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
      <br />
      <br />
      <div>fix-1449,当 label 为 ReactNode 时，搜索显示结果[object object]</div>
      <Cascader
        style={{ width: 300 }}
        treeData={treedataWithNodeLabel}
        placeholder="宁波为 ReactNode"
        filterTreeNode
      />
      <br />
      <br />
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
      <br />
      <br />
      <div>
        v2.5 起，filterTreeNode=false，且 label 为 ReactNode
        时，无配合displayRender 使用，回显到input的内容也是符合预期
      </div>
      <Cascader
        style={{ width: 300 }}
        treeData={treedataWithNodeLabel}
        placeholder="宁波为 ReactNode"
        defaultValue={['zhejiang', 'ningbo', 'jiangbei']}
      />
    </div>
  );
};
Searchable.parameters = {
  chromatic: { disableSnapshot: false },
}

export const filterTreeNodeAndDisplayRender = () => {
  return (
    <>
      <div>
          filterTreeNode=true，配合displayRender 使用，回显到input的内容也是符合预期
      </div>
      <Cascader
        filterTreeNode
        style={{ width: 300 }}
        treeData={treeData4}
        placeholder="自定义回填时显示数据的格式"
        defaultValue={['zhejiang', 'ningbo', 'jiangbei']}
        displayRender={(item) => {
          console.log('item', item);
          return <div>
              {'已选择：' + item.join(' -> ')}
          </div>;}}
      />
    </>
  );
};

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
        placeholder="Please select when multiple"
        multiple
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

export const undefinedValueWhileMutipleAndOnChangeWithObject = () => {
  const [value, setValue] = useState(undefined);
  
  return (
    <>
      <div>多选 + onChangeWithObject + value 为 undefined</div>
      <Cascader
        multiple
        onChangeWithObject
        style={{ width: 300 }}
        treeData={treeData2}
        placeholder="请选择所在地区"
        value={value}
        onChange={(v)=>{
          setValue(v);
        }}
      />
    </>
  )
}

export const LeafOnly = () => {
  const [value, setValue] = useState([])
  return (
      <div>
          <div>autoMergeValue=false,leafOnly=false</div>
          <Cascader
              style={{ width: 300 }}
              treeData={treeData4}
              placeholder="请选择所在地区"
              multiple
              autoMergeValue={false}
              leafOnly={false}
              defaultValue={['zhejiang']}
          />
          <br />
          <br />
          <div>autoMergeValue=false,leafOnly=true, leafOnly生效</div>
          <Cascader
              style={{ width: 300 }}
              treeData={treeData4}
              placeholder="请选择所在地区"
              multiple
              autoMergeValue={false}
              leafOnly={true}
              defaultValue={['zhejiang']}
          />
          <br />
          <br />
          <div>受控，autoMergeValue=false,leafOnly=true, leafOnly生效</div>
          <Cascader
              style={{ width: 300 }}
              treeData={treeData4}
              placeholder="请选择所在地区"
              multiple
              onChange={v=>{
                  console.log(v);
                  setValue(v)
              }}
              autoMergeValue={false}
              leafOnly={true}
              value={value}
          />
          <br />
          <br />
          <div>受控 onChangeWithObject, autoMergeValue=false,leafOnly=true, leafOnly生效</div>
          <Cascader
              style={{ width: 300 }}
              treeData={treeData4}
              placeholder="请选择所在地区"
              multiple
              onChange={v=>{
                  console.log(v);
                  setValue(v)
              }}
              onChangeWithObject
              autoMergeValue={false}
              leafOnly={true}
              value={value}
          />
          <br />
          <br />
          <div>autoMergeValue=true,leafOnly=false</div>
          <Cascader
              style={{ width: 300 }}
              treeData={treeData4}
              placeholder="请选择所在地区"
              multiple
              autoMergeValue={true}
              leafOnly={false}
              defaultValue={['zhejiang']}
          />
          <br />
          <br />
          <br />
          <div>autoMergeValue=true,leafOnly=true</div>
          <Cascader
              style={{ width: 300 }}
              treeData={treeData4}
              placeholder="请选择所在地区"
              multiple
              autoMergeValue={true}
              leafOnly={true}
              defaultValue={['zhejiang']}
          />
      </div>
  );
}

export const DynamicTreeData = () => {
  const [treeDataDemo1,setTreeData1]=useState(treeData2);
  const [treeDataDemo2,setTreeData2]=useState(treeData2);
  const [treeDataDemo3,setTreeData3]=useState(treeData2);
  const [treeDataDemo4,setTreeData4]=useState(treeData2);
  const [treeDataDemo5,setTreeData5]=useState(treeData2);
  const [value3,setValue3]=useState();
  const [value4,setValue4]=useState();
  return (
      <div>
          <div>多选 + 动态更新 tree</div>
          <Cascader
            style={{ width: 300 }}
            treeData={treeDataDemo1}
            multiple 
            placeholder="请选择所在地区"
          />
          <Button onClick={()=>{setTreeData1(treeData3)}}>改变treeData</Button>
          <br />
          <br />
          <div>单选 + 动态更新 tree</div>
          <Cascader
            style={{ width: 300 }}
            treeData={treeDataDemo2}
            placeholder="请选择所在地区"
          />
          <Button onClick={()=>{setTreeData2(treeData3)}}>改变treeData</Button>
          <br />
          <br />
          <div>多选 + 动态更新 tree + 受控</div>
          <Cascader
            style={{ width: 300 }}
            treeData={treeDataDemo3}
            multiple
            value={value3}
            onChange={v=>{
              console.log(v);
              setValue3(v);
            }}
            placeholder="请选择所在地区"
          />
          <Button onClick={()=>{setTreeData3(treeData3)}}>改变treeData</Button>
          <br />
          <br />
          <div>单选 + 动态更新 tree + 受控</div>
          <Cascader
            style={{ width: 300 }}
            treeData={treeDataDemo4}
            value={value4}
            onChange={v=>{
              console.log(v);
              setValue4(v);
            }}
            placeholder="请选择所在地区"
          />
          <Button onClick={()=>{setTreeData4(treeData3)}}>改变treeData</Button>
          <br />
          <br />
          <div>多选 + 动态更新 tree + defaultValue 为亚洲</div>
          <Cascader
            style={{ width: 300 }}
            treeData={treeDataDemo5}
            multiple
            defaultValue='yazhou'
            placeholder="请选择所在地区"
          />
          <Button onClick={()=>{setTreeData5(treeData3)}}>改变treeData</Button>
          <br />
          <br />
      </div>
  );
}


export const SuperLongList = () => {
    let treeData = new Array(100).fill().map(() => ({ label: '浙江省', value: 'zhejiang' }));
    treeData.push({ label: '到底啦', value: 'bottom' })
    return (
        <Cascader
            style={{ width: 300 }}
            treeData={treeData}
            placeholder="请选择所在地区"
            onListScroll={()=>{console.log(123)}}
        />
    );
};

export const size = () => {
  const props = {
    // defaultValue: [
    //   ["0-0","0-0-1"],["0-0","0-0-2"],["0-0","0-0-3"],["0-0","0-0-4"],["0-0","0-0-5"],
    //   ["0-0","0-0-6"],["0-0","0-0-7"],["0-0","0-0-8"],["0-0","0-0-9"]
    // ],
     defaultValue: [["0-0","0-0-9"]
    ],
    style: { width: 300 },
    treeData: treeData5,
    multiple: true,
    filterTreeNode: true,
    leafOnly: true,
  };

  return (<>
    <Cascader {...props} size={'small'} />
    <br/><br/>
    <Cascader {...props} size={'default'} />
    <br/><br/>
    <Cascader {...props} size={'large'}/>
  </>);
}

export const filterSorter = () => {
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
              placeholder="输入 s 查看排序效果"
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

export const filterRender = () => {
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
                value: 'Semi',
                
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

  const renderSearchOptionSingle = (props) => {
    const {
      className,
      data,
      onClick,
      selected,
    } = props;

    return (
      <li
          className={className}
          style={{justifyContent: 'flex-start'}}
          role="treeitem"
          onClick={onClick}
      > 
        <Text 
          ellipsis={{ showTooltip: { opts: { style: { wordBreak: 'break-all'} }}}} 
          style={{ width: 270, color: selected ? 'var(--semi-color-primary)': undefined }}
        >
            {data.map(item => item.label ).join(' / ')}
        </Text>
      </li>
    )
  }

  const renderSearchOptionMultiple = (props) => {
    const {
      className,
      data,
      checkStatus,
      onCheck,
    } = props;

    return (
      <li
          className={className}
          style={{justifyContent: 'flex-start'}}
          role="treeitem"
          onClick={onCheck}
      > 
        <Checkbox
            onClick={onCheck}
            indeterminate={checkStatus.halfChecked}
            checked={checkStatus.checked}
            style={{ marginRight: 8 }}
        />
        <Text 
          ellipsis={{ showTooltip: { opts: { style: { wordBreak: 'break-all'} }}}} 
          style={{ width: 270 }}
        >
            {data.map(item => item.label).join(' / ')}
        </Text>
      </li>
    )
  }
  
  return (
      <div>
          <p>鼠标 hover 到选项可查看被省略文本完整内容</p>
          <br />
          <Cascader
              style={{ width: 300 }}
              treeData={treeData}
              placeholder="单选，自定义搜索选项渲染"
              filterTreeNode
              filterRender={renderSearchOptionSingle}
          />
          <br />
          <Cascader
            multiple
            style={{ width: 300, marginTop: 20 }}
            treeData={treeData}
            placeholder="多选，自定义搜索选项渲染"
            filterTreeNode
            filterRender={renderSearchOptionMultiple}
          />
      </div>
  );
};
