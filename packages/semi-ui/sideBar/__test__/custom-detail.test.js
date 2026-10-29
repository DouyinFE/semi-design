import { Sidebar } from '../../index';
import Button from '../../button';

describe('Sidebar custom details', () => {
    it('renders custom detail content without an optional detailContent object', () => {
        const wrapper = mount(<Sidebar visible motion={false} resizable={false} mode="custom" renderDetailContent={() => <p>Custom details</p>} />);
        expect(wrapper.text()).toContain('Custom details');
        expect(wrapper.find(Button).at(1).prop('disabled')).toBe(true);
        wrapper.unmount();
    });

    it('does not try to copy missing detail content when the header is customized', () => {
        const onDetailContentCopy = jest.fn();
        const wrapper = mount(<Sidebar visible motion={false} resizable={false} mode="custom" renderDetailHeader={() => <h2>Details</h2>} renderDetailContent={() => <p>Custom details</p>} onDetailContentCopy={onDetailContentCopy} />);
        expect(() => wrapper.instance().handleCopyDetailContent({}, { copySuccess: 'Copied' })).not.toThrow();
        expect(onDetailContentCopy).not.toHaveBeenCalled();
        wrapper.unmount();
    });

    it('continues to show the supplied detail title', () => {
        const wrapper = mount(<Sidebar visible motion={false} resizable={false} mode="custom" detailContent={{ name: 'Document', content: 'Content' }} renderDetailContent={() => <p>Custom details</p>} />);
        expect(wrapper.text()).toContain('Document');
        wrapper.unmount();
    });
});
