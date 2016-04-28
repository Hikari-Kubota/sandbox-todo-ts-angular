// gulp and plugins
import gulp from 'gulp';
import changed from 'gulp-changed';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
// build scripts
import browserify from 'browserify';
import watchify from 'watchify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import uglify from 'gulp-uglify';
// build stylesheets
import sass from 'gulp-sass';
import minify from 'gulp-minify-css';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';


const config = {
  src: './src',
  dest: './dist',
  jsDir: '/scripts',
  sassDir: '/styles',
  cssDir: '/styles',
  bsDir: './node_modules/bootstrap-sass/assets/stylesheets'
};

gulp.task('browserify', function() {
  return jscompile();
});

gulp.task('watchify', function() {
  return jscompile(true);
});

function jscompile(isWatch = false) {
  let bundler;
  if (isWatch) {
    bundler = watchify(browserify(`${config.src}${config.jsDir}/Main.ts`, {
      debug: true
    }).plugin('tsify'));
  } else {
    bundler = browserify(`${config.src}${config.jsDir}/Main.ts`, {
      debug: true
    }).plugin('tsify');
  }

  function rebundle() {
    return bundler
      .bundle().on('error', function (err) {
        console.log('Error : ' + err.message);
      })
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(`${config.dest}${config.jsDir}`));
  }
  bundler.on('update', function() {
    rebundle();
  });
  bundler.on('log', function(message) {
    console.log(message);
  });
  return rebundle();
}

gulp.task('css', () => {
  return gulp.src(config.src + config.sassDir + '/main.scss')
    .pipe(plumber())
    .pipe(changed(config.dest + config.cssDir))
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: [config.src + config.sassDir, config.bsDir]
    }).on('error', sass.logError))
    .pipe(postcss([autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9', 'Android >= 4.2']
    })]))
    .pipe(rename('app.css'))
    .pipe(minify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.dest + config.cssDir));
});

gulp.task('watch', ['css', 'watchify'], function() {
  gulp.watch([config.src + config.sassDir + '/*.scss'], ['css']);
});

gulp.task('watch:css', ['css'], function() {
  gulp.watch([config.src + config.sassDir + '/*.scss'], ['css']);
});

gulp.task('watch:js', ['watchify']);

gulp.task('default', ['watch']);

gulp.task('build', ['browserify', 'css']);
