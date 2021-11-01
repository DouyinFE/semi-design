> A Scss compile tool for Semi Design

## Description

There are mainly the following two usage scenarios: 

-   For Sever side consumption in Semi Design System.When publishing the theme, call the script on the Node side to compile the custom theme package into a complete semi.css file
-   Before publish `@douyinfe/semi-foundation`,construct a complete semi.css file

## Dependencies

-   dart-sass

## Usage

```js
const SemiThemeCompile = require('../packages/semi-theme-compile');
const chalk = require('chalk');
const path = require('path');
const log = console.log;

const success = text => chalk.green(text);
const errors = text => chalk.red(text);

function resolve(dir) {
    return path.join(__dirname, '../', dir);
}

const options = {
    COMPONENT_SCSS_PATH: resolve('packages/semi-foundation/'),
    OUTPUT_SEMI_SCSS_PATH: resolve('packages/semi-theme-default/semi.scss'),
    OUTPUT_SEMI_CSS_PATH: resolve('packages/semi-ui/dist/css/semi.css'),
    OUTPUT_SEMI_CSS_MIN_PATH: resolve('packages/semi-ui/dist/css/semi.min.css'),
};

let compiler = new SemiThemeCompile(options);
compiler
    .compile()
    .then(res => {
        log(success('compile css success'));
        process.exitCode = 0;
    })
    .catch(error => {
        log(errors('compile css failed'));
        log(errors(error));
        process.exitCode = 1;
    });

```

## Maintainers

<table>
    <tbody>
        <tr>
            <td align="center"><a href="https://github.com/DouyinFE/semi-design"><img src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/SemiLogo.jpg" width="100px;" alt="" style="max-width:100%;"><br><sub><b>Semi Teams</b></sub></a></td>
        </tr>
    </tbody>
</table>

## License

MIT
