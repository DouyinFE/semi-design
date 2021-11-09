import TextArea from '../textarea';
import Icon from '../../icons/index';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';
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

    it('TextArea with custom className & style', () => {
        const wrapper = mount(<TextArea className='test' style={{ color: 'red' }} />);
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
    })

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
    })

    it('TextArea disabled', () => {
        const textarea = mount(<TextArea disabled />);
        let textareaDom = textarea.find(`textarea.${BASE_CLASS_PREFIX}-input-textarea-disabled`);
        expect(textareaDom.props().disabled).toEqual(true);
    })

    it('TextArea showClear / onClear', () => {
        const spyOnClear = sinon.spy(()=>{});
        const textarea = mount(<TextArea showClear defaultValue='123' onClear={spyOnClear}/>);
        textarea.simulate('mouseEnter', {}).find(`.${BASE_CLASS_PREFIX}-input-clearbtn`).simulate('click');
        expect(spyOnClear.calledOnce).toBe(true);
        expect(textarea.find(`.${BASE_CLASS_PREFIX}-input-textarea`).getDOMNode().textContent).toEqual('');
    })

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
        const textArea = mount(<TextArea onChange={spyOnChange} value='semi' />);
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
})
