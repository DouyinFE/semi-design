import { Tree, Icon } from '../../index';
// import toJson from 'enzyme-to-json';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';

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


function getTree(props, haveDisabled = false) {
    if (haveDisabled) {
        props = { treeData: treeDataWithDisabled, ...props }
    } else {
        props = { treeData: treeData, ...props }
    }
    return mount(
        <Tree
            multiple
            {...props}
        />,
        {
            attachTo: document.getElementById('container')
        }
    );
}

describe('Tree', () => {

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

    it('defaultValue + leaf item checked', () => {
        // auto expand parent, if node exist means parent is open
        let tree = getTree({
            defaultValue: 'Beijing'
        });
        let selectedNode = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`).at(0);
        expect(selectedNode.find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(true);
        expect(selectedNode.find(`.${BASE_CLASS_PREFIX}-tree-option-label-text`).instance().textContent).toEqual('北京');
        tree.unmount();
        // array case select both
        let tree2 = getTree({
            defaultValue: ['Dongjing', 'Beijing']
        });
        let level3Nodes = tree2.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`);
        expect(level3Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(true);
        expect(level3Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-tree-option-label-text`).instance().textContent).toEqual('北京');
        expect(level3Nodes.at(2).find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(true);
        expect(level3Nodes.at(2).find(`.${BASE_CLASS_PREFIX}-tree-option-label-text`).instance().textContent).toEqual('东京');
    })

    it('defaultValue + leaf item checked => half checked parent', () => {
        let tree = getTree({
            defaultValue: ['Dongjing', 'Beijing']
        });
        let level1Nodes = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`);
        let level2Nodes = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-2`);
        expect(level1Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-indeterminate`).exists()).toEqual(true);
        expect(level1Nodes.at(1).find(`.${BASE_CLASS_PREFIX}-checkbox-indeterminate`).exists()).toEqual(false);
        expect(level1Nodes.at(1).find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(false);

        expect(level2Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-indeterminate`).exists()).toEqual(true);
        expect(level2Nodes.at(1).find(`.${BASE_CLASS_PREFIX}-tree-option-label-text`).exists()).toEqual(true);
    })

    it('defaultValue + leaf item checked => checked parent', () => {
        let tree = getTree({
            defaultValue: ['Shanghai', 'Beijing']
        });
        let level1Nodes = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`);
        let level2Nodes = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-2`);
        expect(level1Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-indeterminate`).exists()).toEqual(true);
        expect(level2Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(true);
    })

    it('defaultValue + all leaf items checked => checked ancesters', () => {
        let tree = getTree({
            defaultValue: ['Shanghai', 'Beijing', 'Dongjing', 'Daban']
        });
        let level1Nodes = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`);
        expect(level1Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(true);
    })

    it('defaultValue + parent checked => all descendants checked', () => {
        let tree = getTree({
            defaultValue: ['Yazhou'],
            defaultExpandAll: true
        });
        let checkedNode = tree.find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`);
        expect(checkedNode.length).toEqual(7);
    })

    it('defaultValue + onChangeWithObject', () => {
        let tree = getTree({
            defaultValue: treeChildren,
            defaultExpandAll: true,
            onChangeWithObject: true
        });
        let checkedNode = tree.find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`);
        expect(checkedNode.length).toEqual(3);
    })

    it('select one leaf item / onSelect / onChange', () => {
        let spyOnSelect = sinon.spy(() => { });
        let spyOnChange = sinon.spy(() => { });
        let tree = getTree({
            defaultExpandAll: true,
            onSelect: spyOnSelect,
            onChange: spyOnChange,
        });
        let nodeBeijing = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`).at(0);
        // check beijing
        nodeBeijing.simulate('click');
        // onSelect & onChange
        expect(spyOnSelect.calledWithMatch('beijing', true, { key: "beijing" })).toEqual(true);
        expect(spyOnChange.calledWithMatch(['Beijing'])).toEqual(true);
        // classname
        nodeBeijing = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`).at(0);
        expect(nodeBeijing.find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(true);
        // uncheck
        nodeBeijing.simulate('click');
        // onSelect & onChange
        expect(spyOnSelect.calledWithMatch('beijing', false, { key: "beijing" })).toEqual(true);
        expect(spyOnChange.calledWithMatch([])).toEqual(true);
        // classname
        nodeBeijing = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`).at(0);
        expect(nodeBeijing.find(`.${BASE_CLASS_PREFIX}-checkbox-indeterminate`).exists()).toEqual(false);
        expect(nodeBeijing.find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(false);
    });

    it('select two different branches of leaf items / onSelect / onChange', () => {
        let spyOnSelect = sinon.spy(() => { });
        let spyOnChange = sinon.spy(() => { });
        let tree = getTree({
            defaultExpandAll: true,
            onSelect: spyOnSelect,
            onChange: spyOnChange,
        });
        let nodelevel3 = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`);
        nodelevel3.at(0).simulate('click');
        nodelevel3.at(2).simulate('click');
        // onSelect & onChange
        expect(spyOnSelect.calledWithMatch('dongjing', true, { key: "dongjing" })).toEqual(true);
        expect(spyOnChange.calledWithMatch(['Beijing', 'Dongjing'])).toEqual(true);
    });

    it('select one branche of all leaf items / onSelect / onChange', () => {
        let spyOnSelect = sinon.spy(() => { });
        let spyOnChange = sinon.spy(() => { });
        let tree = getTree({
            defaultExpandAll: true,
            onSelect: spyOnSelect,
            onChange: spyOnChange,
        });
        let nodelevel3 = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`);
        nodelevel3.at(0).simulate('click');
        nodelevel3.at(1).simulate('click');
        // onSelect & onChange
        expect(spyOnSelect.calledWithMatch('shanghai', true, { key: "shanghai" })).toEqual(true);
        expect(spyOnChange.calledWithMatch(['Zhongguo'])).toEqual(true);
        // ui
        let level1Nodes = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`);
        let level2Nodes = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-2`);
        expect(level1Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-indeterminate`).exists()).toEqual(true);
        expect(level2Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(true);
    });

    it('select all leaf items / onSelect / onChange', () => {
        let spyOnSelect = sinon.spy(() => { });
        let spyOnChange = sinon.spy(() => { });
        let tree = getTree({
            defaultExpandAll: true,
            onSelect: spyOnSelect,
            onChange: spyOnChange,
        });
        let nodelevel3 = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`);
        nodelevel3.at(0).simulate('click');
        nodelevel3.at(1).simulate('click');
        nodelevel3.at(2).simulate('click');
        nodelevel3.at(3).simulate('click');
        // onSelect & onChange
        expect(spyOnSelect.calledWithMatch('daban', true, { key: "daban" })).toEqual(true);
        expect(spyOnChange.calledWithMatch(['Yazhou'])).toEqual(true);
        // ui
        expect(tree.find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).length).toEqual(7);
    });

    it('select a parent node / onSelect / onChange', () => {
        let spyOnSelect = sinon.spy(() => { });
        let spyOnChange = sinon.spy(() => { });
        let tree = getTree({
            defaultExpandAll: true,
            onSelect: spyOnSelect,
            onChange: spyOnChange,
        });
        let nodelevel1 = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`);
        nodelevel1.at(0).simulate('click');
        // onSelect & onChange
        expect(spyOnSelect.calledWithMatch('yazhou', true, { key: "yazhou" })).toEqual(true);
        expect(spyOnChange.calledWithMatch(['Yazhou'])).toEqual(true);
        // ui
        let checkedNode = tree.find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`);
        expect(checkedNode.length).toEqual(7);
    });

    it('onChange + onChangeWithObject', () => {
        let spyOnChange = sinon.spy(() => { });
        let tree = getTree({
            defaultExpandAll: true,
            onChangeWithObject: true,
            onChange: spyOnChange,
        });
        let nodelevel3 = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`);
        nodelevel3.at(0).simulate('click');
        nodelevel3.at(2).simulate('click');
        // onChange
        expect(spyOnChange.calledTwice).toBe(true);
        expect(spyOnChange.calledWithMatch([{
            label: '北京',
            value: 'Beijing',
            key: 'beijing',
        }, {
            label: '东京',
            value: 'Dongjing',
            key: 'dongjing'
        }])
        ).toEqual(true);
    });

    it('controlled: leaf values show correct', () => {
        let tree = getTree({
            value: 'Beijing'
        });
        let selectedNode = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`).at(0);
        expect(selectedNode.find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(true);
        expect(selectedNode.find(`.${BASE_CLASS_PREFIX}-tree-option-label-text`).instance().textContent).toEqual('北京');
        tree.unmount();
        // array case only select first item
        let tree2 = getTree({
            value: ['Dongjing', 'Beijing']
        });
        let level3Nodes = tree2.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`);
        expect(level3Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(true);
        expect(level3Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-tree-option-label-text`).instance().textContent).toEqual('北京');
        expect(level3Nodes.at(2).find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(true);
        expect(level3Nodes.at(2).find(`.${BASE_CLASS_PREFIX}-tree-option-label-text`).instance().textContent).toEqual('东京');
    });

    it('controlled: leaf values checked => ancester half checked', () => {
        let tree = getTree({
            value: ['Dongjing', 'Beijing']
        });
        let level1Nodes = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`);
        let level2Nodes = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-2`);
        expect(level1Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-indeterminate`).exists()).toEqual(true);
        expect(level1Nodes.at(1).find(`.${BASE_CLASS_PREFIX}-checkbox-indeterminate`).exists()).toEqual(false);
        expect(level1Nodes.at(1).find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(false);

        expect(level2Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-indeterminate`).exists()).toEqual(true);
        expect(level2Nodes.at(1).find(`.${BASE_CLASS_PREFIX}-tree-option-label-text`).exists()).toEqual(true);
    });

    it('controlled: leaf values checked => parent checked + ancester half checked', () => {
        let tree = getTree({
            value: ['Shanghai', 'Beijing']
        });
        let level1Nodes = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`);
        let level2Nodes = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-2`);
        expect(level1Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-indeterminate`).exists()).toEqual(true);
        expect(level2Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(true);
    });

    it('controlled: all leaf items checked => checked ancesters', () => {
        let tree = getTree({
            value: ['Shanghai', 'Beijing', 'Dongjing', 'Daban']
        });
        let level1Nodes = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`);
        expect(level1Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(true);
    });

    it('controlled: fire onChange and ui not update', () => {
        let spyOnChange = sinon.spy(() => { });
        let tree = getTree({
            value: '',
            defaultExpandAll: true,
            onChange: spyOnChange,
        });
        expect(tree.find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(false);
        let nodeBeijing = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`).at(0);
        // select beijing
        nodeBeijing.simulate('click');
        // onChange
        expect(spyOnChange.calledOnce).toBe(true);
        expect(spyOnChange.calledWithMatch(["Beijing"])).toEqual(true);
        expect(tree.find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(false);
    });

    it('treedata in json format', () => {
        let spyOnChange = sinon.spy(() => { });
        let tree = mount(
            <Tree
                defaultExpandAll={true}
                onChange={spyOnChange}
                multiple
                treeDataSimpleJson={{
                    "Node1": {
                        "Child1": '0-0-1',
                        "Child2": '0-0-2',
                    },
                    "Node2": "0-1"
                }}
            />,
            {
                attachTo: document.getElementById('container')
            }
        );
        let nodes = tree.find(`.${BASE_CLASS_PREFIX}-tree-option`);
        expect(nodes.length).toEqual(4);
        // select
        let childNodes = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-2`);
        childNodes.at(0).simulate('click');
        expect(spyOnChange.calledOnce).toBe(true);
        expect(spyOnChange.calledWithMatch({
            "Node1": {
                "Child1": '0-0-1',
            },
        })).toEqual(true);
        // check another child
        childNodes.at(1).simulate('click');
        expect(spyOnChange.calledWithMatch(
            {
                "Node1": {
                    "Child1": '0-0-1',
                    "Child2": '0-0-2'
                },
            }
        )).toEqual(true);
        // unchecked
        tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`).at(0).simulate('click');
        expect(spyOnChange.calledWithMatch({})).toEqual(true);
    });

    it('onContextMenu', () => {
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: () => { } } }
        let spyOnContextMenu = sinon.spy(() => { });
        let tree = getTree({
            onContextMenu: spyOnContextMenu,
        });
        let event = {};
        // yazhou
        let topNodeAsia = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`).at(0);
        // right click on yazhou
        topNodeAsia.simulate('contextmenu', nativeEvent);
        expect(spyOnContextMenu.calledWithMatch(event, { key: 'yazhou' })).toEqual(true);
        // should not select item
        expect(topNodeAsia.hasClass(`${BASE_CLASS_PREFIX}-tree-option-selected`)).toEqual(false);
        expect(tree.state().checkedKeys.size).toEqual(0);
        expect(tree.state().halfCheckedKeys.size).toEqual(0);
    });

    it('expandAction = click', () => {
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: () => { } } }
        let spyOnExpand = sinon.spy(() => { });
        let tree = getTree({
            onExpand: spyOnExpand,
            expandAction: 'click',
        });
        // yazhou
        let topNodeAsia = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`).at(0);
        // expand yazhou
        topNodeAsia.simulate('click', nativeEvent);
        expect(spyOnExpand.calledOnce).toBe(true);
        expect(spyOnExpand.calledWithMatch(["yazhou"], { expanded: true, node: { key: 'yazhou' } })).toEqual(true);
        expect(tree.state().expandedKeys).toEqual(new Set(["yazhou"]));
        expect(tree.state().checkedKeys.size).toEqual(7);
        // collapse yazhou
        topNodeAsia.simulate('click', nativeEvent);
        expect(spyOnExpand.calledWithMatch([], { expanded: false, node: { key: 'yazhou' } })).toEqual(true);
        expect(tree.state().checkedKeys.size).toEqual(0);
        expect(tree.state().expandedKeys.size).toEqual(0);
    });

    it('expandAction = doubleClick', () => {
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: () => { } } }
        let spyOnExpand = sinon.spy(() => { });
        let tree = getTree({
            onExpand: spyOnExpand,
            expandAction: 'doubleClick',
        });
        // yazhou
        let topNodeAsia = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`).at(0);
        // expand yazhou
        topNodeAsia.simulate('click', nativeEvent);
        expect(spyOnExpand.calledOnce).toBe(false);
        topNodeAsia.simulate('doubleClick', nativeEvent);
        expect(spyOnExpand.calledOnce).toBe(true);
        expect(spyOnExpand.calledWithMatch(["yazhou"], { expanded: true, node: { key: 'yazhou' } })).toEqual(true);
        // state
        expect(tree.state().expandedKeys).toEqual(new Set(["yazhou"]));
        expect(tree.state().checkedKeys.size).toEqual(7);
    });

    it('async load data + check dynamic children when their parent is checked', () => {
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: () => { } } }
        function mockLoadData() { }
        const data = {
            label: '亚洲',
            value: 'Asia',
            key: 'asia',
        };
        let tree = getTree({
            loadData: mockLoadData,
            defaultValue: 'Asia',
            treeData: [data]
        });
        tree.setProps({
            treeData: [{
                ...data, children: treeChildren
            }]
        });
        // expand yazhou
        expect(tree.state().checkedKeys.size).toEqual(3);
    });

    it('disableStrictly', () => {
        let spyOnChange = sinon.spy(() => { });
        let tree = getTree({
            defaultExpandAll: true,
            onChange: spyOnChange,
            disableStrictly: true, 
            defaultValue: 'Shanghai',
            multiple: true
        }, true);
        let nodes = tree.find(`.${BASE_CLASS_PREFIX}-tree-option-disabled`);
        expect(tree.state().checkedKeys.size).toEqual(1);
        expect(nodes.length).toEqual(3);
        // cannot select
        let nodeBeijing = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`).at(0);
        nodeBeijing.simulate('click');
        expect(spyOnChange.notCalled).toBe(true);
        // cannot change by ancestor
        let nodeAsia = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`).at(0);
        nodeAsia.simulate('click');
        expect(tree.state().checkedKeys.size).toEqual(3);
    });

    it('disabled', () => {
        let spyOnChange = sinon.spy(() => { });
        let tree = getTree({
            defaultExpandAll: true,
            disabled: true,
            multiple: true,
            onChange: spyOnChange,
        });
        let nodes = tree.find(`.${BASE_CLASS_PREFIX}-tree-option-disabled`);
        expect(nodes.length).toEqual(10);
        // cannot select
        let nodeBeijing = tree.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`).at(0);
        nodeBeijing.simulate('click');
        expect(spyOnChange.notCalled).toBe(true);
        expect(tree.find(`.${BASE_CLASS_PREFIX}-tree-option-selected`).exists()).toEqual(false);
    });
})
