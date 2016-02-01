// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var karma = require('gulp-karma');

var testFiles = [
  'client/todo.js',
  'client/todo.util.js',
  'client/todo.App.js',
  'test/client/*.js'
];

var paths = {
    scripts: ['./js/*.js','!./js/lib*'],
    karma: './karma.conf.js'
};

// Lint Task
gulp.task('lint', function() {
    return gulp.src(paths.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('karma',['lint'],function() {
    // Be sure to return the stream
    //return gulp.src(paths.scripts)
    return gulp.src('blop')
        .pipe(karma({
            configFile: paths.karma,
            browsers: ['PhantomJS']
        }))
        .on('error', function(err) {
            // Make sure failed tests cause gulp to exit non-zero
            throw err;
        });
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['lint','karma']);
    //gulp.watch('scss/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['lint','karma','watch']);
