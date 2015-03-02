
var Remarkable = require('remarkable');
var md = new Remarkable();

// Render a comment using markdown.
var Comment = React.createClass({
  render: function() {
    var rawMarkup = md.render(this.props.children.toString());
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});

// Create a form that allows adding a new comment
var CommentForm = React.createClass({
  handleSubmit: function (e) {
    e.preventDefault();
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    this.refs.author.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" /><br/>
        <textarea placeholder="Say something..." ref="text" /><br/>
        <input type="submit" value="Post" />
      </form>
    );
  }
});

// Render a list of comments
var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment) {
      return (
        <Comment key={comment.key} author={comment.author}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

// The CommentBox handles listing comments and showing a form for new comments.
var CommentBox = React.createClass({
  loadCommentsFromServer: function () {
    // TODO: get from server
    var data = this.state.data;
    this.setState({data: data});
  },
  handleCommentSubmit: function (comment) {
    var data = this.state.data;
    var newData = data.concat([comment]);
    this.setState({data: newData});
  },
  getInitialState: function () {
    return {data: this.props.data || []};
  },
  componentDidMount: function () {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

// Wrapper around a comment box
var Comments = React.createClass({
  render: function() {
    return (
      <div className="comments">
        <CommentBox data={this.props.data} pollInterval={this.props.pollInterval} />
      </div>
    );
  }
});

module.exports = Comments;
