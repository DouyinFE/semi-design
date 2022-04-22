describe('upload', () => {
    it('drag and drop', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=upload--draggable&args=&viewMode=story');

        cy.get('.semi-upload-drag-area').eq(0).selectFile('README.md', { force: true, action: 'drag-drop' });
        cy.get('.semi-upload-file-card-info-main-text').contains('README.md');

        // todo: upload file folder by drag and drop
        // cypress not surpport yet
    });

    it('limit', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=upload--auto-replace-limit-1&args=&viewMode=story');

        cy.get('input[type=file]').eq(0).selectFile('README.md', { force: true });
        cy.get('.semi-upload-file-card-info-main-text').contains('README.md');
        cy.get('input[type=file]').eq(0).selectFile('README.md', { force: true });
        cy.get('.semi-upload-file-card-info-main-text').contains('README.md');
    });

});