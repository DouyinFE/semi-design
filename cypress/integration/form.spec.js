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

// ❌ 发现了bug
// modify
// it('Basic usage - modify、add blank row、add withInitValue row', () => {
//     cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--basic-array-field-demo');
//     cy.get('#data-0-name').type('-new');
//     cy.get('#data-0-role').type('-new');
//     cy.get('#data-0-name').should('have.value', 'Semi D2C-new');
//     cy.get('#data-0-role').should('have.value', 'Engineer-new');

//     // add blank row
//     cy.get('#add').click();
//     cy.wait(300);
//     cy.get('#data-2-name').should('have.value', '');
//     cy.get('#data-2-role').should('have.value', '');

//     // add withInitValue row
//     cy.get('#addWithInit').click();
//     cy.wait(300);
//     cy.get('#data-3-name').should('have.value', 'Semi New-3');
//     cy.get('#data-3-role').should('have.value', 'Designer');
// });


const D2C = { name: 'Semi D2C', role: 'Engineer' };
const C2D = { name: 'Semi C2D', role: 'Designer' };
const DSM = { name: 'Semi DSM', role: 'Designer' };

describe('Form', () => {
    it('formApi-setValue with array field path, 3 -> 2, remove middle line field', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--use-form-api-set-value-update-array');
        cy.get(':nth-child(3) > .semi-button').click();
        // line 1
        cy.get('[x-field-id="effects[0].name"] > .semi-form-field-main > .semi-input-wrapper > input').should('have.value', '1-name');
        cy.get('[x-field-id="effects[0].type"] > .semi-form-field-main > .semi-input-wrapper > input').should('have.value', '1-type');
        // line 2
        cy.get('[x-field-id="effects[1].name"] > .semi-form-field-main > .semi-input-wrapper > input').should('have.value', '3-name');
        cy.get('[x-field-id="effects[1].type"] > .semi-form-field-main > .semi-input-wrapper > input').should('have.value', '3-type');
        // cy.get('body').find('.semi-popover .semi-datepicker').should('have.length', 0);
    });

    it('Basic usage - add withInitValue row、add blank row', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--basic-array-field-demo');

        // add withInitValue row
        cy.get('#addWithInit').click();
        cy.get('#data-2-name').should('have.value', 'Semi New-3');
        cy.get('#data-2-role').should('have.value', 'Designer');

        // add blank row
        cy.get('#add').click();
        cy.get('#data-3-name').should('have.value', '');
        cy.get('#data-3-role').should('have.value', '');
    });

    // // remove row
    it('Remove row - 3 -> 2, remove middle', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--remove-demo');
        cy.get('#data-1 button').click();

        cy.get('#data-0-name').should('have.value', D2C.name);
        cy.get('#data-0-role').should('have.value', D2C.role);
        cy.get('#data-1-name').should('have.value', DSM.name);
        cy.get('#data-1-role').should('have.value', DSM.role);
    });

    it('Remove row - 3 -> 2, remove middle, 2 -> 1, remove head', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--remove-demo');
        cy.get('#data-1 button').click();
        cy.get('#data-0-name').should('have.value', D2C.name);
        cy.get('#data-0-role').should('have.value', D2C.role);
        cy.get('#data-1-name').should('have.value', DSM.name);
        cy.get('#data-1-role').should('have.value', DSM.role);

        cy.get('#data-0 button').click();
        cy.get('#data-0-name').should('have.value', DSM.name);
        cy.get('#data-0-role').should('have.value', DSM.role);
        cy.get('#data-1').should('not.exist');
    });

    it('Remove row - 3 -> 2, remove head', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--remove-demo');
        cy.get('#data-2').should('exist');
        cy.get('#data-0 button').click();
        cy.get('#data-2').should('not.exist');

        cy.get('#data-0-name').should('have.value', C2D.name);
        cy.get('#data-0-role').should('have.value', C2D.role);
        cy.get('#data-1-name').should('have.value', DSM.name);
        cy.get('#data-1-role').should('have.value', DSM.role);

        cy.get('#data-0 button').click();
        cy.get('#data-0-name').should('have.value', DSM.name);
        cy.get('#data-0-role').should('have.value', DSM.role);
    });

    it('Remove row - 3 -> 2, remove last', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--remove-demo');
        cy.get('#data-2').should('exist');
        cy.get('#data-2 button').click();
        cy.get('#data-2').should('not.exist');

        cy.get('#data-0-name').should('have.value', D2C.name);
        cy.get('#data-0-role').should('have.value', D2C.role);
        cy.get('#data-1-name').should('have.value', C2D.name);
        cy.get('#data-1-role').should('have.value', C2D.role);
    });

    // it('Basic usage - add、remove、reset', () => { });

    // reset
    it('Reset Usage: modify  => reset ', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--reset-demo');
        cy.get('#data-0-name').type('-new');
        cy.get('#data-0-role').type('-new');

        cy.get('#data-0-name').should('have.value', `${D2C.name}-new`);
        cy.get('#data-0-role').should('have.value', `${D2C.role}-new`);

        cy.get('button[type=reset]').click();
        cy.get('#data-0-name').should('have.value', `${D2C.name}`);
        cy.get('#data-0-name').should('have.value', `${D2C.name}`);
    });

    it('Reset Usage: length 2 -> 1  => reset ', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--reset-demo');
        cy.get('#data-0 button').click();
        cy.get('#data-1').should('not.exist');
        cy.get('button[type=reset]').click();

        // cy.get('#data-1').should('exist');
        cy.get('#data-0-name').should('have.value', `${D2C.name}`);
        cy.get('#data-0-role').should('have.value', `${D2C.role}`);
        cy.get('#data-1-name').should('have.value', `${C2D.name}`);
        cy.get('#data-1-role').should('have.value', `${C2D.role}`);
    });


    it('Reset Usage: length 2 -> 0 -> 3  => reset ', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--reset-demo');
        cy.get('#data-1 button').click();
        cy.get('#data-0 button').click();
        cy.get('#data-0').should('not.exist');

        cy.get('#addWithInit').click();
        cy.get('#addWithInit').click();
        cy.get('#addWithInit').click();
        cy.get('#data-2').should('exist');

        cy.get('button[type=reset]').click();
        cy.get('#data-0-name').should('have.value', `${D2C.name}`);
        cy.get('#data-0-role').should('have.value', `${D2C.role}`);
        cy.get('#data-1-name').should('have.value', `${C2D.name}`);
        cy.get('#data-1-role').should('have.value', `${C2D.role}`);
        cy.get('#data-2').should('not.exist');
    });

    it('Reset Usage: length 2 -> 0 -> 2  => reset ', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--reset-demo');
        cy.get('#data-1 button').click();
        cy.get('#data-0 button').click();
        cy.get('#data-0').should('not.exist');

        cy.get('#addWithInit').click();
        cy.get('#addWithInit').click();
        cy.get('.line').should('have.length', 2);

        cy.get('button[type=reset]').click();
        cy.get('#data-2').should('not.exist');
        cy.get('#data-0-name').should('have.value', `${D2C.name}`);
        cy.get('#data-0-role').should('have.value', `${D2C.role}`);
        cy.get('#data-1-name').should('have.value', `${C2D.name}`);
        cy.get('#data-1-role').should('have.value', `${C2D.role}`);
    });

    it('Combine Usage', () => {
        // add -> remove -> modify
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--basic-array-field-demo', {
            onBeforeLoad(win) {
                cy.stub(win.console, 'log').as('consoleLog');
            },
        });
        cy.get('#addWithInit').click();
        cy.get('#data-1 button').click();
        cy.get('#data-0-role').type('-0');
        cy.get('#data-0-name').type('-0');

        cy.get('#data-0-name').should('have.value', `${D2C.name}-0`);
        cy.get('#data-0-role').should('have.value', `${D2C.role}-0`);
        cy.get('#data-1-name').should('have.value', `Semi New-3`);
        cy.get('#data-1-role').should('have.value', `Designer`);
    });

    it('combine usage-2', () => {
        // add -> remove -> modify -> reset
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--basic-array-field-demo');
        cy.get('#data-1 button').click();
        cy.get('#data-0-role').type('-0');
        cy.get('#data-0-name').type('-0');
        cy.get('button[type=reset]').click();
        cy.get('#data-0-name').should('have.value', `${D2C.name}`);
        cy.get('#data-0-role').should('have.value', `${D2C.role}`);
        cy.get('#data-1-name').should('have.value', `${C2D.name}`);
        cy.get('#data-1-role').should('have.value', `${C2D.role}`);
    });

    it('sync setValue - modify value, 2 -> 2', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--manual-set-demo');
        cy.get('#updateSync').click();
        cy.get('#data-0-name').should('have.value', `${D2C.name}-0`);
        cy.get('#data-0-role').should('have.value', `${D2C.role}-0`);
        cy.get('#data-1-name').should('have.value', `${C2D.name}-1`);
        cy.get('#data-1-role').should('have.value', `${C2D.role}`);
    });

    it('sync setValue - add, 2 -> 3, add tail', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--manual-set-demo');
        cy.get('#addTailSync').click();
        cy.get('#data-0-name').should('have.value', `${D2C.name}`);
        cy.get('#data-0-role').should('have.value', `${D2C.role}`);
        cy.get('#data-1-name').should('have.value', `${C2D.name}`);
        cy.get('#data-1-role').should('have.value', `${C2D.role}`);
        cy.get('#data-2-name').should('have.value', `${DSM.name}`);
        cy.get('#data-2-role').should('have.value', `${DSM.role}`);
    });

    it('sync setValue - add, 2 -> 3, add first', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--manual-set-demo');
        cy.get('#addHeadSync').click();
        cy.get('#data-0-name').should('have.value', `${DSM.name}`);
        cy.get('#data-0-role').should('have.value', `${DSM.role}`);
        cy.get('#data-1-name').should('have.value', `${D2C.name}`);
        cy.get('#data-1-role').should('have.value', `${D2C.role}`);
        cy.get('#data-2-name').should('have.value', `${C2D.name}`);
        cy.get('#data-2-role').should('have.value', `${C2D.role}`);
    });

    it('sync setValue - add, 2 -> 3, add middle', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--manual-set-demo');
        cy.get('#addMiddleSync').click();
        cy.get('#data-0-name').should('have.value', `${D2C.name}`);
        cy.get('#data-0-role').should('have.value', `${D2C.role}`);
        cy.get('#data-2-name').should('have.value', `${C2D.name}`);
        cy.get('#data-2-role').should('have.value', `${C2D.role}`);
        cy.get('#data-1-name').should('have.value', `${DSM.name}`);
        cy.get('#data-1-role').should('have.value', `${DSM.role}`);
    });

    it('sync setValue - remove, 3 -> 2, remove first', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--manual-set-demo');
        cy.get('#addTailSync').click();
        cy.get('#removeHeadSync').click();
        cy.get('#data-0-name').should('have.value', `${C2D.name}`);
        cy.get('#data-0-role').should('have.value', `${C2D.role}`);
        cy.get('#data-1-name').should('have.value', `${DSM.name}`);
        cy.get('#data-1-role').should('have.value', `${DSM.role}`);
    });

    it('sync setValue - remove, 3 -> 2, remove middle', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--manual-set-demo');
        cy.get('#addTailSync').click();
        cy.get('#removeMiddleSync').click();
        cy.get('#data-0-name').should('have.value', `${D2C.name}`);
        cy.get('#data-0-role').should('have.value', `${D2C.role}`);
        cy.get('#data-1-name').should('have.value', `${DSM.name}`);
        cy.get('#data-1-role').should('have.value', `${DSM.role}`);
    });

    it('sync setValue - remove, 3 -> 2, remove tail', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--manual-set-demo');
        cy.get('#addTailSync').click();
        cy.get('#removeTailSync').click();
        cy.get('#data-0-name').should('have.value', `${D2C.name}`);
        cy.get('#data-0-role').should('have.value', `${D2C.role}`);
        cy.get('#data-1-name').should('have.value', `${C2D.name}`);
        cy.get('#data-1-role').should('have.value', `${C2D.role}`);
    });

    it('sync setValue - remove, 3 -> 0, remove all', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--manual-set-demo');
        cy.get('#addTailSync').click();
        cy.get('#removeAllSync').click();
        cy.get('.line').should('have.length', 0);
    });

    it('Async setValue - modify value, 2 -> 2', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--manual-set-async-demo');
        cy.get('#updateAsync').click();
        cy.wait(500);
        cy.get('#data-0-name').should('have.value', `${D2C.name}-0`);
        cy.get('#data-0-role').should('have.value', `${D2C.role}-0`);
        cy.get('#data-1-name').should('have.value', `${C2D.name}-1`);
        cy.get('#data-1-role').should('have.value', `${C2D.role}`);
    });

    it('Async setValue - add, 2 -> 3, add tail', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--manual-set-async-demo');
        cy.get('#addTailAsync').click();
        cy.wait(500);
        cy.get('#data-0-name').should('have.value', `${D2C.name}`);
        cy.get('#data-0-role').should('have.value', `${D2C.role}`);
        cy.get('#data-1-name').should('have.value', `${C2D.name}`);
        cy.get('#data-1-role').should('have.value', `${C2D.role}`);
        cy.get('#data-2-name').should('have.value', `${DSM.name}`);
        cy.get('#data-2-role').should('have.value', `${DSM.role}`);
    });

    it('Async setValue - add, 2 -> 3, add first', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--manual-set-async-demo');
        cy.get('#addHeadAsync').click();
        cy.wait(500);
        cy.get('#data-0-name').should('have.value', `${DSM.name}`);
        cy.get('#data-0-role').should('have.value', `${DSM.role}`);
        cy.get('#data-1-name').should('have.value', `${D2C.name}`);
        cy.get('#data-1-role').should('have.value', `${D2C.role}`);
        cy.get('#data-2-name').should('have.value', `${C2D.name}`);
        cy.get('#data-2-role').should('have.value', `${C2D.role}`);
    });

    it('Async setValue - add, 2 -> 3, add middle', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--manual-set-async-demo');
        cy.get('#addMiddleAsync').click();
        cy.wait(500);
        cy.get('#data-0-name').should('have.value', `${D2C.name}`);
        cy.get('#data-0-role').should('have.value', `${D2C.role}`);
        cy.get('#data-2-name').should('have.value', `${C2D.name}`);
        cy.get('#data-2-role').should('have.value', `${C2D.role}`);
        cy.get('#data-1-name').should('have.value', `${DSM.name}`);
        cy.get('#data-1-role').should('have.value', `${DSM.role}`);
    });

    it('Async setValue - remove, 3 -> 2, remove first', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--manual-set-async-demo');
        cy.get('#addTailAsync').click();
        cy.wait(500);
        cy.get('#removeHeadAsync').click();
        cy.wait(500);
        cy.get('#data-0-name').should('have.value', `${C2D.name}`);
        cy.get('#data-0-role').should('have.value', `${C2D.role}`);
        cy.get('#data-1-name').should('have.value', `${DSM.name}`);
        cy.get('#data-1-role').should('have.value', `${DSM.role}`);
    });

    it('Async setValue - remove, 3 -> 2, remove middle', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--manual-set-async-demo');
        cy.get('#addTailAsync').click();
        cy.wait(500);
        cy.get('#removeMiddleAsync').click();
        cy.wait(500);
        cy.get('#data-0-name').should('have.value', `${D2C.name}`);
        cy.get('#data-0-role').should('have.value', `${D2C.role}`);
        cy.get('#data-1-name').should('have.value', `${DSM.name}`);
        cy.get('#data-1-role').should('have.value', `${DSM.role}`);
    });

    it('Async setValue - remove, 3 -> 2, remove tail', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--manual-set-async-demo');
        cy.get('#addTailAsync').click();
        cy.wait(500);
        cy.get('#removeTailAsync').click();
        cy.wait(500);
        cy.get('#data-0-name').should('have.value', `${D2C.name}`);
        cy.get('#data-0-role').should('have.value', `${D2C.role}`);
        cy.get('#data-1-name').should('have.value', `${C2D.name}`);
        cy.get('#data-1-role').should('have.value', `${C2D.role}`);
    });

    it('Async setValue - remove, 2 -> 0, remove all', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--manual-set-async-demo');
        cy.get('#removeAllAsync').click();
        cy.wait(500);
        cy.get('.line').should('have.length', 0);
    });

    it('2 Nested ArrayField - basic', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--basic-nested-demo');
        // check initValue
        cy.get('#data-0-name').should('have.value', `0`);
        cy.get('#data-0-rule-0-type').should('have.value', `0-0-type`);
        cy.get('#data-0-rule-0-desc').should('have.value', `0-0-desc`);
        cy.get('#data-0-rule-1-type').should('have.value', `0-1-type`);
        cy.get('#data-0-rule-1-desc').should('have.value', `0-1-desc`);
        cy.get('#data-1-name').should('have.value', `1`);
        cy.get('#data-1-rule-0-type').should('have.value', `1-0-type`);
        cy.get('#data-1-rule-0-desc').should('have.value', `1-0-desc`);
    });


    it('2 Nested ArrayField - add / remove / reset', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--basic-nested-demo');
        // // add level 0 
        cy.get('#data-1-add').click();
        cy.get('#data-2-name').should('have.value', `2`);
        cy.get('#data-2-rule-0-type').should('have.value', `2-0-type`);
        cy.get('#data-2-rule-0-desc').should('have.value', `2-0-desc`);

        // // add level 1
        cy.get('#data-0-rule-1-add').click();
        cy.get('#data-0-rule-2-type').should('have.value', `0-2-type`);
        cy.get('#data-0-rule-2-desc').should('have.value', `0-2-desc`);

        cy.get('#data-2-rule-0-add').click();
        cy.get('#data-2-rule-1-type').should('have.value', `2-1-type`);
        cy.get('#data-2-rule-1-desc').should('have.value', `2-1-desc`);

        // remove
        /**
         *  0            =>        0
         *   0-0                     0-0
         *   0-1                     0-2
         *   0-2
         *  1                      1
         *   1-0                   
         *  2                      2 
         *   2-0                     2-0
         *   2-1
         */
        cy.get('#data-0-rule-1-remove').click();
        cy.get('#data-1-rule-0-remove').click();
        cy.get('#data-2-rule-1-remove').click();

        cy.get('#data-0-name').should('have.value', `0`);
        cy.get('#data-0-rule-0-type').should('have.value', `0-0-type`);
        cy.get('#data-0-rule-0-desc').should('have.value', `0-0-desc`);
        cy.get('#data-0-rule-1-type').should('have.value', `0-2-type`); // cause remove middle
        cy.get('#data-0-rule-1-desc').should('have.value', `0-2-desc`); // cause remove middle

        cy.get('#data-1-name').should('have.value', `1`);
        cy.get('#data-1-rule-0-type').should('not.exist');
        cy.get('#data-1-rule-0-desc').should('not.exist');

        cy.get('#data-2-name').should('have.value', `2`);
        cy.get('#data-2-rule-0-type').should('have.value', `2-0-type`); // cause remove tail
        cy.get('#data-2-rule-0-desc').should('have.value', `2-0-desc`); // cause remove tail

        // reset
        cy.get('button[type=reset]').click();
        cy.get('#data-0-name').should('have.value', `0`);
        cy.get('#data-0-rule-0-type').should('have.value', `0-0-type`);
        cy.get('#data-0-rule-0-desc').should('have.value', `0-0-desc`);
        cy.get('#data-0-rule-1-type').should('have.value', `0-1-type`);
        cy.get('#data-0-rule-1-desc').should('have.value', `0-1-desc`);
        cy.get('#data-1-name').should('have.value', `1`);
        cy.get('#data-1-rule-0-type').should('have.value', `1-0-type`);
        cy.get('#data-1-rule-0-desc').should('have.value', `1-0-desc`);

        cy.get('#data-2-name').should('not.exist');
        cy.get('#data-2-rule-0-type').should('not.exist');
        cy.get('#data-2-rule-0-desc').should('not.exist');
    });

    it('2 Nested ArrayField - formApi.setValue level-0', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--basic-nested-demo');
        cy.get('#changeOutSide').click();
        cy.get('#data-0-name').should('have.value', `new-0`);
        cy.get('#data-0-rule-0-type').should('have.value', `new-0-0-type`);
        cy.get('#data-0-rule-0-desc').should('have.value', `new-0-0-desc`);
        cy.get('#data-0-rule-1-type').should('have.value', `new-0-1-type`);
        cy.get('#data-0-rule-1-desc').should('have.value', `new-0-1-desc`);

        cy.get('#data-1-name').should('have.value', `new-1`);
        cy.get('#data-1-rule-0-type').should('have.value', `new-1-0-type`);
        cy.get('#data-1-rule-0-desc').should('have.value', `new-1-0-desc`);

        cy.get('#data-2-name').should('have.value', `new-2`);
        cy.get('#data-2-rule-0-type').should('have.value', `new-2-0-type`);
        cy.get('#data-2-rule-0-desc').should('have.value', `new-2-0-desc`);
        cy.get('#data-2-rule-1-type').should('have.value', `new-2-1-type`);
        cy.get('#data-2-rule-1-desc').should('have.value', `new-2-1-desc`);
        cy.get('#data-2-rule-2-type').should('have.value', `new-2-2-type`);
        cy.get('#data-2-rule-2-desc').should('have.value', `new-2-2-desc`);
    });

    it('2 Nested ArrayField - formApi.setValue level-1', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--basic-nested-demo');
        cy.get('#changeInside').click();
        cy.get('#data-0-rule-0-type').should('have.value', `new-0-0-type-in`);
        cy.get('#data-0-rule-0-desc').should('have.value', `new-0-0-desc-in`);

        cy.get('#data-0-rule-1-type').should('not.exist');
        cy.get('#data-0-rule-1-desc').should('not.exist');

        // still same
        cy.get('#data-0-name').should('have.value', `0`);
        cy.get('#data-1-name').should('have.value', `1`);
        cy.get('#data-1-rule-0-type').should('have.value', `1-0-type`);
        cy.get('#data-1-rule-0-desc').should('have.value', `1-0-desc`);
    });

    it('2 Nested ArrayField - formApi.setValue level-0 then set level-1', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--basic-nested-demo');
        cy.get('#changeOutSide').click();
        cy.get('#changeInside').click();

        cy.get('#data-0-name').should('have.value', `new-0`);
        cy.get('#data-0-rule-0-type').should('have.value', `new-0-0-type-in`);  // cause rewrite by changeInside
        cy.get('#data-0-rule-0-desc').should('have.value', `new-0-0-desc-in`);  // cause rewrite by changeInside

        cy.get('#data-0-rule-1-type').should('not.exist'); // cause rewrite by changeInside
        cy.get('#data-0-rule-1-desc').should('not.exist'); // cause rewrite by changeInside

        cy.get('#data-1-name').should('have.value', `new-1`);
        cy.get('#data-1-rule-0-type').should('have.value', `new-1-0-type`);
        cy.get('#data-1-rule-0-desc').should('have.value', `new-1-0-desc`);

        cy.get('#data-2-name').should('have.value', `new-2`);
        cy.get('#data-2-rule-0-type').should('have.value', `new-2-0-type`);
        cy.get('#data-2-rule-0-desc').should('have.value', `new-2-0-desc`);
        cy.get('#data-2-rule-1-type').should('have.value', `new-2-1-type`);
        cy.get('#data-2-rule-1-desc').should('have.value', `new-2-1-desc`);
        cy.get('#data-2-rule-2-type').should('have.value', `new-2-2-type`);
        cy.get('#data-2-rule-2-desc').should('have.value', `new-2-2-desc`);
    });

    it('2 Nested ArrayField - formApi.setValue level-1 then set level-0 then reset', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--basic-nested-demo');
        cy.get('#changeInside').click();

        cy.get('#data-0-name').should('have.value', `0`);
        cy.get('#data-0-rule-0-type').should('have.value', `new-0-0-type-in`);
        cy.get('#data-0-rule-0-desc').should('have.value', `new-0-0-desc-in`);
        cy.get('#data-0-rule-1-type').should('not.exist');
        cy.get('#data-0-rule-1-desc').should('not.exist');
        cy.get('#data-1-name').should('have.value', `1`);
        cy.get('#data-1-rule-0-type').should('have.value', `1-0-type`);
        cy.get('#data-1-rule-0-desc').should('have.value', `1-0-desc`);

        cy.get('#changeOutSide').click();
        cy.get('#data-0-name').should('have.value', `new-0`);
        cy.get('#data-0-rule-0-type').should('have.value', `new-0-0-type`);
        cy.get('#data-0-rule-0-desc').should('have.value', `new-0-0-desc`);
        cy.get('#data-0-rule-1-type').should('have.value', `new-0-1-type`);
        cy.get('#data-0-rule-1-desc').should('have.value', `new-0-1-desc`);
        cy.get('#data-1-name').should('have.value', `new-1`);
        cy.get('#data-1-rule-0-type').should('have.value', `new-1-0-type`);
        cy.get('#data-1-rule-0-desc').should('have.value', `new-1-0-desc`);
        cy.get('#data-2-name').should('have.value', `new-2`);
        cy.get('#data-2-rule-0-type').should('have.value', `new-2-0-type`);
        cy.get('#data-2-rule-0-desc').should('have.value', `new-2-0-desc`);
        cy.get('#data-2-rule-1-type').should('have.value', `new-2-1-type`);
        cy.get('#data-2-rule-1-desc').should('have.value', `new-2-1-desc`);
        cy.get('#data-2-rule-2-type').should('have.value', `new-2-2-type`);
        cy.get('#data-2-rule-2-desc').should('have.value', `new-2-2-desc`);

        cy.get('button[type=reset]').click();
        cy.get('#data-0-name').should('have.value', `0`);
        cy.get('#data-0-rule-0-type').should('have.value', `0-0-type`);
        cy.get('#data-0-rule-0-desc').should('have.value', `0-0-desc`);
        cy.get('#data-0-rule-1-type').should('have.value', `0-1-type`);
        cy.get('#data-0-rule-1-desc').should('have.value', `0-1-desc`);
        cy.get('#data-1-name').should('have.value', `1`);
        cy.get('#data-1-rule-0-type').should('have.value', `1-0-type`);
        cy.get('#data-1-rule-0-desc').should('have.value', `1-0-desc`);
    });

    it('2 Nested ArrayField - formApi.setValue level-0 then set level-1 then level-0 then reset', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--basic-nested-demo');
        cy.get('#changeOutSide').click();
        cy.get('#changeInside').click();
        cy.get('#changeOutSide').click();
        cy.get('#data-0-name').should('have.value', `new-0`);
        cy.get('#data-0-rule-0-type').should('have.value', `new-0-0-type`);
        cy.get('#data-0-rule-0-desc').should('have.value', `new-0-0-desc`);
        cy.get('#data-0-rule-1-type').should('have.value', `new-0-1-type`);
        cy.get('#data-0-rule-1-desc').should('have.value', `new-0-1-desc`);
        cy.get('#data-1-name').should('have.value', `new-1`);
        cy.get('#data-1-rule-0-type').should('have.value', `new-1-0-type`);
        cy.get('#data-1-rule-0-desc').should('have.value', `new-1-0-desc`);
        cy.get('#data-2-name').should('have.value', `new-2`);
        cy.get('#data-2-rule-0-type').should('have.value', `new-2-0-type`);
        cy.get('#data-2-rule-0-desc').should('have.value', `new-2-0-desc`);
        cy.get('#data-2-rule-1-type').should('have.value', `new-2-1-type`);
        cy.get('#data-2-rule-1-desc').should('have.value', `new-2-1-desc`);
        cy.get('#data-2-rule-2-type').should('have.value', `new-2-2-type`);
        cy.get('#data-2-rule-2-desc').should('have.value', `new-2-2-desc`);

        cy.get('button[type=reset]').click();
        cy.get('#data-0-name').should('have.value', `0`);
        cy.get('#data-0-rule-0-type').should('have.value', `0-0-type`);
        cy.get('#data-0-rule-0-desc').should('have.value', `0-0-desc`);
        cy.get('#data-0-rule-1-type').should('have.value', `0-1-type`);
        cy.get('#data-0-rule-1-desc').should('have.value', `0-1-desc`);
        cy.get('#data-1-name').should('have.value', `1`);
        cy.get('#data-1-rule-0-type').should('have.value', `1-0-type`);
        cy.get('#data-1-rule-0-desc').should('have.value', `1-0-desc`);
    });

    it('2 Nested ArrayField - formApi.setValue special row', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--basic-nested-demo');
        cy.get('#changeRow').click();
        cy.get('#data-0-name').should('have.value', `0`);
        cy.get('#data-0-rule-0-type').should('have.value', `special-row-type`);
        cy.get('#data-0-rule-0-desc').should('have.value', `special-row-desc`);
        cy.get('#data-0-rule-1-type').should('have.value', `0-1-type`);
        cy.get('#data-0-rule-1-desc').should('have.value', `0-1-desc`);
        cy.get('#data-1-name').should('have.value', `1`);
        cy.get('#data-1-rule-0-type').should('have.value', `1-0-type`);
        cy.get('#data-1-rule-0-desc').should('have.value', `1-0-desc`);
    });

    // // it('2 Nested ArrayField - formApi.setValues', () => { });

    // // it('Async setValues', () => { });

    // it('sync setValues - modify value, 2 -> 2', () => {

    // });

    // it('sync setValues - add, 2 -> 3, add tail', () => {
    // });

    // it('sync setValues - add, 2 -> 3, add first', () => {
       
    // });

    // it('sync setValues - add, 2 -> 3, add middle', () => {
    
    // });

    // it('sync setValues - remove, 3 -> 2, remove first', () => {
       
    // });

    // it('sync setValues - remove, 3 -> 2, remove middle', () => {
       
    // });

    // it('sync setValues - remove, 3 -> 2, remove tail', () => {
       
    // });

    // it('sync setValues - remove, 2 -> 0, remove all', () => {
       
    // });


    it('Init - Form Props initValues、ArrayField initValue、Field initValue', () => { 
        // 一个 Form 三个 ArrayField
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--init-demo');

        // Form Props initValues
        cy.get('#data-0-name').should('have.value', `${D2C.name}`);
        cy.get('#data-0-role').should('have.value', `${D2C.role}`);
        cy.get('#data-1-name').should('have.value', `${C2D.name}`);
        cy.get('#data-1-role').should('have.value', `${C2D.role}`);
        cy.get('#dataAddWithInit').click();
        cy.get('#data-2-name').should('have.value', 'Data-3');
        cy.get('#data-2-role').should('have.value', 'Designer');


        // ArrayField Props initValue
        cy.get('#dataB-0-name').should('have.value', 'NameInArrayFieldProp');
        cy.get('#dataB-0-role').should('have.value', 'RoleInArrayFieldProp');
        cy.get('#dataB-1-name').should('not.exist');
        cy.get('#dataB-1-role').should('not.exist');
        cy.get('#dataBAddWithInit').click();
        cy.get('#dataB-1-name').should('have.value', 'DataB-2');
        cy.get('#dataB-1-role').should('have.value', 'Designer');

        // Field Props initValue
        cy.get('#dataCAddWithInit').click();
        cy.get('#dataC-0-name').should('have.value', 'DataC-1');
        cy.get('#dataC-0-role').should('have.value', 'Designer');
        cy.get('#dataCAdd').click();
        // if add empty, should use field props
        // TODO
    });

    it('Init - combine, test priority', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/form--init-combine-demo');
        // FormProps + ArrayField Props, should use ArrayField Props first
        cy.get('#data-0-name').should('have.value', 'NameInArrayFieldProp');
        cy.get('#data-0-role').should('have.value', 'RoleInArrayFieldProp');

        // ArrayField Props + Field Props, should use FieldProps first
        cy.get('#dataB-0-name').should('have.value', 'NameInFieldProp');
        cy.get('#dataB-0-role').should('have.value', 'RoleInFieldProp');
    });

    // it('Init - Nested', () => {

    // });
});