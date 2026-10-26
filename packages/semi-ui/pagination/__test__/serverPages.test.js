import React from 'react';
import ReactDOM from 'react-dom';
import { renderToString } from 'react-dom/server';
import Pagination from '../index';

describe('Pagination server-rendered pages', () => {
    it.each([
        [{ total: 30 }, ['1', '2', '3'], true, false],
        [{ total: 200, defaultCurrentPage: 10 }, ['1', '9', '10', '11', '20'], false, false],
        [{ total: 30, currentPage: 3 }, ['1', '2', '3'], false, true],
        [{ total: 0 }, [], true, true],
        [{ total: 90, size: 'small' }, [], true, false],
    ])('renders initial page and disabled state before mount: %j', (props, pages, prevDisabled, nextDisabled) => {
        const container = document.createElement('div');
        container.innerHTML = renderToString(<Pagination {...props} />);
        expect([...container.querySelectorAll('[aria-label^="Page "]')].map(item => item.textContent)).toEqual(pages);
        expect(container.querySelector('[aria-label="Previous"]').getAttribute('aria-disabled')).toBe(String(prevDisabled));
        expect(container.querySelector('[aria-label="Next"]').getAttribute('aria-disabled')).toBe(String(nextDisabled));
    });

    it('hydrates the existing page nodes instead of inserting the page list after mount', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        container.innerHTML = renderToString(<Pagination total={30} />);
        const firstPage = container.querySelector('[aria-label="Page 1"]');
        try {
            expect(firstPage).not.toBeNull();
            ReactDOM.hydrate(<Pagination total={30} />, container);
            expect(container.querySelector('[aria-label="Page 1"]')).toBe(firstPage);
            expect(container.querySelector('[aria-label="Previous"]').getAttribute('aria-disabled')).toBe('true');
        } finally {
            ReactDOM.unmountComponentAtNode(container);
            container.remove();
        }
    });
});
