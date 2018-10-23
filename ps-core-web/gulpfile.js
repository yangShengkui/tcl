var gulp = require('gulp');

var plumber = require('gulp-plumber'); //处理gulp异常
var ngAnnotate = require('gulp-ng-annotate'); //解决Ag依赖注入的问题
var jshint = require('gulp-jshint'); //校验JS语法

var cleanCSS = require('gulp-clean-css'); //压缩css文件
var uglify = require('gulp-uglify'); //压缩JS
var imagemin = require('gulp-imagemin'); //压缩图片
var htmlmin = require('gulp-htmlmin'); //压缩HTML
var less = require('gulp-less'); //将less文件编译成css
var stripDebug = require('gulp-strip-debug'); //去掉debugg信息和console

var replace = require('gulp-replace'); //替换文件
var rename = require('gulp-rename'); //文件更名

var sourceMap = require("gulp-sourcemaps");

var del = require('del'); //删除

var config = {
  exclude: ['!bower_components/**', '!node_modules/**', '!release/**', '!gulpfile.js'],
  uglifyexclude: ['!bower_components/**', '!node_modules/**', '!release/**', '!gulpfile.js', '!app-editor3/**', '!solution/**', '!ps-core/**'],
  outDir: 'release',
  mapDir: 'map',
  devDir: 'css',
  configDir: ['**/fonts/**', '**/localdb/**', '**/ckplayer/**', '**/assets/**'],
  libDir: ['**/node_modules/**','**/app-editor3/**','**/solution/**']
}

//删除已发布内容
gulp.task('clean', function() {
  return del(config.outDir);
});

//编译第三方的less到css目录
gulp.task('less-public', function() {
  return gulp.src(['./less/**/free-board.less','./less/**/AdminLTE.less', './less/**/skins/*.less', './less/**/dashboard.less', './less/**/displayMain.less', './less/**/theme/*.less'].concat(config.exclude))
    .pipe(plumber())
    .pipe(less()) //执行less编译
    .pipe(gulp.dest(config.devDir))
});

//编译项目内的less到css目录，并且修改名称
gulp.task('less-private', function() {
  return gulp.src(['./app-*/**/*.less'].concat(config.exclude))
    .pipe(plumber())
    .pipe(less()) //执行less编译
    .pipe(rename(function(path) {
      path.dirname = path.dirname.replace('/less', '/css')
    }))
    .pipe(gulp.dest('./'))
});

//压缩所有目录下的CSS文件
gulp.task('minify-css', ['less-public', 'less-private'], function() {
  return gulp.src(['**/*.css'].concat(config.exclude))
    .pipe(sourceMap.init())
    .pipe(plumber())
    .pipe(cleanCSS({ rebase : false }))
    .pipe(sourceMap.write(config.mapDir, { addComment : true }))
    .pipe(gulp.dest(config.outDir));
});

//复制所有目录下的CSS文件
gulp.task('copy-css', ['less-public', 'less-private'], function() {
  return gulp.src(['**/*.css'].concat(config.exclude))
    .pipe(plumber())
    .pipe(gulp.dest(config.outDir));
});

//压缩所有目录下的JS文件
gulp.task('minify-js', function() {
  return gulp.src(['**/*.js'].concat(config.uglifyexclude))
    .pipe(sourceMap.init())
    .pipe(plumber())
    .pipe(stripDebug())
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(sourceMap.write(config.mapDir, { addComment : true }))
    .pipe(gulp.dest(config.outDir));
});

//复制所有目录下的JS文件
gulp.task('copy-js', function() {
  return gulp.src(['**/*.js'].concat(config.exclude))
    .pipe(plumber())
    .pipe(ngAnnotate())
    .pipe(gulp.dest(config.outDir));
});

//压缩所有目录下的资源文件，包括图片和视频和文档
gulp.task('minify-assets', function() {
  return gulp.src(['**/*.jpg', '**/*.png', '**/*.gif', '**/*.svg'].concat(config.exclude))
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(config.outDir))
});

gulp.task('copy-output', function() {
  return gulp.src(['**/ps-core/**/*.js'])
    .pipe(plumber())
    .pipe(ngAnnotate())
    .pipe(gulp.dest(config.outDir));
});

//复制所有目录下的资源文件
gulp.task('copy-assets', function() {
  return gulp.src(['**/*.jpg', '**/*.png', '**/*.gif', '**/*.svg'].concat(config.exclude))
    .pipe(plumber())
    .pipe(gulp.dest(config.outDir))
});

//压缩所有目录下的HTML文件
gulp.task('minify-html', function() {
  return gulp.src(['**/*.html'].concat(config.exclude))
    .pipe(plumber())
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(config.outDir))
});

//复制所有目录下的HTML文件
gulp.task('copy-html', function() {
  return gulp.src(['**/*.html'].concat(config.exclude))
    .pipe(plumber())
    .pipe(gulp.dest(config.outDir))
});

//复制指定目录下的配置文件
gulp.task('copy-configs', function() {
  return gulp.src(config.configDir.concat(config.exclude))
    .pipe(plumber())
    .pipe(gulp.dest(config.outDir))
});

//复制指定目录下的libs文件
gulp.task('copy-libs', function() {
  return gulp.src(config.libDir)
    .pipe(plumber())
    .pipe(gulp.dest(config.outDir))
});

gulp.task('daily-version', ['copy-js', 'copy-output'], function() {
  return gulp.src([config.outDir + '/**/js/main.js'])
    .pipe(plumber())
    .pipe(replace('==version==', (new Date()).getTime()))
    .pipe(gulp.dest(config.outDir));
});

gulp.task('release-version', ['minify-js', 'copy-output'], function() {
  return gulp.src([config.outDir + '/**/js/main.js'])
    .pipe(plumber())
    .pipe(replace('==version==', (new Date()).getTime()))
    .pipe(gulp.dest(config.outDir));
});

gulp.task('daily', ['clean'], function() {
  gulp.start('daily-version', 'copy-configs', 'copy-libs','copy-css', 'copy-assets', 'copy-html');
});

gulp.task('release', ['clean'], function() {
  gulp.start('release-version', 'copy-configs', 'copy-libs','minify-css', 'copy-assets', 'copy-html');
});

gulp.task('product', ['clean'], function() {
  gulp.start('release-version', 'copy-configs', 'copy-libs','minify-css', 'minify-assets', 'copy-html');
});