var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var fs = require('fs');
var path = require('path');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
// Variables des chemins
var source = 'src'; // dossier de travail
var destination = 'dist'; // dossier à livrer
var scriptsPath = source;
function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function(file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

// Les tâches

gulp.task('js', function() {
    var folders = getFolders(scriptsPath);

     folders.map(function(folder) {
        return gulp.src(path.join(scriptsPath, folder, '/**/*.js'))
        // concat into foldername.js
            .pipe(concat(folder + '.js'))
            // write to output
            .pipe(gulp.dest(destination + "/js/"))
            // minify
            .pipe(uglify())
            // rename to folder.min.js
            .pipe(rename(folder + '.min.js'))
            // write to output again
            .pipe(gulp.dest(destination + "/js/"));
    });

});

gulp.task('css', function() {
    var folders = getFolders(scriptsPath);

    folders.map(function(folder) {
        return gulp.src(path.join(scriptsPath, folder, '/**/*.css'))
            .pipe(plugins.csso())
            .pipe(concat(folder + '.css'))
            // write to output
            .pipe(gulp.dest(destination + "/css/"))

            // rename to folder.min.js
            .pipe(rename(folder + '.min.css'))
            .pipe(gulp.dest(destination + '/css/'));
    });

});

gulp.task('scss', function() {
    var folders = getFolders(scriptsPath);

    folders.map(function(folder) {

        return gulp.src(path.join(scriptsPath, folder, '/**/*.scss'))
            .pipe(plugins.sass())
            .pipe(plugins.csscomb())
            .pipe(plugins.cssbeautify({indent: '  '}))
            .pipe(rename({dirname: ''}))
            .pipe(gulp.dest(source + '/' + folder + '/css/'));
    });

});
// Tâche "build" qui execute toutes les tâches
gulp.task('build', [ 'js', 'scss' , 'css']);

gulp.task('watch', function () {

    gulp.watch(source + '/**/scss/*.scss', ['scss']);
    gulp.watch(source + '/**/css/*.css', ['css']);
    gulp.watch(source + '/**/js/*.js', ['js']);
});

// Tâche par défaut
gulp.task('default', ['build']);