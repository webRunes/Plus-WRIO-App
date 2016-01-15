require('babel/register');

var gulp = require('gulp');
var browserify = require('gulp-browserify');
var _browserify = require('browserify');
var source = require('vinyl-source-stream');
var fs = require('fs');
var wrapper = require('gulp-wrapper');
var uglify = require ('gulp-uglify');
var rename = require("gulp-rename");
var babelify = require('babelify');
var eslint = require('gulp-eslint');
var buffer = require('vinyl-buffer');
var mocha = require('gulp-mocha');

console.log(uglify);

gulp.task('test', function() {
    return gulp.src('test/**/*.js', {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({
            reporter: 'dot',
            timeout: 20000
        }))
        .once('error', function(err) {
            console.log(err);
            process.exit(1);
        })
        .once('end', function () {
            process.exit();
        });;
});

gulp.task('lint', function () {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(['js/**/*.js','!node_modules/**'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

/*gulp.task('test-bundle',function() {

    return _browserify({
        entries: 'test/index.js',
        debug: true
    })
        .transform(babelify)
        .bundle()
        .on('error', function(err) {
            console.log('Babel client:', err.toString());
        })
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./test'))


});
*/
gulp.task('storage-hub', function() {

    gulp.src('js/hub.js')
        .pipe(browserify({
            debug:true
        }))
        .pipe(uglify())
        .pipe(wrapper({
            header: '<script>',
            footer: '</script>'
        }))
        .pipe(rename('storageHub.htm'))
        .pipe(gulp.dest('./widget/'))
        .on('error', function(err) {
            console.log('Build error:', err.toString());
        })
});


gulp.task('default', ['lint', 'storage-hub']);
// .pipe(uglify())
//echo '<script>' > widget/storageHub.htm; browserify -g uglifyify js/hub.js >> widget/storageHub.htm; echo '</script>' >> widget/storageHub.htm
