'use strict';

var gulp        = require('gulp');
var elm         = require('gulp-elm');
var sass        = require('gulp-sass');
var cssmin      = require('gulp-cssmin');
var browserSync = require('browser-sync');
var prefix      = require('gulp-autoprefixer');
var electron    = require('electron-connect').server.create();

gulp.task('elm-init', elm.init);

/**
 * Copy html and css files to app directory.
 */
gulp.task("copy-assets", ['sass'], function() {
  return gulp.src(["src/*.html", "src/*.css"])
    .pipe(gulp.dest("app"))
    .pipe(browserSync.reload({stream:true}));
});

/**
 * Handle SCSS files.
 * Convert SCSS to CSS, minify all the files and add prefix.
 */
gulp.task('sass', function() {
    return gulp.src('src/style.scss')
        .pipe(sass({
            includePaths: ['css'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(cssmin())
        .pipe(gulp.dest('app'));
});

/**
 * Compile elm files to javascript.
 */
gulp.task('elm', ['elm-init', 'copy-assets'], function(){
  return gulp.src('src/*.elm')
    .pipe(elm.make({filetype: 'js'}))
    .pipe(gulp.dest('app/'))
    .pipe(browserSync.reload({stream:true}));
});

/**
 * Watch html and scss files for changes & copy them.
 * Watch Elm files, recompile them & reload BrowserSync.
 */
gulp.task('watch', function() {
    gulp.watch(['src/*.scss', 'src/*.html'], ['copy-assets']);
    gulp.watch('src/*.elm', ['elm']);
});

/**
 * Build the app without watch the files.
 * This task is created for build the app before
 * packageing it inside the electron dist apps.
 */
gulp.task('build', ['elm']);

/**
 * Default task, running just `gulp` will compile the sass,
 * html, and elm, launch BrowserSync & watch files in electron.
 */
gulp.task('default', ['elm', 'watch'], function() {
  // Start browser process
  electron.start();
});
