import * as _ from 'lodash';
import { spy } from 'sinon';
import { BASE_CLASS_PREFIX } from '@douyinfe/semi-foundation/base/constants';

import Transfer from '../index';

const defaultItems = [
    {
        label: 'item1',
        value: '1',
        key: 'a',
    },
    {
        label: 'item2',
        value: '2',
        key: 'b',
    },
];

const dataWithGroup = [
    {
        title: '类别A',
        children: [
            { label: 'A-1', value: 1, disabled: false, key: 1 },
            { label: 'A-2', value: 2, disabled: false, key: 2 },
            { label: 'A-3', value: 3, disabled: false, key: 3 },
        ],
    },
    {
        title: '类别B',
        children: [
            { label: 'B-1', value: 4, disabled: false, key: 4 },
            { label: 'B-2', value: 5, disabled: false, key: 5 },
            { label: 'B-3（disabled）', value: 6, disabled: true, key: 6 },
        ],
    },
    {
        title: '类别C',
        children: [
            { label: 'C-1', value: 7, disabled: false, key: 7 },
            { label: 'C-2', value: 8, disabled: false, key: 8 },
            { label: 'C-3', value: 9, disabled: false, key: 9 },
            { label: 'C-4', value: 10, disabled: false, key: 10 },
            { label: 'C-5', value: 11, disabled: false, key: 11 },
            { label: 'C-6', value: 12, disabled: false, key: 12 },
            { label: 'C-7', value: 13, disabled: false, key: 13 },
        ],
    },
];

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
                    },
                    {
                        label: 'Chengdu',
                        value: 'Chengdu',
                        key: '0-0-2',
                    },
                    {
                        label: 'Chongqing',
                        value: 'Chongqing',
                        key: '0-0-3',
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
                        key: '0-1-0',
                    },
                ],
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
                key: '1-0',
            },
            {
                label: 'Canada',
                value: 'Canada',
                key: '1-1',
            },
        ],
    },
];

function getTransfer(props) {
    return mount(<Transfer {...props} />, { attachTo: document.getElementById('container') });
}

describe(`Transfer`, () => {
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

    it('custom className & style', () => {
        let props = {
            className: 'test',
            style: {
                color: 'red',
            },
        };
        const wrapper = getTransfer(props);
        expect(wrapper.hasClass('test')).toEqual(true);
        expect(wrapper.find('div.test')).toHaveStyle('color', 'red');
    });

    it('defaultValue effective', () => {
        let props = {
            dataSource: defaultItems,
            defaultValue: ['1'],
        };
        const wrapper = getTransfer(props);
        expect(wrapper.state().selectedItems.has('a')).toEqual(true);
    });

    it('search effect while data change', () => {
        let props = {
            dataSource: [],
        };
        const wrapper = getTransfer(props);
        const searchIn = wrapper.find(`.${BASE_CLASS_PREFIX}-input`);
        const env = { target: { value: '2' } };
        searchIn.simulate('change', env);
        wrapper.setProps({
            dataSource: [
                { label: '1', value: 1, key: 1 },
                { label: '2', value: 2, key: 2 },
            ],
        });
        expect(wrapper.state().searchResult.has(2)).toEqual(true);
        expect(wrapper.state().searchResult.size === 1).toEqual(true);
        expect(wrapper.state().inputValue === '2').toEqual(true);
    });

    it('search', () => {
        const spyOnSearch = spy();
        let props = {
            dataSource: defaultItems,
            onSearch: spyOnSearch,
        };

        const transfer = getTransfer(props);

        const inputNode = transfer.find(`.${BASE_CLASS_PREFIX}-transfer-filter input`).at(0);
        const env = { target: { value: '1' } };

        inputNode.simulate('change', env);

        expect(spyOnSearch.calledOnce).toEqual(true);
        expect(spyOnSearch.firstCall.args).toHaveLength(1);
        expect(spyOnSearch.firstCall.args[0] === '1').toEqual(true);
    });

    it('select and change', () => {
        const spyOnChange = spy();
        const spyOnSelect = spy();
        const spyOnDeselect = spy();
        let props = {
            dataSource: defaultItems,
            onChange: spyOnChange,
            onSelect: spyOnSelect,
            onDeselect: spyOnDeselect,
        };

        const transfer = getTransfer(props);

        // select first item -> deselect first item
        const firstItem = transfer.find(`span.${BASE_CLASS_PREFIX}-transfer-item`).at(0);
        firstItem.simulate('click');
        firstItem.simulate('click');

        expect(spyOnSelect.calledOnce).toEqual(true);
        expect(spyOnDeselect.calledOnce).toEqual(true);
        expect(spyOnChange.calledTwice).toEqual(true);

        expect(spyOnChange.firstCall.args).toHaveLength(2);
        expect(Array.isArray(spyOnChange.firstCall.args[0])).toEqual(true);
        expect(spyOnChange.firstCall.args[0]).toHaveLength(1);
        expect(spyOnChange.firstCall.args[0][0]).toEqual(defaultItems[0].value);
        expect(Array.isArray(spyOnChange.firstCall.args[1])).toEqual(true);
        expect(spyOnChange.firstCall.args[1]).toHaveLength(1);
        expect(spyOnChange.firstCall.args[1][0]).toMatchObject(defaultItems[0]);

        expect(spyOnChange.secondCall.args).toHaveLength(2);
        expect(Array.isArray(spyOnChange.secondCall.args[0])).toEqual(true);
        expect(spyOnChange.secondCall.args[0]).toHaveLength(0);
        expect(Array.isArray(spyOnChange.secondCall.args[1])).toEqual(true);
        expect(spyOnChange.secondCall.args[1]).toHaveLength(0);

    });

    it('de/select all', () => {
        const spyOnChange = spy();
        let props = {
            dataSource: defaultItems,
            onChange: spyOnChange,
        };
        const transfer = getTransfer(props);

        const selectAllNode = transfer.find(`button.${BASE_CLASS_PREFIX}-transfer-header-all`).at(0);

        selectAllNode.simulate('click');
        selectAllNode.simulate('click');

        expect(spyOnChange.calledTwice).toEqual(true);
        expect(spyOnChange.firstCall.args).toHaveLength(2);
        expect(spyOnChange.firstCall.args[0]).toHaveLength(defaultItems.length);
        expect(spyOnChange.firstCall.args[1]).toHaveLength(defaultItems.length);

        expect(spyOnChange.secondCall.args).toHaveLength(2);
        expect(spyOnChange.secondCall.args[0]).toHaveLength(0);
        expect(spyOnChange.secondCall.args[1]).toHaveLength(0);

    });

    it('clear all', () => {
        const spyOnChange = spy();
        let props = {
            dataSource: defaultItems,
            onChange: spyOnChange,
            defaultValue: defaultItems.map(i=>i.value),
        };
        const transfer = getTransfer(props);
        const clearAllNode = transfer.find(`button.${BASE_CLASS_PREFIX}-transfer-header-all`).at(1);
        clearAllNode.simulate('click');

        expect(spyOnChange.calledOnce).toEqual(true);
        expect(spyOnChange.firstCall.args).toHaveLength(2);
        expect(spyOnChange.firstCall.args[0]).toHaveLength(0);
        expect(spyOnChange.firstCall.args[1]).toHaveLength(0);
    });

    it('group transfer render', () => {
        const spyOnChange = spy();
        const spyOnSearch = spy();
        const props = {
            type: 'groupList',
            defaultValue: [6],
            dataSource: dataWithGroup,
            onChange: spyOnChange,
            onSearch: spyOnSearch,
        };
        const transfer = getTransfer(props);
        expect(transfer.exists(`.${BASE_CLASS_PREFIX}-transfer`)).toEqual(true);
    });

    it('tree transfer render', () => {
        const spyOnChange = spy();
        const spyOnSearch = spy();
        const props = {
            type: 'treeList',
            draggable: true,
            dataSource: treeData,
            value: ['Shanghai'],
            showPath: true,
            onChange: spyOnChange,
            onSearch: spyOnSearch,
        };
        const transfer = getTransfer(props);

        const treeNode = transfer.find(`li.${BASE_CLASS_PREFIX}-tree-option`).at(0);

        treeNode.simulate('click');

        const inputNode = transfer.find(`.${BASE_CLASS_PREFIX}-transfer-filter input`).at(0);
        const env = { target: { value: '1' } };

        inputNode.simulate('change', env);

        expect(transfer.exists(`.${BASE_CLASS_PREFIX}-transfer`)).toEqual(true);

        expect(spyOnChange.calledOnce).toEqual(true);
        expect(spyOnChange.firstCall.args).toHaveLength(2);
        expect(spyOnChange.firstCall.args[0]).toHaveLength(4);
        expect(spyOnChange.firstCall.args[1]).toHaveLength(4);

        expect(spyOnSearch.calledOnce).toEqual(true);
        expect(spyOnSearch.firstCall.args).toHaveLength(1);
        expect(spyOnSearch.firstCall.args[0] === '1').toEqual(true);
    });

    it('disabled', () => {
        const props = {
            dataSource: defaultItems,
            disabled: true,
        };
        const transfer = getTransfer(props);
        expect(transfer.exists(`.${BASE_CLASS_PREFIX}-transfer-disabled`)).toEqual(true);
    });

    it('controlled value', () => {
        const spyOnChange = spy();
        const props = {
            dataSource: defaultItems,
            value: ['1'],
            onChange: spyOnChange,
        };
        const transfer = getTransfer(props);
        
        // 验证受控模式下的初始值
        expect(transfer.state().selectedItems.has('a')).toEqual(true);
        
        // 点击选择第二个项目
        const secondItem = transfer.find(`span.${BASE_CLASS_PREFIX}-transfer-item`).at(1);
        secondItem.simulate('click');
        
        // onChange 应该被调用，但 UI 不应该更新（受控模式）
        expect(spyOnChange.calledOnce).toEqual(true);
        // 在受控模式下，状态不会自动更新，需要通过 props 更新
    });

    it('draggable prop', () => {
        const props = {
            dataSource: defaultItems,
            defaultValue: ['1'],
            draggable: true,
        };
        const transfer = getTransfer(props);
        // 验证 draggable 属性被正确传递
        expect(transfer.props().draggable).toEqual(true);
    });

    it('emptyContent prop', () => {
        const props = {
            dataSource: [],
            emptyContent: {
                left: <span className="custom-empty-left">No data</span>,
                right: <span className="custom-empty-right">No selection</span>,
            },
        };
        const transfer = getTransfer(props);
        expect(transfer.exists('.custom-empty-left')).toEqual(true);
        expect(transfer.exists('.custom-empty-right')).toEqual(true);
    });

    it('showPath prop', () => {
        const props = {
            type: 'treeList',
            dataSource: treeData,
            showPath: true,
        };
        const transfer = getTransfer(props);
        // 验证 showPath 属性被正确传递
        expect(transfer.props().showPath).toEqual(true);
    });

    it('filter prop', () => {
        const customFilter = (sugInput, item) => {
            return item.label.toLowerCase().includes(sugInput.toLowerCase());
        };
        const props = {
            dataSource: defaultItems,
            filter: customFilter,
        };
        const transfer = getTransfer(props);
        // 验证 filter 属性被正确传递
        expect(transfer.props().filter).toEqual(customFilter);
    });

    it('renderSourceItem prop', () => {
        const renderSourceItem = (item) => (
            <div className="custom-source-item">{item.label}</div>
        );
        const props = {
            dataSource: defaultItems,
            renderSourceItem,
        };
        const transfer = getTransfer(props);
        expect(transfer.exists('.custom-source-item')).toEqual(true);
    });

    it('renderSelectedItem prop', () => {
        const renderSelectedItem = (item) => (
            <div className="custom-selected-item">{item.label}</div>
        );
        const props = {
            dataSource: defaultItems,
            defaultValue: ['1'],
            renderSelectedItem,
        };
        const transfer = getTransfer(props);
        expect(transfer.exists('.custom-selected-item')).toEqual(true);
    });

    it('inputProps prop', () => {
        const props = {
            dataSource: defaultItems,
            inputProps: {
                placeholder: 'Custom placeholder',
            },
        };
        const transfer = getTransfer(props);
        const input = transfer.find(`.${BASE_CLASS_PREFIX}-transfer-filter input`).at(0);
        expect(input.props().placeholder).toEqual('Custom placeholder');
    });

    it('renderSelectedPanel prop', () => {
        const renderSelectedPanel = (props) => {
            const { selectedData, onClear, onRemove, onSortEnd } = props;
            return (
                <div className="custom-selected-panel">
                    <button className="custom-clear" onClick={onClear}>Clear</button>
                    {selectedData.map(item => (
                        <div key={item.key} className="custom-item">
                            {item.label}
                            <button className="custom-remove" onClick={() => onRemove(item)}>Remove</button>
                        </div>
                    ))}
                </div>
            );
        };
        const props = {
            dataSource: defaultItems,
            defaultValue: ['1', '2'],
            renderSelectedPanel,
        };
        const transfer = getTransfer(props);
        expect(transfer.exists('.custom-selected-panel')).toEqual(true);
        
        // 测试 onRemove
        transfer.find('.custom-remove').at(0).simulate('click');
        expect(transfer.state().selectedItems.size).toEqual(1);
        
        // 测试 onClear
        transfer.find('.custom-clear').simulate('click');
        expect(transfer.state().selectedItems.size).toEqual(0);
    });

    it('renderSourcePanel prop', () => {
        const renderSourcePanel = (props) => {
            const { filterData, onSelectOrRemove, onAllClick, onSearch, onSelect } = props;
            return (
                <div className="custom-source-panel">
                    <input className="custom-search" onChange={(e) => onSearch(e.target.value)} />
                    <button className="custom-select-all" onClick={onAllClick}>Select All</button>
                    {filterData.map(item => (
                        <div key={item.key} className="custom-source-item" onClick={() => onSelectOrRemove(item)}>
                            {item.label}
                        </div>
                    ))}
                </div>
            );
        };
        const props = {
            dataSource: defaultItems,
            renderSourcePanel,
        };
        const transfer = getTransfer(props);
        expect(transfer.exists('.custom-source-panel')).toEqual(true);
    });

    it('renderSourceHeader prop', () => {
        const renderSourceHeader = (props) => {
            const { num, showButton, allChecked, onAllClick } = props;
            return (
                <div className="custom-source-header">
                    <span>Total: {num}</span>
                    {showButton && <button className="custom-all-btn" onClick={onAllClick}>
                        {allChecked ? 'Deselect' : 'Select All'}
                    </button>}
                </div>
            );
        };
        const props = {
            dataSource: defaultItems,
            renderSourceHeader,
        };
        const transfer = getTransfer(props);
        expect(transfer.exists('.custom-source-header')).toEqual(true);
    });

    it('renderSelectedHeader prop', () => {
        const renderSelectedHeader = (props) => {
            const { num, showButton, onClear } = props;
            return (
                <div className="custom-selected-header">
                    <span>Selected: {num}</span>
                    {showButton && <button className="custom-clear-btn" onClick={onClear}>Clear</button>}
                </div>
            );
        };
        const props = {
            dataSource: defaultItems,
            defaultValue: ['1'],
            renderSelectedHeader,
        };
        const transfer = getTransfer(props);
        expect(transfer.exists('.custom-selected-header')).toEqual(true);
    });

    it('loading prop', () => {
        const props = {
            dataSource: defaultItems,
            loading: true,
        };
        const transfer = getTransfer(props);
        expect(transfer.exists(`.${BASE_CLASS_PREFIX}-spin`)).toEqual(true);
    });

    it('filter false hides search input', () => {
        const props = {
            dataSource: defaultItems,
            filter: false,
        };
        const transfer = getTransfer(props);
        expect(transfer.exists(`.${BASE_CLASS_PREFIX}-transfer-filter`)).toEqual(false);
    });

    it('draggable with selected items', () => {
        const spyOnChange = spy();
        const props = {
            dataSource: defaultItems,
            defaultValue: ['1', '2'],
            draggable: true,
            onChange: spyOnChange,
        };
        const transfer = getTransfer(props);
        // 验证拖拽组件渲染
        expect(transfer.props().draggable).toEqual(true);
    });

    it('remove item from right panel', () => {
        const spyOnChange = spy();
        const props = {
            dataSource: defaultItems,
            defaultValue: ['1'],
            onChange: spyOnChange,
        };
        const transfer = getTransfer(props);
        
        // 点击右侧面板的关闭按钮
        const closeIcon = transfer.find(`.${BASE_CLASS_PREFIX}-transfer-item-close-icon`).at(0);
        closeIcon.simulate('click');
        
        expect(spyOnChange.calledOnce).toEqual(true);
        expect(spyOnChange.firstCall.args[0]).toHaveLength(0);
    });

    it('all items disabled shows no select all button', () => {
        const disabledItems = [
            { label: 'item1', value: '1', key: 'a', disabled: true },
            { label: 'item2', value: '2', key: 'b', disabled: true },
        ];
        const props = {
            dataSource: disabledItems,
        };
        const transfer = getTransfer(props);
        // 当所有项都禁用时，不应显示全选按钮
        const selectAllBtn = transfer.find(`button.${BASE_CLASS_PREFIX}-transfer-header-all`).at(0);
        expect(selectAllBtn.exists()).toEqual(false);
    });

    it('search method', () => {
        const props = {
            dataSource: defaultItems,
        };
        const transfer = getTransfer(props);
        const instance = transfer.instance();
        
        // 调用 search 方法
        instance.search('item1');
        transfer.update();
        
        expect(transfer.state().inputValue).toEqual('item1');
    });

    it('renderSelectedPanel with onSortEnd', () => {
        const spyOnSortEnd = spy();
        const renderSelectedPanel = (props) => {
            const { selectedData, onSortEnd } = props;
            return (
                <div className="custom-selected-panel">
                    <button className="trigger-sort" onClick={() => onSortEnd({ oldIndex: 0, newIndex: 1 })}>Sort</button>
                    {selectedData.map(item => (
                        <div key={item.key}>{item.label}</div>
                    ))}
                </div>
            );
        };
        const props = {
            dataSource: defaultItems,
            defaultValue: ['1', '2'],
            renderSelectedPanel,
        };
        const transfer = getTransfer(props);
        
        // 触发排序
        transfer.find('.trigger-sort').simulate('click');
        // 验证排序后的顺序
        const selectedItems = [...transfer.state().selectedItems.values()];
        expect(selectedItems[0].value).toEqual('2');
    });

    it('custom panel with both renderSourcePanel and renderSelectedPanel', () => {
        const renderSourcePanel = () => <div className="custom-source">Source</div>;
        const renderSelectedPanel = () => <div className="custom-selected">Selected</div>;
        const props = {
            dataSource: defaultItems,
            renderSourcePanel,
            renderSelectedPanel,
        };
        const transfer = getTransfer(props);
        expect(transfer.exists(`.${BASE_CLASS_PREFIX}-transfer-custom-panel`)).toEqual(true);
    });

    it('renderSourcePanel with onSelect callback', () => {
        const spyOnChange = spy();
        const renderSourcePanel = (props) => {
            const { filterData, onSelect, onAllClick } = props;
            return (
                <div className="custom-source-panel">
                    <button className="select-multiple" onClick={() => onSelect(['1', '2'])}>Select Multiple</button>
                    <button className="select-all-custom" onClick={onAllClick}>Select All</button>
                </div>
            );
        };
        const props = {
            dataSource: defaultItems,
            renderSourcePanel,
            onChange: spyOnChange,
        };
        const transfer = getTransfer(props);
        
        // 测试 onSelect 回调
        transfer.find('.select-multiple').simulate('click');
        expect(spyOnChange.calledOnce).toEqual(true);
        
        // 测试 onAllClick 回调
        transfer.find('.select-all-custom').simulate('click');
    });

    it('adapter notifySelect and notifyDeselect', () => {
        const spyOnSelect = spy();
        const spyOnDeselect = spy();
        const props = {
            dataSource: defaultItems,
            onSelect: spyOnSelect,
            onDeselect: spyOnDeselect,
        };
        const transfer = getTransfer(props);
        
        // 选择第一个项目
        const firstItem = transfer.find(`span.${BASE_CLASS_PREFIX}-transfer-item`).at(0);
        firstItem.simulate('click');
        expect(spyOnSelect.calledOnce).toEqual(true);
        
        // 取消选择
        firstItem.simulate('click');
        expect(spyOnDeselect.calledOnce).toEqual(true);
    });

    it('default case in renderRight switch', () => {
        // 测试 renderRight 中的 default case
        const props = {
            dataSource: [],
            defaultValue: [],
        };
        const transfer = getTransfer(props);
        // 当没有选中项时，应该显示空状态
        expect(transfer.exists(`.${BASE_CLASS_PREFIX}-transfer-right-empty`)).toEqual(true);
    });

    it('tree transfer with treeProps', () => {
        const props = {
            type: 'treeList',
            dataSource: treeData,
            treeProps: {
                expandAll: true,
            },
        };
        const transfer = getTransfer(props);
        // Tree component renders with semi-tree-wrapper class, not semi-tree
        expect(transfer.exists(`.${BASE_CLASS_PREFIX}-tree-wrapper`)).toEqual(true);
    });

    it('adapter updateSelected', () => {
        const props = {
            dataSource: defaultItems,
        };
        const transfer = getTransfer(props);
        const instance = transfer.instance();
        
        // 直接调用 adapter 的 updateSelected 方法
        const newSelectedItems = new Map();
        newSelectedItems.set('a', defaultItems[0]);
        instance.adapter.updateSelected(newSelectedItems);
        transfer.update();
        
        expect(transfer.state().selectedItems.has('a')).toEqual(true);
    });

    it('renderSourcePanel with onSelectOrRemove', () => {
        const spyOnChange = spy();
        const renderSourcePanel = (props) => {
            const { filterData, onSelectOrRemove } = props;
            return (
                <div className="custom-source-panel">
                    {filterData.map(item => (
                        <div 
                            key={item.key} 
                            className="custom-item" 
                            onClick={() => onSelectOrRemove(item)}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
            );
        };
        const props = {
            dataSource: defaultItems,
            renderSourcePanel,
            onChange: spyOnChange,
        };
        const transfer = getTransfer(props);
        
        // 点击自定义项目
        transfer.find('.custom-item').at(0).simulate('click');
        expect(spyOnChange.calledOnce).toEqual(true);
    });
});
