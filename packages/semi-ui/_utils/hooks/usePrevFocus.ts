import { useState, useEffect } from 'react';
import { getActiveElement } from '../index';
import { get, isFunction } from 'lodash-es';

export function usePrevFocus() {
    const [prevFocusElement, setPrevFocus] = useState<HTMLElement>(getActiveElement());

    useEffect(() => {
        return function cleanup() {
            const blur = get(prevFocusElement, 'blur');
            isFunction(blur) && blur();
        };
    }, [prevFocusElement]);

    return [prevFocusElement, setPrevFocus];
}