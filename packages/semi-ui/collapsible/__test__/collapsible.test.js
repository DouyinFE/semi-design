import { clear } from 'jest-date-mock';
import { Collapsible } from '../../index';

function getCollapsible(props, children) {
    return (<Collapsible {...(props || {})}>
        {children ? children : <div className='collapsible-test-content'>hello</div>}
    </Collapsible>);
}

describe('collapsible', () => {
    beforeEach(() => {
        // Avoid `attachTo: document.body` Warning
        const div = document.createElement('div');
        div.setAttribute('id', 'container');
        document.body.appendChild(div);
        clear();
    });

    it('keepDOM = true', async () => {
        let component = getCollapsible({ keepDOM: true, motion: false });
        let collapsible = mount(component, { attachTo: document.getElementById('container') })
        expect(collapsible.exists(`.collapsible-test-content`)).toEqual(false);
        // set true
        collapsible.setProps({ isOpen: true });
        collapsible.update(); // 必须调用一次update
        expect(collapsible.exists(`.collapsible-test-content`)).toEqual(true);
        collapsible.setProps({ isOpen: false });
        collapsible.update(); // 必须调用一次update
        expect(collapsible.exists(`.collapsible-test-content`)).toEqual(false);
    });

    it('keepDOM + lazyRender = false', () => {
        let component = getCollapsible({ keepDOM: true, lazyRender: false });
        let collapsible = mount(component);
        expect(collapsible.exists(`.collapsible-test-content`)).toEqual(true);
        // set true
        collapsible.setProps({ isOpen: true });
        collapsible.update(); // 必须调用一次update
        expect(collapsible.exists(`.collapsible-test-content`)).toEqual(true);
        collapsible.setProps({ isOpen: false });
        collapsible.update(); // 必须调用一次update
        expect(collapsible.exists(`.collapsible-test-content`)).toEqual(true);
    });
});