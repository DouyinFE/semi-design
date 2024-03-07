describe('navigation', () => {
    it('dynamic change', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=navigation--items-change-demo&viewMode=story');

        cy.get('span').contains('用户管理').should('exist');
        cy.get('button').contains('change items').click();
        cy.get('span').contains('用户管理').should('not.exist');
    });

    it('auto open', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=navigation--auto-open&viewMode=story');
        cy.get('span').contains('人员管理').should('exist');
    });

    it('selected keys change', () => {
        cy.visit('http://localhost:6006/iframe.html?id=navigation--fixed-selected-keys&viewMode=story');
        cy.get('.semi-navigation-item-text').contains('Config').click();
        cy.get('.semi-navigation-item-selected').should('contain.text', 'Ability management');
        cy.get('.semi-navigation-sub-title.semi-navigation-sub-title-selected').should('contain.text', "Ability");
        cy.get('.semi-navigation-item-text').contains('Distribution').click();
        cy.get('.semi-navigation-item-selected').should('contain.text', 'Config management');
        cy.get('.semi-navigation-sub-title.semi-navigation-sub-title-selected').should('exist');
    });
});