import { execFileSync } from 'node:child_process';
import { parse } from 'css';

// Compile outside jsdom so Sass uses its Node filesystem importer.
const css = execFileSync(process.execPath, ['-e', `
    const sass = require('sass');
    process.stdout.write(sass.compileString('@import "semi-theme-default/scss/index.scss"; @import "semi-foundation/grid/grid.scss";', {
        loadPaths: [require('path').resolve('packages')],
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function', 'slash-div'],
    }).css);
`], { encoding: 'utf8' });
const rules = parse(css).stylesheet.rules.flatMap(rule => rule.type === 'media' ? rule.rules : [rule]);
const declarations = selector => Object.fromEntries((rules.find(rule => rule.selectors?.includes(selector))?.declarations || [])
    .filter(declaration => declaration.type === 'declaration').map(({ property, value }) => [property, value]));

describe('Grid responsive zero values', () => {
    ['', '-xs', '-sm', '-md', '-lg', '-xl', '-xxl'].forEach(breakpoint => {
        it(`resets offsets and order for ${breakpoint || 'base'}`, () => {
            expect(declarations(`.semi-col${breakpoint}-offset-0`)['margin-left']).toBe('0');
            expect(declarations(`.semi-col${breakpoint}-push-0`).left).toBe('auto');
            expect(declarations(`.semi-col${breakpoint}-pull-0`).right).toBe('auto');
            expect(declarations(`.semi-col${breakpoint}-order-0`).order).toBe('0');
        });

        it(`resets RTL offset for ${breakpoint || 'base'}`, () => {
            const rule = declarations(`.semi-rtl .semi-col${breakpoint}-offset-0`);
            expect(rule['margin-right']).toBe('0');
            expect(rule['margin-left']).toBe('0');
        });
    });

    it('keeps nonzero offsets and order', () => {
        expect(declarations('.semi-col-md-push-6').left).toBe('25%');
        expect(declarations('.semi-col-md-pull-6').right).toBe('25%');
        expect(declarations('.semi-col-md-offset-6')['margin-left']).toBe('25%');
        expect(declarations('.semi-col-md-order-6').order).toBe('6');
    });

    it('keeps span zero hidden', () => {
        expect(declarations('.semi-col-md-0').display).toBe('none');
    });
});
