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

});