/*!
 * engine-react <https://github.com/doowb/engine-react>
 *
 * Copyright (c) 2014-2015 Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Module dependencies.
 */

var React = require('react');
var ReactTools = require('react-tools');
var transform = ReactTools.transform;

var wrap = function (name, src) {
  return [
    'var ' + name + 'Module = { exports: {} };',
    '(function (module) {',
    '  ' + src,
    '})(' + name + 'Module);',
    'var ' + name + ' = ' + name + 'Module.exports;'
  ].join('\n');
}

var engine = {

  compile: function reactCompile (str, options) {
    options = options || {};
    options.static = options.static || false;

    var partials = options.partials || {};
    try {
      var deps = Object.keys(partials).map(function (key) {
        var partial = partials[key];
        return wrap(key, partial);
      }).join('\n\n');

      str = [
        "var React = require('react');",
        deps,
        str
      ].join('\n\n');

      var Element = React.createFactory(eval(transform(str)));
      return function renderElement (ctx) {
        try {
          var element = Element(ctx);
          var content = '';
          if (options.static) {
            content = React.renderToStaticMarkup(element);
          } else {
            content = React.renderToString(element);
          }
          return content;
        } catch (err) {
          throw err;
        }
      };
    } catch (err) {
      throw err;
    }
  },

  render: function reactRender (fn, ctx, cb) {
    if (typeof fn !== 'function') {
      try {
        var fn = this.compile(fn, ctx);
      } catch (err) {
        return cb(err);
      }
    }
    try {
      var content = fn(ctx);
      return cb(null, content);
    } catch (err) {
      return cb(err);
    }
  }

};

/**
 * Express support.
 */

engine.__express = engine.renderFile;

module.exports = engine;
