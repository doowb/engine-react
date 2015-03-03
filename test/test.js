/*!
 * engine-react <https://github.com/doowb/engine-react>
 *
 * Copyright (c) 2014-2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

// var ctx = {
//   partials: {
//     Comment: fs.readFileSync('./test/fixtures/Comment.jsx', 'utf8'),
//     CommentForm: fs.readFileSync('./test/fixtures/CommentForm.jsx', 'utf8'),
//     CommentList: fs.readFileSync('./test/fixtures/CommentList.jsx', 'utf8')
//   }
// };

// engine.render(fs.readFileSync('./test/fixtures/CommentBox.jsx', 'utf8'), ctx, function (err, content) {
//   if (err) return console.log('error', err);
//   console.log('done');
//   console.log('content', content.toString());
// });

// describe('.renderSync()', function () {
//   it('should render templates.', function () {
//     var str = engine.renderSync(makeTemplate('Component', '<span>Jon {this.props.name}</span>'), {name: 'Schlinkert'});
//     console.log(str);
//     // str.should.equal('Jon Schlinkert');
//   });
// });

// describe('.render()', function() {
//   it.only('should render templates.', function(done) {
//     var ctx = {name: 'Jon Schlinkert'};
//     var str = makeTemplate("Component", "<h1>Hello {this.props.name}!</h1>");
//     engine.render(str, ctx, function (err, content) {
//       console.log('render()', arguments);
//       // content.indexOf('Jon Schlinkert').should.not.equal(-1);
//       done();
//     });
//   });

//   it('should render templates with partials.', function(done) {
//     var ctx = {name: 'Jon Schlinkert'};
//     var name = makeTemplate("Name", "<span>{this.props.name}</span>");
//     var str = makeTemplate("Component", '<h1>Hello <Name name="{this.props.name}" />!</h1>');
//     ctx.partials = [name];
//     engine.render(str, ctx, function (err, content) {
//       // content.indexOf('Jon Schlinkert').should.not.equal(-1);
//       console.log(content);
//       done();
//     });
//   });

//   xit('should use default helpers.', function (done) {
//     var ctx = {
//       name: 'brian woodward'
//     };
//     engine.render('{{capitalizeEach name}}', ctx, function (err, content) {
//       if (err) console.log(err);
//       content.should.equal('Brian Woodward');
//       done();
//     });
//   });

//   xit('should use helpers passed on the options.', function(done) {
//     var ctx = {
//       name: 'Jon Schlinkert',
//       helpers: {
//         include: function(name) {
//           var filepath = path.join('test/fixtures', name);
//           return fs.readFileSync(filepath, 'utf8');
//         },
//         upper: function(str) {
//           return str.toUpperCase();
//         }
//       }
//     };

//     engine.render('{{upper (include "content.hbs")}}', ctx, function (err, content) {
//       if (err) console.log(err);

//       content.should.equal('JON SCHLINKERT');
//       done();
//     });
//   });

//   xit('should use helpers on options over default helpers.', function (done) {
//     var ctx = {
//       name: 'brian woodward',
//       helpers: {
//         capitalizeEach: function (str) {
//           return str.toUpperCase();
//         }
//       }
//     };
//     engine.render('{{capitalizeEach name}}', ctx, function (err, content) {
//       if (err) console.log(err);
//       content.should.equal('BRIAN WOODWARD');
//       done();
//     });
//   });

//   xit('should use partials passed on the options.', function(done) {
//     var ctx = {
//       partials: {
//         a: 'foo',
//         b: 'bar'
//       }
//     };

//     engine.render('{{> a }}{{> b }}', ctx, function (err, content) {
//       if (err) console.log(err);
//       content.should.equal('foobar');
//       done();
//     });
//   });
// });


// describe('.renderFile()', function() {
//   xit('should render templates from a file.', function(done) {
//     var ctx = {name: 'Jon Schlinkert'};

//     engine.renderFile('test/fixtures/default.hbs', ctx, function (err, content) {
//       content.should.equal('Jon Schlinkert');
//       done();
//     });
//   });
// });

