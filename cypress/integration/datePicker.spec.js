// datePicker.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

/**
 * why use `.then`?
 * @see https://docs.cypress.io/guides/core-concepts/variables-and-aliases#Return-Values
 */
describe('DatePicker', () => {
    it('dateTime needConfirm cancel', () => {
        cy.visit('http://127.0.0.1:6009/iframe.html?id=datepicker--fix-need-confirm&args=&viewMode=story');
        cy.get('[data-cy=1] .semi-input-wrapper').click();
        cy.get('.semi-datepicker-footer > .semi-button-borderless')
            .then(($btn) => {
                console.log('then');
                $btn.trigger('click');
            });
        cy.get('body').find('.semi-popover .semi-datepicker').should('have.length', 0);
    });

    it('dateTime needConfirm confirm', () => {
        cy.visit('http://127.0.0.1:6009/iframe.html?id=datepicker--fix-need-confirm&args=&viewMode=story');
        cy.get('[data-cy=1] .semi-input-wrapper').click();
        cy.get('.semi-datepicker-day').contains('15')
            .then($day => {
                $day.trigger('click');
            });
        cy.get('.semi-datepicker-footer > button:nth-child(2)').then($btn => {
            $btn.trigger('click');
        });
        cy.get('body').find('.semi-popover .semi-datepicker').should('have.length', 0);
        cy.get('[data-cy=1] .semi-input').should('have.value', '2021-12-15 10:37:13');
    });

    it('dateTime needConfirm select+cancel', () => {
        cy.visit('http://127.0.0.1:6009/iframe.html?id=datepicker--fix-need-confirm&args=&viewMode=story');
        cy.get('[data-cy=1] .semi-input-wrapper').click();
        cy.get('.semi-datepicker-day').contains('15')
            .then($day => {
                $day.trigger('click');
            });
        cy.get('.semi-datepicker-footer > button:nth-child(1)')
            .then($btn => {
                $btn.trigger('click');
            });
        cy.get('body').find('.semi-popover .semi-datepicker').should('have.length', 0);
        cy.get('[data-cy=1] .semi-input').should('have.value', '2021-12-27 10:37:13');
    });

    it('dateTimeRange needConfirm cancel', () => {
        cy.visit('http://127.0.0.1:6009/iframe.html?id=datepicker--fix-need-confirm&args=&viewMode=story');
        cy.get('[data-cy=3] .semi-datepicker-range-input-wrapper-start .semi-input-wrapper').click();
        cy.get('.semi-datepicker-footer > .semi-button-borderless')
            .then($btn => {
                $btn.trigger('click');
            });
        cy.get('body').find('.semi-popover .semi-datepicker').should('have.length', 0);
    });

    it('dateTimeRange needConfirm select+cancel', () => {
        cy.visit('http://127.0.0.1:6009/iframe.html?id=datepicker--fix-need-confirm&args=&viewMode=story');
        cy.get('[data-cy=3] .semi-datepicker-range-input-wrapper-start .semi-input-wrapper').click();
        cy.get('.semi-datepicker-month-grid-left .semi-datepicker-day').contains('15')
            .then($day => {
                $day.trigger('click');
            });
        cy.get('.semi-datepicker-month-grid-right .semi-datepicker-day').contains('20')
            .then($day => {
                $day.trigger('click');
            });
        cy.get('.semi-datepicker-footer > button:nth-child(1)').then($cancelBtn => {
            $cancelBtn.trigger('click');
        });
        cy.get('body').find('.semi-popover .semi-datepicker').should('have.length', 0);
        cy.get('[data-cy=3] .semi-datepicker-range-input-wrapper-start .semi-input').should('have.value', '2021-12-27 10:37:13');
        cy.get('[data-cy=3] .semi-datepicker-range-input-wrapper-end .semi-input').should('have.value', '2022-01-28 10:37:13');
    });

    it('dateTimeRange needConfirm confirm', () => {
        cy.visit('http://127.0.0.1:6009/iframe.html?id=datepicker--fix-need-confirm&args=&viewMode=story');
        cy.get('[data-cy=3] .semi-datepicker-range-input-wrapper-start .semi-input-wrapper').click();
        cy.get('.semi-datepicker-month-grid-left .semi-datepicker-day').contains('15')
            .then($day => {
                $day.trigger('click');
            });
        cy.get('.semi-datepicker-month-grid-right .semi-datepicker-day').contains('20')
            .then($day => {
                $day.trigger('click');
            });
        cy.get('.semi-datepicker-footer > button:nth-child(2)')
            .then($confirmBtn => {
                $confirmBtn.trigger('click');
            });
        cy.get('body').find('.semi-popover .semi-datepicker').should('have.length', 0);
        cy.get('[data-cy=3] .semi-datepicker-range-input-wrapper-start .semi-input').should('have.value', '2021-12-15 10:37:13');
        cy.get('[data-cy=3] .semi-datepicker-range-input-wrapper-end .semi-input').should('have.value', '2022-01-20 10:37:13');
    });
});