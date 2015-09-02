var gulp = require('gulp');
var browserify = require('gulp-browserify');
var source = require('vinyl-source-stream');
var fs = require('fs');
var wrapper = require('gulp-wrapper');
var uglify = require ('gulp-uglify');
var rename = require("gulp-rename");

console.log(uglify);

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


gulp.task('default', ['storage-hub']);
// .pipe(uglify())
//echo '<script>' > widget/storageHub.htm; browserify -g uglifyify js/hub.js >> widget/storageHub.htm; echo '</script>' >> widget/storageHub.htm
