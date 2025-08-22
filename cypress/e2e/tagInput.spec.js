describe('tag', () => {
    it('tagInput with renderTagItem', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=taginput--render-tag-item&args=&viewMode=story');

        // focus and esc
        cy.get('.semi-icon-close').click();
        cy.get('.semi-icon-close').should('not.exist');
    });

    it('sortable item long text', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=taginput--long-text-item-draggable&args=&viewMode=story');
        cy.get('.semi-tagInput-wrapper').click();
        cy.get('.semi-tag').eq(0).should('have.css', 'width').and('eq', '290px');
    });
});