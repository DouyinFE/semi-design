import loaderUtils from 'loader-utils';
import { transformSync, PluginItem } from '@babel/core';
import assert from 'assert';

export default function semiPrefixLoader(source: string) {
    const query = loaderUtils.getOptions(this);

    const transformer: PluginItem = {
        visitor: {
            VariableDeclarator(path) {
                const { node } = path;
                const replacerKeys = Object.keys(query.replacers);
                if (replacerKeys.includes((node.id as any).name)) {
                    (node.init as any).value = query.replacers[(node.id as any).name];
                }
            },
        },
    };

    const file = transformSync(source, {
        sourceType: 'module',
        plugins: [transformer],
    });

    const ret = file.code;
    assert(ret, '');
    return ret;
}
