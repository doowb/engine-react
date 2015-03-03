/*!
 * engine-react <https://github.com/doowb/engine-react>
 *
 * Copyright (c) 2014 Brian Woodward.
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var extend = require('extend-shallow');
var browserify = require('browserify');
var reactify = require('reactify');
var assemble = require('assemble');
var extname = require('gulp-extname');

var engine = require('..');
var dirname = path.join.bind(path, __dirname);

var data = {};
var comments = require('./data/comments.json');
data.comments = {
  data: comments,
  pollInterval: 2000
};

data.users = {
  data: comments,
  pollInterval: 3000
};

// add the engines for the specific extensions
assemble.engine('.jsx', engine);

// set default layout for handlebars templates
assemble.option('layout', 'default');

// create a new template type to use in handlebars template
assemble.create('component');

// add handlebars layouts
assemble.layouts(dirname('src/layouts/*.hbs'));

// add react templates used in the client-side app
assemble.components(dirname('src/apps/*.jsx'));

assemble.task('client', function (done) {
  // browserify the client-side app
  browserify('./main.js', { basedir: path.join(__dirname, 'src/apps'), debug: true })
    .transform(reactify)
    .bundle(function (err, results) {
      if (err) return console.log('Bundle Error:', err);
      fs.writeFileSync(dirname('dist/assets/js/app.js'), results);
      done();
    });
});

assemble.task('server', ['client'], function () {
  // add handlebars pages
  return assemble.src([dirname('src/pages/*.hbs')], data)
    .pipe(extname())
    .pipe(assemble.dest('dist'));
});

assemble.task('default', ['client', 'server']);
