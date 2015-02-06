var React = require('react');
var Hello = require('./Hello.jsx');
var App = React.createClass({
  render: function() {
    return (
      <Hello />
    )
  }
});

React.render(<App />, document.getElementById('content'));

module.exports = App;
