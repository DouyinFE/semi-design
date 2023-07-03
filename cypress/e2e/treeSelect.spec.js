describe('treeSelect', () => {
    it('searchPosition is trigger', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=treeselect--search-position&args=&viewMode=story');

        // test trigger focus
        cy.get('input').eq(0).click();
        cy.get('.semi-tree-select-focus').should('exist');

        // test trigger blur
        cy.get('body').click('right');
        cy.get('.semi-tree-select-focus').should('not.exist');
    });

    it('load data', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=treeselect--load-data&args=&viewMode=story');

        cy.get('.semi-tree-select-selection').click();
        cy.wait(200);
        cy.get('.semi-tree-option-list .semi-icon-tree_triangle_down').eq(0).click();
        cy.wait(1000);
        // assert data had load success
        cy.get('.semi-tree-option-list').contains('Child Node');
    });

    it('clear and close', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=treeselect--check-relation-demo&args=&viewMode=story');
        cy.viewport(1000, 1000);
        
        // test remove tag
        cy.get('.semi-tag-close').eq(3).click();
        cy.get('.semi-tag-content').contains('Japan').should('not.exist');

        cy.get('.semi-tree-select-selection').eq(8).contains('China');
        cy.get('.semi-tree-select-selection').eq(8).trigger('mouseover');
        cy.get('.semi-tree-select-clearbtn').click();
        cy.get('.semi-tagInput-wrapper .semi-tag').should('not.exist');

        // multiple When triggerSearch, clicking the clear button will trigger to clear Input
        cy.get('input').eq(1).type('dddd');
        cy.get('.semi-tree-select-selection').eq(8).trigger('mouseover');
        cy.get('.semi-tree-select-clearbtn').click();
        cy.get('.semi-tree-select-selection').eq(8).get('input').should('have.value', '');

        cy.get('body').click('right');
        // wait for the panel close
        cy.wait(500);

        // single selection  When triggerSearch, clicking the clear button will trigger to clear Input
        cy.get('input').eq(2).type('dddd');
        cy.get('.semi-tree-select-selection').eq(9).trigger('mouseover');
        cy.get('.semi-tree-select-clearbtn').click();
        cy.get('.semi-tree-select-selection').eq(9).get('input').should('have.value', '');
    });

    it('clear by key press', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=treeselect--check-relation-demo&args=&viewMode=story');
        cy.get('.semi-tree-select-selection').eq(8).contains('China');
        cy.get('.semi-tree-select-selection').eq(8).trigger('mouseover');
        cy.get('.semi-tree-select-clearbtn').focus();
        cy.get('.semi-tree-select-clearbtn').type('{enter}');
        cy.get('.semi-tagInput-wrapper .semi-tag').should('not.exist');
    });

    it('onblur / onfocus', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=treeselect--on-blur-on-focus&args=&viewMode=story', {
            onBeforeLoad(win) {
                cy.stub(win.console, 'log').as('consoleLog');
            },
        });
        // 单选，点击 trigger 触发 onFocus， 点击选项触发 onBlur，
        cy.get('.semi-tree-select').eq(0).click();
        cy.get('@consoleLog').should('be.calledWith', 'focus');
        cy.get('.semi-tree-option').eq(0).click();
        cy.get('@consoleLog').should('be.calledWith', 'blur');
        // 单选，点击 trigger 触发 onFocus，再次点击 trigger 收起面板，但不会触发 onBlur， 点击外部触发 onBlur，
        cy.get('.semi-tree-select').eq(0).click();
        cy.get('@consoleLog').should('be.calledWith', 'focus');
        cy.get('.semi-tree-select').eq(0).click();
        cy.get('.semi-tree-select').eq(1).click();
        cy.get('@consoleLog').should('be.calledWith', 'blur');
        // 多选， 点击 trigger 触发 onFocus，在此点击再次点击收起面板，但不会触发 onBlur， 点击外部触发 onBlur，
        cy.get('@consoleLog').should('be.calledWith', 'focus');
        cy.get('.semi-tree-select').eq(1).click();
        cy.get('.semi-tree-select').eq(2).click();
        cy.get('@consoleLog').should('be.calledWith', 'blur');
    });

    it('filterTreeNode & virtualize', () => {
        // 该例子为测试当 filterTreeNode 和 virtualize 功能同时使用时, 点击选中是否符合预期
        cy.visit('http://127.0.0.1:6006/iframe.html?id=treeselect--search-position-in-trigger-and-virtualize');
        cy.get('.semi-tree-select').eq(0).click();
        cy.get('.semi-tree-option').eq(0).click();
        cy.get('.semi-tree-select-selection-TriggerSearchItem').eq(0).should('contain.text', '亚洲');
    });

    it('treeSelect clickTriggerToHide', () => {
        // 测试 clickTriggerToHide API 是否符合预期
        // 未设置 clickTriggerToHide， 默认为 true， 面板打开状态下再次点击会关闭
        cy.visit('http://127.0.0.1:6006/iframe.html?id=treeselect--click-trigger-to-hide');
        cy.get('.semi-tree-select').eq(0).click();
        cy.get('.semi-tree-select-popover').should('exist');
        cy.get('.semi-tree-select').eq(0).click();
        cy.get('.semi-tree-select-popover').should('not.exist');

        // clickTriggerToHide 设置为 false， 面板打开的状态下再次点击不会关闭
        cy.get('.semi-tree-select').eq(1).click();
        cy.get('.semi-tree-select-popover').should('exist');
        cy.get('.semi-tree-select').eq(1).click();
        cy.get('.semi-tree-select-popover').should('exist');
    });
});

