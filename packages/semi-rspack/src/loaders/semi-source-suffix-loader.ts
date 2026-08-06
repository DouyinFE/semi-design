import { LoaderContext } from 'webpack';

const CSS_IMPORT_RE = /(import\s+|import\s*\(\s*|require\s*\(\s*)['"]([^'"]+)\.css(['"])/g;

function resolveRequest(loader: LoaderContext<void>, request: string): Promise<boolean> {
    return new Promise((resolve) => {
        loader.resolve(loader.context, request, (error) => resolve(!error));
    });
}

/**
 * 兼容旧版 Semi 包：只有 css 不存在、对应 scss 存在时才回退到 scss。
 * 新版 CSS 真源不能被无条件改写回已删除的 scss。
 */
export default function semiSourceSuffixLoader(this: LoaderContext<void>, source: string) {
    const loader = this;
    if (!loader || typeof loader.resolve !== 'function' || typeof loader.async !== 'function') {
        return source;
    }

    const matches: RegExpExecArray[] = [];
    let match: RegExpExecArray | null;
    while ((match = CSS_IMPORT_RE.exec(source))) {
        matches.push(match);
    }
    CSS_IMPORT_RE.lastIndex = 0;
    if (!matches.length) {
        return source;
    }

    const callback = loader.async();
    Promise.all(matches.map(async (match) => {
        const request = `${match[2]}.css`;
        const cssExists = await resolveRequest(loader, request);
        if (cssExists) {
            return false;
        }
        return resolveRequest(loader, `${match[2]}.scss`);
    })).then((shouldFallback) => {
        let result = source;
        for (let i = matches.length - 1; i >= 0; i--) {
            if (!shouldFallback[i]) continue;
            const match = matches[i];
            const replacement = match[0].replace(`${match[2]}.css`, `${match[2]}.scss`);
            const index = match.index;
            result = `${result.slice(0, index)}${replacement}${result.slice(index + match[0].length)}`;
        }
        callback(null, result);
    }).catch((error) => callback(error));
    return undefined;
}
