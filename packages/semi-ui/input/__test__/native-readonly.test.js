import Input from '../index';
import TextArea from '../textarea';
import TimePicker from '../../timePicker';
import DatePicker from '../../datePicker';

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
    [{ readOnly: true }, { readonly: true }].forEach(props => {
        it(`does not offer the input clear button with ${Object.keys(props)[0]}`, () => {
            const input = mount(<Input {...props} showClear defaultValue="locked" />);
            input.find('.semi-input-wrapper').simulate('mouseenter');
            expect(input.find('.semi-input-clearbtn').exists()).toBe(false);
            expect(input.find('input').prop('value')).toBe('locked');
            input.unmount();
        });
    });
    it('keeps the textarea value when handleClear is reached while read only', () => {
        const onChange = rs.fn();
        const area = mount(<TextArea readOnly showClear defaultValue="locked" onChange={onChange} />);
        area.find('.semi-input-clearbtn').simulate('click');
        expect(onChange).not.toHaveBeenCalled();
        expect(area.find('textarea').prop('value')).toBe('locked');
        area.unmount();
    });
    [['TimePicker', TimePicker, { defaultValue: new Date(2026, 0, 1) }], ['DatePicker', DatePicker, { defaultValue: new Date(2026, 0, 1) }]].forEach(([name, Picker, props]) => {
        it(`keeps the ${name} clear button with inputReadOnly`, () => {
            const picker = mount(<Picker inputReadOnly showClear {...props} />);
            picker.find('.semi-input-wrapper').first().simulate('mouseenter');
            expect(picker.find('.semi-input-clearbtn').exists()).toBe(true);
            picker.unmount();
        });
    });
});
