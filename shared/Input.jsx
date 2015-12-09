/* global _ EasySearch Meteor React UserMentions */
UserMentions.Input = React.createClass({
  propTypes: {
    className: React.PropTypes.string,
    onChange: React.PropTypes.func,
    onKeyDown: React.PropTypes.func,
    placeholder: React.PropTypes.string,
    style: React.PropTypes.object,
    users: React.PropTypes.arrayOf(Object).isRequired,
  },

  contextTypes: {
    user: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return this.initialize(this.props.users);
  },

  componentWillReceiveProps({ users: nextUsers }) {
    if (this.props.users !== nextUsers) {
      this.setState(this.initialize(nextUsers));
    }
  },

  initialize(users) {
    const userId = this.context.user._id;
    const userIds = _.pluck(users, '_id');
    console.log('initializing', {userId, userIds});
    return {
      usersIndex: new EasySearch.Index({
        collection: Meteor.users,
        fields: ['profile.username'],
        engine: new EasySearch.Minimongo({
          selector(...args) {
            const selector = _(this.defaultConfiguration().selector(...args))
              .extend({
                _id: {
                  $ne: userId,
                  $in: userIds,
                },
              });

            return selector;
          },
        }),
      }),
    };
  },

  handleChange({target}) {
    if (this.props.onChange) {
      const lastWord = UserMentions.getLastWordTyped(target);
      if (lastWord && lastWord[0] === '@') {
        const suggestions = lastWord ?
          this.state.usersIndex.search(lastWord.slice(1)).fetch() : [];
        this.props.onChange(
          suggestions,
          lastWord
        );
      }
    }
  },

  render() {
    const props = _.pick(this.props,
      'className', 'placeholder', 'onKeyDown', 'style'
    );

    return (
      <input
        className="user-mention-input"
        onChange={this.handleChange}
        ref="input"
        type="text"
        {...props}
      />
    );
  },
});
