// input.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe('input', () => {
    it('trigger password button', () => {
        cy.visit('http://localhost:6006/iframe.html?id=input--input-a-11-y&args=&viewMode=story');
        cy.get('[data-cy=password]').click();
        cy.trigger('');
    });
});
