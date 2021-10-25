import { TreeSelect, Icon } from '../../index';
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
            multiple
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

    it('defaultValue + leaf item checked', () => {
        // auto expand parent, if node exist means parent is open
        let treeSelect = getTreeSelect({
            defaultValue: 'Beijing'
        });
        let selectedNode = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`).at(0);
        let tagGroup = treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`);
        expect(tagGroup.length).toEqual(1);
        expect(tagGroup.at(0).instance().textContent).toEqual('北京');
        expect(selectedNode.find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(true);
        expect(selectedNode.find(`.${BASE_CLASS_PREFIX}-tree-option-label-text`).instance().textContent).toEqual('北京');
        treeSelect.unmount();
        // array case select both
        let treeSelect2 = getTreeSelect({
            defaultValue: ['Dongjing', 'Beijing']
        });
        let level3Nodes = treeSelect2.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`);
        tagGroup = treeSelect2.find(`.${BASE_CLASS_PREFIX}-tag`);
        expect(tagGroup.length).toEqual(2);
        expect(tagGroup.at(0).instance().textContent).toEqual('东京');
        expect(tagGroup.at(1).instance().textContent).toEqual('北京');
        expect(level3Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(true);
        expect(level3Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-tree-option-label-text`).instance().textContent).toEqual('北京');
        expect(level3Nodes.at(2).find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(true);
        expect(level3Nodes.at(2).find(`.${BASE_CLASS_PREFIX}-tree-option-label-text`).instance().textContent).toEqual('东京');
    })

    it('defaultValue + leaf item checked => half checked parent', () => {
        let treeSelect = getTreeSelect({
            defaultValue: ['Dongjing', 'Beijing']
        });
        let level1Nodes = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`);
        let level2Nodes = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-2`);
        expect(level1Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-indeterminate`).exists()).toEqual(true);
        expect(level1Nodes.at(1).find(`.${BASE_CLASS_PREFIX}-checkbox-indeterminate`).exists()).toEqual(false);
        expect(level1Nodes.at(1).find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(false);

        expect(level2Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-indeterminate`).exists()).toEqual(true);
        expect(level2Nodes.at(1).find(`.${BASE_CLASS_PREFIX}-tree-option-label-text`).exists()).toEqual(true);
    })

    it('defaultValue + leaf item checked => checked parent', () => {
        let treeSelect = getTreeSelect({
            defaultValue: ['Shanghai', 'Beijing']
        });
        let tagGroup = treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`);
        expect(tagGroup.length).toEqual(1);
        expect(tagGroup.at(0).instance().textContent).toEqual('中国');

        let level1Nodes = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`);
        let level2Nodes = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-2`);
        expect(level1Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-indeterminate`).exists()).toEqual(true);
        expect(level2Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(true);
    })

    it('defaultValue + all leaf items checked => checked ancesters', () => {
        let treeSelect = getTreeSelect({
            defaultValue: ['Shanghai', 'Beijing', 'Dongjing', 'Daban']
        });
        let tagGroup = treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`);
        expect(tagGroup.length).toEqual(1);
        expect(tagGroup.at(0).instance().textContent).toEqual('亚洲');

        let level1Nodes = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`);
        expect(level1Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(true);
    })

    it('defaultValue + parent checked => all descendants checked', () => {
        let treeSelect = getTreeSelect({
            defaultValue: ['Yazhou'],
            defaultExpandAll: true
        });
        let checkedNode = treeSelect.find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`);
        expect(checkedNode.length).toEqual(7);
    })

    it('defaultValue + onChangeWithObject', () => {
        let treeSelect = getTreeSelect({
            defaultValue: treeChildren,
            defaultExpandAll: true,
            onChangeWithObject: true
        });
        let checkedNode = treeSelect.find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`);
        expect(checkedNode.length).toEqual(3);
    })

    it('maxTagCount', () => {
        let treeSelect = getTreeSelect({
            defaultValue: ['Shanghai', 'Dongjing', 'Daban', 'Meiguo'],
            maxTagCount: 2,
            defaultExpandAll: true,
        });
        let tagGroup = treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`);
        expect(tagGroup.length).toEqual(3);
        expect(tagGroup.at(2).instance().textContent).toEqual('+1');

        let checkedNode = treeSelect.find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`);
        expect(checkedNode.length).toEqual(5);
    });

    it('removeTag', () => {
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: () => { } } }
        let treeSelect = getTreeSelect({
            defaultValue: ['Shanghai', 'Dongjing'],
            defaultExpandAll: true,
        });
        let tagGroup = treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`);
        let closeBtn = tagGroup.at(1).find(`.${BASE_CLASS_PREFIX}-tag-close`);

        closeBtn.simulate('click', nativeEvent);

        tagGroup = treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`);
        expect(tagGroup.length).toEqual(1);
        expect(tagGroup.at(0).instance().textContent).toEqual('上海');

        let checkedNode = treeSelect.find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`);
        expect(checkedNode.length).toEqual(1);
    });

    it('expandedKeys + autoExpandParent', () => {
        // auto expand parent is always true when mounted
        let treeSelect = getTreeSelect({
            expandedKeys: ['beimeizhou']
        });
        // yazhou beimeizhou
        let topNode = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`);
        expect(topNode.at(0).hasClass(`${BASE_CLASS_PREFIX}-tree-option-collapsed`)).toEqual(true);
        expect(topNode.at(1).hasClass(`${BASE_CLASS_PREFIX}-tree-option-collapsed`)).toEqual(false);

        treeSelect.setProps({ expandedKeys: ['riben'] });
        treeSelect.update();
        topNode = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`);
        expect(topNode.at(0).hasClass(`${BASE_CLASS_PREFIX}-tree-option-collapsed`)).toEqual(true);
        expect(topNode.at(1).hasClass(`${BASE_CLASS_PREFIX}-tree-option-collapsed`)).toEqual(true);

        // autoExpandParent
        treeSelect.setProps({ autoExpandParent: true });
        treeSelect.update();
        topNode = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`);
        expect(topNode.at(0).hasClass(`${BASE_CLASS_PREFIX}-tree-option-collapsed`)).toEqual(false);
        expect(topNode.at(1).hasClass(`${BASE_CLASS_PREFIX}-tree-option-collapsed`)).toEqual(true);
    });

    it('select one leaf item / onSelect / onChange', () => {
        let spyOnSelect = sinon.spy(() => { });
        let spyOnChange = sinon.spy(() => { });
        let treeSelect = getTreeSelect({
            defaultExpandAll: true,
            onSelect: spyOnSelect,
            onChange: spyOnChange,
        });
        let nodeBeijing = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`).at(0);
        // check beijing
        nodeBeijing.simulate('click');

        let tagGroup = treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`);
        expect(tagGroup.length).toEqual(1);
        expect(tagGroup.at(0).instance().textContent).toEqual('北京');

        // onSelect & onChange
        expect(spyOnSelect.calledWithMatch('beijing', true, { key: "beijing" })).toEqual(true);
        expect(spyOnChange.calledWithMatch(['Beijing'])).toEqual(true);
        // classname
        nodeBeijing = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`).at(0);
        expect(nodeBeijing.find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(true);
        // uncheck
        nodeBeijing.simulate('click');

        tagGroup = treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`);
        expect(tagGroup.length).toEqual(0);

        // onSelect & onChange
        expect(spyOnSelect.calledWithMatch('beijing', false, { key: "beijing" })).toEqual(true);
        expect(spyOnChange.calledWithMatch([])).toEqual(true);
        // classname
        nodeBeijing = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`).at(0);
        expect(nodeBeijing.find(`.${BASE_CLASS_PREFIX}-checkbox-indeterminate`).exists()).toEqual(false);
        expect(nodeBeijing.find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(false);
    });

    it('select two different branches of leaf items / onSelect / onChange', () => {
        let spyOnSelect = sinon.spy(() => { });
        let spyOnChange = sinon.spy(() => { });
        let treeSelect = getTreeSelect({
            defaultExpandAll: true,
            onSelect: spyOnSelect,
            onChange: spyOnChange,
        });
        let nodelevel3 = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`);
        nodelevel3.at(0).simulate('click');
        nodelevel3.at(2).simulate('click');

        let tagGroup = treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`);
        expect(tagGroup.length).toEqual(2);

        // onSelect & onChange
        expect(spyOnSelect.calledWithMatch('dongjing', true, { key: "dongjing" })).toEqual(true);
        expect(spyOnChange.calledWithMatch(['Beijing', 'Dongjing'])).toEqual(true);
    });

    it('select one branche of all leaf items / onSelect / onChange', () => {
        let spyOnSelect = sinon.spy(() => { });
        let spyOnChange = sinon.spy(() => { });
        let treeSelect = getTreeSelect({
            defaultExpandAll: true,
            onSelect: spyOnSelect,
            onChange: spyOnChange,
        });
        let nodelevel3 = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`);
        nodelevel3.at(0).simulate('click');
        nodelevel3.at(1).simulate('click');

        let tagGroup = treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`);
        expect(tagGroup.length).toEqual(1);

        // onSelect & onChange
        expect(spyOnSelect.calledWithMatch('shanghai', true, { key: "shanghai" })).toEqual(true);
        expect(spyOnChange.calledWithMatch(['Zhongguo'])).toEqual(true);
        // ui
        let level1Nodes = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`);
        let level2Nodes = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-2`);
        expect(level1Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-indeterminate`).exists()).toEqual(true);
        expect(level2Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(true);
    });

    it('select all leaf items / onSelect / onChange', () => {
        let spyOnSelect = sinon.spy(() => { });
        let spyOnChange = sinon.spy(() => { });
        let treeSelect = getTreeSelect({
            defaultExpandAll: true,
            onSelect: spyOnSelect,
            onChange: spyOnChange,
        });
        let nodelevel3 = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`);
        nodelevel3.at(0).simulate('click');
        nodelevel3.at(1).simulate('click');
        nodelevel3.at(2).simulate('click');
        nodelevel3.at(3).simulate('click');

        let tagGroup = treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`);
        expect(tagGroup.length).toEqual(1);

        // onSelect & onChange
        expect(spyOnSelect.calledWithMatch('daban', true, { key: "daban" })).toEqual(true);
        expect(spyOnChange.calledWithMatch(['Yazhou'])).toEqual(true);
        // ui
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).length).toEqual(7);
    });

    it('select a parent node / onSelect / onChange', () => {
        let spyOnSelect = sinon.spy(() => { });
        let spyOnChange = sinon.spy(() => { });
        let treeSelect = getTreeSelect({
            defaultExpandAll: true,
            onSelect: spyOnSelect,
            onChange: spyOnChange,
        });
        let nodelevel1 = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`);
        nodelevel1.at(0).simulate('click');
        // onSelect & onChange
        expect(spyOnSelect.calledWithMatch('yazhou', true, { key: "yazhou" })).toEqual(true);
        expect(spyOnChange.calledWithMatch(['Yazhou'])).toEqual(true);
        // ui
        let checkedNode = treeSelect.find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`);
        expect(checkedNode.length).toEqual(7);
    });

    // it('onChange + valueInArray', () => {
    //     let spyOnSelect = sinon.spy(() => { });
    //     let spyOnChange = sinon.spy(() => { });
    //     let treeSelect = getTreeSelect({
    //         defaultExpandAll: true,
    //         onSelect: spyOnSelect,
    //         onChange: spyOnChange,
    //         valueInArray: true,
    //     });
    //     let nodeBeijing = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`).at(0);
    //     // select beijing
    //     nodeBeijing.simulate('click');
    //     // onSelect & onChange
    //     expect(spyOnSelect.calledOnce).toBe(true);
    //     expect(spyOnChange.calledOnce).toBe(true);
    //     expect(spyOnSelect.calledWithMatch('beijing', true, { key: "beijing" })).toEqual(true);
    //     expect(spyOnChange.calledWithMatch(
    //         [['Yazhou', 'Zhongguo', 'Beijing']],
    //         [{ label: "北京", value: "Beijing", key: "beijing" }]
    //     )).toEqual(true);
    // });

    it('onChange + leafOnly', () => {
        let spyOnSelect = sinon.spy(() => { });
        let spyOnChange = sinon.spy(() => { });
        let treeSelect = getTreeSelect({
            defaultExpandAll: true,
            onSelect: spyOnSelect,
            onChange: spyOnChange,
            leafOnly: true,
        });
        let nodeChina = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-2`).at(0);
        // select China
        nodeChina.simulate('click');
        // onSelect & onChange
        expect(spyOnSelect.calledOnce).toBe(true);
        expect(spyOnChange.calledOnce).toBe(true);
        expect(spyOnSelect.calledWithMatch('zhongguo', true, { key: "zhongguo" })).toEqual(true);
        expect(spyOnChange.calledWithMatch(
            ['Beijing', 'Shanghai'],
        )).toEqual(true);

        let tagGroup = treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`);
        expect(tagGroup.length).toEqual(2);
    });

    it('controlled: leaf values show correct', () => {
        let treeSelect = getTreeSelect({
            value: 'Beijing'
        });
        let tagGroup = treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`);
        expect(tagGroup.length).toEqual(1);
        expect(tagGroup.at(0).instance().textContent).toEqual('北京');

        let selectedNode = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`).at(0);
        expect(selectedNode.find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(true);
        expect(selectedNode.find(`.${BASE_CLASS_PREFIX}-tree-option-label-text`).instance().textContent).toEqual('北京');
        treeSelect.unmount();

        let treeSelect2 = getTreeSelect({
            value: ['Dongjing', 'Beijing']
        });

        tagGroup = treeSelect2.find(`.${BASE_CLASS_PREFIX}-tag`);
        expect(tagGroup.length).toEqual(2);
        expect(tagGroup.at(0).instance().textContent).toEqual('东京');
        expect(tagGroup.at(1).instance().textContent).toEqual('北京');

        let level3Nodes = treeSelect2.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`);
        expect(level3Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(true);
        expect(level3Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-tree-option-label-text`).instance().textContent).toEqual('北京');
        expect(level3Nodes.at(2).find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(true);
        expect(level3Nodes.at(2).find(`.${BASE_CLASS_PREFIX}-tree-option-label-text`).instance().textContent).toEqual('东京');
    });

    it('controlled: leaf values checked => ancester half checked', () => {
        let treeSelect = getTreeSelect({
            value: ['Dongjing', 'Beijing']
        });
        let level1Nodes = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`);
        let level2Nodes = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-2`);

        let tagGroup = treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`);
        expect(tagGroup.length).toEqual(2);

        expect(level1Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-indeterminate`).exists()).toEqual(true);
        expect(level1Nodes.at(1).find(`.${BASE_CLASS_PREFIX}-checkbox-indeterminate`).exists()).toEqual(false);
        expect(level1Nodes.at(1).find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(false);

        expect(level2Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-indeterminate`).exists()).toEqual(true);
        expect(level2Nodes.at(1).find(`.${BASE_CLASS_PREFIX}-tree-option-label-text`).exists()).toEqual(true);
    });

    it('controlled: leaf values checked => parent checked + ancester half checked', () => {
        let treeSelect = getTreeSelect({
            value: ['Shanghai', 'Beijing']
        });

        let tagGroup = treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`);
        expect(tagGroup.length).toEqual(1);

        let level1Nodes = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`);
        let level2Nodes = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-2`);
        expect(level1Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-indeterminate`).exists()).toEqual(true);
        expect(level2Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(true);
    });

    it('controlled: all leaf items checked => checked ancesters', () => {
        let treeSelect = getTreeSelect({
            value: ['Shanghai', 'Beijing', 'Dongjing', 'Daban']
        });

        let tagGroup = treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`);
        expect(tagGroup.length).toEqual(1);

        let level1Nodes = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`);
        expect(level1Nodes.at(0).find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(true);
    });

    it('controlled: fire onChange and ui not update', () => {
        let spyOnChange = sinon.spy(() => { });
        let treeSelect = getTreeSelect({
            value: '',
            defaultExpandAll: true,
            onChange: spyOnChange,
        });
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(false);
        let nodeBeijing = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-3`).at(0);
        // select beijing
        nodeBeijing.simulate('click');
        // render tag
        let tagGroup = treeSelect.find(`.${BASE_CLASS_PREFIX}-tag`);
        expect(tagGroup.length).toEqual(0);
        // onChange
        expect(spyOnChange.calledOnce).toBe(true);
        expect(spyOnChange.calledWithMatch(["Beijing"])).toEqual(true);
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-checkbox-inner-checked`).exists()).toEqual(false);
    });

    it('disabled', () => {
        let treeSelect = getTreeSelect({
            defaultValue: ['Dongjing', 'Beijing'],
            disabled: true,
        });
        expect(treeSelect.find(`.${BASE_CLASS_PREFIX}-tag-closable`).length).toEqual(0);
    });

    it('controlled: empty treeDate with value', () => {
        let treeSelect = getTreeSelect({
            value: [''],
            treeData: []
        });

        expect(treeSelect.state().selectedKeys.length).toEqual(0);
    });

    it('renderSelectedItem', () => {
        let spyOnSelect = sinon.spy(() => { });
        let spyOnChange = sinon.spy(() => { });
        let treeSelect = getTreeSelect({
            renderSelectedItem: (item, { index, onClose }) => ({ content: item.value, isRenderInTag: true }),
            defaultExpandAll: true,
            onSelect: spyOnSelect,
            onChange: spyOnChange,
        });
        const yaZhouKey = 'yazhou';
        const yaZhouValue = 'Yazhou';
        let nodeYaZhou = treeSelect.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`).at(0);
        nodeYaZhou.simulate('click');
        // 判断回调
        expect(spyOnSelect.calledOnce).toBe(true);
        expect(spyOnChange.calledOnce).toBe(true);
        expect(spyOnSelect.getCall(0).args[0]).toEqual(yaZhouKey);
        expect(spyOnChange.getCall(0).args[0]).toEqual([yaZhouValue]);
        // 判断内容是否value
        const innerHTML = document.querySelector('.semi-tag .semi-tag-content').textContent;
        expect(innerHTML).toEqual(yaZhouValue);
    });

    it('disabledStrictly', () => {
        const treeSelect1 = mount(
            <TreeSelect
                style={{ width: 300 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                multiple
                defaultOpen
                defaultExpandAll
                disableStrictly
                multiple
                leafOnly
                treeData={treeData}
                {...commonProps}
            />
        );
        expect(treeSelect1.find(`.${BASE_CLASS_PREFIX}-tag`).length).toEqual(0);
        const clickedNode1 = treeSelect1.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`).at(0);
        clickedNode1.simulate('click', {})
        expect(treeSelect1.find(`.${BASE_CLASS_PREFIX}-tag`).length).toEqual(4);

        const treeSelect2 = mount(
            <TreeSelect
                style={{ width: 300 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                multiple
                defaultOpen
                defaultExpandAll
                disableStrictly
                multiple
                treeData={treeDataWithDisabled}
                {...commonProps}
            />
        );
        expect(treeSelect2.find(`.${BASE_CLASS_PREFIX}-tag`).length).toEqual(0);
        const clickedNode2 = treeSelect2.find(`.${BASE_CLASS_PREFIX}-tree-option.${BASE_CLASS_PREFIX}-tree-option-level-1`).at(0);
        clickedNode2.simulate('click', {})
        expect(treeSelect2.find(`.${BASE_CLASS_PREFIX}-tag`).length).toEqual(1);
    });
})
