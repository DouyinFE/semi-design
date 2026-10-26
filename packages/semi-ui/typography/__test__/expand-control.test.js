import Typography from '../index';
import Base from '../base';

describe('Typography expand-only control', () => {
    it('removes the expand action after expansion when collapse is unavailable', () => {
        const wrapper = mount(<Typography.Text ellipsis={{ expandable: true }}>Text</Typography.Text>);
        wrapper.find(Base).instance().setState({ isTruncated: true, expanded: true });
        wrapper.update();
        expect(wrapper.find('a.semi-typography-ellipsis-expand')).toHaveLength(0);
        wrapper.unmount();
    });
    it('keeps an explicitly available collapse action', () => {
        const wrapper = mount(<Typography.Text ellipsis={{ expandable: true, collapsible: true }}>Text</Typography.Text>);
        wrapper.find(Base).instance().setState({ isTruncated: true, expanded: true });
        wrapper.update();
        expect(wrapper.find('a.semi-typography-ellipsis-expand').text()).toBe('收起');
        wrapper.unmount();
    });
});
