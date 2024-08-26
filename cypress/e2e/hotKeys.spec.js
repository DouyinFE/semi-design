describe('hotKeys', () => {
    it('Basic Demo', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/hotkeys--demo')

        cy.get('body').click().type('{alt}{k}')
        cy.get('pre#pre').should('have.text', '1')
    });

    it('Clickable', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/hotkeys--clickable')

        cy.get('body').click().type('{alt}{k}')
        cy.get('div.semi-hotKeys').click()
        cy.get('pre#pre').should('exist').and('have.text', '2')
    });

    it('Combine', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/hotkeys--combine')

        cy.get('body').click().type('{meta}{alt}{k}').type('{meta}{shift}{k}')
        cy.get('pre#pre').should('exist').and('have.text', '2')
    });

    it('Target', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/hotkeys--target')

        cy.get('input#test').type('{meta}{s}')
        cy.get('pre#pre').should('exist').and('have.text', '1')
    });

    it('Disabled', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?path=/story/hotkeys--disabled')

        cy.get('body').click().type('{meta}{k}')
        cy.get('pre#pre').should('exist').and('have.text', '0')
    });
});