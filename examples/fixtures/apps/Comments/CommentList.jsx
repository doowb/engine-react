
var CommentList = React.createClass({
  render: function() {
    return (
      <div className="commentList">
        <Comment author={this.props.first}>This is one comment</Comment>
        <Comment author="Jordan Walke">This is *another* comment</Comment>
      </div>
    );
  }
});

module.exports = CommentList;
