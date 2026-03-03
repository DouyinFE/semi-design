/**
 * React 19 adapter for Semi Design.
 *
 * Usage: import this module before using any Semi components in React 19.
 *
 * ```js
 * import '@douyinfe/semi-ui/react19-adapter';
 * ```
 *
 * For details, see: https://semi.design/zh-CN/ecosystem/react19
 */
import { createRoot } from 'react-dom/client';
import semiGlobal from './_utils/semi-global';

semiGlobal.config.createRoot = createRoot;
