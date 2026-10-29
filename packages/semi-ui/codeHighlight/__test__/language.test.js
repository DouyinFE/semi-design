import React from 'react';
import CodeHighlight from '../index';
import CodeHighlightFoundation from '@douyinfe/semi-foundation/codeHighlight';

describe('CodeHighlight language updates', () => {
    it('retokenizes unchanged code when language changes and removes old language classes', () => {
        const wrapper = mount(<CodeHighlight language="javascript" code="a { color: red; }" />);
        try {
            const code = wrapper.find('code').getDOMNode();
            wrapper.setProps({ language: 'css' });
            expect(code.classList.contains('language-javascript')).toBe(false);
            expect(code.classList.contains('language-css')).toBe(true);
            expect(code.querySelector('.token.property').textContent).toBe('color');
            expect(code.querySelector('.token.selector').textContent).toBe('a');
            wrapper.setProps({ language: 'javascript' });
            expect(code.classList.contains('language-css')).toBe(false);
            expect(code.classList.contains('language-javascript')).toBe(true);
            expect(code.querySelector('.token.selector')).toBeNull();
        } finally { wrapper.unmount(); }
    });

    it('retokenizes new code without changing language', () => {
        const wrapper = mount(<CodeHighlight language="css" code="a { color: red; }" />);
        try {
            wrapper.setProps({ code: 'b { display: block; }' });
            const code = wrapper.find('code').getDOMNode();
            expect(code.querySelector('.token.property').textContent).toBe('display');
            expect(code.textContent).toBe('b { display: block; }');
        } finally { wrapper.unmount(); }
    });

    it('keeps unrelated classes when replacing a language', () => {
        const foundation = new CodeHighlightFoundation({ getProp: () => true });
        const code = document.createElement('code');
        code.className = 'custom language-javascript';
        code.textContent = 'a { color: red; }';
        foundation.highlightCode(code, 'css');
        expect(code.classList.contains('custom')).toBe(true);
        expect(code.classList.contains('line-numbers')).toBe(true);
        expect(code.classList.contains('language-javascript')).toBe(false);
        expect(code.querySelector('.token.property').textContent).toBe('color');
    });
});
