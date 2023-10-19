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

    it('emptyContent=null', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/select--empty-content');
        // when emptyContent = null， The dropdown list will not be displayed
        // so element(which class has semi-popover-wrapper) show have 0px height;
        cy.get('.semi-popover-wrapper').eq(0).should('have.css', 'height', '0px');
    });

    it('autoClearSearchValue false + remote + optionList update async', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/select--auto-clear-search-value');
        cy.get('.remote-select').eq(0).click();
        cy.get('.semi-select-option').eq(0).click();
        cy.get('.remote-select .semi-input').eq(0).type('123');
        cy.wait(500);
        cy.get('.semi-select-option').should('have.text', 'Design');
    });

    // it('ellipsisTrigger', () => {
    //     cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/select--fix-1560');

    //     // add option
    //     cy.get('.semi-select-arrow').eq(0).click();
    //     cy.get('.semi-select-option').contains('剪映').click();
    //     cy.get('.semi-tag-grey-light').eq(0).contains('+2');

    //     // reduce option
    //     cy.get('.semi-select-arrow').eq(0).click();
    //     cy.get('.semi-select-option').contains('抖音').click();
    //     cy.get('.semi-tag-large').eq(2).contains('剪映');

    //     cy.get('body').click('right');

    //     // reduce option
    //     cy.get('.semi-select-arrow').eq(1).click();
    //     cy.get('.semi-select-option').contains('西瓜视频').click();
    //     cy.get('.semi-tag-grey-light').eq(0).contains('+1');

    //     // add option
    //     cy.get('.semi-select-arrow').eq(1).click();
    //     cy.get('.semi-select-option').contains('西瓜视频').click();
    //     cy.get('.semi-tag-grey-light').eq(0).contains('+2');
        
    // });

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