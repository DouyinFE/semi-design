import React from 'react';
import { Resizable } from '../index';

describe('Resizable controlled size in a flex row parent', () => {
    let wrapper;
    let container;
    beforeEach(() => {
        container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'row';
        document.body.appendChild(container);
    });
    afterEach(() => {
        wrapper?.unmount();
        container.remove();
    });

    const fire = (target, type, clientX) => {
        target.dispatchEvent(new MouseEvent(type, { bubbles: true, clientX, clientY: 0 }));
    };

    it('does not let a stale flexBasis override a controlled size that refuses the change', () => {
        function Consumer() {
            const [, force] = React.useState(0);
            return (
                <Resizable
                    style={{ flexBasis: 200 }}
                    size={{ width: 200, height: 120 }}
                    onChange={() => force(n => n + 1)}
                />
            );
        }
        wrapper = mount(<Consumer />, { attachTo: container });
        const node = wrapper.find('.semi-resizable-resizable').getDOMNode();
        const foundation = wrapper.find(Resizable).instance().foundation;
        sinon.stub(foundation, 'getParentSize').returns({ width: 650, height: 400 });
        sinon.stub(foundation, 'calDirectionSize').returns({ newWidth: 280, newHeight: 120 });
        sinon.stub(foundation, 'calBoundaryMax').returns({ maxWidth: 650, maxHeight: 400 });
        sinon.stub(foundation, 'calAspectRatioSize').returns({ newWidth: 280, newHeight: 120 });

        const handle = node.querySelector('.semi-resizable-resizable-handler-right') || node.lastChild.firstChild;
        fire(handle, 'mousedown', 0);
        fire(window, 'mousemove', 80);
        expect(node.style.width).toBe('200px');
        expect(node.style.flexBasis).toBe('200px');
        fire(window, 'mouseup', 80);
        expect(node.style.width).toBe('200px');
        expect(node.style.flexBasis).toBe('200px');
    });

    it('still follows the drag with flexBasis when the size is uncontrolled', () => {
        wrapper = mount(<Resizable style={{ flexBasis: 200 }} defaultSize={{ width: 200, height: 120 }} />, { attachTo: container });
        const node = wrapper.find('.semi-resizable-resizable').getDOMNode();
        const foundation = wrapper.find(Resizable).instance().foundation;
        sinon.stub(foundation, 'getParentSize').returns({ width: 650, height: 400 });
        sinon.stub(foundation, 'calDirectionSize').returns({ newWidth: 280, newHeight: 120 });
        sinon.stub(foundation, 'calBoundaryMax').returns({ maxWidth: 650, maxHeight: 400 });
        sinon.stub(foundation, 'calAspectRatioSize').returns({ newWidth: 280, newHeight: 120 });

        const handle = node.querySelector('.semi-resizable-resizable-handler-right') || node.lastChild.firstChild;
        fire(handle, 'mousedown', 0);
        fire(window, 'mousemove', 80);
        fire(window, 'mouseup', 80);
        expect(node.style.flexBasis).toBe('280px');
    });
});
