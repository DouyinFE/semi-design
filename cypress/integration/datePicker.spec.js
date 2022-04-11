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
        cy.visit('http://localhost:6006/iframe.html?id=datepicker--fix-need-confirm&args=&viewMode=story');
        cy.get('[data-cy=1] .semi-input-wrapper').click();
        cy.get('.semi-datepicker-footer > .semi-button-borderless')
            .then(($btn) => {
                console.log('then');
                $btn.trigger('click');
            });
        cy.get('body').find('.semi-popover .semi-datepicker').should('have.length', 0);
    });

    it('dateTime needConfirm confirm', () => {
        cy.visit('http://localhost:6006/iframe.html?id=datepicker--fix-need-confirm&args=&viewMode=story');
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
        cy.visit('http://localhost:6006/iframe.html?id=datepicker--fix-need-confirm&args=&viewMode=story');
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
        cy.visit('http://localhost:6006/iframe.html?id=datepicker--fix-need-confirm&args=&viewMode=story');
        cy.get('[data-cy=3] .semi-datepicker-range-input-wrapper-start .semi-input-wrapper').click();
        cy.get('.semi-datepicker-footer > .semi-button-borderless')
            .then($btn => {
                $btn.trigger('click');
            });
        cy.get('body').find('.semi-popover .semi-datepicker').should('have.length', 0);
    });

    it('dateTimeRange needConfirm select+cancel', () => {
        cy.visit('http://localhost:6006/iframe.html?id=datepicker--fix-need-confirm&args=&viewMode=story');
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
        cy.visit('http://localhost:6006/iframe.html?id=datepicker--fix-need-confirm&args=&viewMode=story');
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

    /**
     * 测试 open 受控时，点击面板内按钮关闭面板后，输入框应该清除 focus 状态
     */
    it('input range focus when open is controlled', () => {
        cy.visit('http://localhost:6006/iframe.html?id=datepicker--fix-input-range-focus&args=&viewMode=story');
        cy.get('.semi-datepicker-range-input-wrapper-start > .semi-input-wrapper').click();
        cy.get('.semi-datepicker-day').contains('10')
            .then($btn => {
                $btn.trigger('click');
            });
        cy.get('.semi-datepicker-day').contains('15')
            .then($btn => {
                $btn.trigger('click');
            });
        cy.get('.semi-datepicker-bottomSlot .semi-button')
            .then($btn => {
                $btn.trigger('click');
                cy.get('.semi-datepicker-range-input-wrapper-start').should('not.have.class', 'semi-datepicker-range-input-wrapper-active');
                cy.get('.semi-datepicker-range-input-wrapper-end').should('not.have.class', 'semi-datepicker-range-input-wrapper-active');
            });
    });

    it('insetInput + date', () => {
        cy.visit('http://localhost:6006/iframe.html?id=datepicker--inset-input-e-2-e&args=&viewMode=story');   
        cy.get('[data-cy=date] .semi-input').click();
        cy.get('.semi-popover .semi-input-wrapper-focus').type("2021-12-15");
        cy.get('.semi-datepicker-day-selected').contains("15");
        cy.get('.semi-popover .semi-input-wrapper-focus').clear();
        cy.get('.semi-popover .semi-input-wrapper-focus').type("2021-12-20");
        cy.get('.semi-datepicker-day-selected').contains("20");
        cy.get('.semi-datepicker-day').contains("5").click();
        cy.get('[data-cy=date] .semi-input').click();
        cy.get('.semi-popover .semi-input').should("have.value", "2021-12-05");
    });

    it('insetInput + month', () => {
        cy.visit('http://localhost:6006/iframe.html?id=datepicker--inset-input-e-2-e&args=&viewMode=story');   
        cy.get('[data-cy=month] .semi-input').click();
        cy.get('.semi-popover .semi-input-wrapper-focus');
        cy.get('.semi-popover .semi-input').should("have.value", "2021-12");
        cy.get('.semi-popover .semi-input-wrapper-focus').clear();
        // fix https://github.com/DouyinFE/semi-design/runs/5715448296?check_suite_focus=true
        cy.get('.semi-popover .semi-input-wrapper-focus').clear().type('2021-11');
        cy.get('[data-cy=month] .semi-input').should("have.value", "2021-11");
    });

    it('insetInput + dateTime', () => {
        cy.visit('http://localhost:6006/iframe.html?id=datepicker--inset-input-e-2-e&args=&viewMode=story');   
        cy.get('[data-cy=dateTime] .semi-input').click();
        cy.get('.semi-datepicker-day').contains("5").click();
        cy.get('.semi-popover .semi-input').eq(0).should("have.value", "2021-12-05");
        cy.get('.semi-popover .semi-input').eq(1).should("have.value", "00:00:00");
        cy.get('.semi-popover .semi-input').eq(1).click();
        cy.get(".semi-datepicker-tpk");
        cy.get('.semi-popover .semi-input').eq(0).click();
        cy.get(".semi-datepicker-navigation");
    });

    it('insetInput + dateRange', () => {
        cy.visit('http://localhost:6006/iframe.html?id=datepicker--inset-input-e-2-e&args=&viewMode=story');   
        // 点击开始日期 trigger
        cy.get('[data-cy=dateRange] .semi-input').eq(0).click();
        // 查看聚焦
        cy.get('.semi-popover .semi-input-wrapper').eq(0).should("have.class", "semi-input-wrapper-focus");
        // 选择开始日期和结束日期
        cy.get('.semi-popover .semi-datepicker-month-grid-left').contains('5').click();
        cy.get('.semi-popover .semi-datepicker-month-grid-right').contains('10').click();
        // 点击结束日期 trigger
        cy.get('[data-cy=dateRange] .semi-input').eq(1).click();
        // 查看聚焦
        cy.get('.semi-popover .semi-input-wrapper').eq(1).should("have.class", "semi-input-wrapper-focus");
        // 在内联输入框输入日期
        cy.get('.semi-popover .semi-input').eq(1).clear();
        cy.get('.semi-popover .semi-input').eq(1).type("2022-01-20");
        // 查看面板联动
        cy.get('.semi-popover .semi-datepicker-day-selected-end').contains('20');
        cy.get('.semi-popover .semi-input-wrapper').eq(0).click();
        cy.get('.semi-popover .semi-datepicker-month-grid-left').contains('15').click();
        // 查看输入框联动
        cy.get('[data-cy=dateRange] .semi-input').eq(0).should("have.value", "2021-12-15");
        cy.get('[data-cy=dateRange] .semi-input').eq(1).should("have.value", "2022-01-20");
    });

    it('insetInput + dateTimeRange', () => {
        cy.visit('http://localhost:6006/iframe.html?id=datepicker--inset-input-e-2-e&args=&viewMode=story');   
        // 滚动到视窗
        cy.get('[data-cy=dateTimeRange]').scrollIntoView();
        // 点击开始日期 trigger
        cy.get('[data-cy=dateTimeRange] .semi-input').eq(0).click();
        // 查看聚焦
        cy.get('.semi-popover .semi-input-wrapper').eq(0).should("have.class", "semi-input-wrapper-focus");
        // 选择开始日期和结束日期
        cy.get('.semi-popover .semi-datepicker-month-grid-left').contains('5').click();
        cy.get('.semi-popover .semi-datepicker-month-grid-right').contains('10').click();
        // 关闭面板
        cy.get('[data-cy=dateTimeRange]').click({ force: true });
        // 点击结束日期 trigger
        cy.get('[data-cy=dateTimeRange] .semi-input').eq(1).click({ force: true });
        // 查看聚焦
        cy.get('.semi-popover .semi-input-wrapper').eq(2).should("have.class", "semi-input-wrapper-focus");
        // 在内联输入框输入日期
        cy.get('.semi-popover .semi-input').eq(2).clear();
        cy.get('.semi-popover .semi-input').eq(2).type("2022-01-20");
        // 查看面板联动
        cy.get('.semi-popover .semi-datepicker-day-selected-end').contains('20');
        cy.get('.semi-popover .semi-input-wrapper').eq(0).click({ force: true });
        cy.get('.semi-popover .semi-datepicker-month-grid-left').contains('15').click({ force: true });
        // 查看输入框联动
        cy.get('[data-cy=dateTimeRange]').click({ force: true });
        cy.get('[data-cy=dateTimeRange] .semi-input').eq(0).should("have.value", "2021-12-05 00:00:00");
        cy.get('[data-cy=dateTimeRange] .semi-input').eq(1).should("have.value", "2021-12-15 00:00:00");
    });

    it('insetInput + dateTimeRange + check click range start ', () => {
        cy.visit('http://localhost:6006/iframe.html?id=datepicker--inset-input-e-2-e&args=&viewMode=story');   
        cy.get('[data-cy=dateTimeRange]').scrollIntoView();
        cy.get('[data-cy=dateTimeRange] .semi-input').eq(0).click();
        cy.get('.semi-popover .semi-datepicker-month-grid-right').contains('10').click();
        cy.get('.semi-popover .semi-input').eq(0).should("have.value", "2022-01-10");
        cy.get('.semi-popover .semi-input').eq(1).should("have.value", "00:00:00");
        cy.get('[data-cy=dateTimeRange]').click({ force: true });
        // 选择单个日期，关闭面板后 trigger input 会清空
        cy.get('[data-cy=dateTimeRange] .semi-input').eq(0).should("have.value", "");
        cy.get('[data-cy=dateTimeRange] .semi-input').eq(1).should("have.value", "");
    });

    it('insetInput + dateTimeRange + check click range end', () => {
        cy.visit('http://localhost:6006/iframe.html?id=datepicker--inset-input-e-2-e&args=&viewMode=story');   
        cy.get('[data-cy=dateTimeRange]').scrollIntoView();
        cy.get('[data-cy=dateTimeRange] .semi-input').eq(1).click();
        cy.get('.semi-popover .semi-datepicker-month-grid-right').contains('10').click();
        cy.get('.semi-popover .semi-input').eq(2).should("have.value", "2022-01-10");
        cy.get('.semi-popover .semi-input').eq(3).should("have.value", "00:00:00");
        cy.get('[data-cy=dateTimeRange]').click({ force: true });
        // 选择单个日期，关闭面板后 trigger input 会清空
        cy.get('[data-cy=dateTimeRange] .semi-input').eq(0).should("have.value", "");
        cy.get('[data-cy=dateTimeRange] .semi-input').eq(1).should("have.value", "");
    });

    it('insetInput + custom format', () => {
        cy.visit('http://localhost:6006/iframe.html?id=datepicker--inset-input-e-2-e&args=&viewMode=story');   
        cy.get('[data-cy=customFormat]').scrollIntoView();
        cy.get('[data-cy=customFormat] .semi-input').eq(0).click();
        cy.get('.semi-popover .semi-datepicker-month-grid-left').contains('5').click();
        cy.get('.semi-popover .semi-datepicker-month-grid-right').contains('10').click();
        cy.get('[data-cy=customFormat] .semi-input').eq(0).should("have.value", "21-12-05 上午 12:00");
        cy.get('[data-cy=customFormat] .semi-input').eq(1).should("have.value", "22-01-10 上午 12:00");
        cy.get('[data-cy=customFormat] .semi-input').eq(0).click();
        cy.get('.semi-popover .semi-input').eq(0).should("have.value", "2021-12-05");
        cy.get('.semi-popover .semi-input').eq(1).should("have.value", "2022-01-10");
    });

    it('insetInput + trigger input disabled', () => {
        cy.visit('http://localhost:6006/iframe.html?id=datepicker--inset-input-e-2-e&args=&viewMode=story');
        const testCases = ['date', 'dateTime', 'dateRange', 'dateTimeRange', 'month'];
        
        for (let item of testCases) {
            const wrapper = `[data-cy=${item}]`;
            cy.get(wrapper).scrollIntoView();
            // 打开面板
            cy.get(`${wrapper} .semi-input`).eq(0).click();
            // 查看是否为禁用
            cy.get(`${wrapper} .semi-input-wrapper-disabled`);
            cy.get(wrapper).click({ force: true });
            cy.get(`${wrapper} .semi-input-wrapper`).should('not.have.class', 'semi-input-wrapper-disabled');
        }
    });

    it('defaultPickerValue is number', () => {
        cy.visit('http://localhost:6006/iframe.html?id=datepicker--fix-default-picker-value&viewMode=story');
        cy.get('[data-cy=dateTime] .semi-input').first().click();
        cy.get('[x-type=dateTime] .semi-datepicker-switch-text').first().contains('2021-03-15');
        cy.get('[x-type=dateTime] .semi-datepicker-switch-text').last().contains('00:00:00');

        cy.get('[data-cy=dateTimeRange] .semi-input').first().click();
        cy.get('[x-type=dateTimeRange] .semi-datepicker-switch-text').eq(0).contains('2021-03-15');
        cy.get('[x-type=dateTimeRange] .semi-datepicker-switch-text').eq(1).contains('00:00:00');
        cy.get('[x-type=dateTimeRange] .semi-datepicker-switch-text').eq(2).contains('2021-05-15');
        cy.get('[x-type=dateTimeRange] .semi-datepicker-switch-text').eq(3).contains('23:59:59');

        cy.get('[data-cy=before-1970] .semi-input').first().click();
        cy.get('[x-type=dateTime] .semi-datepicker-switch-text').first().contains('1910-01-01');
        cy.get('[x-type=dateTime] .semi-datepicker-switch-text').last().contains('13:00:00');
    });
});
