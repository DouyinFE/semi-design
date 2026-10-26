import Input from '../index';
import TextArea from '../textarea';

describe('Native readOnly attribute', () => {
    [Input, TextArea].forEach(Component => {
        it(`honors and updates native readOnly for ${Component === Input ? 'Input' : 'TextArea'}`, () => {
            const wrapper = mount(<Component readOnly defaultValue="Read only" />);
            const selector = Component === Input ? 'input' : 'textarea';
            expect(wrapper.find(selector).prop('readOnly')).toBe(true);
            wrapper.setProps({ readOnly: false });
            expect(wrapper.find(selector).prop('readOnly')).toBe(false);
            wrapper.setProps({ readonly: true });
            expect(wrapper.find(selector).prop('readOnly')).toBe(true);
            wrapper.unmount();
        });
    });
    it('keeps the textarea clear action unavailable when native readOnly is set', () => {
        const area = mount(<TextArea readOnly showClear defaultValue="Read only" />);
        area.simulate('mouseenter');
        expect(area.find('TextArea').instance().foundation.isAllowClear()).toBeFalsy();
        area.unmount();
    });
});
