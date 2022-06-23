describe('anchor', () => {
    it.skip('show tooltip', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=anchor--show-tooltip&args=&viewMode=story');
        cy.get('.semi-anchor-link').contains('工具提示是一个有用的工具').trigger('mouseover');
        cy.get('.semi-portal').contains('工具提示是一个有用的工具');
        cy.get('.semi-anchor-link').eq(9).contains('工具提示是一个有用的工具').trigger('mouseover');
        cy.get('.semi-portal div[x-placement="right"]').contains('工具提示是一个有用的工具');
    });

    it('key press', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=anchor--style-position&args=&viewMode=story');
        cy.get('.semi-anchor-link').contains('contact').type('{upArrow}').type('{enter}');
        cy.get('h1').contains('Contact me').click();
    });

    it('scroll', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=anchor--target-offset&args=&viewMode=story');
        cy.get('#box').scrollTo('bottom');
        cy.get('.semi-anchor-link-title-active').contains('doc1');
        cy.wait(500);
        cy.get('#box').scrollTo('top');
        cy.get('h1').contains('whatever').click();
    });

    it('click', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=anchor--target-offset&args=&viewMode=story');
        cy.get('.semi-anchor-link').contains('api too much').click();
        cy.get('#api').contains('API').click();
    });

    it('auto collapse', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=anchor--auto-collapse&args=&viewMode=story');
        cy.get('.semi-anchor-link').contains('组件').should('have.length', 0);
        cy.get('.semi-anchor-link').contains('动态展示').click();
        cy.get('.semi-anchor-link').contains('组件').should('have.length', 1);
        cy.get('.semi-anchor-link').contains('设计语言').click();
        cy.get('.semi-anchor-link').contains('组件').should('have.length', 0);
    });

    it('update href', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=anchor--auto-collapse&args=&viewMode=story');
        cy.get('#root').contains('setHref').click();
    });
});