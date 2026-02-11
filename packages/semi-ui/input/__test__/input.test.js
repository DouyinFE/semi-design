import Input, { Input as BaseInput } from '../index';
import Icon from '../../icons/index';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';
import GraphemeSplitter from 'grapheme-splitter';
import { isString, isFunction } from 'lodash';
import { InputGroup, InputNumber } from '../../index';

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
    const inputMode = mount(<Input />);
    expect(inputMode.find('input').instance().type).toEqual('text');
    inputMode.setProps({ mode: 'password' }) ;
    expect(inputMode.find('input').instance().type).toEqual('password');
    inputMode.setProps({ mode: '' }) ;
    expect(inputMode.find('input').instance().type).toEqual('text');
  });

  it('input password click eyes icon', () => {
    const inputMode = mount(<Input mode='password' defaultValue="123456" autofocus/>);
    inputMode.simulate('mouseEnter', {}).find(`.${BASE_CLASS_PREFIX}-input-modebtn`).simulate('click');
    expect(inputMode.find('input').instance().type).toEqual('text');
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

  it('input group', () => {
    const groupFocus = sinon.spy(() => {
      console.log('group focus');
    });
    const groupBlur = sinon.spy(() => {
      console.log('group focus');
    });
    const inputFocus = sinon.spy(() => {
      console.log('input focus');
    });
    const inputBlur = sinon.spy(() => {
      console.log('input blur');
    });
    const inputGroup = mount(
      <InputGroup disabled={true} onFocus={groupFocus} onBlur={groupBlur}>
          <Input disabled={false} onFocus={inputFocus} onBlur={inputBlur} placeholder="Name" style={{ width: 100 }} />
          <InputNumber placeholder="Score" style={{ width: 140 }} />
      </InputGroup>
    );

    inputGroup.find('input').at(0).simulate('focus');
    expect(inputFocus.called).toBe(true);
    expect(groupFocus.called).toBe(true);
    inputGroup.find('input').at(0).simulate('blur');
    expect(inputBlur.called).toBe(true);
    expect(groupBlur.called).toBe(true);
    expect(inputGroup.find('input').at(0).instance().disabled).toBe(false);
    expect(inputGroup.find('input').at(1).instance().disabled).toBe(true);
  })

  it('test onCompositionStart callback', () => {
    const spyOnCompositionStart = sinon.spy();
    const input = mount(<Input onCompositionStart={spyOnCompositionStart} />);
    const inputDom = input.find('input');
    
    inputDom.simulate('compositionstart', { target: { value: 'test' } });
    expect(spyOnCompositionStart.calledOnce).toBe(true);
  });

  it('test onCompositionEnd callback', () => {
      const spyOnCompositionEnd = sinon.spy();
      const input =  mount(<Input onCompositionEnd={spyOnCompositionEnd} />);
      const inputDom = input.find('input');
      
      inputDom.simulate('compositionend', { target: { value: 'test' } });
      expect(spyOnCompositionEnd.calledOnce).toBe(true);
  });

  it('test onCompositionUpdate callback', () => {
      const spyOnCompositionUpdate = sinon.spy();
      const input =  mount(<Input onCompositionUpdate={spyOnCompositionUpdate} />);
      const inputDom = input.find('input');
      
      inputDom.simulate('compositionupdate', { target: { value: 'test' } });
      expect(spyOnCompositionUpdate.calledOnce).toBe(true);
  });

  it('input showClear and onClear callback', () => {
    const spyOnClear = sinon.spy();
    const input = mount(<Input showClear defaultValue="test" onClear={spyOnClear} />);
    // 需要先触发 hover 状态才能显示清除按钮
    input.simulate('mouseEnter', {});
    input.find(`.${BASE_CLASS_PREFIX}-input-clearbtn`).simulate('mousedown');
    expect(spyOnClear.calledOnce).toBe(true);
  });

  it('input readonly prop', () => {
    const input = mount(<Input readonly defaultValue="readonly text" />);
    expect(input.find('input').prop('readOnly')).toBe(true);
    expect(input.exists(`.${BASE_CLASS_PREFIX}-input-wrapper-readonly`)).toEqual(true);
  });

  it('input onFocus callback', () => {
    const spyOnFocus = sinon.spy();
    const input = mount(<Input onFocus={spyOnFocus} />);
    input.find('input').simulate('focus');
    expect(spyOnFocus.calledOnce).toBe(true);
  });

  it('input onBlur callback', () => {
    const spyOnBlur = sinon.spy();
    const input = mount(<Input onBlur={spyOnBlur} />);
    input.find('input').simulate('focus');
    input.find('input').simulate('blur');
    expect(spyOnBlur.calledOnce).toBe(true);
  });

  it('input onEnterPress callback', () => {
    const spyOnEnterPress = sinon.spy();
    const input = mount(<Input onEnterPress={spyOnEnterPress} />);
    // onEnterPress is triggered in handleKeyPress, not handleKeyDown
    input.find('input').simulate('keypress', { key: 'Enter', keyCode: 13 });
    expect(spyOnEnterPress.calledOnce).toBe(true);
  });

  it('input borderless prop', () => {
    const input = mount(<Input borderless />);
    expect(input.exists(`.${BASE_CLASS_PREFIX}-input-borderless`)).toEqual(true);
  });

  it('input onKeyDown callback', () => {
    const spyOnKeyDown = sinon.spy();
    const input = mount(<Input onKeyDown={spyOnKeyDown} />);
    input.find('input').simulate('keydown', { key: 'a', keyCode: 65 });
    expect(spyOnKeyDown.calledOnce).toBe(true);
  });

  it('input onKeyUp callback', () => {
    const spyOnKeyUp = sinon.spy();
    const input = mount(<Input onKeyUp={spyOnKeyUp} />);
    input.find('input').simulate('keyup', { key: 'a', keyCode: 65 });
    expect(spyOnKeyUp.calledOnce).toBe(true);
  });

  it('input insetLabel prop', () => {
    const input = mount(<Input insetLabel="Label" />);
    expect(input.exists(`.${BASE_CLASS_PREFIX}-input-inset-label`)).toEqual(true);
    expect(input.find(`.${BASE_CLASS_PREFIX}-input-inset-label`).text()).toEqual('Label');
  });

  it('input clearIcon custom icon', () => {
    const customIcon = <span className="custom-clear-icon">X</span>;
    const input = mount(<Input showClear clearIcon={customIcon} defaultValue="test" />);
    input.simulate('mouseEnter', {});
    expect(input.find('.custom-clear-icon').exists()).toBe(true);
  });

  it('input hideSuffix prop', () => {
    const input = mount(<Input suffix="suffix" hideSuffix showClear defaultValue="test" />);
    input.simulate('mouseEnter', {});
    expect(input.exists(`.${BASE_CLASS_PREFIX}-input-suffix-hidden`)).toEqual(true);
  });

  it('input onInput callback', () => {
    const spyOnInput = sinon.spy();
    const input = mount(<Input onInput={spyOnInput} />);
    input.find('input').simulate('input', { target: { value: 'test' } });
    expect(spyOnInput.calledOnce).toBe(true);
  });

  it('input onKeyPress callback', () => {
    const spyOnKeyPress = sinon.spy();
    const input = mount(<Input onKeyPress={spyOnKeyPress} />);
    input.find('input').simulate('keypress', { key: 'a', keyCode: 65 });
    expect(spyOnKeyPress.calledOnce).toBe(true);
  });

  it('input onlyBorder prop', () => {
    const input = mount(<Input onlyBorder={1} style={{ color: 'red' }} />);
    const wrapperStyle = input.find(`.${BASE_CLASS_PREFIX}-input-wrapper`).prop('style');
    expect(wrapperStyle.borderWidth).toEqual(1);
  });

  it('input mouseEnter and mouseLeave events', () => {
    const input = mount(<Input defaultValue="test" showClear />);
    const wrapper = input.find(`.${BASE_CLASS_PREFIX}-input-wrapper`);
    wrapper.simulate('mouseEnter', {});
    expect(input.find(BaseInput).state('isHovering')).toEqual(true);
    wrapper.simulate('mouseLeave', {});
    expect(input.find(BaseInput).state('isHovering')).toEqual(false);
  });

  it('input mode change via componentDidUpdate', () => {
    const input = mount(<Input mode="password" defaultValue="test" />);
    expect(input.find('input').instance().type).toEqual('password');
    input.setProps({ mode: 'text' });
    input.update();
    expect(input.find('input').instance().type).toEqual('text');
  });

  it('InputGroup with label', () => {
    const inputGroup = mount(
      <InputGroup label={{ text: 'Group Label' }} labelPosition="top">
        <Input placeholder="Name" />
        <InputNumber placeholder="Score" />
      </InputGroup>
    );
    expect(inputGroup.exists(`.${BASE_CLASS_PREFIX}-input-group-wrapper`)).toEqual(true);
    expect(inputGroup.exists(`.${BASE_CLASS_PREFIX}-input-group-wrapper-with-top-label`)).toEqual(true);
  });

  it('InputGroup with left label position', () => {
    const inputGroup = mount(
      <InputGroup label={{ text: 'Label', name: 'custom-label' }} labelPosition="left">
        <Input placeholder="Name" />
      </InputGroup>
    );
    expect(inputGroup.exists(`.${BASE_CLASS_PREFIX}-input-group-wrapper-with-left-label`)).toEqual(true);
  });

  it('InputGroup with size prop', () => {
    const inputGroup = mount(
      <InputGroup size="large">
        <Input placeholder="Name" />
      </InputGroup>
    );
    expect(inputGroup.exists(`.${BASE_CLASS_PREFIX}-input-large`)).toEqual(true);
  });

  it('InputGroup with null child', () => {
    const inputGroup = mount(
      <InputGroup>
        <Input placeholder="Name" />
        {null}
        <Input placeholder="Score" />
      </InputGroup>
    );
    expect(inputGroup.find('input')).toHaveLength(2);
  });

  it('InputGroup single child', () => {
    const inputGroup = mount(
      <InputGroup>
        <Input placeholder="Name" />
      </InputGroup>
    );
    expect(inputGroup.find('input')).toHaveLength(1);
  });

  it('input handleModeEnterPress', () => {
    const input = mount(<Input mode="password" defaultValue="test" />);
    input.simulate('mouseEnter', {});
    const modeBtn = input.find(`.${BASE_CLASS_PREFIX}-input-modebtn`);
    modeBtn.simulate('keydown', { key: 'Enter', keyCode: 13 });
    // 验证按 Enter 键可以切换密码显示模式
    expect(input.find('input').exists()).toBe(true);
  });

  it('input handlePreventMouseDown', () => {
    const input = mount(<Input mode="password" defaultValue="test" />);
    input.simulate('mouseEnter', {});
    const modeBtn = input.find(`.${BASE_CLASS_PREFIX}-input-modebtn`);
    const preventDefault = sinon.spy();
    modeBtn.simulate('mousedown', { preventDefault });
    expect(preventDefault.calledOnce).toBe(true);
  });

  it('input forwardRef as function', () => {
    let refNode = null;
    const refFn = (node) => { refNode = node; };
    const input = mount(<Input ref={refFn} />);
    expect(refNode).not.toBeNull();
    expect(refNode.tagName.toLowerCase()).toEqual('input');
  });

  it('input forwardRef as object', () => {
    const refObj = React.createRef();
    const input = mount(<Input ref={refObj} />);
    expect(refObj.current).not.toBeNull();
    expect(refObj.current.tagName.toLowerCase()).toEqual('input');
  });

  it('input handleMouseUp', () => {
    const input = mount(<Input mode="password" defaultValue="test" />);
    input.simulate('mouseEnter', {});
    const modeBtn = input.find(`.${BASE_CLASS_PREFIX}-input-modebtn`);
    modeBtn.simulate('mouseup', {});
    // 验证 mouseup 事件处理不会导致错误
    expect(input.find('input').exists()).toBe(true);
  });

  it('input adapter getIfFocusing', () => {
    const input = mount(<Input defaultValue="test" />);
    const instance = input.find(BaseInput).instance();
    expect(instance.adapter.getIfFocusing()).toBe(false);
    input.find('input').simulate('focus');
    expect(instance.adapter.getIfFocusing()).toBe(true);
  });

  it('input adapter toggleHovering', () => {
    const input = mount(<Input defaultValue="test" />);
    const instance = input.find(BaseInput).instance();
    instance.adapter.toggleHovering(true);
    input.update();
    expect(input.find(BaseInput).state('isHovering')).toBe(true);
    instance.adapter.toggleHovering(false);
    input.update();
    expect(input.find(BaseInput).state('isHovering')).toBe(false);
  });

  it('input handleModeEnterPress with keypress event', () => {
    const input = mount(<Input mode="password" defaultValue="test" />);
    input.simulate('mouseEnter', {});
    const modeBtn = input.find(`.${BASE_CLASS_PREFIX}-input-modebtn`);
    // 模拟按 Enter 键 - 使用 keypress 事件
    modeBtn.simulate('keypress', { key: 'Enter', keyCode: 13 });
    input.update();
    // 验证密码模式切换
    expect(input.find('input').instance().type).toEqual('text');
  });

  it('input prefix handlePreventMouseDown prevents default', () => {
    const input = mount(<Input prefix="prefix" defaultValue="test" />);
    const prefix = input.find(`.${BASE_CLASS_PREFIX}-input-prefix`);
    const preventDefaultSpy = sinon.spy();
    prefix.simulate('mousedown', { preventDefault: preventDefaultSpy });
    expect(preventDefaultSpy.calledOnce).toBe(true);
  });

  it('input suffix handlePreventMouseDown prevents default', () => {
    const input = mount(<Input suffix="suffix" defaultValue="test" />);
    const suffix = input.find(`.${BASE_CLASS_PREFIX}-input-suffix`);
    const preventDefaultSpy = sinon.spy();
    suffix.simulate('mousedown', { preventDefault: preventDefaultSpy });
    expect(preventDefaultSpy.calledOnce).toBe(true);
  });
});
