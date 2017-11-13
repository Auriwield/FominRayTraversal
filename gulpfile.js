'use strict';

const gulp = require('gulp');
const pug = require('gulp-pug');

const browserSync = require('browser-sync').create();
const nodemon = require('gulp-nodemon');

const notify = require('gulp-notify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');

const serverPort = process.env.PORT || 8080;
//const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

gulp.task('css', function () {
    return gulp.src('src/css/**/*.css', { since: gulp.lastRun('css') })
               .pipe(gulp.dest('dist/public/css'));
});

gulp.task('view', function () {
    return gulp.src('src/views/index.pug')
               .pipe(pug())
               .pipe(gulp.dest('dist/public'));
});

gulp.task('typescript', function () {

    let errorHandler = err => {
        return {
            title: err.name,
            message: err.message
        };
    };

    // noinspection JSUnresolvedFunction
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/ts/app.ts'],
        cache: {},
        packageCache: {},
    })
        .plugin(tsify)
        .bundle()
        .on('error', notify.onError(errorHandler))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dist/public/js'));
});

gulp.task('build', gulp.parallel(['view', 'css', 'typescript']));

gulp.task('watch', function () {
    gulp.watch('src/css/**/*.css', gulp.series('css'));
    gulp.watch('src/views/index.pug', gulp.series('view'));
    gulp.watch('src/ts/**/*.ts', gulp.series('typescript'));
});

gulp.task('serve', function () {
    browserSync.init(null, {
        proxy: `http://localhost:${serverPort}`,
        browser: 'google chrome',
    });

    browserSync.watch('dist/public/**/*.*', null).on('change', browserSync.reload);
});

gulp.task('nodemon', function (cb) {
    let callbackCalled = false;
    return nodemon({
        script: './bin/www.js',
        env: { 'PORT': serverPort },
        ignore: [
            '.git',
            'node_modules/**/node_modules',
        ],
        watch: [
            'bin/',
        ],
    }).on('start', function () {
        if (!callbackCalled) {
            callbackCalled = true;
            cb();
        }
    });
});

gulp.task('dev',
    gulp.series('build',
        gulp.parallel('watch',
            gulp.series('nodemon', 'serve')
        )));

gulp.task('default', gulp.series('dev'));

