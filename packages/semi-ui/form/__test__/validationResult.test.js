import React from 'react';
import { isValid } from '@douyinfe/semi-foundation/form/utils';

describe('Form validation results', () => {
    it.each(['react.element', 'react.transitional.element'])('rejects %s error messages', marker => {
        const error = { ...React.createElement('span', null, 'invalid'), $$typeof: Symbol.for(marker) };
        expect(isValid(error)).toBe(false);
        expect(isValid([undefined, error])).toBe(false);
    });

    it.each([
        [undefined, true], [null, true], ['', true], [true, true],
        ['invalid', false], [false, false], [['invalid'], false],
        [{ $$typeof: Symbol.for('unrelated') }, true],
    ])('keeps existing validation semantics for %j', (result, expected) => {
        expect(isValid(result)).toBe(expected);
    });
});
