const gulp = require('gulp');
const clean = require('gulp-clean');
const { exec } = require('child_process');

// Removes previous dist
gulp.task('clean', () => {
  return gulp.src('./dist', { allowEmpty: true })
    .pipe(clean());
});

// Initial ts compile
gulp.task('tsc', cb => {
  exec('tsc', () => cb());
});

// Watch ts files and recompile
gulp.task('tsc-w', () => {
  const tsc = exec('tsc -w --preserveWatchOutput --pretty');

  tsc.stdout.on('data', data => console.log(data));
  tsc.stderr.on('data', data => console.error(data));

  tsc.on('close', code => console.log(`tsc exited with code ${code}`));
});

// Start express
gulp.task('express', () => {
  const tsc = exec('nodemon --watch ./src/server ./src/server/server.ts');
  tsc.stdout.on('data', data => console.log(data));
  tsc.stderr.on('data', data => console.error(data));
});

// Build all
gulp.task('build', gulp.series(
  'clean',
  'tsc',
));

// Heroku copy client files
gulp.task('heroku-copy-client', () => {
  return gulp.src([
    './src/client/build/**/*',
  ])
    .pipe(gulp.dest('./deploy/client'));
});

// Heroku copy non-client files
gulp.task('heroku-copy-non-client', () => {
  return gulp.src([
    './package.json',
    './package-lock.json',
    './Procfile',
    './dist/server/server.js',
  ])
    .pipe(gulp.dest('./deploy'));
});

// Heroku clean files
gulp.task('heroku-clean', () => {
  return gulp.src([
    './deploy',
  ], { allowEmpty: true })
    .pipe(clean());
});

// Heroku deploy
gulp.task('deploy', gulp.series(
  'heroku-clean',
  'build',
  'heroku-copy-client',
  'heroku-copy-non-client',
));

// Run all (without express)
gulp.task('dev', gulp.series(
  'build',
  gulp.parallel(
    'tsc-w',
  ),
));

// Run all together
gulp.task('default', gulp.series(
  'build',
  gulp.parallel(
    'tsc-w',
    'express',
  ),
));
