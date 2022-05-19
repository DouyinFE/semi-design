// table.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe('table', () => {
    it('row selection', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=table--selection-table&args=&viewMode=story');
        cy.get('.semi-table-row-head .semi-checkbox-inner-display').click();
        cy.get('.semi-checkbox-checked').should('have.length', 4);
    });

    /**
     * 测试 columns 为字面量时刷新 Table，页码应保持当前页
     * 即更新 columns 不影响 currentPage
     */
    it('columns change ', () => {
        cy.visit('http://localhost:6006/iframe.html?id=table--fixed-columns-change&viewMode=story');
        cy.get('.semi-page-item').contains('2').click();
        cy.get('.semi-table-tbody .semi-checkbox').eq(1).click()
            .then(() => {
                cy.get('.semi-page-item').contains('2').should('have.class', 'semi-page-item-active');
            });
    });

    it('defaultFilteredValue', () => {
        cy.visit('http://localhost:6006/iframe.html?id=table--default-filtered-value&args=&viewMode=story');
        // 筛选为默认值
        cy.contains('显示第 1 条-第 10 条，共 23 条');
        // 动态变更数据后，默认筛选生效
        cy.get('.semi-button').contains('toggle change dataSource (46/25)').click();
        cy.contains('显示第 1 条-第 10 条，共 12 条');
        // 筛选手动设置为空后，动态变更数据，筛选值为空
        cy.get('.semi-table-column-filter').click();
        cy.get('.semi-dropdown-menu .semi-dropdown-item:nth-child(2)').click();
        cy.get('.semi-button').contains('toggle change dataSource (46/25)').click();
        cy.contains('显示第 1 条-第 10 条，共 46 条');
    });

    it('jsx columns nested change', () => {
        cy.visit('http://localhost:6006/iframe.html?id=table--fixed-header-merge&args=&viewMode=story');
        cy.get('[data-cy=button]').click();
        cy.contains("Base Information");
        cy.contains("Company Information");
    });

    it('scroll', () => {
        cy.visit('http://localhost:6006/iframe.html?id=table--scroll-bar&args=&viewMode=story');
     
        cy.get('.semi-table-body').scrollTo('bottom');
        cy.get('.semi-table-body').scrollTo('top');
        cy.get('.semi-table-body').scrollTo('left');
        cy.get('.semi-table-body').scrollTo('right');
    });

    it('resizable header', () => {
        cy.visit('http://localhost:6006/iframe.html?id=table--resizable-columns&args=&viewMode=story');
        
        cy.get('.react-resizable-handle').eq(0)
            .trigger('mousedown', { which: 1, pageX: 0, pageY: 100 })
            .trigger('mousemove', { which: 1, pageX: 600, pageY: 100 })
            .trigger('mouseup');
        cy.get('.react-resizable-handle').eq(1)
            .trigger('mousedown', { which: 1, pageX: 300, pageY: 100 })
            .trigger('mousemove', { which: 1, pageX: -300, pageY: 100 })
            .trigger('mouseup');
    });

    it('scroll table header click', () => {
        cy.visit('http://localhost:6006/iframe.html?id=table--fixed-on-header-row&args=&viewMode=story');
        cy.contains('标题').click();
        cy.contains('header click').should('be.visible');
    })
});