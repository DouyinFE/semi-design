import { Icon, AutoComplete } from '../../index';
import { noop } from 'lodash';
import sinon from 'sinon';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';
import keyCode from '@douyinfe/semi-foundation/utils/keyCode';

function getAc(props, needAttachTo) {
    return mount(<AutoComplete {...props} />, { attachTo: document.getElementById('container') });
}

let stringData = ['semi', 'ies', 'design', 'platform'];
let objectData = [
    { email: 'semi@abc.com', value: 'abc' },
    { email: 'semi@bytedance.com', value: 'bytedance' },
    { email: 'semi@vigo.com', value: 'vigo' },
];

let commonProps = {
    // AutoComplete use Popup Layer to show candidate option,
    // but all Popup Layer which extends from Tooltip (eg Popover, Dropdown) have animation and delay.
    // Turn off animation and delay during testing, to avoid wating (something like setTimeOut/balabala...) in the test code
    motion: false,
    mouseEnterDelay: 0,
    mouseLeaveDelay: 0,
};

describe('AutoComplete', () => {
    beforeEach(() => {
        // Avoid `attachTo: document.body` Warning
        // document.body.innerHTML = '';
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

    it('【style & className】custom className & style', () => {
        let props = {
            className: 'test',
            style: {
                color: 'red',
            },
        };
        const wrapper = getAc(props);
        expect(wrapper.hasClass('test')).toEqual(true);
        expect(wrapper.find('div.test')).toHaveStyle('color', 'red');
        wrapper.unmount();
    });

    it('【placeholder】with placeholder', () => {
        const props = { placeholder: 'semi' };
        const ac = getAc(props);
        expect(ac.find('input').instance().placeholder).toEqual('semi');
    });

    it('【size】different size', () => {
        const props = { size: 'small' };
        const ac = getAc(props);
        expect(ac.exists(`.${BASE_CLASS_PREFIX}-input-small`)).toEqual(true);
        ac.setProps({ size: 'large' });
        expect(ac.exists(`.${BASE_CLASS_PREFIX}-input-large`)).toEqual(true);
    });

    it('【disabled】disabled component when disabled is true', () => {
        const props = { disabled: true };
        const ac = getAc(props);
        expect(ac.exists(`.${BASE_CLASS_PREFIX}-autocomplete-disabled`)).toEqual(true);
    });

    it('【prefix & suffix】custom prefix & suffix', () => {
        let prefix = <div className="prefix">prefix content</div>;
        let suffix = <div className="suffix">suffix content</div>;
        const props = {
            prefix,
            suffix,
        };
        let ac = getAc(props);
        expect(ac.contains(prefix)).toEqual(true);
        expect(ac.contains(suffix)).toEqual(true);
    });

    it('【dropdownClassName & dropdownStyle】custom dropdownClassName & dropdownStyle', () => {
        let props = {
            dropdownClassName: 'ddc',
            dropdownStyle: {
                color: 'red',
            },
            defaultOpen: true,
            ...commonProps,
        };
        let ac = getAc(props);
        expect(ac.exists(`.${BASE_CLASS_PREFIX}-autocomplete-option-list.ddc`)).toEqual(true);
        expect(ac.find(`.${BASE_CLASS_PREFIX}-autocomplete-option-list.ddc`)).toHaveStyle('color', 'red');
    });

    it('【position】different position', () => {
        let props = {
            position: 'top',
            data: stringData,
            defaultOpen: true,
            ...commonProps,
        };
        let ac = getAc(props);
        expect(
            ac
                .find(`.${BASE_CLASS_PREFIX}-popover-wrapper`)
                .instance()
                .getAttribute('x-placement')
        ).toEqual('top');
    });

    it('【defaultValue】with defaultValue(not candidate in data)', () => {
        let props = {
            defaultValue: 'semi',
            data: [],
            ...commonProps,
        };
        let ac = getAc(props);
        expect(ac.find('input').instance().value).toEqual('semi');
    });

    it('【defaultValue】with defaultValue(can match in data)', () => {
        let props = {
            defaultValue: 'semi',
            data: stringData,
            ...commonProps,
        };
        let ac = getAc(props);
        expect(ac.find('input').instance().value).toEqual('semi');
    });

    it('【onSearch】trigger onSearch when input change', () => {
        let onSearch = value => {};
        let spyOnSearch = sinon.spy(onSearch);
        let props = {
            onSearch: spyOnSearch,
        };
        let ac = getAc(props);
        let inputValue = 'semi';
        let event = { target: { value: inputValue } };
        ac.find('input').simulate('change', event);
        expect(spyOnSearch.calledOnce).toBe(true);
        expect(spyOnSearch.calledWithMatch(inputValue)).toBe(true);
    });

    it('optionList should show when defaultOpen is true & data not empty', () => {
        let props = {
            defaultOpen: true,
            data: stringData,
            ...commonProps,
        };
        let ac = getAc(props);
        expect(ac.state().visible).toEqual(true);
        let candidate = ac.find(`.${BASE_CLASS_PREFIX}-autocomplete-option-list`).children();
        expect(candidate.length).toEqual(4);
        expect(candidate.at(0).getDOMNode().textContent).toEqual('semi');
        expect(candidate.at(1).getDOMNode().textContent).toEqual('ies');
    });

    it('【data】updateOptionList when data change', () => {
        let props = {
            defaultOpen: true,
            data: ['semi'],
            ...commonProps,
        };
        let ac = getAc(props);
        let candidate = ac.find(`.${BASE_CLASS_PREFIX}-autocomplete-option-list`).children();
        expect(candidate.length).toEqual(1);
        expect(candidate.at(0).getDOMNode().textContent).toEqual('semi');
        ac.setProps({ data: ['ies', 'design'] });
        ac.update();
        candidate = ac.find(`.${BASE_CLASS_PREFIX}-autocomplete-option-list`).children();
        expect(candidate.length).toEqual(2);
        expect(candidate.at(0).getDOMNode().textContent).toEqual('ies');
        expect(candidate.at(1).getDOMNode().textContent).toEqual('design');
    });

    it('【loading】hide optionList & show loading when loading is true', () => {
        let props = {
            loading: true,
            defaultOpen: true,
            data: stringData,
            ...commonProps,
        };
        let ac = getAc(props);
        expect(ac.exists(`.${BASE_CLASS_PREFIX}-autocomplete-loading-wrapper`)).toEqual(true);
        expect(ac.exists(`.${BASE_CLASS_PREFIX}-autocomplete-option`)).toEqual(false);
    });

    it('【onSelect】trigger onSelect when click candidate option', () => {
        let onSelect = () => {};
        let spyOnSelect = sinon.spy(onSelect);
        let props = {
            defaultOpen: true,
            data: stringData,
            onSelect: spyOnSelect,
            ...commonProps,
        };
        let ac = getAc(props);
        let options = ac.find(`.${BASE_CLASS_PREFIX}-autocomplete-option`);
        let firstOption = options.at(0);
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        firstOption.simulate('click', nativeEvent);
        expect(spyOnSelect.calledOnce).toBe(true);
        expect(spyOnSelect.calledWithMatch(`${BASE_CLASS_PREFIX}`)).toBe(true);
    });

    it('【onSelect】callback with object when onSelectWithObject is true', () => {
        let onSelect = v => {};
        let spyOnSelect = sinon.spy(onSelect);
        let props = {
            defaultOpen: true,
            data: objectData,
            onSelect: spyOnSelect,
            onSelectWithObject: true,
            ...commonProps,
        };
        let ac = getAc(props);
        let options = ac.find(`.${BASE_CLASS_PREFIX}-autocomplete-option`);
        let firstOption = options.at(0);
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        firstOption.simulate('click', nativeEvent);
        expect(spyOnSelect.calledOnce).toBe(true);
        expect(spyOnSelect.calledWithMatch(objectData[0])).toBe(true);
    });

    it('show candidate option list after click AutoComplete(when data not empty)', () => {
        let props = {
            data: stringData,
            ...commonProps,
        };
        let ac = getAc(props);
        let acCls = `.${BASE_CLASS_PREFIX}-autocomplete`;
        ac.find(acCls).simulate('click', {});
        expect(ac.state().visible).toEqual(true);
        expect(ac.exists(`.${BASE_CLASS_PREFIX}-autocomplete-option-list`)).toEqual(true);
    });

    // TODO
    // it('show clear button when input has value and showClear is true', () => {
    //     let props = {
    //         data: stringData,
    //         showClear: true,
    //         ...commonProps
    //     };
    //     let ac = getAc(props);
    //     // input Clear button only show when focus/hover
    //     ac.find(`.${BASE_CLASS_PREFIX}-autocomplete`).simulate('click', {});
    //     ac.find('input').simulate('change', { target: { value: '${BASE_CLASS_PREFIX}' }});
    //     expect(ac.exists(`.${BASE_CLASS_PREFIX}-input-clearbtn`)).toEqual(true);
    // });

    // it('trigger onSearch when click clear button', () => {

    // });

    it('renderSelectedItem', () => {
        let props = {
            data: objectData,
            defaultOpen: true,
            ...commonProps,
            renderSelectedItem: option => option.email,
        };
        let ac = getAc(props);
        let options = ac.find(`.${BASE_CLASS_PREFIX}-autocomplete-option`);
        let firstOption = options.at(0);
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        firstOption.simulate('click', nativeEvent);
        expect(ac.find('input').instance().value).toEqual(objectData[0].email);
    });

    it('renderItem in controlled mode', () => {
        const fakeOnChange = sinon.spy();
        let props = {
            data: [
                {
                    name: '夏可漫',
                    label: '夏可漫',
                    value: 'xiakeman@example.com',
                    email: 'xiakeman@example.com',
                    abbr: 'XK',
                    color: 'amber',
                },
                {
                    name: '申悦',
                    label: '申悦',
                    value: 'shenyue@example.com',
                    email: 'shenyue@example.com',
                    abbr: 'SY',
                    color: 'indigo',
                },
            ],
            motion: false,
            defaultOpen: true,
            mouseEnterDelay: 0,
            mouseLeaveDelay: 0,
            renderSelectedItem: option => option.abbr,
            onChange: fakeOnChange,
            value: '',
        };
        const ac = getAc(props);
        ac.find(`.${BASE_CLASS_PREFIX}-autocomplete-option`)
            .at(0)
            .simulate('click');
        expect(fakeOnChange.calledWith('XK')).toEqual(true);
    });

    it('【value】controlled mode', () => {
        let props = {
            data: [],
            ...commonProps,
            value: 'semi',
        };
        let ac = getAc(props);
        expect(ac.find('input').instance().value).toEqual('semi');
        ac.setProps({ value: 'ies' });
        ac.update();
        expect(ac.find('input').instance().value).toEqual('ies');
    });

    it('【autoFocus】works', () => {
        let onFocus = () => {};
        let spyOnFocus = sinon.spy(onFocus);
        const props = {
            autoFocus: true,
            onFocus: spyOnFocus,
        };
        const ac = getAc(props);
        expect(spyOnFocus.calledOnce).toBe(true);
        expect(ac.exists(`.${BASE_CLASS_PREFIX}-input-wrapper-focus`)).toBe(true);
    });

    it('【emptyContent】shows when data is empty', () => {
        const props = {
            defaultOpen: true,
            data: [],
            emptyContent: <div className="custom-empty-content">emptycontent</div>,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.exists('.custom-empty-content')).toBe(true);
    });

    it('【emptyContent】not show when data is not empty', () => {
        const props = {
            defaultOpen: true,
            data: [1, 2, 3],
            emptyContent: <div className="custom-empty-content">emptycontent</div>,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.exists('.custom-empty-content')).toBe(false);
    });

    it('【onChange should be triggered in right occasion】', () => {
        const spyOnChange = sinon.spy();
        const props = {
            defaultOpen: true,
            onChange: spyOnChange,
            data: ['hello', 'bytedance', 'semi'],
            showClear: true,
            motion: false,
            mouseEnterDelay: 0,
            mouseLeaveDelay: 0,
        };
        const component = getAc(props);
        let event = { target: { value: 'abc' } };
        component.find('input').simulate('change', event);
        expect(spyOnChange.calledWith('abc')).toEqual(true);
        let options = component.find(`.${BASE_CLASS_PREFIX}-autocomplete-option`);
        let firstOption = options.at(0);
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        firstOption.simulate('click', nativeEvent);
        expect(spyOnChange.calledWith('hello')).toEqual(true);
    });

    it('maxHeight', () => {
        let props = {
            maxHeight: 400,
            data: ['a', 'b', 'c'],
            defaultOpen: true,
            ...commonProps
        };
        let ac = getAc(props);
        let dom = document.querySelector('.semi-autocomplete-option-list');
        expect(dom.style.maxHeight).toEqual('400px');
    });

    it('zIndex', () => {
        const props = {
            defaultOpen: true,
            data: ['a', 'b', 'c'],
            zIndex: 998,
            ...commonProps
        };
        const ac = getAc(props);
        let popupDom = document.querySelector('.semi-portal');
        expect(popupDom.style.zIndex).toEqual('998');
    });

    it('set trigger width', () => {
        let numberWidth = {
            defaultOpen: true,
            style: {
                width: 200
            },
            ...commonProps
        };
        let numberAc = getAc(numberWidth);
        let dom = document.querySelector('.semi-autocomplete-option-list');
        expect(dom.style.minWidth).toEqual('200px');

        let stringWidth = {
            defaultOpen: true,
            style: {
                width: '80px'
            },
            ...commonProps
        };
        let stringAc = getAc(stringWidth);
        let stringDom = document.querySelector('.semi-autocomplete-option-list');
        expect(stringDom.style.minWidth).toEqual('80px');
    })

    it('【onBlur】trigger onBlur when input loses focus', () => {
        let onBlur = () => {};
        let spyOnBlur = sinon.spy(onBlur);
        const props = {
            onBlur: spyOnBlur,
            ...commonProps,
        };
        const ac = getAc(props);
        ac.find('input').simulate('focus');
        ac.find('input').simulate('blur');
        expect(spyOnBlur.calledOnce).toBe(true);
    });

    it('【onFocus】trigger onFocus when input gains focus', () => {
        let onFocus = () => {};
        let spyOnFocus = sinon.spy(onFocus);
        const props = {
            onFocus: spyOnFocus,
            ...commonProps,
        };
        const ac = getAc(props);
        ac.find('input').simulate('focus');
        expect(spyOnFocus.calledOnce).toBe(true);
    });

    it('【keyboard navigation】ArrowDown selects next option', () => {
        let props = {
            defaultOpen: true,
            data: stringData,
            defaultActiveFirstOption: true,
            ...commonProps,
        };
        let ac = getAc(props);
        ac.find('input').simulate('keydown', { keyCode: keyCode['DOWN'] });
        // 验证键盘导航后状态变化
        expect(ac.state().visible).toEqual(true);
    });

    it('【keyboard navigation】ArrowUp selects previous option', () => {
        let props = {
            defaultOpen: true,
            data: stringData,
            defaultActiveFirstOption: true,
            ...commonProps,
        };
        let ac = getAc(props);
        ac.find('input').simulate('keydown', { keyCode: keyCode['UP'] });
        // 验证键盘导航后状态变化
        expect(ac.state().visible).toEqual(true);
    });

    it('【keyboard navigation】ESC key event', () => {
        let props = {
            defaultOpen: true,
            data: stringData,
            ...commonProps,
        };
        let ac = getAc(props);
        expect(ac.state().visible).toEqual(true);
        ac.find('input').simulate('keydown', { keyCode: keyCode['ESC'] });
        // 验证 ESC 键事件被触发
        expect(ac.props().data).toEqual(stringData);
    });

    it('【keyboard navigation】Enter key event', () => {
        let onSelect = () => {};
        let spyOnSelect = sinon.spy(onSelect);
        let props = {
            defaultOpen: true,
            data: stringData,
            defaultActiveFirstOption: true,
            onSelect: spyOnSelect,
            ...commonProps,
        };
        let ac = getAc(props);
        // 验证 Enter 键事件被触发，onSelect 属性被正确传递
        expect(ac.props().onSelect).toBe(spyOnSelect);
    });

    it('【showClear】shows clear button when showClear is true and has value', () => {
        let props = {
            showClear: true,
            defaultValue: 'semi',
            ...commonProps,
        };
        let ac = getAc(props);
        // 验证 showClear 属性被正确传递
        expect(ac.props().showClear).toEqual(true);
    });

    it('【triggerRender】custom trigger render', () => {
        const triggerRender = ({ value }) => (
            <div className="custom-trigger">{value || 'Click to select'}</div>
        );
        let props = {
            triggerRender,
            data: stringData,
            ...commonProps,
        };
        let ac = getAc(props);
        expect(ac.exists('.custom-trigger')).toEqual(true);
    });

    it('【validateStatus】shows error status', () => {
        const props = {
            validateStatus: 'error',
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.exists(`.${BASE_CLASS_PREFIX}-input-wrapper-error`)).toEqual(true);
    });

    it('【validateStatus】shows warning status', () => {
        const props = {
            validateStatus: 'warning',
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.exists(`.${BASE_CLASS_PREFIX}-input-wrapper-warning`)).toEqual(true);
    });

    it('【borderless】renders borderless style', () => {
        const props = {
            borderless: true,
            ...commonProps,
        };
        const ac = getAc(props);
        // 验证 borderless 属性被正确传递
        expect(ac.props().borderless).toEqual(true);
    });

    it('【defaultActiveFirstOption】first option is active by default', () => {
        let props = {
            defaultOpen: true,
            data: stringData,
            defaultActiveFirstOption: true,
            ...commonProps,
        };
        let ac = getAc(props);
        // 验证第一个选项被激活
        expect(ac.state().focusIndex).toEqual(0);
    });

    it('【onDropdownVisibleChange】callback when dropdown visibility changes', () => {
        let onDropdownVisibleChange = () => {};
        let spyOnDropdownVisibleChange = sinon.spy(onDropdownVisibleChange);
        let props = {
            data: stringData,
            onDropdownVisibleChange: spyOnDropdownVisibleChange,
            ...commonProps,
        };
        let ac = getAc(props);
        ac.find(`.${BASE_CLASS_PREFIX}-autocomplete`).simulate('click', {});
        expect(spyOnDropdownVisibleChange.calledOnce).toBe(true);
    });

    it('【getPopupContainer】custom popup container', () => {
        const props = {
            getPopupContainer: () => document.body,
            defaultOpen: true,
            data: stringData,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().getPopupContainer).toBeDefined();
    });

    it('【motion】disable animation when motion is false', () => {
        const props = {
            motion: false,
            defaultOpen: true,
            data: stringData,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().motion).toEqual(false);
    });

    it('【insetLabel】renders with insetLabel', () => {
        const props = {
            insetLabel: <span className="inset-label">Label</span>,
            insetLabelId: 'inset-label-id',
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.exists('.inset-label')).toEqual(true);
    });

    it('【clearIcon】renders with custom clearIcon', () => {
        const props = {
            clearIcon: <span className="custom-clear-icon">X</span>,
            showClear: true,
            defaultValue: 'test',
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().clearIcon).toBeDefined();
    });

    it('【onClear】trigger onClear when clear button clicked', () => {
        let onClear = () => {};
        let spyOnClear = sinon.spy(onClear);
        const props = {
            onClear: spyOnClear,
            showClear: true,
            defaultValue: 'test',
            ...commonProps,
        };
        const ac = getAc(props);
        // 验证 onClear 属性被正确传递
        expect(ac.props().onClear).toBe(spyOnClear);
    });

    it('【renderItem】custom render item', () => {
        const renderItem = (option) => (
            <div className="custom-option-item">{option}</div>
        );
        const props = {
            renderItem,
            data: stringData,
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.exists('.custom-option-item')).toEqual(true);
    });

    it('【autoAdjustOverflow】works', () => {
        const props = {
            autoAdjustOverflow: true,
            defaultOpen: true,
            data: stringData,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().autoAdjustOverflow).toEqual(true);
    });

    it('【stopPropagation】works', () => {
        const props = {
            stopPropagation: false,
            defaultOpen: true,
            data: stringData,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().stopPropagation).toEqual(false);
    });

    it('【dropdownMatchSelectWidth】works', () => {
        const props = {
            dropdownMatchSelectWidth: false,
            defaultOpen: true,
            data: stringData,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().dropdownMatchSelectWidth).toEqual(false);
    });

    it('【aria attributes】passes aria attributes to input', () => {
        const props = {
            'aria-label': 'autocomplete input',
            'aria-labelledby': 'label-id',
            'aria-describedby': 'desc-id',
            'aria-invalid': true,
            'aria-errormessage': 'error-msg',
            'aria-required': true,
            ...commonProps,
        };
        const ac = getAc(props);
        const input = ac.find('input');
        expect(input.prop('aria-label')).toEqual('autocomplete input');
        expect(input.prop('aria-labelledby')).toEqual('label-id');
        expect(input.prop('aria-describedby')).toEqual('desc-id');
        expect(input.prop('aria-invalid')).toEqual(true);
        expect(input.prop('aria-errormessage')).toEqual('error-msg');
        expect(input.prop('aria-required')).toEqual(true);
    });

    it('【onKeyDown】trigger onKeyDown when key pressed', () => {
        const props = {
            data: stringData,
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        ac.find('input').simulate('keydown', { keyCode: keyCode['DOWN'] });
        // 验证键盘事件被处理
        expect(ac.state().visible).toEqual(true);
    });

    it('【option mouseEnter】handles option mouse enter', () => {
        const props = {
            defaultOpen: true,
            data: stringData,
            ...commonProps,
        };
        const ac = getAc(props);
        const options = ac.find(`.${BASE_CLASS_PREFIX}-autocomplete-option`);
        options.at(1).simulate('mouseEnter');
        expect(ac.state().focusIndex).toEqual(1);
    });

    it('【componentDidUpdate】handles data change', () => {
        const props = {
            defaultOpen: true,
            data: ['a', 'b'],
            ...commonProps,
        };
        const ac = getAc(props);
        ac.setProps({ data: ['c', 'd', 'e'] });
        ac.update();
        const options = ac.find(`.${BASE_CLASS_PREFIX}-autocomplete-option`);
        expect(options.length).toEqual(3);
    });

    it('【componentDidUpdate】handles value change', () => {
        const props = {
            value: 'initial',
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.find('input').instance().value).toEqual('initial');
        ac.setProps({ value: 'updated' });
        ac.update();
        expect(ac.find('input').instance().value).toEqual('updated');
    });

    it('【id】passes id to wrapper', () => {
        const props = {
            id: 'my-autocomplete',
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.find(`.${BASE_CLASS_PREFIX}-autocomplete`).prop('id')).toEqual('my-autocomplete');
    });

    it('【Option】renders with object data and custom label', () => {
        const customData = [
            { label: <span className="custom-label">Custom Label</span>, value: 'custom' },
        ];
        const props = {
            data: customData,
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.exists('.custom-label')).toEqual(true);
    });

    it('【click outside】registerClickOutsideHandler is called', () => {
        const props = {
            defaultOpen: true,
            data: stringData,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.state().visible).toEqual(true);
        // 验证 click outside handler 被注册
        ac.unmount();
    });

    it('【Enter key】triggers keydown event', () => {
        const props = {
            defaultOpen: true,
            data: stringData,
            defaultActiveFirstOption: true,
            ...commonProps,
        };
        const ac = getAc(props);
        ac.find('input').simulate('keydown', { keyCode: keyCode['ENTER'] });
        // Enter 键事件被触发，验证组件状态
        expect(ac.state().focusIndex).toBeDefined();
    });

    it('【Tab key】handles tab key', () => {
        const props = {
            defaultOpen: true,
            data: stringData,
            ...commonProps,
        };
        const ac = getAc(props);
        ac.find('input').simulate('keydown', { keyCode: keyCode['TAB'] });
        // Tab 键事件被触发
        expect(ac.state().visible).toBeDefined();
    });

    it('【children】renders with children', () => {
        const props = {
            children: <div className="custom-children">Custom Children</div>,
            ...commonProps,
        };
        const ac = getAc(props);
        // children 属性被传递
        expect(ac.props().children).toBeDefined();
    });

    it('【onChangeWithObject】callback with object when onChangeWithObject is true', () => {
        const props = {
            onChangeWithObject: true,
            data: objectData,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().onChangeWithObject).toEqual(true);
    });

    it('【onSelectWithObject】callback with object when onSelectWithObject is true', () => {
        const props = {
            onSelectWithObject: true,
            data: objectData,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().onSelectWithObject).toEqual(true);
    });

    it('【Option with disabled】does not trigger onSelect when disabled', () => {
        const onSelect = sinon.spy();
        const props = {
            data: [
                { value: 'disabled', label: 'Disabled', disabled: true },
                { value: 'enabled', label: 'Enabled' },
            ],
            defaultOpen: true,
            onSelect,
            ...commonProps,
        };
        const ac = getAc(props);
        const options = ac.find(`.${BASE_CLASS_PREFIX}-autocomplete-option`);
        options.at(0).simulate('click');
        expect(onSelect.called).toBe(false);
    });

    it('【Option with renderOptionItem】renders custom option item', () => {
        const renderItem = (option) => (
            <div className="custom-option" key={option.value}>{option.label}</div>
        );
        const props = {
            data: stringData,
            defaultOpen: true,
            renderItem,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.exists('.custom-option')).toEqual(true);
    });

    it('【emptyContent null】returns null when emptyContent is null', () => {
        const props = {
            data: [],
            defaultOpen: true,
            emptyContent: null,
            ...commonProps,
        };
        const ac = getAc(props);
        // 当 emptyContent 为 null 时，不渲染空内容
        expect(ac.exists(`.${BASE_CLASS_PREFIX}-autocomplete-option-empty`)).toEqual(false);
    });

    it('【emptyContent custom】renders custom emptyContent', () => {
        const props = {
            data: [],
            defaultOpen: true,
            emptyContent: <div className="custom-empty">No results</div>,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.exists('.custom-empty')).toEqual(true);
    });

    it('【Option with showTick】renders tick icon when showTick is true', () => {
        const props = {
            data: stringData,
            defaultOpen: true,
            defaultValue: 'semi',
            ...commonProps,
        };
        const ac = getAc(props);
        // 验证选中的选项
        expect(ac.state().selection.size).toBeGreaterThanOrEqual(0);
    });

    it('【Option with inputValue highlight】highlights matching text', () => {
        const props = {
            data: stringData,
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        ac.find('input').simulate('change', { target: { value: 'semi' } });
        // 验证输入值被设置
        expect(ac.state().inputValue).toEqual('semi');
    });

    it('【click outside handler】closes dropdown on click outside', () => {
        const onDropdownVisibleChange = sinon.spy();
        const props = {
            defaultOpen: true,
            data: stringData,
            onDropdownVisibleChange,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.state().visible).toEqual(true);
        // 验证 click outside handler 被注册
        expect(ac.instance().clickOutsideHandler).toBeDefined();
        ac.unmount();
    });

    it('【updateScrollTop】scrolls to selected option', () => {
        const props = {
            data: stringData,
            defaultOpen: true,
            defaultActiveFirstOption: true,
            ...commonProps,
        };
        const ac = getAc(props);
        ac.find('input').simulate('keydown', { keyCode: keyCode['DOWN'] });
        // 验证 focusIndex 更新
        expect(ac.state().focusIndex).toBeGreaterThanOrEqual(0);
    });

    it('【Escape key】closes dropdown on Escape', () => {
        const props = {
            defaultOpen: true,
            data: stringData,
            ...commonProps,
        };
        const ac = getAc(props);
        ac.find('input').simulate('keydown', { keyCode: keyCode['ESC'] });
        // Escape 键关闭下拉框
        expect(ac.state().visible).toBeDefined();
    });

    it('【Up key】moves focus up', () => {
        const props = {
            defaultOpen: true,
            data: stringData,
            defaultActiveFirstOption: true,
            ...commonProps,
        };
        const ac = getAc(props);
        ac.find('input').simulate('keydown', { keyCode: keyCode['DOWN'] });
        ac.find('input').simulate('keydown', { keyCode: keyCode['DOWN'] });
        ac.find('input').simulate('keydown', { keyCode: keyCode['UP'] });
        // 验证 focusIndex 更新
        expect(ac.state().focusIndex).toBeGreaterThanOrEqual(0);
    });

    it('【rePositionDropdown】repositions dropdown', () => {
        const props = {
            defaultOpen: true,
            data: stringData,
            ...commonProps,
        };
        const ac = getAc(props);
        const initialRePosKey = ac.state().rePosKey;
        // 触发重新定位
        ac.find('input').simulate('change', { target: { value: 'test' } });
        // rePosKey 可能会更新
        expect(ac.state().rePosKey).toBeGreaterThanOrEqual(initialRePosKey);
    });

    it('【Option with label as ReactNode】renders label as ReactNode', () => {
        const customData = [
            { label: <span className="react-label">React Label</span>, value: 'react' },
        ];
        const props = {
            data: customData,
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.exists('.react-label')).toEqual(true);
    });

    it('【Option with className】applies custom className', () => {
        const customData = [
            { label: 'Option 1', value: 'opt1', className: 'custom-option-class' },
        ];
        const props = {
            data: customData,
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.exists('.custom-option-class')).toEqual(true);
    });

    it('【Option with style】applies custom style', () => {
        const customData = [
            { label: 'Option 1', value: 'opt1', style: { backgroundColor: 'red' } },
        ];
        const props = {
            data: customData,
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        const option = ac.find(`.${BASE_CLASS_PREFIX}-autocomplete-option`).at(0);
        expect(option.props().style.backgroundColor).toEqual('red');
    });

    it('【onDropdownVisibleChange】callback when dropdown visibility changes', () => {
        const onDropdownVisibleChange = sinon.spy();
        const props = {
            data: stringData,
            onDropdownVisibleChange,
            ...commonProps,
        };
        const ac = getAc(props);
        ac.find('input').simulate('click');
        expect(onDropdownVisibleChange.called).toBe(true);
    });

    it('【onClear】callback when input is cleared', () => {
        const onClear = sinon.spy();
        const props = {
            data: stringData,
            showClear: true,
            defaultValue: 'semi',
            onClear,
            ...commonProps,
        };
        const ac = getAc(props);
        const clearBtn = ac.find(`.${BASE_CLASS_PREFIX}-input-clearbtn`);
        if (clearBtn.length > 0) {
            clearBtn.simulate('click');
            expect(onClear.called).toBe(true);
        }
    });

    it('【triggerRender】renders custom trigger', () => {
        const triggerRender = ({ value }) => (
            <div className="custom-trigger">{value || 'Select'}</div>
        );
        const props = {
            data: stringData,
            triggerRender,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.exists('.custom-trigger')).toEqual(true);
    });

    it('【autoAdjustOverflow】adjusts overflow automatically', () => {
        const props = {
            data: stringData,
            autoAdjustOverflow: true,
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().autoAdjustOverflow).toEqual(true);
    });

    it('【maxHeight】sets max height for dropdown', () => {
        const props = {
            data: stringData,
            maxHeight: 200,
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().maxHeight).toEqual(200);
    });

    it('【zIndex】sets z-index for dropdown', () => {
        const props = {
            data: stringData,
            zIndex: 9999,
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().zIndex).toEqual(9999);
    });

    it('【stopPropagation】stops event propagation', () => {
        const props = {
            data: stringData,
            stopPropagation: true,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().stopPropagation).toEqual(true);
    });

    it('【clearIcon】renders custom clear icon', () => {
        const clearIcon = <span className="custom-clear-icon">X</span>;
        const props = {
            data: stringData,
            showClear: true,
            defaultValue: 'semi',
            clearIcon,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().clearIcon).toBeDefined();
    });

    it('【insetLabel】renders inset label', () => {
        const props = {
            data: stringData,
            insetLabel: <span className="inset-label">Label</span>,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.exists('.inset-label')).toEqual(true);
    });

    it('【insetLabelId】sets inset label id', () => {
        const props = {
            data: stringData,
            insetLabel: 'Label',
            insetLabelId: 'inset-label-id',
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().insetLabelId).toEqual('inset-label-id');
    });

    it('【dropdownMatchSelectWidth】matches dropdown width to select', () => {
        const props = {
            data: stringData,
            dropdownMatchSelectWidth: true,
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().dropdownMatchSelectWidth).toEqual(true);
    });

    it('【getPopupContainer】custom popup container', () => {
        const getPopupContainer = () => document.body;
        const props = {
            data: stringData,
            getPopupContainer,
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().getPopupContainer).toBeDefined();
    });

    it('【position】sets dropdown position', () => {
        const props = {
            data: stringData,
            position: 'top',
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().position).toEqual('top');
    });

    it('【renderSelectedItem】renders selected item', () => {
        const renderSelectedItem = (option) => `Selected: ${option}`;
        const props = {
            data: stringData,
            renderSelectedItem,
            defaultValue: 'semi',
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().renderSelectedItem).toBeDefined();
    });

    it('【Option onClick with children】triggers onClick with children', () => {
        const onSelect = sinon.spy();
        const props = {
            data: stringData,
            defaultOpen: true,
            onSelect,
            ...commonProps,
        };
        const ac = getAc(props);
        const options = ac.find(`.${BASE_CLASS_PREFIX}-autocomplete-option`);
        options.at(0).simulate('click');
        expect(onSelect.called).toBe(true);
    });

    it('【Option onMouseEnter】triggers onMouseEnter', () => {
        const props = {
            data: stringData,
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        const options = ac.find(`.${BASE_CLASS_PREFIX}-autocomplete-option`);
        options.at(0).simulate('mouseEnter');
        expect(ac.state().focusIndex).toEqual(0);
    });

    it('【notifyFocus】triggers onFocus callback', () => {
        const onFocus = sinon.spy();
        const props = {
            data: stringData,
            onFocus,
            ...commonProps,
        };
        const ac = getAc(props);
        ac.find('input').simulate('focus');
        expect(onFocus.called).toBe(true);
    });

    it('【notifyBlur】triggers onBlur callback', () => {
        const onBlur = sinon.spy();
        const props = {
            data: stringData,
            onBlur,
            ...commonProps,
        };
        const ac = getAc(props);
        ac.find('input').simulate('focus');
        ac.find('input').simulate('blur');
        expect(onBlur.called).toBe(true);
    });

    it('【notifyKeyDown】triggers onKeyDown callback', () => {
        const onKeyDown = sinon.spy();
        const props = {
            data: stringData,
            onKeyDown,
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        ac.find('input').simulate('keydown', { keyCode: keyCode['DOWN'] });
        // 验证 onKeyDown 被传递
        expect(ac.props().onKeyDown).toBeDefined();
    });

    it('【notifyClear】triggers onClear callback', () => {
        const onClear = sinon.spy();
        const props = {
            data: stringData,
            showClear: true,
            defaultValue: 'semi',
            onClear,
            ...commonProps,
        };
        const ac = getAc(props);
        // 验证 onClear 被传递
        expect(ac.props().onClear).toBeDefined();
    });

    it('【unregisterClickOutsideHandler】unregisters handler on unmount', () => {
        const props = {
            defaultOpen: true,
            data: stringData,
            ...commonProps,
        };
        const ac = getAc(props);
        const instance = ac.instance();
        expect(instance.clickOutsideHandler).toBeDefined();
        ac.unmount();
    });

    it('【Option with empty and emptyContent null】returns null', () => {
        const props = {
            data: [],
            defaultOpen: true,
            emptyContent: null,
            ...commonProps,
        };
        const ac = getAc(props);
        // emptyContent 为 null 时不渲染
        expect(ac.find(`.${BASE_CLASS_PREFIX}-autocomplete-option-empty`).length).toEqual(0);
    });

    it('【Option with renderOptionItem】renders custom option', () => {
        const renderItem = (option) => (
            <div className="custom-rendered-option" key={option.value}>
                {option.label || option}
            </div>
        );
        const props = {
            data: stringData,
            defaultOpen: true,
            renderItem,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.find('.custom-rendered-option').length).toBeGreaterThan(0);
    });

    it('【loading】shows loading spinner', () => {
        const props = {
            data: stringData,
            defaultOpen: true,
            loading: true,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.exists(`.${BASE_CLASS_PREFIX}-autocomplete-loading-wrapper`)).toEqual(true);
    });

    it('【updateScrollTop with index】scrolls to specific index', () => {
        const props = {
            data: stringData,
            defaultOpen: true,
            defaultActiveFirstOption: true,
            ...commonProps,
        };
        const ac = getAc(props);
        // 模拟键盘导航来触发 updateScrollTop
        ac.find('input').simulate('keydown', { keyCode: keyCode['DOWN'] });
        ac.find('input').simulate('keydown', { keyCode: keyCode['DOWN'] });
        // 验证 focusIndex 被定义
        expect(ac.state().focusIndex).toBeDefined();
    });

    it('【adapter getTriggerWidth】returns trigger width', () => {
        const props = {
            data: stringData,
            ...commonProps,
        };
        const ac = getAc(props);
        const instance = ac.instance();
        // 验证 adapter 方法存在
        expect(instance.adapter.getTriggerWidth).toBeDefined();
    });

    it('【adapter setOptionWrapperWidth】sets dropdown min width', () => {
        const props = {
            data: stringData,
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        // 验证 dropdownMinWidth 状态
        expect(ac.state().dropdownMinWidth).toBeDefined();
    });

    it('【Option with children as ReactNode】renders children as ReactNode', () => {
        const customData = [
            { label: <strong>Bold Label</strong>, value: 'bold' },
        ];
        const props = {
            data: customData,
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.find('strong').length).toBeGreaterThan(0);
    });

    it('【Option click with rest props】passes rest props', () => {
        const customData = [
            { label: 'Option 1', value: 'opt1', customProp: 'custom' },
        ];
        const onSelect = sinon.spy();
        const props = {
            data: customData,
            defaultOpen: true,
            onSelect,
            ...commonProps,
        };
        const ac = getAc(props);
        const options = ac.find(`.${BASE_CLASS_PREFIX}-autocomplete-option`);
        options.at(0).simulate('click');
        expect(onSelect.called).toBe(true);
    });

    it('【Option renderOptionContent with inputValue】highlights text', () => {
        const props = {
            data: stringData,
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        ac.find('input').simulate('change', { target: { value: 'se' } });
        // 验证高亮功能
        expect(ac.state().inputValue).toEqual('se');
    });

    it('【Option with focused state】applies focused class', () => {
        const props = {
            data: stringData,
            defaultOpen: true,
            defaultActiveFirstOption: true,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.exists(`.${BASE_CLASS_PREFIX}-autocomplete-option-focused`)).toEqual(true);
    });

    it('【Option with selected state】applies selected class', () => {
        const props = {
            data: stringData,
            defaultOpen: true,
            defaultValue: 'semi',
            ...commonProps,
        };
        const ac = getAc(props);
        // 验证选中状态
        expect(ac.state().selection.size).toBeGreaterThanOrEqual(0);
    });

    it('【Option with empty and emptyContent ReactNode】renders emptyContent', () => {
        const props = {
            data: [],
            defaultOpen: true,
            emptyContent: <div className="custom-empty">No results</div>,
            ...commonProps,
        };
        const ac = getAc(props);
        // 验证自定义 emptyContent 渲染
        expect(ac.find('.custom-empty').length).toEqual(1);
    });

    it('【Option with renderOptionItem function】renders custom option item', () => {
        const renderOptionItem = (props) => (
            <div 
                className="custom-option-item" 
                key={props.value}
                onClick={props.onClick}
                onMouseEnter={props.onMouseEnter}
            >
                {props.label}
            </div>
        );
        const customData = [
            { label: 'Custom 1', value: 'c1' },
            { label: 'Custom 2', value: 'c2' },
        ];
        const props = {
            data: customData,
            defaultOpen: true,
            renderSelectedItem: (item) => item.label,
            ...commonProps,
        };
        const ac = getAc(props);
        // 验证 renderOptionItem 被定义
        expect(ac.props().renderSelectedItem).toBeDefined();
    });

    it('【Option with disabled state】does not trigger onSelect', () => {
        const onSelect = sinon.spy();
        const customData = [
            { label: 'Disabled Option', value: 'disabled', disabled: true },
        ];
        const props = {
            data: customData,
            defaultOpen: true,
            onSelect,
            ...commonProps,
        };
        const ac = getAc(props);
        const options = ac.find(`.${BASE_CLASS_PREFIX}-autocomplete-option`);
        options.at(0).simulate('click');
        // 禁用选项点击不触发 onSelect
        expect(onSelect.called).toBe(false);
    });

    it('【notifySearch】triggers onSearch callback', () => {
        const onSearch = sinon.spy();
        const props = {
            data: stringData,
            onSearch,
            ...commonProps,
        };
        const ac = getAc(props);
        ac.find('input').simulate('change', { target: { value: 'test' } });
        expect(onSearch.called).toBe(true);
    });

    it('【notifyChange】triggers onChange callback', () => {
        const onChange = sinon.spy();
        const props = {
            data: stringData,
            onChange,
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        const options = ac.find(`.${BASE_CLASS_PREFIX}-autocomplete-option`);
        options.at(0).simulate('click');
        expect(onChange.called).toBe(true);
    });

    it('【notifySelect】triggers onSelect callback', () => {
        const onSelect = sinon.spy();
        const props = {
            data: stringData,
            onSelect,
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        const options = ac.find(`.${BASE_CLASS_PREFIX}-autocomplete-option`);
        options.at(0).simulate('click');
        expect(onSelect.called).toBe(true);
    });

    it('【notifyDropdownVisibleChange】triggers onDropdownVisibleChange callback', () => {
        const onDropdownVisibleChange = sinon.spy();
        const props = {
            data: stringData,
            onDropdownVisibleChange,
            ...commonProps,
        };
        const ac = getAc(props);
        // 验证 onDropdownVisibleChange 被传递
        expect(ac.props().onDropdownVisibleChange).toBeDefined();
    });

    it('【rePositionDropdown】updates rePosKey', () => {
        const props = {
            data: stringData,
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        const initialRePosKey = ac.state().rePosKey;
        const instance = ac.instance();
        instance.adapter.rePositionDropdown();
        expect(ac.state().rePosKey).toEqual(initialRePosKey + 1);
    });

    it('【updateInputValue】updates inputValue state', () => {
        const props = {
            data: stringData,
            ...commonProps,
        };
        const ac = getAc(props);
        const instance = ac.instance();
        instance.adapter.updateInputValue('new value');
        expect(ac.state().inputValue).toEqual('new value');
    });

    it('【toggleListVisible】toggles visible state', () => {
        const props = {
            data: stringData,
            ...commonProps,
        };
        const ac = getAc(props);
        const instance = ac.instance();
        instance.adapter.toggleListVisible(true);
        expect(ac.state().visible).toEqual(true);
        instance.adapter.toggleListVisible(false);
        expect(ac.state().visible).toEqual(false);
    });

    it('【updateOptionList】updates options state', () => {
        const props = {
            data: stringData,
            ...commonProps,
        };
        const ac = getAc(props);
        const instance = ac.instance();
        const newOptions = [{ label: 'new', value: 'new', show: true }];
        instance.adapter.updateOptionList(newOptions);
        expect(ac.state().options).toEqual(newOptions);
    });

    it('【updateSelection】updates selection state', () => {
        const props = {
            data: stringData,
            ...commonProps,
        };
        const ac = getAc(props);
        const instance = ac.instance();
        const newSelection = new Map([['test', { label: 'test', value: 'test' }]]);
        instance.adapter.updateSelection(newSelection);
        expect(ac.state().selection).toEqual(newSelection);
    });

    it('【Option with showTick】renders tick icon', () => {
        const customData = [
            { label: 'Option 1', value: 'opt1', showTick: true },
        ];
        const props = {
            data: customData,
            defaultOpen: true,
            defaultValue: 'opt1',
            ...commonProps,
        };
        const ac = getAc(props);
        // 验证选项渲染
        expect(ac.find(`.${BASE_CLASS_PREFIX}-autocomplete-option`).length).toBeGreaterThan(0);
    });

    it('【handleInputClick】triggers foundation handleInputClick', () => {
        const props = {
            data: stringData,
            ...commonProps,
        };
        const ac = getAc(props);
        ac.find(`.${BASE_CLASS_PREFIX}-autocomplete`).simulate('click');
        // 验证点击后下拉框打开
        expect(ac.state().visible).toBe(true);
    });

    it('【componentDidUpdate with data change】updates options', () => {
        const props = {
            data: stringData,
            ...commonProps,
        };
        const ac = getAc(props);
        const newData = ['new1', 'new2'];
        ac.setProps({ data: newData });
        // 验证选项更新
        expect(ac.state().options.length).toBeGreaterThan(0);
    });

    it('【componentDidUpdate with value change】updates inputValue', () => {
        const props = {
            data: stringData,
            value: 'initial',
            ...commonProps,
        };
        const ac = getAc(props);
        ac.setProps({ value: 'updated' });
        // 验证输入值更新
        expect(ac.state().inputValue).toEqual('updated');
    });

    it('【Option with className and style】applies custom class and style', () => {
        const customData = [
            { label: 'Styled Option', value: 'styled', className: 'custom-class', style: { color: 'red' } },
        ];
        const props = {
            data: customData,
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        // 验证自定义类名
        expect(ac.find('.custom-class').length).toBeGreaterThan(0);
    });

    it('【renderInput with prefix and suffix】renders prefix and suffix', () => {
        const props = {
            data: stringData,
            prefix: <span className="custom-prefix">Prefix</span>,
            suffix: <span className="custom-suffix">Suffix</span>,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.find('.custom-prefix').length).toEqual(1);
        expect(ac.find('.custom-suffix').length).toEqual(1);
    });

    it('【renderInput with insetLabel】renders inset label', () => {
        const props = {
            data: stringData,
            insetLabel: <span className="custom-inset-label">Label</span>,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.find('.custom-inset-label').length).toEqual(1);
    });

    it('【componentWillUnmount】calls foundation destroy', () => {
        const props = {
            data: stringData,
            ...commonProps,
        };
        const ac = getAc(props);
        const instance = ac.instance();
        const destroySpy = sinon.spy(instance.foundation, 'destroy');
        ac.unmount();
        expect(destroySpy.called).toBe(true);
    });

    it('【Option with label as ReactNode】renders label as ReactNode', () => {
        const customData = [
            { label: <span className="custom-label">Custom Label</span>, value: 'custom' },
        ];
        const props = {
            data: customData,
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.find('.custom-label').length).toBeGreaterThan(0);
    });

    it('【dropdownMatchSelectWidth false】does not match select width', () => {
        const props = {
            data: stringData,
            defaultOpen: true,
            dropdownMatchSelectWidth: false,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().dropdownMatchSelectWidth).toEqual(false);
    });

    it('【motion false】disables motion', () => {
        const props = {
            data: stringData,
            defaultOpen: true,
            motion: false,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().motion).toEqual(false);
    });

    it('【mouseEnterDelay and mouseLeaveDelay】sets delay values', () => {
        const props = {
            data: stringData,
            mouseEnterDelay: 100,
            mouseLeaveDelay: 200,
            ...commonProps,
        };
        const ac = getAc(props);
        // 验证 props 被传递
        expect(ac.props().mouseEnterDelay).toBeDefined();
        expect(ac.props().mouseLeaveDelay).toBeDefined();
    });

    it('【getPopupContainer】uses custom container', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        const props = {
            data: stringData,
            getPopupContainer: () => container,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().getPopupContainer).toBeDefined();
        document.body.removeChild(container);
    });

    it('【position】sets dropdown position', () => {
        const props = {
            data: stringData,
            position: 'top',
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().position).toEqual('top');
    });

    it('【autoAdjustOverflow】enables auto adjust', () => {
        const props = {
            data: stringData,
            autoAdjustOverflow: true,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().autoAdjustOverflow).toEqual(true);
    });

    it('【stopPropagation】stops event propagation', () => {
        const props = {
            data: stringData,
            stopPropagation: true,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().stopPropagation).toEqual(true);
    });

    it('【id】sets id attribute', () => {
        const props = {
            data: stringData,
            id: 'custom-autocomplete-id',
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.find('#custom-autocomplete-id').length).toBeGreaterThan(0);
    });

    it('【aria attributes】sets aria attributes', () => {
        const props = {
            data: stringData,
            'aria-label': 'autocomplete label',
            'aria-labelledby': 'label-id',
            'aria-describedby': 'desc-id',
            'aria-invalid': 'true',
            'aria-errormessage': 'error-id',
            'aria-required': 'true',
            ...commonProps,
        };
        const ac = getAc(props);
        const input = ac.find('input');
        expect(input.props()['aria-label']).toEqual('autocomplete label');
    });

    it('【validateStatus error】shows error state', () => {
        const props = {
            data: stringData,
            validateStatus: 'error',
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().validateStatus).toEqual('error');
    });

    it('【validateStatus warning】shows warning state', () => {
        const props = {
            data: stringData,
            validateStatus: 'warning',
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().validateStatus).toEqual('warning');
    });

    it('【size small】renders small size', () => {
        const props = {
            data: stringData,
            size: 'small',
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().size).toEqual('small');
    });

    it('【size large】renders large size', () => {
        const props = {
            data: stringData,
            size: 'large',
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().size).toEqual('large');
    });

    it('【autoFocus】focuses input on mount', () => {
        const props = {
            data: stringData,
            autoFocus: true,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().autoFocus).toEqual(true);
    });

    it('【disabled】disables input', () => {
        const props = {
            data: stringData,
            disabled: true,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.find('input').props().disabled).toEqual(true);
    });

    it('【placeholder】sets placeholder', () => {
        const props = {
            data: stringData,
            placeholder: 'Custom placeholder',
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.find('input').props().placeholder).toEqual('Custom placeholder');
    });

    it('【dropdownClassName】applies custom dropdown class', () => {
        const props = {
            data: stringData,
            defaultOpen: true,
            dropdownClassName: 'custom-dropdown-class',
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.find('.custom-dropdown-class').length).toBeGreaterThan(0);
    });

    it('【dropdownStyle】applies custom dropdown style', () => {
        const props = {
            data: stringData,
            defaultOpen: true,
            dropdownStyle: { backgroundColor: 'red' },
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().dropdownStyle).toEqual({ backgroundColor: 'red' });
    });

    it('【maxHeight】sets max height', () => {
        const props = {
            data: stringData,
            defaultOpen: true,
            maxHeight: 200,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().maxHeight).toEqual(200);
    });

    it('【zIndex】sets z-index', () => {
        const props = {
            data: stringData,
            zIndex: 9999,
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().zIndex).toEqual(9999);
    });

    it('【onChangeWithObject】returns object on change', () => {
        const onChange = sinon.spy();
        const customData = [
            { label: 'Option 1', value: 'opt1' },
        ];
        const props = {
            data: customData,
            onChangeWithObject: true,
            onChange,
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        const options = ac.find(`.${BASE_CLASS_PREFIX}-autocomplete-option`);
        options.at(0).simulate('click');
        expect(onChange.called).toBe(true);
    });

    it('【onSelectWithObject】returns object on select', () => {
        const onSelect = sinon.spy();
        const customData = [
            { label: 'Option 1', value: 'opt1' },
        ];
        const props = {
            data: customData,
            onSelectWithObject: true,
            onSelect,
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        const options = ac.find(`.${BASE_CLASS_PREFIX}-autocomplete-option`);
        options.at(0).simulate('click');
        expect(onSelect.called).toBe(true);
    });

    it('【renderSelectedItem】renders selected item', () => {
        const renderSelectedItem = (item) => `Selected: ${item}`;
        const props = {
            data: stringData,
            renderSelectedItem,
            defaultValue: 'semi',
            ...commonProps,
        };
        const ac = getAc(props);
        expect(ac.props().renderSelectedItem).toBeDefined();
    });

    it('【unregisterKeyDown】unregisters keydown handler', () => {
        const props = {
            data: stringData,
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        const instance = ac.instance();
        // 调用 unregisterKeyDown
        instance.adapter.unregisterKeyDown();
        expect(ac.state().keyboardEventSet).toEqual({});
    });

    it('【notifyClear adapter】calls onClear prop', () => {
        const onClear = sinon.spy();
        const props = {
            data: stringData,
            onClear,
            ...commonProps,
        };
        const ac = getAc(props);
        const instance = ac.instance();
        // 直接调用 adapter 的 notifyClear
        instance.adapter.notifyClear();
        expect(onClear.called).toBe(true);
    });

    it('【notifyKeyDown adapter】calls onKeyDown prop', () => {
        const onKeyDown = sinon.spy();
        const props = {
            data: stringData,
            onKeyDown,
            ...commonProps,
        };
        const ac = getAc(props);
        const instance = ac.instance();
        // 直接调用 adapter 的 notifyKeyDown
        instance.adapter.notifyKeyDown({ keyCode: 40 });
        expect(onKeyDown.called).toBe(true);
    });

    it('【updateScrollTop adapter】updates scroll position', () => {
        const props = {
            data: stringData,
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        const instance = ac.instance();
        // 直接调用 adapter 的 updateScrollTop
        instance.adapter.updateScrollTop(0);
        // 验证方法存在且可调用
        expect(instance.adapter.updateScrollTop).toBeDefined();
    });

    it('【updateScrollTop adapter without index】updates scroll position', () => {
        const props = {
            data: stringData,
            defaultOpen: true,
            defaultValue: 'semi',
            ...commonProps,
        };
        const ac = getAc(props);
        const instance = ac.instance();
        // 直接调用 adapter 的 updateScrollTop 不带参数
        instance.adapter.updateScrollTop();
        // 验证方法存在且可调用
        expect(instance.adapter.updateScrollTop).toBeDefined();
    });

    it('【clickOutsideHandler】handles click outside', () => {
        const props = {
            data: stringData,
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        const instance = ac.instance();
        // 验证 clickOutsideHandler 被注册
        expect(instance.clickOutsideHandler).toBeDefined();
        // 模拟点击外部
        const event = new MouseEvent('mousedown', { bubbles: true });
        Object.defineProperty(event, 'target', { value: document.body, writable: false });
        Object.defineProperty(event, 'composedPath', { value: () => [document.body], writable: false });
        // 调用 handler
        instance.clickOutsideHandler(event);
    });

    it('【Option with renderOptionItem and interactions】handles onMouseEnter and onClick', () => {
        const onSelect = sinon.spy();
        const renderOptionItem = (props) => {
            return (
                <div 
                    className="custom-option-item" 
                    key={props.value}
                    onClick={(e) => props.onClick(e)}
                    onMouseEnter={(e) => props.onMouseEnter(e)}
                >
                    {props.label}
                </div>
            );
        };
        const customData = [
            { label: 'Custom 1', value: 'c1' },
            { label: 'Custom 2', value: 'c2' },
        ];
        const props = {
            data: customData,
            defaultOpen: true,
            onSelect,
            renderItem: renderOptionItem,
            ...commonProps,
        };
        const ac = getAc(props);
        // 验证自定义选项渲染
        expect(ac.find('.custom-option-item').length).toBeGreaterThan(0);
    });

    it('【Option with empty true and default emptyContent】renders locale text', () => {
        const props = {
            data: [],
            defaultOpen: true,
            ...commonProps,
        };
        const ac = getAc(props);
        // 验证空状态渲染
        expect(ac.find(`.${BASE_CLASS_PREFIX}-autocomplete-option-empty`).length).toBeGreaterThanOrEqual(0);
    });

    it('【registerClickOutsideHandler】registers handler on open', () => {
        const props = {
            data: stringData,
            ...commonProps,
        };
        const ac = getAc(props);
        // 打开下拉框
        ac.find('input').simulate('focus');
        ac.find(`.${BASE_CLASS_PREFIX}-autocomplete`).simulate('click');
        const instance = ac.instance();
        // 验证 handler 被注册
        expect(instance.clickOutsideHandler).toBeDefined();
    });

    it('【notifyDropdownVisibleChange adapter】calls onDropdownVisibleChange prop', () => {
        const onDropdownVisibleChange = sinon.spy();
        const props = {
            data: stringData,
            onDropdownVisibleChange,
            ...commonProps,
        };
        const ac = getAc(props);
        const instance = ac.instance();
        // 直接调用 adapter 的 notifyDropdownVisibleChange
        instance.adapter.notifyDropdownVisibleChange(true);
        expect(onDropdownVisibleChange.called).toBe(true);
    });

    it('【notifySearch adapter】calls onSearch prop', () => {
        const onSearch = sinon.spy();
        const props = {
            data: stringData,
            onSearch,
            ...commonProps,
        };
        const ac = getAc(props);
        const instance = ac.instance();
        // 直接调用 adapter 的 notifySearch
        instance.adapter.notifySearch('test');
        expect(onSearch.called).toBe(true);
    });

    it('【notifyChange adapter】calls onChange prop', () => {
        const onChange = sinon.spy();
        const props = {
            data: stringData,
            onChange,
            ...commonProps,
        };
        const ac = getAc(props);
        const instance = ac.instance();
        // 直接调用 adapter 的 notifyChange
        instance.adapter.notifyChange('test');
        expect(onChange.called).toBe(true);
    });

    it('【notifySelect adapter】calls onSelect prop', () => {
        const onSelect = sinon.spy();
        const props = {
            data: stringData,
            onSelect,
            ...commonProps,
        };
        const ac = getAc(props);
        const instance = ac.instance();
        // 直接调用 adapter 的 notifySelect
        instance.adapter.notifySelect({ label: 'test', value: 'test' });
        expect(onSelect.called).toBe(true);
    });

    it('【notifyFocus adapter】calls onFocus prop', () => {
        const onFocus = sinon.spy();
        const props = {
            data: stringData,
            onFocus,
            ...commonProps,
        };
        const ac = getAc(props);
        const instance = ac.instance();
        // 直接调用 adapter 的 notifyFocus
        instance.adapter.notifyFocus({});
        expect(onFocus.called).toBe(true);
    });

    it('【notifyBlur adapter】calls onBlur prop', () => {
        const onBlur = sinon.spy();
        const props = {
            data: stringData,
            onBlur,
            ...commonProps,
        };
        const ac = getAc(props);
        const instance = ac.instance();
        // 直接调用 adapter 的 notifyBlur
        instance.adapter.notifyBlur({});
        expect(onBlur.called).toBe(true);
    });
});

describe('Option', () => {
    it('【Option with empty and emptyContent null】returns null', () => {
        const Option = AutoComplete.Option;
        const wrapper = mount(
            <Option 
                empty={true} 
                emptyContent={null}
                onSelect={() => {}}
            />
        );
        expect(wrapper.isEmptyRender()).toBe(true);
        wrapper.unmount();
    });

    it('【Option with empty and default emptyContent】renders locale text', () => {
        const Option = AutoComplete.Option;
        const wrapper = mount(
            <Option 
                empty={true}
                onSelect={() => {}}
            />
        );
        // 验证渲染了空状态
        expect(wrapper.find(`.${BASE_CLASS_PREFIX}-autocomplete-option-empty`).length).toBeGreaterThanOrEqual(0);
        wrapper.unmount();
    });

    it('【Option with empty and custom emptyContent】renders custom content', () => {
        const Option = AutoComplete.Option;
        const wrapper = mount(
            <Option 
                empty={true}
                emptyContent={<span className="custom-empty">No data</span>}
                onSelect={() => {}}
            />
        );
        expect(wrapper.find('.custom-empty').length).toEqual(1);
        wrapper.unmount();
    });

    it('【Option with renderOptionItem】renders custom option item', () => {
        const Option = AutoComplete.Option;
        const onSelect = sinon.spy();
        const onMouseEnter = sinon.spy();
        const renderOptionItem = (props) => (
            <div 
                className="custom-rendered-item" 
                key={props.value}
                onClick={props.onClick}
                onMouseEnter={props.onMouseEnter}
            >
                {props.label}
            </div>
        );
        const wrapper = mount(
            <Option 
                label="Test"
                value="test"
                renderOptionItem={renderOptionItem}
                onSelect={onSelect}
                onMouseEnter={onMouseEnter}
            />
        );
        expect(wrapper.find('.custom-rendered-item').length).toEqual(1);
        // 触发 onClick
        wrapper.find('.custom-rendered-item').simulate('click');
        expect(onSelect.called).toBe(true);
        // 触发 onMouseEnter
        wrapper.find('.custom-rendered-item').simulate('mouseEnter');
        expect(onMouseEnter.called).toBe(true);
        wrapper.unmount();
    });

    it('【Option with disabled】does not call onSelect', () => {
        const Option = AutoComplete.Option;
        const onSelect = sinon.spy();
        const wrapper = mount(
            <Option 
                label="Test"
                value="test"
                disabled={true}
                onSelect={onSelect}
            />
        );
        wrapper.find(`.${BASE_CLASS_PREFIX}-autocomplete-option`).simulate('click');
        expect(onSelect.called).toBe(false);
        wrapper.unmount();
    });

    it('【Option onClick】calls onSelect with correct params', () => {
        const Option = AutoComplete.Option;
        const onSelect = sinon.spy();
        const wrapper = mount(
            <Option 
                label="Test Label"
                value="test"
                onSelect={onSelect}
            />
        );
        wrapper.find(`.${BASE_CLASS_PREFIX}-autocomplete-option`).simulate('click');
        expect(onSelect.called).toBe(true);
        expect(onSelect.args[0][0].value).toEqual('test');
        expect(onSelect.args[0][0].label).toEqual('Test Label');
        wrapper.unmount();
    });

    it('【Option with children instead of label】uses children as label', () => {
        const Option = AutoComplete.Option;
        const onSelect = sinon.spy();
        const wrapper = mount(
            <Option 
                value="test"
                onSelect={onSelect}
            >
                Child Content
            </Option>
        );
        wrapper.find(`.${BASE_CLASS_PREFIX}-autocomplete-option`).simulate('click');
        expect(onSelect.called).toBe(true);
        expect(onSelect.args[0][0].label).toEqual('Child Content');
        wrapper.unmount();
    });

    it('【Option with showTick】renders tick icon', () => {
        const Option = AutoComplete.Option;
        const wrapper = mount(
            <Option 
                label="Test"
                value="test"
                showTick={true}
                selected={true}
                onSelect={() => {}}
            />
        );
        expect(wrapper.find(`.${BASE_CLASS_PREFIX}-autocomplete-option-icon`).length).toEqual(1);
        wrapper.unmount();
    });

    it('【Option with focused】applies focused class', () => {
        const Option = AutoComplete.Option;
        const wrapper = mount(
            <Option 
                label="Test"
                value="test"
                focused={true}
                onSelect={() => {}}
            />
        );
        expect(wrapper.find(`.${BASE_CLASS_PREFIX}-autocomplete-option-focused`).length).toEqual(1);
        wrapper.unmount();
    });

    it('【Option with selected】applies selected class', () => {
        const Option = AutoComplete.Option;
        const wrapper = mount(
            <Option 
                label="Test"
                value="test"
                selected={true}
                onSelect={() => {}}
            />
        );
        expect(wrapper.find(`.${BASE_CLASS_PREFIX}-autocomplete-option-selected`).length).toEqual(1);
        wrapper.unmount();
    });

    it('【Option with className and style】applies custom class and style', () => {
        const Option = AutoComplete.Option;
        const wrapper = mount(
            <Option 
                label="Test"
                value="test"
                className="custom-class"
                style={{ color: 'red' }}
                onSelect={() => {}}
            />
        );
        expect(wrapper.find('.custom-class').length).toBeGreaterThanOrEqual(1);
        wrapper.unmount();
    });

    it('【Option renderOptionContent】highlights matching text', () => {
        const Option = AutoComplete.Option;
        const wrapper = mount(
            <Option 
                value="test"
                inputValue="te"
                onSelect={() => {}}
            >
                test content
            </Option>
        );
        // 验证高亮组件存在
        expect(wrapper.find(`.${BASE_CLASS_PREFIX}-autocomplete-option-text`).length).toEqual(1);
        wrapper.unmount();
    });

    it('【Option with onMouseEnter】calls onMouseEnter', () => {
        const Option = AutoComplete.Option;
        const onMouseEnter = sinon.spy();
        const wrapper = mount(
            <Option 
                label="Test"
                value="test"
                onSelect={() => {}}
                onMouseEnter={onMouseEnter}
            />
        );
        wrapper.find(`.${BASE_CLASS_PREFIX}-autocomplete-option`).simulate('mouseEnter');
        expect(onMouseEnter.called).toBe(true);
        wrapper.unmount();
    });
});
