describe('typography', () => {
    it('ellipsis', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=typography--ellipsis-collapsible&args=&viewMode=story');
        cy.viewport(500, 500);
        cy.get('.semi-typography span').eq(0).contains('...');
        cy.get('.semi-typography-ellipsis-expand').eq(0).contains('展开').click();
        cy.get('.semi-typography').eq(0).contains('四大优势');

        cy.get('.semi-typography-ellipsis-expand').eq(0).contains('收起').click();
        cy.get('.semi-typography span').eq(0).contains('...');

    });

    // todo:  The test currently work only in Electron
    // because the clipboard permission is granted when Cypress starts it.
    it('copyable', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=typography--copyable&args=&viewMode=story');
        cy.viewport(800, 1000);
        cy.get('.semi-typography-action-copy').eq(1).click();
        cy.get('span').contains('复制成功');
        // cy.window()
        //     .its('navigator.clipboard')
        //     .invoke('点击右边的图标复制文本。');
    });

});