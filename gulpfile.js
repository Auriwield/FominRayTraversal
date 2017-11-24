'use strict';

const gulp = require('gulp');
const debouncy = require('debouncy');
const pug = require('gulp-pug');

const browserSync = require('browser-sync').create();
const nodemon = require('gulp-nodemon');
const bro = require("gulp-bro");
const babelify = require("babelify");
const notifier = require('node-notifier');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json', {noImplicitAny: true});
const longReporter = ts.reporter.longReporter();

const notifyFn = debouncy((err) => {
    // noinspection JSUnresolvedFunction
    notifier.notify({title: "Typescript error", message: err.message});
}, 1000, true);

const reporter = {
    error: (error, ts) => {
        notifyFn(error);
        longReporter.error(error, ts);
    },
    finish: longReporter.finish
};

const serverPort = process.env.PORT || 8080;

//const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

gulp.task('css', () => {
    return gulp.src('src/css/**/*.css', {since: gulp.lastRun('css')})
        .pipe(gulp.dest('dist/public/css'));
});

gulp.task('view', () => {
    return gulp.src('src/views/index.pug')
        .pipe(pug())
        .pipe(gulp.dest('dist/public'));
});

gulp.task("typescript:convert-to-js", () => {
    return gulp.src('src/ts/**/*.ts')
        .pipe(tsProject(reporter))
        .js
        .pipe(gulp.dest('dist/temp'))
});

gulp.task("typescript:browserify", () => {
    return gulp.src('dist/temp/app.js')
        .pipe(bro({
            transform: [
                babelify.configure({ presets: ['es2015'] })
            ]
        }))
        .pipe(gulp.dest('dist/public/js'));
});

gulp.task('typescript', gulp.series("typescript:convert-to-js", "typescript:browserify"));

gulp.task('build', gulp.parallel(['view', 'css', 'typescript']));

gulp.task('watch', (done) => {
    gulp.watch('src/css/**/*.css', {ignoreInitial: false}, gulp.series('css'));
    gulp.watch('src/views/**.pug', {ignoreInitial: false}, gulp.series('view'));
    gulp.watch('src/ts/**/*.ts', {ignoreInitial: false}, gulp.series('typescript'));
    done();
});

gulp.task('serve', () => {
    browserSync.init(null, {
        proxy: `http://localhost:${serverPort}`,
        browser: 'google chrome',
    });

    browserSync.watch('dist/public/**/*.*', null).on('change', browserSync.reload);
});

gulp.task('nodemon', (cb) => {
    let callbackCalled = false;
    return nodemon({
        script: './bin/www.js',
        env: {'PORT': serverPort},
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
        ))
);

gulp.task('default', gulp.series('dev'));

