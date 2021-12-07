import Input, { Input as BaseInput } from '../index';
import Icon from '../../icons/index';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';
import GraphemeSplitter from 'grapheme-splitter';
import { isString, isFunction } from 'lodash';

function getValueLength(str) {
  if (isString(str)) {
    const splitter = new GraphemeSplitter();
    return splitter.countGraphemes(str);
  } else {
    return -1;
  }
}

describe('Input', () => {
  // it('call foundation destory when compoonent Unmount', () => {

  // });

  it('input should call onChange when value change', () => {
    let inputValue = 'semi';
    let event = { target: { value: inputValue } };

    let onChange = value => {
      console.log(value);
    };
    let spyOnChange = sinon.spy(onChange);
    const input = mount(<Input onChange={spyOnChange} />);
    input.find('input').simulate('change', event);
    expect(spyOnChange.calledOnce).toBe(true);
    expect(spyOnChange.calledWithMatch(inputValue)).toBe(true);
  });

  it('input with custom className & style', () => {
    const wrapper = mount(<Input className="test" style={{ color: 'red' }} />);
    expect(wrapper.hasClass('test')).toEqual(true);
    expect(wrapper.find('div.test')).toHaveStyle('color', 'red');
  });

  // TODO ，找不到focus的className
  // it('input autofocus', () => {
  // const wrapper = mount(<Input autofocus={true} />);
  // wrapper.setProps({ autofocus: true })
  // wrapper.update();
  // expect(wrapper.find(`.${BASE_CLASS_PREFIX}-input-wrapper-focus`)).toEqual(true);
  // });

  it('input different size', () => {
    const largeInput = mount(<Input size="large" />);
    const defaultInput = mount(<Input />);
    const smallInput = mount(<Input size="small" />);
    expect(largeInput.find(`.${BASE_CLASS_PREFIX}-input-large`)).toHaveLength(1);
    expect(smallInput.find(`.${BASE_CLASS_PREFIX}-input-small`)).toHaveLength(1);
  });

  it('input with placeholder', () => {
    let placeholderText = `semi placeholder`;
    const input = mount(<Input placeholder={placeholderText} />);
    let inputDom = input.find('input');
    expect(inputDom.props().placeholder).toEqual(placeholderText);
  });

  it('input with defaultValue', () => {
    let defaultValue = 'semi';
    const inputWithDefaultValue = mount(<Input defaultValue={defaultValue} />);
    const inputDom = inputWithDefaultValue.find('input');
    expect(inputDom.instance().value).toEqual(defaultValue);
  });

  it('input disabled when props.disabled', () => {
    const disabledInput = mount(<Input disabled />);
    expect(disabledInput.exists(`.${BASE_CLASS_PREFIX}-input-wrapper-disabled`)).toEqual(true);
    expect(disabledInput.find(`.${BASE_CLASS_PREFIX}-input-disabled`)).toHaveLength(1);
  });

  it('input different validateStatus', () => {
    const warningInput = mount(<Input validateStatus="warning" />);
    const errorInput = mount(<Input validateStatus="error" />);
    const normalInput = mount(<Input />);
    expect(warningInput.exists(`.${BASE_CLASS_PREFIX}-input-wrapper-warning`)).toEqual(true);
    expect(errorInput.exists(`.${BASE_CLASS_PREFIX}-input-wrapper-error`)).toEqual(true);

    expect(normalInput.exists(`.${BASE_CLASS_PREFIX}-input-wrapper-error`)).toEqual(false);
    expect(normalInput.exists(`.${BASE_CLASS_PREFIX}-input-wrapper-warning`)).toEqual(false);
  });

  // TODO，同上，focus时才会展示clearBtn，autoFocus似乎不起作用
  // it('input clearable', () => {
  //     const clearableInput = mount(<Input clearable defaultValue='semi' autofocus/>);
  //     expect(clearableInput.find('input').instance().value).toEqual('semi');
  //     // clearableInput.find(`.${BASE_CLASS_PREFIX}-input-clearbtn`).simulate('click');
  // })

  it('input with prefix / suffix', () => {
    let suffix = <div className="suffix">suffix</div>;
    let prefix = <div className="prefix">prefix</div>;
    const withNodeSuffix = mount(<Input suffix={suffix} />);
    const withNodePrefix = mount(<Input prefix={prefix} />);
    expect(withNodeSuffix.contains(suffix)).toEqual(true);
    expect(withNodePrefix.contains(prefix)).toEqual(true);
  });

  it('input addonBefore / addonAfter', () => {
    let input = mount(<Input addonBefore="https://" addonAfter=".com" />);
    expect(input.find(`.${BASE_CLASS_PREFIX}-input-prepend`).getDOMNode().textContent).toEqual('https://');
    expect(input.find(`.${BASE_CLASS_PREFIX}-input-append`).getDOMNode().textContent).toEqual('.com');
  });

  it('input password', () => {
    const pwInput = mount(<Input type="password" />);
    expect(pwInput.find('input').instance().type).toEqual('password');
  });

  it('input password mode', () => {
    const inputMode = mount(<Input mode="password" />);
    const input = inputMode.find('input');
    expect(input.instance().type).toEqual('password');
  });

  it('input controlled mode', () => {
    let initValue = 'semi';
    let onChange = value => {
      console.log(value);
    };
    let spyOnChange = sinon.spy(onChange);
    const input = mount(<Input onChange={spyOnChange} value={initValue} />);

    const inputDom = input.find('input');
    expect(inputDom.instance().value).toEqual(initValue);

    let newInputValue = 'vita lemon';
    let event = { target: { value: newInputValue } };
    input.find('input').simulate('change', event);

    expect(spyOnChange.calledOnce).toBe(true);
    expect(spyOnChange.calledWithMatch(newInputValue)).toBe(true);

    input.setProps({ value: newInputValue });
    expect(inputDom.instance().value).toEqual(newInputValue);
  });

  // TODO InputGroup
  // TODO onClear 回调

  it('click prefix/suffix focus', () => {
    const spyFocus = sinon.spy(() => {});
    const inputNode = mount(<Input style={{ width: 200 }} onFocus={spyFocus} prefix="search" defaultValue="Semi Design" />);
    const inputNode2 = mount(<Input style={{ width: 200 }} onFocus={spyFocus}  suffix="search" defaultValue="Semi Design" />);
    inputNode.find(`.${BASE_CLASS_PREFIX}-input-prefix`).simulate('click');
    expect(inputNode.find(BaseInput).state('isFocus')).toEqual(true);

    inputNode2.find(`.${BASE_CLASS_PREFIX}-input-suffix`).simulate('click');
    expect(inputNode2.find(BaseInput).state('isFocus')).toEqual(true);
  });

  it('test input GraphemeSplitter function', () => {
    const testCases = [
      ['💖', 1],
      ['字节跳动', 4],
      ['Semi 💖', 6],
      ['💖💖💖💖💖', 5],
      ['🤣', 1],
      ['1️⃣', 1],
      ['👨‍👨‍👦', 1],
    ];
    for (let item of testCases) {
      const [value, result] = item;
      expect(getValueLength(value)).toEqual(result);
    }
  });

  it('test getValueLength onChange', () => {
    let inputValue = '0123456789semi design';
    let event = { target: { value: inputValue } };

    let onChange = value => {
      console.log(value);
    };
    let spyOnChange = sinon.spy(onChange);
    const input = mount(<Input onChange={spyOnChange} maxLength={10} getValueLength={getValueLength} />);
    input.find('input').simulate('change', event);
    expect(spyOnChange.calledOnce).toBe(true);
    expect(spyOnChange.calledWithMatch(inputValue)).toBe(false);
  });

  it('test visibleLength controlled mode', () => {
    let value = '0123456789semi design';
    const input = mount(<Input value={value} maxLength={10} getValueLength={getValueLength} />);
    const inputDom = input.find('input');
    expect(inputDom.instance().value).toEqual(value);
  });

  it('test minLength + getValueLength', () => {
    let inputValue = '💖💖💖';
    let minLength = 4;
    let event = { target: { value: inputValue } };

    let onChange = value => {
      console.log(value);
    };
    let spyOnChange = sinon.spy(onChange);
    const input = mount(<Input onChange={spyOnChange} minLength={minLength} getValueLength={getValueLength} />);
    const inputDom = input.find('input');
    inputDom.simulate('change', event);
    expect(spyOnChange.calledOnce).toBe(true);
    expect(spyOnChange.calledWithMatch(inputValue)).toBe(true);
    expect(inputDom.instance().minLength).toEqual(inputValue.length + (minLength - getValueLength(inputValue)));
  });

  it('test truncateValue function', () => {
    function truncateValue(value, maxLength, getValueLength) {
      if (isFunction(getValueLength)) {
          let truncatedValue = '';
          for (let i = 1, len = value.length; i <= len; i++) {
              const currentValue = value.slice(0, i);
              if (getValueLength(currentValue) > maxLength) {
                  return truncatedValue;
              } else {
                  truncatedValue = currentValue;
              }
          }
          return truncatedValue;
      } else {
          return value.slice(0, maxLength);
      }
    }

    const testCases = [
      // 没有传递函数
      ['Semi Design', 4, null, 'Semi'],
      ['💖', 0, null, ''],
      ['🆗', 1, null, '\ud83c'],
      // 自定义valueLength
      ['Semi Design', 4, getValueLength, 'Semi'],
      ['💖💖💖💖💖💖💖💖💖💖👨‍👩‍👧‍👦', 10, getValueLength, '💖💖💖💖💖💖💖💖💖💖'],
      ['💖', 0, getValueLength, ''],
      ['🆗', 1, getValueLength, '🆗'],
    ];

    for (let [value, length, fc, result] of testCases) {
      expect(truncateValue(value, length, fc)).toBe(result);
    }
  })
});
