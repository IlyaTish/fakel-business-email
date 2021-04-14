const gulp         = require('gulp'),
      sass         = require('gulp-sass'),
      pug          = require('gulp-pug'),
      inky         = require('inky'),
      inlineCss    = require('gulp-inline-css'),
      inlinesource = require('gulp-inline-source'),
      browserSync  = require('browser-sync').create();


const PATHS = {
  src: './src/',
  pug: './src/templates/**/*.html',
  styles: {
    src:  './src/assets/sass/**/**/*.sass',
    dest: './src/assets/css/'
  }
}


function reload() {
  browserSync.reload();
}


// STYLES

gulp.task('styles', () => {
  console.log('\n' + '* Компиляция sass *');
  return gulp.src(PATHS.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(PATHS.styles.dest))
});


// CONVERTE INKY

gulp.task('inky', () => {
  console.log('\n' + '* Конвертирование inky шаблонов *');
  return gulp.src(PATHS.pug)
    .pipe(pug({
      pretty: true,
      basedir: PATHS.src
    }))
    .pipe(inlinesource())
    .pipe(inky())
    .pipe(inlineCss({
      preserveMediaQueries: true,
      removeLinkTags: false
    }))
    .pipe(gulp.dest('./dist'))
});


// WATCH

gulp.task('watch', () => {
  console.log('\n' + '* Отслеживание html/sass/css *');
  browserSync.init({
    server: {
      baseDir: [ 'dist' ],
      index:   'index.html'
    },
    port: 3000
  });

  gulp.watch('./src/assets/sass/**/**/*.sass',
    gulp.series('styles', 'inky')
  )
  .on('change', browserSync.reload);

  gulp.watch('./src/templates/**/*.html',
    gulp.series('inky')
  ).on('change', browserSync.reload)
});

gulp.task('default', gulp.series('watch'));
