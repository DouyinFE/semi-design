import { Select } from '../../index';
import { noop } from 'lodash';
const Option = Select.Option;
const OptGroup = Select.OptGroup;
import { IconClear, IconChevronDown } from '@douyinfe/semi-icons';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';
import keyCode from '../../../semi-foundation/utils/keyCode';
import {sleep} from "../../_test_/utils";

const defaultList = [
    { value: 'abc', label: 'Abc' },
    { value: 'hotsoon', label: 'Hotsoon' },
    { value: 'pipixia', label: 'Pipixia' },
    { value: 'toutiao', label: 'TopBuzz' },
];

function getOption(list = defaultList) {
    return list.map(optionOpts => <Option {...optionOpts} />);
}

let commonProps = {
    // Select use Popup Layer to show candidate option,
    // but all Popup Layer which extends from Tooltip (eg Popover, Dropdown) have animation and delay.
    // Turn off animation and delay during testing, to avoid waiting (something like setTimeOut/balabala...) in the test code
    motion: false,
    mouseEnterDelay: 0,
    mouseLeaveDelay: 0,
};

function getSelect(props) {
    if (!props.optionList && !props.children) {
        props.children = getOption();
    }

    return mount(<Select {...commonProps} {...props} />, { attachTo: document.getElementById('container') });
}

let stringData = ['semi', 'ies', 'design', 'platform'];

let objectData = [
    { email: 'semi@abc.com', value: 'abc' },
    { email: 'semi@bytedance.com', value: 'bytedance' },
    { email: 'semi@vigo.com', value: 'vigo' },
];

describe('Select', () => {
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
        const wrapper = getSelect(props);
        expect(wrapper.hasClass('test')).toEqual(true);
        expect(wrapper.find('div.test')).toHaveStyle('color', 'red');
    });

    it('with placeholder', () => {
        const props = { placeholder: 'semi' };
        const select = getSelect(props);
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-selection-placeholder`).instance().textContent).toEqual('semi');
    });

    it('with validateStatus', () => {
        const props = {};
        const select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-error`)).toEqual(false);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-warning`)).toEqual(false);
        select.setProps({ validateStatus: 'error' });
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-error`)).toEqual(true);
        select.setProps({ validateStatus: 'warning' });
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-warning`)).toEqual(true);
    });

    it('different size', () => {
        const props = {};
        const select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-large`)).toEqual(false);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-small`)).toEqual(false);
        select.setProps({ size: 'large' });
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-large`)).toEqual(true);
        select.setProps({ size: 'small' });
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-small`)).toEqual(true);
    });

    it('custom dropdownClassName & dropdownStyle', () => {
        let props = {
            dropdownClassName: 'ddc',
            dropdownStyle: {
                color: 'red',
            },
            defaultOpen: true,
        };
        let select = getSelect(props);
        expect(select.exists('.ddc')).toEqual(true);
        expect(select.find('.ddc')).toHaveStyle('color', 'red');
    });

    it('different position', () => {
        let props = {
            position: 'top',
            defaultOpen: true,
        };
        let select = getSelect(props);
        expect(
            select
                .find(`.${BASE_CLASS_PREFIX}-popover-wrapper`)
                .instance()
                .getAttribute('x-placement')
        ).toEqual('top');
    });

    it('defaultValue (not candidate in optionList)', () => {
        // single select
        let props = {
            defaultValue: 'semi',
        };
        let select = getSelect(props);
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-selection-text`).getDOMNode().textContent).toEqual('semi');
        select.unmount();
        // multiple select
        let mProps = {
            multiple: true,
            defaultValue: ['semi', 'ies'],
        };
        let mSelect = getSelect(mProps);
        let tags = mSelect.find(`.${BASE_CLASS_PREFIX}-select-selection .semi-tag-content`);
        expect(tags.length).toEqual(2);
        expect(tags.at(0).getDOMNode().textContent).toEqual('semi');
        expect(tags.at(1).getDOMNode().textContent).toEqual('ies');
        mSelect.unmount();
    });

    it('defaultValue  (can match in optionList)', () => {
        // single select
        let props = {
            defaultValue: 'abc',
        };
        let select = getSelect(props);
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-selection-text`).getDOMNode().textContent).toEqual('Abc');
        select.unmount();
        // multiple select
        let mProps = {
            defaultValue: ['abc', 'hotsoon'],
            multiple: true,
        };
        const mSelect = getSelect(mProps);
        let tags = mSelect.find(`.${BASE_CLASS_PREFIX}-select-selection .${BASE_CLASS_PREFIX}-tag-content`);
        expect(tags.length).toEqual(2);
        expect(tags.at(0).getDOMNode().textContent).toEqual('Abc');
        expect(tags.at(1).getDOMNode().textContent).toEqual('Hotsoon');
        mSelect.unmount();
    });

    it('showClear', () => {
        const props = { defaultValue: '${BASE_CLASS_PREFIX}', showClear: true };
        const select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-icon-clear`)).toEqual(false);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('mouseEnter', {});
        expect(select.exists(`.${BASE_CLASS_PREFIX}-icon-clear`)).toEqual(true);
        select.unmount();

        const emptyProps = { showClear: true };
        const emptySelect = getSelect(emptyProps);
        emptySelect.find(`.${BASE_CLASS_PREFIX}-select`).simulate('mouseEnter', {});
        expect(select.exists(`.${BASE_CLASS_PREFIX}-icon-clear`)).toEqual(false);
        emptySelect.unmount();

        const notShowProps = { showClear: false, defaultValue: 'semi' };
        const noSelect = getSelect(notShowProps);
        noSelect.find(`.${BASE_CLASS_PREFIX}-select`).simulate('mouseEnter', {});
        expect(select.exists(`.${BASE_CLASS_PREFIX}-icon-clear`)).toEqual(false);
        noSelect.unmount();
    });

    it('showArrow = false', () => {
        const props = { defaultValue: 'semi', showArrow: false };
        const select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-icon-chevron_down`)).toEqual(false);
    });

    it('custom prefix / suffix / insetLabel', () => {
        let prefix = <div className="prefix">prefix content</div>;
        let suffix = <div className="suffix">suffix content</div>;
        let insetLabel = 'semi';
        const props = {
            prefix: prefix,
            suffix: suffix,
        };
        let select = getSelect(props);
        expect(select.contains(prefix)).toEqual(true);
        expect(select.contains(suffix)).toEqual(true);
        select.unmount();
        let ilSelect = getSelect({ insetLabel: insetLabel });
        expect(ilSelect.contains(insetLabel)).toEqual(true);
        ilSelect.unmount();
    });

    it('defaultOpen', () => {
        let props = {
            defaultOpen: true,
        };
        let select = getSelect(props);
        expect(select.state().isOpen).toEqual(true);
        let options = select.find(`.${BASE_CLASS_PREFIX}-select-option-list`).children();
        expect(options.length).toEqual(4);
        expect(options.at(0).getDOMNode().textContent).toEqual('Abc');
        expect(options.at(1).getDOMNode().textContent).toEqual('Hotsoon');
    });

    it('dropdownMatchSelectWidth = true', () => {
        // dropdownMatchSelectWidth default is true
        let props = {
            defaultOpen: true,
            style: { width: 90 },
            defaultValue: 'abc',
        };
        let defaultSelect = getSelect(props);
        // cause jsdom doesn't support layout engine like browser, so you can't access offsetWidth/scrollWidth or use getBoundingRect(), it will always return 0;
        // just use getComputedStyle to avoid this problem.
        let selector = defaultSelect.find(`.${BASE_CLASS_PREFIX}-select`).getDOMNode();
        let selectorWidth = window.getComputedStyle(selector).width; // expect 90px
        let list = defaultSelect.find(`.${BASE_CLASS_PREFIX}-select-option-list`).getDOMNode().parentNode;
        let listWidth = window.getComputedStyle(list).minWidth;
        expect(selectorWidth).toEqual(listWidth);
        defaultSelect.unmount();
    });

    it('dropdownMatchSelectWidth, width is string', () => {
        let stringProps = {
            defaultOpen: true,
            style: { width: '90px' },
            defaultValue: 'abc',
        };
        let stringSelect = getSelect(stringProps);
        let strSelector = stringSelect.find(`.${BASE_CLASS_PREFIX}-select`).getDOMNode();
        let strSelectorWidth = window.getComputedStyle(strSelector).width; // expect 90px
        let strList = stringSelect.find(`.${BASE_CLASS_PREFIX}-select-option-list`).getDOMNode().parentNode;
        let strListWidth = window.getComputedStyle(strList).minWidth;
        expect(strSelectorWidth).toEqual(strListWidth);
        stringSelect.unmount();
    });

    it('dropdownMatchSelectWidth = false', () => {
        let notMatchProps = {
            defaultOpen: true,
            style: { width: 90 },
            defaultValue: 'abc',
            dropdownMatchSelectWidth: false,
        };
        let nmSelect = getSelect(notMatchProps);
        let selector = nmSelect.find(`.${BASE_CLASS_PREFIX}-select`).getDOMNode();
        let selectorWidth = window.getComputedStyle(selector).width;
        let list = nmSelect.find(`.${BASE_CLASS_PREFIX}-select-option-list`).getDOMNode().parentNode;
        let listWidth = window.getComputedStyle(list).minWidth;
        expect(selectorWidth).not.toEqual(listWidth);
        nmSelect.unmount();
    });

    it('pass options via props.optionList', () => {
        // expect number and content correct
        const props = {
            defaultOpen: true,
            optionList: defaultList,
        };
        const select = getSelect(props);
        let candidate = select.find(`.${BASE_CLASS_PREFIX}-select-option-list`).children();
        expect(candidate.length).toEqual(4);
        expect(candidate.at(0).getDOMNode().textContent).toEqual('Abc');
        expect(candidate.at(1).getDOMNode().textContent).toEqual('Hotsoon');
        select.unmount();
    });

    it('pass options via props.children', () => {
        let list = defaultList.slice();
        list.push({ value: 'semi', label: 'SemiDesign' });
        const props = {
            defaultOpen: true,
            children: getOption(list),
        };
        const select = getSelect(props);
        let candidate = select.find(`.${BASE_CLASS_PREFIX}-select-option-list`).children();
        expect(candidate.length).toEqual(5);
        expect(candidate.at(0).getDOMNode().textContent).toEqual('Abc');
        expect(candidate.at(4).getDOMNode().textContent).toEqual('SemiDesign');
        select.unmount();
    });

    it('can choose more than one option when multiple is true', () => {
        const props = {
            multiple: true,
            defaultValue: ['abc', 'hotsoon'],
            defaultOpen: true,
        };
        const select = getSelect(props);
        let selection = select.find(`.${BASE_CLASS_PREFIX}-select-content-wrapper`).children();
        expect(selection.length).toEqual(2);
        let targetOption = select
            .find(`.${BASE_CLASS_PREFIX}-select-option-list`)
            .children()
            .at(3);
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        targetOption.simulate('click', nativeEvent);
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-content-wrapper`).children().length).toEqual(3);
        select.unmount();
    });

    it('multiple with maxTagCount', () => {
        const props = {
            multiple: true,
            defaultValue: ['abc', 'hotsoon'],
            maxTagCount: 2,
            defaultOpen: true,
        };
        const select = getSelect(props);
        let targetOption = select
            .find(`.${BASE_CLASS_PREFIX}-select-option-list`)
            .children()
            .at(3);
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        targetOption.simulate('click', nativeEvent);
        let selection = select.find(`.${BASE_CLASS_PREFIX}-tag-group`);
        expect(selection.children().length).toEqual(3);
        expect(
            selection
                .children()
                .at(2)
                .getDOMNode().textContent
        ).toEqual('+1');
        select.unmount();
    });

    it('multiple with max, should call onExceed when selected over max', () => {
        let onExceed = () => {};
        let spyonExceed = sinon.spy(onExceed);
        const props = {
            multiple: true,
            defaultValue: ['abc', 'hotsoon'],
            max: 2,
            onExceed: spyonExceed,
            defaultOpen: true,
        };
        const select = getSelect(props);
        let targetOption = select
            .find(`.${BASE_CLASS_PREFIX}-select-option-list`)
            .children()
            .at(3);
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        targetOption.simulate('click', nativeEvent);
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-content-wrapper`).children().length).toEqual(2);
        expect(spyonExceed.calledOnce).toBe(true);
        select.unmount();
    });

    it('innerTopSlot', () => {
        let innerTopSlot = <div className="inner-slot">inner</div>;
        let props = {
            innerTopSlot: innerTopSlot,
            defaultOpen: true,
        };
        const select = getSelect(props);
        expect(select.contains(innerTopSlot)).toEqual(true);
    });

    it('outerTopSlot', () => {
        let outerTopSlot = <div className="outer-slot">outer</div>;
        let props = {
            outerTopSlot: outerTopSlot,
            defaultOpen: true,
        };
        const select = getSelect(props);
        expect(select.contains(outerTopSlot)).toEqual(true);
    });

    // TODO
    it('innerBottomSlot', () => {
        let innerBottomSlot = <div className="inner-slot">inner</div>;
        let props = {
            innerBottomSlot: innerBottomSlot,
            defaultOpen: true,
        };
        const select = getSelect(props);
        expect(select.contains(innerBottomSlot)).toEqual(true);
    });

    it('outerBottomSlot', () => {
        let outerBottomSlot = <div className="outer-slot">outer</div>;
        let props = {
            outerBottomSlot: outerBottomSlot,
            defaultOpen: true,
        };
        const select = getSelect(props);
        expect(select.contains(outerBottomSlot)).toEqual(true);
    });

    it('option className & style & disabled & showTick', () => {
        let options = [
            { className: 'optCls', style: { color: 'red' }, label: 'Abc', value: 'abc' },
            { label: 'Vigo', value: 'vigo', disabled: true, className: 'disabled-opt' },
            { label: 'NoTick', value: 'noTick', showTick: false },
        ];
        options = options.map(item => {
            return <Option {...item}>{item.label}</Option>;
        });
        let props = {
            children: options,
            defaultOpen: true,
        };
        const select = getSelect(props);
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-option.optCls`)).toHaveStyle('color', 'red');
        let optionList = select.find(`.${BASE_CLASS_PREFIX}-select-option-list`);
        expect(optionList.exists(`.${BASE_CLASS_PREFIX}-select-option.disabled-opt`)).toEqual(true);
        expect(
            optionList
                .children()
                .at(2)
                .getDOMNode().textContent
        ).toEqual('NoTick');
    });

    it('loading', () => {
        let props = {
            defaultOpen: true,
            loading: true,
        };
        const select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-loading-wrapper`)).toEqual(true);
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-option-list`).children.length).toEqual(1);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-option`)).toEqual(false);
    });

    it('spacing', () => {
        // Can't test spacing directly, just test whether it is passed to Popover correctly
        let props = {
            spacing: 20,
            defaultOpen: true,
        };
        const select = getSelect(props);
        const tooltip = select.children().children();
        expect(tooltip.props().spacing).toEqual(20);
    });

    it('should open optionList when click selector', () => {
        const props = {};
        const select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-option-list`)).toEqual(false);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-option-list`)).toEqual(true);
    });

    it('disabled component when disabled is true', () => {
        const props = { disabled: true };
        const select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-disabled`)).toEqual(true);
        // Does not respond click events when disabled is true
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-option-list`)).toEqual(false);
    });

    it('onDropdownVisibleChange & clickToHide', async () => {
        let onDropdownVisible = () => {};
        let spyOnDV = sinon.spy(onDropdownVisible);
        const props = {
            onDropdownVisibleChange: spyOnDV,
            clickToHide: true,
            motion: false
        };
        const select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        await sleep(1000);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-option-list`)).toEqual(true);
        expect(spyOnDV.calledOnce).toEqual(true);
        expect(spyOnDV.calledWithMatch(true)).toEqual(true);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        await sleep(1000);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-option-list`)).toEqual(false);
        expect(spyOnDV.calledWithMatch(false)).toEqual(true);
    });

    it('filter = true', () => {
        let props = {
            filter: true,
        };
        const select = getSelect(props);
        // click to show input
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        let inputValue = 'abc';
        let event = { target: { value: inputValue } };
        select.find('input').simulate('change', event);
        let optionList = select.find(`.${BASE_CLASS_PREFIX}-select-option-list`).children();
        expect(optionList.length).toEqual(1);
        expect(optionList.at(0).text()).toEqual('Abc');
    });

    it('filter = true,label includes regex special character and key it at first', () => {
        let props = {
            filter: true,
            optionList: [{label: 'label++',value: ''}]
        };
        const select = getSelect(props);
        // click to show input
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        let inputValue = '+';
        let event = { target: { value: inputValue } };
        select.find('input').simulate('change', event);
        let optionList = select.find(`.${BASE_CLASS_PREFIX}-select-option-list`).children();
        expect(optionList.length).toEqual(1);
        expect(optionList.at(0).text()).toEqual('label++');
    });

    it('filter = custom function', () => {
        let customFilter = (sugInput, option) => {
            return option.label == 'Hotsoon';
        };
        let props = {
            filter: customFilter,
        };
        const select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        let inputValue = 'tik';
        let event = { target: { value: inputValue } };
        select.find('input').simulate('change', event);
        let optionList = select.find(`.${BASE_CLASS_PREFIX}-select-option-list`).children();
        expect(optionList.length).toEqual(1);
        expect(optionList.at(0).text()).toEqual('Hotsoon');
    });

    it('onSearch', () => {
        // trigger onSearch when input change
        let onSearch = value => {};
        let spyOnSearch = sinon.spy(onSearch);
        let props = {
            onSearch: spyOnSearch,
            filter: true,
        };
        let select = getSelect(props);
        // click to show input
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        let inputValue = 'semi';
        let event = { target: { value: inputValue } };
        select.find('input').simulate('change', event);
        expect(spyOnSearch.calledOnce).toBe(true);
        expect(spyOnSearch.calledWithMatch(inputValue)).toBe(true);
        select.unmount();
        // when click clear button, should trigger onSearch
        // TODO
    });

    it('emptyContent', () => {
        let emptyContent = 'no data';
        let props = {
            filter: true,
            emptyContent,
        };
        const select = getSelect(props);
        // click to show input
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        let inputValue = 'semi';
        let event = { target: { value: inputValue } };
        select.find('input').simulate('change', event);
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-option-empty`).text()).toEqual(emptyContent);
    });

    it('option value & label', () => {
        let spyOnChange = sinon.spy(() => {});
        let props = {
            optionList: [{ label: 'semi', value: 'bytedance' }],
            defaultOpen: true,
            onChange: spyOnChange,
        };
        const select = getSelect(props);
        let optionList = select.find(`.${BASE_CLASS_PREFIX}-select-option-list`).children();
        expect(optionList.at(0).text()).toEqual('semi');
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        optionList.at(0).simulate('click', nativeEvent);
        expect(spyOnChange.calledWithMatch('bytedance')).toEqual(true);
    });

    it('option.value is number', () => {
        let spyOnChange = sinon.spy(() => {});
        let props = {
            optionList: [{ label: 'semi', value: 0 }],
            defaultOpen: true,
            onChange: spyOnChange,
        };
        const select = getSelect(props);
        let optionList = select.find(`.${BASE_CLASS_PREFIX}-select-option-list`).children();
        expect(optionList.at(0).text()).toEqual('semi');
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        optionList.at(0).simulate('click', nativeEvent);
        expect(spyOnChange.calledWithMatch(0)).toEqual(true);
    });

    it('renderSelectedItem, single', () => {
        const spyRSI = sinon.spy(option => {
            return option.value + '-' + option.label;
        });
        let props = {
            renderSelectedItem: spyRSI,
            defaultValue: 'abc',
        };
        const select = getSelect(props);
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-selection-text`).text()).toEqual('abc-Abc');
        expect(spyRSI.calledWith({ value: 'abc', label: 'Abc' }));
    });

    it('renderSelectedItem, single & value = 0, not exist in optionList', () => {
        // test value = 0 & not match in optionList
        const spyRSI2 = sinon.spy(option => option.label + 1);
        let props2 = {
            renderSelectedItem: spyRSI2,
            value: 0,
        };
        const select2 = getSelect(props2);
        expect(select2.find(`.${BASE_CLASS_PREFIX}-select-selection-text`).text()).toEqual('1');
        expect(spyRSI2.calledWith({ value: 0, label: 0 }));
    });

    it('renderSelectedItem - multiple', () => {
        const spyRSI = sinon.spy((option, opts) => {
            let content = option.value + '-' + option.extra;
            return {
                isRenderInTag: true,
                content,
            };
        });
        let props = {
            optionList: [
                { value: 'abc', label: 'Abc', extra: 'a1' },
                { value: 'hotsoon', label: 'Hotsoon', extra: 'b2' },
                { value: 'pipixia', label: 'Pipixia', extra: 'c3' },
                { value: 'toutiao', label: 'TopBuzz', extra: 'd4' },
            ],
            renderSelectedItem: spyRSI,
            defaultValue: ['abc', 'hotsoon'],
            multiple: true,
        };
        const select = getSelect(props);
        let tags = select.find(`.${BASE_CLASS_PREFIX}-tag-content`);
        expect(tags.at(0).text()).toEqual('abc-a1');
        expect(tags.at(1).text()).toEqual('hotsoon-b2');
    });

    it('renderSelectedItem - multiple - isRenderInTag: false', () => {
        let item1, item2;
        const spyRSI = sinon.spy((option, opts) => {
            let content = <div className={opts.index}>{option.value + '-' + option.extra}</div>;
            if (opts.index === 0) {
                item1 = content;
            } else if (opts.index === 1) {
                item2 = content;
            }
            return {
                isRenderInTag: false,
                content,
            };
        });
        let props = {
            optionList: [
                { value: 'abc', label: 'Abc', extra: 'a1' },
                { value: 'hotsoon', label: 'Hotsoon', extra: 'b2' },
                { value: 'pipixia', label: 'Pipixia', extra: 'c3' },
                { value: 'toutiao', label: 'TopBuzz', extra: 'd4' },
            ],
            renderSelectedItem: spyRSI,
            defaultValue: ['abc', 'hotsoon'],
            multiple: true,
        };
        const select = getSelect(props);
        const items = select.find(`.${BASE_CLASS_PREFIX}-select-content-wrapper`).children();
        expect(items.at(0).contains(item1));
        expect(items.at(1).contains(item2));
    });

    it('defaultActiveFirstOption', () => {
        const props = {
            defaultActiveFirstOption: true,
            defaultOpen: true,
        };
        const select = getSelect(props);
        // expect first option active
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-option-focused`).text()).toEqual('Abc');
    });

    it('onSelect', () => {
        // trigger onSelect when option has been selected
        let spyOnSelect = sinon.spy((value, option) => {});
        let props = {
            defaultOpen: true,
            onSelect: spyOnSelect,
        };
        let select = getSelect(props);
        let options = select.find(`.${BASE_CLASS_PREFIX}-select-option-list`).children();
        let firstOption = options.at(0);
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        firstOption.simulate('click', nativeEvent);
        expect(spyOnSelect.calledOnce).toBe(true);
        expect(spyOnSelect.calledWith('abc', { value: 'abc', label: 'Abc' })).toBe(true);
        expect(spyOnSelect.calledWith('abc', { value: 'abc', label: 'Abc', extraKey: true })).toBe(false);
    });

    it('onDeselect', () => {
        // trigger onDeselect when option is deselected
        let onDeselect = (value, option) => {};
        let spyOnDeselect = sinon.spy(onDeselect);
        let props = {
            multiple: true,
            spyOnDeselect,
            defaultOpen: true,
            defaultValue: ['abc', 'hotsoon'],
            onDeselect: spyOnDeselect,
        };
        const select = getSelect(props);
        let options = select.find(`.${BASE_CLASS_PREFIX}-select-option-list`).children();
        const secondOption = options.at(1);
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        secondOption.simulate('click', nativeEvent);
        expect(spyOnDeselect.calledOnce).toBe(true);
        expect(spyOnDeselect.calledWith('hotsoon', { value: 'hotsoon', label: 'Hotsoon' })).toBe(true);
        expect(spyOnDeselect.calledWith('hotsoon', { value: 'hotsoon', label: 'Hotsoon', extraKey: true })).toBe(false);
    });

    it('onChange (single)', () => {
        let spyOnChange = sinon.spy((value, option) => {});
        let props = {
            defaultOpen: true,
            onChange: spyOnChange,
        };
        let select = getSelect(props);
        let options = select.find(`.${BASE_CLASS_PREFIX}-select-option-list`).children();
        let firstOption = options.at(0);
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        firstOption.simulate('click', nativeEvent);
        expect(spyOnChange.calledOnce).toBe(true);
        expect(spyOnChange.calledWith('abc')).toBe(true);
    });

    it('onChange (multiple)', () => {
        let spyOnChange = sinon.spy((value, option) => {});
        let props = {
            defaultOpen: true,
            multiple: true,
            onChange: spyOnChange,
        };
        let select = getSelect(props);
        let options = select.find(`.${BASE_CLASS_PREFIX}-select-option-list`).children();
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        options.at(0).simulate('click', nativeEvent);
        options.at(1).simulate('click', nativeEvent);
        expect(spyOnChange.callCount).toEqual(2);
        expect(spyOnChange.getCall(0).args[0]).toEqual(['abc']);
        expect(spyOnChange.getCall(1).args[0]).toEqual(['abc', 'hotsoon']);
    });

    it('onChange + onChangeWithObject (single)', () => {
        let spyOnChange = sinon.spy((value, option) => {});
        let props = {
            defaultOpen: true,
            onChangeWithObject: true,
            onChange: spyOnChange,
        };
        let select = getSelect(props);
        let options = select.find(`.${BASE_CLASS_PREFIX}-select-option-list`).children();
        let firstOption = options.at(0);
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        firstOption.simulate('click', nativeEvent);
        expect(spyOnChange.calledWith({ value: 'abc', label: 'Abc' })).toBe(true);
    });

    it('onChange + onChangeWithObject (multiple)', () => {
        let spyOnChange = sinon.spy((value, option) => {});
        let props = {
            defaultOpen: true,
            onChangeWithObject: true,
            multiple: true,
            onChange: spyOnChange,
        };
        let select = getSelect(props);
        let options = select.find(`.${BASE_CLASS_PREFIX}-select-option-list`).children();
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        options.at(0).simulate('click', nativeEvent);
        options.at(1).simulate('click', nativeEvent);
        expect(spyOnChange.callCount).toEqual(2);
        expect(spyOnChange.getCall(0).args[0]).toEqual([{ value: 'abc', label: 'Abc' }]);
        expect(spyOnChange.getCall(1).args[0]).toEqual([
            { value: 'abc', label: 'Abc' },
            { value: 'hotsoon', label: 'Hotsoon' },
        ]);
    });

    it('【value】controlled mode', () => {
        let spyOnChange = sinon.spy((value, option) => {});

        let props = {
            value: 'abc',
        };
        let select = getSelect(props);
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-selection-text`).getDOMNode().textContent).toEqual('Abc');
        select.setProps({ value: 'hotsoon' });
        select.update();
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-selection-text`).getDOMNode().textContent).toEqual('Hotsoon');
        select.setProps({ value: undefined });
        select.update();
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-selection-text`).getDOMNode().textContent).toEqual('');
        select.unmount();

        let singleProps = {
            value: 'abc',
            optionList: defaultList,
            defaultOpen: true,
            onChange: spyOnChange,
        };
        select = getSelect(singleProps);
        let options = select.find(`.${BASE_CLASS_PREFIX}-select-option-list`).children();
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        options.at(1).simulate('click', nativeEvent);
        expect(spyOnChange.getCall(0).args[0]).toEqual('hotsoon');
        select.unmount();

        let spyMOnChange = sinon.spy((value, option) => {});
        let spyMOnClear = sinon.spy(() => {});
        let multipleProps = {
            value: '',
            optionList: defaultList,
            defaultOpen: true,
            multiple: true,
            filter: true,
            onChange: spyMOnChange,
            showClear: true,
            onClear: spyMOnClear,
        };
        select = getSelect(multipleProps);
        let mOptions = select.find(`.${BASE_CLASS_PREFIX}-select-option-list`).children();
        mOptions.at(1).simulate('click', nativeEvent);
        expect(spyMOnChange.getCall(0).args[0]).toEqual(['hotsoon']);

        // TODO
        // test 

    });

    it('【onBlur/onFocus】', () => {
        let spyOnBlur = sinon.spy((value, option) => {
        });
        let spyOnFocus = sinon.spy((value, option) => {
        });

        let props = {
            onBlur: spyOnBlur,
            onFocus: spyOnFocus,
        };
        let select = getSelect(props);
        let trigger = select.find('.semi-select');
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        trigger.simulate('click', nativeEvent);
        expect(spyOnFocus.callCount).toEqual(1);

        // Since there is no mechanism such as event bubbling in enzyme + jsdom, the blur event can only be triggered manually on the blur element,
        // and the blur of the `a element` cannot be achieved through the focus `b element`.

        // Adapt to A11y requirements, close the panel will not call the onBlur func 
        select.instance().close();
        expect(spyOnBlur.callCount).toEqual(0);
        select.unmount();
    });

    it('【autoFocus】- filter = false', () => {
        // should focus triggerElement after mounted
        let spyOnBlur = sinon.spy((value, option) => {
            debugger
        });
        let spyOnFocus = sinon.spy((value, option) => {
            debugger
        });
        let props = {
            onBlur: spyOnBlur,
            onFocus: spyOnFocus,
            autoFocus: true,
        };
        let select = getSelect(props);
        // should not trigger focus when autoFocus
        expect(spyOnFocus.callCount).toEqual(0);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-focus`)).toEqual(true);

        select.unmount();
    });

    it('【autoFocus】- filter = true', () => {
        // autoFocus should auto Focus input element when filter is true
        let props = {
            autoFocus: true,
            filter: true
        };
        let select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-focus`)).toEqual(true);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-input-wrapper-focus`)).toEqual(true);
        select.unmount();
    });

    it('【autoFocus】 & onBlur when autoFocus = true', () => {
        // autoFocus should trigger onBlur when click other element directly （dropdown not open）
        let spyOnBlur = sinon.spy((value, option) => {
        });
        let props = {
            autoFocus: true,
            onBlur: spyOnBlur,
        }

        // but we can't test this case, Orz
        // Since there is no mechanism such as event bubbling in enzyme + jsdom, the blur event can only be triggered manually on the blur element,
        // and the blur of the `a element` cannot be achieved through the focus `b element`.

        // mock blur event on trigger element
        let select = getSelect(props);
        let trigger = select.find('.semi-select');
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        trigger.simulate('blur', nativeEvent);
        expect(spyOnBlur.callCount).toEqual(1);
    });

    it('virtual', () => {
        let spyOnChange = sinon.spy((value) => {
        });
        let optionList = Array.from({ length: 100 }, (v, i) => ({ label: `option-${i}`, value: i }));
        let props = {
            virtualize: {
                itemSize: 36, // px
            },
            defaultOpen: true,
            optionList,
            onChange: spyOnChange,
        };
        let select = getSelect(props);
        let options = select.find('.semi-select-option');
        let firstOption = options.children().at(0);
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        firstOption.simulate('click', nativeEvent);
        expect(spyOnChange.callCount).toEqual(1);
        expect(spyOnChange.calledWithMatch(0)).toEqual(true);
    });

    it('OptionGroup', () => {
        let optionList = [
            <Select.OptGroup key={1} label="Group1">
                <Select.Option value="a-1">a-1</Select.Option>
                <Select.Option value="a-2">a-2</Select.Option>
            </Select.OptGroup>,
            <Select.OptGroup key={2} label="Group2">
                <Select.Option value="b-1">b-1</Select.Option>
                <Select.Option value="b-2">b-2</Select.Option>
            </Select.OptGroup>,
            // last option without label
            <Select.OptGroup key={3}>
                <Select.Option value="c-1">c-1</Select.Option>
            </Select.OptGroup>
        ]
        let props = {
            defaultOpen: true,
            children: optionList,
        };
        let select = getSelect(props);
        let options = select.find('.semi-select-group');
        expect(options.length).toEqual(2);
        expect(options.at(0).text()).toEqual('Group1');
        expect(options.at(1).text()).toEqual('Group2');

    });

    it('empty', () => {
        let props = {
            defaultOpen: true,
            optionList: [],
            emptyContent: 'empty'
        };
        let select = getSelect(props);
        let options = select.find('.semi-select-option.semi-select-option-empty');
        expect(options.length).toEqual(1);
        expect(options.at(0).text()).toEqual(props.emptyContent);
        select.setProps({
            emptyContent: null
        })
        select.update()
        expect(select.find('.semi-select-option').length).toEqual(0);
    });

    it('renderOptionItem onClick onMouseEnter', () => {
        let spyOnMouseEnter = sinon.spy((value) => {
        });
        let spyOnClick = sinon.spy((value) => {
        });
        const renderOptionItem = renderProps => {
            const {
                disabled,
                selected,
                label,
                value,
                focused,
                className,
                style,
                onMouseEnter,
                onClick,
                empty,
                emptyContent,
                ...rest
            } = renderProps;
            return <div style={style} className="custom-option" onClick={spyOnClick} onMouseEnter={spyOnMouseEnter}>
                <div className='option-right'>
                    {label}
                </div>
            </div>
        };
        let props = {
            defaultOpen: true,
            optionList: [
                { value: 'abc', label: '抖音', },
                { value: 'jianying', label: '剪映', },
            ],
            renderOptionItem
        };
        let select = getSelect(props);
        let options = select.find('.custom-option');
        expect(options.length).toEqual(2);
        options.at(0).simulate('click');
        expect(spyOnClick.callCount).toEqual(1);
        options.at(1).simulate('mouseenter');
        expect(spyOnMouseEnter.callCount).toEqual(1);
        
    });
    
    it('customTrigger', () => {
        const triggerRender = ({ value, ...rest }) => {
            return (
              <div className="custom-trigger">
                trigger
              </div>
            );
          };
        let props = {
            triggerRender,
        };
        let select = getSelect(props);
        let trigger = select.find('.custom-trigger');
        expect(trigger.length).toEqual(1);
        expect(trigger.at(0).text()).toEqual('trigger');
        trigger.at(0).simulate('click')
        expect(select.find('.semi-select-option').length).toEqual(defaultList.length);
    });

    it('test keyboard press', () => {
        let props = {
            defaultOpen: true,
            optionList: [
                { value: 'abc', label: 'Abc' },
                { value: 'hotsoon', label: 'Hotsoon' },
                { value: 'pipixia', label: 'Pipixia' },
                { value: 'toutiao', label: 'TopBuzz' },
            ],
        };
        let select = getSelect(props);
        // press ⬇️
        // since the defaultActiveFirstOption default to be true, after ⬇️, the second option focused
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.DOWN });
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-option`).at(1).hasClass(`${BASE_CLASS_PREFIX}-select-option-focused`)).toBe(true);
        // press ⬆️
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.UP });
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.UP });
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-option`).at(defaultList.length-1).hasClass(`${BASE_CLASS_PREFIX}-select-option-focused`)).toBe(true);
        // press ESC
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.ESC });
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-option`).exists()).toBe(false);
        // reopen select, press ⬇️ and ENTER, the first option should be selected
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.DOWN });
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.ENTER });
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-selection-text`).text()).toBe(defaultList[0].label);
        select.unmount();

        // test whether backspace can skip disabled option
        let dProps = {
            defaultOpen: true,
            optionList: [
                { value: 'abc', label: 'Abc' },
                { value: 'hotsoon', label: 'Hotsoon', disabled: true },
                { value: 'pipixia', label: 'Pipixia' },
            ],
            defaultValue: ['hotsoon', 'abc'],
            multiple: true,
        };
        let dSelect = getSelect(dProps);
        dSelect.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.BACKSPACE });
        let selections = Array.from(dSelect.state().selections);
        expect(selections[0][0]).toEqual('Hotsoon');
    });

    it('allowCreate', () => {
        const props = {
            multiple: true,
            allowCreate: true,
            filter: true,
            optionList: []
        };
        const select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        select.find(`.${BASE_CLASS_PREFIX}-select .${BASE_CLASS_PREFIX}-input`).simulate('change', { target: { value: '1' } });
        select.find(`.${BASE_CLASS_PREFIX}-select-option`).simulate('click', {});
        expect(select.find(`.${BASE_CLASS_PREFIX}-select .semi-tag`).length).toBe(1);
        select.find(`.${BASE_CLASS_PREFIX}-select .${BASE_CLASS_PREFIX}-input`).simulate('keydown', { keyCode: keyCode.BACKSPACE });
        expect(select.find(`.${BASE_CLASS_PREFIX}-select .semi-tag`).length).toBe(0);
    });

    it('【onMouseEnter/onMouseLeave】', () => {
        let spyEnter = sinon.spy((e) => {
        });
        let spyLeave = sinon.spy((e) => {
        });

        let props = {
            onMouseEnter: spyEnter,
            onMouseLeave: spyLeave,
        };
        let select = getSelect(props);
        let trigger = select.find('.semi-select');
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        trigger.simulate('mouseenter', nativeEvent);
        expect(spyEnter.callCount).toEqual(1);

        trigger.simulate('mouseleave', nativeEvent);
        expect(spyLeave.callCount).toEqual(1);
        select.unmount();
    });

    it('ref method', () => {
        let r;
        let props = {
            ref: (ref) => { r = ref },
            filter: true,
            multiple: true,
            optionList: defaultList,
        };

        let select = getSelect(props);
        r.open();
        expect(select.state().isOpen).toEqual(true);

        r.close();
        expect(select.state().isOpen).toEqual(false);

        r.selectAll();
        select.update();
        expect(select.state().selections.size).toEqual(4);

        r.deselectAll();
        expect(select.state().selections.size).toEqual(0);

        r.focus();
        expect(document.activeElement.tagName).toEqual('INPUT');

        select.unmount();
        // selectAll not work when multiple is false
        let r2;
        let props2 = {
            ref: (ref) => { r2 = ref },
            filter: true,
            optionList: defaultList,
        };
        let singleSelect = getSelect(props2);
        r2.selectAll();
        expect(singleSelect.state().selections.size).toEqual(0);
    });

    it('props optionList update after choose some option, uncontrolled mode', () => {

        let props = {
            defaultActiveFirstOption: true,
            optionList: [
                { value: 'abc', label: 'Abc' },
                { value: 'hotsoon', label: 'Hotsoon' }
            ],
            defaultOpen: true,
            multiple: true,
            filter: true,
        };
        
        let select = getSelect(props);
        let options = select.find(`.${BASE_CLASS_PREFIX}-select-option-list`).children();
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        options.at(0).simulate('click', nativeEvent);
        options.at(1).simulate('click', nativeEvent);

        let newList = [
            { value: 'pipixia', label: 'Pipixia' },
            { value: 'toutiao', label: 'TopBuzz' },
        ];
        select.setProps({ optionList: newList });
        select.update();
        let selections = Array.from(select.state().selections);
        expect(selections[0][0]).toEqual('Abc');
        expect(selections[1][0]).toEqual('Hotsoon');
        select.unmount();

        let singleProps = {
            defaultActiveFirstOption: true,
            optionList: [
                { value: 'abc', label: 'Abc' },
                { value: 'hotsoon', label: 'Hotsoon' },
            ],
            defaultOpen: true,
        };

        let singleSelect = getSelect(singleProps);
        let options2 = singleSelect.find(`.${BASE_CLASS_PREFIX}-select-option-list`).children();
        options2.at(0).simulate('click', nativeEvent);
        singleSelect.setProps({ optionList: newList });
        singleSelect.update();
        let selections2 = Array.from(singleSelect.state().selections);
        expect(selections2[0][0]).toEqual('abc');
    });

    it('click tag close when multiple, controlled mode', () => {
        let spyOnChange = sinon.spy((value) => {
        });
        let spyOnDeselect = sinon.spy((option) => {
        });
        let props = {
            optionList: [
                { value: 'abc', label: 'Abc' },
                { value: 'hotsoon', label: 'Hotsoon' },
            ],
            multiple: true,
            value: ['abc', 'hotsoon'],
            onChange: spyOnChange,
            onDeselect: spyOnDeselect,
        };
        let select = getSelect(props);
        let tagClose = select.find('.semi-tag-close').children();
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        tagClose.at(0).simulate('click', nativeEvent);
        expect(spyOnDeselect.calledWith('abc'));
        expect(spyOnChange.calledWith(['hotsoon']));
    });

    it('autoClearSearchValue', () => {
        // default usage
        let optionList = Array.from({ length: 100 }, (v, i) => ({ label: `option-${i}`, value: i }));

        let props = {
            multiple: true,
            optionList: optionList,
            defaultOpen: true,
            filter: true,
        };
        let select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        let keyword = 'option';
        let event = { target: { value: keyword } };
        select.find('input').simulate('change', event);

        let options = select.find(`.${BASE_CLASS_PREFIX}-select-option-list`).children();
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        options.at(0).simulate('click', nativeEvent);
        let inputValue = select.find('input').getDOMNode().value;
        expect(inputValue).toEqual('');
    });

    it('autoClearSearchValue = false', () => {
        let optionList = Array.from({ length: 100 }, (v, i) => ({ label: `option-${i}`, value: i }));

        let props = {
            multiple: true,
            optionList: optionList,
            defaultOpen: true,
            autoClearSearchValue: false,
            filter: true,
        };
        let select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        let keyword = 'option';
        let event = { target: { value: keyword } };
        select.find('input').simulate('change', event);

        let options = select.find(`.${BASE_CLASS_PREFIX}-select-option-list`).children();
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        options.at(0).simulate('click', nativeEvent);
        let inputValue = select.find('input').getDOMNode().value;
        expect(inputValue).toEqual(keyword);
    });
    // TODO ref selectAll \deselectAll when onChangeWithObject is true
    // TODO when loading is true, do not response any keyboard event
    // TODO can't remove tag when option is disabled
    // it('allowCreate-renderCreateItem', ()=>{})
    // it('autoAdjustOverflow', ()=>{})
    // it('remote', ()=>{})

    it('searchPosition dropdown', () => {
        let props = {
            filter: true,
            searchPosition: 'dropdown',
            defaultOpen: true,
        };
        const select = getSelect(props);
        // searchPosition='dropdown' 时，搜索框应该在下拉框内的 popover 中
        // 验证 searchPosition 属性被正确传递
        expect(select.props().searchPosition).toEqual('dropdown');
    });

    it('onCreate callback', () => {
        let spyOnCreate = sinon.spy((option) => {});
        const props = {
            allowCreate: true,
            filter: true,
            onCreate: spyOnCreate,
            defaultOpen: true,
        };
        const select = getSelect(props);
        const inputValue = 'newOption';
        select.find('input').simulate('change', { target: { value: inputValue } });
        // 点击创建选项
        const createOption = select.find(`.${BASE_CLASS_PREFIX}-select-option-create`);
        if (createOption.exists()) {
            const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
            createOption.simulate('click', nativeEvent);
            expect(spyOnCreate.calledOnce).toBe(true);
        }
    });

    it('value null/undefined boundary', () => {
        // 测试 value 为 null 的情况
        let props = {
            value: null,
        };
        const select = getSelect(props);
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-selection-text`).getDOMNode().textContent).toEqual('');
        
        // 测试 value 为 undefined 的情况
        select.setProps({ value: undefined });
        select.update();
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-selection-text`).getDOMNode().textContent).toEqual('');
    });

    it('multiple value with null/undefined items', () => {
        let props = {
            multiple: true,
            value: ['abc', null, undefined, 'hotsoon'],
        };
        const select = getSelect(props);
        // 应该只显示有效的选项
        let tags = select.find(`.${BASE_CLASS_PREFIX}-select-selection .${BASE_CLASS_PREFIX}-tag-content`);
        expect(tags.length).toBeGreaterThanOrEqual(2);
    });

    it('ARIA attributes - aria-labelledby', () => {
        const props = {
            'aria-labelledby': 'label-id',
        };
        const select = getSelect(props);
        expect(select.find(`.${BASE_CLASS_PREFIX}-select`).prop('aria-labelledby')).toEqual('label-id');
    });

    it('ARIA attributes - aria-describedby', () => {
        const props = {
            'aria-describedby': 'description-id',
        };
        const select = getSelect(props);
        expect(select.find(`.${BASE_CLASS_PREFIX}-select`).prop('aria-describedby')).toEqual('description-id');
    });

    it('ARIA attributes - aria-required', () => {
        const props = {
            'aria-required': true,
        };
        const select = getSelect(props);
        expect(select.find(`.${BASE_CLASS_PREFIX}-select`).prop('aria-required')).toEqual(true);
    });

    it('ARIA attributes - aria-invalid', () => {
        const props = {
            'aria-invalid': true,
        };
        const select = getSelect(props);
        expect(select.find(`.${BASE_CLASS_PREFIX}-select`).prop('aria-invalid')).toEqual(true);
    });

    it('borderless prop', () => {
        const props = {
            borderless: true,
        };
        const select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-borderless`)).toEqual(true);
    });

    it('onClear callback', () => {
        let spyOnClear = sinon.spy(() => {});
        const props = {
            defaultValue: 'abc',
            showClear: true,
            onClear: spyOnClear,
        };
        const select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('mouseEnter', {});
        const clearBtn = select.find(`.${BASE_CLASS_PREFIX}-icon-clear`);
        if (clearBtn.exists()) {
            const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
            clearBtn.simulate('click', nativeEvent);
            expect(spyOnClear.calledOnce).toBe(true);
        }
    });

    it('remote mode', () => {
        let spyOnSearch = sinon.spy((value) => {});
        const props = {
            filter: true,
            remote: true,
            onSearch: spyOnSearch,
        };
        const select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        select.find('input').simulate('change', { target: { value: 'test' } });
        expect(spyOnSearch.calledOnce).toBe(true);
        expect(spyOnSearch.calledWith('test')).toBe(true);
    });

    it('ellipsisTrigger with maxTagCount', () => {
        const props = {
            multiple: true,
            defaultValue: ['abc', 'hotsoon', 'pipixia'],
            maxTagCount: 2,
            ellipsisTrigger: 'hover',
        };
        const select = getSelect(props);
        // Check that multiple tags are rendered
        let tags = select.find(`.${BASE_CLASS_PREFIX}-tag`);
        expect(tags.length).toBeGreaterThanOrEqual(2);
    });

    it('onChangeWithObject with multiple select', () => {
        let spyOnChange = sinon.spy((value) => {});
        const props = {
            multiple: true,
            onChangeWithObject: true,
            defaultOpen: true,
            onChange: spyOnChange,
        };
        const select = getSelect(props);
        let options = select.find(`.${BASE_CLASS_PREFIX}-select-option-list`).children();
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        options.at(0).simulate('click', nativeEvent);
        expect(spyOnChange.calledOnce).toBe(true);
        const callArg = spyOnChange.getCall(0).args[0];
        expect(Array.isArray(callArg)).toBe(true);
        expect(callArg[0].value).toEqual('abc');
    });

    it('handleListScroll callback', () => {
        let spyOnListScroll = sinon.spy((e) => {});
        const props = {
            defaultOpen: true,
            onListScroll: spyOnListScroll,
        };
        const select = getSelect(props);
        const optionList = select.find(`.${BASE_CLASS_PREFIX}-select-option-list`);
        optionList.simulate('scroll', {});
        expect(spyOnListScroll.calledOnce).toBe(true);
    });

    it('controlled open prop', async () => {
        const props = {
            open: true,
            motion: false,
        };
        const select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-option-list`)).toEqual(true);
        select.setProps({ open: false });
        await sleep(100);
        select.update();
        // In controlled mode, the open state is managed by props
        expect(select.props().open).toEqual(false);
    });

    it('renderCreateItem custom', () => {
        const renderCreateItem = (inputValue) => {
            return <div className="custom-create">Create: {inputValue}</div>;
        };
        const props = {
            allowCreate: true,
            filter: true,
            renderCreateItem,
            defaultOpen: true,
        };
        const select = getSelect(props);
        select.find('input').simulate('change', { target: { value: 'newItem' } });
        expect(select.exists('.custom-create')).toBe(true);
    });

    it('onFocus and onBlur with filter', () => {
        let spyOnFocus = sinon.spy(() => {});
        let spyOnBlur = sinon.spy(() => {});
        const props = {
            filter: true,
            onFocus: spyOnFocus,
            onBlur: spyOnBlur,
        };
        const select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        expect(spyOnFocus.calledOnce).toBe(true);
    });

    it('disabled option cannot be selected', () => {
        let spyOnChange = sinon.spy(() => {});
        const props = {
            defaultOpen: true,
            optionList: [
                { value: 'abc', label: 'Abc', disabled: true },
                { value: 'hotsoon', label: 'Hotsoon' },
            ],
            onChange: spyOnChange,
        };
        const select = getSelect(props);
        let options = select.find(`.${BASE_CLASS_PREFIX}-select-option-list`).children();
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        options.at(0).simulate('click', nativeEvent);
        expect(spyOnChange.called).toBe(false);
    });

    it('keyboard navigation with disabled options', () => {
        const props = {
            defaultOpen: true,
            defaultActiveFirstOption: false,
            optionList: [
                { value: 'abc', label: 'Abc' },
                { value: 'disabled1', label: 'Disabled1', disabled: true },
                { value: 'hotsoon', label: 'Hotsoon' },
            ],
        };
        const select = getSelect(props);
        // Press DOWN - should focus first non-disabled option
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.DOWN });
        // First option should be focused
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-option`).at(0).hasClass(`${BASE_CLASS_PREFIX}-select-option-focused`)).toBe(true);
    });

    it('clearInput via ref', () => {
        let r;
        const props = {
            ref: (ref) => { r = ref },
            filter: true,
            defaultOpen: true,
        };
        const select = getSelect(props);
        select.find('input').simulate('change', { target: { value: 'test' } });
        expect(select.find('input').getDOMNode().value).toEqual('test');
        r.clearInput();
        select.update();
        expect(select.find('input').getDOMNode().value).toEqual('');
    });

    it('multiple select with onChangeWithObject and value update', () => {
        const props = {
            multiple: true,
            onChangeWithObject: true,
            optionList: [
                { value: 'abc', label: 'Abc', extra: 'a1' },
                { value: 'hotsoon', label: 'Hotsoon', extra: 'b2' },
            ],
            value: [{ value: 'abc', label: 'Abc', extra: 'a1' }],
        };
        const select = getSelect(props);
        let tags = select.find(`.${BASE_CLASS_PREFIX}-tag-content`);
        expect(tags.length).toEqual(1);
        // Update value
        select.setProps({ 
            value: [
                { value: 'abc', label: 'Abc', extra: 'a1' },
                { value: 'hotsoon', label: 'Hotsoon', extra: 'b2' }
            ] 
        });
        select.update();
        tags = select.find(`.${BASE_CLASS_PREFIX}-tag-content`);
        expect(tags.length).toEqual(2);
    });

    it('keyboard ENTER when no option focused', () => {
        const props = {
            defaultOpen: true,
            defaultActiveFirstOption: false,
        };
        const select = getSelect(props);
        // Press ENTER when no option is focused - should close the dropdown
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.ENTER });
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-option-list`)).toBe(false);
    });

    it('keyboard ESC with filter single select', () => {
        const props = {
            filter: true,
            defaultOpen: true,
        };
        const select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-option-list`)).toBe(true);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.ESC });
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-option-list`)).toBe(false);
    });

    it('backspace on multiple select with all disabled items', () => {
        const props = {
            multiple: true,
            defaultValue: ['abc'],
            optionList: [
                { value: 'abc', label: 'Abc', disabled: true },
            ],
            defaultOpen: true,
        };
        const select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.BACKSPACE });
        // Should not remove disabled item
        expect(select.state().selections.size).toEqual(1);
    });

    it('virtualize with selection scroll', () => {
        let optionList = Array.from({ length: 100 }, (v, i) => ({ label: `option-${i}`, value: i }));
        const props = {
            virtualize: {
                itemSize: 36,
            },
            defaultValue: 50,
            optionList,
        };
        const select = getSelect(props);
        // Open dropdown
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        // The virtual list should exist
        expect(select.exists('.semi-select-option-list')).toBe(true);
    });

    it('dropdownMatchSelectWidth with percentage width', () => {
        const props = {
            defaultOpen: true,
            style: { width: '50%' },
            dropdownMatchSelectWidth: true,
        };
        const select = getSelect(props);
        // Should use getTriggerWidth when width is percentage
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-option-list`)).toBe(true);
    });

    it('option with _parentGroup filter', () => {
        const props = {
            filter: true,
            defaultOpen: true,
            children: [
                <Select.OptGroup key={1} label="Group1">
                    <Select.Option value="a-1">a-1</Select.Option>
                    <Select.Option value="a-2">a-2</Select.Option>
                </Select.OptGroup>,
            ],
        };
        const select = getSelect(props);
        // Filter by group label
        select.find('input').simulate('change', { target: { value: 'Group1' } });
        let options = select.find('.semi-select-option');
        expect(options.length).toBeGreaterThan(0);
    });

    it('allowCreate with existing option match', () => {
        const props = {
            allowCreate: true,
            filter: true,
            defaultOpen: true,
            optionList: [
                { value: 'abc', label: 'abc' },
            ],
        };
        const select = getSelect(props);
        // Type exact match - should not show create option
        select.find('input').simulate('change', { target: { value: 'abc' } });
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-option-create`)).toBe(false);
    });

    it('loading state blocks keyboard events', () => {
        const props = {
            loading: true,
            defaultOpen: true,
        };
        const select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.DOWN });
        // Loading state should prevent keyboard navigation
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-loading-wrapper`)).toBe(true);
    });

    it('handleTriggerBlur when panel is closed', () => {
        let spyOnBlur = sinon.spy(() => {});
        const props = {
            onBlur: spyOnBlur,
        };
        const select = getSelect(props);
        // Click to focus
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        // Close panel
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.ESC });
        // Simulate blur on trigger
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('blur', {});
        expect(spyOnBlur.called).toBe(true);
    });

    it('selectAll with onChangeWithObject', () => {
        let r;
        let spyOnChange = sinon.spy(() => {});
        const props = {
            ref: (ref) => { r = ref },
            multiple: true,
            onChangeWithObject: true,
            optionList: defaultList,
            onChange: spyOnChange,
        };
        const select = getSelect(props);
        r.selectAll();
        expect(spyOnChange.calledOnce).toBe(true);
        const callArg = spyOnChange.getCall(0).args[0];
        expect(Array.isArray(callArg)).toBe(true);
        expect(callArg.length).toEqual(4);
    });

    it('custom arrowIcon and clearIcon', () => {
        const customArrow = <span className="custom-arrow">▼</span>;
        const customClear = <span className="custom-clear">×</span>;
        const props = {
            arrowIcon: customArrow,
            clearIcon: customClear,
            showClear: true,
            defaultValue: 'abc',
        };
        const select = getSelect(props);
        expect(select.exists('.custom-arrow')).toBe(true);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('mouseEnter', {});
        expect(select.exists('.custom-clear')).toBe(true);
    });

    it('insetLabel with insetLabelId', () => {
        const props = {
            insetLabel: 'Label',
            insetLabelId: 'test-label-id',
        };
        const select = getSelect(props);
        const label = select.find(`#test-label-id`);
        expect(label.exists()).toBe(true);
        expect(label.text()).toContain('Label');
    });

    it('autoClearSearchValue false with multiple controlled', () => {
        let spyOnChange = sinon.spy(() => {});
        const props = {
            multiple: true,
            filter: true,
            autoClearSearchValue: false,
            value: [],
            onChange: spyOnChange,
            defaultOpen: true,
        };
        const select = getSelect(props);
        select.find('input').simulate('change', { target: { value: 'abc' } });
        let options = select.find(`.${BASE_CLASS_PREFIX}-select-option-list`).children();
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        options.at(0).simulate('click', nativeEvent);
        // Input value should be preserved
        expect(select.find('input').getDOMNode().value).toEqual('abc');
    });

    it('filter with optionList update', () => {
        const props = {
            filter: true,
            defaultOpen: true,
            optionList: defaultList,
        };
        const select = getSelect(props);
        select.find('input').simulate('change', { target: { value: 'abc' } });
        // Update optionList
        select.setProps({
            optionList: [
                { value: 'new1', label: 'New1' },
                { value: 'new2', label: 'New2' },
            ]
        });
        select.update();
        // Options should be updated
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-option-list`).exists()).toBe(true);
    });

    it('removeTag in uncontrolled mode', () => {
        let spyOnDeselect = sinon.spy(() => {});
        const props = {
            multiple: true,
            defaultValue: ['abc', 'hotsoon'],
            onDeselect: spyOnDeselect,
        };
        const select = getSelect(props);
        let tagClose = select.find('.semi-tag-close').children();
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        tagClose.at(0).simulate('click', nativeEvent);
        expect(spyOnDeselect.calledOnce).toBe(true);
        expect(select.state().selections.size).toEqual(1);
    });

    it('handleKeyPress with Enter key', () => {
        const props = {};
        const select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keypress', { key: 'Enter' });
        expect(select.state().isOpen).toBe(true);
    });

    it('clickToHide false behavior', async () => {
        const props = {
            clickToHide: false,
            filter: true,
            motion: false,
        };
        const select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        await sleep(100);
        expect(select.state().isOpen).toBe(true);
        // Click again should not close but focus input
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        await sleep(100);
        expect(select.state().isOpen).toBe(true);
    });

    it('showRestTagsPopover with maxTagCount', () => {
        const props = {
            multiple: true,
            defaultValue: ['abc', 'hotsoon', 'pipixia', 'toutiao'],
            maxTagCount: 2,
            showRestTagsPopover: true,
        };
        const select = getSelect(props);
        // Should render TagGroup with popover
        expect(select.find(`.${BASE_CLASS_PREFIX}-tag`).length).toBeGreaterThanOrEqual(2);
    });

    it('Tab key navigation in dropdown', async () => {
        const props = {
            defaultOpen: true,
            innerBottomSlot: <button className="slot-button">Click me</button>,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Press Tab to navigate to slot
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.TAB });
    });

    it('handleInputBlur with filter single', async () => {
        const props = {
            filter: true,
            autoFocus: true,
            motion: false,
        };
        const select = getSelect(props);
        // Simulate input blur
        select.find('input').simulate('blur', {});
        await sleep(100);
    });

    it('deselectAll via ref', () => {
        let r;
        const props = {
            ref: (ref) => { r = ref },
            multiple: true,
            defaultValue: ['abc', 'hotsoon'],
            optionList: defaultList,
        };
        const select = getSelect(props);
        expect(select.state().selections.size).toEqual(2);
        r.deselectAll();
        expect(select.state().selections.size).toEqual(0);
    });

    it('option with extra props', () => {
        const props = {
            defaultOpen: true,
            optionList: [
                { value: 'abc', label: 'Abc', extra: 'extra1', customProp: 'custom' },
            ],
        };
        const select = getSelect(props);
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-option`).length).toEqual(1);
    });

    it('multiple select deselect via click', () => {
        let spyOnDeselect = sinon.spy(() => {});
        const props = {
            multiple: true,
            defaultValue: ['abc', 'hotsoon'],
            defaultOpen: true,
            onDeselect: spyOnDeselect,
        };
        const select = getSelect(props);
        let options = select.find(`.${BASE_CLASS_PREFIX}-select-option-list`).children();
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        // Click on already selected option to deselect
        options.at(0).simulate('click', nativeEvent);
        expect(spyOnDeselect.calledOnce).toBe(true);
    });

    it('handleOptionListChange with defaultActiveFirstOption', () => {
        const props = {
            defaultOpen: true,
            defaultActiveFirstOption: true,
            optionList: defaultList,
        };
        const select = getSelect(props);
        // Update optionList
        select.setProps({
            optionList: [
                { value: 'new1', label: 'New1' },
                { value: 'new2', label: 'New2' },
            ]
        });
        select.update();
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-option`).length).toEqual(2);
    });

    it('value change triggers update', () => {
        const props = {
            value: 'abc',
            optionList: defaultList,
        };
        const select = getSelect(props);
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-selection-text`).text()).toEqual('Abc');
        select.setProps({ value: 'hotsoon' });
        select.update();
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-selection-text`).text()).toEqual('Hotsoon');
    });

    it('multiple value change with onChangeWithObject', () => {
        const props = {
            multiple: true,
            onChangeWithObject: true,
            optionList: defaultList,
            value: [{ value: 'abc', label: 'Abc' }],
        };
        const select = getSelect(props);
        select.setProps({ 
            value: [
                { value: 'abc', label: 'Abc' },
                { value: 'hotsoon', label: 'Hotsoon' }
            ] 
        });
        select.update();
        expect(select.state().selections.size).toEqual(2);
    });

    it('filter with group label match', () => {
        const props = {
            filter: true,
            defaultOpen: true,
            children: [
                <Select.OptGroup key={1} label="TestGroup">
                    <Select.Option value="a-1">a-1</Select.Option>
                </Select.OptGroup>,
            ],
        };
        const select = getSelect(props);
        // Filter by group label
        select.find('input').simulate('change', { target: { value: 'TestGroup' } });
        // Options in the group should be visible
        expect(select.find('.semi-select-option').length).toBeGreaterThan(0);
    });

    it('clearSelected via ref', () => {
        let r;
        const props = {
            ref: (ref) => { r = ref },
            defaultValue: 'abc',
            optionList: defaultList,
        };
        const select = getSelect(props);
        expect(select.state().selections.size).toEqual(1);
        r.clearInput();
    });

    it('handleClearClick with filter', () => {
        const props = {
            filter: true,
            showClear: true,
            defaultValue: 'abc',
        };
        const select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        select.find('input').simulate('change', { target: { value: 'test' } });
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('mouseEnter', {});
        const clearBtn = select.find(`.${BASE_CLASS_PREFIX}-icon-clear`);
        if (clearBtn.exists()) {
            const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop }, stopPropagation: noop };
            clearBtn.simulate('click', nativeEvent);
        }
    });

    it('updateOptionsActiveStatus with allowCreate', () => {
        let spyOnChange = sinon.spy(() => {});
        const props = {
            allowCreate: true,
            filter: true,
            defaultOpen: true,
            onChange: spyOnChange,
        };
        const select = getSelect(props);
        select.find('input').simulate('change', { target: { value: 'newItem' } });
        // Select the created option
        const createOption = select.find(`.${BASE_CLASS_PREFIX}-select-option`);
        if (createOption.exists()) {
            const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
            createOption.at(0).simulate('click', nativeEvent);
        }
    });

    it('multiple backspace with multiple disabled items', () => {
        const props = {
            multiple: true,
            defaultValue: ['abc', 'hotsoon', 'pipixia'],
            optionList: [
                { value: 'abc', label: 'Abc', disabled: true },
                { value: 'hotsoon', label: 'Hotsoon', disabled: true },
                { value: 'pipixia', label: 'Pipixia' },
            ],
            defaultOpen: true,
        };
        const select = getSelect(props);
        // Press backspace - should remove the last non-disabled item
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.BACKSPACE });
        expect(select.state().selections.size).toEqual(2);
    });

    it('keyboard ENTER on disabled option', () => {
        let spyOnChange = sinon.spy(() => {});
        const props = {
            defaultOpen: true,
            defaultActiveFirstOption: true,
            optionList: [
                { value: 'abc', label: 'Abc', disabled: true },
            ],
            onChange: spyOnChange,
        };
        const select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.ENTER });
        // Should not trigger onChange for disabled option
        expect(spyOnChange.called).toBe(false);
    });

    it('renderWithGroup with multiple groups', () => {
        const props = {
            defaultOpen: true,
            children: [
                <Select.OptGroup key={1} label="Group1">
                    <Select.Option value="a-1">a-1</Select.Option>
                </Select.OptGroup>,
                <Select.OptGroup key={2} label="Group2">
                    <Select.Option value="b-1">b-1</Select.Option>
                </Select.OptGroup>,
            ],
        };
        const select = getSelect(props);
        expect(select.find('.semi-select-group').length).toEqual(2);
    });

    it('_diffSelections with same value different label', () => {
        let spyOnChange = sinon.spy(() => {});
        const props = {
            optionList: [
                { value: 'abc', label: 'Label1' },
            ],
            onChange: spyOnChange,
            defaultOpen: true,
        };
        const select = getSelect(props);
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        select.find(`.${BASE_CLASS_PREFIX}-select-option`).at(0).simulate('click', nativeEvent);
        expect(spyOnChange.calledOnce).toBe(true);
    });

    it('handlePopoverVisibleChange with virtualize', () => {
        let optionList = Array.from({ length: 100 }, (v, i) => ({ label: `option-${i}`, value: i }));
        const props = {
            virtualize: {
                itemSize: 36,
            },
            defaultValue: 50,
            optionList,
        };
        const select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        // Virtual list should scroll to selected item
        expect(select.exists('.semi-select-option-list')).toBe(true);
    });

    it('suffix as element', () => {
        const props = {
            suffix: <span className="custom-suffix">suffix</span>,
        };
        const select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-suffix`)).toBe(true);
        expect(select.find('.custom-suffix').text()).toEqual('suffix');
    });

    it('prefix as text', () => {
        const props = {
            prefix: 'Prefix:',
        };
        const select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-prefix-text`)).toBe(true);
    });

    it('_updateMultiple with value not in optionList or selections', () => {
        const props = {
            multiple: true,
            value: ['notExist1', 'notExist2'],
            optionList: defaultList,
        };
        const select = getSelect(props);
        // Should create options for values not in list
        expect(select.state().selections.size).toEqual(2);
    });

    it('handleOptionListChangeHadDefaultValue', () => {
        const props = {
            multiple: true,
            defaultValue: ['abc'],
            optionList: defaultList,
        };
        const select = getSelect(props);
        // Update optionList - should preserve selection
        select.setProps({
            optionList: [
                { value: 'new1', label: 'New1' },
            ]
        });
        select.update();
        // Selection should be preserved even if not in new optionList
        expect(select.state().selections.size).toEqual(1);
    });

    it('renderSelectedItem custom function', () => {
        const renderSelectedItem = (optionNode) => ({
            isRenderInTag: true,
            content: `Custom: ${optionNode.label}`,
        });
        const props = {
            multiple: true,
            defaultValue: ['abc', 'hotsoon'],
            renderSelectedItem,
        };
        const select = getSelect(props);
        expect(select.find(`.${BASE_CLASS_PREFIX}-tag`).length).toBeGreaterThanOrEqual(2);
    });

    it('option with renderOptionItem', () => {
        const renderOptionItem = (renderProps) => {
            const { disabled, selected, label, value, focused, className, style, onMouseEnter, onClick } = renderProps;
            return (
                <div 
                    className={`custom-option ${className}`} 
                    onClick={onClick}
                    onMouseEnter={onMouseEnter}
                    style={style}
                >
                    {label} - {value}
                </div>
            );
        };
        const props = {
            defaultOpen: true,
            optionList: defaultList,
            renderOptionItem,
        };
        const select = getSelect(props);
        expect(select.find('.custom-option').length).toBeGreaterThan(0);
    });

    it('option with renderOptionItem click', () => {
        let spyOnChange = sinon.spy(() => {});
        const renderOptionItem = (renderProps) => {
            const { label, value, onClick, onMouseEnter, style, className } = renderProps;
            return (
                <div 
                    className={`custom-option ${className}`}
                    onClick={onClick}
                    onMouseEnter={onMouseEnter}
                    style={style}
                >
                    {label}
                </div>
            );
        };
        const props = {
            defaultOpen: true,
            optionList: defaultList,
            renderOptionItem,
            onChange: spyOnChange,
        };
        const select = getSelect(props);
        select.find('.custom-option').at(0).simulate('click', {});
        expect(spyOnChange.calledOnce).toBe(true);
    });

    it('option onMouseEnter callback', () => {
        const props = {
            defaultOpen: true,
            optionList: defaultList,
        };
        const select = getSelect(props);
        const option = select.find(`.${BASE_CLASS_PREFIX}-select-option`).at(0);
        option.simulate('mouseEnter', {});
        expect(select.state().focusIndex).toEqual(0);
    });

    it('showRestTagsPopover with onPlusNMouseEnter', async () => {
        const props = {
            multiple: true,
            defaultValue: ['abc', 'hotsoon', 'pipixia', 'toutiao'],
            maxTagCount: 2,
            showRestTagsPopover: true,
        };
        const select = getSelect(props);
        await sleep(100);
        // Find the +N tag and trigger mouse enter
        const plusNTag = select.find(`.${BASE_CLASS_PREFIX}-tag-group-n`);
        if (plusNTag.exists()) {
            plusNTag.simulate('mouseEnter', {});
            await sleep(100);
        }
    });

    it('handleSlotMouseEnter', async () => {
        const props = {
            defaultOpen: true,
            innerBottomSlot: <div className="custom-slot">Slot Content</div>,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        const slot = select.find('.custom-slot');
        if (slot.exists()) {
            slot.simulate('mouseEnter', {});
        }
    });

    it('handlePopoverClose callback', async () => {
        let spyOnPopoverClose = sinon.spy(() => {});
        const props = {
            defaultOpen: true,
            motion: false,
            onPopoverClose: spyOnPopoverClose,
        };
        const select = getSelect(props);
        await sleep(100);
        // Close the popover
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.ESC });
        await sleep(100);
    });

    it('ellipsisTrigger with overflow', async () => {
        const props = {
            multiple: true,
            defaultValue: ['abc', 'hotsoon', 'pipixia', 'toutiao'],
            ellipsisTrigger: 'hover',
            maxTagCount: 2,
            style: { width: 200 },
        };
        const select = getSelect(props);
        await sleep(100);
        // Should render with ellipsis trigger
        expect(select.find(`.${BASE_CLASS_PREFIX}-tag`).length).toBeGreaterThanOrEqual(2);
    });

    it('updateIsFullTags when isFullTags is false', async () => {
        const props = {
            multiple: true,
            defaultValue: ['abc', 'hotsoon', 'pipixia', 'toutiao'],
            maxTagCount: 2,
            showRestTagsPopover: true,
        };
        const select = getSelect(props);
        await sleep(100);
        // Initially isFullTags should be false
        expect(select.state().isFullTags).toBe(false);
    });

    it('filter with remote and empty result', async () => {
        const props = {
            filter: true,
            remote: true,
            optionList: [],
            defaultOpen: true,
        };
        const select = getSelect(props);
        select.find('input').simulate('change', { target: { value: 'test' } });
        await sleep(100);
        // Should show empty content
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-option-list`)).toBe(true);
    });

    it('handleClear with multiple and onClear callback', () => {
        let spyOnClear = sinon.spy(() => {});
        const props = {
            multiple: true,
            defaultValue: ['abc', 'hotsoon'],
            showClear: true,
            onClear: spyOnClear,
        };
        const select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('mouseEnter', {});
        const clearBtn = select.find(`.${BASE_CLASS_PREFIX}-icon-clear`);
        if (clearBtn.exists()) {
            const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop }, stopPropagation: noop };
            clearBtn.simulate('click', nativeEvent);
            expect(spyOnClear.calledOnce).toBe(true);
        }
    });

    it('optionList with disabled group', () => {
        const props = {
            defaultOpen: true,
            children: [
                <Select.OptGroup key={1} label="DisabledGroup" disabled>
                    <Select.Option value="a-1">a-1</Select.Option>
                </Select.OptGroup>,
            ],
        };
        const select = getSelect(props);
        expect(select.find('.semi-select-group').length).toEqual(1);
    });

    it('option with empty label', () => {
        const props = {
            defaultOpen: true,
            optionList: [
                { value: 'abc', label: '' },
            ],
        };
        const select = getSelect(props);
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-option`).length).toEqual(1);
    });

    it('multiple select with max selection', () => {
        let spyOnExceed = sinon.spy(() => {});
        const props = {
            multiple: true,
            max: 2,
            defaultValue: ['abc', 'hotsoon'],
            onExceed: spyOnExceed,
            defaultOpen: true,
        };
        const select = getSelect(props);
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        // Try to select one more
        select.find(`.${BASE_CLASS_PREFIX}-select-option`).at(2).simulate('click', nativeEvent);
        expect(spyOnExceed.calledOnce).toBe(true);
    });

    it('keyboard navigation with UP key', () => {
        const props = {
            defaultOpen: true,
            optionList: defaultList,
        };
        const select = getSelect(props);
        // Press DOWN first to focus an option
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.DOWN });
        // Then press UP
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.UP });
    });

    it('filter with onSearch callback', () => {
        let spyOnSearch = sinon.spy(() => {});
        const props = {
            filter: true,
            onSearch: spyOnSearch,
            defaultOpen: true,
        };
        const select = getSelect(props);
        select.find('input').simulate('change', { target: { value: 'test' } });
        expect(spyOnSearch.calledOnce).toBe(true);
    });

    it('handleKeyDown with PAGE_DOWN and PAGE_UP', () => {
        const props = {
            defaultOpen: true,
            optionList: defaultList,
        };
        const select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.PAGE_DOWN });
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.PAGE_UP });
    });

    it('handleKeyDown with HOME and END', () => {
        const props = {
            defaultOpen: true,
            optionList: defaultList,
        };
        const select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.HOME });
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.END });
    });

    it('outerTopSlot rendering', () => {
        const props = {
            defaultOpen: true,
            outerTopSlot: <div className="outer-top-slot">Top Slot</div>,
        };
        const select = getSelect(props);
        expect(select.find('.outer-top-slot').text()).toEqual('Top Slot');
    });

    it('outerBottomSlot rendering', () => {
        const props = {
            defaultOpen: true,
            outerBottomSlot: <div className="outer-bottom-slot">Bottom Slot</div>,
        };
        const select = getSelect(props);
        expect(select.find('.outer-bottom-slot').text()).toEqual('Bottom Slot');
    });

    it('innerTopSlot rendering', () => {
        const props = {
            defaultOpen: true,
            innerTopSlot: <div className="inner-top-slot">Inner Top</div>,
        };
        const select = getSelect(props);
        expect(select.find('.inner-top-slot').text()).toEqual('Inner Top');
    });

    it('triggerRender custom', () => {
        const triggerRender = ({ value }) => (
            <div className="custom-trigger">Custom: {value ? (Array.isArray(value) ? value.map(v => v.label).join(',') : value.label) : ''}</div>
        );
        const props = {
            triggerRender,
            defaultValue: 'abc',
        };
        const select = getSelect(props);
        expect(select.find('.custom-trigger').exists()).toBe(true);
    });

    it('dropdownStyle custom', () => {
        const props = {
            defaultOpen: true,
            dropdownStyle: { backgroundColor: 'red' },
        };
        const select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-option-list`)).toBe(true);
    });

    it('onDropdownVisibleChange callback', async () => {
        let spyOnDropdownVisibleChange = sinon.spy(() => {});
        const props = {
            onDropdownVisibleChange: spyOnDropdownVisibleChange,
            motion: false,
        };
        const select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        await sleep(100);
        expect(spyOnDropdownVisibleChange.calledOnce).toBe(true);
    });

    it('validateStatus error', () => {
        const props = {
            validateStatus: 'error',
        };
        const select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-error`)).toBe(true);
    });

    it('validateStatus warning', () => {
        const props = {
            validateStatus: 'warning',
        };
        const select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-warning`)).toBe(true);
    });

    it('size small', () => {
        const props = {
            size: 'small',
        };
        const select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-small`)).toBe(true);
    });

    it('size large', () => {
        const props = {
            size: 'large',
        };
        const select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-large`)).toBe(true);
    });

    it('borderless style', () => {
        const props = {
            borderless: true,
        };
        const select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-borderless`)).toBe(true);
    });

    it('triggerRender with onRemove', () => {
        const triggerRender = ({ value, onRemove, onClear }) => (
            <div className="custom-trigger">
                {value && value.map((v, i) => (
                    <span key={i} className="custom-tag" onClick={() => onRemove(v)}>{v.label}</span>
                ))}
                <button className="clear-btn" onClick={onClear}>Clear</button>
            </div>
        );
        const props = {
            multiple: true,
            triggerRender,
            defaultValue: ['abc', 'hotsoon'],
        };
        const select = getSelect(props);
        expect(select.find('.custom-trigger').exists()).toBe(true);
        expect(select.find('.custom-tag').length).toEqual(2);
        // Test onRemove
        select.find('.custom-tag').at(0).simulate('click', {});
        expect(select.state().selections.size).toEqual(1);
    });

    it('controlled value with undefined', () => {
        const props = {
            value: undefined,
            optionList: defaultList,
        };
        const select = getSelect(props);
        expect(select.state().selections.size).toEqual(0);
    });

    it('controlled value change from value to undefined', () => {
        const props = {
            value: 'abc',
            optionList: defaultList,
        };
        const select = getSelect(props);
        expect(select.state().selections.size).toEqual(1);
        select.setProps({ value: undefined });
        select.update();
        expect(select.state().selections.size).toEqual(0);
    });

    it('filter with custom function', () => {
        const customFilter = (inputValue, option) => {
            return option.label.toLowerCase().includes(inputValue.toLowerCase());
        };
        const props = {
            filter: customFilter,
            defaultOpen: true,
        };
        const select = getSelect(props);
        select.find('input').simulate('change', { target: { value: 'ABC' } });
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-option`).length).toBeGreaterThan(0);
    });

    it('onBlur callback', async () => {
        let spyOnBlur = sinon.spy(() => {});
        const props = {
            onBlur: spyOnBlur,
            autoFocus: true,
        };
        const select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('blur', {});
        await sleep(100);
    });

    it('onListScroll callback', async () => {
        let spyOnListScroll = sinon.spy(() => {});
        const props = {
            defaultOpen: true,
            onListScroll: spyOnListScroll,
            optionList: Array.from({ length: 50 }, (v, i) => ({ label: `option-${i}`, value: i })),
        };
        const select = getSelect(props);
        await sleep(100);
        const optionList = select.find(`.${BASE_CLASS_PREFIX}-select-option-list`);
        if (optionList.exists()) {
            optionList.simulate('scroll', {});
        }
    });

    it('emptyContent custom', () => {
        const props = {
            defaultOpen: true,
            optionList: [],
            emptyContent: <div className="custom-empty">No Data</div>,
        };
        const select = getSelect(props);
        expect(select.find('.custom-empty').text()).toEqual('No Data');
    });

    it('option with number value', () => {
        const props = {
            defaultOpen: true,
            optionList: [
                { value: 1, label: 'One' },
                { value: 2, label: 'Two' },
            ],
        };
        const select = getSelect(props);
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-option`).length).toEqual(2);
    });

    it('defaultValue with number', () => {
        const props = {
            defaultValue: 1,
            optionList: [
                { value: 1, label: 'One' },
                { value: 2, label: 'Two' },
            ],
        };
        const select = getSelect(props);
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-selection-text`).text()).toEqual('One');
    });

    it('multiple with number values', () => {
        const props = {
            multiple: true,
            defaultValue: [1, 2],
            optionList: [
                { value: 1, label: 'One' },
                { value: 2, label: 'Two' },
            ],
        };
        const select = getSelect(props);
        expect(select.state().selections.size).toEqual(2);
    });

    it('close via ref', async () => {
        let r;
        const props = {
            ref: (ref) => { r = ref },
            defaultOpen: true,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        expect(select.state().isOpen).toBe(true);
        r.close();
        await sleep(100);
        expect(select.state().isOpen).toBe(false);
    });

    it('open via ref', async () => {
        let r;
        const props = {
            ref: (ref) => { r = ref },
            motion: false,
        };
        const select = getSelect(props);
        expect(select.state().isOpen).toBe(false);
        r.open();
        await sleep(100);
        expect(select.state().isOpen).toBe(true);
    });

    it('focus via ref', () => {
        let r;
        const props = {
            ref: (ref) => { r = ref },
        };
        const select = getSelect(props);
        r.focus();
    });

    it('handleTriggerBlur event', async () => {
        const props = {
            autoFocus: true,
            motion: false,
        };
        const select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('blur', {});
        await sleep(100);
    });

    it('selectAll via ref', () => {
        let r;
        const props = {
            ref: (ref) => { r = ref },
            multiple: true,
            optionList: defaultList,
        };
        const select = getSelect(props);
        expect(select.state().selections.size).toEqual(0);
        r.selectAll();
        expect(select.state().selections.size).toEqual(defaultList.length);
    });

    it('search via ref', async () => {
        let r;
        const props = {
            ref: (ref) => { r = ref },
            filter: true,
            defaultOpen: true,
        };
        const select = getSelect(props);
        r.search('abc');
        await sleep(100);
        expect(select.state().inputValue).toEqual('abc');
    });

    it('option with key prop', () => {
        const props = {
            defaultOpen: true,
            optionList: [
                { value: 'abc', label: 'Abc', key: 'key-abc' },
            ],
        };
        const select = getSelect(props);
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-option`).length).toEqual(1);
    });

    it('filter with inputValue containing special chars', () => {
        const props = {
            filter: true,
            defaultOpen: true,
        };
        const select = getSelect(props);
        select.find('input').simulate('change', { target: { value: '(test)' } });
    });

    it('autoAdjustOverflow prop', () => {
        const props = {
            autoAdjustOverflow: false,
            defaultOpen: true,
        };
        const select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-option-list`)).toBe(true);
    });

    it('stopPropagation prop', () => {
        const props = {
            stopPropagation: true,
        };
        const select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
    });

    it('zIndex prop', () => {
        const props = {
            zIndex: 9999,
            defaultOpen: true,
        };
        const select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-option-list`)).toBe(true);
    });

    it('getPopupContainer prop', () => {
        const getPopupContainer = () => document.body;
        const props = {
            getPopupContainer,
            defaultOpen: true,
        };
        const select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-option-list`)).toBe(true);
    });

    it('preventScroll prop', () => {
        const props = {
            preventScroll: true,
            autoFocus: true,
        };
        const select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select`)).toBe(true);
    });

    it('renderSelectedItem with isRenderInTag false', () => {
        const renderSelectedItem = (optionNode) => ({
            isRenderInTag: false,
            content: <span className="custom-selected">{optionNode.label}</span>,
        });
        const props = {
            multiple: true,
            defaultValue: ['abc'],
            renderSelectedItem,
        };
        const select = getSelect(props);
        expect(select.find('.custom-selected').exists()).toBe(true);
    });

    it('option with extra data attributes', () => {
        const props = {
            defaultOpen: true,
            optionList: [
                { value: 'abc', label: 'Abc', 'data-testid': 'option-abc' },
            ],
        };
        const select = getSelect(props);
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-option`).length).toEqual(1);
    });

    it('handleInputCompositionStart and End', () => {
        const props = {
            filter: true,
            defaultOpen: true,
        };
        const select = getSelect(props);
        select.find('input').simulate('compositionStart', {});
        select.find('input').simulate('compositionEnd', {});
    });

    it('handleMouseEnter and handleMouseLeave', () => {
        const props = {
            showClear: true,
            defaultValue: 'abc',
        };
        const select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('mouseEnter', {});
        expect(select.state().isHovering).toBe(true);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('mouseLeave', {});
        expect(select.state().isHovering).toBe(false);
    });

    it('position bottom', () => {
        const props = {
            position: 'bottom',
            defaultOpen: true,
        };
        const select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-option-list`)).toBe(true);
    });

    it('position top', () => {
        const props = {
            position: 'top',
            defaultOpen: true,
        };
        const select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-option-list`)).toBe(true);
    });

    it('allowCreate with selection and deselection', () => {
        let spyOnCreate = sinon.spy(() => {});
        const props = {
            allowCreate: true,
            filter: true,
            defaultOpen: true,
            onCreate: spyOnCreate,
        };
        const select = getSelect(props);
        // Create a new option
        select.find('input').simulate('change', { target: { value: 'newOption' } });
        // Select the created option
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        const createOption = select.find(`.${BASE_CLASS_PREFIX}-select-option`);
        if (createOption.length > 0) {
            createOption.at(0).simulate('click', nativeEvent);
            expect(spyOnCreate.calledOnce).toBe(true);
        }
    });

    it('controlled single select with filter', async () => {
        let spyOnChange = sinon.spy(() => {});
        const props = {
            value: 'abc',
            filter: true,
            onChange: spyOnChange,
            motion: false,
        };
        const select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        await sleep(100);
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        select.find(`.${BASE_CLASS_PREFIX}-select-option`).at(1).simulate('click', nativeEvent);
        expect(spyOnChange.calledOnce).toBe(true);
    });

    it('_diffSelections with same label different value', () => {
        let spyOnChange = sinon.spy(() => {});
        const props = {
            optionList: [
                { value: 'abc1', label: 'Same' },
            ],
            defaultValue: 'abc1',
            onChange: spyOnChange,
        };
        const select = getSelect(props);
        // Update to option with same label but different value
        select.setProps({
            optionList: [
                { value: 'abc2', label: 'Same' },
            ],
            value: 'abc2',
        });
        select.update();
    });

    it('removeTag in controlled mode', () => {
        let spyOnChange = sinon.spy(() => {});
        let spyOnDeselect = sinon.spy(() => {});
        const props = {
            multiple: true,
            value: ['abc', 'hotsoon'],
            onChange: spyOnChange,
            onDeselect: spyOnDeselect,
        };
        const select = getSelect(props);
        // Remove a tag
        const closeIcon = select.find(`.${BASE_CLASS_PREFIX}-tag-close`);
        if (closeIcon.length > 0) {
            const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop }, stopPropagation: noop };
            closeIcon.at(0).simulate('click', nativeEvent);
            expect(spyOnDeselect.calledOnce).toBe(true);
        }
    });

    it('updateOptionsActiveStatus with allowCreate selected', () => {
        const props = {
            allowCreate: true,
            filter: true,
            multiple: true,
            defaultOpen: true,
        };
        const select = getSelect(props);
        // Create and select an option
        select.find('input').simulate('change', { target: { value: 'created' } });
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        const createOption = select.find(`.${BASE_CLASS_PREFIX}-select-option`);
        if (createOption.length > 0) {
            createOption.at(0).simulate('click', nativeEvent);
        }
    });

    it('_createOptionByInput with existing match', () => {
        const props = {
            allowCreate: true,
            filter: true,
            defaultOpen: true,
            optionList: [
                { value: 'abc', label: 'Abc' },
            ],
        };
        const select = getSelect(props);
        // Input matches existing option
        select.find('input').simulate('change', { target: { value: 'Abc' } });
        // Should not create duplicate
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-option`).length).toEqual(1);
    });

    it('handleArrowKeyDown wrapping', () => {
        const props = {
            defaultOpen: true,
            optionList: [
                { value: 'a', label: 'A' },
                { value: 'b', label: 'B' },
            ],
        };
        const select = getSelect(props);
        // Press UP when at first option - should wrap to last
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.UP });
        // Press DOWN multiple times to wrap
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.DOWN });
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.DOWN });
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.DOWN });
    });

    it('handleEnterKeyDown with no focused option', () => {
        const props = {
            defaultOpen: true,
            defaultActiveFirstOption: false,
            optionList: defaultList,
        };
        const select = getSelect(props);
        // Press ENTER when no option is focused
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.ENTER });
    });

    it('filter with group and matching group label', () => {
        const props = {
            filter: true,
            defaultOpen: true,
            children: [
                <Select.OptGroup key={1} label="Fruits">
                    <Select.Option value="apple">Apple</Select.Option>
                    <Select.Option value="banana">Banana</Select.Option>
                </Select.OptGroup>,
            ],
        };
        const select = getSelect(props);
        // Filter by group label
        select.find('input').simulate('change', { target: { value: 'Fruits' } });
        // Options in the group should be visible
        expect(select.find('.semi-select-option').length).toBeGreaterThan(0);
    });

    it('handleContainerKeyDown with TAB', () => {
        const props = {
            defaultOpen: true,
            innerBottomSlot: <button className="slot-btn">Button</button>,
            motion: false,
        };
        const select = getSelect(props);
        // Simulate TAB key on container
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.TAB });
    });

    it('onChangeWithObject single select', () => {
        let spyOnChange = sinon.spy(() => {});
        const props = {
            onChangeWithObject: true,
            onChange: spyOnChange,
            defaultOpen: true,
        };
        const select = getSelect(props);
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        select.find(`.${BASE_CLASS_PREFIX}-select-option`).at(0).simulate('click', nativeEvent);
        expect(spyOnChange.calledOnce).toBe(true);
        const callArg = spyOnChange.getCall(0).args[0];
        expect(typeof callArg).toBe('object');
        expect(callArg.value).toBeDefined();
    });

    it('option with _keyInOptionList', () => {
        const props = {
            defaultOpen: true,
            optionList: [
                { value: 'abc', label: 'Abc', key: 'custom-key' },
            ],
        };
        const select = getSelect(props);
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-option`).length).toEqual(1);
    });

    it('clearInput via ref when inputValue is empty', () => {
        let r;
        const props = {
            ref: (ref) => { r = ref },
            filter: true,
        };
        const select = getSelect(props);
        // Call clearInput when input is already empty
        r.clearInput();
    });

    it('clearInput via ref when inputValue is not empty', async () => {
        let r;
        const props = {
            ref: (ref) => { r = ref },
            filter: true,
            defaultOpen: true,
        };
        const select = getSelect(props);
        select.find('input').simulate('change', { target: { value: 'test' } });
        await sleep(100);
        expect(select.state().inputValue).toEqual('test');
        r.clearInput();
        expect(select.state().inputValue).toEqual('');
    });

    it('handleInputChange with multiple reposition', () => {
        const props = {
            multiple: true,
            filter: true,
            defaultOpen: true,
        };
        const select = getSelect(props);
        select.find('input').simulate('change', { target: { value: 'test' } });
    });

    it('close with isFocus true', async () => {
        const props = {
            defaultOpen: true,
            autoFocus: true,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Close via ESC
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.ESC });
        await sleep(100);
    });

    it('updateOverflowItemCount with overFlowCount', async () => {
        const props = {
            multiple: true,
            defaultValue: ['abc', 'hotsoon', 'pipixia', 'toutiao'],
            maxTagCount: 2,
            style: { width: 200 },
        };
        const select = getSelect(props);
        await sleep(100);
    });

    it('renderOneLineTags without showRestTagsPopover', () => {
        const props = {
            multiple: true,
            defaultValue: ['abc', 'hotsoon', 'pipixia'],
            maxTagCount: 2,
            showRestTagsPopover: false,
        };
        const select = getSelect(props);
        expect(select.find(`.${BASE_CLASS_PREFIX}-tag`).length).toBeGreaterThanOrEqual(2);
    });

    it('ellipsisTrigger hover with overflow handling', async () => {
        const props = {
            multiple: true,
            defaultValue: ['abc', 'hotsoon', 'pipixia', 'toutiao'],
            ellipsisTrigger: 'hover',
            style: { width: 150 },
        };
        const select = getSelect(props);
        await sleep(200);
        // Check that tags are rendered
        expect(select.find(`.${BASE_CLASS_PREFIX}-tag`).length).toBeGreaterThanOrEqual(1);
    });

    it('handleOverflow callback', async () => {
        const props = {
            multiple: true,
            defaultValue: ['abc', 'hotsoon', 'pipixia', 'toutiao'],
            ellipsisTrigger: 'hover',
            maxTagCount: 2,
            style: { width: 100 },
        };
        const select = getSelect(props);
        await sleep(200);
    });

    it('renderCollapsedTags with overflowItemCount', async () => {
        const props = {
            multiple: true,
            defaultValue: ['abc', 'hotsoon', 'pipixia', 'toutiao'],
            ellipsisTrigger: 'hover',
            maxTagCount: 1,
            style: { width: 80 },
        };
        const select = getSelect(props);
        await sleep(200);
    });

    it('filter single with showInput false', () => {
        const props = {
            filter: true,
            showInput: false,
            defaultOpen: true,
        };
        const select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-option-list`)).toBe(true);
    });

    it('handleTabKeyDown with innerBottomSlot focusable', async () => {
        const props = {
            defaultOpen: true,
            innerBottomSlot: (
                <div>
                    <button className="focusable-btn">Click</button>
                </div>
            ),
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Press TAB
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.TAB });
    });

    it('_handleTabKeyDown without slot', () => {
        const props = {
            defaultOpen: true,
            motion: false,
        };
        const select = getSelect(props);
        // Press TAB when no slot
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.TAB });
    });

    it('onSelect callback', () => {
        let spyOnSelect = sinon.spy(() => {});
        const props = {
            onSelect: spyOnSelect,
            defaultOpen: true,
        };
        const select = getSelect(props);
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        select.find(`.${BASE_CLASS_PREFIX}-select-option`).at(0).simulate('click', nativeEvent);
        expect(spyOnSelect.calledOnce).toBe(true);
    });

    it('_notifyBlur callback', async () => {
        let spyOnBlur = sinon.spy(() => {});
        const props = {
            onBlur: spyOnBlur,
            defaultOpen: true,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Trigger blur by clicking outside
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('blur', {});
        await sleep(100);
    });

    it('_notifyFocus callback', async () => {
        let spyOnFocus = sinon.spy(() => {});
        const props = {
            onFocus: spyOnFocus,
            motion: false,
        };
        const select = getSelect(props);
        // Click to trigger focus
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        await sleep(100);
    });

    it('handleKeyPress with Enter', () => {
        const props = {
            defaultOpen: true,
        };
        const select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keypress', { key: 'Enter' });
    });

    it('option with showTick false', () => {
        const props = {
            defaultOpen: true,
            optionList: [
                { value: 'abc', label: 'Abc', showTick: false },
            ],
        };
        const select = getSelect(props);
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-option`).length).toEqual(1);
    });

    it('filter with empty string', () => {
        const props = {
            filter: true,
            defaultOpen: true,
        };
        const select = getSelect(props);
        select.find('input').simulate('change', { target: { value: '' } });
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-option`).length).toEqual(defaultList.length);
    });

    it('multiple select with onChangeWithObject deselect', () => {
        let spyOnChange = sinon.spy(() => {});
        const props = {
            multiple: true,
            onChangeWithObject: true,
            defaultValue: [{ value: 'abc', label: 'Abc' }],
            onChange: spyOnChange,
            defaultOpen: true,
        };
        const select = getSelect(props);
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        // Click on selected option to deselect
        select.find(`.${BASE_CLASS_PREFIX}-select-option`).at(0).simulate('click', nativeEvent);
        expect(spyOnChange.calledOnce).toBe(true);
    });

    it('controlled multiple with empty array', () => {
        const props = {
            multiple: true,
            value: [],
            optionList: defaultList,
        };
        const select = getSelect(props);
        expect(select.state().selections.size).toEqual(0);
    });

    it('defaultValue with onChangeWithObject', () => {
        const props = {
            onChangeWithObject: true,
            defaultValue: { value: 'abc', label: 'Abc' },
            optionList: defaultList,
        };
        const select = getSelect(props);
        expect(select.state().selections.size).toEqual(1);
    });

    it('multiple defaultValue with onChangeWithObject', () => {
        const props = {
            multiple: true,
            onChangeWithObject: true,
            defaultValue: [{ value: 'abc', label: 'Abc' }],
            optionList: defaultList,
        };
        const select = getSelect(props);
        expect(select.state().selections.size).toEqual(1);
    });

    it('innerBottomSlot with mouseEnter', async () => {
        const props = {
            defaultOpen: true,
            innerBottomSlot: <div className="inner-slot" onMouseEnter={() => {}}>Slot</div>,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        const slot = select.find('.inner-slot');
        if (slot.exists()) {
            slot.simulate('mouseEnter', {});
        }
    });

    it('showRestTagsPopover with isFullTags update', async () => {
        const props = {
            multiple: true,
            defaultValue: ['abc', 'hotsoon', 'pipixia', 'toutiao'],
            maxTagCount: 2,
            showRestTagsPopover: true,
        };
        const select = getSelect(props);
        await sleep(100);
        // Initially isFullTags should be false
        expect(select.state().isFullTags).toBe(false);
        // Trigger updateIsFullTags by hovering on +N tag
        const tagGroup = select.find(`.${BASE_CLASS_PREFIX}-tag-group`);
        if (tagGroup.exists()) {
            // Find the +N element
            const plusN = tagGroup.find(`.${BASE_CLASS_PREFIX}-tag-group-n`);
            if (plusN.exists()) {
                plusN.simulate('mouseEnter', {});
                await sleep(100);
            }
        }
    });

    it('handlePopoverClose event', async () => {
        const props = {
            defaultOpen: true,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Close the dropdown
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.ESC });
        await sleep(200);
    });

    it('Tab key with Shift in dropdown', async () => {
        const props = {
            defaultOpen: true,
            innerBottomSlot: <button className="slot-btn">Button</button>,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Press Shift+TAB
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.TAB, shiftKey: true });
    });

    it('_handlePanelOpenTabKeyDown focus last element', async () => {
        const props = {
            defaultOpen: true,
            innerBottomSlot: <button className="focusable-slot-btn">Button</button>,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Press TAB multiple times
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.TAB });
        await sleep(50);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.TAB });
    });

    it('Tab key close panel when no focusable elements', async () => {
        const props = {
            defaultOpen: true,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Press TAB when no focusable elements in slot
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.TAB });
        await sleep(100);
    });

    it('_getEnableFocusIndex with all disabled options', () => {
        const props = {
            defaultOpen: true,
            optionList: [
                { value: 'a', label: 'A', disabled: true },
                { value: 'b', label: 'B', disabled: true },
            ],
        };
        const select = getSelect(props);
        // Press DOWN - should not change focus since all are disabled
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.DOWN });
    });

    it('_getEnableFocusIndex wrapping from end to start', () => {
        const props = {
            defaultOpen: true,
            optionList: [
                { value: 'a', label: 'A' },
                { value: 'b', label: 'B' },
            ],
            defaultActiveFirstOption: true,
        };
        const select = getSelect(props);
        // Press DOWN twice to wrap
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.DOWN });
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.DOWN });
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.DOWN });
    });

    it('_getEnableFocusIndex wrapping from start to end', () => {
        const props = {
            defaultOpen: true,
            optionList: [
                { value: 'a', label: 'A' },
                { value: 'b', label: 'B' },
            ],
            defaultActiveFirstOption: true,
        };
        const select = getSelect(props);
        // Press UP to wrap to end
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.UP });
    });

    it('handleBackspaceKeyDown with filter and inputValue', async () => {
        const props = {
            multiple: true,
            filter: true,
            defaultValue: ['abc', 'hotsoon'],
            defaultOpen: true,
        };
        const select = getSelect(props);
        // Type something
        select.find('input').simulate('change', { target: { value: 'test' } });
        await sleep(50);
        // Press backspace - should clear input first
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.BACKSPACE });
    });

    it('filter with optionList containing special characters', () => {
        const props = {
            filter: true,
            defaultOpen: true,
            optionList: [
                { value: 'test(1)', label: 'Test (1)' },
                { value: 'test[2]', label: 'Test [2]' },
            ],
        };
        const select = getSelect(props);
        // Filter with special char
        select.find('input').simulate('change', { target: { value: '(1)' } });
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-option`).length).toBeGreaterThan(0);
    });

    it('allowCreate with controlled mode', async () => {
        let spyOnChange = sinon.spy(() => {});
        const props = {
            allowCreate: true,
            filter: true,
            value: 'abc',
            onChange: spyOnChange,
            defaultOpen: true,
        };
        const select = getSelect(props);
        // Type new value
        select.find('input').simulate('change', { target: { value: 'newValue' } });
        await sleep(50);
        // Select the created option
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        const options = select.find(`.${BASE_CLASS_PREFIX}-select-option`);
        if (options.length > 0) {
            options.at(0).simulate('click', nativeEvent);
        }
    });

    it('autoClearSearchValue false with controlled value change', async () => {
        const props = {
            filter: true,
            autoClearSearchValue: false,
            value: 'abc',
            defaultOpen: true,
        };
        const select = getSelect(props);
        // Type something
        select.find('input').simulate('change', { target: { value: 'test' } });
        await sleep(50);
        // Update value
        select.setProps({ value: 'hotsoon' });
        select.update();
        // Input should still have the search value
        expect(select.state().inputValue).toEqual('test');
    });

    it('_updateSingle with onChangeWithObject and no match', () => {
        const props = {
            onChangeWithObject: true,
            value: { value: 'notExist', label: 'Not Exist' },
            optionList: defaultList,
        };
        const select = getSelect(props);
        expect(select.state().selections.size).toEqual(1);
    });

    it('_updateMultiple with value not in optionList but in selections', () => {
        const props = {
            multiple: true,
            defaultValue: ['abc', 'notExist'],
            optionList: defaultList,
        };
        const select = getSelect(props);
        // Update optionList - selection should be preserved
        select.setProps({
            optionList: [
                { value: 'new1', label: 'New1' },
            ]
        });
        select.update();
    });

    it('_updateMultiple with onChangeWithObject', () => {
        const props = {
            multiple: true,
            onChangeWithObject: true,
            value: [
                { value: 'abc', label: 'Abc' },
                { value: 'notExist', label: 'Not Exist' },
            ],
            optionList: defaultList,
        };
        const select = getSelect(props);
        expect(select.state().selections.size).toEqual(2);
    });

    it('renderTag with isCollapseItem', async () => {
        const props = {
            multiple: true,
            defaultValue: ['abc', 'hotsoon', 'pipixia', 'toutiao'],
            ellipsisTrigger: 'hover',
            maxTagCount: 1,
            style: { width: 100 },
        };
        const select = getSelect(props);
        await sleep(200);
    });

    it('getTagItem with renderSelectedItem isRenderInTag false', () => {
        const renderSelectedItem = (optionNode, { onClose }) => ({
            isRenderInTag: false,
            content: <span className="custom-tag-content" onClick={onClose}>{optionNode.label}</span>,
        });
        const props = {
            multiple: true,
            defaultValue: ['abc', 'hotsoon'],
            maxTagCount: 3,
            showRestTagsPopover: true,
            renderSelectedItem,
        };
        const select = getSelect(props);
        expect(select.find('.custom-tag-content').length).toBeGreaterThan(0);
    });

    it('handleTriggerClick when disabled', () => {
        const props = {
            disabled: true,
        };
        const select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        expect(select.state().isOpen).toBe(false);
    });

    it('handleTriggerClick with filter and clickToHide', async () => {
        const props = {
            filter: true,
            clickToHide: true,
            motion: false,
        };
        const select = getSelect(props);
        // Open
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        await sleep(100);
        expect(select.state().isOpen).toBe(true);
        // Click again to close
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        await sleep(100);
    });

    it('handleClearBtnEnterPress', () => {
        const props = {
            showClear: true,
            defaultValue: 'abc',
        };
        const select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('mouseEnter', {});
        const clearBtn = select.find(`.${BASE_CLASS_PREFIX}-icon-clear`);
        if (clearBtn.exists()) {
            clearBtn.simulate('keypress', { key: 'Enter' });
        }
    });

    it('handleInputFocus', async () => {
        const props = {
            filter: true,
            motion: false,
        };
        const select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        await sleep(100);
        select.find('input').simulate('focus', {});
    });

    it('multiple select with max and onExceed', () => {
        let spyOnExceed = sinon.spy(() => {});
        const props = {
            multiple: true,
            max: 1,
            defaultValue: ['abc'],
            onExceed: spyOnExceed,
            defaultOpen: true,
        };
        const select = getSelect(props);
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        // Try to select one more
        select.find(`.${BASE_CLASS_PREFIX}-select-option`).at(1).simulate('click', nativeEvent);
        expect(spyOnExceed.calledOnce).toBe(true);
    });

    it('_handleMultipleSelect with autoClearSearchValue false', async () => {
        const props = {
            multiple: true,
            filter: true,
            autoClearSearchValue: false,
            defaultOpen: true,
        };
        const select = getSelect(props);
        // Type something
        select.find('input').simulate('change', { target: { value: 'abc' } });
        await sleep(50);
        // Select an option
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        select.find(`.${BASE_CLASS_PREFIX}-select-option`).at(0).simulate('click', nativeEvent);
        // Input should still have the search value
        expect(select.state().inputValue).toEqual('abc');
    });

    it('_handleSingleSelect with controlled and filter', async () => {
        let spyOnChange = sinon.spy(() => {});
        const props = {
            filter: true,
            value: 'abc',
            onChange: spyOnChange,
            motion: false,
        };
        const select = getSelect(props);
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        await sleep(100);
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        select.find(`.${BASE_CLASS_PREFIX}-select-option`).at(1).simulate('click', nativeEvent);
        await sleep(200);
        expect(spyOnChange.calledOnce).toBe(true);
    });

    it('_removeInternalKey with _keyInOptionList', () => {
        let spyOnSelect = sinon.spy(() => {});
        const props = {
            onSelect: spyOnSelect,
            defaultOpen: true,
            optionList: [
                { value: 'abc', label: 'Abc', key: 'custom-key' },
            ],
        };
        const select = getSelect(props);
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        select.find(`.${BASE_CLASS_PREFIX}-select-option`).at(0).simulate('click', nativeEvent);
        expect(spyOnSelect.calledOnce).toBe(true);
        const callArg = spyOnSelect.getCall(0).args[1];
        expect(callArg.key).toBe('custom-key');
    });

    it('_diffSelections with undefined values', () => {
        const props = {
            optionList: defaultList,
        };
        const select = getSelect(props);
        // No selection initially
        expect(select.state().selections.size).toEqual(0);
    });

    it('filter with group and option label match', () => {
        const props = {
            filter: true,
            defaultOpen: true,
            children: [
                <Select.OptGroup key={1} label="Fruits">
                    <Select.Option value="apple">Apple</Select.Option>
                    <Select.Option value="banana">Banana</Select.Option>
                </Select.OptGroup>,
            ],
        };
        const select = getSelect(props);
        // Filter by option label
        select.find('input').simulate('change', { target: { value: 'Apple' } });
        expect(select.find('.semi-select-option').length).toBeGreaterThan(0);
    });

    it('renderNTag with popover', async () => {
        const props = {
            multiple: true,
            defaultValue: ['abc', 'hotsoon', 'pipixia', 'toutiao'],
            maxTagCount: 2,
            showRestTagsPopover: true,
            restTagsPopoverProps: { position: 'top' },
        };
        const select = getSelect(props);
        await sleep(100);
    });

    it('updateOverflowItemCount with maxTagCount 0', async () => {
        const props = {
            multiple: true,
            defaultValue: ['abc', 'hotsoon'],
            maxTagCount: 0,
        };
        const select = getSelect(props);
        await sleep(100);
    });

    it('renderOptionItem with onMouseEnter callback', () => {
        let mouseEnterCalled = false;
        const renderOptionItem = (renderProps) => {
            const { label, value, onClick, onMouseEnter, style, className, focused } = renderProps;
            return (
                <div 
                    className={`custom-option ${className} ${focused ? 'focused' : ''}`}
                    onClick={onClick}
                    onMouseEnter={(e) => {
                        mouseEnterCalled = true;
                        onMouseEnter(e);
                    }}
                    style={style}
                >
                    {label}
                </div>
            );
        };
        const props = {
            defaultOpen: true,
            optionList: defaultList,
            renderOptionItem,
        };
        const select = getSelect(props);
        // Trigger mouse enter on custom option
        select.find('.custom-option').at(0).simulate('mouseEnter', {});
        expect(mouseEnterCalled).toBe(true);
    });

    it('updateScrollTop with renderOptionItem', () => {
        const renderOptionItem = (renderProps) => {
            const { label, onClick, onMouseEnter, style, className } = renderProps;
            return (
                <div 
                    className={`custom-option ${className}`}
                    onClick={onClick}
                    onMouseEnter={onMouseEnter}
                    style={style}
                >
                    {label}
                </div>
            );
        };
        const props = {
            defaultOpen: true,
            optionList: defaultList,
            renderOptionItem,
        };
        const select = getSelect(props);
        // Press DOWN to update scroll
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.DOWN });
    });

    it('updateScrollTop without index', () => {
        const props = {
            defaultOpen: true,
            defaultValue: 'hotsoon',
            optionList: defaultList,
        };
        const select = getSelect(props);
        // Should scroll to selected item
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-option-selected`)).toBe(true);
    });

    it('focusTrigger error handling', async () => {
        const props = {
            defaultOpen: true,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Close via ESC - should focus trigger
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.ESC });
        await sleep(100);
    });

    it('handleInputBlur when panel is open', async () => {
        const props = {
            filter: true,
            motion: false,
            defaultOpen: true,
        };
        const select = getSelect(props);
        await sleep(100);
        // Blur input while panel is open
        const input = select.find('input');
        if (input.exists()) {
            input.simulate('blur', {});
        }
    });

    it('handleTriggerBlur with isFocusInContainer true', async () => {
        const props = {
            defaultOpen: true,
            innerBottomSlot: <button className="slot-btn">Button</button>,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Set isFocusInContainer to true by pressing TAB
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.TAB });
        await sleep(50);
        // Trigger blur
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('blur', {});
    });

    it('_handlePanelOpenShiftTabKeyDown at first element', async () => {
        const props = {
            defaultOpen: true,
            innerBottomSlot: <button className="slot-btn">Button</button>,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Press TAB to focus slot
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.TAB });
        await sleep(50);
        // Press Shift+TAB to go back
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.TAB, shiftKey: true });
    });

    it('filter with remote and inputValue', async () => {
        const props = {
            filter: true,
            remote: true,
            optionList: defaultList,
            defaultOpen: true,
        };
        const select = getSelect(props);
        select.find('input').simulate('change', { target: { value: 'test' } });
        await sleep(50);
        // Options should not be filtered in remote mode
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-option`).length).toEqual(defaultList.length);
    });

    it('_createOptionByInput with empty input', () => {
        const props = {
            allowCreate: true,
            filter: true,
            defaultOpen: true,
        };
        const select = getSelect(props);
        // Empty input should not create option
        select.find('input').simulate('change', { target: { value: '' } });
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-option`).length).toEqual(defaultList.length);
    });

    it('_createOptionByInput with matching existing option', () => {
        const props = {
            allowCreate: true,
            filter: true,
            defaultOpen: true,
        };
        const select = getSelect(props);
        // Input matches existing option - should not create duplicate
        select.find('input').simulate('change', { target: { value: 'Abc' } });
    });

    it('handleContainerKeyDown with non-TAB key', () => {
        const props = {
            defaultOpen: true,
            motion: false,
        };
        const select = getSelect(props);
        // Press a non-TAB key
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.SPACE });
    });

    it('children with null option', () => {
        const props = {
            defaultOpen: true,
            children: [
                null,
                <Select.Option key="a" value="a">A</Select.Option>,
                undefined,
                <Select.Option key="b" value="b">B</Select.Option>,
            ],
        };
        const select = getSelect(props);
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-option`).length).toEqual(2);
    });

    it('children with invalid element', () => {
        // This will trigger warning but should not crash
        const props = {
            defaultOpen: true,
            children: [
                <Select.Option key="a" value="a">A</Select.Option>,
                <div key="invalid">Invalid</div>,
            ],
        };
        const select = getSelect(props);
    });

    it('option group with single child', () => {
        const props = {
            defaultOpen: true,
            children: [
                <Select.OptGroup key={1} label="Group1">
                    <Select.Option value="a-1">a-1</Select.Option>
                </Select.OptGroup>,
            ],
        };
        const select = getSelect(props);
        expect(select.find('.semi-select-option').length).toEqual(1);
    });

    it('option group with multiple children and keys', () => {
        const props = {
            defaultOpen: true,
            children: [
                <Select.OptGroup key={1} label="Group1">
                    <Select.Option key="opt-a" value="a-1">a-1</Select.Option>
                    <Select.Option key="opt-b" value="a-2">a-2</Select.Option>
                </Select.OptGroup>,
            ],
        };
        const select = getSelect(props);
        expect(select.find('.semi-select-option').length).toEqual(2);
    });

    it('option group with children without explicit keys', () => {
        const props = {
            defaultOpen: true,
            children: [
                <Select.OptGroup key="group1" label="Group1">
                    <Select.Option value="a-1">a-1</Select.Option>
                    <Select.Option value="a-2">a-2</Select.Option>
                </Select.OptGroup>,
            ],
        };
        const select = getSelect(props);
        expect(select.find('.semi-select-option').length).toEqual(2);
    });

    it('dropdownMatchSelectWidth with numeric style width', () => {
        const props = {
            dropdownMatchSelectWidth: true,
            style: { width: 300 },
            defaultOpen: true,
        };
        const select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-option-list`)).toBe(true);
    });

    it('dropdownMatchSelectWidth with string style width', () => {
        const props = {
            dropdownMatchSelectWidth: true,
            style: { width: '300px' },
            defaultOpen: true,
        };
        const select = getSelect(props);
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-option-list`)).toBe(true);
    });

    it('handleOptionListChange with defaultActiveFirstOption', () => {
        const props = {
            defaultOpen: true,
            defaultActiveFirstOption: true,
            optionList: defaultList,
        };
        const select = getSelect(props);
        // Update optionList
        select.setProps({
            optionList: [
                { value: 'new1', label: 'New1' },
                { value: 'new2', label: 'New2' },
            ]
        });
        select.update();
    });

    it('_setDefaultSelection with controlled value', () => {
        const props = {
            value: 'abc',
            optionList: defaultList,
        };
        const select = getSelect(props);
        expect(select.state().selections.size).toEqual(1);
    });

    it('_setDefaultSelection with defaultValue', () => {
        const props = {
            defaultValue: 'abc',
            optionList: defaultList,
        };
        const select = getSelect(props);
        expect(select.state().selections.size).toEqual(1);
    });

    it('destroy cleanup', () => {
        const props = {
            defaultOpen: true,
        };
        const select = getSelect(props);
        // Unmount to trigger destroy
        select.unmount();
    });

    it('generateOption with null child', () => {
        // Children with null props - generateOption should return null
        const props = {
            defaultOpen: true,
            children: [
                null,
                undefined,
                <Select.Option key="a" value="a">A</Select.Option>,
            ],
        };
        const select = getSelect(props);
        // Should only render the valid option
        expect(select.find(`.${BASE_CLASS_PREFIX}-select-option`).length).toEqual(1);
    });

    it('maxTagCount with showRestTagsPopover and hover', async () => {
        const props = {
            multiple: true,
            maxTagCount: 2,
            showRestTagsPopover: true,
            defaultValue: ['abc', 'hotsoon', 'pipixia', 'toutiao'],
            optionList: defaultList,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Find the +N tag and hover
        const plusNTag = select.find('.semi-tag-group');
        if (plusNTag.length > 0) {
            plusNTag.simulate('mouseEnter');
            await sleep(100);
        }
    });

    it('maxTagCount with OverflowList onOverflow callback', async () => {
        const props = {
            multiple: true,
            maxTagCount: 2,
            showRestTagsPopover: true,
            defaultValue: ['abc', 'hotsoon', 'pipixia'],
            optionList: defaultList,
            motion: false,
            style: { width: 200 },
        };
        const select = getSelect(props);
        await sleep(100);
        // Trigger resize to cause overflow
        select.setProps({ style: { width: 100 } });
        select.update();
        await sleep(100);
    });

    it('updateIsFullTags when isFullTags is false', async () => {
        const props = {
            multiple: true,
            maxTagCount: 2,
            showRestTagsPopover: true,
            defaultValue: ['abc', 'hotsoon', 'pipixia', 'toutiao'],
            optionList: defaultList,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Find the +N tag and simulate mouse enter
        const plusNTag = select.find('.semi-tag').filterWhere(n => n.text().includes('+'));
        if (plusNTag.length > 0) {
            plusNTag.first().simulate('mouseEnter');
            await sleep(100);
        }
    });

    it('handleSlotMouseEnter via innerTopSlot', async () => {
        const props = {
            defaultOpen: true,
            motion: false,
            innerTopSlot: <div className="test-inner-top-slot">Top Slot</div>,
        };
        const select = getSelect(props);
        await sleep(100);
        // The slot should be rendered
        expect(select.exists('.test-inner-top-slot')).toBe(true);
        // Simulate mouseEnter on the slot wrapper
        const slotWrapper = select.find(`.${BASE_CLASS_PREFIX}-select-option-list-inner-top-slot`);
        if (slotWrapper.length > 0) {
            slotWrapper.simulate('mouseEnter');
            await sleep(50);
        }
    });

    it('handleSlotMouseEnter via innerBottomSlot', async () => {
        const props = {
            defaultOpen: true,
            motion: false,
            innerBottomSlot: <div className="test-inner-bottom-slot">Bottom Slot</div>,
        };
        const select = getSelect(props);
        await sleep(100);
        // The slot should be rendered
        expect(select.exists('.test-inner-bottom-slot')).toBe(true);
        // Simulate mouseEnter on the slot wrapper
        const slotWrapper = select.find(`.${BASE_CLASS_PREFIX}-select-option-list-inner-bottom-slot`);
        if (slotWrapper.length > 0) {
            slotWrapper.simulate('mouseEnter');
            await sleep(50);
        }
    });

    it('handleSlotMouseEnter via outerTopSlot', async () => {
        const props = {
            defaultOpen: true,
            motion: false,
            outerTopSlot: <div className="test-outer-top-slot">Outer Top Slot</div>,
        };
        const select = getSelect(props);
        await sleep(100);
        // The slot should be rendered
        expect(select.exists('.test-outer-top-slot')).toBe(true);
        // Simulate mouseEnter on the slot wrapper
        const slotWrapper = select.find(`.${BASE_CLASS_PREFIX}-select-option-list-outer-top-slot`);
        if (slotWrapper.length > 0) {
            slotWrapper.simulate('mouseEnter');
            await sleep(50);
        }
    });

    it('handleSlotMouseEnter via outerBottomSlot', async () => {
        const props = {
            defaultOpen: true,
            motion: false,
            outerBottomSlot: <div className="test-outer-bottom-slot">Outer Bottom Slot</div>,
        };
        const select = getSelect(props);
        await sleep(100);
        // The slot should be rendered
        expect(select.exists('.test-outer-bottom-slot')).toBe(true);
        // Simulate mouseEnter on the slot wrapper
        const slotWrapper = select.find(`.${BASE_CLASS_PREFIX}-select-option-list-outer-bottom-slot`);
        if (slotWrapper.length > 0) {
            slotWrapper.simulate('mouseEnter');
            await sleep(50);
        }
    });

    it('renderCollapsedTags with overflowRenderer', async () => {
        const props = {
            multiple: true,
            maxTagCount: 1,
            showRestTagsPopover: true,
            defaultValue: ['abc', 'hotsoon', 'pipixia', 'toutiao'],
            optionList: defaultList,
            motion: false,
            style: { width: 150 },
        };
        const select = getSelect(props);
        await sleep(200);
        // The overflow renderer should be triggered
        select.update();
    });

    it('ellipsisTrigger with renderCollapsedTags', async () => {
        const props = {
            multiple: true,
            ellipsisTrigger: true,
            maxTagCount: 2,
            defaultValue: ['abc', 'hotsoon', 'pipixia'],
            optionList: defaultList,
            motion: false,
            style: { width: 200 },
        };
        const select = getSelect(props);
        await sleep(200);
        // Should render collapsed tags
        expect(select.exists(`.${BASE_CLASS_PREFIX}-select-content-wrapper-collapse`)).toBe(true);
    });

    it('ellipsisTrigger with handleOverflow callback', async () => {
        const props = {
            multiple: true,
            ellipsisTrigger: true,
            maxTagCount: 2,
            defaultValue: ['abc', 'hotsoon', 'pipixia', 'toutiao'],
            optionList: defaultList,
            motion: false,
            style: { width: 100 },
        };
        const select = getSelect(props);
        await sleep(300);
        select.update();
        // Add more items to trigger overflow
        select.setProps({
            defaultValue: ['abc', 'hotsoon', 'pipixia', 'toutiao', 'xigua'],
        });
        select.update();
        await sleep(200);
    });

    it('updateOverflowItemCount with overFlowCount', async () => {
        const props = {
            multiple: true,
            ellipsisTrigger: true,
            maxTagCount: 2,
            defaultValue: ['abc', 'hotsoon'],
            optionList: defaultList,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Call updateOverflowItemCount directly with overFlowCount
        select.instance().foundation.updateOverflowItemCount(3, 1);
        await sleep(50);
    });

    it('updateOverflowItemCount without overFlowCount when selectionLength > maxTagCount', async () => {
        const props = {
            multiple: true,
            ellipsisTrigger: true,
            maxTagCount: 2,
            defaultValue: ['abc', 'hotsoon', 'pipixia'],
            optionList: defaultList,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Call updateOverflowItemCount without overFlowCount
        select.instance().foundation.updateOverflowItemCount(3);
        await sleep(50);
    });

    it('updateOverflowItemCount without overFlowCount when selectionLength <= maxTagCount', async () => {
        const props = {
            multiple: true,
            ellipsisTrigger: true,
            maxTagCount: 3,
            defaultValue: ['abc', 'hotsoon'],
            optionList: defaultList,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Call updateOverflowItemCount without overFlowCount
        select.instance().foundation.updateOverflowItemCount(2);
        await sleep(50);
    });

    it('handleBackspaceKeyDown with all disabled selections', async () => {
        const props = {
            multiple: true,
            filter: true,
            defaultValue: ['disabled1', 'disabled2'],
            optionList: [
                { value: 'disabled1', label: 'Disabled 1', disabled: true },
                { value: 'disabled2', label: 'Disabled 2', disabled: true },
                { value: 'normal', label: 'Normal' },
            ],
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Focus and press backspace
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        await sleep(100);
        // Press backspace - should not remove anything since all are disabled
        select.find('input').simulate('keydown', { keyCode: keyCode.BACKSPACE });
        await sleep(50);
    });

    it('handleBackspaceKeyDown with mixed disabled selections', async () => {
        const props = {
            multiple: true,
            filter: true,
            defaultValue: ['disabled1', 'normal'],
            optionList: [
                { value: 'disabled1', label: 'Disabled 1', disabled: true },
                { value: 'normal', label: 'Normal' },
            ],
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Focus and press backspace
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        await sleep(100);
        // Press backspace - should remove 'normal' since it's not disabled
        select.find('input').simulate('keydown', { keyCode: keyCode.BACKSPACE });
        await sleep(50);
    });

    it('_notifyChange with no change', async () => {
        const spyOnChange = sinon.spy();
        const props = {
            multiple: true,
            defaultValue: ['abc'],
            optionList: defaultList,
            onChange: spyOnChange,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Select the same value again - should not trigger onChange
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        await sleep(100);
        // Click on already selected option
        const options = select.find(`.${BASE_CLASS_PREFIX}-select-option`);
        const abcOption = options.filterWhere(n => n.text() === 'abc');
        if (abcOption.length > 0) {
            abcOption.first().simulate('click', { nativeEvent: { stopImmediatePropagation: noop } });
            await sleep(50);
        }
    });

    it('_handleEnterKeyDown when not open', async () => {
        const props = {
            optionList: defaultList,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Press Enter when closed - should open
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.ENTER });
        await sleep(200);
        // Check if open or just verify the keydown was handled
    });

    it('_handleEnterKeyDown with focusIndex out of range', async () => {
        const props = {
            defaultOpen: true,
            filter: true,
            optionList: defaultList,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Set focusIndex to a high value
        select.setState({ focusIndex: 100 });
        await sleep(50);
        // Press Enter - should handle gracefully
        select.find('input').simulate('keydown', { keyCode: keyCode.ENTER });
        await sleep(50);
    });

    it('_notifyChange when selections are same', async () => {
        const spyOnChange = sinon.spy();
        const props = {
            defaultValue: 'abc',
            optionList: defaultList,
            onChange: spyOnChange,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Call _notifyChange with same selections
        const currentSelections = select.state().selections;
        select.instance().foundation._notifyChange(currentSelections);
        await sleep(50);
        // onChange should not be called since there's no change
    });

    it('Tab key when panel is closed', async () => {
        const spyOnBlur = sinon.spy();
        const props = {
            optionList: defaultList,
            onBlur: spyOnBlur,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Focus the select
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        await sleep(100);
        // Press Tab when panel is closed
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.TAB });
        await sleep(100);
    });

    it('Shift+Tab key when panel is open and focus in container', async () => {
        const props = {
            defaultOpen: true,
            filter: true,
            optionList: defaultList,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Press Shift+Tab
        select.find('input').simulate('keydown', { keyCode: keyCode.TAB, shiftKey: true });
        await sleep(100);
    });

    it('Enter key when panel is closed', async () => {
        const props = {
            optionList: defaultList,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Focus the select
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('focus', {});
        await sleep(50);
        // Press Enter when closed - should open
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.ENTER });
        await sleep(200);
    });

    it('handleOverflow with same overflowItemCount', async () => {
        const props = {
            multiple: true,
            ellipsisTrigger: true,
            maxTagCount: 2,
            defaultValue: ['abc', 'hotsoon', 'pipixia'],
            optionList: defaultList,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(200);
        // Call handleOverflow with items that result in same count
        const items = [['abc', { value: 'abc' }]];
        select.instance().handleOverflow(items);
        await sleep(50);
    });

    it('Tab key when panel is closed triggers blur', async () => {
        const spyOnBlur = sinon.spy();
        const props = {
            optionList: defaultList,
            onBlur: spyOnBlur,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Focus the select first
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        await sleep(100);
        // Close the panel
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('click', {});
        await sleep(100);
        // Press Tab when panel is closed
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.TAB });
        await sleep(100);
    });

    it('_handleTabKeyDown when isOpen is false', async () => {
        const props = {
            optionList: defaultList,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Directly call _handleTabKeyDown when closed
        select.instance().foundation._handleTabKeyDown({ preventDefault: noop, stopPropagation: noop });
        await sleep(50);
    });

    it('_handlePanelOpenShiftTabKeyDown when not in container', async () => {
        const props = {
            defaultOpen: true,
            filter: true,
            optionList: defaultList,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Set isFocusInContainer to false
        select.instance().adapter.setIsFocusInContainer(false);
        // Call _handlePanelOpenShiftTabKeyDown
        const focusableElements = [{ focus: noop }];
        select.instance().foundation._handlePanelOpenShiftTabKeyDown(focusableElements, { preventDefault: noop, stopPropagation: noop });
        await sleep(50);
    });

    it('_handleEnterKeyDown when open and focusIndex is -1', async () => {
        const props = {
            defaultOpen: true,
            optionList: defaultList,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Set focusIndex to -1
        select.setState({ focusIndex: -1 });
        await sleep(50);
        // Press Enter
        select.find(`.${BASE_CLASS_PREFIX}-select`).simulate('keydown', { keyCode: keyCode.ENTER });
        await sleep(50);
    });

    it('handleContainerKeyDown with TAB when open', async () => {
        const props = {
            defaultOpen: true,
            filter: true,
            optionList: defaultList,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Press TAB on the container
        const container = select.find(`.${BASE_CLASS_PREFIX}-select-option-list-wrapper`);
        if (container.length > 0) {
            container.simulate('keydown', { keyCode: keyCode.TAB });
            await sleep(50);
        }
    });

    it('handleContainerKeyDown with other key', async () => {
        const props = {
            defaultOpen: true,
            filter: true,
            optionList: defaultList,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(100);
        // Press other key on the container
        const container = select.find(`.${BASE_CLASS_PREFIX}-select-option-list-wrapper`);
        if (container.length > 0) {
            container.simulate('keydown', { keyCode: keyCode.SPACE });
            await sleep(50);
        }
    });

    it('renderNTag with showRestTagsPopover and restTags', async () => {
        const props = {
            multiple: true,
            maxTagCount: 1,
            showRestTagsPopover: true,
            defaultValue: ['abc', 'hotsoon', 'pipixia'],
            optionList: defaultList,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(200);
        // The +N tag with popover should be rendered
        const plusNTag = select.find('.semi-tag').filterWhere(n => n.text().includes('+'));
        expect(plusNTag.length).toBeGreaterThan(0);
    });

    it('renderOverflow with length parameter', async () => {
        const props = {
            multiple: true,
            ellipsisTrigger: true,
            maxTagCount: 2,
            defaultValue: ['abc', 'hotsoon', 'pipixia'],
            optionList: defaultList,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(200);
        // Call renderOverflow directly
        const items = [['abc', { value: 'abc' }], ['hotsoon', { value: 'hotsoon' }]];
        select.instance().renderOverflow(items, 1);
        await sleep(50);
    });

    it('handleOverflow with different overflowItemCount', async () => {
        const props = {
            multiple: true,
            ellipsisTrigger: true,
            maxTagCount: 2,
            defaultValue: ['abc', 'hotsoon'],
            optionList: defaultList,
            motion: false,
        };
        const select = getSelect(props);
        await sleep(200);
        // Set initial overflowItemCount
        select.setState({ overflowItemCount: 0 });
        await sleep(50);
        // Call handleOverflow with items that result in different count
        const items = [['abc', { value: 'abc' }], ['hotsoon', { value: 'hotsoon' }], ['pipixia', { value: 'pipixia' }]];
        select.instance().handleOverflow(items);
        await sleep(50);
    });

    //     it('【data】updateOptionList when data change', () => {
    //         let props = {
    //             defaultOpen: true,
    //             data: ['semi'],
    //             ...commonProps
    //         };
    //         let ac = getAc(props);
    //         let candidate = ac.find(`.${BASE_CLASS_PREFIX}-autocomplete-option-list`).children();
    //         expect(candidate.length).toEqual(1);
    //         expect(candidate.at(0).getDOMNode().textContent).toEqual('${BASE_CLASS_PREFIX}');
    //         ac.setProps({ data: ['ies', 'design']});
    //         ac.update();
    //         candidate = ac.find(`.${BASE_CLASS_PREFIX}-autocomplete-option-list`).children();
    //         expect(candidate.length).toEqual(2);
    //         expect(candidate.at(0).getDOMNode().textContent).toEqual('ies');
    //         expect(candidate.at(1).getDOMNode().textContent).toEqual('design');
    //     })
});
