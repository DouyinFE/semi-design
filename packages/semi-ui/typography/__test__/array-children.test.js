import Typography from '../index';
import Base from '../base';

it('keeps expanded text open when equal text children are recreated', () => {
    const wrapper = mount(<Typography.Text ellipsis={{ expandable: true }}>{'First '}{'last'}</Typography.Text>);
    const base = wrapper.find(Base).instance();
    base.setState({ expanded: true });
    wrapper.setProps({ children: ['First ', 'last'] });
    expect(base.state.expanded).toBe(true);
    wrapper.setProps({ children: ['New ', 'content'] });
    expect(base.state.expanded).toBe(false);
    wrapper.unmount();
});
