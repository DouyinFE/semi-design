import loader from '../src/semi-web-component-loader';

describe('webpack web component style imports', () => {
    it('imports the Portal dependency of SideSheet', () => {
        const output = loader('/*SEMI_INSERT_STYLE_BEGIN["SideSheet"]SEMI_INSERT_STYLE_END*/');
        expect(output).toContain('@douyinfe/semi-foundation/lib/es/_portal/portal.scss');
        expect(output).toContain('@douyinfe/semi-foundation/lib/es/sideSheet/sideSheet.scss');
        expect(output).not.toContain('[Portal');
    });

    it('keeps Button and Icon styles for an existing component', () => {
        const output = loader('/*SEMI_INSERT_STYLE_BEGIN["Button"]SEMI_INSERT_STYLE_END*/');
        expect(output).toContain('@douyinfe/semi-foundation/lib/es/button/button.scss');
        expect(output).toContain('@douyinfe/semi-icons/lib/es/styles/icons.scss');
    });
});
