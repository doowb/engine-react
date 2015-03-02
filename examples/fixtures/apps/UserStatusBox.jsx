
// Render a user
var User = React.createClass({
  render: function() {
    return (
      <div className="user">
        <h3 className="userName">
          {this.props.username}
        </h3>
      </div>
    );
  }
});

// Render a list of users
var UserList = React.createClass({
  render: function() {
    var userNodes = this.props.data.map(function (user) {
      return (
        <User key={user.key} username={user.author} />
      );
    });
    return (
      <div className="userList">
        {userNodes}
      </div>
    );
  }
});

// The UserStatusBox handles getting users and rendering them
var UserStatusBox = React.createClass({
  loadUsersFromServer: function () {
    var data = this.state.data;
    this.setState({data: data});
  },
  getInitialState: function () {
    return {data: this.props.data || []};
  },
  componentDidMount: function () {
    this.loadUsersFromServer();
    setInterval(this.loadUsersFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="UserStatusBox">
        <h1>Online Users</h1>
        <UserList data={this.state.data} />
      </div>
    );
  }
});

module.exports = UserStatusBox;
