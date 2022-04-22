describe('treeSelect', () => {
    it('clear', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=treeselect--check-relation-demo&args=&viewMode=story');
        cy.get('.semi-tree-select-selection').eq(8).contains('China');
        cy.get('.semi-tree-select-selection').eq(8).trigger('mouseover');
        cy.get('.semi-tree-select-clearbtn').click();
        cy.get('.semi-tagInput-wrapper .semi-tag').should('not.exist');
    });

    it('clear by key press', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=treeselect--check-relation-demo&args=&viewMode=story');
        cy.get('.semi-tree-select-selection').eq(8).contains('China');
        cy.get('.semi-tree-select-selection').eq(8).trigger('mouseover');
        cy.get('.semi-tree-select-clearbtn').focus();
        cy.get('.semi-tree-select-clearbtn').type('{enter}');
        cy.get('.semi-tagInput-wrapper .semi-tag').should('not.exist');
    });

    it('clear by key press', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=treeselect--check-relation-demo&args=&viewMode=story');
        cy.get('.semi-tree-select-selection').eq(8).contains('China');
        cy.get('.semi-tree-select-selection').eq(8).trigger('mouseover');
        cy.get('.semi-tree-select-clearbtn').focus();
        cy.get('.semi-tree-select-clearbtn').type('{enter}');
        cy.get('.semi-tagInput-wrapper .semi-tag').should('not.exist');
    });
});