'use strict';

var gulp               = require('gulp');
var beeper             = require('beeper');
var pug                = require('gulp-pug');
var sass               = require('gulp-sass');
var rename             = require("gulp-rename");
var plumber            = require('gulp-plumber');
var cleanCSS           = require('gulp-clean-css');
var autoprefixer       = require('gulp-autoprefixer');
var b_sync             = require('browser-sync').create();


var onError = function(err) {
    beeper(3);
    this.emit('end');
    console.log(err);
};

gulp.task('pug', function() {
  return gulp.src('src/pug/*.pug')
  .pipe(plumber({ errorHandler: onError }))
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest('public'));
});

gulp.task('sass', function() {
  return gulp.src('src/sass/**/*.scss')
  .pipe(plumber({ errorHandler: onError }))
  .pipe(sass())
  .pipe(gulp.dest('public/_assets/css'));
});

gulp.task('sass_build', function() {
  return gulp.src('src/sass/**/*.scss')
  .pipe(plumber({ errorHandler: onError }))
  .pipe(sass())
  .pipe(autoprefixer({
    browsers: ['last 5 versions'],
    cascade: false}))
  .pipe(cleanCSS())
  .pipe(rename({ suffix: '.min'}))
  .pipe(gulp.dest('public/_assets/css'));
});

gulp.task('default', function() {
  console.log("Use 'gulp build' command to initialize the project files");
});


gulp.task('build', function() {
  gulp.start('sass_build', 'pug');
});

gulp.task('watch', function() {
  gulp.watch('src/sass/**/*.scss',  ['sass']);
  gulp.watch('src/pug/*.pug',    ['pug']);

// init server
  b_sync.init({
    server: {
      // proxy: "local.build",
      baseDir: "public"
    }
  });
  gulp.watch(['public/**'], b_sync.reload);
});