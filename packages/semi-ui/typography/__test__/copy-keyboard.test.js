import Copyable from '../copyable';

describe('Typography keyboard copy', () => {
    let execCommand;
    let getSelection;
    let wrapper;
    let host;

    beforeEach(() => {
        execCommand = document.execCommand;
        getSelection = document.getSelection;
        document.execCommand = () => true;
        document.getSelection = () => ({ rangeCount: 0 });
        host = document.createElement('div');
        document.body.appendChild(host);
    });
    afterEach(() => {
        wrapper.unmount();
        host.remove();
        document.execCommand = execCommand;
        document.getSelection = getSelection;
    });

    it('copies with Space and prevents the default page scroll', () => {
        const onCopy = jest.fn();
        wrapper = mount(<Copyable content="Text" onCopy={onCopy} />, { attachTo: host });
        const icon = wrapper.find('[role="button"]').hostNodes().getDOMNode();
        const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
        icon.dispatchEvent(event);
        expect(onCopy).toHaveBeenCalledTimes(1);
        expect(event.defaultPrevented).toBe(true);
    });

    it('still copies with Enter', () => {
        const onCopy = jest.fn();
        wrapper = mount(<Copyable content="Text" onCopy={onCopy} />, { attachTo: host });
        const icon = wrapper.find('[role="button"]').hostNodes().getDOMNode();
        icon.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        icon.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', charCode: 13, bubbles: true }));
        expect(onCopy).toHaveBeenCalledTimes(1);
    });

    it('uses a single focusable button for the default copy icon', () => {
        wrapper = mount(<Copyable content="Text" />, { attachTo: host });
        const focusable = wrapper.getDOMNode().querySelectorAll('[tabindex="0"]');
        expect(focusable).toHaveLength(1);
        expect(focusable[0].getAttribute('role')).toBe('button');
    });

    it('copies once when the mouse clicks the default icon', () => {
        const onCopy = jest.fn();
        wrapper = mount(<Copyable content="Text" onCopy={onCopy} />, { attachTo: host });
        wrapper.find('.semi-icon-copy').hostNodes().simulate('click');
        expect(onCopy).toHaveBeenCalledTimes(1);
    });
});
