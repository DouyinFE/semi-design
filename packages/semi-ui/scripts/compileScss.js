const SemiThemeCompile = require('@douyinfe/semi-scss-compile').default;
const chalk = require('chalk');
const path = require('path');
const log = console.log;

const success = text => chalk.green(text);
const errors = text => chalk.red(text);

function resolve(dir) {
    return path.join(__dirname, '../..', dir);
}

const options = {
    COMPONENT_SCSS_PATH: resolve('semi-foundation/'),
    OUTPUT_SEMI_SCSS_PATH: resolve('semi-theme-default/semi.scss'),
    OUTPUT_SEMI_CSS_PATH: resolve('semi-ui/dist/css/semi.css'),
    OUTPUT_SEMI_CSS_MIN_PATH: resolve('semi-ui/dist/css/semi.min.css'),
};

const compiler = new SemiThemeCompile(options);
compiler
    .compile()
    .then(res => {
        log(success('compile css success'));
        // console.log(res);
        process.exitCode = 0;
    })
    .catch(error => {
        log(errors('compile css failed'));
        log(errors(error));
        process.exitCode = 1;
    });
