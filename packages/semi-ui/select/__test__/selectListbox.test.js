import Select from '..';

describe('Select popup accessibility', () => {
    [
        { name: 'single', props: {} },
        { name: 'multiple', props: { multiple: true } },
        { name: 'virtualized', props: { virtualize: { itemSize: 32, height: 160 } } },
    ].forEach(({ name, props }) => {
        it(`points aria-controls to the ${name} listbox`, () => {
            const host = document.createElement('div');
            document.body.appendChild(host);
            const wrapper = mount(<Select {...props} defaultOpen motion={false}
                optionList={[{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }]} />, { attachTo: host });
            try {
                const combobox = wrapper.find('[role="combobox"]').getDOMNode();
                const popup = document.getElementById(combobox.getAttribute('aria-controls'));
                expect(popup.getAttribute('role')).toBe('listbox');
                expect(popup.querySelectorAll('[role="option"]').length).toBe(2);
            } finally {
                wrapper.unmount();
                host.remove();
            }
        });
    });
});
