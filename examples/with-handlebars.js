/*!
 * engine-react <https://github.com/doowb/engine-react>
 *
 * Copyright (c) 2014 Brian Woodward.
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var should = require('should');
var Template = require('template');
var extend = require('extend-shallow');
var ReactTools = require('react-tools');
var handlebars = require('engine-handlebars');
var browserify = require('browserify');
var reactify = require('reactify');


var transform = ReactTools.transform;
var engine = require('..');

var dirname = path.join.bind(path, __dirname);

// setup `template`
var template = new Template();
template.option('renameKey', function (fp) {
  return path.basename(fp, path.extname(fp));
});

var data = {};
var comments = require('./data/comments.json');
data.comments = {
  list: comments,
  pollInterval: 2000
};

data.users = {
  list: comments,
  pollInterval: 3000
};

// add the engines for the specific extensions
template.engine('.hbs', handlebars);
template.engine('.jsx', engine);

// create a new template type to use in handlebars templates
template.create('component', { isRenderable: true });
template.asyncHelper('component', function (name, ctx, options, next) {
    if (typeof next !== 'function') {
      next = options;
      options = ctx;
      ctx = {};
    }
    var app = this.app;
    var context = this.context;
    var component = app.findRenderable(name, ['components']);
    if (!component) {
      console.log('can not find', name, 'component');
      return next(null, '');
    }
    context.options = context.options || {};
    context.options.layout = false;

    context = extend({}, context, ctx, options.hash);
    component.render(context, next);
});

// add handlebars layouts
template.layouts(dirname('fixtures/layouts/*.hbs'));

// add handlebars pages
template.pages(dirname('fixtures/pages/*.hbs'));

// add react templates used in the client-side app
// template.partials([dirname('fixtures/apps/**/*.jsx'), '!' + dirname('fixtures/apps/**/*App.jsx')], {});
template.components(dirname('fixtures/apps/*.jsx'));

// template.render('app', function (err, contents) {
//   if (err) return console.log(err);
//   fs.writeFileSync(dirname('assets/js/app.js'), contents);
// });

browserify('./main.js', { basedir: path.join(__dirname, 'fixtures/apps'), debug: true })
  .transform(reactify)
  .bundle(function (err, results) {
    if (err) return console.log('Bundle Error:', err);
    console.log('results', results);
    fs.writeFileSync(dirname('assets/js/app.js'), results);
  });

template.render('index', extend({}, data, {options: { layout: 'default', static: false }}), function (err, contents) {
  if (err) return console.log(err);
  fs.writeFileSync(dirname('index.html'), contents);
});
