import { Resizable, ResizeGroup, ResizeItem, ResizeHandler } from '../index';

describe('Resizable className', () => {
    it('keeps the consumer class on the resizable element when the drag mask appears', () => {
        const wrapper = mount(<Resizable className="consumer-panel" defaultSize={{ width: 200, height: 100 }}><div>Panel</div></Resizable>);
        const handler = wrapper.find('.semi-resizable-resizableHandler-right').getDOMNode();
        handler.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        wrapper.update();
        expect(wrapper.find('.semi-resizable-resizable').hasClass('consumer-panel')).toBe(true);
        expect(wrapper.find('.semi-resizable-background').exists()).toBe(true);
        expect(wrapper.find('.semi-resizable-background').hasClass('consumer-panel')).toBe(false);
        window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        wrapper.unmount();
    });
    it('keeps the consumer class on ResizeGroup when its drag mask appears', () => {
        const wrapper = mount(<ResizeGroup className="consumer-panel" style={{ width: 600, height: 140 }}><ResizeItem defaultSize="50%"><div>Left</div></ResizeItem><ResizeHandler /><ResizeItem defaultSize="50%"><div>Right</div></ResizeItem></ResizeGroup>);
        wrapper.find('.semi-resizable-handler').getDOMNode().dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        wrapper.update();
        expect(wrapper.find('.semi-resizable-group').hasClass('consumer-panel')).toBe(true);
        expect(wrapper.find('.semi-resizable-background').exists()).toBe(true);
        expect(wrapper.find('.semi-resizable-background').hasClass('consumer-panel')).toBe(false);
        window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        wrapper.unmount();
    });
});
