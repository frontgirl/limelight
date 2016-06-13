
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var runSequence = require('run-sequence');
var expect = require('gulp-expect-file');
var spritesmith = require('gulp.spritesmith');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var svgSprite  = require('gulp-svg-sprite');

var npmDir = 'node_modules/';
var sassPaths = [
	npmDir
];

gulp.task('default', ['watch']);

gulp.task('sass', function(){
	gulp.src('./assets/styles/*.scss')
		.pipe(sass({
			paths: sassPaths,
			plugins: []
		}))
		.pipe(gulp.dest('./app/assets/styles/'))
});

gulp.task('sprite', function() {
	var spriteData =
		gulp.src('assets/images/*.png') // путь, откуда берем картинки для спрайта
			.pipe(spritesmith({
				padding: 30,
				imgName: 'sprite.png',
				cssName: 'png-sprite.scss'
			}));

	spriteData.img.pipe(gulp.dest('assets/styles/sprites/')); // путь, куда сохраняем картинку
	spriteData.css.pipe(gulp.dest('assets/styles/sprites/')); // путь, куда сохраняем стили
});

// svg sprite basic configuration example
config                  = {
	shape: {
		dimension       : {         // Set maximum dimensions
            maxWidth    : 20,
            maxHeight   : 20
        },
		spacing: {
			padding: 30
		}
	},
	mode                : {
		view            : {         // Activate the «view» mode
			bust        : false,
			render      : {
				scss    : true      // Activate Sass output (with default options)
			}
		}
	}
};
gulp.task('svg-sprite', function() {
	return gulp.src('**/*.svg', {cwd: 'assets/images/'})
		.pipe(svgSprite(config))
		.pipe(gulp.dest('assets/styles/sprites/'));
});

gulp.task('copy', function () {
	var copyPaths = [
		/* Fonts section */
		{src: 'assets/fonts/**/*', dest: 'app/assets/fonts/'},
		/* Sprites  */
		{src: 'assets/styles/sprites/view/svg/*', dest: 'app/assets/styles/sprites'},
		{src: 'assets/styles/sprites/sprite.png', dest: 'app/assets/styles/sprites'}
	];

	for (var i in copyPaths) {
		var prop = copyPaths[i];
		gulp.src(prop.src).pipe(gulp.dest(prop.dest));
	}

	return gulp;
});

gulp.task('concat', function () {
	var pack = [
		/* jQuery section */
		npmDir + 'jquery/dist/jquery.min.js',
		'assets/js/main.js',
	];

	return gulp.src(pack)
		.pipe(expect(pack))
		.pipe(concat('app.js'))
		.pipe(gulp.dest('app/assets/js'))
		.pipe(rename('app.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/assets/js'));
});

gulp.task('minify-css', function() {
	return gulp.src('app/assets/styles/*.css')
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(gulp.dest('app/assets/styles/'))
});




gulp.task('watch', function () {
	gulp.watch(['assets/styles/**/*', 'assets/styles/*'], ['sass']);
});

gulp.task('dist', function () {
	return runSequence(
		['sass'],           // queue 1
		[ 'copy', 'sprite', 'svg-sprite', 'concat'], // queue 2
		['minify-css'] // queue 3
	);
});