import TextArea from '../textarea';

it('preserves the React focus event passed to TextArea onBlur', () => {
    const blur = rs.fn();
    const wrapper = mount(<TextArea onBlur={blur} />);
    const event = { nativeEvent: { type: 'blur' }, persist: rs.fn(), currentTarget: { tagName: 'TEXTAREA' } };
    wrapper.find('textarea').simulate('blur', event);
    const received = blur.mock.calls[0][0];
    expect(received.nativeEvent).toBe(event.nativeEvent);
    expect(typeof received.persist).toBe('function');
    wrapper.unmount();
});

it('reports the clear button click to onChange and onBlur when clearing', () => {
    const change = rs.fn();
    const blur = rs.fn();
    const wrapper = mount(<TextArea showClear defaultValue="text" onChange={change} onBlur={blur} />);
    wrapper.find('textarea').simulate('focus');
    wrapper.update();
    const clearBtn = wrapper.find('.semi-input-clearbtn');
    expect(clearBtn.hasClass('semi-input-clearbtn-hidden')).toBe(false);
    clearBtn.simulate('click');
    const [value, changeEvent] = change.mock.calls[0];
    expect(value).toBe('');
    expect(changeEvent.type).toBe('click');
    expect(changeEvent.target).toBe(clearBtn.getDOMNode());
    expect(blur.mock.calls[0][0].type).toBe('click');
    wrapper.unmount();
});

it('passes the textarea change event to onChange when typing', () => {
    const change = rs.fn();
    const wrapper = mount(<TextArea onChange={change} />);
    const node = wrapper.find('textarea').getDOMNode();
    wrapper.find('textarea').simulate('change', { target: { value: 'typed' } });
    expect(change.mock.calls[0][0]).toBe('typed');
    expect(change.mock.calls[0][1].type).toBe('change');
    expect(node.tagName).toBe('TEXTAREA');
    wrapper.unmount();
});
