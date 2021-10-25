/* eslint-disable prefer-promise-reject-errors */
import path from 'path';
import sass, { Options as RenderOptions } from 'sass';
import fs from 'fs-extra';

export interface CompileScssOptions {
    COMPONENT_SCSS_PATH: string;
    OUTPUT_SEMI_SCSS_PATH: string;
    OUTPUT_SEMI_CSS_PATH: string;
    OUTPUT_SEMI_CSS_MIN_PATH: string;
    COMPONENT_EXTRA_SCSS_PATH?: string;
    useAbsolutePath?: boolean;
}

const defaultOptions = {
    COMPONENT_SCSS_PATH: 'tempory/semi-ui/',
    OUTPUT_SEMI_SCSS_PATH: 'tempory/release/semi.scss',
    OUTPUT_SEMI_CSS_PATH: 'tempory/release/css/semi.css',
    OUTPUT_SEMI_CSS_MIN_PATH: 'tempory/release/css/semi-min.css',
};

export default class CompileScss {
    options: CompileScssOptions;
    /**
     * @param {object} [options]
     * @param {string} [options.COMPONENT_SCSS_PATH]
     * @param {string} [options.COMPONENT_EXTRA_SCSS_PATH]
     * @param {string} [options.OUTPUT_SEMI_SCSS_PATH]
     * @param {string} [options.OUTPUT_SEMI_CSS_PATH]
     */
    constructor(options = defaultOptions) {
        // console.log(options)
        this.options = options;
    }

    getScssFolderMap(filepath: string) {
        return fs
            .readdir(filepath)
            .then(files => {
                const folderWithScss: string[] = [];
                files.forEach(fileName => {
                    const scssFile = path.join(this.options.COMPONENT_SCSS_PATH, fileName, `${fileName}.scss`);
                    try {
                        const stats = fs.statSync(scssFile);
                        if (stats.isFile()) {
                            folderWithScss.push(fileName); // Valid file path is pushed
                        }
                    } catch (error) {
                        // console.log(error)
                    }
                });
                return folderWithScss;
            })
            .catch(error => {
                console.error(error);
                throw error;
            });
    }

    async generateSemiScss() {
        const componentScssPath = this.options.COMPONENT_SCSS_PATH;
        const outPutSemiScss = this.options.OUTPUT_SEMI_SCSS_PATH;
        const outPutScss = outPutSemiScss.split('semi.scss')[0] + 'scss';
        const folderWithScss = await this.getScssFolderMap(componentScssPath);
        const relativePath = '../semi-foundation'; // When used in the Semi main repository, use relative paths to build to avoid different semi.scss built when different people publish versions
        const absolutePath = componentScssPath; // When used in semi-server, the absolute path is used to build, so that the semiUI path is not located in the same directory structure as the semi.scss built
        let indexScss = '@import "./scss/index.scss";';
        let globalScss = '@import "./scss/global.scss";';
        let semiUIPath = this.options.useAbsolutePath ? absolutePath : relativePath;

        if (this.options.useAbsolutePath) {
            semiUIPath = absolutePath;
            indexScss = `@import "${outPutScss}/index.scss";`;
            globalScss = `@import "${outPutScss}/global.scss";`;
        }

        const componentScss = folderWithScss
            .map(scssFile => `@import "${semiUIPath}/${scssFile}/${scssFile}.scss"`)
            .concat([
                `@import "${semiUIPath}/button/iconButton.scss"`,
                `@import "${semiUIPath}/input/textarea.scss"`,
            ]) // Handle the scss of iconButton/textarea separately
            .join(';\n');
        const fileContent = `${indexScss}\n${globalScss}\n${componentScss}`;
        return fs.outputFile(outPutSemiScss, fileContent);
    }

    rewriteFile(filePath: string) {
        const extraImport = this.options.COMPONENT_EXTRA_SCSS_PATH;
        let fileStr = fs.readFileSync(filePath, 'utf-8');
        if (extraImport) {
            const localImport = `\n@import "${extraImport}";`;
            try {
                const regex = /(@import '.\/variables.scss';?|@import ".\/variables.scss";?)/g;
                const fileSplit = fileStr.split(regex).filter(item => !!item);
                if (fileSplit.length > 1) {
                    fileSplit.splice(fileSplit.length - 1, 0, localImport);
                    fileStr = fileSplit.join('');
                }
            } catch (error) { }
        }
        return fileStr;
    }

    sassRender(compressed: boolean = false): Promise<boolean> {
        let outPutSemiCSS = this.options.OUTPUT_SEMI_CSS_PATH;
        const semiScssPath = this.options.OUTPUT_SEMI_SCSS_PATH;
        const config: RenderOptions = {
            file: semiScssPath,
            importer: (url: string) => {
                if (url.startsWith('../semi-ui/')) {
                    const result = this.rewriteFile(url);
                    return { contents: result };
                }
                return { file: url };
            }
        };
        if (compressed) {
            config.outputStyle = 'compressed';
            outPutSemiCSS = this.options.OUTPUT_SEMI_CSS_MIN_PATH;
        }

        return new Promise((reslove, reject) => {
            sass.render(config, function (error, result) {
                if (error) {
                    console.log('error: ', error);
                    console.log(error.column, error.message);
                    reject(false);
                } else {
                    fs.outputFile(outPutSemiCSS, result.css)
                        .then(res => {
                            reslove(true);
                        })
                        .catch(err => {
                            console.log('err: ', err);
                            reject(false);
                        });
                }
            });
        });
    }

    async compile() {
        await this.generateSemiScss();
        const compileResult = await this.sassRender();
        let compileMinResult = true;
        if (this.options.OUTPUT_SEMI_CSS_MIN_PATH) {
            compileMinResult = await this.sassRender(true);
        }
        return compileResult && compileMinResult;
    }
}
