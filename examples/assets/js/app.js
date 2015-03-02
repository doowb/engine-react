var module = {
  exports: {}
};


var Remarkable = require('remarkable');
var md = new Remarkable();

var Comment = React.createClass({displayName: "Comment",
  render: function() {
    var rawMarkup = md.render(this.props.children.toString());
    return (
      React.createElement("div", {className: "comment"}, 
        React.createElement("h2", {className: "commentAuthor"}, 
          this.props.author
        ), 
        React.createElement("span", {dangerouslySetInnerHtml: {__html: rawMarkup}})
      )
    );
  }
});

var CommentForm = React.createClass({displayName: "CommentForm",
  render: function() {
    return (
      React.createElement("div", {className: "commentForm"}, 
        "Hello, world! I am a CommentForm."
      )
    );
  }
});


var CommentList = React.createClass({displayName: "CommentList",
  render: function() {
    return (
      React.createElement("div", {className: "commentList"}, 
        React.createElement(Comment, {author: this.props.first}, "This is one comment"), 
        React.createElement(Comment, {author: "Jordan Walke"}, "This is *another* comment")
      )
    );
  }
});

var CommentBox = React.createClass({displayName: "CommentBox",
  render: function() {
    return (
      React.createElement("div", {className: "commentBox"}, 
        React.createElement("h1", null, "Comments"), 
        React.createElement(CommentList, {first: this.props.first}), 
        React.createElement(CommentForm, null)
      )
    );
  }
});

var Comments = React.createClass({displayName: "Comments",
  render: function() {
    return (
      React.createElement("div", {className: "comments"}, 
        React.createElement(CommentBox, {first: this.props.first})
      )
    );
  }
});

module.exports = Comments;


React.render(Comments({ first: 'Pete Hunt' }), document.getElementById('app'));
