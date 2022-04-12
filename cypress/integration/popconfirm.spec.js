// popConfirm.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe('popConfirm', () => {
    it('confirm focus', () => {
        cy.visit('http://localhost:6006/iframe.html?id=popconfirm--keyboard-and-focus&args=&viewMode=story');
        cy.get('[data-cy=initial-focus-confirm]').click();
        cy.get('.semi-popconfirm-footer .semi-button').eq(1).should('be.focused');
        cy.get('.semi-popconfirm-footer .semi-button').eq(1).click();
        cy.get('[data-cy=initial-focus-confirm] .semi-button').should('be.focused');
    });

    it('cancel focus', () => {
        cy.visit('http://localhost:6006/iframe.html?id=popconfirm--keyboard-and-focus&args=&viewMode=story');
        cy.get('[data-cy=initial-focus-cancel]').click();
        cy.get('.semi-popconfirm-footer .semi-button').eq(0).should('be.focused');
        cy.get('.semi-popconfirm-footer .semi-button').eq(0).click();
        cy.get('[data-cy=initial-focus-cancel] .semi-button').should('be.focused');
    });

    it('content focus', () => {
        cy.visit('http://localhost:6006/iframe.html?id=popconfirm--keyboard-and-focus&args=&viewMode=story');
        cy.get('[data-cy=initial-focus-content]').click();
        cy.get('.semi-popconfirm-header-body input').eq(0).should('be.focused');
        cy.get('.semi-popconfirm-header .semi-popconfirm-btn-close').eq(0).click();
        cy.get('[data-cy=initial-focus-content] .semi-button').should('be.focused');
    });
});