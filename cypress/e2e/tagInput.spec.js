describe('tag', () => {
    it('tagInput with renderTagItem', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=taginput--render-tag-item&args=&viewMode=story');

        // focus and esc
        cy.get('.semi-icon-close').click();
        cy.get('.semi-icon-close').should('not.exist');
    });
});