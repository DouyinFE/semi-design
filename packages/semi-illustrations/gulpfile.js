const path = require('path');
const gulp = require('gulp');
const gulpTS = require('gulp-typescript');
const gulpBabel = require('gulp-babel');
const merge2 = require('merge2');
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
        .pipe(gulp.dest('lib/es'));
    const dtsStream = tsStream.dts.pipe(gulp.dest('lib/es'));
    return merge2([jsStream, dtsStream]);
});

gulp.task('compileLib', gulp.series(['cleanLib', 'compileTSX']));

