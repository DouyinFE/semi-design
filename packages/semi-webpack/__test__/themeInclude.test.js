import SemiWebpackPlugin from '../src/semi-webpack-plugin';

describe('SemiWebpackPlugin theme include', () => {
    it.each([
        ['nested include', { theme: { name: 'theme', include: '/nested.scss' } }, '/nested.scss'],
        ['top-level include', { include: '/top.scss' }, '/top.scss'],
        ['top-level precedence', { theme: { include: '/nested.scss' }, include: '/top.scss' }, '/top.scss'],
        ['undefined top-level include', { theme: { include: '/nested.scss' }, include: undefined }, '/nested.scss'],
        ['explicit empty include', { theme: { include: '/nested.scss' }, include: '' }, ''],
        ['string theme', { theme: 'theme', include: '/top.scss' }, '/top.scss'],
        ['no include', { theme: { name: 'theme' } }, undefined],
    ])('preserves %s', (name, options, expected) => {
        const plugin = new SemiWebpackPlugin(options);
        const module = { resource: '/project/node_modules/@douyinfe/semi-foundation/lib/es/button/button.scss', loaders: [] };
        plugin.customTheme(module);
        const loader = module.loaders.find(item => item.loader.endsWith('semi-theme-loader'));
        expect(loader.options.include).toBe(expected);
    });
});
