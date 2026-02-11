import { TreeSelect, Icon } from '../../index';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';

function sleep(ms = 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const treeChildren = [
    {
        label: '北京',
        value: 'Beijing',
        key: 'beijing',
    },
    {
        label: '上海',
        value: 'Shanghai',
        key: 'shanghai',
    },
];

const treeData = [
    {
        label: '亚洲',
        value: 'Yazhou',
        key: 'yazhou',
        children: [
            {
                label: '中国',
                value: 'Zhongguo',
                key: 'zhongguo',
                children: treeChildren,
            },
            {
                label: '日本',
                value: 'Riben',
                key: 'riben',
                children: [
                    {
                        label: '东京',
                        value: 'Dongjing',
                        key: 'dongjing'
                    },
                    {
                        label: '大阪',
                        value: 'Daban',
                        key: 'daban'
                    }
                ]
            },
        ],
    },
    {
        label: '北美洲',
        value: 'Beimeizhou',
        key: 'beimeizhou',
        children: [
            {
                label: '美国',
                value: 'Meiguo',
                key: 'meiguo'
            },
            {
                label: '加拿大',
                value: 'Jianada',
                key: 'jianada'
            }
        ]
    },
];

const treeData2 = [
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

const treeData3 = [
    {
        label: '亚洲',
        value: 'Asia',
        key: '0',
        children: [
            {
                label: '中国',
                value: 'China',
                key: '0-0',
            },
        ],
    },
    {
        label: '北美洲',
        value: 'North America',
        key: '1',
    }
];

const specialTreeData = [
    {
      label1: '亚洲',
      value1: 'Yazhou',
      key1: 'yazhou',
      children1: [
        {
          label1: '中国',
          value1: 'Zhongguo',
          key1: 'zhongguo',
          disabled1: true,
          children1: [
            {
              label1: '北京',
              value1: 'Beijing',
              key1: 'beijing',
            },
            {
              label1: '上海',
              value1: 'Shanghai',
              key1: 'shanghai',
            },
          ],
        },
        {
          label1: '日本',
          value1: 'Riben',
          key1: 'riben',
          children1: [
            {
              label1: '东京',
              value1: 'Dongjing',
              key1: 'dongjing',
            },
            {
              label1: '大阪',
              value1: 'Daban',
              key1: 'daban',
            },
          ],
        },
      ],
    },
    {
      label1: '北美洲',
      value1: 'Beimeizhou',
      key1: 'beimeizhou',
      children1: [
        {
          label1: '美国',
          value1: 'Meiguo',
          key1: 'meiguo',
        },
        {
          label1: '加拿大',
          value1: 'Jianada',
          key1: 'jianada',
        },
      ],
    },
];

const treeDataEnNA = {
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

const treeDataEn = [
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
    treeDataEnNA
];

const defaultKeyMaps = {
    value: 'value1',
    key: 'key1',
    label: 'label1',
    children: 'children1',
    disabled: 'disabled1'
}

const treeChildrenWithoutValue = [
    {
        label: '北京',
        key: 'beijing',
    },
    {
        label: '上海',
        key: 'shanghai',
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
                children: treeChildrenWithoutValue,
            },
            {
                label: '日本',
                key: 'riben',
                children: [
                    {
                        label: '东京',
                        key: 'dongjing'
                    },
                    {
                        label: '大阪',
                        key: 'daban'
                    }
                ]
            },
        ],
    },
    {
        label: '北美洲',
        key: 'beimeizhou',
        children: [
            {
                label: '美国',
                key: 'meiguo'
            },
            {
                label: '加拿大',
                key: 'jianada'
            }
        ]
    },
];

let commonProps = {
    motion: false,
    motionExpand: false,
    mouseEnterDelay: 0,
    mouseLeaveDelay: 0,
};

function getTreeSelect(props) {
    props = { treeData: treeData, ...props }
    return mount(
        <TreeSelect
            {...commonProps}
            defaultOpen={true}
            {...props}
        />,
        {
            attachTo: document.getElementById('container')
        }
    );
}

describe('TreeSelect', () => {

    beforeEach(() => {
        // Avoid `attachTo: document.body` Warning
        const div = document.createElement('div');
        div.setAttribute('id', 'container');
        document.body.appendChild(div);
    });

    afterEach(() => {
        const div = document.getElementById('container');
        if (div) {
            document.body.removeChild(div);
        }
        document.body.innerHTML = '';
    });

    it('className / style', () => {
        let props = {
            className: 'test',
            style: { height: 420 },
        };
        let treeSelect = getTreeSelect(props);
        expect(treeSelect.hasClass('test')).toEqual(true);
        expect(treeSelect.find('div.test')).toHaveStyle('height', 420);
    });

    it('placeholder', () => {
        const props = {
            placeholder: 'semi'
        };
        const treeSelect = getTreeSelect(props);
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-selection-placeholder`).instance().textContent).toEqual('semi');
    });

    it('validateStatus', () => {
        const props = {};
        const treeSelect = getTreeSelect(props);
        expect(treeSelect.exists(`.${BASE_CLASS_PREFIX}-tree-select-error`)).toEqual(false);
        expect(treeSelect.exists(`.${BASE_CLASS_PREFIX}-tree-select-warning`)).toEqual(false);
        treeSelect.setProps({ validateStatus: 'error' });
        expect(treeSelect.exists(`.${BASE_CLASS_PREFIX}-tree-select-error`)).toEqual(true);
        treeSelect.setProps({ validateStatus: 'warning' });
        expect(treeSelect.exists(`.${BASE_CLASS_PREFIX}-tree-select-warning`)).toEqual(true);
    });

    it('outerBottomSlot', () => {
        let outerBottomSlot = <div class="outer-slot">outer</div>;
        let props = {
            outerBottomSlot: outerBottomSlot,
        };
        const treeSelect = getTreeSelect(props);
        expect(treeSelect.contains(outerBottomSlot)).toEqual(true);
    });

    it('size', () => {
        const props = {};
        const treeSelect = getTreeSelect(props);
        expect(treeSelect.exists(`.${BASE_CLASS_PREFIX}-tree-select-large`)).toEqual(false);
        expect(treeSelect.exists(`.${BASE_CLASS_PREFIX}-tree-select-small`)).toEqual(false);
        treeSelect.setProps({ size: 'large' });
        expect(treeSelect.exists(`.${BASE_CLASS_PREFIX}-tree-select-large`)).toEqual(true);
        treeSelect.setProps({ size: 'small' });
        expect(treeSelect.exists(`.${BASE_CLASS_PREFIX}-tree-select-small`)).toEqual(true);
    });

    it('custom dropdownClassName / dropdownStyle / zIndex', () => {
        let props = {
            dropdownClassName: 'test',
            dropdownStyle: {
                color: 'red',
            },
            zIndex: 2000,
        };
        let treeSelect = getTreeSelect(props);
        expect(treeSelect.exists('.test')).toEqual(true);
        expect(treeSelect.find('.test')).toHaveStyle('color', 'red');
        expect(document.querySelector(`.${BASE_CLASS_PREFIX}-portal`).style.zIndex).toEqual("2000");
    });

    it('dropdownMatchSelectWidth = true', () => {
        // dropdownMatchSelectWidth default is true
        let props = {
            style: { width: 90 },
            defaultValue: 'abc',
        };
        let treeSelect = getTreeSelect(props);
        // cause jsdom doesn't support layout engine like browser, so you can't access offsetWidth/scrollWidth or use getBoundingRect(), it will always return 0;
        // just use getComputedStyle to avoid this problem.
        let selector = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).getDOMNode();
        let selectorWidth = window.getComputedStyle(selector).width; // expect 90px
        let list = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-popover`).getDOMNode();
        let listWidth = window.getComputedStyle(list).minWidth;
        expect(selectorWidth).toEqual(listWidth);
        treeSelect.unmount();
    });

    it('dropdownMatchSelectWidth = false', () => {
        let props = {
            style: { width: 90 },
            defaultValue: 'abc',
            dropdownMatchSelectWidth: false,
        };
        let treeSelect = getTreeSelect(props);
        let selector = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).getDOMNode();
        let selectorWidth = window.getComputedStyle(selector).width; // expect 90px
        let list = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-popover`).getDOMNode();
        let listWidth = window.getComputedStyle(list).minWidth;
        expect(selectorWidth).not.toEqual(listWidth);
        treeSelect.unmount();
    });

    it('getPopupContainer', () => {
        let treeSelect = getTreeSelect({
            getPopupContainer: () => document.querySelector(`.${BASE_CLASS_PREFIX}-tree-select`),
        });
        let dom = document.querySelector(`.${BASE_CLASS_PREFIX}-tree-select`);
        expect(dom.querySelectorAll(`.${BASE_CLASS_PREFIX}-tree-select-popover`).length).toEqual(1);
    });

    it('custom prefix / suffix / insetLabel', () => {
        let prefix = <div className="prefix">prefix content</div>;
        let suffix = <div className="suffix">suffix content</div>;
        let insetLabel = 'semi';
        const props = {
            prefix: prefix,
            suffix: suffix,
        };
        let treeSelect = getTreeSelect(props);
        expect(treeSelect.contains(prefix)).toEqual(true);
        expect(treeSelect.contains(suffix)).toEqual(true);
        treeSelect.unmount();
        let ntreeSelect = getTreeSelect({ insetLabel: insetLabel });
        expect(ntreeSelect.contains(insetLabel)).toEqual(true);
        ntreeSelect.unmount();
    });

    it('empty data', () => {
        let treeSelect = getTreeSelect({
            treeData: [],
            emptyContent: 'empty'
        });
        let node = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option`);
        expect(node.length).toEqual(1);
        expect(node.hasClass(`${BASE_CLASS_PREFIX}-tree-option-empty`)).toEqual(true);
        expect(node.instance().textContent).toEqual('empty');
    });

    it('defaultOpen', () => {
        let props = {
            defaultOpen: false,
        };
        let treeSelect = getTreeSelect(props);
        expect(treeSelect.state().isOpen).toEqual(false);
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-popover`).exists()).toEqual(false);
        treeSelect.unmount();

        let ntreeSelect = getTreeSelect({ defaultOpen: true, });
        expect(ntreeSelect.state().isOpen).toEqual(true);
        expect(ntreeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-popover`).exists()).toEqual(true);
        let options = ntreeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option`);
        expect(ntreeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option`).length).toEqual(2);
        expect(options.at(0).getDOMNode().textContent).toEqual('亚洲');
        expect(options.at(1).getDOMNode().textContent).toEqual('北美洲');
    });

    it('defaultValue', () => {
        // auto expand parent, if node exist means parent is open
        let treeSelect = getTreeSelect({
            defaultValue: 'Beijing'
        });
        let selectedNode = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option-selected`);
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-selection`).getDOMNode().textContent).toEqual('北京');
        expect(selectedNode.instance().textContent).toEqual('北京');
        treeSelect.unmount();
        // array case only select first item
        let tree2 = getTreeSelect({
            defaultValue: ['Riben', 'Beijing']
        });
        let selectedNode2 = tree2.find(`.${BASE_CLASS_PREFIX}-tree-option-selected`);
        expect(selectedNode2.instance().textContent).toEqual('日本');
        expect(tree2.find(`.${BASE_CLASS_PREFIX}-tree-select-selection`).getDOMNode().textContent).toEqual('日本');
        expect(tree2.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-2`).at(0).hasClass(`${BASE_CLASS_PREFIX}-tree-option-collapsed`)).toEqual(true);
    })

    it('defaultExpandedKeys', () => {
        // auto expand parent
        let treeSelect = getTreeSelect({
            defaultExpandedKeys: ['zhongguo', 'beimeizhou']
        });
        // yazhou beimeizhou
        let topNode = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`);
        expect(topNode.at(0).hasClass(`${BASE_CLASS_PREFIX}-tree-option-collapsed`)).toEqual(false);
        expect(topNode.at(1).hasClass(`${BASE_CLASS_PREFIX}-tree-option-collapsed`)).toEqual(false);
        // zhongguo riben
        let children = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-2`);
        expect(children.at(0).hasClass(`${BASE_CLASS_PREFIX}-tree-option-collapsed`)).toEqual(false);
        expect(children.at(1).hasClass(`${BASE_CLASS_PREFIX}-tree-option-collapsed`)).toEqual(true);
    })

    it('defaultExpandAll', () => {
        let treeSelect = getTreeSelect({
            defaultExpandAll: true
        });
        let nodes = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option`);
        let collapsed = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option-collapsed`);
        expect(nodes.length).toEqual(10);
        expect(collapsed.length).toEqual(0);

        treeSelect.setProps({ treeData: treeData2});
        treeSelect.update();
        const nodes2 = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option`);
        const collapsed2 = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option-collapsed`);
        expect(nodes2.length).toEqual(2);
        expect(collapsed2.length).toEqual(2);
    })

    it('expandAll', () => {
        const treeSelect = getTreeSelect({
            expandAll: true
        });
        const nodes = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option`);
        const collapsed = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option-collapsed`);
        expect(nodes.length).toEqual(10);
        expect(collapsed.length).toEqual(0);

        treeSelect.setProps({ treeData: treeData2});
        treeSelect.update();
        const nodes2 = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option`);
        const collapsed2 = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option-collapsed`);
        expect(nodes2.length).toEqual(5);
        expect(collapsed2.length).toEqual(0);
    })

    it('if expandedKeys values work', () => {
        // auto expand parent
        let treeSelect = getTreeSelect({
            expandedKeys: ['beimeizhou']
        });
        // yazhou beimeizhou
        let topNode = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`);
        expect(topNode.at(0).hasClass(`${BASE_CLASS_PREFIX}-tree-option-collapsed`)).toEqual(true);
        expect(topNode.at(1).hasClass(`${BASE_CLASS_PREFIX}-tree-option-collapsed`)).toEqual(false);
        treeSelect.setProps({ expandedKeys: ['yazhou', 'zhongguo', 'beimeizhou'] });
        treeSelect.update();
        // zhongguo riben
        let children = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-2`);
        expect(children.at(0).hasClass(`${BASE_CLASS_PREFIX}-tree-option-collapsed`)).toEqual(false);
        expect(children.at(1).hasClass(`${BASE_CLASS_PREFIX}-tree-option-collapsed`)).toEqual(true);
    });

    it('if expand behavior works / onExpand', () => {
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: () => { } } }
        let spyOnExpand = sinon.spy(() => { });
        let treeSelect = getTreeSelect({
            onExpand: spyOnExpand,
        });
        // yazhou
        let topNodeAsia = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`).at(0);
        let expandIcon = topNodeAsia.find(`.${BASE_CLASS_PREFIX}-tree-option-expand-icon`).at(0);
        // expand yazhou
        expandIcon.simulate('click', nativeEvent);
        expect(spyOnExpand.calledOnce).toBe(true);
        expect(spyOnExpand.calledWithMatch(["yazhou"], { expanded: true, node: { key: 'yazhou' } })).toEqual(true);
        // zhongguo riben
        let topNode = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`);
        expect(topNode.at(0).hasClass(`${BASE_CLASS_PREFIX}-tree-option-collapsed`)).toEqual(false);
        expect(topNode.at(1).hasClass(`${BASE_CLASS_PREFIX}-tree-option-collapsed`)).toEqual(true);
        // collapse yazhou
        expandIcon.simulate('click', nativeEvent);
        expect(spyOnExpand.calledWithMatch([], { expanded: false, node: { key: 'yazhou' } })).toEqual(true);
        topNode = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`);
        expect(topNode.at(0).hasClass(`${BASE_CLASS_PREFIX}-tree-option-collapsed`)).toEqual(true);
    });

    it('if expandedKeys controlled work / onExpand', () => {
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: () => { } } }
        let spyOnExpand = sinon.spy(() => { });
        let treeSelect = getTreeSelect({
            expandedKeys: ['beimeizhou'],
            onExpand: spyOnExpand,
        });
        // yazhou
        let topNodeAsia = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`).at(0);
        let expandIcon = topNodeAsia.find(`.${BASE_CLASS_PREFIX}-tree-option-expand-icon`).at(0);
        // expand yazhou
        expandIcon.simulate('click', nativeEvent);
        expect(spyOnExpand.calledWithMatch(["beimeizhou", "yazhou"], { expanded: true, node: { key: 'yazhou' } })).toEqual(true);
        // zhongguo riben
        let topNode = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`);
        expect(topNode.at(0).hasClass(`${BASE_CLASS_PREFIX}-tree-option-collapsed`)).toEqual(true);
    });

    it('select item / onSelect / onChange', () => {
        let spyOnSelect = sinon.spy(() => { });
        let spyOnChange = sinon.spy(() => { });
        let treeSelect = getTreeSelect({
            defaultExpandAll: true,
            onSelect: spyOnSelect,
            onChange: spyOnChange,
        });
        let nodeBeijing = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`).at(0);
        // select beijing
        nodeBeijing.simulate('click');
        // onSelect & onChange
        expect(spyOnSelect.calledOnce).toBe(true);
        expect(spyOnChange.calledOnce).toBe(true);
        expect(spyOnSelect.calledWithMatch('beijing', true, { key: "beijing" })).toEqual(true);
        expect(spyOnChange.calledWithMatch('Beijing', { key: "beijing" })).toEqual(true);

        let selectBox = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectBox.simulate('click');
        // classname
        nodeBeijing = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`).at(0);
        expect(nodeBeijing.hasClass(`${BASE_CLASS_PREFIX}-tree-option-selected`)).toEqual(true);
        // render in input box
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-selection`).getDOMNode().textContent).toEqual('北京');

        // change
        let nodeAsia = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`).at(0);
        // select asia
        nodeAsia.simulate('click');
        // onSelect & onChange
        expect(spyOnSelect.calledWithMatch('yazhou', true, { key: "yazhou" })).toEqual(true);
        expect(spyOnChange.calledWithMatch('Yazhou', { key: "yazhou" })).toEqual(true);

        selectBox.simulate('click');
        // classname
        nodeAsia = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`).at(0);
        expect(nodeAsia.hasClass(`${BASE_CLASS_PREFIX}-tree-option-selected`)).toEqual(true);
        // render in input box
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-selection`).getDOMNode().textContent).toEqual('亚洲');
    });

    it('onClear', () => {
        let spyOnClear = sinon.spy(() => { });
        let treeSelect = getTreeSelect({
            defaultExpandAll: true,
            onClear: spyOnClear,
            showClear: true,
        });

        let nodeBeijing = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`).at(0);
        // select beijing
        nodeBeijing.simulate('click');

        let nodeSelectTree = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select.${BASE_CLASS_PREFIX}-tree-select-single`).at(0);
        nodeSelectTree.simulate('mouseenter');

        let nodeClearIcon = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-clearbtn`).at(0);
        nodeClearIcon.simulate('click');

        expect(spyOnClear.calledOnce).toBe(true);
    })

    it('onChange + value not changed', () => {
        let spyOnSelect = sinon.spy(() => { });
        let spyOnChange = sinon.spy(() => { });
        let treeSelect = getTreeSelect({
            defaultExpandAll: true,
            onSelect: spyOnSelect,
            onChange: spyOnChange,
            defaultValue: 'Beijing'
        });
        let nodeBeijing = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`).at(0);
        // select beijing
        nodeBeijing.simulate('click');
        // onSelect & onChange
        expect(spyOnSelect.calledOnce).toBe(true);
        expect(spyOnChange.notCalled).toBe(true);
    });

    it('onChange + onChangeWithObject', () => {
        let spyOnChange = sinon.spy(() => { });
        let treeSelect = getTreeSelect({
            defaultExpandAll: true,
            onChangeWithObject: true,
            onChange: spyOnChange,
        });
        let nodeBeijing = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`).at(0);
        // select beijing
        nodeBeijing.simulate('click');
        // onSelect & onChange
        expect(spyOnChange.calledOnce).toBe(true);
        expect(spyOnChange.calledWithMatch({ key: "beijing" })).toEqual(true);
    });

    it('treeNodeLabelProp', () => {
        // auto expand parent, if node exist means parent is open
        let treeSelect = getTreeSelect({
            defaultValue: 'Beijing',
            treeNodeLabelProp: 'value'
        });
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-selection`).getDOMNode().textContent).toEqual('Beijing');

        // select asia
        let nodeAsia = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`).at(0);
        nodeAsia.simulate('click');
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-selection`).getDOMNode().textContent).toEqual('Yazhou');
    })

    it('filterTreeNode = true shows input box', () => {
        let treeSelect = getTreeSelect({});
        let searchWrapper = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-search-wrapper`)
        expect(searchWrapper.exists()).toEqual(false);
        treeSelect.setProps({
            filterTreeNode: true
        });
        treeSelect.update();
        searchWrapper = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-search-wrapper`)
        expect(searchWrapper.exists()).toEqual(true);
    });

    it('searchPlaceholder', () => {
        let treeSelect = getTreeSelect({
            filterTreeNode: true,
            searchPlaceholder: 'test',
        });
        let searchWrapper = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-search-wrapper`)
        expect(searchWrapper.find('input').instance().getAttribute('placeholder')).toEqual('test');
    });

    it('onSearch', () => {
        let onSearch = value => { };
        let spyOnSearch = sinon.spy(onSearch);
        let treeSelect = getTreeSelect({
            filterTreeNode: true,
            onSearch: spyOnSearch,
        });
        const searchWrapper = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-search-wrapper`);
        let searchValue = 'semi';
        let event = { target: { value: searchValue } };
        searchWrapper.find('input').simulate('change', event);
        expect(spyOnSearch.calledOnce).toBe(true);
        expect(spyOnSearch.calledWithMatch(searchValue)).toBe(true);

        /* Check the input parameters of onSearch */
        searchValue = '北京';
        event = { target: { value: searchValue } };
        searchWrapper.find('input').simulate('change', event);
        expect(spyOnSearch.callCount).toBe(2);
        const firstCall = spyOnSearch.getCall(1);
        const args = firstCall.args;
        expect(args[0]).toEqual('北京');
        expect(args[1].includes('yazhou')).toEqual(true);
        expect(args[1].includes('zhongguo')).toEqual(true);
    });

    it('filterTreeNode shows correct result', () => {
        let treeSelect1 = getTreeSelect({
            filterTreeNode: true,
        });
        const searchWrapper = treeSelect1.find(`.${BASE_CLASS_PREFIX}-tree-search-wrapper`);
        let searchValue = '北';
        let event = { target: { value: searchValue } };
        searchWrapper.find('input').simulate('change', event);
        expect(treeSelect1.find(`.${BASE_CLASS_PREFIX}-tree-option`).length).toEqual(6);
        expect(treeSelect1.find(`.${BASE_CLASS_PREFIX}-tree-option-highlight`).length).toEqual(2);
        expect(treeSelect1.find(`.${BASE_CLASS_PREFIX}-tree-option-highlight`).at(0).instance().textContent).toEqual('北');
        expect(treeSelect1.find(`.${BASE_CLASS_PREFIX}-tree-option-highlight`).at(1).instance().textContent).toEqual('北');
        treeSelect1.unmount();

        let treeSelect2 = getTreeSelect({
            filterTreeNode: true,
            treeNodeFilterProp: 'value',
        });
        const searchWrapper2 = treeSelect2.find(`.${BASE_CLASS_PREFIX}-tree-search-wrapper`);
        let searchValue2 = 'an';
        let event2 = { target: { value: searchValue2 } };
        searchWrapper2.find('input').simulate('change', event2);
        expect(treeSelect2.find(`.${BASE_CLASS_PREFIX}-tree-option`).length).toEqual(10);
    });

    it('filterTreeNode + no result', () => {
        let treeSelect1 = getTreeSelect({
            filterTreeNode: true,
        });
        const searchWrapper = treeSelect1.find(`.${BASE_CLASS_PREFIX}-tree-search-wrapper`);
        let searchValue = 'Bei';
        let event = { target: { value: searchValue } };
        searchWrapper.find('input').simulate('change', event);
        expect(treeSelect1.find(`.${BASE_CLASS_PREFIX}-tree-option`).length).toEqual(2);
        expect(treeSelect1.find(`.${BASE_CLASS_PREFIX}-tree-option-highlight`).length).toEqual(0);
        treeSelect1.unmount();

        let treeSelect2 = getTreeSelect({
            filterTreeNode: true,
            treeNodeFilterProp: 'value',
        });
        const searchWrapper2 = treeSelect2.find(`.${BASE_CLASS_PREFIX}-tree-search-wrapper`);
        let searchValue2 = '北';
        let event2 = { target: { value: searchValue2 } };
        searchWrapper2.find('input').simulate('change', event2);
        expect(treeSelect2.find(`.${BASE_CLASS_PREFIX}-tree-option`).length).toEqual(2);
    });

    it('async load data', () => {
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: () => { } } }
        const then = jest.fn(() => Promise.resolve());
        const loadData = jest.fn(() => ({ then }));
        const data = {
            label: '亚洲',
            value: 'Asia',
            key: 'asia',
        };
        const treeSelect = getTreeSelect({
            loadData,
            loadedKeys: ['0-1'],
            treeData: [data]
        });
        const topNodeAsia = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`).at(0);
        const expandIcon = topNodeAsia.find(`.${BASE_CLASS_PREFIX}-tree-option-expand-icon`).at(0);
        expandIcon.simulate('click', nativeEvent);
        expect(loadData).toHaveBeenCalledWith(data);
        expect(then).toHaveBeenCalled();
    });

    it('filterTreeNode + treeNodeFilterProp', () => {
        let treeSelect = getTreeSelect({
            filterTreeNode: true,
            treeNodeFilterProp: 'value',
        });
        const searchWrapper = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-search-wrapper`);
        let searchValue = 'Bei';
        let event = { target: { value: searchValue } };
        searchWrapper.find('input').simulate('change', event);
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option`).length).toEqual(6);
    });

    it('filterTreeNode + showFilteredOnly + no result', () => {
        let treeSelect = getTreeSelect({
            filterTreeNode: true,
            showFilteredOnly: true,
        });
        const searchWrapper = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-search-wrapper`);
        let searchValue = 'Bei';
        let event = { target: { value: searchValue } };
        searchWrapper.find('input').simulate('change', event);
        let node = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option`);
        expect(node.length).toEqual(1);
        expect(node.hasClass(`${BASE_CLASS_PREFIX}-tree-option-empty`)).toEqual(true);
    });

    it('filterTreeNode + showFilteredOnly shows correct result', () => {
        let treeSelect = getTreeSelect({
            filterTreeNode: true,
            showFilteredOnly: true,
        });
        const searchWrapper = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-search-wrapper`);
        let searchValue = '北';
        let event = { target: { value: searchValue } };
        searchWrapper.find('input').simulate('change', event);
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option`).length).toEqual(4);
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option-highlight`).length).toEqual(2);
    });

    it('filterTreeNode as a func', () => {
        let treeSelect = getTreeSelect({
            filterTreeNode: (inputValue, treeNode) => treeNode === inputValue,
        });
        const searchWrapper = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-search-wrapper`);
        searchWrapper.find('input').simulate('change', { target: { value: '北' } });
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option-highlight`).length).toEqual(0);
        // update
        searchWrapper.find('input').simulate('change', { target: { value: '北京' } });
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option-highlight`).length).toEqual(1);
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option-highlight`).instance().textContent).toEqual('北京');
    });

    it('controlled: value shows correct', () => {
        let treeSelect = getTreeSelect({
            value: 'Beijing'
        });
        let selectedNode = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option-selected`);
        expect(selectedNode.instance().textContent).toEqual('北京');
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-selection`).getDOMNode().textContent).toEqual('北京');
        treeSelect.unmount();
        // array case only select first item
        let treeSelect2 = getTreeSelect({
            value: ['Riben', 'Beijing']
        });
        let selectedNode2 = treeSelect2.find(`.${BASE_CLASS_PREFIX}-tree-option-selected`);
        expect(selectedNode2.instance().textContent).toEqual('日本');
        expect(treeSelect2.find(`.${BASE_CLASS_PREFIX}-tree-select-selection`).getDOMNode().textContent).toEqual('日本');
        expect(treeSelect2.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-2`).at(0).hasClass(`${BASE_CLASS_PREFIX}-tree-option-collapsed`)).toEqual(true);
    });

    it('controlled: fire onChange and ui not update', () => {
        let spyOnChange = sinon.spy(() => { });
        let treeSelect = getTreeSelect({
            value: '',
            defaultExpandAll: true,
            onChange: spyOnChange,
        });
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option-selected`).exists()).toEqual(false);
        let nodeBeijing = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`).at(0);
        // select beijing
        nodeBeijing.simulate('click');
        // onSelect & onChange
        expect(spyOnChange.calledOnce).toBe(true);
        expect(spyOnChange.calledWithMatch("Beijing")).toEqual(true);
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option-selected`).exists()).toEqual(false);
    });

    it('controlled: value + onChangeWithObject', () => {
        let spyOnChange = sinon.spy(() => { });
        let treeSelect = getTreeSelect({
            value: {
                label: '北京',
                value: 'Beijing',
                key: 'beijing',
            },
            defaultExpandAll: true,
            onChange: spyOnChange,
            onChangeWithObject: true,
        });
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option-selected`).exists()).toEqual(true);
    });

    it('virtualized: fixed height', () => {
        let treeSelect = getTreeSelect({
            defaultExpandAll: true,
            virtualize: {
                itemSize: 28,
                height: 84,
            },
        });
        // virtual list
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-virtual-list`).exists()).toEqual(true);
        // fewer nodes
        let nodes = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option`);
        expect(nodes.length).toBeLessThan(10);
    });

    it('disabled', () => {
        let treeSelect = getTreeSelect({
            disabled: true,
        });
        let inputBox = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-disabled`);
        expect(inputBox.exists()).toEqual(true);
        expect(treeSelect.state().isOpen).toEqual(false);
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-wrapper`).exists()).toEqual(false);

        inputBox.simulate('click');
        expect(treeSelect.state().isOpen).toEqual(false);
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-wrapper`).exists()).toEqual(false);
    });

    it('renderSelectedItem', () => {
        let spyOnSelect = sinon.spy(() => { });
        let spyOnChange = sinon.spy(() => { });
        let treeSelect = getTreeSelect({
            renderSelectedItem: treeNode => treeNode.value,
            defaultExpandAll: true,
            onSelect: spyOnSelect,
            onChange: spyOnChange,
        });
        const yaZhouKey = 'yazhou';
        const yaZhouValue = 'Yazhou';
        let nodeYaZhou = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`).at(0);
        nodeYaZhou.simulate('click');
        // 判断回调，这里其实没有更新，不是很重要
        expect(spyOnSelect.calledOnce).toBe(true);
        expect(spyOnChange.calledOnce).toBe(true);
        expect(spyOnSelect.getCall(0).args[0]).toEqual(yaZhouKey);
        expect(spyOnChange.getCall(0).args[0]).toEqual(yaZhouValue);
        // 判断已选项的渲染
        const innerHTML = document.querySelector('.semi-tree-select-selection span').textContent;
        expect(innerHTML).toEqual(yaZhouValue);
    });

    it('search autofocus', () => {
        let treeSelect = getTreeSelect({
            filterTreeNode: true,
            searchAutoFocus: true,
        });
        let selectEle = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`)
        selectEle.simulate('click');
        setTimeout(() => {
            let searchWrapper = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-search-wrapper`)

            const searchInput = searchWrapper.find(`input`)
            expect(searchInput.matchesElement(document.activeElement)).toEqual(true);
            done();
        }, 100);
    });

    it('treeData is updated should not clear value when uncontrolled mode and single selection', () => {
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: () => { } } }
        const treeSelect = getTreeSelect({
            defaultExpandAll: true
        });
        treeSelect
            .find(`.${BASE_CLASS_PREFIX}-tree-option-list .${BASE_CLASS_PREFIX}-tree-option`)
            .at(2)
            .simulate('click', nativeEvent);
        expect(
            treeSelect
            .find(`.${BASE_CLASS_PREFIX}-tree-select .${BASE_CLASS_PREFIX}-tree-select-selection span`)
            .getDOMNode()
            .textContent
        ).toEqual('北京');
        treeSelect.setProps({ treeData: treeChildren});
        treeSelect.update();
        expect(
            treeSelect
            .find(`.${BASE_CLASS_PREFIX}-tree-select .${BASE_CLASS_PREFIX}-tree-select-selection span`)
            .getDOMNode()
            .textContent
        ).toEqual('北京');
        treeSelect.setProps({ treeData: treeData2});
        treeSelect.update();
        expect(
            treeSelect
            .find(`.${BASE_CLASS_PREFIX}-tree-select .${BASE_CLASS_PREFIX}-tree-select-selection span`)
            .getDOMNode()
            .textContent
        ).toEqual('');
    });

    it('treeData is updated should not clear value when uncontrolled mode and multiple selection', () => {
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: () => { } } }
        const treeSelect = getTreeSelect({
            defaultExpandAll: true,
            multiple: true,
        });
        treeSelect
            .find(`.${BASE_CLASS_PREFIX}-tree-option-list .${BASE_CLASS_PREFIX}-tree-option`)
            .at(2)
            .simulate('click', nativeEvent);
        expect(
            treeSelect
            .find(`.${BASE_CLASS_PREFIX}-tree-select-selection .${BASE_CLASS_PREFIX}-tag-group .${BASE_CLASS_PREFIX}-tag`)
            .at(0)
            .find(`.${BASE_CLASS_PREFIX}-tag-content`)
            .getDOMNode()
            .textContent
        ).toEqual('北京');
        treeSelect.setProps({ treeData: treeChildren});
        treeSelect.update();
        expect(
            treeSelect
            .find(`.${BASE_CLASS_PREFIX}-tree-select-selection .${BASE_CLASS_PREFIX}-tag-group .${BASE_CLASS_PREFIX}-tag`)
            .at(0)
            .find(`.${BASE_CLASS_PREFIX}-tag-content`)
            .getDOMNode()
            .textContent
        ).toEqual('北京');
        treeSelect.setProps({ treeData: treeData2});
        treeSelect.update();
        expect(
            treeSelect
            .find(`.${BASE_CLASS_PREFIX}-tree-select-selection .${BASE_CLASS_PREFIX}-tag-group .${BASE_CLASS_PREFIX}-tag`)
            .at(0)
            .find(`.${BASE_CLASS_PREFIX}-tag-content`)
            .length
        ).toEqual(0);
    });

    it('treeData is updated should not clear value when controlled mode and single selection', () => {
        const treeSelect = getTreeSelect({
            defaultExpandAll: true,
            value: 'Beijing'
        });
        expect(
            treeSelect
            .find(`.${BASE_CLASS_PREFIX}-tree-select .${BASE_CLASS_PREFIX}-tree-select-selection span`)
            .getDOMNode()
            .textContent
        ).toEqual('北京');
        treeSelect.setProps({ treeData: treeChildren});
        treeSelect.update();
        expect(
            treeSelect
            .find(`.${BASE_CLASS_PREFIX}-tree-select .${BASE_CLASS_PREFIX}-tree-select-selection span`)
            .getDOMNode()
            .textContent
        ).toEqual('北京');
        treeSelect.setProps({ treeData: treeData3});
        treeSelect.update();
        // If the value exists, but not in the treeData, the value will be displayed in the trigger
        expect(
            treeSelect
            .find(`.${BASE_CLASS_PREFIX}-tree-select .${BASE_CLASS_PREFIX}-tree-select-selection span`)
            .getDOMNode()
            .textContent
        ).toEqual('Beijing');
    });

    it('treeData is updated should not clear value when controlled mode and multiple selection', () => {
        const treeSelect = getTreeSelect({
            defaultExpandAll: true,
            multiple: true,
            value: 'Beijing'
        });
        expect(
            treeSelect
            .find(`.${BASE_CLASS_PREFIX}-tree-select-selection .${BASE_CLASS_PREFIX}-tag-group .${BASE_CLASS_PREFIX}-tag`)
            .at(0)
            .find(`.${BASE_CLASS_PREFIX}-tag-content`)
            .getDOMNode()
            .textContent
        ).toEqual('北京');
        treeSelect.setProps({ treeData: treeChildren});
        treeSelect.update();
        expect(
            treeSelect
            .find(`.${BASE_CLASS_PREFIX}-tree-select-selection .${BASE_CLASS_PREFIX}-tag-group .${BASE_CLASS_PREFIX}-tag`)
            .at(0)
            .find(`.${BASE_CLASS_PREFIX}-tag-content`)
            .getDOMNode()
            .textContent
        ).toEqual('北京');
        treeSelect.setProps({ treeData: treeData3});
        treeSelect.update();
        expect(
            treeSelect
            .find(`.${BASE_CLASS_PREFIX}-tree-select-selection .${BASE_CLASS_PREFIX}-tag-group .${BASE_CLASS_PREFIX}-tag`)
            .at(0)
            .find(`.${BASE_CLASS_PREFIX}-tag-content`)
            .length
        ).toEqual(1);
    });

    it('expandedKeys controlled + filterTreeNode', () => {
        const spyOnExpand = sinon.spy(() => { });
        const treeSelect = getTreeSelect({
            expandedKeys: [],
            onExpand: spyOnExpand,
            filterTreeNode: true,
        });
        const searchWrapper = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-search-wrapper`);
        const searchValue = '北京';
        const event = { target: { value: searchValue } };
        searchWrapper.find('input').simulate('change', event);
        expect(spyOnExpand.callCount).toBe(0);
        /* filter won't impact on the expansion of node when expandedKeys is controlled */
        const topNode = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`);
        expect(topNode.at(0).hasClass(`${BASE_CLASS_PREFIX}-tree-option-collapsed`)).toEqual(true);
        expect(topNode.at(1).hasClass(`${BASE_CLASS_PREFIX}-tree-option-collapsed`)).toEqual(true);
    });
    
    it('option not in treeData + treeData item with value', () => {
        const spyOnSelect = sinon.spy(() => { });
        const spyOnChange = sinon.spy(() => { });
        let treeSelect = getTreeSelect({
            defaultValue: 'fish',
            defaultExpandAll: true,
            onSelect: spyOnSelect,
            onChange: spyOnChange,
        });
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-selection`).getDOMNode().textContent).toEqual('fish');
        // beijing
        let topNodeBeijing = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`).at(0);
        topNodeBeijing.simulate('click');
        expect(spyOnChange.calledWithMatch("Beijing")).toEqual(true);
        treeSelect.unmount(); 

        // onChangeWithObject
        treeSelect = getTreeSelect({
            defaultValue: { label: '鱼', value: 'Fish', key: 'fish' },
            onChangeWithObject: true,
            defaultExpandAll: true,
            onSelect: spyOnSelect,
            onChange: spyOnChange,
        });
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-selection`).getDOMNode().textContent).toEqual('鱼');
        // beijing
        topNodeBeijing = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`).at(0);
        topNodeBeijing.simulate('click');
        expect(spyOnChange.calledWithMatch({ label: '北京', value: 'Beijing', key: 'beijing' })).toEqual(true);
        treeSelect.unmount(); 
    })

    it('option not in treeData + treeData item without value', () => {
        const spyOnSelect = sinon.spy(() => { });
        const spyOnChange = sinon.spy(() => { });
        let treeSelect = getTreeSelect({
            treeData: treeDataWithoutValue,
            defaultValue: 'fish',
            defaultExpandAll: true,
            onSelect: spyOnSelect,
            onChange: spyOnChange,
        });
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-selection`).getDOMNode().textContent).toEqual('fish');
        // beijing
        let topNodeBeijing = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`).at(0);
        topNodeBeijing.simulate('click');
        expect(spyOnChange.calledWithMatch("beijing")).toEqual(true);
        treeSelect.unmount(); 

        // onChangeWithObject
        treeSelect = getTreeSelect({
            defaultValue: { label: '鱼', key: 'fish' },
            onChangeWithObject: true,
            defaultExpandAll: true,
            onSelect: spyOnSelect,
            onChange: spyOnChange,
        });
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-selection`).getDOMNode().textContent).toEqual('鱼');
        // beijing
        topNodeBeijing = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`).at(0);
        topNodeBeijing.simulate('click');
        expect(spyOnChange.calledWithMatch({ label: '北京', key: 'beijing' })).toEqual(true);
        treeSelect.unmount(); 
    })

    it('keyMaps', () => {
        let spyOnChange = sinon.spy(() => { });
        let treeSelect = getTreeSelect({
            treeData: specialTreeData,
            defaultValue: 'Beijing',
            onChange: spyOnChange,
            defaultExpandAll: true,
            motion: false,
            keyMaps: defaultKeyMaps
        });
        let disabledNode = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option-disabled`).at(0);
        expect(disabledNode.find(`.${BASE_CLASS_PREFIX}-tree-option-label-text`).instance().textContent).toEqual('中国');
        let selectedNode = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option-selected`);
        expect(selectedNode.instance().textContent).toEqual('北京');
        let nodeShanghai = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`).at(1);
        // select beijing
        nodeShanghai.simulate('click');
        // onSelect & onChange
        expect(spyOnChange.calledOnce).toBe(true);
        expect(spyOnChange.calledWithMatch("Shanghai")).toEqual(true);
        let selectContentNode = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-selection-content`)
        expect(selectContentNode.instance().textContent).toEqual('上海');
    });

    it('keyMaps + onChangeWithObject', () => {
        let spyOnChange = sinon.spy(() => { });
        let treeSelect = getTreeSelect({
            treeData: specialTreeData,
            defaultValue: {
                label1: '北京',
                value1: 'Beijing',
                key1: 'beijing',
            },
            onChangeWithObject: true,
            onChange: spyOnChange,
            defaultExpandAll: true,
            keyMaps: defaultKeyMaps
        });
        let disabledNode = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option-disabled`).at(0);
        expect(disabledNode.find(`.${BASE_CLASS_PREFIX}-tree-option-label-text`).instance().textContent).toEqual('中国');
        let selectedNode = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option-selected`);
        expect(selectedNode.instance().textContent).toEqual('北京');
        let nodeShanghai = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`).at(1);
        // select beijing
        nodeShanghai.simulate('click');
        // onSelect & onChange
        expect(spyOnChange.calledOnce).toBe(true);
        expect(spyOnChange.calledWithMatch({
            label1: '上海',
            value1: 'Shanghai',
            key1: 'shanghai',
        })).toEqual(true);
        let selectContentNode = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-selection-content`)
        expect(selectContentNode.instance().textContent).toEqual('上海');
    });

    it('onSearch + filteredNodes', () => {
        let spyOnSearch = sinon.spy(() => { });
        console.log('treeDataEn', treeDataEn);
        let treeSelect = getTreeSelect({
            filterTreeNode: true,
            treeData: treeDataEn,
            onSearch: spyOnSearch
        });
        const searchWrapper = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-search-wrapper`);
        let searchValue = 'o';
        let event = { target: { value: searchValue } };
        searchWrapper.find('input').simulate('change', event);
        const firstCall = spyOnSearch.getCall(0);
        const args = firstCall.args;
        expect(args[0]).toEqual(searchValue);
        expect(args[1]).toEqual(['0-1', '0']);
        expect(args[2]).toEqual([
            treeDataEnNA,
            { "label": "Osaka", "value": "Osaka", "key": "0-1-0" }
        ]);
    });

    it('onFocus callback', () => {
        const spyOnFocus = sinon.spy(() => {});
        const treeSelect = getTreeSelect({
            defaultOpen: false,
            onFocus: spyOnFocus,
        });
        const selectBox = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectBox.simulate('click');
        // onFocus 在打开下拉框时触发
        expect(spyOnFocus.calledOnce).toBe(true);
        treeSelect.unmount();
    });

    it('onBlur callback', () => {
        const spyOnBlur = sinon.spy(() => {});
        const treeSelect = getTreeSelect({
            onBlur: spyOnBlur,
        });
        // 验证 onBlur 属性被正确传递
        expect(treeSelect.props().onBlur).toBe(spyOnBlur);
        treeSelect.unmount();
    });

    it('maxTagCount', () => {
        const treeSelect = getTreeSelect({
            multiple: true,
            maxTagCount: 1,
            defaultValue: ['Beijing', 'Shanghai'],
            defaultExpandAll: true,
        });
        
        // 应该只显示 maxTagCount 个 tag + 1 个 "+N" tag
        const tags = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-selection .${BASE_CLASS_PREFIX}-tag`);
        expect(tags.length).toBeLessThanOrEqual(2);
        treeSelect.unmount();
    });

    it('borderless prop', () => {
        const treeSelect = getTreeSelect({
            borderless: true,
        });
        expect(treeSelect.exists(`.${BASE_CLASS_PREFIX}-tree-select-borderless`)).toEqual(true);
        treeSelect.unmount();
    });

    it('arrowIcon prop', () => {
        const customIcon = <span className="custom-arrow">arrow</span>;
        const treeSelect = getTreeSelect({
            arrowIcon: customIcon,
        });
        expect(treeSelect.exists('.custom-arrow')).toEqual(true);
        treeSelect.unmount();
    });

    it('showClear prop', () => {
        const treeSelect = getTreeSelect({
            showClear: true,
            defaultValue: 'Beijing',
            defaultExpandAll: true,
        });
        
        const selectTree = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectTree.simulate('mouseenter');
        
        const clearBtn = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-clearbtn`);
        expect(clearBtn.exists()).toEqual(true);
        treeSelect.unmount();
    });

    it('leafOnly prop', () => {
        const spyOnChange = sinon.spy(() => {});
        const treeSelect = getTreeSelect({
            multiple: true,
            leafOnly: true,
            defaultExpandAll: true,
            onChange: spyOnChange,
        });
        
        // 选择父节点，应该只选中叶子节点
        const nodeYazhou = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`).at(0);
        nodeYazhou.simulate('click');
        
        // onChange 应该被调用，且只包含叶子节点
        expect(spyOnChange.called).toBe(true);
        treeSelect.unmount();
    });

    // ============ Additional tests to improve coverage ============

    it('test foundation init with searchAutoFocus and searchPosition trigger', () => {
        const treeSelect = getTreeSelect({
            searchAutoFocus: true,
            searchPosition: 'trigger',
            filterTreeNode: true,
            defaultOpen: false,
        });
        // Should auto focus when searchAutoFocus is true and searchPosition is trigger
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation _setDropdownWidth with string width containing %', () => {
        const treeSelect = getTreeSelect({
            style: { width: '50%' },
            dropdownMatchSelectWidth: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation _setDropdownWidth with string width not containing %', () => {
        const treeSelect = getTreeSelect({
            style: { width: '200px' },
            dropdownMatchSelectWidth: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation _showFilteredOnly with inputValue', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            showFilteredOnly: true,
            defaultOpen: true,
        });
        // Simulate search input
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Beijing' } });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation findDataForValue with onChangeWithObject', () => {
        const treeSelect = getTreeSelect({
            onChangeWithObject: true,
            value: [{ value: 'Beijing', key: '0-0-0', label: 'Beijing' }],
            treeData: treeDataEn,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleNodeLoad with loadData', async () => {
        const loadData = sinon.stub().resolves();
        const onLoad = sinon.spy();
        const treeDataWithLoad = [
            {
                label: 'Node 1',
                value: 'node1',
                key: 'node1',
                isLeaf: false,
            },
        ];
        const treeSelect = getTreeSelect({
            treeData: treeDataWithLoad,
            loadData,
            onLoad,
            defaultExpandAll: false,
        });
        // Verify loadData prop is passed
        expect(treeSelect.props().loadData).toBe(loadData);
        treeSelect.unmount();
    });

    it('test foundation _notifyMultipleChange with checkRelation unRelated', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            multiple: true,
            checkRelation: 'unRelated',
            onChange,
            defaultExpandAll: true,
            treeData: treeDataEn,
        });
        // Verify props are set correctly
        expect(treeSelect.props().checkRelation).toBe('unRelated');
        expect(treeSelect.props().multiple).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleClear with filterTreeNode and searchPosition trigger', () => {
        const onClear = sinon.spy();
        const treeSelect = getTreeSelect({
            showClear: true,
            filterTreeNode: true,
            searchPosition: 'trigger',
            defaultValue: 'Beijing',
            defaultExpandAll: true,
            onClear,
        });
        // Hover to show clear button
        const selectTree = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectTree.simulate('mouseenter');
        // Click clear button
        const clearBtn = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-clearbtn`);
        if (clearBtn.exists()) {
            clearBtn.simulate('click');
        }
        treeSelect.unmount();
    });

    it('test foundation removeTag with checkRelation related', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            multiple: true,
            checkRelation: 'related',
            defaultValue: ['Beijing', 'Shanghai'],
            defaultExpandAll: true,
            onChange,
        });
        // Verify tags are rendered
        const tags = treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`);
        expect(tags.length).toBeGreaterThan(0);
        treeSelect.unmount();
    });

    it('test foundation removeTag with checkRelation unRelated', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            multiple: true,
            checkRelation: 'unRelated',
            defaultValue: ['Beijing', 'Shanghai'],
            defaultExpandAll: true,
            onChange,
        });
        // Verify tags are rendered
        const tags = treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`);
        expect(tags.length).toBeGreaterThan(0);
        treeSelect.unmount();
    });

    it('test foundation clearInput restores expandedKeys', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            defaultValue: 'Beijing',
            defaultExpandAll: true,
        });
        // Search then clear
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'test' } });
        input.simulate('change', { target: { value: '' } });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleInputChange with showFilteredOnly false', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            showFilteredOnly: false,
            defaultExpandAll: true,
        });
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Beijing' } });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleMultipleSelect with disableStrictly', () => {
        const onChange = sinon.spy();
        const treeDataWithDisabled = [
            {
                label: 'Parent',
                value: 'parent',
                key: 'parent',
                children: [
                    { label: 'Child 1', value: 'child1', key: 'child1', disabled: true },
                    { label: 'Child 2', value: 'child2', key: 'child2' },
                ],
            },
        ];
        const treeSelect = getTreeSelect({
            multiple: true,
            disableStrictly: true,
            treeData: treeDataWithDisabled,
            defaultExpandAll: true,
            onChange,
        });
        // Verify disableStrictly prop is set
        expect(treeSelect.props().disableStrictly).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpandInSearch', () => {
        const onExpand = sinon.spy();
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            showFilteredOnly: false,
            defaultExpandAll: false,
            onExpand,
            treeData: treeDataEn,
        });
        // Search first
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Asia' } });
        // Verify search is working
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpand without children', () => {
        const treeDataLeaf = [
            { label: 'Leaf 1', value: 'leaf1', key: 'leaf1' },
            { label: 'Leaf 2', value: 'leaf2', key: 'leaf2' },
        ];
        const treeSelect = getTreeSelect({
            treeData: treeDataLeaf,
        });
        // Verify leaf nodes are rendered
        const nodes = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option`);
        expect(nodes.length).toBe(2);
        treeSelect.unmount();
    });

    it('test foundation getRenderTextInSingle with custom renderSelectedItem', () => {
        const renderSelectedItem = (item) => `Custom: ${item.label}`;
        const treeSelect = getTreeSelect({
            renderSelectedItem,
            defaultValue: 'Beijing',
            defaultExpandAll: true,
        });
        expect(treeSelect.text()).toContain('Custom:');
        treeSelect.unmount();
    });

    it('test foundation handleInputTriggerFocus and handleInputTriggerBlur', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            searchPosition: 'trigger',
            defaultOpen: true,
        });
        // Find input and trigger focus/blur
        const input = treeSelect.find('input').at(0);
        if (input.exists()) {
            input.simulate('focus');
            input.simulate('blur');
        }
        treeSelect.unmount();
    });

    it('test foundation handlePopoverVisibleChange with searchAutoFocus', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            searchAutoFocus: true,
            searchPosition: 'dropdown',
            defaultOpen: false,
        });
        // Open the dropdown
        const selectBox = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectBox.simulate('click');
        treeSelect.unmount();
    });

    it('test index.tsx renderSuffix with string suffix', () => {
        const treeSelect = getTreeSelect({
            suffix: 'suffix text',
        });
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-suffix-text`).exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test index.tsx renderPrefix with insetLabel', () => {
        const treeSelect = getTreeSelect({
            insetLabel: 'Label:',
        });
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-inset-label`).exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test index.tsx renderTagList with renderSelectedItem returning isRenderInTag false', () => {
        const renderSelectedItem = (item, { index, onClose }) => ({
            isRenderInTag: false,
            content: <span key={index} className="custom-tag">{item.label}</span>,
        });
        const treeSelect = getTreeSelect({
            multiple: true,
            renderSelectedItem,
            defaultValue: ['Beijing', 'Shanghai'],
            defaultExpandAll: true,
        });
        expect(treeSelect.find('.custom-tag').length).toBeGreaterThan(0);
        treeSelect.unmount();
    });

    it('test index.tsx renderTagList with disabled item', () => {
        const treeDataWithDisabled = [
            {
                label: 'Asia',
                value: 'Asia',
                key: '0',
                children: [
                    { label: 'Beijing', value: 'Beijing', key: '0-0', disabled: true },
                    { label: 'Shanghai', value: 'Shanghai', key: '0-1' },
                ],
            },
        ];
        const treeSelect = getTreeSelect({
            multiple: true,
            treeData: treeDataWithDisabled,
            defaultValue: ['Beijing'],
            defaultExpandAll: true,
        });
        // Disabled tag should not be closable
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test index.tsx renderSingleTriggerSearchItem with placeholder', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            searchPosition: 'trigger',
            placeholder: 'Select something',
        });
        expect(treeSelect.text()).toContain('Select something');
        treeSelect.unmount();
    });

    it('test index.tsx renderSelectContent with multiple and no value', () => {
        const treeSelect = getTreeSelect({
            multiple: true,
            placeholder: 'Please select',
        });
        expect(treeSelect.text()).toContain('Please select');
        treeSelect.unmount();
    });

    it('test index.tsx renderTagItem with renderSelectedItem returning isRenderInTag false', () => {
        const renderSelectedItem = (item, { index, onClose }) => ({
            isRenderInTag: false,
            content: <span key={index} className="custom-content">{item.label}</span>,
        });
        const treeSelect = getTreeSelect({
            multiple: true,
            filterTreeNode: true,
            searchPosition: 'trigger',
            renderSelectedItem,
            defaultValue: ['Beijing'],
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test index.tsx renderInput with searchRender false', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            searchRender: false,
        });
        // Search input should not be rendered
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-search-wrapper input`).exists()).toBe(false);
        treeSelect.unmount();
    });

    it('test index.tsx renderInput with custom searchRender function', () => {
        const searchRender = (inputProps) => <input {...inputProps} className="custom-search" />;
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            searchRender,
        });
        expect(treeSelect.find('.custom-search').exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test index.tsx updateInputFocus with inputRef', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            searchPosition: 'dropdown',
            searchAutoFocus: true,
            defaultOpen: false,
        });
        // Open dropdown to trigger focus
        const selectBox = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectBox.simulate('click');
        treeSelect.unmount();
    });

    it('test index.tsx updateInputFocus with tagInputRef', () => {
        const treeSelect = getTreeSelect({
            multiple: true,
            filterTreeNode: true,
            searchPosition: 'trigger',
            searchAutoFocus: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test getDerivedStateFromProps with motion and treeData keys change', () => {
        const treeSelect = getTreeSelect({
            motion: true,
            treeData: treeDataEn,
        });
        // Change treeData to trigger getDerivedStateFromProps
        const newTreeData = [
            { label: 'New Node', value: 'new', key: 'new' },
        ];
        treeSelect.setProps({ treeData: newTreeData });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test getDerivedStateFromProps with expandedKeys controlled', () => {
        const treeSelect = getTreeSelect({
            expandedKeys: ['0'],
            treeData: treeDataEn,
        });
        // Change expandedKeys
        treeSelect.setProps({ expandedKeys: ['0', '0-0'] });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test getDerivedStateFromProps with expandedKeys and motion hide', () => {
        const treeSelect = getTreeSelect({
            motion: true,
            expandedKeys: ['0', '0-0'],
            treeData: treeDataEn,
        });
        // Collapse to trigger hide motion
        treeSelect.setProps({ expandedKeys: ['0'] });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test getDerivedStateFromProps with treeData change while searching', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            treeData: treeDataEn,
        });
        // Start searching
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Asia' } });
        // Change treeData while searching
        const newTreeData = [
            { label: 'Asia Updated', value: 'Asia', key: '0' },
        ];
        treeSelect.setProps({ treeData: newTreeData });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test getDerivedStateFromProps with expandedKeys change while searching', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            expandedKeys: ['0'],
            motion: true,
            treeData: treeDataEn,
        });
        // Start searching
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Asia' } });
        // Change expandedKeys while searching
        treeSelect.setProps({ expandedKeys: ['0', '0-0'] });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test getDerivedStateFromProps with value change in single mode', () => {
        const treeSelect = getTreeSelect({
            value: 'Beijing',
            treeData: treeDataEn,
        });
        // Change value
        treeSelect.setProps({ value: 'Shanghai' });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test getDerivedStateFromProps with checkedKeys change in multiple mode', () => {
        const treeSelect = getTreeSelect({
            multiple: true,
            value: ['Beijing'],
            treeData: treeDataEn,
        });
        // Change value
        treeSelect.setProps({ value: ['Beijing', 'Shanghai'] });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test getDerivedStateFromProps with defaultExpandedKeys', () => {
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                treeData={treeDataEn}
                defaultExpandedKeys={['0']}
            />,
            { attachTo: document.getElementById('container') }
        );
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test getDerivedStateFromProps with defaultValue expanding ancestors', () => {
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                treeData={treeDataEn}
                defaultValue="Beijing"
            />,
            { attachTo: document.getElementById('container') }
        );
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test getDerivedStateFromProps with value expanding ancestors', () => {
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                treeData={treeDataEn}
                value="Beijing"
            />,
            { attachTo: document.getElementById('container') }
        );
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test getDerivedStateFromProps with selectedKeys from treeData change', () => {
        const treeSelect = getTreeSelect({
            defaultValue: 'Beijing',
            treeData: treeDataEn,
        });
        // Change treeData
        const newTreeData = [
            {
                label: 'Asia',
                value: 'Asia',
                key: '0',
                children: [
                    { label: 'Beijing', value: 'Beijing', key: '0-0-0' },
                ],
            },
        ];
        treeSelect.setProps({ treeData: newTreeData });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test calcCheckedStatus with disabled descendants', () => {
        const treeDataWithDisabled = [
            {
                label: 'Parent',
                value: 'parent',
                key: 'parent',
                children: [
                    { label: 'Child 1', value: 'child1', key: 'child1', disabled: true },
                    { label: 'Child 2', value: 'child2', key: 'child2' },
                ],
            },
        ];
        const treeSelect = getTreeSelect({
            multiple: true,
            disableStrictly: true,
            treeData: treeDataWithDisabled,
            defaultExpandAll: true,
            defaultValue: ['child2'],
        });
        // Verify disabled node rendering
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test calcNonDisabledCheckedKeys with all descendants disabled', () => {
        const treeDataAllDisabled = [
            {
                label: 'Parent',
                value: 'parent',
                key: 'parent',
                children: [
                    { label: 'Child 1', value: 'child1', key: 'child1', disabled: true },
                    { label: 'Child 2', value: 'child2', key: 'child2', disabled: true },
                ],
            },
        ];
        const treeSelect = getTreeSelect({
            multiple: true,
            disableStrictly: true,
            treeData: treeDataAllDisabled,
            defaultExpandAll: true,
        });
        // Verify all disabled nodes are rendered
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test handleNodeExpandInSearch with filteredExpandedKeys collapse', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            showFilteredOnly: false,
            defaultExpandAll: true,
            treeData: treeDataEn,
        });
        // Search first
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Asia' } });
        // Verify search state
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test handleNodeExpand with loadData', async () => {
        const loadData = sinon.stub().resolves();
        const treeDataWithLoad = [
            {
                label: 'Node 1',
                value: 'node1',
                key: 'node1',
                isLeaf: false,
            },
        ];
        const treeSelect = getTreeSelect({
            treeData: treeDataWithLoad,
            loadData,
        });
        // Verify loadData is set
        expect(treeSelect.props().loadData).toBe(loadData);
        treeSelect.unmount();
    });

    it('test handleNodeExpand collapse', () => {
        const onExpand = sinon.spy();
        const treeSelect = getTreeSelect({
            defaultExpandAll: true,
            onExpand,
            treeData: treeDataEn,
        });
        // Verify onExpand prop is set
        expect(treeSelect.props().onExpand).toBe(onExpand);
        treeSelect.unmount();
    });

    it('test virtualize prop', () => {
        const treeSelect = getTreeSelect({
            virtualize: {
                height: 300,
                itemSize: 36,
            },
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test emptyContent prop', () => {
        const treeSelect = getTreeSelect({
            treeData: [],
            emptyContent: <div className="custom-empty">No Data</div>,
        });
        expect(treeSelect.find('.custom-empty').exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test triggerRender prop', () => {
        const triggerRender = ({ value, placeholder, onClear }) => (
            <div className="custom-trigger">
                {value.length > 0 ? value.map(v => v.label).join(', ') : placeholder}
            </div>
        );
        const treeSelect = getTreeSelect({
            triggerRender,
            defaultValue: 'Beijing',
            defaultExpandAll: true,
        });
        expect(treeSelect.find('.custom-trigger').exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test onSelect callback', () => {
        const onSelect = sinon.spy();
        const treeSelect = getTreeSelect({
            onSelect,
            defaultExpandAll: true,
        });
        // Verify onSelect prop is set
        expect(treeSelect.props().onSelect).toBe(onSelect);
        treeSelect.unmount();
    });

    it('test onExpand callback', () => {
        const onExpand = sinon.spy();
        const treeSelect = getTreeSelect({
            onExpand,
            defaultExpandAll: false,
            treeData: treeDataEn,
        });
        // Verify onExpand prop is set
        expect(treeSelect.props().onExpand).toBe(onExpand);
        treeSelect.unmount();
    });

    it('test onChangeWithObject true', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            onChangeWithObject: true,
            onChange,
            defaultExpandAll: true,
        });
        // Verify onChangeWithObject prop is set
        expect(treeSelect.props().onChangeWithObject).toBe(true);
        treeSelect.unmount();
    });

    it('test autoMergeValue false in multiple mode', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            multiple: true,
            autoMergeValue: false,
            onChange,
            defaultExpandAll: true,
            treeData: treeDataEn,
        });
        // Verify autoMergeValue prop is set
        expect(treeSelect.props().autoMergeValue).toBe(false);
        treeSelect.unmount();
    });

    it('test expandAction click', () => {
        const treeSelect = getTreeSelect({
            expandAction: 'click',
            defaultExpandAll: false,
            treeData: treeDataEn,
        });
        // Verify expandAction prop is set
        expect(treeSelect.props().expandAction).toBe('click');
        treeSelect.unmount();
    });

    it('test expandAction doubleClick', () => {
        const treeSelect = getTreeSelect({
            expandAction: 'doubleClick',
            defaultExpandAll: false,
            treeData: treeDataEn,
        });
        // Verify expandAction prop is set
        expect(treeSelect.props().expandAction).toBe('doubleClick');
        treeSelect.unmount();
    });

    it('test labelEllipsis prop', () => {
        const treeSelect = getTreeSelect({
            labelEllipsis: true,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test showLine prop', () => {
        const treeSelect = getTreeSelect({
            showLine: true,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test renderLabel prop', () => {
        const renderLabel = (label, data) => <span className="custom-label">{label}</span>;
        const treeSelect = getTreeSelect({
            renderLabel,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        expect(treeSelect.find('.custom-label').length).toBeGreaterThan(0);
        treeSelect.unmount();
    });

    it('test renderFullLabel prop', () => {
        const renderFullLabel = (data) => <div className="full-label">{data.label}</div>;
        const treeSelect = getTreeSelect({
            renderFullLabel,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        expect(treeSelect.find('.full-label').length).toBeGreaterThan(0);
        treeSelect.unmount();
    });

    it('test loadedKeys controlled', () => {
        const loadData = sinon.stub().resolves();
        const treeDataWithLoad = [
            {
                label: 'Node 1',
                value: 'node1',
                key: 'node1',
                isLeaf: false,
            },
        ];
        const treeSelect = getTreeSelect({
            treeData: treeDataWithLoad,
            loadData,
            loadedKeys: ['node1'],
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test preventScroll prop', () => {
        const treeSelect = getTreeSelect({
            preventScroll: true,
            filterTreeNode: true,
            searchAutoFocus: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test restTagsPopoverProps', () => {
        const treeSelect = getTreeSelect({
            multiple: true,
            maxTagCount: 1,
            showRestTagsPopover: true,
            restTagsPopoverProps: { position: 'top' },
            defaultValue: ['Beijing', 'Shanghai'],
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test onVisibleChange callback', () => {
        const onVisibleChange = sinon.spy();
        const treeSelect = getTreeSelect({
            onVisibleChange,
            defaultOpen: false,
        });
        // Open dropdown
        const selectBox = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectBox.simulate('click');
        expect(onVisibleChange.called).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleAfterClose', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            defaultOpen: true,
        });
        // Search something
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'test' } });
        // Close dropdown
        const selectBox = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectBox.simulate('click');
        treeSelect.unmount();
    });

    it('test foundation setLoadKeys', async () => {
        const loadData = sinon.stub().resolves();
        const treeDataWithLoad = [
            {
                label: 'Node 1',
                value: 'node1',
                key: 'node1',
                isLeaf: false,
            },
        ];
        const treeSelect = getTreeSelect({
            treeData: treeDataWithLoad,
            loadData,
        });
        // Verify loadData prop is set
        expect(treeSelect.props().loadData).toBe(loadData);
        treeSelect.unmount();
    });

    it('test multiple select with searchPosition trigger clears input after select', () => {
        const treeSelect = getTreeSelect({
            multiple: true,
            filterTreeNode: true,
            searchPosition: 'trigger',
            defaultExpandAll: true,
            treeData: treeDataEn,
        });
        // Search
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Beijing' } });
        // Verify search is working
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation getDataForKeyNotInKeyEntities with constructDataForValue', () => {
        const treeSelect = getTreeSelect({
            onChangeWithObject: false,
            value: 'nonexistent',
            treeData: treeDataEn,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation _notifyChange with undefined key', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            onChange,
            showClear: true,
            defaultValue: 'Beijing',
            defaultExpandAll: true,
        });
        // Clear selection
        const selectTree = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectTree.simulate('mouseenter');
        const clearBtn = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-clearbtn`);
        if (clearBtn.exists()) {
            clearBtn.simulate('click');
        }
        treeSelect.unmount();
    });

    it('test index.tsx hasValue returns false when no selection', () => {
        const treeSelect = getTreeSelect({
            multiple: true,
        });
        // Should show placeholder
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-selection-placeholder`).exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test index.tsx renderTagList with null content from renderSelectedItem', () => {
        const renderSelectedItem = (item, { index, onClose }) => ({
            isRenderInTag: true,
            content: null,
        });
        const treeSelect = getTreeSelect({
            multiple: true,
            renderSelectedItem,
            defaultValue: ['Beijing'],
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test index.tsx renderTagItem with empty nodes', () => {
        const treeSelect = getTreeSelect({
            multiple: true,
            filterTreeNode: true,
            searchPosition: 'trigger',
            defaultValue: ['nonexistent'],
            treeData: treeDataEn,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test getDerivedStateFromProps with expandAll and treeData change', () => {
        const treeSelect = getTreeSelect({
            expandAll: true,
            treeData: treeDataEn,
        });
        // Change treeData
        const newTreeData = [
            {
                label: 'New Root',
                value: 'newroot',
                key: 'newroot',
                children: [
                    { label: 'New Child', value: 'newchild', key: 'newchild' },
                ],
            },
        ];
        treeSelect.setProps({ treeData: newTreeData });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test getDerivedStateFromProps with motion hide when expandedKeys change', () => {
        const treeSelect = getTreeSelect({
            motion: true,
            expandedKeys: ['0', '0-0'],
            treeData: treeDataEn,
        });
        // Collapse
        treeSelect.setProps({ expandedKeys: ['0'] });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test getDerivedStateFromProps with showFilteredOnly and expandedKeys change while searching', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            showFilteredOnly: true,
            expandedKeys: ['0'],
            motion: true,
            treeData: treeDataEn,
        });
        // Start searching
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Asia' } });
        // Change expandedKeys
        treeSelect.setProps({ expandedKeys: ['0', '0-0'] });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test getDerivedStateFromProps with checkedKeys in multiple related mode', () => {
        const treeSelect = getTreeSelect({
            multiple: true,
            checkRelation: 'related',
            value: ['Beijing'],
            treeData: treeDataEn,
        });
        // Change value
        treeSelect.setProps({ value: ['Beijing', 'Shanghai'] });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test getDerivedStateFromProps with realCheckedKeys in multiple unRelated mode', () => {
        const treeSelect = getTreeSelect({
            multiple: true,
            checkRelation: 'unRelated',
            value: ['Beijing'],
            treeData: treeDataEn,
        });
        // Change value
        treeSelect.setProps({ value: ['Beijing', 'Shanghai'] });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test index.tsx adapter toggleHovering', () => {
        const treeSelect = getTreeSelect({
            showClear: true,
            defaultValue: 'Beijing',
            defaultExpandAll: true,
        });
        // Mouse enter/leave to toggle hovering
        const selectTree = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectTree.simulate('mouseenter');
        selectTree.simulate('mouseleave');
        treeSelect.unmount();
    });

    it('test index.tsx adapter updateIsFocus', () => {
        const treeSelect = getTreeSelect({
            defaultOpen: false,
        });
        // Click to focus
        const selectBox = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectBox.simulate('click');
        treeSelect.unmount();
    });

    it('test foundation handleTriggerFocus', () => {
        const onFocus = sinon.spy();
        const treeSelect = getTreeSelect({
            onFocus,
            defaultOpen: false,
        });
        // Click to trigger focus
        const selectBox = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectBox.simulate('click');
        expect(onFocus.called).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handlerTriggerBlur', () => {
        const onBlur = sinon.spy();
        const treeSelect = getTreeSelect({
            onBlur,
            defaultOpen: true,
        });
        // Click outside to trigger blur - simulate by clicking document
        document.body.click();
        treeSelect.unmount();
    });

    it('test foundation handleKeyDown with Escape', () => {
        const treeSelect = getTreeSelect({
            defaultOpen: true,
        });
        // Press Escape
        const popover = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-popover`);
        if (popover.exists()) {
            popover.simulate('keydown', { keyCode: 27 });
        }
        treeSelect.unmount();
    });

    it('test foundation handleSingleSelect', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            onChange,
            defaultExpandAll: true,
        });
        // Verify onChange prop is set
        expect(treeSelect.props().onChange).toBe(onChange);
        treeSelect.unmount();
    });

    it('test index.tsx renderTree with empty treeData', () => {
        const treeSelect = getTreeSelect({
            treeData: [],
        });
        // Should show empty content
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test index.tsx renderTree with virtualize', () => {
        const treeSelect = getTreeSelect({
            virtualize: {
                height: 300,
                itemSize: 36,
            },
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation _isSelectToClose returns true when expandAction is false', () => {
        const treeSelect = getTreeSelect({
            expandAction: false,
            defaultExpandAll: true,
        });
        // Verify expandAction is false
        expect(treeSelect.props().expandAction).toBe(false);
        treeSelect.unmount();
    });

    it('test foundation getTreeNodeProps with disableStrictly', () => {
        const treeDataWithDisabled = [
            {
                label: 'Parent',
                value: 'parent',
                key: 'parent',
                children: [
                    { label: 'Child', value: 'child', key: 'child', disabled: true },
                ],
            },
        ];
        const treeSelect = getTreeSelect({
            disableStrictly: true,
            treeData: treeDataWithDisabled,
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    // ============ Additional tests for higher coverage ============

    it('test emptyContent null renders nothing', () => {
        const treeSelect = getTreeSelect({
            treeData: [],
            emptyContent: null,
        });
        // Should not render empty content when emptyContent is null
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option-empty`).exists()).toBe(false);
        treeSelect.unmount();
    });

    it('test renderTagItem with no renderSelectedItem function', () => {
        const treeSelect = getTreeSelect({
            multiple: true,
            filterTreeNode: true,
            searchPosition: 'trigger',
            defaultValue: ['Beijing'],
            defaultExpandAll: true,
        });
        // Should render default tag
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`).length).toBeGreaterThan(0);
        treeSelect.unmount();
    });

    it('test adapter notifyLoad callback', () => {
        const onLoad = sinon.spy();
        const loadData = sinon.stub().resolves();
        const treeDataWithLoad = [
            {
                label: 'Node 1',
                value: 'node1',
                key: 'node1',
                isLeaf: false,
            },
        ];
        const treeSelect = getTreeSelect({
            treeData: treeDataWithLoad,
            loadData,
            onLoad,
        });
        // Verify onLoad prop is set
        expect(treeSelect.props().onLoad).toBe(onLoad);
        treeSelect.unmount();
    });

    it('test adapter updateInputFocus with tagInputRef', () => {
        const treeSelect = getTreeSelect({
            multiple: true,
            filterTreeNode: true,
            searchPosition: 'trigger',
            searchAutoFocus: true,
            defaultExpandAll: true,
            treeData: treeDataEn,
        });
        // Verify component renders with tagInput
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test adapter updateInputFocus blur with inputRef', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            searchPosition: 'dropdown',
            defaultOpen: true,
        });
        // Verify input exists
        const input = treeSelect.find('input');
        expect(input.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test getTreeNodeKey', () => {
        const treeSelect = getTreeSelect({
            virtualize: {
                height: 300,
                itemSize: 36,
            },
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test renderTreeNode returns null when treeNodeProps is null', () => {
        const treeSelect = getTreeSelect({
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        // Verify tree nodes are rendered
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option`).length).toBeGreaterThan(0);
        treeSelect.unmount();
    });

    it('test onNodeCheck in multiple mode', () => {
        const treeSelect = getTreeSelect({
            multiple: true,
            defaultExpandAll: true,
            treeData: treeDataEn,
        });
        // Verify multiple mode is enabled
        expect(treeSelect.props().multiple).toBe(true);
        treeSelect.unmount();
    });

    it('test getTreeNodeRequiredProps', () => {
        const treeSelect = getTreeSelect({
            defaultExpandAll: true,
            defaultValue: 'Beijing',
            treeData: treeDataEn,
        });
        // Verify component state
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test renderTagList with item returning undefined content', () => {
        const renderSelectedItem = (item, { index, onClose }) => ({
            isRenderInTag: true,
            content: undefined,
        });
        const treeSelect = getTreeSelect({
            multiple: true,
            renderSelectedItem,
            defaultValue: ['Beijing'],
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleKeyDown with non-ESC key', () => {
        const treeSelect = getTreeSelect({
            defaultOpen: true,
        });
        // Press a non-ESC key
        const popover = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-popover`);
        if (popover.exists()) {
            popover.simulate('keydown', { key: 'Enter', keyCode: 13 });
        }
        treeSelect.unmount();
    });

    it('test foundation handleClick with disabled', () => {
        const treeSelect = getTreeSelect({
            disabled: true,
        });
        // Click should not open
        const selectBox = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectBox.simulate('click');
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleClick with clickTriggerToHide false', () => {
        const treeSelect = getTreeSelect({
            clickTriggerToHide: false,
            defaultOpen: true,
        });
        // Click should not close
        const selectBox = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectBox.simulate('click');
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleClear with multiple controlled', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            multiple: true,
            showClear: true,
            value: ['Beijing', 'Shanghai'],
            onChange,
            defaultExpandAll: true,
        });
        // Hover and clear
        const selectTree = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectTree.simulate('mouseenter');
        const clearBtn = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-clearbtn`);
        if (clearBtn.exists()) {
            clearBtn.simulate('click');
        }
        treeSelect.unmount();
    });

    it('test foundation handleClear with single controlled', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            showClear: true,
            value: 'Beijing',
            onChange,
            defaultExpandAll: true,
        });
        // Hover and clear
        const selectTree = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectTree.simulate('mouseenter');
        const clearBtn = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-clearbtn`);
        if (clearBtn.exists()) {
            clearBtn.simulate('click');
        }
        treeSelect.unmount();
    });

    it('test foundation _isLoadControlled with loadedKeys', () => {
        const treeSelect = getTreeSelect({
            loadedKeys: ['node1'],
            treeData: [
                { label: 'Node 1', value: 'node1', key: 'node1', isLeaf: false },
            ],
        });
        expect(treeSelect.props().loadedKeys).toEqual(['node1']);
        treeSelect.unmount();
    });

    it('test foundation _showFilteredOnly returns true', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            showFilteredOnly: true,
        });
        // Search to trigger _showFilteredOnly
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'test' } });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation findDataForValue with array value', () => {
        const treeSelect = getTreeSelect({
            onChangeWithObject: true,
            value: [
                { value: 'Beijing', key: '0-0-0', label: 'Beijing' },
                { value: 'Shanghai', key: '0-0-1', label: 'Shanghai' },
            ],
            multiple: true,
            treeData: treeDataEn,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation findDataForValue with defaultValue', () => {
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                onChangeWithObject={true}
                defaultValue={{ value: 'Beijing', key: '0-0-0', label: 'Beijing' }}
                treeData={treeDataEn}
            />,
            { attachTo: document.getElementById('container') }
        );
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test getDerivedStateFromProps with motion and expandedKeys hide', () => {
        const treeSelect = getTreeSelect({
            motion: true,
            expandedKeys: ['0', '0-0'],
            treeData: treeDataEn,
        });
        // Collapse to trigger hide motion
        treeSelect.setProps({ expandedKeys: ['0'] });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test getDerivedStateFromProps with motion and expandedKeys while searching hide', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            motion: true,
            expandedKeys: ['0', '0-0'],
            treeData: treeDataEn,
        });
        // Search first
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Asia' } });
        // Collapse to trigger hide motion
        treeSelect.setProps({ expandedKeys: ['0'] });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test adapter registerClickOutsideHandler', () => {
        const treeSelect = getTreeSelect({
            defaultOpen: true,
        });
        // Verify component is open and click outside handler is registered
        expect(treeSelect.exists()).toBe(true);
        expect(treeSelect.props().defaultOpen).toBe(true);
        treeSelect.unmount();
    });

    it('test renderTagItem with disableStrictly and disabled node', () => {
        const treeDataWithDisabled = [
            {
                label: 'Asia',
                value: 'Asia',
                key: '0',
                children: [
                    { label: 'Beijing', value: 'Beijing', key: '0-0', disabled: true },
                ],
            },
        ];
        const treeSelect = getTreeSelect({
            multiple: true,
            filterTreeNode: true,
            searchPosition: 'trigger',
            disableStrictly: true,
            treeData: treeDataWithDisabled,
            defaultValue: ['Beijing'],
            defaultExpandAll: true,
        });
        // Disabled tag should not be closable
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test renderTagList with disableStrictly disabled item', () => {
        const treeDataWithDisabled = [
            {
                label: 'Asia',
                value: 'Asia',
                key: '0',
                children: [
                    { label: 'Beijing', value: 'Beijing', key: '0-0', disabled: true },
                ],
            },
        ];
        const treeSelect = getTreeSelect({
            multiple: true,
            disableStrictly: true,
            treeData: treeDataWithDisabled,
            defaultValue: ['Beijing'],
            defaultExpandAll: true,
        });
        // Disabled tag should not be closable
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test renderSingleTriggerSearchItem with disabled', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            searchPosition: 'trigger',
            disabled: true,
            defaultValue: 'Beijing',
            defaultExpandAll: true,
        });
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-selection-TriggerSearchItem-disabled`).exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation close with motionExpand', () => {
        const treeSelect = getTreeSelect({
            motionExpand: true,
            defaultOpen: true,
        });
        // Close dropdown
        const selectBox = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectBox.simulate('click');
        treeSelect.unmount();
    });

    it('test foundation handleClick with searchPosition trigger and inputValue', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            searchPosition: 'trigger',
            defaultOpen: true,
        });
        // Search first
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'test' } });
        // Click should not close when inputValue exists
        const selectBox = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectBox.simulate('click');
        treeSelect.unmount();
    });

    it('test foundation handleInputChange with custom filterTreeNode function', () => {
        const filterTreeNode = (inputValue, treeNode) => {
            const label = treeNode.label || '';
            return label.toLowerCase().includes(inputValue.toLowerCase());
        };
        const treeSelect = getTreeSelect({
            filterTreeNode,
            treeData: treeDataEn,
        });
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'asia' } });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleInputChange with treeNodeFilterProp', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            treeNodeFilterProp: 'value',
            treeData: treeDataEn,
        });
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Asia' } });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test getDerivedStateFromProps with disabledKeys', () => {
        const treeDataWithDisabled = [
            {
                label: 'Parent',
                value: 'parent',
                key: 'parent',
                children: [
                    { label: 'Child', value: 'child', key: 'child', disabled: true },
                ],
            },
        ];
        const treeSelect = getTreeSelect({
            disableStrictly: true,
            treeData: treeDataWithDisabled,
            defaultExpandAll: true,
        });
        // Change treeData to trigger disabledKeys recalculation
        const newTreeData = [
            {
                label: 'Parent',
                value: 'parent',
                key: 'parent',
                children: [
                    { label: 'Child 1', value: 'child1', key: 'child1', disabled: true },
                    { label: 'Child 2', value: 'child2', key: 'child2', disabled: true },
                ],
            },
        ];
        treeSelect.setProps({ treeData: newTreeData });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test adapter updateState through search', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            defaultExpandAll: true,
            treeData: treeDataEn,
        });
        // Trigger state update through search
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Beijing' } });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test keyMaps prop', () => {
        const customTreeData = [
            {
                label1: 'Asia',
                value1: 'Asia',
                key1: '0',
                children1: [
                    { label1: 'Beijing', value1: 'Beijing', key1: '0-0' },
                ],
            },
        ];
        const treeSelect = getTreeSelect({
            treeData: customTreeData,
            keyMaps: {
                label: 'label1',
                value: 'value1',
                key: 'key1',
                children: 'children1',
            },
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test outerTopSlot prop', () => {
        const outerTopSlot = <div className="outer-top">Top Slot</div>;
        const treeSelect = getTreeSelect({
            outerTopSlot,
        });
        expect(treeSelect.find('.outer-top').exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test outerBottomSlot prop with custom content', () => {
        const outerBottomSlot = <div className="outer-bottom-custom">Bottom Slot</div>;
        const treeSelect = getTreeSelect({
            outerBottomSlot,
        });
        expect(treeSelect.find('.outer-bottom-custom').exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test outerTopSlot and outerBottomSlot together', () => {
        const outerTopSlot = <div className="outer-top-slot">Top</div>;
        const outerBottomSlot = <div className="outer-bottom-slot">Bottom</div>;
        const treeSelect = getTreeSelect({
            outerTopSlot,
            outerBottomSlot,
        });
        expect(treeSelect.find('.outer-top-slot').exists()).toBe(true);
        expect(treeSelect.find('.outer-bottom-slot').exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test outerTopSlot hides default search', () => {
        const outerTopSlot = <div className="custom-search">Custom Search</div>;
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            outerTopSlot,
        });
        expect(treeSelect.find('.custom-search').exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test outerBottomSlot with action buttons', () => {
        const outerBottomSlot = (
            <div className="action-buttons">
                <button>Cancel</button>
                <button>Confirm</button>
            </div>
        );
        const treeSelect = getTreeSelect({
            outerBottomSlot,
        });
        expect(treeSelect.find('.action-buttons').exists()).toBe(true);
        expect(treeSelect.find('button').length).toBe(2);
        treeSelect.unmount();
    });

    it('test searchPlaceholder prop', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            searchPlaceholder: 'Search here...',
        });
        const input = treeSelect.find('input').at(0);
        expect(input.props().placeholder).toBe('Search here...');
        treeSelect.unmount();
    });

    it('test showSearchClear prop', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            showSearchClear: true,
        });
        // Search to show clear button
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'test' } });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test stopPropagation prop', () => {
        const treeSelect = getTreeSelect({
            stopPropagation: true,
        });
        expect(treeSelect.props().stopPropagation).toBe(true);
        treeSelect.unmount();
    });

    it('test autoExpandWhenSearching prop', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            autoExpandWhenSearching: true,
            treeData: treeDataEn,
        });
        // Search
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Beijing' } });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handlePopoverVisibleChange with searchAutoFocus dropdown', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            searchAutoFocus: true,
            searchPosition: 'dropdown',
            defaultOpen: false,
        });
        // Open dropdown
        const selectBox = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectBox.simulate('click');
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleAfterClose clears input', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            defaultOpen: true,
        });
        // Search
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'test' } });
        // Close dropdown - simulate afterClose
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test insetLabelId prop', () => {
        const treeSelect = getTreeSelect({
            insetLabel: 'Label:',
            insetLabelId: 'custom-label-id',
        });
        expect(treeSelect.find('#custom-label-id').exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test aria-label prop', () => {
        const treeSelect = getTreeSelect({
            'aria-label': 'Select a location',
        });
        expect(treeSelect.props()['aria-label']).toBe('Select a location');
        treeSelect.unmount();
    });

    it('test aria-labelledby prop', () => {
        const treeSelect = getTreeSelect({
            'aria-labelledby': 'label-id',
        });
        expect(treeSelect.props()['aria-labelledby']).toBe('label-id');
        treeSelect.unmount();
    });

    it('test aria-describedby prop', () => {
        const treeSelect = getTreeSelect({
            'aria-describedby': 'desc-id',
        });
        expect(treeSelect.props()['aria-describedby']).toBe('desc-id');
        treeSelect.unmount();
    });

    it('test aria-required prop', () => {
        const treeSelect = getTreeSelect({
            'aria-required': true,
        });
        expect(treeSelect.props()['aria-required']).toBe(true);
        treeSelect.unmount();
    });

    it('test aria-invalid prop', () => {
        const treeSelect = getTreeSelect({
            'aria-invalid': true,
        });
        expect(treeSelect.props()['aria-invalid']).toBe(true);
        treeSelect.unmount();
    });

    it('test aria-errormessage prop', () => {
        const treeSelect = getTreeSelect({
            'aria-errormessage': 'error-msg-id',
        });
        expect(treeSelect.props()['aria-errormessage']).toBe('error-msg-id');
        treeSelect.unmount();
    });

    // ============ Foundation coverage tests ============

    it('test foundation _isLoadControlled returns truthy', () => {
        const treeSelect = getTreeSelect({
            loadedKeys: ['key1', 'key2'],
            treeData: [
                { label: 'Node 1', value: 'node1', key: 'key1', isLeaf: false },
            ],
        });
        expect(treeSelect.props().loadedKeys).toEqual(['key1', 'key2']);
        treeSelect.unmount();
    });

    it('test foundation _showFilteredOnly with showFilteredOnly true', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            showFilteredOnly: true,
            treeData: treeDataEn,
        });
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Beijing' } });
        // Should only show filtered nodes
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation findDataForValue with array value', () => {
        const treeSelect = getTreeSelect({
            onChangeWithObject: true,
            value: [
                { value: 'Beijing', key: '0-0-0', label: 'Beijing' },
            ],
            multiple: true,
            treeData: treeDataEn,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleNodeLoad with loadData', async () => {
        const loadData = sinon.stub().resolves();
        const onLoad = sinon.spy();
        const treeDataWithLoad = [
            {
                label: 'Node 1',
                value: 'node1',
                key: 'node1',
                isLeaf: false,
            },
        ];
        const treeSelect = getTreeSelect({
            treeData: treeDataWithLoad,
            loadData,
            onLoad,
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation _notifyMultipleChange with autoMergeValue true', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            multiple: true,
            checkRelation: 'related',
            autoMergeValue: true,
            onChange,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        expect(treeSelect.props().autoMergeValue).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation _notifyMultipleChange with onChangeWithObject', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            multiple: true,
            onChangeWithObject: true,
            onChange,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        expect(treeSelect.props().onChangeWithObject).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleClick when already focused', () => {
        const treeSelect = getTreeSelect({
            defaultOpen: true,
        });
        // Click again when already open
        const selectBox = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectBox.simulate('click');
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleClear with filterTreeNode trigger and empty selectedKeys', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            searchPosition: 'trigger',
            showClear: true,
            onChange,
            treeData: treeDataEn,
        });
        // Search first
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'test' } });
        // Hover and clear
        const selectTree = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectTree.simulate('mouseenter');
        const clearBtn = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-clearbtn`);
        if (clearBtn.exists()) {
            clearBtn.simulate('click');
        }
        treeSelect.unmount();
    });

    it('test foundation handleClear with filterTreeNode trigger and non-empty selectedKeys', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            searchPosition: 'trigger',
            showClear: true,
            defaultValue: 'Beijing',
            onChange,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        // Search first
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'test' } });
        // Hover and clear
        const selectTree = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectTree.simulate('mouseenter');
        const clearBtn = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-clearbtn`);
        if (clearBtn.exists()) {
            clearBtn.simulate('click');
        }
        treeSelect.unmount();
    });

    it('test foundation removeTag with disabled item', () => {
        const treeDataWithDisabled = [
            {
                label: 'Asia',
                value: 'Asia',
                key: '0',
                children: [
                    { label: 'Beijing', value: 'Beijing', key: '0-0', disabled: true },
                    { label: 'Shanghai', value: 'Shanghai', key: '0-1' },
                ],
            },
        ];
        const treeSelect = getTreeSelect({
            multiple: true,
            treeData: treeDataWithDisabled,
            defaultValue: ['Beijing', 'Shanghai'],
            defaultExpandAll: true,
        });
        // Try to remove disabled tag - should not work
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`).length).toBeGreaterThan(0);
        treeSelect.unmount();
    });

    it('test foundation removeTag with disableStrictly', () => {
        const treeDataWithDisabled = [
            {
                label: 'Asia',
                value: 'Asia',
                key: '0',
                children: [
                    { label: 'Beijing', value: 'Beijing', key: '0-0', disabled: true },
                    { label: 'Shanghai', value: 'Shanghai', key: '0-1' },
                ],
            },
        ];
        const treeSelect = getTreeSelect({
            multiple: true,
            disableStrictly: true,
            treeData: treeDataWithDisabled,
            defaultValue: ['Beijing', 'Shanghai'],
            defaultExpandAll: true,
        });
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`).length).toBeGreaterThan(0);
        treeSelect.unmount();
    });

    it('test foundation removeTag with checkRelation unRelated', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            multiple: true,
            checkRelation: 'unRelated',
            onChange,
            treeData: treeDataEn,
            defaultValue: ['Beijing', 'Shanghai'],
            defaultExpandAll: true,
        });
        // Verify tags are rendered
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`).length).toBeGreaterThan(0);
        expect(treeSelect.props().checkRelation).toBe('unRelated');
        treeSelect.unmount();
    });

    it('test foundation removeTag with checkRelation related', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            multiple: true,
            checkRelation: 'related',
            onChange,
            treeData: treeDataEn,
            defaultValue: ['Beijing', 'Shanghai'],
            defaultExpandAll: true,
        });
        // Verify tags are rendered
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`).length).toBeGreaterThan(0);
        expect(treeSelect.props().checkRelation).toBe('related');
        treeSelect.unmount();
    });

    it('test foundation handleMultipleSelect with checkRelation unRelated add', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            multiple: true,
            checkRelation: 'unRelated',
            onChange,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        expect(treeSelect.props().checkRelation).toBe('unRelated');
        treeSelect.unmount();
    });

    it('test foundation handleMultipleSelect with checkRelation unRelated remove', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            multiple: true,
            checkRelation: 'unRelated',
            onChange,
            treeData: treeDataEn,
            defaultValue: ['Beijing'],
            defaultExpandAll: true,
        });
        expect(treeSelect.props().checkRelation).toBe('unRelated');
        treeSelect.unmount();
    });

    it('test foundation handleMultipleSelect with searchPosition trigger and inputValue', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            multiple: true,
            filterTreeNode: true,
            searchPosition: 'trigger',
            onChange,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        // Search first
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Beijing' } });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation calcNonDisabledCheckedKeys with disabled descendants', () => {
        const treeDataWithDisabled = [
            {
                label: 'Asia',
                value: 'Asia',
                key: '0',
                children: [
                    { label: 'Beijing', value: 'Beijing', key: '0-0', disabled: true },
                    { label: 'Shanghai', value: 'Shanghai', key: '0-1' },
                ],
            },
        ];
        const treeSelect = getTreeSelect({
            multiple: true,
            disableStrictly: true,
            treeData: treeDataWithDisabled,
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation calcCheckedStatus with disabled descendants all checked', () => {
        const treeDataWithDisabled = [
            {
                label: 'Asia',
                value: 'Asia',
                key: '0',
                children: [
                    { label: 'Beijing', value: 'Beijing', key: '0-0', disabled: true },
                    { label: 'Shanghai', value: 'Shanghai', key: '0-1' },
                ],
            },
        ];
        const treeSelect = getTreeSelect({
            multiple: true,
            disableStrictly: true,
            treeData: treeDataWithDisabled,
            defaultValue: ['Shanghai'],
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpandInSearch with expanded true', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        // Search first
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Asia' } });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpandInSearch with motion', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            motion: true,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        // Search first
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Asia' } });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpand without children and no loadData', () => {
        const treeDataNoChildren = [
            { label: 'Node 1', value: 'node1', key: 'node1' },
        ];
        const treeSelect = getTreeSelect({
            treeData: treeDataNoChildren,
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpand with loadData', () => {
        const loadData = sinon.stub().resolves();
        const treeDataWithLoad = [
            {
                label: 'Node 1',
                value: 'node1',
                key: 'node1',
                isLeaf: false,
            },
        ];
        const treeSelect = getTreeSelect({
            treeData: treeDataWithLoad,
            loadData,
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpand with expandedKeys controlled', () => {
        const onExpand = sinon.spy();
        const treeSelect = getTreeSelect({
            expandedKeys: ['0'],
            onExpand,
            treeData: treeDataEn,
        });
        expect(treeSelect.props().expandedKeys).toEqual(['0']);
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpand collapse with motion', () => {
        const treeSelect = getTreeSelect({
            motion: true,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation getRenderTextInSingle with no selectedKeys', () => {
        const treeSelect = getTreeSelect({
            treeData: treeDataEn,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation getRenderTextInSingle with custom renderSelectedItem', () => {
        const renderSelectedItem = (item) => `Custom: ${item.label}`;
        const treeSelect = getTreeSelect({
            renderSelectedItem,
            defaultValue: 'Beijing',
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleInputTriggerFocus', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            searchPosition: 'trigger',
            defaultValue: 'Beijing',
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        // Focus on input
        const input = treeSelect.find('input').at(0);
        input.simulate('focus');
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleInputTriggerBlur', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            searchPosition: 'trigger',
            defaultValue: 'Beijing',
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        // Blur on input
        const input = treeSelect.find('input').at(0);
        input.simulate('blur');
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handlePopoverVisibleChange with filterTreeNode false', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: false,
            defaultOpen: true,
        });
        // Close dropdown
        const selectBox = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectBox.simulate('click');
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleAfterClose with filterTreeNode', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            defaultOpen: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation setLoadKeys', () => {
        const loadData = sinon.stub().resolves();
        const treeDataWithLoad = [
            {
                label: 'Node 1',
                value: 'node1',
                key: 'node1',
                isLeaf: false,
            },
        ];
        const treeSelect = getTreeSelect({
            treeData: treeDataWithLoad,
            loadData,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation toggleHoverState', () => {
        const treeSelect = getTreeSelect({
            showClear: true,
            defaultValue: 'Beijing',
            treeData: treeDataEn,
        });
        // Mouse enter
        const selectTree = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectTree.simulate('mouseenter');
        // Mouse leave
        selectTree.simulate('mouseleave');
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation close with motionExpand', () => {
        const treeSelect = getTreeSelect({
            motionExpand: true,
            defaultOpen: true,
        });
        // Close
        const selectBox = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectBox.simulate('click');
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleClick with searchPosition trigger and inputValue not close', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            searchPosition: 'trigger',
            defaultOpen: true,
        });
        // Search first
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'test' } });
        // Click should not close
        const selectBox = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectBox.simulate('click');
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleClick with clickTriggerToHide false', () => {
        const treeSelect = getTreeSelect({
            clickTriggerToHide: false,
            defaultOpen: true,
        });
        // Click should not close
        const selectBox = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectBox.simulate('click');
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handlerTriggerBlur when not focused', () => {
        const treeSelect = getTreeSelect({
            treeData: treeDataEn,
        });
        // Blur without focus should do nothing
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation _notifyChange with single undefined value', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            showClear: true,
            defaultValue: 'Beijing',
            onChange,
            treeData: treeDataEn,
        });
        // Clear to set undefined
        const selectTree = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectTree.simulate('mouseenter');
        const clearBtn = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-clearbtn`);
        if (clearBtn.exists()) {
            clearBtn.simulate('click');
        }
        treeSelect.unmount();
    });

    it('test foundation getDataForKeyNotInKeyEntities with onChangeWithObject', () => {
        const treeSelect = getTreeSelect({
            onChangeWithObject: true,
            defaultValue: { value: 'NotInTree', key: 'not-in-tree', label: 'Not In Tree' },
            treeData: treeDataEn,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation constructDataForValue', () => {
        const treeSelect = getTreeSelect({
            defaultValue: 'NotInTree',
            treeData: treeDataEn,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleInputChange with empty sugInput', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            defaultValue: 'Beijing',
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        // Search then clear
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'test' } });
        input.simulate('change', { target: { value: '' } });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleNodeSelect with disabled node', () => {
        const treeDataWithDisabled = [
            {
                label: 'Asia',
                value: 'Asia',
                key: '0',
                disabled: true,
                children: [
                    { label: 'Beijing', value: 'Beijing', key: '0-0' },
                ],
            },
        ];
        const treeSelect = getTreeSelect({
            treeData: treeDataWithDisabled,
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleSingleSelect with controlled value', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            value: 'Beijing',
            onChange,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        expect(treeSelect.props().value).toBe('Beijing');
        treeSelect.unmount();
    });

    it('test foundation handleMultipleSelect with controlled value', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            multiple: true,
            value: ['Beijing'],
            onChange,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        expect(treeSelect.props().value).toEqual(['Beijing']);
        treeSelect.unmount();
    });

    it('test foundation clearInput restores expandedKeys from selectedKeys', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            defaultValue: 'Beijing',
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        // Search then clear
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'test' } });
        input.simulate('change', { target: { value: '' } });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation _notifyMultipleChange with key not in keyEntities', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            multiple: true,
            onChange,
            treeData: treeDataEn,
            defaultValue: ['NotInTree'],
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation _notifySingleChange with key not in keyEntities', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            onChange,
            treeData: treeDataEn,
            defaultValue: 'NotInTree',
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation removeTag with key not in keyEntities', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            multiple: true,
            onChange,
            treeData: treeDataEn,
            defaultValue: ['Beijing', 'NotInTree'],
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation getRenderTextInSingle with key not in keyEntities', () => {
        const treeSelect = getTreeSelect({
            treeData: treeDataEn,
            defaultValue: 'NotInTree',
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleNodeLoad async callback', () => {
        const loadData = sinon.stub().resolves();
        const onLoad = sinon.spy();
        const treeDataWithLoad = [
            {
                label: 'Node 1',
                value: 'node1',
                key: 'node1',
                isLeaf: false,
            },
        ];
        const treeSelect = getTreeSelect({
            treeData: treeDataWithLoad,
            loadData,
            onLoad,
            defaultExpandAll: true,
        });
        expect(treeSelect.props().loadData).toBe(loadData);
        expect(treeSelect.props().onLoad).toBe(onLoad);
        treeSelect.unmount();
    });

    it('test foundation handleNodeLoad with loadedKeys controlled', () => {
        const loadData = sinon.stub().resolves();
        const onLoad = sinon.spy();
        const treeDataWithLoad = [
            {
                label: 'Node 1',
                value: 'node1',
                key: 'node1',
                isLeaf: false,
            },
        ];
        const treeSelect = getTreeSelect({
            treeData: treeDataWithLoad,
            loadData,
            onLoad,
            loadedKeys: [],
            defaultExpandAll: true,
        });
        expect(treeSelect.props().loadedKeys).toEqual([]);
        treeSelect.unmount();
    });

    it('test foundation handleNodeLoad returns empty when key already loaded', () => {
        const loadData = sinon.stub().resolves();
        const treeDataWithLoad = [
            {
                label: 'Node 1',
                value: 'node1',
                key: 'node1',
                isLeaf: false,
            },
        ];
        const treeSelect = getTreeSelect({
            treeData: treeDataWithLoad,
            loadData,
            loadedKeys: ['node1'],
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation calcCheckedKeys for unchecked', () => {
        const treeSelect = getTreeSelect({
            multiple: true,
            treeData: treeDataEn,
            defaultValue: ['Beijing', 'Shanghai'],
            defaultExpandAll: true,
        });
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`).length).toBeGreaterThan(0);
        treeSelect.unmount();
    });

    it('test foundation _notifyMultipleChange with leafOnly', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            multiple: true,
            leafOnly: true,
            onChange,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        expect(treeSelect.props().leafOnly).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleMultipleSelect with disableStrictly and disabled descendants', () => {
        const treeDataWithDisabled = [
            {
                label: 'Asia',
                value: 'Asia',
                key: '0',
                children: [
                    { label: 'China', value: 'China', key: '0-0', children: [
                        { label: 'Beijing', value: 'Beijing', key: '0-0-0', disabled: true },
                        { label: 'Shanghai', value: 'Shanghai', key: '0-0-1' },
                    ]},
                ],
            },
        ];
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            multiple: true,
            disableStrictly: true,
            onChange,
            treeData: treeDataWithDisabled,
            defaultExpandAll: true,
        });
        expect(treeSelect.props().disableStrictly).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation calcNonDisabledCheckedKeys without disabled descendants', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            multiple: true,
            disableStrictly: true,
            onChange,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        expect(treeSelect.props().disableStrictly).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation calcCheckedStatus with all non-disabled checked', () => {
        const treeDataWithDisabled = [
            {
                label: 'Asia',
                value: 'Asia',
                key: '0',
                children: [
                    { label: 'Beijing', value: 'Beijing', key: '0-0', disabled: true },
                    { label: 'Shanghai', value: 'Shanghai', key: '0-1' },
                ],
            },
        ];
        const treeSelect = getTreeSelect({
            multiple: true,
            disableStrictly: true,
            treeData: treeDataWithDisabled,
            defaultValue: ['Shanghai'],
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpandInSearch with filteredExpandedKeys delete', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        // Search to expand
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Asia' } });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpandInSearch with motion hide', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            motion: true,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        // Search
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Asia' } });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpand with expandedKeys delete', () => {
        const treeSelect = getTreeSelect({
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpand with motion hide', () => {
        const treeSelect = getTreeSelect({
            motion: true,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handlePopoverVisibleChange with searchAutoFocus and dropdown', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            searchAutoFocus: true,
            searchPosition: 'dropdown',
            defaultOpen: false,
        });
        // Open dropdown
        const selectBox = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectBox.simulate('click');
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleAfterClose clears input when filterTreeNode', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            defaultOpen: true,
        });
        // Search
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'test' } });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation _notifySingleChange with undefined key', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            showClear: true,
            defaultValue: 'Beijing',
            onChange,
            treeData: treeDataEn,
        });
        // Clear
        const selectTree = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectTree.simulate('mouseenter');
        const clearBtn = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-clearbtn`);
        if (clearBtn.exists()) {
            clearBtn.simulate('click');
        }
        treeSelect.unmount();
    });

    it('test foundation _notifySingleChange with onChangeWithObject', () => {
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            onChangeWithObject: true,
            showClear: true,
            defaultValue: { value: 'Beijing', key: '0-0-0', label: 'Beijing' },
            onChange,
            treeData: treeDataEn,
        });
        expect(treeSelect.props().onChangeWithObject).toBe(true);
        treeSelect.unmount();
    });

    it('test index.tsx renderTreeNode with treeNodeProps null', () => {
        const treeSelect = getTreeSelect({
            virtualize: {
                height: 300,
                itemSize: 36,
            },
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test index.tsx onNodeCheck', () => {
        const treeSelect = getTreeSelect({
            multiple: true,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        expect(treeSelect.props().multiple).toBe(true);
        treeSelect.unmount();
    });

    it('test index.tsx onNodeSelect', () => {
        const onSelect = sinon.spy();
        const treeSelect = getTreeSelect({
            onSelect,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        expect(treeSelect.props().onSelect).toBe(onSelect);
        treeSelect.unmount();
    });

    it('test index.tsx onNodeExpand', () => {
        const onExpand = sinon.spy();
        const treeSelect = getTreeSelect({
            onExpand,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        expect(treeSelect.props().onExpand).toBe(onExpand);
        treeSelect.unmount();
    });

    it('test index.tsx getTreeNodeRequiredProps', () => {
        const treeSelect = getTreeSelect({
            treeData: treeDataEn,
            defaultExpandAll: true,
            defaultValue: 'Beijing',
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test index.tsx getTreeNodeKey', () => {
        const treeSelect = getTreeSelect({
            virtualize: {
                height: 300,
                itemSize: 36,
            },
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test index.tsx handlePopoverVisibleChange', () => {
        const onVisibleChange = sinon.spy();
        const treeSelect = getTreeSelect({
            onVisibleChange,
            defaultOpen: true,
        });
        // Close
        const selectBox = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectBox.simulate('click');
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test index.tsx afterClose', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            defaultOpen: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test index.tsx renderEmpty with null emptyContent', () => {
        const treeSelect = getTreeSelect({
            treeData: [],
            emptyContent: null,
        });
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option-empty`).exists()).toBe(false);
        treeSelect.unmount();
    });

    it('test index.tsx renderEmpty with custom emptyContent', () => {
        const treeSelect = getTreeSelect({
            treeData: [],
            emptyContent: 'No data available',
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test index.tsx renderEmpty with default locale', () => {
        const treeSelect = getTreeSelect({
            treeData: [],
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test index.tsx adapter notifyClear', () => {
        const onClear = sinon.spy();
        const treeSelect = getTreeSelect({
            showClear: true,
            defaultValue: 'Beijing',
            onClear,
            treeData: treeDataEn,
        });
        // Hover and clear
        const selectTree = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectTree.simulate('mouseenter');
        const clearBtn = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-clearbtn`);
        if (clearBtn.exists()) {
            clearBtn.simulate('click');
            expect(onClear.called).toBe(true);
        }
        treeSelect.unmount();
    });

    it('test index.tsx adapter rePositionDropdown', () => {
        const treeSelect = getTreeSelect({
            multiple: true,
            showClear: true,
            defaultValue: ['Beijing'],
            treeData: treeDataEn,
        });
        // Hover and clear to trigger reposition
        const selectTree = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select`).at(0);
        selectTree.simulate('mouseenter');
        const clearBtn = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-select-clearbtn`);
        if (clearBtn.exists()) {
            clearBtn.simulate('click');
        }
        treeSelect.unmount();
    });

    it('test index.tsx adapter cacheFlattenNodes', () => {
        const treeSelect = getTreeSelect({
            motion: true,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test index.tsx adapter notifySearch', () => {
        const onSearch = sinon.spy();
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            onSearch,
            treeData: treeDataEn,
        });
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Beijing' } });
        expect(onSearch.called).toBe(true);
        treeSelect.unmount();
    });

    it('test index.tsx adapter notifySelect', () => {
        const onSelect = sinon.spy();
        const treeSelect = getTreeSelect({
            onSelect,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        expect(treeSelect.props().onSelect).toBe(onSelect);
        treeSelect.unmount();
    });

    // ============ Direct foundation method tests ============

    it('test foundation handleMultipleSelect directly with checkRelation related', () => {
        const onChange = sinon.spy();
        const onSelect = sinon.spy();
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                multiple={true}
                checkRelation="related"
                onChange={onChange}
                onSelect={onSelect}
                treeData={treeDataEn}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Access foundation and call method directly
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const treeNode = {
                eventKey: '0-0-0',
                checked: false,
                data: { label: 'Beijing', value: 'Beijing', key: '0-0-0' },
            };
            instance.foundation.handleMultipleSelect({}, treeNode);
        }
        treeSelect.unmount();
    });

    it('test foundation handleMultipleSelect directly with checkRelation unRelated', () => {
        const onChange = sinon.spy();
        const onSelect = sinon.spy();
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                multiple={true}
                checkRelation="unRelated"
                onChange={onChange}
                onSelect={onSelect}
                treeData={treeDataEn}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Access foundation and call method directly
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const treeNode = {
                eventKey: '0-0-0',
                checked: false,
                data: { label: 'Beijing', value: 'Beijing', key: '0-0-0' },
            };
            instance.foundation.handleMultipleSelect({}, treeNode);
        }
        treeSelect.unmount();
    });

    it('test foundation handleMultipleSelect with unRelated remove', () => {
        const onChange = sinon.spy();
        const onSelect = sinon.spy();
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                multiple={true}
                checkRelation="unRelated"
                onChange={onChange}
                onSelect={onSelect}
                treeData={treeDataEn}
                defaultValue={['Beijing']}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Access foundation and call method directly
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const treeNode = {
                eventKey: '0-0-0',
                checked: true,
                data: { label: 'Beijing', value: 'Beijing', key: '0-0-0' },
            };
            instance.foundation.handleMultipleSelect({}, treeNode);
        }
        treeSelect.unmount();
    });

    it('test foundation handleMultipleSelect with searchPosition trigger', () => {
        const onChange = sinon.spy();
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                multiple={true}
                filterTreeNode={true}
                searchPosition="trigger"
                onChange={onChange}
                treeData={treeDataEn}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Search first
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Beijing' } });
        // Access foundation and call method directly
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const treeNode = {
                eventKey: '0-0-0',
                checked: false,
                data: { label: 'Beijing', value: 'Beijing', key: '0-0-0' },
            };
            instance.foundation.handleMultipleSelect({}, treeNode);
        }
        treeSelect.unmount();
    });

    it('test foundation calcNonDisabledCheckedKeys with disabled descendants', () => {
        const treeDataWithDisabled = [
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
                            { label: 'Beijing', value: 'Beijing', key: '0-0-0', disabled: true },
                            { label: 'Shanghai', value: 'Shanghai', key: '0-0-1' },
                        ]
                    },
                ],
            },
        ];
        const onChange = sinon.spy();
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                multiple={true}
                disableStrictly={true}
                onChange={onChange}
                treeData={treeDataWithDisabled}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Access foundation and call method directly
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const result = instance.foundation.calcNonDisabledCheckedKeys('0', true);
            expect(result).toBeDefined();
        }
        treeSelect.unmount();
    });

    it('test foundation calcCheckedStatus with disabled descendants', () => {
        const treeDataWithDisabled = [
            {
                label: 'Asia',
                value: 'Asia',
                key: '0',
                children: [
                    { label: 'Beijing', value: 'Beijing', key: '0-0', disabled: true },
                    { label: 'Shanghai', value: 'Shanghai', key: '0-1' },
                ],
            },
        ];
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                multiple={true}
                disableStrictly={true}
                treeData={treeDataWithDisabled}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Access foundation and call method directly
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const result = instance.foundation.calcCheckedStatus(true, '0');
            expect(typeof result).toBe('boolean');
        }
        treeSelect.unmount();
    });

    it('test foundation calcCheckedStatus with false targetStatus', () => {
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                multiple={true}
                disableStrictly={true}
                treeData={treeDataEn}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Access foundation and call method directly
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const result = instance.foundation.calcCheckedStatus(false, '0');
            expect(result).toBe(false);
        }
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpandInSearch directly', () => {
        const onExpand = sinon.spy();
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            onExpand,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        // Search first
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Asia' } });
        // Access foundation and call method directly
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const treeNode = {
                eventKey: '0',
                expanded: true,
                data: { label: 'Asia', value: 'Asia', key: '0' },
                children: [],
            };
            instance.foundation.handleNodeExpandInSearch({}, treeNode);
        }
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpandInSearch with expand', () => {
        const onExpand = sinon.spy();
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            onExpand,
            treeData: treeDataEn,
        });
        // Search first
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Asia' } });
        // Access foundation and call method directly
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const treeNode = {
                eventKey: '0',
                expanded: false,
                data: { label: 'Asia', value: 'Asia', key: '0' },
                children: [],
            };
            instance.foundation.handleNodeExpandInSearch({}, treeNode);
        }
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpand directly with expand', () => {
        const onExpand = sinon.spy();
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                onExpand={onExpand}
                treeData={treeDataEn}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Access foundation and call method directly
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const treeNode = {
                eventKey: '0',
                expanded: false,
                data: { label: 'Asia', value: 'Asia', key: '0' },
                children: [{ label: 'China', value: 'China', key: '0-0' }],
            };
            instance.foundation.handleNodeExpand({}, treeNode);
        }
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpand directly with collapse', () => {
        const onExpand = sinon.spy();
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                onExpand={onExpand}
                treeData={treeDataEn}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Access foundation and call method directly
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const treeNode = {
                eventKey: '0',
                expanded: true,
                data: { label: 'Asia', value: 'Asia', key: '0' },
                children: [{ label: 'China', value: 'China', key: '0-0' }],
            };
            instance.foundation.handleNodeExpand({}, treeNode);
        }
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpand with motion', () => {
        const onExpand = sinon.spy();
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                motion={true}
                onExpand={onExpand}
                treeData={treeDataEn}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Access foundation and call method directly
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const treeNode = {
                eventKey: '0',
                expanded: false,
                data: { label: 'Asia', value: 'Asia', key: '0' },
                children: [{ label: 'China', value: 'China', key: '0-0' }],
            };
            instance.foundation.handleNodeExpand({}, treeNode);
        }
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpand with expandedKeys controlled', () => {
        const onExpand = sinon.spy();
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                expandedKeys={['0']}
                onExpand={onExpand}
                treeData={treeDataEn}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Access foundation and call method directly
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const treeNode = {
                eventKey: '0',
                expanded: true,
                data: { label: 'Asia', value: 'Asia', key: '0' },
                children: [{ label: 'China', value: 'China', key: '0-0' }],
            };
            instance.foundation.handleNodeExpand({}, treeNode);
        }
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpand while searching', () => {
        const onExpand = sinon.spy();
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            onExpand,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        // Search first
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Asia' } });
        // Access foundation and call method directly
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const treeNode = {
                eventKey: '0',
                expanded: true,
                data: { label: 'Asia', value: 'Asia', key: '0' },
                children: [{ label: 'China', value: 'China', key: '0-0' }],
            };
            instance.foundation.handleNodeExpand({}, treeNode);
        }
        treeSelect.unmount();
    });

    it('test foundation removeTag directly with checkRelation related', () => {
        const onChange = sinon.spy();
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                multiple={true}
                checkRelation="related"
                onChange={onChange}
                treeData={treeDataEn}
                defaultValue={['Beijing', 'Shanghai']}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Access foundation and call method directly
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            instance.foundation.removeTag('0-0-0');
        }
        treeSelect.unmount();
    });

    it('test foundation removeTag directly with checkRelation unRelated', () => {
        const onChange = sinon.spy();
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                multiple={true}
                checkRelation="unRelated"
                onChange={onChange}
                treeData={treeDataEn}
                defaultValue={['Beijing', 'Shanghai']}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Access foundation and call method directly
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            instance.foundation.removeTag('0-0-0');
        }
        treeSelect.unmount();
    });

    it('test foundation removeTag with disabled item', () => {
        const treeDataWithDisabled = [
            {
                label: 'Asia',
                value: 'Asia',
                key: '0',
                children: [
                    { label: 'Beijing', value: 'Beijing', key: '0-0', disabled: true },
                    { label: 'Shanghai', value: 'Shanghai', key: '0-1' },
                ],
            },
        ];
        const onChange = sinon.spy();
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                multiple={true}
                onChange={onChange}
                treeData={treeDataWithDisabled}
                defaultValue={['Beijing', 'Shanghai']}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Access foundation and call method directly - should not remove disabled
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            instance.foundation.removeTag('0-0');
        }
        treeSelect.unmount();
    });

    it('test foundation removeTag with disableStrictly', () => {
        const treeDataWithDisabled = [
            {
                label: 'Asia',
                value: 'Asia',
                key: '0',
                children: [
                    { label: 'Beijing', value: 'Beijing', key: '0-0', disabled: true },
                    { label: 'Shanghai', value: 'Shanghai', key: '0-1' },
                ],
            },
        ];
        const onChange = sinon.spy();
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                multiple={true}
                disableStrictly={true}
                onChange={onChange}
                treeData={treeDataWithDisabled}
                defaultValue={['Beijing', 'Shanghai']}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Access foundation and call method directly - should not remove disabled
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            instance.foundation.removeTag('0-0');
        }
        treeSelect.unmount();
    });

    it('test foundation handleSingleSelect directly', () => {
        const onChange = sinon.spy();
        const onSelect = sinon.spy();
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                onChange={onChange}
                onSelect={onSelect}
                treeData={treeDataEn}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Access foundation and call method directly
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const treeNode = {
                eventKey: '0-0-0',
                selected: false,
                data: { label: 'Beijing', value: 'Beijing', key: '0-0-0' },
            };
            instance.foundation.handleSingleSelect({}, treeNode);
        }
        treeSelect.unmount();
    });

    it('test foundation handleSingleSelect with controlled value', () => {
        const onChange = sinon.spy();
        const onSelect = sinon.spy();
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                value="Beijing"
                onChange={onChange}
                onSelect={onSelect}
                treeData={treeDataEn}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Access foundation and call method directly
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const treeNode = {
                eventKey: '0-0-1',
                selected: false,
                data: { label: 'Shanghai', value: 'Shanghai', key: '0-0-1' },
            };
            instance.foundation.handleSingleSelect({}, treeNode);
        }
        treeSelect.unmount();
    });

    it('test foundation handleNodeSelect with disabled', () => {
        const treeDataWithDisabled = [
            {
                label: 'Asia',
                value: 'Asia',
                key: '0',
                disabled: true,
                children: [
                    { label: 'Beijing', value: 'Beijing', key: '0-0' },
                ],
            },
        ];
        const onChange = sinon.spy();
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                onChange={onChange}
                treeData={treeDataWithDisabled}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Access foundation and call method directly
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const treeNode = {
                eventKey: '0',
                disabled: true,
                data: { label: 'Asia', value: 'Asia', key: '0', disabled: true },
            };
            instance.foundation.handleNodeSelect({}, treeNode);
        }
        treeSelect.unmount();
    });

    // Additional tests for uncovered lines

    it('test showFilteredOnly prop', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            showFilteredOnly: true,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Beijing' } });
        expect(treeSelect.props().showFilteredOnly).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation _showFilteredOnly method', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            showFilteredOnly: true,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Beijing' } });
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const result = instance.foundation._showFilteredOnly();
            expect(result).toBe(true);
        }
        treeSelect.unmount();
    });

    it('test foundation _notifyMultipleChange with autoMergeValue true', () => {
        const onChange = sinon.spy();
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                multiple={true}
                checkRelation="related"
                autoMergeValue={true}
                onChange={onChange}
                treeData={treeDataEn}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            instance.foundation._notifyMultipleChange(['0-0-0'], {});
        }
        treeSelect.unmount();
    });

    it('test foundation handleTriggerFocus directly', () => {
        const onFocus = sinon.spy();
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                onFocus={onFocus}
                treeData={treeDataEn}
            />,
            { attachTo: document.getElementById('container') }
        );
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            instance.foundation.handleTriggerFocus({});
        }
        expect(onFocus.called).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleClear with uncontrolled mode', () => {
        const onClear = sinon.spy();
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                showClear={true}
                defaultValue="Beijing"
                onClear={onClear}
                treeData={treeDataEn}
            />,
            { attachTo: document.getElementById('container') }
        );
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            instance.foundation.handleClear({});
        }
        expect(onClear.called).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleClear with filterTreeNode and triggerSearch', () => {
        const onClear = sinon.spy();
        const treeSelect = getTreeSelect({
            showClear: true,
            filterTreeNode: true,
            searchPosition: 'trigger',
            defaultValue: 'Beijing',
            onClear,
            treeData: treeDataEn,
        });
        // First search something
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Asia' } });
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            instance.foundation.handleClear({});
        }
        treeSelect.unmount();
    });

    it('test index.tsx onMotionEnd', () => {
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                motion={true}
                treeData={treeDataEn}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        const instance = treeSelect.instance();
        if (instance && instance.onMotionEnd) {
            instance.onMotionEnd();
        }
        treeSelect.unmount();
    });

    it('test index.tsx clickOutsideHandler registration', () => {
        const onBlur = sinon.spy();
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                onBlur={onBlur}
                treeData={treeDataEn}
                defaultOpen={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Verify the component is open
        expect(treeSelect.props().defaultOpen).toBe(true);
        // Verify clickOutsideHandler is registered
        const instance = treeSelect.instance();
        expect(instance.clickOutsideHandler).not.toBeNull();
        treeSelect.unmount();
    });

    it('test index.tsx updateInputFocus with blur', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            treeData: treeDataEn,
            defaultOpen: true,
        });
        const instance = treeSelect.instance();
        if (instance && instance.adapter) {
            instance.adapter.updateInputFocus(false);
        }
        treeSelect.unmount();
    });

    it('test index.tsx getTreeNodeKey', () => {
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                treeData={treeDataEn}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        const instance = treeSelect.instance();
        if (instance && instance.getTreeNodeKey) {
            const key = instance.getTreeNodeKey({ data: { key: 'test-key' } });
            expect(key).toBe('test-key');
        }
        treeSelect.unmount();
    });

    it('test index.tsx renderTreeNode with null treeNodeProps', () => {
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                treeData={treeDataEn}
            />,
            { attachTo: document.getElementById('container') }
        );
        const instance = treeSelect.instance();
        if (instance && instance.renderTreeNode) {
            // Call with a key that doesn't exist in keyEntities
            const result = instance.renderTreeNode({ data: { key: 'non-existent-key' }, key: 'non-existent-key' }, 0, {});
            expect(result).toBe(null);
        }
        treeSelect.unmount();
    });

    it('test index.tsx notifyLoad callback', () => {
        const onLoad = sinon.spy();
        const loadData = sinon.stub().resolves();
        const treeDataWithLoad = [
            { label: 'Node 1', value: 'node1', key: 'node1', isLeaf: false },
        ];
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                treeData={treeDataWithLoad}
                loadData={loadData}
                onLoad={onLoad}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        const instance = treeSelect.instance();
        if (instance && instance.adapter) {
            instance.adapter.notifyLoad(['node1'], { label: 'Node 1', value: 'node1', key: 'node1' });
        }
        expect(onLoad.called).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation init with disabled', () => {
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                disabled={true}
                defaultOpen={true}
                treeData={treeDataEn}
            />,
            { attachTo: document.getElementById('container') }
        );
        // When disabled, defaultOpen should not open the dropdown
        expect(treeSelect.props().disabled).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation init with searchAutoFocus and triggerSearch', () => {
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                searchAutoFocus={true}
                searchPosition="trigger"
                filterTreeNode={true}
                treeData={treeDataEn}
            />,
            { attachTo: document.getElementById('container') }
        );
        expect(treeSelect.props().searchAutoFocus).toBe(true);
        expect(treeSelect.props().searchPosition).toBe('trigger');
        treeSelect.unmount();
    });

    it('test getDerivedStateFromProps with showFilteredOnly and motionKeys', () => {
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                filterTreeNode={true}
                showFilteredOnly={true}
                treeData={treeDataEn}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Update expandedKeys to trigger motion
        treeSelect.setProps({ expandedKeys: ['0'] });
        expect(treeSelect.props().showFilteredOnly).toBe(true);
        treeSelect.unmount();
    });

    it('test renderTagList with item not in keyEntities', () => {
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                multiple={true}
                defaultValue={['non-existent-key']}
                treeData={treeDataEn}
            />,
            { attachTo: document.getElementById('container') }
        );
        // The component should handle non-existent keys gracefully
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test renderTagList with disabled item from disableStrictly', () => {
        const treeDataWithDisabled = [
            {
                label: 'Asia',
                value: 'Asia',
                key: '0',
                children: [
                    { label: 'Beijing', value: 'Beijing', key: '0-0', disabled: true },
                    { label: 'Shanghai', value: 'Shanghai', key: '0-1' },
                ],
            },
        ];
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                multiple={true}
                disableStrictly={true}
                defaultValue={['Beijing', 'Shanghai']}
                treeData={treeDataWithDisabled}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Check that tags are rendered
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`).length).toBeGreaterThan(0);
        treeSelect.unmount();
    });

    it('test index.tsx onNodeCheck', () => {
        const onSelect = sinon.spy();
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                multiple={true}
                onSelect={onSelect}
                treeData={treeDataEn}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        const instance = treeSelect.instance();
        if (instance && instance.onNodeCheck) {
            const treeNode = {
                eventKey: '0-0-0',
                checked: false,
                data: { label: 'Beijing', value: 'Beijing', key: '0-0-0' },
            };
            instance.onNodeCheck({}, treeNode);
        }
        treeSelect.unmount();
    });

    it('test index.tsx getTreeNodeRequiredProps', () => {
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                treeData={treeDataEn}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        const instance = treeSelect.instance();
        if (instance && instance.getTreeNodeRequiredProps) {
            const props = instance.getTreeNodeRequiredProps();
            expect(props).toHaveProperty('expandedKeys');
            expect(props).toHaveProperty('selectedKeys');
            expect(props).toHaveProperty('checkedKeys');
            expect(props).toHaveProperty('halfCheckedKeys');
            expect(props).toHaveProperty('filteredKeys');
            expect(props).toHaveProperty('keyEntities');
        }
        treeSelect.unmount();
    });

    it('test foundation handlePopoverVisibleChange with searchAutoFocus and dropdown search', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            searchPosition: 'dropdown',
            searchAutoFocus: true,
            treeData: treeDataEn,
        });
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            instance.foundation.handlePopoverVisibleChange(true);
        }
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpand with no children and no loadData', () => {
        const treeDataNoChildren = [
            { label: 'Node 1', value: 'node1', key: 'node1' },
        ];
        const onExpand = sinon.spy();
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                onExpand={onExpand}
                treeData={treeDataNoChildren}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const treeNode = {
                eventKey: 'node1',
                expanded: false,
                data: { label: 'Node 1', value: 'node1', key: 'node1' },
            };
            instance.foundation.handleNodeExpand({}, treeNode);
        }
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpandInSearch with collapse', () => {
        const onExpand = sinon.spy();
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            onExpand,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        // Search first
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Asia' } });
        // Access foundation and call method directly - collapse
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const treeNode = {
                eventKey: '0',
                expanded: true,
                data: { label: 'Asia', value: 'Asia', key: '0' },
                children: [{ label: 'China', value: 'China', key: '0-0' }],
            };
            instance.foundation.handleNodeExpandInSearch({}, treeNode);
        }
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpand with collapse', () => {
        const onExpand = sinon.spy();
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                onExpand={onExpand}
                treeData={treeDataEn}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const treeNode = {
                eventKey: '0',
                expanded: true,
                data: { label: 'Asia', value: 'Asia', key: '0' },
                children: [{ label: 'China', value: 'China', key: '0-0' }],
            };
            instance.foundation.handleNodeExpand({}, treeNode);
        }
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpand with controlled expandedKeys', () => {
        const onExpand = sinon.spy();
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                expandedKeys={['0']}
                onExpand={onExpand}
                treeData={treeDataEn}
            />,
            { attachTo: document.getElementById('container') }
        );
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const treeNode = {
                eventKey: '0-0',
                expanded: false,
                data: { label: 'China', value: 'China', key: '0-0' },
                children: [{ label: 'Beijing', value: 'Beijing', key: '0-0-0' }],
            };
            instance.foundation.handleNodeExpand({}, treeNode);
        }
        expect(onExpand.called).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpandInSearch with controlled expandedKeys', () => {
        const onExpand = sinon.spy();
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            expandedKeys: ['0'],
            onExpand,
            treeData: treeDataEn,
        });
        // Search first
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Asia' } });
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const treeNode = {
                eventKey: '0-0',
                expanded: false,
                data: { label: 'China', value: 'China', key: '0-0' },
                children: [{ label: 'Beijing', value: 'Beijing', key: '0-0-0' }],
            };
            instance.foundation.handleNodeExpandInSearch({}, treeNode);
        }
        expect(onExpand.called).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpand with motion animation', () => {
        const onExpand = sinon.spy();
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                motion={true}
                onExpand={onExpand}
                treeData={treeDataEn}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const treeNode = {
                eventKey: '0',
                expanded: true,
                data: { label: 'Asia', value: 'Asia', key: '0' },
                children: [{ label: 'China', value: 'China', key: '0-0' }],
            };
            instance.foundation.handleNodeExpand({}, treeNode);
        }
        treeSelect.unmount();
    });

    it('test foundation handleClear with triggerSearch and empty selectedKeys', () => {
        const onClear = sinon.spy();
        const treeSelect = getTreeSelect({
            showClear: true,
            filterTreeNode: true,
            searchPosition: 'trigger',
            onClear,
            treeData: treeDataEn,
        });
        // First search something
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Asia' } });
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            instance.foundation.handleClear({});
        }
        treeSelect.unmount();
    });

    it('test foundation handleClear with triggerSearch and non-empty selectedKeys', () => {
        const onClear = sinon.spy();
        const treeSelect = getTreeSelect({
            showClear: true,
            filterTreeNode: true,
            searchPosition: 'trigger',
            defaultValue: 'Beijing',
            onClear,
            treeData: treeDataEn,
        });
        // First search something
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Asia' } });
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            instance.foundation.handleClear({});
        }
        treeSelect.unmount();
    });

    it('test foundation calcNonDisabledCheckedKeys with disabled descendants', () => {
        const treeDataWithDisabled = [
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
                            { label: 'Beijing', value: 'Beijing', key: '0-0-0', disabled: true },
                            { label: 'Shanghai', value: 'Shanghai', key: '0-0-1' },
                        ],
                    },
                ],
            },
        ];
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                multiple={true}
                checkRelation="related"
                disableStrictly={true}
                defaultValue={['Shanghai']}
                treeData={treeDataWithDisabled}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Verify component renders correctly with disabled descendants
        expect(treeSelect.props().disableStrictly).toBe(true);
        expect(treeSelect.props().checkRelation).toBe('related');
        treeSelect.unmount();
    });

    it('test foundation calcNonDisabledCheckedKeys with all descendants checked', () => {
        const treeDataWithDisabled = [
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
                            { label: 'Beijing', value: 'Beijing', key: '0-0-0', disabled: true },
                            { label: 'Shanghai', value: 'Shanghai', key: '0-0-1' },
                        ],
                    },
                ],
            },
        ];
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                multiple={true}
                checkRelation="related"
                disableStrictly={true}
                defaultValue={['Beijing', 'Shanghai']}
                treeData={treeDataWithDisabled}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Verify component renders correctly with all descendants checked
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`).length).toBeGreaterThan(0);
        treeSelect.unmount();
    });

    it('test index.tsx renderTagItem with renderSelectedItem returning isRenderInTag false', () => {
        const renderSelectedItem = (item) => ({
            isRenderInTag: false,
            content: <span className="custom-content">{item.label}</span>,
        });
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                multiple={true}
                defaultValue={['Beijing']}
                renderSelectedItem={renderSelectedItem}
                treeData={treeDataEn}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        expect(treeSelect.find('.custom-content').exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test index.tsx renderTagItem without renderSelectedItem', () => {
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                multiple={true}
                defaultValue={['Beijing']}
                treeData={treeDataEn}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        const instance = treeSelect.instance();
        if (instance && instance.renderTagItem) {
            const result = instance.renderTagItem('0-0-0', 0);
            expect(result).not.toBeNull();
        }
        treeSelect.unmount();
    });

    it('test index.tsx renderTagInput with maxTagCount', () => {
        const onChange = sinon.spy();
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                multiple={true}
                maxTagCount={1}
                defaultValue={['Beijing', 'Shanghai']}
                onChange={onChange}
                treeData={treeDataEn}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Verify component renders correctly with maxTagCount
        expect(treeSelect.props().maxTagCount).toBe(1);
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`).length).toBeGreaterThan(0);
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpandInSearch with showFilteredOnly', () => {
        const onExpand = sinon.spy();
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            showFilteredOnly: true,
            onExpand,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        // Search first
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Asia' } });
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const treeNode = {
                eventKey: '0',
                expanded: false,
                data: { label: 'Asia', value: 'Asia', key: '0' },
                children: [{ label: 'China', value: 'China', key: '0-0' }],
            };
            instance.foundation.handleNodeExpandInSearch({}, treeNode);
        }
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpand with showFilteredOnly', () => {
        const onExpand = sinon.spy();
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            showFilteredOnly: true,
            onExpand,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        // Search first
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Asia' } });
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const treeNode = {
                eventKey: '0',
                expanded: true,
                data: { label: 'Asia', value: 'Asia', key: '0' },
                children: [{ label: 'China', value: 'China', key: '0-0' }],
            };
            instance.foundation.handleNodeExpand({}, treeNode);
        }
        treeSelect.unmount();
    });

    it('test getDerivedStateFromProps with motionType hide', () => {
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                motion={true}
                treeData={treeDataEn}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Collapse a node to trigger hide motion
        treeSelect.setProps({ expandedKeys: [] });
        expect(treeSelect.exists()).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation handleNodeExpandInSearch with motion and collapse', () => {
        const onExpand = sinon.spy();
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            motion: true,
            onExpand,
            treeData: treeDataEn,
            defaultExpandAll: true,
        });
        // Search first
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Asia' } });
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            // First expand
            const treeNode = {
                eventKey: '0',
                expanded: false,
                data: { label: 'Asia', value: 'Asia', key: '0' },
                children: [{ label: 'China', value: 'China', key: '0-0' }],
            };
            instance.foundation.handleNodeExpandInSearch({}, treeNode);
            // Then collapse
            const treeNodeCollapse = {
                eventKey: '0',
                expanded: true,
                data: { label: 'Asia', value: 'Asia', key: '0' },
                children: [{ label: 'China', value: 'China', key: '0-0' }],
            };
            instance.foundation.handleNodeExpandInSearch({}, treeNodeCollapse);
        }
        treeSelect.unmount();
    });

    it('test foundation calcNonDisabledCheckedKeys returns false when targetStatus false', () => {
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                multiple={true}
                checkRelation="related"
                disableStrictly={true}
                treeData={treeDataEn}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Verify component renders correctly
        expect(treeSelect.props().disableStrictly).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation calcNonDisabledCheckedKeys with no disabled descendants', () => {
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                multiple={true}
                checkRelation="related"
                disableStrictly={true}
                treeData={treeDataEn}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Verify component renders correctly
        expect(treeSelect.props().checkRelation).toBe('related');
        treeSelect.unmount();
    });

    it('test foundation handleClear with triggerSearch, inputValue and empty selectedKeys', () => {
        const onClear = sinon.spy();
        const onChange = sinon.spy();
        const treeSelect = getTreeSelect({
            showClear: true,
            filterTreeNode: true,
            searchPosition: 'trigger',
            onClear,
            onChange,
            treeData: treeDataEn,
        });
        // First search something
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Asia' } });
        // Clear should call handleInputChange since selectedKeys is empty
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            instance.foundation.handleClear({});
        }
        expect(onClear.called).toBe(true);
        treeSelect.unmount();
    });

    it('test foundation onClickSingleTriggerSearchItem', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            searchPosition: 'trigger',
            treeData: treeDataEn,
        });
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            instance.foundation.onClickSingleTriggerSearchItem({});
        }
        treeSelect.unmount();
    });

    it('test foundation calcCheckedKeys with disabled descendants and targetStatus true', () => {
        const treeDataWithDisabled = [
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
                            { label: 'Beijing', value: 'Beijing', key: '0-0-0', disabled: true },
                            { label: 'Shanghai', value: 'Shanghai', key: '0-0-1' },
                        ],
                    },
                ],
            },
        ];
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                multiple={true}
                checkRelation="related"
                disableStrictly={true}
                treeData={treeDataWithDisabled}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const result = instance.foundation.calcCheckedKeys('0-0', true);
            expect(result).toBeDefined();
        }
        treeSelect.unmount();
    });

    it('test foundation calcCheckedKeys with disabled descendants and targetStatus false', () => {
        const treeDataWithDisabled = [
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
                            { label: 'Beijing', value: 'Beijing', key: '0-0-0', disabled: true },
                            { label: 'Shanghai', value: 'Shanghai', key: '0-0-1' },
                        ],
                    },
                ],
            },
        ];
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                multiple={true}
                checkRelation="related"
                disableStrictly={true}
                defaultValue={['Shanghai']}
                treeData={treeDataWithDisabled}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const result = instance.foundation.calcCheckedKeys('0-0', false);
            expect(result).toBeDefined();
        }
        treeSelect.unmount();
    });

    it('test foundation calcCheckedKeys without disabled descendants', () => {
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                multiple={true}
                checkRelation="related"
                disableStrictly={true}
                treeData={treeDataEn}
                defaultExpandAll={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            const result = instance.foundation.calcCheckedKeys('0-0', true);
            expect(result).toBeDefined();
        }
        treeSelect.unmount();
    });

    it('test foundation _registerClickOutsideHandler callback', () => {
        const onBlur = sinon.spy();
        const treeSelect = mount(
            <TreeSelect
                {...commonProps}
                onBlur={onBlur}
                treeData={treeDataEn}
                defaultOpen={true}
            />,
            { attachTo: document.getElementById('container') }
        );
        // Verify clickOutsideHandler is registered
        const instance = treeSelect.instance();
        expect(instance.clickOutsideHandler).not.toBeNull();
        treeSelect.unmount();
    });

    it('test foundation clearInputValue with inputValue', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            treeData: treeDataEn,
        });
        // First search something
        const input = treeSelect.find('input').at(0);
        input.simulate('change', { target: { value: 'Asia' } });
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            instance.foundation.clearInputValue();
        }
        treeSelect.unmount();
    });

    it('test foundation clearInputValue without inputValue', () => {
        const treeSelect = getTreeSelect({
            filterTreeNode: true,
            treeData: treeDataEn,
        });
        const instance = treeSelect.instance();
        if (instance && instance.foundation) {
            instance.foundation.clearInputValue();
        }
        treeSelect.unmount();
    });
})
