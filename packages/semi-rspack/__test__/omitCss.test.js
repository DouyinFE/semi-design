import { applySemiRules, createPrefixLoaderRule } from '../src/rule';
import semiOmitCssLoader from '../src/loaders/semi-omit-css-loader';

describe('SemiRspackPlugin omitCss', () => {
    const [rule] = applySemiRules({ omitCss: true });

    it.each([
        '/node_modules/@douyinfe/semi-ui/lib/es/button/Button.js',
        '/node_modules/@douyinfe/semi-ui/lib/cjs/button/Button.js',
        '/node_modules/@douyinfe/semi-icons/lib/es/icons/IconClose.js',
        '/node_modules/@douyinfe/semi-ui-19/lib/es/button/Button.js',
        '/node_modules/@douyinfe/semi-icons-19/lib/cjs/icons/IconClose.js',
        'C:\\app\\node_modules\\@douyinfe\\semi-ui\\lib\\es\\button\\Button.js',
    ])('removes component CSS imports in %s', resource => {
        const source = "import '@douyinfe/semi-foundation/lib/es/button/button.css';\nexport const value = 1;";
        const transformed = rule.test.test(resource) ? semiOmitCssLoader(source) : source;
        expect(transformed).toBe("// import '@douyinfe/semi-foundation/lib/es/button/button.css';\nexport const value = 1;");
    });

    it('removes CommonJS CSS requires without removing the component code', () => {
        const resource = '/node_modules/@douyinfe/semi-ui/lib/cjs/button/Button.js';
        const source = "require('@douyinfe/semi-foundation/lib/cjs/button/button.css');\nexports.value = 1;";
        const transformed = rule.test.test(resource) ? semiOmitCssLoader(source) : source;
        expect(transformed).toBe("// require('@douyinfe/semi-foundation/lib/cjs/button/button.css');\nexports.value = 1;");
    });

    it.each([
        '/node_modules/other/lib/button.js',
        '/node_modules/@douyinfe/semi-ui-custom/lib/button.js',
        '/node_modules/@douyinfe/semi-foundation/lib/es/utils/env.js',
        '/node_modules/@douyinfe/semi-ui/src/button.js',
        '/node_modules/@douyinfe/semi-ui/lib/es/button/button.css',
    ])('does not process unrelated resources: %s', resource => {
        expect(rule.test.test(resource)).toBe(false);
    });

    it('keeps prefix replacement limited to env.js', () => {
        const prefixRule = createPrefixLoaderRule({ prefixCls: 'custom' });
        expect(prefixRule.test.test('/node_modules/@douyinfe/semi-foundation/lib/es/utils/env.js')).toBe(true);
        expect(prefixRule.test.test('/node_modules/@douyinfe/semi-ui/lib/es/button/Button.js')).toBe(false);
    });
});
