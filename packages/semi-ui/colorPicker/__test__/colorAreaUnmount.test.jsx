import ColorPicker from '../index';

describe('ColorPicker area drag lifecycle', () => {
    it('removes mouse listeners before unmounting during a drag', () => {
        const wrapper = mount(<ColorPicker usePopover={false} />);
        const area = wrapper.find('.semi-colorPicker-colorChooseArea');
        const node = area.getDOMNode();
        const removeFromNode = sinon.spy(node, 'removeEventListener');
        sinon.stub(node, 'getBoundingClientRect').returns({ x: 0, y: 0, width: 280, height: 280 });
        area.simulate('mousedown', { clientX: 30, clientY: 30 });
        wrapper.unmount();
        expect(removeFromNode.calledWith('mousemove')).toBe(true);
        removeFromNode.restore();
    });
    it('still releases listeners after an ordinary drag', () => {
        const wrapper = mount(<ColorPicker usePopover={false} />);
        const area = wrapper.find('.semi-colorPicker-colorChooseArea');
        sinon.stub(area.getDOMNode(), 'getBoundingClientRect').returns({ x: 0, y: 0, width: 280, height: 280 });
        area.simulate('mousedown', { clientX: 30, clientY: 30 });
        window.dispatchEvent(new MouseEvent('mouseup'));
        expect(wrapper.find('ColorChooseArea').state('isHandleGrabbing')).toBe(false);
        wrapper.unmount();
    });
});
