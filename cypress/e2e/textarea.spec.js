// textarea.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe('textarea', () => {
    it('autosize', () => {
        cy.visit('http://localhost:6006/iframe.html?id=input--text-area-autosize&args=&viewMode=story');
        cy.get('.semi-input-textarea').first().type("semi design");
        cy.fixture("placeholder").then(placeholder => {
            cy.get('.semi-input-textarea').first().type(placeholder.medium);
            cy.document().then(document => {
                const textAreaDOM = document.querySelector(".semi-input-textarea");
                expect(textAreaDOM.scrollHeight).to.equal(textAreaDOM.clientHeight);
            });
            cy.get('.semi-input-textarea').first().clear().type(placeholder.long);
            cy.document().then(document => {
                const textAreaDOM = document.querySelector(".semi-input-textarea");
                expect(textAreaDOM.scrollHeight).to.equal(textAreaDOM.clientHeight);
            });
        });
    });
});