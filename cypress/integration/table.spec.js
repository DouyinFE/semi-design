// table.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test
describe('table', () => {
    it('row selection', () => {
        cy.visit('http://127.0.0.1:6009/iframe.html?id=table--selection-table&args=&viewMode=story');
        cy.get('.semi-table-row-head .semi-checkbox-inner-display').click();
        cy.get('.semi-checkbox-checked').should('have.length', 4);
    });
});