import fs from 'fs';
import path from 'path';
import { generateExports } from '../scripts/generateExports';
import packageJson from '../package.json';

describe('web component base style exports', () => {
    const mapping = extension => ({
        import: './lib/es/_base/base.' + extension,
        require: './lib/cjs/_base/base.' + extension,
        default: './lib/es/_base/base.' + extension,
    });

    function withBuiltBaseFiles(check) {
        const lib = path.resolve(__dirname, '../lib/es');
        const originalExists = fs.existsSync;
        const originalRead = fs.readdirSync;
        const sandbox = sinon.createSandbox();
        sandbox.stub(fs, 'existsSync').callsFake(file => file === lib || file === path.join(lib, '_base') || originalExists(file));
        sandbox.stub(fs, 'readdirSync').callsFake((file, options) => {
            if (file === lib) return [{ name: '_base', isDirectory: () => true }];
            if (file === path.join(lib, '_base')) {
                return ['base.js', 'base.css', 'base.scss'].map(name => ({
                    name, isDirectory: () => false, isFile: () => true,
                }));
            }
            return originalRead(file, options);
        });
        try {
            check(generateExports());
        } finally {
            sandbox.restore();
        }
    }

    it('generates the SCSS entry consumed by the web component loader', () => {
        withBuiltBaseFiles(exports => {
            expect(exports['./lib/es/_base/base.scss']).toEqual(mapping('scss'));
        });
    });

    it('keeps the existing CSS entry', () => {
        withBuiltBaseFiles(exports => {
            expect(exports['./lib/es/_base/base.css']).toEqual(mapping('css'));
        });
    });

    it('includes the base SCSS entry in the package manifest', () => {
        expect(packageJson.exports['./lib/es/_base/base.scss']).toEqual(mapping('scss'));
    });
});
