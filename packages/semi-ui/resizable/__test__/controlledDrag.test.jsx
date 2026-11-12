import React from 'react';
import { Resizable } from '../index';

describe('Resizable controlled size during dragging', () => {
    let wrapper;
    afterEach(() => wrapper?.unmount());
    it('uses the controlled size returned by the change callback during a drag', () => {
        function Consumer() {
            const [size, setSize] = React.useState({ width: 200, height: 120 });
            return <Resizable size={size} onChange={setSize} />;
        }
        wrapper = mount(<Consumer />);
        const component = wrapper.find(Resizable).instance();
        const foundation = component.foundation;
        foundation.resizable = component.getResizable();
        sinon.stub(foundation, 'getParentSize').returns({ width: 650, height: 400 });
        sinon.stub(foundation, 'calDirectionSize').returns({ newWidth: 280, newHeight: 120 });
        sinon.stub(foundation, 'calBoundaryMax').returns({ maxWidth: 650, maxHeight: 400 });
        sinon.stub(foundation, 'calAspectRatioSize').returns({ newWidth: 280, newHeight: 120 });
        component.setState({ isResizing: true });
        foundation.changePosition({ clientX: 80, clientY: 0 });
        expect(component.props.size.width).toBe(280);
        expect(wrapper.find('.semi-resizable-resizable').getDOMNode().style.width).toBe('280px');
    });
    it('keeps displaying the controlled value when the parent rejects a change', () => {
        wrapper = mount(<Resizable size={{ width: 200, height: 120 }} />);
        wrapper.setState({ isResizing: true, width: 280, height: 180 });
        const node = wrapper.find('.semi-resizable-resizable').getDOMNode();
        expect(node.style.width).toBe('200px');
        expect(node.style.height).toBe('120px');
    });
});
