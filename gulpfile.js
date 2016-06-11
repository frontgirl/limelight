
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var minify = require('gulp-minify');
var runSequence = require('run-sequence');
var expect = require('gulp-expect-file');
var spritesmith = require('gulp.spritesmith');

var npmDir = 'node_modules/';
var sassPaths = [
	npmDir
];

gulp.task('default', ['watch']);

gulp.task('sass', function(){
	gulp.src('./assets/styles/styles.sass')
		.pipe(sass({
			paths: sassPaths,
			plugins: []
		}))
		.pipe(gulp.dest('./app/assets/styles/'))
});

gulp.task('sprite', function() {
	var spriteData =
		gulp.src('./assets/images/sprite/*.*') // путь, откуда берем картинки для спрайта
			.pipe(spritesmith({
				imgName: 'sprite.png',
				cssName: 'sprite.css'
			}));

	spriteData.img.pipe(gulp.dest('./app/assets/images/')); // путь, куда сохраняем картинку
	spriteData.css.pipe(gulp.dest('./app/styles/')); // путь, куда сохраняем стили
});

gulp.task('concat', function () {
	var pack = [
		/* jQuery section */
		npmDir + 'jquery/dist/jquery.min.js'
	];

	return gulp.src(pack)
		.pipe(expect(pack))
		.pipe(concat('app.js'))
		.pipe(gulp.dest('./app/assets/js'));
});

gulp.task('minify-css', function() {
	return gulp.src('./app/assets/styles/*.css')
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(gulp.dest('dist'));
});

gulp.task('copy', function () {
	var copyCustomJs = [
		{src: './assets/js/*', dest: './app/assets/js/'}
	];

	for (var i in copyCustomJs) {
		var prop = copyCustomJs[i];
		gulp.src(prop.src).pipe(gulp.dest(prop.dest));
	}

	return gulp;
});

gulp.task('compress', function() {
	gulp.src('./app/assets/js/*.js')
		.pipe(minify({
			ext:{
				src:'-debug.js',
				min:'.js'
			},
			exclude: ['tasks'],
			ignoreFiles: ['.combo.js', '-min.js']
		}))
		.pipe(gulp.dest('dist'))
});

gulp.task('watch', function () {
	gulp.watch('./assets/styles/', ['sass']);
});

gulp.task('dist', function () {
	return runSequence(
		['sass'],           // queue 1
		['concat', 'copy', 'minify-css', 'compress', 'sprite'] // queue 2
	);
});