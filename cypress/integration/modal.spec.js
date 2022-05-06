// modal.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe('modal', () => {
    it('useModal', () => {
        cy.visit("http://localhost:6006/iframe.html?id=modal--use-modal-demo&viewMode=story");
        cy.get(".semi-button").click();
        cy.get(".semi-modal-confirm-title-text").contains("old title");
        cy.get(".semi-modal-confirm-content").contains("old content");
        cy.wait(1000);
        cy.get(".semi-modal-confirm-title-text").contains("new title");
        cy.get(".semi-modal-confirm-content").contains("new content");
        cy.get(".semi-modal-footer .semi-button").last().contains("Confirm");
        cy.get(".semi-modal-header .semi-modal-close").click();
        cy.get(".semi-modal").should("not.exist");
    });

    it('useModal destroy', () => {
        cy.visit("http://localhost:6006/iframe.html?id=modal--use-modal-destroy&viewMode=story");
        cy.get(".semi-button").click();
        cy.wait(1000);
        cy.get(".semi-modal").should("not.exist");
    });

    it('useModal afterClose', () => {
        cy.visit("http://localhost:6006/iframe.html?id=modal--use-modal-after-close&viewMode=story");
        cy.get(".semi-button").click();
        cy.get(".semi-modal").should("not.exist");
        cy.get(".semi-tag").first().contains("true");
    });
});