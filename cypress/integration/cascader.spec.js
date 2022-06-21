describe('cascader', () => {
    it('clear when single choose', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=cascader--show-clear&args=&viewMode=story');
        cy.viewport(1500, 1000);
        cy.get('input').eq(0).click();
        cy.get('span').contains('Node1').click();
        cy.get('span').contains('Child Node2').click();
        cy.get('input').should('have.value', 'Node1 / Child Node2');
        cy.get('input').eq(0).trigger('mouseover');
        cy.get('.semi-cascader-clearbtn').click();
        cy.get('input').should('have.value', '');
    });

    it('clear by key press', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=cascader--show-clear&args=&viewMode=story');
        cy.viewport(1500, 1000);

        cy.get('input').eq(0).click();
        cy.get('span').contains('Node1').click();
        cy.get('span').contains('Child Node2').click();
        cy.get('input').should('have.value', 'Node1 / Child Node2');
        cy.get('input').eq(0).trigger('mouseover');
        cy.get(".semi-cascader-clearbtn").focus();
        cy.get('.semi-cascader-clearbtn').type('{enter}');
        cy.get('input').should('have.value', '');
        cy.get('#root').click('right');

        cy.get('.semi-cascader').eq(1).click();
        cy.get('.semi-checkbox').eq(0).click();
        cy.get('.semi-checkbox').eq(1).click();
        cy.get('.semi-cascader-selection-multiple').contains('Node1');
        cy.get('.semi-cascader-selection-multiple').contains('Node2');
        cy.get('.semi-cascader-selection').eq(1).click();
        cy.get(".semi-cascader-clearbtn").focus();
        cy.get('.semi-cascader-clearbtn').type('{enter}');
        cy.get('.semi-cascader-selection .semi-tag').should('not.exist');
    });

    it('scroll', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=cascader--super-long-list&args=&viewMode=story');
        cy.viewport(1000, 1000);
        cy.get('.semi-cascader').eq(0).click();
        cy.get('.semi-cascader-option-list').scrollTo('bottom');
    });

    it('multiple close', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=cascader--cascader&args=&viewMode=story');
        cy.get('.semi-cascader').eq(1).click();
        cy.get('.semi-checkbox').eq(0).click();
        cy.get('.semi-cascader-selection .semi-tag').should('exist');
        cy.get('.semi-tag-close').click();
        cy.get('.semi-cascader-selection .semi-tag').should('not.exist');
    });

    it('placeholder change', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=cascader--dynamic-placeholder&args=&viewMode=story');
        cy.get('.semi-cascader-selection-placeholder').contains('Please select');
        cy.get('.semi-button-content').contains('Toggle').click();
        cy.get('.semi-input-default').should('have.attr', 'placeholder', 'Search something');
    });

    it('placeholder change', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=cascader--dynamic-placeholder&args=&viewMode=story');
        cy.get('.semi-cascader-selection-placeholder').contains('Please select');
        cy.get('.semi-button-content').contains('Toggle').click();
        cy.get('.semi-input-default').should('have.attr', 'placeholder', 'Search something');
    });

    it('multiple onChangeWithObject value=undefined', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=cascader--undefined-value-while-mutiple-and-on-change-with-object&args=&viewMode=story');
        cy.get('.semi-cascader-selection-placeholder').contains('请选择所在地区');
        cy.get('.semi-cascader').click();
        cy.get('.semi-checkbox').eq(0).click();
        cy.get('.semi-tag-content').contains('亚洲');
    })
});