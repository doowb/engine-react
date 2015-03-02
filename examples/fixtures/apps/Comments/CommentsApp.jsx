
var CommentsApp = React.createClass({
  render: function() {
    return (
      <div className="comments">
        <CommentBox first={this.props.first}/>
      </div>
    );
  }
});

module.exports = CommentsApp;
