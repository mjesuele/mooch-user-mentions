/* global _ Meteor */

// A regular expression for finding user @-mentions in text
const userMentionPattern = /(?:^|\s)(@.+?)(?:\b|$)/g;

/**
 * Takes an array of mentions and some text and return the text with the
 * mentions converted into links to the corresponding users' profiles.
 * @param {String[]} mentions - The array of mentions to replace with links
 * @param {String} text - The text to add the mention links to
 * @return {String} The text with mention links added
 */
function createMentionLinks(mentions, text) {
  return text.replace(/@(.+?)\b/g, (mention, username) => {
    return _.contains(mentions, mention) ?
       `<a href="?profile=${username}">${mention}</a>` :
       mention;
  });
}

/**
 * Returns an array of all the groups captured by evaluating the given string
 * against the given regular expression.
 * @param {String} text - The text to capture from
 * @param {RegExp} re - The regular expression to evaluate the string against
 * @return {String[]} The array of unique captures
 */
function getAllCaptures(text, re) {
  const arr = [];
  text.replace(re, function(s, match) {
    arr.push(match);
  });

  return _.uniq(arr);
}

/**
 * Returns all the captures from evaluating some text against a regular expression
 * designed to capture user @-mentions.
 * @param {String} text - The text to capture @-mentions from
 * @return {String[]} The array of captured @-mentions
 */
function extractMentionMatches(text) {
  return getAllCaptures(text, userMentionPattern);
}

/**
 * Filters an array of @-mentions to only include those corresponding to actual
 * existing users.
 * @param {String[]} mentionsArr - The array of @-mentions to filter
 * @return {String[]} The filtered array of @-mentions consisting only of real
 *                    users
 */
function selectActualUsers(mentionsArr) {
  return mentionsArr.filter(mention => {
    const username = mention.slice(1);
    return !!Meteor.users.findOne({username});
  });
}

/**
 * Takes a string and returns an array of any contained @-mentions corresponding
 * to real users.
 * @param {String} text - The text to capture @-mentions from
 * @return {String[]} The array of @-mentions consisting only of real users
 */
function getMentions(text) {
  return selectActualUsers(extractMentionMatches(text));
}

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

/**
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

// Global export
/* eslint-disable no-undef */
UserMentions = { getMentionedUsers, getLastWordTyped, processMentions };
/* eslint-enable no-undef */
