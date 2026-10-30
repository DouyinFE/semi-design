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
