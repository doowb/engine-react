
var App = React.createClass({
  render: function() {
    return (
      <div className="app">
        <CommentBox first={this.props.first}/>
      </div>
    );
  }
});

module.exports = App;
