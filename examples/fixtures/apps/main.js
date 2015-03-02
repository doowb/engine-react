
var merge = require('merge-deep');
var Comments = require('./Comments.jsx');
var UserStatusBox = require('./UserStatusBox.jsx');
var data = {
  comments: require('../../data/comments.json')
};

var remote = merge({}, data);
remote.comments.forEach(function (comment) {
  comment.author += " remote";
});

var orig = merge({}, data);

React.render(
  <Comments data={remote.comments} pollInterval={2000} />
  , document.getElementById('app1')
);

React.render(
  <UserStatusBox data={orig.comments} pollInterval={2500} />
  , document.getElementById('app2')
);
