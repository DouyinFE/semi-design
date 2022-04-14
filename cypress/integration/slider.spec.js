describe('slider', () => {
    let cyWin;

    before(() => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=slider--controlled-slider-demo&args=&viewMode=story', {
            onBeforeLoad(win) {
                cyWin = win;
            },
        });
    });

    beforeEach(() => {
        cy.stub(cyWin.console, 'log').as('consoleLog');
    });

    // afterEach(() => {
    //     cy.reload();
    // });

    it('controlled slider', () => {
        const parentSelector = '[data-cy=horizontalNoChangeSlider]';
        const sliderTrackSelector = `${parentSelector} .semi-slider-rail`;
        const sliderHandleSelector = `${parentSelector} .semi-slider-handle`;
        
        // test track click
        let handleInitialPos;
        cy.get(sliderHandleSelector).then(($handle) => {
            handleInitialPos = $handle.position();
        });

        cy.get(sliderTrackSelector).trigger('click', 'right');
        cy.get('@consoleLog').should('be.calledWith', 'value改变了100');
        
        cy.get(sliderHandleSelector).should(($button) => {
            expect($button.position()).deep.equal(handleInitialPos);
        });

        // test knob slide
        cy.get(sliderHandleSelector)
            .trigger('mousedown')
            .trigger('mousemove', { pageX: 600, pageY:0 })
            .trigger('mouseup', { force: true });
        
        cy.get(sliderHandleSelector).should(($button) => {
            expect($button.position()).deep.equal(handleInitialPos);
        });
    });

    it('controlled slider with onChange', () => {
        const parentSelector = `[data-cy=horizontalOnChangeSlider]`;
        const sliderTrackSelector = `${parentSelector} .semi-slider-rail`;
        const sliderHandleSelector = `${parentSelector} .semi-slider-handle`;

        // test track click
        cy.get(sliderTrackSelector).trigger('click', 'right');
        cy.get('@consoleLog').should('be.calledWith', 'value改变了100');
        cy.get(sliderHandleSelector).should('have.css', 'left', '774px');

        // test knob slide (pageX 300 = 32%)
        cy.get(sliderHandleSelector)
            .trigger('mousedown')
            .trigger('mousemove', { pageX: 300, pageY:0 })
            .trigger('mouseup', { force: true });
        
        // left 32% = 247.68px;
        cy.get(sliderHandleSelector).should('have.css', 'left', '247.68px');
    });

    it('controlled range slider', () => {
        const parentSelector = `[data-cy=horizontalNoChangeRangeSlider]`;
        const sliderTrackSelector = `${parentSelector} .semi-slider-rail`;
        const sliderHandleSelector = `${parentSelector} .semi-slider-handle`;

        let leftKnobPos, rightKnobPos;
        cy.get(sliderHandleSelector).then((handles) => {
            leftKnobPos = handles.eq(0).position();
            rightKnobPos = handles.eq(1).position();
        });

        // test track right click
        cy.get(sliderTrackSelector).trigger('click', 'right');
        cy.get('@consoleLog').should('be.calledWith', 'value改变了10,100');

        // test track left click
        cy.get(sliderTrackSelector).trigger('click', 'left');
        cy.get('@consoleLog').should('be.calledWith', 'value改变了0,30');

        // check final knob position
        cy.get(sliderHandleSelector).should((handles) => {
            expect(handles.eq(0).position()).deep.equal(leftKnobPos);
            expect(handles.eq(1).position()).deep.equal(rightKnobPos);
        });

        // test left knob slide
        cy.get(sliderHandleSelector).eq(0)
            .trigger('mousedown')
            .trigger('mousemove', { pageX: 100, pageY:0 })
            .trigger('mouseup', { force: true });

        // test right knob slide
        cy.get(sliderHandleSelector).eq(1)
            .trigger('mousedown')
            .trigger('mousemove', { pageX: 600, pageY:0 })
            .trigger('mouseup', { force: true });

        cy.get(sliderHandleSelector).should((handles) => {
            expect(handles.eq(0).position()).deep.equal(leftKnobPos);
            expect(handles.eq(1).position()).deep.equal(rightKnobPos);
        });
    });

    it('controlled vertical slider', () => {
        const parentSelector = '[data-cy=horizontalNoChangeVerticalSlider]';
        const sliderTrackSelector = `${parentSelector} .semi-slider-rail`;
        const sliderHandleSelector = `${parentSelector} .semi-slider-handle`;

        let handleInitialPos;
        cy.get(sliderHandleSelector).then(($handle) => {
            handleInitialPos = $handle.position();
        });

        // test track click
        cy.get(sliderTrackSelector).trigger('click', 'bottom');
        cy.get('@consoleLog').should('be.calledWith', 'value改变了100');

        cy.get(sliderHandleSelector).should(($button) => {
            expect($button.position()).deep.equal(handleInitialPos);
        });

        // test knob slide
        cy.get(sliderHandleSelector)
            .trigger('mousedown')
            .trigger('mousemove', { pageX: 0, pageY:600 })
            .trigger('mouseup', { force: true });
        
        cy.get(sliderHandleSelector).should(($button) => {
            expect($button.position()).deep.equal(handleInitialPos);
        });
    });
});