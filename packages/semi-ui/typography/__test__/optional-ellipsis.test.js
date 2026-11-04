import Typography from '../index';
import Base from '../base';

describe('Typography optional ellipsis defaults', () => {
    it('uses the default suffix when the optional suffix is undefined', () => {
        const wrapper = mount(<Typography.Text ellipsis={{ suffix: undefined }}>Text</Typography.Text>);
        expect(wrapper.find(Base).instance().getEllipsisOpt().suffix).toBe('');
        wrapper.unmount();
    });
    it('uses a tooltip when its optional type is undefined', () => {
        const wrapper = mount(<Typography.Text ellipsis={{ showTooltip: { type: undefined } }}>Text</Typography.Text>);
        const base = wrapper.find(Base).instance();
        base.setState({ isOverflowed: true });
        wrapper.update();
        expect(base.showTooltip().type).toBe('tooltip');
        expect(wrapper.find('Tooltip')).toHaveLength(1);
        wrapper.unmount();
    });
    it('preserves explicitly configured suffix and tooltip type', () => {
        const wrapper = mount(<Typography.Text ellipsis={{ suffix: 'end', showTooltip: { type: 'popover' } }}>Text</Typography.Text>);
        const base = wrapper.find(Base).instance();
        base.setState({ isTruncated: true });
        expect(base.getEllipsisOpt().suffix).toBe('end');
        expect(base.showTooltip().type).toBe('popover');
        wrapper.unmount();
    });
});
