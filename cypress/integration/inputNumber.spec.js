// inputNumber.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe('inputNumber', () => {
    it('fix precision delete bug', () => {
        cy.visit('http://localhost:6006/iframe.html?id=inputnumber--fix-precision-786&viewMode=story');
        cy.get('[data-cy=fix-precision-786] .semi-input').click().clear();
        cy.get('[data-cy=fix-precision-786] .semi-input').type('aaa');
        cy.get('[data-cy=fix-precision-786] .semi-input').blur();
        cy.get('[data-cy=fix-precision-786] .semi-input').should('have.value', '');
    })
});