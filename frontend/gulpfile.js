var gulp = require('gulp');
var clean = require('gulp-clean');
const sass = require('gulp-sass')(require('sass'));
var pug = require('gulp-pug');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var $ = require('gulp-load-plugins')();
var autoprefixer = require('autoprefixer');
var mq4HoverShim = require('mq4-hover-shim');
var rimraf = require('rimraf').sync;
var browser = require('browser-sync');
var concat = require('gulp-concat');
var javascriptObfuscator = require('gulp-js-obfuscator');
var port = process.env.SERVER_PORT || 8080;
var nodepath = 'node_modules/';

/*
 * Directories here
 */
var paths = {
    public: '../site/www_mk/',
    dev: './dev/',
    sass: './dev/styles/',
    css: './dist/assets/css/',
    data: './dev/markup/_data/',
    node: './node_modules/',
};

var bootstrapPaths = ['./node_modules/bootstrap/scss'];

// Starts a BrowerSync instance
gulp.task('server', () => {
    browser.init({ server: paths.public });
});

// Watch files for changes
gulp.task('watch', () => {
    // gulp.watch(paths.sass +'**/*', ['compile-scss', browser.reload]);
    gulp.watch(paths.dev + 'assets/js/**/*', gulp.series('copy-js'));
    gulp.watch(paths.dev + 'assets/fonts/**/*', gulp.series('copy-fonts'));
    gulp.watch(paths.dev + 'assets/css/**/*', gulp.series('copy-css'));
    gulp.watch(paths.dev + 'assets/images/**/*', gulp.series('copy-images'));
    gulp.watch(paths.dev + 'assets/vendors/**/*', gulp.series('compile-js'));
    gulp.watch(paths.sass + '**/*', gulp.series('compile-sass'));
    gulp.watch(paths.dev + 'markup/**/*', gulp.series('compile-pug'));
});

// Erases the dist folder
gulp.task('reset', () => {
    rimraf(paths.public + '*');
    return Promise.resolve('the value is ignored');
});

// Copy Bootstrap filed into core development folder
gulp.task('setupBootstrap', () => {
    //Get Bootstrap from node modules
    gulp.src([nodepath + 'bootstrap/scss/*.scss']).pipe(
        gulp.dest(paths.sass + 'core/')
    );
    return gulp
        .src([nodepath + 'bootstrap/scss/**/*.scss'])
        .pipe(gulp.dest(paths.sass + 'core/'));
});

//Theme Sass variables
var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'compressed',
};

// Compile bootstrap and Theme Sass
gulp.task('compile-sass', function () {
    var processors = [
        mq4HoverShim.postprocessorFor({
            hoverSelectorPrefix: '.is-true-hover ',
        }),
        autoprefixer({
            Browserslist: [
                'Chrome >= 45',
                'Firefox ESR',
                'Edge >= 12',
                'Explorer >= 10',
                'iOS >= 9',
                'Safari >= 9',
                'Android >= 4.4',
                'Opera >= 30',
            ],
        }), //,
        //cssnano(),
    ];
    //Watch me get Sassy

    return gulp
        .src(paths.sass + '*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.public + 'assets/css/'))
        .on('finish', browser.reload);
});

/**
 * Compile .pug files and pass in data from json file
 */

gulp.task('compile-pug', () => {
    return gulp
        .src(paths.dev + 'markup/pages/**/*.pug')
        .pipe(
            pug({
                pretty: true,
            })
        )
        .pipe(gulp.dest(paths.public))
        .on('finish', browser.reload);
});

// Compile js from node modules
gulp.task('compile-js', () => {
    return gulp
        .src([
            nodepath + 'jquery/dist/jquery.min.js',
            paths.dev + 'assets/vendors/**/*',
            nodepath + 'bootstrap/dist/js/bootstrap.min.js',
        ])
        .pipe(concat('vendors.js'))
        .pipe(gulp.dest(paths.public + 'assets/js/'))
        .on('finish', browser.reload);
});

//Copy Theme css to production site
gulp.task('copy-css', () => {
    return gulp
        .src(paths.dev + 'assets/css/**/*.css')
        .pipe(gulp.dest(paths.public + 'assets/css/'))
        .on('finish', browser.reload);
});

//Copy Theme fonts to production site
gulp.task('copy-fonts', () => {
    return gulp
        .src(paths.dev + 'assets/fonts/*')
        .pipe(gulp.dest(paths.public + 'assets/fonts/'))
        .on('finish', browser.reload);
});

//Copy Theme js to production site
gulp.task('copy-js', () => {
    return (
        gulp
            .src(paths.dev + 'assets/js/**/*.js')
            //.pipe(javascriptObfuscator({replaceNames: false}))
            .pipe(gulp.dest(paths.public + 'assets/js/'))
            .on('finish', browser.reload)
    );
});

//Copy images to production site
gulp.task('copy-images', () => {
    return gulp
        .src(paths.dev + 'assets/images/**/*')
        .pipe(gulp.dest(paths.public + 'assets/images/'))
        .on('finish', browser.reload);
});

gulp.task('init', gulp.parallel('setupBootstrap'));
gulp.task(
    'build',
    gulp.parallel(
        'copy-images',
        'copy-css',
        'copy-js',
        'copy-fonts',
        'compile-js',
        'compile-sass',
        'compile-pug'
    ),
    () => {
        done();
    }
);
gulp.task(
    'default',
    gulp.series('reset', 'build', gulp.parallel('server', 'watch'), () => {
        done();
    })
);
