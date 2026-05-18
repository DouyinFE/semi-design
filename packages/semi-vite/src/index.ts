import { semiTheming } from './plugin';
import { transformSemiTheme } from './theme-loader';

export { semiTheming, transformSemiTheme };
export type { SemiVitePluginOptions, SemiThemeOptions } from './types';
export default semiTheming;

// CJS friendly: make `require('@douyinfe/semi-vite-plugin')` and
// ESM `import semiTheming from '@douyinfe/semi-vite-plugin'` both
// resolve to the plugin function itself, while keeping named exports
// (`{ semiTheming, transformSemiTheme }`) intact.
//
// We intentionally mutate module.exports at the end of the file so the
// emitted CommonJS bundle shape becomes:
//   module.exports = function semiTheming(...) { ... }
//   module.exports.default = module.exports
//   module.exports.semiTheming = module.exports
//   module.exports.transformSemiTheme = transformSemiTheme
//   module.exports.__esModule = true
declare const module: { exports: unknown };
const _exports = module.exports as Record<string, unknown>;
const _fn: any = semiTheming;
Object.assign(_fn, _exports);
_fn.default = _fn;
_fn.semiTheming = _fn;
_fn.transformSemiTheme = transformSemiTheme;
_fn.__esModule = true;
module.exports = _fn;
