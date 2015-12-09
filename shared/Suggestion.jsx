/* global classnames React */
UserMentions.Suggestion = React.createClass({
  propTypes: {
    className: React.PropTypes.string,
    selectUser: React.PropTypes.func,
    user: React.PropTypes.object.isRequired,
  },
  
  render() {
    const { fullName, username, pic } = this.props.user.profile;
    const className =
      classnames('user-suggestion-list-item', this.props.className);
    return (
      <div
        className={className}
        onClick={() => this.props.selectUser(this.props.user)}
      >
        <img className="user-suggestion-list-item__pic" src={pic} alt={username} />
        <span className="user-suggestion-list-item__username">{username} </span>
        <span className="user-suggestion-list-item__fullname">({fullName})</span>
      </div>
    );
  },
});
