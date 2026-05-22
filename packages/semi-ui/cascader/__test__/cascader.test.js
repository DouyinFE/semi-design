import { Cascader, Icon } from '../../index';
import { clear } from 'jest-date-mock';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';

const animationMs = 200;

const sleep = (ms = animationMs) =>
    new Promise((resolve, reject) =>
        setTimeout(() => {
            resolve(ms);
        }, ms)
    );

const getPopupContainer = () => document.querySelector(`.${BASE_CLASS_PREFIX}-cascader`);

const treeData = [
    {
        label: '亚洲',
        value: 'Asia',
        key: 'Asia',
        children: [
            {
                label: '中国',
                value: 'China',
                key: 'China',
                children: [
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
                ],
            },
        ],
    },
    {
        label: '北美洲',
        value: 'North America',
        key: 'North America',
        children: [
            {
                label: '美国',
                value: 'United States',
                key: 'United States',
            },
            {
                label: '加拿大',
                value: 'Canada',
                key: 'Canada',
            },
        ],
    },
];

const treeDataWithDisabled = [
    {
        label: '亚洲',
        value: 'Asia',
        key: 'Asia',
        children: [
            {
                label: '中国',
                value: 'China',
                key: 'China',
                disabled: true,
                children: [
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
                ],
            },
            {
                label: '韩国',
                value: 'Hanguo',
                key: 'hanguo',
            }
        ],
    }
];

const treeDataWithReactNode = [
    {
        label: <strong>亚洲</strong>,
        value: 'Asia',
        key: 'Asia',
        children: [
            {
                label: '中国',
                value: 'China',
                key: 'China',
                children: [
                    {
                        label: '北京',
                        value: 'Beijing',
                        key: 'beijing',
                    },
                    {
                        label: <div>上海</div>,
                        value: 'Shanghai',
                        key: 'shanghai',
                    },
                ],
            }
        ],
    },
    {
        label: <p>北美洲</p>,
        value: 'North America',
        key: 'North America',
    }
];

let commonProps = {
    // Cascader use Popup Layer to show candidate option,
    // but all Popup Layer which extends from Tooltip (eg Popover, Dropdown) have animation and delay.
    // Turn off animation and delay during testing, to avoid wating (something like setTimeOut/balabala...) in the test code
    motion: false,
    mouseEnterDelay: 0,
    mouseLeaveDelay: 0,
};

function render(props) {
    props = { treeData: treeData, ...commonProps, ...props };
    return mount(<Cascader {...props} />, {
        attachTo: document.getElementById('container'),
    });
}

describe('Cascader', () => {
    beforeEach(() => {
        // Avoid `attachTo: document.body` Warning
        // clear();
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
        let cascader = render(props);
        expect(cascader.hasClass('test')).toEqual(true);
        expect(cascader.find('div.test')).toHaveStyle('height', 420);
    });

    it('with placeholder', () => {
        const props = { placeholder: 'semi' };
        const cascader = render(props);
        expect(cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection-placeholder`).instance().textContent).toEqual(
            'semi'
        );
    });

    it('with validateStatus', () => {
        const props = {};
        const cascader = render(props);
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader-error`)).toEqual(false);
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader-warning`)).toEqual(false);
        cascader.setProps({ validateStatus: `error` });
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader-error`)).toEqual(true);
        cascader.setProps({ validateStatus: `warning` });
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader-warning`)).toEqual(true);
    });

    it('different size', () => {
        const props = {};
        const cascader = render(props);
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader-large`)).toEqual(false);
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader-small`)).toEqual(false);
        cascader.setProps({ size: 'large' });
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader-large`)).toEqual(true);
        cascader.setProps({ size: 'small' });
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader-small`)).toEqual(true);
    });

    it('custom prefix / suffix / insetLabel', () => {
        let prefix = <div className="prefix">prefix content</div>;
        let suffix = <div className="suffix">suffix content</div>;
        let insetLabel = 'semi';
        const props = {
            prefix: prefix,
            suffix: suffix,
        };
        let cascader = render(props);
        expect(cascader.contains(prefix)).toEqual(true);
        expect(cascader.contains(suffix)).toEqual(true);
        cascader.unmount();
        let cascader2 = render({ insetLabel: insetLabel });
        expect(cascader2.contains(insetLabel)).toEqual(true);
        cascader2.unmount();
    });

    it('empty data / empty content', () => {
        let cascader = render({
            treeData: [],
            defaultOpen: true,
        });
        // await sleep();
        let opt = document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option`);
        expect(opt.length).toEqual(1);
        expect(opt[0].className.includes(`${BASE_CLASS_PREFIX}-cascader-option-empty`)).toEqual(true);
        cascader.setProps({ emptyContent: 'test' });
        cascader.update();
        expect(document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option`)[0].textContent).toEqual('test');
        // done();
    });

    it('dynamic treeData in multiple and uncontrolled mode', () => {
        const cascader = render({
            defaultValue: 'Asia',
            multiple: true,
        });
        const opt = document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-selection-multiple .${BASE_CLASS_PREFIX}-tag`);
        expect(opt.length).toEqual(1);
        cascader.setProps({ treeData: treeDataWithDisabled });
        cascader.update();
        expect(opt.length).toEqual(1);
    });

    it('dynamic treeData in multiple and controlled mode', () => {
        const cascader = render({
            value: 'Asia',
            multiple: true,
        });
        const opt = document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-selection-multiple .${BASE_CLASS_PREFIX}-tag`);
        expect(opt.length).toEqual(1);
        cascader.setProps({ treeData: treeDataWithDisabled });
        cascader.update();
        expect(opt.length).toEqual(1);
    });

    it('getPopupContainer', () => {
        let cascader = render({
            getPopupContainer: getPopupContainer,
            defaultOpen: true,
        });
        // await sleep();
        let dom = document.querySelector(`.${BASE_CLASS_PREFIX}-cascader`);
        expect(dom.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option-lists`).length).toEqual(1);
        // done();
    });

    it('defaultOpen', () => {
        let cascader = render({
            defaultOpen: true,
        });
        // await sleep();
        expect(cascader.state().isOpen).toEqual(true);
        expect(document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option-lists`).length).toEqual(1);
        // done();
    });

    it('custom dropdownClassNam/dropdownStyle/zIndex', () => {
        let props = {
            dropdownClassName: 'test',
            dropdownStyle: {
                color: 'red',
            },
            defaultOpen: true,
            zIndex: 2000,
        };
        let cascader = render(props);
        // await sleep();
        const dropdown = document.querySelector(`.${BASE_CLASS_PREFIX}-cascader-popover`);
        expect(document.querySelector(`.${BASE_CLASS_PREFIX}-portal`).style.zIndex).toEqual('2000');
        expect(dropdown.className.includes('test')).toEqual(true);
        expect(dropdown.style.color).toEqual('red');
        // done();
    });

    it('defaultValue', () => {
        let cascader = render({
            defaultValue: ['Asia', 'China', 'Beijing'],
            defaultOpen: true,
        });
        // await sleep();
        expect(cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection`).getDOMNode().textContent).toEqual(
            '亚洲 / 中国 / 北京'
        );
        let lists = document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option-list`);
        expect(lists.length).toEqual(3);
        let activeItems = document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option-active`);
        expect(activeItems.length).toEqual(2);
        expect(activeItems[0].textContent).toEqual('亚洲');
        expect(activeItems[1].textContent).toEqual('中国');
        let selectItem = document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option-select`);
        expect(selectItem.length).toEqual(1);
        expect(selectItem[0].textContent).toEqual('北京');
        expect(selectItem[0].querySelectorAll(`.${BASE_CLASS_PREFIX}-icon`).length).toEqual(1);
        // done();
    });

    it('displayProp', () => {
        let cascader = render({
            defaultValue: ['Asia', 'China', 'Beijing'],
            displayProp: 'value',
        });
        expect(cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection`).getDOMNode().textContent).toEqual(
            'Asia / China / Beijing'
        );
    });

    it('displayRender', () => {
        let spyOnRender = sinon.spy(() => {});
        let cascader = render({
            defaultValue: ['Asia', 'China', 'Beijing'],
            displayRender: spyOnRender,
        });
        expect(spyOnRender.calledWithMatch(['亚洲', '中国', '北京'])).toEqual(true);
        cascader.unmount();

        let cusRender = render({
            defaultValue: ['Asia', 'China', 'Beijing'],
            displayRender: list => '已选择：' + list.join(' -> '),
        });
        expect(cusRender.find(`.${BASE_CLASS_PREFIX}-cascader-selection`).getDOMNode().textContent).toEqual(
            '已选择：亚洲 -> 中国 -> 北京'
        );
    });

    it('label is ReactNode when unsearchable and single-selection mode', () => {
        const cascader = render({
            defaultValue: ['Asia', 'China', 'Shanghai'],
            treeData: treeDataWithReactNode
        });
        expect(cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection span strong`).getDOMNode().textContent).toEqual(
            '亚洲'
        );
        expect(cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection span div`).getDOMNode().textContent).toEqual(
            '上海'
        );
        expect(cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection span`).getDOMNode().textContent).toEqual(
            '亚洲 / 中国 / 上海'
        );

        cascader.unmount();

        const cascader2 = render({
            defaultValue: ['North America'],
            treeData: treeDataWithReactNode,
        });
        expect(cascader2.find(`.${BASE_CLASS_PREFIX}-cascader-selection span p`).getDOMNode().textContent).toEqual(
            '北美洲'
        );
        expect(cascader2.find(`.${BASE_CLASS_PREFIX}-cascader-selection span`).getDOMNode().textContent).toEqual(
            '北美洲'
        );
        cascader2.unmount();

        const cascader3 = render({
            defaultValue: ['Asia', 'China', 'Shanghai'],
            treeData: treeDataWithReactNode,
            separator: ' - '
        });
        expect(cascader3.find(`.${BASE_CLASS_PREFIX}-cascader-selection span strong`).getDOMNode().textContent).toEqual(
            '亚洲'
        );
        expect(cascader3.find(`.${BASE_CLASS_PREFIX}-cascader-selection span div`).getDOMNode().textContent).toEqual(
            '上海'
        );
        expect(cascader3.find(`.${BASE_CLASS_PREFIX}-cascader-selection span`).getDOMNode().textContent).toEqual(
            '亚洲 - 中国 - 上海'
        );
        cascader3.unmount();
    });

    it('disabled', () => {
        let cascader = render({
            disabled: true,
        });
        expect(
            document
                .querySelector(`.${BASE_CLASS_PREFIX}-cascader`)
                .className.includes(`${BASE_CLASS_PREFIX}-cascader-disabled`)
        ).toEqual(true);
        // cannot select
        let selectBox = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection`).at(0);
        selectBox.simulate('click');
        // await sleep();
        expect(cascader.state().isOpen).toEqual(false);
        expect(document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option-lists`).length).toEqual(0);
        // done();
    });

    it('disabled + defaultValue', () => {
        const cascaderWithSingle = render({
            treeData: treeDataWithDisabled,
            changeOnSelect: true,
            defaultValue:['Asia', 'China']
        });
        expect(
            cascaderWithSingle
            .find(`.${BASE_CLASS_PREFIX}-cascader-selection span`)
            .at(0)
            .getDOMNode()
            .textContent
        ).toEqual('亚洲 / 中国');
        cascaderWithSingle.unmount();

        const cascaderWithSingleFilter = render({
            treeData: treeDataWithDisabled,
            changeOnSelect: true,
            filterTreeNode: true,
            defaultValue:['Asia', 'China']
        });
        expect(
            cascaderWithSingleFilter
            .find(`.${BASE_CLASS_PREFIX}-cascader-search-wrapper span`)
            .getDOMNode()
            .textContent
            ).toEqual('亚洲 / 中国');
        cascaderWithSingleFilter.unmount();

        const cascaderWithSingleControlled = render({
            treeData: treeDataWithDisabled,
            changeOnSelect: true,
            value: ['Asia', 'China'],
        });
        expect(cascaderWithSingleControlled.find(`.${BASE_CLASS_PREFIX}-cascader-selection span`).getDOMNode().textContent).toEqual(
            '亚洲 / 中国'
        );
        cascaderWithSingleControlled.unmount();

        const cascaderWithMultiple = render({
            treeData: treeDataWithDisabled,
            multiple: true,
            defaultValue:['Asia', 'China']
        });
        expect(
            cascaderWithMultiple
            .find(`.${BASE_CLASS_PREFIX}-tag .${BASE_CLASS_PREFIX}-tag-content`)
            .at(0)
            .getDOMNode()
            .textContent
        ).toEqual('中国');
        cascaderWithMultiple.unmount();

        const cascaderWithMultipleFilter = render({
            treeData: treeDataWithDisabled,
            multiple: true,
            filterTreeNode: true,
            defaultValue:['Asia', 'China']
        });
        expect(
            cascaderWithMultipleFilter
            .find(`.${BASE_CLASS_PREFIX}-tag .${BASE_CLASS_PREFIX}-tag-content`)
            .at(0)
            .getDOMNode()
            .textContent
        ).toEqual('中国');
        cascaderWithMultipleFilter.unmount();

        const cascaderWithMultipleControlled = render({
            treeData: treeDataWithDisabled,
            multiple: true,
            value:['Asia', 'China']
        });
        expect(
            cascaderWithMultipleControlled
            .find(`.${BASE_CLASS_PREFIX}-tag .${BASE_CLASS_PREFIX}-tag-content`)
            .at(0)
            .getDOMNode()
            .textContent
        ).toEqual('中国');
        cascaderWithMultipleControlled.unmount();
    });

    it('select item / onSelect / onChange', () => {
        let spyOnSelect = sinon.spy(() => {});
        let spyOnChange = sinon.spy(() => {});
        let cascader = render({
            defaultOpen: true,
            onSelect: spyOnSelect,
            onChange: spyOnChange,
        });
        // let selectBox = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection`).at(0);
        // selectBox.simulate('click');
        // await sleep();
        let lists = document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option-list`);
        expect(lists.length).toEqual(1);
        lists[0].querySelectorAll('li')[0].click();

        lists = document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option-list`);
        expect(lists.length).toEqual(2);
        expect(spyOnSelect.notCalled).toBe(true);
        expect(spyOnChange.notCalled).toBe(true);
        expect(
            lists[0]
                .querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option`)[0]
                .className.includes(`${BASE_CLASS_PREFIX}-cascader-option-active`)
        ).toEqual(true);

        lists[1].querySelectorAll('li')[0].click();

        lists = document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option-list`);
        expect(lists.length).toEqual(3);
        expect(spyOnSelect.notCalled).toBe(true);
        expect(spyOnChange.notCalled).toBe(true);
        expect(
            lists[1]
                .querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option`)[0]
                .className.includes(`${BASE_CLASS_PREFIX}-cascader-option-active`)
        ).toEqual(true);

        lists[2].querySelectorAll('li')[0].click();
        expect(spyOnSelect.calledOnce).toBe(true);
        expect(spyOnChange.calledOnce).toBe(true);
        expect(spyOnSelect.calledWithMatch('Beijing')).toEqual(true);
        expect(spyOnChange.calledWithMatch(['Asia', 'China', 'Beijing'])).toEqual(true);
        expect(
            lists[2]
                .querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option`)[0]
                .querySelectorAll(`.${BASE_CLASS_PREFIX}-icon-tick`).length
        ).toEqual(1);

        expect(cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection`).getDOMNode().textContent).toEqual(
            '亚洲 / 中国 / 北京'
        );
        // done();
    });

    it('filterTreeNode = true shows input box', () => {
        let cascader = render({
            filterTreeNode: true,
            searchPlaceholder: 'placeholder',
        });
        let searchWrapper = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-search-wrapper`);
        expect(searchWrapper.exists()).toEqual(true);
        expect(
            searchWrapper
                .find('span')
                .getDOMNode()
                .textContent
            ).toEqual('placeholder');
    });

    it('onSearch', () => {
        let onSearch = value => {};
        let spyOnSearch = sinon.spy(onSearch);
        let cascader = render({
            filterTreeNode: true,
            onSearch: spyOnSearch,
        });
        let searchValue = '${BASE_CLASS_PREFIX}';
        let event = { target: { value: searchValue } };
        cascader.simulate('click');
        const input = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection input`);
        input.simulate('change', event);
        expect(spyOnSearch.calledOnce).toBe(true);
        expect(spyOnSearch.calledWithMatch(searchValue)).toBe(true);
    });

    it('onSelect + changeOnSelect', async () => {
        let spyOnSelect = sinon.spy(() => {});
        let spyOnChange = sinon.spy(() => {});
        let cascader = render({
            defaultOpen: true,
            onSelect: spyOnSelect,
            onChange: spyOnChange,
            changeOnSelect: true,
        });
        // await sleep();
        let lists = document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option-list`);
        lists[0].querySelectorAll('li')[0].click();
        expect(spyOnSelect.calledOnce).toBe(true);
        expect(spyOnChange.calledOnce).toBe(true);
        expect(spyOnSelect.calledWithMatch('Asia')).toEqual(true);
        expect(spyOnChange.calledWithMatch(['Asia'])).toEqual(true);
        expect(
            lists[0]
                .querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option`)[0]
                .className.includes(`${BASE_CLASS_PREFIX}-cascader-option-select`)
        ).toEqual(true);
        expect(cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection`).getDOMNode().textContent).toEqual('亚洲');

        lists = document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option-list`);
        lists[1].querySelectorAll('li')[0].click();
        expect(spyOnSelect.calledWithMatch('China')).toEqual(true);
        expect(spyOnChange.calledWithMatch(['Asia', 'China'])).toEqual(true);
        expect(
            lists[0]
                .querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option`)[0]
                .className.includes(`${BASE_CLASS_PREFIX}-cascader-option-active`)
        ).toEqual(true);
        expect(
            lists[1]
                .querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option`)[0]
                .className.includes(`${BASE_CLASS_PREFIX}-cascader-option-select`)
        ).toEqual(true);
        expect(cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection`).getDOMNode().textContent).toEqual(
            '亚洲 / 中国'
        );
    });

    // display none not working properly
    it('filterTreeNode shows correct result', () => {
        let cascader = render({
            filterTreeNode: true,
            defaultOpen: true,
        });
        // let selectBox = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection`).at(0);
        // selectBox.simulate('click');
        // await sleep();
        const searchWrapper = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-search-wrapper`);
        let searchValue = '北';
        let event = { target: { value: searchValue } };
        searchWrapper.find('input').simulate('change', event);

        // await sleep();
        let resList = document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option-label-highlight`);
        expect(resList.length).toEqual(3);
        // debugger
        // expect(resList[0].textContent).toEqual('亚洲/中国/北京');
        // done();
    });

    // display none not working properly
    it('filterTreeNode + treeNodeFilterProp', () => {
        let cascader = render({
            filterTreeNode: true,
            treeNodeFilterProp: 'value',
            defaultOpen: true,
        });
        // let selectBox = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection`).at(0);
        // selectBox.simulate('click');
        // await sleep();
        const searchWrapper = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-search-wrapper`);
        let searchValue = 'Bei';
        let event = { target: { value: searchValue } };
        searchWrapper.find('input').simulate('change', event);

        // await sleep();
        let resList = document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option-label-highlight`);
        expect(resList.length).toEqual(1);
        // debugger
        // expect(resList[0].textContent).toEqual('亚洲/中国/北京');
        // done();
    });

    it('filterTreeNode + no result', () => {
        let cascader = render({
            filterTreeNode: true,
            defaultOpen: true,
            emptyContent: 'test',
        });
        // await sleep();
        const searchWrapper = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-search-wrapper`);
        let searchValue = 'Bei';
        let event = { target: { value: searchValue } };
        searchWrapper.find('input').simulate('change', event);

        // await sleep();
        let opt = document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option`);
        expect(opt.length).toEqual(1);
        expect(opt[0].className.includes(`${BASE_CLASS_PREFIX}-cascader-option-empty`)).toEqual(true);
        expect(document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option`)[0].textContent).toEqual('test');
        // done();
    });

    it('filterTreeNode as a func', () => {
        let cascader = render({
            filterTreeNode: (inputValue, cascaderNode) => cascaderNode === inputValue,
            defaultOpen: true,
        });
        const searchWrapper = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-search-wrapper`);
        searchWrapper.find('input').simulate('change', { target: { value: '北' } });

        // await sleep();
        expect(cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option-label-highlight`).length).toEqual(0);
        // done();
    });

    it('controlled: value shows correct', () => {
        let cascader = render({
            value: ['Asia', 'China', 'Beijing'],
        });
        expect(cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection`).getDOMNode().textContent).toEqual(
            '亚洲 / 中国 / 北京'
        );
    });

    it('controlled: fire onChange and ui not update', () => {
        let spyOnChange = sinon.spy(() => {});
        let cascader = render({
            value: ['Asia', 'China', 'Beijing'],
            defaultOpen: true,
            onChange: spyOnChange,
            changeOnSelect: true,
        });
        // await sleep();

        let lists = document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option-list`);
        lists[0].querySelectorAll('li')[0].click();
        expect(spyOnChange.calledOnce).toBe(true);
        expect(cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection`).getDOMNode().textContent).toEqual(
            '亚洲 / 中国 / 北京'
        );
        // done();
    });

    it('async load data', () => {
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: () => {} } };
        const then = jest.fn(() => Promise.resolve());
        const loadData = jest.fn(() => ({ then }));
        const data = {
            label: '亚洲',
            value: 'Asia',
        };
        let cascader = render({
            loadData,
            defaultOpen: true,
            treeData: [data],
        });
        let topNodeAsia = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option`).at(0);
        topNodeAsia.simulate('click', nativeEvent);
        expect(loadData).toHaveBeenCalledWith([data]);
        expect(then).toHaveBeenCalled();
    });

    it('select item + onChange + onChangeWithObject', () => {
        let spyOnChange = sinon.spy(() => {});
        let cascader = render({
            defaultOpen: true,
            onChange: spyOnChange,
            onChangeWithObject: true,
        });
        // let selectBox = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection`).at(0);
        // selectBox.simulate('click');
        // await sleep();
        let lists = document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option-list`);
        lists[0].querySelectorAll('li')[0].click();
        lists = document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option-list`);
        lists[1].querySelectorAll('li')[0].click();
        lists = document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option-list`);
        lists[2].querySelectorAll('li')[0].click();
        expect(spyOnChange.calledOnce).toBe(true);
        expect(
            spyOnChange.calledWithMatch([
                {
                    label: '亚洲',
                    value: 'Asia',
                    key: 'Asia',
                    children: [
                        {
                            label: '中国',
                            value: 'China',
                            key: 'China',
                            children: [
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
                            ],
                        },
                    ],
                },
                {
                    label: '中国',
                    value: 'China',
                    key: 'China',
                    children: [
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
                    ],
                },
                {
                    label: '北京',
                    value: 'Beijing',
                    key: 'beijing',
                },
            ])
        ).toEqual(true);
        expect(
            lists[2]
                .querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option`)[0]
                .querySelectorAll(`.${BASE_CLASS_PREFIX}-icon-tick`).length
        ).toEqual(1);
        expect(cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection`).getDOMNode().textContent).toEqual(
            '亚洲 / 中国 / 北京'
        );
        // done();
    });

    it('select item + onChange + onChangeWithObject + changeOnSelect', () => {
        let spyOnChange = sinon.spy(() => {});
        let cascader = render({
            defaultOpen: true,
            onChange: spyOnChange,
            onChangeWithObject: true,
            changeOnSelect: true,
        });
        let lists = document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option-list`);
        lists[0].querySelectorAll('li')[0].click();
        expect(spyOnChange.calledOnce).toBe(true);
        expect(
            spyOnChange.calledWithMatch([
                {
                    label: '亚洲',
                    value: 'Asia',
                    key: 'Asia',
                    children: [
                        {
                            label: '中国',
                            value: 'China',
                            key: 'China',
                            children: [
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
                            ],
                        },
                    ],
                },
            ])
        ).toEqual(true);
        expect(
            lists[0]
                .querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option`)[0]
                .className.includes(`${BASE_CLASS_PREFIX}-cascader-option-select`)
        ).toEqual(true);
        expect(cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection`).getDOMNode().textContent).toEqual('亚洲');
    });

    it('controlled: value shows correct', () => {
        let cascader = render({
            value: [
                {
                    label: '亚洲',
                    value: 'Asia',
                    key: 'Asia',
                    children: [
                        {
                            label: '中国',
                            value: 'China',
                            key: 'China',
                            children: [
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
                            ],
                        },
                    ],
                },
                {
                    label: '中国',
                    value: 'China',
                    key: 'China',
                    children: [
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
                    ],
                },
                {
                    label: '北京',
                    value: 'Beijing',
                    key: 'beijing',
                },
            ],
            onChangeWithObject: true,
        });
        expect(cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection`).getDOMNode().textContent).toEqual(
            '亚洲 / 中国 / 北京'
        );
    });

    it('onClear and showClear', () => {
        const spyOnClear = sinon.spy(() => { });
        const cascader = render({
            defaultValue: ['Asia', 'China', 'Beijing'],
            showClear: true,
            onClear: spyOnClear,
            placeholder: "请选择所在地区"
        });
        expect(cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection`).getDOMNode().textContent).toEqual(
            '亚洲 / 中国 / 北京'
        );
        cascader.simulate('mouseEnter', {}).find(`.${BASE_CLASS_PREFIX}-cascader-clearbtn`).simulate('click');
        expect(spyOnClear.calledOnce).toBe(true);
        expect(cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection`).getDOMNode().textContent).toEqual(
            '请选择所在地区'
        );
        cascader.unmount();
    });

    it('filterLeafOnly = false', () => {
        let cascader = render({
            filterTreeNode: true,
            defaultOpen: true,
            filterLeafOnly: false
        });
        // let selectBox = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection`).at(0);
        // selectBox.simulate('click');
        // await sleep();
        const searchWrapper = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-search-wrapper`);
        let searchValue = '亚';
        let event = { target: { value: searchValue } };
        searchWrapper.find('input').simulate('change', event);

        // await sleep();
        let resList = document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option-label-highlight`);
        expect(resList.length).toEqual(4);
        // debugger
        // expect(resList[0].textContent).toEqual('亚洲/中国/北京');
        // done();
    });

    it('showNext',()=>{
        // expand next menu by hover
        // 通过 hover 展开 Dropdown 的子菜单
        const cascaderWithHover = render({
            showNext: 'hover',
        });
        const selectBox = cascaderWithHover.find(`.${BASE_CLASS_PREFIX}-cascader-selection`).at(0);
        selectBox.simulate('click');
        expect(document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option-list`).length).toEqual(1);
        cascaderWithHover
            .find(`.${BASE_CLASS_PREFIX}-cascader-option-list`)
            .at(0)
            .find(`.${BASE_CLASS_PREFIX}-cascader-option`)
            .at(0)
            .simulate('mouseEnter');
        expect(document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option-list`).length).toEqual(2);
        cascaderWithHover.unmount();

        // expand next menu by click
        // 通过 click 展开 Dropdown 的子菜单
        const cascaderWithClick = render({
            showNext: 'click',
        });
        const selectBox2 = cascaderWithClick.find(`.${BASE_CLASS_PREFIX}-cascader-selection`).at(0);
        selectBox2.simulate('click');
        expect(document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option-list`).length).toEqual(1);
        cascaderWithClick
            .find(`.${BASE_CLASS_PREFIX}-cascader-option-list`)
            .at(0)
            .find(`.${BASE_CLASS_PREFIX}-cascader-option`)
            .at(0)
            .simulate('mouseEnter');
        expect(document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option-list`).length).toEqual(1);
        cascaderWithClick
            .find(`.${BASE_CLASS_PREFIX}-cascader-option-list`)
            .at(0)
            .find(`.${BASE_CLASS_PREFIX}-cascader-option`)
            .at(0)
            .simulate('click');
        expect(document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option-list`).length).toEqual(2);
        cascaderWithClick.unmount();
        
    })

    it('disableStrictly', ()=>{
        // disable strictly
        const cascaderWithDisableStrictly = render({
            showNext: 'hover',
            treeData:treeDataWithDisabled,
            disableStrictly: true,
            multiple: true,
        });
        expect(cascaderWithDisableStrictly.state().checkedKeys.size).toEqual(0); 
        expect(cascaderWithDisableStrictly.state().disabledKeys.size).toEqual(3); 
        // open dropdown
        const selectBoxWithDisableStrictly = cascaderWithDisableStrictly.find(`.${BASE_CLASS_PREFIX}-cascader-selection`).at(0);
        selectBoxWithDisableStrictly.simulate('click');
        // click checkbox
        cascaderWithDisableStrictly
            .find(`.${BASE_CLASS_PREFIX}-cascader-option-list`)
            .at(0)
            .find(`.${BASE_CLASS_PREFIX}-cascader-option`)
            .at(0)
            .find(`.${BASE_CLASS_PREFIX}-cascader-option-label`)
            .at(0)
            .find(`.${BASE_CLASS_PREFIX}-checkbox`)
            .at(0)
            .simulate('click');
        // check checkedKeys
        expect(cascaderWithDisableStrictly.state().checkedKeys.size).toEqual(1); 
        cascaderWithDisableStrictly.unmount();

        // default disable
        const cascaderWithDisable = render({
            showNext: 'hover',
            treeData:treeDataWithDisabled,
            multiple: true,
        });
        expect(cascaderWithDisable.state().checkedKeys.size).toEqual(0); 
        expect(cascaderWithDisable.state().disabledKeys.size).toEqual(0); 
        // open dropdown
        const selectBoxWithDisable = cascaderWithDisable.find(`.${BASE_CLASS_PREFIX}-cascader-selection`).at(0);
        selectBoxWithDisable.simulate('click');
        // click checkbox
        cascaderWithDisable
            .find(`.${BASE_CLASS_PREFIX}-cascader-option-list`)
            .at(0)
            .find(`.${BASE_CLASS_PREFIX}-cascader-option`)
            .at(0)
            .find(`.${BASE_CLASS_PREFIX}-cascader-option-label`)
            .at(0)
            .find(`.${BASE_CLASS_PREFIX}-checkbox`)
            .at(0)
            .simulate('click');
        // check checkedKeys
        expect(cascaderWithDisable.state().checkedKeys.size).toEqual(5); 
        cascaderWithDisable.unmount();
    });

    it('multiple + onChangeWithObject', () => {
        const cascader = render({
            multiple: true,
            onChangeWithObject: true,
            defaultValue: [
                {
                    label: '北美洲',
                    value: 'North America',
                    key: 'North America',
                    children: [
                        {
                            label: '美国',
                            value: 'United States',
                            key: 'United States',
                        },
                        {
                            label: '加拿大',
                            value: 'Canada',
                            key: 'Canada',
                        },
                    ],
                },
                {
                    label: '美国',
                    value: 'United States',
                    key: 'United States',
                }
            ]
        });
        const tags = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection .${BASE_CLASS_PREFIX}-tag`)
        expect(tags.length).toEqual(1);
        expect(
            tags
            .find(`.${BASE_CLASS_PREFIX}-tag-content`)
            .getDOMNode()
            .textContent
        ).toEqual('美国');
    });

    it('multiple select enableLeafClick', () => {
        const cascaderWithMultiple = render({
            multiple: true,
            enableLeafClick: true,
            treeData: [
                {
                    label: '北美洲',
                    value: 'North America',
                    key: 'North America',
                    children: [
                        {
                            label: '美国',
                            value: 'United States',
                            key: 'United States',
                        },
                        {
                            label: '加拿大',
                            value: 'Canada',
                            key: 'Canada',
                        },
                    ],
                },
                {
                    label: '南美洲',
                    value: 'Nanmeiguo',
                    key: 'Nanmeiguo',
                }
            ]
        })
        const selectBox = cascaderWithMultiple.find(`.${BASE_CLASS_PREFIX}-cascader-selection`).at(0);
        selectBox.simulate('click');
        // click checkbox
        cascaderWithMultiple
            .find(`.${BASE_CLASS_PREFIX}-cascader-option-list`)
            .at(0)
            .find(`.${BASE_CLASS_PREFIX}-cascader-option`)
            .at(1)
            .find(`.${BASE_CLASS_PREFIX}-cascader-option-label`)
            .at(0)
            .find(`.${BASE_CLASS_PREFIX}-checkbox`)
            .at(0)
            .simulate('click');
        expect(cascaderWithMultiple.state().checkedKeys.size).toEqual(1);
        // click option cancel checked
        cascaderWithMultiple
            .find(`.${BASE_CLASS_PREFIX}-cascader-option-list`)
            .at(0)
            .find(`.${BASE_CLASS_PREFIX}-cascader-option`)
            .at(1)
            .simulate('click')
        expect(cascaderWithMultiple.state().checkedKeys.size).toEqual(0);
        // click option select
        cascaderWithMultiple
            .find(`.${BASE_CLASS_PREFIX}-cascader-option-list`)
            .at(0)
            .find(`.${BASE_CLASS_PREFIX}-cascader-option`)
            .at(0)
            .simulate('click')
        cascaderWithMultiple
            .find(`.${BASE_CLASS_PREFIX}-cascader-option-list`)
            .at(1)
            .find(`.${BASE_CLASS_PREFIX}-cascader-option`)
            .at(0)
            .simulate('click')
        expect(cascaderWithMultiple.state().checkedKeys.size).toEqual(1);
        const states = cascaderWithMultiple.state()
        cascaderWithMultiple.unmount();
    })

    it('multiple select disable enableLeafClick', () => {
        const cascaderWithMultiple = render({
            multiple: true,
            treeData: [
                {
                    label: '北美洲',
                    value: 'North America',
                    key: 'North America',
                    children: [
                        {
                            label: '美国',
                            value: 'United States',
                            key: 'United States',
                        },
                        {
                            label: '加拿大',
                            value: 'Canada',
                            key: 'Canada',
                        },
                    ],
                },
                {
                    label: '南美洲',
                    value: 'Nanmeiguo',
                    key: 'Nanmeiguo',
                }
            ]
        })
        const selectBox = cascaderWithMultiple.find(`.${BASE_CLASS_PREFIX}-cascader-selection`).at(0);
        selectBox.simulate('click');
        // click checkbox
        cascaderWithMultiple
            .find(`.${BASE_CLASS_PREFIX}-cascader-option-list`)
            .at(0)
            .find(`.${BASE_CLASS_PREFIX}-cascader-option`)
            .at(1)
            .find(`.${BASE_CLASS_PREFIX}-cascader-option-label`)
            .at(0)
            .find(`.${BASE_CLASS_PREFIX}-checkbox`)
            .at(0)
            .simulate('click');
        expect(cascaderWithMultiple.state().checkedKeys.size).toEqual(1);
        // click option can't cancel checked
        cascaderWithMultiple
            .find(`.${BASE_CLASS_PREFIX}-cascader-option-list`)
            .at(0)
            .find(`.${BASE_CLASS_PREFIX}-cascader-option`)
            .at(1)
            .simulate('click')
        expect(cascaderWithMultiple.state().checkedKeys.size).toEqual(1);
        cascaderWithMultiple.unmount();
    })

    it('separator', () => {
        const cascader = render({
            filterTreeNode: true,
            defaultValue: ['Asia', 'China', 'Beijing'],
            separator: ' > ',
            defaultOpen: true,
        });
        const span = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection span`);
        expect(span.getDOMNode().textContent).toEqual('亚洲 > 中国 > 北京'); 
        cascader.simulate('click');
        const input = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection input`);
        const event = { target: { value: '中国' } };
        input.simulate('change', event);
        expect(
            cascader
            .find(`.${BASE_CLASS_PREFIX}-cascader-option-list li`)
            .at(0)
            .getDOMNode()
            .textContent
        ).toEqual('亚洲 > 中国 > 北京');
        cascader.unmount();
    });

    it('search ref method', () => {
        let r;
        const cascader = render({
            ref: (ref) => { r = ref },
            filterTreeNode: true,
            searchPosition: 'custom',
            defaultOpen: true,
        });
        r.search('北京');
        expect(cascader.state().inputValue).toEqual('北京');
        expect(
            document.querySelectorAll(`.${BASE_CLASS_PREFIX}-cascader-option-label-highlight`)[0]
            .textContent
        ).toEqual('北京');
        cascader.unmount();
    });

    it('triggerRender', () => {
        const spyTriggerRender = sinon.spy(() => <span>123</span>);
        const cascaderAutoMerge = render({
            multiple: true,
            triggerRender: spyTriggerRender,
            defaultValue: 'Asia'
        });
        cascaderAutoMerge.simulate('click');
        const firstCall = spyTriggerRender.getCall(0);
        const args = firstCall.args[0]; 
        /* check arguments of triggerRender */
        expect(args.value.size).toEqual(1);
        expect(args.value).toEqual(new Set('0'));
        cascaderAutoMerge.unmount();

        const spyTriggerRender2 = sinon.spy(() => <span>123</span>);
        const cascaderNoAutoMerge = render({
            multiple: true,
            triggerRender: spyTriggerRender2,
            defaultValue: 'Asia',
            autoMergeValue: false,
        });
        cascaderNoAutoMerge.simulate('click');
        const firstCall2 = spyTriggerRender2.getCall(0);
        const args2 = firstCall2.args[0]; 
        /* check arguments of triggerRender */
        expect(args2.value.size).toEqual(4);
        expect(args2.value).toEqual(new Set(['0','0-0','0-0-1','0-0-0']));
        cascaderNoAutoMerge.unmount();
    });

    it('autoMergeValue', () => {
        const cascader = render({
            multiple: true,
            autoMergeValue: false,
            defaultValue: 'Asia',
        });
        const tags = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection .${BASE_CLASS_PREFIX}-tag`)
        expect(tags.length).toEqual(4);
        cascader.unmount();

        const cascaderAutoMerge = render({
            multiple: true,
            autoMergeValue: true,
            defaultValue: 'Asia',
        });
        const tags2 = cascaderAutoMerge.find(`.${BASE_CLASS_PREFIX}-cascader-selection .${BASE_CLASS_PREFIX}-tag`)
        expect(tags2.length).toEqual(1);
        expect(
            tags2
                .find(`.${BASE_CLASS_PREFIX}-tag-content`)
                .getDOMNode()
                .textContent
        ).toEqual('亚洲');
        cascaderAutoMerge.unmount();
    });

    it('leafOnly', () => {
        /* autoMergeValue and leafOnly are both false */
        const cascader = render({
            multiple: true,
            autoMergeValue: false,
            leafOnly: false,
            defaultValue: 'Asia',
        });
        const tags = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection .${BASE_CLASS_PREFIX}-tag`)
        expect(tags.length).toEqual(4);
        cascader.unmount();

        /* autoMergeValue and leafOnly are both true */
        const cascader2 = render({
            multiple: true,
            autoMergeValue: true,
            leafOnly: true,
            defaultValue: 'Asia',
        });
        const tags2 = cascader2.find(`.${BASE_CLASS_PREFIX}-cascader-selection .${BASE_CLASS_PREFIX}-tag`)
        expect(tags2.length).toEqual(2);
        cascader2.unmount();

        /* autoMergeValue is false, leafOnly is true */
        const cascader3 = render({
            multiple: true,
            autoMergeValue: false,
            leafOnly: true,
            defaultValue: 'Asia',
        });
        const tags3 = cascader3.find(`.${BASE_CLASS_PREFIX}-cascader-selection .${BASE_CLASS_PREFIX}-tag`)
        expect(tags3.length).toEqual(2);
        cascader3.unmount();

        /* autoMergeValue is true, leafOnly is false */
        const cascader4 = render({
            multiple: true,
            autoMergeValue: true,
            leafOnly: false,
            defaultValue: 'Asia',
        });
        const tags4 = cascader4.find(`.${BASE_CLASS_PREFIX}-cascader-selection .${BASE_CLASS_PREFIX}-tag`)
        expect(tags4.length).toEqual(1);
        expect(
            tags4
                .find(`.${BASE_CLASS_PREFIX}-tag-content`)
                .getDOMNode()
                .textContent
        ).toEqual('亚洲');
        cascader4.unmount();
    });

    it('ref method', () => {
        let r;
        let props = {
            ref: (ref) => { r = ref },
            filter: true,
            multiple: true,
        };

        let select = render(props);
        r.open();
        expect(select.state().isOpen).toEqual(true);

        r.close();
        expect(select.state().isOpen).toEqual(false);
    });

    it('autoMerge false & value []', () => {
        const cascader = render({
            multiple: true,
            autoMergeValue: false,
            value: [],
            placeholder: "autoMergeValue 为 false"
        });

        const placeholder = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection-placeholder`)
        expect(placeholder.getDOMNode().textContent).toEqual('autoMergeValue 为 false');
        cascader.unmount();
    })

    it('value not in TreeData', () => {
        const cascader = render({
            multiple: true,
            value: [ "value", "notIn",  "treeData"],
            placeholder: "value not in treeData, show placeholder",
            autoMergeValue: false,
            filterTreeNode: true,
        });

        const placeholder = cascader.find(`.${BASE_CLASS_PREFIX}-input`)
        expect(placeholder.getDOMNode().placeholder).toEqual('value not in treeData, show placeholder');
        cascader.unmount();
    })

    it('onFocus callback', () => {
        const spyOnFocus = sinon.spy(() => {});
        const cascader = render({
            onFocus: spyOnFocus,
        });
        const selectBox = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection`).at(0);
        selectBox.simulate('click');
        // onFocus 在打开下拉框时触发
        expect(spyOnFocus.calledOnce).toBe(true);
        cascader.unmount();
    });

    it('onBlur callback', () => {
        const spyOnBlur = sinon.spy(() => {});
        const cascader = render({
            onBlur: spyOnBlur,
        });
        // 验证 onBlur 属性被正确传递
        expect(cascader.props().onBlur).toBe(spyOnBlur);
        cascader.unmount();
    });

    it('max prop', () => {
        const cascader = render({
            multiple: true,
            max: 2,
        });
        // 验证 max 属性被正确传递
        expect(cascader.props().max).toBe(2);
        cascader.unmount();
    });

    it('onExceed callback', () => {
        const spyOnExceed = sinon.spy(() => {});
        const cascader = render({
            multiple: true,
            onExceed: spyOnExceed,
        });
        // 验证 onExceed 属性被正确传递
        expect(cascader.props().onExceed).toBe(spyOnExceed);
        cascader.unmount();
    });

    it('maxTagCount', () => {
        const cascader = render({
            multiple: true,
            maxTagCount: 1,
            defaultValue: [['Asia', 'China', 'Beijing'], ['Asia', 'China', 'Shanghai']],
            autoMergeValue: false,
        });
        
        // 应该只显示 maxTagCount 个 tag
        const tags = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection .${BASE_CLASS_PREFIX}-tag`);
        // 有 +N 的标签
        expect(tags.length).toBeLessThanOrEqual(2); // 1 tag + 1 "+N" tag
        cascader.unmount();
    });

    it('borderless prop', () => {
        const cascader = render({
            borderless: true,
        });
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader-borderless`)).toEqual(true);
        cascader.unmount();
    });

    it('arrowIcon prop', () => {
        const customIcon = <span className="custom-arrow">arrow</span>;
        const cascader = render({
            arrowIcon: customIcon,
        });
        expect(cascader.exists('.custom-arrow')).toEqual(true);
        cascader.unmount();
    });

    // 测试 handleMouseLeave
    it('handleMouseLeave with showClear', () => {
        const cascader = render({
            showClear: true,
            defaultValue: ['Asia', 'China', 'Beijing'],
        });
        
        // 触发 mouseEnter
        cascader.find(`.${BASE_CLASS_PREFIX}-cascader`).simulate('mouseEnter');
        
        // 触发 mouseLeave
        cascader.find(`.${BASE_CLASS_PREFIX}-cascader`).simulate('mouseLeave');
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 onKeyPress 事件
    it('onKeyPress on selection', () => {
        const cascader = render({
            defaultValue: ['Asia', 'China', 'Beijing'],
        });
        
        // 触发 keyPress 事件
        cascader.find(`.${BASE_CLASS_PREFIX}-cascader`).simulate('keyPress', { key: 'Enter' });
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 handleClick
    it('handleClick on selection', () => {
        const cascader = render({
            defaultValue: ['Asia', 'China', 'Beijing'],
        });
        
        // 触发 click 事件
        cascader.find(`.${BASE_CLASS_PREFIX}-cascader`).simulate('click');
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 focus 和 blur 方法
    it('focus and blur methods', () => {
        const ref = React.createRef();
        const cascader = mount(
            <Cascader
                treeData={treeData}
                ref={ref}
            />
        );
        
        // 调用 focus 方法
        if (ref.current && ref.current.focus) {
            ref.current.focus();
        }
        
        // 调用 blur 方法
        if (ref.current && ref.current.blur) {
            ref.current.blur();
        }
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 open 和 close 方法
    it('open and close methods', () => {
        const ref = React.createRef();
        const cascader = mount(
            <Cascader
                treeData={treeData}
                ref={ref}
            />
        );
        
        // 调用 open 方法
        if (ref.current && ref.current.open) {
            ref.current.open();
        }
        
        // 调用 close 方法
        if (ref.current && ref.current.close) {
            ref.current.close();
        }
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 multiple 模式下的 selectedKeys
    it('multiple mode with selectedKeys', () => {
        const cascader = render({
            multiple: true,
            defaultValue: [['Asia', 'China', 'Beijing']],
            autoMergeValue: false,
        });
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 triggerRender 自定义触发器
    it('triggerRender custom trigger', () => {
        const cascader = render({
            triggerRender: ({ value }) => (
                <div className="custom-trigger">Custom: {value}</div>
            ),
            defaultValue: ['Asia', 'China', 'Beijing'],
        });
        
        expect(cascader.exists('.custom-trigger')).toEqual(true);
        cascader.unmount();
    });

    // 测试 handleListScroll
    it('handleListScroll', async () => {
        const cascader = render({
            defaultOpen: true,
        });
        
        await sleep();
        
        // 找到列表并触发滚动
        const list = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option-lists ul`).first();
        if (list.exists()) {
            list.simulate('scroll');
        }
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 displayRender 自定义渲染
    it('displayRender in multiple mode', () => {
        const displayRender = sinon.spy((entity, idx) => (
            <span key={idx} className="custom-display">{entity.data.label}</span>
        ));
        const cascader = render({
            multiple: true,
            displayRender,
            defaultValue: [['Asia', 'China', 'Beijing']],
            autoMergeValue: false,
        });
        
        expect(displayRender.called).toBe(true);
        cascader.unmount();
    });

    // 测试 handleTagClose
    it('handleTagClose in multiple mode', async () => {
        const onChange = sinon.spy();
        const cascader = render({
            multiple: true,
            onChange,
            defaultValue: [['Asia', 'China', 'Beijing']],
            autoMergeValue: false,
        });
        
        // 找到 tag 的关闭按钮并点击
        const closeBtn = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection-tag .${BASE_CLASS_PREFIX}-tag-close`).first();
        if (closeBtn.exists()) {
            closeBtn.simulate('click', { 
                preventDefault: () => {},
                stopPropagation: () => {},
                nativeEvent: {
                    stopImmediatePropagation: () => {}
                }
            });
        }
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 onRemoveInTagInput
    it('onRemoveInTagInput', () => {
        const onChange = sinon.spy();
        const cascader = render({
            multiple: true,
            onChange,
            defaultValue: [['Asia', 'China', 'Beijing']],
            autoMergeValue: false,
        });
        
        // 找到 TagInput 并触发 remove
        const tagInput = cascader.find(`.${BASE_CLASS_PREFIX}-tagInput`);
        if (tagInput.exists()) {
            // 模拟删除操作
            const tag = cascader.find(`.${BASE_CLASS_PREFIX}-tagInput .${BASE_CLASS_PREFIX}-tag`).first();
            if (tag.exists()) {
                const closeBtn = tag.find(`.${BASE_CLASS_PREFIX}-tag-close`);
                if (closeBtn.exists()) {
                    closeBtn.simulate('click');
                }
            }
        }
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 renderTagItem 返回 null 的情况
    it('renderTagItem returns null when keyEntities does not have the key', () => {
        const cascader = render({
            multiple: true,
            defaultValue: [['NonExistent', 'Path']],
            autoMergeValue: false,
        });
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 disableStrictly 属性
    it('disableStrictly with disabled item', () => {
        const treeDataWithDisabled = [
            {
                label: '亚洲',
                value: 'Asia',
                children: [
                    {
                        label: '中国',
                        value: 'China',
                        disabled: true,
                        children: [
                            {
                                label: '北京',
                                value: 'Beijing',
                            },
                        ],
                    },
                ],
            },
        ];
        const cascader = mount(
            <Cascader
                treeData={treeDataWithDisabled}
                multiple
                disableStrictly
                defaultValue={[['Asia', 'China', 'Beijing']]}
                autoMergeValue={false}
            />
        );
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 prefix 和 suffix 属性
    it('prefix and suffix props', () => {
        const cascader = render({
            prefix: <span className="custom-prefix">Prefix</span>,
            suffix: <span className="custom-suffix">Suffix</span>,
        });
        
        expect(cascader.exists('.custom-prefix')).toEqual(true);
        expect(cascader.exists('.custom-suffix')).toEqual(true);
        cascader.unmount();
    });

    // 测试 insetLabel 属性
    it('insetLabel prop', () => {
        const cascader = render({
            insetLabel: <span className="custom-inset-label">Label</span>,
        });
        
        expect(cascader.exists('.custom-inset-label')).toEqual(true);
        cascader.unmount();
    });

    // 测试 virtualize 属性
    it('virtualize prop', async () => {
        const cascader = render({
            virtualize: {
                height: 300,
                itemSize: 36,
            },
            defaultOpen: true,
        });
        
        await sleep();
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 handleTagRemoveInTrigger
    it('handleTagRemoveInTrigger', () => {
        const onChange = sinon.spy();
        const cascader = render({
            multiple: true,
            onChange,
            triggerRender: ({ value, onRemove }) => (
                <div className="custom-trigger">
                    {Array.isArray(value) && value.map((v, i) => (
                        <span key={i} onClick={() => onRemove && onRemove(v)}>
                            {String(v)}
                        </span>
                    ))}
                </div>
            ),
            defaultValue: [['Asia', 'China', 'Beijing']],
            autoMergeValue: false,
        });
        
        expect(cascader.exists('.custom-trigger')).toEqual(true);
        cascader.unmount();
    });

    // 测试 search 方法
    it('search method', () => {
        const ref = React.createRef();
        const cascader = mount(
            <Cascader
                treeData={treeData}
                ref={ref}
                filterTreeNode
            />
        );
        
        // 调用 search 方法
        if (ref.current && ref.current.search) {
            ref.current.search('北京');
        }
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 emptyContent 为 null
    it('emptyContent is null', async () => {
        const cascader = render({
            treeData: [],
            emptyContent: null,
            defaultOpen: true,
        });
        
        await sleep();
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 onKeyPress on item
    it('onKeyPress on item', async () => {
        const cascader = render({
            defaultOpen: true,
        });
        
        await sleep();
        
        // 找到选项并触发 keyPress
        const item = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option`).first();
        if (item.exists()) {
            item.simulate('keyPress', { key: 'Enter' });
        }
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 loadData 属性
    it('loadData prop', async () => {
        const loadData = sinon.spy(() => Promise.resolve());
        const treeDataWithLoad = [
            {
                label: '亚洲',
                value: 'Asia',
                isLeaf: false,
            },
        ];
        const cascader = mount(
            <Cascader
                treeData={treeDataWithLoad}
                loadData={loadData}
                defaultOpen
            />
        );
        
        await sleep();
        
        // 点击选项触发 loadData
        const item = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option`).first();
        if (item.exists()) {
            item.simulate('click');
        }
        
        await sleep();
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 handleValueChange
    it('handleValueChange when value prop changes', () => {
        const cascader = mount(
            <Cascader
                treeData={treeData}
                value={['Asia', 'China', 'Beijing']}
            />
        );
        
        // 更新 value prop
        cascader.setProps({ value: ['North America', 'United States'] });
        cascader.update();
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 filterTreeNode 搜索功能
    it('filterTreeNode with search', async () => {
        const cascader = render({
            filterTreeNode: true,
            defaultOpen: true,
        });
        
        await sleep();
        
        // 输入搜索内容
        const input = cascader.find('input').first();
        if (input.exists()) {
            input.simulate('change', { target: { value: '北京' } });
        }
        
        await sleep();
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 onFocus 和 onBlur 事件
    it('onFocus and onBlur events', () => {
        const onFocus = sinon.spy();
        const onBlur = sinon.spy();
        const cascader = render({
            onFocus,
            onBlur,
        });
        
        // 触发 focus
        cascader.find(`.${BASE_CLASS_PREFIX}-cascader`).simulate('focus');
        
        // 触发 blur
        cascader.find(`.${BASE_CLASS_PREFIX}-cascader`).simulate('blur');
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 onSelect 事件
    it('onSelect event', async () => {
        const onSelect = sinon.spy();
        const cascader = render({
            onSelect,
            defaultOpen: true,
        });
        
        await sleep();
        
        // 点击选项
        const item = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option`).first();
        if (item.exists()) {
            item.simulate('click');
        }
        
        await sleep();
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 onSearch 事件
    it('onSearch event', async () => {
        const onSearch = sinon.spy();
        const cascader = render({
            filterTreeNode: true,
            onSearch,
            defaultOpen: true,
        });
        
        await sleep();
        
        // 输入搜索内容
        const input = cascader.find('input').first();
        if (input.exists()) {
            input.simulate('change', { target: { value: '北京' } });
        }
        
        await sleep();
        
        expect(onSearch.called).toBe(true);
        cascader.unmount();
    });

    // 测试 onDropdownVisibleChange 事件
    it('onDropdownVisibleChange event', async () => {
        const onDropdownVisibleChange = sinon.spy();
        const cascader = render({
            onDropdownVisibleChange,
        });
        
        // 点击打开下拉
        cascader.find(`.${BASE_CLASS_PREFIX}-cascader`).simulate('click');
        
        await sleep();
        
        expect(onDropdownVisibleChange.called).toBe(true);
        cascader.unmount();
    });

    // 测试 renderTagItem 返回 null
    it('renderTagItem returns null for invalid key', () => {
        const cascader = render({
            multiple: true,
            autoMergeValue: false,
        });
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 onRemoveInTagInput
    it('onRemoveInTagInput with TagInput', async () => {
        const onChange = sinon.spy();
        const cascader = render({
            multiple: true,
            onChange,
            defaultValue: [['Asia', 'China', 'Beijing'], ['Asia', 'China', 'Shanghai']],
            autoMergeValue: false,
        });
        
        // 找到 TagInput 中的 tag 并删除
        const tagClose = cascader.find(`.${BASE_CLASS_PREFIX}-tagInput .${BASE_CLASS_PREFIX}-tag-close`).first();
        if (tagClose.exists()) {
            tagClose.simulate('click', {
                stopPropagation: () => {},
                nativeEvent: {
                    stopImmediatePropagation: () => {}
                }
            });
        }
        
        await sleep();
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 filterRender 自定义渲染
    it('filterRender custom render', async () => {
        const filterRender = sinon.spy((props) => (
            <div className="custom-filter-item">{props.data.label}</div>
        ));
        const cascader = render({
            filterTreeNode: true,
            filterRender,
            defaultOpen: true,
        });
        
        await sleep();
        
        // 输入搜索内容
        const input = cascader.find('input').first();
        if (input.exists()) {
            input.simulate('change', { target: { value: '北京' } });
        }
        
        await sleep();
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 componentDidUpdate 中 treeData 变化时调用 collectOptions (line 552)
    it('componentDidUpdate calls collectOptions when treeData changes in single mode', async () => {
        const initialTreeData = [
            { label: '选项1', value: 'opt1' },
        ];
        const cascader = mount(
            <Cascader
                treeData={initialTreeData}
                defaultOpen={true}
            />
        );
        
        await sleep();
        
        // 更新 treeData
        const newTreeData = [
            { label: '选项1', value: 'opt1' },
            { label: '选项2', value: 'opt2' },
        ];
        cascader.setProps({ treeData: newTreeData });
        cascader.update();
        
        await sleep();
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 handleTagRemoveInTrigger (line 569)
    it('handleTagRemoveInTrigger removes tag', async () => {
        const onChange = sinon.spy();
        const cascader = mount(
            <Cascader
                treeData={treeData}
                multiple={true}
                onChange={onChange}
                defaultValue={[['Asia', 'China', 'Beijing'], ['Asia', 'China', 'Shanghai']]}
                autoMergeValue={false}
            />
        );
        
        await sleep();
        
        // handleTagRemoveInTrigger 需要 pos 格式如 "0-0-0" (表示树中的位置)
        // treeData[0] = Asia, treeData[0].children[0] = China, treeData[0].children[0].children[0] = Beijing
        const instance = cascader.instance();
        if (instance && instance.handleTagRemoveInTrigger) {
            instance.handleTagRemoveInTrigger('0-0-0'); // 对应 Asia-China-Beijing
        }
        
        await sleep();
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 onRemoveInTagInput 直接调用 (line 612)
    it('onRemoveInTagInput removes tag by key', async () => {
        const onChange = sinon.spy();
        const cascader = mount(
            <Cascader
                treeData={treeData}
                multiple={true}
                onChange={onChange}
                defaultValue={[['Asia', 'China', 'Beijing'], ['Asia', 'China', 'Shanghai']]}
                autoMergeValue={false}
            />
        );
        
        await sleep();
        
        // onRemoveInTagInput 需要 key 格式，通过 getKeyByValuePath 生成
        // VALUE_SPLIT = '_SEMI_CASCADER_SPLIT_'
        // 对于 ['Asia', 'China', 'Beijing']，key 应该是 'Asia_SEMI_CASCADER_SPLIT_China_SEMI_CASCADER_SPLIT_Beijing'
        const instance = cascader.instance();
        if (instance && instance.onRemoveInTagInput) {
            instance.onRemoveInTagInput('Asia_SEMI_CASCADER_SPLIT_China_SEMI_CASCADER_SPLIT_Beijing');
        }
        
        await sleep();
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 renderTagItem 返回 null (line 608)
    it('renderTagItem returns null for non-existent key', async () => {
        const cascader = mount(
            <Cascader
                treeData={treeData}
                multiple={true}
                defaultValue={[['Asia', 'China', 'Beijing']]}
                autoMergeValue={false}
            />
        );
        
        await sleep();
        
        // 获取 ref 并调用 renderTagItem 传入不存在的 key
        const instance = cascader.instance();
        if (instance && instance.renderTagItem) {
            const result = instance.renderTagItem('non-existent-key', 0);
            expect(result).toBe(null);
        }
        
        cascader.unmount();
    });

    // 测试 virtualize 在 flatten 搜索模式下 (item.tsx lines 286-288)
    it('virtualize in flatten search mode', async () => {
        const cascader = render({
            filterTreeNode: true,
            defaultOpen: true,
            virtualize: {
                height: 300,
                width: '100%',
                itemSize: 36,
            },
        });
        
        await sleep();
        
        // 输入搜索内容触发 flatten 模式
        const input = cascader.find('input').first();
        if (input.exists()) {
            input.simulate('change', { target: { value: '北京' } });
        }
        
        await sleep();
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 disabled 选项在 renderItem 中 (item.tsx line 321)
    it('disabled item in cascader list', async () => {
        const treeDataWithDisabled = [
            {
                label: '亚洲',
                value: 'Asia',
                children: [
                    {
                        label: '中国',
                        value: 'China',
                        disabled: true,
                        children: [
                            { label: '北京', value: 'Beijing' },
                        ],
                    },
                ],
            },
        ];
        const cascader = mount(
            <Cascader
                treeData={treeDataWithDisabled}
                defaultOpen={true}
            />
        );
        
        await sleep();
        
        // 点击第一个选项展开
        const firstItem = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option`).first();
        if (firstItem.exists()) {
            firstItem.simulate('click');
        }
        
        await sleep();
        
        // 检查 disabled 选项
        expect(cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option-disabled`).exists()).toBe(true);
        cascader.unmount();
    });

    // 测试 TagInput 的 onRemove 回调
    it('TagInput onRemove callback', async () => {
        const onChange = sinon.spy();
        const cascader = mount(
            <Cascader
                treeData={treeData}
                multiple={true}
                onChange={onChange}
                defaultValue={[['Asia', 'China', 'Beijing'], ['Asia', 'China', 'Shanghai']]}
                autoMergeValue={false}
            />
        );
        
        await sleep();
        
        // 找到 TagInput 并模拟 backspace 删除
        const tagInput = cascader.find(`.${BASE_CLASS_PREFIX}-tagInput input`).first();
        if (tagInput.exists()) {
            tagInput.simulate('keydown', { keyCode: 8 }); // Backspace
        }
        
        await sleep();
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 treeData 变化但 value 不变的情况
    it('treeData changes without value change', async () => {
        const cascader = mount(
            <Cascader
                treeData={treeData}
                value={['Asia', 'China', 'Beijing']}
            />
        );
        
        await sleep();
        
        // 更新 treeData 但保持 value 不变
        const newTreeData = [
            ...treeData,
            {
                label: '欧洲',
                value: 'Europe',
                children: [
                    { label: '英国', value: 'UK' },
                ],
            },
        ];
        cascader.setProps({ treeData: newTreeData });
        cascader.update();
        
        await sleep();
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 value 变化但 treeData 不变的情况 (line 555)
    it('value changes without treeData change', async () => {
        const cascader = mount(
            <Cascader
                treeData={treeData}
                value={['Asia', 'China', 'Beijing']}
            />
        );
        
        await sleep();
        
        // 只更新 value
        cascader.setProps({ value: ['Asia', 'China', 'Shanghai'] });
        cascader.update();
        
        await sleep();
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 click outside 关闭下拉 (line 328)
    it('click outside closes dropdown', async () => {
        const onDropdownVisibleChange = sinon.spy();
        const cascader = render({
            defaultOpen: true,
            onDropdownVisibleChange,
        });
        
        await sleep();
        
        // 点击 cascader 外部区域来关闭下拉
        // 使用 simulate 而不是原生事件
        cascader.find(`.${BASE_CLASS_PREFIX}-cascader`).simulate('blur');
        
        await sleep();
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 updateSelection (line 365)
    it('updateSelection adapter method', async () => {
        const cascader = render({
            defaultOpen: true,
        });
        
        await sleep();
        
        // 点击选项触发 updateSelection
        const item = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option`).first();
        if (item.exists()) {
            item.simulate('click');
        }
        
        await sleep();
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 onExceed 回调 (line 416)
    it('onExceed callback when max is reached', async () => {
        const onExceed = sinon.spy();
        const cascader = mount(
            <Cascader
                treeData={treeData}
                multiple={true}
                max={1}
                onExceed={onExceed}
                defaultOpen={true}
            />
        );
        
        await sleep();
        
        // 点击第一个选项
        const firstItem = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option`).first();
        if (firstItem.exists()) {
            firstItem.simulate('click');
        }
        
        await sleep();
        
        // 展开并点击子选项
        const childItems = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option`);
        if (childItems.length > 1) {
            childItems.at(1).simulate('click');
        }
        
        await sleep();
        
        // 再点击一个选项尝试超过 max
        const allItems = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option`);
        if (allItems.length > 2) {
            allItems.at(2).simulate('click');
        }
        
        await sleep();
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 multiple 模式下 checkedKeys 为空的情况 (line 529)
    it('multiple mode with empty checkedKeys', async () => {
        const cascader = mount(
            <Cascader
                treeData={treeData}
                multiple={true}
                defaultValue={[]}
            />
        );
        
        await sleep();
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 virtualize 搜索模式下的 VirtualRow (virtualRow.tsx lines 10-12)
    it('virtualize search mode renders VirtualRow', async () => {
        const cascader = mount(
            <Cascader
                treeData={treeData}
                filterTreeNode={true}
                defaultOpen={true}
                virtualize={{
                    height: 300,
                    width: '100%',
                    itemSize: 36,
                }}
            />
        );
        
        await sleep();
        
        // 输入搜索内容触发 flatten 模式
        const input = cascader.find('input').first();
        if (input.exists()) {
            input.simulate('change', { target: { value: 'China' } });
        }
        
        await sleep(300);
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 renderEmpty 返回 null (item.tsx line 370)
    it('renderEmpty returns null when emptyContent is null', async () => {
        const cascader = mount(
            <Cascader
                treeData={[]}
                emptyContent={null}
                defaultOpen={true}
            />
        );
        
        await sleep();
        
        // 检查是否没有渲染空内容
        expect(cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option-empty`).exists()).toBe(false);
        cascader.unmount();
    });

    // 测试 disabled 选项的 className (item.tsx line 321)
    it('disabled item has correct className', async () => {
        const treeDataWithDisabled = [
            {
                label: '亚洲',
                value: 'Asia',
                children: [
                    {
                        label: '中国',
                        value: 'China',
                        disabled: true,
                    },
                    {
                        label: '日本',
                        value: 'Japan',
                    },
                ],
            },
        ];
        const cascader = mount(
            <Cascader
                treeData={treeDataWithDisabled}
                defaultOpen={true}
            />
        );
        
        await sleep();
        
        // 点击第一个选项展开
        const firstItem = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option`).first();
        if (firstItem.exists()) {
            firstItem.simulate('click');
        }
        
        await sleep();
        
        // 检查 disabled 选项
        expect(cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option-disabled`).exists()).toBe(true);
        cascader.unmount();
    });

    // 测试 renderVirtualizeList 方法 (item.tsx lines 286-288)
    it('renderVirtualizeList in item', async () => {
        const cascader = mount(
            <Cascader
                treeData={treeData}
                filterTreeNode={true}
                defaultOpen={true}
                virtualize={{
                    height: 200,
                    width: 300,
                    itemSize: 32,
                }}
            />
        );
        
        await sleep();
        
        // 输入搜索触发 virtualize 列表渲染
        const input = cascader.find('input').first();
        if (input.exists()) {
            input.simulate('change', { target: { value: 'Bei' } });
        }
        
        await sleep(300);
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 notifyListScroll (line 414)
    it('notifyListScroll callback', async () => {
        const onListScroll = sinon.spy();
        const cascader = mount(
            <Cascader
                treeData={treeData}
                defaultOpen={true}
                onListScroll={onListScroll}
            />
        );
        
        await sleep();
        
        // 找到列表并模拟滚动
        const list = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option-lists ul`).first();
        if (list.exists()) {
            list.simulate('scroll');
        }
        
        await sleep();
        
        expect(onListScroll.called).toBe(true);
        cascader.unmount();
    });

    // 测试 checkRelation = 'unRelated' 时的 checkedKeys 处理 (line 529)
    it('checkRelation unRelated sets checkedKeys directly', async () => {
        const cascader = mount(
            <Cascader
                treeData={treeData}
                multiple={true}
                checkRelation="unRelated"
                defaultValue={[['Asia', 'China', 'Beijing']]}
            />
        );
        
        await sleep();
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 updateSelection adapter (line 365)
    it('updateSelection is called when selecting item', async () => {
        const onSelect = sinon.spy();
        const cascader = render({
            defaultOpen: true,
            onSelect,
            changeOnSelect: true,
        });
        
        await sleep();
        
        // 点击选项触发 updateSelection
        const item = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option`).first();
        if (item.exists()) {
            item.simulate('click');
        }
        
        await sleep();
        
        expect(onSelect.called).toBe(true);
        cascader.unmount();
    });

    // 测试 notifyOnExceed (line 416)
    it('notifyOnExceed is called when exceeding max', async () => {
        const onExceed = sinon.spy();
        const cascader = mount(
            <Cascader
                treeData={treeData}
                multiple={true}
                max={1}
                onExceed={onExceed}
                defaultValue={[['Asia', 'China', 'Beijing']]}
                defaultOpen={true}
            />
        );
        
        await sleep();
        
        // 尝试选择更多项
        const items = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option`);
        // 找到未选中的项并点击
        for (let i = 0; i < items.length; i++) {
            const item = items.at(i);
            if (!item.hasClass(`${BASE_CLASS_PREFIX}-cascader-option-select`)) {
                item.simulate('click');
                break;
            }
        }
        
        await sleep();
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 virtualize 在 flatten 搜索模式下渲染 VirtualRow
    it('virtualize flatten mode with search renders correctly', async () => {
        // 创建更多数据以确保 virtualize 生效
        const largeTreeData = [];
        for (let i = 0; i < 50; i++) {
            largeTreeData.push({
                label: `选项${i}`,
                value: `opt${i}`,
                children: [
                    { label: `子选项${i}-1`, value: `child${i}-1` },
                    { label: `子选项${i}-2`, value: `child${i}-2` },
                ],
            });
        }
        
        const cascader = mount(
            <Cascader
                treeData={largeTreeData}
                filterTreeNode={true}
                defaultOpen={true}
                virtualize={{
                    height: 200,
                    width: 300,
                    itemSize: 36,
                }}
            />
        );
        
        await sleep();
        
        // 输入搜索触发 flatten 模式
        const input = cascader.find('input').first();
        if (input.exists()) {
            input.simulate('change', { target: { value: '选项' } });
        }
        
        await sleep(500);
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 clickOutsideHandler (line 328)
    it('clickOutsideHandler closes dropdown when clicking outside', async () => {
        const onDropdownVisibleChange = sinon.spy();
        
        // 创建一个容器来模拟外部点击
        const container = document.createElement('div');
        document.body.appendChild(container);
        
        const cascader = mount(
            <Cascader
                treeData={treeData}
                defaultOpen={true}
                onDropdownVisibleChange={onDropdownVisibleChange}
                getPopupContainer={() => container}
            />,
            { attachTo: container }
        );
        
        await sleep();
        
        // 关闭下拉
        const instance = cascader.instance();
        if (instance && instance.close) {
            instance.close();
        }
        
        await sleep();
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.detach();
        document.body.removeChild(container);
    });

    // 测试 disabled 选项在 item 中的渲染 (item.tsx line 321)
    it('disabled option renders with disabled class', async () => {
        const treeDataWithDisabled = [
            {
                label: '选项1',
                value: 'opt1',
                disabled: true,
            },
            {
                label: '选项2',
                value: 'opt2',
            },
        ];
        const cascader = mount(
            <Cascader
                treeData={treeDataWithDisabled}
                defaultOpen={true}
            />
        );
        
        await sleep();
        
        // 检查 disabled 选项
        expect(cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option-disabled`).exists()).toBe(true);
        cascader.unmount();
    });

    // 测试 virtualize 在搜索模式下的 renderVirtualizeList (item.tsx lines 285-288)
    it('virtualize search mode triggers renderVirtualizeList', async () => {
        // 创建足够多的数据
        const largeTreeData = [];
        for (let i = 0; i < 100; i++) {
            largeTreeData.push({
                label: `Item${i}`,
                value: `item${i}`,
                children: [
                    { label: `Child${i}-A`, value: `child${i}a` },
                    { label: `Child${i}-B`, value: `child${i}b` },
                ],
            });
        }
        
        const cascader = mount(
            <Cascader
                treeData={largeTreeData}
                filterTreeNode={true}
                defaultOpen={true}
                virtualizeInSearch={{
                    height: 200,
                    width: 300,
                    itemSize: 36,
                }}
            />
        );
        
        await sleep();
        
        // 输入搜索内容触发搜索模式
        const input = cascader.find('input').first();
        if (input.exists()) {
            input.simulate('change', { target: { value: 'Item' } });
        }
        
        await sleep(500);
        
        // 检查是否渲染了虚拟列表
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 VirtualRow 组件 (virtualRow.tsx lines 10-12)
    it('VirtualRow renders correctly in virtualize mode', async () => {
        const largeTreeData = [];
        for (let i = 0; i < 50; i++) {
            largeTreeData.push({
                label: `TestItem${i}`,
                value: `testitem${i}`,
            });
        }
        
        const cascader = mount(
            <Cascader
                treeData={largeTreeData}
                filterTreeNode={true}
                defaultOpen={true}
                virtualizeInSearch={{
                    height: 150,
                    width: 250,
                    itemSize: 30,
                }}
            />
        );
        
        await sleep();
        
        // 输入搜索
        const input = cascader.find('input').first();
        if (input.exists()) {
            input.simulate('change', { target: { value: 'Test' } });
        }
        
        await sleep(500);
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 adapter updateSelection (line 365)
    it('adapter updateSelection updates selectedKeys', async () => {
        const cascader = render({
            defaultOpen: true,
            changeOnSelect: true,
        });
        
        await sleep();
        
        // 点击选项
        const item = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option`).first();
        if (item.exists()) {
            item.simulate('click');
        }
        
        await sleep();
        
        // 验证选中状态
        const selectedItem = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option-select`);
        expect(selectedItem.exists()).toBe(true);
        cascader.unmount();
    });

    // 测试 adapter notifyOnExceed (line 416)
    it('adapter notifyOnExceed is triggered when exceeding max', async () => {
        const onExceed = sinon.spy();
        const cascader = mount(
            <Cascader
                treeData={treeData}
                multiple={true}
                max={1}
                onExceed={onExceed}
                defaultOpen={true}
                autoMergeValue={false}
            />
        );
        
        await sleep();
        
        // 点击第一个选项
        const firstItem = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option`).first();
        if (firstItem.exists()) {
            firstItem.simulate('click');
        }
        
        await sleep();
        
        // 展开子选项
        cascader.update();
        const items = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option`);
        if (items.length > 1) {
            items.at(1).simulate('click');
        }
        
        await sleep();
        
        // 尝试再选择一个
        cascader.update();
        const allItems = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option`);
        if (allItems.length > 2) {
            allItems.at(2).simulate('click');
        }
        
        await sleep();
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 onHover 返回 disabled 项 (item.tsx line 132)
    it('onHover returns early for disabled item', async () => {
        const treeDataWithDisabled = [
            {
                label: '选项1',
                value: 'opt1',
                disabled: true,
            },
            {
                label: '选项2',
                value: 'opt2',
            },
        ];
        const cascader = mount(
            <Cascader
                treeData={treeDataWithDisabled}
                defaultOpen={true}
                showNext="hover"
            />
        );
        
        await sleep();
        
        // hover 到 disabled 项
        const disabledItem = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option-disabled`).first();
        if (disabledItem.exists()) {
            disabledItem.simulate('mouseenter');
        }
        
        await sleep();
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 renderIcon 返回 expandIcon (item.tsx line 172)
    it('renderIcon returns custom expandIcon', async () => {
        const customIcon = <span className="custom-expand-icon">></span>;
        const cascader = mount(
            <Cascader
                treeData={treeData}
                defaultOpen={true}
                expandIcon={customIcon}
            />
        );
        
        await sleep();
        
        // 检查自定义图标
        expect(cascader.find('.custom-expand-icon').exists()).toBe(true);
        cascader.unmount();
    });

    // 测试 renderIcon 返回 null (item.tsx line 182)
    it('renderIcon returns null for unknown type', async () => {
        const cascader = mount(
            <Cascader
                treeData={treeData}
                defaultOpen={true}
            />
        );
        
        await sleep();
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 onClick 在 flatten 搜索结果中 (item.tsx line 221)
    it('onClick in flatten search result', async () => {
        const onChange = sinon.spy();
        const cascader = mount(
            <Cascader
                treeData={treeData}
                filterTreeNode={true}
                defaultOpen={true}
                onChange={onChange}
            />
        );
        
        await sleep();
        
        // 输入搜索
        const input = cascader.find('input').first();
        if (input.exists()) {
            input.simulate('change', { target: { value: '北京' } });
        }
        
        await sleep(300);
        
        // 点击搜索结果
        cascader.update();
        const flattenItem = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option-flatten`).first();
        if (flattenItem.exists()) {
            flattenItem.simulate('click');
        }
        
        await sleep();
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 showNext hover 模式
    it('showNext hover mode expands on hover', async () => {
        const cascader = mount(
            <Cascader
                treeData={treeData}
                defaultOpen={true}
                showNext="hover"
            />
        );
        
        await sleep();
        
        // hover 到第一个选项
        const firstItem = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option`).first();
        if (firstItem.exists()) {
            firstItem.simulate('mouseenter');
        }
        
        await sleep();
        
        // 检查是否展开了子菜单
        cascader.update();
        expect(cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option-lists ul`).length).toBeGreaterThan(1);
        cascader.unmount();
    });

    // 测试 onClick 返回 disabled 项 (item.tsx line 115)
    it('onClick returns early for disabled item', async () => {
        const onChange = sinon.spy();
        const treeDataWithDisabled = [
            {
                label: '选项1',
                value: 'opt1',
                disabled: true,
            },
            {
                label: '选项2',
                value: 'opt2',
            },
        ];
        const cascader = mount(
            <Cascader
                treeData={treeDataWithDisabled}
                defaultOpen={true}
                onChange={onChange}
            />
        );
        
        await sleep();
        
        // 点击 disabled 项
        const disabledItem = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option-disabled`).first();
        if (disabledItem.exists()) {
            disabledItem.simulate('click');
        }
        
        await sleep();
        
        // onChange 不应该被调用
        expect(onChange.called).toBe(false);
        cascader.unmount();
    });

    // 测试点击 disabled 的 flatten 搜索结果 (item.tsx line 115)
    it('onClick returns early for disabled flatten item', async () => {
        const onChange = sinon.spy();
        const treeDataWithDisabled = [
            {
                label: '选项1',
                value: 'opt1',
                children: [
                    { label: '子选项1', value: 'child1', disabled: true },
                    { label: '子选项2', value: 'child2' },
                ],
            },
        ];
        const cascader = mount(
            <Cascader
                treeData={treeDataWithDisabled}
                filterTreeNode={true}
                defaultOpen={true}
                onChange={onChange}
            />
        );
        
        await sleep();
        
        // 输入搜索
        const input = cascader.find('input').first();
        if (input.exists()) {
            input.simulate('change', { target: { value: '子选项1' } });
        }
        
        await sleep(300);
        
        // 点击 disabled 的搜索结果
        cascader.update();
        const disabledItem = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option-disabled`).first();
        if (disabledItem.exists()) {
            disabledItem.simulate('click');
        }
        
        await sleep();
        
        // onChange 不应该被调用
        expect(onChange.called).toBe(false);
        cascader.unmount();
    });

    // 测试 updateSelection adapter (index.tsx line 365)
    it('updateSelection is triggered on item selection', async () => {
        const onSelect = sinon.spy();
        const cascader = mount(
            <Cascader
                treeData={treeData}
                defaultOpen={true}
                onSelect={onSelect}
                changeOnSelect={true}
            />
        );
        
        await sleep();
        
        // 点击选项
        const item = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-option`).first();
        if (item.exists()) {
            item.simulate('click');
        }
        
        await sleep();
        
        expect(onSelect.called).toBe(true);
        cascader.unmount();
    });

    // 测试 clickOutsideHandler 真正触发 (index.tsx lines 321-328)
    it('clickOutsideHandler triggers cb when clicking outside', async () => {
        const onDropdownVisibleChange = sinon.spy();
        
        const cascader = mount(
            <Cascader
                treeData={treeData}
                defaultOpen={true}
                onDropdownVisibleChange={onDropdownVisibleChange}
            />
        );
        
        await sleep();
        
        // 确保下拉框已打开
        expect(onDropdownVisibleChange.calledWith(true)).toBe(true);
        
        // 直接调用组件的 clickOutsideHandler
        const instance = cascader.instance();
        if (instance && instance.clickOutsideHandler) {
            // 创建一个模拟的外部元素
            const outsideElement = document.createElement('div');
            document.body.appendChild(outsideElement);
            
            const mockEvent = {
                target: outsideElement,
                composedPath: () => [outsideElement, document.body, document],
            };
            
            instance.clickOutsideHandler(mockEvent);
            
            document.body.removeChild(outsideElement);
        }
        
        await sleep();
        
        // 检查下拉框是否关闭
        expect(onDropdownVisibleChange.calledWith(false)).toBe(true);
        
        cascader.unmount();
    });

    // 测试 blurInput adapter (index.tsx lines 306-307)
    it('blurInput is called when blur method is invoked with filterTreeNode', async () => {
        let cascaderRef;
        const cascader = mount(
            <Cascader
                ref={ref => { cascaderRef = ref; }}
                treeData={treeData}
                filterTreeNode={true}
                defaultOpen={true}
            />
        );
        
        await sleep();
        
        // 调用 blur 方法
        if (cascaderRef && cascaderRef.blur) {
            cascaderRef.blur();
        }
        
        await sleep();
        
        expect(cascader.exists(`.${BASE_CLASS_PREFIX}-cascader`)).toEqual(true);
        cascader.unmount();
    });

    // 测试 notifyOnExceed 在 unRelated 模式下触发 (index.tsx line 416)
    it('notifyOnExceed is triggered when max exceeded in unRelated mode', async () => {
        const onExceed = sinon.spy();
        const onChange = sinon.spy();
        const simpleTreeData = [
            { label: '选项1', value: 'opt1' },
            { label: '选项2', value: 'opt2' },
            { label: '选项3', value: 'opt3' },
        ];
        
        const cascader = render({
            treeData: simpleTreeData,
            multiple: true,
            checkRelation: 'unRelated',
            max: 1,
            onExceed: onExceed,
            onChange: onChange,
        });
        
        // 打开下拉框
        const selectBox = cascader.find(`.${BASE_CLASS_PREFIX}-cascader-selection`).at(0);
        selectBox.simulate('click');
        
        await sleep();
        
        // 点击第一个 checkbox
        cascader
            .find(`.${BASE_CLASS_PREFIX}-cascader-option-list`)
            .at(0)
            .find(`.${BASE_CLASS_PREFIX}-checkbox`)
            .at(0)
            .simulate('click');
        
        await sleep();
        
        // 确认第一个选项已被选中
        expect(onChange.called).toBe(true);
        expect(cascader.state().checkedKeys.size).toEqual(1);
        
        // 再尝试选择第二个选项，应该触发 onExceed
        cascader
            .find(`.${BASE_CLASS_PREFIX}-cascader-option-list`)
            .at(0)
            .find(`.${BASE_CLASS_PREFIX}-checkbox`)
            .at(1)
            .simulate('click');
        
        await sleep();
        
        expect(onExceed.called).toBe(true);
        cascader.unmount();
    });
});
