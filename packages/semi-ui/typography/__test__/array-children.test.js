import Typography from '../index';
import Base from '../base';

it('resets expanded state consistently on every parent render with new element children', () => {
    class Parent extends React.Component {
        state = { n: 0 };
        render() {
            return <Typography.Text ellipsis={{ expandable: true }}>{'First '}<strong>bold</strong>{' last'}</Typography.Text>;
        }
    }
    const wrapper = mount(<Parent />);
    // element _owner (a fiber) alternates between renders, so a deep compare would flip every second render
    for (let n = 1; n <= 4; n++) {
        wrapper.find(Base).instance().setState({ expanded: true });
        wrapper.find(Parent).instance().setState({ n });
        expect(wrapper.find(Base).instance().state.expanded).toBe(false);
    }
    wrapper.unmount();
});

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
