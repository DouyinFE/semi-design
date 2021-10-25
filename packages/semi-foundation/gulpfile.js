const path = require('path');
const { Buffer } = require('buffer');
const through2 = require('through2');
const gulp = require('gulp');
const merge2 = require('merge2');
const gulpTS = require('gulp-typescript');
const gulpBabel = require('gulp-babel');
const sass = require('gulp-sass')(require('sass'));
const replace = require('gulp-replace');
const del = require('del');
const tsConfig = require('./tsconfig.json');
const babelConfig = require('./babel.config');

gulp.task('cleanLib', function cleanLib() {
    return del(['lib/**/*']);
});

gulp.task('compileTS', function compileTSX() {
    const tsStream = gulp.src(['**/*.ts', '!node_modules/**/*.*'])
        .pipe(gulpTS(tsConfig.compilerOptions));
    const jsStream = tsStream.js
        .pipe(gulpBabel(babelConfig))
        .pipe(gulp.dest('lib/es'));
    const dtsStream = tsStream.dts.pipe(gulp.dest('lib/es'));
    return merge2([jsStream, dtsStream]);
});

const excludeScss = [
    '!**/button/splitButtonGroup.scss', 
    '!**/steps/bacisSteps.scss',
    '!**/steps/fillSteps.scss',
    '!**/steps/navSteps.scss',
    '!**/table/operationPanel.scss',
    '!**/tooltip/arrow.scss'
];
gulp.task('compileScss', function compileScss() {
    return gulp.src(['**/*.scss', '!node_modules/**/*.*', '!**/rtl.scss', '!**/variables.scss', ...excludeScss])
        .pipe(through2.obj(
            function (chunk, enc, cb) {
                const rootPath = path.join(__dirname, '../../');
                const scssVarStr = `@import "${rootPath}/packages/semi-theme-default/scss/index.scss";\n`;
                const scssBuffer = Buffer.from(scssVarStr);
                chunk.contents = Buffer.concat([scssBuffer, chunk.contents]);
                cb(null, chunk);
            }
        ))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('lib/es'));
});

gulp.task('moveScss', function moveScss() {
    return gulp.src(['**/*.scss', '!node_modules/**/*.*'])
        .pipe(gulp.dest('lib/es'));
});

gulp.task('compileLib', gulp.series(['cleanLib', 'compileScss', 'moveScss', 'compileTS']));

gulp.task('findDupCSSVariables', function findDupCSSVariables() {
    return gulp.src(['**/variable?.scss', '!node_modules/**/*.*'])
        .pipe(through2.obj((chunk, enc, cb) => {
            const fileStr = chunk.contents.toString(enc);
            const lines = fileStr.split('\n');
            const variables = new Set();
            for (let line of lines) {
                if (/\$[a-z]+(-[a-z0-9_]+)+/.test(line)) {
                    const variable = line.split(':')[0];
                    if (variables.has(variable)) {
                        console.error(`❌ ${variable} dup`);
                    } else {
                        variables.add(variable);
                    }
                }
            }
            cb();
        }));
});

