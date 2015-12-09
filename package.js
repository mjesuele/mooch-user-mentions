/* global Package */

Package.describe({
  name: 'mooch:user-mentions',
  summary: 'Provide support for Slack-style user @-mentions',
  version: '0.1.0',
  git: 'https://github.com/mooch/meteor-user-mentions',
});

Package.onUse(function(api) {
  // Meteor releases below this version are not supported
  api.versionsFrom('1.2.0.1');

  // Core packages and 3rd party packages
  api.use([
    'ddp',
    'tracker',
    'ecmascript',
    'underscore',
    'react@0.14.1_1',
  ]);

  // Atmosphere packages
  api.use([
    'matteodem:easy-search@2.0.0',
  ]);

  // The files of this package
  api.addFiles('shared/index.js', ['client', 'server']);
  api.addFiles('shared/Suggestion.jsx', ['client', 'server']);
  api.addFiles('shared/Suggestions.jsx', ['client', 'server']);
  api.addFiles('shared/Input.jsx', ['client', 'server']);

  // The variables that become global for users of your package
  api.export('UserMentions', ['client', 'server']);
});

Package.onTest(function(api) {
  api.use(['accounts-password', 'ecmascript']);
  api.use(['sanjo:jasmine@0.20.2']);
  api.use('mooch:user-mentions');
  api.addFiles('tests/shared/index.js', ['client', 'server']);
});
