import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { usePrevFocus } from '../hooks/usePrevFocus';

afterEach(cleanup);

it('blurs the previous active element with its DOM receiver on unmount', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();
    const blur = jest.spyOn(input, 'blur');
    function Child() {
        usePrevFocus();
        return null;
    }
    const { unmount } = render(<Child />);
    try {
        expect(document.activeElement).toBe(input);
        expect(() => unmount()).not.toThrow();
        expect(blur).toHaveBeenCalledTimes(1);
        expect(blur.mock.instances[0]).toBe(input);
    } finally {
        input.remove();
        blur.mockRestore();
    }
});
