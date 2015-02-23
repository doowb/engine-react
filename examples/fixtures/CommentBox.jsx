
var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList first={this.props.first} />
        <CommentForm />
      </div>
    );
  }
});

module.exports = CommentBox;
