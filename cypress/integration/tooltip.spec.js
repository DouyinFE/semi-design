// tooltip.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

/**
 * Cypress will default scroll element into view
 * @see https://docs.cypress.io/guides/core-concepts/interacting-with-elements#Scrolling
 */
describe('tooltip', () => {
    it('leftTopOver autoAdjustOverflow', () => {
        const viewportWidth = 1200;
        const viewportHeight = 660;
        const triggerWidth = 200;
        const triggerHeight = 32;
        const leftTopPosition = { offset: { top: 0, left: 0 }}; 
        const rightBottomPosition = { offset: { top: -viewportHeight + triggerHeight, left: -viewportWidth + triggerWidth }};
        cy.visit('http://127.0.0.1:6006/iframe.html?id=tooltip--left-top-over-auto-adjust-overflow&args=&viewMode=story');
        cy.viewport(viewportWidth, viewportHeight);
        const dataSelector = `[data-cy=leftTopOver]`;
        cy.get(dataSelector).scrollIntoView(leftTopPosition);
        cy.get(dataSelector).click({force: true});
        cy.get('[x-placement="leftTopOver"]').should('have.length', 1);
        cy.get(dataSelector).scrollIntoView(rightBottomPosition);
        cy.get('[x-placement="rightBottomOver"]').should('have.length', 1);
    });
});