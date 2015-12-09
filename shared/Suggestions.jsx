/* global React UserMentions */
UserMentions.Suggestions = React.createClass({
  propTypes: {
    activeUser: React.PropTypes.number,
    selectUser: React.PropTypes.func,
    users: React.PropTypes.arrayOf(Object).isRequired,
  },

  renderSuggestions() {
    return (this.props.users.map((user, i) => (
      <UserMentions.Suggestion
        className={i === this.props.activeUser ? 'active' : void(0)}
        key={user._id}
        selectUser={this.props.selectUser}
        user={user}
      />
    )));
  },

  render() {
    console.log({users: this.props.users});
    return (
      <div className="user-suggestion-list">
        {this.renderSuggestions()}
      </div>
    );
  },
});
