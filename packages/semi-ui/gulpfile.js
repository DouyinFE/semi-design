const path = require('path');
const { Buffer } = require('buffer');
const through2 = require('through2');
const merge2 = require('merge2');
const gulp = require('gulp');
const gulpTS = require('gulp-typescript');
const gulpBabel = require('gulp-babel');
const replace = require('gulp-replace');
const del = require('del');
const tsConfig = require('./tsconfig.json');
const getBabelConfig = require('./getBabelConfig');
const { compileCssSource } = require('../../scripts/css-migration/compileCssSource');

gulp.task('cleanLib', function cleanLib() {
    return del(['lib/**/*']);
});

gulp.task('compileTSXForESM', function compileTSXForESM() {
    const tsStream = gulp.src(['**/*.tsx', '**/*.ts', '!**/node_modules/**/*.*', '!**/_story/**/*.*'])
        .pipe(gulpTS({
            ...tsConfig.compilerOptions,
            rootDir: path.join(__dirname, '..')
        }));
    const jsStream = tsStream.js
        .pipe(gulpBabel(getBabelConfig({ isESM: true })))
        .pipe(replace(/(import\s+)['"]@douyinfe\/semi-foundation\/([^'"]+)['"]/g, '$1\'@douyinfe/semi-foundation/lib/es/$2\''))
        .pipe(replace(/((?:import|export)\s+.+from\s+)['"]@douyinfe\/semi-foundation\/([^'"]+)['"]/g, '$1\'@douyinfe/semi-foundation/lib/es/$2\''))
        .pipe(replace(/(import\s+)['"]([^'"]+)(\.scss)['"]/g, '$1\'$2.css\''))
        .pipe(gulp.dest('lib/es'));
    const dtsStream = tsStream.dts
        .pipe(replace(/(import\s+)['"]@douyinfe\/semi-foundation\/([^'"]+)['"]/g, '$1\'@douyinfe/semi-foundation/lib/es/$2\''))
        .pipe(replace(/((?:import|export)\s+.+from\s+)['"]@douyinfe\/semi-foundation\/([^'"]+)['"]/g, '$1\'@douyinfe/semi-foundation/lib/es/$2\''))
        .pipe(replace(/(import\(['"])@douyinfe\/semi-foundation\/(.+)/g, '$1@douyinfe/semi-foundation/lib/es/$2'))
        .pipe(replace(/(import\s+)['"]([^'"]+)(\.scss)['"]/g, '$1\'$2.css\''))
        .pipe(gulp.dest('lib/es'));
    return merge2([jsStream, dtsStream]);
});

gulp.task('compileTSXForCJS', function compileTSXForCJS() {
    const tsStream = gulp.src(['**/*.tsx', '**/*.ts', '!**/node_modules/**/*.*', '!**/_story/**/*.*'])
        .pipe(gulpTS({
            ...tsConfig.compilerOptions,
            rootDir: path.join(__dirname, '..')
        }));
    const jsStream = tsStream.js
        .pipe(gulpBabel(getBabelConfig({ isESM: false })))
        .pipe(replace(/(require\(['"])@douyinfe\/semi-foundation\/([^'"]+)(['"]\))/g, '$1@douyinfe/semi-foundation/lib/cjs/$2$3'))
        .pipe(replace(/(require\(['"])([^'"]+)(\.scss)(['"]\))/g, '$1$2.css$4'))
        .pipe(gulp.dest('lib/cjs'));
    const dtsStream = tsStream.dts
        .pipe(replace(/(import\s+)['"]@douyinfe\/semi-foundation\/([^'"]+)['"]/g, '$1\'@douyinfe/semi-foundation/lib/cjs/$2\''))
        .pipe(replace(/((?:import|export)\s+.+from\s+)['"]@douyinfe\/semi-foundation\/([^'"]+)['"]/g, '$1\'@douyinfe/semi-foundation/lib/cjs/$2\''))
        .pipe(replace(/(import\(['"])@douyinfe\/semi-foundation\/(.+)/g, '$1@douyinfe/semi-foundation/lib/cjs/$2'))
        .pipe(replace(/(import\s+)['"]([^'"]+)(\.scss)['"]/g, '$1\'$2.css\''))
        .pipe(gulp.dest('lib/cjs'));
    return merge2([jsStream, dtsStream]);
});

// 编译 css 真源（嵌套 → 平面），保留 var(--semi-cssvar-*) 引用（token 由主题包运行时提供）
gulp.task('compileCss', function compileCss() {
    return gulp.src(['**/*.css', '!**/node_modules/**/*.*'])
        .pipe(through2.obj(function (chunk, enc, cb) {
            chunk.contents = Buffer.from(compileCssSource(chunk.contents.toString('utf-8')), 'utf-8');
            cb(null, chunk);
        }))
        .pipe(gulp.dest('lib/es'))
        .pipe(gulp.dest('lib/cjs'));
});

gulp.task('compileLib',
    gulp.series(
        [
            'cleanLib', 'compileCss',
            gulp.parallel('compileTSXForESM', 'compileTSXForCJS')
        ]
    )
);

