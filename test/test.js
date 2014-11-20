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


describe.skip('.renderSync()', function () {
  it('should render templates.', function () {
    var str = engine.renderSync('Jon {{ name }}', {name: 'Schlinkert'});
    str.should.equal('Jon Schlinkert');
  });
});


describe('.render()', function() {
  it('should render templates.', function(done) {
    var ctx = {name: 'Jon Schlinkert'};
    // var App = require('./fixtures/App.jsx');
    var str = fs.readFileSync('test/fixtures/App.jsx', 'utf8');

    engine.render(str, ctx, function (err, content) {
      content.indexOf('Jon Schlinkert').should.not.equal(-1);
      done();
    });
  });

  it.skip('should use default helpers.', function (done) {
    var ctx = {
      name: 'brian woodward'
    };
    engine.render('{{capitalizeEach name}}', ctx, function (err, content) {
      if (err) console.log(err);
      content.should.equal('Brian Woodward');
      done();
    });
  });

  it.skip('should use helpers passed on the options.', function(done) {
    var ctx = {
      name: 'Jon Schlinkert',
      helpers: {
        include: function(name) {
          var filepath = path.join('test/fixtures', name);
          return fs.readFileSync(filepath, 'utf8');
        },
        upper: function(str) {
          return str.toUpperCase();
        }
      }
    };

    engine.render('{{upper (include "content.hbs")}}', ctx, function (err, content) {
      if (err) console.log(err);

      content.should.equal('JON SCHLINKERT');
      done();
    });
  });

  it.skip('should use helpers on options over default helpers.', function (done) {
    var ctx = {
      name: 'brian woodward',
      helpers: {
        capitalizeEach: function (str) {
          return str.toUpperCase();
        }
      }
    };
    engine.render('{{capitalizeEach name}}', ctx, function (err, content) {
      if (err) console.log(err);
      content.should.equal('BRIAN WOODWARD');
      done();
    });
  });

  it.skip('should use partials passed on the options.', function(done) {
    var ctx = {
      partials: {
        a: 'foo',
        b: 'bar'
      }
    };

    engine.render('{{> a }}{{> b }}', ctx, function (err, content) {
      if (err) console.log(err);
      content.should.equal('foobar');
      done();
    });
  });
});


describe.skip('.renderFile()', function() {
  it('should render templates from a file.', function(done) {
    var ctx = {name: 'Jon Schlinkert'};

    engine.renderFile('test/fixtures/default.hbs', ctx, function (err, content) {
      content.should.equal('Jon Schlinkert');
      done();
    });
  });
});

