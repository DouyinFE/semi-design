import os from 'os';

export function transformPath(path: string): string {
    if (os.platform() === 'win32') {
        return path.replace(/[\\]+/g, '/');
    }
    return path;
}

export function convertMapToString(map: { [key: string]: string | number }): string {
    return Object.keys(map).reduce(function(prev, curr) {
        return prev + `${curr}: ${map[curr]};\n`;
    }, '');
}