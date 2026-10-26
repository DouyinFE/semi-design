import Typography from '../index';
import Base from '../base';

describe('Typography keyboard expansion', () => {
    let wrapper;
    let host;
    beforeEach(() => {
        host = document.createElement('div');
        document.body.appendChild(host);
    });
    afterEach(() => {
        wrapper.unmount();
        host.remove();
    });

    function renderExpandable(onExpand) {
        wrapper = mount(<Typography.Paragraph ellipsis={{ expandable: true, collapsible: true, onExpand }}>Long content</Typography.Paragraph>, { attachTo: host });
        wrapper.find(Base).setState({ isTruncated: true });
        return host.querySelector('.semi-typography-ellipsis-expand');
    }

    it('expands and collapses once with Space and prevents page scrolling', () => {
        const onExpand = jest.fn();
        const button = renderExpandable(onExpand);
        const expand = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
        button.dispatchEvent(expand);
        expect(onExpand).toHaveBeenCalledTimes(1);
        expect(onExpand.mock.calls[0][0]).toBe(true);
        expect(expand.defaultPrevented).toBe(true);
        const collapse = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
        button.dispatchEvent(collapse);
        expect(onExpand).toHaveBeenCalledTimes(2);
        expect(onExpand.mock.calls[1][0]).toBe(false);
        expect(collapse.defaultPrevented).toBe(true);
    });

    it('expands and collapses once with the native Enter event sequence', () => {
        const onExpand = jest.fn();
        const button = renderExpandable(onExpand);
        for (let i = 0; i < 2; i++) {
            button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
            button.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', charCode: 13, bubbles: true }));
        }
        expect(onExpand).toHaveBeenCalledTimes(2);
        expect(onExpand.mock.calls.map(call => call[0])).toEqual([true, false]);
    });

    it('keeps mouse activation and omits the control without truncation', () => {
        const onExpand = jest.fn();
        const button = renderExpandable(onExpand);
        button.click();
        expect(onExpand).toHaveBeenCalledTimes(1);
        expect(onExpand.mock.calls[0][0]).toBe(true);
        wrapper.find(Base).setState({ isTruncated: false });
        expect(host.querySelector('.semi-typography-ellipsis-expand')).toBeNull();
        wrapper.setProps({ ellipsis: false, disabled: true });
        expect(host.querySelector('.semi-typography-ellipsis-expand')).toBeNull();
    });
});
