import { createThemeLoaderRule } from '../src/rule';

describe('SemiRspackPlugin theme include', () => {
    it.each([
        ['nested include', { theme: { name: 'theme', include: '/nested.scss' } }, '/nested.scss'],
        ['top-level include', { include: '/top.scss' }, '/top.scss'],
        ['top-level precedence', { theme: { include: '/nested.scss' }, include: '/top.scss' }, '/top.scss'],
        ['undefined top-level include', { theme: { include: '/nested.scss' }, include: undefined }, '/nested.scss'],
        ['explicit empty include', { theme: { include: '/nested.scss' }, include: '' }, ''],
        ['string theme', { theme: 'theme', include: '/top.scss' }, '/top.scss'],
        ['no include', { theme: { name: 'theme' } }, undefined],
    ])('preserves %s', (name, options, expected) => {
        const rule = createThemeLoaderRule(options);
        const loader = rule.use.find(item => item.loader.endsWith('semi-theme-loader'));
        expect(loader.options.include).toBe(expected);
    });
});
