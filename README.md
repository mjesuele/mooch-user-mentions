# mooch:user-mentions

Provide support for Slack-style user @-mentions

## Installation

```
    meteor add mooch:user-mentions
```

## Description

Exposes a global variable `UserMentions` including three functions and three
React components.

### Functions

#### getMentionedUsers(text)
``` javascript
/**
 * Takes a string and returns an array of user objects corresponding to the
 * @-mentions in the string.
 * @param {String} text - The text to search for @-mentions
 * @return {Object[]} The array of users corresponding to the @-mentions in the text
 */
function getMentionedUsers(text) {
  return getMentions(text).map(mention => Meteor.users.findOne({
    username: mention.slice(1),
  }));
}
```

####  getLastWordTyped(inputElem)
``` javascript
/**
 * Takes an input element and returns the last word from its value.
 * @param {HTMLInputElement} - The HTML input element to get the last word from
 * @return {String} The last word of the value of the input element
 */
function getLastWordTyped(inputElem) {
  const cursorPosition = inputElem.selectionStart;
  const textBeforeCursor = inputElem.value.slice(0, cursorPosition).trim();
  const lastWord = textBeforeCursor.substr(
    textBeforeCursor.lastIndexOf(' ') + 1
  );
  return lastWord;
}
```

#### processMentions(text)
``` javascript
/*
 * Takes a string containing @-mentions and returns the text with the mentions
 * converted into links to the corresponding users' profiles.
 * @param {String} text - The text in which to process @-mentions
 * @return {String} The text with the mentions converted into profile links
 */
function processMentions(text) {
  return createMentionLinks(
    getMentions(text),
    text
  );
}
```

### React Components

#### Input

An input box which renders user mention suggestions.

``` javascript
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
}
```

### Suggestions

Renders a list of user mention suggestions

```javascript
propTypes: {
  activeUser: React.PropTypes.number,
  selectUser: React.PropTypes.func,
  users: React.PropTypes.arrayOf(Object).isRequired,
}
```

### Suggestion

Renders a single user mention suggestion

``` javascript
propTypes: {
  className: React.PropTypes.string,
  selectUser: React.PropTypes.func,
  user: React.PropTypes.object.isRequired,
}
```
