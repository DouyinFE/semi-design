import { MCPConfigure } from '../../index';

describe('Sidebar.MCPConfigure', () => {
    it('status button should not render checked attribute on dom', () => {
        const wrapper = mount(
            <MCPConfigure
                visible
                options={[{ value: 'a', label: 'A', active: true }]}
            />
        );
        const buttons = wrapper.find('button.semi-sidebar-mcp-configure-content-item-button');
        expect(buttons.length).toBeGreaterThan(0);
        buttons.forEach(btn => expect(btn.props().checked).toBeUndefined());
        wrapper.unmount();
    });
});
