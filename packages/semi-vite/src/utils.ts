import { existsSync } from 'fs';
import { platform } from 'os';
import * as path from 'path';
import { createRequire } from 'module';
import { pathToFileURL, URL } from 'url';

const isWindows = platform() === 'win32';

export function normalizePath(p: string): string {
    return path.posix.normalize(isWindows ? p.replace(/\\/g, '/') : p);
}

export function convertMapToString(map: Record<string, string | number>): string {
    return Object.keys(map).reduce(function (prev, curr) {
        return prev + `${curr}: ${map[curr]};\n`;
    }, '');
}

/**
 * Resolve a `~package/foo` style import to its absolute file URL by walking up node_modules
 * from a given importer. Also supports relative paths.
 */
export function createCssImportResolver(importer: string): (url: string) => URL | null {
    const req = createRequire(importer.startsWith('file://') ? importer : pathToFileURL(importer).toString());

    return (id: string) => {
        if (id.startsWith('~')) {
            const pkgPath = id.substring(1);

            try {
                const resolved = req.resolve(pkgPath);
                if (existsSync(resolved)) {
                    return pathToFileURL(resolved);
                }
            } catch (e) {
                // ignore, fallback to manual walk below
            }

            let currentDir = path.dirname(importer);
            const root = path.parse(currentDir).root;
            while (currentDir && currentDir !== root) {
                const candidate = path.join(currentDir, 'node_modules', pkgPath);
                if (existsSync(candidate)) {
                    return pathToFileURL(candidate);
                }
                const parent = path.dirname(currentDir);
                if (parent === currentDir) break;
                currentDir = parent;
            }

            const rootNodeModulesPath = path.join(process.cwd(), 'node_modules', pkgPath);
            if (existsSync(rootNodeModulesPath)) {
                return pathToFileURL(rootNodeModulesPath);
            }
            return null;
        }

        const resolvedFilePath = path.resolve(path.dirname(importer), id);
        if (existsSync(resolvedFilePath)) {
            return pathToFileURL(resolvedFilePath);
        }
        return null;
    };
}

/**
 * Try to resolve a module path relative to a given importer file. Returns absolute file path
 * when found, otherwise `undefined`.
 */
export function tryResolve(importer: string, request: string): string | undefined {
    try {
        const req = createRequire(importer.startsWith('file://') ? importer : pathToFileURL(importer).toString());
        return req.resolve(request);
    } catch (e) {
        return undefined;
    }
}
