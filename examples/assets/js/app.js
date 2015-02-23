var module = {
  exports: {}
};

var Comment = React.createClass({displayName: "Comment",
  render: function() {
    return (
      React.createElement("div", {className: "comment"}, 
        React.createElement("h2", {className: "commentAuthor"}, 
          this.props.author
        ), 
        this.props.children
      )
    );
  }
});

module.exports = Comment;


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

module.exports = CommentBox;


var CommentForm = React.createClass({displayName: "CommentForm",
  render: function() {
    return (
      React.createElement("div", {className: "commentForm"}, 
        "Hello, world! I am a CommentForm."
      )
    );
  }
});

module.exports = CommentForm;


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

module.exports = CommentList;


var App = React.createClass({displayName: "App",
  render: function() {
    return (
      React.createElement("div", {className: "app"}, 
        React.createElement(CommentBox, {first: this.props.first})
      )
    );
  }
});

module.exports = App;


React.render(App({ first: 'Pete Hunt' }), document.getElementById('app'));
