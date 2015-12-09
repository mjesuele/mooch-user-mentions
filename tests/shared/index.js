/* global beforeAll describe expect it UserMentions */

Meteor.methods({
  removeAllUsers() {
    return !!Meteor.users.remove({});
  },
});

if (Meteor.isServer) {
  Meteor.publish('users', () => Meteor.users.find());
}

describe('UserMentions', function() {
  beforeAll(function(done) {
    const foouser = { username: 'foouser', password: 'foopass' };
    const baruser = { username: 'baruser', password: 'barpass' };

    if (Meteor.isClient) {
      Meteor.call('removeAllUsers', () => {
        Accounts.createUser(foouser, () => {
          Accounts.createUser(baruser, () => {
            Meteor.subscribe('users', {onReady: done});
          });
        });
      });
    } else {
      Meteor.users.remove({});
      [foouser, baruser].forEach(user => Accounts.createUser(user));
      done();
    }
  });

  describe('getAllCaptures', function() {
    it('takes a string and a regular expression and returns an array of the captures', function() {
      const captures = UserMentions.getAllCaptures('#foo# #bar# #test#', /#(.*?)#/g);
      expect(captures.length).toEqual(3);
      expect(captures).toContain('foo');
      expect(captures).toContain('bar');
      expect(captures).toContain('test');
    });
  });

  describe('extractMentionMatches', function() {
    it('takes a string and returns an array of potential @-mentions', function() {
      const noMentions = 'This message has no mentions in it, just an email ' +
       'address: foo@mooch.edu';
      const oneMention = 'Hey @foouser, you\'re a fooloser!';
      const threeMentions = 'Yo @foouser, @baruser, @bazuser, get back to work!';

      const noMatches = UserMentions.extractMentionMatches(noMentions);
      expect(noMatches.length).toEqual(0);

      const oneMatch = UserMentions.extractMentionMatches(oneMention);
      expect(oneMatch.length).toEqual(1);
      expect(oneMatch).toContain('@foouser');

      const threeMatches = UserMentions.extractMentionMatches(threeMentions);
      expect(threeMatches.length).toEqual(3);
      expect(threeMatches).toContain('@foouser');
      expect(threeMatches).toContain('@baruser');
      expect(threeMatches).toContain('@bazuser');
    });

    it('works when the mention is the only text in the message', function() {
      const result = UserMentions.extractMentionMatches('@foouser');
      expect(result.length).toEqual(1);
      expect(result).toContain('@foouser');
    });

    it('does not match the same mention twice', function() {
      const matches = UserMentions.extractMentionMatches(
        'Yo @foouser, what does @baruser think of @foouser?'
      );
      expect(matches.length).toEqual(2);
      expect(matches).toContain('@foouser');
      expect(matches).toContain('@baruser');
    });
  });

  describe('selectActualUsers', function() {
    it('takes an array of potential @-mentions and removes the non-users', function() {
      const mentions = ['@foouser', '@baruser', '@bazuser'];
      const users = UserMentions.selectActualUsers(mentions);
      expect(users.length).toEqual(2);
      expect(users).toContain('@foouser');
      expect(users).toContain('@baruser');
    });
  });

  describe('createMentionLinks', function() {
    it('takes an array of @-mentions and a string and creates profile links in the string', function() {
      const mentions = ['@foouser', '@baruser'];
      const text = 'Hey @foouser, @baruser, there is no @bazuser.';

      expect(UserMentions.createMentionLinks(mentions, text)).toEqual(
        'Hey <a href="?profile=foouser">@foouser</a>, <a ' +
          'href="?profile=baruser">@baruser</a>, there is no @bazuser.'
      );
    });
  });

  describe('processMentions', function() {
    it('takes a string and returns the string with user mention links added', function() {
      const text = 'Hey @foouser, @baruser, there is no @bazuser.';

      expect(UserMentions.processMentions(text)).toEqual(
        'Hey <a href="?profile=foouser">@foouser</a>, <a ' +
          'href="?profile=baruser">@baruser</a>, there is no @bazuser.'
      );
    });
  });
});
