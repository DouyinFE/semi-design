import React, { useState, useRef } from 'react';
import { storiesOf } from '@storybook/react';
// import { Input, Transfer, Button, Icon, Avatar, Checkbox } from '../index';
// import Transfer from '../index';
import { Transfer, Button } from '../../index';
// import Input from '../../input';
import Table from '../../table';
import Avatar from '../../avatar';
import Checkbox from '../../checkbox';
import Icon from '../../icons';
import Tree from '../../tree';
import Input from '../../input';
import { omit, values } from 'lodash';
import './transfer.scss';
import { SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';
import {IconClose, IconSearch, IconHandle} from '@douyinfe/semi-icons';

const stories = storiesOf('Transfer', module);

const commonProps = {
    onSelect: (...args) => {
        console.log('onSelect');
        console.log(...args);
    },
    onChange: (...args) => {
        console.log('onChange');
        console.log(...args);
    },
    onDeselect: (...args) => {
        console.log('onDeselect');
        console.log(...args);
    },
    onSearch: (...args) => {
        console.log('onSearch');
        console.log(...args);
    },
};

const data = Array.from({ length: 100 }, (v, i) => {
    return {
        label: `选项名称${i}`,
        value: i,
        disabled: false,
        key: i,
    };
});

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
                        label: 'ShanghaionChangeonChangeonChange',
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

const dataWithGroup = [
    {
        title: '类别A',
        children: [
            { label: '选项名称1', value: 1, disabled: false, key: 1 },
            { label: '选项名称2', value: 2, disabled: false, key: 2 },
            { label: '选项名称3', value: 3, disabled: false, key: 3 },
        ],
    },
    {
        title: '类别B',
        children: [
            { label: '选项名称1', value: 4, disabled: true, key: 4 },
            { label: '选项名称2', value: 5, disabled: false, key: 5 },
            { label: '选项名称3', value: 6, disabled: false, key: 6 },
        ],
    },
    {
        title: '类别C',
        children: [
            { label: '选项名称1', value: 7, disabled: false, key: 7 },
            { label: '选项名称2', value: 8, disabled: false, key: 8 },
            { label: '选项名称3', value: 9, disabled: false, key: 9 },
            { label: '选项名称3', value: 10, disabled: false, key: 10 },
            { label: '选项名称3', value: 11, disabled: false, key: 11 },
            { label: '选项名称3', value: 12, disabled: false, key: 12 },
            { label: '选项名称3', value: 13, disabled: false, key: 13 },
        ],
    },
];

const DefaultTransfer = () => {
    const [dataSource, setDataSource] = useState([]);
    const [treeDataSource, setTreeDataSource] = useState([]);
    return (
        <div style={{ margin: 10, padding: 10, width: 600 }}>
            <Button onClick={() => setDataSource(data)}>更改列表数据源</Button>
            <Transfer {...commonProps} dataSource={dataSource} defaultValue={[]} />
            <Button onClick={() => setTreeDataSource(treeData)}>更改树数据源</Button>
            <Transfer type="treeList" dataSource={treeDataSource}></Transfer>
        </div>
    );
};

stories.add('Transfer', DefaultTransfer);

stories.add('Transfer draggable', () => (
    <div style={{ margin: 10, padding: 10, width: 600 }}>
        <Transfer {...commonProps} dataSource={data} defaultValue={[2, 4]} draggable />
    </div>
));

const ControledTransfer = () => {
    const [value, setValue] = useState([2, 3]);

    const handleChange = value => {
        setValue(value);
    };

    return (
        <div style={{ margin: 10, padding: 10, width: 600 }}>
            <Transfer {...commonProps} dataSource={data} value={value} onChange={handleChange} />
        </div>
    );
};

stories.add('受控Transfer', () => <ControledTransfer />);

stories.add('loading', () => <Transfer loading />);

stories.add('分组Transfer', () => (
    <div style={{ margin: 10, padding: 10, width: 600 }}>
        <Transfer {...commonProps} dataSource={dataWithGroup} type="groupList" />

        <Transfer {...commonProps} dataSource={dataWithGroup} defaultValue={[2, 4]} type="groupList" />
    </div>
));

const customFilter = (sugInput, item) => {
    return item.value.includes(sugInput) || item.label.includes(sugInput);
};

stories.add('custom filter, renderSourceItem, renderSelectedItem', () => {
    const data = [
        { label: '夏可漫', value: 'xiakeman@example.com', abbr: '夏', color: 'amber', area: 'US', key: 1 },
        { label: '申悦', value: 'shenyue@example.com', abbr: '申', color: 'indigo', area: 'UK', key: 2 },
        { label: '文嘉茂', value: 'wenjiamao@example.com', abbr: '文', color: 'cyan', area: 'HK', key: 3 },
        { label: '曲晨一', value: 'quchenyi@example.com', abbr: '一', color: 'blue', area: 'India', key: 4 },
        { label: '曲晨二', value: 'quchener@example.com', abbr: '二', color: 'blue', area: 'India', key: 5 },
        { label: '曲晨三', value: 'quchensan@example.com', abbr: '三', color: 'blue', area: 'India', key: 6 },
    ];

    const renderSourceItem = item => {
        return (
            <div className="components-transfer-demo-source-item">
                <Checkbox
                    onChange={() => {
                        item.onChange();
                    }}
                    key={item.label}
                    checked={item.checked}
                    style={{ paddingLeft: 12, height: 52 }}
                >
                    <Avatar color={item.color} size="small">
                        {item.abbr}
                    </Avatar>
                    <div className="info">
                        <div className="name">{item.label}</div>
                        <div className="email">{item.value}</div>
                    </div>
                </Checkbox>
            </div>
        );
    };
    const renderSelectedItem = item => {
        return (
            <div className="components-transfer-demo-selected-item" key={item.label}>
                <Avatar color={item.color} size="small">
                    {item.abbr}
                </Avatar>
                <div className="info">
                    <div className="name">{item.label}</div>
                    <div className="email">{item.value}</div>
                </div>
                <IconClose onClick={item.onRemove} />
            </div>
        );
    };
    return (
        <div style={{ margin: 10, padding: 10, width: 600 }}>
            <Transfer
                {...commonProps}
                dataSource={data}
                filter={customFilter}
                defaultValue={['xiakeman@example.com']}
                renderSelectedItem={renderSelectedItem}
                renderSourceItem={renderSourceItem}
                inputProps={{ placeholder: '可通过邮箱或者姓名搜索' }}
            />
        </div>
    );
});

const TreeTransferDemo = () => {
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
                            label: 'ShanghaionChangeonChangeonChange',
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
    const [value, $value] = useState(['Shanghai']);

    const onSearch = v => {
        console.log(v);
    };
    const onChange = v => {
        console.log(v);
        $value(v);
    };

    const flatTreeData = dataSource => {
        let newData = [];
        let stack = [...dataSource].reverse();
        while (stack.length) {
            const current = stack.pop();
            if (current.children && Array.isArray(current.children)) {
                const nodes = current.children;
                for (let i = nodes.length - 1; i >= 0; i--) {
                    const child = { ...nodes[i] };
                    stack.push(child);
                }
            } else {
                current.isLeaf = true;
            }
            newData.push(omit(current, ['children']));
        }
        return newData;
    };

    const flatNodes = flatTreeData(treeData);

    const renderSourcePanel = ({ value, onSelect }) => {
        return (
            <section style={{ width: '50%' }}>
                <Tree
                    defaultExpandAll
                    multiple
                    treeData={treeData}
                    disableStrictly
                    value={value}
                    onChange={onSelect}
                ></Tree>
            </section>
        );
    };

    return (
        <div style={{ margin: 10, padding: 10, width: 600 }}>
            <Transfer
                type="treeList"
                draggable
                dataSource={treeData}
                value={value}
                onChange={onChange}
                onSearch={onSearch}
            ></Transfer>
            <Transfer
                type="treeList"
                draggable
                dataSource={treeData}
                value={value}
                renderSourcePanel={renderSourcePanel}
                onChange={onChange}
                onSearch={onSearch}
            ></Transfer>
        </div>
    );
};

stories.add('tree transfer', () => <TreeTransferDemo />);

class CustomRenderDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: Array.from({ length: 100 }, (v, i) => ({
                label: `海底捞门店 ${i}`,
                value: i,
                disabled: false,
                key: i,
            })),
        };
        this.renderSourcePanel = this.renderSourcePanel.bind(this);
        this.renderSelectedPanel = this.renderSelectedPanel.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    renderItem(type, item, onItemAction, selectedItems) {
        let buttonText = '删除';
        if (type === 'source') {
            let checked = selectedItems.has(item.key);
            buttonText = checked ? '删除' : '添加';
        }
        return (
            <div className="semi-transfer-item panel-item" key={item.label}>
                <p>{item.label}</p>
                <Button
                    theme="borderless"
                    type="primary"
                    onClick={() => onItemAction(item)}
                    className="panel-item-remove"
                    size="small"
                >
                    {buttonText}
                </Button>
            </div>
        );
    }

    renderSourcePanel(props) {
        const {
            loading,
            noMatch,
            filterData,
            selectedItems,
            allChecked,
            onAllClick,
            inputValue,
            onSearch,
            onSelectOrRemove,
        } = props;
        let content;
        switch (true) {
            case loading:
                content = <Spin loading />;
                break;
            case noMatch:
                content = <div className="empty sp-font">{inputValue ? '无搜索结果' : '暂无内容'}</div>;
                break;
            case !noMatch:
                content = filterData.map(item => this.renderItem('source', item, onSelectOrRemove, selectedItems));
                break;
            default:
                content = null;
                break;
        }
        return (
            <section className="source-panel">
                <div className="panel-header sp-font">门店列表</div>
                <div className="panel-main">
                    <Input
                        style={{ width: 454, margin: '12px 14px' }}
                        prefix={<IconSearch />}
                        onChange={onSearch}
                        showClear
                    />
                    <div className="panel-controls sp-font">
                        <span>待选门店: {filterData.length}</span>
                        <Button onClick={onAllClick} theme="borderless" size="small">
                            {allChecked ? '取消全选' : '全选'}
                        </Button>
                    </div>
                    <div className="panel-list">{content}</div>
                </div>
            </section>
        );
    }

    renderSelectedPanel(props) {
        const { selectedData, onClear, clearText, onRemove } = props;

        let mainContent = selectedData.map(item => this.renderItem('selected', item, onRemove));

        if (!selectedData.length) {
            mainContent = <div className="empty sp-font">暂无数据，请从左侧筛选</div>;
        }

        return (
            <section className="selected-panel">
                <div className="panel-header sp-font">
                    <div>已选同步门店: {selectedData.length}</div>
                    <Button theme="borderless" type="primary" onClick={onClear} size="small">
                        {clearText || '清空 '}
                    </Button>
                </div>
                <div className="panel-main">{mainContent}</div>
            </section>
        );
    }

    render() {
        const { dataSource } = this.state;
        return (
            <Transfer
                onChange={values => console.log(values)}
                className="component-transfer-demo-custom-panel"
                renderSourcePanel={this.renderSourcePanel}
                renderSelectedPanel={this.renderSelectedPanel}
                dataSource={dataSource}
            />
        );
    }
}

stories.add('customRender', () => <CustomRenderDemo />);

class CustomRenderDragDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: Array.from({ length: 100 }, (v, i) => ({
                label: `海底捞门店 ${i}`,
                value: i,
                disabled: false,
                key: i,
            })),
        };
        this.renderSourcePanel = this.renderSourcePanel.bind(this);
        this.renderSelectedPanel = this.renderSelectedPanel.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    renderItem(type, item, onItemAction, selectedItems) {
        let buttonText = '删除';
        let newItem = item;

        if (type === 'source') {
            let checked = selectedItems.has(item.key);
            buttonText = checked ? '删除' : '添加';
        } else {
            // delete newItem._optionKey;
            newItem = { ...item, key: item._optionKey };
            delete newItem._optionKey;
        }

        const DragHandle = sortableHandle(() => <IconHandle className="pane-item-drag-handler" />);

        return (
            <div className="semi-transfer-item panel-item" key={item.label}>
                {type === 'source' ? null : <DragHandle />}
                <div className="panel-item-main" style={{ flexGrow: 1 }}>
                    <p>{item.label}</p>
                    <Button
                        theme="borderless"
                        type="primary"
                        onClick={() => onItemAction(newItem)}
                        className="panel-item-remove"
                        size="small"
                    >
                        {buttonText}
                    </Button>
                </div>
            </div>
        );
    }

    renderSourcePanel(props) {
        const {
            loading,
            noMatch,
            filterData,
            selectedItems,
            allChecked,
            onAllClick,
            inputValue,
            onSearch,
            onSelectOrRemove,
        } = props;
        let content;
        switch (true) {
            case loading:
                content = <Spin loading />;
                break;
            case noMatch:
                content = <div className="empty sp-font">{inputValue ? '无搜索结果' : '暂无内容'}</div>;
                break;
            case !noMatch:
                content = filterData.map(item => this.renderItem('source', item, onSelectOrRemove, selectedItems));
                break;
            default:
                content = null;
                break;
        }
        return (
            <section className="source-panel">
                <div className="panel-header sp-font">门店列表</div>
                <div className="panel-main">
                    <Input
                        style={{ width: 454, margin: '12px 14px' }}
                        prefix={<IconSearch />}
                        onChange={onSearch}
                        showClear
                    />
                    <div className="panel-controls sp-font">
                        <span>待选门店: {filterData.length}</span>
                        <Button onClick={onAllClick} theme="borderless" size="small">
                            {allChecked ? '取消全选' : '全选'}
                        </Button>
                    </div>
                    <div className="panel-list">{content}</div>
                </div>
            </section>
        );
    }

    renderSelectedPanel(props) {
        const { selectedData, onClear, clearText, onRemove, onSortEnd } = props;

        let mainContent = null;

        if (!selectedData.length) {
            mainContent = <div className="empty sp-font">暂无数据，请从左侧筛选</div>;
        }

        const SortableItem = SortableElement(item => this.renderItem('selected', item, onRemove));
        const SortableList = SortableContainer(
            ({ items }) => {
                return (
                    <div className="panel-main">
                        {items.map((item, index) => (
                            // sortableElement will take over the property 'key', so use another '_optionKey' to pass
                            // otherwise you can't get `key` property in this.renderItem
                            <SortableItem key={item.label} index={index} {...item} _optionKey={item.key}></SortableItem>
                        ))}
                    </div>
                );
            },
            { distance: 10 }
        );

        mainContent = <SortableList useDragHandle onSortEnd={onSortEnd} items={selectedData}></SortableList>;

        return (
            <section className="selected-panel">
                <div className="panel-header sp-font">
                    <div>已选同步门店: {selectedData.length}</div>
                    <Button theme="borderless" type="primary" onClick={onClear} size="small">
                        {clearText || '清空 '}
                    </Button>
                </div>
                {mainContent}
            </section>
        );
    }

    render() {
        const { dataSource } = this.state;
        return (
            <Transfer
                defaultValue={[2, 4]}
                onChange={values => console.log(values)}
                className="component-transfer-demo-custom-panel"
                renderSourcePanel={this.renderSourcePanel}
                renderSelectedPanel={this.renderSelectedPanel}
                dataSource={dataSource}
            />
        );
    }
}

stories.add('customRender with drag sort', () => <CustomRenderDragDemo />);
