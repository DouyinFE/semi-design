const path = require('path');
const { Buffer } = require('buffer');
const through2 = require('through2');
const merge2 = require('merge2');
const gulp = require('gulp');
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

gulp.task('compileTSX', function compileTSX() {
    const tsStream = gulp.src(['**/*.tsx', '**/*.ts', '!**/node_modules/**/*.*', '!**/_story/**/*.*'])
        .pipe(gulpTS({
            ...tsConfig.compilerOptions,
            rootDir: path.join(__dirname, '..')
        }));
    const jsStream = tsStream.js
        .pipe(gulpBabel(babelConfig))
        .pipe(replace(/(import\s+)['"]@douyinfe\/semi-foundation\/([^'"]+)['"]/g, '$1\'@douyinfe/semi-foundation/lib/es/$2\''))
        .pipe(replace(/(import\s+.+from\s+)['"]@douyinfe\/semi-foundation\/([^'"]+)['"]/g, '$1\'@douyinfe/semi-foundation/lib/es/$2\''))
        .pipe(replace(/(import\s+)['"]([^'"]+)(\.scss)['"]/g, '$1\'$2.css\''))
        .pipe(gulp.dest('lib/es'));
    const dtsStream = tsStream.dts
        .pipe(replace(/(import\s+)['"]@douyinfe\/semi-foundation\/([^'"]+)['"]/g, '$1\'@douyinfe/semi-foundation/lib/es/$2\''))
        .pipe(replace(/(import\s+.+from\s+)['"]@douyinfe\/semi-foundation\/([^'"]+)['"]/g, '$1\'@douyinfe/semi-foundation/lib/es/$2\''))
        .pipe(replace(/(import\(['"])@douyinfe\/semi-foundation\/(.+)/g, '$1@douyinfe/semi-foundation/lib/es/$2'))
        .pipe(replace(/(import\s+)['"]([^'"]+)(\.scss)['"]/g, '$1\'$2.css\''))
        .pipe(gulp.dest('lib/es'));
    return merge2([jsStream, dtsStream]);
});

gulp.task('compileScss', function compileScss() {
    return gulp.src(['**/*.scss', '!**/node_modules/**/*.*', '!**/_story/**/*.scss'])
        .pipe(through2.obj(
            function (chunk, enc, cb) {
                const rootPath = path.join(__dirname, '../../');
                const scssVarStr = `@import "${rootPath}/packages/semi-theme-default/scss/index.scss";\n`;
                const cssVarStr = `@import "${rootPath}/packages/semi-theme-default/scss/global.scss";\n`;
                const scssBuffer = Buffer.from(scssVarStr);
                const buffers = [scssBuffer];
                if (/_base\/base\.scss/.test(chunk.path)) {
                    buffers.push(Buffer.from(cssVarStr));
                }
                chunk.contents = Buffer.concat([...buffers, chunk.contents]);
                cb(null, chunk);
            }
        ))
        .pipe(sass({
            importer: (url, prev) => {
                const rootPath = path.join(__dirname, '../../');
                let realUrl = url;
                if (/~@douyinfe\/semi-foundation/.test(url)) {
                    const semiUIPath = path.join(rootPath, 'packages/semi-foundation');
                    realUrl = url.replace(/~@douyinfe\/semi-foundation/, semiUIPath);
                }
                return { url: realUrl };
            }
        }).on('error', sass.logError))
        .pipe(gulp.dest('lib/es'));
});

gulp.task('moveScss', function moveScss() {
    return gulp.src(['**/*.scss', '!**/node_modules/**/*.*', '!**/_story/**/*.scss'])
        .pipe(replace(/(@import\s+['"]~)(@douyinfe\/semi-foundation\/)/g, '$1@douyinfe/semi-foundation/lib/es/'))
        .pipe(gulp.dest('lib/es'));
});

gulp.task('compileLib', gulp.series(['cleanLib', 'compileScss', 'moveScss', 'compileTSX']));

