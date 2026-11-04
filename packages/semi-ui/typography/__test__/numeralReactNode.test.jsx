import { createPortal } from 'react-dom';
import Numeral from '../numeral';

describe('Numeral ReactNode children', () => {
    it.each([
        ['null', null, ''],
        ['undefined', undefined, ''],
        ['a nullable list', [null, 1.2], '1.20'],
        ['nested arrays', [[1.2], [2.3, [null, 3.4]]], '1.202.303.40'],
        ['a Fragment with empty children', <>{null}<span>1.2</span></>, '1.20'],
        ['boolean children', [false, true, 1.2], '1.20'],
        ['an element without children', <b key="empty" data-testid="empty" />, ''],
    ])('renders %s without changing React child semantics', (_name, children, expected) => {
        let wrapper;
        try {
            wrapper = mount(<Numeral precision={2}>{children}</Numeral>);
            expect(wrapper.text()).toEqual(expected);
        } finally {
            if (wrapper) {
                wrapper.unmount();
            }
        }
    });

    it('preserves a portal child', () => {
        const target = document.createElement('div');
        document.body.appendChild(target);
        let wrapper;
        try {
            wrapper = mount(<Numeral>{createPortal(<span>1.2</span>, target)}</Numeral>);
            expect(target.textContent).toEqual('1.2');
        } finally {
            if (wrapper) {
                wrapper.unmount();
            }
            target.remove();
        }
    });
});
