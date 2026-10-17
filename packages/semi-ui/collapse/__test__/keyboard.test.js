import Collapse from '../index';

describe('Collapse keyboard interaction', () => {
    let container;
    let wrapper;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        wrapper.unmount();
        container.remove();
    });

    function render(collapseProps = {}, panelProps = {}) {
        wrapper = mount(
            <Collapse motion={false} keepDOM {...collapseProps}>
                <Collapse.Panel header="First panel" itemKey="first" {...panelProps}>First content</Collapse.Panel>
                <Collapse.Panel header="Second panel" itemKey="second">Second content</Collapse.Panel>
            </Collapse>,
            { attachTo: container }
        );
        return wrapper.find('.semi-collapse-header').map(header => header.getDOMNode());
    }

    function press(target, key) {
        const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
        target.dispatchEvent(event);
        wrapper.update();
        return event;
    }

    it.each([
        ['Enter', true], [' ', true], ['Enter', false], [' ', false],
    ])('toggles with %s when clickHeaderToExpand is %s', (key, clickHeaderToExpand) => {
        const onChange = sinon.spy();
        const [header] = render({ clickHeaderToExpand, onChange });
        header.focus();
        expect(press(header, key).defaultPrevented).toBe(true);
        expect(header.getAttribute('aria-expanded')).toBe('true');
        expect(onChange.calledOnce).toBe(true);
        expect(onChange.firstCall.args[0]).toEqual(['first']);
        expect(document.activeElement).toBe(header);

        press(header, key);
        expect(header.getAttribute('aria-expanded')).toBe('false');
        expect(onChange.calledTwice).toBe(true);
        expect(onChange.lastCall.args[0]).toEqual([]);
    });

    it.each(['Enter', ' '])('does not toggle a disabled panel with %s', key => {
        const onChange = sinon.spy();
        const [header] = render({ onChange }, { disabled: true });
        press(header, key);
        expect(header.getAttribute('aria-expanded')).toBe('false');
        expect(onChange.called).toBe(false);
    });

    it('leaves descendant inputs and unrelated keys alone', () => {
        const onChange = sinon.spy();
        const [header] = render({ onChange }, { extra: <input aria-label="Panel note" /> });
        for (const key of ['Enter', ' ']) {
            expect(press(header.querySelector('input'), key).defaultPrevented).toBe(false);
        }
        expect(press(header, 'ArrowDown').defaultPrevented).toBe(false);
        expect(header.getAttribute('aria-expanded')).toBe('false');
        expect(onChange.called).toBe(false);
    });

    it('closes the other panel in accordion mode', () => {
        const headers = render({ accordion: true, defaultActiveKey: 'first' });
        press(headers[1], 'Enter');
        expect(headers[0].getAttribute('aria-expanded')).toBe('false');
        expect(headers[1].getAttribute('aria-expanded')).toBe('true');
    });

    it('notifies the parent in controlled mode', () => {
        const onChange = sinon.spy();
        const [header] = render({ activeKey: [], onChange });
        press(header, 'Enter');
        expect(onChange.calledOnce).toBe(true);
        expect(onChange.firstCall.args[0]).toEqual(['first']);
        expect(header.getAttribute('aria-expanded')).toBe('false');
        wrapper.setProps({ activeKey: ['first'] });
        expect(header.getAttribute('aria-expanded')).toBe('true');
    });

    it('toggles when the arrow is hidden', () => {
        const [header] = render({}, { showArrow: false });
        press(header, ' ');
        expect(header.getAttribute('aria-expanded')).toBe('true');
    });
});
