import Dropdown from '../index';

describe('Dropdown keyboard navigation after menu updates', () => {
    let wrapper;
    afterEach(() => wrapper?.unmount());
    const renderMenu = items => <Dropdown.Menu>{items.map(item => <Dropdown.Item key={item.label} disabled={item.disabled}>{item.label}</Dropdown.Item>)}</Dropdown.Menu>;
    const key = (node, value) => node.dispatchEvent(new KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true }));
    const start = () => {
        wrapper = mount(<Dropdown visible trigger="custom" motion={false} render={renderMenu([{ label: 'Alpha' }, { label: 'Beta' }])}><button>Open</button></Dropdown>);
        const alpha = document.querySelector('[role=menuitem]');
        alpha.focus();
        key(alpha, 'ArrowDown');
        key(alpha, 'ArrowDown');
        expect(document.activeElement.textContent).toBe('Beta');
    };
    it('includes newly added items when moving down', () => {
        start();
        wrapper.setProps({ render: renderMenu([{ label: 'Alpha' }, { label: 'Beta' }, { label: 'Gamma' }]) });
        key(document.activeElement, 'ArrowDown');
        expect(document.activeElement.textContent).toBe('Gamma');
    });
    it('skips items that become disabled', () => {
        start();
        key(document.activeElement, 'ArrowUp');
        wrapper.setProps({ render: renderMenu([{ label: 'Alpha' }, { label: 'Beta', disabled: true }, { label: 'Gamma' }]) });
        key(document.activeElement, 'ArrowDown');
        expect(document.activeElement.textContent).toBe('Gamma');
    });
    it('refreshes first-character navigation after labels change', () => {
        start();
        wrapper.setProps({ render: renderMenu([{ label: 'Alpha' }, { label: 'Gamma' }]) });
        const alpha = document.querySelector('[role=menuitem]');
        key(alpha, 'g');
        expect(document.activeElement.textContent).toBe('Gamma');
    });
    describe('when the focused item becomes disabled', () => {
        const labels = ['Alpha', 'Beta', 'Gamma'];
        const disableFocusedBeta = () => {
            wrapper = mount(<Dropdown visible trigger="custom" motion={false} render={renderMenu(labels.map(label => ({ label })))}><button>Open</button></Dropdown>);
            const alpha = document.querySelector('[role=menuitem]');
            alpha.focus();
            key(alpha, 'ArrowDown');
            key(alpha, 'ArrowDown');
            expect(document.activeElement.textContent).toBe('Beta');
            wrapper.setProps({ render: renderMenu(labels.map(label => ({ label, disabled: label === 'Beta' }))) });
        };
        it('moves down to the next enabled item in DOM order', () => {
            disableFocusedBeta();
            key(document.activeElement, 'ArrowDown');
            expect(document.activeElement.textContent).toBe('Gamma');
        });
        it('moves up to the previous enabled item in DOM order', () => {
            disableFocusedBeta();
            key(document.activeElement, 'ArrowUp');
            expect(document.activeElement.textContent).toBe('Alpha');
        });
        it('keeps navigating correctly after the item is enabled again', () => {
            disableFocusedBeta();
            key(document.activeElement, 'ArrowDown');
            wrapper.setProps({ render: renderMenu(labels.map(label => ({ label }))) });
            key(document.activeElement, 'ArrowUp');
            expect(document.activeElement.textContent).toBe('Beta');
        });
    });
});
