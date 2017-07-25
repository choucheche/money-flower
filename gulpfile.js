var gulp = require('gulp'),
/*
npm install gulp -g
npm install gulp --save-dev
*/

//删除文件，文件夹
del = require('del'),
/*
npm install del --save-dev
*/
//删除文件，文件夹结束

//修改代码后浏览器实时刷新，应用PC，手机，平板
browserSync = require("browser-sync"),
/*
npm install browser-sync --save-dev
*/
//修改代码后浏览器实时刷新，应用PC，手机，平板结束

//捕获处理任务中的错误，阻止watch中断，提示错误
plumber = require('gulp-plumber'),
/*
捕获处理任务中的错误,阻止watch中断
npm install gulp-plumber --save-dev
*/
notify = require('gulp-notify'),
/*
提示我们编译代码出现了错误
npm install gulp-notify --save-dev
*/
//捕获处理任务中的错误，阻止watch中断，提示错误结束

//html
htmlmin = require('gulp-htmlmin'),
/*
html压缩插件
npm install gulp-htmlmin --save-dev
*/

fileinclude = require('gulp-file-include'),
/*
include插件，合并html文件
npm install gulp-file-include --save
*/

rev = require('gulp-rev-append'),
/*
给html引入文件加版本号清除缓存
npm install gulp-rev-append --save-dev
*/
//html结束

//js
uglify = require('gulp-uglify'),
/*
js压缩插件
npm install gulp-uglify --save-dev
*/
jshint = require("gulp-jshint"),
/*
检查js错误
npm install jshint --save-dev
npm install gulp-jshint --save-dev
*/
//js结束

//css
cssmin = require('gulp-minify-css'),
/*
css压缩插件
npm install gulp-minify-css --save-dev
*/
cssver = require('gulp-make-css-url-version'),
/*
css里的链接加版本号
npm install gulp-make-css-url-version --save-dev
*/
autoprefixer = require('gulp-autoprefixer'),
/*
自动为css加兼容性前缀
npm install gulp-autoprefixer --save-dev
*/
//css结束

//图片压缩插件集合
imagemin = require('gulp-imagemin'),
/*
img压缩插件
npm install gulp-imagemin --save-dev
*/
pngquant = require('imagemin-pngquant'),
/*
加强img压缩性能插件
npm install imagemin-pngquant --save-dev
*/
cache = require('gulp-cache'),
/*
减少压缩图片的内存消耗
npm install gulp-cache --save-dev
只压缩修改的图片。压缩图片时比较耗时，在很多情况下我们只修改了某些图片，
没有必要压缩所有图片，使用”gulp-cache”只压缩修改的图片，
没有修改的图片直接从缓存文件读取（C:\Users\Administrator\AppData\Local\Temp\gulp-cache）。
*/
//图片压缩插件集合结束

//less
less = require('gulp-less'),
/*
编译less文件为css文件
npm install gulp-less --save-dev
*/
sourcemaps = require('gulp-sourcemaps'),
/*
为了找到生成css后对应的less文件
当less有各种引入关系时，编译后不容易找到对应less文件，
所以需要生成sourcemap文件，方便修改
npm install gulp-sourcemaps --save-dev
*/
//less结束

//sass
//sass = require('gulp-sass'),
/*
编译sass/scss 为 css 文件
npm install gulp-sass --save-dev
*/
//sass结束

//合并文件
concat = require('gulp-concat'),
/*
合并当前文件夹下所有javascript文件成一个js文件，减少网络请求。
npm install gulp-concat --save-dev
*/
//合并文件结束

//jade
jade = require('jade'),
/*
npm install jade --save-dev
*/
gulpJade = require('gulp-jade');
/*
npm install gulp-jade --save-dev
*/
//jade结束

var app = {
    srcPath: 'src',
    buildPath: 'build',
    distPath: 'dist',
    no_srcPath: '!src',
    no_buildPath: '!build',
    no_distPath: '!dist',
};

gulp.task('clean',function() {
//删除src里没有的，build和dist里的文件
  return del([
    /*删除这个bower安装目录系统会报错*/
    // 'build/bower_components/*',
    // 'dist/bower_components/*',
    /*删除这个bower安装目录系统会报错结束*/
    app.buildPath+'/**/*.html',
    app.distPath+'/**/*.html',
    app.buildPath+'/js/**/*.js',
    app.distPath+'/js/**/*.js',
    app.buildPath+'/css/**/*.css',
    app.distPath+'/css/**/*.css',
    app.buildPath+'/img/*',
    app.distPath+'/img/*',
    app.buildPath+'/less/*',
    //app.buildPath+'/sass/*',
    app.buildPath+'/concat_js/*',
    app.buildPath+'/public/*',
    app.distPath+'/public/*',
    app.buildPath+'/data/*',
    app.distPath+'/data/*',
    app.buildPath+'/bower_components/*',
    app.distPath+'/bower_components/*'
  ]);
  //删除dist里面所有的文件
});

gulp.task("browser-sync",["html",'bower_copy','script','style','imageMin','concatJs','jade','public','data'],function(){
//将任务放入自动刷新页面插件里
  browserSync({
    port: 3000,
    //默认端口3000
    server: {
        baseDir: ['./']
        //默认启动目录位置
    }
  });
});

/*将src内的bower重要文件，放入build，dist的bower_components内*/
gulp.task('bower_copy', function() {
    gulp.src([app.srcPath+'/bower_components/**/*.min.js', app.srcPath+'/bower_components/**/*.min.css', app.srcPath+'/bower_components/**/*.{png,jpg,gif,ico}', app.srcPath+'/bower_components/**/font/*'])
        .pipe(gulp.dest(app.buildPath+'/bower_components'))
        .pipe(gulp.dest(app.distPath+'/bower_components'))
        .pipe(browserSync.reload({stream:true}));
});
/*将src内的bower重要文件，放入build，dist的bower_components内结束*/

/*html*/
gulp.task('html', function() {
    //改变src文件夹下html
    /*压缩 html文件的参数*/
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    /*压缩 html文件的参数结束*/
    gulp.src([app.srcPath+'/**/*.html',app.no_srcPath+'/**/*0.html'])
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        //当编译时出现语法错误或者其他异常,出现异常并不终止watch事件（gulp-plumber），并提示我们出现了错误（gulp-notify）。
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        /*
          加入include功能
          使用方法
          @@include('./include/head.html')
        */
        .pipe(rev()) //加版本号，清除缓存
        /*
        要在加版本号的后面加?rev=@@hash
        比如
        <script src='js/index.js?rev=@@hash'></script>
        <link type='text/css' rel='sheetstyle' src='css/index_import.css?rev=@@hash'>
        */
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        //当编译时出现语法错误或者其他异常,出现异常并不终止watch事件（gulp-plumber），并提示我们出现了错误（gulp-notify）。
        .pipe(gulp.dest(app.buildPath))
        .pipe(htmlmin(options)) //压缩 html文件
        .pipe(gulp.dest(app.distPath))
        .pipe(browserSync.reload({stream:true}));
        //执行无需F5自动刷新页面
});
/*html结束*/

/*js*/
gulp.task('script',function(){
  gulp.src([app.srcPath+'/js/**/*.js',app.no_srcPath+'/js/**/*.min.js',app.no_srcPath+'/js/**/*0.js',app.buildPath+'/concat_js'])
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    //当编译时出现语法错误或者其他异常,出现异常并不终止watch事件（gulp-plumber），并提示我们出现了错误（gulp-notify）。
    .pipe(jshint()) //检查JS错误
    .pipe(jshint.reporter()) //输出检查结果
    .pipe(gulp.dest(app.buildPath+'/js'))
    .pipe(uglify({
    ////压缩js文件
      mangle: true,//类型：Boolean 默认：true 是否修改变量名
      //mangle: {except: ['require' ,'exports' ,'module' ,'$']}//排除混淆关键字
      compress: true,//类型：Boolean 默认：true 是否完全压缩
      //preserveComments: 'all' //保留所有注释
    }))
    .pipe(gulp.dest(app.distPath+'/js'))
    .pipe(browserSync.reload({stream:true}));
    //执行无需F5自动刷新页面
});
/*js结束*/

/*css*/
gulp.task('style',function(){
  gulp.src([app.srcPath+'/css/**/*.css',app.no_srcPath+'/css/**/*.min.css',app.no_srcPath+'/css/**/*0.css'])
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    //当编译时出现语法错误或者其他异常,出现异常并不终止watch事件（gulp-plumber），并提示我们出现了错误（gulp-notify）。
    .pipe(autoprefixer({
      browsers: ['last 2 versions','> 5%','ie 6-8','iOS 7','Android >= 4.0'],
      //按照上面这些兼容性，添加属性前缀
      cascade: true, //是否美化属性值 默认：true 像这样：
      //-webkit-transform: rotate(45deg);
      //        transform: rotate(45deg);
      remove:true //是否去掉不必要的前缀 默认：true
    }))
    .pipe(cssver()) //并给css里的引用文件加版本号
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    //当编译时出现语法错误或者其他异常,出现异常并不终止watch事件（gulp-plumber），并提示我们出现了错误（gulp-notify）。
    .pipe(gulp.dest(app.buildPath+'/css'))
    .pipe(cssmin({ //压缩css文件
      advanced: true,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
      compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
      keepBreaks: false,//类型：Boolean 默认：false [是否保留换行]
      keepSpecialComments: '*'
      //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
    }))
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    //当编译时出现语法错误或者其他异常,出现异常并不终止watch事件（gulp-plumber），并提示我们出现了错误（gulp-notify）。
    .pipe(gulp.dest(app.distPath+'/css'))
    .pipe(browserSync.reload({stream:true}));
    //执行无需F5自动刷新页面
});
/*css结束*/

/*img图片压缩*/
gulp.task('imageMin', function () {
//优化图片
  gulp.src([app.srcPath+'/img/**/*.{png,jpg,gif,ico}',app.no_srcPat+'/img/images/*'])
    .pipe(gulp.dest(app.buildPath+'/img'))
    // .pipe(cache(imagemin({
    // // cache( 减少压缩图片的内存消耗
    //   progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
    //   //optimizationLevel: 5, //类型：Number  默认：3 取值范围：0-7（优化等级）
    //   //interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
    //   //multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
    //   svgoPlugins: [{removeViewBox: false}], //不要移除svg的viewbox属性
    //   use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
    // })))
    .pipe(gulp.dest(app.distPath+'/img'))
    .pipe(browserSync.reload({stream:true}));
    //执行无需F5自动刷新页面
});
/*img图片压缩结束*/

//less
gulp.task('less', function () {
//编译less转为css
  gulp.src([app.srcPath+'/less/**/*.less',app.no_srcPath+'/less/**/*0.less'])
    //.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(plumber())
    //当编译时出现语法错误或者其他异常,出现异常并不终止watch事件（gulp-plumber），并提示我们出现了错误（gulp-notify）。
    .pipe(sourcemaps.init()) //为了找到生成css后对应的less文件
    //.pipe(gulp.dest(app.buildPath+'/less'))
    //不能写入buildPath里，不然会出错，中断编译
    .pipe(less()) //编译less文件
    .pipe(sourcemaps.write()) //为了找到生成css后对应的less文件
    .pipe(gulp.dest(app.srcPath+'/css'));
    /*编译好的less放进去后，会放入进行监听css文件那里，
      css任务那里会自动压缩css，给链接加版本号
    */
});
//less结束

//sass
// gulp.task('sass', function () {
// //编译sass/scss文件转换为css
//   return gulp.src([app.srcPath+'/sass/**/*.scss',app.no_srcPath+'/sass/**/*0.scss'])
//     //.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
//     .pipe(plumber())
//     //当编译时出现语法错误或者其他异常,出现异常并不终止watch事件（gulp-plumber），并提示我们出现了错误（gulp-notify）。
//     .pipe(gulp.dest(app.buildPath+'/sass'))
//     .pipe(sass().on('error', sass.logError))
//     .pipe(gulp.dest(app.srcPath+'/css'));
//     /*编译好的sass放进去后，会放入进行监听css文件那里，
//       css任务那里会自动压缩css，给链接加版本号
//     */
// });
//sass结束

//合并文件
gulp.task('concatJs',function(){
//合并js文件
  gulp.src(app.srcPath+'/concat_js/**/*.js')
    .pipe(concat('all.js'))
    //将所有src/concat_js/**/*.js里的js,合并成一个文件 all.js
    .pipe(gulp.dest(app.buildPath+'/concat_js'));
});
//合并文件结束

//jade
gulp.task('jade', function(){
  gulp.src(app.srcPath+'/**/*.jade')
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    //当编译时出现语法错误或者其他异常,出现异常并不终止watch事件（gulp-plumber），并提示我们出现了错误（gulp-notify）。
    .pipe(gulpJade({
      pretty: true
    }))
    .pipe(gulp.dest(app.srcPath))
    .pipe(browserSync.reload({stream:true}));
});
//jade结束

gulp.task('public', function(){
//public里的文件，一般放不需要压缩的 .min 的
  gulp.src(app.srcPath+'/public/**/*')
  .pipe(gulp.dest(app.buildPath+'/public'))
  .pipe(gulp.dest(app.distPath+'/public'))
  .pipe(browserSync.reload({stream:true}));
});

//data
gulp.task('data', function(){
  gulp.src(app.srcPath+'/data/**/*')
    .pipe(gulp.dest(app.buildPath+'/data'))
    .pipe(gulp.dest(app.distPath+'/data'))
    .pipe(browserSync.reload({stream:true}));
});
//data结束

gulp.task('serve', function() {
    gulp.watch(app.srcPath+'/bower_components/**/*', ['bower_copy']);
    gulp.watch(app.srcPath+'/**/*.html', ['html']);
    gulp.watch(app.srcPath+'/js/**/*.js', ['script']);
    gulp.watch(app.srcPath+'/less/**/*.less', ['less']);
    //gulp.watch(app.srcPath+'/sass/**/*.scss', ['sass']);
    gulp.watch(app.srcPath+'/css/**/*.css', ['style']);
    gulp.watch(app.srcPath+'/img/**/*', ['imageMin']);
    gulp.watch(app.srcPath+'/concat_js/**/*.js', ['concatJs']);
    gulp.watch(app.srcPath+'/**/*.jade', ['jade']);
    gulp.watch(app.srcPath+'/public/**/*', ['public']);
    gulp.watch(app.srcPath+'/data/*', ['data']);
});

gulp.task("default",["browser-sync","serve"]);
/*
执行gulp clean，清除dist,build目录里所有的文件

每次执行default任务后
执行browser-sync，打开文件监听，无需F5自动刷新页面
再执行serve，开启所有文件监听
每次src里有的文件会创建到 build和dist文件夹里
运行后，会提示localhost:3000没找到，这个报错没事，可以正常使用
*/
