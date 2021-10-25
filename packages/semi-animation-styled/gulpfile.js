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

gulp.task('compileTS', function compileTSX() {
    const tsStream = gulp.src(['**/*.ts', '!_story/**/*.*', '!node_modules/**/*.*', '!lib/**/*.*'])
        .pipe(gulpTS(tsConfig.compilerOptions));
    const jsStream = tsStream.js
        .pipe(gulpBabel(babelConfig))
        .pipe(gulp.dest('lib/es'));
    const dtsStream = tsStream.dts.pipe(gulp.dest('lib/es'));
    return merge2([jsStream, dtsStream]);
});

gulp.task('compileScss', function compileScss() {
    return gulp.src(['**/*.css', '!_story/**/*.*', '!node_modules/**/*.*', '!lib/**/*.*'])
        .pipe(gulp.dest('lib/es'));
});

gulp.task('compileLib', gulp.series(['cleanLib', 'compileScss', 'compileTS']));

