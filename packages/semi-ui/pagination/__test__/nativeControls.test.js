import React from 'react';
import sinon from 'sinon';
import Pagination from '../index';

function mountPagination(props) {
    const container = document.createElement('div');
    document.body.appendChild(container);
    return { wrapper: mount(<Pagination {...props} />, { attachTo: container }), container };
}

describe('Pagination native controls and list semantics', () => {
    it.each(['default', 'small'])('uses one native activation for %s previous and next controls', size => {
        const onPageChange = sinon.spy();
        const { wrapper, container } = mountPagination({ total: 80, size, defaultCurrentPage: 2, onPageChange });
        try {
            const next = wrapper.find('.semi-page-next button');
            expect(next.length).toBe(1);
            expect(next.prop('type')).toBe('button');
            next.getDOMNode().click();
            expect(onPageChange.args).toEqual([[3]]);
            wrapper.find('.semi-page-prev button').getDOMNode().click();
            expect(onPageChange.args).toEqual([[3], [2]]);
        } finally {
            wrapper.unmount();
            container.remove();
        }
    });

    it('uses a labelled native button for a numeric page and preserves aria-current', () => {
        const onPageChange = sinon.spy();
        const { wrapper, container } = mountPagination({ total: 30, onPageChange });
        try {
            const page = wrapper.find('button[aria-label="Page 2"]');
            expect(page.length).toBe(1);
            page.getDOMNode().click();
            expect(onPageChange.args).toEqual([[2]]);
            wrapper.update();
            expect(wrapper.find('button[aria-label="Page 2"]').prop('aria-current')).toBe('page');
        } finally {
            wrapper.unmount();
            container.remove();
        }
    });

    it('does not activate disabled native controls or their delegated click handlers', () => {
        const onPageChange = sinon.spy();
        const { wrapper, container } = mountPagination({ total: 30, disabled: true, onPageChange });
        try {
            const buttons = wrapper.find('button');
            expect(buttons.length).toBe(5);
            buttons.forEach(button => {
                expect(button.prop('disabled')).toBe(true);
                button.getDOMNode().click();
            });
            expect(onPageChange.callCount).toBe(0);
        } finally {
            wrapper.unmount();
            container.remove();
        }
    });

    it.each(['default', 'small'])('keeps auxiliary elements in a valid %s list structure', size => {
        const wrapper = mount(<Pagination total={80} size={size} showTotal showSizeChanger showQuickJumper />);
        try {
            const root = wrapper.find('.semi-page').getDOMNode();
            if (size === 'default') {
                expect([...root.children].every(child => child.tagName === 'LI')).toBe(true);
                expect([...root.children].every(child => child.getAttribute('role') !== 'button')).toBe(true);
            } else {
                expect(wrapper.find('.semi-page-quickjump').getDOMNode().tagName).toBe('DIV');
            }
        } finally {
            wrapper.unmount();
        }
    });
});
