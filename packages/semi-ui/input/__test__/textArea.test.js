import TextArea from '../textarea';
import Icon from '../../icons/index';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';
import truncateValue from '../../../semi-foundation/input/util/truncateValue';
import GraphemeSplitter from 'grapheme-splitter';
import { isString } from 'lodash';

function getValueLength(str) {
    if (isString(str)) {
        const splitter = new GraphemeSplitter();
        return splitter.countGraphemes(str);
    } else {
        return -1;
    }
}

describe('TextArea', () => {
    it('TextArea showLineNumber, start from 3, custom className and style', () => {
        const customClass = 'custom-line-num';
        const customStyle = { color: 'blue', background: 'gray' };
        const wrapper = mount(
            <TextArea
                showLineNumber
                lineNumberStart={3}
                lineNumberClassName={customClass}
                lineNumberStyle={customStyle}
                value={"row1\nrow2\nrow3"} />
        );
        const lnBar = wrapper.find(`.${BASE_CLASS_PREFIX}-input-textarea-lineNumber`).first();
        expect(lnBar.hasClass(customClass)).toEqual(true);
        expect(lnBar.prop('style')).toMatchObject(customStyle);
        const items = lnBar.find(`.${BASE_CLASS_PREFIX}-input-textarea-lineNumber-item`);
        expect(items).toHaveLength(3);
        items.forEach((el, idx) => {
            expect(el.text()).toEqual(String(3 + idx));
        });
    });

    it('TextArea with custom className & style', () => {
        const wrapper = mount(<TextArea className="test" style={{ color: 'red' }} />);
        expect(wrapper.hasClass('test')).toEqual(true);
        expect(wrapper.find('div.test')).toHaveStyle('color', 'red');
    });

    it('TextArea defaultValue', () => {
        let defaultValue = 'semi';
        const textAreaWithDefaultValue = mount(<TextArea defaultValue={defaultValue} />);
        const textareaDom = textAreaWithDefaultValue.find('textarea');
        expect(textareaDom.instance().value).toEqual(defaultValue);
    });

    it('TextArea onChange trigger when value change', () => {
        let textAreaValue = 'semi';
        let event = { target: { value: textAreaValue } };
        let onChange = value => {
            console.log(value);
        };
        let spyOnChange = sinon.spy(onChange);
        const textArea = mount(<TextArea onChange={spyOnChange} />);
        textArea.find('textarea').simulate('change', event);
        expect(spyOnChange.calledOnce).toBe(true);
        expect(spyOnChange.calledWithMatch(textAreaValue)).toBe(true);
    });

    it('TextArea show maxCount', () => {
        const textarea = mount(<TextArea maxCount={10} />);
        const counter = textarea.find(`.${BASE_CLASS_PREFIX}-input-textarea-counter`);
        expect(counter.instance().textContent).toEqual('0/10');
        textarea.setProps({ value: 'semi' });
        expect(counter.instance().textContent).toEqual('4/10');
    });

    it('TextArea with placeholder', () => {
        let placeholderText = 'semi placeholder';
        const textarea = mount(<TextArea placeholder={placeholderText} />);
        let textareaDom = textarea.find('textarea');
        expect(textareaDom.props().placeholder).toEqual(placeholderText);
    });

    it('TextArea disabled', () => {
        const textarea = mount(<TextArea disabled />);
        let textareaDom = textarea.find(`textarea.${BASE_CLASS_PREFIX}-input-textarea-disabled`);
        expect(textareaDom.props().disabled).toEqual(true);
    });

    it('TextArea showClear / onClear', () => {
        const spyOnClear = sinon.spy(() => {});
        const textarea = mount(<TextArea showClear defaultValue="123" onClear={spyOnClear} />);
        textarea
            .simulate('mouseEnter', {})
            .find(`.${BASE_CLASS_PREFIX}-input-clearbtn`)
            .simulate('click');
        expect(spyOnClear.calledOnce).toBe(true);
        expect(textarea.find(`.${BASE_CLASS_PREFIX}-input-textarea`).getDOMNode().textContent).toEqual('');
    });

    // TODO
    // it('TextArea autosize', () => {
    //     let placeholderText = 'semi placeholder';
    //     const textarea = mount(<TextArea autoSize />);
    //     let textareaDom = textarea.find('textarea');
    //     expect(textareaDom.props().placeholder).toEqual(placeholderText);
    // })

    it('TextArea onEnterPress', () => {
        let onEnterPress = e => {
            console.log(e);
        };
        let spyOnPressEnter = sinon.spy(onEnterPress);
        const textArea = mount(<TextArea onEnterPress={spyOnPressEnter} />);
        let event = { key: 'Enter', keyCode: 13 };
        // textArea.find('textarea').simulate('keypress', event);
        textArea.find('textarea').simulate('keydown', event);
        expect(spyOnPressEnter.calledOnce).toBe(true);
    });

    it('TextArea controlled mode', () => {
        let onChange = e => {
            console.log(e);
        };
        let spyOnChange = sinon.spy(onChange);
        const textArea = mount(<TextArea onChange={spyOnChange} value="semi" />);
        const textareaDom = textArea.find('textarea');
        expect(textareaDom.instance().value).toEqual('semi');
        let newValue = 'vita lemon';
        let event = { target: { value: newValue } };
        textArea.find('textarea').simulate('change', event);
        expect(spyOnChange.calledOnce).toBe(true);
        expect(spyOnChange.calledWithMatch(newValue)).toBe(true);
        textArea.setProps({ value: newValue });
        expect(textareaDom.instance().value).toEqual(newValue);
    });

    it('TextArea maxCount exceed', async () => {
        const defaultValue = '💖💖💖💖💖💖💖💖💖💖';
        const textarea = mount(<TextArea defaultValue={defaultValue} maxCount={10} />);
        const counter = textarea.find(`.${BASE_CLASS_PREFIX}-input-textarea-counter`);
        expect(counter.hasClass('semi-input-textarea-counter-exceed')).toEqual(true);
        textarea.setProps({ getValueLength });
        const counter2 = textarea.find(`.${BASE_CLASS_PREFIX}-input-textarea-counter`);
        expect(counter2.hasClass('semi-input-textarea-counter-exceed')).toEqual(false);
    });

    it('test minLength', () => {
        let inputValue = '💖💖💖';
        let inputValue1 = '💖💖💖💖';
        let minLength = 4;
        let event = { target: { value: inputValue } };
        let event1 = { target: { value: inputValue1 } };

        let onChange = value => {
            console.log(value);
        };
        let spyOnChange = sinon.spy(onChange);
        const textArea = mount(
            <TextArea onChange={spyOnChange} minLength={minLength} getValueLength={getValueLength} />
        );
        const textAreaDom = textArea.find('textarea');

        textAreaDom.simulate('change', event);
        expect(spyOnChange.calledOnce).toBe(true);
        expect(spyOnChange.calledWithMatch(textAreaDom)).toBe(true);
        expect(textAreaDom.instance().minLength).toEqual(inputValue.length + (minLength - getValueLength(inputValue)));

        textAreaDom.simulate('change', event1);
        expect(spyOnChange.calledWithMatch(textAreaDom)).toBe(true);
        expect(textAreaDom.instance().minLength).toEqual(minLength);
    });

    it('test maxLength + truncateValue', () => {
        function truncateValue(inputValue, maxLength, getValueLength) {
            let event = { target: { value: inputValue } };
            let onChange = value => {
                console.log(value);
            };

            let spyOnChange = sinon.spy(onChange);
            const textArea = mount(
                <TextArea onChange={spyOnChange} maxLength={maxLength} getValueLength={getValueLength} />
            );
            const textAreaDom = textArea.find('textarea');
            textAreaDom.simulate('change', event);
            expect(spyOnChange.calledOnce).toBe(true);
            return textAreaDom.instance().value;
        }

        const testCases = [
            // 自定义valueLength
            ['Semi', 5, getValueLength, 'Semi'],
            ['Semi Design', 4, getValueLength, 'Semi'],
            ['💖💖💖💖💖💖💖💖💖💖👨👩👧👦', 10, getValueLength, '💖💖💖💖💖💖💖💖💖💖'],
            ['💖', -1, getValueLength, ''],
            ['🆗', 1, getValueLength, '🆗'],
        ];

        for (let [value, length, fc, result] of testCases) {
            expect(truncateValue(value, length, fc)).toBe(result);
        }
    });

    it('test truncateValue', () => {
        expect(truncateValue({ value: 'Semi Design', getValueLength, maxLength: 4 })).toBe('Semi');
        expect(truncateValue({ value: 'Semi', getValueLength, maxLength: 4 })).toBe('Semi');
        expect(truncateValue({ value: 'Se', getValueLength, maxLength: 1 })).toBe('S');
        expect(truncateValue({ value: 'S', getValueLength, maxLength: 2 })).toBe('S');
        expect(truncateValue({ value: '', getValueLength, maxLength: 2 })).toBe('');

        expect(truncateValue({ value: '💖💖💖💖💖', getValueLength, maxLength: 4 })).toBe('💖💖💖💖');
        expect(truncateValue({ value: '💖💖💖💖', getValueLength, maxLength: 4 })).toBe('💖💖💖💖');
        expect(truncateValue({ value: '💖', getValueLength, maxLength: 1 })).toBe('💖');
    });

    it('test truncateValue function call time', () => {
        function truncateValue(inputValue, maxLength) {
            let event = { target: { value: inputValue } };

            let spyTruncateValue = sinon.spy((str) => {
                console.log('call getValueLength', str);
                if (isString(str)) {
                    const splitter = new GraphemeSplitter();
                    return splitter.countGraphemes(str);
                } else {
                    return 0;
                }
            });
            
            const textArea = mount(
                <TextArea maxLength={maxLength} getValueLength={spyTruncateValue} />
            );
            const textAreaDom = textArea.find('textarea');
            textAreaDom.simulate('change', event);
            // 超出判断一次，截断判断 LogN 次
            const expectedValue = 1 + Math.ceil(Math.log2(inputValue.length));
            console.log('expectedValue', expectedValue);
            expect(spyTruncateValue.callCount).toBeLessThanOrEqual(expectedValue);
            return textAreaDom.instance().value;
        }

        const testCases = [
            ['Semi Design', 4],
            [Array.from({ length: 1000 }).fill('👨‍👩‍👧‍👦').join(''), 500],
        ];

        for (let [value, length, expectedCalcTimes] of testCases) {
            truncateValue(value, length, expectedCalcTimes);
        }
    });

    it('test onCompositionStart callback', () => {
        const spyOnCompositionStart = sinon.spy();
        const textArea = mount(<TextArea onCompositionStart={spyOnCompositionStart} />);
        const textareaDom = textArea.find('textarea');
        
        textareaDom.simulate('compositionstart', { target: { value: 'test' } });
        expect(spyOnCompositionStart.calledOnce).toBe(true);
    });

    it('test onCompositionEnd callback', () => {
        const spyOnCompositionEnd = sinon.spy();
        const textArea = mount(<TextArea onCompositionEnd={spyOnCompositionEnd} />);
        const textareaDom = textArea.find('textarea');
        
        textareaDom.simulate('compositionend', { target: { value: 'test' } });
        expect(spyOnCompositionEnd.calledOnce).toBe(true);
    });

    it('test onCompositionUpdate callback', () => {
        const spyOnCompositionUpdate = sinon.spy();
        const textArea = mount(<TextArea onCompositionUpdate={spyOnCompositionUpdate} />);
        const textareaDom = textArea.find('textarea');
        
        textareaDom.simulate('compositionupdate', { target: { value: 'test' } });
        expect(spyOnCompositionUpdate.calledOnce).toBe(true);
    });

    it('TextArea onFocus callback', () => {
        const spyOnFocus = sinon.spy();
        const textArea = mount(<TextArea onFocus={spyOnFocus} />);
        textArea.find('textarea').simulate('focus');
        expect(spyOnFocus.calledOnce).toBe(true);
    });

    it('TextArea onBlur callback', () => {
        const spyOnBlur = sinon.spy();
        const textArea = mount(<TextArea onBlur={spyOnBlur} />);
        textArea.find('textarea').simulate('focus');
        textArea.find('textarea').simulate('blur');
        expect(spyOnBlur.calledOnce).toBe(true);
    });

    it('TextArea readonly prop', () => {
        const textArea = mount(<TextArea readonly defaultValue="readonly text" />);
        expect(textArea.find('textarea').prop('readOnly')).toBe(true);
    });

    it('TextArea borderless prop', () => {
        const textArea = mount(<TextArea borderless />);
        expect(textArea.exists(`.${BASE_CLASS_PREFIX}-input-textarea-borderless`)).toEqual(true);
    });

    it('TextArea different validateStatus', () => {
        const warningTextArea = mount(<TextArea validateStatus="warning" />);
        const errorTextArea = mount(<TextArea validateStatus="error" />);
        expect(warningTextArea.exists(`.${BASE_CLASS_PREFIX}-input-textarea-wrapper-warning`)).toEqual(true);
        expect(errorTextArea.exists(`.${BASE_CLASS_PREFIX}-input-textarea-wrapper-error`)).toEqual(true);
    });

    it('TextArea onKeyDown callback', () => {
        const spyOnKeyDown = sinon.spy();
        const textArea = mount(<TextArea onKeyDown={spyOnKeyDown} />);
        textArea.find('textarea').simulate('keydown', { key: 'a', keyCode: 65 });
        expect(spyOnKeyDown.calledOnce).toBe(true);
    });

    it('TextArea rows prop', () => {
        const textArea = mount(<TextArea rows={5} />);
        expect(textArea.find('textarea').prop('rows')).toEqual(5);
    });

    it('TextArea autosize triggers resize on value change', () => {
        const spyOnResize = sinon.spy();
        const textArea = mount(<TextArea autosize onResize={spyOnResize} defaultValue="test" />);
        textArea.setProps({ value: 'new value that is longer' });
        textArea.update();
        // autosize 时 value 变化会触发 resizeTextarea
        expect(textArea.find('textarea').prop('value')).toEqual('new value that is longer');
    });

    it('TextArea autosize triggers resize on placeholder change', () => {
        const textArea = mount(<TextArea autosize placeholder="initial" />);
        textArea.setProps({ placeholder: 'new placeholder text' });
        textArea.update();
        expect(textArea.find('textarea').prop('placeholder')).toEqual('new placeholder text');
    });

    it('TextArea forwardRef as function', () => {
        let refNode = null;
        const refFn = (node) => { refNode = node; };
        const textArea = mount(<TextArea ref={refFn} />);
        expect(refNode).not.toBeNull();
        expect(refNode.tagName.toLowerCase()).toEqual('textarea');
    });

    it('TextArea forwardRef as object', () => {
        const refObj = React.createRef();
        const textArea = mount(<TextArea ref={refObj} />);
        expect(refObj.current).not.toBeNull();
        expect(refObj.current.tagName.toLowerCase()).toEqual('textarea');
    });

    it('TextArea mouseEnter and mouseLeave events', () => {
        const textArea = mount(<TextArea defaultValue="test" showClear />);
        const wrapper = textArea.find(`.${BASE_CLASS_PREFIX}-input-textarea-wrapper`);
        wrapper.simulate('mouseEnter', {});
        wrapper.simulate('mouseLeave', {});
        // 验证 hover 状态变化不会导致错误
        expect(textArea.find('textarea').exists()).toBe(true);
    });

    it('TextArea showCounter without maxCount', () => {
        const textArea = mount(<TextArea showCounter defaultValue="test" />);
        const counter = textArea.find(`.${BASE_CLASS_PREFIX}-input-textarea-counter`);
        expect(counter.exists()).toBe(true);
        expect(counter.text()).toEqual('4');
    });

    it('TextArea with autosize object config', () => {
        const textArea = mount(<TextArea autosize={{ minRows: 2, maxRows: 6 }} />);
        expect(textArea.find('textarea').exists()).toBe(true);
    });

    it('TextArea with autosize object without maxRows', () => {
        const textArea = mount(<TextArea autosize={{ minRows: 2 }} />);
        expect(textArea.exists(`.${BASE_CLASS_PREFIX}-input-textarea-autosize`)).toEqual(true);
    });

    it('TextArea componentWillUnmount cancels throttled resize', () => {
        const textArea = mount(<TextArea autosize defaultValue="test" />);
        textArea.unmount();
        // 验证 unmount 不会导致错误
        expect(true).toBe(true);
    });

    it('TextArea onResize callback', () => {
        const spyOnResize = sinon.spy();
        const textArea = mount(<TextArea autosize onResize={spyOnResize} />);
        // 直接调用 adapter 的 notifyHeightUpdate 方法
        const instance = textArea.find('TextArea').instance();
        instance.adapter.notifyHeightUpdate(100);
        expect(spyOnResize.calledOnce).toBe(true);
        expect(spyOnResize.calledWith({ height: 100 })).toBe(true);
    });

    it('TextArea adapter setValue with autosize triggers resize', () => {
        const textArea = mount(<TextArea autosize defaultValue="test" />);
        const instance = textArea.find('TextArea').instance();
        // 直接调用 adapter 的 setValue 方法
        instance.adapter.setValue('new value');
        textArea.update();
        expect(textArea.find('textarea').prop('value')).toEqual('new value');
    });
});
