import gulp from 'gulp';
import browserSync from 'browser-sync';
import rename from 'gulp-rename';
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import eslint from 'gulp-eslint';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import streamify from 'gulp-streamify';
import uglify from 'gulp-uglify';

const server = browserSync.create();

const styles = () => {
    const plugins = [autoprefixer(), cssnano()];

    return (
        gulp.src(['./src/scss/main.scss', './src/scss/theme.scss'])
            .pipe(gulp.dest('./dist/css'))
            .pipe(postcss(plugins))
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest('./dist/css'))
            .pipe(server.stream())
    );
};

const scripts = () => browserify({
    entries: './index.js',
    standalone: 'FunnelGraph'
}).transform(babelify, { presets: ['@babel/preset-env'] })
    .bundle()
    .pipe(source('funnel-graph.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(streamify(uglify()))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/js'))
    .pipe(server.stream());

const scriptsLint = () => gulp.src('./src/js/*.js')
    .pipe(eslint())
    .pipe(eslint.format());
const watchHTML = () => gulp.watch('./*.html').on('change', server.reload);
const watchScripts = () => gulp.watch('./src/js/*.js', gulp.series('scriptsLint', 'scripts'));
const watchStyles = () => gulp.watch('./src/scss/**/*.scss', gulp.series('stylesLint', 'styles'));

const compile = gulp.parallel(scripts);

export {
    styles,
    scripts,
    scriptsLint,
    watchHTML,
    watchScripts,
    watchStyles
};

export default compile;
