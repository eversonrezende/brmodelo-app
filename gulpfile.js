"use strict";
const { series, parallel } = require('gulp');

const gulp = require("gulp")
const sass = require("gulp-sass")
const sourcemaps = require("gulp-sourcemaps")
const autoprefixer = require("gulp-autoprefixer")
const gls = require("gulp-live-server")
const del = require("del")

// Sass variables
const input = "./app/sass/*.scss"
const output = "./app/css/"
const sassOptions = {
	errLogToConsole: true,
	outputStyle: "expanded"
}

////////////////////////////////////////////////////////////////////////////////
//  Clear compiled files
////////////////////////////////////////////////////////////////////////////////
function clean() {
	return del(['./dist/', './assets/', './build/']);
}

////////////////////////////////////////////////////////////////////////////////
// Compile CSS task
////////////////////////////////////////////////////////////////////////////////
function scss(){
	return gulp
	.src(input)
	.pipe(sourcemaps.init())
	.pipe(sass(sassOptions).on("error", sass.logError))
	.pipe(sourcemaps.write())
	.pipe(autoprefixer())
	.pipe(gulp.dest(output))
}

////////////////////////////////////////////////////////////////////////////////
// Copy files to libs/
////////////////////////////////////////////////////////////////////////////////
function copyToLibs() {
	const files = [
		"node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js",
		"node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js",
		"node_modules/angular/angular.min.js",
		"node_modules/angular/angular.min.js.map",
		"node_modules/angular-ui-router/release/angular-ui-router.min.js",
		"node_modules/angular-ui-router/release/angular-ui-router.min.js.map",
		"node_modules/angular-cookies/angular-cookies.min.js",
		"node_modules/angular-cookies/angular-cookies.min.js.map",
		"node_modules/textangular/dist/textAngular-rangy.min.js",
		"node_modules/textangular/dist/textAngular-sanitize.min.js",
		"node_modules/textangular/dist/textAngular.min.js",
		"node_modules/textangular/dist/textAngular.css"
	];

	return gulp
	.src(files)
	.pipe(gulp.dest('./build/libs'))
}

////////////////////////////////////////////////////////////////////////////////
// Copy files to joint/
////////////////////////////////////////////////////////////////////////////////
function copyToJoint() {
	const files = [
		"node_modules/jquery/dist/jquery.min.js",
		"node_modules/jquery/dist/jquery.min.map"
	];

	return gulp
	.src(files)
	.pipe(gulp.dest('./build/joint'))
}

////////////////////////////////////////////////////////////////////////////////
// Copy bootstrap files
////////////////////////////////////////////////////////////////////////////////
function copyToBootstrap() {
	const files = [
		"node_modules/bootstrap/dist/**/*"
	];

	return gulp
	.src(files)
	.pipe(gulp.dest('./build/bootstrap'))
}

////////////////////////////////////////////////////////////////////////////////
// Copy jquery-nice-select files
////////////////////////////////////////////////////////////////////////////////
function copyToJqueryNiceSelect() {
	const files = [
		"node_modules/jquery-nice-select/**/*"
	];

	return gulp
	.src(files)
	.pipe(gulp.dest('./build/jquery-nice-select'))
}

////////////////////////////////////////////////////////////////////////////////
// Local server
////////////////////////////////////////////////////////////////////////////////
function server() {
	let server = gls.new("./server.js")
	server.start()
}

////////////////////////////////////////////////////////////////////////////////
// Watch task
////////////////////////////////////////////////////////////////////////////////
function watch() {
	gulp.watch(input, gulp.series(scss))
	.on('change', function(path) {
		console.log(`File ${path} was changed, running tasks...`);
	});
}

////////////////////////////////////////////////////////////////////////////////
// Export tasks
////////////////////////////////////////////////////////////////////////////////
exports.clean = clean;

exports.default = series(
	clean,
	scss,
	gulp.parallel(
		copyToLibs,
		copyToJoint,
		copyToBootstrap,
		copyToJqueryNiceSelect
	),
	gulp.parallel(
		watch,
		server
	)
);