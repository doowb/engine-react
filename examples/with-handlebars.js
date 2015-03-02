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
var engine = require('..');
var Template = require('template');
var handlebars = require('engine-handlebars');
var ReactTools = require('react-tools');
var transform = ReactTools.transform;

var dirname = path.join.bind(path, __dirname);

// setup `template`
var template = new Template();
template.option('renameKey', function (fp) {
  return path.basename(fp, path.extname(fp));
});

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
    component.render(context, next);
});

template.helper('deps', function () {
  var app = this.app;
  var deps = app.views.partials;
  deps = Object.keys(deps).map(function (dep) {
    return transform(deps[dep].content);
  }).join('\n\n');

  return new handlebars.Handlebars.SafeString(deps);
});

template.helper('app', function (name) {
  var app = this.app;
  var App = app.findRenderable(name, ['components']);
  var output = transform(App.content);
  return new handlebars.Handlebars.SafeString(output);
});

// add handlebars layouts
template.layouts(dirname('fixtures/layouts/*.hbs'));

// add handlebars pages
template.pages(dirname('fixtures/pages/*.hbs'));

// add react templates used in the client-side app
template.partials([dirname('fixtures/apps/**/*.jsx'), '!' + dirname('fixtures/apps/**/*App.jsx')], {});
template.components(dirname('fixtures/**/*App.jsx'));

template.render('app', function (err, contents) {
  if (err) return console.log(err);
  fs.writeFileSync(dirname('assets/js/app.js'), contents);
});

template.render('index', { title: "Render React", first: "Brian Woodward", options: { layout: 'default' } }, function (err, contents) {
  if (err) return console.log(err);
  fs.writeFileSync(dirname('index.html'), contents);
});
