describe('overflowList', () => {
    it('intersect', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=overflowlist--overlap-overflow-list&args=&viewMode=story');
        cy.viewport(500, 500);
        cy.get('.semi-tag').eq(0).contains('0');
        cy.get('.semi-tag').eq(1).contains('9');
        cy.get('.semi-overflow-list-scroll-wrapper').scrollTo('right');
        cy.get('.semi-tag').eq(0).contains('10');
    });

    // TODO, need fix after v2.35 slider change
    // it('resize', () => {
    //     cy.visit('http://127.0.0.1:6006/iframe.html?id=overflowlist--overflow-list-with-slide&args=&viewMode=story');
    //     cy.get('.semi-slider-handle')
    //         .trigger('mousedown', { which: 1, pageX: 600, pageY: 100 })
    //         .trigger('mousemove', { which: 1, pageX: -600, pageY: 100 })
    //         .trigger('mouseup');
    //     cy.get('.semi-tag').contains('+6');
    //     cy.get('.semi-slider-handle')
    //         .trigger('mousedown', { which: 1, pageX: -300, pageY: 100 })
    //         .trigger('mousemove', { which: 1, pageX: 100, pageY: 100 })
    //         .trigger('mouseup');
    //     cy.get('.semi-tag').contains('+2');
    // });
});