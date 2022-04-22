describe('autoComplete', () => {

    it('key press', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=autocomplete--basic-usage&args=&viewMode=story');

        // test downArrow and upArrow
        cy.get('input').type('123');
        cy.get('input').type('{downArrow}');
        cy.get('input').type('{downArrow}');
        cy.get('input').type('{downArrow}');
        cy.get('input').type('{downArrow}');
        cy.get('input').type('{upArrow}');
        cy.get('input').type('{esc}');
        cy.get('input').should('have.value', '123');

        // test downArrow when panel hidden
        cy.get('input').type('{downArrow}');
        cy.get('input').type('{downArrow}');
        cy.get('input').type('{enter}');
        cy.get('input').should('have.value', '123');

        cy.get('input').trigger('mouseover');
        cy.get('.semi-input-clearbtn').click();
        cy.wait(100);
        cy.get('#root').click('right');
        cy.get('input').should('have.value', '');

        // test enter
        cy.get('input').click();
        cy.get('input').type('456');
        cy.get('input').type('{downArrow}');
        cy.get('input').type('{enter}');
        cy.get('#root').click('right');
        cy.get('input').should('have.value', '456@gmail.com');
    });

    it('mouse over option ', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=autocomplete--basic-usage&args=&viewMode=story');
        cy.get('input').type('123');
        cy.get('.semi-portal').contains('123@163.com').trigger('mouseover');
        cy.get('input').type('{downArrow}');
        cy.get('input').type('{enter}');
        cy.get('input').should('have.value', '123@qq.com');

    });

});