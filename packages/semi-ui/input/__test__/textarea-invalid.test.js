import TextArea from '../textarea';

it('exposes and updates textarea validation errors through aria-invalid', () => {
    const area = mount(<TextArea validateStatus="error" />);
    expect(area.find('textarea').prop('aria-invalid')).toBe('true');
    area.setProps({ validateStatus: 'default' });
    expect(area.find('textarea').prop('aria-invalid')).toBeUndefined();
    area.setProps({ 'aria-invalid': 'grammar' });
    expect(area.find('textarea').prop('aria-invalid')).toBe('grammar');
    area.unmount();
});
