import ResizeHandler from '../group/resizeHandler';
import { ResizeContext } from '../group/resizeContext';

describe('ResizeHandler disabled', () => {
    function createHandler(disabled) {
        const notifyResizeStart = sinon.spy();
        const context = { direction: 'horizontal', registerHandler: () => 0, unregisterHandler: () => {}, notifyResizeStart };
        const Consumer = props => <ResizeContext.Provider value={context}><ResizeHandler disabled={props.disabled} /></ResizeContext.Provider>;
        const wrapper = mount(<Consumer disabled={disabled} />);
        return { wrapper, notifyResizeStart, node: wrapper.find('.semi-resizable-handler').getDOMNode() };
    }
    it('does not start a mouse resize while disabled', () => {
        const { wrapper, notifyResizeStart, node } = createHandler(true);
        node.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        expect(notifyResizeStart.called).toBe(false);
        wrapper.unmount();
    });
    it('does not start a touch resize while disabled', () => {
        const { wrapper, notifyResizeStart, node } = createHandler(true);
        const event = new Event('touchstart', { bubbles: true });
        Object.defineProperty(event, 'targetTouches', { value: [{ clientX: 20, clientY: 30 }] });
        node.dispatchEvent(event);
        expect(notifyResizeStart.called).toBe(false);
        wrapper.unmount();
    });
    it('keeps mouse and touch resizing available when enabled', () => {
        const { wrapper, notifyResizeStart, node } = createHandler(false);
        node.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        const event = new Event('touchstart', { bubbles: true });
        Object.defineProperty(event, 'targetTouches', { value: [{ clientX: 20, clientY: 30 }] });
        node.dispatchEvent(event);
        expect(notifyResizeStart.callCount).toBe(2);
        expect(notifyResizeStart.args.map(args => args[2])).toEqual(['mouse', 'touch']);
        wrapper.unmount();
    });
    it('resumes native mouse resizing after disabled is removed', () => {
        const { wrapper, notifyResizeStart, node } = createHandler(false);
        wrapper.setProps({ disabled: true });
        node.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        expect(notifyResizeStart.called).toBe(false);
        wrapper.setProps({ disabled: false });
        node.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        expect(notifyResizeStart.calledOnce).toBe(true);
        expect(notifyResizeStart.firstCall.args[2]).toBe('mouse');
        wrapper.unmount();
    });
});
