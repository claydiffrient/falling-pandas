import gulp from 'gulp';
import mocha from 'gulp-mocha';
import semistandard from 'gulp-semistandard';
import gls from 'gulp-live-server';
import apidoc from 'gulp-apidoc';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';

var server = gls.new('./bin/run');

/**
 * Pipes all JS files from the server source directory
 * through babel and copies the resulting files to the
 * compiled server directory.
 */
gulp.task('babel:server', () => {
  return gulp.src('src/server/**/*.js')
             .pipe(sourcemaps.init())
             .pipe(babel())
             .pipe(sourcemaps.write('.'))
             .pipe(gulp.dest('compiled/server'));
});

gulp.task('lint', () => {
  return gulp.src(['src/**/*.js', 'gulpfile.js'])
             .pipe(semistandard())
             .pipe(semistandard.reporter('default', {
               breakOnError: true
             }));
});

gulp.task('test:server', ['babel:server', 'babel:test'], () => {
  return gulp.src('compiled/test/server/**/*.js')
             .pipe(mocha());
});

gulp.task('test', ['lint', 'test:server']);

/**
 * Watches the server source directory for changes and
 * triggers the babel:server task
 */
gulp.task('watch:server', () => {
  var jsWatcher = gulp.watch('src/server/**/*.js', ['babel:server', 'docs']);
  var viewWatcher = gulp.watch('src/server/views/**/*.handlebars', ['copy:server:views']);
  var notify = (event) => {
    server.stop();
    server.start();
    // server.notify(event);
  };
  jsWatcher.on('change', notify);
  viewWatcher.on('change', notify);
});

gulp.task('docs:api', () => {
  return apidoc.exec({
    src: 'src/server/routes/api',
    dest: 'docs/api'
  });
});

gulp.task('build', ['babel:server']);

gulp.task('serve', ['build'], () => {
  server.start();
});

gulp.task('docs', ['docs:api']);

gulp.task('default', ['build', 'serve', 'watch:server', 'docs']);
