// form.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

/**
 * why use `.then`?
 * @see https://docs.cypress.io/guides/core-concepts/variables-and-aliases#Return-Values
 */
describe('Select', () => {

    it('option hover, change active', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/select--select-filter-single');
        cy.get('.semi-select').eq(0).click();
        // hover can change active index
        cy.get('.semi-select-option').eq(5).trigger('mouseover');
        cy.get('.semi-select-option-focused .semi-select-option-text').eq(0).should('have.text', 'wym');
        // press downArrow to test it
        cy.get('input').eq(0).type('{downArrow}');
        cy.get('.semi-select-option-focused .semi-select-option-text').eq(0).should('have.text', 'opts');
    });

    it('keyboard-enter, select choose option', { keystrokeDelay: 0 }, () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/select--select-filter-single');
        cy.get('.semi-select').eq(0).click();
        cy.get('input').eq(0).type('o');
        cy.get('input').eq(0).type('{downArrow}');
        cy.get('input').eq(0).type('{downArrow}');
        cy.get('input').eq(0).type('{enter}');
        cy.get('.semi-select-selection-text').eq(0).should('have.text', 'opt1');
    });

    it('clickOutSide, should hide', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/select--select-filter-single', {
            onBeforeLoad(win) {
                cy.stub(win.console, 'log').as('consoleLog');
            },
        });
        cy.get('.semi-select').eq(0).click();
        // should show now
        cy.get('.semi-select-option-list').should('exist');
        // should hide after click empty area
        cy.get('h5').eq(0).click();
        cy.get('.semi-select-option-list').should('not.exist');
        cy.get('@consoleLog').should('be.calledWith', 'onBlur');
    });

    // it('should trigger onSearch when click x icon', () => {
    //     cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/select--select-filter-single');
    //     cy.get('.semi-select').eq(0).click();
    //     cy.get('.semi-select-option').eq(0).click();
    //     cy.get('.semi-select').eq(0).click();
    //     cy.get('.semi-select-clear').eq(0).click();
    //     cy.get('.semi-select-input .semi-input').should('have.value', '');
    // });

    // it('should trigger onBlur and onSearch', () => {
    //     cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--use-form-api-set-value-update-array');
    // });

    // it('keyboard-skip disabled option when press up/down', () => {

    // });

    // it('optionList scroll, should trigger onListScroll', () => {
    //     cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--use-form-api-set-value-update-array');
    // });



});