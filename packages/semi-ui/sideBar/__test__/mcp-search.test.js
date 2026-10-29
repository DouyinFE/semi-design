import MCPConfigureContent from '../mcpConfigure/content';
import Input from '../../input';
import RadioGroup from '../../radio/radioGroup';

describe('MCPConfigure search notifications', () => {
    it('reports the entered text and the current server category', () => {
        const onSearch = jest.fn();
        const wrapper = mount(<MCPConfigureContent onSearch={onSearch} />);
        wrapper.find(Input).prop('onChange')('Alpha');
        expect(onSearch).toHaveBeenLastCalledWith('Alpha', false);
        wrapper.find(RadioGroup).prop('onChange')({ target: { value: 'custom' } });
        wrapper.find(Input).prop('onChange')('Beta');
        expect(onSearch).toHaveBeenLastCalledWith('Beta', true);
        expect(onSearch).toHaveBeenCalledTimes(2);
        wrapper.unmount();
    });

    it('does not require the optional search callback', () => {
        const wrapper = mount(<MCPConfigureContent />);
        expect(() => wrapper.find(Input).prop('onChange')('Alpha')).not.toThrow();
        wrapper.unmount();
    });
});
