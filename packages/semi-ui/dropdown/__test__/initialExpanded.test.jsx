import Dropdown from '../index';

describe('Dropdown initial aria-expanded', () => {
    it('marks the default closed trigger as collapsed', () => {
        const wrapper = mount(<Dropdown trigger="click" motion={false} render={<Dropdown.Menu><Dropdown.Item>Item</Dropdown.Item></Dropdown.Menu>}><button>Open</button></Dropdown>);
        expect(wrapper.find('button').getDOMNode().getAttribute('aria-expanded')).toBe('false');
        wrapper.unmount();
    });
    it('marks an initially visible custom trigger as expanded', () => {
        const wrapper = mount(<Dropdown trigger="custom" visible motion={false} render={<Dropdown.Menu><Dropdown.Item>Item</Dropdown.Item></Dropdown.Menu>}><button>Open</button></Dropdown>);
        expect(wrapper.find('button').getDOMNode().getAttribute('aria-expanded')).toBe('true');
        wrapper.unmount();
    });
});
