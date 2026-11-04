import MCPConfigureContent from '../mcpConfigure/content';
import Tooltip from '../../tooltip';
import zhCN from '../../locale/source/zh_CN';

describe('MCPConfigure disabled option tooltip', () => {
    it('shows the disabled reason as Tooltip content', () => {
        const wrapper = mount(<MCPConfigureContent options={[{ label: 'Preset', value: 'preset', active: true, disabled: true }]} />);
        expect(wrapper.find(Tooltip).prop('content')).toBe(zhCN.Sidebar.defaultMcpInfo);
        expect(wrapper.find('button').last().prop('disabled')).toBe(true);
        wrapper.unmount();
    });
    it('does not add a disabled reason to an enabled option', () => {
        const wrapper = mount(<MCPConfigureContent options={[{ label: 'Custom', value: 'custom', active: true }]} />);
        expect(wrapper.find(Tooltip).exists()).toBe(false);
        wrapper.unmount();
    });
});
