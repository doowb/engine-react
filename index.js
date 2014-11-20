/*!
 * engine-react <https://github.com/doowb/engine-react>
 *
 * Copyright (c) 2014 Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Module dependencies.
 */
// require('node-jsx').install();
var react = require('react');
var transform = require('react-tools').transform;

var loadPartials = function (options) {
  options = options || {};
  if (!options.partials) return '';
  options.partials = [].concat.call([], options.partials);
  if (options.partials.length === 0) return '';
  return options.partials.join('\n\n');
};

var engine = {
 
  /**
   * Handlebars string support. Render the given `str` and invoke the callback `cb(err, str)`.
   *
   * ```js
   * var engine = require('engine-react');
   * engine.render('{{name}}', {name: 'Jon'}, function (err, content) {
   *   console.log(content); //=> 'Jon'
   * });
   * ```
   *
   * @param {String} `str`
   * @param {Object|Function} `options` or callback.
   *     @property {Object} `cache` enable template caching
   *     @property {String} `filename` filename required for caching
   * @param {Function} `cb` callback function.
   * @api public
   */
  
  render: function (str, options, cb) {
    cb(null, this.renderSync(str, options));
  },

  /**
   * Synchronously render Handlebars or templates.
   *
   * ```js
   * var engine = require('engine-react');
   * engine.renderSync('<%= name %>', {name: 'Jon'});
   * //=> 'Jon'
   * ```
   * @param  {Object} `str` The string to render.
   * @param  {Object} `options` Object of options.
   *   @option {Object} `settings` Settings to pass to Lo-Dash.
   *   @option {Object} `delims` Template delimiters, generated by [delims]
   *   @option {Object} `imports` Template helpers to pass to Lo-Dash.
   * @return {String} Rendered string.
   * @api public
   */
  
  renderSync: function (str, options) {
    str = [loadPartials(options), str].join('\n\n');
    var component = react.createFactory(eval(transform(str)));
    return react.renderToStaticMarkup(component(options));
  },

  /**
   * Handlebars file support. Render a file at the given `path` and callback `cb(err, str)`.
   *
   * ```js
   * var engine = require('engine-react');
   * engine.renderSync('foo/bar/baz.tmpl', {name: 'Jon'});
   * //=> 'Jon'
   * ```
   *
   * @param {String} `path`
   * @param {Object|Function} `options` or callback function.
   * @param {Function} `cb` callback function
   * @api public
   */

  renderFile: function (path, options, cb) {

  }
};

/**
 * Express support.
 */

engine.__express = engine.renderFile;

module.exports = engine;