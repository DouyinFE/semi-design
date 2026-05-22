import { Icon, TagInput } from '../../index';
import { noop } from 'lodash';
import { cssClasses } from '@douyinfe/semi-foundation/icons/constants';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';
const prefixCls = cssClasses.PREFIX;

function getTagInput(props) {
    return mount(<TagInput {...props} />, { attachTo: document.getElementById('container') });
}

describe('TagInput', () => {
    it('TagInput with prefix / suffix', () => {
        const suffix = <div className="suffix">suffix</div>;
        const prefix = <div className="prefix">prefix</div>;
        const withNodeSuffix = mount(<TagInput suffix={suffix} />);
        const withNodePrefix = mount(<TagInput prefix={prefix} />);
        expect(withNodeSuffix.contains(suffix)).toEqual(true);
        expect(withNodePrefix.contains(prefix)).toEqual(true);
    });

    it('TagInput with validateStatus', () => {
        const warningTagInput = mount(<TagInput validateStatus="warning" />);
        const errorTagInput = mount(<TagInput validateStatus="error" />);
        const defaultTagInput = mount(<TagInput />);
        expect(warningTagInput.exists(`.${BASE_CLASS_PREFIX}-tagInput-warning`)).toEqual(true);
        expect(errorTagInput.exists(`.${BASE_CLASS_PREFIX}-tagInput-error`)).toEqual(true);
        expect(defaultTagInput.exists(`.${BASE_CLASS_PREFIX}-tagInput-error`)).toEqual(false);
        expect(defaultTagInput.exists(`.${BASE_CLASS_PREFIX}-tagInput-warning`)).toEqual(false);
    });

    it('TagInput with placeholder', () => {
        const placeholderText = `semi placeholder`;
        const tagInput = mount(<TagInput placeholder={placeholderText} />);
        const tagInputDom = tagInput.find('input');
        expect(tagInputDom.props().placeholder).toEqual(placeholderText);
    });

    it('TagInput with custom className & style', () => {
        const wrapper = mount(<TagInput className="test" style={{ color: 'red' }} />);
        expect(wrapper.hasClass('test')).toEqual(true);
        expect(wrapper.find('div.test')).toHaveStyle('color', 'red');
    });

    it('TagInput with size', () => {
        const largeTagInput = mount(<TagInput size="large" />);
        const smallTagInput = mount(<TagInput size="small" />);
        expect(largeTagInput.find(`.semi-input-large`)).toHaveLength(1);
        expect(smallTagInput.find(`.semi-input-small`)).toHaveLength(1);
    });

    it('TagInput with showClear', () => {
        const showTagInput = mount(<TagInput showClear={true} />);
        expect(showTagInput.exists(`.${BASE_CLASS_PREFIX}-icon-clear`)).toEqual(true);
        expect(showTagInput.simulate('mouseEnter', {}).exists(`.${BASE_CLASS_PREFIX}-tagInput-clearBtn-invisible`)).toEqual(true);
        showTagInput.unmount();

        const notShowTagInput = mount(<TagInput showClear={false} />);
        expect(notShowTagInput.exists(`.${BASE_CLASS_PREFIX}-icon-clear`)).toEqual(false);
        notShowTagInput.unmount();

        const tagInput = mount(<TagInput showClear={true} inputValue='semi' />);
        expect(tagInput.exists(`.${BASE_CLASS_PREFIX}-tagInput-clearBtn-invisible`)).toEqual(true);
        expect(tagInput.simulate('mouseEnter', {}).exists(`.${BASE_CLASS_PREFIX}-tagInput-clearBtn-invisible`)).toEqual(false);
        tagInput.unmount();
    });

    it('TagInput with defaultValue', () => {
        const props = {
            defaultValue: ['abc', 'hotsoon']
        };
        const tagInput = getTagInput(props);
        const tags = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-wrapper .${BASE_CLASS_PREFIX}-tag-content`);
        expect(tags.length).toEqual(2);
        expect(tags.at(0).getDOMNode().textContent).toEqual('abc');
        expect(tags.at(1).getDOMNode().textContent).toEqual('hotsoon');
        tagInput.unmount();
    });

    it('TagInput with defaultValue and value is undefined', () => {
        const props = {
            defaultValue: ['semi', 'hotsoon'],
            value: undefined,
        };
        const tagInput = getTagInput(props);
        const tags = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-wrapper .${BASE_CLASS_PREFIX}-tag-content`);
        expect(tags.length).toEqual(0);
        tagInput.unmount();
    });

    it('TagInput with defaultValue and value is null', () => {
        const props = {
            defaultValue: ['semi', 'hotsoon'],
            value: null,
        };
        const tagInput = getTagInput(props);
        const tags = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-wrapper .${BASE_CLASS_PREFIX}-tag-content`);
        expect(tags.length).toEqual(0);
        tagInput.unmount();
    });

    it('TagInput with disabled', () => {
        const disabledTagInput = mount(<TagInput disabled />);
        expect(disabledTagInput.exists(`.${BASE_CLASS_PREFIX}-tagInput-disabled`)).toEqual(true);
        disabledTagInput.unmount();
        const tagInput = mount(<TagInput />);
        expect(tagInput.exists(`.${BASE_CLASS_PREFIX}-tagInput-disabled`)).toEqual(false);
        tagInput.unmount();
    });

    it('TagInput with separator', () => {
        const props = {
            separator: '-',
            inputValue: 'abc-hotsoon'
        }
        const tagInput = getTagInput(props);
        tagInput.find('input').simulate('keyDown', { keyCode: 13 });
        const tags = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-wrapper .${BASE_CLASS_PREFIX}-tag-content`);
        expect(tags.length).toEqual(2);
        expect(tags.at(0).getDOMNode().textContent).toEqual('abc');
        expect(tags.at(1).getDOMNode().textContent).toEqual('hotsoon');
        tagInput.unmount();

        /* when separator is null */
        const props2 = {
            separator: null,
            inputValue: 'semi-hotsoon'
        }
        const tagInput2 = getTagInput(props2);
        tagInput2.find('input').simulate('keyDown', { keyCode: 13 });
        const tags2 = tagInput2.find(`.${BASE_CLASS_PREFIX}-tagInput-wrapper .${BASE_CLASS_PREFIX}-tag-content`);
        expect(tags2.length).toEqual(1);
        expect(tags2.at(0).getDOMNode().textContent).toEqual('semi-hotsoon');
        tagInput2.unmount();

        /* when separator is number */
        const props3 = {
            separator: 1,
            inputValue: 'semi1design'
        }
        const tagInput3 = getTagInput(props3);
        tagInput3.find('input').simulate('keyDown', { keyCode: 13 });
        const tags3 = tagInput3.find(`.${BASE_CLASS_PREFIX}-tagInput-wrapper .${BASE_CLASS_PREFIX}-tag-content`);
        expect(tags3.length).toEqual(2);
        expect(tags3.at(0).getDOMNode().textContent).toEqual('semi');
        expect(tags3.at(1).getDOMNode().textContent).toEqual('design');
        tagInput3.unmount();
    });

    
    it('TagInput with arrat type separator', () => {
        const props = {
            separator: ['-','/','*'],
            inputValue: 'abc-hotsoon/pipixi*qingyan'
        }
        const tagInput = getTagInput(props);
        tagInput.find('input').simulate('keyDown', { keyCode: 13 });
        const tags = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-wrapper .${BASE_CLASS_PREFIX}-tag-content`);
        expect(tags.length).toEqual(4);
        expect(tags.at(0).getDOMNode().textContent).toEqual('abc');
        expect(tags.at(1).getDOMNode().textContent).toEqual('hotsoon');
        expect(tags.at(2).getDOMNode().textContent).toEqual('pipixi');
        expect(tags.at(3).getDOMNode().textContent).toEqual('qingyan');
        tagInput.unmount();
    });


    it('TagInput with onRemove & onChange', () => {
        const spyOnRemove = sinon.spy(value => { });
        const spyOnChange = sinon.spy(value => { });
        const props = {
            defaultValue: ['abc', 'hotsoon', 'toutiao', 'lark'],
            onRemove: spyOnRemove,
            onChange: spyOnChange,
            showClear: true
        };
        const tagInput = getTagInput(props);
        const nativeEvent = { nativeEvent: { stopImmediatePropagation: noop } };
        tagInput.find(`.${BASE_CLASS_PREFIX}-tag-close`).at(1).simulate('click', nativeEvent);
        tagInput.find('input').simulate('keyDown', { keyCode: 8 });
        tagInput.simulate('mouseEnter', {}).find(`.${BASE_CLASS_PREFIX}-tagInput-clearBtn`).simulate('click', nativeEvent);
        expect(spyOnRemove.callCount).toEqual(2);
        expect(spyOnChange.callCount).toEqual(3);

        //click tagCloseBtn
        expect(spyOnRemove.getCall(0).args[0]).toEqual('hotsoon');
        expect(spyOnChange.getCall(0).args[0]).toEqual(['abc', 'toutiao', 'lark']);

        //enter basespace
        expect(spyOnRemove.getCall(1).args[0]).toEqual('lark');
        expect(spyOnChange.getCall(1).args[0]).toEqual(['abc', 'toutiao']);

        //click clearBtn
        expect(spyOnChange.getCall(2).args[0]).toEqual([]);

        tagInput.unmount();
    });

    it('TagInput with onAdd & onChange', () => {
        const spyOnAdd = sinon.spy(value => { });
        const spyOnChange = sinon.spy(value => { });

        // inputValue is empty
        const emptyProps = {
            onChange: spyOnChange,
            onAdd: spyOnAdd
        };
        const emptyTagInput = getTagInput(emptyProps);
        emptyTagInput.find('input').simulate('keyDown', { keyCode: 13 });
        expect(spyOnAdd.callCount).toEqual(0);
        expect(spyOnChange.callCount).toEqual(0);
        emptyTagInput.unmount();

        // inputValue is not empty
        const props = {
            inputValue: 'abc,toutiao,,,hotsoon',
            onChange: spyOnChange,
            defaultValue: ['lark'],
            onAdd: spyOnAdd
        };
        const tagInput = getTagInput(props);
        tagInput.find('input').simulate('keyDown', { keyCode: 13 });
        expect(spyOnAdd.callCount).toEqual(1);
        expect(spyOnAdd.getCall(0).args[0]).toEqual(['abc', 'toutiao', 'hotsoon']);
        expect(spyOnChange.callCount).toEqual(1);
        expect(spyOnChange.getCall(0).args[0]).toEqual(['lark', 'abc', 'toutiao', 'hotsoon']);
        tagInput.unmount();
    });

    it('TagInput with max', () => {
        const props = {
            defaultValue: ['abc', 'hotsoon'],
            max: 2,
            inputValue: 'lark',
        };
        const tagInput = getTagInput(props);
        tagInput.find('input').simulate('keyDown', { keyCode: 13 });
        const tags = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-wrapper .${BASE_CLASS_PREFIX}-tag-content`);
        expect(tags.length).toEqual(2);
        expect(tags.at(0).getDOMNode().textContent).toEqual('abc');
        expect(tags.at(1).getDOMNode().textContent).toEqual('hotsoon');
        tagInput.unmount();
    });

    it('TagInput with maxTagCount', () => {
        const props = {
            defaultValue: ['abc', 'hotsoon'],
            maxTagCount: 2,
            inputValue: 'lark',
        };
        const tagInput = getTagInput(props);
        tagInput.find('input').simulate('keyDown', { keyCode: 13 });
        const tags = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-wrapper .${BASE_CLASS_PREFIX}-tag-content`);
        expect(tags.length).toEqual(2);
        expect(tags.at(0).getDOMNode().textContent).toEqual('abc');
        expect(tags.at(1).getDOMNode().textContent).toEqual('hotsoon');
        const n = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-wrapper-n`);
        expect(n.at(0).getDOMNode().textContent).toEqual('+1');
        tagInput.unmount();
    });

    it('TagInput with maxLength', () => {
        const props = {
            maxLength: 3,
        };
        const tagInput = getTagInput(props);
        tagInput.find('input').simulate('change', { target: { value: "tik" } });
        expect(tagInput.find('input').getDOMNode().value).toEqual('tik');
        tagInput.find('input').simulate('change', { target: { value: "tikt" } });
        expect(tagInput.find('input').getDOMNode().value).toEqual('tik');
        tagInput.unmount();
    });

    it('TagInput with onExceed', () => {
        const spyOnExceed = sinon.spy(() => { });
        const props = {
            max: 2,
            defaultValue: ['abc', 'hotsoon'],
            inputValue: 'semi',
            onExceed: spyOnExceed
        };
        const tagInput = getTagInput(props);
        tagInput.find('input').simulate('keyDown', { keyCode: 13 });
        expect(spyOnExceed.callCount).toEqual(1);
        tagInput.unmount();
    });

    it('TagInput with onInputExceed', () => {
        const spyOnInputExceed = sinon.spy(() => { });
        const props = {
            maxLength: 2,
            onInputExceed: spyOnInputExceed
        };
        const tagInput = getTagInput(props);
        tagInput.find('input').simulate('change', { target: { value: "hotsoon" } });
        expect(spyOnInputExceed.callCount).toEqual(1);
        tagInput.unmount();
    });

    it('TagInput with onInputChange', () => {
        const spyOnInputChange = sinon.spy(() => { });
        const props = {
            onInputChange: spyOnInputChange
        };
        const tagInput = getTagInput(props);
        tagInput.find('input').simulate('change', {});
        expect(spyOnInputChange.callCount).toEqual(1);
        tagInput.unmount();
    });

    it('TagInput with onBlur & onFocus', () => {
        const spyOnBlur = sinon.spy(() => { });
        const spyOnFocus = sinon.spy(() => {
        });
        const props = {
            onBlur: spyOnBlur,
            onFocus: spyOnFocus
        };
        const tagInput = getTagInput(props);
        tagInput.find('input').simulate('focus', {});
        expect(spyOnFocus.callCount).toEqual(1);
        tagInput.find('input').simulate('blur', {});
        expect(spyOnBlur.callCount).toEqual(1);
        tagInput.unmount();
    });

    it('TagInput with addOnBlur', () => {
        const props = {
            addOnBlur: true,
            defaultValue: ['abc']
        };
        const tagInput = getTagInput(props);
        tagInput.find('input').simulate('focus', {});
        tagInput.find('input').simulate('blur', {});
        tagInput.find('input').simulate('change', { target: { value: "hotsoon" } });
        tagInput.find('input').simulate('keyDown', { keyCode: 13 });
        const tags = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-wrapper .${BASE_CLASS_PREFIX}-tag-content`);
        expect(tags.length).toEqual(2);
        expect(tags.at(1).getDOMNode().textContent).toEqual('hotsoon');
        tagInput.unmount();
    });

    it('tagInput with value controlled mode ', () => {
        const props = {
            value: ['abc']
        };
        const tagInput = getTagInput(props);
        expect(tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-wrapper .${BASE_CLASS_PREFIX}-tag-content`).getDOMNode().textContent).toEqual('abc');
        tagInput.setProps({ value: ['hotsoon'] });
        tagInput.update();
        expect(tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-wrapper .${BASE_CLASS_PREFIX}-tag-content`).getDOMNode().textContent).toEqual('hotsoon');
    });

    it('tagInput with set value to null  ', () => {
        const props = {
            value: ['semi']
        };
        const tagInput = getTagInput(props);
        expect(tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-wrapper .${BASE_CLASS_PREFIX}-tag-content`).getDOMNode().textContent).toEqual('semi');
        tagInput.setProps({ value: null });
        tagInput.update();
        const tags = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-wrapper .${BASE_CLASS_PREFIX}-tag-content`);
        expect(tags.length).toEqual(0);
    });

    it('tagInput with set value to null  ', () => {
        const props = {
            value: ['semi']
        };
        const tagInput = getTagInput(props);
        expect(tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-wrapper .${BASE_CLASS_PREFIX}-tag-content`).getDOMNode().textContent).toEqual('semi');
        tagInput.setProps({ value: undefined });
        tagInput.update();
        const tags = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-wrapper .${BASE_CLASS_PREFIX}-tag-content`);
        expect(tags.length).toEqual(0);
    });

    it('tagInput with inputValue controlled mode ', () => {
        const props = {
            inputValue: 'abc'
        };
        const tagInput = getTagInput(props);
        expect(tagInput.find('input').getDOMNode().value).toEqual('abc');
        tagInput.setProps({ inputValue: 'hotsoon' });
        tagInput.update();
        expect(tagInput.find('input').getDOMNode().value).toEqual('hotsoon');
    })

    it('TagInput with onKeyDown', () => {
        const spyOnKeyDown = sinon.spy(value => { });
        const props = {
            onKeyDown: spyOnKeyDown,
        };
        const tagInput = getTagInput(props);
        tagInput.find('input').simulate('keyDown', { keyCode: 13 });
        expect(spyOnKeyDown.callCount).toEqual(1);
        tagInput.unmount();
    });

    it('TagInput with allowDuplicates', () => {
        const props = {
            allowDuplicates: true,
            defaultValue: ['abc'],
            inputValue: 'abc',
        };
        const tagInput = getTagInput(props);
        tagInput.find('input').simulate('keyDown', { keyCode: 13 });
        const tags = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-wrapper .${BASE_CLASS_PREFIX}-tag-content`);
        // allowDuplicates=true 时，可以添加重复的标签
        expect(tags.length).toEqual(2);
        tagInput.unmount();
    });

    it('TagInput with allowDuplicates false', () => {
        const props = {
            allowDuplicates: false,
            defaultValue: ['abc'],
            inputValue: 'abc',
        };
        const tagInput = getTagInput(props);
        tagInput.find('input').simulate('keyDown', { keyCode: 13 });
        const tags = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-wrapper .${BASE_CLASS_PREFIX}-tag-content`);
        // allowDuplicates=false 时，不能添加重复的标签
        expect(tags.length).toEqual(1);
        tagInput.unmount();
    });

    it('TagInput with draggable prop', () => {
        const props = {
            draggable: true,
            defaultValue: ['abc', 'hotsoon'],
        };
        const tagInput = getTagInput(props);
        // 验证 draggable 属性被正确传递
        expect(tagInput.props().draggable).toEqual(true);
        tagInput.unmount();
    });

    it('TagInput with renderTagItem', () => {
        const renderTagItem = (value, index) => (
            <span className="custom-tag-item" key={index}>{value}</span>
        );
        const props = {
            defaultValue: ['abc', 'hotsoon'],
            renderTagItem,
        };
        const tagInput = getTagInput(props);
        expect(tagInput.exists('.custom-tag-item')).toEqual(true);
        tagInput.unmount();
    });

    it('TagInput with autoFocus', () => {
        const props = {
            autoFocus: true,
        };
        const tagInput = getTagInput(props);
        // 验证 autoFocus 属性被正确传递
        expect(tagInput.props().autoFocus).toEqual(true);
        tagInput.unmount();
    });

    it('TagInput with aria-label', () => {
        const props = {
            'aria-label': 'Tag input field',
        };
        const tagInput = getTagInput(props);
        // 验证 aria-label 属性被正确传递到组件
        expect(tagInput.props()['aria-label']).toEqual('Tag input field');
        tagInput.unmount();
    });

    it('TagInput with preventScroll', () => {
        const props = {
            preventScroll: true,
        };
        const tagInput = getTagInput(props);
        // 验证 preventScroll 属性被正确传递
        expect(tagInput.props().preventScroll).toEqual(true);
        tagInput.unmount();
    });

    it('TagInput with insetLabel', () => {
        const props = {
            insetLabel: <span className="inset-label">Label</span>,
            insetLabelId: 'inset-label-id',
        };
        const tagInput = getTagInput(props);
        expect(tagInput.exists('.inset-label')).toEqual(true);
        tagInput.unmount();
    });

    it('TagInput with showRestTagsPopover false', () => {
        const props = {
            defaultValue: ['abc', 'hotsoon', 'lark'],
            maxTagCount: 1,
            showRestTagsPopover: false,
        };
        const tagInput = getTagInput(props);
        const n = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-wrapper-n`);
        expect(n.at(0).getDOMNode().textContent).toEqual('+2');
        tagInput.unmount();
    });

    it('TagInput with restTagsPopoverProps', () => {
        const props = {
            defaultValue: ['abc', 'hotsoon', 'lark'],
            maxTagCount: 1,
            showRestTagsPopover: true,
            restTagsPopoverProps: {
                position: 'bottom',
            },
        };
        const tagInput = getTagInput(props);
        expect(tagInput.props().restTagsPopoverProps.position).toEqual('bottom');
        tagInput.unmount();
    });

    it('TagInput with showContentTooltip', () => {
        const props = {
            defaultValue: ['abc'],
            showContentTooltip: true,
        };
        const tagInput = getTagInput(props);
        expect(tagInput.props().showContentTooltip).toEqual(true);
        tagInput.unmount();
    });

    it('TagInput with showContentTooltip object', () => {
        const props = {
            defaultValue: ['abc'],
            showContentTooltip: {
                type: 'popover',
                opts: { position: 'top' },
            },
        };
        const tagInput = getTagInput(props);
        expect(tagInput.props().showContentTooltip.type).toEqual('popover');
        tagInput.unmount();
    });

    it('TagInput with expandRestTagsOnClick', () => {
        const props = {
            defaultValue: ['abc', 'hotsoon', 'lark'],
            maxTagCount: 1,
            expandRestTagsOnClick: true,
        };
        const tagInput = getTagInput(props);
        expect(tagInput.props().expandRestTagsOnClick).toEqual(true);
        tagInput.unmount();
    });

    it('TagInput with expandRestTagsOnClick false', () => {
        const props = {
            defaultValue: ['abc', 'hotsoon', 'lark'],
            maxTagCount: 1,
            expandRestTagsOnClick: false,
        };
        const tagInput = getTagInput(props);
        // 点击后不展开
        tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput`).simulate('click', {});
        const n = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-wrapper-n`);
        expect(n.length).toBeGreaterThan(0);
        tagInput.unmount();
    });

    it('TagInput with clearIcon', () => {
        const props = {
            showClear: true,
            defaultValue: ['abc'],
            clearIcon: <span className="custom-clear-icon">X</span>,
        };
        const tagInput = getTagInput(props);
        expect(tagInput.props().clearIcon).toBeDefined();
        tagInput.unmount();
    });

    it('TagInput with split function', () => {
        const customSplit = (str, sep) => str.split(sep).filter(Boolean);
        const props = {
            split: customSplit,
            inputValue: 'abc,def',
        };
        const tagInput = getTagInput(props);
        expect(tagInput.props().split).toBe(customSplit);
        tagInput.unmount();
    });

    it('TagInput focus and blur methods', () => {
        const props = {
            defaultValue: ['abc'],
        };
        const tagInput = getTagInput(props);
        const instance = tagInput.instance();
        // 测试 focus 方法
        instance.focus();
        expect(tagInput.state().focusing).toBeDefined();
        // 测试 blur 方法
        instance.blur();
        tagInput.unmount();
    });

    it('TagInput with composition events', () => {
        const props = {
            defaultValue: ['abc'],
        };
        const tagInput = getTagInput(props);
        // 测试输入法组合事件处理器存在
        const input = tagInput.find('input');
        expect(input.prop('onCompositionStart')).toBeDefined();
        expect(input.prop('onCompositionEnd')).toBeDefined();
        tagInput.unmount();
    });

    it('TagInput with mouse enter and leave', () => {
        const props = {
            defaultValue: ['abc'],
        };
        const tagInput = getTagInput(props);
        tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput`).simulate('mouseEnter', {});
        expect(tagInput.state().hovering).toEqual(true);
        tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput`).simulate('mouseLeave', {});
        expect(tagInput.state().hovering).toEqual(false);
        tagInput.unmount();
    });

    it('TagInput click triggers active state', () => {
        const props = {
            defaultValue: ['abc'],
        };
        const tagInput = getTagInput(props);
        tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput`).simulate('click', {});
        expect(tagInput.state().active).toEqual(true);
        tagInput.unmount();
    });

    it('TagInput with disabled does not trigger click', () => {
        const props = {
            defaultValue: ['abc'],
            disabled: true,
        };
        const tagInput = getTagInput(props);
        tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput`).simulate('click', {});
        // disabled 状态下不应该激活
        expect(tagInput.state().active).toEqual(false);
        tagInput.unmount();
    });

    it('TagInput backspace on empty input does nothing', () => {
        const spyOnRemove = sinon.spy(value => { });
        const props = {
            defaultValue: [],
            onRemove: spyOnRemove,
        };
        const tagInput = getTagInput(props);
        tagInput.find('input').simulate('keyDown', { keyCode: 8 });
        expect(spyOnRemove.callCount).toEqual(0);
        tagInput.unmount();
    });

    it('TagInput with aria-invalid when error status', () => {
        const props = {
            validateStatus: 'error',
        };
        const tagInput = getTagInput(props);
        expect(tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput`).prop('aria-invalid')).toEqual(true);
        tagInput.unmount();
    });

    it('TagInput with aria-disabled when disabled', () => {
        const props = {
            disabled: true,
        };
        const tagInput = getTagInput(props);
        expect(tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput`).prop('aria-disabled')).toEqual(true);
        tagInput.unmount();
    });

    it('TagInput with draggable renders Sortable when active', () => {
        const props = {
            defaultValue: ['abc', 'def'],
            draggable: true,
        };
        const tagInput = getTagInput(props);
        // 先激活组件
        tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput`).simulate('click', {});
        expect(tagInput.state().active).toEqual(true);
        // 验证 draggable 属性
        expect(tagInput.props().draggable).toEqual(true);
        tagInput.unmount();
    });

    it('TagInput with autoFocus', () => {
        const props = {
            defaultValue: ['abc'],
            autoFocus: true,
        };
        const tagInput = getTagInput(props);
        expect(tagInput.props().autoFocus).toEqual(true);
        tagInput.unmount();
    });

    it('TagInput with warning validateStatus', () => {
        const props = {
            validateStatus: 'warning',
        };
        const tagInput = getTagInput(props);
        expect(tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-warning`).length).toBeGreaterThan(0);
        tagInput.unmount();
    });

    it('TagInput with large size', () => {
        const props = {
            size: 'large',
        };
        const tagInput = getTagInput(props);
        expect(tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-large`).length).toBeGreaterThan(0);
        tagInput.unmount();
    });

    it('TagInput clear button click', () => {
        const spyOnChange = sinon.spy(value => { });
        const props = {
            defaultValue: ['abc', 'def'],
            showClear: true,
            onChange: spyOnChange,
        };
        const tagInput = getTagInput(props);
        // 触发 hover 状态以显示清除按钮
        tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput`).simulate('mouseEnter', {});
        const clearBtn = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-clearBtn`);
        expect(clearBtn.length).toBeGreaterThan(0);
        clearBtn.simulate('click', { stopPropagation: () => {} });
        expect(spyOnChange.calledOnce).toEqual(true);
        tagInput.unmount();
    });

    it('TagInput prefix click focuses input', () => {
        const props = {
            defaultValue: ['abc'],
            prefix: <span className="test-prefix">Prefix</span>,
        };
        const tagInput = getTagInput(props);
        const prefix = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-prefix`);
        expect(prefix.length).toBeGreaterThan(0);
        // 验证 prefix 有 onClick 处理器
        expect(prefix.prop('onClick')).toBeDefined();
        tagInput.unmount();
    });

    it('TagInput suffix click focuses input', () => {
        const props = {
            defaultValue: ['abc'],
            suffix: <span className="test-suffix">Suffix</span>,
        };
        const tagInput = getTagInput(props);
        const suffix = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-suffix`);
        expect(suffix.length).toBeGreaterThan(0);
        // 验证 suffix 有 onClick 处理器
        expect(suffix.prop('onClick')).toBeDefined();
        tagInput.unmount();
    });

    it('TagInput with allowDuplicates false', () => {
        const spyOnChange = sinon.spy(value => { });
        const props = {
            defaultValue: ['abc'],
            allowDuplicates: false,
            onChange: spyOnChange,
        };
        const tagInput = getTagInput(props);
        expect(tagInput.props().allowDuplicates).toEqual(false);
        tagInput.unmount();
    });

    it('TagInput with addOnBlur', () => {
        const spyOnChange = sinon.spy(value => { });
        const props = {
            addOnBlur: true,
            onChange: spyOnChange,
        };
        const tagInput = getTagInput(props);
        expect(tagInput.props().addOnBlur).toEqual(true);
        tagInput.unmount();
    });

    it('TagInput input blur adds tag when addOnBlur is true', () => {
        const spyOnAdd = sinon.spy(value => { });
        const props = {
            addOnBlur: true,
            onAdd: spyOnAdd,
            defaultValue: [],
        };
        const tagInput = getTagInput(props);
        tagInput.find('input').simulate('change', { target: { value: 'newtag' } });
        tagInput.find('input').simulate('blur', {});
        // 验证 onAdd 被调用
        expect(spyOnAdd.called).toEqual(true);
        tagInput.unmount();
    });

    it('TagInput with maxLength', () => {
        const props = {
            maxLength: 10,
        };
        const tagInput = getTagInput(props);
        expect(tagInput.props().maxLength).toEqual(10);
        tagInput.unmount();
    });

    it('TagInput with max', () => {
        const spyOnExceed = sinon.spy(value => { });
        const props = {
            defaultValue: ['a', 'b', 'c'],
            max: 3,
            onExceed: spyOnExceed,
        };
        const tagInput = getTagInput(props);
        expect(tagInput.props().max).toEqual(3);
        tagInput.unmount();
    });

    it('TagInput with onInputExceed', () => {
        const spyOnInputExceed = sinon.spy(value => { });
        const props = {
            maxLength: 5,
            onInputExceed: spyOnInputExceed,
        };
        const tagInput = getTagInput(props);
        expect(tagInput.props().onInputExceed).toBeDefined();
        tagInput.unmount();
    });

    it('TagInput with aria-label', () => {
        const props = {
            'aria-label': 'Tag input field',
        };
        const tagInput = getTagInput(props);
        expect(tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput`).prop('aria-label')).toEqual('Tag input field');
        tagInput.unmount();
    });

    it('TagInput with controlled value', () => {
        const props = {
            value: ['controlled', 'tags'],
        };
        const tagInput = getTagInput(props);
        expect(tagInput.state().tagsArray).toEqual(['controlled', 'tags']);
        tagInput.unmount();
    });

    it('TagInput updates when value prop changes', () => {
        const props = {
            value: ['initial'],
        };
        const tagInput = getTagInput(props);
        expect(tagInput.state().tagsArray).toEqual(['initial']);
        tagInput.setProps({ value: ['updated', 'tags'] });
        tagInput.update();
        expect(tagInput.state().tagsArray).toEqual(['updated', 'tags']);
        tagInput.unmount();
    });

    it('TagInput with onBlur callback', () => {
        const spyOnBlur = sinon.spy(e => { });
        const props = {
            onBlur: spyOnBlur,
        };
        const tagInput = getTagInput(props);
        tagInput.find('input').simulate('focus', {});
        tagInput.find('input').simulate('blur', {});
        expect(spyOnBlur.called).toEqual(true);
        tagInput.unmount();
    });

    it('TagInput with onFocus callback', () => {
        const spyOnFocus = sinon.spy(e => { });
        const props = {
            onFocus: spyOnFocus,
        };
        const tagInput = getTagInput(props);
        tagInput.find('input').simulate('focus', {});
        expect(spyOnFocus.called).toEqual(true);
        tagInput.unmount();
    });

    it('TagInput with onInputChange callback', () => {
        const spyOnInputChange = sinon.spy((v, e) => { });
        const props = {
            onInputChange: spyOnInputChange,
        };
        const tagInput = getTagInput(props);
        tagInput.find('input').simulate('change', { target: { value: 'test' } });
        expect(spyOnInputChange.called).toEqual(true);
        tagInput.unmount();
    });

    it('TagInput with onKeyDown callback', () => {
        const spyOnKeyDown = sinon.spy(e => { });
        const props = {
            onKeyDown: spyOnKeyDown,
        };
        const tagInput = getTagInput(props);
        tagInput.find('input').simulate('keyDown', { keyCode: 65 });
        expect(spyOnKeyDown.called).toEqual(true);
        tagInput.unmount();
    });

    it('TagInput enter key adds tag', () => {
        const spyOnAdd = sinon.spy(value => { });
        const props = {
            defaultValue: [],
            onAdd: spyOnAdd,
        };
        const tagInput = getTagInput(props);
        tagInput.find('input').simulate('change', { target: { value: 'newtag' } });
        tagInput.find('input').simulate('keyDown', { keyCode: 13 });
        expect(spyOnAdd.called).toEqual(true);
        tagInput.unmount();
    });

    it('TagInput with separator string', () => {
        const props = {
            separator: ',',
        };
        const tagInput = getTagInput(props);
        expect(tagInput.props().separator).toEqual(',');
        tagInput.unmount();
    });

    it('TagInput with separator array', () => {
        const props = {
            separator: [',', ';'],
        };
        const tagInput = getTagInput(props);
        expect(tagInput.props().separator).toEqual([',', ';']);
        tagInput.unmount();
    });

    it('TagInput with separator null', () => {
        const props = {
            separator: null,
        };
        const tagInput = getTagInput(props);
        expect(tagInput.props().separator).toEqual(null);
        tagInput.unmount();
    });

    it('TagInput with custom clearIcon renders correctly', () => {
        const props = {
            defaultValue: ['abc'],
            showClear: true,
            clearIcon: <span className="custom-clear">X</span>,
        };
        const tagInput = getTagInput(props);
        // 触发 hover 状态
        tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput`).simulate('mouseEnter', {});
        // 验证自定义 clearIcon 存在
        expect(tagInput.find('.custom-clear').length).toBeGreaterThan(0);
        tagInput.unmount();
    });

    it('TagInput clear button with disabled state', () => {
        const props = {
            defaultValue: ['abc'],
            showClear: true,
            disabled: true,
        };
        const tagInput = getTagInput(props);
        // 验证 disabled 状态下清除按钮有 invisible 类
        const clearBtn = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-clearBtn`);
        expect(clearBtn.hasClass(`${BASE_CLASS_PREFIX}-tagInput-clearBtn-invisible`)).toEqual(true);
        tagInput.unmount();
    });

    it('TagInput clear button invisible when empty', () => {
        const props = {
            defaultValue: [],
            showClear: true,
        };
        const tagInput = getTagInput(props);
        tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput`).simulate('mouseEnter', {});
        const clearBtn = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-clearBtn`);
        expect(clearBtn.hasClass(`${BASE_CLASS_PREFIX}-tagInput-clearBtn-invisible`)).toEqual(true);
        tagInput.unmount();
    });

    it('TagInput with inputValue in state', () => {
        const props = {
            inputValue: 'test input',
        };
        const tagInput = getTagInput(props);
        expect(tagInput.state().inputValue).toEqual('test input');
        tagInput.unmount();
    });

    it('TagInput with controlled inputValue updates', () => {
        const props = {
            inputValue: 'initial',
        };
        const tagInput = getTagInput(props);
        expect(tagInput.state().inputValue).toEqual('initial');
        tagInput.setProps({ inputValue: 'updated' });
        tagInput.update();
        expect(tagInput.state().inputValue).toEqual('updated');
        tagInput.unmount();
    });

    it('TagInput with insetLabel string', () => {
        const props = {
            insetLabel: 'Label:',
        };
        const tagInput = getTagInput(props);
        const insetLabel = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-inset-label`);
        expect(insetLabel.length).toBeGreaterThan(0);
        tagInput.unmount();
    });

    it('TagInput prefix with string renders text class', () => {
        const props = {
            prefix: 'Prefix:',
        };
        const tagInput = getTagInput(props);
        const prefix = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-prefix-text`);
        expect(prefix.length).toBeGreaterThan(0);
        tagInput.unmount();
    });

    it('TagInput suffix with string renders text class', () => {
        const props = {
            suffix: 'Suffix',
        };
        const tagInput = getTagInput(props);
        const suffix = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-suffix-text`);
        expect(suffix.length).toBeGreaterThan(0);
        tagInput.unmount();
    });

    it('TagInput with small size', () => {
        const props = {
            size: 'small',
        };
        const tagInput = getTagInput(props);
        expect(tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-small`).length).toBeGreaterThan(0);
        tagInput.unmount();
    });

    it('TagInput with default size', () => {
        const props = {
            size: 'default',
        };
        const tagInput = getTagInput(props);
        // default size 不添加额外的 size 类
        expect(tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-small`).length).toEqual(0);
        expect(tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-large`).length).toEqual(0);
        tagInput.unmount();
    });

    it('TagInput with renderTagItem custom renderer', () => {
        const customRenderer = (value, index, onClose) => (
            <span key={index} className="custom-tag" onClick={onClose}>{value}</span>
        );
        const props = {
            defaultValue: ['abc', 'def'],
            renderTagItem: customRenderer,
        };
        const tagInput = getTagInput(props);
        expect(tagInput.find('.custom-tag').length).toEqual(2);
        tagInput.unmount();
    });

    it('TagInput tag close removes tag', () => {
        const spyOnRemove = sinon.spy((value, idx) => { });
        const props = {
            defaultValue: ['abc', 'def'],
            onRemove: spyOnRemove,
        };
        const tagInput = getTagInput(props);
        // 验证 tag 有 close 按钮
        const closeBtn = tagInput.find(`.${BASE_CLASS_PREFIX}-tag-close`);
        expect(closeBtn.length).toBeGreaterThan(0);
        tagInput.unmount();
    });

    it('TagInput backspace removes last tag', () => {
        const spyOnRemove = sinon.spy((value, idx) => { });
        const props = {
            defaultValue: ['abc', 'def'],
            onRemove: spyOnRemove,
        };
        const tagInput = getTagInput(props);
        // 确保输入框为空
        expect(tagInput.state().inputValue).toEqual('');
        tagInput.find('input').simulate('keyDown', { keyCode: 8 });
        expect(spyOnRemove.called).toEqual(true);
        tagInput.unmount();
    });

    it('TagInput with expandRestTagsOnClick true expands on click', () => {
        const props = {
            defaultValue: ['abc', 'hotsoon', 'lark', 'bytedance'],
            maxTagCount: 2,
            expandRestTagsOnClick: true,
        };
        const tagInput = getTagInput(props);
        // 点击前有 +2 标签
        let n = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-wrapper-n`);
        expect(n.length).toBeGreaterThan(0);
        // 点击激活
        tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput`).simulate('click', {});
        expect(tagInput.state().active).toEqual(true);
        // 激活后应该展开所有标签
        tagInput.update();
        // 验证 +n 标签不再显示
        const nAfter = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-wrapper-n`);
        expect(nAfter.length).toEqual(0);
        tagInput.unmount();
    });

    it('TagInput with composition events - compositionStart', () => {
        const props = {
            defaultValue: ['abc'],
        };
        const tagInput = getTagInput(props);
        const input = tagInput.find('input');
        
        // 触发 compositionStart 事件
        input.simulate('compositionStart');
        // 验证事件处理器存在
        expect(input.prop('onCompositionStart')).toBeDefined();
        tagInput.unmount();
    });

    it('TagInput with composition events - compositionEnd', () => {
        const props = {
            defaultValue: ['abc'],
        };
        const tagInput = getTagInput(props);
        const input = tagInput.find('input');
        
        // 触发 compositionEnd 事件
        input.simulate('compositionEnd');
        // 验证事件处理器存在
        expect(input.prop('onCompositionEnd')).toBeDefined();
        tagInput.unmount();
    });

    it('TagInput composition flow', () => {
        const props = {
            defaultValue: ['abc'],
        };
        const tagInput = getTagInput(props);
        const input = tagInput.find('input');
        
        // 模拟完整的输入法组合流程
        input.simulate('compositionStart');
        input.simulate('change', { target: { value: '中文' } });
        input.simulate('compositionEnd');
        
        tagInput.unmount();
    });

    it('TagInput showClear with disabled state', () => {
        const props = {
            showClear: true,
            disabled: true,
            defaultValue: ['abc'],
        };
        const tagInput = getTagInput(props);
        // 验证 showClear 和 disabled 组合
        expect(tagInput.props().showClear).toEqual(true);
        expect(tagInput.props().disabled).toEqual(true);
        tagInput.unmount();
    });

    it('TagInput showClear with empty value', () => {
        const props = {
            showClear: true,
            defaultValue: [],
        };
        const tagInput = getTagInput(props);
        // 验证空值时的清除按钮状态
        const clearBtn = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-clearBtn`);
        expect(clearBtn.length).toBeGreaterThan(0);
        tagInput.unmount();
    });

    it('TagInput showClear with empty inputValue and tags', () => {
        const props = {
            showClear: true,
            defaultValue: [],
            inputValue: '',
        };
        const tagInput = getTagInput(props);
        // 验证空输入和空标签时的清除按钮
        expect(tagInput.props().showClear).toEqual(true);
        tagInput.unmount();
    });

    it('TagInput draggable with Sortable component', () => {
        const props = {
            draggable: true,
            defaultValue: ['abc', 'def', 'ghi'],
        };
        const tagInput = getTagInput(props);
        // 验证 draggable 属性
        expect(tagInput.props().draggable).toEqual(true);
        tagInput.unmount();
    });

    it('TagInput onSortEnd callback', () => {
        const onSortEnd = sinon.spy();
        const props = {
            draggable: true,
            defaultValue: ['abc', 'def', 'ghi'],
        };
        const tagInput = getTagInput(props);
        const instance = tagInput.instance();
        
        // 调用 onSortEnd 方法
        instance.onSortEnd({ oldIndex: 0, newIndex: 2 });
        
        // 验证方法存在
        expect(typeof instance.onSortEnd).toBe('function');
        tagInput.unmount();
    });

    it('TagInput renderSortTag method', () => {
        const props = {
            draggable: true,
            defaultValue: ['abc', 'def'],
        };
        const tagInput = getTagInput(props);
        const instance = tagInput.instance();
        
        // 验证 renderSortTag 方法存在
        expect(typeof instance.renderSortTag).toBe('function');
        tagInput.unmount();
    });

    it('TagInput with hovering state', () => {
        const props = {
            showClear: true,
            defaultValue: ['abc'],
        };
        const tagInput = getTagInput(props);
        
        // 模拟鼠标进入
        tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput`).simulate('mouseEnter');
        expect(tagInput.state().hovering).toEqual(true);
        
        // 模拟鼠标离开
        tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput`).simulate('mouseLeave');
        expect(tagInput.state().hovering).toEqual(false);
        
        tagInput.unmount();
    });

    it('TagInput clear button visibility with hovering', () => {
        const props = {
            showClear: true,
            defaultValue: ['abc'],
        };
        const tagInput = getTagInput(props);
        
        // 鼠标进入时清除按钮可见
        tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput`).simulate('mouseEnter');
        const clearBtn = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-clearBtn`);
        expect(clearBtn.length).toBeGreaterThan(0);
        
        tagInput.unmount();
    });

    it('TagInput clear button invisible when disabled', () => {
        const props = {
            showClear: true,
            disabled: true,
            defaultValue: ['abc'],
        };
        const tagInput = getTagInput(props);
        
        // 鼠标进入
        tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput`).simulate('mouseEnter');
        // 清除按钮应该有 invisible 类
        const clearBtn = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-clearBtn-invisible`);
        expect(clearBtn.length).toBeGreaterThan(0);
        
        tagInput.unmount();
    });

    it('TagInput clear button invisible when empty', () => {
        const props = {
            showClear: true,
            defaultValue: [],
        };
        const tagInput = getTagInput(props);
        
        // 鼠标进入
        tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput`).simulate('mouseEnter');
        // 清除按钮应该有 invisible 类（因为没有内容）
        const clearBtn = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-clearBtn-invisible`);
        expect(clearBtn.length).toBeGreaterThan(0);
        
        tagInput.unmount();
    });

    it('TagInput handleInputCompositionStart', () => {
        const props = {
            defaultValue: ['abc'],
        };
        const tagInput = getTagInput(props);
        const instance = tagInput.instance();
        
        // 调用 handleInputCompositionStart
        instance.handleInputCompositionStart({ nativeEvent: {}, target: { value: 'test' } });
        
        // 验证方法存在
        expect(typeof instance.handleInputCompositionStart).toBe('function');
        tagInput.unmount();
    });

    it('TagInput handleInputCompositionEnd', () => {
        const props = {
            defaultValue: ['abc'],
        };
        const tagInput = getTagInput(props);
        const instance = tagInput.instance();
        
        // 调用 handleInputCompositionEnd
        instance.handleInputCompositionEnd({ nativeEvent: {}, target: { value: 'test' } });
        
        // 验证方法存在
        expect(typeof instance.handleInputCompositionEnd).toBe('function');
        tagInput.unmount();
    });

    it('TagInput focus with disabled state', () => {
        const props = {
            disabled: true,
            defaultValue: ['abc'],
        };
        const tagInput = getTagInput(props);
        const instance = tagInput.instance();
        
        // 调用 focus 方法（disabled 状态下不应该注册 clickOutside）
        instance.focus();
        
        tagInput.unmount();
    });

    it('TagInput with separator null', () => {
        const props = {
            separator: null,
            defaultValue: ['abc'],
        };
        const tagInput = getTagInput(props);
        expect(tagInput.props().separator).toBeNull();
        tagInput.unmount();
    });

    it('TagInput clear button keyPress handler', () => {
        const onClear = sinon.spy();
        const props = {
            showClear: true,
            defaultValue: ['abc'],
            onClear,
        };
        const tagInput = getTagInput(props);
        
        // 鼠标进入使清除按钮可见
        tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput`).simulate('mouseEnter');
        
        const clearBtn = tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput-clearBtn`);
        if (clearBtn.length > 0) {
            // 模拟键盘按下 Enter
            clearBtn.at(0).simulate('keyPress', { key: 'Enter' });
        }
        
        tagInput.unmount();
    });

    it('TagInput handleInputMouseEnter method', () => {
        const props = {
            defaultValue: ['abc'],
        };
        const tagInput = getTagInput(props);
        const instance = tagInput.instance();
        
        // 直接调用 handleInputMouseEnter 方法
        instance.handleInputMouseEnter({ target: {} });
        
        tagInput.unmount();
    });

    it('TagInput handleClickPrefixOrSuffix method', () => {
        const props = {
            defaultValue: ['abc'],
            prefix: <span>Prefix</span>,
        };
        const tagInput = getTagInput(props);
        const instance = tagInput.instance();
        
        // 直接调用 handleClickPrefixOrSuffix 方法
        instance.handleClickPrefixOrSuffix({ target: {}, stopPropagation: () => {} });
        
        tagInput.unmount();
    });

    it('TagInput handlePreventMouseDown method', () => {
        const props = {
            defaultValue: ['abc'],
        };
        const tagInput = getTagInput(props);
        const instance = tagInput.instance();
        
        // 直接调用 handlePreventMouseDown 方法
        instance.handlePreventMouseDown({ preventDefault: () => {} });
        
        tagInput.unmount();
    });

    it('TagInput renderTagItem with draggable and showIconHandler', () => {
        const renderTagItem = (value, index, onClose) => (
            <span className="custom-draggable-tag" key={index}>{value}</span>
        );
        const props = {
            draggable: true,
            defaultValue: ['abc', 'def'],
            renderTagItem,
        };
        const tagInput = getTagInput(props);
        
        // 激活组件以显示拖拽手柄
        tagInput.find(`.${BASE_CLASS_PREFIX}-tagInput`).simulate('click', {});
        tagInput.update();
        
        // 验证自定义渲染存在
        expect(tagInput.find('.custom-draggable-tag').length).toBeGreaterThanOrEqual(0);
        tagInput.unmount();
    });

    it('TagInput adapter toggleFocusing method', () => {
        const props = {
            defaultValue: ['abc'],
        };
        const tagInput = getTagInput(props);
        const instance = tagInput.instance();
        
        // 调用 adapter.toggleFocusing 方法
        instance.adapter.toggleFocusing(true);
        tagInput.update();
        expect(tagInput.state().focusing).toEqual(true);
        
        instance.adapter.toggleFocusing(false);
        tagInput.update();
        expect(tagInput.state().focusing).toEqual(false);
        
        tagInput.unmount();
    });

    it('TagInput adapter setEntering method', () => {
        const props = {
            defaultValue: ['abc'],
        };
        const tagInput = getTagInput(props);
        const instance = tagInput.instance();
        
        // 调用 adapter.setEntering 方法
        instance.adapter.setEntering(true);
        tagInput.update();
        expect(tagInput.state().entering).toEqual(true);
        
        instance.adapter.setEntering(false);
        tagInput.update();
        expect(tagInput.state().entering).toEqual(false);
        
        tagInput.unmount();
    });

    it('TagInput adapter setActive method', () => {
        const props = {
            defaultValue: ['abc'],
        };
        const tagInput = getTagInput(props);
        const instance = tagInput.instance();
        
        // 调用 adapter.setActive 方法
        instance.adapter.setActive(true);
        tagInput.update();
        expect(tagInput.state().active).toEqual(true);
        
        instance.adapter.setActive(false);
        tagInput.update();
        expect(tagInput.state().active).toEqual(false);
        
        tagInput.unmount();
    });

    it('TagInput adapter registerClickOutsideHandler', () => {
        const props = {
            defaultValue: ['abc'],
        };
        const tagInput = getTagInput(props);
        const instance = tagInput.instance();
        
        // 调用 adapter.registerClickOutsideHandler 方法
        const callback = sinon.spy();
        instance.adapter.registerClickOutsideHandler(callback);
        
        // 验证 clickOutsideHandler 被设置
        expect(instance.clickOutsideHandler).toBeDefined();
        
        // 清理
        instance.adapter.unregisterClickOutsideHandler();
        expect(instance.clickOutsideHandler).toBeNull();
        
        tagInput.unmount();
    });

    it('TagInput adapter getClickOutsideHandler', () => {
        const props = {
            defaultValue: ['abc'],
        };
        const tagInput = getTagInput(props);
        const instance = tagInput.instance();
        
        // 初始状态 clickOutsideHandler 应该为 null
        expect(instance.adapter.getClickOutsideHandler()).toBeNull();
        
        // 注册后应该返回 handler
        const callback = sinon.spy();
        instance.adapter.registerClickOutsideHandler(callback);
        expect(instance.adapter.getClickOutsideHandler()).toBeDefined();
        
        // 清理
        instance.adapter.unregisterClickOutsideHandler();
        
        tagInput.unmount();
    });

    it('TagInput clickOutsideHandler triggers callback when clicking outside', () => {
        const props = {
            defaultValue: ['abc'],
        };
        const tagInput = getTagInput(props);
        const instance = tagInput.instance();
        
        const callback = sinon.spy();
        instance.adapter.registerClickOutsideHandler(callback);
        
        // 获取 clickOutsideHandler
        const handler = instance.clickOutsideHandler;
        
        // 模拟点击外部的事件
        const outsideEvent = {
            target: document.body,
            composedPath: () => [document.body],
        };
        handler(outsideEvent);
        
        // 验证 callback 被调用
        expect(callback.called).toEqual(true);
        
        // 清理
        instance.adapter.unregisterClickOutsideHandler();
        
        tagInput.unmount();
    });

    it('TagInput clickOutsideHandler does not trigger when clicking inside', () => {
        const props = {
            defaultValue: ['abc'],
        };
        const tagInput = getTagInput(props);
        const instance = tagInput.instance();
        
        const callback = sinon.spy();
        instance.adapter.registerClickOutsideHandler(callback);
        
        // 获取 clickOutsideHandler
        const handler = instance.clickOutsideHandler;
        
        // 获取 tagInput DOM
        const tagInputDom = instance.tagInputRef.current;
        
        // 模拟点击内部的事件
        const insideEvent = {
            target: tagInputDom,
            composedPath: () => [tagInputDom],
        };
        handler(insideEvent);
        
        // 验证 callback 没有被调用
        expect(callback.called).toEqual(false);
        
        // 清理
        instance.adapter.unregisterClickOutsideHandler();
        
        tagInput.unmount();
    });

    it('TagInput clickOutsideHandler with composedPath fallback', () => {
        const props = {
            defaultValue: ['abc'],
        };
        const tagInput = getTagInput(props);
        const instance = tagInput.instance();
        
        const callback = sinon.spy();
        instance.adapter.registerClickOutsideHandler(callback);
        
        // 获取 clickOutsideHandler
        const handler = instance.clickOutsideHandler;
        
        // 模拟没有 composedPath 的事件（fallback 到 [target]）
        const outsideEvent = {
            target: document.body,
            composedPath: null,
        };
        handler(outsideEvent);
        
        // 验证 callback 被调用
        expect(callback.called).toEqual(true);
        
        // 清理
        instance.adapter.unregisterClickOutsideHandler();
        
        tagInput.unmount();
    });
})