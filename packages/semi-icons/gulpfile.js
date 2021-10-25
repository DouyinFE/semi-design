const path = require('path');
const { Buffer } = require('buffer');
const through2 = require('through2');
const gulp = require('gulp');
const merge2 = require('merge2');
const gulpBabel = require('gulp-babel');
const gulpTS = require('gulp-typescript');
const sass = require('gulp-sass')(require('sass'));
const replace = require('gulp-replace');
const del = require('del');
const tsConfig = require('./tsconfig.json');
const babelConfig = require('./babel.config');

gulp.task('cleanLib', function cleanLib() {
    return del(['lib/**/*']);
});

gulp.task('compileTSX', function compileTSX() {
    const tsStream = gulp.src(['src/**/*.tsx', 'src/**/*.ts'])
        .pipe(gulpTS({
            ...tsConfig.compilerOptions,
            rootDir: path.join(__dirname, '..')
        }));
    const jsStream = tsStream.js
        .pipe(gulpBabel(babelConfig))
        .pipe(replace(/(import\s+)['"]([^'"]+)(\.scss)['"]/, '$1\'$2.css\''))
        .pipe(gulp.dest('lib/es'));
    const dtsStream = tsStream.dts.pipe(gulp.dest('lib/es'));
    return merge2([jsStream, dtsStream]);
});

gulp.task('compileScss', function compileScss() {
    return gulp.src(['src/**/*.scss'])
        .pipe(through2.obj(
            function (chunk, enc, cb) {
                const rootPath = path.join(__dirname, '../../');
                const scssVarStr = `@import "${rootPath}/packages/semi-theme-default/scss/index.scss";\n`;
                const scssBuffer = Buffer.from(scssVarStr);
                const buffers = [scssBuffer];
                chunk.contents = Buffer.concat([...buffers, chunk.contents]);
                cb(null, chunk);
            }
        ))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('lib/es'));
});

gulp.task('moveScss', function moveScss() {
    return gulp.src(['src/**/*.scss'])
        .pipe(gulp.dest('lib/es'));
});

gulp.task('compileLib', gulp.series(['cleanLib', 'compileScss', 'compileTSX', 'moveScss']));

